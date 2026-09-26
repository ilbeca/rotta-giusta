// La copia di sicurezza, il ripristino, e la prova che il ripristino funziona.
//
// docs/account-progetto.md §2.5 e §2.7. *Un backup mai ripristinato non e' un
// backup, e' un file* (0.4.6): `prova()` fa il giro intero — scrive, copia,
// cancella, ripristina, confronta — ed e' nella suite del server.
//
// Sono strumenti della macchina, non del server: girano a servizio fermo e non
// avviano HTTP. Il trasporto delle copie verso `nl-ams` non sta qui: e' della
// macchina, con la sua chiave, che nel repo non entra (§2.5).

import { DatabaseSync } from 'node:sqlite';
import { existsSync, rmSync, renameSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  SCHEMA, apri, versioneSchema, leggiEpoca, rigeneraEpoca, creaAccount, aggiungiRighe, righeDopo,
  cancellaAccount, azzera, leggiCancellazioni, riapplicaCancellazioni,
} from './db.mjs';

const citato = (p) => `'${String(p).replaceAll("'", "''")}'`;

function conta(db) {
  return {
    righe: db.prepare('SELECT count(*) n FROM riga').get().n,
    account: db.prepare('SELECT count(*) n FROM account').get().n,
  };
}

function integrita(db) {
  return db.prepare('PRAGMA integrity_check').all().map((r) => r.integrity_check).join('; ');
}

function togli(percorso) {
  for (const s of ['', '-wal', '-shm', '-journal']) rmSync(percorso + s, { force: true });
}

/**
 * Copia il database in `destinazione`, con `VACUUM INTO` e **mai** copiando il
 * file: in WAL il file principale puo' essere vuoto mentre i dati stanno nel
 * `-wal` accanto (misurato il 24 agosto sul progetto originario: zero righe nel
 * `.db`, 108 nel WAL). Funziona anche con il servizio acceso.
 *
 * Ogni copia si verifica con `integrity_check`, e una che non passa non resta
 * sul disco. Con `precedente`, il numero di righe si confronta con la copia
 * prima: le righe si tolgono solo con una cancellazione o un azzeramento, quindi
 * un calo che il file delle cancellazioni non spiega e' un **allarme**.
 */
export function copia(percorsoDb, destinazione, { precedente, cancellazioni } = {}) {
  if (!existsSync(percorsoDb)) throw new Error(`${percorsoDb}: il database non c'e'`);
  if (existsSync(destinazione)) throw new Error(`${destinazione}: esiste gia', e una copia non si sovrascrive`);

  const sorgente = new DatabaseSync(percorsoDb);
  try {
    sorgente.exec(`VACUUM INTO ${citato(destinazione)}`);
  } finally {
    sorgente.close();
  }

  let esito;
  const c = new DatabaseSync(destinazione, { readOnly: true });
  try {
    esito = { destinazione, integrita: integrita(c), ...conta(c), schema: versioneSchema(c), epoca: leggiEpoca(c) };
  } finally {
    c.close();
  }
  if (esito.integrita !== 'ok') {
    togli(destinazione);
    throw new Error(`la copia non passa integrity_check (${esito.integrita}): tolta`);
  }

  esito.calo = null;
  esito.allarme = false;
  if (precedente) {
    const p = new DatabaseSync(precedente, { readOnly: true });
    const prima = conta(p).righe;
    p.close();
    if (esito.righe < prima) {
      const dal = Math.floor(statSync(precedente).mtimeMs);
      const spiegato = leggiCancellazioni(cancellazioni).voci.some((v) => Date.parse(v.il) >= dal);
      esito.calo = { prima, dopo: esito.righe, spiegato };
      esito.allarme = !spiegato;
    }
  }
  annotaCopia(percorsoDb, esito);
  return esito;
}

/**
 * Scrive l'esito nel registro del database vivo, dove il server lo legge per
 * gli allarmi (§15.4, server/allarmi.mjs): una copia con meno righe senza
 * cancellazioni che lo spieghino e' un allarme, e un allarme che resta
 * nell'uscita di un comando non lo vede nessuno. Il registro c'e' dallo schema 2.
 */
function annotaCopia(percorsoDb, esito) {
  const db = new DatabaseSync(percorsoDb);
  try {
    db.exec('PRAGMA busy_timeout = 5000');
    if (versioneSchema(db) < 2) return;
    const scrivi = db.prepare('INSERT INTO registro (quando, evento, dettaglio) VALUES (?, ?, ?)');
    const quando = new Date().toISOString();
    scrivi.run(quando, 'copia fatta', `${esito.righe} righe, ${esito.account} account`);
    if (esito.allarme) scrivi.run(quando, 'copia con meno righe', `righe da ${esito.calo.prima} a ${esito.calo.dopo}, nessuna cancellazione lo spiega`);
  } finally {
    db.close();
  }
}

/**
 * Ripristina `copiaPath` al posto del database. **A servizio fermo.**
 *
 * Il database nuovo si prepara accanto, con un nome suo, e prende il posto del
 * vecchio solo quando e' pronto e verificato: una copia rotta non tocca niente.
 * Prima di riaprire il servizio fa le due cose del §2.7:
 *
 * - **rigenera l'epoca.** Il cursore delle righe riparte dalla copia; un client
 *   che vede cambiare l'epoca azzera il suo e rimanda tutte le righe che ha, e
 *   l'unione per `uid` riporta sul server quelle accolte dopo la copia;
 * - **rilegge il file delle cancellazioni**, che sta fuori dal database: gli
 *   account cancellati e i progressi azzerati dopo la copia restano tali.
 */
export function ripristina(copiaPath, percorsoDb, { cancellazioni } = {}) {
  if (!existsSync(copiaPath)) throw new Error(`${copiaPath}: la copia non c'e'`);
  const nuovo = percorsoDb + '.ripristino';
  togli(nuovo);
  try {
    const c = new DatabaseSync(copiaPath, { readOnly: true });
    try {
      const ok = integrita(c);
      if (ok !== 'ok') throw new Error(`la copia non passa integrity_check (${ok})`);
      if (versioneSchema(c) < 1) throw new Error("la copia non ha un numero di schema: non e' un database di questo server");
      c.exec(`VACUUM INTO ${citato(nuovo)}`);
    } finally {
      c.close();
    }

    const db = new DatabaseSync(nuovo);
    let esito;
    try {
      db.exec('PRAGMA foreign_keys = ON');
      db.exec('PRAGMA secure_delete = ON');
      const epocaPrima = leggiEpoca(db);
      const epoca = rigeneraEpoca(db);
      const riletto = riapplicaCancellazioni(db, cancellazioni);
      const ok = integrita(db);
      if (ok !== 'ok') throw new Error(`il database ripristinato non passa integrity_check (${ok})`);
      esito = { ...conta(db), schema: versioneSchema(db), epocaPrima, epoca, ...riletto };
    } finally {
      db.close();
    }

    togli(percorsoDb);
    renameSync(nuovo, percorsoDb);
    return esito;
  } catch (e) {
    togli(nuovo);
    throw e;
  }
}

// --- la prova ---------------------------------------------------------------------

const PHC_FINTO = '$argon2id$v=19$m=65536,t=2,p=1$cHJvdmE$cHJvdmE';

function rigaDiProva(n) {
  return {
    _t: 'q', uid: `p${String(n).padStart(6, '0')}`, item_id: `base-${1 + (n % 1400)}`,
    ts: '2026-09-26T10:00:00+02:00', ms: 9000, mode: 'prova', kind: 'base', correct: n % 3 ? 1 : 0,
  };
}
const serie = (da, quante) => Array.from({ length: quante }, (_, i) => rigaDiProva(da + i));

/**
 * Il giro intero, su un'istanza sacrificabile in `cartella`: scrive, copia,
 * cancella, ripristina, confronta. Tocca lo schema, l'epoca, il file delle
 * cancellazioni e le righe. Restituisce l'elenco dei controlli, ognuno con il
 * suo esito: chi la lancia a mano sulla macchina li legge uno per uno.
 */
export function prova({ cartella }) {
  const p = join(cartella, 'conti.db');
  const f = join(cartella, 'cancellazioni');
  const controlli = [];
  const k = (nome, ok, dettaglio = '') => controlli.push({ nome, ok: Boolean(ok), dettaglio: String(dettaglio) });

  // Scrive: tre account, e le righe di ognuno.
  let db = apri(p, { log: () => {} });
  k('schema: il database nasce con il suo numero', versioneSchema(db) === SCHEMA, versioneSchema(db));
  const epoca0 = leggiEpoca(db);
  k("epoca: il database nasce con un'epoca", /^[0-9a-f]{32}$/.test(epoca0), epoca0);
  const a = creaAccount(db, { email: 'telefono@prova.invalid', password: PHC_FINTO });
  const b = creaAccount(db, { email: 'cancella@prova.invalid', password: PHC_FINTO });
  const c = creaAccount(db, { email: 'azzera@prova.invalid', password: PHC_FINTO });
  aggiungiRighe(db, a, serie(0, 40));
  aggiungiRighe(db, b, serie(1000, 30));
  aggiungiRighe(db, c, serie(2000, 20));
  const primaDellaCopia = db.prepare('SELECT account_id, uid, seq, dati FROM riga ORDER BY seq').all();
  db.close();

  // Copia.
  const copia1 = join(cartella, 'copia-1.db');
  const c1 = copia(p, copia1, { cancellazioni: f });
  k('copia: passa integrity_check', c1.integrita === 'ok', c1.integrita);
  k("righe: la copia ha tutte le righe dell'originale", c1.righe === 90 && c1.account === 3, `${c1.righe} righe, ${c1.account} account`);

  // Dopo la copia la vita continua: il telefono manda cinque risposte, e le
  // toglie dalla coda perche' il server le ha accolte; un account si cancella,
  // un altro azzera i progressi e ricomincia.
  db = apri(p, { log: () => {} });
  const telefono = [...serie(0, 40), ...serie(500, 5)];
  aggiungiRighe(db, a, serie(500, 5));
  const cursorePortatile = righeDopo(db, a, 0).ultima_seq;
  cancellaAccount(db, b, { cancellazioni: f });
  azzera(db, c, { cancellazioni: f });
  aggiungiRighe(db, c, serie(2500, 3));
  db.close();
  k("cancellazioni: il file c'e' e non ha email", existsSync(f) && !readFileSync(f, 'utf8').includes('@'));

  // Cancella: il disastro.
  togli(p);
  k("disastro: il database non c'e' piu'", !existsSync(p));

  // Ripristina.
  const r = ripristina(copia1, p, { cancellazioni: f });
  k('schema: il ripristinato ha lo stesso numero', r.schema === SCHEMA, r.schema);
  k("epoca: il ripristino cambia l'epoca", r.epoca !== epoca0 && r.epocaPrima === epoca0, `${r.epocaPrima} → ${r.epoca}`);
  k('cancellazioni: ricancellato chi si era cancellato dopo la copia', r.ricancellati.length === 1 && r.ricancellati[0] === b, r.ricancellati);
  k('cancellazioni: riazzerato chi aveva azzerato dopo la copia', r.riazzerati.length === 1 && r.riazzerati[0] === c, r.riazzerati);
  k('cancellazioni: nessuna riga del file illeggibile', r.illeggibili === 0, r.illeggibili);

  // Confronta.
  db = apri(p, { log: () => {} });
  k('righe: integrity_check dopo il ripristino', integrita(db) === 'ok', integrita(db));
  const ripristinate = db.prepare('SELECT account_id, uid, seq, dati FROM riga WHERE account_id = ? ORDER BY seq').all(a);
  const originali = primaDellaCopia.filter((x) => x.account_id === a);
  k('righe: quelle della copia tornano byte per byte',
    ripristinate.length === 40 && ripristinate.every((x, i) => x.uid === originali[i].uid && x.seq === originali[i].seq && x.dati === originali[i].dati));
  k("cancellazioni: l'account cancellato non torna, e nemmeno le sue righe",
    !db.prepare('SELECT 1 FROM account WHERE id = ?').get(b) && db.prepare('SELECT count(*) n FROM riga WHERE account_id = ?').get(b).n === 0);
  const gc = db.prepare('SELECT generazione g FROM account WHERE id = ?').get(c)?.g;
  k("cancellazioni: l'azzeramento resta, con la sua generazione", gc === 2 && righeDopo(db, c, 0).righe.length === 0, `generazione ${gc}`);
  k('righe: le cinque accolte dopo la copia mancano dal server, come previsto', righeDopo(db, a, 0).righe.length === 40);

  // L'epoca al lavoro. Il telefono risponde ancora: la riga nuova prende un
  // numero che il portatile ha gia' superato.
  aggiungiRighe(db, a, [rigaDiProva(900)]);
  const colCursoreVecchio = righeDopo(db, a, cursorePortatile).righe.map((x) => x.uid);
  k('epoca: con il cursore vecchio la riga nuova non si vedrebbe', !colCursoreVecchio.includes(rigaDiProva(900).uid), colCursoreVecchio.length);
  const rinvio = aggiungiRighe(db, a, telefono);
  const attese = serie(500, 5).map((x) => x.uid);
  k('epoca: il rinvio del telefono riporta esattamente le cinque perse',
    rinvio.nuove.length === 5 && attese.every((u) => rinvio.nuove.includes(u)) && rinvio.gia.length === 40, rinvio.nuove);
  const portatile = righeDopo(db, a, 0).righe.map((x) => x.uid);
  k("epoca: il portatile, azzerato il cursore, riceve tutto", portatile.length === 46 && attese.every((u) => portatile.includes(u)), portatile.length);
  db.close();

  // E la copia dopo: il calo c'e' ed e' spiegato dal file, non un allarme.
  const c2 = copia(p, join(cartella, 'copia-2.db'), { precedente: copia1, cancellazioni: f });
  k('copia: il calo dopo le cancellazioni e spiegato, non un allarme', c2.calo?.spiegato === true && !c2.allarme, JSON.stringify(c2.calo));

  return { cartella, controlli };
}
