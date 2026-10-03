// Service worker — si toglie di mezzo (ADR-005, 3 ottobre 2026).
//
// Fino alla 0.29.0 questo file teneva il sito offline: una cache per rilascio,
// cache-first, con le figure portate da un rilascio all'altro. L'autore ha
// tolto l'offline per semplicita' (ADR-005), e la pagina non registra piu' un
// service worker. Ma chi ha visitato la 0.29.0 ne ha uno installato, che
// serve la pagina dalla sua cache: senza un file nuovo a questo indirizzo,
// quel browser resterebbe sulla 0.29.0 per sempre, perche' il browser
// controlla gli aggiornamenti proprio qui.
//
// Quindi questo file fa una cosa sola: quando il browser lo trova, lo
// installa al posto di quello vecchio, e lui cancella le cache del sito e si
// disinstalla. Dalla visita dopo, nessun service worker e nessuna cache: la
// pagina arriva dalla rete, come ogni altra.
//
// Tre cose che **non** fa, apposta:
// - **non ha un gestore di `fetch`**: dal momento in cui si attiva, ogni
//   richiesta va in rete;
// - **non forza la ricarica** delle pagine aperte — niente `clients.claim()`,
//   niente `client.navigate()`: senza account una ricarica perde le risposte
//   della pagina aperta. La pagina gia' aperta resta quella che e', e la
//   prossima visita prende la versione nuova;
// - **non apre una cache**, nemmeno vuota.
//
// Resta pubblicato finche' la regia non scrive il prompt che lo toglie: l'ADR-005
// dice per quanto. Toglierlo prima lascerebbe chi non e' tornato sul sito con
// il service worker della 0.29.0, e la sua cache, per sempre.

self.addEventListener('install', () => {
  // Subito attivo, senza aspettare che le schede servite da quello vecchio si
  // chiudano: altrimenti la cache vecchia continuerebbe a servirle.
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try {
      for (const nome of await caches.keys()) await caches.delete(nome);
    } finally {
      // Anche se una cache non si cancella, il service worker se ne va: la
      // prossima visita non e' servita da nessuno, e il browser tiene la cache
      // rimasta solo finche' non la sgombera lui.
      await self.registration.unregister();
    }
  })());
});
