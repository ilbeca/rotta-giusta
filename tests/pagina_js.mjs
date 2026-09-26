// Leggere lo script di una pagina senza eseguirla: le funzioni di primo
// livello, e una funzione con quelle che nomina. Lo usano i banchi che
// estraggono un contratto dalla pagina e lo eseguono contro il motore vero —
// tests/quiz_intenzioni.mjs (area 2, P-06) e tests/ciclo_quiz.mjs (area 3,
// P-31). Nato dentro il primo; spostato qui quando e' arrivato il secondo,
// perche' due copie dello stesso lettore divergono.
//
// Non e' un parser JavaScript: segue le parentesi saltando stringhe, template,
// commenti ed espressioni regolari. Basta per una pagina scritta a mano; se un
// giorno non bastasse, il sintomo sarebbe un rosso che dice «non riesco a
// leggere», che e' il verso giusto.

/** L'indice della parentesi che chiude quella in `i`, saltando cio' che non e' codice. */
export function chiusa(src, i) {
  const coppie = { '(': ')', '[': ']', '{': '}' };
  const pila = [];
  let prec = '';                       // l'ultimo carattere significativo
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); if (j < 0) return -1; continue; }
    if (c === '/' && src[j + 1] === '*') { j = src.indexOf('*/', j + 2); if (j < 0) return -1; j++; continue; }
    if (c === '"' || c === "'") { j = stringa(src, j, c); prec = 'a'; continue; }
    if (c === '`') { j = template(src, j); prec = 'a'; continue; }
    if (c === '/' && regexQui(src, j, prec)) { j = regex(src, j); prec = 'a'; continue; }
    if (coppie[c]) pila.push(coppie[c]);
    else if (c === ')' || c === ']' || c === '}') {
      if (pila.pop() !== c) return -1;
      if (!pila.length) return j;
    }
    if (!/\s/.test(c)) prec = c;
  }
  return -1;
}
function stringa(src, j, q) {
  for (j++; j < src.length; j++) {
    if (src[j] === '\\') { j++; continue; }
    if (src[j] === q) return j;
  }
  return src.length;
}
function template(src, j) {
  for (j++; j < src.length; j++) {
    if (src[j] === '\\') { j++; continue; }
    if (src[j] === '`') return j;
    if (src[j] === '$' && src[j + 1] === '{') { j = chiusa(src, j + 1); if (j < 0) return src.length; }
  }
  return src.length;
}
function regexQui(src, j, prec) {
  if (!prec || '(,=:[!&|?{};+-*%<>~^'.includes(prec)) return true;
  const prima = src.slice(Math.max(0, j - 12), j).match(/([A-Za-z]+)\s*$/);
  return !!prima && ['return', 'typeof', 'case', 'in', 'of', 'delete', 'void', 'throw', 'new'].includes(prima[1]);
}
function regex(src, j) {
  let classe = false;
  for (j++; j < src.length; j++) {
    const c = src[j];
    if (c === '\\') { j++; continue; }
    if (c === '[') classe = true;
    else if (c === ']') classe = false;
    else if (c === '/' && !classe) { while (/\w/.test(src[j + 1] || '')) j++; return j; }
    else if (c === '\n') return j;
  }
  return src.length;
}

/** {nome: testo} delle funzioni dichiarate al primo livello dello script. */
export function funzioni(script) {
  const out = {};
  const re = /^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/gm;
  let m;
  while ((m = re.exec(script))) {
    const par = script.indexOf('(', m.index + m[0].length - 1);
    const fp = chiusa(script, par);
    if (fp < 0) continue;
    const graffa = script.slice(fp + 1).search(/\S/) + fp + 1;
    if (script[graffa] !== '{') continue;
    const fine = chiusa(script, graffa);
    if (fine < 0) continue;
    out[m[1]] = script.slice(m.index, fine + 1);
  }
  return out;
}

/** I nomi della funzione `nome` e, per chiusura, delle funzioni di primo livello che nomina. */
export function dipendenze(tutte, nome) {
  const presi = new Set([nome]);
  const coda = [nome];
  while (coda.length) {
    const testo = tutte[coda.pop()];
    for (const altra of Object.keys(tutte)) {
      if (presi.has(altra)) continue;
      // Anche un nome dopo un punto: `...argomenti(conf)` e' una chiamata, e
      // una funzione presa in piu' non fa danni, una mancata si'.
      if (new RegExp('(?<![\\w$])' + altra.replace(/\$/g, '\\$') + '\\b').test(testo)) {
        presi.add(altra); coda.push(altra);
      }
    }
  }
  return presi;
}

/** Il testo della funzione `nome` e delle funzioni di primo livello che nomina. */
export function conDipendenze(tutte, nome) {
  return [...dipendenze(tutte, nome)].map((n) => tutte[n]).join('\n\n');
}

/** Il testo di tutti gli script module della pagina, uniti. */
export function scriptModulo(pagina) {
  return [...pagina.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
}
