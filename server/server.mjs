// Il server degli account. Per ora risponde solo alla salute.
//
// docs/account-progetto.md §2.2 e §16.2: `node:http`, `node:sqlite`, zero
// dipendenze; importa `site/engine.js` dal rilascio in uso, cosi' il browser e
// il server rifiutano le stesse righe per gli stessi motivi. Le rotte del §7
// arrivano un pezzo per volta, ognuna con i suoi test in tests/test_server.mjs.
//
//   RG_DB=… RG_CANCELLAZIONI=… RG_PORTA=8620 node server/server.mjs
//
// Sulla macchina lo avvia l'unita' `rg-api` (§2.7), dietro il proxy che fa
// HTTPS: per questo ascolta su 127.0.0.1 se non gli si dice altro.

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SCHEMA, apri, versioneSchema, leggiEpoca } from './db.mjs';

// La versione si legge dalla radice del codice, non dalla cartella dei dati:
// sono due posti diversi sulla macchina (/srv/rg/attuale e /var/lib/rg), ed e'
// la lezione della 0.4.5 — un'istanza che legge `0.0.0` non si riconosce.
const VERSIONE = readFileSync(new URL('../VERSION', import.meta.url), 'utf8').trim();

function rispondi(res, codice, corpo, intestazioni = {}) {
  const testo = JSON.stringify(corpo);
  res.writeHead(codice, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(testo),
    'Cache-Control': 'no-store',
    ...intestazioni,
  });
  res.end(testo);
}

// Ogni errore dice che cosa e' successo e che cosa fare (§7, e §8 della specifica).
const errore = (codice, messaggio) => ({ errore: codice, messaggio });

/**
 * Avvia il server. Restituisce `{ indirizzo, db, chiudi }`: `db` serve alla
 * suite, che lavora sullo stesso database del server che interroga.
 */
export async function avvia({ db: percorsoDb, cancellazioni, porta = 8620, host = '127.0.0.1', log = (m) => console.error(m) } = {}) {
  if (!percorsoDb) throw new Error('manca il percorso del database (RG_DB)');
  if (!cancellazioni) throw new Error('manca il percorso del file delle cancellazioni (RG_CANCELLAZIONI)');
  const db = apri(percorsoDb, { log });

  const rotte = {
    '/v1/salute': {
      GET: () => [200, {
        stato: 'ok',
        versione: VERSIONE,
        schema: { codice: SCHEMA, database: versioneSchema(db) },
        epoca: leggiEpoca(db),
      }],
    },
  };

  const server = createServer((req, res) => {
    const percorso = new URL(req.url, 'http://x').pathname;
    const rotta = rotte[percorso];
    if (!rotta) return rispondi(res, 404, errore('sconosciuta', `${percorso} non esiste: le rotte stanno sotto /v1, e oggi c'e' solo /v1/salute`));
    const gestore = rotta[req.method];
    if (!gestore) {
      return rispondi(res, 405, errore('metodo', `${percorso} non accetta ${req.method}: usa ${Object.keys(rotta).join(', ')}`),
        { Allow: Object.keys(rotta).join(', ') });
    }
    try {
      const [codice, corpo] = gestore(req);
      rispondi(res, codice, corpo);
    } catch (e) {
      log(`errore su ${req.method} ${percorso}: ${e.message}`);
      rispondi(res, 500, errore('interno', "Il server non e' riuscito a rispondere. Riprova fra poco; se continua, scrivici."));
    }
  });

  await new Promise((ok, ko) => { server.once('error', ko); server.listen(porta, host, ok); });
  const { port } = server.address();
  return {
    indirizzo: `http://${host}:${port}`,
    db,
    chiudi: () => new Promise((ok) => server.close(() => { db.close(); ok(); })),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const s = await avvia({
    db: process.env.RG_DB || '/var/lib/rg/conti.db',
    cancellazioni: process.env.RG_CANCELLAZIONI || '/var/lib/rg/cancellazioni',
    porta: Number(process.env.RG_PORTA || 8620),
    host: process.env.RG_HOST || '127.0.0.1',
  });
  console.error(`rg-api ${VERSIONE} su ${s.indirizzo}`);
  const ferma = () => s.chiudi().then(() => process.exit(0));
  process.on('SIGTERM', ferma);
  process.on('SIGINT', ferma);
}
