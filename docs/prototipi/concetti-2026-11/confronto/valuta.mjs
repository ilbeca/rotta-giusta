// Le misure. Micro-medie: si sommano i conti di tutti gli studenti, poi si divide.
import { foglie } from './comune.mjs';

// I concetti veri che il quesito fatto puo' mostrare: almeno MIN quesiti fatti su quel concetto.
export function rilevabili(st, perId, min = 2) {
  const n = new Map();
  for (const r of st.risposte) for (const c of perId.get(r.id).concetti) n.set(c, (n.get(c) ?? 0) + 1);
  return st.nonSa.filter(c => (n.get(c) ?? 0) >= min);
}

// righe: [{ st, rep: [concetti o nodi] }]; albero: un nodo vale se contiene una lacuna vera.
export function misura(righe, perId, { albero = false } = {}) {
  let tp = 0, rep = 0, veri = 0, ril = 0, trovatiRil = 0, conLacune = 0, muti = 0, sani = 0, saniAllarme = 0, fpSani = 0, foglieRep = 0;
  for (const { st, rep: r } of righe) {
    const vero = new Set(st.nonSa);
    const coperto = c => albero ? r.some(x => foglie(x).includes(c)) : r.includes(c);
    const giusto = x => albero ? foglie(x).some(c => vero.has(c)) : vero.has(x);
    rep += r.length;
    tp += r.filter(giusto).length;
    foglieRep += r.reduce((a, x) => a + foglie(x).length, 0);
    if (vero.size) {
      conLacune++;
      veri += vero.size;
      const rl = rilevabili(st, perId);
      ril += rl.length;
      trovatiRil += rl.filter(coperto).length;
      if (r.length === 0) muti++;
      st._trovati = st.nonSa.filter(coperto).length;
    } else {
      sani++;
      if (r.length) { saniAllarme++; fpSani += r.length; }
    }
  }
  const trovati = righe.reduce((a, { st, rep: r }) => a + (st.nonSa.length ? st.nonSa.filter(c => albero ? r.some(x => foglie(x).includes(c)) : r.includes(c)).length : 0), 0);
  const f = (a, b) => b ? +(a / b).toFixed(3) : null;
  return {
    studenti_con_lacune: conLacune, studenti_sani: sani,
    recall: f(trovati, veri),
    recall_rilevabili: f(trovatiRil, ril),
    precisione: f(tp, rep),
    inventati_per_studente: f(rep - tp, conLacune + sani),
    nessuna_lacuna_con_lacune: f(muti, conLacune),
    sani_con_allarme: f(saniAllarme, sani),
    concetti_per_segnalazione: f(foglieRep, rep),
    conti: { lacune_vere: veri, rilevabili: ril, trovate: trovati, trovate_rilevabili: trovatiRil, segnalazioni: rep, giuste: tp },
  };
}
