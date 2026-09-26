// Il server degli account: la salute e l'account.
//
// docs/account-progetto.md §2.2 e §16.2: `node:http`, `node:sqlite`, zero
// dipendenze; importa `site/engine.js` dal rilascio in uso, cosi' il browser e
// il server rifiutano le stesse righe per gli stessi motivi. Le rotte del §7
// arrivano un pezzo per volta, ognuna con i suoi test in tests/test_server.mjs:
// qui la salute, l'account (§7.1, P-09) e le righe con la sincronia (§7.2,
// P-10); il cambio d'indirizzo, il profilo e la cancellazione sono il pezzo
// dopo.
//
//   RG_DB=… RG_CANCELLAZIONI=… RG_PORTA=8620 node server/server.mjs
//
// Sulla macchina lo avvia l'unita' `rg-api` (§2.7), dietro il proxy che fa
// HTTPS: per questo ascolta su 127.0.0.1 se non gli si dice altro.

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { SCHEMA, apri, versioneSchema, leggiEpoca } from './db.mjs';
import { hashPassword, calcolati, PARAMETRI } from './password.mjs';
import { creaConti, COOKIE } from './conti.mjs';
import { creaRighe, CORPO_RIGHE } from './righe.mjs';
import { postaScaleway, postaAssente } from './posta.mjs';

// La versione si legge dalla radice del codice, non dalla cartella dei dati:
// sono due posti diversi sulla macchina (/srv/rg/attuale e /var/lib/rg), ed e'
// la lezione della 0.4.5 — un'istanza che legge `0.0.0` non si riconosce.
const VERSIONE = readFileSync(new URL('../VERSION', import.meta.url), 'utf8').trim();

// Un corpo dell'account e' un'email e una password: 16 KiB bastano e avanzano.
// L'invio delle righe ha il suo limite, quello del §7.2 (server/righe.mjs).
const CORPO_MASSIMO = 16 * 1024;

// Ogni errore dice che cosa e' successo e che cosa fare (§7, e §8 della specifica).
const errore = (codice, messaggio) => ({ errore: codice, messaggio });

class Rifiuto extends Error {
  constructor(codice, corpo) { super(corpo.messaggio); this.codice = codice; this.corpo = corpo; }
}

const troppoGrande = (massimo) => new Rifiuto(413, errore('troppo_grande',
  `La richiesta è troppo grande: al più ${massimo >= 1048576 ? `${massimo / 1048576} MiB` : `${massimo / 1024} KiB`}. Niente è stato salvato.`));

// Oltre il limite il corpo si lascia scorrere senza tenerlo, e la risposta e'
// un 413 che il client legge: chiudere la connessione mentre il client scrive
// ancora gli da' un ECONNRESET — misurato scrivendo il test —, cioe' un errore
// di rete che non spiega che cosa rimandare. Oltre quattro volte il limite si
// chiude comunque: e' qualcuno che manda roba a caso.
function leggiCorpo(req, massimo) {
  return new Promise((ok, ko) => {
    const pezzi = [];
    let n = 0;
    req.on('data', (p) => {
      n += p.length;
      if (n <= massimo) pezzi.push(p);
      else if (n > 4 * massimo) { ko(troppoGrande(massimo)); req.destroy(); }
    });
    req.on('end', () => {
      if (n > massimo) return ko(troppoGrande(massimo));
      const testo = Buffer.concat(pezzi).toString('utf8');
      if (!testo) return ok(undefined);
      try { ok(JSON.parse(testo)); } catch { ko(new Rifiuto(400, errore('json', 'Il corpo della richiesta non è JSON valido.'))); }
    });
    req.on('error', ko);
  });
}

function tokenDalCookie(req) {
  for (const parte of (req.headers.cookie || '').split(';')) {
    const [nome, ...valore] = parte.trim().split('=');
    if (nome === COOKIE) return valore.join('=') || null;
  }
  return null;
}

/**
 * Avvia il server. Restituisce `{ indirizzo, db, chiudi, calcoli, manutenzione }`:
 * `db` serve alla suite, che lavora sullo stesso database del server che
 * interroga; `calcoli` conta gli hash di Argon2id (§5.3).
 *
 * Tre cose si passano da fuori, e la suite le cambia: `ora`, l'orologio in
 * millisecondi; `posta`, il fornitore (`{ invia(mail) }`); `argon2`, i
 * parametri — `null` o assenti vuol dire quelli del §20.
 */
export async function avvia({
  db: percorsoDb, cancellazioni, porta = 8620, host = '127.0.0.1', log = (m) => console.error(m),
  ora = Date.now, posta = postaAssente, argon2 = null,
  origine = 'https://rottagiusta.it', sito = 'https://rottagiusta.it', proxy = false,
} = {}) {
  if (!percorsoDb) throw new Error('manca il percorso del database (RG_DB)');
  if (!cancellazioni) throw new Error('manca il percorso del file delle cancellazioni (RG_CANCELLAZIONI)');
  const parametri = argon2 ?? PARAMETRI;
  const db = apri(percorsoDb, { log });
  // L'hash con cui si controlla la password di un'email che non esiste (§5.3):
  // una volta, adesso, con i parametri veri, cosi' costa quanto uno vero.
  const fittizia = await hashPassword(randomBytes(24).toString('base64'), parametri);
  const conti = creaConti({ db, ora, argon2: parametri, posta, sito, cancellazioni, fittizia, log });
  const righe = creaRighe({ db, ora, versione: VERSIONE });

  // Le rotte: [gestore, che cosa chiede, quanto puo' pesare il corpo].
  // `sessione` vuol dire che senza una sessione valida la risposta e' 401 prima
  // di arrivare al gestore.
  const salute = () => [200, {
    stato: 'ok',
    versione: VERSIONE,
    schema: { codice: SCHEMA, database: versioneSchema(db) },
    epoca: leggiEpoca(db),
  }];
  const rotte = {
    '/v1/salute': { GET: [salute] },
    '/v1/registrazione': { POST: [conti.registrazione] },
    '/v1/accesso': { POST: [conti.accesso] },
    '/v1/uscita': { POST: [conti.uscita] },
    '/v1/uscita/ovunque': { POST: [conti.ovunque, 'sessione'] },
    '/v1/io': { GET: [conti.io, 'sessione'] },
    '/v1/verifica': { POST: [conti.verifica] },
    '/v1/verifica/rinvia': { POST: [conti.rinvia, 'sessione'] },
    '/v1/password/dimenticata': { POST: [conti.dimenticata] },
    '/v1/password/nuova': { POST: [conti.nuova] },
    '/v1/password/cambia': { POST: [conti.cambia, 'sessione'] },
    '/v1/azzera': { POST: [conti.azzera, 'sessione'] },
    '/v1/righe': { POST: [righe.invia, 'sessione', CORPO_RIGHE], GET: [righe.ricevi, 'sessione'] },
    '/v1/esporta': { GET: [righe.esporta, 'sessione'] },
  };

  // §7.3: il CORS, solo per l'origine del sito, con i cookie.
  const cors = (req) => (req.headers.origin === origine
    ? { 'Access-Control-Allow-Origin': origine, 'Access-Control-Allow-Credentials': 'true', Vary: 'Origin' }
    : { Vary: 'Origin' });

  function rispondi(req, res, codice, corpo, { cookie, attesa, intestazioni } = {}) {
    const h = { 'Cache-Control': 'no-store', ...cors(req), ...intestazioni };
    if (cookie) h['Set-Cookie'] = cookie;
    if (attesa) h['Retry-After'] = String(attesa);
    if (corpo === null || corpo === undefined) {
      res.writeHead(codice, h);
      return res.end();
    }
    const testo = JSON.stringify(corpo);
    res.writeHead(codice, { ...h, 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(testo) });
    res.end(testo);
  }

  // Dietro il proxy l'indirizzo vero e' l'ultimo di X-Forwarded-For, quello
  // che il proxy stesso ha aggiunto; senza proxy, quello della connessione.
  const indirizzoDi = (req) => (proxy && req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',').at(-1).trim()
    : req.socket.remoteAddress);

  async function gestisci(req, res) {
    const url = new URL(req.url, 'http://x');
    const percorso = url.pathname;
    const rotta = rotte[percorso];
    if (!rotta) return rispondi(req, res, 404, errore('sconosciuta', `${percorso} non esiste: le rotte stanno sotto /v1`));
    const metodi = Object.keys(rotta).join(', ');

    if (req.method === 'OPTIONS') {
      const h = cors(req);
      if (h['Access-Control-Allow-Origin']) {
        Object.assign(h, {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        });
      }
      res.writeHead(204, h);
      return res.end();
    }
    const voce = rotta[req.method];
    if (!voce) {
      res.setHeader('Allow', metodi);
      return rispondi(req, res, 405, errore('metodo', `${percorso} non accetta ${req.method}: usa ${metodi}`));
    }
    const [gestore, richiede, massimo = CORPO_MASSIMO] = voce;

    // §6.4: una richiesta che cambia qualcosa arriva solo dal sito. Il cookie e'
    // SameSite=Strict, l'Origin dev'essere esattamente quella, e il corpo JSON
    // obbliga il browser a un preflight che il CORS concede solo al sito.
    if (req.method !== 'GET') {
      if (req.headers.origin !== origine) {
        return rispondi(req, res, 403, errore('origine', `Questa richiesta si fa solo dalla pagina di ${origine}.`));
      }
      const ha = Number(req.headers['content-length'] || 0) > 0 || req.headers['transfer-encoding'];
      if (ha && !/^application\/json\b/i.test(req.headers['content-type'] || '')) {
        return rispondi(req, res, 415, errore('tipo', 'Il corpo della richiesta dev\'essere application/json.'));
      }
    }

    const token = tokenDalCookie(req);
    let account = null;
    if (token) {
      const lim = conti.richiestaDiSessione(token);
      if (!lim.ok) return rispondi(req, res, 429, errore('troppe', 'Troppe richieste da questa sessione: riprova fra poco.'), { attesa: lim.fra });
      account = conti.sessione(token);
    }
    if (richiede === 'sessione' && !account) {
      return rispondi(req, res, 401, errore('sessione', 'Non sei dentro, o la sessione è scaduta: '
        + 'si entra di nuovo con email e password. Una sessione dura 30 giorni dall\'accesso.'));
    }
    const corpo = req.method === 'GET' ? undefined : await leggiCorpo(req, massimo);
    const [codice, risposta, extra] = await gestore({ corpo, account, token, ip: indirizzoDi(req), query: url.searchParams });
    rispondi(req, res, codice, risposta, extra);
  }

  const server = createServer((req, res) => {
    gestisci(req, res).catch((e) => {
      if (e instanceof Rifiuto) return rispondi(req, res, e.codice, e.corpo);
      log(`errore su ${req.method} ${new URL(req.url, 'http://x').pathname}: ${e.message}`);
      if (!res.headersSent) {
        rispondi(req, res, 500, errore('interno', "Il server non è riuscito a rispondere. Riprova fra poco; se continua, scrivici."));
      }
    });
  });

  await new Promise((ok, ko) => { server.once('error', ko); server.listen(porta, host, ok); });
  const { port } = server.address();
  return {
    indirizzo: `http://${host}:${port}`,
    db,
    calcoli: calcolati,
    manutenzione: () => conti.manutenzione(),
    chiudi: () => new Promise((ok) => server.close(() => { db.close(); ok(); })),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // La chiave di Scaleway sta nell'ambiente della macchina, mai nel repo. Senza,
  // il server parte e ogni mail e' rifiutata — cioe' ogni registrazione
  // risponde 503, dichiarato — invece di dire «ti abbiamo scritto» (§9.3).
  const chiave = process.env.RG_SCW_CHIAVE;
  const posta = chiave
    ? postaScaleway({ chiave, progetto: process.env.RG_SCW_PROGETTO, regione: process.env.RG_SCW_REGIONE || 'fr-par' })
    : postaAssente;
  if (!chiave) console.error('posta non configurata (RG_SCW_CHIAVE): ogni mail sarà rifiutata, e lo si dirà');
  const s = await avvia({
    db: process.env.RG_DB || '/var/lib/rg/conti.db',
    cancellazioni: process.env.RG_CANCELLAZIONI || '/var/lib/rg/cancellazioni',
    porta: Number(process.env.RG_PORTA || 8620),
    host: process.env.RG_HOST || '127.0.0.1',
    origine: process.env.RG_ORIGINE || 'https://rottagiusta.it',
    sito: process.env.RG_SITO || 'https://rottagiusta.it',
    proxy: process.env.RG_PROXY === '1',
    posta,
  });
  console.error(`rg-api ${VERSIONE} su ${s.indirizzo}`);
  // Il lavoro quotidiano (§14.3, §15.3): all'avvio e poi ogni giorno.
  const lavoro = () => {
    try { console.error(`manutenzione: ${JSON.stringify(s.manutenzione())}`); } catch (e) { console.error(`manutenzione fallita: ${e.message}`); }
  };
  lavoro();
  const giro = setInterval(lavoro, 24 * 3600 * 1000);
  giro.unref();
  const ferma = () => { clearInterval(giro); s.chiudi().then(() => process.exit(0)); };
  process.on('SIGTERM', ferma);
  process.on('SIGINT', ferma);
}
