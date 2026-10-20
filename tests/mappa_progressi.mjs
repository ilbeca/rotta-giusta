// Il banco della mappa di Progressi — l'area 5, nella pagina vera da P-23.
//
// Lo chiama tests/test_interfaccia.py, e non gira da solo sotto `node --test`:
// legge da stdin `{"pagina": "<testo di una pagina>"}` e scrive su stdout la
// lista delle verifiche, `[{gruppo, nome, ok, extra}]`.
//
// Il ridisegno (P-80, docs/ridisegno-progetto.md §10.1) pretende in piu' i
// cinque stati — `stati` sul totale e su ogni riga, da una `E.contaStati()`
// per aggregato con il filtro della riga — e i due raccordi di «Allena»,
// `anteprimaAllenaProgressi(riga, richiesta)` e `avviaAllenaProgressi(
// preparazione, richiesta, avvia)`. Fino a P-89 i regimi erano due, e il
// regime di prima del ridisegno non li chiedeva: dalla merge di P-81 ogni
// pagina li deve avere.
//
// Perche' non bastano i test del motore. `quadro()` e `dovePesa()` sono
// coperti da R-MAPPA-01…13 (P-41): contano giusto. Ma la pagina puo' chiamarli
// e poi riordinare i temi per errori, mettere un tetto di 20 a «Rifai 35
// errori», aprire `soloSbagliate` al posto di `soloDaRifare`, scrivere «X su Y»
// sotto la soglia, inventare un peso per le voci della vela o una frase quando
// il motore non ne da' — e nessun test del motore se ne accorge. E' il difetto
// di casa, il numero promesso e la lista che si apre da due fonti, spostato
// nella colla fra pagina e motore: P-06 lo ha chiuso per la selezione dei quiz,
// P-31 per il ciclo, questo per la mappa (docs/area-5-progetto.md §10.1).
//
// Che cosa fa. Estrae dalla pagina le tre funzioni di raccordo —
// `mappaProgressi(richiesta)`, `anteprimaProgressi(azione, richiesta)`,
// `avviaProgressi(azione, richiesta, avvia)` — con le funzioni di primo
// livello che nominano, e le esegue con la banca vera, storici sintetici di
// forme diverse e un `E` che registra ogni chiamata e poi esegue quella vera.
// La richiesta e' congelata: una funzione che la scrive lancia. Poi confronta
// righe, frase e selezioni con quello che il motore da' sugli stessi dati, e
// fa il giro mappa → anteprima → avvio con i dati che cambiano fra un clic e
// l'altro.
//
// Che cosa NON fa. Non guarda i testi («Visti Y su N», «Troppo poche risposte
// per dire come va», «Dove pesa di più adesso»), il disegno della barra, il
// dettaglio che si apre, il focus, i ritorni, la geometria a 375 px, gli stati
// d'accesso del client, prove, andamento e sessioni: sono DOM e browser, e
// restano al collaudo della realizzazione (§9 del progetto). Un disegno che
// scrivesse numeri presi da un'altra parte, invece che dal risultato del
// raccordo, passerebbe: del collegamento con la pagina il banco legge solo che
// il raccordo sia l'unico a chiedere la mappa, e che Inizia passi da lui.

import { readFileSync } from 'node:fs';
import { MOTORE, nelSito } from './sito.mjs';
// Il motore e la banca della cartella del sito: site/, o la copia di RG_SITO (P-84).
const REALE = await import(MOTORE);
import { funzioni, conDipendenze, dipendenze, scriptModulo } from './pagina_js.mjs';

const RACCORDO = ['mappaProgressi', 'anteprimaProgressi', 'avviaProgressi'];
const RACCORDO_ALLENA = ['anteprimaAllenaProgressi', 'avviaAllenaProgressi'];
// Le funzioni del motore che contano o scelgono. Nel raccordo della mappa ci
// sono solo `quadro()` e `dovePesa()`; nell'anteprima `coda()`. Le altre sono
// una seconda fonte: `diagnosi()` per rifare l'ordine, `classifica()` per
// ricontare i tre stati. `consigli()`, la lista uscita con la mappa, non c'e'
// piu' nemmeno nel motore (P-47): una pagina che la chiamasse lancerebbe, e il
// controllo del collegamento lo dice prima, per nome.
const REGISTRATE = ['quadro', 'dovePesa', 'diagnosi', 'coda', 'classifica', 'stato', 'sbagliato', 'contaStati', 'statoQuesito',
  'daAllenare', 'mirata', 'screening', 'simulazione', 'simulazioneVela', 'estrai', 'estraiNuoviPrima',
  'giroTecniche', 'tappeto', 'provaCarteggio', 'erroriSessione', 'serieGruppi'];

const verifiche = [];
function check(gruppo, nome, ok, extra = '') {
  verifiche.push({ gruppo, nome, ok: !!ok, extra: ok ? '' : extra });
}

// --- la banca vera, e storici di forme diverse ------------------------------

function congela(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x);
    for (const v of Object.values(x)) congela(v);
  }
  return x;
}
const items = congela(JSON.parse(readFileSync(nelSito('dati/quiz.json'), 'utf8')));
const meta = JSON.parse(readFileSync(nelSito('dati/meta.json'), 'utf8'));
const OGGI = '2026-09-30';
const B = items.filter((x) => x.k === 'base');
const V = items.filter((x) => x.k === 'vela');

// I pesi della richiesta non sono quelli del decreto: due temi scambiati. Una
// pagina che li scrive a mano invece di leggerli dalla richiesta da' un peso
// diverso da quello del motore, e il rosso lo dice — con i pesi veri passerebbe
// per coincidenza, come la prova vela da 5 domande di P-06.
const PESI = { ...meta.pesi_esame };
{
  const ks = Object.keys(PESI).sort((a, b) => PESI[a] - PESI[b]);
  const [a, b] = [ks[0], ks[ks.length - 1]];
  [PESI[a], PESI[b]] = [PESI[b], PESI[a]];
}
congela(PESI);

const perVoce = (kind) => {
  const m = new Map();
  for (const it of items) if (it.k === kind) {
    const k = it.t + ' › ' + it.v;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(it);
  }
  return [...m.values()];
};
// La voce base piu' grande, e un'altra del suo tema: servono piu' di 20 errori
// aperti in una voce sola, e piu' di 30 nel tema (§9 del progetto, A-04).
const vociBase = perVoce('base').sort((a, b) => b.length - a.length);
const VA1 = vociBase[0];
const TA = VA1[0].t;
const VA2 = vociBase.find((v) => v[0].t === TA && v !== VA1 && v.length >= 12);
const TB = vociBase.find((v) => v[0].t !== TA)[0].t;
const VC = vociBase.find((v) => v[0].t !== TA && v[0].t !== TB && v.length >= 6);
const vociVela = perVoce('vela');

function storico(passi) {
  const p = {};
  for (const [it, ok, giorno] of passi) REALE.applica(p, it.id, ok, 11000, giorno);
  return p;
}
const passiRicco = [
  // TA, voce grande: 25 errori aperti, 3 errori ripresi, 4 giuste.
  ...VA1.slice(0, 25).map((it) => [it, false, '2026-09-20']),
  ...VA1.slice(25, 28).flatMap((it) => [[it, false, '2026-09-18'], [it, true, '2026-09-25']]),
  ...VA1.slice(28, 32).map((it) => [it, true, '2026-09-21']),
  // TA, un'altra voce: 10 errori aperti, 2 giuste.
  ...VA2.slice(0, 10).map((it) => [it, false, '2026-09-22']),
  ...VA2.slice(10, 12).map((it) => [it, true, '2026-09-22']),
  // TB: tre viste, sotto la soglia di «X su Y».
  ...B.filter((x) => x.t === TB).slice(0, 3).map((it) => [it, true, '2026-09-23']),
  // Un terzo tema: sei viste, quattro giuste alla prima.
  ...VC.slice(0, 4).map((it) => [it, true, '2026-09-24']),
  ...VC.slice(4, 6).map((it) => [it, false, '2026-09-24']),
  // La vela: una voce con sei viste, un'altra con due.
  ...vociVela[0].slice(0, 5).map((it) => [it, true, '2026-09-26']),
  [vociVela[0][5], false, '2026-09-26'],
  ...vociVela[1].slice(0, 2).map((it) => [it, false, '2026-09-27']),
];
const RICCO = congela(storico(passiRicco));
// Sotto la soglia della frase: cinque viste, tre errori.
const SCARSO = congela(storico([...VA1.slice(0, 3).map((it) => [it, false, '2026-09-20']),
  ...VA2.slice(0, 2).map((it) => [it, true, '2026-09-20'])]));
// Tutto giusto: nessun pulsante, e la frase manca per «niente da fare».
const TUTTO = congela(storico(B.map((it) => [it, true, '2026-09-10'])));

// Quasi tutto giusto: 25 errori aperti e 10 mai visti in un tema solo. La
// frase parla di quello, per «da rifare», con i due pulsanti.
const QUASI = congela(storico([
  ...B.filter((x) => x.t !== TA || !VA1.slice(0, 35).includes(x)).map((it) => [it, true, '2026-09-10']),
  ...VA1.slice(0, 25).map((it) => [it, false, '2026-09-20']),
]));

const richiesta = (progress, kind = 'base', extra = {}) =>
  congela({ banca: items, progress, oggi: OGGI, kind, pesi: PESI, ...extra });

// --- l'esecuzione ----------------------------------------------------------

let chiamate = [];
const E = new Proxy(REALE, {
  get(t, k) {
    if (!REGISTRATE.includes(k)) return t[k];
    return (...args) => { const r = t[k](...args); chiamate.push({ f: k, args, r }); return r; };
  },
});

function esegui(fn, ...args) {
  chiamate = [];
  try {
    return { esito: fn(...args), chiamate };
  } catch (e) {
    return { errore: e, chiamate };
  }
}

const uguale = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const stessa = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => x === b[i]);
const ids = (l) => (Array.isArray(l) ? l.map((x) => x && x.id) : l);
const nomi = (cs) => cs.map((c) => c.f).join(', ') || 'nessuna';
const breve = (x) => { const s = JSON.stringify(x); return s && s.length > 160 ? s.slice(0, 160) + '…' : s; };

/** Si esegue senza lanciare; altrimenti rosso che dice perche'. */
function riuscita(g, nome, run) {
  if (!run.errore) return true;
  const m = run.errore.message;
  check(g, nome + ': si esegue', false, 'lancia: ' + m
    + (run.errore instanceof ReferenceError ? ' — il raccordo deve dipendere solo dai suoi argomenti, '
      + 'da E e dalle funzioni di primo livello' : '')
    + (run.errore instanceof TypeError && /read.only|frozen|not extensible|Cannot (assign|add|delete)/i.test(m)
      ? ' — ha provato a scrivere nella richiesta: disegnare la mappa non cambia i dati' : ''));
  return false;
}

// --- 1. la mappa: righe e frase dal motore, senza rifarle -------------------

/** Le differenze fra le righe della pagina e quelle del motore, campo per campo. */
function differenze(pagina, motore, dove, out) {
  if (!Array.isArray(pagina) || pagina.length !== motore.length
    || pagina.some((r, i) => !r || r.nome !== motore[i].nome)) {
    out.ordine.push(`${dove}: ${breve(Array.isArray(pagina) ? pagina.map((r) => r && r.nome) : pagina)}`
      + ` invece di ${breve(motore.map((r) => r.nome))}`);
    return;
  }
  motore.forEach((m, i) => {
    const p = pagina[i];
    const qui = `${dove} «${m.nome}»`;
    for (const k of ['n', 'giusti', 'daRifare', 'maiVisti', 'visti'])
      if (p[k] !== m[k]) out.stati.push(`${qui}: ${k} ${p[k]} invece di ${m[k]}`);
    if (!uguale(p.primo, m.primo)) out.primo.push(`${qui}: ${breve(p.primo)} invece di ${breve(m.primo)}`);
    if (!uguale(p.peso, m.peso)) out.peso.push(`${qui}: ${breve(p.peso)} invece di ${breve(m.peso)}`);
    for (const k of Object.keys(m))
      if (!['n', 'giusti', 'daRifare', 'maiVisti', 'visti', 'primo', 'peso', 'voci'].includes(k) && !uguale(p[k], m[k]))
        out.altro.push(`${qui}: ${k} ${breve(p[k])} invece di ${breve(m[k])}`);
    const a = p.azione;
    if (m.daRifare > 0) {
      if (!a || a.quanti !== m.daRifare || !uguale(a.selezione, m.rifai))
        out.azione.push(`${qui}: ${breve(a && { quanti: a.quanti, selezione: a.selezione })} invece di `
          + breve({ quanti: m.daRifare, selezione: m.rifai }));
    } else if (a != null) {
      out.zero.push(`${qui}: un pulsante ${breve(a)} con zero errori da rifare`);
    }
    if (m.voci) differenze(p.voci, m.voci, qui + ', voci', out);
  });
}

function confrontaMappa(nome, rich, attesa) {
  const run = esegui(mappaProgressi, rich);
  if (!riuscita('righe', nome, run)) return null;
  const r = run.esito || {};
  // Il motore sugli stessi dati: e' il riferimento, non una seconda implementazione.
  const q = REALE.quadro(rich.banca, rich.progress, rich.oggi, rich.kind, rich.pesi);
  const d = REALE.dovePesa(q);
  const ind = rich.kind === 'base' ? d.indicazione : null;
  const ass = rich.kind === 'base' ? d.assente : 'senza pesi';

  // Le chiamate: una a quadro(), con i dati della richiesta; dovePesa() sul suo
  // risultato; nient'altro che conti.
  const qc = run.chiamate.filter((c) => c.f === 'quadro');
  const dc = run.chiamate.filter((c) => c.f === 'dovePesa');
  const altre = run.chiamate.filter((c) => c.f !== 'quadro' && c.f !== 'dovePesa' && c.f !== 'contaStati');
  check('righe', nome + ': una sola chiamata a E.quadro(), con banca, storico, giorno e banca della richiesta',
    qc.length === 1 && qc[0].args[0] === rich.banca && qc[0].args[1] === rich.progress
      && qc[0].args[2] === rich.oggi && qc[0].args[3] === rich.kind,
    qc.length + ' chiamate' + (qc[0] ? ', argomenti ' + JSON.stringify([qc[0].args[0] === rich.banca,
      qc[0].args[1] === rich.progress, qc[0].args[2], qc[0].args[3]]) : '')
      + ' — righe, frase e pulsanti vengono dallo stesso oggetto');
  if (rich.kind === 'base') {
    check('righe', nome + ': i pesi sono quelli della richiesta', qc[0] && uguale(qc[0].args[4], rich.pesi),
      'pesi passati: ' + breve(qc[0] && qc[0].args[4]) + ' — si leggono da meta.pesi_esame attraverso la '
        + 'richiesta, non si scrivono in pagina');
  }
  check('frase', nome + ': la frase la decide E.dovePesa(), sullo stesso quadro',
    rich.kind === 'base' ? dc.length === 1 && qc[0] && dc[0].args[0] === qc[0].r : dc.every((c) => qc[0] && c.args[0] === qc[0].r),
    dc.length + ' chiamate a dovePesa' + (dc[0] && qc[0] && dc[0].args[0] !== qc[0].r ? ', su un quadro rifatto' : ''));
  check('righe', nome + ': nessun\'altra funzione che conti o scelga', !altre.length,
    'chiamate: ' + nomi(altre) + ' — la mappa non ha una seconda fonte: niente diagnosi() per l\'ordine, '
      + 'niente classifica() per ricontare');

  // Le righe, campo per campo.
  const out = { ordine: [], stati: [], primo: [], peso: [], altro: [], azione: [], zero: [] };
  differenze(r.righe, q.righe, rich.kind === 'base' ? 'tema' : 'voce', out);
  const primi = (o) => o.slice(0, 2).join('; ');
  check('righe', nome + ': ' + (rich.kind === 'base' ? 'i temi nell\'ordine di quadro(), le voci nell\'ordine'
    + ' di banca' : 'le voci nell\'ordine di banca'), !out.ordine.length,
    primi(out.ordine) + ' — l\'ordine e\' fisso (Q-DUE, punto 1): non si riordina per errori o per peso');
  check('righe', nome + ': giusti, da rifare, mai visti, visti e n sono quelli di quadro()', !out.stati.length,
    primi(out.stati));
  check('righe', nome + ': «X su Y» e\' il primo di quadro(), e sotto soglia non c\'e\'', !out.primo.length,
    primi(out.primo) + ' — sotto PRIMA_MIN_VISTI il motore non da\' un numero, e la pagina non ne scrive uno');
  check('righe', nome + ': nessun peso dove quadro() non lo da\'', !out.peso.length,
    primi(out.peso) + ' — le voci, e tutte le righe della vela, non hanno un peso (Q-DUE, punto 4)');
  check('righe', nome + ': nome, filtro e selezione della riga sono quelli del motore', !out.altro.length,
    primi(out.altro));
  check('azioni', nome + ': «Rifai N errori» porta N = daRifare e la selezione rifai del motore', !out.azione.length,
    primi(out.azione) + ' — senza tetto e con soloDaRifare: soloSbagliate e\' il Ripasso dei Quiz');
  check('azioni', nome + ': nessun pulsante da zero', !out.zero.length,
    primi(out.zero) + ' — con zero errori la riga dice «Nessun errore da rifare qui», senza pulsante');
  // Il totale porta anche `stati`, che si confronta a parte.
  check('righe', nome + ': il totale e\' quello di quadro()', uguale(r.totale && { ...r.totale, stati: undefined }, q.totale),
    breve(r.totale && { visti: r.totale.visti, n: r.totale.n }));

  // La frase.
  check('frase', nome + (ind ? ': la frase e\' quella di dovePesa(), con tema, motivo e pulsanti'
    : ': nessuna frase, perche\' dovePesa() non ne da\' (' + ass + ')'),
    ind ? uguale(r.indicazione, ind) : r.indicazione == null,
    'indicazione: ' + breve(r.indicazione) + (ind ? ' invece di ' + breve(ind)
      : ' — quando la frase manca, la pagina non mette niente al suo posto (Q-DUE, punto 6)'));
  check('frase', nome + ': dice perche\' la frase manca, con la parola del motore', r.assente === ass,
    'assente: ' + breve(r.assente) + ' invece di ' + breve(ass));
  stati(nome, rich, r, q, run.chiamate);
  if (attesa) attesa(q, d, r);
  return { r, q, d };
}

/**
 * I cinque stati (ridisegno §8.1): `stati` sul totale e su ogni riga, uguali a
 * contaStati() con il filtro della riga, da una chiamata per aggregato — mai
 * i tre convertiti in pagina, mai una chiamata sola spalmata.
 */
function stati(nome, rich, r, q, chiamate) {
  const G = 'stati';
  const aggregati = [['totale', { kind: rich.kind }, r.totale]];
  for (const [i, m] of q.righe.entries()) {
    const p = (r.righe || [])[i];
    aggregati.push([(rich.kind === 'base' ? 'tema ' : 'voce ') + m.nome, m.filtro, p]);
    if (m.voci) for (const [j, v] of m.voci.entries()) aggregati.push(['voce ' + v.nome, v.filtro, p && p.voci && p.voci[j]]);
  }
  const diversi = [], mancano = [];
  for (const [dove, filtro, p] of aggregati) {
    const attesi = REALE.contaStati(rich.banca, rich.progress, filtro);
    if (!p || !p.stati) mancano.push(dove);
    else if (!uguale(p.stati, attesi)) diversi.push(`${dove}: ${breve(p.stati)} invece di ${breve(attesi)}`);
  }
  check(G, nome + ': ogni riga e il totale portano i cinque stati', !mancano.length, 'senza stati: ' + mancano.slice(0, 3).join(', '));
  check(G, nome + ': gli stati sono quelli di contaStati() con il filtro della riga', !diversi.length, diversi.slice(0, 2).join('; ')
    + ' — mai visti, debole, incerto, sistemato, ok sommano al totale della riga, e si leggono dallo specchio');
  const cs = chiamate.filter((c) => c.f === 'contaStati');
  const unaPer = aggregati.every(([, filtro]) => cs.some((c) => c.args[0] === rich.banca && c.args[1] === rich.progress && uguale(c.args[2], filtro)));
  check(G, nome + ': una E.contaStati() per aggregato, con banca e storico della richiesta e il filtro della riga', cs.length === aggregati.length && unaPer,
    cs.length + ' chiamate per ' + aggregati.length + ' aggregati' + (unaPer ? '' : ', e almeno un filtro non e\' quello della sua riga'));
  const tre = chiamate.filter((c) => c.f === 'classifica' || c.f === 'statoQuesito');
  check(G, nome + ': i cinque stati non si ricontano in pagina', !tre.length, 'chiamate: ' + nomi(tre)
    + ' — contaStati() li da\' gia\' sommati; i tre di quadro() restano per le azioni e la compatibilita\'');
}

function mappa() {
  const ricco = confrontaMappa('Base, uno storico con 35 errori aperti in un tema', richiesta(RICCO), (q, d) => {
    // Il banco controlla le sue premesse: se lo storico non ha le forme che
    // servono, il giro sotto non proverebbe niente.
    const ta = q.righe.find((x) => x.nome === TA);
    check('righe', 'il banco: il tema ha piu\' di 30 errori da rifare, una voce piu\' di 20, e tre ripresi',
      ta && ta.daRifare === 35 && ta.voci.some((v) => v.daRifare === 25)
        && REALE.coda(items, RICCO, OGGI, { ...ta.filtro, soloSbagliate: true, n: 0 }).length === 38,
      breve(ta && { daRifare: ta.daRifare }));
    check('righe', 'il banco: c\'e\' una riga sotto la soglia di «X su Y» e una sopra',
      q.righe.some((x) => x.visti > 0 && x.primo === null) && q.righe.some((x) => x.primo !== null), '');
    check('frase', 'il banco: lo storico ricco ha una frase', !!d.indicazione, 'assente: ' + d.assente);
  });
  confrontaMappa('Vela, con i pesi d\'esame nella richiesta', richiesta(RICCO, 'vela'), (q) => {
    check('righe', 'il banco: sulla vela c\'e\' una voce con «X su Y» e una senza',
      q.righe.some((x) => x.primo) && q.righe.some((x) => x.visti > 0 && !x.primo), '');
  });
  confrontaMappa('Base, cinque risposte: sotto la soglia della frase', richiesta(SCARSO), (q, d) =>
    check('frase', 'il banco: lo storico scarso non ha la frase', d.assente === 'sotto soglia', 'assente: ' + d.assente));
  confrontaMappa('Base, senza pesi d\'esame', richiesta(RICCO, 'base', { pesi: null }));
  confrontaMappa('Base, nessuna risposta', richiesta({}));
  const quasi = confrontaMappa('Base, quasi tutto giusto: un tema con errori da rifare', richiesta(QUASI), (q, d) =>
    check('frase', 'il banco: la frase parla degli errori da rifare, con due pulsanti',
      d.indicazione && d.indicazione.tema === TA && d.indicazione.motivo === 'da rifare'
        && d.indicazione.pulsanti.map((p) => p.azione).join() === 'rifai,mai visti',
      breve(d.indicazione && { tema: d.indicazione.tema, motivo: d.indicazione.motivo })));
  confrontaMappa('Base, tutto giusto', richiesta(TUTTO), (q, d) =>
    check('frase', 'il banco: con tutto giusto la frase manca per niente da fare', d.assente === 'niente da fare',
      'assente: ' + d.assente));
  return ricco && { ...ricco, quasi };
}

// --- 2. le azioni: anteprima e avvio, con i dati che cambiano --------------

/** Un'anteprima: una chiamata a coda(), con la selezione del pulsante e i dati della richiesta. */
function anteprima(nome, azione, rich, attesa) {
  const run = esegui(anteprimaProgressi, azione, rich);
  if (!riuscita('azioni', nome, run)) return null;
  const a = run.esito || {};
  const cc = run.chiamate.filter((c) => c.f === 'coda');
  const altre = run.chiamate.filter((c) => !['coda', 'quadro', 'dovePesa'].includes(c.f));
  check('azioni', nome + ': una sola chiamata a E.coda(), con la selezione del pulsante e i dati della richiesta',
    cc.length === 1 && cc[0].args[0] === rich.banca && cc[0].args[1] === rich.progress && cc[0].args[2] === rich.oggi
      && uguale(cc[0].args[3], azione.selezione),
    cc.length + ' chiamate' + (cc[0] ? ', selezione ' + breve(cc[0].args[3]) + ' invece di ' + breve(azione.selezione) : ''));
  check('azioni', nome + ': nessun\'altra selezione', !altre.length, 'chiamate: ' + nomi(altre));
  if (attesa === 'pronta') {
    const vera = REALE.coda(rich.banca, rich.progress, rich.oggi, azione.selezione);
    check('azioni', nome + ': apre tutti e soli i ' + azione.quanti + ' quesiti, nell\'ordine del motore',
      a.stato === 'pronta' && a.quanti === azione.quanti && stessa(a.lista, vera),
      `stato ${a.stato}, quanti ${a.quanti}, lista di ${Array.isArray(a.lista) ? a.lista.length : '—'}`
        + ` invece di ${vera.length}` + (Array.isArray(a.lista) && a.lista.length === 20 ? ' — il tetto predefinito di coda()' : ''));
  } else {
    check('azioni', nome + ': con i dati cambiati l\'anteprima dice «cambiata» e non apre niente',
      a.stato === 'cambiata' && Array.isArray(a.lista) && a.lista.length === 0 && a.quanti == null,
      `stato ${a.stato}, quanti ${a.quanti}, lista di ${Array.isArray(a.lista) ? a.lista.length : '—'}`
        + ' — una lista diversa dal numero promesso non si apre chiamandola N');
  }
  return a;
}

function avvio(nome, azione, rich, attesa) {
  let avvii = [];
  const run = esegui(avviaProgressi, azione, rich, (...args) => { avvii.push(args); });
  if (!riuscita('azioni', nome, run)) return;
  const e = run.esito || {};
  if (attesa === 'pronta') {
    const vera = REALE.coda(rich.banca, rich.progress, rich.oggi, azione.selezione);
    check('azioni', nome + ': Inizia avvia una volta la lista dell\'anteprima',
      avvii.length === 1 && stessa(avvii[0][0], vera) && e.avviata === true,
      avvii.length + ' avvii' + (avvii[0] ? ', lista di ' + (avvii[0][0] || []).length + ' invece di ' + vera.length : '')
        + ', avviata ' + e.avviata);
  } else {
    check('azioni', nome + ': con i dati cambiati Inizia non avvia niente', avvii.length === 0 && e.avviata === false,
      avvii.length + ' avvii, avviata ' + e.avviata + ' — Inizia rifa\' la verifica dell\'anteprima');
  }
}

function azioni(ricco) {
  if (!ricco) return;
  const { r } = ricco;
  const rich = richiesta(RICCO);
  const ta = (r.righe || []).find((x) => x && x.nome === TA);
  const va1 = ta && (ta.voci || []).find((v) => v && v.daRifare === 25);
  const casi = [];
  if (ta && ta.azione) casi.push([`«Rifai ${ta.azione.quanti} errori» del tema`, ta.azione, rich]);
  if (va1 && va1.azione) casi.push([`«Rifai ${va1.azione.quanti} errori» della voce`, va1.azione, rich]);
  for (const [m, rr, dove] of [[r, rich, 'con molti mai visti'], [ricco.quasi && ricco.quasi.r, richiesta(QUASI), 'sugli errori da rifare']])
    for (const p of (m && m.indicazione && m.indicazione.pulsanti) || [])
      casi.push([`il pulsante «${p.azione}» della frase ${dove}`, p, rr]);
  check('azioni', 'il banco ha le azioni da provare: il tema, la voce e i pulsanti delle due frasi',
    casi.length >= 5 && !!(ta && ta.azione) && !!(va1 && va1.azione), casi.length + ' azioni');

  for (const [nome, az, rr] of casi) {
    anteprima(nome, az, rr, 'pronta');
    avvio(nome, az, rr, 'pronta');
  }
  if (!ta || !ta.azione) return;
  const az = ta.azione;

  // Fra un clic e l'altro. Cose che non cambiano la lista del tema: una
  // risposta in un altro tema, la banca ricaricata.
  const altrove = congela(storico([...passiRicco, [B.filter((x) => x.t === TB)[5], false, '2026-09-29']]));
  anteprima('Dopo una risposta in un altro tema, ' + az.quanti + ' errori', az, richiesta(altrove), 'pronta');
  const ricaricata = congela(JSON.parse(JSON.stringify(items)));
  anteprima('Con la banca ricaricata, ' + az.quanti + ' errori', az, richiesta(RICCO, 'base', { banca: ricaricata }), 'pronta');
  // Cose che la cambiano: un errore del tema ripreso, un errore nuovo nel tema,
  // un azzeramento.
  const ripreso = congela(storico([...passiRicco, [VA1[0], true, '2026-09-29']]));
  anteprima('Dopo un errore del tema ripreso', az, richiesta(ripreso), 'cambiata');
  avvio('Dopo un errore del tema ripreso', az, richiesta(ripreso), 'cambiata');
  const nuovo = congela(storico([...passiRicco, [VA2[11], false, '2026-09-29']]));
  anteprima('Dopo un errore nuovo nel tema', az, richiesta(nuovo), 'cambiata');
  anteprima('Dopo un azzeramento', az, richiesta({}), 'cambiata');
  avvio('Dopo un azzeramento', az, richiesta({}), 'cambiata');
  // E dopo la riapertura, numero e lista tornano insieme.
  const riaperta = esegui(mappaProgressi, richiesta(ripreso));
  if (riuscita('azioni', 'La mappa riaperta dopo il ripasso', riaperta)) {
    const t2 = (riaperta.esito.righe || []).find((x) => x && x.nome === TA);
    check('azioni', 'La mappa riaperta dopo il ripasso: il numero e\' sceso a ' + (az.quanti - 1),
      t2 && t2.azione && t2.azione.quanti === az.quanti - 1, breve(t2 && t2.azione && t2.azione.quanti));
    if (t2 && t2.azione) anteprima('La mappa riaperta dopo il ripasso', t2.azione, richiesta(ripreso), 'pronta');
  }
}

// --- 2b. «Allena» (ridisegno §8.1): la lista della riga, e Inizia che confronta --

function allena(fns, ricco) {
  const G = 'allena';
  if (!ricco || !fns.anteprimaAllenaProgressi || !fns.avviaAllenaProgressi) return;
  const { anteprimaAllenaProgressi: ant, avviaAllenaProgressi: avv } = fns;
  const rich = richiesta(RICCO);
  const righe = ricco.r.righe || [];
  const ta = righe.find((x) => x && x.nome === TA);
  const va1 = ta && (ta.voci || []).find((v) => v && v.daRifare === 25);
  const vela = esegui(mappaProgressi, richiesta(RICCO, 'vela'));
  const vv = vela.esito && vela.esito.righe && vela.esito.righe[0];
  const tutto = esegui(mappaProgressi, richiesta(TUTTO));
  const tt = tutto.esito && tutto.esito.righe && tutto.esito.righe.find((x) => x.nome === TA);
  const casi = [['«Allena» sul tema', ta, rich, 'pronta'], ['«Allena» sulla voce', va1, rich, 'pronta'],
    ['«Allena» su una voce della vela', vv, richiesta(RICCO, 'vela'), 'pronta'], ['«Allena» con tutto gia\' visto', tt, richiesta(TUTTO), 'vuota']];
  check(G, 'il banco ha le righe da provare: tema, voce, vela, e un tema tutto visto', casi.every(([, r]) => r && r.filtro), casi.filter(([, r]) => !r).map(([n]) => n).join(', '));
  const anteprima = (nome, riga, rr, attesa) => {
    if (!riga) return null;
    const run = esegui(ant, riga, rr);
    if (!riuscita(G, nome, run)) return null;
    const a = run.esito || {};
    const cc = run.chiamate.filter((c) => c.f === 'coda'), altre = run.chiamate.filter((c) => c.f !== 'coda');
    const opt = { ...riga.filtro, n: 20 };
    check(G, nome + ': una E.coda() con il filtro della riga e n = 20', cc.length === 1 && cc[0].args[0] === rr.banca && cc[0].args[1] === rr.progress && cc[0].args[2] === rr.oggi
      && uguale(Object.fromEntries(Object.entries(cc[0].args[3] || {}).filter(([, v]) => v !== undefined).sort()), Object.fromEntries(Object.entries(opt).sort())),
      cc.length + ' chiamate' + (cc[0] ? ', opzioni ' + breve(cc[0].args[3]) + ' invece di ' + breve(opt) : '') + ' — Allena non e\' Rifai: niente soloDaRifare, e il filtro e\' quello della riga');
    check(G, nome + ': nessun\'altra selezione', !altre.length, 'chiamate: ' + nomi(altre));
    const vera = REALE.coda(rr.banca, rr.progress, rr.oggi, opt);
    if (attesa === 'pronta') {
      check(G, nome + ': apre la lista del motore, con il suo numero', a.stato === 'pronta' && a.quanti === vera.length && stessa(a.lista, vera) && vera.length > 0,
        `stato ${a.stato}, quanti ${a.quanti}, lista di ${Array.isArray(a.lista) ? a.lista.length : '—'} invece di ${vera.length}`);
    } else {
      check(G, nome + ': con niente da aprire dice «vuota», senza un pulsante che apre zero', a.stato === 'vuota' && a.quanti === 0 && Array.isArray(a.lista) && !a.lista.length && vera.length === 0,
        `stato ${a.stato}, quanti ${a.quanti}`);
    }
    return { riga, ...a };
  };
  const preps = casi.map(([nome, riga, rr, attesa]) => [nome, anteprima(nome, riga, rr, attesa), rr]);
  const avvio = (nome, prep, rr, attesa) => {
    if (!prep) return;
    const avvii = [];
    const run = esegui(avv, prep, rr, (...a) => avvii.push(a));
    if (!riuscita(G, nome, run)) return;
    const e = run.esito || {};
    const cc = run.chiamate.filter((c) => c.f === 'coda');
    check(G, nome + ': Inizia rilegge la lista di adesso con una E.coda()', cc.length === 1 && cc[0].args[1] === rr.progress, cc.length + ' chiamate a coda');
    if (attesa === 'pronta') {
      check(G, nome + ': Inizia avvia una volta la lista dell\'anteprima, come argomento', avvii.length === 1 && avvii[0][0] === prep.lista && avvii[0][1] === 'argomento' && e.avviata === true,
        avvii.length + ' avvii, avviata ' + e.avviata + ', modo ' + breve(avvii[0] && avvii[0][1]));
    } else {
      check(G, nome + ': con la lista cambiata Inizia non avvia niente e dice «cambiata»', !avvii.length && e.avviata === false && e.stato === 'cambiata',
        avvii.length + ' avvii, avviata ' + e.avviata + ', stato ' + e.stato + ' — si confrontano id e ordine, non il numero');
    }
  };
  const [[, pTema], [, pVoce]] = preps;
  avvio('Inizia su «Allena» del tema', pTema, rich, 'pronta');
  avvio('Inizia su «Allena» della voce', pVoce, rich, 'pronta');
  // Fra un clic e l'altro: un mai visto del tema risposto cambia la lista; la
  // banca ricaricata uguale no; la banca ricaricata al contrario cambia l'ordine
  // a parita' di quesiti, sul tema di QUASI che ne ha dieci mai visti.
  if (pTema) {
    const primo = pTema.lista && pTema.lista[0];
    const risposto = congela(storico([...passiRicco, [primo, true, '2026-09-29']]));
    avvio('Inizia dopo che un mai visto del tema e\' stato risposto', pTema, richiesta(risposto), 'cambiata');
    avvio('Inizia con la banca ricaricata uguale', pTema, richiesta(RICCO, 'base', { banca: congela(JSON.parse(JSON.stringify(items))) }), 'pronta');
  }
  const quasi = esegui(mappaProgressi, richiesta(QUASI));
  const tq = quasi.esito && quasi.esito.righe && quasi.esito.righe.find((x) => x.nome === TA);
  const pq = anteprima('«Allena» sul tema con dieci mai visti', tq, richiesta(QUASI), 'pronta');
  if (pq) {
    check(G, 'il banco: la lista del tema di QUASI sta sotto i venti', pq.quanti === 10, 'quanti ' + pq.quanti);
    avvio('Inizia con gli stessi quesiti in un altro ordine', pq, richiesta(QUASI, 'base', { banca: congela([...items].reverse()) }), 'cambiata');
  }
}

// --- 3. la pagina: il raccordo, e come si collega ---------------------------

function collegamento(script, tutte) {
  const G = 'raccordo';
  const dentro = new Set(RACCORDO.filter((f) => tutte[f]).flatMap((f) => [...dipendenze(tutte, f)]));
  let resto = script;
  for (const f of dentro) resto = resto.replace(tutte[f], '');
  check(G, 'E.quadro ed E.dovePesa si chiamano solo dentro il raccordo', !/\bE\.(quadro|dovePesa)\b/.test(resto),
    'la pagina chiede la mappa anche fuori da mappaProgressi/anteprimaProgressi/avviaProgressi: una seconda fonte '
    + 'per gli stessi numeri');
  check(G, 'E.consigli non si chiama piu\'', !/\bE\.consigli\b/.test(script),
    'la lista «Cosa studiare adesso» e\' uscita con la mappa (Q-DUE; area 5, §8), e consigli() non esiste piu\' '
    + 'nel motore (P-47): una chiamata lancia');
  const usi = (f) => [...resto.matchAll(new RegExp('\\b' + f + '\\s*\\(', 'g'))].map((m) => m.index)
    .filter((i) => !/function\s+$/.test(resto.slice(Math.max(0, i - 12), i)));
  check(G, 'la pagina disegna la mappa da mappaProgressi()', usi('mappaProgressi').length > 0,
    'il raccordo e\' dichiarato ma nessuno lo chiama: la mappa in schermata viene da un\'altra parte');
  check(G, 'la pagina chiama avviaProgressi() e le passa apri',
    usi('avviaProgressi').some((i) => /\bapri\b/.test(resto.slice(i, resto.indexOf(';', i) + 1 || i + 400))),
    'Inizia deve passare dal raccordo, e il raccordo deve avviare il runner: un pulsante che chiama apri() '
    + 'da se\' apre una lista che nessuno ha verificato');
  // I cinque stati e «Allena» stanno nei loro gruppi, «stati» e «allena».
  check('stati', 'E.contaStati si chiama solo dentro il raccordo', !/\bE\.contaStati\b/.test(resto),
    'i cinque stati si contano nel raccordo della mappa, una volta per aggregato: fuori sarebbero una seconda fonte');
  check('allena', 'la pagina chiama avviaAllenaProgressi() e le passa apri',
    usi('avviaAllenaProgressi').some((i) => /\bapri\b/.test(resto.slice(i, resto.indexOf(';', i) + 1 || i + 400))),
    '«Allena» deve passare dal suo raccordo, che rilegge la lista prima di avviare');
}

// --- la pagina ---------------------------------------------------------------

const { pagina } = JSON.parse(readFileSync(0, 'utf8'));
const script = scriptModulo(pagina);
const tutte = funzioni(script);
const G = 'raccordo';
let mappaProgressi, anteprimaProgressi, avviaProgressi;
check(G, 'la pagina ha uno script', script.length > 0, 'nessun <script type="module">');
for (const f of RACCORDO) {
  check(G, 'la pagina dichiara ' + f + '()', !!tutte[f],
    'la mappa passa da tre funzioni di raccordo: il contratto e\' in docs/area-5-progetto.md §10.1');
}
for (const f of RACCORDO_ALLENA) {
  check('allena', 'la pagina dichiara ' + f + '()', !!tutte[f],
    '«Allena» passa da due funzioni di raccordo (docs/ridisegno-progetto.md §10.1, tabella C)');
}
if (RACCORDO.every((f) => tutte[f])) {
  const sel = {};
  try {
    for (const f of [...RACCORDO, ...RACCORDO_ALLENA.filter((x) => tutte[x])]) {
      sel[f] = new Function('E', '"use strict";\n' + conDipendenze(tutte, f) + '\nreturn ' + f + ';')(E);
    }
  } catch (e) {
    check(G, 'il raccordo si legge', false, e.message);
  }
  if (RACCORDO.every((f) => sel[f])) {
    ({ mappaProgressi, anteprimaProgressi, avviaProgressi } = sel);
    const ricco = mappa();
    azioni(ricco);
    allena(sel, ricco);
  }
  collegamento(script, tutte);
}

process.stdout.write(JSON.stringify(verifiche));
