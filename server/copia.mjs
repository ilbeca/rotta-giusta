// Fa una copia del database, la verifica, e la confronta con la precedente.
//
//   node server/copia.mjs <destinazione.db> [--precedente <copia.db>]
//        [--db /var/lib/rg/conti.db] [--cancellazioni /var/lib/rg/cancellazioni]
//
// Funziona con il servizio acceso. Esce 1 se la copia non passa
// `integrity_check` o se le righe calano senza una cancellazione che lo
// spieghi: e' un allarme, non un dato (docs/account-progetto.md §2.5). Portare
// la copia a `nl-ams` e' della macchina, con la sua chiave.

import { parseArgs } from 'node:util';
import { copia } from './copie.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    precedente: { type: 'string' },
    db: { type: 'string', default: '/var/lib/rg/conti.db' },
    cancellazioni: { type: 'string', default: '/var/lib/rg/cancellazioni' },
  },
});

if (positionals.length !== 1) {
  console.error('uso: node server/copia.mjs <destinazione.db> [--precedente <copia.db>] [--db …] [--cancellazioni …]');
  process.exit(2);
}

try {
  const c = copia(values.db, positionals[0], { precedente: values.precedente, cancellazioni: values.cancellazioni });
  console.log(`copia ${c.destinazione}: integrity_check ${c.integrita}, ${c.righe} righe, ${c.account} account, schema ${c.schema}`);
  if (c.calo) {
    console.log(`righe da ${c.calo.prima} a ${c.calo.dopo}: ${c.calo.spiegato ? 'spiegato dal file delle cancellazioni' : 'NESSUNA CANCELLAZIONE LO SPIEGA'}`);
  }
  if (c.allarme) process.exit(1);
} catch (e) {
  console.error(`copia FALLITA: ${e.message}`);
  process.exit(1);
}
