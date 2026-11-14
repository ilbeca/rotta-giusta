// L'analisi del confronto, sugli stessi studenti per tutti i metodi.
//   node analisi.mjs  -> risultati/confronto.json, e le tabelle a schermo
// Legge risultati/remoto-grezzo.json se c'e'; senza, confronta solo i due locali.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { carica } from './comune.mjs';
import { banco, LUNGHEZZE } from './simulatore.mjs';
import { QUANTI_LOCALE } from './banco-locale-param.mjs';
import { semplice, bayes, MIN_ERRORI } from './locale.mjs';
import { raccordo } from './remoto.mjs';
import { misura } from './valuta.mjs';

const dati = carica();
const tutti = banco(dati, { quanti: QUANTI_LOCALE, sani: QUANTI_LOCALE });
const perSeme = new Map(tutti.map(s => [s.seme, s]));
const fileGrezzo = new URL('./risultati/remoto-grezzo.json', import.meta.url);
const grezzo = existsSync(fileGrezzo) ? JSON.parse(readFileSync(fileGrezzo, 'utf8')) : { chiamate: [] };

const jaccard = (a, b) => { const A = new Set(a), B = new Set(b); const u = new Set([...A, ...B]); return u.size ? [...A].filter(x => B.has(x)).length / u.size : 1; };
const media = x => x.length ? x.reduce((a, b) => a + b, 0) / x.length : null;
const tonda = (x, k = 3) => x == null ? null : +x.toFixed(k);

const out = { min_errori: MIN_ERRORI, per_lunghezza: {}, remoto: {} };
const modelli = [...new Set(grezzo.chiamate.map(c => c.modello_chiesto))];

for (const n of LUNGHEZZE) {
  // gli studenti del confronto: quelli che il remoto ha visto alla prima chiamata (rip 0),
  // oppure, senza remoto, i primi 30 con lacune e i primi 10 senza
  let semi = [...new Set(grezzo.chiamate.filter(c => c.n === n && c.rip === 0).map(c => c.seme))];
  if (!semi.length) {
    const qui = tutti.filter(s => s.n === n);
    semi = [...qui.filter(s => s.nonSa.length).slice(0, 30), ...qui.filter(s => !s.nonSa.length).slice(0, 10)].map(s => s.seme);
  }
  const st = semi.map(s => perSeme.get(s));
  const righe = {
    '1a_semplice': st.map(s => ({ st: s, rep: semplice(s, dati).concetti })),
    '1b_bayes': st.map(s => ({ st: s, rep: bayes(s, dati).concetti })),
  };
  for (const m of modelli) {
    for (const minConf of ['bassa', 'media', 'alta']) {
      const nome = minConf === 'bassa' ? m : `${m}_conf_${minConf}`;
      righe[nome] = st.map(s => {
        const c = grezzo.chiamate.find(x => x.modello_chiesto === m && x.seme === s.seme && x.rip === 0);
        return { st: s, rep: c?.uscita ? raccordo(c.uscita, s, dati, { minConfidenza: minConf }).concetti : [] };
      });
    }
  }
  out.per_lunghezza[n] = Object.fromEntries(Object.entries(righe).map(([k, r]) => [k, misura(r, dati.perId)]));
}

for (const m of modelli) {
  const ch = grezzo.chiamate.filter(c => c.modello_chiesto === m);
  const ok = ch.filter(c => !c.errore);
  const scarti = {};
  let diagnosiDette = 0, diagnosiTenute = 0, nessunaDetta = 0;
  for (const c of ok) {
    const s = perSeme.get(c.seme);
    if (c.uscita?.esito === 'nessuna_lacuna') nessunaDetta++;
    diagnosiDette += c.uscita?.diagnosi?.length ?? 0;
    const r = raccordo(c.uscita, s, dati);
    diagnosiTenute += r.concetti.length;
    for (const [k, v] of Object.entries(r.scarti)) scarti[k] = (scarti[k] ?? 0) + v;
  }
  // stabilita': per ogni studente ripetuto, Jaccard medio fra tutte le coppie di chiamate, e
  // quante volte le 5 diagnosi (dopo il raccordo) sono identiche
  const gruppi = new Map();
  for (const c of ok) { const g = gruppi.get(c.seme) ?? []; g.push(c); gruppi.set(c.seme, g); }
  const stab = [];
  for (const [seme, g] of gruppi) {
    if (g.length < 2) continue;
    const s = perSeme.get(seme);
    const sets = g.map(c => raccordo(c.uscita, s, dati).concetti.sort());
    const coppie = [];
    for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) coppie.push(jaccard(sets[i], sets[j]));
    stab.push({ seme, n: s.n, lacune: s.nonSa.length, chiamate: g.length, jaccard_medio: tonda(media(coppie)), identiche: sets.every(x => x.join() === sets[0].join()) });
  }
  const per = k => ok.map(c => c[k]).sort((a, b) => a - b);
  const ms = per('ms');
  out.remoto[m] = {
    chiamate: ch.length, errori_api: ch.length - ok.length,
    rifiuti: ok.filter(c => c.stop_reason === 'refusal').length,
    uscite_illeggibili: ok.filter(c => !c.uscita).length,
    token_in: ok.reduce((a, c) => a + c.usage.input_tokens, 0),
    token_out: ok.reduce((a, c) => a + c.usage.output_tokens, 0),
    costo_totale: tonda(ok.reduce((a, c) => a + c.costo, 0), 4),
    costo_per_chiamata: tonda(media(ok.map(c => c.costo)), 5),
    ms_mediana: ms[Math.floor(ms.length / 2)] ?? null,
    ms_p90: ms[Math.floor(ms.length * 0.9)] ?? null,
    esito_nessuna_lacuna: nessunaDetta,
    diagnosi_dette: diagnosiDette, diagnosi_tenute_dal_raccordo: diagnosiTenute,
    scarti_del_raccordo: scarti,
    stabilita: {
      studenti_ripetuti: stab.length,
      jaccard_medio: tonda(media(stab.map(x => x.jaccard_medio))),
      quota_identiche: tonda(media(stab.map(x => (x.identiche ? 1 : 0)))),
      dettaglio: stab,
    },
  };
}

mkdirSync(new URL('./risultati/', import.meta.url), { recursive: true });
writeFileSync(new URL('./risultati/confronto.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
for (const [n, m] of Object.entries(out.per_lunghezza)) {
  console.log(`\nn=${n}`);
  console.table(Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { rec: v.recall, recRil: v.recall_rilevabili, prec: v.precisione, muti: v.nessuna_lacuna_con_lacune, saniAll: v.sani_con_allarme }])));
}
for (const [m, r] of Object.entries(out.remoto)) {
  const { dettaglio, ...s } = r.stabilita;
  console.log(m, { ...r, stabilita: s });
}
