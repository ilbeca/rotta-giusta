// Il banco dei metodi locali: 300 studenti con lacune e 300 senza per ogni lunghezza.
// node banco-locale.mjs  -> risultati/locale.json
import { writeFileSync, mkdirSync } from 'node:fs';
import { carica } from './comune.mjs';
import { banco, LUNGHEZZE } from './simulatore.mjs';
import { semplice, bayes } from './locale.mjs';
import { misura } from './valuta.mjs';

import { QUANTI_LOCALE } from './banco-locale-param.mjs';
const dati = carica();
const studenti = banco(dati, { quanti: QUANTI_LOCALE, sani: QUANTI_LOCALE });
const out = { banco: { seme: 32, per_lunghezza: { con_lacune: QUANTI_LOCALE, senza: QUANTI_LOCALE } }, per_lunghezza: {} };
for (const n of LUNGHEZZE) {
  const qui = studenti.filter(s => s.n === n);
  const a = qui.map(st => ({ st, r: semplice(st, dati) }));
  const b = qui.map(st => ({ st, r: bayes(st, dati) }));
  out.per_lunghezza[n] = {
    '1a_semplice': misura(a.map(x => ({ st: x.st, rep: x.r.concetti })), dati.perId),
    '1a_semplice_albero': misura(a.map(x => ({ st: x.st, rep: x.r.albero })), dati.perId, { albero: true }),
    '1b_bayes': misura(b.map(x => ({ st: x.st, rep: x.r.concetti })), dati.perId),
    '1b_bayes_albero': misura(b.map(x => ({ st: x.st, rep: x.r.albero })), dati.perId, { albero: true }),
  };
}
mkdirSync(new URL('./risultati/', import.meta.url), { recursive: true });
writeFileSync(new URL('./risultati/locale.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
for (const [n, m] of Object.entries(out.per_lunghezza)) {
  console.log(`\nn=${n}`);
  console.table(Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { rec: v.recall, recRil: v.recall_rilevabili, prec: v.precisione, muti: v.nessuna_lacuna_con_lacune, saniAll: v.sani_con_allarme, dim: v.concetti_per_segnalazione }])));
}
