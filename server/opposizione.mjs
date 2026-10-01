// Mette o toglie il segno di chi si oppone alle statistiche, dalla macchina.
//
//   node server/opposizione.mjs --email chi@esempio.it --metti --motivo "richiesta a privacy@ del 3 ottobre"
//   node server/opposizione.mjs --email chi@esempio.it --togli --motivo "ha scritto che ritira l'opposizione"
//   node server/opposizione.mjs --email chi@esempio.it          lo stato, senza cambiare niente
//        [--db /var/lib/rg/conti.db] [--cancellazioni /var/lib/rg/cancellazioni]
//
// docs/account-progetto.md §15.2. Lo lancia il titolare quando arriva una
// richiesta a privacy@ (art. 21 del GDPR): da quel momento le risposte di
// quell'account restano nel suo account e non entrano in nessun conteggio
// (server/statistiche.mjs). Funziona con il servizio acceso.
//
// Ogni cambio va nel registro, con il motivo, e nel file delle cancellazioni,
// che il ripristino di una copia rilegge: senza, una copia di ieri rimetterebbe
// nei conteggi chi si e' opposto oggi. Il motivo non porta email: nel registro
// l'account e' un numero.
//
// Esce 0 se ha fatto, o se non c'era niente da fare; 1 se l'account o il
// database non ci sono; 2 se e' stato chiamato male.

import { existsSync, statSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { apri, opponi } from './db.mjs';

const USO = 'uso: node server/opposizione.mjs --email <indirizzo> [--metti | --togli] --motivo "<da dove arriva la richiesta>" [--db …] [--cancellazioni …]';

let values;
try {
  ({ values } = parseArgs({
    options: {
      email: { type: 'string' },
      metti: { type: 'boolean' },
      togli: { type: 'boolean' },
      motivo: { type: 'string' },
      db: { type: 'string', default: '/var/lib/rg/conti.db' },
      cancellazioni: { type: 'string', default: '/var/lib/rg/cancellazioni' },
    },
  }));
} catch (e) {
  console.error(`${e.message}\n${USO}`);
  process.exit(2);
}

const email = (values.email ?? '').trim().toLowerCase();
if (!email || (values.metti && values.togli)) {
  console.error(USO);
  process.exit(2);
}
if ((values.metti || values.togli) && !values.motivo?.trim()) {
  console.error(`manca il motivo: da dove arriva la richiesta, e quando. Va nel registro.\n${USO}`);
  process.exit(2);
}
// Un percorso sbagliato non deve creare un database vuoto e dire «nessun account».
if (!existsSync(values.db)) {
  console.error(`${values.db}: il database non c'e'`);
  process.exit(1);
}
// Nemmeno un file che c'e' ed e' vuoto: `apri()` ne farebbe un database nuovo,
// senza account, e la risposta sarebbe la stessa di un indirizzo sbagliato.
if (statSync(values.db).size === 0) {
  console.error(`${values.db}: e' un file vuoto, non il database degli account`);
  process.exit(1);
}

const db = apri(values.db);
try {
  const a = db.prepare('SELECT id, fuori_statistiche_dal FROM account WHERE email = ?').get(email);
  if (!a) {
    console.error(`nessun account con l'indirizzo ${email}: niente è cambiato`);
    process.exitCode = 1;
  } else if (!values.metti && !values.togli) {
    console.log(a.fuori_statistiche_dal ? `${email}: fuori dalle statistiche dal ${a.fuori_statistiche_dal}` : `${email}: nei conteggi`);
  } else {
    const r = opponi(db, a.id, { cancellazioni: values.cancellazioni, opposto: Boolean(values.metti), motivo: values.motivo });
    if (values.metti) {
      console.log(r.cambiato
        ? `${email}: fuori dalle statistiche dal ${r.fuori_dal}. Le sue risposte restano nel suo account; annotato nel registro.`
        : `${email}: era già fuori dalle statistiche dal ${r.fuori_dal}. Niente è cambiato.`);
    } else {
      console.log(r.cambiato
        ? `${email}: di nuovo nei conteggi. Annotato nel registro.`
        : `${email}: era già nei conteggi. Niente è cambiato.`);
    }
  }
} catch (e) {
  console.error(`non fatto: ${e.message}`);
  process.exitCode = 1;
} finally {
  db.close();
}
