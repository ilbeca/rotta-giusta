// Il banco del client degli account: la pagina vera, in un browser vero.
//
// docs/account-client-progetto.md §12 chiede diciotto gruppi di controlli,
// C-01…C-18, che guardano quello che una lettura del sorgente non vede:
// storage, rete, cookie, offline, due schede. Questo banco li esegue con
// Chrome headless (tests/browser.mjs), il sito servito da qui come lo serve
// l'host, e il server degli account vero (server/server.mjs) accanto.
//
// Uso: node tests/client_account.mjs  < {"prove":[{nome,pagina,gruppi,ingresso}]}
// Stampa {nome: [{gruppo, nome, ok, extra}]}. La pagina sostituisce il suo
// ingresso, `/`; il resto del sito e' quello di site/, la porta `site/app.html`
// compresa. Ogni pagina e' guidata come una pagina con il client: dal 30
// settembre 2026 (P-40) non c'e' piu' il regime della pagina senza account, e
// una pagina senza client e' rossa in ogni gruppo. E come una pagina del
// ridisegno: dal 20 ottobre 2026 (P-89) non c'e' piu' il regime della pagina di
// prima, con le sette viste su `/app`, e una pagina senza le due dichiarazioni
// e' rossa in ogni gruppo.
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
// Gruppi realizzati: C-01…C-17 (P-29, P-39, P-43; C-09 tolto da P-60), e C-19, la bozza del
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
//
// E da P-57 il gruppo C-20, le condizioni per l'account nel modulo di
// registrazione (R-ACC-75): il link a /avvertenza#condizioni e i 18 anni nella
// finestra, in quello che si vede, prima del pulsante, e l'ancora seguita. La
// sua ultima verifica chiede se la finestra si vede davvero (R-ACC-76).
//
// E da P-60 il gruppo C-22: l'offline tolto dall'ADR-005 — la pagina non
// registra un service worker, e un browser con la 0.29.0 installata la lascia
// senza service worker e senza cache. La parte offline di C-01 e' uscita.
//
// E da P-60 il gruppo C-21, al posto di C-09: l'archivio di prima degli account
// resta nel browser, e la pagina non lo legge e non lo cancella (ADR-005,
// R-ACC-05). C-09, il passaggio nell'account, e' uscito con la decisione.
//
// E da P-74 i gruppi E-01 e P-01: «com'e' andata» e la riga d'avvio delle
// simulazioni (docs/esito-esame-progetto.md §10.1, dove stanno il raccordo, gli
// agganci e le parti). Hanno due regimi, che tests/test_interfaccia.py legge
// dal testo della pagina e passa qui in `regimi`: senza il raccordo gira la
// parte `spento`, fino alla merge di P-75.

import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { avviaChrome } from './browser.mjs';
import { leggiPng, rapporto as rapportoPng } from './png.mjs';
import { SITE, MOTORE } from './sito.mjs';
import { avvia } from '../server/server.mjs';
import { aggiungiRighe, azzera as azzeraDb, esitiDi as esitiDb } from '../server/db.mjs';
import { copia as copiaDb, ripristina as ripristinaDb } from '../server/copie.mjs';
import { RACCOLTE, MOTIVO_AVVIO_SPENTO } from '../server/raccolte.mjs';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
// La cartella del sito che il banco legge e serve: site/, o la copia di RG_SITO
// (P-84). Il motore viene dalla stessa cartella, perche' i numeri attesi e la
// pagina servita parlino con lo stesso engine.js.
const E = await import(MOTORE);
export const PORTA_API = 8620;
const ESISTENTE = { email: 'gia@esempio.it', password: 'barca vela e vento' };
const ECONOMICO = { memory: 1024, passes: 1, parallelism: 1 };

// Quanto si aspetta, al massimo. Il banco aspetta **stati della pagina** — il
// pulsante abilitato, un quesito della banca con le sue risposte, il
// riepilogo, il service worker attivo —, e questi numeri sono solo le
// scadenze oltre le quali lo stato non e' arrivato: una pagina che funziona
// non le tocca. Misurato in locale il 26 settembre 2026: l'app e' pronta
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

// Un file del sito, per percorso: in Cache Storage e' il sito, non una risposta
// di chi studia (C-02). Fino al 3 ottobre 2026 qui c'era il GUSCIO di sw.js, la
// lista che il service worker metteva in cache; l'ADR-005 l'ha tolta, e
// quello che resta da distinguere e' un file del sito da qualunque altra cosa.
// Che una cache non ci sia proprio lo tiene C-22.
const DEL_SITO = (percorso) => {
  const f = normalize(join(SITE, percorso === '/' ? 'index.html' : percorso));
  return f.startsWith(SITE) && ((existsSync(f) && !statSync(f).isDirectory()) || existsSync(f + '.html'));
};

const TIPI = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.css': 'text/css' };

// --- il sito ------------------------------------------------------------------

function sito(corrente) {
  return createServer((req, res) => {
    // Spento, il sito non risponde: e' l'offline anche per il service worker,
    // che l'emulazione di rete della scheda non tocca (§12, «che cosa non copre»).
    if (corrente.spento) return req.socket.destroy();
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    // Una radice diversa da site/, tutta, pagina compresa: e' cosi' che C-22
    // serve la 0.29.0 sulla stessa origine, prima della versione nuova (P-60).
    const radice = corrente.radice || SITE;
    const ingressoDi = corrente.ingresso || '/';
    if ((p === ingressoDi || (ingressoDi === '/' && p === '/index.html')) && !corrente.radice) {
      res.writeHead(200, { 'Content-Type': TIPI['.html'], 'Cache-Control': 'no-cache' });
      return res.end(corrente.pagina);
    }
    // Una prova puo' portare una pagina del sito diversa da quella di site/
    // (`sito: { '/avvertenza': '<html>…' }`): e' cosi' che C-20 rompe l'ancora
    // delle condizioni senza toccare site/ (P-57).
    // Il tipo e' quello dell'estensione: un service worker servito come HTML
    // il browser non lo installa (C-22 sostituisce /sw.js).
    // Con la radice della 0.29.0 si serve la 0.29.0 intera: le rotture valgono per la versione nuova.
    if (corrente.sito && !corrente.radice && Object.hasOwn(corrente.sito, p)) {
      res.writeHead(200, { 'Content-Type': TIPI[extname(p)] || TIPI['.html'], 'Cache-Control': 'no-cache' });
      return res.end(corrente.sito[p]);
    }
    let f = normalize(join(radice, p === '/' ? 'index.html' : p));
    if (!f.startsWith(radice)) { res.writeHead(404); return res.end(); }
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
// Le finestre si impilano — un testo legale sopra il modulo, il modulo sopra
// Info (ridisegno §3.3, §6.1) —, e quella attiva e' l'ultima nel documento: si
// prende quella. Con una finestra sola e' la stessa.
const M = 'const M = () => [...document.querySelectorAll(\'[aria-modal="true"]\')].filter(V).pop() || document;';
const js = (corpo) => `(() => { ${V} ${M} ${corpo} })()`;
const q = (s) => JSON.stringify(s);

const visibile = (sel) => js(`return [...document.querySelectorAll(${q(sel)})].some(V);`);
/** La frase si vede, e viene prima del pulsante `inizia` nell'ordine del documento. */
const frasePrima = (frase, inizia) => js(`const s = [...document.querySelectorAll(${q(inizia)})].find(V); if (!s) return false;
  const ha = (x) => x.textContent.includes(${q(frase)});
  const f = [...document.querySelectorAll('body *')].filter((x) => ha(x) && ![...x.children].some(ha)).find(V);
  return !!f && !!(f.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING);`);
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

// --- la pagina di studio: il ridisegno (docs/ridisegno-progetto.md §10.1) ---
//
// Il documento di studio e' `/`, con quattro sezioni e tre segmenti, e le
// porte `[data-v]` di prima possono restare come alias (tabella C) o no. Il
// banco apre l'ingresso che la prova gli da', e per una porta di prima prova
// prima l'alias, poi la strada nuova — la sezione, il segmento, la porta
// dell'attivita'. Fino a P-89 c'era anche la pagina di prima, `/app` con sette
// viste, che aveva sempre l'alias: da li' vengono i nomi delle porte.
const ingresso = (ctx) => ctx.ingresso || '/';
// alias -> [sezione, segmento, porta dell'attivita'].
const ALIAS_PORTE = { quiz: ['allenati', 'quiz', null], cart: ['allenati', 'carteggio', null], seg: ['allenati', 'segnali', null],
  tec: ['allenati', 'carteggio', '[data-cporta="tecniche"]'], diag: ['progressi', null, null], oggi: ['home', null, null], info: ['home', null, '[data-profilo="info"]'] };
/**
 * Una porta di sezione. Con un'attivita' in corso, un tocco su un'altra
 * sezione chiede di uscire (navigazioneSito(), «chiedi-uscita»): il banco
 * conferma, come chi studia che ha deciso di andare.
 */
async function clicPorta(tab, sel) {
  if (!await clic(tab, sel)) return false;
  if (await tab.valuta(visibile('[data-uscita="si"]'))) await clic(tab, '[data-uscita="si"]');
  return true;
}
/** La sezione che la porta `x` apre; per «Che tecnica serve?» la sua preparazione (`[data-preparazione]`, §5.3). */
const vistaDi = (x) => (x === 'tec' ? '[data-preparazione]' : ALIAS_PORTE[x] ? `#v-${ALIAS_PORTE[x][0]}` : `#v-${x}`);
/** Apre la porta `x`: l'alias se c'e', altrimenti la strada del ridisegno. */
async function apriPorta(tab, x) {
  if (await clicPorta(tab, `[data-v="${x}"]`)) return true;
  const a = ALIAS_PORTE[x];
  if (!a) return false;
  const [sezione, segmento, attivita] = a;
  if (!await clicPorta(tab, `[data-v="${sezione}"]`)) return false;
  if (segmento && !(await tab.attendi(visibile(`[data-segmento="${segmento}"]`), REAZIONE) && await clic(tab, `[data-segmento="${segmento}"]`))) return false;
  if (attivita) return await tab.attendi(visibile(attivita), REAZIONE) && clic(tab, attivita);
  return true;
}
/**
 * La preparazione della simulazione: la porta sta in Esame (§5.4, P-80:
 * `data-modo="sim"` in #v-esame), e da li' la stessa preparazione con la
 * scelta della prova. Fino a P-89 c'era anche Quiz → «Simula la prova», la
 * strada della pagina di prima.
 */
async function portaSim(tab) {
  return await clicPorta(tab, '[data-v="esame"]') && await tab.attendi(visibile('#v-esame [data-modo="sim"]'), REAZIONE) && clic(tab, '#v-esame [data-modo="sim"]');
}

/**
 * Una porta del Carteggio fino al suo Inizia: `#c-start` per la prova, `#t-start`
 * per le tecniche. Il Carteggio ha tre porte (§5.3), e la prova apre la sua
 * preparazione.
 */
async function portaCarteggio(tab, che) {
  const inizia = che === 'tecniche' ? '#t-start' : '#c-start';
  if (!await apriPorta(tab, che === 'tecniche' ? 'tec' : 'cart')) return false;
  if (await tab.valuta(visibile(inizia))) return true;
  await clic(tab, `[data-cporta="${che}"]`);
  return tab.attendi(visibile(inizia), REAZIONE);
}

// I testi dell'onboarding (§6.1, §7.2): il resto del banco li cerca da qui.
// Fino a P-89 c'erano anche quelli della pagina di prima, che chiedeva la sola
// data («Salva la data», «Continua senza data»).
const TESTI = { salvaData: 'Salva le scelte', saltaData: 'Salta per ora', dataSalvata: 'Scelte salvate',
  dataNo: 'Le scelte non sono state salvate. Riprova oppure continua senza cambiarle' };
const testi = () => TESTI;

const passwordVisibile = js(`return [...document.querySelectorAll('input[type=password]')].some(V);`);
const modaleVisibile = js(`return [...document.querySelectorAll('[aria-modal="true"], dialog[open]')].some(V);`);
const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));

// La pagina e' pronta quando la prima porta della Home si puo' premere. Una
// ricarica riapre la sezione dell'indirizzo (§3.1), e la Home puo' non essere
// in vista: la porta c'e' lo stesso, e avviaPrima() ci va.
const PRONTO = js(`const bs = [...document.querySelectorAll('[data-rotta-start]')]; const b = bs.find(V) || bs[0]; return !!b && !b.disabled;`);

/**
 * La prima attivita', dalla sua porta: `[data-rotta-start]`. Apre la
 * preparazione comune (`[data-preparazione]`, ridisegno §5.1: «Entrambi aprono
 * la preparazione, non la domanda»), e il secondo tocco e' il suo Inizia,
 * `#start`. Se la porta aprisse il quesito, il banco lo prende com'e' (P-82).
 */
async function avviaPrima(tab) {
  if (!await tab.valuta(visibile('[data-rotta-start]'))) await apriPorta(tab, 'oggi');
  if (!await clic(tab, '[data-rotta-start]')) return false;
  return preparazioneInizia(tab);
}

/** Se si e' aperta una preparazione, il suo Inizia; se si e' aperto il runner, niente. */
async function preparazioneInizia(tab) {
  const { valore } = await tab.attendiValore(js(`const p = [...document.querySelectorAll('[data-preparazione]')].find(V);
    const s = p && p.querySelector('#start');
    if (s && V(s) && !s.disabled) return 'preparazione';
    return V(document.querySelector('#r-text')) || V(document.querySelector('#c-testo')) ? 'runner' : null;`), Boolean, REAZIONE);
  if (valore === 'preparazione') return clic(tab, '[data-preparazione] #start');
  return valore === 'runner';
}
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
    // La risposta si dice e compare «Avanti» (§9, QB: «n risposte, n−1
    // Avanti»), o fa avanzare. In tutti e due i casi nessuna correzione.
    ? js(`return (document.querySelector('#r-pos')?.textContent.trim() !== ${q(pos)} || V(document.querySelector('#r-next'))) && !document.querySelector('#r-ans .ans.ok');`)
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
  v.push({ gruppo, nome: `${prefisso}l'app si apre e la prima attivita' si puo' avviare`, ok: pronto,
    extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` + (tab.errori.length ? ': ' + tab.errori[0] : '') });
  if (!pronto) return null;
  await avviaPrima(tab);
  const testo = await rispondiQuiz(tab, v, gruppo, prefisso);
  if (!testo) return null;
  return await chiudiQuiz(tab, v, gruppo, prefisso) ? testo : null;
}

async function revisione(tab, testo) {
  if (!await clic(tab, '[data-ciclo="risposte"]')) return false;
  return tab.attendi(js(`const r = document.querySelector('#rivedi'); return r.classList.contains('on') && V(document.querySelector('#rv-body')) && document.querySelector('#rv-body').textContent.includes(${q(testo)});`), REAZIONE);
}

// La 0.29.0 installata (C-22, P-60): un service worker **attivo** — e' lui a
// servire la pagina dalla cache, e uno ancora in installazione la lascerebbe
// alla rete — e in cache quello che la pagina chiede. Fino al 3 ottobre 2026
// lo usava C-01 per la ricarica offline, che l'ADR-005 ha tolto. L'install scrive la cache prima di
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

// --- C-01: il primo quesito senza account ----------------------------------------

async function c01(b, ctx, v, parte) {
  const g = 'C-01';
  const vuole = (x) => !parte || parte === x;
  if (vuole('attivita')) {
    // Le altre attivita', ognuna fino al suo punto d'arrivo, senza account
    // (R-ACC-04): Quiz, simulazione, Carteggio, tecniche, Segnali.
    const a = await b.nuovoContesto();
    try { await attivita(await a.apri(ctx.sito + ingresso(ctx)), v, g); } finally { await a.chiudi(); }
  }
  if (!vuole('percorso')) return;
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    const testo = await unaRisposta(tab, v, g);
    if (testo) {
      v.push({ gruppo: g, nome: 'dal riepilogo la revisione mostra il quesito risposto', ok: await revisione(tab, testo),
        extra: '«Rivedi le risposte» non apre #rivedi con il quesito appena risposto' });
    }
  } finally { await c.chiudi(); }
  // Fino al 3 ottobre 2026 qui seguiva la stessa attivita' offline, con il
  // guscio in cache: l'ADR-005 ha tolto l'offline, e senza rete il sito non si
  // apre. Che la pagina non registri piu' un service worker lo tiene C-22.
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
  const porta = (sim ? await portaSim(tab) : await apriPorta(tab, 'quiz') && await tab.attendi(visibile(`[data-modo="${modo}"]`), REAZIONE)
    && await clic(tab, `[data-modo="${modo}"]`)) && await tab.attendi(js(`const b = [...document.querySelectorAll('#start')].find(V); return !!b && !b.disabled;`), REAZIONE);
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
  const porta = await apriPorta(tab, 'cart') && await tab.attendi(visibile('[data-v="tec"]'), REAZIONE)
    && await apriPorta(tab, 'tec') && await tab.attendi(visibile('#t-start'), REAZIONE);
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
  const porta = await portaCarteggio(tab, 'prova');
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
  await apriPorta(tab, 'oggi');
  const porta = await apriPorta(tab, 'seg') && await tab.attendi(visibile('#s-start'), REAZIONE);
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
  // «{giuste} su {N}» (§5.3), o «n / N».
  const fine = await tab.attendi(js(`const f = document.querySelector('#sr-fine'); return V(f) && /\\d+\\s*(\\/|su)\\s*\\d+/.test(f.innerText);`), REAZIONE);
  v.push({ gruppo: g, nome: `${p}la partita arriva in fondo e dice il punteggio`, ok: fine, extra: '#sr-fine non si vede, o non porta un punteggio «n / N» o «n su N»' });
  return fine;
}

async function attivita(tab, v, g) {
  const pronto = await tab.attendi(PRONTO, CARICO);
  v.push({ gruppo: g, nome: 'le altre attivita\': l\'app si apre', ok: pronto, extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` });
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
    const estranee = voci.filter((u) => { const x = new URL(u); return x.origin === api || !DEL_SITO(x.pathname); });
    if (estranee.length) out.push(`Cache Storage «${nome}»: ${estranee.join(', ')}`);
  }
  return out;
}

async function c02(b, ctx, v) {
  const g = 'C-02';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    const pronto = await tab.attendi(PRONTO, CARICO);
    // «Prima di cominciare» e' la preparazione, prima di «Inizia» (specifica §5.4,
    // «prima di ogni avvio»; decisione A del giro 1 delle regole di disegno, 24
    // ottobre 2026): fino ad allora la frase si cercava nella Home. Dove sta,
    // accanto all'azione e una volta sola, lo misura T-12.
    const prep = pronto && await preparazioneDa(tab, SIM_HOME);
    const prima = prep && await tab.valuta(frasePrima(PRIMA, INIZIA));
    v.push({ gruppo: g, nome: 'prima di cominciare, nella preparazione della simulazione, la pagina dice che senza account non resta niente', ok: prima,
      extra: prep ? `la frase del §4.1 «${PRIMA}» non si vede nella preparazione prima di «Inizia»` : 'dalla Home la preparazione della simulazione non si apre' });
    const seg = await apriPorta(tab, 'seg') && await tab.attendi(visibile('#s-start'), REAZIONE);
    v.push({ gruppo: g, nome: 'prima di cominciare i Segnali dicono che senza account i punteggi valgono per questa pagina', ok: seg && await tab.valuta(frasePrima(SEG_PRIMA, '#s-start')),
      extra: seg ? `la frase del §4.1 «${SEG_PRIMA}» non si vede prima di «Inizia»` : 'i Segnali non si aprono' });
    await apriPorta(tab, 'oggi');
    await tab.attendi(PRONTO, REAZIONE);
    // I Segnali prima dell'attivita': la finestra d'osservazione dopo il
    // riepilogo copre anche una scrittura dei loro punteggi.
    if (await partitaSegnali(tab, v, g, 'Segnali: ')) {
      v.push({ gruppo: g, nome: 'i Segnali dicono che senza account i punteggi valgono per questa pagina', ok: await tab.valuta(testoVisibile(SEG_PRIMA)),
        extra: `la frase del §4.1 «${SEG_PRIMA}» non si vede` });
      await apriPorta(tab, 'oggi');
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
    v.push({ gruppo: g, nome: 'dopo la ricarica l\'app torna pronta', ok: ripronta,
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await d.apri(ctx.sito + ingresso(ctx));
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
  await apriPorta(tab, 'oggi');
  return tab.attendi(PRONTO, REAZIONE);
}

/** Una nuova attivita' dal Percorso, fino a una risposta; senza riepilogo. */
async function unaDalPercorso(tab, g) {
  if (!await alPercorso(tab) || !await avviaPrima(tab)) return null;
  return rispondiQuiz(tab, [], g, '');
}

/** I pannelli si chiudono con Esc (§12, collaudo): il tasto va a chi ha il fuoco. */
const esc = (tab) => tab.valuta(`(document.activeElement || document.body).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); true`);

/** Accedi dall'intestazione (§3.2): «Accedi», poi il modulo. */
async function entraCome(tab, conto) {
  // Info e' un pannello sopra la pagina (§6.3): l'avatar «Accedi» sta sotto, e
  // chi studia chiude prima il pannello.
  if (!await clicca(tab, 'Accedi')) {
    if (!await tab.valuta(modaleVisibile)) return false;
    await esc(tab);
    if (!await tab.attendi(`!(${modaleVisibile})`, REAZIONE) || !await clicca(tab, 'Accedi')) return false;
  }
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

// Le porte, con i nomi delle sette viste di prima: oggi alias (tabella C del
// §10.1 del ridisegno), che apriPorta() segue fino alla sezione.
const VISTE = ['oggi', 'quiz', 'cart', 'diag', 'seg', 'info'];
const PROGRESSI_H0 = 'Nessuna risposta in questa pagina.';
// Il cruscotto: se uno di questi si vede senza account, Progressi e' una vista
// di zeri costruita dallo storico temporaneo (§3.2).
const CRUSCOTTO = ['#d-temi', '#d-voci', '#d-cons', '#sessioni'];

async function c03(b, ctx, v) {
  const g = 'C-03';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    if (!await tab.attendi(PRONTO, CARICO)) {
      v.push({ gruppo: g, nome: 'l\'app si apre', ok: false, extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` });
      return;
    }
    const mute = [], invadenti = [];
    // Ogni vista dal Percorso, che ha una porta verso ognuna (specifica §5.2).
    for (const x of VISTE) {
      await apriPorta(tab, 'oggi');
      if (!await apriPorta(tab, x) || !await tab.attendi(visibile(vistaDi(x)), REAZIONE)) { mute.push(x); continue; }
      // Info e' un pannello del Profilo, sopra la Home (§2): la sua finestra e'
      // la porta volontaria, non un invito. Il modulo e l'invito no.
      const pannelloInfo = x === 'info';
      if (await tab.valuta(passwordVisibile) || await tab.valuta(pulsante('Crea un account e salva')) || (!pannelloInfo && await tab.valuta(modaleVisibile))) invadenti.push(x);
    }
    v.push({ gruppo: g, nome: 'ogni vista si apre dal Percorso', ok: !mute.length, extra: 'non si aprono: ' + mute.join(', ') });
    v.push({ gruppo: g, nome: 'in nessuna vista un invito, un modulo o una finestra d\'account', ok: !invadenti.length, extra: 'invito, campo password o finestra modale in: ' + invadenti.join(', ') });
    await apriPorta(tab, 'diag');
    const cruscotto = await tab.valuta(js(`return ${q(CRUSCOTTO)}.filter((s) => V(document.querySelector(s)));`));
    // Progressi senza account (ridisegno §8.1) mostra la pagina aperta — H0:
    // «Nessuna risposta in questa pagina» e «Vai ad Allenati» —, spiega perche'
    // manca lo storico, e non ha un invito nel contenuto: i tre posti
    // dell'invito sono altri (ADR-006, R-ACC-03). «Accedi» resta sull'avatar.
    // Fino a P-89 c'era anche la pagina di prima, che diceva perche' Progressi
    // non c'era e portava al Percorso o ad Accedi.
    const invito = await tab.valuta(js(`const p = document.querySelector('#v-progressi'); return !!p && [...p.querySelectorAll('button, a')].some((b) => V(b) && /Crea un account|Conserva|Accedi/.test(b.textContent));`));
    v.push({ gruppo: g, nome: 'senza account Progressi dice che non ci sono risposte in questa pagina, con Vai ad Allenati e perche\' manca lo storico, senza un cruscotto ne\' un invito',
      ok: await tab.valuta(testoVisibile(PROGRESSI_H0)) && await tab.valuta(pulsante('Vai ad Allenati')) && await tab.valuta(testoVisibile('Perché qui manca lo storico')) && !cruscotto.length && !invito,
      extra: cruscotto.length ? 'si vede il cruscotto: ' + cruscotto.join(', ') : invito ? 'nel contenuto di Progressi c\'e\' un invito o un «Accedi» (ridisegno §8.1)' : `manca «${PROGRESSI_H0}», «Vai ad Allenati» o «Perché qui manca lo storico» (ridisegno §8.1)` });
    await apriPorta(tab, 'oggi');
    if (!await unaRisposta(tab, v, g)) return;
    v.push({ gruppo: g, nome: 'l\'invito e\' nel riepilogo', ok: await tab.valuta(testoVisibile(DOPO)) && await tab.valuta(pulsante('Continua senza account')),
      extra: `il riepilogo non porta «${DOPO}» con «Continua senza account» (§4.1)` });
    await clicca(tab, 'Continua senza account');
    const via = await tab.attendi(js(`return !document.body.innerText.includes(${q(DOPO)});`), REAZIONE);
    v.push({ gruppo: g, nome: '«Continua senza account» lo chiude senza chiedere altro', ok: via && !await tab.valuta(modaleVisibile),
      extra: via ? 'dopo «Continua senza account» si apre una finestra' : 'l\'invito resta dopo «Continua senza account»' });
    await apriPorta(tab, 'oggi');
    if (!await tab.attendi(PRONTO, REAZIONE)) return;
    await avviaPrima(tab);
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    v.push({ gruppo: g, nome: 'poi la data d\'esame, facoltativa', ok: data && await tab.valuta(pulsante(testi(ctx).saltaData)),
      extra: `«Hai una data d'esame?» con «${testi(ctx).saltaData}» non compare dopo il salvataggio (§11.1)` });
  } finally { await c.chiudi(); }
}

async function c04persa(b, ctx, v, g) {
  // La risposta alla registrazione si perde dopo che il server ha creato
  // l'account: misurato il 29 settembre, il cookie arriva lo stesso. La pagina
  // deve chiedere al server (GET /v1/io) prima di ripetere (§4.3).
  const d = await b.nuovoContesto();
  try {
    const tab = await d.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const t1 = await d.apri(ctx.sito + ingresso(ctx));
    await t1.attendi(PRONTO, CARICO);
    await entraCome(t1, A);
    if (!await t1.attendi(pulsante('Account'), REAZIONE)) {
      v.push({ gruppo: g, nome: 'corsa: A entra', ok: false, extra: 'dopo l\'accesso l\'intestazione non dice «Account» (§3.2)' });
      return;
    }
    const t = trattenuta();
    await t1.intercetta(`${ctx.api}/v1/righe*`, t.gestore);
    const prima = ctx.righeDi(A.email);
    await avviaPrima(t1);
    await rispondiQuiz(t1, [], g, '');
    const inVolo = await Promise.race([t.presa.then(() => true), pausa(REAZIONE).then(() => false)]);
    v.push({ gruppo: g, nome: 'corsa: la risposta di A parte, e resta ferma prima del server', ok: inVolo, extra: 'nessuna POST /v1/righe dalla scheda di A' });
    if (!inVolo) return;
    const t2 = await d.apri(ctx.sito + ingresso(ctx));
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
    const tab = await e.apri(ctx.sito + ingresso(ctx));
    await tab.attendi(PRONTO, CARICO);
    await entraCome(tab, A);
    await tab.attendi(pulsante('Account'), REAZIONE);
    const primaA = ctx.righeDi(A.email), primaB = ctx.righeDi(B.email);
    await tab.offline(true);
    await avviaPrima(tab);
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
    const t1 = await c.apri(ctx.sito + ingresso(ctx));
    await t1.attendi(PRONTO, CARICO);
    await entraCome(t1, K);
    await t1.attendi(pulsante('Account'), REAZIONE);
    // Una risposta mentre l'invio della precedente e' in volo (§9.1): la
    // coda si rilegge alla conferma, non e' quella di inizio invio.
    const t = trattenuta();
    await t1.intercetta(`${ctx.api}/v1/righe*`, t.gestore, { fase: 'Response' });
    await avviaPrima(t1);
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
    const t2 = await c.apri(ctx.sito + ingresso(ctx));
    await t2.attendi(pulsante('Account'), CARICO);
    await chiudiQuiz(t1, [], g, '');
    await alPercorso(t1);
    const avviate = await Promise.all([t1, t2].map(async (x) => await x.attendi(PRONTO, REAZIONE) && await avviaPrima(x)
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
    const tab = await d.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await tab.attendi(PRONTO, CARICO);
    // Con righe da inviare non si esce, e lo si dice (§10).
    let rompi = true;
    await tab.intercetta(`${ctx.api}/v1/righe*`, (r) => (r.method === 'POST' && rompi ? { fallisci: 'ConnectionReset' } : null));
    await entraCome(tab, U);
    await tab.attendi(pulsante('Account'), REAZIONE);
    await avviaPrima(tab);
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
    const t1 = await d.apri(ctx.sito + ingresso(ctx));
    await t1.attendi(PRONTO, CARICO);
    await entraCome(t1, U);
    await t1.attendi(pulsante('Account'), REAZIONE);
    const t2 = await d.apri(ctx.sito + ingresso(ctx));
    await t2.attendi(pulsante('Account'), CARICO);
    const t = trattenuta();
    await t1.intercetta(`${ctx.api}/v1/righe*`, t.gestore, { fase: 'Response' });
    await avviaPrima(t1);
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
const FILE_SENZA = 'Per conservare le risposte del file, crea un account o accedi';
const FILE_NO = 'Non riusciamo a leggere questo file di progressi.';
const DA_INVIARE_SEG = 'Punteggi da inviare';
const AZZERATI = /i progressi sono stati azzerati da un altro dispositivo/i;
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    await tab.attendi(pulsante(testi(ctx).saltaData), REAZIONE);
    await clicca(tab, testi(ctx).saltaData);
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    await apriPorta(tab, 'oggi');
    await tab.attendi(PRONTO, REAZIONE);
    await avviaPrima(tab);
    await rispondiQuiz(tab, [], g, '');
    v.push({ gruppo: g, nome: 'poi una risposta nuova entra nell\'account', ok: await finche(() => ctx.righeDi(K.email) === 1, REAZIONE) && !await tab.valuta(js(`return new RegExp(${q(AZZERATI.source)}, 'i').test(document.body.innerText);`)),
      extra: `l'account ha ${ctx.righeDi(K.email)} righe; in schermata: ${await tab.valuta(inSchermata)}` });
  } finally { await c.chiudi(); }
}

// --- C-21: l'archivio di prima resta dov'e' (ADR-005) --------------------------------------
//
// Fino al 3 ottobre 2026 qui c'era C-09, il passaggio dell'archivio di prima
// nell'account (R-ACC-05 di allora). L'ADR-005 l'ha tolto: la pagina **non
// legge e non cancella** le risposte di prima degli account, che restano nel
// browser di chi le ha. C-21 tiene ferma quella frase, in due modi che si
// coprono a vicenda: uno strumento nella scheda registra ogni apertura o
// cancellazione del database `open-patente-nautica` e ogni lettura, scrittura
// o cancellazione delle chiavi `pn.` della versione di prima; e alla fine
// l'archivio si rilegge da un'altra scheda, e deve essere quello di prima,
// byte per byte. Lo strumento non vede una lettura per enumerazione
// (`Object.keys(localStorage)`, `{ ...localStorage }`) ne' `indexedDB.databases()`:
// il secondo controllo prende una cancellazione fatta cosi', il testo visibile
// un avviso che ne nasca.

const VECCHIO_DB = 'open-patente-nautica';
// Le chiavi di prima: l'archivio di ripiego e una preferenza che il passaggio leggeva.
const VECCHIO_LS = { 'pn.archivio': null, 'pn.esame': '"2026-11-20"' };
const STRUMENTO_VECCHIO = `(() => {
  const log = (window.__archivioDiPrima = []);
  const F = IDBFactory.prototype;
  for (const m of ['open', 'deleteDatabase']) {
    const o = F[m];
    F[m] = function (n, ...a) { if (String(n) === ${q(VECCHIO_DB)}) log.push('IndexedDB.' + m + ' ' + n); return o.call(this, n, ...a); };
  }
  const S = Storage.prototype;
  for (const m of ['getItem', 'setItem', 'removeItem']) {
    const o = S[m];
    S[m] = function (k, ...a) { if (this === window.localStorage && String(k).startsWith('pn.')) log.push('localStorage.' + m + ' ' + k); return o.call(this, k, ...a); };
  }
  const c = S.clear;
  S.clear = function () { if (this === window.localStorage) log.push('localStorage.clear'); return c.call(this); };
})();`;
// Quello che una pagina direbbe di quelle risposte: nessuna di queste parole deve comparire.
const DICE_DI_PRIMA = /prima degli account|copia precedente|archivio precedente|risposte già presenti in questo browser/i;
const LETTO_DI_PRIMA = 'la pagina non apre, non legge e non cancella l\'archivio di prima: IndexedDB «open-patente-nautica» e le chiavi «pn.»';

/** L'archivio di prima, scritto da un'altra scheda prima che l'app si apra; la scheda resta, per rileggerlo. */
async function scriviVecchio(c, ctx, righe) {
  const t = await c.apri(ctx.sito + '/privacy');
  const ls = { ...VECCHIO_LS, 'pn.archivio': JSON.stringify(righe.slice(0, 2)) };
  await t.valuta(`new Promise((ok, ko) => {
    const q = indexedDB.open(${q(VECCHIO_DB)}, 1);
    q.onupgradeneeded = () => q.result.createObjectStore('righe', { keyPath: 'uid' });
    q.onerror = () => ko(q.error);
    q.onsuccess = () => { const tx = q.result.transaction('righe', 'readwrite'); for (const r of ${JSON.stringify(righe)}) tx.objectStore('righe').put(r);
      tx.oncomplete = () => { q.result.close(); for (const [k, v] of Object.entries(${JSON.stringify(ls)})) localStorage.setItem(k, v); ok(true); }; };
  })`);
  return t;
}

/** L'archivio di prima com'e' adesso, letto dalla scheda che l'ha scritto: un testo da confrontare, o null se non c'e'. */
const ARCHIVIO_DI_PRIMA = `(async () => {
  const nomi = (await indexedDB.databases()).map((d) => d.name);
  let righe = null;
  if (nomi.includes(${q(VECCHIO_DB)})) righe = await new Promise((ok, ko) => {
    const q = indexedDB.open(${q(VECCHIO_DB)}); q.onerror = () => ko(q.error);
    q.onsuccess = () => { const db = q.result;
      if (!db.objectStoreNames.contains('righe')) { db.close(); return ok('senza righe'); }
      const g = db.transaction('righe').objectStore('righe').getAll(); g.onsuccess = () => { db.close(); ok(g.result); }; g.onerror = () => { db.close(); ko(g.error); }; };
  });
  const ls = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('pn.')) ls[k] = localStorage.getItem(k); }
  return JSON.stringify({ righe, ls });
})()`;

const registroDiPrima = (tab) => tab.valuta('window.__archivioDiPrima ? JSON.stringify(window.__archivioDiPrima) : null');

/** La verifica dello strumento: nessuna apertura, lettura o cancellazione registrata in questa scheda. */
async function nienteLetto(tab, v, g, quando) {
  const r = await registroDiPrima(tab);
  const voci = r === null ? null : JSON.parse(r);
  v.push({ gruppo: g, nome: LETTO_DI_PRIMA, ok: Array.isArray(voci) && !voci.length,
    extra: voci === null ? 'lo strumento del banco non c\'e\' nella scheda' : `${quando}: ${voci.join(', ')}` });
}

async function nienteDetto(tab, v, g, dove) {
  const m = await tab.valuta(testoRe(DICE_DI_PRIMA));
  v.push({ gruppo: g, nome: `e non dice niente delle risposte di prima (${dove})`, ok: !m,
    extra: `in schermata «${m?.[0]}»: ${await tab.valuta(inSchermata)}` });
}

async function c21(b, ctx, v, parte) {
  const g = 'C-21';
  const vuole = (x) => !parte || parte === x;
  if (vuole('senza')) await fermaAlPrimo(v, (w) => c21senza(b, ctx, w, g));
  if (vuole('conto')) await fermaAlPrimo(v, (w) => c21conto(b, ctx, w, g));
}

async function c21senza(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const priv = await scriviVecchio(c, ctx, righeDi(`p${++serie}`, 4));
    const prima = await priv.valuta(ARCHIVIO_DI_PRIMA);
    const tab = await c.apri(ctx.sito + ingresso(ctx), { prima: STRUMENTO_VECCHIO });
    const pronto = await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'senza account, con un archivio di prima nel browser, l\'app si apre', ok: pronto && JSON.parse(prima).righe?.length === 4,
      extra: pronto ? `l'archivio di prima non e' stato scritto: ${prima}` : `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` });
    // Un'attivita' fino al riepilogo, Info, e una ricarica: i posti dove il passaggio leggeva.
    const testo = await unaRisposta(tab, v, g, 'senza account: ');
    if (!testo) return;
    await nienteLetto(tab, v, g, 'all\'avvio e in un\'attivita\'');
    await clic(tab, '[data-ciclo="ritorno"]');
    await apriPorta(tab, 'oggi');
    await tab.attendi(PRONTO, REAZIONE);
    await nienteDetto(tab, v, g, 'Percorso');
    await apriPorta(tab, 'info');
    await nienteDetto(tab, v, g, 'Info');
    await tab.ricarica();
    await tab.attendi(PRONTO, CARICO);
    await nienteLetto(tab, v, g, 'dopo la ricarica');
    let dopo = null;
    const intatto = await finche(async () => (dopo = await priv.valuta(ARCHIVIO_DI_PRIMA)) === prima, REAZIONE)
      && await maiPer(async () => (dopo = await priv.valuta(ARCHIVIO_DI_PRIMA)) !== prima);
    v.push({ gruppo: g, nome: 'l\'archivio di prima resta com\'era, byte per byte: IndexedDB e localStorage', ok: intatto,
      extra: `prima ${prima.slice(0, 160)} — dopo ${String(dopo).slice(0, 160)}` });
  } finally { await c.chiudi(); }
}

async function c21conto(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c21');
  const c = await b.nuovoContesto();
  try {
    const priv = await scriviVecchio(c, ctx, righeDi(`k${++serie}`, 4));
    const prima = await priv.valuta(ARCHIVIO_DI_PRIMA);
    const tab = await c.apri(ctx.sito + ingresso(ctx), { prima: STRUMENTO_VECCHIO });
    const entrato = await dentro(tab, K);
    v.push({ gruppo: g, nome: 'con un archivio di prima nel browser si entra nell\'account', ok: entrato, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
    if (!entrato) return;
    await nienteLetto(tab, v, g, 'all\'avvio e all\'accesso');
    await nienteDetto(tab, v, g, 'dopo l\'accesso');
    v.push({ gruppo: g, nome: 'niente dell\'archivio di prima arriva nell\'account', ok: await maiPer(() => ctx.righeDi(K.email) > 0),
      extra: `l'account ha ${ctx.righeDi(K.email)} righe, e nessuna risposta e' stata data` });
    await esciDa(tab);
    const fuori = await tab.attendi(nellaPagina('Accedi'), REAZIONE);
    v.push({ gruppo: g, nome: '«Esci» chiude l\'accesso', ok: fuori, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
    if (!fuori) return;
    await nienteLetto(tab, v, g, 'all\'uscita');
    let dopo = null;
    const intatto = await maiPer(async () => (dopo = await priv.valuta(ARCHIVIO_DI_PRIMA)) !== prima);
    v.push({ gruppo: g, nome: 'uscendo, l\'archivio di prima resta com\'era: la pulizia tocca solo la copia dell\'account', ok: intatto,
      extra: `prima ${prima.slice(0, 160)} — dopo ${String(dopo).slice(0, 160)}` });
  } finally { await c.chiudi(); }
}

// --- C-22: l'offline se ne va (ADR-005) -----------------------------------------------
//
// L'ADR-005 ha tolto l'offline. C-22 tiene ferme le due meta' della decisione
// che si vedono solo nel browser. `C-22:pagina`: la pagina non registra un
// service worker e non apre una cache. `C-22:passaggio`: un browser con la
// 0.29.0 installata — servita in locale dal tag, sulla stessa origine —
// prende la versione nuova; il sw.js nuovo cancella le cache e si
// disinstalla senza ricaricare le pagine aperte, e alla visita dopo non c'e'
// nessun service worker e nessuna cache «rg-». I test del motore eseguono il
// sw.js in una Cache Storage finta; qui lo esegue Chrome.

const NESSUN_SW = 'la pagina non registra un service worker e non apre una cache';
// Che cosa c'e' nel browser: i service worker registrati e le cache, letti dalla pagina.
const SW_E_CACHE = `(async () => {
  const r = navigator.serviceWorker ? await navigator.serviceWorker.getRegistrations() : [];
  const k = self.caches ? await caches.keys() : [];
  return JSON.stringify({ sw: r.map((x) => (x.active || x.waiting || x.installing)?.scriptURL || x.scope), cache: k });
})()`;
const vuoto = (x) => { const o = JSON.parse(x); return !o.sw.length && !o.cache.length; };
// Lo strumento nella scheda: ogni register() e ogni caches.open(). Lo stato da
// solo non basta, misurato il 3 ottobre 2026: la pagina vera registra /sw.js,
// il sw.js nuovo si disinstalla in pochi millisecondi, e due giri su tre il
// banco guardava dopo, e trovava tutto pulito. La chiamata invece resta.
const STRUMENTO_OFFLINE = `(() => {
  const log = (window.__offline = []);
  if (self.ServiceWorkerContainer) {
    const r = ServiceWorkerContainer.prototype.register;
    ServiceWorkerContainer.prototype.register = function (u, ...a) { log.push('register ' + u); return r.call(this, u, ...a); };
  }
  if (self.CacheStorage) {
    const o = CacheStorage.prototype.open;
    CacheStorage.prototype.open = function (n, ...a) { log.push('caches.open ' + n); return o.call(this, n, ...a); };
  }
})();`;
const STATO_OFFLINE = `(async () => {
  const s = JSON.parse(await ${SW_E_CACHE});
  return JSON.stringify({ ...s, chiamate: window.__offline || ["lo strumento del banco manca"] });
})()`;
const nienteFatto = (x) => { const o = JSON.parse(x); return !o.sw.length && !o.cache.length && !o.chiamate.length; };

let SITO_029 = null;
/** Il sito della 0.29.0, dal tag, in una cartella temporanea: una volta sola per esecuzione. */
function sito029() {
  if (SITO_029) return SITO_029;
  const d = mkdtempSync(join(tmpdir(), 'rg-0.29.0-'));
  const tar = execFileSync('git', ['-C', RADICE, 'archive', '--format=tar', 'v0.29.0', 'site'], { maxBuffer: 64 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  SITO_029 = join(d, 'site');
  return SITO_029;
}

async function c22(b, ctx, v, parte) {
  const g = 'C-22';
  const vuole = (x) => !parte || parte === x;
  if (vuole('pagina')) await fermaAlPrimo(v, (w) => c22pagina(b, ctx, w, g));
  if (vuole('passaggio')) await fermaAlPrimo(v, (w) => c22passaggio(b, ctx, w, g));
}

/** Per tutta la finestra, nessuna chiamata, nessun service worker e nessuna cache. */
async function nienteDiOffline(tab, v, g, quando) {
  let visto = null;
  const ok = await maiPer(async () => !nienteFatto(visto = await tab.valuta(STATO_OFFLINE)));
  v.push({ gruppo: g, nome: NESSUN_SW, ok, extra: `${quando}: ${visto}` });
}

async function c22pagina(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx), { prima: STRUMENTO_OFFLINE });
    const pronto = await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'senza account l\'app si apre, dalla rete', ok: pronto, extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` });
    if (!pronto) return;
    await nienteDiOffline(tab, v, g, 'alla prima visita');
  } finally { await c.chiudi(); }
}

async function c22passaggio(b, ctx, v, g) {
  let dir;
  try { dir = sito029(); } catch (e) {
    v.push({ gruppo: g, nome: 'il sito della 0.29.0 si prende dal tag', ok: false, extra: `git archive v0.29.0: ${e.message}` });
    return;
  }
  const c = await b.nuovoContesto();
  try {
    ctx.radice(dir);
    // La 0.29.0, come la trova chi l'ha visitata: installata, e ricaricata, cosi'
    // che la pagina sia servita dal service worker e dalla sua cache. Era
    // l'app su /app: oggi /app e' la porta.
    const t1 = await c.apri(ctx.sito + '/app');
    const installata = await t1.attendi(PRONTO, CARICO) && await guscioPronto(t1);
    v.push({ gruppo: g, nome: 'la 0.29.0 si installa: service worker attivo e guscio in cache', ok: installata, extra: await t1.valuta(SW_E_CACHE) });
    if (!installata) return;
    await t1.ricarica();
    const servita = await t1.attendi(PRONTO, CARICO) && await t1.attendi('!!navigator.serviceWorker.controller', REAZIONE);
    v.push({ gruppo: g, nome: 'e la ricarica e\' servita dal suo service worker', ok: servita, extra: 'la pagina ricaricata non ha un controller' });
    if (!servita) return;
    await t1.valuta('window.__primaDelPassaggio = 1; true');
    // La versione nuova al posto della 0.29.0; la visita dopo, in un'altra
    // scheda, e' quella che fa controllare al browser se sw.js e' cambiato.
    ctx.radice(null);
    const t2 = await c.apri(ctx.sito + ingresso(ctx));
    await t2.attendi(PRONTO, CARICO);
    let visto = null, caduta = null;
    // Una pagina che si ricarica mentre il banco la legge fa cadere la lettura
    // («Inspected target navigated or closed»): e' una ricarica, e si dice come
    // tale, con la guardia della lettura che segue (P-87). Senza, una rottura che
    // ricarica le pagine aperte era rossa a volte per il suo motivo e a volte
    // per l'eccezione, secondo quando la ricarica cadeva.
    const via = await finche(async () => {
      try { return vuoto(visto = await t1.valuta(SW_E_CACHE)); } catch (e) { caduta = e.message; return true; }
    }, CARICO);
    if (caduta) {
      v.push({ gruppo: g, nome: 'e non ricarica le pagine aperte: senza account una ricarica perde le risposte', ok: false,
        extra: `la scheda aperta con la 0.29.0 si e' ricaricata mentre il banco la leggeva: ${caduta}` });
      return;
    }
    v.push({ gruppo: g, nome: 'il sw.js nuovo cancella le cache del sito e si disinstalla', ok: via, extra: `dopo ${CARICO / 1000} s: ${visto}` });
    if (!via) return;
    // Anche qui una lettura che cade e' una ricarica.
    const resta = await maiPer(async () => {
      try { return (await t1.valuta('window.__primaDelPassaggio === 1 ? location.pathname : null')) !== '/app'; } catch { return true; }
    });
    v.push({ gruppo: g, nome: 'e non ricarica le pagine aperte: senza account una ricarica perde le risposte', ok: resta,
      extra: 'la scheda aperta con la 0.29.0 e\' stata ricaricata, o portata altrove' });
    // La visita dopo: dalla rete, senza nessuno in mezzo.
    const t3 = await c.apri(ctx.sito + ingresso(ctx), { prima: STRUMENTO_OFFLINE });
    const pronta = await t3.attendi(PRONTO, CARICO);
    const libera = pronta && await t3.valuta('!navigator.serviceWorker || !navigator.serviceWorker.controller');
    v.push({ gruppo: g, nome: 'la visita dopo arriva dalla rete, senza un service worker in mezzo', ok: libera,
      extra: pronta ? 'la pagina e\' servita da un service worker' : 'l\'app non si apre' });
    if (!libera) return;
    await nienteDiOffline(t3, v, g, 'alla visita dopo il passaggio');
  } finally { ctx.radice(null); await c.chiudi(); }
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
  // La riga d'avvio nei due versi, su qualunque pagina (P-88): prima con la
  // raccolta spenta sul server, poi accesa. Fino a P-88 il verso lo decideva la
  // pagina — spenta per quella vera, accesa per le pagine di riferimento.
  if (vuole('avvio')) {
    for (const acceso of [false, true]) {
      // Due ore fra i due versi, come fra due gruppi: le cinque registrazioni l'ora per indirizzo (§6.5).
      if (acceso) ctx.avanza(2 * 3600 * 1000);
      if (perParte(ctx, v, `${g}:avvio`, { esiti_e_previsioni: acceso })) await fermaAlPrimo(v, (w) => c10avvio(b, ctx, w, `${g}:avvio`));
    }
  }
}

/**
 * C-10:avvio (P-86, R-ACC-86): un file dei progressi con una riga d'avvio,
 * importato nell'account dalla pagina. La riga d'avvio e' una raccolta nuova
 * (P-72), spenta sul server finche' la sua informativa non c'e'
 * (account-progetto §2.7-bis): a raccolta spenta la riga e' scartata, la
 * pagina lo dice con il suo motivo, le altre righe arrivano e il server non la
 * ha; a raccolta accesa la stessa riga arriva. Il banco legge dal server della
 * corsia quale dei due casi ha davanti, e fa lo stesso numero di verifiche; dal
 * P-88 li prova tutti e due su ogni pagina.
 */
async function c10avvio(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c10a');
  const quiz = righeDi(`va${serie}`, 2);
  const avvio = E.rigaAvvio({ simUid: `va${serie}-sim`, kind: 'base', prova: 'base', ts: quiz[0].ts, motore: '0.31.0', righe: [] });
  const percorso = ctx.file(`avvio-${serie}.json`, JSON.stringify({ app: 'rotta-giusta', righe: [...quiz, avvio] }));
  const accesa = ctx.raccolte().esiti_e_previsioni;
  const motivo = `${MOTIVO_AVVIO_SPENTO}: 1`;
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'avvio: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await apriPorta(tab, 'info');
    await tab.caricaFile('#importa-file', percorso);
    if (!await tab.attendi(pulsante('Importa nel mio account'), REAZIONE)) {
      v.push({ gruppo: g, nome: 'avvio: l\'anteprima offre l\'importazione', ok: false, extra: 'nessun «Importa nel mio account»' }); return;
    }
    await clicca(tab, 'Importa nel mio account');
    const sulServer = () => ctx.righeServer(K.email);
    const tipi = () => sulServer().map((r) => r._t).sort().join('');
    if (!accesa) {
      const arrivate = await finche(() => sulServer().length === 2, REAZIONE) && await maiPer(() => sulServer().length !== 2);
      v.push({ gruppo: g, nome: 'raccolta spenta: le risposte del file arrivano, la riga d\'avvio no', ok: arrivate && tipi() === 'qq',
        extra: `sul server ${sulServer().length} righe, tipi «${tipi()}»: attese le due risposte e nessuna riga d'avvio` });
      const detto = await tab.attendi(testoVisibile(motivo), REAZIONE);
      v.push({ gruppo: g, nome: 'raccolta spenta: la pagina dice la riga scartata con il suo motivo', ok: detto,
        extra: `${detto ? '' : `«${motivo}» non si vede. `}Nella finestra: ${JSON.stringify(await tab.valuta(js("const f = document.querySelector('[aria-modal=\"true\"]'); return f ? f.innerText : null;")))}` });
      const n = c.scaricati().length;
      await clicca(tab, 'Scarica le righe non importate');
      const scarti = await scaricato(c, n);
      v.push({ gruppo: g, nome: 'raccolta spenta: la riga d\'avvio sta fra le righe non importate da scaricare', ok: !!scarti && stessi(uidDi(scarti.dati), new Set([avvio.uid])),
        extra: scarti ? `nel file ${[...uidDi(scarti.dati)].join(', ') || 'niente'}` : 'nessun file' });
    } else {
      const arrivate = await finche(() => sulServer().length === 3, REAZIONE);
      v.push({ gruppo: g, nome: 'raccolta accesa: le risposte e la riga d\'avvio arrivano', ok: arrivate && tipi() === 'aqq',
        extra: `sul server ${sulServer().length} righe, tipi «${tipi()}»` });
      const lei = sulServer().find((r) => r._t === 'a');
      v.push({ gruppo: g, nome: 'raccolta accesa: la riga d\'avvio sul server e\' quella del file', ok: !!lei && JSON.stringify(lei) === JSON.stringify(avvio),
        extra: lei ? JSON.stringify(lei).slice(0, 120) : 'non c\'e\'' });
      v.push({ gruppo: g, nome: 'raccolta accesa: nessuno scarto per la riga d\'avvio', ok: await maiPer(() => tab.valuta(testoVisibile(MOTIVO_AVVIO_SPENTO))),
        extra: `«${MOTIVO_AVVIO_SPENTO}» si vede` });
    }
  } finally { await c.chiudi(); }
}

async function c10senza(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await tab.attendi(PRONTO, CARICO);
    await apriPorta(tab, 'info');
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'file: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await apriPorta(tab, 'info');
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'lotti: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await apriPorta(tab, 'info');
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'ricezione: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    const copia = () => nellaCopia(c, ctx, tab, K.chiave);
    const tutte = await finche(async () => await copia() === 5200, 4 * REAZIONE);
    const pagine = richiesteA(tab, 'GET', '/v1/righe').length;
    v.push({ gruppo: g, nome: 'oltre 5.000 righe si ricevono tutte, in piu\' pagine', ok: tutte && pagine >= 2, extra: `nella copia ${await copia()} righe su 5200, in ${pagine} ricezioni` });
    // Un altro dispositivo aggiunge tre righe; poi qui una risposta. La conferma
    // dell'invio dice un'`ultima_seq` che le comprende: non e' un cursore (R-ACC-31).
    ctx.aggiungi(K.email, righeDi(`r${serie}x`, 3));
    await avviaPrima(tab);
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    // La ricezione non passa: l'azzeramento si scopre solo inviando. Senza,
    // sotto carico la ricezione dopo il primo invio lo scopriva prima (misurato):
    // e' il caso della parte «ricezione», non di questa.
    await tab.intercetta(`${ctx.api}/v1/righe?*`, (r) => (r.method === 'GET' ? { fallisci: 'ConnectionReset' } : null));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'invio: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await avviaPrima(tab);
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'ricezione: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await avviaPrima(tab);
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
    await avviaPrima(tab);
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    // Come in «invio»: l'azzeramento si scopre inviando, non ricevendo.
    await tab.intercetta(`${ctx.api}/v1/righe?*`, (r) => (r.method === 'GET' ? { fallisci: 'ConnectionReset' } : null));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await avviaPrima(tab);
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await avviaPrima(tab);
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
      const t2 = await d.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    await avviaPrima(tab);
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
    const t1 = await c.apri(ctx.sito + ingresso(ctx)), t2 = await d.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
  // Il passo della data e' l'onboarding di «che cosa stai preparando?», e
  // «Scelte salvate» lo dice solo un server che le raccoglie: la parte le
  // accende, come N-01:registrazione (P-88). Fino a P-89 c'era anche la pagina
  // di prima, dove il passo era la sola data e il server restava com'e'.
  if (!perParte(ctx, v, g, SCELTE_ACCESE)) return;
  const vuole = (x) => !parte || parte === x;
  if (vuole('proposta')) await fermaAlPrimo(v, (w) => c16proposta(b, ctx, w, g));
  if (vuole('salto')) await fermaAlPrimo(v, (w) => c16salto(b, ctx, w, g));
  if (vuole('fallito')) await fermaAlPrimo(v, (w) => c16fallito(b, ctx, w, g));
  if (vuole('accesso')) await fermaAlPrimo(v, (w) => c16accesso(b, ctx, w, g));
}

/** Una prova, la registrazione, e il passo della data (§11.1). */
async function finoAllaData(b, c, ctx, v, g, prefisso, { data } = {}) {
  const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    await clicca(x.tab, testi(ctx).salvaData);
    v.push({ gruppo: g, nome: 'al clic si salva com\'e\', anche passata, e la pagina lo dice', ok: await finche(() => ctx.conto(x.email).data_esame === '2026-01-10', REAZIONE) && await x.tab.attendi(testoVisibile(testi(ctx).dataSalvata), REAZIONE),
      extra: `sul server ${ctx.conto(x.email).data_esame}; «${testi(ctx).dataSalvata}» ${await x.tab.valuta(testoVisibile(testi(ctx).dataSalvata)) ? '' : 'non '}si vede` });
  } finally { await c.chiudi(); }
}

async function c16salto(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const x = await finoAllaData(b, c, ctx, v, g, 'senza data: ');
    if (!x) return;
    v.push({ gruppo: g, nome: 'senza una data nella pagina il campo e\' vuoto: nessuna data inventata', ok: await x.tab.valuta(valoreData) === '', extra: `nel campo «${await x.tab.valuta(valoreData)}»` });
    await clicca(x.tab, testi(ctx).saltaData);
    const chiuso = await x.tab.attendi(js(`return !document.body.innerText.includes(${q(ONBOARDING)});`), REAZIONE);
    v.push({ gruppo: g, nome: `«${testi(ctx).saltaData}» chiude il passo e il server resta senza data`, ok: chiuso && await maiPer(() => ctx.conto(x.email).data_esame !== null),
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
    await clicca(x.tab, testi(ctx).salvaData);
    const detto = await x.tab.attendi(testoVisibile(testi(ctx).dataNo), REAZIONE);
    v.push({ gruppo: g, nome: 'un salvataggio della data fallito lo dice, e non dice «Data salvata»', ok: detto && !await x.tab.valuta(testoVisibile(testi(ctx).dataSalvata)) && ctx.conto(x.email).data_esame === null,
      extra: detto ? `«${testi(ctx).dataSalvata}» si vede, o il server ha ${ctx.conto(x.email).data_esame}` : `«${testi(ctx).dataNo}» non si vede` });
  } finally { await c.chiudi(); }
}

async function c16accesso(b, ctx, v, g) {
  const K = await nuovoAccount(ctx, 'c16a');
  ctx.dataEsame(K.email, '2027-03-03');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'accesso: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    v.push({ gruppo: g, nome: 'entrando in un account che ha la data, il passo non si ripete e la data resta', ok: await maiPer(async () => await tab.valuta(testoVisibile(ONBOARDING)) || ctx.conto(K.email).data_esame !== '2027-03-03'),
      extra: `sul server ${ctx.conto(K.email).data_esame}; la domanda ${await tab.valuta(testoVisibile(ONBOARDING)) ? 'compare' : 'non compare'}` });
    v.push({ gruppo: g, nome: 'e la pagina mostra quella del server', ok: await tab.valuta(js(`return document.querySelector('#esame-data').value;`)) === '2027-03-03',
      extra: `#esame-data dice «${await tab.valuta(js(`return document.querySelector('#esame-data').value;`))}»` });
  } finally { await c.chiudi(); }
}

// --- C-17: l'export, e le origini senza API --------------------------------------------------

const ALTROVE = 'https://rottagiusta.it/app';
const ALTROVE_RIDISEGNO = 'https://rottagiusta.it/';

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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    let blocca = false;
    await tab.intercetta(`${ctx.api}/v1/righe*`, () => (blocca ? { fallisci: 'ConnectionReset' } : null));
    if (!await dentro(tab, K)) { v.push({ gruppo: g, nome: 'export: si entra', ok: false, extra: 'l\'intestazione non dice «Account»' }); return; }
    await avviaPrima(tab);
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
    await apriPorta(tab, 'info');
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
    const tab = await c.apri(sito + ingresso(ctx));
    await tab.attendi(PRONTO, CARICO);
    const link = js(`return [...document.querySelectorAll('a')].some((a) => V(a) && (a.href === ${q(ALTROVE)} || a.href === ${q(ALTROVE_RIDISEGNO)}));`);
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

// La frase della carta senza account e' quella del §4 del ridisegno: «prima,
// durante e dopo». Fino a P-89 c'era anche quella della pagina di prima, «Il
// testo che scrivi resta solo finché questa pagina è aperta.»
const MEMORIA = 'Il lavoro e i giudizi di questa attività restano solo nella pagina aperta.';
const memoria = () => MEMORIA;
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
  if (!await portaCarteggio(tab, 'prova')) return null;
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await tab.attendi(PRONTO, CARICO);
    const primo = await apriProvaC(tab);
    v.push({ gruppo: g, nome: 'senza account la prova si apre', ok: !!primo, extra: 'nessun esercizio della banca in #c-testo dopo #c-start' });
    const testo = 'Lat 42°50,1N senza account';
    await scriviC(tab, testo);
    v.push({ gruppo: g, nome: 'senza account la pagina dice che il testo resta solo finché è aperta', ok: await tab.attendi(testoVisibile(memoria(ctx)), REAZIONE),
      extra: `«${memoria(ctx)}» non si vede con il testo scritto (P-36)` });
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
      extra: !pronta ? 'l\'app non torna pronta dopo la ricarica' : `dopo la ricarica si vede «${OFFERTA}» o il testo scritto` });
  } finally { await c.chiudi(); }
}

/** Il difetto di oggi: con l'account una ricarica durante la prova perde il testo. */
async function c19ricarica(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c19r');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    await dieci.vai(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    const p = await provaConTesto(tab, v, g, U, 'scadenza');
    if (!p) return;
    v.push({ gruppo: g, nome: 'scadenza: il testo si dice salvato', ok: await tab.attendi(testoVisibile(SALVATO), REAZIONE), extra: `«${SALVATO}» non compare` });
    // Un'altra scheda con l'orologio sessantuno minuti avanti: la stessa copia, piu' tardi.
    const tardi = await c.apri(null, { prima: avanti(61 * 60000) });
    await tardi.vai(ctx.sito + ingresso(ctx));
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
    await tab.vai(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const t1 = await c.apri(ctx.sito + ingresso(ctx));
    const p = await provaConTesto(t1, v, g, A, 'schede');
    if (!p) return;
    await t1.attendi(testoVisibile(SALVATO), REAZIONE);
    const t2 = await c.apri(ctx.sito + ingresso(ctx));
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
    if (!e) return false; e.click(); return true;`)) || await apriPorta(tab, v);
  return ok && tab.attendi(js(`return [...document.querySelectorAll(${q(vistaDi(v))})].some(V);`), REAZIONE);
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
  if (!await apriVista(tab, 'oggi') || !await avviaPrima(tab)) return 'l\'attivita\' del Percorso non parte';
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
// Il segnale sta sull'avatar, che si vede da ogni superficie (§2: «Il segnale
// ambra resta finche' il guasto e' risolto»). Il controllo guarda anche una
// porta [data-v="info"], dove stava sulla pagina di prima.
const segnaleInInfo = js(`return [...document.querySelectorAll('[data-v="info"], [data-avatar]')].filter(V).some((b) => b.innerText.includes(${q(SEGNALE_INFO)}));`);
// Il guasto si dice con il testo del §4 del ridisegno; fino a P-89 c'era anche
// quello della pagina di prima, «Le ultime risposte potrebbero non essere salvate.»
const AVVISO_GUASTO = 'Non siamo riusciti a salvare le ultime risposte su questo dispositivo.';
const avvisoGuasto = () => AVVISO_GUASTO;

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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      const pronto = await tab.attendi(PRONTO, CARICO);
      const niente = async (dove) => {
        const f = await tab.valuta(fraseVista(FRASI_SALVATO));
        w.push({ gruppo: g, nome: `senza account ${dove} non dice che le risposte sono conservate`, ok: !f, extra: `si legge «${f}»` });
      };
      w.push({ gruppo: g, nome: 'l\'app si apre senza account', ok: pronto, extra: 'nessun [data-rotta-start] abilitato' });
      await niente('il Percorso');
      await avviaPrima(tab);
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await tab.intercetta(ctx.api + '/*', async () => { if (!tieni) return null; await via; return { fallisci: 'InternetDisconnected' }; });
    let avanti = false;
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      await avviaPrima(tab);
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
    await tab.vai(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      w.push({ gruppo: g, nome: 'prima del guasto Info non segnala niente', ok: !await tab.valuta(segnaleInInfo), extra: `la porta di Info dice gia' «${SEGNALE_INFO}»` });
      await tab.valuta('window.__guasto = true');
      await avviaPrima(tab);
      w.push({ gruppo: g, nome: 'con la scrittura che fallisce, una risposta', ok: !!await rispondiQuiz(tab, [], g, ''), extra: 'il runner non mostra un quesito della banca' });
      // «Non siamo riusciti a salvare …» (§4); la forma di prima, «… non essere salvate», resta ammessa.
      const a = await annunciato(tab, /non (sono |è |essere )?(ancora )?salvat|non siamo riusciti a salvare/i);
      w.push({ gruppo: g, nome: 'la scrittura fallita si annuncia in una regione viva esposta', ...a });
      const r = await avvisoVisibile(tab, avvisoGuasto(ctx));
      w.push({ gruppo: g, nome: 'con il runner aperto, l\'avviso del guasto si vede davvero', ...r });
      w.push({ gruppo: g, nome: 'la porta di Info segnala il guasto', ok: await tab.attendi(segnaleInInfo, REAZIONE), extra: `nessuna porta di Info visibile dice «${SEGNALE_INFO}»` });
      w.push({ gruppo: g, nome: 'il riepilogo si apre', ok: await chiudiQuiz(tab, [], g, ''), extra: 'nessun riepilogo' });
      const rr = await avvisoVisibile(tab, avvisoGuasto(ctx));
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
      const p = await avvisoVisibile(tab, avvisoGuasto(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await tab.dimensioni(375, 800);
    await fermaAlPrimo(v, async (w) => {
      await tab.attendi(PRONTO, CARICO);
      // L'avviso di prima sta nella preparazione, accanto a «Inizia» (giro 1 delle
      // regole di disegno): fino al 24 ottobre 2026 si misurava quello della Home.
      const prep = await preparazioneDa(tab, '[data-rotta-start]');
      w.push({ gruppo: g, nome: 'la preparazione dell\'allenamento breve si apre', ok: prep, extra: 'dalla Home [data-rotta-start] non apre la preparazione' });
      w.push({ gruppo: g, nome: 'senza account, nella preparazione l\'avviso di prima si vede davvero', ...await avvisoVisibile(tab, PRIMA) });
      await preparazioneInizia(tab);
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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
    const tab = await c.apri(ctx.sito + ingresso(ctx));
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

// --- T-10: il pulsante per proseguire si raggiunge sempre (D-29, R-RIF-17) -----------
//
// docs/idee-dopo-gli-account.md, I-27, regola D-29: in ogni stato del runner il
// pulsante per andare avanti si vede, o ci si arriva scorrendo, e niente di
// fisso gli sta sopra. Nato dal difetto che le due letture da fuori hanno
// trovato (I-23, I-24) e che nessun controllo vedeva: dopo una risposta
// sbagliata, a 375×667, «Avanti» stava a 757–809 px dentro un runner fisso alto
// 667, e niente scorreva. I banchi premono con element.click(), che arriva a
// un pulsante anche fuori dallo schermo: per questo il difetto passava.
//
// La misura, nella pagina: il pulsante e' nel primo schermo con il suo centro
// sotto il dito (elementFromPoint), oppure scrollIntoView lo porta li' muovendo
// soltanto contenitori che scorrono davvero — overflow auto o scroll, o il
// documento —: un overflow:hidden si scorre da programma, non con il dito. Poi
// lo scorrimento torna com'era. I casi: i due quesiti piu' lunghi della banca,
// base-1293 e base-829 (il piu' lungo con figura), aperti per numero, con una
// risposta giusta e una sbagliata, a 375×812 e a 375×667, l'avanzamento
// automatico spento, perche' con lui una risposta giusta se ne va da sola dopo
// un secondo. Non vede: il gesto vero sul telefono, Safari, la simulazione e il
// confronto del Carteggio, e se la domanda resta leggibile accanto al pulsante.

function proseguire(K, sel) {
  const e = [...document.querySelectorAll(sel)].find(K.V);
  if (!e) return { stato: 'assente' };
  const W = innerWidth, H = innerHeight;
  const sotto = (r) => {
    const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
    if (y < 0 || y >= H || x < 0 || x >= W) return 'fuori';
    const h = document.elementFromPoint(x, y);
    return h && (h === e || e.contains(h)) ? null : K.nome(h || document.body);
  };
  const r = e.getBoundingClientRect();
  const dove = { testo: e.textContent.trim().slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom), H };
  if (r.top >= 0 && r.bottom <= H && !sotto(r)) return { stato: 'primo', ...dove };
  const radice = document.scrollingElement;
  const prima = [];
  for (let p = e.parentElement; p; p = p.parentElement) prima.push([p, p.scrollTop]);
  if (!prima.some(([p]) => p === radice)) prima.push([radice, radice.scrollTop]);
  e.scrollIntoView({ block: 'center' });
  const scorre = (p) => {
    if (p === radice || p === document.body || p === document.documentElement) {
      return getComputedStyle(document.documentElement).overflowY !== 'hidden' && getComputedStyle(document.body).overflowY !== 'hidden';
    }
    return ['auto', 'scroll'].includes(getComputedStyle(p).overflowY);
  };
  const solo = prima.filter(([p, t]) => p.scrollTop !== t && !scorre(p)).map(([p]) => K.nome(p));
  const r2 = e.getBoundingClientRect(), s2 = sotto(r2);
  for (const [p, t] of prima) p.scrollTop = t;
  return { stato: !solo.length && !s2 ? 'scorrendo' : 'no', ...dove, dopo: { top: Math.round(r2.top), bottom: Math.round(r2.bottom) }, sopra: s2, solo };
}

const CASI_T10 = ['base-1293', 'base-829'];
const MISURE_T10 = [[375, 812], [375, 667]];
export const PROSEGUIRE = (W, H, giusta) => `a ${W}×${H}, dopo una risposta ${giusta ? 'giusta' : 'sbagliata'}, il pulsante per proseguire si vede o si raggiunge scorrendo, e niente gli sta sopra`;

async function t10(b, ctx, v) {
  const g = 'T-10';
  const c = await b.nuovoContesto();
  const intoppi = [], per = new Map();
  try {
    for (const [W, H] of MISURE_T10) {
      for (const giusta of [true, false]) {
        const difetti = [];
        let misurati = 0;
        for (const id of CASI_T10) {
          const it = QUIZ_TUTTI.find((x) => x.id === id);
          const tab = await c.apri(ctx.sito + ingresso(ctx));
          await tab.dimensioni(W, H);
          const caso = `${id} a ${W}×${H}, ${giusta ? 'giusta' : 'sbagliata'}`;
          if (!await tab.attendi(PRONTO, CARICO)) { intoppi.push(`${caso}: la pagina non si apre`); continue; }
          if (!await apriPerNumero(tab, it)) { intoppi.push(`${caso}: il quesito non si apre per numero`); continue; }
          await tab.valuta(js(`const a = document.querySelector('#r-auto'); if (a && V(a) && a.classList.contains('on')) a.click(); return true;`));
          if (!await rispondiCome(tab, it, giusta)) { intoppi.push(`${caso}: la risposta non ha il suo riscontro`); continue; }
          if (!await tab.attendi(visibile('#r-next'), REAZIONE)) { intoppi.push(`${caso}: dopo la risposta non c'e' un pulsante per proseguire (#r-next)`); continue; }
          const m = await tab.valuta(inPagina(proseguire, '#r-next'));
          misurati++;
          if (m.stato === 'primo' || m.stato === 'scorrendo') continue;
          difetti.push(m.stato === 'assente' ? `${id}: il pulsante non si vede`
            : m.sopra === 'fuori' ? `${id}: «${m.testo}» sta a ${m.top}–${m.bottom} px su ${m.H}, e niente lo porta in vista${m.solo.length ? ` (si scorre solo da programma: ${m.solo.join(', ')})` : ''}`
            : m.solo.length ? `${id}: «${m.testo}» si raggiunge solo scorrendo da programma ${m.solo.join(', ')}, che non scorre con il dito`
            : `${id}: «${m.testo}» ha sopra ${m.sopra}`);
        }
        per.set(PROSEGUIRE(W, H, giusta), { difetti, misurati });
      }
    }
    v.push({ gruppo: g, nome: 'i due quesiti piu\' lunghi si aprono per numero, ricevono la risposta e mostrano il pulsante per proseguire', ok: !intoppi.length, extra: perDifetto(intoppi) });
    for (const [nome, { difetti, misurati }] of per) {
      v.push({ gruppo: g, nome, ok: misurati === CASI_T10.length && !difetti.length,
        extra: misurati < CASI_T10.length ? `misurati ${misurati} casi su ${CASI_T10.length}` : perDifetto(difetti) });
    }
  } finally { await c.chiudi(); }
}

// --- T-11: la figura si vede prima di rispondere (D-01, D-02, D-14, R-RIF-18) --------
//
// docs/idee-dopo-gli-account.md, I-27, regole D-01, D-02 e D-14: chi legge «il
// segnale rappresentato in figura» deve vedere la figura, intera, prima di
// rispondere, e accanto la domanda e l'inizio delle risposte. Nato dall'audit
// delle schermate (I-27, punto 2): sul sito della v0.32.0 «Metti un segnalibro»
// e «Segnala un problema» stanno dentro .qtext, fra il testo e la figura, in
// un'area che si taglia, e a 375×812 la figura di base-828 non si vede. Nessun
// controllo lo vedeva: le letture di testo trovano la figura nel DOM, e i banchi
// non guardano dove sta.
//
// La misura, nella pagina e com'e' aperta, senza scorrere: l'area visibile e' la
// finestra intersecata con ogni antenato che taglia (overflow diverso da
// visible); la figura caricata deve starci intera, con il suo centro sotto il
// dito (elementFromPoint), e devono starci anche l'inizio della domanda e il
// centro della prima risposta. I casi: base-828 e base-829, il quesito piu'
// lungo con figura, aperti per numero, a 375×812, prima di rispondere. Non vede:
// i 375×667, la revisione, la simulazione, Safari, e se la figura e' leggibile.

function figuraInVista(K) {
  const W = innerWidth, H = innerHeight;
  // L'area che si vede di un elemento: la finestra, tagliata da ogni antenato con overflow.
  const area = (e) => {
    let a = { top: 0, left: 0, right: W, bottom: H };
    const tagli = [];
    for (let p = e.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
      const r = p.getBoundingClientRect();
      const b = { top: Math.max(a.top, r.top), left: Math.max(a.left, r.left), right: Math.min(a.right, r.right), bottom: Math.min(a.bottom, r.bottom) };
      if (b.top > a.top || b.bottom < a.bottom || b.left > a.left || b.right < a.right) tagli.push(K.nome(p).slice(0, 40));
      a = b;
    }
    return { ...a, tagli };
  };
  const sotto = (e, x, y) => { const h = document.elementFromPoint(x, y); return h && (h === e || e.contains(h)) ? null : K.nome(h || document.body); };
  const px = (r) => `${Math.round(r.top)}–${Math.round(r.bottom)} px`;
  const difetti = [];
  const img = [...document.querySelectorAll('#r-fig img')].find(K.V);
  if (!img) return { difetti: ['la figura (#r-fig img) non si vede'] };
  if (!img.complete || !img.naturalWidth) return { difetti: ['la figura non e\' caricata'] };
  const rf = img.getBoundingClientRect(), af = area(img);
  const tagliata = rf.top < af.top - 1 || rf.bottom > af.bottom + 1 || rf.left < af.left - 1 || rf.right > af.right + 1;
  if (tagliata) {
    difetti.push(`la figura sta a ${px(rf)}, e se ne vede ${Math.max(0, Math.round(Math.min(rf.bottom, af.bottom) - Math.max(rf.top, af.top)))} px su ${Math.round(rf.height)}`
      + ` (area visibile ${px(af)} su ${H}${af.tagli.length ? `, tagliata da ${af.tagli.join(', ')}` : ''})`);
  } else {
    const s = sotto(img, (rf.left + rf.right) / 2, (rf.top + rf.bottom) / 2);
    if (s) difetti.push(`la figura ha sopra ${s}`);
  }
  const testo = [...document.querySelectorAll('#r-text')].find(K.V);
  if (!testo) difetti.push('la domanda (#r-text) non si vede');
  else {
    const rt = testo.getBoundingClientRect(), at = area(testo);
    const riga = parseFloat(getComputedStyle(testo).lineHeight) || parseFloat(getComputedStyle(testo).fontSize) * 1.2;
    const y = rt.top + Math.min(riga, rt.height) / 2;
    if (rt.top < at.top - 1 || y > at.bottom) difetti.push(`l'inizio della domanda sta a ${Math.round(rt.top)} px, fuori dall'area visibile ${px(at)}`);
    else { const s = sotto(testo, rt.left + Math.min(8, rt.width / 2), y); if (s) difetti.push(`l'inizio della domanda ha sopra ${s}`); }
  }
  const ans = [...document.querySelectorAll('#r-ans .ans')].find(K.V);
  if (!ans) difetti.push('la prima risposta non si vede');
  else {
    const ra = ans.getBoundingClientRect(), aa = area(ans);
    const x = (ra.left + ra.right) / 2, y = (ra.top + ra.bottom) / 2;
    if (y < aa.top || y > aa.bottom || x < aa.left || x > aa.right) difetti.push(`la prima risposta sta a ${px(ra)}, con il centro fuori dall'area visibile ${px(aa)} su ${H}`);
    else { const s = sotto(ans, x, y); if (s) difetti.push(`la prima risposta ha sopra ${s}`); }
  }
  return { difetti, figura: { top: Math.round(rf.top), bottom: Math.round(rf.bottom) } };
}

const CASI_T11 = ['base-828', 'base-829'];
export const FIGURA_IN_VISTA = 'a 375×812, prima di rispondere, la figura si vede intera nel primo schermo, con l\'inizio della domanda e della prima risposta, e niente le sta sopra';

async function t11(b, ctx, v) {
  const g = 'T-11';
  const c = await b.nuovoContesto();
  const intoppi = [], difetti = [];
  let misurati = 0;
  try {
    for (const id of CASI_T11) {
      const it = QUIZ_TUTTI.find((x) => x.id === id);
      const tab = await c.apri(ctx.sito + ingresso(ctx));
      await tab.dimensioni(375, 812);
      if (!await tab.attendi(PRONTO, CARICO)) { intoppi.push(`${id}: la pagina non si apre`); continue; }
      if (!it || !it.f) { intoppi.push(`${id}: nella banca non ha una figura`); continue; }
      if (!await apriPerNumero(tab, it)) { intoppi.push(`${id}: il quesito non si apre per numero`); continue; }
      await tab.attendi(js(`const i = [...document.querySelectorAll('#r-fig img')].find(V); return !!i && i.complete && i.naturalWidth > 0;`), REAZIONE);
      const m = await tab.valuta(inPagina(figuraInVista));
      misurati++;
      for (const d of m.difetti) difetti.push(`${id}: ${d}`);
    }
    v.push({ gruppo: g, nome: 'i due quesiti con figura si aprono per numero', ok: !intoppi.length, extra: perDifetto(intoppi) });
    v.push({ gruppo: g, nome: FIGURA_IN_VISTA, ok: misurati === CASI_T11.length && !difetti.length,
      extra: misurati < CASI_T11.length ? `misurati ${misurati} casi su ${CASI_T11.length}` : perDifetto(difetti) });
  } finally { await c.chiudi(); }
}

// --- T-12: l'azione principale, l'avviso detto una volta, Esame sulle prove ------------------
//
// Il giro 1 delle regole di disegno (docs/regole-disegno-progetto.md §4 e
// §10.1; I-27, D-01, D-12, D-13, D-14, D-24, D-30). Senza account, a 375×812 e
// a 375×667, superficie per superficie: la Home prima e dopo una risposta,
// Esame, i segmenti Carteggio e Segnali, il riepilogo con un errore, e sei
// preparazioni. Su ognuna il banco sa da se' qual e' l'azione principale — un
// pulsante, o il contenitore di un gruppo di porte alla pari — con gli
// identificatori che conosce gia', e misura con quella: le parti principale,
// primo-schermo, esame, avviso e scelte non leggono l'aggancio. La parte
// aggancio guarda che la pagina dica la stessa cosa con `data-ruolo`, e un
// avviso si trova per testo, mai per aggancio: una frase senza aggancio e' un
// rosso di aggancio, non un avviso che sparisce dalla misura.
//
// D-14 non e' un indice ma tre verifiche discrete (§4 del progetto): nel primo
// schermo un solo fondo pieno, l'azione principale (contrasto ≥ 3:1 con la
// pagina, la soglia di WCAG 1.4.11 presa a prestito); un avviso e' testo, non
// un riquadro (fondo < 1,5:1 e bordo su meno di tre lati, soglie nostre); e
// occupa al piu' il 15 % del primo schermo (soglia nostra). L'indice dell'audit
// del 21 ottobre — area × contrasto — resta nell'extra, come numero.
//
// Che cosa non vede: la «gara di misura» fra due azioni di forma uguale e fondo
// diverso; l'ordine giusto per una persona; lo stato con l'account; Safari e il
// gesto vero.

const PARTI_T12 = ['principale', 'primo-schermo', 'esame', 'avviso', 'scelte', 'aggancio'];
const AVVISI_T12 = [PRIMA, SEG_PRIMA];
// L'avviso per significato, non solo per testo esatto (volto §6.2, decisione A
// del giro 1, D-08): la tappa 1 del mock della U dice «Senza account le risposte
// valgono finche' la pagina resta aperta», due parole meno di PRIMA, e la frase
// esatta non la prenderebbe. Una frase che dice «senza account» e, nella stessa
// frase, che le risposte non restano, e' un avviso di conservazione dove non ci
// deve essere. Non vede una parafrasi che non nomina l'account.
const SIGNIFICATO_AVVISO = 'senza account[^.;]*?(valgono|finch[eé]|si perdono|perdi|non rest|restano solo|non (si )?conserv|non (si )?salv)';
const PORTE_ESAME = ['#v-esame [data-cporta="prova"]', '#v-esame [data-modo="sim"][data-prova="base"]', '#v-esame [data-modo="sim"][data-prova="vela"]',
  '#v-esame [data-modo="sim"][data-prova="entrambe"]'];
const PORTE_CARTEGGIO = ['#seg-carteggio [data-cporta="prova"]', '#seg-carteggio [data-cporta="esercizi"]', '#seg-carteggio [data-cporta="tecniche"][data-v="tec"]'];
const SIM_HOME = '#v-home [data-modo="sim"][data-prova="base"]';
const INIZIA = '[data-preparazione] #start';

/** Apre una preparazione dalla sua porta: true quando il suo Inizia si vede. */
async function preparazioneDa(tab, porta, inizia = INIZIA) {
  return await clic(tab, porta) && tab.attendi(visibile(inizia), REAZIONE);
}
async function sezioneT12(tab, x, dove) {
  return await apriPorta(tab, x) && tab.attendi(visibile(dove), REAZIONE);
}

// Le superfici, nell'ordine in cui il banco le visita. `apri` porta la pagina
// alla superficie; `porta` o `gruppo` e' l'azione principale; `avviso` la frase
// che ci deve stare accanto, oppure null: allora non ce ne deve essere nessuna.
const SUPERFICI_T12 = [
  { dove: 'la Home', apri: (tab) => sezioneT12(tab, 'oggi', SIM_HOME), porta: SIM_HOME, avviso: null, scelte: true },
  // La Home al computer, sopra la soglia della U (volto §6.2, decisione 9): la
  // principale contro la superficie che ha dietro, al piu' quattro bersagli con
  // il percorso escluso come navigazione, nessun avviso nemmeno parafrasato, e
  // l'azione nel primo schermo anche a 1200×700.
  { dove: 'la Home al computer', dims: [[1280, 800], [1200, 700]], apri: (tab) => sezioneT12(tab, 'oggi', SIM_HOME), porta: SIM_HOME, avviso: null, scelte: true },
  { dove: 'Esame', apri: (tab) => sezioneT12(tab, 'esame', PORTE_ESAME[0]), gruppo: PORTE_ESAME, avviso: null, esame: true },
  { dove: 'Allenati · Carteggio', apri: (tab) => sezioneT12(tab, 'cart', PORTE_CARTEGGIO[0]), gruppo: PORTE_CARTEGGIO, avviso: null },
  { dove: 'Allenati · Segnali', apri: (tab) => sezioneT12(tab, 'seg', '#s-start'), porta: '#s-start', avviso: SEG_PRIMA },
  { dove: 'la preparazione della simulazione', apri: async (tab) => await sezioneT12(tab, 'oggi', SIM_HOME) && preparazioneDa(tab, SIM_HOME),
    porta: INIZIA, avviso: PRIMA, scelte: true },
  { dove: 'la preparazione del breve', apri: async (tab) => await sezioneT12(tab, 'oggi', '[data-rotta-start]') && preparazioneDa(tab, '[data-rotta-start]'),
    porta: INIZIA, avviso: PRIMA, scelte: true },
  { dove: 'la preparazione di «Scegli un argomento»', apri: async (tab) => await sezioneT12(tab, 'quiz', '#seg-quiz [data-modo="argomento"]')
    && preparazioneDa(tab, '#seg-quiz [data-modo="argomento"]'), porta: INIZIA, avviso: PRIMA, scelte: true },
  { dove: 'la preparazione della prova di carteggio', apri: async (tab) => await sezioneT12(tab, 'cart', PORTE_CARTEGGIO[0])
    && preparazioneDa(tab, PORTE_CARTEGGIO[0], '#c-start'), porta: '#c-start', avviso: PRIMA, scelte: true },
  { dove: 'la preparazione degli esercizi su carta', apri: async (tab) => await sezioneT12(tab, 'cart', PORTE_CARTEGGIO[1])
    && preparazioneDa(tab, PORTE_CARTEGGIO[1], '#c-esercizi'), porta: '#c-esercizi', avviso: PRIMA, scelte: true },
  { dove: 'la preparazione di «Che tecnica serve?»', apri: async (tab) => await sezioneT12(tab, 'cart', PORTE_CARTEGGIO[2])
    && preparazioneDa(tab, PORTE_CARTEGGIO[2], '#t-start'), porta: '#t-start', avviso: PRIMA, scelte: true },
];

/**
 * La misura di una superficie, nella pagina, a scorrimento zero. Restituisce
 * per ogni parte un elenco di difetti (vuoto se va bene) e i numeri per l'extra.
 */
function disegnoT12(K, cfg) {
  scrollTo(0, 0);
  for (const e of document.querySelectorAll('*')) if (e.scrollTop && getComputedStyle(e).overflowY !== 'visible') e.scrollTop = 0;
  // Il riepilogo comincia dal suo titolo: e' li' che il primo schermo di chi lo apre
  // comincia, anche dove sta sotto il runner (la pagina di riferimento, senza stili).
  const inizio = cfg.inizio && [...document.querySelectorAll(cfg.inizio)].find(K.V);
  if (inizio) inizio.scrollIntoView({ block: 'start' });
  const H = innerHeight, W = innerWidth;
  const primo = (sel) => [...document.querySelectorAll(sel)].find(K.V) || null;
  const out = { principale: [], primo: [], esame: [], avviso: [], scatola: [], scelte: [], aggancioP: [], aggancioA: [], vicino: [], numeri: {} };
  const porte = cfg.gruppo ? cfg.gruppo.map(primo) : [primo(cfg.porta)];
  if (porte.some((x) => !x)) return { manca: cfg.gruppo ? `manca la porta ${cfg.gruppo[porte.findIndex((x) => !x)]}` : `manca ${cfg.porta}` };
  // Il gruppo: il piu' piccolo antenato comune delle porte.
  let P = porte[0];
  if (cfg.gruppo) while (P && !porte.every((x) => P.contains(x))) P = P.parentElement;
  const dentroP = (e) => P.contains(e) || e.contains(P);
  // Il percorso della Home al computer e' una navigazione, come la barra (volto
  // §5.3, decisione 6): ogni <nav> e' esclusa.
  const escluso = (e) => !!e.closest('header, nav, #barra, [data-avatar], [role="tab"]');
  const pagina = K.fondo(document.body) || [255, 255, 255, 1];
  const lumC = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const rapporto = (a, b) => { const x = lumC(a), y = lumC(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const rgba = (t) => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return [0, 0, 0, 0]; const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  // Il fondo proprio di un elemento, composto su quello che ha dietro, contro la
  // superficie che ha dietro (volto §6.2, decisione 7): con la pagina scura della
  // Home al computer il pulsante pieno dentro la scheda bianca si misura contro
  // la scheda, non contro il mare del body. Sulle superfici chiare dietro e'
  // la pagina, e la misura e' quella del giro 1.
  const fondoProprio = (e) => {
    const c = rgba(getComputedStyle(e).backgroundColor);
    if (c[3] === 0) return 1;
    const dietro = (e.parentElement && K.fondo(e.parentElement)) || pagina;
    const comp = [0, 1, 2].map((i) => c[i] * c[3] + dietro[i] * (1 - c[3]));
    return rapporto(comp, dietro);
  };
  // D-14 riscritta (decisione 7): l'azione principale e' la cosa interattiva piu'
  // evidente. Le superfici che non si toccano — la carta, il velo, le schede che
  // contengono testo — non sono un secondo fondo pieno.
  const interattivo = (e) => e.matches('button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=link]');
  const inCima = (e, r) => { const t = document.elementFromPoint(Math.min(W - 1, Math.max(0, r.left + r.width / 2)), Math.min(H - 1, Math.max(0, r.top + r.height / 2))); return !!t && (e.contains(t) || t.contains(e)); };
  const nelPrimo = (r) => r.bottom > 0 && r.top < H && r.width >= 8 && r.height >= 8;

  // principale: un solo fondo pieno nel primo schermo, ed e' l'azione principale.
  const pieni = [];
  for (const e of document.querySelectorAll('body *')) {
    // Un elemento trasparente non pesa: #sync, il messaggio dell'invio, sta li' con opacita' zero.
    if (!K.V(e) || escluso(e) || dentroP(e) || K.opacita(e) < 0.1) continue;
    const r = e.getBoundingClientRect();
    if (!nelPrimo(r) || getComputedStyle(e).backgroundImage !== 'none') continue;
    if (interattivo(e) && fondoProprio(e) >= 3 && inCima(e, r)) pieni.push(K.nome(e));
  }
  for (const x of pieni) out.principale.push(`${x} ha il fondo pieno fuori dall'azione principale`);
  if (!cfg.gruppo) {
    const f = fondoProprio(P);
    if (f < 3) out.principale.push(`l'azione principale ${K.nome(P)} non ha il fondo pieno (${f.toFixed(2)}:1 con la pagina)`);
  }

  // primo schermo: l'azione principale (o la prima porta) intera, sotto il dito.
  const a = porte[0], ra = a.getBoundingClientRect();
  if (ra.top < 0 || ra.bottom > H) out.primo.push(`${K.nome(a)} sta a ${Math.round(ra.top)}–${Math.round(ra.bottom)} px su ${H}`);
  else if (!inCima(a, ra)) { const r = ra, t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); out.primo.push(`${K.nome(a)} ha sopra ${t ? K.nome(t) : 'niente'}`); }

  // Esame: «Le prove» e la prima porta prima del modulo, nel primo schermo; il modulo chiuso.
  if (cfg.esame) {
    const s = document.querySelector('#v-esame');
    const titolo = [...s.querySelectorAll('h2, h3')].find((h) => K.V(h) && h.textContent.trim() === 'Le prove');
    const porta = porte.slice().sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))[0];
    const campi = [...s.querySelectorAll('input, select, textarea')];
    if (!titolo) out.esame.push('nessun titolo «Le prove» in Esame');
    for (const [nome, e] of [['il titolo «Le prove»', titolo], [`la prima porta ${K.nome(porta)}`, porta]]) {
      if (!e) continue;
      const prima = campi.find((c) => c.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
      if (prima) out.esame.push(`${nome} viene dopo il campo ${K.nome(prima)}`);
      const r = e.getBoundingClientRect();
      if (r.bottom > H) out.esame.push(`${nome} sta sotto il primo schermo (${Math.round(r.top)}–${Math.round(r.bottom)} px su ${H})`);
    }
    const aperti = campi.filter((c) => { const d = c.closest('details'); return !d || d.open || !s.contains(d); });
    const sommari = [...new Set(campi.map((c) => c.closest('details')).filter(Boolean))].map((d) => (d.querySelector('summary') || {}).textContent || '');
    out.numeri.modulo = { aperti: aperti.map(K.nome), sommari };
    out.modulo = [];
    if (!campi.length) out.modulo.push('in Esame non c\'e\' il modulo');
    if (aperti.length) out.modulo.push(`campi del modulo fuori da un details chiuso: ${aperti.slice(0, 3).map(K.nome).join(', ')}`);
    if (campi.length && !sommari.some((t) => /Stai preparando|Non l'hai detto/.test(t))) out.modulo.push(`il sommario non dice la scelta: «${(sommari[0] || '').trim().slice(0, 60)}»`);
  }

  // Gli avvisi, per testo: l'elemento piu' interno che contiene la frase.
  const foglie = (frase) => {
    const ha = (x) => x.textContent.includes(frase);
    return [...document.querySelectorAll('body *')].filter((x) => ha(x) && ![...x.children].some(ha)).filter(K.V);
  };
  const trovati = cfg.frasi.flatMap((f) => foglie(f).map((e) => ({ f, e })));
  // Dove non ci deve essere nessun avviso, anche per significato (§6.2).
  if (!cfg.avviso && cfg.significato) {
    const re = new RegExp(cfg.significato, 'i');
    const tutte = [...document.querySelectorAll('body *')].filter((x) => re.test(x.textContent.replace(/\s+/g, ' ')) && ![...x.children].some((y) => re.test(y.textContent.replace(/\s+/g, ' ')))).filter(K.V);
    for (const e of tutte) if (!trovati.some((t) => t.e === e)) trovati.push({ f: e.textContent.trim().replace(/\s+/g, ' '), e });
  }
  out.numeri.avvisi = trovati.length;
  if (!cfg.avviso) {
    for (const { f, e } of trovati) out.avviso.push(`c'e' l'avviso «${f.slice(0, 40)}…» (${K.nome(e)})`);
  } else {
    const miei = trovati.filter((x) => x.f === cfg.avviso);
    if (!miei.length) out.avviso.push(`manca l'avviso «${cfg.avviso.slice(0, 40)}…»`);
    if (trovati.length > 1) out.avviso.push(`gli avvisi sono ${trovati.length}, non uno`);
    for (const { e } of trovati) if (!e.closest('[data-ruolo="avviso"]')) out.aggancioA.push(`${K.nome(e)} non sta in un data-ruolo="avviso"`);
    const n = miei[0] && miei[0].e;
    if (n) {
      // La scatola dell'avviso: lui e i suoi antenati che non contengono l'azione.
      const catena = [];
      for (let x = n; x && !x.contains(P) && x !== document.body; x = x.parentElement) catena.push(x);
      const B = catena[catena.length - 1] || n;
      for (const x of catena) {
        const f = fondoProprio(x);
        if (f >= 1.5) out.scatola.push(`${K.nome(x)} ha un fondo ${f.toFixed(2)}:1 con la pagina`);
        const cs = getComputedStyle(x);
        const lati = ['Top', 'Right', 'Bottom', 'Left'].filter((l) => parseFloat(cs[`border${l}Width`]) >= 1 && !/none|hidden/.test(cs[`border${l}Style`]) && rgba(cs[`border${l}Color`])[3] > 0);
        if (lati.length >= 3) out.scatola.push(`${K.nome(x)} ha un bordo su ${lati.length} lati`);
      }
      const rb = B.getBoundingClientRect(), rp = P.getBoundingClientRect();
      const vis = Math.max(0, Math.min(rb.bottom, H) - Math.max(rb.top, 0)) * Math.max(0, Math.min(rb.right, W) - Math.max(rb.left, 0));
      const quota = vis / (W * H);
      out.numeri.quota = Math.round(quota * 100);
      // L'indice dell'audit del 21 ottobre: area × contrasto, come numero.
      out.numeri.indice = Math.round(rb.width * rb.height * fondoProprio(B));
      if (quota > 0.15) out.scatola.push(`${K.nome(B)} occupa il ${Math.round(quota * 100)} % del primo schermo`);
      const sopra = rb.bottom <= rp.top, sotto = rb.top >= rp.bottom;
      const da = sopra ? rb.bottom : sotto ? rp.bottom : null, a2 = sopra ? rp.top : sotto ? rb.top : null;
      const dist = da === null ? 0 : a2 - da;
      out.numeri.distanza = Math.round(dist);
      if (dist > 48) out.vicino.push(`${K.nome(B)} sta a ${Math.round(dist)} px dall'azione principale`);
      if (da !== null) {
        const mezzo = [...document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab]')]
          .filter((e) => K.V(e) && !escluso(e) && K.opacita(e) >= 0.1 && !P.contains(e) && !B.contains(e)).filter((e) => { const r = e.getBoundingClientRect(), y = r.top + r.height / 2; return r.width > 1 && y > da && y < a2; });
        for (const e of mezzo) out.vicino.push(`fra l'avviso e l'azione principale c'e' ${K.nome(e)}`);
      }
    }
  }

  // scelte: i bersagli nel primo schermo, barra, avatar e ritorno della preparazione esclusi.
  if (cfg.scelte) {
    const visti = new Set();
    for (let e of document.querySelectorAll('button, a[href], summary, select, textarea, input:not([type=hidden]), [role=button]')) {
      if (!K.V(e) || escluso(e) || K.opacita(e) < 0.1 || e.closest('[data-prep="chiudi"]')) continue;
      if (e.tagName === 'A' && [...e.parentElement.childNodes].some((x) => x !== e && x.nodeType === 3 && x.textContent.trim())) continue;
      if (e.matches('input[type=checkbox], input[type=radio]')) e = e.closest('label') || e;
      const r = e.getBoundingClientRect();
      if (!nelPrimo(r) || r.top + r.height / 2 > H || !inCima(e, r)) continue;
      visti.add(e);
    }
    out.numeri.scelte = visti.size;
    if (visti.size > 4) out.scelte.push(`${visti.size} bersagli nel primo schermo: ${[...visti].slice(0, 6).map(K.nome).join(', ')}`);
  }

  // aggancio: un solo data-ruolo="principale" visibile, ed e' l'azione della mappa.
  const ganci = [...document.querySelectorAll('[data-ruolo="principale"]')].filter(K.V);
  if (ganci.length !== 1) out.aggancioP.push(`${ganci.length} elementi data-ruolo="principale" visibili${ganci.length ? ': ' + ganci.slice(0, 3).map(K.nome).join(', ') : ''}`);
  else if (cfg.gruppo ? !(porte.every((x) => ganci[0].contains(x)) && !ganci[0].querySelector('input, select, textarea')) : ganci[0] !== P) {
    out.aggancioP.push(`data-ruolo="principale" sta su ${K.nome(ganci[0])}, non su ${K.nome(P)}`);
  }
  return out;
}

async function t12(b, ctx, v, parte) {
  const vuole = (p) => !parte || parte === p;
  const per = {};
  for (const p of PARTI_T12) per[p] = [];
  const extra = { modulo: [], avvisoVisto: [], scatola: [], vicino: [], intoppi: [], numeri: [], avvisoGancio: [] };
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await tab.dimensioni(375, 812);
    if (!await tab.attendi(PRONTO, CARICO)) { extra.intoppi.push('la pagina non si apre'); }
    const misura = async (s, dimensioni = s.dims || [[375, 812], [375, 667]]) => {
      // Le parti che la superficie chiede: il riepilogo solo la principale e il suo aggancio.
      const chiede = (p) => !s.parti || s.parti.includes(p);
      for (const [w, h] of dimensioni) {
        await tab.dimensioni(w, h);
        await pausa(80);
        const m = await tab.valuta(inPagina(disegnoT12, { inizio: s.inizio, porta: s.porta, gruppo: s.gruppo, avviso: s.avviso, frasi: AVVISI_T12, significato: SIGNIFICATO_AVVISO, scelte: s.scelte, esame: s.esame }));
        const dove = `${s.dove} a ${w}×${h}`;
        if (!m || m.manca) { extra.intoppi.push(`${dove}: ${m ? m.manca : 'la misura non gira'}`); continue; }
        for (const x of m.principale) per.principale.push(`${dove}: ${x}`);
        for (const x of m.aggancioP) per.aggancio.push(`${dove}: ${x}`);
        if (h === 812 || w > 900) extra.numeri.push(`${s.dove} a ${w}×${h}: ${JSON.stringify(m.numeri)}`);
        if (!chiede('avviso')) continue;
        for (const x of m.primo) per['primo-schermo'].push(`${dove}: ${x}`);
        if (s.esame) { for (const x of m.esame) per.esame.push(`${dove}: ${x}`); for (const x of m.modulo) extra.modulo.push(`${dove}: ${x}`); }
        for (const x of m.avviso) per.avviso.push(`${dove}: ${x}`);
        for (const x of m.scatola) extra.scatola.push(`${dove}: ${x}`);
        for (const x of m.vicino) extra.vicino.push(`${dove}: ${x}`);
        for (const x of m.scelte) per.scelte.push(`${dove}: ${x}`);
        for (const x of m.aggancioA) extra.avvisoGancio.push(`${dove}: ${x}`);
      }
      // Che l'avviso si veda davvero lo dicono le misure di T-06; scorre la pagina, quindi dopo.
      if (s.avviso && chiede('avviso')) {
        await tab.dimensioni(375, 812);
        const a = await avvisoVisibile(tab, s.avviso);
        if (!a.ok) extra.avvisoVisto.push(`${s.dove}: ${a.extra}`);
      }
    };
    for (const s of SUPERFICI_T12) {
      await tab.dimensioni(375, 812);
      if (!await s.apri(tab)) { extra.intoppi.push(`${s.dove} non si apre`); continue; }
      await misura(s);
    }
    // Il riepilogo con un errore, poi la Home con una risposta (H1).
    await tab.dimensioni(375, 812);
    if (await sezioneT12(tab, 'oggi', '[data-rotta-start]') && await preparazioneDa(tab, '[data-rotta-start]') && await clic(tab, INIZIA)
      && await rispondiCosi(tab, [], 'T-12', '', false) === false && await chiudiQuiz(tab, [], 'T-12', '')) {
      // Nel riepilogo l'invito e la conservazione hanno le loro frasi (R-ACC-02, R-ACC-03):
      // qui conta solo la principale, il punto 9 dell'audit.
      await misura({ dove: 'il riepilogo con un errore', porta: '#r-fine [data-ciclo="riprova"]', inizio: '#r-fine h1', avviso: null, parti: ['principale'] }, [[375, 812]]);
      if (await alPercorso(tab)) await misura({ dove: 'la Home dopo una risposta', porta: SIM_HOME, avviso: null });
      else extra.intoppi.push('dal riepilogo non si torna alla Home');
    } else extra.intoppi.push('il riepilogo con un errore non si apre');
  } finally { await c.chiudi(); }
  const ok = (xs) => !extra.intoppi.length && !xs.length;
  const dire = (xs) => extra.intoppi.length ? lista(extra.intoppi) : perDifetto(xs, 8);
  const g = (p) => `T-12:${p}`;
  if (vuole('principale')) v.push({ gruppo: g('principale'), nome: T12.principale, ok: ok(per.principale), extra: dire(per.principale) });
  if (vuole('primo-schermo')) {
    for (const [w, h] of [[375, 812], [375, 667], [1280, 800], [1200, 700]]) {
      const xs = per['primo-schermo'].filter((x) => x.includes(`a ${w}×${h}:`));
      v.push({ gruppo: g('primo-schermo'), nome: T12.primo(h, w), ok: ok(xs), extra: dire(xs) });
    }
  }
  if (vuole('esame')) {
    v.push({ gruppo: g('esame'), nome: T12.esame, ok: ok(per.esame), extra: dire(per.esame) });
    v.push({ gruppo: g('esame'), nome: T12.modulo, ok: ok(extra.modulo), extra: dire(extra.modulo) });
  }
  if (vuole('avviso')) {
    const fuori = per.avviso.filter((x) => /c'e' l'avviso/.test(x)), dentro = per.avviso.filter((x) => !/c'e' l'avviso/.test(x));
    v.push({ gruppo: g('avviso'), nome: T12.fuori, ok: ok(fuori), extra: dire(fuori) });
    v.push({ gruppo: g('avviso'), nome: T12.accanto, ok: ok([...dentro, ...extra.vicino]), extra: dire([...dentro, ...extra.vicino]) });
    v.push({ gruppo: g('avviso'), nome: T12.testo, ok: ok(extra.scatola), extra: dire(extra.scatola) + ` — misure: ${lista(extra.numeri, 12)}` });
    v.push({ gruppo: g('avviso'), nome: T12.visto, ok: ok(extra.avvisoVisto), extra: dire(extra.avvisoVisto) });
  }
  if (vuole('scelte')) v.push({ gruppo: g('scelte'), nome: T12.scelte, ok: ok(per.scelte), extra: dire(per.scelte) });
  if (vuole('aggancio')) {
    v.push({ gruppo: g('aggancio'), nome: T12.ganci, ok: ok(per.aggancio), extra: dire(per.aggancio) });
    v.push({ gruppo: g('aggancio'), nome: T12.gancioAvviso, ok: ok(extra.avvisoGancio), extra: dire(extra.avvisoGancio) });
  }
}
// I nomi delle verifiche di T-12: i difetti dichiarati li citano (docs/eccezioni-interfaccia.md).
const T12 = {
  principale: 'nel primo schermo un solo fondo pieno fra le cose che si toccano, misurato contro la superficie dietro, ed e\' l\'azione principale',
  primo: (h, w = 375) => w === 375 ? `a 375×${h} l'azione principale sta nel primo schermo, sotto il dito`
    : `a ${w}×${h} l'azione principale della Home al computer sta nel primo schermo, sotto il dito`,
  esame: 'in Esame «Le prove» e la prima porta vengono prima del modulo, nel primo schermo',
  modulo: 'in Esame il modulo sta in un details chiuso, e il sommario dice la scelta',
  fuori: 'nessun avviso nella Home, in Esame e nel segmento Carteggio, nemmeno parafrasato',
  accanto: 'in ogni preparazione l\'avviso sta accanto all\'azione principale, uno solo e senza niente in mezzo',
  testo: 'l\'avviso e\' testo, non un riquadro, e occupa al piu\' il 15 % del primo schermo',
  visto: 'in ogni preparazione l\'avviso si vede davvero',
  scelte: 'al piu\' quattro bersagli nel primo schermo della Home e delle preparazioni, anche al computer con il percorso escluso',
  ganci: 'ogni superficie dichiara la sua azione principale con data-ruolo="principale"',
  gancioAvviso: 'ogni avviso sta dentro un data-ruolo="avviso"',
};

// P-94: valori attesi ricevuti dal contratto Python, mai ricavati da :root.
const T13 = {
  corpi: 'i corpi calcolati del testo visibile appartengono alla scala',
  cinque: 'nel primo schermo al piu\' cinque corpi (soglia nostra)',
  titoli: 'un h1 per vista, al piu\' tre livelli e nessun titolo piu\' piccolo del testo o dei sottotitoli (soglia nostra per le dimensioni)',
  testo: 'testo corrente e risposte almeno 16 px, interlinea 1,45 e titoli 1,2 (soglie nostre), senza giustificato o maiuscolo su piu\' righe',
  spazi: 'gli spazi calcolati appartengono alla scala',
  sezioni: 'fra due sezioni piu\' spazio che fra i figli della stessa sezione',
  pesi: 'pesi 400, 600, 700 e grassetto al piu\' cinque parole nel paragrafo (soglia nostra)',
  distanze: 'fra due bersagli dello stesso strato almeno 8 px, esclusi segmenti e link nella frase; con un dialogo aperto, solo nel dialogo',
  righe: 'a 1280 px le righe di testo corrente hanno al piu\' 75 caratteri',
  colori: 'i colori di ruolo sono riservati ad azioni, errori e avvisi (ruoli nostri)',
  home: 'Home senza risposte a 375×812: al piu\' 78 parole nel primo schermo (soglia nostra)',
};
const PARTI_T13 = ['corpi', 'titoli', 'testo', 'spazi', 'pesi', 'distanze', 'righe', 'colori', 'home'];

function scalaT13(K, cfg) {
  const C = cfg.scala;
  if (!C) throw new Error('manca il contratto della scala dal controllo Python');
  scrollTo(0, 0);
  for (const e of document.querySelectorAll('*')) if (e.scrollTop) e.scrollTop = 0;
  const vis = (e) => {
    if (!K.V(e) || K.opacita(e) === 0 || e.closest('script,style,noscript')) return false;
    for (let p=e.parentElement;p;p=p.parentElement) if (p.tagName==='DETAILS' && !p.open && !p.querySelector('summary')?.contains(e)) return false;
    return true;
  };
  const tutti = [...document.querySelectorAll('body *')].filter(vis);
  // I testi dentro la carta della Home al computer sono disegno (volto §5.2,
  // §6.3): in unita' del disegno, e quello che dicono e' anche nella scheda, in
  // testo vero. Non si contano fra i corpi ne' fra i pesi.
  const disegno = (e) => !!e.closest('svg[role="img"], [aria-hidden="true"]');
  const testo = tutti.filter(K.haTesto).filter((e) => !disegno(e));
  // Un blocco fatto di sole cifre («20», «30′», «4»): i numeri dell'esame (§6.3).
  const cifre = (e) => { const t = e.textContent.trim(); return /\d/.test(t) && /^[\d\s.,:′'’%·×/+\-−]+$/.test(t); };
  // I corpi per ruolo (decisione 1): 56 solo nel titolo della Home al computer,
  // 44 solo in «Come funziona» al computer e nei numeri dell'esame sopra i 900 px.
  const diRuolo = (e, px) => (C.ruoli || []).some((r) => vicino(px, r.corpo) && innerWidth >= r.larghezza && innerHeight >= (r.altezza || 0)
    && (!r.cifre || cifre(e)) && (!r.selettore || [...document.querySelectorAll(r.selettore)].some((x) => x.contains(e) && (!r.testo || x.textContent.trim() === r.testo))));
  const out = Object.fromEntries([...['corpi','cinque','titoli','testo','spazi','sezioni','pesi','distanze','righe','colori','home']].map((k) => [k, []]));
  const num = { corpi: [], primo: [], pesi: [], parole: null, righe: 0, testi: testo.length, sezioni: 0 };
  const vicino = (a, b) => Math.abs(a - b) < 0.06;
  const taglia = (e) => parseFloat(getComputedStyle(e).fontSize);
  const nome = (e) => K.nome(e);
  const size = new Set(), weights = new Set();
  const primo = new Set();
  const heading = 'h1,h2,h3,h4,h5,h6';
  // Con un dialogo modale aperto il primo schermo e' il dialogo (come per D-28,
  // P-95): la Home al computer che resta dietro «Accedi» non e' una sua scelta
  // di corpi (P-97).
  const modaleAperto = [...document.querySelectorAll('[role="dialog"][aria-modal="true"], dialog[open]')].filter((e) => K.V(e)).at(-1);
  const inPrimo = (e) => { const r = e.getBoundingClientRect(); return (!modaleAperto || modaleAperto.contains(e)) && r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0; };
  for (const e of testo) {
    const cs = getComputedStyle(e), px = parseFloat(cs.fontSize), w = Number(cs.fontWeight);
    size.add(px); weights.add(w);
    if (inPrimo(e)) primo.add(px);
    if (!C.corpi.some((x) => vicino(px, x)) && !diRuolo(e, px)) out.corpi.push(`${nome(e)} corpo ${px} px${(C.ruoli || []).some((r) => vicino(px, r.corpo)) ? ' fuori dal suo ruolo' : ''}`);
    if (!C.pesi.includes(w)) out.pesi.push(`${nome(e)} peso ${w}`);
    // 800 solo per i titoli da 24 px in su e per i numeri (decisione 4).
    else if (w === C.pesoForte && !(e.matches(heading) && px >= C.forteDa - 0.06) && !cifre(e)) out.pesi.push(`${nome(e)} peso ${w} su un testo che non e' un titolo da ${C.forteDa} px ne' un numero`);
  }
  if (primo.size > 5) out.cinque.push(`${primo.size} corpi: ${[...primo].sort((a,b)=>a-b).join(', ')} px`);
  num.corpi = [...size].sort((a,b)=>a-b); num.primo = [...primo].sort((a,b)=>a-b); num.pesi = [...weights];
  // La superficie attiva: modalita' e preparazioni prima delle viste sotto.
  const superficie = [...document.querySelectorAll('[role="dialog"][aria-modal="true"], dialog[open]')].find(vis)
    || [...document.querySelectorAll('[data-preparazione]')].find(vis)
    || [...document.querySelectorAll('#r-fine.on,#quizrun.on,.view.on')].filter(vis).at(-1);
  const titoli = tutti.filter((e) => e.matches(heading) && (!superficie || superficie.contains(e)) && e.textContent.trim());
  const livelli = [...new Set(titoli.map((e) => Number(e.tagName[1])))].sort();
  // I pannelli Info/Accedi sono dialoghi con h2: il titolo della vista e' sotto.
  const dialogo = tutti.some((e) => e.matches('[role="dialog"][aria-modal="true"],dialog[open]'));
  if (!dialogo && titoli.filter((e) => e.tagName === 'H1').length !== 1) out.titoli.push(`${titoli.filter((e) => e.tagName === 'H1').length} h1 nella vista`);
  if (livelli.length > 3 || livelli.some((n, i) => i && n > livelli[i-1] + 1)) out.titoli.push(`livelli ${livelli.join(', ')}`);
  for (const h of titoli) {
    const n = Number(h.tagName[1]);
    // Un blocco di sole cifre non e' il testo che il titolo introduce (§6.3).
    const dopo = testo.find((e) => !e.matches(heading) && !h.contains(e) && !cifre(e) && (h.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING)
      && (!superficie || superficie.contains(e)));
    if (dopo && taglia(dopo) > taglia(h) + 0.06) out.titoli.push(`${nome(h)} ${taglia(h)} px introduce ${nome(dopo)} ${taglia(dopo)} px`);
    for (const altro of titoli.filter((e) => Number(e.tagName[1]) > n)) if (taglia(altro) > taglia(h) + 0.06) out.titoli.push(`${nome(h)} ${taglia(h)} px sopra ${nome(altro)} ${taglia(altro)} px`);
  }
  const correnti = tutti.filter((e) => e.matches('p,li,#r-text,#r-ans button,.ans,.spiegazione') && e.textContent.trim());
  const righeDi = (e) => {
    const righe = new Map(), walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      if (!vis(n.parentElement)) continue;
      // Range per carattere: non divide una riga quando cambia il nodo (strong/link).
      for (let i = 0; i < n.length; i++) {
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
        const rect = r.getClientRects()[0];
        if (!rect || !rect.height) continue;
        const y = Math.round(rect.top / 2) * 2;
        righe.set(y, (righe.get(y) || '') + n.data[i]);
      }
    }
    return [...righe.values()].map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  };
  for (const e of correnti) {
    const cs = getComputedStyle(e), px = taglia(e), rapporto = parseFloat(cs.lineHeight) / px;
    if (px < 16 - 0.06) out.testo.push(`${nome(e)} testo ${px} px < 16`);
    if (Math.abs(rapporto-C.testo) > 0.005) out.testo.push(`${nome(e)} interlinea ${rapporto.toFixed(3)} invece di ${C.testo}`);
    if (cs.textAlign === 'justify') out.testo.push(`${nome(e)} giustificato`);
    if (innerWidth === 1280 || cs.textAlign === 'center' || cs.textTransform === 'uppercase' || /^[^a-zà-ü]*[A-ZÀ-Ü]/.test(e.textContent)) {
      const righe = righeDi(e);
      if (innerWidth === 1280) {
        const max = Math.max(0, ...righe.map((s) => s.length)); num.righe = Math.max(num.righe, max);
        if (max > 75) out.righe.push(`${nome(e)} ${max} caratteri per riga`);
      }
      if (cs.textAlign === 'center' && righe.length > 2) out.testo.push(`${nome(e)} centrato su ${righe.length} righe (soglia nostra: 2)`);
    }
  }
  for (const e of testo) {
    const cs = getComputedStyle(e), t = e.textContent.trim();
    if ((cs.textTransform === 'uppercase' || (!['lowercase','capitalize'].includes(cs.textTransform) && /[A-ZÀ-Ü]/.test(t) && t === t.toUpperCase())) && righeDi(e).length > 1) out.testo.push(`${nome(e)} maiuscolo oltre una riga`);
    // 1,05 per i titoli da 44 e 56 px, 1,2 per gli altri (decisione 3).
    const lhT = taglia(e) >= C.grandiDa - 0.06 ? C.titoliGrandi : C.titoli;
    if (e.matches(heading) && Math.abs(parseFloat(cs.lineHeight) / taglia(e)-lhT) > 0.005) out.testo.push(`${nome(e)} interlinea titolo ${(parseFloat(cs.lineHeight)/taglia(e)).toFixed(3)} invece di ${lhT}`);
    if (Number(cs.fontWeight) >= 600 && e.closest('p') && t.split(/\s+/).length > 5) out.pesi.push(`${nome(e)} grassetto ${t.split(/\s+/).length} parole`);
  }
  for (const e of tutti) {
    const cs = getComputedStyle(e);
    for (const p of ['marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft','rowGap','columnGap']) {
      const css = p.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
      const typed = e.computedStyleMap && e.computedStyleMap().get(css);
      if (typed && typed.toString() === 'auto') continue;
      const px = parseFloat(cs[p]);
      if (!Number.isFinite(px) || vicino(px, 0)) continue;
      // Solo le eccezioni geometriche decise, non un lasciapassare sui numeri.
      if (cfg.eccezioni.some((x) => e.matches(x.selettore) && p === x.proprieta && vicino(px, x.valore))) continue;
      if (!C.spazi.some((s) => vicino(px, s))) out.spazi.push(`${nome(e)} ${css} ${px} px`);
    }
  }
  const gruppi = tutti.filter((e) => e.matches('.view.on, [data-preparazione]:not([hidden])'));
  for (const g of gruppi) {
    const sezioni = [...g.children].filter((e) => vis(e) && (e.matches('section') || e.querySelector('h2')));
    for (let i = 1; i < sezioni.length; i++) {
      const a = sezioni[i-1], b = sezioni[i];
      const ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
      let spazio = rb.top - ra.bottom;
      if (Math.min(ra.right,rb.right) <= Math.max(ra.left,rb.left)+0.06) continue; // affiancate
      // I pannelli alti uno schermo sono contigui, con lo spazio dentro (volto
      // §6.3): fra due pannelli si misura lo spazio fra i contenuti.
      const contenuti = (s) => [...s.children].filter(vis).map((x) => x.getBoundingClientRect()).filter((r) => r.height > 0);
      if (spazio <= 0.06 && ra.height >= innerHeight * 0.8 && rb.height >= innerHeight * 0.8) {
        const ca = contenuti(a), cb = contenuti(b);
        if (ca.length && cb.length) spazio = Math.min(...cb.map((r) => r.top)) - Math.max(...ca.map((r) => r.bottom));
      }
      let interno = 0;
      for (const s of [a,b]) {
        const figli = [...s.children].filter(vis);
        for (let k = 1; k < figli.length; k++) interno = Math.max(interno, figli[k].getBoundingClientRect().top - figli[k-1].getBoundingClientRect().bottom);
      }
      num.sezioni++;
      if (spazio <= interno + 0.06) out.sezioni.push(`${nome(a)} → ${nome(b)}: fra sezioni ${spazio.toFixed(1)} px, dentro ${interno.toFixed(1)} px`);
    }
  }
  num.distanzaMin = null;
  // P-95: D-28 misura i bersagli che si toccano insieme. Con un dialogo modale
  // aperto la superficie e' il dialogo: la pagina sotto non si tocca. E due
  // bersagli si confrontano solo nello stesso strato — la pagina che scorre, o
  // lo stesso contenitore position:fixed (barra, runner, pannello): fra la
  // barra fissa e la porta che le passa sotto la distanza dipende dallo
  // scorrimento, non dal disegno (a 375×812 la porta «Allenati» della Home
  // sotto «Home» della barra, 0 px, nel fermo di P-95). Le coppie dentro la
  // barra, dentro il dialogo e nella pagina restano misurate per intero.
  const modale = [...document.querySelectorAll('[role="dialog"][aria-modal="true"], dialog[open]')].filter(vis).at(-1);
  const strato = (e) => { for (let p = e; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).position === 'fixed') return p; return null; };
  const bersagli = [...new Set(tutti.filter((e) => e.matches('button,a[href],input:not([type=hidden]),select,textarea,summary,[role=button]') && !e.disabled)
    .filter((e) => !(cfg.segmenti && e.closest('[role="tablist"]')) && !(e.tagName === 'A' && e.closest('p')))
    .map((e) => e.matches('input[type=checkbox],input[type=radio]') ? e.closest('label') || e.labels[0] || e : e))]
    .filter((e) => !modale || modale.contains(e));
  const strati = new Map(bersagli.map((e) => [e, strato(e)]));
  num.bersagli = bersagli.length; num.strati = new Set(strati.values()).size;
  for (let i = 0; i < bersagli.length; i++) for (let j = i+1; j < bersagli.length; j++) {
    const a = bersagli[i], b = bersagli[j];
    if (a.contains(b) || b.contains(a)) continue;
    if (strati.get(a) !== strati.get(b)) continue;
    const r = a.getBoundingClientRect(), s = b.getBoundingClientRect();
    const dx = Math.max(0, r.left-s.right, s.left-r.right), dy = Math.max(0, r.top-s.bottom, s.top-r.bottom), d = Math.hypot(dx,dy);
    num.distanzaMin = num.distanzaMin === null ? d : Math.min(num.distanzaMin,d);
    if (d < 8 - 0.06) out.distanze.push(`${nome(a)} / ${nome(b)}: ${d.toFixed(2)} px`);
  }
  // Colori calcolati, equivalenze incluse: il valore del token e' fissato dal contratto.
  const rgb = (hex) => `rgb(${hex.slice(1).match(/../g).map((x)=>parseInt(x,16)).join(', ')})`;
  const comando = 'button,a[href],input,select,textarea,summary,[role=button],[role=tab],[role=link]';
  for (const e of tutti) {
    const cs = getComputedStyle(e);
    const ha = (colore) => cs.backgroundColor === colore || (K.haTesto(e) && cs.color === colore);
    // Il segno del sito, l'arancio delle boe: solo disegni e segni, mai un
    // testo, un comando o un esito (volto §5.1, decisione 8).
    if (C.colori['--boa']) {
      const boa = rgb(C.colori['--boa']);
      if (K.haTesto(e) && !disegno(e) && cs.color === boa) out.colori.push(`${nome(e)} segno del sito su un testo`);
      if (e.matches(comando)) {
        const linea = (l) => parseFloat(cs[`border${l}Width`]) > 0 && !/none|hidden/.test(cs[`border${l}Style`]) && cs[`border${l}Color`] === boa;
        if (cs.backgroundColor === boa || cs.color === boa || ['Top','Right','Bottom','Left'].some(linea)
          || (cs.textDecorationLine !== 'none' && cs.textDecorationColor === boa)) out.colori.push(`${nome(e)} segno del sito su un comando`);
      }
    }
    if (ha(rgb(C.colori['--acc'])) && !e.closest('button,a[href],input,select,textarea,summary,[role=button],[role=tab]') && !e.matches('[role=tablist]')) out.colori.push(`${nome(e)} accento su testo non interattivo`);
    if (ha(rgb(C.colori['--ok'])) && !e.closest('.ok,.success,.giusta,[data-esito=corretto]')) out.colori.push(`${nome(e)} colore giusto fuori ruolo`);
    if (ha(rgb(C.colori['--ko'])) && !e.closest('[role=alert],.ko,.error,.errore,.sbagliata,[data-esito="errato"]')) out.colori.push(`${nome(e)} colore errore fuori ruolo`);
    if (ha(rgb(C.colori['--warn'])) && !e.closest('[role=alert],[data-ruolo=avviso],.warn,.warning,.nb,.crono')) out.colori.push(`${nome(e)} ambra fuori avviso`);
  }
  if (cfg.home && innerWidth === 375 && innerHeight === 812) {
    const w = document.createTreeWalker(document.querySelector('#v-home'), NodeFilter.SHOW_TEXT); let parole = 0;
    for (let n; (n = w.nextNode());) {
      const e = n.parentElement;
      if (!/[\p{L}]/u.test(n.textContent) || !vis(e) || e.closest('header,nav,#barra')) continue;
      const r=e.getBoundingClientRect();
      if (r.width && r.height && r.top<innerHeight && r.bottom>0) parole += n.textContent.trim().split(/\s+/).filter((x)=>/\p{L}/u.test(x)).length;
    }
    num.parole = parole;
    if (parole > 78) out.home.push(`${parole} parole nel primo schermo, tetto 78`);
  }
  return { out, num };
}

async function t13(b, ctx, v, parte) {
  const errori = Object.fromEntries(Object.keys(T13).map((k) => [k, []])), numeri = [], intoppi = [];
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await tab.dimensioni(375,812);
    if (!await tab.attendi(PRONTO, CARICO)) throw new Error('la pagina non si apre');
    await tab.valuta('document.fonts.ready.then(() => true)');
    const misura = async (dove, home=false) => {
      for (const [w,h] of [[375,812],[1280,800]]) {
        // La pagina risponde al cambio di dimensioni (matchMedia, la soglia della
        // Home al computer): si misura dopo che ha risposto. Fino a P-99 qui
        // c'erano 100 ms fissi; ora dimensioni() aspetta lo stato, cioe' due
        // frame disegnati con lo schermo alla misura chiesta.
        await tab.dimensioni(w,h);
        const m = await tab.valuta(inPagina(scalaT13, { scala:ctx.scala, eccezioni:ctx.eccezioniScala || [], home, segmenti:true }));
        if (!m || !m.num.testi) { intoppi.push(`${dove} a ${w}: nessun testo misurato`); continue; }
        for (const [k,xs] of Object.entries(m.out)) for (const x of xs) errori[k].push(`${dove} a ${w}×${h}: ${x}`);
        numeri.push({dove,w,...m.num});
      }
    };
    // Prima delle risposte: il criterio della decisione E si applica solo a H0.
    if (await apriVista(tab,'oggi')) await misura('Home senza risposte',true);
    else intoppi.push('Home H0 non si apre');
    if (parte !== 'home') {
      for (const x of VISTE_RIF.filter((x)=>x!=='oggi')) {
        if (await apriVista(tab,x)) await misura(NOMI_VISTE[x]); else intoppi.push(`${x} non si apre`);
      }
      if (await sezioneT12(tab,'esame',PORTE_ESAME[0])) await misura('Esame'); else intoppi.push('Esame non si apre');
      // Chiude Info, visita tutte le preparazioni, poi runner dopo errore e riepilogo.
      for (const s of SUPERFICI_T12.filter((s)=>s.scelte && s.avviso)) {
        if (await s.apri(tab)) await misura(s.dove); else intoppi.push(`${s.dove} non si apre`);
      }
      if (await sezioneT12(tab,'cart',PORTE_CARTEGGIO[2]) && await preparazioneDa(tab,PORTE_CARTEGGIO[2],'#t-start')) await misura('preparazione tecniche');
      else intoppi.push('preparazione tecniche non si apre');
      const it = QUIZ_TUTTI.find((x)=>x.id==='base-1293');
      await sezioneT12(tab,'quiz','[data-ricerca]');
      if (await apriPerNumero(tab,it) && await rispondiCome(tab,it,false)) {
        await misura('runner dopo risposta errata');
        if (await chiudiQuiz(tab, [], 'T-13','')) await misura('riepilogo con errore'); else intoppi.push('riepilogo non si apre');
        if (await alPercorso(tab) && await apriAccedi(tab)) await misura('Accedi'); else intoppi.push('Accedi non si apre');
      } else intoppi.push('runner non si apre');
    }
  } finally { await c.chiudi(); }
  v.push({gruppo:'banco',nome:'T-13 misura le superfici richieste senza intoppi',ok:!intoppi.length && numeri.length >= (parte==='home'?2:32),extra:lista(intoppi)});
  for (const p of PARTI_T13.filter((p)=>!parte || parte===p)) {
    const keys = p==='corpi' ? ['corpi','cinque'] : p==='spazi' ? ['spazi','sezioni'] : [p];
    for (const k of keys) v.push({ gruppo:'T-13:'+p, nome:T13[k], ok:!intoppi.length && !errori[k].length,
      extra: intoppi.length ? lista(intoppi) : perDifetto(errori[k],12) + ' — misure: ' + JSON.stringify(numeri) });
  }
}


// --- T-15: il volto, la Home al computer «U — Terra beige» (P-97) ------------------------
//
// docs/volto-progetto.md §6.4 e §6.5, con le decisioni 1–14 del §12. Senza
// account — tranne HA in T-15:stati —, sulla pagina vera e su quella di
// riferimento, alle dimensioni dove la U si rompe e non solo dove regge: 1200×700,
// 1280×800, 1280×1024, 1440×900, 1920×1080, e 1199×800 e 1440×679, dove la U
// non deve esserci (decisione 9: da 1.200 px di larghezza e 680 di altezza).
// Le misure si fanno con il movimento ridotto emulato, cosi' i lampi non
// cambiano i pixel fra una lettura e l'altra; T-15:movimento misura anche
// senza.
//
// Il banco non si fida degli agganci, dove puo' farne a meno: la carta e' lo
// strato fisso dentro la Home che copre lo schermo; il percorso e' la <nav>
// della Home, i suoi pannelli le destinazioni dei suoi link (href="#id"); il
// faro e la boa sono i pulsanti della Home con quel nome; la colonna del testo
// e' l'unione dei testi della Home fuori dagli strati fissi. Due agganci
// servono, e sono nel contratto (§11.1 del progetto): `data-luce` sui lampi e
// `data-rotta` sulla rotta, perche' con il movimento ridotto un'animazione
// spenta non dice piu' chi era.
//
// Il contrasto sopra la carta si misura sui pixel (decisione 14, tests/png.mjs):
// i testi della Home resi trasparenti, una schermata, e per ogni testo il pixel
// peggiore dietro di lui, contro il suo colore. Non si confrontano immagini.
//
// Che cosa non vede: la bellezza; il gesto vero e un lettore di schermo; Safari
// e un iPad; le prestazioni dello strato fisso; un testo dentro la carta che
// dice una cosa diversa dalla scheda.

const T15 = {
  soglia: 'sotto la soglia della U (1.200 × 680 px) nessuno strato fisso, nessun fondo scuro e nessuno scorrimento a scatti; sopra, la carta c\'e\'',
  costa: 'a ogni dimensione del contratto gli undici triangoli stanno sulla terra, e il faro e la boa dentro lo schermo e fuori dalla colonna del testo',
  velo: 'ogni testo sopra la carta ha il contrasto minimo contro il pixel peggiore dietro di lui, pannello per pannello',
  percorso: 'il percorso e\' una navigazione: undici link con un nome, aria-current sul pannello in vista, un tocco porta al pannello e al suo titolo senza cambiare l\'indirizzo ne\' la cronologia, bersagli di 44 px a 8 px, triangoli a 3:1 sulla terra',
  fuoco: 'dopo la testata il primo fuoco e\' l\'azione principale, e nessun fuoco va su cio\' che non si vede o non fa niente',
  luci: 'il faro e la boa sono pulsanti di almeno 44 px con aria-expanded; toccati, la scheda dice la sigla in testo vero e non copre la colonna ne\' l\'azione principale',
  ridotto: 'con il movimento ridotto niente si muove: nessuna animazione, le luci accese ferme, la rotta disegnata intera',
  ferma: 'senza il movimento ridotto le luci lampeggiano, e «Ferma le luci» le ferma',
  numeri: 'i numeri della Home al computer vengono dalla banca e dal motore',
  stati: 'la Home al computer tiene H1, HA, gli avvisi sopra il titolo e la banca non raggiungibile senza numeri inventati',
  documento: 'dalla Home al computer ad Allenati e Indietro: lo stesso documento, la carta via in Allenati e di nuovo nella Home, lo scorrimento tornato al pannello di prima',
};
const PARTI_T15 = ['soglia', 'costa', 'velo', 'percorso', 'fuoco', 'luci', 'movimento', 'numeri', 'stati', 'documento'];
const CHIAVI_T15 = { movimento: ['ridotto', 'ferma'] };
const DIMS_U = [[1200, 700], [1280, 800], [1280, 1024], [1440, 900], [1920, 1080]];
const SOTTO_U = [[1199, 800], [1440, 679]];
// Le sigle che la scheda dice in testo vero (volto §10, da far verificare all'autore).
const SIGLE = { faro: 'Lam.(2)', boa: 'Sc.(3)' };
const TAPPE_U = 11;
const META_SITO = JSON.parse(readFileSync(join(SITE, 'dati', 'meta.json'), 'utf8'));
const N_CARTEGGIO = JSON.parse(readFileSync(join(SITE, 'dati', 'carteggio.json'), 'utf8')).length;

/**
 * Quello che il banco legge della Home al computer, nella pagina: la carta,
 * il fondo, lo scorrimento a scatti, il percorso, le luci, la colonna. Con
 * `segna` mette sulla carta l'attributo con cui la schermata della costa
 * nasconde il resto; con `trasparente` rende trasparenti i testi fuori dalla
 * carta (e toglie ogni stile messo prima, con `pulisci`).
 */
function voltoT15(K, cfg) {
  const W = innerWidth, H = innerHeight;
  const vecchio = document.getElementById('t15-stile');
  if (vecchio) vecchio.remove();
  for (const x of document.querySelectorAll('[data-t15-carta]')) x.removeAttribute('data-t15-carta');
  for (const x of document.querySelectorAll('[data-t15-colore]')) { x.style.removeProperty('color'); x.style.removeProperty('-webkit-text-fill-color'); x.removeAttribute('data-t15-colore'); }
  if (cfg.pulisci) return true;
  const home = document.querySelector('#v-home');
  const fisso = (e) => { for (let p = e; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).position === 'fixed') return p; return null; };
  const copre = (e) => { const r = e.getBoundingClientRect(); return Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) >= 0.9 * W * H; };
  const strati = [...document.querySelectorAll('body *')].filter((e) => K.V(e) && getComputedStyle(e).position === 'fixed' && copre(e) && !e.closest('[aria-modal="true"], dialog'));
  const carta = strati.find((e) => home && home.contains(e)) || null;
  const lumC = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const fondoBody = K.fondo(document.body) || [255, 255, 255, 1];
  const snap = [document.documentElement, document.body].map((e) => getComputedStyle(e).scrollSnapType).filter((x) => x && x !== 'none').join(' ');
  const nomeDi = (e) => (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ');
  const rect = (e) => { if (!e) return null; const q = e.getBoundingClientRect(); return { l: q.left, t: q.top, r: q.right, b: q.bottom, w: q.width, h: q.height }; };
  const homeVista = !!home && K.V(home);
  const nav = homeVista ? [...home.querySelectorAll('nav')].find(K.V) || null : null;
  const links = nav ? [...nav.querySelectorAll('a[href], button')].filter(K.V) : [];
  const pulsanti = homeVista ? [...home.querySelectorAll('button')].filter(K.V) : [];
  const faro = pulsanti.find((b) => /\bfaro\b/i.test(nomeDi(b))) || null, boa = pulsanti.find((b) => /\bboa\b/i.test(nomeDi(b))) || null;
  const principale = homeVista ? [...home.querySelectorAll('[data-modo="sim"][data-prova="base"]')].find(K.V) || null : null;
  // La colonna: l'unione dei testi della Home fuori dagli strati fissi, quelli
  // nello schermo, a scorrimento corrente.
  const testi = homeVista ? [...home.querySelectorAll('*')].filter((e) => K.V(e) && K.haTesto(e) && !fisso(e) && K.opacita(e) > 0.1) : [];
  let col = null;
  for (const e of testi) {
    const q = e.getBoundingClientRect();
    if (q.width < 1 || q.bottom < 0 || q.top > H) continue;
    col = col ? { l: Math.min(col.l, q.left), r: Math.max(col.r, q.right), t: Math.min(col.t, q.top), b: Math.max(col.b, q.bottom) } : { l: q.left, r: q.right, t: q.top, b: q.bottom };
  }
  if (cfg.segna && carta) {
    carta.setAttribute('data-t15-carta', '');
    const st = document.createElement('style'); st.id = 't15-stile';
    st.textContent = '*{visibility:hidden!important;transition:none!important}[data-t15-carta],[data-t15-carta] *{visibility:visible!important}';
    document.head.append(st);
  }
  // I testi sopra la carta, con il loro colore e le loro righe, prima di
  // renderli trasparenti per la schermata.
  let righe = null;
  if (cfg.trasparente) {
    righe = [];
    for (const e of testi) {
      const cs = getComputedStyle(e), px = parseFloat(cs.fontSize);
      const rs = [];
      for (const n of e.childNodes) {
        if (n.nodeType !== 3 || !n.textContent.trim()) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const q of rg.getClientRects()) {
          const r = { l: Math.max(0, q.left), t: Math.max(0, q.top), r: Math.min(W, q.right), b: Math.min(H, q.bottom) };
          if (r.r - r.l >= 1 && r.b - r.t >= 1) rs.push(r);
        }
      }
      // `antenati`: il contrasto che la composizione degli antenati direbbe
      // (kitPagina().contrasto) — e' la misura che i pixel sostituiscono, e serve
      // a provare la difesa (§6.6: con lei la cifra sotto l'h1 passa verde).
      if (rs.length) righe.push({ nome: K.nome(e), colore: cs.color, grande: px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700), righe: rs, antenati: (K.contrasto(e) || {}).r ?? null });
    }
    if (carta) {
      carta.setAttribute('data-t15-carta', '');
      // Il colore si eredita: i testi della carta tengono il loro, fissato qui,
      // mentre quelli fuori diventano trasparenti (e lo passerebbero alla carta).
      for (const x of [carta, ...carta.querySelectorAll('*')]) {
        const cs = getComputedStyle(x);
        x.setAttribute('data-t15-colore', '');
        x.style.setProperty('color', cs.color, 'important');
        x.style.setProperty('-webkit-text-fill-color', cs.webkitTextFillColor || cs.color, 'important');
      }
    }
    const st = document.createElement('style'); st.id = 't15-stile';
    st.textContent = 'body *:not([data-t15-carta]):not([data-t15-carta] *){color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;outline:none!important;caret-color:transparent!important;transition:none!important}'
      + 'body svg:not([data-t15-carta] svg), body img:not([data-t15-carta] img){visibility:hidden!important}';
    document.head.append(st);
  }
  return {
    W, H, carta: carta ? K.nome(carta) : null, strati: strati.map(K.nome), scuro: lumC(fondoBody) < 0.2, fondo: fondoBody.slice(0, 3).map(Math.round), snap,
    homeVista, nav: nav ? { nome: nav.getAttribute('aria-label') || '' } : null,
    links: links.map((a) => ({ nome: nomeDi(a), href: a.getAttribute('href') || '', corrente: a.getAttribute('aria-current'), rect: rect(a),
      forma: (() => { const f = a.querySelector('polygon, path, polyline, rect, circle'); if (!f) return null; const cs = getComputedStyle(f);
        return { fill: cs.fill, stroke: cs.stroke, strokeWidth: parseFloat(cs.strokeWidth) || 0, fillOpacity: Number(cs.fillOpacity) }; })() })),
    faro: faro ? { rect: rect(faro), espanso: faro.getAttribute('aria-expanded') } : null,
    boa: boa ? { rect: rect(boa), espanso: boa.getAttribute('aria-expanded') } : null,
    principale: rect(principale), colonna: col, righe, scrollY,
  };
}

/** Il colore di una stringa CSS rgb()/rgba() come [r, g, b], composto sul `sotto`. */
const coloreCss = (t, sotto = [255, 255, 255]) => {
  const m = String(t).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number), a = p.length > 3 ? p[3] : 1;
  return [0, 1, 2].map((i) => p[i] * a + sotto[i] * (1 - a));
};
const esa = (h) => h.slice(1).match(/../g).map((x) => parseInt(x, 16));
const sopraX = (a, b) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > 0.5;
const sopraR = (a, b) => sopraX(a, b) && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 0.5;

/** Apre la pagina a una dimensione, con il movimento ridotto, e aspetta la Home pronta. */
async function apriT15(c, ctx, w, h, { ridotto = true } = {}) {
  const tab = await c.apri('about:blank');
  await tab.dimensioni(w, h);
  await tab.movimento(ridotto);
  await tab.vai(ctx.sito + ingresso(ctx));
  const pronta = await tab.attendi(PRONTO, CARICO);
  await tab.valuta('document.fonts.ready.then(() => true)');
  await pausa(150);
  return { tab, pronta };
}
const statoT15 = (tab, cfg = {}) => tab.valuta(inPagina(voltoT15, cfg));

async function t15(b, ctx, v, parte) {
  const vuole = (p) => !parte || parte === p;
  const err = Object.fromEntries(Object.keys(T15).map((k) => [k, []]));
  const intoppi = [], numeri = [];
  const scala = ctx.scala || {};
  const terra = esa((scala.colori && scala.colori['--terra']) || '#f2e6cf');
  const c = await b.nuovoContesto();
  try {
    // --- soglia: sotto niente carta, sopra la carta ---------------------------------
    if (vuole('soglia')) {
      for (const [w, h] of [...SOTTO_U, [1280, 800]]) {
        const { tab, pronta } = await apriT15(c, ctx, w, h);
        if (!pronta) { intoppi.push(`a ${w}×${h} la pagina non si apre`); continue; }
        const s = await statoT15(tab);
        const sotto = w < 1200 || h < 680;
        numeri.push(`soglia ${w}×${h}: carta ${s.carta || 'no'}, fondo ${s.fondo}, scatti «${s.snap || 'no'}»`);
        if (sotto) {
          if (s.strati.length) err.soglia.push(`a ${w}×${h} c'e' uno strato fisso che copre lo schermo: ${s.strati.join(', ')}`);
          if (s.scuro) err.soglia.push(`a ${w}×${h} il fondo della pagina e' scuro (${s.fondo})`);
          if (s.snap) err.soglia.push(`a ${w}×${h} c'e' lo scorrimento a scatti (${s.snap})`);
        } else if (!s.carta) err.soglia.push(`a ${w}×${h} la Home non ha la carta: nessuno strato fisso dentro #v-home che copre lo schermo`);
      }
    }
    // --- costa, velo e luci: alle cinque dimensioni della U --------------------------
    if (vuole('costa') || vuole('velo') || vuole('luci')) {
      for (const [w, h] of DIMS_U) {
        const { tab, pronta } = await apriT15(c, ctx, w, h);
        const dove = `a ${w}×${h}`;
        if (!pronta) { intoppi.push(`${dove} la pagina non si apre`); continue; }
        const s = await statoT15(tab);
        if (!s.carta) { for (const k of ['costa', 'velo', 'luci']) if (vuole(k)) err[k].push(`${dove} la Home non ha la carta`); continue; }
        if (vuole('costa')) {
          if (s.links.length !== TAPPE_U) err.costa.push(`${dove} il percorso ha ${s.links.length} tappe, non ${TAPPE_U}`);
          await statoT15(tab, { segna: true });
          await pausa(60);
          const png = leggiPng(await tab.schermata());
          await statoT15(tab, { pulisci: true });
          const fuori = [];
          s.links.forEach((l, i) => {
            const p = png.pixel((l.rect.l + l.rect.r) / 2, (l.rect.t + l.rect.b) / 2);
            const d = Math.abs(p[0] - terra[0]) + Math.abs(p[1] - terra[1]) + Math.abs(p[2] - terra[2]);
            if (d > 30) fuori.push(`${i + 1} (rgb ${p.slice(0, 3).join(',')})`);
          });
          if (fuori.length) err.costa.push(`${dove} triangoli fuori dalla terra: ${fuori.join(', ')}`);
          for (const [nome, x] of [['il faro', s.faro], ['la boa', s.boa]]) {
            if (!x) { err.costa.push(`${dove} manca il pulsante del${nome === 'il faro' ? ' faro' : 'la boa'}`); continue; }
            const r = x.rect;
            if (r.l < 0 || r.t < 0 || r.r > s.W || r.b > s.H) err.costa.push(`${dove} ${nome} esce dallo schermo (${Math.round(r.l)}–${Math.round(r.r)} × ${Math.round(r.t)}–${Math.round(r.b)})`);
            if (s.colonna && sopraX(r, s.colonna)) err.costa.push(`${dove} ${nome} sta nella colonna del testo (${Math.round(r.l)}–${Math.round(r.r)} contro ${Math.round(s.colonna.l)}–${Math.round(s.colonna.r)})`);
          }
          numeri.push(`costa ${dove}: colonna ${s.colonna ? Math.round(s.colonna.l) + '–' + Math.round(s.colonna.r) : '?'}, faro ${s.faro ? Math.round(s.faro.rect.l) : '?'}, boa ${s.boa ? Math.round(s.boa.rect.l) : '?'}`);
        }
        if (vuole('velo')) {
          // Pannello per pannello: le destinazioni del percorso; senza percorso, a scatti di uno schermo.
          const ids = s.links.map((l) => (l.href.startsWith('#') ? l.href.slice(1) : null)).filter(Boolean);
          const passi = ids.length ? ids : [...Array(12).keys()].map(String);
          let peggiore = Infinity, misurati = 0;
          for (const id of passi) {
            await tab.valuta(ids.length ? `(() => { const e = document.getElementById(${q(id)}); if (e) { document.documentElement.style.scrollBehavior = 'auto'; e.scrollIntoView({ block: 'start' }); } return !!e; })()`
              : `(scrollTo(0, ${Number(id)} * innerHeight), true)`);
            await pausa(120);
            const st = await statoT15(tab, { trasparente: true });
            await pausa(40);
            const grezzo = await tab.schermata();
            // RG_T15_PNG=<cartella>: le schermate della misura, per guardarle.
            if (process.env.RG_T15_PNG) writeFileSync(join(process.env.RG_T15_PNG, `velo-${w}x${h}-${id}.png`), grezzo);
            const png = leggiPng(grezzo);
            await statoT15(tab, { pulisci: true });
            for (const t of st.righe || []) {
              const fg = coloreCss(t.colore);
              if (!fg) continue;
              let min = Infinity;
              for (const r of t.righe) for (let y = Math.floor(r.t); y < Math.ceil(r.b); y++) for (let x = Math.floor(r.l); x < Math.ceil(r.r); x++) {
                const k = rapportoPng(fg, png.pixel(x, y)); if (k < min) min = k;
              }
              misurati++;
              peggiore = Math.min(peggiore, min);
              const soglia = t.grande ? 3 : 4.5;
              if (min < soglia) err.velo.push(`${dove}, pannello «${id}»: ${t.nome} ${min.toFixed(2)}:1 sotto ${soglia}:1`);
            }
          }
          numeri.push(`velo ${dove}: ${misurati} testi, il peggiore ${Number.isFinite(peggiore) ? peggiore.toFixed(2) : '—'}:1`);
          if (!misurati) err.velo.push(`${dove} nessun testo misurato sopra la carta`);
          await tab.valuta('(scrollTo(0, 0), true)');
        }
        if (vuole('luci')) {
          for (const [nome, chi] of [['faro', 'faro'], ['boa', 'boa']]) {
            const x = s[chi];
            if (!x) { err.luci.push(`${dove} manca il pulsante ${nome === 'faro' ? 'del faro' : 'della boa'}`); continue; }
            if (x.rect.w < 44 - 0.5 || x.rect.h < 44 - 0.5) err.luci.push(`${dove} il pulsante ${nome === 'faro' ? 'del faro' : 'della boa'} misura ${Math.round(x.rect.w)}×${Math.round(x.rect.h)} px`);
            if (x.espanso === null) err.luci.push(`${dove} il pulsante ${nome === 'faro' ? 'del faro' : 'della boa'} non ha aria-expanded`);
            await tab.valuta(`(() => { const b = [...document.querySelectorAll('#v-home button')].find((b) => /\\b${chi}\\b/i.test((b.getAttribute('aria-label') || b.textContent || ''))); if (b) b.click(); return !!b; })()`);
            await pausa(150);
            const dopo = await statoT15(tab);
            // La sigla in testo vero: un nodo di testo che la dice, fuori dal disegno
            // (svg e aria-hidden), in un elemento che si vede.
            const scheda = await tab.valuta(js(`const s = ${q(SIGLE[chi])};
              const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let e = null;
              for (let n; (n = w.nextNode());) { const p = n.parentElement; if (n.textContent.includes(s) && p && !p.closest('svg, [aria-hidden="true"]') && V(p)) { e = p; break; } }
              if (!e) return null; const vivo = e.closest('[aria-live]'); const box = vivo || e; const r = box.getBoundingClientRect();
              return { vivo: vivo ? vivo.getAttribute('aria-live') : null, rect: { l: r.left, t: r.top, r: r.right, b: r.bottom } };`));
            if ((dopo[chi] || {}).espanso !== 'true') err.luci.push(`${dove} toccato ${nome === 'faro' ? 'il faro' : 'la boa'}, aria-expanded e' «${(dopo[chi] || {}).espanso}»`);
            if (!scheda) err.luci.push(`${dove} toccato ${nome === 'faro' ? 'il faro' : 'la boa'}, nessun testo vero dice «${SIGLE[chi]}»`);
            else {
              if (scheda.vivo !== 'polite') err.luci.push(`${dove} la scheda ${nome === 'faro' ? 'del faro' : 'della boa'} non sta in un aria-live="polite"`);
              if (dopo.colonna && sopraR(scheda.rect, dopo.colonna)) err.luci.push(`${dove} la scheda ${nome === 'faro' ? 'del faro' : 'della boa'} copre la colonna del testo (${Math.round(scheda.rect.l)}–${Math.round(scheda.rect.r)} contro ${Math.round(dopo.colonna.l)}–${Math.round(dopo.colonna.r)})`);
              if (dopo.principale && sopraR(scheda.rect, dopo.principale)) err.luci.push(`${dove} la scheda copre l'azione principale`);
            }
            await tab.valuta(`(() => { const b = [...document.querySelectorAll('#v-home button')].find((b) => /\\b${chi}\\b/i.test((b.getAttribute('aria-label') || b.textContent || ''))); if (b && b.getAttribute('aria-expanded') === 'true') b.click(); return true; })()`);
            await pausa(80);
          }
        }
      }
    }
    // --- percorso, a 1280×800 -------------------------------------------------------
    if (vuole('percorso')) {
      const { tab, pronta } = await apriT15(c, ctx, 1280, 800);
      if (!pronta) intoppi.push('a 1280×800 la pagina non si apre');
      else {
        const s = await statoT15(tab);
        if (!s.nav) err.percorso.push('nella Home al computer non c\'e\' una <nav>');
        else if (!s.nav.nome) err.percorso.push('la <nav> del percorso non ha un nome (aria-label)');
        if (s.links.length !== TAPPE_U) err.percorso.push(`il percorso ha ${s.links.length} link, non ${TAPPE_U}`);
        s.links.forEach((l, i) => {
          if (!l.nome) err.percorso.push(`la tappa ${i + 1} non ha un nome`);
          if (l.rect.w < 44 - 0.5 || l.rect.h < 44 - 0.5) err.percorso.push(`la tappa ${i + 1} misura ${Math.round(l.rect.w)}×${Math.round(l.rect.h)} px, non 44×44`);
          if (i) { const p = s.links[i - 1].rect, d = Math.max(0, l.rect.t - p.b, p.t - l.rect.b); if (d < 8 - 0.06) err.percorso.push(`fra le tappe ${i} e ${i + 1} ${d.toFixed(1)} px, non 8`); }
          const f = l.forma;
          if (!f) { err.percorso.push(`la tappa ${i + 1} non ha un triangolo`); return; }
          const pieno = f.fill !== 'none' && (coloreCss(f.fill) && !/rgba\([^)]*,\s*0\)/.test(f.fill)) && f.fillOpacity > 0.5;
          const segno = pieno ? f.fill : f.stroke;
          const col = coloreCss(segno, terra);
          const k = col ? rapportoPng(col, terra) : 0;
          if (k < 3) err.percorso.push(`il triangolo ${pieno ? 'pieno' : 'vuoto'} della tappa ${i + 1} ha ${k.toFixed(2)}:1 sulla terra (${segno})`);
        });
        const ids = s.links.map((l) => (l.href.startsWith('#') ? l.href.slice(1) : null));
        if (ids.some((x) => !x)) err.percorso.push('un link del percorso non porta a un pannello (href="#id")');
        // aria-current mentre si scorre
        for (const k of [0, 4, 10]) {
          if (!ids[k]) continue;
          await tab.valuta(`(() => { document.documentElement.style.scrollBehavior = 'auto'; const e = document.getElementById(${q(ids[k])}); if (e) e.scrollIntoView({ block: 'start' }); return true; })()`);
          const r = await tab.attendiValore(`(() => [...document.querySelectorAll('#v-home nav a, #v-home nav button')].findIndex((a) => a.getAttribute('aria-current') === 'location'))()`, (x) => x === k, 1500);
          if (!r.ok) err.percorso.push(`con il pannello ${k + 1} in vista aria-current="location" sta sulla tappa ${r.valore >= 0 ? r.valore + 1 : 'nessuna'}`);
        }
        // un tocco: il pannello, il fuoco al suo titolo, l'indirizzo e la cronologia fermi
        await tab.valuta('(scrollTo(0, 0), true)'); await pausa(200);
        const prima = await tab.valuta('({ href: location.href, n: history.length })');
        const k = 3;
        await tab.valuta(`(() => { const a = [...document.querySelectorAll('#v-home nav a, #v-home nav button')][${k}]; if (a) a.click(); return !!a; })()`);
        await pausa(500);
        const dopo = await tab.valuta(`(() => { const p = document.getElementById(${q(ids[k] || '')}); const a = document.activeElement;
          return { href: location.href, n: history.length, top: p ? p.getBoundingClientRect().top : null, H: innerHeight,
            fuoco: a ? (a.id ? '#' + a.id : a.tagName.toLowerCase()) : null, titolo: !!(p && a && p.contains(a) && /^H[1-6]$/.test(a.tagName)) }; })()`);
        if (dopo.top === null || Math.abs(dopo.top) > dopo.H / 4) err.percorso.push(`toccata la tappa ${k + 1}, il pannello sta a ${dopo.top === null ? '—' : Math.round(dopo.top)} px dalla cima`);
        if (!dopo.titolo) err.percorso.push(`toccata la tappa ${k + 1}, il fuoco e' su ${dopo.fuoco}, non sul titolo del pannello`);
        if (dopo.href !== prima.href) err.percorso.push(`toccata la tappa ${k + 1}, l'indirizzo cambia: ${prima.href} → ${dopo.href}`);
        if (dopo.n !== prima.n) err.percorso.push(`toccata la tappa ${k + 1}, la cronologia cresce: ${prima.n} → ${dopo.n} voci`);
      }
    }
    // --- fuoco, da pagina appena aperta ---------------------------------------------
    if (vuole('fuoco')) {
      const { tab, pronta } = await apriT15(c, ctx, 1280, 800);
      if (!pronta) intoppi.push('a 1280×800 la pagina non si apre');
      else {
        const visti = [];
        let primo = null;
        for (let i = 0; i < 40; i++) {
          await tab.tasto('Tab');
          const a = await tab.valuta(js(`const a = document.activeElement; if (!a || a === document.body) return null;
            const r = a.getBoundingClientRect(), p = [...document.querySelectorAll('#v-home [data-modo="sim"][data-prova="base"]')].find(V);
            return { nome: (a.id ? '#' + a.id : a.tagName.toLowerCase()) + ' «' + (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 24) + '»',
              testa: !!a.closest('header'), principale: a === p, home: !!a.closest('#v-home'),
              r: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height), innerWidth, innerHeight, scrollY],
              visibile: V(a) && r.width >= 1 && r.height >= 1 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && getComputedStyle(a).opacity !== '0',
              fa: a.matches('button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [contenteditable=true]') };`));
          if (!a) break;
          if (visti.length && a.nome === visti[0].nome) break;
          visti.push(a);
          if (!a.testa && !primo) primo = a;
          if (!a.visibile) err.fuoco.push(`il fuoco va su ${a.nome}, che non si vede (${a.r.join(',')})`);
          if (!a.fa) err.fuoco.push(`il fuoco va su ${a.nome}, che non fa niente`);
        }
        if (!primo) err.fuoco.push('dopo la testata il fuoco non arriva da nessuna parte');
        else if (!primo.principale) err.fuoco.push(`dopo la testata il primo fuoco e' ${primo.nome}, non l'azione principale`);
        numeri.push(`fuoco: ${visti.slice(0, 14).map((x) => x.nome).join(' → ')}`);
      }
    }
    // --- movimento ------------------------------------------------------------------
    if (vuole('movimento')) {
      const { tab, pronta } = await apriT15(c, ctx, 1280, 800, { ridotto: true });
      if (!pronta) intoppi.push('a 1280×800 la pagina non si apre');
      else {
        await pausa(1000);
        const m = await tab.valuta(`(() => ({ emulato: matchMedia('(prefers-reduced-motion: reduce)').matches,
          animazioni: document.getAnimations().filter((a) => a.playState === 'running').map((a) => (a.animationName || a.transitionProperty || 'animazione') + ' su ' + ((a.effect && a.effect.target && (a.effect.target.id || a.effect.target.getAttribute('class') || a.effect.target.tagName)) || '?')),
          luci: [...document.querySelectorAll('#v-home [data-luce]')].map((e) => { let o = 1; for (let p = e; p; p = p.parentElement) o *= Number(getComputedStyle(p).opacity); return o; }),
          rotta: [...document.querySelectorAll('#v-home [data-rotta]')].map((e) => getComputedStyle(e).strokeDashoffset) }))()`);
        if (!m.emulato) intoppi.push('il movimento ridotto non risulta emulato');
        if (m.animazioni.length) err.ridotto.push(`con il movimento ridotto si muovono ancora: ${m.animazioni.slice(0, 4).join(', ')}`);
        if (!m.luci.length) err.ridotto.push('nella Home non ci sono luci [data-luce]');
        m.luci.forEach((o, i) => { if (o < 0.9) err.ridotto.push(`la luce ${i + 1} non e' accesa ferma (opacita' ${o.toFixed(2)})`); });
        if (!m.rotta.length) err.ridotto.push('nella Home non c\'e\' la rotta [data-rotta]');
        m.rotta.forEach((o, i) => { if (Math.abs(parseFloat(o) || 0) > 0.5) err.ridotto.push(`la rotta ${i + 1} non e' disegnata intera (stroke-dashoffset ${o})`); });
        await tab.movimento(false);
        await pausa(800);
        const luciMosse = () => tab.valuta(`[...document.querySelectorAll('#v-home [data-luce]')].flatMap((e) => e.getAnimations()).filter((a) => a.playState === 'running').length`);
        const prima = await luciMosse();
        if (!prima) err.ferma.push('senza il movimento ridotto le luci non lampeggiano');
        await tab.valuta(`(() => { const b = [...document.querySelectorAll('#v-home button')].find((b) => /\\bfaro\\b/i.test(b.getAttribute('aria-label') || b.textContent || '')); if (b) b.click(); return true; })()`);
        await pausa(150);
        const ferma = await tab.valuta(js(`const b = [...document.querySelectorAll('button')].find((b) => V(b) && /Ferma le luci/.test(b.textContent)); if (b) b.click(); return !!b;`));
        await pausa(400);
        if (!ferma) err.ferma.push('non c\'e\' un comando visibile «Ferma le luci», nemmeno con la scheda del faro aperta');
        else if (await luciMosse()) err.ferma.push('premuto «Ferma le luci», le luci lampeggiano ancora');
      }
    }
    // --- numeri ---------------------------------------------------------------------
    if (vuole('numeri')) {
      const { tab, pronta } = await apriT15(c, ctx, 1280, 800);
      if (!pronta) intoppi.push('a 1280×800 la pagina non si apre');
      else {
        const fmt = (n) => n.toLocaleString('it-IT');
        const base = META_SITO.prove.base;
        const mirata = E.mirata(QUIZ_TUTTI.filter((x) => x.k === 'base'), {}, E.isoLocale().slice(0, 10)).length;
        const attesi = [
          // Con o senza il punto delle migliaia: l'italiano di Intl non lo mette sotto i 10.000.
          [`${fmt(QUIZ_TUTTI.length)} quesiti`, `\\b${String(QUIZ_TUTTI.length).replace(/\B(?=(\d{3})+$)/g, '\\.?')}\\s+quesiti`],
          [`${N_CARTEGGIO} esercizi`, `\\b${N_CARTEGGIO}\\s+esercizi`],
          [`${E.SEGNALI.length} segnali`, `\\b${E.SEGNALI.length}\\s+[^\\s]*\\s?(segnal|fanal)`],
          [`${QUIZ_TUTTI.filter((x) => x.osc).length} oscurati`, `\\b${QUIZ_TUTTI.filter((x) => x.osc).length}\\b[^.]{0,24}oscurat`],
          [`${QUIZ_TUTTI.filter((x) => x.nb).length} con la nota dopo la risposta`, `\\b${QUIZ_TUTTI.filter((x) => x.nb).length}\\b[^.]{0,30}not[ae]`],
          [`${QUIZ_TUTTI.filter((x) => x.fm).length} senza figura`, `\\b${QUIZ_TUTTI.filter((x) => x.fm).length}\\b[^.]{0,30}figur`],
          [`${base.n} domande della prova`, `\\b${base.n}\\b[\\s\\S]{0,40}domand`],
          [`${base.minuti} minuti della prova`, `\\b${base.minuti}\\b[\\s\\S]{0,40}minut`],
          [`al piu' ${base.errori_max} errori`, `\\b${base.errori_max}\\b[\\s\\S]{0,40}error`],
          [`fino a ${mirata} quiz nell'allenamento consigliato`, `\\b${mirata}\\b[^.]{0,30}quiz`],
        ];
        const testo = await tab.attendiValore(`(document.querySelector('#v-home') || {}).innerText || ''`, (t) => new RegExp(attesi[0][1]).test(t), REAZIONE);
        const t = (testo.valore || '').replace(/[ \t]+/g, ' ');
        for (const [cosa, re] of attesi) if (!new RegExp(re, 'i').test(t)) err.numeri.push(`nel testo visibile della Home manca «${cosa}», dalla banca e dal motore`);
        // I pesi dei temi nominati: chi dice «N delle 20» deve dire il peso del decreto.
        for (const riga of t.split(/\n+/)) {
          const m = riga.match(/\b(\d+)\s+(?:delle|su)\s+(\d+)\s+domande/i);
          if (!m) continue;
          for (const [tema, peso] of Object.entries(META_SITO.pesi_esame)) {
            const parola = tema.split(' ')[0].toLowerCase();
            if (new RegExp(`\\b${parola}`, 'i').test(riga) && Number(m[1]) !== peso) err.numeri.push(`«${riga.trim().slice(0, 60)}»: ${parola} porta ${peso} domande, non ${m[1]}`);
          }
        }
        numeri.push(`numeri: ${attesi.map((x) => x[0]).join(', ')}`);
      }
    }
    // --- stati ----------------------------------------------------------------------
    if (vuole('stati')) {
      // Il primo pannello: la destinazione del primo link del percorso; senza, la sezione della principale.
      const PRIMO = `(() => { const a = document.querySelector('#v-home nav a[href^="#"]'); const p = a && document.getElementById(a.getAttribute('href').slice(1));
        return p || ([...document.querySelectorAll('#v-home [data-modo="sim"][data-prova="base"]')].find(V) || { closest: () => null }).closest('section'); })()`;
      const dentroPrimo = (sel) => js(`const p = ${PRIMO}; return !!p && [...p.querySelectorAll(${q(sel)})].some(V);`);
      // H1: una risposta senza account, poi la Home al computer.
      {
        const { tab, pronta } = await apriT15(c, ctx, 1280, 800);
        if (!pronta) intoppi.push('a 1280×800 la pagina non si apre');
        else if (await avviaPrima(tab) && await rispondiQuiz(tab, [], 'T-15', '') && await chiudiQuiz(tab, [], 'T-15', '') && await alPercorso(tab)) {
          await pausa(150);
          const att = await tab.valuta(js(`const p = ${PRIMO}; return !!p && V(p) && /Le attività di questa pagina/.test(p.innerText);`));
          const inv = await tab.attendi(js(`const p = ${PRIMO}; return !!p && [...p.querySelectorAll('button')].some((b) => V(b) && /Conserva le risposte/.test(b.textContent));`), REAZIONE);
          if (!att) err.stati.push('in H1 «Le attività di questa pagina» non sta nel primo pannello');
          if (!inv) err.stati.push('in H1 l\'invito «Conserva le risposte» non sta nel primo pannello');
        } else intoppi.push('H1: la prima attivita\' non arriva al riepilogo e alla Home');
        // Gli avvisi sopra il titolo: ogni [role=alert] della Home sta nel primo pannello, prima del suo h1.
        if (pronta) {
          const av = await tab.valuta(js(`const p = ${PRIMO}; const h = p && p.querySelector('h1'); const xs = [...document.querySelectorAll('#v-home [role="alert"]')];
            return { n: xs.length, fuori: xs.filter((x) => !p || !p.contains(x) || !h || !(x.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING)).map((x) => x.id || x.tagName) };`));
          if (!av.n) err.stati.push('nella Home non c\'e\' un avviso [role="alert"] da mettere sopra il titolo');
          for (const x of av.fuori) err.stati.push(`l'avviso ${x} non sta nel primo pannello prima del titolo`);
        }
      }
      // HA: con l'account, la proposta nel primo pannello.
      if (ctx.apiInterno) {
        const U = await nuovoAccount(ctx, 't15');
        const { tab, pronta } = await apriT15(c, ctx, 1280, 800);
        if (!pronta || !await dentro(tab, U)) intoppi.push('HA: l\'accesso non riesce');
        else if (!await tab.attendi(dentroPrimo('[data-modo="mirata"][data-rotta-start]'), REAZIONE)) err.stati.push('in HA la proposta consigliata non sta nel primo pannello');
      } else intoppi.push('HA: il banco non ha l\'API in questa corsia');
      // La banca non raggiungibile: nessun numero inventato, e lo si dice.
      {
        const tab = await c.apri('about:blank');
        await tab.dimensioni(1280, 800); await tab.movimento(true);
        await tab.intercetta('*/dati/quiz.json', () => ({ fallisci: 'Failed' }));
        await tab.intercetta('*/dati/meta.json', () => ({ fallisci: 'Failed' }));
        await tab.intercetta('*/dati/carteggio.json', () => ({ fallisci: 'Failed' }));
        await tab.vai(ctx.sito + ingresso(ctx));
        await pausa(1500);
        const t = await tab.valuta(`(document.querySelector('#v-home') || {}).innerText || ''`);
        // I segnali vengono dal motore, non dalla banca: restano anche senza banca.
        const finti = [String(QUIZ_TUTTI.length).replace(/\B(?=(\d{3})+$)/g, '\\.?'), `${N_CARTEGGIO} esercizi`].filter((x) => new RegExp(x).test(t)).map((x) => x.replace('\\.?', '.'));
        if (finti.length) err.stati.push(`con la banca che non risponde la Home scrive ${finti.join(', ')}`);
        if (/\b0\s+(quesiti|esercizi|segnali|oscurati)/.test(t)) err.stati.push('con la banca che non risponde la Home scrive zero dove non sa');
        if (!/banca non risponde|non (si )?(possono|riusciamo|può|puo')[^.]{0,30}contar|non si contano/i.test(t)) err.stati.push('con la banca che non risponde la Home non dice che i numeri non si possono contare');
      }
    }
    // --- documento ------------------------------------------------------------------
    if (vuole('documento')) {
      const { tab, pronta } = await apriT15(c, ctx, 1280, 800);
      if (!pronta) intoppi.push('a 1280×800 la pagina non si apre');
      else {
        await tab.valuta('(window.__t15 = 1, true)');
        const s = await statoT15(tab);
        const id = s.links[4] && s.links[4].href.slice(1);
        if (!s.carta) err.documento.push('la Home al computer non ha la carta');
        if (id) { await tab.valuta(`(() => { document.documentElement.style.scrollBehavior = 'auto'; document.getElementById(${q(id)}).scrollIntoView({ block: 'start' }); return true; })()`); await pausa(400); }
        if (!await clicPorta(tab, '#barra [data-v="allenati"]') || !await tab.attendi(visibile('#v-allenati'), REAZIONE)) intoppi.push('Allenati non si apre dalla barra');
        else {
          await pausa(200);
          const a = await statoT15(tab);
          if (!await tab.valuta('window.__t15 === 1')) err.documento.push('passando ad Allenati il documento cambia');
          if (a.strati.length) err.documento.push(`in Allenati resta uno strato fisso che copre lo schermo: ${a.strati.join(', ')}`);
          if (a.scuro) err.documento.push(`in Allenati resta il fondo scuro della carta (${a.fondo})`);
          if (a.snap) err.documento.push(`in Allenati resta lo scorrimento a scatti (${a.snap})`);
          await tab.valuta('(history.back(), true)');
          if (!await tab.attendi(visibile('#v-home'), REAZIONE)) err.documento.push('con Indietro la Home non torna');
          else {
            await pausa(500);
            const h = await statoT15(tab);
            if (!await tab.valuta('window.__t15 === 1')) err.documento.push('con Indietro il documento cambia');
            if (!h.carta) err.documento.push('tornati alla Home, la carta non c\'e\'');
            if (id) {
              const top = await tab.valuta(`document.getElementById(${q(id)}).getBoundingClientRect().top`);
              if (Math.abs(top) > h.H / 4) err.documento.push(`tornati alla Home il pannello 5 sta a ${Math.round(top)} px dalla cima, non dov'era`);
            }
          }
        }
      }
    }
  } finally { await c.chiudi(); }
  v.push({ gruppo: 'banco', nome: 'T-15 misura la Home al computer senza intoppi', ok: !intoppi.length, extra: lista(intoppi) });
  for (const p of PARTI_T15.filter((p) => !parte || parte === p)) {
    for (const k of CHIAVI_T15[p] || [p]) v.push({ gruppo: 'T-15:' + p, nome: T15[k], ok: !intoppi.length && !err[k].length,
      extra: intoppi.length ? lista(intoppi) : perDifetto(err[k], 10) + ' — misure: ' + lista(numeri, 12) });
  }
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
  /^(Attività conclusa|Attività interrotta)$/,
  /^(Allenamento consigliato|Allenamento breve|Quiz per argomento|Ripasso degli errori|Un giro tra gli argomenti|Riprova degli errori|I miei segnalibri|Quiz) · Quiz (base|vela)$/,
  /^Hai affrontato (1 domanda|\d+ domande) su \d+ propost[ae]\.( (1 non è stata affrontata|\d+ non sono state affrontate)\.)?$/,
  /^Risposte corrette: \d+$/, /^Risposte errate: \d+$/,
  /^Puoi rivedere le risposte o riprovare gli errori di questa attività\.?$/,
  /^Tutte le risposte date in questa attività sono corrette\.?$/,
  /^Le domande non affrontate non sono conteggiate come errori\.?$/,
  /^Questa attività è ricostruita dalle risposte: il confine non era registrato\.?$/,
  /^Con l'account le risposte vanno nella copia su questo dispositivo e vengono inviate al server\. Puoi ritrovarle da un altro dispositivo dopo che il server le ha accolte\.$/,
  /^Le ultime risposte potrebbero non essere salvate\./,
  /^Senza account le risposte valgono solo finché questa pagina resta aperta\. Se la chiudi o la ricarichi, le perdi\. Non salviamo niente, nemmeno le tue preferenze\.$/,
  /^Vuoi conservare le attività di questa pagina\?$/,
  /^Senza account, chiudendo o ricaricando la pagina perdi le risposte e le preferenze\. Crea un account per salvare le risposte, ritrovarle su un altro dispositivo e vedere i Progressi quando ci sono abbastanza dati\.$/,
  /^Le risposte saranno legate alla tua email e conservate sul nostro server, in chiaro\. Il titolare può leggerle per supporto e statistiche\.$/,
  /^Puoi concludere qui\.$/,
];
// Le uscite ammesse (ridisegno §7.2, area 3 §6.1) e i pulsanti dell'invito (client §4.1).
const USCITE_RIEPILOGO = [
  /^Riprova (questo quesito|questi \d+( quesiti)?)$/, /^Rivedi gli errori$/, /^Rivedi le risposte$/, /^Rivedi il quiz base$/,
  /^Torna (alla Home|ad Allenati · (Quiz|Carteggio|Segnali)|a Esame|ai Progressi)$/, /^Scegli un'altra attività$/,
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
  const frasi = FRASI_RIEPILOGO, ammesse = USCITE_RIEPILOGO;
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
  const dom = R === 1 ? '1 domanda' : `${R} domande`;
  const affrontate = righe.some((r) => r.startsWith(`Hai affrontato ${dom} su ${T} propost`) && (!M || r.includes(M === 1 ? '1 non è stata affrontata' : `${M} non sono state affrontate`)));
  v.push({ gruppo: g, nome: `${prefisso}il riepilogo dice che cosa e' successo: ${R} su ${T}, ${C} corrette, ${E} errate`,
    ok: affrontate && ha(`Risposte corrette: ${C}`) && ha(`Risposte errate: ${E}`),
    extra: `in schermata: ${breve}` });
  const riprova = E === 1 ? 'Riprova questo quesito' : `Riprova questi ${E} quesiti`;
  const haRe = (re) => righe.some((r) => re.test(r));
  const riprovaOk = uscite.some((u) => u === riprova || u === `Riprova questi ${E}`);
  const rivedere = E
    ? haRe(/^Puoi rivedere le risposte o riprovare gli errori di questa attività\.?$/) && uscite.includes('Rivedi gli errori') && riprovaOk
    : haRe(/^Tutte le risposte date in questa attività sono corrette\.?$/) && !uscite.includes('Rivedi gli errori') && !uscite.some((u) => u.startsWith('Riprova'));
  v.push({ gruppo: g, nome: `${prefisso}il riepilogo dice quali rivedere: ${E ? `«${riprova}» e «Rivedi gli errori»` : 'nessuna, tutte corrette'}`,
    ok: rivedere, extra: `in schermata: ${breve}; uscite: ${uscite.join(', ')}` });
  v.push({ gruppo: g, nome: `${prefisso}il riepilogo dice che cosa non hai toccato: ${M} domande non affrontate`,
    ok: affrontate && (!M || haRe(/^Le domande non affrontate non sono conteggiate come errori\.?$/)),
    extra: `in schermata: ${breve}` });
  const voti = VOTI.map((re) => testo.match(re)).filter(Boolean).map((m) => m[0]);
  v.push({ gruppo: g, nome: `${prefisso}nessun voto sulla preparazione`, ok: !voti.length, extra: `in schermata: ${voti.join(', ')}` });
  const fuori = [];
  for (const u of uscite) if (!ammesse.some((re) => re.test(u))) fuori.push(`«${u}»`);
  const lunghe = [...uscite].sort((a, b) => b.length - a.length);
  for (let r of righe) {
    for (const u of lunghe) r = r.split(u).join('\n');
    for (const pezzo of r.split('\n').map(spazi).filter(Boolean)) if (!frasi.some((re) => re.test(pezzo))) fuori.push(`«${pezzo}»`);
  }
  v.push({ gruppo: g, nome: `${prefisso}nessuna quarta affermazione`, ok: !fuori.length, extra: `frasi che il §4.2 non ammette: ${fuori.join('; ')}` });
}

async function f01(b, ctx, v) {
  const g = 'F-01';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    const pronto = await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'l\'app si apre e la prima attivita\' si puo\' avviare', ok: pronto,
      extra: `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` + (tab.errori.length ? ': ' + tab.errori[0] : '') });
    if (!pronto) return;
    // Prima attivita': una giusta e una sbagliata, poi «Termina». Con un
    // quesito che la banca non distingue si va avanti finche' ci sono tutte e
    // due, lasciando almeno una domanda non affrontata.
    await avviaPrima(tab);
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
    await frasiRiepilogo(tab, v, g, 'prima attivita\': ', { risposte: esiti.length, corrette: esiti.filter(Boolean).length, totale: T1 }, ctx);
    // Seconda attivita', nella stessa pagina: una sola risposta, giusta.
    await clic(tab, '[data-ciclo="ritorno"]');
    const pronto2 = await tab.attendi(js(`return !V(document.querySelector('#r-fine'));`), REAZIONE) && await tab.attendi(PRONTO, REAZIONE);
    v.push({ gruppo: g, nome: 'dal riepilogo si torna al Percorso, e un\'altra attivita\' si puo\' avviare', ok: pronto2,
      extra: '[data-ciclo="ritorno"] non chiude il riepilogo, o [data-rotta-start] non torna abilitato' });
    if (!pronto2) return;
    await avviaPrima(tab);
    const e2 = await rispondiCosi(tab, v, g, 'seconda attivita\': ', true);
    if (e2 === null) return;
    const T2 = Number(((await tab.valuta(POSIZIONE)) || '').split('/')[1]);
    if (!await chiudiQuiz(tab, v, g, 'seconda attivita\': ')) return;
    await frasiRiepilogo(tab, v, g, 'seconda attivita\': ', { risposte: 1, corrette: e2 ? 1 : 0, totale: T2 }, ctx);
  } finally { await c.chiudi(); }
}

// --- C-20: le condizioni per l'account e i 18 anni, nel modulo di registrazione ---
//
// P-56 ha messo nel modulo «Crea un account» la frase su cui l'informativa
// poggia il salvataggio: creando l'account si accettano le condizioni, con il
// link, e l'account e' per chi ha compiuto 18 anni. Qui la si cerca dove la
// trova chi si registra alla fine di un'attivita' (R-ACC-75, §12 del progetto
// del client, «Le condizioni nel modulo»): dentro la finestra, in quello che
// si vede, **prima** del pulsante che crea l'account; e il link si segue,
// perche' un indirizzo giusto verso un'ancora che non c'e' porta in cima a una
// pagina che parla d'altro.
//
// Non si cerca la frase parola per parola, che e' dell'interfaccia: si
// pretende il link con la sua destinazione e i 18 anni. A 375 px, il telefono.
// Senza API: il modulo si apre da solo, e il gruppo gira dove c'e' posto.
//
// L'ultima verifica e' un'altra domanda (R-ACC-76): la finestra si vede
// davvero? `V` e `innerText` dicono che un testo non e' nascosto, non che
// niente gli stia sopra. Misurato il 2 ottobre 2026 sulla pagina vera: aperto
// dal riepilogo, il modulo sta **sotto** il riepilogo — la schermata prima e
// dopo il clic e' la stessa, byte per byte — e tutte le altre verifiche erano
// verdi. Sta in una verifica sua, cosi' la frase resta controllata anche
// finche' quel difetto e' aperto.

const CREA = 'Crea l\'account e salva';
const CONDIZIONI = { percorso: '/avvertenza', ancora: '#condizioni' };
const DICIOTTO = /\b18\s+anni\b/;
export const MODULO_VISTO = 'e la finestra si vede davvero: niente copre il titolo, la frase e il pulsante';

// Il modulo com'e' in schermata: il testo che si vede prima del pulsante, e
// ogni link della pagina — dentro o fuori dalla finestra, visto o no, prima o
// dopo il pulsante — con l'indirizzo a cui porta davvero. «Prima» e' nel
// documento e sullo schermo: un link che il CSS sposta sotto il pulsante viene dopo.
const MODULO_REGISTRAZIONE = js(`const m = M(); if (m === document) return null;
  const b = [...m.querySelectorAll('button')].find((x) => V(x) && x.textContent.trim() === ${q(CREA)});
  if (!b) return null;
  const piatto = (t) => t.replace(/\\s+/g, ' ').trim();
  const t = m.innerText, i = t.indexOf(${q(CREA)}), rb = b.getBoundingClientRect();
  return { titolo: t.includes('Crea un account'), prima: piatto(i < 0 ? t : t.slice(0, i)),
    link: [...document.querySelectorAll('a[href]')].map((a) => {
      let u = null; try { u = new URL(a.getAttribute('href'), location.href); } catch {}
      return { href: a.getAttribute('href'), url: u ? u.href : null, stessa: !!u && u.origin === location.origin,
        percorso: u ? u.pathname : null, ancora: u ? u.hash : null, testo: piatto(a.innerText),
        dentro: m.contains(a), visto: V(a) && piatto(a.innerText) !== '',
        prima: !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING) && a.getBoundingClientRect().top <= rb.top };
    }) };`);

// Dove porta il link, nella pagina che il sito serve: l'elemento dell'ancora,
// se c'e', se si vede, e che cosa dice.
const ANCORA = js(`const id = decodeURIComponent(location.hash.slice(1)), e = id ? document.getElementById(id) : null;
  return { percorso: location.pathname, id, trovata: !!e, vista: V(e), bersaglio: !!e && document.querySelector(':target') === e,
    testo: e ? e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 80) : null };`);

/**
 * La finestra si vede davvero: il titolo, il link alle condizioni, la frase
 * sui 18 anni e il pulsante, ognuno portato al centro, stanno nello schermo,
 * non sono trasparenti, non hanno niente sopra, e il loro testo ha il
 * contrasto minimo. Sono le misure di un avviso dell'area 6 (`avviso`), su
 * quattro elementi. Il link e la frase si misurano se ci sono: che ci siano
 * lo dicono le verifiche prima.
 */
function moduloVisto(K, crea, percorso, ancora, diciotto) {
  const m = [...document.querySelectorAll('[aria-modal="true"]')].find(K.V);
  if (!m) return { misurati: [], difetti: ['nessuna finestra aperta'] };
  const re = new RegExp(diciotto);
  const giusto = (a) => { try { const u = new URL(a.getAttribute('href'), location.href); return u.origin === location.origin && u.pathname === percorso && u.hash === ancora; } catch { return false; } };
  const cose = [
    ['il titolo', [...m.querySelectorAll('h1, h2, h3')].find(K.V)],
    ['il link alle condizioni', [...m.querySelectorAll('a[href]')].find((a) => K.V(a) && giusto(a))],
    ['la frase sui 18 anni', [...m.querySelectorAll('*')].find((x) => K.V(x) && re.test(x.textContent) && ![...x.children].some((y) => re.test(y.textContent)))],
    ['il pulsante «' + crea + '»', [...m.querySelectorAll('button')].find((x) => K.V(x) && x.textContent.trim() === crea)],
  ];
  const misura = (e) => {
    e.scrollIntoView({ block: 'center', inline: 'nearest' });
    // La prima riga: il rettangolo d'insieme di un link su due righe comprende
    // pezzi di frase che non sono suoi.
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
  };
  const difetti = [];
  for (const [nome, e] of cose) {
    if (!e) { if (nome === 'il titolo' || nome.startsWith('il pulsante')) difetti.push(nome + ' non c\'e\''); continue; }
    const perche = misura(e);
    if (perche) difetti.push(`${nome} ${perche}`);
  }
  return { misurati: cose.filter((x) => x[1]).map((x) => x[0]), difetti };
}

async function c20(b, ctx, v) {
  const g = 'C-20';
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri();
    await tab.dimensioni(375);
    await tab.vai(ctx.sito + ingresso(ctx));
    // Il giro fino al riepilogo lo controllano C-01 e C-05: qui, se non arriva
    // in fondo, lo si dice, invece di saltare in silenzio le verifiche.
    const giro = [];
    const arrivato = await unaRisposta(tab, giro, g);
    const invito = !!arrivato && await clicca(tab, 'Crea un account e salva');
    const { ok: aperto, valore: modulo } = invito
      ? await tab.attendiValore(MODULO_REGISTRAZIONE, (x) => !!x && x.titolo, REAZIONE) : { ok: false, valore: null };
    v.push({ gruppo: g, nome: 'dal riepilogo si apre il modulo «Crea un account», con il pulsante che crea l\'account', ok: aperto,
      extra: !arrivato ? 'il giro non arriva al riepilogo: ' + giro.filter((x) => !x.ok).map((x) => x.extra).join('; ')
        : !invito ? 'nel riepilogo non c\'e\' «Crea un account e salva» (§4.1)'
        : `nessuna finestra con il titolo «Crea un account» e il pulsante «${CREA}» (§4.2)` });
    if (!aperto) return;

    // Il link: nella finestra, visto, prima del pulsante, verso l'indirizzo
    // pulito e l'ancora. Il rosso dice quale di queste cose manca.
    const destinazione = CONDIZIONI.percorso + CONDIZIONI.ancora;
    const dove = (l) => `«${l.testo || l.href}» porta a ${l.href}`;
    const giusto = (l) => l.stessa && l.percorso === CONDIZIONI.percorso && l.ancora === CONDIZIONI.ancora;
    const dentro = modulo.link.filter((l) => l.dentro);
    const giusti = dentro.filter(giusto);
    const buono = giusti.find((l) => l.visto && l.prima);
    // Un link che parla delle condizioni o va verso l'avvertenza, ma non e' quello.
    const quasi = dentro.find((l) => !giusto(l) && (/condizioni/i.test(l.testo) || /avvertenza|condizioni/i.test(l.href || '')));
    const fuori = modulo.link.find((l) => !l.dentro && giusto(l));
    v.push({ gruppo: g, nome: `nel modulo, prima del pulsante, si vede un link a ${destinazione}`, ok: !!buono,
      extra: giusti.length && !giusti.some((l) => l.visto) ? `il link a ${destinazione} c'e' ma non si vede`
        : giusti.length ? `il link a ${destinazione} c'e', ma dopo il pulsante «${CREA}»`
        : quasi ? `${dove(quasi)}, non a ${destinazione}`
        : fuori ? `il link a ${destinazione} e' fuori dal modulo, nella pagina sotto la finestra`
        : `nel modulo nessun link verso ${destinazione}: ${dentro.map(dove).join('; ') || 'nessun link'}` });

    v.push({ gruppo: g, nome: 'e dice, prima del pulsante, che l\'account e\' per chi ha compiuto 18 anni', ok: DICIOTTO.test(modulo.prima),
      extra: `«18 anni» non si vede nel modulo prima del pulsante «${CREA}»; si vede: ${modulo.prima.slice(-240)}` });

    // Il link si segue, com'e' nella pagina: quello giusto se c'e', altrimenti
    // quello che gli somiglia. Solo dentro il sito: un link che esce non si
    // apre. In un'altra scheda: la pagina con le risposte resta dov'e'.
    const seguito = buono || giusti.find((l) => l.visto) || (quasi && quasi.visto ? quasi : null);
    let arrivo = null;
    if (seguito && seguito.stessa) {
      // `apri` aspetta il carico: la pagina e' disposta, e una lettura basta.
      try { arrivo = await (await c.apri(seguito.url)).valuta(ANCORA); } catch { arrivo = null; }
    }
    v.push({ gruppo: g, nome: 'seguito il link, l\'ancora c\'e\' e si vede: la sezione delle condizioni per l\'account',
      ok: !!arrivo && arrivo.trovata && arrivo.vista && arrivo.bersaglio && /condizioni/i.test(arrivo.testo || ''),
      extra: !seguito ? 'nel modulo nessun link visibile verso le condizioni da seguire'
        : !seguito.stessa ? `il link porta fuori dal sito (${seguito.href}): non seguito`
        : !arrivo ? 'la pagina del link non si apre'
        : !arrivo.id ? `il link non ha un'ancora: porta in cima a ${arrivo.percorso}`
        : !arrivo.trovata ? `l'ancora «${arrivo.id}» non c'e' in ${arrivo.percorso}`
        : !arrivo.vista ? `l'ancora «${arrivo.id}» c'e' in ${arrivo.percorso}, ma non si vede`
        : `l'ancora «${arrivo.id}» di ${arrivo.percorso} non e' la sezione delle condizioni: dice «${arrivo.testo}»` });

    // E si vede davvero? (R-ACC-76.) Per ultima: le misure scorrono la finestra.
    const visto = await tab.valuta(inPagina(moduloVisto, CREA, CONDIZIONI.percorso, CONDIZIONI.ancora, DICIOTTO.source));
    v.push({ gruppo: g, nome: MODULO_VISTO, ok: !visto.difetti.length,
      extra: `aperto dal riepilogo a 375 px: ${visto.difetti.join('; ')}` });
  } finally { await c.chiudi(); }
}

// --- E-01 e P-01: «com'è andata» e la riga d'avvio (P-74) --------------------------
//
// docs/esito-esame-progetto.md §3, §4 e il §10.1, che ha il contratto per
// esteso: il raccordo, gli agganci, le parti. Il banco guarda i numeri — una
// riga d'avvio nella copia e nel database del server con il suo uid, i conteggi
// della pagina contro le righe della copia, l'elenco dell'esito contro la
// risposta del 200 — e cerca i testi del §3.1 in quello che si vede, come C-20.
//
// **Due regimi per gruppo, con la lezione di P-51.** Il regime lo legge
// tests/test_interfaccia.py dal testo della pagina — `domandaEsito` e
// `salvaEsito` per E-01, `avvioProva` e `daInviare` per P-01 — e lo passa qui
// in `regimi`. Con il raccordo il gruppo gira per intero; senza, gira la parte
// `spento`, che pretende che la pagina non faccia niente di tutto questo con un
// account che ne avrebbe le condizioni. Una coppia a meta' e' rossa. Il regime
// senza raccordo esce con la merge di P-75.

const TITOLO_ESITO = /Com['’]è andato l['’]esame del ([^?\n]+)\?/;
const SALVATO_ESITO = 'Salvato. Lo usiamo soltanto in conteggi aggregati.';
const IL_TUO_ESAME = 'Il tuo esame';
const giornoMese = (g) => new Date(g + 'T12:00:00Z').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', timeZone: 'Europe/Rome' });
const giornoLungo = (g) => new Date(g + 'T12:00:00Z').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });
// Il giorno locale, come lo legge la pagina (§3.2): il banco e il browser sono sulla stessa macchina.
const oggiQui = () => E.isoLocale().slice(0, 10);

/**
 * Dove sta il titolo del riquadro, in quello che si vede: per ogni elemento piu'
 * interno che lo mostra, il giorno e se il posto e' quello giusto — dentro il
 * Percorso, fuori da una finestra modale, dal runner, dal riepilogo e dalla
 * revisione (§3.2: «in un posto solo, mai durante un'attivita', mai una finestra
 * modale, mai in un riepilogo»). Sotto un runner il Percorso puo' restare
 * disegnato, coperto: il controllo e' sul posto, non sull'occlusione.
 */
const RIQUADRO = js(`const re = new RegExp(${q(TITOLO_ESITO.source)});
  if (!re.test(document.body.innerText)) return [];
  const tutti = [...document.querySelectorAll('body *')].filter((e) => V(e) && re.test(e.innerText || ''));
  const interni = tutti.filter((e) => !tutti.some((f) => f !== e && e.contains(f)));
  return interni.map((e) => ({ giorno: (e.innerText.match(re) || [])[1] || null,
    posto: e.closest('[aria-modal="true"], dialog') ? 'una finestra modale'
      : e.closest('#r-fine, #c-fine, #sr-fine') ? 'un riepilogo' : e.closest('#quizrun, #cartrun, #segrun') ? 'un runner'
      : e.closest('#rivedi') ? 'la revisione' : !e.closest('#v-oggi, #v-home') ? 'fuori dal Percorso' : null }));`);
const fuoriPosto = (xs) => (xs || []).filter((x) => x.posto).map((x) => x.posto);

/** Le richieste a /v1/esito, di qualunque metodo: senza account, o con il server di prima, nessuna. */
const versoEsito = (tab) => tab.richieste.filter((r) => new URL(r.url).pathname === '/v1/esito');

/** La copia dell'account intera, letta dalla pagina: le righe e la coda. */
const COPIA = (chiave) => `(async () => {
  if (!(await indexedDB.databases()).some((d) => d.name === ${q('rg-account-' + chiave)})) return null;
  return new Promise((ok) => {
    const q = indexedDB.open(${q('rg-account-' + chiave)});
    q.onerror = () => ok(null);
    q.onsuccess = () => {
      const db = q.result;
      try {
        const t = db.transaction(['righe', 'meta']);
        const r = t.objectStore('righe').getAll(), c = t.objectStore('meta').get('coda');
        t.oncomplete = () => { db.close(); ok({ righe: r.result, coda: c.result || { daInviare: [], scartate: {} } }); };
        t.onerror = () => { db.close(); ok(null); };
      } catch { db.close(); ok(null); }
    };
  });
})()`;
/** Le righe in coda nella copia, divise come le divide daInviare() del raccordo. */
function inCoda(copia) {
  if (!copia) return null;
  const u = new Set(copia.coda.daInviare || []);
  const d = { risposte: 0, avvii: 0, altre: 0 };
  for (const r of copia.righe) if (u.has(String(r.uid))) { if (E.rigaDiRisposta(r)) d.risposte++; else if (r._t === 'a') d.avvii++; else d.altre++; }
  return d;
}
const tipo = (copia, t) => (copia ? copia.righe.filter((r) => r._t === t) : []);

/**
 * Le raccolte che E-01 e P-01 provano (P-88): esiti e previsioni accesi sul
 * server della corsia, su qualunque pagina, perche' quello che si prova e' la
 * pagina con la raccolta accesa — anche quella senza raccordo, che non deve
 * chiedere l'esito ne' scrivere righe d'avvio nemmeno quando il server le
 * accoglierebbe. «Il server di prima» (§6) e' la raccolta spenta davvero: il
 * server non dichiara `esiti` ne' `'a'` in `tipi_riga`, e rifiuta l'una e
 * l'altra. Fino a P-88 lo si imitava togliendo i due campi da `GET /v1/io`, e
 * il server dietro le accoglieva lo stesso.
 */
const ESITI_ACCESI = Object.freeze({ esiti_e_previsioni: true });
const ESITI_SPENTI = Object.freeze({ esiti_e_previsioni: false });
/**
 * La parte chiede le raccolte che prova, e guarda che il server della corsia le
 * abbia davvero (P-88): senza, una parte che prova il verso acceso girerebbe nel
 * verso spento — o al contrario — e una pagina senza raccordo, o C-10:avvio,
 * passerebbe verde provando una cosa sola. Falso, e un rosso, se non le ha.
 */
function perParte(ctx, v, g, chieste) {
  const ha = ctx.conRaccolte(chieste);
  const diverse = Object.entries(chieste).filter(([k, x]) => ha[k] !== x);
  if (diverse.length) v.push({ gruppo: g, nome: 'la parte ha sul server della corsia le raccolte che prova', ok: false,
    extra: `chieste ${JSON.stringify(chieste)}, il server ha ${JSON.stringify(ha)}` });
  return !diverse.length;
}

/** Entra, e se serve ricarica: l'account si riconosce da GET /v1/io (§3.1 del client). */
async function entraERicarica(tab, U) {
  if (!await dentro(tab, U)) return false;
  await tab.ricarica();
  return await tab.attendi(PRONTO, CARICO) && tab.attendi(nellaPagina('Account'), REAZIONE);
}

/** Il riquadro, aspettato finche' compare nel posto giusto con il giorno giusto. */
async function riquadroC(tab, giorno) {
  return tab.attendiValore(RIQUADRO, (xs) => xs.length > 0 && !fuoriPosto(xs).length && xs.every((x) => x.giorno === giornoMese(giorno)), REAZIONE);
}
/** Il riquadro che non c'e', guardato per tutta la finestra: un'assenza non ha un evento. */
async function riquadroNo(tab) {
  let visto = [];
  const ok = await maiPer(async () => { visto = await tab.valuta(RIQUADRO); return visto.length > 0; });
  return { ok, visto };
}

// I regimi: chi non li passa (una prova senza `regimi`) e' nel regime senza raccordo.
const regime = (ctx, chi) => (ctx.regimi && ctx.regimi[chi]) || 'spento';
function aMeta(v, g, chi, r) {
  v.push({ gruppo: g, nome: `la pagina dichiara il raccordo di ${chi} per intero, o niente`, ok: false,
    extra: `la pagina ne dichiara una parte (${r}): ${chi === 'esito' ? 'domandaEsito() e salvaEsito()' : 'avvioProva() e daInviare()'} vanno insieme (esito-esame-progetto §10.1)` });
}

async function e01(b, ctx, v, parte) {
  const r = regime(ctx, 'esito');
  if (r !== 'raccordo' && r !== 'spento') return aMeta(v, 'E-01', 'esito', r);
  const con = async (raccolte, fn, g) => { if (perParte(ctx, v, g, raccolte)) await fn(b, ctx, v, g); };
  if (r === 'spento') return con(ESITI_ACCESI, e01spento, 'E-01:spento');
  const vuole = (x) => !parte || parte === x;
  if (vuole('senza')) await con(ESITI_ACCESI, e01senza, 'E-01:senza');
  if (vuole('quando')) await con(ESITI_ACCESI, e01quando, 'E-01:quando');
  if (vuole('prima')) await con(ESITI_SPENTI, e01prima, 'E-01:prima');
  if (vuole('salvato')) await con(ESITI_ACCESI, e01salvato, 'E-01:salvato');
}

/** Senza raccordo: un account con la data di ieri, e niente di «com'è andata», con il server che lo raccoglierebbe. */
async function e01spento(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'e01s');
  ctx.dataEsame(U.email, E.addGiorni(oggiQui(), -1));
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra in un account con la data d\'esame di ieri', ok: await entraERicarica(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      const { ok, visto } = await riquadroNo(tab);
      w.push({ gruppo: g, nome: 'senza il raccordo la pagina non mostra il riquadro di «com\'è andata»', ok,
        extra: `la pagina non dichiara domandaEsito() e salvaEsito(), e mostra il riquadro: ${JSON.stringify(visto)}` });
      await clicca(tab, 'Account');
      const esame = await tab.attendi(pulsante(IL_TUO_ESAME), 1000);
      w.push({ gruppo: g, nome: 'senza il raccordo la finestra dell\'account non ha «Il tuo esame»', ok: !esame, extra: '«Il tuo esame» c\'e\'' });
      w.push({ gruppo: g, nome: 'senza il raccordo nessuna richiesta a /v1/esito', ok: !versoEsito(tab).length,
        extra: versoEsito(tab).map((x) => `${x.metodo} ${x.url}`).join('; ') });
    });
  } finally { await c.chiudi(); }
}

// R-ESITO-02: senza account non c'e' la domanda, non c'e' la voce, e nessuna richiesta.
async function e01senza(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'l\'app si apre senza account', ok: await tab.attendi(PRONTO, CARICO), extra: 'nessun [data-rotta-start] abilitato' });
      const viste = [];
      for (const x of VISTE) { await apriPorta(tab, x); await pausa(200); viste.push(...await tab.valuta(RIQUADRO)); }
      await apriPorta(tab, 'oggi');
      const testo = await unaRisposta(tab, [], g, '');
      w.push({ gruppo: g, nome: 'un\'attivita\' fino al riepilogo, senza account', ok: !!testo, extra: 'il runner o il riepilogo non si aprono' });
      viste.push(...await tab.valuta(RIQUADRO));
      await alPercorso(tab);
      await clicca(tab, 'Accedi');
      await tab.attendi(modaleVisibile, REAZIONE);
      const voce = await tab.valuta(pulsante(IL_TUO_ESAME));
      await esc(tab);
      const { ok, visto } = await riquadroNo(tab);
      w.push({ gruppo: g, nome: 'senza account il riquadro di «com\'è andata» non c\'e\'', ok: ok && !viste.length,
        extra: `si vede ${JSON.stringify([...viste, ...visto])}` });
      w.push({ gruppo: g, nome: 'senza account non c\'e\' «Il tuo esame»', ok: !voce, extra: 'nella finestra «Accedi» c\'e\' «Il tuo esame»' });
      w.push({ gruppo: g, nome: 'senza account nessuna richiesta a /v1/esito', ok: !versoEsito(tab).length,
        extra: versoEsito(tab).map((x) => `${x.metodo} ${x.url}`).join('; ') });
    });
  } finally { await c.chiudi(); }
}

// R-ESITO-03: quando, e dove. I casi uno per uno, con la pagina ricaricata.
async function e01quando(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'e01q');
  const oggi = oggiQui();
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      /** Un caso: la data e gli esiti scritti nel database, poi la pagina ricaricata. */
      const caso = async (nome, data, { esiti = [], ce }) => {
        ctx.dataEsame(U.email, data);
        ctx.togliEsiti(U.email);
        for (const [giorno, prova, esito] of esiti) ctx.esito(U.email, giorno, prova, esito);
        await tab.ricarica();
        const pronta = await tab.attendi(PRONTO, CARICO) && await tab.attendi(nellaPagina('Account'), REAZIONE);
        if (!pronta) return w.push({ gruppo: g, nome: `${nome}: la pagina si riapre nell'account`, ok: false, extra: await tab.valuta(inSchermata) });
        if (ce) {
          const { ok, valore } = await riquadroC(tab, data);
          return w.push({ gruppo: g, nome: `${nome}: il riquadro c'e', nel Percorso, con «${giornoMese(data)}»`, ok,
            extra: `si vede ${JSON.stringify(valore)}; atteso il titolo del §3.1 con «${giornoMese(data)}», dentro il Percorso` });
        }
        const { ok, visto } = await riquadroNo(tab);
        return w.push({ gruppo: g, nome: `${nome}: il riquadro non c'e'`, ok, extra: `si vede ${JSON.stringify(visto)}` });
      };
      await caso('la data d\'esame e\' oggi', oggi, { ce: true });
      // Il posto: le altre viste, il runner, il riepilogo.
      const altrove = [];
      for (const x of VISTE.filter((x) => x !== 'oggi')) { await apriPorta(tab, x); await pausa(200); altrove.push(...fuoriPosto(await tab.valuta(RIQUADRO)).map((p) => `${x}: ${p}`)); }
      await apriPorta(tab, 'oggi');
      await avviaPrima(tab);
      const risposto = await rispondiQuiz(tab, [], g, '');
      altrove.push(...fuoriPosto(await tab.valuta(RIQUADRO)).map((p) => `con il runner aperto: ${p}`));
      const riep = risposto && await chiudiQuiz(tab, [], g, '');
      altrove.push(...fuoriPosto(await tab.valuta(RIQUADRO)).map((p) => `nel riepilogo: ${p}`));
      w.push({ gruppo: g, nome: 'il riquadro sta in un posto solo: mai in un\'altra vista, nel runner, nel riepilogo o in una finestra modale',
        ok: !!riep && !altrove.length, extra: !riep ? 'l\'attivita\' non arriva al riepilogo' : altrove.join('; ') });
      await alPercorso(tab);
      await caso('la data d\'esame e\' di 90 giorni fa', E.addGiorni(oggi, -90), { ce: true });
      await caso('la data d\'esame e\' di 91 giorni fa', E.addGiorni(oggi, -91), {});
      await caso('la data d\'esame e\' domani', E.addGiorni(oggi, 1), {});
      await caso('senza data d\'esame', null, {});
      await clicca(tab, 'Account');
      const voce = await tab.attendi(pulsante(IL_TUO_ESAME), REAZIONE);
      w.push({ gruppo: g, nome: 'senza data, «Il tuo esame» c\'e\' nella finestra dell\'account', ok: voce, extra: `nella finestra: ${await tab.valuta(inSchermata)}` });
      await esc(tab);
      const d = E.addGiorni(oggi, -10);
      await caso('con un esito trenta giorni prima della data', d, { esiti: [[E.addGiorni(d, -30), 'base', 'superata']] });
      await caso('con un esito solo trentuno giorni prima della data', d, { esiti: [[E.addGiorni(d, -31), 'base', 'non_superata']], ce: true });
      // «Non chiedermelo piu'»: tre righe non_detto per quel giorno, e il riquadro non torna (§3.2).
      await clicca(tab, 'Non chiedermelo più');
      const scritte = await finche(() => ctx.esitiDi(U.email).filter((x) => x.giorno === d && x.esito === 'non_detto').length === 3, REAZIONE);
      w.push({ gruppo: g, nome: '«Non chiedermelo piu\'» scrive tre righe «non detto» per quel giorno', ok: scritte,
        extra: `sul server: ${JSON.stringify(ctx.esitiDi(U.email).map((x) => [x.giorno, x.prova, x.esito]))}` });
      await tab.ricarica();
      await tab.attendi(PRONTO, CARICO); await tab.attendi(nellaPagina('Account'), REAZIONE);
      const { ok, visto } = await riquadroNo(tab);
      w.push({ gruppo: g, nome: 'dopo «Non chiedermelo piu\'» il riquadro non torna', ok, extra: `si vede ${JSON.stringify(visto)}` });
    });
  } finally { await c.chiudi(); }
}

// R-ESITO-03, l'altra meta': un campo assente spegne la funzione (§3.7, punto 2).
// Il campo manca perche' la raccolta e' spenta davvero sul server (P-88): e' il
// server di prima visto dalla pagina, e in piu' rifiuta un esito con un 403.
async function e01prima(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'e01p');
  ctx.dataEsame(U.email, E.addGiorni(oggiQui(), -1));
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra, con la raccolta degli esiti spenta sul server, e la pagina si riapre', ok: await entraERicarica(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      const { ok, visto } = await riquadroNo(tab);
      w.push({ gruppo: g, nome: 'con la raccolta spenta — il server di prima, visto dalla pagina — il riquadro non c\'e\'', ok, extra: `GET /v1/io non porta esiti, e si vede ${JSON.stringify(visto)}` });
      await clicca(tab, 'Account');
      await tab.attendi(modaleVisibile, REAZIONE);
      w.push({ gruppo: g, nome: 'con il server di prima non c\'e\' «Il tuo esame»', ok: !await tab.valuta(pulsante(IL_TUO_ESAME)), extra: 'nella finestra dell\'account c\'e\' «Il tuo esame»' });
      w.push({ gruppo: g, nome: 'con il server di prima nessuna richiesta a /v1/esito', ok: !versoEsito(tab).length,
        extra: versoEsito(tab).map((x) => `${x.metodo} ${x.url}`).join('; ') });
    });
  } finally { await c.chiudi(); }
}

// R-ESITO-04: «Salvato» solo dopo il 200, e l'elenco e' quello della risposta.
async function e01salvato(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'e01v');
  const data = E.addGiorni(oggiQui(), -2);
  ctx.dataEsame(U.email, data);
  const c = await b.nuovoContesto();
  let lascia;
  const via = new Promise((r) => { lascia = r; });
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    let presa = false;
    // Il PUT resta fermo finche' il banco non lo lascia; poi la risposta del
    // server arriva con un elenco diverso da quello mandato: 3 errori al posto di 2.
    await tab.intercetta(ctx.api + '/v1/esito', async (req) => { if (req.method !== 'PUT') return null; presa = true; await via; return null; });
    await tab.intercetta(ctx.api + '/v1/esito', async (req, params) => {
      if (req.method !== 'PUT' || params.responseStatusCode !== 200) return null;
      const esiti = ctx.esitiDi(U.email).map((x) => (x.prova === 'base' ? { ...x, errori: 3 } : x));
      return finti(ctx, 200, { esiti });
    }, { fase: 'Response' });
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra in un account con la data d\'esame di due giorni fa', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      const { ok: c1, valore } = await riquadroC(tab, data);
      w.push({ gruppo: g, nome: 'il riquadro c\'e\'', ok: c1, extra: JSON.stringify(valore) });
      await clicca(tab, 'Rispondi');
      const modulo = await tab.attendi(js(`return !!document.querySelector('input[name="giorno"]') && V(document.querySelector('input[name="giorno"]'));`), REAZIONE);
      const giorno = modulo && await tab.valuta(js(`return document.querySelector('input[name="giorno"]').value;`));
      w.push({ gruppo: g, nome: '«Rispondi» apre il modulo, con la data d\'esame gia\' scritta', ok: modulo && giorno === data,
        extra: modulo ? `il giorno della prova scritta e' «${giorno}», la data d'esame ${data}` : 'nessun input[name="giorno"] visibile' });
      const scegli = (nome, valore) => tab.valuta(js(`const e = document.querySelector('input[name="${nome}"][value="${valore}"]'); if (!e) return false; e.click(); return e.checked;`));
      const errori = (nome, n) => tab.valuta(js(`const e = document.querySelector('input[name="${nome}"]'); if (!e) return false;
        e.value = ${q(String(n))}; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return true;`));
      const compilato = await scegli('esito-carteggio', 'superata') && await scegli('esito-base', 'superata') && await errori('errori-base', 2)
        && await scegli('esito-vela', 'non_sostenuta');
      w.push({ gruppo: g, nome: 'il modulo ha le scelte e gli errori del contratto', ok: compilato,
        extra: 'manca uno di input[name="esito-carteggio|esito-base|esito-vela"] con il suo value, o input[name="errori-base"]' });
      await clicca(tab, 'Salva');
      const ferma = await finche(() => presa, REAZIONE);
      w.push({ gruppo: g, nome: '«Salva» manda il PUT', ok: ferma, extra: 'nessun PUT /v1/esito' });
      let detto = false;
      const zitta = await maiPer(async () => (detto = await tab.valuta(testoVisibile('Salvato'))));
      w.push({ gruppo: g, nome: 'finche\' il server non ha risposto, niente «Salvato»', ok: zitta && !ctx.esitiDi(U.email).length,
        extra: detto ? 'con il PUT ancora fermo la pagina dice «Salvato»' : `il server ha gia' ${ctx.esitiDi(U.email).length} esiti` });
      lascia();
      const salvato = await tab.attendi(testoVisibile(SALVATO_ESITO), REAZIONE);
      w.push({ gruppo: g, nome: 'dopo il 200, «Salvato» con la frase del §3.1', ok: salvato, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      const dalla = `${giornoLungo(data)} · carteggio superata · quiz base superata, 3 errori · quiz vela non sostenuta`;
      const mandata = `${giornoLungo(data)} · carteggio superata · quiz base superata, 2 errori · quiz vela non sostenuta`;
      const vista = await tab.attendi(testoVisibile(dalla), REAZIONE);
      const sua = await tab.valuta(testoVisibile(mandata));
      w.push({ gruppo: g, nome: 'l\'elenco e\' quello della risposta del 200, non quello mandato', ok: vista && !sua,
        extra: sua ? `si legge «${mandata}», cioe' quello che la pagina ha mandato; la risposta diceva «${dalla}»` : `non si legge «${dalla}»; in schermata: ${await tab.valuta(inSchermata)}` });
      const sul = ctx.esitiDi(U.email).map((x) => [x.giorno, x.prova, x.esito, x.errori]);
      w.push({ gruppo: g, nome: 'sul server le prove mandate, e la pratica lasciata vuota non c\'e\'', ok: JSON.stringify(sul) === JSON.stringify([[data, 'carteggio', 'superata', null], [data, 'base', 'superata', 2], [data, 'vela', 'non_sostenuta', null]]),
        extra: JSON.stringify(sul) });
      await esc(tab);
      const { ok, visto } = await riquadroNo(tab);
      w.push({ gruppo: g, nome: 'detto l\'esito, il riquadro non c\'e\' piu\'', ok, extra: `si vede ${JSON.stringify(visto)}` });
    });
  } finally { lascia(); await c.chiudi(); }
}

// --- P-01: la riga d'avvio delle simulazioni -------------------------------------------

/** Quiz → Simula la prova → quale prova → Inizia. */
async function apriSim(tab, prova) {
  if (!await portaSim(tab)) return false;
  if (prova) {
    const scelta = await tab.attendi(js(`const e = document.querySelector('input[name="quiz-prova"][value="${prova}"]'); if (!e) return false; if (!e.checked) e.click(); return e.checked;`), REAZIONE);
    if (!scelta) return false;
  }
  if (!await tab.attendi(js(`const b = document.querySelector('#start'); return V(b) && !b.disabled;`), REAZIONE)) return false;
  await clic(tab, '#start');
  return tab.attendi(QUESITO_C, REAZIONE);
}
const QUESITO_C = js(`const t = document.querySelector('#r-text'); return V(t) && !!t.textContent.trim() && [...document.querySelectorAll('#r-ans .ans')].filter(V).length > 1;`);
const istante = (r) => (r && r.ts ? Date.parse(r.ts) : NaN);

async function p01(b, ctx, v, parte) {
  const r = regime(ctx, 'avvio');
  if (r !== 'raccordo' && r !== 'spento') return aMeta(v, 'P-01', 'avvio', r);
  const con = async (raccolte, fn, g) => { if (perParte(ctx, v, g, raccolte)) await fn(b, ctx, v, g); };
  if (r === 'spento') return con(ESITI_ACCESI, p01spento, 'P-01:spento');
  const vuole = (x) => !parte || parte === x;
  if (vuole('avvio')) await con(ESITI_ACCESI, p01avvio, 'P-01:avvio');
  if (vuole('senza')) await con(ESITI_ACCESI, p01senza, 'P-01:senza');
  // P-01:visto comincia accesa e spegne per il secondo account.
  if (vuole('visto')) await con(ESITI_ACCESI, p01visto, 'P-01:visto');
  if (vuole('conti')) await con(ESITI_ACCESI, p01conti, 'P-01:conti');
  if (vuole('prima')) await con(ESITI_SPENTI, p01prima, 'P-01:prima');
  if (vuole('errore')) await con(ESITI_ACCESI, p01errore, 'P-01:errore');
}

/** Senza raccordo: una simulazione completa con l'account, e nessuna riga d'avvio, con il server che la accoglierebbe. */
async function p01spento(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'p01s');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      w.push({ gruppo: g, nome: 'una simulazione si apre', ok: await apriSim(tab, null), extra: 'Quiz → Simula la prova → Inizia non apre un quesito' });
      const risposto = await rispondiQuiz(tab, [], g, '', { sim: true }) && await chiudiQuiz(tab, [], g, '', { sim: true });
      w.push({ gruppo: g, nome: 'una risposta e la consegna', ok: !!risposto, extra: 'la simulazione non arriva al riepilogo' });
      const sul = await finche(() => ctx.righeServer(U.email).some((x) => x._t === 'q'), CARICO);
      const copia = await tab.valuta(COPIA(U.chiave));
      const avvii = [...tipo(copia, 'a'), ...ctx.righeServer(U.email).filter((x) => x._t === 'a')];
      w.push({ gruppo: g, nome: 'senza il raccordo la pagina non scrive righe d\'avvio, ne\' nella copia ne\' sul server', ok: sul && !avvii.length,
        extra: !sul ? 'la risposta non arriva sul server' : `la pagina non dichiara avvioProva() e daInviare(), e scrive ${avvii.length} righe _t:'a'` });
    });
  } finally { await c.chiudi(); }
}

// R-PREV-05: a Inizia di ogni fase una riga d'avvio, prima della prima risposta.
async function p01avvio(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'p01a');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      w.push({ gruppo: g, nome: '«Base e vela» si apre con il primo quesito', ok: await apriSim(tab, 'entrambe'),
        extra: 'Quiz → Simula la prova → input[name="quiz-prova"][value="entrambe"] → Inizia non apre un quesito' });
      // Prima della prima risposta: la copia ha gia' la riga d'avvio, e nessuna risposta.
      const c0 = await tab.valuta(COPIA(U.chiave));
      const a0 = tipo(c0, 'a');
      w.push({ gruppo: g, nome: 'a Inizia, prima della prima risposta, una riga d\'avvio nella copia', ok: a0.length === 1 && !tipo(c0, 'q').length,
        extra: `nella copia ${a0.length} righe d'avvio e ${tipo(c0, 'q').length} risposte` });
      const a = a0[0];
      w.push({ gruppo: g, nome: 'la riga d\'avvio ha l\'uid della prova piu\' «:a», la fase base e la scelta «entrambe»',
        ok: a.uid === `${a.sim_uid}:a` && a.kind === 'base' && a.prova === 'entrambe' && E.validaRiga(a) === null, extra: JSON.stringify(a).slice(0, 300) });
      w.push({ gruppo: g, nome: 'regola-semplice-1 senza prove prima: zero su zero', ok: JSON.stringify(a.stime['regola-semplice-1']) === JSON.stringify({ superate: 0, n: 0, prove: [] }),
        extra: JSON.stringify(a.stime) });
      const risposto = await rispondiQuiz(tab, [], g, '', { sim: true });
      const c1 = await tab.valuta(COPIA(U.chiave));
      const q1 = tipo(c1, 'q');
      w.push({ gruppo: g, nome: 'la risposta ha il sim_uid della riga d\'avvio, e viene dopo', ok: !!risposto && q1.length === 1 && q1[0].sim_uid === a.sim_uid && istante(a) <= istante(q1[0]) && tipo(c1, 'a').length === 1,
        extra: `risposte ${q1.length}, sim_uid ${q1[0] && q1[0].sim_uid} contro ${a.sim_uid}, avvio ${a.ts} risposta ${q1[0] && q1[0].ts}, righe d'avvio ${tipo(c1, 'a').length}` });
      w.push({ gruppo: g, nome: 'la consegna della base apre il suo riepilogo', ok: await chiudiQuiz(tab, [], g, '', { sim: true }), extra: 'nessun riepilogo' });
      const c2 = await tab.valuta(COPIA(U.chiave));
      const s1 = tipo(c2, 's').find((x) => x.uid === a.sim_uid);
      w.push({ gruppo: g, nome: 'alla consegna la riga della prova ha l\'uid della prova, e nessuna riga d\'avvio in piu\'', ok: !!s1 && tipo(c2, 'a').length === 1,
        extra: `righe s ${JSON.stringify(tipo(c2, 's').map((x) => x.uid))}, righe d'avvio ${tipo(c2, 'a').length}` });
      // La vela: la sua riga d'avvio nasce con lei, dopo la consegna della base (§4.1).
      const vela = await clic(tab, '[data-fase]') && await tab.attendi(QUESITO_C, REAZIONE);
      const c3 = await tab.valuta(COPIA(U.chiave));
      const av = tipo(c3, 'a').find((x) => x.uid !== a.uid);
      w.push({ gruppo: g, nome: 'la fase vela ha la sua riga d\'avvio, scritta dopo la consegna della base', ok: vela && tipo(c3, 'a').length === 2 && !!av
        && av.kind === 'vela' && av.prova === 'entrambe' && av.sim_uid !== a.sim_uid && av.uid === `${av.sim_uid}:a` && istante(av) >= istante(s1),
        extra: vela ? `righe d'avvio ${JSON.stringify(tipo(c3, 'a').map((x) => [x.uid, x.kind, x.prova, x.ts]))}, la base consegnata ${s1 && s1.ts}` : '[data-fase] non apre la vela' });
      await chiudiQuiz(tab, [], g, '', { sim: true });
      const sul = await finche(() => ctx.righeServer(U.email).filter((x) => x._t === 'a').length === 2, CARICO);
      const server = ctx.righeServer(U.email).filter((x) => x._t === 'a').map((x) => x.uid).sort();
      w.push({ gruppo: g, nome: 'sul server le due righe d\'avvio, con lo stesso uid', ok: sul && JSON.stringify(server) === JSON.stringify([a.uid, av.uid].sort()),
        extra: `sul server ${JSON.stringify(server)}` });
      // Una seconda simulazione base: la regola conta la prima, consegnata prima di lei.
      await clic(tab, '[data-ciclo="ritorno"]');
      w.push({ gruppo: g, nome: 'una seconda simulazione base si apre', ok: await apriSim(tab, 'base'), extra: 'non si apre' });
      const c4 = await tab.valuta(COPIA(U.chiave));
      const a3 = tipo(c4, 'a').find((x) => x.uid !== a.uid && x.uid !== av.uid);
      const attesa = { superate: s1.passed === 1 ? 1 : 0, n: 1, prove: [a.sim_uid] };
      w.push({ gruppo: g, nome: 'la seconda conta la prima simulazione base fra le prove, e nessun\'altra', ok: !!a3 && JSON.stringify(a3.stime['regola-semplice-1']) === JSON.stringify(attesa),
        extra: a3 ? `regola-semplice-1 ${JSON.stringify(a3.stime['regola-semplice-1'])}, attesa ${JSON.stringify(attesa)}` : 'nessuna terza riga d\'avvio' });
    });
  } finally { await c.chiudi(); }
}

// R-PREV-05, senza account: nessuna riga d'avvio, nemmeno portata nell'account alla registrazione.
async function p01senza(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'l\'app si apre senza account', ok: await tab.attendi(PRONTO, CARICO), extra: 'nessun [data-rotta-start] abilitato' });
      w.push({ gruppo: g, nome: 'una simulazione base si apre senza account', ok: await apriSim(tab, 'base'), extra: 'non si apre' });
      const ok = await rispondiQuiz(tab, [], g, '', { sim: true }) && await chiudiQuiz(tab, [], g, '', { sim: true });
      w.push({ gruppo: g, nome: 'una risposta e la consegna', ok: !!ok, extra: 'nessun riepilogo' });
      const email = `p01-${++serie}@esempio.it`;
      w.push({ gruppo: g, nome: 'dal riepilogo si crea l\'account', ok: await registraDalRiepilogo(tab, email), extra: 'il modulo non si apre' });
      const salvate = await tab.attendi(testoRe(SALVATE), CARICO);
      const righe = ctx.righeServer(email);
      w.push({ gruppo: g, nome: 'le righe della pagina arrivano nell\'account, e fra loro nessuna riga d\'avvio', ok: salvate && righe.some((x) => x._t === 'q') && !righe.some((x) => x._t === 'a'),
        extra: `sul server ${JSON.stringify(righe.map((x) => x._t))}` });
    });
  } finally { await c.chiudi(); }
}

// R-PREV-06: la previsione non si vede. La stessa simulazione, consegnata vuota,
// con il server che accoglie la riga d'avvio e con quello di prima.
const PREVISIONE = /\d+\s*%|probabilit|previsio|preved|\bstim[ae]\b|regola|possibilit|chance|percentual/i;
// La frase che il §7.2 del ridisegno impone al risultato di ogni simulazione — e
// che la pagina vera scrive gia' — nega la previsione: non la dice. Si toglie
// prima di cercare le parole da previsione, e solo lei (P-82): «non una
// previsione» in un'altra frase resta un rosso.
const NEGAZIONE = "Esito di questa prova, non una previsione dell'esame.";
const senzaNegazione = (t) => String(t || '').split(NEGAZIONE).join('');
const normale = (t) => String(t || '').replace(/\d+/g, '#').replace(/\b(minut|second|domand|rispost|error)[oaie]\b/gi, '$1*').replace(/\s+/g, ' ').trim();
const TESTI_SIM = {
  // Nel ridisegno la preparazione e' una superficie sua, comune (§5.2).
  prep: js(`const v = [...document.querySelectorAll('[data-preparazione], #v-quiz')].find(V); return v ? v.innerText : null;`),
  // Domanda e risposte si tolgono dalla piu' lunga alla piu' corta (P-87): in
  // base-993 «in basso.» sta dentro «in alto e in basso.», e tolta per prima
  // lasciava «in alto e», un rosso che non diceva niente della pagina. Nella
  // banca le risposte contenute in un'altra dello stesso quesito sono 20 quesiti.
  // E la nota che il ridisegno scrive prima di rispondere (#r-nbp) e' del
  // quesito, come la domanda: un oscurato la porta in una sola delle due
  // simulazioni, e con lei «regolamento», che la ricerca delle parole da
  // previsione prendeva per «regola» (fermo di P-81, 20 ottobre 2026: 5 rossi
  // su 24 giri sulla pagina di riferimento).
  runner: js(`const r = document.querySelector('#quizrun'); if (!V(r)) return null; let t = r.innerText;
    const pezzi = [document.querySelector('#r-text'), document.querySelector('#r-nbp'), ...document.querySelectorAll('#r-ans .ans')]
      .filter((e) => e && e.innerText).map((e) => e.innerText).sort((a, b) => b.length - a.length);
    for (const p of pezzi) t = t.split(p).join('');
    return t;`),
  riepilogo: js(`const f = document.querySelector('#r-fine'); return V(f) ? f.innerText : null;`),
};
async function testiSim(tab) {
  const out = {};
  if (!await portaSim(tab)) return null;
  await tab.attendi(js(`const e = document.querySelector('input[name="quiz-prova"][value="base"]'); if (!e) return false; if (!e.checked) e.click(); return e.checked;`), REAZIONE);
  if (!await tab.attendi(js(`const b = document.querySelector('#start'); return V(b) && !b.disabled;`), REAZIONE)) return null;
  out.prep = await tab.valuta(TESTI_SIM.prep);
  await clic(tab, '#start');
  if (!await tab.attendi(QUESITO_C, REAZIONE)) return null;
  out.runner = await tab.valuta(TESTI_SIM.runner);
  await clic(tab, '#r-close');
  if (!await tab.attendi(visibile('[data-consegna="si"]'), REAZIONE)) return null;
  await clic(tab, '[data-consegna="si"]');
  if (!await tab.attendi(RIEPILOGO, REAZIONE)) return null;
  out.riepilogo = await tab.valuta(TESTI_SIM.riepilogo);
  return out;
}
async function p01visto(b, ctx, v, g) {
  const A = await nuovoAccount(ctx, 'p01v'), B = await nuovoAccount(ctx, 'p01w');
  const ca = await b.nuovoContesto(), cb = await b.nuovoContesto();
  try {
    const ta = await ca.apri(ctx.sito + ingresso(ctx)), tb = await cb.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      // Il primo con la raccolta accesa; poi spenta davvero sul server, e il
      // secondo entra e si ricarica: la sua pagina ha visto solo quella.
      const entraA = await dentro(ta, A);
      const con = entraA ? await testiSim(ta) : null;
      ctx.conRaccolte(ESITI_SPENTI);
      const entraB = await entraERicarica(tb, B);
      w.push({ gruppo: g, nome: 'si entra in due account, il secondo con la raccolta spenta sul server, come il server di prima', ok: entraA && entraB, extra: 'un accesso non riesce' });
      const senza = entraB ? await testiSim(tb) : null;
      w.push({ gruppo: g, nome: 'la simulazione si apre e si consegna vuota, nei due casi', ok: !!con && !!senza && Object.values(con).every((x) => x !== null) && Object.values(senza).every((x) => x !== null),
        extra: `con la riga d'avvio ${JSON.stringify(con)}; senza ${JSON.stringify(senza)}` });
      const avviiA = tipo(await ta.valuta(COPIA(A.chiave)), 'a').length, avviiB = tipo(await tb.valuta(COPIA(B.chiave)), 'a').length;
      w.push({ gruppo: g, nome: 'premessa: una riga d\'avvio con il server, nessuna con quello di prima', ok: avviiA === 1 && avviiB === 0,
        extra: `righe d'avvio: ${avviiA} e ${avviiB}` });
      for (const k of ['prep', 'runner', 'riepilogo']) {
        const dove = { prep: 'la preparazione', runner: 'il runner', riepilogo: 'il riepilogo' }[k];
        const parola = (senzaNegazione(con[k]).match(PREVISIONE) || [])[0];
        w.push({ gruppo: g, nome: `${dove} di una simulazione e' lo stesso con e senza riga d'avvio, e non dice una previsione`, ok: normale(con[k]) === normale(senza[k]) && !parola,
          extra: parola ? `si legge «${parola}»: ${normale(con[k]).slice(0, 200)}` : `con la riga d'avvio «${normale(con[k]).slice(0, 200)}», senza «${normale(senza[k]).slice(0, 200)}»` });
      }
    });
  } finally { await ca.chiudi(); await cb.chiudi(); }
}

// R-PREV-07: una riga d'avvio non e' una risposta, nei conteggi che la pagina scrive.
const PROVE_AVVIATE = js(`const m = document.body.innerText.match(/prove avviate (\\d+)/); return m ? Number(m[1]) : null;`);
const RESTA_N = js(`const m = document.body.innerText.match(/(\\d+) rispost[ae] non (?:sono|è) sul server/); return m ? Number(m[1]) : null;`);
async function p01conti(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'p01c');
  const c = await b.nuovoContesto();
  let blocca = false;
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    // L'invio delle righe fallisce come senza rete: le righe restano in coda.
    await tab.intercetta(ctx.api + '/v1/righe', async (req) => (blocca && req.method === 'POST' ? { fallisci: 'InternetDisconnected' } : null));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      blocca = true;
      w.push({ gruppo: g, nome: 'una simulazione si apre con l\'invio che fallisce', ok: await apriSim(tab, 'base'), extra: 'non si apre' });
      const c0 = await tab.valuta(COPIA(U.chiave));
      w.push({ gruppo: g, nome: 'premessa: in coda c\'e\' la riga d\'avvio e nessuna risposta', ok: JSON.stringify(inCoda(c0)) === JSON.stringify({ risposte: 0, avvii: 1, altre: 0 }),
        extra: JSON.stringify(inCoda(c0)) });
      // La prova abbandonata: la pagina si ricarica con il solo avvio in coda (§8, caso 11).
      await tab.ricarica();
      w.push({ gruppo: g, nome: 'la pagina si riapre nell\'account', ok: await tab.attendi(PRONTO, CARICO) && await tab.attendi(nellaPagina('Account'), REAZIONE), extra: await tab.valuta(inSchermata) });
      let detto = null;
      const zitta = await maiPer(async () => { detto = await tab.valuta(DA_INVIARE) ?? await tab.valuta(fraseVista(FRASI_SERVER)); return detto !== null; });
      w.push({ gruppo: g, nome: 'con il solo avvio in coda, niente «N risposte da inviare» e niente «sul server»', ok: zitta,
        extra: `si legge ${typeof detto === 'number' ? `«${detto} risposte da inviare»` : `«${detto}»`}` });
      const c1 = await tab.valuta(COPIA(U.chiave));
      await apriVista(tab, 'info');
      const pa = await tab.attendiValore(PROVE_AVVIATE, (n) => n === tipo(c1, 'a').length, REAZIONE);
      const rq = await tab.valuta(QUIZ_IN_INFO);
      w.push({ gruppo: g, nome: 'in Info «prove avviate» e\' il numero delle righe d\'avvio, e le risposte ai quiz non lo contano', ok: pa.ok && rq === 0,
        extra: `Info dice prove avviate ${pa.valore}, risposte ai quiz ${rq}; la copia ha ${tipo(c1, 'a').length} righe d'avvio e 0 risposte` });
      await apriPorta(tab, 'oggi');
      // Info e' un pannello sopra la pagina (ridisegno §6.3): si chiude prima di
      // aprire l'account. Fino a P-89 no, e sul ridisegno «Account» ed «Esci» non
      // si premevano: la verifica qui sotto era verde senza che l'uscita fosse mai
      // partita, e l'hanno trovato le rotture portate dalla pagina di prima.
      if (await tab.valuta(modaleVisibile)) { await esc(tab); await tab.attendi(`!(${modaleVisibile})`, REAZIONE); }
      const premuto = await clicca(tab, 'Account') && await tab.attendi(modaleVisibile, REAZIONE) && await clicca(tab, 'Esci');
      // Una riga d'avvio non inviata blocca l'uscita come una risposta (R-ACC-46), e non e' «N risposte».
      let n0 = null, uscito = false;
      const ferma = await maiPer(async () => { n0 = await tab.valuta(RESTA_N); uscito = await tab.valuta(nellaPagina('Accedi')); return n0 !== null || uscito; });
      const copia = !!copieAccount(await c.conservato(ctx.sito, tab)).length;
      w.push({ gruppo: g, nome: 'con il solo avvio in coda l\'uscita si blocca, e non dice «N risposte»', ok: premuto && ferma && copia,
        extra: !premuto ? '«Esci» non si preme: l\'uscita non e\' partita, e il blocco non si puo\' dire'
          : n0 !== null ? `si legge «${n0} risposte non sono sul server», e in coda non ce n'e' nessuna` : `con l'avvio in coda la pagina esce: ${uscito ? '«Accedi» nell\'intestazione' : ''} ${copia ? '' : 'la copia non c\'e\' piu\''}` });
      await esc(tab);
      // Una risposta: il numero e' quello delle risposte in coda, non delle righe.
      await avviaPrima(tab);
      const una = await rispondiQuiz(tab, [], g, '') && await chiudiQuiz(tab, [], g, '');
      const c2 = await tab.valuta(COPIA(U.chiave));
      const d2 = inCoda(c2);
      const n = await tab.attendiValore(DA_INVIARE, (x) => d2 && x === d2.risposte, REAZIONE);
      w.push({ gruppo: g, nome: 'con una risposta e l\'avvio in coda, «N risposte da inviare» conta la risposta', ok: !!una && d2 && d2.risposte === 1 && d2.avvii === 1 && n.ok,
        extra: `la pagina dice ${n.valore}; in coda ${JSON.stringify(d2)}` });
      await alPercorso(tab);
      await clicca(tab, 'Account'); await tab.attendi(modaleVisibile, REAZIONE); await clicca(tab, 'Esci');
      const n1 = await tab.attendiValore(RESTA_N, (x) => x === d2.risposte, CARICO);
      w.push({ gruppo: g, nome: 'e l\'uscita, bloccata, dice le risposte e non le righe', ok: n1.ok, extra: `si legge «${n1.valore} risposte non sono sul server», in coda ${JSON.stringify(d2)}` });
    });
  } finally { await c.chiudi(); }
}

// R-PREV-09: con un server che non dichiara 'a', nessuna riga d'avvio, e l'uscita non si blocca.
async function p01prima(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'p01p');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      // La raccolta spenta davvero (P-88): tipi_riga senza 'a', e il server scarta una riga d'avvio.
      w.push({ gruppo: g, nome: 'si entra, con la raccolta delle previsioni spenta sul server, e la pagina si riapre', ok: await entraERicarica(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      w.push({ gruppo: g, nome: 'una simulazione base si apre', ok: await apriSim(tab, 'base'), extra: 'non si apre' });
      const ok = await rispondiQuiz(tab, [], g, '', { sim: true }) && await chiudiQuiz(tab, [], g, '', { sim: true });
      w.push({ gruppo: g, nome: 'una risposta e la consegna', ok: !!ok, extra: 'nessun riepilogo' });
      const sul = await finche(() => ctx.righeServer(U.email).some((x) => x._t === 's'), CARICO);
      const copia = await tab.valuta(COPIA(U.chiave));
      const avvii = [...tipo(copia, 'a'), ...ctx.righeServer(U.email).filter((x) => x._t === 'a')];
      w.push({ gruppo: g, nome: 'con il server di prima nessuna riga d\'avvio, ne\' nella copia ne\' sul server', ok: sul && !avvii.length,
        extra: !sul ? 'la prova non arriva sul server' : `${avvii.length} righe _t:'a' con un server che non le dichiara` });
      await alPercorso(tab);
      await clicca(tab, 'Account'); await tab.attendi(modaleVisibile, REAZIONE); await clicca(tab, 'Esci');
      const uscito = await tab.attendi(nellaPagina('Accedi'), USCITA) && await finche(async () => !copieAccount(await c.conservato(ctx.sito, tab)).length, REAZIONE);
      w.push({ gruppo: g, nome: 'e l\'uscita non si blocca', ok: uscito, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
    });
  } finally { await c.chiudi(); }
}

// R-PREV-10: un metodo che lancia non ferma la prova. /engine.js servito con
// regola-semplice-1 che lancia: la riga d'avvio c'e', con `errore`.
const METODO_SANO = "    calcola(righe, kind, ts) {\n      if (!AVVIO.kind.includes(kind))";
const METODO_ROTTO = "    calcola(righe, kind, ts) {\n      if (kind) throw new Error('rotto dal banco');\n      if (!AVVIO.kind.includes(kind))";
async function p01errore(b, ctx, v, g) {
  const motore = readFileSync(join(SITE, 'engine.js'), 'utf8');
  if (!motore.includes(METODO_SANO)) {
    return v.push({ gruppo: g, nome: 'il banco sa far lanciare regola-semplice-1', ok: false, extra: 'il testo di calcola() in site/engine.js e\' cambiato: aggiorna METODO_SANO' });
  }
  ctx.sostituisci('/engine.js', motore.replace(METODO_SANO, METODO_ROTTO));
  const U = await nuovoAccount(ctx, 'p01e');
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      w.push({ gruppo: g, nome: 'con un metodo che lancia la simulazione si apre lo stesso', ok: await apriSim(tab, 'base'), extra: 'il runner non mostra un quesito' });
      const ok = await finche(async () => tipo(await tab.valuta(COPIA(U.chiave)), 'a').length === 1, REAZIONE);
      const a = tipo(await tab.valuta(COPIA(U.chiave)), 'a')[0];
      w.push({ gruppo: g, nome: 'la riga d\'avvio c\'e\', con l\'errore del metodo e senza la sua stima', ok: ok && !!a && /regola-semplice-1: rotto dal banco/.test(a.errore || '') && !('regola-semplice-1' in a.stime),
        extra: a ? JSON.stringify(a).slice(0, 300) : 'nessuna riga d\'avvio nella copia' });
    });
  } finally { await c.chiudi(); }
}

// --- N-01: i tragitti del ridisegno (P-82, docs/ridisegno-progetto.md §9 e §10.1, E) ---
//
// Il banco del ridisegno (tests/ridisegno.mjs) prova la navigazione come
// funzione: un indirizzo entra, una destinazione esce. Qui la stessa cosa si
// guarda in un browser vero, come la vive chi studia: dopo il primo ingresso il
// documento resta lo stesso — la stessa finestra JavaScript, nessun documento
// nuovo chiesto alla rete —, le risposte della pagina restano le stesse
// attraverso le sezioni e i testi legali, Indietro, Avanti e Chiudi riportano
// allo stesso punto con scorrimento e fuoco, niente di chi studia finisce in un
// indirizzo, nella cronologia o in uno storage, l'invito sta nei suoi tre posti
// e in nessun quarto, la registrazione porta nell'account l'insieme intero delle
// righe, i cinque stati si leggono con le parole di Q-STATI, i gesti nuovi —
// tag, segnalibro, ricerca, segnalazione, scelte — fanno quello che dicono con
// il server che si ha davanti. E i 108 tragitti del §9, uno per stato e compito.
//
// Il gruppo si applica a una pagina nel regime del ridisegno, e da P-89 una
// pagina che non lo e' e' rossa qui, con il regime letto. Una pagina con le due
// dichiarazioni e senza il grafo e' rossa dal primo passo.
//
// I tocchi si contano uno per gesto voluto: un gesto ripetuto perche' la pagina
// e' sorda per 200 ms dopo un cambio di schermata (specifica §7.5) e' lo stesso
// tocco. Ogni conteggio si dice con il titolo d'arrivo, mai da solo.

const TESTO_VISTO = (sel) => js(`const e = [...document.querySelectorAll(${q(sel)})].find(V); return e ? e.innerText.replace(/\\s+/g, ' ').trim() : null;`);
/** Dove si e': la sezione in vista, il segmento selezionato, l'indirizzo, la cronologia. */
const DOVE = js(`const v = [...document.querySelectorAll('main .view, .view')].find(V);
  const s = [...document.querySelectorAll('[data-segmento]')].find((b) => b.getAttribute('aria-selected') === 'true');
  const sezione = v ? v.id.replace('v-', '') : null;
  return { sezione, segmento: sezione === 'allenati' && s ? s.dataset.segmento : null, url: location.pathname + location.search + location.hash,
    stato: history.state, lunghezza: history.length, scroll: Math.round(scrollY),
    fuoco: !!document.activeElement && document.activeElement.hasAttribute('data-banco-porta'),
    attivo: document.activeElement ? (document.activeElement.innerText || document.activeElement.tagName).trim().slice(0, 40) : null };`);
const DOC_ATTUALE = `({ segno: window.__rgDoc || null, origine: performance.timeOrigin })`;
const INVITO = ['Vuoi conservare le attività di questa pagina?', 'Conserva le risposte.', 'Conserva questa prova', 'Crea un account e salva'];
const NON_PROMETTERE = 'Da queste risposte possiamo proporti da dove iniziare';
const PAROLE_STATI = ['mai visti', 'da rifare', 'da confermare', 'recuperati', 'acquisiti'];
const CHIAVI_STATI = ['mai_visto', 'debole', 'incerto', 'sistemato', 'ok'];
const PARAMETRI_URL = ['sezione', 'segmento', 'attivita', 'fase', 'banca', 'temi', 'voci', 'n'];
const QUIZ_TUTTI = JSON.parse(readFileSync(join(SITE, 'dati', 'quiz.json'), 'utf8'));
const QUIZ_BASE = QUIZ_TUTTI.filter((x) => x.k === 'base');

/**
 * Un tocco su un elemento visibile: lo si porta nello schermo, prende il fuoco
 * come lo prende un pulsante toccato, e si preme. `porta` lo segna come la porta
 * da cui si parte, con lo scorrimento di quel momento: il ritorno deve rendere
 * il fuoco a lei e lo scorrimento di allora (§3.3). `testo` sceglie fra piu'
 * elementi lo stesso selettore.
 */
async function tocca(tab, T, sel, { porta = false, testo = null } = {}) {
  const ok = await tab.valuta(js(`const tutti = [...document.querySelectorAll(${q(sel)})].filter(V);
    const e = ${testo ? `tutti.find((x) => x.textContent.replace(/\\s+/g, ' ').trim() === ${q(testo)})` : 'tutti[0]'};
    if (!e || e.disabled) return false;
    e.scrollIntoView({ block: 'center' });
    ${porta ? `for (const x of document.querySelectorAll('[data-banco-porta]')) x.removeAttribute('data-banco-porta');
    e.setAttribute('data-banco-porta', ''); window.__bancoScroll = Math.round(scrollY);` : ''}
    e.focus({ preventScroll: true }); e.click(); return true;`));
  if (ok && T) T.n++;
  return ok;
}

/** Un gesto che deve avere un effetto: si ripete finche' l'effetto arriva, e conta una volta. */
async function gesto(tab, T, sel, effetto, { testo = null, volte = 20 } = {}) {
  for (let i = 0; i < volte; i++) {
    if (!await tocca(tab, null, sel, { testo })) { await pausa(60); continue; }
    if (await tab.attendi(effetto, 300)) { if (T) T.n++; return true; }
  }
  return false;
}

const quesitoVisto = (tab) => tab.attendiValore(QUESITO, quesitoDellaBanca, REAZIONE);
/** La posizione «i / n» del runner: n e' la lista che la pagina ha aperto. */
const QUANTI_RUN = js(`const p = document.querySelector('#r-pos'); const m = p && p.textContent.match(/(\\d+)\\s*\\/\\s*(\\d+)/); return m ? [Number(m[1]), Number(m[2])] : null;`);

/** QB e QA (§9): n risposte, n−1 Avanti; poi Consegna e conferma (QB) o Termina (QA); Rivedi, Chiudi, ritorno. */
async function trattoQuiz(tab, T, { sim, fino = 'ritorno', risposte = null } = {}) {
  const pos = await tab.attendiValore(QUANTI_RUN, Boolean, REAZIONE);
  if (!pos.ok) return { ok: false, perche: 'il runner non dice la posizione «i / n»' };
  const n = pos.valore[1], k = risposte ?? n;
  for (let i = 0; i < k; i++) {
    // Nella simulazione nessuna correzione: la risposta scelta si dice con
    // aria-pressed (o compare «Avanti»); negli allenamenti si accende l'esatta.
    const effetto = sim ? js(`return V(document.querySelector('#r-next')) || [...document.querySelectorAll('#r-ans .ans')].some((b) => b.getAttribute('aria-pressed') === 'true')`)
      : js(`return !!document.querySelector('#r-ans .ans.ok')`);
    if (!await gesto(tab, T, '#r-ans .ans', effetto)) return { ok: false, perche: `la risposta ${i + 1} non ha effetto` };
    if (i + 1 < k && !await gesto(tab, T, '#r-next', js(`return document.querySelector('#r-pos').textContent.trim().startsWith('${i + 2} /') && !document.querySelector('#r-ans .ans.ok')`))) return { ok: false, perche: `«Avanti» dopo la risposta ${i + 1} non porta al quesito dopo` };
  }
  if (sim) {
    if (!await gesto(tab, T, '#r-close', visibile('[data-consegna="si"]'))) return { ok: false, perche: '«Consegna la prova» non chiede conferma' };
    if (!await gesto(tab, T, '[data-consegna="si"]', RIEPILOGO)) return { ok: false, perche: 'la conferma non apre il risultato' };
  } else if (!await gesto(tab, T, '#r-close', RIEPILOGO)) return { ok: false, perche: '«Termina l\'attività» non apre il risultato' };
  if (fino === 'risultato') return { ok: true, n };
  return dopoRisultato(tab, T, n);
}

/** Rivedi → Chiudi → ritorno, dal risultato dei quiz. */
async function dopoRisultato(tab, T, n) {
  if (!await gesto(tab, T, '[data-ciclo="risposte"]', js(`return V(document.querySelector('#rv-body'))`))) return { ok: false, perche: '«Rivedi le risposte» non apre la revisione' };
  if (!await gesto(tab, T, '#rv-close', js(`return !V(document.querySelector('#rv-body')) && V(document.querySelector('#r-fine h1'))`))) return { ok: false, perche: 'Chiudi la revisione non torna al risultato' };
  if (!await gesto(tab, T, '[data-ciclo="ritorno"]', js(`return !V(document.querySelector('#r-fine'))`))) return { ok: false, perche: 'il ritorno non chiude il risultato' };
  return { ok: true, n };
}

/** CC (§9): n−1 Successivo, consegna a due tocchi, n giudizi, Concludi, Rivedi, Chiudi, ritorno. */
async function trattoCarta(tab, T) {
  const { ok, valore } = await tab.attendiValore(js(`const p = document.querySelector('#c-pos'); const m = p && p.textContent.match(/(\\d+) di (\\d+)/); return m ? Number(m[2]) : null;`), Boolean, REAZIONE);
  if (!ok) return { ok: false, perche: 'il runner della carta non dice «Esercizio i di n»' };
  const n = valore;
  for (let i = 1; i < n; i++) {
    if (!await gesto(tab, T, '#c-next', js(`return document.querySelector('#c-pos').textContent.includes('Esercizio ${i + 1} di')`))) return { ok: false, perche: `«Successivo» non porta all'esercizio ${i + 1}` };
  }
  if (!await gesto(tab, T, '#c-consegna', js(`return document.querySelector('#c-consegna').textContent.includes('Sicuro') || V(document.querySelector('#c-fine'))`))) return { ok: false, perche: 'il primo tocco di consegna non chiede conferma' };
  if (!await gesto(tab, T, '#c-consegna', visibile('#c-fine'))) return { ok: false, perche: 'il secondo tocco non apre il confronto' };
  for (let k = 0; k < n; k++) {
    if (!await gesto(tab, T, `#c-fine [data-cs="${k}"][data-ok="1"]`, premuto(`#c-fine [data-cs="${k}"][data-ok="1"]`))) return { ok: false, perche: `il giudizio ${k + 1} non si da'` };
  }
  if (!await gesto(tab, T, '#c-salva', js(`return /Esiti autovalutati/.test(document.querySelector('#c-fine').innerText)`))) return { ok: false, perche: '«Concludi» non apre il risultato della carta' };
  if (!await gesto(tab, T, '[data-crivedi]', js(`return V(document.querySelector('#rv-body'))`))) return { ok: false, perche: '«Rivedi i risultati» non apre la revisione' };
  if (!await gesto(tab, T, '#rv-close', js(`return !V(document.querySelector('#rv-body'))`))) return { ok: false, perche: 'Chiudi la revisione non torna al risultato' };
  if (!await gesto(tab, T, '[data-cfine="ritorno"]', js(`return !V(document.querySelector('#cartrun'))`))) return { ok: false, perche: 'il ritorno non chiude la carta' };
  return { ok: true, n };
}

/** SS (§9): n risposte, n−1 Avanti, «Vedi il risultato», ritorno. */
async function trattoSegnali(tab, T) {
  const { ok, valore } = await tab.attendiValore(js(`const p = document.querySelector('#sr-pos'); const m = p && p.textContent.match(/(\\d+)\\s*\\/\\s*(\\d+)/); return m ? Number(m[2]) : null;`), Boolean, REAZIONE);
  if (!ok) return { ok: false, perche: 'la partita non dice «i / n»' };
  const n = valore;
  for (let i = 0; i < n; i++) {
    if (!await gesto(tab, T, '#sr-ans button', visibile('#sr-next'))) return { ok: false, perche: `la risposta ${i + 1} non ha effetto` };
    const ultimo = i + 1 === n;
    if (!await gesto(tab, T, '#sr-next', ultimo ? visibile('#sr-fine') : js(`return document.querySelector('#sr-pos').textContent.trim().startsWith('${i + 2} /')`))) return { ok: false, perche: ultimo ? '«Vedi il risultato» non apre il risultato' : `«Avanti» dopo la risposta ${i + 1} non porta alla situazione dopo` };
  }
  if (!await gesto(tab, T, '#sr-basta', js(`return !V(document.querySelector('#segrun'))`))) return { ok: false, perche: 'il ritorno non chiude la partita' };
  return { ok: true, n };
}

// I dodici compiti del §9, per stato. Ogni compito parte dalla Home dello
// stato e restituisce l'arrivo — il titolo e i tocchi per arrivarci —, il
// totale fino al ritorno, e dove il ritorno ha portato. AC, il ciclo della
// registrazione a modulo aperto, e' di quattro tocchi qui: «Email», «Password»,
// «Crea l'account e salva», «Salta per ora». Il §9 ne conta cinque, con un
// «Chiudi» dopo «Salta per ora» che il client non ha — il modulo si chiude alla
// creazione (account-client-progetto §4.3), e C-04 e C-07 lo tengono fermo —:
// e' uno scostamento dichiarato nel §10.1 del progetto, non una scelta del banco.
const AC = 4;
const COMPITI = {
  '01': 'Simulare il quiz base', '02': 'Quiz su un argomento', '03': 'Giro delle tecniche', '04': 'A tappeto',
  '05': 'Prova di carteggio', '06': 'Segnali', '07': 'Registrarsi dal risultato', '08': 'Registrarsi dalla Home',
  '09': 'Privacy', '10': 'Condizioni', '11': 'Tornare indietro', '12': 'Trovare i progressi',
};
const TEMA_02 = 'METEOROLOGIA';

/** Torna alla Home per il compito dopo: non conta, e' la partenza. */
async function allaHome(tab) {
  await tocca(tab, null, '#barra [data-v="home"]');
  await tab.attendi(js(`return V(document.querySelector('#v-home'))`), REAZIONE);
  await tab.valuta('scrollTo(0, 0); document.activeElement && document.activeElement.blur(); true');
}

/** Il modulo di registrazione gia' aperto: AC, quattro tocchi; restituisce l'email o null. */
async function cicloAC(tab, T, ctx) {
  const email = `n01-${++serie}@esempio.it`;
  if (!await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE)) return null;
  await tab.valuta(js(`${campo('Email')}.focus(); return true;`)); T.n++;
  await imposta(tab, 'Email', email);
  await tab.valuta(js(`${campo('Password')}.focus(); return true;`)); T.n++;
  await imposta(tab, 'Password', PASSWORD);
  if (!await tocca(tab, T, '[data-account="crea"]')) return null;
  const salvate = await tab.attendi(testoRe(SALVATE), CARICO);
  if (!salvate || !await tab.attendi(pulsante(testi(ctx).saltaData), REAZIONE)) return null;
  if (!await tocca(tab, T, '[data-account="torna"]', { testo: testi(ctx).saltaData })) return null;
  await tab.attendi(`!(${modaleVisibile})`, REAZIONE);
  return email;
}

const LEGALE_VISTO = js(`const l = document.querySelector('#legale'); if (!V(l)) return null; const h = l.querySelector('h1'); return { titolo: h ? h.innerText.trim() : null, url: location.pathname + location.hash,
  ancora: !!l.querySelector('#condizioni') && V(l.querySelector('#condizioni')) };`);

/** Un compito: { arrivo: {titolo, tocchi}, totale, ritorno: {...}, n } o { errore }. */
async function compito(tab, ctx, stato, c) {
  const T = { n: 0 };
  const arrivo = async (titolo, ok) => (ok ? { titolo, tocchi: T.n } : null);
  if (c === '01' || (c === '07' && stato === 'HA')) {
    if (!await tocca(tab, T, '#v-home [data-modo="sim"][data-prova="base"]', { porta: true })) return { errore: '«Simula il quiz base» non c\'e\' nella Home' };
    if (!await tab.attendi(js(`return V(document.querySelector('[data-preparazione] #start'))`), REAZIONE)) return { errore: 'la preparazione della simulazione non si apre' };
    await tocca(tab, T, '[data-preparazione] #start');
    const a = await arrivo('la prima domanda della simulazione', (await quesitoVisto(tab)).ok);
    if (!a) return { errore: 'Inizia non apre un quesito della banca' };
    if (c === '07') {
      const r = await trattoQuiz(tab, T, { sim: true, fino: 'risultato' });
      if (!r.ok) return { arrivo: a, errore: r.perche };
      // Gia' registrato: Account → Chiudi → ritorno (§9, 07 HA).
      if (!await tocca(tab, T, '#conto-porta')) return { arrivo: a, errore: '«Account» non si apre dal risultato' };
      if (!await tab.attendi(modaleVisibile, REAZIONE) || !await tocca(tab, T, '[data-account="torna"]')) return { arrivo: a, errore: 'il pannello dell\'account non si chiude' };
      if (!await tab.attendi(RIEPILOGO, REAZIONE)) return { arrivo: a, errore: 'chiuso l\'account, il risultato non c\'e\' piu\'' };
      const d = await dopoRisultato(tab, T, r.n);
      return d.ok ? { arrivo: a, totale: T.n, n: r.n } : { arrivo: a, errore: d.perche };
    }
    const r = await trattoQuiz(tab, T, { sim: true });
    return r.ok ? { arrivo: a, totale: T.n, n: r.n } : { arrivo: a, errore: r.perche };
  }
  if (c === '02') {
    await tocca(tab, T, '#barra [data-v="allenati"]');
    if (!await tab.attendi(visibile('[data-tema]'), REAZIONE)) return { errore: 'in Allenati · Quiz gli argomenti non ci sono (A-1: i temi nel segmento Quiz)' };
    if (!await tocca(tab, T, '[data-tema]', { porta: true, testo: TEMA_02 })) return { errore: `nessun argomento «${TEMA_02}»` };
    if (!await tab.attendi(js(`return V(document.querySelector('[data-preparazione] #start'))`), REAZIONE)) return { errore: 'la preparazione dell\'argomento non si apre' };
    await tocca(tab, T, '[data-preparazione] #start');
    const a = await arrivo(`la prima domanda di ${TEMA_02}`, (await quesitoVisto(tab)).ok);
    if (!a) return { errore: 'Inizia non apre un quesito della banca' };
    const r = await trattoQuiz(tab, T, { sim: false });
    return r.ok ? { arrivo: a, totale: T.n, n: r.n } : { arrivo: a, errore: r.perche };
  }
  if (c === '03' || c === '04') {
    await tocca(tab, T, '#barra [data-v="allenati"]');
    await tocca(tab, T, '[data-segmento="carteggio"]');
    if (!await tocca(tab, T, '[data-cporta="esercizi"]', { porta: true })) return { errore: '«Esercizi su carta» non c\'e\' nel Carteggio' };
    if (c === '04' && !await tocca(tab, T, 'input[name="c-modo"][value="tappeto"]')) return { errore: '«A tappeto» non si sceglie' };
    if (!await tocca(tab, T, '#c-esercizi')) return { errore: 'Inizia gli esercizi non c\'e\'' };
    const { ok } = await tab.attendiValore(js(`const t = document.querySelector('#c-testo'); return V(t) ? t.textContent.trim() : null;`), (x) => CARTEGGIO.has(x), REAZIONE);
    const a = await arrivo('il primo esercizio sulla carta', ok);
    if (!a) return { errore: `Inizia non apre un esercizio della banca: ${await tab.valuta(inSchermata)}` };
    const r = await trattoCarta(tab, T);
    return r.ok ? { arrivo: a, totale: T.n, n: r.n } : { arrivo: a, errore: r.perche };
  }
  if (c === '05') {
    await tocca(tab, T, '#barra [data-v="esame"]');
    if (!await tocca(tab, T, '#v-esame [data-cporta="prova"]', { porta: true })) return { errore: '«Prova di carteggio» non c\'e\' in Esame' };
    if (!await tocca(tab, T, '#c-start')) return { errore: 'Inizia la prova non c\'e\'' };
    const { ok } = await tab.attendiValore(js(`const t = document.querySelector('#c-testo'); return V(t) ? t.textContent.trim() : null;`), (x) => CARTEGGIO.has(x), REAZIONE);
    const a = await arrivo('il primo esercizio della prova', ok);
    if (!a) return { errore: 'Inizia non apre un esercizio della banca' };
    const r = await trattoCarta(tab, T);
    return r.ok ? { arrivo: a, totale: T.n, n: r.n } : { arrivo: a, errore: r.perche };
  }
  if (c === '06') {
    await tocca(tab, T, '#barra [data-v="allenati"]');
    await tocca(tab, T, '[data-segmento="segnali"]');
    if (!await tocca(tab, T, '#s-start', { porta: true })) return { errore: 'Inizia non c\'e\' nei Segnali' };
    const a = await arrivo('la prima situazione dei Segnali', await tab.attendi(visibile('#sr-ans button'), REAZIONE));
    if (!a) return { errore: 'la partita non si apre' };
    const r = await trattoSegnali(tab, T);
    return r.ok ? { arrivo: a, totale: T.n, n: r.n } : { arrivo: a, errore: r.perche };
  }
  if (c === '07') {
    await tocca(tab, T, '#v-home [data-modo="sim"][data-prova="base"]', { porta: true });
    await tab.attendi(js(`return V(document.querySelector('[data-preparazione] #start'))`), REAZIONE);
    await tocca(tab, T, '[data-preparazione] #start');
    if (!(await quesitoVisto(tab)).ok) return { errore: 'Inizia non apre un quesito della banca' };
    const r = await trattoQuiz(tab, T, { sim: true, fino: 'risultato' });
    if (!r.ok) return { errore: r.perche };
    if (!await tocca(tab, T, '#r-fine [data-account="registra"]')) return { errore: 'nel risultato della simulazione non c\'e\' «Crea un account e salva»' };
    const a = await arrivo('il modulo «Crea un account»', await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE));
    if (!a) return { errore: 'il modulo non si apre' };
    const email = await cicloAC(tab, T, ctx);
    if (!email) return { arrivo: a, errore: 'la registrazione non arriva a «salvate» e a «' + testi(ctx).saltaData + '»' };
    if (!await tab.attendi(RIEPILOGO, REAZIONE)) return { arrivo: a, errore: 'chiuso il modulo, il risultato non c\'e\' piu\' (§6.2: «salvataggio riuscito → stesso risultato»)' };
    if (!await gesto(tab, T, '[data-ciclo="ritorno"]', js(`return !V(document.querySelector('#r-fine'))`))) return { arrivo: a, errore: 'il risultato non si chiude' };
    return { arrivo: a, totale: T.n, n: r.n, email };
  }
  if (c === '08') {
    if (stato === 'HA') {
      await tocca(tab, T, '#conto-porta', { porta: true });
      const a = await arrivo('il Profilo, «Il tuo account»', await tab.attendi(js(`const m = M(); return m !== document && /Il tuo account/.test(m.innerText);`), REAZIONE));
      if (!a) return { errore: 'l\'avatar non apre il Profilo' };
      await tocca(tab, T, '[data-account="torna"]');
      return { arrivo: a, totale: T.n };
    }
    if (stato === 'H1') await tocca(tab, T, '#invito-home [data-account="registra"]', { porta: true });
    else { await tocca(tab, T, '#conto-porta', { porta: true }); await tab.attendi(modaleVisibile, REAZIONE); await tocca(tab, T, '[data-account="crea-da-accedi"]'); }
    const a = await arrivo('il modulo «Crea un account»', await tab.attendi(js(`return V(${campo('Email')}) && /Crea un account/.test(M().innerText);`), REAZIONE));
    if (!a) return { errore: 'il modulo non si apre' };
    const email = await cicloAC(tab, T, ctx);
    return email ? { arrivo: a, totale: T.n, email } : { arrivo: a, errore: 'la registrazione non arriva a «salvate»' };
  }
  if (c === '09' || c === '10') {
    const href = c === '09' ? '/privacy' : '/avvertenza#condizioni';
    if (!await tocca(tab, T, `#v-home a[href="${href}"], footer a[href="${href}"]`, { porta: true })) return { errore: `nessun link ${href} in vista dalla Home` };
    const { ok, valore } = await tab.attendiValore(LEGALE_VISTO, (x) => !!x && !!x.titolo && x.url === href && (c === '09' || x.ancora), REAZIONE);
    const a = await arrivo(`${valore && valore.titolo} sopra la Home, su ${href}`, ok);
    if (!a) return { errore: `il testo legale non si apre sopra la Home: ${JSON.stringify(valore)}` };
    await tocca(tab, T, '[data-legale="chiudi"]');
    return { arrivo: a, totale: T.n };
  }
  if (c === '11') {
    await tocca(tab, T, '#v-home [data-rotta-start]', { porta: true });
    await tab.attendi(js(`return V(document.querySelector('[data-preparazione] #start'))`), REAZIONE);
    await tocca(tab, T, '[data-preparazione] #start');
    const a = await arrivo('la prima domanda', (await quesitoVisto(tab)).ok);
    if (!a) return { errore: 'Inizia non apre un quesito della banca' };
    if (!await gesto(tab, T, '#r-ans .ans', js(`return !!document.querySelector('#r-ans .ans.ok')`))) return { arrivo: a, errore: 'la risposta non ha effetto' };
    if (!await gesto(tab, T, '#r-close', RIEPILOGO)) return { arrivo: a, errore: '«Termina» non apre il risultato parziale' };
    if (!await gesto(tab, T, '[data-ciclo="ritorno"]', js(`return !V(document.querySelector('#r-fine'))`))) return { arrivo: a, errore: 'il ritorno non chiude il risultato' };
    return { arrivo: a, totale: T.n };
  }
  if (c === '12') {
    await tocca(tab, T, '#barra [data-v="progressi"]', { porta: true });
    const atteso = stato === 'H0' ? 'Nessuna risposta in questa pagina.' : stato === 'H1' ? 'Le attività di questa pagina' : 'mai visti';
    const a = await arrivo(`Progressi: «${atteso}»`, await tab.attendi(js(`const p = document.querySelector('#v-progressi'); return V(p) && p.innerText.includes(${q(atteso)});`), REAZIONE));
    if (!a) return { errore: `Progressi non dice «${atteso}»: ${await tab.valuta(TESTO_VISTO('#v-progressi'))}` };
    await tocca(tab, T, '#barra [data-v="home"]');
    return { arrivo: a, totale: T.n };
  }
  return { errore: 'compito sconosciuto' };
}

/** I conteggi del §9, per stato e compito, con n la lista che la pagina ha aperto. */
function attesi(stato, c, n) {
  const QB = 2 * n + 4, QA = 2 * n + 3, CC = 2 * n + 5, SS = 2 * n + 1;
  switch (c) {
    case '01': return { arrivo: 2, totale: 2 + QB };
    case '02': return { arrivo: 3, totale: 3 + QA };
    case '03': return { arrivo: 4, totale: 4 + CC };
    case '04': return { arrivo: 5, totale: 5 + CC };
    case '05': return { arrivo: 3, totale: 3 + CC };
    case '06': return { arrivo: 3, totale: 3 + SS };
    case '07': return stato === 'HA' ? { arrivo: 2, totale: 2 + QB + 2 } : { arrivo: 2 + n + (n - 1) + 2 + 1, totale: 2 + n + (n - 1) + 2 + 1 + AC + 1 };
    case '08': return stato === 'HA' ? { arrivo: 1, totale: 2 } : stato === 'H1' ? { arrivo: 1, totale: 1 + AC } : { arrivo: 2, totale: 2 + AC };
    case '09': case '10': return { arrivo: 1, totale: 2 };
    case '11': return { arrivo: 2, totale: 5 };
    case '12': return { arrivo: 1, totale: 2 };
    default: return null;
  }
}

/** Dove il ritorno deve portare (§9, colonna «Ritorno»): sezione, segmento, e se il fuoco torna alla porta. */
function ritornoAtteso(stato, c) {
  switch (c) {
    case '01': case '11': return { sezione: 'home', fuoco: true };
    case '02': return { sezione: 'allenati', segmento: 'quiz', fuoco: true, scroll: true };
    case '03': case '04': return { sezione: 'allenati', segmento: 'carteggio', fuoco: true };
    case '05': return { sezione: 'esame', fuoco: true };
    case '06': return { sezione: 'allenati', segmento: 'segnali', fuoco: true };
    case '07': return { sezione: 'home', conto: true, fuoco: stato === 'HA' };
    case '08': return { sezione: 'home', conto: true, fuoco: stato === 'HA' };
    case '09': case '10': return { sezione: 'home', fuoco: true, url: '/' };
    case '12': return { sezione: 'home' };
    default: return null;
  }
}

/** Lo stato di partenza: H0 una pagina nuova; H1 con una risposta della pagina; HA dentro un account. */
async function preparaStato(b, ctx, stato) {
  const c = await b.nuovoContesto();
  const tab = await c.apri(null);
  await tab.dimensioni(375, 640);
  await tab.vai(ctx.sito + '/');
  await tab.attendi(PRONTO, CARICO);
  if (stato === 'H1') {
    await avviaPrima(tab);
    await rispondiQuiz(tab, [], 'N-01', '');
    await chiudiQuiz(tab, [], 'N-01', '');
    await clic(tab, '[data-ciclo="ritorno"]');
    await tab.attendi(visibile('#invito-home'), REAZIONE);
  }
  if (stato === 'HA') {
    const K = await nuovoAccount(ctx, 'n01ha');
    if (!await dentro(tab, K)) throw new Error('lo stato HA non si prepara: l\'accesso non riesce');
  }
  await allaHome(tab);
  return { c, tab };
}

/** Un giro per stato: i dodici compiti, ognuno per le tre persone del §9 che lo condividono. */
async function n01tragitti(b, ctx, v, stato, g = 'N-01') {
  const ids = (c) => ['Z', 'F', 'R'].map((p) => `${p}-${stato}-${c}`).join(' · ');
  // 07 e 08 registrano: ognuno parte da un contesto suo, nello stato giusto.
  // 12 per primo: Progressi deve trovare lo stato com'e', prima delle attivita' degli altri compiti.
  const gruppi = [['12', '01', '02', '03', '04', '05', '06', '09', '10', '11'], ['07'], ['08']];
  for (const lista of gruppi) {
    let x;
    try { x = await preparaStato(b, ctx, stato); } catch (e) { v.push({ gruppo: g, nome: `${stato}: lo stato di partenza si prepara`, ok: false, extra: e.message }); continue; }
    try {
      for (const c of lista) {
        const r = await compito(x.tab, ctx, stato, c);
        const att = attesi(stato, c, r.n ?? 0);
        const nome = `${ids(c)} (${COMPITI[c]})`;
        if (r.errore || !r.arrivo) {
          v.push({ gruppo: g, nome: `${nome}: si arriva, e i tocchi sono quelli del §9`, ok: false, extra: r.errore || 'nessun arrivo' });
          v.push({ gruppo: g, nome: `${nome}: il ritorno riporta alla porta`, ok: false, extra: 'il giro si e\' fermato prima' });
          await allaHome(x.tab);
          continue;
        }
        const tocchiOk = r.arrivo.tocchi === att.arrivo && r.totale === att.totale;
        v.push({ gruppo: g, nome: `${nome}: arrivo «${r.arrivo.titolo}» in ${att.arrivo} tocchi attesi e ${r.arrivo.tocchi} osservati, ${att.totale} attesi e ${r.totale} osservati fino al ritorno${r.n ? ` (n = ${r.n})` : ''}`, ok: tocchiOk,
          extra: `osservati: ${r.arrivo.tocchi} all'arrivo, ${r.totale} fino al ritorno; attesi ${att.arrivo} e ${att.totale}` });
        const ra = ritornoAtteso(stato, c);
        const sc = await x.tab.valuta('window.__bancoScroll || 0');
        const { ok: rOk, valore: dove } = await x.tab.attendiValore(DOVE, (d) => !!d && d.sezione === ra.sezione && (!ra.segmento || d.segmento === ra.segmento)
          && (!ra.url || d.url === ra.url) && (!ra.fuoco || d.fuoco) && (!ra.scroll || Math.abs(d.scroll - sc) <= 2), REAZIONE);
        const fuoco = !ra.fuoco || (dove && dove.fuoco);
        const scroll = !ra.scroll || (dove && Math.abs(dove.scroll - sc) <= 2);
        const conto = !ra.conto || await x.tab.valuta(nellaPagina('Account'));
        v.push({ gruppo: g, nome: `${nome}: il ritorno riporta a ${ra.sezione}${ra.segmento ? ' · ' + ra.segmento : ''}${ra.fuoco ? ', con il fuoco sulla porta' : ''}${ra.scroll ? ' e lo scorrimento di prima' : ''}${ra.conto ? ', dentro l\'account' : ''}`,
          ok: rOk && fuoco && scroll && conto,
          extra: `dove: ${JSON.stringify(dove && { sezione: dove.sezione, segmento: dove.segmento, url: dove.url, scroll: dove.scroll, fuoco: dove.fuoco, attivo: dove.attivo })}${conto ? '' : '; l\'avatar non dice «Account»'}` });
        await allaHome(x.tab);
      }
    } finally { await x.c.chiudi(); }
  }
}

/** Il segno del documento: una proprieta' della finestra JavaScript, che un documento nuovo non ha. */
async function segnaDocumento(tab) {
  const segno = `doc-${++serie}`;
  await tab.valuta(`window.__rgDoc = ${q(segno)}; true`);
  return { segno, origine: await tab.valuta('performance.timeOrigin') };
}
const documenti = (tab) => tab.richieste.filter((r) => r.tipo === 'Document').map((r) => r.url);
async function stessoDocumento(tab, d, n0) {
  const ora = await tab.valuta(DOC_ATTUALE).catch(() => ({}));
  const nuovi = documenti(tab).slice(n0);
  return { ok: ora.segno === d.segno && ora.origine === d.origine && !nuovi.length,
    extra: ora.segno !== d.segno ? `la finestra JavaScript e' un'altra: il documento si e' ricaricato${nuovi.length ? ` (${nuovi.join(', ')})` : ''}` : `documenti chiesti dopo il primo ingresso: ${nuovi.join(', ')}` };
}
/** Le risposte della pagina, scaricate da Info: gli uid, per confrontarli prima e dopo. */
async function uidPagina(tab, c) {
  // Dal Profilo, che si apre sopra ogni superficie (§5.2): l'alias «info» della
  // tabella C porta alla Home, e chiuderebbe il risultato che si sta guardando.
  await tocca(tab, null, '#conto-porta');
  await tab.attendi(modaleVisibile, REAZIONE);
  await tocca(tab, null, '[aria-modal="true"] [data-profilo="info"]');
  const n = c.scaricati().length;
  if (!await clic(tab, '[data-dati="scarica"]')) return null;
  const f = await scaricato(c, n);
  await esc(tab);
  await tab.attendi(`!(${modaleVisibile})`, REAZIONE);
  return f ? uidDi(f.dati) : null;
}

/** Il documento resta lo stesso: sezioni, segmenti, Profilo, legali, runner; uid e lavoro identici; il timer non si ferma. */
async function n01documento(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(null);
    await tab.dimensioni(375, 640);
    await tab.vai(ctx.sito + '/');
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'la pagina si apre su / con la Home del ridisegno', ok: await tab.attendi(PRONTO, CARICO) && await tab.valuta(js(`return V(document.querySelector('#v-home'))`)),
        extra: `in schermata: ${await tab.valuta(inSchermata)} — le due dichiarazioni senza il grafo non bastano` });
      const n0 = documenti(tab).length;
      const d = await segnaDocumento(tab);
      w.push({ gruppo: g, nome: 'il primo ingresso chiede un documento solo', ok: n0 === 1, extra: `documenti: ${documenti(tab).join(', ')}` });
      w.push({ gruppo: g, nome: 'una risposta nella pagina', ok: !!await unaRisposta(tab, [], g) && await clic(tab, '[data-ciclo="ritorno"]'), extra: 'il primo giro non arriva al riepilogo' });
      const prima = await uidPagina(tab, c);
      w.push({ gruppo: g, nome: 'le risposte della pagina si scaricano da Info', ok: !!prima && prima.size >= 1, extra: `uid: ${prima ? prima.size : 'nessun file'}` });
      const giro = [['#barra [data-v="allenati"]', 'allenati'], ['[data-segmento="carteggio"]', 'allenati'], ['[data-segmento="segnali"]', 'allenati'],
        ['[data-segmento="quiz"]', 'allenati'], ['#barra [data-v="esame"]', 'esame'], ['#barra [data-v="progressi"]', 'progressi'], ['#marchio', 'home']];
      const mancati = [];
      for (const [sel, sez] of giro) {
        await tocca(tab, null, sel);
        if (!(await tab.attendiValore(DOVE, (x) => x && x.sezione === sez, REAZIONE)).ok) mancati.push(`${sel} → ${sez}`);
      }
      w.push({ gruppo: g, nome: 'la barra, i segmenti e il marchio portano alle sezioni', ok: !mancati.length, extra: 'non arrivano: ' + mancati.join(', ') });
      const s1 = await stessoDocumento(tab, d, n0);
      w.push({ gruppo: g, nome: 'attraverso sezioni e segmenti il documento resta lo stesso: la stessa finestra, nessun documento nuovo', ...s1 });
      // Profilo, poi un testo legale sopra il Profilo, poi sopra la Home.
      await tocca(tab, null, '#conto-porta');
      const profilo = await tab.attendi(modaleVisibile, REAZIONE);
      await tocca(tab, null, '[aria-modal="true"] a[href="/privacy"]');
      const legale = await tab.attendiValore(LEGALE_VISTO, (x) => !!x && x.titolo === 'Privacy' && x.url === '/privacy', REAZIONE);
      w.push({ gruppo: g, nome: 'il testo della privacy si apre sopra il Profilo, nel documento, su /privacy', ok: profilo && legale.ok, extra: JSON.stringify(legale.valore) });
      await tocca(tab, null, '[data-legale="chiudi"]');
      const sotto = await tab.attendi(js(`return !V(document.querySelector('#legale')) && V(${campo('Email')}) && location.pathname === '/'`), REAZIONE);
      w.push({ gruppo: g, nome: 'Chiudi riporta al Profilo com\'era, e l\'indirizzo torna quello di prima', ok: sotto, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      await esc(tab);
      await tocca(tab, null, 'footer a[href="/avvertenza#condizioni"]');
      const cond = await tab.attendiValore(LEGALE_VISTO, (x) => !!x && x.ancora && x.url === '/avvertenza#condizioni', REAZIONE);
      w.push({ gruppo: g, nome: 'le condizioni si aprono sopra la Home, con l\'ancora in vista', ok: cond.ok, extra: JSON.stringify(cond.valore) });
      await tocca(tab, null, '[data-legale="chiudi"]');
      await tab.attendi(js(`return !V(document.querySelector('#legale'))`), REAZIONE);
      const s2 = await stessoDocumento(tab, d, n0);
      w.push({ gruppo: g, nome: 'attraverso il Profilo e i testi legali il documento resta lo stesso', ...s2 });
      const dopo = await uidPagina(tab, c);
      w.push({ gruppo: g, nome: 'e le risposte della pagina sono le stesse, uid per uid', ok: !!dopo && stessi(prima, dopo), extra: `prima ${prima && prima.size}, dopo ${dopo && dopo.size}` });
      // La simulazione: il timer continua sopra il Profilo e sopra un testo legale.
      if (!await portaSim(tab) || !await tab.attendi(visibile('[data-preparazione] #start'), REAZIONE)) { w.push({ gruppo: g, nome: 'la simulazione si prepara', ok: false, extra: 'nessuna preparazione' }); return; }
      await clic(tab, '[data-preparazione] #start');
      const q0 = await quesitoVisto(tab);
      const t0 = await tab.attendiValore(TESTO_VISTO('#r-time'), (x) => /\d+:\d\d/.test(x || ''), REAZIONE);
      w.push({ gruppo: g, nome: 'la simulazione si apre con il suo timer', ok: q0.ok && t0.ok, extra: `timer ${t0.valore}` });
      // Qualche secondo prima di aprire i pannelli: un timer che riparte da capo si vede solo se e' gia' sceso.
      await pausa(3000);
      const s0 = await tab.valuta(js(`return document.querySelector('#r-time').textContent`)), d0 = Date.now();
      await tocca(tab, null, '#conto-porta');
      await tab.attendi(modaleVisibile, REAZIONE);
      await tocca(tab, null, '[aria-modal="true"] a[href="/privacy"]');
      await tab.attendi(LEGALE_VISTO, REAZIONE);
      await pausa(2300);
      const sec = (t) => { const [m, s] = String(t).split(':').map(Number); return m * 60 + s; };
      const t1 = await tab.valuta(js(`return document.querySelector('#r-time').textContent`)), trascorsi = (Date.now() - d0) / 1000;
      // Il timer scende quanto l'orologio: ne' fermo, ne' ripartito, ne' piu' veloce.
      w.push({ gruppo: g, nome: 'sopra il Profilo e la privacy il timer della prova continua, quanto l\'orologio', ok: Math.abs(sec(s0) - sec(t1) - trascorsi) <= 1.5,
        extra: `timer ${s0} → ${t1} in ${trascorsi.toFixed(1)} s` });
      await tocca(tab, null, '[data-legale="chiudi"]');
      await tab.attendi(js(`return !V(document.querySelector('#legale'))`), REAZIONE);
      await esc(tab);
      const stesso = await tab.attendiValore(QUESITO, (x) => !!x && x.testo === q0.valore.testo, REAZIONE);
      w.push({ gruppo: g, nome: 'chiusi i pannelli, la stessa domanda della stessa prova', ok: stesso.ok, extra: `prima «${q0.valore.testo.slice(0, 40)}», ora ${JSON.stringify(stesso.valore)}` });
      await clic(tab, '#r-close'); await tab.attendi(visibile('[data-consegna="si"]'), REAZIONE); await clic(tab, '[data-consegna="si"]');
      await tab.attendi(RIEPILOGO, REAZIONE);
      await clic(tab, '[data-ciclo="ritorno"]');
      // La carta: il lavoro scritto resta, e la scadenza continua, sopra i legali.
      if (!await portaCarteggio(tab, 'prova')) { w.push({ gruppo: g, nome: 'la prova di carteggio si prepara', ok: false, extra: 'nessun #c-start' }); return; }
      await clic(tab, '#c-start');
      await tab.attendiValore(esercizioC, (x) => CARTEGGIO.has(x), REAZIONE);
      const scritto = 'Lat 42°49,9N Long 010°02,3E N-01';
      await scriviC(tab, scritto);
      const c0 = await tab.valuta(js(`return document.querySelector('#c-time').textContent`));
      await tocca(tab, null, '#conto-porta');
      await tab.attendi(modaleVisibile, REAZIONE);
      await tocca(tab, null, '[aria-modal="true"] a[href="/privacy"]');
      await tab.attendi(LEGALE_VISTO, REAZIONE);
      await pausa(2300);
      await tocca(tab, null, '[data-legale="chiudi"]');
      await tab.attendi(js(`return !V(document.querySelector('#legale'))`), REAZIONE);
      await esc(tab);
      await tab.attendi(`!(${modaleVisibile})`, REAZIONE);
      const ora = await tab.valuta(js(`return { testo: document.querySelector('#c-input').value, tempo: document.querySelector('#c-time').textContent }`));
      w.push({ gruppo: g, nome: 'sopra la privacy il lavoro della carta resta com\'era, e la scadenza continua', ok: ora.testo === scritto && sec(c0) - sec(ora.tempo) >= 2,
        extra: `testo «${ora.testo}», tempo ${c0} → ${ora.tempo}` });
      const s3 = await stessoDocumento(tab, d, n0);
      w.push({ gruppo: g, nome: 'dalla prima risposta alla carta, il documento non e\' mai cambiato', ...s3 });
    });
  } finally { await c.chiudi(); }
}

/** Indietro, Avanti e Chiudi riportano allo stesso punto: sezione, segmento, scorrimento, fuoco; mai una prova nuova. */
async function n01cronologia(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(null);
    await tab.dimensioni(375, 640);
    await tab.vai(ctx.sito + '/');
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'cronologia: la pagina si apre', ok: await tab.attendi(PRONTO, CARICO), extra: 'nessuna porta pronta' });
      const d = await segnaDocumento(tab), n0 = documenti(tab).length;
      await tocca(tab, null, '#barra [data-v="allenati"]');
      await tab.attendi(visibile('[data-tema]'), REAZIONE);
      await tocca(tab, null, '[data-tema]', { porta: true, testo: TEMA_02 });
      const prep = await tab.attendiValore(TESTO_VISTO('[data-preparazione]'), (x) => !!x && x.includes(TEMA_02), REAZIONE);
      w.push({ gruppo: g, nome: 'un argomento apre la sua preparazione, con l\'argomento scelto', ok: prep.ok, extra: String(prep.valore).slice(0, 200) });
      await tocca(tab, null, '[data-prep="chiudi"]');
      const chiusa = await tab.attendiValore(DOVE, (x) => x && x.sezione === 'allenati' && x.segmento === 'quiz' && x.fuoco, REAZIONE);
      const sc = await tab.valuta('window.__bancoScroll');
      w.push({ gruppo: g, nome: 'Chiudi la preparazione riporta ad Allenati · Quiz, con il fuoco sull\'argomento e lo scorrimento di prima', ok: chiusa.ok && Math.abs(chiusa.valore.scroll - sc) <= 2,
        extra: JSON.stringify(chiusa.valore) + ` scorrimento atteso ${sc}` });
      // Inizia, una risposta, «Termina», il ritorno: lo stesso punto.
      await tocca(tab, null, '[data-tema]', { porta: true, testo: TEMA_02 });
      await tab.attendi(visibile('[data-preparazione] #start'), REAZIONE);
      await clic(tab, '[data-preparazione] #start');
      await rispondiQuiz(tab, [], g, '');
      const lunghezza = await tab.valuta('history.length');
      // Indietro durante l'attivita': il gestore di uscita, e la cronologia non cresce.
      await tab.valuta('history.back(); true');
      const gestita = await tab.attendi(RIEPILOGO, REAZIONE);
      w.push({ gruppo: g, nome: 'Indietro durante un allenamento passa dal gestore di uscita: il risultato parziale, senza voci in piu\'', ok: gestita && await tab.valuta('history.length') === lunghezza,
        extra: gestita ? `history.length ${lunghezza} → ${await tab.valuta('history.length')}` : `in schermata: ${await tab.valuta(inSchermata)}` });
      await clic(tab, '[data-ciclo="ritorno"]');
      const tornata = await tab.attendiValore(DOVE, (x) => x && x.sezione === 'allenati' && x.segmento === 'quiz' && x.fuoco, REAZIONE);
      w.push({ gruppo: g, nome: 'il ritorno riporta ad Allenati · Quiz, con il fuoco sull\'argomento', ok: tornata.ok, extra: JSON.stringify(tornata.valore) });
      // Avanti su un tentativo concluso: il risultato, mai una prova nuova.
      await tab.valuta('history.forward(); true');
      const risultato = await tab.attendi(RIEPILOGO, REAZIONE);
      const nuova = await tab.valuta(js(`return V(document.querySelector('#r-text')) && !V(document.querySelector('#r-fine'))`));
      w.push({ gruppo: g, nome: 'Avanti su un tentativo concluso mostra il risultato, non una prova nuova', ok: risultato && !nuova, extra: `in schermata: ${await tab.valuta(inSchermata)}` });
      await tab.valuta('history.back(); true');
      await tab.attendiValore(DOVE, (x) => x && x.sezione === 'allenati', REAZIONE);
      const righe1 = (await uidPagina(tab, c)) || new Set();
      w.push({ gruppo: g, nome: 'Avanti e Indietro non scrivono righe: la sola risposta data resta l\'unica', ok: righe1.size === 1, extra: `righe della pagina: ${righe1.size}` });
      // Indietro fino alla Home: il fuoco sulla voce che l'aveva lasciata.
      await tab.valuta('history.back(); true');
      const home = await tab.attendiValore(DOVE, (x) => x && x.sezione === 'home', REAZIONE);
      w.push({ gruppo: g, nome: 'Indietro fino alla Home: la Home, all\'indirizzo /', ok: home.ok && home.valore.url === '/', extra: JSON.stringify(home.valore) });
      const avanti = await tab.valuta('history.forward(); true') && await tab.attendiValore(DOVE, (x) => x && x.sezione === 'allenati' && x.segmento === 'quiz', REAZIONE);
      w.push({ gruppo: g, nome: 'Avanti riporta ad Allenati · Quiz', ok: avanti.ok, extra: JSON.stringify(avanti.valore) });
      // La simulazione: Indietro chiede di consegnare, e «Continua la prova» lascia tutto com'era.
      await tocca(tab, null, '#barra [data-v="esame"]');
      await tab.attendi(visibile('#v-esame [data-modo="sim"][data-prova="base"]'), REAZIONE);
      await tocca(tab, null, '#v-esame [data-modo="sim"][data-prova="base"]', { porta: true });
      await tab.attendi(visibile('[data-preparazione] #start'), REAZIONE);
      await clic(tab, '[data-preparazione] #start');
      const qs = await quesitoVisto(tab);
      const l2 = await tab.valuta('history.length');
      await tab.valuta('history.back(); true');
      const chiede = await tab.attendi(visibile('[data-consegna="si"]'), REAZIONE);
      await clic(tab, '[data-consegna="no"]');
      const resta = await tab.attendiValore(QUESITO, (x) => !!x && qs.ok && x.testo === qs.valore.testo, REAZIONE);
      w.push({ gruppo: g, nome: 'Indietro durante la simulazione chiede di consegnare; continuando, la stessa domanda e la stessa cronologia', ok: chiede && resta.ok && await tab.valuta('history.length') === l2,
        extra: chiede ? `history.length ${l2} → ${await tab.valuta('history.length')}; ${JSON.stringify(resta.valore)}` : 'nessuna conferma di consegna dopo Indietro' });
      await clic(tab, '#r-close'); await tab.attendi(visibile('[data-consegna="si"]'), REAZIONE); await clic(tab, '[data-consegna="si"]');
      await tab.attendi(RIEPILOGO, REAZIONE);
      await clic(tab, '[data-ciclo="ritorno"]');
      const esame = await tab.attendiValore(DOVE, (x) => x && x.sezione === 'esame' && x.fuoco, REAZIONE);
      w.push({ gruppo: g, nome: 'dalla simulazione il ritorno riporta a Esame, alla sua porta', ok: esame.ok, extra: JSON.stringify(esame.valore) });
      w.push({ gruppo: g, nome: 'cronologia: il documento non e\' mai cambiato', ...await stessoDocumento(tab, d, n0) });
    });
  } finally { await c.chiudi(); }
}

/** Gli indirizzi: le query e la ricarica, /allenati, i parametri sconosciuti, /app e il suo frammento. */
async function n01indirizzi(b, ctx, v, g) {
  const http = async (p) => { try { const r = await fetch(ctx.sito + p); return r.status; } catch { return 0; } };
  for (const p of ['/', '/?sezione=allenati&segmento=quiz', '/?sezione=allenati&segmento=carteggio', '/?sezione=esame', '/?sezione=progressi']) {
    v.push({ gruppo: g, nome: `${p} risponde 200`, ok: await http(p) === 200, extra: `HTTP ${await http(p)}` });
  }
  v.push({ gruppo: g, nome: '/allenati risponde 404: non e\' una rotta del sito', ok: await http('/allenati') === 404, extra: `HTTP ${await http('/allenati')}` });
  const c = await b.nuovoContesto();
  try {
    for (const [p, sez, seg] of [['/?sezione=allenati&segmento=carteggio', 'allenati', 'carteggio'], ['/?sezione=esame', 'esame', null], ['/?sezione=progressi', 'progressi', null]]) {
      const tab = await c.apri(ctx.sito + p);
      const d = await tab.attendiValore(DOVE, (x) => x && x.sezione === sez && (!seg || x.segmento === seg), CARICO);
      v.push({ gruppo: g, nome: `l'ingresso diretto su ${p} apre ${sez}${seg ? ' · ' + seg : ''}, e l'indirizzo resta quello`, ok: d.ok && d.valore.url === p, extra: JSON.stringify(d.valore) });
      // Una risposta qui, poi la ricarica: la sezione torna, le risposte no (ADR-004).
      await tab.ricarica();
      const r = await tab.attendiValore(DOVE, (x) => x && x.sezione === sez, CARICO);
      const vuota = await tab.valuta(js(`return !V(document.querySelector('#rotta-last')) && !V(document.querySelector('#invito-home'))`));
      v.push({ gruppo: g, nome: `la ricarica di ${p} riapre la stessa sezione, senza risposte di prima`, ok: r.ok && vuota, extra: JSON.stringify(r.valore) });
    }
    // Un alias di prima come sezione (tabella C del §10.1): la destinazione e l'indirizzo canonico.
    const ta = await c.apri(ctx.sito + '/?sezione=cart');
    const al = await ta.attendiValore(DOVE, (x) => x && x.sezione === 'allenati' && x.segmento === 'carteggio', CARICO);
    v.push({ gruppo: g, nome: 'l\'alias «cart» porta ad Allenati · Carteggio, con l\'indirizzo canonico', ok: al.ok && al.valore.url === '/?sezione=allenati&segmento=carteggio', extra: JSON.stringify(al.valore) });
    const t1 = await c.apri(ctx.sito + '/?parametro=1');
    const ind = await t1.attendi(testoVisibile('Questa destinazione non è disponibile.'), CARICO);
    v.push({ gruppo: g, nome: 'un parametro sconosciuto porta alla Home e lo dice, con l\'indirizzo /', ok: ind && await t1.valuta('location.pathname + location.search') === '/', extra: await t1.valuta('location.href') });
    const t2 = await c.apri(ctx.sito + '/?sezione=allenati&segmento=quiz&attivita=argomento&fase=runner');
    const nonRunner = await t2.attendi(testoVisibile('Questa attività non è disponibile qui.'), CARICO) && !await t2.valuta(js(`return V(document.querySelector('#r-text'))`));
    v.push({ gruppo: g, nome: 'un runner non si apre da un indirizzo: «fase=runner» dice che non e\' disponibile', ok: nonRunner, extra: await t2.valuta(inSchermata) });
    // /app, la porta: Allenati · Quiz, e il frammento letto in memoria e tolto.
    const t3 = await c.apri(ctx.sito + '/app');
    const app = await t3.attendiValore(DOVE, (x) => x && x.sezione === 'allenati' && x.segmento === 'quiz', CARICO);
    v.push({ gruppo: g, nome: '/app porta ad Allenati · Quiz, su /?sezione=allenati&segmento=quiz', ok: app.ok && app.valore.url === '/?sezione=allenati&segmento=quiz', extra: JSON.stringify(app.valore) });
    const t4 = await c.apri(ctx.sito + '/app#password=GettoneDiProva123');
    const pw = await t4.attendi(testoVisibile('Scegli una nuova password'), CARICO);
    const pulito = await t4.valuta(`({ url: location.href, stato: JSON.stringify(history.state) })`);
    const conservato = personale(await c.conservato(ctx.sito, t4), ctx.api);
    v.push({ gruppo: g, nome: 'il link della password da /app: il modulo si apre, il gettone non resta nell\'indirizzo, nella cronologia ne\' in uno storage',
      ok: pw && !pulito.url.includes('Gettone') && !pulito.stato.includes('Gettone') && !conservato.length, extra: `${JSON.stringify(pulito)} ${conservato.join(' · ')}` });
  } finally { await c.chiudi(); }
}

/** Lo storage da fuori per tutta la finestra, e la cronologia: niente di chi studia in history.state o nell'indirizzo. */
const STRUMENTO_STORIA = `(() => {
  const log = window.__rgStoria = [];
  for (const m of ['pushState', 'replaceState']) {
    const f = History.prototype[m];
    History.prototype[m] = function (stato, t, url) { log.push({ m, stato: JSON.stringify(stato), url: String(url ?? '') }); return f.apply(this, arguments); };
  }
  const scrive = window.__rgScritture = [];
  for (const s of [Storage.prototype]) for (const m of ['setItem', 'removeItem', 'clear']) {
    const f = s[m]; s[m] = function () { scrive.push(m + ' ' + (arguments[0] ?? '')); return f.apply(this, arguments); };
  }
  const o = indexedDB.open.bind(indexedDB);
  indexedDB.open = (n, ...r) => { scrive.push('indexedDB.open ' + n); return o(n, ...r); };
  const ck = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  Object.defineProperty(document, 'cookie', { get() { return ck.get.call(document); }, set(x) { scrive.push('cookie ' + String(x).split('=')[0]); ck.set.call(document, x); } });
})();`;

async function n01storage(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/', { prima: STRUMENTO_STORIA });
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'storage: la pagina si apre', ok: await tab.attendi(PRONTO, CARICO), extra: 'nessuna porta pronta' });
      const data = '2026-12-01', numero = '1.1.1-24';
      const testo = await unaRisposta(tab, [], g);
      await clic(tab, '[data-ciclo="ritorno"]');
      await tocca(tab, null, '#barra [data-v="esame"]');
      await tab.valuta(js(`const d = document.querySelector('#esame-data'); d.value = ${q(data)}; d.dispatchEvent(new Event('change', { bubbles: true })); return true;`));
      await tocca(tab, null, '#conto-porta'); await tab.attendi(modaleVisibile, REAZIONE);
      await clicca(tab, 'Che cosa stai preparando?');
      await tab.attendi(js(`return !!M().querySelector('[name="abilitazione"]')`), REAZIONE);
      await tab.valuta(js(`M().querySelector('[name="abilitazione"][value="vela"]').click(); M().querySelector('[name="conseguimento"][value="prima"]').click(); return true;`));
      await clicca(tab, testi(ctx).salvaData);
      const applicate = await tab.attendi(testoVisibile('Scelte applicate a questa pagina'), REAZIONE) && !await tab.valuta(testoVisibile('Scelte salvate'));
      w.push({ gruppo: g, nome: 'senza account le scelte valgono per la pagina: «Scelte applicate a questa pagina», mai «Scelte salvate»', ok: applicate, extra: await tab.valuta(inSchermata) });
      await esc(tab);
      await tocca(tab, null, '#barra [data-v="allenati"]');
      await tab.valuta(js(`const f = document.querySelector('[data-ricerca]'); f.elements.numero.value = ${q(numero)}; return true;`));
      await tocca(tab, null, '[data-ricerca] button');
      await tab.attendi(testoRe(/quesit[oi] trovat[oi]/), REAZIONE);
      await tocca(tab, null, 'footer a[href="/privacy"]');
      await tab.attendi(LEGALE_VISTO, REAZIONE);
      await tocca(tab, null, '[data-legale="chiudi"]');
      let trovato = [];
      for (const fine = Date.now() + OSSERVAZIONE; !trovato.length && Date.now() < fine;) {
        trovato = personale(await c.conservato(ctx.sito, tab), ctx.api);
        if (!trovato.length) await pausa(50);
      }
      w.push({ gruppo: g, nome: 'storage: per tutta la finestra nessun dato personale nel browser', ok: !trovato.length, extra: trovato.join(' · ') });
      const scritte = await tab.valuta('window.__rgScritture');
      w.push({ gruppo: g, nome: 'storage: nessuna scrittura tentata — localStorage, sessionStorage, IndexedDB, cookie', ok: !scritte.length, extra: scritte.join(', ') });
      const storia = await tab.valuta('window.__rgStoria');
      const stati = storia.filter((x) => { try { const o = JSON.parse(x.stato); return !(o && typeof o === 'object' && Object.keys(o).length === 1 && 'nav' in o && /^[\w-]+$/.test(String(o.nav))); } catch { return true; } });
      w.push({ gruppo: g, nome: 'history.state e\' solo {nav: id}, in ogni voce', ok: storia.length > 3 && !stati.length, extra: stati.length ? stati.map((x) => x.stato).join(', ').slice(0, 300) : `${storia.length} voci` });
      const uid = await uidPagina(tab, c);
      const sporchi = storia.filter((x) => {
        const u = new URL(x.url || '/', 'http://x');
        if (!['/', '/privacy', '/avvertenza'].includes(u.pathname)) return true;
        if ([...u.searchParams.keys()].some((k) => !PARAMETRI_URL.includes(k))) return true;
        if (u.hash && u.hash !== '#condizioni') return true;
        return [data, numero, testo && testo.slice(0, 12), ...(uid || [])].filter(Boolean).some((s) => decodeURIComponent(x.url).includes(s));
      });
      w.push({ gruppo: g, nome: 'nessun indirizzo prodotto porta dati di chi studia, una rotta non servita o un parametro estraneo', ok: !sporchi.length, extra: sporchi.map((x) => x.url).join(', ') });
      w.push({ gruppo: g, nome: 'e nemmeno quello di adesso', ok: !(await tab.valuta('location.href')).includes(data), extra: await tab.valuta('location.href') });
    });
  } finally { await c.chiudi(); }
}

/** I tre posti dell'invito, e nessun quarto; la rinuncia tiene la memoria. */
const INVITO_IN = (sel) => js(`const e = [...document.querySelectorAll(${q(sel)})].find(V); if (!e) return null; const t = e.innerText;
  return ${q(INVITO)}.filter((f) => t.includes(f));`);
async function n01invito(b, ctx, v, g) {
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/');
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'invito: la pagina si apre', ok: await tab.attendi(PRONTO, CARICO), extra: 'nessuna porta pronta' });
      w.push({ gruppo: g, nome: 'H0: la Home senza risposte non invita', ok: !(await tab.valuta(INVITO_IN('main'))).length, extra: String(await tab.valuta(INVITO_IN('main'))) });
      await avviaPrima(tab);
      await rispondiQuiz(tab, [], g, '');
      const nelRunner = await tab.valuta(INVITO_IN('#quizrun'));
      w.push({ gruppo: g, nome: 'durante l\'attivita\' nessun invito', ok: !nelRunner.length, extra: nelRunner.join(', ') });
      await chiudiQuiz(tab, [], g, '');
      w.push({ gruppo: g, nome: 'il terzo posto: il riepilogo invita, con «Vuoi conservare le attività di questa pagina?»', ok: await tab.valuta(testoVisibile(DOPO)), extra: await tab.valuta(inSchermata) });
      await clic(tab, '[data-ciclo="risposte"]');
      await tab.attendi(visibile('#rv-body'), REAZIONE);
      const rev = await tab.valuta(INVITO_IN('#rivedi'));
      w.push({ gruppo: g, nome: 'la revisione non invita', ok: !rev.length, extra: rev.join(', ') });
      await clic(tab, '#rv-close');
      const prima = await uidPagina(tab, c);
      await clicca(tab, 'Continua senza account');
      const rinuncia = await tab.attendi(`!(${testoVisibile(DOPO)})`, REAZIONE) && await tab.valuta(RIEPILOGO);
      w.push({ gruppo: g, nome: '«Continua senza account» chiude l\'invito, e il risultato resta', ok: rinuncia, extra: await tab.valuta(inSchermata) });
      await clic(tab, '[data-ciclo="ritorno"]');
      const h1 = await tab.attendi(js(`const i = document.querySelector('#invito-home'); return V(i) && i.innerText.includes('Conserva le risposte.')`), REAZIONE);
      w.push({ gruppo: g, nome: 'il primo posto: la Home con risposte senza account invita, «Conserva le risposte.»', ok: h1, extra: await tab.valuta(TESTO_VISTO('#v-home')) });
      await tocca(tab, null, '#invito-home [data-invito="rinuncia"]');
      await tocca(tab, null, '#barra [data-v="allenati"]');
      await tab.valuta('history.back(); true');
      await tab.attendiValore(DOVE, (x) => x && x.sezione === 'home', REAZIONE);
      const tenuta = !await tab.valuta(js(`return V(document.querySelector('#invito-home'))`));
      const dopo = await uidPagina(tab, c);
      w.push({ gruppo: g, nome: 'la rinuncia nella Home tiene la memoria: Indietro non riapre l\'invito, e le risposte sono le stesse', ok: tenuta && stessi(prima, dopo), extra: `invito ${tenuta ? 'chiuso' : 'riaperto'}, uid ${prima && prima.size} → ${dopo && dopo.size}` });
      // Il secondo posto: il risultato di una simulazione, con la prima meta' della frase (A-6).
      await portaSim(tab);
      await tab.attendi(visibile('[data-preparazione] #start'), REAZIONE);
      await clic(tab, '[data-preparazione] #start');
      await rispondiQuiz(tab, [], g, '', { sim: true });
      await chiudiQuiz(tab, [], g, '', { sim: true });
      const sim = await tab.valuta(js(`const f = document.querySelector('#r-fine'); return f.innerText;`));
      w.push({ gruppo: g, nome: 'il secondo posto: il risultato di una simulazione, «Conserva questa prova e ritrovala quando torni.», senza la promessa di P-76', ok: sim.includes('Conserva questa prova e ritrovala quando torni.') && !sim.includes(NON_PROMETTERE),
        extra: sim.slice(0, 300) });
      await clic(tab, '[data-ciclo="ritorno"]');
      await tab.attendi(js(`return !V(document.querySelector('#r-fine'))`), REAZIONE);
      await allaHome(tab);
      const torna = await tab.attendi(js(`return V(document.querySelector('#invito-home'))`), REAZIONE);
      w.push({ gruppo: g, nome: 'con risposte nuove l\'invito della Home torna', ok: torna, extra: 'dopo la simulazione la Home non invita' });
      // Nessun quarto posto: le sezioni, la preparazione, i legali, il confronto della carta.
      const quarti = [];
      for (const [porta, dove] of [['#barra [data-v="allenati"]', '#v-allenati'], ['#barra [data-v="esame"]', '#v-esame'], ['#barra [data-v="progressi"]', '#v-progressi']]) {
        await tocca(tab, null, porta); await tab.attendi(visibile(dove), REAZIONE);
        const x = await tab.valuta(INVITO_IN(dove)); if (x && x.length) quarti.push(`${dove}: ${x.join(', ')}`);
      }
      await tocca(tab, null, 'footer a[href="/privacy"]'); await tab.attendi(LEGALE_VISTO, REAZIONE);
      const l = await tab.valuta(INVITO_IN('#legale')); if (l && l.length) quarti.push(`legale: ${l.join(', ')}`);
      await tocca(tab, null, '[data-legale="chiudi"]');
      if (await portaCarteggio(tab, 'prova')) {
        const p = await tab.valuta(INVITO_IN('[data-preparazione]')); if (p && p.length) quarti.push(`preparazione: ${p.join(', ')}`);
        await clic(tab, '#c-start'); await tab.attendiValore(esercizioC, (x) => CARTEGGIO.has(x), REAZIONE);
        await consegnaC(tab);
        const cf = await tab.valuta(INVITO_IN('#cartrun')); if (cf && cf.length) quarti.push(`confronto: ${cf.join(', ')}`);
      } else quarti.push('la prova di carteggio non si apre');
      w.push({ gruppo: g, nome: 'nessun quarto posto: Allenati, Esame, Progressi, la preparazione, i legali e il confronto della carta non invitano', ok: !quarti.length, extra: quarti.join('; ') });
    });
  } finally { await c.chiudi(); }
}

/** Una risposta giusta o sbagliata a un quesito preciso, gia' in schermata: la risposta si sceglie dal testo della banca. */
async function rispondiCome(tab, it, giusta) {
  const testo = giusta ? it.r[it.x] : it.r.find((_, k) => k !== it.x);
  return tab.attendi(js(`const b = [...document.querySelectorAll('#r-ans .ans')].filter(V).find((x) => x.textContent.includes(${q(testo)}));
    if (b && !document.querySelector('#r-ans .ans.ok')) b.click(); return !!document.querySelector('#r-ans .ans.ok');`), REAZIONE);
}
/** Un quesito della banca aperto per numero: la ricerca, la preparazione, Inizia. */
async function apriPerNumero(tab, it) {
  await tocca(tab, null, '#barra [data-v="allenati"]');
  await tab.attendi(visibile('[data-ricerca]'), REAZIONE);
  await tab.valuta(js(`const f = document.querySelector('[data-ricerca]'); f.elements.numero.value = ${q(it.p)}; return true;`));
  await tocca(tab, null, '[data-ricerca] button');
  if (!await tab.attendi(visibile(`[data-trovato="${it.id}"]`), REAZIONE)) return false;
  await tocca(tab, null, `[data-trovato="${it.id}"]`);
  if (!await tab.attendi(visibile('[data-preparazione] #start'), REAZIONE)) return false;
  await tocca(tab, null, '[data-preparazione] #start');
  return tab.attendiValore(QUESITO, (x) => !!x && x.testo === it.d, REAZIONE).then((r) => r.ok);
}
/** I quesiti base con un numero che non si ripete e una risposta che la banca non confonde: per i giri a quesito preciso. */
const UNIVOCI = QUIZ_BASE.filter((it) => !it.osc && /^\d+(\.\d+)*-\d+$/.test(it.p || '')
  && QUIZ_TUTTI.filter((x) => x.p === it.p).length === 1 && QUIZ_TUTTI.filter((x) => x.d === it.d).length === 1 && it.r.every((t, k) => it.r.every((u, j) => j === k || !u.includes(t))));
const ORA = 3600e3;
const rigaQ = (it, giusta, fa, sim = 'n01-storia') => ({ _t: 'q', uid: `n01-${++serie}`, item_id: it.id, ts: E.isoLocale(new Date(Date.now() - fa)), ms: 9000,
  mode: 'argomento', kind: 'base', sim_uid: sim, correct: giusta ? 1 : 0, chosen: giusta ? it.x : (it.x + 1) % it.r.length });

/** La registrazione porta nell'account l'insieme intero delle righe: dalla Home e dal risultato di una simulazione. */
async function n01registrazione(b, ctx, v, g) {
  // L'onboarding salva le scelte di preparazione: la raccolta accesa sul server
  // della corsia, su qualunque pagina (P-88), com'e' dal rilascio di P-81.
  if (!perParte(ctx, v, g, SCELTE_ACCESE)) return;
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/');
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'registrazione: la pagina si apre', ok: await tab.attendi(PRONTO, CARICO), extra: 'nessuna porta pronta' });
      // Due attivita' nella pagina, poi la Home: l'invito.
      await unaRisposta(tab, [], g); await clic(tab, '[data-ciclo="ritorno"]');
      await tocca(tab, null, '#barra [data-v="allenati"]');
      await tab.attendi(visibile('[data-tema]'), REAZIONE);
      await tocca(tab, null, '[data-tema]', { testo: TEMA_02 });
      await tab.attendi(visibile('[data-preparazione] #start'), REAZIONE); await tocca(tab, null, '[data-preparazione] #start');
      await rispondiQuiz(tab, [], g, ''); await chiudiQuiz(tab, [], g, ''); await clic(tab, '[data-ciclo="ritorno"]');
      const pagina = await uidPagina(tab, c);
      await allaHome(tab);
      w.push({ gruppo: g, nome: 'dopo due attivita\' la Home invita', ok: await tab.attendi(visibile('#invito-home [data-account="registra"]'), REAZIONE) && !!pagina && pagina.size >= 2,
        extra: `uid della pagina: ${pagina && pagina.size}` });
      await tocca(tab, null, '#invito-home [data-account="registra"]');
      const email = await cicloRegistra(tab);
      const U = email && { email, chiave: ctx.conto(email).chiave_locale };
      const detto = U && await tab.valuta(testoRe(SALVATE));
      w.push({ gruppo: g, nome: 'dalla Home la registrazione arriva a «salvate», con il numero delle risposte della pagina', ok: !!detto && Number(detto[1]) === pagina.size,
        extra: `«salvate» dice ${JSON.stringify(detto)}, la pagina aveva ${pagina.size} risposte` });
      const copia = new Set(await uidCopia(tab, U.chiave) || []);
      const server = new Set(ctx.righeServer(email).map((r) => String(r.uid)));
      const mancaCopia = [...pagina].filter((u) => !copia.has(u)), mancaServer = [...pagina].filter((u) => !server.has(u));
      w.push({ gruppo: g, nome: 'ogni riga della pagina e\' nella copia dell\'account e sul server, uid per uid', ok: !mancaCopia.length && !mancaServer.length,
        extra: `mancano nella copia ${mancaCopia.length}, sul server ${mancaServer.length}, su ${pagina.size}` });
      // L'onboarding: «Che cosa stai preparando?», e «Scelte salvate» solo dai valori riletti.
      const scelte = await tab.attendi(js(`return !!M().querySelector('[name="abilitazione"]')`), REAZIONE);
      await tab.valuta(js(`M().querySelector('[name="abilitazione"][value="vela"]').click(); M().querySelector('[name="conseguimento"][value="estensione_e12"]').click(); return true;`));
      await clicca(tab, testi(ctx).salvaData);
      const salvate = await tab.attendi(testoVisibile('Scelte salvate'), REAZIONE);
      const db = ctx.scelteDi(email);
      w.push({ gruppo: g, nome: 'l\'onboarding chiede «che cosa stai preparando?», e «Scelte salvate» quando il server le ha', ok: scelte && salvate && db.abilitazione === 'vela' && db.conseguimento === 'estensione_e12',
        extra: `nel database ${JSON.stringify(db)}; in schermata ${await tab.valuta(inSchermata)}` });
    });
    // Dal risultato di una simulazione, in un browser nuovo: la riga della prova e le risposte, e il risultato resta.
    const c2 = await b.nuovoContesto();
    const t2 = await c2.apri(null);
    c.chiudiAnche = c2;
    await t2.vai(ctx.sito + '/');
    await fermaAlPrimo(v, async (w) => {
      await t2.attendi(PRONTO, CARICO);
      await portaSim(t2); await t2.attendi(visibile('[data-preparazione] #start'), REAZIONE); await clic(t2, '[data-preparazione] #start');
      await rispondiQuiz(t2, [], g, '', { sim: true }); await chiudiQuiz(t2, [], g, '', { sim: true });
      const prima = await t2.valuta(js(`return document.querySelector('#r-fine h1').innerText`));
      w.push({ gruppo: g, nome: 'il risultato della simulazione offre di registrarsi', ok: await t2.attendi(visibile('#r-fine [data-account="registra"]'), REAZIONE), extra: await t2.valuta(inSchermata) });
      await tocca(t2, null, '#r-fine [data-account="registra"]');
      const email = await cicloRegistra(t2);
      w.push({ gruppo: g, nome: 'dal risultato la registrazione arriva a «salvate»', ok: !!email, extra: await t2.valuta(inSchermata) });
      const server = ctx.righeServer(email);
      w.push({ gruppo: g, nome: 'sul server la riga della prova e la sua risposta, con lo stesso sim_uid', ok: server.some((r) => r._t === 's') && server.some((r) => r._t === 'q')
        && new Set(server.filter((r) => r._t === 'q' || r._t === 's').map((r) => r._t === 's' ? r.uid : r.sim_uid)).size === 1, extra: JSON.stringify(server.map((r) => r._t)) });
      await t2.attendi(pulsante(testi(ctx).saltaData), REAZIONE);
      await clicca(t2, testi(ctx).saltaData);
      const resta = await t2.attendi(`!(${modaleVisibile}) && (${js(`return V(document.querySelector('#r-fine h1')) && document.querySelector('#r-fine h1').innerText === ${q(prima)}`)})`, REAZIONE);
      w.push({ gruppo: g, nome: 'chiuso il modulo, lo stesso risultato, senza piu\' l\'invito', ok: resta && !await t2.valuta(js(`return V(document.querySelector('#r-fine [data-account="registra"]'))`)),
        extra: await t2.valuta(TESTO_VISTO('[aria-modal="true"]')) + ' || ' + await t2.valuta(TESTO_VISTO('#r-fine')) });
    });
  } finally { await c.chiudi(); if (c.chiudiAnche) await c.chiudiAnche.chiudi(); }
}
/** Il modulo aperto: email, password, «Crea l'account e salva», fino a «salvate». */
async function cicloRegistra(tab) {
  const email = `n01r-${++serie}@esempio.it`;
  if (!await tab.attendi(js(`return V(${campo('Email')});`), REAZIONE)) return null;
  await imposta(tab, 'Email', email); await imposta(tab, 'Password', PASSWORD);
  if (!await tocca(tab, null, '[data-account="crea"]')) return null;
  return await tab.attendi(testoRe(SALVATE), CARICO) ? email : null;
}

/** I cinque stati in schermata: le parole di Q-STATI nell'ordine, i numeri del motore, e la seconda giusta a 12 ore senza ricarica. */
async function n01stati(b, ctx, v, g) {
  const [A, B, C, D, X] = UNIVOCI.slice(0, 5);
  const righe = [rigaQ(A, false, 48 * ORA), rigaQ(B, true, ORA), rigaQ(C, false, 72 * ORA), rigaQ(C, true, 48 * ORA), rigaQ(C, true, 24 * ORA),
    rigaQ(D, true, 48 * ORA), rigaQ(D, true, 24 * ORA), rigaQ(X, true, 13 * ORA)];
  const atteso = (rr) => E.contaStati(QUIZ_TUTTI, E.ripiega(rr).quiz, { kind: 'base' });
  const K = await nuovoAccount(ctx, 'n01st');
  ctx.aggiungi(K.email, righe);
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(null);
    await tab.vai(ctx.sito + '/');
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'stati: dentro l\'account', ok: await dentro(tab, K), extra: 'l\'accesso non riesce' });
      const leggi = js(`return [...document.querySelectorAll('#stati li')].filter(V).map((l) => l.innerText.trim());`);
      const attesi = (cs) => CHIAVI_STATI.map((k, i) => `${PAROLE_STATI[i]} ${cs[k]}`);
      await tocca(tab, null, '#barra [data-v="progressi"]');
      const cs = atteso(righe);
      const visti = await tab.attendiValore(leggi, (x) => JSON.stringify(x) === JSON.stringify(attesi(cs)), CARICO);
      w.push({ gruppo: g, nome: `i cinque stati con le parole di Q-STATI, nell'ordine, e i numeri del motore (${attesi(cs).join(' · ')})`, ok: visti.ok, extra: JSON.stringify(visti.valore) });
      const somma = CHIAVI_STATI.reduce((s, k) => s + cs[k], 0);
      const tot = await tab.valuta(TESTO_VISTO('#stati-totale'));
      w.push({ gruppo: g, nome: 'i cinque sommano al totale della banca base, e la pagina lo scrive', ok: somma === cs.totale && String(tot).includes(String(cs.totale)), extra: `somma ${somma}, totale ${cs.totale}, «${tot}»` });
      w.push({ gruppo: g, nome: 'la legenda dice «In base alle ultime risposte»', ok: await tab.valuta(testoVisibile('In base alle ultime risposte')), extra: await tab.valuta(TESTO_VISTO('#v-progressi')) });
      // La seconda giusta a 13 ore dalla prima: da «da confermare» ad «acquisiti», senza ricarica e
      // prima che il server risponda — le righe si trattengono, cosi' la vista nuova viene dallo
      // specchio che applica() ha aggiornato con l'istante della riga, non da una ricezione.
      let rilascia = () => {}, tieni = false;
      const fermo = new Promise((ok) => { rilascia = ok; });
      await tab.intercetta(`${ctx.api}/v1/righe*`, async () => { if (tieni) await fermo; return null; });
      const d0 = documenti(tab).length, doc = await segnaDocumento(tab);
      w.push({ gruppo: g, nome: `il quesito ${X.p} si apre per numero`, ok: await apriPerNumero(tab, X), extra: await tab.valuta(inSchermata) });
      tieni = true;
      w.push({ gruppo: g, nome: 'e si risponde giusto', ok: await rispondiCome(tab, X, true), extra: 'nessuna risposta si accende come esatta' });
      await gesto(tab, null, '#r-close', RIEPILOGO); await gesto(tab, null, '[data-ciclo="ritorno"]', js(`return !V(document.querySelector('#r-fine'))`));
      await tocca(tab, null, '#barra [data-v="progressi"]');
      const dopo = atteso(righe.concat([{ ...rigaQ(X, true, 0) }]));
      const mosso = await tab.attendiValore(leggi, (x) => JSON.stringify(x) === JSON.stringify(attesi(dopo)), REAZIONE);
      w.push({ gruppo: g, nome: `la seconda giusta a 12 ore sposta il quesito ad «acquisiti» senza ricarica, prima che il server risponda (${attesi(dopo).join(' · ')})`,
        ok: mosso.ok && cs.incerto - 1 === dopo.incerto && cs.ok + 1 === dopo.ok, extra: JSON.stringify(mosso.valore) });
      tieni = false; rilascia();
      w.push({ gruppo: g, nome: 'stati: senza ricaricare', ...await stessoDocumento(tab, doc, d0) });
    });
  } finally { await c.chiudi(); }
}

/** I gesti: tag N e S, i tag di prima L e C, il segnalibro che non tocca le risposte, il permesso del server, la segnalazione. */
const SERVER = {
  oggi: null,
  // P-73: dichiara i tipi, ma senza il segnalibro (il main del 4 ottobre, prima di P-71).
  'P-73': (o) => { o.tipi_riga = ['q', 'c', 't', 's', 'g', 'a']; return o; },
  // v0.30.0: nessun tipi_riga.
  'v0.30.0': (o) => { delete o.tipi_riga; delete o.esiti; delete o.campi_profilo; return o; },
};
/**
 * Il server che si imita, dalla descrizione dell'account: `GET /v1/io` con i
 * campi di quel rilascio. Si entra prima, poi si ricarica, come per E-01 (P-74):
 * una risposta finta all'accesso perderebbe il cookie della sessione.
 */
async function entraImitando(ctx, tab, K, quale) {
  if (!await dentro(tab, K)) return false;
  if (!SERVER[quale]) return true;
  // La descrizione torna anche dalla risposta del profilo (P-83): la stessa del rilascio imitato.
  for (const [percorso, metodo] of [['/v1/io', 'GET'], ['/v1/profilo', 'PUT']]) {
    await tab.intercetta(ctx.api + percorso, async (req, params, { corpo }) => {
      if (req.method !== metodo || params.responseStatusCode !== 200) return null;
      return finti(ctx, 200, SERVER[quale](JSON.parse(await corpo())));
    }, { fase: 'Response' });
  }
  await tab.ricarica();
  return tab.attendi(nellaPagina('Account'), CARICO);
}
const MOTIVO_GESTO = 'Il server collegato non accoglie ancora questo gesto.';

async function n01gesti(b, ctx, v, g) {
  const [A, Bq] = UNIVOCI.slice(5, 7);
  // Un errore di prima, con un tag «Letto male» senza data e uno «Calcolo» datato: si leggono come classificazione precedente.
  const e1 = rigaQ(A, false, 30 * ORA, 'n01-prima'), e2 = rigaQ(Bq, false, 29 * ORA, 'n01-prima');
  const storici = [e1, e2, { _t: 'g', uid: `n01-${++serie}`, attempt_uid: e1.uid, tag: 'L' }, { _t: 'g', uid: `n01-${++serie}`, attempt_uid: e2.uid, tag: 'C', ts: E.isoLocale(new Date(Date.now() - 28 * ORA)) }];
  for (const quale of ['oggi', 'P-73', 'v0.30.0']) {
    const K = await nuovoAccount(ctx, 'n01g');
    if (quale === 'oggi') ctx.aggiungi(K.email, storici);
    const c = await b.nuovoContesto();
    try {
      const tab = await c.apri(null);
      await tab.vai(ctx.sito + '/');
      await fermaAlPrimo(v, async (w) => {
        w.push({ gruppo: g, nome: `gesti, server ${quale}: dentro l'account`, ok: await entraImitando(ctx, tab, K, quale), extra: 'l\'accesso non riesce' });
        const it = UNIVOCI[7 + ['oggi', 'P-73', 'v0.30.0'].indexOf(quale)];
        w.push({ gruppo: g, nome: `server ${quale}: il quesito ${it.p} si apre per numero, e si sbaglia`, ok: await apriPerNumero(tab, it) && await rispondiCome(tab, it, false), extra: await tab.valuta(inSchermata) });
        const stato = await tab.attendiValore(js(`const n = document.querySelector('#r-tag [data-tag="N"]'), s = document.querySelector('#r-tag [data-tag="S"]'), b = document.querySelector('#r-segno');
          return V(n) && V(s) && V(b) ? { N: n.disabled, S: s.disabled, segno: b.disabled, motivo: document.querySelector('#r-tag-motivo').innerText } : null;`), Boolean, REAZIONE);
        if (quale === 'oggi') {
          w.push({ gruppo: g, nome: 'dopo un errore: «Non lo sapevo», «Svista» e il segnalibro, tutti offerti', ok: stato.ok && !stato.valore.N && !stato.valore.S && !stato.valore.segno, extra: JSON.stringify(stato.valore) });
          await gesto(tab, null, '#r-tag [data-tag="N"]', js(`return document.querySelector('#r-tag [data-tag="N"]').getAttribute('aria-pressed') === 'true'`));
          await gesto(tab, null, '#r-tag [data-tag="S"]', js(`return document.querySelector('#r-tag [data-tag="S"]').getAttribute('aria-pressed') === 'true' && document.querySelector('#r-tag [data-tag="N"]').getAttribute('aria-pressed') === 'false'`));
          await gesto(tab, null, '#r-segno', js(`return document.querySelector('#r-segno').getAttribute('aria-pressed') === 'true'`));
          // Si aspetta il contenuto, non un numero di righe: la risposta puo' essere arrivata prima o dopo.
          const arrivate = await finche(() => { const sv = ctx.righeServer(K.email); const u = sv.filter((r) => r._t === 'q' && r.item_id === it.id).pop();
            return !!u && sv.filter((r) => r._t === 'g' && r.attempt_uid === u.uid).length === 2 && sv.some((r) => r._t === 'b' && r.item_id === it.id); }, CARICO);
          const sv = ctx.righeServer(K.email);
          const tag = E.tagPerTentativo(sv), ultima = sv.filter((r) => r._t === 'q' && r.item_id === it.id).pop();
          w.push({ gruppo: g, nome: 'N poi S: due righe di tag, vale l\'ultimo, «Svista»; e una riga di segnalibro', ok: arrivate && ultima && tag[ultima.uid] === 'S' && E.segnalibri(sv).includes(it.id),
            extra: `sul server ${sv.length} righe; tag ${ultima && tag[ultima.uid]}; segnati ${JSON.stringify(E.segnalibri(sv))}` });
          const conti = E.riepilogoPagina(sv, null).risposte;
          w.push({ gruppo: g, nome: 'il segnalibro e i tag non sono risposte: le risposte restano quelle date', ok: conti.totale === sv.filter((r) => r._t === 'q' || r._t === 'c' || r._t === 't').length,
            extra: JSON.stringify(conti) });
          // La segnalazione: il riferimento del quesito, e l'indirizzo dichiarato segnaposto.
          await tocca(tab, null, '[data-segnala]');
          const rif = await tab.attendiValore(TESTO_VISTO('#segnala-rif'), (x) => !!x && x.includes(it.id) && x.includes(it.p), REAZIONE);
          await tocca(tab, null, '[data-segnala-copia]');
          const esito = await tab.attendiValore(TESTO_VISTO('#segnala-esito'), Boolean, REAZIONE);
          w.push({ gruppo: g, nome: '«Segnala un problema» mostra il riferimento del quesito, l\'indirizzo segnaposto dichiarato, e dice se l\'ha copiato', ok: rif.ok && esito.ok && await tab.valuta(testoVisibile('questo è un segnaposto')),
            extra: `${rif.valore} — ${esito.valore}` });
          await tocca(tab, null, '[data-account="torna"]');
          await gesto(tab, null, '#r-close', RIEPILOGO); await gesto(tab, null, '[data-ciclo="ritorno"]', js(`return !V(document.querySelector('#r-fine'))`));
          // I tag di prima, nella revisione della sessione di prima.
          await tocca(tab, null, '#barra [data-v="progressi"]');
          const sess = await tab.attendi(visibile('[data-sessione="n01-prima"]'), REAZIONE);
          await tocca(tab, null, '[data-sessione="n01-prima"]');
          const letti = await tab.attendiValore(js(`return [...document.querySelectorAll('#rv-body [data-tag-letto]')].filter(V).map((x) => x.dataset.tagLetto + ':' + x.innerText.trim());`), (x) => x && x.length === 2, REAZIONE);
          w.push({ gruppo: g, nome: 'i tag di prima, L senza data e C datato, si leggono come classificazione precedente, senza riconvertirli', ok: sess && letti.ok
            && letti.valore.includes('L:Classificazione precedente: Letto male') && letti.valore.includes('C:Classificazione precedente: Calcolo'), extra: JSON.stringify(letti.valore) });
          await tocca(tab, null, '#rv-close');
        } else {
          w.push({ gruppo: g, nome: `con il server ${quale} «Svista» e il segnalibro non si offrono, e la pagina dice perche'; «Non lo sapevo» si`, ok: stato.ok && !stato.valore.N && stato.valore.S && stato.valore.segno && stato.valore.motivo.includes(MOTIVO_GESTO),
            extra: JSON.stringify(stato.valore) });
          await gesto(tab, null, '#r-tag [data-tag="N"]', js(`return document.querySelector('#r-tag [data-tag="N"]').getAttribute('aria-pressed') === 'true'`));
          await tocca(tab, null, '#r-tag [data-tag="S"]'); await tocca(tab, null, '#r-segno');
          // Questo account non ha righe di prima: i gesti sono tutte le righe che non sono risposte.
          await finche(() => ctx.righeServer(K.email).some((r) => r._t === 'g' && r.tag === 'N'), CARICO);
          await pausa(OSSERVAZIONE);
          const nuove = ctx.righeServer(K.email).filter((r) => r._t !== 'q');
          w.push({ gruppo: g, nome: `con il server ${quale} arriva solo il tag N: nessun S e nessun segnalibro`, ok: nuove.some((r) => r._t === 'g' && r.tag === 'N') && !nuove.some((r) => r._t === 'b' || r.tag === 'S'),
            extra: JSON.stringify(nuove.map((r) => r._t + (r.tag || ''))) });
        }
      });
    } finally { await c.chiudi(); }
  }
}

/** Cerca per numero: esatto, parziale, ripetuto, oscurato, assente, non un numero; dal risultato la preparazione e la domanda. */
async function n01ricerca(b, ctx, v, g) {
  const ripetuto = QUIZ_TUTTI.find((it) => /^\d+(\.\d+)*-\d+$/.test(it.p || '') && QUIZ_TUTTI.filter((x) => x.p === it.p).length === 2);
  const oscurato = QUIZ_TUTTI.find((it) => it.osc && /^\d+(\.\d+)*-\d+$/.test(it.p || '') && QUIZ_TUTTI.filter((x) => x.p === it.p).length === 1);
  const casi = [['1.1.1-24', 'esatto'], ['N. 1.1.1 – 24', 'scritto come lo scrive chi ha il libro'], ['1.1.1-2', 'parziale'], [ripetuto.p, 'ripetuto nel decreto'],
    [oscurato.p, 'oscurato'], ['9.9.9-999', 'che non c\'e\''], ['flaps', 'non un numero'],
    // Uno dei tre progressivi che il decreto scrive con un punto (P-77): non si trova per numero.
    ['1.3.2.113', 'scritto dal decreto con un punto']];
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + '/?sezione=allenati&segmento=quiz');
    await fermaAlPrimo(v, async (w) => {
      w.push({ gruppo: g, nome: 'ricerca: la casella c\'e\' in Allenati · Quiz', ok: await tab.attendi(visibile('[data-ricerca]'), CARICO), extra: await tab.valuta(inSchermata) });
      for (const [testo, che] of casi) {
        const r = E.cercaNumero(QUIZ_TUTTI, testo);
        if (!await tab.valuta(js(`const f = document.querySelector('[data-ricerca]'), e = document.querySelector('#ricerca-esito'); if (!f || !f.elements.numero || !e) return false; f.elements.numero.value = ${q(testo)}; if (f.elements.banca) f.elements.banca.value = ''; e.textContent = ''; return true;`))) { w.push({ gruppo: g, nome: 'la casella della ricerca ha il suo campo e il suo esito', ok: false, extra: 'manca [data-ricerca] numero o #ricerca-esito' }); return; }
        await tocca(tab, null, '[data-ricerca] button');
        const visto = await tab.attendiValore(js(`const e = document.querySelector('#ricerca-esito'); return V(e) && e.innerText.trim() ? { testo: e.innerText, ids: [...e.querySelectorAll('[data-trovato]')].map((x) => x.dataset.trovato) } : null;`), Boolean, REAZIONE);
        const ids = [...r.esatti, ...r.parziali].map((x) => x.id);
        const ok = !r.valido ? visto.ok && visto.valore.testo.includes(r.motivo) && !visto.valore.ids.length
          : !r.quanti ? visto.ok && visto.valore.testo.includes('Nessun quesito con questo numero')
          : visto.ok && JSON.stringify(visto.valore.ids) === JSON.stringify(ids) && visto.valore.testo.includes(`${r.quanti} ${r.quanti === 1 ? 'quesito trovato' : 'quesiti trovati'}`)
            && r.oscurati.every(() => visto.valore.testo.includes('Oscurato: all\'esame non esce'));
        w.push({ gruppo: g, nome: `«${testo}» (${che}): ${!r.valido ? 'il motivo del motore' : r.quanti ? `${r.quanti} quesiti, quelli di cercaNumero(), nel suo ordine` : 'nessun risultato, detto'}`, ok,
          extra: JSON.stringify(visto.valore).slice(0, 300) + ` — atteso ${JSON.stringify(ids).slice(0, 120)}` });
      }
      // L'oscurato si apre, e lo dice prima della risposta.
      await tab.valuta(js(`const f = document.querySelector('[data-ricerca]'); f.elements.numero.value = ${q(oscurato.p)}; return true;`));
      await tocca(tab, null, '[data-ricerca] button');
      await tab.attendi(visibile(`[data-trovato="${oscurato.id}"]`), REAZIONE);
      await tocca(tab, null, `[data-trovato="${oscurato.id}"]`, { porta: true });
      await tab.attendi(visibile('[data-preparazione] #start'), REAZIONE); await tocca(tab, null, '[data-preparazione] #start');
      const aperto = await tab.attendiValore(js(`const t = document.querySelector('#r-text'); return V(t) ? { testo: t.textContent.trim(), nbp: V(document.querySelector('#r-nbp')) ? document.querySelector('#r-nbp').innerText : null,
        numero: document.querySelector('#r-numero').innerText, risposto: !!document.querySelector('#r-ans .ans.ok') } : null;`), (x) => !!x && x.testo === oscurato.d, REAZIONE);
      w.push({ gruppo: g, nome: `il quesito oscurato ${oscurato.p} si apre, con il suo numero, e l'avviso compare prima della risposta`, ok: aperto.ok && !!aperto.valore.nbp && !aperto.valore.risposto && aperto.valore.numero.includes(oscurato.p),
        extra: JSON.stringify(aperto.valore) });
      await gesto(tab, null, '#r-close', js(`return !V(document.querySelector('#r-text'))`));
      const ritorno = await tab.attendiValore(DOVE, (x) => x && x.sezione === 'allenati' && x.segmento === 'quiz' && x.fuoco, REAZIONE);
      w.push({ gruppo: g, nome: 'senza risposte il ritorno porta ad Allenati · Quiz, con il fuoco sul risultato della ricerca', ok: ritorno.ok, extra: JSON.stringify(ritorno.valore) });
    });
  } finally { await c.chiudi(); }
}

/**
 * Le scelte con l'account: «Scelte salvate» solo con i valori riletti, e nessuna
 * promessa se il server non dichiara i due campi. Dal P-88 la raccolta la
 * accende la parte, su qualunque pagina: accesa sul server per «dichiarati» e
 * «ignorati», spenta davvero per «non dichiarati» — `campi_profilo` senza le
 * scelte, e un 422 a chi le mandasse —, invece di una descrizione dell'account
 * a cui si tolgono campi.
 */
const SCELTE_ACCESE = Object.freeze({ scelte_di_preparazione: true });
const SCELTE_SPENTE = Object.freeze({ scelte_di_preparazione: false });
/** Le richieste al profilo che portano una scelta di preparazione non nulla. */
const scelteMandate = (tab) => tab.richieste.filter((r) => r.metodo === 'PUT' && /\/v1\/profilo$/.test(new URL(r.url).pathname) && (() => {
  try { const o = JSON.parse(r.corpo || '{}'); return o.abilitazione != null || o.conseguimento != null; } catch { return false; }
})());
async function n01scelte(b, ctx, v, g) {
  for (const caso of ['dichiarati', 'ignorati', 'non dichiarati']) {
    if (!perParte(ctx, v, g, caso === 'non dichiarati' ? SCELTE_SPENTE : SCELTE_ACCESE)) continue;
    const K = await nuovoAccount(ctx, 'n01s');
    const c = await b.nuovoContesto();
    try {
      const tab = await c.apri(null);
      // Un server che risponde 200 e ignora i due campi: li rilegge com'erano.
      if (caso === 'ignorati') await tab.intercetta(ctx.api + '/v1/profilo', async (req, params, { corpo }) => {
        if (req.method !== 'PUT' || params.responseStatusCode !== 200) return null;
        const o = JSON.parse(await corpo()); o.abilitazione = null; o.conseguimento = null; return finti(ctx, 200, o);
      }, { fase: 'Response' });
      await tab.vai(ctx.sito + '/');
      await fermaAlPrimo(v, async (w) => {
        w.push({ gruppo: g, nome: `scelte, campi ${caso}: dentro l'account, con la raccolta ${caso === 'non dichiarati' ? 'spenta' : 'accesa'} sul server`, ok: await entraImitando(ctx, tab, K, 'oggi'), extra: 'l\'accesso non riesce' });
        await tocca(tab, null, '#conto-porta'); await tab.attendi(modaleVisibile, REAZIONE);
        await clicca(tab, 'Che cosa stai preparando?');
        const modulo = await tab.attendiValore(js(`const m = M(); return m.querySelector && m.querySelector('[name="abilitazione"]') ? m.innerText : null;`), Boolean, REAZIONE);
        const promette = !!modulo.valore && modulo.valore.includes('Le scelte vengono conservate nel tuo account');
        const dice = !!modulo.valore && modulo.valore.includes('Il server collegato non conserva ancora queste scelte');
        w.push({ gruppo: g, nome: caso === 'non dichiarati' ? 'senza campi_profilo il modulo non promette la conservazione, e lo dice' : 'il modulo dice che le scelte si conservano dopo la conferma del server',
          ok: modulo.ok && (caso === 'non dichiarati' ? !promette && dice : promette && !dice), extra: String(modulo.valore).slice(0, 300) });
        await tab.valuta(js(`M().querySelector('[name="abilitazione"][value="motore"]').click(); M().querySelector('[name="conseguimento"][value="prima"]').click(); return true;`));
        await clicca(tab, testi(ctx).salvaData);
        await finche(async () => !await tab.valuta(testoVisibile('Salvataggio delle scelte in corso')), REAZIONE);
        const salvate = await maiPer(async () => await tab.valuta(testoVisibile('Scelte salvate')), 1500).then((x) => !x);
        const db = ctx.scelteDi(K.email);
        if (caso === 'dichiarati') {
          w.push({ gruppo: g, nome: '«Scelte salvate», e nel database le due scelte', ok: salvate && db.abilitazione === 'motore' && db.conseguimento === 'prima', extra: `${JSON.stringify(db)}; ${await tab.valuta(inSchermata)}` });
        } else {
          const motivo = caso === 'ignorati' ? 'Le scelte non sono state salvate' : 'Le altre scelte valgono solo per questa pagina';
          w.push({ gruppo: g, nome: caso === 'ignorati' ? 'un 200 che rilegge valori diversi non e\' «Scelte salvate»: la pagina lo dice' : 'senza campi_profilo nessun «Scelte salvate», e le scelte non vanno al server',
            ok: !salvate && await tab.valuta(testoVisibile(motivo)) && (caso === 'ignorati' || (db.abilitazione == null && db.conseguimento == null && !scelteMandate(tab).length)),
          extra: `${scelteMandate(tab).length ? `mandate al server che non le raccoglie: ${scelteMandate(tab).map((r) => r.corpo).join('; ')}; ` : ''}${JSON.stringify(db)}; ${await tab.valuta(TESTO_VISTO('[aria-modal="true"]'))} ${JSON.stringify(tab.richieste.filter((r) => r.url.includes('/v1/')).map((r) => r.metodo + ' ' + new URL(r.url).pathname + (r.fallita ? ' FALLITA' : '')))}` });
        }
      });
    } finally { await c.chiudi(); }
  }
}

/** Il gruppo, per parti: una parte ognuna, e i tragitti per stato. */
const PARTI_N01 = ['documento', 'cronologia', 'indirizzi', 'storage', 'invito', 'registrazione', 'stati', 'gesti', 'ricerca', 'scelte', 'tragitti-H0', 'tragitti-H1', 'tragitti-HA'];
const N01_API = new Set(['registrazione', 'stati', 'gesti', 'scelte', 'tragitti-H0', 'tragitti-H1', 'tragitti-HA']);
async function n01(b, ctx, v, parte) {
  const g = 'N-01';
  if (ctx.regime !== 'ridisegno') {
    v.push({ gruppo: g, nome: 'il gruppo dei tragitti si applica a una pagina nel regime del ridisegno', ok: false, extra: `regime letto: ${ctx.regime}` });
    return;
  }
  const vuole = (x) => !parte || parte === x;
  const fn = { documento: n01documento, cronologia: n01cronologia, indirizzi: n01indirizzi, storage: n01storage, invito: n01invito,
    registrazione: n01registrazione, stati: n01stati, gesti: n01gesti, ricerca: n01ricerca, scelte: n01scelte };
  for (const p of PARTI_N01) {
    if (!vuole(p)) continue;
    const gp = `${g}:${p}`;
    if (p.startsWith('tragitti-')) await n01tragitti(b, ctx, v, p.slice(9), gp);
    else await fn[p](b, ctx, v, gp);
  }
}

// --- C-23: i due conti che P-81 ha trovato e corretto (P-89) ---------------------------
//
// Realizzando il ridisegno, P-81 ha trovato nella sua copia due conti sbagliati
// e li ha corretti prima della merge (docs/ridisegno-progetto.md §10.1, «Riparato
// nella copia»): una risposta senza account applicata due volte allo specchio —
// una riga, `n: 2`, contro `n: 1` di `E.ripiega()` —, e una coda con una risposta
// e un segnalibro detta «2 risposte da inviare». Erano muti tutti e due, e qui
// diventano due controlli sulla pagina vera.
//
// **Lo specchio non si vede.** Senza account nessun numero in schermata dice
// quante volte una risposta e' entrata nello specchio: la copertura cumulativa
// e' dei registrati (ADR-004), e `stato()` dice «chiuso» con `n: 1` come con
// `n: 2`. Il banco lo legge quindi da un aggancio del contratto, e non da uno
// stato della pagina, che e' fuori portata in uno script di modulo: la pagina
// passa le sue righe a `E.riepilogoPagina()` (R-ARCH-19, «Le attivita' di questa
// pagina») e il suo specchio alle selezioni dei quiz come secondo argomento —
// `E.coda()`, `E.mirata()`, `E.daAllenare()`, `E.estraiNuoviPrima()`, la
// `fonte` dei raccordi dei quiz (area 2 §10.1) e di `preparaBreve()`. Il banco
// serve `/engine.js` con una coda che registra quegli argomenti — il motore
// com'e', con cinque funzioni rivestite —, e confronta lo specchio visto con
// `E.ripiega()` sulle righe viste. Il resto della pagina non si tocca.
const STRUMENTO_SPECCHIO = `
;{
  const reg = (globalThis.__specchioBanco = { righe: null, visto: null });
  const copia = (x) => JSON.parse(JSON.stringify(x));
  const _riepilogo = riepilogoPagina;
  riepilogoPagina = function (righe, ...resto) { reg.righe = copia(righe); return _riepilogo(righe, ...resto); };
  const vedi = (items, progress) => {
    if (Array.isArray(items) && items.length && items[0] && 'x' in items[0] && progress && typeof progress === 'object') reg.visto = copia(progress);
  };
  const _coda = coda; coda = function (items, progress, ...resto) { vedi(items, progress); return _coda(items, progress, ...resto); };
  const _mirata = mirata; mirata = function (items, progress, ...resto) { vedi(items, progress); return _mirata(items, progress, ...resto); };
  const _daAllenare = daAllenare; daAllenare = function (items, progress, ...resto) { vedi(items, progress); return _daAllenare(items, progress, ...resto); };
  const _estrai = estraiNuoviPrima; estraiNuoviPrima = function (items, progress, ...resto) { vedi(items, progress); return _estrai(items, progress, ...resto); };
}
`;
const SPECCHIO_VISTO = `(() => { const r = window.__specchioBanco; return r ? JSON.stringify(r) : null; })()`;
/** Un oggetto con le chiavi in ordine, per confrontare due specchi senza dipendere dall'ordine d'inserimento. */
const canonico = (x) => (Array.isArray(x) ? x.map(canonico) : x && typeof x === 'object'
  ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, canonico(x[k])])) : x);

async function c23(b, ctx, v, parte) {
  const vuole = (x) => !parte || parte === x;
  if (vuole('specchio')) await fermaAlPrimo(v, (w) => c23specchio(b, ctx, w, 'C-23:specchio'));
  if (vuole('coda')) await fermaAlPrimo(v, (w) => c23coda(b, ctx, w, 'C-23:coda'));
}

/** R-ARCH-20: senza account, dopo una risposta lo specchio della pagina e' quello di E.ripiega() sulle sue righe. */
async function c23specchio(b, ctx, v, g) {
  ctx.sostituisci('/engine.js', readFileSync(join(SITE, 'engine.js'), 'utf8') + STRUMENTO_SPECCHIO);
  const c = await b.nuovoContesto();
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    const pronto = await tab.attendi(PRONTO, CARICO);
    v.push({ gruppo: g, nome: 'la pagina si apre con il motore del banco, che registra righe e specchio', ok: pronto && !!await tab.valuta(SPECCHIO_VISTO),
      extra: pronto ? 'window.__specchioBanco non c\'e\': /engine.js non e\' quello servito dal banco' : `nessun [data-rotta-start] abilitato entro ${CARICO / 1000} s` });
    await avviaPrima(tab);
    const testo = await rispondiQuiz(tab, [], g, '');
    v.push({ gruppo: g, nome: 'senza account, una risposta', ok: !!testo, extra: 'il runner non mostra un quesito della banca' });
    v.push({ gruppo: g, nome: 'e il suo riepilogo', ok: await chiudiQuiz(tab, [], g, ''), extra: 'nessun riepilogo' });
    // Da qui le chiamate sono tutte dopo la risposta: la Home con le attivita'
    // della pagina (riepilogoPagina) e la sua proposta, poi la preparazione del
    // breve (le selezioni). La pagina vera tiene la lista del breve fatta prima;
    // la proposta della Home, `selezioneQuiz('mirata')`, la rifa' ogni volta.
    await tab.valuta('window.__specchioBanco.righe = null; window.__specchioBanco.visto = null; true');
    await clic(tab, '[data-ciclo="ritorno"]');
    await apriPorta(tab, 'oggi');
    await tab.attendi(PRONTO, REAZIONE);
    await clic(tab, '[data-rotta-start]');
    const letto = await tab.attendiValore(SPECCHIO_VISTO, (x) => { const r = x && JSON.parse(x); return !!r && !!r.righe && !!r.visto; }, REAZIONE);
    const reg = letto.valore ? JSON.parse(letto.valore) : {};
    const risposte = (reg.righe || []).filter((r) => r._t === 'q');
    v.push({ gruppo: g, nome: 'dopo la risposta la pagina passa al motore le sue righe e il suo specchio', ok: letto.ok && risposte.length === 1,
      extra: !letto.ok ? `righe ${reg.righe ? 'viste' : 'mai passate a riepilogoPagina()'}, specchio ${reg.visto ? 'visto' : 'mai passato a coda()'}` : `fra le righe ${risposte.length} risposte ai quiz, ne aspettava 1` });
    if (!letto.ok) return;
    const atteso = E.ripiega(reg.righe).quiz;
    const id = risposte[0] && risposte[0].item_id;
    v.push({ gruppo: g, nome: 'senza account una risposta si applica una volta sola: lo specchio della pagina e\' quello di E.ripiega() sulle sue righe',
      ok: JSON.stringify(canonico(reg.visto)) === JSON.stringify(canonico(atteso)),
      extra: `per ${id}: la pagina ha ${JSON.stringify(reg.visto[id] || null)}, ripiega() ${JSON.stringify(atteso[id] || null)}` });
  } finally { await c.chiudi(); }
}

/** R-SEGNO-04: con l'account una coda con una risposta e un segnalibro si dice «1 risposta da inviare». */
async function c23coda(b, ctx, v, g) {
  const U = await nuovoAccount(ctx, 'c23');
  const c = await b.nuovoContesto();
  // La rete che non risponde, come in T-02: ogni richiesta all'API resta ferma
  // finche' il banco non la lascia, e la coda resta com'e'.
  let tieni = false, lascia;
  const via = new Promise((r) => { lascia = r; });
  try {
    const tab = await c.apri(ctx.sito + ingresso(ctx));
    await tab.intercetta(ctx.api + '/*', async () => { if (!tieni) return null; await via; return { fallisci: 'InternetDisconnected' }; });
    v.push({ gruppo: g, nome: 'si entra nell\'account', ok: await dentro(tab, U), extra: `in schermata: ${await tab.valuta(inSchermata)}` });
    tieni = true;
    const it = UNIVOCI[3];
    v.push({ gruppo: g, nome: `il quesito ${it.p} si apre per numero, e si sbaglia`, ok: await apriPerNumero(tab, it) && await rispondiCome(tab, it, false),
      extra: await tab.valuta(inSchermata) });
    v.push({ gruppo: g, nome: 'e gli si mette un segnalibro', ok: await gesto(tab, null, '#r-segno', js(`return document.querySelector('#r-segno').getAttribute('aria-pressed') === 'true'`)),
      extra: 'il segnalibro non si accende' });
    const fonte = await tab.attendiValore(COPIA(U.chiave), (x) => !!x && x.coda.daInviare.length === 2, REAZIONE);
    const tipi = fonte.valore ? fonte.valore.righe.filter((r) => fonte.valore.coda.daInviare.includes(String(r.uid))).map((r) => r._t).sort().join(',') : '';
    v.push({ gruppo: g, nome: 'nella coda della copia ci sono due righe, una risposta e un segnalibro', ok: fonte.ok && tipi === 'b,q',
      extra: fonte.valore ? `in coda: ${fonte.valore.coda.daInviare.length} righe, tipi ${tipi}` : 'la copia dell\'account non si legge' });
    const n = await tab.attendiValore(DA_INVIARE, (x) => x === 1, REAZIONE);
    const due = await tab.valuta(testoRe(/\b2 risposte da inviare/));
    v.push({ gruppo: g, nome: 'la pagina dice «1 risposta da inviare»: il segnalibro non e\' una risposta', ok: n.ok && !due,
      extra: `la pagina dice «${n.valore ?? 'nessun numero'} risposte da inviare», con 1 risposta e 1 segnalibro in coda` });
  } finally { lascia(); await c.chiudi(); }
}

const GRUPPI = { 'C-01': c01, 'C-02': c02, 'C-03': c03, 'C-04': c04, 'C-05': c05, 'C-06': c06, 'C-07': c07, 'C-08': c08, 'C-21': c21,
  'C-10': c10, 'C-11': c11, 'C-12': c12, 'C-13': c13, 'C-14': c14, 'C-15': c15, 'C-16': c16, 'C-17': c17, 'C-19': c19,
  // L'area 6 (P-45): la rifinitura trasversale.
  'T-01': t01, 'T-02': t02, 'T-03': t03, 'T-04': t04, 'T-05': t05, 'T-06': t06, 'T-07': t07, 'T-08': t08, 'T-09': t09, 'T-10': t10, 'T-11': t11, 'T-12': t12, 'T-13': t13,
  // Il volto, la Home al computer «U — Terra beige» (P-97, volto-progetto §6.4).
  'T-15': t15,
  // Le frasi del riepilogo dei quiz (P-53, R-UX-06).
  'F-01': f01,
  // Le condizioni per l'account nel modulo di registrazione (P-57, R-ACC-75).
  'C-20': c20,
  // L'offline se ne va (P-60, ADR-005).
  'C-22': c22,
  // «Com'e' andata» e la riga d'avvio delle simulazioni (P-74, esito-esame-progetto §10.1).
  'E-01': e01, 'P-01': p01,
  // I tragitti del ridisegno, in Chrome (P-82, ridisegno-progetto §9 e §10.1, E).
  'N-01': n01,
  // I due conti che P-81 ha trovato e corretto (P-89).
  'C-23': c23 };
// I gruppi che parlano con l'API: il server accetta una sola origine (§7.3),
// quindi girano uno alla volta sul sito principale. Gli altri girano in
// parallelo, ognuno con il suo sito e quindi con la sua origine.
const CON_API = new Set(['C-05', 'C-04', 'C-06', 'C-07', 'C-08', 'C-21', 'C-10', 'C-11', 'C-12', 'C-13', 'C-14', 'C-15', 'C-16', 'C-17', 'C-19',
  'T-02', 'T-03', 'T-04', 'T-07:conto', 'T-15:stati', 'E-01', 'P-01', 'C-23:coda', ...[...N01_API].map((x) => `N-01:${x}`)]);
const SOLO_ALTRE = new Set(['C-14']);
// Una parte puo' parlare con l'API anche se il suo gruppo no: T-07:conto entra
// in un account, T-07:prova no, e gira dove c'e' posto.
const usaApi = (gr) => CON_API.has(gr) || CON_API.has(gr.split(':')[0]);

async function servi(corrente) {
  const s = sito(corrente);
  await new Promise((ok) => s.listen(0, '127.0.0.1', ok));
  // close() aspetta che ogni connessione finisca, e una scheda chiusa mentre
  // navigava ne lascia una aperta: misurato il 18 ottobre 2026 (P-87), la
  // rottura di C-22 che ricarica le pagine aperte appendeva il banco due giri
  // su venti, qui. Alla fine di una prova le connessioni si chiudono e basta.
  return { s, origine: `http://localhost:${s.address().port}`, chiudi: () => new Promise((ok) => { s.close(ok); s.closeAllConnections(); }) };
}

/**
 * Un gruppo, o una sua parte: «C-06» li esegue tutti, «C-06:corsa» solo la
 * corsa fra schede. Le rotture chiedono solo la parte che rompono, cosi' non
 * pagano il resto del gruppo.
 */
async function gruppo(b, ctx, gr) {
  const v = [];
  const [nome, parte] = gr.split(':');
  // I contesti che il gruppo apre, per leggere alla fine se Chrome li ha
  // disegnati (P-99): un browser che non disegna da' rossi sparsi sul fuoco,
  // sullo scorrimento e sulle misure, e qui si dice una volta sola perche'.
  const contesti = [];
  const proprio = { ...b, nuovoContesto: async (...a) => { const c = await b.nuovoContesto(...a); contesti.push(c); return c; } };
  try { await GRUPPI[nome](proprio, ctx, v, parte || null); } catch (e) { v.push({ gruppo: nome, nome: `il gruppo ${gr} si esegue`, ok: false, extra: e.message }); }
  const nascoste = contesti.flatMap((c) => c.nascoste || []);
  if (nascoste.length) v.push({ gruppo: nome, nome: `Chrome ha disegnato le schede di ${gr}`, ok: false,
    extra: `${nascoste.length} finestre con la scheda davanti non 'visible' alla chiusura, quindi senza frame: ${JSON.stringify(nascoste.slice(0, 3))}` });
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
  // Le raccolte nuove (P-86, account-progetto §2.7-bis): ogni gruppo comincia
  // con il server com'e' nel codice del tag — oggi spente —, su qualunque
  // pagina, e la parte che prova una raccolta la accende, o la spegne davvero,
  // con `ctx.conRaccolte()` (P-88). Fino a P-88 le accendeva la pagina: quelle
  // di riferimento tutte, quella vera nessuna, e la pagina vera del ridisegno
  // non poteva passare N-01:scelte prima del rilascio che le accende sul
  // server vero (ridisegno-progetto §10.1, «I tre punti», 3). Un riavvio della
  // corsia (C-14) le rimette come erano.
  let raccolte = { ...RACCOLTE };
  const accendi = (porta) => avvia({ db: percorsoDb, cancellazioni, porta, raccolte,
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
    radice: (d) => { corrente.radice = d; },
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
    // --- per C-10:avvio (P-86): quali raccolte il server della corsia ha accese.
    raccolte: () => api.raccolte(),
    // --- per la parte che prova una raccolta (P-88): la accende, o la spegne
    // davvero, sul server di questa corsia, per il resto del gruppo. Un nome o un
    // valore sbagliato lanciano (raccolteDa), invece di non accendere niente.
    conRaccolte: (x) => { raccolte = api.cambiaRaccolte(x); return { ...raccolte }; },
    // --- per N-01 (P-82): le scelte di preparazione nel profilo (P-83).
    scelteDi: (email) => api.db.prepare('SELECT abilitazione, conseguimento FROM account WHERE email = ?').get(email),
    // --- per E-01 (P-74): gli esiti dell'esame, scritti e letti nel database.
    esito: (email, giorno, prova, esito, errori = null) => api.db.prepare('INSERT INTO esito (account_id, giorno, prova, esito, errori, detto_il, cambiato_il) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(ctx.conto(email).id, giorno, prova, esito, errori, new Date(orologio.t).toISOString(), new Date(orologio.t).toISOString()),
    togliEsiti: (email) => api.db.prepare('DELETE FROM esito WHERE account_id = ?').run(ctx.conto(email).id),
    esitiDi: (email) => esitiDb(api.db, ctx.conto(email).id),
    // Un file del sito diverso da quello di site/, per il resto del gruppo: e' cosi'
    // che P-01:errore serve un motore con un metodo che lancia.
    sostituisci: (percorso, testo) => { corrente.sito = { ...(corrente.sito || {}), [percorso]: testo }; },
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
      corrente.sito = p.sito;
      corrente.ingresso = p.ingresso || '/';
      ctx.ingresso = corrente.ingresso;
      ctx.regimi = p.regimi || {};
      ctx.regime = p.regime || 'di prima';
      // Per parte, non per pagina (P-88): il gruppo comincia dal codice.
      raccolte = api.cambiaRaccolte({ ...RACCOLTE });
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
        // L'ingresso e il regime sono della prova: fino a P-82 qui si prendevano
        // quelli che la corsia 0 aveva in quel momento, e la pagina si serviva
        // sempre su /app — nel ridisegno, un ingresso sbagliato senza un rosso.
        const proprio = { pagina: x.p.pagina, sito: x.p.sito, ingresso: x.p.ingresso || '/' };
        const sv = await servi(proprio);
        try {
          // La pagina di questi gruppi non e' riscritta: parla con la 8620, e il
          // banco guarda quell'indirizzo anche se la corsia 0 ascolta altrove.
          const ctx = { ...corsie[0].ctx, sito: sv.origine, api: `http://localhost:${PORTA_API}`, spegni: (si) => { proprio.spento = si; }, radice: (d) => { proprio.radice = d; },
            scala:x.p.scala, eccezioniScala:x.p.eccezioniScala, ingresso: proprio.ingresso, regimi: x.p.regimi || {}, regime: x.p.regime || 'di prima',
            // Una parte senza API non tocca il server della corsia 0, che intanto porta un altro gruppo.
            conRaccolte: () => { throw new Error(`${x.g} non parla con l'API: non accende raccolte`); },
            sostituisci: (percorso, testo) => { proprio.sito = { ...(proprio.sito || {}), [percorso]: testo }; } };
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
