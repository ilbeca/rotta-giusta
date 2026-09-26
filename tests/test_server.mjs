// Test del server degli account: node --test tests/test_server.mjs
//
// La quinta suite (docs/account-progetto.md §16.2). Il server si avvia nello
// stesso processo, su un database temporaneo, e si interroga con `fetch`: cosi'
// i requisiti del server non sono «scoperti», si eseguono.
//
// Per ora il server risponde solo alla salute. Quello che conta di piu' e'
// l'altra meta' di questo file: la copia di sicurezza con il ripristino
// provato — *un backup mai ripristinato non e' un backup, e' un file* (0.4.6) —
// con l'epoca del database e il file delle cancellazioni del §2.7.
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

import { avvia } from '../server/server.mjs';
import {
  SCHEMA, apri, leggiEpoca, creaAccount, aggiungiRighe, righeDopo,
  cancellaAccount, azzera, leggiCancellazioni,
} from '../server/db.mjs';
import { copia, ripristina, prova } from '../server/copie.mjs';
import { validaRiga } from '../site/engine.js';

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

  for (const [metodo, percorso, codice] of [['GET', '/', 404], ['GET', '/v1/righe', 404], ['POST', '/v1/salute', 405]]) {
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
