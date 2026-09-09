// Solo produzione dello snapshot dimostrativo. Nessun archivio personale.
// Eseguire dalla root: node docs/prototipi/rotta-2026-09-09/genera-dati.mjs
import fs from 'node:fs';
import * as E from '../../../site/engine.js';
const root = new URL('../../../', import.meta.url);
const read = p => JSON.parse(fs.readFileSync(new URL(p, root), 'utf8'));
const items = read('site/dati/quiz.json');
const meta = read('site/dati/meta.json');
const oggi = '2026-09-09';
const opzioni = { kind: 'base', pesi: meta.pesi_esame, esame: null };
const prima = E.mirata(items, {}, oggi, opzioni);
const righe = prima.map(({it}, i) => ({
  _t: 'q', uid: `demo-${i}`, item_id: it.id, kind: 'base',
  ts: new Date(Date.UTC(2026, 8, 8, 17, i)).toISOString(),
  correct: i % 5 === 0 ? 0 : 1, ms: 30000,
  mode: 'mirata', sim_uid: 'demo-prima-attivita'
}));
function stato(rows) {
  const p = E.ripiega(rows).quiz;
  const selezione = E.mirata(items, p, oggi, opzioni);
  return {
    traccia: E.traccia(items, p, oggi, 'base', null),
    selezione: selezione.map(({it, perche}) => ({id: it.id, tema: it.t, voce: it.v, domanda: it.d, motivo: perche})),
    richiami: selezione.filter(({it}) => E.classifica(p[it.id]) === 'da_ripassare').length,
    nuovi: selezione.filter(({it}) => E.classifica(p[it.id]) === 'mai_visto').length
  };
}
const snapshot = { dimostrativo: true, oggi, fonte: 'site/engine.js + site/dati/quiz.json + site/dati/meta.json',
  parametri: opzioni, righe, vuoto: stato([]), parziale: stato(righe),
  temi: [...new Set(items.filter(i => i.k === 'base').map(i => i.t))]
};
if (snapshot.parziale.traccia.quota !== null || snapshot.vuoto.traccia.quota !== null) throw Error('Quota inattesa');
for (const s of [snapshot.vuoto, snapshot.parziale]) {
  if (new Set(s.selezione.map(i => i.id)).size !== s.selezione.length) throw Error('Duplicati');
}
fs.writeFileSync(new URL('dati-demo.js', import.meta.url), `// Snapshot dimostrativo, generato dal motore del repository.\nwindow.DEMO = ${JSON.stringify(snapshot, null, 2)};\n`);
console.log(JSON.stringify({vuoto: snapshot.vuoto.traccia, parziale: snapshot.parziale.traccia, prossima: {n: snapshot.parziale.selezione.length, richiami: snapshot.parziale.richiami, nuovi: snapshot.parziale.nuovi}}, null, 2));
