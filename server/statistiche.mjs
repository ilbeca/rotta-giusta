// Le statistiche: il posto solo da cui passa ogni conteggio.
//
// docs/account-progetto.md §15.2. L'informativa dice che le statistiche sono
// conteggi aggregati, senza email e senza identificativi, e che chi si oppone
// (art. 21 del GDPR) resta con le sue risposte nel suo account ed esce dai
// conteggi. Perche' sia vero non basta una regola che ogni query deve
// ricordare — «aggiungi WHERE fuori_statistiche_dal IS NULL» —: la prima query
// scritta di fretta la dimentica, e niente lo dice.
//
// Qui una statistica non vede le tabelle: vede quattro **fonti**, gia' filtrate.
//
//   iscritti   gli account che non si sono opposti
//   risposte   le loro righe
//   punteggi   i loro punteggi dei Segnali
//   esiti      l'esito del loro esame, detto da loro (P-73)
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

/** Le fonti e le loro colonne. E' tutto quello che una statistica puo' leggere. */
export const FONTI = Object.freeze({
  iscritti: Object.freeze(['chi', 'creato_il', 'ultimo_accesso_il', 'confermato', 'data_esame']),
  risposte: Object.freeze(['chi', 'tipo', 'item_id', 'ts', 'ricevuta_il', 'dati']),
  punteggi: Object.freeze(['chi', 'modo', 'migliore', 'giocate']),
  // `risultato` e non `esito`: la parola `esito` e' il nome della tabella vera,
  // e una statistica che la nomina e' rifiutata.
  esiti: Object.freeze(['chi', 'giorno', 'prova', 'risultato', 'errori', 'detto_il']),
});

// L'unico punto in cui il segno si legge. Le righe, i punteggi e gli esiti
// passano dagli iscritti, cosi' il filtro e' uno e non quattro.
const DEFINIZIONE = `
  WITH iscritti AS (
    SELECT id AS chi, creato_il, ultimo_accesso_il, email_verificata_il IS NOT NULL AS confermato, data_esame
    FROM account WHERE fuori_statistiche_dal IS NULL
  ), risposte AS (
    SELECT r.account_id AS chi, r.tipo, r.item_id, r.ts, r.ricevuta_il, r.dati
    FROM riga r JOIN iscritti i ON i.chi = r.account_id
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
