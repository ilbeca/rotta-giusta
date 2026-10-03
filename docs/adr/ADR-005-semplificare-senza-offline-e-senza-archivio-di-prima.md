# ADR-005: Semplificare — via l'offline, e via il passaggio dell'archivio di prima

## Status

**Accepted** — 3 ottobre 2026, due decisioni dell'autore prese lo stesso
giorno, scritte qui insieme perché hanno lo stesso criterio e lo stesso lavoro.
**Sostituisce in parte ADR-004**: la sua quarta condizione, «un archivio che
esiste già non sparisce in silenzio», e le due frasi delle conseguenze che
promettono l'offline — «l'offline alla prima visita, per provare» e la copia
nel browser «per l'offline». Tutto il resto dell'ADR-004 vale com'è, comprese
le prime tre condizioni.

L'ADR-004 dice delle sue condizioni: «senza di esse, questa decisione non
vale». Da qui la quarta è quella di questo ADR: l'ADR-004 vale con lei al
posto di quella di prima, e il prezzo del cambio è scritto per intero sotto.

## Date

2026-10-03

## Context

**Il criterio dell'autore è la semplicità**, e un'ipotesi che lo accompagna:
**si considera che nessuno abbia usato il sito prima degli account.** Il sito è
pubblico dal 4 settembre 2026, senza analytics; quante persone abbiano studiato
lì nel mese prima della v0.29.0 non si sa, e l'autore ha deciso di non pesare
le scelte su un numero che non c'è.

**L'offline.** Dalla 0.3.0 la palestra si apriva anche senza rete: un service
worker cache-first, una cache per rilascio con il nome della versione, un
guscio scritto in due posti (`sw.js` e `app.html`) e tenuto uguale da un test,
le 102 figure da scaricare con un pulsante e portate da un rilascio all'altro,
un'autodiagnosi in Info, e un pallino ambra quando l'offline non era pronto. Il
prezzo che chi studia vedeva era la **seconda ricarica**: dopo un rilascio la
prima ricarica serviva ancora la versione di prima, dalla cache. L'autore ha
deciso di toglierlo, con tre motivi: la seconda ricarica è un comportamento
strano che pochi capirebbero; dubita che l'offline serva a una parte discreta
di chi studia; e con gli account le risposte stanno sul server.

**L'archivio di prima.** Fino alla v0.28.1 chi studiava senza account aveva le
risposte nel browser: il database IndexedDB `open-patente-nautica`, oppure, se
IndexedDB non si apriva, la chiave `localStorage` `pn.archivio`, con alcune
preferenze sotto altre chiavi `pn.` (la data d'esame in `pn.esame`). La
v0.29.0 ha smesso di scrivere lì, e la quarta condizione dell'ADR-004 chiedeva
che quell'archivio non sparisse in silenzio. Il progetto del client
(`docs/account-client-progetto.md` §7) l'ha realizzata come un **passaggio**:
leggere le due fonti a ogni apertura, dirne il conteggio, offrire di portarle
nell'account o di scaricarle. R-ACC-05 lo teneva fermo su un archivio sintetico
di sei righe (C-09); su un archivio vero non è mai stato provato (R-ACC-62),
perché al traguardo l'autore pensava già di toglierlo. È uscito nella v0.29.0,
il 3 ottobre, e lo stesso giorno l'autore l'ha tolto, con il criterio che per
chi arriva dalla v0.29.0 in poi l'esperienza non cambia.

## Decision

### 1. Niente offline

- **La pagina non registra un service worker e non apre una cache.** Escono il
  guscio, il pulsante delle figure per l'offline, l'autodiagnosi offline di
  Info e il suo pallino, e ogni testo che promette l'offline.
- **Le pagine e la banca arrivano dalla rete**, con la cache del browser: oggi
  statichost.eu le serve con `Cache-Control: public, max-age=0,
  must-revalidate` e un ETag, e risponde 304 quando il file è quello di prima
  (misurato il 3 ottobre 2026). Dopo un rilascio basta **una** ricarica.
- **La versione vive in due posti**, `VERSION` e `versione` in
  `site/dati/meta.json`: il terzo era il nome della cache in `sw.js`, che non
  c'è più.
- **La copia delle risposte nel dispositivo, per chi ha l'account, resta**: è
  la coda che tiene le risposte quando la rete cade a pagina aperta, e ci vive
  la bozza del carteggio. Cambia il perché: non serve più ad aprire il sito
  senza rete, serve a non perdere niente mentre la rete non c'è.
- **`site/sw.js` diventa un service worker che si toglie di mezzo.** Chi ha
  visitato la 0.29.0 ne ha uno installato, cache-first: senza un file nuovo a
  quell'indirizzo il suo browser resterebbe sulla 0.29.0 per sempre, perché è
  lì che il browser controlla gli aggiornamenti. Il file nuovo, quando il
  browser lo trova, si installa al posto di quello vecchio, cancella le cache
  del sito e si disinstalla; **non** ricarica le pagine aperte — senza account
  una ricarica perde le risposte della pagina aperta —, **non** ha un gestore
  di `fetch` e **non** apre una cache.

**Per quanto resta pubblicato: almeno fino al 3 ottobre 2028**, due anni, lo
stesso tempo dopo il quale si cancella un account inattivo. Toglierlo prima
vorrebbe dire che un browser che ha visitato la 0.29.0 e torna dopo resta su
quella copia per sempre, senza un errore: il file costa meno di un kilobyte e
non fa niente a chi non ha il service worker vecchio. Lo toglie un prompt della
regia, e non prima.

### 2. Niente passaggio dell'archivio di prima

- La pagina **non apre** il database `open-patente-nautica`, **non legge** e
  **non scrive** le chiavi `localStorage` della versione di prima
  (`pn.archivio`, `pn.esame` e le altre con il prefisso `pn.`), e **non le
  cancella** — né all'avvio, né all'accesso, né all'uscita, né con una
  conferma.
- La pagina **non ne dice niente**: nessun avviso, nessun conteggio, nessuna
  porta in Info. **Niente passa nell'account** da quell'archivio.
- Resta la porta che vale per tutti: **un file dei progressi si carica
  nell'account** (§8 del progetto del client). Chi aveva scaricato il file
  dalla schermata Info fino alla v0.28.1 lo può ancora portare nell'account.

**Perché «non legge» e non solo «non mostra».** Una pagina che legge
l'archivio per non farne niente tiene in vita il codice, il nome del database e
le sue trappole senza dare niente a nessuno; e una lettura è il primo passo di
un passaggio che qualcuno, fra sei mesi, rimetterebbe «visto che i dati ci
sono». **Perché «non cancella».** Sono dati di chi studia, nel suo browser, e
il sito non ha il diritto di toglierli senza chiedere.

## Che cosa si perde

Detto per intero, perché è il posto in cui una decisione così si è tentati di
scriverla a mezza voce.

1. **Senza rete il sito non si apre.** Né la vetrina né la palestra, nemmeno
   con l'icona sulla schermata Home, nemmeno per chi ha l'account. «Anche in
   barca» esce dalla vetrina. Una pagina già aperta continua a funzionare se la
   rete cade — con l'account le risposte restano nella copia del dispositivo e
   partono quando torna —, ma una ricarica senza rete non si apre.
2. **Chi aveva risposte nel browser prima del 3 ottobre 2026, e non le ha
   portate nell'account né scaricate, non le vede più, e nessuno glielo dice.**
   Non sono cancellate: sono nel suo browser, invisibili. Ritrovarle vorrebbe
   gli strumenti per sviluppatori del browser, e il sito non lo spiega.
3. **Quante siano queste persone non si sa**: il sito non ha analytics, e un
   archivio nel browser non arriva a nessun server. L'ipotesi dell'autore è che
   siano nessuna; se non lo è, il punto 2 tocca loro.
4. **È la forma che questo progetto chiama guasto muto, scelta apposta**: una
   perdita che si scopre dopo, senza un messaggio. La differenza con un guasto è
   che qui è dichiarata, e la dichiarazione sta in questo ADR, nella specifica e
   nel CHANGELOG — non nella pagina, che è l'unico posto dove la persona
   interessata la leggerebbe.
5. **È in tensione con due frasi di `docs/filosofia.md`**: «una perdita che
   scegli tu è una scelta, una che scopri dopo è un inganno», e «il costo si
   dice prima, non dopo». Parlano di chi prova senza account, ed è per loro che
   il sito dice prima e dopo ogni attività che non resta niente; lette alla
   lettera valgono anche per il punto 2, e lì non sono rispettate.
   `docs/filosofia.md` lo dice ora accanto a quelle frasi, con il rimando qui;
   le frasi restano, e se correggerle o tornare sulla decisione è dell'autore.
6. **Anche su `.pages.dev`.** Chi ha l'archivio sul vecchio indirizzo lo ha
   sotto un'altra origine, e la palestra lì serve la stessa pagina: non lo vede
   nemmeno lì.

Fra il 3 ottobre e il rilascio della pagina senza offline, la 0.29.0 in linea
installa ancora il service worker a chi la visita, e mostra ancora il
passaggio a chi ha un archivio di prima.

## Alternatives Considered

- **Tenere l'offline**, magari togliendo la seconda ricarica con un
  aggiornamento forzato (`skipWaiting` e una ricarica della pagina). Scartato:
  la ricarica forzata, senza account, perde le risposte della pagina aperta, e
  il resto della macchina — guscio in due posti, figure, autodiagnosi, versione
  in tre posti — resta da mantenere per un uso che l'autore pensa raro.
- **Togliere `sw.js` invece di sostituirlo.** Scartato dalla regia, e l'autore
  non l'ha cambiato: per la specifica dei service worker un aggiornamento che
  trova un 404 fallisce e lascia installato quello di prima, che resterebbe a
  servire la sua cache (letto nella specifica, non misurato in Chrome).
- **Tenere il passaggio dell'archivio di prima.** Scartato con il criterio:
  per chi arriva dalla v0.29.0 non cambia niente, e il passaggio resta codice da
  mantenere, con il nome di un database che non si può cambiare, per un numero
  di persone che non si conosce e su un archivio vero mai provato.
- **Toglierlo con una data**, proposta della regia. Scartato dall'autore.
- **Toglierlo e cancellare l'archivio di prima.** Scartato: cancellerebbe dati
  di chi studia senza chiederglielo. La regia ne ha derivato «non legge e non
  cancella», e l'autore l'ha preso nella decisione.

Una variante **non** considerata dall'autore, scritta qui solo perché ha un
costo diverso: dire che l'archivio c'è senza leggerlo — la pagina sa da
`indexedDB.databases()` se il database esiste —, con una frase che spieghi dove
sono le risposte. Toglierebbe il punto 2 a metà e terrebbe in vita il nome del
database. È una decisione nuova, se la si vuole.

## Consequences

- **La pagina cambia con P-61** (ChatGPT, `ui/main`): niente registrazione del
  service worker, niente guscio, figure per l'offline, autodiagnosi e pallino
  dell'offline, niente passaggio dell'archivio di prima, e i testi del sito di
  adesso. Il contratto è nella specifica (§3.5, «Per P-61») e nel progetto del
  client (§12, «L'offline se ne va» e «L'archivio di prima resta dov'è»).
- **I controlli che lo tengono**: C-22 nel banco del client — la pagina non
  registra un service worker e non apre una cache; un browser con la 0.29.0
  installata, servita in locale dal tag, prende la versione nuova e alla visita
  dopo non ha né service worker né cache — e i test del motore che eseguono il
  `sw.js` nuovo; C-21 — la pagina non legge e non cancella l'archivio di
  prima. Finché P-61 non c'è, le due verifiche rosse sulla pagina vera sono
  difetti aperti dichiarati in `docs/eccezioni-interfaccia.md`.
- **Escono**: il guscio in due posti (R-ARCH-04), il prefisso della cache
  (R-ARCH-08), le figure da un rilascio all'altro (R-ARCH-10, R-ARCH-11),
  l'autodiagnosi (R-STA-06), la parte offline di R-ACC-01, C-09 con le sue
  rotture, R-ACC-62. R-ARCH-03 dice due posti; R-ACC-05 dice il contrario di
  prima; R-ARCH-07 dice che cosa resta del nome del database.
- **Il redirect di `.pages.dev` (fase D2)** deve continuare a servire `/sw.js`
  con un 200: con un 301 anche lì, il browser rifiuta un service worker dietro
  un redirect (misurato il 25 settembre 2026, `docs/migrazione-hosting.md`), e
  chi ha installato la 0.29.0 su quell'indirizzo resterebbe sulla sua cache. Il
  `sw.js` nuovo è proprio quello che lo libera.
- **Il motore non cambia**, se non nei commenti: `nuovoTrasferimento()`,
  `fondiArchivio()` e `importa()` sono di ogni trasferimento.
- **L'informativa** non nomina l'archivio di prima (cercato il 3 ottobre
  2026); se nomina la cache del service worker, quella frase la cambia P-61.
- **Per l'autore**, aperto: il punto 5 di «Che cosa si perde»; la variante non
  considerata qui sopra; e i due anni di `sw.js`, che sono una derivazione di
  questo ADR e si possono accorciare.
