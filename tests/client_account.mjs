// Il banco del client degli account: la pagina vera, in un browser vero.
//
// docs/account-client-progetto.md §12 chiede diciotto gruppi di controlli,
// C-01…C-18, che guardano quello che una lettura del sorgente non vede:
// storage, rete, cookie, offline, due schede. Questo banco li esegue con
// Chrome headless (tests/browser.mjs), il sito servito da qui come lo serve
// l'host, e il server degli account vero (server/server.mjs) accanto.
//
// Uso: node tests/client_account.mjs  < {"prove":[{nome,pagina,gruppi}]}
// Stampa {nome: [{gruppo, nome, ok, extra}]}. La pagina sostituisce /app; il
// resto del sito e' quello di site/. Ogni pagina e' guidata come una pagina con
// il client: dal 30 settembre 2026 (P-40) non c'e' piu' il regime della pagina
// senza account, e una pagina senza client e' rossa in ogni gruppo.
//
// **Il contratto che la pagina deve rispettare** (§12 del progetto, «Il banco»
// e «Il resto dei controlli»), per esteso li'. In breve:
//  - gli agganci delle attivita' di oggi: [data-rotta-start], #r-text con il
//    testo del quesito com'e' nella banca (il campo `d`), #r-ans .ans una per
//    risposta, #r-verdict e .ans.ok sulla risposta esatta, #r-close, #r-fine.on
//    con il suo h1, [data-ciclo="risposte"] e [data-ciclo="ritorno"], #rivedi.on
//    con #rv-body; le porte [data-v], [data-modo], #start, [data-consegna],
//    #t-start con le .chip, #c-start, #c-input, #c-consegna, #c-fine, #s-start,
//    #sr-ans, #sr-next, #sr-fine;
//  - i testi e le etichette del progetto, cercati in
//    quello che si vede; le finestre modali con aria-modal, che si chiudono con
//    Esc; l'archivio dell'account `rg-account-<chiave_locale>`; e l'API in
//    locale su http://<stesso host>:8620 (account-progetto §7.4 e §16.3).
//
// Gruppi realizzati: C-01…C-17 (P-29, P-39, P-43). C-18, la ricerca dei testi,
// non ha bisogno di un browser e sta in tests/test_interfaccia.py. Che cosa
// ognuno non vede e' scritto nel §12 del progetto.

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avviaChrome } from './browser.mjs';
import * as E from '../site/engine.js';
import { avvia } from '../server/server.mjs';
import { aggiungiRighe, azzera as azzeraDb } from '../server/db.mjs';
import { copia as copiaDb, ripristina as ripristinaDb } from '../server/copie.mjs';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(RADICE, 'site');
export const PORTA_API = 8620;
const ESISTENTE = { email: 'gia@esempio.it', password: 'barca vela e vento' };
const ECONOMICO = { memory: 1024, passes: 1, parallelism: 1 };

// Quanto si aspetta, al massimo. Il banco aspetta **stati della pagina** — il
// pulsante abilitato, un quesito della banca con le sue risposte, il
// riepilogo, il service worker attivo —, e questi numeri sono solo le
// scadenze oltre le quali lo stato non e' arrivato: una pagina che funziona
// non le tocca. Misurato in locale il 26 settembre 2026: la palestra e' pronta
// in 0,3 s dal primo ingresso, il guscio in cache in meno di un secondo, e una
// reazione a un clic in millisecondi. Le scadenze stanno parecchie volte sopra,
// perche' una macchina carica non faccia un rosso falso; ogni rottura che le
// esaurisce costa quel tempo, ed e' il grosso della durata del banco.
const CARICO = 10000;
const REAZIONE = 5000;
const PARALLELE = 4;
// L'unica finestra a tempo che resta, e non si puo' togliere: C-02 controlla
// che una scrittura **non** avvenga, e un'assenza non ha un evento da
// aspettare. Dopo il riepilogo il banco rilegge lo storage da fuori per
// OSSERVAZIONE ms e si ferma alla prima scrittura trovata: una pagina giusta
// paga la finestra intera, una rotta no. Fino al 29 settembre era una pausa di
// 500 ms e poi una lettura sola; misurato quel giorno, la scrittura in Cache
// Storage di una rottura compare fino a 271 ms dopo il riepilogo senza carico
// e fino a 592 ms sotto carico (60 prove per condizione), e una volta su venti
// giri la rottura e' passata verde. Tre secondi sono cinque volte il peggio
// visto; una scrittura partita piu' tardi sfuggirebbe (§12, «Il banco»).
const OSSERVAZIONE = 3000;

// Le frasi del progetto, §4.1 e §5.2. Il controllo le cerca nel testo che si
// vede (innerText), non nel sorgente: una frase scritta e nascosta non avvisa.
const PRIMA = 'Senza account le risposte valgono solo finché questa pagina resta aperta.';
const DOPO = 'Vuoi conservare le attività di questa pagina?';
const PERDITA = 'chiudendo o ricaricando la pagina perdi le risposte';
const GIA = 'Questa email è già registrata.';
const SEG_PRIMA = 'Senza account anche i punteggi dei Segnali valgono solo per questa pagina.';

// La banca che il sito serve: il quesito in schermata si riconosce da qui.
// Per ogni testo, i numeri di risposte che un quesito con quel testo ha (tre
// «La brezza:» diversi, per esempio, ne hanno tre ciascuno).
const BANCA = (() => {
  const m = new Map();
  for (const it of JSON.parse(readFileSync(join(SITE, 'dati', 'quiz.json'), 'utf8'))) {
    const d = it.d.trim();
    if (!m.has(d)) m.set(d, new Set());
    m.get(d).add(it.r.length);
  }
  return m;
})();

// Gli esercizi del carteggio, per testo: la prova e «Che tecnica serve?» si
// riconoscono da qui, con la risposta ministeriale e le tecniche di ognuno.
const CARTEGGIO = new Map(JSON.parse(readFileSync(join(SITE, 'dati', 'carteggio.json'), 'utf8'))
  .map((e) => [e.testo.trim(), e]));
const spazi = (t) => String(t).replace(/\s+/g, ' ').trim();
// Le risposte del gioco dei Segnali: le schede del motore, non un elenco a mano.
const SEGNALI = [...new Set(E.SEGNALI.map((x) => x.o))];

const GUSCIO = (() => {
  const sw = readFileSync(join(SITE, 'sw.js'), 'utf8');
  const m = sw.match(/const GUSCIO = \[([\s\S]*?)\];/);
  // Le righe di commento hanno apostrofi («e'»): si tolgono prima di leggere.
  const senza = m[1].split('\n').filter((r) => !r.trim().startsWith('//')).join('\n');
  return new Set([...senza.matchAll(/'([^']+)'/g)].map((x) => x[1]));
})();

const TIPI = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.css': 'text/css' };

// --- il sito ------------------------------------------------------------------

function sito(corrente) {
  return createServer((req, res) => {
    // Spento, il sito non risponde: e' l'offline anche per il service worker,
    // che l'emulazione di rete della scheda non tocca (§12, «che cosa non copre»).
    if (corrente.spento) return req.socket.destroy();
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/app') {
      res.writeHead(200, { 'Content-Type': TIPI['.html'], 'Cache-Control': 'no-cache' });
      return res.end(corrente.pagina);
    }
    let f = normalize(join(SITE, p === '/' ? 'index.html' : p));
    if (!f.startsWith(SITE)) { res.writeHead(404); return res.end(); }
    if ((!existsSync(f) || statSync(f).isDirectory()) && existsSync(f + '.html')) f += '.html';
    if (!existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': TIPI[extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(readFileSync(f));
  });
}

// --- gli attrezzi nella pagina -------------------------------------------------

// Un elemento si vede se occupa spazio e non e' nascosto. Un testo nel DOM che
// non si vede non avvisa nessuno (AGENTS.md: leggere il DOM dimostra solo che
// il testo e' stato scritto).
const V = 'const V = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== "hidden";';
// Con una finestra modale aperta (aria-modal) quella e' l'unica superficie
// attiva: i pulsanti e i campi si cercano li' dentro, come li trova chi usa la
// pagina. Senza, un «Accedi» nell'intestazione e uno nel pannello del 409 sono
// indistinguibili per testo.
const M = 'const M = () => [...document.querySelectorAll(\'[aria-modal="true"]\')].find(V) || document;';
const js = (corpo) => `(() => { ${V} ${M} ${corpo} })()`;
const q = (s) => JSON.stringify(s);

const visibile = (sel) => js(`return [...document.querySelectorAll(${q(sel)})].some(V);`);
const testoVisibile = (frase) => js(`return document.body.innerText.includes(${q(frase)});`);
const testoRe = (re) => js(`const m = document.body.innerText.match(new RegExp(${q(re.source)})); return m ? m.slice(0) : null;`);
const pulsante = (testo) => js(`return [...M().querySelectorAll('button, a')].some((b) => V(b) && b.textContent.trim() === ${q(testo)});`);
const clicca = (tab, testo) => tab.valuta(js(`const b = [...M().querySelectorAll('button, a')].find((b) => V(b) && b.textContent.trim() === ${q(testo)}); if (b) b.click(); return !!b;`));
const campo = (etichetta) => `[...M().querySelectorAll('label')].filter((l) => V(l) && l.textContent.trim().startsWith(${q(etichetta)})).map((l) => l.control).find(Boolean)`;
const imposta = (tab, etichetta, valore) => tab.valuta(js(`const c = ${campo(etichetta)}; if (!c) return false;
  c.focus(); c.value = ${q(valore)}; c.dispatchEvent(new Event('input', { bubbles: true })); c.dispatchEvent(new Event('change', { bubbles: true })); return true;`));
// Il primo elemento **visibile** che combacia: la stessa porta puo' stare in
// piu' viste, e quella nascosta non si tocca.
const clic = (tab, sel) => tab.valuta(js(`const e = [...document.querySelectorAll(${q(sel)})].find(V); if (!e || e.disabled) return false; e.click(); return true;`));
const passwordVisibile = js(`return [...document.querySelectorAll('input[type=password]')].some(V);`);
const modaleVisibile = js(`return [...document.querySelectorAll('[aria-modal="true"], dialog[open]')].some(V);`);
const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));

const PRONTO = js(`const b = document.querySelector('[data-rotta-start]'); return V(b) && !b.disabled;`);
// Il quesito e' in schermata quando #r-text mostra il testo di un quesito della
// banca e sotto ci sono tante risposte visibili quante ne ha. Fino al 29
// settembre 2026 qui si chiedeva un testo di piu' di 10 caratteri: otto
// quesiti base su 1.472 sono piu' corti («I flaps:», «La tuga è:»), e la pagina
// di riferimento pesca a caso — cioe' un rosso falso nello 0,5 % degli avvii,
// una quarantina per giro. Era l'instabilita' di P-38 (§12, «Il banco»).
const QUESITO = js(`const t = document.querySelector('#r-text');
  return { testo: V(t) ? t.textContent.trim() : null, risposte: [...document.querySelectorAll('#r-ans .ans')].filter(V).length };`);
const quesitoDellaBanca = (x) => !!x && x.testo !== null && !!BANCA.get(x.testo)?.has(x.risposte);
const RIEPILOGO = js(`const f = document.querySelector('#r-fine.on'); return V(f) && V(f.querySelector('h1'));`);

/**
 * Il quesito in schermata, poi una risposta con il suo riscontro. Restituisce
 * il testo del quesito, o null. `sim`: nella simulazione non c'e' correzione
 * durante la prova (specifica §7.5), e la risposta fa avanzare la posizione.
 */
async function rispondiQuiz(tab, v, gruppo, prefisso, { sim = false } = {}) {
  const moduloPrima = await tab.valuta(passwordVisibile);
  const { ok: quesito, valore: visto } = await tab.attendiValore(QUESITO, quesitoDellaBanca, REAZIONE);
  const moduloDopo = await tab.valuta(passwordVisibile);
  v.push({ gruppo, nome: `${prefisso}il primo quesito compare senza account`, ok: quesito && !moduloPrima && !moduloDopo,
    extra: !quesito ? `Inizia non apre un quesito della banca con le sue risposte: in schermata ${JSON.stringify(visto)}`
      : 'un campo password e\' visibile prima del primo quesito' });
  if (!quesito) return null;
  const testo = visto.testo.slice(0, 40);
  // La pagina e' sorda agli input per 200 ms dopo ogni cambio di schermata
  // (specifica §7.5): si ritocca finche' la risposta non ha il suo effetto.
  // La sordita' non si vede da fuori, quindi qui si ripete il gesto e si
  // aspetta lo stato; un tocco in piu' dopo la risposta la pagina lo ignora.
  const pos = sim ? await tab.valuta(js(`return document.querySelector('#r-pos')?.textContent.trim() ?? null;`)) : null;
  const effetto = sim
    ? js(`return document.querySelector('#r-pos')?.textContent.trim() !== ${q(pos)} && !document.querySelector('#r-ans .ans.ok');`)
    : js(`return !!document.querySelector('#r-ans .ans.ok') && V(document.querySelector('#r-verdict'));`);
  let risposto = false;
  for (let i = 0; i < 20 && !risposto; i++) {
    await clic(tab, '#r-ans .ans');
    risposto = await tab.attendi(effetto, 250);
  }
  v.push({ gruppo, nome: sim ? `${prefisso}nessuna correzione durante la prova, e la risposta fa avanzare` : `${prefisso}la risposta ha il suo riscontro`, ok: risposto,
    extra: sim ? 'toccata una risposta, #r-pos non avanza o una risposta si accende come esatta' : 'toccata una risposta, nessuna si accende come esatta (.ans.ok)' });
  return risposto ? testo : null;
}

/** «Termina», e il riepilogo; nella simulazione passando dalla consegna. */
async function chiudiQuiz(tab, v, gruppo, prefisso, { sim = false } = {}) {
  await clic(tab, '#r-close');
  if (sim) {
    const consegna = await tab.attendi(visibile('[data-consegna="si"]'), REAZIONE);
    v.push({ gruppo, nome: `${prefisso}«Consegna la prova» chiede conferma in pagina`, ok: consegna, extra: 'nessun [data-consegna="si"] visibile dopo #r-close' });
    if (!consegna) return false;
    await clic(tab, '[data-consegna="si"]');
  }
  const riepilogo = await tab.attendi(RIEPILOGO, REAZIONE);
  v.push({ gruppo, nome: `${prefisso}fermata dopo una risposta, si apre il riepilogo`, ok: riepilogo,
    extra: '«Termina l\'attivita\'» non apre #r-fine con il suo titolo' });
  return riepilogo;
}

/** Dal primo ingresso a una risposta, poi «Termina»: il giro minimo. */
async function unaRisposta(tab, v, gruppo, prefisso = '') {
  const pronto = await tab.attendi(PRONTO, CARICO);
  v.push({ gruppo, nome: `${prefisso}la palestra si apre e la prima attivita' si puo' avviare`, ok: pronto,
    extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` + (tab.errori.length ? ': ' + tab.errori[0] : '') });
  if (!pronto) return null;
  await clic(tab, '[data-rotta-start]');
  const testo = await rispondiQuiz(tab, v, gruppo, prefisso);
  if (!testo) return null;
  return await chiudiQuiz(tab, v, gruppo, prefisso) ? testo : null;
}

async function revisione(tab, testo) {
  if (!await clic(tab, '[data-ciclo="risposte"]')) return false;
  return tab.attendi(js(`const r = document.querySelector('#rivedi'); return r.classList.contains('on') && V(document.querySelector('#rv-body')) && document.querySelector('#rv-body').textContent.includes(${q(testo)});`), REAZIONE);
}

// Pronto vuol dire: un service worker **attivo** — e' lui a servire la
// ricarica offline, e uno ancora in installazione la lascerebbe alla rete — e
// in cache quello che la pagina chiede. L'install scrive la cache prima di
// attivarsi, quindi la sola cache non basta; misurato il 29 settembre, 40 prove
// su 40 trovavano comunque il worker attivo o in attivazione, e la
// navigazione aspetta l'attivazione: e' lo stato giusto, non un rosso visto.
async function guscioPronto(tab) {
  return tab.attendi(`(async () => {
    const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
    if (!reg || !reg.active) return false;
    for (const k of await caches.keys()) {
      const c = await caches.open(k);
      if (await c.match('/app') && await c.match('/engine.js') && await c.match('/dati/quiz.json')) return true;
    }
    return false;
  })()`, CARICO);
}

// --- C-01: il primo quesito senza account, con la rete e senza ------------------

async function c01(b, ctx, v, parte) {
  const g = 'C-01';
  const vuole = (x) => !parte || parte === x;
  if (vuole('attivita')) {
    // Le altre attivita', ognuna fino al suo punto d'arrivo, senza account
    // (R-ACC-04): Quiz, simulazione, Carteggio, tecniche, Segnali.
    const a = await b.nuovoContesto();
    try { await attivita(await a.apri(ctx.sito + '/app'), v, g); } finally { await a.chiudi(); }
  }
  if (!vuole('percorso')) return;
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const testo = await unaRisposta(tab, v, g);
    if (testo) {
      v.push({ gruppo: g, nome: 'dal riepilogo la revisione mostra il quesito risposto', ok: await revisione(tab, testo),
        extra: '«Rivedi le risposte» non apre #rivedi con il quesito appena risposto' });
    }
  } finally { await c.chiudi(); }

  const d = await b.nuovoContesto();
  try {
    const tab = await d.apri(ctx.sito + '/app');
    const guscio = await guscioPronto(tab);
    v.push({ gruppo: g, nome: 'il guscio offline si carica alla prima visita', ok: guscio,
      extra: `dopo ${CARICO / 1000} s il service worker non ha in cache /app, /engine.js e /dati/quiz.json` });
    if (!guscio) return;
    await tab.offline(true);
    ctx.spegni(true);
    try {
      await tab.ricarica();
      const testo = await unaRisposta(tab, v, g, 'offline: ');
      if (testo) {
        v.push({ gruppo: g, nome: 'offline: la revisione del riepilogo', ok: await revisione(tab, testo),
          extra: 'senza rete il riepilogo non si rivede' });
      }
    } finally { ctx.spegni(false); }
  } finally { await d.chiudi(); }
}

// --- C-01, le altre attivita' ----------------------------------------------------
//
// Gli agganci sono quelli della pagina di oggi, che P-18 conserva (§12, «Il
// contratto»): le porte `[data-v]`, `[data-modo]` e `#start` dei Quiz, la
// conferma `[data-consegna]` della simulazione, `#t-start` con le `.chip` e
// `#r-next` delle tecniche, `#c-start`, `#c-input`, `#c-consegna` e `#c-fine`
// della prova di carteggio, `#s-start`, `#sr-ans`, `#sr-next` e `#sr-fine` dei
// Segnali. Ogni esercizio e ogni scheda si riconoscono dalla banca, non dalla
// forma del testo (§12, «Il banco stabile»).

async function giroQuiz(tab, v, g, prefisso, modo) {
  const sim = modo === 'sim';
  const porta = await clic(tab, '[data-v="quiz"]') && await tab.attendi(visibile(`[data-modo="${modo}"]`), REAZIONE)
    && await clic(tab, `[data-modo="${modo}"]`) && await tab.attendi(js(`const b = document.querySelector('#start'); return V(b) && !b.disabled;`), REAZIONE);
  v.push({ gruppo: g, nome: `${prefisso}la porta dei Quiz apre la configurazione con Inizia`, ok: porta,
    extra: `[data-v="quiz"], [data-modo="${modo}"] o #start abilitato non si trovano` });
  if (!porta) return;
  await clic(tab, '#start');
  const testo = await rispondiQuiz(tab, v, g, prefisso, { sim });
  if (!testo || !await chiudiQuiz(tab, v, g, prefisso, { sim })) return;
  v.push({ gruppo: g, nome: `${prefisso}la revisione mostra il quesito risposto`, ok: await revisione(tab, testo),
    extra: '«Rivedi le risposte» non apre #rivedi con il quesito risposto' });
  await clic(tab, '#rv-close');
  // Dal riepilogo si esce dalla sua porta, come nella pagina di oggi.
  await clic(tab, '[data-ciclo="ritorno"]');
  await tab.attendi(js(`return !V(document.querySelector('#r-fine'));`), REAZIONE);
}

async function giroTecniche(tab, v, g) {
  const p = 'Che tecnica serve?: ';
  const porta = await clic(tab, '[data-v="cart"]') && await tab.attendi(visibile('[data-v="tec"]'), REAZIONE)
    && await clic(tab, '[data-v="tec"]') && await tab.attendi(visibile('#t-start'), REAZIONE);
  v.push({ gruppo: g, nome: `${p}ci si arriva dal Carteggio`, ok: porta, extra: 'dal Carteggio nessun [data-v="tec"] porta a #t-start' });
  if (!porta) return;
  const prima = await tab.valuta(passwordVisibile);
  await clic(tab, '#t-start');
  const { ok, valore } = await tab.attendiValore(js(`const t = document.querySelector('#r-text');
    return { testo: V(t) ? t.textContent.trim() : null, chip: [...document.querySelectorAll('#r-ans .chip')].filter(V).length };`),
  (x) => !!x && CARTEGGIO.has(x.testo) && x.chip >= 2, REAZIONE);
  v.push({ gruppo: g, nome: `${p}si apre un esercizio del carteggio, con le tecniche da scegliere, senza account`, ok: ok && !prima && !await tab.valuta(passwordVisibile),
    extra: ok ? 'un campo password e\' visibile' : `in schermata ${JSON.stringify(valore)}` });
  if (!ok) return;
  const servono = CARTEGGIO.get(valore.testo).tecniche;
  await clic(tab, '#r-ans .chip');
  let corretto = false;
  for (let i = 0; i < 20 && !corretto; i++) {
    await clic(tab, '#r-next');
    corretto = await tab.attendi(js(`const t = document.querySelector('#r-verdict').innerText; return ${q(servono)}.every((x) => t.includes(x));`), 250);
  }
  v.push({ gruppo: g, nome: `${p}la correzione dice le tecniche che l'esercizio chiede`, ok: corretto,
    extra: `#r-verdict non nomina ${servono.join(' + ')} dopo #r-next` });
  await clic(tab, '#r-close');
}

async function giroCarteggio(tab, v, g) {
  const p = 'Carteggio: ';
  const porta = await clic(tab, '[data-v="cart"]') && await tab.attendi(visibile('#c-start'), REAZIONE);
  v.push({ gruppo: g, nome: `${p}la prova si avvia dalla sua porta`, ok: porta, extra: 'nessun #c-start visibile nel Carteggio' });
  if (!porta) return;
  const prima = await tab.valuta(passwordVisibile);
  await clic(tab, '#c-start');
  const { ok, valore } = await tab.attendiValore(js(`const t = document.querySelector('#c-testo'); return V(t) ? t.textContent.trim() : null;`),
    (x) => CARTEGGIO.has(x), REAZIONE);
  v.push({ gruppo: g, nome: `${p}si apre un esercizio della banca, senza account`, ok: ok && !prima && !await tab.valuta(passwordVisibile),
    extra: ok ? 'un campo password e\' visibile' : `in #c-testo ${JSON.stringify(valore && valore.slice(0, 60))}` });
  if (!ok) return;
  const mia = 'Lat.42°49,9N Long.010°02,3E';
  await tab.valuta(js(`const i = document.querySelector('#c-input'); i.value = ${q(mia)}; i.dispatchEvent(new Event('input', { bubbles: true })); return true;`));
  // La consegna e' a due tocchi, in pagina (specifica §7.6).
  let fine = false;
  for (let i = 0; i < 3 && !fine; i++) {
    await clic(tab, '#c-consegna');
    fine = await tab.attendi(visibile('#c-fine'), 400);
  }
  const ufficiale = spazi(CARTEGGIO.get(valore).risposta_ufficiale);
  const accanto = fine && await tab.valuta(js(`const t = document.querySelector('#c-fine').innerText.replace(/\\s+/g, ' ');
    return t.includes(${q(mia)}) && t.includes(${q(ufficiale)});`));
  v.push({ gruppo: g, nome: `${p}la consegna mette la tua risposta accanto a quella ministeriale`, ok: !!accanto,
    extra: fine ? `#c-fine non porta «${mia}» e «${ufficiale}»` : 'dopo #c-consegna la correzione #c-fine non si vede' });
}

/** Una partita dei Segnali fino in fondo: restituisce se ci e' arrivata. */
async function partitaSegnali(tab, v, g, p) {
  // La porta dei Segnali sta nel Percorso, fra gli extra (specifica §6.1).
  await clic(tab, '[data-v="oggi"]');
  const porta = await clic(tab, '[data-v="seg"]') && await tab.attendi(visibile('#s-start'), REAZIONE);
  v.push({ gruppo: g, nome: `${p}il gioco si avvia dalla sua porta`, ok: porta, extra: 'dal Percorso nessun [data-v="seg"] porta a #s-start' });
  if (!porta) return false;
  await clic(tab, '#s-start');
  const scheda = js(`return [...document.querySelectorAll('#sr-ans button')].filter(V).map((b) => b.textContent.trim());`);
  const { ok, valore } = await tab.attendiValore(scheda, (x) => Array.isArray(x) && x.length >= 2 && x.every((t) => SEGNALI.some((o) => t.endsWith(o))), REAZIONE);
  v.push({ gruppo: g, nome: `${p}si apre una scheda del gioco, con le risposte del motore`, ok, extra: `in #sr-ans ${JSON.stringify(valore)}` });
  if (!ok) return false;
  for (let i = 0; i < 40; i++) {
    const stato = await tab.valuta(js(`return { fine: V(document.querySelector('#sr-fine')), avanti: V(document.querySelector('#sr-next')) };`));
    if (stato.fine) break;
    if (stato.avanti) { await clic(tab, '#sr-next'); await tab.attendi(js(`return !V(document.querySelector('#sr-next'));`), REAZIONE); continue; }
    await clic(tab, '#sr-ans button');
    await tab.attendi(js(`return V(document.querySelector('#sr-next')) || V(document.querySelector('#sr-fine'));`), 250);
  }
  const fine = await tab.attendi(js(`const f = document.querySelector('#sr-fine'); return V(f) && /\\d+\\s*\\/\\s*\\d+/.test(f.innerText);`), REAZIONE);
  v.push({ gruppo: g, nome: `${p}la partita arriva in fondo e dice il punteggio`, ok: fine, extra: '#sr-fine non si vede, o non porta un punteggio «n / N»' });
  return fine;
}

async function attivita(tab, v, g) {
  const pronto = await tab.attendi(PRONTO, CARICO);
  v.push({ gruppo: g, nome: 'le altre attivita\': la palestra si apre', ok: pronto, extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` });
  if (!pronto) return;
  await giroQuiz(tab, v, g, 'Quiz per argomento: ', 'argomento');
  await giroQuiz(tab, v, g, 'Simulazione: ', 'sim');
  await giroTecniche(tab, v, g);
  await giroCarteggio(tab, v, g);
  await partitaSegnali(tab, v, g, 'Segnali: ');
  v.push({ gruppo: g, nome: 'in nessuna attivita\' si apre un modulo d\'account', ok: !await tab.valuta(passwordVisibile), extra: 'alla fine del giro un campo password e\' visibile' });
}

// --- C-02: senza account non resta niente, e lo si dice -------------------------

function personale(cons, api) {
  const out = [];
  if (cons.idb.length) out.push('IndexedDB: ' + cons.idb.join(', '));
  if (cons.local.length) out.push('localStorage: ' + cons.local.map((e) => e[0]).join(', '));
  if (cons.session.length) out.push('sessionStorage: ' + cons.session.map((e) => e[0]).join(', '));
  if (cons.cookie.length) out.push('cookie: ' + cons.cookie.map((c) => c.nome).join(', '));
  for (const [nome, voci] of Object.entries(cons.cache)) {
    const estranee = voci.filter((u) => { const x = new URL(u); return x.origin === api || !(GUSCIO.has(x.pathname) || x.pathname.startsWith('/figure/')); });
    if (estranee.length) out.push(`Cache Storage «${nome}»: ${estranee.join(', ')}`);
  }
  return out;
}

async function c02(b, ctx, v) {
  const g = 'C-02';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const pronto = await tab.attendi(PRONTO, CARICO);
    const prima = pronto && await tab.valuta(testoVisibile(PRIMA));
    v.push({ gruppo: g, nome: 'prima di cominciare la pagina dice che senza account non resta niente', ok: prima,
      extra: `la frase del §4.1 «${PRIMA}» non si vede accanto all'avvio` });
    // I Segnali prima dell'attivita': la finestra d'osservazione dopo il
    // riepilogo copre anche una scrittura dei loro punteggi.
    if (await partitaSegnali(tab, v, g, 'Segnali: ')) {
      v.push({ gruppo: g, nome: 'i Segnali dicono che senza account i punteggi valgono per questa pagina', ok: await tab.valuta(testoVisibile(SEG_PRIMA)),
        extra: `la frase del §4.1 «${SEG_PRIMA}» non si vede` });
      await clic(tab, '[data-v="oggi"]');
      await tab.attendi(PRONTO, REAZIONE);
    }
    // Le preferenze che la pagina di oggi conserva: la data d'esame e l'auto.
    await tab.valuta(js(`const d = document.querySelector('#esame-data'); if (d) { d.value = '2026-12-01'; d.dispatchEvent(new Event('change', { bubbles: true })); } return true;`));
    const testo = await unaRisposta(tab, v, g);
    if (!testo) return;
    const dopo = await tab.valuta(testoVisibile(DOPO)) && await tab.valuta(js(`return document.querySelector('#r-fine').innerText.includes(${q(PERDITA)});`));
    v.push({ gruppo: g, nome: 'alla fine dell\'attivita\' la pagina dice che cosa si perde', ok: dopo,
      extra: `il riepilogo non porta «${DOPO}» con «${PERDITA}» (§4.1)` });
    // Una scrittura puo' partire dopo il riepilogo, e finire dopo: si guarda
    // per tutta la finestra, non una volta sola.
    let trovato = [];
    for (const fine = Date.now() + OSSERVAZIONE; !trovato.length && Date.now() < fine;) {
      trovato = personale(await c.conservato(ctx.sito, tab), ctx.api);
      if (!trovato.length) await new Promise((ok) => setTimeout(ok, 50));
    }
    v.push({ gruppo: g, nome: 'nessuna scrittura personale nel browser: IndexedDB, localStorage, sessionStorage, cookie, Cache Storage', ok: !trovato.length,
      extra: 'trovato ' + trovato.join(' · ') });
    const inviate = tab.richieste.filter((r) => r.url.startsWith(ctx.api));
    v.push({ gruppo: g, nome: 'nessuna richiesta all\'API senza account', ok: !inviate.length,
      extra: 'inviate: ' + inviate.map((r) => `${r.metodo} ${r.url}`).join(', ') });
    await tab.ricarica();
    // Una pagina che non si ricarica non mostra niente, e «niente di prima»
    // passerebbe per vero: prima si aspetta che sia di nuovo pronta.
    const ripronta = await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'dopo la ricarica la palestra torna pronta', ok: ripronta,
      extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s dalla ricarica` });
    if (!ripronta) return;
    const vuota = await tab.valuta(js(`const s = document.querySelector('#rotta-last'); const d = document.querySelector('#esame-data');
      return !(s && !s.hidden && V(s)) && !(d && d.value) && !document.body.innerText.includes(${q(testo)});`));
    v.push({ gruppo: g, nome: 'dopo la ricarica non restano risposte, data ne\' preferenze', ok: vuota,
      extra: 'dopo la ricarica la pagina mostra ancora l\'ultima attivita\', la data d\'esame o il quesito risposto' });
    const dopoRicarica = personale(await c.conservato(ctx.sito, tab), ctx.api);
    v.push({ gruppo: g, nome: 'e dopo la ricarica il browser e\' ancora senza dati personali', ok: !dopoRicarica.length,
      extra: 'trovato ' + dopoRicarica.join(' · ') });
  } finally { await c.chiudi(); }
}

// --- C-05: l'email gia' registrata ------------------------------------------------

async function c05(b, ctx, v) {
  const g = 'C-05';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const testo = await unaRisposta(tab, v, g);
    if (!testo) return;
    const invito = await clicca(tab, 'Crea un account e salva');
    const modulo = invito && await tab.attendi(js(`const e = ${campo('Email')}, p = ${campo('Password')}; return V(e) && V(p) && e.type === 'email' && p.type === 'password';`), REAZIONE);
    v.push({ gruppo: g, nome: 'dal riepilogo si apre il modulo, con le etichette Email e Password', ok: modulo,
      extra: invito ? 'nessun campo etichettato «Email» e «Password» (§4.2)' : 'nel riepilogo non c\'e\' «Crea un account e salva» (§4.1)' });
    if (!modulo) return;
    const mail = ctx.mail.length;
    const sessioni = ctx.sessioni();
    await imposta(tab, 'Email', ESISTENTE.email);
    await imposta(tab, 'Password', 'rotta sicura per il porto');
    await clicca(tab, 'Crea l\'account e salva');
    const detto = await tab.attendi(testoVisibile(GIA), REAZIONE);
    const chiesto = tab.richieste.some((r) => r.metodo === 'POST' && r.url === `${ctx.api}/v1/registrazione`);
    v.push({ gruppo: g, nome: 'con un\'email iscritta la pagina dice «Questa email e\' gia\' registrata.» dal 409 del server', ok: detto && chiesto,
      extra: !chiesto ? 'nessuna POST a /v1/registrazione: il messaggio non viene dal server' : `la frase del §5.2 non si vede` });
    v.push({ gruppo: g, nome: 'e offre le due porte, Accedi e Reimposta la password', ok: await tab.valuta(pulsante('Accedi')) && await tab.valuta(pulsante('Reimposta la password')),
      extra: 'manca «Accedi» o «Reimposta la password» (§5.2)' });
    const cons = await c.conservato(ctx.sito, tab);
    v.push({ gruppo: g, nome: 'nessuna sessione: zero cookie nel browser e zero sessioni nuove sul server', ok: !cons.cookie.length && ctx.sessioni() === sessioni,
      extra: `cookie ${cons.cookie.map((x) => x.nome).join(', ') || 'nessuno'}, sessioni sul server ${sessioni} → ${ctx.sessioni()}` });
    v.push({ gruppo: g, nome: 'nessuna mail nuova', ok: ctx.mail.length === mail, extra: `${ctx.mail.length - mail} mail spedite` });
    const accedi = await clicca(tab, 'Accedi');
    const precompilato = accedi && await tab.attendi(js(`const e = ${campo('Email')}, p = ${campo('Password')}; return V(e) && e.value.trim().toLowerCase() === ${q(ESISTENTE.email)} && V(p) && p.value === '';`), REAZIONE);
    v.push({ gruppo: g, nome: 'Accedi ha l\'email gia\' scritta e la password vuota', ok: precompilato,
      extra: 'il modulo di accesso non ha l\'email, o ha ricevuto la password dal modulo di registrazione (§5.2)' });
    await clicca(tab, 'Torna all\'attività');
    const riepilogo = await tab.attendi(RIEPILOGO, REAZIONE);
    v.push({ gruppo: g, nome: 'le risposte della pagina sono intatte: il riepilogo si rivede', ok: riepilogo && await revisione(tab, testo),
      extra: 'dopo il 409 il riepilogo o la sua revisione non ci sono piu\'' });
  } finally { await c.chiudi(); }

  // Il caso si riconosce da codice **e** `errore`, non dal testo (§5.2): un
  // 409 di un altro genere non parla di email, e un testo del server cambiato
  // non spegne la frase della pagina.
  const d = await b.nuovoContesto();
  try {
    const tab = await d.apri(ctx.sito + '/app');
    const finti = [
      { errore: 'altro', messaggio: 'Conflitto: la richiesta non si puo\' completare.' },
      { errore: 'email_registrata', messaggio: 'Indirizzo in uso.' },
    ];
    let n = 0;
    await tab.intercetta(`${ctx.api}/v1/registrazione`, (r) => (r.method === 'POST'
      ? { codice: 409, corpo: JSON.stringify(finti[Math.min(n++, 1)]),
          intestazioni: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ctx.sito, 'Access-Control-Allow-Credentials': 'true' } }
      : null));
    // Il giro fino al riepilogo e' gia' controllato sopra: qui se non arriva in
    // fondo lo si dice, invece di saltare in silenzio i due controlli dei 409.
    const giro = [];
    if (!await unaRisposta(tab, giro, g)) {
      const perche = giro.filter((x) => !x.ok).map((x) => x.extra).join('; ');
      v.push({ gruppo: g, nome: 'i 409 finti: il giro arriva al riepilogo', ok: false, extra: perche });
      return;
    }
    await clicca(tab, 'Crea un account e salva');
    await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE);
    await imposta(tab, 'Email', 'nuova@esempio.it');
    await imposta(tab, 'Password', 'rotta sicura per il porto');
    await clicca(tab, 'Crea l\'account e salva');
    for (let t = 0; n < 1 && t < REAZIONE / 50; t++) await new Promise((ok) => setTimeout(ok, 50));
    await tab.attendi(js(`return !document.body.innerText.includes('Creazione dell\\'account in corso');`), REAZIONE);
    const altro = await tab.valuta(testoVisibile(GIA));
    v.push({ gruppo: g, nome: 'un 409 che non e\' email_registrata non parla di email', ok: n >= 1 && !altro,
      extra: n < 1 ? 'la pagina non ha inviato la registrazione' : 'un 409 con errore «altro» mostra «Questa email e\' gia\' registrata.»: il caso si riconosce da codice e errore' });
    await clicca(tab, 'Crea l\'account e salva');
    for (let t = 0; n < 2 && t < REAZIONE / 50; t++) await new Promise((ok) => setTimeout(ok, 50));
    const detto = await tab.attendi(testoVisibile(GIA), REAZIONE);
    v.push({ gruppo: g, nome: 'la frase e\' della pagina: un messaggio del server diverso non la cambia', ok: n >= 2 && detto,
      extra: 'con errore email_registrata e un messaggio diverso la pagina non dice la frase del §5.2: la riconosce dal testo' });
  } finally { await d.chiudi(); }
}

// --- gli attrezzi degli account ------------------------------------------------------

const PASSWORD = 'rotta sicura per il porto di casa';
let serie = 0;
const SALVATE = /(\d+) rispost[ae] salvat[ae] nel tuo account/;
const NON_ANCORA = 'Non chiudere la pagina: le risposte non sono ancora salvate nel tuo account.';

/** Un account nuovo, creato dal banco sul server vero: come se si fosse registrato altrove. */
async function nuovoAccount(ctx, prefisso) {
  const email = `${prefisso}-${++serie}@esempio.it`;
  const r = await fetch(`${ctx.apiInterno}/v1/registrazione`, { method: 'POST',
    headers: { origin: ctx.sito, 'content-type': 'application/json' }, body: JSON.stringify({ email, password: PASSWORD }) });
  if (r.status !== 201) throw new Error(`l'account ${email} non si crea: ${r.status}`);
  return { email, password: PASSWORD, chiave: ctx.conto(email).chiave_locale };
}

/** Dal riepilogo al Percorso, con l'uscita che la pagina di oggi ha gia' (`[data-ciclo="ritorno"]`). */
async function alPercorso(tab) {
  await clic(tab, '[data-ciclo="ritorno"]');
  await clic(tab, '[data-v="oggi"]');
  return tab.attendi(PRONTO, REAZIONE);
}

/** Una nuova attivita' dal Percorso, fino a una risposta; senza riepilogo. */
async function unaDalPercorso(tab, g) {
  if (!await alPercorso(tab) || !await clic(tab, '[data-rotta-start]')) return null;
  return rispondiQuiz(tab, [], g, '');
}

/** I pannelli si chiudono con Esc (§12, collaudo): il tasto va a chi ha il fuoco. */
const esc = (tab) => tab.valuta(`(document.activeElement || document.body).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); true`);

/** Accedi dall'intestazione (§3.2): «Accedi», poi il modulo. */
async function entraCome(tab, conto) {
  if (!await clicca(tab, 'Accedi')) return false;
  if (!await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE)) return false;
  await imposta(tab, 'Email', conto.email);
  await imposta(tab, 'Password', conto.password);
  return clicca(tab, 'Accedi');
}

/** Aspetta che una funzione del banco sia vera, per al piu' `ms`. */
async function finche(prova, ms) {
  for (const fine = Date.now() + ms; Date.now() < fine;) {
    if (await prova()) return true;
    await pausa(50);
  }
  return !!await prova();
}

/** Un'assenza non ha un evento: la si guarda per tutta la finestra (§12, «Il banco stabile»). */
async function maiPer(prova, ms = OSSERVAZIONE) {
  for (const fine = Date.now() + ms; Date.now() < fine;) {
    if (await prova()) return false;
    await pausa(50);
  }
  return !await prova();
}

/** Una richiesta trattenuta: il banco la lascia andare quando vuole. */
function trattenuta() {
  let lascia, arrivata;
  const via = new Promise((r) => { lascia = r; });
  const presa = new Promise((r) => { arrivata = r; });
  let n = 0;
  return {
    get quante() { return n; },
    presa, lascia,
    // La prima POST resta ferma finche' il banco non la lascia; le altre passano.
    gestore: async (r) => { if (r.method !== 'POST' || n++) return null; arrivata(); await via; return null; },
  };
}

const richiesteA = (tab, metodo, percorso) => tab.richieste.filter((r) => r.metodo === metodo && new URL(r.url).pathname === percorso);

// --- C-03: le viste, e l'invito solo nei riepiloghi ---------------------------------

const VISTE = ['oggi', 'quiz', 'cart', 'diag', 'seg', 'info'];
const PORTA_PROGRESSI = 'I Progressi descrivono le attività salvate nel tuo account.';
// Il cruscotto di oggi: se uno di questi si vede senza account, Progressi e'
// una vista di zeri costruita dallo storico temporaneo (§3.2).
const CRUSCOTTO = ['#d-temi', '#d-voci', '#d-cons', '#sessioni'];

async function c03(b, ctx, v) {
  const g = 'C-03';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await tab.attendi(PRONTO, CARICO)) {
      v.push({ gruppo: g, nome: 'la palestra si apre', ok: false, extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` });
      return;
    }
    const mute = [], invadenti = [];
    // Ogni vista dal Percorso, che ha una porta verso ognuna (specifica §5.2).
    for (const x of VISTE) {
      await clic(tab, '[data-v="oggi"]');
      if (!await clic(tab, `[data-v="${x}"]`) || !await tab.attendi(visibile(`#v-${x}`), REAZIONE)) { mute.push(x); continue; }
      if (await tab.valuta(passwordVisibile) || await tab.valuta(pulsante('Crea un account e salva')) || await tab.valuta(modaleVisibile)) invadenti.push(x);
    }
    v.push({ gruppo: g, nome: 'ogni vista si apre dal Percorso', ok: !mute.length, extra: 'non si aprono: ' + mute.join(', ') });
    v.push({ gruppo: g, nome: 'in nessuna vista un invito, un modulo o una finestra d\'account', ok: !invadenti.length, extra: 'invito, campo password o finestra modale in: ' + invadenti.join(', ') });
    await clic(tab, '[data-v="diag"]');
    const cruscotto = await tab.valuta(js(`return ${q(CRUSCOTTO)}.filter((s) => V(document.querySelector(s)));`));
    v.push({ gruppo: g, nome: 'senza account Progressi dice perche\' non c\'e\', con Vai al Percorso e Accedi, senza un cruscotto',
      ok: await tab.valuta(testoVisibile(PORTA_PROGRESSI)) && await tab.valuta(pulsante('Vai al Percorso')) && await tab.valuta(pulsante('Accedi')) && !cruscotto.length,
      extra: cruscotto.length ? 'si vede il cruscotto: ' + cruscotto.join(', ') : `manca «${PORTA_PROGRESSI}», «Vai al Percorso» o «Accedi» (§3.2)` });
    await clic(tab, '[data-v="oggi"]');
    if (!await unaRisposta(tab, v, g)) return;
    v.push({ gruppo: g, nome: 'l\'invito e\' nel riepilogo', ok: await tab.valuta(testoVisibile(DOPO)) && await tab.valuta(pulsante('Continua senza account')),
      extra: `il riepilogo non porta «${DOPO}» con «Continua senza account» (§4.1)` });
    await clicca(tab, 'Continua senza account');
    const via = await tab.attendi(js(`return !document.body.innerText.includes(${q(DOPO)});`), REAZIONE);
    v.push({ gruppo: g, nome: '«Continua senza account» lo chiude senza chiedere altro', ok: via && !await tab.valuta(modaleVisibile),
      extra: via ? 'dopo «Continua senza account» si apre una finestra' : 'l\'invito resta dopo «Continua senza account»' });
    await clic(tab, '[data-v="oggi"]');
    if (!await tab.attendi(PRONTO, REAZIONE)) return;
    await clic(tab, '[data-rotta-start]');
    const giro = [];
    if (!await rispondiQuiz(tab, giro, g, 'attivita\' dopo: ')) {
      v.push({ gruppo: g, nome: 'la seconda attivita\' si avvia', ok: false, extra: giro.filter((x) => !x.ok).map((x) => x.extra).join('; ') });
      return;
    }
    v.push({ gruppo: g, nome: 'durante l\'attivita\' dopo, l\'invito non torna', ok: !await tab.valuta(testoVisibile(DOPO)) && !await tab.valuta(modaleVisibile),
      extra: 'con un quesito in schermata si vede l\'invito o una finestra' });
    if (!await chiudiQuiz(tab, giro, g, 'attivita\' dopo: ')) return;
    v.push({ gruppo: g, nome: 'e torna nel riepilogo di quell\'attivita\'', ok: await tab.valuta(testoVisibile(DOPO)), extra: 'il secondo riepilogo non ha l\'invito' });
  } finally { await c.chiudi(); }
}

// --- C-04: registrarsi dopo piu' attivita' ------------------------------------------

async function c04(b, ctx, v, parte) {
  const g = 'C-04';
  const vuole = (x) => !parte || parte === x;
  if (vuole('registrazione')) await c04registrazione(b, ctx, v, g);
  if (vuole('persa')) await c04persa(b, ctx, v, g);
}

async function c04registrazione(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    // La risposta all'invio resta ferma: il server ha gia' le righe, la pagina
    // non lo sa ancora. E' il momento in cui «salvate» sarebbe una bugia.
    const t = trattenuta();
    await tab.intercetta(`${ctx.api}/v1/righe*`, t.gestore, { fase: 'Response' });
    if (!await unaRisposta(tab, v, g, 'prima attivita\': ')) return;
    await alPercorso(tab);
    if (!await unaRisposta(tab, v, g, 'seconda attivita\': ')) return;
    const email = `c04-${++serie}@esempio.it`;
    await clicca(tab, 'Crea un account e salva');
    if (!await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE)) {
      v.push({ gruppo: g, nome: 'dal riepilogo si apre il modulo', ok: false, extra: 'nessun campo Email' });
      return;
    }
    await imposta(tab, 'Email', email);
    await imposta(tab, 'Password', PASSWORD);
    // Due clic nello stesso istante: un doppio tocco.
    await tab.valuta(js(`const b = [...M().querySelectorAll('button')].find((b) => V(b) && b.textContent.trim() === ${q("Crea l'account e salva")}); b.click(); b.click(); return true;`));
    const partito = await Promise.race([t.presa.then(() => true), pausa(REAZIONE + 1000).then(() => false)]);
    v.push({ gruppo: g, nome: 'doppio clic: una registrazione sola', ok: richiesteA(tab, 'POST', '/v1/registrazione').length === 1,
      extra: `${richiesteA(tab, 'POST', '/v1/registrazione').length} POST /v1/registrazione` });
    v.push({ gruppo: g, nome: 'dopo la registrazione le righe della pagina partono', ok: partito, extra: 'nessuna POST /v1/righe dopo la registrazione' });
    if (!partito) return;
    // Il server ha le righe, la risposta e' ferma: la pagina non deve dire
    // «salvate» ne' passare alla data d'esame, e deve dire di non chiudere.
    let avvisato = false;
    const zitta = await maiPer(async () => {
      if (await tab.valuta(testoVisibile(NON_ANCORA))) avvisato = true;
      return await tab.valuta(testoRe(SALVATE)) || await tab.valuta(testoVisibile('Hai una data d\'esame?'));
    });
    v.push({ gruppo: g, nome: 'finche\' il server non ha risposto, niente «salvate» e niente data d\'esame', ok: zitta,
      extra: 'con la risposta dell\'invio ancora ferma la pagina dice «salvate» o chiede la data: il successo non viene dagli uid confermati' });
    v.push({ gruppo: g, nome: 'e dice di non chiudere la pagina', ok: avvisato, extra: `«${NON_ANCORA}» non si vede mentre l'invio e' in volo (§4.3)` });
    t.lascia();
    const { ok: detto, valore } = await tab.attendiValore(testoRe(SALVATE), Boolean, REAZIONE + 1000);
    const sulServer = ctx.righeDi(email);
    v.push({ gruppo: g, nome: 'le risposte di tutte e due le attivita\' salvate, e il numero e\' quello del server', ok: detto && Number(valore[1]) === 2 && sulServer === 2,
      extra: detto ? `la pagina dice ${valore[0]}, il server ha ${sulServer} righe, le risposte date erano 2` : `«N risposte salvate nel tuo account» non compare; il server ha ${sulServer} righe` });
    const data = await tab.attendi(testoVisibile('Hai una data d\'esame?'), REAZIONE);
    v.push({ gruppo: g, nome: 'poi la data d\'esame, facoltativa', ok: data && await tab.valuta(pulsante('Continua senza data')),
      extra: '«Hai una data d\'esame?» con «Continua senza data» non compare dopo il salvataggio (§11.1)' });
  } finally { await c.chiudi(); }
}

async function c04persa(b, ctx, v, g) {
  // La risposta alla registrazione si perde dopo che il server ha creato
  // l'account: misurato il 29 settembre, il cookie arriva lo stesso. La pagina
  // deve chiedere al server (GET /v1/io) prima di ripetere (§4.3).
  const d = await b.nuovoContesto();
  try {
    const tab = await d.apri(ctx.sito + '/app');
    let perse = 0;
    await tab.intercetta(`${ctx.api}/v1/registrazione`, (r) => (r.method === 'POST' && !perse++ ? { fallisci: 'ConnectionReset' } : null), { fase: 'Response' });
    if (!await unaRisposta(tab, v, g, 'risposta persa: ')) return;
    const email = `c04-persa-${++serie}@esempio.it`;
    await clicca(tab, 'Crea un account e salva');
    await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE);
    await imposta(tab, 'Email', email);
    await imposta(tab, 'Password', PASSWORD);
    await clicca(tab, 'Crea l\'account e salva');
    const esito = await tab.attendiValore(js(`const t = document.body.innerText; return t.match(new RegExp(${q(SALVATE.source)})) ? 'salvate' : t.includes('Non sappiamo se l\\'account è stato creato') ? 'non sappiamo' : null;`), Boolean, REAZIONE + 2000);
    const reg = richiesteA(tab, 'POST', '/v1/registrazione').length;
    const io = tab.richieste.findIndex((r) => r.metodo === 'GET' && new URL(r.url).pathname === '/v1/io');
    v.push({ gruppo: g, nome: 'risposta persa: la pagina chiede al server prima di ripetere, e non ripete', ok: perse >= 1 && io >= 0 && reg === 1,
      extra: perse < 1 ? 'la registrazione non e\' partita' : `GET /v1/io ${io >= 0 ? 'chiesto' : 'mai chiesto'}, ${reg} POST /v1/registrazione` });
    v.push({ gruppo: g, nome: 'e con l\'account gia\' creato le risposte si salvano', ok: esito.valore === 'salvate' && ctx.righeDi(email) === 1,
      extra: `la pagina: ${esito.valore || 'niente'}; il server ha ${ctx.righeDi(email)} righe per l'account creato` });
  } finally { await d.chiudi(); }
}

// --- C-06: accedere su un dispositivo condiviso ---------------------------------------

const DOMANDA = 'Vuoi portare nel tuo account';

async function c06(b, ctx, v, parte) {
  const g = 'C-06';
  const vuole = (x) => !parte || parte === x;
  const A = await nuovoAccount(ctx, 'c06a'), B = await nuovoAccount(ctx, 'c06b');
  if (vuole('scelta')) await c06scelta(b, ctx, v, g, A);
  if (vuole('corsa')) await c06corsa(b, ctx, v, g, A, B);
  if (vuole('congelata')) await c06congelata(b, ctx, v, g, A, B);
}

async function c06scelta(b, ctx, v, g, A) {
  // Le risposte di prova entrano solo con un si' esplicito (§5.1).
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await unaRisposta(tab, v, g, 'prova: ')) return;
    await entraCome(tab, A);
    const chiesto = await tab.attendi(testoVisibile(DOMANDA), REAZIONE);
    v.push({ gruppo: g, nome: 'entrando con risposte di prova, la pagina chiede se portarle, e dice dove', ok: chiesto && await tab.valuta(testoVisibile(A.email)),
      extra: chiesto ? 'la domanda non mostra l\'email di destinazione' : `dopo l'accesso non compare «${DOMANDA} …» (§5.1)` });
    if (!chiesto) return;
    const ferma = await maiPer(() => ctx.righeDi(A.email) > 0 || richiesteA(tab, 'POST', '/v1/righe').length > 0);
    v.push({ gruppo: g, nome: 'la scelta proposta non fa partire niente da sola', ok: ferma,
      extra: `prima di «Conferma la scelta» ${richiesteA(tab, 'POST', '/v1/righe').length} POST /v1/righe, ${ctx.righeDi(A.email)} righe nell'account` });
    await tab.valuta(js(`const l = [...M().querySelectorAll('label')].find((l) => V(l) && l.textContent.trim() === 'No, continua senza portarle'); if (l) l.click(); return !!l;`));
    await clicca(tab, 'Conferma la scelta');
    v.push({ gruppo: g, nome: 'con il no le risposte di prova restano fuori dall\'account', ok: await maiPer(() => ctx.righeDi(A.email) > 0),
      extra: `dopo «No, continua senza portarle» l'account ha ${ctx.righeDi(A.email)} righe` });
    const giro = [];
    if (await unaDalPercorso(tab, g)) {
      v.push({ gruppo: g, nome: 'e la risposta data dopo l\'accesso entra nell\'account', ok: await finche(() => ctx.righeDi(A.email) === 1, REAZIONE),
        extra: `l'account ha ${ctx.righeDi(A.email)} righe, ne aspettava 1` });
    } else v.push({ gruppo: g, nome: 'dopo l\'accesso un\'attivita\' si avvia', ok: false, extra: 'dal riepilogo nessuna nuova attivita\' arriva a un quesito' });
  } finally { await c.chiudi(); }
}

async function c06corsa(b, ctx, v, g, A, B) {
  // A esce da una scheda mentre l'altra ha un invio fermo prima di partire; poi
  // entra B. Misurato il 29 settembre: una richiesta trattenuta e lasciata
  // andare dopo il cambio parte con il cookie di B. La scheda di A deve averla
  // annullata prima che l'uscita si compia (§9.1).
  const d = await b.nuovoContesto();
  try {
    const t1 = await d.apri(ctx.sito + '/app');
    await t1.attendi(PRONTO, CARICO);
    await entraCome(t1, A);
    if (!await t1.attendi(pulsante('Account'), REAZIONE)) {
      v.push({ gruppo: g, nome: 'corsa: A entra', ok: false, extra: 'dopo l\'accesso l\'intestazione non dice «Account» (§3.2)' });
      return;
    }
    const t = trattenuta();
    await t1.intercetta(`${ctx.api}/v1/righe*`, t.gestore);
    const prima = ctx.righeDi(A.email);
    await clic(t1, '[data-rotta-start]');
    await rispondiQuiz(t1, [], g, '');
    const inVolo = await Promise.race([t.presa.then(() => true), pausa(REAZIONE).then(() => false)]);
    v.push({ gruppo: g, nome: 'corsa: la risposta di A parte, e resta ferma prima del server', ok: inVolo, extra: 'nessuna POST /v1/righe dalla scheda di A' });
    if (!inVolo) return;
    const t2 = await d.apri(ctx.sito + '/app');
    const riconosciuta = await t2.attendi(pulsante('Account'), CARICO);
    // Le sessioni si contano per differenza: la registrazione dal banco e gli
    // accessi di prima ne hanno aperte altre, su altri «browser».
    const sessA = ctx.sessioniDi(A.email);
    await esciDa(t2);
    const uscita = await finche(async () => ctx.sessioniDi(A.email) === sessA - 1 && await t2.valuta(pulsante('Accedi')), REAZIONE + 3000);
    await entraCome(t2, B);
    const dentroB = await t2.attendi(pulsante('Account'), REAZIONE);
    v.push({ gruppo: g, nome: 'corsa: dall\'altra scheda A esce e B entra', ok: riconosciuta && uscita && dentroB,
      extra: !riconosciuta ? 'la seconda scheda non riconosce l\'account' : !uscita ? `«Esci» non chiude la sessione di A (${sessA} → ${ctx.sessioniDi(A.email)} sessioni)` : 'B non entra' });
    t.lascia();
    const pulita = await maiPer(() => ctx.righeDi(B.email) > 0);
    v.push({ gruppo: g, nome: 'corsa: la risposta di A rimasta in volo non arriva nell\'account di B', ok: pulita,
      extra: `l'account di B ha ${ctx.righeDi(B.email)} righe: la richiesta di A e' partita con il cookie di B` });
    v.push({ gruppo: g, nome: 'corsa: e la risposta di A e\' nel suo account', ok: ctx.righeDi(A.email) === prima + 1,
      extra: `l'account di A ha ${ctx.righeDi(A.email)} righe, ne aspettava ${prima + 1}` });
    const idb = (await d.conservato(ctx.sito, t2)).idb;
    v.push({ gruppo: g, nome: 'corsa: la copia di A non resta, e B ha la sua', ok: !idb.includes(`rg-account-${A.chiave}`) && idb.includes(`rg-account-${B.chiave}`),
      extra: 'IndexedDB: ' + idb.join(', ') });
  } finally { await d.chiudi(); }
}

async function c06congelata(b, ctx, v, g, A, B) {
  // La coda di A, congelata da un accesso non piu' valido, non entra in B (§10).
  const e = await b.nuovoContesto();
  try {
    const tab = await e.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    await entraCome(tab, A);
    await tab.attendi(pulsante('Account'), REAZIONE);
    const primaA = ctx.righeDi(A.email), primaB = ctx.righeDi(B.email);
    await tab.offline(true);
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    await pausa(800);
    ctx.revoca(A.email);
    await tab.offline(false);
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    const scaduto = await tab.attendi(pulsante('Accedi'), REAZIONE);
    await entraCome(tab, B);
    const dentro = await tab.attendi(pulsante('Account'), REAZIONE);
    v.push({ gruppo: g, nome: 'con l\'accesso di A non piu\' valido, B entra dallo stesso browser', ok: scaduto && dentro,
      extra: !scaduto ? 'dopo il 401 la pagina non offre «Accedi»' : 'B non entra' });
    const isolati = await maiPer(() => ctx.righeDi(B.email) !== primaB || ctx.righeDi(A.email) !== primaA);
    const idb = (await e.conservato(ctx.sito, tab)).idb;
    v.push({ gruppo: g, nome: 'la coda di A, congelata, non entra in B, e resta nella copia di A', ok: isolati && idb.includes(`rg-account-${A.chiave}`),
      extra: !isolati ? `righe di B ${primaB} → ${ctx.righeDi(B.email)}, di A ${primaA} → ${ctx.righeDi(A.email)}` : 'la copia di A non c\'e\' piu\': IndexedDB ' + idb.join(', ') });
  } finally { await e.chiudi(); }
}

// --- C-11: la coda sotto pressione --------------------------------------------------

async function c11(b, ctx, v, parte) {
  const g = 'C-11';
  const vuole = (x) => !parte || parte === x;
  if (vuole('volo')) await c11volo(b, ctx, v, g);
  if (vuole('ricarica')) await c11ricarica(b, ctx, v, g);
}

async function c11volo(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c11');
  const c = await b.nuovoContesto();
  try {
    const t1 = await c.apri(ctx.sito + '/app');
    await t1.attendi(PRONTO, CARICO);
    await entraCome(t1, K);
    await t1.attendi(pulsante('Account'), REAZIONE);
    // Una risposta mentre l'invio della precedente e' in volo (§9.1): la
    // coda si rilegge alla conferma, non e' quella di inizio invio.
    const t = trattenuta();
    await t1.intercetta(`${ctx.api}/v1/righe*`, t.gestore, { fase: 'Response' });
    await clic(t1, '[data-rotta-start]');
    await rispondiQuiz(t1, [], g, '');
    const inVolo = await Promise.race([t.presa.then(() => true), pausa(REAZIONE).then(() => false)]);
    v.push({ gruppo: g, nome: 'la prima risposta parte, e la sua conferma resta ferma', ok: inVolo, extra: 'nessuna POST /v1/righe' });
    if (!inVolo) return;
    await clic(t1, '#r-next');
    await t1.attendi(js(`return !document.querySelector('#r-ans .ans.ok');`), REAZIONE);
    const seconda = await rispondiQuiz(t1, [], g, '');
    await pausa(700);
    t.lascia();
    v.push({ gruppo: g, nome: 'la risposta data durante l\'invio arriva anche lei sul server', ok: !!seconda && await finche(() => ctx.righeDi(K.email) === 2, REAZIONE),
      extra: `il server ha ${ctx.righeDi(K.email)} righe, le risposte erano 2: una e' uscita dalla coda senza che il server la nominasse` });
    // Due schede, una risposta ciascuna, nello stesso istante.
    const t2 = await c.apri(ctx.sito + '/app');
    await t2.attendi(pulsante('Account'), CARICO);
    await chiudiQuiz(t1, [], g, '');
    await alPercorso(t1);
    const avviate = await Promise.all([t1, t2].map(async (x) => await x.attendi(PRONTO, REAZIONE) && await clic(x, '[data-rotta-start]')
      && (await x.attendiValore(QUESITO, quesitoDellaBanca, REAZIONE)).ok));
    // Il clic nello stesso istante in tutte e due, passata la sordita' di
    // 200 ms: con un tocco ripetuto a turno, sotto carico, le due risposte
    // cadevano a piu' di un secondo l'una dall'altra, e una scrittura in due
    // tempi passava verde (misurato il 29 settembre 2026).
    await pausa(400);
    await Promise.all([t1, t2].map((x) => clic(x, '#r-ans .ans')));
    await Promise.all([t1, t2].map((x) => rispondiQuiz(x, [], g, '')));
    v.push({ gruppo: g, nome: 'due schede che rispondono insieme: ogni risposta sul server, una volta', ok: avviate.every(Boolean) && await finche(() => ctx.righeDi(K.email) === 4, REAZIONE + 1500) && ctx.righeDi(K.email) === 4,
      extra: `il server ha ${ctx.righeDi(K.email)} righe, ne aspettava 4` });
  } finally { await c.chiudi(); }
}

async function c11ricarica(b, ctx, v, g) {
  // Ricaricata mentre il trasferimento e' fermo prima del server: la pagina
  // riprende dalla coda salvata, e dice «salvate» solo quando il server le ha.
  const d = await b.nuovoContesto();
  try {
    const tab = await d.apri(ctx.sito + '/app');
    const t = trattenuta();
    await tab.intercetta(`${ctx.api}/v1/righe*`, t.gestore);
    if (!await unaRisposta(tab, v, g, 'ricarica: ')) return;
    const email = `c11-${++serie}@esempio.it`;
    await clicca(tab, 'Crea un account e salva');
    await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE);
    await imposta(tab, 'Email', email);
    await imposta(tab, 'Password', PASSWORD);
    await clicca(tab, 'Crea l\'account e salva');
    const inVolo = await Promise.race([t.presa.then(() => true), pausa(REAZIONE).then(() => false)]);
    if (!inVolo) { v.push({ gruppo: g, nome: 'ricarica: il trasferimento parte', ok: false, extra: 'nessuna POST /v1/righe dopo la registrazione' }); return; }
    await tab.ricarica();
    t.lascia();
    const { ok: detto, valore } = await tab.attendiValore(testoRe(SALVATE), Boolean, CARICO);
    v.push({ gruppo: g, nome: 'ricarica: la pagina riprende l\'invio dalla coda salvata, e dice «salvate» quando il server le ha', ok: detto && Number(valore[1]) === 1 && ctx.righeDi(email) === 1,
      extra: detto ? `la pagina dice ${valore[0]}, il server ha ${ctx.righeDi(email)} righe` : `dopo la ricarica niente «salvate»; il server ha ${ctx.righeDi(email)} righe su 1` });
  } finally { await d.chiudi(); }
}

// --- C-15: uscire ---------------------------------------------------------------------

const RESTA = /\d+ rispost[ae] non (sono|è) sul server/;
const SERVE_RETE = 'Per uscire dall\'account serve la rete.';
const NON_CANCELLATA = 'L\'accesso è chiuso, ma la copia su questo dispositivo non è stata cancellata.';

async function esciDa(tab) {
  await clicca(tab, 'Account');
  await tab.attendi(pulsante('Esci'), REAZIONE);
  return clicca(tab, 'Esci');
}

const copieAccount = (cons) => cons.idb.filter((n) => n.startsWith('rg-account-'));

async function c15(b, ctx, v, parte) {
  const g = 'C-15';
  const vuole = (x) => !parte || parte === x;
  const U = await nuovoAccount(ctx, 'c15');
  if (vuole('uscite')) await c15uscite(b, ctx, v, g, U);
  if (vuole('corsa')) await c15corsa(b, ctx, v, g, U);
  if (vuole('scaduta')) await fermaAlPrimo(v, (w) => c15scaduta(b, ctx, w, g));
  if (vuole('ovunque')) await fermaAlPrimo(v, (w) => c15ovunque(b, ctx, w, g));
}

async function c15uscite(b, ctx, v, g, U) {
  const account = copieAccount;
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    // Con righe da inviare non si esce, e lo si dice (§10).
    let rompi = true;
    await tab.intercetta(`${ctx.api}/v1/righe*`, (r) => (r.method === 'POST' && rompi ? { fallisci: 'ConnectionReset' } : null));
    await entraCome(tab, U);
    await tab.attendi(pulsante('Account'), REAZIONE);
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    await chiudiQuiz(tab, [], g, '');
    await finche(() => richiesteA(tab, 'POST', '/v1/righe').length > 0, REAZIONE);
    await esciDa(tab);
    const detto = await tab.attendi(js(`return new RegExp(${q(RESTA.source)}).test(document.body.innerText);`), REAZIONE);
    const cons = await c.conservato(ctx.sito, tab);
    const tenuta = detto && !richiesteA(tab, 'POST', '/v1/uscita').length && account(cons).length === 1 && ctx.sessioniDi(U.email) > 0;
    v.push({ gruppo: g, nome: 'con risposte non inviate non si esce, e lo si dice', ok: tenuta,
      extra: !detto ? '«N risposte non sono sul server» non compare' : `POST /v1/uscita ${richiesteA(tab, 'POST', '/v1/uscita').length}, copie ${account(cons).join(', ')}, sessioni ${ctx.sessioniDi(U.email)}` });
    // Ogni passo di qui in giu' parte dallo stato che il precedente lascia:
    // dopo un rosso il resto misurerebbe un'altra cosa, e pagherebbe le scadenze.
    if (!tenuta) return;
    await esc(tab);
    // Senza rete non si esce per finta: il server non puo' revocare il cookie.
    rompi = false;
    await unaDalPercorso(tab, g);
    await chiudiQuiz(tab, [], g, '');
    await finche(() => ctx.righeDi(U.email) === 2, REAZIONE);
    await tab.offline(true);
    await esciDa(tab);
    const rete = await tab.attendi(testoVisibile(SERVE_RETE), REAZIONE + 3000);
    const cons2 = await c.conservato(ctx.sito, tab);
    const ferma = rete && account(cons2).length === 1 && cons2.cookie.length > 0 && ctx.sessioniDi(U.email) > 0;
    v.push({ gruppo: g, nome: 'offline, «Esci» dice che serve la rete, e non cancella niente', ok: ferma,
      extra: !rete ? `«${SERVE_RETE}» non compare` : `copie ${account(cons2).join(', ') || 'nessuna'}, cookie ${cons2.cookie.length}` });
    await tab.offline(false);
    if (!ferma) return;
    await esc(tab);
    // Un'altra scheda tiene aperta la copia: la cancellazione resta bloccata,
    // e la pagina non dice «sei uscito».
    const altra = await c.apri(ctx.sito + '/privacy');
    await altra.valuta(`new Promise((ok) => { const r = indexedDB.open(${q('rg-account-' + U.chiave)}); r.onsuccess = () => { window.tieni = r.result; ok(true); }; })`);
    const sessU = ctx.sessioniDi(U.email);
    await esciDa(tab);
    const bloccata = await tab.attendi(testoVisibile(NON_CANCELLATA), REAZIONE + 3000);
    v.push({ gruppo: g, nome: 'una copia che non si cancella lo dice, e la sessione e\' comunque chiusa', ok: bloccata && ctx.sessioniDi(U.email) === sessU - 1,
      extra: !bloccata ? `con un'altra scheda sulla copia, «${NON_CANCELLATA}» non compare` : `sessioni ${sessU} → ${ctx.sessioniDi(U.email)}` });
    await altra.valuta('window.tieni && window.tieni.close(); true');
  } finally { await c.chiudi(); }
}

async function c15corsa(b, ctx, v, g, U) {
  const account = copieAccount;
  // L'uscita normale, e la risposta tardiva di un'altra scheda.
  const d = await b.nuovoContesto();
  try {
    const t1 = await d.apri(ctx.sito + '/app');
    await t1.attendi(PRONTO, CARICO);
    await entraCome(t1, U);
    await t1.attendi(pulsante('Account'), REAZIONE);
    const t2 = await d.apri(ctx.sito + '/app');
    await t2.attendi(pulsante('Account'), CARICO);
    const t = trattenuta();
    await t1.intercetta(`${ctx.api}/v1/righe*`, t.gestore, { fase: 'Response' });
    await clic(t1, '[data-rotta-start]');
    await rispondiQuiz(t1, [], g, '');
    const inVolo = await Promise.race([t.presa.then(() => true), pausa(REAZIONE).then(() => false)]);
    const sessU = ctx.sessioniDi(U.email);
    await esciDa(t2);
    const fuori = await finche(async () => ctx.sessioniDi(U.email) === sessU - 1 && await t2.valuta(pulsante('Accedi')), REAZIONE + 3000);
    v.push({ gruppo: g, nome: 'uscita: la sessione e\' chiusa sul server, e la pagina torna senza account', ok: inVolo && fuori,
      extra: !inVolo ? 'la risposta della prima scheda non e\' partita' : `sessioni ${sessU} → ${ctx.sessioniDi(U.email)}; l'intestazione ${await t2.valuta(pulsante('Accedi')) ? '' : 'non '}dice «Accedi»` });
    t.lascia();
    let trovato = [];
    const pulito = await maiPer(async () => {
      const cons = await d.conservato(ctx.sito, t2);
      trovato = [...account(cons), ...cons.local.map((x) => 'localStorage ' + x[0]), ...cons.session.map((x) => 'sessionStorage ' + x[0])];
      return trovato.length > 0;
    });
    v.push({ gruppo: g, nome: 'dopo l\'uscita niente dell\'account resta nel browser, e la risposta tardiva dell\'altra scheda non lo ricrea', ok: pulito,
      extra: 'trovato ' + trovato.join(', ') });
    v.push({ gruppo: g, nome: 'e anche l\'altra scheda e\' senza account', ok: await t1.attendi(js(`return document.body.innerText.includes('Accedi') && !document.body.innerText.includes(${q(U.email)});`), REAZIONE),
      extra: 'la scheda con l\'invio in volo mostra ancora l\'account' });
  } finally { await d.chiudi(); }
}

// --- gli attrezzi dei gruppi di P-43 ------------------------------------------------------

const GIORNO = 86400000;
// Il giorno della scadenza come la scrive chi legge in italiano, nell'ora di
// Roma: la pagina la scrive dalla descrizione dell'account, mai dall'orologio
// del browser (§6).
const giornoIt = (t) => new Date(t).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', timeZone: 'Europe/Rome' });
const POSTA_NO = 'L\'account è creato, ma non siamo riusciti a spedire la mail di conferma.';
const INVIATA = 'La mail di conferma è stata inviata. Il link vale 24 ore.';
const RINVIO_NO = 'Non siamo riusciti a spedire la mail di conferma.';
const CONFERMATA = 'Email confermata';
const LINK_USATO = 'Il link è scaduto o è già stato usato.';
const ACCESSO_NO = 'Email o password non corrette. Riprova oppure reimposta la password.';
const SE_ISCRITTO = 'Se questo indirizzo è iscritto, riceverai una mail da Rotta Giusta. Il link vale un\'ora.';
const PW_AGGIORNATA = 'Password aggiornata. Le sessioni precedenti sono state chiuse';
const PW_LINK_USATO = 'Questo link è scaduto o è già stato usato. Chiedi un nuovo link per reimpostare la password.';
const LETTURA_NO = 'Non siamo riusciti a leggere le risposte già presenti in questo browser.';
const FILE_SENZA = 'Per conservare le risposte del file, crea un account o accedi';
const FILE_NO = 'Non riusciamo a leggere questo file di progressi.';
const DA_INVIARE_SEG = 'Punteggi da inviare';
const AZZERATI = /i progressi sono stati azzerati da un altro dispositivo/i;
const DATA_NO = 'La data non è stata salvata. Riprova oppure continua senza cambiarla';
const NON_VALIDO = 'L\'accesso non è più valido.';
// Una password dell'elenco delle comuni, lunga abbastanza da passare la lunghezza.
const COMUNE = readFileSync(join(RADICE, 'server', 'password-comuni.txt'), 'utf8').split('\n').find((x) => x === 'passwordpassword');
const ID_BANCA = new Set([...BANCA_ID()]);
function BANCA_ID() {
  const l = (f) => JSON.parse(readFileSync(join(SITE, 'dati', f), 'utf8'));
  return [...l('quiz.json').map((x) => x.id), ...l('carteggio.json').map((x) => x.id)];
}
const ID_BASE = JSON.parse(readFileSync(join(SITE, 'dati', 'quiz.json'), 'utf8')).filter((x) => x.k === 'base').map((x) => x.id);

/** Righe di risposta vere per la banca, con un prefisso: ogni gruppo le sue. */
function righeDi(prefisso, quante, { da = 0, pad = 0 } = {}) {
  return Array.from({ length: quante }, (_, i) => ({
    _t: 'q', uid: `${prefisso}-${da + i}`, item_id: ID_BASE[(da + i) % ID_BASE.length], ts: '2026-09-20T10:00:00+02:00',
    ms: 8000, mode: 'batteria', kind: 'base', correct: i % 3 ? 1 : 0, ...(pad ? { nota: 'x'.repeat(pad) } : {}),
  }));
}

/** Dal riepilogo, il modulo di registrazione compilato e inviato. */
async function registraDalRiepilogo(tab, email, password = PASSWORD) {
  if (!await clicca(tab, 'Crea un account e salva')) return false;
  if (!await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE)) return false;
  await imposta(tab, 'Email', email);
  await imposta(tab, 'Password', password);
  return clicca(tab, 'Crea l\'account e salva');
}

/** Tutto quello che la pagina conserva, letto da dentro: storage, IndexedDB, cache. Per cercarci un segreto. */
const TUTTO = `(async () => {
  const out = [JSON.stringify({ ...localStorage }), JSON.stringify({ ...sessionStorage }), document.cookie];
  for (const d of await indexedDB.databases()) {
    const db = await new Promise((ok, ko) => { const q = indexedDB.open(d.name); q.onsuccess = () => ok(q.result); q.onerror = () => ko(q.error); });
    for (const st of db.objectStoreNames) {
      for (const m of ['getAll', 'getAllKeys']) {
        out.push(JSON.stringify(await new Promise((ok) => { const g = db.transaction(st).objectStore(st)[m](); g.onsuccess = () => ok(g.result); g.onerror = () => ok(null); })));
      }
    }
    db.close();
  }
  if (self.caches) for (const k of await caches.keys()) for (const r of await (await caches.open(k)).keys()) out.push(r.url);
  return out.join('\\n');
})()`;

const finti = (ctx, codice, corpo, intestazioni = {}) => ({ codice, corpo: JSON.stringify(corpo),
  intestazioni: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ctx.sito, 'Access-Control-Allow-Credentials': 'true', ...intestazioni } });

/** Entra dall'intestazione e aspetta che la pagina lo riconosca. */
async function dentro(tab, conto) {
  await tab.attendi(PRONTO, CARICO);
  await entraCome(tab, conto);
  if (!await tab.attendi(nellaPagina('Account'), REAZIONE)) return false;
  // «Account» nell'intestazione non vuol dire che l'accesso sia finito: la
  // pagina chiude la sua finestra un attimo dopo. Sotto carico il banco apriva
  // il pannello dell'account in quell'attimo e la pagina glielo chiudeva sotto,
  // cosi' «Esci» non partiva mai: misurato il 30 settembre 2026 in C-15, 4 giri
  // su 176 sotto carico e nessuno su 24 senza (P-40). I chiamanti entrano in
  // un contesto nuovo, senza risposte, dove dopo l'accesso non resta niente di
  // aperto: si aspetta quello.
  await tab.attendi(js(`return ![...document.querySelectorAll('[aria-modal="true"], dialog[open]')].some(V);`), REAZIONE);
  return true;
}

/** Un pulsante visibile in tutta la pagina, anche con una finestra aperta sopra. */
const nellaPagina = (testo) => js(`return [...document.querySelectorAll('button, a')].some((b) => V(b) && b.textContent.trim() === ${q(testo)});`);

/** Un download avviato dalla pagina, letto come JSON: il primo dopo `n` gia' visti. */
async function scaricato(c, n, ms = REAZIONE) {
  for (const fine = Date.now() + ms; Date.now() < fine;) {
    const d = c.scaricati();
    if (d.length > n) { try { return { nome: d[n].nome, dati: JSON.parse(d[n].testo) }; } catch { return { nome: d[n].nome, dati: null }; } }
    await pausa(50);
  }
  return null;
}

const uidDi = (dati) => new Set(((dati && dati.righe) || []).map((r) => String(r.uid)));
const stessi = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

/** Le righe nell'archivio `righe` della copia dell'account, lette da fuori (§12, «Il contratto»). */
async function nellaCopia(c, ctx, tab, chiave) {
  const v = await c.voci(ctx.sito, `rg-account-${chiave}`, tab);
  return v ? v.righe ?? null : null;
}

/**
 * Una parte di un gruppo, fermata al primo rosso: ogni passo parte dallo stato
 * che il precedente lascia, e dopo un rosso il resto misurerebbe un'altra cosa e
 * pagherebbe le sue scadenze. E' la regola delle uscite di C-15 (P-39), estesa ai
 * gruppi di P-43: con le loro rotture il banco passava da 61 a 182 s (misurato).
 */
const FERMO = Symbol('fermo');
async function fermaAlPrimo(v, fn) {
  const w = { push: (...xs) => { v.push(...xs); if (xs.some((x) => !x.ok)) throw FERMO; } };
  try { await fn(w); } catch (e) { if (e !== FERMO) throw e; }
}

// --- C-07: la verifica dell'email -----------------------------------------------------------

async function c07(b, ctx, v, parte) {
  const g = 'C-07';
  const vuole = (x) => !parte || parte === x;
  if (vuole('posta')) await fermaAlPrimo(v, (w) => c07posta(b, ctx, w, g));
  if (vuole('link')) await fermaAlPrimo(v, (w) => c07link(b, ctx, w, g));
}

async function c07posta(b, ctx, v, g) {
  // Tre giorni avanti sull'orologio del server: una scadenza calcolata con
  // l'orologio del browser cadrebbe in un altro giorno, e si vede.
  ctx.avanza(3 * GIORNO);
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await unaRisposta(tab, v, g, 'posta rifiutata: ')) return;
    const email = `c07-${++serie}@esempio.it`;
    ctx.rifiuta.add(email);
    await registraDalRiepilogo(tab, email);
    const creato = await finche(() => !!ctx.conto(email), REAZIONE);
    const detto = creato && await tab.attendi(testoVisibile(POSTA_NO), REAZIONE);
    v.push({ gruppo: g, nome: 'con la mail rifiutata dal fornitore la pagina dice che l\'account c\'e\' e la mail no', ok: detto && !await tab.valuta(testoVisibile(INVIATA)),
      extra: !creato ? 'l\'account non e\' stato creato' : `«${POSTA_NO}» non si vede, o si vede «${INVIATA}»` });
    if (!creato) return;
    const scade = Date.parse(ctx.conto(email).creato_il) + 7 * GIORNO;
    const frase = `Conferma ${email} entro il ${giornoIt(scade)}`;
    v.push({ gruppo: g, nome: 'la scadenza della conferma si vede dal primo momento, ed e\' quella del server', ok: await tab.attendi(testoVisibile(frase), REAZIONE),
      extra: `«${frase}…» non si vede: ${JSON.stringify((await tab.valuta(testoRe(/Conferma \S+ entro il [^.]*/)))?.[0] ?? 'nessuna scadenza')}` });
    const salvate = await finche(() => ctx.righeDi(email) === 1, REAZIONE) && (await tab.attendiValore(testoRe(SALVATE), Boolean, REAZIONE)).ok;
    v.push({ gruppo: g, nome: 'e l\'account creato con la mail rifiutata salva le risposte', ok: salvate, extra: `il server ha ${ctx.righeDi(email)} righe, «salvate» ${salvate ? '' : 'non '}si vede` });
    const spedite = () => ctx.mail.filter((m) => m.a === email).length;
    // Dopo il salvataggio viene la data (§11.1): si salta, e si torna all'avviso.
    await tab.attendi(pulsante('Continua senza data'), REAZIONE);
    await clicca(tab, 'Continua senza data');
    await clicca(tab, 'Rimanda la mail');
    const rifiuto = await tab.attendi(testoVisibile(RINVIO_NO), REAZIONE);
    v.push({ gruppo: g, nome: 'rimandata con il fornitore che rifiuta, nessuna frase di successo', ok: rifiuto && !await tab.valuta(testoVisibile(INVIATA)),
      extra: rifiuto ? `si vede «${INVIATA}» con la mail rifiutata` : `«${RINVIO_NO}» non si vede` });
    ctx.rifiuta.delete(email);
    await clicca(tab, 'Rimanda la mail');
    const inviata = await tab.attendi(testoVisibile(INVIATA), REAZIONE);
    v.push({ gruppo: g, nome: 'rimandata con il fornitore che accetta, la pagina lo dice e la mail parte', ok: inviata && spedite() === 1,
      extra: `«${INVIATA}» ${inviata ? '' : 'non '}si vede; mail arrivate al banco: ${spedite()}` });
    await tab.ricarica();
    v.push({ gruppo: g, nome: 'dopo una ricarica la scadenza si vede ancora', ok: await tab.attendi(testoVisibile(frase), CARICO), extra: `«${frase}» non si vede piu'` });
  } finally { await c.chiudi(); }
}

async function c07link(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c07l');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'link: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    const frase = `Conferma ${K.email} entro il`;
    v.push({ gruppo: g, nome: 'entrando con un account non confermato, la scadenza si vede', ok: await tab.attendi(testoVisibile(frase), REAZIONE), extra: `«${frase} …» non si vede` });
    const gett = ctx.gettone(K.email, 'verifica');
    // Il link aperto in un'altra scheda dello stesso browser, come dalla mail.
    const t2 = await c.apri(`${ctx.sito}/app#verifica=${gett}`);
    const tolto = await t2.attendi('location.hash === ""', REAZIONE);
    v.push({ gruppo: g, nome: 'il gettone esce dall\'indirizzo appena la pagina si apre', ok: tolto, extra: `l'indirizzo e' ancora ${await t2.valuta('location.href')}` });
    const confermata = await t2.attendi(testoVisibile(CONFERMATA), REAZIONE) && await finche(() => !!ctx.conto(K.email).email_verificata_il, REAZIONE);
    v.push({ gruppo: g, nome: 'il link conferma l\'email sul server, e la pagina lo dice', ok: confermata,
      extra: `«${CONFERMATA}» ${await t2.valuta(testoVisibile(CONFERMATA)) ? '' : 'non '}si vede; sul server ${ctx.conto(K.email).email_verificata_il ? '' : 'non '}e' confermata` });
    await clicca(tab, 'Ho confermato: verifica lo stato');
    v.push({ gruppo: g, nome: 'nella prima scheda, riletto lo stato, la scadenza sparisce', ok: await tab.attendi(js(`return !document.body.innerText.includes(${q(frase)});`), REAZIONE),
      extra: 'dopo «Ho confermato: verifica lo stato» la scadenza si vede ancora' });
    const ovunque = (await tab.valuta(TUTTO)) + (await t2.valuta(TUTTO));
    v.push({ gruppo: g, nome: 'il gettone non resta in nessuno storage del browser', ok: !ovunque.includes(gett), extra: 'il gettone e\' in localStorage, sessionStorage, IndexedDB, un cookie o la Cache Storage' });
    const t3 = await c.apri(`${ctx.sito}/app#verifica=${gett}`);
    v.push({ gruppo: g, nome: 'lo stesso link, gia\' usato, lo dice', ok: await t3.attendi(testoVisibile(LINK_USATO), REAZIONE) && !await t3.valuta(testoVisibile(CONFERMATA)),
      extra: `«${LINK_USATO}» non si vede, o si vede «${CONFERMATA}»` });
    // Un link scaduto: un altro account, il suo gettone, un giorno e un'ora dopo.
    const L = await nuovoAccount(ctx, 'c07s');
    const g2 = ctx.gettone(L.email, 'verifica');
    ctx.avanza(GIORNO + 3600000);
    const t4 = await c.apri(`${ctx.sito}/app#verifica=${g2}`);
    v.push({ gruppo: g, nome: 'un link scaduto lo dice, e l\'email resta da confermare', ok: await t4.attendi(testoVisibile(LINK_USATO), REAZIONE) && !ctx.conto(L.email).email_verificata_il,
      extra: `«${LINK_USATO}» non si vede, o l'email risulta confermata` });
  } finally { await c.chiudi(); }
}

// --- C-08: la password, gli errori dell'accesso, il recupero ------------------------------

async function c08(b, ctx, v, parte) {
  const g = 'C-08';
  const vuole = (x) => !parte || parte === x;
  if (vuole('password')) await fermaAlPrimo(v, (w) => c08password(b, ctx, w, g));
  if (vuole('accesso')) await fermaAlPrimo(v, (w) => c08accesso(b, ctx, w, g));
  if (vuole('recupero')) await fermaAlPrimo(v, (w) => c08recupero(b, ctx, w, g));
}

/** Il messaggio del server per una password, chiesto dal banco: la pagina deve dire quello (§4.2). */
async function motivoPassword(ctx, password) {
  const r = await fetch(`${ctx.apiInterno}/v1/registrazione`, { method: 'POST', headers: { origin: ctx.sito, 'content-type': 'application/json' },
    body: JSON.stringify({ email: `motivo-${++serie}@esempio.it`, password }) });
  return (await r.json()).messaggio;
}

async function c08password(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const testo = await unaRisposta(tab, v, g, 'password: ');
    if (!testo) return;
    const email = `c08-${++serie}@esempio.it`;
    for (const [cosa, pw] of [['troppo corta', 'barca a vela'], ['fra le comuni', COMUNE]]) {
      const atteso = await motivoPassword(ctx, pw);
      if (!await tab.valuta(js(`return V(${campo('Email')});`))) await clicca(tab, 'Crea un account e salva');
      await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE);
      await imposta(tab, 'Email', email);
      await imposta(tab, 'Password', pw);
      await clicca(tab, 'Crea l\'account e salva');
      const detto = await tab.attendi(testoVisibile(atteso), REAZIONE);
      const tenuto = await tab.valuta(js(`const e = ${campo('Email')}; return !!e && e.value === ${q(email)};`));
      v.push({ gruppo: g, nome: `una password ${cosa}: il motivo del server accanto al campo, e l'email resta scritta`, ok: detto && tenuto && !ctx.conto(email),
        extra: !detto ? `«${atteso}» non si vede` : !tenuto ? 'il campo Email e\' stato svuotato' : 'l\'account e\' stato creato' });
    }
    await clicca(tab, 'Torna al riepilogo');
    v.push({ gruppo: g, nome: 'dopo i rifiuti il riepilogo e la sua revisione sono intatti', ok: await tab.attendi(RIEPILOGO, REAZIONE) && await revisione(tab, testo),
      extra: 'dopo due password rifiutate il riepilogo non si rivede' });
  } finally { await c.chiudi(); }
}

async function c08accesso(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c08a');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    const prova = async (email, password) => {
      const n = richiesteA(tab, 'POST', '/v1/accesso').length;
      await tab.valuta(js(`const e = M().querySelector('#account-esito'); if (e) e.textContent = ''; return true;`));
      if (!await tab.valuta(js(`return V(${campo('Email')});`))) await clicca(tab, 'Accedi');
      await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE);
      await imposta(tab, 'Email', email);
      await imposta(tab, 'Password', password);
      await clicca(tab, 'Accedi');
      await finche(() => richiesteA(tab, 'POST', '/v1/accesso').length > n, REAZIONE);
      await tab.attendi(js(`return !M().innerText.includes('Accesso in corso');`), REAZIONE);
      return tab.valuta(js(`return M().innerText;`));
    };
    const ignota = await prova(`nessuno-${++serie}@esempio.it`, PASSWORD);
    const sbagliata = await prova(K.email, 'una password che non e\' la sua');
    v.push({ gruppo: g, nome: 'email che non esiste e password sbagliata: la stessa frase', ok: ignota.includes(ACCESSO_NO) && sbagliata.includes(ACCESSO_NO),
      extra: `email ignota: ${ignota.includes(ACCESSO_NO) ? 'la frase' : 'altro'}; password sbagliata: ${sbagliata.includes(ACCESSO_NO) ? 'la frase' : 'altro'} (§5.1)` });
    // Altri quattro sbagli di fila, dal banco: al sesto tentativo il server fa aspettare (§6.5).
    for (let i = 0; i < 4; i++) {
      await fetch(`${ctx.apiInterno}/v1/accesso`, { method: 'POST', headers: { origin: ctx.sito, 'content-type': 'application/json' }, body: JSON.stringify({ email: K.email, password: 'ancora sbagliata di fila' }) });
    }
    const attesa = await prova(K.email, K.password);
    const m = attesa.match(/Troppi tentativi\. Puoi riprovare fra ([^.\n]+)/);
    v.push({ gruppo: g, nome: 'un 429 dice quanto aspettare, dal Retry-After del server', ok: !!m && /30 secondi/.test(m[1]),
      extra: m ? `la pagina dice «fra ${m[1]}», il server ha detto 30 secondi` : 'nessun «Troppi tentativi. Puoi riprovare fra …»: il Retry-After si legge solo se il server lo espone (§5.1)' });
    // Un 403 di password disattivata, finto: il messaggio del server e la porta per reimpostarla.
    const DISATT = 'Password disattivata dopo troppi tentativi: reimpostala dalla mail.';
    await tab.intercetta(`${ctx.api}/v1/accesso`, (r) => (r.method === 'POST' ? finti(ctx, 403, { errore: 'password_disattivata', messaggio: DISATT }) : null));
    const disattivata = await prova(K.email, K.password);
    v.push({ gruppo: g, nome: 'un 403 di password disattivata dice il messaggio del server e porta a reimpostarla', ok: disattivata.includes(DISATT) && await tab.valuta(pulsante('Reimposta la password')),
      extra: disattivata.includes(DISATT) ? 'manca «Reimposta la password»' : 'il messaggio del server non si vede' });
  } finally { await c.chiudi(); }
}

async function c08recupero(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c08r');
  ctx.aggiungi(K.email, righeDi(`c08r${serie}`, 2));
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    await clicca(tab, 'Accedi');
    await tab.attendi(pulsante('Ho dimenticato la password'), REAZIONE);
    await clicca(tab, 'Ho dimenticato la password');
    const chiedi = async (email) => {
      const n = richiesteA(tab, 'POST', '/v1/password/dimenticata').length;
      await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE);
      await tab.valuta(js(`const e = M().querySelector('[role=status]'); if (e) e.textContent = ''; return true;`));
      await imposta(tab, 'Email', email);
      await clicca(tab, 'Chiedi il link');
      return await finche(() => richiesteA(tab, 'POST', '/v1/password/dimenticata').length > n, REAZIONE) && tab.attendi(testoVisibile(SE_ISCRITTO), REAZIONE);
    };
    const iscritto = await chiedi(K.email);
    const ignoto = await chiedi(`nessuno-${++serie}@esempio.it`);
    v.push({ gruppo: g, nome: 'la richiesta del link dice la stessa frase condizionale, iscritto o no', ok: iscritto && ignoto,
      extra: `«${SE_ISCRITTO}» ${iscritto ? '' : 'non '}per l'iscritto, ${ignoto ? '' : 'non '}per l'email ignota` });
    const gett = ctx.gettone(K.email, 'password');
    const sessioni = ctx.sessioniDi(K.email);
    const t2 = await c.apri(`${ctx.sito}/app#password=${gett}`);
    v.push({ gruppo: g, nome: 'il link della password: il gettone esce dall\'indirizzo', ok: await t2.attendi('location.hash === ""', REAZIONE), extra: 'l\'indirizzo porta ancora il gettone' });
    const modulo = await t2.attendi(js(`return V(${campo('Password')}) && M().innerText.includes('Scegli una nuova password');`), REAZIONE);
    v.push({ gruppo: g, nome: 'il link apre «Scegli una nuova password»', ok: modulo, extra: 'nessun modulo con il campo Password e il titolo del §5.3' });
    if (!modulo) return;
    const corta = await motivoPassword(ctx, 'barca a vela');
    await imposta(t2, 'Password', 'barca a vela');
    await clicca(t2, 'Salva la nuova password');
    v.push({ gruppo: g, nome: 'una password nuova rifiutata dice il motivo del server', ok: await t2.attendi(testoVisibile(corta), REAZIONE), extra: `«${corta}» non si vede` });
    await imposta(t2, 'Password', 'la nuova rotta per il porto');
    await clicca(t2, 'Salva la nuova password');
    // Dopo la password nuova puo' aprirsi una domanda (§5.3): «Account» si cerca in tutta la pagina.
    const fatto = await t2.attendi(testoVisibile(PW_AGGIORNATA), REAZIONE)
      && await t2.attendi(nellaPagina('Account'), REAZIONE);
    v.push({ gruppo: g, nome: 'lo stesso gettone, dopo il rifiuto, cambia la password ed entra; le sessioni di prima sono chiuse', ok: fatto && ctx.sessioniDi(K.email) === 1,
      extra: fatto ? `sessioni: ${sessioni} prima, ${ctx.sessioniDi(K.email)} dopo` : `«${PW_AGGIORNATA}» con «Account» non si vede: il gettone non e' rimasto in memoria dopo il 422` });
    const domanda = await t2.attendi(testoVisibile('Questo account non era confermato e contiene 2 risposte.'), REAZIONE);
    v.push({ gruppo: g, nome: 'un account appena confermato con risposte di prima: la pagina chiede se tenerle', ok: domanda && await t2.valuta(pulsante('Tienile')) && await t2.valuta(pulsante('Cancella queste risposte')),
      extra: 'nessuna domanda «Questo account non era confermato e contiene 2 risposte. …» con «Tienile» e «Cancella queste risposte» (§5.3)' });
    v.push({ gruppo: g, nome: 'e nessuna risposta si cancella da sola', ok: await maiPer(() => ctx.righeDi(K.email) !== 2), extra: `l'account ha ${ctx.righeDi(K.email)} righe, ne aveva 2` });
    await clicca(t2, 'Tienile');
    // Un link della password scaduto: chiesto dal banco, aperto un'ora e un minuto dopo.
    await fetch(`${ctx.apiInterno}/v1/password/dimenticata`, { method: 'POST', headers: { origin: ctx.sito, 'content-type': 'application/json' }, body: JSON.stringify({ email: K.email }) });
    await finche(() => ctx.gettone(K.email, 'password') !== gett, REAZIONE);
    const g2 = ctx.gettone(K.email, 'password');
    ctx.avanza(61 * 60000);
    const t3 = await c.apri(`${ctx.sito}/app#password=${g2}`);
    await t3.attendi(js(`return V(${campo('Password')});`), REAZIONE);
    await imposta(t3, 'Password', 'unaltra rotta per il porto');
    await clicca(t3, 'Salva la nuova password');
    v.push({ gruppo: g, nome: 'un link della password scaduto lo dice', ok: await t3.attendi(testoVisibile(PW_LINK_USATO), REAZIONE), extra: `«${PW_LINK_USATO}» non si vede` });
  } finally { await c.chiudi(); }
}

// --- C-09: l'archivio di prima degli account ----------------------------------------------

/** L'archivio di prima, scritto nel browser prima che la palestra si apra: IndexedDB e il ripiego. */
async function scriviVecchio(c, ctx, idb, ls) {
  const t = await c.apri(ctx.sito + '/privacy');
  await t.valuta(`new Promise((ok, ko) => {
    const q = indexedDB.open('open-patente-nautica', 1);
    q.onupgradeneeded = () => q.result.createObjectStore('righe', { keyPath: 'uid' });
    q.onerror = () => ko(q.error);
    q.onsuccess = () => { const tx = q.result.transaction('righe', 'readwrite'); for (const r of ${JSON.stringify(idb)}) tx.objectStore('righe').put(r);
      tx.oncomplete = () => { q.result.close(); ok(true); }; };
  })`);
  if (ls) await t.valuta(`localStorage.setItem('pn.archivio', ${q(JSON.stringify(ls))}); true`);
  return t;
}

const VECCHIO_FALLITO = `(() => { const o = IDBFactory.prototype.open; IDBFactory.prototype.open = function (n, ...a) {
  if (n === 'open-patente-nautica') throw new DOMException('lettura fallita dal banco', 'UnknownError'); return o.call(this, n, ...a); }; })();`;

async function c09(b, ctx, v, parte) {
  const g = 'C-09';
  const vuole = (x) => !parte || parte === x;
  if (vuole('porta')) await fermaAlPrimo(v, (w) => c09porta(b, ctx, w, g));
  if (vuole('dopo')) await fermaAlPrimo(v, (w) => c09dopo(b, ctx, w, g));
  if (vuole('fallita')) await fermaAlPrimo(v, (w) => c09fallita(b, ctx, w, g));
}

async function c09porta(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c09');
  const s = serie;
  // Due fonti con una riga in comune: l'unione per uid ne fa sei.
  const idb = righeDi(`v${s}`, 4), ls = [...righeDi(`v${s}`, 1, { da: 3 }), ...righeDi(`v${s}`, 2, { da: 4 })];
  const tutte = new Set([...idb, ...ls].map((r) => r.uid));
  const c = await b.nuovoContesto();
  try {
    const priv = await scriviVecchio(c, ctx, idb, ls);
    const tab = await c.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    const avviso = `In questo browser ci sono ${tutte.size} risposte salvate prima degli account.`;
    const visto = await tab.attendi(testoVisibile(avviso), REAZIONE);
    v.push({ gruppo: g, nome: 'l\'avviso conta le risposte delle due fonti, unite per uid', ok: visto,
      extra: `«${avviso}» non si vede: ${JSON.stringify((await tab.valuta(testoRe(/ci sono \d+ risposte salvate prima/)))?.[0] ?? 'nessun avviso')}` });
    if (!visto) return;
    await clicca(tab, 'Scarica il file');
    const file = await scaricato(c, 0);
    v.push({ gruppo: g, nome: '«Scarica il file» porta tutte le risposte di prima, senza rete e senza account', ok: !!file && stessi(uidDi(file.dati), tutte),
      extra: file ? `nel file ${uidDi(file.dati).size} uid, ne aspettava ${tutte.size}` : 'nessun file scaricato' });
    await clicca(tab, 'Registrati o entra e portale');
    await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE);
    await imposta(tab, 'Email', K.email);
    await imposta(tab, 'Password', K.password);
    await clicca(tab, 'Accedi');
    const chiesto = await tab.attendi(testoVisibile(`Vuoi portare nel tuo account le ${tutte.size} risposte salvate in questo browser prima degli account?`), REAZIONE);
    v.push({ gruppo: g, nome: 'entrando, la pagina chiede se portarle, con quante e dove', ok: chiesto && await tab.valuta(testoVisibile(K.email)),
      extra: chiesto ? 'la domanda non mostra l\'email di destinazione' : 'dopo l\'accesso nessuna domanda sulle risposte di prima' });
    v.push({ gruppo: g, nome: 'prima del si\' niente parte', ok: await maiPer(() => ctx.righeDi(K.email) > 0), extra: `l'account ha gia' ${ctx.righeDi(K.email)} righe` });
    await clicca(tab, 'Portale nel mio account');
    const salvate = await finche(() => ctx.righeDi(K.email) === tutte.size, REAZIONE) && (await tab.attendiValore(testoRe(SALVATE), (x) => !!x && Number(x[1]) === tutte.size, REAZIONE)).ok;
    v.push({ gruppo: g, nome: 'portate: tutte sul server, e «salvate» con il numero del server', ok: salvate, extra: `il server ha ${ctx.righeDi(K.email)} righe su ${tutte.size}` });
    await clic(tab, '[data-v="info"]');
    v.push({ gruppo: g, nome: 'Info dice quante ne sono state portate', ok: await tab.attendi(testoVisibile(`${tutte.size} risposte portate nel tuo account il`), REAZIONE),
      extra: `«${tutte.size} risposte portate nel tuo account il …» non si vede in Info` });
    const resta = await c.voci(ctx.sito, 'open-patente-nautica', tab);
    const lsResta = (await c.conservato(ctx.sito, tab)).local.some((e) => e[0] === 'pn.archivio');
    v.push({ gruppo: g, nome: 'l\'archivio di prima resta dov\'era: portarlo non lo cancella', ok: !!resta && resta.righe === idb.length && lsResta,
      extra: `IndexedDB ${JSON.stringify(resta)}, pn.archivio ${lsResta ? 'c\'e\'' : 'sparito'}` });
    await clic(tab, '[data-v="oggi"]');
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    await clic(tab, '[data-v="info"]');
    await tab.attendi(testoVisibile('risposte portate nel tuo account il'), REAZIONE);
    await clic(tab, '[data-v="oggi"]');
    v.push({ gruppo: g, nome: 'dopo la ricarica, portate tutte, l\'avviso non torna', ok: !await tab.valuta(testoVisibile(avviso)), extra: 'l\'avviso si vede ancora con le risposte gia\' portate' });
    // Una riga nuova al posto di una vecchia: stesso numero, un uid diverso.
    // Se l'archivio non c'e' piu' — una pagina che l'ha cancellato — il passo
    // fallisce e lo dice, invece di restare appeso.
    await priv.valuta(`new Promise((ok, ko) => { const q = indexedDB.open('open-patente-nautica'); q.onerror = () => ko(q.error); q.onsuccess = () => { try {
      const tx = q.result.transaction('righe', 'readwrite');
      tx.objectStore('righe').delete(${q(idb[0].uid)}); tx.objectStore('righe').put(${JSON.stringify(righeDi(`v${s}n`, 1)[0])}); tx.oncomplete = () => { q.result.close(); ok(true); };
    } catch (e) { q.result.close(); ko(e); } }; })`);
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'una risposta di prima mai portata riaccende l\'avviso, anche a conteggio uguale', ok: await tab.attendi(testoVisibile('In questo browser ci sono 1 risposte salvate prima degli account.'), REAZIONE),
      extra: 'con una riga nuova nell\'archivio di prima l\'avviso non torna: il segno guarda il numero, non gli uid' });
  } finally { await c.chiudi(); }
}

async function c09dopo(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    await scriviVecchio(c, ctx, righeDi(`d${++serie}`, 3));
    const tab = await c.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    const avviso = 'In questo browser ci sono 3 risposte salvate prima degli account.';
    if (!await tab.attendi(testoVisibile(avviso), REAZIONE)) { v.push({ gruppo: g, nome: '«Più tardi»: l\'avviso c\'e\'', ok: false, extra: `«${avviso}» non si vede` }); return; }
    const prima = await c.conservato(ctx.sito, tab);
    await clicca(tab, 'Più tardi');
    const via = await tab.attendi(js(`return !document.body.innerText.includes(${q(avviso)});`), REAZIONE);
    let nuovo = [];
    const niente = await maiPer(async () => {
      const ora = await c.conservato(ctx.sito, tab);
      nuovo = [...ora.local.filter((e) => !prima.local.some((x) => x[0] === e[0])).map((e) => 'localStorage ' + e[0]),
        ...ora.session.map((e) => 'sessionStorage ' + e[0]), ...ora.idb.filter((n) => !prima.idb.includes(n)).map((n) => 'IndexedDB ' + n),
        ...ora.cookie.map((x) => 'cookie ' + x.nome)];
      return nuovo.length > 0;
    });
    v.push({ gruppo: g, nome: '«Più tardi» nasconde l\'avviso senza scrivere niente nel browser', ok: via && niente, extra: via ? 'scritto ' + nuovo.join(', ') : 'l\'avviso resta' });
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'e dopo una ricarica l\'avviso torna', ok: await tab.attendi(testoVisibile(avviso), REAZIONE), extra: '«Più tardi» e\' diventato un «mai piu\'»' });
  } finally { await c.chiudi(); }
}

async function c09fallita(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    await scriviVecchio(c, ctx, righeDi(`f${++serie}`, 3));
    const tab = await c.apri(ctx.sito + '/app', { prima: VECCHIO_FALLITO });
    await tab.attendi(PRONTO, CARICO);
    const detto = await tab.attendi(testoVisibile(LETTURA_NO), REAZIONE);
    v.push({ gruppo: g, nome: 'una lettura fallita dell\'archivio di prima lo dice, con «Riprova», e non diventa «nessuna risposta»', ok: detto && await tab.valuta(pulsante('Riprova')) && !await tab.valuta(testoRe(/ci sono \d+ risposte salvate prima/)),
      extra: detto ? 'manca «Riprova», o si vede un conteggio' : `«${LETTURA_NO}» non si vede` });
    const n = await c.voci(ctx.sito, 'open-patente-nautica', tab);
    v.push({ gruppo: g, nome: 'e l\'archivio resta com\'era', ok: !!n && n.righe === 3, extra: `IndexedDB ${JSON.stringify(n)}` });
  } finally { await c.chiudi(); }
}

// --- C-10: un file dei progressi ----------------------------------------------------------

function fileDiProva(prefisso) {
  const [a, b2, c] = righeDi(prefisso, 3);
  const righe = [a, b2, c,
    { _t: 'g', uid: `${prefisso}-tag`, attempt_uid: a.uid, tag: 'N' },   // un tag senza data: valido (R-ACC-08)
    { ...a },                                                            // lo stesso uid due volte
    { ...righeDi(prefisso, 1, { da: 10 })[0], ts: 'boh' },               // data non valida
    { ...righeDi(prefisso, 1, { da: 11 })[0], item_id: 'base-999999' },  // quesito sconosciuto
  ];
  return { app: 'open-patente-nautica', versione: '0.19.0', righe, segPunti: { notturni: { migliore: 7, giocate: 2 }, diurni: { migliore: 3, giocate: 9 } } };
}

async function c10(b, ctx, v, parte) {
  const g = 'C-10';
  const vuole = (x) => !parte || parte === x;
  if (vuole('senza')) await fermaAlPrimo(v, (w) => c10senza(b, ctx, w, g));
  if (vuole('file')) await fermaAlPrimo(v, (w) => c10file(b, ctx, w, g));
  if (vuole('segnali')) await fermaAlPrimo(v, (w) => c10segnali(b, ctx, w, g));
}

async function c10senza(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    await clic(tab, '[data-v="info"]');
    const rotto = ctx.file('rotto.json', '{ questo non e\' JSON');
    await tab.caricaFile('#importa-file', rotto);
    v.push({ gruppo: g, nome: 'un file illeggibile lo dice', ok: await tab.attendi(testoVisibile(FILE_NO), REAZIONE), extra: `«${FILE_NO}» non si vede` });
    await tab.caricaFile('#importa-file', ctx.file('progressi.json', JSON.stringify(fileDiProva(`s${++serie}`))));
    const detto = await tab.attendi(testoVisibile(FILE_SENZA), REAZIONE);
    let trovato = [];
    const fermo = await maiPer(async () => { trovato = personale(await c.conservato(ctx.sito, tab), ctx.api); return trovato.length > 0 || tab.richieste.some((r) => /\/v1\//.test(r.url)); });
    v.push({ gruppo: g, nome: 'senza account il file non parte e non si conserva: si chiede di entrare', ok: detto && fermo,
      extra: !detto ? `«${FILE_SENZA}» non si vede` : trovato.length ? 'conservato ' + trovato.join(' · ') : 'una richiesta all\'API senza account' });
  } finally { await c.chiudi(); }
}

async function c10file(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c10');
  ctx.segnali(K.email, { notturni: { migliore: 9, giocate: 1 } });
  // Il nome si fissa una volta: `serie` la muovono anche i gruppi delle altre corsie.
  const nomeFile = `progressi-${serie}.json`;
  const FILE = fileDiProva(`f${serie}`);
  const percorso = ctx.file(nomeFile, JSON.stringify(FILE));
  const conti = (presenti) => { const f = E.fondiArchivio(presenti, FILE.righe, { quesiti: ID_BANCA }); return `${f.nuove} nuove · ${f.gia} già presenti · ${f.scartate} scartate`; };
  const valide = E.fondiArchivio([], FILE.righe, { quesiti: ID_BANCA });
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'file: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await clic(tab, '[data-v="info"]');
    await tab.caricaFile('#importa-file', percorso);
    const attesi = conti([]);
    const anteprima = await tab.attendi(testoVisibile(attesi), REAZIONE);
    v.push({ gruppo: g, nome: 'l\'anteprima dice i conteggi del motore, con il nome del file e l\'account', ok: anteprima && await tab.valuta(testoVisibile(K.email)) && await tab.valuta(testoVisibile(nomeFile)),
      extra: anteprima ? 'manca l\'email di destinazione o il nome del file' : `«${attesi}» non si vede: ${JSON.stringify((await tab.valuta(testoRe(/\d+ nuove · \d+ già presenti · \d+ scartate/)))?.[0] ?? 'nessun conteggio')}` });
    v.push({ gruppo: g, nome: 'all\'anteprima niente e\' partito', ok: ctx.righeDi(K.email) === 0, extra: `l'account ha ${ctx.righeDi(K.email)} righe` });
    if (!anteprima) return;
    await clicca(tab, 'Importa nel mio account');
    const arrivate = await finche(() => ctx.righeDi(K.email) === valide.nuove, REAZIONE) && await tab.attendi(testoVisibile(attesi), REAZIONE) && await tab.valuta(pulsante('Scarica le righe non importate'));
    v.push({ gruppo: g, nome: 'importato: le righe valide sul server, il riepilogo unico e gli scarti da scaricare', ok: arrivate,
      extra: `il server ha ${ctx.righeDi(K.email)} righe su ${valide.nuove}; riepilogo e «Scarica le righe non importate» ${await tab.valuta(pulsante('Scarica le righe non importate')) ? '' : 'non '}ci sono` });
    const seg = ctx.segnaliDi(K.email);
    v.push({ gruppo: g, nome: 'i Segnali del file si fondono con il massimo, non si sommano', ok: seg.notturni?.migliore === 9 && seg.notturni?.giocate === 2 && seg.diurni?.migliore === 3 && seg.diurni?.giocate === 9,
      extra: `sul server ${JSON.stringify(seg)}; attesi notturni 9/2 e diurni 3/9` });
    const n = c.scaricati().length;
    await clicca(tab, 'Scarica le righe non importate');
    const scarti = await scaricato(c, n);
    const attesiScarti = new Set(FILE.righe.filter((r) => E.validaRiga(r, { quesiti: ID_BANCA })).map((r) => r.uid));
    v.push({ gruppo: g, nome: 'le righe non importate si scaricano', ok: !!scarti && stessi(uidDi(scarti.dati), attesiScarti),
      extra: scarti ? `nel file ${[...uidDi(scarti.dati)].join(', ')}` : 'nessun file' });
    // Lo stesso file un'altra volta: soltanto gia' presenti, e niente di nuovo sul server.
    const presenti = ctx.righeServer(K.email);
    const ancora = conti(presenti);
    await tab.caricaFile('#importa-file', percorso);
    const seconda = await tab.attendi(testoVisibile(ancora), REAZIONE);
    if (seconda) await clicca(tab, 'Importa nel mio account');
    v.push({ gruppo: g, nome: 'reimportato, il file porta solo righe gia\' presenti, e il server non cambia', ok: seconda && await maiPer(() => ctx.righeDi(K.email) !== valide.nuove),
      extra: seconda ? `il server ha ${ctx.righeDi(K.email)} righe` : `«${ancora}» non si vede` });
  } finally { await c.chiudi(); }
}

async function c10segnali(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c10s');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'Segnali: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await tab.offline(true);
    const giocata = await partitaSegnali(tab, [], g, '');
    const detto = giocata && await tab.attendi(testoVisibile(DA_INVIARE_SEG), REAZIONE);
    // Si torna online solo dopo che l'invio dei punteggi e' fallito: prima, sotto
    // carico, partiva gia' online, e una pagina che li tiene in memoria passava.
    await finche(() => tab.richieste.some((r) => r.metodo === 'PUT' && new URL(r.url).pathname === '/v1/profilo' && r.finita), REAZIONE);
    v.push({ gruppo: g, nome: 'una partita offline con l\'account: «Punteggi da inviare»', ok: detto && !Object.keys(ctx.segnaliDi(K.email)).length,
      extra: !giocata ? 'la partita non arriva in fondo' : detto ? 'il server ha gia\' i punteggi' : `«${DA_INVIARE_SEG}» non si vede` });
    await tab.offline(false);
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    const arrivati = await finche(() => (ctx.segnaliDi(K.email).notturni?.giocate ?? 0) >= 1, REAZIONE);
    v.push({ gruppo: g, nome: 'dopo una ricarica con la rete i punteggi arrivano sul server', ok: arrivati,
      extra: `sul server ${JSON.stringify(ctx.segnaliDi(K.email))}: i punteggi da inviare non sono sopravvissuti alla ricarica` });
  } finally { await c.chiudi(); }
}

// --- C-12: i limiti di un invio e della ricezione ----------------------------------------

async function c12(b, ctx, v, parte) {
  const g = 'C-12';
  const vuole = (x) => !parte || parte === x;
  if (vuole('lotti')) await fermaAlPrimo(v, (w) => c12lotti(b, ctx, w, g));
  if (vuole('413')) await fermaAlPrimo(v, (w) => c12troppo(b, ctx, w, g));
  if (vuole('ricezione')) await fermaAlPrimo(v, (w) => c12ricezione(b, ctx, w, g));
}

async function c12lotti(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c12');
  // 2.500 righe da un chilo e mezzo: piu' di 2.000 righe e piu' di 2 MiB anche
  // nelle prime 2.000, quindi lotti tagliati dai byte e non solo dal numero
  // (§7.2). Con solo le prime 1.600 grandi una fetta da 2.000 passava lo
  // stesso: IndexedDB le rende in ordine di uid, e le mescola (misurato).
  const righe = righeDi(`l${serie}`, 2500, { pad: 1300 });
  const byte = Buffer.byteLength(JSON.stringify(righe));
  const percorso = ctx.file(`grande-${serie}.json`, JSON.stringify({ app: 'rotta-giusta', righe }));
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'lotti: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await clic(tab, '[data-v="info"]');
    await tab.caricaFile('#importa-file', percorso);
    await tab.attendi(pulsante('Importa nel mio account'), REAZIONE);
    await clicca(tab, 'Importa nel mio account');
    const tutte = await finche(() => ctx.righeDi(K.email) === righe.length, 4 * REAZIONE);
    const detto = (await tab.attendiValore(testoRe(SALVATE), (x) => !!x && Number(x[1]) === righe.length, REAZIONE)).ok;
    const invii = richiesteA(tab, 'POST', '/v1/righe').length;
    v.push({ gruppo: g, nome: `${righe.length} righe e ${(byte / 1048576).toFixed(1)} MiB arrivano tutte, in lotti che il server accetta`, ok: tutte && detto && invii >= 2,
      extra: `il server ha ${ctx.righeDi(K.email)} righe su ${righe.length}, in ${invii} invii; «salvate» ${detto ? '' : 'non '}si vede` });
  } finally { await c.chiudi(); }
}

async function c12troppo(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  const MSG = 'La richiesta è troppo grande: al più 2 MiB. Niente è stato salvato.';
  try {
    const tab = await c.apri(ctx.sito + '/app');
    let primo = true;
    await tab.intercetta(`${ctx.api}/v1/righe`, (r) => (r.method === 'POST' && primo ? (primo = false, finti(ctx, 413, { errore: 'troppo_grande', messaggio: MSG })) : null));
    if (!await unaRisposta(tab, v, g, '413: ')) return;
    const email = `c12-${++serie}@esempio.it`;
    await registraDalRiepilogo(tab, email);
    const letto = await tab.attendi(testoVisibile(MSG), REAZIONE);
    const zitto = !await tab.valuta(testoRe(SALVATE));
    v.push({ gruppo: g, nome: 'un 413 si legge, e niente «salvate»', ok: letto && zitto && ctx.righeDi(email) === 0,
      extra: !letto ? `il messaggio del server «${MSG}» non si vede` : `«salvate» ${zitto ? 'non ' : ''}si vede; il server ha ${ctx.righeDi(email)} righe` });
    await clicca(tab, 'Riprova l\'invio');
    v.push({ gruppo: g, nome: 'e riprovando arrivano', ok: await finche(() => ctx.righeDi(email) === 1, REAZIONE) && (await tab.attendiValore(testoRe(SALVATE), Boolean, REAZIONE)).ok,
      extra: `il server ha ${ctx.righeDi(email)} righe dopo «Riprova l'invio»` });
  } finally { await c.chiudi(); }
}

async function c12ricezione(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c12r');
  ctx.aggiungi(K.email, righeDi(`r${serie}`, 5200));
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'ricezione: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    const copia = () => nellaCopia(c, ctx, tab, K.chiave);
    const tutte = await finche(async () => await copia() === 5200, 4 * REAZIONE);
    const pagine = richiesteA(tab, 'GET', '/v1/righe').length;
    v.push({ gruppo: g, nome: 'oltre 5.000 righe si ricevono tutte, in piu\' pagine', ok: tutte && pagine >= 2, extra: `nella copia ${await copia()} righe su 5200, in ${pagine} ricezioni` });
    // Un altro dispositivo aggiunge tre righe; poi qui una risposta. La conferma
    // dell'invio dice un'`ultima_seq` che le comprende: non e' un cursore (R-ACC-31).
    ctx.aggiungi(K.email, righeDi(`r${serie}x`, 3));
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    const tre = await finche(async () => await copia() === 5204, 2 * REAZIONE);
    v.push({ gruppo: g, nome: 'dopo un invio le righe di un altro dispositivo arrivano lo stesso: l\'invio non sposta il cursore', ok: tre && ctx.righeDi(K.email) === 5204,
      extra: `nella copia ${await copia()} righe, sul server ${ctx.righeDi(K.email)}: attese 5204` });
  } finally { await c.chiudi(); }
}

// --- C-13: un azzeramento fatto altrove ---------------------------------------------------

async function c13(b, ctx, v, parte) {
  const g = 'C-13';
  const vuole = (x) => !parte || parte === x;
  if (vuole('invio')) await fermaAlPrimo(v, (w) => c13invio(b, ctx, w, g));
  if (vuole('ricezione')) await fermaAlPrimo(v, (w) => c13ricezione(b, ctx, w, g));
}

async function c13invio(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c13');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    // La ricezione non passa: l'azzeramento si scopre solo inviando. Senza,
    // sotto carico la ricezione dopo il primo invio lo scopriva prima (misurato):
    // e' il caso della parte «ricezione», non di questa.
    await tab.intercetta(`${ctx.api}/v1/righe?*`, (r) => (r.method === 'GET' ? { fallisci: 'ConnectionReset' } : null));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'invio: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    await finche(() => ctx.righeDi(K.email) === 1, REAZIONE);
    ctx.azzera(K.email);
    await clic(tab, '#r-next');
    await tab.attendi(js(`return !document.querySelector('#r-ans .ans.ok');`), REAZIONE);
    await rispondiQuiz(tab, [], g, '');
    const detto = await tab.attendiValore(js(`const t = M().innerText; const m = t.match(/Qui ci sono (\\d+) rispost/); return new RegExp(${q(AZZERATI.source)}, 'i').test(t) && m ? Number(m[1]) : null;`), (x) => x !== null, REAZIONE);
    v.push({ gruppo: g, nome: 'scoperto inviando: la pagina dice dell\'azzeramento e quante risposte di qui non sono salvate', ok: detto.ok && detto.valore === 1
      && await tab.valuta(pulsante('Scarica e passa al nuovo archivio')) && await tab.valuta(pulsante('Scarta e passa al nuovo archivio')) && await tab.valuta(pulsante('Decidi più tardi')),
      extra: detto.ok ? `dice ${detto.valore} risposte non salvate, ne aspettava 1, o mancano le tre scelte (§10)` : 'nessuna frase sull\'azzeramento con le risposte non salvate' });
    const invii = richiesteA(tab, 'POST', '/v1/righe').length;
    v.push({ gruppo: g, nome: 'finche\' non si sceglie, niente rientra e niente riparte', ok: await maiPer(() => ctx.righeDi(K.email) > 0 || richiesteA(tab, 'POST', '/v1/righe').length > invii),
      extra: `il server ha ${ctx.righeDi(K.email)} righe; invii ${invii} → ${richiesteA(tab, 'POST', '/v1/righe').length}` });
    await clicca(tab, 'Scarta e passa al nuovo archivio');
    await tab.attendi(pulsante('Sì, scartale e passa al nuovo archivio'), REAZIONE);
    const confermata = await tab.valuta(testoVisibile('andranno perse'));
    await clicca(tab, 'Sì, scartale e passa al nuovo archivio');
    const vuota = await finche(async () => await nellaCopia(c, ctx, tab, K.chiave) === 0, REAZIONE);
    v.push({ gruppo: g, nome: 'scartare chiede di confermare la perdita, poi la copia si svuota', ok: confermata && vuota, extra: confermata ? `nella copia ${await nellaCopia(c, ctx, tab, K.chiave)} righe` : 'nessuna conferma della perdita prima di scartare' });
    await clic(tab, '#r-next');
    await tab.attendi(js(`return !document.querySelector('#r-ans .ans.ok');`), REAZIONE);
    await rispondiQuiz(tab, [], g, '');
    v.push({ gruppo: g, nome: 'poi si riparte: la risposta nuova entra, le scartate no', ok: await finche(() => ctx.righeDi(K.email) === 1, REAZIONE) && await maiPer(() => ctx.righeDi(K.email) !== 1),
      extra: `il server ha ${ctx.righeDi(K.email)} righe, ne aspettava 1` });
  } finally { await c.chiudi(); }
}

async function c13ricezione(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c13r');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'ricezione: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    // L'azzeramento va scoperto dopo la ricarica, ricevendo: prima si aspetta
    // che la pagina abbia finito di parlare con l'API. Senza, a volte la
    // ricezione che segue l'invio lo scopriva ancora prima della ricarica, e
    // dopo la pagina mostrava la scelta gia' rimandata — un rosso del banco,
    // non della pagina: misurato il 30 settembre 2026, 1 giro su 14 (P-40).
    // Ferma vuol dire nessuna richiesta aperta e nessuna nuova per 300 ms: fra la
    // conferma dell'invio e la ricezione che la segue c'e' un attimo di silenzio.
    const versoApi = () => tab.richieste.filter((r) => r.url.startsWith(ctx.api));
    const quieta = await finche(async () => {
      if (ctx.righeDi(K.email) !== 1 || !versoApi().every((r) => r.finita)) return false;
      const n = versoApi().length;
      await pausa(300);
      return versoApi().length === n && versoApi().every((r) => r.finita);
    }, REAZIONE);
    if (!quieta) {
      v.push({ gruppo: g, nome: 'ricezione: la risposta arriva sul server e la pagina smette di inviare', ok: false,
        extra: `server ${ctx.righeDi(K.email)} righe; richieste all'API ancora aperte: ${versoApi().filter((r) => !r.finita).map((r) => r.metodo + ' ' + r.url).join(', ')}` });
      return;
    }
    ctx.azzera(K.email);
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    const detto = await tab.attendi(js(`return new RegExp(${q(AZZERATI.source)}, 'i').test(M().innerText);`), REAZIONE) && await tab.valuta(pulsante('Carica il nuovo archivio'));
    v.push({ gruppo: g, nome: 'scoperto ricevendo, senza risposte da salvare: la pagina lo dice e chiede di caricare il nuovo archivio', ok: detto,
      extra: 'dopo l\'azzeramento la ricezione non dice niente, o manca «Carica il nuovo archivio»; in schermata: '
        + (await tab.valuta(js(`const m = M(); return (m === document ? document.body : m).innerText.replace(/\\s+/g, ' ').slice(0, 400);`))) });
    v.push({ gruppo: g, nome: 'e prima della scelta la copia non cambia', ok: await maiPer(async () => await nellaCopia(c, ctx, tab, K.chiave) !== 1), extra: `nella copia ${await nellaCopia(c, ctx, tab, K.chiave)} righe` });
    // «Decidi più tardi», una risposta, poi la scelta di nuovo: ora c'e' una
    // risposta da perdere, e «Carica il nuovo archivio» non la butta in silenzio.
    await clicca(tab, 'Decidi più tardi');
    const rimandata = await tab.attendi(pulsante('Scegli adesso'), REAZIONE);
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    await clicca(tab, 'Scegli adesso');
    const contata = await tab.attendiValore(js(`const m = M().innerText.match(/Qui ci sono (\\d+) rispost/); return m ? Number(m[1]) : null;`), (x) => x === 1, REAZIONE);
    v.push({ gruppo: g, nome: 'rimandata la scelta, resta raggiungibile, e riaprendola conta la risposta data intanto', ok: rimandata && contata.ok && !await tab.valuta(pulsante('Carica il nuovo archivio')),
      extra: !rimandata ? 'dopo «Decidi più tardi» nessun «Scegli adesso»' : `riaperta dice ${contata.valore ?? 'nessun numero'} risposte non salvate, ne aspettava 1, o offre ancora «Carica il nuovo archivio»` });
    await clicca(tab, 'Scarta e passa al nuovo archivio');
    await tab.attendi(pulsante('Sì, scartale e passa al nuovo archivio'), REAZIONE);
    await clicca(tab, 'Sì, scartale e passa al nuovo archivio');
    v.push({ gruppo: g, nome: 'scartate, la copia e\' quella del server', ok: await finche(async () => await nellaCopia(c, ctx, tab, K.chiave) === 0, REAZIONE) && ctx.righeDi(K.email) === 0,
      extra: `nella copia ${await nellaCopia(c, ctx, tab, K.chiave)} righe, sul server ${ctx.righeDi(K.email)}` });
  } finally { await c.chiudi(); }
}

// --- C-14: il ripristino del server --------------------------------------------------------

async function c14(b, ctx, v) {
  const g = 'C-14';
  return fermaAlPrimo(v, (w) => c14giro(b, ctx, w, g));
}

async function c14giro(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c14');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    await finche(() => ctx.righeDi(K.email) === 1, REAZIONE);
    const copia = ctx.copia();
    await clic(tab, '#r-next');
    await tab.attendi(js(`return !document.querySelector('#r-ans .ans.ok');`), REAZIONE);
    await rispondiQuiz(tab, [], g, '');
    await finche(() => ctx.righeDi(K.email) === 2, REAZIONE);
    await ctx.ripristina(copia);
    v.push({ gruppo: g, nome: 'il ripristino di una copia di prima toglie dal server la risposta accolta dopo', ok: ctx.righeDi(K.email) === 1, extra: `dopo il ripristino il server ha ${ctx.righeDi(K.email)} righe` });
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'la pagina vede l\'epoca nuova e rimanda la risposta persa', ok: await finche(() => ctx.righeDi(K.email) === 2, 2 * REAZIONE),
      extra: `il server ha ${ctx.righeDi(K.email)} righe, ne aspettava 2` });
    const d = await b.nuovoContesto();
    try {
      const t2 = await d.apri(ctx.sito + '/app');
      await dentro(t2, K);
      v.push({ gruppo: g, nome: 'e un altro dispositivo le riceve tutte e due', ok: await finche(async () => await nellaCopia(d, ctx, t2, K.chiave) === 2, REAZIONE),
        extra: `nella copia dell'altro dispositivo ${await nellaCopia(d, ctx, t2, K.chiave)} righe` });
    } finally { await d.chiudi(); }
  } finally { await c.chiudi(); }
}

// --- C-15, il resto: il 401 all'uscita e «Esci da tutti i dispositivi» ----------------------

// Un'uscita passa dalla catena d'invio, dal lucchetto delle altre schede (fino a
// 3 s) e dalla cancellazione dell'archivio: sotto carico — dieci `yes`, il 29
// settembre 2026 — la scadenza di una reazione piu' il lucchetto non bastava, e
// un passo uguale al riferimento e' uscito rosso una volta in una rottura.
const USCITA = CARICO + 3000;

async function c15scaduta(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c15s');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.intercetta(`${ctx.api}/v1/uscita`, (r) => (r.method === 'POST' ? finti(ctx, 401, { errore: 'sessione', messaggio: 'Non sei dentro.' }) : null));
    if (!await dentro(tab, U)) { v.push({ gruppo: g, nome: '401: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await esciDa(tab);
    const fuori = await finche(async () => await tab.valuta(pulsante('Accedi')) && !copieAccount(await c.conservato(ctx.sito, tab)).length, USCITA);
    v.push({ gruppo: g, nome: 'un 401 all\'uscita: la sessione non c\'era piu\', e la copia si pulisce lo stesso', ok: fuori && !await tab.valuta(testoVisibile(SERVE_RETE)),
      extra: fuori ? `si vede «${SERVE_RETE}»: il 401 e' stato preso per la rete che manca` : `copie ${copieAccount(await c.conservato(ctx.sito, tab)).join(', ') || 'nessuna'}, «Accedi» ${await tab.valuta(pulsante('Accedi')) ? '' : 'non '}c'e'; in schermata: `
        + await tab.valuta(js(`const m = M(); return (m === document ? document.body : m).innerText.replace(/\\s+/g, ' ').slice(0, 300);`)) });
    // Di nuovo dentro; una risposta offline; poi la sessione revocata altrove.
    await entraCome(tab, U);
    await tab.attendi(pulsante('Account'), REAZIONE);
    await tab.offline(true);
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    await pausa(800);
    ctx.revoca(U.email);
    await tab.offline(false);
    const righe = ctx.righeDi(U.email);
    await esciDa(tab);
    const detto = await tab.attendi(js(`return new RegExp(${q(RESTA.source)}).test(document.body.innerText);`), REAZIONE);
    const tenuta = detto && await maiPer(async () => !copieAccount(await c.conservato(ctx.sito, tab)).length, 1500);
    v.push({ gruppo: g, nome: 'con la sessione revocata e una risposta non inviata: si dice, e la copia resta finche\' non si sceglie', ok: tenuta,
      extra: detto ? 'la copia e\' sparita senza una scelta' : '«N risposte non sono sul server» non compare' });
    const n = c.scaricati().length;
    await clicca(tab, 'Scarica le risposte non salvate');
    const file = await scaricato(c, n);
    v.push({ gruppo: g, nome: 'la risposta non inviata si scarica', ok: !!file && uidDi(file.dati).size === 1, extra: file ? `nel file ${uidDi(file.dati).size} righe` : 'nessun file' });
    await tab.attendi(pulsante('Ho conservato il file: esci e cancella la copia da questo dispositivo'), REAZIONE);
    await clicca(tab, 'Ho conservato il file: esci e cancella la copia da questo dispositivo');
    const pulito = await finche(async () => !copieAccount(await c.conservato(ctx.sito, tab)).length && await tab.valuta(pulsante('Accedi')), USCITA);
    v.push({ gruppo: g, nome: 'dopo la scelta esplicita la copia si cancella, e la risposta non va in nessun account', ok: pulito && ctx.righeDi(U.email) === righe,
      extra: `copie ${copieAccount(await c.conservato(ctx.sito, tab)).join(', ') || 'nessuna'}, righe dell'account ${righe} → ${ctx.righeDi(U.email)}` });
  } finally { await c.chiudi(); }
}

async function c15ovunque(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c15o');
  const c = await b.nuovoContesto(), d = await b.nuovoContesto();
  try {
    const t1 = await c.apri(ctx.sito + '/app'), t2 = await d.apri(ctx.sito + '/app');
    if (!await dentro(t1, U) || !await dentro(t2, U)) { v.push({ gruppo: g, nome: 'ovunque: si entra da due dispositivi', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await clicca(t1, 'Account');
    await t1.attendi(pulsante('Esci da tutti i dispositivi'), REAZIONE);
    await clicca(t1, 'Esci da tutti i dispositivi');
    const fuori = await finche(async () => ctx.sessioniDi(U.email) === 0 && await t1.valuta(pulsante('Accedi')) && !copieAccount(await c.conservato(ctx.sito, t1)).length, USCITA);
    v.push({ gruppo: g, nome: '«Esci da tutti i dispositivi» chiude ogni sessione sul server, e qui pulisce la copia', ok: fuori,
      extra: `sessioni sul server ${ctx.sessioniDi(U.email)}; qui ${await t1.valuta(pulsante('Accedi')) ? '«Accedi»' : 'ancora l\'account'}, copie ${copieAccount(await c.conservato(ctx.sito, t1)).join(', ') || 'nessuna'}` });
    await t2.ricarica();
    await t2.attendi(PRONTO, CARICO);
    const scoperto = await t2.attendi(testoVisibile(NON_VALIDO), REAZIONE);
    v.push({ gruppo: g, nome: 'l\'altro dispositivo lo scopre con un 401, e la sua copia resta, congelata', ok: scoperto && copieAccount(await d.conservato(ctx.sito, t2)).length === 1,
      extra: scoperto ? `copie dell'altro dispositivo: ${copieAccount(await d.conservato(ctx.sito, t2)).join(', ') || 'nessuna'}: una pulizia remota inventata` : `«${NON_VALIDO}» non si vede` });
  } finally { await c.chiudi(); await d.chiudi(); }
}

// --- C-16: la data d'esame dopo la registrazione -------------------------------------------

const ONBOARDING = 'Hai una data d\'esame?';

async function c16(b, ctx, v, parte) {
  const g = 'C-16';
  const vuole = (x) => !parte || parte === x;
  if (vuole('proposta')) await fermaAlPrimo(v, (w) => c16proposta(b, ctx, w, g));
  if (vuole('salto')) await fermaAlPrimo(v, (w) => c16salto(b, ctx, w, g));
  if (vuole('fallito')) await fermaAlPrimo(v, (w) => c16fallito(b, ctx, w, g));
  if (vuole('accesso')) await fermaAlPrimo(v, (w) => c16accesso(b, ctx, w, g));
}

/** Una prova, la registrazione, e il passo della data (§11.1). */
async function finoAllaData(b, c, ctx, v, g, prefisso, { data } = {}) {
  const tab = await c.apri(ctx.sito + '/app');
  await tab.attendi(PRONTO, CARICO);
  if (data) await tab.valuta(js(`const d = document.querySelector('#esame-data'); d.value = ${q(data)}; d.dispatchEvent(new Event('change', { bubbles: true })); return true;`));
  if (!await unaRisposta(tab, v, g, prefisso)) return null;
  const email = `c16-${++serie}@esempio.it`;
  await registraDalRiepilogo(tab, email);
  const passo = await tab.attendi(testoVisibile(ONBOARDING), 2 * REAZIONE);
  v.push({ gruppo: g, nome: `${prefisso}dopo il salvataggio la domanda sulla data`, ok: passo, extra: `«${ONBOARDING}» non compare dopo la registrazione` });
  return passo ? { tab, email } : null;
}

const valoreData = js(`const d = ${campo('Data d\'esame')}; return d ? d.value : null;`);

async function c16proposta(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    // Una data passata, scritta nella pagina prima di registrarsi: si propone,
    // si salva com'e' e solo al clic (§11.1).
    const x = await finoAllaData(b, c, ctx, v, g, 'data della pagina: ', { data: '2026-01-10' });
    if (!x) return;
    v.push({ gruppo: g, nome: 'la data scritta nella pagina si propone', ok: await x.tab.valuta(valoreData) === '2026-01-10', extra: `nel campo «${await x.tab.valuta(valoreData)}»` });
    v.push({ gruppo: g, nome: 'e non si salva prima del clic', ok: await maiPer(() => ctx.conto(x.email).data_esame !== null), extra: `sul server ${ctx.conto(x.email).data_esame}` });
    await clicca(x.tab, 'Salva la data');
    v.push({ gruppo: g, nome: 'al clic si salva com\'e\', anche passata, e la pagina lo dice', ok: await finche(() => ctx.conto(x.email).data_esame === '2026-01-10', REAZIONE) && await x.tab.attendi(testoVisibile('Data salvata'), REAZIONE),
      extra: `sul server ${ctx.conto(x.email).data_esame}; «Data salvata» ${await x.tab.valuta(testoVisibile('Data salvata')) ? '' : 'non '}si vede` });
  } finally { await c.chiudi(); }
}

async function c16salto(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const x = await finoAllaData(b, c, ctx, v, g, 'senza data: ');
    if (!x) return;
    v.push({ gruppo: g, nome: 'senza una data nella pagina il campo e\' vuoto: nessuna data inventata', ok: await x.tab.valuta(valoreData) === '', extra: `nel campo «${await x.tab.valuta(valoreData)}»` });
    await clicca(x.tab, 'Continua senza data');
    const chiuso = await x.tab.attendi(js(`return !document.body.innerText.includes(${q(ONBOARDING)});`), REAZIONE);
    v.push({ gruppo: g, nome: '«Continua senza data» chiude il passo e il server resta senza data', ok: chiuso && await maiPer(() => ctx.conto(x.email).data_esame !== null),
      extra: chiuso ? `sul server ${ctx.conto(x.email).data_esame}` : 'il passo resta aperto' });
  } finally { await c.chiudi(); }
}

async function c16fallito(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const x = await finoAllaData(b, c, ctx, v, g, 'PUT fallito: ');
    if (!x) return;
    await x.tab.intercetta(`${ctx.api}/v1/profilo`, (r) => (r.method === 'PUT' ? { fallisci: 'ConnectionReset' } : null));
    await imposta(x.tab, 'Data d\'esame', '2027-06-01');
    await clicca(x.tab, 'Salva la data');
    const detto = await x.tab.attendi(testoVisibile(DATA_NO), REAZIONE);
    v.push({ gruppo: g, nome: 'un salvataggio della data fallito lo dice, e non dice «Data salvata»', ok: detto && !await x.tab.valuta(testoVisibile('Data salvata')) && ctx.conto(x.email).data_esame === null,
      extra: detto ? `«Data salvata» si vede, o il server ha ${ctx.conto(x.email).data_esame}` : `«${DATA_NO}» non si vede` });
  } finally { await c.chiudi(); }
}

async function c16accesso(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c16a');
  ctx.dataEsame(K.email, '2027-03-03');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'accesso: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    v.push({ gruppo: g, nome: 'entrando in un account che ha la data, il passo non si ripete e la data resta', ok: await maiPer(async () => await tab.valuta(testoVisibile(ONBOARDING)) || ctx.conto(K.email).data_esame !== '2027-03-03'),
      extra: `sul server ${ctx.conto(K.email).data_esame}; la domanda ${await tab.valuta(testoVisibile(ONBOARDING)) ? 'compare' : 'non compare'}` });
    v.push({ gruppo: g, nome: 'e la pagina mostra quella del server', ok: await tab.valuta(js(`return document.querySelector('#esame-data').value;`)) === '2027-03-03',
      extra: `#esame-data dice «${await tab.valuta(js(`return document.querySelector('#esame-data').value;`))}»` });
  } finally { await c.chiudi(); }
}

// --- C-17: l'export, e le origini senza API --------------------------------------------------

const ALTROVE = 'https://rottagiusta.it/app';

async function c17(b, ctx, v, parte) {
  const g = 'C-17';
  const vuole = (x) => !parte || parte === x;
  if (vuole('export')) await fermaAlPrimo(v, (w) => c17export(b, ctx, w, g));
  if (vuole('origine')) await fermaAlPrimo(v, (w) => c17origine(b, ctx, w, g));
}

async function c17export(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c17');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    let blocca = false;
    await tab.intercetta(`${ctx.api}/v1/righe*`, () => (blocca ? { fallisci: 'ConnectionReset' } : null));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'export: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    await finche(() => ctx.righeDi(K.email) === 1, REAZIONE);
    // Da qui la rete delle righe non passa: una riga arriva sul server da un
    // altro dispositivo e questa pagina non la riceve; la risposta dopo resta qui.
    blocca = true;
    const altra = righeDi(`e${serie}`, 1)[0];
    ctx.aggiungi(K.email, [altra]);
    await clic(tab, '#r-next');
    await tab.attendi(js(`return !document.querySelector('#r-ans .ans.ok');`), REAZIONE);
    await rispondiQuiz(tab, [], g, '');
    await chiudiQuiz(tab, [], g, '');
    await clic(tab, '[data-ciclo="ritorno"]');
    await clic(tab, '[data-v="info"]');
    const n = c.scaricati().length;
    await clicca(tab, 'Scarica i tuoi progressi');
    const file = await scaricato(c, n, 2 * REAZIONE);
    const server = new Set(ctx.righeServer(K.email).map((r) => String(r.uid)));
    v.push({ gruppo: g, nome: 'il file scaricato e\' l\'export del server, con la riga dell\'altro dispositivo', ok: !!file && stessi(uidDi(file.dati), server) && server.has(altra.uid),
      extra: file ? `nel file ${uidDi(file.dati).size} righe, sul server ${server.size}; la riga dell'altro dispositivo ${uidDi(file.dati).has(altra.uid) ? 'c\'e\'' : 'manca'}` : 'nessun file' });
    const detto = await tab.attendi(testoVisibile('Il file del server non contiene ancora le 1 risposte da inviare'), REAZIONE);
    v.push({ gruppo: g, nome: 'e la pagina dice quante risposte da inviare il file non contiene', ok: detto, extra: '«Il file del server non contiene ancora le 1 risposte da inviare» non si vede' });
    await clicca(tab, 'Scarica le risposte da inviare');
    const rec = await scaricato(c, n + 1);
    v.push({ gruppo: g, nome: 'le risposte da inviare si scaricano a parte', ok: !!rec && uidDi(rec.dati).size === 1 && ![...uidDi(rec.dati)].some((u) => server.has(u)),
      extra: rec ? `nel file di recupero ${uidDi(rec.dati).size} righe` : 'nessun file di recupero' });
  } finally { await c.chiudi(); }
}

async function c17origine(b, ctx, v, g) {
  // Un nome che non e' localhost ne' 127.0.0.1: per indirizzoApi() un'origine
  // senza API, come il vecchio .pages.dev (§3.1, §7).
  const sito = ctx.sito.replace('localhost', 'rotta.test');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    const link = js(`return [...document.querySelectorAll('a')].some((a) => V(a) && a.href === ${q(ALTROVE)});`);
    v.push({ gruppo: g, nome: 'su un\'origine senza API la pagina porta a rottagiusta.it, e non offre «Accedi»', ok: await tab.valuta(link) && !await tab.valuta(pulsante('Accedi')),
      extra: !await tab.valuta(link) ? `nessun link visibile a ${ALTROVE}` : 'si vede «Accedi»: un modulo destinato a fallire' });
    if (!await unaRisposta(tab, v, g, 'origine senza API: ')) return;
    v.push({ gruppo: g, nome: 'nel riepilogo nessun modulo d\'account: il link', ok: !await tab.valuta(pulsante('Crea un account e salva')) && await tab.valuta(link),
      extra: 'il riepilogo offre «Crea un account e salva», o manca il link' });
    let trovato = [];
    const niente = await maiPer(async () => { trovato = personale(await c.conservato(sito, tab), null); return trovato.length > 0; });
    const api = tab.richieste.filter((r) => /\/v1\//.test(r.url));
    v.push({ gruppo: g, nome: 'nessuna richiesta all\'API e niente di personale nel browser', ok: niente && !api.length && !await tab.valuta(passwordVisibile),
      extra: api.length ? api.map((r) => r.url).join(', ') : trovato.length ? trovato.join(' · ') : 'un campo password visibile' });
  } finally { await c.chiudi(); }
}

// --- il giro -------------------------------------------------------------------------

const GRUPPI = { 'C-01': c01, 'C-02': c02, 'C-03': c03, 'C-04': c04, 'C-05': c05, 'C-06': c06, 'C-07': c07, 'C-08': c08, 'C-09': c09,
  'C-10': c10, 'C-11': c11, 'C-12': c12, 'C-13': c13, 'C-14': c14, 'C-15': c15, 'C-16': c16, 'C-17': c17 };
// I gruppi che parlano con l'API: il server accetta una sola origine (§7.3),
// quindi girano uno alla volta sul sito principale. Gli altri girano in
// parallelo, ognuno con il suo sito e quindi con la sua origine.
const CON_API = new Set(['C-05', 'C-04', 'C-06', 'C-07', 'C-08', 'C-09', 'C-10', 'C-11', 'C-12', 'C-13', 'C-14', 'C-15', 'C-16', 'C-17']);
const SOLO_ALTRE = new Set(['C-14']);
const usaApi = (gr) => CON_API.has(gr.split(':')[0]);

async function servi(corrente) {
  const s = sito(corrente);
  await new Promise((ok) => s.listen(0, '127.0.0.1', ok));
  return { s, origine: `http://localhost:${s.address().port}`, chiudi: () => new Promise((ok) => s.close(ok)) };
}

/**
 * Un gruppo, o una sua parte: «C-06» li esegue tutti, «C-06:corsa» solo la
 * corsa fra schede. Le rotture chiedono solo la parte che rompono, cosi' non
 * pagano il resto del gruppo.
 */
async function gruppo(b, ctx, gr) {
  const v = [];
  const [nome, parte] = gr.split(':');
  try { await GRUPPI[nome](b, ctx, v, parte || null); } catch (e) { v.push({ gruppo: nome, nome: `il gruppo ${gr} si esegue`, ok: false, extra: e.message }); }
  return v;
}

/**
 * Una corsia dell'API: un sito, un server degli account con il suo database,
 * il suo orologio e la sua posta. Il server accetta una sola origine (§7.3),
 * quindi in una corsia i gruppi girano uno alla volta; le corsie girano
 * insieme. La corsia 0 e' sulla porta 8620, quella che indirizzoApi() dice in
 * locale (account-progetto §16.3), e porta la pagina vera; le altre ascoltano
 * su una porta qualunque, e la pagina che ci gira ha `:8620` riscritto con la
 * sua. Si riscrivono solo la pagina di riferimento e le sue varianti, mai
 * quella vera.
 */
async function corsia(k, cartella, portaApi = PORTA_API) {
  const corrente = { pagina: '' };
  const sp = await servi(corrente);
  const mail = [];
  // Le destinazioni per cui la posta del banco rifiuta, come il fornitore
  // quando non accetta: e' il 503 di posta (C-07).
  const rifiuta = new Set();
  const file = join(cartella, `file-${k}`);
  mkdirSync(file, { recursive: true });
  // L'orologio del server avanza di due ore a ogni gruppo: le cinque
  // registrazioni l'ora per indirizzo (§6.5) contano anche i 409, e le prove
  // vengono tutte da 127.0.0.1.
  const orologio = { t: Date.now() };
  let api;
  const percorsoDb = join(cartella, `conti-${k}.db`), cancellazioni = join(cartella, `cancellazioni-${k}`);
  const accendi = (porta) => avvia({ db: percorsoDb, cancellazioni, porta,
    host: '127.0.0.1', ora: () => orologio.t, argon2: ECONOMICO, origine: sp.origine, sito: sp.origine,
    posta: { invia: async (m) => { if (rifiuta.has(m.a)) throw new Error('rifiutata dalla posta del banco'); mail.push(m); } }, log: () => {} });
  let copie = 0;
  let spento = false;
  try {
    api = await accendi(k ? 0 : portaApi);
  } catch (e) {
    await sp.chiudi();
    throw e.code === 'EADDRINUSE' ? new Error(`la porta ${portaApi} e' occupata: il banco ci mette il server degli account (account-progetto §16.3); ferma quello che la usa`) : e;
  }
  const porta = Number(new URL(api.indirizzo).port);
  const r = await fetch(`${api.indirizzo}/v1/registrazione`, { method: 'POST', headers: { origin: sp.origine, 'content-type': 'application/json' }, body: JSON.stringify(ESISTENTE) });
  if (r.status !== 201) {
    await api.chiudi(); await sp.chiudi();
    throw new Error(`l'account esistente non si crea: ${r.status}`);
  }
  // Il database del server letto dal banco: e' li' che si vede se una riga e'
  // finita nell'account sbagliato (§9.1, «l'invio sbagliato sul server sarebbe
  // gia' un danno»), non sullo schermo.
  const ctx = {
    sito: sp.origine, api: `http://localhost:${porta}`, apiInterno: api.indirizzo, mail,
    sessioni: () => api.db.prepare('SELECT COUNT(*) AS n FROM sessione').get().n,
    conto: (email) => api.db.prepare('SELECT * FROM account WHERE email = ?').get(email),
    righeDi: (email) => api.db.prepare('SELECT COUNT(*) AS n FROM riga r JOIN account a ON a.id = r.account_id WHERE a.email = ?').get(email).n,
    sessioniDi: (email) => api.db.prepare('SELECT COUNT(*) AS n FROM sessione s JOIN account a ON a.id = s.account_id WHERE a.email = ?').get(email).n,
    revoca: (email) => api.db.prepare('DELETE FROM sessione WHERE account_id = (SELECT id FROM account WHERE email = ?)').run(email),
    spegni: (si) => { corrente.spento = si; },
    // --- per i gruppi di P-43: il banco fa quello che un altro dispositivo, il
    // fornitore della posta o la macchina farebbero, e legge il database.
    rifiuta,
    avanza: (ms) => { orologio.t += ms; },
    file: (nome, testo) => { const x = join(file, nome); writeFileSync(x, testo); return x; },
    /** Il gettone dell'ultima mail di quello scopo a quell'indirizzo, dal link che porta. */
    gettone: (email, scopo) => {
      for (const m of [...mail].reverse()) {
        const t = m.a === email && m.testo.match(new RegExp(`#${scopo}=([A-Za-z0-9_-]+)`));
        if (t) return t[1];
      }
      return null;
    },
    righeServer: (email) => api.db.prepare('SELECT dati FROM riga r JOIN account a ON a.id = r.account_id WHERE a.email = ? ORDER BY seq').all(email).map((x) => JSON.parse(x.dati)),
    aggiungi: (email, righe) => aggiungiRighe(api.db, ctx.conto(email).id, righe, { quesiti: ID_BANCA }),
    azzera: (email) => azzeraDb(api.db, ctx.conto(email).id, { cancellazioni, il: new Date(orologio.t).toISOString() }),
    segnali: (email, punti) => {
      for (const [modo, p] of Object.entries(punti)) {
        api.db.prepare('INSERT INTO segnali (account_id, modo, migliore, giocate) VALUES (?, ?, ?, ?)').run(ctx.conto(email).id, modo, p.migliore, p.giocate);
      }
    },
    segnaliDi: (email) => Object.fromEntries(api.db.prepare('SELECT modo, migliore, giocate FROM segnali s JOIN account a ON a.id = s.account_id WHERE a.email = ?')
      .all(email).map((x) => [x.modo, { migliore: x.migliore, giocate: x.giocate }])),
    dataEsame: (email, d) => api.db.prepare('UPDATE account SET data_esame = ? WHERE email = ?').run(d, email),
    /** Una copia di sicurezza, con il server acceso, come la fa la macchina (§2.5). */
    copia: () => { const x = join(cartella, `copia-${k}-${++copie}.db`); copiaDb(percorsoDb, x); return x; },
    /** Il ripristino di quella copia: il server si ferma, riparte dalla copia con un'epoca nuova, sulla stessa porta. */
    //
    // Fra la chiusura e la riaccensione la porta e' libera, e un altro processo
    // puo' prenderla: si riprova per cinque secondi, poi un rosso che lo dice.
    // Prima un riavvio fallito lasciava in `api` il server chiuso, la corsia lo
    // richiudeva alla fine, e la seconda chiusura faceva cadere tutto il banco
    // con un'eccezione non gestita — il giro senza risultati visto il 29
    // settembre 2026, riprodotto chiudendo due volte lo stesso server.
    ripristina: async (x) => {
      await api.chiudi();
      spento = true;
      ripristinaDb(x, percorsoDb, { cancellazioni });
      let ultimo;
      for (let i = 0; i < 25; i++) {
        try { api = await accendi(porta); spento = false; return; } catch (e) {
          ultimo = e;
          if (e.code !== 'EADDRINUSE') break;
          await pausa(200);
        }
      }
      throw new Error(`il server della corsia non si riaccende sulla porta ${porta} dopo il ripristino: ${ultimo.message}`);
    },
  };
  return {
    k, ctx,
    async esegui(b, p, g) {
      corrente.pagina = porta !== PORTA_API ? p.pagina.replaceAll(':8620', `:${porta}`) : p.pagina;
      orologio.t += 2 * 3600 * 1000;
      return gruppo(b, ctx, g);
    },
    chiudi: async () => { if (!spento) await api.chiudi(); await sp.chiudi(); },
  };
}

// Quante corsie dell'API. Misurato il 29 settembre 2026: con una sola, i
// gruppi con l'API e le loro rotture fanno piu' di quattro minuti in fila.
const CORSIE = 8;

/**
 * `portaApi` sposta la corsia 0 da 8620: serve solo a chi prova la pagina di
 * riferimento mentre un'altra suite occupa 8620 — il 29 settembre 2026 erano
 * quella di P-18 e quella di P-43, in due cartelle. La pagina vera parla con
 * 8620 e non si prova cosi'.
 */
export async function esegui(prove, { portaApi = PORTA_API } = {}) {
  // RG_TEMPI=1 stampa su stderr quanto dura ogni gruppo di ogni prova: e' cosi'
  // che si e' visto dove va il tempo del banco (§12, «Il tempo»).
  const tempi = (inizio, nome) => { if (process.env.RG_TEMPI) console.error(`${Math.round(performance.now() - inizio)} ms  ${nome}`); };
  const cartella = mkdtempSync(join(tmpdir(), 'rg-client-'));
  const esiti = new Map(prove.map((p) => [p.nome, {}]));
  const corsie = [];
  let b;
  try {
    for (let k = 0; k < CORSIE; k++) corsie.push(await corsia(k, cartella, portaApi));
    b = await avviaChrome({ nomi: ['rotta.test'] });

    const libere = prove.flatMap((p) => p.gruppi.filter((g) => !usaApi(g)).map((g) => ({ p, g })));
    const lavora = async () => {
      for (let x; (x = libere.shift());) {
        const inizio = performance.now();
        const proprio = { pagina: x.p.pagina };
        const sv = await servi(proprio);
        try {
          // La pagina di questi gruppi non e' riscritta: parla con la 8620, e il
          // banco guarda quell'indirizzo anche se la corsia 0 ascolta altrove.
          const ctx = { ...corsie[0].ctx, sito: sv.origine, api: `http://localhost:${PORTA_API}`, spegni: (si) => { proprio.spento = si; } };
          esiti.get(x.p.nome)[x.g] = await gruppo(b, ctx, x.g);
        } finally { await sv.chiudi(); }
        tempi(inizio, `${x.p.nome} ${x.g}`);
      }
    };
    // I gruppi con l'API: quelli della pagina vera solo nella corsia 0, gli
    // altri dove c'e' posto. Le corsie corrono accanto ai gruppi senza API.
    const fissi = prove.filter((p) => p.nome === 'app').flatMap((p) => p.gruppi.filter((g) => usaApi(g)).map((g) => ({ p, g })));
    const mobili = prove.filter((p) => p.nome !== 'app').flatMap((p) => p.gruppi.filter((g) => usaApi(g)).map((g) => ({ p, g })));
    // C-14 riavvia il server a meta' giro: sulla 8620 un'altra suite — quella
    // di un altro worktree — puo' prendersi la porta in quell'istante, quindi
    // gira solo sulle corsie con una porta qualunque.
    const prendi = (c) => {
      const i = mobili.findIndex((x) => c.k !== 0 || !SOLO_ALTRE.has(x.g.split(':')[0]));
      return i < 0 ? null : mobili.splice(i, 1)[0];
    };
    const guida = async (c) => {
      for (let x; (x = (c.k === 0 && fissi.shift()) || prendi(c));) {
        const inizio = performance.now();
        esiti.get(x.p.nome)[x.g] = await c.esegui(b, x.p, x.g);
        tempi(inizio, `${x.p.nome} ${x.g} (corsia ${c.k})`);
      }
    };
    await Promise.all([...corsie.map(guida), ...Array.from({ length: PARALLELE }, lavora)]);
  } catch (e) {
    for (const p of prove) if (!Object.keys(esiti.get(p.nome)).length) esiti.get(p.nome).banco = [{ gruppo: 'banco', nome: 'il banco parte', ok: false, extra: e.message }];
  } finally {
    if (b) await b.chiudi();
    for (const c of corsie) await c.chiudi();
    rmSync(cartella, { recursive: true, force: true });
  }
  return Object.fromEntries(prove.map((p) => {
    const e = esiti.get(p.nome);
    return [p.nome, [...(e.banco || []), ...p.gruppi.flatMap((g) => e[g] || [])]];
  }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let dentro = '';
  process.stdin.on('data', (b) => { dentro += b; });
  process.stdin.on('end', async () => {
    const { prove } = JSON.parse(dentro);
    process.stdout.write(JSON.stringify(await esegui(prove)));
  });
}
