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
// Gruppi realizzati: C-01…C-17 (P-29, P-39, P-43), e C-19, la bozza del
// carteggio (P-34, §9.4 del progetto). C-18, la ricerca dei testi,
// non ha bisogno di un browser e sta in tests/test_interfaccia.py. Che cosa
// ognuno non vede e' scritto nel §12 del progetto. Tre parti — C-13:scarica,
// C-08:cancella, C-15:segnali (P-46) — girano con il loro gruppo ma portano il
// loro nome nelle verifiche: sono le scelte che prima nessuno premeva, e la
// specifica le nomina una per una (R-ACC-63…65). Le prime due tengono anche
// R-ACC-66 (P-49): il pulsante di conferma premuto senza la spunta dice che
// cosa manca, e non cambia niente.
//
// E da P-45 i gruppi T-01…T-09 dell'area 6, la rifinitura trasversale
// (docs/area-6-progetto.md §10.3): quello che la pagina dice di conservare nei
// due regimi d'accesso, i numeri dalla loro fonte, il guasto che resta
// segnalato, il fuoco, gli avvisi che si vedono davvero, lo sbordo da 1280 a
// 320 px, il contrasto e i bersagli. Misurano con il browser — rettangoli,
// colori calcolati, tasti veri, albero di accessibilita' — e non cercano
// stringhe nel sorgente.
//
// E da P-53 il gruppo F-01, le frasi del riepilogo dei quiz (R-UX-06,
// docs/area-3-progetto.md §4.2): tre affermazioni lette in quello che si vede,
// con i numeri di quello che il banco ha fatto, nessuna quarta e nessun voto.

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
// Il giudizio di chi studia, detto nel Carteggio prima dell'avvio (R-UX-03,
// specifica §7.3): la frase del progetto dell'area 4 (§4), che la pagina ha da
// P-21. Fino a P-50 valeva anche quella della pagina di prima, «e dici quali
// avevi preso», uscita con il regime vecchio del Carteggio.
const GIUDIZIO_CARTEGGIO = ['Sei tu a giudicare'];
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
  // Prima di Inizia, e nel testo che si vede: una frase nel DOM ma nascosta,
  // o detta solo alla consegna, non avverte nessuno (P-29, «Il banco»).
  const giudizio = await tab.valuta(js(`const t = (document.querySelector('#v-cart') || document.body).innerText.replace(/\\s+/g, ' ');
    return ${q(GIUDIZIO_CARTEGGIO)}.some((f) => t.includes(f));`));
  v.push({ gruppo: g, nome: `${p}prima dell'avvio la pagina dice che il giudizio e' di chi studia`, ok: !!giudizio,
    extra: `nel testo visibile del Carteggio, prima di #c-start, nessuna di ${q(GIUDIZIO_CARTEGGIO)} — il giudizio della prova `
      + 'e\' di chi studia, e va detto prima dell\'avvio, non alla consegna (R-UX-03, specifica §7.3)' });
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
  if (vuole('segnali')) await fermaAlPrimo(v, (w) => c15segnali(b, ctx, w, `${g}:segnali`, false));
  if (vuole('segnali-rete')) await fermaAlPrimo(v, (w) => c15segnali(b, ctx, w, `${g}:segnali`, true));
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

/** Una casella da spuntare, dalla sua etichetta: la conferma esplicita di una scelta (§5.3, §10). */
const spunta = (tab, etichetta) => tab.valuta(js(`const c = ${campo(etichetta)}; if (!c) return false; if (!c.checked) c.click(); return c.checked;`));

/** Gli uid dell'archivio `righe` della copia dell'account, letti dalla pagina; il database si richiude subito. */
const uidCopia = (tab, chiave) => tab.valuta(`new Promise((ok) => {
  const q = indexedDB.open(${q('rg-account-' + chiave)});
  q.onerror = () => ok(null);
  q.onsuccess = () => {
    const db = q.result;
    try {
      const g = db.transaction('righe').objectStore('righe').getAll();
      g.onsuccess = () => { db.close(); ok(g.result.map((r) => String(r.uid))); };
      g.onerror = () => { db.close(); ok(null); };
    } catch { db.close(); ok(null); }
  };
})`);

/** Il testo della finestra aperta, o della pagina: per dire nel rosso che cosa c'era. */
const inSchermata = js(`const m = M(); return (m === document ? document.body : m).innerText.replace(/\\s+/g, ' ').slice(0, 300);`);

// R-ACC-66 (P-49): un pulsante di conferma premuto senza la sua casella dice che
// cosa manca, in quello che si vede. Si contano le volte che il nome della
// casella compare nel testo visibile della finestra: prima c'e' solo
// l'etichetta, dopo il clic anche il messaggio. Un messaggio scritto in un
// elemento che non c'e', o nascosto, non entra in innerText; uno generico —
// «Conferma la scelta prima di continuare.», la frase di prima di P-48 — non
// nomina la casella. Tutti e tre restano a uno.
const quanteVolte = (frase) => js(`const m = M(); return (m === document ? document.body : m).innerText.split(${q(frase)}).length - 1;`);
async function diceCheManca(tab, casella, prima) {
  const { ok, valore } = await tab.attendiValore(quanteVolte(casella), (n) => n > prima, REAZIONE);
  return { ok, extra: `premuto senza la spunta, la finestra non nomina «${casella}» oltre la sua etichetta (${valore} volte, erano ${prima}); in schermata: ${await tab.valuta(inSchermata)}` };
}
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
  if (vuole('cancella')) await fermaAlPrimo(v, (w) => c08cancella(b, ctx, w, `${g}:cancella`));
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

/**
 * «Cancella queste risposte» dopo il recupero della password (§5.3, P-46): un
 * account che non era confermato porta risposte che possono essere di chiunque.
 * Cancellarle chiede una conferma esplicita, toglie le righe dal server con la
 * password appena scelta, svuota la copia, e l'account resta usabile con la
 * generazione nuova.
 */
async function c08cancella(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c08c');
  ctx.aggiungi(K.email, righeDi(`c08c${serie}`, 2));
  const gen = ctx.conto(K.email).generazione;
  await fetch(`${ctx.apiInterno}/v1/password/dimenticata`, { method: 'POST', headers: { origin: ctx.sito, 'content-type': 'application/json' }, body: JSON.stringify({ email: K.email }) });
  await finche(() => !!ctx.gettone(K.email, 'password'), REAZIONE);
  const c = await b.nuovoContesto();
  try {
    // Prima si entra, su questo browser: la copia riceve le 2 risposte. Poi il
    // link della password nella stessa scheda. Senza, al momento della domanda
    // la copia e' vuota su tutte e due le pagine (misurato il 30 settembre 2026),
    // e «la copia le segue» sarebbe stato un verde che non misura niente.
    const tab = await c.apri(ctx.sito + '/app');
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    const ricevute = await finche(async () => await nellaCopia(c, ctx, tab, K.chiave) === 2, REAZIONE);
    v.push({ gruppo: g, nome: 'entrando, la copia di questo dispositivo riceve le 2 risposte dell\'account', ok: ricevute, extra: `nella copia ${await nellaCopia(c, ctx, tab, K.chiave)} righe` });
    // Da /app a /app#password=… cambierebbe solo il frammento, senza caricare la pagina.
    await tab.vai(`${ctx.sito}/privacy`);
    await tab.vai(`${ctx.sito}/app#password=${ctx.gettone(K.email, 'password')}`);
    await tab.attendi(js(`return V(${campo('Password')});`), CARICO);
    await imposta(tab, 'Password', 'la nuova rotta per il porto');
    await clicca(tab, 'Salva la nuova password');
    const domanda = await tab.attendi(testoVisibile('Questo account non era confermato e contiene 2 risposte.'), REAZIONE) && await tab.valuta(pulsante('Cancella queste risposte'));
    v.push({ gruppo: g, nome: 'dopo il recupero la pagina chiede se tenere le risposte, e offre «Cancella queste risposte»', ok: domanda, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
    await clicca(tab, 'Cancella queste risposte');
    const conferma = await tab.attendi(js(`return !!${campo('Confermo la cancellazione')};`), REAZIONE);
    v.push({ gruppo: g, nome: '«Cancella queste risposte» chiede una conferma esplicita, e intanto niente si cancella', ok: conferma && await maiPer(async () => ctx.righeDi(K.email) !== 2 || await nellaCopia(c, ctx, tab, K.chiave) !== 2, 1500),
      extra: conferma ? `l'account ha ${ctx.righeDi(K.email)} righe e la copia ${await nellaCopia(c, ctx, tab, K.chiave)}, ne avevano 2` : `nessuna casella «Confermo la cancellazione»; il server ha ${ctx.righeDi(K.email)} righe; in schermata: ${await tab.valuta(inSchermata)}` });
    // Senza la spunta: niente cambia, e la finestra dice che cosa manca (R-ACC-66,
    // P-49). Prima il server e la copia, poi il messaggio, come in C-13:scarica.
    const casella = 'Confermo la cancellazione';
    const primaMsg = await tab.valuta(quanteVolte(casella));
    await clicca(tab, 'Cancella queste risposte');
    v.push({ gruppo: g, nome: 'senza la spunta la cancellazione non parte: il server e la copia non cambiano',
      ok: await maiPer(async () => ctx.righeDi(K.email) !== 2 || ctx.conto(K.email).generazione !== gen || await nellaCopia(c, ctx, tab, K.chiave) !== 2, 1500),
      extra: `l'account ha ${ctx.righeDi(K.email)} righe, ne aveva 2, generazione ${gen} → ${ctx.conto(K.email).generazione}; la copia ${await nellaCopia(c, ctx, tab, K.chiave)}` });
    const manca = await diceCheManca(tab, casella, primaMsg);
    v.push({ gruppo: g, nome: 'senza la spunta dice che manca «Confermo la cancellazione», in quello che si vede', ...manca });
    await spunta(tab, 'Confermo la cancellazione');
    await clicca(tab, 'Cancella queste risposte');
    const cancellate = await finche(() => ctx.righeDi(K.email) === 0 && ctx.conto(K.email).generazione > gen, REAZIONE);
    v.push({ gruppo: g, nome: 'confermata, le risposte spariscono dal server con una generazione nuova', ok: cancellate,
      extra: `l'account ha ${ctx.righeDi(K.email)} righe, generazione ${gen} → ${ctx.conto(K.email).generazione}` });
    v.push({ gruppo: g, nome: 'e la copia di questo dispositivo le segue', ok: await finche(async () => await nellaCopia(c, ctx, tab, K.chiave) === 0, REAZIONE),
      extra: `nella copia ${await nellaCopia(c, ctx, tab, K.chiave)} righe` });
    // L'account resta usabile: una risposta nuova entra con la generazione nuova, senza un 409.
    await tab.attendi(js(`return ![...document.querySelectorAll('[aria-modal="true"], dialog[open]')].some(V);`), REAZIONE);
    await clic(tab, '[data-v="oggi"]');
    await tab.attendi(PRONTO, REAZIONE);
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    v.push({ gruppo: g, nome: 'poi una risposta nuova entra nell\'account', ok: await finche(() => ctx.righeDi(K.email) === 1, REAZIONE) && !await tab.valuta(js(`return new RegExp(${q(AZZERATI.source)}, 'i').test(document.body.innerText);`)),
      extra: `l'account ha ${ctx.righeDi(K.email)} righe; in schermata: ${await tab.valuta(inSchermata)}` });
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
    // Le tre condizioni si misurano una per una, e il pulsante si aspetta come
    // le altre due. Fino al 30 settembre 2026 si guardava una volta sola, subito
    // dopo il testo del riepilogo, che la pagina disegna prima: in due giri
    // della suite intera sotto carico su quattro (P-35) il rosso e' uscito cosi',
    // e diviso nelle tre condizioni ha detto «righe sì, riepilogo sì, pulsante
    // no», con il pulsante comparso poco dopo in uno dei due. Da solo, sotto
    // carico, C-10 era verde 12 volte su 12. Un rosso falso del banco, come
    // quelli di P-38: si aspetta uno stato, non un istante.
    const righeOk = await finche(() => ctx.righeDi(K.email) === valide.nuove, REAZIONE);
    const riepilogoOk = righeOk && await tab.attendi(testoVisibile(attesi), REAZIONE);
    const pulsanteOk = riepilogoOk && await tab.attendi(pulsante('Scarica le righe non importate'), REAZIONE);
    const arrivate = righeOk && riepilogoOk && pulsanteOk;
    v.push({ gruppo: g, nome: 'importato: le righe valide sul server, il riepilogo unico e gli scarti da scaricare', ok: arrivate,
      extra: `in tempo: righe ${righeOk ? 'sì' : 'no'}, riepilogo ${riepilogoOk ? 'sì' : righeOk ? 'no' : '—'}, pulsante ${pulsanteOk ? 'sì' : riepilogoOk ? 'no' : '—'}; `
        + `alla rilettura il server ha ${ctx.righeDi(K.email)} righe su ${valide.nuove}, e «Scarica le righe non importate» ${await tab.valuta(pulsante('Scarica le righe non importate')) ? '' : 'non '}c'e'` });
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
  if (vuole('scarica')) await fermaAlPrimo(v, (w) => c13scarica(b, ctx, w, `${g}:scarica`));
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

/**
 * «Scarica e passa al nuovo archivio» (§10, P-46): il file porta le risposte che
 * il nuovo archivio perderebbe, e la copia si sostituisce solo dopo la conferma
 * di aver conservato il file; poi niente di quel file rientra nell'account.
 */
async function c13scarica(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c13s');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    // Come in «invio»: l'azzeramento si scopre inviando, non ricevendo.
    await tab.intercetta(`${ctx.api}/v1/righe?*`, (r) => (r.method === 'GET' ? { fallisci: 'ConnectionReset' } : null));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await clic(tab, '[data-rotta-start]');
    await rispondiQuiz(tab, [], g, '');
    await finche(() => ctx.righeDi(K.email) === 1, REAZIONE);
    // Quelle che il server aveva prima dell'azzeramento erano salvate: l'altro
    // dispositivo le ha tolte apposta, e il file non deve portarle per forza.
    const salvate = new Set(ctx.righeServer(K.email).map((r) => String(r.uid)));
    ctx.azzera(K.email);
    await clic(tab, '#r-next');
    await tab.attendi(js(`return !document.querySelector('#r-ans .ans.ok');`), REAZIONE);
    await rispondiQuiz(tab, [], g, '');
    const offerta = await tab.attendi(pulsante('Scarica e passa al nuovo archivio'), REAZIONE);
    v.push({ gruppo: g, nome: 'scoperto l\'azzeramento, la pagina offre «Scarica e passa al nuovo archivio»', ok: offerta, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
    // Le risposte non salvate (§10): quelle della copia che il server non ha mai avuto.
    const server = new Set(ctx.righeServer(K.email).map((r) => String(r.uid)));
    const copia = await uidCopia(tab, K.chiave) || [];
    const perse = copia.filter((u) => !server.has(u) && !salvate.has(u));
    const n = c.scaricati().length;
    await clicca(tab, 'Scarica e passa al nuovo archivio');
    const file = await scaricato(c, n);
    const nelFile = uidDi(file && file.dati);
    const valide = !!file && (file.dati?.righe || []).every((r) => E.validaRiga(r, { quesiti: ID_BANCA }) === null);
    v.push({ gruppo: g, nome: 'il file porta le risposte non salvate, e si ricarica', ok: !!file && perse.length > 0 && perse.every((u) => nelFile.has(u)) && valide,
      extra: !file ? 'nessun file' : `nella copia ${perse.length} risposte non salvate, nel file ${perse.filter((u) => nelFile.has(u)).length} di queste${valide ? '' : '; e il file ha righe che validaRiga() rifiuta'}` });
    // Avviare il download non prova che il file sia al sicuro (§10): la copia resta.
    const chiede = await tab.attendi(pulsante('Carica il nuovo archivio'), REAZIONE) && await tab.valuta(js(`return !!${campo('Ho conservato il file')};`));
    v.push({ gruppo: g, nome: 'dopo il download si chiede di confermare di aver conservato il file, e la copia non cambia', ok: chiede && await maiPer(async () => await nellaCopia(c, ctx, tab, K.chiave) !== copia.length, 1500),
      extra: chiede ? `nella copia ${await nellaCopia(c, ctx, tab, K.chiave)} righe, erano ${copia.length}` : `manca «Ho conservato il file» con «Carica il nuovo archivio»; in schermata: ${await tab.valuta(inSchermata)}` });
    // Senza la spunta: niente cambia, e la finestra dice che cosa manca (R-ACC-66,
    // P-49). Prima la copia e il server, poi il messaggio: il giro si ferma al
    // primo rosso, e una rottura che carica lo stesso dev'essere rossa per quello.
    const casella = 'Ho conservato il file';
    const primaMsg = await tab.valuta(quanteVolte(casella));
    const sulServer = ctx.righeDi(K.email), genServer = ctx.conto(K.email).generazione;
    await clicca(tab, 'Carica il nuovo archivio');
    v.push({ gruppo: g, nome: 'senza la conferma «Carica il nuovo archivio» non sostituisce la copia, e il server non cambia',
      ok: await maiPer(async () => await nellaCopia(c, ctx, tab, K.chiave) !== copia.length || ctx.righeDi(K.email) !== sulServer || ctx.conto(K.email).generazione !== genServer, 1500),
      extra: `nella copia ${await nellaCopia(c, ctx, tab, K.chiave)} righe, erano ${copia.length}; sul server ${ctx.righeDi(K.email)} righe, erano ${sulServer}, generazione ${genServer} → ${ctx.conto(K.email).generazione}` });
    const manca = await diceCheManca(tab, casella, primaMsg);
    v.push({ gruppo: g, nome: 'senza la conferma «Carica il nuovo archivio» dice che manca «Ho conservato il file», in quello che si vede', ...manca });
    await spunta(tab, 'Ho conservato il file');
    await clicca(tab, 'Carica il nuovo archivio');
    const passata = await finche(async () => await nellaCopia(c, ctx, tab, K.chiave) === 0, REAZIONE);
    v.push({ gruppo: g, nome: 'confermato, la copia e\' quella del server, e le risposte del file non rientrano', ok: passata && await maiPer(() => ctx.righeDi(K.email) > 0, 1500),
      extra: `nella copia ${await nellaCopia(c, ctx, tab, K.chiave)} righe, sul server ${ctx.righeDi(K.email)}` });
    await clic(tab, '#r-next');
    await tab.attendi(js(`return !document.querySelector('#r-ans .ans.ok');`), REAZIONE);
    await rispondiQuiz(tab, [], g, '');
    const entrata = await finche(() => ctx.righeDi(K.email) === 1, REAZIONE);
    const nuova = ctx.righeServer(K.email).map((r) => String(r.uid));
    v.push({ gruppo: g, nome: 'poi la risposta nuova entra, e nessuna di quelle del file', ok: entrata && nuova.every((u) => !nelFile.has(u)) && await maiPer(() => ctx.righeDi(K.email) !== 1, 1500),
      extra: `sul server ${ctx.righeDi(K.email)} righe${nuova.some((u) => nelFile.has(u)) ? ', fra cui una del file' : ''}` });
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

/**
 * L'uscita con punteggi dei Segnali che il server non ha ancora accolto (§8,
 * §10, P-46). Non si esce e lo si dice; «Scarica le risposte non salvate»
 * porta anche i punteggi; e poi, o si esce dopo aver conservato il file senza
 * mandarli a nessuno (`rete` falso), o tornata la rete «Riprova l'invio» li
 * manda e solo dopo esce (`rete` vero).
 */
async function c15segnali(b, ctx, v, g, rete) {
  const p = rete ? 'riprova: ' : 'scarica: ';
  const U = await nuovoAccount(ctx, 'c15g');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    let blocca = true;
    await tab.intercetta(`${ctx.api}/v1/profilo`, (r) => (r.method === 'PUT' && blocca ? { fallisci: 'ConnectionReset' } : null));
    if (!await dentro(tab, U)) { v.push({ gruppo: g, nome: `${p}si entra`, ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    const giocata = await partitaSegnali(tab, [], g, p);
    const put = () => richiesteA(tab, 'PUT', '/v1/profilo');
    const pendente = giocata && await finche(() => put().some((r) => r.finita), REAZIONE) && await tab.attendi(testoVisibile(DA_INVIARE_SEG), REAZIONE);
    v.push({ gruppo: g, nome: `${p}una partita con il profilo che non passa: «Punteggi da inviare», e il server non li ha`, ok: pendente && !Object.keys(ctx.segnaliDi(U.email)).length,
      extra: !giocata ? 'la partita non arriva in fondo' : pendente ? `il server ha ${JSON.stringify(ctx.segnaliDi(U.email))}` : `«${DA_INVIARE_SEG}» non si vede, o nessun PUT del profilo e' finito` });
    const sessioni = ctx.sessioniDi(U.email);
    await esciDa(tab);
    const detto = await tab.attendi(js(`return /punteggi dei Segnali/i.test(M().innerText) && [...M().querySelectorAll('button')].some((b) => V(b) && b.textContent.trim() === 'Scarica le risposte non salvate');`), USCITA);
    const fermo = detto && await maiPer(async () => richiesteA(tab, 'POST', '/v1/uscita').length > 0 || !copieAccount(await c.conservato(ctx.sito, tab)).length, 1500);
    v.push({ gruppo: g, nome: `${p}con punteggi dei Segnali da inviare non si esce, e lo si dice`, ok: fermo && ctx.sessioniDi(U.email) === sessioni,
      extra: !detto ? `nessuna frase sui punteggi dei Segnali con «Scarica le risposte non salvate»; in schermata: ${await tab.valuta(inSchermata)}`
        : `POST /v1/uscita ${richiesteA(tab, 'POST', '/v1/uscita').length}, copie ${copieAccount(await c.conservato(ctx.sito, tab)).join(', ') || 'nessuna'}, sessioni ${sessioni} → ${ctx.sessioniDi(U.email)}` });
    if (rete) {
      // Tornata la rete, «Riprova l'invio» manda i punteggi, e solo dopo esce.
      blocca = false;
      await clicca(tab, 'Riprova l\'invio');
      const arrivati = await finche(() => (ctx.segnaliDi(U.email).notturni?.giocate ?? 0) >= 1, USCITA);
      const fuori = arrivati && await finche(async () => ctx.sessioniDi(U.email) === sessioni - 1 && !copieAccount(await c.conservato(ctx.sito, tab)).length && await tab.valuta(pulsante('Accedi')), USCITA);
      v.push({ gruppo: g, nome: `${p}«Riprova l'invio» con la rete manda i punteggi, poi esce`, ok: fuori,
        extra: `sul server ${JSON.stringify(ctx.segnaliDi(U.email))}; sessioni ${sessioni} → ${ctx.sessioniDi(U.email)}; copie ${copieAccount(await c.conservato(ctx.sito, tab)).join(', ') || 'nessuna'}` });
      return;
    }
    const n = c.scaricati().length;
    await clicca(tab, 'Scarica le risposte non salvate');
    const file = await scaricato(c, n);
    const punti = (file && file.dati && file.dati.segPunti) || {};
    v.push({ gruppo: g, nome: `${p}il file delle risposte non salvate porta anche i punteggi dei Segnali`, ok: (punti.notturni?.giocate ?? 0) >= 1,
      extra: file ? `nel file segPunti ${JSON.stringify(file.dati && file.dati.segPunti)}` : 'nessun file' });
    await tab.attendi(pulsante('Ho conservato il file: esci e cancella la copia da questo dispositivo'), REAZIONE);
    await clicca(tab, 'Ho conservato il file: esci e cancella la copia da questo dispositivo');
    const fuori = await finche(async () => ctx.sessioniDi(U.email) === sessioni - 1 && !copieAccount(await c.conservato(ctx.sito, tab)).length && await tab.valuta(pulsante('Accedi')), USCITA);
    v.push({ gruppo: g, nome: `${p}dopo la scelta esplicita si esce, e i punteggi non vanno in nessun account`, ok: fuori && !Object.keys(ctx.segnaliDi(U.email)).length,
      extra: `sessioni ${sessioni} → ${ctx.sessioniDi(U.email)}; copie ${copieAccount(await c.conservato(ctx.sito, tab)).join(', ') || 'nessuna'}; sul server ${JSON.stringify(ctx.segnaliDi(U.email))}` });
  } finally { await c.chiudi(); }
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

// --- C-19: la bozza del carteggio (P-34, §9.4 del progetto del client) ----------------
//
// Il §7.6 della specifica prometteva il testo del carteggio «salvato a ogni
// tasto», e annotaCart() lo tiene solo in memoria dalla 0.5.0. D-03 del §10.1 di
// docs/area-4-progetto.md chiede la bozza per account; il suo contratto — dove
// sta, che cosa dice la pagina, quando si cancella — e' il §9.4 del progetto del
// client, e le regole pure sono nel motore (nuovaBozza, sostituisciBozza,
// riprendiBozza, concludiBozza). Qui si guarda la pagina: ricarica, scadenza,
// errore di scrittura, giudizio rinviato, uscita e cambio d'account fra schede.
//
// Sulla pagina vera oggi la bozza non c'e': `C-19:ricarica` e' il controllo che
// fallisce e lo dimostra, dichiarato come difetto aperto in
// docs/eccezioni-interfaccia.md finche' P-21 non la porta. Le verifiche portano
// il nome della parte, e test_interfaccia.py le registra parte per parte.

const MEMORIA = 'Il testo che scrivi resta solo finché questa pagina è aperta.';
const SALVATO = 'Il testo in corso è salvato su questo dispositivo per il tuo account.';
const GUASTO_BOZZA = 'Non riusciamo a conservare il testo in questo dispositivo.';
const OFFERTA = 'Hai del lavoro di carteggio in corso su questo dispositivo';
const SCADUTO = 'Il tempo della prova è scaduto. Confronta i risultati che avevi scritto';
const USCITA_BOZZA = 'Su questo dispositivo c\'è del lavoro di carteggio non concluso';
const SCARTO = 'Scarti la bozza?';
// Il nome della verifica che dimostra il difetto di oggi: la dichiarazione in
// docs/eccezioni-interfaccia.md lo cita parola per parola.
export const DIFETTO_BOZZA = 'con l\'account il testo scritto resta dopo una ricarica';

const esercizioC = js(`const t = document.querySelector('#c-testo'); return V(t) ? t.textContent.trim() : null;`);
const campoC = js(`const i = document.querySelector('#c-input'); return i && V(i) ? i.value : null;`);
const scriviC = (tab, testo) => tab.valuta(js(`const i = document.querySelector('#c-input'); if (!i) return false;
  i.value = ${q(testo)}; i.dispatchEvent(new Event('input', { bubbles: true })); return true;`));
const tempoC = js(`const t = document.querySelector('#c-time'); return t && V(t) ? t.textContent.trim() : null;`);
const secondiC = (t) => { const m = /^(\d+):(\d\d)$/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };
const runnerC = visibile('#cartrun');
// Un orologio spostato in avanti per la scheda, prima degli script della
// pagina: e' cosi' che una prova scade senza aspettare un'ora.
const avanti = (ms) => `(() => { const d = Date.now.bind(Date); Date.now = () => d() + ${ms}; })();`;
// Una scrittura che fallisce come fallisce IndexedDB: la transazione si
// interrompe dopo la richiesta, e oncomplete non arriva. Solo con il segno
// acceso, cosi' l'ingresso nell'account scrive come sempre.
const GUASTO_IDB = `(() => { const p = IDBObjectStore.prototype.put; IDBObjectStore.prototype.put = function (...a) {
  const r = p.apply(this, a); if (window.__guasto) { try { this.transaction.abort(); } catch {} } return r; }; })();`;

/** La prova dal Carteggio, fino al primo esercizio della banca: restituisce il suo testo, o null. */
async function apriProvaC(tab) {
  if (!await clic(tab, '[data-v="cart"]') || !await tab.attendi(visibile('#c-start'), REAZIONE)) return null;
  await clic(tab, '#c-start');
  const { ok, valore } = await tab.attendiValore(esercizioC, (x) => CARTEGGIO.has(x), REAZIONE);
  return ok ? valore : null;
}

/** Consegna a due tocchi, in pagina (specifica §7.6), fino alla correzione. */
async function consegnaC(tab) {
  for (let i = 0; i < 4; i++) {
    await clic(tab, '#c-consegna');
    if (await tab.attendi(visibile('#c-fine'), 400)) return true;
  }
  return false;
}

const giudizioC = (k, ok) => `#c-fine [data-cs="${k}"][data-ok="${ok ? 1 : 0}"]`;
const premuto = (sel) => js(`const b = document.querySelector(${q(sel)}); return !!b && b.classList.contains('on');`);

/** Nella scheda, con l'account, una prova aperta e due testi scritti e salvati. Restituisce i due testi, o un rosso. */
async function provaConTesto(tab, v, g, U, etichetta) {
  if (!await dentro(tab, U)) {
    v.push({ gruppo: g, nome: `${etichetta}: si entra nell'account`, ok: false, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
    return null;
  }
  const primo = await apriProvaC(tab);
  v.push({ gruppo: g, nome: `${etichetta}: con l'account la prova si apre`, ok: !!primo, extra: 'nessun esercizio della banca in #c-testo dopo #c-start' });
  if (!primo) return null;
  const testi = [`Lat 42°49,9N Long 010°02,3E ${g}`, `Rv 123° ${g}`];
  await scriviC(tab, testi[0]);
  await clic(tab, '#c-next');
  await tab.attendiValore(esercizioC, (x) => CARTEGGIO.has(x) && x !== primo, REAZIONE);
  await scriviC(tab, testi[1]);
  return { testi, primo };
}

async function c19(b, ctx, v, parte) {
  // Ogni parte crea i suoi account, e il server ne accetta cinque l'ora per
  // indirizzo (§6.5): fra una parte e l'altra il suo orologio va avanti, come
  // fa la corsia fra un gruppo e l'altro.
  const vuole = (x) => { if (parte && parte !== x) return false; ctx.avanza(2 * 3600 * 1000); return true; };
  if (vuole('senza')) await fermaAlPrimo(v, (w) => c19senza(b, ctx, w, 'C-19:senza'));
  if (vuole('ricarica')) await fermaAlPrimo(v, (w) => c19ricarica(b, ctx, w, 'C-19:ricarica'));
  if (vuole('scadenza')) await fermaAlPrimo(v, (w) => c19scadenza(b, ctx, w, 'C-19:scadenza'));
  if (vuole('guasto')) await fermaAlPrimo(v, (w) => c19guasto(b, ctx, w, 'C-19:guasto'));
  if (vuole('giudizio')) await fermaAlPrimo(v, (w) => c19giudizio(b, ctx, w, 'C-19:giudizio'));
  if (vuole('uscita')) await fermaAlPrimo(v, (w) => c19uscita(b, ctx, w, 'C-19:uscita'));
  if (vuole('schede')) await fermaAlPrimo(v, (w) => c19schede(b, ctx, w, 'C-19:schede'));
}

/** Senza account il testo non si scrive da nessuna parte, e dopo una ricarica non c'e' niente da riprendere (ADR-004). */
async function c19senza(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    const primo = await apriProvaC(tab);
    v.push({ gruppo: g, nome: 'senza account la prova si apre', ok: !!primo, extra: 'nessun esercizio della banca in #c-testo dopo #c-start' });
    const testo = 'Lat 42°50,1N senza account';
    await scriviC(tab, testo);
    v.push({ gruppo: g, nome: 'senza account la pagina dice che il testo resta solo finché è aperta', ok: await tab.attendi(testoVisibile(MEMORIA), REAZIONE),
      extra: `«${MEMORIA}» non si vede con il testo scritto (P-36)` });
    // Un'assenza: si guarda per tutta la finestra.
    let trovato = [];
    for (const fine = Date.now() + OSSERVAZIONE; !trovato.length && Date.now() < fine;) {
      trovato = personale(await c.conservato(ctx.sito, tab), ctx.api);
      if (!trovato.length) await pausa(50);
    }
    const inviate = tab.richieste.filter((r) => r.url.startsWith(ctx.api));
    v.push({ gruppo: g, nome: 'senza account il testo scritto nel runner non si scrive da nessuna parte', ok: !trovato.length && !inviate.length,
      extra: trovato.length ? 'trovato ' + trovato.join(' · ') : 'richieste all\'API: ' + inviate.map((r) => `${r.metodo} ${r.url}`).join(', ') });
    await tab.ricarica();
    const pronta = await tab.attendi(PRONTO, CARICO);
    const niente = pronta && await maiPer(async () => await tab.valuta(testoVisibile(OFFERTA)) || await tab.valuta(testoVisibile(testo)), 1000);
    v.push({ gruppo: g, nome: 'senza account, dopo una ricarica, nessun lavoro da riprendere', ok: !!niente,
      extra: !pronta ? 'la palestra non torna pronta dopo la ricarica' : `dopo la ricarica si vede «${OFFERTA}» o il testo scritto` });
  } finally { await c.chiudi(); }
}

/** Il difetto di oggi: con l'account una ricarica durante la prova perde il testo. */
async function c19ricarica(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c19r');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const p = await provaConTesto(tab, v, g, U, 'ricarica');
    if (!p) return;
    const [t0, t1] = p.testi;
    // Il testo si ricarica solo dopo che la pagina ha detto che e' conservato:
    // e' la promessa del §3.3. Una pagina che non lo dice si ricarica lo stesso,
    // e il rosso dice tutte e due le cose.
    const detto = await tab.attendi(testoVisibile(SALVATO), REAZIONE);
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    const offerta = await tab.attendi(testoVisibile(OFFERTA), CARICO);
    const riaperta = offerta && await clicca(tab, 'Riapri il lavoro') && await tab.attendiValore(campoC, (x) => x === t1, REAZIONE);
    const secondo = riaperta && riaperta.ok && await tab.valuta(esercizioC);
    await clic(tab, '#c-prev');
    const primoTesto = riaperta && riaperta.ok && (await tab.attendiValore(campoC, (x) => x === t0, REAZIONE)).ok;
    const ok = detto && !!riaperta && riaperta.ok && secondo !== p.primo && primoTesto;
    v.push({ gruppo: g, nome: DIFETTO_BOZZA, ok,
      extra: [!detto && `con il testo scritto la pagina non dice «${SALVATO}»`,
        !offerta && `dopo la ricarica non compare «${OFFERTA}»: il testo scritto e' perso`,
        offerta && !(riaperta && riaperta.ok) && `«Riapri il lavoro» non riporta il testo del secondo esercizio (in #c-input ${JSON.stringify(riaperta && riaperta.valore)})`,
        riaperta && riaperta.ok && secondo === p.primo && 'riaperta non torna all\'esercizio in cui eri',
        riaperta && riaperta.ok && !primoTesto && 'il testo del primo esercizio non c\'e\' piu\''].filter(Boolean).join('; ') });
    // Il tempo: la stessa bozza riaperta in una scheda con l'orologio dieci
    // minuti avanti deve avere circa cinquanta minuti, mai sessanta. Leggerlo
    // prima e dopo la ricarica non bastava: tutto il giro sta nel primo
    // secondo della prova, e «60:00» prima e dopo passava per giusto.
    const dieci = await c.apri(null, { prima: avanti(10 * 60000) });
    await dieci.vai(ctx.sito + '/app');
    await dieci.attendi(PRONTO, CARICO);
    const altrove = await dieci.attendi(testoVisibile(OFFERTA), CARICO) && await clicca(dieci, 'Riapri il lavoro');
    const { valore: resta } = await dieci.attendiValore(tempoC, (x) => secondiC(x) != null, REAZIONE);
    const s = secondiC(resta);
    v.push({ gruppo: g, nome: 'la ripresa non da\' tempo nuovo alla prova', ok: !!altrove && s != null && s <= 50 * 60 + 1 && s > 45 * 60,
      extra: !altrove ? 'nella seconda scheda il lavoro non si riapre' : `dieci minuti dopo l'avvio restano ${resta} (§3.3: mai 60 minuti nuovi)` });
    const righe = await nellaCopia(c, ctx, tab, U.chiave);
    const sulServer = await maiPer(() => ctx.righeDi(U.email) > 0, 1500);
    v.push({ gruppo: g, nome: 'la bozza non e\' una riga: niente nell\'archivio delle risposte, niente sul server', ok: righe === 0 && sulServer,
      extra: `righe nella copia ${righe}, sul server ${ctx.righeDi(U.email)}` });
  } finally { await c.chiudi(); }
}

/** Una prova scaduta mentre la pagina era chiusa si riapre al confronto, con quello che c'era scritto. */
async function c19scadenza(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c19s');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const p = await provaConTesto(tab, v, g, U, 'scadenza');
    if (!p) return;
    v.push({ gruppo: g, nome: 'scadenza: il testo si dice salvato', ok: await tab.attendi(testoVisibile(SALVATO), REAZIONE), extra: `«${SALVATO}» non compare` });
    // Un'altra scheda con l'orologio sessantuno minuti avanti: la stessa copia, piu' tardi.
    const tardi = await c.apri(null, { prima: avanti(61 * 60000) });
    await tardi.vai(ctx.sito + '/app');
    await tardi.attendi(PRONTO, CARICO);
    const offerta = await tardi.attendi(testoVisibile(OFFERTA), CARICO) && await clicca(tardi, 'Riapri il lavoro');
    const confronto = offerta && await tardi.attendi(js(`return V(document.querySelector('#c-fine')) && document.body.innerText.includes(${q(SCADUTO)});`), REAZIONE);
    const testi = confronto && await tardi.valuta(js(`const t = document.querySelector('#c-fine').innerText; return ${q(p.testi)}.every((x) => t.includes(x));`));
    v.push({ gruppo: g, nome: 'oltre la scadenza la prova riaperta va al confronto, con il testo scritto', ok: !!(confronto && testi),
      extra: !offerta ? `con l'orologio oltre la scadenza non compare «${OFFERTA}» con «Riapri il lavoro»`
        : !confronto ? `riaperta non mostra #c-fine con «${SCADUTO}»: in schermata ${await tardi.valuta(inSchermata)}` : 'il confronto non porta i testi scritti' });
    v.push({ gruppo: g, nome: 'scadenza: la prova scaduta non scrive righe da sola', ok: await nellaCopia(c, ctx, tardi, U.chiave) === 0, extra: 'righe nella copia prima del giudizio' });
  } finally { await c.chiudi(); }
}

/** Una scrittura che fallisce non dice «salvato», e dice come uscirne; tornata, il testo si salva. */
async function c19guasto(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c19g');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(null, { prima: GUASTO_IDB });
    await tab.vai(ctx.sito + '/app');
    const p = await provaConTesto(tab, v, g, U, 'guasto');
    if (!p) return;
    await tab.attendi(testoVisibile(SALVATO), REAZIONE);
    await tab.valuta('window.__guasto = true');
    await scriviC(tab, p.testi[1] + ' e ancora');
    const guasto = await tab.attendi(testoVisibile(GUASTO_BOZZA), REAZIONE);
    const falso = await tab.valuta(testoVisibile(SALVATO));
    const copia = await tab.valuta(pulsante('Copia i risultati'));
    v.push({ gruppo: g, nome: 'una scrittura fallita non dice «salvato», e offre di copiare i risultati', ok: guasto && !falso && copia,
      extra: falso ? `con la scrittura fallita si vede ancora «${SALVATO}»` : !guasto ? `con la scrittura fallita «${GUASTO_BOZZA}» non compare` : '«Copia i risultati» non c\'e\'' });
    await tab.valuta('window.__guasto = false');
    await scriviC(tab, p.testi[1] + ' e ancora di nuovo');
    v.push({ gruppo: g, nome: 'tornata la scrittura, il testo si salva', ok: await tab.attendi(testoVisibile(SALVATO), REAZIONE),
      extra: `dopo il guasto, con la scrittura di nuovo possibile, «${SALVATO}» non torna` });
  } finally { await c.chiudi(); }
}

/** Il giudizio rinviato resta nella bozza e non diventa una riga; concluso, le righe entrano e la bozza sparisce. */
async function c19giudizio(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c19j');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const p = await provaConTesto(tab, v, g, U, 'giudizio');
    if (!p) return;
    const consegnata = await consegnaC(tab);
    v.push({ gruppo: g, nome: 'giudizio: la consegna apre il confronto', ok: consegnata, extra: '#c-fine non si vede dopo due tocchi su #c-consegna' });
    await clic(tab, giudizioC(0, true));
    await clic(tab, giudizioC(1, false));
    await tab.attendi(premuto(giudizioC(1, false)), REAZIONE);
    const salvato = await tab.attendi(testoVisibile(SALVATO), REAZIONE);
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    const riaperta = await tab.attendi(testoVisibile(OFFERTA), CARICO) && await clicca(tab, 'Riapri il lavoro')
      && await tab.attendi(visibile('#c-fine'), REAZIONE);
    const tenuti = riaperta && await tab.valuta(premuto(giudizioC(0, true))) && await tab.valuta(premuto(giudizioC(1, false)))
      && !await tab.valuta(premuto(giudizioC(2, true))) && !await tab.valuta(premuto(giudizioC(2, false)));
    const righe = await nellaCopia(c, ctx, tab, U.chiave);
    v.push({ gruppo: g, nome: 'giudicata a meta\', la bozza tiene i giudizi dopo una ricarica e nessuna riga si scrive', ok: salvato && !!tenuti && righe === 0 && ctx.righeDi(U.email) === 0,
      extra: !salvato ? `con due giudizi dati «${SALVATO}» non compare` : !riaperta ? 'dopo la ricarica il confronto non si riapre' : !tenuti ? 'riaperto, i giudizi dati non sono quelli, o quelli rinviati sono segnati'
        : `righe nella copia ${righe}, sul server ${ctx.righeDi(U.email)}: il giudizio rinviato e' diventato una riga` });
    const n = await tab.valuta(js(`return document.querySelectorAll('#c-fine [data-cs][data-ok="1"]').length;`));
    for (let k = 2; k < n; k++) await clic(tab, giudizioC(k, true));
    await clic(tab, '#c-salva');
    const arrivate = await finche(() => ctx.righeDi(U.email) === n + 1, CARICO);
    const [a, ...altre] = arrivate ? E.attivitaCarteggio(ctx.righeServer(U.email), { tipo: 'c' }) : [];
    const una = !!a && !altre.length && !a.ambigua && a.fonte === 'sim_uid' && !!a.prova && a.n === n;
    v.push({ gruppo: g, nome: 'giudicata tutta e salvata, le righe arrivano come un\'attivita\' registrata', ok: una,
      extra: !arrivate ? `sul server ${ctx.righeDi(U.email)} righe, attese ${n + 1}` : JSON.stringify(a && { n: a.n, fonte: a.fonte, ambigua: a.ambigua, motivi: a.motivi, prova: !!a.prova, altre: altre.length }) });
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'conclusa, la bozza non torna dopo una ricarica', ok: await maiPer(() => tab.valuta(testoVisibile(OFFERTA)), 1500),
      extra: `dopo la conclusione e una ricarica compare ancora «${OFFERTA}»` });
  } finally { await c.chiudi(); }
}

/** «Esci» con del lavoro in corso non lo cancella in silenzio; lo scarto chiede conferma. */
async function c19uscita(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c19u');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const p = await provaConTesto(tab, v, g, U, 'uscita');
    if (!p) return;
    await tab.attendi(testoVisibile(SALVATO), REAZIONE);
    await esciDa(tab);
    const detto = await tab.attendi(testoVisibile(USCITA_BOZZA), REAZIONE);
    const cons = await c.conservato(ctx.sito, tab);
    v.push({ gruppo: g, nome: 'con del lavoro in corso «Esci» non esce, e lo dice', ok: detto && copieAccount(cons).length === 1 && !richiesteA(tab, 'POST', '/v1/uscita').length,
      extra: !detto ? `«${USCITA_BOZZA}» non compare: in schermata ${await tab.valuta(inSchermata)}` : `copie ${copieAccount(cons).join(', ') || 'nessuna'}, POST /v1/uscita ${richiesteA(tab, 'POST', '/v1/uscita').length}` });
    await esc(tab);
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    const ancora = await tab.attendi(testoVisibile(OFFERTA), CARICO);
    await clicca(tab, 'Scarta la bozza');
    const chiede = await tab.attendi(testoVisibile(SCARTO), REAZIONE);
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    const resta = await tab.attendi(testoVisibile(OFFERTA), CARICO);
    v.push({ gruppo: g, nome: 'lo scarto chiede conferma, e senza conferma il lavoro resta', ok: ancora && chiede && resta,
      extra: !ancora ? 'dopo «Esci» e una ricarica il lavoro non e\' piu\' offerto' : !chiede ? `«Scarta la bozza» non chiede «${SCARTO}»` : 'senza conferma, dopo una ricarica il lavoro non c\'e\' piu\'' });
    await clicca(tab, 'Scarta la bozza');
    await tab.attendi(testoVisibile(SCARTO), REAZIONE);
    await clicca(tab, 'Sì, scarta la bozza');
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'scartata con conferma, la bozza non torna', ok: await maiPer(() => tab.valuta(testoVisibile(OFFERTA)), 1500),
      extra: `dopo lo scarto confermato e una ricarica compare ancora «${OFFERTA}»` });
  } finally { await c.chiudi(); }
}

/** Il cambio d'account fra schede: chi esce vede il lavoro dell'altra scheda, e niente di A arriva a B. */
async function c19schede(b, ctx, v, g) {
  const A = await nuovoAccount(ctx, 'c19a');
  const B = await nuovoAccount(ctx, 'c19b');
  const c = await b.nuovoContesto();
  try {
    const t1 = await c.apri(ctx.sito + '/app');
    const p = await provaConTesto(t1, v, g, A, 'schede');
    if (!p) return;
    await t1.attendi(testoVisibile(SALVATO), REAZIONE);
    const t2 = await c.apri(ctx.sito + '/app');
    await t2.attendi(nellaPagina('Account'), CARICO);
    await t2.attendi(js(`return ![...document.querySelectorAll('[aria-modal="true"], dialog[open]')].some(V);`), REAZIONE);
    await esciDa(t2);
    const vede = await t2.attendi(testoVisibile(USCITA_BOZZA), REAZIONE);
    v.push({ gruppo: g, nome: 'la scheda che esce conta il lavoro dell\'altra scheda, e non esce in silenzio', ok: vede && !richiesteA(t2, 'POST', '/v1/uscita').length,
      extra: !vede ? `«${USCITA_BOZZA}» non compare nella scheda che esce: in schermata ${await t2.valuta(inSchermata)}` : 'e\' partita una POST /v1/uscita' });
    await clicca(t2, 'Scarta il lavoro ed esci');
    const uscita = await finche(async () => copieAccount(await c.conservato(ctx.sito, t2)).length === 0, USCITA);
    const fermo = await t1.attendi(`!(${runnerC})`, REAZIONE);
    await scriviC(t1, 'scritto dopo l\'uscita');
    const nonRicrea = await maiPer(async () => copieAccount(await c.conservato(ctx.sito, t1)).length > 0, 1500);
    v.push({ gruppo: g, nome: 'scartato il lavoro ed uscita, la scheda che lo scriveva si ferma e non ricrea la copia', ok: uscita && fermo && nonRicrea,
      extra: !uscita ? 'la copia dell\'account non e\' stata cancellata' : !nonRicrea ? 'la scheda ferma ha ricreato una copia dell\'account' : 'il runner dell\'altra scheda e\' ancora aperto' });
    if (!await dentro(t2, B)) {
      v.push({ gruppo: g, nome: 'schede: si entra nel secondo account', ok: false, extra: `in schermata: ${await t2.valuta(inSchermata)}` });
      return;
    }
    await scriviC(t1, 'scritto con B dentro');
    await t2.ricarica();
    await t2.attendi(PRONTO, CARICO);
    const pulito = await maiPer(async () => await t2.valuta(testoVisibile(OFFERTA)) || await t2.valuta(testoVisibile(p.testi[0])), 1500);
    const soloB = copieAccount(await c.conservato(ctx.sito, t2));
    v.push({ gruppo: g, nome: 'un altro account nella stessa finestra non trova il lavoro del primo', ok: pulito && soloB.length === 1 && soloB[0] === 'rg-account-' + B.chiave,
      extra: !pulito ? `entrato B, compare «${OFFERTA}» o il testo di A` : `copie ${soloB.join(', ')}` });
  } finally { await c.chiudi(); }
}

// --- L'area 6: la rifinitura trasversale (P-45) ----------------------------------------
//
// docs/area-6-progetto.md §10.1 chiede controlli su quello che una lettura del
// sorgente non vede: che cosa la pagina dice di conservare nei due regimi
// d'accesso, se un numero viene dalla sua fonte, se un guasto resta segnalato,
// se una finestra tiene il fuoco, se un avviso si vede davvero, se la pagina
// sborda. Il contratto per esteso sta li'; qui le misure.
//
// Le misure che girano nella pagina sono funzioni vere, serializzate con
// `toString()`: niente escape a mano, e il codice si legge. `kitPagina()` porta
// quello che servono tutte — visibilita', nome leggibile, colori, opacita'.

function kitPagina() {
  const V = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const nome = (e) => {
    const t = (e.textContent || e.value || '').trim().replace(/\s+/g, ' ');
    return (e.id ? '#' + e.id : e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].join('.') : ''))
      + (t ? ' «' + t.slice(0, 28) + '»' : '');
  };
  const rgba = (t) => {
    const m = String(t).match(/rgba?\(([^)]+)\)/);
    if (!m) return [0, 0, 0, 0];
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const sopra = (a, b) => [0, 1, 2].map((i) => a[i] * a[3] + b[i] * (1 - a[3])).concat(1);
  const lum = (c) => {
    const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const opacita = (e) => { let o = 1; for (let p = e; p; p = p.parentElement) o *= Number(getComputedStyle(p).opacity); return o; };
  // Il fondo dietro un elemento: i colori degli antenati composti fino al primo
  // opaco, sopra il bianco del documento. Un'immagine o una trasparenza di
  // gruppo lungo la strada lo rendono non misurabile: null, e si dice.
  const fondo = (e) => {
    const strati = [];
    for (let p = e; p; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.backgroundImage !== 'none' || Number(cs.opacity) < 1) return null;
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) { strati.push(c); if (c[3] >= 1) break; }
    }
    return strati.reverse().reduce((x, c) => sopra(c, x), [255, 255, 255, 1]);
  };
  // WCAG 1.4.3: 4,5:1, e 3:1 per il testo grande (24 px, o 18,66 px in grassetto).
  const contrasto = (e) => {
    const cs = getComputedStyle(e), bg = fondo(e);
    if (!bg) return null;
    const fg = sopra(rgba(cs.color), bg);
    const a = lum(fg), b = lum(bg);
    const px = parseFloat(cs.fontSize), grande = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700);
    return { r: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), soglia: grande ? 3 : 4.5, fg: cs.color,
      bg: `rgb(${bg.slice(0, 3).map(Math.round).join(', ')})` };
  };
  const haTesto = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  return { V, nome, opacita, fondo, contrasto, haTesto };
}

/** Un'espressione che esegue `f(kit, ...argomenti)` nella pagina. */
const inPagina = (f, ...a) => `(${f})((${kitPagina})()${a.map((x) => ', ' + JSON.stringify(x)).join('')})`;

/**
 * Che cosa sborda (area 6 §5): la pagina che scorre di lato, un contenitore
 * che scorre di lato al suo interno — `overflow-x:auto` non e' da solo una
 * correzione —, un elemento che esce in parte dallo schermo, un testo o un
 * controllo tagliato da un antenato che nasconde. Un elemento tutto fuori
 * dallo schermo non sborda: e' messo li' apposta, e se e' un avviso lo prende
 * T-06.
 */
function sbordi(K, larghezza) {
  const W = document.documentElement.clientWidth, out = [];
  // Senza `<meta name="viewport">` un telefono dispone la pagina a 980 px e la
  // rimpicciolisce: non sborda, ma non e' nemmeno a quella larghezza. Misurato
  // il 30 settembre 2026 sulla pagina di riferimento, che non l'aveva: la
  // «misura a 375 px» misurava 980. La barra di scorrimento del desktop ne
  // toglie 15.
  if (larghezza && Math.abs(W - larghezza) > 20) return [`la pagina e' disposta a ${W} px invece di ${larghezza}: il browser non la adatta allo schermo (meta viewport)`];
  const sw = document.scrollingElement.scrollWidth;
  if (sw > W) out.push(`la pagina scorre di lato di ${sw - W} px`);
  const conta = (e) => e.matches('button, a, input, select, textarea, summary, label') || K.haTesto(e);
  for (const e of document.querySelectorAll('body *')) {
    if (!K.V(e)) continue;
    const cs = getComputedStyle(e);
    if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && e.scrollWidth > e.clientWidth + 1) {
      out.push(`${K.nome(e)} scorre di lato al suo interno di ${e.scrollWidth - e.clientWidth} px`);
    }
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if ((r.right > W + 1 && r.left < W) || (r.left < -1 && r.right > 0)) {
      out.push(`${K.nome(e)} esce dallo schermo di ${Math.round(Math.max(r.right - W, -r.left))} px`);
      continue;
    }
    if (!conta(e)) continue;
    for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o !== 'hidden' && o !== 'clip') continue;
      const q = p.getBoundingClientRect();
      if (r.right > q.right + 1 || r.left < q.left - 1) { out.push(`${K.nome(e)} e' tagliato da ${K.nome(p)}`); break; }
    }
  }
  return [...new Set(out)];
}

/**
 * Il contrasto di ogni testo che si vede (area 6 §4, appendice A): il colore
 * calcolato del testo sul fondo calcolato, non il nome di un token. Restano
 * fuori, e si contano, i testi su un fondo che non si misura (immagine,
 * trasparenza di gruppo); e quelli dei controlli disabilitati, che WCAG 1.4.3
 * esclude.
 */
function contrasti(K) {
  const bassi = [], nonMisurabili = new Set();
  let n = 0;
  for (const e of document.querySelectorAll('body *')) {
    if (!K.V(e) || !K.haTesto(e) || K.opacita(e) === 0) continue;
    const r = e.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) continue;
    if (e.closest('[disabled], [aria-disabled="true"]')) continue;
    const c = K.contrasto(e);
    if (!c) { nonMisurabili.add(K.nome(e)); continue; }
    n++;
    if (c.r < c.soglia) bassi.push(`${K.nome(e)} ${c.r.toFixed(2)}:1 (${c.fg} su ${c.bg}, soglia ${c.soglia})`);
  }
  return { n, bassi: [...new Set(bassi)], nonMisurabili: [...nonMisurabili] };
}

/**
 * I bersagli di tocco (area 6 §6, appendice A): ogni controllo che si vede e
 * si puo' usare, con il rettangolo che il browser gli da'. Una casella o un
 * pallino si misurano con la loro etichetta, che e' il bersaglio vero; un link
 * dentro una frase no, ed e' l'eccezione di WCAG 2.5.8. Il minimo AA e' 24 px,
 * l'obiettivo del progetto 44.
 */
function bersagli(K) {
  const piccoli = [], sotto24 = [];
  let n = 0;
  const inFrase = (a) => a.tagName === 'A' && [...a.parentElement.childNodes].some((x) => x !== a && x.nodeType === 3 && x.textContent.trim());
  for (const e of document.querySelectorAll('button, a[href], summary, select, textarea, input:not([type=hidden]), [role=button], [role=tab], [role=link]')) {
    if (!K.V(e) || e.disabled || K.opacita(e) === 0 || inFrase(e)) continue;
    let r = e.getBoundingClientRect();
    if (e.matches('input[type=checkbox], input[type=radio]')) {
      const l = e.closest('label') || (e.labels && e.labels[0]);
      if (l) r = l.getBoundingClientRect();
    }
    if (r.width < 2 || r.height < 2) continue;
    n++;
    const s = `${K.nome(e)} ${Math.round(r.width)}×${Math.round(r.height)}`;
    if (r.width < 24 || r.height < 24) sotto24.push(s);
    else if (r.width < 44 || r.height < 44) piccoli.push(s);
  }
  return { n, piccoli, sotto24 };
}

/**
 * Un avviso si vede davvero (area 6 §7 e §10.1, «un avviso presente nel DOM ma
 * occultato»): la frase c'e', occupa spazio, portata al centro sta dentro lo
 * schermo, non e' trasparente, non ha niente sopra, e il suo testo ha il
 * contrasto minimo. Se passa, l'elemento riceve un segno, e il banco chiede al
 * browser come lo espone ai lettori di schermo.
 */
function avviso(K, frase, segno) {
  const dentro = (x) => x.textContent.includes(frase);
  const tutti = [...document.querySelectorAll('body *')].filter((x) => dentro(x) && ![...x.children].some(dentro));
  if (!tutti.length) return { ok: false, perche: 'la frase non c\'e\' nel DOM' };
  // La stessa frase puo' stare in piu' punti — nel Percorso e nel runner che
  // gli sta sopra —: basta che una copia si veda davvero, e si dice perche'
  // non si vede la prima che ci prova.
  const visibili = tutti.filter(K.V);
  if (!visibili.length) return { ok: false, perche: `e' nel DOM ma non occupa spazio o e' visibility:hidden (${K.nome(tutti[0])})` };
  let primo = null;
  for (const e of visibili) {
    const perche = misuraAvviso(K, e);
    if (!perche) { e.setAttribute('data-banco-avviso', segno); return { ok: true }; }
    primo = primo || perche;
  }
  return { ok: false, perche: primo };
  function misuraAvviso(K, e) {
    e.scrollIntoView({ block: 'center', inline: 'nearest' });
    // La prima riga del testo: il rettangolo d'insieme di un testo su due righe
    // comprende pezzi di pagina che non sono suoi.
    const r = e.getClientRects()[0];
    if (!r || r.width < 2 || r.height < 2) return `misura ${r ? Math.round(r.width) + '×' + Math.round(r.height) : '0×0'} px`;
    const cx = r.left + Math.min(r.width / 2, 20), cy = r.top + r.height / 2;
    if (cx < 0 || cx > innerWidth || cy < 0 || cy > innerHeight) return `sta fuori dallo schermo (${Math.round(r.left)}, ${Math.round(r.top)})`;
    const o = K.opacita(e);
    if (o < 0.95) return `e' trasparente (opacita' ${o.toFixed(2)})`;
    const t = document.elementFromPoint(cx, cy);
    if (!t || !(e.contains(t) || t.contains(e))) return `ha sopra ${t ? K.nome(t) : 'niente'}`;
    const c = K.contrasto(e);
    if (c && c.r < c.soglia) return `ha un contrasto di ${c.r.toFixed(2)}:1 (${c.fg} su ${c.bg})`;
    return null;
  }
}

/** Le regioni vive che dicono `re`: segnate, perche' il banco chieda al browser se le espone. */
function vive(K, re, segno) {
  const r = new RegExp(re, 'i');
  const tutte = [...document.querySelectorAll('[role=alert], [role=status], [role=log], [aria-live]:not([aria-live=off])')].filter((x) => r.test(x.textContent));
  tutte.forEach((x, i) => x.setAttribute('data-banco-vivo', segno + '-' + i));
  return tutte.map((x, i) => ({ segno: segno + '-' + i, nome: K.nome(x) }));
}

/**
 * Un arresto di Tab (area 6 §6): chi ha il fuoco, se il suo centro si vede e
 * non ha niente sopra, e — al passo dopo, quando l'ha perso — se il suo aspetto
 * cambiava: un indicatore che non cambia niente non indica il fuoco.
 */
function passoFuoco(K) {
  const firma = (e) => { const s = getComputedStyle(e); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderColor, s.backgroundColor, s.color, s.textDecorationLine].join('|'); };
  const st = window.__bancoFuoco || (window.__bancoFuoco = { prec: null, esiti: [] });
  if (st.prec && st.prec.el !== document.activeElement) {
    const x = st.prec;
    st.esiti.push({ nome: x.nome, cambia: firma(x.el) !== x.firma, coperto: x.coperto });
  }
  const a = document.activeElement;
  if (!a || a === document.body || a === document.documentElement) { st.prec = null; return { giro: false, niente: true }; }
  const giro = a.hasAttribute('data-banco-fuoco');
  a.setAttribute('data-banco-fuoco', '');
  const r = a.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let coperto = null;
  if (cx < 0 || cx > innerWidth || cy < 0 || cy > innerHeight) coperto = 'fuori dallo schermo';
  else {
    const t = document.elementFromPoint(cx, cy);
    if (!t || !(a.contains(t) || t.contains(a))) coperto = 'sotto ' + (t ? K.nome(t) : 'niente');
  }
  st.prec = { el: a, nome: K.nome(a), firma: firma(a), coperto };
  return { giro, n: st.esiti.length };
}

/** Il fuoco rispetto alla finestra modale che si vede. */
function fuocoModale(K) {
  const m = [...document.querySelectorAll('[aria-modal="true"]')].find(K.V);
  const a = document.activeElement;
  if (m) m.setAttribute('data-banco-modale', '');
  return { modale: !!m, dentro: !!m && !!a && m.contains(a), chi: a ? K.nome(a) : 'niente',
    focusabili: m ? [...m.querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(K.V).length : 0 };
}

const VISTE_RIF = ['oggi', 'quiz', 'cart', 'diag', 'tec', 'seg', 'info'];
const NOMI_VISTE = { oggi: 'Percorso', quiz: 'Quiz', cart: 'Carteggio', diag: 'Progressi', tec: 'Che tecnica serve?', seg: 'Segnali', info: 'Info' };

/**
 * Una vista, dalla sua porta. Senza account Progressi non ha una porta
 * visibile nella barra (ADR-004): la vista si apre lo stesso, dalla porta nel
 * DOM, perche' anche la spiegazione che la sostituisce deve stare nello schermo.
 */
async function apriVista(tab, v) {
  const ok = await tab.valuta(js(`const e = [...document.querySelectorAll('[data-v="${v}"]')].find(V) || document.querySelector('[data-v="${v}"]');
    if (!e) return false; e.click(); return true;`));
  return ok && tab.attendi(js(`return V(document.getElementById('v-${v}'));`), REAZIONE);
}

/**
 * Le superfici della prova senza account, una per una: le viste, poi il
 * runner con una risposta, il riepilogo, e la finestra «Accedi». Su ognuna
 * `misura(dove)`; restituisce false se una non si apre.
 */
async function superfici(tab, misura) {
  for (const v of VISTE_RIF) {
    if (!await apriVista(tab, v)) return `la vista ${NOMI_VISTE[v]} non si apre`;
    await misura(NOMI_VISTE[v]);
  }
  if (!await apriVista(tab, 'oggi') || !await clic(tab, '[data-rotta-start]')) return 'l\'attivita\' del Percorso non parte';
  if (!await rispondiQuiz(tab, [], 'T', '')) return 'il runner non mostra un quesito della banca';
  await misura('il runner');
  if (!await chiudiQuiz(tab, [], 'T', '')) return 'il riepilogo non si apre';
  await misura('il riepilogo');
  if (!await alPercorso(tab)) return 'dal riepilogo non si torna al Percorso';
  if (!await apriAccedi(tab)) return 'la finestra «Accedi» non si apre';
  await misura('la finestra «Accedi»');
  await tab.tasto('Escape');
  await tab.attendi(`!(${modaleVisibile})`, REAZIONE);
  return null;
}

/** La pagina si dispone davvero a `larghezza` (vedi sbordi): senza, una misura «a 375 px» ne misura 980. */
const disposta = (tab, larghezza) => tab.valuta(`Math.abs(document.documentElement.clientWidth - ${larghezza}) <= 20 ? null : document.documentElement.clientWidth`);

/** «Accedi» nell'intestazione, con il fuoco e Invio come da tastiera, fino alla finestra. */
async function apriAccedi(tab) {
  if (!await tab.valuta(js(`const b = document.getElementById('conto-porta'); if (!V(b)) return false; b.focus(); return document.activeElement === b;`))) return false;
  await tab.tasto('Enter');
  return tab.attendi(modaleVisibile, REAZIONE);
}

/** Come il browser espone un elemento; null se nel frattempo la pagina l'ha ridisegnato. */
async function esposto(tab, selettore) {
  try { return await tab.accessibile(selettore); } catch { return null; }
}

/**
 * Un avviso misurato, poi chiesto all'albero di accessibilita': { ok, extra }.
 * Misura e domanda si ripetono insieme: una pagina che ridisegna i suoi avvisi
 * (il Percorso lo fa a ogni aggiornamento dello stato) toglie il nodo segnato
 * fra l'una e l'altra.
 */
async function avvisoVisibile(tab, frase) {
  let ultimo = 'la misura non gira';
  for (const fine = Date.now() + REAZIONE; ;) {
    const segno = `a${++serie}`;
    const m = await tab.valuta(inPagina(avviso, frase, segno)).catch(() => null);
    if (m && m.ok) {
      const ax = await esposto(tab, `[data-banco-avviso="${segno}"]`);
      if (ax && !ax.ignorato) return { ok: true, extra: '' };
      if (ax) ultimo = 'si vede, ma l\'albero di accessibilita\' lo ignora: un lettore di schermo non lo legge';
    } else if (m) ultimo = m.perche;
    if (Date.now() > fine) return { ok: false, extra: `«${frase}» non si vede davvero: ${ultimo}` };
    await pausa(80);
  }
}

/** Una regione viva che dice `re`, esposta ai lettori di schermo: { ok, extra }. */
async function annunciato(tab, re) {
  let visti = [];
  for (const fine = Date.now() + REAZIONE; ;) {
    const segno = `v${++serie}`;
    visti = (await tab.valuta(inPagina(vive, re.source, segno)).catch(() => null)) || [];
    for (const x of visti) {
      const ax = await esposto(tab, `[data-banco-vivo="${x.segno}"]`);
      if (ax && !ax.ignorato) return { ok: true, extra: '' };
    }
    if (Date.now() > fine) break;
    await pausa(80);
  }
  return { ok: false, extra: visti.length ? `le regioni vive che lo dicono sono ignorate dall'albero di accessibilita': ${visti.map((x) => x.nome).join('; ')}`
    : `nessuna regione viva (role alert o status, aria-live) dice ${re}` };
}

const lista = (xs, n = 6) => xs.slice(0, n).join('; ') + (xs.length > n ? ` … e altri ${xs.length - n}` : '');
/** «superficie: difetto» raggruppati per difetto: lo stesso sbordo in sette viste e' un difetto solo, detto con le sue viste. */
const perDifetto = (xs, n = 6) => {
  const m = new Map();
  for (const x of xs) { const i = x.indexOf(': '); const k = x.slice(i + 2); if (!m.has(k)) m.set(k, []); m.get(k).push(x.slice(0, i)); }
  return lista([...m].map(([k, d]) => `${k} (${d.join(', ')})`), n);
};

// Le frasi con cui l'account dice che le risposte sono conservate — nel tuo
// account, sul server, su questo dispositivo —, e le due che il §3 del progetto
// vieta alla prova: «salvato» da solo e «riprendi domani». Senza account non
// devono mai comparire (R-RIF-01): nessuna delle due pagine le usa in forma
// negativa o al futuro, che sono le forme della prova («non salviamo niente»,
// «con l'account si salvano sul server»), e che qui non combaciano.
const FRASI_SALVATO = [/\d+ rispost[ae] salvat[ae]/i, /rispost[ae] salvat[ae]\s*:/i, /rispost[ae] salvat[ae] nel tuo account/i,
  /confermat[aeio] (sul|dal) server/i, /salvat[oaie] su questo dispositivo/i, /^\s*salvat[oaie][.!]?\s*$/im, /riprend[ei] domani/i];
// Quelle che, con l'account, dicono che le righe sono sul server (R-RIF-02).
const FRASI_SERVER = [/confermat[aeio] (sul|dal) server/i, /rispost[ae] salvat[ae] nel tuo account/i, /\d+ rispost[ae] salvat[ae]/i];
const fraseVista = (frasi) => `(() => { const t = document.body.innerText; for (const r of [${frasi.map(String).join(', ')}]) { const m = t.match(r); if (m) return m[0]; } return null; })()`;
// Il numero di Info: «risposte ai quiz N» (R-RIF-03).
const QUIZ_IN_INFO = `(() => { const m = document.body.innerText.match(/risposte ai quiz (\\d+)/); return m ? Number(m[1]) : null; })()`;
const DA_INVIARE = `(() => { const m = document.body.innerText.match(/(\\d+) rispost[ae] da inviare/); return m ? Number(m[1]) : null; })()`;
// Il segnale del guasto sulla porta di Info, da qualunque vista (specifica §8).
const SEGNALE_INFO = 'Salvataggio da controllare';
const segnaleInInfo = js(`return [...document.querySelectorAll('[data-v="info"]')].filter(V).some((b) => b.innerText.includes(${q(SEGNALE_INFO)}));`);
const AVVISO_GUASTO = 'Le ultime risposte potrebbero non essere salvate.';

/** La copia dell'account letta dalla pagina: risposte ai quiz e coda da inviare, dalla fonte e non dalla schermata. */
const copiaConto = (chiave) => `(async () => {
  if (!(await indexedDB.databases()).some((d) => d.name === ${q('rg-account-' + chiave)})) return null;
  return new Promise((ok) => {
    const q = indexedDB.open(${q('rg-account-' + chiave)});
    q.onerror = () => ok(null);
    q.onsuccess = () => {
      const db = q.result;
      try {
        const t = db.transaction(['righe', 'meta']);
        const r = t.objectStore('righe').getAll(), c = t.objectStore('meta').get('coda');
        t.oncomplete = () => { db.close(); ok({ quiz: r.result.filter((x) => x._t === 'q').length, daInviare: c.result ? c.result.daInviare.length : 0 }); };
        t.onerror = () => { db.close(); ok(null); };
      } catch { db.close(); ok(null); }
    };
  });
})()`;

/** Info e il suo numero, aspettato finche' combacia con `atteso(n)`. */
async function numeroInInfo(tab, atteso) {
  if (!await apriVista(tab, 'info')) return { ok: false, valore: 'Info non si apre' };
  return tab.attendiValore(QUIZ_IN_INFO, atteso, REAZIONE);
}

// --- T-01: senza account nessuna frase dice che le risposte sono conservate --------------

async function t01(b, ctx, v) {
  const g = 'T-01';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await fermaAlPrimo(v, async (w) => {
      const pronto = await tab.attendi(PRONTO, CARICO);
      const niente = async (dove) => {
        const f = await tab.valuta(fraseVista(FRASI_SALVATO));
        w.push({ gruppo: g, nome: `senza account ${dove} non dice che le risposte sono conservate`, ok: !f, extra: `si legge «${f}»` });
      };
      w.push({ gruppo: g, nome: 'la palestra si apre senza account', ok: pronto, extra: 'nessun [data-rotta-start] abilitato' });
      await niente('il Percorso');
      await clic(tab, '[data-rotta-start]');
      w.push({ gruppo: g, nome: 'una risposta senza account', ok: !!await rispondiQuiz(tab, [], g, ''), extra: 'il runner non mostra un quesito della banca' });
      await niente('il runner, dopo una risposta,');
      w.push({ gruppo: g, nome: 'il riepilogo si apre', ok: await chiudiQuiz(tab, [], g, ''), extra: 'nessun riepilogo' });
      await niente('il riepilogo');
      await alPercorso(tab);
      for (const x of ['diag', 'info']) { await apriVista(tab, x); await niente(NOMI_VISTE[x]); }
      // Il numero di Info viene dalle risposte della pagina, non da un contatore suo.
      const { ok, valore } = await numeroInInfo(tab, (n) => n === 1);
      w.push({ gruppo: g, nome: 'senza account Info conta le risposte della pagina aperta', ok, extra: `dopo una risposta Info dice «risposte ai quiz ${valore}»` });
    });
  } finally { await c.chiudi(); }
}

// --- T-02: con l'account e offline, da inviare e non sul server; i numeri dalla loro fonte ----

async function t02(b, ctx, v) {
  const g = 'T-02';
  const U = await nuovoAccount(ctx, 't02');
  const c = await b.nuovoContesto();
  // La rete che non risponde: ogni richiesta all'API resta ferma finche' il
  // banco non la lascia, e allora fallisce come senza rete. E' la forma
  // deterministica dell'offline: con l'emulazione della scheda un fetch fallisce
  // subito, e la finestra in cui la pagina dice ancora la frase di prima dura
  // quanto il suo timer — misurato il 30 settembre 2026 sulla pagina vera, circa
  // un secondo; con una rete che tace dura fino al timeout della pagina.
  let tieni = false, lascia;
  const via = new Promise((r) => { lascia = r; });
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.intercetta(ctx.api + '/*', async () => { if (!tieni) return null; await via; return { fallisci: 'InternetDisconnected' }; });
    let avanti = false;
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      await clic(tab, '[data-rotta-start]');
      const r1 = await rispondiQuiz(tab, [], g, '') && await chiudiQuiz(tab, [], g, '');
      const sul = r1 && await finche(() => ctx.righeDi(U.email) === 1, CARICO);
      const detto = sul && await tab.attendi(fraseVista(FRASI_SERVER), REAZIONE);
      w.push({ gruppo: g, nome: 'con la rete, quando il server ha la risposta, la pagina lo dice', ok: !!detto,
        extra: !sul ? `il server ha ${ctx.righeDi(U.email)} righe` : `in schermata nessuna frase del server: ${await tab.valuta(inSchermata)}` });
      tieni = true;
      for (let i = 0; i < 2; i++) {
        const ok = await unaDalPercorso(tab, g) && await chiudiQuiz(tab, [], g, '');
        w.push({ gruppo: g, nome: `con la rete che non risponde, la risposta ${i + 2} si da'`, ok: !!ok, extra: 'il runner o il riepilogo non si aprono' });
      }
      avanti = true;
    });
    if (!avanti) return;
    // Da qui ogni verifica gira anche dopo un rosso: un difetto dichiarato della
    // pagina vera non deve nascondere le verifiche dopo di lui (esame_difetto).
    const vista = async () => ctx.righeDi(U.email) !== 1 ? `il server ha ${ctx.righeDi(U.email)} righe` : await tab.valuta(fraseVista(FRASI_SERVER));
    let detta = null;
    const pulita = await maiPer(async () => { detta = await vista(); return !!detta; });
    v.push({ gruppo: g, nome: 'con due risposte che il server non ha, la pagina non dice che sono sul server', ok: pulita,
      extra: `con la rete che non risponde e due risposte in coda si legge «${detta}»` });
    const fonte0 = await tab.valuta(copiaConto(U.chiave));
    const n0 = await tab.attendiValore(DA_INVIARE, (n) => fonte0 && n === fonte0.daInviare && n === 2, REAZIONE);
    v.push({ gruppo: g, nome: 'mentre l\'invio non risponde, il numero da inviare e\' quello della coda', ok: n0.ok,
      extra: `la pagina dice «${n0.valore} risposte da inviare», la coda nella copia ne ha ${fonte0 ? fonte0.daInviare : '— (copia illeggibile)'}` });
    await tab.offline(true);
    lascia();
    try {
      const fonte = await tab.valuta(copiaConto(U.chiave));
      const { ok, valore } = await tab.attendiValore(DA_INVIARE, (n) => fonte && n === fonte.daInviare && n === 2, CARICO);
      v.push({ gruppo: g, nome: 'offline, il numero da inviare e\' quello della coda', ok,
        extra: `la pagina dice «${valore} risposte da inviare», la coda nella copia ne ha ${fonte ? fonte.daInviare : '— (copia illeggibile)'}` });
      const falso = await tab.valuta(fraseVista(FRASI_SERVER));
      v.push({ gruppo: g, nome: 'offline la pagina non dice che le risposte sono sul server', ok: !falso && ctx.righeDi(U.email) === 1, extra: `si legge «${falso}»` });
      const info = await numeroInInfo(tab, (n) => fonte && n === fonte.quiz);
      v.push({ gruppo: g, nome: 'Info conta le risposte della copia dell\'account', ok: info.ok && fonte.quiz === 3,
        extra: `Info dice «risposte ai quiz ${info.valore}», la copia ne ha ${fonte ? fonte.quiz : '—'}` });
    } finally { await tab.offline(false); }
  } finally { lascia(); await c.chiudi(); }
}

// --- T-03: una scrittura fallita si vede, si annuncia, e il segnale non si spegne ---------

async function t03(b, ctx, v) {
  const g = 'T-03';
  const U = await nuovoAccount(ctx, 't03');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(null, { prima: GUASTO_IDB });
    await tab.vai(ctx.sito + '/app');
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      w.push({ gruppo: g, nome: 'prima del guasto Info non segnala niente', ok: !await tab.valuta(segnaleInInfo), extra: `la porta di Info dice gia' «${SEGNALE_INFO}»` });
      await tab.valuta('window.__guasto = true');
      await clic(tab, '[data-rotta-start]');
      w.push({ gruppo: g, nome: 'con la scrittura che fallisce, una risposta', ok: !!await rispondiQuiz(tab, [], g, ''), extra: 'il runner non mostra un quesito della banca' });
      const a = await annunciato(tab, /non (sono |è |essere )?(ancora )?salvat/);
      w.push({ gruppo: g, nome: 'la scrittura fallita si annuncia in una regione viva esposta', ...a });
      const r = await avvisoVisibile(tab, AVVISO_GUASTO);
      w.push({ gruppo: g, nome: 'con il runner aperto, l\'avviso del guasto si vede davvero', ...r });
      w.push({ gruppo: g, nome: 'la porta di Info segnala il guasto', ok: await tab.attendi(segnaleInInfo, REAZIONE), extra: `nessuna porta di Info visibile dice «${SEGNALE_INFO}»` });
      w.push({ gruppo: g, nome: 'il riepilogo si apre', ok: await chiudiQuiz(tab, [], g, ''), extra: 'nessun riepilogo' });
      const rr = await avvisoVisibile(tab, AVVISO_GUASTO);
      w.push({ gruppo: g, nome: 'nel riepilogo l\'avviso del guasto si vede davvero', ...rr });
      // Tornata la scrittura, una risposta che si scrive davvero: il guasto di
      // prima resta segnalato (AGENTS.md: non spegnerlo mai «per pulizia»).
      await tab.valuta('window.__guasto = false');
      const ok = await unaDalPercorso(tab, g) && await chiudiQuiz(tab, [], g, '');
      const scritta = ok && await tab.attendiValore(copiaConto(U.chiave), (x) => x && x.quiz >= 1, REAZIONE);
      w.push({ gruppo: g, nome: 'tornata la scrittura, una risposta entra nella copia', ok: !!(scritta && scritta.ok), extra: 'la copia dell\'account non ha la risposta nuova' });
      let spento = null;
      for (const x of VISTE_RIF) { await apriVista(tab, x); if (!await tab.valuta(segnaleInInfo)) { spento = NOMI_VISTE[x]; break; } }
      w.push({ gruppo: g, nome: 'dopo una scrittura riuscita, in ogni vista Info segnala ancora il guasto', ok: !spento, extra: `in ${spento} la porta di Info non dice piu' «${SEGNALE_INFO}»` });
      await apriVista(tab, 'oggi');
      const p = await avvisoVisibile(tab, AVVISO_GUASTO);
      w.push({ gruppo: g, nome: 'nel Percorso l\'avviso del guasto si vede davvero', ...p });
    });
  } finally { await c.chiudi(); }
}

// --- T-04: dopo un 401, chi entra non vede le righe dell'identita' di prima --------------

async function t04(b, ctx, v) {
  const g = 'T-04';
  const A = await nuovoAccount(ctx, 't04a'), B = await nuovoAccount(ctx, 't04b');
  ctx.aggiungi(A.email, righeDi(`t04-${serie}`, 3));
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'A entra', ok: await dentro(tab, A), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      const a = await numeroInInfo(tab, (n) => n === 3);
      w.push({ gruppo: g, nome: 'Info conta le tre risposte di A', ok: a.ok, extra: `Info dice «risposte ai quiz ${a.valore}»` });
      ctx.revoca(A.email);
      const ok = await unaDalPercorso(tab, g) && await chiudiQuiz(tab, [], g, '');
      const scaduto = ok && await tab.attendi(js(`return [...document.querySelectorAll('button, a')].some((b) => V(b) && b.textContent.trim() === 'Accedi');`), CARICO);
      w.push({ gruppo: g, nome: 'la risposta dopo la revoca incontra il 401, e la pagina offre di nuovo «Accedi»', ok: !!scaduto, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      const primaA = ctx.righeDi(A.email);
      await entraCome(tab, B);
      const dentroB = await tab.attendi(nellaPagina('Account'), REAZIONE)
        && await tab.attendi(js(`return ![...document.querySelectorAll('[aria-modal="true"], dialog[open]')].some(V);`), REAZIONE);
      w.push({ gruppo: g, nome: 'B entra dalla stessa scheda', ok: !!dentroB, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      const fonte = await tab.valuta(copiaConto(B.chiave));
      const b4 = await numeroInInfo(tab, (n) => n === 0);
      w.push({ gruppo: g, nome: 'entrato B, Info conta le risposte di B e nessuna di A', ok: b4.ok && !!fonte && fonte.quiz === 0,
        extra: `Info dice «risposte ai quiz ${b4.valore}», la copia di B ne ha ${fonte ? fonte.quiz : '— (non c\'e\')'}; A ne aveva 4` });
      const isolati = await maiPer(() => ctx.righeDi(B.email) !== 0 || ctx.righeDi(A.email) !== primaA);
      w.push({ gruppo: g, nome: 'la risposta di A rimasta nel dispositivo non va a nessuno', ok: isolati, extra: `righe di B ${ctx.righeDi(B.email)}, di A ${primaA} → ${ctx.righeDi(A.email)}` });
    });
  } finally { await c.chiudi(); }
}

// --- T-05: il fuoco, nella finestra e in ogni arresto di Tab ------------------------------------

async function t05(b, ctx, v, parte) {
  if (!parte || parte === 'finestra') await t05finestra(b, ctx, v, 'T-05:finestra');
  if (!parte || parte === 'arresti') await t05arresti(b, ctx, v, 'T-05:arresti');
}

async function t05finestra(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.dimensioni(375, 800);
    await fermaAlPrimo(v, async (w) => {
      await tab.attendi(PRONTO, CARICO);
      const aperta = await apriAccedi(tab);
      const f = await tab.attendiValore(inPagina(fuocoModale), (x) => x && x.dentro, REAZIONE);
      w.push({ gruppo: g, nome: 'aperta da tastiera, la finestra «Accedi» prende il fuoco', ok: aperta && f.ok, extra: !aperta ? 'Invio su «Accedi» non apre una finestra aria-modal' : `il fuoco e' su ${f.valore && f.valore.chi}, fuori dalla finestra` });
      const ax = await esposto(tab, '[data-banco-modale]');
      w.push({ gruppo: g, nome: 'la finestra e\' esposta come dialogo modale con un nome', ok: !!ax && !ax.ignorato && /dialog/.test(ax.ruolo) && ax.modale === true && !!ax.nome.trim(),
        extra: `albero di accessibilita': ${JSON.stringify(ax)}` });
      let uscito = null;
      const giri = f.valore.focusabili + 3;
      for (let i = 0; i < giri + 3 && !uscito; i++) {
        await tab.tasto('Tab', { maiuscolo: i >= giri });
        const x = await tab.valuta(inPagina(fuocoModale));
        if (!x.dentro) uscito = x.chi;
      }
      w.push({ gruppo: g, nome: 'Tab e Maiusc+Tab restano dentro la finestra', ok: !uscito, extra: `il fuoco e' uscito su ${uscito}` });
      await tab.tasto('Escape');
      const chiusa = await tab.attendi(`!(${modaleVisibile})`, REAZIONE);
      w.push({ gruppo: g, nome: 'Esc chiude la finestra', ok: chiusa, extra: 'la finestra aria-modal e\' ancora aperta' });
      const torna = await tab.attendiValore(js(`return document.activeElement === document.getElementById('conto-porta') ? true : (document.activeElement ? document.activeElement.outerHTML.slice(0, 80) : 'niente');`), (x) => x === true, REAZIONE);
      w.push({ gruppo: g, nome: 'chiusa, il fuoco torna ad «Accedi»', ok: torna.ok, extra: `il fuoco e' su ${torna.valore}` });
    });
  } finally { await c.chiudi(); }
}

async function t05arresti(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.dimensioni(375, 800);
    await tab.attendi(PRONTO, CARICO);
    const largo = await disposta(tab, 375);
    let giro = !!largo;
    for (let i = 0; i < 80 && !giro; i++) {
      await tab.tasto('Tab');
      giro = (await tab.valuta(inPagina(passoFuoco))).giro;
    }
    const esiti = await tab.valuta('window.__bancoFuoco ? window.__bancoFuoco.esiti : []');
    const senza = esiti.filter((x) => !x.cambia).map((x) => x.nome);
    const coperti = esiti.filter((x) => x.coperto).map((x) => `${x.nome} (${x.coperto})`);
    v.push({ gruppo: g, nome: 'nel Percorso, a 375 px, ogni arresto di Tab ha un indicatore del fuoco', ok: esiti.length >= 5 && !senza.length,
      extra: largo ? `a 375 px la pagina e' disposta a ${largo} px (meta viewport)` : esiti.length < 5 ? `solo ${esiti.length} arresti di Tab` : `senza un indicatore che cambi: ${lista(senza)}` });
    v.push({ gruppo: g, nome: 'nel Percorso, a 375 px, nessun arresto di Tab resta coperto o fuori dallo schermo', ok: esiti.length >= 5 && !coperti.length,
      extra: `coperti: ${lista(coperti)}` });
  } finally { await c.chiudi(); }
}

// --- T-06: un avviso si vede davvero, non solo nel DOM ----------------------------------------

async function t06(b, ctx, v) {
  const g = 'T-06';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.dimensioni(375, 800);
    await fermaAlPrimo(v, async (w) => {
      await tab.attendi(PRONTO, CARICO);
      w.push({ gruppo: g, nome: 'senza account, nel Percorso l\'avviso di prima si vede davvero', ...await avvisoVisibile(tab, PRIMA) });
      await clic(tab, '[data-rotta-start]');
      const ok = await rispondiQuiz(tab, [], g, '') && await chiudiQuiz(tab, [], g, '');
      w.push({ gruppo: g, nome: 'il riepilogo si apre', ok: !!ok, extra: 'nessun riepilogo' });
      w.push({ gruppo: g, nome: 'senza account, nel riepilogo l\'invito si vede davvero', ...await avvisoVisibile(tab, DOPO) });
    });
  } finally { await c.chiudi(); }
}

// --- T-07: nessuna vista sborda — 1280, 640, 375, 320 ----------------------------------------

async function t07(b, ctx, v, parte) {
  if (!parte || parte === 'prova') await t07prova(b, ctx, v, 'T-07:prova');
  if (!parte || parte === 'conto') await t07conto(b, ctx, v, 'T-07:conto');
}

/** Gli sbordi di una superficie, a una larghezza: `dove` li precede nel rosso. */
async function sbordaA(tab, larghezza, dove, out) {
  await tab.dimensioni(larghezza, larghezza >= 1000 ? 900 : larghezza === 640 ? 500 : 800);
  await pausa(60);
  for (const x of await tab.valuta(inPagina(sbordi, larghezza))) out.push(`${dove}: ${x}`);
}

async function t07prova(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.attendi(PRONTO, CARICO);
    const per = { 1280: [], 640: [], 375: [], 320: [] }, altre = { 375: [], 320: [] };
    for (const L of [1280, 640, 375, 320]) {
      await tab.dimensioni(L, 800);
      for (const x of VISTE_RIF) { await apriVista(tab, x); await sbordaA(tab, L, NOMI_VISTE[x], per[L]); }
    }
    // Il runner, il riepilogo e la finestra: misurati a 375 e a 320 senza richiuderli.
    await tab.dimensioni(375, 800);
    const intoppo = await superfici(tab, async (dove) => {
      if (VISTE_RIF.some((x) => NOMI_VISTE[x] === dove)) return;
      for (const L of [375, 320]) await sbordaA(tab, L, dove, altre[L]);
      await tab.dimensioni(375, 800);
    });
    const nome = { 1280: 'a 1280 px nessuna vista scorre di lato o esce dallo schermo', 640: 'a 640 px — la larghezza CSS di 1280 px con lo zoom al 200 %, non lo zoom — nessuna vista sborda',
      375: 'a 375 px nessuna vista sborda' };
    for (const L of [1280, 640, 375]) v.push({ gruppo: g, nome: nome[L], ok: !per[L].length, extra: perDifetto(per[L]) });
    v.push({ gruppo: g, nome: 'a 375 px il runner, il riepilogo e la finestra «Accedi» non sbordano', ok: !intoppo && !altre[375].length, extra: intoppo || perDifetto(altre[375]) });
    v.push({ gruppo: g, nome: 'a 320 px nessuna vista, ne\' il runner, il riepilogo o la finestra «Accedi», sborda', ok: !intoppo && !per[320].length && !altre[320].length,
      extra: intoppo || perDifetto([...per[320], ...altre[320]]) });
  } finally { await c.chiudi(); }
}

async function t07conto(b, ctx, v, g) {
  // Con l'account: una copia con risposte vere, perche' Progressi mostri la mappa (area 5).
  const U = await nuovoAccount(ctx, 't07');
  ctx.aggiungi(U.email, righeDi(`t07-${serie}`, 40));
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.dimensioni(375, 800);
    if (!await dentro(tab, U)) { v.push({ gruppo: g, nome: 'si entra nell\'account', ok: false, extra: `in schermata: ${await tab.valuta(inSchermata)}` }); return; }
    const n = await numeroInInfo(tab, (x) => x === 40);
    v.push({ gruppo: g, nome: 'la copia dell\'account ha le sue risposte', ok: n.ok, extra: `Info dice «risposte ai quiz ${n.valore}»` });
    const per = { 375: [], 320: [] };
    for (const L of [375, 320]) {
      for (const x of ['oggi', 'diag', 'info']) { await tab.dimensioni(L, 800); await apriVista(tab, x); await sbordaA(tab, L, NOMI_VISTE[x], per[L]); }
      await tab.dimensioni(L, 800);
      await clic(tab, '#conto-porta');
      if (await tab.attendi(modaleVisibile, REAZIONE)) await sbordaA(tab, L, 'il pannello dell\'account', per[L]);
      else per[L].push('il pannello dell\'account non si apre');
      await tab.tasto('Escape');
      await tab.attendi(`!(${modaleVisibile})`, REAZIONE);
    }
    v.push({ gruppo: g, nome: 'con l\'account, a 375 px Percorso, Progressi, Info e il pannello dell\'account non sbordano', ok: !per[375].length, extra: perDifetto(per[375]) });
    v.push({ gruppo: g, nome: 'con l\'account, a 320 px Percorso, Progressi, Info e il pannello dell\'account non sbordano', ok: !per[320].length, extra: perDifetto(per[320]) });
  } finally { await c.chiudi(); }
}

// --- T-08 e T-09: contrasto e bersagli, su ogni superficie della prova, a 375 px -------------

async function t08(b, ctx, v) {
  const g = 'T-08';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.dimensioni(375, 800);
    await tab.attendi(PRONTO, CARICO);
    const bassi = [], vuote = [], nonMisurabili = [];
    let n = 0;
    const largo = await disposta(tab, 375);
    const intoppo = largo ? `a 375 px la pagina e' disposta a ${largo} px (meta viewport)` : await superfici(tab, async (dove) => {
      await pausa(60);
      const m = await tab.valuta(inPagina(contrasti));
      n += m.n;
      if (!m.n) vuote.push(dove);
      for (const x of m.bassi) bassi.push(`${dove}: ${x}`);
      for (const x of m.nonMisurabili) nonMisurabili.push(`${dove}: ${x}`);
    });
    v.push({ gruppo: g, nome: 'a 375 px la misura trova testi su ogni superficie della prova', ok: !intoppo && !vuote.length && n > 50,
      extra: intoppo || `nessun testo misurato in ${vuote.join(', ')} (${n} in tutto)` });
    v.push({ gruppo: g, nome: 'a 375 px ogni testo che si vede ha il contrasto minimo sul suo fondo', ok: !bassi.length,
      extra: `${perDifetto(bassi, 8)}${nonMisurabili.length ? ` — non misurabili: ${nonMisurabili.length}` : ''}` });
  } finally { await c.chiudi(); }
}

async function t09(b, ctx, v) {
  const g = 'T-09';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    await tab.dimensioni(375, 800);
    await tab.attendi(PRONTO, CARICO);
    const piccoli = [], sotto = [];
    let n = 0;
    const largo = await disposta(tab, 375);
    const intoppo = largo ? `a 375 px la pagina e' disposta a ${largo} px (meta viewport)` : await superfici(tab, async (dove) => {
      await pausa(60);
      const m = await tab.valuta(inPagina(bersagli));
      n += m.n;
      for (const x of m.sotto24) sotto.push(`${dove}: ${x}`);
      for (const x of m.piccoli) piccoli.push(`${dove}: ${x}`);
    });
    v.push({ gruppo: g, nome: 'a 375 px ogni controllo misura almeno 24 × 24 px, il minimo AA', ok: !intoppo && n > 20 && !sotto.length,
      extra: intoppo || (n <= 20 ? `solo ${n} controlli misurati` : perDifetto(sotto, 8)) });
    v.push({ gruppo: g, nome: 'a 375 px ogni controllo misura almeno 44 × 44 px, l\'obiettivo del progetto', ok: !piccoli.length, extra: perDifetto(piccoli, 8) });
  } finally { await c.chiudi(); }
}

// --- F-01: le frasi del riepilogo dei quiz (R-UX-06, P-53) -----------------------
//
// docs/area-3-progetto.md §4.2: il riepilogo di una breve attivita' fa tre
// affermazioni — che cosa e' successo, quali risposte rivedere, che cosa non hai
// toccato — e nessuna quarta, e nessun voto sulla preparazione. R-FLU-01 tiene i
// numeri del raccordo (tests/ciclo_quiz.mjs, senza DOM); qui si legge quello che
// si vede, nell'innerText di #r-fine, che non contiene un elemento nascosto
// (display o visibility): con textContent una frase nascosta passerebbe (P-49).
//
// Il banco sa da se' che cosa deve leggere, perche' e' lui a rispondere: dalla
// banca conosce la risposta esatta di quasi ogni quesito, e ne da' una giusta e
// una sbagliata, poi si ferma; dove la banca non basta (i gemelli di
// `esattaDi`) prende l'esito dal riscontro, e i numeri attesi sono comunque
// quelli di quello che e' successo. Poi una seconda attivita' nella stessa pagina, con
// una sola risposta giusta: se un numero viene dalle righe di tutta la pagina
// invece che da quelle dell'attivita' — il raccordo le prende per id —, qui si
// vede. Il totale lo legge da #r-pos, come chi studia.
//
// «Nessuna quarta» e' un elenco chiuso: ogni riga del riepilogo, tolti i testi
// dei pulsanti, deve essere una delle frasi ammesse dal §4.2 (piu' la
// conservazione del §3 e l'invito del client §4.1), e ogni pulsante una delle
// uscite del §6.1. Una frase nuova e' rossa finche' non entra qui, cioe'
// finche' qualcuno non ha deciso che e' ammessa. Non vede: l'ordine delle
// frasi, un testo reso invisibile con opacity o col colore del fondo, il
// riepilogo della simulazione (§4.3, che un esito ce l'ha), e l'account, dove
// cambia solo la frase di conservazione.

const QUIZ_X = (() => {
  const m = new Map();
  for (const it of JSON.parse(readFileSync(join(SITE, 'dati', 'quiz.json'), 'utf8'))) {
    const d = it.d.trim();
    if (!m.has(d)) m.set(d, []);
    m.get(d).push({ r: it.r.map(spazi), x: it.x });
  }
  return m;
})();
const RISPOSTE_VISTE = js(`return [...document.querySelectorAll('#r-ans .ans')].filter(V).map((b) => b.textContent.replace(/\\s+/g, ' ').trim());`);
const POSIZIONE = js(`const p = document.querySelector('#r-pos'); return p && V(p) ? p.textContent.trim() : null;`);
/**
 * L'indice della risposta esatta, dalla banca: testo e risposte in schermata.
 * `undefined` se il quesito non c'e'; `null` se la banca non basta a dirlo:
 * otto coppie di quesiti base — base-181…183, base-564/565 e altri — hanno testo
 * e risposte identici e l'esatta diversa, e cambia solo la figura. Misurato il
 * 1° ottobre 2026: 16 quesiti su 1.472, cioe' circa un quesito pescato su 200.
 */
function esattaDi(testo, viste) {
  const xs = (QUIZ_X.get(testo) || []).filter((it) => it.r.length === viste.length && it.r.every((r, j) => viste[j].endsWith(r)));
  if (!xs.length) return undefined;
  const x = new Set(xs.map((it) => it.x));
  return x.size === 1 ? [...x][0] : null;
}

/**
 * Una risposta voluta — giusta o sbagliata — e il suo riscontro. Restituisce
 * l'esito vero, letto dal riscontro (true, false), o null se non c'e' stato.
 * Quando la banca non sa dire l'esatta (`esattaDi` null) il banco risponde la
 * prima e prende l'esito dal riscontro: i numeri attesi sono sempre quelli di
 * quello che e' successo, non di quello che voleva.
 */
async function rispondiCosi(tab, v, g, prefisso, giusta) {
  const { ok, valore: visto } = await tab.attendiValore(QUESITO, quesitoDellaBanca, REAZIONE);
  const viste = ok ? await tab.valuta(RISPOSTE_VISTE) : [];
  const x = ok ? esattaDi(visto.testo, viste) : undefined;
  v.push({ gruppo: g, nome: `${prefisso}il quesito e le sue risposte si riconoscono dalla banca`, ok: x !== undefined,
    extra: `in schermata ${JSON.stringify(visto)}, risposte ${JSON.stringify(viste)}` });
  if (x === undefined) return null;
  const j = x === null ? 0 : giusta ? x : (x + 1) % viste.length;
  let fatto = false;
  for (let i = 0; i < 20 && !fatto; i++) {
    await clic(tab, `#r-ans .ans[data-i="${j}"]`);
    fatto = await tab.attendi(js(`return !!document.querySelector('#r-ans .ans.ok') && V(document.querySelector('#r-verdict'));`), 250);
  }
  const esito = fatto ? await tab.valuta(js(`return document.querySelector('#r-ans .ans[data-i="${j}"]').classList.contains('ok');`)) : null;
  v.push({ gruppo: g, nome: `${prefisso}la risposta ha il riscontro che la banca dice`, ok: fatto && (x === null || esito === giusta),
    extra: fatto ? `la risposta ${j} ${esito ? 'si accende' : 'non si accende'} come esatta, e la banca dice il contrario` : 'nessuna risposta si accende come esatta (.ans.ok)' });
  return fatto ? esito : null;
}

async function avantiQuiz(tab) {
  const prima = await tab.valuta(POSIZIONE);
  for (let i = 0; i < 20; i++) {
    await clic(tab, '#r-next');
    if (await tab.attendi(js(`const p = document.querySelector('#r-pos'); return !!p && p.textContent.trim() !== ${q(prima)};`), 250)) return true;
  }
  return false;
}

// Le frasi ammesse (area-3 §4.2, §3, §8; client §4.1), riga per riga.
const FRASI_RIEPILOGO = [
  /^(Attività conclusa|Ti sei fermato qui)$/,
  /^(Allenamento consigliato|Quiz per argomento|Ripasso degli errori|Un giro tra gli argomenti|Batteria|Riprova degli errori|Quiz) · Quiz (base|vela)$/,
  /^Hai risposto a (1 domanda|\d+ domande) su \d+\.$/,
  /^Risposte corrette: \d+$/, /^Risposte errate: \d+$/, /^Domande non affrontate: \d+$/,
  /^Puoi rivedere la tua risposta e quella ufficiale, poi riprovare questi quesiti\.$/,
  /^Tutte le risposte date in questa attività sono corrette\.$/,
  /^Le domande non affrontate non sono conteggiate come errori\.$/,
  /^Il raggruppamento di questa attività è ricostruito dalle risposte: inizio e fine non erano registrati\.$/,
  /^Quiz base mai incontrati qui: \d+\.$/,
  /^Non possiamo riaprire tutti i quesiti errati: alcuni non sono disponibili nella banca caricata\. Riprova a caricare i quiz\.$/,
  /^Non possiamo verificare l'elenco degli errori di questa attività\. Puoi rivedere le risposte disponibili o tornare ai Quiz\.$/,
  /^Questa attività non è più disponibile\.$/,
  /^Non riusciamo a leggere le risposte di questa attività\. Apri Info per controllare l'archivio\.$/,
  /^Le ultime risposte potrebbero non essere salvate\./,
  /^Senza account le risposte valgono solo finché questa pagina resta aperta\. Se la chiudi o la ricarichi, le perdi\. Non salviamo niente, nemmeno le tue preferenze\.$/,
  /^Le risposte si conservano nel tuo account e in questo dispositivo per l’offline\. Controlla lo stato dell’invio in Info\.$/,
  /^Vuoi conservare le attività di questa pagina\?$/,
  /^Senza account, chiudendo o ricaricando la pagina perdi le risposte e le preferenze\. Crea un account per salvare le risposte, ritrovarle su un altro dispositivo e vedere i Progressi quando ci sono abbastanza dati\.$/,
  /^Le risposte saranno legate alla tua email e conservate sul nostro server, in chiaro\. Il titolare può leggerle per supporto e statistiche\.$/,
  /^Puoi concludere qui\.$/,
];
// Le uscite ammesse (§6.1) e i pulsanti dell'invito (client §4.1).
const USCITE_RIEPILOGO = [
  /^Riprova (questo quesito|questi \d+ quesiti)$/, /^Rivedi gli errori$/, /^Rivedi le risposte$/, /^Rivedi il quiz base$/,
  /^Torna (al Percorso|ai Progressi|alla configurazione Quiz|ai Quiz)$/, /^Scegli un'altra attività$/,
  /^Crea un account e salva$/, /^Continua senza account$/, /^Hai già un account\? Accedi$/, /^Come trattiamo i dati$/,
];
// Un voto sulla preparazione, in qualunque punto del riepilogo: una
// percentuale, un giudizio, un livello, un confronto (§4.2: nessun «Sei
// migliorato», «Sei pronto», «livello iniziale», tema debole).
const VOTI = [/\d+\s*%/, /\bpront[oaie]\b/i, /\bmiglior/i, /\bpeggior/i, /\blivell[oi]\b/i, /\bpreparat[oaie]\b/i,
  /\bpreparazione\b/i, /\bvot[oi]\b/i, /\bpunteggi/i, /\bbrav[oaie]\b/i, /\bottim[oaie]\b/i, /\bdebol[ei]\b/i,
  /\bsufficient/i, /\bpromoss|\bbocciat/i, /\bpadronanza\b/i, /\bforte\b|\bforti\b/i];
const RIEPILOGO_VISTO = js(`const f = document.querySelector('#r-fine');
  return { testo: f.innerText, uscite: [...f.querySelectorAll('button, a')].filter(V).map((b) => b.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean) };`);

/** Le tre affermazioni, lette in quello che si vede, contro quello che il banco ha fatto. */
async function frasiRiepilogo(tab, v, g, prefisso, atteso) {
  const { testo, uscite } = await tab.valuta(RIEPILOGO_VISTO);
  // Nella pagina vera etichetta e numero stanno sulla stessa riga, in un flex
  // (`.ciclo-valori li`), e innerText li separa: per chi guarda sono
  // un'affermazione sola, e qui si ricuciono.
  const righe = [];
  for (const r of testo.split('\n').map(spazi).filter(Boolean)) {
    if (/^\d+$/.test(r) && righe.length && righe[righe.length - 1].endsWith(':')) righe[righe.length - 1] += ' ' + r;
    else righe.push(r);
  }
  const ha = (r) => righe.includes(r);
  const { risposte: R, totale: T, corrette: C } = atteso, E = R - C, M = T - R;
  const breve = righe.join(' | ').slice(0, 400);
  v.push({ gruppo: g, nome: `${prefisso}il riepilogo dice che cosa e' successo: ${R} su ${T}, ${C} corrette, ${E} errate`,
    ok: ha(`Hai risposto a ${R === 1 ? '1 domanda' : `${R} domande`} su ${T}.`) && ha(`Risposte corrette: ${C}`) && ha(`Risposte errate: ${E}`),
    extra: `in schermata: ${breve}` });
  const riprova = E === 1 ? 'Riprova questo quesito' : `Riprova questi ${E} quesiti`;
  const rivedere = E
    ? ha('Puoi rivedere la tua risposta e quella ufficiale, poi riprovare questi quesiti.') && uscite.includes('Rivedi gli errori') && uscite.includes(riprova)
    : ha('Tutte le risposte date in questa attività sono corrette.') && !uscite.includes('Rivedi gli errori') && !uscite.some((u) => u.startsWith('Riprova'));
  v.push({ gruppo: g, nome: `${prefisso}il riepilogo dice quali rivedere: ${E ? `«${riprova}» e «Rivedi gli errori»` : 'nessuna, tutte corrette'}`,
    ok: rivedere, extra: `in schermata: ${breve}; uscite: ${uscite.join(', ')}` });
  v.push({ gruppo: g, nome: `${prefisso}il riepilogo dice che cosa non hai toccato: ${M} domande non affrontate`,
    ok: ha(`Domande non affrontate: ${M}`) && (!M || ha('Le domande non affrontate non sono conteggiate come errori.')),
    extra: `in schermata: ${breve}` });
  const voti = VOTI.map((re) => testo.match(re)).filter(Boolean).map((m) => m[0]);
  v.push({ gruppo: g, nome: `${prefisso}nessun voto sulla preparazione`, ok: !voti.length, extra: `in schermata: ${voti.join(', ')}` });
  const fuori = [];
  for (const u of uscite) if (!USCITE_RIEPILOGO.some((re) => re.test(u))) fuori.push(`«${u}»`);
  const lunghe = [...uscite].sort((a, b) => b.length - a.length);
  for (let r of righe) {
    for (const u of lunghe) r = r.split(u).join('\n');
    for (const pezzo of r.split('\n').map(spazi).filter(Boolean)) if (!FRASI_RIEPILOGO.some((re) => re.test(pezzo))) fuori.push(`«${pezzo}»`);
  }
  v.push({ gruppo: g, nome: `${prefisso}nessuna quarta affermazione`, ok: !fuori.length, extra: `frasi che il §4.2 non ammette: ${fuori.join('; ')}` });
}

async function f01(b, ctx, v) {
  const g = 'F-01';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/app');
    const pronto = await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'la palestra si apre e la prima attivita\' si puo\' avviare', ok: pronto,
      extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` + (tab.errori.length ? ': ' + tab.errori[0] : '') });
    if (!pronto) return;
    // Prima attivita': una giusta e una sbagliata, poi «Termina». Con un
    // quesito che la banca non distingue si va avanti finche' ci sono tutte e
    // due, lasciando almeno una domanda non affrontata.
    await clic(tab, '[data-rotta-start]');
    const esiti = [];
    let T1 = null;
    while (!(esiti.includes(true) && esiti.includes(false))) {
      if (esiti.length) {
        const avanti = T1 - esiti.length >= 2 && await avantiQuiz(tab);
        v.push({ gruppo: g, nome: 'prima attivita\': «Avanti» porta al quesito dopo', ok: avanti,
          extra: T1 - esiti.length >= 2 ? '#r-pos non cambia dopo #r-next' : `#r-pos dice ${T1} domande: non bastano` });
        if (!avanti) return;
      }
      const e = await rispondiCosi(tab, v, g, 'prima attivita\': ', !esiti.includes(true));
      if (e === null) return;
      esiti.push(e);
      T1 = T1 ?? Number(((await tab.valuta(POSIZIONE)) || '').split('/')[1]);
    }
    if (!await chiudiQuiz(tab, v, g, 'prima attivita\': ')) return;
    await frasiRiepilogo(tab, v, g, 'prima attivita\': ', { risposte: esiti.length, corrette: esiti.filter(Boolean).length, totale: T1 });
    // Seconda attivita', nella stessa pagina: una sola risposta, giusta.
    await clic(tab, '[data-ciclo="ritorno"]');
    const pronto2 = await tab.attendi(js(`return !V(document.querySelector('#r-fine'));`), REAZIONE) && await tab.attendi(PRONTO, REAZIONE);
    v.push({ gruppo: g, nome: 'dal riepilogo si torna al Percorso, e un\'altra attivita\' si puo\' avviare', ok: pronto2,
      extra: '[data-ciclo="ritorno"] non chiude il riepilogo, o [data-rotta-start] non torna abilitato' });
    if (!pronto2) return;
    await clic(tab, '[data-rotta-start]');
    const e2 = await rispondiCosi(tab, v, g, 'seconda attivita\': ', true);
    if (e2 === null) return;
    const T2 = Number(((await tab.valuta(POSIZIONE)) || '').split('/')[1]);
    if (!await chiudiQuiz(tab, v, g, 'seconda attivita\': ')) return;
    await frasiRiepilogo(tab, v, g, 'seconda attivita\': ', { risposte: 1, corrette: e2 ? 1 : 0, totale: T2 });
  } finally { await c.chiudi(); }
}

const GRUPPI = { 'C-01': c01, 'C-02': c02, 'C-03': c03, 'C-04': c04, 'C-05': c05, 'C-06': c06, 'C-07': c07, 'C-08': c08, 'C-09': c09,
  'C-10': c10, 'C-11': c11, 'C-12': c12, 'C-13': c13, 'C-14': c14, 'C-15': c15, 'C-16': c16, 'C-17': c17, 'C-19': c19,
  // L'area 6 (P-45): la rifinitura trasversale.
  'T-01': t01, 'T-02': t02, 'T-03': t03, 'T-04': t04, 'T-05': t05, 'T-06': t06, 'T-07': t07, 'T-08': t08, 'T-09': t09,
  // Le frasi del riepilogo dei quiz (P-53, R-UX-06).
  'F-01': f01 };
// I gruppi che parlano con l'API: il server accetta una sola origine (§7.3),
// quindi girano uno alla volta sul sito principale. Gli altri girano in
// parallelo, ognuno con il suo sito e quindi con la sua origine.
const CON_API = new Set(['C-05', 'C-04', 'C-06', 'C-07', 'C-08', 'C-09', 'C-10', 'C-11', 'C-12', 'C-13', 'C-14', 'C-15', 'C-16', 'C-17', 'C-19',
  'T-02', 'T-03', 'T-04', 'T-07:conto']);
const SOLO_ALTRE = new Set(['C-14']);
// Una parte puo' parlare con l'API anche se il suo gruppo no: T-07:conto entra
// in un account, T-07:prova no, e gira dove c'e' posto.
const usaApi = (gr) => CON_API.has(gr) || CON_API.has(gr.split(':')[0]);

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
