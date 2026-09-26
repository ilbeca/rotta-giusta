// Ripristina una copia del database, o prova che il ripristino funziona.
//
//   node server/ripristina.mjs --prova
//       il giro intero su un'istanza sacrificabile: scrive, copia, cancella,
//       ripristina, confronta. Non tocca niente fuori da una cartella
//       temporanea, che alla fine cancella. Esce 1 se un controllo fallisce.
//
//   node server/ripristina.mjs <copia.db> [--db /var/lib/rg/conti.db]
//                                          [--cancellazioni /var/lib/rg/cancellazioni]
//       il ripristino vero. **Prima si ferma il servizio** (systemctl stop
//       rg-api): il database si sostituisce sotto i piedi di chi lo tiene
//       aperto. docs/account-progetto.md §2.7.

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { prova, ripristina } from './copie.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    prova: { type: 'boolean' },
    db: { type: 'string', default: '/var/lib/rg/conti.db' },
    cancellazioni: { type: 'string', default: '/var/lib/rg/cancellazioni' },
  },
});

if (values.prova) {
  const cartella = mkdtempSync(join(tmpdir(), 'rg-prova-'));
  let esito;
  try {
    esito = prova({ cartella });
  } finally {
    rmSync(cartella, { recursive: true, force: true });
  }
  for (const k of esito.controlli) console.log(`${k.ok ? 'ok ' : 'NO '} ${k.nome}${k.ok || !k.dettaglio ? '' : ` — ${k.dettaglio}`}`);
  const falliti = esito.controlli.filter((k) => !k.ok).length;
  if (falliti) {
    console.log(`prova FALLITA: ${falliti} controlli su ${esito.controlli.length}, su ${cartella} (rimossa)`);
    process.exit(1);
  }
  console.log(`prova superata: ${esito.controlli.length} controlli su ${cartella} (rimossa)`);
} else if (positionals.length === 1) {
  const r = ripristina(positionals[0], values.db, { cancellazioni: values.cancellazioni });
  console.log(`ripristinato ${values.db} da ${positionals[0]}: ${r.righe} righe, ${r.account} account, schema ${r.schema}`);
  console.log(`epoca ${r.epocaPrima} → ${r.epoca}: i client rimanderanno le loro righe`);
  console.log(`dal file delle cancellazioni: ${r.ricancellati.length} account ricancellati, ${r.riazzerati.length} riazzerati`
    + (r.illeggibili ? `, ${r.illeggibili} righe ILLEGGIBILI — guardale prima di riaprire` : ''));
} else {
  console.error('uso: node server/ripristina.mjs --prova | <copia.db> [--db …] [--cancellazioni …]');
  process.exit(2);
}
