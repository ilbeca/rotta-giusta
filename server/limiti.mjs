// I limiti di frequenza del §6.5, in memoria.
//
// docs/account-progetto.md §6.5: si perdono al riavvio, ed e' accettabile —
// tranne il conto dei fallimenti di fila di un account, che disattiva la
// password al centesimo e per questo sta nel database (server/conti.mjs).
// L'orologio e' quello del server, passato da fuori: la suite lo sposta.

/**
 * Una finestra scorrevole: al piu' `quanti` eventi per chiave in `ms`
 * millisecondi. `prova(k, ora)` dice se ce n'e' ancora posto e, se si', lo
 * occupa; se no restituisce fra quanti secondi si libera.
 */
export class Finestra {
  constructor(quanti, ms) {
    this.quanti = quanti;
    this.ms = ms;
    this.eventi = new Map();
  }

  #vivi(k, ora) {
    const v = (this.eventi.get(k) || []).filter((t) => t > ora - this.ms);
    if (v.length) this.eventi.set(k, v); else this.eventi.delete(k);
    return v;
  }

  /** Se c'e' posto, senza occuparlo: serve quando due finestre vanno guardate insieme. */
  haPosto(k, ora) {
    return this.#vivi(k, ora).length < this.quanti;
  }

  /** `{ ok: true }` e l'evento e' contato, oppure `{ ok: false, fra }` in secondi. */
  prova(k, ora) {
    const v = this.#vivi(k, ora);
    if (v.length >= this.quanti) return { ok: false, fra: Math.max(1, Math.ceil((v[0] + this.ms - ora) / 1000)) };
    v.push(ora);
    this.eventi.set(k, v);
    return { ok: true };
  }

  /** Toglie le chiavi scadute: la memoria non cresce con gli indirizzi visti una volta. */
  pulisci(ora) {
    for (const k of [...this.eventi.keys()]) this.#vivi(k, ora);
  }
}

/**
 * Le attese dopo i fallimenti di fila (§6.5, prima riga): dal quinto,
 * un'attesa che parte da 30 secondi e raddoppia fino a 15 minuti. Si tengono
 * per email, anche per quelle che non esistono, cosi' il limite non dice chi e'
 * iscritto (§5.3).
 *
 * Il numero di fallimenti per un'email inesistente sta qui; per un account
 * vero sta nel database, e questa mappa tiene solo l'ora dell'ultimo.
 */
export const DAL = 5;
export const PRIMA_ATTESA = 30;
export const ATTESA_MASSIMA = 900;
export const DISATTIVA_A = 100;

export function attesa(falliti) {
  if (falliti < DAL) return 0;
  return Math.min(PRIMA_ATTESA * 2 ** (falliti - DAL), ATTESA_MASSIMA);
}

export class Fallimenti {
  constructor() { this.voci = new Map(); }

  leggi(email) { return this.voci.get(email) || { falliti: 0, ultimo: 0 }; }

  segna(email, falliti, ora) { this.voci.set(email, { falliti, ultimo: ora }); }

  azzera(email) { this.voci.delete(email); }

  /** Secondi ancora da aspettare prima del prossimo tentativo, 0 se nessuno. */
  resta(email, falliti, ora) {
    const { ultimo } = this.leggi(email);
    const fine = ultimo + attesa(falliti) * 1000;
    return fine > ora ? Math.ceil((fine - ora) / 1000) : 0;
  }

  pulisci(ora) {
    // Sotto il quinto fallimento una voce non fa aspettare nessuno, e dopo un
    // giorno si lascia andare. Dal quinto in su resta fino al riavvio: per
    // un'email inesistente e' il conto verso i cento, e dimenticarlo prima
    // direbbe, a chi ha pazienza, che quell'email non e' iscritta. Costa poco:
    // arrivarci chiede cinque tentativi, e gli indirizzi ne hanno trenta l'ora.
    for (const [k, v] of this.voci) if (v.falliti < DAL && v.ultimo < ora - 86400000) this.voci.delete(k);
  }
}
