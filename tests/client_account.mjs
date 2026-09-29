// Il banco del client degli account: la pagina vera, in un browser vero.
//
// docs/account-client-progetto.md §12 chiede diciotto gruppi di controlli,
// C-01…C-18, che guardano quello che una lettura del sorgente non vede:
// storage, rete, cookie, offline, due schede. Questo banco li esegue con
// Chrome headless (tests/browser.mjs), il sito servito da qui come lo serve
// l'host, e il server degli account vero (server/server.mjs) accanto.
//
// Uso: node tests/client_account.mjs  < {"prove":[{nome,pagina,regime,gruppi}]}
// Stampa {nome: [{gruppo, nome, ok, extra}]}. La pagina sostituisce /app; il
// resto del sito e' quello di site/. Il regime lo decide chi chiama
// (tests/test_interfaccia.py): 'attuale' e' la pagina di oggi, senza client;
// 'progettato' e' quella con il client, riconosciuta da indirizzoApi().
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
//  - nel regime progettato, i testi e le etichette del progetto, cercati in
//    quello che si vede; le finestre modali con aria-modal, che si chiudono con
//    Esc; l'archivio dell'account `rg-account-<chiave_locale>`; e l'API in
//    locale su http://<stesso host>:8620 (account-progetto §7.4 e §16.3).
//
// Gruppi realizzati: C-01, C-02, C-03, C-04, C-05, C-06, C-11, C-15 (P-29,
// P-39). Gli altri sono scoperti, con il motivo, nel §12 del progetto.

import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avviaChrome } from './browser.mjs';
import * as E from '../site/engine.js';
import { avvia } from '../server/server.mjs';

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

async function c01(b, ctx, v, regime, parte) {
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

async function c02(b, ctx, v, regime) {
  const g = 'C-02';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    if (regime === 'attuale') {
      // La pagina di oggi promette il contrario, e deve mantenerlo finche' il
      // client non c'e': le risposte restano nel browser (specifica §2, «la
      // decisione non e' ancora il prodotto»). Una pagina senza client che le
      // perde alla ricarica rompe la promessa di oggi senza mantenere quella
      // di domani.
      const testo = await unaRisposta(tab, v, g, 'regime attuale: ');
      if (!testo) return;
      const cons = await c.conservato(ctx.sito, tab);
      v.push({ gruppo: g, nome: 'regime attuale: la risposta e\' nell\'archivio del browser', ok: cons.idb.includes('open-patente-nautica') || cons.local.some((e) => e[0] === 'pn.archivio'),
        extra: 'ne\' IndexedDB open-patente-nautica ne\' pn.archivio: ' + JSON.stringify(cons) });
      await tab.ricarica();
      const resta = await tab.attendi(js(`const s = document.querySelector('#rotta-last'); return !!s && !s.hidden && V(s);`), CARICO);
      v.push({ gruppo: g, nome: 'regime attuale: dopo la ricarica l\'ultima attivita\' c\'e\' ancora', ok: resta,
        extra: 'la pagina di oggi dice che le risposte restano nel browser, e dopo una ricarica non le mostra' });
      return;
    }
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

async function c05(b, ctx, v, regime) {
  const g = 'C-05';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const testo = await unaRisposta(tab, v, g, regime === 'attuale' ? 'regime attuale: ' : '');
    if (!testo) return;
    if (regime === 'attuale') {
      // Senza client, niente che somigli a un account: nessuna rotta dell'API,
      // nessun campo password, nessun invito a crearne uno.
      const api = tab.richieste.filter((r) => /\/v1\//.test(r.url));
      v.push({ gruppo: g, nome: 'regime attuale: nessuna richiesta a un\'API degli account', ok: !api.length,
        extra: api.map((r) => r.url).join(', ') });
      v.push({ gruppo: g, nome: 'regime attuale: nessun modulo d\'account nel riepilogo', ok: !await tab.valuta(passwordVisibile) && !await tab.valuta(pulsante('Crea un account e salva')),
        extra: 'la pagina senza indirizzoApi() offre un account che non puo\' esistere' });
      return;
    }
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

/** Nel regime attuale il client non c'e': niente API, niente account (specifica §2). */
async function senzaClient(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const pronto = await tab.attendi(PRONTO, CARICO);
    const api = tab.richieste.filter((r) => /\/v1\//.test(r.url));
    v.push({ gruppo: g, nome: 'regime attuale: la pagina si apre, senza API e senza moduli d\'account', ok: pronto && !api.length && !await tab.valuta(passwordVisibile) && !await tab.valuta(pulsante('Crea un account e salva')),
      extra: !pronto ? 'la palestra non si apre' : api.length ? api.map((r) => r.url).join(', ') : 'un modulo o un invito d\'account senza indirizzoApi()' });
  } finally { await c.chiudi(); }
}

// --- C-03: le viste, e l'invito solo nei riepiloghi ---------------------------------

const VISTE = ['oggi', 'quiz', 'cart', 'diag', 'seg', 'info'];
const PORTA_PROGRESSI = 'I Progressi descrivono le attività salvate nel tuo account.';
// Il cruscotto di oggi: se uno di questi si vede senza account, Progressi e'
// una vista di zeri costruita dallo storico temporaneo (§3.2).
const CRUSCOTTO = ['#d-temi', '#d-voci', '#d-cons', '#sessioni'];

async function c03(b, ctx, v, regime) {
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
    if (regime === 'attuale') {
      v.push({ gruppo: g, nome: 'regime attuale: Progressi e\' la vista di oggi, senza porte d\'account', ok: await tab.valuta(visibile('#v-diag')) && !await tab.valuta(testoVisibile(PORTA_PROGRESSI)),
        extra: 'Progressi non si vede, o parla di un account che non c\'e\'' });
      return;
    }
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

async function c04(b, ctx, v, regime, parte) {
  const g = 'C-04';
  if (regime === 'attuale') return senzaClient(b, ctx, v, g);
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

async function c06(b, ctx, v, regime, parte) {
  const g = 'C-06';
  if (regime === 'attuale') return senzaClient(b, ctx, v, g);
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

async function c11(b, ctx, v, regime, parte) {
  const g = 'C-11';
  if (regime === 'attuale') return senzaClient(b, ctx, v, g);
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

async function c15(b, ctx, v, regime, parte) {
  const g = 'C-15';
  if (regime === 'attuale') return senzaClient(b, ctx, v, g);
  const vuole = (x) => !parte || parte === x;
  const U = await nuovoAccount(ctx, 'c15');
  if (vuole('uscite')) await c15uscite(b, ctx, v, g, U);
  if (vuole('corsa')) await c15corsa(b, ctx, v, g, U);
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

// --- il giro -------------------------------------------------------------------------

const GRUPPI = { 'C-01': c01, 'C-02': c02, 'C-03': c03, 'C-04': c04, 'C-05': c05, 'C-06': c06, 'C-11': c11, 'C-15': c15 };
// I gruppi che parlano con l'API: il server accetta una sola origine (§7.3),
// quindi girano uno alla volta sul sito principale. Gli altri girano in
// parallelo, ognuno con il suo sito e quindi con la sua origine. C-05 ci sta
// anche nel regime attuale, dove guarda che la pagina non chiami l'API; i
// gruppi nuovi, nel regime attuale, controllano solo che il client non ci sia.
const CON_API = new Set(['C-05', 'C-04', 'C-06', 'C-11', 'C-15']);
const usaApi = (p, gr) => { const g = gr.split(':')[0]; return g === 'C-05' || (CON_API.has(g) && p.regime === 'progettato'); };

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
async function gruppo(b, ctx, gr, regime) {
  const v = [];
  const [nome, parte] = gr.split(':');
  try { await GRUPPI[nome](b, ctx, v, regime, parte || null); } catch (e) { v.push({ gruppo: nome, nome: `il gruppo ${gr} si esegue`, ok: false, extra: e.message }); }
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
async function corsia(k, cartella) {
  const corrente = { pagina: '' };
  const sp = await servi(corrente);
  const mail = [];
  // L'orologio del server avanza di due ore a ogni gruppo: le cinque
  // registrazioni l'ora per indirizzo (§6.5) contano anche i 409, e le prove
  // vengono tutte da 127.0.0.1.
  const orologio = { t: Date.now() };
  let api;
  try {
    api = await avvia({ db: join(cartella, `conti-${k}.db`), cancellazioni: join(cartella, `cancellazioni-${k}`), porta: k ? 0 : PORTA_API,
      host: '127.0.0.1', ora: () => orologio.t, argon2: ECONOMICO, origine: sp.origine, sito: sp.origine,
      posta: { invia: async (m) => { mail.push(m); } }, log: () => {} });
  } catch (e) {
    await sp.chiudi();
    throw e.code === 'EADDRINUSE' ? new Error(`la porta ${PORTA_API} e' occupata: il banco ci mette il server degli account (account-progetto §16.3); ferma quello che la usa`) : e;
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
  };
  return {
    k, ctx,
    async esegui(b, p, g) {
      corrente.pagina = k ? p.pagina.replaceAll(':8620', `:${porta}`) : p.pagina;
      orologio.t += 2 * 3600 * 1000;
      return gruppo(b, ctx, g, p.regime);
    },
    chiudi: async () => { await api.chiudi(); await sp.chiudi(); },
  };
}

// Quante corsie dell'API. Misurato il 29 settembre 2026: con una sola, i
// gruppi con l'API e le loro rotture fanno piu' di quattro minuti in fila.
const CORSIE = 4;

export async function esegui(prove) {
  // RG_TEMPI=1 stampa su stderr quanto dura ogni gruppo di ogni prova: e' cosi'
  // che si e' visto dove va il tempo del banco (§12, «Il tempo»).
  const tempi = (inizio, nome) => { if (process.env.RG_TEMPI) console.error(`${Math.round(performance.now() - inizio)} ms  ${nome}`); };
  const cartella = mkdtempSync(join(tmpdir(), 'rg-client-'));
  const esiti = new Map(prove.map((p) => [p.nome, {}]));
  const corsie = [];
  let b;
  try {
    for (let k = 0; k < CORSIE; k++) corsie.push(await corsia(k, cartella));
    b = await avviaChrome();

    const libere = prove.flatMap((p) => p.gruppi.filter((g) => !usaApi(p, g)).map((g) => ({ p, g })));
    const lavora = async () => {
      for (let x; (x = libere.shift());) {
        const inizio = performance.now();
        const proprio = { pagina: x.p.pagina };
        const sv = await servi(proprio);
        try {
          const ctx = { ...corsie[0].ctx, sito: sv.origine, spegni: (si) => { proprio.spento = si; } };
          esiti.get(x.p.nome)[x.g] = await gruppo(b, ctx, x.g, x.p.regime);
        } finally { await sv.chiudi(); }
        tempi(inizio, `${x.p.nome} ${x.g}`);
      }
    };
    // I gruppi con l'API: quelli della pagina vera solo nella corsia 0, gli
    // altri dove c'e' posto. Le corsie corrono accanto ai gruppi senza API.
    const fissi = prove.filter((p) => p.nome === 'app').flatMap((p) => p.gruppi.filter((g) => usaApi(p, g)).map((g) => ({ p, g })));
    const mobili = prove.filter((p) => p.nome !== 'app').flatMap((p) => p.gruppi.filter((g) => usaApi(p, g)).map((g) => ({ p, g })));
    const guida = async (c) => {
      for (let x; (x = (c.k === 0 && fissi.shift()) || mobili.shift());) {
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
