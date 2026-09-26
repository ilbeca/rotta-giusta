// Test del server degli account: node --test tests/test_server.mjs
//
// La quinta suite (docs/account-progetto.md §16.2). Il server si avvia nello
// stesso processo, su un database temporaneo, e si interroga con `fetch`: cosi'
// i requisiti del server non sono «scoperti», si eseguono.
//
// Il server risponde alla salute, all'account (P-09) — registrazione, accesso,
// sessione, verifica dell'email, password —, alle righe (P-10): invio,
// ricezione, export, azzeramento; e a quello che chiude le sue rotte (P-11):
// cambio d'indirizzo, profilo, cancellazione, i due anni di inattivita' e gli
// allarmi al titolare. L'altra meta' di questo file e' la
// copia di sicurezza con il ripristino provato — *un backup mai ripristinato
// non e' un backup, e' un file* (0.4.6) — con l'epoca del database e il file
// delle cancellazioni del §2.7.
//
// Deve girare anche con la versione di Node della macchina, una LTS pari (oggi
// la 24), non solo con quella del Mac: account-progetto.md §2.6.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync, readdirSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

import { avvia } from '../server/server.mjs';
import {
  SCHEMA, MIGRAZIONI, apri, leggiEpoca, creaAccount, aggiungiRighe, righeDopo,
  cancellaAccount, azzera, leggiCancellazioni,
} from '../server/db.mjs';
import { copia, ripristina, prova } from '../server/copie.mjs';
import { hashPassword } from '../server/password.mjs';
import * as E from '../site/engine.js';

const { validaRiga } = E;

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = readFileSync(join(RADICE, 'VERSION'), 'utf8').trim();

function cartella(t) {
  const c = mkdtempSync(join(tmpdir(), 'rg-test-'));
  t.after(() => rmSync(c, { recursive: true, force: true }));
  return c;
}

function riga(n, extra = {}) {
  return {
    _t: 'q', uid: `u${String(n).padStart(6, '0')}`, item_id: `base-${1 + (n % 1400)}`,
    ts: '2026-09-26T10:00:00+02:00', ms: 9000, mode: 'batteria', kind: 'base',
    correct: n % 3 ? 1 : 0, ...extra,
  };
}

const PHC = '$argon2id$v=19$m=65536,t=2,p=1$c2FsZQ$aGFzaA';

// --- la salute --------------------------------------------------------------------

test('salute: il server risponde con la versione, lo schema e l epoca', async (t) => {
  const c = cartella(t);
  const s = await avvia({ db: join(c, 'conti.db'), cancellazioni: join(c, 'cancellazioni'), porta: 0 });
  t.after(() => s.chiudi());

  const r = await fetch(`${s.indirizzo}/v1/salute`);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /^application\/json/);
  const b = await r.json();
  assert.equal(b.stato, 'ok');
  assert.equal(b.versione, VERSION, 'la versione e quella di VERSION, letta dalla radice del codice');
  assert.deepEqual(b.schema, { codice: SCHEMA, database: SCHEMA });
  assert.match(b.epoca, /^[0-9a-f]{32}$/);
});

test('salute: una rotta che non esiste risponde con un errore che si legge', async (t) => {
  const c = cartella(t);
  const s = await avvia({ db: join(c, 'conti.db'), cancellazioni: join(c, 'cancellazioni'), porta: 0 });
  t.after(() => s.chiudi());

  for (const [metodo, percorso, codice] of [['GET', '/', 404], ['GET', '/v1/nessuna', 404], ['POST', '/v1/salute', 405]]) {
    const r = await fetch(`${s.indirizzo}${percorso}`, { method: metodo });
    assert.equal(r.status, codice, `${metodo} ${percorso}`);
    const b = await r.json();
    assert.equal(typeof b.errore, 'string');
    assert.ok(b.messaggio.length > 10, 'un errore dice che cosa e successo');
  }
});

test('salute: il server ascolta solo sull indirizzo locale se non gli si dice altro', async (t) => {
  const c = cartella(t);
  const s = await avvia({ db: join(c, 'conti.db'), cancellazioni: join(c, 'cancellazioni'), porta: 0 });
  t.after(() => s.chiudi());
  assert.match(s.indirizzo, /^http:\/\/127\.0\.0\.1:\d+$/);
});

// --- il database nasce ------------------------------------------------------------

test('database: nasce con lo schema, l epoca e secure_delete', (t) => {
  const c = cartella(t);
  const db = apri(join(c, 'conti.db'));
  t.after(() => db.close());

  assert.equal(db.prepare('PRAGMA user_version').get().user_version, SCHEMA);
  assert.equal(db.prepare('PRAGMA journal_mode').get().journal_mode, 'wal');
  assert.equal(db.prepare('PRAGMA secure_delete').get().secure_delete, 1, 'account-progetto §14.4');
  assert.equal(db.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  const tabelle = db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' ORDER BY name").all().map((r) => r.name);
  for (const nome of ['account', 'impianto', 'riga']) assert.ok(tabelle.includes(nome), nome);
  assert.match(leggiEpoca(db), /^[0-9a-f]{32}$/);
});

test('database: riaperto tiene la stessa epoca', (t) => {
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const a = apri(p); const e = leggiEpoca(a); a.close();
  const b = apri(p); t.after(() => b.close());
  assert.equal(leggiEpoca(b), e, 'l epoca cambia solo con un ripristino');
});

test('database: uno schema piu alto del codice parte e lo scrive', async (t) => {
  // §2.7, regola 3: le migrazioni sono additive, quindi il rilascio precedente
  // gira sul database di quello nuovo. Rifiutarsi di partire vorrebbe dire che
  // tornare indietro non funziona proprio quando serve.
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const a = apri(p); a.exec(`PRAGMA user_version = ${SCHEMA + 1}`); a.close();

  const scritto = [];
  const s = await avvia({ db: p, cancellazioni: join(c, 'cancellazioni'), porta: 0, log: (m) => scritto.push(m) });
  t.after(() => s.chiudi());
  const b = await (await fetch(`${s.indirizzo}/v1/salute`)).json();
  assert.deepEqual(b.schema, { codice: SCHEMA, database: SCHEMA + 1 });
  assert.ok(scritto.some((m) => /schema/.test(m) && m.includes(String(SCHEMA + 1))), scritto.join(' | '));
});

// --- le righe, quanto serve alla prova ----------------------------------------------

test('righe: il server rifiuta le stesse righe del browser, con lo stesso motivo', (t) => {
  // R-ACC-07, la meta' del server: validaRiga() e' importata da site/engine.js,
  // non riscritta. Una seconda copia delle regole e' la riga con ts: "boh"
  // della 0.4.6, accettata dal server e fatale su ogni dispositivo.
  const c = cartella(t);
  const db = apri(join(c, 'conti.db')); t.after(() => db.close());
  const id = creaAccount(db, { email: 'a@esempio.it', password: PHC });

  const rotte = [
    riga(1, { ts: 'boh' }),
    { ...riga(2), uid: undefined },
    riga(3, { _t: 'x' }),
    riga(4, { item_id: 'base-99999' }),
  ];
  const quesiti = new Set(['base-2', 'base-3', 'base-4', 'base-5']);
  const esito = aggiungiRighe(db, id, [...rotte, riga(4)], { quesiti });
  assert.deepEqual(esito.nuove, ['u000004']);
  assert.deepEqual(esito.scartate.map((s) => s.motivo), rotte.map((r) => validaRiga(r, { quesiti })));
});

test('righe: una riga torna com era arrivata, e il doppione non si duplica', (t) => {
  const c = cartella(t);
  const db = apri(join(c, 'conti.db')); t.after(() => db.close());
  const id = creaAccount(db, { email: 'a@esempio.it', password: PHC });
  const r = riga(1, { campo_nuovo: { anche: ['annidato', 1.5] } });
  assert.deepEqual(aggiungiRighe(db, id, [r]).nuove, ['u000001']);
  const di = aggiungiRighe(db, id, [r, riga(2)]);
  assert.deepEqual(di.gia, ['u000001']);
  assert.deepEqual(di.nuove, ['u000002']);
  assert.deepEqual(righeDopo(db, id, 0).righe[0], r);
});

test('righe: il cursore non riusa un numero liberato da una cancellazione', (t) => {
  // Con `seq = MAX(seq) + 1`, cancellare l'account che aveva le righe piu'
  // recenti fa scendere il massimo, e la riga successiva riprende un numero
  // gia' dato. Oggi non morde, perche' ogni cursore e' quello di un account e
  // il massimo globale non scende mai sotto il suo; basterebbe pero' che un
  // giorno una risposta esponesse il numero globale, e la riga nuova starebbe
  // prima del cursore: il cursore su `ts` del §2.3 per un'altra strada. Il
  // contatore in `impianto` toglie la condizione invece di ricordarla.
  const c = cartella(t);
  const db = apri(join(c, 'conti.db')); t.after(() => db.close());
  const f = join(c, 'cancellazioni');
  const x = creaAccount(db, { email: 'x@esempio.it', password: PHC });
  const y = creaAccount(db, { email: 'y@esempio.it', password: PHC });
  aggiungiRighe(db, x, [riga(1), riga(2)]);
  aggiungiRighe(db, y, [riga(3), riga(4), riga(5)]);
  const cursore = righeDopo(db, x, 0).ultima_seq;
  const cursoreGlobale = righeDopo(db, y, 0).ultima_seq;
  assert.ok(cursoreGlobale > cursore);

  cancellaAccount(db, y, { cancellazioni: f });
  aggiungiRighe(db, x, [riga(6)]);
  // La riga nuova sta dopo ogni numero mai dato, non solo dopo quelli di x.
  const dopo = righeDopo(db, x, cursoreGlobale).righe.map((r) => r.uid);
  assert.deepEqual(dopo, ['u000006']);
});

// --- le cancellazioni fuori dal database -------------------------------------------

test('cancellazioni: si scrivono nel file, senza email', (t) => {
  const c = cartella(t);
  const f = join(c, 'cancellazioni');
  const db = apri(join(c, 'conti.db')); t.after(() => db.close());
  const a = creaAccount(db, { email: 'chi.cancella@esempio.it', password: PHC });
  const b = creaAccount(db, { email: 'chi.azzera@esempio.it', password: PHC });
  aggiungiRighe(db, a, [riga(1)]);
  aggiungiRighe(db, b, [riga(2), riga(3)]);

  cancellaAccount(db, a, { cancellazioni: f });
  const g = azzera(db, b, { cancellazioni: f });
  assert.equal(g, 2, 'la generazione sale di uno');

  const testo = readFileSync(f, 'utf8');
  assert.ok(!testo.includes('@'), 'nessuna email nel file');
  const { voci, illeggibili } = leggiCancellazioni(f);
  assert.equal(illeggibili, 0);
  assert.deepEqual(voci.map((v) => [v.evento, v.account]), [['cancellazione', a], ['azzeramento', b]]);
  assert.equal(voci[1].generazione, 2);

  assert.equal(db.prepare('SELECT count(*) n FROM account WHERE id = ?').get(a).n, 0);
  assert.equal(db.prepare('SELECT count(*) n FROM riga WHERE account_id = ?').get(a).n, 0, 'le righe vanno con l account');
  assert.equal(db.prepare('SELECT count(*) n FROM riga WHERE account_id = ?').get(b).n, 0);
  assert.equal(db.prepare('SELECT generazione g FROM account WHERE id = ?').get(b).g, 2);
});

test('cancellazioni: una riga del file troncata si conta, non si perde in silenzio', (t) => {
  const c = cartella(t);
  const f = join(c, 'cancellazioni');
  const db = apri(join(c, 'conti.db')); t.after(() => db.close());
  const a = creaAccount(db, { email: 'a@esempio.it', password: PHC });
  cancellaAccount(db, a, { cancellazioni: f });
  writeFileSync(f, readFileSync(f, 'utf8') + '{"evento":"cancel', { flag: 'w' });
  const { voci, illeggibili } = leggiCancellazioni(f);
  assert.equal(voci.length, 1);
  assert.equal(illeggibili, 1);
});

test('cancellazioni: un id riusato dopo un ripristino non si ricancella', (t) => {
  // Trovato scrivendo questa suite. Dopo un ripristino il database riparte dal
  // massimo della copia, quindi un account nuovo puo' prendere l'id di uno
  // cancellato dopo la copia. Il ripristino successivo rileggerebbe «id N
  // cancellato» e cancellerebbe la persona sbagliata. Il file porta anche la
  // chiave casuale dell'account, e si ricancella solo se combaciano entrambe.
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const f = join(c, 'cancellazioni');
  let db = apri(p);
  creaAccount(db, { email: 'a@esempio.it', password: PHC });
  db.close();
  copia(p, join(c, 'copia-1.db'));

  db = apri(p);
  const d = creaAccount(db, { email: 'd@esempio.it', password: PHC });
  cancellaAccount(db, d, { cancellazioni: f });
  db.close();

  ripristina(join(c, 'copia-1.db'), p, { cancellazioni: f });
  db = apri(p);
  const e = creaAccount(db, { email: 'e@esempio.it', password: PHC });
  assert.equal(e, d, 'l id si riusa davvero: senza la chiave la trappola scatterebbe');
  aggiungiRighe(db, e, [riga(1)]);
  db.close();
  copia(p, join(c, 'copia-2.db'));

  const esito = ripristina(join(c, 'copia-2.db'), p, { cancellazioni: f });
  assert.deepEqual(esito.ricancellati, []);
  db = apri(p); t.after(() => db.close());
  assert.equal(db.prepare('SELECT email FROM account WHERE id = ?').get(e).email, 'e@esempio.it');
  assert.equal(righeDopo(db, e, 0).righe.length, 1);
});

// --- la copia e il ripristino -------------------------------------------------------

test('copia: si ripristina con le stesse righe dell originale', (t) => {
  // R-ACC-20. La copia si fa con VACUUM INTO, mai copiando il file: in WAL il
  // file principale puo' essere vuoto mentre i dati stanno nel -wal accanto.
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const db = apri(p);
  const a = creaAccount(db, { email: 'a@esempio.it', password: PHC });
  const b = creaAccount(db, { email: 'b@esempio.it', password: PHC });
  aggiungiRighe(db, a, Array.from({ length: 60 }, (_, i) => riga(i)));
  aggiungiRighe(db, b, Array.from({ length: 25 }, (_, i) => riga(100 + i, { campo_nuovo: i })));
  const prima = db.prepare('SELECT account_id, uid, seq, dati FROM riga ORDER BY seq').all();
  // Il database resta aperto, come quello del servizio che gira: la copia si
  // fa sotto il processo vivo.
  const esito = copia(p, join(c, 'copia.db'));
  db.close();
  assert.equal(esito.integrita, 'ok');
  assert.equal(esito.righe, 85);
  assert.equal(esito.account, 2);

  rmSync(p); rmSync(p + '-wal', { force: true }); rmSync(p + '-shm', { force: true });
  const r = ripristina(join(c, 'copia.db'), p, { cancellazioni: join(c, 'cancellazioni') });
  assert.equal(r.righe, 85);

  const dopo = apri(p); t.after(() => dopo.close());
  assert.deepEqual(dopo.prepare('SELECT account_id, uid, seq, dati FROM riga ORDER BY seq').all(), prima,
    'byte per byte, campi sconosciuti compresi');
  assert.equal(dopo.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
});

test('copia: un calo di righe senza cancellazioni e un allarme', (t) => {
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const f = join(c, 'cancellazioni');
  const db = apri(p);
  const a = creaAccount(db, { email: 'a@esempio.it', password: PHC });
  aggiungiRighe(db, a, Array.from({ length: 10 }, (_, i) => riga(i)));
  const c1 = copia(p, join(c, 'copia-1.db'), { cancellazioni: f });
  assert.equal(c1.allarme, false);
  // La copia precedente ha un'ora: le cancellazioni si contano da li'.
  const unOraFa = new Date(Date.now() - 3600e3);
  utimesSync(join(c, 'copia-1.db'), unOraFa, unOraFa);

  // Tre righe spariscono senza che nessuno le abbia chieste.
  db.exec("DELETE FROM riga WHERE uid IN ('u000001', 'u000002', 'u000003')");
  const c2 = copia(p, join(c, 'copia-2.db'), { precedente: join(c, 'copia-1.db'), cancellazioni: f });
  assert.equal(c2.allarme, true);
  assert.deepEqual(c2.calo, { prima: 10, dopo: 7, spiegato: false });

  // Un azzeramento chiesto spiega il calo.
  azzera(db, a, { cancellazioni: f });
  const c3 = copia(p, join(c, 'copia-3.db'), { precedente: join(c, 'copia-1.db'), cancellazioni: f });
  db.close();
  assert.equal(c3.allarme, false);
  assert.deepEqual(c3.calo, { prima: 10, dopo: 0, spiegato: true });
});

test('copia: non sovrascrive una copia che esiste', (t) => {
  const c = cartella(t);
  const p = join(c, 'conti.db');
  apri(p).close();
  copia(p, join(c, 'copia.db'));
  assert.throws(() => copia(p, join(c, 'copia.db')));
});

test('ripristino: una copia rotta non tocca il database', (t) => {
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const db = apri(p);
  const a = creaAccount(db, { email: 'a@esempio.it', password: PHC });
  aggiungiRighe(db, a, [riga(1)]);
  db.close();
  copia(p, join(c, 'copia.db'));
  const byte = readFileSync(join(c, 'copia.db'));
  byte.fill(0x5a, 100, byte.length - 100);
  writeFileSync(join(c, 'rotta.db'), byte);

  assert.throws(() => ripristina(join(c, 'rotta.db'), p, { cancellazioni: join(c, 'cancellazioni') }));
  const dopo = apri(p); t.after(() => dopo.close());
  assert.equal(righeDopo(dopo, a, 0).righe.length, 1);
  assert.deepEqual(readdirSync(c).filter((n) => n.includes('ripristino')), [], 'nessun avanzo del tentativo');
});

test('ripristino: le cancellazioni dopo la copia restano cancellate', (t) => {
  // R-ACC-19, la parte del ripristino: il registro sta nel database che si
  // ripristina, quindi l'elenco da rileggere sta in un file a parte (§2.7).
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const f = join(c, 'cancellazioni');
  let db = apri(p);
  const a = creaAccount(db, { email: 'a@esempio.it', password: PHC });
  const b = creaAccount(db, { email: 'b@esempio.it', password: PHC });
  aggiungiRighe(db, a, [riga(1), riga(2)]);
  aggiungiRighe(db, b, [riga(3), riga(4)]);
  db.close();
  copia(p, join(c, 'copia.db'));

  db = apri(p);
  cancellaAccount(db, a, { cancellazioni: f });
  azzera(db, b, { cancellazioni: f });
  db.close();

  const esito = ripristina(join(c, 'copia.db'), p, { cancellazioni: f });
  assert.deepEqual(esito.ricancellati, [a]);
  assert.deepEqual(esito.riazzerati, [b]);
  db = apri(p); t.after(() => db.close());
  assert.equal(db.prepare('SELECT count(*) n FROM account WHERE id = ?').get(a).n, 0);
  assert.equal(db.prepare('SELECT count(*) n FROM riga WHERE account_id IN (?, ?)').get(a, b).n, 0);
  assert.equal(db.prepare('SELECT generazione g FROM account WHERE id = ?').get(b).g, 2);

  // Ripetere il ripristino non cambia niente: rileggere il file e' idempotente.
  db.close();
  const di = ripristina(join(c, 'copia.db'), p, { cancellazioni: f });
  assert.deepEqual([di.ricancellati, di.riazzerati], [[a], [b]]);
  db = apri(p);
  assert.equal(db.prepare('SELECT generazione g FROM account WHERE id = ?').get(b).g, 2, 'non sale due volte');
});

test('ripristino: un azzeramento gia nella copia non cancella le righe venute dopo', (t) => {
  // Il file si rilegge tutto, anche le voci piu' vecchie della copia. Un
  // azzeramento che la copia contiene gia' non va rifatto: toglierebbe le
  // risposte date dopo, con la generazione nuova, che nessuno ha chiesto di
  // cancellare. Trovato rompendo la condizione apposta: nessun test lo prendeva.
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const f = join(c, 'cancellazioni');
  let db = apri(p);
  const a = creaAccount(db, { email: 'a@esempio.it', password: PHC });
  aggiungiRighe(db, a, [riga(1), riga(2)]);
  azzera(db, a, { cancellazioni: f });
  aggiungiRighe(db, a, [riga(3), riga(4), riga(5)]);
  db.close();
  copia(p, join(c, 'copia.db'));

  const esito = ripristina(join(c, 'copia.db'), p, { cancellazioni: f });
  assert.deepEqual(esito.riazzerati, []);
  db = apri(p); t.after(() => db.close());
  assert.deepEqual(righeDopo(db, a, 0).righe.map((r) => r.uid), ['u000003', 'u000004', 'u000005']);
});

test('epoca: dopo un ripristino le righe accolte dopo la copia tornano', async (t) => {
  // R-ACC-24. Misurato in P-02: dopo un ripristino il cursore riparte dalla
  // copia, la riga nuova prende un numero gia' visto e un dispositivo fermo
  // piu' avanti non la vede mai. E le righe accolte dopo la copia sono sparite
  // dal server, mentre i client le hanno gia' tolte dalla coda. L'epoca
  // cambia a ogni ripristino: chi la vede cambiare azzera il cursore e rimanda
  // tutto, e l'unione per `uid` fa il resto.
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const f = join(c, 'cancellazioni');
  let db = apri(p);
  const a = creaAccount(db, { email: 'a@esempio.it', password: PHC });
  const vecchie = Array.from({ length: 40 }, (_, i) => riga(i));
  aggiungiRighe(db, a, vecchie);
  const epocaPrima = leggiEpoca(db);
  db.close();
  copia(p, join(c, 'copia.db'));

  // Dopo la copia: il telefono manda cinque risposte, il server le accoglie,
  // il telefono le toglie dalla coda. Il portatile le riceve.
  db = apri(p);
  const nuove = Array.from({ length: 5 }, (_, i) => riga(500 + i));
  assert.equal(aggiungiRighe(db, a, nuove).nuove.length, 5);
  const telefono = [...vecchie, ...nuove];
  const cursorePortatile = righeDopo(db, a, 0).ultima_seq;
  db.close();

  // Il disastro, e il ripristino dalla copia, a servizio fermo.
  rmSync(p); rmSync(p + '-wal', { force: true }); rmSync(p + '-shm', { force: true });
  ripristina(join(c, 'copia.db'), p, { cancellazioni: f });

  const s = await avvia({ db: p, cancellazioni: f, porta: 0 });
  t.after(() => s.chiudi());
  const epocaDopo = (await (await fetch(`${s.indirizzo}/v1/salute`)).json()).epoca;
  assert.notEqual(epocaDopo, epocaPrima, 'il ripristino cambia l epoca, e il server la dice');

  db = s.db;
  // Il telefono manda una risposta nuova: prende un numero che il portatile ha
  // gia' superato. Senza l'epoca il portatile non la vedrebbe mai.
  aggiungiRighe(db, a, [riga(900)]);
  const senzaEpoca = righeDopo(db, a, cursorePortatile).righe.map((r) => r.uid);
  assert.ok(!senzaEpoca.includes('u000900'), 'la trappola c e: il cursore vecchio la salta');

  // Con l'epoca: il telefono rimanda tutto quello che ha.
  const rinvio = aggiungiRighe(db, a, telefono);
  assert.deepEqual(rinvio.nuove.sort(), nuove.map((r) => r.uid).sort(), 'tornano esattamente le cinque perse');
  assert.equal(rinvio.gia.length, 40);
  // E il portatile, azzerato il cursore, riceve tutto: le cinque e la nuova.
  const ricevute = righeDopo(db, a, 0).righe.map((r) => r.uid);
  assert.equal(ricevute.length, 46);
  for (const r of [...nuove, riga(900)]) assert.ok(ricevute.includes(r.uid), r.uid);
});

test('ripristina --prova: il giro intero, su un istanza sacrificabile', (t) => {
  // Scrive, copia, cancella, ripristina, confronta — con l'epoca, il file delle
  // cancellazioni e lo schema. E' la stessa funzione che si lancia a mano sulla
  // macchina prima di fidarsi di una copia.
  const c = cartella(t);
  const esito = prova({ cartella: c });
  const falliti = esito.controlli.filter((k) => !k.ok).map((k) => k.nome);
  assert.deepEqual(falliti, []);
  assert.ok(esito.controlli.length >= 10, `solo ${esito.controlli.length} controlli`);
  for (const nome of ['schema', 'epoca', 'cancellazioni', 'righe']) {
    assert.ok(esito.controlli.some((k) => k.nome.includes(nome)), `nessun controllo su ${nome}`);
  }
});

test('ripristina --prova: dalla riga di comando esce 0 e non lascia niente', () => {
  const r = spawnSync(process.execPath, [join(RADICE, 'server', 'ripristina.mjs'), '--prova'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /prova superata/);
  const cartellaUsata = r.stdout.match(/su (\S+rg-prova-\S+)/)?.[1];
  assert.ok(cartellaUsata, r.stdout);
  assert.equal(existsSync(cartellaUsata), false, 'l istanza sacrificabile si cancella');
});

// --- il codice del server -------------------------------------------------------------

test('server: zero dipendenze, solo moduli di Node e il motore', () => {
  // account-progetto.md §2.2. E la versione di Node della macchina e' una LTS
  // pari: tutto quello che si importa deve esserci anche li'.
  const dir = join(RADICE, 'server');
  for (const nome of readdirSync(dir).filter((n) => n.endsWith('.mjs'))) {
    const testo = readFileSync(join(dir, nome), 'utf8');
    for (const [, da] of testo.matchAll(/^\s*import\s[^'"]*['"]([^'"]+)['"]/gm)) {
      assert.ok(da.startsWith('node:') || da.startsWith('./') || da === '../site/engine.js',
        `${nome} importa ${da}`);
    }
  }
  assert.ok(Number(process.versions.node.split('.')[0]) >= 24, 'crypto.argon2 e node:sqlite ci sono dalla 24');
});

test('server: la copia e il ripristino non avviano HTTP', () => {
  // Sono strumenti della macchina: girano a servizio fermo.
  const testo = readFileSync(join(RADICE, 'server', 'copie.mjs'), 'utf8');
  assert.ok(!/from '\.\/server\.mjs'/.test(testo));
});

// --- l'account (P-09) -------------------------------------------------------------
//
// docs/account-progetto.md §3, §5, §6, §7.1, §9. Il server si interroga con
// `fetch`, con tre cose passate dal test: l'orologio — per la sessione di trenta
// giorni, i gettoni e le attese senza aspettarle —, un fornitore di posta finto
// che raccoglie le mail o le rifiuta, e parametri di Argon2id economici, perche'
// cento accessi falliti a 64 MiB l'uno sono dieci secondi di suite. I parametri
// veri hanno il loro test.

const ORIGINE = 'https://rottagiusta.it';
const ECONOMICO = { memory: 1024, passes: 1, parallelism: 1 };
const GIORNO = 86400000;
const ORA = 3600000;
const T0 = Date.parse('2026-10-01T08:00:00Z');
const BUONA = 'barca vela e vento';        // 18 caratteri, fuori dall'elenco
const ALTRA = 'rotta giusta per me';       // 19 caratteri, fuori dall'elenco
const TITOLARE = 'titolare@esempio.it';    // dove vanno gli allarmi (§15.4)

async function conti(t, { posta, argon2 = ECONOMICO, log } = {}) {
  const c = cartella(t);
  const orologio = { t: T0 };
  const mail = [];
  const scritto = [];
  const opzioni = {
    db: join(c, 'conti.db'), cancellazioni: join(c, 'cancellazioni'), porta: 0,
    ora: () => orologio.t, argon2, origine: ORIGINE, sito: ORIGINE, proxy: true, titolare: TITOLARE,
    posta: posta ?? { invia: async (m) => { mail.push(m); } },
    log: log ?? ((m) => scritto.push(m)),
  };
  const k = { c, orologio, mail, scritto, opzioni, s: await avvia(opzioni) };
  t.after(() => k.s.chiudi());
  // Un riavvio vero: il processo perde la memoria, il database resta.
  k.riavvia = async () => { await k.s.chiudi(); k.s = await avvia(opzioni); };
  k.chiama = async (metodo, percorso, corpo, { cookie, origine = ORIGINE, ip = '192.0.2.1' } = {}) => {
    const h = { 'x-forwarded-for': ip };
    if (origine) h.origin = origine;
    if (cookie) h.cookie = cookie;
    if (corpo !== undefined) h['content-type'] = 'application/json';
    const r = await fetch(k.s.indirizzo + percorso, {
      method: metodo, headers: h, body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
    const testo = await r.text();
    const sc = r.headers.get('set-cookie');
    return { status: r.status, h: r.headers, corpo: testo ? JSON.parse(testo) : null, setCookie: sc, cookie: sc ? sc.split(';')[0] : null };
  };
  k.avanza = (ms) => { orologio.t += ms; };
  return k;
}

const gettone = (m, scopo) => m.testo.match(new RegExp(`#${scopo}=([A-Za-z0-9_-]+)`))?.[1];

async function registrato(k, email = 'studente@esempio.it', password = BUONA) {
  const r = await k.chiama('POST', '/v1/registrazione', { email, password });
  assert.equal(r.status, 201, JSON.stringify(r.corpo));
  return r.cookie;
}

test('account: una password piu corta di 15 caratteri e rifiutata, senza regole di composizione', async (t) => {
  // R-ACC-10. NIST SP 800-63B-4: almeno 15, nessuna regola su maiuscole,
  // cifre o simboli. Quindici lettere minuscole bastano.
  const k = await conti(t);
  const corta = await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: 'quattordiciiii' });
  assert.equal(corta.status, 422);
  assert.equal(corta.corpo.errore, 'password');
  assert.equal(corta.corpo.motivo, 'corta');
  assert.match(corta.corpo.messaggio, /15/);
  assert.equal(corta.cookie, null, 'una registrazione rifiutata non apre una sessione');

  const lunga = await k.chiama('POST', '/v1/registrazione', { email: 'b@esempio.it', password: 'x'.repeat(257) });
  assert.equal(lunga.status, 422);
  assert.equal(lunga.corpo.motivo, 'lunga');

  // Si contano i caratteri, non i byte: quindici lettere accentate sono quindici.
  const accenti = await k.chiama('POST', '/v1/registrazione', { email: 'c@esempio.it', password: 'èèèàààòòòùùùìì' });
  assert.equal(accenti.corpo?.motivo, 'corta', '14 caratteri anche se sono 28 byte');

  const semplice = await k.chiama('POST', '/v1/registrazione', { email: 'd@esempio.it', password: 'quindicilettere' });
  assert.equal(semplice.status, 201, 'solo minuscole, nessuna cifra, nessun simbolo: accettata');
});

test('account: una password comune in qualunque maiuscola, o uguale all email, e rifiutata con il perche', async (t) => {
  // R-ACC-25, il rifiuto. La password intera, portata in minuscolo, contro
  // l'elenco; e le parole del contesto: l'email e la sua parte prima della @.
  const k = await conti(t);
  for (const password of ['abcdefghijklmnop', 'AbcDefghIjklmnoP']) {
    const r = await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password });
    assert.equal(r.status, 422, password);
    assert.equal(r.corpo.motivo, 'comune');
    assert.match(r.corpo.messaggio, /pi[uù] usate/);
    assert.match(r.corpo.messaggio, /frase/, 'il rifiuto suggerisce una frase (SHALL dello stesso paragrafo)');
  }
  const email = 'studentepatente1@esempio.it';
  for (const password of [email, email.toUpperCase(), 'studentepatente1', 'StudentePatente1']) {
    const r = await k.chiama('POST', '/v1/registrazione', { email, password });
    assert.equal(r.status, 422, password);
    assert.equal(r.corpo.motivo, 'contesto', password);
  }
  // Contenere una parola comune non basta a rifiutare: si confronta l'intera.
  const r = await k.chiama('POST', '/v1/registrazione', { email, password: 'abcdefghijklmnop e il mare' });
  assert.equal(r.status, 201);
});

test('password comuni: il file e quello che lo script rigenera dalla fonte, e il README lo dichiara', () => {
  // R-ACC-25, il file. Lo script scarica la fonte, ne controlla l'impronta e
  // dichiara quella dell'uscita: il file nel repo deve averla. Rigenerarlo
  // davvero vuole la rete, e si fa con `--verifica`; qui si tiene ferma la
  // catena fonte → script → file → README.
  const script = readFileSync(join(RADICE, 'strumenti', 'password_comuni.py'), 'utf8');
  const dichiarata = script.match(/^USCITA_SHA256 = '([0-9a-f]{64})'/m)?.[1];
  const fonte = script.match(/^FONTE_SHA256 = '([0-9a-f]{64})'/m)?.[1];
  const commit = script.match(/^COMMIT = '([0-9a-f]{40})'/m)?.[1];
  assert.ok(dichiarata && fonte && commit, 'lo script dichiara commit, impronta della fonte e dell uscita');
  const file = readFileSync(join(RADICE, 'server', 'password-comuni.txt'));
  assert.equal(createHash('sha256').update(file).digest('hex'), dichiarata);
  const voci = file.toString('utf8').split('\n').slice(0, -1);
  assert.ok(voci.every((v) => [...v].length >= 15 && v === v.toLowerCase()), 'solo voci da 15, in minuscolo');
  assert.deepEqual(voci, [...new Set(voci)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)), 'ordinate, senza doppioni');
  const readme = readFileSync(join(RADICE, 'README.md'), 'utf8');
  for (const [cosa, valore] of [['il commit', commit], ['l impronta della fonte', fonte], ['l impronta del file', dichiarata]]) {
    assert.ok(readme.includes(valore), `il README dichiara ${cosa}`);
  }
  assert.match(readme, /Copyright \(c\) 2018 Daniel Miessler/, 'la nota MIT di SecLists');
});

test('sessione: vale 30 giorni dall accesso e l uso non la allunga', async (t) => {
  // R-ACC-26. NIST SP 800-63B-4, AAL1: un tempo massimo contato dall'accesso,
  // non dall'ultimo uso. Il trentunesimo giorno la stessa richiesta e' 401.
  const k = await conti(t);
  const r = await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: BUONA });
  assert.equal(r.status, 201);
  for (const parte of ['Path=/', 'Secure', 'HttpOnly', 'SameSite=Strict', 'Max-Age=2592000']) {
    assert.ok(r.setCookie.split('; ').includes(parte), `${parte} in ${r.setCookie}`);
  }
  assert.match(r.cookie, /^__Host-rg=[A-Za-z0-9_-]{43}$/, '32 byte casuali in base64url');
  assert.ok(!/Domain=/i.test(r.setCookie), '__Host- vuole il cookie senza Domain');

  for (const giorno of [1, 10, 29]) {
    k.orologio.t = T0 + giorno * GIORNO;
    assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie: r.cookie })).status, 200, `giorno ${giorno}`);
  }
  k.orologio.t = T0 + 30 * GIORNO - 1000;
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie: r.cookie })).status, 200, 'l ultimo secondo vale');
  k.orologio.t = T0 + 30 * GIORNO + 1000;
  const scaduta = await k.chiama('GET', '/v1/io', undefined, { cookie: r.cookie });
  assert.equal(scaduta.status, 401, 'l uso di ogni giorno non l ha allungata');
  assert.equal(scaduta.corpo.errore, 'sessione');

  // Un nuovo accesso ne apre una nuova, che conta da capo.
  const di_nuovo = await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA });
  assert.equal(di_nuovo.status, 200);
  assert.notEqual(di_nuovo.cookie, r.cookie);
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie: di_nuovo.cookie })).status, 200);
});

test('sessione: uscire chiude questa, ovunque chiude tutte, la password cambiata chiude le altre', async (t) => {
  // §6.3.
  const k = await conti(t);
  const a = await registrato(k, 'a@esempio.it');
  const entra = async () => (await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA })).cookie;
  const vale = async (cookie) => (await k.chiama('GET', '/v1/io', undefined, { cookie })).status === 200;

  const b = await entra();
  const u = await k.chiama('POST', '/v1/uscita', undefined, { cookie: b });
  assert.equal(u.status, 204);
  assert.match(u.setCookie, /Max-Age=0/, 'l uscita toglie anche il cookie');
  assert.equal(await vale(b), false);
  assert.equal(await vale(a), true, 'le altre restano');

  const c = await entra();
  assert.equal((await k.chiama('POST', '/v1/uscita/ovunque', undefined, { cookie: c })).status, 204);
  assert.equal(await vale(a), false);
  assert.equal(await vale(c), false);

  const d = await entra(); const e = await entra();
  const sbagliata = await k.chiama('POST', '/v1/password/cambia', { attuale: 'non e questa, no', nuova: ALTRA }, { cookie: d });
  assert.equal(sbagliata.status, 401);
  const cambia = await k.chiama('POST', '/v1/password/cambia', { attuale: BUONA, nuova: ALTRA }, { cookie: d });
  assert.equal(cambia.status, 200);
  assert.equal(await vale(d), true, 'quella da cui si e cambiata resta');
  assert.equal(await vale(e), false);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: ALTRA })).status, 200);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA })).status, 401);
});

test('accesso: un email inesistente e una password sbagliata danno la stessa risposta', async (t) => {
  // R-ACC-17, §5.3. Stesso codice, stesso corpo, nessun cookie; e per l'email
  // che non esiste si calcola comunque un hash, cosi' la risposta impiega lo
  // stesso tempo. Il conto dei calcoli lo dice il server.
  const k = await conti(t);
  await registrato(k, 'a@esempio.it');
  const prima = k.s.calcoli();
  const sbagliata = await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: ALTRA });
  const dopo1 = k.s.calcoli();
  const inesistente = await k.chiama('POST', '/v1/accesso', { email: 'nessuno@esempio.it', password: ALTRA });
  const dopo2 = k.s.calcoli();

  assert.equal(sbagliata.status, 401);
  assert.equal(inesistente.status, 401);
  assert.deepEqual(inesistente.corpo, sbagliata.corpo);
  assert.equal(sbagliata.setCookie, null);
  assert.equal(inesistente.setCookie, null);
  assert.match(sbagliata.corpo.messaggio, /email o password non corrette/i);
  assert.equal(dopo1 - prima, 1, 'la password sbagliata costa un calcolo');
  assert.equal(dopo2 - dopo1, 1, 'l email inesistente costa lo stesso calcolo');
});

test('accesso: al centesimo fallimento di fila la password si disattiva, finche non arriva una reimpostazione', async (t) => {
  // R-ACC-27. NIST SP 800-63B-4 §3.2.2, deciso dalla regia (§6.5, §20): al
  // piu' 100 tentativi falliti consecutivi, poi la password si disattiva e torna
  // solo con la reimpostazione per email. Le attese dal quinto restano; qui si
  // saltano spostando l'orologio di 16 minuti, oltre l'attesa piu' lunga.
  // E un'email che non esiste si comporta allo stesso modo, codice per codice:
  // altrimenti il limite direbbe chi e' iscritto (§5.3).
  const k = await conti(t);
  await registrato(k, 'a@esempio.it');
  k.mail.length = 0;

  const giro = async (email, { riavviaDopo } = {}) => {
    const codici = [];
    for (let i = 1; i <= 101; i++) {
      k.avanza(16 * 60000);
      codici.push((await k.chiama('POST', '/v1/accesso', { email, password: ALTRA })).status);
      // Il conto di un account vero sta nel database: un riavvio a meta' non
      // regala altri cento tentativi. Quello di un'email che non esiste sta in
      // memoria, e il suo giro non si riavvia (account-progetto.md §6.5).
      if (i === riavviaDopo) await k.riavvia();
    }
    return codici;
  };
  const vero = await giro('a@esempio.it', { riavviaDopo: 60 });
  assert.deepEqual(vero.slice(0, 99), Array(99).fill(401));
  assert.equal(vero[99], 403, 'il centesimo fallimento disattiva');
  assert.equal(vero[100], 403);
  const finto = await giro('nessuno@esempio.it');
  assert.deepEqual(finto, vero, 'un email inesistente da gli stessi codici');

  k.avanza(16 * 60000);
  const giusta = await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA });
  assert.equal(giusta.status, 403, 'disattivata vuol dire anche con la password giusta');
  assert.equal(giusta.corpo.errore, 'password_disattivata');
  assert.match(giusta.corpo.messaggio, /reimpost/);
  assert.equal(giusta.cookie, null);
  assert.deepEqual(k.mail.map((m) => m.a), ['a@esempio.it'], 'il proprietario lo sa da una mail, una sola');

  // E un altro riavvio non la riaccende.
  await k.riavvia();
  const riga = k.s.db.prepare("SELECT password_disattivata_il, accessi_falliti FROM account WHERE email = 'a@esempio.it'").get();
  assert.ok(riga.password_disattivata_il);

  assert.equal((await k.chiama('POST', '/v1/password/dimenticata', { email: 'a@esempio.it' })).status, 202);
  const g = gettone(k.mail.at(-1), 'password');
  const nuova = await k.chiama('POST', '/v1/password/nuova', { gettone: g, password: ALTRA });
  assert.equal(nuova.status, 200);
  assert.ok(nuova.cookie, 'la reimpostazione apre una sessione su questo dispositivo');
  k.avanza(1000);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: 'sbagliata anche questa' })).status, 401,
    'dopo la reimpostazione il conto riparte da zero');
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: ALTRA })).status, 200);
});

test('accesso: dal quinto fallimento di fila un attesa che raddoppia fino a 15 minuti', async (t) => {
  // §6.5, prima riga. Durante l'attesa la password non si guarda nemmeno: 429
  // con Retry-After, e il tentativo non conta. Un accesso riuscito azzera.
  const k = await conti(t);
  await registrato(k, 'a@esempio.it');
  const prova = (password = ALTRA) => k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password });

  for (let i = 0; i < 4; i++) assert.equal((await prova()).status, 401);
  assert.equal((await prova(BUONA)).status, 200, 'quattro sbagliate e una giusta');
  for (let i = 0; i < 5; i++) assert.equal((await prova()).status, 401, 'il conto era ripartito');

  const attese = [];
  for (let i = 0; i < 7; i++) {
    const r = await prova(BUONA);
    assert.equal(r.status, 429);
    assert.equal(r.corpo.errore, 'attendi');
    const s = Number(r.h.get('retry-after'));
    attese.push(s);
    k.avanza(s * 1000);
    assert.equal((await prova()).status, 401);
  }
  assert.deepEqual(attese, [30, 60, 120, 240, 480, 900, 900]);
  const calcoli = k.s.calcoli();
  await prova(BUONA);
  assert.equal(k.s.calcoli(), calcoli, 'durante l attesa non si calcola niente');
});

test('limiti: 30 accessi all ora per indirizzo, 5 registrazioni, 3 mail all ora per destinazione', async (t) => {
  // §6.5. In memoria: si perdono al riavvio, ed e' accettabile.
  const k = await conti(t);
  await registrato(k, 'a@esempio.it', BUONA);
  const ip = '198.51.100.7';
  for (let i = 0; i < 30; i++) {
    const r = await k.chiama('POST', '/v1/accesso', { email: `n${i}@esempio.it`, password: ALTRA }, { ip });
    assert.equal(r.status, 401, `tentativo ${i + 1}`);
  }
  const trentunesimo = await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA }, { ip });
  assert.equal(trentunesimo.status, 429);
  assert.ok(Number(trentunesimo.h.get('retry-after')) > 0);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA }, { ip: '198.51.100.8' })).status, 200,
    'un altro indirizzo no');
  k.avanza(ORA + 1000);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA }, { ip })).status, 200, 'passata l ora');

  const ip2 = '198.51.100.9';
  for (let i = 0; i < 5; i++) {
    assert.equal((await k.chiama('POST', '/v1/registrazione', { email: `r${i}@esempio.it`, password: BUONA }, { ip: ip2 })).status, 201);
  }
  assert.equal((await k.chiama('POST', '/v1/registrazione', { email: 'r5@esempio.it', password: BUONA }, { ip: ip2 })).status, 429);

  // Tre mail all'ora per destinazione: la quarta richiesta risponde 202 come
  // sempre — altrimenti direbbe chi e' iscritto — ma la mail non parte.
  k.mail.length = 0;
  for (let i = 0; i < 4; i++) {
    assert.equal((await k.chiama('POST', '/v1/password/dimenticata', { email: 'a@esempio.it' }, { ip: `203.0.113.${i}` })).status, 202);
  }
  assert.equal(k.mail.length, 3);
});

test('password dimenticata: risponde allo stesso modo per un email iscritta e una no', async (t) => {
  // R-ACC-28, §5.3. Sempre 202, sempre lo stesso corpo; la mail parte solo
  // all'indirizzo iscritto.
  const k = await conti(t);
  await registrato(k, 'a@esempio.it');
  k.mail.length = 0;
  const si = await k.chiama('POST', '/v1/password/dimenticata', { email: 'a@esempio.it' });
  const no = await k.chiama('POST', '/v1/password/dimenticata', { email: 'nessuno@esempio.it' });
  assert.equal(si.status, 202);
  assert.equal(no.status, 202);
  assert.deepEqual(no.corpo, si.corpo);
  assert.match(si.corpo.messaggio, /se l.indirizzo [eè] iscritto/i);
  assert.deepEqual(k.mail.map((m) => m.a), ['a@esempio.it']);
  assert.match(k.mail[0].testo, /https:\/\/rottagiusta\.it\/app#password=/, 'il gettone nel frammento, non nella query (§9.2)');
});

test('registrazione: un email gia registrata risponde 409, senza sessione e senza mail', async (t) => {
  // R-ACC-30, §5.3, deciso dall'autore il 26 settembre 2026: la registrazione
  // lo dice apertamente, come la maggior parte dei siti. Fino a P-11 rispondeva
  // 202 con la stessa frase di un'email nuova e mandava al proprietario una
  // mail «hai gia' un account»: nascosto nella schermata, detto dal codice di
  // risposta. Nessun hash: non c'e' piu' un tempo da pareggiare.
  const k = await conti(t);
  await registrato(k, 'a@esempio.it');
  k.mail.length = 0;
  const calcoli = k.s.calcoli();
  const gia = await k.chiama('POST', '/v1/registrazione', { email: ' A@Esempio.it ', password: ALTRA });
  assert.equal(gia.status, 409);
  assert.equal(gia.corpo.errore, 'email_registrata');
  assert.match(gia.corpo.messaggio, /gi[aà] registrata/);
  assert.match(gia.corpo.messaggio, /accedi/i, 'offre le due strade: accedere');
  assert.match(gia.corpo.messaggio, /reimpost/i, 'o reimpostare la password');
  assert.equal(gia.setCookie, null, 'senza sessione');
  assert.deepEqual(k.mail, [], 'senza mail');
  assert.equal(k.s.calcoli(), calcoli, 'senza hash');
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: ALTRA })).status, 401,
    'la password della seconda registrazione non vale');

  // Il freno che resta (§5.3, §6.5): il 409 conta fra le cinque registrazioni
  // l'ora per indirizzo, altrimenti sarebbe un elenco degli iscritti senza tetto.
  const ip = '198.51.100.20';
  for (let i = 0; i < 5; i++) {
    assert.equal((await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: BUONA }, { ip })).status, 409);
  }
  assert.equal((await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: BUONA }, { ip })).status, 429);
  // E una password rifiutata risponde prima di guardare l'email, e non conta.
  const corta = await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: 'corta' }, { ip: '198.51.100.21' });
  assert.equal(corta.status, 422);
});

test('posta: una mail che il fornitore rifiuta produce un errore dichiarato, mai «ti abbiamo scritto»', async (t) => {
  // R-ACC-21, §9.3. L'account esiste e la sessione pure: niente e' perso, e la
  // schermata dice di riprovare. Il rifiuto finisce nel registro.
  const k = await conti(t, { posta: { invia: async () => { throw new Error('rifiutata dal fornitore: 400'); } } });
  const r = await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: BUONA });
  assert.equal(r.status, 503);
  assert.equal(r.corpo.errore, 'posta');
  assert.doesNotMatch(r.corpo.messaggio, /ti abbiamo scritto/i);
  assert.match(r.corpo.messaggio, /riprov/);
  assert.ok(r.cookie, 'l account c e, e la sessione pure');
  const io = await k.chiama('GET', '/v1/io', undefined, { cookie: r.cookie });
  assert.equal(io.status, 200);
  assert.equal(io.corpo.verificata, false);

  const rinvia = await k.chiama('POST', '/v1/verifica/rinvia', undefined, { cookie: r.cookie });
  assert.equal(rinvia.status, 503);
  assert.equal(rinvia.corpo.errore, 'posta');
  const eventi = k.s.db.prepare("SELECT count(*) n FROM registro WHERE evento = 'mail rifiutata'").get().n;
  assert.equal(eventi, 2);
});

test('verifica: un gettone vale una volta sola e per il suo tempo', async (t) => {
  // R-ACC-29, §9.1. Ventiquattro ore per la verifica (NIST SP 800-63A-4),
  // un'ora per la password; monouso; un gettone nuovo dello stesso scopo annulla
  // i precedenti; uno scaduto non e' un vicolo cieco.
  const k = await conti(t);
  const cookie = await registrato(k, 'a@esempio.it');
  const primo = gettone(k.mail[0], 'verifica');
  assert.ok(primo);
  assert.equal((await k.chiama('POST', '/v1/verifica/rinvia', undefined, { cookie })).status, 202);
  const secondo = gettone(k.mail[1], 'verifica');
  assert.notEqual(secondo, primo);
  assert.equal((await k.chiama('POST', '/v1/verifica', { gettone: primo })).status, 410, 'il nuovo annulla il vecchio');

  k.avanza(24 * ORA - 1000);
  const ok = await k.chiama('POST', '/v1/verifica', { gettone: secondo });
  assert.equal(ok.status, 200);
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo.verificata, true);
  assert.equal((await k.chiama('POST', '/v1/verifica', { gettone: secondo })).status, 410, 'una volta sola');
  assert.equal((await k.chiama('POST', '/v1/verifica', { gettone: 'x'.repeat(43) })).status, 410, 'uno inventato');

  await registrato(k, 'b@esempio.it');
  k.avanza(24 * ORA + 1000);
  const tardi = await k.chiama('POST', '/v1/verifica', { gettone: gettone(k.mail.at(-1), 'verifica') });
  assert.equal(tardi.status, 410);
  assert.match(tardi.corpo.messaggio, /rimand/, 'un link scaduto dice come averne un altro');

  await k.chiama('POST', '/v1/password/dimenticata', { email: 'a@esempio.it' });
  const g = gettone(k.mail.at(-1), 'password');
  k.avanza(ORA + 1000);
  assert.equal((await k.chiama('POST', '/v1/password/nuova', { gettone: g, password: ALTRA })).status, 410, 'un ora per la password');
});

test('verifica: un account non confermato entro sette giorni si cancella con le sue righe', async (t) => {
  // R-ACC-11, la meta' del server (§9.6, §14.3). La data e' nella risposta di
  // /v1/io dal primo momento; la schermata che la scrive e' della pagina.
  const k = await conti(t);
  const cookie = await registrato(k, 'a@esempio.it');
  const confermato = await registrato(k, 'b@esempio.it');
  await k.chiama('POST', '/v1/verifica', { gettone: gettone(k.mail[1], 'verifica') });

  const io = await k.chiama('GET', '/v1/io', undefined, { cookie });
  assert.equal(io.corpo.scade_se_non_verificata, new Date(T0 + 7 * GIORNO).toISOString());
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie: confermato })).corpo.scade_se_non_verificata, null);

  const id = k.s.db.prepare("SELECT id FROM account WHERE email = 'a@esempio.it'").get().id;
  aggiungiRighe(k.s.db, id, [riga(1), riga(2)]);

  k.orologio.t = T0 + 7 * GIORNO - 1000;
  assert.deepEqual((await k.s.manutenzione()).non_confermati, 0, 'l ultimo secondo vale ancora');
  k.orologio.t = T0 + 7 * GIORNO + 1000;
  assert.equal((await k.s.manutenzione()).non_confermati, 1);
  assert.equal(k.s.db.prepare("SELECT count(*) n FROM account WHERE email = 'a@esempio.it'").get().n, 0);
  assert.equal(k.s.db.prepare('SELECT count(*) n FROM riga WHERE account_id = ?').get(id).n, 0, 'con le sue righe');
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie })).status, 401);
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie: confermato })).status, 200, 'il confermato resta');
  const voci = leggiCancellazioni(join(k.c, 'cancellazioni')).voci;
  assert.deepEqual(voci.map((v) => [v.evento, v.account]), [['cancellazione', id]],
    'nel file delle cancellazioni, perche un ripristino non lo riporti');
});

test('segreti: nessuna password, gettone o cookie nel database in chiaro ne nel registro', async (t) => {
  // R-ACC-16, §15.3. Si cercano i valori veri nei byte del database, del WAL
  // e di ogni riga scritta nel log, dopo averli fatti passare tutti.
  const scritto = [];
  const k = await conti(t, { log: (m) => scritto.push(m) });
  const reg = await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: BUONA });
  const verifica = gettone(k.mail[0], 'verifica');
  await k.chiama('POST', '/v1/verifica', { gettone: verifica });
  await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: 'una sbagliata qualunque' });
  const acc = await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA });
  await k.chiama('POST', '/v1/password/dimenticata', { email: 'a@esempio.it' });
  const reimposta = gettone(k.mail.at(-1), 'password');
  const nuova = await k.chiama('POST', '/v1/password/nuova', { gettone: reimposta, password: ALTRA });
  assert.equal(nuova.status, 200);
  await k.chiama('POST', '/v1/password/cambia', { attuale: ALTRA, nuova: 'e poi ancora unaltra' }, { cookie: nuova.cookie });

  const segreti = {
    'la password': BUONA, 'la password sbagliata': 'una sbagliata qualunque', 'la password nuova': ALTRA,
    'la terza password': 'e poi ancora unaltra',
    'il gettone di verifica': verifica, 'il gettone della password': reimposta,
    'il cookie della registrazione': reg.cookie.split('=')[1], 'il cookie dell accesso': acc.cookie.split('=')[1],
    'il cookie della reimpostazione': nuova.cookie.split('=')[1],
  };
  const byte = ['conti.db', 'conti.db-wal'].filter((f) => existsSync(join(k.c, f)))
    .map((f) => readFileSync(join(k.c, f)).toString('latin1')).join('');
  const registro = JSON.stringify(k.s.db.prepare('SELECT * FROM registro').all());
  assert.ok(k.s.db.prepare('SELECT count(*) n FROM registro').get().n >= 6, 'il registro ha gli eventi');
  for (const [nome, valore] of Object.entries(segreti)) {
    assert.ok(valore && valore.length >= 15, nome);
    assert.ok(!byte.includes(valore), `${nome} e nel database`);
    assert.ok(!registro.includes(valore), `${nome} e nel registro`);
    assert.ok(!scritto.join('\n').includes(valore), `${nome} e nel log`);
  }
});

test('password: si salva con Argon2id m=65536 t=2 p=1, e parametri vecchi si rialzano all accesso', async (t) => {
  // §5.1 e §20: i parametri stanno nella stringa PHC, quindi alzarli non chiede
  // una migrazione: all'accesso riuscito una stringa vecchia si ricalcola.
  const k = await conti(t, { argon2: null });
  await registrato(k, 'a@esempio.it');
  const phc = () => k.s.db.prepare("SELECT password FROM account WHERE email = 'a@esempio.it'").get().password;
  assert.match(phc(), /^\$argon2id\$v=19\$m=65536,t=2,p=1\$[A-Za-z0-9+/]{22}\$[A-Za-z0-9+/]{43}$/);

  const vecchia = await hashPassword(BUONA, ECONOMICO);
  assert.match(vecchia, /^\$argon2id\$v=19\$m=1024,t=1,p=1\$/);
  k.s.db.prepare("UPDATE account SET password = ? WHERE email = 'a@esempio.it'").run(vecchia);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA })).status, 200);
  assert.match(phc(), /^\$argon2id\$v=19\$m=65536,t=2,p=1\$/, 'rialzata');
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA })).status, 200);
});

test('origine: una richiesta che cambia qualcosa senza l Origin del sito e rifiutata', async (t) => {
  // §6.4 e §7.3. Il cookie SameSite=Strict, l'Origin esatta, il corpo JSON.
  const k = await conti(t);
  for (const origine of [null, 'https://open-patente-nautica.pages.dev', 'https://rottagiusta.it.esempio.it']) {
    const r = await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: BUONA }, { origine });
    assert.equal(r.status, 403, String(origine));
    assert.equal(r.corpo.errore, 'origine');
  }
  const testo = await fetch(`${k.s.indirizzo}/v1/accesso`, {
    method: 'POST', headers: { origin: ORIGINE, 'content-type': 'text/plain' }, body: '{}',
  });
  assert.equal(testo.status, 415, 'un corpo che non e JSON non evita il preflight');

  const pre = await fetch(`${k.s.indirizzo}/v1/accesso`, {
    method: 'OPTIONS', headers: { origin: ORIGINE, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type' },
  });
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get('access-control-allow-origin'), ORIGINE);
  assert.equal(pre.headers.get('access-control-allow-credentials'), 'true');
  assert.match(pre.headers.get('access-control-allow-headers'), /content-type/i);
  assert.equal(pre.headers.get('vary'), 'Origin');
  const altrove = await fetch(`${k.s.indirizzo}/v1/accesso`, { method: 'OPTIONS', headers: { origin: 'https://altro.esempio.it' } });
  assert.equal(altrove.headers.get('access-control-allow-origin'), null);
  const io = await k.chiama('GET', '/v1/io');
  assert.equal(io.status, 401);
  assert.equal(io.h.get('access-control-allow-origin'), ORIGINE, 'anche le risposte vere portano il CORS');
});

test('database: uno schema 1 si porta all ultimo aggiungendo, senza togliere niente', (t) => {
  // §2.7, regola 3. Le tabelle e le colonne dell'account arrivano con una
  // migrazione additiva; un database nato ieri le prende senza perdere righe.
  const c = cartella(t);
  const p = join(c, 'conti.db');
  const vecchio = new DatabaseSync(p);
  vecchio.exec(MIGRAZIONI[0]);
  vecchio.exec(`INSERT INTO impianto VALUES (1, 'e', 'x', 'x', 0);
    INSERT INTO account (email, password, creato_il, ultimo_accesso_il, chiave_locale) VALUES ('a@esempio.it', '${PHC}', 'x', 'x', 'k');
    PRAGMA user_version = 1;`);
  vecchio.close();
  const db = apri(p); t.after(() => db.close());
  assert.equal(SCHEMA, MIGRAZIONI.length);
  assert.equal(db.prepare('PRAGMA user_version').get().user_version, SCHEMA);
  const a = db.prepare('SELECT email, accessi_falliti, password_disattivata_il FROM account').get();
  assert.deepEqual({ ...a }, { email: 'a@esempio.it', accessi_falliti: 0, password_disattivata_il: null });
  const tabelle = db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table'").all().map((r) => r.name);
  for (const nome of ['sessione', 'gettone', 'registro', 'segnali']) assert.ok(tabelle.includes(nome), nome);

  // E un database nuovo e' identico a uno migrato: una strada sola.
  const nuovo = apri(join(c, 'nuovo.db')); t.after(() => nuovo.close());
  const forma = (d) => d.prepare("SELECT type, name, sql FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' ORDER BY name").all()
    .map((r) => `${r.type} ${r.name} ${r.sql}`);
  assert.deepEqual(forma(nuovo), forma(db));
});

test('registro: gli indirizzi si tolgono dopo sei mesi, gli eventi dopo un anno', async (t) => {
  // §15.3, dalla CNIL: il minimo per l'indirizzo, il massimo per l'evento.
  const k = await conti(t);
  await registrato(k, 'a@esempio.it');
  // Confermato: un account non confermato si cancellerebbe al settimo giorno,
  // e quella cancellazione e' un evento nuovo.
  await k.chiama('POST', '/v1/verifica', { gettone: gettone(k.mail[0], 'verifica') });
  const eventi = () => k.s.db.prepare('SELECT evento, ip FROM registro ORDER BY id').all().map((r) => ({ ...r }));
  assert.ok(eventi().some((e) => e.evento === 'registrazione' && e.ip === '192.0.2.1'));
  k.orologio.t = T0 + 183 * GIORNO;
  await k.s.manutenzione();
  assert.ok(eventi().length > 0 && eventi().every((e) => e.ip === null), 'senza indirizzo dopo sei mesi');
  k.orologio.t = T0 + 366 * GIORNO;
  await k.s.manutenzione();
  assert.deepEqual(eventi(), [], 'nessun evento oltre l anno');
});

// --- le righe e la sincronia (P-10) -------------------------------------------------
//
// docs/account-progetto.md §1, §2.3, §2.7, §7.2, §8. Il server aggiunge per
// `uid` con `validaRiga()` del motore e la banca accanto, numera con un
// cursore che non torna indietro, dice l'epoca in ogni risposta, e rifiuta con
// un 409 un invio della generazione di prima di un azzeramento.

const BANCA = new Set([
  ...JSON.parse(readFileSync(join(RADICE, 'site/dati/quiz.json'), 'utf8')).map((q) => q.id),
  ...JSON.parse(readFileSync(join(RADICE, 'site/dati/carteggio.json'), 'utf8')).map((e) => e.id),
]);

async function dentro(k, email = 'studente@esempio.it') {
  const cookie = await registrato(k, email);
  const io = (await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo;
  return { cookie, io };
}

test('righe: una riga accolta torna dal server byte per byte, campi sconosciuti compresi', async (t) => {
  // R-ACC-12. La forma delle righe la decide la pagina e cresce: il server non
  // la ricostruisce dalle colonne, la restituisce com'e' arrivata (§3).
  const k = await conti(t);
  const { cookie } = await dentro(k);
  const strane = [
    riga(1, { campo_futuro: { annidato: [1, 2.5, null, 'è'], vuoto: {} }, chosen: '2', sim_uid: null }),
    { _t: 'c', uid: 'c1', item_id: '5.1.3-1', ts: '2026-09-26T08:00:00Z', verdict: 1, delta: null,
      input_json: '{"lat":"42°49’,7N","nota":"a capo\\nqui"}' },
    { _t: 'g', uid: 'g1', attempt_uid: 'u000001', tag: 'N' },
  ];
  const inv = await k.chiama('POST', '/v1/righe', { generazione: 1, righe: strane }, { cookie });
  assert.equal(inv.status, 200, JSON.stringify(inv.corpo));
  assert.deepEqual(inv.corpo.nuove, ['u000001', 'c1', 'g1']);
  const ric = await k.chiama('GET', '/v1/righe?dopo=0', undefined, { cookie });
  assert.equal(ric.status, 200);
  assert.deepEqual(ric.corpo.righe.map((r) => JSON.stringify(r)), strane.map((r) => JSON.stringify(r)));
});

test('righe: la risposta nomina gli uid accolti, gia presenti e scartati, con la regola del motore e la banca', async (t) => {
  // R-ACC-13, la meta' del server, e R-ACC-07 sul server vero: la banca
  // accanto, quindi un quesito che non esiste e' rifiutato come lo
  // rifiuterebbe il browser con la banca in mano.
  const k = await conti(t);
  const { cookie, io } = await dentro(k);
  await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(1)] }, { cookie });
  const rotte = [riga(2, { item_id: 'base-99999' }), riga(3, { ts: '2026-09-26T10:00:00' }), { ...riga(4), uid: 7 }];
  const r = await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(1), ...rotte, riga(5)] }, { cookie });
  assert.equal(r.status, 200);
  assert.deepEqual(r.corpo.nuove, ['u000005']);
  assert.deepEqual(r.corpo.gia, ['u000001']);
  assert.deepEqual(r.corpo.scartate, [
    { uid: 'u000002', motivo: validaRiga(rotte[0], { quesiti: BANCA }), indice: 1 },
    { uid: 'u000003', motivo: validaRiga(rotte[1], { quesiti: BANCA }), indice: 2 },
    { uid: null, motivo: 'senza uid', indice: 3 },
  ]);
  assert.equal(r.corpo.scartate[0].motivo, 'quesito sconosciuto');
  assert.equal(r.corpo.epoca, io.epoca, 'l epoca c e in ogni risposta delle righe');
  assert.match(r.corpo.epoca, /^[0-9a-f]{32}$/);
  assert.equal(r.corpo.generazione, 1);
  assert.equal(typeof r.corpo.ultima_seq, 'number');
});

test('righe: una riga arrivata tardi con un ts vecchio compare nella ricezione successiva', async (t) => {
  // R-ACC-14, §2.3. Il cursore e' un numero dato dal server all'arrivo, non
  // `ts`: una risposta data offline il 3 e inviata il 10 ha un `ts` piu'
  // vecchio dell'ultima scaricata, e un cursore su `ts` la salterebbe per
  // sempre, su ogni altro dispositivo, senza un errore.
  const k = await conti(t);
  const { cookie } = await dentro(k);
  await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(1, { ts: '2026-10-10T09:00:00+02:00' })] }, { cookie });
  const portatile = (await k.chiama('GET', '/v1/righe?dopo=0', undefined, { cookie })).corpo.ultima_seq;
  const tardiva = riga(2, { ts: '2026-10-03T18:00:00+02:00' });
  await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [tardiva] }, { cookie });
  const r = await k.chiama('GET', `/v1/righe?dopo=${portatile}`, undefined, { cookie });
  assert.deepEqual(r.corpo.righe, [tardiva]);
  assert.ok(r.corpo.ultima_seq > portatile);
});

test('righe: la ricezione va a pagine di 5000, e insieme non perde e non ripete', async (t) => {
  const k = await conti(t);
  const { cookie } = await dentro(k);
  const id = k.s.db.prepare("SELECT id FROM account WHERE email = 'studente@esempio.it'").get().id;
  aggiungiRighe(k.s.db, id, Array.from({ length: 5003 }, (_, i) => riga(i)));
  const p1 = (await k.chiama('GET', '/v1/righe?dopo=0', undefined, { cookie })).corpo;
  assert.equal(p1.righe.length, 5000);
  assert.equal(p1.altre, true);
  const p2 = (await k.chiama('GET', `/v1/righe?dopo=${p1.ultima_seq}`, undefined, { cookie })).corpo;
  assert.equal(p2.righe.length, 3);
  assert.equal(p2.altre, false);
  const uid = [...p1.righe, ...p2.righe].map((r) => r.uid);
  assert.equal(new Set(uid).size, 5003);
  const p3 = (await k.chiama('GET', `/v1/righe?dopo=${p2.ultima_seq}`, undefined, { cookie })).corpo;
  assert.deepEqual([p3.righe, p3.altre, p3.ultima_seq], [[], false, p2.ultima_seq]);

  for (const dopo of ['-1', 'abc', '1.5']) {
    const r = await k.chiama('GET', `/v1/righe?dopo=${dopo}`, undefined, { cookie });
    assert.equal(r.status, 422, dopo);
    assert.ok(r.corpo.messaggio.length > 10);
  }
});

test('righe: oltre 2000 righe o 2 MiB la risposta e 413, e niente entra', async (t) => {
  const k = await conti(t);
  const { cookie } = await dentro(k);
  const troppe = await k.chiama('POST', '/v1/righe', { generazione: 1, righe: Array.from({ length: 2001 }, (_, i) => riga(i)) }, { cookie });
  assert.equal(troppe.status, 413);
  assert.match(troppe.corpo.messaggio, /2\.?000/);
  const pesanti = Array.from({ length: 700 }, (_, i) => riga(i, { input_json: 'x'.repeat(3500) }));
  const grosso = await k.chiama('POST', '/v1/righe', { generazione: 1, righe: pesanti }, { cookie });
  assert.equal(grosso.status, 413);
  assert.equal(k.s.db.prepare('SELECT count(*) n FROM riga').get().n, 0);
  // E il lotto che il motore prepara, con gli stessi limiti, passa.
  const lotto = E.lottoDaInviare(pesanti, E.nuovaCoda({ generazione: 1, righe: pesanti }));
  const ok = await k.chiama('POST', '/v1/righe', lotto, { cookie });
  assert.equal(ok.status, 200, JSON.stringify(ok.corpo).slice(0, 200));
  assert.equal(ok.corpo.nuove.length, lotto.righe.length);
});

test('righe: senza sessione 401, e un account non vede e non tocca le righe di un altro', async (t) => {
  // §3: la chiave e' (account, uid). Lo stesso uid in due archivi sono due righe.
  const k = await conti(t);
  const a = await dentro(k, 'a@esempio.it');
  const b = await dentro(k, 'b@esempio.it');
  assert.equal((await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(1)] })).status, 401);
  assert.equal((await k.chiama('GET', '/v1/righe?dopo=0')).status, 401);
  assert.equal((await k.chiama('GET', '/v1/esporta')).status, 401);
  await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(1, { correct: 1 })] }, { cookie: a.cookie });
  const diB = await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(1, { correct: 0 })] }, { cookie: b.cookie });
  assert.deepEqual(diB.corpo.nuove, ['u000001'], 'per b e una riga nuova');
  assert.equal((await k.chiama('GET', '/v1/righe?dopo=0', undefined, { cookie: a.cookie })).corpo.righe[0].correct, 1);
  assert.equal((await k.chiama('GET', '/v1/righe?dopo=0', undefined, { cookie: b.cookie })).corpo.righe[0].correct, 0);
  // E un invio senza generazione, o senza righe, si rifiuta dicendo perche'.
  for (const corpo of [{ righe: [riga(2)] }, { generazione: 1 }, { generazione: '1', righe: [] }]) {
    const r = await k.chiama('POST', '/v1/righe', corpo, { cookie: a.cookie });
    assert.equal(r.status, 422, JSON.stringify(corpo));
    assert.ok(r.corpo.messaggio.length > 10);
  }
});

test('azzera: dopo un azzeramento un invio con la generazione vecchia e rifiutato, e le sue righe non rientrano', async (t) => {
  // R-ACC-15, §8.4. Senza la generazione, un telefono rimasto in un cassetto
  // rimanderebbe alla prima connessione tutte le righe cancellate: una
  // cancellazione che non cancella, senza un errore. E il riavvio in mezzo: la
  // generazione sta nel database, non in memoria.
  const k = await conti(t);
  const { cookie } = await dentro(k);
  const vecchie = Array.from({ length: 20 }, (_, i) => riga(i));
  await k.chiama('POST', '/v1/righe', { generazione: 1, righe: vecchie }, { cookie });

  const sbagliata = await k.chiama('POST', '/v1/azzera', { password: ALTRA }, { cookie });
  assert.equal(sbagliata.status, 401, 'azzerare chiede la password');
  assert.equal(k.s.db.prepare('SELECT count(*) n FROM riga').get().n, 20, 'e con quella sbagliata non tocca niente');

  k.avanza(60000);
  const az = await k.chiama('POST', '/v1/azzera', { password: BUONA }, { cookie });
  assert.equal(az.status, 200, JSON.stringify(az.corpo));
  assert.equal(az.corpo.generazione, 2);
  assert.equal(az.corpo.azzerato_il, new Date(T0 + 60000).toISOString(), 'con l orologio del server');
  assert.equal(az.corpo.righe, 0);
  const file = leggiCancellazioni(join(k.c, 'cancellazioni')).voci;
  assert.deepEqual(file.map((v) => [v.evento, v.generazione]), [['azzeramento', 2]], 'anche nel file, per il ripristino (§2.7)');

  await k.riavvia();
  const cassetto = await k.chiama('POST', '/v1/righe', { generazione: 1, righe: vecchie }, { cookie });
  assert.equal(cassetto.status, 409);
  assert.equal(cassetto.corpo.errore, 'generazione');
  assert.equal(cassetto.corpo.generazione, 2);
  assert.equal(cassetto.corpo.azzerato_il, az.corpo.azzerato_il);
  assert.match(cassetto.corpo.epoca, /^[0-9a-f]{32}$/);
  assert.match(cassetto.corpo.messaggio, /azzerat/);
  assert.equal(k.s.db.prepare('SELECT count(*) n FROM riga').get().n, 0, 'le righe azzerate non rientrano');

  const ric = await k.chiama('GET', '/v1/righe?dopo=0', undefined, { cookie });
  assert.equal(ric.corpo.generazione, 2, 'anche chi riceve soltanto scopre l azzeramento');
  assert.deepEqual(ric.corpo.righe, []);
  assert.equal((await k.chiama('POST', '/v1/righe', { generazione: 2, righe: [riga(100)] }, { cookie })).status, 200);
  const io = (await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo;
  assert.deepEqual([io.generazione, io.righe, io.azzerato_il], [2, 1, az.corpo.azzerato_il]);
});

test('righe: cursore, generazione ed epoca vivono nel database, e un riavvio non li cambia', async (t) => {
  // Lo stato che potrebbe vivere in memoria, e non deve: un cursore che dopo
  // un riavvio ripartisse da un numero gia' dato sarebbe il ripristino del
  // §2.7 senza un ripristino, e senza un'epoca nuova che lo dica.
  const k = await conti(t);
  const { cookie } = await dentro(k);
  const a = await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(1), riga(2)] }, { cookie });
  const cursore = (await k.chiama('GET', '/v1/righe?dopo=0', undefined, { cookie })).corpo.ultima_seq;
  await k.riavvia();
  const b = await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(3)] }, { cookie });
  assert.equal(b.corpo.epoca, a.corpo.epoca, 'un riavvio non e un ripristino');
  const dopo = (await k.chiama('GET', `/v1/righe?dopo=${cursore}`, undefined, { cookie })).corpo;
  assert.deepEqual(dopo.righe.map((r) => r.uid), ['u000003']);
  assert.ok(dopo.ultima_seq > cursore);
});

test('esporta: il file dal server si ricarica con importa e da le stesse righe', async (t) => {
  // R-ACC-18, §7.2. La portabilita' dell'art. 20 senza una riga nuova dal lato
  // di chi riceve: e' il file di `esporta()`, e lo legge `importa()`, cioe'
  // `fondiArchivio()`. Si scarica dal server, non dalla memoria della pagina:
  // chiude per chi ha un account il difetto della 0.19.2, due schede aperte e
  // un export con 95 righe su 101.
  const k = await conti(t);
  const { cookie } = await dentro(k);
  const mie = [...Array.from({ length: 30 }, (_, i) => riga(i)), { _t: 'g', uid: 'g1', attempt_uid: 'u000001', tag: 'L', ts: '2026-09-26T10:01:00+02:00' }];
  await k.chiama('POST', '/v1/righe', { generazione: 1, righe: mie }, { cookie });
  const r = await fetch(`${k.s.indirizzo}/v1/esporta`, { headers: { cookie, origin: ORIGINE } });
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-disposition'), /^attachment; filename="rotta-giusta-progressi-2026-10-01\.json"$/);
  const file = await r.json();
  assert.equal(file.app, 'rotta-giusta');
  assert.equal(file.versione, VERSION);
  assert.ok(Array.isArray(file.righe));
  const vuoto = E.fondiArchivio([], file.righe);
  assert.deepEqual([vuoto.nuove, vuoto.gia, vuoto.scartate], [31, 0, 0]);
  assert.deepEqual(vuoto.righe, mie);
  const pieno = E.fondiArchivio(mie, file.righe);
  assert.deepEqual([pieno.nuove, pieno.gia, pieno.scartate], [0, 31, 0]);
});

test('epoca: con la contabilita del motore, dopo un ripristino le righe perse tornano e ogni dispositivo le riceve', async (t) => {
  // R-ACC-24 per intero: il server (l'epoca che cambia con il ripristino) e il
  // client (la contabilita' della coda nel motore, che la vede cambiare,
  // azzera il cursore e rimanda tutto). Tre dispositivi dello stesso account,
  // ognuno con il suo archivio e la sua coda, contro il server vero: dopo il
  // ripristino due scoprono l'epoca nuova inviando, il terzo solo ricevendo.
  const k = await conti(t);
  const { cookie, io } = await dentro(k);

  const dispositivo = () => ({ righe: [], coda: E.nuovaCoda({ generazione: io.generazione }) });
  const invia = async (d) => {
    for (;;) {
      const lotto = E.lottoDaInviare(d.righe, d.coda);
      if (!lotto) return;
      const r = await k.chiama('POST', '/v1/righe', lotto, { cookie });
      const e = E.dopoInvio(d.coda, lotto, { codice: r.status, corpo: r.corpo }, d.righe);
      d.coda = e.coda;
      if (r.status !== 200) return;
    }
  };
  const ricevi = async (d) => {
    for (let giri = 0; giri < 10; giri++) {
      const r = await k.chiama('GET', `/v1/righe?dopo=${d.coda.cursore}`, undefined, { cookie });
      const e = E.dopoRicezione(d.coda, { codice: r.status, corpo: r.corpo }, d.righe);
      d.righe = E.fondiArchivio(d.righe, e.righe).righe;
      d.coda = e.coda;
      if (!e.continua) return;
    }
  };
  const rispondi = (d, n) => { const r = riga(n); d.righe.push(r); d.coda = E.accoda(d.coda, r.uid); };
  const sincronizza = async (d) => { await invia(d); await ricevi(d); await invia(d); };

  const telefono = dispositivo(), portatile = dispositivo(), tablet = dispositivo();
  for (let i = 0; i < 40; i++) rispondi(telefono, i);
  await sincronizza(telefono);
  await sincronizza(portatile);
  assert.equal(portatile.righe.length, 40);

  // La copia, con il servizio fermo; poi il servizio riparte.
  await k.s.chiudi();
  copia(k.opzioni.db, join(k.c, 'copia.db'));
  k.s = await avvia(k.opzioni);

  // Dopo la copia il telefono risponde a cinque, il server le accoglie, il
  // telefono le toglie dalla coda. Il portatile le riceve e avanza il cursore.
  for (let i = 500; i < 505; i++) rispondi(telefono, i);
  await sincronizza(telefono);
  assert.deepEqual(telefono.coda.daInviare, []);
  await sincronizza(portatile);
  assert.equal(portatile.righe.length, 45);
  await sincronizza(tablet);
  assert.equal(tablet.righe.length, 45);

  // Il disastro, e il ripristino dalla copia, a servizio fermo.
  await k.s.chiudi();
  for (const s of ['', '-wal', '-shm']) rmSync(k.opzioni.db + s, { force: true });
  ripristina(join(k.c, 'copia.db'), k.opzioni.db, { cancellazioni: k.opzioni.cancellazioni });
  k.s = await avvia(k.opzioni);
  assert.equal(k.s.db.prepare('SELECT count(*) n FROM riga').get().n, 40, 'la copia ha perso le cinque');

  // Tutti e due rispondono a una domanda nuova prima di collegarsi, cosi' il
  // cambio d'epoca lo scopre prima un invio che una ricezione: le righe nuove
  // prendono numeri che l'altro dispositivo ha gia' superato. Il telefono si
  // collega per primo: e' lui ad avere le cinque perse. (Con il solo portatile
  // che rispondeva, un invio che ignorava l'epoca passava verde: il telefono
  // la scopriva ricevendo. Trovato rompendolo apposta.)
  rispondi(portatile, 900);
  rispondi(telefono, 901);
  await sincronizza(telefono);
  await sincronizza(portatile);
  await sincronizza(telefono);
  // Il tablet non ha niente da mandare: l'epoca la vede solo ricevendo, con un
  // cursore che il database ripristinato ha gia' superato.
  await sincronizza(tablet);

  const sulServer = new Set(k.s.db.prepare('SELECT uid FROM riga').all().map((r) => r.uid));
  const attese = [...Array.from({ length: 40 }, (_, i) => riga(i).uid), ...[500, 501, 502, 503, 504, 900, 901].map((n) => riga(n).uid)];
  assert.deepEqual([...sulServer].sort(), [...attese].sort(), 'le cinque perse tornano dal telefono');
  assert.deepEqual(telefono.righe.map((r) => r.uid).sort(), [...attese].sort(), 'il telefono riceve la nuova del portatile');
  assert.deepEqual(portatile.righe.map((r) => r.uid).sort(), [...attese].sort());
  assert.deepEqual(tablet.righe.map((r) => r.uid).sort(), [...attese].sort(), 'chi solo riceve riceve tutto');
  assert.deepEqual([telefono.coda.daInviare, portatile.coda.daInviare, tablet.coda.daInviare], [[], [], []]);
});

// --- il pezzo che chiude le rotte (P-11) -------------------------------------------
//
// docs/account-progetto.md §5.3, §7.1, §9.3, §13, §14, §15.4. Il cambio
// d'indirizzo, il profilo con la data d'esame e i punteggi dei Segnali, la
// cancellazione che cancella davvero, i due anni di inattivita', e gli allarmi
// al titolare letti dal registro. Tutto lo stato che conta sta nel database, e
// dove potrebbe vivere in memoria il test riavvia il server a meta'.

const confermato = async (k, email) => {
  const cookie = await registrato(k, email);
  const m = k.mail.filter((x) => x.a === email).at(-1);
  assert.equal((await k.chiama('POST', '/v1/verifica', { gettone: gettone(m, 'verifica') })).status, 200);
  return cookie;
};
const idDi = (k, email) => k.s.db.prepare('SELECT id FROM account WHERE email = ?').get(email)?.id;
const bytesDel = (k) => ['conti.db', 'conti.db-wal'].filter((f) => existsSync(join(k.c, f)))
  .map((f) => readFileSync(join(k.c, f)).toString('latin1')).join('');

test('email: l indirizzo cambia solo quando il nuovo conferma, il vecchio riceve l avviso, e una password nuova annulla la richiesta', async (t) => {
  // R-ACC-34, §7.1, §6.3, §9.1, §9.6. Chiede la password e un indirizzo gia'
  // confermato; al nuovo parte un link che vale 24 ore, al vecchio un avviso;
  // le sessioni restano. Cambiare la password — il rimedio che l'avviso
  // suggerisce a chi non l'ha chiesto — rende il link inutile.
  const k = await conti(t);
  const nonConfermato = await registrato(k, 'n@esempio.it');
  const non = await k.chiama('POST', '/v1/email/cambia', { password: BUONA, nuova: 'n2@esempio.it' }, { cookie: nonConfermato });
  assert.equal(non.status, 403, 'prima si conferma l indirizzo che si ha (§9.6)');
  assert.equal(non.corpo.errore, 'non_confermata');

  const cookie = await confermato(k, 'a@esempio.it');
  await registrato(k, 'b@esempio.it');
  k.mail.length = 0;
  const cambia = (corpo) => k.chiama('POST', '/v1/email/cambia', corpo, { cookie });
  assert.equal((await cambia({ password: BUONA, nuova: 'non-una-email' })).status, 422);
  assert.equal((await cambia({ password: BUONA, nuova: ' A@esempio.it' })).status, 422, 'uguale a quello di adesso');
  assert.equal((await cambia({ password: ALTRA, nuova: 'nuovo@esempio.it' })).status, 401, 'chiede la password');
  const presa = await cambia({ password: BUONA, nuova: 'b@esempio.it' });
  assert.equal(presa.status, 409);
  assert.equal(presa.corpo.errore, 'email_registrata');
  assert.deepEqual(k.mail, []);

  const ok = await cambia({ password: BUONA, nuova: ' Nuovo@Esempio.it ' });
  assert.equal(ok.status, 202, JSON.stringify(ok.corpo));
  assert.match(ok.corpo.messaggio, /nuovo@esempio\.it/);
  assert.deepEqual(k.mail.map((m) => m.a).sort(), ['a@esempio.it', 'nuovo@esempio.it']);
  const alNuovo = k.mail.find((m) => m.a === 'nuovo@esempio.it');
  const alVecchio = k.mail.find((m) => m.a === 'a@esempio.it');
  const g = gettone(alNuovo, 'email');
  assert.ok(g, 'il link al nuovo indirizzo, nel frammento');
  assert.match(alVecchio.testo, /nuovo@esempio\.it/, 'l avviso al vecchio dice verso dove');
  assert.match(alVecchio.testo, /password/, 'e che cosa fare se non l hai chiesto');
  assert.equal(gettone(alVecchio, 'email'), undefined, 'il vecchio non riceve il link');
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo.email, 'a@esempio.it', 'finche non conferma, niente cambia');

  // Il gettone si riavvia con il server: sta nel database.
  await k.riavvia();
  const conf = await k.chiama('POST', '/v1/email/conferma', { gettone: g });
  assert.equal(conf.status, 200, JSON.stringify(conf.corpo));
  assert.equal(conf.corpo.email, 'nuovo@esempio.it');
  assert.equal(conf.corpo.verificata, true);
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo.email, 'nuovo@esempio.it', 'la sessione resta (§6.3)');
  assert.equal((await k.chiama('POST', '/v1/email/conferma', { gettone: g })).status, 410, 'una volta sola');
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'nuovo@esempio.it', password: BUONA })).status, 200);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'a@esempio.it', password: BUONA })).status, 401);
  // L'indirizzo lasciato e' libero.
  assert.equal((await k.chiama('POST', '/v1/registrazione', { email: 'a@esempio.it', password: BUONA }, { ip: '192.0.2.50' })).status, 201);

  // Un link che scade dopo 24 ore; e uno che una password nuova annulla.
  k.mail.length = 0;
  await k.chiama('POST', '/v1/email/cambia', { password: BUONA, nuova: 'terzo@esempio.it' }, { cookie });
  const tardi = gettone(k.mail.find((m) => m.a === 'terzo@esempio.it'), 'email');
  k.avanza(24 * ORA + 1000);
  assert.equal((await k.chiama('POST', '/v1/email/conferma', { gettone: tardi })).status, 410, '24 ore');
  k.mail.length = 0;
  await k.chiama('POST', '/v1/email/cambia', { password: BUONA, nuova: 'quarto@esempio.it' }, { cookie });
  const annullato = gettone(k.mail.find((m) => m.a === 'quarto@esempio.it'), 'email');
  assert.equal((await k.chiama('POST', '/v1/password/cambia', { attuale: BUONA, nuova: ALTRA }, { cookie })).status, 200);
  assert.equal((await k.chiama('POST', '/v1/email/conferma', { gettone: annullato })).status, 410,
    'chi ha cambiato la password dopo l avviso ha chiuso la richiesta');

  // Un indirizzo preso da qualcun altro fra la richiesta e la conferma.
  k.mail.length = 0;
  await k.chiama('POST', '/v1/email/cambia', { password: ALTRA, nuova: 'conteso@esempio.it' }, { cookie });
  const conteso = gettone(k.mail.find((m) => m.a === 'conteso@esempio.it'), 'email');
  await registrato(k, 'conteso@esempio.it');
  const tardivo = await k.chiama('POST', '/v1/email/conferma', { gettone: conteso });
  assert.equal(tardivo.status, 409);
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo.email, 'nuovo@esempio.it');
  const registro = JSON.stringify(k.s.db.prepare('SELECT * FROM registro').all());
  assert.ok(!registro.includes('nuovo@esempio.it') && !registro.includes('conteso@'), 'nessuna email nel registro (§15.3)');
});

test('profilo: la data d esame facoltativa e i punteggi dei Segnali fusi con il massimo, e l export li porta', async (t) => {
  // R-ACC-35, §13. La data e' una data vera o niente; i punteggi si fondono con
  // il massimo, sia `migliore` sia `giocate`, cosi' rimandarli non cambia niente
  // — `importa()` oggi somma le partite, e il server non eredita il difetto.
  // Un invio con un campo rotto non scrive niente, nemmeno i campi buoni.
  const k = await conti(t);
  const { cookie } = await dentro(k);
  const profilo = (corpo) => k.chiama('PUT', '/v1/profilo', corpo, { cookie });
  assert.equal((await k.chiama('PUT', '/v1/profilo', { data_esame: '2026-11-20' })).status, 401);

  let r = await profilo({ data_esame: '2026-11-20' });
  assert.equal(r.status, 200, JSON.stringify(r.corpo));
  assert.equal(r.corpo.data_esame, '2026-11-20');
  assert.deepEqual(r.corpo.segnali, {});
  for (const data of ['2026-02-30', '20/11/2026', '2026-11-20T10:00:00Z', 20261120, '']) {
    const no = await profilo({ data_esame: data });
    assert.equal(no.status, 422, JSON.stringify(data));
    assert.equal(no.corpo.errore, 'data_esame');
  }
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo.data_esame, '2026-11-20', 'un rifiuto non tocca niente');

  r = await profilo({ segnali: { notturni: { migliore: 7, giocate: 3 } } });
  assert.equal(r.corpo.data_esame, '2026-11-20', 'un campo assente resta com era');
  assert.deepEqual(r.corpo.segnali, { notturni: { migliore: 7, giocate: 3 } });
  r = await profilo({ segnali: { notturni: { migliore: 5, giocate: 2 }, diurni: { migliore: 4, giocate: 1 } } });
  assert.deepEqual(r.corpo.segnali, { notturni: { migliore: 7, giocate: 3 }, diurni: { migliore: 4, giocate: 1 } });
  const dinuovo = await profilo({ segnali: { notturni: { migliore: 7, giocate: 3 }, diurni: { migliore: 4, giocate: 1 } } });
  assert.deepEqual(dinuovo.corpo.segnali, r.corpo.segnali, 'rimandare gli stessi valori non cambia niente');

  for (const segnali of [
    { boh: { migliore: 1, giocate: 1 } },
    { notturni: { migliore: E.lunghezzaPartita('notturni') + 1, giocate: 1 } },
    { notturni: { migliore: -1, giocate: 1 } },
    { notturni: { migliore: 1.5, giocate: 1 } },
    { notturni: { migliore: 1 } },
    [1, 2],
  ]) {
    const no = await profilo({ data_esame: null, segnali });
    assert.equal(no.status, 422, JSON.stringify(segnali));
    assert.equal(no.corpo.errore, 'segnali');
  }
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo.data_esame, '2026-11-20',
    'la data resta: l invio con i segnali rotti non ha scritto niente');

  r = await profilo({ data_esame: null });
  assert.equal(r.corpo.data_esame, null, 'null la toglie: senza data il motore non inventa quota (R-STA-01)');

  await k.riavvia();
  const io = (await k.chiama('GET', '/v1/io', undefined, { cookie })).corpo;
  assert.deepEqual(io.segnali, { notturni: { migliore: 7, giocate: 3 }, diurni: { migliore: 4, giocate: 1 } }, 'nel database');
  const file = (await k.chiama('GET', '/v1/esporta', undefined, { cookie })).corpo;
  assert.deepEqual(file.segPunti, io.segnali, 'l export porta i punteggi nella forma di esporta() della pagina');
});

test('cancellazione: DELETE /v1/account toglie tutto, anche dai byte del file, e un ripristino da una copia di prima non lo riporta', async (t) => {
  // R-ACC-19, §14.1 e §14.4. Con la password; righe, sessioni, gettoni,
  // segnali e account in una transazione, passando prima dal file delle
  // cancellazioni (§2.7); una mail lo conferma; il registro tiene l'evento
  // senza l'email. «Cancella davvero» si misura sui byte del database e del WAL.
  const k = await conti(t);
  const email = 'da.cancellare.qui@esempio.it';
  const cookie = await confermato(k, email);
  const altro = await confermato(k, 'resta@esempio.it');
  const segno = 'segno-unico-da-ritrovare-7c1f9e';
  await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(1, { nota: segno }), riga(2)] }, { cookie });
  await k.chiama('POST', '/v1/righe', { generazione: 1, righe: [riga(3)] }, { cookie: altro });
  await k.chiama('PUT', '/v1/profilo', { data_esame: '2026-12-01', segnali: { nebbia: { migliore: 3, giocate: 9 } } }, { cookie });
  await k.chiama('POST', '/v1/email/cambia', { password: BUONA, nuova: 'in.sospeso.qui@esempio.it' }, { cookie });
  const id = idDi(k, email);
  // Una copia di prima, con il servizio acceso.
  copia(k.opzioni.db, join(k.c, 'copia.db'));

  const sbagliata = await k.chiama('DELETE', '/v1/account', { password: ALTRA }, { cookie });
  assert.equal(sbagliata.status, 401);
  assert.ok(idDi(k, email), 'con la password sbagliata non tocca niente');

  k.mail.length = 0;
  const via = await k.chiama('DELETE', '/v1/account', { password: BUONA }, { cookie });
  assert.equal(via.status, 204);
  assert.match(via.setCookie, /Max-Age=0/);
  assert.equal((await k.chiama('GET', '/v1/io', undefined, { cookie })).status, 401);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email, password: BUONA })).status, 401);
  for (const tabella of ['account', 'riga', 'sessione', 'gettone', 'segnali']) {
    const col = tabella === 'account' ? 'id' : 'account_id';
    assert.equal(k.s.db.prepare(`SELECT count(*) n FROM ${tabella} WHERE ${col} = ?`).get(id).n, 0, tabella);
  }
  assert.equal(k.s.db.prepare('SELECT count(*) n FROM riga').get().n, 1, 'le righe degli altri restano');
  assert.deepEqual(k.mail.map((m) => m.a), [email], 'una mail conferma che e successo');
  assert.match(k.mail[0].testo, /30 giorni/, 'e dice quando sparisce dalle copie (§14.4)');
  assert.ok(k.s.db.prepare("SELECT 1 FROM registro WHERE evento = 'account cancellato' AND account_id = ?").get(id));
  const file = leggiCancellazioni(k.opzioni.cancellazioni).voci;
  assert.deepEqual(file.map((v) => [v.evento, v.account]), [['cancellazione', id]]);

  const byte = bytesDel(k);
  for (const [cosa, valore] of [['l email', email], ['l email in sospeso', 'in.sospeso.qui@esempio.it'], ['una riga', segno]]) {
    assert.ok(!byte.includes(valore), `${cosa} e ancora nei byte del database`);
  }

  // Il ripristino da una copia di prima non la riporta.
  await k.s.chiudi();
  for (const s of ['', '-wal', '-shm']) rmSync(k.opzioni.db + s, { force: true });
  const r = ripristina(join(k.c, 'copia.db'), k.opzioni.db, { cancellazioni: k.opzioni.cancellazioni });
  assert.deepEqual(r.ricancellati, [id]);
  k.s = await avvia(k.opzioni);
  assert.equal(idDi(k, email), undefined);
  assert.equal(k.s.db.prepare('SELECT count(*) n FROM riga WHERE account_id = ?').get(id).n, 0);
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'resta@esempio.it', password: BUONA })).status, 200);
  // E l'indirizzo e' libero.
  assert.equal((await k.chiama('POST', '/v1/registrazione', { email, password: BUONA }, { ip: '192.0.2.60' })).status, 201);
});

test('inattivita: a 700 giorni un avviso con la data, a 730 senza attivita si cancella, e un accesso lo salva', async (t) => {
  // R-ACC-36, §14.2, l'ADR-003. L'avviso parte trenta giorni prima e porta la
  // data; la cancellazione passa dal file del §2.7. Il segno dell'avviso sta
  // nel database: un riavvio non ne manda un secondo e non lo dimentica.
  const k = await conti(t);
  await confermato(k, 'a@esempio.it');
  await confermato(k, 'b@esempio.it');
  const a = idDi(k, 'a@esempio.it');
  aggiungiRighe(k.s.db, a, [riga(1), riga(2)]);
  k.mail.length = 0;

  k.orologio.t = T0 + 699 * GIORNO;
  assert.equal((await k.s.manutenzione()).avvisi_inattivita, 0);
  k.orologio.t = T0 + 700 * GIORNO + ORA;
  assert.equal((await k.s.manutenzione()).avvisi_inattivita, 2);
  assert.deepEqual(k.mail.map((m) => m.a).sort(), ['a@esempio.it', 'b@esempio.it']);
  assert.match(k.mail[0].testo, /30 settembre 2028/, 'la data della cancellazione');
  assert.match(k.mail[0].testo, /https:\/\/rottagiusta\.it\/app/, 'per tenerle basta entrare');
  assert.match(k.mail[0].testo, /scaric/, 'e il file dei progressi da scaricare prima');

  await k.riavvia();
  k.orologio.t = T0 + 701 * GIORNO;
  assert.equal((await k.s.manutenzione()).avvisi_inattivita, 0, 'un avviso solo, anche dopo un riavvio');
  assert.equal(k.mail.length, 2);

  // b rientra dopo l'avviso: e' attivita', e l'avviso decade.
  k.orologio.t = T0 + 710 * GIORNO;
  assert.equal((await k.chiama('POST', '/v1/accesso', { email: 'b@esempio.it', password: BUONA })).status, 200);

  k.orologio.t = T0 + 730 * GIORNO;
  assert.equal((await k.s.manutenzione()).cancellati_inattivita, 0, 'trenta giorni dall avviso, non meno');
  k.orologio.t = T0 + 730 * GIORNO + 2 * ORA;
  assert.equal((await k.s.manutenzione()).cancellati_inattivita, 1);
  assert.equal(idDi(k, 'a@esempio.it'), undefined);
  assert.equal(k.s.db.prepare('SELECT count(*) n FROM riga WHERE account_id = ?').get(a).n, 0, 'con le sue righe');
  assert.ok(idDi(k, 'b@esempio.it'), 'chi e rientrato resta');
  assert.deepEqual(leggiCancellazioni(k.opzioni.cancellazioni).voci.map((v) => [v.evento, v.account]), [['cancellazione', a]]);
  assert.ok(!bytesDel(k).includes('a@esempio.it'), 'anche questa cancella davvero');

  // E b, rientrato al giorno 710, riceve il prossimo avviso settecento giorni dopo, non prima.
  k.orologio.t = T0 + 1400 * GIORNO;
  assert.equal((await k.s.manutenzione()).avvisi_inattivita, 0);
  k.orologio.t = T0 + 1410 * GIORNO + ORA;
  assert.equal((await k.s.manutenzione()).avvisi_inattivita, 1);
});

test('allarmi: accessi falliti oltre soglia, una copia con meno righe e una mail rifiutata avvisano il titolare, una volta sola', async (t) => {
  // R-ACC-37, §15.4. Letti dalla tabella registro, non da un contatore in
  // memoria: un riavvio non ripete un allarme e non ne perde uno. La mail al
  // titolare dice che cosa e quanto, senza email e senza indirizzi IP, che
  // restano sulla macchina (§15.4: la casella del titolare puo' essere fuori UE).
  let rifiuta = false;
  const mail = [];
  const posta = { invia: async (m) => { if (rifiuta) throw new Error('rifiutata dal fornitore: 400'); mail.push(m); } };
  const k = await conti(t, { posta });
  const cookie = await registrato(k, 'a@esempio.it');
  const alTitolare = () => mail.filter((m) => m.a === TITOLARE);
  assert.deepEqual((await k.s.allarmi()).nuovi, [], 'niente da dire');

  const fallisci = async (n, da = 0) => {
    for (let i = da; i < da + n; i++) {
      const r = await k.chiama('POST', '/v1/accesso', { email: `n${i}@esempio.it`, password: ALTRA }, { ip: `198.51.100.${i % 5}` });
      assert.equal(r.status, 401);
    }
  };
  await fallisci(99);
  assert.deepEqual((await k.s.allarmi()).nuovi, [], '99 in 24 ore: sotto la soglia');
  await fallisci(1, 99);
  let r = await k.s.allarmi();
  assert.deepEqual(r.nuovi.map((a) => a.tipo), ['accessi falliti']);
  assert.equal(r.nuovi[0].falliti, 100);
  assert.equal(r.nuovi[0].indirizzi, 5);
  assert.equal(alTitolare().length, 1);
  assert.match(alTitolare()[0].testo, /100/);
  assert.ok(!/@esempio\.it|198\.51\.100/.test(alTitolare()[0].testo), 'ne email ne indirizzi nella mail al titolare');
  assert.deepEqual((await k.s.allarmi()).nuovi, [], 'lo stesso allarme non si ripete');
  await k.riavvia();
  assert.deepEqual((await k.s.allarmi()).nuovi, [], 'nemmeno dopo un riavvio');

  // Una mail rifiutata dal fornitore.
  rifiuta = true;
  assert.equal((await k.chiama('POST', '/v1/verifica/rinvia', undefined, { cookie })).status, 503);
  rifiuta = false;
  r = await k.s.allarmi();
  assert.deepEqual(r.nuovi.map((a) => [a.tipo, a.quante]), [['mail rifiutata', 1]]);
  assert.match(alTitolare().at(-1).testo, /rifiutata dal fornitore: 400/);
  await k.riavvia();
  assert.deepEqual((await k.s.allarmi()).nuovi, []);

  // Una copia con meno righe, che nessuna cancellazione spiega: la scrive nel
  // registro server/copia.mjs, che gira accanto al servizio.
  aggiungiRighe(k.s.db, idDi(k, 'a@esempio.it'), Array.from({ length: 10 }, (_, i) => riga(i)));
  const c1 = join(k.c, 'copia-1.db');
  copia(k.opzioni.db, c1, { cancellazioni: k.opzioni.cancellazioni });
  const unOraFa = new Date(Date.now() - 3600e3);
  utimesSync(c1, unOraFa, unOraFa);
  k.s.db.exec("DELETE FROM riga WHERE uid IN ('u000001', 'u000002', 'u000003')");
  const c2 = copia(k.opzioni.db, join(k.c, 'copia-2.db'), { precedente: c1, cancellazioni: k.opzioni.cancellazioni });
  assert.equal(c2.allarme, true);
  r = await k.s.allarmi();
  assert.deepEqual(r.nuovi.map((a) => [a.tipo, a.quante]), [['copia con meno righe', 1]]);
  assert.match(alTitolare().at(-1).testo, /da 10 a 7/);
  await k.riavvia();
  assert.deepEqual((await k.s.allarmi()).nuovi, []);

  // Il giorno dopo, altri cento: un allarme nuovo.
  k.avanza(25 * ORA);
  await fallisci(100, 1000);
  assert.deepEqual((await k.s.allarmi()).nuovi.map((a) => a.tipo), ['accessi falliti']);
  assert.equal(k.s.db.prepare("SELECT count(*) n FROM registro WHERE evento = 'allarme'").get().n, 4, 'ogni allarme nel registro');

  // Se la mail al titolare non parte, l'allarme resta nel registro e nel log,
  // e il rifiuto non genera un allarme nuovo a ogni giro.
  rifiuta = true;
  k.avanza(25 * ORA);
  await fallisci(100, 2000);
  assert.equal((await k.s.allarmi()).nuovi.length, 1);
  rifiuta = false;
  assert.deepEqual((await k.s.allarmi()).nuovi, [], 'il rifiuto della mail al titolare non e un allarme a sua volta');
  assert.ok(k.scritto.some((m) => /ALLARME/.test(m)), 'nel log, dove il titolare lo trova comunque');
});

test('mail del mese: oltre le 300 la mail parte lo stesso, e il titolare riceve un avviso solo', async (t) => {
  // R-ACC-38, §9.3 e §20, deciso dall'autore il 26 settembre 2026: 300 al mese
  // sono comprese, oltre si paga 0,25 € ogni 1.000. Non si blocca niente: si
  // conta dal registro, e raggiunte le 300 il titolare lo sa, una volta al mese.
  const k = await conti(t);
  const scrivi = k.s.db.prepare("INSERT INTO registro (quando, evento, dettaglio) VALUES (?, 'mail spedita', 'finta')");
  for (let i = 0; i < 40; i++) scrivi.run(new Date(T0 - 2 * GIORNO - i * 1000).toISOString());   // settembre: non conta
  for (let i = 0; i < 298; i++) scrivi.run(new Date(T0 - i * 1000).toISOString());
  await registrato(k, 'a@esempio.it');
  let r = await k.s.allarmi();
  assert.equal(r.mail_del_mese, 299);
  assert.deepEqual(r.nuovi, []);

  const b = await registrato(k, 'b@esempio.it');
  r = await k.s.allarmi();
  assert.deepEqual(r.nuovi.map((a) => [a.tipo, a.spedite, a.mese]), [['mail del mese', 300, '2026-10']]);
  assert.match(k.mail.at(-1).testo, /300/);
  assert.equal(k.mail.at(-1).a, TITOLARE);

  // La trecentunesima e le altre partono: mai un blocco.
  k.mail.length = 0;
  assert.equal((await k.chiama('POST', '/v1/registrazione', { email: 'c@esempio.it', password: BUONA })).status, 201);
  assert.equal((await k.chiama('POST', '/v1/verifica/rinvia', undefined, { cookie: b })).status, 202);
  assert.deepEqual(k.mail.map((m) => m.a), ['c@esempio.it', 'b@esempio.it']);
  assert.deepEqual((await k.s.allarmi()).nuovi, [], 'un avviso al mese');
  await k.riavvia();
  assert.deepEqual((await k.s.allarmi()).nuovi, [], 'anche dopo un riavvio');

  // Il mese dopo il conto riparte.
  k.orologio.t = Date.parse('2026-11-01T08:00:00Z');
  r = await k.s.allarmi();
  assert.equal(r.mail_del_mese, 0);
  assert.deepEqual(r.nuovi, []);
});
