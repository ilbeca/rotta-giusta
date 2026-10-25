// Un lettore di PNG senza dipendenze: zlib di Node e i cinque filtri delle righe.
//
// A che cosa serve: a una misura sola, decisa dall'autore il 25 ottobre 2026
// (docs/volto-progetto.md, decisione 14) — il contrasto del testo che sta sopra
// la carta della Home al computer. La carta non e' un antenato del testo ma uno
// strato fisso accanto, quindi il fondo non si compone dagli antenati
// (kitPagina().fondo direbbe il mare uniforme del body, 8,91:1, qualunque cosa
// ci sia dietro): si leggono i pixel della schermata, con il testo reso
// trasparente, e per ogni testo si prende il pixel peggiore dietro di lui
// (T-15:velo). La stessa schermata dice dove sta la terra (T-15:costa).
//
// A che cosa non serve: a confrontare due schermate, o una schermata con
// un'immagine attesa. Un confronto di pixel e' un test che a volte passa — i
// caratteri, l'antialiasing e le versioni di Chrome cambiano i pixel senza
// cambiare la pagina —, e questo progetto non ne ha.
//
// Legge quello che Chrome produce con Page.captureScreenshot: 8 bit per canale,
// RGB o RGBA, senza interlacciamento. Altro e' un errore che lo dice.

import { inflateSync } from 'node:zlib';

/** `{ larghezza, altezza, pixel(x, y) -> [r, g, b, a] }` dai byte di un PNG. */
export function leggiPng(buf) {
  const firma = [137, 80, 78, 71, 13, 10, 26, 10];
  if (!firma.every((b, i) => buf[i] === b)) throw new Error('non e\' un PNG');
  let i = 8, larghezza = 0, altezza = 0, tipo = 0, profondita = 0, interlacciato = 0;
  const dati = [];
  while (i < buf.length) {
    const n = buf.readUInt32BE(i), nome = buf.toString('latin1', i + 4, i + 8), corpo = buf.subarray(i + 8, i + 8 + n);
    if (nome === 'IHDR') {
      larghezza = corpo.readUInt32BE(0); altezza = corpo.readUInt32BE(4);
      profondita = corpo[8]; tipo = corpo[9]; interlacciato = corpo[12];
    } else if (nome === 'IDAT') dati.push(corpo);
    else if (nome === 'IEND') break;
    i += 12 + n;
  }
  if (profondita !== 8 || (tipo !== 2 && tipo !== 6) || interlacciato) {
    throw new Error(`PNG non letto: profondita' ${profondita}, tipo ${tipo}, interlacciato ${interlacciato}`);
  }
  const canali = tipo === 6 ? 4 : 3, riga = larghezza * canali;
  const grezzo = inflateSync(Buffer.concat(dati));
  const out = Buffer.alloc(riga * altezza);
  for (let y = 0; y < altezza; y++) {
    const filtro = grezzo[y * (riga + 1)], da = y * (riga + 1) + 1, a = y * riga;
    for (let x = 0; x < riga; x++) {
      const v = grezzo[da + x];
      const sx = x >= canali ? out[a + x - canali] : 0, su = y ? out[a - riga + x] : 0, sxsu = y && x >= canali ? out[a - riga + x - canali] : 0;
      let p;
      if (filtro === 0) p = v;
      else if (filtro === 1) p = v + sx;
      else if (filtro === 2) p = v + su;
      else if (filtro === 3) p = v + ((sx + su) >> 1);
      else if (filtro === 4) {
        const t = sx + su - sxsu, ps = Math.abs(t - sx), pu = Math.abs(t - su), pc = Math.abs(t - sxsu);
        p = v + (ps <= pu && ps <= pc ? sx : pu <= pc ? su : sxsu);
      } else throw new Error(`filtro di riga sconosciuto: ${filtro}`);
      out[a + x] = p & 255;
    }
  }
  return {
    larghezza, altezza,
    pixel(x, y) {
      x = Math.max(0, Math.min(larghezza - 1, Math.round(x))); y = Math.max(0, Math.min(altezza - 1, Math.round(y)));
      const k = y * riga + x * canali;
      return [out[k], out[k + 1], out[k + 2], canali === 4 ? out[k + 3] : 255];
    },
  };
}

const lin = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
/** La luminanza relativa di WCAG di un colore [r, g, b]. */
export const luminanza = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
/** Il rapporto di contrasto di WCAG fra due colori [r, g, b]. */
export const rapporto = (a, b) => { const x = luminanza(a), y = luminanza(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
