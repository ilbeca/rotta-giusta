// Il database degli account: un file SQLite, un solo scrittore.
//
// docs/account-progetto.md §2.2, §2.3, §2.7, §3. Qui c'e' quello che serve
// perche' il database nasca giusto e perche' la copia di sicurezza si possa
// ripristinare davvero: lo schema con il suo numero, l'epoca, le righe con il
// loro cursore, e le due operazioni che tolgono — cancellare un account e
// azzerarne i progressi —, scritte anche nel file delle cancellazioni.
//
// Niente HTTP qui dentro: copia e ripristino sono strumenti della macchina e
// girano a servizio fermo (server/copie.mjs).

import { DatabaseSync } from 'node:sqlite';
import { randomBytes } from 'node:crypto';
import { openSync, writeSync, fsyncSync, closeSync, readFileSync, existsSync } from 'node:fs';
import { validaRiga } from '../site/engine.js';

/**
 * Il numero dello schema, in `PRAGMA user_version`. Sale di uno a ogni
 * migrazione, e le migrazioni sono **solo additive** (§2.7, regola 3): colonne
 * e tabelle nuove, mai tolte ne' rinominate, cosi' il rilascio precedente gira
 * sul database di quello nuovo e tornare indietro resta di un secondo.
 */
export const SCHEMA = 3;

// Lo schema del §3, un pezzo per volta. Le tabelle arrivano con i pezzi che le
// usano, e ognuno e' una migrazione additiva: la 1 e' di P-03 (le righe e la
// copia), la 2 di P-09 (l'account), la 3 di P-11 (i punteggi dei Segnali).
const SCHEMA_1 = `
  CREATE TABLE impianto (
    id            INTEGER PRIMARY KEY CHECK (id = 1),
    epoca         TEXT NOT NULL,     -- casuale; rigenerata da ogni ripristino (§2.7)
    epoca_dal     TEXT NOT NULL,
    nato_il       TEXT NOT NULL,
    ultima_seq    INTEGER NOT NULL   -- il cursore: sale sempre, non si riusa
  );
  CREATE TABLE account (
    id                     INTEGER PRIMARY KEY,
    email                  TEXT NOT NULL UNIQUE,
    email_verificata_il    TEXT,
    password               TEXT NOT NULL,
    creato_il              TEXT NOT NULL,
    ultimo_accesso_il      TEXT NOT NULL,
    avviso_inattivita_il   TEXT,
    generazione            INTEGER NOT NULL DEFAULT 1,
    azzerato_il            TEXT,
    data_esame             TEXT,
    chiave_locale          TEXT NOT NULL UNIQUE
  );
  CREATE TABLE riga (
    account_id   INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    uid          TEXT NOT NULL,
    seq          INTEGER NOT NULL UNIQUE,
    tipo         TEXT NOT NULL,
    item_id      TEXT,
    ts           TEXT,
    ricevuta_il  TEXT NOT NULL,
    dati         TEXT NOT NULL,
    PRIMARY KEY (account_id, uid)
  ) WITHOUT ROWID;
  CREATE INDEX riga_cursore ON riga (account_id, seq);
`;

// L'account (§5, §6, §9, §15.3). Le due colonne nuove servono al limite dei
// tentativi (§6.5): il conto dei fallimenti di fila sta nel database e non in
// memoria, perche' e' lui a disattivare la password al centesimo, e un
// riavvio non deve regalare altri cento tentativi.
const SCHEMA_2 = `
  ALTER TABLE account ADD COLUMN accessi_falliti INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE account ADD COLUMN password_disattivata_il TEXT;
  CREATE TABLE sessione (
    id_hash       BLOB PRIMARY KEY,   -- SHA-256 del token; il token non si conserva
    account_id    INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    creata_il     TEXT NOT NULL,
    scade_il      TEXT NOT NULL       -- creata_il + 30 giorni, e non si sposta (§6.2)
  );
  CREATE INDEX sessione_account ON sessione (account_id);
  CREATE TABLE gettone (
    id_hash       BLOB PRIMARY KEY,   -- SHA-256; il gettone non si conserva
    account_id    INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    scopo         TEXT NOT NULL,      -- 'verifica' | 'password' | 'email'
    nuova_email   TEXT,
    creato_il     TEXT NOT NULL,
    scade_il      TEXT NOT NULL,
    usato_il      TEXT
  );
  CREATE INDEX gettone_account ON gettone (account_id, scopo);
  CREATE TABLE registro (
    id            INTEGER PRIMARY KEY,
    quando        TEXT NOT NULL,
    evento        TEXT NOT NULL,
    account_id    INTEGER,            -- senza vincolo: sopravvive alla cancellazione
    ip            TEXT,               -- tolto dopo 6 mesi; la riga dopo un anno (§15.3)
    dettaglio     TEXT
  );
  CREATE INDEX registro_quando ON registro (quando);
`;

// I punteggi del gioco dei Segnali (§13.2), fuori dall'archivio delle risposte
// come nella pagina (§4.5 della specifica): per modo, il migliore e le partite,
// fusi con il massimo.
const SCHEMA_3 = `
  CREATE TABLE segnali (
    account_id    INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    modo          TEXT NOT NULL,
    migliore      INTEGER NOT NULL,
    giocate       INTEGER NOT NULL,
    PRIMARY KEY (account_id, modo)
  ) WITHOUT ROWID;
`;

/**
 * Le migrazioni, in ordine: la n-esima porta il database da n-1 a n. Un
 * database nuovo le esegue tutte, cosi' nuovo e migrato sono lo stesso schema
 * e c'e' una strada sola da provare.
 */
export const MIGRAZIONI = [SCHEMA_1, SCHEMA_2, SCHEMA_3];

const adesso = () => new Date().toISOString();
const nuovaEpoca = () => randomBytes(16).toString('hex');

/** Le impostazioni di ogni connessione: non stanno nel file, si ripetono. */
function imposta(db) {
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  // §14.4: SQLite sovrascrive con zeri quello che si cancella, invece di
  // lasciarlo nelle pagine libere del file.
  db.exec('PRAGMA secure_delete = ON');
  db.exec('PRAGMA busy_timeout = 5000');
}

export function versioneSchema(db) {
  return db.prepare('PRAGMA user_version').get().user_version;
}

/**
 * Apre il database, e se e' nuovo lo crea: schema, numero dello schema, epoca.
 *
 * Uno schema **piu' alto** di quello del codice non ferma niente: vuol dire che
 * si e' tornati a un rilascio precedente, e le migrazioni additive lo
 * permettono. Si scrive con `log`, e la salute lo dice.
 */
export function apri(percorso, { log = (m) => console.error(m) } = {}) {
  const db = new DatabaseSync(percorso);
  imposta(db);
  const v = versioneSchema(db);
  if (v === 0) {
    const tabelle = db.prepare("SELECT count(*) n FROM sqlite_schema WHERE type = 'table'").get().n;
    if (tabelle > 0) {
      db.close();
      throw new Error(`${percorso}: ha delle tabelle ma nessun numero di schema — non e' un database di questo server`);
    }
    transazione(db, () => {
      for (const m of MIGRAZIONI) db.exec(m);
      const ora = adesso();
      db.prepare('INSERT INTO impianto (id, epoca, epoca_dal, nato_il, ultima_seq) VALUES (1, ?, ?, ?, 0)')
        .run(nuovaEpoca(), ora, ora);
      db.exec(`PRAGMA user_version = ${SCHEMA}`);
    });
  } else if (v > SCHEMA) {
    log(`schema del database ${v}, del codice ${SCHEMA}: si e' tornati a un rilascio precedente; parto, le migrazioni sono additive`);
  } else if (v < SCHEMA) {
    // Una transazione sola: o tutte le migrazioni che mancano, o nessuna.
    transazione(db, () => {
      for (const m of MIGRAZIONI.slice(v)) db.exec(m);
      db.exec(`PRAGMA user_version = ${SCHEMA}`);
    });
    log(`schema del database portato da ${v} a ${SCHEMA}`);
  }
  return db;
}

/** Esegue `fn` in una transazione che scrive; la annulla se `fn` lancia. */
export function transazione(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const r = fn();
    db.exec('COMMIT');
    return r;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

export function leggiEpoca(db) {
  return db.prepare('SELECT epoca FROM impianto WHERE id = 1').get().epoca;
}

/** Nuova epoca: la chiama il ripristino, e nessun altro. */
export function rigeneraEpoca(db) {
  const e = nuovaEpoca();
  db.prepare('UPDATE impianto SET epoca = ?, epoca_dal = ? WHERE id = 1').run(e, adesso());
  return e;
}

/**
 * Crea un account. La password arriva gia' come stringa PHC: l'hash lo fa chi
 * registra (§5), non il database. Restituisce l'`id` interno.
 */
export function creaAccount(db, { email, password, ora = adesso() }) {
  const r = db.prepare(`
    INSERT INTO account (email, password, creato_il, ultimo_accesso_il, chiave_locale)
    VALUES (?, ?, ?, ?, ?)`).run(String(email).trim().toLowerCase(), password, ora, ora.slice(0, 10),
    randomBytes(16).toString('hex'));
  return Number(r.lastInsertRowid);
}

/**
 * Aggiunge righe a un account, per `uid`: una riga gia' presente non si
 * duplica, una rotta si rifiuta con il motivo di `validaRiga()` — la stessa
 * funzione del browser, importata dal motore e non riscritta (§4.1).
 *
 * Restituisce gli `uid`, non i conteggi soli: il client toglie dalla coda solo
 * quelli che il server nomina (§1, regola 3). Una scartata porta anche
 * `indice`, la sua posizione nell'invio: con un `uid` che non e' una stringa,
 * e' l'unico modo che il client ha di riconoscerla.
 *
 * Con `generazione`, un invio della generazione sbagliata non scrive niente e
 * restituisce `{ conflitto: { generazione, azzerato_il } }` (§8.4). Il
 * confronto sta dentro la transazione che scrive: fra la lettura della
 * sessione e l'invio un azzeramento puo' essere arrivato da un'altra scheda.
 */
export function aggiungiRighe(db, accountId, righe, { quesiti, generazione } = {}) {
  const nuove = [], gia = [], scartate = [];
  const esiste = db.prepare('SELECT 1 FROM riga WHERE account_id = ? AND uid = ?');
  const inserisci = db.prepare(`
    INSERT INTO riga (account_id, uid, seq, tipo, item_id, ts, ricevuta_il, dati)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  let conflitto = null;
  transazione(db, () => {
    if (generazione !== undefined) {
      const a = db.prepare('SELECT generazione, azzerato_il FROM account WHERE id = ?').get(accountId);
      if (a.generazione !== generazione) {
        conflitto = { generazione: a.generazione, azzerato_il: a.azzerato_il };
        return;
      }
    }
    let seq = db.prepare('SELECT ultima_seq FROM impianto WHERE id = 1').get().ultima_seq;
    const ora = adesso();
    righe.forEach((r, indice) => {
      const motivo = validaRiga(r, { quesiti });
      if (motivo) { scartate.push({ uid: typeof r?.uid === 'string' ? r.uid : null, motivo, indice }); return; }
      if (esiste.get(accountId, r.uid)) { gia.push(r.uid); return; }
      // Il cursore viene da un contatore che sale sempre, non da MAX(seq):
      // cancellare l'account con le righe piu' recenti farebbe scendere il
      // massimo, e un numero gia' dato tornerebbe in circolo.
      seq += 1;
      inserisci.run(accountId, r.uid, seq, r._t, r.item_id ?? null, r.ts ?? null, ora, JSON.stringify(r));
      nuove.push(r.uid);
    });
    db.prepare('UPDATE impianto SET ultima_seq = ? WHERE id = 1').run(seq);
  });
  if (conflitto) return { conflitto };
  return { nuove, gia, scartate, ultima_seq: ultimaSeq(db, accountId) };
}

export function ultimaSeq(db, accountId) {
  return db.prepare('SELECT COALESCE(MAX(seq), 0) s FROM riga WHERE account_id = ?').get(accountId).s;
}

/**
 * Le righe di un account arrivate dopo il cursore, come sono arrivate, al piu'
 * `quante` (§7.2). Con `altre`, `ultima_seq` e' il numero dell'ultima riga
 * restituita, da cui si chiede la pagina dopo; senza, e' l'ultima dell'account.
 */
export function righeDopo(db, accountId, dopo = 0, { quante = Infinity } = {}) {
  const limite = Number.isFinite(quante) ? quante + 1 : -1;
  const trovate = db.prepare('SELECT seq, dati FROM riga WHERE account_id = ? AND seq > ? ORDER BY seq LIMIT ?')
    .all(accountId, dopo, limite);
  const altre = Number.isFinite(quante) && trovate.length > quante;
  const pagina = altre ? trovate.slice(0, quante) : trovate;
  const righe = pagina.map((r) => JSON.parse(r.dati));
  const ultima_seq = altre ? pagina.at(-1).seq : Math.max(Number(dopo) || 0, ultimaSeq(db, accountId));
  return { righe, ultima_seq, altre };
}

// --- il file delle cancellazioni -------------------------------------------------
//
// §2.7: il registro sta dentro il database, quindi dopo un ripristino e' quello
// della copia e non sa delle cancellazioni successive. Cancellazioni e
// azzeramenti si scrivono **anche** qui, una riga JSON ciascuno, e il
// ripristino li rilegge prima di riaprire il servizio.
//
// Nessuna email: l'`id` interno, la chiave casuale dell'account, la data e, per
// un azzeramento, la generazione nuova. La chiave c'e' perche' un `id` si puo'
// riusare: dopo un ripristino il database riparte dal massimo della copia, e
// un account nuovo puo' prendere l'`id` di uno cancellato dopo la copia.
// Rileggendo il solo `id`, il ripristino successivo cancellerebbe lui.
//
// Il file si scrive **prima** del database, e con `fsync`. Se il processo cade
// fra i due, il file dice «cancellato» e il database no: il ripristino
// successivo cancella un account che l'aveva chiesto. Nell'ordine opposto un
// account cancellato potrebbe tornare in vita da una copia, ed e' il guasto
// che il file esiste per impedire.

function annota(percorso, voce) {
  if (!percorso) throw new Error('manca il percorso del file delle cancellazioni');
  const fd = openSync(percorso, 'a', 0o600);
  try {
    writeSync(fd, JSON.stringify(voce) + '\n');
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

function account(db, id) {
  const a = db.prepare('SELECT id, chiave_locale, generazione FROM account WHERE id = ?').get(id);
  if (!a) throw new Error(`account ${id} inesistente`);
  return a;
}

/**
 * Svuota il WAL dentro il file e lo tronca a zero. **Serve perche' una
 * cancellazione cancelli davvero** (§14.4), ed e' misurato, non dedotto (P-11):
 * `secure_delete` azzera la pagina, ma la versione di prima della pagina resta
 * nei frame vecchi del `-wal`, con l'email e le righe leggibili, e ci resta
 * anche dopo un checkpoint normale, che copia le pagine nel file e lascia il
 * `-wal` com'e'. Solo `TRUNCATE` lo svuota. Restituisce `true` se ci e'
 * riuscito: con un lettore aperto accanto — una copia in corso — puo' non
 * riuscirci, e allora riprova il lavoro quotidiano.
 */
export function svuotaWal(db) {
  return db.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get().busy === 0;
}

/** Cancella un account con tutte le sue righe, adesso (§14.1). */
export function cancellaAccount(db, id, { cancellazioni, il = adesso() }) {
  const a = account(db, id);
  annota(cancellazioni, { evento: 'cancellazione', account: a.id, chiave: a.chiave_locale, il });
  transazione(db, () => db.prepare('DELETE FROM account WHERE id = ?').run(id));
  return svuotaWal(db);
}

/** Azzera i progressi: toglie le righe, tiene l'account, alza la generazione (§8.4). */
export function azzera(db, id, { cancellazioni, il = adesso() }) {
  const a = account(db, id);
  const generazione = a.generazione + 1;
  annota(cancellazioni, { evento: 'azzeramento', account: a.id, chiave: a.chiave_locale, generazione, il });
  transazione(db, () => applicaAzzeramento(db, a.id, generazione, il));
  svuotaWal(db);
  return generazione;
}

function applicaAzzeramento(db, id, generazione, il) {
  db.prepare('DELETE FROM riga WHERE account_id = ?').run(id);
  db.prepare('UPDATE account SET generazione = ?, azzerato_il = ? WHERE id = ?').run(generazione, il, id);
}

/**
 * Legge il file. Una riga che non si legge — l'ultima, se il processo e' caduto
 * mentre la scriveva — si conta e non si salta in silenzio.
 */
export function leggiCancellazioni(percorso) {
  if (!percorso || !existsSync(percorso)) return { voci: [], illeggibili: 0 };
  const voci = [];
  let illeggibili = 0;
  for (const testo of readFileSync(percorso, 'utf8').split('\n')) {
    if (!testo.trim()) continue;
    try {
      const v = JSON.parse(testo);
      if ((v.evento === 'cancellazione' || (v.evento === 'azzeramento' && Number.isInteger(v.generazione)))
          && Number.isInteger(v.account) && typeof v.chiave === 'string' && typeof v.il === 'string') voci.push(v);
      else illeggibili++;
    } catch {
      illeggibili++;
    }
  }
  return { voci, illeggibili };
}

/**
 * Rilegge il file sul database appena ripristinato. Idempotente: un account
 * gia' cancellato non c'e', una generazione gia' raggiunta non si rialza.
 */
export function riapplicaCancellazioni(db, percorso) {
  const { voci, illeggibili } = leggiCancellazioni(percorso);
  const ricancellati = [], riazzerati = [];
  transazione(db, () => {
    for (const v of voci) {
      const a = db.prepare('SELECT id, generazione FROM account WHERE id = ? AND chiave_locale = ?').get(v.account, v.chiave);
      if (!a) continue;
      if (v.evento === 'cancellazione') {
        db.prepare('DELETE FROM account WHERE id = ?').run(a.id);
        ricancellati.push(a.id);
      } else if (a.generazione < v.generazione) {
        applicaAzzeramento(db, a.id, v.generazione, v.il);
        riazzerati.push(a.id);
      }
    }
  });
  return { ricancellati, riazzerati, illeggibili };
}
