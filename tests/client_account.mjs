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
// **Il contratto che la pagina deve rispettare** (§12 del progetto, «Il banco»):
//  - gli agganci del runner di oggi: [data-rotta-start], #r-text, #r-ans .ans,
//    #r-verdict e .ans.ok sulla risposta esatta dopo una risposta, #r-close, #r-fine.on con il suo h1, [data-ciclo="risposte"],
//    #rivedi.on con #rv-body;
//  - nel regime progettato, i testi e le etichette del progetto — «Crea un
//    account e salva», le etichette «Email» e «Password», «Crea l'account e
//    salva», «Questa email è già registrata.», «Accedi», «Reimposta la
//    password», «Torna all'attività» — e l'API in locale su
//    http://<stesso host>:8620 (account-progetto §7.4 e §16.3).
//
// Gruppi realizzati: C-01, C-02, C-05. Gli altri entrano quando serviranno.

import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avviaChrome } from './browser.mjs';
import { avvia } from '../server/server.mjs';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(RADICE, 'site');
export const PORTA_API = 8620;
const ESISTENTE = { email: 'gia@esempio.it', password: 'barca vela e vento' };
const ECONOMICO = { memory: 1024, passes: 1, parallelism: 1 };

// Quanto si aspetta. Misurato in locale il 26 settembre 2026: la palestra e' pronta in
// 0,3 s dal primo ingresso, il guscio in cache in meno di un secondo, e una
// reazione a un clic in millisecondi. Le attese stanno parecchie volte sopra,
// perche' una macchina carica non faccia un rosso falso; ogni rottura che le
// esaurisce costa quel tempo, ed e' il grosso della durata del banco.
const CARICO = 10000;
const REAZIONE = 5000;
const PARALLELE = 4;
const ASSESTAMENTO = 500;

// Le frasi del progetto, §4.1 e §5.2. Il controllo le cerca nel testo che si
// vede (innerText), non nel sorgente: una frase scritta e nascosta non avvisa.
const PRIMA = 'Senza account le risposte valgono solo finché questa pagina resta aperta.';
const DOPO = 'Vuoi conservare le attività di questa pagina?';
const PERDITA = 'chiudendo o ricaricando la pagina perdi le risposte';
const GIA = 'Questa email è già registrata.';

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
const js = (corpo) => `(() => { ${V} ${corpo} })()`;
const q = (s) => JSON.stringify(s);

const visibile = (sel) => js(`return V(document.querySelector(${q(sel)}));`);
const testoVisibile = (frase) => js(`return document.body.innerText.includes(${q(frase)});`);
const pulsante = (testo) => js(`return [...document.querySelectorAll('button, a')].some((b) => V(b) && b.textContent.trim() === ${q(testo)});`);
const clicca = (tab, testo) => tab.valuta(js(`const b = [...document.querySelectorAll('button, a')].find((b) => V(b) && b.textContent.trim() === ${q(testo)}); if (b) b.click(); return !!b;`));
const campo = (etichetta) => `[...document.querySelectorAll('label')].filter((l) => V(l) && l.textContent.trim().startsWith(${q(etichetta)})).map((l) => l.control).find(Boolean)`;
const imposta = (tab, etichetta, valore) => tab.valuta(js(`const c = ${campo(etichetta)}; if (!c) return false;
  c.focus(); c.value = ${q(valore)}; c.dispatchEvent(new Event('input', { bubbles: true })); c.dispatchEvent(new Event('change', { bubbles: true })); return true;`));
const clic = (tab, sel) => tab.valuta(js(`const e = document.querySelector(${q(sel)}); if (!V(e) || e.disabled) return false; e.click(); return true;`));
const passwordVisibile = js(`return [...document.querySelectorAll('input[type=password]')].some(V);`);

const PRONTO = js(`const b = document.querySelector('[data-rotta-start]'); return V(b) && !b.disabled;`);
const QUESITO = js(`const t = document.querySelector('#r-text'); return V(t) && t.textContent.trim().length > 10 && [...document.querySelectorAll('#r-ans .ans')].filter(V).length >= 2;`);
const RIEPILOGO = js(`const f = document.querySelector('#r-fine.on'); return V(f) && V(f.querySelector('h1'));`);

/** Dal primo ingresso a una risposta, poi «Termina»: il giro minimo. */
async function unaRisposta(tab, v, gruppo, prefisso = '') {
  const pronto = await tab.attendi(PRONTO, CARICO);
  v.push({ gruppo, nome: `${prefisso}la palestra si apre e la prima attivita' si puo' avviare`, ok: pronto,
    extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` + (tab.errori.length ? ': ' + tab.errori[0] : '') });
  if (!pronto) return null;
  const moduloPrima = await tab.valuta(passwordVisibile);
  await clic(tab, '[data-rotta-start]');
  const quesito = await tab.attendi(QUESITO, REAZIONE);
  const moduloDopo = await tab.valuta(passwordVisibile);
  v.push({ gruppo, nome: `${prefisso}il primo quesito compare senza account`, ok: quesito && !moduloPrima && !moduloDopo,
    extra: !quesito ? 'Inizia non apre un quesito con le sue risposte' : 'un campo password e\' visibile prima del primo quesito' });
  if (!quesito) return null;
  const testo = (await tab.valuta(`document.querySelector('#r-text').textContent.trim()`)).slice(0, 40);
  // La pagina e' sorda agli input per 200 ms dopo ogni cambio di schermata
  // (specifica §7.5): si ritocca finche' la risposta esatta non si accende.
  let verdetto = false;
  for (let i = 0; i < 20 && !verdetto; i++) {
    await clic(tab, '#r-ans .ans');
    verdetto = await tab.attendi(js(`return !!document.querySelector('#r-ans .ans.ok') && V(document.querySelector('#r-verdict'));`), 250);
  }
  v.push({ gruppo, nome: `${prefisso}la risposta ha il suo riscontro`, ok: verdetto, extra: 'toccata una risposta, nessuna si accende come esatta (.ans.ok)' });
  await clic(tab, '#r-close');
  const riepilogo = await tab.attendi(RIEPILOGO, REAZIONE);
  v.push({ gruppo, nome: `${prefisso}fermata dopo una risposta, si apre il riepilogo`, ok: riepilogo,
    extra: '«Termina l\'attivita\'» non apre #r-fine con il suo titolo' });
  return riepilogo ? testo : null;
}

async function revisione(tab, testo) {
  if (!await clic(tab, '[data-ciclo="risposte"]')) return false;
  return tab.attendi(js(`const r = document.querySelector('#rivedi'); return r.classList.contains('on') && V(document.querySelector('#rv-body')) && document.querySelector('#rv-body').textContent.includes(${q(testo)});`), REAZIONE);
}

async function guscioPronto(tab) {
  return tab.attendi(`(async () => {
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller && !(await navigator.serviceWorker.getRegistration())) return false;
    for (const k of await caches.keys()) {
      const c = await caches.open(k);
      if (await c.match('/app') && await c.match('/engine.js') && await c.match('/dati/quiz.json')) return true;
    }
    return false;
  })()`, CARICO);
}

// --- C-01: il primo quesito senza account, con la rete e senza ------------------

async function c01(b, ctx, v) {
  const g = 'C-01';
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
    // Le preferenze che la pagina di oggi conserva: la data d'esame e l'auto.
    await tab.valuta(js(`const d = document.querySelector('#esame-data'); if (d) { d.value = '2026-12-01'; d.dispatchEvent(new Event('change', { bubbles: true })); } return true;`));
    const testo = await unaRisposta(tab, v, g);
    if (!testo) return;
    const dopo = await tab.valuta(testoVisibile(DOPO)) && await tab.valuta(js(`return document.querySelector('#r-fine').innerText.includes(${q(PERDITA)});`));
    v.push({ gruppo: g, nome: 'alla fine dell\'attivita\' la pagina dice che cosa si perde', ok: dopo,
      extra: `il riepilogo non porta «${DOPO}» con «${PERDITA}» (§4.1)` });
    // Una scrittura puo' partire dopo il riepilogo, e finire dopo: si lascia
    // alla pagina il tempo di farla prima di guardare.
    await new Promise((ok) => setTimeout(ok, ASSESTAMENTO));
    const cons = await c.conservato(ctx.sito, tab);
    const trovato = personale(cons, ctx.api);
    v.push({ gruppo: g, nome: 'nessuna scrittura personale nel browser: IndexedDB, localStorage, sessionStorage, cookie, Cache Storage', ok: !trovato.length,
      extra: 'trovato ' + trovato.join(' · ') });
    const inviate = tab.richieste.filter((r) => r.url.startsWith(ctx.api));
    v.push({ gruppo: g, nome: 'nessuna richiesta all\'API senza account', ok: !inviate.length,
      extra: 'inviate: ' + inviate.map((r) => `${r.metodo} ${r.url}`).join(', ') });
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
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
    if (!await unaRisposta(tab, [], g)) return;
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

// --- il giro -------------------------------------------------------------------------

const GRUPPI = { 'C-01': c01, 'C-02': c02, 'C-05': c05 };
// I gruppi che parlano con l'API: il server accetta una sola origine (§7.3),
// quindi girano uno alla volta sul sito principale. Gli altri girano in
// parallelo, ognuno con il suo sito e quindi con la sua origine.
const CON_API = new Set(['C-05']);

async function servi(corrente) {
  const s = sito(corrente);
  await new Promise((ok) => s.listen(0, '127.0.0.1', ok));
  return { s, origine: `http://localhost:${s.address().port}`, chiudi: () => new Promise((ok) => s.close(ok)) };
}

async function gruppo(b, ctx, gr, regime) {
  const v = [];
  try { await GRUPPI[gr](b, ctx, v, regime); } catch (e) { v.push({ gruppo: gr, nome: `il gruppo ${gr} si esegue`, ok: false, extra: e.message }); }
  return v;
}

export async function esegui(prove) {
  // RG_TEMPI=1 stampa su stderr quanto dura ogni gruppo di ogni prova: e' cosi'
  // che si e' visto dove va il tempo del banco (§12, «Il tempo»).
  const tempi = (inizio, nome) => { if (process.env.RG_TEMPI) console.error(`${Math.round(performance.now() - inizio)} ms  ${nome}`); };
  const principale = { pagina: '' };
  const sp = await servi(principale);
  const cartella = mkdtempSync(join(tmpdir(), 'rg-client-'));
  const mail = [];
  // L'orologio del server avanza di due ore a ogni prova: le cinque
  // registrazioni l'ora per indirizzo (§6.5) contano anche i 409, e le prove
  // vengono tutte da 127.0.0.1.
  const orologio = { t: Date.now() };
  let api;
  try {
    api = await avvia({ db: join(cartella, 'conti.db'), cancellazioni: join(cartella, 'cancellazioni'), porta: PORTA_API,
      host: '127.0.0.1', ora: () => orologio.t, argon2: ECONOMICO, origine: sp.origine, sito: sp.origine,
      posta: { invia: async (m) => { mail.push(m); } }, log: () => {} });
  } catch (e) {
    await sp.chiudi();
    rmSync(cartella, { recursive: true, force: true });
    const perche = e.code === 'EADDRINUSE' ? `la porta ${PORTA_API} e' occupata: il banco ci mette il server degli account (account-progetto §16.3); ferma quello che la usa` : e.message;
    return Object.fromEntries(prove.map((p) => [p.nome, [{ gruppo: 'banco', nome: 'il banco parte', ok: false, extra: perche }]]));
  }
  const apiOrigine = `http://localhost:${PORTA_API}`;
  const sessioni = () => api.db.prepare('SELECT COUNT(*) AS n FROM sessione').get().n;
  const esiti = new Map(prove.map((p) => [p.nome, {}]));
  let b;
  try {
    const r = await fetch(`${api.indirizzo}/v1/registrazione`, { method: 'POST', headers: { origin: sp.origine, 'content-type': 'application/json' }, body: JSON.stringify(ESISTENTE) });
    if (r.status !== 201) throw new Error(`l'account esistente non si crea: ${r.status}`);
    b = await avviaChrome();

    const libere = prove.flatMap((p) => p.gruppi.filter((g) => !CON_API.has(g)).map((g) => ({ p, g })));
    const lavora = async () => {
      for (let x; (x = libere.shift());) {
        const inizio = performance.now();
        const proprio = { pagina: x.p.pagina };
        const sv = await servi(proprio);
        try {
          const ctx = { sito: sv.origine, api: apiOrigine, mail, sessioni, spegni: (si) => { proprio.spento = si; } };
          esiti.get(x.p.nome)[x.g] = await gruppo(b, ctx, x.g, x.p.regime);
        } finally { await sv.chiudi(); }
        tempi(inizio, `${x.p.nome} ${x.g}`);
      }
    };
    // La fila dell'API corre accanto alle altre: usa il sito principale, loro
    // i propri.
    const conApi = async () => {
      const ctx = { sito: sp.origine, api: apiOrigine, mail, sessioni, spegni: (si) => { principale.spento = si; } };
      for (const p of prove) {
        for (const g of p.gruppi.filter((x) => CON_API.has(x))) {
          const inizio = performance.now();
          principale.pagina = p.pagina;
          orologio.t += 2 * 3600 * 1000;
          esiti.get(p.nome)[g] = await gruppo(b, ctx, g, p.regime);
          tempi(inizio, `${p.nome} ${g}`);
        }
      }
    };
    await Promise.all([conApi(), ...Array.from({ length: PARALLELE }, lavora)]);
  } catch (e) {
    for (const p of prove) if (!Object.keys(esiti.get(p.nome)).length) esiti.get(p.nome).banco = [{ gruppo: 'banco', nome: 'il banco parte', ok: false, extra: e.message }];
  } finally {
    if (b) await b.chiudi();
    await api.chiudi();
    await sp.chiudi();
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
