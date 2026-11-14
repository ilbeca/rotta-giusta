// Il conto semplice con altre soglie: il metro e' giusto o l'abbiamo tarato male?
// Stesso banco del locale (300 con lacune e 300 senza per lunghezza).
//   node sensibilita.mjs -> risultati/sensibilita.json
import { writeFileSync, mkdirSync } from 'node:fs';
import { carica, foglie } from './comune.mjs';
import { banco, LUNGHEZZE } from './simulatore.mjs';
import { QUANTI_LOCALE } from './banco-locale-param.mjs';
import { conti, bayes } from './locale.mjs';
import { misura } from './valuta.mjs';

const dati = carica();
const studenti = banco(dati, { quanti: QUANTI_LOCALE, sani: QUANTI_LOCALE });
const VARIANTI = [];
for (const minE of [2, 3]) for (const molt of [2, 3]) VARIANTI.push({ minE, molt });

function semplice(st, { minE, molt }) {
  const { per, N, E } = conti(st, dati.perId);
  const g = N ? E / N : 0;
  const s = Math.min(molt * g, 0.5);
  return dati.concetti.map(c => c.id).filter(c => {
    const x = per.get(c); if (!x) return false;
    return x.errori.size >= minE && x.errori.size / x.fatti.size >= s;
  });
}

const out = {};
for (const n of LUNGHEZZE) {
  const qui = studenti.filter(s => s.n === n);
  out[n] = {};
  for (const v of VARIANTI) out[n][`1a_min${v.minE}_x${v.molt}`] = misura(qui.map(st => ({ st, rep: semplice(st, v) })), dati.perId);
  out[n]['1b_bayes'] = misura(qui.map(st => ({ st, rep: bayes(st, dati).concetti })), dati.perId);
}
mkdirSync(new URL('./risultati/', import.meta.url), { recursive: true });
writeFileSync(new URL('./risultati/sensibilita.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
for (const [n, m] of Object.entries(out)) {
  console.log(`\nn=${n}`);
  console.table(Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { recRil: v.recall_rilevabili, prec: v.precisione, muti: v.nessuna_lacuna_con_lacune, saniAll: v.sani_con_allarme }])));
}
void foglie;
