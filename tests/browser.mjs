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
import { existsSync, mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const CHROME = process.env.RG_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
// Quanto puo' aspettare un comando al browser, al piu'. Le attese del banco
// sono sue, fuori da qui: nessun comando dura tanto in una pagina che funziona.
const COMANDO = 30000;

export async function avviaChrome({ attesaMs = 15000, nomi = [] } = {}) {
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
    // Un nome che non e' localhost ne' 127.0.0.1 per il sito: l'origine senza
    // API del §3.1 del progetto del client (C-17). Il nome risolve qui, e il
    // resto della rete non lo vede.
    ...(nomi.length ? [`--host-resolver-rules=${nomi.map((n) => `MAP ${n} 127.0.0.1`).join(', ')}`] : []),
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

  // Ogni comando ha una scadenza: una promessa della pagina che non si chiude
  // mai — misurato il 29 settembre 2026, un'eccezione dentro un onsuccess del
  // banco — appendeva tutto il banco, e la suite non finiva. Un banco appeso e'
  // peggio di un rosso: questo lo trasforma in un rosso che dice dove.
  function cmd(metodo, params = {}, sessionId) {
    const id = ++prossimo;
    let scadenza;
    return Promise.race([morto, new Promise((ok, ko) => {
      attese.set(id, { ok, ko, metodo });
      scadenza = setTimeout(() => { attese.delete(id); ko(new Error(`${metodo}: nessuna risposta in ${COMANDO / 1000} s`)); }, COMANDO);
      figlio.stdio[3].write(JSON.stringify({ id, method: metodo, params, sessionId }) + '\0');
    })]).finally(() => clearTimeout(scadenza));
  }

  await Promise.race([cmd('Browser.getVersion'), pausa(attesaMs).then(() => { throw new Error('Chrome non risponde: ' + stderr); })]);

  async function nuovoContesto() {
    const { browserContextId } = await cmd('Target.createBrowserContext', { disposeOnDetach: false });
    const schede = [];
    // I file che la pagina fa scaricare finiscono qui, con il nome dato dal
    // browser (il guid), e il banco li legge: un download si controlla dal
    // contenuto, non dal clic che lo avvia.
    const cartella = mkdtempSync(join(tmpdir(), 'rg-scaricati-'));
    const scaricati = [];
    const segui = (m) => {
      if (m.sessionId || !m.params || m.params.browserContextId !== undefined && m.params.browserContextId !== browserContextId) return;
      if (m.method === 'Browser.downloadWillBegin' && m.params.frameId !== undefined) {
        if (!schede.some((x) => x.targetId === m.params.frameId)) return;
        scaricati.push({ guid: m.params.guid, nome: m.params.suggestedFilename, stato: 'in corso' });
      }
      if (m.method === 'Browser.downloadProgress') {
        const d = scaricati.find((x) => x.guid === m.params.guid);
        if (d && m.params.state !== 'inProgress') d.stato = m.params.state;
      }
    };
    ascoltatori.add(segui);
    await cmd('Browser.setDownloadBehavior', { behavior: 'allowAndName', browserContextId, downloadPath: cartella, eventsEnabled: true });
    return {
      id: browserContextId,
      async apri(url, { prima } = {}) {
        const { targetId } = await cmd('Target.createTarget', { url: 'about:blank', browserContextId });
        const { sessionId } = await cmd('Target.attachToTarget', { targetId, flatten: true });
        const s = scheda(sessionId, targetId);
        await s.prepara();
        // Uno script che gira prima di quelli della pagina, a ogni carico: e'
        // cosi' che il banco registra che cosa la pagina apre (C-21) senza toccarla.
        if (prima) await cmd('Page.addScriptToEvaluateOnNewDocument', { source: prima }, sessionId);
        schede.push(s);
        if (url) await s.vai(url);
        return s;
      },
      /** I download completati, dal primo: `[{ nome, testo }]`. */
      scaricati() {
        return scaricati.filter((d) => d.stato === 'completed').map((d) => ({ nome: d.nome, testo: readFileSync(join(cartella, d.guid), 'utf8') }));
      },
      /**
       * Quante voci ha ogni archivio di un database IndexedDB, letto da fuori:
       * `{ archivio: quante }`, o null se il database non c'e'. Non chiede i
       * nomi degli archivi alla pagina: li legge il protocollo.
       */
      async voci(origine, nome, s) {
        const sid = s.sessionId;
        const nomi = (await cmd('IndexedDB.requestDatabaseNames', { securityOrigin: origine }, sid)).databaseNames;
        if (!nomi.includes(nome)) return null;
        const { databaseWithObjectStores: d } = await cmd('IndexedDB.requestDatabase', { securityOrigin: origine, databaseName: nome }, sid);
        const out = {};
        for (const st of d.objectStores) {
          out[st.name] = (await cmd('IndexedDB.getMetadata', { securityOrigin: origine, databaseName: nome, objectStoreName: st.name }, sid)).entriesCount;
        }
        return out;
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
        ascoltatori.delete(segui);
        rmSync(cartella, { recursive: true, force: true });
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
      if (m.method === 'Network.requestWillBeSent') richieste.push({ id: m.params.requestId, url: m.params.request.url, metodo: m.params.request.method });
      // Come e' finita: un'assenza di rete si aspetta cosi', non con un tempo.
      if (m.method === 'Network.loadingFinished' || m.method === 'Network.loadingFailed') {
        for (const r of richieste) if (r.id === m.params.requestId) { r.finita = true; r.fallita = m.method === 'Network.loadingFailed'; }
      }
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
      /** Un file scelto nel campo che combacia con `selettore`, come lo sceglie chi studia. */
      async caricaFile(selettore, percorso) {
        const r = await cmd('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(selettore)})` }, sessionId);
        if (!r.result.objectId) return false;
        await cmd('DOM.setFileInputFiles', { files: [percorso], objectId: r.result.objectId }, sessionId);
        return true;
      },
      async offline(si) {
        await cmd('Network.emulateNetworkConditions', { offline: si, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, sessionId);
      },
      /**
       * La larghezza della finestra in pixel CSS, come la vede la pagina (area 6,
       * §5): `innerWidth` diventa `larghezza`, e le media query rispondono. Non e'
       * lo zoom del browser, che cambia anche i caratteri e i pixel del
       * dispositivo: a 1280 px con lo zoom al 200 % la larghezza CSS e' 640, e
       * questo ne e' soltanto l'equivalente (P-05). Senza argomenti torna com'era.
       */
      async dimensioni(larghezza, altezza = 800) {
        if (!larghezza) return cmd('Emulation.clearDeviceMetricsOverride', {}, sessionId);
        await cmd('Emulation.setDeviceMetricsOverride', { width: larghezza, height: altezza, deviceScaleFactor: 1, mobile: larghezza < 768 }, sessionId);
      },
      /** Quello che la scheda mostra, in PNG: per guardare, non per confrontare pixel. */
      async schermata() {
        const { data } = await cmd('Page.captureScreenshot', { format: 'png' }, sessionId);
        return Buffer.from(data, 'base64');
      },
      /**
       * Un tasto premuto davvero, come dalla tastiera: l'evento e' del browser,
       * non uno `dispatchEvent` della pagina, quindi Tab sposta il fuoco ed Esc
       * arriva a chi ce l'ha. `maiuscolo` e' Shift tenuto premuto.
       */
      async tasto(nome, { maiuscolo = false } = {}) {
        const codici = { Tab: 9, Escape: 27, Enter: 13, ' ': 32 };
        const base = { key: nome, code: nome === ' ' ? 'Space' : nome, windowsVirtualKeyCode: codici[nome] ?? 0, modifiers: maiuscolo ? 8 : 0 };
        await cmd('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base }, sessionId);
        if (nome === ' ' || nome === 'Enter') await cmd('Input.dispatchKeyEvent', { type: 'char', text: nome === 'Enter' ? '\r' : ' ', ...base }, sessionId);
        await cmd('Input.dispatchKeyEvent', { type: 'keyUp', ...base }, sessionId);
      },
      /**
       * Come l'albero di accessibilita' del browser espone un elemento — quello
       * che un lettore di schermo riceve, non quello che dice: un nodo
       * ignorato non si legge, un `aria-live` nel DOM non prova l'annuncio
       * (area 6, §6). Restituisce `{ ignorato, ruolo, nome, vivo }` per il primo
       * elemento che combacia con `selettore`, o null se non c'e'.
       */
      async accessibile(selettore) {
        const { root } = await cmd('DOM.getDocument', { depth: 0 }, sessionId);
        const { nodeId } = await cmd('DOM.querySelector', { nodeId: root.nodeId, selector: selettore }, sessionId);
        if (!nodeId) return null;
        const { node } = await cmd('DOM.describeNode', { nodeId }, sessionId);
        const { nodes } = await cmd('Accessibility.getPartialAXTree', { backendNodeId: node.backendNodeId, fetchRelatives: false }, sessionId);
        const io = nodes.find((x) => x.backendDOMNodeId === node.backendNodeId) || nodes[0];
        if (!io) return null;
        const prop = (p) => (io.properties || []).find((x) => x.name === p)?.value?.value;
        return { ignorato: !!io.ignored, ruolo: io.role?.value ?? null, nome: io.name?.value ?? '',
          vivo: prop('live') ?? null, modale: prop('modal') ?? null };
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
