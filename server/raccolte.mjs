// Le raccolte nuove, spente fino alla loro decisione.
//
// docs/account-progetto.md §2.7-bis, deciso dall'autore il 17 ottobre 2026.
// Dalla v0.30.0 il server sa conservare tre cose che nessuna pagina usa
// ancora: le righe d'avvio con la previsione (`_t: 'a'`, P-72), gli esiti
// dell'esame (`PUT /v1/esito`, P-73), le scelte di preparazione nel profilo
// (`abilitazione`, `conseguimento`, P-83). Base giuridica e informativa vengono
// prima del trattamento, quindi qui stanno due interruttori, uno per decisione:
//
//   esiti_e_previsioni      l'esito dell'esame e la riga d'avvio. Si accende con
//                           la merge di P-75: B-1, B-2 e l'informativa, dopo le
//                           decisioni del §4, «Dopo P-64», punti 1 e 4, di
//                           docs/prossime-sessioni.md.
//   scelte_di_preparazione  abilitazione e conseguimento nel profilo. Accesa
//                           con la v0.32.0, il rilascio di P-81, che porta la
//                           loro riga nell'informativa (§11.2 del progetto del
//                           client), il 20 ottobre 2026.
//
// **L'interruttore sta nel codice, non nell'ambiente della macchina**, ed e'
// voluto: un tag dice che cosa e' acceso, `rg-aggiorna` e `rg-torna` lo portano
// con il codice, e l'accensione e' un commit che si guarda — questa riga, con il
// test che la tiene ferma. Una variabile in /etc/rg/ambiente si cambia a mano,
// non si rivede, e sopravvive a un rilascio che non la conosce. `GET /v1/salute`
// dice che cosa e' acceso, cosi' dopo un aggiornamento lo si vede da fuori.
//
// Spenta vuol dire scrittura rifiutata sul server, con un motivo che si legge, e
// capability non dichiarata nella descrizione dell'account: la pagina fa come
// con il server di prima. Quello che c'e' gia' resta: si legge, si esporta, si
// cancella (server/righe.mjs, server/esiti.mjs, server/conti.mjs).

import { TIPI_RIGA } from '../site/engine.js';

/** Che cosa e' acceso in questo rilascio. Si cambia con un commit, mai al volo. */
export const RACCOLTE = Object.freeze({
  esiti_e_previsioni: false,
  scelte_di_preparazione: true,
});

/** Il tipo di riga che la raccolta delle previsioni porta: la riga d'avvio. */
export const TIPO_AVVIO = 'a';
/** I campi del profilo che la raccolta delle scelte porta. */
export const CAMPI_SCELTE = Object.freeze(['abilitazione', 'conseguimento']);
/** Il motivo per cui il server scarta una riga d'avvio a raccolta spenta. */
export const MOTIVO_AVVIO_SPENTO = "riga d'avvio non raccolta";

/**
 * Le raccolte di un server: quelle del codice, con le eccezioni di un'opzione
 * d'avvio. Un nome che non esiste o un valore che non e' vero o falso lanciano:
 * un interruttore scritto male accenderebbe niente, con un verde falso.
 */
export function raccolteDa(eccezioni = {}, base = RACCOLTE) {
  const fuori = Object.keys(eccezioni ?? {}).filter((k) => !(k in RACCOLTE));
  if (fuori.length) throw new Error(`raccolta sconosciuta: ${fuori.join(', ')}; sono ${Object.keys(RACCOLTE).join(', ')}`);
  for (const [k, v] of Object.entries(eccezioni ?? {})) {
    if (typeof v !== 'boolean') throw new Error(`la raccolta ${k} si accende con true o false, non con ${JSON.stringify(v)}`);
  }
  return Object.freeze({ ...base, ...eccezioni });
}

/** I tipi di riga che questo server accoglie: quelli del motore, senza la riga d'avvio se la raccolta e' spenta. */
export const tipiAccolti = (r) => TIPI_RIGA.filter((t) => t !== TIPO_AVVIO || r.esiti_e_previsioni);
