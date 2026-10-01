// Le letture del titolare: leggere un account, e annotarlo.
//
// docs/account-progetto.md §15.1 e §15.3. L'informativa dice che le risposte
// stanno sul server in chiaro, che il titolare legge quelle di un singolo
// account solo quando gli viene chiesto per un problema o per indagare un
// problema di sicurezza, e che «ogni lettura è annotata nel registro di
// sicurezza». Perche' sia vero, leggere e annotare sono **una funzione sola e
// una transazione sola**: la riga del registro si scrive prima di leggere, e
// quello che si e' letto esce solo dopo che la riga e' al sicuro. Se il
// registro non si puo' scrivere — un database in sola lettura, o di prima del
// registro — non si legge niente.
//
// Quello che la funzione restituisce viene dalle funzioni del motore, le
// stesse della pagina (`site/engine.js`): chi aiuta vede le attivita' che vede
// chi chiede aiuto, non una seconda contabilita' dello storico.
//
// La lettura non cambia niente dell'account: nessuna colonna, nessuna riga,
// nemmeno «ultimo accesso», che rimanderebbe la cancellazione per inattivita'.
// E non migra il database: e' del server (server/db.mjs, `apri()`).
//
// Niente HTTP: nessuna rotta espone una lettura. La lancia il titolare dalla
// macchina, con server/leggi.mjs, a servizio acceso. Un controllo in
// tests/test_server.mjs e' rosso se un altro file di `server/` importa questo
// modulo, o se un file nuovo legge le righe di un account senza dichiararlo.
//
// **Che cosa resta fuori:** una lettura fatta con `sqlite3` sulla macchina non
// passa di qui e non lascia traccia. E' della procedura del titolare: gli
// account si leggono con `leggi.mjs`, mai con `sqlite3`.

import { readFileSync } from 'node:fs';
import { transazione, versioneSchema, motivoPerIlRegistro } from './db.mjs';
import { NON_CONFERMATO_MS } from './conti.mjs';
import { sessioni, attivitaCarteggio, dettaglioCarteggio, ripiega, traccia, tagPerTentativo } from '../site/engine.js';

/** Il nome dell'evento nel registro: e' quello che l'informativa chiama «le letture fatte dal titolare». */
export const EVENTO_LETTURA = 'lettura del titolare';

// Il registro c'e' dallo schema 2, i punteggi dei Segnali dal 3.
const SCHEMA_DEL_REGISTRO = 2;
const SCHEMA_DEI_SEGNALI = 3;

/**
 * La banca di questo rilascio, per la copertura e per il dettaglio di carta e
 * tecniche. E' la stessa che la pagina carica: `site/dati/`.
 */
export function leggiBanche() {
  const leggi = (f) => JSON.parse(readFileSync(new URL(`../site/dati/${f}`, import.meta.url), 'utf8'));
  return { quiz: leggi('quiz.json'), carteggio: leggi('carteggio.json'), tecniche: leggi('tecniche.json') };
}

/**
 * Legge un account per conto del titolare, e lo annota nel registro: `quando`
 * (`il`), quale account — il numero, non l'email — e perche' (`motivo`).
 *
 * Restituisce `null`, senza scrivere niente, se nessun account ha
 * quell'indirizzo. Lancia, senza leggere niente, se il motivo manca o porta
 * un'email (`motivoPerIlRegistro()`), e se la riga del registro non si puo'
 * scrivere.
 *
 * Altrimenti:
 *
 *   lettura    la riga appena scritta: `{ quando, account, motivo }`
 *   account    l'account senza i suoi segreti — ne' la password, ne' la chiave
 *              della copia locale, ne' le impronte di sessioni e gettoni — con
 *              le sessioni aperte (le date) e i punteggi dei Segnali
 *   righe      le righe com'erano arrivate, nell'ordine del cursore
 *   conteggi   quante sono, per tipo
 *   copertura  per banca, i tre stati di `traccia()` sullo specchio di `ripiega()`
 *   quiz       `sessioni(righe, { confine: 'attivita' })`
 *   carteggio  `attivitaCarteggio(righe, { tipo: 'c' })`, ognuna con `conteggi`,
 *              `esito` e `mancanti` di `dettaglioCarteggio()`
 *   tecniche   lo stesso, con `tipo: 't'`
 *   tag        `tagPerTentativo(righe)`
 *   registro   gli eventi di questo account nel registro, compresa questa
 *              lettura e quelle di prima: e' da qui che una lettura si rendiconta
 */
export function leggiAccount(db, email, { motivo, il = new Date().toISOString(), banche = leggiBanche() } = {}) {
  motivo = motivoPerIlRegistro(motivo, 'perche\' si legge questo account, e su richiesta di chi. Va nel registro');
  const indirizzo = String(email ?? '').trim().toLowerCase();
  const schema = versioneSchema(db);
  if (schema === 0) throw new Error("non e' un database di questo server");
  if (schema < SCHEMA_DEL_REGISTRO) {
    throw new Error(`schema ${schema}: questo database non ha il registro, e una lettura che non si puo' annotare non si fa`);
  }
  return transazione(db, () => {
    const a = db.prepare('SELECT * FROM account WHERE email = ?').get(indirizzo);
    if (!a) return null;
    // Prima la riga, poi la lettura, e tutte e due nella stessa transazione:
    // se una delle due non riesce non resta ne' una lettura senza traccia ne'
    // una traccia senza lettura. Senza indirizzo IP: il titolare e' sulla macchina.
    db.prepare('INSERT INTO registro (quando, evento, account_id, dettaglio) VALUES (?, ?, ?, ?)').run(il, EVENTO_LETTURA, a.id, motivo);

    const righe = db.prepare('SELECT dati FROM riga WHERE account_id = ? ORDER BY seq').all(a.id).map((r) => JSON.parse(r.dati));
    const segnali = {};
    if (schema >= SCHEMA_DEI_SEGNALI) {
      for (const x of db.prepare('SELECT modo, migliore, giocate FROM segnali WHERE account_id = ? ORDER BY modo').all(a.id)) {
        segnali[x.modo] = { migliore: x.migliore, giocate: x.giocate };
      }
    }
    const quanti = (tipo) => righe.filter((r) => r._t === tipo).length;
    const specchio = ripiega(righe);
    const copertura = {};
    for (const kind of ['base', 'vela']) {
      const t = traccia(banche.quiz, specchio.quiz, il.slice(0, 10), kind, null);
      copertura[kind] = { totale: t.totale, coperti: t.coperti, da_ripassare: t.da_ripassare, mai_visti: t.mai_visti, risposte: t.risposte };
    }
    const delCarteggio = (tipo, banca) => attivitaCarteggio(righe, { tipo }).map((x) => {
      const d = dettaglioCarteggio(righe, banca, x.id, { tipo });
      return { ...x, conteggi: d.conteggi, esito: d.esito, mancanti: d.mancanti };
    });
    return {
      lettura: { quando: il, account: a.id, motivo },
      account: {
        id: a.id,
        email: a.email,
        creato_il: a.creato_il,
        email_verificata_il: a.email_verificata_il,
        scade_se_non_verificata: a.email_verificata_il ? null : new Date(Date.parse(a.creato_il) + NON_CONFERMATO_MS).toISOString(),
        ultimo_accesso_il: a.ultimo_accesso_il,
        avviso_inattivita_il: a.avviso_inattivita_il,
        data_esame: a.data_esame,
        generazione: a.generazione,
        azzerato_il: a.azzerato_il,
        accessi_falliti: a.accessi_falliti,
        password_disattivata_il: a.password_disattivata_il,
        fuori_statistiche_dal: a.fuori_statistiche_dal ?? null,
        sessioni: db.prepare('SELECT creata_il, scade_il FROM sessione WHERE account_id = ? ORDER BY creata_il').all(a.id).map((x) => ({ ...x })),
        segnali,
      },
      righe,
      conteggi: { righe: righe.length, quiz: quanti('q'), carteggio: quanti('c'), tecniche: quanti('t'), tag: quanti('g'), prove: quanti('s') },
      copertura,
      quiz: sessioni(righe, { confine: 'attivita' }),
      carteggio: delCarteggio('c', banche.carteggio),
      tecniche: delCarteggio('t', banche.tecniche),
      tag: { ...tagPerTentativo(righe) },
      registro: db.prepare('SELECT quando, evento, ip, dettaglio FROM registro WHERE account_id = ? ORDER BY id').all(a.id).map((x) => ({ ...x })),
    };
  });
}
