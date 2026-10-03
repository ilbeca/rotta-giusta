// Test del motore di selezione: node --test tests/
//
// Verificano i criteri di accettazione della spec, non l'implementazione.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addGiorni, giorniTra, stato, sbagliato, classifica, coda, diagnosi,
  traccia, semaforo, applica, rimescola, semeGiorno,
  estrai, estraiNuoviPrima, simulazione, simulazioneVela, screening, lunghezzaScreening, esito,
  fondi, isoLocale, stimaImpegno, mirata, oscurato, RIPIEGO_MS,
  serieGruppi, tendenza, TENDENZA_MIN_GIORNI, TENDENZA_MIN_RISPOSTE,
  SEGNALI, SEGNALI_MODI, poolSegnali, domandeSegnali, lunghezzaPartita,
  giroTecniche, tappeto, daAllenare, quadro, dovePesa, FRASE_MIN_VISTI, PRIMA_MIN_VISTI,
  epoca, ordinaRighe, ripiega, sessioni, fondiArchivio, PAUSA_SESSIONE_MS,
  ritmo, erroriSessione,
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

/** La banca davvero pubblicata: e' l'unica in cui il minimo per voce morde. */
function bancaPubblicata() {
  return JSON.parse(readFileSync(new URL('../site/dati/quiz.json', import.meta.url), 'utf8'));
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

test('col liscio, una voce vista una volta sola non pesa piu di una misurata', () => {
  // Il liscio (errori+1)/(visti+3) regge il `costo` della diagnosi. Fino alla
  // 0.28.0 lo tenevano fermo anche le due classifiche uscite con Q-DUE: i punti
  // deboli di `peggiori()` (P-41) e «Cosa studiare adesso» di `consigli()` (P-47).
  const items = [
    ...banca(1, 'T', 'minuscola'),
    ...banca(40, 'T', 'grossa').map((q, i) => ({ ...q, id: `base-g${i}` })),
  ];
  const progress = {};
  applica(progress, 'base-1', false, 0, OGGI);              // 1 su 1 sbagliato: 100%
  for (let i = 0; i < 20; i++) applica(progress, `base-g${i}`, i < 8, 0, OGGI); // 12 su 20: 60%

  const d = diagnosi(items, progress, OGGI);
  const min = d.voci.find((v) => v.nome === 'minuscola');
  const gro = d.voci.find((v) => v.nome === 'grossa');
  assert.ok(gro.debolezza > min.debolezza, 'col liscio, 12/20 pesa piu di 1/1');
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

// --- la mappa di Progressi (Q-DUE, 29 settembre 2026) --------------------------
//
// Progressi smette di essere due classifiche e diventa una mappa per tema: una
// barra a tre stati per riga, «X su Y giusti al primo tentativo», il pulsante
// «Rifai N errori» con N uguale al segmento «da rifare», e in cima al massimo
// una frase. I numeri li da' il motore, e la pagina non li rifa'.

/** Uno storico sintetico ma riproducibile su qualunque banca: circa un terzo
 *  mai visto, gli altri risposti una o due volte, esatti o no. */
function storicoMisto(items, seme = 7) {
  let s = seme >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const progress = {};
  for (const it of items) {
    const r = rnd();
    if (r < 0.34) continue;
    applica(progress, it.id, rnd() < 0.7, 9000, '2026-08-01');
    if (r > 0.75) applica(progress, it.id, rnd() < 0.6, 9000, '2026-08-05');
  }
  return progress;
}

test('soloDaRifare: apre solo gli errori la cui ultima risposta e sbagliata', () => {
  const items = banca(4, 'T', 'v');
  const progress = {};
  applica(progress, 'base-1', false, 0, '2026-08-01');   // sbagliata, ancora da rifare
  applica(progress, 'base-2', false, 0, '2026-08-01');   // sbagliata...
  applica(progress, 'base-2', true, 0, '2026-08-02');    // ...e ripresa
  applica(progress, 'base-3', true, 0, '2026-08-01');    // mai sbagliata
  const ids = (o) => coda(items, progress, OGGI, { n: 0, ...o }).map((x) => x.id).sort();

  assert.deepEqual(ids({ soloSbagliate: true }), ['base-1', 'base-2'],
    '«Ripasso degli errori» apre tutti gli errori di sempre, e resta com e');
  assert.deepEqual(ids({ soloDaRifare: true }), ['base-1'],
    '«Rifai N errori» apre solo quelli la cui ultima risposta e sbagliata');

  applica(progress, 'base-2', false, 0, OGGI);           // risbagliata: torna da rifare
  applica(progress, 'base-1', true, 0, OGGI);            // ripresa: esce
  assert.deepEqual(ids({ soloDaRifare: true }), ['base-2']);
});

test('soloDaRifare: il numero del quadro e la lista che si apre coincidono, riga per riga', () => {
  // Per contratto, non per ordinamento: con un tetto piu alto di N la lista deve
  // restare N. Con `soloSbagliate` e un tetto a N si otterrebbero gli stessi N
  // solo perche le riprese stanno in fondo — e il primo tetto sbagliato li
  // mescolerebbe.
  const items = bancaPubblicata();
  for (const [kind, pesi] of [['base', PESI], ['vela', null]]) {
    const progress = storicoMisto(items.filter((x) => x.k === kind));
    const q = quadro(items, progress, OGGI, kind, pesi);
    const righe = q.righe.flatMap((r) => [r, ...(r.voci || [])]);
    assert.ok(righe.length >= 3, `${kind}: la banca vera ha almeno tre righe`);
    for (const r of righe) {
      const attese = items.filter((it) => it.k === kind && (!r.filtro.tema || it.t === r.filtro.tema)
        && (!r.filtro.voce || it.v === r.filtro.voce) && classifica(progress[it.id]) === 'da_ripassare');
      // La selezione del pulsante e' pronta, senza tetto: il tetto predefinito
      // di `coda()` e' 20, e «Rifai 35 errori» ne aprirebbe 20 in silenzio.
      assert.deepEqual(r.rifai, { ...r.filtro, soloDaRifare: true, n: 0 });
      const lista = coda(items, progress, OGGI, r.rifai);
      assert.equal(lista.length, r.daRifare, `${kind} · ${r.nome}: il pulsante promette ${r.daRifare}`);
      assert.equal(coda(items, progress, OGGI, { ...r.rifai, n: 5000 }).length, r.daRifare,
        `${kind} · ${r.nome}: e con un tetto piu alto resta ${r.daRifare}`);
      assert.deepEqual(lista.map((x) => x.id).sort(), attese.map((x) => x.id).sort(),
        `${kind} · ${r.nome}: e apre esattamente quelli`);
    }
  }
});

test('quadro: tre stati disgiunti che sommano al totale, per tema, per voce e in tutto', () => {
  const items = bancaPubblicata();
  for (const [kind, pesi] of [['base', PESI], ['vela', null]]) {
    const mie = items.filter((x) => x.k === kind);
    const progress = storicoMisto(mie, 11);
    const q = quadro(items, progress, OGGI, kind, pesi);
    const conta = (lista) => {
      const c = { n: lista.length, giusti: 0, daRifare: 0, maiVisti: 0 };
      for (const it of lista) {
        const s = classifica(progress[it.id]);
        if (s === 'coperto') c.giusti++; else if (s === 'da_ripassare') c.daRifare++; else c.maiVisti++;
      }
      return c;
    };
    const verifica = (r, lista, dove) => {
      const c = conta(lista);
      assert.equal(r.n, c.n, `${dove}: totale`);
      assert.equal(r.giusti, c.giusti, `${dove}: giusti sono l ultima risposta esatta`);
      assert.equal(r.daRifare, c.daRifare, `${dove}: da rifare sono l ultima risposta sbagliata`);
      assert.equal(r.maiVisti, c.maiVisti, `${dove}: mai visti`);
      assert.equal(r.giusti + r.daRifare + r.maiVisti, r.n, `${dove}: i tre stati sommano al totale`);
      assert.equal(r.visti, r.giusti + r.daRifare, `${dove}: visti sono giusti piu da rifare`);
    };
    for (const r of q.righe) {
      const inRiga = mie.filter((it) => it.t === (r.filtro.tema ?? it.t) && it.v === (r.filtro.voce ?? it.v));
      verifica(r, inRiga, `${kind} · ${r.nome}`);
      for (const v of r.voci || [])
        verifica(v, inRiga.filter((it) => it.v === v.nome), `${kind} · ${r.nome} › ${v.nome}`);
    }
    verifica(q.totale, mie, `${kind} · totale`);
  }
});

test('quadro: X su Y giusti al primo tentativo, esatti, e sotto soglia nessun numero', () => {
  const items = [
    ...banca(10, 'MOTORI', 'quattro'),
    ...banca(10, 'MOTORI', 'cinque').map((q, i) => ({ ...q, id: `base-c${i}` })),
  ];
  const progress = {};
  for (let i = 1; i <= 4; i++) applica(progress, `base-${i}`, true, 0, OGGI);
  // cinque viste: due sbagliate al primo colpo e poi riprese. Il ripasso sposta
  // la barra, non il «primo tentativo».
  for (let i = 0; i < 5; i++) applica(progress, `base-c${i}`, i >= 2, 0, '2026-08-01');
  for (let i = 0; i < 2; i++) applica(progress, `base-c${i}`, true, 0, OGGI);

  const q = quadro(items, progress, OGGI, 'base', PESI);
  const [mot] = q.righe;
  const quattro = mot.voci.find((v) => v.nome === 'quattro');
  const cinque = mot.voci.find((v) => v.nome === 'cinque');
  assert.equal(PRIMA_MIN_VISTI, 5);
  assert.equal(quattro.visti, 4);
  assert.equal(quattro.primo, null, 'quattro viste: troppo poche risposte per dire come va');
  assert.deepEqual(cinque.primo, { esatte: 3, su: 5 }, 'tre su cinque, contate alla prima risposta');
  assert.equal(cinque.giusti, 5, 'ma la barra, dopo il ripasso, le da tutte giuste');
  assert.equal(cinque.primo.su, cinque.visti, 'lo stesso Y di «Visti Y su N»');
  assert.deepEqual(mot.primo, { esatte: 7, su: 9 }, 'il tema somma le sue voci');
  assert.deepEqual(q.totale.primo, { esatte: 7, su: 9 }, 'e il totale somma i temi');
  assert.ok(!('acc1' in cinque) && !('esatte1' in cinque),
    'nessuna frazione e nessun conteggio da scrivere sotto soglia: solo `primo`');
});

test('quadro: i temi in ordine fisso di peso d esame, le voci in ordine di banca', () => {
  const items = bancaPubblicata();
  const vuoto = quadro(items, {}, OGGI, 'base', PESI);
  const pieno = quadro(items, storicoMisto(items.filter((x) => x.k === 'base'), 3), OGGI, 'base', PESI);
  const nomi = (q) => q.righe.map((r) => r.nome);
  assert.deepEqual(nomi(pieno), nomi(vuoto), 'l ordine non dipende da quello che hai fatto');
  assert.deepEqual(nomi(vuoto), diagnosi(items, {}, OGGI, 'base', PESI).temi.map((t) => t.nome),
    'e l ordine di diagnosi().temi');
  assert.deepEqual(vuoto.righe.map((r) => r.peso), [4, 4, 3, 3, 2, 2, 1, 1]);
  for (const r of pieno.righe) {
    const banca = [...new Set(items.filter((it) => it.k === 'base' && it.t === r.nome).map((it) => it.v))];
    assert.deepEqual(r.voci.map((v) => v.nome), banca, `${r.nome}: le voci nell ordine della banca`);
    for (const v of r.voci) assert.equal(v.peso, null, 'un peso per voce non esiste');
  }
});

test('quadro: la vela per voce, senza un peso inventato', () => {
  const items = bancaPubblicata();
  const q = quadro(items, {}, OGGI, 'vela', { VELA: 5 });
  assert.deepEqual(q.righe.map((r) => r.nome),
    ['TEORIA DELLA VELA', "ATTREZZATURA DELLE UNITA' A VELA", "MANOVRE DELLE UNITA' A VELA"],
    'le tre voci fanno da righe, in ordine di banca');
  assert.deepEqual(q.righe.map((r) => r.n), [99, 86, 65]);
  for (const r of q.righe) {
    assert.equal(r.peso, null, 'anche se il chiamante passa il peso della prova vela');
    assert.equal(r.voci, undefined, 'una riga di vela non ha righe sotto');
    assert.deepEqual(r.filtro, { kind: 'vela', voce: r.nome }, 'e si restringe per voce, mai per tema');
  }
});

// Tre temi di una banca in miniatura, con i pesi veri.
const MAN = 'MANOVRA E CONDOTTA', MOT = 'MOTORI', NAV = 'NAVIGAZIONE CARTOGRAFICA ED ELETTRONICA';
function tre(n = 40) {
  return [MAN, MOT, NAV].flatMap((t, j) => banca(n, t, 'v').map((q, i) => ({ ...q, id: `base-${j}-${i}` })));
}

test('dovePesa: sotto la soglia dichiarata nessuna frase', () => {
  const items = tre();
  const progress = {};
  for (let i = 0; i < FRASE_MIN_VISTI - 1; i++) applica(progress, `base-0-${i}`, true, 0, OGGI);
  assert.equal(FRASE_MIN_VISTI, 20, 'le domande di una prova base');
  const sotto = dovePesa(quadro(items, progress, OGGI, 'base', PESI));
  assert.equal(sotto.indicazione, null);
  assert.equal(sotto.assente, 'sotto soglia');

  applica(progress, `base-0-${FRASE_MIN_VISTI - 1}`, true, 0, OGGI);
  const sopra = dovePesa(quadro(items, progress, OGGI, 'base', PESI));
  assert.ok(sopra.indicazione, 'a venti quesiti visti la frase c e');
  assert.equal(sopra.assente, null);
});

test('dovePesa: vince il tema che pesa di piu in domande d esame, e i pulsanti aprono quello che dicono', () => {
  const items = tre(60);
  const progress = {};
  // Manovra (4 domande): 25 giusti, 5 da rifare, 30 mai visti — 35 su 60 non
  // presi, cioe 2,33 domande d esame. Navigazione (4): 58 giusti, 2 mai visti
  // — 0,13. Motori (1): mai aperto, 60 su 60 non presi ma una domanda sola — 1.
  // I mai visti sono piu di 20, il tetto predefinito di `coda()`.
  for (let i = 0; i < 30; i++) applica(progress, `base-0-${i}`, i >= 5, 0, OGGI);
  for (let i = 0; i < 58; i++) applica(progress, `base-2-${i}`, true, 0, OGGI);
  const q = quadro(items, progress, OGGI, 'base', PESI);
  const { indicazione: f } = dovePesa(q);
  assert.equal(f.tema, MAN, 'il peso batte il numero: Motori ha piu quesiti non presi, ma vale una domanda');
  assert.equal(f.peso, 4);
  assert.deepEqual([f.giusti, f.daRifare, f.maiVisti, f.n], [25, 5, 30, 60]);
  assert.ok(Math.abs(f.inBallo - 4 * 35 / 60) < 1e-9, '4 domande per 35 su 60');
  assert.equal(f.motivo, 'mai visti', 'i mai visti sono piu degli errori da rifare');
  assert.deepEqual(f.pulsanti.map((p) => [p.azione, p.quanti]), [['mai visti', 30], ['rifai', 5]],
    'prima il pulsante di quello che dice, poi l altro');
  for (const p of f.pulsanti) {
    const lista = coda(items, progress, OGGI, p.selezione);
    assert.equal(lista.length, p.quanti, `${p.azione}: il numero sul pulsante e la lista che apre`);
    assert.ok(lista.every((it) => it.t === MAN), `${p.azione}: e sono del tema della frase`);
  }
  assert.ok(!JSON.stringify([q, f]).includes('minut'), 'niente minuti: Q-DUE punto 7');
});

test('dovePesa: conta la quota del tema che non hai preso, non i quesiti', () => {
  // Manovra ha 40 quesiti e 10 non presi: un quarto delle sue 4 domande, 1.
  // Navigazione ne ha 160 e 20 non presi: il doppio dei quesiti, ma un ottavo
  // delle sue 4 domande, 0,5. Conta la quota, perche l esame pesca 4 domande
  // da ciascuno dei due temi, qualunque sia la sua dimensione.
  const items = [
    ...banca(40, MAN, 'v').map((q, i) => ({ ...q, id: `base-m${i}` })),
    ...banca(160, NAV, 'v').map((q, i) => ({ ...q, id: `base-n${i}` })),
  ];
  const progress = {};
  for (let i = 0; i < 30; i++) applica(progress, `base-m${i}`, true, 0, OGGI);
  for (let i = 0; i < 140; i++) applica(progress, `base-n${i}`, true, 0, OGGI);
  const { indicazione: f } = dovePesa(quadro(items, progress, OGGI, 'base', PESI));
  assert.equal(f.tema, MAN);
  assert.ok(Math.abs(f.inBallo - 1) < 1e-9);
});

test('dovePesa: quando gli errori da rifare sono di piu, parla di quelli', () => {
  const items = tre();
  const progress = {};
  for (let i = 0; i < 40; i++) applica(progress, `base-0-${i}`, i >= 12, 0, OGGI);
  for (let i = 0; i < 40; i++) applica(progress, `base-1-${i}`, true, 0, OGGI);
  for (let i = 0; i < 40; i++) applica(progress, `base-2-${i}`, true, 0, OGGI);
  const { indicazione: f } = dovePesa(quadro(items, progress, OGGI, 'base', PESI));
  assert.equal(f.tema, MAN);
  assert.equal(f.motivo, 'da rifare');
  assert.deepEqual(f.pulsanti.map((p) => [p.azione, p.quanti]), [['rifai', 12]],
    'nessun pulsante da zero: i mai visti non ci sono');
  assert.deepEqual(f.pulsanti[0].selezione, { kind: 'base', tema: MAN, soloDaRifare: true, n: 0 });
});

test('dovePesa: a pari merito nessuna frase, perche non c e un indicazione sola', () => {
  const items = tre();
  const progress = {};
  // Manovra e Navigazione valgono 4 e hanno 20 su 40 non presi: 2 domande
  // ciascuna. Motori, 1 domanda, tutta presa.
  for (let i = 0; i < 20; i++) applica(progress, `base-0-${i}`, true, 0, OGGI);
  for (let i = 0; i < 20; i++) applica(progress, `base-2-${i}`, true, 0, OGGI);
  for (let i = 0; i < 40; i++) applica(progress, `base-1-${i}`, true, 0, OGGI);
  const r = dovePesa(quadro(items, progress, OGGI, 'base', PESI));
  assert.equal(r.indicazione, null);
  assert.equal(r.assente, 'pari');
});

test('dovePesa: con niente da fare nessuna frase', () => {
  const items = tre();
  const progress = {};
  for (const it of items) applica(progress, it.id, true, 0, OGGI);
  const r = dovePesa(quadro(items, progress, OGGI, 'base', PESI));
  assert.equal(r.indicazione, null);
  assert.equal(r.assente, 'niente da fare');
});

test('dovePesa: sulla vela nessuna frase, perche un peso per voce non esiste', () => {
  const items = bancaPubblicata();
  const progress = storicoMisto(items.filter((x) => x.k === 'vela'));
  const r = dovePesa(quadro(items, progress, OGGI, 'vela', { VELA: 5 }));
  assert.equal(r.indicazione, null);
  assert.equal(r.assente, 'senza pesi');
  const base = dovePesa(quadro(items, storicoMisto(items.filter((x) => x.k === 'base')), OGGI, 'base'));
  assert.equal(base.assente, 'senza pesi', 'e nemmeno sulla base, se nessuno le passa i pesi');
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


// --- quante domande apre lo screening ---------------------------------------------
//
// Perche' questo blocco esiste. Il numero sul pulsante veniva da `totScreening`
// in `app.html`, che lo calcolava dai conteggi dichiarati in `meta.json`; la
// lista la costruisce `screening()`, che conta la banca. Due conti della stessa
// cosa, in due file, da due fonti diverse — la firma del difetto tornato tre
// volte qui dentro, l'ultima nella 0.19.2 con i Segnali che promettevano 10
// domande e ne servivano 8.
//
// E i test che c'erano non potevano prenderlo: `bancaVera()` da' cinque voci per
// tema da almeno venti quesiti l'una, quindi il minimo non morde mai e
// `perVoce × voci` e' giusto per caso. Sulla banca pubblicata morde: tre voci
// del decreto hanno **un quesito solo**. Per questo questi test leggono la banca
// vera invece di quella finta.

test('lunghezzaScreening: il numero promesso e la lista che si apre coincidono', () => {
  const items = bancaPubblicata();
  for (const kind of ['base', 'vela'])
    for (const perVoce of [1, 2, 3, 6])
      for (const seme of [1, 7, 42]) {
        const aperte = screening(items, {}, OGGI, perVoce, kind, seme).length;
        assert.equal(lunghezzaScreening(items, perVoce, kind), aperte,
          `${kind} a ${perVoce} per voce (seme ${seme}): promesse != aperte`);
      }
});

test('lunghezzaScreening: sulla banca vera il minimo morde, e perVoce x voci sarebbe falso', () => {
  const items = bancaPubblicata();
  const voci = new Set(items.filter((q) => q.k === 'base').map((q) => q.v)).size;
  assert.equal(voci, 44, 'le voci del decreto sono 44');
  assert.equal(lunghezzaScreening(items, 1, 'base'), 44, 'a 1 per voce i due conti coincidono');
  for (const [perVoce, atteso] of [[2, 85], [3, 126], [6, 249]]) {
    assert.equal(lunghezzaScreening(items, perVoce, 'base'), atteso,
      `a ${perVoce} per voce lo screening apre ${atteso} domande`);
    assert.ok(atteso < perVoce * voci,
      `a ${perVoce} per voce, ${perVoce * voci} sarebbe una promessa gonfiata di ${perVoce * voci - atteso}`);
  }
});

test('lunghezzaScreening: una voce con un quesito solo non ne presta sei', () => {
  const items = [
    ...Array.from({ length: 10 }, (_, i) => ({ id: `base-a${i}`, k: 'base', t: 'T', v: 'larga' })),
    { id: 'base-b', k: 'base', t: 'T', v: 'stretta' },
    { id: 'vela-1', k: 'vela', t: 'VELA', v: 'sua' },
  ];
  assert.equal(lunghezzaScreening(items, 6, 'base'), 7, 'sei dalla larga, uno solo dalla stretta');
  assert.equal(lunghezzaScreening(items, 6, 'base'), screening(items, {}, OGGI, 6, 'base', 3).length);
  assert.equal(lunghezzaScreening(items, 6, 'vela'), 1, 'la vela non entra nel conto della base');
});

test('lunghezzaScreening: il motore fa quello che oggi fa la pagina', (t) => {
  // Come per `daAllenare()`: finche' la copia vive in `app.html`, la eseguiamo
  // davvero — estratta dal file, non trascritta — e pretendiamo lo stesso
  // numero. Quando l'interfaccia passera' a `E.lunghezzaScreening()` la copia
  // sparira' e questo test si mettera' da parte da solo.
  //
  // Finche' c'e', pero', fa anche un secondo lavoro che nessun altro test fa:
  // la pagina conta da `meta.json` e il motore dalla banca, quindi questo
  // confronto **pretende che i conteggi per voce di meta e della banca
  // coincidano**. `test_meta` verifica solo i totali.
  const src = readFileSync(new URL('../site/app.html', import.meta.url), 'utf8');
  const m = src.match(/^function totScreening\(k\) \{[\s\S]*?^\}/m);
  if (!m) return t.skip('app.html non ha piu una sua totScreening(): ora chiama il motore');

  const items = bancaPubblicata();
  const meta = JSON.parse(readFileSync(new URL('../site/dati/meta.json', import.meta.url), 'utf8'));
  for (const kind of ['base', 'vela']) {
    const pagina = new Function('S', `${m[0]}\nreturn totScreening;`)({ filtro: { kind }, meta });
    for (const perVoce of [1, 2, 3, 6])
      assert.equal(pagina(perVoce), lunghezzaScreening(items, perVoce, kind),
        `${kind} a ${perVoce} per voce: la pagina e il motore danno numeri diversi`);
  }
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

// Fino al 3 ottobre 2026 qui c'era «il GUSCIO di sw.js e quello di app.html
// sono la stessa lista» (R-ARCH-04): due copie della stessa lista, una che
// metteva in cache e l'altra che controllava. L'ADR-005 ha tolto l'offline, e
// sw.js non ha piu' un guscio; quello di app.html esce con P-61. I test del
// sw.js nuovo sono piu' giu', «sw.js: si toglie di mezzo».

test('la prova di carteggio: uno per argomento, pescati a caso', () => {
  // Fino a P-32 questo test riproduceva `componiProva()` di app.html con
  // `estrai`, cioe' verificava una copia della pagina scritta nel test. Ora la
  // composizione e' nel motore, e il test la esegue.
  const ARG = E.PROVA_CARTEGGIO.argomenti;
  const banca = [];
  for (const a of ARG) for (let i = 1; i <= 8; i++) banca.push({ id: `${a}-${i}`, k: 'c', argomento: a, carta: '5/D' });

  const componi = (prog, seme) => E.provaCarteggio(banca, prog, OGGI, { seme }).lista;

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
  // Il numero di errori ammessi viene dalla sorgente sola delle condizioni
  // (P-32), non da un 1 scritto qui: e' 4 esercizi meno 3 da prendere.
  const max = E.PROVA_CARTEGGIO.erroriMax;
  assert.equal(max, 1);
  assert.equal(esito([true, true, true, false], max).superata, true, '3 su 4 passa');
  assert.equal(esito([true, true, false, false], max).superata, false, '2 su 4 no');
  assert.equal(esito([true, true, true, true], max).superata, true);
  assert.equal(esito([false, false, false, false], max).errori, 4);
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


/* --- P-32: la prova di carteggio nel motore --------------------------------- */
//
// Fino a P-32 la composizione stava in `componiProva()` di app.html, con i suoi
// 4/60/3 scritti accanto, e il test qui sopra ne verificava una copia. D-01 del
// §10.1 di docs/area-4-progetto.md chiede il contratto nel motore: la lista,
// gli argomenti rappresentati e mancanti, le riprese per argomento, e il
// ripiego su una banca incompleta dichiarato invece che taciuto.

function bancaCarteggioVera() {
  return JSON.parse(readFileSync(new URL('../site/dati/carteggio.json', import.meta.url), 'utf8'));
}
const VISTO = { n: 1, c: 1, first: 1, s: 1, lw: null, k: 0, t: OGGI };

test('provaCarteggio: le condizioni della prova hanno una sorgente sola, e l assunzione si dice', () => {
  const P = E.PROVA_CARTEGGIO;
  assert.ok(Object.isFrozen(P) && Object.isFrozen(P.argomenti), 'una costante che si puo riscrivere non e una sorgente');
  assert.equal(P.esercizi, 4);
  assert.equal(P.minuti, 60);
  assert.equal(P.soglia, 3);
  assert.equal(P.erroriMax, P.esercizi - P.soglia, 'gli errori ammessi discendono dalla soglia');
  assert.deepEqual([...P.argomenti], ['navigazione costiera', 'correnti', 'scarroccio', 'carburante']);
  assert.match(P.fonte, /DM 323\/2021/, 'i numeri hanno la loro fonte');
  assert.match(P.fonte, /art\. 6 c\. 6/);
  // Q-CART4: «uno per argomento» e' un'assunzione, e chi consuma il contratto
  // la riceve insieme alla lista, non la deve ricordare.
  assert.match(P.assunzione, /Q-CART4/);
  assert.match(P.assunzione, /assunzione/);
  assert.match(P.assunzione, /42\/D/, 'la carta senza esercizi di carburante si nomina');
  const out = E.provaCarteggio(bancaCarteggioVera(), {}, OGGI, { seme: 5 });
  assert.deepEqual(out.condizioni, { esercizi: 4, minuti: 60, soglia: 3, erroriMax: 1 });
  assert.equal(out.assunzione, P.assunzione);
});

test('provaCarteggio: quattro esercizi distinti, uno per argomento, sulla banca vera', () => {
  const banca = bancaCarteggioVera();
  const carteViste = new Set();
  const primi = new Set();
  let dueCarte = 0;
  for (let seme = 1; seme <= 300; seme++) {
    const out = E.provaCarteggio(banca, {}, OGGI, { seme });
    primi.add(out.lista[0].argomento);
    assert.equal(out.lista.length, 4, `seme ${seme}: quattro esercizi`);
    assert.equal(out.pronta, true, `seme ${seme}: pronta`);
    assert.equal(new Set(out.lista.map((e) => e.id)).size, 4, `seme ${seme}: distinti`);
    assert.deepEqual(out.lista.map((e) => e.argomento).sort(), [...E.PROVA_CARTEGGIO.argomenti].sort(),
      `seme ${seme}: uno per argomento`);
    assert.deepEqual(out.rappresentati, [...E.PROVA_CARTEGGIO.argomenti]);
    assert.deepEqual(out.mancanti, []);
    assert.deepEqual(out.completamento, []);
    // le carte si ricavano dalla lista: distinte, nell'ordine in cui compaiono
    assert.deepEqual(out.carte, [...new Set(out.lista.map((e) => e.carta))], `seme ${seme}: carte dalla lista`);
    // ogni argomento dice quale esercizio ha dato
    for (const a of out.argomenti) {
      const e = out.lista.find((x) => x.argomento === a.argomento);
      assert.equal(a.preso, e.id, `seme ${seme}: ${a.argomento}`);
      assert.equal(a.esercizi, banca.filter((x) => x.argomento === a.argomento).length);
    }
    for (const c of out.carte) carteViste.add(c);
    if (out.carte.length > 1) dueCarte++;
  }
  // Niente filtro per carta: la prova pesca da tutta la banca, e la 42/D non
  // ha carburante, quindi una prova su una carta sola non e' la regola.
  assert.deepEqual([...carteViste].sort(), ['42/D', '5/D']);
  assert.ok(dueCarte > 0, 'alcune prove chiedono tutte e due le carte');
  // e l'ordine della prova non e' quello degli argomenti: la lista si rimescola
  assert.equal(primi.size, 4, 'ogni argomento puo aprire la prova');
  // e la variante porta un campo che la riga puo' tenere: la revisione di una
  // prova nuova la distingue, una riga di prima non ce l'ha ed e' sconosciuta
  const riga = { _t: 'c', uid: 'x1', item_id: '5.1.3-1', ts: '2026-09-30T10:00:00+02:00', verdict: 1,
    delta: null, mode: 'simulazione', variante: 'cieca' };
  assert.equal(validaRiga(riga), null);
});

test('provaCarteggio: la prova cieca non guarda lo storico, e non finge di averlo guardato', () => {
  const banca = bancaCarteggioVera();
  const tutto = Object.fromEntries(banca.map((e) => [e.id, VISTO]));
  const meta = Object.fromEntries(banca.filter((_, i) => i % 2).map((e) => [e.id, VISTO]));
  for (const seme of [1, 17, 404]) {
    const vuoto = E.provaCarteggio(banca, {}, OGGI, { seme });
    assert.deepEqual(E.provaCarteggio(banca, tutto, OGGI, { seme }), vuoto, `seme ${seme}: lo storico non cambia niente`);
    assert.deepEqual(E.provaCarteggio(banca, meta, OGGI, { seme }), vuoto, `seme ${seme}: nemmeno a meta`);
    assert.equal(vuoto.variante, 'cieca');
    // Non misurato non e' zero: una prova cieca che dicesse «0 riprese» con
    // tutta la banca gia' fatta direbbe il falso.
    assert.equal(vuoto.riprese, null, 'le riprese non si contano, e si dice');
    assert.ok(vuoto.argomenti.every((a) => a.nuovi === null && a.ripresa === null));
  }
  assert.notDeepEqual(E.provaCarteggio(banca, {}, OGGI, { seme: 1 }).lista.map((e) => e.id),
    E.provaCarteggio(banca, {}, OGGI, { seme: 2 }).lista.map((e) => e.id), 'semi diversi, prove diverse');
});

test('provaCarteggio: con la precedenza ai mai provati le riprese si dicono per argomento', () => {
  const ARG = E.PROVA_CARTEGGIO.argomenti;
  const banca = [];
  for (const a of ARG) for (let i = 1; i <= 3; i++) banca.push({ id: `${a}-${i}`, argomento: a, carta: '5/D' });
  // carburante tutto gia' fatto; correnti: due su tre
  const prog = { 'carburante-1': VISTO, 'carburante-2': VISTO, 'carburante-3': VISTO,
    'correnti-1': VISTO, 'correnti-2': VISTO };
  for (let seme = 1; seme <= 50; seme++) {
    const out = E.provaCarteggio(banca, prog, OGGI, { seme, nuoviPrima: true });
    assert.equal(out.variante, 'nuoviPrima');
    assert.equal(out.lista.length, 4, 'la prova non esce mai corta');
    const per = Object.fromEntries(out.argomenti.map((a) => [a.argomento, a]));
    assert.equal(per.correnti.preso, 'correnti-3', `seme ${seme}: il solo mai provato di correnti`);
    assert.equal(per.correnti.nuovi, 1);
    assert.equal(per.correnti.ripresa, false);
    assert.equal(per.carburante.nuovi, 0, 'i mai provati di carburante sono finiti');
    assert.equal(per.carburante.ripresa, true, 'e la ripresa si dichiara');
    assert.equal(per['navigazione costiera'].nuovi, 3);
    const car = out.lista.find((e) => e.argomento === 'carburante');
    assert.deepEqual(out.riprese, [{ id: car.id, argomento: 'carburante' }], `seme ${seme}: una ripresa sola, nominata`);
  }
  // Sulla banca vera, con 36 esercizi gia' provati (la misura della 0.18.0):
  // accesa, nessuna prova ripesca un esercizio fatto, e nessuna ripresa si
  // dichiara; spenta, ne ripesca, come l'esame che non sa niente di te.
  const vera = bancaCarteggioVera();
  const fatti = Object.fromEntries(vera.filter((_, i) => i % 3 === 0).slice(0, 36).map((e) => [e.id, VISTO]));
  assert.equal(Object.keys(fatti).length, 36);
  let cieche = 0;
  for (let seme = 1; seme <= 300; seme++) {
    const acc = E.provaCarteggio(vera, fatti, OGGI, { seme, nuoviPrima: true });
    assert.ok(acc.lista.every((e) => !fatti[e.id]), `seme ${seme}: un esercizio gia fatto con la precedenza accesa`);
    assert.deepEqual(acc.riprese, []);
    if (E.provaCarteggio(vera, fatti, OGGI, { seme }).lista.some((e) => fatti[e.id])) cieche++;
  }
  assert.ok(cieche > 0, 'la cieca ripesca i gia fatti');
});

test('provaCarteggio: su una banca incompleta i mancanti si nominano e il ripiego si dichiara', () => {
  const ARG = E.PROVA_CARTEGGIO.argomenti;
  const banca = [];
  for (const a of ARG.filter((x) => x !== 'carburante'))
    for (let i = 1; i <= 3; i++) banca.push({ id: `${a}-${i}`, argomento: a, carta: '42/D' });
  // la 42/D da sola: niente carburante, come nella banca vera
  for (let seme = 1; seme <= 50; seme++) {
    const out = E.provaCarteggio(banca, {}, OGGI, { seme });
    assert.deepEqual(out.mancanti, ['carburante'], 'l argomento assente si nomina');
    assert.deepEqual(out.rappresentati, ['navigazione costiera', 'correnti', 'scarroccio'],
      'e non conta fra i rappresentati');
    const car = out.argomenti.find((a) => a.argomento === 'carburante');
    assert.equal(car.esercizi, 0);
    assert.equal(car.preso, null);
    assert.equal(out.lista.length, 4, 'la prova si completa dal resto invece di uscire corta');
    assert.equal(out.completamento.length, 1, 'e il completamento si dichiara');
    const [c] = out.completamento;
    assert.ok(out.lista.some((e) => e.id === c.id));
    assert.notEqual(c.argomento, 'carburante', 'il completamento non finge l argomento che manca');
    assert.equal(new Set(out.lista.map((e) => e.id)).size, 4, 'nessun esercizio due volte');
  }
  // Troppo pochi esercizi: la lista resta corta e non si dichiara pronta. Chi
  // la consuma blocca l'avvio (§5.1 del progetto dell'area 4).
  const due = E.provaCarteggio(banca.slice(0, 2), {}, OGGI, { seme: 3 });
  assert.equal(due.lista.length, 2);
  assert.equal(due.pronta, false);
  const vuota = E.provaCarteggio([], {}, OGGI, { seme: 3 });
  assert.deepEqual(vuota.lista, []);
  assert.equal(vuota.pronta, false);
  assert.deepEqual(vuota.mancanti, [...ARG]);
  assert.deepEqual(vuota.carte, []);
  // un esercizio di un argomento che la prova non conosce completa, ma non
  // diventa un argomento rappresentato
  const strana = [...banca, { id: 'x-1', argomento: 'meteo', carta: '5/D' }];
  const tutti = new Set();
  for (let seme = 1; seme <= 80; seme++) {
    const out = E.provaCarteggio(strana, {}, OGGI, { seme });
    assert.ok(!out.rappresentati.includes('meteo'));
    for (const c of out.completamento) tutti.add(c.argomento);
  }
  assert.ok(tutti.has('meteo'), 'il completamento pesca dal resto intero, come la pagina di prima');
  // con la precedenza, anche il completamento preferisce i mai provati
  const prog = Object.fromEntries(banca.filter((e) => !e.id.endsWith('-3')).map((e) => [e.id, VISTO]));
  // (i mai provati sono solo i «-3», uno per argomento: il completamento non
  // ne trova altri, e la sua ripresa si dichiara come le altre)
  for (let seme = 1; seme <= 30; seme++) {
    const out = E.provaCarteggio(banca, prog, OGGI, { seme, nuoviPrima: true });
    assert.equal(out.lista.filter((e) => e.id.endsWith('-3')).length, 3, `seme ${seme}: i tre mai provati entrano`);
    const [c] = out.completamento;
    assert.deepEqual(out.riprese, [{ id: c.id, argomento: c.argomento }], `seme ${seme}: il completamento e una ripresa`);
  }
});

test('provaCarteggio: il motore compone la stessa prova della pagina', (t) => {
  // Come per `daAllenare()` e `totScreening()`: finche' `componiProva()` vive
  // in app.html la eseguiamo davvero — estratta dal file, non trascritta — e
  // pretendiamo la stessa lista, con le stesse condizioni. Quando la pagina
  // passera' a `E.provaCarteggio()` (area 4, P-21) la copia sparira' e questo
  // test si mettera' da parte da solo.
  const src = readFileSync(new URL('../site/app.html', import.meta.url), 'utf8');
  const m = src.match(/^function componiProva\(seme\) \{[\s\S]*?^\}/m);
  if (!m) return t.skip('app.html non ha piu una sua componiProva(): ora chiama il motore');
  const cost = (nome) => {
    const c = src.match(new RegExp(`^const ${nome} = (.+?);`, 'm'));
    assert.ok(c, `${nome} non si legge in app.html`);
    return JSON.parse(c[1].replace(/'/g, '"').replace(/\s*\/\/.*$/, ''));
  };
  const P = E.PROVA_CARTEGGIO;
  assert.deepEqual(cost('ARGOMENTI'), [...P.argomenti], 'gli argomenti della pagina e del motore');
  assert.equal(cost('PROVA_N'), P.esercizi);
  assert.equal(cost('PROVA_MIN'), P.minuti);
  assert.equal(cost('PROVA_SOGLIA'), P.soglia);

  const banca = bancaCarteggioVera();
  const fatti = Object.fromEntries(banca.filter((_, i) => i % 3 === 0).map((e) => [e.id, VISTO]));
  // la stessa banca senza carburante, per il completamento
  const monca = banca.filter((e) => e.argomento !== 'carburante');
  for (const cart of [banca, monca]) for (const cprog of [{}, fatti]) for (const prep of [false, true]) {
    const S = { date: { oggi: OGGI }, prep, cart, cprog };
    const pagina = new Function('S', 'E', 'today', 'ARGOMENTI', 'PROVA_N', `${m[0]}\nreturn componiProva;`)(
      S, E, () => OGGI, cost('ARGOMENTI'), cost('PROVA_N'));
    for (let seme = 0; seme < 200; seme++)
      assert.deepEqual(E.provaCarteggio(cart, cprog, OGGI, { seme, nuoviPrima: prep }).lista.map((e) => e.id),
        pagina(seme).map((e) => e.id), `seme ${seme}, prep ${prep}: la pagina e il motore compongono prove diverse`);
  }
  // E il secondo conto della pagina: `argomentiSenzaNuovi()` dichiara dove la
  // variante ripesca. Il contratto lo da' in `argomenti[].nuovi`.
  const s = src.match(/^function argomentiSenzaNuovi\(\) \{[\s\S]*?^\}/m);
  if (s) for (const cprog of [{}, fatti, Object.fromEntries(banca.filter((e) => e.argomento !== 'correnti').map((e) => [e.id, VISTO]))]) {
    const senza = new Function('S', 'ARGOMENTI', `${s[0]}\nreturn argomentiSenzaNuovi;`)({ cart: banca, cprog }, cost('ARGOMENTI'))();
    const out = E.provaCarteggio(banca, cprog, OGGI, { seme: 1, nuoviPrima: true });
    assert.deepEqual(out.argomenti.filter((a) => a.nuovi === 0).map((a) => a.argomento), senza,
      'la pagina e il motore dicono diversamente dove i mai provati sono finiti');
  }
});

/* --- 0.19.0: sito statico — l'archivio nel browser ------------------------ */

test('la versione e una sola: VERSION e meta.json, e sw.js non la porta', async () => {
  // Fino al 3 ottobre 2026 la versione stava in tre posti: anche il nome della
  // cache in sw.js, perche' una cache dimenticata congelava l'app sulla prima
  // versione vista da ogni dispositivo. Dall'ADR-005 non c'e' piu' una cache:
  // i posti sono due, e sw.js non deve tornare a portare una versione — un
  // nome di cache li' vorrebbe dire che l'offline e' rientrato senza decisione.
  const fs = await import('node:fs/promises');
  const radice = new URL('../', import.meta.url);
  const versione = (await fs.readFile(new URL('VERSION', radice), 'utf8')).trim();
  assert.match(versione, /^\d+\.\d+\.\d+$/, 'VERSION non e un numero di versione');
  const meta = JSON.parse(await fs.readFile(new URL('site/dati/meta.json', radice), 'utf8'));
  assert.equal(meta.versione, versione, 'meta.json dichiara un altra versione');
  const changelog = await fs.readFile(new URL('CHANGELOG.md', radice), 'utf8');
  assert.ok(changelog.includes(`## [${versione}]`), 'il CHANGELOG non ha la voce di VERSION');
  const sw = await fs.readFile(new URL('site/sw.js', radice), 'utf8');
  assert.ok(!/const CACHE\b/.test(sw) && !sw.includes(`'rg-${versione}'`), 'sw.js porta di nuovo il nome di una cache');
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

// --- L'ultimo tag di un tentativo (P-17) -------------------------------------
//
// Da P-01 ritaggare N/L/C **aggiunge** una riga `_t:'g'` con la sua data, e non
// cancella le precedenti: l'archivio resta append-only, e l'unione per `uid`
// con un'altra copia non puo' far tornare un tag vecchio. Quale tag vale lo
// decideva `tagPerTentativo()` in app.html, senza un test. Ora la regola sta
// qui: per istante, i tag storici senza data prima, l'ordine dell'archivio a
// parita' di istante.

/** Una riga di tag. `ts` omesso = un tag storico, scritto senza data. */
const tagRiga = (uid, attempt, tag, ts) =>
  ({ _t: 'g', uid, attempt_uid: attempt, tag, ...(ts === undefined ? {} : { ts }) });

test('tagPerTentativo: un ritag aggiunge una riga, e vale l ultima', () => {
  const righe = [
    { _t: 'q', uid: 'r1', item_id: 'base-1', ts: '2026-09-26T10:00:00+02:00', correct: 0, ms: 9000 },
    tagRiga('g1', 'r1', 'N', '2026-09-26T10:00:05+02:00'),
    tagRiga('g2', 'r1', 'L', '2026-09-26T10:00:09+02:00'),
    tagRiga('g3', 'r2', 'N', '2026-09-26T10:01:00+02:00'),
    tagRiga('g4', 'r1', 'C', '2026-09-26T10:05:00+02:00'),
  ];
  const t = E.tagPerTentativo(righe);
  assert.equal(t.r1, 'C', 'il ritag dal riepilogo vince sui due di prima');
  assert.equal(t.r2, 'N', 'un altro tentativo non risente del ritag');
  assert.deepEqual(Object.keys(t).sort(), ['r1', 'r2'], 'solo i tentativi con un tag');
  // Le righe restano tutte: la funzione legge, non riscrive l'archivio.
  assert.equal(righe.length, 5);
  assert.deepEqual({ ...E.tagPerTentativo([]) }, {});
  assert.deepEqual({ ...E.tagPerTentativo(undefined) }, {});
});

test('tagPerTentativo: i tag storici senza data vengono prima di quelli datati', () => {
  // Prima di P-01 i tag nascevano senza `ts`, e ritaggare cancellava la riga
  // vecchia. Un archivio di allora, unito a uno di adesso, ha il tag storico
  // **dopo** quello datato nell'ordine dell'archivio: non deve vincere lui.
  const righe = [
    tagRiga('g1', 'r1', 'L', '2026-09-26T10:00:00+02:00'),
    tagRiga('g2', 'r1', 'N'),
    tagRiga('g3', 'r2', 'N'),
    tagRiga('g4', 'r2', 'C'),   // due storici: decide l'ordine dell'archivio
  ];
  const t = E.tagPerTentativo(righe);
  assert.equal(t.r1, 'L', 'un tag storico senza data ha scavalcato quello datato');
  assert.equal(t.r2, 'C', 'fra due tag storici vale l ultimo dell archivio');
});

test('tagPerTentativo: date miste UTC e offset locale si confrontano per istante', () => {
  // Fino alla 0.4.5 le righe erano in UTC con la Z, poi con l'offset locale.
  // Come stringhe «08:30Z» viene prima di «10:00+02:00», come istanti dopo.
  const righe = [
    tagRiga('g1', 'r1', 'C', '2026-09-26T08:30:00Z'),        // 10:30 a Roma
    tagRiga('g2', 'r1', 'N', '2026-09-26T10:00:00+02:00'),   // 08:00Z: prima
    tagRiga('g3', 'r2', 'N', '2026-09-26T10:00:00.000+02:00'),
    tagRiga('g4', 'r2', 'L', '2026-09-26T07:59:59Z'),        // 09:59:59 a Roma: prima
  ];
  const t = E.tagPerTentativo(righe);
  assert.equal(t.r1, 'C', 'ordinati come stringhe, non come istanti');
  assert.equal(t.r2, 'N', 'ordinati come stringhe, non come istanti');
});

test('tagPerTentativo: allo stesso istante decide l ordine dell archivio', () => {
  const righe = [
    tagRiga('g1', 'r1', 'N', '2026-09-26T10:00:00+02:00'),
    tagRiga('g2', 'r1', 'L', '2026-09-26T08:00:00Z'),   // lo stesso istante
    tagRiga('g3', 'r2', 'L', '2026-09-26T08:00:00.000Z'),
    tagRiga('g4', 'r2', 'N', '2026-09-26T10:00:00+02:00'),
  ];
  const t = E.tagPerTentativo(righe);
  assert.equal(t.r1, 'L');
  assert.equal(t.r2, 'N');
});

test('tagPerTentativo: una riga che l archivio non accetterebbe non decide un tag', () => {
  // La regola e' `validaRiga()`, la stessa dell'import: un tag fuori da N/L/C,
  // senza tentativo o con una data rotta non sovrascrive quello buono, e non
  // crea una chiave «undefined». Nemmeno le righe di altri tipi contano.
  const righe = [
    tagRiga('g1', 'r1', 'L', '2026-09-26T10:00:00+02:00'),
    tagRiga('g2', 'r1', 'X', '2026-09-26T10:05:00+02:00'),
    tagRiga('g3', 'r1', 'N', 'boh'),
    { _t: 'g', uid: 'g4', tag: 'C', ts: '2026-09-26T10:06:00+02:00' },
    { _t: 'q', uid: 'r1', item_id: 'base-1', attempt_uid: 'r1', tag: 'C', correct: 0, ms: 1,
      ts: '2026-09-26T10:07:00+02:00' },
    tagRiga('g5', '__proto__', 'N', '2026-09-26T10:08:00+02:00'),
  ];
  const t = E.tagPerTentativo(righe);
  assert.equal(t.r1, 'L', 'una riga rotta ha sovrascritto il tag buono');
  assert.ok(!('undefined' in t), 'un tag senza tentativo ha creato una chiave');
  assert.equal(t.__proto__, 'N', 'un uid qualunque e\' una chiave come le altre');
  assert.deepEqual(Object.keys(t).sort(), ['__proto__', 'r1']);
});

test('tagPerTentativo: il motore sceglie lo stesso tag della pagina', (t) => {
  // Come per `daAllenare()` e `componiProva()`: finche' la copia vive in
  // app.html la eseguiamo davvero — estratta dal file, non trascritta — e
  // pretendiamo lo stesso tag per ogni tentativo. Quando la pagina passera' a
  // `E.tagPerTentativo()` la copia sparira' e il test si mettera' da parte da
  // solo. Sulle righe che l'archivio accetta: su quelle rotte il motore e' piu'
  // stretto, di proposito (test qui sopra).
  const src = readFileSync(new URL('../site/app.html', import.meta.url), 'utf8');
  const m = src.match(/^function tagPerTentativo\(\) \{[\s\S]*?^\}/m);
  if (!m) return t.skip('app.html non ha piu una sua tagPerTentativo(): ora chiama il motore');
  const casi = [
    [tagRiga('a', 'r1', 'N', '2026-09-26T10:00:05+02:00'), tagRiga('b', 'r1', 'L', '2026-09-26T10:00:09+02:00')],
    [tagRiga('a', 'r1', 'L', '2026-09-26T10:00:00+02:00'), tagRiga('b', 'r1', 'N'), tagRiga('c', 'r2', 'N'), tagRiga('d', 'r2', 'C')],
    [tagRiga('a', 'r1', 'C', '2026-09-26T08:30:00Z'), tagRiga('b', 'r1', 'N', '2026-09-26T10:00:00+02:00')],
    [tagRiga('a', 'r1', 'N', '2026-09-26T10:00:00+02:00'), tagRiga('b', 'r1', 'L', '2026-09-26T08:00:00Z')],
  ];
  // e un archivio piu' grande, con righe di quiz in mezzo, in un ordine rimescolato
  const grande = [];
  for (let i = 0; i < 120; i++) {
    const at = `r${i % 17}`, min = String(i % 60).padStart(2, '0');
    if (i % 5 === 0) grande.push({ _t: 'q', uid: `q${i}`, item_id: 'base-1', correct: 0, ms: 1, ts: `2026-09-26T09:${min}:00+02:00` });
    else if (i % 7 === 0) grande.push(tagRiga(`g${i}`, at, 'NLC'[i % 3]));
    else if (i % 2) grande.push(tagRiga(`g${i}`, at, 'NLC'[i % 3], `2026-09-26T0${7 + (i % 2)}:${min}:00Z`));
    else grande.push(tagRiga(`g${i}`, at, 'NLC'[i % 3], `2026-09-26T10:${min}:00+02:00`));
  }
  casi.push(rimescola(grande, 7));
  for (const [i, archivio] of casi.entries()) {
    const pagina = new Function('S', 'E', `${m[0]}\nreturn tagPerTentativo;`)({ archivio }, E)();
    assert.deepEqual({ ...E.tagPerTentativo(archivio) }, { ...pagina }, `caso ${i}: la pagina e il motore scelgono tag diversi`);
  }
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

// --- validaRiga: una regola sola per dire che una riga e' buona -----------------
//
// Oggi la usa l'import; con gli account la useranno anche la conversione di un
// file e il server, importando questo stesso file (docs/account-progetto.md
// §4.1). Due copie della regola sono la riga con `ts: "boh"` della 0.4.6, che
// entrava con HTTP 200 e spegneva la palestra su ogni dispositivo.
//
// Le forme qui sotto sono quelle che `app.html` scrive, e le regole sono state
// misurate il 26 settembre 2026 sull'archivio vero del progetto di preparazione
// (2.341 righe, lette e non copiate): 135 date in UTC con la `Z` e le altre con
// l'offset, 160 tag **senza** data, tag solo N/L/C, `uid` stringhe da 17
// caratteri, la riga piu' grande 241 byte.

// Dal namespace e non per nome: finche' l'export non c'e' devono cadere questi
// test, non l'intera suite con un SyntaxError all'import.
const validaRiga = (...a) => E.validaRiga(...a);

const RIGHE_VERE = {
  q: { _t: 'q', uid: 'msr5ch8z-2z3kb3yl', kind: 'base', item_id: 'base-90', ts: '2026-08-13T06:38:02.579Z',
       correct: 1, ms: 14964, mode: 'batteria', chosen: '0', sim_uid: null },
  c: { _t: 'c', uid: 'mt8rn1xa-uly9zqbr', item_id: '5.4.1-9', ts: '2026-08-25T16:34:12.478+02:00',
       input_json: '{"risposta":"3.7"}', verdict: 0, delta: null, ms: 899996, mode: 'simulazione', sim_uid: null },
  t: { _t: 't', uid: 'mt8rn1xa-aaaaaaaa', item_id: '5.1.3-1', ts: '2026-08-25T16:40:00+02:00', correct: 1, ms: 8000 },
  s: { _t: 's', uid: 'mt8j6px7-ms94s8qf', kind: 'base', ts: '2026-08-25T10:37:33.499Z',
       score: 17, total: 20, passed: 1, ms: 1800000 },
  g: { _t: 'g', uid: 'mt9o0qeo-elth0i6w', attempt_uid: 'mt9nrnkj-5s2m6z33', tag: 'N' },
};

test('validaRiga: le righe nella forma che la pagina scrive passano, tag senza data compresi', () => {
  for (const [t, r] of Object.entries(RIGHE_VERE)) assert.equal(validaRiga(r), null, `riga ${t}`);
  // le date con l'offset e quelle in UTC dell'archivio di prima della 0.4.5
  assert.equal(validaRiga({ ...RIGHE_VERE.q, ts: '2026-08-13T08:38:02+02:00' }), null);
  assert.equal(validaRiga({ ...RIGHE_VERE.q, ts: '2026-08-13T08:38:02-05:30' }), null);
  // un campo che il motore non conosce non e' un difetto: si conserva
  assert.equal(validaRiga({ ...RIGHE_VERE.q, campo_futuro: [1, 2] }), null);
});

test('validaRiga: una riga rotta e\' rifiutata, e il rifiuto dice perche', () => {
  const q = RIGHE_VERE.q;
  const casi = [
    [null, 'non e\' una riga'],
    [[q], 'non e\' una riga'],
    ['riga', 'non e\' una riga'],
    [{ ...q, uid: undefined }, 'senza uid'],
    [{ ...q, uid: '' }, 'senza uid'],
    [{ ...q, uid: 42 }, 'senza uid'],
    [{ ...q, uid: 'x'.repeat(65) }, 'senza uid'],
    [{ ...q, _t: undefined }, 'tipo sconosciuto'],
    [{ ...q, _t: 'z' }, 'tipo sconosciuto'],
    [{ ...q, ts: undefined }, 'data non valida'],
    [{ ...q, ts: 'boh' }, 'data non valida'],                     // la 0.4.6
    [{ ...q, ts: '2026-08-13' }, 'data non valida'],
    [{ ...q, ts: '2026-08-13T08:38:02' }, 'data non valida'],     // senza offset: che ora e'?
    [{ ...q, ts: '2026-13-45T08:38:02Z' }, 'data non valida'],
    [{ ...RIGHE_VERE.s, ts: undefined }, 'data non valida'],
    [{ ...q, item_id: undefined }, 'senza quesito'],
    [{ ...RIGHE_VERE.c, item_id: '' }, 'senza quesito'],
    [{ ...RIGHE_VERE.t, item_id: 7 }, 'senza quesito'],
    [{ ...RIGHE_VERE.g, attempt_uid: undefined }, 'tag non valido'],
    [{ ...RIGHE_VERE.g, tag: 'X' }, 'tag non valido'],
    [{ ...RIGHE_VERE.g, ts: 'boh' }, 'data non valida'],          // la data non serve, ma se c'e' e' una data
    [{ ...RIGHE_VERE.c, input_json: JSON.stringify({ risposta: 'x'.repeat(5000) }) }, 'troppo grande'],
  ];
  for (const [riga, motivo] of casi) assert.equal(validaRiga(riga), motivo, JSON.stringify(riga)?.slice(0, 80));
});

test('validaRiga: con la banca accanto, un quesito che non esiste e\' un sintomo', () => {
  const quesiti = new Set(['base-90', '5.4.1-9', '5.1.3-1']);
  for (const r of Object.values(RIGHE_VERE)) assert.equal(validaRiga(r, { quesiti }), null);
  assert.equal(validaRiga({ ...RIGHE_VERE.q, item_id: 'base-99999' }, { quesiti }), 'quesito sconosciuto');
  // senza la banca non si controlla: la pagina chiama fondiArchivio senza
  assert.equal(validaRiga({ ...RIGHE_VERE.q, item_id: 'base-99999' }), null);
});

test('fondiArchivio: i tag si importano, e gli scarti si contano per motivo', () => {
  // Il difetto misurato il 25 settembre: una risposta e il suo tag davano
  // `nuove: 1, scartate: 1`, perche' il tag non ha `ts`.
  const r = fondiArchivio([], [RIGHE_VERE.q, RIGHE_VERE.g]);
  assert.equal(r.nuove, 2); assert.equal(r.scartate, 0);
  assert.deepEqual(r.motivi, {});

  const s = fondiArchivio([], [
    RIGHE_VERE.q, { ...RIGHE_VERE.c, ts: 'boh' }, { ...RIGHE_VERE.s, ts: 'boh' }, { ...RIGHE_VERE.t, uid: '' },
  ]);
  assert.equal(s.nuove, 1); assert.equal(s.scartate, 3);
  assert.deepEqual(s.motivi, { 'data non valida': 2, 'senza uid': 1 });
  // la riga entra com'era, con i campi che il motore non conosce
  const extra = { ...RIGHE_VERE.q, uid: 'nuova-1', campo_futuro: 'x' };
  assert.deepEqual(fondiArchivio([], [extra]).righe[0], extra);
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

// --- Il ritmo misurato, e la stima che ne discende ---------------------------
//
// Perche' esistono. `stimaImpegno()` stimava i minuti dalla media grezza dei
// tempi di risposta, e quella media ha due difetti misurati sull'unico archivio
// disponibile (2.100 risposte, settembre 2026): **31 risposte su 2.100** oltre i
// due minuti — una lasciata aperta 17,9 minuti — spostano la media da 14,9 a
// 20,2 secondi, il 36%; e il tempo di risposta non e' la durata dell'attivita',
// perche' non contiene la lettura del riscontro (il divario misurato e' del 14%).
//
// `ritmo()` misura invece l'intervallo fra due risposte consecutive, che e' il
// tempo per domanda **all'orologio**, e ne prende la **mediana fra sessioni**:
// robusta per costruzione, senza nessuna soglia da tarare.

/** n risposte a passo costante di `sec` secondi, dentro una sessione sola. */
function sessioneFinta(uid, n, sec, da = '2026-09-10T10:00:00+02:00') {
  const t0 = new Date(da).getTime();
  return Array.from({ length: n }, (_, i) => ({
    _t: 'q', uid: `${uid}-${i}`, item_id: `base-${uid}-${i}`, kind: 'base',
    mode: 'batteria', sim_uid: uid, correct: 1, ms: 12000,
    ts: new Date(t0 + i * sec * 1000).toISOString(),
  }));
}

test('ritmo: e\' l\'intervallo fra due risposte, non il tempo di risposta', () => {
  // Passo di 30 s all'orologio, ma solo 12 s di cronometro: il ritmo e' 30.
  const r = ritmo(sessioneFinta('a', 40, 30));
  assert.equal(Math.round(r.msPerDomanda / 1000), 30);
  assert.equal(r.fonte, 'orologio');
  assert.ok(r.affidabile);
});

test('ritmo: una sessione corta non e\' sottostimata (divide per n-1)', () => {
  // Cinque risposte a 20 s: la durata da capo a coda e' 80 s, non 100.
  // Dividendo per n il ritmo uscirebbe 16 s invece dei 20 veri.
  const r = ritmo([...sessioneFinta('a', 5, 20),
                   ...sessioneFinta('b', 5, 20, '2026-09-10T12:00:00+02:00'),
                   ...sessioneFinta('c', 40, 20, '2026-09-10T14:00:00+02:00')]);
  assert.equal(Math.round(r.msPerDomanda / 1000), 20);
});

test('ritmo: una sessione in cui ti sei alzato dal tavolo non sposta la mediana', () => {
  const normali = [
    ...sessioneFinta('a', 15, 20),
    ...sessioneFinta('b', 15, 20, '2026-09-10T12:00:00+02:00'),
    ...sessioneFinta('c', 15, 20, '2026-09-10T14:00:00+02:00'),
  ];
  const conPausa = sessioneFinta('d', 15, 20, '2026-09-10T16:00:00+02:00');
  // L'ultima risposta arriva dieci minuti dopo: dentro la soglia di sessione.
  conPausa[14].ts = new Date(new Date(conPausa[13].ts).getTime() + 600000).toISOString();
  const senza = ritmo(normali), con = ritmo([...normali, ...conPausa]);
  assert.equal(Math.round(senza.msPerDomanda / 1000), 20);
  assert.equal(Math.round(con.msPerDomanda / 1000), 20,
    'la mediana fra sessioni non deve seguire la sessione anomala');
});

test('ritmo: sotto la soglia di risposte non si dichiara affidabile', () => {
  const r = ritmo(sessioneFinta('a', 10, 20));
  assert.ok(!r.affidabile, '10 risposte non bastano');
  assert.equal(r.risposte, 10);
  const vuoto = ritmo([]);
  assert.ok(!vuoto.affidabile);
  assert.equal(vuoto.msPerDomanda, null, 'senza dati non si inventa un numero');
});

test('stimaImpegno: con il ritmo misurato usa l\'orologio e lo dichiara', () => {
  const prog = {}; for (let i = 0; i < 40; i++) prog['q' + i] = { n: 1, avg: 12000 };
  const cronometro = stimaImpegno(prog, 100, 10);
  assert.equal(cronometro.fonte, 'cronometro');
  const orologio = stimaImpegno(prog, 100, 10, { msPerDomanda: 30000 });
  assert.equal(orologio.fonte, 'orologio');
  assert.ok(orologio.minutiTotali > cronometro.minutiTotali,
    'l\'orologio include la lettura del riscontro, quindi stima di piu\'');
});

test('stimaImpegno: l\'orologio ha la precedenza sul cronometro, e il cronometro sul ripiego', () => {
  const prog = {}; for (let i = 0; i < 40; i++) prog['q' + i] = { n: 1, avg: 12000 };
  assert.equal(stimaImpegno(prog, 100, 10, { msPerDomanda: 30000 }).fonte, 'orologio');
  assert.equal(stimaImpegno(prog, 100, 10).fonte, 'cronometro');
  assert.equal(stimaImpegno({}, 100, 10, {}).fonte, 'ripiego');
  // Un ritmo non affidabile non scavalca il cronometro: si passa solo se c'e'
  // una misura, non se c'e' un campo.
  assert.equal(stimaImpegno(prog, 100, 10, { msPerDomanda: null }).fonte, 'cronometro');
});

test('stimaImpegno: senza dati dichiara il ripiego, come prima', () => {
  const s = stimaImpegno({}, 100, 10);
  assert.equal(s.fonte, 'ripiego');
  assert.equal(s.mediaMs, RIPIEGO_MS);
  assert.ok(!s.affidabile);
});

// --- Gli errori di una sessione sola ----------------------------------------
//
// Serve a chiudere il ciclo di un'attivita': dopo un riepilogo con tre errori,
// «rifai questi tre» deve aprire esattamente quei tre, non mescolarli con gli
// errori di sempre. Le righe portano gia' il legame (`sim_uid`); quando non ce
// l'hanno il confine e' ricostruito, e la funzione **lo dichiara** invece di
// far finta che sia lo stesso.

test('erroriSessione: apre esattamente gli errori di quella lista', () => {
  const righe = sessioneFinta('a', 6, 20);
  righe[1].correct = 0; righe[4].correct = 0;
  const altra = sessioneFinta('b', 5, 20, '2026-09-10T12:00:00+02:00');
  altra.forEach((r) => { r.correct = 0; });
  const items = [...righe, ...altra].map((r) => ({ id: r.item_id, k: 'base' }));
  const e = erroriSessione([...righe, ...altra], items, 'a');
  assert.deepEqual(e.lista.map((x) => x.id), [righe[1].item_id, righe[4].item_id]);
  assert.equal(e.fonte, 'sim_uid', 'il confine qui e\' registrato');
});

test('erroriSessione: il conteggio promesso e la lista coincidono', () => {
  const righe = sessioneFinta('a', 20, 20);
  [2, 7, 11].forEach((i) => { righe[i].correct = 0; });
  const items = righe.map((r) => ({ id: r.item_id, k: 'base' }));
  const e = erroriSessione(righe, items, 'a');
  assert.equal(e.quanti, 3);
  assert.equal(e.lista.length, e.quanti);
});

test('erroriSessione: un confine ricostruito si dichiara', () => {
  const righe = sessioneFinta('a', 6, 20).map((r) => ({ ...r, sim_uid: null }));
  righe[1].correct = 0;
  const items = righe.map((r) => ({ id: r.item_id, k: 'base' }));
  const s = sessioni(righe);
  const e = erroriSessione(righe, items, s[0].id);
  assert.equal(e.fonte, 'risposte', 'senza sim_uid la fonte non puo\' dirsi registrata');
  assert.equal(e.lista.length, 1);
});

test('erroriSessione: una sessione senza errori non apre niente, e lo dice', () => {
  const righe = sessioneFinta('a', 10, 20);
  const items = righe.map((r) => ({ id: r.item_id, k: 'base' }));
  const e = erroriSessione(righe, items, 'a');
  assert.equal(e.quanti, 0);
  assert.deepEqual(e.lista, []);
});

test('erroriSessione: un quesito che ricompare apre una sessione nuova, e resta fuori', () => {
  // Nessuna selezione ripete un quesito dentro la stessa lista: un doppione e'
  // per forza una lista nuova, ed e' una delle quattro regole di `sessioni()`.
  const righe = sessioneFinta('a', 4, 20);
  righe[1].correct = 0;
  righe.push({ ...righe[1], uid: 'a-ripetuta', correct: 0,
               ts: new Date(new Date(righe[3].ts).getTime() + 20000).toISOString() });
  const items = righe.map((r) => ({ id: r.item_id, k: 'base' }));
  assert.equal(sessioni(righe).length, 2, 'il doppione taglia la sessione');
  // Dal 26 settembre 2026 (P-30) erroriSessione() legge il confine
  // dell'attivita': lo stesso `sim_uid` con un doppione non e' una lista che il
  // runner possa scrivere, quindi l'id e' ambiguo e non si riapre niente. Prima
  // restituiva la prima meta' e basta. L'errore della seconda lista resta fuori
  // lo stesso.
  const e = erroriSessione(righe, items, 'a');
  assert.equal(e.ambigua, true);
  assert.deepEqual(e.motivi, ['quesito ripetuto']);
  assert.deepEqual(e.lista, []);
  // Senza legame, dove la regola del doppione fa il lavoro vero, la prima lista
  // porta il suo errore e non quello della seconda, come prima.
  const libere = righe.map((r) => ({ ...r, sim_uid: null }));
  const [seconda, prima] = sessioni(libere, { confine: 'attivita' });
  assert.equal(prima.n, 4); assert.equal(seconda.n, 1);
  const ep = erroriSessione(libere, items, prima.id);
  assert.equal(ep.lista.length, 1, 'la prima lista porta il suo errore, non quello della seconda');
  assert.equal(ep.fonte, 'risposte');
});

// --- Il confine dell'attivita' (P-30) ----------------------------------------
//
// Trovato dal progetto dell'area 3 (docs/area-3-progetto.md §10.1) e
// riprodotto dalla regia: tre risposte con lo stesso `sim_uid`, la terza dopo
// 21 minuti, due sbagliate. Il confine per pausa le spezzava in due gruppi con
// lo **stesso id**, ed `erroriSessione()` restituiva un errore su due
// dichiarando `fonte: 'sim_uid'` — il confine registrato, proprio mentre lo
// tagliava. I cinque test qui sopra passavano perche' nessuno esercitava una
// pausa: il conteggio restava coerente con la lista sbagliata.

/** Il caso esatto del §10.1: 10:00:00, 10:01:00, 10:22:01, sbagliata/giusta/sbagliata. */
function attivitaConPausa(simUid = 'attivita') {
  return [['10:00:00', 0], ['10:01:00', 1], ['10:22:01', 0]].map(([ora, ok], i) => ({
    _t: 'q', uid: `${simUid}-${i}`, item_id: `base-${simUid}-${i}`, kind: 'base',
    mode: 'argomento', sim_uid: simUid, correct: ok, ms: 9000,
    ts: `2026-09-26T${ora}+02:00`,
  }));
}
const bancaDi = (righe) => righe.map((r) => ({ id: r.item_id, k: r.kind }));

test('erroriSessione: un attivita registrata resta intera oltre la pausa', () => {
  const righe = attivitaConPausa();
  const e = erroriSessione(righe, bancaDi(righe), 'attivita');
  assert.equal(e.quanti, 2, 'due errori nell\'attivita, non uno');
  assert.deepEqual(e.lista.map((x) => x.id), [righe[0].item_id, righe[2].item_id],
    'nell\'ordine in cui sono usciti');
  assert.equal(e.fonte, 'sim_uid');
  assert.equal(e.ambigua, false);
  const ss = sessioni(righe, { confine: 'attivita' });
  assert.equal(ss.length, 1, 'una attivita, un gruppo');
  assert.equal(ss[0].id, 'attivita');
  assert.equal(ss[0].n, 3); assert.equal(ss[0].esatte, 1);
  assert.equal(ss[0].durata, 22 * 60000 + 1000, 'da capo a coda, pausa compresa');
  assert.deepEqual(ss[0].righe.map((r) => r.uid), righe.map((r) => r.uid));
});

test('sessioni: il confine per pausa resta quello di prima, e ritmo lo usa', () => {
  // Il raggruppamento predefinito non cambia: ritmo() misura il passo fra due
  // risposte, e una pausa di 21 minuti dentro una sessione lo falserebbe.
  const righe = attivitaConPausa();
  const ss = sessioni(righe);
  assert.equal(ss.length, 2, 'senza opzione la pausa taglia ancora');
  assert.deepEqual(ss.map((s) => s.n), [1, 2], 'la piu recente per prima');
  assert.equal(ritmo(righe).msPerDomanda, 60000,
    'il ritmo e\' il minuto fra le prime due, non la pausa divisa per due');
  assert.equal(ritmo(righe).sessioni, 1);
});

// --- P-16: l'orologio che non c'e' -------------------------------------------
//
// Il collaudo di P-05 (docs/area-2-collaudo-ux.md, «Trovato e contatto con la
// regia») ha riprodotto trenta righe con `sim_uid` e `ms` ma senza `ts` per cui
// `ritmo()` diceva `affidabile: true` e `fonte: 'orologio'`: `sessioni()`
// ripiegava sulla somma dei tempi di risposta quando non poteva misurare da
// capo a coda, e `ritmo()` prendeva quel cronometro per un orologio. Il Quiz se
// ne difendeva filtrando le righe con `ts`; il Percorso no.

/** n righe della stessa lista, con i tempi di risposta e senza data. */
function senzaOrologio(uid, n, ts) {
  return Array.from({ length: n }, (_, i) => ({
    _t: 'q', uid: `${uid}-${i}`, item_id: `base-${uid}-${i}`, kind: 'base',
    mode: 'argomento', sim_uid: uid, correct: 1, ms: 12000,
    ...(ts === undefined ? {} : { ts }),
  }));
}

test('ritmo: senza orologio non dice orologio', () => {
  for (const [caso, ts] of [['senza ts', undefined], ['ts che non e una data', 'boh'], ['ts vuoto', '']]) {
    const r = ritmo(senzaOrologio('p05', 30, ts));
    assert.equal(r.affidabile, false, `${caso}: trenta tempi di risposta non sono un orologio`);
    assert.equal(r.msPerDomanda, null, `${caso}: niente da misurare, niente numero`);
    assert.equal(r.sessioni, 0, `${caso}: nessuna sessione misurata all'orologio`);
    assert.equal(r.misurate, 0, `${caso}: nessuna risposta misurata`);
    assert.equal(r.risposte, 30, `${caso}: le risposte viste restano contate`);
  }
});

test('ritmo: il chiamante non deve filtrare le righe senza data', () => {
  // La difesa del Quiz in pagina (solo righe con ts leggibile) diventa inutile:
  // con o senza, il motore da' lo stesso ritmo.
  const tutte = [...sessioneFinta('a', 40, 30), ...senzaOrologio('p05', 30)];
  const conData = tutte.filter((r) => Number.isFinite(Date.parse(r.ts)));
  const a = ritmo(tutte), b = ritmo(conData);
  assert.equal(a.msPerDomanda, b.msPerDomanda);
  assert.equal(a.affidabile, b.affidabile);
  assert.equal(a.sessioni, b.sessioni);
  assert.equal(a.misurate, b.misurate);
  assert.equal(Math.round(a.msPerDomanda / 1000), 30, 'il passo vero, non i 12 s del cronometro');
});

test('ritmo: la soglia conta le risposte misurate, non quelle viste', () => {
  // Due risposte all'orologio non diventano affidabili perche' accanto ce ne
  // sono ventinove senza data, ne' trenta risposte da sole in trenta liste:
  // una risposta sola non ha un intervallo.
  const poche = [...sessioneFinta('a', 2, 30), ...senzaOrologio('p05', 29)];
  const r = ritmo(poche);
  assert.equal(r.misurate, 2);
  assert.equal(r.risposte, 31);
  assert.equal(r.affidabile, false, '2 risposte misurate non bastano, anche se ne ho viste 31');
  const sole = Array.from({ length: 30 }, (_, i) =>
    sessioneFinta('s' + i, 1, 30, `2026-09-1${i % 9}T${String(8 + (i % 12)).padStart(2, '0')}:00:00+02:00`)).flat();
  const s = ritmo([...sole, ...sessioneFinta('b', 2, 30, '2026-09-20T10:00:00+02:00')]);
  assert.equal(s.sessioni, 1);
  assert.equal(s.misurate, 2);
  assert.equal(s.affidabile, false, 'trenta risposte isolate non misurano un passo');
  assert.equal(ritmo(sessioneFinta('c', 30, 20)).affidabile, true, 'trenta risposte di seguito si');
});

test('sessioni: senza orologio la durata non si inventa', () => {
  const [s] = sessioni(senzaOrologio('p05', 30));
  assert.equal(s.n, 30);
  assert.equal(s.ms, 360000, 'la somma dei tempi di risposta resta in ms');
  assert.equal(s.durata, null, 'da capo a coda non si sa: non e\' la somma dei tempi');
  // Un gruppo con righe senza data in testa e righe datate dopo: da capo a
  // coda non si misura nemmeno qui, perche' il capo non ha un'ora.
  const misto = [...senzaOrologio('m', 3), ...sessioneFinta('m', 3, 30)]
    .map((r, i) => ({ ...r, uid: 'm' + i, item_id: 'base-m' + i, sim_uid: null, mode: 'argomento' }));
  const gruppi = sessioni(misto);
  assert.equal(gruppi.length, 1, JSON.stringify(gruppi.map((g) => g.n)));
  assert.equal(gruppi[0].durata, null);
  assert.equal(sessioni(misto, { confine: 'attivita' })[0].durata, null);
  // Con l'orologio, come prima.
  assert.equal(sessioni(sessioneFinta('a', 5, 20))[0].durata, 80000);
});

test('sessioni: con confine attivita ogni id e unico e le attivita non si mescolano', () => {
  // Due attivita' intrecciate nel tempo (due schede aperte), poi una riprova
  // degli errori della prima con un'identita' nuova, come fa il runner.
  const a = attivitaConPausa('a');
  const b = [0, 1, 2].map((i) => ({
    _t: 'q', uid: `b-${i}`, item_id: `base-b-${i}`, kind: 'base', mode: 'mirata',
    sim_uid: 'b', correct: 0, ms: 9000, ts: `2026-09-26T10:0${i}:30+02:00`,
  }));
  const riprova = [a[0], a[2]].map((r, i) => ({
    ...r, uid: `rp-${i}`, sim_uid: 'riprova', mode: 'sbagliate', correct: 1,
    ts: `2026-09-26T10:3${i}:00+02:00`,
  }));
  const righe = [...a, ...b, ...riprova];
  const banca = [...bancaDi(a), ...bancaDi(b)];
  const ss = sessioni(righe, { confine: 'attivita' });
  const ids = ss.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'nessun id compare due volte: ' + ids);
  assert.deepEqual([...ids].sort(), ['a', 'b', 'riprova']);
  for (const s of ss) assert.ok(s.righe.every((r) => r.sim_uid === s.id), s.id + ' porta solo le sue righe');
  assert.deepEqual(erroriSessione(righe, banca, 'a').lista.map((x) => x.id), [a[0].item_id, a[2].item_id],
    'la riprova, tutta giusta, non tocca gli errori dell\'attivita di partenza');
  assert.equal(erroriSessione(righe, banca, 'b').quanti, 3);
  assert.equal(erroriSessione(righe, banca, 'riprova').quanti, 0);
  assert.ok(sessioni(righe).length > ss.length, 'col confine per pausa gli intrecci spezzano ancora');
});

test('sessioni: un confine ricostruito e lo stesso nei due regimi, e si dichiara', () => {
  const righe = attivitaConPausa().map((r) => ({ ...r, sim_uid: null }));
  const pausa = sessioni(righe), att = sessioni(righe, { confine: 'attivita' });
  assert.deepEqual(att.map((s) => [s.id, s.n, s.fonte]), pausa.map((s) => [s.id, s.n, s.fonte]),
    'senza legame registrato non c\'e\' niente da ricucire: si ricostruisce come prima');
  assert.ok(att.every((s) => s.fonte === 'risposte'));
  const e = erroriSessione(righe, bancaDi(righe), att[1].id);
  assert.equal(e.fonte, 'risposte', 'dichiarato, non spacciato per registrato');
  assert.equal(e.quanti, 1, 'il gruppo ricostruito prima della pausa ha il suo errore');
});

test('sessioni: un id riusato con un quesito ripetuto o un altra modalita e ambiguo', () => {
  // Un `sim_uid` nasce a ogni avvio e nessuna selezione ripete un quesito: un
  // id che raccoglie un doppione, due modalita' o due banche non e' un'attivita'
  // integra — viene da un archivio fuso male o da un uid riusato. Non si
  // risolve prendendo il primo gruppo: si dice.
  const doppione = attivitaConPausa();
  doppione.push({ ...doppione[0], uid: 'dup', ts: '2026-09-26T10:23:00+02:00' });
  const altraModalita = attivitaConPausa();
  altraModalita[2] = { ...altraModalita[2], mode: 'mirata' };
  const altraBanca = attivitaConPausa();
  altraBanca[1] = { ...altraBanca[1], kind: 'vela' };
  for (const [righe, motivo] of [[doppione, 'quesito ripetuto'],
    [altraModalita, 'modalità diverse'], [altraBanca, 'banca diversa']]) {
    const [s] = sessioni(righe, { confine: 'attivita' });
    assert.equal(s.ambigua, true, motivo);
    assert.deepEqual(s.motivi, [motivo]);
    const e = erroriSessione(righe, bancaDi(righe), 'attivita');
    assert.equal(e.trovata, true);
    assert.equal(e.ambigua, true, motivo);
    assert.deepEqual(e.lista, [], 'nessuna lista da aprire per un\'attivita che non si puo verificare');
    assert.equal(e.quanti, null, 'non «zero errori»: non si sa');
  }
  assert.equal(sessioni(attivitaConPausa(), { confine: 'attivita' })[0].ambigua, false);
});

test('erroriSessione: un errore su un quesito che la banca non ha si nomina', () => {
  const righe = attivitaConPausa();
  const banca = bancaDi(righe).filter((it) => it.id !== righe[2].item_id);
  const e = erroriSessione(righe, banca, 'attivita');
  assert.equal(e.quanti, 1);
  assert.deepEqual(e.mancanti, [righe[2].item_id],
    'due errori, uno solo riapribile: la differenza si dice invece di sparire');
});

test('sessioni: un confine sconosciuto e un errore, non un ripiego', () => {
  const righe = attivitaConPausa();
  // Un'opzione ignorata e' il guasto muto: «attività» con l'accento
  // tornerebbe in silenzio al confine per pausa.
  assert.throws(() => sessioni(righe, { confine: 'attività' }), /confine/);
  assert.throws(() => erroriSessione(righe, bancaDi(righe), 'attivita', { confine: 'pausa' }), /confine/);
});


/* --- sw.js: si toglie di mezzo (ADR-005) ----------------------------------- */

// Fino al 3 ottobre 2026 qui c'erano i test delle figure che sopravvivevano a
// un rilascio (R-ARCH-10, R-ARCH-11): il sw.js di allora teneva una cache per
// rilascio e ci portava avanti le figure. L'ADR-005 ha tolto l'offline. Il
// sw.js di oggi resta pubblicato per chi ha installato quello della 0.29.0: lo
// sostituisce, cancella le cache del sito e si disinstalla, senza forzare la
// ricarica delle pagine aperte — senza account una ricarica perde le risposte.
//
// Qui sw.js si esegue com'e' pubblicato, contro una Cache Storage finta che
// contiene quello che la 0.29.0 lascia, con un registro di tutto quello che il
// service worker chiede al browser.

const ORIGINE = 'https://rottagiusta.it';

function cacheStorageFinta(registro) {
  const cache = new Map();                               // nome -> Map(url -> corpo)
  return {
    cache,
    api: {
      async open(nome) { registro.push('caches.open ' + nome); return {}; },
      async keys() { return [...cache.keys()]; },
      async delete(nome) { registro.push('caches.delete ' + nome); return cache.delete(nome); },
      async has(nome) { return cache.has(nome); },
      async match() { registro.push('caches.match'); return undefined; },
    },
  };
}

/** Quello che la 0.29.0 lascia: la sua cache con il guscio e le figure, e una cache estranea dello stesso sito. */
function dopoLaVersioneDiPrima(cs) {
  cs.cache.set('rg-0.29.0', new Map([[ORIGINE + '/app', 'app'], [ORIGINE + '/dati/quiz.json', 'quiz'], [ORIGINE + '/figure/figura-001.png', 'png']]));
  cs.cache.set('rg-0.28.1', new Map([[ORIGINE + '/app', 'app']]));
}

async function eseguiServiceWorker(cs, registro, { cancellazioneFallita = false } = {}) {
  const { readFile } = await import('node:fs/promises');
  const vm = await import('node:vm');
  const codice = await readFile(new URL('../site/sw.js', import.meta.url), 'utf8');
  const gestori = {};
  const api = cancellazioneFallita ? { ...cs.api, delete: async (n) => { registro.push('caches.delete ' + n); throw new Error('non si cancella'); } } : cs.api;
  const self = {
    addEventListener: (tipo, f) => { registro.push('ascolta ' + tipo); gestori[tipo] = f; },
    skipWaiting: async () => { registro.push('skipWaiting'); },
    clients: {
      claim: async () => { registro.push('clients.claim'); },
      matchAll: async () => { registro.push('clients.matchAll'); return [{ navigate: async () => registro.push('client.navigate') }]; },
    },
    registration: { unregister: async () => { registro.push('unregister'); return true; } },
    location: { origin: ORIGINE },
  };
  const fetch = async () => { registro.push('fetch'); throw new Error('nessuna rete nel test'); };
  vm.runInNewContext(codice, { self, caches: api, fetch, URL, Response, Promise });
  const evento = async (tipo) => {
    const attese = [];
    if (!gestori[tipo]) return;
    gestori[tipo]({ waitUntil: (p) => attese.push(p) });
    await Promise.allSettled(attese);
  };
  await evento('install');
  await evento('activate');
  return gestori;
}

test('sw.js: si toglie di mezzo — cancella le cache del sito e si disinstalla', async () => {
  const registro = [];
  const cs = cacheStorageFinta(registro);
  dopoLaVersioneDiPrima(cs);
  await eseguiServiceWorker(cs, registro);
  assert.deepEqual([...cs.cache.keys()], [], `dopo l'activate restano delle cache: ${[...cs.cache.keys()]}`);
  assert.ok(registro.includes('skipWaiting'), 'l\'install non salta l\'attesa: la cache vecchia servirebbe ancora le schede aperte');
  assert.ok(registro.includes('unregister'), 'il service worker non si disinstalla');
  const ultima = Math.max(...registro.map((x, i) => (x.startsWith('caches.delete') ? i : -1)));
  assert.ok(registro.indexOf('unregister') > ultima, `si disinstalla prima di aver cancellato le cache: ${registro.join(', ')}`);
});

test('sw.js: non forza la ricarica, non serve niente, non apre una cache', async () => {
  // Senza account una ricarica perde le risposte della pagina aperta: niente
  // clients.claim(), niente navigate(). Senza un gestore di fetch ogni
  // richiesta va in rete dal momento in cui si attiva; e una cache aperta,
  // anche vuota, sarebbe di nuovo una cache «rg-» nel browser.
  const registro = [];
  const cs = cacheStorageFinta(registro);
  dopoLaVersioneDiPrima(cs);
  const gestori = await eseguiServiceWorker(cs, registro);
  for (const vietato of ['clients.claim', 'clients.matchAll', 'client.navigate', 'fetch', 'caches.match'])
    assert.ok(!registro.includes(vietato), `sw.js chiama ${vietato}: ${registro.join(', ')}`);
  assert.ok(!registro.some((x) => x.startsWith('caches.open')), `sw.js apre una cache: ${registro.join(', ')}`);
  assert.deepEqual(Object.keys(gestori).sort(), ['activate', 'install'], `sw.js ascolta altro: ${Object.keys(gestori)}`);
});

test('sw.js: se una cache non si cancella, si disinstalla lo stesso', async () => {
  const registro = [];
  const cs = cacheStorageFinta(registro);
  dopoLaVersioneDiPrima(cs);
  await eseguiServiceWorker(cs, registro, { cancellazioneFallita: true });
  assert.ok(registro.includes('unregister'), 'una cancellazione fallita lascia il service worker installato, e la cache vecchia servirebbe ancora');
});

// --- la coda verso il server degli account ----------------------------------------
//
// docs/account-progetto.md §1, §2.7, §8, §16.1. Quali righe inviare, che cosa
// togliere dopo una risposta, il 409 della generazione, e l'epoca del database
// che cambia dopo un ripristino. E' logica pura e sta nel motore: in `app.html`
// nessun test arriva, e la regola 3 del §1 — «salvato» solo dopo la conferma
// per `uid` — e' la correzione della 0.4.6, dove `filter` sulla coda corrente
// buttava le risposte date durante l'invio.

const rq = (n, extra = {}) => ({
  _t: 'q', uid: `r${String(n).padStart(5, '0')}`, item_id: `base-${n}`,
  ts: '2026-10-01T10:00:00+02:00', ms: 9000, correct: 1, ...extra,
});
const EPOCA_A = 'a'.repeat(32);
const EPOCA_B = 'b'.repeat(32);
const ok200 = (corpo) => ({ codice: 200, corpo });

test('coda: dopo un invio si tolgono solo gli uid che il server nomina, non tutto tranne gli scartati', () => {
  // R-ACC-13. La forma della 0.4.6: una risposta data mentre l'invio era in
  // volo non e' fra le rifiutate, e «tutto tranne le rifiutate» la buttava.
  const righe = [rq(1), rq(2), rq(3)];
  let c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe });
  const lotto = E.lottoDaInviare(righe, c);
  assert.deepEqual(lotto.righe.map((r) => r.uid), ['r00001', 'r00002', 'r00003']);
  assert.equal(lotto.generazione, 1);

  // Mentre l'invio e' in volo arriva una risposta nuova.
  righe.push(rq(4));
  c = E.accoda(c, 'r00004');
  const esito = E.dopoInvio(c, lotto, ok200({
    nuove: ['r00001'], gia: ['r00002'], scartate: [{ uid: 'r00003', motivo: 'quesito sconosciuto', indice: 2 }],
    ultima_seq: 99, epoca: EPOCA_A, generazione: 1,
  }), righe);
  assert.deepEqual(esito.coda.daInviare, ['r00004'], 'la risposta data durante l invio resta da inviare');
  assert.deepEqual(esito.salvate, ['r00001', 'r00002']);
  assert.deepEqual(esito.coda.scartate, { r00003: 'quesito sconosciuto' });
  assert.equal(esito.conflitto, null);

  // E una riga del lotto che il server non nomina affatto resta da inviare:
  // tolta solo per conferma, mai per deduzione.
  const c2 = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe: [rq(1), rq(2)] });
  const l2 = E.lottoDaInviare([rq(1), rq(2)], c2);
  const e2 = E.dopoInvio(c2, l2, ok200({ nuove: ['r00001'], gia: [], scartate: [], epoca: EPOCA_A, generazione: 1 }), [rq(1), rq(2)]);
  assert.deepEqual(e2.coda.daInviare, ['r00002']);
});

test('coda: un invio fallito, rifiutato o senza risposta non toglie niente', () => {
  const righe = [rq(1), rq(2)];
  const c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe });
  const lotto = E.lottoDaInviare(righe, c);
  for (const risposta of [{ codice: 0 }, { codice: 401, corpo: { errore: 'sessione' } }, { codice: 413 },
    { codice: 500, corpo: { errore: 'interno' } }, { codice: 503 }, { codice: 200 }, { codice: 200, corpo: {} }]) {
    const e = E.dopoInvio(c, lotto, risposta, righe);
    assert.deepEqual(e.coda.daInviare, ['r00001', 'r00002'], `codice ${risposta.codice}`);
    assert.deepEqual(e.salvate, []);
  }
});

test('coda: le scartate escono dalla coda con il motivo, e non si rimandano in silenzio', () => {
  // §8.1: restano nell'archivio, visibili con il motivo, e non si ritentano
  // all'infinito. Una riga con un uid che non e' una stringa torna dal server
  // con `uid: null`: la si riconosce dalla sua posizione nel lotto.
  const righe = [rq(1), { ...rq(2), uid: 12345 }, rq(3)];
  const c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe });
  const lotto = E.lottoDaInviare(righe, c);
  const e = E.dopoInvio(c, lotto, ok200({
    nuove: ['r00001', 'r00003'], gia: [], scartate: [{ uid: null, motivo: 'senza uid', indice: 1 }],
    epoca: EPOCA_A, generazione: 1,
  }), righe);
  assert.deepEqual(e.coda.daInviare, []);
  assert.deepEqual(e.coda.scartate, { 12345: 'senza uid' });
  assert.deepEqual(e.scartate, [{ uid: '12345', motivo: 'senza uid' }]);
  assert.equal(E.lottoDaInviare(righe, e.coda), null, 'niente da inviare: la scartata non riparte');
});

test('coda: il lotto sta sotto 2000 righe e 2 MiB, e il resto parte al giro dopo', () => {
  // I limiti sono quelli del server (§7.2): lo stesso numero, dallo stesso
  // file, perche' il server lo importa da qui.
  assert.equal(E.INVIO_MAX_RIGHE, 2000);
  assert.equal(E.INVIO_MAX_BYTE, 2 * 1024 * 1024);
  const molte = Array.from({ length: 2500 }, (_, i) => rq(i));
  let c = E.nuovaCoda({ generazione: 3, epocaDb: EPOCA_A, righe: molte });
  const primo = E.lottoDaInviare(molte, c);
  assert.equal(primo.righe.length, 2000);
  const e = E.dopoInvio(c, primo, ok200({ nuove: primo.righe.map((r) => r.uid), gia: [], scartate: [], epoca: EPOCA_A, generazione: 3 }), molte);
  const secondo = E.lottoDaInviare(molte, e.coda);
  assert.equal(secondo.righe.length, 500);
  assert.equal(secondo.righe[0].uid, rq(2000).uid, 'nell ordine dell archivio, senza saltarne');

  // Righe grosse: comanda il peso. Il corpo che si spedisce sta nei 2 MiB.
  const grosse = Array.from({ length: 900 }, (_, i) => rq(i, { input_json: 'x'.repeat(3500) }));
  c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe: grosse });
  const l = E.lottoDaInviare(grosse, c);
  const peso = new TextEncoder().encode(JSON.stringify(l)).length;
  assert.ok(peso <= E.INVIO_MAX_BYTE, `${peso} byte`);
  assert.ok(l.righe.length > 500 && l.righe.length < 900, `${l.righe.length} righe`);

  // E un uid nella coda due volte parte una volta sola.
  c = E.accoda(E.accoda(E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A }), 'r00001'), 'r00001');
  assert.deepEqual(c.daInviare, ['r00001']);
  assert.equal(E.lottoDaInviare([rq(1), rq(1)], c).righe.length, 1);
});

test('coda: l invio non sposta il cursore, lo sposta solo la ricezione', () => {
  // `ultima_seq` di un invio e' l'ultima riga dell'account, comprese quelle di
  // un altro dispositivo arrivate intanto: un cursore spostato li' le
  // salterebbe per sempre, senza un errore. E' il cursore su `ts` del §2.3 per
  // un'altra strada.
  const righe = [rq(1)];
  const c = { ...E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe }), cursore: 40 };
  const e = E.dopoInvio(c, E.lottoDaInviare(righe, c), ok200({ nuove: ['r00001'], gia: [], scartate: [], ultima_seq: 57, epoca: EPOCA_A, generazione: 1 }), righe);
  assert.equal(e.coda.cursore, 40);
});

test('coda: la ricezione avanza il cursore, continua finche ci sono altre, e toglie dalla coda cio che arriva', () => {
  const locali = [rq(1), rq(2)];
  let c = { ...E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe: locali }), cursore: 10 };
  const r = E.dopoRicezione(c, ok200({ righe: [rq(2), rq(7)], ultima_seq: 25, altre: true, epoca: EPOCA_A, generazione: 1 }), locali);
  assert.deepEqual(r.righe.map((x) => x.uid), ['r00002', 'r00007']);
  assert.equal(r.coda.cursore, 25);
  assert.equal(r.continua, true);
  // r00002 e' arrivata dal server, quindi e' sul server: un'altra scheda l'ha
  // gia' inviata, e rimandarla non serve.
  assert.deepEqual(r.coda.daInviare, ['r00001']);

  const fine = E.dopoRicezione(r.coda, ok200({ righe: [], ultima_seq: 25, altre: false, epoca: EPOCA_A, generazione: 1 }), locali);
  assert.equal(fine.continua, false);
  assert.equal(fine.coda.cursore, 25);

  // Senza una risposta buona il cursore non si muove e niente entra.
  for (const risposta of [{ codice: 0 }, { codice: 401 }, { codice: 200, corpo: { righe: 'no' } }]) {
    const x = E.dopoRicezione(c, risposta, locali);
    assert.equal(x.coda.cursore, 10);
    assert.deepEqual(x.righe, []);
    assert.equal(x.continua, false);
  }
});

test('coda: il 409 non rimanda e non butta, e dice quante risposte non sono salvate', () => {
  // R-ACC-15, la meta' del client (§8.4). Il telefono rimasto nel cassetto
  // dopo un azzeramento fatto altrove: le sue righe non ripartono — sarebbe una
  // cancellazione che non cancella — e non spariscono — sarebbe una perdita
  // scoperta dopo. Decide chi studia: scaricarle o scartarle.
  const righe = [rq(1), rq(2), rq(3)];
  const c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe });
  const lotto = E.lottoDaInviare(righe, c);
  const e = E.dopoInvio(c, lotto, { codice: 409, corpo: {
    errore: 'generazione', generazione: 2, azzerato_il: '2026-10-12T09:00:00.000Z', epoca: EPOCA_A,
  } }, righe);
  assert.deepEqual(e.coda, c, 'la coda resta com era');
  assert.deepEqual(e.salvate, []);
  assert.deepEqual(e.conflitto, { generazione: 2, azzerato_il: '2026-10-12T09:00:00.000Z', epocaDb: EPOCA_A, nonSalvate: 3 });
  assert.equal(E.lottoDaInviare(righe, e.coda).generazione, 1, 'finche non si sceglie, si resta alla generazione di prima');

  // Scelto: si riparte dalla generazione nuova, dall'inizio, senza niente da
  // inviare — la pagina svuota l'archivio locale e riceve tutto.
  const nuova = E.risolviConflitto(e.coda, e.conflitto);
  assert.deepEqual(nuova, { generazione: 2, epocaDb: EPOCA_A, cursore: 0, daInviare: [], scartate: {} });
});

test('coda: una ricezione con un altra generazione e un conflitto, e le sue righe non entrano', () => {
  const locali = [rq(1)];
  const c = { ...E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe: locali }), cursore: 12 };
  const r = E.dopoRicezione(c, ok200({ righe: [rq(9)], ultima_seq: 30, altre: false, epoca: EPOCA_A, generazione: 2, azzerato_il: '2026-10-12T09:00:00.000Z' }), locali);
  assert.deepEqual(r.righe, []);
  assert.deepEqual(r.coda, c);
  assert.equal(r.continua, false);
  assert.deepEqual(r.conflitto, { generazione: 2, azzerato_il: '2026-10-12T09:00:00.000Z', epocaDb: EPOCA_A, nonSalvate: 1 });
});

test('coda: se l epoca del database cambia, il cursore torna a zero e si rimanda tutto', () => {
  // R-ACC-24, la meta' del client (§2.7). Dopo il ripristino di una copia il
  // server ha perso le righe accolte dopo la copia, e i client le hanno gia'
  // tolte dalla coda; e il cursore riparte dalla copia, quindi le righe nuove
  // prendono numeri gia' visti. Chi vede cambiare l'epoca azzera il cursore e
  // rimanda tutto quello che ha: l'unione per `uid` rende il rinvio innocuo.
  const locali = [rq(1), rq(2), rq(3), rq(4)];
  const tutti = locali.map((r) => r.uid);
  const allineata = { generazione: 1, epocaDb: EPOCA_A, cursore: 1050, daInviare: [], scartate: { r00004: 'quesito sconosciuto' } };

  // Dalla ricezione.
  const r = E.dopoRicezione(allineata, ok200({ righe: [rq(2)], ultima_seq: 1003, altre: false, epoca: EPOCA_B, generazione: 1 }), locali);
  assert.equal(r.epocaCambiata, true);
  assert.equal(r.coda.epocaDb, EPOCA_B);
  assert.equal(r.coda.cursore, 0, 'il cursore vecchio salterebbe le righe nuove');
  assert.equal(r.continua, true, 'si riceve di nuovo dall inizio');
  assert.deepEqual(r.coda.daInviare, ['r00001', 'r00003'],
    'tutto, tranne quello che e appena arrivato dal server e le scartate, che verrebbero scartate di nuovo');
  assert.deepEqual(r.righe.map((x) => x.uid), ['r00002'], 'le righe arrivate valgono: stanno sul server nuovo');

  // Dall'invio: le righe del lotto che il server nomina ci sono, le altre si rimandano.
  const c = E.accoda(allineata, 'r00003');
  const lotto = E.lottoDaInviare(locali, c);
  const e = E.dopoInvio(c, lotto, ok200({ nuove: ['r00003'], gia: [], scartate: [], ultima_seq: 1001, epoca: EPOCA_B, generazione: 1 }), locali);
  assert.equal(e.epocaCambiata, true);
  assert.equal(e.coda.cursore, 0);
  assert.equal(e.coda.epocaDb, EPOCA_B);
  assert.deepEqual(e.coda.daInviare, ['r00001', 'r00002']);
  assert.deepEqual(E.lottoDaInviare(locali, e.coda).righe.map((x) => x.uid), ['r00001', 'r00002']);

  // Prima del primo contatto l'epoca non e' nota: si prende, e non e' un cambio.
  const nuova = E.nuovaCoda({ generazione: 1, righe: [] });
  assert.equal(nuova.epocaDb, null);
  const prima = E.dopoRicezione(nuova, ok200({ righe: [], ultima_seq: 0, altre: false, epoca: EPOCA_A, generazione: 1 }), []);
  assert.equal(prima.epocaCambiata, false);
  assert.equal(prima.coda.epocaDb, EPOCA_A);
  assert.ok(tutti.length === 4);
});

test('coda: chi si registra alla fine di un attivita manda tutte le sue righe', () => {
  // ADR-004, §10: le righe della pagina aperta salgono sull'account. La coda
  // nuova le ha tutte da inviare, nell'ordine dell'archivio.
  const righe = [rq(3), rq(1), rq(2)];
  const c = E.nuovaCoda({ generazione: 1, righe });
  assert.deepEqual(c, { generazione: 1, epocaDb: null, cursore: 0, daInviare: ['r00003', 'r00001', 'r00002'], scartate: {} });
});

test('coda: le funzioni non toccano quello che ricevono', () => {
  // La coda si salva accanto all'archivio: una funzione che la modificasse sul
  // posto cambierebbe lo stato salvato prima che la pagina decida di salvarlo.
  const righe = [rq(1), rq(2)];
  const c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe });
  const fotoC = JSON.stringify(c), fotoR = JSON.stringify(righe);
  const lotto = E.lottoDaInviare(righe, c);
  E.accoda(c, 'r00009');
  E.dopoInvio(c, lotto, ok200({ nuove: ['r00001'], gia: [], scartate: [{ uid: 'r00002', motivo: 'x', indice: 1 }], epoca: EPOCA_B, generazione: 1 }), righe);
  E.dopoRicezione(c, ok200({ righe: [rq(1)], ultima_seq: 5, altre: false, epoca: EPOCA_B, generazione: 1 }), righe);
  E.dopoInvio(c, lotto, { codice: 409, corpo: { generazione: 2 } }, righe);
  assert.equal(JSON.stringify(c), fotoC);
  assert.equal(JSON.stringify(righe), fotoR);
});

// --- il riepilogo di un trasferimento, e le righe che non partono ----------------
//
// docs/account-client-progetto.md §4.3, §9.1 e §12 (P-13, contatti per P-28).
// Un trasferimento e' un insieme di righe che chi studia ha chiesto di portare
// nell'account: quelle della pagina alla registrazione, quelle di un file (e,
// fino all'ADR-005, l'archivio di prima degli account). «{N} risposte
// salvate» si scrive solo quando **ogni** uid e' stato nominato dal server —
// in un invio o in una ricezione —, mai per deduzione dalla coda: misurato il 26 settembre, la
// deduzione «snapshot meno daInviare» da' per salvate le righe dopo un
// azzeramento scelto e una riga mai messa in coda.

const trasferisci = (righe, c, opt) => E.nuovoTrasferimento(c, righe, opt);

test('trasferimento: salvate solo le righe che il server nomina, anche su piu lotti', () => {
  const molte = Array.from({ length: 2500 }, (_, i) => rq(i));
  let c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe: molte });
  let { trasferimento: t, coda } = trasferisci(molte, c);
  c = coda;
  let r = E.riepilogoTrasferimento(t, c, molte);
  assert.equal(r.stato, 'in corso');
  assert.equal(r.righe, 2500);
  assert.equal(r.confermate, 0);
  assert.equal(r.daInviare, 2500);

  const primo = E.lottoDaInviare(molte, c);
  // Una risposta data mentre il primo lotto e' in volo: in coda, ma non e'
  // del trasferimento, e non ne cambia il conto.
  c = E.accoda(c, 'r99999');
  const e1 = E.dopoInvio(c, primo, ok200({ nuove: primo.righe.map((x) => x.uid), gia: [], scartate: [], epoca: EPOCA_A, generazione: 1 }), [...molte, rq(99999)]);
  t = E.registraEsito(t, e1); c = e1.coda;
  r = E.riepilogoTrasferimento(t, c, molte);
  assert.equal(r.stato, 'in corso', 'un lotto su due: non e salvato');
  assert.equal(r.confermate, 2000);
  assert.equal(r.daInviare, 500);

  // Un errore di rete non toglie e non aggiunge niente.
  const secondo = E.lottoDaInviare(molte, c);
  const rotta = E.dopoInvio(c, secondo, { codice: 0 }, molte);
  t = E.registraEsito(t, rotta);
  assert.equal(E.riepilogoTrasferimento(t, rotta.coda, molte).confermate, 2000);

  // Il secondo lotto: il server ne dice 499 nuove e una gia presente.
  const uidSecondo = secondo.righe.map((x) => x.uid).filter((u) => u !== 'r99999');
  const e2 = E.dopoInvio(c, secondo, ok200({ nuove: uidSecondo.slice(1), gia: uidSecondo.slice(0, 1), scartate: [], epoca: EPOCA_A, generazione: 1 }), molte);
  t = E.registraEsito(t, e2); c = e2.coda;
  r = E.riepilogoTrasferimento(t, c, molte);
  assert.equal(r.confermate, 2500);
  assert.equal(r.stato, 'completo');
  assert.equal(r.completo, true);
  assert.deepEqual(r.nonSalvate, 0);
});

test('trasferimento: una riga fuori dalla coda si rimanda, e la conferma una ricezione', () => {
  // Una riga dell'archivio che non sta in coda puo' essere sul server o no:
  // dall'assenza non si deduce niente. Il trasferimento la rimette in coda, e il
  // server la nomina — «gia presente» se c'era.
  const righe = [rq(1), rq(2), rq(3)];
  const c0 = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe: [rq(1)] });
  let { trasferimento: t, coda: c } = trasferisci(righe, c0);
  assert.deepEqual(c.daInviare, ['r00001', 'r00002', 'r00003']);
  assert.equal(E.riepilogoTrasferimento(t, c, righe).stato, 'in corso');

  // La conferma puo' arrivare da una ricezione: una riga arrivata dal server e' sul server.
  const ric = E.dopoRicezione(c, ok200({ righe: [rq(2), rq(3)], ultima_seq: 9, altre: false, epoca: EPOCA_A, generazione: 1 }), righe);
  t = E.registraEsito(t, ric); c = ric.coda;
  let r = E.riepilogoTrasferimento(t, c, righe);
  assert.equal(r.confermate, 2);
  assert.equal(r.daInviare, 1);

  // Una riga che esce dalla coda senza che il server la nomini non e' salvata:
  // resta da verificare, e il trasferimento non e' completo.
  const senzaNome = { ...c, daInviare: [] };
  r = E.riepilogoTrasferimento(t, senzaNome, righe);
  assert.equal(r.completo, false);
  assert.deepEqual(r.daVerificare, ['r00001']);
  assert.equal(r.stato, 'da verificare');
});

test('trasferimento: dopo un azzeramento non dice salvate le righe che il server ha tolto', () => {
  const righe = [rq(1), rq(2), rq(3)];
  let { trasferimento: t, coda: c } = trasferisci(righe, E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe }));
  const lotto = E.lottoDaInviare(righe, c);
  const e1 = E.dopoInvio(c, lotto, ok200({ nuove: ['r00001'], gia: [], scartate: [], epoca: EPOCA_A, generazione: 1 }), righe);
  t = E.registraEsito(t, e1); c = e1.coda;

  // Un altro dispositivo azzera: il prossimo invio riceve il 409.
  const e2 = E.dopoInvio(c, E.lottoDaInviare(righe, c), { codice: 409, corpo: { generazione: 2, azzerato_il: '2026-09-26T09:00:00Z', epoca: EPOCA_A } }, righe);
  t = E.registraEsito(t, e2);
  let r = E.riepilogoTrasferimento(t, e2.coda, righe);
  assert.equal(r.stato, 'sospeso');
  assert.equal(r.conflitto.generazione, 2);
  assert.equal(r.completo, false);

  // Chi studia sceglie: la coda si svuota. Nessuna riga e' salvata — nemmeno
  // quella confermata prima, che l'azzeramento ha tolto dal server.
  c = E.risolviConflitto(e2.coda, e2.conflitto);
  r = E.riepilogoTrasferimento(t, c, righe);
  assert.equal(r.stato, 'annullato');
  assert.equal(r.confermate, 0);
  assert.equal(r.completo, false);
});

test('trasferimento: dopo un ripristino del server le conferme di prima non valgono', () => {
  // R-ACC-24 visto dal trasferimento: una conferma data dal database di prima
  // non dice che la riga sia nella copia ripristinata.
  const righe = [rq(1), rq(2), rq(3)];
  let { trasferimento: t, coda: c } = trasferisci(righe, E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe }));
  const e1 = E.dopoInvio(c, E.lottoDaInviare(righe, c), ok200({ nuove: ['r00001', 'r00002', 'r00003'], gia: [], scartate: [], epoca: EPOCA_A, generazione: 1 }), righe);
  t = E.registraEsito(t, e1); c = e1.coda;
  assert.equal(E.riepilogoTrasferimento(t, c, righe).stato, 'completo');

  // La ricezione dice un'epoca nuova, e nella copia c'e' solo la prima.
  const ric = E.dopoRicezione(c, ok200({ righe: [rq(1)], ultima_seq: 1, altre: false, epoca: EPOCA_B, generazione: 1 }), righe);
  assert.equal(ric.epocaCambiata, true);
  t = E.registraEsito(t, ric); c = ric.coda;
  let r = E.riepilogoTrasferimento(t, c, righe);
  assert.equal(r.confermate, 1);
  assert.equal(r.daInviare, 2);
  assert.equal(r.stato, 'in corso');

  // Se il cambio d'epoca l'ha visto un'altra scheda, e questo trasferimento no,
  // le sue conferme vecchie non contano finche' il server non le ripete.
  let { trasferimento: t2, coda: c2 } = trasferisci(righe, E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe }));
  const e2 = E.dopoInvio(c2, E.lottoDaInviare(righe, c2), ok200({ nuove: ['r00001', 'r00002', 'r00003'], gia: [], scartate: [], epoca: EPOCA_A, generazione: 1 }), righe);
  t2 = E.registraEsito(t2, e2);
  const altraScheda = { ...e2.coda, epocaDb: EPOCA_B, cursore: 0 };
  r = E.riepilogoTrasferimento(t2, altraScheda, righe);
  assert.equal(r.confermate, 0);
  assert.equal(r.completo, false);
  assert.deepEqual(r.daVerificare, ['r00001', 'r00002', 'r00003']);
  // Una ricezione dal database nuovo conferma quelle che porta, e solo quelle:
  // le conferme vecchie non tornano valide perche' la coda ha cambiato epoca.
  const ric2 = E.dopoRicezione(altraScheda, ok200({ righe: [rq(1)], ultima_seq: 1, altre: true, epoca: EPOCA_B, generazione: 1 }), righe);
  t2 = E.registraEsito(t2, ric2);
  r = E.riepilogoTrasferimento(t2, ric2.coda, righe);
  assert.equal(r.confermate, 1);
  assert.deepEqual(r.daVerificare, ['r00002', 'r00003']);
  assert.equal(r.stato, 'da verificare');
  const ric3 = E.dopoRicezione(ric2.coda, ok200({ righe: [rq(2), rq(3)], ultima_seq: 3, altre: false, epoca: EPOCA_B, generazione: 1 }), righe);
  t2 = E.registraEsito(t2, ric3);
  assert.equal(E.riepilogoTrasferimento(t2, ric3.coda, righe).stato, 'completo');
});

test('trasferimento: gli scarti locali e del server si contano con i motivi', () => {
  // Uno scarto locale e' una riga che validaRiga() rifiuta prima di partire:
  // la stessa regola di fondiArchivio() e del server, non una seconda.
  const buone = [rq(1), rq(2), rq(3)];
  const rotte = [rq(4, { ts: 'boh' }), { _t: 'q', item_id: 'base-5' }];
  let { trasferimento: t, coda: c } = trasferisci([...buone, ...rotte], E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A }));
  assert.deepEqual(c.daInviare, ['r00001', 'r00002', 'r00003'], 'le rotte non partono');
  assert.equal(t.rifiutate.length, 2, 'le rotte restano, per scaricarle');
  assert.equal(t.rifiutate[0].motivo, 'data non valida');

  const lotto = E.lottoDaInviare(buone, c);
  const e = E.dopoInvio(c, lotto, ok200({ nuove: ['r00001', 'r00002'], gia: [], scartate: [{ uid: 'r00003', indice: 2, motivo: 'quesito sconosciuto' }], epoca: EPOCA_A, generazione: 1 }), buone);
  t = E.registraEsito(t, e); c = e.coda;
  const r = E.riepilogoTrasferimento(t, c, buone);
  assert.equal(r.stato, 'con scarti');
  assert.equal(r.completo, false);
  assert.equal(r.confermate, 2);
  assert.equal(r.daInviare, 0);
  assert.equal(r.nonSalvate, 3);
  assert.deepEqual(r.motivi, { 'data non valida': 1, 'senza uid': 1, 'quesito sconosciuto': 1 });
  assert.deepEqual(r.scartate, [{ uid: 'r00003', motivo: 'quesito sconosciuto' }]);

  // Una riga gia scartata dal server prima del trasferimento non riparte, e si conta.
  const { trasferimento: t2, coda: c2 } = trasferisci(buone, c);
  assert.equal(c2.daInviare.includes('r00003'), false);
  assert.equal(E.riepilogoTrasferimento(t2, c2, buone).scartate.length, 1);
});

test('coda: una riga oltre il limite non ferma quelle dietro, e si nomina', () => {
  // Misurato il 26 settembre: una riga che da sola non sta in un invio, in
  // testa alla coda, faceva restituire null a lottoDaInviare() — «niente da
  // inviare» — con tre righe in coda, e quelle dietro non partivano mai.
  const grande = rq(1, { input_json: 'x'.repeat(3000) });
  const righe = [grande, rq(2), rq(3)];
  const c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe: [...righe, rq(4)] });
  const lotto = E.lottoDaInviare(righe, c, { maxByte: 1000 });
  assert.ok(lotto, 'le righe dietro partono');
  assert.deepEqual(lotto.righe.map((x) => x.uid), ['r00002', 'r00003']);

  // Quelle che non partiranno mai si nominano, con il motivo: la troppo grande,
  // e un uid in coda la cui riga non c'e' nell'archivio.
  const non = E.nonInviabili(righe, c, { maxByte: 1000 });
  assert.deepEqual(non.map((x) => [x.uid, x.motivo]), [
    ['r00001', 'oltre il limite di un invio'],
    ['r00004', "senza riga nell'archivio"],
  ]);
  assert.ok(non[0].byte > 1000);
  assert.deepEqual(E.nonInviabili(righe, c), [{ uid: 'r00004', motivo: "senza riga nell'archivio" }], 'con i limiti veri la grande parte');

  // Nel riepilogo di un trasferimento sono non salvate, non da ritentare.
  const { trasferimento: t, coda: c2 } = E.nuovoTrasferimento(c, righe);
  const r = E.riepilogoTrasferimento(t, c2, righe, { maxByte: 1000 });
  assert.equal(r.daInviare, 2);
  assert.deepEqual(r.bloccate, [{ uid: 'r00001', motivo: 'oltre il limite di un invio' }]);
  assert.equal(r.nonSalvate, 1);
});

test('trasferimento: le funzioni non toccano quello che ricevono', () => {
  const righe = [rq(1), rq(2)];
  const c = E.nuovaCoda({ generazione: 1, epocaDb: EPOCA_A, righe });
  const fotoC = JSON.stringify(c), fotoR = JSON.stringify(righe);
  const { trasferimento: t } = E.nuovoTrasferimento(c, righe);
  const fotoT = JSON.stringify(t);
  const e = E.dopoInvio(c, E.lottoDaInviare(righe, c), ok200({ nuove: ['r00001'], gia: [], scartate: [], epoca: EPOCA_A, generazione: 1 }), righe);
  E.registraEsito(t, e);
  E.riepilogoTrasferimento(t, c, righe);
  E.nonInviabili(righe, c);
  assert.equal(JSON.stringify(c), fotoC);
  assert.equal(JSON.stringify(righe), fotoR);
  assert.equal(JSON.stringify(t), fotoT);
});


/* --- P-33: l'attivita' intera anche per carteggio e tecniche ------------------ */
//
// P-30 ha dato a `sessioni()` il confine dell'attivita', ma solo per le righe
// `_t:'q'`. D-02 del §10.1 di docs/area-4-progetto.md chiede lo stesso per il
// carteggio (`_t:'c'`) e le tecniche (`_t:'t'`): un contratto puro per il
// dettaglio e i conteggi, completo oltre le pause, distinto dalle sessioni
// ricostruite, isolato dalle attivita' estranee — senza applicare in silenzio
// l'API dei quiz ai tipi nuovi, e senza toccare il confine per pausa di ritmo().

const TS = (ora) => `2026-09-30T${ora}+02:00`;
/** Una riga di carteggio come la scrive salvaCart(), piu' i campi di P-33. */
const rc = (uid, item, o = {}) => ({
  _t: 'c', uid, item_id: item, ts: TS('10:00:00'),
  input_json: JSON.stringify({ risposta: 'Lat 42°50,0N' }), verdict: 1, delta: null,
  ms: 600000, mode: 'giro-tecniche', sim_uid: null, ...o,
});
/** Una riga di tecnica come la scrive correggiTec(), piu' i campi di P-33. */
const rt = (uid, item, o = {}) => ({
  _t: 't', uid, item_id: item, ts: TS('11:00:00'), correct: 1, ms: 20000,
  chosen: 'Rilevamento polare singolo', ...o,
});
/** Una banca minima con la forma di carteggio.json / tecniche.json. */
const bancaC = (...ids) => ids.map((id) => ({ id, testo: 'Testo ' + id,
  risposta_ufficiale: 'Uff ' + id, tecniche: ['Rilevamento polare singolo', 'Conversione bussola-vero'] }));

test('attivitaCarteggio: il tipo si sceglie per nome, e sessioni() resta dei quiz', () => {
  const righe = [rc('c1', '5.1.3-1'), rt('t1', '5.1.3-1'),
    { _t: 'q', uid: 'q1', item_id: 'base-1', kind: 'base', mode: 'batteria', ts: TS('09:00:00'), correct: 1, ms: 9000 },
    { _t: 'q', uid: 'q2', item_id: 'base-2', kind: 'base', mode: 'batteria', ts: TS('09:01:00'), correct: 1, ms: 9000 }];
  // Un tipo che manca o che non e' uno dei due e' un errore, non un ripiego:
  // un'opzione ignorata tornerebbe in silenzio ai quiz, o a tutti i tipi.
  assert.throws(() => E.attivitaCarteggio(righe), /tipo/);
  assert.throws(() => E.attivitaCarteggio(righe, { tipo: 'q' }), /sessioni/);
  assert.throws(() => E.attivitaCarteggio(righe, { tipo: 'carteggio' }), /tipo/);
  assert.throws(() => E.dettaglioCarteggio(righe, [], 'x'), /tipo/);
  // I quiz non entrano, e il carteggio non entra nei quiz.
  assert.deepEqual(E.attivitaCarteggio(righe, { tipo: 'c' }).flatMap((a) => a.righe.map((r) => r.uid)), ['c1']);
  assert.deepEqual(E.attivitaCarteggio(righe, { tipo: 't' }).flatMap((a) => a.righe.map((r) => r.uid)), ['t1']);
  assert.deepEqual(sessioni(righe).flatMap((s) => s.righe.map((r) => r.uid)), ['q1', 'q2'],
    'sessioni() resta dei soli quiz, anche col confine predefinito');
  assert.deepEqual(sessioni(righe, { confine: 'attivita' }).flatMap((s) => s.righe.map((r) => r.uid)), ['q1', 'q2']);
  assert.deepEqual(ritmo(righe), ritmo(righe.filter((r) => r._t === 'q')), 'il ritmo non vede carteggio e tecniche');
});

test('attivitaCarteggio: un attivita registrata resta intera oltre la pausa', () => {
  // Il giro registrato con il suo sim_uid, concluso in due momenti; e un
  // riconoscimento delle tecniche con la terza risposta 21 minuti dopo — il
  // caso di P-30, per il tipo 't'.
  const giro = [
    rc('g0', '5.1.3-1', { sim_uid: 'giro', proposti: 3, pos: 0, ts: TS('10:00:00') }),
    rc('g1', '5.1.3-2', { sim_uid: 'giro', proposti: 3, pos: 1, ts: TS('10:00:00') }),
    rc('g2', '5.2.3-1', { sim_uid: 'giro', proposti: 3, pos: 2, ts: TS('10:41:00') }),
  ];
  const [a] = E.attivitaCarteggio(giro, { tipo: 'c' });
  assert.equal(E.attivitaCarteggio(giro, { tipo: 'c' }).length, 1, 'una attivita, un gruppo');
  assert.equal(a.id, 'giro'); assert.equal(a.fonte, 'sim_uid'); assert.equal(a.n, 3);
  assert.equal(a.ambigua, false); assert.deepEqual(a.motivi, []);
  assert.equal(a.inizio, TS('10:00:00')); assert.equal(a.fine, TS('10:41:00'));
  assert.equal(a.ms, 1800000, 'la somma dei tempi registrati, non una durata inventata');

  const tec = [['11:00:00', 1], ['11:01:00', 0], ['11:22:01', 0]].map(([ora, ok], i) =>
    rt('t' + i, '5.1.3-' + (i + 1), { sim_uid: 'riconosci', proposti: 5, pos: i, ts: TS(ora), correct: ok }));
  const ta = E.attivitaCarteggio(tec, { tipo: 't' });
  assert.equal(ta.length, 1); assert.equal(ta[0].n, 3); assert.equal(ta[0].fonte, 'sim_uid');
  const d = E.dettaglioCarteggio(tec, bancaC('5.1.3-1', '5.1.3-2', '5.1.3-3'), 'riconosci', { tipo: 't' });
  assert.equal(d.conteggi.risposte, 3);
  assert.equal(d.conteggi.nonCoincidenti, 2, 'le due scelte che non coincidono, non una');
  assert.equal(d.conteggi.nonAffrontati, 2);
});

test('attivitaCarteggio: le attivita non si mescolano, nemmeno intrecciate', () => {
  // Due riconoscimenti intrecciati (due schede), un giro e una prova sulla
  // carta, e un quiz: ognuno porta solo le sue righe, e ogni id compare una volta.
  const a = [0, 1, 2].map((i) => rt('a' + i, '5.1.3-' + (i + 1), { sim_uid: 'A', ts: TS(`11:0${2 * i}:00`) }));
  const b = [0, 1, 2].map((i) => rt('b' + i, '5.2.3-' + (i + 1), { sim_uid: 'B', ts: TS(`11:0${2 * i + 1}:00`), correct: 0 }));
  const giro = [rc('g0', '5.1.3-1', { sim_uid: 'G' }), rc('g1', '5.1.3-2', { sim_uid: 'G' })];
  const prova = [rc('p0', '5.1.3-3', { sim_uid: 'P', mode: 'simulazione' }), rc('p1', '5.2.3-1', { sim_uid: 'P', mode: 'simulazione' })];
  const s = { _t: 's', uid: 'P', kind: 'carteggio', ts: TS('10:00:00'), score: 2, total: 2, passed: 0, ms: 3600000 };
  const q = { _t: 'q', uid: 'q1', item_id: 'base-1', kind: 'base', mode: 'batteria', sim_uid: 'Q', ts: TS('11:03:30'), correct: 0, ms: 9000 };
  const righe = [...a, ...b, ...giro, ...prova, s, q];
  const tt = E.attivitaCarteggio(righe, { tipo: 't' });
  assert.deepEqual(tt.map((x) => x.id).sort(), ['A', 'B']);
  for (const x of tt) assert.ok(x.righe.every((r) => r.sim_uid === x.id && r._t === 't'), x.id);
  const cc = E.attivitaCarteggio(righe, { tipo: 'c' });
  assert.deepEqual(cc.map((x) => x.id).sort(), ['G', 'P']);
  assert.equal(cc.find((x) => x.id === 'P').prova, s, 'la prova porta la sua riga di prova');
  assert.equal(cc.find((x) => x.id === 'G').prova, null, 'un allenamento non ha una riga di prova');
  assert.ok(cc.every((x) => !x.ambigua));
  assert.equal(E.dettaglioCarteggio(righe, bancaC('5.1.3-1', '5.1.3-2', '5.1.3-3'), 'A', { tipo: 't' }).conteggi.nonCoincidenti, 0,
    'gli errori della scheda accanto non entrano');
  assert.equal(E.dettaglioCarteggio(righe, [], 'Q', { tipo: 't' }).trovata, false, 'un quiz non e un attivita di tecniche');
  assert.ok(epoca(tt[0].fine) >= epoca(tt[1].fine), 'la piu recente per prima');
});

test('attivitaCarteggio: le righe senza legame si ricostruiscono, e lo dichiarano', () => {
  // Le righe di prima di P-33: giro e tappeto con sim_uid null, tutte le righe
  // di un salvataggio con lo stesso ts (salvaCart() ne usa uno solo); le
  // tecniche senza legame, una riga per risposta.
  const giro = [0, 1, 2].map((i) => rc('gx' + (9 - i), '5.1.3-' + (i + 1), { ts: TS('10:00:00') }));
  const tappeto = [0, 1, 2, 3].map((i) => rc('tp' + i, '5.2.3-' + (i + 1), { ts: TS('10:05:00'), mode: 'tappeto' }));
  // un secondo giro salvato un minuto dopo il primo: istante diverso, attivita' diversa
  const giro2 = [rc('gy0', '5.1.3-4', { ts: TS('10:01:00') })];
  const vecchie = [...giro, ...tappeto, ...giro2];
  const cc = E.attivitaCarteggio(vecchie, { tipo: 'c' });
  assert.equal(cc.length, 3, JSON.stringify(cc.map((x) => [x.mode, x.n])));
  assert.ok(cc.every((x) => x.fonte === 'risposte'), 'ricostruito, e dichiarato');
  assert.deepEqual(cc.map((x) => x.n).sort(), [1, 3, 4]);
  // L'id di un gruppo ricostruito non dipende dall'ordine in cui l'archivio
  // restituisce le righe: IndexedDB puo' riordinarle, e la revisione riapre per id.
  const rovescio = E.attivitaCarteggio([...vecchie].reverse(), { tipo: 'c' });
  assert.deepEqual(rovescio.map((x) => x.id).sort(), cc.map((x) => x.id).sort());
  for (const x of cc) {
    assert.ok(x.id.startsWith('r:'), x.id);
    assert.deepEqual(rovescio.find((y) => y.id === x.id).righe.map((r) => r.uid).sort(), x.righe.map((r) => r.uid).sort());
  }
  assert.equal(E.dettaglioCarteggio(vecchie, bancaC(), cc.find((x) => x.n === 4).id, { tipo: 'c' }).fonte, 'risposte');

  // Tecniche senza legame: la pausa e il quesito ripetuto chiudono, come nei quiz.
  const tec = [
    rt('u0', '5.1.3-1', { ts: TS('11:00:00') }), rt('u1', '5.1.3-2', { ts: TS('11:01:00') }),
    rt('u2', '5.1.3-3', { ts: TS('11:30:00') }),                 // oltre la pausa
    rt('u3', '5.1.3-3', { ts: TS('11:31:00') }),                 // ricompare: lista nuova
  ];
  const tt = E.attivitaCarteggio(tec, { tipo: 't' });
  assert.deepEqual(tt.map((x) => x.n).sort(), [1, 1, 2]);
  assert.ok(tt.every((x) => x.fonte === 'risposte' && !x.ambigua));
  // Un legame registrato in mezzo chiude il gruppo ricostruito, come in sessioni().
  const conLegame = [tec[0], rt('l0', '5.2.3-1', { sim_uid: 'L', ts: TS('11:00:30') }), tec[1]];
  assert.equal(E.attivitaCarteggio(conLegame, { tipo: 't' }).length, 3);
});

test('attivitaCarteggio: un legame ambiguo si dice, e non apre un dettaglio', () => {
  const base = () => [0, 1].map((i) => rc('x' + i, '5.1.3-' + (i + 1),
    { sim_uid: 'X', mode: 'simulazione', variante: 'cieca', pos: i }));
  const casi = [
    ['esercizio ripetuto', (r) => [...r, rc('x9', '5.1.3-1', { sim_uid: 'X', mode: 'simulazione', variante: 'cieca' })]],
    ['modalità diverse', (r) => [r[0], { ...r[1], mode: 'tappeto' }]],
    ['tipi diversi', (r) => [...r, { _t: 'q', uid: 'q9', item_id: 'base-1', kind: 'base', mode: 'batteria', sim_uid: 'X', ts: TS('09:00:00'), correct: 1 }]],
    ['tipi diversi', (r) => [...r, rt('t9', '5.1.3-1', { sim_uid: 'X' })]],
    ['riga di prova estranea', (r) => [...r, { _t: 's', uid: 'X', kind: 'base', ts: TS('10:00:00'), score: 1, total: 2, passed: 0 }]],
    ['riga di prova estranea', (r) => [...r.map((x) => ({ ...x, mode: 'giro-tecniche', variante: undefined })),
      { _t: 's', uid: 'X', kind: 'carteggio', ts: TS('10:00:00'), score: 1, total: 2, passed: 0 }]],
    ['variante diversa', (r) => [r[0], { ...r[1], variante: 'nuoviPrima' }]],
    ['variante diversa', (r) => [r[0], { ...r[1], variante: undefined }]],
    ['variante diversa', (r) => [...r, { _t: 's', uid: 'X', kind: 'carteggio', ts: TS('10:00:00'), score: 1, total: 2, passed: 0, variante: 'nuoviPrima' }]],
    ['quantità proposta incoerente', (r) => [{ ...r[0], proposti: 2 }, { ...r[1], proposti: 3 }]],
    ['quantità proposta incoerente', (r) => [{ ...r[0], proposti: 2 }, r[1]]],
    ['quantità proposta incoerente', (r) => r.map((x) => ({ ...x, proposti: 1 }))],
  ];
  for (const [motivo, fai] of casi) {
    const righe = fai(base());
    const a = E.attivitaCarteggio(righe, { tipo: 'c' }).find((x) => x.id === 'X');
    assert.equal(a.ambigua, true, motivo);
    assert.deepEqual(a.motivi, [motivo], motivo);
    const d = E.dettaglioCarteggio(righe, bancaC('5.1.3-1', '5.1.3-2'), 'X', { tipo: 'c' });
    assert.equal(d.trovata, true); assert.equal(d.ambigua, true);
    assert.deepEqual(d.schede, [], 'nessun dettaglio da un attivita che non si puo verificare');
    assert.equal(d.conteggi, null, 'non «zero da rivedere»: non si sa');
    assert.equal(d.esito, null);
  }
  assert.equal(E.attivitaCarteggio(base(), { tipo: 'c' })[0].ambigua, false);
  // Per le tecniche: una riga di prova con lo stesso uid e' estranea.
  const t = [rt('t0', '5.1.3-1', { sim_uid: 'T' }), { _t: 's', uid: 'T', kind: 'carteggio', ts: TS('11:05:00'), score: 1, total: 1, passed: 1 }];
  assert.deepEqual(E.attivitaCarteggio(t, { tipo: 't' })[0].motivi, ['riga di prova estranea']);
});

test('dettaglioCarteggio: schede, conteggi e filtro dalla stessa fonte', () => {
  const ids = ['5.1.3-1', '5.1.3-2', '5.2.3-1', '5.2.3-2'];
  const righe = [
    rc('d0', ids[0], { sim_uid: 'D', proposti: 4, pos: 0, verdict: 1 }),
    rc('d1', ids[1], { sim_uid: 'D', proposti: 4, pos: 1, verdict: 0 }),
    rc('d2', ids[2], { sim_uid: 'D', proposti: 4, pos: 2, verdict: 0, input_json: JSON.stringify({ risposta: '   ' }) }),
    rc('d3', ids[3], { sim_uid: 'D', proposti: 4, pos: 3, verdict: 1, input_json: undefined }),
  ];
  // l'archivio le restituisce in un altro ordine: conta la posizione registrata
  const d = E.dettaglioCarteggio([righe[2], righe[0], righe[3], righe[1]], bancaC(...ids), 'D', { tipo: 'c' });
  assert.equal(d.ordine, 'registrato');
  assert.deepEqual(d.schede.map((s) => s.item_id), ids, 'nell\'ordine della lista proposta');
  assert.deepEqual(d.schede.map((s) => s.giudizio), [true, false, false, true]);
  assert.deepEqual(d.schede.map((s) => s.scritta), [true, true, false, null],
    'un campo vuoto e un campo non registrato sono due cose diverse');
  assert.equal(d.schede[0].risposta, 'Lat 42°50,0N', 'la risposta com\'e\', senza normalizzarla');
  assert.equal(d.schede[3].risposta, null);
  assert.equal(d.schede[0].esercizio.risposta_ufficiale, 'Uff 5.1.3-1');
  assert.deepEqual(d.conteggi, { proposti: 4, esercizi: 4, scritti: 2, vuoti: 1, nonRegistrati: 1,
    coincidenti: 2, daRivedere: 2, senzaGiudizio: 0, nonAffrontati: 0 });
  assert.equal(d.filtro, 'tutti');
  assert.deepEqual(d.mostrate, d.schede);
  const f = E.dettaglioCarteggio(righe, bancaC(...ids), 'D', { tipo: 'c', filtro: 'da-rivedere' });
  assert.deepEqual(f.mostrate.map((s) => s.item_id), [ids[1], ids[2]]);
  assert.equal(f.mostrate.length, f.conteggi.daRivedere, 'il numero sul pulsante e le schede che apre coincidono');
  assert.throws(() => E.dettaglioCarteggio(righe, bancaC(...ids), 'D', { tipo: 'c', filtro: 'errori' }), /filtro/);
  assert.throws(() => E.dettaglioCarteggio(righe, bancaC(...ids), 'D', { tipo: 'c', filtro: 'non-coincidenti' }), /filtro/);
  assert.equal(d.esito, null, 'un allenamento non ha soglia');
});

test('dettaglioCarteggio: un giudizio che manca non diventa «da rivedere», e la soglia vuole tutti i giudizi', () => {
  const ids = ['5.1.3-1', '5.1.3-2', '5.2.3-1', '5.2.3-2'];
  const prova = (verdetti) => [
    ...ids.map((id, i) => rc('p' + i, id, { sim_uid: 'P', mode: 'simulazione', variante: 'cieca', proposti: 4, pos: i, verdict: verdetti[i] })),
    { _t: 's', uid: 'P', kind: 'carteggio', ts: TS('10:00:00'), score: 3, total: 4, passed: 1, ms: 3600000, variante: 'cieca' },
  ];
  const tutti = E.dettaglioCarteggio(prova([1, 1, 0, 1]), bancaC(...ids), 'P', { tipo: 'c' });
  assert.deepEqual(tutti.esito, { coincidenti: 3, su: 4, soglia: E.PROVA_CARTEGGIO.soglia, raggiunta: true });
  assert.equal(tutti.variante, 'cieca');
  assert.equal(E.dettaglioCarteggio(prova([1, 0, 0, 1]), bancaC(...ids), 'P', { tipo: 'c' }).esito.raggiunta, false);
  const manca = E.dettaglioCarteggio(prova([1, 1, null, 1]), bancaC(...ids), 'P', { tipo: 'c' });
  assert.equal(manca.conteggi.senzaGiudizio, 1);
  assert.equal(manca.conteggi.daRivedere, 0, 'un giudizio assente non e un giudizio negativo');
  assert.equal(manca.schede[2].giudizio, null);
  assert.equal(manca.esito, null, 'senza tutti i giudizi nessuna soglia, raggiunta o no');
  const f = E.dettaglioCarteggio(prova([1, 1, null, 1]), bancaC(...ids), 'P', { tipo: 'c', filtro: 'da-rivedere' });
  assert.deepEqual(f.mostrate, []);
});

test('dettaglioCarteggio: le tecniche contano le scelte che non coincidono e i non affrontati', () => {
  const ids = ['5.1.3-1', '5.1.3-2', '5.2.3-1'];
  const righe = [
    rt('k0', ids[0], { sim_uid: 'K', proposti: 5, pos: 0, ts: TS('11:00:00'), correct: 1, chosen: 'Rilevamento polare singolo|Conversione bussola-vero' }),
    rt('k1', ids[1], { sim_uid: 'K', proposti: 5, pos: 1, ts: TS('11:01:00'), correct: 0, chosen: 'Conversione bussola-vero' }),
    rt('k2', ids[2], { sim_uid: 'K', proposti: 5, pos: 2, ts: TS('11:02:00'), correct: 0, chosen: '' }),
  ];
  const d = E.dettaglioCarteggio(righe, bancaC(...ids), 'K', { tipo: 't' });
  assert.deepEqual(d.conteggi, { proposti: 5, risposte: 3, coincidenti: 1, nonCoincidenti: 2, senzaEsito: 0, nonAffrontati: 2 });
  assert.deepEqual(d.schede[0].scelte, ['Rilevamento polare singolo', 'Conversione bussola-vero']);
  assert.deepEqual(d.schede[2].scelte, [], 'nessuna tecnica scelta non e una scelta non registrata');
  assert.deepEqual(d.schede[1].attese, ['Rilevamento polare singolo', 'Conversione bussola-vero'], 'le attese dalla banca');
  assert.deepEqual(d.schede.map((s) => s.coincidono), [true, false, false]);
  assert.equal(d.filtro, 'tutte');
  const f = E.dettaglioCarteggio(righe, bancaC(...ids), 'K', { tipo: 't', filtro: 'non-coincidenti' });
  assert.deepEqual(f.mostrate.map((s) => s.item_id), [ids[1], ids[2]]);
  assert.equal(f.mostrate.length, f.conteggi.nonCoincidenti);
  assert.throws(() => E.dettaglioCarteggio(righe, bancaC(...ids), 'K', { tipo: 't', filtro: 'da-rivedere' }), /filtro/);
  assert.equal(d.esito, null);
  // una scelta non registrata resta non registrata
  const senza = E.dettaglioCarteggio([{ ...righe[0], chosen: undefined }], bancaC(...ids), 'K', { tipo: 't' });
  assert.equal(senza.schede[0].scelte, null);
});

test('dettaglioCarteggio: le righe vecchie non inventano quantita, variante ne ordine', () => {
  const banca = bancaCarteggioVera();
  const ids = banca.slice(0, 4).map((e) => e.id);
  // Un giro di prima di P-33: niente sim_uid, niente proposti, niente pos.
  const giro = ids.slice(0, 3).map((id, i) => rc('v' + i, id, { verdict: i === 1 ? 0 : 1 }));
  const [g] = E.attivitaCarteggio(giro, { tipo: 'c' });
  const d = E.dettaglioCarteggio(giro, banca, g.id, { tipo: 'c' });
  assert.equal(d.proposti, null); assert.equal(d.conteggi.proposti, null);
  assert.equal(d.conteggi.nonAffrontati, null, 'non zero: non si sa quanti ne erano stati proposti');
  assert.equal(d.variante, null);
  assert.equal(d.ordine, 'non registrato');
  assert.equal(d.fonte, 'risposte');
  assert.equal(d.conteggi.daRivedere, 1);
  assert.equal(d.schede[1].esercizio.id, ids[1], 'la banca vera');
  // Una prova di prima di P-32: il legame c'e', la variante no. E' sconosciuta,
  // non 'cieca'; la quantita' proposta e' quella registrata nella riga di prova.
  const prova = [...ids.map((id, i) => rc('o' + i, id, { sim_uid: 'OLD', mode: 'simulazione' })),
    { _t: 's', uid: 'OLD', kind: 'carteggio', ts: TS('10:00:00'), score: 4, total: 4, passed: 1, ms: 3000000 }];
  const o = E.dettaglioCarteggio(prova, banca, 'OLD', { tipo: 'c' });
  assert.equal(o.variante, null, 'sconosciuta, non la predefinita');
  assert.equal(o.proposti, 4, 'dalla riga di prova, dove e registrata');
  assert.equal(o.conteggi.nonAffrontati, 0);
  assert.equal(o.esito.raggiunta, true);
  assert.equal(o.fonte, 'sim_uid');
  // Una prova nuova porta la variante di P-32.
  const nuova = prova.map((r) => ({ ...r, uid: r._t === 's' ? 'NEW' : r.uid + 'n', sim_uid: r._t === 's' ? undefined : 'NEW', variante: 'nuoviPrima' }));
  assert.equal(E.dettaglioCarteggio(nuova, banca, 'NEW', { tipo: 'c' }).variante, 'nuoviPrima');
  // Tecniche di prima: nessun legame, nessuna quantita'.
  const tec = [rt('w0', ids[0], { ts: TS('11:00:00') }), rt('w1', ids[1], { ts: TS('11:01:00'), correct: 0 })];
  const [ta] = E.attivitaCarteggio(tec, { tipo: 't' });
  const td = E.dettaglioCarteggio(tec, banca, ta.id, { tipo: 't' });
  assert.equal(td.conteggi.nonAffrontati, null);
  assert.equal(td.conteggi.nonCoincidenti, 1);
  assert.deepEqual(td.schede.map((s) => s.item_id), [ids[0], ids[1]], 'senza posizioni, nell\'ordine delle risposte');
});

test('dettaglioCarteggio: un esercizio che la banca non ha si nomina, e senza banca non si inventa', () => {
  const righe = [rc('m0', '5.1.3-1', { sim_uid: 'M', verdict: 0 }), rc('m1', '9.9.9-9', { sim_uid: 'M', verdict: 0 })];
  const d = E.dettaglioCarteggio(righe, bancaC('5.1.3-1'), 'M', { tipo: 'c' });
  assert.deepEqual(d.mancanti, ['9.9.9-9']);
  assert.equal(d.banca, true);
  const m = d.schede.find((s) => s.item_id === '9.9.9-9');
  assert.equal(m.esercizio, null);
  assert.equal(m.risposta, 'Lat 42°50,0N', 'il risultato proprio resta');
  assert.equal(d.conteggi.daRivedere, 2, 'un esercizio che manca in banca conta lo stesso');
  const senza = E.dettaglioCarteggio(righe, null, 'M', { tipo: 'c' });
  assert.equal(senza.banca, false);
  assert.equal(senza.mancanti, null, 'non «nessuno»: la banca non e caricata');
  assert.ok(senza.schede.every((s) => s.esercizio === null));
  assert.deepEqual(senza.conteggi, d.conteggi, 'i conteggi vengono dalle righe, non dalla banca');
  const t = E.dettaglioCarteggio([rt('n0', '9.9.9-9', { sim_uid: 'N' })], bancaC('5.1.3-1'), 'N', { tipo: 't' });
  assert.deepEqual(t.mancanti, ['9.9.9-9']);
  assert.equal(t.schede[0].attese, null);
});

test('dettaglioCarteggio: un ritento con gli stessi uid non conta due volte, e un id assente non e un attivita vuota', () => {
  const righe = [rc('r0', '5.1.3-1', { sim_uid: 'R', verdict: 0 }), rc('r1', '5.1.3-2', { sim_uid: 'R' })];
  // La scrittura fallita si ritenta con gli stessi uid (§6.3 del progetto):
  // le righe arrivate due volte sono le stesse righe.
  const d = E.dettaglioCarteggio([...righe, ...righe.map((r) => ({ ...r }))], bancaC('5.1.3-1', '5.1.3-2'), 'R', { tipo: 'c' });
  assert.equal(d.ambigua, false);
  assert.equal(d.conteggi.esercizi, 2);
  assert.equal(d.conteggi.daRivedere, 1);
  // Con uid nuovi non e' un ritento: e' un esercizio ripetuto, e si dice.
  const doppio = [...righe, ...righe.map((r) => ({ ...r, uid: r.uid + '-bis' }))];
  assert.deepEqual(E.dettaglioCarteggio(doppio, bancaC(), 'R', { tipo: 'c' }).motivi, ['esercizio ripetuto']);
  const no = E.dettaglioCarteggio(righe, bancaC(), 'nessuno', { tipo: 'c' });
  assert.equal(no.trovata, false);
  assert.equal(no.conteggi, null);
  assert.deepEqual(no.schede, []);
  // e niente di quello che riceve viene toccato
  const foto = JSON.stringify(righe);
  E.attivitaCarteggio(righe, { tipo: 'c' }); E.dettaglioCarteggio(righe, bancaC('5.1.3-1'), 'R', { tipo: 'c', filtro: 'da-rivedere' });
  assert.equal(JSON.stringify(righe), foto);
});


/* --- P-34: la bozza del carteggio ---------------------------------------------- */
//
// Il §7.6 della specifica prometteva il testo «salvato a ogni tasto», e non lo
// era dalla 0.5.0: annotaCart() lo tiene solo in memoria. D-03 del §10.1 di
// docs/area-4-progetto.md chiede una bozza legata all'account, separata dalle
// righe valutate, esclusa da ripiega(), dai conteggi e dagli invii, cancellata
// solo a conclusione confermata o a scarto esplicito. Qui le regole pure della
// bozza; lo storage per account e' della pagina, e il suo contratto sta nel
// §9.4 di docs/account-client-progetto.md, provato nel browser da C-19.

const CARTE = JSON.parse(readFileSync(new URL('../site/dati/carteggio.json', import.meta.url), 'utf8'));
const ID_CARTE = new Set(CARTE.map((e) => e.id));
const QUATTRO = ['5.1.3-1', '5.2.3-1', '5.3.3-1', '5.4.3-1'].filter((id) => ID_CARTE.has(id));
const T0 = Date.parse('2026-09-30T10:00:00+02:00');
const prova = (o = {}) => E.nuovaBozza({ id: 'prova-A', modo: 'simulazione', lista: QUATTRO, inizio: T0, variante: 'cieca', ...o });

test('nuovaBozza: una lista congelata, la scadenza della prova dalla sorgente unica, e niente campi di una riga', () => {
  assert.equal(QUATTRO.length, 4, 'la banca ha i quattro esercizi del test');
  const b = prova();
  assert.equal(E.validaBozza(b), null);
  assert.equal(b.tipo, E.BOZZA_CARTEGGIO.tipo);
  assert.deepEqual(b.lista, QUATTRO);
  assert.equal(b.scadenza, T0 + E.PROVA_CARTEGGIO.minuti * 60000, 'i 60 minuti vengono da PROVA_CARTEGGIO, non dal chiamante');
  assert.equal(b.fase, 'lavoro'); assert.equal(b.posizione, 0); assert.equal(b.revisione, 0); assert.equal(b.consegna, null);
  assert.deepEqual(b.testi, ['', '', '', '']); assert.deepEqual(b.giudizi, [null, null, null, null]);
  for (const k of ['_t', 'uid', 'ts', 'verdict', 'item_id', 'sim_uid']) assert.ok(!(k in b), `la bozza non porta «${k}»`);
  // Un allenamento non ha scadenza e non ha variante; una prova si' (P-32).
  const giro = E.nuovaBozza({ id: 'giro-A', modo: 'giro-tecniche', lista: QUATTRO.slice(0, 2), inizio: T0 });
  assert.equal(giro.scadenza, null); assert.equal(giro.variante, null);
  assert.throws(() => E.nuovaBozza({ id: 'x', modo: 'simulazione', lista: QUATTRO, inizio: T0 }), /variante/);
  assert.throws(() => E.nuovaBozza({ id: 'x', modo: 'quiz', lista: QUATTRO, inizio: T0 }), /modalit/);
  assert.throws(() => E.nuovaBozza({ id: 'x', modo: 'tappeto', lista: ['5.1.3-1', '5.1.3-1'], inizio: T0 }), /lista/);
  assert.throws(() => E.nuovaBozza({ id: '', modo: 'tappeto', lista: QUATTRO, inizio: T0 }), /id/);
  assert.throws(() => E.nuovaBozza({ id: 'x'.repeat(61), modo: 'tappeto', lista: QUATTRO, inizio: T0 }), /id/,
    'un id troppo lungo non lascerebbe posto agli uid delle righe finali');
});

test('validaBozza: il motivo, come validaRiga, e una bozza con campi di una riga e rifiutata', () => {
  const b = prova();
  const casi = [
    [null, "non e' una bozza"], [{ ...b, tipo: 'riga' }, "non e' una bozza"], [{ ...b, versione: 2 }, 'versione sconosciuta'],
    [{ ...b, modo: 'quiz' }, 'modalità sconosciuta'], [{ ...b, lista: [] }, 'lista non valida'],
    [{ ...b, posizione: 4 }, 'posizione non valida'], [{ ...b, scadenza: null }, 'tempo non valido'],
    [{ ...b, fase: 'finita' }, 'fase non valida'], [{ ...b, testi: ['a'] }, 'testi non validi'],
    [{ ...b, giudizi: [1, 2, null, null] }, 'giudizi non validi'], [{ ...b, fase: 'lavoro', giudizi: [1, null, null, null] }, 'giudizi non validi'],
    [{ ...b, revisione: -1 }, 'revisione non valida'], [{ ...b, _t: 'c' }, 'campi di una riga'], [{ ...b, uid: 'u' }, 'campi di una riga'],
    [{ ...b, fase: 'confronto', consegna: null }, 'consegna non valida'],
  ];
  for (const [x, motivo] of casi) assert.equal(E.validaBozza(x), motivo, JSON.stringify(x && { ...x, lista: undefined }));
});

test('bozza: non e una riga, e resta fuori da specchio, attivita, import e invii', () => {
  // Se per un errore una bozza finisse fra le righe, nessuno la conterebbe:
  // e' la «seconda contabilita'» che AGENTS.md vieta, fermata dove si legge.
  let b = E.modificaBozza(prova(), { testi: ['Lat 42°50,0N', '', '', ''] });
  b = E.modificaBozza(b, { fase: 'confronto', consegna: T0 + 1000 });
  b = E.modificaBozza(b, { giudizi: [1, 0, null, null] });
  assert.notEqual(E.validaRiga(b), null, 'validaRiga la rifiuta');
  const vera = { _t: 'c', uid: 'c1', item_id: QUATTRO[0], ts: '2026-09-30T10:00:00+02:00', input_json: '{"risposta":"x"}', verdict: 1, delta: null, ms: 1, mode: 'tappeto', sim_uid: 'T' };
  assert.deepEqual(E.ripiega([b]), E.ripiega([]), 'lo specchio non la vede');
  assert.deepEqual(E.ripiega([vera, b]), E.ripiega([vera]));
  assert.deepEqual(E.attivitaCarteggio([vera, b], { tipo: 'c' }).map((a) => a.id), ['T'], 'nessuna attivita da una bozza');
  const f = E.fondiArchivio([], [b]);
  assert.equal(f.nuove, 0); assert.equal(f.scartate, 1);
  const coda = E.accoda(E.nuovaCoda({ righe: [vera] }), b.id);
  assert.deepEqual(E.lottoDaInviare([vera, b], coda).righe.map((r) => r.uid), ['c1'], 'nessun invio porta una bozza');
  assert.equal(E.nuovoTrasferimento(E.nuovaCoda(), [b]).trasferimento.rifiutate.length, 1, 'un trasferimento la rifiuta');
});

test('modificaBozza: il lavoro cambia, lista, tempo e modalita no', () => {
  const b = prova();
  const c = E.modificaBozza(b, { posizione: 2, testi: ['a', '', 'c', ''] });
  assert.equal(c.posizione, 2); assert.deepEqual(c.testi, ['a', '', 'c', '']);
  assert.deepEqual(b.testi, ['', '', '', ''], 'non modifica quello che riceve');
  for (const k of ['id', 'modo', 'lista', 'variante', 'inizio', 'scadenza', 'revisione', 'tipo', 'versione']) {
    assert.throws(() => E.modificaBozza(b, { [k]: k === 'lista' ? [...QUATTRO].reverse() : 'altro' }), /non si cambia/, k);
  }
  // I giudizi arrivano solo al confronto, e il confronto non torna al lavoro.
  assert.throws(() => E.modificaBozza(b, { giudizi: [1, null, null, null] }), /giudizi/);
  const conf = E.modificaBozza(c, { fase: 'confronto', consegna: T0 + 5000 });
  assert.throws(() => E.modificaBozza(conf, { fase: 'lavoro' }), /confronto/);
  assert.throws(() => E.modificaBozza(conf, { testi: ['b', '', 'c', ''] }), /consegna/, 'il testo consegnato resta quello');
  assert.throws(() => E.modificaBozza(c, { fase: 'confronto' }), /consegna/, 'la consegna ha il suo istante');
  const g = E.modificaBozza(conf, { giudizi: [1, null, 0, null] });
  assert.deepEqual(g.giudizi, [1, null, 0, null], 'un giudizio rinviato resta null, non diventa un no');
});

test('sostituisciBozza: una revisione vecchia non sovrascrive, e una bozza sparita non si ricrea', () => {
  const b = prova();
  const primo = E.sostituisciBozza(null, b, 0);
  assert.equal(primo.motivo, null); assert.equal(primo.bozza.revisione, 1);
  const dopo = E.sostituisciBozza(primo.bozza, E.modificaBozza(primo.bozza, { testi: ['x', '', '', ''] }), 1);
  assert.equal(dopo.bozza.revisione, 2); assert.deepEqual(dopo.bozza.testi, ['x', '', '', '']);
  // Due schede sulla stessa bozza: la seconda scrive sopra una revisione che non ha visto.
  const vecchia = E.sostituisciBozza(dopo.bozza, E.modificaBozza(primo.bozza, { testi: ['y', '', '', ''] }), 1);
  assert.equal(vecchia.bozza, null); assert.match(vecchia.motivo, /altra scheda/);
  // Conclusa o scartata altrove: chi la scriveva non la ricrea.
  const sparita = E.sostituisciBozza(null, dopo.bozza, 2);
  assert.equal(sparita.bozza, null); assert.match(sparita.motivo, /non c'è più/);
  // La stessa attivita' non cambia lista o scadenza al ritento.
  const altra = E.sostituisciBozza(dopo.bozza, { ...dopo.bozza, scadenza: dopo.bozza.scadenza + 3600000 }, 2);
  assert.equal(altra.bozza, null); assert.match(altra.motivo, /attività diversa/);
  const rotta = E.sostituisciBozza(null, { ...b, fase: 'boh' }, 0);
  assert.equal(rotta.bozza, null); assert.equal(rotta.motivo, 'fase non valida');
});

test('riprendiBozza: la scadenza e quella di prima, e scaduta apre il confronto con il testo scritto', () => {
  const b = E.modificaBozza(prova(), { posizione: 1, testi: ['a', 'b', '', ''] });
  const presto = E.riprendiBozza(b, T0 + 10 * 60000);
  assert.equal(presto.scaduta, false); assert.equal(presto.restanteMs, 50 * 60000, 'mai 60 minuti nuovi');
  assert.equal(presto.bozza.scadenza, b.scadenza); assert.equal(presto.bozza.posizione, 1);
  const tardi = E.riprendiBozza(b, b.scadenza + 1);
  assert.equal(tardi.scaduta, true); assert.equal(tardi.restanteMs, 0);
  assert.equal(tardi.bozza.fase, 'confronto'); assert.deepEqual(tardi.bozza.testi, ['a', 'b', '', '']);
  assert.equal(tardi.bozza.consegna, b.scadenza, 'la prova e finita alla scadenza, non alla ricarica');
  assert.equal(tardi.bozza.scadenza, b.scadenza);
  assert.equal(b.fase, 'lavoro', 'non modifica quello che riceve');
  // Un allenamento non scade mai; un confronto gia' aperto resta com'e'.
  const giro = E.nuovaBozza({ id: 'g', modo: 'tappeto', lista: QUATTRO, inizio: T0 });
  const g = E.riprendiBozza(giro, T0 + 400 * 86400000);
  assert.equal(g.scaduta, false); assert.equal(g.restanteMs, null); assert.equal(g.bozza.fase, 'lavoro');
  const conf = E.modificaBozza(b, { fase: 'confronto', consegna: T0 + 1000 });
  assert.equal(E.riprendiBozza(conf, b.scadenza + 5).bozza.consegna, T0 + 1000);
  assert.throws(() => E.riprendiBozza(b, NaN), /orologio/);
  assert.throws(() => E.riprendiBozza({ ...b, fase: 'x' }, T0), /bozza/);
});

test('concludiBozza: con un giudizio rinviato nessuna riga, e le righe finali sono quelle di P-33', () => {
  let b = E.modificaBozza(prova(), { testi: ['  Lat 42°50,0N ', '', 'Rv 120°', 'x'] });
  const consegna = T0 + 40 * 60000;
  b = E.modificaBozza(b, { fase: 'confronto', consegna });
  const ts = '2026-09-30T10:41:00+02:00';
  // In lavoro, o con un giudizio mancante, non si conclude: nessuna riga con
  // verdict diverso da 1/0 (D-02, D-03).
  assert.match(E.concludiBozza(E.modificaBozza(prova(), {}), { ts }).motivo, /confronto/);
  const rinviato = E.concludiBozza(E.modificaBozza(b, { giudizi: [1, 0, null, 1] }), { ts });
  assert.deepEqual(rinviato.righe, []); assert.match(rinviato.motivo, /giudizi/);
  b = E.modificaBozza(b, { giudizi: [1, 0, 1, 1] });
  const { righe, motivo } = E.concludiBozza(b, { ts, quesiti: ID_CARTE });
  assert.equal(motivo, null);
  const c = righe.filter((r) => r._t === 'c'), s = righe.filter((r) => r._t === 's');
  assert.equal(c.length, 4); assert.equal(s.length, 1);
  for (const r of righe) assert.equal(E.validaRiga(r, { quesiti: ID_CARTE }), null, r.uid);
  assert.deepEqual(c.map((r) => r.item_id), QUATTRO);
  assert.deepEqual(c.map((r) => r.pos), [0, 1, 2, 3]);
  assert.ok(c.every((r) => r.sim_uid === b.id && r.proposti === 4 && r.mode === 'simulazione' && r.variante === 'cieca' && r.delta === null && r.ts === ts));
  assert.deepEqual(c.map((r) => r.verdict), [1, 0, 1, 1]);
  assert.equal(JSON.parse(c[0].input_json).risposta, 'Lat 42°50,0N', 'il testo com e stato consegnato, senza gli spazi ai lati');
  assert.equal(s[0].uid, b.id); assert.equal(s[0].kind, 'carteggio'); assert.equal(s[0].score, 3);
  assert.equal(s[0].total, 4); assert.equal(s[0].passed, 1); assert.equal(s[0].ms, 40 * 60000); assert.equal(s[0].variante, 'cieca');
  // Gli uid nascono dalla bozza: un ritento della scrittura riusa gli stessi.
  assert.deepEqual(E.concludiBozza(b, { ts: '2026-09-30T11:00:00+02:00' }).righe.map((r) => r.uid), righe.map((r) => r.uid));
  assert.equal(new Set(righe.map((r) => r.uid)).size, 5);
  // E il motore legge le righe come un'attivita' sola, registrata, con l'esito della bozza.
  const [a] = E.attivitaCarteggio(righe, { tipo: 'c' });
  assert.equal(a.id, b.id); assert.equal(a.fonte, 'sim_uid'); assert.equal(a.ambigua, false); assert.equal(a.ordine, 'registrato');
  const d = E.dettaglioCarteggio(righe, CARTE, b.id, { tipo: 'c' });
  assert.equal(d.conteggi.senzaGiudizio, 0); assert.equal(d.conteggi.daRivedere, 1); assert.equal(d.conteggi.vuoti, 1);
  assert.deepEqual(d.esito, { coincidenti: 3, su: 4, soglia: E.PROVA_CARTEGGIO.soglia, raggiunta: true });
  // Un allenamento: nessuna riga di prova, nessuna variante.
  let t = E.nuovaBozza({ id: 'tap', modo: 'tappeto', lista: QUATTRO.slice(0, 2), inizio: T0 });
  t = E.modificaBozza(E.modificaBozza(t, { fase: 'confronto', consegna: T0 + 1000 }), { giudizi: [0, 0] });
  const rt2 = E.concludiBozza(t, { ts }).righe;
  assert.deepEqual(rt2.map((r) => r._t), ['c', 'c']); assert.ok(rt2.every((r) => !('variante' in r)));
  assert.equal(E.dettaglioCarteggio(rt2, CARTE, 'tap', { tipo: 'c' }).esito, null);
});

test('concludiBozza: un testo troppo lungo per una riga non autorizza la conclusione, e lo dice', () => {
  let b = E.modificaBozza(prova(), { testi: ['x'.repeat(E.RIGA_MAX_BYTE), '', '', ''] });
  b = E.modificaBozza(E.modificaBozza(b, { fase: 'confronto', consegna: T0 + 1 }), { giudizi: [1, 1, 1, 1] });
  const r = E.concludiBozza(b, { ts: '2026-09-30T10:41:00+02:00' });
  assert.deepEqual(r.righe, []); assert.match(r.motivo, /troppo grande/);
  assert.throws(() => E.concludiBozza(b, { ts: 'ieri' }), /data/);
});
