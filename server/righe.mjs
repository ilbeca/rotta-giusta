// Le righe e la sincronia: invio, ricezione, export.
//
// docs/account-progetto.md §1, §2.3, §2.7, §7.2, §8. Niente HTTP qui dentro,
// come in server/conti.mjs: ogni operazione riceve quello che la richiesta
// porta e restituisce `[codice, corpo, { intestazioni }]`.
//
// Ogni risposta delle righe dice `epoca` e `generazione`. L'epoca cambia solo
// con il ripristino di una copia (§2.7): chi la vede cambiare azzera il cursore
// e rimanda tutto. La generazione cambia a ogni azzeramento (§8.4): un invio
// con quella di prima si rifiuta con un 409, e le sue righe non rientrano. La
// meta' del client — che cosa fare con queste risposte — sta nel motore,
// `site/engine.js`, dove un test la raggiunge.

import { readFileSync } from 'node:fs';
import { aggiungiRighe, righeDopo, leggiEpoca } from './db.mjs';
import { INVIO_MAX_RIGHE, INVIO_MAX_BYTE } from '../site/engine.js';

/** Al piu' tante righe per ricezione (§7.2): il resto con `altre: true`. */
export const RICEZIONE_MAX_RIGHE = 5000;
/** Il corpo di un invio: lo stesso limite con cui il motore prepara il lotto. */
export const CORPO_RIGHE = INVIO_MAX_BYTE;

const errore = (codice, messaggio, extra = {}) => ({ errore: codice, messaggio, ...extra });

/**
 * Gli id della banca: con loro `validaRiga()` rifiuta un `item_id` che non
 * esiste (§4.1). La banca e' immutabile, quindi un id sconosciuto e' un
 * sintomo. Le righe di tecnica portano l'id di un esercizio di carteggio.
 */
export function leggiBanca() {
  const leggi = (f) => JSON.parse(readFileSync(new URL(`../site/dati/${f}`, import.meta.url), 'utf8'));
  return new Set([...leggi('quiz.json').map((q) => q.id), ...leggi('carteggio.json').map((e) => e.id)]);
}

function formatoData(iso) {
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });
}

export function creaRighe({ db, ora, versione, quesiti = leggiBanca() }) {
  const iso = (t = ora()) => new Date(t).toISOString();
  const generazioneDi = (id) => db.prepare('SELECT generazione, azzerato_il FROM account WHERE id = ?').get(id);

  return {
    invia({ corpo, account }) {
      if (!corpo || typeof corpo !== 'object' || !Number.isInteger(corpo.generazione)) {
        return [422, errore('generazione', 'Manca la generazione, un numero intero: la dice GET /v1/io, e va mandata con ogni invio.')];
      }
      if (!Array.isArray(corpo.righe)) {
        return [422, errore('righe', 'Manca l\'elenco delle righe: il corpo è { generazione, righe: [...] }.')];
      }
      if (corpo.righe.length > INVIO_MAX_RIGHE) {
        return [413, errore('troppe_righe', `Al più 2.000 righe per invio, qui ce ne sono ${corpo.righe.length}: `
          + 'mandale in più volte. Niente è stato salvato.')];
      }
      const esito = aggiungiRighe(db, account.id, corpo.righe, { quesiti, generazione: corpo.generazione });
      const epoca = leggiEpoca(db);
      if (esito.conflitto) {
        const { generazione, azzerato_il } = esito.conflitto;
        const quando = azzerato_il ? `il ${formatoData(azzerato_il)}` : 'da un altro dispositivo';
        return [409, errore('generazione', `I progressi di questo account sono stati azzerati ${quando}. `
          + 'Le risposte che hai qui sono di prima e non sono state salvate: scaricale o scartale, poi si riparte.',
        { generazione, azzerato_il, epoca })];
      }
      return [200, { ...esito, epoca, generazione: corpo.generazione }];
    },

    ricevi({ account, query }) {
      const testo = query.get('dopo') ?? '0';
      if (!/^\d{1,15}$/.test(testo)) {
        return [422, errore('dopo', `«dopo» dev'essere un numero intero da zero in su, il cursore dell'ultima risposta; trovato «${testo.slice(0, 20)}».`)];
      }
      const r = righeDopo(db, account.id, Number(testo), { quante: RICEZIONE_MAX_RIGHE });
      const g = generazioneDi(account.id);
      return [200, { ...r, epoca: leggiEpoca(db), generazione: g.generazione, azzerato_il: g.azzerato_il }];
    },

    /**
     * Il file dei progressi, nella forma di `esporta()` della pagina: si
     * ricarica con `importa()`, identico. I punteggi dei Segnali non ci sono
     * ancora — arrivano con il profilo, nel pezzo dopo — e il campo manca
     * invece di essere vuoto: `importa()` salta un campo assente, mentre un
     * `{}` direbbe «nessun punteggio».
     */
    esporta({ account }) {
      const righe = db.prepare('SELECT dati FROM riga WHERE account_id = ? ORDER BY seq').all(account.id)
        .map((r) => JSON.parse(r.dati));
      const giorno = iso().slice(0, 10);
      return [200, { app: 'rotta-giusta', versione, esportato: iso(), righe },
        { intestazioni: { 'Content-Disposition': `attachment; filename="rotta-giusta-progressi-${giorno}.json"` } }];
    },
  };
}
