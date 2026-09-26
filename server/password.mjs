// La password: come si salva e quali si rifiutano.
//
// docs/account-progetto.md §5. Argon2id con `crypto.argon2` di Node — c'e'
// dalla 24, e la macchina ha una LTS pari (§2.6) —, i parametri nella stringa
// PHC, al piu' due calcoli insieme. Le regole sono quelle di NIST SP 800-63B-4
// (§5.2): da 15 a 256 caratteri, nessuna regola di composizione, e un elenco
// di password comuni confrontato con la password intera.

import { argon2, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * I parametri del §20, deciso su delega il 26 settembre 2026: 64 MiB, due
 * passate, un filo. Misurati sotto i 250 ms su tutte e due le macchine di
 * prova (§2.6); vanno rimisurati sulla macchina di produzione.
 */
export const PARAMETRI = Object.freeze({ memory: 65536, passes: 2, parallelism: 1 });

export const MINIMO = 15;
export const MASSIMO = 256;

// 64 MiB per ogni accesso in corso sono il modo piu' semplice per esaurire la
// memoria di una macchina da 1 GB: al piu' due calcoli insieme, gli altri in
// coda (§5.1). Il limite di frequenza del §6.5 fa il resto.
const INSIEME = 2;
let inCorso = 0;
const coda = [];
let calcoli = 0;

/** Quanti hash ha calcolato questo processo: la suite lo usa per il §5.3. */
export const calcolati = () => calcoli;

async function turno(fn) {
  if (inCorso >= INSIEME) await new Promise((ok) => coda.push(ok));
  inCorso++;
  try {
    return await fn();
  } finally {
    inCorso--;
    coda.shift()?.();
  }
}

// La stringa PHC usa il base64 standard senza il riempimento `=`.
const b64 = (buf) => buf.toString('base64').replace(/=+$/, '');
const deb64 = (s) => Buffer.from(s, 'base64');

function calcola(password, sale, { memory, passes, parallelism }) {
  return turno(() => new Promise((ok, ko) => {
    calcoli++;
    argon2('argon2id', {
      message: Buffer.from(String(password), 'utf8'), nonce: sale,
      memory, passes, parallelism, tagLength: 32,
    }, (e, h) => (e ? ko(e) : ok(h)));
  }));
}

/** L'hash di una password, come stringa PHC: `$argon2id$v=19$m=…,t=…,p=…$<sale>$<hash>`. */
export async function hashPassword(password, parametri = PARAMETRI) {
  const sale = randomBytes(16);
  const h = await calcola(password, sale, parametri);
  const { memory: m, passes: t, parallelism: p } = parametri;
  return `$argon2id$v=19$m=${m},t=${t},p=${p}$${b64(sale)}$${b64(h)}`;
}

const PHC = /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;

/**
 * Controlla una password contro la sua stringa PHC. Restituisce
 * `{ giusta, daRialzare }`: `daRialzare` e' vero se la stringa porta parametri
 * diversi da quelli di oggi, e chi ha appena verificato la password la
 * ricalcola (§5.1: alzarli non chiede una migrazione).
 */
export async function verificaPassword(password, phc, parametri = PARAMETRI) {
  const m = PHC.exec(phc);
  if (!m) throw new Error('stringa della password non riconosciuta');
  const usati = { memory: Number(m[1]), passes: Number(m[2]), parallelism: Number(m[3]) };
  const atteso = deb64(m[5]);
  const h = await calcola(password, deb64(m[4]), usati);
  const giusta = h.length === atteso.length && timingSafeEqual(h, atteso);
  const daRialzare = usati.memory !== parametri.memory || usati.passes !== parametri.passes
    || usati.parallelism !== parametri.parallelism;
  return { giusta, daRialzare };
}

// --- quali password si rifiutano ----------------------------------------------------

// Il file lo genera strumenti/password_comuni.py dalla fonte dichiarata nel
// README; una voce per riga, gia' in minuscolo. Si legge una volta, all'import:
// il server non scarica niente per partire.
const COMUNI = new Set(
  readFileSync(new URL('./password-comuni.txt', import.meta.url), 'utf8').split('\n').filter(Boolean));

// Le parole del contesto, la terza categoria dello standard: i nomi del
// servizio. Si scrivono qui e non nel file, perche' sono di questo sito.
const SERVIZIO = ['rotta giusta', 'rottagiusta', 'rottagiusta.it', 'api.rottagiusta.it',
  'patente nautica', 'patentenautica', 'patente nautica senza limiti', 'rotta giusta patente nautica'];

const FRASE = "Una frase di tre o quattro parole che ricordi è più lunga e più difficile da indovinare.";

/**
 * Dice se una password si puo' usare. `null` se si', altrimenti
 * `{ motivo, messaggio }`: il rifiuto dice perche' e suggerisce una frase,
 * che sono due obblighi dello stesso paragrafo di NIST (§5.2).
 *
 * I caratteri si contano come punti di codice, non come byte: «è» vale uno.
 * Nessuna regola di composizione, e il confronto con gli elenchi e' sulla
 * password intera, portata in minuscolo — contenere una parola comune non
 * basta a rifiutare.
 */
export function valutaPassword(password, { email = '' } = {}) {
  if (typeof password !== 'string') return { motivo: 'mancante', messaggio: 'Manca la password.' };
  const n = [...password].length;
  if (n < MINIMO) {
    return { motivo: 'corta', messaggio: `La password deve avere almeno ${MINIMO} caratteri; questa ne ha ${n}. ${FRASE}` };
  }
  if (n > MASSIMO) {
    return { motivo: 'lunga', messaggio: `La password può avere al massimo ${MASSIMO} caratteri; questa ne ha ${n}.` };
  }
  const minuscola = password.toLowerCase();
  if (COMUNI.has(minuscola)) {
    return { motivo: 'comune', messaggio: `Questa password è fra le più usate, ed è la prima che qualcuno proverebbe. ${FRASE}` };
  }
  const e = String(email).trim().toLowerCase();
  const contesto = new Set([...SERVIZIO, e, e.split('@')[0]].filter(Boolean));
  if (contesto.has(minuscola) || contesto.has(minuscola.replaceAll(' ', ''))) {
    return { motivo: 'contesto', messaggio: `La password non può essere il tuo indirizzo email né il nome del sito. ${FRASE}` };
  }
  return null;
}
