# Changelog — Open Patente Nautica

Formato: [Keep a Changelog](https://keepachangelog.com/it/1.1.0/).
Versionamento semantico, pre-1.0: MINOR per funzionalità, PATCH per correzioni.

Le voci fino alla 0.18.0 vengono dal progetto personale di preparazione
all'esame da cui questo sito è estratto: un servizio con un server, un solo
utente e una data d'esame. Restano perché spiegano **perché** certe scelte
sembrano strane — e sono state riviste solo per togliere i dati delle macchine
dell'autore. Dalla 0.19.0 in poi è la storia di questo sito.

## [Unreleased]

### Verificato — la v0.30.0, in linea

- **La pagina.** `v0.30.0` è un tag annotato su `decdf76`, fatto dopo le
  cinque suite sull'albero del rilascio: motore 192/196 con i quattro skip
  previsti, server 72/72, dati 223, specifica 820, interfaccia 2.263 con la
  8620 libera prima. Pushati `main` e il tag con il sì dell'autore; «Build now»
  su statichost.eu dalla regia, nel Chrome dell'autore e su sua richiesta: la
  build, 38 s, porta l'etichetta del rilascio. Da fuori `meta.json` dice 0.30.0
  su `rottagiusta.it` e su `.pages.dev`; tredici file del sito sono identici
  byte per byte a `v0.30.0:site/`; `sw.js` è quello che si disinstalla, servito
  con `no-cache`, e `/app` non registra un service worker.
- **Il server.** `rg-aggiorna v0.30.0 decdf76…` lanciato dalla regia sulla
  macchina, su richiesta dell'autore: la copia di prima con `integrity_check`
  ok, schema 4 invariato. Da fuori `GET /v1/salute` dice 0.30.0, schema 4/4 e
  la stessa epoca; il CORS espone `Retry-After` al sito e a nessun altro.
- **Non guardato:** un browser vero con la 0.29.0 installata che passa alla
  0.30.0 su `rottagiusta.it`. L'ha provato P-61 in locale, quattro volte.

## [0.30.0] — 2026-10-03

**Il sito più semplice: niente offline.** Rotta Giusta si apre con la rete,
e senza rete non si apre più. Il motivo è la semplicità: con gli account le
risposte di chi si registra stanno sul server, e l'offline costava una cosa
che pochi capivano — dopo ogni rilascio la versione nuova arrivava solo alla
seconda ricarica. Da qui la versione nuova arriva alla prima. Chi aveva il sito
nel browser trova, alla visita dopo, un service worker che cancella la vecchia
cache e si toglie da solo, senza ricaricare la pagina aperta: in quella cache
c'erano soltanto il sito e la banca, mai una risposta. **Esce anche il
passaggio dell'archivio di prima degli account**: la pagina non legge più le
risposte salvate nel browser prima del 3 ottobre, e non le tocca. Le due
decisioni, con il loro prezzo, sono nell'ADR-005.

Il server degli account non cambia: si porta allo stesso tag con `rg-aggiorna`
perché `GET /v1/salute` dica la versione nuova. Le voci che seguono sono il
lavoro di questi giorni, com'è stato scritto allora.

### Verificato — la v0.29.0, in esercizio

- **Il tag e le suite.** `v0.29.0` è un tag annotato su `3198803`, il commit
  che porta la data giusta, fatto dopo le cinque suite rifatte il 3 ottobre su
  quel contenuto — fra lui e la cima di `main` cambiava solo
  `docs/prossime-sessioni.md`, che nessuna suite legge: motore 193/197 con i
  quattro skip previsti, server 72/72, tutti e due anche con la **24.21.0 LTS**
  (archivio confrontato con il `SHASUMS256.txt` di nodejs.org ed estratto di
  nuovo); dati 263, specifica 824, interfaccia **2.245** in 4 min 05 s con la
  8620 guardata libera prima; `ripristina --prova` 22 controlli. `main` e il
  tag pushati con il sì dell'autore; `.pages.dev` ha costruito da sé la 0.29.0.

- **Il server, da `v0.28.0` a `v0.29.0`, in 1,9 s.** `rg-aggiorna` lanciato
  dalla sessione su richiesta dell'autore, con gli script della macchina uguali
  a quelli del repo byte per byte: il tag sul commit atteso, la copia di prima
  con `integrity_check` ok, «schema del database portato da 3 a 4» nel log.
  Da fuori: `GET /v1/salute` dice 0.29.0, schema 4/4, **la stessa epoca** di
  prima — un aggiornamento non è un ripristino —; il CORS espone `Retry-After`
  al sito e a nessun altro (R-ACC-49).

- **La pagina: il contenuto è quello del tag, l'etichetta no.** Dopo «Build
  now» `rottagiusta.it` serve `rg-0.29.0`, e undici file — `sw.js`, le pagine,
  `engine.js`, il manifest, i quattro JSON della banca — sono identici byte per
  byte a `v0.29.0:site/`; la privacy dice «Aggiornata il 3 ottobre 2026» e non
  più «Bozza». Ma il pannello di statichost.eu ha etichettato la build con il
  messaggio dell'ultimo commit di `main`, uno della coda, senza il numero: è
  il primo posto in cui si guarda che cosa è in linea. Da qui `AGENTS.md`
  chiede di costruire con il commit di rilascio in cima, e questa voce porta il
  numero apposta.

- **Una registrazione vera**, dall'autore: la mail di conferma spedita un
  secondo dopo, arrivata in Posta in arrivo con il link intatto, confermata
  dopo 28 s (R-ACC-61). E l'arrivo era **in IPv6**: la 443 aperta su `::/0` è
  provata da una rete vera.

- **Safari 27.0.1 su macOS 27.0.1** (R-ACC-59): accesso e due risposte date
  lì; la pagina le conta «nella copia di questo account in IndexedDB, più
  server», e il server ne ha due. Il cookie va e torna fra `rottagiusta.it` e
  `api.`, e IndexedDB si apre. Non provato su iPhone, né in navigazione privata.

- **Gli strumenti del titolare sulla macchina, come utente `rg`.**
  `statistica.mjs` conta e rifiuta una tabella vera; `leggi.mjs` e
  `opposizione.mjs` su un'email che non c'è escono con 1 senza annotare niente.
  Sull'account dell'autore, con il suo sì e un motivo che dice la prova:
  `leggi.mjs` annota «lettura del titolare» e mostra l'account senza segreti;
  `--metti` lo toglie dai conteggi (iscritti 1 → 0) e `--togli` lo rimette, e il
  file delle cancellazioni nasce con le due voci, `0600 rg`, senza email.

- **Non provato, per scelta dell'autore:** un archivio vero di prima degli
  account portato nell'account (R-ACC-05 sull'archivio vero, R-ACC-62). Il
  browser della prova non ne aveva uno, e l'autore ha deciso di non cercarne un
  altro: pensa di togliere la funzionalità. Finché c'è, la tiene solo il banco,
  su un archivio sintetico.

### Deciso — P-60: via l'offline e il passaggio dell'archivio di prima (ADR-005)

- **Due decisioni dell'autore del 3 ottobre 2026, un ADR solo.** Il criterio è
  la semplicità, con un'ipotesi: si considera che nessuno abbia usato il sito
  prima degli account. **L'offline esce**: la seconda ricarica dopo un rilascio
  era strana, l'offline serviva a pochi, e con gli account le risposte stanno
  sul server. **Il passaggio dell'archivio di prima esce**: per chi arriva dalla
  0.29.0 non cambia niente. L'ADR-005 sostituisce la quarta condizione
  dell'ADR-004 e le sue frasi sull'offline, marcate lì. Il prezzo, per intero
  nell'ADR: senza rete il sito non si apre, per nessuno; chi avesse risposte
  nel browser di prima del 3 ottobre e non le avesse portate non le vede più, e
  nessuno glielo dice — restano nel suo browser, perché la pagina non le legge e
  non le cancella. È in tensione con «una che scopri dopo è un inganno» di
  `docs/filosofia.md`, che ora lo dice accanto alla frase; le frasi non sono
  riscritte, è dell'autore.

- **`site/sw.js` si toglie di mezzo.** Chi ha visitato la 0.29.0 ha il suo
  service worker cache-first: senza un file nuovo resterebbe su quella copia per
  sempre. Il file nuovo salta l'attesa, cancella le cache del sito e si
  disinstalla; non ha un gestore di `fetch`, non apre una cache e **non ricarica
  le pagine aperte**, perché senza account una ricarica perde le risposte.
  Resta pubblicato almeno fino al 3 ottobre 2028. Passa al territorio del
  motore: P-61 non lo deve toccare, e ora lo dice git.

- **Senza service worker la freschezza la decide l'host, misurato.** Il 3
  ottobre statichost.eu serve pagine, banca, figure e manifest con
  `public, max-age=0, must-revalidate`, ETag e `Last-Modified`, e risponde 304
  con `If-None-Match` e con `If-Modified-Since`; `/sw.js` con `no-cache`. Non
  serve nessuna regola nuova in `_headers`. `strumenti/serve.py` riconvalida
  con la data, e `test_serve` lo pretende: tolta la riconvalida, tre rossi. La
  versione vive in **due** posti, `VERSION` e `meta.json`, e la chiusura di un
  rilascio in `AGENTS.md` fa `curl` su `meta.json`.

- **I controlli che escono, e che cosa tenevano.** Il guscio uguale in due
  file, il prefisso della cache, le figure da un rilascio all'altro (tre test
  del motore), l'autodiagnosi (scoperta), la parte offline di C-01 con due
  rotture, C-09 con sette: senza l'offline e senza il passaggio non c'è più
  niente da rompere, e nessuno se ne accorgerebbe. Il requisito dell'archivio
  vero, mai eseguito, esce; R-ACC-05 dice il contrario di prima.

- **I controlli che entrano, ognuno provato al contrario.** **C-21**
  (R-ACC-05): con l'archivio di prima nel browser la pagina non apre il
  database, non tocca le chiavi `pn.`, non ne dice niente, niente arriva
  nell'account, e l'archivio resta byte per byte; uno strumento nella scheda e
  l'archivio riletto da un'altra si coprono a vicenda, sei rotture rosse
  ognuna in una verifica sola. **C-22** (R-ARCH-15): la pagina non registra un
  service worker e non apre una cache; e un browser con la 0.29.0 installata,
  servita in locale dal tag, prende la versione nuova senza ricaricare le pagine
  aperte e alla visita dopo non ha né service worker né cache. Sei rotture,
  quattro delle quali sono `sw.js` serviti al posto di quello vero. **Tre test
  del motore** eseguono il `sw.js` nuovo (R-ARCH-16, 17), sette rotture del
  file rosse; `test_sw` ne guarda la forma (R-ARCH-18). `test_rinomino` ammette
  il nome del database di prima in `site/` solo finché la lettura è un difetto
  dichiarato: tolta la riga, un rosso.

- **Sulla pagina vera C-21 e C-22 sono difetti aperti dichiarati**, misurati:
  la pagina apre `open-patente-nautica` e legge `pn.archivio` a ogni avvio,
  registra `/sw.js` e apre una cache `rg-0.29.0`. P-61 toglie il codice e le due
  righe nello stesso commit; il contratto è il §3.5 della specifica, «Per P-61»,
  e il §12 del progetto del client.

- **Trovato misurando.** C-22 guardava solo lo stato, e il giro intero l'ha
  dato verde sulla pagina vera: con il `sw.js` nuovo la registrazione dura pochi
  millisecondi, e due giri su tre il banco guardava dopo. Ora legge anche le
  chiamate, con uno strumento nella scheda. Ne viene una misura per la regia:
  con il `sw.js` nuovo pubblicato, il service worker che la pagina di oggi
  registra se ne va da sé. E una per D2: il redirect di `.pages.dev` deve
  continuare a servire `/sw.js` con un 200, o chi ha la palestra installata lì
  resta sulla sua cache (`docs/migrazione-hosting.md`). La rottura «il sw.js che
  ricarica le pagine aperte» era rossa per il motivo sbagliato alla prima
  stesura — un `navigate()` che lanciava fermava il service worker prima che si
  disinstallasse — ed è stata riscritta; e il banco serviva la `sw.js` rotta
  anche alla 0.29.0, corretto.

  Suite: motore **192/196** con i quattro skip previsti (erano 193/197: il test
  del guscio e i tre delle figure escono, tre di `sw.js` entrano); server
  72/72; dati **223** (erano 263: il guscio, il prefisso della cache, la
  versione in sw.js; entrano il 304 e la forma di sw.js); specifica **820**
  (erano 824); interfaccia **2.246** (erano 2.245), in 4 min 06 s, sulla
  pagina vera; motore e server anche con la **24.21.0 LTS**, l'archivio
  confrontato con il `SHASUMS256.txt` riletto da nodejs.org ed estratto di
  nuovo; `ripristina --prova` 22 controlli. Guardiano verde. Prima di ogni giro
  dell'interfaccia la 8620 guardata libera. `site/` fuori dal motore — la
  pagina, la vetrina, `_headers` — non è stato toccato: è di P-61.

### Cambiato — P-61: la pagina senza offline e senza passaggio dell'archivio di prima

- **La pagina realizza l'ADR-005.** Non registra più il service worker e non
  apre cache: escono `GUSCIO`, il download delle figure, l'autodiagnosi e il
  segnale dell'offline. Info legge la versione dalla banca caricata e dice di
  ricaricare una volta; il pallino resta per una scrittura fallita. La vetrina,
  la palestra e la privacy descrivono il sito che si apre con la rete e le
  risposte dell'account che, se la rete cade, aspettano nel dispositivo.
  `_headers` conserva il `no-cache` di `/sw.js` e spiega la riconvalida
  dell'host; il manifest e il `sw.js` di P-60 restano com'erano.

- **L'archivio di prima resta dov'è.** Escono lettura, avvisi, conteggi,
  trasferimento, download e cancellazione del database precedente e delle
  chiavi `pn.`, con la loro data d'esame e il segno di migrazione nella copia
  dell'account. I trasferimenti delle risposte della pagina aperta e dei file,
  la copia dell'account, le bozze e la coda restano quelli di prima. Le righe
  C-21 e C-22 escono da `docs/eccezioni-interfaccia.md` nello stesso commit:
  i gruppi girano ora per intero sulla pagina vera, senza eccezioni.

- **Verificato in Chrome a 375 e 1280 px**, senza account e con account
  sintetici, soltanto su server e database temporanei: tutte le sette viste,
  nessun testo sull'offline o sul passaggio dell'archivio di prima, nessun
  debordamento orizzontale, nessun errore JavaScript, nessun service worker o
  cache. Schermate acquisite e guardate, con le misure degli stili calcolati;
  anche vetrina e privacy alle due larghezze. **Quattro passaggi dalla
  0.29.0**, presa dal tag e installata sulla stessa origine, alle due
  larghezze e nei due stati: prima un controller e `rg-0.29.0`, dopo nessun
  controller, registrazione o cache; la scheda già aperta non viene
  ricaricata, e l'account si ritrova nella nuova visita.

- **Suite:** motore **192/196**, con i quattro skip previsti; server **72/72**
  sia con Node di sistema sia con la **24.21.0 LTS**, il cui archivio è stato
  confrontato con `SHASUMS256.txt`; interfaccia **2.263**, con la 8620 libera
  prima; dati **223**; specifica **820**. Il controllo condiviso della
  documentazione è verde. Versione non toccata, nessun tag, push o deploy.

- **Trovato e corretto nel controllo dati:** due impronte di identificatori
  privati nella stessa riga del prompt P-62, `docs/prossime-sessioni.md:4067`,
  già presente nel commit iniziale `77cc779`, rendevano rosso il guardiano.
  Con la deroga esplicita dell'autore alla penna unica, quella sola riga
  sostituisce l'indirizzo personale con «all'indirizzo Gmail dell'autore»:
  testo e apostrofi uguali alla correzione della regia su `main`, `6106e42`.
  Nessun'altra riga della coda cambia.

## [0.29.0] — 2026-10-03

**La versione con gli account.** Si fa ancora tutto senza registrarsi, ma senza
account il sito non conserva più niente, nemmeno nel browser: le risposte
valgono finché la pagina resta aperta, e la pagina lo dice prima di cominciare
e alla fine di ogni attività. Con un account — un'email e una password — le
risposte si salvano sul server, in chiaro, si ritrovano su un altro dispositivo
e danno i Progressi. **Chi ha nel browser l'archivio di prima** lo trova
segnalato alla prima apertura: lo porta nell'account o lo scarica, e non
sparisce da solo.

Con gli account esce il ridisegno intero, che su `main` si era accumulato dal
26 settembre: il ciclo dei quiz che si chiude con riepilogo, revisione e
riprova degli errori (area 3); il Carteggio con le tre porte, il giudizio di
chi studia detto prima, e la bozza che con l'account regge una ricarica (area
4); Progressi come mappa per tema (area 5); la rifinitura di fuoco, reflow,
contrasto e bersagli (area 6). L'informativa e l'avvertenza sono quelle della
versione con gli account, con le condizioni per l'account; la vetrina non
carica più niente da altri host.

**Il server degli account**, in esercizio su `api.rottagiusta.it` dal 1°
ottobre, si aggiorna allo stesso tag con `rg-aggiorna`: porta lo schema 4,
l'esclusione dalle statistiche di chi si oppone, lo strumento con cui il
titolare legge un account lasciando traccia, e il `Retry-After` che la pagina
può leggere. **Su `rottagiusta.it`** il ramo di build di statichost.eu torna
da `fix/0.28.1` a `main` prima di «Build now». Dopo il rilascio ogni
dispositivo prende la versione nuova alla seconda ricarica.

La 0.28.1, uscita il 1° ottobre da un ramo a parte, è qui sotto: il suo avviso
sul testo del carteggio è superato dalla bozza. Le voci che seguono sono il
lavoro di questi giorni, sessione per sessione, com'è stato scritto allora:
dove dicono «non ancora pubblicato» parlano di prima di questo rilascio.

### Verificato — la v0.28.0 sui due indirizzi

- **Su `rottagiusta.it`, dopo «Build now», e su `.pages.dev`:** `CACHE =
  'rg-0.28.0'` e `versione: 0.28.0`, `/app` risponde 200. Nel browser della
  regia, che aveva la 0.27.0 con le figure scaricate: service worker attivo,
  una sola cache `rg-0.28.0`, e Info scrive «v0.28.0 · cache offline rg-0.28.0»
  e «Pronto per l'offline … figure 102/102» — **le figure passate da una cache
  all'altra senza un secondo scaricamento**, come R-ARCH-10 promette. I Quiz
  mostrano le cinque intenzioni; console senza errori.

### Progettato — P-14, il ciclo dei quiz che si chiude

- **`docs/area-3-progetto.md`: riepilogo, revisione e «Riprova questi N»**
  con testi completi, conclusione parziale, simulazioni base/vela, ritorni,
  figure, tag per tentativo e criteri di accettazione. La riprova apre una
  nuova attività dai soli errori di quella scelta, con numero e lista dallo
  stesso risultato di `erroriSessione()`; senza account, dalla versione del
  client, revisione e riprova valgono per la pagina aperta. I testi distinguono
  quel regime dal prodotto attuale che salva nel browser.
- **Trovato un confine che perde errori, riprodotto prima del progetto:** tre
  risposte con lo stesso `sim_uid`, due errori e una pausa di 21 minuti e
  1 secondo diventano due gruppi; `erroriSessione()` ne restituisce solo uno.
  Il §10.1 chiede su `main` il contratto per l'attività intera e i controlli
  del ciclo prima della realizzazione, preservando il raggruppamento usato
  dal ritmo. Dichiara anche il contatto col client per una simulazione
  consegnata con zero risposte. Orfano ed eccezione alt restano fino alla
  correzione reale; questa sessione non modifica la pagina o la coda.
- **Verificato il prodotto esistente, non una UI già realizzata:** motore
  141/143 con 2 skip previsti, dati 242, interfaccia 295, specifica 370;
  server 58/58 su Node 25.3.0 e LTS 24.21.0, pacchetto separato verificato
  contro il manifesto SHA-256 ufficiale. Riferimenti locali, guardiano e
  controllo della documentazione verdi; nessuna versione modificata.

### Corretto — P-30: un'attività si riapre intera, anche dopo una pausa

- **`erroriSessione()` riapriva metà di un'attività, dichiarando il confine
  registrato.** Il caso del §10.1 di `docs/area-3-progetto.md`: tre risposte
  con lo stesso `sim_uid`, la terza 21 minuti dopo, due sbagliate.
  `sessioni()` le spezzava per pausa in due gruppi **con lo stesso id**,
  `erroriSessione()` prendeva il primo e restituiva **un errore su due** con
  `fonte: 'sim_uid'`. I cinque test di prima passavano: nessuno esercitava una
  pausa, e il conteggio restava coerente con la lista sbagliata. Succede anche
  in una simulazione base, che dura più della pausa.

- **Due confini, scelti per nome.** `sessioni(righe, { confine })`:
  `'pausa'`, il predefinito, invariato; `'attivita'`, che tiene insieme tutte
  le righe di un `sim_uid` oltre la pausa e anche intrecciate con un'altra
  attività, con ogni id una volta sola. Le righe senza legame si ricostruiscono
  identiche nei due, id compreso, perché la cucitura parte dai gruppi e tocca
  solo quelli registrati. `erroriSessione()` usa sempre il secondo. Un confine
  sconosciuto **lancia**: prima un'opzione ignorata tornava al predefinito in
  silenzio, e «attività» con l'accento l'avrebbe fatto.

- **Un id ambiguo si dice, invece di prendere il primo gruppo.** Un `sim_uid`
  con un quesito ripetuto, due modalità o due banche non è una lista che il
  runner possa scrivere — un uid nasce a ogni avvio, `mode` e `kind` sono
  uniformi, nessuna selezione ripete un quesito —, quindi porta `ambigua` e
  `motivi`, ed `erroriSessione()` risponde `lista: []` e `quanti: null`: non
  «zero errori», che sarebbe falso. E gli errori su quesiti che la banca non
  ha, che prima sparivano dal conteggio, ora sono in `mancanti`.

- **I chiamanti, uno per uno.** `ritmo()` resta sul confine per pausa, e un
  test nuovo lo pretende: sullo stesso caso misura 60 s, il minuto fra le prime
  due, e non la pausa divisa per due. `erroriSessione()` cambia, e non ha
  chiamanti in pagina. In `app.html` l'elenco delle sessioni, la revisione e
  l'ultima attività del Percorso restano sul predefinito: letto nel codice,
  un'attività con una pausa vi compare in **due righe con lo stesso id** che
  aprono entrambe la metà più recente. Sono interfaccia, e il §7.1 del
  progetto dell'area 3, riscritto sul contratto consegnato, li assegna alla
  sua realizzazione.

- **Il test del quesito ripetuto resta**, con la sua asserzione sul confine
  per pausa invariata. Quella su `erroriSessione()` cambia, perché il suo caso
  — stesso `sim_uid` con un doppione — è ora un id ambiguo; l'intento di prima,
  l'errore della seconda lista che non entra nella prima, si verifica dove la
  regola del doppione lavora davvero, sulle righe senza legame.

- **Prima il test che fallisce:** sette test nuovi, cinque rossi per la
  ragione misurata — `quanti` 1 invece di 2 —, due verdi da subito perché
  tengono fermo il comportamento di prima (il ritmo, il confine ricostruito).
  **Provati al contrario su quindici rotture**, una per volta, tutte rosse nel
  loro test: fra le altre nessuna cucitura, `ritmo()` sul confine
  dell'attività, `erroriSessione()` sul confine per pausa, l'ambiguità mai
  segnalata o segnalata come zero errori, ciascuno dei tre motivi non
  guardato, il confine sconosciuto ignorato, i mancanti taciuti, i gruppi
  ricostruiti cuciti anche loro. Una riga è stata tolta perché nessuna rottura
  la vedeva: il riordino delle righe cucite, che nascono già in ordine.
  Specifica: §4.4 con i due confini, R-FLU-05…09 e R-TEMPO-08, tutti coperti.

  Suite: motore **148/150** con i due skip di sempre (erano 141/143); dati
  242; interfaccia 295; specifica **394** (erano 370); server 58/58 con Node
  25.3 e con la **24.21.0 LTS**, pacchetto verificato con `SHASUMS256.txt`
  scaricato da nodejs.org. Guardiano e controllo della documentazione verdi.
  `site/app.html` e `docs/prossime-sessioni.md` non sono stati toccati.

### Aggiunto — P-28: il trasferimento verso l'account, e le righe che non partono

- **Le sei funzioni della coda non bastavano, ed è stato misurato prima di
  aggiungerne.** Il progetto del client (P-13, §12) chiedeva al motore un
  riepilogo di un trasferimento su più lotti e le righe che non si possono
  inviare, «se i risultati esistenti non bastano». La strada che la pagina
  avrebbe preso da sola — salvate = uid del trasferimento meno `daInviare`
  meno `scartate` — sbaglia in due modi riprodotti: dopo un `409` e
  `risolviConflitto()` la coda è vuota e **tutte** le righe risultano salvate,
  mentre l'azzeramento le ha tolte dal server; e una riga mai messa in coda
  risulta salvata senza essere mai partita. È la regola 1 della coda — esce
  solo ciò che il server nomina — letta al contrario, cioè la deduzione della
  0.4.6 spostata dal togliere al contare.

- **E una riga troppo grande fermava la coda, in silenzio.** Con una riga che
  da sola supera il limite in testa alla coda, `lottoDaInviare()` restituiva
  `null` — «niente da inviare» — con tre righe in coda, e quelle dietro non
  partivano mai. Ora la salta. Con i limiti veri una riga così non passa da
  `validaRiga()`, ma l'archivio della pagina non è validato riga per riga
  prima di entrare in coda; e lo stesso `null` arriva da un uid in coda senza
  la sua riga nell'archivio, cioè coda e archivio salvati in due momenti.

- **Quattro funzioni nel motore.** `nuovoTrasferimento()` passa ogni riga da
  `validaRiga()`, tiene le rifiutate per scaricarle, e rimette in coda anche le
  righe che ne erano uscite: dall'assenza non si sa se una riga è sul server, e
  rimandata torna «già presente», che è una conferma. `registraEsito()` tiene
  le conferme **per nome**, da un invio o da una ricezione, con la generazione
  e l'epoca del database; un'epoca cambiata vale solo per le conferme che la
  dicono. `riepilogoTrasferimento()` dà lo stato — completo, in corso, da
  verificare, con scarti, sospeso, annullato — e scrive «completo» solo quando
  il server ha nominato ogni riga. `nonInviabili()` nomina le righe che non
  partiranno, con il motivo. Fra gli orfani dichiarati finché P-18 non le
  chiama. R-ACC-39 e R-ACC-40.

- **Il progetto del client riallineato, senza ridisegnare niente.** Il §1
  descriveva il server di prima di P-11: dice ora che cosa è cambiato — il
  `409` con `errore: 'email_registrata'` al posto del `202`, il `503` che porta
  già la descrizione dell'account, il profilo con data e Segnali fusi per
  massimo, la lettura dei punteggi dalla descrizione, il cambio d'indirizzo in
  due rotte, la cancellazione —, e il §5.2 e il §8 seguono. Il nuovo §9.3 ha
  il contratto dei trasferimenti, gli stati e che cosa la pagina ne scrive, e
  un esempio d'uso; i contatti del §12 sono chiusi. Il §4.1 prende l'eccezione
  che P-14 aveva trovato in contrasto con il §4.1 dell'area 3: una simulazione
  consegnata con zero risposte apre il suo riepilogo e tiene la riga `_t:'s'`,
  senza risposte inventate e senza l'invito a salvare.

- **Prima il test che fallisce:** sette test nuovi del motore, rossi uno per
  uno — sei per la funzione che mancava, quello della riga grande per la
  ragione misurata, «le righe dietro partono». **Provati al contrario su
  quindici rotture**, tutte rosse nel loro test: fra le altre la deduzione
  dalla coda, la generazione non guardata, l'epoca ignorata nel registrare o
  nel riepilogo, la ricezione che non conferma, il conflitto dimenticato, le
  righe non rimesse in coda o le scartate rimesse, la validazione tolta, il
  `break` sulla riga grande, l'uid senza riga taciuto. **Due erano passate
  verdi** alla prima stesura — l'epoca ignorata da `registraEsito()`, in due
  varianti —, perché nel test la riga rimessa in coda vinceva comunque; ora
  una ricezione dal database nuovo che porta una riga sola lascia le altre da
  verificare, e sono rosse. E l'esempio d'uso del §9.3 è un test del server,
  eseguito contro il server vero: 2.500 righe in due lotti, una rifiutata in
  pagina, una scartata dal server, «in corso» poi «con scarti», mai
  «completo»; quattro rotture lo fanno fallire.

  Suite: motore **155/157** con i due skip di sempre (erano 148/150); server
  **59/59** (erano 58) con Node 25.3 e con la **24.21.0 LTS**, pacchetto
  verificato con `SHASUMS256.txt` scaricato da nodejs.org; dati 242;
  interfaccia **307** (erano 295); specifica **402** (erano 394). Guardiano
  verde. `site/app.html` e `docs/prossime-sessioni.md` non sono stati toccati.


### Progettato — P-20, il Carteggio e il giudizio di chi studia

- **`docs/area-4-progetto.md`: tre porte, materiali, confronto e ciclo completo**
  per prova, esercizi su carta e «Che tecnica serve?», dai capitoli 12–15
  della Specifica UX/UI. Testi per esteso, due stati account, guida facoltativa,
  giudizio rinviabile, riepilogo e revisione: il giudizio umano è detto prima
  dell'avvio, la composizione della prova resta un'assunzione e il carteggio
  entro 12 miglia resta escluso. Senza account la perdita del lavoro è
  dichiarata prima e alla fine; tappeto e giro conoscono soltanto le attività
  valutate nella pagina aperta. Gli stati di accesso consumano il progetto
  del client, senza un secondo flusso di registrazione.
- **Una promessa di conservazione richiede un controllo:** eseguita la funzione
  reale `annotaCart()` isolata, il testo va in memoria con zero chiamate di
  persistenza, mentre la specifica promette il salvataggio a ogni tasto.
  Il §10.1 consegna a Claude su `main` quattro dipendenze: composizione e
  anteprima, identità/revisione di carta e tecniche, bozza account separata
  dalle risposte valutate, controlli e specifica. Non si archivia un giudizio
  mancante come errore; la riprova esatta resta solo quiz finché manca un
  contratto per gli altri filoni, con il motivo scritto nel progetto.
- **Verificato il prodotto esistente, non il disegno già realizzato:** motore
  148/150 con 2 skip previsti, dati 242, interfaccia 295, specifica 394;
  server 58/58 su Node 25.3.0 e LTS 24.21.0, archivio LTS verificato contro
  il manifesto SHA-256 ufficiale. Selezioni reali del motore esercitate con
  storico sintetico, 12 riferimenti locali risolti, guardiano e controllo
  documentale verdi. Quindici casi di accettazione per la realizzazione;
  nessun `site/`, coda o numero di versione modificato.

### Test — P-31: i controlli del ciclo dei quiz conoscono due regimi, e nel nuovo eseguono

- **Il ciclo progettato si riconosce dal raccordo, non da un pulsante.** Il
  §10.1 di `docs/area-3-progetto.md` chiedeva, prima della realizzazione, che i
  controlli del ciclo seguissero il meccanismo di P-06: il regime di oggi
  riconosciuto, e quello nuovo riconosciuto da una funzione che chiama davvero
  `erroriSessione()` e avvia la sua lista. Il contratto è scritto nel §10.1
  prima del codice della pagina: tre funzioni di primo livello —
  `riepilogoQuiz(contesto, fonte)`, `anteprimaRiprova(riprova, fonte)`,
  `avviaRiprova(riprova, fonte, avvia)` —, che la pagina collega al suo
  `apri()`. Una pagina che ne dichiara una è nel regime progettato e deve
  averle tutte; senza, è nel regime attuale, dove una chiamata a
  `E.erroriSessione` o un «Riprova questi N» sono rossi: un numero con una
  seconda fonte. Il regime attuale ha una scadenza, P-19.

- **Il banco esegue riepilogo → anteprima → avvio** (`tests/ciclo_quiz.mjs`),
  con la banca vera, un `E` che registra le chiamate e poi esegue il motore, e
  uno storico estraneo: il caso del §10.1 con un'altra scheda intrecciata, sei
  errori di un'altra attività fra cui lo stesso quesito, un errore corretto
  dopo, base e vela consecutive, un confine ricostruito, un id ambiguo, un
  quesito che la banca non ha, una prova consegnata vuota, uno storico che non
  si legge. **Fra un clic e l'altro i dati cambiano**: un tag, un'altra
  attività, la banca ricaricata e una riclassificazione non devono cambiare
  niente; una risposta dell'attività arrivata da un import, un azzeramento e
  una lettura fallita devono fermare Inizia, e numero e lista si aggiornano
  insieme solo riaprendo. La fonte è congelata, così una funzione che la
  scrive lancia. Poi il nuovo tentativo scrive le sue righe con l'identità
  ricevuta, e il suo riepilogo riguarda solo lui mentre quello di prima resta
  com'era.

- **Provato al contrario su ventisette rotture** della pagina di riferimento
  (`tests/pagina-ciclo-quiz.html`), ognuna rossa e con il difetto nominato: fra
  le altre il ripasso di tutto lo storico al posto degli errori dell'attività,
  il confine per pausa, l'ultima sessione invece di quella per id, le errate
  contate da ciò che si riapre, mancanti, ambiguità e incoerenza non viste,
  superata con domande senza risposta, la prova vuota presa per sparita, la
  lettura fallita presa per vuoto, l'anteprima che non verifica o mostra la
  lista ricalcolata, un tag che invalida la selezione, Inizia che non verifica,
  riapre la lista rifatta, rimescola, riusa l'id o lascia l'auto, il raccordo
  che scrive nella fonte o legge `S`, `erroriSessione` chiamata fuori dal
  raccordo, Inizia che salta il raccordo, `apri()` che ignora l'identità.
  **E il banco contro sé stesso**, un indebolimento alla volta: senza la banca
  ricaricata due rotture passano verdi, senza la fonte congelata una, senza il
  conto delle chiamate una. **La scheda intrecciata non serviva a nessuna
  rottura**: è entrata la ventisettesima — il riepilogo che conta le risposte
  per orario invece che per attività, la ricostruzione della 0.8.0 spostata
  nella pagina —, che senza quella scheda passa verde e con lei è rossa.

- **Il lettore della pagina è uno solo.** L'estrazione delle funzioni che P-06
  aveva scritto dentro `quiz_intenzioni.mjs` è passata in `tests/pagina_js.mjs`,
  e i due banchi la importano; i controlli dei quiz danno gli stessi 307 di
  prima. Specifica: §4.4 e §7.5 descrivono il ciclo, R-FLU-01 coperto per i
  quiz e scoperto per carteggio, tecniche e Segnali, R-FLU-02…04 precisati sul
  motore, R-FLU-10 e R-FLU-11 nuovi, R-UX-06 con la metà coperta dichiarata.
  **Che cosa il banco non vede**, scritto nel §9.6 e nel §10.1: testi, focus,
  ritorni, Esc, consegna idempotente, tag nella revisione, avvisi, figure,
  Base e vela come flusso — collaudo di P-19.

  Suite: interfaccia **402** (erano 307); specifica **412** (erano 402); motore
  155/157 con i due skip di sempre; dati 242; server 59/59 con Node 25.3 e con
  la **24.21.0 LTS**, pacchetto scaricato di nuovo da nodejs.org e verificato
  con `SHASUMS256.txt` — quello lasciato da P-14 non aveva più il manifesto
  accanto. Con la LTS anche l'interfaccia dà 402. Guardiano e controllo della
  documentazione verdi. `site/` e `docs/prossime-sessioni.md` non sono stati
  toccati.

### Realizzato — P-19, il ciclo dei quiz che si chiude

- **Un'attività ripresa dopo una pausa compariva due volte, e le due righe
  aprivano la stessa metà.** Il difetto che P-30 aveva letto nel codice,
  riprodotto nel browser prima di correggerlo: tre risposte con lo stesso
  `sim_uid`, la terza 21 minuti e 1 secondo dopo. In Progressi due righe con
  id `PAUSA1` — «0/1 · 10:22» e «1/2 · 10:00» —; toccando la seconda si apriva
  la prima, una domanda sola; l'ultima attività del Percorso diceva «Risposte:
  1». Le tre chiamate a `E.sessioni()` della pagina passano al confine
  dell'attività, e riguardato dopo: una riga «1/3», una revisione di tre
  risposte, «Risposte: 3».

- **Ogni attività dei quiz finisce in un riepilogo, e da lì si rivede e si
  riprova** (`docs/area-3-progetto.md`). Quante risposte, corrette, errate e
  non affrontate; per una simulazione l'esito della sola prova, detto «non una
  previsione dell'esame». Le uscite hanno una gerarchia: «Riprova questi N
  quesiti» quando ci sono errori da riaprire, il ritorno con il nome
  dell'origine quando non ce ne sono. Il riepilogo di prima dava una
  percentuale e un elenco di errori, e finiva lì.

- **Il numero sul pulsante e la lista che si apre vengono dal raccordo**,
  `riepilogoQuiz()`, `anteprimaRiprova()` e `avviaRiprova()`, con il contratto
  del §10.1: l'unico posto della pagina che chiama `E.erroriSessione()`.
  Inizia riapre l'istantanea presa al riepilogo, e se nel frattempo gli errori
  sono cambiati non avvia niente. La riprova è un'attività nuova —
  `mode: 'sbagliate'`, un `sim_uid` suo, senza timer, avanzamento automatico
  spento per quel runner e la preferenza salvata intatta — e il tentativo di
  prima resta com'era. `erroriSessione` passa dagli orfani alle chiamate
  protette in `docs/eccezioni-interfaccia.md`.

- **La croce del runner era un'uscita senza riepilogo.** Ora è «Termina
  l'attività» in un allenamento — con risposte apre il riepilogo parziale,
  senza torna all'origine e lo dice — e «Consegna la prova» in una
  simulazione, con una conferma in pagina mentre il timer continua. La
  consegna è una sola anche con due clic o con il timer a zero: misurato,
  doppio clic su «Consegna» e una riga `_t:'s'`.

- **Una revisione per il riepilogo e per lo storico**, con «Tutte le risposte»
  e «Solo errori» che non rinumerano, la tua risposta e quella ufficiale anche
  per le corrette, le note, e i tag N/L/C per tentativo con lo stato premuto.
  Dallo storico si riprova direttamente, passando dall'anteprima. Nella
  revisione di una prova non c'è più una durata: `ms` di una riga `_t:'s'` è il
  tempo concesso, non quello impiegato (difetto noto dalla 0.19.2, qui non si
  mostra più).

- **Le figure dicono che cosa mostrano.** Un'inserzione sola per runner e
  revisione, con l'alt «Figura del quesito {n}: {domanda}» e un pulsante
  «Ingrandisci»; l'eccezione `alt="figura"` esce dal file delle eccezioni.

- **Tre difetti di tastiera e di fuoco, letti nel codice e chiusi**, non
  riprodotti prima: a riepilogo aperto dopo uno stop i tasti 1/2/3
  rispondevano ancora al quesito nascosto sotto; Invio su un pulsante del
  runner faceva «Avanti» invece del pulsante; e la pagina sotto il runner e la
  revisione prendeva il Tab. Riepilogo, anteprima, conferma e revisione sono
  ora la sola superficie attiva, e Esc risale un livello per volta — figura,
  revisione, riepilogo, origine. Verificato dopo: un «1» sul riepilogo non
  scrive righe, Esc sulla figura ingrandita lascia aperta la revisione.

- **Collaudo guardato a 375 e 1280 px**, nessuno sbordamento; pulsanti del
  ciclo 48 px, tag 44 px; contrasti misurati: titolo 15,36:1, testi secondari
  5,16:1, pulsanti 9,78 e 11,08:1. Casi del §10.2 esercitati nel browser:
  prima attività fermata a 3 su 10 con un errore (R 3, C 2, E 1, M 7, riprova
  di uno); riprova dallo storico con nuova identità e riepilogo del solo nuovo
  tentativo, quello di prima invariato; Base e vela consegnata in anticipo, con
  la fase in attesa, l'anteprima che dice che la vela non è iniziata, e «Rivedi
  il quiz base» dalla vela; un import con l'anteprima aperta, che riporta alla
  revisione con numero e lista aggiornati insieme; una scrittura fallita, con
  l'avviso al posto della frase ordinaria e il dettaglio ancora rivedibile;
  il drill delle tecniche nel runner, invariato. Console vuota. Non fatti, e
  sono nel §10.4 del progetto: zoom al 200 %, lettore di schermo, persone.

  Suite: interfaccia **469** (erano 402: il banco del ciclo ora gira anche
  sulla pagina vera, nel regime progettato); motore 155/157 con i due skip di
  sempre; dati 242; specifica 412; server 59/59 con Node 25.3 e con la
  **24.21.0 LTS**, scaricata da nodejs.org e verificata con `SHASUMS256.txt`,
  con cui anche motore e interfaccia danno gli stessi numeri. Guardiano verde.
  Versione non toccata; `docs/prossime-sessioni.md` non toccato.

### Test — P-29: la pagina in un browser vero, per i controlli del client

- **Prima la misura, e regge una strada sola senza dipendenze.** Il §12 del
  progetto del client chiede controlli su storage, rete, cookie e offline, che
  nessuna lettura del sorgente vede, e il repo non ha dipendenze. Provate sul
  Mac: **Chrome headless con il suo protocollo su una pipe** risponde in 0,33
  s, e in 2,6 s legge da fuori cookie, IndexedDB, localStorage, sessionStorage
  e Cache Storage, vede il service worker servire una ricarica offline, fa
  parlare due schede e sostituisce una risposta dell'API, con Node 25.3 e con
  la 24.21. Lo stesso protocollo sul WebSocket di Node regge anche lui, senza
  vantaggi. **Firefox 156** non parte da riga di comando con un profilo suo,
  in quattro modi; **Safari 27** vuole «Allow remote automation», che è
  un'impostazione dell'autore, e non legge lo storage. Il tentativo di P-34 in
  quarantena faceva controllare la pagina da sé stessa. La tabella, la scelta e
  che cosa non copre sono nel nuovo «Il banco» del §12. Misurato anche, per il
  §16.3 del progetto degli account: in Chrome il cookie `__Host-rg` va e torna
  fra due porte di `localhost`.

- **Il banco.** `tests/browser.mjs` pilota Chrome, un contesto isolato per
  ogni «nuovo browser»; `tests/client_account.mjs` serve il sito con `/app`
  sostituita dalla pagina sotto esame e avvia accanto il **server degli account
  vero**, sulla porta 8620, con un account già iscritto. `test_interfaccia.py`
  riconosce il regime con il meccanismo di P-06: la pagina che dichiara
  `indirizzoApi()` ha il client. La pagina di oggi non ce l'ha, e deve
  mantenere la promessa di oggi — la risposta resta nel browser e torna dopo
  una ricarica — senza frasi o rotte del client; il regime progettato gira su
  `tests/pagina-client-account.html` finché P-18 non c'è. Il contratto che la
  pagina deve rispettare — gli agganci del runner, `indirizzoApi()`, i testi
  del progetto cercati in quello che si vede — è scritto nel §12 prima che P-18
  lo usi.

- **C-01, C-02 e C-05.** C-01: nuovo browser, attività consigliata, primo
  quesito senza campi password, risposta, riepilogo e revisione, poi lo stesso
  offline con il guscio in cache. C-02: le due frasi del §4.1 visibili, e dopo
  un'attività e la data d'esame niente in nessuno dei cinque depositi del
  browser oltre il guscio, nessuna richiesta all'API, una ricarica che non
  ricorda niente. C-05: con un'email iscritta, sul server vero, la frase, le
  due porte, zero cookie, zero sessioni e zero mail nuove, Accedi con l'email e
  senza password, il riepilogo intatto; e due `409` finti per vedere che la
  pagina riconosce il caso da codice **e** `errore`, non dal testo.
  **C-01 è in parte:** le altre attività — Quiz, simulazioni, Carteggio,
  tecniche, Segnali — non ci sono ancora, e R-ACC-04 resta scoperto. Gli altri
  quindici gruppi entrano in una sessione dopo, sullo stesso banco; la corsa
  fra schede di «da verificare» ha già scritto nel §12 come la eserciteranno
  C-06, C-11 e C-15, leggendo il database del server e non solo lo schermo.

- **Provati al contrario su ventitré rotture** della pagina di riferimento,
  tutte rosse con il difetto nominato: fra le altre un modulo prima del primo
  quesito, la banca chiesta fuori dal guscio, le risposte in localStorage, in
  sessionStorage, in Cache Storage o in un cookie, l'archivio di prima
  riaperto, la data riletta dopo la ricarica, le righe inviate senza account,
  l'avviso nascosto, il `409` riconosciuto dal solo codice o dal testo, la
  frase detta senza chiedere al server, il link della password chiesto da
  solo, la password passata al modulo di accesso, le risposte perse dopo il
  `409`. **E il banco contro sé stesso**, una difesa tolta alla volta, cinque
  volte una rottura passata verde: il sito acceso durante l'offline — perché
  l'emulazione della rete vale per la scheda e non per il service worker —, il
  testo cercato nel DOM invece che in quello che si vede — e allora è rossa
  anche la pagina giusta, perché lo script contiene la frase —, niente `409`
  finti, la POST non guardata, la Cache Storage non letta.

- **Un rosso che a volte mente, trovato ripetendo.** Con attese di 2,5 s e sei
  prove in parallelo, una rottura è uscita rossa per un quesito non ancora
  disegnato sotto carico, e alla corsa dopo per il motivo giusto; un'altra,
  una scrittura in Cache Storage asincrona, è passata una volta su tre. Le
  attese sono salite a 10 e 5 s — costano solo quando una cosa manca davvero —,
  le prove in parallelo a quattro, e la lettura dello storage aspetta mezzo
  secondo. Dopo, tre corse della suite intera, una con la 24.21: 571 ogni volta.

- **Il prezzo:** `test_interfaccia.py` passa da 3 a circa 55 s, e vuole Chrome
  (`RG_CHROME` se non sta in `/Applications`) e la porta 8620 libera; senza, è
  rosso e lo dice. `AGENTS.md` e la specifica §11 lo scrivono. Specifica:
  R-ACC-01, 02 e 09 coperti, 02 e 09 in due regimi; R-ACC-41 il `409` visto
  dalla pagina, R-ACC-42 le rotture; R-ACC-04 scoperto con un motivo più
  stretto.

  Suite: interfaccia **571** (erano 469); specifica **426** (erano 412); motore
  155/157 con i due skip di sempre; dati 242; server 59/59. Con la **24.21.0
  LTS**, scaricata da nodejs.org e verificata con `SHASUMS256.txt`: server
  59/59, motore 155/157, interfaccia 571. Guardiano e controllo della
  documentazione verdi. `site/` e `docs/prossime-sessioni.md` non sono stati
  toccati.
### Corretto — P-36: il testo del carteggio resta nella pagina aperta, e si dice prima

- **Una ricarica perdeva il testo senza che la pagina lo dicesse.** Prima
  della prova e degli allenamenti sulla carta, e nel runner quando c'è testo
  non vuoto, si legge: «Il testo che scrivi resta solo finché questa pagina è
  aperta. Non ricaricare la pagina e non chiudere la scheda fino alla
  consegna.» Un'informazione con l'azione per proteggere il lavoro, senza
  promettere una bozza salvata. Corretto anche il commento che prometteva
  erroneamente un salvataggio a ogni tasto.
- **La conferma del browser protegge l'uscita accidentale.** Il listener
  `beforeunload` si registra soltanto con testo in almeno un esercizio e
  attività non consegnata; si rimuove quando tutto il testo è cancellato,
  alla consegna (anche per scadenza) e alla chiusura del runner. La consegna
  conserva i due tocchi in pagina. Nessun nuovo salvataggio: la bozza per
  account resta P-34, come `docs/area-4-progetto.md` §3.3 richiede.
- **Collaudo in Chromium, guardato a 375 e 1280 px:** prova, giro delle
  tecniche e tappeto, sei casi. Avvisi leggibili a 14 px; vuoto e soli spazi
  non attivano la protezione; testo in un altro esercizio la mantiene;
  navigazione e ricarica annullata conservano i risultati. Primo tocco di
  consegna ancora protetto, scrittura che annulla la conferma, secondo tocco
  che rimuove la protezione; scadenza e chiusura la rimuovono, una nuova
  attività vuota non la eredita. Ricarica dopo consegna e dopo chiusura senza
  conferma. Zero scritture della bozza in localStorage, sessionStorage o
  IndexedDB durante scrittura, navigazione e consegna; zero errori JavaScript.

  Suite: motore **155/157**, con i due skip di sempre; dati **242**;
  interfaccia **469**; specifica **412**; server **59/59** con Node 25.3 e
  **24.21.0 LTS**. Guardiano e controllo della documentazione verdi.
  Versione e `docs/prossime-sessioni.md` non toccati.

### Corretto — P-38: il banco del browser non è più rosso a caso

- **Misurato prima di toccare niente:** quaranta giri del banco del client sul
  Mac dell'autore, venti senza carico e venti con dieci `yes > /dev/null`
  (load average 24). **Tre rossi, tutti nello stesso punto** — «Inizia non apre
  un quesito con le sue risposte», due sulla pagina di riferimento e uno su una
  rottura che così diventava rossa per il motivo sbagliato —, e il carico non li
  moltiplica: 2 su 20 senza, 1 su 20 con. Non era lentezza, e alzare le attese
  non l'avrebbe tolto.

- **La causa: il banco non riconosceva i quesiti corti.** Cercava in `#r-text`
  un testo di più di 10 caratteri. Otto quesiti base su 1.472 sono più corti —
  «I flaps:», «La tuga è:», tre «La brezza:»… —, e la pagina di riferimento
  pesca il primo quesito con `Date.now() % 997`: 5 semi su 997 ne mettono uno in
  testa, lo 0,5 % di ogni avvio, una quarantina di avvii per giro. Il quesito era
  in schermata. Su C-01 il giro si fermava a cinque verifiche, quindi lo stesso
  difetto dava anche il secondo messaggio visto dalla regia, «troppo poche
  verifiche». **Provato deterministicamente**: con la pesca che comincia da «I
  flaps:», il banco di prima è rosso online e offline, quello nuovo dà undici
  verifiche verdi. Il rosso «per un quesito non ancora disegnato sotto carico»
  che in P-29 aveva fatto alzare le attese era, con ogni probabilità, questo.

- **Il banco aspetta uno stato, non una lunghezza:** il testo di un quesito
  della banca — letta dallo stesso `quiz.json` che il sito serve — con tante
  risposte visibili quante ne ha, giudicato dal banco con `attendiValore()`; e
  il rosso dice che cosa c'era in schermata. Il «guscio pronto» chiede ora anche
  un service worker attivo, perché l'install scrive la cache prima di attivarsi
  (misurato: 40 su 40 lo trovavano comunque attivo o in attivazione, quindi è
  lo stato giusto, non un rosso visto). Esclusi misurando anche i caricamenti:
  dopo `vai()` e `ricarica()` la scheda era sulla pagina giusta 40 volte su 40.

- **Due verdi che non misuravano niente, trovati leggendo le attese.** In C-02
  la ricarica non controllava che la palestra tornasse pronta, e una pagina
  rimasta a metà sarebbe passata per «non mostra niente di prima». In C-05, se
  il giro con i `409` finti non arrivava al riepilogo, il gruppo tornava in
  silenzio e due controlli sparivano senza un rosso. Ora sono due verifiche.

- **Il banco provato anche contro i propri rossi falsi:** `VARIANTI_CLIENT`,
  varianti della pagina di riferimento che devono restare verdi. La prima
  comincia da «I flaps:» e tiene fermo il caso a ogni esecuzione.

- **La seconda causa l'hanno trovata i giri dopo la prima correzione, ed era un
  verde falso.** Venti giri senza carico tutti verdi; sotto carico uno su venti
  con la rottura «le risposte in Cache Storage» **passata verde**. C-02 faceva
  una pausa di mezzo secondo dopo il riepilogo e leggeva lo storage una volta.
  Misurato, 60 prove per condizione: la scrittura della rottura compare fino a
  271 ms dopo senza carico e fino a **592 ms** sotto carico; e la lettura dopo
  la ricarica non la ripescava, perché una scrittura non ancora partita muore
  con la pagina. Ora il banco rilegge lo storage per tre secondi, cinque volte
  il peggio misurato, e si ferma alla prima scrittura trovata. È **l'unica
  finestra a tempo che resta**, perché il controllo è un'assenza e un'assenza
  non ha un evento; una scrittura più tarda di tre secondi sfuggirebbe, ed è
  dichiarato nel codice e nel §12 di `docs/account-client-progetto.md`, che ha
  le misure per esteso. Una rottura nuova scrive un secondo dopo il riepilogo:
  col banco di prima passava verde **sempre**, anche dopo la ricarica; ora è
  rossa prima e dopo.

- **Il criterio di fine:** con il codice finale, la suite dell'interfaccia
  intera **zero rossi su 20 giri senza carico**, e zero su altri 40 sotto
  carico — 20 con dieci `yes`, 20 con venti e un load average fino a 181 —, con
  le ventiquattro rotture rosse ognuna per il suo motivo a ogni giro. Prima
  della correzione erano tre su quaranta. Le due serie sotto carico non erano
  previste così: dieci processi di una misura precedente erano rimasti orfani;
  valgono come carico più pesante, e la serie senza carico è stata rifatta dopo
  averli fermati. Durata invariata, 55 s senza carico: le prove di C-02 girano
  in parallelo, e la finestra non si vede.

  Suite: interfaccia **576** (erano 571: la variante che deve restare verde, e
  la rottura nuova con i suoi controlli);
  motore 155/157 con i due skip di sempre; dati 242; specifica 426; server
  59/59 con Node 25.3 e con la **24.21.0 LTS**, scaricata da nodejs.org e
  verificata con `SHASUMS256.txt`, con cui anche motore e interfaccia danno gli
  stessi numeri. Guardiano verde. `site/` e `docs/prossime-sessioni.md` non sono stati toccati.

### Aggiunto — P-41: il motore della mappa di Progressi

- **«Rifai N errori» apre gli N per contratto, non per ordinamento.**
  `coda({ soloSbagliate })` apre tutti gli errori di sempre, anche quelli già
  ripresi, e li mette in fondo: con un tetto a N dava gli N giusti solo perché
  le riprese stavano dietro. È il «Ripasso degli errori» dei Quiz, e resta
  com'è. Accanto c'è ora `coda({ soloDaRifare })`, che apre soltanto gli errori
  la cui **ultima** risposta è sbagliata, contati da `classifica()` come la
  barra della mappa. Stessa regola, stesso numero, e un test lo pretende su
  ognuno degli 8 temi, delle 44 voci e delle 3 voci della vela della banca
  vera, senza tetto e con un tetto più alto di N.

- **`quadro()`: la mappa per tema, a tre stati che sommano al totale.** Una
  riga per tema nell'ordine di `diagnosi().temi`, che lo storico non muove, con
  il peso d'esame e le voci in ordine di banca; sulla vela le tre voci fanno da
  righe con `peso: null`, anche se il chiamante passa il peso della prova — un
  peso per voce non esiste. Ogni riga dà `giusti`, `daRifare`, `maiVisti`,
  `visti`, e «X su Y giusti al primo tentativo» come `primo: { esatte, su }`,
  interi esatti, `null` sotto `PRIMA_MIN_VISTI = 5`: le esatte alla prima non
  si espongono da sole, così sotto soglia non c'è niente da scrivere per
  sbaglio. E `rifai`, la selezione del pulsante **senza tetto**: il tetto
  predefinito di `coda()` è 20, e «Rifai 35 errori» ne avrebbe aperti 20 in
  silenzio. Le righe stanno sugli aggregati di `diagnosi()`, non su un conto
  nuovo.

- **`dovePesa()`: la frase in cima, oppure niente, e perché.** Vince il tema
  con più domande d'esame in ballo — peso × (da rifare + mai visti) / quesiti —,
  confrontato in interi. È la quota del tema non presa all'ultima risposta,
  **non una previsione**: alla parte mai vista non si presta la debolezza che
  `consigli()` prendeva dal tema. Il motivo è la parte più grossa; i pulsanti
  sono prima quello del motivo, poi l'altro, mai uno da zero, ognuno con il
  numero e la selezione che apre esattamente quelli. Manca, e lo dice, sotto
  `FRASE_MIN_VISTI = 20` quesiti visti — le domande di una prova base: sotto, la
  frase la deciderebbero i pesi del ministero e non quello che hai fatto —, con
  niente da fare, a pari merito in testa, e sulla vela, dove «pesa di più» non
  ha un peso su cui reggersi. Niente minuti, come vuole il punto 7.

- **`peggiori()` esce dal motore; `consigli()` esce in due tempi.** I chiamanti,
  prima di decidere: `peggiori()` non ne aveva in pagina dal 9 settembre, solo i
  suoi test e un commento; conta gli errori alla prima risposta, che ripassando
  non calano, quindi non serve a una mappa che legge l'ultima. Tolta, con i suoi
  due test e la riga fra gli orfani; il test del liscio della diagnosi resta.
  `consigli()` ha ancora «Cosa studiare adesso»: resta finché la realizzazione
  dell'area 5 (P-23) non toglie la chiamata e la sposta fra gli orfani, poi una
  sessione su `main` la toglie con `CONSIGLIO_MIN_VISTI`. Scritto nel §4.3 della
  specifica, perché P-22 lo trovi. `quadro()` e `dovePesa()` sono orfani
  dichiarati fino a P-23.

- **Prima il test che fallisce:** dodici test nuovi del motore, rossi uno per
  uno con dei moduli vuoti che lanciavano, e il primo per la ragione misurata —
  l'opzione ignorata apriva il mai visto invece dell'errore; il tredicesimo è
  nato dalle rotture, qui sotto. **Provati al
  contrario su ventiquattro rotture**, una per volta: fra le altre
  `soloDaRifare` trattato come `soloSbagliate` o ignorato, gli errori contati
  fra i giusti, i sbagliati di sempre al posto dei da rifare, `primo` senza
  soglia o dalle esatte di sempre, `esatte1` esposto, il tetto sul pulsante, i
  temi ordinati per quello che manca, le voci nell'ordine della diagnosi, un
  peso inventato per la vela o la vela filtrata per tema, la frase senza
  soglia, senza peso, che risolve il pari con l'ordine, che parla sulla vela,
  col motivo fisso, col pulsante da zero o nell'ordine sbagliato, o con
  `soloSbagliate` dietro «Rifai». **Tre erano passate verdi** alla prima
  stesura: il totale senza le esatte, la frase che conta i quesiti invece della
  quota — i temi del test erano tutti da 40 —, e il pulsante «mai visti» con il
  tetto — i mai visti erano 10. Ora c'è un test con due temi di dimensione
  diversa, e un caso con 30 mai visti: tutte e ventiquattro rosse. Specifica:
  §4.2, §4.3, §5.4, §6.3, Q-DUE nel §10, nuovo §9.10 con R-MAPPA-01…14,
  tredici coperti e uno scoperto — la pagina, che è di P-23.

  Suite: motore **167/169** con i due skip di sempre (erano 155/157); dati 242;
  interfaccia **579** (erano 576: due orfani nuovi, uno in meno), in 55 s;
  specifica **480** (erano 426); server 59/59. Con la **24.21.0 LTS**,
  scaricata da nodejs.org e verificata con `SHASUMS256.txt`: motore 167/169,
  server 59/59, interfaccia 579. Guardiano e controllo della documentazione
  verdi. `site/app.html` e `docs/prossime-sessioni.md` non sono stati toccati.

### Test — P-39: il resto dei controlli del client, e la corsa fra schede

- **C-01 è completo, ed entrano C-03, C-04, C-06, C-11 e C-15**, sul banco
  stabile di P-38. Senza account ogni attività arriva al suo punto d'arrivo —
  Quiz per argomento con riepilogo e revisione, la simulazione con la consegna
  confermata in pagina e nessuna correzione durante la prova, «Che tecnica
  serve?» con la correzione che nomina le tecniche dell'esercizio, la prova di
  carteggio con la risposta scritta accanto a quella ministeriale, una partita
  dei Segnali —, e ogni esercizio e ogni scheda si riconoscono dalla banca, la
  lezione di P-38. Sulla pagina di oggi passano tutti, con gli agganci che ha
  già; il contratto per P-18 è scritto nel §12 del progetto del client prima
  che il client esista. R-ACC-03 e 04 da scoperti a coperti; nuovi R-ACC-43…46.

- **La corsa fra schede, misurata prima di scriverla.** Una richiesta
  trattenuta dal banco e lasciata andare dopo un cambio d'account **parte con
  il cookie nuovo**: la riga di A finirebbe in B, cioè il danno del §9.1 del
  progetto, riprodotto con un'API finta. Annullata dalla pagina con un
  `AbortController`, non arriva al server. E una risposta alla registrazione
  persa dopo il server lascia comunque il cookie: `GET /v1/io` sa che l'account
  c'è. Da lì i controlli: C-06 trattiene la richiesta di A, fa uscire A da
  un'altra scheda ed entrare B, poi la lascia andare e **legge il database del
  server**; C-11 trattiene la conferma di un invio e risponde intanto, fa
  rispondere due schede nello stesso istante, ricarica a metà trasferimento;
  C-15 esce con righe pendenti, offline, con un'altra scheda sulla copia, e
  con una conferma tardiva in volo. Le assenze si guardano per tutta la
  finestra `OSSERVAZIONE`, come in C-02.

- **La pagina di riferimento diventa un client minimo vero**: archivio
  `rg-account-<chiave>` con righe e coda nella stessa transazione, la coda del
  motore, una catena d'invio annullabile, il trasferimento di P-28, l'uscita
  che avvisa le altre schede con un `BroadcastChannel` e le aspetta con un
  lucchetto. Senza account continua a non scrivere niente. Il lucchetto è un
  modo, non il contratto: il banco guarda server e browser, e lo dice il §12.

- **Trentatré rotture nuove**, ognuna rossa per il suo motivo; cinquantasette
  in tutto. **Una è passata verde, e la ragione è il tempo:** scrivere riga e
  coda in due transazioni con un secondo in mezzo. Misurato con un registro
  nella pagina: le due schede leggevano la coda nello stesso millisecondo, ma
  il timer della scheda in secondo piano scattava dopo 1,76 s, quando l'altra
  aveva già inviato. Il banco ora fa il clic nelle due schede nello stesso
  istante, e la rottura è quella che il §9.1 nomina — la coda tenuta in memoria
  da ogni scheda e scritta intera —, rossa tre volte su tre. Due rotture erano
  rosse per il motivo sbagliato alla prima stesura: una finestra che si apriva
  dopo il giro delle viste, e l'uscita senza avviso, che nel riferimento si
  blocca sul lucchetto invece di mandare la riga in B; sono state corrette, e
  la seconda lo dichiara.

- **Il tempo, misurato, e le corsie.** Il server accetta una sola origine,
  quindi i gruppi con l'API giravano in fila: con quelli nuovi la suite
  dell'interfaccia faceva 84 s, e una rottura sola 37 s di scadenze. Ora ci
  sono quattro corsie, ognuna con sito, server, database, orologio e posta
  suoi: la corsia 0 sulla porta 8620 porta la pagina vera, le altre ascoltano
  dove capita, con `:8620` riscritto solo nelle pagine di riferimento. Una
  rottura chiede solo la parte del gruppo che rompe (`C-06:corsa`), e le
  uscite di C-15 si fermano al primo rosso. `tests/browser.mjs` sa trattenere
  e far fallire una richiesta prima o dopo il server.

- **Non fatto, e scritto:** C-07…C-10, C-12…C-14 e C-16…C-18. Per dimensione,
  non perché il banco non li regga: il §12 dice per ognuno che cosa chiederà
  al banco e che cosa non potrà vedere, e R-ACC-05 resta scoperto con loro.
  Nemmeno lo stato «da verificare» in sé: la pagina di riferimento non lo
  produce, e il banco controlla l'invariante — «salvate» solo quando il server
  ha ogni riga —, che vale lo stesso.

  Suite: interfaccia **722** (erano 579), in circa 61 s senza carico (erano
  55); specifica **500** (erano 480); motore 167/169 con i due skip di sempre;
  dati 242; server 59/59. **Più giri, non uno:** la suite dell'interfaccia
  intera 20 volte senza carico, 722 su 722 ogni volta in 61–63 s, e 10 volte
  con dieci `yes`, 722 su 722 in 67–69 s; con la **24.21.0 LTS**, scaricata da
  nodejs.org e verificata con `SHASUMS256.txt`, interfaccia 722, server 59/59,
  motore 167/169. Guardiano e controllo della documentazione verdi. `site/` e
  `docs/prossime-sessioni.md` non sono stati toccati.
### Progettato — P-22: Progressi come mappa per tema

- **`docs/area-5-progetto.md` applica i sette punti di Q-DUE**, chiusa il 29
  settembre: una sola indicazione quando `dovePesa()` la fonda, otto temi base
  in ordine fisso e voci in ordine di banca, tre stati dall'ultima risposta,
  vela senza peso per voce, primo tentativo con la soglia di cinque visti e
  nessun minuto sui pulsanti. Il testo e la lista di «Rifai N errori» vengono
  dalla stessa riga di `quadro()` e da `coda({ soloDaRifare })`, senza il tetto
  di 20. `consigli()` esce dalla pagina nella realizzazione, insieme alla sua
  lista; il ripasso storico dei Quiz resta distinto.
- **Accesso e geometria sono contratti della realizzazione, non promesse già
  verificate.** Senza account il client mostra la porta esplicativa invece di
  Progressi da righe temporanee; account riconosciuto, offline, `401` e
  conflitto conservano i propri stati. Le tabelle che dalla 0.3.0 sforano di
  89 px a 375 px diventano schede verticali da misurare e guardare a 375 e
  1280 px. Prove, andamento e sessioni restano separati dalla mappa. Il §10.1
  chiede a `main` un controllo eseguibile a due regimi prima di P-23 e lascia
  R-MAPPA-14 scoperto finché la pagina non chiama davvero il motore.

### Test — P-43: i gruppi del client che restavano, e un difetto del server

- **Tutti e diciotto i gruppi del §12 del progetto del client ci sono.** Sullo
  stesso banco di P-38 e P-39: C-07 la verifica dell'email e i link, C-08 la
  password, l'accesso e il recupero, C-09 l'archivio di prima degli account,
  C-10 un file dei progressi e i Segnali con l'account, C-12 i limiti di un
  invio e della ricezione, C-13 un azzeramento fatto altrove, C-14 il
  ripristino del server, C-16 la data dopo la registrazione, C-17 l'export e le
  origini senza API, e il resto di C-15 — il `401` all'uscita e «Esci da tutti
  i dispositivi». C-18, la ricerca delle frasi dei due stati, non ha bisogno di
  un browser: undici frasi che gli account rendono false e sette nuove, commenti
  compresi. Nel regime della pagina di oggi i gruppi nuovi controllano che il
  client non ci sia. R-ACC-05 da scoperto a coperto, su un archivio sintetico;
  nuovi R-ACC-47…57. Il contratto per P-18 è cresciuto, ed è nel §12 prima del
  client: fra l'altro le risposte nell'archivio `righe` della copia dell'account.

- **Un difetto del server, trovato misurando prima di scrivere C-08.** Il §5.1
  vuole «Troppi tentativi. Puoi riprovare fra {attesa}», dal `Retry-After`; la
  pagina sta su un'origine e l'API su un'altra, e il CORS non esponeva
  l'intestazione. Misurato in Chrome: `headers.get('Retry-After')` è `null`
  senza `Access-Control-Expose-Headers`, `'30'` con. Il server la mandava e
  nessuna pagina poteva leggerla. Ora la espone, solo al sito: R-ACC-49, con un
  test del server rosso prima e verde dopo, e il §7.3 del progetto degli account
  lo scrive; C-08 lo tiene fermo dalla pagina con il `429` del server vero.

- **La pagina di riferimento è diventata il client che i gruppi chiedono**, e
  costruendola sono usciti due difetti che valgono anche per P-18: dopo
  «Decidi più tardi» la scelta sull'azzeramento non si riapriva, e una
  risposta data intanto sarebbe stata buttata da «Carica il nuovo archivio»,
  che non chiede niente — ora le risposte non salvate si ricontano al momento
  della scelta; e il modulo di registrazione restava aperto sopra «Riprova
  l'invio», l'unica azione utile dopo un `413`.

- **Cinquantatré rotture nuove, 110 in tutto, ognuna rossa per il suo motivo.
  Tre verdi falsi del banco trovati facendolo girare**, non leggendolo: le
  righe di C-12 che IndexedDB rimescola per uid, così una fetta da 2.000 stava
  sotto i 2 MiB; il banco che tornava online prima che l'invio dei punteggi
  fosse davvero fallito — ora `browser.mjs` segna come finisce ogni richiesta,
  e si aspetta quello —; l'azzeramento che la ricezione scopriva prima
  dell'invio, sotto carico. **E un banco appeso**: un'eccezione dentro un
  `onsuccess` lasciava una promessa aperta e la suite non finiva; ora ogni
  comando al browser scade in 30 s con un rosso che lo dice. **E un banco
  caduto, una volta su diciassette giri**, senza un motivo leggibile: il rosso
  mostrava solo l'avviso di `node:sqlite`, e ora mostra codice d'uscita ed
  errore. Il meccanismo, riprodotto: la porta di C-14 presa al riavvio, poi una
  seconda chiusura dello stesso server, eccezione non gestita, uscita 1 senza
  risultati. Ora il riavvio riprova, e la corsia non chiude due volte. Che sia
  stata proprio questa la causa di quel giro non si può dimostrare. Sotto
  carico, un'altra volta, un'uscita di C-15 uguale a quella del riferimento non
  ha finito entro la sua scadenza, in una rottura: le uscite nuove hanno ora la
  scadenza di un caricamento più i tre secondi del lucchetto. **Il banco contro
  sé stesso**, una difesa tolta alla volta, quattro rotture passano verdi: senza
  l'orologio del server tre giorni avanti, con le righe di prima di C-12, senza
  cercare il gettone negli storage, senza leggere il database dopo «Tienile».

- **Il tempo, misurato gruppo per gruppo con `RG_TEMPI=1`:** con i gruppi nuovi
  il banco era passato da 61 a 182 s, e andava quasi tutto nelle rotture, che
  dopo il primo rosso continuavano e pagavano le scadenze del resto. Le parti
  nuove si fermano al primo rosso, come le uscite di C-15, e le corsie sono
  otto. E una contesa vera, non teorica: la suite di P-18 nel worktree
  dell'interfaccia e questa si prendono la stessa 8620, e una parte quando
  l'altra la tiene è rossa. `AGENTS.md` e Q-SUITE lo dicono; C-14, che riavvia
  il server, gira solo sulle corsie con una porta qualunque.

  **I giri, con la suite dell'interfaccia intera:** prima delle ultime due
  correzioni 16 verdi su 17, e il diciassettesimo è il banco caduto; con il
  riavvio di C-14 corretto 14 su 15, e il rosso è la scadenza dell'uscita sotto
  carico; con il codice finale **6 su 6**, uno con la LTS 24.21 e cinque con
  dieci `yes`, in 84 s senza carico e 96–101 s sotto.

  Suite: interfaccia **928** (erano 722), in circa 85 s (erano 61); specifica
  **546** (erano 500); server **60/60** (erano 59), con Node 25.3 e con la
  **24.21.0 LTS**, scaricata da nodejs.org e verificata con `SHASUMS256.txt`;
  motore 167/169 con i due skip di sempre; dati 242. `site/` e
  `docs/prossime-sessioni.md` non sono stati toccati.

### Realizzato — P-18: l'account salva, la prova senza account non lascia dati

- La palestra offre tutte le attività anche senza accesso e avvisa prima e dopo
  che le risposte valgono soltanto per la pagina aperta. Con l'account usa
  l'archivio isolato `rg-account-<chiave>`, la coda e i riepiloghi del motore:
  registra, accede, verifica l'email, recupera la password, sincronizza e
  gestisce conflitti, azzeramenti, uscita e import. Le risposte del vecchio
  archivio restano disponibili per un trasferimento scelto o per l'export.
  La richiesta viene fermata e riconfrontata con `GET /v1/io` prima dell'invio,
  perché il cookie può cambiare fra schede; dopo una registrazione con risposta
  persa, la pagina ricontrolla il cookie invece di considerarla fallita.
- Vetrina e informativa privacy ora descrivono entrambi i regimi. La privacy è
  una **bozza per la versione con gli account**: prima del rilascio l'autore deve
  completare e verificare i punti del §15.4 di `docs/account-progetto.md`
  (identificazione e recapito postale del titolare, log di sicurezza, fornitori
  e accordi, luoghi effettivi dei dati, revisione legale). In
  `docs/eccezioni-interfaccia.md` le chiamate al motore sono aggiornate.
- Verificato: motore **167/169** (due skip previsti), dati **242**, interfaccia
  **780** sul ramo e **1.094** con i controlli P-43 di `main` applicati in una
  copia temporanea, specifica **500**, server **59/59** con Node 25 e con la
  LTS 24.21.0 verificata tramite `SHASUMS256.txt`; guardiano verde. La
  geometria e il dialogo account sono stati guardati a **375** e **1280 px**
  in Chrome e nel Safari installato. P-17 non è ancora nel motore: resta la
  funzione di pagina `tagPerTentativo()` finché arriva l'export.

### Test — P-40: il client degli account ha un regime solo

- **La pagina senza account non passa più.** P-18 ha portato il client nella
  pagina vera, e da qui il banco (`tests/client_account.mjs`) guida ogni pagina
  come una pagina con il client: tolto il regime di prima — la risposta che
  resta nel browser, nessuna frase e nessuna rotta del client —, tolti
  `senzaClient()` e il ramo «attuale» di C-02, C-03, C-05 e C-09, e C-18 cerca
  soltanto i testi della versione con gli account. Un controllo statico nuovo,
  `test_client_nella_pagina` (R-ACC-58), nomina una pagina che non dichiara
  `indirizzoApi()`, ed è provato al contrario sulla pagina di riferimento con la
  dichiarazione tolta o in un commento. **Provato sulla pagina vera di prima**, il
  `site/app.html` di `f218935`: statico rosso, C-18 con 18 difetti, e nel banco
  **16 gruppi su 17 rossi**, 43 verifiche rosse su 142. Resta verde C-01, e deve:
  le attività senza account quella pagina le faceva già.

- **La pagina di riferimento resta**, perché porta le 110 rotture e la variante,
  cioè il banco provato contro i propri verdi e rossi falsi (R-ACC-42). Spostarle
  sulla pagina vera vorrebbe dire sostituzioni di testo in un file
  dell'interfaccia da 200 KB, che si spezzerebbero a ogni ritocco di `ui/*`: una
  rottura che non si applica più è un controllo spento. Il commento in testa lo
  dice; la forma del contratto per chi realizza ora è la pagina vera.

- **Il conteggio vale anche per la pagina vera.** Fino a qui a un gruppo sulla
  pagina vera bastava una verifica — nel regime senza client ne faceva una sola
  —, quindi un giro fermato a metà passava verde. Ora deve farne quante sulla
  pagina di riferimento (`VERIFICHE_CLIENT`). **È lui ad aver visto il rosso
  qui sotto**: «troppo poche verifiche (5 su 8)» accanto al rosso vero.

- **Un rosso falso del banco, in C-13, trovato dal primo giro.** «Scoperto
  ricevendo» azzerava l'account appena il server aveva la riga e ricaricava, con
  la pagina ancora in mezzo al suo invio: a volte la ricezione che segue l'invio
  scopriva l'azzeramento **prima** della ricarica, e dopo la pagina mostrava la
  scelta già rimandata, con «Scegli adesso», invece di «Carica il nuovo
  archivio». Misurato ripetendo solo quella parte sulla pagina vera: **1 rosso su
  14**, e il rosso, ora, dice che cosa c'era in schermata. La pagina non ha
  torto: la scelta c'è e si raggiunge. Il banco aspetta che la pagina smetta di
  parlare con l'API — nessuna richiesta aperta e nessuna nuova per 300 ms —
  prima di azzerare, e se non smette è un rosso che lo dice: **0 su 28**.

- **Un secondo rosso falso, trovato dai giri sotto carico, e nella pagina di
  riferimento.** Con dieci `yes` C-15 è uscito rosso su «un 401 all'uscita»:
  la copia restava, perché «Esci» non partiva mai. Il rosso, fatto parlare, ha
  detto che la pagina era ancora dentro l'account e senza finestre aperte.
  `dentro()` dava l'accesso per finito appena l'intestazione diceva «Account»,
  ma la pagina chiude la finestra d'accesso un attimo dopo; sotto carico il
  banco apriva il pannello dell'account in quell'attimo, e la pagina glielo
  chiudeva sotto. Misurato su C-15 da solo: **4 su 176** sotto carico, 0 su 24
  senza. Ora `dentro()` aspetta anche che nessuna finestra resti aperta — i
  tredici chiamanti entrano tutti in un contesto nuovo, senza risposte —: **0 su
  160** sulla pagina di riferimento e **0 su 80** su quella vera, sotto carico.
  Non c'entra con il regime tolto: era lì da P-43, e l'ha visto il giro in più.

- **Nella specifica**, R-ACC-02, 09, 41, 42 e 57 perdono i due regimi e dicono
  quello che la pagina fa; il §9.9 lo racconta in «Un regime solo». Quello che
  il banco non vede non sta più solo in prosa: **R-ACC-59…63**, scoperti con il
  motivo — Safari e i sottodomini veri in HTTPS, il gesto vero, la mail vera, un
  archivio di prima vero, e tre scelte che nessun gruppo preme («Scarica e passa
  al nuovo archivio», «Cancella queste risposte», l'uscita con punteggi dei
  Segnali non accolti). Il §12 del progetto del client ha il suo «Un regime solo».

  Suite: interfaccia **1.096** (erano 1.094), in 116–117 s senza carico e
  132–140 s sotto carico; **sei giri verdi con il codice finale**: tre senza
  carico, uno con la **24.21.0 LTS** nel `PATH`, due con dieci `yes` (prima della
  correzione di `dentro()` erano stati cinque verdi e uno rosso, quello sopra); specifica **560** (erano 546); motore 167/169 con i due skip di sempre;
  dati 242; server 60/60, anche con la **24.21.0 LTS**, scaricata di nuovo da
  nodejs.org e verificata con `SHASUMS256.txt`. Guardiano verde. Prima di ogni
  giro la 8620 si è guardata libera: al primo tentativo la teneva la suite di
  `rotta-giusta-ui`, e si è aspettato. `site/` e `docs/prossime-sessioni.md` non
  sono stati toccati.

### Progettato — P-24: rifinitura trasversale dell'area 6

- **`docs/area-6-progetto.md`** traduce i capitoli 17–22 della Specifica UX/UI
  in criteri per linguaggio, componenti, responsive, accessibilità e stati nei
  due regimi, senza ridisegnare le aree 1–5. Il vecchio testo del Word sui dati
  nel browser è subordinato al client degli account già integrato; i cambi
  alle scelte delle aree sono proposte da far decidere all'autore.
- **Restano prove da fare, non risultati attribuiti a P-24:** contrasto del tema
  chiaro e reflow a 320 px, zoom nativo e testo al 200 %, lettore di schermo,
  tastiera e stati di errore nei due regimi. P-05 aveva provato soltanto il
  reflow equivalente al 200 %; il banco del client usa clic sintetici. Il
  §10.1 assegna a Claude su `main` controlli e specifica prima di P-25.
- **Verificata la consegna documentale, non la UI progettata:** motore 167/169
  (due skip previsti), dati 242, interfaccia 1.094, specifica 546, server 60/60
  sia su Node 25 sia su Node 24 LTS; guardiano e controllo documentale verdi.
  La prima corsa dell'interfaccia ha incontrato la porta 8620 occupata dal
  checkout `main`; la corsa completa successiva è verde, senza esclusioni.

### Test — P-44: i controlli della mappa di Progressi in due regimi, e nel nuovo eseguono

- **La mappa progettata si riconosce dal raccordo, non da un pulsante.** Il
  §10.1 di `docs/area-5-progetto.md` chiedeva, prima della realizzazione, i
  controlli di Progressi con il meccanismo di P-06 e P-31: la diagnosi di oggi
  riconosciuta, e la mappa riconosciuta da un raccordo che chiama davvero
  `E.quadro()` ed `E.dovePesa()`. Il contratto è scritto nel §10.1 prima del
  codice della pagina: tre funzioni di primo livello —
  `mappaProgressi(richiesta)`, `anteprimaProgressi(azione, richiesta)`,
  `avviaProgressi(azione, richiesta, avvia)` —, con `richiesta` uguale a
  `{ banca, progress, oggi, kind, pesi }`. La prima restituisce le righe di
  `quadro()` com'erano, ciascuna con l'azione del suo «Rifai N errori», e la
  frase di `dovePesa()`; le altre due aprono una selezione solo se la lista ha
  ancora il numero promesso. Senza raccordo la pagina è nel regime attuale, dove
  una mappa, una frase o un «Rifai N errori» sono rossi — un numero con una
  seconda fonte — e la diagnosi a due tabelle deve restare. Il regime attuale ha
  una scadenza, P-23.

- **Il banco esegue la mappa** (`tests/mappa_progressi.mjs`), con la banca vera
  e sei storici: 35 errori aperti in un tema e 25 in una sua voce, con tre
  errori già ripresi che `soloSbagliate` porterebbe a 38; la vela con i pesi
  nella richiesta; cinque risposte, sotto la soglia della frase; senza pesi;
  nessuna risposta; tutto giusto; quasi tutto giusto, dove la frase parla degli
  errori da rifare con due pulsanti. Confronta righe, totale e frase con il
  motore sugli stessi dati, campo per campo, e conta le chiamate: una a
  `quadro()`, `dovePesa()` sullo stesso oggetto, niente `diagnosi()`,
  `consigli()` o `classifica()`. Poi apre ogni azione e **fra un clic e l'altro
  i dati cambiano**: una risposta in un altro tema e la banca ricaricata non
  devono cambiare niente; un errore del tema ripreso, un errore nuovo e un
  azzeramento devono fermare anteprima e Inizia, e riaperta la mappa il numero
  è sceso insieme alla lista. La richiesta è congelata, e i suoi pesi hanno due
  temi scambiati rispetto al decreto: una pagina che li scrive a mano esce rossa.

- **Provato al contrario su ventitré rotture** della pagina di riferimento
  (`tests/pagina-mappa-progressi.html`), tutte rosse per il loro motivo: le otto
  che il §10.1 elenca — numero diverso dalla lista, il tetto di 20 in due punti,
  `soloSbagliate` al posto di `soloDaRifare`, temi e voci riordinati per errori,
  «X su Y» sotto soglia, una frase inventata dove il motore non ne dà, un peso
  per la vela, `consigli()` ancora chiamata — e tredici nate provandolo, fra cui
  un pulsante da zero, l'ordine chiesto alla diagnosi, la frase su un quadro
  rifatto, i pesi scritti in pagina, l'anteprima che non verifica, Inizia che
  non verifica o salta il raccordo, il raccordo che legge `S` o scrive nella
  richiesta. **E il banco contro sé stesso**, una difesa tolta alla volta: senza
  la richiesta congelata passa verde una rottura, senza i dati che cambiano
  due, senza il conto delle chiamate a `quadro()` una; il confronto
  dell'azione delle righe e quello della selezione passata a `coda()` si
  coprono a vicenda, e toglierne uno solo non fa passare niente.

- **Una misura trovata dal banco, e scritta nel §4.3 della specifica.** Provando
  il banco contro sé stesso con i pesi del decreto al posto dei suoi, il suo
  storico non aveva la frase, e la premessa «lo storico ha una frase» è
  diventata rossa: chi ha visto 20 quesiti e più
  senza toccare né Navigazione né Manovra ha `assente: 'pari'`, perché i due
  temi valgono 4 domande ciascuno e mai visti sono in ballo per 4 tutti e due.
  Riprodotto con 25 risposte nei COLREG. È la regola confermata il 29 settembre
  che fa il suo lavoro. I pesi scambiati del banco, scelti per prendere i pesi
  scritti in pagina, lo tengono lontano anche da questo `pari`.

- **Nella specifica**, R-MAPPA-14 passa da scoperto a coperto per quello che il
  banco esegue; entrano R-MAPPA-15, le azioni viste dalla pagina, R-MAPPA-16, le
  rotture, e R-MAPPA-17, scoperto: i testi e il disegno — «Visti Y su N», «Troppo
  poche risposte per dire come va», «Dove pesa di più adesso», il riquadro che
  non c'è — che il banco non guarda. Il §10.1 del progetto dice anche due cose
  per P-23 che il §8 non diceva: `diagnosi` esce dalle chiamate protette con la
  vecchia diagnosi, che ne è l'unico chiamante, e `serieGruppi` resta solo se
  l'andamento la chiama ancora.

  Suite: interfaccia **1.181** (erano 1.096); specifica **572** (erano 560);
  motore 167/169 con i due skip di sempre; dati 242; server 60/60. Con la
  **24.21.0 LTS**, il pacchetto verificato con `SHASUMS256.txt` riletto da
  nodejs.org: server 60/60, motore 167/169, interfaccia 1.181. **Cinque giri della suite dell'interfaccia intera, tutti
  verdi**: tre senza carico in 116–119 s, uno con la LTS nel `PATH`, uno con
  dieci `yes` in 133 s; prima di ognuno la 8620 guardata libera. I controlli
  della mappa, rotture comprese, costano circa due secondi della suite.
  Guardiano e controllo della documentazione verdi. `site/` e
  `docs/prossime-sessioni.md` non sono stati toccati.

### Test — P-46: le tre scelte del client che nessun controllo premeva

- **Tre scelte della pagina vera, e da oggi ognuna ha il suo controllo.**
  R-ACC-63 le teneva scoperte: nessun gruppo del banco le premeva, e una scelta
  mai premuta è una promessa che nessuno verifica. Ora sono parti dei gruppi a
  cui appartengono — `C-13:scarica`, `C-08:cancella`, `C-15:segnali` — e
  `test_interfaccia.py` le registra una per una, così la specifica le nomina
  come R-ACC-63, 64 e 65. **Tutte e tre fanno quello che dicono.**
  «Scarica e passa al nuovo archivio», dopo un azzeramento fatto altrove: il
  file porta le risposte non salvate e si ricarica, la copia non cambia finché
  non si conferma di aver conservato il file, poi è quella del server e niente
  del file rientra. «Cancella queste risposte», dopo il recupero della password
  di un account non confermato: chiede una conferma esplicita, poi toglie le
  righe dal server con una generazione nuova, la copia le segue, e l'account
  resta usabile. L'uscita con punteggi dei Segnali che il server non ha
  accolto: non esce e lo dice, il file di recupero porta `segPunti`, e poi o si
  esce dopo averlo conservato, senza mandarli a nessuno, o «Riprova l'invio» li
  manda e solo dopo esce.

- **Un difetto della pagina, trovato misurando, e lasciato all'interfaccia.**
  Il modo in cui le due conferme rifiutano una casella non spuntata non fa
  quello che dice: «Carica il nuovo archivio» senza «Ho conservato il file», e
  «Cancella queste risposte» senza «Confermo la cancellazione», non fanno niente
  e non dicono niente — schermata identica prima e dopo il clic. Il primo prova
  a scrivere «Conferma la scelta prima di continuare.» in un `#account-esito`
  che il suo pannello non ha. È R-ACC-66, scoperto con la riproduzione nel §12
  del progetto del client; la correzione è di `ui/main`, e il controllo entra
  con lei. Segnata accanto, e non come difetto, una frase goffa: con soli
  punteggi pendenti l'uscita dice «0 risposte non sono sul server e ci sono
  punteggi dei Segnali da inviare».

- **Un verde che non misurava niente, trovato dalle rotture.** «La copia che
  non segue la cancellazione» passava verde: misurato, al momento della domanda
  la copia è vuota su tutte e due le pagine, quindi svuotarla o no era uguale.
  Ora il banco entra prima nell'account, la copia riceve le 2 risposte, e il
  link della password si apre nella stessa scheda: la rottura è rossa. E un
  rosso del banco, non della pagina, trovato prima di scrivere le rotture: il
  file di «Scarica e passa» doveva portare anche la risposta già salvata prima
  dell'azzeramento, che l'altro dispositivo aveva tolto apposta; il §10 chiede
  le non salvate, e il banco ora conta quelle.

- **La pagina di riferimento fa le tre scelte come la pagina vera**, e porta
  **tredici rotture nuove**, tutte rosse per il loro motivo: fra le altre il
  file senza le risposte non salvate, il passaggio appena avviato il download,
  la casella non guardata — in tutte e due le conferme —, la cancellazione al
  primo clic o senza la password appena scelta, la coda con la generazione di
  prima, l'uscita che non guarda i punteggi, il file senza `segPunti`, «Riprova
  l'invio» che esce senza mandarli. Prima, con punteggi pendenti e nessuna
  risposta in coda, la pagina di riferimento usciva e li perdeva; la rottura
  vecchia «si esce con risposte non inviate» segue la condizione nuova.

  Suite: interfaccia **1.246** (erano 1.181), specifica **584** (erano 572);
  motore 167/169 con i due skip di sempre; dati 242; server 60/60. **Sei giri
  della suite dell'interfaccia intera, tutti verdi**: tre senza carico in
  149–154 s, uno con la **24.21.0 LTS** nel `PATH` in 146 s, due con dieci
  `yes` in 173–176 s; prima di ognuno la 8620 guardata libera — al primo
  tentativo la teneva la suite di `rotta-giusta-ui`, e le rotture si sono
  provate intanto con `portaApi`. Il primo giro, prima dei sei, era rosso su una
  verifica sola: la rottura vecchia che non si applicava più, corretta. **La
  suite è più lunga di 33 s, misurato con `RG_TEMPI=1`:** le parti nuove sulla
  pagina vera costano circa 34 s e girano in fila sulla corsia della 8620 —
  scritto in Q-SUITE. Con la LTS, il pacchetto verificato con il
  `SHASUMS256.txt` riletto da nodejs.org: server 60/60, motore 167/169.
  Guardiano e controllo della documentazione verdi. `site/` e
  `docs/prossime-sessioni.md` non sono stati toccati.

### Riscritto — P-26: i testi fuori da `site/`, nella versione con gli account

- **Il client degli account è nella pagina dal 29 settembre (P-18), e con lui i
  testi di `site/`; quelli fuori da `site/` dicevano ancora il sito di prima.**
  Cercati per frase, non per numero di riga, a partire dal §1 di
  `docs/prossime-sessioni.md` e dal §18 di `docs/account-progetto.md`: il
  `README.md` apriva con «Niente account, niente registrazione: le risposte
  restano nel browser di chi studia e non arrivano mai a nessuno», e «Come
  funziona» diceva «nessun backend, nessun database, nessun cookie» e che
  scaricare il file era l'unico modo di non perdere tutto; la skill del
  progetto, «Nessun server, nessun database»; `AGENTS.md`, «`site/` è l'unica
  cosa pubblicata», «nessuna macchina remota, nessun database», e l'archivio
  nel browser come «l'unica copia». Ora dicono i due stati — senza account si
  prova e non resta niente, nemmeno nel browser; con l'account le righe stanno
  sul server, in chiaro, e in una copia del dispositivo, unite per `uid` — e il
  server a parte, su `api.rottagiusta.it`, che si aggiorna allo stesso tag del
  sito. La chiusura di un rilascio in `AGENTS.md` ha il passo in più:
  `rg-aggiorna <tag>` sulla macchina, e `GET /v1/salute` per vederlo arrivato.

- **Nella specifica, le parti che il §2.5 elencava come vere solo senza account
  sono riscritte per i due stati**: il §3, con un titolo nuovo e il server nel
  §3.7, senza «l'unica copia» e senza il ripiego su `localStorage` che la pagina
  non ha più; il §4.6; il §5.3 e il §5.4, con i controlli dell'accesso; il §7.1,
  dove l'archivio vuoto senza account è la regola e non un caso limite; il §7.4
  dei soli registrati; il §7.8, dove il file non è più l'unica via di
  salvataggio; l'Appendice A, dove «nessun dark pattern possibile» diventa un
  imbuto dichiarato e le promesse che lo tengono onesto. Il §2.5 dice ora che
  cosa è cambiato. **Due parti fuori dall'elenco erano false anche loro**: il
  §4.5 metteva i punteggi dei Segnali in `localStorage`, e il §8 diceva, per
  *Interruzione*, che «quello che è stato risposto è salvato». Nessun requisito
  nuovo: le frasi nuove citano quelli che le tengono.

- **`docs/filosofia.md` tiene la nota in testa**, riscritta: il sito deciso è
  nella pagina su `main`, quello pubblicato è ancora la v0.28.0, e la nota si
  toglie nel commit del rilascio che porta gli account — non prima, perché oggi
  è vera, e non dopo. Il resto non cambia.

- **Perché adesso e non al rilascio:** ogni testo nuovo dice il vero dal giorno
  del rilascio, e fino ad allora `main` non si pusha (`prossime-sessioni.md`
  §4), quindi nessuno lo legge pubblicato prima del tempo. Riscriverli il giorno
  del rilascio li avrebbe messi nella stessa sessione del numero di versione.

- **Trovato, e lasciato dove sta.** In `site/app.html` resta un avviso per
  `ARCH.lettura` uguale a `ripiego_assente` o `ripiego_letto` — «Stiamo usando
  un archivio alternativo in questo browser» —, ma nessun punto della pagina
  assegna più quei due valori: è codice che non può comparire, dell'interfaccia.
  E il §5 della specifica descrive ancora le sei modalità dei Quiz e il selettore
  globale: le toglie P-12, e il §2.5 lo dice. Il README, invece, nominava le sei
  modalità dentro «Come funziona», e ora nomina le cinque intenzioni.

  Suite: motore **167/169** con i due skip di sempre; server **60/60**; dati
  **242**; interfaccia **1.246**, in 153 s, con la 8620 guardata libera prima;
  specifica **584**. Guardiano e controllo della documentazione verdi. `site/`,
  `tests/` e `docs/prossime-sessioni.md` non sono stati toccati.

### Realizzato — P-23: Progressi è una mappa per tema

- **La diagnosi a due tabelle e «Cosa studiare adesso» escono.** Progressi usa
  `quadro()` e `dovePesa()` attraverso il raccordo di P-44: otto temi base in
  ordine stabile, voci della banca nel dettaglio, tre stati dell'ultima
  risposta, primo tentativo solo sopra soglia e tre voci vela senza peso.
  Dove la frase manca — anche per `pari` — la mappa resta e non compare un
  consiglio sostitutivo. L'anteprima conta la stessa lista che Inizia passa al
  runner, senza il tetto implicito di 20; se i dati cambiano, ferma l'avvio.
  Prove, andamento da `serieGruppi()` e sessioni con confine dell'attività
  sono sezioni distinte. In `docs/eccezioni-interfaccia.md` `consigli()` passa
  agli orfani perché esce dalla pagina; `quadro()` e `dovePesa()` entrano fra
  le chiamate protette; `diagnosi()` esce, `serieGruppi()` resta.

- **Collaudo guardato in Chrome a 375 e 1280 px, anonimo e con account.**
  Con dettaglio aperto e 25 risposte, `scrollWidth` della pagina è 375 su 375
  e 1265 su 1280; eccedenza massima delle 52 schede: 0 px. Le vecchie tabelle
  che sforavano di 89 px sono state sostituite da schede verticali. Vista la
  frase presente, la legenda e «25 su 25 giusti al primo tentativo»; con 25
  risposte nei COLREG la frase è assente per `pari` e restano 8 temi. Cliccando
  «Prova 155 mai visti», anteprima e runner aprono 155 quesiti; il ritorno
  ripristina Progressi e il focus. Nessuna eccezione nella console.

  Suite: motore **167/169** (2 skip previsti), server **60/60** con Node 25.3
  e Node 24.21.0 LTS (pacchetto già presente, impronta corrispondente a
  `SHASUMS256.txt`), dati **242**, interfaccia **1.329**, specifica **572**.
  Guardiano, verifica del carteggio e controllo della documentazione verdi.
  Nessuna versione modificata; `docs/prossime-sessioni.md` non toccato.

### Test — P-47: Progressi ha un regime solo, e `consigli()` esce dal motore

- **La pagina con la diagnosi a due tabelle non passa più.** P-23 ha portato la
  mappa nella pagina vera, e da qui il banco di P-44 gira su ogni pagina come su
  una pagina con il raccordo: tolto il regime di prima — nessuna mappa, nessuna
  frase e nessun «Rifai N errori» senza raccordo, la diagnosi ancora al suo
  posto —, una pagina senza `mappaProgressi()`, `anteprimaProgressi()` e
  `avviaProgressi()` è rossa e dice quale manca. **Provato sulla pagina di
  prima**, il `site/app.html` di `c053e03`, primo genitore della merge di P-23:
  otto verifiche rosse della mappa — le tre funzioni che mancano, i quattro
  gruppi senza le loro verifiche, e le tabelle con `E.diagnosi()` ancora lì —,
  più cinque rossi di orfani e chiamate protette, che su quella pagina trovano
  `E.diagnosi()` ed `E.consigli()` al posto di `E.quadro()` ed `E.dovePesa()`.

- **Due controlli nuovi, perché il regime solo non lasci un buco.** Uno guarda
  che le tabelle `d-temi` e `d-voci`, e la chiamata a `E.diagnosi()`, non
  tornino accanto alla mappa: il raccordo passerebbe, e la seconda classifica
  che Q-DUE ha tolto si vedrebbe solo guardando la schermata. È la
  ventiquattresima rottura della pagina di riferimento, rossa per il suo motivo.
  L'altro è il conteggio che P-40 ha messo al client: la pagina vera deve fare,
  gruppo per gruppo, tante verifiche quante la pagina di riferimento. Provato al
  contrario togliendo dieci verifiche delle azioni, tutte verdi: «troppo poche
  verifiche (46 su 56)».

- **La pagina di riferimento della mappa resta**, per la ragione di quella del
  client: porta le rotture, e sulla pagina vera, dell'interfaccia, le
  sostituzioni si spezzerebbero a ogni ritocco. Il commento in testa lo dice.
  Nella specifica R-MAPPA-14 e 16 perdono i due regimi e dicono quello che la
  pagina vera fa; R-MAPPA-17 resta scoperto, con il motivo di oggi — i testi e il
  disegno li ha guardati il collaudo di P-23, nessun controllo li ripete. Il §7.4
  chiude il difetto delle tabelle che sforavano di 89 px dalla 0.3.0, sulla
  misura di quel collaudo, e l'Appendice A lo segue.

- **`consigli()` esce dal motore, il secondo tempo scritto da P-41.** Prima i
  chiamanti: nessuno in `site/` — P-23 aveva tolto l'ultimo —, nessuno in
  `server/`, soltanto i suoi sette test e tre commenti del motore. Tolti la
  funzione, `CONSIGLIO_MIN_VISTI`, i sette test e la riga fra gli orfani di
  `docs/eccezioni-interfaccia.md`, che senza la funzione il controllo degli
  orfani avrebbe dato rossa. Il suo liscio resta nella `debolezza` di
  `diagnosi()`, che la Mirata usa, e il test del liscio lo tiene. Il §4.3 lo
  dice dove diceva «esce in due tempi», e il §5.4 descrive la mappa al posto di
  «Cosa studiare adesso».

- **Trovato, e lasciato dove sta:** in `site/app.html` restano le regole CSS di
  `.cons` (righe 268–272 e 551), con il commento «I consigli della Diagnosi
  riusano la riga delle voci deboli»: nessun elemento ha più quella classe. È
  interfaccia, quindi di `ui/*`.

  Suite: motore **160/162** con i due skip di sempre (erano 167/169: i sette
  test di `consigli()`); interfaccia **1.396** (erano 1.394); server 60/60; dati
  242; specifica 584. **Sei giri della suite dell'interfaccia intera, tutti
  verdi**: tre senza carico in 149–154 s, uno con la LTS nel `PATH` in 147 s,
  due con dieci `yes` in 166–167 s; l'ultimo sul codice finale, dopo due
  ritocchi di soli commenti e messaggi. Con la **24.21.0 LTS**, il pacchetto verificato con il
  `SHASUMS256.txt` riletto da nodejs.org: motore 160/162, server 60/60,
  interfaccia 1.396. Prima di ogni giro la 8620 guardata libera. Guardiano e
  controllo della documentazione verdi. `site/` fuori dal motore e
  `docs/prossime-sessioni.md` non sono stati toccati.

### Corretto — P-48: le conferme mancanti si vedono

- **R-ACC-66:** «Carica il nuovo archivio» senza «Ho conservato il file» e
  «Cancella queste risposte» senza «Confermo la cancellazione» ora indicano
  quale casella spuntare, nel pannello accanto alla casella stessa. Prima il
  primo messaggio finiva in un `#account-esito` assente e il secondo clic
  terminava senza risposta; in entrambi i casi la copia e il server restano
  invariati finché manca la conferma. Il controllo dedicato sulla pagina vera
  resta a P-49, dopo la merge.
- **Con soli punteggi dei Segnali da inviare**, l'uscita nomina quei punteggi
  senza parlare di «0 risposte». Rimossa la promessa di un «archivio
  alternativo»: `ARCH.lettura` non assume più i valori `ripiego_*`, quindi
  quell'avviso non poteva comparire. Restano visibili gli errori di scrittura
  e lettura e il pallino su Info.
- **Verificato:** motore 167/169 (2 skip previsti), server 60/60 con Node
  25.3.0 e Node 24.21.0 LTS (archivio conforme al manifesto SHA-256), dati
  242, interfaccia 1.394, specifica 584; guardiano verde. Le suite che aprono
  server locali sono state rieseguite con il permesso di ascolto, dopo il
  blocco `EPERM` della sandbox. Pannello Account e messaggio di stato guardati
  in Chrome a 375 e 1280 px, senza overflow orizzontale. Versione e test
  invariati; `docs/prossime-sessioni.md` non toccato.

### Test — P-49: il controllo di R-ACC-66 sulla pagina vera

- **Un pulsante di conferma premuto senza la sua casella dice che cosa manca, e
  ora c'è un controllo che lo pretende.** P-48 ha corretto la pagina; qui il
  controllo entra nelle due parti di P-46 che portavano già la scelta,
  `C-13:scarica` e `C-08:cancella`. Premuto «Carica il nuovo archivio» o
  «Cancella queste risposte» senza la spunta, il banco guarda per un secondo e
  mezzo che né la copia né il server cambino — le righe e la generazione; in
  C-13 prima si guardava solo la copia, in C-08 solo il server — e poi che la
  finestra nomini la casella che manca. **L'ordine è voluto:** il giro si ferma
  al primo rosso, e una pagina che carica o cancella lo stesso deve essere rossa
  per quello; così le rotture di P-46 restano rosse per il loro motivo.

- **Come si riconosce il messaggio.** Si conta quante volte il nome della
  casella compare nell'`innerText` della finestra (`aria-modal`): prima c'è solo
  l'etichetta, dopo il clic dev'esserci anche il messaggio. Non si cerca la
  frase della pagina, che è dell'interfaccia e cambierà; si pretende che dica
  *quale* casella manca, che è il requisito. Un messaggio scritto in un elemento
  che non c'è — il difetto di prima, `esitoAccount()` senza `#account-esito` —
  non si scrive; uno nascosto non entra in `innerText`; uno fuori dalla
  finestra non si conta; «Conferma la scelta prima di continuare.», la frase di
  prima di P-48, non nomina niente.

- **Provato al contrario.** Undici rotture nuove della pagina di riferimento,
  tutte rosse per il loro motivo: per ciascuno dei due pulsanti il silenzio, il
  messaggio in un elemento che non c'è, nascosto (`hidden` in una,
  `visibility: hidden` nell'altra), generico, e l'azione fatta lo stesso con il
  messaggio giusto accanto; per «Carica il nuovo archivio» anche il messaggio
  scritto nella pagina sotto la finestra. **Il banco contro sé stesso**, una
  difesa tolta alla volta: con `textContent` al posto di `innerText` le due
  rotture del messaggio nascosto passano verdi; con «basta che il nome
  compaia» passano verdi tutte e otto quelle del messaggio, perché l'etichetta
  lo contiene già; cercando in tutta la pagina e non nella finestra, alla prima
  prova **non passava verde niente**, cioè nessuna rottura esercitava quella
  difesa — è entrata l'undicesima, il messaggio fuori dalla finestra, che senza
  la difesa passa verde e con lei è rossa.

- **La pagina di prima di P-48**, `site/app.html` di `9ae8359`, guidata nelle
  due parti: rossa sulle due verifiche del messaggio, e **solo lì** — copia e
  server restavano fermi anche allora, come P-46 aveva misurato. Il rosso dice
  che cosa c'era: «la finestra non nomina «Ho conservato il file» oltre la sua
  etichetta (1 volte, erano 1)», con il pannello in schermata.

- **Nella specifica** R-ACC-66 passa a coperto, con
  `test_client_conferma_mancante`, che pretende le due verifiche sulla pagina
  vera; il §9.9 e il registro lo dicono. **Che cosa il banco non vede**, nel §12
  del progetto del client: che il messaggio stia accanto alla casella, che un
  lettore di schermo lo annunci, colore e contrasto, e un testo reso invisibile
  con `opacity` o con il colore del fondo — sono di R-ACC-60 e R-A11Y-03,
  scoperti, e del collaudo di P-48.

  Suite: interfaccia **1.433** (erano 1.396: tre controlli per ciascuna delle
  undici rotture, le due verifiche nuove sulla pagina vera e i due di
  `test_client_conferma_mancante`); specifica **586** (erano 584); motore
  160/162 con i due skip di sempre; dati 242; server 60/60. **Quattro giri della
  suite dell'interfaccia intera, tutti verdi**: due senza carico in 150–152 s,
  uno con la **24.21.0 LTS** nel `PATH` in 147 s, uno con dieci `yes` in 170 s.
  Con la LTS, il pacchetto verificato contro il `SHASUMS256.txt` riscaricato da
  nodejs.org: motore 160/162, server 60/60, interfaccia 1.433. Prima di ogni
  giro la 8620 guardata libera. Guardiano verde. `site/` e
  `docs/prossime-sessioni.md` non sono stati toccati.

### Aggiunto — P-32: la prova di carteggio nel motore

- **La composizione della prova stava nella pagina, e con lei le sue
  condizioni.** `componiProva()` in `app.html` pescava un esercizio per
  argomento e completava dal resto se un argomento mancava; accanto, tre
  costanti — 4 esercizi, 60 minuti, soglia 3 — e `argomentiSenzaNuovi()`, un
  secondo conto per dire dove la variante ripesca. L'unico test del motore
  sulla prova ne verificava una **copia trascritta** nel test stesso. E il
  ripiego su una banca incompleta era muto: la prova usciva con quattro
  esercizi, e niente diceva che un argomento non c'era. D-01 del §10.1 di
  `docs/area-4-progetto.md` chiedeva il contratto prima della realizzazione.

- **`provaCarteggio(banca, specchio, oggi, { seme, nuoviPrima })`** restituisce
  dalla stessa chiamata la lista e quello che rappresenta: `pronta`, gli
  `argomenti` uno per uno con quanti esercizi, quanti mai provati e quale è
  stato preso, `rappresentati` e `mancanti`, il `completamento` dichiarato, le
  `riprese` della variante, le `carte` distinte della lista, le `condizioni` e
  l'`assunzione`. **La prova cieca non conta riprese, e lo dice con `null`**:
  il suo risultato intero non dipende dallo storico, e «0 riprese» con tutta la
  banca già fatta sarebbe falso. Niente tecniche nell'uscita, perché la
  preparazione non le rivela; niente filtro per carta, perché la 42/D non ha
  carburante. Il ripiego resta quello di prima — completare dal resto invece
  di uscire corta — ma si nomina, e una lista corta non si dice `pronta`.

- **Una sorgente sola per 4, 60 e 3:** `PROVA_CARTEGGIO`, congelata, con la
  fonte (DM 323/2021, art. 6 c. 6) e il testo di **Q-CART4**, che resta
  un'assunzione e ora viaggia con il contratto. `erroriMax` discende dalla
  soglia, e il test di R-SEL-10 lo usa invece di un 1 scritto a mano. Non in
  `meta.json`: la composizione non è un dato del decreto, e deve stare accanto
  ai numeri che la usano; `site/dati/` non è stato toccato.

- **I chiamanti delle due estrazioni, elencati prima:** `estrai()` —
  `simulazione()`, `simulazioneVela()`, `componiProva()` come valore —;
  `estraiNuoviPrima()` — `screening()`, `componiProva()` col selettore acceso.
  Nessuna delle due cambia; `provaCarteggio()` le chiama nello stesso modo, con
  gli stessi semi. **Stessa prova della pagina a parità di seme**: un test
  estrae `componiProva()` e `argomentiSenzaNuovi()` da `app.html`, le esegue
  su 200 semi, con banca intera e senza carburante, storico vuoto e a un
  terzo, variante spenta e accesa, e pretende la stessa lista e le stesse
  costanti; si ritira da solo quando la pagina passa al motore.

- **La pagina non è stata toccata**: è dell'interfaccia. Il passaggio è della
  realizzazione dell'area 4 (P-21), scritto come contratto nel §10.1 del
  progetto — che cosa esce dalla pagina, il campo `variante` nelle righe della
  prova nuova, sconosciuto in quelle di prima. Fino ad allora `provaCarteggio`
  è fra gli orfani dichiarati, ed è fra le selezioni che i banchi dei quiz, del
  ciclo e della mappa registrano: un'intenzione dei quiz che la chiamasse
  sarebbe una seconda fonte.

- **Prima il test che fallisce:** sei test nuovi e due riscritti, otto rossi
  uno per uno per la funzione che mancava. **Provati al contrario su diciotto
  rotture**, una per volta, tutte rosse: la variante ignorata, la cieca che
  conta i nuovi o dichiara zero riprese, niente completamento o completamento
  taciuto, i mancanti mai detti, gli argomenti della lista presi per
  rappresentati, una lista corta detta pronta, un filtro per carta, le carte
  ridotte a una, le riprese senza il completamento, i semi diversi dalla
  pagina, la lista non rimescolata, la soglia a 2, la costante riscrivibile,
  l'assunzione taciuta, la ripresa per argomento mai detta, il completamento
  da un argomento solo. **Due le vedeva soltanto il test di compatibilità**,
  che si ritirerà: per la lista non rimescolata c'è ora un'asserzione che
  resta — ogni argomento può aprire la prova —; i semi contano solo finché
  c'è una pagina da eguagliare. Specifica: §4.2, §4.6, §5.3, Q-CART4, nuovi
  R-SEL-12…16 coperti e R-SEL-17, la pagina, scoperto.

  Suite: motore **166/168** con i due skip di sempre (erano 160/162);
  specifica **608** (erano 586); dati 242; server 60/60; interfaccia
  **1.436** (erano 1.433: i tre controlli del nuovo orfano dichiarato). Con la **24.21.0 LTS**, pacchetto confrontato con il
  `SHASUMS256.txt` riscaricato da nodejs.org: motore 166/168, server 60/60,
  interfaccia 1.436. Due giri dell'interfaccia intera, tutti e due verdi, in
  150 e 147 s; prima di ognuno la 8620 guardata libera. Guardiano e controllo della
  documentazione verdi. `site/app.html` e `docs/prossime-sessioni.md` non sono
  stati toccati.

### Aggiunto — P-33: l'attività intera anche per carteggio e tecniche

- **Il confine dell'attività di P-30 valeva solo per i quiz, e restava così.**
  `sessioni()` ed `erroriSessione()` scartano ogni riga che non è `_t:'q'`, e
  il loro confine predefinito è quello per pausa che `ritmo()` usa. Estenderle
  ai tipi nuovi avrebbe cambiato in silenzio il ritmo, che oggi non vede
  carteggio e tecniche, e messo nelle loro liste righe con un altro significato
  — `verdict` invece di `correct`, un testo scritto invece di una scelta. D-02
  del §10.1 di `docs/area-4-progetto.md` lo diceva: non applicare ai tipi nuovi
  l'API dei quiz. Quindi due funzioni a parte, che **nominano il tipo**:
  `attivitaCarteggio(righe, { tipo })` e `dettaglioCarteggio(righe, banca, id,
  { tipo, filtro })`. Un tipo che manca, sconosciuto o `'q'` lancia: un'opzione
  ignorata tornerebbe in silenzio a un altro tipo. Un test pretende che
  `sessioni()` e `ritmo()` restino dei soli quiz.

- **Le righe di oggi, lette nel codice della pagina, dicono che cosa c'è da
  ricostruire.** `salvaCart()` lega le righe alla prova e dà a giro e tappeto
  `sim_uid: null`, e scrive tutte le righe di un salvataggio con **un solo
  `ts`**, dalla 0.5.0; `correggiTec()` non scrive né `sim_uid` né `mode`.
  Quindi senza legame il carteggio si ricostruisce per **istante e modalità**,
  che è come le righe sono nate — le regole dei quiz, pausa e doppione, lo
  avrebbero fatto peggio: due giri salvati a un minuto di distanza e senza
  esercizi in comune sarebbero diventati uno, e un test lo prova. Le tecniche,
  una riga per risposta, si ricostruiscono con le regole di `sessioni()`. In
  entrambi i casi `fonte: 'risposte'`, dichiarato; l'id ricostruito viene dal
  più piccolo uid del gruppo, perché le righe di uno stesso istante l'archivio
  può restituirle in qualunque ordine, e la revisione riapre per id.

- **Il dettaglio dà schede, conteggi e filtro dalla stessa chiamata**, così il
  numero su «Rivedi quelli da rivedere» e le schede che apre non possono
  divergere. Sulla carta: coincidenti, da rivedere, **senza giudizio** — un
  giudizio che manca non diventa «da rivedere», e la soglia della prova si dice
  solo con tutti i giudizi —, campi scritti, vuoti e **non registrati**, che
  sono due cose diverse. Sulle tecniche: scelte coincidenti e non coincidenti,
  «nessuna scelta» distinta da «scelta non registrata». Su entrambi i non
  affrontati, **solo se la quantità proposta è registrata**: dalle righe
  assenti non si deduce niente. Un esercizio che la banca non ha si nomina e
  conserva il risultato proprio; senza la banca i mancanti sono `null`, non
  «nessuno». Righe con lo stesso uid contano una volta — il ritento della
  scrittura che il §6.3 del progetto chiede con gli stessi uid —, e un ritento
  con uid nuovi è un esercizio ripetuto. Un'attività ambigua — esercizio
  ripetuto, modalità diverse, lo stesso id su un altro tipo, una riga di prova
  estranea, due varianti, una quantità proposta incoerente — non apre schede né
  conteggi.

- **Lo schema per la pagina è scritto prima del raccordo**, nel §10.1 del
  progetto e nel §3.2 della specifica: ogni attività su carta e ogni
  riconoscimento delle tecniche con un `sim_uid` nuovo a ogni avvio, `proposti`
  e `pos` su ogni riga, la variante solo nella prova, nessuna riga `_t:'s'` per
  un allenamento, nessun `verdict` diverso da 1/0. E la compatibilità: le righe
  di prima restano com'erano, e quantità, variante e ordine vi sono «non
  registrati» — tranne la quantità di una prova vecchia, che sta davvero in
  `total` della sua riga di prova, e da lì si legge. Lo schema della variante
  di P-32 non cambia. `site/app.html` non è stato toccato: scrivere le righe
  nuove e leggere da qui riepilogo e revisione è della realizzazione dell'area
  4 (P-21).

- **Prima il test che fallisce:** undici test nuovi, rossi uno per uno per la
  funzione che mancava. **Provati al contrario su trentasette rotture**, una
  per volta, ognuna rossa nel test che la riguarda: fra le altre il tipo
  ignorato, un'attività registrata tagliata dalla pausa, il carteggio
  ricostruito con le regole dei quiz, l'id dalla prima riga, niente deduplica,
  ciascuno dei sei motivi di ambiguità non visto, la variante predefinita
  «cieca», la quantità dedotta dalle righe, la posizione ignorata, il giudizio
  mancante contato come «da rivedere», il campo vuoto confuso con quello non
  registrato, la risposta normalizzata, la soglia senza tutti i giudizi o su un
  allenamento, i mancanti taciuti, e `sessioni()` che comincia a vedere il
  carteggio. **Due erano rosse per la ragione sbagliata** alla prima stesura —
  un errore di sintassi lasciato dalla rottura, e un crash — e sono state
  rifatte come rotture di comportamento; una frase del progetto, la riga di
  prova con una variante diversa dalle sue righe, non aveva un caso, e l'ha
  avuto prima del commit. Specifica: §3.2, §4.4, R-FLU-01 aggiornato, nuovi
  R-FLU-12…22 coperti e R-FLU-23, la pagina, scoperto; le due funzioni fra gli
  orfani dichiarati di `docs/eccezioni-interfaccia.md` fino a P-21.

  Suite: motore **177/179** con i due skip di sempre (erano 166/168);
  specifica **654** (erano 608); dati 242; server 60/60; interfaccia
  **1.442** (erano 1.436: i tre controlli di ciascuno dei due orfani
  dichiarati nuovi), in 150 s. Con la **24.21.0 LTS**, scaricata da nodejs.org e verificata con
  `SHASUMS256.txt`: motore 177/179, server 60/60. Prima del giro
  dell'interfaccia la 8620 guardata libera. Guardiano verde. `site/app.html` e
  `docs/prossime-sessioni.md` non sono stati toccati.

### Aggiunto — P-34: la bozza del carteggio, e un difetto dimostrato invece che dichiarato a parole

- **Prima il difetto, in un browser vero.** Il §7.6 prometteva il testo del
  carteggio «salvato a ogni tasto», e dalla 0.5.0 `annotaCart()` lo tiene solo
  in memoria. La regia l'aveva letto nel codice; ora lo dice la pagina vera,
  guidata in Chrome con il server degli account accanto: entrati in un account,
  due testi in due esercizi della prova, una ricarica, e **nessuna traccia del
  lavoro** — nessuna offerta di riprenderlo, il testo perso. È la verifica
  `C-19:ricarica` del banco del client, rossa sulla pagina di oggi. Perché
  `main` resti verde **senza spegnerla** c'è una tabella nuova in
  `docs/eccezioni-interfaccia.md`, «Difetti aperti dichiarati»: la suite
  pretende che la verifica dichiarata giri sulla pagina vera, con i passi prima
  verdi, e sia **rossa**; il giorno che diventa verde la dichiarazione mente, e
  la suite è rossa finché chi ha corretto non toglie la riga. Provato sui
  risultati che il banco ha già: sulla pagina di riferimento, che ha la bozza,
  la dichiarazione non regge; sulla rottura che toglie l'offerta, sì.

- **Il contratto nel motore, puro.** `nuovaBozza()` congela la lista e prende
  la scadenza da `PROVA_CARTEGGIO`; `validaBozza()` dice il motivo come
  `validaRiga()`, e rifiuta anche una bozza con i campi di una riga — `_t`,
  `uid`, `ts`, `verdict` —, così le due forme non si confondono in nessun verso;
  `modificaBozza()` cambia posizione, testi, consegna e giudizi, mai lista,
  tempo, modalità o variante, e non riscrive il testo consegnato;
  `sostituisciBozza()` è la regola di ogni scrittura dentro la transazione — una
  revisione vecchia non sovrascrive quella di un'altra scheda, una bozza
  conclusa o scartata altrove **non si ricrea** —; `riprendiBozza()` tiene la
  scadenza di prima e manda al confronto una prova scaduta a pagina chiusa,
  consegnata all'istante della scadenza e non della ricarica;
  `concludiBozza()` dà le righe finali con lo schema di D-02 (P-33) e uid che
  nascono dalla bozza, e con un giudizio rinviato **nessuna riga**. Una bozza non
  entra in `ripiega()`, `attivitaCarteggio()`, `fondiArchivio()`, nella coda né
  in un trasferimento: un test lo pretende funzione per funzione.

- **Il raccordo della pagina, senza ridisegnare il client**
  (`docs/account-client-progetto.md` §9.4). La bozza sta in `meta` della copia
  dell'account, alla chiave `bozza-carteggio:<id>`: nessun archivio nuovo e
  nessuna versione nuova del database, niente sul server. «Salvato» solo su
  `oncomplete`; la ripresa proposta e mai automatica; la conclusione in una
  transazione con righe e coda; lo scarto con la conferma in pagina; l'uscita
  che conta le bozze di tutte le schede, **e le riconta dentro il lucchetto
  esclusivo**, prima della richiesta di uscita; una scheda ferma che non
  riapre il database per nome. L'avviso e la conferma del browser di P-36
  rivisti: senza account come oggi, con l'account i tre stati del §3.3
  dell'area 4 e `beforeunload` finché l'ultimo testo non è confermato. **Il
  trasferimento di chi si identifica durante il lavoro**, che D-03 chiedeva di
  chiarire: un runner cominciato senza account resta senza bozza fino alla
  fine, e le sue righe passano dalle porte che il client ha già (§4.3, §5.1).

- **Il banco: C-19, sette parti** (`tests/client_account.mjs`) — senza
  account, ricarica, scadenza (una scheda con l'orologio sessantun minuti
  avanti), guasto (una transazione interrotta dopo il `put`, come fallisce
  IndexedDB), giudizio rinviato e conclusione (le righe sul server lette con
  `attivitaCarteggio()`: un'attività sola, registrata, con la riga di prova),
  uscita, e cambio d'account fra due schede. La pagina di riferimento del client
  ha ora la bozza, e passa C-19 intero; **quattordici rotture**, tutte rosse per
  il loro motivo. **Una era passata verde alla prima stesura**, i sessanta minuti
  nuovi alla ripresa: il banco confrontava il tempo prima e dopo la ricarica
  nella stessa scheda, e tutto il giro stava nel primo secondo della prova —
  «60:00» prima e dopo. Ora il tempo si legge in una scheda con l'orologio dieci
  minuti avanti. E una misura del server: C-19 crea sette account, e il limite
  di cinque registrazioni l'ora per indirizzo l'ha fermato alla sesta, con un
  `429`; fra una parte e l'altra l'orologio del server avanza, come fa la corsia
  fra un gruppo e l'altro.

- **Provati al contrario anche nel motore**: diciannove rotture, una alla volta.
  Una è passata verde — i giudizi durante il lavoro —, perché la regola stava in
  due posti e toglierne uno lasciava l'altro; tolta la copia in
  `modificaBozza()`, la regola è una, in `validaBozza()`, e toglierla è rosso.

- **Il tentativo in quarantena** (`~/Software/rotta-giusta-quarantena/p34-2026-09-26/`)
  è stato letto e non preso. Il suo controllo rosso passava se `annotaCart()`
  scriveva in `localStorage`, cioè avrebbe dato per corretta una violazione
  dell'ADR-004; il suo raccordo apriva `rg-account-<chiave>` alla versione 1 con
  archivi suoi (`bozze`, `accesso`, `coda`), che sulla copia che la pagina vera
  crea già — versione 1, `righe` e `meta` — non esisterebbero (letto nel codice,
  non eseguito); e il suo banco era a parte, prima di P-18 e del banco del
  client. Ne restano le idee che reggevano: una bozza per attività, la revisione
  nella transazione, il ciclo d'accesso come barriera, l'uscita che chiede.

- **Specifica:** §7.6 dice che cosa la bozza promette quando la pagina l'avrà;
  §3.2 che la bozza non è una riga; nuovo §9.11, R-BOZZA-01…07. `AGENTS.md`
  tiene il difetto fra i noti, con i puntatori nuovi: è ancora vero nel prodotto.
  Area 4, §10.1 D-03: consegnata. Le cinque funzioni nuove fra gli orfani
  dichiarati fino a P-21, che le consuma, toglie la riga del difetto nello stesso
  commit e fa girare C-19 intero sulla pagina vera.

  Suite: motore **185/187** con i due skip di sempre (erano 177/179); dati 242;
  interfaccia **1.517** (erano 1.442), in circa 173 s (erano 150); specifica
  **682** (erano 654); server 60/60. Con la **24.21.0 LTS**, verificata contro
  `SHASUMS256.txt` riscaricato da nodejs.org: motore 185/187, server 60/60,
  interfaccia 1.517. **C-19 ripetuto**: sei giri senza carico e sei con dieci
  `yes`, la pagina di riferimento verde con le sue 28 verifiche ogni volta, la
  pagina vera rossa ogni volta sulla sola verifica dichiarata. Prima di ogni
  giro dell'interfaccia la 8620 guardata libera; il carico fermato dopo.
  Guardiano e controllo della documentazione verdi. `site/app.html`
  e `docs/prossime-sessioni.md` non sono stati toccati.

### Test — P-35: i controlli del Carteggio conoscono due regimi, e nel nuovo eseguono

- **Il raccordo prima della pagina.** D-04 del §10.1 di
  `docs/area-4-progetto.md` chiedeva, prima della realizzazione dell'area 4, il
  meccanismo di P-06, P-31 e P-44: il regime di oggi riconosciuto, e quello
  nuovo riconosciuto da un raccordo che il controllo esegue. Il contratto è
  scritto in quel §10.1 prima del banco e della pagina di riferimento: cinque
  funzioni — `preparaCarteggio`, `avviaCarteggio`, `concludiCarteggio`,
  `rispostaTecnica`, `riepilogoCarteggio` — con una fonte sola, congelata. Una
  pagina che ne dichiara una è nel regime progettato e deve averle tutte; senza,
  è nel regime attuale, dove una chiamata a `E.provaCarteggio`,
  `E.dettaglioCarteggio`, `E.nuovaBozza` o `E.concludiBozza` è rossa: il motore
  nuovo senza il raccordo, un numero con una seconda fonte. Il regime attuale ha
  una scadenza, P-21.

- **Una scelta di contratto, presa qui e scritta:** il lavoro del runner della
  carta ha la forma della bozza di P-34 **in tutti e due gli stati d'accesso**,
  in memoria; con l'account lo stesso oggetto si scrive in `meta`, senza no. Così
  la scadenza viene dal motore, e le righe finali e i loro uid vengono da
  `concludiBozza()` con e senza account: nessuna riga con un giudizio rinviato,
  gli stessi uid a un ritento. La bozza senza account non esiste come
  conservazione, e R-BOZZA-05 continua a pretenderlo.

- **Il banco esegue il giro** (`tests/ciclo_carteggio.mjs`): prepara le quattro
  attività con le banche vere — anche su una banca di tre esercizi, una senza
  carburante, una vuota, senza banca, con la lettura fallita —; fra la
  preparazione e Inizia cambia i dati, e un esercizio del tappeto o del giro
  fatto altrove deve fermare Inizia mentre la banca ricaricata no; porta il
  lavoro dell'avvio al confronto e ai giudizi con le funzioni vere del motore,
  conclude, ritenta, e rilegge il riepilogo di quelle righe fra quiz, una prova
  di prima di P-32, un giro senza legame, un legame ambiguo e un esercizio che
  la banca non ha. **Due valori tornano dal banco invece che dal motore**,
  l'assunzione di Q-CART4 e i minuti della prova: una pagina che li copia a mano
  esce rossa, come la prova vela da 5 domande di P-06. 240 verifiche in 60 ms.

- **Provato al contrario su trentanove rotture** della pagina di riferimento
  (`tests/pagina-ciclo-carteggio.html`), ognuna rossa e con il difetto nominato:
  fra le altre la prova ricomposta con `estrai()`, l'assunzione copiata parola
  per parola dal motore, le condizioni scritte a mano, le costanti `PROVA_*`
  tenute in pagina, una prova corta chiamata pronta, le riprese della cieca
  dette zero, il tappeto a cinque, la lettura fallita presa per uno storico
  vuoto, Inizia che non rifà la preparazione o apre la pescata di adesso,
  un'identità riusata, uid nuovi a ogni ritento, il giudizio rinviato scritto
  come «da rivedere», la risposta del riconoscimento senza legame o giudicata
  per inclusione, il riepilogo che riconta da sé o dà l'esito a un allenamento,
  «Rivedi» con il conto di tutte le schede, la riprova anche nel Carteggio, una
  riga di prova scritta fuori dal raccordo, `carteggio_e12.json` caricato. **E il
  banco contro sé stesso**, una difesa tolta alla volta: senza i due valori del
  banco due rotture passano verdi, senza la fonte congelata una, senza i dati
  che cambiano fra i clic due non nominano più il loro difetto, così come senza
  il conto delle selezioni e senza il ritento; senza lo storico estraneo le
  premesse del banco sono rosse. **La banca senza carburante non serviva a
  nessuna rottura**: è entrata la trentanovesima — una prova completata dal
  resto, che il motore dà pronta, bloccata come corta —, che senza quel caso
  passa verde. Alla prima stesura due rotture erano sbagliate per colpa del
  banco: un tappeto di cinque esercizi lo faceva cadere invece di dare un rosso,
  perché i giudizi erano scritti per quattro, e l'espressione sui filtri per
  tipo si fermava alla parentesi di `(r)`, lasciando passare verde una revisione
  filtrata in pagina. Corretti tutti e due.

- **R-UX-03 prima dell'avvio, nel browser.** C-01 guarda, prima di `#c-start`,
  che il testo che si vede del Carteggio dica che il giudizio è di chi studia:
  la frase del progetto («Sei tu a giudicare») o quella della pagina di oggi
  («e dici quali avevi preso»), che esce con il suo regime. La rottura nasconde
  la frase con `hidden`, e il gruppo è rosso. C-01 passa da 33 a 34 verifiche.

- **Nella specifica:** R-SEL-17 e R-FLU-23, lasciati scoperti per la pagina da
  P-32 e P-33, coperti in due regimi; R-FLU-01 rimanda per carta e tecniche a
  R-FLU-24 (il riepilogo) e R-FLU-25 (la riprova che resta dei quiz, con un
  controllo suo, distinto); nuovi R-FLU-26 (il banco contro sé stesso) e
  R-UX-07 (Q-AMBITO: la pagina non carica `carteggio_e12.json`, provato al
  contrario nei due regimi); R-UX-03 coperto; Q-CART4 e Q-AMBITO dicono il loro
  controllo; §7.3 e §7.6 dicono che la lista annunciata è quella che parte e che
  il lavoro ha la forma della bozza nei due stati. **Nel progetto del client:**
  §4.1 con la prova consegnata senza testo — confronto e giudizi, la riga
  `_t:'s'` solo alla conclusione — e il giudizio rinviato, che non è un
  riepilogo e non mostra l'invito; §9.2 con la bozza di D-03 come l'eccezione
  dichiarata, dell'account; §12 con la verifica nuova di C-01.

- **Un rosso falso del banco del client, in C-10, trovato dai giri sotto
  carico.** Due giri della suite intera su quattro, con dieci `yes` e load
  average fino a 18, sono usciti rossi su «importato: le righe valide sul
  server, il riepilogo unico e gli scarti da scaricare», che non è una parte
  toccata qui; C-10 da solo, sotto carico, 12 giri su 12 verdi. Il controllo
  univa tre condizioni in una: diviso, ha detto «righe sì, riepilogo sì,
  pulsante no». Il pulsante «Scarica le righe non importate» la pagina lo
  disegna dopo il testo del riepilogo, e il banco lo guardava una volta sola,
  subito: la famiglia di P-38. Ora lo aspetta come le altre due condizioni, e il
  rosso dice quale manca; la rottura che toglie il pulsante resta rossa.

  Suite: interfaccia **1.666** (erano 1.517), in 168–172 s senza carico e
  192–201 s sotto carico; specifica **704** (erano 682); motore 185/187 con i
  due skip di sempre; dati 242; server 60/60. **Dieci giri della suite
  dell'interfaccia**: prima della correzione di C-10 sei, di cui due rossi solo
  lì; dopo, quattro verdi, tre con dieci `yes`. Con la **24.21.0 LTS**, il
  pacchetto verificato contro `SHASUMS256.txt` riscaricato da nodejs.org:
  motore 185/187, server 60/60, interfaccia 1.666. Prima di ogni giro la 8620
  guardata libera, il carico fermato dopo. Guardiano e controllo della
  documentazione verdi. `site/` e `docs/prossime-sessioni.md` non sono stati
  toccati.

### Test — P-45: la rifinitura trasversale misurata nel browser, e sette difetti veri

- **I controlli che il §10.1 dell'area 6 chiede, misurando invece di cercare
  stringhe.** Nove gruppi nuovi del banco del client, T-01…T-09 in
  `tests/client_account.mjs`, nello stesso Chrome e con lo stesso server degli
  account: la prova senza account che dice «salvato»; l'account che dice «sul
  server» mentre le risposte sono in coda, e il numero da inviare che non viene
  dalla coda; una scrittura fallita che si annuncia, si vede e non spegne Info
  nemmeno dopo una scrittura riuscita; un `401` durante il lavoro dopo il quale
  chi entra vede le righe di chi c'era; la finestra «Accedi» che deve prendere,
  tenere e rendere il fuoco; ogni arresto di Tab con un indicatore e non
  coperto; un avviso nel DOM ma nascosto; lo sbordo a 1280, 640, 375 e 320 px
  nei due regimi d'accesso; il contrasto di ogni testo e i bersagli di tocco.
  Il banco ha imparato tre cose nuove, in `tests/browser.mjs`: la larghezza
  della finestra, i tasti veri del protocollo — Tab sposta il fuoco, Esc arriva
  a chi ce l'ha —, e l'albero di accessibilità del browser, che dice se un
  elemento è esposto o ignorato. Le misure che girano nella pagina sono
  funzioni vere, serializzate, e il contratto — agganci, frasi, fonti dei
  numeri, superfici — è nel nuovo §10.3 di `docs/area-6-progetto.md`, prima di
  P-25.

- **Due regimi, ma non quelli delle aree 2–5.** Qui sono i regimi d'accesso, e
  ogni gruppo dice in quale gira. Il passaggio a P-25 non ha un raccordo da
  riconoscere: le garanzie valgono per la pagina di oggi come per quella nuova,
  e quello che la pagina di oggi non rispetta sta fra i «Difetti aperti
  dichiarati» di `docs/eccezioni-interfaccia.md`, con la verifica che lo
  dimostra. La suite pretende che ogni riga sia ancora vera, e che una rottura
  della pagina di riferimento faccia diventare rossa la stessa verifica: una
  dichiarazione che non ha mai visto il suo difetto non dichiara niente. Alla
  merge di P-25 le righe `T-*` non ci devono più essere.

- **Sette difetti della pagina vera, misurati e — dove si vedono — guardati in
  una schermata.** (1–2) Lo stato dell'invio non si ridipinge quando una
  risposta entra in coda, solo quando un tentativo finisce: con due risposte
  che il server non ha la pagina dice ancora «Le risposte di questo dispositivo
  sono confermate sul server», e non «2 risposte da inviare». Offline dura circa
  un secondo, misurato; con una rete che non risponde dura quanto la richiesta,
  fino ai 15 s del timeout — il banco la tiene ferma, ed è per questo che il
  controllo è deterministico. (3) A 375 × 800 px «Inizia l'attività»,
  «Scegli un'attività» e la scheda dei Segnali prendono il fuoco sotto la
  barra fissa in basso (WCAG 2.4.11). (4–5) A 320 px la pagina scorre di lato di
  16 px senza account e di 23 con l'account — l'intestazione, e «Accedi» esce
  dallo schermo —, di 49 in «Che tecnica serve?». (6) Il grigio `rgb(96, 120,
  135)` passa sul bianco (4,63:1) e non sul fondo della pagina (4,26:1) né
  sull'azzurro dei Segnali (4,09:1): piè di pagina, versione, indicazioni.
  (7) I tag N/L/C misurano 31 × 29 px, sotto l'obiettivo di 44 e sopra il
  minimo AA di 24. Li chiude P-25; la correzione di (1–2) è una riga.

- **Quello che la pagina vera fa già bene, ora tenuto fermo:** senza account
  nessuna frase di conservazione in cinque superfici, e Info conta le risposte
  della pagina; con l'account Info conta le righe della copia; il guasto si
  annuncia in una regione viva e resta su Info in ogni vista; dopo un `401` la
  porta torna «Accedi» e B non vede niente di A; la finestra «Accedi» tiene il
  fuoco, si chiude con Esc e lo restituisce, ed è un dialogo modale con il suo
  nome; nessuno sbordo a 1280, 640 e 375 px, nemmeno con l'account in
  Progressi, dove le due tabelle da +89 px della 0.3.0 non ci sono più.

- **La pagina di riferimento del client impara l'area 6**: un `meta viewport`,
  bersagli da 44 px, la scrittura fallita detta e mai spenta, lo stato
  ridipinto quando una risposta entra in coda, Info che legge la copia, il `401`
  che riporta «Accedi» e un accesso che ferma prima la copia di chi c'era, la
  finestra con il fuoco. **31 rotture nuove**, ognuna rossa per il suo motivo;
  due rotture del client di prima sono state adeguate al testo nuovo della
  pagina, senza cambiare che cosa rompono.

- **Il banco provato contro sé stesso.** Senza `meta viewport` il telefono
  disponeva la pagina di riferimento a 980 px, e la «misura a 375» ne misurava
  980 senza dirlo: ora il banco controlla la larghezza vera e lo dice. Sei
  difese tolte una alla volta — che cosa sta sopra un avviso, l'albero di
  accessibilità, l'opacità, il confronto dell'aspetto al fuoco, i contenitori
  che scorrono, i testi tagliati — fanno passare verde la loro rottura; due
  rotture restavano rosse per un sintomo diverso, ed ora stanno in contenitori
  più stretti dello schermo. Un rosso falso trovato facendo girare il banco: un
  avviso ripetuto nel Percorso sotto il runner veniva misurato al posto di
  quello del runner; e il Percorso ridisegna i suoi avvisi mentre il banco li
  interroga, quindi misura e domanda al browser si ripetono insieme.

- **Nella specifica**, nuovo §9.11 con R-RIF-01…16: undici coperti dal banco,
  cinque scoperti con il motivo — zoom nativo e testo al 200 %, contrasto non
  testuale e colore da solo, percorsi interi a tastiera, lettore di schermo,
  ciascuno con la procedura della prova manuale, e R-RIF-16 per gli stati del
  client dove contrasto e bersagli non sono ancora misurati. R-A11Y-03 passa a
  coperto. **L'appendice A ha le misure del 30 settembre**, con browser e
  larghezze, e dice «non fatto» dove non si è misurato: non dichiara
  «conforme AA».

  Suite: interfaccia **1.863** (erano 1.666), in 186–188 s senza carico e 215
  s con dieci `yes`; specifica **758** (erano 703); motore 185/187 con i due
  skip di sempre; dati 242; server 60/60 con Node 25.3 e con la **24.21.0
  LTS**, il pacchetto verificato contro il suo `SHASUMS256.txt`. **Quattro
  giri della suite dell'interfaccia**: il primo con due rossi, le due rotture
  del client che non si applicavano più alla pagina di riferimento, adeguate;
  poi tre verdi, uno senza carico, uno con dieci `yes`, uno con la LTS nel
  `PATH`, con cui anche il motore dà 185/187. Il banco dell'area 6 da solo
  altre tre volte sotto carico, load average fino a 13: 197 verifiche verdi
  ogni volta. Prima di ogni giro la 8620 guardata libera; il carico fermato
  dopo. Guardiano verde. `site/` e `docs/prossime-sessioni.md` non sono stati
  toccati.

### Test — P-51: il controllo del Carteggio riconosce il regime della pagina vera

- **Un controllo fissava il regime della pagina vera, e ha fermato P-21 con la
  pagina giusta.** `test_carteggio_ambito` prova al contrario che una pagina che
  carica `carteggio_e12.json` è rossa (R-UX-07), e per farlo etichettava
  `app.html` come «attuale» e pretendeva che la sua copia rotta lo fosse. Il
  giorno che la pagina porta il raccordo il controllo diventa rosso, e il rosso
  non dice niente di sbagliato nella pagina. **Riprodotto sulla bozza vera di
  P-21**, letta dal worktree `ui` e copiata nello scratchpad, senza toccarla: il
  controllo di prima dà proprio quel rosso, «la pagina attuale e' nel regime
  attuale — progettato», e con la pagina di oggi è verde, che è il motivo per
  cui né P-35 né la regia l'avevano visto.

- **Ora il regime della pagina vera si riconosce**, con la stessa regola del
  banco (`riconosci_carteggio()`, estratta da `regime_carteggio()` senza
  cambiarla): la copia rotta dev'essere nel regime in cui è la pagina, qualunque
  sia, e rossa per `carteggio_e12`; la pagina di riferimento resta fissata al
  progettato. **Prima il rosso:** il controllo gira anche con due pagine nel
  regime progettato al posto della vera — la pagina di riferimento, e una copia
  di `app.html` con le cinque funzioni del raccordo innestate — e con la regola
  di prima dà due rossi, uno per pagina, per la ragione misurata; con la
  correzione nessuno. Provato al contrario anche togliendo l'iniezione del file:
  sei rossi. È un controllo solo, perché R-UX-07 nomina `test_carteggio_ambito`.

- **Cercati gli altri punti, e non ce ne sono.** Quiz e ciclo leggono il regime
  della pagina vera (`regime_app()`, `regime_ciclo_app()`), e fissano il
  progettato solo alle loro pagine di riferimento; la mappa ha un regime solo
  per decisione (P-47); nel Carteggio `registra_carteggio()` legge. I test del
  motore che confrontano copie della pagina — `componiProva()`, `totScreening()`,
  `daAllenare()` — si ritirano da soli quando la copia sparisce. Il banco del
  client accetta tutte e due le frasi del giudizio (la vecchia esce con P-50),
  C-19 e le righe T-* di P-45 sono difetti dichiarati a due versi, e i gruppi
  T-01…T-09 guardano le viste senza riconoscere un regime di pagina. **Con la
  bozza di P-21 al posto della pagina vera** i controlli statici dei quattro
  regimi sono tutti verdi; restano rossi solo quelli che P-21 deve aggiornare
  per prompt — orfani e chiamate protette in `docs/eccezioni-interfaccia.md` —
  e uno che non è un controllo sbagliato: nella bozza `#v-tec` non ha più un
  ingresso, perché «Che tecnica serve?» parte dalla porta del Carteggio, e il
  progetto dell'area 4 non dice che fine fa quella vista. **La suite intera sulla
  bozza**, browser compreso, dà 21 rossi su 2.110, nessuno da un regime: dodici
  sono quegli aggiornamenti, gli altri nove vengono dallo stesso fatto — il banco
  del client entra in «Che tecnica serve?» da `[data-v="tec"]`, un aggancio del
  contratto del §12 del progetto del client, e la bozza non l'ha più: C-01 si
  ferma a 32 verifiche su 34, T-07, T-08 e T-09 non aprono la vista, e il
  difetto dichiarato di T-09 risulta chiuso perché i tag N/L/C non vengono
  misurati. Il rosso di C-19 sulla ricarica, dichiarato, resta rosso anche sulla
  bozza. Per la regia: o P-21 tiene l'aggancio, o si decide su `main` dove va.

- **`RG_PAGINA=<file>`** fa girare la suite dell'interfaccia su una copia della
  palestra al posto di `site/app.html`, anche nel browser, perché ogni controllo
  e il banco del client la prendono da `leggi()`: serve a misurare una bozza di
  un altro worktree senza toccarla. La riga finale dice su quale pagina si è
  misurato, verde o rossa, così un verde su una copia non passa per un verde di
  `main`. In `AGENTS.md` fra i comandi, e nel §9.6 della specifica con il
  registro.

  Suite: interfaccia **1.872** (erano 1.863), in 190 s, due giri verdi; specifica 758; motore
  185/187 con i due skip di sempre; dati 242; server 60/60 con Node 25.3 e con
  la **24.21.0 LTS** — la cartella estratta da una sessione precedente della
  regia, il cui pacchetto non c'era più per riverificarne l'impronta; il server
  non è stato toccato. Guardiano verde. Prima di ogni giro la 8620 guardata
  libera; nessun carico di prova lanciato. `site/` e
  `docs/prossime-sessioni.md` non sono stati toccati, e nemmeno il worktree `ui`.

### Test — P-12: i quiz hanno un regime solo

- **La pagina a sei ingressi passava ancora, e con cinque verifiche.** P-06
  aveva scritto i controlli dei quiz in due regimi perché `main` restasse verde
  mentre P-05 realizzava l'area 2; P-05 è fuso dal 26 settembre, e il ramo a sei
  era rimasto. Misurato prima di toglierlo, con `RG_PAGINA` sulla pagina di
  `ccd98f0^1` — Batteria fra i `MODI`, il selettore globale, nessuna
  `selezioneQuiz()` —: `test_modalita_quiz` e `test_selettori` le davano
  **5 verifiche e zero rossi**, contro le 100 della pagina vera. Un controllo
  che accetta la pagina di prima non tiene fermo niente.

- **Un regime solo, e il conteggio di P-40 e P-47.** Tolti `MODI_SEI`, il ramo a
  sei e `regime_quiz()`: `verifiche_quiz()` fa girare il banco
  (`tests/quiz_intenzioni.mjs`) su qualunque pagina, pretende in `MODI` le cinque
  intenzioni e nient'altro, e la pagina vera deve fare almeno le verifiche della
  pagina di riferimento, gruppo per gruppo. Sulla pagina di prima ora i rossi
  sono **7**, ognuno con il suo difetto: Batteria come ingresso, un'intenzione
  non progettata, `totScreening()`, `selezioneQuiz()` che manca, le cinque
  intenzioni, e le verifiche a **16 su 84** per le intenzioni e **0 su 16** per
  i filtri. Ciascuna delle tre difese — i rossi del banco, l'elenco dei `MODI`,
  il conteggio — da sola la fa rossa; il conteggio è l'unica che non dipende dal
  banco che nomina il difetto. Sulla pagina vera: 154 verifiche dei quiz, zero
  rossi.

- **La pagina di riferimento resta**, per la ragione di P-40: le sedici rotture
  stanno su di lei, perché sostituzioni di testo nella pagina vera si
  spezzerebbero a ogni suo ritocco; e fa da metro al conteggio. La rottura
  «tiene Batteria come sesto ingresso» ora aspetta il rosso «Batteria non è più
  un ingresso» invece di quello dell'ibrido, che non esiste più; tutte e sedici
  rosse per il loro motivo.

- **Nella specifica** il §5.3 elenca le cinque intenzioni con le loro funzioni del
  motore e dice dove è finito il mestiere di Batteria, il §5.4 i due filtri
  locali a «Scegli un argomento», il §7.2 le cinque intenzioni con il giro dietro
  «Altri modi di esercitarti»; R-NAV-04, 05 e 07 dicono quello che la pagina fa,
  il paragrafo sotto la tabella del §9.4 racconta «Un regime solo», e il §2.5 non
  rimanda più a P-12. Nota di chiusura nel §10.1 di `docs/area-2-progetto.md`.
  Il selettore globale è uscito dalla pagina con P-05 (`0645970`): verificato sul
  sorgente prima e dopo.

- **Trovato, ed è dell'interfaccia:** del selettore globale resta il codice senza
  l'interruttore. Nessun punto di `site/app.html` scrive più `prep` fra le
  preferenze e nessun elemento ha `id="prep"`, quindi `S.prep` è sempre falso, e
  `dipingiPrep()`, `quotaPrep()`, il paragrafo `#c-prep` del Carteggio, i rami
  `S.prep ?` della Rotta e della prova di carteggio e il CSS `.prep` sono codice
  morto che sembra vivo — fra l'altro l'avviso «“Solo domande mai fatte” è
  acceso» della prova di carteggio, in un ramo che non si accende più. Non è un
  guasto visibile oggi. Da togliere su `ui/*`, quando la penna su `app.html` è libera.

  Suite: interfaccia **1.873** (erano 1.872), in 188 s; specifica 758; motore
  185/187 con i due skip di sempre; dati 242; server 60/60. Con la **24.21.0
  LTS**, pacchetto verificato con `SHASUMS256.txt`: server 60/60, motore
  185/187, e l'interfaccia intera nel secondo giro. Guardiano verde. Prima di
  ogni giro la 8620 guardata libera; nessun carico di prova lanciato. `site/`,
  `docs/prossime-sessioni.md` e il worktree `ui` non sono stati toccati.

### Test — P-37: il ciclo dei quiz ha un regime solo

- **La pagina di prima di P-19 passava i controlli del ciclo.** Il ramo
  «attuale», lasciato da P-31 per il passaggio all'area 3, riconosceva il ciclo
  di prima da `fine()` e `rivediQuiz()` e gli chiedeva tre cose: misurato con
  `RG_PAGINA` sulla pagina di `4129dfc^1`, **3 verifiche e zero rossi**, contro
  le 73 della pagina vera. P-19 è fuso dal 26 settembre, e quel ramo teneva
  verde una pagina che non ha il ciclo che la specifica descrive.

- **Tolti il ramo, `regime_ciclo()` e `RACCORDO_CICLO`**: il banco
  (`tests/ciclo_quiz.mjs`) gira su ogni pagina, come quelli dei quiz e della
  mappa dopo P-12 e P-47, e la pagina vera deve fare almeno le verifiche della
  pagina di riferimento, gruppo per gruppo — riepilogo 38, giro 28, raccordo 7.
  Sulla pagina di prima ora **sei rossi**: le tre funzioni di raccordo che
  mancano, e i tre gruppi a 0 su 38, 0 su 28 e 4 su 7. Provato anche su una
  copia della pagina vera con `anteprimaRiprova` rinominata: quattro rossi,
  fra cui la funzione nominata. Sulla pagina vera: zero rossi.

- **La pagina di riferimento resta**, per la ragione di P-40: le ventisette
  rotture stanno su di lei, perché sostituzioni di testo nella pagina vera si
  spezzerebbero a ogni suo ritocco; e fa da metro al conteggio. La rottura
  «tutte e tre le funzioni spariscono» ora aspetta il rosso «dichiara
  riepilogoQuiz» invece di quello del regime di prima, che non esiste più;
  tutte e ventisette rosse per il loro motivo.

- **Nella specifica** R-FLU-01 dice che il ciclo dei quiz si esegue sulla pagina
  vera e che una pagina senza raccordo è rossa, R-FLU-11 che il controllo si
  prova contro sé stesso senza più un «finché»; il §9.6 racconta «Un regime
  solo per il ciclo», e il paragrafo di P-51 non conta più il ciclo fra i banchi
  a due regimi. Il §7.5 dice dove sta il ciclo: nella pagina su `main` da P-19,
  non ancora nel sito pubblicato, che è la v0.28.0. **R-UX-06 resta scoperto**,
  con il motivo di oggi: i numeri delle tre affermazioni e «Riprova questi N»
  vengono dal raccordo e li tiene R-FLU-01 sulla pagina vera, ma le frasi sono
  testo di schermata, guardate al collaudo di P-19, e nessun banco le legge.
  Nota di chiusura nel §10.1 di `docs/area-3-progetto.md`.

  Suite: interfaccia **1.873**, in 187 s — lo stesso numero, perché le due
  verifiche «è stato controllato» e quella del regime della pagina di
  riferimento lasciano il posto alle tre del conteggio —; specifica 758; motore
  185/187 con i due skip di sempre; dati 242; server 60/60. Con la **24.21.0
  LTS**, pacchetto verificato con il `SHASUMS256.txt` riscaricato da
  nodejs.org: motore 185/187, server 60/60, interfaccia 1.873. Guardiano e
  controllo della documentazione verdi. Prima di ogni giro la 8620 guardata
  libera; nessun carico di prova lanciato. `site/`, `docs/prossime-sessioni.md`
  e il worktree `ui` non sono stati toccati.

### Corretto — P-16: il ritmo non dice «orologio» senza un orologio

- **Trenta righe senza data davano una durata «misurata all'orologio».** Il
  caso trovato dal collaudo di P-05 (`docs/area-2-collaudo-ux.md`, «Trovato e
  contatto con la regia»), riprodotto prima di toccare il motore: trenta righe
  con `sim_uid` e `ms` e senza `ts` davano `affidabile: true`, `fonte:
  'orologio'` e 12,4 s a domanda. `sessioni()` ripiegava sulla somma dei tempi
  di risposta quando non poteva misurare da capo a coda, e `ritmo()` la
  prendeva per l'intervallo fra due risposte: un cronometro con il nome di un
  orologio, cioè la stima che `ritmo()` era nato per sostituire. E non solo da
  sole: accanto a quaranta righe vere a 30 s di passo, quelle trenta tiravano la
  mediana a 21,2 s. Il Quiz se ne difendeva filtrando le righe con una data; il
  Percorso no.

- **I chiamanti, uno per uno, prima di cambiare.** `ritmo()`: il Percorso
  (`app.html`, la durata della proposta, righe quiz base senza filtro) e
  l'anteprima dei Quiz (con il filtro sulle date), e i test; non lo chiama
  nessun altro, né il server. Per il Percorso cambia il risultato su un archivio
  con righe senza data o con liste di una risposta sola: dove prima annunciava
  una durata ora non la annuncia, ed è la correzione. Per il Quiz non cambia
  niente, e il suo filtro diventa superfluo — è in `site/app.html`, quindi lo
  toglie chi lavora su `ui/*`. `sessioni()`: `ritmo()` nel motore, tre chiamate
  in pagina — l'ultima attività del Percorso e `riepilogoQuiz()`, che non
  leggono `durata`, e l'elenco delle sessioni in Progressi, che scrive `s.durata
  ?? s.ms` e quindi mostra quello che mostrava —, `erroriSessione()`, che non
  legge `durata`, e i banchi, che non la leggono. `stimaImpegno()`: gli stessi
  due punti della pagina, che le passano il ritmo solo se è affidabile; la
  funzione non cambia, perché dichiarava già la fonte di quello che riceveva.

- **La correzione sta nel motore, così che nessuno debba filtrare prima.** La
  `durata` di una sessione senza orologio è `null`, non `ms`: basta una riga
  senza un `ts` che sia una data, e siccome `ordinaRighe()` le mette in testa se
  ne manca una manca anche l'inizio. `ritmo()` misura solo le sessioni che
  l'orologio misura, e restituisce anche `misurate`, le risposte di quelle
  sessioni: la soglia di `MIN_MISURATE` si confronta con quelle e non con tutte
  le risposte viste. È la seconda metà dello stesso difetto: due risposte
  all'orologio non diventano affidabili perché accanto ce ne sono ventinove
  senza data, né trenta risposte ognuna sola nella sua lista, che un intervallo
  non ce l'hanno. Il confine per pausa non cambia, e il test di P-30 che lo
  pretende è verde; `sessioni()` e `ritmo()` restano dei soli quiz, e anche il
  test di P-33 lo è.

- **Prima il test che fallisce:** quattro test nuovi, rossi uno per uno per la
  ragione misurata — `affidabile` vero, la mediana a 21,2 s invece di 30,
  `misurate` che non esisteva, la `durata` a 360.000 ms di cronometro.
  **Provati al contrario su cinque rotture**, una per volta, tutte rosse: il
  ripiego su `ms` rimesso (quattro rossi), la soglia sulle risposte viste,
  `misurate` che conta tutte, una durata zero invece di `null`, `misurate` che
  conta gli intervalli invece delle risposte. **Due controlli sono stati tolti
  perché nessuna rottura li vedeva**: il conto esplicito delle righe senza data
  in ogni sessione, equivalente a guardare l'inizio per via dell'ordinamento, e
  lo stesso conto riportato da un gruppo all'altro in `cuciAttivita()`, che non
  si può raggiungere. Specifica: `ritmo()` entra nella tabella delle soglie del
  §4.3, dove mancava; R-TEMPO-09…12 nuovi e coperti; R-TEMPO-05 e 07 restano
  com'erano, e il registro dice perché — il primo era falso su righe senza data
  e il suo controllo non lo vedeva, il secondo era vero alla lettera.

  Suite: motore **189/191** con i due skip di sempre (erano 185/187); dati 242;
  specifica **774** (erano 758); interfaccia 1.873, in 187 s; server 60/60. Con
  la **24.21.0 LTS**, scaricata da nodejs.org e verificata con
  `SHASUMS256.txt`: server 60/60, motore 189/191. Guardiano verde. Prima del
  giro dell'interfaccia la 8620 guardata libera; nessun carico di prova
  lanciato. `site/app.html`, `docs/prossime-sessioni.md` e il worktree `ui` non
  sono stati toccati.

### Spostato — P-17: l'ultimo tag di un tentativo, nel motore

- **Quale classificazione N/L/C vale lo decideva la pagina, senza un test.**
  Da P-01 ritaggare aggiunge una riga `_t:'g'` con la sua data invece di
  cancellare la vecchia, e `tagPerTentativo()` in `app.html` sceglieva l'ultima
  con `E.ordinaRighe()`. Era una regola sulle righe dell'archivio — cioè lavoro
  del motore — e `tests/` non poteva raggiungerla: i controlli di P-01 erano
  rimasti nella sessione, fuori dalla suite. Ora `tagPerTentativo(righe)` sta in
  `site/engine.js`, con lo stesso nome, e restituisce `{attempt_uid: tag}`: per
  istante, quindi UTC e offset locale confrontati come istanti; i tag storici
  scritti senza data prima di ogni tag datato; l'ordine dell'archivio a parità
  di istante.

- **Una differenza, voluta e dichiarata.** Una riga che `validaRiga()`
  rifiuterebbe — tag fuori da N/L/C, senza tentativo, data rotta — nel motore
  non decide niente; la copia della pagina la prenderebbe per buona, e un tag
  «X» arrivato dopo sovrascriverebbe il tag giusto, o un tag senza tentativo
  creerebbe la chiave `undefined`. Nell'archivio di oggi righe così non entrano
  — l'import e il server le scartano con la stessa regola —, quindi il
  comportamento visibile non cambia; ma la regola sola è quella che non dipende
  da chi ha scritto la riga.

- **La pagina non è stata toccata**, ed è il recinto a volerlo. Finché la sua
  copia esiste, un test la estrae da `app.html`, la esegue e pretende lo stesso
  tag del motore su cinque archivi — fra cui 120 righe rimescolate con quiz,
  storici, UTC e offset —; quando la pagina chiamerà `E.tagPerTentativo()` il
  test si metterà da parte da solo, come quelli di `daAllenare()` e
  `componiProva()`. La funzione è fra gli orfani dichiarati in
  `docs/eccezioni-interfaccia.md`, con chi la ricabla: P-52, o la prossima penna
  su `app.html`. Tolta quella riga, il controllo sugli orfani è rosso e la nomina.

- **Prima il test che fallisce:** sei test nuovi, rossi uno per uno per la
  funzione che mancava. **Provati al contrario su otto rotture**, una per volta,
  tutte rosse nel loro test: l'ordine per stringa invece che per istante,
  l'ordine dell'archivio, i tag storici in fondo invece che in testa, il primo
  tag che vince sull'ultimo, il pari istante rovesciato, `validaRiga()` tolta,
  il filtro sul tipo tolto, un oggetto con il prototipo al posto di uno vuoto.
  Specifica: R-ARCH-13 e 14, coperti.

  Suite: motore **195/197** con i due skip di sempre (erano 189/191); dati 242;
  specifica **782** (erano 774); interfaccia **1.876** (erano 1.873: le tre
  verifiche dell'orfano nuovo), in 188 s; server 60/60. Con la **24.21.0 LTS**,
  archivio verificato contro `SHASUMS256.txt` riscaricato da nodejs.org: server
  60/60, motore 195/197. Guardiano verde. Prima del giro dell'interfaccia la
  8620 guardata libera; nessun carico di prova lanciato. `site/app.html`,
  `docs/prossime-sessioni.md` e il worktree `ui` non sono stati toccati.

### Realizzato — P-21: il Carteggio chiude il ciclo sulla pagina

- **Tre porte, una selezione del motore.** Prova a tempo, esercizi su carta e
  riconoscimento delle tecniche hanno preparazione, carte e materiali, guida ed
  esempio, confronto con la risposta ministeriale e giudizio di chi studia.
  «Sei tu a giudicare» è visibile prima di Inizia. La pagina usa
  `provaCarteggio()`, `attivitaCarteggio()` e `dettaglioCarteggio()` attraverso
  il raccordo di D-01…D-04: tolte la composizione, le costanti e i conteggi
  paralleli, così il numero promesso e gli esercizi aperti vengono dalla stessa
  lista. Il riconoscimento conserva la sua vista `#v-tec` e la porta la apre
  anche con `data-v="tec"`.
- **La prova con account riprende davvero.** Il testo e i giudizi provvisori
  vivono nella bozza della copia locale dell'account, con revisione controllata
  e stato di scrittura visibile; una ricarica offre la ripresa con gli stessi
  testi, esercizio e scadenza. La conclusione scrive le righe definitive e
  toglie la bozza nella stessa transazione. Senza account il testo resta solo
  nella pagina aperta. Le eccezioni del motore sono aggiornate e la riga C-19
  del difetto dichiarato è chiusa; rimosso il CSS inutilizzato di `.cons`.
- **Verificato nella pagina vera:** C-01 esegue tutte le 34 verifiche; le sette
  parti di C-19 sono verdi (28 verifiche). T-07, T-08 e T-09 entrano anche in
  «Che tecnica serve?»; restano soltanto i difetti dell'area 6 già dichiarati
  per P-25. Interfaccia 2.138 verifiche, motore 194/197 con tre skip previsti,
  server 60/60 anche con Node 24 LTS, dati 242, specifica 782, guardiano verde.
  In Chrome guardati 375 e 1280 px senza e con account, inclusa la ricarica a
  metà prova e la ripresa del secondo testo; console senza errori. Versione
  invariata.

### Test — P-50: il Carteggio ha un regime solo

- **La pagina di prima di P-21 passava i controlli del Carteggio.** Il ramo
  «attuale», lasciato da P-35 per il passaggio all'area 4, riconosceva il
  Carteggio di prima da `componiProva()`, `salvaCart()` e `rivediCarteggio()` e
  gli chiedeva poco: misurato con `RG_PAGINA` sulla pagina di `1bb916a^1`,
  **8 verifiche e zero rossi**, contro le 241 della pagina vera. P-21 è fuso dal
  30 settembre, e quel ramo teneva verde una pagina che non ha il Carteggio che
  la specifica descrive.

- **Tolti il ramo, `regime_carteggio()`, `riconosci_carteggio()`,
  `CICLO_CARTEGGIO_DI_OGGI`, `RACCORDO_CARTEGGIO`, `corpo()` e l'innesto del
  raccordo di P-51**, che serviva a provare il riconoscimento: con un regime
  solo non c'è niente da riconoscere. Il banco (`tests/ciclo_carteggio.mjs`)
  gira su ogni pagina, come quelli di quiz, ciclo e mappa dopo P-12, P-37 e
  P-47, e la pagina vera deve fare almeno le verifiche della pagina di
  riferimento, gruppo per gruppo — preparazione 51, avvio 41, raccordo 11, righe
  26, riepilogo 93, riprova 18, ambito 1. Sulla pagina di prima ora **undici
  rossi**: le cinque funzioni di raccordo che mancano, e sei gruppi sotto il
  conto, a zero su 51, 41, 26, 93 e 18 e a sei su 11. Provato anche su una
  copia della pagina vera con `avviaCarteggio` rinominata: sette rossi, fra cui
  la funzione nominata. Sulla pagina vera: zero rossi. La prova al contrario di
  R-UX-07 gira su una copia della pagina vera e su una della pagina di
  riferimento, e tutte e due sono rosse.

- **La pagina di riferimento resta**, per la ragione di P-40: le trentanove
  rotture stanno su di lei, e fa da metro al conteggio. Il commento in testa lo
  dice; il titolo perde «regime progettato». Tutte e trentanove rosse per il
  loro motivo.

- **«dici quali avevi preso» esce da `GIUDIZIO_CARTEGGIO`** in
  `tests/client_account.mjs`: R-UX-03 riconosce solo «Sei tu a giudicare», la
  frase del §4 dell'area 4 che la pagina ha da P-21. La suite intera sulla pagina
  di prima, con `RG_PAGINA`, è rossa in **45 verifiche**: gli undici del
  Carteggio, due di C-01 per il giudizio che la frase vecchia teneva verde, e
  trentadue che lo erano già dalla merge di P-21 — le chiamate al motore e gli
  orfani di `docs/eccezioni-interfaccia.md`, e C-19 senza la sua dichiarazione.

- **La bozza c'è, e i documenti lo dicono.** Via la riga del carteggio fra i
  «Difetti noti» di `AGENTS.md`. Nella specifica il §7.6 dice il presente — con
  l'account il testo regge una ricarica, senza resta finché la pagina è aperta
  e la pagina lo dice —, con la storia in un paragrafo suo; R-BOZZA-06 e il
  §9.11 non parlano più di un difetto aperto; il §7.3 e il §7.6 dicono che tutto
  questo è nella pagina su `main` e non nel sito pubblicato, la v0.28.0, che
  **non ha nemmeno l'avviso di P-36**: verificato sul tag, lì il testo sta solo
  in memoria e una ricarica lo perde senza che la pagina lo dica, fino al
  rilascio (P-27). R-SEL-17, R-FLU-23, 24 e 26, R-UX-03 e 07 perdono i due
  regimi; il §9.6 racconta «Un regime solo per il Carteggio», e il paragrafo di
  P-51 dice che nessun banco riconosce più un regime di pagina; il §5.3 e il
  §3.2 non descrivono più `componiProva()` e le righe di prima come se fossero
  nella pagina. Nota di chiusura nel §10.1 di `docs/area-4-progetto.md`, e il
  §12 di `docs/account-client-progetto.md` allineato. Il test del motore che
  confrontava `componiProva()` con `provaCarteggio()` si era già ritirato da
  solo alla merge di P-21 (lo skip in più), e resta come i due di prima.

  Suite: interfaccia **2.121** (erano 2.138: via le verifiche del regime
  vecchio, del riconoscimento e «è stato controllato», e il conteggio contro la
  pagina di riferimento è acceso sempre), **tre giri verdi** in 239–242 s, uno
  con la **24.21.0 LTS** nel `PATH`; specifica 782; motore 194/197 con i tre skip
  previsti; dati 242; server 60/60. Con la LTS, archivio verificato contro il
  `SHASUMS256.txt` riscaricato da nodejs.org ed estratto di nuovo: motore
  194/197, server 60/60, interfaccia 2.121. Guardiano e controllo della
  documentazione verdi. **La 8620 era della suite di P-52 in `rotta-giusta-ui`**
  alla prima prova: il primo lancio di questa sessione è partito senza aspettare
  — il controllo della porta era concatenato con `;` — e il banco si è rifiutato
  da solo di partire, senza avviare niente; da lì ogni giro ha aspettato 90 s di porta
  libera e nessun banco di `rotta-giusta-ui` in corso. Nessun carico di prova
  lanciato. `site/`, `docs/prossime-sessioni.md` e il worktree `ui` non sono
  stati toccati.

### Test — P-53: le frasi del riepilogo dei quiz, nel banco del client

- **R-UX-06 aveva un collaudo e nessun controllo.** I numeri del riepilogo di
  una breve attività li teneva R-FLU-01, ma il banco del ciclo esegue il
  raccordo senza DOM e quello del client non leggeva i testi del riepilogo:
  una quarta frase, un «Sei pronto», una frase nascosta passavano la suite.
  Ora c'è il gruppo **F-01** in `tests/client_account.mjs`, e
  `test_riepilogo_frasi` lo registra.

- **Che cosa fa.** Sulla pagina vera, senza account, dà una risposta giusta e
  una sbagliata — sa dalla banca qual è quale —, poi «Termina»; poi, nella
  stessa pagina, una seconda attività con una sola risposta giusta. In ciascun
  riepilogo legge l'`innerText` di `#r-fine`, che non contiene quello che è
  nascosto, e pretende le tre affermazioni del §4.2 di
  `docs/area-3-progetto.md` con i numeri di quello che ha fatto: risposte su
  totale, corrette, errate; con errori la frase, «Rivedi gli errori» e
  «Riprova» con N uguale alle errate, senza errori «tutte corrette» e nessuna
  riprova; le non affrontate con la loro frase. **Nessuna quarta
  affermazione** è un elenco chiuso: ogni riga del riepilogo, tolti i
  pulsanti, dev'essere una frase ammessa dal §4.2, dalla conservazione del §3
  o dall'invito del client §4.1, e ogni pulsante un'uscita del §6.1; una frase
  nuova è rossa finché qualcuno non decide che è ammessa. **Nessun voto** è
  un elenco di parole: percentuali, «pronto», «migliorato», «livello»,
  «debole», «punteggio». La seconda attività è quella che vede un numero preso
  dalle righe di tutta la pagina invece che da quelle dell'attività, come fa il
  raccordo.

- **La pagina di riferimento del client, allineata.** Il suo riepilogo diceva
  risposte, corrette ed errate in una frase sola, dagli esiti del runner; ora
  prende i numeri da un `riepilogoQuiz()` sulle righe dell'attività, per
  `sim_uid`, come la pagina vera, e fa le tre affermazioni con i testi del
  §4.2, con «Rivedi gli errori» e la riprova. La rottura di T-01 che toccava
  la riga di prima segue la riga nuova, ed è rossa come prima.

- **Nove rotture nuove, tutte rosse per il loro motivo:** una quarta
  affermazione, un'uscita in più, un «Sei pronto per l'esame», una
  percentuale di esatte, i numeri dalle righe di tutta la pagina, le errate
  contate dagli errori di tutta la pagina, i numeri nascosti, la frase su
  quali rivedere con `visibility:hidden`, quella su che cosa non hai toccato
  con `hidden`. **Il banco contro sé stesso**, una difesa tolta alla volta:
  con `textContent` al posto di `innerText` le due frasi nascoste non sono più
  prese per il loro motivo, e la pagina di riferimento stessa diventa rossa
  perché le righe si fondono; senza la seconda attività le due rotture del
  raccordo passano verdi; senza l'elenco delle frasi, dei voti o delle uscite
  la rottura corrispondente non è più rossa per il suo motivo, e quella
  dell'uscita passa verde.

- **Un rosso falso del banco, trovato facendolo girare e non nella suite.** In
  un giro degli indebolimenti la pagina di riferimento è uscita rossa su «il
  quesito si riconosce dalla banca». Misurato sulla banca intera: **otto coppie
  di quesiti base** — base-181…183, base-564/565 e altre, 16 quesiti su
  1.472 — hanno testo e risposte identici e l'esatta diversa, e cambia solo la
  figura; dal testo il banco non può sapere quale sia giusta, circa un quesito
  pescato su 200. Ora lì risponde e prende l'esito dal riscontro, e nella
  prima attività va avanti finché ha una giusta e una sbagliata; i numeri
  attesi sono sempre quelli di quello che è successo. Una variante della
  pagina di riferimento, che deve restare verde, pesca per primi quattro di
  quei gemelli e tiene fermo il caso a ogni esecuzione.

- **Che cosa non vede**, scritto in R-UX-06 e nel §10.4 del progetto
  dell'area 3: l'ordine delle frasi, un testo invisibile per `opacity` o per
  colore, il riepilogo di una simulazione (§4.3, che un esito ce l'ha) e
  quello con l'account, dove cambia solo la frase della conservazione. Nella
  pagina vera etichetta e numero stanno nella stessa riga di un flex, e per
  l'`innerText` sono due righe: il banco le ricuce, e lo dice. Specifica:
  R-UX-06 coperto per quello che il banco vede; il §9.6 non mette più i testi
  del riepilogo fra quelli che nessun controllo legge.

  Suite: interfaccia **2.173** (erano 2.121: 22 di F-01 sulla pagina vera col
  suo conteggio, uno sul riferimento, due della variante, 27 delle rotture),
  **tre giri verdi** in 238–241 s, il terzo con la 24.21.0 nel `PATH`; specifica **784** (erano 782); motore 194/197 con i tre skip previsti;
  dati 242; server 60/60. Con la **24.21.0 LTS**, archivio verificato contro
  il `SHASUMS256.txt` di nodejs.org che P-50 aveva scaricato stanotte — non
  riscaricato —: motore 194/197, server 60/60, interfaccia 2.173. Guardiano e controllo
  della documentazione verdi. Ogni giro del banco ha aspettato 90 s di porta
  8620 libera e nessun banco di `rotta-giusta-ui` in corso. Nessun carico di
  prova lanciato. `site/`, `docs/prossime-sessioni.md` e il worktree `ui` non
  sono stati toccati.

### Corretto — P-52: la coda si vede appena cambia

- **Con l'account, una risposta in attesa non è confermata sul server.** Prima
  della correzione, il controllo T-02 in Chrome mostrava ancora «confermate sul
  server» con due risposte nella coda locale e una sola sul server; il numero
  «2 risposte da inviare» compariva solo alla fine della richiesta. Ora
  `archivia()` ridipinge lo stato dopo la transazione che salva riga e coda,
  prima di pianificare l'invio. T-02 è verde sia con la richiesta che non
  risponde sia offline: 9 verifiche, con il numero 2 letto dalla coda e visto
  in schermata nei due stati. Le due eccezioni T-02 sono state tolte; le altre
  T-* restano dichiarate.
- **Rimossi i resti del selettore globale «solo mai fatte».** Non esiste più
  il suo interruttore: tolti `S.prep`, `dipingiPrep()`, `quotaPrep()`, i suoi
  rami e il CSS `.prep`/`.sw`. Il `#c-prep` di P-21 resta: contiene la
  preparazione attiva del Carteggio. L'anteprima dei Quiz passa a `E.ritmo()`
  le righe quiz senza rifiltrare le date, come il motore già prevede; la
  revisione usa `E.tagPerTentativo(S.archivio)` al posto della copia locale,
  e la chiamata è ora protetta fra quelle del motore.
- **Verificato:** interfaccia 2.133 verifiche sulla pagina vera; motore 193/197
  con quattro skip, server 60/60 con Node 25 e con Node 24 LTS, dati 242,
  specifica 782, guardiano verde. In Chrome guardate le schermate del Percorso
  con rete che tace e con rete spenta: entrambe mostrano «2 risposte da inviare».
  Versione invariata.

### In esercizio — P-15: il server degli account su Scaleway

- **`https://api.rottagiusta.it/v1/salute` risponde, da `v0.28.0`.** La
  macchina è la STARDUST1-S `rg-api` a `pl-waw-2`, decisa dall'autore il 26
  settembre, creata oggi con lui: Ubuntu 26.04.1, Node 24.21.0 LTS verificato
  con `SHASUMS256.txt`, Caddy davanti con il certificato Let's Encrypt, il
  server estratto dal tag con `rg-aggiorna`, che si ferma se il commit del tag
  non è quello letto sul Mac (`51d94858…`, coincide). Il server in esercizio non
  riceve nessuno: la pagina non lo chiama fino alla versione con gli account, e
  al traguardo `rg-aggiorna` lo porta al tag nuovo, che ha R-ACC-49 — il
  `Retry-After` esposto dal CORS, assente in `v0.28.0` — e la correzione qui
  sotto. Tutto in `docs/account-progetto.md` §2.8.

- **Gli strumenti della macchina sono nel repo**, in `strumenti/macchina/`:
  l'unità `rg-api.service` con i segreti in `/etc/rg/ambiente`, `rg-aggiorna` e
  `rg-torna` come li ha provati P-02, `installa` e `installa-node`, il giro
  delle copie (`rg-copia` con il suo timer alle 04 e alle 16 UTC) e il
  `Caddyfile`. Sulla macchina sono arrivati con `scp`, perché `main` non si
  pusha; il codice del server no, quello viene solo dal tag.

- **Un guasto muto, trovato avviando il server.** Lanciato dal collegamento
  `/srv/rg/attuale`, come lo lancia l'unità del §2.7, il server di `v0.28.0`
  usciva con 0 senza una riga di log, e systemd scriveva «Deactivated
  successfully». Node mette in `import.meta.url` il percorso risolto e lascia
  `process.argv[1]` com'era, quindi il controllo «sono il modulo principale?»
  era falso. Il banco di P-02 aveva un server finto, e non poteva vederlo.
  Sulla macchina l'unità risolve il collegamento prima di avviare Node — un
  rilascio risolto una volta, la semantica del §2.7 —; su `main` il controllo
  di `server/server.mjs` confronta il percorso risolto. **Prima il test che
  fallisce:** lancia il server e il caricatore delle copie da un collegamento,
  ed è rosso con il controllo di prima, per tutti e due.

- **Il gruppo di sicurezza era tutto aperto**: la console lo crea con la
  politica in entrata «Accept» e nessuna regola. Ora in entrata è Drop, con
  22, 443 e ICMP aperti su IPv4 e IPv6; aggiunte le regole prima del Drop, per
  non chiudersi fuori. Misurato dal Mac: un processo in ascolto sulla 8080 non
  risponde da fuori, la 22 sì, la 80 no. Le regole IPv6 non sono provate da
  fuori: il Mac non ha IPv6. La 80 resta chiusa: il certificato si prende con
  la sfida TLS-ALPN, e il Caddyfile spegne la sfida HTTP e l'annuncio di
  HTTP/3, che viaggerebbe su una UDP 443 chiusa.

- **Le copie, verso `nl-ams`, con una chiave che scrive e basta.**
  `carica-copia.mjs` fa una `PUT` firmata SigV4 senza dipendenze — rclone e
  s3cmd provano a leggere il bucket prima di scrivere, e con una chiave di sola
  scrittura falliscono — e dice arrivata una copia solo se l'ETag del bucket è
  l'MD5 di quello che ha mandato. La firma coincide con i due esempi pubblicati
  da AWS, e un test nuovo lo tiene fermo insieme al caso di un 200 con l'ETag
  sbagliato, di un `403` e della chiave che manca; provato al contrario
  rompendo la firma e il controllo dell'MD5, rosso tutte e due le volte. Le
  chiavi stanno in due applicazioni IAM create con l'autore, ciascuna con la
  sua policy — `TransactionalEmailEmailApiCreate` per la posta,
  `ObjectStorageObjectsWrite` per le copie —, generate e scritte sulla macchina
  dall'autore. Misurato, non dedotto: con la chiave delle copie leggere,
  elencare e cancellare rispondono `403 AccessDenied`.

- **Le misure che il §19 lasciava a questo giorno.** Argon2id con i parametri
  del §20: mediana 148 ms, due calcoli insieme 292 ms. Il riavvio dopo il kernel
  `7.0.0-34`, che gli aggiornamenti graduali di Ubuntu avevano trattenuto: 32,5
  s, e `rg-api`, `caddy` e il timer ripartono da soli. Una copia arrivata a
  `nl-ams`, scaricata dall'autore, MD5 uguale, ripristinata con `ripristina.mjs`
  di `v0.28.0` con l'epoca rigenerata — su un database ancora vuoto, quindi
  senza righe da confrontare, e lo si dice. E il sorgente di una mail vera,
  spedita dalla macchina a `privacy@rottagiusta.it` con il testo di
  `mailVerifica()` e un link finto, senza creare un account: arrivata in 2 s in
  Posta in arrivo, DKIM, SPF e DMARC che passano, link non riscritti, nessun
  pixel. **Per l'autore**, nel §20: Ubuntu non riavvia da solo dopo un kernel
  di sicurezza; la proposta è il riavvio automatico alle 03:30 UTC.

  Suite: motore 193/197 con i quattro skip previsti; server **62/62** (erano
  60), con Node 25.3 e con la **24.21.0 LTS**, scaricata da nodejs.org e
  verificata con `SHASUMS256.txt`, con cui anche il motore dà 193/197; dati 242;
  interfaccia 2.168, con la 8620 guardata libera prima; specifica 784.
  Guardiano verde. `site/` e `docs/prossime-sessioni.md` non
  sono stati toccati.

- **Il riavvio automatico alle 03:30 UTC**, deciso dall'autore dopo il
  resoconto: `strumenti/macchina/52rg-riavvio` per `unattended-upgrades`,
  installato da `installa`, e letto dalla macchina (`apt-config dump`). Un
  kernel di sicurezza è in uso al più tardi il giorno dopo, alle 03:30.

### Corretto — P-25: la rifinitura che lascia leggibili fuoco e controlli

- **Cinque difetti riprodotti e guardati prima della correzione:** la barra
  copriva tre arresti di Tab; a 320 px la pagina sbordava di 16 px senza
  account, 23 con account e 49 nelle tecniche; il grigio scendeva a 4,09:1;
  i tag N/L/C misuravano 28–31 × 29 px e il sommario Info era alto 41 px.
  Ora il fuoco ha spazio fra le barre, l'intestazione e le tecniche rientrano
  senza nascondere contenuto, il grigio passa a 4,65:1 sull'azzurro e 4,85:1
  sulla pagina, i tag sono 44 × 44 px e il sommario almeno 44 px.
- **Le cinque righe T-* tolte da `docs/eccezioni-interfaccia.md`:** i gruppi
  girano interi e verdi sulla pagina vera. Solo CSS, con gerarchie, ingressi,
  figure e tema conservati secondo i quattro «no, per ora» dell'autore;
  nessuna selezione, conteggio, giudizio, ritorno o persistenza cambia.
  La bozza del Carteggio di P-21 verificata, anche dopo ricarica, senza rifarla.
- **Collaudo guardato a 320, 375 e 1280 px nei due regimi**, comprese viste,
  Account, runner, riepilogo e revisione: zero sbordo nei campioni; misure,
  inventario dei testi e limiti in `docs/area-6-collaudo-ux.md`. Zoom nativo,
  testo al 200 %, audit non testuale, percorsi completi da tastiera e lettore
  reale **non fatti** (R-RIF-10, 13, 14, 15); il reflow a 640 px non è zoom.
- Suite complete: motore **193/197** con quattro confronti ritirati previsti,
  server **60/60** su Node 25.3 e **60/60** su LTS 24.21.0 (pacchetto verificato
  contro SHASUMS256), dati **242**, interfaccia **2.158**, specifica **784**;
  guardiano e controllo documentazione verdi. Versione invariata.


### Regole — il titolare si nomina nell'informativa, e solo lì

- **L'informativa deve dire chi è il titolare, e il guardiano rifiutava il suo
  nome.** L'art. 13.1.a del GDPR chiede l'identità del titolare; la bozza di
  P-18 diceva «l'autore di Rotta Giusta», e `strumenti/controlla.py` boccia ogni
  file con il nome di battesimo dell'autore. Deciso dall'autore il 1° ottobre
  2026: nome e cognome compaiono in `site/privacy.html`, e in nessun altro file.
  Il guardiano lo ammette lì e solo per quelle due impronte: un identificatore
  delle macchine nella privacy resta un guaio. Il cognome, che il guardiano non
  cercava, entra fra le impronte, così il nome intero non scappa altrove ora che
  sta in un file del repo.
- **Prima il test che fallisce:** `test_titolare` in `tests/test_dati.py`, rosso
  su tre verifiche finché la regola non c'era. Il nome vero non sta nel test:
  le impronte si sostituiscono con quelle di un nome finto. **Provato al
  contrario tre volte**: l'eccezione valida in ogni file → 4 rossi, uno per file;
  l'eccezione tolta → 1; l'eccezione estesa a una macchina → 1.

  Suite: dati **250** (erano 242); motore 193/197 con i quattro skip previsti;
  specifica 784; guardiano verde.

### Riscritto — l'informativa completa, da far confermare

- **La privacy di P-18 non diceva chi è il titolare, né per quanto si tengono i
  dati.** Ora nomina il titolare — persona fisica, con `privacy@` come recapito
  e senza indirizzo postale, per scelta dell'autore — e ha due sezioni nuove: il
  registro di sicurezza, con la base giuridica proposta (legittimo interesse,
  art. 6.1.f e considerando 49) e il diritto di opporsi; e i tempi di
  conservazione, presi da `account-progetto.md` (§14, §15.3): l'IP per sei mesi,
  l'evento per un anno, le copie entro 30 giorni, le richieste evase per due
  anni. statichost.eu diventa responsabile con un accordo scritto, la posta di
  Scaleway è detta in Francia, e i diritti aggiungono limitazione, opposizione e
  il reclamo al Garante. Corretta una frase falsa da P-21: il testo del
  carteggio con l'account sta nella bozza del dispositivo, non solo in memoria.
- **Resta una bozza**, e la data lo dice: tre affermazioni valgono solo quando
  l'autore avrà fatto la sua parte — il DPA di statichost.eu firmato,
  `privacy@` su una casella nell'UE («i dati non escono dall'Unione europea»),
  e il parere su base giuridica e recapito (`account-progetto.md` §15.4).
- Verificato: guardiano verde con il nome nella privacy, dati 250, controllo
  dei testi di C-18 verde. La geometria si guarda dopo la merge.

### Corretto — `privacy@` resta su Gmail, e l'informativa lo dice

- **Deciso dall'autore il 1° ottobre 2026: l'inoltro di `privacy@` verso Gmail
  resta.** La casella IONOS costa 6 €/mese (Mail Business, una licenza,
  misurato nel pannello), e i dati fuori dall'UE non sono vietati: il GDPR
  chiede una base per il trasferimento e che l'informativa lo dica (art. 13.1.f).
  La frase «i dati non escono dall'Unione europea» esce; al suo posto le mail a
  `privacy@` arrivano nella casella Gmail del titolare, con il trasferimento
  negli Stati Uniti sulla decisione di adeguatezza del Data Privacy Framework.
  Resta aperto, per il parere: un Gmail personale non ha un accordo art. 28.

### Corretto — la privacy e l'avvertenza dopo il primo parere

- **Un primo parere sui punti del §15.4 (non firmato, da un modello) ha
  trovato tre cose che non reggevano**, e l'autore ha deciso il 1° ottobre 2026:
  - **le statistiche** non stanno nell'esecuzione del contratto (6.1.b): ora sono
    legittimo interesse (6.1.f), con il diritto di opporsi e di uscire dai
    conteggi. L'esclusione va ancora fatta sul server (`account-progetto.md`
    §15.4); oggi nessuna statistica si calcola;
  - **`privacy@` su un Gmail personale**: Google è un responsabile senza
    accordo art. 28. Si passa a una casella OVH con DPA, da verificare;
    intanto il testo nomina Google Ireland e il trasferimento a Google LLC;
  - **statichost.eu** è responsabile, e il DPA va firmato subito: il sito lo
    usa dal 25 settembre. L'informativa nomina ora i suoi sub-responsabili.
- **Le correzioni di testo del parere**: la proroga dei tempi di risposta (art.
  12.3); l'email necessaria e la data facoltativa (art. 13.2.e); l'account dai
  18 anni; la lettura in chiaro limitata a un problema chiesto o di sicurezza;
  l'opposizione al registro di sicurezza, che di norma non lo ferma; la base
  delle richieste conservate; il cookie che dura trenta giorni, non «di
  sessione».
- **L'avvertenza ha le condizioni per l'account**, su cui poggia il 6.1.b:
  gratis e così com'è, dai 18 anni, risposte scaricabili e account cancellabile,
  uso corretto, 30 giorni di preavviso se il servizio chiude, legge italiana e
  foro del consumatore. **E una frase falsa dalla 0.23.0 esce**: diceva che la
  composizione delle 20 domande «non è nel decreto» e viene da tre scuole
  nautiche; è l'Allegato C al DM 323/2021, come dice il README.
- Verificato: guardiano verde, dati 250, controllo dei testi di C-18 verde.

### Corretto — la vetrina non chiama più Google Fonts

- **Ogni visita alla vetrina mandava l'IP a Google**, per caricare Manrope da
  `fonts.googleapis.com`, e l'informativa non lo diceva: trovato dal primo
  parere, verificato in `site/index.html`. Ora il carattere sta in
  `site/caratteri/`: un solo file variabile, i pesi da 200 a 800, i soli
  caratteri latini (24.836 byte), dal pacchetto `@fontsource-variable/manrope`
  5.2.8, con la licenza OFL accanto. Scaricato col permesso dell'autore.

### Test — nessuna pagina carica risorse da un altro host

- **Un controllo, perché Google Fonts non torni in silenzio.**
  `test_nessuna_risorsa_di_terzi` in `tests/test_dati.py` guarda ogni pagina di
  `site/`: un `<link>`, `<script>`, `<img>` o `<iframe>` verso un altro host, un
  `url()` o un `@import` esterno sono rossi; i collegamenti `<a>` no. Provato
  sulla vetrina di prima (`dbb27c4^`): rosso, con le tre righe di Google
  nominate. Il README dichiara la provenienza di Manrope, con licenza e
  impronta.

  Suite: dati **263** (erano 250); guardiano verde.

### Corretto — `privacy@` ha una casella nell'UE

- **Dal 1° ottobre 2026 `privacy@rottagiusta.it` è una casella OVHcloud**
  (Zimbra Starter, 0,37 €/mese), con il DPA art. 28 nelle condizioni generali:
  il punto 5 del primo parere, Gmail personale senza accordo, è chiuso. La
  privacy non parla più di Google né di trasferimenti, e torna a dire che i dati
  non escono dall'Unione europea; il Paese delle caselle OVHcloud non lo nomina,
  perché OVHcloud dice solo «in Europa». Verificato con una mail vera arrivata
  nella casella. Guardiano verde, controllo dei testi di C-18 verde.

### Aggiunto — P-54: chi si oppone alle statistiche esce da ogni conteggio

- **La promessa dell'informativa non era ancora falsa solo perché nessuna
  statistica si calcola.** La privacy dice che le statistiche stanno sotto il
  legittimo interesse e che chi si oppone resta con le sue risposte nel suo
  account ed esce dai conteggi (§15.4 di `docs/account-progetto.md`, punto 8):
  il giorno della prima query scritta senza pensarci sarebbe diventata falsa, e
  niente lo avrebbe detto. Ora il segno c'è prima della prima query.

- **Il segno, e chi lo mette.** Una colonna sull'account,
  `fuori_statistiche_dal`, con lo schema 4: una migrazione additiva, e chi
  c'era prima resta nei conteggi perché nessuno si era opposto. Lo mette e lo
  toglie il titolare dalla macchina, con il servizio acceso —
  `node server/opposizione.mjs --email … --metti --motivo "…"` —, e ogni cambio
  è una riga del registro con il numero dell'account e il motivo. Il motivo è
  obbligatorio e non porta email: il registro vive un anno e sopravvive
  all'account. Un percorso del database sbagliato si rifiuta, invece di creare
  un database vuoto e dire «nessun account».

- **Un posto solo, non una regola da ricordare.** `server/statistiche.mjs`: una
  statistica non vede le tabelle ma tre fonti già filtrate — `iscritti`,
  `risposte`, `punteggi` —, e il segno si legge in un punto solo. Una query che
  nomina una tabella vera è rifiutata prima di girare; l'email non è in nessuna
  fonte; il numero dell'account e le righe intere non escono. La lancia
  `node server/statistica.mjs "SELECT …"`, in sola lettura, che dice anche
  quanti account sono fuori dai conteggi. E un controllo nella suite è rosso se
  in `server/` o in `strumenti/macchina/`, fuori da quel file, una riga usa una
  funzione di aggregazione o un `GROUP BY`, o legge la tabella `riga` senza
  fermarsi a un account. Le undici query di oggi che aggregano e non sono
  statistiche sono dichiarate una per una con il motivo — fra queste la copia
  di sicurezza, che conta **tutte** le righe, anche di chi si è opposto, perché
  è il controllo che una copia sia intera —, e una dichiarazione che non serve
  più è rossa anche lei.

- **Due cose trovate, tutte e due sul ripristino, che il prompt non nominava.**
  Il segno sta nel database, e il database di una copia è quello di ieri: un
  ripristino avrebbe rimesso nei conteggi chi si era opposto stamattina, senza
  un errore. È la trappola del §2.7 per le cancellazioni, e ha la stessa cura:
  opposizioni e ritiri si scrivono anche nel file delle cancellazioni, prima
  del database, e il ripristino li rilegge — l'ultima voce di ogni account, per
  `id` e chiave, così un id riusato non eredita l'opposizione di un altro. Una
  copia di prima dello schema 4, quella che `rg-aggiorna` fa prima di
  aggiornare, non ha la colonna: il ripristino la porta allo schema del codice
  invece di fermarsi. E le opposizioni stanno a parte dalle voci che tolgono
  righe, altrimenti la prima opposizione avrebbe «spiegato» un calo di righe e
  spento l'allarme delle copie.

  **La seconda è misurata con il codice del tag.** Il `ripristina.mjs` di
  `v0.28.0` non conosce quelle voci: su un file con un'opposizione dice «1
  righe ILLEGGIBILI — guardale prima di riaprire» e lascia nei conteggi chi si
  era opposto dopo la copia (5 risposte contate invece di 2). Per questo il
  server, a ogni avvio, rilegge le opposizioni dal file, rimette il segno dove
  il database non lo ha, e lo scrive nel registro e nel log. Rifatto con il
  ripristino nuovo sulla stessa copia: «1 di nuovo fuori dalle statistiche», 2
  risposte contate.

- **Il rilascio di prima gira sul database di dopo: misurato, non dedotto.** Il
  server di `v0.28.0`, estratto dal tag in una cartella a parte, su un database
  a schema 4 con un account segnato: parte, scrive «schema del database 4, del
  codice 3», la salute dice `{ codice: 3, database: 4 }`; accesso, invio di una
  riga, ricezione, export e registrazione funzionano, e il segno resta dov'era.

- **Tre scelte scritte nel §15.2.** Il segno **non viaggia nell'export**, né in
  `GET /v1/io`: il file si ricarica in qualunque account, e un segno lì dentro
  sarebbe o ignorato o modificabile con un editor di testo. L'opposizione
  **vale per l'account**: un azzeramento e un cambio d'indirizzo la tengono, la
  cancellazione la porta via, e chi si riscrive deve chiederla di nuovo —
  tenerla oltre vorrebbe dire conservare l'email di chi ha chiesto di
  cancellarla; è un punto per il parere, nel §20. E il controllo dei nomi è sul
  testo: prende lo sbaglio, non un alias né una query scritta a mano in
  `sqlite3` sulla macchina.

- **Prima il test che fallisce:** sei test nuovi, e con i moduli vuoti sette
  rossi uno per uno — i cinque che eseguono, la migrazione e la prova del
  ripristino; il controllo statico era verde da subito, perché fotografa lo
  stato di oggi. **Provati al contrario su quarantatré rotture**, una per
  volta, tutte rosse: la prima è il conteggio che il prompt chiedeva — il
  filtro tolto, 5 risposte contate invece di 2 —, poi fra le altre le righe o i
  punteggi che non passano dagli iscritti, il registro o il file non scritti,
  un azzeramento che toglie il segno, il ripristino che non rilegge, che prende
  la prima voce invece dell'ultima, che riconosce l'account dal solo id, che
  non migra la copia; una statistica che nomina una tabella vera, l'email fra
  le colonne, il segno nell'export; una statistica scritta in `conti.mjs`, le
  righe di tutti lette in `righe.mjs`; il controllo statico senza i `GROUP BY`
  o senza le righe di tutti. **Una è passata verde** — `opponi()` su un
  database di prima del segno scriveva nel file e poi falliva sul database —,
  e ora ha la sua asserzione; **una era rossa per un errore di sintassi**
  invece che per il suo motivo, ed è stata rifatta. Specifica: R-ACC-67…70 nel
  §9.9, con che cosa i controlli non vedono; §2.1 e §3.7.

- **Non fatto:** la macchina non è stata toccata. Gira `v0.28.0`, e questo
  codice ci arriva con il traguardo; il comando del titolare è provato in
  locale, con il servizio acceso e attraverso un collegamento, non con l'utente
  `rg` e i permessi di `/var/lib/rg`.

  Suite: server **68/68** (erano 62) con Node 25.3 e con la **24.21.0 LTS** —
  l'archivio scaricato il 29 settembre, la sua impronta confrontata con il
  `SHASUMS256.txt` che aveva accanto e con quello pubblicato oggi da
  nodejs.org, ed estratto di nuovo —; `ripristina --prova` **22** controlli
  (erano 20); motore 193/197 con i quattro skip previsti, anche con la LTS;
  dati 263; interfaccia 2.158, in 244 s, con la 8620 guardata libera prima;
  specifica **800** (erano 784). Guardiano e controllo della documentazione
  verdi. `site/`, `docs/prossime-sessioni.md` e la macchina non sono stati
  toccati.

### Aggiunto — P-55: lo strumento con cui il titolare legge un account, e la riga che ogni lettura lascia

- **L'informativa prometteva una riga che nessuno poteva scrivere.**
  `site/privacy.html` dice che il titolare legge le risposte di un singolo
  account solo per un problema che gli viene chiesto o per la sicurezza, e che
  «ogni lettura è annotata nel registro di sicurezza»; e mette «le letture
  fatte dal titolare» fra le cose che il server annota. Lo strumento del §15.1
  di `docs/account-progetto.md` era «Proposto» dal 25 settembre e nessun prompt
  l'aveva mai fatto: il titolare avrebbe potuto leggere solo con `sqlite3`,
  senza traccia. Come per le statistiche di P-54, la promessa non era falsa
  solo perché nessuno aveva ancora letto. L'ha trovato il controllo della regia
  del 2 ottobre; l'autore ha scelto lo strumento, non di togliere le due frasi.

- **`server/leggi.mjs`, dalla macchina e a servizio acceso.**
  `node server/leggi.mjs --email … --motivo "…"` mostra l'account — conferma,
  date, generazione, stato della password, sessioni aperte, statistiche,
  Segnali — e le sue attività **con le funzioni del motore**, le stesse della
  pagina: `sessioni()` con il confine dell'attività, `attivitaCarteggio()` e
  `dettaglioCarteggio()`, `traccia()` sullo specchio di `ripiega()`,
  `tagPerTentativo()`. Chi aiuta vede quello che vede chi chiede aiuto, non una
  seconda contabilità. In fondo, gli eventi di quell'account nel registro,
  comprese le letture di prima: è da lì che una lettura si rendiconta.
  `--attivita <id>` aggiunge le righe di una attività, com'erano; `--json` dà
  tutto, righe comprese, così non resta una domanda di supporto per cui serva
  `sqlite3`. Non escono mai la password, la chiave della copia locale, le
  impronte di sessioni e gettoni. Nessuna rotta nuova, nessuna migrazione.

- **Leggere e annotare sono una transazione sola, e la riga si scrive prima**
  (`leggiAccount()` in `server/letture.mjs`). La riga è l'evento `lettura del
  titolare`, con quando, il numero dell'account e il motivo, senza IP. **Il
  motivo è obbligatorio e non porta email**, con la stessa funzione
  dell'opposizione, `motivoPerIlRegistro()`. **Ogni lettura è una riga**, anche
  la seconda con lo stesso motivo. Se la riga non si può scrivere — un database
  in sola lettura, o di prima del registro — non esce niente; se la lettura si
  rompe a metà non resta la traccia di una lettura che non c'è stata. Un
  percorso che non esiste, un file vuoto, un file che non è un database e
  un'email che nessun account ha escono con 1, muti, senza annotare; lo
  strumento apre in scrittura ma senza `apri()`: non crea e non migra niente.

- **Non cambia niente dell'account.** Un test confronta ogni tabella tranne il
  registro prima e dopo tre letture: identiche, «ultimo accesso» compreso — una
  lettura del titolare non deve rimandare la cancellazione per inattività.
  Niente nel file delle cancellazioni. **Quanto vive la riga lo dice il
  §15.3**, che lo diceva già: un anno, come ogni evento senza indirizzo. Nasce
  senza IP e senza un vincolo sull'account: c'è a 364 giorni, non c'è a 366, e
  la cancellazione dell'account non la tocca.

- **Il controllo delle statistiche non vede la lettura di un account, ed è
  misurato.** Il prompt chiedeva di dichiararla in R-ACC-69 se quel controllo
  la vedeva: non la vede, per costruzione — lascia passare una query che si
  ferma a un account, `account_id = ?` —, e `letture.mjs` non aggrega niente
  in SQL, quindi non c'è niente da dichiarare lì e niente è stato aggirato. Ma
  vuol dire che un **secondo** strumento che leggesse un account senza annotare
  non lo vedrebbe nessuno. Per questo c'è un elenco nuovo (R-ACC-74): i file di
  `server/` e di `strumenti/macchina/` che leggono le righe di un account,
  dichiarati uno per uno con il motivo; solo `leggi.mjs` importa `letture.mjs`;
  lo strumento non ha query sue.

- **Trovato, e corretto: `opposizione.mjs` su un file vuoto ne faceva un
  database.** Misurato provando lo stesso caso su tutti e tre gli strumenti:
  un file che esiste ed è vuoto passava il controllo «il database c'è»,
  `apri()` ne faceva un database di 69.632 byte, e la risposta era «nessun
  account» — la stessa di un indirizzo sbagliato. Ora lo rifiuta; prima il
  test, rosso per quella ragione.

- **Trovato, e lasciato all'autore: un ripristino perde le letture annotate
  dopo la copia.** Misurato: una lettura prima della copia e una dopo, e dopo
  il ripristino nel registro c'è solo la prima. Vale per ogni evento del
  registro, che sta nel database; la finestra è di dodici ore al più. Non è
  stato portato nel file delle cancellazioni come le opposizioni: è una
  traccia, non uno stato da rimettere, e dopo un ripristino il titolare la
  rifà rilanciando lo strumento con un motivo che lo dica. Nel §20 di
  `account-progetto.md`, con l'alternativa.

- **Prima il test che fallisce:** quattro test nuovi — il primo è quello
  chiesto, una lettura e la sua riga nel registro —, rossi uno per uno con due
  moduli segnaposto, uno strumento che usciva senza leggere e una funzione che
  lanciava; gli altri 68 verdi. **Provati al contrario su quaranta rotture**, una
  per volta, tutte rosse: fra le altre nessuna riga, la riga tentata e la
  lettura fatta lo stesso, la riga scritta fuori dalla transazione, il motivo
  facoltativo nella funzione o nello strumento, un'email nel motivo o nel
  dettaglio, un account che non c'è annotato lo stesso, il confine per pausa,
  le righe di tutti, la password o la chiave locale fra i dati, la copertura a
  due stati, lo strumento che apre con `apri()` o in sola lettura, una seconda
  lettura non annotata, le letture che non scadono o scadono a sei mesi, una
  rotta del server che conosce la lettura, un secondo strumento che legge le
  righe. **Una era passata verde**: la lettura che aggiorna «ultimo accesso».
  È una data senza ora, e il giorno della corsa coincideva con quello
  dell'account del test; ora il test la mette a una data che oggi non può
  essere. **E una corsa intera non valeva**: corretto quel test, le rotture
  erano tutte rosse perché era diventato rosso lui — la richiesta di chi
  studia aggiorna «ultimo accesso» dopo la fotografia. Rifatte tutte, con il
  test verde da solo. Quattro rotture erano scritte male — una non si
  applicava, una era rossa per un errore di sintassi, due rompevano altro — e
  sono state rifatte perché rompessero solo quello che dicono. Specifica: R-ACC-71…74 nel §9.9,
  con che cosa i controlli non vedono — per prima la lettura fatta con
  `sqlite3`, che è della procedura del titolare —, e il §3.7.

- **Non fatto:** la macchina non è stata toccata. Gira `v0.28.0`, e questo
  codice ci arriva con il traguardo; il comando è provato in locale, con il
  servizio acceso e attraverso un collegamento come `/srv/rg/attuale`, non con
  l'utente `rg` e i permessi di `/var/lib/rg`.

  Suite: server **72/72** (erano 68) con Node 25.3 e con la **24.21.0 LTS** —
  l'archivio del 29 settembre, la sua impronta confrontata con il
  `SHASUMS256.txt` riscaricato oggi da nodejs.org, ed estratto di nuovo —;
  `ripristina --prova` 22 controlli; motore 193/197 con i quattro skip
  previsti, anche con la LTS; dati 263; interfaccia 2.158, in 240 s — alla
  prima occhiata la 8620 era della suite di `rotta-giusta-ui`, e si è
  aspettato che fosse libera —; specifica **816** (erano 800). Guardiano e
  controllo della documentazione verdi. `site/`,
  `docs/prossime-sessioni.md` e la macchina non sono stati toccati.

### Corretto — P-56: le condizioni per l'account prima di registrarsi

- **Il modulo rimandava solo alla privacy**, che fonda il salvataggio sulle
  condizioni per l'account e riserva l'account a chi ha compiuto 18 anni:
  chi si registrava non incontrava né le condizioni né il limite d'età.
  Ora, prima di «Crea l'account e salva», una frase visibile dice che creando
  l'account si accettano le condizioni, con il link pulito
  `/avvertenza#condizioni`, e che l'account è per chi ha compiuto 18 anni.
  Nessuna casella, finestra o nuova condizione per abilitare il pulsante;
  registrazione, accesso, invito e riepiloghi restano com'erano.

- **Riprodotto prima, guardato dopo in Chrome a 320, 375 e 1280 px:** frase
  leggibile prima del pulsante, nessuno sbordo orizzontale, pulsante abilitato,
  nessuna casella aggiunta; il link raggiunge la sezione «Le condizioni per
  l'account» a tutte e tre le larghezze, senza errori JavaScript.
  Il controllo permanente della frase resta a P-57, su `main` dopo la merge:
  `tests/` e `docs/prossime-sessioni.md` non sono stati toccati.

  Suite: motore **193/197**, con i quattro skip previsti; dati **263**;
  interfaccia **2.158**, completa con Chrome e la 8620 libera prima dell'avvio;
  specifica **800**; server **68/68** su Node **25.3.0** e **24.21.0 LTS**,
  pacchetto separato con impronta verificata contro `SHASUMS256.txt`.
  Guardiano e controllo della documentazione verdi. Versione non toccata.

### Test — P-57: le condizioni nel modulo di registrazione, e un modulo che non si vede

- **La frase di P-56 ha il suo controllo: C-20, nel banco del client
  (R-ACC-75).** L'informativa poggia il salvataggio sulle condizioni per
  l'account e riserva l'account a chi ha compiuto 18 anni; P-56 le ha fatte
  incontrare a chi si registra, e niente le teneva lì. Il gruppo nuovo apre il
  modulo «Crea un account» dal riepilogo di un'attività, senza account e a 375
  px, e cerca **nella finestra**, in quello che si vede e **prima** del pulsante
  «Crea l'account e salva», il link a `/avvertenza#condizioni` — dentro il
  sito, con l'indirizzo pulito e l'ancora — e i 18 anni; poi **segue il link**
  in un'altra scheda, e pretende che l'ancora ci sia, si veda e sia il titolo
  delle condizioni. La frase non si cerca parola per parola: è
  dell'interfaccia. L'ancora si guarda anche in `site/avvertenza.html`, una
  sola, sul titolo di una sezione che dice gli stessi 18 anni. Senza API: gira
  sulle corsie libere, e non allunga la fila della 8620.

- **Prima il rosso.** Sulla pagina di riferimento senza la frase, e sulla
  pagina di prima di P-56 (`site/app.html` di `1540158^1`, con `RG_PAGINA`):
  rosse sul link — «nel modulo nessun link verso /avvertenza#condizioni:
  «Come trattiamo i dati» porta a /privacy» —, sui 18 anni e sul link da
  seguire, e solo lì; il quarto rosso è la dichiarazione del difetto qui
  sotto, che vuole verdi i passi prima. Poi la frase è entrata nella pagina di
  riferimento.

- **Un difetto della pagina vera, trovato misurando: dal riepilogo il modulo
  si apre sotto il riepilogo (R-ACC-76).** Le quattro verifiche della frase
  erano verdi, e in una schermata il modulo non c'era. `innerText` e i
  rettangoli dicono che un testo non è nascosto, non che niente gli stia
  sopra. Riprodotto a 375 e a 1280 px: una risposta, «Termina», «Crea un
  account e salva» — la schermata prima e dopo il clic è la stessa, **byte
  per byte**, il fuoco va su un titolo che non si vede, e `elementFromPoint`
  sul titolo, sul link e sul pulsante restituisce pezzi del riepilogo.
  `.account-panel` ha `z-index:30`; `#quizrun`, `#cartrun` e `#segrun` 80,
  `.fine` 84: le due regole convivono dal commit di P-18. È la strada
  dell'ADR-004 — registrarsi alla fine di un'attività —, e nessun controllo la
  vedeva, perché il banco preme con `element.click()`: C-04 e C-05 fanno una
  registrazione intera dentro una finestra coperta. Dall'intestazione, senza un
  runner aperto, il modulo si vede, con la frase sopra il pulsante: è quello
  che i collaudi hanno guardato.

  C-20 ha quindi una quinta verifica, con le misure degli avvisi dell'area 6 —
  nello schermo, opaco, niente sopra, contrasto — su titolo, link, frase e
  pulsante. Sulla pagina vera è un **difetto aperto dichiarato** in
  `docs/eccezioni-interfaccia.md`: la suite pretende che sia rossa, per quello
  che sta sopra la finestra, con le altre quattro verdi, e diventa rossa lei il
  giorno che il difetto è chiuso e la riga no. È una verifica a parte apposta:
  la frase resta controllata anche finché la finestra è coperta. **`site/` non
  è stato toccato:** lo chiude `ui/*`, portando la finestra sopra i runner.

- **E una cosa misurata e non controllata:** il link si apre nella stessa
  scheda. Con «indietro», in Chrome, la pagina torna com'era; con «← torna
  alla palestra», che l'avvertenza offre in cima, `/app` si ricarica e le
  risposte da salvare non ci sono più. Vale anche per «Come trattiamo i dati»,
  lì da P-18. Scritto nel §12 del progetto del client, per l'interfaccia e
  per l'autore.

- **Ventuno rotture, tutte rosse per il loro motivo.** Diciotto della pagina
  di riferimento — la frase tolta, nascosta, invisibile, il link senza testo;
  il link con l'estensione, verso un'altra pagina, senza l'ancora, verso
  un'ancora che non c'è, fuori dal sito; i 18 anni tolti, o scritti e
  nascosti; la frase dopo il pulsante, dopo nel documento e sopra sullo
  schermo, sotto il pulsante per il CSS, nel riepilogo invece che nella
  finestra; il modulo sotto il riepilogo, la frase trasparente, la frase del
  colore del fondo — e tre del **sito**: l'ancora tolta dall'avvertenza, messa
  su un'altra sezione, nascosta. Per queste il banco sa ora servire, al posto
  di un file di `site/`, la copia rotta che la prova porta con sé; la pagina
  di riferimento resta intatta, e il rosso viene solo da dove il link è
  seguito. **Il banco contro sé stesso**, tredici difese tolte una alla volta:
  dodici fanno passare verde, o rossa per un altro motivo, la loro rottura;
  una — l'ancora esatta nel link — non la esercita nessuna rottura da sola,
  perché si copre con il link seguito, e restano tutte e due. Tolto «che cosa
  sta sopra», sulla pagina vera la quinta verifica è verde: schermo, opacità e
  contrasto passano già.

- **Nella specifica** R-ACC-75 e R-ACC-76 nel §9.9, con che cosa non vedono —
  le altre due porte del modulo, le altre finestre dell'account sopra un
  runner, lette nel CSS e non riprodotte —, e il registro. Nel progetto del
  client il §4.2 dice la frase di P-56, e il §12 ha «Le condizioni nel modulo».

  Suite: interfaccia **2.248** (erano 2.158), **tre giri verdi** in 242 s
  l'uno, il secondo con la 24.21.0 nel `PATH`; e un quarto sulla pagina di
  prima di P-56, con 4 rossi su 2.248, tutti di C-20. Specifica **824** (erano
  816); motore 193/197 con i quattro skip previsti; dati 263; server 72/72.
  Con la **24.21.0 LTS** — una cartella già estratta, e l'archivio di una
  sessione precedente con l'impronta uguale a quella del `SHASUMS256.txt` che
  ha accanto: niente riscaricato —: motore 193/197, server 72/72. Guardiano e
  controllo della documentazione verdi. Prima di ogni giro la 8620 guardata
  libera; nessun carico di prova lanciato. `site/` e
  `docs/prossime-sessioni.md` non sono stati toccati.

### Corretto — P-58: le finestre dell'account sopra l'attività da salvare

- **Il modulo c'era, ma il riepilogo lo copriva.** Riprodotto e guardato
  prima della correzione a 375 e 1280 px, senza account: dopo «Crea un account
  e salva» il fuoco era su `account-title`, mentre `elementFromPoint` sul suo
  centro vedeva il riepilogo. Misurati i livelli 30 per `.account-panel`,
  80 per il runner e 84 per il riepilogo. Il pannello comune dell'account
  passa a 110, sopra anche la revisione a 82: vale per registrazione, accesso,
  data d'esame e tutti i pannelli che usano la stessa finestra.
- **Le condizioni e la privacy si leggono in un'altra scheda**, con
  `target="_blank"` e `rel="noopener"`, per conservare la pagina che tiene le
  risposte in memoria. Vale anche per la privacy nell'invito del riepilogo e
  per il collegamento alla palestra nella finestra senza API. Seguiti nel
  browser i due link del modulo; anche «torna alla palestra» dall'avvertenza
  lascia intatti il modulo e la risposta nella scheda originale.
- **Collaudo guardato in Chrome a 320, 375 e 1280 px**, aprendo registrazione
  e accesso dai riepiloghi di un quiz, di una prova di carteggio con quattro
  giudizi e di una partita dei Segnali con dieci risposte. Il titolo riceve
  il fuoco ed è scoperto; «Torna al riepilogo» ed Esc conservano il testo del
  riepilogo e restituiscono il fuoco alla porta di apertura. Guardati anche
  il recupero password e, con un account fittizio su database temporaneo e
  posta fittizia locali, la data d'esame dopo la registrazione alle tre
  larghezze e i pannelli secondari dell'account sopra i Segnali. Nessun
  servizio di produzione toccato.
- **Tolto C-20 dai difetti aperti dichiarati** in
  `docs/eccezioni-interfaccia.md`: R-ACC-76 ora passa sulla pagina vera.
  Suite: interfaccia **2.245** (erano 2.248: tre verifiche nette in meno nel
  passaggio dalla dichiarazione del difetto al controllo verde della finestra);
  specifica **824**; dati **263**; motore **193/197**, con i quattro skip
  previsti; server **72/72** sia con Node 25.3.0 sia con la **24.21.0 LTS**,
  archivio del pacchetto ufficiale confrontato con il manifesto SHA-256
  conservato accanto. Guardiano e controllo della documentazione verdi.
  `tests/`, `docs/prossime-sessioni.md` e le tre versioni non modificati.

## [0.28.1] — 2026-10-01

Un rilascio di correzione, da un ramo che parte da `v0.28.0`, con una cosa
sola: **la prova di carteggio dice che il testo resta solo nella pagina aperta,
e il browser chiede conferma prima di lasciarla con del testo scritto.** Nella
0.28.0 una ricarica a metà prova perdeva fino a un'ora di lavoro senza che la
pagina lo dicesse. La correzione è quella di P-36, scritta e collaudata il 26
settembre su `main`, dove però resta insieme alla versione con gli account, che
non è ancora pubblicabile: per questo esce da qui. La bozza vera, che il testo
lo conserva, arriva con la versione con gli account.

**Per pubblicarla su `rottagiusta.it`** il ramo di build di statichost.eu va
portato su `fix/0.28.1` prima di «Build now», perché costruisce da `main`; al
rilascio successivo torna su `main`.

### Corretto — il testo del carteggio resta nella pagina aperta, e si dice prima

- **Una ricarica perdeva il testo senza che la pagina lo dicesse.** Prima
  della prova e degli allenamenti sulla carta, e nel runner quando c'è testo
  non vuoto, si legge: «Il testo che scrivi resta solo finché questa pagina è
  aperta. Non ricaricare la pagina e non chiudere la scheda fino alla
  consegna.» Un'informazione con l'azione per proteggere il lavoro, senza
  promettere una bozza salvata. Corretto anche il commento che prometteva
  erroneamente un salvataggio a ogni tasto.
- **La conferma del browser protegge l'uscita accidentale.** Il listener
  `beforeunload` si registra soltanto con testo in almeno un esercizio e
  attività non consegnata; si rimuove quando tutto il testo è cancellato,
  alla consegna (anche per scadenza) e alla chiusura del runner. La consegna
  conserva i due tocchi in pagina. Nessun nuovo salvataggio: la bozza per
  account resta P-34, come `docs/area-4-progetto.md` §3.3 richiede.
- **Collaudo in Chromium, guardato a 375 e 1280 px:** prova, giro delle
  tecniche e tappeto, sei casi. Avvisi leggibili a 14 px; vuoto e soli spazi
  non attivano la protezione; testo in un altro esercizio la mantiene;
  navigazione e ricarica annullata conservano i risultati. Primo tocco di
  consegna ancora protetto, scrittura che annulla la conferma, secondo tocco
  che rimuove la protezione; scadenza e chiusura la rimuovono, una nuova
  attività vuota non la eredita. Ricarica dopo consegna e dopo chiusura senza
  conferma. Zero scritture della bozza in localStorage, sessionStorage o
  IndexedDB durante scrittura, navigazione e consegna; zero errori JavaScript.

  Suite del rilascio, sul ramo `fix/0.28.1`: motore **141/143**, con i due
  skip di sempre; server **58/58**; dati **242**; interfaccia **295**;
  specifica **370**; guardiano verde. Sono le suite di `v0.28.0`, senza il
  banco del browser, che è nato dopo.

## [0.28.0] — 2026-09-26

Chi studia vede **i Quiz ridisegnati in cinque intenzioni** (area 2) e i tag
N/L/C che non si perdono più a un nuovo tag né a un import. Nel repo, e non
nella pagina, arrivano gli account: le decisioni (ADR-003, ADR-004), il
progetto, e un server testato che la pagina **non chiama ancora** — quindi per
chi studia non cambia niente di quello che resta nel suo browser, e i testi che
lo dicono restano veri. Il rilascio esce adesso anche perché il server si avvia
soltanto da un tag pubblicato (`docs/account-progetto.md` §2.7).

### Deciso

- **ADR-003: account obbligatorio, con i dati sul server. Sostituisce l'ADR-002
  dello stesso giorno.** L'ADR-002 poggiava su un'assunzione implicita e mai
  verificata: che al titolare **non servisse leggere i dati**. Verificata, la
  risposta e' stata no — servono per il supporto e per le statistiche — e un
  archivio cifrato lato client non si puo' leggere per definizione. Non e' un
  limite da aggirare: e' la proprieta' stessa. Quindi cade per intero.

  Deciso: email e password, **obbligatorio**, con verifica dell'indirizzo; righe
  sul server in chiaro; import del file esistente come conversione in account;
  cancellazione dopo **due anni di inattivita', con avviso**.

  **Perche' qui la sincronia non e' il disastro della 0.4.2**, ed e' la domanda
  che la decisione doveva superare: li' si fondeva **lo specchio**, cioe' stato
  derivato, e qualcuno doveva vincere. Le righe no: sono append-only e hanno un
  `uid`, quindi fondere due archivi e' un'**unione di insiemi** — nessun
  conflitto, nessun vincitore. Lo specchio non viaggia mai e si ricalcola sempre
  in locale, quindi R-ARCH-01 resta intatta. Non e' merito di questo ADR: e'
  merito del modello dei dati scelto nella 0.3.0 per un altro motivo.

  Cadono quattro Vincoli su sette del §2: niente account, niente backend, niente
  sincronizzazione, niente cookie. Restano la contabilita' unica dello storico,
  il carteggio che non si corregge da solo, niente build step, la banca
  immutabile.

  **L'ADR-002 resta sul disco per intero**, marcato superato e con scritto
  perche' e' caduto: la sua analisi del rischio e' il materiale su cui l'ADR-003
  ha dovuto rispondere, e cancellarla farebbe sparire il ragionamento.


### Verificato — la v0.27.0 sui due indirizzi

- **Su `open-patente-nautica.pages.dev`, l'unico «fuori casa» vero:** la vetrina
  mostra la striscia, e i due «Inizia subito» e tutte e dieci le tessere portano
  a `https://rottagiusta.it/app`; la palestra, v0.27.0, mette l'avviso del
  trasloco come primo stato, con «Scarica i progressi» collegato all'esportazione
  e il link alla palestra nuova. **Su `rottagiusta.it`:** v0.27.0, cache
  `rg-0.27.0`, nessun avviso. Le tessere riscritte si sono potute provare solo
  qui: in locale, sul nome di prova, il browser bloccava le richieste della
  pagina e la vetrina diceva, correttamente, che la banca non risponde.

- **Da qui la finestra.** Pages resta acceso perché chi ha la palestra
  installata sul vecchio indirizzo prenda questa versione; il redirect (D2) non
  prima del 16 ottobre 2026. Il come è in `docs/migrazione-hosting.md`.

### Riscritto — i valori e il §2 dopo l'ADR-003

- **`docs/filosofia.md` e il §2 di `docs/specifica.md` dicono che cosa si è
  perso.** L'ADR-003 li rendeva falsi in quattro punti — «senza account, senza
  un server», «non trattiamo dati personali», «nessun dark pattern possibile,
  perché non c'è un imbuto», e l'argomento intero dei dati che restano nel
  browser per architettura e non per promessa. Non sono stati sostituiti: ogni
  punto dice che cosa era vero, che cosa lo è adesso e perché. Il documento dei
  valori è il posto in cui una decisione così si è tentati di scriverla a mezza
  voce, ed è il motivo per cui l'ADR chiedeva di riscriverlo «non con un giro di
  parole».

  **Le perdite, in chiaro, in tutti e due i documenti:** la garanzia che non
  dipendeva da nessuno, l'anonimato, il primo quesito senza chiedere niente —
  una registrazione obbligatoria **è** un imbuto —, l'offline alla prima visita,
  e il non avere niente da custodire. In cambio chi cambia telefono non perde
  più tutto.

  **Il §2 ha ora cinque parti:** che cosa resta (Vincolo), che cosa cade
  (Deciso, con la data), che cosa si perde, che cosa resta aperto, e quali
  sezioni della specifica descrivono ancora il prodotto senza account. Queste
  ultime — §3, §4.6, §7.1, §7.8, Appendice A — sono **elencate e non riscritte**,
  perché dipendono da scelte che l'ADR dichiara di non prendere. Fra i Vincoli
  entra la banca immutabile, che l'ADR nomina fra quelli da difendere e che il
  §2 non aveva; «nessun analytics» resta, perché l'ADR non lo tocca e le
  statistiche che chiede si fanno leggendo le righe delle risposte. Nel §10
  entra **Q-ACCESSO** — obbligatorio per usare o solo per salvare — con
  l'autore come decidente.

  **Tutti e due i documenti descrivono il prodotto deciso, e lo dichiarano in
  testa:** il sito pubblicato non ha ancora account, e i testi di `site/` che lo
  dicono oggi sono veri. L'elenco di quelli da cambiare — informativa, vetrina,
  palestra, con riga, testo attuale e che cosa diventa falso — è in
  `docs/prossime-sessioni.md` per chi lavora su `ui/*`, con la regola: **nella
  stessa versione in cui entrano gli account, non prima.** `site/` non è stato
  toccato.

### Deciso — ADR-004: senza account si prova, con l'account si salva

- **L'account non è più obbligatorio per usare il sito: lo è per salvare.**
  Sostituisce la sola parola «obbligatorio» dell'ADR-003, dello stesso giorno;
  il resto dell'ADR-003 vale. L'ADR-003 aveva registrato questa variante con i
  suoi costi per esteso e aveva scritto che soddisfaceva tutte e tre le
  aspettative della decisione, ma **non perché non l'aveva scelta**. Chiesto,
  un motivo per volere la registrazione dalla prima risposta non c'era.

  **Com'è, con la precisazione dell'autore:** senza account si fanno tutte le
  prove, ognuna con il suo riepilogo, e **non resta niente** — nemmeno nel
  browser. Con l'account si salva, si vedono i Progressi e le metriche, e si
  passa da un onboarding con la data d'esame, che resta facoltativa.
  Registrarsi alla fine di un'attività la porta nell'account dalla porta
  dell'import, `fondiArchivio()`: unione per `uid`.

  **Perché i Progressi ai soli registrati non è un ricatto:** sono misure su uno
  storico, e senza salvataggio lo storico non c'è. Il ricatto è l'alternativa
  scartata — salvare nel browser e nascondere le misure finché non ci si
  registra —, e la filosofia ora promette di non farlo.

  **Quattro condizioni fanno parte della decisione**, e sono R-ACC-02…05 nel
  nuovo §9.9 della specifica, scoperti con il motivo perché gli account non
  esistono ancora: senza account si dice che non resta niente; la registrazione
  si raccomanda alla fine di un'attività con i vantaggi che esistono, non a ogni
  schermata; senza account non si toglie niente apposta; **un archivio che
  esiste già nel browser il giorno del rilascio non sparisce in silenzio**.
  L'ultima è quella che il guasto muto avrebbe preso per prima.

  **Che cosa si perde, dichiarato in specifica e filosofia:** chi non si
  registra non ha più quello che il sito fino a oggi dava a tutti — l'archivio
  nel browser, i Progressi, la ripresa dal giorno prima. Tornano invece il
  primo quesito senza chiedere niente e l'offline alla prima visita.

  Q-ACCESSO è chiusa. Entra **Q-ONBOARD**: che cosa chiede l'onboarding oltre
  alla data, e se il sito consiglia un piano di studio strutturato — con i
  limiti di quello che il motore sa, scritti accanto. L'elenco dei testi di
  `site/` in `docs/prossime-sessioni.md` legge ora ogni frase nei due stati:
  quasi tutte quelle sul «tuo browser» diventano false in entrambi.

### Progettato — gli account

- **`docs/account-progetto.md`: il *come* che l'ADR-003 e l'ADR-004 lasciavano
  aperto.** Tabelle, Argon2id, cookie di sessione, forma dell'API, verifica
  dell'email, sincronia delle righe, conversione di un file, il passaggio di chi
  ha già un archivio nel browser, onboarding, cancellazione a due anni. Niente
  codice, e senza l'account Scaleway: quello che dipende da lì è «da misurare».
  Le sezioni 5, 8, 9 e 10 di `recupero-progetto.md` non sono state rifatte.

  **Tre scelte con il loro perché.** Il server in Node, perché importa
  `engine.js` e rifiuta le stesse righe del browser con la stessa funzione —
  una seconda copia delle regole è la riga con `ts: "boh"` della 0.4.6, che
  spegneva la palestra su ogni dispositivo. Il cursore della sincronia è un
  numero assegnato dal server, **non `ts`**: una risposta data offline il 3 e
  inviata il 10 ha un `ts` più vecchio dell'ultimo scaricato, e un cursore su
  `ts` la salterebbe per sempre. E una *generazione* per account, perché con
  l'unione per `uid` un telefono rimasto offline rimanderebbe le righe appena
  azzerate: una cancellazione che non cancella, senza un errore.

  **Cinque misure.** `rottagiusta.it` manda HSTS con `includeSubDomains`, quindi
  `api.` è in HTTPS dal primo giorno. Il dominio ha già una posta IONOS con **un
  SPF solo**: un secondo record per Scaleway li invaliderebbe entrambi e
  romperebbe la posta dell'autore, quindi il sito spedisce da `posta.`.
  Argon2id con i parametri OWASP (19 MiB, t=2) in 27 ms sul Mac, e
  `crypto.argon2` c'è in Node 25.3 senza avvisi; `node:sqlite` invece stampa
  ancora `ExperimentalWarning`, ed è dichiarato. 100 account da 2.100 risposte
  in SQLite: 69,6 MiB, 347 byte a riga.

  **E due difetti vivi, trovati misurando.** Le righe dei tag N/L/C nascono
  senza `ts` (`app.html:4319`), e `fondiArchivio()` le scarta tutte: una
  risposta con il suo tag dà `nuove: 1, scartate: 1`. E ritaggare **cancella**
  la riga vecchia: è l'unico punto in cui l'archivio non è append-only, e il
  primo che l'unione per `uid` avrebbe tradito. Sono di `app.html`, quindi di
  `ui/*`, e stanno in `docs/prossime-sessioni.md` come lavoro da fare prima del
  client degli account.

### Aggiunto — `validaRiga()`, e l'import che non scarta più i tag

- **Una regola sola dice se una riga è buona, e il rifiuto dice perché.**
  `validaRiga(riga, { quesiti })` nel motore restituisce `null` o un motivo breve
  e stabile — «data non valida», «senza uid», «tag non valido» —, e
  `fondiArchivio()` la usa al posto della sua regola in linea, restituendo
  anche `motivi`, `{ motivo: quante }`. Con gli account la useranno anche la
  conversione di un file e il server, importando questo stesso file: due copie
  della regola sono la riga con `ts: "boh"` della 0.4.6, accettata dal server e
  fatale su ogni dispositivo.

- **Le righe dei tag N/L/C non si scartano più all'import.** Nascono senza `ts`
  (`app.html:4319`) e la regola vecchia le rifiutava tutte: una risposta con il
  suo tag dava `nuove: 1, scartate: 1`. Nell'archivio vero della preparazione
  erano **160**: esportato e reimportato, quel lavoro le avrebbe perse. La
  pagina non è stata toccata — legge `nuove`, `gia`, `scartate` come prima.

- **Le regole sono state misurate prima di fissarle**, sull'archivio vero del
  progetto di preparazione, letto sulla macchina dove sta e non copiato: 2.341
  righe, 135 con la data in UTC con la `Z` — che ha allargato «con offset» a
  comprenderla —, `uid` tutti stringhe da 17 caratteri, tag solo N/L/C, la riga
  più grande 241 byte. Poi `validaRiga()` eseguita su tutte, con la banca
  accanto: **2.341 accettate, zero scarti**. Scarta di più della regola vecchia
  solo dove una riga è davvero rotta: una data che non è una data, un'ora senza
  fuso, un `uid` che non è una stringa, una riga oltre i 4 KiB.

- **Quattro test scritti prima**, e rossi uno per uno — non l'intera suite con
  un errore d'import — finché la funzione non c'era; l'ultimo cadeva per la
  ragione misurata, `nuove` 1 invece di 2. **Provati al contrario cinque volte**:
  tag senza data rifiutati → 4 rossi; offset facoltativo → 1; data impossibile
  accettata → 1; `fondiArchivio()` con la regola vecchia → 1; banca ignorata → 1.
  **132 test sul motore** (erano 128), 260 verifiche sulla specifica.

### Deciso — dall'autore, sul progetto degli account

- **Senza account nel browser non resta niente, nemmeno le preferenze.** Il
  progetto proponeva di tenere filtri e modalità, perché non sono risposte;
  l'autore ha letto alla lettera la promessa dell'ADR-004. R-ACC-09. Entra nella
  stessa versione degli account, non prima: oggi il sito salva nel browser, e le
  chiavi che ci scrive sono vere.
- **La password è lunga almeno 15 caratteri**, come NIST SP 800-63B-4 per una
  password usata da sola, senza regole di composizione. R-ACC-10.
- **Su sua delega**, perché ha detto di non avere gli elementi: la macchina con
  SQLite e Node senza dipendenze, la forma con meno pezzi; e il registro di
  sicurezza con **l'IP per sei mesi e l'evento per un anno**, sulla
  raccomandazione della CNIL (delibera 2021-122: fra sei mesi e un anno). La
  prima stesura diceva trenta giorni, troppo pochi per capire da quando dura un
  attacco scoperto tardi.
- **Il link di conferma vale 24 ore**, il limite di NIST SP 800-63A-4 per un
  codice mandato per email; la prima stesura diceva 48. Per quanto vive un
  account non confermato **non c'è uno standard**: Mastodon 7 giorni, Discourse
  14. Resta la proposta di sette, in attesa dell'autore.
- **Un account non confermato vive sette giorni**, poi si cancella con le sue
  righe: confermato dall'autore sui riferimenti qui sopra. Sette e non
  quattordici, perché un account non confermato può contenere risposte legate
  all'indirizzo di qualcun altro. R-ACC-11, scoperto finché il server non c'è; i
  requisiti proposti in `docs/account-progetto.md` scalano di uno, da R-ACC-12.

### Riordinato — la versione con gli account si conduce da una regia

- **Una sessione di regia è l'unica penna di `docs/prossime-sessioni.md`**, i
  prompt hanno un numero (`P-01`…) e stanno solo nel suo §6, e ogni sessione
  chiude con un resoconto in forma fissa che l'autore riporta alla regia. La
  regola che conta è un'altra: **niente vale solo in chat.** Quello che una
  sessione trova o chiede si scrive nel repo prima del resoconto, e il
  resoconto lo punta; una riga che non ha un posto nel repo torna indietro.
  È la modifica più grande del progetto, e le sessioni che la fanno sono tante:
  ognuna che chiude lasciando qualcosa solo in una chat è un'informazione persa.

### Riordinato — un posto solo per l'ordine dei lavori

- **`docs/prossime-sessioni.md` è l'unico file con l'ordine dei lavori e con i
  prompt**, e ora lo dice in testa, con la mappa di che cosa fa ogni documento
  di `docs/` e la coda in una tabella: chi, su quale ramo, che cosa aspetta.
  Le domande aperte no: restano nella specifica §10 e in `account-progetto.md`
  §20, dove si decidono, e da qui si puntano. Consolidare anche quelle avrebbe
  fatto due elenchi da tenere allineati, che è il difetto che si voleva
  togliere.

- **La tabella delle aree in `prossima-versione.md` §5.1 aveva una numerazione
  che nessuno seguiva**: ciclo 1, Percorso 3, mentre il lavoro — e
  `area-1-progetto.md`, e `eccezioni-interfaccia.md` — contava Percorso 1, Quiz
  2, ciclo 3. Lo diceva solo una nota dentro il progetto dell'area 1. Un prompt
  che puntasse a «la fetta successiva di §5.1», come quello di ieri, poteva
  mandare ChatGPT sull'area sbagliata. Rinumerata come il lavoro l'ha seguita.

- **ChatGPT lavorava su una base di tredici commit prima**, senza ADR-003,
  ADR-004 e la coda. `ui/main` e `ui/vetrina`, puliti e senza commit propri,
  sono stati portati avanti veloce a `main`; il prompt d'ingresso è in §3.0.

### Corretto — P-01: tag append-only e motivi degli scarti

- **Ritaggare N/L/C aggiunge una riga con `ts`, senza cancellare le precedenti.**
  La cancellazione avrebbe fatto tornare i vecchi tag alla prima unione con
  un'altra copia dell'archivio (`docs/account-progetto.md` §4.2). Il riepilogo
  legge ora l'ultima classificazione per tentativo dall'archivio, invece della
  copia in memoria nel runner: `E.ordinaRighe()` mette prima i tag storici
  senza data, poi gli istanti reali, anche con UTC e offset locale mescolati;
  a parità di istante vale l'ordine dell'archivio. Le vecchie righe restano
  importabili, senza riscriverle.

- **L'import mostra anche i motivi degli scarti e quanti sono per motivo**, da
  `fondiArchivio().motivi`, accanto a nuove, già presenti e scartate. Il messaggio
  va a capo entro il viewport: aggiungere i motivi senza limitarne la larghezza
  avrebbe nascosto una parte del risultato sul telefono.

- **Verificato prima e dopo:** cinque controlli mirati sul codice della pagina,
  eseguito sotto Node con archivio e DOM sostituiti, passano da 1/5 a 5/5:
  conservazione dei tag precedenti, data valida sulle nuove righe, ultima
  classificazione con date miste e tag storici, motivi e conteggi dell'import,
  reimport senza doppioni. Collaudo in Chrome, guardato a **375 e 1280 px**:
  N→L nel verdetto, L selezionato nel riepilogo, poi C dal riepilogo. L'export
  contiene **8 righe: 2 risposte e 6 tag**, di cui un tag storico senza data;
  sul tentativo ritaggato restano N, L e C, tutti con data valida. Dopo una
  ricarica, reimport dello stesso export: **0 nuove, 8 già presenti, 0 scartate**.
  Il file sintetico con un tag valido e tre righe rotte mostra **1 nuova e
  3 scartate**: data non valida 1, tag non valido 1, senza uid 1; al secondo
  import **0 nuove, 1 già presente, 3 scartate**, con gli stessi motivi.

  Quattro suite verdi: **motore 131/132, con uno skip preesistente** (il vecchio
  confronto con `daAllenare()` in pagina, ormai nel motore); **dati 221,
  interfaccia 135, specifica 262**. Controllo della documentazione verde.
  Nessun account introdotto e nessun testo anticipato sul prodotto futuro;
  versione, documenti storici e `docs/prossime-sessioni.md` invariati.

### Misurato — Scaleway, e come si aggiorna il server (P-02)

- **Le misure del §19 di `docs/account-progetto.md`, sulla macchina vera.** Due
  macchine di prova, DEV1-S in `fr-par-1` e STARDUST1-S in `pl-waw-2`, create
  per la sessione e cancellate con IP e disco. Argon2id con i parametri OWASP a
  **37 e 35 ms**, 210.000 righe in SQLite in meno di due secondi, un account
  intero riletto in 2–3 ms. La forma del §2.2 regge.

- **Il prezzo no, ed è il motivo per cui la sessione si è fermata.** In `fr-par`
  la macchina più piccola che si può creare, la DEV1-S, con IPv4 e disco costa
  **11,15 € al mese**; l'autore aveva dato un tetto di 10. Quella che ci starebbe,
  la STARDUST1-S a 5,04 €, a Parigi è **esaurita**. Misurate tutte e due su sua
  indicazione; la scelta è sua, nel §20.

- **Node non viene da Ubuntu, e non è la versione del Mac.** Ubuntu 26.04 offre
  Node 22, che non ha `crypto.argon2`; la 25.3 del Mac è dispari e senza supporto
  dal 31 marzo. Sulla macchina va una LTS pari dal pacchetto ufficiale verificato
  col suo SHA-256 — provate 24.21.0 e 26.10.0, identiche nei numeri. E in queste
  due `node:sqlite` non stampa più l'`ExperimentalWarning` che il §2.2 dichiarava
  come prezzo.

- **Come si aggiorna e come si torna indietro, che non era scritto da nessuna
  parte**, ora è il §2.7, **provato** e non solo scritto: sulla DEV1-S, con due tag
  pubblici veri e un server finto che importa `engine.js` e apre il database.
  Un tag solo, mai un ramo; un rilascio per cartella e un collegamento che si
  sposta; una copia controllata del database prima di ogni aggiornamento;
  migrazioni solo additive, perché il codice di prima deve girare sul database
  di dopo. Aggiornare **1,5 s**, tornare indietro **1,1 s**, servizio muto per
  **105 ms** — 6 richieste su 371, a una ogni 20 ms. Il database non torna
  indietro con il codice.

- **Ripristinare una copia avrebbe perso righe senza un errore**, in due modi
  trovati pensando a chi è collegato mentre si ripristina, e il primo misurato:
  il cursore `seq` riparte dalla copia, la riga nuova prende **1001** e un
  dispositivo fermo a 1050 non la vede **mai**; e le righe accolte dopo la copia,
  che i client hanno già tolto dalla coda, nessuno le rimanda. È il cursore su
  `ts` del §2.3 arrivato da un'altra parte. Proposta un'*epoca* del database,
  rigenerata da ogni ripristino: un client che la vede cambiare rimanda tutto, e
  l'unione per `uid` fa il resto. R-ACC-24, proposto. Il secondo: il §14.4
  ricancella gli account cancellati dopo la copia leggendoli da un registro che
  sta **nella copia**.

- **La posta:** `posta.rottagiusta.it` è registrato in Transactional Email, e i
  quattro record che chiede — SPF, DKIM, DMARC e un MX che il documento non
  prevedeva — stanno tutti sul sottodominio: il SPF dell'apice, che regge la
  posta dell'autore, non si tocca. Li mette l'autore su IONOS. Il servizio non ha
  tracciamento di aperture né di clic. **Il tetto delle 300 mail non è un
  tetto:** oltre si paga 0,25 € ogni 1.000, e rispondere `503` alla trecentunesima
  registrazione rifiuterebbe una persona per un quarto di millesimo di euro.

- **Il bucket delle copie** c'è, `rottagiusta-copie` in `nl-ams`, con la scadenza
  a 30 giorni. La copia dalla macchina non è misurata: vuole una chiave API, e un
  segreto non passa per una sessione.

- Due trappole della console, sui costi: cancellando un'istanza, il disco **resta**
  se non si spunta la casella apposta, e si paga senza che niente lo dica; e
  «Delete» su un'istanza accesa l'ha solo **spenta**, due volte su due. Le due
  macchine di prova sono sparite al secondo comando, e gli elenchi di istanze e
  volumi di tutte e due le zone sono vuoti.

### Progettato — P-04, l'area Quiz

- **`docs/area-2-progetto.md` chiude il progetto dell'area 2:** cinque intenzioni
  con gerarchia, scelta per argomento senza ingresso duplicato «Batteria»,
  filtri locali, «Un giro tra gli argomenti» senza promessa diagnostica e
  selezione della simulazione separata dall'avvio del timer. Testi per esteso,
  stati, parametri, snapshot e ritorni perché la realizzazione non debba
  scegliere il comportamento. Il regime attuale e i due stati dell'ADR-004
  sono distinti: senza account, dalla versione che li introduce, non restano
  risposte né preferenze oltre la pagina aperta; nessun testo anticipa un
  salvataggio o un client che oggi non esiste.

- **Il ricablaggio di `totScreening()` è specificato, non ancora eseguito:**
  `E.lunghezzaScreening()` conta la banca, e opzioni, anteprima e runner devono
  coincidere. Riprodotto sotto Node: base **44/85/167/249** e vela **3/6/12/18**
  per 1/2/4/6 quesiti per voce, con tre semi; banca ridotta a un solo quesito,
  numero e lista **1**. L'eccezione di funzione orfana resta fino alla chiamata
  reale. La dipendenza per la realizzazione è dichiarata al §10.1: Claude deve
  allineare i controlli che oggi pretendono sei modalità e filtri globali,
  senza una modalità fittizia o test deselezionati per tenere verde la suite.

- **Verifica documentale e dei contratti:** motore **131/132**, uno skip
  preesistente; dati **221**, interfaccia **135**, specifica **262**. Casi
  sintetici in memoria distinguono lista disponibile, da fare, nuovi ed errori;
  base tutti corretti dà Mirata **0** ma argomento **1.472** con da fare **0**;
  simulazione base **20** e vela **5**, base invariata al cambio di storico e
  senza oscurati. Nessuna modifica a `site/`, versione o coda; collaudo visivo
  e con persone della schermata nuova restano da svolgere quando sarà realizzata.

### Aggiunto — i tre prerequisiti del server (P-03)

- **`server/` esiste, nel territorio `motore`, e ha la sua suite.**
  `tests/test_server.mjs`, la quinta, avvia nello stesso processo un server che
  per ora risponde solo a `GET /v1/salute` — versione, schema, epoca — e lo
  interroga con `fetch`. Zero dipendenze: `node:http`, `node:sqlite`, e
  `validaRiga()` importata da `site/engine.js`, così il server rifiuta le stesse
  righe del browser con lo stesso motivo. `territori.yaml` e `AGENTS.md` lo
  dicono; niente di `site/` è stato toccato.

- **Il backup con il ripristino provato, dal primo giorno.** La copia si fa con
  `VACUUM INTO` e si verifica con `integrity_check`; un calo di righe che il file
  delle cancellazioni non spiega è un allarme. Il ripristino prepara il database
  accanto e lo sostituisce solo quando è verificato, **rigenera l'epoca** e
  **rilegge il file delle cancellazioni**, che sta fuori dal database: sono le
  due decisioni dell'autore dopo P-02. `node server/ripristina.mjs --prova` fa il
  giro intero — scrive, copia, cancella, ripristina, confronta — in 20 controlli,
  e la suite lo lancia. Entrano **R-ACC-20** e **R-ACC-24** nella specifica.

  **Tre cose trovate scrivendolo**, in `account-progetto.md` §2.7. Un `id` si
  riusa dopo un ripristino — misurato: l'account nuovo prende proprio quello
  cancellato dopo la copia —, e un file che portasse il solo `id` farebbe
  cancellare al ripristino successivo la persona sbagliata: porta anche la
  chiave casuale dell'account. Un azzeramento che la copia contiene già non si
  rifà, altrimenti toglierebbe le risposte date dopo. E il cursore viene da un
  contatore, non da `MAX(seq) + 1`, che una cancellazione fa scendere.

- **Il guardiano riconosce una chiave di Scaleway**, in qualunque file, e la
  riporta per riga, mai per valore. La access key dalla forma; la secret key,
  che è un UUID, da quello che le sta accanto, perché un UUID da solo non è un
  segreto. Provato dal vero: una chiave finta scritta in `server/`,
  `controlla.py` esce 1 e nomina le due righe; tolta, esce 0.

- **Prima il test che fallisce.** I 22 test del server, con dei moduli vuoti che
  lanciavano, erano **20 rossi uno per uno** e 2 verdi, i due controlli di forma;
  i 7 del guardiano rossi finché la regola non c'era. **Provati al contrario
  otto volte**: senza rigenerare l'epoca → 3 rossi; senza rileggere il file →
  3; il file riletto per solo `id` → 1; `MAX(seq) + 1` → 1; il calo mai allarme
  → 1; la copia con `copyFileSync` invece di `VACUUM INTO` → 2; senza
  `secure_delete` → 1. **L'ottava è passata verde**: l'azzeramento rifatto
  sempre, anche quando la copia lo conteneva già. Il test che la prende è stato
  scritto dopo, e ora è rosso su quella rottura.

- **Gira con Node 24.21.0**, la LTS della macchina, scaricata da nodejs.org e
  verificata con `SHASUMS256.txt`: 23/23 sul server, 131/132 sul motore con lo
  skip di sempre, e con la 24 `node:sqlite` non stampa nemmeno l'avviso che la
  25.3 del Mac stampa. Suite: motore 131/132, server 23/23, dati 236 (erano
  221), interfaccia 135, specifica 270 (erano 262).

  **Non fatto, ed è della macchina:** il trasporto delle copie verso `nl-ams`,
  che vuole la chiave che l'autore crea. `node server/copia.mjs` è il pezzo che
  il giro chiamerà.

### Scelto — P-07: gli standard per la sessione e per le password comuni

- **Tutte e due le risposte vengono da NIST SP 800-63B-4**, lo stesso standard
  dei 15 caratteri, letto oggi nel testo ufficiale. Una sola fonte per una sola
  autenticazione: prendere la password da un documento e la sessione da un altro
  avrebbe dato due risposte alla stessa domanda. Il perché per esteso è in
  `docs/account-progetto.md` §5.2 e §6.2, le righe chiuse nel §20.

- **La sessione vale 30 giorni dall'accesso, e l'uso non la allunga.** Una
  password da sola è AAL1, e a AAL1 lo standard chiede un tempo massimo definito,
  non oltre 30 giorni, contato dall'accesso; la scadenza per inattività è
  facoltativa, e non c'è. Sostituisce la proposta di 60 giorni rinnovati a ogni
  uso e un anno al massimo, che dava a un telefono dimenticato dodici volte il
  tempo dello standard. Scartato l'OWASP Session Management Cheat Sheet (minuti
  d'inattività, ore al massimo): è pensato per la giornata in ufficio, non per
  dieci minuti di studio sul telefono. Seguono il cookie (`Max-Age` a trenta
  giorni) e lo schema della sessione, che perde `usata_il`.

- **L'elenco delle password comuni si tiene solo per le voci da 15 caratteri in
  su**, come lo standard dice, e la misura mostra quanto conta: nel milione di
  password più frequenti la prima abbastanza lunga è al posto 2.209, la
  centesima al 130.955. Ne restano **10.898, 192 KB**. La fonte sono i «ten
  million passwords» di Mark Burnett (2015, pubblico dominio) nel file da un
  milione di SecLists (MIT), fissato per commit e SHA-256; si rigenera con uno
  script invece di trascriverlo. Scartate Pwned Passwords, che si scarica solo
  come impronte e quindi non si filtra per lunghezza, e l'elenco del NCSC, che
  all'indirizzo originale risponde `404`. Dichiarato quello che non è stato
  letto: l'articolo originale di Burnett risponde `403`, e il marchio di pubblico
  dominio sta sulla copia dell'Internet Archive.

- **Una contraddizione trovata, con una proposta e non con una decisione:** il
  §6.5 dice «mai un blocco» dopo gli accessi falliti, e lo standard impone di
  disattivare la password dopo al più 100 tentativi consecutivi — il limite su
  cui l'elenco stesso è dimensionato. Proposto: le attese crescenti restano, e al
  centesimo fallimento si passa dalla reimpostazione per email. Aperto nel §20,
  per l'autore. Proposti **R-ACC-25** (l'elenco, e il rifiuto che dice perché) e
  **R-ACC-26** (i 30 giorni) nel §17. Nessuna riga di codice, niente `site/`.

### Fatto — i passi a mano dell'autore (P-08)

- **`posta.rottagiusta.it` è pronto a spedire.** I quattro record — SPF, DKIM,
  DMARC e MX, tutti sul sottodominio — sono su IONOS, inseriti da Claude nella
  sessione del browser dell'autore e su sua richiesta, con i valori letti nella
  console di Scaleway quel giorno. Verificati con `dig` sul nameserver
  autorevole e su tre resolver pubblici: il DKIM coincide **carattere per
  carattere** con quello della console, e l'apice è intatto. Scaleway dà il
  dominio **«Verified»**. Il sorgente di una mail vera, per vedere che i link
  non siano riscritti, aspetta una chiave API, e quindi il server.

- **Misurando, il §9.4 del progetto si è corretto da solo:** su `rottagiusta.it`
  non c'era nessuna casella. L'SPF unico che «non si doveva toccare per non
  rompere la posta dell'autore» era quello che IONOS mette di default, e
  proteggeva una posta che non c'era. La conclusione non cambia — un servizio
  che può vivere su un sottodominio non tocca l'apice — ma il motivo scritto era
  una deduzione dal DNS, non una misura sul pannello.

- **Il titolare ha un contatto che non è un canale pubblico:**
  `privacy@rottagiusta.it`, un inoltro IONOS, provato con una mail arrivata.
  **Il DPA di Scaleway non va firmato:** dice di sé che è parte integrante del
  contratto, e nella console, fra i contratti dell'organizzazione, c'è la
  versione 10/2024. Il registro dei trattamenti e la procedura per le violazioni
  sono una bozza dell'autore, **fuori dal repo** perché portano il suo nome; il
  loro stato, e sei punti ancora aperti per lui — fra cui l'inoltro che finisce
  su Gmail, cioè possibilmente fuori dall'UE —, stanno nel nuovo §15.4 di
  `account-progetto.md`.

- **Quello che P-02 aveva lasciato è stato tolto:** la chiave SSH delle prove,
  dal progetto Scaleway (ora a zero chiavi) e dal Mac — registrata, sarebbe
  finita in ogni macchina nuova, compresa quella di produzione —, e il worktree
  `rotta-giusta-p02` con il suo ramo, già fuso. Resta la CLI `scw`, senza
  configurazione. La conferma della cancellazione su Scaleway l'ha data
  l'autore: il controllo dei permessi della sessione l'ha fermata, trattandola
  come una scrittura di credenziali, e non è stata aggirata. La STARDUST1-S si
  crea alla messa in esercizio, per non pagarla ferma.

- **I registri del titolare si tengono aggiornati da soli, fino alla decisione.**
  Un'attività programmata nell'app dell'autore, due volte al giorno, legge la
  casella in sola lettura — privacy@, gli avvisi di sicurezza dei fornitori, e
  gli allarmi che il server manderà da `posta.` — e apre le righe nei registri
  delle richieste e delle violazioni con le loro scadenze: un mese per
  rispondere, 72 ore per notificare. Per ogni possibile violazione prepara la
  bozza della notifica. **La notifica al Garante non è una mail**: dal 2021 si fa
  solo dal modulo online, e la bozza ne ricalca le sezioni A–O, lette sul
  facsimile ufficiale. L'attività non spedisce e non notifica niente. Perché
  esiste: una richiesta o un avviso di Scaleway letti tardi sono il guasto muto
  di questa parte del progetto, e la scadenza delle 72 ore non aspetta che
  qualcuno apra la posta giusta. Ricerche provate sulla casella vera: la prova
  dell'inoltro trovata, zero allarmi com'è giusto, e i codici di login di IONOS
  esclusi apposta. §15.4.

### Test — P-06: i controlli dei quiz conoscono due regimi, e nel nuovo eseguono

- **`test_modalita_quiz` e `test_selettori` riconoscono il regime della pagina**
  da `MODI`: le sei modalità di oggi, oppure le cinque intenzioni dell'area 2.
  Nel primo restano i controlli di prima; nel secondo `tests/quiz_intenzioni.mjs`
  estrae `selezioneQuiz(intenzione, conf, fonte)` dalla pagina e la esegue con
  la banca vera, uno storico sintetico e un `E` che registra ogni chiamata di
  selezione prima di eseguirla. Per ciascuna intenzione pretende la **sola**
  chiamata della tabella del §6 di `area-2-progetto.md`, i suoi parametri, e
  la lista che il motore ha restituito con il solo tetto `n`. Il contratto è
  nel §10.1 del progetto, dove P-05 lo legge; R-NAV-04 e R-NAV-05 riscritti.

  **Perché non i nomi.** Cinque nomi giusti possono aprire la lista sbagliata:
  una Mirata a 20, la vela filtrata per tema, «solo mai fatte» che non arriva al
  motore, la prova vela con un 5 scritto a mano. È il difetto di casa — il
  numero promesso e la lista che si apre da due fonti — spostato dal motore
  alla colla fra pagina e motore. Tre scelte lo stringono: ogni configurazione
  porta **campi di altre attività**, e un filtro che si trasferisce è rosso; le
  condizioni della prova vela nella fonte sono **7 domande e non 5**, così una
  costante in pagina non passa per coincidenza; e si contano le chiamate, perché
  lista e motivi della Mirata presi da due chiamate coincidono, essendo la
  Mirata deterministica, e solo il conteggio lo vede.

- **Il ramo nuovo gira a ogni esecuzione, anche se la pagina è a sei.** Senza,
  sarebbe un controllo scritto e mai eseguito fino a P-05.
  `test_intenzioni_provate_al_contrario` lo fa girare su
  `tests/pagina-quiz-intenzioni.html`, il
  minimo che rispetta il contratto, e su **sedici rotture**, ognuna rossa e con
  il difetto nominato: un'intenzione o una porta in meno, Batteria tenuta come
  sesta accanto al contratto nuovo, e tredici di parametri. R-NAV-07.

  **Provati al contrario anche il banco e la pagina vera.** Quattro controlli del
  banco tolti uno per volta: i primi tre hanno fatto fallire la loro rottura; il
  quarto — contare solo l'ultima chiamata di selezione — **è passato verde**,
  perché nessuna rottura faceva due chiamate. È entrata la sedicesima, i motivi
  della Mirata da una seconda chiamata, e ora lo prende. Sulla pagina di oggi:
  togliere solo Batteria la fa rossa (niente `selezioneQuiz`, `totScreening`
  ancora lì), togliere la simulazione pure, togliere `S.prep` pure.
  L'estrattore, che segue le parentesi saltando stringhe, template, commenti e
  regex, legge tutte e 115 le funzioni di primo livello di `app.html`, e
  ognuna compila da sola.

- **Il regime attuale ha una scadenza:** lo toglie la regia quando integra
  P-05, con il §5 della specifica che descrive ancora Batteria e il selettore
  globale. Suite: motore 131/132 con lo skip di sempre, dati 236, interfaccia
  **183** (erano 135), specifica **274** (erano 270), server 23/23.
  `site/` non è stato toccato.

### Aggiunto — il server, pezzo 1: l'account (P-09)

- **Il server degli account registra, fa entrare, e verifica l'email.** Le
  rotte del §7.1 di `docs/account-progetto.md` da `registrazione` a
  `password/cambia`: accesso, uscita da qui e da tutti i dispositivi, `GET
  /v1/io`, conferma dell'indirizzo e suo rinvio, password dimenticata, nuova e
  cambiata. Argon2id a `m=65536, t=2, p=1`, i parametri del §20, nella stringa
  PHC, con una stringa vecchia che si ricalcola all'accesso riuscito; al più due
  calcoli insieme. La sessione è un cookie `__Host-` opaco, di cui il database
  tiene solo l'impronta, e vale **30 giorni dall'accesso**: l'uso non la
  allunga. I gettoni per email valgono 24 ore la verifica e un'ora la password,
  una volta sola, nel frammento del link. Una richiesta che cambia qualcosa
  passa solo con l'`Origin` del sito e un corpo JSON, e il CORS risponde solo a
  lui. Un account non confermato si cancella al settimo giorno, anche nel file
  delle cancellazioni, e il registro perde l'indirizzo dopo sei mesi e l'evento
  dopo un anno. Lo schema passa a 2 con una migrazione additiva, che un database
  nuovo esegue come uno vecchio. Le righe e la sincronia sono il pezzo dopo, e
  `site/` non è stato toccato.

- **La password: almeno 15 caratteri, nessuna regola di composizione, e non fra
  le comuni.** `strumenti/password_comuni.py` scarica i «ten million passwords»
  di Burnett dal file di SecLists al commit fissato, ne controlla l'impronta, e
  scrive `server/password-comuni.txt`: **10.898 voci, 191.989 byte**, gli stessi
  numeri misurati da P-07. Il README ne dichiara fonte, commit, le due impronte
  e la licenza MIT di SecLists; la suite pretende che il file abbia l'impronta
  che lo script dichiara e che il README la scriva; e il guardiano fallisce se un
  file di `server/` che non è un modulo non è dichiarato con percorso e impronta.
  Il rifiuto dice perché e suggerisce una frase; i caratteri si contano come
  punti di codice, quindi quindici lettere accentate sono quindici.

- **I limiti del §6.5, con i cento tentativi.** Dal quinto accesso fallito di
  fila un'attesa che parte da 30 secondi e raddoppia fino a 15 minuti; al
  centesimo la password si disattiva finché non arriva una reimpostazione, e il
  proprietario lo sa da una mail. Trenta accessi l'ora per indirizzo, cinque
  registrazioni, tre mail l'ora e dieci al giorno per destinazione, seicento
  richieste l'ora per sessione. **Il conto dei fallimenti di un account sta nel
  database**, perché un riavvio non regali altri cento tentativi; quello di
  un'email che non esiste sta in memoria, con le stesse risposte codice per
  codice, così il limite non dice chi è iscritto.

- **Non dire chi è iscritto, e dove non si riesce.** L'accesso sbagliato e
  l'email inesistente danno lo stesso corpo e costano lo stesso calcolo; la
  password dimenticata risponde sempre `202` e manda la mail senza aspettare il
  fornitore. **La registrazione invece lo dice**, per il codice: `201` con la
  sessione per un'email nuova, `202` senza per una già iscritta. È il §9.6 —
  l'account non confermato funziona da subito — contro una frase del §5.3, ed è
  aperto per l'autore nel §20 con tre strade.

- **Nove requisiti con il loro test in `test_server.mjs`.** R-ACC-10 e 11 non
  sono più scoperti, l'11 per la metà del server; entrano R-ACC-16, 17, 21, 25,
  26, e tre nuovi: R-ACC-27 i cento tentativi, R-ACC-28 la password dimenticata,
  R-ACC-29 i gettoni. **Scritti prima: 19 test rossi uno per uno**, con moduli
  vuoti che lanciavano, e i 23 di prima verdi. **Provati al contrario su
  diciotto rotture**, una per volta, ognuna rossa nel suo test — la sessione che
  si allunga con l'uso, niente hash per l'email inesistente, i gettoni in
  chiaro, l'elenco senza minuscole, un gettone che non si consuma, il rifiuto
  del fornitore ignorato, i byte al posto dei caratteri, l'`Origin` non
  guardata, e le altre. **Una è passata verde:** il conto dei fallimenti tenuto
  solo in memoria, perché nessun test riavviava il server. Ora il test dei cento
  tentativi lo riavvia a metà, e quella rottura è rossa.

- **Tre correzioni trovate scrivendo.** I testi per chi legge — le mail e i
  messaggi d'errore — hanno gli accenti veri, non gli apostrofi dei commenti. Il
  limite delle registrazioni conta quelle che costano un hash e una mail, non le
  password rifiutate: chi ne prova cinque troppo corte non resta fuori un'ora.
  Senza la chiave di Scaleway il server parte e lo stampa, e ogni registrazione
  risponde `503` invece di un «ti abbiamo scritto» falso: provato dalla riga di
  comando.

- **Non fatto, per i pezzi dopo:** il cambio d'indirizzo, il profilo,
  l'azzeramento e la cancellazione dal web, che toccano le righe o la
  generazione; gli allarmi al titolare; il fornitore di Scaleway è scritto ma
  **non misurato**, perché la chiave si crea con la messa in esercizio.

  Suite: server **42/42** con Node 25.3 e con la **24.21.0 LTS**, scaricata da
  nodejs.org e verificata con `SHASUMS256.txt` (erano 23); motore 131/132 con lo
  skip di sempre; dati **242** (erano 236); interfaccia 183; specifica **310**
  (erano 274).

### Regole — il CHANGELOG additivo anche per git

- **`CHANGELOG.md merge=union` in `.gitattributes`.** Due rami che aggiungono in
  fondo a `[Unreleased]` fermavano la merge con un conflitto, e chiuderlo a mano
  passa dal `pre-commit`, che su `main` rifiuta i file dell'interfaccia: la
  merge di P-05 si è fermata così, ed è stata annullata senza perdite invece di
  aggirare il recinto. Il driver `union` tiene le righe dei due lati, cioè fa
  per git quello che `AGENTS.md` chiede alle mani. Provato su una copia del repo
  con la merge vera: zero righe perse da una parte e dall'altra. `.gitattributes`
  entra fra le regole in `territori.yaml`. Resta aperto in `Standards`: il
  controllo dei territori non riconosce la chiusura di una merge.

### Aggiunto — il server, pezzo 2: le righe e la sincronia (P-10)

- **Il server accoglie le righe, le restituisce, e sa di un azzeramento.**
  `POST /v1/righe` aggiunge per `uid` con `validaRiga()` del motore e la banca
  accanto — un quesito che non esiste è «quesito sconosciuto», come nel
  browser con la banca in mano —; `GET /v1/righe?dopo=` restituisce le righe
  dopo il cursore, a pagine di 5.000, com'erano arrivate; `GET /v1/esporta` dà
  il file di `esporta()`, che `importa()` ricarica identico; `POST /v1/azzera`,
  con la password, toglie le righe, alza la generazione e lo scrive nel file
  delle cancellazioni prima che nel database. Ogni risposta delle righe dice
  **l'epoca del database e la generazione**; un invio della generazione di
  prima riceve `409` e **non scrive niente**. Nessuna migrazione: le tabelle
  c'erano dal P-03. Il codice sta in `server/righe.mjs`; `site/` non è stato
  toccato fuori dal motore.

- **La contabilità della coda è nel motore, dove un test la raggiunge.** Sei
  funzioni pure in `site/engine.js` — `nuovaCoda`, `accoda`, `lottoDaInviare`,
  `dopoInvio`, `dopoRicezione`, `risolviConflitto` — su una coda che si salva
  accanto all'archivio. Tre regole: una riga esce dalla coda solo se il server
  la nomina, mai «tutto tranne le scartate», che è la forma della 0.4.6; **il
  cursore lo sposta solo la ricezione**; un `409` non rimanda e non butta, e
  dice quante risposte non sono salvate. Un'epoca cambiata — un ripristino —
  azzera il cursore e rimette in coda tutto l'archivio. L'epoca del database si
  chiama `epocaDb`: `epoca(ts)` nel motore è un istante. Le funzioni aspettano
  il client degli account, e intanto sono dichiarate fra gli orfani.

- **Una trappola trovata scrivendo il contratto:** l'`ultima_seq` di un invio
  è l'ultima riga dell'account, comprese quelle di un altro dispositivo arrivate
  nel frattempo. Un client che ci spostasse il cursore le salterebbe per sempre,
  senza un errore: il cursore su `ts` del §2.3 per un'altra strada. Ora è un
  requisito, R-ACC-31, con il suo test.

- **Una trovata misurando:** il primo `413` rispondeva senza leggere un corpo
  dichiarato troppo grande e chiudeva la connessione, e il client riceveva
  `ECONNRESET` — un errore di rete, non un messaggio da leggere. Ora il corpo
  oltre il limite scorre senza essere tenuto, e il `413` arriva. I limiti,
  2.000 righe e 2 MiB, il server li importa dal motore, lo stesso file con cui
  il client prepara il lotto.

- **Otto requisiti entrano con il loro test**, e R-ACC-24 passa da coperto per
  metà a coperto per intero: R-ACC-12, 13, 14, 15 e 18 dal progetto, e tre
  nuovi, R-ACC-31, 32 e 33. **Scritti prima: 11 test del motore e 10 del
  server rossi uno per uno**, i 42 di prima verdi. **Provati al contrario su
  tredici rotture**, una per volta — «tutto tranne le scartate», l'invio che
  sposta il cursore, il `409` che butta la coda, il lotto che ignora i byte, il
  server che non guarda la generazione, la riga ricostruita dalle colonne, il
  cursore in memoria, la pagina che dice l'ultima riga dell'account, il server
  senza la banca, l'azzeramento senza password, le righe ricevute che restano
  da inviare, e l'epoca ignorata inviando o ricevendo. **Due sono passate
  verdi sul test del server**, le ultime due: con due dispositivi lo scenario
  ne esercitava una sola per volta. Ora i dispositivi sono tre, due la scoprono inviando e uno solo
  ricevendo, e tutte e tredici le rotture sono rosse. Il test del riavvio tiene
  fermi cursore, generazione ed epoca nel database.

  Suite: server **52/52** con Node 25.3 e con la **24.21.0 LTS**, scaricata da
  nodejs.org e verificata con `SHASUMS256.txt` (erano 42); motore **142/143**
  con lo skip di sempre (erano 131/132); dati 242; interfaccia **201** (erano
  183); specifica **344** (erano 310).

### Realizzato — P-05, le cinque intenzioni dei Quiz

- **Quiz distingue consiglio, argomenti, errori, simulazione e giro**, perché
  scegliere un'attività non richieda di conoscere sei algoritmi. Batteria
  confluisce in tutti gli argomenti; le righe storiche rimangono leggibili.
  Filtri e bozze sono locali all'attività e in memoria. Anteprima e avvio
  aprono lo stesso snapshot; fonte o giorno cambiati richiedono un nuovo click.
  Il giro usa `lunghezzaScreening` dalla banca, senza contabilità in pagina.
  Base e vela si preparano prima dell'avvio, con due timer ed esiti separati.
  Restano visibili i guasti di archivio e offline; ritorni e focus conservano
  l'origine Percorso/Progressi. Nessuna modifica al motore o ai suoi test.

- **Verificato:** motore 130/132 (2 skip previsti delle copie UI rimosse),
  dati 236, interfaccia 277, specifica 274; server 23/23 su Node 25 e 24 LTS.
  Altri 35 controlli in memoria su snapshot, vuoti, guasti e tempi. Collaudo
  guardato a 375 e 1280 px, senza overflow; target almeno 44 px e contrasto
  minimo misurato 5,16:1. Provate nel browser entrambe le fasi e i ritorni.
  [Evidenze e limiti](docs/area-2-collaudo-ux.md): reflow equivalente al 200%,
  prova con persone ancora all'autore, e caso dell'orologio senza timestamp
  riprodotto per la regia. Versione invariata, nessun tag o push.

### Aggiunto — il server, pezzo 3: quello che chiude le rotte (P-11)

- **«Questa email è già registrata», con `409`.** Deciso dall'autore: la
  registrazione lo dice apertamente, senza sessione, senza mail e senza un
  hash che non serve più. Prima rispondeva `202` con la stessa frase di un'email
  nuova e mandava al proprietario una mail «hai già un account»: nascosto nella
  schermata, detto dal codice di risposta, cioè il peggio delle due cose. **Il
  freno che resta è l'ordine dei controlli:** la password si guarda per prima e
  un rifiuto non conta; poi le cinque registrazioni l'ora per indirizzo, che il
  `409` consuma; solo dopo l'email. Chi vuole l'elenco degli iscritti lo paga
  un posto l'ora. R-ACC-30, da scoperto a coperto.

- **Il cambio d'indirizzo, il profilo, la cancellazione.** `POST
  /v1/email/cambia` chiede la password e un indirizzo già confermato; l'indirizzo
  cambia solo quando il nuovo apre il suo link, entro 24 ore, con una rotta sua,
  `POST /v1/email/conferma`. Il vecchio riceve un avviso che dice verso dove, e
  il rimedio che l'avviso suggerisce **funziona**: una password cambiata o
  reimpostata annulla la richiesta in sospeso. `PUT /v1/profilo` tiene la data
  d'esame, facoltativa, e i punteggi dei Segnali fusi con il massimo — rimandarli
  non cambia niente, dove `importa()` oggi somma le partite —, e non scrive a
  metà: un campo rotto non lascia scritti gli altri. I modi e il punteggio
  massimo vengono dal motore. L'export porta `segPunti`, che P-10 aveva lasciato
  fuori. `DELETE /v1/account` cancella con la password, passa dal file delle
  cancellazioni e manda una mail che lo conferma. Lo schema passa a 3 con la
  tabella `segnali`, additiva.

- **Una cancellazione non cancellava davvero, e nessun test lo vedeva.**
  Misurato scrivendo il controllo di R-ACC-19, che cerca l'email nei byte e non
  nelle righe: con `secure_delete` la pagina si azzera, ma il database è in WAL,
  e la versione di prima — email e risposte leggibili — restava nei frame vecchi
  del `-wal`. **Anche dopo un checkpoint normale**, che copia le pagine azzerate
  nel file e lascia il `-wal` com'è; sparisce solo con
  `wal_checkpoint(TRUNCATE)`. Ora lo fanno ogni cancellazione e ogni
  azzeramento, e il lavoro quotidiano come rete. Valeva anche per gli account
  non confermati che P-09 cancella al settimo giorno.

- **I due anni.** A 700 giorni senza attività parte l'avviso con la data; la
  cancellazione arriva **trenta giorni dopo l'avviso**, non a 730 esatti, così
  un lavoro quotidiano rimasto fermo non cancella nessuno senza averlo avvisato.
  Un avviso rifiutato dal fornitore non conta come partito. Qualunque attività
  — anche solo un accesso — fa decadere l'avviso; il suo segno sta nel database.

- **Gli allarmi al titolare, letti dal registro** (`server/allarmi.mjs`, ogni
  ora): cento accessi falliti in 24 ore o una password disattivata, una copia
  con meno righe senza cancellazioni che lo spieghino — `server/copia.mjs` ora
  scrive il suo esito nel registro del database vivo, perché un allarme che
  resta nell'uscita di un comando non lo legge nessuno —, una mail rifiutata, e
  le 300 mail del mese: un avviso, **mai un blocco**. Ogni allarme è una riga
  del registro, e da lì si sa che cosa è già stato detto: un riavvio non lo
  ripete e non lo perde. La mail al titolare dice che cosa e quanto, **senza
  email né indirizzi IP**, perché la sua casella oggi è un inoltro verso Gmail.
  Una mail al titolare rifiutata non è un allarme a sua volta, altrimenti
  ricomincerebbe a ogni giro. La soglia di 100 è una proposta, da rivedere sul
  registro vero. Il titolare si configura con `RG_TITOLARE`.

- **Sette requisiti con il loro test**: R-ACC-19 e 30, e cinque nuovi, R-ACC-34
  il cambio d'indirizzo, 35 il profilo, 36 i due anni, 37 gli allarmi, 38 le
  300 mail. **Scritti prima: otto test rossi uno per uno** — i sette più quello
  della migrazione, che ora pretende la tabella `segnali` —, ognuno per la
  funzione che mancava, e i 50 di prima verdi. Dove lo stato potrebbe vivere in
  memoria il test riavvia il server a metà. **Provati al contrario su
  ventisei rotture**, una per volta, tutte rosse nel loro test: fra le altre il
  `409` che non conta nel limite, il cambio senza conferma dell'indirizzo
  attuale, la password cambiata che non chiude la richiesta, i punteggi sommati,
  il checkpoint `PASSIVE` al posto di `TRUNCATE`, la cancellazione senza il file,
  l'avviso che un accesso non fa decadere, gli allarmi ricordati in memoria
  invece che nel registro, il rifiuto al titolare che diventa un allarme, il
  blocco dopo la trecentesima. **Una rottura non era quella che diceva di
  essere:** «allarmi in memoria» era scritta male e toglieva la memoria del
  tutto, doppione di un'altra; rifatta come una mappa che vale fino al riavvio,
  in due varianti, tutte e due rosse sull'asserzione dopo il riavvio.

- **Non fatto:** l'onboarding e le schermate sono del client; che una mail
  d'avviso arrivi davvero, e non rimbalzi, il server non lo vede; il giro delle
  copie due volte al giorno è della messa in esercizio.

  Suite: server **58/58** con Node 25.3 e con la **24.21.0 LTS**, scaricata da
  nodejs.org e verificata con `SHASUMS256.txt` (erano 52); `ripristina --prova`
  20/20; motore 141/143 con i due skip di sempre; dati 242; interfaccia 295;
  specifica **370** (erano 344).


### Progettato — P-13, il client degli account

- **[Progetto del client](docs/account-client-progetto.md): flussi, stati e
  testi prima del codice**, per rendere verificabile la promessa dell'ADR-004:
  tutte le attività senza account, niente conservazione automatica, account
  per salvare e vedere i Progressi. Registrazione dopo il riepilogo, accesso
  con scelta sulle risposte correnti, email già registrata, verifica e
  recupero, uscita con righe pendenti, passaggio del vecchio archivio,
  conversione dei file e data facoltativa. Le sei funzioni della coda restano
  nel motore; la pagina consuma risultati, non ricostruisce la contabilità.

- **Diciotto gruppi di controlli richiesti a Claude su main**, distinti dai
  controlli già esistenti di motore/server: storage anonimo, trasferimenti,
  scadenza email visibile, isolamento fra account e schede, scarti, cursore,
  azzeramento e ripristino. I contratti P-11 ancora assenti nella base letta
  sono prerequisiti dichiarati, non successi simulati dal client. Q-ONBOARD
  resta all'autore; il passo minimo della data è già specificato e saltabile.

- **Verificata la base:** motore **141/143**, con i due skip previsti delle
  copie UI rimosse; dati **242**; interfaccia **295**; specifica **344**;
  server **52/52** sia con Node 25.3.0 sia con **24.21.0 LTS**, dal pacchetto
  con SHA-256 confrontato con `SHASUMS256.txt`. Controllo documentale condiviso
  verde. Le suite dati/server sono state rieseguite con permesso per le loro
  connessioni HTTP locali, negate dalla sandbox al primo tentativo. Solo
  progetto e CHANGELOG: nessuna modifica a `site/`, test, versione o coda
  delle sessioni; nessuna prova di un client ancora da realizzare, tag o push.

## [0.27.0] — 2026-09-25

### Verificato — la v0.26.2 sul dominio vero

- **Le figure offline sopravvivono a un rilascio, misurato dove conta.** La
  v0.26.1 lasciava questa misura preparata e non fatta. In un browser su
  `rottagiusta.it` con la v0.26.1 e `rg-0.26.1` a 122 voci, 102 figure: pubblicata
  la v0.26.2 (push, «Build now»), alla prima ricarica la cache è già
  `rg-0.26.2` con **122 voci e 102 figure, senza un secondo scaricamento**, e Info
  scrive «diverse: ricarica due volte»; alla seconda la pagina è v0.26.2, «Pronto
  per l'offline … figure 102/102», zero byte dalla rete, zero voci rediritte.

- **La privacy nuova arriva a chi ha il guscio installato.** Il `/privacy` in
  cache dopo le due ricariche è quello del 25 settembre, nomina statichost.eu e
  non nomina Cloudflare. Servita dal dominio: 200, zero salti, anche su
  `/privacy.html`.

### Aggiunto — la fase D comincia con un avviso

- **Aperte su un indirizzo che non è `rottagiusta.it`, palestra e vetrina lo
  dicono.** La palestra mette in cima al Percorso l'avviso del trasloco, con
  «Scarica i progressi» e il link alla palestra nuova; la vetrina mostra una
  striscia e manda «Inizia subito» e le tessere a `rottagiusta.it/app`. In
  locale non scatta. R-STA-09, `test_trasloco`, scritto prima: 13 verifiche,
  rosse finché l'interfaccia non c'era.

  **Perché prima del redirect, e non al suo posto.** Misurato su un server di
  prova: con un 301 su tutto, chi ha la palestra installata continua ad aprirla
  dalla cache e il service worker non si aggiorna più — *«The script resource is
  behind a redirect, which is disallowed»*, solo in console. Resterebbe per
  sempre sull'indirizzo vecchio, con i progressi lì, senza saperlo. È il guasto
  muto nella sua forma più pulita, e sarebbe arrivato da un gesto che sembra
  innocuo. La versione che resta congelata è quella che c'è in quel momento:
  quindi l'avviso esce adesso, Pages resta acceso qualche settimana, e il
  redirect viene dopo. Il piano è in `docs/migrazione-hosting.md`.

  Guardato nel browser: in casa niente avviso e dieci tessere su `/app`; fuori
  casa la striscia e i link riscritti; l'avviso della palestra a 375 px, primo
  degli stati, link di 44 px, nessuno sbordamento.

## [0.26.2] — 2026-09-25

### Verificato — la v0.26.1 sul dominio vero

- **La v0.26.1 è su `rottagiusta.it`**, con «Build now» su statichost.eu dopo il
  push: `curl` legge `CACHE = 'rg-0.26.1'` e `versione: 0.26.1`. Nel browser della
  fase B, alla prima ricarica la pagina è ancora v0.26.0 con la cache già
  `rg-0.26.1`; alla seconda è v0.26.1, e il service worker attivo è quello che
  porta avanti le figure.

- **Il passaggio 0.26.0 → 0.26.1 non dimostra la correzione, e lo si dichiara.**
  Alla prima ricarica `rg-0.26.1` aveva 19 voci e **zero figure**. Non è la copia
  che fallisce: con ogni probabilità `rg-0.26.0` di figure non ne aveva, perché le
  aveva già perse al rilascio 0.26.0 — è la misura da cui è nata la correzione —
  e nessuno le aveva riscaricate. Ma è una deduzione: la cache vecchia era già
  cancellata e non si può più guardare. Sul dominio, quindi, la correzione resta
  **non misurata**; la tengono ferma i tre test e il ciclo in locale con lo
  stesso `sw.js`.

- **La misura vera è preparata.** Sul dominio, sotto la 0.26.1, «Scarica tutto per
  l'offline»: `rg-0.26.1` con **122 voci, 102 figure, nessuna rediretta**, e Info
  scrive «Pronto per l'offline … figure 102/102». Al prossimo rilascio, in quello
  stesso browser, due ricariche: se Info scrive ancora «figure 102/102» senza un
  secondo scaricamento, la correzione è verificata dove conta.

### Migrazione dell'hosting — fase C, la parte di `main`

- **`strumenti/serve.py` riproduce statichost.eu, e un test pretende che lo
  faccia.** Riproduceva i 308 di Pages, che sul nuovo host non esistono: in
  locale `/privacy.html` rimandava a `/privacy`, in produzione risponde 200.
  Simulare un redirect che la produzione non fa è la divergenza locale/produzione
  girata al contrario — lo stesso difetto che ha lasciato arrivare la 0.19.1.
  Le regole sono quelle **misurate** su `rottagiusta.it`: nessun redirect in
  nessuna direzione, il file con l'estensione servito anche lui, una cartella è
  404 (dove `http.server` elencava i file), il 404 è testo semplice, e il
  `Cache-Control` viene da `site/_headers` invece di essere scritto nel codice.

  **`test_serve` è stato scritto prima**, e sul `serve.py` vecchio dava **12
  rossi**, uno per differenza vera: i quattro 308, l'elenco di `/figure/` servito
  come pagina, il 404 in HTML, l'header mancante, il docstring. Dopo: 221
  verifiche sui dati (erano 199). R-ARCH-12 nella specifica. Guardato anche nel
  browser: app servita da `serve.py`, service worker attivo, 19 voci poi 122 con
  le figure, nessuna rediretta, «Pronto per l'offline» — gli stessi numeri
  misurati sul dominio.

- **La regola degli indirizzi puliti sopravvive al suo motivo, e ora lo dice.**
  Era spiegata dal 308 di Pages in cinque posti — `AGENTS.md`, la specifica,
  `sw.js`, i due test. statichost.eu serve entrambe le forme, quindi il guasto
  della 0.19.2 lì non può succedere; la regola resta perché è lei che rende il
  sito indifferente all'host. Scritto così, fra sei mesi nessuno la «semplifica»
  pensando che il motivo sia sparito.

- **«Un push pubblica il sito» non è più vero**, e stava in `AGENTS.md`, nella
  specifica e nella skill. Su `rottagiusta.it` pubblica «Build now»: il repo non
  ha un webhook. La chiusura di un rilascio ha ora il passo in più, con il
  `curl` che dice se è arrivato.

- `README.md`, `AGENTS.md`, la specifica e la skill nominano statichost.eu come
  host. Cloudflare resta solo dove è storia, al passato. `site/privacy.html` e i
  commenti di `app.html` e `_headers` sono dell'interfaccia: arrivano da
  `ui/main`.

- **La privacy nomina statichost.eu** (da `ui/main`, scritta da Claude con
  ChatGPT fermo). Diceva che Cloudflare tiene i log degli IP come titolare
  autonomo; ora riporta quello che dichiara l'informativa di statichost.eu — IP
  usato solo per consegnare le pagine, non conservato, nessun terzo, UE — con il
  link. Guardata nel browser: zero sbordamento, link con il loro stile.

  **Resta aperto, ed è scritto nel documento di migrazione:** statichost.eu dice
  di non essere responsabile del trattamento per i siti che ospita e offre un
  DPA da firmare. Il paragrafo «Cosa non c'è», che afferma che l'autore non
  tratta dati personali, è rimasto com'era: è un giudizio giuridico, da far
  rileggere a chi può darlo, non una misura. E finché `.pages.dev` è acceso la
  privacy letta lì descrive un host che non è quello che la serve.

## [0.26.1] — 2026-09-25

### Migrazione dell'hosting — la fase B misurata

- **Sul dominio vero il service worker regge, e la regola delle due ricariche è
  misurata invece che dichiarata.** Prima visita su `rottagiusta.it` in un
  browser che non l'aveva mai visto: 19 voci in cache uguali al `GUSCIO`, 122 con
  le figure, **nessuna rediretta**; a pagina ricaricata **zero byte** dalla rete.
  Poi il rilascio v0.26.0 usato come versione da prendere: alla prima ricarica la
  pagina è ancora v0.25.0 con la cache già `rg-0.26.0`, e Info lo scrive da sola;
  alla seconda è v0.26.0. Sei criteri di accettazione su otto: restano i due
  della fase C, che tocca il repo.

- **Un push non arriva a statichost.eu.** Nessun webhook sul repo: la build parte
  solo con «Build now». Finché Pages e statichost.eu convivono, le due produzioni
  possono servire versioni diverse senza che niente lo dica — il rilascio ha un
  passo in più, e va deciso alla fase D se automatizzarlo.

- **Trovato misurando, e fuori da questa migrazione:** le 102 figure scaricate
  per l'offline **si perdono a ogni rilascio**, perché l'`activate` di `sw.js`
  cancella la cache versionata che le contiene. Non è muto — il pallino ambra si
  accende — ma costa un nuovo scaricamento a chi studia senza rete. Aperto come
  attività separata.

### Corretto — le figure offline sopravvivono a un rilascio

- **Le 102 figure scaricate per l'offline non si perdono più a ogni rilascio.**
  Misurato sul dominio vero durante la fase B: `rg-0.25.0` con 122 voci e
  «figure 102/102», poi la v0.26.0 e due ricariche, e l'unica cache era
  `rg-0.26.0` con 19 voci e «figure non scaricate». L'`activate` di `sw.js`
  cancellava ogni cache diversa da quella corrente, e le figure ci stavano
  dentro. Non era muto — pallino ambra, riga Offline — ma non era dichiarato da
  nessuna parte, e chi studia in barca lo scopriva senza rete.

  Ora l'`activate` **copia le figure dalla cache vecchia a quella nuova** prima
  di cancellarla. Solo le figure: sono l'Allegato A e non cambiano, mentre banca
  e pagine si riprendono dalla rete all'install, perché quelle cambiano. Una
  copia fallita non lascia in piedi la cache vecchia: le figure che mancano le
  conta l'autodiagnosi, in ambra.

  **Perché non una cache a parte, non versionata**, che era l'idea di partenza:
  i punti che leggono la cache — la versione in Info, l'autodiagnosi,
  `scaricaTutto()` — la cercano con `startsWith('rg-')` e **prendono la prima**.
  Una seconda cache col prefisso li avrebbe confusi in silenzio, a seconda
  dell'ordine di creazione; una senza prefisso avrebbe rotto R-ARCH-08.
  Portandole avanti la cache resta una, e `site/app.html` non si tocca: il lavoro
  sta tutto in `sw.js`, che è condiviso, e non serve fermare nessuno su `ui/*`.

  **Verificato nel browser, sul ciclo vero**, con una copia di `site/` servita da
  `serve.py`: il `sw.js` pubblicato (v0.26.0), le figure scaricate col pulsante,
  un rilascio finto 0.26.1 **col `sw.js` vecchio** — difetto riprodotto, 19 voci
  e «figure non scaricate» — poi di nuovo le figure, e un rilascio 0.27.0 col
  `sw.js` corretto. Alla prima ricarica la pagina è ancora v0.26.1 con la cache
  già `rg-0.27.0` a **122 voci**; alla seconda Info scrive «v0.27.0 · cache
  offline rg-0.27.0» e «Pronto per l'offline … figure 102/102», zero risposte
  redirette, `figura-007.png` di 2.056 byte come nel repo, e una figura aperta
  con `transferSize 0` servita dal service worker. Un secondo rilascio,
  0.27.0 → 0.27.1, fra due `sw.js` corretti: ancora 122 voci e 102/102. Console
  vuota.

  **Vale dal primo rilascio che contiene questo `sw.js`**: la copia la fa il
  service worker nuovo, quindi chi passa dalla 0.26.0 alla successiva tiene le
  figure; chi le ha perse passando alla 0.26.0 le riscarica una volta.

### Test — le figure offline

- **Tre test nuovi eseguono `sw.js` com'è pubblicato**, sotto `node:vm` contro
  una Cache Storage finta, con install e activate come dopo un rilascio: le 102
  figure (lette dall'indice vero) passano alla cache nuova e la cache resta una;
  passano solo le figure, non `quiz.json` né un file della banca fuori dal
  guscio; e senza figure scaricate il rilascio non ne inventa. **128 test sul
  motore** (erano 125), 226 verifiche sulla specifica (erano 218) con R-ARCH-10
  e R-ARCH-11; 199 sui dati e 121 sull'interfaccia invariate.

  Scritti prima della correzione, e rossi per la ragione misurata sul dominio:
  «le figure in cache sono 0, non 102». **Provati al contrario tre volte:**
  la copia tolta → 2 rossi; il filtro sulle figure tolto → 1; filtro e controllo
  dei doppioni tolti insieme → 1. E una volta il test ha mancato un guasto, ed è
  il motivo della sua forma attuale: la prima stesura non si accorgeva che
  togliere il filtro portava avanti tutto, perché le voci del guscio sono già
  nella cache nuova e la copia le salta comunque. Ora c'è anche un file della
  banca **fuori** dal guscio, che l'install non riscarica.

## [0.26.0] — 2026-09-25

### Spostato

- **`lunghezzaScreening()` entra nel motore: quante domande apre lo screening lo
  dice chi costruisce la lista.** Il numero sul pulsante veniva da `totScreening`
  in `app.html`, che lo calcolava dai conteggi dichiarati in `meta.json`; la
  lista la costruisce `screening()`, che conta la banca. **Due conti della stessa
  cosa, in due file, da due fonti diverse** — la firma del difetto tornato tre
  volte qui dentro (0.13.3, 0.16.0, e la 0.19.2 con i Segnali che promettevano
  10 domande e ne servivano 8).

  **Il numero non è cosmetico**, ed è misurato sulla banca pubblicata: tre voci
  del decreto hanno **un quesito solo**, quindi il minimo morde. A 2 per voce lo
  screening apre **85** domande e non 88, a 3 ne apre **126** e non 132, a 6 ne
  apre **249** e non 264. Il commento sopra `totScreening` la ragione la diceva
  già; era il posto a essere sbagliato.

  **Due cose trovate misurando, e sono il motivo per cui nessuno se n'era
  accorto.** La prima: `test_meta` verifica i totali — 1.472, 250, 44 voci — ma
  **non confronta i conteggi voce per voce** fra `meta.json` e la banca. I due
  numeri coincidono su tutte e 47 le voci, verificato oggi, ma non c'era niente
  che lo pretendesse: coincidevano e basta. La seconda: i test che c'erano non
  potevano prendere il difetto, perché `bancaVera()` costruisce cinque voci per
  tema da almeno venti quesiti l'una — lì il minimo non morde mai e
  `perVoce × voci` è giusto per caso. I test nuovi leggono la **banca vera**.

  Il test di compatibilità con la pagina, finché la copia esiste, fa anche il
  lavoro che mancava: confronta il conto da `meta.json` con quello dalla banca,
  quindi **pretende che i due coincidano voce per voce**. Quando l'interfaccia
  passerà a `E.lunghezzaScreening()` la copia sparirà e il test si metterà da
  parte da solo, come già fatto per `daAllenare()`.

  **La pagina non è stata toccata, ed è il recinto a volerlo:** `site/app.html` è
  dell'interfaccia, questo commit è su `main`. Il ricablaggio lo fa chi rifà la
  schermata dei quiz — **area 2**, dove lo screening viene rinominato — e fino ad
  allora la funzione è dichiarata in `docs/eccezioni-interfaccia.md`.

### Aggiunto

- **`docs/migrazione-hosting.md`: la proposta di attività per portare
  `rottagiusta.it` su statichost.eu**, scritta perché la faccia una sessione
  dedicata. Dentro ci sono le misure del 25 settembre sul sito di prova con il
  contenuto reale caricato, e la correzione che le misure hanno imposto: **non
  serve nessun `_redirects`**. statichost.eu fa gli indirizzi puliti da sé *e*
  serve anche il file con l'estensione — il test che discrimina è `/index`, che
  non sta in nessuna regola e risponde 200.

  Il 10 settembre era stato concluso il contrario, e l'errore è istruttivo: la
  misura era stata fatta sul sito **di statichost**, strutturato a cartelle, e da
  `/index.html` → 200 si era dedotto «niente indirizzi puliti». Una deduzione da
  un'osservazione, che è esattamente ciò che questo progetto vieta.

  Conseguenza: la migrazione costa **zero righe** di codice nuovo. Restano da
  riallineare i punti che dichiarano Cloudflare e diventerebbero falsi — undici
  fuori dal CHANGELOG, in **tre territori diversi**, e quello che pesa di più è
  `site/privacy.html`, che nomina Cloudflare come titolare autonomo dei log.

### Deciso

- **ADR-002: il recupero dei progressi si fa con una frase, non con un account.**
  L'archivio è una copia sola e chi cambia telefono perde tutto: è il difetto più
  grave del prodotto verso chi lo usa, ed è una conseguenza scelta
  dell'architettura. La riparazione adottata è la **frase di recupero con
  archivio cifrato nel browser**: il server conserva un identificatore e un
  blocco di byte che **non può decifrare**.

  Scartato l'account con email e password, che otterrebbe la stessa cosa ma
  lascerebbe addosso indirizzi email di persone reali, l'archivio in chiaro, un
  fornitore di posta in più e un flusso di reset che fallisce in silenzio quando
  le email vanno in spam.

  **Non introduce una seconda contabilità**, ed è l'obiezione che conta: il
  blocco cifrato non è una fonte di verità, è una fotografia. Il motore non lo
  legge mai, non si fonde da solo, e rimetterlo dentro passa da
  `fondiArchivio()`, la porta che esiste già e che dichiara quante righe prende,
  quante aveva e quante scarta. Non è sincronia: è il file di export parcheggiato
  da qualche parte. Cade il solo Vincolo «nessun backend», nella forma più
  stretta: un endpoint che accetta e restituisce byte opachi.

  Conseguenza da non dimenticare: `site/privacy.html` oggi dichiara che «non
  esiste un server che li riceva», e quel giorno diventerebbe **falsa**.

### Test

- **125 test sul motore** (erano 121) e **121 verifiche sull'interfaccia**; 199
  sui dati e 218 sulla specifica invariate nel numero, più R-SEL-11.

  **Provati al contrario tre volte**, rompendo il motore apposta: il conto
  ingenuo `perVoce × numero di voci`, il massimo al posto del minimo, e il filtro
  per banca tolto. Tutte e tre le volte **tutti e quattro** i test nuovi
  diventano rossi.

### Progettato — il recupero con una frase

- **`docs/recupero-progetto.md`: le quattro scelte che l'ADR-002 aveva lasciato
  aperte**, più il testo della schermata che viene prima della frase. Niente
  codice: l'interfaccia è in ridisegno. Frase BIP-39 italiana da 128 bit;
  HKDF-SHA256 nativo e **niente derivazione lenta**, perché la frase è generata e
  non scelta — e la condizione è scritta, perché è quella che qualcuno
  toglierebbe; il blocco è **il file di export, identico**, quindi il ripristino
  passa da `importa()` e non da una porta nuova; un endpoint su un'origine sua
  che **rifiuta la scrittura cieca** (`428` senza precondizione, `412` su un
  blocco non visto), cioè il telefono nuovo e vuoto che copre mesi di risposte
  non può succedere.

  **Tre misure l'hanno orientato.** statichost.eu serve solo file statici, per
  sua documentazione: l'endpoint deve stare altrove. `sw.js` ignora già le
  richieste verso altre origini (riga 91), quindi un'origine separata tiene il
  backup fuori dal gestore cache-first senza una riga nuova. E una preparazione
  completa — 2.100 risposte, righe sintetiche nella forma vera — pesa **47 KB**
  compressa, 22,7 byte a risposta: il tetto proposto di 2 MiB ne tiene circa
  90.000.

  **Sette file dichiarano oggi che un server non esiste**, e sono elencati: fra
  questi `docs/filosofia.md`, che fonda un argomento intero su quella frase.

### Migrazione dell'hosting — il dominio punta a statichost.eu

- **`rottagiusta.it` è servito da statichost.eu**, con Cloudflare Pages ancora
  vivo accanto: è la rete di sicurezza della fase A, e la fase D (lo spegnimento)
  resta ultima e separata. Record IONOS: `A 95.217.26.94`,
  `AAAA 2a01:4f9:c01f:8002::`, `CNAME www`; la posta non è stata toccata, e lo si
  è verificato su due resolver pubblici. Due certificati Let's Encrypt, emessi da
  soli pochi minuti dopo il cambio.

  **Perché A/AAAA e non l'ALIAS che statichost.eu chiede:** IONOS non lo offre sul
  dominio nudo. Gli indirizzi sono quelli della loro documentazione, non quelli a
  cui risolveva il loro nome quel giorno — erano diversi, ed entrambi servivano
  il sito. Il prezzo è scritto nel documento: se spostano il server, i due record
  si aggiornano a mano.

  **La passata con `curl` sul dominio vero ripete quella del sito di prova**, riga
  per riga: zero salti su ogni percorso, file identici byte per byte a quelli
  pubblicati, `sw.js` in `no-cache`. Tre cose trovate facendola, tutte in
  `docs/migrazione-hosting.md`: `www` risponde **302** mentre il pannello dice
  301; statichost.eu manda HSTS con `includeSubDomains` sul dominio dell'autore;
  e la colonna Pages della tabella di riferimento aveva **due caselle scritte e
  non misurate** — su Pages un indirizzo inesistente risponde 200 con la
  vetrina, non 404, perché `site/` non ha un `404.html`. Una tabella di confronto
  con metà colonna dedotta è lo strumento che rassicura in forma di documento.

  **Non misurato, e dichiarato:** l'IPv6, perché il Mac da cui si è misurato non
  ne ha. E la prima ora dopo il cambio non si misura dal Mac senza forzare
  l'indirizzo: la cache DNS di sistema tiene il parcheggio per il TTL intero, e
  chi non lo sa conclude che il certificato non c'è.


## [0.25.0] — 2026-09-25

### Aggiunto

- **Tre controlli che tengono fermo quello che c'è già**, nati dalla richiesta di
  ChatGPT di «registrare per ogni area i comportamenti esistenti da preservare».
  La richiesta è giusta e la forma no: una lista dentro un prompt è una regola da
  ricordare, e questo progetto le sostituisce con controlli che git esegue.

  **`test_chiamate_al_motore_preservate`** è il gemello del controllo sugli
  orfani, dall'altro lato: quello prende una funzione esportata che nessuno
  chiama, questo prende **una funzione che la pagina chiamava e non chiama più**.
  È il caso `peggiori()`, che nella merge della nuova Rotta è uscita dal prodotto
  senza che nessuno lo decidesse e che il controllo esistente ha trovato **dopo**
  la fusione. Sono 33 nomi, e trovarli ha richiesto una misura: cercare `E.nome(`
  con la parentesi ne perde tre, perché `E.SEGNALI` è una costante ed `E.estrai`
  ed `E.estraiNuoviPrima` viaggiano **come valore** dentro `componiProva()`.

  **`test_testi_leggibili`** rifiuta un `font-size` sotto gli 11 px. Otto regole
  oggi lo violano e sono dichiarate una per una con l'area che le corregge; la
  peggiore è `.brand-tag`, il payoff sotto il marchio, a **8 px e a 6 px sotto i
  650 px** — cioè sul telefono, che è il contesto d'uso primario dichiarato.

  **`test_alt_di_contenuto`** rifiuta un `alt` generico. Ce n'è uno solo, ed è
  quello che conta: `alt="figura"` sull'unica riga che inserisce le 102 figure
  del decreto. Per chi usa un lettore di schermo **119 quesiti restano senza il
  proprio contenuto**. `alt=""` resta corretto per le tre immagini decorative.

  I difetti provengono da un audit di accessibilità del 12 settembre 2026; i due
  più gravi sono stati riverificati sul codice prima di dichiararli.

  **Le eccezioni stanno fuori dai test, in `docs/eccezioni-interfaccia.md`**, che
  è neutro. Non è pignoleria: a togliere un'eccezione è chi corregge il difetto,
  e chi corregge l'interfaccia lavora su `ui/*`, dove `tests/` è precluso.
  Tenendole dentro la suite, una correzione avrebbe lasciato il rosso a chi non
  poteva spegnerlo — il controllo si sarebbe trasformato in un ostacolo invece
  che in una conversazione. Provato nelle tre direzioni: riga tolta senza
  correggere → rosso che nomina il difetto; difetto corretto con la riga rimasta
  → rosso che nomina l'eccezione obsoleta; corretti entrambi → verde.

  **Provati al contrario quattro volte**, e ognuno nomina il colpevole: una
  chiamata al motore che sparisce, un `font-size` a 9 px non dichiarato, un `alt`
  generico nuovo, e una dichiarazione che resta dopo che il difetto è stato
  corretto — perché un'eccezione che non serve più nasconde la prossima.

- **«Il nostro impegno», in apertura di `docs/filosofia.md`.** Una riga sola —
  *creare una palestra onesta e sicura per chi si prepara a questo esame* — che
  raccoglie in una promessa quello che il resto del documento già diceva per
  esteso: la verità anche quando è scomoda, i dati che restano nel browser.
  Su richiesta esplicita dell'autore, ispirata a una frase vista sul sito di
  Apple.

- **Le due liste che restavano nei test escono anche loro, e il controllo sugli
  orfani diventa simmetrico.** Il 12 settembre le eccezioni sui font sono state
  spostate in `docs/eccezioni-interfaccia.md`, che è neutro, con la ragione
  scritta accanto: *a togliere un'eccezione è chi corregge il difetto, e chi
  corregge l'interfaccia lavora su `ui/*`, dove `tests/` gli è precluso.*
  `ORFANI_DICHIARATI` e `CHIAMATE_AL_MOTORE` sono rimaste dentro `tests/` — cioè
  la lezione è stata applicata a un controllo su tre, e il commento che diceva
  «le eccezioni dichiarate stanno FUORI da qui» aveva le due liste tre righe
  sopra di sé.

  **Il costo si è visto tre giorni dopo, e non era teorico.** La sessione che
  realizza l'area 1 si è fermata senza toccare niente: il progetto le impone di
  chiamare `E.ritmo()`, e `nuove = trovate - CHIAMATE_AL_MOTORE` rende **rossa
  qualunque chiamata nuova** finché il nome non entra in un file che da `ui/*`
  non si scrive. Un controllo nato per impedire che una chiamata sparisca in
  silenzio impediva di aggiungerne una — cioè bloccava esattamente il lavoro che
  il ridisegno deve fare, e per tutte e sei le aree, non solo per la prima.

  Ora vivono nel file neutro. E siccome l'interfaccia può togliersi la riga da
  sola, il controllo sugli orfani può finalmente chiedere **anche il verso
  opposto**: una funzione dichiarata orfana che la pagina ha cominciato a
  chiamare è una dichiarazione che mente, e diventa rossa. Prima quel controllo
  non esisteva — non per dimenticanza, ma perché l'unico modo di spegnerlo
  sarebbe stato toccare `tests/`.

- **`test_letture_che_non_mascherano`: un ripiego non trasforma un errore in un
  dato plausibile.** `LS.get(k, d)` ha `catch { return d }`, e `ARCH.carica()`
  lo usa per leggere l'archivio quando IndexedDB non si apre: **un archivio
  illeggibile — JSON rotto, `localStorage` che lancia — è indistinguibile da un
  archivio vuoto.** Chi ha mesi di risposte vedrebbe la schermata del primo
  avvio, e nessun errore da nessuna parte. È il guasto muto nella sua forma più
  pura, ed è stato trovato leggendo il codice, non riproducendolo.

  Il difetto è di `app.html`, che è dell'interfaccia: entra quindi come riga
  dichiarata nel file neutro, con l'area che lo chiude, e la suite resta verde
  finché non lo si corregge. Il controllo è statico e non pretende di dimostrare
  che i tre esiti siano distinti: pretende che **la forma che li confonde** non
  ci sia. R-STA-08.

  **Provati al contrario quattro volte**, e ognuno nomina il colpevole: la pagina
  che chiama `E.ritmo()` mentre è ancora dichiarato orfano → 2 rossi, che sono
  esattamente i due che hanno fermato la sessione; una riga tolta dalle chiamate
  protette → 1; il ripiego corretto con la dichiarazione rimasta → 1; una lettura
  cieca non dichiarata → 2.

  **E un controllo scritto e mai eseguito, preso dall'aritmetica.** La prima
  stesura di `test_letture_che_non_mascherano` non era registrata in `main()`:
  la suite diceva 134 verifiche passate e quel controllo ne contribuiva **zero**.
  Il conto atteso era 128 + 4 + 2 + 3, e i tre mancavano. È lo strumento che
  rassicura, di nuovo, dentro la riparazione di un altro strumento che rassicura;
  il conto dei numeri attesi è ciò che l'ha preso.

### Deciso

- **Che cosa può dire una breve attività: tre affermazioni, e nessuna quarta.**
  Era il punto 5 di `decisioni-aperte.md`, aperto su indicazione di ChatGPT, che
  ha chiesto di chiuderlo prima di toccare il codice. Può dire che cosa è
  successo, quali risposte rivedere, e che cosa non hai ancora toccato. **Non**
  può dire dove sei debole né quanto sei preparato — non per delicatezza, ma
  perché il motore si rifiuta di calcolarlo sotto le proprie soglie: dopo dieci
  risposte `peggiori()` qualifica **zero** voci e `tendenza()` tace.

### Test

- 126 verifiche sull'interfaccia (erano 74), 210 sulla specifica (erano 204),
  121 sul motore e 199 sui dati invariate.
- Dopo il trasloco delle due liste: **137** sull'interfaccia e **214** sulla
  specifica.

### Corretto

- **La vetrina supera le soglie minime di accessibilità senza cambiare la sua
  tavolozza.** Il payoff del marchio passa da 10 a **11 px** e la sua eccezione
  dichiarata sparisce; l'occhiello generico sopra l'H1 non c'è più. Il testo
  attenuato usa il grigio già presente `#475569`: **6,88:1** su carta, invece di
  `#64748B` a **4,32:1**. Le quattro righe nella sezione navy sono bianche:
  **16,69:1** su `#0B1F33`. A 375 px, tutti i link del piè di pagina — compresi
  MIT e Avvertenza — misurano almeno **44×44 px**; nessuno sbordamento orizzontale
  a 375 e 1280 px.

- **Errata alla misura dei target nel piè di pagina.** I **44×44 px** valgono
  per i sei link della navigazione; MIT e Avvertenza restano inline nelle frasi,
  come consente SC 2.5.8. `--ink-mute` collassa in `--ink-soft`: due nomi per lo
  stesso colore non distinguevano più niente.


### Progettato — area 1

- **Percorso e primo ingresso**, definiti in `docs/area-1-progetto.md` per la
  successiva implementazione: ingresso diretto senza domanda sulla preparazione,
  prima attività fino a 10 quiz base e ritorno fino a 25, testi completi e
  riepilogo limitato ai fatti della lista. La scelta evita di trasformare poche
  risposte in una diagnosi e lascia disponibili scelta libera e Carteggio.
  Durata solo dal ritmo affidabile e da `stimaImpegno()`, data facoltativa,
  stati di archivio e salvataggio distinti, correzione progettata di sette
  eccezioni tipografiche. Previsto il punto d'inserimento dell'ambito futuro,
  senza mostrarlo. Nessuna implementazione in `site/` in questa sessione.

- **Verificata la base allineata a `main`**: 121 casi motore (120 superati,
  1 skip previsto), 199 verifiche dati, 128 interfaccia e 210 specifica.
  Casi sintetici sul motore confermano la distinzione fra mai visti e rimanenti,
  la soglia 29/30 del ritmo e la Mirata vuota con banca tutta corretta: il
  progetto gestisce questi casi senza conteggi o selezioni sostitutive.
  Il collaudo della nuova interfaccia e le prove con persone restano da svolgere.

### Realizzato — area 1

- **Il Percorso ora orienta e apre davvero la prima attività senza trasformarla
  in una diagnosi.** Con archivio ordinario vuoto propone la stessa lista
  `mirata()` che annuncia, fino a 10 quiz base; dopo la prima risposta ne prepara
  una nuova fino a 25. La pagina separa Quiz, Carteggio, scelta libera, Segnali,
  data facoltativa e conservazione dei progressi, così Carteggio e importazione
  restano accessibili senza un quiz preliminare. Il primo runner conserva la
  risposta ufficiale sullo schermo e il suo riepilogo descrive soltanto le
  risposte appena date, gli errori consultabili e le domande non affrontate.

- **Archivio e tempo non producono più rassicurazioni inventate.** Il ripiego di
  lettura distingue chiave assente, archivio letto ed errore; banca, Carteggio,
  salvataggio e offline hanno stati e azioni espliciti, visibili anche nel
  runner e nella revisione. La durata compare solo quando `ritmo()` ha almeno
  30 risposte base misurate e `stimaImpegno()` conferma la fonte `orologio`.
  `ritmo` esce quindi dagli orfani dichiarati ed entra fra le chiamate protette;
  le sette eccezioni tipografiche dell'app e la lettura cieca vengono rimosse
  soltanto insieme alle rispettive correzioni.

- **Collaudo:** 121 casi motore (120 superati e 1 skip previsto), 199 verifiche
  dati, 120 interfaccia e 214 specifica, tutti verdi. Le verifiche interfaccia
  erano 137: 17 controlli spariscono perché sette eccezioni tipografiche e la
  lettura cieca erano controllate nei due versi, mentre `ritmo` passa da due
  controlli da orfano a uno da chiamata protetta. Guardati Percorso, prima
  attività, riepilogo, Quiz e Carteggio a 375 e 1280 px: zero sbordamento,
  bersagli visibili almeno 44 × 44 px, testo minimo 11 px e contrasto minimo
  misurato 5,16:1. Verificati inoltre stop a zero e dopo una risposta, ritorno
  con nuova selezione da 25, data futura e rimossa, revisione e ripristino del
  focus, pannello richiudibile con Esc e assenza di errori in console.

### Corretto — alla merge dell'area 1

- **Ogni riepilogo si apriva con un avviso d'errore rosso e vuoto.** Il
  riquadro `.route-alert` che segnala un salvataggio fallito nasce con
  l'attributo `hidden`, ma `.route-alert{display:flex}` lo scavalca: nel foglio
  del browser `[hidden]` perde contro qualunque `display` d'autore. Non l'avevano
  preso né il collaudo dell'area 1 né le suite; l'ha preso guardare il riepilogo
  a 375 px durante la merge. Misurato: nel riepilogo c'era **un** elemento
  `hidden` con `display:flex`.

  La stessa trappola era già stata tappata tre volte, una classe per volta
  (`#sp-pop[hidden]`, `.header-statuses span[hidden]`,
  `.runner-warning[hidden]`). Ora c'è una sola regola,
  `[hidden]{display:none!important}`, che chiude la categoria invece del caso.
  Scritta da Claude su `ui/main`, con ChatGPT fermo, come prevede `AGENTS.md`.

## [0.24.0] — 2026-09-12

### Aggiunto

- **`docs/filosofia.md`**: il perché sotto le scelte, distinto da
  `docs/specifica.md` che dice che cosa esiste e come si verifica. Non è una
  specifica tecnica e non ha requisiti né controlli: è la sintesi di valori
  già stabiliti altrove nel progetto (l'onestà sui difetti, l'autorità del
  decreto sopra la nostra convinzione, niente inganno né gamification, i dati
  che restano nel browser per architettura e non per promessa, verificare
  invece di dedurre, l'apertura del codice) — scritta per servire da sorgente
  sia a `specifica.md` sia ai testi dell'interfaccia, invece di lasciare che
  ognuno reinventi il tono da solo. Stessa penna e stesso territorio di
  `specifica.md`: aggiunto a `territori.yaml` sotto `motore`.

### Modificato

- **La cartella si chiama `~/Software/rotta-giusta`** (era `open-patente-nautica`, il
  nome fino alla 0.19.2): la skill di progetto lo dice, e il worktree `rotta-giusta-ui`
  è stato riparato. In `AGENTS.md`: `TERRITORI_OK` è dell'autore, non degli agenti.

### Aggiunto — il motore per il ridisegno

- **`ritmo()`: il tempo per domanda si misura all'orologio, non al cronometro.**
  `stimaImpegno()` stimava i minuti dalla media di `ms`, che si ferma quando
  rispondi e quindi **non contiene la lettura del riscontro**. Misurato
  sull'archivio del progetto di preparazione — 2.100 risposte fra il 13 agosto e
  il 2 settembre 2026, 19 sessioni con il confine registrato — il divario fra i
  due tempi è del **14 %**, e la durata reale è **23,5 secondi per domanda**
  contro i 15 del ripiego: una sottostima del **36 %**.

  **La prima diagnosi era sbagliata, e la misura l'ha smentita.** Sembrava un
  problema di robustezza: 31 risposte su 2.100 oltre i due minuti — una lasciata
  aperta 17,9 minuti — spostano la media da 14,9 a 20,2 secondi. Ma tagliarle
  **peggiora** la stima: grezza 20,2 (scarto del 14 % dal vero), tagliata a due
  minuti 16,5 (scarto del 30 %). I due errori del cronometro si compensano in
  parte, perché le pause stanno *dentro* `ms` e la lettura del riscontro sta
  *fuori*: correggerne uno solo allontana dal vero.

  `ritmo()` misura quindi l'intervallo fra due risposte consecutive —
  `durata / (n − 1)`, perché `durata` copre `n − 1` intervalli e dividere per `n`
  farebbe dipendere il ritmo dalla lunghezza della sessione — e ne prende la
  **mediana fra sessioni**. Robusta per costruzione e **senza nessuna soglia da
  tarare**: una soglia scelta su questo archivio sarebbe una misura su un
  campione di uno travestita da costante. La pausa dentro una sessione è già
  limitata a venti minuti, oltre i quali il motore taglia.

  **`stimaImpegno()` dichiara la fonte** — `orologio`, `cronometro` o `ripiego` —
  perché sono tempi diversi, non versioni più o meno precise dello stesso tempo.
  Firma compatibile: il quarto argomento è facoltativo.

- **`erroriSessione()`: gli errori di una sessione sola, pronti da riaprire.**
  È il pezzo di motore che chiude il ciclo di un'attività, il difetto di flusso
  più grave emerso dal confronto a tre del 10-12 settembre: oggi, dopo un
  riepilogo con tre errori, l'unica strada è «solo sbagliate», che li mescola con
  gli errori di sempre — e il lavoro appena fatto non ha un seguito che gli
  appartenga.

  Restituisce lista, conteggio e **la fonte del confine**: `sim_uid` quando è
  registrato, `risposte` quando è ricostruito. Affidabile e registrato non sono
  la stessa cosa, e su un archivio importato da altrove la differenza si dice.

### Test — il motore per il ridisegno

- **121 test sul motore** (erano 109), 74 verifiche sull'interfaccia (erano 70),
  204 sulla specifica (erano 170), 199 sui dati invariate.

  **Provati al contrario quattro volte**, rompendo il motore apposta:
  `durata / n` al posto di `durata / (n − 1)` → 3 rossi; la media al posto della
  mediana fra sessioni → 1; `erroriSessione()` che ignora il confine → 1;
  `stimaImpegno()` che ignora il ritmo misurato → 2.

  **E il contatore dei rossi è stato controllato prima di credergli**: la prima
  stesura cercava `^not ok` nell'uscita di `node --test`, che quel formato non
  produce, e riportava «zero rossi» su tutte e quattro le rotture. È lo strumento
  che rassicura, in miniatura, dentro la verifica di un difetto.

- **`ritmo()` ed `erroriSessione()` entrano in `ORFANI_DICHIARATI`** con il
  motivo e la condizione alla quale l'eccezione sparisce: le consuma
  l'interfaccia del ridisegno, che è del ramo `ui/*`. Il controllo le ha prese da
  solo, ed è il verso giusto — una funzione esportata e mai chiamata è una
  conversazione da fare, non un residuo da lasciare.


## [0.23.0] — 2026-09-09

### Modificato

- **`.claude/worktrees/` è ignorata.** È dove l'app desktop di Claude Code crea
  un worktree per ogni sessione, dentro il repo; senza questa riga un
  `git add -A` dal checkout principale committerebbe l'intero albero di
  un'altra sessione. Primo passo della decisione su come lavorano due agenti
  sullo stesso repo (relazione del 07/09/2026).

### Aggiunto

- **Cinque documenti di lavoro in `docs/`**, scritti fra il 7 e il 9 settembre da
  Claude Code e ChatGPT insieme: `percorso-ux.md` (metodo e fasi della
  progettazione), `specifiche-ux.md` (l'esperienza da realizzare, con requisiti e
  criteri di verifica), `riscontro-ux.md` (la revisione delle specifiche contro il
  codice pubblicato), `motore.md` (che cosa il motore sa fare già e che cosa no) e
  `ricerca-programma-esame.md` (che cosa dicono le fonti sul programma d'esame e
  sulle prove). Entrano così come sono, prima di ogni modifica a `site/`: erano
  circa duemila righe fuori da ogni commit, nel checkout dove lavorano due agenti.

- **Il prototipo visivo del 9 settembre, e la specifica riconciliata.** Entra
  `docs/prototipi/rotta-2026-09-09/`: quattro viste navigabili a 375 e 1280 px,
  due illustrazioni originali, sei catture di verifica e un `PASSAGGIO.md` che
  dichiara che cos’è — bozza autonoma, non integrata e non pubblicata. Sono
  480 KB in 14 file; `site/` non è stato toccato.

  **Perché conta più del suo contenuto.** Stava in un worktree che l’app Codex
  aveva creato per conto suo in `~/.codex/worktrees/`, fuori dal repo, con `HEAD`
  staccato su `082f556` — un commit anteriore a quello che ha portato i documenti
  in `docs/`. Non era in nessun ramo e in nessun commit: un `git worktree prune`,
  o l’app che ripulisce, e sparivano 480 KB senza un errore.

  **E `specifiche-ux.md` esisteva in tre versioni divergenti** — 526 righe qui,
  530 in un worktree, 620 nell’altro — e **nessuna conteneva le altre**. Le 620,
  che sono le più recenti, riportavano indietro la correzione sui pesi d’esame
  della voce qui sotto: il testo superato «non verificati direttamente nel
  decreto» era ancora al suo posto. Prendere il file più nuovo com’era avrebbe
  annullato in silenzio la correzione del giorno prima — un guasto muto servito
  da un file che sembra soltanto aggiornato. Quello che entra è la fusione: base
  620, con rimessi dentro i due blocchi che si sarebbero persi, la correzione e
  la sua voce di registro, per 641 righe. Verificato riga per riga: dalle 620
  cadono solo le tre superate, e delle sette righe di qui che non sopravvivono
  tutte e sette sono riscritture più recenti, non perdite.

- **Il recinto per due agenti: `AGENTS.md` sorgente, `territori.yaml`, e un
  `pre-commit` che lo fa rispettare.** ChatGPT sta per rivedere l’interfaccia. Il
  07/09/2026, su `patente-gioco`, questa stessa coppia nella stessa cartella si
  era rotta in cinque modi — fra gli altri un `git add -A` che ha annullato in
  silenzio il revert dell’altro — e nessuno dei cinque aveva prodotto un errore.
  L’ADR-004 di `Standards` ne conclude che una regola che un agente deve
  ricordare si sostituisce con un controllo che git esegue. Questo è
  l’adozione di quel controllo qui: il hook c’era già in `Standards`, questa
  sessione non lo scrive, lo aggancia.

  **Un file di regole solo.** `AGENTS.md` diventa la sorgente e `CLAUDE.md` la
  riga `@AGENTS.md`. Erano due copie non tracciate e **già divergenti**:
  `AGENTS.md` si intitolava ancora «Open Patente Nautica», e in `.agents/skills/`
  c’erano due cartelle vere, una col nome vecchio. Ora la skill sta in un posto
  solo e `.agents/skills/rotta-giusta` è un symlink relativo, che vale anche nel
  worktree. `docs-check.yaml` dichiara il blocco `rules` che lo verifica:
  l’asserzione «regole» passa da *saltata* a **eseguita**.

  **`territori.yaml` dice chi tocca cosa**, e il `pre-commit` rifiuta un commit
  fuori territorio nominando il file. Il motore è di `main` anche dove abita in
  `site/` — `engine.js`, `dati/`, `figure/` — l’interfaccia è del ramo `ui/*`,
  `CHANGELOG.md` e `sw.js` sono condivisi. `VERSION` sta fra le regole: da `ui/*`
  non si rilascia, perché i tag sono condivisi fra i worktree e due rami che
  chiudessero entrambi con un bump si scontrerebbero per forza.

  **Due cose trovate misurando, non deducendo.** La prima è un guasto muto nel
  formato: scritte come liste su più righe, le voci di `territori.yaml` vengono
  **troncate alla prima riga** dal ripiego senza PyYAML, senza dirlo — e con quel
  parse `site/engine.js` finiva in `interfaccia`, cioè il recinto avrebbe detto a
  ChatGPT che il motore era suo. Ogni lista sta ora su una riga sola, e i due
  parser danno lo stesso risultato. La seconda: `site/figure/` non era in nessun
  territorio del motore e sarebbe finita all’interfaccia. Sono le 102 figure del
  decreto, protette da un test come `site/dati/`; il marchio e le icone restano
  invece dell’interfaccia, perché quelli sì sono asset grafici.

  Provato al contrario quattro volte, e ogni volta con il file e il ramo
  nominati: su `main` un file dell’interfaccia e una riga tolta dal changelog
  sono stati rifiutati; dal worktree `ui/main` è stato rifiutato `site/engine.js`
  e lasciato passare `site/index.html`. I due alberi sono rimasti puliti. Anche
  il controllo che chi fa la merge lancia sul diff del ramo è stato provato su un
  diff finto: pesca `engine.js` e `VERSION`, lascia passare `app.html`.

  `site/` non è stato toccato, e non c’è bump: non cambia niente che l’utente
  riceva.

- **Un documento solo, `docs/specifica.md`, e ogni requisito porta il suo
  controllo.** La conoscenza del prodotto stava in cinque documenti che si
  citavano a vicenda, e nessuno dei cinque diceva *dove sta ogni cosa*. Il costo
  si è visto lo stesso giorno: durante il ridisegno della navigazione la
  schermata «Che tecnica serve?» ha perso il suo unico ingresso — la vista nel
  file, la logica al suo posto, e **nessun elemento della pagina che la aprisse**
  — e `E.peggiori()` è rimasta senza chiamanti. Nessuna delle due ha fatto
  fallire un test, perché non esisteva un elenco di che cosa deve esistere.

  **La forma conta quanto il contenuto.** Il 9 settembre `specifiche-ux.md`
  esisteva in tre versioni divergenti — 526, 530 e 620 righe — e nessuna
  conteneva le altre. Quindi: un documento, **una penna sola**, su `main`, nel
  territorio `motore`. Il `CHANGELOG.md` è condiviso perché è additivo; una
  specifica si riscrive, e due mani che riscrivono producono quelle tre versioni.
  ChatGPT progetta sul ramo e propone da lì; le proposte accolte le riporta qui
  chi fa la merge.

  **Tre etichette e nessuna quarta** — Vincolo, Deciso (con la data), Aperto (con
  chi decide). Manca «proposta», ed è deliberato: la versione precedente aveva
  398 righe di cui quattro decisioni, cioè un documento in cui ogni frase è
  falsificabile solo dopo una prova che nessuno ha in calendario.

  Assorbe `docs/motore.md` (che resta un puntatore, con le due ancore più citate
  vive) e i tre documenti UX, che restano sul disco come materiale storico.

- **`tests/test_specifica.py`: la specifica non può mentire sulla propria
  copertura.** Legge il §9, estrae i 41 requisiti e fallisce se uno nomina un
  test che non esiste, se ripete un identificatore, o se dichiara «scoperto»
  senza il motivo. 170 verifiche. È l'ADR-004 applicato ai documenti — *una
  regola che qualcuno deve ricordare si sostituisce con un controllo che git
  esegue* — e serve contro il difetto fondativo di questo progetto: il semaforo
  verde a copertura zero, che in un documento prende la forma di una garanzia
  dichiarata e mai verificata. **34 requisiti su 41 hanno un controllo
  eseguibile; 7 dichiarano di essere scoperti, con il perché.**

- **`tests/test_interfaccia.py`: 76 verifiche su che cosa esiste e come ci si
  arriva.** Il censimento delle sette schermate; **ogni vista ha almeno una
  porta**; ogni voce della barra porta a una vista dichiarata e ha un'etichetta
  di testo, non la sola icona; le sei modalità dei quiz ci sono tutte; i due
  selettori globali esistono; e **nessuna funzione esportata dal motore resta
  senza chiamanti**, salvo eccezioni dichiarate col motivo.

  Provato al contrario, quattro volte: spostando l'unico `data-v="tec"` la vista
  orfana viene nominata; togliendo «Solo sbagliate» dall'elenco `MODI` il
  controllo la reclama; un requisito che nomina un test inesistente e uno
  «scoperto» senza motivo fanno fallire il meta-test.

  **Due orfani veri trovati misurando**, e sono dichiarati invece di essere
  nascosti: `fondi()`, che serviva alla sincronia col server tolta nella 0.19.0 e
  che nessuno chiama più; e `daAllenare()`, entrata nel motore il 9 settembre
  mentre `app.html` su `main` ha ancora la sua copia locale — cioè, per qualche
  giorno, **due implementazioni della stessa selezione**, che è proprio ciò che
  `AGENTS.md` vieta. La seconda eccezione sparisce con la merge del ramo
  dell'interfaccia, che chiama già `E.daAllenare()`.

  Il controllo sugli orfani ha richiesto una misura e non una deduzione: la
  prima stesura dava cinque falsi allarmi, perché `componiProva()` passa
  `E.estrai` **come valore** invece di chiamarla, e perché `semaforo()` e
  `oscurato()` sono chiamate dentro il motore e non dalla pagina.

  **Che cosa i controlli non fanno, ed è voluto:** non fissano la composizione
  della barra. Quante voci abbia e come si chiamino è una questione aperta che
  decide l'autore; un test che ne fissasse l'elenco prenderebbe quella decisione
  al posto suo.

### Corretto

- **La composizione della scheda d'esame è ministeriale**, non una deduzione di
  tre scuole nautiche: è l'Allegato C al DM 323/2021. Il `README.md` diceva il
  contrario perché nel repo c'era un solo decreto, quello dei quesiti, e la
  composizione sta nell'altro. Resta non ministeriale la ripartizione dentro un
  tema. Le evidenze sono in `docs/ricerca-programma-esame.md`.

### Spostato

- **`daAllenare()` passa da `site/app.html` a `site/engine.js`**, con i suoi
  test. Era l'ultima selezione rimasta fuori dal motore, e `AGENTS.md` la
  nominava per nome: va spostata *prima* che la schermata venga rifatta. Il
  rifacimento comincia adesso, quindi il momento e' questo.

  **Perche' conta piu' di un trasloco.** E' la funzione dove il difetto di casa
  e' tornato **tre volte** — 0.13.3 su «Allena questa voce», 0.16.0 sul pulsante
  di *Oggi* e sulla modalita' Per argomento — sempre con lo stesso sintomo: un
  numero in schermata e una lista che non venivano dalla stessa fonte. E tutte e
  tre le volte non c'era un test, perche' la funzione viveva nella pagina, dove
  `node --test` non arriva. Ora ci arriva.

  **Il comportamento non cambia di una riga, e non e' una dichiarazione:** uno
  dei sette test nuovi **estrae la copia della pagina da `app.html`**, la esegue
  davvero e pretende la stessa lista e lo stesso `daFare` su quattro filtri.
  Finche' le due copie convivono, e' il controllo che le tiene uguali; quando
  l'interfaccia passera' a `E.daAllenare()` e la copia sparira', il test si
  mettera' da parte da solo invece di diventare rosso. Un controllo che si
  ritira quando ha finito, al posto di una regola da ricordare.

  **La pagina non e' stata toccata, ed e' il recinto a volerlo:** `site/app.html`
  e' dell'interfaccia, cioe' del ramo `ui/*`, e questo commit e' su `main`. Il
  ricablaggio delle tre chiamate — il pulsante di *Oggi*, la modalita' Per
  argomento e «Allena questa voce» — lo fa chi rifa' la schermata, in un solo
  file e senza una seconda penna sopra.

  La firma segue quella del resto del motore, che non ha ne' DOM ne' stato
  globale: `daAllenare(items, progress, oggi, kind, extra = {})`, e restituisce
  `{ lista, daFare }` come prima.

### Test

- **109 test sul motore** (erano 102), 193 verifiche sui dati invariate. I sette
  nuovi: l'ordine dei quattro gruppi, `daFare` uguale a `rimanenti` di
  `traccia()`, la ripresa che resta in lista ma dietro ai mai visti, i filtri
  `kind`/`temi`/`voce`/`soloFigura` che valgono su **tutti e quattro** i gruppi,
  la banca interamente coperta che apre comunque ripasso con `daFare` a zero (il
  caso della 0.16.0, riprodotto), l'assenza di doppioni, e la compatibilita' con
  la pagina.

  **Provati al contrario cinque volte**, rompendo il motore apposta: riprese
  prima dei mai visti → 4 rossi; `daFare` gonfiato con le riprese → 3; il filtro
  `extra` non passato a tutte e tre le chiamate → 2; il resto senza il taglio dei
  gia' visti, cioe' doppioni → 5; e la forma anteriore alla 0.16.0, la lista dei
  soli mai visti → 6. Il test di compatibilita' con la pagina li ha presi tutti
  e cinque.
- **Il controllo prima della merge e' un comando**, `check_territories.py --range
  main...ui/main`, al posto della chiamata di libreria scritta in `AGENTS.md`; e il
  vincolo «ogni lista di `territori.yaml` su una riga» sparisce, perche' il
  ripiego di Standards ora legge le liste spezzate e rifiuta quelle aperte
  (Standards `91d90c9`).

### Interfaccia

- **La palestra adotta la Rotta chiara approvata nel prototipo.** La prima
  schermata orienta senza chiedere una data d'esame, affianca Quiz e Carteggio,
  mostra un riepilogo prudente dei soli dati osservati e tiene la data
  facoltativa in fondo. La prima proposta apre 10 quesiti e usa
  `stimaImpegno()` per annunciare circa 2-3 minuti; dopo la prima risposta la
  Mirata torna a 25. Numero, lista e motivi sono lo stesso oggetto del motore.

  La navigazione e' Rotta / Quiz / Carteggio / Progressi, con Info persistente
  nell'intestazione e pallino ambra ancora visibile. Carteggio conserva prova,
  allenamenti su carta e «Che tecnica serve?» nel proprio ambiente. I Segnali
  vivono nel riquadro autonomo «Allenamenti extra», fuori dalla mappa e con il
  criterio «non contano nella copertura» dichiarato; la scorciatoia da COLREG
  apre la stessa schermata, non una seconda gerarchia.

- **La pagina consuma `E.daAllenare()` e la copia locale non esiste piu'.** Le
  chiamate per conteggi, anteprime, filtri e voci usano tutte l'export del
  motore. Il test temporaneo di compatibilita' si ritira come previsto: 109 test,
  108 passati e un solo skip dichiarato. Passano anche 199 verifiche sui dati e
  il guardiano su 47 file di testo.

- **Collaudo reale nel browser locale.** Rotta verificata a 375 e 1280 px;
  sbordamento orizzontale zero in tutte e quattro le destinazioni a 375 px. Le quattro aree della barra
  misurano 94 x 69 px e Info 63 x 44 px, con etichette intere e pallino visibile.
  Il tema chiaro misura 15,36:1 sul testo principale, 5,60:1 sulla navigazione e
  almeno 11,27:1 nei testi del riquadro navy. Il collaudo ha trovato e corretto
  due guasti prima del commit: header e barra coprivano il runner del quiz, e la
  tabella di Progressi allargava la pagina a 437 px. Ora i runner stanno sopra
  il guscio e la tabella scorre dentro la propria scheda (pagina a 375 px).

### Merge

- **Il ramo `ui/main` entra in `main`.** Controllo territori sul diff del ramo
  pulito (`check_territories.py --range main...ui/main`), nessun conflitto:
  108 test sul motore su 109 passati con lo skip previsto, 199 verifiche sui
  dati, 170 sulla specifica. Verificato anche nel browser locale, a 375 e
  a 800 px: zero sbordamento orizzontale in Rotta, Carteggio e Progressi, e
  la tabella *Per tema/voce* scorre dentro la propria scheda come dichiarato.

  **Un rosso emerso dopo la fusione, non prima.** `E.peggiori()` — «Le tue
  voci più deboli» — è sparita dalla Rotta nel ridisegno: la pagina ora
  chiama solo `E.consigli()` per «Cosa studiare adesso» in Progressi.
  `test_interfaccia.py` l'ha presa da sola, come deve: nessuno dei due rami,
  guardato da solo, l'avrebbe vista, perché `docs/specifica.md` (scritto su
  `main` prima della fusione) e la nuova Rotta (scritta su `ui/main` nello
  stesso periodo) l'avevano già anticipata da parti opposte — il documento la
  nomina come Q-DUE, la pagina la rende vera. È la ragione per cui `AGENTS.md`
  vuole la fusione fatta a mano invece che con un rebase automatico: un umano
  guarda, e qui c'era una decisione (Q-DUE, §10) non ancora presa a cui la
  suite doveva restare attaccata. `peggiori()` entra in `ORFANI_DICHIARATI`
  col motivo, resta esportata e testata — toglierla dal motore adesso
  perderebbe la costruzione se la Rotta la richiamasse — e la decisione se
  tenerne una sola classifica o dichiarare la differenza resta all'autore.


## [0.22.1] — 2026-09-07

### Corretto

- **La vetrina e la palestra avevano lo stesso `<title>`**, identico carattere
  per carattere. Fino alla 0.21.0 non si sovrapponevano perche' erano la stessa
  pagina; spostando la palestra su `/app` sono diventate due, e il titolo e'
  rimasto quello. Costa due cose concrete: due schede aperte sono
  indistinguibili, e per un motore di ricerca sono due pagine che competono per
  la stessa query invece di dividersi il lavoro — proprio quando il titolo
  descrittivo era stato scelto apposta per farsi trovare (0.20.0).

  La vetrina tiene *«Rotta Giusta — quiz e carteggio per la patente nautica»*,
  che e' la pagina che deve comparire nelle ricerche; la palestra diventa
  *«La palestra · Rotta Giusta»*, che e' quello che serve leggere in una scheda
  fra le altre.

### Test

- **193 verifiche sui dati** (erano 191): i due titoli devono essere diversi e
  non vuoti, e quello della vetrina deve nominare la patente nautica. Rimessi
  uguali, il primo fallisce.

## [0.22.0] — 2026-09-07

La vetrina. `/` diventa la pagina di presentazione, la palestra trasloca su
`/app`.

### Aggiunto

- **La pagina vetrina**, su `/`: chi arriva da una ricerca o da un link
  condiviso non atterra piu' dentro una palestra con tre zeri e un interruttore
  filtro in cima, ma su una pagina che dice che cos'e' il sito, per chi e', e
  perche' e' gratis.

  **E' HTML statico, 29 KB, senza un passo di build e senza dipendenze.** Le
  icone sono SVG in linea, il carattere arriva da Google Fonts, il marchio sono
  i tracciati che stanno gia' nel repo. `CLAUDE.md` resta vero e Cloudflare
  Pages continua a pubblicare `site/` senza comando di build.

- **I numeri della vetrina si contano dalla banca**, non si scrivono a mano: le
  dieci tessere degli argomenti, i quesiti di ciascuno, le domande d'esame che
  porta, e i totali arrivano da `dati/meta.json` al caricamento — la stessa
  fonte della palestra. Se quella lettura fallisce la pagina scrive *«La banca
  non risponde: gli argomenti si contano da li', e senza non li invento»*
  invece di mostrare cifre finte. Quel ramo e' stato visto funzionare: la prima
  stesura leggeva `t.nome` mentre la chiave e' `t.tema`, e la pagina ha detto di
  non sapere invece di disegnare tessere vuote.

  Cosi' compaiono anche le tre cose che una lista scritta a mano aveva perso:
  **Teoria dello scafo** (125), **Motori** (104) e soprattutto **il carteggio**
  (135 esercizi), che e' la prova eliminatoria e non era nominata da nessuna
  parte.

### Cambiato

- **La palestra sta su `/app`.** La radice serve a chi non ti conosce ancora, e
  chi non ti conosce arriva sempre su `/`.

  **La trappola non e' spostare il file, e' `start_url`.** Se la palestra si
  sposta e `start_url` resta `/`, chi ha l'icona sulla schermata Home la tocca e
  si ritrova sulla pagina di presentazione invece che sui suoi quiz — senza
  nessun errore che lo dica. `start_url` diventa `/app` nello stesso commit, e
  c'e' un test che lo pretende.

- **La vetrina resta FUORI dal guscio offline, ed e' deliberato.** `sw.js` e'
  cache-first: una pagina di presentazione messa in cache resterebbe congelata
  alla versione del giorno in cui ce l'hai messa. E' la stessa trappola che ha
  morso due volte durante questa sessione. Verificato: con il service worker
  attivo e che controlla `/`, la radice mostra la vetrina presa dalla rete, e
  `/` non compare fra le 16 voci in cache.

- Le due pagine legali tornano a `/app`, non alla vetrina.

### Nella vetrina non c'e', e sono scelte

- **Nessun pulsante «Accedi»**: non esistono account, le risposte restano in
  IndexedDB nel browser di chi studia. Un pulsante che promette il contrario e'
  una bugia in prima pagina.
- **Nessun «tutti i diritti riservati»**: il codice e' MIT e i quesiti sono un
  atto dello Stato su cui nessuno puo' concedere diritti. Il pie' di pagina lo
  scrive per esteso, con il link all'**avvertenza**, che il sito e' tenuto a
  mostrare.
- C'e' invece una sezione **«Che cosa non torna, e lo diciamo»**: i 37 oscurati,
  gli 11 che divergono dal DM 133/2024, le dieci figure riabbinate. E' la cosa
  che nessun altro sito di quiz fa, ed e' l'unico argomento che i concorrenti
  non possono copiare.

### Test

- **191 verifiche sui dati** (erano 174), 102 sul motore. Il controllo nuovo
  tiene fermi gli indirizzi: `start_url` e' la palestra e non la vetrina, lo
  `scope` copre tutto il sito, il guscio contiene `/app` e **non** contiene `/`,
  la vetrina rimanda alla palestra, e le pagine legali tornano a `/app`. I test
  del guscio e del prefisso della cache guardano ora `app.html`.

### Verificato in Chrome

Su `/`: dieci tessere con i numeri della banca, il pulsante che porta a `/app`,
sbordamento orizzontale **0**. Su `/app`: service worker `activated`, scope `/`,
cache `rg-0.22.0` con 16 voci fra cui `/app`, e `/` **non** in cache.
`start_url` letto dal manifest servito: `/app`.

### Rimane aperto

La vetrina e' chiara e la palestra e' scura. E' la divisione consueta fra pagina
di presentazione e applicazione, ma e' una scelta da confermare. E chi aveva `/`
fra i segnalibri come «la palestra» ci trova adesso la vetrina: e' un clic, non
un dato perso, ma succede.

## [0.21.0] — 2026-09-07

Il sito prende una faccia, e la palestra parla i colori del marchio.

### Aggiunto

- **Il marchio, in vettoriale.** `marchio.svg` (positiva), `marchio-negativo.svg`,
  `icona.svg` (tessera con angoli al 22%), `icona-maskable.svg` e `favicon.svg`.
  I tracciati sono quelli del file consegnato dal disegnatore, **verbatim**:
  cambiati solo i colori dei due fanali — il verde e' il fanale di dritta,
  quindi visto di prua sta a **sinistra** di chi guarda, come nelle figure del
  decreto e nel gioco dei Segnali — e il `viewBox`, che aveva 24 unita' di
  margine sopra e 12 sotto e faceva pendere il segno in basso.

  Due varianti mancavano e sono state derivate. La **negativa**, perche' il file
  originale e' navy su trasparente: su fondo scuro la nave spariva e restavano
  due pallini e una freccia. E la **ridotta**: il `favicon.svg` consegnato non
  era una versione ridotta ma lo stesso disegno rimpicciolito (349,3 contro
  352,3 unita' di larghezza, cambiava solo il raggio dei fanali), e rasterizzato
  davvero a 16 px le sei fasce della sovrastruttura diventano una macchia. La
  ridotta tiene **solo lo scafo** — un tracciato dell'originale, il settimo.

- **Sette PNG e la og-card**, generati dagli SVG e verificati uno per uno (firma
  PNG e dimensioni reali): 16, 32, 180 per iOS, 192, 512, la maskable al 78%, e
  `og-card.png` 1200x630. La og-card e' disegnata su canvas e non in SVG, per un
  motivo misurato: un `@font-face` in `data:` dentro un SVG caricato come
  immagine **non viene applicato** — la prima prova e' uscita in serif.

- **Il marchio compare anche dentro l'app**, accanto al titolo della schermata
  *Oggi*, e in nessun'altra: e' il titolo del sito, non una decorazione da
  ripetere in ogni schermata. Misura `1,55em`, quindi segue il titolo da solo
  quando sopra i 900 px l'`h1` passa da 19 a 26 px — misurato: 29 px sul
  telefono e 40 px sul desktop, con l'altezza del titolo che li segue e zero
  sbordamento orizzontale.

- **`manifest.json` dichiara le icone.** Fino a ieri `icons` era `[]`: la PWA si
  installava senza faccia e niente lo diceva. Ora tre voci, di cui una
  `maskable`, e `theme_color` e `background_color` passano al navy del marchio
  perche' l'icona sta *sopra* quel colore nella schermata di avvio.

### Cambiato

- **La tavolozza della palestra e' quella del marchio.** 45 sostituzioni, e
  nessun colore inventato: le sei tinte della tavola piu' le superfici derivate
  **sul segmento fra i due navy** (`#0B1F33` e `#123E63`) e i testi sul segmento
  fra la carta e il blu profondo. I fondi tinti — risposta esatta, sbagliata,
  attesa — non sono mescolati col fondo ma sono la loro tinta portata a
  luminosita' 0,12, perche' mescolando col navy il verde diventava teal e il
  rosso viola.

  Misurato, non deciso a occhio: `--fg` 15,15:1 sul fondo, `--dim` 6,80:1,
  `--acc` 6,15:1, `--ok` 7,33:1, il verde sul suo fondo 5,42:1. Due valori sono
  stati alzati perche' non passavano: `--faint` (4,21:1, ed e' usato a 11,5 px,
  quindi vale la soglia piena) e il fondo della risposta sbagliata, che teneva
  `--ko` a 4,33:1.

- **Non toccati, ed e' una scelta: i colori che sono contenuto.** Il cielo
  notturno dei Segnali (`#05070d`), i quattro colori dei fanali del decreto
  (`SEGCOL`), la carta e l'inchiostro dei segnali diurni. Non fanno parte
  dell'interfaccia: imitano le figure del decreto, e cambiarli vorrebbe dire
  insegnare un colore diverso da quello che si vede all'esame.

- **`--warn` resta `#F5B942`, ed e' l'unico colore fuori dalla tavolozza.** Il
  marchio non ha un ambra, e il semaforo di *Oggi* ha tre stati: senza il terzo
  colore il ritardo si direbbe con la stessa tinta di qualcos'altro. Si dichiara
  invece di inventare una settima tinta di marca.

- **Il guscio offline porta anche le icone**: 1272 KB contro
  1206 KB, cioe' 66 KB in piu' perche' l'app
  installata abbia la sua faccia anche senza rete. La og-card no: la guarda un
  crawler, non chi studia.

- **I link a GitHub passano a `ilbeca/rotta-giusta`**, ora che il rename del
  repository c'e' davvero e il vecchio indirizzo risponde 301.

### Test

- **174 verifiche sui dati** (erano 144), 102 sul motore invariate. Il controllo
  nuovo pretende che il manifest dichiari delle icone, che ogni `src` esista su
  disco, che almeno una sia `maskable`, e che la pagina dichiari favicon,
  apple-touch-icon e i tre meta Open Graph. Provato al contrario: rimesso
  `icons: []`, ne falliscono due.

## [0.20.0] — 2026-09-07

Il progetto cambia nome: **Open Patente Nautica** diventa **Rotta Giusta**.
Solo il nome — nessuna riga di logica toccata, nessun dato spostato.

### Cambiato

- **Il nome, in 10 file.** Titolo della pagina, `h1`, piè di pagina, scheda
  Info, `manifest.json`, le due pagine legali, README e CLAUDE.md. Il
  `<title>` non è più il nome nudo ma *«Rotta Giusta — quiz e carteggio per la
  patente nautica»*: «Rotta Giusta» non ha volume di ricerca, «patente
  nautica» sì, e il nome vecchio quelle parole se le portava dentro.

  **Perché adesso.** Un nome descrittivo cresce male: se un domani arrivano
  corsi, carte o una community, «Open Patente Nautica» diventa stretto. E il
  momento è questo perché il costo è al minimo, misurato: nessun link in
  ingresso, nessuna indicizzazione, nessuna `og:image`, e la sola versione
  pubblicata è di tre giorni fa.

- **Il prefisso della cache passa da `opn-` a `rg-`.** Vive in quattro punti
  di `index.html` — che lo cercano con `startsWith` per dire quale versione
  gira davvero su questo dispositivo — più il `CACHE` di `sw.js`. Cambiarne
  tre su quattro farebbe mentire la scheda Info in silenzio, quindi si toccano
  insieme e c'è un test che lo pretende.

  Nessuna cache orfana: l'`activate` cancella tutte le chiavi diverse da
  quella corrente, non solo quelle con il vecchio prefisso. Resta la solita
  ricarica in più già documentata.

### Non cambiato, ed è la parte che conta

- **Il nome del database IndexedDB resta `open-patente-nautica`.** È
  l'identità dell'archivio nel browser di chi studia: rinominarlo aprirebbe un
  database nuovo e vuoto, l'app scriverebbe «risposte 0» e ogni risposta data
  finora sparirebbe **senza un errore**. È il guasto muto di casa, servito
  dal rinomino. Il commento accanto alla costante lo spiega, e il test lo
  dichiara come unica eccezione ammessa invece di fingere che non esista.

  Il conteggio a mano fatto in sede di piano diceva «34 occorrenze in 10
  file» e non distingueva questa da un'etichetta qualunque. Sono le occorrenze
  che un `grep` conta e che solo la lettura separa.

- **I link a GitHub restano al vecchio indirizzo.** Il repo non è ancora stato
  rinominato: GitHub tiene il redirect dal nome vecchio, non dal nuovo, quindi
  aggiornarli adesso li romperebbe. Si aggiornano nella versione in cui il
  rename avviene davvero.

### Corretto per traverso

- **Il marcatore nel file dei progressi** diventa `app: 'rotta-giusta'` e il
  file scaricato si chiama `rotta-giusta-progressi-AAAA-MM-GG.json`. I file
  esportati prima continuano a caricarsi: `importa()` non legge mai quel
  campo — verificato leggendo la funzione, non dedotto.

### Test

- **144 verifiche sui dati** (erano 105), 102 sul motore invariate. Due
  controlli nuovi, ed esistono perché un rinomino lascia residui invisibili:

  1. **nessun file pubblicato contiene più il nome vecchio né il prefisso
     `opn-`**, con la sola eccezione dichiarata del nome del database;
  2. **il prefisso della cache è uno solo**, uguale in `sw.js` e in tutti gli
     `startsWith` di `index.html`.

  Provati al contrario: rimessa la forma vecchia in **un solo** punto su
  quattro, falliscono tre verifiche su tre attese. La prima stesura del
  secondo controllo pescava anche `'v-'`, il prefisso degli id delle
  schermate, ed è stata ristretta a `startsWith` e alle righe che parlano di
  cache.

- La skill del progetto è ora `.claude/skills/rotta-giusta/`, e continua a
  dichiarare il nome vecchio fra i suoi inneschi: chi la cerca fra sei mesi
  potrebbe conoscere solo quello.

### Da fare fuori dal repo

Il rename di `ilbeca/open-patente-nautica` su GitHub (che lascia un redirect),
e il progetto Cloudflare Pages — attenzione, lì **non** c'è redirect: cambiare
il nome del progetto spegne `open-patente-nautica.pages.dev`. La via pulita è
il dominio `rottagiusta.it`, verificato libero al registro `.it` il 6 settembre
2026.

## [0.19.2] — 2026-09-04

Sessione di verifica del sito **pubblicato**, guidato nel browser su HTTPS e non
dedotto dal codice. Il difetto peggiore era muto e stava in una riga verde: i
due link legali del piè di pagina erano morti per chiunque avesse aperto il
sito una seconda volta.

### Corretto

- **`/privacy.html` e `/avvertenza.html` erano link morti, anche online.**
  Cloudflare Pages serve `privacy.html` all'indirizzo `/privacy` e risponde
  **308** al percorso con l'estensione (misurato: `/index.html` → `/`,
  `/privacy.html` → `/privacy`, `/avvertenza.html` → `/avvertenza`; i tre
  percorsi senza estensione rispondono 200). Il guscio metteva in cache i
  percorsi con l'estensione, quindi `cache.add` seguiva il redirect e salvava
  una **risposta rediretta** sotto la chiave sbagliata — verificato aprendo la
  cache del sito vero: `/privacy.html` → `redirected: true`, url finale
  `/privacy`.

  Una risposta rediretta **non si può servire a una navigazione**: il redirect
  mode di una navigazione è `manual` e `respondWith` la rifiuta. E siccome
  `sw.js` è cache-first, il difetto non aspettava nemmeno l'offline. Riprodotto
  sul sito pubblicato con il service worker installato: navigare a
  `/privacy.html` dà `net::ERR_FAILED` e una pagina di errore del browser,
  **con la rete accesa**. Dalla 0.19.0 quei due link stavano nel piè di pagina
  di *ogni* schermata, e si rompevano alla seconda visita di chiunque.

  Guscio e `href` usano ora gli indirizzi che Pages serve davvero, `/privacy` e
  `/avvertenza`, in tutte e tre le pagine. Due test lo tengono fermo: il guscio
  non può contenere un percorso che finisce in `.html`, e nessuna delle tre
  pagine può avere un `href` interno con l'estensione. Rimessa la forma vecchia,
  falliscono tutti e due — provato.

- **L'autodiagnosi offline diceva «guscio e banca in cache», in verde, mentre
  due delle nove voci erano inservibili.** Controllava che la *chiave* ci
  fosse, non che la *risposta* si potesse dare: è la forma esatta del guasto
  che questo progetto insegue, in un semaforo verde. Ora ogni voce del guscio
  si apre e si guarda, e una risposta rediretta compare in rosso — «in cache ma
  non servibile: … risponde con un redirect» — e toglie il «pronto per
  l'offline». Riparare un difetto muto senza rendere visibile la sua categoria
  vuol dire pagarlo due volte.

- **La scheda offline scriveva «figure 103/102».** `/figure/index.json` sta
  nella stessa cartella, finisce nella stessa cache e veniva contato come una
  figura: il numero contato dalla cache e quello promesso da `meta.json`
  arrivavano da due fonti diverse. I disegni sono 102 e ora sono contati come
  tali. Misurato dopo lo scaricamento sul sito vero: 112 voci in cache, di cui
  103 sotto `/figure/` — 102 PNG più l'indice.

- **Il gioco dei Segnali prometteva 10 domande e ne serviva 9, 9 e 8.**
  I pool sono **27 / 9 / 9 / 8** (misurato sul motore, 200 semi per modalità:
  la lunghezza della partita è sempre 10 / 9 / 9 / 8). `domandeSegnali` non
  poteva fare altro — pesca `min(n, pool)` — ma la schermata scriveva la frase
  che si contraddice da sola, «In archivio **8** segnali; ogni partita ne pesca
  **10**», e divideva il punteggio migliore per un 10 fisso: su *diurni*,
  *nebbia* e *manovra* il 10/10 non era raggiungibile e niente diceva perché.
  Riprodotto giocando: «Segnali diurni **2 / 9** · migliore 2/**10**».

  Il numero promesso e la partita che si apre escono ora dalla stessa funzione,
  `E.lunghezzaPartita(modo)`, che sta nel motore perché è lì che si testa. Il
  test nuovo pretende che sia `min(10, pool)` e che una partita abbia
  esattamente quelle domande su cinque semi diversi; con la lunghezza riportata
  a 10 fisso fallisce.

### Aggiunto

- **`strumenti/serve.py`**, che serve il sito in locale **come lo serve Pages**:
  `/privacy` → `privacy.html`, 308 sui percorsi con l'estensione, `sw.js` con
  `Cache-Control: no-cache`. Senza di lui `python3 -m http.server` risponderebbe
  404 alle due voci nuove del guscio e l'app direbbe «guscio incompleto» per due
  file che ci sono — cioè la differenza fra locale e produzione tornerebbe
  invisibile, che è come il difetto qui sopra è arrivato fino alla 0.19.1.
  Verificato: gli stessi codici del sito vero, uno per uno. `CLAUDE.md` e il
  README indicano ora questo comando.

### Verificato sul sito pubblicato

Guidando `https://open-patente-nautica.pages.dev` nel browser, non un server
locale. Ogni numero qui sotto è misurato.

- **Versione e cache**: `sw.js` servito con `cache-control: no-cache`; service
  worker `activated` su HTTPS; unica cache `opn-0.19.1`; la schermata Info
  scrive «su questo dispositivo v0.19.1 · cache offline opn-0.19.1».
- **Tutto dalla cache**: a pagina ricaricata, navigazione e tutte e cinque le
  risorse hanno `transferSize 0` e `workerStart > 0` — **0 byte dalla rete**.
- **I flussi**, con la riga in IndexedDB controllata dopo ogni passo: batteria
  da *Oggi* 10 quesiti → 10 righe, un solo `sim_uid`; simulazione base 20
  domande, «max 4 errori», conto alla rovescia da 29:58, nessuna correzione in
  corsa, 20 righe più la riga prova 7/20; vela 5 domande in 15:00; **completa**
  che dopo un base non superato offre «Prosegui comunque con la vela» e chiude
  con due righe prova distinte; prova di carteggio, consegna a due tocchi
  («Consegna» → «Sicuro? Consegna definitivamente»), quattro esercizi di quattro
  argomenti diversi, correzione che mette la risposta ministeriale accanto alla
  tua e **non giudica lei** (`delta: null`), 3/4 → superata; giro delle tecniche
  7 esercizi per 12 tecniche, ognuno dichiara quali porta lui, **zero righe
  prova**; tappeto 5.1.3-2/-3/-4/-5, nessun già fatto, e il pulsante scende a
  120 mai fatti; drill tecniche 8 righe `_t:'t'`; una partita per ognuna delle
  quattro modalità dei Segnali con **archivio invariato, 101 → 101 righe**.
- **Scarica / azzera / ricarica**: export 18.471 byte, reimport «95 righe nuove
  · 0 già presenti · 0 scartate», e al secondo passaggio con una riga rotta
  aggiunta «1 righe nuove · 95 già presenti · 1 scartate».
- **La data d'esame**: senza data, semafori `attesa` e nessuna quota, dichiarato
  in schermata; con una data futura, «2 min al giorno fino al 27 novembre» e
  traguardo quattro giorni prima; con una data passata, «traguardo del 28 luglio
  passato».
- **Geometria a 375 px**: barra a **sette voci**, larghezza 375, altezza 63,
  overflow 0. Sbordamento orizzontale **0 px** su *Oggi*, *Carteggio*, *Allena*,
  *Segnali*, *Info*; **69 px** in *Diagnosi* e **20 px** in *Tecniche*, in
  entrambi i casi la `table.tbl` — il difetto noto delle tabelle, non
  peggiorato. Il riquadro dei difetti dichiarati si apre e si chiude (71 → 763
  px) e i suoi numeri tornano con la banca: 37 oscurati, 4 note dopo la
  risposta, 119 quesiti con figura, 102 figure distinte.
- **Console pulita**: nessun messaggio, di nessun livello, su nessuna
  schermata — audio dei Segnali compreso.

### Difetti trovati e **non** corretti qui

Sono misurati e riproducibili; non entrano in questa versione perché la loro
riparazione va pensata, non improvvisata, e perché nessuna delle due si lascia
fissare da un test delle suite attuali.

- **«Scarica i tuoi progressi» può scrivere un file incompleto, in silenzio.**
  `esporta()` scrive `S.archivio`, lo specchio in memoria, non l'archivio.
  Con **due schede** dello stesso sito aperte, le righe scritte dall'altra
  scheda non ci sono: misurato, **95 righe nel file contro 101 in IndexedDB**,
  e il pulsante dice «95 righe nel file» — vero per il file, falso per
  l'archivio. Stessa radice per la conferma di azzeramento, che ha promesso
  «Cancella **95** righe» e ne ha cancellate 101. È la sola via di salvataggio
  che l'app offre, quindi conta più di quanto sembri.
- **La revisione di una prova d'esame scrive il tempo concesso al posto di
  quello impiegato.** La riga `_t:'s'` salva `R.sim.minuti * 60000`, e la
  testata della revisione la stampa: la stessa simulazione legge «**2 minuti**»
  nell'elenco delle sessioni (che usa la durata vera, derivata) e «**30
  minuti**» nella sua revisione. Il ramo dell'allenamento, accanto, fa già la
  cosa giusta e lo dice in un commento. Il carteggio non ne soffre: lì `ms` è il
  tempo vero.

### Nota sulla misura

- L'offline **non è stato provato staccando la rete**: il pannello del browser
  non ha un interruttore per farlo e spegnere la rete della macchina avrebbe
  chiuso la sessione. Al suo posto c'è la misura più forte che si poteva fare
  da dentro: **zero byte trasferiti** a pagina ricaricata, tutte le risorse
  marcate come servite dal service worker, e l'inventario della cache voce per
  voce. È una verifica più debole di un aeroplano, e si dichiara.
- **Il ciclo di aggiornamento è stato riprodotto in locale, non su Pages**:
  richiederebbe che 0.19.2 fosse già pubblicato, e il push si chiede. Messo in
  scena un rilascio 0.19.3 sul server locale, con un dispositivo che aveva
  `opn-0.19.2` installato, la misura è quella dichiarata da sempre e mai
  verificata così: alla **prima** ricarica la pagina gira ancora sulla
  **v0.19.2** mentre la cache installata è già `opn-0.19.3` — e la schermata
  Info se ne accorge da sola, «*— diverse: ricarica due volte questa pagina per
  prendere la nuova*»; alla **seconda** legge `v0.19.3 · cache opn-0.19.3`.
  Resta da rifare sul sito vero dopo il push, su un dispositivo che ha
  `opn-0.19.1`.
- Il pannello del browser era chiuso, e a pagina nascosta Chrome strozza i
  timer a circa uno al secondo (misurato: dieci `setTimeout` da 50 ms in
  **9.766 ms**). I flussi sono stati guidati con la pagina resa udibile da un
  tono a volume minimo, che toglie la strozzatura (**512 ms** per gli stessi
  dieci timer); le misure geometriche sono state prese subito dopo uno
  screenshot, che forza il disegno, perché a pannello nascosto il viewport è
  0×0 e ogni misura sarebbe stata finta.

### Test

- 102 test sul motore (erano 101) e 105 verifiche sui dati (erano 93).

## [0.19.1] — 2026-09-04

### Corretto

- **`LICENSE` è il solo testo MIT.** La 0.19.0 aveva in coda una nota che
  escludeva i dati del decreto dalla licenza, e GitHub classificava il file
  come «Other»: il segnale più forte che il progetto è aperto — la licenza
  riconosciuta nella radice — non funzionava. La nota sta ora nel README, nella
  sezione Licenza, dove dice la stessa cosa. Nessuna modifica al sito: il bump
  serve solo a tenere `VERSION`, la cache e `meta.json` allineati, come il test
  pretende.

## [0.19.0] — 2026-09-04

Da servizio personale a sito statico pubblico: **Open Patente Nautica**. Nessun
server, nessun account, nessun database; le risposte restano nel browser di chi
studia. È la prima versione di questo repo, estratto dal progetto originario con
un primo commit solo (vedi `docs/adr/ADR-001`).

### Cambiato

- **Le quattro rotte del server sono quattro file.** `/api/seed/quiz`, `/meta`,
  `/tecniche`, `/carteggio` diventano `site/dati/*.json`, accanto alla pagina.
  I file avevano già la forma delle rotte: è cambiato l'URL, non il contenuto.
  Le 103 figure sono file statici in `site/figure/`, con `index.json` al posto
  di `/api/seed/figure-list`.
- **Via la sincronia.** Coda d'invio, flush, `fondi()`, il beacon su `pagehide`,
  la riga *Sincronia*: non esiste più niente con cui sincronizzarsi. Lo
  specchio per quesito **non si salva più**: si ricalcola dall'archivio a ogni
  avvio con `E.ripiega()`, e un test pretende che coincida con `E.applica()`
  risposta per risposta. Nel progetto originario lo specchio era una seconda
  copia da fondere col server, e la fusione ha perso giorni di studio prima di
  avere un test (0.4.5). Qui la seconda copia non esiste.
- **L'archivio delle risposte vive in IndexedDB**, una riga per risposta, nella
  stessa forma che prima viaggiava verso il server. La scelta è misurata, non
  dedotta: una riga pesa **192 byte** nel formato vero (2.000 righe generate
  dal codice della pagina, 384 KB); `localStorage` ha un tetto per origine che
  nel browser di prova ha lanciato `QuotaExceededError` a 37 milioni di
  caratteri, ma che in Chrome e Safari sta intorno ai 5 — cioè **~27.000
  risposte**, tre settimane di studio intenso ne producono 2.000 e un utente
  accanito ci arriva in un anno; e il modo in cui fallisce è il guasto di casa,
  perché `setItem` lancia e se nessuno la prende la risposta sparisce mentre la
  schermata dice che va tutto bene. IndexedDB nello stesso browser dichiara
  **3,7 GB** di quota, scrive **30.000 righe in 1,9 s** e le rilegge in 49 ms
  (11 MB su disco). Se IndexedDB non si apre, l'app ripiega su `localStorage`
  dichiarandolo nella scheda Archivio, e **lascia che `setItem` lanci**.
- **Ogni scrittura fallita si vede**: avviso rosso in schermata, pallino ambra
  su Info, e la riga «ultima scrittura fallita» nella scheda Archivio, che
  chiede di scaricare i progressi adesso. È il posto in cui prima stava la riga
  della sincronia, per la stessa ragione.
- **Le sessioni si derivano nel client**, in `engine.js` (`sessioni()`), con le
  quattro regole di `db.sessioni()`: cambio di `sim_uid`, cambio di modalità o
  banca, pausa oltre 20 minuti, **un quesito che ricompare** — la regola che fa
  il lavoro vero, perché nessuna selezione ripete un quesito dentro la stessa
  lista, ed è quella che ha separato i due screening del 31 agosto distanti
  diciannove secondi. Sette test la tengono ferma. Ogni sessione porta le sue
  righe, quindi la revisione funziona anche offline e non c'è più una seconda
  ricerca. Il riattacco per orario delle prove pre-0.8.0 non è stato portato:
  in questo archivio ogni riga nasce col suo `sim_uid`.
- **La data d'esame la scrive chi studia**, in cima a *Oggi*. Da lei si derivano
  il traguardo dei quiz (quattro giorni prima) e la data d'inizio da cui il
  semaforo misura il ritardo, che è **il giorno della prima risposta in
  archivio**: una costante derivata, non «oggi» — un inizio che si sposta con
  oggi rende l'atteso sempre zero e il semaforo sempre verde (0.4.6). Senza
  data, `traccia()` restituisce quota e giorni `null` e semaforo `attesa`, e
  la schermata scrive quanto resta e basta: prima usciva «NaN al giorno» con
  il pallino rosso, due numeri falsi con l'aria di essere una misura. Test.
- **La schermata Info si asciuga**: via stato del server, integrità
  dell'archivio, ultimo backup. Restano la versione (con il nome della cache
  installata, che dice quale versione gira davvero su questo dispositivo),
  l'archivio, l'autodiagnosi offline. Il selettore delle famiglie di tecniche
  segue le 12 tecniche derivate dai testi (Punto nave, Rilevamenti, Bussola,
  Carta) al posto delle 15 etichette della trascrizione di partenza.
- **Il service worker cambia percorsi**, e il nome della cache (`opn-0.19.0`)
  lo tiene allineato a `VERSION` **un test**, non un build step: il file
  committato è quello pubblicato. Lo stesso test pretende che `meta.json`
  dichiari la stessa versione e che il CHANGELOG abbia la voce. Nel progetto
  originario il segnaposto lo sostituiva il server; una cache dimenticata
  congelerebbe l'app sulla prima versione vista da ogni dispositivo (0.4.2).
- **`figura-008.png` non c'è più**: era byte per byte identica a
  `figura-099.png` (il paranco semplice, vela-130). È la casella di base-59,
  il quesito senza figura: nel PDF ci era finito un doppione, e pubblicare un
  doppione con il numero di un'altra figura è un abbinamento sbagliato in
  attesa di succedere. Le figure sono **102**; `meta.figure`, `index.json` e il
  conteggio dell'offline seguono, e il test dei doppioni md5 ora passa su tutti
  i file, non solo sui referenziati.

### Aggiunto

- **«Scarica i tuoi progressi» e «Ricaricali da un file»**, nella schermata
  Info. Non è un obbligo di legge — nessun dato viene trattato — ma è il
  minimo per chi userà l'app: cambio telefono, cache svuotata. Il file è
  l'archivio intero più i punteggi del gioco dei Segnali; ricaricarlo **fonde**
  per `uid` (`E.fondiArchivio()`, testata) e dice quante righe ha preso, quante
  aveva già e quante ha scartato — un pulsante che risponde «fatto» per righe
  che ha scartato è un difetto, non una scortesia. Dopo l'import lo specchio si
  ricalcola da zero. C'è anche **«Azzera i progressi»**, con la conferma in
  pagina a due tocchi, come la consegna del carteggio.
- **I difetti dichiarati in prima pagina**: un riquadro in *Oggi* con i
  quesiti oscurati, le note normative, le figure riabbinate, la figura
  mancante, la composizione delle 20 domande non letta nel decreto e le
  tecniche derivate. I numeri si contano dalla banca caricata, non si scrivono
  a mano. Il resto sta nel README e in `avvertenza.html`.
- **Le tre pagine**: `README.md`, `site/privacy.html`, `site/avvertenza.html`.
  E il link «codice sorgente» nel piè di pagina di ogni schermata, che è il
  segnale più forte che il sito è aperto: il nome è il più debole.
- **`strumenti/controlla.py`, il guardiano**, gira nella suite
  (`tests/test_dati.py`). Fallisce se nel repo rientrano le annotazioni o le
  etichette della trascrizione di partenza, il nome di chi l'aveva prodotta,
  un file di provenienza non dichiarata, o un identificatore delle macchine
  dell'autore — hostname, tailnet, indirizzo, nome — cercati come impronte
  SHA-256 dei token, così le stringhe stesse non stanno nel repo. Alla prima
  esecuzione ha pescato quattro cose che un `grep` a mano aveva mancato: due
  etichette in una voce di questo CHANGELOG, il nome in minuscolo dentro le
  etichette launchd, e il nome dell'associazione nella nota di
  `risultato.json`. Un'istruzione in un prompt è una promessa; questo è un
  controllo.
- **`tests/test_dati.py`**: le invarianti sui dati che prima ricalcolava il
  server all'avvio e che ora nessuno ricalcola più — i dieci abbinamenti
  figura, `base-226` e `base-1418`, i 37 oscurati che esistono e lo dichiarano,
  le note che non anticipano la risposta, e la più importante: **nessun
  quesito annotato ha la risposta modificata**, fissata da una tabella di 40
  risposte verificate contro il seed originario il 4 settembre 2026. Più la
  forma dei JSON, la coerenza di `meta.json` con i conteggi reali (che
  dichiarava ancora 15 tecniche), il guscio offline in due file, e il PDF del
  decreto in `fonte/` con `verifica.py` rieseguibile: 135 testi su 135, 134
  risposte su 135, la sola differenza è la «E» di `5.1.3-3`.

### Tolto

- Il tracker (`index.html` del progetto originario, le 17 sessioni del piano di
  studio), `app.py`, `db.py`, `seed.py`, `test_python.py` per la parte server e
  database, `setup.sh`, launchd, certificati, backup: niente di tutto questo
  esiste in un sito statico. Le correzioni di `seed.py` sono **già applicate**
  nei JSON pubblicati e protette dal test.
- Il campo `tecniche` della trascrizione di partenza (15 etichette) e le sei
  annotazioni didattiche che conteneva: non sono nel decreto. Al loro posto le
  12 tecniche derivate alla cieca dai testi (`strumenti/tecniche-carteggio/`),
  che coprono anche la conversione bussola → vero (32 esercizi su 135) e
  portano il giro da 10 a 7 esercizi.

### Nota

- Verificato guidando la pagina vera su un server locale: la banca carica
  senza errori in console; una batteria da *Oggi* apre 10 quesiti, la risposta
  finisce in IndexedDB con `sim_uid`, modalità e tempo; la schermata Info
  scrive `v0.19.0 · cache offline opn-0.19.0`, il conteggio delle righe,
  l'archivio in IndexedDB e lo spazio usato; la ricarica della pagina ritrova
  le risposte dall'archivio.
- 101 test sul motore (94 + 7) e 93 verifiche sui dati, tutti verdi;
  `controlla.py` passa su 29 file di testo.

## [0.18.0] — 2026-09-02

Il selettore «solo domande mai fatte» vale anche per la prova di carteggio, e
la schermata dichiara che cosa comporta.

### Cambiato

- **La prova d'esame di carteggio rispetta «solo domande mai fatte».** Prima lo
  ignorava, e con 36 esercizi su 135 già provati serviva un esercizio già fatto
  in **78 prove su 100** — misurato su 2.000 estrazioni con l'archivio vero. Chi
  aveva acceso il selettore vedeva ricomparire esercizi appena fatti e ne
  concludeva, ragionevolmente, che «gli esercizi sono sempre gli stessi».

  La pescata cieca resta il comportamento **predefinito**, ed è la regola di
  CLAUDE.md: la prova deve pescare come il ministero, che non sa che cosa hai
  studiato — una prova che ti serve solo esercizi nuovi misura quanto è vergine
  il foglio, non il voto che prenderesti. Ma un selettore che promette «solo mai
  fatte» e poi viene ignorato è esattamente il guasto muto che questo progetto
  insegue: se lo accendi vince lui.

  Sotto non c'è una selezione nuova: `componiProva()` passa da `estrai()` a
  `estraiNuoviPrima()`, che esiste dalla 0.6.0 ed è già sotto test. Quella
  funzione **ripiega** sui già visti quando i mai fatti finiscono, ed è giusto —
  la prova non deve mai uscire corta — ma è un caso che va detto, perché
  altrimenti il filtro sembra aver funzionato dove non ha potuto: la schermata
  nomina gli argomenti in cui è successo.

  Misurato con l'archivio vero, 2.000 prove per configurazione:

  | | prove con un esercizio già fatto | esercizi distinti pescati |
  |---|---|---|
  | selettore spento | 1.571 su 2.000 (78%) | 135 su 135 |
  | selettore acceso | **0 su 2.000** | 99, cioè tutti i mai fatti |

- **La riga del selettore non dice più il falso.** Leggeva «Batterie e argomenti
  pescano solo fra i N mai visti. Simulazione e screening no»; ora nomina anche
  la prova di carteggio, e limita l'esclusione alla simulazione dei quiz.

  La simulazione dei quiz **non** ha l'eccezione, ed è una scelta: la banca è
  coperta al 100%, quindi i mai visti sono zero e il selettore non cambierebbe
  niente — resterebbe solo una promessa in più da mantenere.

### Corretto

- **Il commento di `componiProva()` diceva il contrario del codice.** Recitava
  «uno per argomento, preferendo i mai visti», ed era falso dalla 0.5.1, quando
  `estrai()` è stato ridotto a un sorteggio senza storico. Il codice era giusto
  e il commento no — cioè la forma di documentazione che fra sei mesi porta a
  «sistemare» la cosa sbagliata. Riscritto, con la ragione e il rimando.

### Nota

- Verificato guidando la pagina vera su un'istanza sacrificabile caricata con
  una copia dello storico di carteggio (40 righe, 36 esercizi distinti; il
  database di produzione mai toccato): col selettore acceso, cinque prove aperte
  di fila danno venti esercizi **tutti mai fatti** e cinque composizioni diverse;
  col selettore spento la prova successiva contiene `5.4.3-4`, che era già in
  archivio — il comportamento predefinito è intatto.
- La dichiarazione sotto il pulsante è comparsa col testo giusto e i numeri veri
  («pesca fra i 99 esercizi che non hai mai provato»), e sparisce quando il
  selettore si spegne.
- 94 test sul motore e 161 verifiche Python invariati: `estraiNuoviPrima()` era
  già coperto dai suoi, e il motore non è stato toccato.

## [0.17.0] — 2026-09-02

I numeri della schermata *Oggi* si spiegano da soli: passi sopra una parola, o
la tocchi, e ti dice che cosa conta e quando si muove.

### Aggiunto

- **Le spiegazioni in schermata.** *Oggi* è fatta di numeri derivati — coperti,
  rimasti, quota, semaforo, «da ripassare» — che sono precisi ma non si spiegano
  da soli: «76» non dice se sono quesiti mai visti, sbagliati, o tutti e due.
  Finché li leggeva chi li aveva calcolati sembravano ovvi; non lo sono, ed è
  proprio l'ambiguità che ha fatto sembrare rotto un pomeriggio di ripasso
  perfettamente registrato (vedi 0.16.0).

  Otto voci, agganciate alle parole che nominano: la tessera pezzo per pezzo
  (numero grande, barra a tre colori, pallino del semaforo), «N quesiti
  rimasti», «N min al giorno», il traguardo, «N fatte oggi», «N da ripassare»,
  «N mai aperte», la quota sul numero grande del pulsante, e i due titoli
  *Che cosa faccio adesso* e *Le tue voci più deboli*.

  Ogni voce dice **che cosa conta** e, dove serve, **quando si muove**: è
  l'informazione che mancava davvero, perché un numero che non cala mentre
  lavori sembra rotto anche quando è giusto. Quella su «da ripassare» dice per
  esteso in che cosa differisce da «sbagliate», che per scelta non cala mai.

  **Funziona col mouse e al tocco**, e non è un dettaglio: col mouse si apre
  passandoci sopra, al tocco toccando. Un aiuto che esiste solo in hover, su un
  telefono, non esiste — ed è la stessa lezione della 0.7.0, dove il
  suggerimento dei tasti era stato mostrato solo sui dispositivi con tastiera
  *dichiarandolo*. Si chiude toccando altrove, uscendo col mouse, con Esc, o
  scorrendo. Con la tastiera i richiami fuori dai pulsanti prendono il fuoco e
  rispondono a Invio; quelli **dentro** i pulsanti no, di proposito: un elemento
  focalizzabile dentro un `<button>` ruberebbe il fuoco al pulsante.

  Il segno è un `?` piccolo accanto alla parola, non un semplice sottolineato:
  al tocco un sottolineato non si distingue da un link e nessuno lo prova.

### Corretto

- **Toccare un richiamo dentro un pulsante non fa più partire una batteria.**
  Il gestore dei click fa `ev.target.closest('button')`, che dai richiami dentro
  i pulsanti di *Oggi* risaliva al pulsante esterno. L'intercettazione sta ora
  in cima al gestore, prima di tutto il resto.

### Nota sulla misura

- **I richiami andavano a capo uno per riga, e il pulsante passava da 88 a
  193 px.** Causa: `.go .t span{display:block}` (riga 80) è più specifica della
  classe `.sp`, quindi vinceva lei. È la stessa trappola della 0.7.2, dove una
  regola più specifica aveva reso invisibile il suggerimento dei tasti — e come
  allora è saltata fuori **misurando la geometria**, non leggendo il DOM. `.sp`
  usa `display:inline!important`, che qui è la scelta giusta e non pigrizia: è
  una classe di utilità che finisce dentro contenitori con regole discendenti
  già scritte, tutte più specifiche di una classe sola.
- Un primo tentativo metteva **tre** richiami per tessera (numero, barra,
  pallino): nove `?` in un blocco di 375 px, che spezzavano il numero grande su
  due righe. Accorpati in una voce sola sul nome della tessera. Misurato dopo:
  altezza della tessera **invariata** (155 px), pulsante da 88 a 107 px — una
  riga in più per i quattro `?` — e nessuno sbordamento orizzontale.
- Verificato sull'istanza sacrificabile con una copia dell'archivio: tocco su un
  richiamo dentro il pulsante → si apre la spiegazione e **il runner non parte**;
  secondo tocco → si chiude; Esc → si chiude; passaggio del mouse → si apre e
  uscendo si chiude; il pannello resta dentro lo schermo sia in alto sia in
  fondo alla pagina. Il pannello ha un tetto di altezza con scorrimento, perché
  la voce più lunga sta in 343 px e su uno schermo basso uscirebbe.

## [0.16.0] — 2026-09-02

Il ripasso avanza invece di ripetersi, e il pulsante di *Oggi* apre davvero i
quesiti che promette. Due difetti diversi con la stessa firma: un numero in
schermata e una lista che non venivano dalla stessa fonte.

> **Fuori dal freeze, e dichiarato.** Il codice doveva essere congelato dal 31
> agosto, e questa versione esce il 2 settembre, la sera prima dell'esame. È
> stata fatta su richiesta esplicita, dopo che i due difetti sono stati
> riprodotti sull'archivio vero: con la banca ormai interamente coperta, due
> modalità di allenamento su sei erano inutilizzabili e una terza riproponeva
> sempre le stesse domande. Il rischio è reale e si accetta sapendolo.

### Corretto

- **«Solo sbagliate» riproponeva ogni volta le stesse domande, dall'inizio.**
  Il sintomo riferito — «se uso solo sbagliate ripeto sempre le stesse
  dall'inizio» — era esatto, e la causa è che l'ordinamento era per `lw`
  decrescente, la data dell'ultimo errore. **`lw` non si muove quando riprendi
  il quesito**: cambia solo se lo risbagli. Quindi chi avevi appena sistemato
  restava in testa per sempre, e senza mescolamento né segnaposto `slice(0, n)`
  ritagliava sempre la stessa fetta.

  Misurato sull'archivio vero, non dedotto: i primi dodici che la modalità
  avrebbe riproposto erano, **nello stesso ordine**, i primi dodici già fatti
  mezz'ora prima. E dei primi 50, **43 erano già stati ripresi e solo 7 avevano
  un errore ancora aperto** — perché un errore commesso e corretto in giornata
  ha `lw` di oggi, quindi vince su un errore del 13 agosto mai più toccato.
  L'86% della sessione andava su lavoro già fatto, e i 60 errori più vecchi
  restavano sepolti dove non li raggiungevi mai.

  L'ordine ora ha tre chiavi: **chi ha l'errore ancora aperto** prima di chi
  l'ha già ripreso; poi il **più trascurato**, cioè `t` crescente, l'ultima
  volta che l'hai toccato; a parità, `lw` decrescente, che era l'intenzione
  originale della 0.5.1 e resta giusta come spareggio.

  La seconda chiave è quella che fa il lavoro: quello che hai appena fatto
  scende in fondo **da solo**, quindi la lista avanza **senza segnaposto** —
  nessuno stato nuovo da mantenere né da perdere. È la stessa idea di
  `tappeto()` della 0.11.0: la ripresa è gratis per costruzione perché è
  derivata, non memorizzata.

  La regola della 0.5.1 non cambia: chi hai ripreso **resta in elenco**, perché
  sbagliarlo una volta è un'informazione che non scade. Ma restare in elenco e
  stare in testa sono due cose diverse — non si nasconde niente, si mette in
  fondo. Verificato sull'archivio vero: tre giri da 50 danno 50, 26 e 0 errori
  ancora aperti (i 76 aperti si esauriscono in due giri), tutte liste diverse, e
  in elenco restano sempre tutti e 175.

- **Il pulsante di *Oggi* prometteva 76 quesiti e ne apriva zero.** Premendo
  «Quiz base» compariva «Niente da fare con questa selezione». Stessa cosa per
  «Quiz vela» e per la modalità **Per argomento**.

  Due definizioni diverse di «quel che resta» dentro lo stesso pulsante: il
  sottotitolo e il numero grande usavano `rimanenti` di `traccia()`
  (`totale - coperti`, cioè i mai visti **più** quelli sbagliati e non ancora
  ripresi), mentre il clic costruiva una `coda()` con gli stati di default, che
  esclude i `chiuso` e quindi tiene **solo i mai visti**. Finché c'erano mai
  visti il difetto non si vedeva; il 2 settembre sono arrivati a zero — banca
  interamente coperta, 1.472 su 1.472 e 250 su 250 — e il pulsante è diventato
  muto.

  È **la stessa forma** del difetto riparato nella 0.13.3 per «Allena questa
  voce», dove `coda()` agli stati di default svuotava la lista appena una voce
  era coperta. Lì la riparazione fu `vociDaAllenare()`; il pulsante di *Oggi* e
  la modalità Per argomento erano rimasti con lo schema vecchio.

  Ora tutti e tre passano da una funzione sola, `daAllenare()`, che compone
  quattro chiamate al motore — **aperte → mai visti → già riprese → il resto**
  — e i primi due gruppi sono *esattamente* `rimanenti`. Numero promesso e lista
  aperta vengono dalla stessa fonte, quindi non possono più divergere. Il
  selettore «solo mai fatte» continua a vincere quando è acceso, e lì il
  pulsante è già disabilitato da sé perché conta `t.nuovi`.

### Cambiato

- **L'anteprima di «Solo sbagliate» distingue le aperte dalle riprese.** Diceva
  «175 sbagliate in tutto», e quel numero **non cala mai**: ripassare non
  produceva nessun segnale in schermata. Ora legge «175 sbagliate in tutto: 76
  ancora aperte, 99 già riprese. Ne prendo 50, le più trascurate per prime».
  I due numeri esistevano già — `classifica()` li separa dalla 0.6.0 — mancava
  soltanto di scriverli, ed è il motivo per cui una sessione da 53 risposte è
  sembrata non aver lasciato traccia. La lasciava: «da ripassare» nella
  schermata *Oggi* era sceso da 117 a 76.
- **La colonna *Sbagliate* della Diagnosi diventa *Aperte*.** Mostrava il totale
  storico, che per la regola della 0.5.1 non cala mai: dopo un pomeriggio di
  ripasso quella tabella era identica a prima. Ora il numero grande è quello che
  si muove — le sbagliate con l'errore ancora in piedi — e il totale sta sotto
  in piccolo, con lo stesso idioma della colonna *Fatti*: «15 su 47».

  Non è una colonna in più, ed è deliberato: la settima colonna spingerebbe
  *Copertura* fuori dallo schermo, com'è già scritto accanto alle barrette
  dell'andamento. Misurato sull'archivio vero a 375 px, sostituendo il contenuto
  nella stessa cella per isolare la differenza: la tabella passa da 435 a 415 px
  (temi) e da 428 a 409 (voci), quindi lo sforamento **cala di 20 px** invece di
  crescere — «Aperte» è più stretta di «Sbagliate», e la riga piccola non allarga
  la colonna. I 435 px di partenza confermano gli 89 px di sforamento dichiarati
  nella 0.12.0, che resta un difetto aperto e non peggiorato.

  `diagnosi()` calcola ora `aperti` accanto a `sbagliati`, per tema e per voce.
  Lo stesso numero corregge gli altri tre punti che mostravano il totale immobile:
  le spunte degli argomenti in *Per argomento* («5 aperte»), quelle in *Solo
  sbagliate* («15 aperte su 47»), e la tessera del drill tecniche.

- **«Cosa studiare adesso» non propone più lavoro già fatto.** `consigli()`
  calcolava `daFare = mai visti + sbagliati`, e i `sbagliati` comprendono i già
  ripresi: una voce interamente ripassata restava in elenco, e i minuti
  dichiarati contavano lavoro finito — sull'archivio del 2 settembre 175 quesiti
  invece dei 76 veri, cioè 2,3 volte il tempo reale. Ora conta gli `aperti`. La
  regola dichiarata nel commento della funzione — «non compare una voce che non
  ha niente da fare» — finalmente è vera.

- Il conteggio dell'anteprima e quello del filtro figure vengono ora dalla
  **stessa** funzione che costruisce la lista. Contarli in due modi diversi era
  la causa prima del difetto qui sopra. `daAllenare()` restituisce però **due**
  numeri e non uno: la lista intera, in ordine di priorità, perché una batteria
  non deve restare a corto di domande; e quanto è davvero arretrato. L'anteprima
  scrive il secondo — «76 da fare nel filtro, poi si ripassa» — perché dire
  «1.472 da fare» sarebbe la bugia opposta a quella riparata qui.
- Rimossa `statiEffettivi()`, rimasta senza chiamanti.

### Test

- 94 test sul motore (erano 90). I due che contano di più sono l'invariante che mancava da
  sempre e che avrebbe preso **sia** questo caso **sia** quello della 0.13.3:
  fatta la lista e riaperta, **la seconda non ripete la prima** finché ce n'è
  altra — verificato su tre giri di fila — e chi ha l'errore ancora aperto viene
  prima di chi l'ha ripreso, anche quando il ripreso è più vecchio. Aggiornato
  il test della 0.5.1 che fissava il vecchio ordine: adesso pretende quello
  nuovo e in più che un quesito ripreso finisca **in coda** invece che in testa.
  Gli altri due nuovi fissano `aperti` per tema e per voce — il totale storico
  non cala, le aperte sì — e il fatto che una voce interamente ripassata esca
  dai consigli con zero minuti invece di restarci col lavoro già fatto.
  Le 161 verifiche Python restano invariate: il server non è stato toccato.

### Nota

- Verificato con `engine.js` vero e una copia di `/api/progress` vero, non con
  dati finti: il pulsante base promette 76 e apre 76 quesiti, tutti con l'errore
  ancora aperto; quello vela promette 2 e apre 10 (il minimo di dieci, con 2
  aperti e 8 di completamento); l'invariante «se dichiaro N > 0 allora apro
  qualcosa» regge su entrambe le banche.
- E poi guidando la pagina vera su un'**istanza sacrificabile** (127.0.0.1:8611,
  `PATENTE_HOME=/tmp/ptest`) caricata con una copia dell'archivio via
  `/api/attempts` — 1.965 righe, zero scartate, il database di produzione mai
  sfiorato. Il pulsante «Quiz base» apre il runner con il primo quesito marcato
  «già sbagliato» invece di «Niente da fare»; le anteprime leggono «76 da fare
  nel filtro, poi si ripassa» e «175 sbagliate in tutto: 76 ancora aperte, 99
  già riprese»; la colonna *Aperte* mostra 15 su 47, 8 su 19, 17 su 32, e la
  somma per tema torna ai 76. Nessuno sbordamento orizzontale fuori dalle due
  tabelle già note.

## [0.15.0] — 2026-09-02

### Cambiato

- **La simulazione d'esame non pesca più i 37 quesiti oscurati.** All'esame vero
  non possono uscire, quindi una prova che li sorteggia non misura più il voto
  che prenderesti — che è l'unica cosa per cui la simulazione esiste. È la
  stessa ragione per cui `estrai()` non guarda lo storico: la prova deve
  somigliare all'esame, non allo studio.

  **Solo la simulazione.** Batterie, screening, Mirata e per argomento
  continuano a pescarli: lì si impara, e su un quesito oscurato c'è comunque
  qualcosa da imparare — e dalla 0.14.1 la nota che compare *prima* di
  rispondere dice che si può saltare. Misurato: la coda di una batteria sulla
  banca base resta 1.472 quesiti, 37 dei quali oscurati; uno screening a 6 per
  voce ne contiene 4; una simulazione, zero.

  Il filtro è nel motore (`oscurato()` in `engine.js`), come tutta la
  selezione, e legge un campo suo — `osc` — **non** la presenza della nota.
  Sono due mestieri diversi: uno decide che cosa si scrive in schermata,
  l'altro se il quesito può essere sorteggiato, e legarli vorrebbe dire che
  riscrivere un testo sposta un sorteggio.

### Test

- 90 test sul motore (erano 87) e 161 verifiche Python (erano 159): la
  simulazione senza oscurati su quattro semi diversi **con la composizione
  ministeriale che regge** (togliere 37 quesiti non deve sfaldare i pesi per
  tema), la vela che applica lo stesso filtro anche se oggi non ha oscurati, e
  `oscurato()` che legge il campo e non la nota.

### Nota

- Verificato sull'istanza sacrificabile: **500 simulazioni, 10.000 domande
  pescate, zero oscurati**, e una sola composizione per tema in tutte e 500 —
  quella del decreto. Sulla vela, 1.000 affermazioni e zero oscurati.
- Durante la verifica la prima misura diceva «182 oscurati pescati su 300
  prove», cioè che il filtro non funzionava. Non era vero: il browser stava
  servendo `engine.js` dalla cache `patente-0.13.2` del service worker, e
  quella copia la funzione nuova non ce l'aveva. È **la stessa trappola** che
  ha fatto sembrare assente l'avviso di oscuramento sul telefono. Vale la pena
  scriverlo perché la misura sbagliata era perfettamente plausibile: prima di
  concludere che una modifica al motore non funziona, si controlla che il
  browser stia eseguendo *quella* versione — `caches.keys()` lo dice in un
  secondo.

## [0.14.1] — 2026-09-02

### Cambiato

- **L'avviso di oscuramento compare prima di rispondere, non dopo.** Nella
  0.14.0 tutte le note stavano a risposta data, per una regola sensata — una
  nota letta prima sarebbe un suggerimento — applicata però a tutte e tre
  senza distinguere. Sull'oscuramento quella regola non vale: sapere che un
  quesito è stato ritirato dal ministero **non dice quale risposta sia
  esatta**, e soprattutto è l'unica nota che cambia che cosa fai *adesso* —
  se all'esame non uscirà, lo salti. Letta dopo arriva quando la decisione è
  già presa, e in modalità **auto** la schermata passa da sola dopo un
  secondo: l'avviso lampeggiava e spariva.

  Le altre due restano dove erano, perché la risposta la anticipano per
  davvero: «anche l'altra sarebbe corretta» (1.3.3-5), «la norma nuova
  ribalta la risposta» (1.3.3-32), «ne segue verso il lato sinistro»
  (1.3.8-15) sono suggerimenti belli e buoni se letti prima.

  In pratica il campo è diventato due: `nbp` (prima, solo l'oscuramento) e
  `nb` (dopo, quelle che toccano la risposta). Sul quesito dei flap, che è
  tutti e due, prima si vede solo l'oscuramento e il ragionamento arriva a
  risposta data.

### Test

- 159 verifiche Python (erano 156), e le due che contano sono nuove: **ogni
  oscurato dichiara prima di rispondere**, e **nessuna nota che anticipa la
  risposta finisce fra quelle mostrate prima**. La seconda è quella che
  impedisce, fra sei mesi, di spostare una nota nel campo sbagliato e
  trasformarla in un suggerimento.

### Nota

- Verificato sull'istanza sacrificabile su schermo da 375 px, quesito per
  quesito: uno normale non mostra niente né prima né dopo; un oscurato mostra
  93 px di avviso prima e dopo; uno solo normativo (1.3.3-5) non mostra niente
  prima e 129 px dopo; il flap mostra 93 px prima e 93 + 129 dopo. In tutti i
  casi le risposte restano visibili e non c'è sbordamento orizzontale.

## [0.14.0] — 2026-09-02

La banca d'esame è del 2022, le dotazioni di sicurezza sono cambiate nel 2024, e
il ministero ha oscurato 37 quesiti. Adesso l'app lo dice.

### Aggiunto

- **I 37 quesiti oscurati dal MIT lo dichiarano in schermata.** Con la circolare
  prot. n. 30432 del 15 novembre 2024, dopo il DM 133/2024, il ministero ha
  oscurato i quesiti non più conformi al regolamento: non possono essere
  sorteggiati per comporre la scheda d'esame, e in aula compaiono barrati. Ora
  ognuno di quei quesiti, **a risposta data**, scrive che all'esame non uscirà.

  Restano in banca invece di sparire, ed è una scelta: toglierli cambierebbe i
  conteggi, la copertura e le quote, e soprattutto cancellerebbe dallo storico
  dei quesiti a cui si è già risposto. Costano meno da lasciare che da
  togliere.

  L'abbinamento con la banca merita una riga perché la circolare usa una
  numerazione da corso (`02019`, `03047`…) e non il progressivo del decreto: si
  abbina per **testo della domanda più risposta esatta**. Il solo testo non
  basta, e non è teoria — la banca ha tre quesiti che iniziano tutti con
  «L'ancora galleggiante:» e due identici sul faro di Capo Negro, e il primo
  tentativo fatto sul solo testo aveva pescato quello sbagliato in entrambi i
  casi. Che tutti e 37 finiscano su id distinti, e che la risposta esatta citata
  dalla circolare coincida con quella della banca, è anche la prova che la
  circolare parla di questa banca.

- **Undici quesiti divergono dal DM 133/2024, e ora lo dicono.** Il decreto
  riscrive l'allegato V del DM 146/2008 — la tabella delle dotazioni minime per
  fascia di distanza dalla costa — ed è in vigore dal 21 ottobre 2024. La banca
  è l'Allegato A al DD 131/2022: è anteriore di due anni. Le divergenze trovate
  confrontando quesito per quesito:

  | Quesito | La banca dice | Il decreto 2024 dice |
  |---|---|---|
  | 1.3.3-23 | senza limiti: 4 fuochi + 4 razzi | **3 + 3** |
  | 1.3.3-41 | entro 50 miglia: 3 fuochi | **2** |
  | 1.3.3-42 | entro 50 miglia: 3 razzi | **2** |
  | 1.3.3-32 | entro 12 e entro 50 hanno dotazioni *diverse* | **identiche** (2+2) |
  | 1.3.3-5 | entro 12 l'orologio non è obbligatorio | **lo è** |
  | 1.3.3-6 | mezzi individuali = cinture | **giubbotti categorizzati 150/100**, con luce automatica e numero di iscrizione |
  | 1.3.3-9 | entro 12 il mezzo collettivo è la zattera costiera | **sostituibile** dal battello pneumatico con kit |
  | 1.3.3-36 | zattera non costiera oltre le 12 miglia | dentro l'area SAR con geolocalizzazione **basta la costiera** |
  | 1.3.3-2 | natante entro 6 miglia: almeno 1 estintore | per le unità CE lo dice il **manuale del proprietario** |
  | 1.3.3-21, 1.3.3-25 | scadenze fisse (4 anni, 2 anni) | si osservano le **raccomandazioni del fabbricante** |

  Otto di questi sono anche nell'elenco degli oscurati; tre no, e per quelli la
  nota resta l'unica avvisaglia.

  **Nessuna risposta è stata cambiata**, e c'è un test che lo pretende. Vale la
  regola della 0.13.2: non si sa se la commissione usi la banca 2022 o quesiti
  aggiornati, e insegnare la norma nuova al posto della risposta d'esame
  costerebbe il punto. Si dichiara, non si ribalta.

  Su un quesito **oscurato** il dettaglio normativo si omette: è discorso
  chiuso, e allungare la nota su un quesito che non vedrai più rende solo più
  faticose quelle che contano.

### Nota sul metodo

- La tabella dell'allegato V è stata letta **come immagine**, rasterizzando la
  pagina del PDF della Gazzetta. L'estrazione del testo collassa le colonne:
  letta così, gli obblighi finiscono nella fascia di distanza sbagliata e si
  scriverebbe con sicurezza una cosa falsa. È lo stesso principio delle figure
  della 0.12.0 — un dato che non si può verificare a macchina si guarda.
- **Non** sono state annotate le equivalenze che il decreto aggiunge senza
  cambiare nessuna risposta (EPIRB sostituibile dal telefono satellitare, fuoco
  a mano dal LED SOLAS, bussola magnetica da quella elettronica, carte nautiche
  dalla cartografia elettronica, campana da un dispositivo sonoro portatile):
  sono vere, ma su quesiti che restano corretti l'avviso diventerebbe rumore.
- Verificato anche il contrario, e vale la pena scriverlo: i quesiti 1.3.1-21 e
  1.3.1-22 sulla revisione degli estintori («mai, basta il manometro sul
  verde») **concordano** con il decreto nuovo, che dice espressamente «la
  verifica periodica degli estintori non è richiesta».
- Fonti: [DM 17 settembre 2024 n. 133](https://www.gazzettaufficiale.it/eli/gu/2024/09/21/222/so/35/sg/pdf)
  (GU n. 222 del 21 settembre 2024, S.O. 35/L) e la circolare MIT 30432 del
  15 novembre 2024, il cui conteggio di 37 quesiti coincide con quelli abbinati.

### Test

- 156 verifiche Python (erano 145): i 37 oscurati esistono tutti in banca e
  dichiarano di esserlo, gli 11 divergenti portano la nota con la fonte, la
  precedenza fra le note, e — l'invariante che conta — **nessuno dei quesiti
  annotati ha la risposta modificata** rispetto a `data/seed/`.

## [0.13.3] — 2026-08-31

### Corretto

- **«Allena» sotto le voci deboli smetteva di funzionare, e senza dire niente.**
  Il sintomo riportato — «la prima volta funziona e poi non più» — era esatto, e
  la causa è che il pulsante costruiva la lista con `coda()` agli stati di
  default, che **esclude i `chiuso`**. Bastava aver risposto una volta a ogni
  quesito della voce perché la lista uscisse vuota, e `apri()` su una coda vuota
  faceva `return` in silenzio: nessuna schermata, nessun messaggio, un pulsante
  morto.

  Misurato sulla copia dell'archivio vero, non dedotto: delle cinque voci in
  elenco, **due erano già pulsanti morti** — «Leggi e regolamenti» 98 quesiti su
  98 già risposti, «Elementi di navigazione stimata» 72 su 72. E sono il caso
  rovesciato: una voce che hai coperto **e continui a sbagliare** è esattamente
  quella da riprendere; il pulsante si spegneva proprio quando serviva.

  Ora la lista è la voce intera, nell'ordine che serve a ripassarla: **prima le
  sbagliate** (dall'errore più recente), poi i mai visti, poi le altre. Sono tre
  chiamate al motore composte — `soloSbagliate` e `includiChiusi` esistevano già
  — non una selezione nuova scritta nella pagina. Verificato: tutte e cinque le
  voci si aprono, con 98/49/72/32/56 quesiti (i conti esatti della banca) e il
  primo quesito marcato «già sbagliato».

  Il pulsante **ignora di proposito «solo domande mai fatte»**, e adesso c'è
  scritto sotto l'elenco: è la stessa ragione per cui dalla 0.10.0 spegne il
  filtro figure — un filtro globale che svuota la lista senza dirlo è il guasto
  di casa.

- **Una coda vuota non è più un silenzio.** `apri()` mostra «Niente da fare con
  questa selezione» invece di uscire senza traccia. Gli altri punti d'ingresso
  hanno l'anteprima che disabilita *Inizia* prima di arrivare qui, ma i pulsanti
  di *Oggi* no: erano l'unico posto dove un clic poteva non produrre niente.

### Nota

- La visibilità dell'avviso è stata verificata togliendo la transizione CSS e
  misurando la regola invece dell'animazione (opacity 1, 208×26 px in alto a
  destra, testo rosa su fondo rosso scuro): in un pannello del browser non
  dipinto le transizioni restano ferme sul valore iniziale, e leggere quello
  avrebbe fatto concludere che l'avviso non compare. È lo stesso meccanismo del
  «N inviate» della riga di sincronia, che in produzione si vede ogni giorno.

## [0.13.2] — 2026-08-31

### Aggiunto

- **Un quesito la cui risposta ministeriale sembra sbagliata ora lo dichiara,
  e la risposta non cambia.** Il caso è `base-405` (1.3.8-15): *«Alzando il
  flap sinistro o abbassando il flap destro, si ottiene:»*, dato per esatto
  «di inclinare lo scafo verso il lato dritto».

  Due argomenti indipendenti dicono il contrario, ed è **sinistro**:
  l'idrodinamica — un flap abbassato devia l'acqua verso il basso e riceve una
  spinta verso l'alto, quindi solleva la poppa *dalla sua parte*, ed è la
  ragione per cui uno sbandamento a dritta si corregge abbassando il flap di
  dritta; e la banca stessa, dieci quesiti prima — `base-401` dice che i flaps
  abbassati «contrastano la tendenza della carena ad alzare la prua», `base-402`
  che alzati «schiacciano la poppa verso il basso». Applicato al 405: alzo il
  flap sinistro, schiaccio la poppa sinistra, scendo a sinistra. Le due metà
  della frase danno la stessa risposta, e non è quella marcata.

  **La risposta esatta non è stata toccata**, e non è un compromesso.
  `CORREZIONI_RISPOSTA` esiste per i due casi *rilevabili* — due risposte
  esatte (`base-226`) o nessuna (`base-1418`) — dove il caricamento si accorge
  da solo che qualcosa non torna. Qui una sola risposta è marcata: correggerla
  significherebbe sostituire il decreto con la propria convinzione, senza avere
  il testo del decreto sotto gli occhi. E all'esame corregge il ministero:
  insegnare la risposta «giusta» costerebbe il punto.

  Quello che si può fare senza rischi è dirlo. `QUESITI_DUBBI` in `seed.py`
  attacca al quesito una nota che compare **a risposta data** — mai prima,
  sarebbe un suggerimento — sotto il verdetto, nel riepilogo di fine prova e
  nella revisione di una sessione riaperta. Serve a non far dubitare di sé chi
  ha ragione, che a tre giorni dall'esame costa più del punto.

### Corretto

- **La riga del verdetto non va a capo, e la nota la faceva scoppiare.** Con un
  figlio in più `.verdict` (un flex senza `flex-wrap`) schiacciava la nota a
  85 px di larghezza e 709 di altezza su uno schermo da 375, spingendo le
  risposte fuori dallo schermo. Misurato sul telefono, non dedotto: `flex-wrap`
  sul contenitore e `flex:1 0 100%` sulla nota, che ora è 343×129 px su 375 e
  1148×56 su desktop, sempre sopra le risposte e dentro lo schermo.

### Test

- 145 verifiche Python (erano 142): la nota c'è, **la risposta esatta è ancora
  quella del decreto**, e le note sono solo quelle dichiarate. La seconda è la
  più importante: è quella che si sarebbe tentati di «sistemare» fra sei mesi
  senza ricordare perché non si doveva.

## [0.13.1] — 2026-08-31

### Cambiato

- **«Le sessioni che hai fatto» trasloca in Diagnosi**, in fondo, sotto *Per
  voce*. È diagnostica: sta accanto alle tabelle che dicono dove sei debole,
  non fra i controlli con cui si sceglie la prossima batteria. In *Allena* c'è
  quello che serve a decidere in avanti, in *Diagnosi* quello che serve a
  guardare indietro. Sotto il titolo c'è scritto che l'elenco **non segue** i
  selettori Base/Vela della schermata: un elenco che si dimezza in silenzio
  quando tocchi un filtro che sembra riguardarlo è la trappola di casa.

### Nota

- Verificato sull'istanza sacrificabile con una copia dell'archivio vero (poi
  cancellata): l'elenco è sparito da *Allena* (zero elementi) e compare in
  *Diagnosi* con le sue 15 sessioni; una riga aperta da lì porta allo stesso
  riquadro di revisione, e nello screening da 248 il blocco 233 è
  `base-476` — «Durante la stagione balneare, quale percorso devo seguire per
  raggiungere la riva». Righe 1086×57 px sul desktop, 75 px sul telefono a
  375 senza sbordamento. Anche stavolta la misura è geometrica e non uno
  screenshot: la cattura del browser di prova continua a restituire solo il
  fondo perché il riquadro è collassato a 0×0.
- Confermato l'indirizzo di produzione: risponde **200**, e il certificato è
  valido anche **senza** `-k` (emesso per il nome del nodo sulla rete privata,
  scadenza 7 ottobre 2026, quindi dopo l'esame).

## [0.13.0] — 2026-08-31

Ogni sessione di allenamento diventa una sessione: si vede in elenco e si
riapre. Anche quelle già in archivio, che non erano mai state registrate.

### Corretto

- **«Le prove che hai fatto» esisteva solo per la simulazione d'esame.** Non
  era un problema di posizione dell'elenco: era che le altre sessioni non
  esistevano. La riga in `sim` la scriveva `fine()` e solo `if (R.sim)`, e il
  `sim_uid` sulle risposte nasceva con `opt.sim ? uid() : null`. Quindi una
  batteria, uno screening, una Mirata o una passata per argomento lasciavano
  soltanto un mucchio di righe in `attempt`: nessun inizio, nessuna fine,
  nessun punteggio, niente da riaprire.

  Quanto costava, misurato sull'archivio vero: il 31 agosto ci sono **334
  risposte in modalità screening** fra le 15:22 e le 17:35. Per sapere che
  erano **due** screening e non uno — 86 e 248 — è servita un'indagine su
  SQLite. La domanda «com'era la 232ª del mio ultimo screening» era, in
  pratica, senza risposta.

### Aggiunto

- **`GET /api/sessioni` e l'elenco «Le sessioni che hai fatto»**, nella
  schermata Allena e **fuori dai riquadri di modalità**, quindi visibile
  qualunque modalità sia selezionata. Ogni riga si tocca e riapre la sessione:
  le domande di quella volta, con la tua risposta accanto a quella esatta —
  la stessa revisione della 0.8.0, che finora era riservata alle prove.

  **Le sessioni si derivano dalle risposte, non si scrivono in una tabella.**
  È la scelta che fa la differenza: una tabella nuova avrebbe registrato le
  sessioni *da adesso in poi*, lasciando invisibile tutto quello che c'era già
  — cioè esattamente la parte che mancava. Derivandole, i 675 tentativi in
  archivio diventano subito 15 sessioni, dal 13 agosto in avanti, senza
  migrazione e senza una tabella di stato da riparare. È lo stesso principio
  di copertura, quote e diagnosi: lo storico è fatto di fatti, il resto si
  calcola in lettura.

  Una sessione si chiude quando cambia `mode` o `kind`, quando passano più di
  20 minuti, o quando **ricompare un quesito già uscito** — nessuna modalità
  di selezione ripete un quesito dentro la stessa lista, quindi un doppione è
  per forza una lista nuova. È la regola che ha separato i due screening del
  31 agosto, dove la pausa fra l'uno e l'altro era di diciannove secondi.

- **Ogni sessione porta il suo `sim_uid`**, non solo le prove d'esame: da
  adesso il confine è **registrato**, non dedotto. La colonna c'era già dalla
  0.8.0 ed era NULLabile, quindi non serve nessuna migrazione — cambia una
  riga in `apri()`.

  Le due cose convivono e si dichiarano, come già faceva la 0.8.0 con la sua
  ricostruzione per orario: una sessione con il legame scritto non porta
  etichette, una ricostruita dice **«confine ricostruito»** in elenco e spiega
  in testa alla revisione da che cosa è stato dedotto. Affidabile non è la
  stessa cosa di registrato, e la differenza si scrive.

- Le **simulazioni precedenti alla 0.8.0** si riattaccano alla loro riga di
  `sim` per orario, invece di comparire due volte: una come prova con l'esito
  e una come sessione anonima senza.

### Cambiato

- **Un allenamento non porta un verdetto**, in elenco né in revisione: dice
  «Screening · 86% esatte», non «Non superata». Una soglia da superare ce
  l'hanno solo le prove d'esame, e bocciare qualcuno per una soglia che non
  esiste è inventarsi un giudizio. Stessa regola della 0.11.0 per il giro
  delle tecniche e il tappeto.
- **Due tempi diversi, e si dice quale**: `ms` è la somma dei tempi di
  risposta, `durata` è da capo a coda. Sullo screening lungo del 31 agosto
  sono 97 minuti contro 107 — la differenza sono le pause — e in schermata va
  la seconda, che è quella che si intende leggendo «107 minuti» accanto a
  un'ora di inizio.
- Una sessione appena chiusa **offline** compare comunque in elenco, pescata
  dalla coda locale e marcata «in coda»: l'app non deve dire «nessuna
  sessione» un minuto dopo averne chiusa una. Stessa ragione per cui la 0.8.0
  aveva fatto lo stesso con le prove.
- Finché una lettura di `/api/sessioni` non è riuscita, la schermata dice che
  **l'elenco sta sul server e il server non risponde**, non «nessuna sessione
  ancora»: non sapere e non avere niente sono due cose diverse, e confonderle
  è la forma tipica del guasto muto qui dentro.

### Test

- 142 verifiche Python (erano 129): il ritaglio in sessioni sulle quattro
  regole una per una, che nessuna risposta si perda nel ritaglio, il
  punteggio per sessione, la riapertura di un allenamento (riga di prova
  sintetizzata, `allenamento: true`, nessun verdetto), la fonte dichiarata, e
  la simulazione pre-0.8.0 riattaccata alla sua prova. Gli 87 test sul motore
  restano invariati: `engine.js` non è stato toccato.

### Nota

- Verificato su un'istanza sacrificabile caricata con una **copia** dell'archivio
  vero preso da `/api/dump` (mai il database di produzione): 675 risposte → 15
  sessioni, con la somma dei conteggi che torna al totale, i due screening del
  31 agosto separati a 86 e 248, le simulazioni riattaccate alle loro prove, e
  lo screening da 248 riaperto con tutti e 248 i blocchi — dove la 232ª è
  `base-1371`, «Quale tra le seguenti affermazioni sul noleggio di unità da
  diporto è corretta?», presa. La copia è stata cancellata a fine sessione.
- L'ultima verifica in schermata è stata fatta **misurando la geometria**
  (righe 806×57 px sul desktop e 375 px senza sbordamento sul telefono, stili
  calcolati, colori di primo piano) e non guardando uno screenshot: la cattura
  del browser di prova ha smesso di funzionare a metà sessione e restituiva
  solo il fondo. È una verifica più debole di un'occhiata, e si dichiara.

## [0.12.0] — 2026-08-31

Dieci quesiti su 120 mostravano il disegno di un altro quesito. E la Diagnosi
smette di dire soltanto dove sbagli: dice che cosa studiare adesso.

### Corretto

- **Dieci quesiti con figura mostravano la figura sbagliata.** Il sintomo l'ha
  visto l'autore studiando — «diverse domande sembrano errate, magari le
  immagini non corrispondono» — su tre screenshot, di cui uno inequivocabile:
  al quesito «il simbolo rappresentato in figura indica: l'ancoraggio vietato»
  usciva il disegno di un **paranco**.

  La causa sta nel README del seed, scritta da sempre e mai letta come un
  rischio: il decreto non contiene il legame quesito → disegno in forma
  leggibile — nella cella IMMAGINE c'è un'etichetta *rasterizzata* «figura N» e
  i 103 disegni stanno in fondo al PDF — quindi il seed lo ha **ricostruito**
  con due euristiche in fila, OCR dell'etichetta e ritaglio «abbinando ogni
  numero al disegno più vicino». Due euristiche in serie sbagliano.

  Sono state guardate **tutte e 103 le figure**, una per una, contro il testo e
  la risposta esatta del quesito che le richiama. Gli scambi trovati, tutti a
  coppie:

  | Quesiti | Che cosa era invertito |
  |---|---|
  | `base-177` ↔ `base-178` | la freccia sulla «spia» del fuoribordo e quella sull'elica |
  | `base-647` ↔ `base-650` | un verde solo (unità a vela che mostra la dritta) e rosso-su-bianco senza laterali (pesca non a strascico senza abbrivio) |
  | `base-662` ↔ `base-679` | i fanali di una nave a motore ≥ 50 m e una scena di vento con due barche a vela |
  | `base-1062`, `base-1063` ↔ `vela-130`, `vela-131` | i due simboli di carta nautica (ancoraggio vietato, relitto in parte emergente) e i due paranchi della vela |

  La correzione è `CORREZIONI_FIGURA` in `seed.py` e vale **in memoria**, come
  `CORREZIONI_RISPOSTA`: `data/seed/` resta la copia fedele di quello che
  l'estrazione ha prodotto. Un test le fissa una per una, così se qualcuno
  «rimette in ordine» i numeri lo scambio non torna in silenzio.

  Perché faceva più danno di un quesito rotto: non sollevava niente e non
  mancava niente. La schermata era **identica** a quella dei quesiti giusti,
  solo che la risposta esatta non c'entrava con il disegno. Un quesito così non
  è inutile — insegna il falso, e lo fa con l'aria di essere corretto. È la
  forma peggiore del guasto muto di questo progetto, ed è saltata fuori da
  fuori, da chi studiava, non da uno strumento.

- **Un disegno non c'è proprio, e adesso il quesito lo dice.**
  `figura-008.png` e `figura-099.png` sono lo stesso file (stesso md5): nella
  casella 8 è finita una seconda copia di un paranco, e il disegno vero — le
  frecce sulla murata sinistra, il gemello speculare della 009 — non è fra i
  103 file. Sul disco ci sono **102 immagini distinte**.

  Quindi `base-59` una figura utilizzabile non ce l'ha. Delle tre strade due
  erano peggiori: lasciargli il paranco insegna il falso, togliergli la figura
  in silenzio somministra un quesito a cui non si può rispondere con l'aria che
  sia normale. Resta la terza: la figura sparisce e **al suo posto compare un
  riquadro che spiega perché**. Il quesito resta in banca e resta contato nella
  copertura. Il disegno mancante **non** è stato generato specchiando la 009:
  sarebbe una figura inventata da noi dentro una banca ministeriale.

### Aggiunto

- **«Cosa studiare adesso», nella Diagnosi.** Una sezione sopra *Per tema*: le
  voci in ordine di **domande d'esame in ballo**, ognuna col perché accanto e
  con i minuti che costa, calcolati sul tempo medio misurato.

  Non duplica «Le tue voci più deboli» di *Oggi*. Quella è una classifica di
  errori, e per costruzione non può nominare una voce che non hai mai aperto —
  che a tre giorni dall'esame è il rischio più grosso in circolazione: 1.593
  quesiti mai visti non hanno errori, quindi in nessuna classifica di errori
  esistono. Qui le due cose stanno nella stessa unità di misura e si sommano:

  ```
  peso     = domande d'esame del tema × quota della voce dentro il tema
  recupero = peso × (quota già vista) × debolezza misurata della voce
  rischio  = peso × (quota mai vista) × debolezza del tema, o globale
  ```

  `rischio` è una stima **e lo dichiara**: sulla parte mai vista la debolezza
  non si può misurare, quindi si presta quella del tema. È grossolano di
  proposito — serve a mettere in fila delle voci, non a predire un voto — ed è
  la stessa scelta dell'atteso lineare del semaforo.

  Tre onestà, le stesse regole del resto dell'app: ogni riga dice **perché è
  lì** (`mai aperta` / `ci sbagli` / `quasi tutta da vedere`), come nella
  Mirata; una voce che non ha niente da fare **non compare**, perché un
  consiglio che non si può seguire non è un consiglio; e la percentuale di
  esatte si scrive solo sopra le 5 viste, la stessa soglia di `peggiori()` —
  «100% su 1 vista» messo accanto a numeri veri sembra un numero vero.
  In fondo il totale: quanti quesiti sono, quanti minuti, e quante domande
  d'esame valgono. Funziona anche sulla vela, il cui peso non sta in
  `PESI_ESAME` ma è il numero di domande della prova (5), che arriva dal seed.

### Test

- 87 test sul motore (erano 81) e 129 verifiche Python (erano 124). Fra le
  Python: le dieci correzioni di abbinamento una per una, `base-59` senza
  figura e col suo perché, e **il controllo che avrebbe preso il doppione da
  solo** — nessuna figura richiamata è l'md5 di un'altra. Quel controllo però
  non avrebbe preso gli scambi, ed è scritto nel test: due disegni diversi al
  posto sbagliato passano qualunque verifica strutturale. Per quelli è servito
  guardarli.

### Nota

- Verificato sull'istanza sacrificabile locale: il riquadro «figura non
  disponibile» sul quesito 1.1.1-59 (guardato in schermata, non letto nel DOM —
  e infatti la prima stesura del CSS aveva la stessa specificità sbagliata che
  nella 0.7.2 aveva reso invisibile il suggerimento dei tasti); `1.2.1-38` e
  `1.2.1-39` che ora mostrano la spia e l'elica al quesito giusto; la sezione
  nuova in base e in vela, il pulsante *Allena* che apre la voce nella banca
  giusta, e il conto dei minuti coerente con la somma delle righe.
- **Non toccato**, e resta aperto: le tabelle *Per tema* e *Per voce* della
  Diagnosi sforano di 89 px su uno schermo da 375. È un difetto che c'è dalla
  0.3.0, non l'ha introdotto questa versione (misurato nascondendo la sezione
  nuova: l'overflow non cambia), e a tre giorni dall'esame un ritocco al layout
  di una tabella costa più di quanto renda.

## [0.11.0] — 2026-08-27

Il carteggio guadagna due allenamenti: il giro che copre tutte le tecniche in
una sessione, e il tappeto che avanza nel foglio e riprende da dove eri.

### Aggiunto

- **«Giro delle tecniche»**, nella schermata Carteggio. Una sessione sulla
  carta che tocca **tutte le 15 tecniche**. Non è «un esercizio per tecnica»:
  parecchi esercizi ne richiedono più d'una, quindi è un problema di
  copertura, risolto col greedy in `engine.js` (`giroTecniche`) — a ogni passo
  l'esercizio che copre più tecniche ancora scoperte, preferendo i mai fatti a
  parità. Sul foglio vero escono **10 esercizi per 15 tecniche**. Ogni
  esercizio dichiara in schermata quali tecniche **porta lui** al giro
  («porta al giro: PN da coordinate GPS + Rilevamento polare singolo»), nello stile della Mirata: un
  selettore che non si spiega è indistinguibile da uno rotto. La copertura
  vince sul mai-fatto perché è lei a decidere quanto dura la sessione — sono
  ore di carta nautica — e il pulsante dice **prima** quanti esercizi apre.

- **«A tappeto»**: i prossimi 4 esercizi **mai fatti**, nell'ordine del
  foglio. La ripresa è gratis per costruzione: i fatti si saltano
  (`tappeto()` guarda lo storico), quindi la sessione dopo riparte esattamente
  da dove eri rimasto, senza un segnaposto da mantenere né da poter perdere.
  Anche un esercizio *perso* conta come fatto: l'hai provato, il tappeto
  avanza — per riprenderlo c'è la correzione, non la ripetizione automatica.
  A foglio finito il pulsante lo dice invece di spegnersi in silenzio.

  Tutti e due sono **allenamenti, non prove**: cronometro che sale invece del
  conto alla rovescia, niente soglia e niente verdetto («presi 6 su 10 · 12
  minuti», non «superata»), e **nessuna riga in `sim`** — l'elenco delle prove
  sostenute resta l'elenco delle prove. Gli esercizi però contano: righe in
  `carteggio_att` con `mode` proprio (`giro-tecniche` / `tappeto`), quindi
  «esercizi provati» sale e lo storico per esercizio si aggiorna. Il runner è
  lo stesso della prova d'esame, parametrizzato (`avviaCart`): niente seconda
  copia da tenere allineata.

### Test

- 81 test sul motore (erano 75): la copertura totale del giro senza esercizi
  ripetuti, il vantaggio dei multi-tecnica (6 tecniche in 4 esercizi), le
  tecniche dichiarate una volta sola, la preferenza ai mai fatti a parità, il
  determinismo, e il tappeto che rispetta l'ordine del foglio, riprende da
  dove era rimasto e a foglio finito restituisce vuoto. Le 124 verifiche
  Python restano invariate: il server non è stato toccato.

### Nota

- Verificato sull'istanza sacrificabile locale: giro completo salvato → 10
  righe `carteggio_att` con `mode='giro-tecniche'`, zero righe in `sim`,
  «prove sostenute» fermo a 0 e «esercizi provati» a 10; tappeto aperto due
  volte con la seconda sessione ripartita dal primo mai fatto (5.1.3-1 →
  5.1.3-5, saltando il 5.1.3-6 già fatto nel giro); prova d'esame invariata
  (4 esercizi, countdown da 60:00).

## [0.10.1] — 2026-08-27

### Corretto

- **Con la banca Vela, spuntare un argomento svuotava la selezione.** Gli item
  vela hanno tutti `t: 'VELA'` e l'argomento vero sta nella voce (`v`), ma le
  schermate *Per argomento* e *Solo sbagliate* mettevano i nomi spuntati in
  `f.temi` e li passavano al motore come `temi`: il confronto su `it.t` non
  trovava mai niente, Inizia si disabilitava e sotto compariva «sono tutti
  chiusi» — un guasto visibile ma spiegato col motivo sbagliato, che è la
  variante subdola del guasto muto. Riprodotto sull'istanza sacrificabile
  (vela + una spunta → 0 quesiti a storico vuoto), poi corretto: le spunte
  della vela viaggiano come `voci` (`gruppiEffettivi()`), unite a quelle del
  riquadro voce che per la vela mostrano le stesse tre. Il motore non cambia:
  un test nuovo fissa il contratto — gli item vela si restringono per voce,
  mai per tema.

### Cambiato

- **Una banca senza quesiti con figura spegne il filtro figure da sola**:
  l'interruttore si disabilita col perché scritto sotto, e al cambio banca lo
  stato si azzera invece di restare acceso e intoccabile. Oggi la guardia non
  scatta mai — la vela ne ha 2, i paranchi (vela-130/131) — ma un filtro
  attivabile che produce sempre zero è una trappola, non un'opzione.

### Test

- 75 test sul motore (erano 74). Verificato sull'istanza sacrificabile locale:
  vela + spunta → 99 quesiti e batteria avviata; filtro figure su tutta la
  vela → esattamente i 2 paranchi; un errore vero registrato e ritrovato in
  «Solo sbagliate» con la sua voce, l'anteprima giusta e la pillola «già
  sbagliato»; banca base invariata (1.472/118, COLREG 247/67).

## [0.10.0] — 2026-08-27

Le figure si allenano come compaiono all'esame: come figure. E le voci si
spuntano invece di sceglierle da una tendina.

### Aggiunto

- **Filtro «solo quesiti con figura»** nella modalità Per argomento. Il perché:
  all'esame 120 quesiti mostrano un disegno — fanali, segnali, sagome — e
  riconoscerlo è metà della risposta; sfogliarli sparsi in mezzo agli altri
  1.600 non li fa vedere tutti prima del 3 settembre, filtrarli sì. Nel motore
  è un'opzione di `coda()` (`soloFigura`: passa solo chi ha il campo `f`),
  quindi si compone con tema, voci, «solo mai fatte» e perfino «solo
  sbagliate» senza una seconda logica di selezione. L'interruttore porta
  scritto **quanti quesiti passano il filtro corrente** — un filtro che può
  produrre zero deve dirlo prima che tu prema Inizia, non dopo — e lo stato è
  persistito col resto del filtro. Il collegamento «allena questa voce» dalle
  voci deboli di *Oggi* lo **spegne** di proposito: lì si allena tutta la
  voce, e un filtro residuo che dimezza la lista in silenzio è la forma
  esatta del guasto che perseguita questo progetto.

### Cambiato

- **«Restringi a una voce» è diventato spunte**, come gli argomenti, e accetta
  più voci insieme (in `coda()` c'era già il parametro `voci`, inutilizzato).
  Nella tendina la scelta corrente spariva dietro il valore chiuso e una voce
  sola per volta era un limite senza motivo: due voci affini — «Fanali e
  segnali diurni» più «I principali fanali luminosi e il sistema IALA» — ora
  si allenano in una batteria sola. Il filtro salvato vecchio stile (`voce`
  singola) migra da solo alla lista.

### Test

- 74 test sul motore (erano 71): `soloFigura` da solo e spento per default,
  combinato con tema, voci e stati, e dentro «solo sbagliate». Le 124
  verifiche Python restano invariate: il server non è stato toccato.

### Nota

- Verificato sull'istanza sacrificabile locale: conteggio coerente a ogni
  restrizione (118 → 67 col solo COLREG → 60 su due voci), batteria avviata
  con la figura presente sul primo quesito, migrazione del filtro 0.9.0
  controllata dopo un reload, spunte guardate con `getComputedStyle` e
  screenshot — non solo lette nel DOM.

## [0.9.0] — 2026-08-26

Il gioco dei segnali: fanali, segnali diurni e segnali sonori del COLREG da
riconoscere a colpo d'occhio, in una schermata sua.

### Aggiunto

- **La schermata «Segnali»**, settima voce della barra (misurato su 375 px:
  sette voci da 54 px senza overflow, con il corpo che scende a 9,5 px sotto i
  400 px). Quattro modalità da un selettore in alto — **fanali notturni**
  (regole 23–31), **segnali diurni**, **suoni da nebbia** (regola 35),
  **segnali di manovra** (regola 34) — e partite da 10 domande: un'immagine,
  tre risposte, correzione immediata. Sull'esatta si avanza da soli; su un
  errore la schermata resta, perché è lì che c'è qualcosa da imparare. In
  fondo, il riepilogo con le miniature dei segnali sbagliati.

  **È materiale extra banca, e lo dichiara.** Le schede sono scritte a mano
  sulle regole COLREG — non sono quesiti ministeriali — ma parlano la lingua
  della banca: la terminologia viene dai quesiti COLREG del decreto («alla
  fonda», «che non governa», «con manovrabilità limitata», «con abbrivio») e
  le viste sono ricalcate sulle figure ministeriali 34–52, fondo nero e
  pallini colorati con la lettera accanto (B/R/V/G), il fanale combinato
  mezzo verde e mezzo rosso nella vista di prua, il verde a sinistra di chi
  guarda. Un refuso in un colore sarebbe una scheda che insegna il falso,
  quindi il dataset ha i suoi test: colori, sagome e pattern validi voce per
  voce, e nessuna «resa» ambigua senza firma.

  **La firma è la regola che tiene oneste le domande.** Due situazioni diverse
  possono mostrare la stessa cosa — un solo fanale bianco è sia «alla fonda»
  sia «vista di poppa», ed è il COLREG a volerlo così — e una domanda con
  quell'immagine e tutt'e due le risposte in campo avrebbe due risposte
  giuste. Le voci con la stessa resa dichiarano la stessa `firma`, e chi
  fabbrica le domande non mette mai in campo un distrattore con la firma del
  segnale mostrato. C'è un test che gioca 50 partite e lo pretende.

  **I suoni si ascoltano davvero**: fischio e campana sintetizzati con la Web
  Audio API — niente file, funziona anche offline — con durate compresse
  rispetto alle vere, dichiarato in schermata.

  **Il gioco non scrive nello storico, di proposito.** Ha un runner suo, come
  il carteggio: piegare il runner dei quiz a «non salvare stavolta» avrebbe
  messo un ramo in più proprio nel percorso che custodisce le risposte reali.
  Niente righe in `attempt`, niente coda, niente server: resta solo il
  punteggio migliore per modalità, in `localStorage`. Verificato
  sull'istanza sacrificabile: tre partite giocate e una risposta di quiz →
  in archivio una riga sola, quella del quiz.

  Dataset e fabbrica delle domande stanno in `engine.js` (`SEGNALI`,
  `domandeSegnali`), dove si testano sotto `node --test`; la pagina disegna
  gli SVG e fa girare la partita. Selezione deterministica col seme, come
  tutto il resto del motore.

### Test

- 71 test sul motore (erano 65): dataset ben formato voce per voce, pool
  sufficienti e risposte uniche per modalità, rese ambigue solo con firma
  condivisa, tre opzioni con una sola esatta e mai due rese uguali in campo,
  determinismo col seme, e il caso del fanale bianco solitario. Le 124
  verifiche Python restano invariate: server e database non sono stati
  toccati.

### Nota

- Verificato sull'istanza sacrificabile (porta 8611): partita completa per
  ognuna delle quattro modalità, percorso d'errore e riepilogo, audio senza
  eccezioni in console, barra a sette voci su 375 px, runner dei quiz
  invariato prima e dopo.

## [0.8.1] — 2026-08-26

### Corretto

- **La revisione di una prova non si riusciva a scorrere su schermo grande.**
  Lo scroller era la colonna centrale da 860 px: fuori da quella colonna — cioè
  quasi ovunque, su un monitor largo — la rotella cadeva sul contenitore fisso
  e scrollava la pagina **dietro** l'overlay, invisibile. Sembrava bloccato,
  ed era il solito difetto che non si vede da telefono, dove la colonna riempie
  lo schermo. Ora lo scroller è largo quanto l'overlay con la colonna dentro
  (la rotella funziona ovunque), prende il fuoco all'apertura (funzionano
  frecce e PageDown), e la pagina dietro resta ferma finché la revisione è
  aperta. Verificato sull'istanza sacrificabile misurando che ogni punto dello
  schermo cada dentro lo scroller.

## [0.8.0] — 2026-08-26

Le prove sostenute si possono riaprire e rivedere, la diagnostica trasloca in
una schermata sua, e la schermata Carteggio smette di dire «nessuna prova» a
ogni apertura fredda.

### Corretto

- **Le prove sostenute sparivano a ogni apertura fredda della pagina.** Il
  sintomo riportato stamattina — «non ci sono più i dati delle sessioni
  precedenti» — con il server sano e 5 prove in archivio. `dipingiCart()`
  veniva chiamata in due soli momenti: al caricamento del seed, che avviene
  **prima** che la sincronia porti `S.sim` dal server, e dopo la consegna di
  una prova. Il ridisegno generale a sincronia finita aggiornava Diagnosi e
  Tecniche ma non il Carteggio, che restava sulla fotografia scattata a
  specchio vuoto: «Prove sostenute: 0». Presente dalla 0.5.0 e mai visto
  perché durante una sessione di lavoro ogni consegna ridipinge — si vedeva
  solo aprendo la schermata a freddo, cioè il giorno dopo. Ora `dipingi()`
  ridipinge anche Carteggio e l'elenco delle simulazioni. Il dato non si era
  mai mosso: era la schermata a mentire, nel solito modo silenzioso.

### Aggiunto

- **Le prove sostenute si riaprono.** Ogni riga negli elenchi — le prove di
  carteggio nella schermata Carteggio, e il nuovo elenco delle simulazioni
  nella modalità Simulazione — è un pulsante: si tocca e si rivede la prova
  com'era, domanda per domanda, con la risposta che avevi dato accanto a
  quella esatta (per il carteggio: testo dell'esercizio, la tua risposta
  scritta, quella ministeriale con la nota dei docenti, presa/persa).

  Il legame che mancava: le risposte non sapevano a quale prova
  appartenessero. Ora ogni risposta data dentro una simulazione o una prova
  porta il `sim_uid` della prova (colonna nuova, NULLabile, su `attempt` e
  `carteggio_att`; migrazione solo additiva all'avvio). L'uid della prova
  nasce all'inizio della prova, non alla consegna, e la riga di `sim` usa lo
  stesso — che rende anche idempotente un eventuale doppio salvataggio.

  Per le prove salvate **prima** di oggi il legame non esiste e la rotta
  nuova `GET /api/sessione/{uid}` lo ricostruisce dall'orario: le righe di
  carteggio condividono lo stesso `ts` della prova (così le timbrava
  `salvaCart`), i quiz cadono nella finestra `[consegna − durata − margine,
  consegna]` delimitata dalla prova precedente dello stesso tipo. La
  ricostruzione è **dichiarata** (`fonte: "orario"`, e la schermata lo
  scrive): affidabile non è la stessa cosa di registrato, e la differenza
  si dice. Il dettaglio vive sul server e non è in cache di proposito —
  offline la schermata dice che serve il tailnet invece di mostrare una
  prova vuota. E una prova appena salvata offline resta negli elenchi
  pescandola dalla coda: l'app non deve dire «nessuna prova» un minuto dopo
  una consegna.

- **La schermata Info**, sesta voce della barra (entra anche su iPhone SE:
  misurato, 6 × 63 px senza overflow). Dentro: le **versioni confrontate** —
  quella che gira su questo dispositivo e quella sul server, che con una
  cache offline di mezzo possono divergere per giorni senza che nessuno lo
  veda; **Sincronia** e **Offline**, trasferite qui da *Oggi*; lo **stato del
  server** (`/api/health`, ora con l'ora di avvio del servizio): integrità
  dell'archivio, righe per tabella, WAL; e l'**ultimo backup** — quando, che
  file, quante risposte contiene e quante ne mancano rispetto all'archivio,
  con l'avviso se un giro delle 04:00/20:00 è saltato (più di 17 ore). È la
  riga che trasforma il backup da file che nessuno guarda a controllo.

  La diagnostica esce da *Oggi* ma non diventa invisibile: sulla voce Info
  c'è un **pallino ambra** che si accende da solo quando qualcosa non torna —
  coda non vuota con l'ultimo invio fermo da dieci minuti, oppure offline non
  pronto. Un guasto muto deve restare visibile da qualunque schermata.

### Test

- 124 verifiche Python (erano 108): la migrazione su un archivio pre-0.8.0,
  il `sim_uid` persistito e facoltativo (i client vecchi non si rompono),
  `sessione()` per legame e per orario — con la finestra che esclude le
  batterie, le righe fuori orario e le prove contigue — il 404 su una prova
  inesistente, e `backup_info` che legge lo snapshot più recente in sola
  lettura senza sporcare la cartella. I 65 test sul motore restano invariati:
  `engine.js` non è stato toccato.

### Nota

- Verificato empiricamente su un'istanza sacrificabile (porta 8611, dati
  finti vecchio stile inseriti via API come da un client pre-0.8.0):
  apertura fredda con le prove in elenco, revisione con ripiego per orario
  dichiarato, simulazione vela completa dal vivo e sua revisione via
  `sim_uid`, schermata Info con tutti i blocchi, barra a sei voci su 375 px.

## [0.7.2] — 2026-08-25

### Corretto

- **Il suggerimento dei tasti della 0.7.0 non è mai comparso.** La classe
  `.solo-tastiera` aveva il `display:none` generico scritto *dopo* la media
  query che lo accendeva: a parità di specificità vince l'ultima regola,
  quindi il testo era nel DOM ma invisibile ovunque, tastiera o no. Era CSS
  morto da prima della 0.7.0 e la verifica di ieri aveva letto il testo nel
  DOM invece di guardarne la visibilità — l'errore classico contro cui questo
  progetto predica. Ordine invertito, e stavolta guardato davvero.

### Cambiato

- **Il numero del quesito anche durante la domanda.** La 0.7.1 lo mostrava
  solo a risposta data, ragionando che durante fosse rumore; per chi studia
  col libro accanto invece è proprio lì che serve. Ora sta sopra il testo
  della domanda, piccolo e in `--dim` (`N. 1.1.1-24`), in tutte le modalità
  compresa la simulazione. Nel drill delle tecniche resta nella pillola, e la
  prova di carteggio l'aveva già dalla 0.7.1.

## [0.7.1] — 2026-08-25

### Cambiato

- **I numeri ministeriali sono scritti dove servono.** Il dato c'era già nel
  seed, ma nessuna schermata lo mostrava — e senza numero un esercizio non si
  ritrova né sugli appunti né sul libro. Ora: nella prova di carteggio il
  numero del foglio (es. `5.1.3-1`) sta sotto il campo di risposta accanto
  all'argomento, e nella correzione in testa a ogni scheda; nei quiz il
  progressivo del decreto (es. `1.1.1-1`) compare nella riga del verdetto e
  nel riepilogo degli errori, accanto a `tema › voce`. Il drill delle
  tecniche lo mostrava già. Durante la domanda invece niente numero: lì è
  rumore, serve dopo, quando vuoi ritrovare il quesito da un'altra parte.

## [0.7.0] — 2026-08-25

La diagnosi guadagna la dimensione che le mancava: il tempo. E i tasti per
rispondere vengono finalmente dichiarati in schermata.

### Aggiunto

- **Le barrette dell'andamento nella Diagnosi**, per ogni tema e per ogni
  voce: una barra al giorno, alta quanto la percentuale di esatte di quel
  giorno, col dettaglio nel `title` e una freccia (↑ → ↓) quando i dati
  bastano per un verdetto. Rispondono alla domanda che la tabella piegata non
  poteva fare: *qui sto migliorando?* — la tabella dice dove sei debole, le
  barrette dicono se lavorarci sta rendendo. Supera il criterio del contatore
  nuovo perché cambia una decisione: una voce debole che sale si continua
  così, una che resta piatta si affronta in un altro modo (schede, teoria).

  Il dato che serviva non esisteva: lo specchio dello storico è **piegato** e
  ha perso il tempo. Ora `/api/progress` porta anche `serie.quiz` —
  `{quesito: {giorno: [esatte, risposte]}}`, soli conteggi — e l'aggregazione
  per tema e voce la fa `engine.js` (`serieGruppi`, `tendenza`), che è l'unico
  posto dove vivono le statistiche: il server continua a non sapere che tema
  abbia un quesito. Le risposte ancora in coda locale contano subito, così le
  barre di oggi si muovono anche offline; la serie del server, come tutto
  `/api/progress`, non è in cache per scelta.

  Tre onestà dichiarate: la freccia compare solo con **almeno 2 giorni e 10
  risposte** (due batterie non sono una tendenza, e una freccia calcolata sul
  rumore è peggio di nessuna freccia); i giorni senza risposte non esistono
  come barre (non c'è niente da dire, non uno zero); e la percentuale è su
  **tutte** le risposte del giorno, ripassi compresi — misura come stai
  rispondendo, non quanto è vergine la banca.

### Cambiato

- **Il runner dichiara i tasti.** Rispondere con `1 2 3` **oppure** `A B C`
  funzionava già dalla 0.4.6, ma nessuna schermata lo diceva: una scorciatoia
  che nessuno nomina è una scorciatoia che non esiste. Ora la riga del
  verdetto lo scrive — solo sui dispositivi con tastiera (`hover + pointer
  fine`), perché su un telefono sarebbe rumore.

## [0.6.0] — 2026-08-25

La copertura smette di contare i buchi come fatti, il traguardo diventa un
numero che si può decidere di rispettare, e arriva la sesta modalità: Mirata.

### Corretto

- **La copertura diceva il falso.** `stato(p)` restituisce `chiuso` per
  qualunque quesito risposto, giusto o sbagliato: un quesito preso male contava
  come coperto. Sui numeri di oggi la differenza era di poche unità e non si
  vedeva; su 1.364 quesiti da fare al tasso d'errore attuale sarebbero
  diventate decine di buchi contati come fatti. Un numero solo non può dire la
  verità su tre stati diversi, quindi ora i numeri sono tre e **sommano al
  totale** — `classifica()`: *coperto* (preso giusto e nessun errore in
  sospeso), *da ripassare* (sbagliato e non ancora ripreso), *mai visto* — e
  c'è un test che pretende la somma. La barra nel riquadro *Oggi* è diventata
  **impilata** (verde, ambra, grigio): il buco sta dentro la barra, non in una
  riga di testo accanto, che è precisamente dove era sfuggito. Conseguenza
  voluta: `rimanenti` cresce e la quota giornaliera sale, perché quel lavoro
  esiste davvero. La selezione non cambia: per lei gli stati restano due.

- **Il traguardo dei quiz era di nuovo impossibile.** `CHIUSURA_QUIZ` al 27
  agosto chiedeva ~800 quesiti al giorno: col tempo medio misurato (14,6 s a
  risposta) sono più di tre ore al giorno, cioè un numero che si ignora — la
  stessa dinamica che la 0.4.4 aveva tolto di mezzo, tornata per un'altra
  strada. Ora coincide con `CHIUSURA_COPERTURA` (30 agosto), che è già una data
  del piano: ~322 al giorno, ~78 minuti, e il 31 agosto–2 settembre restano a
  simulazioni e carteggio come prevede il piano. Derivata, non scritta a mano.

- **Lo screening era tornato a pescare a caso.** La semplificazione di
  `estrai()` nella 0.5.1 era giusta per la simulazione (deve pescare come il
  ministero) e sbagliata per lo screening, che esplora terreno nuovo e si
  ritrovava a riproporre quesiti già fatti. I due mestieri sono tornati due
  funzioni: `estrai()` resta cieco, `estraiNuoviPrima()` preferisce i mai
  visti. In CLAUDE.md la regola che l'avrebbe evitato: prima di semplificare
  una funzione condivisa, elenca i chiamanti e di' che cosa cambia per ciascuno.

- **Il riepilogo di fine prova non si leggeva.** Due difetti misurati: la tua
  risposta era in `--faint` su `--bg`, contrasto 3,66:1 contro il minimo WCAG
  AA di 4,5:1 per quel corpo; e le due risposte non erano confrontabili —
  colore, corpo e peso diversi, e la più piccola e sbiadita era proprio quella
  da capire, con il `tema › voce` appiccicato in coda. Ora le due risposte
  hanno stesso corpo e stesso allineamento, distinte da un'etichetta esplicita
  colorata («Esatta» / «La tua»), il metadato sta su una riga sua, e tutto il
  testo supera 4,5:1. Verificato a occhio su un riepilogo con più errori, in
  formato telefono.

### Aggiunto

- **I minuti, non le domande.** Nel riquadro *Oggi*: quesiti rimasti, ore di
  risposta, minuti al giorno fino al traguardo — calcolati dal tempo medio
  **misurato** (`stimaImpegno()`), perché «322 al giorno» spaventa e non dice
  niente mentre «78 minuti al giorno» è una decisione. Sotto le 30 risposte
  misurate si usa un ripiego dichiarato (15 s) invece di una media inventata.
  È l'unico contatore nuovo: il criterio per qualunque altro è *questo numero
  cambia una decisione?*

- **I tag N/L/C anche nel riepilogo di fine prova.** I pulsanti esistevano già
  nella schermata del verdetto, ma in simulazione non c'è correzione durante la
  prova — per scelta — quindi gli errori di una simulazione non erano taggabili
  in nessun modo. Ora gli stessi tre pulsanti stanno in fondo a ogni errore del
  riepilogo: solo sugli errori, un tocco, saltabile. **Un tag per tentativo**:
  se lo stesso `attempt_uid` viene taggato in corsa e poi nel riepilogo,
  l'ultimo sostituisce il primo — non due righe. Lo impone la tabella (indice
  unico su `attempt_uid` + upsert), non la buona volontà del client.

- **Modalità «Mirata»** — *dove rende di più: richiami, voci deboli e peso
  d'esame*. L'obiettivo è **punti d'esame recuperati per minuto**, non per
  domanda. Tre blocchi con budget: **richiami** (gli sbagliati non ancora
  ripresi, al massimo 5 su 25 — automatici, quindi non dipendono da un pulsante
  che qualcuno deve ricordarsi di premere, e distribuiti, quindi non si
  ammucchiano come faceva la scala tolta nella 0.5.1); **esplorazione** (mai
  visti, campionati per voce — le 44, non gli 8 temi — con probabilità
  proporzionale alla resa e corretta per la debolezza); **consolidamento**
  (voci deboli riproposte per conferma: quasi zero oggi, cresce verso
  l'esame). Tre proprietà non negoziabili: ogni quesito dice **perché è lì**
  (nella pillola in alto); è **deterministica** — stesso storico e stesso
  giorno, stessa lista, perché se non è riproducibile non è verificabile;
  **ignora «solo domande mai fatte» e lo dichiara in schermata** — un filtro
  che spegnesse i richiami in silenzio sarebbe la forma esatta del guasto che
  perseguita questo progetto.

### Test

- 61 test sul motore (erano 50) e 105 verifiche Python (erano 97), fra cui:
  la somma dei tre stati, il richiamo che sparisce solo se ripreso, lo
  screening che non ripesca, il determinismo e il tetto di Mirata, l'upsert
  dei tag e la sua migrazione.

## [0.5.1] — 2026-08-25

Via la scala dei richiami. La simulazione d'esame torna a pescare come il
ministero, e gli errori si ripassano quando lo decidi tu.

### Rimosso

- **La scala dei richiami D+1 / D+3 / D+7.** Un quesito sbagliato non torna più
  da solo, e `LADDER`, `scadenza()` e gli stati `scaduto` / `atteso` non
  esistono più. Gli stati restano due: `nuovo` (mai risposto) e `chiuso` (già
  risposto). Due motivi, entrambi misurati.

  **Non spaziava niente.** La scadenza si ricalcolava sempre da `lw`, la data
  dell'errore, mai dall'ultimo ripasso. Con un errore del 13 agosto, al 25 tutti
  e tre i gradini erano già nel passato: ogni risposta esatta ne avanzava uno e
  il quesito restava comunque scaduto, quindi in testa alla coda. Servivano tre
  aperture consecutive per toglierlo, e le tre ripetizioni finivano nella stessa
  mezz'ora. Del D+1/D+3/D+7 restava solo il numero tre. Riprodotto sui dati
  veri: quattro errori del 13–14 agosto occupavano i primi quattro posti di tre
  batterie di fila.

  ```
  apertura 1: base-8  base-37  base-1240  base-230  base-1  base-2
  apertura 2: base-8  base-37  base-1240  base-230  base-3  base-4
  apertura 3: base-8  base-37  base-1240  base-230  base-5  base-6
  apertura 4: base-7  base-88  base-89  base-91  base-92  base-93
  ```

  Era il difetto dietro «mi sembra che le domande siano sempre le stesse».

  **Sporcava la simulazione d'esame.** `estrai()` pescava a strati — prima i mai
  visti, poi i richiami scaduti, poi gli attesi, infine i chiusi — quindi la
  prova **non pescava come il ministero**, che pesca dalla banca senza sapere
  che cosa hai studiato. Una prova che ti serve i quesiti mai visti misura la
  tua debolezza, non il voto che prenderesti; una che ti serve quelli che hai
  sbagliato lo sottostima ancora di più. Ora `estrai()` è una pescata casuale e
  basta, e `progress` resta nella firma **esplicitamente ignorato**, perché chi
  legge veda che non è una svista.

  Il dato non si perde: `lw` continua a registrare l'ultimo errore. Cambia solo
  chi decide quando rivederlo.

- **Il filtro «Solo · Mai visti» dentro la batteria**, che dopo la rimozione
  diceva la stessa identica cosa del selettore in cima. Due controlli per la
  stessa cosa confondono e basta.

### Aggiunto

- **Modalità di allenamento «Solo sbagliate».** I quesiti che hai sbagliato
  almeno una volta, **dal più recente al più vecchio** — l'errore fresco è
  quello su cui hai ancora qualcosa in mente. Si filtra per argomento, e ogni
  argomento mostra quanti ne hai sbagliati dentro.

  Restano in elenco anche dopo che li hai ripresi: averlo sbagliato una volta è
  un'informazione che non scade, e nasconderlo appena lo azzecchi è esattamente
  il tipo di ottimismo che questa app cerca di non avere.

  La modalità ignora il selettore «solo domande mai fatte»: sono l'una
  l'opposto dell'altra, e chiedere di ripassare gli errori vince su un filtro
  che li escluderebbe tutti.

### Cambiato

- Dove si leggeva «N richiami in testa» ora si legge «N sbagliate da
  ripassare», e porta alla modalità nuova. Nella diagnosi la colonna *Aperti*
  diventa *Sbagliate*, e nel drill delle tecniche il riquadro *Da rivedere*
  diventa *Sbagliate*: erano tutti nomi che descrivevano lo stato di una scala
  che non c'è più.
- La pillola in alto durante un quesito dice **«già sbagliato»** quando lo è,
  invece di `richiamo`.

### Nota sul rischio

È la modifica più invasiva della settimana e tocca il cuore dell'app a sei
giorni dal congelamento del codice. Quello che la rende accettabile è che
*semplifica*: quattro stati diventano due, una funzione e una costante
spariscono, e `estrai()` passa da quindici righe a una. La superficie su cui si
può sbagliare si riduce invece di crescere. 50 test sul motore, 97 verifiche
Python, e la prova fatta guidando la pagina vera in un browser.

## [0.5.0] — 2026-08-25

La sessione B: il carteggio entra nell'app come **prova d'esame**. E la pagina
smette di essere un'app per telefono ingrandita quando la apri sul Mac.

### Aggiunto

- **Simulatore della prova di carteggio.** 4 esercizi, 60 minuti di conto alla
  rovescia, soglia 3 su 4 — la fase 1, quella eliminatoria. L'app pesca gli
  esercizi e tiene il tempo; gli esercizi si fanno **sulla carta nautica vera**,
  con squadrette e compasso. Alla fine scrivi i risultati, l'app ti mette
  accanto la risposta ministeriale, e dici quali avevi preso. Da lì calcola il
  3 su 4 e dice se sei passato.

  Si naviga fra i quattro esercizi in qualunque ordine, si torna indietro a
  correggere, e quello che scrivi è salvato **a ogni tasto**: un'ora di lavoro
  non deve dipendere dall'aver premuto un pulsante. Il pallino verde sul numero
  dice «qui ho già scritto qualcosa», non «è giusto»: durante la prova nessuno
  sa ancora se è giusto, nemmeno l'app.

  > **Non corregge lui, correggi tu.** Le risposte ufficiali portano già dentro
  > la loro tolleranza come intervallo (`Lat.42°49’,7N÷42°50’,3N`), quindi un
  > confronto automatico si potrebbe scrivere. Non c'è, e di proposito: quel
  > confronto ha un modo di sbagliare che qui non è accettabile — dire
  > «sbagliato» a una risposta giusta scritta in un altro formato, sulla prova
  > che ti manda a casa. Un'ora di lavoro sulla carta merita un giudice che sa
  > leggere. In `carteggio_att` il campo `delta` resta quindi vuoto: non c'è
  > nessuno scarto calcolato, perché nessuno analizza la tua risposta.

  > **Assunzione dichiarata sulla composizione.** La prova pesca **un esercizio
  > per argomento** — navigazione costiera, correnti, scarroccio, carburante —
  > perché gli argomenti sono quattro e gli esercizi della prova sono quattro.
  > Non l'ho letto nel decreto. È comunque la composizione più utile per
  > allenarsi, perché costringe a saperli fare tutti. Da confermare con la
  > scuola nautica, come la tabella `PESI_ESAME` dei quiz.

- **`GET /api/seed/carteggio` e `POST /api/carteggio`.** La tabella
  `carteggio_att` e la sua piegatura c'erano dalla 0.3.0; la rotta no, era il
  pezzo lasciato indietro. Ora il carteggio passa dalla coda come tutto il
  resto, quindi la prova si può fare **anche senza tailnet** e si sincronizza
  al ritorno. Gli esercizi con la risposta ufficiale sono nel guscio offline:
  sarebbe stato assurdo che l'unica cosa che l'app non sa fare senza rete fosse
  proprio la prova eliminatoria.

- Le prove sostenute restano in elenco con punteggio, esito e minuti impiegati.

### Cambiato

- **La pagina capisce su che schermo è.** Sotto i 900 px non cambia niente: è
  il telefono, e per il telefono era già giusta. Sopra i 900 px la barra di
  navigazione **sale in cima** e diventa una fila di schede — in fondo allo
  schermo è una convenzione da telefono, dove ci arriva il pollice, e su un Mac
  è solo un'app per telefono ingrandita. La colonna passa da 900 a 1180 px
  (1320 sopra i 1400), tipografia e tessere crescono di conseguenza, i bersagli
  scendono da 58 a 44 px perché col mouse non serve il pollice, e compaiono gli
  stati `:hover`, che su un telefono non esistono.

- **Nel runner dei quiz, domanda e risposte si centrano insieme.** Prima la
  domanda stava in mezzo e le risposte incollate al fondo: sul telefono è
  giusto — le risposte vanno sotto il pollice — su un monitor da 27 pollici
  diventava mezzo schermo di vuoto in mezzo.

- La barra di navigazione ha cinque voci invece di quattro. Verificato che
  «Carteggio» ci stia anche su un iPhone SE: 50 px di testo in 56 di spazio.

### Corretto

- **La consegna della prova non avveniva mai.** Il pulsante chiede conferma in
  due passi, e scrivere nel campo annulla la conferma in sospeso. Ma
  l'annullamento stava dentro `annotaCart()`, che il gestore della consegna
  chiama a sua volta: al secondo tocco annullava la conferma appena data e la
  rimetteva subito dopo. Il pulsante lampeggiava fra i due stati e la prova
  restava aperta per sempre. Trovato guidando la schermata vera in un browser,
  non leggendo il codice — che infatti sembrava giusto.

- **La conferma di consegna non usa `confirm()`.** Una finestra nativa dentro
  una schermata a tutto schermo blocca il rendering finché non la chiudi, non
  si può impaginare, e su iOS in modalità standalone mostra l'indirizzo del
  sito sopra la domanda. In più non si riesce a collaudare: provando la prova
  in un browser pilotato ha bloccato tutto. Una conferma che non si può
  verificare, su una prova da un'ora, è un rischio inutile.

- I pulsanti disabilitati ora sembrano disabilitati (`.btn[disabled]`).

### Aggiunto ai test

- **Il guscio offline di `sw.js` e quello di `palestra.html` sono la stessa
  lista, e un test lo verifica.** Sono due copie in due file diversi: una le
  mette in cache, l'altra controlla che ci siano. Se divergono, l'autodiagnosi
  dice «pronto per l'offline» mentre manca qualcosa. Unificarle richiederebbe
  un import fra service worker e pagina; il test costa una riga e prende la
  divergenza il giorno in cui succede. È la prima versione in cui le tocco
  entrambe, quindi è il momento giusto per metterlo.
- La composizione della prova (uno per argomento, mai visti per primi, due
  prove di fila diverse) e la soglia 3 su 4.
- Che il seed abbia **esattamente** i quattro argomenti attesi: se ne comparisse
  un quinto, la prova smetterebbe di essere rappresentativa in silenzio.
- Che il drill delle tecniche **non** si porti dietro la risposta ufficiale, che
  lo svuoterebbe.
- Che le risposte ufficiali restino verbatim: apostrofi tipografici, a capo, e
  le 5 note dei docenti dopo il doppio a capo.
- 54 test sul motore (erano 51) e 97 verifiche Python (erano 77).

### Nota

Ridistribuire un file **senza** alzare `VERSION` fa servire la copia vecchia
dalla cache: il nome della cache segue `VERSION`, quindi finché non cambia il
service worker continua a servire quello che ha già. Mi ci sono sbattuto contro
mentre verificavo questa versione, esattamente come avverte `docs/deploy.md`.
In produzione non si presenta — un rilascio, un numero — ma durante una sessione
di lavoro sì.

## [0.4.6] — 2026-08-25

Il semaforo smette di mentire, il backup smette di essere un comando che
qualcuno deve ricordarsi, e le domande smettono di sembrare sempre le stesse.

> **Nota sul numero.** A rigore questa sarebbe una MINOR — ci sono funzionalità
> nuove. È una PATCH perché `0.5.0` è la sessione B (carteggio) in tre documenti
> di progetto, e rinumerare la tabella di marcia a sei giorni dal freeze costa
> più di quanto valga. Se preferisci il rigore, è una riga in `VERSION`.

### Corretto

- **Il semaforo era verde dal primo giorno, e lo sarebbe stato per sempre.**
  `traccia()` accettava `inizio`, ma la pagina non glielo passava in nessuna
  delle quattro chiamate. Senza data d'inizio `semaforo()` la fa coincidere con
  *oggi*, quindi i giorni trascorsi sono zero, l'atteso è zero, e qualunque
  copertura lo supera — **compresa la copertura zero.** L'unico strumento che
  doveva dire «sei indietro» diceva il contrario, e lo diceva sempre.
  Misurato: copertura 7,1% → verde senza inizio, rosso con inizio 13 agosto.
  Ora c'è `INIZIO_QUIZ` in `app.py`, accanto alle altre date del piano, e viaggia
  in `/api/progress`. **È una costante e non `_oggi()`**: una data d'inizio che
  si sposta ogni giorno rifarebbe esattamente il difetto.

- **Un secondo semaforo rotto nascondeva il primo.** `traccia()` proteggeva
  `copertura` dalla divisione per zero ma passava a `semaforo()` un
  `chiusi / totale` nudo: su una traccia vuota arrivava `NaN`, e siccome
  `NaN >= x` è falso due volte si cadeva su `rosso`. È il motivo per cui il
  riquadro *Tecniche* appariva rosso prima che `/api/seed/tecniche` rispondesse
  — e quel rosso era stato preso per la prova che il meccanismo funzionasse,
  mentre era un difetto che ne mascherava un altro. Ora zero item danno
  `attesa`, che è lo stato neutro che esisteva già per il carteggio.

- **Una risposta data durante un flush spariva, in silenzio.** `sincronizza()`
  fotografava la coda all'inizio, ma alla fine faceva
  `S.coda = S.coda.filter(r => rifiutati.has(r.uid))` sulla coda **corrente**:
  una risposta accodata mentre la POST era in volo non era fra i rifiutati, e il
  filtro la buttava. Mai inviata, mai più in coda, nessun errore a schermo.
  Restava solo nello specchio locale, quindi sul telefono i conti tornavano e
  sul server quella risposta non era mai esistita.
  Riprodotta con la funzione vera: 8 righe in coda, POST da 600 ms, una risposta
  a 150 ms → «8 inviate», 8 righe sul server, la nona sparita. Sui tempi veri
  (POST ~0,37 s, una risposta ogni ~11 s) capitava in circa il 3% dei flush, e
  molto di più sulla rete lenta del telefono fuori casa.
  Ora si tolgono dalla coda **le righe mandate e accettate**, non «tutto tranne
  i rifiutati».

- **Una riga con `ts` non-data spegneva la palestra su tutti i dispositivi.**
  `_partiziona()` controllava che `ts` ci fosse, non che fosse una data. Una
  riga con `ts: "boh"` entrava con HTTP 200, finiva in `lw` e `t` di
  `/api/progress`, e il `new Date(...)` dentro `scadenza()` lanciava
  `Invalid time value`: con lei lanciavano `stato()`, `coda()`, `traccia()`,
  `diagnosi()` e quindi `dipingi()`. La schermata non si ridisegnava più, a ogni
  avvio, su ogni dispositivo che sincronizzava, finché non si cancellava la riga
  a mano da SQLite. Ora il `ts` è validato e la riga finisce fra gli `scartati`,
  dichiarata al client e scritta nel log — cioè nel meccanismo che esisteva già.

- **Rispondere da tastiera registrava risposte che non avevi dato.** Il gestore
  confrontava `e.key` nudo, quindi su Mac **⌘A rispondeva A** e ⌘C rispondeva C:
  una scorciatoia di sistema scriveva un errore nello storico, in modo
  definitivo. E accettava `d` anche sui quesiti da tre risposte, registrando
  `chosen: "3"`, un indice che non esiste, contato come sbagliato. Ora i
  modificatori escludono la scorciatoia, l'indice è limitato al numero di
  risposte vere, e scrivere in una `<select>` non risponde a un quesito.

- **`/api/health` andava in 500 se `state.json` era illeggibile.**
  `_read_state()` catturava solo `JSONDecodeError`: con byte non UTF-8 o un
  problema di permessi l'eccezione usciva, e siccome anche `/api/health` chiama
  quella funzione, il controllo di salute moriva **insieme** alla cosa che
  doveva sorvegliare.

### Aggiunto

- **Selettore «solo domande mai fatte»**, in cima e appiccicato allo scorrimento.
  Acceso, batterie e allenamento per argomento pescano soltanto fra i quesiti
  mai risposti: è la modalità per arrivare all'esame avendo visto almeno una
  volta tutta la banca, e il numero grande diventa i mai visti diviso i giorni
  che restano. Simulazione e screening lo ignorano di proposito — la prima deve
  pescare come l'esame vero, il secondo deve toccare tutte le 44 voci.
  Sotto non c'è una seconda logica di selezione: c'è `stati: ['nuovo']`, che il
  motore sapeva già fare.

- **Risposte da tastiera con 1 2 3** (e a b c, che c'erano già e non erano
  scritte da nessuna parte). I riquadri accanto alle risposte ora mostrano il
  numero invece della lettera, così il tasto da premere è quello che si vede.

- **Backup automatico dello storico**, `tools/backup-storico.sh`, due volte al
  giorno via `com.<autore>.patente-backup`. Fa due copie — il dump JSON dal
  servizio vivo e uno snapshot `.db` con `VACUUM INTO` — controlla l'integrità
  della copia, e **confronta il numero di risposte con il backup precedente**:
  la tabella è append-only, quindi se scende qualcosa le ha cancellate. È il
  controllo che avrebbe trasformato il reset del 9 agosto in un allarme il
  mattino dopo invece che in 46 risposte recuperate per fortuna.

  > **Perché non `cp`.** Il database è in WAL e il servizio non chiude mai la
  > connessione, quindi il checkpoint automatico — a 1.000 pagine — non arriva
  > mai. Misurato il 24 agosto: `data/patente.db` era fermo al 9 agosto e
  > conteneva **zero** righe, mentre il `-wal` accanto ne aveva 108. Un
  > `cp data/patente.db` avrebbe prodotto un backup che si apre, che supera
  > `integrity_check`, e che è vuoto. Da qui anche il travaso leggero del WAL
  > dopo ogni flush riuscito, così il file su disco smette di mentire.

- **`tools/ripristina-storico.sh`, con `--prova`.** Un backup mai ripristinato
  non è un backup, è un file. `--prova` fa il giro intero — scrive 40 risposte,
  fa il backup, le cancella tutte, ripristina, confronta — su un `PATENTE_HOME`
  finto e sulla porta 8612, senza sfiorare lo storico vero. Verificato: 40
  cancellate, 40 recuperate. Il ripristino normale (`--da-json`) è **additivo**:
  rimanda le righe alle stesse rotte del telefono e l'idempotenza per `uid` fa
  il resto, quindi non ha un modo di far danni.

- **Controllo di integrità all'avvio**, con comportamento definito se fallisce:
  il servizio **parte lo stesso**, lo scrive nel log e `/api/health` passa a
  `status: degradato` con il dettaglio. Rifiutarsi di partire toglierebbe lo
  strumento di studio nella settimana peggiore; ripararsi da soli su un archivio
  non versionato è peggio ancora.

- **Timestamp su ogni riga di log.** L'access log di uvicorn usciva senza data
  né ora: per stabilire se il telefono avesse mandato le sue 108 risposte prima
  o dopo aver ricaricato la pagina è servito confrontare numeri di riga con le
  righe di riavvio. Rotazione **non** aggiunta di proposito: 56 KB in
  diciannove giorni non arrivano a mezzo mega entro il 3 settembre, e un pezzo
  mobile in più a sei giorni dal freeze costa più di quanto risolva.

- **Il client dichiara la sua versione** in un header sulle POST, e il server
  scrive nel log quando non coincide con la propria. Con una cache offline di
  mezzo un dispositivo può servire codice vecchio per giorni, e non c'era modo
  di saperlo senza andare a guardarlo di persona — che è la domanda rimasta
  aperta sul doppio formato dei timestamp.

- 26 verifiche nuove: 51 test sul motore (erano 43) e 77 sul Python (erano 53).

### Nota su una modifica **non** fatta

`ORDER BY ts` su formati misti non è cronologico, ed è vero. Ma le 108 righe in
archivio sono **tutte** in UTC, su due giorni, con ore fra le 06 e le 17: nessuna
cade nella finestra in cui UTC e ora locale cambiano giorno, e contro le righe
future in `+02:00` la data davanti basta a tenere l'ordine. Il morso esiste solo
se i due formati finiscono nello **stesso giorno**, cioè solo se un dispositivo
gira ancora la 0.4.4 — e normalizzare l'archivio non lo impedirebbe. Quindi
niente migrazione: si guarda il numero di versione nella riga *Sincronia* del
telefono, che ora il server sa anche da solo.

### Nota su una seconda modifica non fatta

La connessione SQLite condivisa fra le richieste **regge**, ed è stato misurato:
36.000 righe inserite in 12 lotti, mentre 4 lettori martellavano `/api/progress`
e `/api/dump` e 12 lotti malformati facevano `rollback()` sulla stessa
connessione → zero righe perse, zero letture fallite. Regge perché **tutti gli
endpoint che scrivono sono `async def`** e girano sull'event loop, che è a un
thread solo. Non c'è niente da riparare, ma c'è qualcosa da non rompere: il
commento in `app.py` spiega che trasformare uno di quei `async def` in `def`
sposta le scritture nel threadpool e rende la corsa reale.

## [0.4.5] — 2026-08-24

Le date sono quelle di casa, non quelle di Greenwich.

### Corretto

- **Una risposta data dopo mezzanotte finiva nel giorno prima.** Il client
  mandava `ts: new Date().toISOString()`, che è sempre UTC, mentre il server
  ricava il giorno di studio da `ts[:10]`. Fra le 00:00 e le 02:00 locali le due
  convenzioni divergono di un giorno, e con loro sbagliavano tre cose insieme:
  la scala dei richiami **D+1 / D+3 / D+7**, che poteva scattare un giorno prima
  o dopo; il conteggio per giorno di `daily_counts`; e il contatore **«N fatte
  oggi»** appena aggiunto nella 0.4.4, che dopo una sincronizzazione poteva
  leggere zero un secondo dopo aver risposto — la stessa impressione di lavoro
  perduto che la 0.4.4 era servita a togliere, per una causa diversa.

  Ora c'è `isoLocale()` in `engine.js`: ISO 8601 **con l'offset locale**, che è
  quello che lo schema di `attempt` dichiarava fin dalla 0.3.0 (*«ISO 8601
  locale, con offset»*). Era il client a non rispettare il proprio schema, non
  la documentazione a essere sbagliata. Il server non cambia di una riga: con
  l'offset dentro il timestamp, `ts[:10]` è già il giorno giusto.

- **`today()` e la data delle risposte ora escono dalla stessa funzione**
  (`E.isoLocale().slice(0, 10)`). Erano due implementazioni della stessa idea, ed
  è esattamente il modo in cui erano divergute.

### Aggiunto

- Quattro test su `isoLocale`: il giorno locale dopo mezzanotte contro quello
  UTC, gli offset negativi e a mezz'ora, l'invarianza dell'istante rappresentato,
  e il fatto che a offset costante l'ordinamento lessicografico resti
  cronologico — che è ciò da cui dipende `ORDER BY ts` in `db.py` per calcolare
  `first` e la streak sulla sequenza giusta. Ora 43 test sul motore.

- **`VERSION` si legge dalla radice del codice, non da `PATENTE_HOME`.**
  Coincidono in produzione, ma un'istanza di prova avviata con `PATENTE_HOME`
  diverso leggeva `0.0.0`, chiamava la propria cache `patente-0.0.0` e non la
  invalidava mai: si deployava una correzione, si ricaricava, e il service worker
  continuava a servire il codice vecchio. È la mezz'ora persa contro cui mette in
  guardia `docs/deploy.md`, trovata sbattendoci contro mentre si verificava
  questa stessa versione.

### Nota

Lo storico era vuoto al momento della correzione, quindi non ci sono righe con
il vecchio formato UTC: nessuna migrazione, e nessun rischio di ordinamento
misto fra i due formati.

## [0.4.4] — 2026-08-09

Una quota che si riesce a fare, e la prova che il lavoro fatto è rimasto.

### Cambiato

- **Il traguardo dei quiz passa dal 16 al 27 agosto**, cioè una settimana prima
  dell'esame, e si calcola da `ESAME` invece di essere scritto a mano — così non
  può divergere. La quota giornaliera dei quiz base scende da **181 a 76**, e
  quella della vela da 32 a 14.
  Il 16 agosto veniva dalla finestra «telefono» del viaggio. Una quota che non si
  riesce a fare non è un obiettivo ambizioso: è un numero che si ignora, e con lui
  si ignora il semaforo, che è l'unico strumento che dice se il 30 agosto sarai
  pronto.
  **Il prezzo, dichiarato:** dal 17 agosto i quiz convivono con il carteggio
  invece di essere già finiti. Il carteggio resta la prova eliminatoria e ha la
  precedenza; i quiz sono quelli che si fanno in coda al supermercato.
  `docs/piano-di-studio.md` e `docs/spec-esercitazione.md` descrivono ancora la
  finestra all'11–16 e vanno riallineati.
- **Il pulsante di *Oggi* dice quante ne hai già fatte oggi.** Prima leggeva
  «181 da fare oggi · 1.442 mai visti»; ora «46 fatte oggi · 76 al giorno fino al
  27 agosto».
  Era l'informazione che mancava. Chi interrompeva una batteria a metà ritrovava
  un numero identico e ne concludeva di avere perso il lavoro. Non era vero —
  ogni risposta viene scritta subito in locale e mandata al server — ma niente in
  schermata lo diceva. Verificato sullo storico: la batteria delle 16:33,
  abbandonata dopo 7 domande, ha salvato tutte e 7.

### Nota su una modifica non fatta

Era stato proposto di spezzare la batteria in blocchi da 25, per non «perdere» il
lavoro di una batteria interrotta. Proposta scartata, e giustamente: se non si
perde niente, i blocchi risolvono un problema che non esiste e aggiungono un tap
ogni venticinque domande. Il problema era di visibilità, non di persistenza, ed è
stato risolto dove stava.

## [0.4.3] — 2026-08-09

«Pronto per l'offline» smette di essere una promessa e diventa un controllo.

### Aggiunto

- **Verifica reale dello stato offline** nella scheda *Offline*. Non dichiara
  piu' che cosa dovrebbe succedere: apre la cache e guarda che cosa c'e'
  dentro. Tre condizioni, ognuna con il suo verdetto — service worker attivo,
  guscio e banca in cache, figure *n*/103 — e in cima **Pronto** o **Non ancora
  pronto**, con l'indicazione di che cosa manca.
  La vecchia formula («il guscio e la banca vengono messi in cache al primo
  caricamento») era una promessa non verificata, ed e' rimasta falsa per due
  versioni senza che nessuno potesse accorgersene leggendo la schermata.
- `versione` e `figure` in `/api/seed/meta`: il totale atteso delle figure deve
  essere disponibile **anche senza rete**, e `/api/seed/figure-list` non e' nel
  guscio. Il guscio, invece, e' ora una lista sola condivisa fra pagina e
  controllo.

### Corretto

- **`scaricaTutto()` scriveva in una cache sbagliata.** Il nome era scritto a
  mano (`patente-v1`) e dalla 0.4.2 la cache segue `VERSION`: le 103 figure
  sarebbero finite in una cache che il service worker cancella al primo
  activate. Scaricate per niente, senza un errore, e scoperte offline. Ora il
  nome si chiede a `caches.keys()` invece di indovinarlo.
- Il pulsante non mente piu' a fine scaricamento: diventa *Ricontrolla* e
  rilancia la verifica, invece di scrivere «Pronto per l'offline» per il solo
  fatto di essere arrivato in fondo al ciclo.

### Nota

Dopo un rilascio serve **una ricarica in piu'**: la prima serve la pagina dalla
cache vecchia mentre il nuovo service worker si installa, la seconda mostra la
versione nuova. Il numero di versione in fondo alla riga *Sincronia* dice quale
delle due stai guardando.

## [0.4.2] — 2026-08-09

Sessione di riparazione. Il sintomo riportato era «a ogni sessione le domande
sono le stesse»; sotto c'erano tre guasti distinti, e il piu' grave non era
quello.

### Corretto

- **L'uso offline non e' mai esistito, su nessun dispositivo.** L'app girava su
  `http://<indirizzo del nodo>:8610`, che per il browser **non e' un secure context**:
  fuori da HTTPS `navigator.serviceWorker` e `caches` non esistono affatto. La
  registrazione era dentro un `if ('serviceWorker' in navigator)`, quindi
  saltava in silenzio; `sw.js` veniva servito correttamente e non e' mai stato
  installato da nessuno. Misurato: `isSecureContext: false` e, con il server
  fermo, **«Banca non raggiungibile»** invece dell'app.
  Ora il servizio parla HTTPS con il certificato che la rete privata emette per
  il nome del nodo (`deploy/certs/`, rinnovabile con un comando).
  L'indirizzo diventa **`https://<nome del nodo>:8610/`** e va raggiunto **per
  nome**: sull'IP il certificato non combacia.
  Verificato: service worker `activated`, cache popolata con guscio e banca, e
  con il server spento l'app parte e la batteria riparte dal punto giusto.

- **La sincronia cancellava lo storico locale invece di fonderlo.** In
  `sincronizza()` c'era `S.prog = p.quiz`: la pagina prendeva per buono lo
  storico del server e buttava il proprio. Bastava che il server ne sapesse
  meno — una risposta ancora in coda, un lotto rifiutato, un DB ripartito da
  zero — perche' l'app dimenticasse tutto, classificasse tutti e 1.722 i
  quesiti come `nuovo` e ricominciasse da `base-1`. **Era questo il bug delle
  stesse domande**: non l'estrazione, che e' sempre stata giusta, ma la memoria.
  Un problema di trasmissione di un minuto diventava amnesia definitiva.
  Ora c'e' `fondi()` in `engine.js` — logica pura, quindi testabile: per ogni
  quesito vince chi ha registrato piu' risposte, a parita' il server.
  Riprodotto prima e verificato dopo: server svuotato e coda vuota, lo specchio
  locale resta e la batteria riprende da dove era rimasta.

- **Le righe malformate sparivano con un HTTP 200.** `INSERT OR IGNORE` faceva
  due mestieri opposti: rendeva idempotente il rinvio della coda (giusto) e
  inghiottiva in silenzio le righe rotte (disastro). Un lotto con un campo
  rinominato rispondeva `{"ricevuti": 2, "nuovi": 0}`, il client svuotava la
  coda, e la sostituzione dello specchio finiva il lavoro: sessione di studio
  persa, con l'app che scriveva «allineato».
  Ora le righe incomplete sono separate prima dell'inserimento e **dichiarate**:
  la risposta e' `{ricevuti, nuovi, gia_presenti, scartati, scartati_uid}`, gli
  scarti finiscono nel log, e il client tiene in coda esattamente le righe
  rifiutate mostrando l'errore. `nuovi: 0` non e' piu' ambiguo fra «le avevo
  gia'» e «le ho buttate».

### Aggiunto

- **Riga di stato della sincronia** in *Oggi*: risposte registrate, quante sono
  in coda, l'ora dell'ultimo invio e la versione che gira **su questo
  dispositivo**. E' la cosa che sarebbe servita di piu': il danno peggiore non
  e' stato il bug, e' stato che fosse muto per giorni.
- **Avviso esplicito quando l'origine non e' sicura**: se apri l'app su `http`,
  la scheda *Offline* lo dice e indica l'indirizzo giusto, invece di offrire un
  pulsante «Scarica tutto per l'offline» che non puo' funzionare.
- **Il nome della cache lo scrive il server**: `sw.js` contiene `__VERSIONE__` e
  l'endpoint lo sostituisce con `VERSION`. Sparisce il passo «ricordati di
  alzare `CACHE`», che infatti fra la 0.3.0 e la 0.4.1 nessuno aveva fatto — e
  che ora che il service worker si installa davvero congelerebbe l'app sulla
  prima versione vista da ogni dispositivo.
- **11 test di non regressione**: 7 sul motore (`fondi` in tutte le sue
  combinazioni, la batteria che avanza, e il test che fissa il sintomo — con lo
  specchio azzerato la coda ricomincia da capo), 11 verifiche su `db.py` (lotto
  misto, rinvio idempotente distinto dallo scarto, campo rinominato,
  `correct: 0` che non e' un campo mancante). Ora 39 e 53.

### Da fare prima di partire l'11

Apri la palestra dal telefono **sul nuovo indirizzo HTTPS**, premi *Scarica
tutto per l'offline*, poi spegni Tailscale e controlla che l'app parta lo
stesso. Il vecchio indirizzo `http://<indirizzo del nodo>:8610` non risponde piu': se
hai l'icona sulla schermata Home, va rifatta.

### Nota sul CHANGELOG della 0.3.0

La voce «Uso offline» della 0.3.0 dichiarava una funzionalita' che non ha mai
funzionato. Resta scritta com'era — riscrivere la storia serve a poco — ma va
letta insieme a questa.

## [0.4.0] — 2026-08-09

Quattro modi di allenarsi invece di uno, e la scoperta che cambia le priorità
di studio: **l'esame non pesca in proporzione alla banca**.

### Aggiunto
- **Composizione ministeriale delle 20 domande**, in `seed.py` e servita da
  `/api/seed/meta`: Navigazione 4, Manovra 4, Sicurezza 3, Normativa 3, COLREG 2,
  Meteorologia 2, Teoria dello scafo 1, Motori 1.
- **Simulazione d'esame** fedele: composizione, tempi e soglie del decreto
  (20 in 30′ con max 4 errori; vela 5 in 15′ con max 1). Conto alla rovescia che
  diventa rosso sotto i cinque minuti e chiude la prova a zero. **Nessuna
  correzione durante la prova**: l'esito arriva alla fine, come all'esame.
  Modalità *Completa*: base e poi vela di seguito; se il base non passa l'app lo
  dice — all'esame lì saresti escluso — e lascia proseguire dichiarandolo.
- **Screening completo**: 1, 2 o 3 quesiti da *ognuna* delle 44 voci (44, 88 o
  132 domande). Serve a sapere non che sei debole in «Navigazione» — 322 quesiti,
  inutile — ma in «Bussole magnetiche», che sono 38.
- **Per argomento** con spunte: più temi insieme, con il peso d'esame di ciascuno
  scritto accanto, e la voce singola quando ne selezioni uno solo.
- **Riepilogo di fine prova** in tutte le modalità: punteggio, verdetto quando è
  una simulazione, e l'elenco degli errori con la risposta esatta.
- **Autoscroll**: pulsante *auto* nell'intestazione. Se la risposta è giusta
  passa da solo dopo un secondo; se è sbagliata la schermata resta finché non
  tocchi tu. È lì che c'è qualcosa da imparare.
- Esito delle simulazioni salvato in `sim` e sincronizzato via `POST /api/sim`.

### Cambiato
- **La diagnosi ora ragiona in domande d'esame, non in percentuali.** Per ogni
  tema mostra quante domande porta all'esame e la **resa** — domande d'esame per
  quesito in banca. Per ogni voce, il **costo**: quante domande d'esame ti
  aspetti di sbagliare per colpa sua. Le voci deboli sono ordinate su quello.
- Una voce senza nemmeno un errore alla prima risposta non compare più fra i
  punti deboli, per quanto poco l'abbia vista.
- Duecento millisecondi di sordità agli input dopo ogni cambio di schermata: sul
  telefono un doppio tap rispondeva alla domanda dopo senza averla letta.

### Trovato
La distribuzione non è proporzionale, e la differenza è grossa. **Manovra e
condotta** è il 10,5% della banca e il **20%** dell'esame; i **COLREG** sono il
16,8% della banca e il **10%** dell'esame. Per ora studiato, un quesito di
Manovra rende **3,2 volte** uno di COLREG (25,8‰ contro 8,1‰). Il § 5 del piano
di studio dice l'opposto — che COLREG «cade sempre» e Manovra «regge una passata
veloce» — e va corretto.

Fonte: la stessa tabella riportata da tre scuole nautiche indipendenti
([Albatros](https://www.albatrosnautica.it/2022/02/17/patente-nautica-tutti-i-numeri-del-nuovo-esame/),
[Patenti Bignami](https://www.patentibignami.it/nuovo-regolamento-degli-esami-a-quiz-per-la-patente-nautica-senza-limiti.html),
[Soleil](https://www.soleil-vacanze.com/nuovo-esame-patente-nautica/)), tutte
che citano il decreto. **Non letta nel testo del decreto**, che non è nel repo:
da confermare con la scuola nautica.

## [0.3.0] — 2026-08-08

La palestra dei quiz, pronta per la finestra dell'11–16 agosto in Polonia.
Il carteggio arriva nella 0.5.0, in tempo per il 17.

### Aggiunto
- Pagina `/palestra`: quattro schermate — **Oggi**, **Batteria**, **Diagnosi**,
  **Tecniche** — pensate per il telefono in verticale, con una mano. La domanda
  sta in alto e scorre, le risposte restano ancorate in fondo sotto il pollice:
  non c'è mai da scorrere per rispondere. Su schermo largo la figura si affianca
  alla domanda invece di finirci sotto.
- **Motore di selezione** (`pages/engine.js`): un richiamo scaduto batte tutto,
  un quesito mai visto batte uno già corretto. Richiami a **D+1 / D+3 / D+7**
  dal giorno dell'errore, gli stessi offset che il piano di studio prescrive.
- **Diagnosi** per tema e per voce: quanti quesiti hai visto sul totale, la
  percentuale di esatte **alla prima risposta**, gli errori ancora aperti, il
  tempo medio e la copertura. In cima a *Oggi*, le cinque voci più deboli.
- **Drill «che tecnica serve?»**: i 135 testi del carteggio senza limiti con le
  tecniche richieste, da riconoscere in due tap. Si fa dal telefono, senza carte
  e senza squadrette — è l'unica parte del carteggio allenabile in viaggio.
- **Uso offline**: service worker con guscio, banca e figure in cache, e coda
  delle risposte in `localStorage`. Se il Mac Mini non risponde continui ad
  allenarti; le risposte partono da sole quando il tailnet torna. Il pulsante
  *Scarica tutto per l'offline* mette in cache anche le 103 figure.
- **Storico in SQLite** (`data/patente.db`), append-only: una riga per risposta.
  Copertura, accuratezza, scadenze e quote sono tutte derivate al volo — nessuna
  tabella di stato da riparare. Le tabelle di carteggio e simulazione ci sono
  già, vuote, così le prossime versioni non richiedono migrazioni.
- Endpoint: `GET /api/seed/{meta,quiz,tecniche,figure-list}`, `GET /api/progress`,
  `POST /api/attempts|tecnica|tags`, `GET /api/dump`, `/figure/*`, `/manifest.json`.
  Compressione gzip: la banca passa da 654 KB a 123 KB.
- Test: 17 sul motore di selezione (`node --test`), 42 su seed e storico
  (`.venv/bin/python tests/test_python.py`). Verificano i criteri di
  accettazione della spec, non l'implementazione.

### Corretto
- **Due quiz su 1.472 uscivano rotti dall'estrazione del PDF.** `base-226`
  ("Per «S drive» si intende") aveva due risposte marcate esatte, `base-1418`
  (disciplina dello sci nautico) nessuna. Le correzioni sono in memoria, in
  `seed.py`, con la motivazione per esteso: `data/seed/` resta la copia fedele
  del decreto. Da riverificare sul libro.
- Il campo `figura` dei JSON è un intero, non il nome del file come dice
  `data/seed/README.md`. La conversione a `figura-NNN.png` sta in un punto solo
  e un test controlla che tutte e 120 le figure richiamate esistano su disco.
- La voce `Attvità commerciale` (refuso del decreto, 1 quesito) si fonde con
  `Attività commerciale`. Le voci utili scendono da 45 a 44.
- Il caricamento si rifiuta di partire se un quiz non ha esattamente una
  risposta esatta: meglio un servizio che non parte di uno che ti somministra
  un quesito rotto.

### Deciso
- **Un quesito azzeccato al primo colpo esce subito dal giro**, senza chiedere
  una seconda conferma. Con 1.722 quiz e nove giorni di finestra, pretendere due
  passate su tutto significa 382 risposte al giorno invece di 191: la conferma
  si pagherebbe con metà della copertura. Chi sbaglia, invece, percorre tutta la
  scala D+1 / D+3 / D+7.
- **Niente SM-2 o FSRS.** Con una banca chiusa e meno di un mese davanti, gli
  intervalli lunghi non scatterebbero mai prima dell'esame.
- **La quota di *Oggi* conosce una data di inizio per traccia.** Il carteggio
  parte il 17 agosto: prima di allora la sua quota è zero e il semaforo resta
  in attesa. Dire «sei indietro» su una prova non ancora iniziata è rumore.
- **Il seed non entra in SQLite.** Si carica in memoria (2 MB, istantaneo):
  niente import, niente migrazione, niente divergenza fra due copie.

### Note
- `data/patente.db` non è versionato. La copia di sicurezza si prende da
  `/api/dump`.
- Lo stato del tracker in `data/state.json` non esisteva: nessuna migrazione da
  fare. Gli endpoint `/api/state` e la pagina `/` sono invariati.

## [0.2.0] — 2026-08-06

### Aggiunto
- Dataset seed della banca d'esame in `data/seed/`: 1.472 quiz base, 250 quiz
  vela, 135 esercizi di carteggio senza limiti con tolleranza esplicita, 50
  esercizi entro 12 miglia, 103 figure.

## [0.1.0] — 2026-08-06

Prima versione. Nasce da una sessione Cowork di preparazione all'esame del
3 settembre 2026.

### Aggiunto
- Servizio `patente-web`: FastAPI su porta 8610, legato all'indirizzo Tailscale,
  con pagina del tracker e API di stato (`GET`/`POST /api/state`, `/api/health`,
  `/api/export`).
- Persistenza dello stato in `data/state.json` con scrittura atomica, backup a
  rotazione (ultimi 20) e recupero automatico da file corrotto.
- Pagina del tracker con le 17 sessioni del piano di studio, le quote di quiz ed
  esercizi assegnate a ciascuna, l'avanzamento sulla banca ufficiale
  (1.472 quiz base, 250 quiz vela, 135 esercizi di carteggio senza limiti) e il
  registro errori con ripasso a D+1 / D+3 / D+7.
- Salvataggio automatico un secondo dopo ogni modifica, con indicatore di stato
  della sincronizzazione ed esportazione manuale di sicurezza.
- Agente launchd `com.<autore>.patente-web` e `setup.sh` per l'installazione.

### Note
- I dati del piano provengono dall'Allegato A al DD n. 131 del 31 maggio 2022
  (elenco unico nazionale dei quesiti) e dagli esercizi ministeriali di carteggio.
- Il servizio non ha autenticazione: i dati non sono sensibili e l'accesso è
  limitato al tailnet.
