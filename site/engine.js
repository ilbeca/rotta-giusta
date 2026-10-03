// engine.js — motore di selezione e statistiche.
//
// Logica pura: nessun DOM, nessuna rete. Gira identica nella pagina e sotto
// `node --test`, ed e' l'unica implementazione — cosi' online e offline si
// comportano allo stesso modo, perche' sono lo stesso codice.
//
// Il browser tiene in cache la banca (immutabile) e l'archivio delle risposte;
// da quei due pezzi calcola tutto da solo. Non c'e' un server: l'archivio vive
// nel dispositivo, e da qui si deriva sia lo specchio per quesito (`ripiega`)
// sia l'elenco delle sessioni (`sessioni`).

// --- date, come stringhe YYYY-MM-DD ------------------------------------------

export function addGiorni(d, n) {
  const [y, m, g] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, g) + n * 86400000).toISOString().slice(0, 10);
}

/**
 * L'istante corrente in ISO 8601 **con l'offset locale**, non in UTC.
 *
 * Sembra pedanteria e non lo e'. Il server ricava il giorno di studio da
 * `ts[:10]`, e il client mandava `new Date().toISOString()`, che e' sempre UTC:
 * una risposta data alle 00:30 del 10 agosto veniva registrata come 9 agosto.
 * Con lei sbagliavano la scala dei richiami D+1/D+3/D+7, il conteggio per
 * giorno, e il contatore "fatte oggi" della schermata Oggi -- che dopo una
 * sincronizzazione poteva leggere zero un secondo dopo aver risposto.
 *
 * Lo schema di `attempt` dichiara "ISO 8601 locale, con offset" fin dalla
 * 0.3.0: era il client a non rispettarlo.
 *
 * `offMin` e' un parametro esplicito perche' cosi' la funzione si verifica
 * senza dipendere dal fuso della macchina che esegue i test.
 */
export function isoLocale(d = new Date(), offMin = -d.getTimezoneOffset()) {
  const seg = offMin < 0 ? '-' : '+';
  const a = Math.abs(offMin);
  const hh = String(Math.floor(a / 60)).padStart(2, '0');
  const mm = String(a % 60).padStart(2, '0');
  return new Date(d.getTime() + offMin * 60000).toISOString().slice(0, -1) + seg + hh + ':' + mm;
}

export function giorniTra(da, a) {
  const p = (s) => { const [y, m, g] = s.split('-').map(Number); return Date.UTC(y, m - 1, g); };
  return Math.round((p(a) - p(da)) / 86400000);
}

// --- che cosa ho gia' fatto -----------------------------------------------------
//
// Due stati, non quattro. Fino alla 0.5.0 ce n'erano quattro perche' c'era la
// scala dei richiami: un quesito sbagliato tornava da solo a D+1, D+3 e D+7, e
// nel frattempo era 'atteso' oppure 'scaduto'.
//
// **La scala e' stata tolta**, per due motivi misurati.
//
// Il primo e' che non spaziava niente. La scadenza si ricalcolava sempre da
// `lw`, la data dell'errore, mai dall'ultimo ripasso: con un errore del 13
// agosto, al 25 agosto tutti e tre i gradini erano gia' nel passato, quindi
// ogni risposta esatta ne avanzava uno e il quesito restava comunque scaduto.
// Servivano tre aperture consecutive per toglierlo dalla testa della coda, e le
// tre ripetizioni finivano nella stessa mezz'ora. Del D+1/D+3/D+7 restava solo
// il numero tre — ed era il difetto dietro "le domande sono sempre le stesse".
//
// Il secondo e' che sporcava la simulazione. `estrai()` preferiva prima i mai
// visti e poi i richiami, quindi la prova d'esame **non pescava come il
// ministero**, che pesca dalla banca senza sapere che cosa hai studiato: il
// punteggio della simulazione era una misura di un'altra cosa.
//
// Al posto del richiamo automatico c'e' una scelta esplicita: la modalita'
// "solo sbagliate", che ripassi quando lo decidi tu (vedi `soloSbagliate` qui
// sotto). Il dato non si perde — `lw` continua a registrare l'ultimo errore —
// cambia solo chi decide quando rivederlo.

/** 'nuovo' (mai risposto) | 'chiuso' (gia' risposto almeno una volta) */
export function stato(p) {
  return (!p || !p.n) ? 'nuovo' : 'chiuso';
}

/** L'hai sbagliato almeno una volta? `lw` e' la data dell'ultimo errore. */
export function sbagliato(p) {
  return !!(p && p.lw != null);
}

// --- la copertura, in tre numeri che sommano ---------------------------------
//
// `stato()` qui sopra serve alla selezione, e per quella due stati bastano. Ma
// come *misura di copertura* 'chiuso' mente: un quesito preso male conta come
// coperto, e il buco sparisce dentro il numero verde. Sui dati di oggi la
// differenza e' di qualche unita'; su 1.400 quesiti al tasso d'errore attuale
// diventano decine di buchi contati come fatti.
//
// Quindi tre stati, non due, e la proprieta' che li tiene onesti e' che
// **sommano al totale**: coperti + da ripassare + mai visti = banca. Un numero
// solo puo' mentire; tre numeri vincolati alla somma no.

/**
 * 'mai_visto'    mai risposto
 * 'coperto'      preso giusto almeno una volta e nessun errore in sospeso
 *                (cioe': l'ultima risposta era esatta)
 * 'da_ripassare' sbagliato e non ancora ripreso correttamente
 *                (cioe': l'ultima risposta era un errore)
 *
 * La streak `s` e' il discriminante: dopo un errore va a zero e risale solo
 * rispondendo giusto. `s === 0` con almeno una risposta significa esattamente
 * "l'ultimo tentativo e' andato male e non l'ho ancora ripreso".
 */
export function classifica(p) {
  if (!p || !p.n) return 'mai_visto';
  return p.s > 0 ? 'coperto' : 'da_ripassare';
}

// --- la coda ------------------------------------------------------------------
//
// Una riga: prima i mai visti, nell'ordine della banca, che segue il decreto ed
// e' quindi un ordine didattico. L'obiettivo della coda e' la copertura —
// arrivare all'esame avendo visto tutto — non il consolidamento, che ha la sua
// modalita' apposta.

const ORDINE = { nuovo: 0, chiuso: 1 };

/** Confronto fra stringhe, per le date ISO che sono gia' ordinabili cosi'. */
const cmp = (x, y) => (x < y ? -1 : x > y ? 1 : 0);

export function coda(items, progress, oggi, opt = {}) {
  const { kind, tema, voce, temi, voci, stati, n = 20, includiChiusi = false,
          mescola = false, soloSbagliate = false, soloDaRifare = false, soloFigura = false } = opt;
  // Le due liste di errori hanno lo stesso ordine; cambia chi ci entra.
  const errori = soloSbagliate || soloDaRifare;
  const sel = [];
  for (const it of items) {
    if (kind && it.k !== kind) continue;
    if (tema && it.t !== tema) continue;
    if (voce && it.v !== voce) continue;
    if (temi && temi.length && !temi.includes(it.t)) continue;
    if (voci && voci.length && !voci.includes(it.v)) continue;
    // All'esame la figura compare come figura: allenarla come testo non esiste.
    // `f` e' il nome del file o null — il filtro e' la presenza, non il nome.
    if (soloFigura && !it.f) continue;
    const p = progress[it.id];
    // "Solo sbagliate" e' l'unico filtro che tiene *apposta* i gia' visti: sono
    // esattamente quelli che vuoi rivedere. Quindi passa davanti a includiChiusi.
    //
    // "Solo da rifare" (Q-DUE, 29 settembre 2026) e' la sua meta' stretta: solo
    // gli errori la cui **ultima** risposta e' sbagliata, cioe' il segmento
    // «da rifare» della mappa di Progressi, contato da `classifica()` come la
    // barra. «Rifai N errori» apre gli N per contratto: con `soloSbagliate` e
    // un tetto a N li avrebbe aperti solo perche' le riprese stanno in fondo,
    // e il primo tetto diverso da N le avrebbe rimescolate dentro.
    if (soloDaRifare) {
      if (classifica(p) !== 'da_ripassare') continue;
    } else if (soloSbagliate) {
      if (!sbagliato(p)) continue;
    } else {
      const s = stato(p);
      if (s === 'chiuso' && !includiChiusi) continue;
      if (stati && stati.length && !stati.includes(s)) continue;
    }
    sel.push({
      it,
      s: stato(p),
      lw: (p && p.lw) || '',
      // `ripreso` non e' `sbagliato`: dice se dopo l'errore l'hai gia' rimesso
      // a posto (streak > 0). Serve solo all'ordine, mai a escludere.
      ripreso: p && p.s ? 1 : 0,
      // `t` e' l'ultima data in cui l'hai toccato, giusto o sbagliato che fosse.
      t: (p && p.t) || '',
    });
  }
  // L'ordine delle "solo sbagliate", in tre chiavi.
  //
  // Fino alla 0.15.0 ce n'era una sola, `lw` decrescente: l'errore piu' recente
  // per primo. Sembrava ragionevole e non lo era, perche' **`lw` non si muove
  // quando riprendi il quesito** — cambia solo se lo risbagli. Quindi chi hai
  // appena sistemato restava in testa per sempre, e la lista era identica a
  // ogni apertura: nessun avanzamento. Misurato il 2 settembre sull'archivio
  // vero: i primi dodici proposti erano, nello stesso ordine, i primi dodici
  // gia' fatti mezz'ora prima, e dei primi 50 solo 7 avevano un errore ancora
  // aperto. L'86% della sessione andava su quesiti gia' rimessi a posto.
  //
  // 1. chi ha l'errore ancora aperto prima di chi l'ha gia' ripreso. Restare in
  //    elenco (regola della 0.5.1: sbagliarlo una volta non scade) e stare in
  //    testa sono due cose diverse: non si nasconde niente, si mette in fondo.
  // 2. poi il piu' **trascurato**: `t` crescente, l'ultima volta che l'hai
  //    toccato. Quello che hai appena fatto scende in fondo da solo, quindi la
  //    lista avanza **senza segnaposto** — nessuno stato nuovo da mantenere ne'
  //    da perdere. E' la stessa idea di `tappeto()`: la ripresa e' gratis per
  //    costruzione perche' e' derivata, non memorizzata.
  // 3. a parita', `lw` decrescente: l'intenzione originale della 0.5.1,
  //    l'errore fresco prima, che resta giusta come spareggio.
  sel.sort((a, b) => errori
    ? (a.ripreso - b.ripreso) || cmp(a.t, b.t) || cmp(b.lw, a.lw)
    : (ORDINE[a.s] - ORDINE[b.s]));
  let out = sel.map((x) => x.it);
  if (mescola) out = rimescola(out);
  return n > 0 ? out.slice(0, n) : out;
}

// --- che cosa mi manca, per qualunque restrizione ------------------------------
//
// La lista che apre una batteria, una passata per argomento o «Allena questa
// voce», e insieme il numero che il pulsante promette. Tre chiamate a `coda()`
// composte in quattro gruppi — nessuna selezione nuova, e il taglio fra aperte
// e riprese lo fa `classifica()`:
//
//   aperte -> mai visti -> gia' riprese -> il resto
//
// I primi due gruppi sono **esattamente** `rimanenti` di `traccia()`
// (`totale - coperti` = da ripassare + mai visti), ed e' il punto: fino alla
// 0.15.0 il pulsante di *Oggi* dichiarava `rimanenti` e poi apriva una `coda()`
// con gli stati di default, che esclude i `chiuso`. Con la banca interamente
// coperta i mai visti sono zero, quindi il pulsante prometteva 76 quesiti e ne
// apriva **zero**, con scritto «Niente da fare con questa selezione»: due
// definizioni diverse di «quel che resta» dentro lo stesso pulsante. E' la
// stessa forma del difetto riparato nella 0.13.3 per «Allena questa voce»,
// rimasta accesa fino al giorno in cui i mai visti sono finiti.
//
// Sta in `app.html` dalla 0.16.0, ed e' l'ultima selezione rimasta fuori dal
// motore. Qui non cambia di una riga: cambia il posto, che e' quello in cui si
// testa — e la regola «la selezione sta in un solo file» torna vera.

/**
 * Restituisce **due** cose, ed e' voluto: `lista` e' tutto, in ordine di
 * priorita', perche' una batteria non deve finire a corto di domande; `daFare`
 * sono solo i primi due gruppi, cioe' il lavoro davvero arretrato. Scriverli
 * uguali sarebbe la bugia opposta a quella riparata qui: dire «1.472 da fare»
 * quando le domande arretrate sono 76 e il resto e' ripasso.
 *
 * `extra` sono le opzioni di `coda()` — `temi`, `voci`, `voce`, `tema`,
 * `soloFigura` — e valgono per tutte e tre le chiamate: il numero promesso e la
 * lista che si apre non possono divergere nemmeno sotto un filtro.
 */
export function daAllenare(items, progress, oggi, kind, extra = {}) {
  const q = (o) => coda(items, progress, oggi, { kind, n: 0, ...extra, ...o });
  const sbagliate = q({ soloSbagliate: true });
  const aperte = sbagliate.filter((x) => classifica(progress[x.id]) === 'da_ripassare');
  const riprese = sbagliate.filter((x) => classifica(progress[x.id]) !== 'da_ripassare');
  const nuovi = q({ stati: ['nuovo'] });
  const visti = new Set([...sbagliate, ...nuovi].map((x) => x.id));
  const resto = q({ includiChiusi: true }).filter((x) => !visti.has(x.id));
  return { lista: [...aperte, ...nuovi, ...riprese, ...resto], daFare: aperte.length + nuovi.length };
}

/** Un generatore pseudocasuale con seme (LCG): stessa sequenza, stesso seme. */
function creaRnd(seme) {
  let s = seme >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Un seme che dipende solo dal giorno: serve alle selezioni che devono essere
 *  riproducibili — stesso storico e stesso giorno, stessa lista. */
export function semeGiorno(oggi) {
  return Number(String(oggi).replace(/-/g, '')) >>> 0;
}

/** Fisher-Yates con seme, cosi' una simulazione si puo' rigiocare identica. */
export function rimescola(a, seme = Date.now()) {
  const out = a.slice();
  const rnd = creaRnd(seme);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// --- estrazione ------------------------------------------------------------------
//
// Serve alla simulazione, allo screening e alla prova di carteggio, dove il
// numero di quesiti per gruppo e' fissato in partenza.

/**
 * Sceglie `n` item dal gruppo, **a caso e senza guardare che cosa hai gia' fatto**.
 *
 * Prima stratificava — prima i mai visti, poi i richiami scaduti, poi gli
 * attesi, infine i chiusi — e questo rendeva la simulazione d'esame infedele:
 * il ministero non sa che cosa hai studiato e pesca dalla banca e basta. Una
 * prova che ti serve i quesiti che non hai mai visto misura la tua debolezza,
 * non il tuo voto probabile all'esame; una che ti serve quelli che hai
 * sbagliato la sottostima ancora di piu'.
 *
 * `progress` resta nella firma perche' cambiare tutte le chiamate a sei giorni
 * dal congelamento del codice vale meno del rischio, ed e' esplicitamente
 * ignorato: chi legge deve vedere che non e' una svista.
 *
 * Chiamanti, e che cosa si aspettano (elencarli e' la regola di CLAUDE.md nata
 * proprio da questa funzione):
 *   - `simulazione()` / `simulazioneVela()`: pescata cieca, come il ministero;
 *   - `provaCarteggio()`: pescata cieca per argomento, e' una simulazione
 *     d'esame anche lei (fino a P-32 era `componiProva()` in app.html, che la
 *     chiama ancora come valore finche' l'area 4 non passa al motore);
 *   - lo screening NON passa piu' di qui: usa `estraiNuoviPrima`, perche'
 *     esplora terreno nuovo e riproporgli roba gia' fatta e' sprecarlo.
 */
export function estrai(pool, progress, oggi, n, seme = 1) {
  return rimescola(pool, seme).slice(0, n);
}

/**
 * Come `estrai`, ma **prima i mai visti**: dentro ogni strato pesca a caso col
 * seme, e attinge ai gia' risposti solo quando i nuovi non bastano.
 *
 * Serve allo screening, che ha lo scopo opposto della simulazione: la
 * simulazione misura il voto probabile, quindi non deve sapere che cosa hai
 * studiato; lo screening esplora terreno nuovo per trovare i punti deboli,
 * quindi riproporti un quesito gia' fatto e' una domanda sprecata. Nella 0.5.1
 * la semplificazione di `estrai()` ha appiattito anche lui su una pescata
 * cieca: questa funzione e' la separazione dei due comportamenti.
 *
 * Chiamanti: `screening()`, e `provaCarteggio()` nella variante «prima i mai
 * provati» (fino a P-32 `componiProva()` in app.html, col selettore acceso).
 */
export function estraiNuoviPrima(pool, progress, oggi, n, seme = 1) {
  const nuovi = [], visti = [];
  for (const it of pool) (stato(progress[it.id]) === 'nuovo' ? nuovi : visti).push(it);
  return [...rimescola(nuovi, seme), ...rimescola(visti, seme + 1)].slice(0, n);
}

/**
 * Simulazione del quiz base: 20 domande con la composizione del ministero.
 *
 * L'estrazione **non e' proporzionale alla banca**, ed e' la cosa che cambia di
 * piu' le priorita' di studio: Manovra e condotta e' il 10,5% della banca ma il
 * 20% dell'esame, i COLREG sono il 16,8% della banca e il 10% dell'esame.
 * `distribuzione` e' una mappa tema -> quante domande, e arriva da /api/seed/meta
 * cosi' resta un dato solo, dalla parte del server.
 */
/**
 * Un quesito che all'esame **non puo' uscire**: uno dei 37 oscurati dal MIT con
 * la circolare 30432 del 15 novembre 2024, che il server marca con `osc`.
 *
 * E' un campo apposta e non la presenza della nota (`nbp`), perche' sono due
 * cose diverse — una e' che cosa si scrive in schermata, l'altra e' se il
 * quesito puo' essere sorteggiato — e legarle vorrebbe dire che riscrivere un
 * testo cambia la selezione.
 */
export function oscurato(it) { return !!(it && it.osc); }

export function simulazione(items, progress, oggi, distribuzione, seme = 1) {
  const out = [];
  let i = 0;
  for (const [tema, quante] of Object.entries(distribuzione)) {
    // Fuori gli oscurati: all'esame vero non possono uscire, quindi una prova
    // che li pesca non misura piu' il voto che prenderesti — che e' l'unica
    // cosa per cui la simulazione esiste. Stessa ragione per cui `estrai()`
    // non guarda lo storico: la prova deve somigliare all'esame, non allo
    // studio. Altrove restano pescabili (su un oscurato c'e' comunque
    // qualcosa da imparare) e la nota prima della risposta dice che si puo'
    // saltare.
    const pool = items.filter((x) => x.k === 'base' && x.t === tema && !oscurato(x));
    out.push(...estrai(pool, progress, oggi, quante, seme + 100 * ++i));
  }
  return rimescola(out, seme);
}

/** Simulazione vela: 5 affermazioni, pescate sulle tre voci in proporzione. */
export function simulazioneVela(items, progress, oggi, n = 5, seme = 1) {
  // Oggi nessun quesito vela e' oscurato, ma il filtro c'e' lo stesso: se un
  // domani ne comparisse uno, la prova d'esame non deve accorgersene per caso.
  return estrai(items.filter((x) => x.k === 'vela' && !oscurato(x)), progress, oggi, n, seme);
}

/**
 * Screening: `perVoce` quesiti da **ognuna** delle voci, non dei temi.
 *
 * Le voci sono 44 (3 per la vela), quindi con 1 a testa sono 44 domande che
 * toccano ogni singolo argomento del programma. E' la differenza fra sapere che
 * sei debole in "Navigazione" — 322 quesiti, inutile — e sapere che sei debole
 * in "Bussole magnetiche", che sono 38 e si ripassano in mezz'ora.
 */
export function screening(items, progress, oggi, perVoce = 1, kind = 'base', seme = 1) {
  const gruppi = new Map();
  for (const it of items) {
    if (it.k !== kind) continue;
    if (!gruppi.has(it.v)) gruppi.set(it.v, []);
    gruppi.get(it.v).push(it);
  }
  const out = [];
  let i = 0;
  // `estraiNuoviPrima`, non `estrai`: lo screening esplora, non simula.
  for (const pool of gruppi.values()) out.push(...estraiNuoviPrima(pool, progress, oggi, perVoce, seme + 100 * ++i));
  return rimescola(out, seme);
}

/**
 * Quante domande apre davvero uno screening a `perVoce` per voce.
 *
 * **Non e' `perVoce × 44`**: tre voci del decreto hanno un solo quesito in
 * banca, e da quelle non se ne pescano sei. Il conto e' la somma dei minimi —
 * a 2 per voce sono 85 e non 88, a 3 sono 126 e non 132, a 6 sono 249 e non
 * 264, misurato sulla banca pubblicata.
 *
 * Sta qui, e non nella pagina, per la ragione della 0.19.2, dove il gioco dei
 * Segnali prometteva 10 domande e ne serviva 8: **il numero promesso e la
 * lista che si apre vengono dalla stessa fonte**. Questa legge `items`, cioe'
 * la banca, che e' esattamente cio' che conta `screening()`. La copia che
 * viveva in `app.html` leggeva invece i conteggi dichiarati in `meta.json`, e
 * nessun test li confrontava con la banca voce per voce: coincidevano, e non
 * c'era niente che lo pretendesse.
 *
 * Non dipende da storico, giorno o seme, e non e' una svista: lo screening
 * prende `perVoce` quesiti da ogni voce che ne ha, e quanti ne apra non cambia
 * con quello che hai gia' fatto.
 */
export function lunghezzaScreening(items, perVoce = 1, kind = 'base') {
  const per = new Map();
  for (const it of items) {
    if (it.k !== kind) continue;
    per.set(it.v, (per.get(it.v) || 0) + 1);
  }
  let n = 0;
  for (const quanti of per.values()) n += Math.min(perVoce, quanti);
  return n;
}


/** Esito di una prova: superata o no, secondo le soglie del decreto. */
export function esito(risposte, erroriMax) {
  const errori = risposte.filter((r) => !r).length;
  return { totale: risposte.length, esatte: risposte.length - errori, errori, errori_max: erroriMax, superata: errori <= erroriMax };
}

// --- carteggio: la prova ---------------------------------------------------------
//
// Fino a P-32 la composizione stava in `componiProva()` di app.html, con 4, 60
// e 3 scritti accanto in tre costanti della pagina, e l'unico test la
// verificava in una copia trascritta. Ora e' un contratto del motore: la lista
// e, dalla stessa chiamata, che cosa rappresenta e che cosa no — cosi' la
// pagina non deve ricontare gli argomenti per dichiarare un ripiego, e non puo'
// prendere un argomento assente per coperto (D-01, §10.1 di
// docs/area-4-progetto.md).

const ESERCIZI_PROVA = 4;
const SOGLIA_PROVA = 3;

/**
 * Le condizioni della prova di carteggio, in un posto solo.
 *
 * I numeri sono del decreto: DM 323/2021, art. 6 c. 6 — quattro quesiti
 * indipendenti, 60 minuti, superata con almeno 3 su 4 (docs/ricerca-programma-
 * esame.md §5). **La composizione no**: «un esercizio per ciascuno dei quattro
 * argomenti» e' un'assunzione del sito, Q-CART4 nella specifica, e viaggia con
 * il contratto invece di stare in un commento che nessuno legge. Non stanno in
 * `meta.json` accanto a base e vela perche' la composizione, che non e' un
 * dato del decreto, deve restare accanto ai numeri che la usano.
 */
export const PROVA_CARTEGGIO = Object.freeze({
  esercizi: ESERCIZI_PROVA,
  minuti: 60,
  soglia: SOGLIA_PROVA,
  erroriMax: ESERCIZI_PROVA - SOGLIA_PROVA,
  argomenti: Object.freeze(['navigazione costiera', 'correnti', 'scarroccio', 'carburante']),
  fonte: 'DM 323/2021, art. 6 c. 6: quattro quesiti indipendenti, 60 minuti, almeno 3 su 4.',
  assunzione: "Q-CART4: un esercizio per ciascuno dei quattro argomenti è un'assunzione del sito, "
    + 'non una composizione del decreto, che dice soltanto «quattro quesiti indipendenti». '
    + 'La carta 42/D non ha esercizi di carburante: una prova così può richiedere più carte.',
});

/**
 * Compone la prova di carteggio: un esercizio per argomento, poi il resto se
 * un argomento manca.
 *
 * **La pescata e' cieca di proposito** (`estrai`): la prova simula l'esame, e
 * l'esame non sa che cosa hai studiato. Con `nuoviPrima` diventa la variante
 * di allenamento «prima i mai provati» (`estraiNuoviPrima`), che attinge ai
 * gia' provati solo quando in un argomento i nuovi sono finiti: la prova non
 * deve mai uscire corta, e ogni ripresa si dichiara.
 *
 * Restituisce, tutto dalla stessa chiamata:
 *   lista          gli esercizi, nell'ordine della prova (al piu' `esercizi`)
 *   pronta         la lista ha `esercizi` elementi; se no, chi la consuma
 *                  non avvia una prova corta chiamandola esame
 *   variante       'cieca' | 'nuoviPrima' — da scrivere nelle righe della prova
 *                  nuova (`variante`); in una riga di prima manca, ed e'
 *                  sconosciuta, non 'cieca'
 *   argomenti      per ognuno dei quattro, nell'ordine di PROVA_CARTEGGIO:
 *                  { argomento, esercizi, nuovi, preso, ripresa }
 *   rappresentati  gli argomenti che hanno un esercizio nella lista
 *   mancanti       quelli che non ce l'hanno, perche' la banca non ne ha
 *   completamento  [{ id, argomento }] presi dal resto al posto dei mancanti
 *   riprese        [{ id, argomento }] della lista gia' provati — solo nella
 *                  variante; nella cieca `null`, e `nuovi`/`ripresa` pure:
 *                  la cieca non guarda lo storico, e «0 riprese» con tutta la
 *                  banca gia' fatta sarebbe falso
 *   carte          le carte della lista, distinte, nell'ordine in cui compaiono
 *   condizioni     { esercizi, minuti, soglia, erroriMax }
 *   assunzione     il testo di Q-CART4
 *
 * Niente filtro per carta: la 42/D non ha carburante. Niente tecniche: la
 * schermata di preparazione non le rivela (§5.1 del progetto), e un campo che
 * esiste e' un campo che qualcuno scrive. `oggi` non serve alla scelta, e sta
 * nella firma come per le altre estrazioni. Deterministica col seme, e — senza
 * `nuoviPrima` — indipendente dallo storico, risultato intero compreso.
 */
export function provaCarteggio(banca, progress, oggi, { seme = 1, nuoviPrima = false } = {}) {
  const P = PROVA_CARTEGGIO;
  const prog = progress || {};
  const pesca = nuoviPrima ? estraiNuoviPrima : estrai;
  const nuovo = (e) => stato(prog[e.id]) === 'nuovo';
  const presi = [];
  const argomenti = P.argomenti.map((argomento, i) => {
    const pool = banca.filter((e) => e.argomento === argomento);
    // I semi sono quelli di `componiProva()` fino a P-32: stessa prova, stesso
    // seme, anche dopo il passaggio della pagina al motore.
    const [preso] = pool.length ? pesca(pool, prog, oggi, 1, seme + 100 * (i + 1)) : [];
    if (preso) presi.push(preso);
    return {
      argomento,
      esercizi: pool.length,
      nuovi: nuoviPrima ? pool.filter(nuovo).length : null,
      preso: preso ? preso.id : null,
      ripresa: nuoviPrima && preso ? !nuovo(preso) : null,
    };
  });
  // Un argomento senza esercizi lascerebbe la prova corta: la si completa dal
  // resto della banca, e lo si dice — `mancanti` e `completamento` — invece di
  // somministrare tre esercizi, o quattro fingendo quattro argomenti.
  let completamento = [];
  if (presi.length < P.esercizi) {
    const ids = new Set(presi.map((e) => e.id));
    const aggiunti = pesca(banca.filter((e) => !ids.has(e.id)), prog, oggi, P.esercizi - presi.length, seme + 900);
    presi.push(...aggiunti);
    completamento = aggiunti.map((e) => ({ id: e.id, argomento: e.argomento ?? null }));
  }
  const lista = rimescola(presi, seme).slice(0, P.esercizi);
  const rappresentati = P.argomenti.filter((a) => lista.some((e) => e.argomento === a));
  return {
    lista,
    pronta: lista.length === P.esercizi,
    variante: nuoviPrima ? 'nuoviPrima' : 'cieca',
    argomenti,
    rappresentati,
    mancanti: P.argomenti.filter((a) => !rappresentati.includes(a)),
    completamento,
    riprese: nuoviPrima ? lista.filter((e) => !nuovo(e)).map((e) => ({ id: e.id, argomento: e.argomento ?? null })) : null,
    carte: [...new Set(lista.map((e) => e.carta ?? null))],
    condizioni: { esercizi: P.esercizi, minuti: P.minuti, soglia: P.soglia, erroriMax: P.erroriMax },
    assunzione: P.assunzione,
  };
}

// --- carteggio: i due allenamenti ------------------------------------------------
//
// La prova d'esame pesca come il ministero: un esercizio per argomento, alla
// cieca. Questi due invece sono **allenamenti**, e guardano lo storico apposta.

/**
 * Una sessione che tocca **tutte le tecniche** del carteggio.
 *
 * Non e' "un esercizio per tecnica": parecchi esercizi ne richiedono piu' di
 * una (`e.tecniche` e' una lista), quindi e' un problema di copertura, e si
 * risolve col greedy — a ogni passo l'esercizio che copre piu' tecniche ancora
 * scoperte. A parita' di copertura vince il mai fatto, poi l'ordine del
 * foglio: cosi' la selezione e' deterministica ma cambia da sola man mano che
 * gli esercizi si fanno. La copertura vince sul mai-fatto perche' e' lei a
 * decidere quanto dura la sessione: sono ore di carta nautica, non tap.
 *
 * Restituisce `[{e, tecniche}]`: per ogni esercizio, le tecniche che **porta
 * lui** al giro (quelle non gia' coperte da un esercizio precedente) — e' il
 * suo "perche' e' qui", da scrivere in schermata.
 */
export function giroTecniche(esercizi, progress) {
  const scoperte = new Set();
  for (const e of esercizi) for (const t of e.tecniche || []) scoperte.add(t);
  const out = [], presi = new Set();
  while (scoperte.size) {
    let scelto = null, sue = null;
    for (const e of esercizi) {
      if (presi.has(e.id)) continue;
      const nuove = (e.tecniche || []).filter((t) => scoperte.has(t));
      if (!nuove.length) continue;
      // A parita' completa vince il primo scandito, cioe' l'ordine del foglio.
      const meglio = !scelto
        || nuove.length > sue.length
        || (nuove.length === sue.length
            && (stato(progress[e.id]) === 'nuovo') > (stato(progress[scelto.id]) === 'nuovo'));
      if (meglio) { scelto = e; sue = nuove; }
    }
    if (!scelto) break;   // nessun esercizio copre le tecniche rimaste: non deve succedere
    presi.add(scelto.id);
    out.push({ e: scelto, tecniche: sue });
    for (const t of sue) scoperte.delete(t);
  }
  return out;
}

/**
 * A tappeto: i prossimi `n` esercizi **mai fatti**, nell'ordine del foglio.
 *
 * La ripresa e' gratis: i fatti si saltano, quindi la sessione dopo riparte
 * esattamente da dove eri rimasto — lo stato sta nello storico, non in un
 * segnaposto da mantenere. Quando il foglio e' finito la lista e' vuota, e
 * sta alla schermata dirlo.
 */
export function tappeto(esercizi, progress, n = 4) {
  const out = [];
  for (const e of esercizi) {
    if (stato(progress[e.id]) !== 'nuovo') continue;
    out.push(e);
    if (out.length >= n) break;
  }
  return out;
}

// --- diagnosi -----------------------------------------------------------------

function vuoto(nome, n) {
  // `sbagliati` = sbagliato almeno una volta, e non cala mai: e' la misura
  // "quanto terreno hai calpestato male", che di proposito non scade (0.5.1).
  // `aperti` = di quelli, quanti hanno **ancora** l'errore in piedi, cioe'
  // `classifica() === 'da_ripassare'`. E' l'unico dei due che si muove quando
  // ripassi, e fino alla 0.15.0 non veniva calcolato per tema e per voce:
  // la tabella della Diagnosi mostrava solo il totale, quindi un pomeriggio di
  // ripasso non spostava nessun numero in quella schermata.
  return { nome, n, visti: 0, risposte: 0, esatte1: 0, sbagliati: 0, aperti: 0, chiusi: 0, nuovi: 0, _ms: 0, _msn: 0 };
}

function chiudi(a) {
  a.acc1 = a.visti ? a.esatte1 / a.visti : null;
  a.ms = a._msn ? Math.round(a._ms / a._msn) : null;
  a.copertura = a.n ? (a.n - a.nuovi) / a.n : 0;
  // Tasso d'errore lisciato: (errori+1)/(visti+3).
  //
  // Serve a non far vincere la classifica dei punti deboli a una voce da un
  // quesito solo sbagliato una volta. Con pochi dati il valore resta vicino a
  // 1/3 e la voce non sale; man mano che rispondi, il liscio pesa sempre meno.
  a.debolezza = (a.visti - a.esatte1 + 1) / (a.visti + 3);
  delete a._ms; delete a._msn;
  return a;
}

export function diagnosi(items, progress, oggi, kind = 'base', pesi = null) {
  const temi = new Map(), voci = new Map();
  for (const it of items) {
    if (it.k !== kind) continue;
    if (!temi.has(it.t)) temi.set(it.t, vuoto(it.t, 0));
    const chiave = it.t + ' › ' + it.v;
    if (!voci.has(chiave)) voci.set(chiave, Object.assign(vuoto(it.v, 0), { tema: it.t }));
    const T = temi.get(it.t), V = voci.get(chiave);
    T.n++; V.n++;
    const p = progress[it.id];
    const s = stato(p, oggi);
    for (const a of [T, V]) {
      if (s === 'nuovo') { a.nuovi++; continue; }
      a.visti++;
      a.risposte += p.n;
      a.esatte1 += p.first ? 1 : 0;
      a.chiusi++;
      if (sbagliato(p)) a.sbagliati++;
      if (classifica(p) === 'da_ripassare') a.aperti++;
      if (p.avg) { a._ms += p.avg; a._msn++; }
    }
  }
  const T = [...temi.values()].map(chiudi);
  const V = [...voci.values()].map(chiudi);

  // Quante domande d'esame ti aspetti di sbagliare per colpa di questa voce.
  //
  //   costo = P(errore) x (domande d'esame del tema) x (quota della voce nel tema)
  //
  // E' la traduzione della debolezza in punti persi, e riordina le priorita':
  // una voce debole dentro Manovra (4 domande su 155 quesiti) costa piu' della
  // stessa debolezza dentro COLREG (2 domande su 247).
  if (pesi) {
    const dimTema = Object.fromEntries(T.map((t) => [t.nome, t.n]));
    for (const t of T) { t.esame = pesi[t.nome] || 0; t.resa = t.n ? t.esame / t.n : 0; }
    for (const v of V) {
      const peso = pesi[v.tema] || 0;
      v.costo = v.debolezza * peso * (dimTema[v.tema] ? v.n / dimTema[v.tema] : 0);
    }
  }
  return {
    temi: T.sort((a, b) => (b.esame || 0) - (a.esame || 0) || b.n - a.n),
    voci: V.sort((a, b) => (b.costo ?? b.debolezza) - (a.costo ?? a.debolezza)),
  };
}

// --- la mappa di Progressi ----------------------------------------------------
//
// Q-DUE, chiusa dall'autore il 29 settembre 2026 (`docs/specifica.md` §10):
// Progressi non e' piu' due classifiche — `peggiori()` in Rotta, `consigli()`
// in Progressi —, che su quattro storici sintetici davano le stesse prime voci
// fino a cinque volte su cinque. Tutte e due sono uscite dal motore: la prima
// con P-41, la seconda con P-47, dopo che P-23 ne aveva tolto l'ultima chiamata. E' una mappa: una riga per tema, in ordine
// fisso di peso d'esame, con una barra a tre stati e, toccando il tema, le sue
// voci in ordine di banca. In cima, al massimo una frase.
//
// I tre stati sono quelli di `classifica()`, e sono letti **all'ultima
// risposta**: un errore si chiude con una risposta giusta (punto 2). Le parole
// in schermata sono «giusti · da rifare · mai visti» (punto 3): qui i campi si
// chiamano cosi', perche' la pagina non debba tradurre `coperto` e
// `da_ripassare`, e con la traduzione sbagliare.
//
// Le righe si costruiscono sugli aggregati di `diagnosi()`, non con un conto
// nuovo: `visti`, `aperti`, `nuovi` ed `esatte1` sono gia' li', contati con
// `stato()` e `classifica()`. Una seconda contabilita' della stessa copertura
// e' la forma del difetto tornato tre volte.

/** Quante risposte servono in una riga per scrivere «X su Y giusti al primo
 *  tentativo». Sotto, `primo` e' null e la schermata scrive «troppo poche
 *  risposte per dire come va» (punto 5). E' il valore delle soglie che c'erano
 *  gia' su questa misura, in `consigli()` e `peggiori()`, uscite tutte e due. */
export const PRIMA_MIN_VISTI = 5;

/** Quanti quesiti distinti visti servono perche' la frase in cima compaia: le
 *  domande di una prova base, 20 (Allegato C al DM 323/2021). Sotto, la frase
 *  la deciderebbero i pesi del ministero e non quello che hai fatto — cioe'
 *  ripeterebbe l'orientamento della Rotta con l'aria di una diagnosi. */
export const FRASE_MIN_VISTI = 20;

function rigaMappa(a, filtro, peso) {
  return {
    nome: a.nome,
    ...(a.tema ? { tema: a.tema } : {}),
    peso,
    n: a.n,
    giusti: a.visti - a.aperti,
    daRifare: a.aperti,
    maiVisti: a.nuovi,
    visti: a.visti,
    // X ed Y esatti, mai una frazione arrotondata: X le esatte alla prima
    // risposta, Y i visti, lo stesso Y di «Visti Y su N». Conta solo la prima
    // volta, quindi ripassando non migliora: col ripasso si muove la barra.
    // `esatte1` non si espone da solo, cosi' sotto soglia non c'e' niente da
    // scrivere per sbaglio.
    primo: a.visti >= PRIMA_MIN_VISTI ? { esatte: a.esatte1, su: a.visti } : null,
    filtro,
    // La selezione di «Rifai N errori», pronta e senza tetto: il tetto
    // predefinito di `coda()` e' 20, e «Rifai 35 errori» ne aprirebbe 20.
    rifai: { ...filtro, soloDaRifare: true, n: 0 },
  };
}

/**
 * La mappa: `{ kind, righe, totale }`.
 *
 * Sulla base, una riga per tema nell'ordine di `diagnosi().temi` — peso
 * d'esame, poi dimensione del tema: non dipende da quello che hai fatto — col
 * suo `peso` e le sue `voci` in ordine di banca. Sulla vela le tre voci fanno
 * da righe, in ordine di banca, con `peso: null` (punto 4): la prova vela vale
 * 5 domande, ma come si dividano fra le voci non e' scritto da nessuna parte,
 * e un peso per voce non si inventa. Per la stessa ragione `peso` e' null su
 * ogni riga di voce, anche sulla base.
 *
 * Ogni riga porta `filtro`, le opzioni di `coda()` che la restringono, e
 * `rifai`, la selezione del suo pulsante. Il numero sul pulsante e' `daRifare`,
 * contato da `classifica()` come il filtro `soloDaRifare`: stessa regola,
 * stesso numero, e un test lo pretende su ogni riga della banca vera.
 */
export function quadro(items, progress, oggi, kind = 'base', pesi = null) {
  const conPesi = kind === 'base' && pesi ? pesi : null;
  const d = diagnosi(items, progress, oggi, kind, conPesi);
  const perChiave = new Map(d.voci.map((v) => [v.tema + ' › ' + v.nome, v]));
  const ordine = [];
  for (const it of items) {
    if (it.k !== kind) continue;
    const v = perChiave.get(it.t + ' › ' + it.v);
    if (v && !ordine.includes(v)) ordine.push(v);
  }
  const righe = kind === 'base'
    ? d.temi.map((t) => ({
        ...rigaMappa(t, { kind, tema: t.nome }, conPesi ? (conPesi[t.nome] ?? 0) : null),
        voci: ordine.filter((v) => v.tema === t.nome)
          .map((v) => rigaMappa(v, { kind, tema: v.tema, voce: v.nome }, null)),
      }))
    : ordine.map((v) => {
        const r = rigaMappa(v, { kind, voce: v.nome }, null);
        delete r.tema;
        return r;
      });
  const somma = { nome: kind, n: 0, visti: 0, aperti: 0, nuovi: 0, esatte1: 0 };
  for (const a of kind === 'base' ? d.temi : ordine)
    for (const k of ['n', 'visti', 'aperti', 'nuovi', 'esatte1']) somma[k] += a[k];
  return { kind, righe, totale: rigaMappa(somma, { kind }, null) };
}

/**
 * La frase in cima a Progressi, «Dove pesa di più adesso» (punti 1 e 6):
 * `{ indicazione, assente }`, e sempre uno solo dei due.
 *
 * La regola, su fatti e non su stime. Per ogni tema,
 *
 *   in ballo = domande d'esame del tema x (da rifare + mai visti) / quesiti
 *
 * cioe' quanta parte del tema non hai preso giusta all'ultima risposta, pesata
 * da quanto vale all'esame. **Non** e' una previsione di quante domande
 * sbaglierai: sulla parte mai vista non si sa niente, e `consigli()`, uscita
 * dal motore, ci metteva una debolezza presa in prestito; qui non si presta
 * niente. Vince il
 * tema con il valore piu' alto, confrontato in interi, senza arrotondamenti.
 *
 * `motivo` e' la parte piu' grossa: «da rifare» se gli errori sono almeno
 * quanti i mai visti, altrimenti «mai visti». I `pulsanti` sono coerenti con
 * quello che la frase dice: prima quello del motivo, poi l'altro, e mai uno
 * da zero; ognuno porta `quanti` e la `selezione` di `coda()` che apre
 * esattamente quelli.
 *
 * La frase non c'e', e `assente` dice perche':
 *   'senza pesi'      sulla vela, o senza i pesi d'esame: «pesa di piu'» non
 *                     ha un fondamento se il peso di una riga non esiste;
 *   'sotto soglia'    meno di `FRASE_MIN_VISTI` quesiti visti;
 *   'niente da fare'  nessun tema ha errori da rifare o mai visti;
 *   'pari'            due temi in testa con lo stesso valore: non c'e'
 *                     un'indicazione sola, e sceglierne uno sarebbe l'ordine
 *                     dell'elenco travestito da consiglio.
 * La schermata, quando manca, non mette niente al suo posto.
 */
export function dovePesa(q) {
  const niente = (assente) => ({ indicazione: null, assente });
  if (!q || q.kind !== 'base' || !q.righe.length || q.righe.some((r) => r.peso == null)) return niente('senza pesi');
  if (q.totale.visti < FRASE_MIN_VISTI) return niente('sotto soglia');
  const nonPresi = (r) => r.daRifare + r.maiVisti;
  const cand = q.righe.filter((r) => r.peso > 0 && r.n > 0 && nonPresi(r) > 0);
  if (!cand.length) return niente('niente da fare');
  // a/b contro c/d senza divisioni: peso x non presi x n dell'altro.
  const confronta = (a, b) => b.peso * nonPresi(b) * a.n - a.peso * nonPresi(a) * b.n;
  cand.sort(confronta);
  if (cand.length > 1 && confronta(cand[0], cand[1]) === 0) return niente('pari');
  const r = cand[0];
  const motivo = r.daRifare >= r.maiVisti ? 'da rifare' : 'mai visti';
  const rifai = { azione: 'rifai', quanti: r.daRifare, selezione: r.rifai };
  const nuovi = { azione: 'mai visti', quanti: r.maiVisti, selezione: { ...r.filtro, stati: ['nuovo'], n: 0 } };
  return {
    indicazione: {
      tema: r.nome, peso: r.peso, n: r.n,
      giusti: r.giusti, daRifare: r.daRifare, maiVisti: r.maiVisti,
      inBallo: r.peso * nonPresi(r) / r.n,
      motivo,
      pulsanti: (motivo === 'da rifare' ? [rifai, nuovi] : [nuovi, rifai]).filter((p) => p.quanti > 0),
    },
    assente: null,
  };
}

// --- quanto devo fare oggi -----------------------------------------------------

export function traccia(items, progress, oggi, kind, scadenzaPiano, inizio = null) {
  // `sbagliati` ha preso il posto di `scaduti`: senza la scala dei richiami non
  // esiste piu' una scadenza, esiste il fatto che quel quesito l'hai sbagliato.
  // E' il numero che alimenta la modalita' "solo sbagliate".
  //
  // `chiusi`/`nuovi` sono i conti della **selezione** (due stati). La copertura
  // pero' si misura sui tre stati di `classifica()`: un quesito preso male non
  // e' coperto, e' un buco con la data sopra. I tre numeri sommano al totale
  // per costruzione — e c'e' un test che lo pretende.
  let totale = 0, chiusi = 0, nuovi = 0, sbagliati = 0, risposte = 0;
  let coperti = 0, da_ripassare = 0;
  for (const it of items) {
    if (it.k !== kind) continue;
    totale++;
    const p = progress[it.id];
    if (p) risposte += p.n;
    if (stato(p) === 'chiuso') chiusi++; else nuovi++;
    if (sbagliato(p)) sbagliati++;
    const c = classifica(p);
    if (c === 'coperto') coperti++; else if (c === 'da_ripassare') da_ripassare++;
  }
  const mai_visti = totale - coperti - da_ripassare;
  // Quello che resta da fare e' tutto cio' che non e' coperto: i mai visti E i
  // da ripassare. Conseguenza voluta: rispetto a `totale - chiusi` il numero
  // cresce e la quota giornaliera sale — perche' quel lavoro esiste davvero.
  const rimanenti = totale - coperti;
  const partito = !inizio || oggi >= inizio;
  // Senza una scadenza — nel sito pubblico chi non ha ancora scritto la data
  // d'esame — non esiste una quota giornaliera ne' un ritardo da misurare:
  // `giorni` e `quota` restano null e il semaforo dice 'attesa'. Un NaN qui
  // usciva come quota «NaN al giorno» e semaforo rosso: due numeri falsi con
  // l'aria di essere una misura.
  const giorni = scadenzaPiano ? Math.max(1, giorniTra(oggi, scadenzaPiano) + 1) : null;
  // La copertura era protetta dalla divisione per zero, il semaforo no: riceveva
  // un rapporto nudo e su una traccia vuota gli arrivava NaN. Siccome
  // `NaN >= x` e' falso due volte, cadeva su 'rosso'. E' il motivo per cui il
  // riquadro Tecniche appariva rosso prima che /api/seed/tecniche rispondesse --
  // scambiato per la prova che il semaforo funzionasse, mentre era un secondo
  // difetto che ne mascherava uno primo.
  const copertura = totale ? coperti / totale : 0;
  return {
    kind, totale, chiusi, nuovi, sbagliati, risposte, rimanenti,
    coperti, da_ripassare, mai_visti,
    copertura,
    giorni,
    // Se la traccia non e' ancora partita (il carteggio prima del 17 agosto)
    // la quota e' zero: dire "sei indietro" su una prova che non hai ancora
    // iniziato di proposito e' rumore, non informazione.
    quota: giorni == null ? null : partito ? Math.ceil(rimanenti / giorni) : 0,
    partita: partito,
    // Zero item non vuol dire "sei a posto": vuol dire che non c'e' niente da
    // giudicare, di solito perche' la banca non e' ancora arrivata. 'attesa' e'
    // lo stato neutro che esiste gia' per il carteggio prima del 17 agosto.
    semaforo: totale === 0 || giorni == null ? 'attesa'
      : partito ? semaforo(copertura, oggi, inizio, scadenzaPiano) : 'attesa',
  };
}

/**
 * Verde se sei almeno dove dovresti, giallo entro dieci punti, rosso sotto.
 * L'atteso e' lineare fra la data d'inizio e la scadenza: e' grossolano, ma un
 * modello piu' fine su tre settimane sarebbe finta precisione.
 */
export function semaforo(copertura, oggi, inizio, scadenzaPiano) {
  // Difensivo: e' esportata, e un NaN che arriva da fuori si vedrebbe come
  // 'rosso' senza che nulla lo dichiari. Meglio trattarlo come copertura zero.
  const cop = Number.isFinite(copertura) ? copertura : 0;
  const da = inizio || oggi;
  const totale = Math.max(1, giorniTra(da, scadenzaPiano) + 1);
  const passati = Math.min(totale, Math.max(0, giorniTra(da, oggi)));
  const atteso = passati / totale;
  if (cop >= atteso) return 'verde';
  if (cop >= atteso - 0.10) return 'giallo';
  return 'rosso';
}

// --- quanto tempo costa, non quante domande sono --------------------------------

/**
 * Traduce «N quesiti rimasti» in minuti al giorno, col tempo medio **misurato**.
 *
 * «322 al giorno» spaventa e non dice niente; «78 minuti al giorno» e' una
 * decisione che si puo' prendere. Il tempo medio esce dallo specchio dello
 * storico (`avg` per quesito, pesato sul numero di risposte); sotto le 30
 * risposte misurate la media e' rumore, e si usa un ripiego **dichiarato**
 * invece di mostrare un numero inventato con l'aria di essere preciso.
 */
export const RIPIEGO_MS = 15000;   // 15 s a risposta, finche' la misura non e' affidabile
export const MIN_MISURATE = 30;

export function stimaImpegno(progress, rimanenti, giorni, opt = {}) {
  let somma = 0, misurate = 0;
  for (const p of Object.values(progress || {})) {
    if (p && p.avg && p.n) { somma += p.avg * p.n; misurate += p.n; }
  }
  // Tre fonti, in ordine di preferenza, e la schermata deve poter dire quale
  // sta leggendo: sono tempi diversi, non versioni piu' o meno precise dello
  // stesso tempo.
  //
  //   'orologio'   l'intervallo fra due risposte, misurato da `ritmo()`. E' la
  //                durata che una persona percepisce, perche' contiene anche la
  //                lettura del riscontro.
  //   'cronometro' la media dei tempi di risposta: si ferma quando rispondi, e
  //                quindi non contiene la lettura del riscontro.
  //   'ripiego'    RIPIEGO_MS, quando non c'e' abbastanza misura. Dichiarato.
  //
  // **Perche' il cronometro non viene «reso robusto».** Verrebbe la tentazione
  // di tagliare i tempi assurdi — una domanda lasciata aperta diciotto minuti
  // non e' tempo di risposta. Misurato sull'unico archivio disponibile (2.100
  // risposte, settembre 2026) quel taglio **peggiora** la stima invece di
  // migliorarla: la media grezza e' 20,2 s, tagliata a due minuti 16,5 s, e la
  // durata vera all'orologio 23,5 s. I due errori del cronometro — le pause
  // dentro `ms`, e la lettura del riscontro fuori da `ms` — si compensano in
  // parte, e correggerne uno solo allontana dal vero. La cura giusta non e' la
  // robustezza: e' misurare l'orologio, che e' quello che `ritmo()` fa.
  const misurato = Number.isFinite(opt.msPerDomanda) && opt.msPerDomanda > 0
    ? Math.round(opt.msPerDomanda) : null;
  const daCronometro = misurate >= MIN_MISURATE;
  const fonte = misurato != null ? 'orologio' : daCronometro ? 'cronometro' : 'ripiego';
  const mediaMs = misurato != null ? misurato
    : daCronometro ? Math.round(somma / misurate) : RIPIEGO_MS;
  const minutiTotali = Math.round(rimanenti * mediaMs / 60000);
  return {
    rimanenti, mediaMs, misurate, fonte,
    affidabile: fonte !== 'ripiego',
    minutiTotali,
    minutiAlGiorno: Math.ceil(minutiTotali / Math.max(1, giorni)),
  };
}

// --- l'andamento nel tempo: sto migliorando qui? --------------------------------
//
// Lo specchio dello storico e' piegato: dice com'e' messo ogni quesito adesso,
// ma ha perso la dimensione del tempo. Per rispondere a "la mia percentuale di
// esatte in Manovra sta salendo?" servono le righe dell'archivio, una per
// risposta, che qui si aggregano per giorno. `serie` (gia' aggregata per
// quesito e giorno) resta accettata per compatibilita' con i test e con un
// eventuale import da un archivio esterno; nel sito statico e' vuota e tutto
// arriva da `codaQuiz`, cioe' dalle righe.

/**
 * Aggrega la serie per **tema** e per **voce** (chiave `tema › voce`, la
 * stessa della diagnosi), sommando sopra le righe della coda locale non ancora
 * arrivate al server — cosi' le risposte di oggi si vedono subito, anche
 * offline. (Una riga gia' accettata ma ancora in coda — il caso del beacon —
 * puo' contare doppio per qualche minuto: e' un difetto da grafico, non da
 * archivio, e sparisce al primo flush confermato.)
 *
 * Restituisce { temi: {nome: {giorno: [c, n]}}, voci: {chiave: {...}} }.
 */
export function serieGruppi(items, serie, codaQuiz, kind = 'base') {
  const temi = {}, voci = {};
  const somma = (dest, chiave, giorno, c, n) => {
    const g = dest[chiave] || (dest[chiave] = {});
    const v = g[giorno] || (g[giorno] = [0, 0]);
    v[0] += c; v[1] += n;
  };
  const perId = new Map();
  for (const it of items) if (it.k === kind) perId.set(it.id, it);
  for (const [id, giorni] of Object.entries(serie || {})) {
    const it = perId.get(id);
    if (!it) continue;
    for (const [giorno, [c, n]] of Object.entries(giorni)) {
      somma(temi, it.t, giorno, c, n);
      somma(voci, it.t + ' › ' + it.v, giorno, c, n);
    }
  }
  for (const r of codaQuiz || []) {
    const it = perId.get(r.item_id);
    if (!it) continue;
    const giorno = String(r.ts || '').slice(0, 10);
    if (giorno.length !== 10) continue;
    somma(temi, it.t, giorno, r.correct ? 1 : 0, 1);
    somma(voci, it.t + ' › ' + it.v, giorno, r.correct ? 1 : 0, 1);
  }
  return { temi, voci };
}

/**
 * Da una serie giornaliera `{giorno: [esatte, totale]}` ai punti ordinati e a
 * un verdetto: la percentuale di esatte sta salendo?
 *
 * Il verdetto confronta la media pesata della seconda meta' dei giorni con la
 * prima: piu' di 5 punti sopra e' 'su', piu' di 5 sotto e' 'giu', in mezzo
 * 'stabile'. Sotto 2 giorni o 10 risposte non c'e' verdetto (`null`): due
 * batterie non sono una tendenza, e una freccia calcolata sul rumore e'
 * peggio di nessuna freccia.
 */
export const TENDENZA_MIN_GIORNI = 2;
export const TENDENZA_MIN_RISPOSTE = 10;

export function tendenza(giorni) {
  const punti = Object.entries(giorni || {})
    .map(([g, [c, n]]) => ({ g, c, n, acc: n ? c / n : 0 }))
    .sort((a, b) => (a.g < b.g ? -1 : a.g > b.g ? 1 : 0));
  const risposte = punti.reduce((s, p) => s + p.n, 0);
  let verdetto = null;
  if (punti.length >= TENDENZA_MIN_GIORNI && risposte >= TENDENZA_MIN_RISPOSTE) {
    const meta = Math.floor(punti.length / 2);
    const acc = (ps) => {
      const n = ps.reduce((s, p) => s + p.n, 0);
      return n ? ps.reduce((s, p) => s + p.c, 0) / n : 0;
    };
    const delta = acc(punti.slice(meta)) - acc(punti.slice(0, meta));
    verdetto = delta > 0.05 ? 'su' : delta < -0.05 ? 'giu' : 'stabile';
  }
  return { punti, risposte, verdetto };
}

// --- la modalita' Mirata ---------------------------------------------------------
//
// Obiettivo: **punti d'esame recuperati per minuto**, non per domanda. Tre
// blocchi con un budget ciascuno, e le proporzioni si spostano da sole con la
// copertura e i giorni rimasti: prima si esplora, poi si consolida.
//
//   richiami        gli sbagliati non ancora ripresi, con un tetto per batteria.
//                   Il tetto non e' un dettaglio: la scala D+1/D+3/D+7 era stata
//                   tolta (0.5.1) perche' ammucchiava i ripassi nella stessa
//                   mezz'ora, e in cambio i richiami erano diventati un pulsante
//                   da ricordarsi di premere. Il budget risolve tutti e due i
//                   problemi: automatici, quindi non dipendono dall'utente, e
//                   distribuiti, quindi non si ammucchiano.
//   esplorazione    mai visti, campionati **per voce** (le 44, non gli 8 temi)
//                   con probabilita' proporzionale alla resa del tema e corretta
//                   per la debolezza della voce.
//   consolidamento  voci rivelatesi deboli, riproposte per conferma. Quasi zero
//                   all'inizio, cresce avvicinandosi all'esame.
//
// Tre proprieta' non negoziabili:
//   - ogni quesito sa dire perche' e' li' (il campo `perche`): un selettore che
//     non si spiega e' indistinguibile da uno rotto;
//   - deterministica: stesso storico e stesso giorno, stessa lista (il seme di
//     default e' `semeGiorno(oggi)`). Se non e' riproducibile non e' verificabile;
//   - il filtro «solo mai fatte» non passa di qui: la pagina non glielo applica
//     e lo dichiara in schermata, perche' un filtro che spegne i richiami in
//     silenzio e' la forma esatta del guasto che perseguita questo progetto.

function temaBreve(t) {
  const p = String(t || '').split(' ')[0];
  return p.charAt(0) + p.slice(1).toLowerCase();
}

function giornoBreve(iso) {
  const s = String(iso || '');
  return s.length >= 10 ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : s;
}

export function mirata(items, progress, oggi, opt = {}) {
  const { n = 25, pesi = null, kind = 'base', seme = semeGiorno(oggi),
          esame = null, quotaRichiami = 0.2 } = opt;
  const pool = items.filter((it) => it.k === kind);
  if (!pool.length) return [];
  const out = [];
  const presi = new Set();
  const metti = (it, perche) => { presi.add(it.id); out.push({ it, perche }); };

  const d = diagnosi(items, progress, oggi, kind, pesi);
  const perTema = new Map(d.temi.map((t) => [t.nome, t]));
  const perVoce = new Map(d.voci.map((v) => [v.tema + ' › ' + v.nome, v]));

  // 1. Richiami: gli sbagliati in sospeso, il piu' recente per primo, col tetto.
  const daRip = pool.filter((it) => classifica(progress[it.id]) === 'da_ripassare')
    .sort((a, b) => {
      const la = progress[a.id].lw || '', lb = progress[b.id].lw || '';
      return la < lb ? 1 : la > lb ? -1 : a.id < b.id ? -1 : 1;
    });
  const tettoRichiami = Math.min(daRip.length, Math.round(n * quotaRichiami));
  for (const it of daRip.slice(0, tettoRichiami))
    metti(it, `richiamo · sbagliato il ${giornoBreve(progress[it.id].lw)}`);

  // 2. Il budget del consolidamento: cresce con la copertura e con l'urgenza.
  //    Oggi, col 93% mai visto, e' quasi zero: il valore di una risposta e'
  //    ancora quasi tutto misura, non conferma.
  const vistiN = pool.filter((it) => progress[it.id] && progress[it.id].n).length;
  const cop = vistiN / pool.length;
  const gg = esame != null ? Math.max(0, giorniTra(oggi, esame)) : null;
  const urgenza = gg == null ? cop : Math.max(0, Math.min(1, 1 - gg / 14));
  const quotaCons = Math.round((n - out.length) * cop * urgenza);

  const vociDeboli = d.voci.filter((v) => v.visti >= 5 && v.esatte1 < v.visti)
    .sort((a, b) => ((b.costo ?? b.debolezza) - (a.costo ?? a.debolezza)));
  const candidatiCons = [];
  for (const v of vociDeboli) {
    const suoi = pool.filter((it) => it.t === v.tema && it.v === v.nome
      && classifica(progress[it.id]) === 'coperto')
      .sort((a, b) => {
        const ta = progress[a.id].t || '', tb = progress[b.id].t || '';
        return ta < tb ? -1 : ta > tb ? 1 : a.id < b.id ? -1 : 1;
      });
    for (const it of suoi) candidatiCons.push({ it, v });
  }
  for (const { it, v } of candidatiCons.slice(0, quotaCons))
    metti(it, `«${it.v}» debole (${Math.round((v.acc1 ?? 0) * 100)}% al primo colpo) · conferma`);

  // 3. Esplorazione pesata: riempie tutto il resto. Campionamento per voce con
  //    roulette col seme: peso = resa del tema x (1 + debolezza della voce).
  //    Dentro la voce si segue l'ordine della banca, che e' l'ordine didattico.
  const gruppi = new Map();
  for (const it of pool) {
    if (classifica(progress[it.id]) !== 'mai_visto') continue;
    const chiave = it.t + ' › ' + it.v;
    if (!gruppi.has(chiave)) gruppi.set(chiave, []);
    gruppi.get(chiave).push(it);
  }
  const voci = [...gruppi.keys()].sort();          // ordine stabile, non d'inserimento
  const pesoVoce = (chiave) => {
    const tema = chiave.split(' › ')[0];
    const resa = (perTema.get(tema) || {}).resa || 0;
    const deb = (perVoce.get(chiave) || {}).debolezza ?? (1 / 3);
    return (pesi ? resa : 1) * (1 + deb);
  };
  const rnd = creaRnd(seme);
  const etichettaResa = (tema) => {
    const r = (perTema.get(tema) || {}).resa || 0;
    return r > 0.02 ? 'resa alta' : r > 0.012 ? 'resa media' : 'resa bassa';
  };
  while (out.length < n && voci.length) {
    let tot = 0;
    for (const c of voci) tot += pesoVoce(c);
    let x = rnd() * tot, scelta = voci[voci.length - 1];
    for (const c of voci) { x -= pesoVoce(c); if (x <= 0) { scelta = c; break; } }
    const lista = gruppi.get(scelta);
    const it = lista.shift();
    metti(it, `${temaBreve(it.t)} · mai visto · ${pesi ? etichettaResa(it.t) : 'esplorazione'}`);
    if (!lista.length) voci.splice(voci.indexOf(scelta), 1);
  }

  // Se i mai visti non bastano (banca quasi chiusa): si consolida di piu', e in
  // fondo si attinge ai richiami oltre il tetto piuttosto che tornare corti.
  for (const { it, v } of candidatiCons) {
    if (out.length >= n) break;
    if (presi.has(it.id)) continue;
    metti(it, `«${it.v}» debole (${Math.round((v.acc1 ?? 0) * 100)}% al primo colpo) · conferma`);
  }
  for (const it of daRip) {
    if (out.length >= n) break;
    if (presi.has(it.id)) continue;
    metti(it, `richiamo · sbagliato il ${giornoBreve(progress[it.id].lw)}`);
  }
  return out;
}

// --- lo specchio locale dello storico -------------------------------------------
//
// Dopo ogni risposta aggiorniamo la stessa struttura che il server restituirebbe.
// Cosi' la coda si riordina subito, anche senza rete, e quando la rete torna il
// server ricalcola le stesse cifre dalle righe che gli abbiamo accodato.

/**
 * Unisce due specchi dello storico, invece di sostituirne uno con l'altro.
 *
 * Nella 0.4.1 la pagina faceva `S.prog = p.quiz`: prendeva per buono lo storico
 * del server e buttava il proprio. Bastava che il server ne sapesse meno del
 * telefono -- una risposta ancora in coda, un lotto rifiutato in silenzio, un DB
 * ripartito da zero -- perche' l'app dimenticasse tutto e la batteria
 * ricominciasse da base-1. E' il bug delle "stesse domande a ogni sessione":
 * non era l'estrazione, che e' sempre stata giusta, era la memoria. Un problema
 * di trasmissione di un minuto diventava amnesia definitiva.
 *
 * Per ogni quesito vince chi ne sa di piu', cioe' chi ha registrato piu'
 * risposte (`n`): il server quando ha ricevuto anche quelle di un altro
 * dispositivo, il telefono quando ha ancora roba da mandare. A parita' vince il
 * server, che e' la copia durevole.
 *
 * Sta qui e non nella pagina perche' e' logica pura, e perche' un bug che e'
 * costato giorni di studio merita un test che lo tenga fermo.
 */
export function fondi(locale, remoto) {
  const out = Object.assign({}, remoto || {});
  for (const [id, p] of Object.entries(locale || {})) {
    const r = out[id];
    if (!r || (p.n || 0) > (r.n || 0)) out[id] = p;
  }
  return out;
}

export function applica(progress, itemId, corretto, ms, giorno) {
  const p = progress[itemId] || { n: 0, c: 0, first: null, s: 0, lw: null, k: 0, t: null, avg: null };
  const nMs = p.avg == null ? 0 : p.n;
  p.n++;
  if (p.first == null) p.first = corretto ? 1 : 0;
  p.t = giorno;
  if (corretto) {
    p.c++; p.s++;
    if (p.lw != null) p.k++;
  } else {
    p.s = 0; p.lw = giorno; p.k = 0;
  }
  if (ms) p.avg = Math.round(((p.avg || 0) * nMs + ms) / (nMs + 1));
  progress[itemId] = p;
  return p;
}

// --- l'archivio: dalle righe allo specchio, e alle sessioni ----------------------
//
// Senza un server l'archivio delle risposte vive nel browser, una riga per
// risposta, nella stessa forma che prima viaggiava verso il server:
//   _t: 'q' quiz · 't' tecnica · 'c' carteggio · 'g' tag · 's' prova sostenuta
// Da quelle righe si derivano due cose, e tutte e due stanno qui perche' sono
// logica pura: lo specchio piegato per quesito (`ripiega`, la stessa forma che
// `applica` produce una risposta alla volta) e le sessioni (`sessioni`, le
// quattro regole che ritagliano un mucchio di risposte in liste). La regola
// del quesito che ricompare ha gia' separato due screening distanti diciannove
// secondi: merita un test che la tenga ferma.

/** Un `ts` ISO come istante confrontabile, o null se non e' una data. */
export function epoca(ts) {
  const t = Date.parse(String(ts || ''));
  return Number.isFinite(t) ? t : null;
}

/**
 * Le righe in ordine cronologico, stabile a parita' di istante.
 *
 * Per istante e non per stringa: l'archivio del progetto originario aveva due
 * formati di `ts` (UTC con Z, poi offset locale), che come stringhe non si
 * ordinano. Una riga senza data valida va in testa, cosi' non si perde e si
 * vede.
 */
export function ordinaRighe(righe) {
  return (righe || []).map((r, i) => [r, i, epoca(r && r.ts) ?? -Infinity])
    .sort((a, b) => (a[2] - b[2]) || (a[1] - b[1]))
    .map((x) => x[0]);
}

/**
 * La classificazione N/L/C che vale per ogni tentativo: `{attempt_uid: tag}`,
 * con i soli tentativi che ne hanno una.
 *
 * Ritaggare **aggiunge** una riga `_t:'g'` e non cancella le precedenti (P-01):
 * l'archivio resta append-only, cosi' l'unione per `uid` con un'altra copia non
 * puo' far tornare un tag vecchio. Vale l'ultima riga nell'ordine di
 * `ordinaRighe()`: per istante, quindi UTC e offset locale si confrontano come
 * istanti e non come stringhe; i tag storici, scritti senza data prima di P-01,
 * vengono prima di ogni tag datato; a parita' di istante decide l'ordine
 * dell'archivio.
 *
 * Una riga che `validaRiga()` rifiuterebbe non decide niente: un tag fuori da
 * N/L/C, senza tentativo o con una data rotta non sovrascrive quello buono.
 * Fino a P-17 la regola stava in `tagPerTentativo()` di app.html, senza test.
 */
export function tagPerTentativo(righe) {
  const tags = Object.create(null);
  const buone = (righe || []).filter((r) => r && r._t === 'g' && validaRiga(r) === null);
  for (const r of ordinaRighe(buone)) tags[r.attempt_uid] = r.tag;
  return tags;
}

/**
 * Lo specchio dalle righe: `{ quiz, tecnica, carteggio }`, ciascuno
 * `{item_id: {n, c, first, s, lw, k, t, avg}}`.
 *
 * E' la funzione che gira all'avvio e dopo un «ricarica i tuoi progressi»:
 * lo specchio non si salva mai, si ricalcola. Cosi' esiste una copia sola dello
 * storico, e un numero in schermata e la lista che apre vengono dalla stessa
 * fonte — che e' il difetto tornato tre volte nel progetto originario.
 *
 * Le righe di carteggio portano il giudizio in `verdict` (dato da chi studia,
 * non dall'app); le altre in `correct`.
 */
export function ripiega(righe) {
  const out = { quiz: {}, tecnica: {}, carteggio: {} };
  for (const r of ordinaRighe(righe)) {
    const dest = r._t === 'q' ? out.quiz : r._t === 't' ? out.tecnica : r._t === 'c' ? out.carteggio : null;
    if (!dest || !r.item_id) continue;
    const ok = r._t === 'c' ? !!r.verdict : !!r.correct;
    applica(dest, r.item_id, ok, +r.ms || 0, String(r.ts || '').slice(0, 10));
  }
  return out;
}

// Oltre questa pausa fra due risposte non e' piu' la stessa sessione: una pausa
// vera (il caffe', il telefono) sta sotto, riaprire la palestra dopo mezz'ora
// e' un'altra sessione. Serve solo per le righe senza `sim_uid`.
export const PAUSA_SESSIONE_MS = 20 * 60000;

/**
 * Le sessioni di quiz, dalla piu' recente, ritagliate dalle righe.
 *
 * Ogni risposta porta il `sim_uid` della lista in cui e' uscita, quindi di
 * norma il confine e' **registrato** (`fonte: 'sim_uid'`). Per righe senza
 * legame — un archivio importato da altrove, o righe rotte — il confine si
 * **ricostruisce** (`fonte: 'risposte'`), e una sessione si chiude quando:
 *
 *   - cambia il `sim_uid`;
 *   - cambia `mode` o `kind`;
 *   - passano piu' di PAUSA_SESSIONE_MS fra una risposta e l'altra;
 *   - **ricompare un quesito gia' uscito nella sessione**. E' la regola che
 *     fa il lavoro vero: nessuna modalita' di selezione ripete un quesito
 *     dentro la stessa lista, quindi un doppione e' per forza una lista nuova.
 *
 * Ogni sessione porta le sue `righe`, cosi' si puo' riaprire e rivedere senza
 * una seconda ricerca; `prova` e' la riga di prova sostenuta (`_t: 's'`) con
 * lo stesso uid, che solo le simulazioni hanno. Due tempi: `ms` e' la somma
 * dei tempi di risposta, `durata` e' da capo a coda — a schermo va la seconda.
 * **`durata` e' `null` quando l'orologio non la misura**: basta una riga del
 * gruppo senza un `ts` che sia una data. Fino al 30 settembre 2026 ripiegava su
 * `ms`, cioe' su un cronometro con il nome di un orologio, e `ritmo()` lo
 * prendeva per buono (P-16). Chi vuole mostrare comunque un tempo sceglie da
 * se' `ms`, e sa che cosa sta mostrando.
 *
 * **Due confini, e si sceglie per nome** (`opt.confine`):
 *
 *   - `'pausa'`, il predefinito: le quattro regole qui sopra valgono anche per
 *     le righe con il legame. E' quello che usa `ritmo()`, che misura il passo
 *     fra due risposte e che una pausa di mezz'ora dentro un gruppo falserebbe.
 *     Il prezzo: un'attivita' ripresa dopo una pausa esce in **due gruppi con
 *     lo stesso id**.
 *   - `'attivita'`: le righe con lo stesso `sim_uid` stanno insieme, oltre la
 *     pausa e anche intrecciate con un'altra attivita' (due schede aperte), e
 *     ogni id compare una volta sola. E' il confine di un riepilogo, di una
 *     revisione e di «riprova questi errori» (docs/area-3-progetto.md §7.1).
 *     Le righe senza legame si ricostruiscono **esattamente come col primo**:
 *     non c'e' niente di registrato da ricucire. Un'attivita' che raccoglie un
 *     quesito ripetuto, due modalita' o due banche non e' integra — un uid nasce
 *     a ogni avvio e nessuna selezione ripete un quesito —, quindi porta
 *     `ambigua: true` e i `motivi`, invece di passare per buona.
 *
 * Un confine che non e' uno dei due e' un errore: un'opzione ignorata
 * tornerebbe in silenzio al confine per pausa.
 */
export function sessioni(righe, opt = {}) {
  const { limite = Infinity, confine = 'pausa' } = opt;
  if (confine !== 'pausa' && confine !== 'attivita') {
    throw new Error(`sessioni: confine sconosciuto «${confine}» (pausa | attivita)`);
  }
  const prove = new Map();
  for (const r of righe || []) if (r && r._t === 's') prove.set(String(r.uid), r);
  const gruppi = [];
  let g = null;
  for (const r of ordinaRighe((righe || []).filter((x) => x && x._t === 'q'))) {
    const su = r.sim_uid || null;
    const t = epoca(r.ts);
    const nuovo = !g
      || su !== g.sim_uid
      || r.mode !== g.mode
      || r.kind !== g.kind
      || g._visti.has(r.item_id)
      || (t != null && g._ultimo != null && t - g._ultimo > PAUSA_SESSIONE_MS);
    if (nuovo) {
      g = { id: su || 'r:' + r.uid, fonte: su ? 'sim_uid' : 'risposte', sim_uid: su,
            mode: r.mode, kind: r.kind, inizio: r.ts, fine: r.ts,
            n: 0, esatte: 0, ms: 0, righe: [], _visti: new Set(), _ultimo: null };
      gruppi.push(g);
    }
    g._visti.add(r.item_id);
    if (t != null) g._ultimo = t;
    g.fine = r.ts; g.n++; g.esatte += r.correct ? 1 : 0; g.ms += +r.ms || 0;
    g.righe.push(r);
  }
  const out = (confine === 'attivita' ? cuciAttivita(gruppi) : gruppi).map(({ _visti, _ultimo, ...s }) => {
    // Da capo a coda solo se ogni riga ha la sua ora. Basta guardare il capo:
    // ordinaRighe() mette in testa ogni riga senza data, e cuciAttivita() tiene
    // quell'ordine, quindi se una manca manca anche `inizio`.
    const a = epoca(s.inizio), b = epoca(s.fine);
    s.durata = a != null && b != null && b >= a ? b - a : null;
    s.prova = prove.get(String(s.sim_uid || '')) || null;
    return s;
  });
  out.sort((x, y) => ((epoca(y.fine) ?? 0) - (epoca(x.fine) ?? 0))
                  || ((epoca(y.inizio) ?? 0) - (epoca(x.inizio) ?? 0)));
  return Number.isFinite(limite) ? out.slice(0, limite) : out;
}

/**
 * Il confine dell'attivita': i gruppi per pausa con lo stesso `sim_uid`
 * diventano uno, con le righe in ordine cronologico. Si parte dai gruppi e non
 * dalle righe apposta: cosi' quelli ricostruiti restano identici, id compreso,
 * e i due confini differiscono soltanto dove c'e' un legame registrato.
 */
function cuciAttivita(gruppi) {
  const per = new Map(), out = [];
  for (const g of gruppi) {
    if (!g.sim_uid) { out.push({ ...g, ambigua: false, motivi: [] }); continue; }
    const a = per.get(g.sim_uid);
    if (!a) { const c = { ...g, righe: [...g.righe] }; per.set(g.sim_uid, c); out.push(c); continue; }
    a.righe.push(...g.righe);
    a.n += g.n; a.esatte += g.esatte; a.ms += g.ms;
  }
  // Le righe restano in ordine senza riordinarle: i gruppi nascono in ordine
  // cronologico e ognuno e' un tratto contiguo del tempo.
  for (const a of per.values()) {
    a.inizio = a.righe[0].ts; a.fine = a.righe[a.righe.length - 1].ts;
    const ids = new Set(a.righe.map((r) => r.item_id));
    a.motivi = [];
    if (ids.size < a.righe.length) a.motivi.push('quesito ripetuto');
    if (new Set(a.righe.map((r) => r.mode)).size > 1) a.motivi.push('modalità diverse');
    if (new Set(a.righe.map((r) => r.kind)).size > 1) a.motivi.push('banca diversa');
    a.ambigua = a.motivi.length > 0;
  }
  return out;
}

/**
 * Il **ritmo**: quanti millisecondi passano fra una risposta e la successiva,
 * misurato sulle sessioni concluse. E' il tempo per domanda **all'orologio**,
 * cioe' quello che una persona percepisce: comprende la lettura del riscontro,
 * che `ms` non contiene.
 *
 * **Perche' `durata / (n - 1)` e non `durata / n`.** `durata` va dalla prima
 * risposta all'ultima, quindi copre `n - 1` intervalli e non `n`. Dividendo per
 * `n` una sessione di cinque risposte uscirebbe sottostimata del 20%, e una da
 * cento dell'1%: il ritmo dipenderebbe dalla lunghezza della sessione invece
 * che dalla persona.
 *
 * **Perche' la mediana fra sessioni.** Un pomeriggio in cui ti sei alzato dal
 * tavolo produce una sessione lentissima; la mediana non la segue. E' robusta
 * per costruzione, senza nessuna soglia da tarare su un archivio particolare —
 * che sarebbe una misura su un campione di uno travestita da costante. La
 * pausa massima *dentro* una sessione e' gia' limitata a `PAUSA_SESSIONE_MS`,
 * perche' oltre quella il motore taglia.
 *
 * Restituisce `msPerDomanda: null` quando non c'e' niente da misurare: non si
 * inventa un numero.
 *
 * **Solo l'orologio misura il ritmo** (P-16). Una sessione conta se ha almeno
 * due risposte e una `durata` da capo a coda, cioe' se ogni sua riga ha un `ts`
 * che e' una data: senza, `sessioni()` da' `durata: null`, e la sessione non
 * entra. Fino al 30 settembre 2026 la durata ripiegava sulla somma dei tempi di
 * risposta, e trenta righe senza data uscivano `affidabile` con `fonte:
 * 'orologio'` — un cronometro dichiarato orologio (docs/area-2-collaudo-ux.md).
 * Per lo stesso motivo la soglia `minRisposte` si confronta con `misurate`, le
 * risposte delle sessioni che hanno dato un intervallo, e non con `risposte`,
 * tutte quelle viste: una risposta senza data, o sola nella sua lista, non ha
 * un intervallo da misurare. Il chiamante passa l'archivio com'e', senza
 * filtrarlo.
 */
export function ritmo(righe, opt = {}) {
  const { minRisposte = MIN_MISURATE } = opt;
  const passi = [];
  let risposte = 0, misurate = 0;
  for (const s of sessioni(righe)) {
    risposte += s.n;
    if (s.n >= 2 && s.durata > 0) {             // null non e' > 0
      passi.push(s.durata / (s.n - 1));
      misurate += s.n;
    }
  }
  passi.sort((a, b) => a - b);
  const m = passi.length;
  const mediana = !m ? null
    : m % 2 ? passi[(m - 1) / 2] : (passi[m / 2 - 1] + passi[m / 2]) / 2;
  return {
    msPerDomanda: mediana == null ? null : Math.round(mediana),
    sessioni: m,
    risposte,
    misurate,
    affidabile: m > 0 && misurate >= minRisposte,
    fonte: 'orologio',
  };
}

/**
 * Gli errori di **una** sessione, pronti da riaprire come esercizio.
 *
 * Serve a chiudere il ciclo di un'attivita': dopo un riepilogo con tre errori,
 * «rifai questi tre» deve aprire esattamente quei tre. Oggi l'unica strada e'
 * la modalita' «solo sbagliate», che li mescola con gli errori di sempre — e il
 * lavoro appena fatto non ha un seguito che gli appartenga.
 *
 * `id` e' l'identificatore di sessione restituito da `sessioni()`: il `sim_uid`
 * quando il confine e' **registrato**, un id ricostruito quando non lo e'. La
 * `fonte` viaggia nel risultato perche' affidabile e registrato non sono la
 * stessa cosa, e su un archivio importato da altrove la differenza va detta
 * invece che nascosta.
 *
 * **Il confine e' sempre quello dell'attivita'** (`sessioni(…, { confine:
 * 'attivita' })`), e non si sceglie: fino al 26 settembre 2026 era quello per
 * pausa, e un'attivita' ripresa dopo 21 minuti usciva in due gruppi con lo
 * stesso id — la funzione prendeva il primo e restituiva un errore su due,
 * dichiarando `fonte: 'sim_uid'` proprio mentre tagliava il confine registrato
 * (P-30, docs/area-3-progetto.md §10.1). Gli errori di mezza attivita' non sono
 * mai la risposta giusta, quindi `opt.confine` diverso da `'attivita'` e' un
 * errore invece di un ripiego.
 *
 * Il risultato, oltre a `lista`, `quanti`, `fonte` e `trovata`:
 *   - `ambigua` e `motivi`: l'id raccoglie un quesito ripetuto, due modalita' o
 *     due banche. Allora `lista` e' vuota e `quanti` e' `null` — non «nessun
 *     errore», che sarebbe falso, ma «non si sa»: non si riapre una lista che
 *     non si puo' verificare;
 *   - `mancanti`: gli `item_id` sbagliati che la banca passata non ha. Sono
 *     errori veri che non si possono riaprire, e la differenza fra gli errori
 *     dell'attivita' e `quanti` si dice invece di sparire.
 *
 * Dentro un'attivita' integra un quesito non compare due volte; il controllo
 * sui doppioni resta lo stesso, perche' costa una riga.
 */
export function erroriSessione(righe, items, id, opt = {}) {
  const { confine = 'attivita' } = opt;
  if (confine !== 'attivita') {
    throw new Error(`erroriSessione: il confine e' quello dell'attivita', non «${confine}»`);
  }
  const vuoto = { lista: [], quanti: 0, fonte: null, trovata: false, ambigua: false, motivi: [], mancanti: [] };
  const s = sessioni(righe, { confine }).find((x) => String(x.id) === String(id));
  if (!s) return vuoto;
  if (s.ambigua) {
    return { ...vuoto, quanti: null, fonte: s.fonte, trovata: true, ambigua: true, motivi: s.motivi };
  }
  const per = new Map((items || []).map((it) => [it.id, it]));
  const visti = new Set(), lista = [], mancanti = [];
  for (const r of s.righe) {
    if (r.correct || visti.has(r.item_id)) continue;
    visti.add(r.item_id);
    const it = per.get(r.item_id);
    if (it) lista.push(it); else mancanti.push(r.item_id);
  }
  return { lista, quanti: lista.length, fonte: s.fonte, trovata: true,
           ambigua: false, motivi: [], mancanti };
}

// --- Carteggio e tecniche: l'attivita' intera (P-33) -------------------------
//
// `sessioni()` ed `erroriSessione()` leggono soltanto le righe dei quiz, e cosi'
// restano: il loro confine predefinito e' quello di `ritmo()`. Il carteggio
// (`_t: 'c'`) e il riconoscimento delle tecniche (`_t: 't'`) hanno qui il loro
// contratto, D-02 del §10.1 di docs/area-4-progetto.md: lo schema delle righe e
// la compatibilita' con quelle di prima sono scritti li'.

/** Il tipo si sceglie per nome: un'opzione ignorata tornerebbe in silenzio ai quiz. */
function tipoCarteggio(opt, chi) {
  const tipo = opt && opt.tipo;
  if (tipo === 'q') throw new Error(`${chi}: i quiz hanno sessioni() ed erroriSessione(), non questa funzione`);
  if (tipo !== 'c' && tipo !== 't') throw new Error(`${chi}: tipo sconosciuto «${tipo}» (c | t)`);
  return tipo;
}

/** 1/true e 0/false; qualunque altra cosa e' «non registrato», mai un no. */
function siNo(v) {
  if (v === 1 || v === true) return true;
  if (v === 0 || v === false) return false;
  return null;
}

/** Il testo scritto da chi studia, com'e', o null se la riga non lo porta. */
function rispostaScritta(r) {
  let o = r.input_json;
  if (typeof o === 'string') { try { o = JSON.parse(o); } catch { return null; } }
  return o && typeof o === 'object' && typeof o.risposta === 'string' ? o.risposta : null;
}

/**
 * Le attivita' del Carteggio di un tipo — `tipo: 'c'`, gli esercizi sulla
 * carta (prova, giro, tappeto), o `tipo: 't'`, il riconoscimento delle tecniche —
 * dalla piu' recente. Il tipo e' obbligatorio: questa funzione non vede i quiz,
 * e `sessioni()` non vede questi due tipi.
 *
 * **Il confine e' quello dell'attivita'.** Le righe con lo stesso `sim_uid`
 * stanno insieme oltre qualunque pausa e anche intrecciate con altre attivita'
 * (`fonte: 'sim_uid'`). Le righe senza legame — tutte quelle scritte prima di
 * P-33, fuori dalla prova — si **ricostruiscono**, e lo dicono
 * (`fonte: 'risposte'`):
 *
 *   - `'c'`: stesso istante e stessa modalita'. E' il modo in cui `salvaCart()`
 *     le ha sempre scritte, un `ts` solo per salvataggio (0.5.0);
 *   - `'t'`: le regole di `sessioni()` — cambia modalita', ricompare un
 *     esercizio, passano piu' di PAUSA_SESSIONE_MS, o in mezzo c'e' una riga
 *     con un legame.
 *
 * L'id di un gruppo ricostruito e' `'r:' +` il piu' piccolo `uid` delle sue
 * righe: non dipende dall'ordine in cui l'archivio le restituisce, perche' la
 * revisione riapre per id. Le righe con lo stesso `uid` sono la stessa riga
 * (un ritento), e contano una volta; la prima vince, come in `fondiArchivio()`.
 *
 * Ogni attivita' porta, oltre a `righe`, `n`, `ms` (la somma dei tempi
 * registrati: su carta e' il tempo della lista diviso per esercizio, non una
 * misura per esercizio), `inizio` e `fine`:
 *   - `prova`: la riga `_t: 's'` con lo stesso uid, solo per una prova di
 *     carteggio (`kind: 'carteggio'`, modalita' `simulazione`);
 *   - `proposti`: quanti esercizi aveva la lista proposta, se registrato — dal
 *     campo `proposti` delle righe o, per le prove di prima, da `total` della
 *     riga di prova; altrimenti `null`, non il numero delle righe;
 *   - `variante`: quella della prova (P-32), o `null` se non registrata — non
 *     `'cieca'`;
 *   - `ordine`: `'registrato'` quando ogni riga porta la sua `pos` nella lista,
 *     e allora le righe sono in quell'ordine; altrimenti `'non registrato'`, e
 *     sono in ordine di tempo;
 *   - `ambigua` e `motivi`: un'attivita' che non si puo' verificare — un
 *     esercizio ripetuto, modalita' diverse, lo stesso id su righe di un altro
 *     tipo, una riga di prova estranea (di un altro `kind`, o su un
 *     allenamento, o sulle tecniche), varianti diverse, una quantita' proposta
 *     incoerente (diversa fra le righe, presente solo su alcune, o minore delle
 *     righe). Non si risolve scegliendo: si dice.
 */
export function attivitaCarteggio(righe, opt = {}) {
  const tipo = tipoCarteggio(opt, 'attivitaCarteggio');
  const uidViste = new Set(), mie = [], altrui = new Set(), prove = new Map();
  for (const r of righe || []) {
    if (!r || typeof r !== 'object') continue;
    if (r._t === 's') { if (!prove.has(String(r.uid))) prove.set(String(r.uid), r); continue; }
    if (r._t === tipo) {
      if (typeof r.uid === 'string' && r.uid) { if (uidViste.has(r.uid)) continue; uidViste.add(r.uid); }
      mie.push(r);
      continue;
    }
    if ((r._t === 'q' || r._t === 'c' || r._t === 't') && r.sim_uid) altrui.add(String(r.sim_uid));
  }

  const gruppi = [], perUid = new Map(), perIstante = new Map();
  const nuovo = (su) => { const a = { sim_uid: su, righe: [] }; gruppi.push(a); return a; };
  let g = null;
  for (const r of ordinaRighe(mie)) {
    const su = r.sim_uid ? String(r.sim_uid) : null;
    if (su) {
      g = null;
      if (!perUid.has(su)) perUid.set(su, nuovo(su));
      perUid.get(su).righe.push(r);
      continue;
    }
    if (tipo === 'c') {
      const chiave = `${epoca(r.ts) ?? String(r.ts)}\u0000${r.mode ?? ''}`;
      if (!perIstante.has(chiave)) perIstante.set(chiave, nuovo(null));
      perIstante.get(chiave).righe.push(r);
      continue;
    }
    const t = epoca(r.ts);
    if (!g || r.mode !== g.mode || g.visti.has(r.item_id)
        || (t != null && g.ultimo != null && t - g.ultimo > PAUSA_SESSIONE_MS)) {
      g = nuovo(null); g.mode = r.mode; g.visti = new Set(); g.ultimo = null;
    }
    g.visti.add(r.item_id);
    if (t != null) g.ultimo = t;
    g.righe.push(r);
  }

  const out = gruppi.map(({ sim_uid, righe: rr }) => {
    const n = rr.length;
    const motivi = [];
    if (new Set(rr.map((r) => r.item_id)).size < n) motivi.push('esercizio ripetuto');
    const modi = new Set(rr.map((r) => r.mode ?? null));
    if (modi.size > 1) motivi.push('modalità diverse');
    const mode = modi.size === 1 ? [...modi][0] : null;
    if (sim_uid && altrui.has(sim_uid)) motivi.push('tipi diversi');
    let prova = null;
    const s = sim_uid ? prove.get(sim_uid) : null;
    if (s) {
      if (tipo === 'c' && s.kind === 'carteggio' && mode === 'simulazione') prova = s;
      else motivi.push('riga di prova estranea');
    }
    const varianti = new Set(rr.map((r) => r.variante ?? null));
    if (prova && prova.variante != null) varianti.add(prova.variante);
    if (varianti.size > 1) motivi.push('variante diversa');
    const variante = varianti.size === 1 ? [...varianti][0] : null;
    const dichiarati = rr.map((r) => r.proposti).filter((p) => p != null);
    const candidati = [...dichiarati];
    if (prova && prova.total != null) candidati.push(prova.total);
    let proposti = null;
    if (candidati.length) {
      const ok = (dichiarati.length === 0 || dichiarati.length === n)
        && new Set(candidati).size === 1 && Number.isInteger(candidati[0]) && candidati[0] >= n;
      if (ok) proposti = candidati[0]; else motivi.push('quantità proposta incoerente');
    }
    const pos = rr.map((r) => r.pos);
    const registrato = pos.every((p) => Number.isInteger(p) && p >= 0 && (proposti == null || p < proposti))
      && new Set(pos).size === n;
    const ordinate = registrato ? [...rr].sort((a, b) => a.pos - b.pos) : rr;
    const uids = rr.map((r) => String(r.uid)).sort();
    return {
      id: sim_uid || 'r:' + uids[0], tipo, fonte: sim_uid ? 'sim_uid' : 'risposte', sim_uid,
      mode, inizio: rr[0].ts, fine: rr[n - 1].ts, n, ms: rr.reduce((a, r) => a + (+r.ms || 0), 0),
      righe: ordinate, prova, proposti, variante,
      ordine: registrato ? 'registrato' : 'non registrato',
      ambigua: motivi.length > 0, motivi,
    };
  });
  out.sort((x, y) => ((epoca(y.fine) ?? 0) - (epoca(x.fine) ?? 0))
                  || ((epoca(y.inizio) ?? 0) - (epoca(x.inizio) ?? 0)));
  return out;
}

const FILTRI_CARTEGGIO = { c: ['tutti', 'da-rivedere'], t: ['tutte', 'non-coincidenti'] };

/**
 * Il dettaglio di **una** attivita' del Carteggio: le schede, i conteggi e il
 * filtro della revisione, dalla stessa fonte — il numero su «Rivedi quelli da
 * rivedere ({D})» e le schede che apre sono lo stesso calcolo (§7.1–7.3 di
 * docs/area-4-progetto.md). `id` e' quello di `attivitaCarteggio()`, `banca`
 * l'elenco degli esercizi (`carteggio.json` o `tecniche.json`), o `null` se
 * non e' caricata.
 *
 * Una scheda di carteggio porta `risposta` (il testo com'e', senza
 * normalizzarlo; `null` se la riga non lo registra), `scritta` (`false` per un
 * campo vuoto, `null` se non registrato: due cose diverse) e `giudizio`
 * (`true` «il risultato coincide», `false` «da rivedere», `null` se manca — e
 * un giudizio che manca non diventa «da rivedere»). Una scheda di tecniche
 * porta `scelte` (`[]` se non ne hai scelta nessuna, `null` se non
 * registrate), `attese` dalla banca e `coincidono`, l'esito registrato allora.
 * Ogni scheda ha `esercizio`, l'elemento della banca, o `null`.
 *
 * `conteggi` — carteggio: `proposti, esercizi, scritti, vuoti, nonRegistrati,
 * coincidenti, daRivedere, senzaGiudizio, nonAffrontati`; tecniche: `proposti,
 * risposte, coincidenti, nonCoincidenti, senzaEsito, nonAffrontati`.
 * `nonAffrontati` e' `null` quando la quantita' proposta non e' registrata:
 * dalle righe assenti non si deduce niente.
 *
 * `filtro` si sceglie per nome — `'tutti' | 'da-rivedere'` sul carteggio,
 * `'tutte' | 'non-coincidenti'` sulle tecniche — e `mostrate` sono le schede
 * che passa. Un filtro sconosciuto e' un errore.
 *
 * `esito` c'e' solo per una prova (modalita' `simulazione`) con **tutti** i
 * giudizi: `{ coincidenti, su, soglia, raggiunta }`, con la soglia di
 * `PROVA_CARTEGGIO`; un allenamento non ha soglia.
 *
 * `mancanti`: gli esercizi che la banca passata non ha — la scheda resta, con
 * il risultato proprio; `null` se la banca non c'e', perche' allora non si sa.
 * Un'attivita' ambigua ha `schede` vuote, `conteggi` ed `esito` `null`: non
 * «zero da rivedere», che sarebbe falso. Un id che non c'e' ha `trovata: false`.
 */
export function dettaglioCarteggio(righe, banca, id, opt = {}) {
  const tipo = tipoCarteggio(opt, 'dettaglioCarteggio');
  const filtri = FILTRI_CARTEGGIO[tipo];
  const filtro = opt.filtro ?? filtri[0];
  if (!filtri.includes(filtro)) {
    throw new Error(`dettaglioCarteggio: filtro sconosciuto «${filtro}» per il tipo ${tipo} (${filtri.join(' | ')})`);
  }
  const conBanca = Array.isArray(banca);
  const vuoto = { trovata: false, id, tipo, fonte: null, mode: null, variante: null, proposti: null,
    ordine: null, prova: null, ambigua: false, motivi: [], banca: conBanca, filtro,
    schede: [], mostrate: [], conteggi: null, mancanti: conBanca ? [] : null, esito: null };
  const a = attivitaCarteggio(righe, { tipo }).find((x) => String(x.id) === String(id));
  if (!a) return vuoto;
  const testa = { ...vuoto, trovata: true, id: a.id, fonte: a.fonte, mode: a.mode, variante: a.variante,
    proposti: a.proposti, ordine: a.ordine, prova: a.prova, ambigua: a.ambigua, motivi: a.motivi };
  if (a.ambigua) return testa;

  const per = conBanca ? new Map(banca.filter(Boolean).map((e) => [e.id, e])) : null;
  const mancanti = conBanca ? [] : null;
  const schede = a.righe.map((r) => {
    const esercizio = per ? per.get(r.item_id) ?? null : null;
    if (per && !esercizio && !mancanti.includes(r.item_id)) mancanti.push(r.item_id);
    const base = { item_id: r.item_id, uid: r.uid, ts: r.ts, pos: Number.isInteger(r.pos) ? r.pos : null, esercizio, riga: r };
    if (tipo === 'c') {
      const risposta = rispostaScritta(r);
      return { ...base, risposta, scritta: risposta == null ? null : risposta.trim() !== '', giudizio: siNo(r.verdict) };
    }
    return { ...base,
      scelte: typeof r.chosen === 'string' ? (r.chosen ? r.chosen.split('|') : []) : null,
      attese: esercizio && Array.isArray(esercizio.tecniche) ? [...esercizio.tecniche] : null,
      coincidono: siNo(r.correct) };
  });
  const quante = (f) => schede.filter(f).length;
  const nonAffrontati = a.proposti == null ? null : a.proposti - a.n;
  let conteggi, mostrate, esito = null;
  if (tipo === 'c') {
    conteggi = { proposti: a.proposti, esercizi: a.n,
      scritti: quante((s) => s.scritta === true), vuoti: quante((s) => s.scritta === false),
      nonRegistrati: quante((s) => s.scritta === null),
      coincidenti: quante((s) => s.giudizio === true), daRivedere: quante((s) => s.giudizio === false),
      senzaGiudizio: quante((s) => s.giudizio === null), nonAffrontati };
    mostrate = filtro === 'da-rivedere' ? schede.filter((s) => s.giudizio === false) : schede;
    if (a.mode === 'simulazione' && conteggi.senzaGiudizio === 0) {
      const soglia = PROVA_CARTEGGIO.soglia;
      esito = { coincidenti: conteggi.coincidenti, su: a.proposti ?? a.n, soglia,
                raggiunta: conteggi.coincidenti >= soglia };
    }
  } else {
    conteggi = { proposti: a.proposti, risposte: a.n,
      coincidenti: quante((s) => s.coincidono === true), nonCoincidenti: quante((s) => s.coincidono === false),
      senzaEsito: quante((s) => s.coincidono === null), nonAffrontati };
    mostrate = filtro === 'non-coincidenti' ? schede.filter((s) => s.coincidono === false) : schede;
  }
  return { ...testa, schede, mostrate, conteggi, mancanti, esito };
}

// Una riga dell'archivio pesa ~200 byte; la piu' grande misurata sull'archivio
// vero del progetto di preparazione (2.341 righe) ne pesa 241, ed e' una di
// carteggio, che porta il testo scritto da chi studia. Il tetto lascia spazio a
// una risposta lunga e non a un file infilato dentro una riga.
export const RIGA_MAX_BYTE = 4096;
const TIPI_RIGA = new Set(['q', 'c', 't', 's', 'g']);
const TIPI_CON_QUESITO = new Set(['q', 'c', 't']);
const TAG = new Set(['N', 'L', 'C']);
// Data e ora, con i secondi facoltativi, e **sempre** un offset: `Z` (le righe
// in UTC scritte fino alla 0.4.5, 135 nell'archivio vero) o `±hh:mm` (tutte le
// altre). Senza offset un'ora non dice quando e', e il giorno di studio che se
// ne ricava dipende dal fuso di chi legge.
const TS_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?(Z|[+-]\d{2}:\d{2})$/;

/**
 * Se una riga si puo' accettare nell'archivio: `null` se si', altrimenti il
 * motivo, come frase breve e stabile — «data non valida», «senza uid» — perche'
 * chi importa possa contare gli scarti per motivo invece di un numero muto.
 *
 * E' la regola **sola**. La usano l'import (`fondiArchivio`) e, con gli account,
 * la conversione di un file e il server, che importa questo stesso file
 * (docs/account-progetto.md §4.1): il browser e il server rifiutano le stesse
 * righe per gli stessi motivi. Due copie della regola sono la riga con
 * `ts: "boh"` della 0.4.6, accettata dal server e fatale su ogni dispositivo.
 *
 * Controlla la forma da cui dipende chi legge le righe, e niente di piu':
 * **un campo che non conosce lo lascia stare**, perche' la forma delle righe la
 * decide la pagina e cresce, e una riga si conserva com'e' arrivata.
 *
 * Le righe di tag (`_t: 'g'`) sono le sole senza data: la pagina le scrive
 * cosi' (160 nell'archivio vero), e fino a questa funzione ogni import le
 * scartava. Se la data c'e', deve essere una data.
 *
 * Con `quesiti` — l'insieme degli id della banca — un `item_id` che non esiste
 * e' rifiutato: la banca e' immutabile, quindi e' un sintomo. Senza, non si
 * controlla: la pagina chiama `fondiArchivio` senza la banca accanto.
 */
export function validaRiga(riga, { quesiti } = {}) {
  if (!riga || typeof riga !== 'object' || Array.isArray(riga)) return "non e' una riga";
  if (typeof riga.uid !== 'string' || !riga.uid || riga.uid.length > 64) return 'senza uid';
  if (!TIPI_RIGA.has(riga._t)) return 'tipo sconosciuto';
  if (riga._t !== 'g' || riga.ts != null) {
    if (typeof riga.ts !== 'string' || !TS_ISO.test(riga.ts) || epoca(riga.ts) == null) return 'data non valida';
  }
  if (TIPI_CON_QUESITO.has(riga._t)) {
    if (typeof riga.item_id !== 'string' || !riga.item_id) return 'senza quesito';
    if (quesiti && !quesiti.has(riga.item_id)) return 'quesito sconosciuto';
  }
  if (riga._t === 'g' && (typeof riga.attempt_uid !== 'string' || !riga.attempt_uid || !TAG.has(riga.tag))) {
    return 'tag non valido';
  }
  let json;
  try { json = JSON.stringify(riga); } catch { return "non e' una riga"; }
  if (new TextEncoder().encode(json).length > RIGA_MAX_BYTE) return 'troppo grande';
  return null;
}

/**
 * Fonde un archivio importato con quello presente, per `uid`: una riga gia'
 * presente non si duplica, una nuova entra. Restituisce le righe fuse e i
 * conteggi, perche' «ricaricati» deve dire quante ne ha prese e quante aveva
 * gia' — un pulsante che risponde «fatto» per righe che ha scartato e' un
 * difetto, non una scortesia. `motivi` dice perche' le ha scartate,
 * `{ motivo: quante }`, con i motivi di `validaRiga()`.
 *
 * Le righe accolte entrano **come sono arrivate**, campi sconosciuti compresi.
 */
export function fondiArchivio(presenti, importate, opt = {}) {
  const per = new Map();
  for (const r of presenti || []) if (r && r.uid != null) per.set(String(r.uid), r);
  let nuove = 0, gia = 0, scartate = 0;
  const motivi = {};
  for (const r of importate || []) {
    const motivo = validaRiga(r, opt);
    if (motivo) { scartate++; motivi[motivo] = (motivi[motivo] || 0) + 1; continue; }
    if (per.has(String(r.uid))) { gia++; continue; }
    per.set(String(r.uid), r); nuove++;
  }
  return { righe: [...per.values()], nuove, gia, scartate, motivi };
}

// --- la bozza del carteggio (P-34) ------------------------------------------------
//
// Il testo che si scrive nel runner del carteggio durante un'ora di prova non e'
// una risposta: e' lavoro in corso, senza giudizio. Fino a P-34 stava solo in
// memoria (annotaCart(), dalla 0.5.0), e una ricarica lo perdeva, mentre la
// specifica prometteva «salvato a ogni tasto». D-03 del §10.1 di
// docs/area-4-progetto.md chiede una **bozza**: legata all'account, separata
// dalle righe valutate, esclusa da ripiega(), dai conteggi e dagli invii,
// cancellata solo a conclusione confermata o a scarto esplicito.
//
// Qui ci sono le sue regole pure. Dove vive — l'archivio `meta` della copia
// dell'account, una chiave per attivita' —, come si scrive a ogni input e che
// cosa dice la pagina stanno nel §9.4 di docs/account-client-progetto.md: lo
// storage e' della pagina, e C-19 lo prova in un browser vero.
//
// **Una bozza non e' una riga, per costruzione:** non ha `_t`, `uid`, `ts` ne'
// `verdict`, quindi `validaRiga()` la rifiuta, `ripiega()` e
// `attivitaCarteggio()` non la vedono, e la coda non puo' portarla. E una bozza
// con uno di quei campi non e' valida: le due forme non si possono confondere
// in nessuna direzione. Senza account la bozza non esiste (ADR-004): queste
// funzioni non lo sanno, e non devono — lo decide chi scrive.

/** Le costanti della bozza: la chiave nella copia dell'account e le modalita' del runner. */
export const BOZZA_CARTEGGIO = Object.freeze({
  tipo: 'bozza-carteggio',
  versione: 1,
  chiave: 'bozza-carteggio:',
  modi: Object.freeze(['simulazione', 'giro-tecniche', 'tappeto']),
  // Un uid di riga sta in 64 caratteri (validaRiga): le righe finali sono
  // `id:pos`, quindi l'id ne lascia quattro.
  idMax: 60,
});
const CAMPI_RIGA = ['_t', 'uid', 'ts', 'verdict', 'item_id', 'sim_uid', 'input_json'];
// Quello che resta della stessa attivita' per tutta la sua vita: la lista
// preparata, la modalita', il tempo. Cambiarli scrivendo vorrebbe dire un'altra
// prova con lo stesso nome — o sessanta minuti nuovi a ogni ricarica.
const IDENTITA_BOZZA = ['tipo', 'versione', 'id', 'modo', 'lista', 'variante', 'inizio', 'scadenza'];
const intero = (n) => Number.isInteger(n) && n >= 0;
const istante = (n) => Number.isFinite(n) && n > 0;

/**
 * Se una bozza e' ben fatta: `null` se si', altrimenti il motivo, come
 * `validaRiga()`. La forma:
 *
 *   tipo, versione  'bozza-carteggio', 1
 *   id              l'identita' dell'attivita': diventa `sim_uid` delle righe
 *                   finali, e nella prova l'uid della riga `_t: 's'` (P-33)
 *   modo            'simulazione' | 'giro-tecniche' | 'tappeto'
 *   lista           gli id degli esercizi, congelati all'avvio
 *   variante        solo nella prova (P-32); altrimenti null
 *   inizio          l'istante dell'avvio, in millisecondi
 *   scadenza        inizio + 60 minuti nella prova; null in un allenamento
 *   posizione       l'esercizio aperto
 *   fase            'lavoro' | 'confronto' (dopo la consegna)
 *   consegna        l'istante della consegna, o null finche' si lavora
 *   testi           uno per esercizio, com'e' scritto
 *   giudizi         uno per esercizio: 1, 0 o null — rinviato. Solo al confronto
 *   revisione       quante scritture confermate: la usa sostituisciBozza()
 */
export function validaBozza(b) {
  const B = BOZZA_CARTEGGIO;
  if (!b || typeof b !== 'object' || Array.isArray(b) || b.tipo !== B.tipo) return "non e' una bozza";
  if (b.versione !== B.versione) return 'versione sconosciuta';
  if (CAMPI_RIGA.some((k) => k in b)) return 'campi di una riga';
  if (typeof b.id !== 'string' || !b.id || b.id.length > B.idMax) return 'id non valido';
  if (!B.modi.includes(b.modo)) return 'modalità sconosciuta';
  const n = Array.isArray(b.lista) ? b.lista.length : 0;
  if (!n || b.lista.some((x) => typeof x !== 'string' || !x) || new Set(b.lista).size !== n) return 'lista non valida';
  if ((b.modo === 'simulazione') !== (typeof b.variante === 'string' && !!b.variante)) return 'variante non valida';
  if (!intero(b.posizione) || b.posizione >= n) return 'posizione non valida';
  if (!istante(b.inizio)) return 'tempo non valido';
  if (b.modo === 'simulazione' ? !(istante(b.scadenza) && b.scadenza > b.inizio) : b.scadenza !== null) return 'tempo non valido';
  if (b.fase !== 'lavoro' && b.fase !== 'confronto') return 'fase non valida';
  if (b.fase === 'lavoro' ? b.consegna !== null : !(istante(b.consegna) && b.consegna >= b.inizio)) return 'consegna non valida';
  if (!Array.isArray(b.testi) || b.testi.length !== n || b.testi.some((t) => typeof t !== 'string')) return 'testi non validi';
  if (!Array.isArray(b.giudizi) || b.giudizi.length !== n || b.giudizi.some((g) => g !== null && g !== 0 && g !== 1)) return 'giudizi non validi';
  if (b.fase === 'lavoro' && b.giudizi.some((g) => g !== null)) return 'giudizi non validi';
  if (!intero(b.revisione)) return 'revisione non valida';
  return null;
}

const copiaBozza = (b) => ({ ...b, lista: [...b.lista], testi: [...b.testi], giudizi: [...b.giudizi] });
function certa(b, chi) {
  const motivo = validaBozza(b);
  if (motivo) throw new Error(`${chi}: bozza non valida (${motivo})`);
  return b;
}

/**
 * Una bozza nuova per un runner che si apre con l'account. La lista e' quella
 * preparata — si congela qui, e nessuna scrittura la cambia —; la scadenza
 * della prova viene da `PROVA_CARTEGGIO.minuti`, la sorgente unica, non dal
 * chiamante. `variante` e' quella di `provaCarteggio()`, obbligatoria nella
 * prova e assente negli allenamenti.
 */
export function nuovaBozza({ id, modo, lista, inizio, variante = null } = {}) {
  const b = {
    tipo: BOZZA_CARTEGGIO.tipo, versione: BOZZA_CARTEGGIO.versione, id, modo,
    lista: Array.isArray(lista) ? [...lista] : lista,
    variante: modo === 'simulazione' ? variante : null,
    inizio, scadenza: modo === 'simulazione' && istante(inizio) ? inizio + PROVA_CARTEGGIO.minuti * 60000 : null,
    posizione: 0, fase: 'lavoro', consegna: null,
    testi: Array.isArray(lista) ? lista.map(() => '') : [], giudizi: Array.isArray(lista) ? lista.map(() => null) : [],
    revisione: 0,
  };
  const motivo = validaBozza(b);
  if (motivo) throw new Error(`nuovaBozza: ${motivo === 'variante non valida' ? 'la prova vuole la sua variante (P-32)' : motivo}`);
  return b;
}

/**
 * Il lavoro che cambia: `posizione`, `testi`, `fase` (solo da 'lavoro' a
 * 'confronto', con `consegna`), `giudizi` (solo al confronto; `null` e' un
 * giudizio rinviato, non un no). Restituisce una bozza nuova e non modifica
 * quella che riceve. Cambiare l'identita' — lista, modalita', variante, inizio,
 * scadenza, id — o la revisione lancia: la revisione la tiene
 * `sostituisciBozza()`, e un'attivita' diversa e' un'altra bozza. Il testo
 * consegnato non si riscrive: e' quello che il confronto mette accanto alla
 * risposta ministeriale.
 */
export function modificaBozza(b, cambi = {}) {
  certa(b, 'modificaBozza');
  for (const k of Object.keys(cambi)) {
    if (IDENTITA_BOZZA.includes(k) || k === 'revisione') throw new Error(`modificaBozza: «${k}» non si cambia`);
    if (!['posizione', 'testi', 'fase', 'consegna', 'giudizi'].includes(k)) throw new Error(`modificaBozza: campo sconosciuto «${k}»`);
  }
  if (b.fase === 'confronto' && cambi.fase === 'lavoro') throw new Error('modificaBozza: il confronto non torna al lavoro');
  if (cambi.fase === 'confronto' && b.fase === 'lavoro' && cambi.consegna === undefined) throw new Error('modificaBozza: la consegna ha il suo istante');
  if (b.fase === 'confronto' && cambi.testi !== undefined && JSON.stringify(cambi.testi) !== JSON.stringify(b.testi)) {
    throw new Error('modificaBozza: dopo la consegna il testo resta quello consegnato');
  }
  const out = copiaBozza(b);
  for (const [k, v] of Object.entries(cambi)) out[k] = Array.isArray(v) ? [...v] : v;
  return certa(out, 'modificaBozza');
}

const stessaIdentita = (a, b) => IDENTITA_BOZZA.every((k) => JSON.stringify(a[k]) === JSON.stringify(b[k]));

/**
 * La regola di una scrittura, da applicare **dentro la transazione** che legge
 * la bozza presente e scrive la nuova. `presente` e' quella che c'e' nella copia
 * (o null), `proposta` quella da scrivere, `revisione` la revisione confermata
 * che chi scrive conosce (0 per una bozza mai scritta). Restituisce
 * `{ bozza, motivo }`: la bozza da scrivere, con la revisione successiva, o
 * `null` con il motivo per non scriverla:
 *
 *   - un'altra scheda ha scritto dopo: la sua versione non si sovrascrive;
 *   - la bozza non c'e' piu' ma chi scrive l'aveva gia' scritta: e' stata
 *     conclusa o scartata altrove, e **non si ricrea**;
 *   - un'attivita' diversa con lo stesso id: lista, tempo o modalita' cambiati.
 */
export function sostituisciBozza(presente, proposta, revisione) {
  const motivo = validaBozza(proposta);
  if (motivo) return { bozza: null, motivo };
  if (!intero(revisione)) return { bozza: null, motivo: 'revisione non valida' };
  if (presente == null) {
    if (revisione !== 0) return { bozza: null, motivo: "la bozza non c'è più: conclusa o scartata in un'altra scheda" };
    return { bozza: { ...copiaBozza(proposta), revisione: 1 }, motivo: null };
  }
  if (validaBozza(presente)) return { bozza: null, motivo: 'la bozza presente non si legge' };
  if (!stessaIdentita(presente, proposta)) return { bozza: null, motivo: 'attività diversa con lo stesso id' };
  if (presente.revisione !== revisione) return { bozza: null, motivo: "la bozza è cambiata in un'altra scheda" };
  return { bozza: { ...copiaBozza(proposta), revisione: revisione + 1 }, motivo: null };
}

/**
 * Riaprire una bozza dopo una ricarica, a `adesso` (millisecondi).
 * `{ bozza, scaduta, restanteMs }`. La scadenza e' **quella di prima**: mai
 * sessanta minuti nuovi. Una prova scaduta mentre la pagina era chiusa passa al
 * confronto, con i testi com'erano e la consegna all'istante della scadenza —
 * non a quello della ricarica. Un allenamento non ha limite (`restanteMs`
 * null). Non modifica quella che riceve.
 */
export function riprendiBozza(b, adesso) {
  certa(b, 'riprendiBozza');
  if (!Number.isFinite(adesso)) throw new Error("riprendiBozza: orologio non valido");
  const out = copiaBozza(b);
  if (b.scadenza == null) return { bozza: out, scaduta: false, restanteMs: null };
  const scaduta = adesso >= b.scadenza;
  if (scaduta && b.fase === 'lavoro') { out.fase = 'confronto'; out.consegna = b.scadenza; }
  return { bozza: out, scaduta, restanteMs: Math.max(0, b.scadenza - adesso) };
}

/**
 * Le righe finali di una bozza giudicata tutta: `{ righe, motivo }`. Con un
 * giudizio rinviato, fuori dal confronto o con una riga che `validaRiga()`
 * rifiuta, `righe` e' vuoto e `motivo` dice perche': la bozza resta, e niente
 * si scrive a meta'. Nessuna riga ha un `verdict` diverso da 1/0 (D-02).
 *
 * Lo schema e' quello di D-02 (P-33): una riga `_t: 'c'` per esercizio con
 * `sim_uid` = id della bozza, `proposti`, `pos`, `input_json` con il testo
 * senza gli spazi ai lati (come salvaCart()), `delta: null`, `mode`, e nella
 * prova `variante`; nella prova anche la riga `_t: 's'` con uid = id, e
 * `score`, `total`, `passed` dalla soglia di PROVA_CARTEGGIO. Il tempo e'
 * `consegna - inizio`, diviso per esercizio come faceva salvaCart().
 *
 * **Gli uid nascono dalla bozza** (`id:pos`): un ritento della stessa
 * conclusione — la transazione che scrive righe e coda e toglie la bozza non
 * e' andata — riusa gli stessi, e l'unione per uid fa il resto. `ts` e' quello
 * della conclusione, con l'offset (`isoLocale()`).
 */
export function concludiBozza(b, { ts, quesiti } = {}) {
  certa(b, 'concludiBozza');
  if (typeof ts !== 'string' || !TS_ISO.test(ts) || epoca(ts) == null) throw new Error('concludiBozza: data non valida');
  if (b.fase !== 'confronto') return { righe: [], motivo: 'si conclude dal confronto, dopo la consegna' };
  const mancano = b.giudizi.filter((g) => g === null).length;
  if (mancano) return { righe: [], motivo: `giudizi mancanti: ${mancano}` };
  const n = b.lista.length, ms = b.consegna - b.inizio, per = Math.round(ms / n);
  const prova = b.modo === 'simulazione';
  const righe = b.lista.map((item_id, pos) => ({
    _t: 'c', uid: `${b.id}:${pos}`, item_id, ts,
    input_json: JSON.stringify({ risposta: b.testi[pos].trim() }),
    verdict: b.giudizi[pos], delta: null, ms: per, mode: b.modo,
    sim_uid: b.id, proposti: n, pos, ...(prova ? { variante: b.variante } : {}),
  }));
  if (prova) {
    const presi = b.giudizi.filter((g) => g === 1).length;
    righe.push({ _t: 's', uid: b.id, kind: 'carteggio', ts, score: presi, total: n,
      passed: presi >= PROVA_CARTEGGIO.soglia ? 1 : 0, ms, variante: b.variante });
  }
  for (const r of righe) {
    const motivo = validaRiga(r, { quesiti });
    if (motivo) return { righe: [], motivo: `${motivo}: ${r.uid}` };
  }
  return { righe, motivo: null };
}

// --- la coda verso il server degli account ---------------------------------------
//
// docs/account-progetto.md §1, §2.7, §8, §16.1. Chi ha un account tiene
// l'archivio anche sul server, e le righe viaggiano in un senso e nell'altro.
// Qui c'e' la contabilita' di quel viaggio, senza `fetch`: quali righe
// inviare, che cosa togliere dopo una risposta, che cosa fare con un 409 e con
// un'epoca del database che cambia. Il trasporto e l'archivio per account
// stanno nella pagina; le regole stanno qui, dove un test le raggiunge.
//
// La coda e' un oggetto semplice, da salvare accanto all'archivio:
//   { generazione, epocaDb, cursore, daInviare: [uid], scartate: { uid: motivo } }
// `generazione` sale a ogni azzeramento (§8.4); `epocaDb` e' l'epoca del
// database del server, che un ripristino rigenera (§2.7) — l'epoca di un
// database, da non confondere con `epoca(ts)`, che e' un istante; `cursore` e'
// l'ultimo numero di riga ricevuto (§2.3).
//
// Tre regole, e ogni funzione qui sotto ne tiene ferma almeno una:
//   1. una riga esce da `daInviare` solo se il server la nomina — accolta, gia'
//      presente, o arrivata in una ricezione. Mai per deduzione (§1, regola 3:
//      la 0.4.6 buttava le risposte date durante l'invio);
//   2. il cursore lo sposta solo la ricezione. L'`ultima_seq` di un invio conta
//      anche le righe di un altro dispositivo arrivate nel frattempo, e un
//      cursore messo li' le salterebbe per sempre;
//   3. una generazione diversa da quella della coda non rimanda e non butta:
//      decide chi studia (§8.4).
//
// Nessuna funzione modifica quello che riceve: restituiscono una coda nuova, e
// la pagina decide quando salvarla.

/** I limiti di un invio, gli stessi che il server applica: li importa da qui (§7.2). */
export const INVIO_MAX_RIGHE = 2000;
export const INVIO_MAX_BYTE = 2 * 1024 * 1024;

const chiaveUid = (r) => (r && r.uid != null ? String(r.uid) : null);
const byteJson = (x) => new TextEncoder().encode(JSON.stringify(x)).length;
const troppoGrande = (r, generazione, maxByte) => byteJson({ generazione, righe: [r] }) > maxByte;

/**
 * Una coda nuova. Con `righe`, sono tutte da inviare, nell'ordine dell'archivio:
 * e' il caso di chi si registra alla fine di un'attivita' (ADR-004) — e fino
 * all'ADR-005 di chi portava l'archivio di prima degli account. `epocaDb`
 * resta `null` finche' il server non la dice.
 */
export function nuovaCoda({ generazione = 1, epocaDb = null, righe = [] } = {}) {
  const daInviare = [...new Set((righe || []).map(chiaveUid).filter((u) => u != null))];
  return { generazione, epocaDb, cursore: 0, daInviare, scartate: {} };
}

/** Una risposta nuova: il suo `uid` entra in coda, una volta sola. */
export function accoda(coda, uid) {
  const u = String(uid);
  if (coda.daInviare.includes(u)) return { ...coda };
  return { ...coda, daInviare: [...coda.daInviare, u] };
}

/**
 * Il corpo del prossimo `POST /v1/righe`, `{ generazione, righe }`, o `null` se
 * non c'e' niente da inviare. Le righe sono quelle dell'archivio che stanno in
 * coda, nel loro ordine, una volta sola, fino a `INVIO_MAX_RIGHE` e con il
 * corpo intero entro `INVIO_MAX_BYTE`: il resto parte al giro dopo.
 */
export function lottoDaInviare(righe, coda, { maxRighe = INVIO_MAX_RIGHE, maxByte = INVIO_MAX_BYTE } = {}) {
  const inCoda = new Set(coda.daInviare);
  const presi = new Set();
  const lotto = [];
  let peso = byteJson({ generazione: coda.generazione, righe: [] });
  for (const r of righe || []) {
    const u = chiaveUid(r);
    if (u == null || !inCoda.has(u) || presi.has(u) || u in coda.scartate) continue;
    // Una riga che da sola non sta in un invio non parte mai: si salta, e la
    // nomina `nonInviabili()`. Con un `break` fermava tutte quelle dietro, e
    // la coda restituiva `null` — «niente da inviare» — con righe in coda.
    if (troppoGrande(r, coda.generazione, maxByte)) continue;
    const b = byteJson(r) + (lotto.length ? 1 : 0);
    if (lotto.length >= maxRighe || peso + b > maxByte) break;
    lotto.push(r); presi.add(u); peso += b;
  }
  return lotto.length ? { generazione: coda.generazione, righe: lotto } : null;
}

function conflittoDa(coda, corpo, righe) {
  return {
    generazione: corpo.generazione,
    azzerato_il: corpo.azzerato_il ?? null,
    epocaDb: corpo.epoca ?? coda.epocaDb,
    nonSalvate: (righe || []).filter((r) => coda.daInviare.includes(chiaveUid(r))).length,
  };
}

/**
 * L'epoca del database e' cambiata: il server e' stato ripristinato da una
 * copia (§2.7). Il cursore torna a zero, e si rimanda tutto quello che c'e'
 * nell'archivio, tranne `sulServer` — le righe che questa stessa risposta dice
 * presenti nel database nuovo — e le scartate, che verrebbero scartate di nuovo.
 */
function epocaNuova(coda, epocaDb, righe, sulServer) {
  const daInviare = [...new Set((righe || []).map(chiaveUid)
    .filter((u) => u != null && !sulServer.has(u) && !(u in coda.scartate)))];
  return { ...coda, epocaDb, cursore: 0, daInviare };
}

const cambiata = (coda, corpo) => coda.epocaDb != null && typeof corpo.epoca === 'string' && corpo.epoca !== coda.epocaDb;

/**
 * Che cosa cambia dopo un invio. `risposta` e' `{ codice, corpo }`, con
 * `codice: 0` se la rete non ha risposto; `righe` e' l'archivio intero, che
 * serve solo se l'epoca e' cambiata.
 *
 * Restituisce `{ coda, salvate, scartate, conflitto, epocaCambiata }`. Con un
 * codice che non e' 200 la coda resta com'era: un errore non toglie niente. Con
 * il 409 `conflitto` dice la generazione nuova, quando e' stata azzerata, e
 * quante risposte di qui non sono sul server; la coda resta com'era finche'
 * `risolviConflitto()` non la chiude.
 */
export function dopoInvio(coda, lotto, risposta, righe) {
  const fermo = { coda: { ...coda }, salvate: [], scartate: [], conflitto: null, epocaCambiata: false };
  const { codice, corpo } = risposta || {};
  if (codice === 409 && corpo && Number.isInteger(corpo.generazione)) {
    return { ...fermo, conflitto: conflittoDa(coda, corpo, righe) };
  }
  if (codice !== 200 || !corpo || !Array.isArray(corpo.nuove) || !Array.isArray(corpo.gia)) return fermo;

  const nelLotto = new Set(((lotto && lotto.righe) || []).map(chiaveUid));
  const salvate = [...corpo.nuove, ...corpo.gia].map(String).filter((u) => nelLotto.has(u));
  const scartate = [];
  for (const s of Array.isArray(corpo.scartate) ? corpo.scartate : []) {
    // Il server scrive `uid: null` quando l'uid non e' una stringa: la riga si
    // riconosce dalla sua posizione nel lotto.
    const perIndice = Number.isInteger(s.indice) ? chiaveUid(lotto.righe[s.indice]) : null;
    const u = perIndice ?? (s.uid != null ? String(s.uid) : null);
    if (u != null && nelLotto.has(u)) scartate.push({ uid: u, motivo: String(s.motivo) });
  }
  const tolte = new Set([...salvate, ...scartate.map((s) => s.uid)]);
  const scartateMappa = { ...coda.scartate };
  for (const s of scartate) scartateMappa[s.uid] = s.motivo;
  let nuova = { ...coda, daInviare: coda.daInviare.filter((u) => !tolte.has(u)), scartate: scartateMappa };
  const epocaCambiata = cambiata(coda, corpo);
  if (epocaCambiata) nuova = epocaNuova(nuova, corpo.epoca, righe, new Set(salvate));
  else if (typeof corpo.epoca === 'string') nuova.epocaDb = corpo.epoca;
  return { coda: nuova, salvate, scartate, conflitto: null, epocaCambiata };
}

/**
 * Che cosa cambia dopo una ricezione (`GET /v1/righe?dopo=<cursore>`).
 *
 * Restituisce `{ coda, righe, continua, conflitto, epocaCambiata }`: `righe` sono
 * quelle da mettere nell'archivio, per `uid`; `continua` dice se chiedere
 * un'altra pagina. Una riga arrivata dal server e' sul server, quindi esce da
 * `daInviare`. Con una generazione diversa niente entra: prima si sceglie.
 */
export function dopoRicezione(coda, risposta, righe) {
  const fermo = { coda: { ...coda }, righe: [], continua: false, conflitto: null, epocaCambiata: false };
  const { codice, corpo } = risposta || {};
  if (codice !== 200 || !corpo || !Array.isArray(corpo.righe) || !Number.isInteger(corpo.ultima_seq)) return fermo;
  if (Number.isInteger(corpo.generazione) && corpo.generazione !== coda.generazione) {
    return { ...fermo, conflitto: conflittoDa(coda, corpo, righe) };
  }
  const arrivate = new Set(corpo.righe.map(chiaveUid).filter((u) => u != null));
  const base = { ...coda, daInviare: coda.daInviare.filter((u) => !arrivate.has(u)) };
  if (cambiata(coda, corpo)) {
    // Le righe arrivate valgono, ma il cursore con cui sono state chieste e'
    // quello del database di prima: si ricomincia da zero.
    return { coda: epocaNuova(base, corpo.epoca, righe, arrivate), righe: corpo.righe, continua: true, conflitto: null, epocaCambiata: true };
  }
  const nuova = { ...base, cursore: Math.max(coda.cursore, corpo.ultima_seq) };
  if (typeof corpo.epoca === 'string') nuova.epocaDb = corpo.epoca;
  return { coda: nuova, righe: corpo.righe, continua: corpo.altre === true, conflitto: null, epocaCambiata: false };
}

/**
 * Chi studia ha scelto — scaricare le risposte non salvate, o scartarle — e la
 * pagina svuota l'archivio locale: si riparte dalla generazione nuova,
 * dall'inizio, senza niente da inviare (§8.4).
 */
export function risolviConflitto(coda, conflitto) {
  return { generazione: conflitto.generazione, epocaDb: conflitto.epocaDb ?? coda.epocaDb, cursore: 0, daInviare: [], scartate: {} };
}

/**
 * Le righe in coda che non partiranno mai, con il motivo: `[{ uid, motivo }]`,
 * nell'ordine della coda. Due modi:
 *   - «oltre il limite di un invio»: la riga da sola supera `maxByte` (con
 *     `byte`, il peso del corpo che la porterebbe). `lottoDaInviare()` la salta;
 *   - «senza riga nell'archivio»: l'uid e' in coda e la riga non c'e' — coda e
 *     archivio salvati in due momenti. Nessun lotto la porta.
 * Le scartate non ci sono: il server le ha gia' nominate, con il loro motivo.
 *
 * E' la risposta a `lottoDaInviare() === null` con la coda non vuota
 * (docs/account-client-progetto.md §9.1): la pagina la scrive, non la calcola.
 */
export function nonInviabili(righe, coda, { maxByte = INVIO_MAX_BYTE } = {}) {
  const per = new Map();
  for (const r of righe || []) { const u = chiaveUid(r); if (u != null && !per.has(u)) per.set(u, r); }
  const fuori = [];
  for (const u of coda.daInviare) {
    if (u in coda.scartate) continue;
    const r = per.get(u);
    if (!r) { fuori.push({ uid: u, motivo: "senza riga nell'archivio" }); continue; }
    const byte = byteJson({ generazione: coda.generazione, righe: [r] });
    if (byte > maxByte) fuori.push({ uid: u, motivo: 'oltre il limite di un invio', byte });
  }
  return fuori;
}

// --- un trasferimento: portare un insieme di righe nell'account -----------------
//
// docs/account-client-progetto.md §4.3, §5.1, §7, §8 e §12. Chi si registra
// alla fine di un'attivita', chi entra e dice «si', portale», chi converte un
// file — e fino all'ADR-005 chi portava l'archivio di prima degli account —:
// un insieme di righe che deve arrivare sul server per intero, in piu' lotti,
// con scarti e ritenti. La
// pagina scrive «{N} risposte salvate» solo quando **ogni** uid e' stato
// nominato dal server — in un invio o in una ricezione.
//
// Perche' non basta la coda: «salvata» dedotta da «non e' in `daInviare`» e'
// la regola 1 della coda letta al contrario, e sbaglia in due casi misurati.
// Dopo un azzeramento scelto la coda e' vuota, e tutte le righe sembrano
// salvate mentre il server le ha tolte; e una riga mai messa in coda sembra
// salvata senza essere mai partita. Il trasferimento tiene quindi le conferme
// **per nome**, con la generazione e l'epoca del database in cui sono state
// date: un azzeramento le annulla, un ripristino le rende da ripetere.
//
// Il trasferimento e' un oggetto semplice, da salvare con la coda:
//   { generazione, epocaDb, uid: [...], confermate: [...], rifiutate: [{ riga, motivo }], conflitto }

/**
 * Comincia un trasferimento. Ogni riga passa da `validaRiga(riga, opt)` — la
 * regola di `fondiArchivio()` e del server —: le rifiutate restano in
 * `rifiutate`, con il motivo, per scaricarle; le altre vanno in coda anche se
 * c'erano gia' uscite, perche' dall'assenza dalla coda non si sa se sono sul
 * server: rimandata, una riga che c'e' torna «gia' presente», che e' una
 * conferma. Le scartate dal server non ripartono.
 *
 * Restituisce `{ trasferimento, coda }`; la pagina salva le due cose insieme.
 */
export function nuovoTrasferimento(coda, righe, opt = {}) {
  const uid = [], visti = new Set(), rifiutate = [];
  for (const r of righe || []) {
    const motivo = validaRiga(r, opt);
    if (motivo) { rifiutate.push({ riga: r, motivo }); continue; }
    const u = String(r.uid);
    if (!visti.has(u)) { visti.add(u); uid.push(u); }
  }
  let nuova = { ...coda, daInviare: [...coda.daInviare] };
  const inCoda = new Set(nuova.daInviare);
  for (const u of uid) if (!(u in coda.scartate) && !inCoda.has(u)) { nuova.daInviare.push(u); inCoda.add(u); }
  return {
    trasferimento: { generazione: coda.generazione, epocaDb: coda.epocaDb, uid, confermate: [], rifiutate, conflitto: null },
    coda: nuova,
  };
}

/**
 * Registra nel trasferimento l'esito di `dopoInvio()` o di `dopoRicezione()`:
 * gli uid che il server ha nominato — `salvate` di un invio, `righe` di una
 * ricezione — diventano confermati. Un conflitto si ricorda finche' chi studia
 * non sceglie. Se l'epoca del database e' cambiata, valgono soltanto le
 * conferme di questo esito: quelle di prima le ha date un database che non c'e'
 * piu'.
 */
export function registraEsito(trasferimento, esito) {
  const t = { ...trasferimento, confermate: [...trasferimento.confermate] };
  if (!esito) return t;
  if (esito.conflitto) return { ...t, conflitto: esito.conflitto };
  const mie = new Set(t.uid);
  const nominate = (Array.isArray(esito.salvate) ? esito.salvate : (esito.righe || []).map(chiaveUid))
    .filter((u) => u != null).map(String).filter((u) => mie.has(u));
  const epocaDb = esito.coda ? esito.coda.epocaDb : t.epocaDb;
  const altraEpoca = esito.epocaCambiata || (t.epocaDb != null && epocaDb != null && epocaDb !== t.epocaDb);
  const confermate = altraEpoca ? [] : t.confermate;
  const gia = new Set(confermate);
  for (const u of nominate) if (!gia.has(u)) { gia.add(u); confermate.push(u); }
  return { ...t, epocaDb: epocaDb ?? t.epocaDb, confermate };
}

/**
 * A che punto e' un trasferimento, letto con la coda corrente e l'archivio:
 *
 *   { stato, completo, righe, confermate, daInviare, bloccate, scartate,
 *     daVerificare, nonSalvate, motivi, conflitto }
 *
 * `stato` e' uno di:
 *   - «annullato»: la generazione della coda non e' piu' quella del
 *     trasferimento. I progressi sono stati azzerati, e con loro anche le righe
 *     confermate prima: `confermate` e' 0;
 *   - «sospeso»: un 409 aspetta la scelta di chi studia (§10 del progetto);
 *   - «in corso»: ci sono righe da ritentare (`daInviare`, un numero);
 *   - «da verificare»: niente da ritentare, ma qualche uid non e' in coda e il
 *     server non l'ha nominato (`daVerificare`); una ricezione lo conferma;
 *   - «con scarti»: tutto quello che poteva arrivare e' arrivato, e qualcosa no;
 *   - «completo»: ogni riga nominata dal server, niente scartato. Solo qui la
 *     pagina scrive «salvate».
 *
 * `nonSalvate` conta le righe che un nuovo tentativo non porta: rifiutate qui
 * (`rifiutate` del trasferimento), scartate dal server (`scartate`, dalla
 * coda), non inviabili (`bloccate`, da `nonInviabili()`); `motivi` le conta per
 * motivo. Una conferma data da un database con un'altra epoca non vale finche'
 * il server non la ripete.
 */
export function riepilogoTrasferimento(trasferimento, coda, righe, opt = {}) {
  const t = trasferimento;
  const annullato = coda.generazione !== t.generazione;
  const epocaValida = t.epocaDb == null || coda.epocaDb == null || t.epocaDb === coda.epocaDb;
  const confermateSet = new Set(annullato || !epocaValida ? [] : t.confermate);
  const inCoda = new Set(coda.daInviare);
  const bloccateMappa = new Map(nonInviabili(righe, coda, opt).map((x) => [x.uid, x.motivo]));
  const bloccate = [], scartate = [], daVerificare = [];
  let daInviare = 0, confermate = 0;
  for (const u of t.uid) {
    if (u in coda.scartate) scartate.push({ uid: u, motivo: coda.scartate[u] });
    else if (inCoda.has(u)) {
      if (bloccateMappa.has(u)) bloccate.push({ uid: u, motivo: bloccateMappa.get(u) });
      else daInviare++;
    } else if (confermateSet.has(u)) confermate++;
    else daVerificare.push(u);
  }
  const motivi = {};
  for (const m of [...t.rifiutate, ...scartate, ...bloccate].map((x) => x.motivo)) motivi[m] = (motivi[m] || 0) + 1;
  const nonSalvate = t.rifiutate.length + scartate.length + bloccate.length;
  let stato;
  if (annullato) stato = 'annullato';
  else if (t.conflitto) stato = 'sospeso';
  else if (daInviare > 0) stato = 'in corso';
  else if (daVerificare.length > 0) stato = 'da verificare';
  else if (nonSalvate > 0) stato = 'con scarti';
  else stato = 'completo';
  return {
    stato, completo: stato === 'completo', righe: t.uid.length,
    confermate: annullato ? 0 : confermate, daInviare, bloccate, scartate, daVerificare,
    nonSalvate, motivi, conflitto: t.conflitto,
  };
}

// --- il gioco dei segnali --------------------------------------------------------
//
// Fanali, segnali diurni e segnali sonori del Regolamento per prevenire gli
// abbordi in mare (COLREG '72, regole 23-37), da riconoscere a colpo d'occhio.
//
// **Materiale extra banca.** Questi non sono quesiti ministeriali: sono schede
// di allenamento scritte a mano sulle regole, con la terminologia presa dai
// quesiti COLREG della banca ("alla fonda", "che non governa", "con
// manovrabilita' limitata", "con abbrivio") e le viste ricalcate sulle figure
// del decreto (34-52): fondo nero, pallini colorati con la lettera accanto,
// vista di prua con il verde a SINISTRA dell'osservatore. Le risposte del
// gioco non entrano nello storico e non toccano il server: e' un gioco, non
// una misura.
//
// Ogni voce dice a quale modalita' appartiene (`modo`), il testo che fa da
// risposta esatta (`o`), e la sua resa: `luci` (pallini x/y 0-100, colori
// R/V/B/G, 'VR' e' il fanale combinato mezzo verde e mezzo rosso della vista
// di prua, f:1 lampeggia), `diurno` (colonne di sagome, dall'alto in basso),
// `s` (segnale sonoro: fischio con pattern L=prolungato B=breve, oppure
// campana / campana+gong / campana3).
//
// `firma` esiste per un motivo preciso: due situazioni diverse possono avere
// la STESSA resa — un solo fanale bianco e' sia "alla fonda" sia "vista di
// poppa", ed e' il COLREG a volerlo cosi'. Due voci con la stessa firma non
// compaiono mai nella stessa domanda, ne' come immagine ne' come distrattore:
// altrimenti la domanda avrebbe due risposte giuste.

export const SEGNALI = [
  // -- fanali notturni (regole 23-31) --------------------------------------
  { modo: 'notturni', id: 'n-motore-prua',
    o: "nave a motore di lunghezza inferiore a 50 metri, vista di prua",
    luci: [{ c: 'B', x: 50, y: 22 }, { c: 'VR', x: 50, y: 58 }] },
  { modo: 'notturni', id: 'n-motore-dritta',
    o: "nave a motore di lunghezza inferiore a 50 metri, che mostra la dritta",
    luci: [{ c: 'B', x: 50, y: 22 }, { c: 'V', x: 50, y: 56 }] },
  { modo: 'notturni', id: 'n-motore-sinistra',
    o: "nave a motore di lunghezza inferiore a 50 metri, che mostra la sinistra",
    luci: [{ c: 'B', x: 50, y: 22 }, { c: 'R', x: 50, y: 56 }] },
  { modo: 'notturni', id: 'n-motore-50-dritta',
    o: "nave a motore di lunghezza uguale o superiore a 50 metri, che mostra la dritta",
    nota: "Due fanali in testa d'albero: il poppiero piu' alto del prodiero.",
    luci: [{ c: 'B', x: 30, y: 30 }, { c: 'B', x: 64, y: 14 }, { c: 'V', x: 40, y: 60 }] },
  { modo: 'notturni', id: 'n-motore-poppa', firma: 'un-bianco',
    o: "unità in navigazione vista di poppa (fanale di coronamento)",
    nota: "Un fanale bianco verso la mia prora: sto raggiungendo — la precedenza e' sua.",
    luci: [{ c: 'B', x: 50, y: 44 }] },
  { modo: 'notturni', id: 'n-vela-prua-20',
    o: "unità a vela di lunghezza inferiore a 20 metri, vista di prua (fanale combinato)",
    nota: "Sotto i 20 metri i fanali laterali e di coronamento possono stare in un solo fanale in testa d'albero.",
    luci: [{ c: 'VR', x: 50, y: 20 }] },
  { modo: 'notturni', id: 'n-vela-prua',
    o: "unità a vela di lunghezza pari o superiore a 20 metri, vista di prua",
    luci: [{ c: 'V', x: 32, y: 44 }, { c: 'R', x: 68, y: 44 }] },
  { modo: 'notturni', id: 'n-vela-dritta',
    o: "nave a vela che mostra la dritta",
    nota: "Solo il fanale laterale: niente fanale in testa d'albero, quindi niente motore.",
    luci: [{ c: 'V', x: 50, y: 48 }] },
  { modo: 'notturni', id: 'n-vela-sinistra',
    o: "nave a vela che mostra la sinistra",
    luci: [{ c: 'R', x: 50, y: 48 }] },
  { modo: 'notturni', id: 'n-vela-poppa-fac',
    o: "unità a vela con fanali facoltativi (rosso su verde), vista di poppa",
    luci: [{ c: 'R', x: 50, y: 12 }, { c: 'V', x: 50, y: 28 }, { c: 'B', x: 50, y: 56 }] },
  { modo: 'notturni', id: 'n-strascico',
    o: "nave da pesca a strascico di lunghezza inferiore a 50 metri, che dirige verso l'osservatore",
    nota: "Verde su bianco = strascico. Rosso su bianco = pesca non a strascico.",
    luci: [{ c: 'V', x: 50, y: 10 }, { c: 'B', x: 50, y: 26 },
           { c: 'V', x: 26, y: 62 }, { c: 'R', x: 74, y: 62 }] },
  { modo: 'notturni', id: 'n-strascico-50',
    o: "nave da pesca a strascico di lunghezza uguale o superiore a 50 metri, che dirige verso l'osservatore",
    nota: "Dai 50 metri in su, anche il fanale in testa d'albero poppiero, piu' alto del verde su bianco.",
    luci: [{ c: 'V', x: 36, y: 16 }, { c: 'B', x: 36, y: 32 }, { c: 'B', x: 68, y: 8 },
           { c: 'V', x: 24, y: 62 }, { c: 'R', x: 76, y: 62 }] },
  { modo: 'notturni', id: 'n-pesca',
    o: "nave da pesca non a strascico, senza abbrivio",
    luci: [{ c: 'R', x: 50, y: 18 }, { c: 'B', x: 50, y: 34 }] },
  { modo: 'notturni', id: 'n-pesca-abbrivio',
    o: "nave da pesca non a strascico, con abbrivio, vista sul suo lato dritto",
    luci: [{ c: 'R', x: 64, y: 14 }, { c: 'B', x: 64, y: 30 }, { c: 'V', x: 34, y: 58 }] },
  { modo: 'notturni', id: 'n-pesca-150',
    o: "nave da pesca non a strascico con attrezzi estesi fuoribordo per più di 150 metri, con abbrivio",
    nota: "Il bianco isolato sta dalla parte degli attrezzi.",
    luci: [{ c: 'R', x: 72, y: 12 }, { c: 'B', x: 72, y: 28 }, { c: 'B', x: 20, y: 40 },
           { c: 'V', x: 46, y: 62 }] },
  { modo: 'notturni', id: 'n-non-governa',
    o: "nave che non governa, senza abbrivio",
    luci: [{ c: 'R', x: 50, y: 18 }, { c: 'R', x: 50, y: 34 }] },
  { modo: 'notturni', id: 'n-non-governa-abbrivio',
    o: "nave che non governa, con abbrivio, vista di prua",
    nota: "Con abbrivio accende anche i fanali laterali — ma mai quelli in testa d'albero.",
    luci: [{ c: 'R', x: 50, y: 12 }, { c: 'R', x: 50, y: 28 }, { c: 'VR', x: 50, y: 60 }] },
  { modo: 'notturni', id: 'n-manovrabilita',
    o: "nave con manovrabilità limitata, senza abbrivio",
    luci: [{ c: 'R', x: 50, y: 10 }, { c: 'B', x: 50, y: 26 }, { c: 'R', x: 50, y: 42 }] },
  { modo: 'notturni', id: 'n-immersione',
    o: "nave condizionata dalla propria immersione, che mostra la dritta",
    nota: "Tre rossi in colonna, in aggiunta ai fanali della nave a motore.",
    luci: [{ c: 'B', x: 26, y: 18 }, { c: 'R', x: 68, y: 10 }, { c: 'R', x: 68, y: 24 },
           { c: 'R', x: 68, y: 38 }, { c: 'V', x: 32, y: 58 }] },
  { modo: 'notturni', id: 'n-fonda', firma: 'un-bianco',
    o: "unità alla fonda di lunghezza inferiore a 50 metri",
    luci: [{ c: 'B', x: 50, y: 28 }] },
  { modo: 'notturni', id: 'n-fonda-50',
    o: "nave alla fonda di lunghezza uguale o superiore a 50 metri",
    nota: "Il fanale prodiero piu' alto del poppiero.",
    luci: [{ c: 'B', x: 30, y: 22 }, { c: 'B', x: 72, y: 42 }] },
  { modo: 'notturni', id: 'n-incagliata',
    o: "nave incagliata di lunghezza inferiore a 50 metri",
    nota: "Il fanale di fonda piu' i due rossi in colonna della nave che non governa.",
    luci: [{ c: 'B', x: 50, y: 12 }, { c: 'R', x: 50, y: 34 }, { c: 'R', x: 50, y: 50 }] },
  { modo: 'notturni', id: 'n-rimorchio',
    o: "nave che rimorchia, con rimorchio non superiore a 200 metri, vista di prua",
    luci: [{ c: 'B', x: 50, y: 8 }, { c: 'B', x: 50, y: 24 }, { c: 'VR', x: 50, y: 60 }] },
  { modo: 'notturni', id: 'n-rimorchio-200',
    o: "nave che rimorchia, con rimorchio superiore a 200 metri, vista di prua",
    luci: [{ c: 'B', x: 50, y: 6 }, { c: 'B', x: 50, y: 20 }, { c: 'B', x: 50, y: 34 },
           { c: 'VR', x: 50, y: 62 }] },
  { modo: 'notturni', id: 'n-rimorchio-poppa',
    o: "nave che rimorchia, vista di poppa (fanale di rimorchio giallo sopra il coronamento)",
    luci: [{ c: 'G', x: 50, y: 34 }, { c: 'B', x: 50, y: 50 }] },
  { modo: 'notturni', id: 'n-pilota',
    o: "nave pilota in servizio di pilotaggio",
    nota: "Bianco su rosso in testa d'albero.",
    luci: [{ c: 'B', x: 50, y: 18 }, { c: 'R', x: 50, y: 34 }] },
  { modo: 'notturni', id: 'n-cuscino',
    o: "veicolo a cuscino d'aria in modo non dislocante (fanale giallo lampeggiante), vista di prua",
    luci: [{ c: 'G', x: 50, y: 14, f: 1 }, { c: 'B', x: 50, y: 32 }, { c: 'VR', x: 50, y: 62 }] },

  // -- segnali diurni (regole 24-30) ---------------------------------------
  { modo: 'diurni', id: 'd-fonda', o: "unità alla fonda",
    diurno: [['pallone']] },
  { modo: 'diurni', id: 'd-motorsail', o: "unità a vela che naviga anche a motore",
    nota: "Cono con il vertice in basso, a prora: e' la nave della figura 34 del decreto.",
    diurno: [['cono_giu']] },
  { modo: 'diurni', id: 'd-pesca', o: "nave intenta alla pesca, a strascico o non",
    nota: "Due coni uniti per il vertice: di giorno strascico e non strascico si mostrano uguali.",
    diurno: [['bicono']] },
  { modo: 'diurni', id: 'd-pesca-150',
    o: "nave da pesca con attrezzi estesi fuoribordo per più di 150 metri",
    nota: "Il cono con il vertice in alto sta dalla parte degli attrezzi.",
    diurno: [['bicono'], ['cono_su']] },
  { modo: 'diurni', id: 'd-non-governa', o: "nave che non governa",
    diurno: [['pallone', 'pallone']] },
  { modo: 'diurni', id: 'd-manovrabilita', o: "nave con manovrabilità limitata",
    diurno: [['pallone', 'diamante', 'pallone']] },
  { modo: 'diurni', id: 'd-immersione', o: "nave condizionata dalla propria immersione",
    diurno: [['cilindro']] },
  { modo: 'diurni', id: 'd-incagliata', o: "nave incagliata",
    diurno: [['pallone', 'pallone', 'pallone']] },
  { modo: 'diurni', id: 'd-rimorchio',
    o: "rimorchio di lunghezza superiore a 200 metri (sul rimorchiatore e sull'unità rimorchiata)",
    diurno: [['diamante']] },

  // -- segnali da nebbia (regola 35) ---------------------------------------
  { modo: 'nebbia', id: 'f-motore',
    o: "nave a motore in navigazione, con abbrivio",
    s: { t: 'fischio', p: 'L', ogni: 'a intervalli non superiori a 2 minuti' } },
  { modo: 'nebbia', id: 'f-motore-fermo',
    o: "nave a motore in navigazione, ferma e senza abbrivio",
    nota: "Due prolungati separati da circa 2 secondi.",
    s: { t: 'fischio', p: 'LL', ogni: 'a intervalli non superiori a 2 minuti' } },
  { modo: 'nebbia', id: 'f-privilegiate',
    o: "nave a vela, in pesca, che non governa, con manovrabilità limitata, condizionata dall'immersione o che rimorchia",
    nota: "Tutte le navi «privilegiate» della regola 18 emettono lo stesso segnale.",
    s: { t: 'fischio', p: 'LBB', ogni: 'a intervalli non superiori a 2 minuti' } },
  { modo: 'nebbia', id: 'f-rimorchiata',
    o: "ultima unità di un convoglio rimorchiato, se ha equipaggio a bordo",
    nota: "Subito dopo il segnale del rimorchiatore, se possibile.",
    s: { t: 'fischio', p: 'LBBB', ogni: 'a intervalli non superiori a 2 minuti' } },
  { modo: 'nebbia', id: 'f-fonda',
    o: "unità alla fonda di lunghezza inferiore a 100 metri",
    s: { t: 'campana', ogni: 'rapidi suoni per 5 secondi, ogni minuto' } },
  { modo: 'nebbia', id: 'f-fonda-100',
    o: "nave alla fonda di lunghezza pari o superiore a 100 metri",
    nota: "La campana a prora e, subito dopo, il gong a poppa.",
    s: { t: 'campana+gong', ogni: 'rapidi suoni per 5 secondi, ogni minuto' } },
  { modo: 'nebbia', id: 'f-incagliata',
    o: "nave incagliata",
    s: { t: 'campana3', ogni: 'tre colpi distinti, rapidi suoni, altri tre colpi' } },
  { modo: 'nebbia', id: 'f-pilota',
    o: "nave pilota in servizio di pilotaggio (segnale d'identità facoltativo)",
    s: { t: 'fischio', p: 'BBBB' } },
  { modo: 'nebbia', id: 'f-fonda-avviso',
    o: "unità alla fonda che avverte una nave in avvicinamento (facoltativo)",
    s: { t: 'fischio', p: 'BLB' } },

  // -- segnali di manovra e di avvertimento (regola 34) --------------------
  { modo: 'manovra', id: 'm-dritta', o: "sto accostando a dritta",
    s: { t: 'fischio', p: 'B' } },
  { modo: 'manovra', id: 'm-sinistra', o: "sto accostando a sinistra",
    s: { t: 'fischio', p: 'BB' } },
  { modo: 'manovra', id: 'm-indietro', o: "sto facendo macchine indietro",
    s: { t: 'fischio', p: 'BBB' } },
  { modo: 'manovra', id: 'm-dubbio',
    o: "non capisco le tue intenzioni — dubbio, pericolo",
    nota: "Almeno cinque suoni brevi e rapidi.",
    s: { t: 'fischio', p: 'BBBBB' } },
  { modo: 'manovra', id: 'm-sorpasso-dritta', o: "intendo sorpassarti sulla tua dritta",
    s: { t: 'fischio', p: 'LLB' } },
  { modo: 'manovra', id: 'm-sorpasso-sinistra', o: "intendo sorpassarti sulla tua sinistra",
    s: { t: 'fischio', p: 'LLBB' } },
  { modo: 'manovra', id: 'm-accordo', o: "sono d'accordo al tuo sorpasso (nave raggiunta)",
    s: { t: 'fischio', p: 'LBLB' } },
  { modo: 'manovra', id: 'm-curva',
    o: "mi avvicino a una curva o a un tratto di canale coperto",
    nota: "Chi sente il segnale dall'altra parte della curva risponde con lo stesso.",
    s: { t: 'fischio', p: 'L' } },
];

export const SEGNALI_MODI = ['notturni', 'diurni', 'nebbia', 'manovra'];

export function poolSegnali(modo) {
  return SEGNALI.filter((s) => s.modo === modo);
}

/**
 * Una partita: `n` domande dal pool della modalita', ognuna con tre opzioni di
 * cui una sola esatta. Deterministica col seme — stessa partita, stesso seme —
 * come tutte le selezioni di questo motore: se non e' riproducibile non e'
 * verificabile. La pagina passa un seme dall'orologio, cosi' due partite di
 * fila sono diverse.
 *
 * I distrattori vengono dallo stesso pool, mai con la stessa `firma` del
 * segnale mostrato (due rese identiche = due risposte giuste) e mai doppi.
 */
/**
 * Quante domande ha davvero una partita di questa modalita'.
 *
 * `domandeSegnali` ne pesca `min(n, pool)` — non puo' fare altro — ma la
 * schermata scriveva 10 comunque: «In archivio **8** segnali; ogni partita ne
 * pesca **10**», e il punteggio migliore era diviso per un 10 fisso, quindi su
 * *diurni*, *nebbia* e *manovra* il 10/10 non era raggiungibile e nessuno
 * diceva perche'. I pool oggi sono 27 / 9 / 9 / 8: tre modalita' su quattro
 * promettevano una domanda in piu' di quelle che servivano.
 *
 * Sta qui e non nella pagina perche' il numero promesso e la partita che si
 * apre devono venire dalla **stessa** funzione — e' la regola di casa — e
 * perche' qui si testa.
 */
export function lunghezzaPartita(modo, n = 10) {
  return Math.min(n, poolSegnali(modo).length);
}

export function domandeSegnali(modo, n = 10, seme = 1) {
  const pool = poolSegnali(modo);
  const scelte = rimescola(pool, seme).slice(0, Math.min(n, pool.length));
  return scelte.map((e, i) => {
    const firma = e.firma || e.id;
    const altri = rimescola(pool.filter((x) => x !== e && (x.firma || x.id) !== firma),
                            seme + 31 * (i + 1)).slice(0, 2);
    const opzioni = rimescola([e, ...altri], seme + 97 * (i + 1));
    return { id: e.id, e, opzioni: opzioni.map((x) => x.o), corretta: opzioni.indexOf(e) };
  });
}
