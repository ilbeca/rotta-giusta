// Le statistiche: il posto solo da cui passa ogni conteggio.
//
// docs/account-progetto.md §15.2. L'informativa dice che le statistiche sono
// conteggi aggregati, senza email e senza identificativi, e che chi si oppone
// (art. 21 del GDPR) resta con le sue risposte nel suo account ed esce dai
// conteggi. Perche' sia vero non basta una regola che ogni query deve
// ricordare — «aggiungi WHERE fuori_statistiche_dal IS NULL» —: la prima query
// scritta di fretta la dimentica, e niente lo dice.
//
// Qui una statistica non vede le tabelle: vede cinque **fonti**, gia' filtrate.
//
//   iscritti   gli account che non si sono opposti
//   risposte   le loro risposte: le righe per cui `rigaDiRisposta()` del
//              motore dice vero — quiz, carta, tecniche, prove sostenute (P-78)
//   righe      tutte le loro righe, con il loro `tipo`: anche i tag, le righe
//              d'avvio delle prove (P-72) e i segnalibri (P-71)
//   punteggi   i loro punteggi dei Segnali
//   esiti      l'esito del loro esame, detto da loro (P-73)
//
// **Perche' due fonti di righe e non una con il tipo.** Il server accoglie
// ogni tipo che `validaRiga()` accetta, e fino a P-78 la fonte `risposte` li
// comprendeva tutti: «quante risposte» contava anche l'avvio di una prova e un
// segnalibro, se chi scriveva la statistica non si ricordava di filtrare. E'
// la regola da ricordare che questo file esiste per togliere. Che cosa sia una
// risposta lo dice il motore, la stessa funzione con cui la pagina conta: il
// filtro si costruisce da `TIPI_RIGA` e `rigaDiRisposta()`, non da un elenco
// scritto qui.
//
// L'email, la password e la chiave dell'account non sono in nessuna fonte,
// quindi non possono uscire nemmeno per sbaglio. `chi` e' il numero interno
// dell'account: serve a contare le persone distinte, e non esce — come non
// escono le righe intere, `dati`.
//
// Il segno lo mette e lo toglie il titolare (server/opposizione.mjs,
// `opponi()` in server/db.mjs). Un controllo in tests/test_server.mjs e' rosso
// se una query aggregata, o su tutte le righe, nasce in `server/` fuori da
// questo file: una statistica nuova si scrive qui, o passa da `statistica()`.
//
// Niente HTTP: nessuna rotta espone una statistica (§15.1, §15.2). La lancia
// il titolare dalla macchina, con server/statistica.mjs.

import { versioneSchema } from './db.mjs';
import { TIPI_RIGA, rigaDiRisposta } from '../site/engine.js';

/** Lo schema che porta il segno: sotto, una statistica non parte. */
const SCHEMA_DEL_SEGNO = 4;
/** Lo schema che porta la tabella degli esiti (P-73). */
const SCHEMA_DEGLI_ESITI = 5;

/**
 * Sotto quante persone in un gruppo un conteggio sugli esiti non esce dalla
 * macchina: deciso dall'autore il 4 ottobre 2026 (docs/esito-esame-progetto.md
 * §3.6 e §11, punto 11). Con tre persone che hanno detto «non superata», un
 * aggregato dice qualcosa di loro. E' una regola per chi copia un numero fuori
 * dal terminale, quindi nessun controllo la puo' eseguire: server/statistica.mjs
 * la ricorda a ogni statistica sugli esiti, con quante persone ci sono.
 */
export const SOGLIA_PERSONE = 20;

/** I tipi di riga che sono risposte, dal motore: oggi q, c, t, s. */
const DI_RISPOSTA = Object.freeze(TIPI_RIGA.filter((tipo) => rigaDiRisposta({ _t: tipo })));

/** Le fonti e le loro colonne. E' tutto quello che una statistica puo' leggere. */
const COLONNE_DELLE_RIGHE = Object.freeze(['chi', 'tipo', 'item_id', 'ts', 'ricevuta_il', 'dati']);
export const FONTI = Object.freeze({
  iscritti: Object.freeze(['chi', 'creato_il', 'ultimo_accesso_il', 'confermato', 'data_esame']),
  risposte: COLONNE_DELLE_RIGHE,
  righe: COLONNE_DELLE_RIGHE,
  punteggi: Object.freeze(['chi', 'modo', 'migliore', 'giocate']),
  // `risultato` e non `esito`: la parola `esito` e' il nome della tabella vera,
  // e una statistica che la nomina e' rifiutata.
  esiti: Object.freeze(['chi', 'giorno', 'prova', 'risultato', 'errori', 'detto_il']),
});

// L'unico punto in cui il segno si legge. Le righe, i punteggi e gli esiti
// passano dagli iscritti, cosi' il filtro e' uno e non quattro. Le risposte
// passano dalle righe: la colonna `tipo` e' il `_t` della riga, scritto da
// `aggiungiRighe()`, e i tipi sono lettere di `TIPI_RIGA`, non testo di chi
// lancia la statistica.
const DEFINIZIONE = `
  WITH iscritti AS (
    SELECT id AS chi, creato_il, ultimo_accesso_il, email_verificata_il IS NOT NULL AS confermato, data_esame
    FROM account WHERE fuori_statistiche_dal IS NULL
  ), righe AS (
    SELECT r.account_id AS chi, r.tipo, r.item_id, r.ts, r.ricevuta_il, r.dati
    FROM riga r JOIN iscritti i ON i.chi = r.account_id
  ), risposte AS (
    SELECT * FROM righe WHERE tipo IN (${DI_RISPOSTA.map((tipo) => `'${tipo}'`).join(', ')})
  ), punteggi AS (
    SELECT s.account_id AS chi, s.modo, s.migliore, s.giocate
    FROM segnali s JOIN iscritti i ON i.chi = s.account_id
  )
`;
const ESITI = `
  , esiti AS (
    SELECT e.account_id AS chi, e.giorno, e.prova, e.esito AS risultato, e.errori, e.detto_il
    FROM esito e JOIN iscritti i ON i.chi = e.account_id
  )
`;

// Le tabelle vere, che una statistica non nomina: le legge dalle fonti.
const TABELLE = /\b(account|riga|segnali|esito|sessione|gettone|registro|impianto|sqlite_\w+)\b/i;
// Quello che non esce: chi ha risposto, e le righe intere.
const NON_ESCE = new Set(['chi', 'dati']);

// I tipi che una query cerca con `tipo = '…'` o `tipo IN ('…', …)`: sul testo,
// come il controllo dei nomi. Un parametro (`tipo = ?`) non si vede.
function tipiCercati(testo) {
  const tipi = [];
  for (const m of testo.matchAll(/\btipo\s*(?:=|\bin\s*\()\s*((?:'[^']*'\s*,?\s*)+)/gi)) {
    for (const l of m[1].matchAll(/'([^']*)'/g)) tipi.push(l[1]);
  }
  return tipi;
}

function conIlSegno(db) {
  const v = versioneSchema(db);
  if (v < SCHEMA_DEL_SEGNO) {
    throw new Error(`schema ${v}: questo database non ha ancora il segno di chi si oppone alle statistiche. `
      + 'Niente conteggi finche\' il server del rilascio nuovo non lo ha aperto.');
  }
}

/**
 * Esegue una statistica: una `SELECT` sulle fonti, con i suoi parametri, e
 * restituisce le righe del risultato. Lancia, senza eseguire niente, se la
 * query non e' una `SELECT` sola o se nomina una tabella vera; lancia se il
 * risultato porta fuori `chi` o `dati`.
 *
 * Il controllo sui nomi e' fatto sul testo: prende lo sbaglio, non chi vuole
 * aggirarlo con un alias. Chi lancia una statistica e' il titolare, sulla sua
 * macchina; il controllo esiste perche' una query scritta di fretta non conti
 * chi ha chiesto di non essere contato.
 */
export function statistica(db, sql, parametri = []) {
  const testo = typeof sql === 'string' ? sql.trim() : '';
  if (!/^select\b/i.test(testo)) {
    throw new Error(`una statistica e' una SELECT sulle fonti ${Object.keys(FONTI).join(', ')}`);
  }
  if (testo.includes(';')) throw new Error("una sola SELECT per volta, senza punto e virgola");
  const tabella = testo.match(TABELLE)?.[1];
  if (tabella) {
    throw new Error(`una statistica non legge la tabella «${tabella.toLowerCase()}»: legge le fonti ${Object.keys(FONTI).join(', ')}, `
      + 'che escludono chi si e\' opposto (server/statistiche.mjs)');
  }
  // Una query che legge le risposte e cerca un tipo che le risposte non hanno
  // conterebbe zero, in silenzio: e' la statistica scritta prima di P-78, quando
  // le righe d'avvio stavano fra le risposte. Si ferma, e dice dove stanno.
  if (!/\b(from|join)\s+righe\b/i.test(testo)) {
    const fuori = tipiCercati(testo).filter((tipo) => !DI_RISPOSTA.includes(tipo));
    if (fuori.length) {
      throw new Error(`la fonte «risposte» ha solo le righe di tipo ${DI_RISPOSTA.join(', ')} (rigaDiRisposta() del motore): `
        + `le righe di tipo ${fuori.map((x) => `'${x}'`).join(', ')} si leggono dalla fonte «righe»`);
    }
  }
  conIlSegno(db);
  // Su un database di prima della tabella degli esiti la fonte non c'e': una
  // statistica che la usa si ferma, invece di contare zero esiti che non e' vero.
  const conEsiti = versioneSchema(db) >= SCHEMA_DEGLI_ESITI;
  if (!conEsiti && /\besiti\b/i.test(testo)) {
    throw new Error(`schema ${versioneSchema(db)}: questo database non ha ancora gli esiti dell'esame. `
      + "Niente conteggi sugli esiti finche' il server del rilascio nuovo non lo ha aperto.");
  }
  const righe = db.prepare(DEFINIZIONE + (conEsiti ? ESITI : '') + testo).all(...parametri).map((r) => ({ ...r }));
  for (const colonna of Object.keys(righe[0] ?? {})) {
    if (NON_ESCE.has(colonna.toLowerCase())) {
      throw new Error(`«${colonna}» non esce da una statistica: e' ${colonna.toLowerCase() === 'chi' ? "il numero dell'account" : 'la riga intera'}. `
        + 'Si contano, non si elencano.');
    }
  }
  return righe;
}

/**
 * Quanti account sono fuori dai conteggi perche' si sono opposti. Non dice
 * chi: serve a chi legge una statistica per sapere che l'esclusione c'e', e
 * quanto pesa.
 */
export function esclusi(db) {
  conIlSegno(db);
  return db.prepare('SELECT count(*) n FROM account WHERE fuori_statistiche_dal IS NOT NULL').get().n;
}


/**
 * Quante persone, fra chi non si e' opposto, hanno detto almeno un esito. E' il
 * numero da guardare prima di leggere una statistica sugli esiti: sotto
 * `SOGLIA_PERSONE` in un gruppo, il conteggio resta sulla macchina. Il tasso di
 * risposta si scrive accanto a ogni risultato (§3.7 del progetto, punto 1).
 */
export function personeConEsito(db) {
  return statistica(db, 'SELECT count(DISTINCT chi) n FROM esiti')[0].n;
}
