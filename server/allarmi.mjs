// Gli allarmi al titolare, letti dal registro.
//
// docs/account-progetto.md §15.4 e §9.3. Una violazione si notifica entro 72
// ore da quando ce se ne accorge (art. 33), e per accorgersene non basta che
// il registro esista: qualcuno deve guardarlo. Qui lo guarda il server, e
// avvisa il titolare di quattro cose:
//
// - **accessi falliti oltre soglia**: almeno 100 in 24 ore su tutti gli
//   account, o una password disattivata (§6.5);
// - **una copia con meno righe** della precedente, senza cancellazioni che lo
//   spieghino: la scrive nel registro server/copia.mjs (§2.5);
// - **una mail rifiutata** dal fornitore (§9.3);
// - **le 300 mail del mese** raggiunte: sono le comprese, oltre si paga. Un
//   avviso, mai un blocco (§20, deciso dall'autore).
//
// **Lo stato sta nel registro, non in memoria.** Ogni allarme e' una riga
// «allarme» con il suo dettaglio, e da quelle righe si sa che cosa e' gia'
// stato detto: un riavvio non ripete un allarme e non ne perde uno.

import { mailAllarmi } from './posta.mjs';

export const SOGLIA_ACCESSI_FALLITI = 100;   // in 24 ore
export const MAIL_COMPRESE = 300;            // al mese

const GIORNO = 86400000;

// Gli eventi che sono allarmi uno per uno: si segnalano quelli con un `id`
// piu' alto dell'ultimo gia' segnalato per quel tipo.
const PER_EVENTO = [
  { tipo: 'copia con meno righe', evento: 'copia con meno righe' },
  { tipo: 'mail rifiutata', evento: 'mail rifiutata' },
];

/**
 * `spedisci` e `registra` sono quelli di server/conti.mjs: la mail al titolare
 * passa dagli stessi limiti e finisce nello stesso conto del mese. Senza
 * `titolare` l'allarme va nel registro e nel log, e basta.
 */
export function creaAllarmi({ db, ora, titolare, spedisci, registra, log }) {
  const iso = (t = ora()) => new Date(t).toISOString();
  const allarmiDi = (tipo) => db.prepare("SELECT quando, dettaglio FROM registro WHERE evento = 'allarme' AND json_extract(dettaglio, '$.tipo') = ?")
    .all(tipo).map((r) => ({ quando: r.quando, ...JSON.parse(r.dettaglio) }));

  function mailDelMese(t) {
    const mese = iso(t).slice(0, 7);
    const n = db.prepare("SELECT count(*) n FROM registro WHERE evento = 'mail spedita' AND quando >= ? AND quando < ?")
      .get(`${mese}-01`, prossimoMese(mese)).n;
    return { mese, n };
  }

  /** Controlla, scrive gli allarmi nuovi nel registro, avvisa il titolare. */
  async function controlla() {
    const t = ora();
    const nuovi = [];

    // Accessi falliti: una finestra di 24 ore, e un allarme al piu' ogni 24 ore.
    const dal = iso(t - GIORNO);
    const f = db.prepare(`SELECT count(*) n, count(DISTINCT ip) indirizzi, count(DISTINCT account_id) account
      FROM registro WHERE evento = 'accesso fallito' AND quando > ?`).get(dal);
    const disattivate = db.prepare("SELECT count(*) n FROM registro WHERE evento = 'password disattivata' AND quando > ?").get(dal).n;
    if ((f.n >= SOGLIA_ACCESSI_FALLITI || disattivate) && !allarmiDi('accessi falliti').some((a) => a.quando > dal)) {
      nuovi.push({
        tipo: 'accessi falliti', falliti: f.n, indirizzi: f.indirizzi, account: f.account, disattivate,
        testo: `${f.n} accessi falliti nelle ultime 24 ore, da ${f.indirizzi} indirizzi, su ${f.account} account esistenti`
          + (disattivate ? `; ${disattivate} password disattivate dopo 100 tentativi` : ''),
      });
    }

    for (const { tipo, evento } of PER_EVENTO) {
      const gia = Math.max(0, ...allarmiDi(tipo).map((a) => a.fino_a));
      const righe = db.prepare('SELECT id, dettaglio FROM registro WHERE evento = ? AND id > ? ORDER BY id').all(evento, gia);
      if (!righe.length) continue;
      const esempi = righe.slice(-3).map((r) => r.dettaglio).filter(Boolean);
      nuovi.push({
        tipo, quante: righe.length, fino_a: righe.at(-1).id,
        testo: `${tipo}: ${righe.length}${esempi.length ? ` — ${esempi.join(' · ')}` : ''}`,
      });
    }

    const { mese, n } = mailDelMese(t);
    if (n >= MAIL_COMPRESE && !allarmiDi('mail del mese').some((a) => a.mese === mese)) {
      nuovi.push({
        tipo: 'mail del mese', mese, spedite: n,
        testo: `${n} mail spedite in ${mese}: le ${MAIL_COMPRESE} comprese sono finite, oltre si pagano 0,25 € ogni 1.000. `
          + 'Nessuna mail è bloccata.',
      });
    }

    for (const a of nuovi) {
      const { testo, ...dettaglio } = a;
      registra('allarme', null, null, JSON.stringify(dettaglio));
      log(`ALLARME ${testo}`);
    }
    if (nuovi.length && titolare) {
      await spedisci(mailAllarmi({ a: titolare, allarmi: nuovi }), null, null, { titolare: true });
    }
    return { nuovi, mail_del_mese: mailDelMese(ora()).n };
  }

  return { controlla };
}

function prossimoMese(mese) {
  const [a, m] = mese.split('-').map(Number);
  return m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, '0')}`;
}
