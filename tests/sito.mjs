// La cartella del sito che i banchi in Node leggono e servono: site/ del repo,
// oppure la copia di RG_SITO (P-84, docs/ridisegno-progetto.md §10.1). E' la
// regola di cartella_del_sito() in tests/regime_pagina.py, detta ai banchi:
// la banca con cui riconoscono i quesiti, i file che confrontano, il motore e
// le pagine che servono vengono tutti da qui. Una copia che non c'e', una senza
// index.html, o RG_SITO accanto a RG_PAGINA lanciano: mai un ripiego su site/.

import { existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');

function cartella() {
  const sito = process.env.RG_SITO;
  if (!sito) return join(RADICE, 'site');
  if (process.env.RG_PAGINA) {
    throw new Error('RG_SITO e RG_PAGINA insieme: la prima sostituisce site/ intera, la seconda il solo canonico, e non si sceglie per te quale valga. Usane una.');
  }
  const c = resolve(sito);
  if (!existsSync(c) || !statSync(c).isDirectory()) throw new Error(`RG_SITO=${sito}: la cartella non esiste. Non si ripiega su site/.`);
  if (!existsSync(join(c, 'index.html'))) throw new Error(`RG_SITO=${sito}: nella cartella non c'e' index.html, quindi non e' una copia del sito. Non si ripiega su site/.`);
  return c;
}

export const SITE = cartella();
/** L'indirizzo del motore della cartella, per `await import(MOTORE)`. */
export const MOTORE = pathToFileURL(join(SITE, 'engine.js')).href;
/** Un file del sito, per percorso relativo alla cartella. */
export const nelSito = (p) => join(SITE, p);
