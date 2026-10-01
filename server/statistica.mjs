// Lancia una statistica, dalla macchina.
//
//   node server/statistica.mjs [--db /var/lib/rg/conti.db] "SELECT count(*) risposte FROM risposte"
//
// La query e' una SELECT sulle fonti di server/statistiche.mjs — iscritti,
// risposte, punteggi —, che escludono chi si e' opposto al trattamento per le
// statistiche (docs/account-progetto.md §15.2). Una query che nomina una
// tabella vera e' rifiutata. Il risultato esce in JSON su stdout; su stderr,
// quanti account sono fuori dai conteggi.
//
// Funziona con il servizio acceso, e apre il database **in sola lettura**: uno
// strumento che conta non deve poter scrivere.

import { existsSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { parseArgs } from 'node:util';
import { statistica, esclusi, FONTI } from './statistiche.mjs';

const USO = 'uso: node server/statistica.mjs [--db …] "SELECT … FROM iscritti | risposte | punteggi"';

let argomenti;
try {
  argomenti = parseArgs({ allowPositionals: true, options: { db: { type: 'string', default: '/var/lib/rg/conti.db' } } });
} catch (e) {
  console.error(`${e.message}\n${USO}`);
  process.exit(2);
}
const { values, positionals } = argomenti;
if (positionals.length !== 1) {
  console.error(USO);
  for (const [fonte, colonne] of Object.entries(FONTI)) console.error(`  ${fonte}: ${colonne.join(', ')}`);
  process.exit(2);
}
if (!existsSync(values.db)) {
  console.error(`${values.db}: il database non c'e'`);
  process.exit(1);
}

const db = new DatabaseSync(values.db, { readOnly: true });
try {
  db.exec('PRAGMA busy_timeout = 5000');
  const righe = statistica(db, positionals[0]);
  console.error(`fuori dai conteggi per opposizione: ${esclusi(db)} account`);
  console.log(JSON.stringify(righe, null, 2));
} catch (e) {
  console.error(`statistica non eseguita: ${e.message}`);
  process.exitCode = 1;
} finally {
  db.close();
}
