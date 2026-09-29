// Un browser vero per la suite, senza dipendenze: Chrome headless guidato con
// il suo protocollo (Chrome DevTools Protocol) su una pipe, e l'HTTP di Node.
//
// Perche' cosi', e non Playwright o Puppeteer: il repo non ha dipendenze, e
// aggiungerne una e' una decisione dell'autore. La misura che ha scelto questa
// strada — e che cosa non copre — sta nel §12 di docs/account-client-progetto.md.
//
// Perche' la pipe e non il WebSocket: con `--remote-debugging-pipe` il
// protocollo viaggia sui descrittori 3 e 4 del processo figlio. Nessuna porta
// da cercare, nessun file DevToolsActivePort da aspettare, e il browser non e'
// raggiungibile da nessun altro processo della macchina. Il WebSocket di Node
// (globale da Node 22) funziona anche lui, ed e' misurato: non serve.
//
// Ogni «nuovo browser» e' un contesto isolato (Target.createBrowserContext):
// storage, cookie, cache e service worker suoi, che spariscono con lui. Cosi'
// una sola istanza di Chrome fa molti primi ingressi.

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const CHROME = process.env.RG_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

export async function avviaChrome({ attesaMs = 15000 } = {}) {
  if (!existsSync(CHROME)) {
    // Niente skip: un controllo che salta quando manca il browser e' verde a
    // copertura zero, che e' il difetto fondativo di questo progetto.
    throw new Error(`Chrome non trovato in ${CHROME}: impostare RG_CHROME con il percorso dell'eseguibile`);
  }
  const profilo = mkdtempSync(join(tmpdir(), 'rg-chrome-'));
  const figlio = spawn(CHROME, [
    '--headless=new', '--remote-debugging-pipe', '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-component-update', '--disable-sync',
    '--disable-extensions', '--disable-default-apps', '--mute-audio',
    `--user-data-dir=${profilo}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] });
  let stderr = '';
  figlio.stderr.on('data', (b) => { stderr = (stderr + b).slice(-2000); });

  let prossimo = 0;
  const attese = new Map();
  const ascoltatori = new Set();
  let buf = '';
  figlio.stdio[4].on('data', (b) => {
    buf += b;
    for (let i; (i = buf.indexOf('\0')) >= 0;) {
      const m = JSON.parse(buf.slice(0, i));
      buf = buf.slice(i + 1);
      if (m.id !== undefined && attese.has(m.id)) {
        const { ok, ko, metodo } = attese.get(m.id);
        attese.delete(m.id);
        if (m.error) ko(new Error(`${metodo}: ${m.error.message}`)); else ok(m.result);
      } else for (const f of ascoltatori) f(m);
    }
  });
  const morto = new Promise((_, ko) => figlio.once('exit', (c) => ko(new Error(`Chrome e' uscito (${c}): ${stderr}`))));
  morto.catch(() => {});

  function cmd(metodo, params = {}, sessionId) {
    const id = ++prossimo;
    return Promise.race([morto, new Promise((ok, ko) => {
      attese.set(id, { ok, ko, metodo });
      figlio.stdio[3].write(JSON.stringify({ id, method: metodo, params, sessionId }) + '\0');
    })]);
  }

  await Promise.race([cmd('Browser.getVersion'), pausa(attesaMs).then(() => { throw new Error('Chrome non risponde: ' + stderr); })]);

  async function nuovoContesto() {
    const { browserContextId } = await cmd('Target.createBrowserContext', { disposeOnDetach: false });
    const schede = [];
    return {
      id: browserContextId,
      async apri(url) {
        const { targetId } = await cmd('Target.createTarget', { url: 'about:blank', browserContextId });
        const { sessionId } = await cmd('Target.attachToTarget', { targetId, flatten: true });
        const s = scheda(sessionId, targetId);
        await s.prepara();
        if (url) await s.vai(url);
        schede.push(s);
        return s;
      },
      /** Tutto quello che il contesto conserva per un'origine, letto da fuori. */
      async conservato(origine, s) {
        const sid = s.sessionId;
        const idb = (await cmd('IndexedDB.requestDatabaseNames', { securityOrigin: origine }, sid)).databaseNames;
        const dom = async (isLocalStorage) => {
          try {
            return (await cmd('DOMStorage.getDOMStorageItems', { storageId: { securityOrigin: origine, isLocalStorage } }, sid)).entries;
          } catch { return []; }
        };
        const cookie = (await cmd('Storage.getCookies', { browserContextId })).cookies
          .map((c) => ({ nome: c.name, dominio: c.domain }));
        const cache = {};
        for (const c of (await cmd('CacheStorage.requestCacheNames', { securityOrigin: origine }, sid)).caches) {
          const voci = await cmd('CacheStorage.requestEntries', { cacheId: c.cacheId, skipCount: 0, pageSize: 1000 }, sid);
          cache[c.cacheName] = voci.cacheDataEntries.map((e) => e.requestURL);
        }
        return { idb, local: await dom(true), session: await dom(false), cookie, cache };
      },
      async chiudi() {
        for (const s of schede) await cmd('Target.closeTarget', { targetId: s.targetId }).catch(() => {});
        await cmd('Target.disposeBrowserContext', { browserContextId }).catch(() => {});
      },
    };
  }

  function scheda(sessionId, targetId) {
    const richieste = [];
    const regole = [];
    const console_ = [];
    let caricata = 0;
    const ascolta = (m) => {
      if (m.sessionId !== sessionId) return;
      if (m.method === 'Network.requestWillBeSent') richieste.push({ url: m.params.request.url, metodo: m.params.request.method });
      if (m.method === 'Page.loadEventFired') caricata++;
      if (m.method === 'Runtime.exceptionThrown') console_.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
      if (m.method === 'Fetch.requestPaused') ferma(m.params);
    };
    async function ferma(params) {
      const fase = params.responseStatusCode !== undefined || params.responseErrorReason !== undefined ? 'Response' : 'Request';
      const regola = regole.find((r) => r.fase === fase && r.re.test(params.request.url));
      const id = { requestId: params.requestId };
      const r = regola ? await regola.gestore(params.request, params) : null;
      // La pagina puo' aver annullato la richiesta nel frattempo: allora il
      // comando fallisce, ed e' quello che si vuole.
      if (r && r.fallisci) return cmd('Fetch.failRequest', { ...id, errorReason: r.fallisci }, sessionId).catch(() => {});
      if (!r) return cmd(fase === 'Response' ? 'Fetch.continueResponse' : 'Fetch.continueRequest', id, sessionId).catch(() => {});
      const h = Object.entries(r.intestazioni || {}).map(([name, value]) => ({ name, value }));
      await cmd('Fetch.fulfillRequest', { ...id, responseCode: r.codice, responseHeaders: h,
        body: Buffer.from(r.corpo ?? '').toString('base64') }, sessionId).catch(() => {});
    }
    ascoltatori.add(ascolta);
    const s = {
      sessionId, targetId, richieste, errori: console_,
      async prepara() {
        for (const d of ['Page.enable', 'Network.enable', 'Runtime.enable']) await cmd(d, {}, sessionId);
      },
      async vai(url) {
        const prima = caricata;
        await cmd('Page.navigate', { url }, sessionId);
        await s.attendiCarico(prima);
      },
      async ricarica() {
        const prima = caricata;
        await cmd('Page.reload', { ignoreCache: false }, sessionId);
        await s.attendiCarico(prima);
      },
      async attendiCarico(prima, ms = 15000) {
        const fine = Date.now() + ms;
        while (caricata === prima) {
          if (Date.now() > fine) throw new Error('la pagina non ha finito di caricarsi');
          await pausa(20);
        }
      },
      /** Valuta un'espressione nella pagina e ne restituisce il valore. */
      async valuta(espressione) {
        const r = await cmd('Runtime.evaluate', { expression: espressione, awaitPromise: true, returnByValue: true }, sessionId);
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
        return r.result.value;
      },
      /** Aspetta che l'espressione sia vera; restituisce false allo scadere. */
      async attendi(espressione, ms = 8000) {
        return (await s.attendiValore(espressione, Boolean, ms)).ok;
      },
      /**
       * Aspetta che il valore dell'espressione soddisfi `verifica`, giudicata
       * qui e non nella pagina: serve quando lo stato atteso dipende da dati
       * che stanno nel banco, come la banca dei quesiti. Restituisce anche
       * l'ultimo valore visto, perche' un rosso dica che cosa c'era.
       */
      async attendiValore(espressione, verifica, ms = 8000) {
        const fine = Date.now() + ms;
        let valore;
        for (;;) {
          try {
            valore = await s.valuta(espressione);
            if (verifica(valore)) return { ok: true, valore };
          } catch { /* la pagina si sta ricaricando */ }
          if (Date.now() > fine) return { ok: false, valore };
          await pausa(40);
        }
      },
      async offline(si) {
        await cmd('Network.emulateNetworkConditions', { offline: si, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, sessionId);
      },
      /**
       * Risposte finte, trattenute o fallite per un percorso: il banco decide.
       * `gestore(request, params)` restituisce `null` per lasciar passare,
       * `{ codice, corpo, intestazioni }` per una risposta finta, `{ fallisci }`
       * con un motivo del protocollo (per esempio 'ConnectionReset') per un
       * errore di rete; puo' essere asincrono, e allora la richiesta resta ferma
       * finche' non risponde: e' cosi' che il banco tiene una richiesta in volo.
       * `fase` e' 'Request' — prima che parta — o 'Response' — dopo che il
       * server ha risposto, cioe' con la richiesta gia' accolta.
       * Piu' chiamate sulla stessa scheda si sommano.
       */
      async intercetta(schema, gestore, { fase = 'Request' } = {}) {
        regole.push({ schema, gestore, fase, re: new RegExp('^' + schema.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$') });
        await cmd('Fetch.enable', { patterns: regole.map((r) => ({ urlPattern: r.schema, requestStage: r.fase })) }, sessionId);
      },
    };
    return s;
  }

  return {
    nuovoContesto,
    async chiudi() {
      await cmd('Browser.close').catch(() => {});
      if (figlio.exitCode === null) await new Promise((r) => { figlio.once('exit', r); setTimeout(() => { figlio.kill('SIGKILL'); r(); }, 3000); });
      rmSync(profilo, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    },
  };
}
