// Il banco del Carteggio — l'area 4, per la sua realizzazione (P-21).
//
// Lo chiama tests/test_interfaccia.py, e non gira da solo sotto `node --test`:
// legge da stdin `{"pagina": "<testo di una pagina>"}` e scrive su stdout la
// lista delle verifiche, `[{gruppo, nome, ok, extra}]`.
//
// Perche' non bastano i test del motore. `provaCarteggio()` (P-32),
// `attivitaCarteggio()` e `dettaglioCarteggio()` (P-33), e le funzioni della
// bozza (P-34) contano giusto: R-SEL-12…16, R-FLU-12…22, R-BOZZA-01…04. Ma la
// pagina puo' chiamarle e poi scrivere a mano 60 minuti e l'assunzione di
// Q-CART4, tenere la sua `componiProva()`, avviare una lista diversa da quella
// annunciata, scrivere le righe senza legame o con uid nuovi a ogni ritento,
// contare «da rivedere» filtrando le righe da se', offrire una riprova che il
// progetto non prevede — e nessun test del motore se ne accorge. E' il difetto
// di casa, il numero promesso e la lista che si apre da due fonti, spostato
// nella colla fra pagina e motore: P-06 lo ha chiuso per i quiz, P-31 per il
// loro ciclo, P-44 per la mappa, questo per il Carteggio (docs/area-4-progetto.md
// §10.1, D-04).
//
// Che cosa fa. Estrae dalla pagina le cinque funzioni di raccordo —
// `preparaCarteggio`, `avviaCarteggio`, `concludiCarteggio`, `rispostaTecnica`,
// `riepilogoCarteggio` — con le funzioni di primo livello che nominano, e le
// esegue con le banche vere, specchi sintetici e un `E` che registra ogni
// chiamata e poi esegue quella vera. Due valori tornano dal banco invece che
// dal motore: il testo dell'assunzione di Q-CART4 e i minuti della prova. Una
// pagina che li scrive a mano da' un valore diverso da quello «del motore», e
// il rosso lo dice — con i valori veri passerebbe per coincidenza, come la
// prova vela da 5 domande di P-06. La fonte e il lavoro sono congelati: una
// funzione che li scrive lancia. Poi fa il giro preparazione → avvio →
// conclusione → riepilogo, con i dati che cambiano fra un clic e l'altro.
//
// Che cosa NON fa. Non guarda i testi, i materiali, la guida, la consegna a due
// tocchi, il confronto affiancato, il giudizio rinviato come stato della
// pagina, i ritorni, il focus e la geometria: sono DOM e browser, e restano al
// collaudo della realizzazione (§10.2 del progetto). Il giudizio di chi studia
// prima dell'avvio (R-UX-03) lo guarda il banco del browser, in C-01. Una
// pagina che scrivesse in schermata numeri presi da un'altra parte invece che
// dal risultato del raccordo passerebbe: del collegamento il banco legge solo
// che il raccordo sia l'unico a chiedere selezioni, righe e dettaglio.

import { readFileSync } from 'node:fs';
import * as REALE from '../site/engine.js';
import { funzioni, conDipendenze, dipendenze, scriptModulo } from './pagina_js.mjs';

const RADICE = new URL('..', import.meta.url);
const RACCORDO = ['preparaCarteggio', 'avviaCarteggio', 'concludiCarteggio', 'rispostaTecnica', 'riepilogoCarteggio'];
// Le funzioni del motore che scelgono, contano o scrivono righe. Nel raccordo
// ci sono, ognuna al suo posto, provaCarteggio, giroTecniche, tappeto e coda
// (preparazione), nuovaBozza (avvio), concludiBozza (conclusione) e
// dettaglioCarteggio (riepilogo). Le altre sono una seconda fonte: estrai() per
// ricomporre la prova, attivitaCarteggio() o sessioni() per ricontare,
// erroriSessione() per una riprova che il Carteggio non ha (§7.3).
const REGISTRATE = ['provaCarteggio', 'giroTecniche', 'tappeto', 'coda', 'estrai', 'estraiNuoviPrima', 'rimescola',
  'attivitaCarteggio', 'dettaglioCarteggio', 'sessioni', 'erroriSessione', 'esito', 'nuovaBozza', 'concludiBozza',
  'modificaBozza', 'daAllenare', 'mirata', 'screening', 'classifica'];

const verifiche = [];
function check(gruppo, nome, ok, extra = '') {
  verifiche.push({ gruppo, nome, ok: !!ok, extra: ok ? '' : extra });
}

// --- le banche vere, e storici di forme diverse -------------------------------

function congela(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x) && !(x instanceof Set)) {
    Object.freeze(x);
    for (const v of Object.values(x)) congela(v);
  }
  return x;
}
const CART = congela(JSON.parse(readFileSync(new URL('site/dati/carteggio.json', RADICE), 'utf8')));
const TEC = congela(JSON.parse(readFileSync(new URL('site/dati/tecniche.json', RADICE), 'utf8')));
const OGGI = '2026-09-30';
const ADESSO = Date.parse('2026-09-30T10:00:00+02:00');
const TS = '2026-09-30T10:50:00+02:00';
const ARGOMENTI = REALE.PROVA_CARTEGGIO.argomenti;

// Due valori del banco al posto di quelli del motore (vedi in testa).
const ASSUNZIONE = 'Q-CART4, come la da\' il banco: un esercizio per argomento e\' un\'assunzione del sito.';
const MINUTI = 47;
const PROVA_BANCO = Object.freeze({ ...REALE.PROVA_CARTEGGIO, minuti: MINUTI, assunzione: ASSUNZIONE });
/** Il risultato di provaCarteggio() come lo vede la pagina: il motore, con i due valori del banco. */
function provaDelBanco(...args) {
  const r = REALE.provaCarteggio(...args);
  return { ...r, assunzione: ASSUNZIONE, condizioni: { ...r.condizioni, minuti: MINUTI } };
}

function specchio(ids, giorno = '2026-09-20') {
  const p = {};
  for (const id of ids) REALE.applica(p, id, true, 600000, giorno);
  return congela(p);
}
const carburante = CART.filter((e) => e.argomento === 'carburante').map((e) => e.id);
// Tre esercizi in testa al foglio e tutto il carburante: il tappeto salta i
// primi, e la variante «prima i mai provati» deve riprendere sul carburante.
const QUALCHE = specchio([...CART.slice(0, 3).map((e) => e.id), ...carburante]);
const TUTTO = specchio(CART.map((e) => e.id));
const TQUALCHE = specchio(TEC.slice(0, 5).map((e) => e.id));

const fonte = (extra = {}) => congela({
  banca: CART, specchio: QUALCHE, tecniche: TEC, specchioTecniche: TQUALCHE, righe: [],
  oggi: OGGI, adesso: ADESSO, ts: TS, letturaFallita: false, ...extra,
});

// --- l'esecuzione ----------------------------------------------------------

let chiamate = [];
const E = new Proxy(REALE, {
  get(t, k) {
    if (k === 'PROVA_CARTEGGIO') return PROVA_BANCO;
    if (!REGISTRATE.includes(k)) return t[k];
    const vera = k === 'provaCarteggio' ? provaDelBanco : t[k];
    return (...args) => { const r = vera(...args); chiamate.push({ f: k, args, r }); return r; };
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
const ids = (l) => (Array.isArray(l) ? l.map((x) => x && x.id) : l);
const nomi = (cs) => cs.map((c) => c.f).join(', ') || 'nessuna';
const breve = (x) => { const s = JSON.stringify(x); return s && s.length > 160 ? s.slice(0, 160) + '…' : s; };
const carteDi = (l) => [...new Set(l.map((e) => e.carta ?? null))];

/** Si esegue senza lanciare; altrimenti rosso che dice perche'. */
function riuscita(g, nome, run) {
  if (!run.errore) return true;
  const m = run.errore.message;
  check(g, nome + ': si esegue', false, 'lancia: ' + m
    + (run.errore instanceof ReferenceError ? ' — il raccordo deve dipendere solo dai suoi argomenti, '
      + 'da E e dalle funzioni di primo livello' : '')
    + (run.errore instanceof TypeError && /read.only|frozen|not extensible|Cannot (assign|add|delete)/i.test(m)
      ? ' — ha provato a scrivere nella fonte o nel lavoro: il raccordo non cambia i dati' : ''));
  return false;
}

// --- 1. la preparazione: la lista annunciata, dal motore ---------------------

const SELEZIONI = ['provaCarteggio', 'giroTecniche', 'tappeto', 'coda', 'estrai', 'estraiNuoviPrima', 'rimescola',
  'daAllenare', 'mirata', 'screening'];
const VUOTI = { carte: null, motivi: null, condizioni: null, assunzione: null, variante: null, argomenti: null,
  mancanti: null, completamento: null, riprese: null };

/** Che cosa la preparazione deve dire, dal motore sugli stessi dati: e' il riferimento, non una seconda implementazione. */
function attesa(scelta, f) {
  const tec = scelta.attivita === 'tecniche';
  const banca = tec ? f.tecniche : f.banca;
  const vuota = (stato) => ({ stato, lista: [], ...VUOTI, carte: tec ? null : [], chiamata: null });
  if (!Array.isArray(banca) || !banca.length) return vuota('senza banca');
  if ((scelta.attivita !== 'prova' || scelta.nuoviPrima) && f.letturaFallita) return vuota('illeggibile');
  if (scelta.attivita === 'prova') {
    const r = provaDelBanco(banca, f.specchio, f.oggi, { seme: scelta.seme, nuoviPrima: !!scelta.nuoviPrima });
    return { stato: r.pronta ? 'pronta' : 'corta', lista: r.lista, carte: r.carte, motivi: null, condizioni: r.condizioni,
      assunzione: r.assunzione, variante: r.variante, argomenti: r.argomenti, mancanti: r.mancanti,
      completamento: r.completamento, riprese: r.riprese, chiamata: 'provaCarteggio' };
  }
  if (scelta.attivita === 'giro-tecniche') {
    const g = REALE.giroTecniche(banca, f.specchio);
    const lista = g.map((x) => x.e);
    return { stato: lista.length ? 'pronta' : 'vuota', lista, ...VUOTI, carte: carteDi(lista), motivi: g.map((x) => x.tecniche),
      chiamata: 'giroTecniche' };
  }
  if (scelta.attivita === 'tappeto') {
    const lista = REALE.tappeto(banca, f.specchio, 4);
    return { stato: lista.length ? 'pronta' : 'foglio finito', lista, ...VUOTI, carte: carteDi(lista), chiamata: 'tappeto' };
  }
  const voci = banca.map((e) => ({ id: e.id, k: 'tec', _e: e }));
  const lista = REALE.coda(voci, f.specchioTecniche, f.oggi, { n: 15 }).map((x) => x._e);
  return { stato: lista.length ? 'pronta' : 'vuota', lista, ...VUOTI, chiamata: 'coda' };
}

function preparazione(nome, scelta, f, premessa) {
  const g = 'preparazione';
  const run = esegui(preparaCarteggio, scelta, f);
  if (!riuscita(g, nome, run)) return null;
  const p = run.esito || {};
  const a = attesa(scelta, f);
  if (premessa) premessa(a);
  const sel = run.chiamate.filter((c) => SELEZIONI.includes(c.f));
  const tec = scelta.attivita === 'tecniche';
  const banca = tec ? f.tecniche : f.banca;

  if (!a.chiamata) {
    check(g, `${nome}: «${a.stato}», senza chiedere niente al motore`, p.stato === a.stato && !sel.length
      && Array.isArray(p.lista) && p.lista.length === 0,
    `stato ${breve(p.stato)}, ${sel.length} chiamate (${nomi(sel)}), lista di ${Array.isArray(p.lista) ? p.lista.length : '—'}`
      + (a.stato === 'illeggibile' ? ' — una fonte che non si legge non diventa uno storico vuoto (§3.2): '
        + 'con {} il motore direbbe «mai provati» tutti gli esercizi' : ' — senza esercizi non c\'e\' niente da preparare'));
    return p;
  }

  // Le chiamate: una sola selezione, quella dell'attivita', con i dati della fonte.
  const c = sel[0];
  const argomentiOk = c && c.f === a.chiamata && (
    a.chiamata === 'provaCarteggio' ? c.args[0] === banca && c.args[1] === f.specchio && c.args[2] === f.oggi
      && c.args[3] && c.args[3].seme === scelta.seme && !!c.args[3].nuoviPrima === !!scelta.nuoviPrima
    : a.chiamata === 'giroTecniche' ? c.args[0] === banca && c.args[1] === f.specchio
    : a.chiamata === 'tappeto' ? c.args[0] === banca && c.args[1] === f.specchio && c.args[2] === 4
    : c.args[1] === f.specchioTecniche && c.args[2] === f.oggi && c.args[3] && c.args[3].n === 15
      && Array.isArray(c.args[0]) && c.args[0].length === banca.length && c.args[0].every((x, i) => x && x._e === banca[i]));
  check(g, `${nome}: una sola selezione, E.${a.chiamata}(), con i dati della fonte`, sel.length === 1 && argomentiOk,
    `${sel.length} chiamate (${nomi(sel)})` + (c ? ', argomenti ' + breve(c.args.slice(2).concat(c.args.length > 3 ? [] : [])) : '')
      + ({ provaCarteggio: ' — la prova si compone con provaCarteggio(banca, specchio, oggi, { seme, nuoviPrima }), '
          + 'non con estrai() o una componiProva() della pagina (D-01)',
        tappeto: ' — il tappeto apre fino a 4 esercizi (§5.2)',
        coda: ' — il riconoscimento apre fino a 15 testi, dalle tecniche della fonte (§5.3)' }[a.chiamata] || ''));
  check(g, `${nome}: la lista e' quella del motore, con gli esercizi della banca e nel suo ordine`,
    uguale(ids(p.lista), ids(a.lista)) && Array.isArray(p.lista) && p.lista.every((e, i) => e === banca.find((x) => x.id === a.lista[i].id))
      && p.quanti === a.lista.length,
    `lista ${breve(ids(p.lista))} invece di ${breve(ids(a.lista))}, quanti ${p.quanti}`);
  check(g, `${nome}: stato «${a.stato}»`, p.stato === a.stato,
    `stato ${breve(p.stato)}` + (a.stato === 'corta' ? ' — una prova che il motore non da\' pronta non si avvia chiamandola esame (§5.1)' : ''));
  const campi = ['carte', 'motivi', 'condizioni', 'assunzione', 'variante', 'argomenti', 'mancanti', 'completamento', 'riprese'];
  const diversi = campi.filter((k) => !uguale(p[k], a[k]));
  check(g, `${nome}: carte, motivi, condizioni, assunzione, variante, argomenti, mancanti, completamento e riprese dal motore`,
    !diversi.length,
    diversi.slice(0, 3).map((k) => `${k} ${breve(p[k])} invece di ${breve(a[k])}`).join('; ')
      + (diversi.includes('assunzione') || diversi.includes('condizioni')
        ? ' — condizioni e assunzione di Q-CART4 vengono da provaCarteggio() / PROVA_CARTEGGIO, non si scrivono in pagina' : '')
      + (diversi.includes('riprese') ? ' — nella prova cieca le riprese non si contano: null, non zero (R-SEL-14)' : ''));
  return p;
}

const P = (attivita, extra = {}) => congela({ attivita, seme: 7, nuoviPrima: false, ...extra });

function preparazioni() {
  const out = {};
  out.cieca = preparazione('La prova cieca', P('prova'), fonte());
  out.nuovi = preparazione('La prova «prima i mai provati»', P('prova', { nuoviPrima: true }), fonte(), (a) =>
    check('preparazione', 'il banco: la variante riprende sul carburante, che e\' tutto provato',
      Array.isArray(a.riprese) && a.riprese.some((r) => r.argomento === 'carburante'), breve(a.riprese)));
  const tre = congela(CART.filter((e) => e.argomento !== 'carburante').slice(0, 3));
  preparazione('La prova su una banca di tre esercizi', P('prova'), fonte({ banca: tre }), (a) =>
    check('preparazione', 'il banco: tre esercizi non fanno una prova', a.stato === 'corta', a.stato));
  const senzaCarb = congela(CART.filter((e) => e.argomento !== 'carburante'));
  preparazione('La prova su una banca senza carburante', P('prova'), fonte({ banca: senzaCarb }), (a) =>
    check('preparazione', 'il banco: senza carburante la prova si completa e lo dice',
      a.stato === 'pronta' && uguale(a.mancanti, ['carburante']) && a.completamento.length === 1, breve(a.mancanti)));
  preparazione('La prova cieca con la lettura fallita', P('prova'), fonte({ letturaFallita: true, specchio: congela({}) }));
  preparazione('La variante con la lettura fallita', P('prova', { nuoviPrima: true }), fonte({ letturaFallita: true, specchio: congela({}) }));
  out.giro = preparazione('Il giro delle tecniche', P('giro-tecniche'), fonte());
  const senzaTec = congela(CART.map((e) => ({ ...e, tecniche: [] })));
  preparazione('Il giro su una banca senza tecniche', P('giro-tecniche'), fonte({ banca: senzaTec }));
  out.tappeto = preparazione('Il tappeto', P('tappeto'), fonte(), (a) =>
    check('preparazione', 'il banco: il tappeto salta i tre esercizi gia\' provati', a.lista[0] && a.lista[0].id === CART[3].id,
      breve(ids(a.lista))));
  preparazione('Il tappeto a foglio finito', P('tappeto'), fonte({ specchio: TUTTO }));
  out.tecniche = preparazione('Il riconoscimento delle tecniche', P('tecniche'), fonte());
  for (const [att, nome] of [['giro-tecniche', 'Il giro'], ['tappeto', 'Il tappeto'], ['tecniche', 'Il riconoscimento']]) {
    preparazione(`${nome} con la lettura fallita`, P(att), fonte({ letturaFallita: true, specchio: congela({}), specchioTecniche: congela({}) }));
  }
  preparazione('La prova senza la banca', P('prova'), fonte({ banca: null }));
  preparazione('Il tappeto su una banca vuota', P('tappeto'), fonte({ banca: congela([]) }));
  preparazione('Il riconoscimento senza la banca delle tecniche', P('tecniche'), fonte({ tecniche: null }));
  return out;
}

// --- 2. l'avvio: la stessa lista, con un'identita' nuova ---------------------

const MODI = { prova: 'simulazione', 'giro-tecniche': 'giro-tecniche', tappeto: 'tappeto', tecniche: 'tecnica' };

/** Inizia con la fonte `f`: restituisce l'opt passato ad avvia, o null. */
function avvio(nome, prep, f, atteso) {
  const g = 'avvio';
  if (!prep) return null;
  const avvii = [];
  const run = esegui(avviaCarteggio, prep, f, (...args) => { avvii.push(args); });
  if (!riuscita(g, nome, run)) return null;
  const e = run.esito || {};
  if (atteso !== 'pronta') {
    check(g, `${nome}: Inizia non avvia niente, e dice «${atteso}»`, avvii.length === 0 && e.avviata === false && e.stato === atteso,
      `${avvii.length} avvii, avviata ${e.avviata}, stato ${breve(e.stato)}`
        + (atteso === 'cambiata' ? ' — la selezione di adesso non e\' quella annunciata: un clic non avvia una pescata '
          + 'che nessuno ha visto, e non avvia la lista vecchia come se niente fosse (§8.1)' : ''));
    return null;
  }
  const [lista, modo, opt] = avvii[0] || [];
  check(g, `${nome}: Inizia avvia una volta la lista annunciata`, avvii.length === 1 && lista === prep.lista && e.avviata === true,
    `${avvii.length} avvii, lista ${breve(ids(lista))} invece di ${breve(ids(prep.lista))}, avviata ${e.avviata}`);
  if (!opt) return null;
  const modoAtteso = MODI[prep.attivita];
  check(g, `${nome}: la modalita' e' «${modoAtteso}», con l'identita' e la quantita' proposta`,
    modo === modoAtteso && typeof opt.simUid === 'string' && !!opt.simUid && e.simUid === opt.simUid && opt.proposti === prep.quanti,
    `modo ${breve(modo)}, simUid ${breve(opt.simUid)} (restituito ${breve(e.simUid)}), proposti ${breve(opt.proposti)}`
      + ' — le righe portano sim_uid e proposti (D-02)');
  const prima = run.chiamate.filter((c) => SELEZIONI.includes(c.f));
  check(g, `${nome}: Inizia rifa' la preparazione, e non pesca altro`, prima.length === 1 && prima[0].f === attesa(prep.scelta, f).chiamata,
    `selezioni all'avvio: ${nomi(prima)} — Inizia verifica che la lista di adesso sia quella annunciata`);
  if (modoAtteso !== 'tecnica') {
    const b = opt.lavoro;
    const nb = run.chiamate.filter((c) => c.f === 'nuovaBozza');
    const motivo = b ? REALE.validaBozza(b) : 'manca';
    check(g, `${nome}: il lavoro e' una bozza di E.nuovaBozza(), in memoria, con l'identita', la lista e l'orologio della fonte`,
      nb.length === 1 && nb[0].r === b && !motivo && b.id === opt.simUid && b.modo === modoAtteso
        && uguale(b.lista, ids(prep.lista)) && b.inizio === f.adesso
        && b.variante === (modoAtteso === 'simulazione' ? prep.variante : null),
      `${nb.length} chiamate a nuovaBozza, ${motivo ? 'bozza ' + motivo : breve({ id: b.id, modo: b.modo, lista: b.lista, inizio: b.inizio, variante: b.variante })}`
        + ' — la scadenza e gli uid delle righe finali vengono dal motore, e sono gli stessi con e senza account');
  }
  if (modoAtteso === 'giro-tecniche') {
    check(g, `${nome}: il giro porta al runner le tecniche di ogni esercizio`, uguale(opt.motivi, prep.motivi),
      `motivi ${breve(opt.motivi)} — sono il «perche' e' qui» di ogni esercizio del giro (§6.1)`);
  }
  return { opt, modo, lista, simUid: e.simUid };
}

function avvii(pr) {
  const out = {};
  out.cieca = avvio('La prova cieca', pr.cieca, fonte(), 'pronta');
  const due = avvio('La prova cieca, avviata una seconda volta', pr.cieca, fonte(), 'pronta');
  if (out.cieca && due) {
    check('avvio', 'Due avvii della stessa preparazione hanno due identita\'', out.cieca.simUid !== due.simUid,
      `simUid ${breve(out.cieca.simUid)} due volte — un'attivita' nuova ha un sim_uid nuovo (D-02), e riusarlo `
        + 'cucirebbe due tentativi in un\'attivita\' ambigua');
  }
  out.nuovi = avvio('La prova «prima i mai provati»', pr.nuovi, fonte(), 'pronta');
  out.giro = avvio('Il giro delle tecniche', pr.giro, fonte(), 'pronta');
  out.tappeto = avvio('Il tappeto', pr.tappeto, fonte(), 'pronta');
  out.tecniche = avvio('Il riconoscimento delle tecniche', pr.tecniche, fonte(), 'pronta');

  // Fra un clic e l'altro. Cose che non cambiano la lista: per la prova cieca
  // lo storico, per tutte la banca ricaricata.
  if (pr.cieca) avvio('La prova cieca dopo un tappeto finito altrove', pr.cieca, fonte({ specchio: TUTTO }), 'pronta');
  if (pr.tappeto) avvio('Il tappeto con la banca ricaricata', pr.tappeto, fonte({ banca: congela(JSON.parse(JSON.stringify(CART))) }), 'pronta');
  // Cose che la cambiano: un esercizio del tappeto o del giro fatto altrove,
  // una risposta del riconoscimento, un esercizio della variante.
  if (pr.tappeto && pr.tappeto.lista && pr.tappeto.lista[0]) {
    avvio('Il tappeto dopo un suo esercizio fatto altrove', pr.tappeto,
      fonte({ specchio: specchio([...Object.keys(QUALCHE), pr.tappeto.lista[0].id]) }), 'cambiata');
  }
  if (pr.giro && pr.giro.lista && pr.giro.lista[0]) {
    const dopo = specchio([...Object.keys(QUALCHE), pr.giro.lista[0].id]);
    const cambia = !uguale(ids(REALE.giroTecniche(CART, dopo).map((x) => x.e)), ids(pr.giro.lista));
    check('avvio', 'il banco: il giro cambia quando il suo primo esercizio e\' fatto altrove', cambia, '');
    avvio('Il giro dopo un suo esercizio fatto altrove', pr.giro, fonte({ specchio: dopo }), 'cambiata');
  }
  if (pr.tecniche && pr.tecniche.lista && pr.tecniche.lista[0]) {
    avvio('Il riconoscimento dopo una risposta data altrove', pr.tecniche,
      fonte({ specchioTecniche: specchio([...Object.keys(TQUALCHE), pr.tecniche.lista[0].id]) }), 'cambiata');
  }
  if (pr.nuovi && pr.nuovi.lista) {
    const presi = ids(pr.nuovi.lista);
    const dopo = specchio([...Object.keys(QUALCHE), ...presi]);
    const cambia = !uguale(ids(REALE.provaCarteggio(CART, dopo, OGGI, { seme: 7, nuoviPrima: true }).lista), presi);
    check('avvio', 'il banco: la variante cambia quando i suoi esercizi sono fatti altrove', cambia, '');
    avvio('La variante dopo i suoi esercizi fatti altrove', pr.nuovi, fonte({ specchio: dopo }), 'cambiata');
  }
  if (pr.tappeto) avvio('Il tappeto con la lettura fallita all\'avvio', pr.tappeto, fonte({ letturaFallita: true, specchio: congela({}) }), 'illeggibile');
  const corta = esegui(preparaCarteggio, P('prova'), fonte({ banca: congela(CART.slice(0, 3)) }));
  if (!corta.errore && corta.esito) avvio('La prova corta', corta.esito, fonte({ banca: congela(CART.slice(0, 3)) }), 'corta');
  return out;
}

// --- 3. le righe: dal motore, con il legame e gli stessi uid al ritento -------

const quesitiC = new Set(CART.map((e) => e.id));
const quesitiT = new Set(TEC.map((e) => e.id));

/**
 * Il lavoro dell'avvio portato al confronto, dalle funzioni vere del motore. I
 * giudizi seguono la lunghezza della lista: `giudizio(i)` da' quello
 * dell'esercizio i. Un lavoro che il motore non accetta e' un rosso, non un
 * banco che cade: restituisce null.
 */
function giudicato(nome, lavoro, giudizio) {
  try {
    let b = REALE.modificaBozza(lavoro, { testi: lavoro.lista.map((_, i) => (i === 1 ? '' : `Risultato ${i + 1}`)) });
    b = REALE.modificaBozza(b, { fase: 'confronto', consegna: lavoro.inizio + 40 * 60000 });
    return congela(REALE.modificaBozza(b, { giudizi: lavoro.lista.map((_, i) => giudizio(i)) }));
  } catch (e) {
    check('righe', `${nome}: il lavoro dell'avvio si porta al confronto`, false,
      e.message + ' — il lavoro e\' una bozza di E.nuovaBozza(), e il motore la modifica')
    return null;
  }
}

function conclusione(nome, lavoro, f, attese) {
  const g = 'righe';
  if (!lavoro) return null;
  const run = esegui(concludiCarteggio, lavoro, f);
  if (!riuscita(g, nome, run)) return null;
  const r = run.esito || {};
  const cc = run.chiamate.filter((c) => c.f === 'concludiBozza');
  const altre = run.chiamate.filter((c) => c.f !== 'concludiBozza');
  const opt = cc[0] && cc[0].args[1];
  check(g, `${nome}: una sola chiamata a E.concludiBozza(), con il lavoro, l'istante e gli esercizi della banca`,
    cc.length === 1 && cc[0].args[0] === lavoro && opt && opt.ts === f.ts
      && (Array.isArray(f.banca) ? opt.quesiti instanceof Set && opt.quesiti.size === f.banca.length
        && f.banca.every((e) => opt.quesiti.has(e.id)) : opt.quesiti == null),
    `${cc.length} chiamate` + (opt ? `, ts ${breve(opt.ts)}, quesiti ${opt.quesiti instanceof Set ? opt.quesiti.size : breve(opt.quesiti)}` : '')
      + ' — senza gli id della banca una riga di un esercizio che non c\'e\' passerebbe (validaRiga)');
  check(g, `${nome}: nessun'altra funzione che scriva o conti`, !altre.length, 'chiamate: ' + nomi(altre));
  const vero = REALE.concludiBozza(lavoro, { ts: f.ts, quesiti: Array.isArray(f.banca) ? new Set(f.banca.map((e) => e.id)) : undefined });
  check(g, `${nome}: ${attese}`, uguale(r.righe, vero.righe) && r.motivo === vero.motivo,
    `righe ${Array.isArray(r.righe) ? r.righe.length : breve(r.righe)} invece di ${vero.righe.length}, motivo ${breve(r.motivo)} invece di ${breve(vero.motivo)}`
      + (vero.righe.length === 0 && Array.isArray(r.righe) && r.righe.length ? ' — con un giudizio rinviato nessuna riga: '
        + 'non e\' un «da rivedere» (D-03, R-FLU-18)' : ' — le righe sono quelle di concludiBozza(), senza campi rifatti'));
  return r;
}

function righe(av) {
  const out = { carta: [], tecniche: [] };
  const g = 'righe';
  if (av.cieca) {
    const L = av.cieca.opt.lavoro;
    const tutti = giudicato('La prova', L, (i) => (i === 1 ? 0 : 1));
    const r1 = conclusione('La prova giudicata tutta', tutti, fonte(), 'le righe della prova, con la riga di prova');
    const r2 = conclusione('La stessa conclusione, ritentata', tutti, fonte(), 'di nuovo le stesse righe');
    if (r1 && r2) {
      check(g, 'Un ritento della conclusione riusa gli stessi uid', uguale(ids((r1.righe || []).map((x) => ({ id: x.uid }))),
        ids((r2.righe || []).map((x) => ({ id: x.uid })))) && (r1.righe || []).length === 5,
      `uid ${breve((r1.righe || []).map((x) => x.uid))} poi ${breve((r2.righe || []).map((x) => x.uid))} — l'unione per uid `
        + 'regge un ritento solo se gli uid nascono dalla bozza (D-02)');
      const a = REALE.attivitaCarteggio(r1.righe || [], { tipo: 'c' });
      check(g, 'Le righe della prova si leggono come un\'attivita\' sola, registrata, con la sua riga di prova',
        a.length === 1 && a[0].fonte === 'sim_uid' && a[0].id === L.id && !!a[0].prova && a[0].ordine === 'registrato'
          && a[0].variante === av.cieca.opt.lavoro.variante && !a[0].ambigua,
        breve(a.map((x) => ({ id: x.id, fonte: x.fonte, prova: !!x.prova, ordine: x.ordine, motivi: x.motivi }))));
      out.carta.push(...(r1.righe || []));
    }
    conclusione('La prova con un giudizio rinviato', giudicato('La prova', L, (i) => (i === 1 ? null : 1)), fonte(), 'nessuna riga, e il motivo');
    const fuori = congela(REALE.nuovaBozza({ id: 'banco-fuori', modo: 'tappeto', lista: ['X-1', CART[0].id], inizio: ADESSO }));
    conclusione('Un lavoro con un esercizio che la banca non ha', giudicato('Un lavoro fuori banca', fuori, () => 1), fonte(),
      'nessuna riga: l\'esercizio e\' sconosciuto');
  }
  if (av.tappeto) {
    const r = conclusione('Il tappeto giudicato tutto', giudicato('Il tappeto', av.tappeto.opt.lavoro, (i) => (i === 1 || i === 2 ? 0 : 1)), fonte(),
      'le righe dell\'allenamento, senza riga di prova');
    if (r && Array.isArray(r.righe)) out.carta.push(...r.righe);
  }
  if (av.tecniche) {
    const { opt, lista } = av.tecniche;
    const corsa = congela({ simUid: opt.simUid, lista, proposti: opt.proposti });
    const casi = [];
    lista.slice(0, 4).forEach((e, pos) => {
      const at = e.tecniche;
      const altra = TEC.flatMap((x) => x.tecniche).find((t) => !at.includes(t));
      // Esatte; esatte piu' una; una in meno o una diversa; nessuna.
      const scelte = [at, [...at, altra], at.length > 1 ? at.slice(1) : [altra], []][pos];
      casi.push([pos, scelte, pos === 0 ? 1 : 0]);
    });
    for (const [pos, scelte, correct] of casi) {
      const f = congela({ ...fonte(), ms: 7000 + pos, uid: `banco-t-${pos}` });
      const run = esegui(rispostaTecnica, corsa, pos, congela([...scelte]), f);
      if (!riuscita(g, `La risposta ${pos + 1} del riconoscimento`, run)) continue;
      const r = run.esito || {};
      const e = lista[pos];
      const attesa = { _t: 't', uid: f.uid, item_id: e.id, ts: TS, correct, ms: f.ms, chosen: scelte.join('|'),
        sim_uid: opt.simUid, proposti: opt.proposti, pos };
      const diversi = Object.keys(attesa).filter((k) => !uguale(r[k], attesa[k]));
      check(g, `La risposta ${pos + 1} del riconoscimento: la riga dello schema di D-02, con il legame e l'esito esatto`,
        !diversi.length && REALE.validaRiga(r, { quesiti: quesitiT }) === null,
        diversi.slice(0, 3).map((k) => `${k} ${breve(r[k])} invece di ${breve(attesa[k])}`).join('; ')
          + (diversi.includes('correct') ? ' — «le scelte coincidono» solo se sono esattamente le tecniche dell\'esercizio (§5.3)' : '')
          + (diversi.includes('sim_uid') || diversi.includes('pos') || diversi.includes('proposti')
            ? ' — un sim_uid nuovo a ogni apriTec(), proposti e pos: senza, l\'attivita\' si ricostruisce e perde i non affrontati' : '')
          + (REALE.validaRiga(r, { quesiti: quesitiT }) ? ' — validaRiga: ' + REALE.validaRiga(r, { quesiti: quesitiT }) : ''));
      check(g, `La risposta ${pos + 1} del riconoscimento: nessuna chiamata al motore che scriva o conti`,
        !run.chiamate.length, 'chiamate: ' + nomi(run.chiamate));
      if (!diversi.length) out.tecniche.push(r);
    }
    const a = REALE.attivitaCarteggio(out.tecniche, { tipo: 't' });
    check(g, 'Le risposte del riconoscimento si leggono come un\'attivita\' sola, registrata',
      a.length === 1 && a[0].fonte === 'sim_uid' && a[0].proposti === opt.proposti && a[0].ordine === 'registrato' && !a[0].ambigua,
      breve(a.map((x) => ({ id: x.id, fonte: x.fonte, proposti: x.proposti, ordine: x.ordine }))));
  }
  return out;
}

// --- 4. il riepilogo e la revisione, dalla stessa chiamata ------------------

/** Righe di prima e attivita' estranee, intorno a quelle appena concluse. */
function storicoRicco(nuove) {
  const r = (x) => ({ ts: '2026-09-20T09:00:00+02:00', ms: 600000, delta: null, ...x });
  const risp = (t) => JSON.stringify({ risposta: t });
  const e = CART;
  return congela([
    // Quiz, con un sim_uid loro: non si mescolano.
    { _t: 'q', uid: 'q1', item_id: 'base-1', ts: '2026-09-29T09:00:00+02:00', correct: 0, ms: 9000, mode: 'argomento', kind: 'base', sim_uid: 'QZ' },
    // Una prova di prima di P-32: legame, niente variante, niente proposti.
    r({ _t: 'c', uid: 'v0', item_id: e[10].id, input_json: risp('a'), verdict: 1, mode: 'simulazione', sim_uid: 'VECCHIA' }),
    r({ _t: 'c', uid: 'v1', item_id: e[40].id, input_json: risp(''), verdict: 0, mode: 'simulazione', sim_uid: 'VECCHIA' }),
    r({ _t: 'c', uid: 'v2', item_id: e[80].id, input_json: risp('c'), verdict: 1, mode: 'simulazione', sim_uid: 'VECCHIA' }),
    r({ _t: 'c', uid: 'v3', item_id: e[120].id, input_json: risp('d'), verdict: 0, mode: 'simulazione', sim_uid: 'VECCHIA' }),
    { _t: 's', uid: 'VECCHIA', kind: 'carteggio', ts: '2026-09-20T09:00:00+02:00', score: 2, total: 4, passed: 0, ms: 3600000 },
    // Un giro di prima, senza legame: si ricostruisce per istante e modalita'.
    r({ _t: 'c', uid: 'g0', item_id: e[5].id, ts: '2026-09-21T09:00:00+02:00', input_json: risp('x'), verdict: 0, mode: 'giro-tecniche', sim_uid: null }),
    r({ _t: 'c', uid: 'g1', item_id: e[6].id, ts: '2026-09-21T09:00:00+02:00', input_json: risp('y'), verdict: 1, mode: 'giro-tecniche', sim_uid: null }),
    // Un legame ambiguo: lo stesso esercizio due volte.
    r({ _t: 'c', uid: 'm0', item_id: e[7].id, input_json: risp('x'), verdict: 0, mode: 'tappeto', sim_uid: 'AMBIGUA' }),
    r({ _t: 'c', uid: 'm1', item_id: e[7].id, input_json: risp('y'), verdict: 1, mode: 'tappeto', sim_uid: 'AMBIGUA' }),
    // Un esercizio che la banca caricata non ha.
    r({ _t: 'c', uid: 'z0', item_id: 'Z-9', input_json: risp('z'), verdict: 0, mode: 'tappeto', sim_uid: 'MANCA', proposti: 2, pos: 0 }),
    r({ _t: 'c', uid: 'z1', item_id: e[9].id, input_json: risp('w'), verdict: 1, mode: 'tappeto', sim_uid: 'MANCA', proposti: 2, pos: 1 }),
    ...nuove,
  ]);
}

function riepilogo(nome, contesto, f) {
  const g = 'riepilogo';
  const run = esegui(riepilogoCarteggio, congela({ ...contesto }), f);
  if (!riuscita(g, nome, run)) return null;
  const r = run.esito || {};
  const banca = contesto.tipo === 't' ? f.tecniche : f.banca;
  const d = REALE.dettaglioCarteggio(f.righe, banca, contesto.id, { tipo: contesto.tipo, filtro: contesto.filtro });
  const dc = run.chiamate.filter((c) => c.f === 'dettaglioCarteggio');
  const altre = run.chiamate.filter((c) => c.f !== 'dettaglioCarteggio');
  check(g, `${nome}: una sola chiamata a E.dettaglioCarteggio(), con le righe, la banca del tipo e il filtro`,
    dc.length === 1 && dc[0].args[0] === f.righe && dc[0].args[1] === banca && String(dc[0].args[2]) === String(contesto.id)
      && dc[0].args[3] && dc[0].args[3].tipo === contesto.tipo && dc[0].args[3].filtro === contesto.filtro,
    `${dc.length} chiamate` + (dc[0] ? ', argomenti ' + breve([dc[0].args[0] === f.righe, dc[0].args[1] === banca, dc[0].args[2], dc[0].args[3]]) : '')
      + ' — schede, conteggi e filtro vengono dalla stessa chiamata (R-FLU-17)');
  check(g, `${nome}: nessun'altra funzione che conti o scelga`, !altre.length,
    'chiamate: ' + nomi(altre) + ' — niente attivitaCarteggio() o sessioni() per ricontare, niente filtro sulle righe');
  const stato = !d.trovata ? (f.letturaFallita ? 'illeggibile' : 'indisponibile') : d.ambigua ? 'ambigua' : 'pronto';
  check(g, `${nome}: stato «${stato}»`, r.stato === stato,
    `stato ${breve(r.stato)}` + (stato === 'illeggibile' ? ' — una lettura fallita non e\' «questa attivita\' non c\'e\' piu\'»'
      : stato === 'ambigua' ? ' — un legame ambiguo non si dice «pronto», e non da\' numeri (R-FLU-16)' : ''));
  const campi = { confine: d.fonte, mode: d.mode, variante: d.variante, proposti: d.proposti, ordine: d.ordine, motivi: d.motivi,
    schede: d.schede, mostrate: d.mostrate, filtro: d.filtro, conteggi: d.conteggi, esito: d.esito, mancanti: d.mancanti };
  const diversi = Object.keys(campi).filter((k) => !uguale(r[k], campi[k]));
  check(g, `${nome}: schede, conteggi, esito, mancanti e confine sono quelli di dettaglioCarteggio()`, !diversi.length,
    diversi.slice(0, 3).map((k) => `${k} ${breve(r[k])} invece di ${breve(campi[k])}`).join('; ')
      + (diversi.includes('esito') ? ' — l\'esito c\'e\' solo per una prova con tutti i giudizi (R-FLU-18), e un allenamento non ha soglia' : '')
      + (diversi.includes('mancanti') ? ' — senza la banca i mancanti non si sanno: null, non «nessuno» (R-FLU-21)' : ''));
  const [fr, campo] = contesto.tipo === 't' ? ['non-coincidenti', 'nonCoincidenti'] : ['da-rivedere', 'daRivedere'];
  const quanti = d.conteggi ? d.conteggi[campo] : 0;
  check(g, `${nome}: ` + (quanti ? `«Rivedi» porta ${quanti} e il filtro «${fr}»` : 'nessun «Rivedi» da zero'),
    quanti ? uguale(r.rivedi, { filtro: fr, quanti }) : r.rivedi == null,
    `rivedi ${breve(r.rivedi)} — il numero e' conteggi.${campo}, il filtro quello che lo apre`);
  // La riprova resta dei quiz (§7.3): il gruppo e' suo, per tenerla distinta dal riepilogo.
  const ep = run.chiamate.filter((c) => ['erroriSessione', 'sessioni'].includes(c.f));
  check('riprova', `${nome}: nessuna riprova — ne' erroriSessione(), ne' un campo riprova`,
    !ep.length && !('riprova' in r),
    `${nomi(ep)}; riprova ${breve(r.riprova)} — «Riprova questi N» e' dei quiz: erroriSessione() legge solo _t:'q', `
      + 'e il seguito del Carteggio e\' una preparazione nuova con i materiali (§7.3)');
  return r;
}

function riepiloghi(av, nuove) {
  const tutte = storicoRicco([...nuove.carta, ...nuove.tecniche]);
  const f = fonte({ righe: tutte });
  const casi = [];
  if (av.cieca) casi.push(['La prova appena conclusa', { id: av.cieca.simUid, tipo: 'c' }]);
  if (av.tappeto) casi.push(['Il tappeto appena concluso', { id: av.tappeto.simUid, tipo: 'c' }]);
  casi.push(['Una prova di prima di P-32', { id: 'VECCHIA', tipo: 'c' }]);
  casi.push(['Un giro di prima, ricostruito', { id: 'r:g0', tipo: 'c' }]);
  casi.push(['Un legame ambiguo', { id: 'AMBIGUA', tipo: 'c' }]);
  casi.push(['Un esercizio che la banca non ha', { id: 'MANCA', tipo: 'c' }]);
  if (av.tecniche) casi.push(['Il riconoscimento appena concluso', { id: av.tecniche.simUid, tipo: 't' }]);
  for (const [nome, c] of casi) {
    const r = riepilogo(nome, { ...c, filtro: undefined }, f);
    if (r && r.rivedi) {
      const aperto = riepilogo(`${nome}, riaperto su «${r.rivedi.filtro}»`, { ...c, filtro: r.rivedi.filtro }, f);
      check('riepilogo', `${nome}: «Rivedi» apre esattamente le schede che conta`,
        aperto && Array.isArray(aperto.mostrate) && aperto.mostrate.length === r.rivedi.quanti,
        `${aperto && Array.isArray(aperto.mostrate) ? aperto.mostrate.length : '—'} schede invece di ${r.rivedi.quanti}`);
    }
  }
  // Il banco controlla le sue premesse: se lo storico non ha le forme che
  // servono, i confronti sopra non proverebbero niente.
  const pr = av.cieca && REALE.dettaglioCarteggio(tutte, CART, av.cieca.simUid, { tipo: 'c' });
  const ta = av.tappeto && REALE.dettaglioCarteggio(tutte, CART, av.tappeto.simUid, { tipo: 'c' });
  check('riepilogo', 'il banco: la prova ha un esito, il tappeto no, e tutti e due hanno «da rivedere»',
    pr && pr.esito && ta && ta.esito === null && pr.conteggi.daRivedere === 1 && ta.conteggi.daRivedere === 2,
    breve(pr && { esito: pr.esito, d: pr.conteggi && pr.conteggi.daRivedere }));
  check('riepilogo', 'il banco: c\'e\' una prova vecchia senza variante, un giro ricostruito, un\'ambigua e un mancante',
    REALE.dettaglioCarteggio(tutte, CART, 'VECCHIA', { tipo: 'c' }).proposti === 4
      && REALE.dettaglioCarteggio(tutte, CART, 'r:g0', { tipo: 'c' }).fonte === 'risposte'
      && REALE.dettaglioCarteggio(tutte, CART, 'AMBIGUA', { tipo: 'c' }).ambigua
      && uguale(REALE.dettaglioCarteggio(tutte, CART, 'MANCA', { tipo: 'c' }).mancanti, ['Z-9']), '');
  riepilogo('Un esercizio mancante, senza la banca', { id: 'MANCA', tipo: 'c' }, fonte({ righe: tutte, banca: null }));
  riepilogo('Un\'attivita\' che non c\'e\'', { id: 'NESSUNA', tipo: 'c' }, f);
  riepilogo('Un\'attivita\' che non si trova, con la lettura fallita', { id: av.cieca ? av.cieca.simUid : 'NESSUNA', tipo: 'c' },
    fonte({ righe: congela([]), letturaFallita: true }));
  if (av.cieca) {
    // Il giudizio rinviato non ha scritto righe: l'attivita' non c'e' ancora, e non e' un «da rivedere».
    riepilogo('Una prova con un giudizio rinviato', { id: av.nuovi ? av.nuovi.simUid : 'NESSUNA', tipo: 'c' }, f);
  }
}

// --- 5. la pagina: il raccordo, e come si collega ---------------------------

function collegamento(script, tutte) {
  const G = 'raccordo';
  const dentro = new Set(RACCORDO.filter((f) => tutte[f]).flatMap((f) => [...dipendenze(tutte, f)]));
  let resto = script;
  for (const f of dentro) resto = resto.replace(tutte[f], '');
  const fuori = ['provaCarteggio', 'giroTecniche', 'tappeto', 'dettaglioCarteggio', 'nuovaBozza', 'concludiBozza']
    .filter((f) => new RegExp('\\bE\\.' + f + '\\b').test(resto));
  check(G, 'selezioni, bozza nuova, righe finali e dettaglio del Carteggio si chiedono solo dentro il raccordo', !fuori.length,
    'fuori dal raccordo: ' + fuori.map((f) => 'E.' + f).join(', ') + ' — una seconda fonte per la stessa lista o gli stessi numeri');
  const vecchie = ['componiProva', 'argomentiSenzaNuovi'].filter((f) => tutte[f])
    .concat(['PROVA_N', 'PROVA_MIN', 'PROVA_SOGLIA', 'ARGOMENTI'].filter((c) => new RegExp('\\bconst\\s+' + c + '\\b').test(script)));
  check(G, 'la pagina non tiene una seconda composizione della prova, ne\' le sue costanti', !vecchie.length,
    'nella pagina: ' + vecchie.join(', ') + ' — escono con la realizzazione: condizioni e composizione sono di '
      + 'provaCarteggio() e PROVA_CARTEGGIO (D-01, R-SEL-17)');
  const scritte = ['_t: \'c\'', '_t: \'t\'', 'kind: \'carteggio\''].filter((s) => new RegExp(s.replace(/[: ]/g, (x) => (x === ' ' ? '\\s*' : ':'))).test(resto));
  check(G, 'le righe del Carteggio si scrivono solo da quello che il raccordo restituisce', !scritte.length,
    'righe scritte fuori dal raccordo: ' + scritte.join(', ') + ' — le righe finali sono di concludiCarteggio() e '
      + 'rispostaTecnica(), con il legame e gli uid di D-02');
  // Un .filter( con un _t === 'c' o 't' nello stesso enunciato: euristica, e sbaglia nel verso giusto.
  const filtri = /\.filter\([^;]*?\b_t\s*===?\s*['"][ct]['"]/.test(resto);
  check(G, 'la revisione non filtra le righe per tipo da se\'', !filtri,
    'un .filter() sulle righe _t \'c\' o \'t\' fuori dal raccordo: la revisione viene da riepilogoCarteggio(), non dalle '
      + 'righe filtrate in pagina (R-FLU-23)');
  const usi = (f) => [...resto.matchAll(new RegExp('\\b' + f + '\\s*\\(', 'g'))].map((m) => m.index)
    .filter((i) => !/function\s+$/.test(resto.slice(Math.max(0, i - 12), i)));
  const mai = RACCORDO.filter((f) => !usi(f).length);
  check(G, 'la pagina chiama ciascuna delle cinque funzioni del raccordo', !mai.length,
    'dichiarate e mai chiamate: ' + mai.join(', ') + ' — il raccordo c\'e\' ma la pagina fa la stessa cosa da un\'altra parte');
  const erroriDentro = [...dentro].some((f) => /\bE\.erroriSessione\b/.test(tutte[f]));
  check('riprova', 'il raccordo del Carteggio non chiede erroriSessione()', !erroriDentro,
    'la riprova esatta e\' dei quiz (§7.3): il Carteggio chiude con una preparazione nuova');
}

// --- la pagina ---------------------------------------------------------------

const pagina = JSON.parse(readFileSync(0, 'utf8')).pagina;
const script = scriptModulo(pagina);
const tutte = funzioni(script);
const G = 'raccordo';
let preparaCarteggio, avviaCarteggio, concludiCarteggio, rispostaTecnica, riepilogoCarteggio;
check(G, 'la pagina ha uno script', script.length > 0, 'nessun <script type="module">');
for (const f of RACCORDO) {
  check(G, 'la pagina dichiara ' + f + '()', !!tutte[f],
    'il Carteggio passa da cinque funzioni di raccordo: il contratto e\' in docs/area-4-progetto.md §10.1, D-04');
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
    ({ preparaCarteggio, avviaCarteggio, concludiCarteggio, rispostaTecnica, riepilogoCarteggio } = sel);
    const pr = preparazioni();
    const av = avvii(pr);
    const nuove = righe(av);
    riepiloghi(av, nuove);
  }
  collegamento(script, tutte);
}

process.stdout.write(JSON.stringify(verifiche));
