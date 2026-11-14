// Studenti finti. Ognuno ha 0–3 concetti che non sa, e risponde a n quesiti della voce.
// - su un quesito i cui concetti sa tutti sbaglia per svista, con probabilita' `svista`;
// - se il quesito tocca un concetto che non sa, indovina con probabilita' 1/numero di risposte;
// - dopo un errore a volte mette il tag N («Non lo sapevo») o S («Svista»), e a volte quello sbagliato.
// La svista vera e' presa a caso per studente fra 5 % e 15 %: il modello bayesiano ne assume il 10 %,
// e non deve vincere perche' il banco parla la sua lingua.
import { rng, mescola } from './comune.mjs';

export const TAG = {
  // probabilita' del tag dopo un errore, secondo la causa vera
  nonSa: { N: 0.40, S: 0.05 },
  svista: { N: 0.05, S: 0.30 },
};

export function studente({ quesiti, concetti }, { n, lacune, seme }) {
  const r = rng(seme);
  const ids = concetti.map(c => c.id);
  const nonSa = lacune === 0 ? [] : mescola(ids, r).slice(0, lacune);
  const svista = 0.05 + r() * 0.10;
  const fatti = mescola(quesiti, r).slice(0, n);
  const t0 = Date.UTC(2026, 9, 1, 8, 0, 0);
  const risposte = fatti.map((q, i) => {
    const ignoto = q.concetti.some(c => nonSa.includes(c));
    const giusta = ignoto ? r() < 1 / q.risposte : r() >= svista;
    let scelta = q.x;
    let tag = null;
    if (!giusta) {
      const altre = [...Array(q.risposte).keys()].filter(k => k !== q.x);
      scelta = altre[Math.floor(r() * altre.length)];
      const p = ignoto ? TAG.nonSa : TAG.svista;
      const u = r();
      tag = u < p.N ? 'N' : u < p.N + p.S ? 'S' : null;
    }
    return { id: q.id, giusta, scelta, tag, ts: new Date(t0 + i * 47000).toISOString() };
  });
  return { seme, n, nonSa, svista, risposte };
}

// Il banco: per ogni lunghezza, `quanti` studenti con 1–3 lacune e `sani` senza.
export const LUNGHEZZE = [10, 20, 40, 80];
export function banco(dati, { quanti, sani, semeBase = 32 }) {
  const out = [];
  for (const n of LUNGHEZZE) {
    for (let k = 0; k < quanti + sani; k++) {
      const seme = semeBase * 1_000_000 + n * 10_000 + k;
      const r = rng(seme ^ 0x9e3779b9);
      const lacune = k < quanti ? 1 + Math.floor(r() * 3) : 0;
      out.push(studente(dati, { n, lacune, seme }));
    }
  }
  return out;
}
