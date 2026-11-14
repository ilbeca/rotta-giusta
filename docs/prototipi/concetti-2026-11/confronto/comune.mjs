// Il comune del confronto: banca, concetti, albero, generatore con seme.
// Logica pura come site/engine.js, ma nel prototipo: non e' il motore.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const qui = path.dirname(fileURLToPath(import.meta.url));
const radice = path.resolve(qui, '../../../..');

export function carica() {
  const tax = JSON.parse(readFileSync(path.join(qui, '../concetti-fanali.json'), 'utf8'));
  const banca = JSON.parse(readFileSync(path.join(radice, 'site/dati/quiz.json'), 'utf8'));
  const perId = new Map(banca.map(q => [q.id, q]));
  const ids = Object.keys(tax.quesiti);
  const quesiti = ids.map(id => {
    const q = perId.get(id);
    if (!q) throw new Error(`${id} non e' in banca`);
    return { id, concetti: tax.quesiti[id], risposte: q.r.length, d: q.d, r: q.r, x: q.x, p: q.p };
  });
  const concetti = tax.concetti.map(c => ({ id: c.id, nome: c.nome, copre: c.copre }));
  return { quesiti, concetti, perId: new Map(quesiti.map(q => [q.id, q])) };
}

// L'albero: famiglie del §6 del pilota, con le quattro cardinali sotto un nodo loro.
// Non sta nel JSON del pilota; e' scritto qui, ed e' una scelta del confronto.
export const ALBERO = {
  id: 'voce', figli: [
    { id: 'F:luci', figli: ['portate', 'fase_periodo', 'tipi_luce', 'sigla_completa', 'settori'] },
    { id: 'F:iala', figli: ['iala_sistema', 'laterali',
      { id: 'F:cardinali', figli: ['cardinali_principio', 'cardinali_miragli', 'cardinali_luci', 'cardinali_colori'] },
      'pericolo_isolato', 'acque_sicure', 'speciali'] },
    { id: 'F:oggetti', figli: ['tipi_segnalamento', 'radar_nebbia', 'simboli_carta'] },
    { id: 'F:fluviale', figli: ['fluviale_segnali', 'fluviale_regole'] },
  ],
};

// nodo -> insieme delle foglie (concetti) sotto di lui
const INTERNI = new Map();
(function registra(n) { if (typeof n === 'string') return; INTERNI.set(n.id, n); n.figli.forEach(registra); })(ALBERO);
export function foglie(nodo) {
  if (typeof nodo === 'string') return INTERNI.has(nodo) ? foglie(INTERNI.get(nodo)) : [nodo];
  return nodo.figli.flatMap(foglie);
}
export function idNodo(nodo) { return typeof nodo === 'string' ? nodo : nodo.id; }

// mulberry32: lo stesso seme, lo stesso banco.
export function rng(seme) {
  let a = seme >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function mescola(arr, r) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
