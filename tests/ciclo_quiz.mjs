// Il banco del ciclo progettato dei quiz: riepilogo, anteprima, avvio della
// riprova — l'area 3.
//
// Lo chiama tests/test_interfaccia.py, e non gira da solo sotto `node --test`:
// legge da stdin `{"pagina": "<testo di una pagina>"}` e scrive su stdout la
// lista delle verifiche, `[{gruppo, nome, ok, extra}]`.
//
// Perche' non basta trovare `E.erroriSessione` nella pagina. Il progetto
// dell'area 3 (docs/area-3-progetto.md, §§6.2, 7.1 e 10.1) chiede che
// «Riprova questi N» apra **esattamente** gli N errori di quell'attivita', nello
// stesso ordine, anche quando i dati cambiano fra un clic e l'altro — un import,
// un azzeramento, una lettura che fallisce —, e che il numero sul pulsante e la
// lista che si apre vengano dallo stesso risultato. Una pagina che chiama la
// funzione giusta e poi apre la lista rifatta, o quella di un'altra attivita', o
// il numero senza la lista, passa qualunque controllo che legge il codice. E' il
// difetto di casa, spostato nella colla fra pagina e motore: P-06 lo ha chiuso
// per la selezione dei quiz, questo per il ciclo.
//
// Che cosa fa. Estrae dalla pagina le tre funzioni di raccordo del §10.1 —
// `riepilogoQuiz(contesto, fonte)`, `anteprimaRiprova(riprova, fonte)`,
// `avviaRiprova(riprova, fonte, avvia)` — con le funzioni di primo livello che
// nominano, e le esegue con la banca vera, uno storico estraneo e un `E` che
// registra ogni chiamata e poi esegue quella vera. La fonte e' congelata: una
// funzione che la scrive lancia, e il banco lo dice. Poi fa il giro intero,
// cambiando i dati fra un passo e l'altro.
//
// Che cosa NON fa. Non guarda i testi, il focus, i ritorni, gli avvisi, la
// consegna idempotente di una simulazione, i tag nella revisione: sono runner e
// DOM, e restano al collaudo a 375 e 1280 px (specifica §9.6, R-FLU-01). Del
// collegamento con il runner legge soltanto due cose nel codice, che `apri`
// riceve la lista da `avviaRiprova` e che usa l'identita' e l'auto che le passa.

import { readFileSync } from 'node:fs';
import * as REALE from '../site/engine.js';
import { funzioni, conDipendenze, dipendenze, scriptModulo } from './pagina_js.mjs';

const RADICE = new URL('..', import.meta.url);
const RACCORDO = ['riepilogoQuiz', 'anteprimaRiprova', 'avviaRiprova'];
// Le funzioni del motore che scelgono domande: nessuna, fuori da
// erroriSessione(), ha un posto nel ciclo. «Riprova questi N» non e' il ripasso
// di tutto lo storico (coda con soloSbagliate) ne' una selezione nuova.
const SELEZIONI = ['mirata', 'daAllenare', 'coda', 'screening', 'lunghezzaScreening',
  'simulazione', 'simulazioneVela', 'estrai', 'estraiNuoviPrima', 'giroTecniche', 'tappeto'];
const REGISTRATE = [...SELEZIONI, 'erroriSessione', 'sessioni', 'esito'];

const verifiche = [];
function check(gruppo, nome, ok, extra = '') {
  verifiche.push({ gruppo, nome, ok: !!ok, extra: ok ? '' : extra });
}

// --- la banca vera, e uno storico che non e' solo quello dell'attivita' -----

const items = JSON.parse(readFileSync(new URL('site/dati/quiz.json', RADICE), 'utf8'));
const B = items.filter((x) => x.k === 'base');
const V = items.filter((x) => x.k === 'vela');
const ts = (giorno, ora) => `2026-09-${giorno}T${ora}+02:00`;
let n = 0;
const q = (sim, it, ok, t, mode = 'argomento', id = it.id, kind = it.k) => ({
  _t: 'q', uid: 'u' + String(++n).padStart(3, '0'), kind, item_id: id, ts: t,
  correct: ok ? 1 : 0, ms: 9000, mode, chosen: '0', ...(sim ? { sim_uid: sim } : {}),
});

// A: l'attivita' del §10.1 — tre risposte, la terza 21 minuti e 1 secondo
// dopo, due errori, su una lista di dieci. Z, un'altra scheda, le si intreccia.
const A = [q('A', B[0], false, ts(26, '10:00:00')), q('A', B[1], true, ts(26, '10:01:00')),
  q('A', B[2], false, ts(26, '10:22:01'))];
const Z = [q('Z', B[8], false, ts(26, '10:00:30'), 'mirata'), q('Z', B[9], true, ts(26, '10:21:00'), 'mirata')];
// X, prima: sei errori, fra cui lo stesso B[0]. Y, dopo: B[2] preso giusto,
// B[0] di nuovo sbagliato. Lo specchio dice che B[2] e' a posto: il ciclo di A
// non lo deve sapere.
const X = [B[0], B[3], B[4], B[5], B[6], B[7]].map((it, i) => q('X', it, false, ts(20, `09:0${i}:00`), 'sbagliate'));
const Y = [q('Y', B[2], true, ts(26, '11:00:00'), 'sbagliate'), q('Y', B[0], false, ts(26, '11:01:00'), 'sbagliate')];
// Una simulazione base e la sua vela, una dopo l'altra, con i loro _t:'s'.
const SB = B.slice(20, 38).map((it, i) => q('SB', it, ![0, 5, 10].includes(i),
  ts(25, `09:${String(i).padStart(2, '0')}:10`), 'simulazione'));
const SV = V.slice(0, 5).map((it, i) => q('SV', it, i !== 2, ts(25, `09:3${i}:10`), 'simulazione'));
const PROVE = [{ _t: 's', uid: 'SB', kind: 'base', ts: ts(25, '09:30:00'), score: 15, total: 20, passed: 0, ms: 1800000 },
  { _t: 's', uid: 'SV', kind: 'vela', ts: ts(25, '09:45:00'), score: 4, total: 5, passed: 1, ms: 900000 }];
// Un archivio importato da altrove: righe senza legame, confine ricostruito.
const REC = [q(null, B[40], false, ts(10, '18:00:00'), 'batteria'), q(null, B[41], true, ts(10, '18:01:00'), 'batteria')];
const ID_REC = 'r:' + REC[0].uid;
// Un id che raccoglie un quesito ripetuto; un errore su un quesito che la banca non ha.
const AMB = [q('AMB', B[50], false, ts(12, '10:00:00')), q('AMB', B[51], true, ts(12, '10:01:00')),
  q('AMB', B[50], false, ts(12, '10:02:00'))];
const MAN = [q('MAN', B[60], false, ts(13, '10:00:00')), q('MAN', B[61], true, ts(13, '10:01:00')),
  q('MAN', B[62], false, ts(13, '10:02:00'), 'argomento', 'base-99999')];
const TAG_VECCHIO = { _t: 'g', uid: 'g001', ts: ts(26, '10:30:00'), attempt_uid: A[2].uid, tag: 'L' };

const RIGHE = [...X, ...A, ...Z, ...Y, ...SB, ...SV, ...PROVE, ...REC, ...AMB, ...MAN, TAG_VECCHIO];
const SIM_UID = new Set(RIGHE.map((r) => r.sim_uid || r.uid));

/** Una fonte congelata: chi la scrive lancia, invece di passare in silenzio. */
function congela(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x);
    for (const v of Object.values(x)) congela(v);
  }
  return x;
}
congela(items);
const fonte = (righe = RIGHE, extra = {}) => congela({ righe: [...righe], banca: items, letturaFallita: false, ...extra });

// --- l'esecuzione ----------------------------------------------------------

let chiamate = [];
let altera = null;             // per il motore finto: un risultato incoerente
const E = new Proxy(REALE, {
  get(t, k) {
    if (!REGISTRATE.includes(k)) return t[k];
    return (...args) => {
      let r = t[k](...args);
      if (k === 'erroriSessione' && altera) r = altera(r);
      chiamate.push({ f: k, args, r });
      return r;
    };
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

const stessa = (a, b) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);
const ids = (l) => (Array.isArray(l) ? l.map((x) => x && x.id) : l);
const nomi = (cs) => cs.map((c) => c.f).join(', ') || 'nessuna';

/** Si esegue senza lanciare; altrimenti rosso che dice perche'. */
function riuscita(g, nome, run) {
  if (!run.errore) return true;
  const m = run.errore.message;
  check(g, nome + ': si esegue', false, 'lancia: ' + m
    + (run.errore instanceof ReferenceError ? ' — il raccordo deve dipendere solo dai suoi argomenti, '
      + 'da E e dalle funzioni di primo livello' : '')
    + (run.errore instanceof TypeError && /read.only|frozen|not extensible|Cannot (assign|add|delete)/i.test(m)
      ? ' — ha provato a scrivere nella fonte: leggere un\'attivita\' non cambia le righe' : ''));
  return false;
}

/** Nessuna selezione fuori da erroriSessione(), e i confini delle sessioni. */
function motore(g, nome, run, erroriAttese) {
  const sel = run.chiamate.filter((c) => SELEZIONI.includes(c.f));
  check(g, nome + ': nessuna selezione oltre E.erroriSessione()', !sel.length,
    'chiamate: ' + nomi(sel) + ' — la riprova sono gli errori di quell\'attivita\', non un ripasso ne\' una lista nuova');
  const err = run.chiamate.filter((c) => c.f === 'erroriSessione');
  if (erroriAttese != null) {
    check(g, nome + ': una sola chiamata a E.erroriSessione()', err.length === erroriAttese,
      err.length + ' chiamate — numero e lista devono venire dallo stesso risultato');
  }
  const pausa = run.chiamate.filter((c) => c.f === 'sessioni' && !(c.args[1] && c.args[1].confine === 'attivita'));
  check(g, nome + ': le sessioni si leggono con il confine dell\'attivita\'', !pausa.length,
    'E.sessioni() chiamata senza { confine: \'attivita\' }: un\'attivita\' ripresa dopo una pausa esce a meta\'');
}

// --- 1. il riepilogo: i numeri e l'istantanea dalla stessa attivita' --------

function riepilogo(sel) {
  const G = 'riepilogo';
  const casi = [];

  {
    const nome = 'Attivita\' ripresa dopo 21 minuti, con un\'altra scheda intrecciata';
    const f = fonte();
    const run = esegui(sel.riepilogoQuiz, { id: 'A', totale: 10, erroriMax: null, corrente: true }, f);
    if (riuscita(G, nome, run)) {
      const r = run.esito;
      motore(G, nome, run, 1);
      const e = run.chiamate.find((c) => c.f === 'erroriSessione');
      check(G, nome + ': erroriSessione() riceve le righe, la banca e l\'id della fonte',
        e && e.args[0] === f.righe && e.args[1] === f.banca && String(e.args[2]) === 'A',
        'argomenti: ' + (e ? JSON.stringify([e.args[0] === f.righe, e.args[1] === f.banca, e.args[2]]) : 'nessuna chiamata'));
      check(G, nome + ': e\' intera — tre risposte, non la meta\' dopo la pausa',
        r.stato === 'pronto' && r.risposte === 3 && stessa(r.righe.map((x) => x.uid), A.map((x) => x.uid)),
        `stato ${r.stato}, risposte ${r.risposte}, righe ${JSON.stringify(r.righe && r.righe.map((x) => x.uid))}`);
      check(G, nome + ': corrette 1, errate 2, non affrontate 7',
        r.corrette === 1 && r.errate === 2 && r.nonAffrontate === 7,
        JSON.stringify({ corrette: r.corrette, errate: r.errate, nonAffrontate: r.nonAffrontate })
          + ' — le non affrontate sono T meno le risposte, e non sono errori');
      check(G, nome + ': un allenamento non ha un esito da superare', r.superata === null, 'superata: ' + r.superata);
      check(G, nome + ': il confine e\' quello registrato', r.confine === 'sim_uid', 'confine: ' + r.confine);
      const p = r.riprova || {};
      check(G, nome + ': la riprova sono i due errori di qui, nell\'ordine delle risposte',
        p.stato === 'pronta' && p.quanti === 2 && stessa(p.lista, [B[0], B[2]]),
        `stato ${p.stato}, quanti ${p.quanti}, lista ${JSON.stringify(ids(p.lista))}`
          + ' — non gli errori di un\'altra attivita\', non lo stesso quesito sbagliato altrove, non tolto perche\' corretto dopo');
      check(G, nome + ': il numero e la lista sono lo stesso risultato del motore',
        e && p.quanti === e.r.quanti && stessa(p.lista, e.r.lista), 'istantanea diversa dal risultato di erroriSessione()');
      check(G, nome + ': l\'istantanea sa di quale attivita\' e\' e con quale confine',
        String(p.id) === 'A' && p.confine === 'sim_uid', JSON.stringify({ id: p.id, confine: p.confine }));
      casi.push(['A', p]);
    }
  }

  // Base e vela: due fasi, due riepiloghi, due riprove.
  for (const [id, righe, totale, erroriMax, attese, superata, nome] of [
    ['SB', SB, 20, 4, [B[20], B[25], B[30]], false, 'Simulazione base, 18 risposte su 20 e 3 errori su 4 ammessi'],
    ['SV', SV, 5, 1, [V[2]], true, 'Simulazione vela subito dopo, 1 errore su 1 ammesso'],
  ]) {
    const run = esegui(sel.riepilogoQuiz, { id, totale, erroriMax, corrente: false }, fonte());
    if (!riuscita(G, nome, run)) continue;
    const r = run.esito;
    motore(G, nome, run, 1);
    check(G, nome + ': solo le risposte di questa fase',
      r.risposte === righe.length && r.errate === attese.length && r.nonAffrontate === totale - righe.length,
      JSON.stringify({ risposte: r.risposte, errate: r.errate, nonAffrontate: r.nonAffrontate }));
    check(G, nome + (superata ? ': superata' : ': non superata — con domande senza risposta non si supera, anche entro la soglia'),
      r.superata === superata, 'superata: ' + r.superata);
    check(G, nome + ': l\'esito viene da E.esito() con la soglia della prova',
      run.chiamate.some((c) => c.f === 'esito' && c.args[1] === erroriMax && c.args[0].length === righe.length),
      'E.esito() non chiamato con le risposte della fase e erroriMax ' + erroriMax);
    check(G, nome + ': la riprova sono i suoi errori e basta',
      r.riprova && r.riprova.stato === 'pronta' && stessa(r.riprova.lista, attese),
      JSON.stringify(ids(r.riprova && r.riprova.lista)) + ' — base e vela non si uniscono');
  }

  {
    const nome = 'Confine ricostruito';
    const run = esegui(sel.riepilogoQuiz, { id: ID_REC, totale: null, erroriMax: null, corrente: false }, fonte());
    if (riuscita(G, nome, run)) {
      const r = run.esito;
      check(G, nome + ': si dichiara, nel riepilogo e nella riprova',
        r.confine === 'risposte' && r.riprova && r.riprova.confine === 'risposte',
        JSON.stringify({ confine: r.confine, riprova: r.riprova && r.riprova.confine }));
      check(G, nome + ': senza la lista originale non s\'inventano domande mancanti',
        r.risposte === 2 && r.nonAffrontate === null, JSON.stringify({ risposte: r.risposte, nonAffrontate: r.nonAffrontate }));
      check(G, nome + ': si riapre', r.riprova && r.riprova.stato === 'pronta' && stessa(r.riprova.lista, [B[40]]),
        JSON.stringify(r.riprova && { stato: r.riprova.stato, lista: ids(r.riprova.lista) }));
      casi.push(['REC', r.riprova]);
    }
  }

  {
    const nome = 'Un id con un quesito ripetuto';
    const run = esegui(sel.riepilogoQuiz, { id: 'AMB', totale: 3, erroriMax: null, corrente: false }, fonte());
    if (riuscita(G, nome, run)) {
      const r = run.esito, p = r.riprova || {};
      check(G, nome + ': il dettaglio resta leggibile', r.stato === 'pronto' && r.risposte === 3,
        JSON.stringify({ stato: r.stato, risposte: r.risposte }));
      check(G, nome + ': la riprova e\' bloccata come ambigua, non «nessun errore»',
        p.stato === 'ambigua' && p.quanti === null && !p.lista.length && (p.motivi || []).includes('quesito ripetuto'),
        JSON.stringify({ stato: p.stato, quanti: p.quanti, lista: ids(p.lista), motivi: p.motivi }));
      casi.push(['AMB', p]);
    }
  }

  {
    const nome = 'Un errore su un quesito che la banca non ha';
    const run = esegui(sel.riepilogoQuiz, { id: 'MAN', totale: 3, erroriMax: null, corrente: false }, fonte());
    if (riuscita(G, nome, run)) {
      const r = run.esito, p = r.riprova || {};
      check(G, nome + ': le errate sono due, anche se se ne riapre una', r.errate === 2,
        'errate: ' + r.errate + ' — si contano dalle risposte, non da quello che la banca riesce a riaprire');
      check(G, nome + ': la riprova e\' bloccata e nomina il mancante',
        p.stato === 'mancanti' && p.quanti === 1 && !p.lista.length && stessa(p.mancanti, ['base-99999']),
        JSON.stringify({ stato: p.stato, quanti: p.quanti, lista: ids(p.lista), mancanti: p.mancanti })
          + ' — nessun «Riprova questi 2» che ne apra 1');
      casi.push(['MAN', p]);
    }
  }

  {
    const nome = 'Simulazione consegnata senza risposte';
    const run = esegui(sel.riepilogoQuiz, { id: 'SZ', totale: 20, erroriMax: 4, corrente: true }, fonte());
    if (riuscita(G, nome, run)) {
      const r = run.esito, p = r.riprova || {};
      check(G, nome + ': il riepilogo c\'e\', con venti domande senza risposta',
        r.stato === 'pronto' && r.risposte === 0 && r.errate === 0 && r.nonAffrontate === 20 && r.superata === false,
        JSON.stringify({ stato: r.stato, risposte: r.risposte, errate: r.errate, nonAffrontate: r.nonAffrontate, superata: r.superata })
          + ' — una prova consegnata vuota non e\' un\'attivita\' sparita (§4.1)');
      check(G, nome + ': nessuna riprova', p.stato === 'nessun errore' && !p.lista.length, 'riprova: ' + p.stato);
      casi.push(['SZ', p]);
    }
  }

  for (const [nome, f, atteso] of [
    ['Un\'attivita\' dello storico che non c\'e\' piu\'', fonte(RIGHE.filter((r) => r.sim_uid !== 'A')), 'indisponibile'],
    ['Lo storico che non si legge', fonte([], { letturaFallita: true }), 'illeggibile'],
  ]) {
    const run = esegui(sel.riepilogoQuiz, { id: 'A', totale: null, erroriMax: null, corrente: false }, f);
    if (!riuscita(G, nome, run)) continue;
    const r = run.esito;
    check(G, nome + ': «' + atteso + '», non un riepilogo a zero',
      r.stato === atteso && r.riprova && r.riprova.stato === atteso && !r.riprova.lista.length,
      JSON.stringify({ stato: r.stato, riprova: r.riprova && r.riprova.stato })
        + (atteso === 'illeggibile' ? ' — un errore di lettura non si trasforma in «nessun errore»' : ''));
  }

  {
    const nome = 'Lo storico non si legge, ma l\'attivita\' appena fatta e\' in memoria';
    const run = esegui(sel.riepilogoQuiz, { id: 'A', totale: 10, erroriMax: null, corrente: true },
      fonte(A, { letturaFallita: true }));
    if (riuscita(G, nome, run)) {
      const r = run.esito;
      check(G, nome + ': riepilogo e riprova ci sono lo stesso',
        r.stato === 'pronto' && r.risposte === 3 && r.riprova && stessa(r.riprova.lista, [B[0], B[2]]),
        JSON.stringify({ stato: r.stato, risposte: r.risposte, lista: ids(r.riprova && r.riprova.lista) }));
    }
  }

  {
    const nome = 'Un motore che restituisce un conteggio diverso dalla lista';
    altera = (r) => ({ ...r, quanti: r.lista.length + 1 });
    const run = esegui(sel.riepilogoQuiz, { id: 'A', totale: 10, erroriMax: null, corrente: true }, fonte());
    altera = null;
    if (riuscita(G, nome, run)) {
      const p = run.esito.riprova || {};
      check(G, nome + ': la riprova e\' bloccata come incoerente',
        p.stato === 'incoerente' && !p.lista.length, JSON.stringify({ stato: p.stato, quanti: p.quanti, lista: ids(p.lista) })
          + ' — un pulsante «Riprova questi 3» che ne apre 2 e\' il difetto di casa');
      casi.push(['INC', p]);
    }
  }
  return casi;
}

// --- 2. il giro: riepilogo → anteprima → avvio, con i dati che cambiano ----

function giro(sel, bloccate) {
  const G = 'giro';
  const inizio = esegui(sel.riepilogoQuiz, { id: 'A', totale: 10, erroriMax: null, corrente: true }, fonte());
  if (!riuscita(G, 'riepilogo dell\'attivita\' A', inizio)) return;
  const snap = inizio.esito.riprova;
  if (!snap || snap.stato !== 'pronta') {
    check(G, 'l\'istantanea di A si riapre', false, 'stato: ' + (snap && snap.stato));
    return;
  }

  // Fra il riepilogo e l'anteprima: un tag N/L/C su un tentativo di A,
  // un'attivita' nuova in un'altra scheda, e la banca ricaricata — stessi
  // quesiti, oggetti nuovi. Nessuno dei tre cambia gli errori di A.
  const W = [q('W', B[70], false, ts(26, '12:00:00'), 'mirata'), q('W', B[71], false, ts(26, '12:01:00'), 'mirata')];
  const tag = { _t: 'g', uid: 'g002', ts: ts(26, '12:02:00'), attempt_uid: A[0].uid, tag: 'N' };
  const banca2 = congela(structuredClone(items));
  const f1 = fonte([...RIGHE, ...W, tag], { banca: banca2 });
  {
    const nome = 'Anteprima dopo un tag, un\'altra attivita\' e la banca ricaricata';
    const run = esegui(sel.anteprimaRiprova, snap, f1);
    if (riuscita(G, nome, run)) {
      const a = run.esito;
      motore(G, nome, run, 1);
      check(G, nome + ': pronta, con il numero e la lista dell\'istantanea',
        a.stato === 'pronta' && a.quanti === 2 && stessa(a.lista, snap.lista),
        JSON.stringify({ stato: a.stato, quanti: a.quanti, lista: ids(a.lista) })
          + (a.lista && a.lista[0] && a.lista[0] !== snap.lista[0] && a.lista[0].id === snap.lista[0].id
            ? ' — gli stessi id ma oggetti nuovi: l\'anteprima mostra la lista ricalcolata, non l\'istantanea' : '')
          + ' — un tag o un\'attivita\' estranea non invalidano la selezione (§6.2)');
    }
  }

  // Fra l'anteprima e Inizia: il tag si riclassifica. Ancora niente di cambiato.
  const f2 = fonte([...RIGHE, ...W, tag, { ...tag, uid: 'g003', ts: ts(26, '12:03:00'), tag: 'C' }], { banca: banca2 });
  const avvii = [];
  const avvia = (...args) => { avvii.push(args); };
  let primo = null;
  {
    const nome = 'Inizia, dopo una riclassificazione';
    const run = esegui(sel.avviaRiprova, snap, f2, avvia);
    if (riuscita(G, nome, run)) {
      const v = run.esito;
      motore(G, nome, run, 1);
      check(G, nome + ': avvia una volta', avvii.length === 1, avvii.length + ' avvii');
      const [lista, modo, o = {}] = avvii[0] || [];
      check(G, nome + ': la lista dell\'istantanea, stessi quesiti nello stesso ordine, non una rifatta',
        stessa(lista, snap.lista),
        'aperta ' + JSON.stringify(ids(lista)) + (lista && lista[0] && lista[0] !== snap.lista[0] && lista[0].id === snap.lista[0].id
          ? ' — gli stessi id ma oggetti nuovi: e\' la lista ricalcolata al clic, non quella che l\'anteprima ha promesso' : ''));
      check(G, nome + ': come ripasso, «sbagliate»', modo === 'sbagliate', 'modo: ' + modo);
      check(G, nome + ': un\'identita\' nuova, che non e\' di nessuna attivita\'',
        typeof o.simUid === 'string' && o.simUid && o.simUid !== 'A' && !SIM_UID.has(o.simUid),
        'simUid: ' + JSON.stringify(o.simUid) + ' — la riprova e\' un\'attivita\' nuova, il tentativo di prima resta com\'e\'');
      check(G, nome + ': senza timer, senza fasi, con l\'avanzamento automatico spento',
        o.auto === false && !('sim' in o) && !('fasi' in o), JSON.stringify(o));
      check(G, nome + ': dice da quale attivita\' viene', String(o.riprovaDi) === 'A', 'riprovaDi: ' + o.riprovaDi);
      check(G, nome + ': restituisce l\'identita\' che ha passato', v && v.avviata === true && v.simUid === o.simUid,
        JSON.stringify(v));
      primo = o.simUid;
    }
  }
  {
    const nome = 'Un secondo Inizia dalla stessa istantanea';
    const prima = avvii.length;
    const run = esegui(sel.avviaRiprova, snap, f2, avvia);
    if (riuscita(G, nome, run)) {
      const o = (avvii[prima] || [])[2] || {};
      check(G, nome + ': un\'altra identita\'', primo && o.simUid && o.simUid !== primo,
        JSON.stringify([primo, o.simUid]));
    }
  }

  // I dati che cambiano davvero: un import porta una risposta di A che qui
  // mancava; poi un azzeramento; poi una lettura che fallisce.
  const arrivata = q('A', B[10], false, ts(26, '10:23:00'));
  for (const [nome, f, atteso] of [
    ['Arriva una risposta di A che mancava', fonte([...RIGHE, arrivata]), 'cambiate'],
    ['L\'archivio e\' stato azzerato', fonte([]), 'indisponibile'],
    ['L\'archivio non si legge piu\'', fonte([], { letturaFallita: true }), 'illeggibile'],
  ]) {
    const run = esegui(sel.anteprimaRiprova, snap, f);
    if (riuscita(G, nome + ', anteprima', run)) {
      const a = run.esito;
      check(G, nome + ': l\'anteprima dice «' + atteso + '» e non mostra una lista',
        a.stato === atteso && !(a.lista || []).length,
        JSON.stringify({ stato: a.stato, quanti: a.quanti, lista: ids(a.lista) }));
    }
    const prima = avvii.length;
    const runv = esegui(sel.avviaRiprova, snap, f, avvia);
    if (riuscita(G, nome + ', Inizia', runv)) {
      check(G, nome + ': Inizia non avvia niente', avvii.length === prima && runv.esito && runv.esito.avviata === false,
        (avvii.length - prima) + ' avvii, ' + JSON.stringify(runv.esito) + ' — nessun elenco sostitutivo al clic');
    }
  }
  {
    const nome = 'Riaperto dopo la risposta arrivata';
    const run = esegui(sel.riepilogoQuiz, { id: 'A', totale: 10, erroriMax: null, corrente: true }, fonte([...RIGHE, arrivata]));
    if (riuscita(G, nome, run)) {
      const r = run.esito;
      check(G, nome + ': numero e lista aggiornati insieme',
        r.errate === 3 && r.riprova && r.riprova.quanti === 3 && stessa(r.riprova.lista, [B[0], B[2], B[10]]),
        JSON.stringify({ errate: r.errate, quanti: r.riprova && r.riprova.quanti, lista: ids(r.riprova && r.riprova.lista) }));
    }
  }

  // Le istantanee che non si riaprono non avviano mai niente.
  for (const [chi, p] of bloccate) {
    if (!p || p.stato === 'pronta') continue;
    const prima = avvii.length;
    const run = esegui(sel.avviaRiprova, p, fonte(), avvia);
    if (riuscita(G, 'Inizia su «' + p.stato + '» (' + chi + ')', run)) {
      check(G, 'Inizia su «' + p.stato + '» (' + chi + '): non avvia niente', avvii.length === prima,
        (avvii.length - prima) + ' avvii');
    }
  }

  // Il tentativo nuovo: il runner scrive le sue righe con l'identita' ricevuta.
  if (primo) {
    const nuove = [q(primo, B[0], false, ts(26, '12:10:00'), 'sbagliate'), q(primo, B[2], true, ts(26, '12:11:00'), 'sbagliate')];
    const f3 = fonte([...RIGHE, ...W, tag, ...nuove]);
    const run = esegui(sel.riepilogoQuiz, { id: primo, totale: 2, erroriMax: null, corrente: true }, f3);
    if (riuscita(G, 'Il riepilogo della riprova', run)) {
      const r = run.esito;
      check(G, 'Il riepilogo della riprova: solo il nuovo tentativo',
        r.risposte === 2 && r.errate === 1 && r.nonAffrontate === 0 && r.riprova && stessa(r.riprova.lista, [B[0]]),
        JSON.stringify({ risposte: r.risposte, errate: r.errate, lista: ids(r.riprova && r.riprova.lista) }));
    }
    const run2 = esegui(sel.riepilogoQuiz, { id: 'A', totale: 10, erroriMax: null, corrente: false }, f3);
    if (riuscita(G, 'Il riepilogo di A dopo la riprova', run2)) {
      const r = run2.esito;
      check(G, 'Il riepilogo di A dopo la riprova: invariato, il secondo tentativo non tocca il primo',
        r.errate === 2 && r.riprova && stessa(r.riprova.lista, [B[0], B[2]]),
        JSON.stringify({ errate: r.errate, lista: ids(r.riprova && r.riprova.lista) }));
    }
  }
}

// --- 3. la pagina: il raccordo, e come si collega al runner -----------------

function collegamento(script, tutte) {
  const G = 'raccordo';
  // Il raccordo e' l'unico posto in cui la pagina chiede gli errori di
  // un'attivita': una seconda chiamata, in fine() o dietro un pulsante, e' una
  // seconda fonte per lo stesso numero.
  const dentro = new Set(RACCORDO.filter((f) => tutte[f]).flatMap((f) => [...dipendenze(tutte, f)]));
  let resto = script;
  for (const f of dentro) resto = resto.replace(tutte[f], '');
  check(G, 'E.erroriSessione si chiama solo dentro il raccordo', !/\bE\.erroriSessione\b/.test(resto),
    'la pagina chiede gli errori di un\'attivita\' anche fuori da riepilogoQuiz/anteprimaRiprova/avviaRiprova');
  const chiamata = [...script.matchAll(/\bavviaRiprova\s*\(/g)].map((m) => m.index)
    .filter((i) => !/function\s+$/.test(script.slice(Math.max(0, i - 12), i)));
  check(G, 'la pagina chiama avviaRiprova() e le passa apri',
    chiamata.some((i) => /\bapri\b/.test(script.slice(i, script.indexOf(';', i) + 1 || i + 400))),
    'Inizia deve passare dal raccordo, e il raccordo deve avviare il runner: un pulsante che chiama apri() '
    + 'da se\' apre una lista che nessuno ha verificato');
  const apri = tutte.apri || '';
  check(G, 'apri() usa l\'identita\' e l\'avanzamento che il raccordo le passa',
    /\bopt\.simUid\b/.test(apri) && /\bopt\.auto\b/.test(apri),
    'senza opt.simUid il runner scrive le risposte con un altro sim_uid, e il riepilogo della riprova '
    + 'non le trova; senza opt.auto l\'avanzamento automatico resta quello globale');
}

// --- la pagina ---------------------------------------------------------------

const pagina = JSON.parse(readFileSync(0, 'utf8')).pagina;
const script = scriptModulo(pagina);
const tutte = funzioni(script);
const G = 'raccordo';
check(G, 'la pagina ha uno script', script.length > 0, 'nessun <script type="module">');
for (const f of RACCORDO) {
  check(G, 'la pagina dichiara ' + f + '()', !!tutte[f],
    'il ciclo progettato passa da tre funzioni di raccordo: il contratto e\' in docs/area-3-progetto.md §10.1');
}
if (RACCORDO.every((f) => tutte[f])) {
  const sel = {};
  try {
    for (const f of RACCORDO) {
      sel[f] = new Function('E', '"use strict";\n' + conDipendenze(tutte, f) + '\nreturn ' + f + ';')(E);
    }
  } catch (e) {
    check(G, 'il raccordo si legge', false, e.message);
  }
  if (RACCORDO.every((f) => sel[f])) {
    const bloccate = riepilogo(sel);
    giro(sel, bloccate);
  }
  collegamento(script, tutte);
}

process.stdout.write(JSON.stringify(verifiche));
