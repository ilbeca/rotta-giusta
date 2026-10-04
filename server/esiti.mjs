// L'esito dell'esame: «com'è andata», detto da chi studia.
//
// docs/esito-esame-progetto.md §3 (il dato, le rotte, le regole) e
// docs/account-progetto.md §7.1. Niente HTTP qui dentro, come in
// server/conti.mjs: ogni operazione riceve quello che la richiesta porta e
// restituisce `[codice, corpo]`. La tabella e il file delle cancellazioni li
// tocca server/db.mjs; qui ci sono le regole, controllate **tutte prima di
// scrivere**: un campo rotto non lascia scritte le prove buone dello stesso invio.
//
// Si scrive e si toglie senza password, come la data d'esame: e' una cosa
// detta da se'. Il registro di sicurezza non lo annota — non e' un evento di
// sicurezza, e il registro vive un anno oltre l'account (§3.3 del progetto).
//
// Un campo che questo server non conosce e' un 422, non un 200 che lo butta:
// e' la prima misura del §2 del progetto — un esito nel profilo spariva cosi',
// con il server che diceva «fatto» — rivolta contro se stessa.

import { readFileSync } from 'node:fs';
import { esitiDi, scriviEsiti, togliEsiti } from './db.mjs';
import { PROVA_CARTEGGIO } from '../site/engine.js';

const GIORNO_MS = 24 * 3600 * 1000;

// Le condizioni delle prove, da dove le prende il resto del sito: il carteggio
// dal motore, i quiz dalla banca. Un numero scritto qui a mano potrebbe
// divergere da quello che la simulazione usa.
const { prove: PROVE_META } = JSON.parse(readFileSync(new URL('../site/dati/meta.json', import.meta.url), 'utf8'));

/**
 * Le prove dell'esame, nell'ordine in cui si sostengono, con quanti errori al
 * piu' si possono dire (`errori`) e con quanti la prova e' ancora superata
 * (`ammessi`). La pratica non ha errori da dire.
 */
export const PROVE_ESAME = Object.freeze({
  carteggio: Object.freeze({ errori: PROVA_CARTEGGIO.esercizi, ammessi: PROVA_CARTEGGIO.erroriMax }),
  base: Object.freeze({ errori: PROVE_META.base.n, ammessi: PROVE_META.base.errori_max }),
  vela: Object.freeze({ errori: PROVE_META.vela.n, ammessi: PROVE_META.vela.errori_max }),
  pratica: Object.freeze({ errori: null, ammessi: null }),
});

/** Le risposte possibili. `non_detto` e' «Non chiedermelo più» (§3.2 del progetto). */
export const ESITI = Object.freeze(['superata', 'non_superata', 'non_sostenuta', 'non_detto']);

/** Al piu' tanti giorni per account: la scritta, le prove ripetute, la pratica in un altro giorno. */
export const GIORNI_MASSIMI = 20;

const DATA = /^\d{4}-\d{2}-\d{2}$/;
const PAROLE = { carteggio: 'carteggio', base: 'quiz base', vela: 'quiz vela', pratica: 'prova pratica' };

const rifiuto = (campo, messaggio) => [422, { errore: 'esito', campo, messaggio }];
const oggetto = (x) => Boolean(x) && typeof x === 'object' && !Array.isArray(x);
// Una data che esiste nel calendario: «2026-02-30» no, e nemmeno «2026-13-01»,
// su cui `toISOString()` lancerebbe e la risposta sarebbe un 500.
const vera = (d) => {
  const t = typeof d === 'string' && DATA.test(d) ? Date.parse(`${d}T00:00:00Z`) : NaN;
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === d;
};

/**
 * Controlla una prova; restituisce un rifiuto o `null`. Le contraddizioni fra
 * i due campi sono rifiuti, non correzioni silenziose: «superata» con piu'
 * errori di quelli che la superano, errori su una prova non sostenuta o non
 * detta, errori sulla pratica.
 */
function controllaProva(prova, p) {
  const campo = `prove.${prova}`;
  if (p === null) return null;
  if (!oggetto(p)) return rifiuto(campo, `La prova «${PAROLE[prova]}» è { esito, errori } oppure null per toglierla.`);
  const estranei = Object.keys(p).filter((x) => x !== 'esito' && x !== 'errori');
  if (estranei.length) return rifiuto(campo, `«${String(estranei[0]).slice(0, 20)}» non è un campo di una prova: sono esito ed errori. Niente è stato salvato.`);
  if (!ESITI.includes(p.esito)) return rifiuto(`${campo}.esito`, `L'esito di «${PAROLE[prova]}» è uno di ${ESITI.join(', ')}.`);
  const { errori, ammessi } = PROVE_ESAME[prova];
  if (p.errori === undefined || p.errori === null) return null;
  const dove = `${campo}.errori`;
  if (errori === null) return rifiuto(dove, 'La prova pratica non ha errori da dire: lascia il campo vuoto.');
  if (p.esito === 'non_sostenuta' || p.esito === 'non_detto') {
    return rifiuto(dove, `Una prova ${p.esito === 'non_detto' ? 'non detta' : 'non sostenuta'} non ha errori: lascia il campo vuoto.`);
  }
  if (!Number.isInteger(p.errori) || p.errori < 0 || p.errori > errori) {
    return rifiuto(dove, `Gli errori di «${PAROLE[prova]}» sono un numero intero da 0 a ${errori}, oppure vuoto se non lo sai.`);
  }
  if (p.esito === 'superata' && p.errori > ammessi) {
    return rifiuto(dove, `«${PAROLE[prova]}» si supera con al più ${ammessi} ${ammessi === 1 ? 'errore' : 'errori'}: `
      + `superata con ${p.errori} non torna. Controlla l'esito o il numero.`);
  }
  return null;
}

/**
 * Il giorno di una prova: una data vera, e non nel futuro. «Futuro» vuol dire
 * dopo il giorno UTC del server piu' uno: chi e' un fuso avanti scrive gia'
 * domani.
 */
function controllaGiorno(giorno, ora) {
  if (!vera(giorno)) return rifiuto('giorno', 'Il giorno della prova è una data vera nella forma AAAA-MM-GG.');
  if (giorno > new Date(ora() + GIORNO_MS).toISOString().slice(0, 10)) {
    return rifiuto('giorno', 'Il giorno della prova è nel futuro: si dice com\'è andata dopo averla fatta.');
  }
  return null;
}

export function creaEsiti({ db, ora, cancellazioni }) {
  const iso = () => new Date(ora()).toISOString();

  return {
    /**
     * `PUT /v1/esito` `{ giorno, prove: { carteggio?, base?, vela?, pratica? } }`:
     * scrive le prove nominate per quel giorno; una prova assente resta com'e',
     * `null` la toglie. `200 { esiti }`, l'elenco intero dopo la scrittura;
     * `422` con il campo che non va, e niente scritto; `409` se sarebbe il
     * ventunesimo giorno dell'account.
     */
    scrivi({ account, corpo }) {
      if (!oggetto(corpo)) return rifiuto('corpo', 'Il corpo è { giorno, prove: { carteggio, base, vela, pratica } }.');
      const estranei = Object.keys(corpo).filter((x) => x !== 'giorno' && x !== 'prove');
      if (estranei.length) {
        return rifiuto('corpo', `«${String(estranei[0]).slice(0, 20)}» non è un campo dell'esito: sono giorno e prove. Niente è stato salvato.`);
      }
      const noGiorno = controllaGiorno(corpo.giorno, ora);
      if (noGiorno) return noGiorno;
      const { prove } = corpo;
      if (!oggetto(prove) || !Object.keys(prove).length) {
        return rifiuto('prove', `Le prove sono un oggetto con almeno una di ${Object.keys(PROVE_ESAME).join(', ')}.`);
      }
      for (const prova of Object.keys(prove)) {
        if (!(prova in PROVE_ESAME)) {
          return rifiuto('prove', `«${String(prova).slice(0, 20)}» non è una prova dell'esame: sono ${Object.keys(PROVE_ESAME).join(', ')}.`);
        }
      }
      for (const [prova, p] of Object.entries(prove)) {
        const no = controllaProva(prova, p);
        if (no) return no;
      }
      // Il tetto: un giorno nuovo con qualcosa da scrivere, quando ce ne sono gia' venti.
      const giorni = new Set(esitiDi(db, account.id).map((e) => e.giorno));
      const scrive = Object.values(prove).some((p) => p !== null);
      if (scrive && !giorni.has(corpo.giorno) && giorni.size >= GIORNI_MASSIMI) {
        return [409, { errore: 'troppi_giorni', messaggio: `Ci sono già ${GIORNI_MASSIMI} giorni d'esame in questo account: `
          + 'togline uno che non serve più, poi riprova. Niente è stato salvato.' }];
      }
      const esiti = scriviEsiti(db, account.id, { giorno: corpo.giorno, prove, cancellazioni, il: iso() });
      return [200, { esiti }];
    },

    /**
     * `DELETE /v1/esito` `{ giorno }`: toglie tutte le prove di quel giorno,
     * dal database, dai byte e — con la voce nel file delle cancellazioni —
     * da un ripristino futuro. Rifarlo non cambia niente. `200 { esiti }`.
     */
    togli({ account, corpo }) {
      if (!oggetto(corpo)) return rifiuto('corpo', 'Il corpo è { giorno }.');
      const estranei = Object.keys(corpo).filter((x) => x !== 'giorno');
      if (estranei.length) return rifiuto('corpo', `«${String(estranei[0]).slice(0, 20)}» non serve per togliere un esito: basta il giorno.`);
      if (!vera(corpo.giorno)) return rifiuto('giorno', 'Il giorno da togliere è una data vera nella forma AAAA-MM-GG.');
      return [200, { esiti: togliEsiti(db, account.id, { giorno: corpo.giorno, cancellazioni, il: iso() }) }];
    },
  };
}
