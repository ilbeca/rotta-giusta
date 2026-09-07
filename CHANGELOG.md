# Changelog — Open Patente Nautica

Formato: [Keep a Changelog](https://keepachangelog.com/it/1.1.0/).
Versionamento semantico, pre-1.0: MINOR per funzionalità, PATCH per correzioni.

Le voci fino alla 0.18.0 vengono dal progetto personale di preparazione
all'esame da cui questo sito è estratto: un servizio con un server, un solo
utente e una data d'esame. Restano perché spiegano **perché** certe scelte
sembrano strane — e sono state riviste solo per togliere i dati delle macchine
dell'autore. Dalla 0.19.0 in poi è la storia di questo sito.

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
