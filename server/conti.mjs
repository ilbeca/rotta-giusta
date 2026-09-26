// L'account: registrazione, accesso, sessione, verifica dell'email, password.
//
// docs/account-progetto.md §5, §6, §7.1, §9, §13, §14, §15.3. Niente HTTP qui
// dentro: ogni operazione riceve quello che la richiesta porta e restituisce
// `[codice, corpo, { cookie, attesa }]`; server/server.mjs fa il resto.
//
// L'orologio e' passato da fuori (`ora()`, in millisecondi): la suite lo sposta
// per provare i trenta giorni della sessione, i gettoni e le attese senza
// aspettarli. Le righe e la sincronia stanno in server/righe.mjs; qui c'e'
// l'azzeramento, che chiede la password come le altre operazioni dell'account.

import { randomBytes, createHash } from 'node:crypto';
import { creaAccount, cancellaAccount, azzera as azzeraProgressi, transazione, leggiEpoca, svuotaWal } from './db.mjs';
import { hashPassword, verificaPassword, valutaPassword, PARAMETRI } from './password.mjs';
import { Finestra, Fallimenti, DISATTIVA_A } from './limiti.mjs';
import {
  mailVerifica, mailPassword, mailDisattivata, mailCambioEmail, mailAvvisoEmail, mailCancellato, mailInattivita,
} from './posta.mjs';
import { SEGNALI, lunghezzaPartita } from '../site/engine.js';

const MINUTO = 60000;
const ORA = 60 * MINUTO;
const GIORNO = 24 * ORA;

export const SESSIONE_MS = 30 * GIORNO;       // §6.2: dall'accesso, e non si sposta
export const NON_CONFERMATO_MS = 7 * GIORNO;  // §9.6, R-ACC-11
const DURATA = { verifica: 24 * ORA, password: ORA, email: 24 * ORA };   // §9.1

// §14.2: due anni senza attivita', e l'avviso trenta giorni prima. La
// cancellazione arriva trenta giorni dopo l'avviso, non prima: se il lavoro
// quotidiano e' rimasto fermo, nessuno si cancella senza essere stato avvisato.
export const AVVISO_INATTIVITA_GIORNI = 700;
export const DOPO_AVVISO_MS = 30 * GIORNO;

// I modi del gioco dei Segnali, dal motore: un modo che non esiste li' non
// entra nel profilo (§13.2).
const MODI_SEGNALI = new Set(SEGNALI.map((x) => x.modo));
const DATA = /^\d{4}-\d{2}-\d{2}$/;

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
const GIA_REGISTRATA = 'Questa email è già registrata. Se è tua, accedi con la tua password, '
  + 'oppure reimpostala da «Ho dimenticato la password».';

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

  /** I punteggi dei Segnali, nella forma di `segPunti` della pagina: `{ modo: { migliore, giocate } }`. */
  function segnaliDi(id) {
    const tutti = {};
    for (const x of db.prepare('SELECT modo, migliore, giocate FROM segnali WHERE account_id = ? ORDER BY modo').all(id)) {
      tutti[x.modo] = { migliore: x.migliore, giocate: x.giocate };
    }
    return tutti;
  }

  function descrivi(a) {
    const r = db.prepare('SELECT count(*) n, COALESCE(MAX(seq), 0) s FROM riga WHERE account_id = ?').get(a.id);
    return {
      email: a.email,
      verificata: Boolean(a.email_verificata_il),
      scade_se_non_verificata: a.email_verificata_il ? null : iso(Date.parse(a.creato_il) + NON_CONFERMATO_MS),
      data_esame: a.data_esame,
      segnali: segnaliDi(a.id),
      generazione: a.generazione,
      azzerato_il: a.azzerato_il,
      epoca: leggiEpoca(db),
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

  /** Le tre strade che cancellano un account — chiesta, non confermato, inattivo — passano di qui (§14). */
  function cancellaDavvero(id, il = iso()) {
    if (!cancellaAccount(db, id, { cancellazioni, il })) log(`account ${id} cancellato, ma il WAL non si e' svuotato: ci riprova il lavoro quotidiano`);
  }

  /**
   * Attivita' (§14.2): `ultimo_accesso_il` e' il giorno, non l'ora — basta a
   * contare due anni e dice meno di come si studia. Un avviso d'inattivita' gia'
   * partito decade: chi e' tornato non si cancella, e la prossima volta riceve
   * un avviso nuovo.
   */
  function attivo(a) {
    const oggi = iso().slice(0, 10);
    if (a.ultimo_accesso_il !== oggi || a.avviso_inattivita_il) {
      db.prepare('UPDATE account SET ultimo_accesso_il = ?, avviso_inattivita_il = NULL WHERE id = ?').run(oggi, a.id);
    }
  }

  /** L'account di una sessione valida, o `null`. Ogni richiesta con una sessione valida e' attivita'. */
  function sessione(token) {
    if (!token) return null;
    const a = db.prepare(`
      SELECT a.* FROM sessione s JOIN account a ON a.id = s.account_id
      WHERE s.id_hash = ? AND s.scade_il > ?`).get(impronta(token), iso());
    if (!a) return null;
    attivo(a);
    return a;
  }

  /** Il limite di 600 richieste l'ora per sessione (§6.5). */
  function richiestaDiSessione(token) {
    return limiti.perSessione.prova(impronta(token).toString('hex'), ora());
  }

  // --- i gettoni (§9.1) ---------------------------------------------------------------
  function nuovoGettone(accountId, scopo, nuovaEmail = null) {
    const g = nuovoToken();
    transazione(db, () => {
      // Un gettone nuovo dello stesso scopo annulla i precedenti.
      db.prepare('DELETE FROM gettone WHERE account_id = ? AND scopo = ? AND usato_il IS NULL').run(accountId, scopo);
      db.prepare('INSERT INTO gettone (id_hash, account_id, scopo, nuova_email, creato_il, scade_il) VALUES (?, ?, ?, ?, ?, ?)')
        .run(impronta(g), accountId, scopo, nuovaEmail, iso(), iso(ora() + DURATA[scopo]));
    });
    return g;
  }

  // Una password cambiata o reimpostata chiude un cambio d'indirizzo in
  // sospeso: e' il rimedio che l'avviso al vecchio indirizzo suggerisce a chi
  // non l'ha chiesto, e deve funzionare davvero.
  const chiudiCambiEmail = (id) => db.prepare("DELETE FROM gettone WHERE account_id = ? AND scopo = 'email'").run(id);

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
   *
   * Ogni mail partita e' una riga «mail spedita» nel registro: e' da li' che si
   * contano le 300 del mese (§9.3). Una mail al titolare rifiutata ha un evento
   * suo, che non e' un allarme: altrimenti l'allarme per la mail rifiutata
   * rifiuterebbe la sua mail, e cosi' a ogni giro.
   */
  async function spedisci(m, accountId, ip, { titolare = false } = {}) {
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
      registra(titolare ? 'mail al titolare rifiutata' : 'mail rifiutata', accountId, ip, String(e?.message ?? e).slice(0, 200));
      log(`mail${titolare ? ' al titolare' : ''} rifiutata dal fornitore: ${String(e?.message ?? e).slice(0, 200)}`);
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
      // Il limite non conta le password rifiutate: chi ne prova cinque troppo
      // corte non resta fuori un'ora per questo. Conta invece «email gia'
      // registrata», che e' il freno rimasto contro chi la usa per sapere chi e'
      // iscritto (§5.3): e la password si guarda prima, quindi l'iscrizione si
      // scopre solo pagando uno dei cinque posti.
      const lim = limiti.richiesteIp.prova(ip, ora());
      if (!lim.ok) return troppe(lim.fra, 'richieste');

      // Deciso dall'autore il 26 settembre 2026 (§5.3): si dice apertamente,
      // senza sessione, senza mail e senza calcolare un hash che non serve.
      const gia = () => {
        registra('registrazione con email gia iscritta', perEmail.get(email)?.id ?? null, ip);
        return [409, errore('email_registrata', GIA_REGISTRATA)];
      };
      if (perEmail.get(email)) return gia();
      const hash = await hashPassword(corpo.password, argon2);
      let id;
      try {
        id = creaAccount(db, { email, password: hash, ora: iso() });
      } catch (e) {
        if (!/UNIQUE/.test(e.message)) throw e;
        return gia();   // una registrazione gemella e' arrivata prima
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
      attivo(a);
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
        chiudiCambiEmail(a.id);
      });
      attivo(a);
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
        chiudiCambiEmail(account.id);
      });
      registra('password cambiata', account.id, ip);
      return [200, descrivi(perId.get(account.id))];
    },

    /**
     * Azzera i progressi (§8.4): toglie le righe, tiene l'account, alza la
     * generazione. Chiede la password, e un tentativo sbagliato conta come un
     * accesso fallito. Passa dal file delle cancellazioni prima del database
     * (§2.7), cosi' un ripristino da una copia di prima non riporta le righe.
     */
    async azzera({ account, corpo, ip }) {
      const rifiuto = await controlla(account.email, account, corpo?.password, ip);
      if (rifiuto) return rifiuto;
      azzeraProgressi(db, account.id, { cancellazioni, il: iso() });
      registra('progressi azzerati', account.id, ip);
      return [200, descrivi(perId.get(account.id))];
    },

    /**
     * Cambia l'indirizzo (§7.1, §6.3). Con la password e un indirizzo gia'
     * confermato (§9.6); al nuovo parte un link che vale 24 ore, al vecchio un
     * avviso che dice verso dove. Finche' il nuovo non conferma, niente cambia.
     */
    async emailCambia({ account, corpo, ip }) {
      if (!account.email_verificata_il) {
        return [403, errore('non_confermata', "Prima conferma l'indirizzo che hai adesso, con il link che ti abbiamo mandato: "
          + "si cambia email solo dopo aver dimostrato di possederne una.")];
      }
      const nuova = normalizza(corpo?.nuova);
      if (!MAIL.test(nuova) || nuova.length > 254) {
        return [422, errore('email', "Il nuovo indirizzo email non sembra valido: controllalo e riprova.")];
      }
      if (nuova === account.email) return [422, errore('email', "È già l'indirizzo di questo account.")];
      const rifiuto = await controlla(account.email, account, corpo?.password, ip);
      if (rifiuto) return rifiuto;
      if (perEmail.get(nuova)) return [409, errore('email_registrata', 'Questo indirizzo è già registrato su un altro account.')];

      const esito = await spedisci(mailCambioEmail({ a: nuova, vecchia: account.email, link: link('email', nuovoGettone(account.id, 'email', nuova)) }), account.id, ip);
      if (esito === 'rifiutata') return [503, errore('posta', NON_SPEDITA)];
      if (esito === 'limite') return [429, errore('troppe', "A quell'indirizzo abbiamo già scritto più volte nell'ultima ora: guarda nello spam, o riprova più tardi.")];
      registra('cambio email chiesto', account.id, ip);
      // L'avviso al vecchio indirizzo non ferma la richiesta se non parte: il
      // cambio vuole comunque la conferma del nuovo. Il rifiuto va nel registro.
      await spedisci(mailAvvisoEmail({ a: account.email, nuova }), account.id, ip);
      return [202, { messaggio: SCRITTO(nuova) }];
    },

    /** Conferma il nuovo indirizzo, dal link: non chiede una sessione, si puo' aprire da un altro dispositivo. */
    emailConferma({ corpo, ip }) {
      const g = gettoneValido(corpo?.gettone, 'email');
      if (!g) {
        return [410, errore('gettone', "Il link è scaduto o è già stato usato: l'indirizzo non è cambiato. "
          + 'Se vuoi ancora cambiarlo, chiedilo di nuovo dal tuo account.')];
      }
      const vecchia = perId.get(g.account_id).email;
      try {
        transazione(db, () => {
          db.prepare('UPDATE gettone SET usato_il = ? WHERE id_hash = ?').run(iso(), g.id_hash);
          // Aprire il link dimostra di possedere il nuovo indirizzo: e' confermato.
          db.prepare('UPDATE account SET email = ?, email_verificata_il = ? WHERE id = ?').run(g.nuova_email, iso(), g.account_id);
        });
      } catch (e) {
        if (!/UNIQUE/.test(e.message)) throw e;
        return [409, errore('email_registrata', "Nel frattempo questo indirizzo è stato registrato da un altro account: "
          + "il tuo resta con quello di prima.")];
      }
      limiti.fallimenti.azzera(vecchia);
      registra('email cambiata', g.account_id, ip);
      return [200, descrivi(perId.get(g.account_id))];
    },

    /**
     * Il profilo (§13): la data d'esame, facoltativa, e i punteggi dei Segnali.
     * Un campo assente resta com'e'; `data_esame: null` la toglie. I punteggi si
     * fondono con il massimo, sia il migliore sia le partite: rimandare gli
     * stessi valori non cambia niente (§13.2). Tutto si controlla prima di
     * scrivere: un campo rotto non lascia scritti gli altri.
     */
    profilo({ account, corpo, ip }) {
      if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) {
        return [422, errore('profilo', 'Il corpo è { data_esame, segnali }, e ognuno dei due si può omettere.')];
      }
      const cambi = {};
      if ('data_esame' in corpo) {
        const d = corpo.data_esame;
        const vera = typeof d === 'string' && DATA.test(d) && new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) === d;
        if (d !== null && !vera) {
          return [422, errore('data_esame', "La data d'esame è una data vera nella forma AAAA-MM-GG, oppure null per toglierla.")];
        }
        cambi.data_esame = d;
      }
      if ('segnali' in corpo) {
        const sg = corpo.segnali;
        const cattivo = (msg) => [422, errore('segnali', msg)];
        if (!sg || typeof sg !== 'object' || Array.isArray(sg)) return cattivo('I punteggi dei Segnali sono { modo: { migliore, giocate } }.');
        for (const [modo, p] of Object.entries(sg)) {
          if (!MODI_SEGNALI.has(modo)) return cattivo(`«${String(modo).slice(0, 20)}» non è un modo del gioco dei Segnali: sono ${[...MODI_SEGNALI].join(', ')}.`);
          const max = lunghezzaPartita(modo);
          if (!p || !Number.isInteger(p.migliore) || !Number.isInteger(p.giocate)
              || p.migliore < 0 || p.migliore > max || p.giocate < 0 || p.giocate > 1e6) {
            return cattivo(`Il punteggio di «${modo}» vuole migliore fra 0 e ${max} e giocate da 0 in su, numeri interi.`);
          }
        }
        cambi.segnali = sg;
      }
      transazione(db, () => {
        if ('data_esame' in cambi) db.prepare('UPDATE account SET data_esame = ? WHERE id = ?').run(cambi.data_esame, account.id);
        for (const [modo, p] of Object.entries(cambi.segnali ?? {})) {
          db.prepare(`INSERT INTO segnali (account_id, modo, migliore, giocate) VALUES (?, ?, ?, ?)
            ON CONFLICT (account_id, modo) DO UPDATE SET migliore = MAX(migliore, excluded.migliore), giocate = MAX(giocate, excluded.giocate)`)
            .run(account.id, modo, p.migliore, p.giocate);
        }
      });
      return [200, descrivi(perId.get(account.id))];
    },

    /**
     * Cancella l'account, adesso (§14.1): con la password; prima nel file delle
     * cancellazioni, poi righe, sessioni, gettoni, segnali e account in una
     * transazione (§2.7). Una mail conferma che e' successo, e il registro tiene
     * l'evento con l'`id` interno, senza l'email.
     */
    async cancella({ account, corpo, ip }) {
      const rifiuto = await controlla(account.email, account, corpo?.password, ip);
      if (rifiuto) return rifiuto;
      const email = account.email;
      cancellaDavvero(account.id);
      registra('account cancellato', account.id, ip);
      limiti.fallimenti.azzera(email);
      await spedisci(mailCancellato({ a: email }), account.id, ip);
      return [204, null, { cookie: togliCookie }];
    },

    /** Per gli allarmi (server/allarmi.mjs): la stessa posta, con gli stessi limiti e lo stesso registro. */
    spedisci,
    registra,

    /**
     * Il lavoro quotidiano: gli account non confermati da piu' di sette giorni
     * si cancellano con le loro righe — anche nel file delle cancellazioni,
     * cosi' un ripristino non li riporta —, sessioni e gettoni scaduti se ne
     * vanno, il registro perde gli indirizzi dopo sei mesi e gli eventi dopo un
     * anno (§14.3, §15.3). E i due anni (§14.2): a 700 giorni senza attivita'
     * l'avviso con la data; trenta giorni dopo, se nessuno e' tornato, la
     * cancellazione. Il segno dell'avviso sta nel database.
     */
    async manutenzione() {
      const t = ora();
      const vecchi = db.prepare('SELECT id FROM account WHERE email_verificata_il IS NULL AND creato_il < ?')
        .all(iso(t - NON_CONFERMATO_MS));
      for (const { id } of vecchi) {
        cancellaDavvero(id, iso(t));
        registra('account non confermato cancellato', id);
      }

      // Una mail rifiutata o oltre il limite non segna l'avviso: si riprova
      // domani, e la cancellazione aspetta trenta giorni da un avviso partito.
      let avvisi = 0;
      const daAvvisare = db.prepare(`SELECT * FROM account WHERE avviso_inattivita_il IS NULL AND ultimo_accesso_il <= ?`)
        .all(iso(t - AVVISO_INATTIVITA_GIORNI * GIORNO).slice(0, 10));
      for (const a of daAvvisare) {
        const il = iso(Math.max(Date.parse(a.ultimo_accesso_il) + 730 * GIORNO, t + DOPO_AVVISO_MS));
        if (await spedisci(mailInattivita({ a: a.email, il, sito }), a.id, null) !== 'ok') continue;
        db.prepare('UPDATE account SET avviso_inattivita_il = ? WHERE id = ?').run(iso(t), a.id);
        registra('avviso di inattivita', a.id);
        avvisi++;
      }
      const inattivi = db.prepare('SELECT id FROM account WHERE avviso_inattivita_il IS NOT NULL AND avviso_inattivita_il <= ?')
        .all(iso(t - DOPO_AVVISO_MS));
      for (const { id } of inattivi) {
        cancellaDavvero(id, iso(t));
        registra('account inattivo cancellato', id);
      }

      const sessioni = db.prepare('DELETE FROM sessione WHERE scade_il <= ?').run(iso(t)).changes;
      const gettoni = db.prepare('DELETE FROM gettone WHERE scade_il <= ?').run(iso(t)).changes;
      const seiMesi = new Date(t); seiMesi.setUTCMonth(seiMesi.getUTCMonth() - 6);
      const unAnno = new Date(t); unAnno.setUTCFullYear(unAnno.getUTCFullYear() - 1);
      const ipTolti = db.prepare('UPDATE registro SET ip = NULL WHERE ip IS NOT NULL AND quando < ?').run(seiMesi.toISOString()).changes;
      const eventiTolti = db.prepare('DELETE FROM registro WHERE quando < ?').run(unAnno.toISOString()).changes;
      for (const f of Object.values(limiti)) f.pulisci(t);
      // La rete sotto le cancellazioni: se una non e' riuscita a svuotare il
      // WAL, ci riesce questa, e con lei anche i registri tolti qui sopra.
      if (!svuotaWal(db)) log("manutenzione: il WAL non si e' svuotato, c'e' un lettore aperto");
      return {
        non_confermati: vecchi.length, avvisi_inattivita: avvisi, cancellati_inattivita: inattivi.length,
        sessioni, gettoni, ip_tolti: ipTolti, eventi_tolti: eventiTolti,
      };
    },
  };
}
