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
          mescola = false, soloSbagliate = false, soloFigura = false } = opt;
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
    if (soloSbagliate) {
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
  sel.sort((a, b) => soloSbagliate
    ? (a.ripreso - b.ripreso) || cmp(a.t, b.t) || cmp(b.lw, a.lw)
    : (ORDINE[a.s] - ORDINE[b.s]));
  let out = sel.map((x) => x.it);
  if (mescola) out = rimescola(out);
  return n > 0 ? out.slice(0, n) : out;
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
 *   - `componiProva()` (carteggio, in palestra.html): pescata cieca, e' una
 *     simulazione d'esame anche lei;
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

/** Esito di una prova: superata o no, secondo le soglie del decreto. */
export function esito(risposte, erroriMax) {
  const errori = risposte.filter((r) => !r).length;
  return { totale: risposte.length, esatte: risposte.length - errori, errori, errori_max: erroriMax, superata: errori <= erroriMax };
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

/**
 * Le voci su cui sei piu' debole — ordinate per punti d'esame attesi in meno,
 * non per tasso d'errore nudo.
 *
 * `minVisti` esiste perche' una voce vista due volte non dice ancora niente:
 * senza soglia la classifica sarebbe dominata dal rumore dei primi minuti.
 */
export function peggiori(d, minVisti = 5, quante = 5, per = 'costo') {
  // Serve almeno un errore alla prima risposta: una voce dove le hai azzeccate
  // tutte non e' un punto debole, per quanto poco l'abbia vista.
  const chiave = per === 'errore' ? (v) => v.debolezza : (v) => v.costo ?? v.debolezza;
  return d.voci
    .filter((v) => v.visti >= minVisti && v.esatte1 < v.visti)
    .sort((a, b) => chiave(b) - chiave(a))
    .slice(0, quante);
}

/**
 * Che cosa conviene studiare adesso, in ordine, e quanto costa in minuti.
 *
 * `peggiori()` risponde a "dove sbaglio": guarda solo le voci gia' viste, e con
 * una soglia di 5 viste, perche' e' una classifica di debolezza e sotto quella
 * soglia sarebbe rumore. E' la domanda giusta a meta' preparazione, ed e' la
 * domanda **sbagliata** all'ultima settimana, quando la parte di banca che non
 * hai mai aperto e' il rischio piu' grosso che hai — e per costruzione non
 * compare in nessuna classifica di errori, perche' errori non ne ha.
 *
 * Qui le due cose stanno nella stessa unita' di misura, domande d'esame attese
 * in meno, e si sommano:
 *
 *   peso     = domande d'esame del tema x quota della voce dentro il tema
 *   recupero = peso x (quota gia' vista)  x debolezza misurata della voce
 *   rischio  = peso x (quota mai vista)   x debolezza del tema (o globale)
 *
 * `rischio` e' una stima e lo dichiara: sulla parte mai vista la debolezza non
 * si puo' misurare, quindi si presta quella del tema — e se il tema non ha
 * ancora dati, quella di tutta la banca. E' grossolano di proposito: serve a
 * mettere in fila delle voci, non a predire un voto.
 *
 * Non compare una voce che non ha niente da fare: sarebbe un consiglio che non
 * si puo' seguire. «Niente da fare» vuol dire niente mai visti e **nessun
 * errore ancora aperto** — dalla 0.16.0 si contano gli `aperti` e non i
 * `sbagliati`, che non calano mai. Contando quelli, una voce interamente
 * ripassata restava in elenco e i minuti dichiarati comprendevano lavoro gia'
 * fatto: sull'archivio del 2 settembre 175 quesiti invece dei 76 veri.
 */
/** Sotto questa soglia una percentuale di esatte non e' un dato: e' la stessa
 *  di `peggiori()`, e la schermata la usa per non scrivere «100% su 1 vista». */
export const CONSIGLIO_MIN_VISTI = 5;

export function consigli(d, opt = {}) {
  const pesi = opt.pesi || {};
  const msMedio = opt.msMedio || RIPIEGO_MS;
  const quante = opt.quante ?? 6;

  const dimTema = Object.fromEntries(d.temi.map((t) => [t.nome, t.n]));
  const debTema = Object.fromEntries(d.temi.map((t) => [t.nome, t.visti ? t.debolezza : null]));
  let visti = 0, esatte1 = 0;
  for (const t of d.temi) { visti += t.visti; esatte1 += t.esatte1; }
  const debGlobale = (visti - esatte1 + 1) / (visti + 3);

  const righe = [];
  for (const v of d.voci) {
    const daFare = v.nuovi + v.aperti;
    if (!daFare || !v.n) continue;
    const quotaTema = dimTema[v.tema] ? v.n / dimTema[v.tema] : 0;
    const peso = (pesi[v.tema] || 0) * quotaTema;
    const stimata = debTema[v.tema] ?? debGlobale;
    const recupero = peso * (v.visti / v.n) * v.debolezza;
    const rischio = peso * (v.nuovi / v.n) * stimata;
    righe.push({
      nome: v.nome, tema: v.tema, n: v.n, visti: v.visti, nuovi: v.nuovi,
      sbagliati: v.sbagliati, aperti: v.aperti, acc1: v.acc1, debolezza: v.debolezza,
      peso, recupero, rischio, priorita: recupero + rischio,
      daFare, minuti: Math.max(1, Math.round(daFare * msMedio / 60000)),
      // Perche' e' li'. Stessa regola della Mirata: un selettore che non si
      // spiega e' indistinguibile da uno rotto.
      motivo: v.visti === 0 ? 'mai aperta'
            : recupero >= rischio ? 'ci sbagli'
            : 'quasi tutta da vedere',
    });
  }
  righe.sort((a, b) => b.priorita - a.priorita || b.daFare - a.daFare);
  const scelte = righe.slice(0, quante);
  return {
    voci: scelte,
    minuti: scelte.reduce((s, r) => s + r.minuti, 0),
    daFare: scelte.reduce((s, r) => s + r.daFare, 0),
    // Quanti punti d'esame stanno in ballo nelle voci proposte: e' il numero
    // che dice se vale la pena, non solo in che ordine.
    punti: scelte.reduce((s, r) => s + r.priorita, 0),
    restanti: Math.max(0, righe.length - scelte.length),
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

export function stimaImpegno(progress, rimanenti, giorni) {
  let somma = 0, misurate = 0;
  for (const p of Object.values(progress || {})) {
    if (p && p.avg && p.n) { somma += p.avg * p.n; misurate += p.n; }
  }
  const affidabile = misurate >= MIN_MISURATE;
  const mediaMs = affidabile ? Math.round(somma / misurate) : RIPIEGO_MS;
  const minutiTotali = Math.round(rimanenti * mediaMs / 60000);
  return {
    rimanenti, mediaMs, misurate, affidabile, minutiTotali,
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
 */
export function sessioni(righe, opt = {}) {
  const { limite = Infinity } = opt;
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
  const out = gruppi.map(({ _visti, _ultimo, ...s }) => {
    const a = epoca(s.inizio), b = epoca(s.fine);
    s.durata = a != null && b != null && b >= a ? b - a : s.ms;
    s.prova = prove.get(String(s.sim_uid || '')) || null;
    return s;
  });
  out.sort((x, y) => ((epoca(y.fine) ?? 0) - (epoca(x.fine) ?? 0))
                  || ((epoca(y.inizio) ?? 0) - (epoca(x.inizio) ?? 0)));
  return Number.isFinite(limite) ? out.slice(0, limite) : out;
}

/**
 * Fonde un archivio importato con quello presente, per `uid`: una riga gia'
 * presente non si duplica, una nuova entra. Restituisce le righe fuse e i
 * conteggi, perche' «ricaricati» deve dire quante ne ha prese e quante aveva
 * gia' — un pulsante che risponde «fatto» per righe che ha scartato e' un
 * difetto, non una scortesia.
 */
export function fondiArchivio(presenti, importate) {
  const per = new Map();
  for (const r of presenti || []) if (r && r.uid != null) per.set(String(r.uid), r);
  let nuove = 0, gia = 0, scartate = 0;
  for (const r of importate || []) {
    if (!r || r.uid == null || !r._t || !r.ts) { scartate++; continue; }
    if (per.has(String(r.uid))) { gia++; continue; }
    per.set(String(r.uid), r); nuove++;
  }
  return { righe: [...per.values()], nuove, gia, scartate };
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
