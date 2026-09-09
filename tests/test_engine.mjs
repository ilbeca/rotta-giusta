// Test del motore di selezione: node --test tests/
//
// Verificano i criteri di accettazione della spec, non l'implementazione.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addGiorni, giorniTra, stato, sbagliato, classifica, coda, diagnosi, peggiori,
  traccia, semaforo, applica, rimescola, semeGiorno,
  estrai, estraiNuoviPrima, simulazione, simulazioneVela, screening, esito,
  fondi, isoLocale, stimaImpegno, mirata, consigli, oscurato, RIPIEGO_MS,
  serieGruppi, tendenza, TENDENZA_MIN_GIORNI, TENDENZA_MIN_RISPOSTE,
  SEGNALI, SEGNALI_MODI, poolSegnali, domandeSegnali, lunghezzaPartita,
  giroTecniche, tappeto, daAllenare,
  epoca, ordinaRighe, ripiega, sessioni, fondiArchivio, PAUSA_SESSIONE_MS,
} from '../site/engine.js';
// Il namespace serve al solo test di compatibilita' con la pagina: la copia in
// `app.html` chiama `E.coda()` ed `E.classifica()`, e va eseguita com'e'.
import * as E from '../site/engine.js';
import { readFileSync } from 'node:fs';

const OGGI = '2026-08-08';

// La composizione ministeriale delle 20 domande, e le dimensioni reali dei temi
// nella banca. Servono a verificare che la simulazione sia fedele.
const PESI = {
  'NAVIGAZIONE CARTOGRAFICA ED ELETTRONICA': 4,
  'MANOVRA E CONDOTTA': 4,
  'SICUREZZA DELLA NAVIGAZIONE': 3,
  'NORMATIVA DIPORTISTICA E AMBIENTALE': 3,
  'COLREG E SEGNALAMENTO MARITTIMO': 2,
  'METEOROLOGIA': 2,
  'TEORIA DELLO SCAFO': 1,
  'MOTORI': 1,
};
const DIM = {
  'NAVIGAZIONE CARTOGRAFICA ED ELETTRONICA': 322, 'COLREG E SEGNALAMENTO MARITTIMO': 247,
  'SICUREZZA DELLA NAVIGAZIONE': 215, 'NORMATIVA DIPORTISTICA E AMBIENTALE': 184,
  'MANOVRA E CONDOTTA': 155, 'TEORIA DELLO SCAFO': 125, 'METEOROLOGIA': 120, 'MOTORI': 104,
};

function bancaVera() {
  const out = [];
  let i = 0;
  for (const [tema, n] of Object.entries(DIM))
    for (let j = 0; j < n; j++)
      out.push({ id: `base-${++i}`, k: 'base', t: tema, v: `${tema} v${j % 5}`, d: 'd', r: ['a', 'b', 'c'], x: 0 });
  return out;
}

function banca(n = 30, tema = 'NAVIGAZIONE', voce = 'Coordinate') {
  return Array.from({ length: n }, (_, i) => ({
    id: `base-${i + 1}`, k: 'base', t: tema, v: voce, d: `domanda ${i + 1}`, r: ['a', 'b', 'c'], x: 0,
  }));
}

// --- date ---------------------------------------------------------------------

test('aritmetica sulle date, anche a cavallo di mese', () => {
  assert.equal(addGiorni('2026-08-30', 7), '2026-09-06');
  assert.equal(addGiorni('2026-08-08', 0), '2026-08-08');
  assert.equal(giorniTra('2026-08-08', '2026-09-03'), 26);
  assert.equal(giorniTra('2026-08-17', '2026-08-30'), 13);
});

// --- criterio 1: quello che ho risposto non torna ------------------------------

test('criterio 1 — venti quiz risposti non vengono riproposti', () => {
  const items = banca(30);
  const progress = {};
  const primo = coda(items, progress, OGGI, { n: 20 });
  assert.equal(primo.length, 20);
  for (const it of primo) applica(progress, it.id, true, 9000, OGGI);

  const secondo = coda(items, progress, OGGI, { n: 20 });
  const visti = new Set(primo.map((i) => i.id));
  assert.ok(secondo.every((i) => !visti.has(i.id)), 'nessuno dei primi 20 deve tornare');
  assert.equal(secondo.length, 10, 'restano solo i 10 mai visti');
});

// --- criterio 2: gli errori si ripassano quando lo decidi tu --------------------
//
// Fino alla 0.5.0 qui c'era la scala D+1/D+3/D+7. E' stata tolta: non spaziava
// niente (la scadenza si ricalcolava sempre dalla data dell'errore, quindi su un
// errore vecchio tutti i gradini erano gia' passati e le tre ripetizioni
// finivano nella stessa sessione) e sporcava la simulazione d'esame, che
// preferiva i mai visti e i richiami invece di pescare come il ministero.

test('criterio 2 — un quesito sbagliato non torna da solo', () => {
  const items = banca(5);
  const progress = {};
  applica(progress, 'base-1', false, 8000, '2026-08-08');

  assert.equal(stato(progress['base-1']), 'chiuso', 'risposto e' + " " + 'risposto, giusto o sbagliato');
  assert.equal(sbagliato(progress['base-1']), true, 'ma resta segnato come sbagliato');

  // non e' in testa alla coda: la coda serve alla copertura, non al ripasso
  const q = coda(items, progress, '2026-08-09', { n: 5 });
  assert.ok(!q.some((x) => x.id === 'base-1'), 'non ricompare nella coda normale');

  // ...e nemmeno nei giorni che erano D+1, D+3, D+7
  for (const g of ['2026-08-09', '2026-08-11', '2026-08-15', '2026-09-01']) {
    assert.ok(!coda(items, progress, g, { n: 5 }).some((x) => x.id === 'base-1'),
      'nessuna data lo fa tornare da sola: ' + g);
  }
});

test('criterio 2 — la modalita "solo sbagliate" li ritrova tutti', () => {
  const items = banca(6);
  const progress = {};
  applica(progress, 'base-1', false, 8000, '2026-08-08');
  applica(progress, 'base-3', true, 8000, '2026-08-08');
  applica(progress, 'base-5', false, 8000, '2026-08-10');

  const sb = coda(items, progress, OGGI, { soloSbagliate: true, n: 0 });
  // Dalla 0.15.0 l'ordine e' "il piu' trascurato per primo" (`t` crescente) e
  // non piu' "l'errore piu' recente" (`lw` decrescente): base-1 e' fermo dall'8,
  // base-5 dal 10. Il perche' e' nel commento della sort in engine.js.
  assert.deepEqual(sb.map((x) => x.id), ['base-1', 'base-5'], 'solo gli sbagliati, dal piu trascurato');

  // riprenderlo giusto non lo toglie dall'elenco: averlo sbagliato non scade
  applica(progress, 'base-1', true, 5000, OGGI);
  const dopo = coda(items, progress, OGGI, { soloSbagliate: true, n: 0 });
  assert.ok(dopo.some((x) => x.id === 'base-1'), 'resta anche dopo averlo ripreso');
  // ...ma scende in fondo: restare in elenco e stare in testa sono due cose
  // diverse. E' cio' che rende la lista utile invece che una fotografia.
  assert.equal(dopo[dopo.length - 1].id, 'base-1', 'chi e stato ripreso va in coda');
});

test('0.15.0 — "solo sbagliate" avanza da sola, senza segnaposto', () => {
  // Il difetto misurato il 2 settembre: due aperture di fila davano la stessa
  // identica lista, perche' `lw` non si muove quando riprendi il quesito. Qui
  // si pretende il contrario, ed e' l'invariante che mancava.
  const items = banca(30);
  const progress = {};
  for (let i = 1; i <= 20; i++) applica(progress, `base-${i}`, false, 8000, '2026-08-01');

  const giro1 = coda(items, progress, OGGI, { soloSbagliate: true, n: 5 }).map((x) => x.id);
  assert.equal(giro1.length, 5);
  // li faccio, e li prendo giusti
  for (const id of giro1) applica(progress, id, true, 5000, OGGI);

  const giro2 = coda(items, progress, OGGI, { soloSbagliate: true, n: 5 }).map((x) => x.id);
  assert.equal(giro2.length, 5);
  assert.ok(!giro2.some((id) => giro1.includes(id)),
    'la seconda apertura non ripete la prima finche ce ne sono altre');

  // e il giro dopo ancora: l'avanzamento non e' un caso del primo passo
  for (const id of giro2) applica(progress, id, true, 5000, OGGI);
  const giro3 = coda(items, progress, OGGI, { soloSbagliate: true, n: 5 }).map((x) => x.id);
  assert.ok(!giro3.some((id) => [...giro1, ...giro2].includes(id)), 'e nemmeno la terza');

  // esauriti i 20, ricomincia dai piu trascurati: nessuno sparisce
  const tutti = coda(items, progress, OGGI, { soloSbagliate: true, n: 0 });
  assert.equal(tutti.length, 20, 'restano tutti in elenco');
});

test('0.15.0 — chi ha l errore ancora aperto viene prima di chi l ha ripreso', () => {
  const items = banca(10);
  const progress = {};
  // ripreso, ma trascurato da tanto
  applica(progress, 'base-1', false, 8000, '2026-08-01');
  applica(progress, 'base-1', true, 8000, '2026-08-02');
  // errore ancora aperto, e toccato piu di recente
  applica(progress, 'base-2', false, 8000, '2026-08-05');

  const l = coda(items, progress, OGGI, { soloSbagliate: true, n: 0 }).map((x) => x.id);
  assert.deepEqual(l, ['base-2', 'base-1'],
    'l aperto batte il ripreso anche se il ripreso e piu vecchio');
});

test("criterio 2 — la simulazione d'esame non guarda che cosa hai studiato", () => {
  // E' il punto per cui la scala e' stata tolta: il ministero pesca dalla banca
  // e basta. Una prova che preferisce i mai visti misura la tua debolezza, non
  // il voto che prenderesti.
  const items = banca(40);
  const vergine = {};
  const studiata = {};
  for (const it of items) applica(studiata, it.id, true, 5000, OGGI);   // tutti gia' visti
  const sbagliata = {};
  for (const it of items) applica(sbagliata, it.id, false, 5000, OGGI); // tutti sbagliati

  for (const seme of [1, 7, 99]) {
    const a = estrai(items, vergine, OGGI, 10, seme).map((x) => x.id);
    const b = estrai(items, studiata, OGGI, 10, seme).map((x) => x.id);
    const c = estrai(items, sbagliata, OGGI, 10, seme).map((x) => x.id);
    assert.deepEqual(a, b, 'stesso seme, stessa pescata: lo storico non conta');
    assert.deepEqual(a, c, 'nemmeno se hai sbagliato tutto');
  }
  // e resta comunque casuale fra semi diversi
  assert.notDeepEqual(estrai(items, vergine, OGGI, 10, 1).map((x) => x.id),
                      estrai(items, vergine, OGGI, 10, 2).map((x) => x.id));
});


test('azzeccato al primo colpo esce subito: la copertura vale piu della conferma', () => {
  const progress = {};
  applica(progress, 'base-1', true, 0, OGGI);
  assert.equal(stato(progress['base-1'], OGGI), 'chiuso');
});

test('la prima risposta resta registrata anche dopo dieci ripassi', () => {
  const progress = {};
  applica(progress, 'base-1', false, 0, '2026-08-08');
  for (let i = 0; i < 10; i++) applica(progress, 'base-1', true, 0, '2026-08-09');
  assert.equal(progress['base-1'].first, 0, 'first misura la conoscenza, non la memoria del drill');
});

// --- ordine della coda ----------------------------------------------------------



test('i filtri per tema e voce restringono la coda', () => {
  const items = [...banca(5, 'A', 'a1'), ...banca(5, 'B', 'b1').map((q, i) => ({ ...q, id: `base-b${i}` }))];
  assert.equal(coda(items, {}, OGGI, { tema: 'A', n: 0 }).length, 5);
  assert.equal(coda(items, {}, OGGI, { voce: 'b1', n: 0 }).length, 5);
});

test('la banca vela si restringe per voce, non per tema', () => {
  // Gli item vela hanno tutti t='VELA' e la voce sta in v: e' il contratto che
  // la pagina deve rispettare quando passa le spunte al motore. Passare i nomi
  // delle voci come `temi` non trova niente — era il difetto della coda vuota
  // con scritto sotto «sono tutti chiusi».
  const items = Array.from({ length: 6 }, (_, i) => ({
    id: `vela-${i + 1}`, k: 'vela', t: 'VELA', v: i < 3 ? 'TEORIA DELLA VELA' : 'ANDATURE',
    d: 'a', r: ['Vero', 'Falso'], x: 0,
  }));
  assert.equal(coda(items, {}, OGGI, { kind: 'vela', voci: ['TEORIA DELLA VELA'], n: 0 }).length, 3);
  assert.equal(coda(items, {}, OGGI, { kind: 'vela', temi: ['TEORIA DELLA VELA'], n: 0 }).length, 0,
    'come temi non trovano niente: la pagina non deve passarli cosi');
});

// --- solo quesiti con figura ----------------------------------------------------
//
// All'esame la figura compare come figura: il filtro serve ad allenarle come
// compaiono li'. `f` nella banca e' il nome del file oppure null.

test('soloFigura tiene solo i quesiti con figura, e spento non cambia niente', () => {
  const items = banca(10).map((q, i) => i % 3 === 0 ? { ...q, f: `figura-${i}.png` } : q);
  const con = coda(items, {}, OGGI, { soloFigura: true, n: 0 });
  assert.equal(con.length, 4, 'base-1, 4, 7, 10');
  assert.ok(con.every((x) => x.f), 'tutti con la figura');
  assert.equal(coda(items, {}, OGGI, { n: 0 }).length, 10, 'default: filtro spento');
  assert.equal(coda(items, {}, OGGI, { soloFigura: false, n: 0 }).length, 10);
});

test('soloFigura si combina con tema, voci e stati', () => {
  const items = [
    ...banca(4, 'A', 'a1').map((q, i) => ({ ...q, f: i < 2 ? 'x.png' : null })),
    ...banca(4, 'B', 'b1').map((q, i) => ({ ...q, id: `base-b${i}`, f: 'y.png' })),
  ];
  assert.equal(coda(items, {}, OGGI, { temi: ['A'], soloFigura: true, n: 0 }).length, 2);
  assert.equal(coda(items, {}, OGGI, { voci: ['b1'], soloFigura: true, n: 0 }).length, 4);
  // col selettore "solo mai fatte" (stati: ['nuovo']) i gia' risposti spariscono
  const progress = {};
  applica(progress, 'base-1', true, 0, OGGI);
  assert.deepEqual(
    coda(items, progress, OGGI, { temi: ['A'], soloFigura: true, stati: ['nuovo'], n: 0 }).map((x) => x.id),
    ['base-2'], 'resta il solo mai visto con figura del tema A');
});

test('soloFigura vale anche dentro "solo sbagliate"', () => {
  const items = banca(4).map((q, i) => i < 2 ? { ...q, f: 'x.png' } : q);
  const progress = {};
  applica(progress, 'base-1', false, 0, OGGI);   // con figura
  applica(progress, 'base-3', false, 0, OGGI);   // senza
  const sb = coda(items, progress, OGGI, { soloSbagliate: true, soloFigura: true, n: 0 });
  assert.deepEqual(sb.map((x) => x.id), ['base-1'], 'degli sbagliati resta solo quello con figura');
});

test('i chiusi rientrano solo se richiesti, come in simulazione', () => {
  const items = banca(3);
  const progress = {};
  for (const it of items) applica(progress, it.id, true, 0, OGGI);
  assert.equal(coda(items, progress, OGGI, { n: 0 }).length, 0);
  assert.equal(coda(items, progress, OGGI, { n: 0, includiChiusi: true }).length, 3);
});

test('rimescola con lo stesso seme da lo stesso ordine', () => {
  const a = banca(20).map((i) => i.id);
  assert.deepEqual(rimescola(a, 42).map(String), rimescola(a, 42).map(String));
  assert.notDeepEqual(rimescola(a, 42), rimescola(a, 43));
});

// --- diagnosi ---------------------------------------------------------------------

test('la diagnosi conta visti, risposte e copertura per tema', () => {
  const items = [...banca(10, 'NAV', 'Coordinate'), ...banca(10, 'MOTORI', 'Elica').map((q, i) => ({ ...q, id: `base-m${i}` }))];
  const progress = {};
  for (let i = 1; i <= 4; i++) applica(progress, `base-${i}`, i <= 3, 10000, OGGI);

  const d = diagnosi(items, progress, OGGI);
  const nav = d.temi.find((t) => t.nome === 'NAV');
  assert.equal(nav.n, 10);
  assert.equal(nav.visti, 4);
  assert.equal(nav.risposte, 4);
  assert.equal(nav.esatte1, 3);
  assert.equal(nav.acc1, 0.75);
  assert.equal(nav.nuovi, 6);
  assert.equal(nav.ms, 10000);

  const mot = d.temi.find((t) => t.nome === 'MOTORI');
  assert.equal(mot.visti, 0);
  assert.equal(mot.acc1, null);
});

test('una voce vista una volta sola non scala la classifica dei punti deboli', () => {
  const items = [
    ...banca(1, 'T', 'minuscola'),
    ...banca(40, 'T', 'grossa').map((q, i) => ({ ...q, id: `base-g${i}` })),
  ];
  const progress = {};
  applica(progress, 'base-1', false, 0, OGGI);              // 1 su 1 sbagliato: 100%
  for (let i = 0; i < 20; i++) applica(progress, `base-g${i}`, i < 8, 0, OGGI); // 12 su 20: 60%

  const d = diagnosi(items, progress, OGGI);
  const p = peggiori(d, 5, 5);
  assert.equal(p.length, 1, 'la voce da un quesito e sotto la soglia di 5 risposte');
  assert.equal(p[0].nome, 'grossa');

  const min = d.voci.find((v) => v.nome === 'minuscola');
  const gro = d.voci.find((v) => v.nome === 'grossa');
  assert.ok(gro.debolezza > min.debolezza, 'col liscio, 12/20 pesa piu di 1/1');
});

test('una voce senza nemmeno un errore non e un punto debole', () => {
  const items = banca(30, 'T', 'perfetta');
  const progress = {};
  for (let i = 1; i <= 20; i++) applica(progress, `base-${i}`, true, 0, OGGI);
  const d = diagnosi(items, progress, OGGI);
  assert.equal(peggiori(d, 5, 5).length, 0, '20 su 20 esatte non va nella classifica dei deboli');
});

// --- che cosa studiare adesso -------------------------------------------------------

test('i consigli vedono la voce mai aperta, che la classifica dei deboli non puo vedere', () => {
  // Due voci dello stesso tema e della stessa dimensione: una la sai al 100%,
  // l'altra non l'hai mai aperta. `peggiori` non ha niente da dire — errori non
  // ce ne sono — e il consiglio invece deve nominare quella intatta.
  const items = [
    ...banca(20, 'T', 'saputa'),
    ...banca(20, 'T', 'intatta').map((q, i) => ({ ...q, id: `base-i${i}` })),
  ];
  const progress = {};
  for (let i = 1; i <= 20; i++) applica(progress, `base-${i}`, true, 10000, OGGI);

  const d = diagnosi(items, progress, OGGI, 'base', { T: 4 });
  assert.equal(peggiori(d, 5, 5).length, 0, 'nessun errore: la classifica dei deboli e vuota');

  const c = consigli(d, { pesi: { T: 4 } });
  assert.equal(c.voci.length, 1, 'la voce gia chiusa non ha niente da fare e non compare');
  assert.equal(c.voci[0].nome, 'intatta');
  assert.equal(c.voci[0].motivo, 'mai aperta');
  assert.equal(c.voci[0].daFare, 20);
});

test('a parita di quesiti da fare vince la voce che vale piu domande d esame', () => {
  const items = [
    ...banca(20, 'MANOVRA E CONDOTTA', 'manovra'),
    ...banca(20, 'MOTORI', 'motori').map((q, i) => ({ ...q, id: `base-x${i}` })),
  ];
  const d = diagnosi(items, {}, OGGI, 'base', PESI);
  const c = consigli(d, { pesi: PESI });
  assert.equal(c.voci[0].nome, 'manovra', 'Manovra porta 4 domande, Motori 1');
  assert.ok(c.voci[0].priorita > c.voci[1].priorita * 3, 'e il rapporto e quello dei pesi');
});

test('i minuti dei consigli seguono il tempo medio misurato', () => {
  const items = banca(20, 'T', 'unica');
  const d = diagnosi(items, {}, OGGI, 'base', { T: 4 });
  const lento = consigli(d, { pesi: { T: 4 }, msMedio: 30000 });
  const svelto = consigli(d, { pesi: { T: 4 }, msMedio: 10000 });
  assert.equal(lento.voci[0].minuti, 10, '20 quesiti a 30 s sono 10 minuti');
  assert.equal(svelto.voci[0].minuti, 3, 'a 10 s sono 3 minuti e mezzo, arrotondati');
  assert.equal(lento.minuti, 10, 'il totale e la somma delle voci proposte');
});

test('una banca tutta chiusa e senza sbagliate non produce consigli', () => {
  const items = banca(12, 'T', 'finita');
  const progress = {};
  for (let i = 1; i <= 12; i++) applica(progress, `base-${i}`, true, 10000, OGGI);
  const d = diagnosi(items, progress, OGGI, 'base', { T: 4 });
  const c = consigli(d, { pesi: { T: 4 } });
  assert.deepEqual(c.voci, [], 'un consiglio che non si puo seguire non e un consiglio');
  assert.equal(c.minuti, 0);
});

test('lo sbagliato torna nei consigli, e col motivo giusto', () => {
  const items = banca(30, 'T', 'zoppa');
  const progress = {};
  // 20 viste, 12 sbagliate: la parte misurata pesa piu delle 10 mai viste
  for (let i = 1; i <= 20; i++) applica(progress, `base-${i}`, i > 12, 10000, OGGI);
  const d = diagnosi(items, progress, OGGI, 'base', { T: 4 });
  const v = consigli(d, { pesi: { T: 4 } }).voci[0];
  assert.equal(v.motivo, 'ci sbagli');
  assert.equal(v.sbagliati, 12);
  assert.equal(v.nuovi, 10);
  assert.equal(v.daFare, 22, 'le sbagliate da riprendere piu i mai visti');
  assert.ok(v.recupero > v.rischio, 'la debolezza misurata batte quella stimata');
});

test('0.16.0 — la diagnosi conta anche le sbagliate ancora APERTE', () => {
  // Il totale storico non cala mai (0.5.1, ed e' voluto). `aperti` e' quello
  // che si muove quando ripassi: senza, la tabella della Diagnosi restava
  // immobile dopo un pomeriggio di lavoro.
  const items = banca(10, 'T', 'v');
  const progress = {};
  applica(progress, 'base-1', false, 5000, '2026-08-01');   // sbagliata, aperta
  applica(progress, 'base-2', false, 5000, '2026-08-01');   // sbagliata...
  applica(progress, 'base-2', true, 5000, '2026-08-02');    // ...poi ripresa
  applica(progress, 'base-3', true, 5000, '2026-08-01');    // mai sbagliata

  const v = diagnosi(items, progress, OGGI, 'base', { T: 4 }).voci[0];
  assert.equal(v.sbagliati, 2, 'il totale storico non cala');
  assert.equal(v.aperti, 1, 'ma le aperte si');

  // e riprendendo anche la prima, le aperte vanno a zero e il totale resta
  applica(progress, 'base-1', true, 5000, OGGI);
  const dopo = diagnosi(items, progress, OGGI, 'base', { T: 4 }).voci[0];
  assert.equal(dopo.sbagliati, 2);
  assert.equal(dopo.aperti, 0);
});

test('0.16.0 — «cosa studiare adesso» non propone lavoro gia fatto', () => {
  // `daFare` contava i `sbagliati`, che comprendono i gia' ripresi: una voce
  // interamente ripassata restava in elenco e i minuti dichiarati includevano
  // lavoro fatto. Ora conta gli `aperti`.
  const items = banca(6, 'T', 'v');
  const progress = {};
  for (const it of items) { applica(progress, it.id, false, 60000, '2026-08-01'); }
  const prima = consigli(diagnosi(items, progress, OGGI, 'base', { T: 4 }), { pesi: { T: 4 }, msMedio: 60000 });
  assert.equal(prima.voci[0].daFare, 6, 'sei aperte, sei da fare');

  // le riprendo tutte: non resta niente da fare, quindi la voce non compare
  for (const it of items) applica(progress, it.id, true, 60000, OGGI);
  const dopo = consigli(diagnosi(items, progress, OGGI, 'base', { T: 4 }), { pesi: { T: 4 }, msMedio: 60000 });
  assert.equal(dopo.voci.length, 0, 'niente mai visti e nessun errore aperto: niente da consigliare');
  assert.equal(dopo.minuti, 0, 'e zero minuti, non sei quesiti di lavoro gia fatto');
});

test('i consigli funzionano anche sulla vela, che non sta in PESI_ESAME', () => {
  const items = banca(50, 'VELA', 'MANOVRE').map((q) => ({ ...q, k: 'vela' }));
  const d = diagnosi(items, {}, OGGI, 'vela', { VELA: 5 });
  const c = consigli(d, { pesi: { VELA: 5 } });
  assert.equal(c.voci.length, 1);
  assert.ok(Math.abs(c.voci[0].peso - 5) < 1e-9, 'una voce sola si prende tutte e 5 le domande');
});

// --- quote e semaforo ---------------------------------------------------------------

test('la quota divide quello che resta per i giorni che restano', () => {
  const items = banca(100);
  const t = traccia(items, {}, '2026-08-08', 'base', '2026-08-16');
  assert.equal(t.rimanenti, 100);
  assert.equal(t.giorni, 9);
  assert.equal(t.quota, 12);
  assert.equal(t.copertura, 0);
});

test('una traccia non ancora iniziata non chiede niente e non accende allarmi', () => {
  const items = banca(135).map((q) => ({ ...q, k: 'cart' }));
  const t = traccia(items, {}, '2026-08-08', 'cart', '2026-08-30', '2026-08-17');
  assert.equal(t.quota, 0, 'il carteggio parte il 17: prima la quota e zero');
  assert.equal(t.semaforo, 'attesa');
  assert.equal(t.partita, false);

  const dopo = traccia(items, {}, '2026-08-17', 'cart', '2026-08-30', '2026-08-17');
  assert.equal(dopo.partita, true);
  assert.equal(dopo.giorni, 14);
  assert.equal(dopo.quota, 10, '135 esercizi in 14 giorni');
});

test('il semaforo confronta la copertura con l attesa lineare', () => {
  assert.equal(semaforo(0.50, '2026-08-12', '2026-08-08', '2026-08-16'), 'verde');
  assert.equal(semaforo(0.40, '2026-08-12', '2026-08-08', '2026-08-16'), 'giallo');
  assert.equal(semaforo(0.10, '2026-08-12', '2026-08-08', '2026-08-16'), 'rosso');
  assert.equal(semaforo(0.00, '2026-08-08', '2026-08-08', '2026-08-16'), 'verde', 'il primo giorno non sei in ritardo');
});


// --- simulazione d'esame ------------------------------------------------------

test('la simulazione rispetta la composizione ministeriale', () => {
  const items = bancaVera();
  const sim = simulazione(items, {}, OGGI, PESI, 7);
  assert.equal(sim.length, 20);
  const conta = {};
  for (const q of sim) conta[q.t] = (conta[q.t] || 0) + 1;
  assert.deepEqual(conta, PESI, 'ogni tema deve portare esattamente le sue domande');
  assert.equal(new Set(sim.map((q) => q.id)).size, 20, 'nessun doppione');
});

test('la simulazione fa 20 domande anche quando la banca e tutta gia vista', () => {
  const items = bancaVera();
  const progress = {};
  for (const it of items) applica(progress, it.id, true, 0, OGGI);   // tutto chiuso
  const sim = simulazione(items, progress, OGGI, PESI, 3);
  assert.equal(sim.length, 20, 'una simulazione deve poter partire sempre');
});

test('due simulazioni con semi diversi pescano domande diverse', () => {
  const items = bancaVera();
  const a = simulazione(items, {}, OGGI, PESI, 1).map((q) => q.id).sort();
  const b = simulazione(items, {}, OGGI, PESI, 2).map((q) => q.id).sort();
  assert.notDeepEqual(a, b);
});


test('la simulazione vela pesca 5 affermazioni', () => {
  const items = [...bancaVera(), ...Array.from({ length: 250 }, (_, i) =>
    ({ id: `vela-${i + 1}`, k: 'vela', t: 'VELA', v: 'TEORIA', d: 'd', r: ['Vero', 'Falso'], x: 0 }))];
  const s = simulazioneVela(items, {}, OGGI, 5, 9);
  assert.equal(s.length, 5);
  assert.ok(s.every((q) => q.k === 'vela'));
});

test('le soglie del decreto: 4 errori su 20, 1 su 5', () => {
  assert.equal(esito(Array(20).fill(true).fill(false, 0, 4), 4).superata, true, '4 errori passa');
  assert.equal(esito(Array(20).fill(true).fill(false, 0, 5), 4).superata, false, '5 errori no');
  assert.equal(esito([true, true, true, true, false], 1).superata, true);
  assert.equal(esito([true, true, true, false, false], 1).superata, false);
  assert.deepEqual(esito([true, false, true], 1), { totale: 3, esatte: 2, errori: 1, errori_max: 1, superata: true });
});

// --- screening -------------------------------------------------------------------

test('lo screening tocca ogni voce esattamente una volta', () => {
  const items = bancaVera();
  const voci = new Set(items.map((x) => x.v));
  const s = screening(items, {}, OGGI, 1, 'base', 4);
  assert.equal(s.length, voci.size, `${voci.size} voci = ${voci.size} domande`);
  assert.deepEqual(new Set(s.map((q) => q.v)).size, voci.size, 'nessuna voce saltata');
});

test('lo screening a due per voce raddoppia senza ripetere quesiti', () => {
  const items = bancaVera();
  const s = screening(items, {}, OGGI, 2, 'base', 4);
  assert.equal(s.length, new Set(items.map((x) => x.v)).size * 2);
  assert.equal(new Set(s.map((q) => q.id)).size, s.length, 'nessun doppione');
});

// --- filtro su piu argomenti --------------------------------------------------------

test('si possono spuntare piu temi insieme', () => {
  const items = bancaVera();
  const c = coda(items, {}, OGGI, { temi: ['MOTORI', 'METEOROLOGIA'], n: 0 });
  assert.equal(c.length, DIM['MOTORI'] + DIM['METEOROLOGIA']);
  assert.ok(c.every((q) => q.t === 'MOTORI' || q.t === 'METEOROLOGIA'));
});

// --- il peso d'esame riordina le priorita -------------------------------------------

// Attenzione a non confondere due misure diverse, che rispondono a due domande diverse:
//
//   resa  = domande d'esame / quesiti in banca  -> "quanto rende studiare qui"
//           Manovra 4/155 contro COLREG 2/247: 3,2 volte tanto.
//   costo = P(errore) x domande del tema x quota della voce nel tema
//           -> "quante domande d'esame mi aspetto di sbagliare per questa voce"
//
// A parita' di tasso d'errore e di quota, il costo segue il peso del tema (4 contro
// 2 = 2x), non la resa. Sono entrambe giuste: la prima ordina lo studio, la seconda
// ordina i punti persi.
test('la simulazione non pesca i quesiti oscurati dal ministero', () => {
  // I 37 oscurati dalla circolare MIT 30432/2024 all'esame non possono uscire:
  // una prova che li pesca non misura piu' il voto che prenderesti.
  const items = bancaVera().map((x, i) => (i % 7 === 0 ? { ...x, osc: 1 } : x));
  const oscurati = new Set(items.filter(oscurato).map((x) => x.id));
  assert.ok(oscurati.size > 100, 'il campione di prova ha abbastanza oscurati');
  for (const seme of [1, 7, 99, 12345]) {
    const prova = simulazione(items, {}, OGGI, PESI, seme);
    assert.equal(prova.length, 20, 'restano 20 domande');
    assert.ok(!prova.some((x) => oscurati.has(x.id)), `seme ${seme}: nessun oscurato in prova`);
  }
  // e la composizione ministeriale non si sfalda togliendoli
  const conta = {};
  for (const x of simulazione(items, {}, OGGI, PESI, 3)) conta[x.t] = (conta[x.t] || 0) + 1;
  assert.deepEqual(conta, PESI, 'la composizione per tema resta quella del decreto');
});

test('anche la simulazione vela salta gli oscurati, se un domani ce ne fossero', () => {
  const vela = Array.from({ length: 40 }, (_, i) => ({
    id: `vela-${i + 1}`, k: 'vela', t: 'VELA', v: 'TEORIA', d: `a${i}`, r: ['Vero', 'Falso'], x: 0,
    ...(i < 30 ? { osc: 1 } : {}),
  }));
  const prova = simulazioneVela(vela, {}, OGGI, 5, 42);
  assert.equal(prova.length, 5);
  assert.ok(prova.every((x) => !oscurato(x)), 'nessun oscurato fra le 5 affermazioni');
});

test('oscurato() legge il campo, non la nota: riscrivere un testo non sposta un sorteggio', () => {
  assert.equal(oscurato({ osc: 1 }), true);
  assert.equal(oscurato({ nbp: 'una nota qualunque' }), false);
  assert.equal(oscurato({}), false);
  assert.equal(oscurato(null), false);
});

test('a parita di errore, una voce di Manovra costa il doppio di una di COLREG', () => {
  const items = bancaVera();
  const progress = {};
  const sbaglia = (tema, quanti) => items.filter((x) => x.t === tema && x.v.endsWith('v0'))
    .slice(0, quanti).forEach((it) => applica(progress, it.id, false, 0, OGGI));
  sbaglia('MANOVRA E CONDOTTA', 10);
  sbaglia('COLREG E SEGNALAMENTO MARITTIMO', 10);

  const d = diagnosi(items, progress, OGGI, 'base', PESI);
  const man = d.voci.find((v) => v.tema === 'MANOVRA E CONDOTTA' && v.nome.endsWith('v0'));
  const col = d.voci.find((v) => v.tema === 'COLREG E SEGNALAMENTO MARITTIMO' && v.nome.endsWith('v0'));

  assert.ok(Math.abs(man.debolezza - col.debolezza) < 0.01, 'stesso tasso d errore');
  assert.ok(man.costo > col.costo, 'ma la voce di Manovra costa di piu: 4 domande d esame contro 2');
  assert.ok(Math.abs(man.costo / col.costo - 2) < 0.15, `atteso ~2x, trovato ${(man.costo / col.costo).toFixed(2)}x`);
});

test('la resa per quesito studiato: Manovra rende 3,2 volte COLREG', () => {
  const d = diagnosi(bancaVera(), {}, OGGI, 'base', PESI);
  const man = d.temi.find((t) => t.nome.startsWith('MANOVRA'));
  const col = d.temi.find((t) => t.nome.startsWith('COLREG'));
  assert.equal(man.resa.toFixed(4), (4 / 155).toFixed(4));
  assert.equal(col.resa.toFixed(4), (2 / 247).toFixed(4));
  assert.ok(man.resa / col.resa > 3.1, `atteso >3,1x, trovato ${(man.resa / col.resa).toFixed(2)}x`);
});

test('i temi in diagnosi sono ordinati per peso d esame, non per dimensione', () => {
  const d = diagnosi(bancaVera(), {}, OGGI, 'base', PESI);
  assert.equal(d.temi[0].esame, 4);
  assert.equal(d.temi.at(-1).esame, 1);
  const colreg = d.temi.find((t) => t.nome.startsWith('COLREG'));
  const manovra = d.temi.find((t) => t.nome.startsWith('MANOVRA'));
  assert.ok(manovra.resa > colreg.resa * 3, 'la resa per quesito di Manovra e oltre il triplo');
});

test('senza pesi la diagnosi funziona come prima', () => {
  const d = diagnosi(bancaVera(), {}, OGGI, 'base');
  assert.equal(d.voci[0].costo, undefined);
  assert.ok(d.temi.every((t) => t.esame === undefined));
});

// --- estrazione -------------------------------------------------------------------

test('estrai non restituisce piu item di quanti ce ne siano', () => {
  const pool = banca(3);
  assert.equal(estrai(pool, {}, OGGI, 10, 1).length, 3);
  assert.equal(estrai([], {}, OGGI, 5, 1).length, 0);
});

// --- la memoria non si butta ------------------------------------------------
//
// Questi test esistono per un bug preciso, non per completezza: nella 0.4.1 la
// pagina sostituiva il proprio storico con quello del server, e quando il server
// ne sapeva meno la batteria ripartiva da base-1 a ogni sessione. Il sintomo
// sembrava un problema di estrazione; era la memoria.

test('fondi: un server piu povero non cancella lo storico locale', () => {
  const locale = { 'base-1': { n: 1, c: 1 }, 'base-2': { n: 1, c: 0 } };
  const f = fondi(locale, {});
  assert.equal(Object.keys(f).length, 2, 'lo specchio locale deve sopravvivere');
  assert.deepEqual(f['base-1'], locale['base-1']);
});

test('fondi: per ogni quesito vince chi ha piu risposte', () => {
  const locale = { 'base-1': { n: 3, c: 2 } };   // ho ancora roba in coda
  const remoto = { 'base-1': { n: 1, c: 1 } };
  assert.equal(fondi(locale, remoto)['base-1'].n, 3);

  const locale2 = { 'base-1': { n: 1, c: 1 } };
  const remoto2 = { 'base-1': { n: 4, c: 3 } };  // un altro dispositivo ha risposto
  assert.equal(fondi(locale2, remoto2)['base-1'].n, 4);
});

test('fondi: a parita di risposte vince il server, che e la copia durevole', () => {
  const f = fondi({ 'base-1': { n: 2, c: 0 } }, { 'base-1': { n: 2, c: 2 } });
  assert.equal(f['base-1'].c, 2);
});

test('fondi: unisce quesiti diversi visti su dispositivi diversi', () => {
  const f = fondi({ 'base-1': { n: 1 } }, { 'base-9': { n: 1 } });
  assert.deepEqual(Object.keys(f).sort(), ['base-1', 'base-9']);
});

test('fondi regge gli specchi vuoti o assenti', () => {
  assert.deepEqual(fondi(null, null), {});
  assert.deepEqual(fondi({}, { 'base-1': { n: 1 } }), { 'base-1': { n: 1 } });
  assert.deepEqual(fondi({ 'base-1': { n: 1 } }, null), { 'base-1': { n: 1 } });
});

test('la batteria avanza: dopo aver risposto, i quesiti chiusi non ritornano', () => {
  const items = banca(30);
  const prog = {};
  const primi = coda(items, prog, OGGI, { n: 5 });
  for (const it of primi) applica(prog, it.id, true, 1000, OGGI);
  const secondi = coda(items, prog, OGGI, { n: 5 });
  const tornati = secondi.filter((s) => primi.some((p) => p.id === s.id));
  assert.equal(tornati.length, 0, 'nessun quesito gia chiuso deve ricomparire');
});

test('con lo specchio azzerato la batteria ricomincia da capo (il sintomo del bug)', () => {
  const items = banca(30);
  const prog = {};
  const primi = coda(items, prog, OGGI, { n: 5 });
  for (const it of primi) applica(prog, it.id, true, 1000, OGGI);
  // e' quello che faceva `S.prog = p.quiz` con un server vuoto
  const dopoAzzeramento = coda(items, {}, OGGI, { n: 5 });
  assert.deepEqual(dopoAzzeramento.map((x) => x.id), primi.map((x) => x.id));
});

// --- le date sono quelle di casa, non quelle di Greenwich -------------------
//
// Il client mandava `new Date().toISOString()`, cioe' UTC, mentre il server
// ricava il giorno di studio da ts[:10]. Alle 00:30 del 10 agosto la risposta
// finiva nel 9: sbagliavano i richiami D+1/D+3/D+7, il conteggio giornaliero e
// il contatore "fatte oggi".

test('isoLocale: dopo mezzanotte vale il giorno locale, non quello UTC', () => {
  const istante = new Date('2026-08-09T22:30:00.000Z');   // 00:30 del 10, a Roma
  assert.equal(isoLocale(istante, 120), '2026-08-10T00:30:00.000+02:00');
  assert.equal(isoLocale(istante, 120).slice(0, 10), '2026-08-10');
  assert.equal(istante.toISOString().slice(0, 10), '2026-08-09', 'era questo il bug');
});

test('isoLocale: regge gli offset negativi e quelli a mezz ora', () => {
  const istante = new Date('2026-08-09T22:30:00.000Z');
  assert.equal(isoLocale(istante, -300), '2026-08-09T17:30:00.000-05:00');
  assert.equal(isoLocale(istante, 330), '2026-08-10T04:00:00.000+05:30');
  assert.equal(isoLocale(istante, 0), '2026-08-09T22:30:00.000+00:00');
});

test('isoLocale non sposta l istante: cambia solo come lo si scrive', () => {
  const istante = new Date('2026-08-09T22:30:00.000Z');
  for (const off of [0, 120, -300, 330]) {
    assert.equal(new Date(isoLocale(istante, off)).getTime(), istante.getTime());
  }
});

test('isoLocale: a offset costante l ordine lessicografico resta cronologico', () => {
  // db.py ordina con ORDER BY ts: se la stringa non ordina, `first` e la
  // streak si calcolano sulla sequenza sbagliata.
  const a = isoLocale(new Date('2026-08-09T22:30:00.000Z'), 120);
  const b = isoLocale(new Date('2026-08-09T23:30:00.000Z'), 120);
  const c = isoLocale(new Date('2026-08-10T06:00:00.000Z'), 120);
  assert.ok(a < b && b < c);
});

/* --- 0.4.6: il semaforo, e la traccia vuota ------------------------------ */

test('semaforo: senza data di inizio l atteso e zero, quindi e sempre verde', () => {
  // E' il difetto: `traccia()` accettava `inizio` ma la pagina non glielo
  // passava, quindi l'inizio coincideva con oggi e qualunque copertura --
  // compresa zero -- superava l'atteso.
  assert.equal(semaforo(0, '2026-08-25', null, '2026-08-27'), 'verde');
  assert.equal(semaforo(0.071, '2026-08-25', null, '2026-08-27'), 'verde');
});

test('semaforo: con la data di inizio dice la verita', () => {
  assert.equal(semaforo(0, '2026-08-25', '2026-08-13', '2026-08-27'), 'rosso');
  assert.equal(semaforo(0.071, '2026-08-25', '2026-08-13', '2026-08-27'), 'rosso');
  // il primo giorno del piano nessuno e' in ritardo
  assert.equal(semaforo(0, '2026-08-25', '2026-08-25', '2026-08-27'), 'verde');
  // ma il giorno dopo si': 1 giorno su 3 = 33% atteso, 5% fatto
  assert.equal(semaforo(0.05, '2026-08-26', '2026-08-25', '2026-08-27'), 'rosso');
  // e a dieci punti sotto e' giallo, non rosso
  assert.equal(semaforo(0.28, '2026-08-26', '2026-08-25', '2026-08-27'), 'giallo');
});

test('semaforo: una copertura NaN non deve diventare rosso', () => {
  // `traccia()` proteggeva `copertura` dalla divisione per zero ma passava a
  // `semaforo()` un `chiusi / totale` nudo. Con zero item arrivava NaN, e
  // siccome `NaN >= x` e' falso due volte si cadeva su 'rosso': il riquadro
  // Tecniche era rosso finche' la sua banca non arrivava.
  assert.equal(semaforo(NaN, '2026-08-25', '2026-08-25', '2026-08-27'), 'verde');
  assert.equal(semaforo(undefined, '2026-08-25', '2026-08-25', '2026-08-27'), 'verde');
});

test('traccia su zero item: attesa, non un allarme', () => {
  const t = traccia([], {}, '2026-08-25', 'tec', '2026-08-27', '2026-08-25');
  assert.equal(t.totale, 0);
  assert.equal(t.copertura, 0);
  assert.equal(t.quota, 0);
  assert.equal(t.semaforo, 'attesa', 'zero item non vuol dire "sei a posto" ne "sei in ritardo"');
});

test('traccia: la data di inizio arriva fino al semaforo', () => {
  const items = Array.from({ length: 10 }, (_, i) => ({ id: 'base-' + (i + 1), k: 'base' }));
  const senza = traccia(items, {}, '2026-08-26', 'base', '2026-08-27');
  const con = traccia(items, {}, '2026-08-26', 'base', '2026-08-27', '2026-08-25');
  assert.equal(senza.semaforo, 'verde', 'com era prima');
  assert.equal(con.semaforo, 'rosso', 'com e adesso, a copertura zero');
});

test('traccia: un quesito sbagliato e mai ripreso non e coperto, quindi resta nei rimanenti', () => {
  const items = Array.from({ length: 10 }, (_, i) => ({ id: 'base-' + (i + 1), k: 'base' }));
  const prog = { 'base-1': { n: 1, c: 0, first: 0, s: 0, lw: '2026-08-20', k: 0, t: '2026-08-20' } };
  const t = traccia(items, prog, '2026-08-25', 'base', '2026-08-27', '2026-08-25');
  assert.equal(t.nuovi, 9, 'base-1 e stato visto, gli altri no');
  assert.equal(t.chiusi, 1, 'per la selezione, risposto una volta basta a chiuderlo');
  assert.equal(t.coperti, 0, 'ma per la copertura no: preso male non e coperto');
  assert.equal(t.da_ripassare, 1);
  assert.equal(t.rimanenti, 10, 'il lavoro che resta comprende anche il da ripassare');
  assert.equal(t.sbagliati, 1);
});

/* --- 0.6.0: la copertura in tre stati che sommano ------------------------- */

test('classifica: mai visto, coperto, da ripassare', () => {
  assert.equal(classifica(undefined), 'mai_visto');
  const p = {};
  applica(p, 'q', false, 0, '2026-08-20');
  assert.equal(classifica(p['q']), 'da_ripassare', 'sbagliato e mai ripreso');
  applica(p, 'q', true, 0, '2026-08-25');
  assert.equal(classifica(p['q']), 'coperto', 'ripreso e preso giusto');
  applica(p, 'q', false, 0, '2026-08-26');
  assert.equal(classifica(p['q']), 'da_ripassare', 'un nuovo errore riapre il buco');
  const g = {};
  applica(g, 'q', true, 0, '2026-08-20');
  assert.equal(classifica(g['q']), 'coperto', 'giusto al primo colpo');
});

test('coperti + da_ripassare + mai_visti === totale, sempre', () => {
  const items = banca(30);
  const prog = {};
  // un misto: giusti, sbagliati, sbagliati poi ripresi, ripresi poi risbagliati
  for (let i = 1; i <= 8; i++) applica(prog, `base-${i}`, true, 1000, OGGI);
  for (let i = 9; i <= 14; i++) applica(prog, `base-${i}`, false, 1000, OGGI);
  for (let i = 12; i <= 14; i++) applica(prog, `base-${i}`, true, 1000, '2026-08-09');
  applica(prog, 'base-8', false, 1000, '2026-08-09');
  const t = traccia(items, prog, '2026-08-10', 'base', '2026-08-30', OGGI);
  assert.equal(t.coperti + t.da_ripassare + t.mai_visti, t.totale,
    'tre numeri vincolati alla somma non possono mentire');
  assert.equal(t.coperti, 10, '7 giusti al primo colpo + 3 ripresi');
  assert.equal(t.da_ripassare, 4, '3 mai ripresi + base-8 risbagliato');
  assert.equal(t.mai_visti, 16);
  assert.equal(t.copertura, 10 / 30, 'la copertura conta i coperti, non i toccati');
});

/* --- 0.6.0: lo screening esplora, la simulazione simula ------------------- */

test('estraiNuoviPrima: prima i mai visti, i gia fatti solo se i nuovi non bastano', () => {
  const pool = banca(10);
  const prog = {};
  for (let i = 1; i <= 6; i++) applica(prog, `base-${i}`, true, 0, OGGI);
  const quattro = estraiNuoviPrima(pool, prog, OGGI, 4, 7);
  assert.ok(quattro.every((x) => !prog[x.id]), 'con 4 nuovi disponibili, nessun gia fatto');
  const sette = estraiNuoviPrima(pool, prog, OGGI, 7, 7);
  assert.equal(sette.filter((x) => !prog[x.id]).length, 4, 'tutti e 4 i nuovi ci sono');
  assert.equal(sette.length, 7, 'e si completa con i gia fatti');
  assert.deepEqual(estraiNuoviPrima(pool, prog, OGGI, 7, 7).map((x) => x.id),
    sette.map((x) => x.id), 'stesso seme, stessa pescata');
});

test('lo screening non ripropone quesiti gia fatti finche ci sono mai visti', () => {
  const items = bancaVera();
  const prog = {};
  // rispondo a meta banca: lo screening a 1 per voce deve pescare solo nuovi
  items.filter((_, i) => i % 2 === 0).forEach((it) => applica(prog, it.id, true, 0, OGGI));
  const s = screening(items, prog, OGGI, 1, 'base', 4);
  assert.ok(s.every((q) => !prog[q.id]), 'ogni voce ha ancora mai visti: nessun ripescaggio');
  // ...mentre la simulazione continua a pescare senza preferenze (e' il test
  // "criterio 2" sopra: estrai() resta cieco; qui si fissa solo la differenza)
  assert.notEqual(screening(items, {}, OGGI, 1, 'base', 4).map((q) => q.id).join(),
    s.map((q) => q.id).join(), 'lo storico cambia lo screening');
});

/* --- 0.6.0: le ore, non le domande ---------------------------------------- */

test('stimaImpegno: sotto le 30 risposte misurate vale il ripiego dichiarato', () => {
  const prog = {};
  for (let i = 1; i <= 10; i++) applica(prog, `base-${i}`, true, 20000, OGGI);
  const s = stimaImpegno(prog, 322, 6);
  assert.equal(s.affidabile, false);
  assert.equal(s.mediaMs, RIPIEGO_MS, 'niente medie inventate su 10 risposte');
  assert.equal(s.minutiTotali, Math.round(322 * RIPIEGO_MS / 60000));
});

test('stimaImpegno: con abbastanza risposte usa la media misurata, pesata sul numero', () => {
  const prog = {};
  for (let i = 1; i <= 30; i++) applica(prog, `base-${i}`, true, 12000, OGGI);
  const s = stimaImpegno(prog, 300, 6);
  assert.equal(s.affidabile, true);
  assert.equal(s.mediaMs, 12000);
  assert.equal(s.minutiTotali, 60, '300 quesiti a 12 s sono 60 minuti');
  assert.equal(s.minutiAlGiorno, 10);
});

/* --- 0.7.0: l'andamento nel tempo ------------------------------------------ */

test('serieGruppi: aggrega la serie del server per tema e per voce', () => {
  const items = [
    { id: 'base-1', k: 'base', t: 'MOTORI', v: 'Elica' },
    { id: 'base-2', k: 'base', t: 'MOTORI', v: 'Elica' },
    { id: 'base-3', k: 'base', t: 'MOTORI', v: 'Carburante' },
    { id: 'vela-1', k: 'vela', t: 'VELA', v: 'Teoria' },
  ];
  const serie = {
    'base-1': { '2026-08-20': [1, 2], '2026-08-22': [2, 2] },
    'base-2': { '2026-08-20': [0, 1] },
    'base-3': { '2026-08-22': [1, 1] },
    'vela-1': { '2026-08-20': [1, 1] },      // altra banca: non entra con kind base
  };
  const sg = serieGruppi(items, serie, [], 'base');
  assert.deepEqual(sg.temi['MOTORI'], { '2026-08-20': [1, 3], '2026-08-22': [3, 3] });
  assert.deepEqual(sg.voci['MOTORI › Elica'], { '2026-08-20': [1, 3], '2026-08-22': [2, 2] });
  assert.deepEqual(sg.voci['MOTORI › Carburante'], { '2026-08-22': [1, 1] });
  assert.equal(sg.temi['VELA'], undefined, 'la vela resta fuori dal kind base');
});

test('serieGruppi: le risposte in coda locale contano subito, anche senza server', () => {
  const items = [{ id: 'base-1', k: 'base', t: 'MOTORI', v: 'Elica' }];
  const coda = [
    { item_id: 'base-1', ts: '2026-08-25T10:00:00.000+02:00', correct: 1 },
    { item_id: 'base-1', ts: '2026-08-25T10:01:00.000+02:00', correct: 0 },
    { item_id: 'ignoto', ts: '2026-08-25T10:02:00.000+02:00', correct: 1 },   // id non in banca
  ];
  const sg = serieGruppi(items, {}, coda, 'base');
  assert.deepEqual(sg.temi['MOTORI'], { '2026-08-25': [1, 2] });
});

test('tendenza: sale, scende, o stabile — confrontando le due meta dei giorni', () => {
  const su = tendenza({ '2026-08-20': [2, 6], '2026-08-21': [3, 6], '2026-08-22': [5, 6], '2026-08-23': [6, 6] });
  assert.equal(su.verdetto, 'su');
  assert.equal(su.punti.length, 4);
  assert.deepEqual(su.punti.map((p) => p.g),
    ['2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23'], 'punti in ordine di giorno');

  const giu = tendenza({ '2026-08-20': [6, 6], '2026-08-21': [5, 6], '2026-08-22': [2, 6], '2026-08-23': [1, 6] });
  assert.equal(giu.verdetto, 'giu');

  const piatta = tendenza({ '2026-08-20': [5, 6], '2026-08-21': [5, 6], '2026-08-22': [5, 6], '2026-08-23': [5, 6] });
  assert.equal(piatta.verdetto, 'stabile');
});

test('tendenza: sotto la soglia di dati niente verdetto, ma i punti restano', () => {
  // un giorno solo: nessuna tendenza, per quanti dati ci siano
  assert.equal(tendenza({ '2026-08-20': [30, 40] }).verdetto, null);
  // due giorni ma poche risposte: due batterie non sono una tendenza
  const poche = tendenza({ '2026-08-20': [2, 4], '2026-08-21': [4, 4] });
  assert.ok(4 + 4 < TENDENZA_MIN_RISPOSTE, 'lo scenario deve stare sotto soglia');
  assert.equal(poche.verdetto, null);
  assert.equal(poche.punti.length, 2, 'le barre si disegnano comunque');
  assert.ok(TENDENZA_MIN_GIORNI >= 2);
  assert.deepEqual(tendenza({}).punti, []);
});

/* --- 0.6.0: la modalita Mirata -------------------------------------------- */

test('mirata: deterministica — stesso storico e stesso giorno, stessa lista', () => {
  const items = bancaVera();
  const prog = {};
  for (let i = 1; i <= 40; i++) applica(prog, `base-${i}`, i % 4 !== 0, 12000, '2026-08-24');
  const a = mirata(items, prog, '2026-08-25', { n: 25, pesi: PESI, esame: '2026-09-03' });
  const b = mirata(items, prog, '2026-08-25', { n: 25, pesi: PESI, esame: '2026-09-03' });
  assert.deepEqual(a.map((x) => x.it.id), b.map((x) => x.it.id),
    'se non e riproducibile non e verificabile');
  const c = mirata(items, prog, '2026-08-26', { n: 25, pesi: PESI, esame: '2026-09-03' });
  assert.notDeepEqual(a.map((x) => x.it.id), c.map((x) => x.it.id),
    'un altro giorno, un altra lista');
});

test('mirata: i richiami ci sono, col tetto per batteria', () => {
  const items = bancaVera();
  const prog = {};
  // 12 sbagliati in sospeso: piu del tetto (5 su 25)
  for (let i = 1; i <= 12; i++) applica(prog, `base-${i}`, false, 12000, '2026-08-2' + (i % 3));
  const m = mirata(items, prog, '2026-08-25', { n: 25, pesi: PESI, esame: '2026-09-03' });
  assert.equal(m.length, 25);
  const richiami = m.filter((x) => x.perche.startsWith('richiamo'));
  assert.equal(richiami.length, 5, 'il tetto: 5 su 25, non tutti e 12 ammucchiati');
  assert.ok(richiami.every((x) => classifica(prog[x.it.id]) === 'da_ripassare'));
  // e un errore gia ripreso non e un richiamo
  applica(prog, 'base-1', true, 9000, '2026-08-24');
  const dopo = mirata(items, prog, '2026-08-25', { n: 25, pesi: PESI, esame: '2026-09-03' });
  assert.ok(!dopo.some((x) => x.it.id === 'base-1' && x.perche.startsWith('richiamo')),
    'ripreso correttamente: non e piu in sospeso');
});

test('mirata: ogni quesito sa dire perche e li', () => {
  const items = bancaVera();
  const prog = {};
  for (let i = 1; i <= 3; i++) applica(prog, `base-${i}`, false, 12000, '2026-08-24');
  const m = mirata(items, prog, '2026-08-25', { n: 25, pesi: PESI, esame: '2026-09-03' });
  assert.ok(m.every((x) => typeof x.perche === 'string' && x.perche.length > 0),
    'un selettore che non si spiega e indistinguibile da uno rotto');
  assert.ok(m.some((x) => /mai visto/.test(x.perche)), 'oggi domina l esplorazione');
  assert.ok(m.filter((x) => /resa (alta|media|bassa)/.test(x.perche)).length > 0,
    'l esplorazione dichiara la resa del tema');
});

test('mirata: con storico vuoto e tutta esplorazione, senza doppioni', () => {
  const m = mirata(bancaVera(), {}, '2026-08-25', { n: 25, pesi: PESI, esame: '2026-09-03' });
  assert.equal(m.length, 25);
  assert.ok(m.every((x) => /mai visto/.test(x.perche)));
  assert.equal(new Set(m.map((x) => x.it.id)).size, 25);
});

test('mirata: il consolidamento compare con copertura alta e l esame vicino', () => {
  const items = bancaVera();
  const prog = {};
  // tutta la banca coperta; una voce e debole: 3 quesiti su 5 sbagliati alla
  // prima risposta (e' `first` che misura la debolezza) e poi ripresi
  const deboli = items.filter((x) => x.t === 'MANOVRA E CONDOTTA' && x.v.endsWith('v0')).slice(0, 3);
  const deboliId = new Set(deboli.map((x) => x.id));
  for (const it of items) if (!deboliId.has(it.id)) applica(prog, it.id, true, 9000, '2026-08-20');
  for (const it of deboli) {
    applica(prog, it.id, false, 9000, '2026-08-21');
    applica(prog, it.id, true, 9000, '2026-08-22');
  }
  const m = mirata(items, prog, '2026-09-01', { n: 25, pesi: PESI, esame: '2026-09-03' });
  const conferme = m.filter((x) => /conferma/.test(x.perche));
  assert.ok(conferme.length > 0, 'a due giorni dall esame le voci deboli si confermano');
  assert.ok(conferme.every((x) => x.it.v.endsWith('v0') && x.it.t === 'MANOVRA E CONDOTTA'),
    'le conferme vengono dalla voce debole, non da voci a caso');
});

test('coda con stati [nuovo]: la modalita solo-mai-fatte non ripesca niente', () => {
  const items = Array.from({ length: 6 }, (_, i) => ({ id: 'base-' + (i + 1), k: 'base' }));
  const prog = {
    'base-1': { n: 1, c: 0, first: 0, s: 0, lw: '2026-08-01', k: 0, t: '2026-08-01' }, // sbagliato
    'base-2': { n: 1, c: 1, first: 1, s: 1, lw: null, k: 0, t: '2026-08-01' },         // preso
    'base-3': { n: 2, c: 1, first: 0, s: 1, lw: '2026-08-25', k: 1, t: '2026-08-25' }, // sbagliato poi ripreso
  };
  const solo = coda(items, prog, '2026-08-25', { kind: 'base', stati: ['nuovo'], n: 20 });
  assert.deepEqual(solo.map(x => x.id), ['base-4', 'base-5', 'base-6']);
  assert.ok(!solo.some(x => prog[x.id]), 'nessun quesito gia risposto');

  // senza filtro escono comunque prima i mai visti, poi piu' niente: i gia'
  // risposti sono chiusi e non rientrano se non con includiChiusi
  const tutte = coda(items, prog, '2026-08-25', { kind: 'base', n: 20 });
  assert.deepEqual(tutte.map(x => x.id), ['base-4', 'base-5', 'base-6']);
  const conChiusi = coda(items, prog, '2026-08-25', { kind: 'base', n: 20, includiChiusi: true });
  assert.equal(conChiusi.length, 6, 'con includiChiusi tornano tutti');
  assert.deepEqual(conChiusi.slice(0, 3).map(x => x.id), ['base-4', 'base-5', 'base-6'],
    'e i mai visti restano davanti');
});


/* --- 0.5.0: il guscio offline, e la prova di carteggio ------------------- */

test('il GUSCIO di sw.js e quello di app.html sono la stessa lista', async () => {
  // Sono due copie della stessa cosa, in due file diversi: una le mette in
  // cache, l'altra controlla che ci siano. Se divergono, l'autodiagnosi dice
  // "guscio incompleto" per un file che nessuno ha mai messo in cache, oppure —
  // peggio — dice "pronto per l'offline" mentre manca qualcosa.
  // Unificarle richiederebbe un import fra service worker e pagina; questo test
  // costa una riga e prende la divergenza il giorno in cui succede.
  const fs = await import('node:fs/promises');
  const dir = new URL('../site/', import.meta.url);
  const estrai = (testo) => {
    const m = testo.match(/const GUSCIO = \[([\s\S]*?)\]/);
    assert.ok(m, 'GUSCIO non trovato');
    // Solo le stringhe che sono percorsi: dentro i commenti italiani ci sono
    // apostrofi (l'esame, dell'app) che altrimenti finiscono nella lista.
    return [...m[1].matchAll(/'(\/[^']*)'/g)].map((x) => x[1]);
  };
  const sw = estrai(await fs.readFile(new URL('sw.js', dir), 'utf8'));
  // Dalla 0.22.0 la palestra e' app.html: index.html e' la vetrina.
  const pagina = estrai(await fs.readFile(new URL('app.html', dir), 'utf8'));
  assert.deepEqual(sw, pagina, 'il guscio di sw.js e quello di app.html sono diversi');
  assert.ok(sw.includes('/dati/carteggio.json'), 'la prova di carteggio deve funzionare offline');
  // Ogni voce del guscio deve esistere davvero in site/: un percorso sbagliato
  // qui fa dire all'autodiagnosi «guscio incompleto» per sempre, oppure — se
  // `c.add` fallisce in silenzio — «pronto per l'offline» con un buco dentro.
  // I percorsi sono quelli **serviti**, non i nomi dei file: Cloudflare Pages
  // serve privacy.html all'indirizzo /privacy e risponde 308 a /privacy.html.
  // Una risposta rediretta in cache non si puo' servire a una navigazione, e
  // nella 0.19.1 i due link del pie' di pagina erano morti anche online.
  for (const u of sw) {
    assert.ok(!u.endsWith('.html'), `${u}: Pages risponde 308 al percorso con l'estensione`);
    const f = u === '/' ? 'index.html' : u.slice(1);
    await fs.access(new URL(/\.[a-z]+$/.test(f) ? f : f + '.html', dir));
  }
});

test('la prova di carteggio: uno per argomento, pescati a caso', () => {
  // Riproduce `componiProva`: quattro pool per argomento, `estrai` su ciascuno.
  const ARG = ['navigazione costiera', 'correnti', 'scarroccio', 'carburante'];
  const banca = [];
  for (const a of ARG) for (let i = 1; i <= 8; i++) banca.push({ id: `${a}-${i}`, k: 'c', argomento: a });

  const componi = (prog, seme) => {
    const out = [];
    ARG.forEach((a, i) => out.push(...estrai(banca.filter((e) => e.argomento === a), prog, OGGI, 1, seme + 100 * (i + 1))));
    return out;
  };

  const prova = componi({}, 7);
  assert.equal(prova.length, 4, 'quattro esercizi, come la prova vera');
  assert.deepEqual([...new Set(prova.map((e) => e.argomento))].sort(), [...ARG].sort(),
    'uno per ciascuno dei quattro argomenti');

  // due prove con semi diversi non devono essere la stessa prova
  const a = componi({}, 1).map((e) => e.id).join();
  const b = componi({}, 2).map((e) => e.id).join();
  assert.notEqual(a, b, 'due prove di fila devono differire');

  // anche la prova di carteggio pesca senza guardare lo storico: e' una
  // simulazione d'esame, e all'esame nessuno sa quali esercizi hai gia' fatto
  const visti = {};
  for (const e of banca) if (e.id !== 'correnti-5') visti[e.id] = { n: 1, c: 1, first: 1, s: 1, lw: null, k: 0, t: OGGI };
  assert.deepEqual(componi(visti, 3).map((e) => e.id), componi({}, 3).map((e) => e.id),
    'stesso seme, stessa prova: lo storico non la cambia');
});

test('la soglia della prova di carteggio e 3 su 4, ed e eliminatoria', () => {
  assert.equal(esito([true, true, true, false], 1).superata, true, '3 su 4 passa');
  assert.equal(esito([true, true, false, false], 1).superata, false, '2 su 4 no');
  assert.equal(esito([true, true, true, true], 1).superata, true);
  assert.equal(esito([false, false, false, false], 1).errori, 4);
});

// --- il gioco dei segnali -------------------------------------------------------
//
// Il dataset e' scritto a mano sulle regole COLREG, quindi i test devono
// difendere due cose: che ogni voce sia ben formata (un refuso in un colore o
// in un pattern diventerebbe una scheda che insegna il falso), e che una
// domanda non possa mai avere due risposte giuste.

test('segnali: il dataset e ben formato, voce per voce', () => {
  const ids = new Set();
  const COLORI = new Set(['R', 'V', 'B', 'G', 'VR']);
  const SAGOME = new Set(['pallone', 'cono_su', 'cono_giu', 'bicono', 'diamante', 'cilindro']);
  const SUONI = new Set(['fischio', 'campana', 'campana+gong', 'campana3']);
  for (const e of SEGNALI) {
    assert.ok(!ids.has(e.id), `id doppio: ${e.id}`);
    ids.add(e.id);
    assert.ok(SEGNALI_MODI.includes(e.modo), `${e.id}: modo sconosciuto ${e.modo}`);
    assert.ok(typeof e.o === 'string' && e.o.length > 5, `${e.id}: risposta mancante`);
    if (e.modo === 'notturni') {
      assert.ok(Array.isArray(e.luci) && e.luci.length >= 1, `${e.id}: senza luci`);
      for (const l of e.luci) {
        assert.ok(COLORI.has(l.c), `${e.id}: colore sconosciuto ${l.c}`);
        assert.ok(l.x >= 0 && l.x <= 100 && l.y >= 0 && l.y <= 100, `${e.id}: fuori quadro`);
      }
    }
    if (e.modo === 'diurni') {
      assert.ok(Array.isArray(e.diurno) && e.diurno.length >= 1, `${e.id}: senza sagome`);
      for (const col of e.diurno) for (const s of col)
        assert.ok(SAGOME.has(s), `${e.id}: sagoma sconosciuta ${s}`);
    }
    if (e.modo === 'nebbia' || e.modo === 'manovra') {
      assert.ok(e.s && SUONI.has(e.s.t), `${e.id}: suono sconosciuto`);
      if (e.s.t === 'fischio')
        assert.ok(/^[LB]+$/.test(e.s.p), `${e.id}: pattern non valido ${e.s.p}`);
    }
  }
});

test('segnali: ogni modalita ha abbastanza voci per fare tre opzioni', () => {
  for (const m of SEGNALI_MODI) {
    const pool = poolSegnali(m);
    assert.ok(pool.length >= 8, `${m}: solo ${pool.length} voci`);
    // e i testi delle risposte sono unici dentro la modalita', perche' sono
    // loro a fare da opzioni
    assert.equal(new Set(pool.map((e) => e.o)).size, pool.length, `${m}: risposte doppie`);
  }
});

test('segnali: dentro una modalita nessuna resa e ambigua senza firma', () => {
  // Due voci con la stessa resa e firme diverse sarebbero una domanda con due
  // risposte giuste in attesa di uscire. La resa si confronta per struttura.
  for (const m of SEGNALI_MODI) {
    const viste = new Map();
    for (const e of poolSegnali(m)) {
      const resa = JSON.stringify(e.luci || e.diurno || e.s);
      const firma = e.firma || e.id;
      if (viste.has(resa))
        assert.equal(viste.get(resa), firma,
          `${m}: ${e.id} ha la stessa resa di un'altra voce ma firma diversa`);
      viste.set(resa, firma);
    }
  }
});

test('segnali: tre opzioni, una sola esatta, mai due rese uguali in campo', () => {
  for (const m of SEGNALI_MODI) {
    const dom = domandeSegnali(m, 10, 42);
    assert.ok(dom.length >= 8, `${m}: partita corta`);
    assert.equal(new Set(dom.map((d) => d.id)).size, dom.length, `${m}: domanda ripetuta`);
    for (const d of dom) {
      assert.equal(d.opzioni.length, 3, `${d.id}: opzioni ${d.opzioni.length}`);
      assert.equal(new Set(d.opzioni).size, 3, `${d.id}: opzioni doppie`);
      assert.equal(d.opzioni[d.corretta], d.e.o, `${d.id}: l'esatta non e' al suo indice`);
      // nessun distrattore puo' condividere la firma del segnale mostrato
      const firma = d.e.firma || d.e.id;
      const perTesto = new Map(poolSegnali(m).map((e) => [e.o, e]));
      for (const [i, o] of d.opzioni.entries()) {
        if (i === d.corretta) continue;
        const altro = perTesto.get(o);
        assert.notEqual(altro.firma || altro.id, firma,
          `${d.id}: distrattore con la stessa resa (${altro.id})`);
      }
    }
  }
});

test('segnali: la partita e lunga quanto la schermata promette', () => {
  // Il difetto che questo test fissa: la schermata scriveva «In archivio 8
  // segnali; ogni partita ne pesca 10» e divideva il punteggio migliore per un
  // 10 fisso. I pool sono 27 / 9 / 9 / 8, quindi su tre modalita su quattro il
  // 10/10 non era raggiungibile e nessuno diceva perche. Ora il numero
  // promesso e la partita che si apre escono dalla **stessa** funzione.
  for (const m of SEGNALI_MODI) {
    const attesa = lunghezzaPartita(m);
    assert.equal(attesa, Math.min(10, poolSegnali(m).length), `${m}: lunghezza non derivata dal pool`);
    assert.ok(attesa >= 8, `${m}: pool troppo magro per una partita`);
    for (const seme of [1, 7, 42, 1234, 99999]) {
      assert.equal(domandeSegnali(m, attesa, seme).length, attesa,
        `${m}: la partita non ha le domande promesse (seme ${seme})`);
      // e chiedendone 10 non ne escono comunque piu di quelle che ci sono
      assert.equal(domandeSegnali(m, 10, seme).length, attesa,
        `${m}: chiedendone 10 la partita non coincide con la lunghezza dichiarata`);
    }
  }
});

test('segnali: stessa partita con lo stesso seme, diversa con un altro', () => {
  const a = domandeSegnali('notturni', 10, 7);
  const b = domandeSegnali('notturni', 10, 7);
  assert.deepEqual(a.map((d) => [d.id, ...d.opzioni]), b.map((d) => [d.id, ...d.opzioni]),
    'stesso seme, stessa partita');
  const c = domandeSegnali('notturni', 10, 8);
  assert.notEqual(a.map((d) => d.id).join(), c.map((d) => d.id).join(),
    'seme diverso, partita diversa');
});

test('segnali: il caso del fanale bianco solitario non fa mai domanda ambigua', () => {
  // "alla fonda" e "vista di poppa" hanno la stessa resa (un bianco) e la
  // stessa firma: non devono mai comparire nella stessa domanda.
  const fonda = SEGNALI.find((e) => e.id === 'n-fonda');
  const poppa = SEGNALI.find((e) => e.id === 'n-motore-poppa');
  assert.equal(fonda.firma, poppa.firma, 'le due voci dichiarano la stessa firma');
  // Da distrattori di un terzo segnale possono convivere: sono entrambe
  // sbagliate e la domanda resta a risposta unica. Quello che non deve
  // succedere mai e' che quando una delle due E' l'immagine mostrata, l'altra
  // stia fra le opzioni: li' sarebbero due risposte giuste.
  for (let seme = 1; seme <= 50; seme++) {
    for (const d of domandeSegnali('notturni', 30, seme)) {
      if (d.id !== 'n-fonda' && d.id !== 'n-motore-poppa') continue;
      const altra = d.id === 'n-fonda' ? poppa.o : fonda.o;
      assert.ok(!d.opzioni.includes(altra), `seme ${seme}: ${d.id} con l'altra voce in campo`);
    }
  }
});

/* --- 0.11.0: i due allenamenti del carteggio ------------------------------- */

// Una banchina finta con la forma vera: alcuni esercizi coprono piu' tecniche.
function bancaCarteggio() {
  return [
    { id: 'c-1', tecniche: ['PN', 'Deriva'] },
    { id: 'c-2', tecniche: ['PN'] },
    { id: 'c-3', tecniche: ['Scarroccio'] },
    { id: 'c-4', tecniche: ['Rilev', 'Interc'] },
    { id: 'c-5', tecniche: ['Interc'] },
    { id: 'c-6', tecniche: ['PN', 'Deriva'] },
    { id: 'c-7', tecniche: ['Carburante'] },
  ];
}

test('giroTecniche: una sessione copre TUTTE le tecniche, senza ripetere esercizi', () => {
  const banca = bancaCarteggio();
  const giro = giroTecniche(banca, {});
  const tutte = new Set(banca.flatMap((e) => e.tecniche));
  const coperte = new Set(giro.flatMap((x) => x.tecniche));
  assert.deepEqual([...coperte].sort(), [...tutte].sort(), 'nessuna tecnica resta fuori');
  assert.equal(new Set(giro.map((x) => x.e.id)).size, giro.length, 'nessun esercizio due volte');
  // il greedy sfrutta i multi-tecnica: 6 tecniche in 4 esercizi, non 6
  assert.equal(giro.length, 4, 'c-1 (PN+Deriva), c-4 (Rilev+Interc), c-3, c-7');
  assert.ok(giro.every((x) => x.tecniche.length > 0, 'ogni esercizio dice che cosa porta'));
});

test('giroTecniche: le tecniche dichiarate sono quelle che l esercizio porta LUI', () => {
  const giro = giroTecniche(bancaCarteggio(), {});
  const viste = new Set();
  for (const { tecniche } of giro) {
    for (const t of tecniche) {
      assert.ok(!viste.has(t), `la tecnica ${t} risulta portata da due esercizi`);
      viste.add(t);
    }
  }
});

test('giroTecniche: a parita di copertura preferisce i mai fatti', () => {
  const banca = bancaCarteggio();
  // c-1 gia' fatto: al suo posto deve entrare c-6, che copre le stesse due
  const prog = { 'c-1': { n: 1, c: 1, first: 1, s: 1, lw: null, k: 0, t: '2026-08-26' } };
  const giro = giroTecniche(banca, prog);
  assert.ok(giro.some((x) => x.e.id === 'c-6'), 'entra il gemello mai fatto');
  assert.ok(!giro.some((x) => x.e.id === 'c-1'), 'il gia fatto resta fuori');
  // e con tutta la banca gia' fatta il giro esiste comunque: e' ripetibile
  const tuttiFatti = Object.fromEntries(banca.map((e) => [e.id, { n: 1, c: 1, first: 1, s: 1, lw: null, k: 0, t: '2026-08-26' }]));
  const ripetuto = giroTecniche(banca, tuttiFatti);
  assert.equal(new Set(ripetuto.flatMap((x) => x.tecniche)).size, 6, 'copre tutto anche da rifatto');
});

test('giroTecniche: deterministico — stessa banca e stesso storico, stesso giro', () => {
  const a = giroTecniche(bancaCarteggio(), {}).map((x) => x.e.id);
  const b = giroTecniche(bancaCarteggio(), {}).map((x) => x.e.id);
  assert.deepEqual(a, b, 'se non e riproducibile non e verificabile');
});

test('tappeto: i prossimi n mai fatti, nell ordine del foglio', () => {
  const banca = bancaCarteggio();
  const primi = tappeto(banca, {}, 3);
  assert.deepEqual(primi.map((e) => e.id), ['c-1', 'c-2', 'c-3'], 'l ordine e quello del foglio');
});

test('tappeto: si riprende da dove si era rimasti, e a foglio finito lo dice', () => {
  const banca = bancaCarteggio();
  const prog = {};
  for (const e of tappeto(banca, prog, 3)) applica(prog, e.id, true, 60000, '2026-08-27');
  const dopo = tappeto(banca, prog, 3);
  assert.deepEqual(dopo.map((e) => e.id), ['c-4', 'c-5', 'c-6'], 'riparte dal primo mai fatto');
  // anche un esercizio PERSO conta come fatto: e' stato provato, il tappeto avanza
  applica(prog, 'c-4', false, 60000, '2026-08-27');
  assert.ok(!tappeto(banca, prog, 7).some((e) => e.id === 'c-4'), 'il perso non torna nel tappeto');
  for (const e of banca) if (!prog[e.id]) applica(prog, e.id, true, 60000, '2026-08-27');
  assert.deepEqual(tappeto(banca, prog, 4), [], 'foglio finito: lista vuota, e la schermata lo dice');
});


/* --- 0.19.0: sito statico — l'archivio nel browser ------------------------ */

test('la versione e una sola: VERSION, la cache del service worker e meta.json', async () => {
  // Nel progetto originario il nome della cache lo scriveva il server
  // sostituendo un segnaposto in sw.js. Qui non c'e' un server e non c'e' un
  // build step: il file committato e' quello pubblicato, e l'unica difesa
  // contro una cache dimenticata — che congelerebbe l'app sulla prima versione
  // vista da ogni dispositivo — e' questo test.
  const fs = await import('node:fs/promises');
  const radice = new URL('../', import.meta.url);
  const versione = (await fs.readFile(new URL('VERSION', radice), 'utf8')).trim();
  assert.match(versione, /^\d+\.\d+\.\d+$/, 'VERSION non e un numero di versione');
  const sw = await fs.readFile(new URL('site/sw.js', radice), 'utf8');
  const m = sw.match(/const CACHE = '([^']+)'/);
  assert.ok(m, 'CACHE non trovata in sw.js');
  assert.equal(m[1], 'rg-' + versione, 'il nome della cache non segue VERSION');
  assert.ok(!sw.includes('__VERSIONE__'), 'in sw.js e rimasto il segnaposto del server');
  const meta = JSON.parse(await fs.readFile(new URL('site/dati/meta.json', radice), 'utf8'));
  assert.equal(meta.versione, versione, 'meta.json dichiara un altra versione');
  const changelog = await fs.readFile(new URL('CHANGELOG.md', radice), 'utf8');
  assert.ok(changelog.includes(`## [${versione}]`), 'il CHANGELOG non ha la voce di VERSION');
});

test('epoca e ordinaRighe: due formati di ts, un ordine solo', () => {
  assert.equal(epoca('2026-08-25T10:00:00.000+02:00'), epoca('2026-08-25T08:00:00.000Z'));
  assert.equal(epoca('boh'), null);
  const righe = [
    { uid: 'b', ts: '2026-08-25T10:00:00.000+02:00' },
    { uid: 'a', ts: '2026-08-25T07:59:00.000Z' },          // e' prima, anche se la stringa e' "dopo"
    { uid: 'x', ts: 'boh' },                                // senza data: in testa, non persa
    { uid: 'c', ts: '2026-08-25T10:00:00.000+02:00' },      // stesso istante di b: resta dopo b
  ];
  assert.deepEqual(ordinaRighe(righe).map((r) => r.uid), ['x', 'a', 'b', 'c']);
});

test('ripiega: dalle righe lo stesso specchio che applica() costruisce una alla volta', () => {
  const righe = [
    { _t: 'q', uid: '1', item_id: 'base-1', ts: '2026-08-08T10:00:00+02:00', correct: 0, ms: 9000 },
    { _t: 'q', uid: '2', item_id: 'base-1', ts: '2026-08-09T10:00:00+02:00', correct: 1, ms: 5000 },
    { _t: 'q', uid: '3', item_id: 'base-2', ts: '2026-08-08T10:01:00+02:00', correct: 1, ms: 4000 },
    { _t: 't', uid: '4', item_id: '5.1.1-1', ts: '2026-08-08T11:00:00+02:00', correct: 1, ms: 30000 },
    { _t: 'c', uid: '5', item_id: '5.1.3-1', ts: '2026-08-08T12:00:00+02:00', verdict: 0, ms: 900000 },
    { _t: 's', uid: '6', kind: 'base', ts: '2026-08-08T12:30:00+02:00', score: 1, total: 2 },
    { _t: 'g', uid: '7', attempt_uid: '1', tag: 'N' },
  ];
  const s = ripiega(righe);
  const a = s.quiz['base-1'];
  assert.equal(a.n, 2); assert.equal(a.first, 0); assert.equal(a.lw, '2026-08-08');
  assert.equal(a.k, 1); assert.equal(a.s, 1); assert.equal(a.avg, 7000); assert.equal(a.t, '2026-08-09');
  assert.equal(s.quiz['base-2'].lw, null);
  assert.ok(s.tecnica['5.1.1-1'] && !s.quiz['5.1.1-1'], 'le tre banche non si mescolano');
  assert.equal(s.carteggio['5.1.3-1'].lw, '2026-08-08', 'il carteggio legge verdict, non correct');
  assert.equal(Object.keys(s.quiz).length, 2, 'prove e tag non sono quesiti');

  // La stessa cosa costruita una risposta alla volta, nell'ordine in cui e'
  // successa: deve dare lo stesso specchio. E' cio' che rende innocuo un
  // «ricarica i tuoi progressi»: non esiste una seconda contabilita'.
  const inc = {};
  applica(inc, 'base-1', false, 9000, '2026-08-08');
  applica(inc, 'base-2', true, 4000, '2026-08-08');
  applica(inc, 'base-1', true, 5000, '2026-08-09');
  assert.deepEqual(s.quiz, inc);
  // e l'ordine di arrivo delle righe non conta: ripiega le riordina
  assert.deepEqual(ripiega([...righe].reverse()).quiz, inc);
});

test('sessioni: le quattro regole ritagliano le risposte, e nessuna va persa', () => {
  const att = (uid, item, ts, o = {}) => ({ _t: 'q', uid, kind: 'base', item_id: item, ts,
    correct: 1, ms: 10000, mode: 'batteria', chosen: '0', sim_uid: null, ...o });
  const righe = [
    // A: batteria, tre risposte di fila
    att('a1', 'base-1', '2026-08-20T09:00:00+02:00'),
    att('a2', 'base-2', '2026-08-20T09:00:20+02:00', { correct: 0 }),
    att('a3', 'base-3', '2026-08-20T09:00:40+02:00'),
    // B: cambia modalita', stesso minuto
    att('b1', 'base-4', '2026-08-20T09:01:00+02:00', { mode: 'screening' }),
    att('b2', 'base-5', '2026-08-20T09:01:20+02:00', { mode: 'screening' }),
    // C: stessa modalita', ma un quesito ricompare -> lista nuova
    att('c1', 'base-4', '2026-08-20T09:01:40+02:00', { mode: 'screening' }),
    // D: stessa modalita', nessun doppione, ma mezz'ora dopo
    att('d1', 'base-6', '2026-08-20T09:35:00+02:00', { mode: 'screening' }),
    // E: legame registrato, quindi confine scritto e non dedotto
    att('e1', 'base-7', '2026-08-20T09:35:20+02:00', { mode: 'screening', sim_uid: 'ses-1' }),
  ];
  const ss = sessioni(righe);
  assert.equal(ss.length, 5, JSON.stringify(ss.map((x) => [x.mode, x.n, x.fonte])));
  assert.equal(ss.reduce((a, x) => a + x.n, 0), 8, 'nessuna risposta va persa nel ritaglio');
  assert.ok(epoca(ss[0].fine) > epoca(ss[ss.length - 1].fine), 'la piu recente per prima');
  assert.deepEqual(ss.map((x) => x.n).sort(), [1, 1, 1, 2, 3]);
  const reg = ss.filter((x) => x.fonte === 'sim_uid');
  assert.equal(reg.length, 1); assert.equal(reg[0].id, 'ses-1');
  const batt = ss.find((x) => x.mode === 'batteria');
  assert.equal(batt.n, 3); assert.equal(batt.esatte, 2);
  assert.equal(batt.durata, 40000, 'durata da capo a coda, non somma dei tempi');
  assert.equal(batt.ms, 30000);
  assert.deepEqual(batt.righe.map((r) => r.uid), ['a1', 'a2', 'a3'], 'la sessione porta le sue righe');
  assert.ok(ss.every((x) => x.prova === null), 'un allenamento non ha una riga di prova');
  assert.ok(batt.id.startsWith('r:'), 'una sessione dedotta ha un id derivato dalla prima riga');
});

test('sessioni: la prova d esame porta la sua riga di prova, e la pausa e un parametro', () => {
  const t0 = Date.parse('2026-08-21T10:30:00+02:00');
  const iso = (ms) => new Date(t0 + ms).toISOString();
  const righe = [0, 1, 2].map((i) => ({ _t: 'q', uid: 'v' + i, kind: 'vela', item_id: 'vela-' + i,
    ts: iso(i * 60000), correct: 1, ms: 3000, mode: 'simulazione', sim_uid: 'prova-v' }));
  righe.push({ _t: 's', uid: 'prova-v', kind: 'vela', ts: iso(4 * 60000), score: 3, total: 3, passed: 1, ms: 900000 });
  // una risposta dello stesso sim_uid ma oltre la pausa: e' comunque la stessa
  // sessione? No: la pausa chiude anche col legame — riaprire dopo mezz'ora e'
  // un'altra sessione, e il legame serve a riaprirla, non a incollarla.
  righe.push({ _t: 'q', uid: 'v9', kind: 'vela', item_id: 'vela-9', ts: iso(PAUSA_SESSIONE_MS + 5 * 60000),
    correct: 0, ms: 3000, mode: 'simulazione', sim_uid: 'prova-v' });
  const ss = sessioni(righe);
  assert.equal(ss.length, 2);
  const sim = ss.find((x) => x.n === 3);
  assert.equal(sim.id, 'prova-v'); assert.equal(sim.fonte, 'sim_uid');
  assert.equal(sim.prova && sim.prova.passed, 1, 'la riga di prova e agganciata');
  assert.equal(sessioni(righe, { limite: 1 }).length, 1);
  assert.deepEqual(sessioni([]), []);
});

test('fondiArchivio: per uid, senza doppioni, e dice quante ne ha scartate', () => {
  const presenti = [{ _t: 'q', uid: '1', ts: '2026-08-08T10:00:00Z', item_id: 'base-1', correct: 1 }];
  const importate = [
    { _t: 'q', uid: '1', ts: '2026-08-08T10:00:00Z', item_id: 'base-1', correct: 0 },   // gia' presente: non sovrascrive
    { _t: 'q', uid: '2', ts: '2026-08-08T10:01:00Z', item_id: 'base-2', correct: 1 },   // nuova
    { _t: 'q', ts: '2026-08-08T10:02:00Z', item_id: 'base-3' },                          // senza uid: scartata
    { uid: '4', ts: '2026-08-08T10:03:00Z' },                                             // senza tipo: scartata
    null,
  ];
  const r = fondiArchivio(presenti, importate);
  assert.equal(r.nuove, 1); assert.equal(r.gia, 1); assert.equal(r.scartate, 3);
  assert.equal(r.righe.length, 2);
  assert.equal(r.righe.find((x) => x.uid === '1').correct, 1, 'la riga presente vince');
});

test('traccia: senza una scadenza niente quota e semaforo in attesa, invece di NaN', () => {
  const items = banca(10);
  const prog = { 'base-1': { n: 1, c: 1, first: 1, s: 1, lw: null, k: 0, t: '2026-08-08' } };
  const t = traccia(items, prog, '2026-08-08', 'base', null, null);
  assert.equal(t.quota, null); assert.equal(t.giorni, null); assert.equal(t.semaforo, 'attesa');
  assert.equal(t.rimanenti, 9); assert.equal(t.coperti, 1);
  // con la scadenza tutto come prima
  const c = traccia(items, prog, '2026-08-08', 'base', '2026-08-10', '2026-08-01');
  assert.equal(c.giorni, 3); assert.equal(c.quota, 3);
  assert.ok(['verde', 'giallo', 'rosso'].includes(c.semaforo));
});

// --- daAllenare: il numero promesso e la lista che si apre ----------------------
//
// Sette test per una funzione di sei righe, e la ragione e' che questa e' la
// funzione dove il difetto di casa e' tornato **tre volte**: 0.13.3 su «Allena
// questa voce», 0.16.0 sul pulsante di *Oggi* e sulla modalita' Per argomento.
// Tutte e tre le volte il sintomo era lo stesso — un numero in schermata e una
// lista che non venivano dalla stessa fonte — e tutte e tre le volte non c'era
// un test, perche' la funzione viveva nella pagina.

// Dodici quesiti in due temi e due voci, cinque dei quali con figura, piu' un
// item vela per verificare che il filtro `kind` valga davvero.
function bancaAllenare() {
  const conFigura = new Set([3, 4, 9, 10, 12]);
  const out = Array.from({ length: 12 }, (_, j) => {
    const i = j + 1;
    return {
      id: `base-${i}`, k: 'base',
      t: i <= 6 ? 'TEMA A' : 'TEMA B',
      v: (i - 1) % 6 < 3 ? 'voce 1' : 'voce 2',
      d: `domanda ${i}`, r: ['a', 'b', 'c'], x: 0,
      ...(conFigura.has(i) ? { f: 'figura-001.png' } : {}),
    };
  });
  out.push({ id: 'vela-1', k: 'vela', t: 'VELA', v: 'voce 1', d: 'v', r: ['a', 'b', 'c'], x: 0 });
  return out;
}

// aperte 2, 9 · riprese 3, 10 · coperte 1, 4, 7, 11 · mai visti 5, 6, 8, 12
function progAllenare() {
  const p = {};
  for (const i of [2, 9]) applica(p, `base-${i}`, false, 9000, '2026-08-01');
  for (const i of [3, 10]) {
    applica(p, `base-${i}`, false, 9000, '2026-08-01');
    applica(p, `base-${i}`, true, 9000, '2026-08-02');
  }
  for (const i of [1, 4, 7, 11]) applica(p, `base-${i}`, true, 9000, '2026-08-03');
  return p;
}

const ids = (l) => l.map((x) => x.id);

test('daAllenare: quattro gruppi in ordine — aperte, mai visti, riprese, il resto', () => {
  const r = daAllenare(bancaAllenare(), progAllenare(), OGGI, 'base');
  assert.deepEqual(ids(r.lista), [
    'base-2', 'base-9',                                  // errore ancora aperto
    'base-5', 'base-6', 'base-8', 'base-12',             // mai visti
    'base-3', 'base-10',                                 // sbagliate e gia' riprese
    'base-1', 'base-4', 'base-7', 'base-11',             // il resto: ripasso
  ]);
});

test('daAllenare: daFare sono le aperte piu i mai visti, non tutta la lista', () => {
  const items = bancaAllenare(), prog = progAllenare();
  const r = daAllenare(items, prog, OGGI, 'base');
  assert.equal(r.daFare, 6, '2 aperte + 4 mai visti');
  assert.equal(r.lista.length, 12, 'in lista c e tutta la banca: una batteria non resta a corto');
  // E' la stessa definizione di `rimanenti` in traccia(): se le due divergono,
  // il pulsante torna a promettere un numero e ad aprirne un altro.
  const t = traccia(items, prog, OGGI, 'base', '2026-09-03', '2026-08-01');
  assert.equal(r.daFare, t.rimanenti);
});

test('daAllenare: una sbagliata ripresa resta in lista, ma dietro ai mai visti', () => {
  const r = daAllenare(bancaAllenare(), progAllenare(), OGGI, 'base');
  const pos = (id) => ids(r.lista).indexOf(id);
  assert.ok(pos('base-3') > -1, 'ripresa: sbagliarla una volta non scade (regola della 0.5.1)');
  assert.ok(pos('base-2') < pos('base-5'), 'aperta prima di un mai visto');
  assert.ok(pos('base-5') < pos('base-3'), 'mai visto prima di una ripresa');
  assert.ok(pos('base-3') < pos('base-1'), 'ripresa prima di chi non ha mai sbagliato');
  assert.equal(classifica(progAllenare()['base-3']), 'coperto');
  assert.equal(classifica(progAllenare()['base-2']), 'da_ripassare');
});

test('daAllenare: i filtri valgono per tutti e quattro i gruppi', () => {
  const items = bancaAllenare(), prog = progAllenare();
  const a = daAllenare(items, prog, OGGI, 'base', { temi: ['TEMA A'] });
  assert.deepEqual(ids(a.lista), ['base-2', 'base-5', 'base-6', 'base-3', 'base-1', 'base-4']);
  assert.equal(a.daFare, 3);

  const v = daAllenare(items, prog, OGGI, 'base', { voce: 'voce 1' });
  assert.deepEqual(ids(v.lista), ['base-2', 'base-9', 'base-8', 'base-3', 'base-1', 'base-7']);
  assert.equal(v.daFare, 3);

  // soloFigura: il filtro che l'anteprima usa per dire quanti ne passano. Se
  // valesse su un gruppo solo, il conteggio e la lista tornerebbero a divergere.
  const f = daAllenare(items, prog, OGGI, 'base', { soloFigura: true });
  assert.deepEqual(ids(f.lista), ['base-9', 'base-12', 'base-3', 'base-10', 'base-4']);
  assert.equal(f.daFare, 2);
  assert.ok(f.lista.every((x) => x.f), 'nessuno senza figura');

  // kind: l'item vela non deve comparire fra i base, ne' viceversa.
  assert.ok(!ids(daAllenare(items, prog, OGGI, 'base').lista).includes('vela-1'));
  const vela = daAllenare(items, prog, OGGI, 'vela');
  assert.deepEqual(ids(vela.lista), ['vela-1']);
  assert.equal(vela.daFare, 1);
});

test('daAllenare: a banca interamente coperta apre comunque qualcosa, e lo dice', () => {
  // E' il difetto della 0.16.0, riprodotto: il 2 settembre i mai visti sono
  // arrivati a zero e il pulsante di *Oggi*, che apriva una coda di soli
  // `nuovo`, prometteva 76 quesiti e ne apriva zero.
  const items = bancaAllenare(), prog = {};
  for (const it of items) applica(prog, it.id, true, 9000, '2026-08-03');
  const r = daAllenare(items, prog, OGGI, 'base');
  assert.equal(r.daFare, 0, 'niente di arretrato, ed e vero');
  assert.equal(r.lista.length, 12, 'ma la lista non e vuota: e tutto ripasso');

  // E il caso rovesciato: banca coperta e due errori ancora aperti.
  applica(prog, 'base-4', false, 9000, '2026-08-05');
  applica(prog, 'base-8', false, 9000, '2026-08-06');
  const r2 = daAllenare(items, prog, OGGI, 'base');
  assert.equal(r2.daFare, 2);
  assert.deepEqual(ids(r2.lista).slice(0, 2), ['base-4', 'base-8']);
});

test('daAllenare: nessun elemento compare due volte, in nessun filtro', () => {
  const items = bancaAllenare(), prog = progAllenare();
  for (const extra of [{}, { temi: ['TEMA A'] }, { voce: 'voce 1' }, { soloFigura: true },
                       { temi: ['TEMA A', 'TEMA B'] }]) {
    const l = ids(daAllenare(items, prog, OGGI, 'base', extra).lista);
    assert.equal(new Set(l).size, l.length, `doppioni con ${JSON.stringify(extra)}`);
  }
});

test('daAllenare: il motore fa esattamente quello che oggi fa la pagina', (t) => {
  // La copia in `app.html` esiste dalla 0.16.0. Finche' c'e', questo test la
  // esegue davvero — estratta dal file, non trascritta — e pretende che dia la
  // stessa lista. Quando l'interfaccia passera' a `E.daAllenare()` la copia
  // sparira' e il test si mettera' da parte da solo: e' un controllo che si
  // ritira quando ha finito il suo lavoro, non una regola da ricordare.
  const src = readFileSync(new URL('../site/app.html', import.meta.url), 'utf8');
  const m = src.match(/^function daAllenare\(kind, extra = \{\}\) \{[\s\S]*?^\}/m);
  if (!m) return t.skip('app.html non ha piu una sua daAllenare(): ora chiama il motore');

  const items = bancaAllenare(), prog = progAllenare();
  const S = { banca: items, prog, date: { oggi: OGGI } };
  const pagina = new Function('E', 'S', 'today', `${m[0]}\nreturn daAllenare;`)(E, S, () => OGGI);
  for (const extra of [{}, { temi: ['TEMA A'] }, { voce: 'voce 1' }, { soloFigura: true }]) {
    const a = pagina('base', extra), b = daAllenare(items, prog, OGGI, 'base', extra);
    assert.deepEqual(ids(a.lista), ids(b.lista), `lista diversa con ${JSON.stringify(extra)}`);
    assert.equal(a.daFare, b.daFare, `daFare diverso con ${JSON.stringify(extra)}`);
  }
});
