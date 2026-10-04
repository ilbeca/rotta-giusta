# ADR-006: L'invito anche nella Home, il sito che spiega, la costanza detta, e una stima che si calcola prima di mostrarla

## Status

**Accepted** — 4 ottobre 2026. Quattro gruppi di decisioni dell'autore del 3 e
del 4 ottobre 2026, prese nel brainstorming P-59 e scritte in
`docs/idee-dopo-gli-account.md`, «Le decisioni di P-59», con i numeri 11, 12,
19 e 23–28. Stanno qui insieme perché ognuna cambia **una promessa scritta** —
nell'ADR-004, in `docs/filosofia.md` o nella specifica — e non soltanto una
schermata. Le altre decisioni di P-59 (il menu, i cinque stati, l'onboarding, i
segnalibri…) non cambiano una promessa: sono fra le chiuse del §10 della
specifica, con la loro data.

**Sostituisce in parte ADR-004**: la sua condizione 2, «la registrazione si
raccomanda … quando c'è qualcosa da perdere. La fine di un'attività è quel
momento … Non a ogni schermata», marcata lì. Le condizioni 1 e 3 valgono
com'erano, e la 3 è quella che regge la decisione sulle spiegazioni; la 4 è
quella dell'ADR-005.

Per scelta dell'autore, nel brainstorming filosofia, ADR e Vincoli non erano un
limite. Questo ADR non rimette in discussione le decisioni: dice che cosa
cambia, e quanto costa, come l'ADR-005.

## Date

2026-10-04

## Context

Quattro promesse, scritte quando il sito era un'altra cosa, e una domanda
dell'autore per ciascuna.

1. **L'invito a registrarsi sta solo nel riepilogo** (ADR-004 condizione 2,
   R-ACC-03, e in `docs/filosofia.md` «te lo diciamo quando serve, non a ogni
   pagina»). Chi non finisce un'attività non lo vede mai (I-03). E la prima
   simulazione, che dal 4 ottobre fa da test d'ingresso (decisione 18), è il
   momento in cui chi arriva ha di più da perdere: venti risposte sugli otto
   temi.
2. **Il sito non insegna: allena e dà riscontri** (`docs/filosofia.md`, §1
   della specifica). Un errore dice *che cosa* era giusto, non *perché*, e chi
   non lo sa resta senza (I-10).
3. **Niente gamification**: «nessuna streak, nessun badge, nessuna notifica»
   (`docs/filosofia.md`, appendice A della specifica). Ma la stima conterà una
   osservazione per quesito al giorno, e tornare un altro giorno vale più di
   ripetere subito: l'autore vuole che lo si dica, con una costanza leggera
   (I-15).
4. **«"Supera l'esame con noi" non lo diciamo»** (`docs/filosofia.md`), e il
   motore «non sa niente degli altri utenti» (§4.6 della specifica). *Chi
   ripassa sotto esame* ha una domanda sola — se l'esame fosse domani,
   passerei? — e il sito gli dà i pezzi, non la risposta. L'autore, il 3
   ottobre: «penso che dovremmo cambiare la nostra filosofia» (I-12).

## Decision

### 1. L'invito: nel riepilogo, nella Home e nel risultato di una simulazione (decisione 12)

La condizione 2 dell'ADR-004 diventa:

> **La registrazione si raccomanda con i vantaggi veri, in tre posti: nella
> Home, nel risultato di una simulazione e nei riepiloghi delle attività.**
> I vantaggi mostrati sono quelli che esistono, e nessuna metrica si promette
> sotto le soglie del §4.3. Il risultato e la revisione restano a chi non si
> registra. Fuori da quei tre posti non c'è un invito: non durante
> un'attività, non a ogni schermata.

- **Nella Home**, l'invito è per chi ha risposto senza account: «con risposte e
  senza account, l'invito a conservarle» (decisione 5). Chi non ha ancora
  risposto vede che cos'è il sito e i suoi benefici; chi ha l'account, il suo
  cruscotto. Letto così, il criterio dell'ADR-004 — l'invito quando c'è
  qualcosa da perdere — resta vero anche nella Home.
- **Nel risultato di una simulazione**, il testo deciso è: «Conserva questa
  prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove
  iniziare» (I-14). Risultato e revisione si vedono senza registrarsi.
- **Progressi senza account** dice che cosa l'account aggiunge (decisione 4),
  come oggi dice perché le misure non ci sono (R-ACC-04). Si legge come la
  spiegazione di una vista che manca, non come un quarto posto per l'invito;
  se l'autore lo intende come invito, è un quarto posto, e va scritto qui.

### 2. Il sito spiega (decisioni 11 e 28)

- **Spiegazioni per i quiz**, non per il carteggio: perché la risposta giusta
  è giusta e perché l'altra inganna, con la fonte e la data, in una struttura
  fissa e con una versione.
- **Le verifica l'autore, e si mostrano solo se verificate**, con il segno
  «verificata il …». Una spiegazione scritta e non verificata non esce.
- **Mai prima di rispondere** — la regola dei due campi della banca, `nbp` e
  `nb` (§3.1) —: negli allenamenti dopo la risposta, anche giusta; nella
  simulazione dopo la consegna, perché la simulazione non corregge durante la
  prova (§7.5).
- **Per tutti, anche senza account.** Una spiegazione non vive di uno storico,
  e toglierla a chi non è registrato è la leva che l'ADR-004, condizione 3,
  vieta.
- **In un file loro, mai dentro `quiz.json`**, che è l'Allegato A al DD
  131/2022: il Vincolo del §2.1 non cambia. Dove il decreto sembra sbagliato —
  base-405, i flap — la spiegazione dice che all'esame vale la sua risposta, e
  perché sembra sbagliata, come fa la nota di oggi. La spiegazione è nostra, e
  lo dice; la risposta resta del decreto.
- **Il primo lotto: 50 quesiti misti** — più sbagliati, ambigui, con figura,
  con calcoli, divergenti dal DM 133/2024 —, per misurare quante vanno
  corrette prima di decidere come fare il resto.

La frase che prende il posto di «il sito non insegna», approvata dall'autore
in I-10: *«Spieghiamo perché una risposta è quella giusta, e lo diciamo quando
la spiegazione è nostra e non del decreto. Non sostituiamo la scuola né il
manuale.»*

### 3. La costanza, detta (decisione 19)

- **«Giorni di attività qui negli ultimi 14»**, senza una serie che si spezza,
  con criteri giusti per quiz, carteggio e Segnali; più **«N quesiti da
  confermare oggi»**, quelli che la regola dei cinque stati (decisione 14, le
  12 ore) fa maturare.
- **Detta con il suo perché**: tornare un altro giorno conta di più, perché la
  stima conta una osservazione per quesito al giorno. È la verità del modello,
  non un trucco.
- **Niente badge, niente notifiche, niente traguardi**, per ora: l'autore ha
  approvato la proposta di I-15 per intero, e lì non ci sono.
- **Solo per chi ha l'account**: quattordici giorni sono uno storico
  (decisione 10).

### 4. La stima: si calcola e si registra prima di mostrarla (decisioni 23–27)

- **Che cosa si stima**: superare **la prossima simulazione completa del quiz
  base, senza aiuti**. La vela a parte. Il carteggio fuori dalla stima, e
  detto accanto, sempre: apre l'esame, lo giudica chi studia, e il sito non sa
  se il giudizio è giusto (§4.5).
- **Il modello**: gerarchico, quesito → voce → tema, con **la difficoltà dei
  quesiti stimata dalle risposte di tutti i registrati** — soltanto le prime
  risposte, senza chi si è opposto alle statistiche, e sotto una soglia minima
  di persone niente —; **una osservazione per quesito al giorno**, la prima
  del giorno e prima della correzione, e lo si dice a chi studia.
- **Si calcola e si registra senza mostrarla**: la previsione si salva prima di
  ogni prova, con la versione del modello e la data; si valida con gli
  studenti simulati, per trovare dove si rompe, e con le simulazioni future dei
  registrati, per dire se è tarata, contro una regola semplice. **Le soglie di
  pubblicazione si decidono prima di vedere i risultati.** Intanto la Home e
  Progressi mostrano i fatti — le prove fatte, con l'esito.
- **Quando si mostra**: una ragnatela per tema e il budget degli errori, il
  budget come misura principale e **senza verde né rosso**; solo ai
  registrati. Nel grafico di prova di I-12, 3,65 errori attesi su 4 ammessi
  danno circa 71 prove superate su 100, cioè quasi una su tre bocciata: un
  verde lì sarebbe la rassicurazione che il §4.3 rifiuta.
- **Dopo l'esame si chiede «com'è andata»**, separato per quiz base, vela,
  carteggio e pratica, e si comincia a chiederlo presto: senza gli esiti veri
  nessuna stima si confronta con l'esame, e gli esiti arrivano mesi dopo le
  risposte.

## Che cosa costa

Detto per ciascuna, perché è il posto in cui una decisione così si è tentati di
scriverla a mezza voce.

### L'invito

1. **L'imbuto si allarga.** Fino a oggi l'invito compariva una volta per
   attività finita; da qui compare anche nella Home, che è la prima schermata
   di chi torna, ogni volta che ci passa con risposte non salvate. È più
   vicino all'insistenza che `docs/filosofia.md` promette di non usare, e la
   distanza la tengono soltanto i tre posti elencati e un controllo che li
   conti.
2. **Un vantaggio promesso che non c'è.** «Da queste risposte possiamo
   proporti da dove iniziare» è vero solo quando il Percorso (decisione 16) lo
   fa davvero. Prima di allora la frase è il guasto muto di I-03 — «riprendi
   domani» quando una ricarica lo perde —, e non si scrive.
3. **Un invito nella Home vale solo se arrivarci non perde le risposte.** Oggi
   la Home (`/`) e l'app (`/app`) sono due documenti, e passare dall'una
   all'altra ricarica la pagina: senza account, le risposte sono perse prima
   che l'invito a conservarle compaia. È la decisione 9 — dopo il primo
   caricamento il sito resta un documento solo —, e l'invito nella Home non
   esce senza di lei.
4. **R-ACC-03 dice il contrario**: «in nessuna vista un invito», e lo tiene
   verde sulla pagina di oggi, che ha l'invito solo nel riepilogo. Cambia con
   il progetto del ridisegno, e il controllo nuovo deve contare i tre posti:
   un quarto è rosso.

### Le spiegazioni

1. **La promessa diventa più grande, e si rompe più facilmente.** La filosofia
   lo diceva della frase di prima: «è una promessa più piccola, ed è per questo
   che possiamo mantenerla». Una spiegazione sbagliata insegna il falso con
   l'aria di essere giusta — è il difetto delle dieci figure scambiate (0.12.0)
   —, e chi studia non ha modo di accorgersene. La difesa è una sola: la
   verifica dell'autore, cioè una persona, e il ritmo delle spiegazioni è il
   suo tempo.
2. **Le spiegazioni invecchiano con la norma.** Il DM 133/2024 ha già fatto
   divergere 11 risposte dalla legge: un decreto nuovo riapre le spiegazioni
   che tocca, e nessuno lo fa da solo. La data e la versione dicono di quando
   è una spiegazione, non se è ancora vera.
3. **Testo nostro accanto a un atto dello Stato.** Va distinto in schermata,
   ogni volta; non può contenere materiale di terzi (`strumenti/controlla.py`);
   e ha bisogno di una licenza che oggi non c'è (§4 di
   `docs/prossime-sessioni.md`, «Dopo P-59», punto 6).
4. **Misurarne l'effetto** (decisione 29) vuol dire pubblicarle a scaglioni, in
   un ordine casuale: per un periodo qualcuno vede una spiegazione e qualcun
   altro no. Nessuno perde niente che c'era, ma la differenza è scelta da noi,
   e si dice.

### La costanza

1. **«Niente gamification» cade in parte.** Un numero che invita a tornare è la
   tecnica delle app che trattengono; la differenza con quelle è che non
   punisce un giorno saltato e dice perché tornare serve. Resta una spinta, e
   la filosofia ora lo scrive.
2. **Il guasto muto di un contatore**: sale con le risposte, non con lo studio.
   Nove giorni su quattordici con una risposta al giorno sono nove giorni di
   niente. Che cosa fa un giorno di attività lo decide l'autore (§4 di
   `docs/prossime-sessioni.md`, «Dopo P-59», punto 3), e finché non c'è la
   costanza non si costruisce.
3. **I Segnali non lasciano una data.** Non entrano nell'archivio (§4.5,
   R-UX-02): ne restano soltanto il migliore e le giocate per modalità, nel
   profilo. Contarli fra i giorni di attività vuol dire scrivere da qualche
   parte quando si gioca — una riga nuova o un dato nuovo nel profilo —, e
   nessuna delle due è decisa. È aperto nel §10 della specifica, Q-COSTANZA.
4. **«Non si azzera» non si dice**: dopo quattordici giorni senza attività il
   numero è zero.

### La stima

1. **Un dato nuovo per ogni registrato, che lui non vede.** Una previsione che
   lo riguarda, calcolata e conservata sul server prima di ogni prova. È un
   trattamento, e va nell'informativa prima della prima previsione registrata;
   il diritto di accesso la comprende. Come si scrive, si conserva e si
   esporta è del progetto (P-64).
2. **Le risposte di ciascuno servono agli altri.** «La difficoltà di un quesito
   è solo la tua» (§4.6) smette di essere vera: entra la difficoltà stimata su
   tutti i registrati. È una statistica, e passa da `server/statistiche.mjs`
   come ogni altra (R-ACC-69), senza chi si è opposto (R-ACC-67); con poche
   persone, sotto la soglia, non c'è.
3. **«Com'è andata» è un dato in più**, facoltativo, dichiarato da chi studia e
   non verificabile. Chiederlo dopo la data d'esame vuol dire raggiungere
   qualcuno che forse non apre più il sito: se la strada è una mail, è un uso
   dell'email che `docs/filosofia.md` oggi non nomina («l'email serve ad
   accedere, a riprendere la password e a ricevere l'avviso»). La strada è del
   progetto, e la decisione di usare l'email, se serve, è dell'autore.
4. **Un modello costa, e può non arrivare mai.** Versioni, studenti finti,
   mesi di attesa per gli esiti: se non passa la validazione, non si mostra
   mai. È un prezzo accettato, e un modello che non si mostra non è un difetto.
5. **La frase della filosofia** sulla stima — «"supera l'esame con noi" non lo
   diciamo» — resta com'è finché l'autore non sceglie quella nuova: la
   proposta è in I-12 e nel §4 di `docs/prossime-sessioni.md`, «Dopo P-59»,
   punto 1. Finché la stima non si mostra, la frase di oggi è vera.

## Alternatives Considered

- **L'invito solo nel riepilogo, e nella Home una descrizione dell'account
  invece di un invito** — la proposta di Claude in I-03, che non toccava
  l'ADR-004. Scartata dall'autore: chi non finisce un'attività non lo vede mai,
  e la simulazione è il momento con più da perdere.
- **Un invito anche durante un'attività**, un banner o un promemoria. Non
  nella decisione: resta escluso.
- **Le spiegazioni solo ai registrati**, con «tutti gli extra legati alla
  registrazione» (I-03, 3 ottobre). Scartata dall'autore il 4 ottobre, dopo il
  confronto con ChatGPT: la condizione 3 dell'ADR-004 lo vieta.
- **Spiegazioni non verificate, mostrate con un segno.** Scartata: si mostrano
  solo le verificate.
- **Una serie che si spezza** («hai perso la serie di 12 giorni»). Scartata: un
  giorno saltato cancellerebbe il lavoro fatto, e fa abbandonare.
- **Mostrare subito una stima sulla banca**, o una probabilità al centro della
  Home prima della validazione. Scartato: un numero non validato è il semaforo
  verde a copertura zero in forma di percentuale.
- **La difficoltà dalla percentuale grezza di esatte di tutti.** Scartata:
  dipende da chi risponde e da quante volte ha ripetuto; si usano le prime
  risposte, e un modello che tiene conto della bravura di chi risponde.
- **Nessuna stima**, la filosofia di prima. Scartata dall'autore il 3 ottobre.

## Consequences

- **ADR-004**: la condizione 2 è marcata come sostituita, con il testo di
  prima; lo Status lo dice.
- **`docs/filosofia.md`**: la frase di I-10 al posto di «il sito non insegna»;
  «niente gamification» riscritta per la costanza; l'imbuto con l'invito anche
  nella Home e nel risultato di una simulazione; la frase sulla stima lasciata
  com'è, con accanto che cosa la aspetta.
- **`docs/specifica.md`**: il §1 con la frase nuova; la condizione 2 del §2.4
  marcata; nel §4.6 una nota sulla difficoltà da tutti; nell'appendice A una
  nota su «niente gamification»; e nel §10 le decisioni, con accanto i
  requisiti che cambieranno. **Il §5, il §6, il §7 e i requisiti del §9 non si
  riscrivono adesso**: descrivono la pagina che c'è, e i loro controlli la
  tengono verde; cambiano con il progetto del ridisegno.
- **L'informativa** (`site/privacy.html`, dell'interfaccia) cambia prima della
  prima previsione registrata, prima di chiedere «com'è andata» e prima di
  registrare quale spiegazione è stata mostrata: dati nuovi e usi nuovi. Non è
  stata toccata qui.
- **Il server** conserverà dati nuovi — le previsioni, gli esiti dichiarati, la
  versione della spiegazione mostrata —, con lo schema che cambia solo per
  aggiunte (`account-progetto.md` §2.7); il §20 di `account-progetto.md` va
  aggiornato con la stima. Lo dice il progetto, non questo ADR.
- **Il motore** avrà la costanza e i quesiti da confermare: i contratti della
  riga 20 della coda. La stima è una ricerca a parte, la riga 23.
- **Aperto, per l'autore**: la frase della filosofia sulla stima; che cosa fa
  un giorno di attività, e come si contano i Segnali (Q-COSTANZA); la licenza
  delle spiegazioni; la strada per chiedere «com'è andata».
