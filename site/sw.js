// Service worker — la palestra deve partire anche senza rete.
//
// La strategia e' semplice perche' lo puo' essere: **la banca d'esame e'
// immutabile**. E' la copia dell'Allegato A al DD 131/2022 e non cambia da un
// giorno all'altro. Quindi cache-first senza invalidazione, che e' esattamente
// la parte che di solito fa perdere mezza giornata in una PWA.
//
// Quello che invece cambia — le risposte — non passa mai di qui: vive
// nell'archivio della pagina (IndexedDB), nel dispositivo di chi studia, e non
// viaggia da nessuna parte. Non c'e' un server.
//
// Il nome della cache segue VERSION, e lo tiene allineato **un test**, non un
// build step: il file committato e' quello pubblicato. Nel progetto originario
// il segnaposto lo sostituiva il server; qui non c'e', e una cache dimenticata
// congelerebbe l'app sulla prima versione vista da ogni dispositivo. Il test
// in tests/test_engine.mjs fallisce se questo nome e VERSION divergono.
// Ogni rilascio ha quindi la sua cache, e la vecchia viene cancellata
// all'activate — **tranne le figure, che passano da una all'altra** (vedi
// `portaAvantiLeFigure`, sotto).

const CACHE = 'rg-0.26.1';

// Il minimo per aprire l'app e fare una batteria. Le 102 figure no: sono 1,1 MB
// e scaricarle di soppiatto su una rete a consumo e' scortese. C'e' il pulsante
// "Scarica tutto per l'offline" nella schermata Info, che le aggiunge a questa
// stessa cache — esplicito, e da fare prima di partire. Una volta sola: al
// rilascio successivo l'activate le porta nella cache nuova.
//
// Stessa lista di `GUSCIO` in app.html, che controlla che ci sia davvero:
// c'e' un test che le confronta.
const GUSCIO = [
  // La palestra sta su /app. La radice e' la vetrina e resta FUORI dal guscio:
  // sw.js e' cache-first, e una pagina di presentazione messa in cache
  // resterebbe congelata alla versione del giorno in cui ce l'hai messa.
  '/app',
  '/engine.js',
  '/manifest.json',
  '/dati/meta.json',
  '/dati/quiz.json',
  '/dati/tecniche.json',
  // Gli esercizi di carteggio con la risposta ufficiale: la prova d'esame deve
  // potersi fare anche senza rete, altrimenti l'unica cosa che l'app non sa
  // fare offline e' proprio la prova eliminatoria.
  '/dati/carteggio.json',
  // **Senza `.html`, ed e' una correzione, non uno stile.** Cloudflare Pages
  // serve `privacy.html` all'indirizzo `/privacy` e risponde **308** a
  // `/privacy.html`. Mettere in cache il percorso con l'estensione ci mette
  // dentro una *risposta rediretta*, e una risposta rediretta non si puo'
  // servire a una navigazione: il redirect mode di una navigazione e'
  // 'manual', `respondWith` la rifiuta, e la pagina muore con ERR_FAILED —
  // **anche online**, perche' qui si legge prima la cache. Dalla 0.19.1 i due
  // link del pie' di pagina erano morti per chiunque avesse gia' installato il
  // service worker, e l'autodiagnosi diceva «guscio e banca in cache».
  '/privacy',
  '/avvertenza',
  // Le icone: l'app installata ha la sua faccia anche offline. La og-card
  // no, la guarda un crawler. Stessa lista di index.html, e c'e' un test.
  '/favicon.svg',
  '/favicon-32.png',
  '/favicon-16.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/marchio.svg',
  '/paesaggio.svg',
  '/carteggio-ui.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll fallisce in blocco se un solo file non risponde: qui li aggiungo
      // uno per uno, cosi' un file mancante non impedisce l'installazione — e
      // l'autodiagnosi nella schermata Info dice quale manca.
      .then((c) => Promise.all(GUSCIO.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

// **Le figure scaricate non si perdono a ogni rilascio.** Fino alla 0.26.0
// l'activate cancellava ogni cache diversa da CACHE, e le figure ci stavano
// dentro: misurato il 25 settembre 2026 su rottagiusta.it, `rg-0.25.0` con 122
// voci e «figure 102/102», poi il rilascio, e `rg-0.26.0` con 19 voci e
// «figure non scaricate». Non era muto — pallino ambra, riga Offline in Info —
// ma costava a chi studia in barca un secondo download di 102 file, con la rete
// che magari non c'e'.
//
// Le figure sono l'Allegato A al DD 131/2022 e non cambiano, quindi si copiano
// dalla cache vecchia a quella nuova prima di cancellare la vecchia. **Solo le
// figure**: la banca e le pagine si riprendono dalla rete all'install, perche'
// quelle cambiano da un rilascio all'altro.
//
// Perche' non una cache a parte, non versionata, che l'activate risparmia: la
// pagina cerca la cache con `startsWith('rg-')` e prende la prima (Info per la
// versione installata, l'autodiagnosi per contare guscio e figure). Una
// seconda cache col prefisso la confonderebbe, e una senza prefisso
// romperebbe R-ARCH-08. Portandole avanti la cache resta una, e nessuno dei
// punti che la leggono deve cambiare.
//
// Se una figura un giorno cambiasse davvero, questa copia la terrebbe vecchia
// per sempre: la si toglierebbe da qui per un rilascio, e il pulsante la
// riprenderebbe dalla rete.
async function portaAvantiLeFigure(vecchie) {
  const nuova = await caches.open(CACHE);
  for (const nome of vecchie) {
    const c = await caches.open(nome);
    for (const req of await c.keys()) {
      if (!new URL(req.url).pathname.startsWith('/figure/')) continue;
      if (await nuova.match(req)) continue;
      const res = await c.match(req);
      // Una risposta rediretta non si puo' servire a una navigazione (vedi
      // GUSCIO): meglio una figura mancante, che l'autodiagnosi conta, di una
      // che c'e' e non si apre.
      if (!res || !res.ok || res.redirected) continue;
      try { await nuova.put(req, res); } catch { /* conta l'autodiagnosi */ }
    }
  }
}

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(async (k) => {
        const vecchie = k.filter((x) => x !== CACHE);
        // Una copia fallita non deve lasciare in piedi la cache vecchia: la
        // pagina prende la prima `rg-` che trova, e leggerebbe quella. Le
        // figure che non sono passate le conta l'autodiagnosi, in ambra.
        try { await portaAvantiLeFigure(vecchie); } catch { /* idem */ }
        await Promise.all(vecchie.map((x) => caches.delete(x)));
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Tutto: prima la cache, e in rete solo se manca. La banca e le figure che
  // arrivano dalla rete si mettono via, cosi' la seconda volta ci sono.
  e.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request)
        .then((res) => {
          if (res.ok && (url.pathname.startsWith('/figure/') || url.pathname.startsWith('/dati/'))) {
            const copia = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copia));
          }
          return res;
        })
        .catch(() => hit || Response.error());
    })
  );
});
