// Legge un account per conto del titolare, dalla macchina, e lo annota nel registro.
//
//   node server/leggi.mjs --email chi@esempio.it --motivo "richiesta di supporto a privacy@ del 3 ottobre"
//        [--attivita <id>]    anche le righe di una attivita', com'erano
//        [--json]             tutto in JSON su stdout, righe comprese
//        [--db /var/lib/rg/conti.db]
//
// docs/account-progetto.md §15.1. L'informativa dice che il titolare legge le
// risposte di un singolo account solo quando gli viene chiesto per un problema,
// o per indagare un problema di sicurezza, e che ogni lettura e' annotata nel
// registro di sicurezza. Questo e' lo strumento con cui legge: mostra l'account
// e le sue attivita' con le funzioni del motore (server/letture.mjs), non
// cambia niente dell'account, e scrive nel registro quando, quale account e
// perche'. Funziona con il servizio acceso.
//
// **Senza motivo non si legge**, e il motivo non porta email: nel registro
// l'account e' un numero, e la riga resta li' un anno (§15.3), anche se
// l'account intanto si cancella. Ogni lettura e' una riga, anche la seconda
// dello stesso account con lo stesso motivo.
//
// Gli account si leggono da qui, mai con `sqlite3`: quella lettura non la
// annota nessuno.
//
// Esce 0 se ha letto e annotato; 1 se l'account o il database non ci sono, o
// se la lettura non si e' potuta annotare — e allora non mostra niente —; 2 se
// e' stato chiamato male.

import { existsSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { parseArgs } from 'node:util';
import { motivoPerIlRegistro } from './db.mjs';
import { leggiAccount } from './letture.mjs';

const USO = 'uso: node server/leggi.mjs --email <indirizzo> --motivo "<perche\' si legge, e su richiesta di chi>" [--attivita <id> | --json] [--db …]';

let values;
try {
  ({ values } = parseArgs({
    options: {
      email: { type: 'string' },
      motivo: { type: 'string' },
      attivita: { type: 'string' },
      json: { type: 'boolean' },
      db: { type: 'string', default: '/var/lib/rg/conti.db' },
    },
  }));
} catch (e) {
  console.error(`${e.message}\n${USO}`);
  process.exit(2);
}

const email = (values.email ?? '').trim().toLowerCase();
if (!email || (values.json && values.attivita !== undefined)) {
  console.error(USO);
  process.exit(2);
}
let motivo;
try {
  motivo = motivoPerIlRegistro(values.motivo, "perche' si legge questo account, e su richiesta di chi. Va nel registro");
} catch (e) {
  console.error(`${e.message}\n${USO}`);
  process.exit(2);
}
// Un percorso sbagliato non deve creare un database vuoto e dire «nessun account».
if (!existsSync(values.db)) {
  console.error(`${values.db}: il database non c'e'`);
  process.exit(1);
}

// Aperto in scrittura, perche' la lettura si annota; ma senza `apri()`: questo
// strumento non crea e non migra niente, e un file che non e' un database di
// questo server resta com'e'.
const db = new DatabaseSync(values.db);
let letto;
try {
  db.exec('PRAGMA busy_timeout = 5000');
  letto = leggiAccount(db, email, { motivo });
} catch (e) {
  console.error(`non letto, e niente annotato: ${e.message}`);
  process.exitCode = 1;
} finally {
  db.close();
}

if (letto === null) {
  console.error(`nessun account con l'indirizzo ${email}: niente è stato letto, niente annotato`);
  process.exitCode = 1;
} else if (letto) {
  const { lettura } = letto;
  const annotata = `lettura annotata nel registro: account ${lettura.account}, ${lettura.quando} — «${lettura.motivo}»`;
  if (values.json) {
    // Su stdout il JSON e basta: che la lettura e' annotata lo dice stderr.
    console.error(annotata);
    console.log(JSON.stringify(letto, null, 2));
  } else {
    console.log([annotata, '', ...testo(letto)].join('\n'));
    if (values.attivita !== undefined) {
      const trovate = [['quiz', letto.quiz], ['carteggio', letto.carteggio], ['tecniche', letto.tecniche]]
        .flatMap(([che, elenco]) => elenco.filter((x) => String(x.id) === values.attivita).map((x) => [che, x]));
      if (!trovate.length) {
        console.error(`nessuna attività «${values.attivita}» in questo account: gli id sono quelli dell'elenco qui sopra`);
      }
      for (const [che, x] of trovate) {
        console.log(`\nATTIVITÀ ${x.id} — ${che}, ${x.righe.length} righe, com'erano${x.prova ? ', e la riga della prova' : ''}`);
        for (const r of x.righe) console.log(JSON.stringify(r));
        if (x.prova) console.log(JSON.stringify(x.prova));
      }
    }
  }
}

/** L'account e le sue attivita', per chi legge a schermo. Le righe no: quelle con --attivita o --json. */
function testo({ account: a, conteggi: c, copertura, quiz, carteggio, tecniche, tag, registro }) {
  const o = (v) => v ?? '—';
  const minuti = (ms) => (ms == null ? 'durata non misurata' : ms < 30000 ? 'meno di 1 min' : `${Math.round(ms / 60000)} min`);
  const note = (x) => `${x.fonte === 'risposte' ? ' · confine ricostruito' : ''}${x.ambigua ? ` · AMBIGUA: ${x.motivi.join(', ')}` : ''}`;
  const segnali = Object.entries(a.segnali).map(([modo, p]) => `${modo}: migliore ${p.migliore}, giocate ${p.giocate}`).join(' · ');
  const out = [
    `ACCOUNT ${a.id}`,
    `  email              ${a.email} — ${a.email_verificata_il ? `confermata il ${a.email_verificata_il}` : `NON confermata: si cancella il ${a.scade_se_non_verificata}`}`,
    `  creato il          ${a.creato_il}`,
    `  ultimo accesso     ${a.ultimo_accesso_il}${a.avviso_inattivita_il ? ` · avviso di inattività del ${a.avviso_inattivita_il}` : ''}`,
    `  data d'esame       ${o(a.data_esame)}`,
    `  generazione        ${a.generazione}${a.azzerato_il ? ` · azzerato il ${a.azzerato_il}` : ''}`,
    `  password           ${a.password_disattivata_il ? `DISATTIVATA il ${a.password_disattivata_il}` : 'attiva'} · accessi falliti di fila: ${a.accessi_falliti}`,
    `  sessioni           ${a.sessioni.length}${a.sessioni.map((s) => `\n                       dal ${s.creata_il} al ${s.scade_il}`).join('')}`,
    `  statistiche        ${a.fuori_statistiche_dal ? `fuori dai conteggi dal ${a.fuori_statistiche_dal}` : 'nei conteggi'}`,
    `  Segnali            ${segnali || '—'}`,
    '',
    `RIGHE — ${c.righe} righe: quiz ${c.quiz} · carteggio ${c.carteggio} · tecniche ${c.tecniche} · tag ${c.tag} · prove ${c.prove}`,
    '',
    "COPERTURA — traccia() del motore sulla banca di questo rilascio, all'ultima risposta",
    ...Object.entries(copertura).map(([kind, t]) =>
      `  ${kind.padEnd(5)} coperti ${t.coperti} · da ripassare ${t.da_ripassare} · mai visti ${t.mai_visti} · di ${t.totale} — ${t.risposte} risposte`),
    '',
    `QUIZ — ${quiz.length} attività, dalla più recente: sessioni() del motore, con il confine dell'attività`,
    ...quiz.map((s) => `  ${o(s.inizio)}  ${o(s.mode)} · ${o(s.kind)}  ${s.esatte}/${s.n} esatte  ${minuti(s.durata)}  id ${s.id}`
      + `${s.prova ? ` · prova: ${s.prova.score}/${s.prova.total}, ${s.prova.passed ? 'superata' : 'non superata'}` : ''}${note(s)}`),
    '',
    `CARTEGGIO — ${carteggio.length} attività: attivitaCarteggio() e dettaglioCarteggio() del motore`,
    ...carteggio.map((x) => `  ${o(x.inizio)}  ${o(x.mode)}  esercizi ${x.n}${x.proposti == null ? '' : ` di ${x.proposti}`}  `
      + `${x.conteggi ? `coincidenti ${x.conteggi.coincidenti} · da rivedere ${x.conteggi.daRivedere} · senza giudizio ${x.conteggi.senzaGiudizio}` : 'conteggi non disponibili'}`
      + `${x.esito ? ` · prova: ${x.esito.coincidenti} su ${x.esito.su}, soglia ${x.esito.soglia}` : ''}  id ${x.id}${note(x)}`),
    '',
    `TECNICHE — ${tecniche.length} attività`,
    ...tecniche.map((x) => `  ${o(x.inizio)}  ${o(x.mode)}  risposte ${x.n}${x.proposti == null ? '' : ` di ${x.proposti}`}  `
      + `${x.conteggi ? `coincidenti ${x.conteggi.coincidenti} · non coincidenti ${x.conteggi.nonCoincidenti}` : 'conteggi non disponibili'}  id ${x.id}${note(x)}`),
    '',
    `TAG — ${Object.keys(tag).length} tentativi con un tag N/L/C`,
    '',
    `REGISTRO dell'account — ${registro.length > 20 ? `gli ultimi 20 eventi di ${registro.length}` : `${registro.length} eventi`}`,
    ...registro.slice(-20).map((e) => `  ${e.quando}  ${e.evento}${e.ip ? `  da ${e.ip}` : ''}${e.dettaglio ? `  — ${e.dettaglio}` : ''}`),
  ];
  return out;
}
