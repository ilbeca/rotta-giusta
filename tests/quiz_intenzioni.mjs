// Il banco del regime progettato dei quiz: le cinque intenzioni dell'area 2.
//
// Lo chiama tests/test_interfaccia.py, e non gira da solo sotto `node --test`:
// legge da stdin `{"pagina": "<testo di una pagina>"}` e scrive su stdout la
// lista delle verifiche, `[{gruppo, nome, ok, extra}]`.
//
// Perche' non basta leggere i nomi. Il 26 settembre 2026 il progetto dell'area
// 2 (docs/area-2-progetto.md, §6 e §10.1) ha sostituito le sei modalita' con
// cinque intenzioni, e ha chiesto che il controllo del regime nuovo eserciti
// **le funzioni e i parametri**: un elenco di cinque nomi giusti puo' aprire la
// lista sbagliata, con il numero sbagliato, e nessun test che guarda i nomi se
// ne accorge. E' il difetto di casa — il numero promesso e la lista che si apre
// da due fonti diverse — spostato dal motore alla colla fra pagina e motore.
//
// Che cosa fa. Estrae dalla pagina `selezioneQuiz(intenzione, conf, fonte)` e
// le funzioni di primo livello che chiama, la esegue con la banca vera, uno
// storico sintetico e un `E` che registra ogni chiamata alle funzioni di
// selezione **e poi esegue quella vera**. Poi confronta chiamate, parametri e
// lista restituita con la tabella del §6. Il contratto per esteso sta nel §10.1
// di docs/area-2-progetto.md.
//
// Che cosa NON fa. Non guarda la gerarchia visiva (il giro dietro un
// disclosure), i testi, il focus, i ritorni: sono collaudo a 375 e 1280 px,
// non lettura di codice. E non e' un parser JavaScript: l'estrazione segue le
// parentesi saltando stringhe, template, commenti ed espressioni regolari.
// Basta per una pagina scritta a mano; se un giorno non bastasse, il sintomo
// sarebbe un rosso che dice «non riesco a leggere», che e' il verso giusto.

import { readFileSync } from 'node:fs';
import * as REALE from '../site/engine.js';

const RADICE = new URL('..', import.meta.url);
const INTENZIONI = ['mirata', 'argomento', 'sbagliate', 'sim', 'screening'];
// Le funzioni del motore che scelgono domande. Solo queste si registrano: le
// altre (`classifica`, `ritmo`, `isoLocale`…) passano dritte, perche' la pagina
// e' libera di usarle e non decidono che cosa si apre.
const SELEZIONI = ['mirata', 'daAllenare', 'coda', 'screening', 'lunghezzaScreening',
  'simulazione', 'simulazioneVela', 'estrai', 'estraiNuoviPrima', 'giroTecniche',
  'tappeto', 'erroriSessione'];

const verifiche = [];
function check(gruppo, nome, ok, extra = '') {
  verifiche.push({ gruppo, nome, ok: !!ok, extra: ok ? '' : extra });
}

// --- leggere la pagina, senza eseguirla -----------------------------------

/** L'indice della parentesi che chiude quella in `i`, saltando cio' che non e' codice. */
function chiusa(src, i) {
  const coppie = { '(': ')', '[': ']', '{': '}' };
  const pila = [];
  let prec = '';                       // l'ultimo carattere significativo
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); if (j < 0) return -1; continue; }
    if (c === '/' && src[j + 1] === '*') { j = src.indexOf('*/', j + 2); if (j < 0) return -1; j++; continue; }
    if (c === '"' || c === "'") { j = stringa(src, j, c); prec = 'a'; continue; }
    if (c === '`') { j = template(src, j); prec = 'a'; continue; }
    if (c === '/' && regexQui(src, j, prec)) { j = regex(src, j); prec = 'a'; continue; }
    if (coppie[c]) pila.push(coppie[c]);
    else if (c === ')' || c === ']' || c === '}') {
      if (pila.pop() !== c) return -1;
      if (!pila.length) return j;
    }
    if (!/\s/.test(c)) prec = c;
  }
  return -1;
}
function stringa(src, j, q) {
  for (j++; j < src.length; j++) {
    if (src[j] === '\\') { j++; continue; }
    if (src[j] === q) return j;
  }
  return src.length;
}
function template(src, j) {
  for (j++; j < src.length; j++) {
    if (src[j] === '\\') { j++; continue; }
    if (src[j] === '`') return j;
    if (src[j] === '$' && src[j + 1] === '{') { j = chiusa(src, j + 1); if (j < 0) return src.length; }
  }
  return src.length;
}
function regexQui(src, j, prec) {
  if (!prec || '(,=:[!&|?{};+-*%<>~^'.includes(prec)) return true;
  const prima = src.slice(Math.max(0, j - 12), j).match(/([A-Za-z]+)\s*$/);
  return !!prima && ['return', 'typeof', 'case', 'in', 'of', 'delete', 'void', 'throw', 'new'].includes(prima[1]);
}
function regex(src, j) {
  let classe = false;
  for (j++; j < src.length; j++) {
    const c = src[j];
    if (c === '\\') { j++; continue; }
    if (c === '[') classe = true;
    else if (c === ']') classe = false;
    else if (c === '/' && !classe) { while (/\w/.test(src[j + 1] || '')) j++; return j; }
    else if (c === '\n') return j;
  }
  return src.length;
}

/** {nome: testo} delle funzioni dichiarate al primo livello dello script. */
function funzioni(script) {
  const out = {};
  const re = /^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/gm;
  let m;
  while ((m = re.exec(script))) {
    const par = script.indexOf('(', m.index + m[0].length - 1);
    const fp = chiusa(script, par);
    if (fp < 0) continue;
    const graffa = script.slice(fp + 1).search(/\S/) + fp + 1;
    if (script[graffa] !== '{') continue;
    const fine = chiusa(script, graffa);
    if (fine < 0) continue;
    out[m[1]] = script.slice(m.index, fine + 1);
  }
  return out;
}

/** La funzione `nome` e, per chiusura, le funzioni di primo livello che nomina. */
function conDipendenze(tutte, nome) {
  const presi = new Set([nome]);
  const coda = [nome];
  while (coda.length) {
    const testo = tutte[coda.pop()];
    for (const altra of Object.keys(tutte)) {
      if (presi.has(altra)) continue;
      // Anche un nome dopo un punto: `...argomenti(conf)` e' una chiamata, e
      // una funzione presa in piu' non fa danni, una mancata si'.
      if (new RegExp('(?<![\\w$])' + altra.replace(/\$/g, '\\$') + '\\b').test(testo)) {
        presi.add(altra); coda.push(altra);
      }
    }
  }
  return [...presi].map((n) => tutte[n]).join('\n\n');
}

// --- la fonte: la banca vera, uno storico sintetico ------------------------

const items = JSON.parse(readFileSync(new URL('site/dati/quiz.json', RADICE), 'utf8'));
const meta = JSON.parse(readFileSync(new URL('site/dati/meta.json', RADICE), 'utf8'));
const OGGI = '2026-09-26';
const base = items.filter((x) => x.k === 'base');
const vela = items.filter((x) => x.k === 'vela');
// Uno storico piccolo ma con tutte le forme: errori aperti, un errore ripreso,
// una risposta giusta, un errore nella vela. Sono i casi del §10.2 in cui la
// lista disponibile, `daFare` e il ripasso non coincidono.
const prog = {};
const rispondi = (it, ok, giorno) => REALE.applica(prog, it.id, ok, 12000, giorno);
rispondi(base[0], false, '2026-09-20');
rispondi(base[1], false, '2026-09-21');
rispondi(base[2], false, '2026-09-18'); rispondi(base[2], true, '2026-09-22');
rispondi(base[3], true, '2026-09-22');
rispondi(vela[0], false, '2026-09-23');
// Le condizioni della prova vengono da `meta.prove` e dai pesi: una copia con
// numeri diversi da quelli veri fa diventare rossa una pagina che li scrive a
// mano invece di leggerli — 5 domande di vela scritte come costante passerebbero
// su qualunque fonte vera.
const prove = { base: { ...meta.prove.base }, vela: { ...meta.prove.vela, n: 7 } };
const pesi = { ...meta.pesi_esame };
const fonte = { items, prog, oggi: OGGI, pesi, prove, esame: '2026-10-20' };

const temi = [...new Set(base.map((x) => x.t))];
const T1 = 'MOTORI', T2 = 'METEOROLOGIA';
const V1 = base.find((x) => x.t === T1).v;
const vociVela = [...new Set(vela.map((x) => x.v))];

// --- l'esecuzione ----------------------------------------------------------

let chiamate = [];
const E = new Proxy(REALE, {
  get(t, k) {
    if (!SELEZIONI.includes(k)) return t[k];
    return (...args) => { const r = t[k](...args); chiamate.push({ f: k, args, r }); return r; };
  },
});

function esegui(sel, intenzione, conf) {
  chiamate = [];
  try {
    return { esito: sel(intenzione, JSON.parse(JSON.stringify(conf)), fonte), chiamate };
  } catch (e) {
    return { errore: e, chiamate };
  }
}

const vuoto = (a) => a == null || (Array.isArray(a) && a.length === 0);
const insieme = (a, b) => !vuoto(a) && a.length === b.length && b.every((x) => a.includes(x));
const stessa = (a, b) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);
const chiavi = (o) => Object.keys(o || {}).filter((k) => o[k] !== undefined);
const nomi = (cs) => cs.map((c) => c.f).join(', ') || 'nessuna';

/** Una sola chiamata di selezione, a `f`; altrimenti rosso che dice quali. */
function unica(g, nome, run, f) {
  if (run.errore) {
    check(g, nome + ': si apre', false, 'selezioneQuiz lancia: ' + run.errore.message
      + (run.errore instanceof ReferenceError ? ' — la selezione deve dipendere solo da '
        + 'intenzione, configurazione e fonte, piu\' E e le funzioni di primo livello' : ''));
    return null;
  }
  const cs = run.chiamate.filter((c) => c.f !== 'lunghezzaScreening');
  const ok = cs.length === 1 && cs[0].f === f;
  check(g, nome + ': chiama E.' + f + ' e nessun\'altra selezione', ok, 'chiamate: ' + nomi(run.chiamate));
  if (!ok) return null;
  const c = cs[0];
  check(g, nome + ': passa la banca, lo storico e il giorno della fonte',
    c.args[0] === items && c.args[1] === prog && c.args[2] === OGGI,
    'items, progress e oggi devono essere quelli di `fonte`, non una copia ne\' uno stato globale');
  return c;
}

/** La lista aperta e' quella restituita, con il tetto `n` e basta. */
function lista(g, nome, run, piena, n) {
  const attesa = n > 0 ? piena.slice(0, n) : piena;
  check(g, nome + ': la lista aperta e\' quella del motore' + (n > 0 ? ', tagliata a ' + n : ', intera'),
    stessa(run.esito && run.esito.lista, attesa),
    'attese ' + attesa.length + ' domande dalla stessa chiamata, trovate '
      + (run.esito && Array.isArray(run.esito.lista) ? run.esito.lista.length : 'nessuna lista'));
}

function verificaIntenzioni(sel) {
  const G = 'intenzioni';
  // Chiavi che non appartengono all'intenzione, messe apposta in ogni
  // configurazione: il §10.2 vuole che un filtro di un'altra attivita' non si
  // trasferisca. Un'implementazione che legge solo i propri campi le ignora.
  const intrusi = { soloNuovi: true, soloFigura: true, temi: [T1], voci: [V1], n: 50, perVoce: 6, prova: 'vela' };

  // Allenamento consigliato: 25 quiz base da mirata(), motivi dallo stesso risultato.
  {
    const nome = 'Allenamento consigliato';
    const run = esegui(sel, 'mirata', { ...intrusi, kind: 'vela' });
    const c = unica(G, nome, run, 'mirata');
    if (c) {
      const o = c.args[3] || {};
      check(G, nome + ': fino a 25 quiz base', o.n === 25 && (o.kind === undefined || o.kind === 'base'),
        'opzioni: ' + JSON.stringify({ n: o.n, kind: o.kind }));
      check(G, nome + ': pesi e data d\'esame dalla fonte', o.pesi === pesi && o.esame === fonte.esame,
        'pesi deve essere fonte.pesi (da meta.pesi_esame) ed esame fonte.esame');
      check(G, nome + ': nessun seme dalla pagina', o.seme === undefined,
        'la Mirata e\' deterministica sul giorno: il seme lo deriva il motore');
      const altre = chiavi(o).filter((k) => !['n', 'kind', 'pesi', 'esame'].includes(k));
      check(G, nome + ': nessun filtro di un\'altra attivita\'', !altre.length, 'in piu\': ' + altre.join(', '));
      check(G, nome + ': la lista e\' quella di mirata()',
        stessa(run.esito && run.esito.lista, c.r.map((x) => x.it)), 'lista diversa dal risultato');
      const p = run.esito && run.esito.perche;
      check(G, nome + ': ogni domanda porta il suo motivo, dallo stesso risultato',
        !!p && c.r.every((x) => p[x.it.id] === x.perche), 'perche\' mancante o diverso da mirata()');
    }
  }

  // Scegli un argomento: daAllenare(), g base {temi, voci}, g vela solo {voci}.
  const argomento = [
    ['Scegli un argomento, base, tutti', { kind: 'base', temi: [], voci: [], soloNuovi: false, soloFigura: false, n: 20 },
      'base', [], [], false],
    ['Scegli un argomento, base, due temi con figura, Tutte', { kind: 'base', temi: [T1, T2], voci: [], soloNuovi: false, soloFigura: true, n: 0 },
      'base', [T1, T2], [], true],
    ['Scegli un argomento, base, un tema e una voce', { kind: 'base', temi: [T1], voci: [V1], soloNuovi: false, soloFigura: false, n: 100 },
      'base', [T1], [V1], false],
    ['Scegli un argomento, vela, due voci', { kind: 'vela', temi: [], voci: vociVela.slice(0, 2), soloNuovi: false, soloFigura: false, n: 50 },
      'vela', [], vociVela.slice(0, 2), false],
  ];
  for (const [nome, conf, kind, tt, vv, fig] of argomento) {
    const run = esegui(sel, 'argomento', { perVoce: 6, prova: 'vela', ...conf });
    const c = unica(conf.soloFigura ? 'filtri' : G, nome, run, 'daAllenare');
    if (!c) continue;
    const g = c.args[4] || {};
    check(G, nome + ': banca ' + kind, c.args[3] === kind, 'kind passato: ' + c.args[3]);
    check(G, nome + ': argomenti come li ha scelti',
      (tt.length ? insieme(g.temi, tt) : vuoto(g.temi)) && (vv.length ? insieme(g.voci, vv) : vuoto(g.voci)),
      'temi ' + JSON.stringify(g.temi) + ', voci ' + JSON.stringify(g.voci)
        + (kind === 'vela' ? ' — per la vela si passano solo le voci: i suoi quesiti hanno tutti il tema VELA' : ''));
    check('filtri', nome + ': solo con figura ' + (fig ? 'acceso' : 'spento'), !!g.soloFigura === fig,
      'soloFigura passato: ' + g.soloFigura);
    const altre = chiavi(g).filter((k) => !['temi', 'voci', 'soloFigura'].includes(k));
    check(G, nome + ': nessun parametro che daAllenare() non chiede', !altre.length, 'in piu\': ' + altre.join(', '));
    lista(G, nome, run, c.r.lista, conf.n);
    check(G, nome + ': totale e da fare dalla stessa chiamata',
      run.esito.totale === c.r.lista.length && run.esito.daFare === c.r.daFare,
      `totale ${run.esito.totale} (atteso ${c.r.lista.length}), daFare ${run.esito.daFare} (atteso ${c.r.daFare})`);
  }

  // Solo domande mai fatte: coda() con stati ['nuovo'], intera, poi il tetto.
  {
    const nome = 'Scegli un argomento, solo mai fatte';
    const conf = { kind: 'base', temi: [T1], voci: [], soloNuovi: true, soloFigura: true, n: 20, perVoce: 6 };
    const run = esegui(sel, 'argomento', conf);
    const c = unica('filtri', nome, run, 'coda');
    if (c) {
      const o = c.args[3] || {};
      check('filtri', nome + ': chiede i soli mai visti', insieme(o.stati, ['nuovo']), 'stati: ' + JSON.stringify(o.stati));
      check('filtri', nome + ': conserva argomenti e figura', o.kind === 'base' && insieme(o.temi, [T1])
        && vuoto(o.voci) && o.soloFigura === true, JSON.stringify({ kind: o.kind, temi: o.temi, voci: o.voci, soloFigura: o.soloFigura }));
      check('filtri', nome + ': il totale e\' la coda intera (n: 0)', o.n === 0, 'n passato: ' + o.n);
      check('filtri', nome + ': non e\' un ripasso', !o.soloSbagliate && !o.includiChiusi,
        JSON.stringify({ soloSbagliate: o.soloSbagliate, includiChiusi: o.includiChiusi }));
      lista('filtri', nome, run, c.r, conf.n);
      check('filtri', nome + ': totale dalla stessa chiamata', run.esito.totale === c.r.length,
        `totale ${run.esito.totale}, atteso ${c.r.length}`);
    }
  }

  // Ripassa gli errori: coda({soloSbagliate}), niente mai fatte, niente figura.
  for (const [nome, conf, kind, tt, vv] of [
    ['Ripassa gli errori, base', { kind: 'base', temi: [], voci: [], n: 20 }, 'base', [], []],
    ['Ripassa gli errori, vela, una voce', { kind: 'vela', temi: [], voci: vociVela.slice(0, 1), n: 0 }, 'vela', [], vociVela.slice(0, 1)],
  ]) {
    const run = esegui(sel, 'sbagliate', { soloNuovi: true, soloFigura: true, perVoce: 6, prova: 'vela', ...conf });
    const c = unica(G, nome, run, 'coda');
    if (!c) continue;
    const o = c.args[3] || {};
    check(G, nome + ': chiede gli sbagliati, interi', o.soloSbagliate === true && o.n === 0,
      JSON.stringify({ soloSbagliate: o.soloSbagliate, n: o.n }));
    check(G, nome + ': banca e argomenti', o.kind === kind
      && (tt.length ? insieme(o.temi, tt) : vuoto(o.temi)) && (vv.length ? insieme(o.voci, vv) : vuoto(o.voci)),
      JSON.stringify({ kind: o.kind, temi: o.temi, voci: o.voci }));
    check('filtri', nome + ': non riceve i filtri della scelta per argomento', vuoto(o.stati) && !o.soloFigura,
      'stati ' + JSON.stringify(o.stati) + ', soloFigura ' + o.soloFigura
        + ' — «solo mai fatte» e «solo con figura» stanno solo in Scegli un argomento');
    lista(G, nome, run, c.r, conf.n);
    check(G, nome + ': totale dalla stessa chiamata', run.esito.totale === c.r.length,
      `totale ${run.esito.totale}, atteso ${c.r.length}`);
  }

  // Un giro tra gli argomenti: screening(), e il numero da lunghezzaScreening().
  for (const [kind, perVoce, seme] of [['base', 4, 42], ['vela', 2, 7]]) {
    const nome = `Un giro tra gli argomenti, ${kind}, ${perVoce} per voce`;
    const run = esegui(sel, 'screening', { ...intrusi, kind, perVoce, seme });
    const c = unica(G, nome, run, 'screening');
    if (!c) continue;
    check(G, nome + ': banca, profondita\' e seme della configurazione',
      c.args[3] === perVoce && c.args[4] === kind && c.args[5] === seme,
      JSON.stringify(c.args.slice(3)));
    check(G, nome + ': la lista e\' quella di screening()', stessa(run.esito.lista, c.r), 'lista diversa');
    const l = run.chiamate.filter((x) => x.f === 'lunghezzaScreening');
    check(G, nome + ': il numero promesso viene da E.lunghezzaScreening(), contando la banca',
      l.length === 1 && l[0].args[0] === items && l[0].args[1] === perVoce && l[0].args[2] === kind
        && run.esito.previsto === l[0].r,
      'lunghezzaScreening chiamata ' + l.length + ' volte; previsto ' + run.esito.previsto);
  }

  // Simula la prova: nessun filtro personale, condizioni da meta.
  for (const [prova, f, quarto] of [['base', 'simulazione', pesi], ['vela', 'simulazioneVela', prove.vela.n]]) {
    const nome = 'Simula la prova, ' + prova;
    const run = esegui(sel, 'sim', { ...intrusi, kind: prova === 'base' ? 'vela' : 'base', prova, seme: 42 });
    const c = unica(G, nome, run, f);
    if (!c) continue;
    check(G, nome + (prova === 'base' ? ': composizione da meta.pesi_esame' : ': quantita\' da meta.prove.vela.n'),
      c.args[3] === quarto, 'passato: ' + JSON.stringify(c.args[3]) + ' — le condizioni della prova si leggono '
        + 'dalla fonte, non si scrivono in pagina');
    check(G, nome + ': il seme della configurazione', c.args[4] === 42, 'seme: ' + c.args[4]);
    check(G, nome + ': nient\'altro', c.args.length === 5, c.args.length + ' argomenti');
    check(G, nome + ': la lista e\' quella del motore', stessa(run.esito.lista, c.r), 'lista diversa');
  }
}

// --- la pagina ---------------------------------------------------------------

const pagina = JSON.parse(readFileSync(0, 'utf8')).pagina;
const blocchi = [...pagina.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const script = blocchi.join('\n');
const G = 'intenzioni';
check(G, 'la pagina ha uno script', script.length > 0, 'nessun <script type="module">');

const m = script.match(/const MODI = \[([\s\S]*?)\];/);
const dichiarate = m ? [...m[1].matchAll(/(?:\[\s*|\b(?:k|chiave)\s*:\s*)'([a-z]+)'/g)].map((x) => x[1]) : [];
for (const k of INTENZIONI) {
  check(G, 'l\'intenzione «' + k + '» e\' dichiarata in MODI', dichiarate.includes(k), 'sparita');
  check(G, 'l\'intenzione «' + k + '» ha una porta',
    pagina.includes('data-modo="' + k + '"') || (dichiarate.includes(k) && pagina.includes('data-modo="${')),
    'nessun elemento con data-modo="' + k + '", ne\' porte generate da MODI');
}
check(G, 'Batteria non e\' piu\' un ingresso', !dichiarate.includes('batteria') && !pagina.includes('data-modo="batteria"'),
  'il suo mestiere sta in «Scegli un argomento» con «Tutti gli argomenti» (area 2, §2)');
check(G, 'nessuna intenzione non progettata', dichiarate.every((k) => INTENZIONI.includes(k)),
  'in piu\': ' + dichiarate.filter((k) => !INTENZIONI.includes(k)).join(', '));
check(G, 'totScreening() non esiste piu\'', !/\btotScreening\b/.test(script),
  'il numero del giro contava meta.json: lo sostituisce E.lunghezzaScreening() (area 2, §6)');

const tutte = funzioni(script);
check(G, 'la pagina dichiara selezioneQuiz(intenzione, conf, fonte)', !!tutte.selezioneQuiz,
  'e\' il punto in cui la configurazione diventa una chiamata al motore: il contratto e\' in '
  + 'docs/area-2-progetto.md §10.1');
if (tutte.selezioneQuiz) {
  let sel = null;
  try {
    sel = new Function('E', '"use strict";\n' + conDipendenze(tutte, 'selezioneQuiz') + '\nreturn selezioneQuiz;')(E);
  } catch (e) {
    check(G, 'selezioneQuiz si legge', false, e.message);
  }
  if (sel) verificaIntenzioni(sel);
}

process.stdout.write(JSON.stringify(verifiche));
