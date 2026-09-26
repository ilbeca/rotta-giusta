// L'account: registrazione, accesso, sessione, verifica dell'email, password.
//
// docs/account-progetto.md §5, §6, §7.1, §9, §14.3, §15.3. Niente HTTP qui
// dentro: ogni operazione riceve quello che la richiesta porta e restituisce
// `[codice, corpo, { cookie, attesa }]`; server/server.mjs fa il resto.
//
// L'orologio e' passato da fuori (`ora()`, in millisecondi): la suite lo sposta
// per provare i trenta giorni della sessione, i gettoni e le attese senza
// aspettarli. Le righe e la sincronia non sono qui: sono il pezzo dopo.

import { randomBytes, createHash } from 'node:crypto';
import { creaAccount, cancellaAccount, transazione } from './db.mjs';
import { hashPassword, verificaPassword, valutaPassword, PARAMETRI } from './password.mjs';
import { Finestra, Fallimenti, DISATTIVA_A } from './limiti.mjs';
import { mailVerifica, mailGiaIscritto, mailPassword, mailDisattivata } from './posta.mjs';

const MINUTO = 60000;
const ORA = 60 * MINUTO;
const GIORNO = 24 * ORA;

export const SESSIONE_MS = 30 * GIORNO;       // §6.2: dall'accesso, e non si sposta
export const NON_CONFERMATO_MS = 7 * GIORNO;  // §9.6, R-ACC-11
const DURATA = { verifica: 24 * ORA, password: ORA };   // §9.1

export const COOKIE = '__Host-rg';

const nuovoToken = () => randomBytes(32).toString('base64url');
const impronta = (t) => createHash('sha256').update(String(t)).digest();

const errore = (codice, messaggio, extra = {}) => ({ errore: codice, messaggio, ...extra });

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizza = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');

const SCRITTO = (email) => `Ti abbiamo scritto a ${email}. Se fra cinque minuti non vedi la mail, `
  + "guarda nello spam: il mittente è noreply@posta.rottagiusta.it.";
const NON_SPEDITA = "Non siamo riusciti a spedire la mail. Il tuo account c'è e niente è perso: "
  + "riprova fra qualche minuto con «rimandami la mail».";
const SE_ISCRITTO = "Se l'indirizzo è iscritto, ti è arrivata una mail per reimpostare la password. "
  + 'Se fra cinque minuti non la vedi, guarda nello spam.';
const SBAGLIATE = 'Email o password non corrette. Controllale e riprova, oppure reimposta la password.';
const DISATTIVATA = "Dopo troppi tentativi sbagliati la password di questo account è disattivata. "
  + "Per rientrare reimpostala: scegli «Ho dimenticato la password» e ti mandiamo una mail.";

/**
 * Prepara l'account su un database aperto. `fittizia` e' l'hash con cui si
 * controlla la password di un'email che non esiste (§5.3): la calcola `avvia`
 * all'inizio, cosi' nessuna richiesta paga un calcolo in piu'.
 */
export function creaConti({ db, ora, argon2 = PARAMETRI, posta, sito, cancellazioni, fittizia, log }) {
  const iso = (t = ora()) => new Date(t).toISOString();

  const limiti = {
    accessiIp: new Finestra(30, ORA),
    richiesteIp: new Finestra(5, ORA),        // registrazioni e mail di reimpostazione
    mailOra: new Finestra(3, ORA),
    mailGiorno: new Finestra(10, GIORNO),
    perSessione: new Finestra(600, ORA),
    fallimenti: new Fallimenti(),
  };

  // --- il registro (§15.3) -----------------------------------------------------
  // Mai password, gettoni, cookie; e nemmeno l'email scritta in un accesso
  // fallito, che a volte e' una password digitata nel campo sbagliato.
  const scrivi = db.prepare('INSERT INTO registro (quando, evento, account_id, ip, dettaglio) VALUES (?, ?, ?, ?, ?)');
  const registra = (evento, accountId = null, ip = null, dettaglio = null) =>
    scrivi.run(iso(), evento, accountId, ip, dettaglio);

  // --- gli account ---------------------------------------------------------------
  const perEmail = db.prepare('SELECT * FROM account WHERE email = ?');
  const perId = db.prepare('SELECT * FROM account WHERE id = ?');

  function descrivi(a) {
    const r = db.prepare('SELECT count(*) n, COALESCE(MAX(seq), 0) s FROM riga WHERE account_id = ?').get(a.id);
    return {
      email: a.email,
      verificata: Boolean(a.email_verificata_il),
      scade_se_non_verificata: a.email_verificata_il ? null : iso(Date.parse(a.creato_il) + NON_CONFERMATO_MS),
      data_esame: a.data_esame,
      generazione: a.generazione,
      chiave_locale: a.chiave_locale,
      righe: r.n,
      ultima_seq: r.s,
    };
  }

  // --- le sessioni (§6) ------------------------------------------------------------
  function apriSessione(accountId) {
    const token = nuovoToken();
    db.prepare('INSERT INTO sessione (id_hash, account_id, creata_il, scade_il) VALUES (?, ?, ?, ?)')
      .run(impronta(token), accountId, iso(), iso(ora() + SESSIONE_MS));
    return `${COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${SESSIONE_MS / 1000}`;
  }
  const togliCookie = `${COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`;

  /**
   * L'account di una sessione valida, o `null`. Ogni richiesta con una sessione
   * valida e' attivita' (§14.2): `ultimo_accesso_il` e' il giorno, non l'ora.
   */
  function sessione(token) {
    if (!token) return null;
    const a = db.prepare(`
      SELECT a.* FROM sessione s JOIN account a ON a.id = s.account_id
      WHERE s.id_hash = ? AND s.scade_il > ?`).get(impronta(token), iso());
    if (!a) return null;
    const oggi = iso().slice(0, 10);
    if (a.ultimo_accesso_il !== oggi) db.prepare('UPDATE account SET ultimo_accesso_il = ? WHERE id = ?').run(oggi, a.id);
    return a;
  }

  /** Il limite di 600 richieste l'ora per sessione (§6.5). */
  function richiestaDiSessione(token) {
    return limiti.perSessione.prova(impronta(token).toString('hex'), ora());
  }

  // --- i gettoni (§9.1) ---------------------------------------------------------------
  function nuovoGettone(accountId, scopo) {
    const g = nuovoToken();
    transazione(db, () => {
      // Un gettone nuovo dello stesso scopo annulla i precedenti.
      db.prepare('DELETE FROM gettone WHERE account_id = ? AND scopo = ? AND usato_il IS NULL').run(accountId, scopo);
      db.prepare('INSERT INTO gettone (id_hash, account_id, scopo, creato_il, scade_il) VALUES (?, ?, ?, ?, ?)')
        .run(impronta(g), accountId, scopo, iso(), iso(ora() + DURATA[scopo]));
    });
    return g;
  }

  /** Il gettone valido di quello scopo, o `null`: scaduto, usato e inventato sono la stessa risposta. */
  function gettoneValido(g, scopo) {
    if (typeof g !== 'string' || !g) return null;
    return db.prepare(`SELECT * FROM gettone WHERE id_hash = ? AND scopo = ? AND usato_il IS NULL AND scade_il > ?`)
      .get(impronta(g), scopo, iso()) ?? null;
  }

  const link = (scopo, g) => `${sito}/app#${scopo}=${g}`;

  // --- la posta (§9.3, §6.5) -------------------------------------------------------------
  /**
   * Spedisce, se la destinazione ha ancora posto: 3 mail l'ora e 10 al giorno.
   * Restituisce 'ok', 'limite' o 'rifiutata'. Un rifiuto va nel registro e nel
   * log, senza il contenuto della mail, che porta il gettone.
   */
  async function spedisci(m, accountId, ip) {
    const t = ora();
    if (!limiti.mailGiorno.haPosto(m.a, t) || !limiti.mailOra.haPosto(m.a, t)) {
      registra('mail non spedita: limite', accountId, ip);
      return 'limite';
    }
    limiti.mailGiorno.prova(m.a, t);
    limiti.mailOra.prova(m.a, t);
    try {
      await posta.invia(m);
    } catch (e) {
      registra('mail rifiutata', accountId, ip, String(e?.message ?? e).slice(0, 200));
      log(`mail rifiutata dal fornitore: ${String(e?.message ?? e).slice(0, 200)}`);
      return 'rifiutata';
    }
    registra('mail spedita', accountId, ip, m.oggetto);
    return 'ok';
  }

  // --- i fallimenti di fila (§6.5) --------------------------------------------------------
  // Il conto di un account vero sta nel database; quello di un'email che non
  // esiste, in memoria. Le due strade danno le stesse risposte (§5.3).
  const falliti = (email, a) => (a ? a.accessi_falliti : limiti.fallimenti.leggi(email).falliti);
  const disattivata = (email, a) => (a ? Boolean(a.password_disattivata_il) : falliti(email, a) >= DISATTIVA_A);

  /** Segna un fallimento; restituisce `true` se ha appena disattivato la password. */
  async function fallito(email, a, ip) {
    const n = falliti(email, a) + 1;
    limiti.fallimenti.segna(email, n, ora());
    if (!a) {
      // Senza account e senza email: solo l'indirizzo, che basta a vedere un
      // attacco a molti account dallo stesso posto (§15.3).
      registra('accesso fallito', null, ip);
      return n >= DISATTIVA_A;
    }
    registra('accesso fallito', a.id, ip);
    if (n < DISATTIVA_A) {
      db.prepare('UPDATE account SET accessi_falliti = ? WHERE id = ?').run(n, a.id);
      return false;
    }
    db.prepare('UPDATE account SET accessi_falliti = ?, password_disattivata_il = ? WHERE id = ?').run(n, iso(), a.id);
    registra('password disattivata', a.id, ip);
    await spedisci(mailDisattivata({ a: a.email, link: link('password', nuovoGettone(a.id, 'password')) }), a.id, ip);
    return true;
  }

  function riuscito(email, a) {
    limiti.fallimenti.azzera(email);
    if (a.accessi_falliti) db.prepare('UPDATE account SET accessi_falliti = 0 WHERE id = ?').run(a.id);
  }

  /**
   * Il controllo comune all'accesso e al cambio di password: disattivata, in
   * attesa, oppure la password confrontata. Restituisce una risposta di rifiuto
   * o `null` se la password e' giusta.
   */
  async function controlla(email, a, password, ip) {
    if (disattivata(email, a)) return [403, errore('password_disattivata', DISATTIVATA)];
    const resta = limiti.fallimenti.resta(email, falliti(email, a), ora());
    if (resta) {
      return [429, errore('attendi', `Troppi tentativi sbagliati di fila: riprova fra ${resta} secondi, `
        + 'oppure reimposta la password.'), { attesa: resta }];
    }
    const { giusta, daRialzare } = await verificaPassword(String(password ?? ''), a ? a.password : fittizia, argon2);
    if (!giusta || !a) {
      if (await fallito(email, a, ip)) return [403, errore('password_disattivata', DISATTIVATA)];
      return [401, errore('accesso', SBAGLIATE)];
    }
    if (daRialzare) {
      db.prepare('UPDATE account SET password = ? WHERE id = ?').run(await hashPassword(password, argon2), a.id);
    }
    riuscito(email, a);
    return null;
  }

  const troppe = (fra, cosa) => [429, errore('troppe', `Troppe ${cosa} da questo indirizzo: riprova fra ${Math.ceil(fra / 60)} minuti.`), { attesa: fra }];

  // --- le rotte (§7.1) ------------------------------------------------------------------------
  return {
    sessione,
    richiestaDiSessione,

    async registrazione({ corpo, ip }) {
      const email = normalizza(corpo?.email);
      if (!MAIL.test(email) || email.length > 254) {
        return [422, errore('email', "L'indirizzo email non sembra valido: controllalo e riprova.")];
      }
      const rifiuto = valutaPassword(corpo?.password, { email });
      if (rifiuto) return [422, errore('password', rifiuto.messaggio, { motivo: rifiuto.motivo })];
      // Il limite conta le registrazioni che costano un hash e una mail, non
      // le password rifiutate: chi ne prova cinque troppo corte non resta fuori
      // un'ora per questo.
      const lim = limiti.richiesteIp.prova(ip, ora());
      if (!lim.ok) return troppe(lim.fra, 'richieste');

      // L'hash si calcola sempre, anche per un'email gia' iscritta: la risposta
      // impiega lo stesso tempo (§5.3).
      const hash = await hashPassword(corpo.password, argon2);
      let id = null;
      if (!perEmail.get(email)) {
        try {
          id = creaAccount(db, { email, password: hash, ora: iso() });
        } catch (e) {
          if (!/UNIQUE/.test(e.message)) throw e;   // una registrazione gemella e' arrivata prima
        }
      }

      if (id === null) {
        const a = perEmail.get(email);
        registra('registrazione con email gia iscritta', a.id, ip);
        const esito = await spedisci(mailGiaIscritto({ a: email, link: link('password', nuovoGettone(a.id, 'password')) }), a.id, ip);
        if (esito === 'rifiutata') return [503, errore('posta', NON_SPEDITA)];
        return [202, { messaggio: SCRITTO(email) }];
      }

      registra('registrazione', id, ip);
      const a = perId.get(id);
      const cookie = apriSessione(id);
      const scade = iso(Date.parse(a.creato_il) + NON_CONFERMATO_MS);
      const esito = await spedisci(mailVerifica({ a: email, link: link('verifica', nuovoGettone(id, 'verifica')), scade }), id, ip);
      if (esito === 'rifiutata') return [503, errore('posta', NON_SPEDITA, descrivi(a)), { cookie }];
      return [201, { messaggio: SCRITTO(email), ...descrivi(a) }, { cookie }];
    },

    async accesso({ corpo, ip }) {
      const lim = limiti.accessiIp.prova(ip, ora());
      if (!lim.ok) return troppe(lim.fra, 'richieste di accesso');
      const email = normalizza(corpo?.email);
      const a = email ? perEmail.get(email) : undefined;
      const rifiuto = await controlla(email, a, corpo?.password, ip);
      if (rifiuto) return rifiuto;
      registra('accesso', a.id, ip);
      return [200, descrivi(perId.get(a.id)), { cookie: apriSessione(a.id) }];
    },

    uscita({ token }) {
      if (token) db.prepare('DELETE FROM sessione WHERE id_hash = ?').run(impronta(token));
      return [204, null, { cookie: togliCookie }];
    },

    ovunque({ account, ip }) {
      db.prepare('DELETE FROM sessione WHERE account_id = ?').run(account.id);
      registra('uscita da tutti i dispositivi', account.id, ip);
      return [204, null, { cookie: togliCookie }];
    },

    io({ account }) {
      return [200, descrivi(account)];
    },

    verifica({ corpo, ip }) {
      const g = gettoneValido(corpo?.gettone, 'verifica');
      if (!g) {
        return [410, errore('gettone', "Il link è scaduto o è già stato usato. Se l'indirizzo non è ancora "
          + "confermato, entra nel tuo account e scegli «rimandami la mail».")];
      }
      transazione(db, () => {
        db.prepare('UPDATE gettone SET usato_il = ? WHERE id_hash = ?').run(iso(), g.id_hash);
        db.prepare('UPDATE account SET email_verificata_il = COALESCE(email_verificata_il, ?) WHERE id = ?').run(iso(), g.account_id);
      });
      registra('email confermata', g.account_id, ip);
      return [200, descrivi(perId.get(g.account_id))];
    },

    async rinvia({ account, ip }) {
      if (account.email_verificata_il) return [200, descrivi(account)];
      const scade = iso(Date.parse(account.creato_il) + NON_CONFERMATO_MS);
      const esito = await spedisci(mailVerifica({ a: account.email, link: link('verifica', nuovoGettone(account.id, 'verifica')), scade }), account.id, ip);
      if (esito === 'rifiutata') return [503, errore('posta', NON_SPEDITA)];
      if (esito === 'limite') return [429, errore('troppe', "Ti abbiamo già scritto più volte nell'ultima ora: guarda nello spam, o riprova più tardi.")];
      return [202, { messaggio: SCRITTO(account.email) }];
    },

    dimenticata({ corpo, ip }) {
      const lim = limiti.richiesteIp.prova(ip, ora());
      if (!lim.ok) return troppe(lim.fra, 'richieste');
      const email = normalizza(corpo?.email);
      const a = email ? perEmail.get(email) : undefined;
      if (a) {
        registra('reimpostazione chiesta', a.id, ip);
        // Senza aspettare il fornitore: una mail che parte non deve allungare la
        // risposta, altrimenti il tempo direbbe chi e' iscritto (§5.3). Un
        // rifiuto va nel registro e nel log, dove il titolare lo vede.
        spedisci(mailPassword({ a: email, link: link('password', nuovoGettone(a.id, 'password')) }), a.id, ip)
          .catch((e) => log(`reimpostazione: ${e.message}`));
      }
      return [202, { messaggio: SE_ISCRITTO }];
    },

    async nuova({ corpo, ip }) {
      const g = gettoneValido(corpo?.gettone, 'password');
      if (!g) {
        return [410, errore('gettone', "Il link è scaduto o è già stato usato. Chiedine un altro da "
          + '«Ho dimenticato la password»: vale un\'ora.')];
      }
      const a = perId.get(g.account_id);
      // La password si controlla prima di usare il gettone: un rifiuto non lo brucia.
      const rifiuto = valutaPassword(corpo?.password, { email: a.email });
      if (rifiuto) return [422, errore('password', rifiuto.messaggio, { motivo: rifiuto.motivo })];
      const hash = await hashPassword(corpo.password, argon2);
      const eraConfermato = Boolean(a.email_verificata_il);
      transazione(db, () => {
        db.prepare('UPDATE gettone SET usato_il = ? WHERE id_hash = ?').run(iso(), g.id_hash);
        // La reimpostazione dimostra di possedere l'indirizzo: lo conferma, e
        // riaccende una password disattivata (§6.5, §9.6).
        db.prepare(`UPDATE account SET password = ?, accessi_falliti = 0, password_disattivata_il = NULL,
          email_verificata_il = COALESCE(email_verificata_il, ?) WHERE id = ?`).run(hash, iso(), a.id);
        // §6.3: reimpostando da email si chiudono tutte le sessioni.
        db.prepare('DELETE FROM sessione WHERE account_id = ?').run(a.id);
      });
      limiti.fallimenti.azzera(a.email);
      registra('password reimpostata', a.id, ip);
      // Chi ha scritto la password nuova e' qui: la sessione di questo
      // dispositivo e' nuova, e le vecchie restano chiuse. `confermato_ora` e
      // `righe` servono alla domanda del §9.6 — tienile o cancellale.
      return [200, { ...descrivi(perId.get(a.id)), confermato_ora: !eraConfermato }, { cookie: apriSessione(a.id) }];
    },

    async cambia({ account, token, corpo, ip }) {
      const rifiutoNuova = valutaPassword(corpo?.nuova, { email: account.email });
      if (rifiutoNuova) return [422, errore('password', rifiutoNuova.messaggio, { motivo: rifiutoNuova.motivo })];
      const rifiuto = await controlla(account.email, account, corpo?.attuale, ip);
      if (rifiuto) return rifiuto;
      const hash = await hashPassword(corpo.nuova, argon2);
      transazione(db, () => {
        db.prepare('UPDATE account SET password = ? WHERE id = ?').run(hash, account.id);
        // §6.3: tutte tranne quella da cui si e' cambiata.
        db.prepare('DELETE FROM sessione WHERE account_id = ? AND id_hash != ?').run(account.id, impronta(token));
      });
      registra('password cambiata', account.id, ip);
      return [200, descrivi(perId.get(account.id))];
    },

    /**
     * Il lavoro quotidiano: gli account non confermati da piu' di sette giorni
     * si cancellano con le loro righe — anche nel file delle cancellazioni,
     * cosi' un ripristino non li riporta —, sessioni e gettoni scaduti se ne
     * vanno, il registro perde gli indirizzi dopo sei mesi e gli eventi dopo un
     * anno (§14.3, §15.3).
     */
    manutenzione() {
      const t = ora();
      const vecchi = db.prepare('SELECT id FROM account WHERE email_verificata_il IS NULL AND creato_il < ?')
        .all(iso(t - NON_CONFERMATO_MS));
      for (const { id } of vecchi) {
        cancellaAccount(db, id, { cancellazioni, il: iso(t) });
        registra('account non confermato cancellato', id);
      }
      const sessioni = db.prepare('DELETE FROM sessione WHERE scade_il <= ?').run(iso(t)).changes;
      const gettoni = db.prepare('DELETE FROM gettone WHERE scade_il <= ?').run(iso(t)).changes;
      const seiMesi = new Date(t); seiMesi.setUTCMonth(seiMesi.getUTCMonth() - 6);
      const unAnno = new Date(t); unAnno.setUTCFullYear(unAnno.getUTCFullYear() - 1);
      const ipTolti = db.prepare('UPDATE registro SET ip = NULL WHERE ip IS NOT NULL AND quando < ?').run(seiMesi.toISOString()).changes;
      const eventiTolti = db.prepare('DELETE FROM registro WHERE quando < ?').run(unAnno.toISOString()).changes;
      for (const f of Object.values(limiti)) f.pulisci(t);
      return { non_confermati: vecchi.length, sessioni, gettoni, ip_tolti: ipTolti, eventi_tolti: eventiTolti };
    },
  };
}
