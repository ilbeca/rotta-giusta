// I due metodi locali. Logica pura: risposte e tassonomia entrano, concetti escono.
import { ALBERO, foglie, idNodo } from './comune.mjs';

// Il minimo che vale per tutti i metodi, remoto compreso: due errori distinti.
export const MIN_ERRORI = 2;

// Conti per concetto: quesiti distinti fatti e sbagliati (l'ultima risposta conta).
export function conti(studente, perId) {
  const ultima = new Map();
  for (const r of studente.risposte) ultima.set(r.id, r);
  const per = new Map();
  let N = 0, E = 0;
  for (const r of ultima.values()) {
    N++; if (!r.giusta) E++;
    for (const c of perId.get(r.id).concetti) {
      const s = per.get(c) ?? { fatti: new Set(), errori: new Set() };
      s.fatti.add(r.id); if (!r.giusta) s.errori.add(r.id);
      per.set(c, s);
    }
  }
  return { per, N, E, ultima };
}

// Aggrega i conti su un insieme di concetti, contando una volta i quesiti con due concetti.
function aggrega(per, ids) {
  const fatti = new Set(), errori = new Set();
  for (const c of ids) { const s = per.get(c); if (!s) continue; s.fatti.forEach(x => fatti.add(x)); s.errori.forEach(x => errori.add(x)); }
  return { fatti, errori };
}

// ---- 1a. Il conto semplice ----------------------------------------------------
// Segnala un concetto se ha almeno MIN_ERRORI errori e un tasso d'errore almeno doppio
// di quello generale della persona (con il tetto del 50 %, perche' il doppio di un tasso
// alto non si puo' raggiungere). Regola scritta prima di vedere i risultati.
export function soglia1a(g) { return Math.min(2 * g, 0.5); }
export function semplice(studente, dati) {
  const { per, N, E } = conti(studente, dati.perId);
  const g = N ? E / N : 0;
  const flag = id => {
    const { fatti, errori } = aggrega(per, foglie(id));
    return errori.size >= MIN_ERRORI && errori.size / fatti.size >= soglia1a(g);
  };
  const nodoFlag = nodo => flag(nodo);
  const erroriNodo = nodo => aggrega(per, foglie(nodo)).errori;
  return {
    concetti: dati.concetti.map(c => c.id).filter(c => flag(c)),
    albero: scendi(ALBERO, { foglia: c => flag(c), nodo: nodoFlag, errori: erroriNodo }),
  };
}

// ---- 1b. Il modello bayesiano ------------------------------------------------
// Per concetto due stati, «lo sa» / «non lo sa». Probabilita' di indovinare 1/risposte,
// di svista SVISTA. Le prove si sommano in log-odds. Per un errore su un quesito con due
// concetti la colpa va al concetto meno certo (posteriore piu' alta), rifatto finche' si
// assesta; una risposta giusta conta per tutti i concetti del quesito.
// Tag sull'errore: N toglie quasi tutta la probabilita' di svista (l'errore viene dal
// non sapere); S la raddoppia, cioe' pesa poco.
export const PRIORE = 0.10;          // circa 2 lacune su 19 concetti
export const SVISTA = 0.10;
export const FATTORE_TAG = { N: 0.15, S: 2, null: 1 };
export const SOGLIA_POST = 0.5;

const logit = p => Math.log(p / (1 - p));
const sig = x => 1 / (1 + Math.exp(-x));

export function prove(r, q) {
  const g = 1 / q.risposte;
  if (r.giusta) return Math.log(g / (1 - SVISTA));
  const s = Math.min(0.9, SVISTA * FATTORE_TAG[r.tag ?? 'null']);
  return Math.log((1 - g) / s);
}

export function posteriori(studente, dati) {
  const { ultima } = conti(studente, dati.perId);
  const ids = dati.concetti.map(c => c.id);
  const base = Object.fromEntries(ids.map(c => [c, logit(PRIORE)]));
  let colpa = new Map();               // id quesito sbagliato -> concetti incolpati
  let post = null;
  for (let giro = 0; giro < 10; giro++) {
    const lo = { ...base };
    const att = Object.fromEntries(ids.map(c => [c, new Set()]));
    for (const r of ultima.values()) {
      const q = dati.perId.get(r.id);
      const w = prove(r, q);
      if (r.giusta) { for (const c of q.concetti) lo[c] += w; continue; }
      let chi;
      if (q.concetti.length === 1 || !post) chi = q.concetti.length === 1 ? q.concetti : null;
      if (!chi) {
        if (!post) chi = q.concetti;   // primo giro: la colpa a meta'
        else {
          const m = Math.max(...q.concetti.map(c => post[c]));
          chi = q.concetti.filter(c => post[c] === m);
        }
      }
      for (const c of chi) { lo[c] += w / chi.length; att[c].add(r.id); }
      colpa.set(r.id, chi);
    }
    const nuovo = Object.fromEntries(ids.map(c => [c, sig(lo[c])]));
    const fermo = post && ids.every(c => Math.abs(post[c] - nuovo[c]) < 1e-9);
    post = nuovo;
    if (fermo) return { post, att, colpa };
    if (giro === 9) return { post, att, colpa };
  }
}

export function bayes(studente, dati) {
  const { post, att } = posteriori(studente, dati);
  const flag = c => post[c] >= SOGLIA_POST && att[c].size >= MIN_ERRORI;
  // Un nodo dell'albero: probabilita' che almeno uno dei suoi concetti sia ignoto,
  // con almeno MIN_ERRORI errori distinti incolpati a concetti del nodo.
  const erroriNodo = nodo => { const e = new Set(); for (const c of foglie(nodo)) att[c].forEach(x => e.add(x)); return e; };
  const nodoFlag = nodo => {
    const fs = foglie(nodo);
    const p = 1 - fs.reduce((a, c) => a * (1 - post[c]), 1);
    const p0 = 1 - Math.pow(1 - PRIORE, fs.length);
    return erroriNodo(nodo).size >= MIN_ERRORI && p >= Math.max(SOGLIA_POST, p0 + 0.25);
  };
  return {
    concetti: Object.keys(post).filter(flag),
    albero: scendi(ALBERO, { foglia: flag, nodo: nodoFlag, errori: erroriNodo }),
    post,
  };
}

// ---- Il livello nell'albero ---------------------------------------------------
// Il figlio se gli errori stanno li', il padre se sono sparsi:
// - i figli segnalati coprono almeno il 60 % degli errori del nodo: si tengono i figli;
// - altrimenti, se il nodo stesso e' segnalato, si dice il nodo;
// - altrimenti si tiene quello che i figli hanno detto (anche niente).
export const QUOTA_FIGLI = 0.6;
export function scendi(nodo, { foglia, nodo: nodoFlag, errori }, radice = true) {
  if (typeof nodo === 'string') return foglia(nodo) ? [nodo] : [];
  const sotto = nodo.figli.flatMap(f => scendi(f, { foglia, nodo: nodoFlag, errori }, false));
  const tot = errori(nodo);
  const coperti = new Set();
  for (const s of sotto) errori(s).forEach(x => coperti.add(x));
  if (sotto.length && (tot.size === 0 || coperti.size / tot.size >= QUOTA_FIGLI)) return sotto;
  if (!radice && nodoFlag(nodo)) return [idNodo(nodo)];
  return sotto;
}
