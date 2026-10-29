# Gli argomenti e i testi dei pannelli della Home

**Data:** 29 ottobre 2026. **Che cos'è:** gli argomenti e i testi della Home a
pannelli, decisi con l'autore. Questo file non parla di disegno: niente layout,
animazioni o carta. Il riferimento è il prototipo
[`carta-corretta/index.html`](carta-corretta/index.html), che **non è stato
toccato**. Le correzioni al prototipo spettano a P-100, la pagina vera a P-102.

## 1. Che cosa ha chiesto l'autore, e che cosa ha deciso

Con le sue parole: «I pannelli devono illustrare le funzionalità del sito ma
essere anche una miniguida e "istruzioni per l'uso" agli utenti.» Chi scende
lungo i pannelli deve uscirne sapendo che cosa c'è nel sito e come si usa.

**Deciso il 29 ottobre 2026, dall'autore:**

- **Al massimo 6 pannelli.** La prima proposta ne aveva 11, uno per triangolo
  del prototipo, e l'autore l'ha respinta: «troppi pannelli, la gente si
  annoia». Le funzioni non hanno più un pannello a testa: la simulazione, le
  dieci domande, l'allenamento consigliato, gli argomenti, gli errori e i
  Segnali sono nominati dentro le istruzioni.
- **L'ordine è quello d'uso.** Prima che cos'è il sito, poi da dove si
  comincia, come si risponde a una domanda, la prova al tavolo, i limiti, e
  infine l'account.

| # | Nel percorso | Argomento | Ruolo |
|---|---|---|---|
| 0 | Inizio | Che cos'è il sito, e «Simula il quiz base» | funzionalità |
| 1 | Da dove si comincia | Le prove dell'esame, il primo passo, e la mappa di Allenati, Esame e Progressi | istruzione |
| 2 | Una domanda | Come si risponde, la correzione, gli errori, il segnalibro, la ricerca per numero | istruzione e funzionalità |
| 3 | Il carteggio | La prova al tavolo, e il giudizio di chi studia | istruzione e funzionalità |
| 4 | Quello che non torna | I limiti dichiarati delle domande, e dove leggerli | funzionalità |
| 5 | Con l'account | Che cosa fa l'account, e che cosa si vede in Progressi | funzionalità |

«Nel percorso» è il nome del triangolo del pannello, cioè il suo nome
accessibile.

## 2. Le regole che i testi seguono

- **Nessuna promessa che il sito non mantiene** (`docs/filosofia.md`). La stima
  non si mostra e le spiegazioni non ci sono ancora, quindi i testi non ne
  parlano. Nessun voto sulla preparazione: niente «pronto», niente
  percentuali.
- **Senza account la frase della conservazione non sta nella Home**, nemmeno
  parafrasata (decisione A, R-RIF-21). Sta accanto a «Inizia». Per questo il
  pannello 5 dice che cosa fa l'account, ma non che cosa succede senza: la Home
  può dire soltanto il lato buono, nel pannello 1 («Per cominciare non serve
  registrarsi»).
- **Nella Home senza risposte nessun invito a registrarsi** (R-ACC-03). Il
  pannello 5 descrive e non ha pulsante.
- **D-36:** un titolo non finisce con una parola sola, e il titolo principale
  della Home al computer sta in tre righe al più.
- **I-23 e D-01…D-35:** una parola per significato, frasi al più di 25 parole,
  e pulsanti che cominciano con un verbo. Niente gergo nostro: si scrive
  *domanda*, non quesito; *risposta esatta*, non ufficiale o ministeriale;
  *tolte dall'esame*, non oscurate; *del Ministero*, non del decreto.
- **I nomi decisi** restano: «Simula il quiz base», «Allenati con 10 domande»,
  «Con l'account, le risposte restano», Home · Allenati · Esame · Progressi.
- **Ogni numero ha una fonte**, scritta sotto il suo pannello. Le migliaia si
  scrivono con il punto: **1.722**, **1.472**.

## 3. I sei pannelli

I testi sono quelli della Home senza risposte e senza account (H0). Gli altri
stati sono nel §4. Contate le parole del testo che si legge, con le etichette
ma senza i link: ogni pannello ne ha da 30 a 62, e la frase più lunga ne ha 23.
Il conto non è stato rifatto sulla pagina, perché la pagina ancora non c'è.

### Pannello 0 — Inizio

**Che cosa deve sapere chi arriva:** che cos'è il sito, e che può provare
l'esame subito.

- **Titolo (h1):** La patente nautica, un passo alla volta.
- **Sottotitolo:** Quiz e carteggio per la patente senza limiti dalla costa, a
  motore e a vela. Gratis.
- **Scheda:** *La prova d'esame dei quiz*, con tre numeri: **20** domande ·
  **30** minuti · **4** errori ammessi.
- **Pulsante pieno:** Simula il quiz base →
- **Sotto il pulsante:** La correzione arriva alla fine, come all'esame.

**Fonti.** 20, 30 e 4 vengono da `meta.prove.base` (`n`, `minuti`,
`errori_max`).

**Perché cambia rispetto al prototipo:**
- **Il titolo.** Il prototipo dice «Preparati alla patente nautica, un passo
  alla volta.»: a 56 px al computer va su quattro righe, e «volta.» resta da
  sola (`analisi-taste-2026-10-29.md`). Non passa D-36. Senza «Preparati» sta in
  tre righe.
- **Il sottotitolo.** «A motore e a vela» c'è perché nella lettura da fuori
  (I-23) due lettori su cinque hanno creduto che il sito fosse per la patente
  entro 12 miglia. «Gratis» l'hanno capito tutti e cinque.
- **«Errori ammessi».** Sostituisce «errori al più», che sotto il numero si
  legge «4 errori al più», al contrario.

### Pannello 1 — Da dove si comincia

**Che cosa deve sapere chi lo legge:** come è fatto l'esame, qual è il primo
passo, e a che cosa servono le tre sezioni.

- **Titolo:** Da dove si comincia
- **Testo:** All'esame le prove sono tre: il carteggio, il quiz base e, se
  prendi anche la vela, il quiz vela. Per cominciare non serve registrarsi:
  bastano dieci domande.
- **La mappa, tre righe:**
  - **Allenati** — ti eserciti su quiz, carteggio e segnali, un argomento alla
    volta o sugli errori.
  - **Esame** — fai le prove come all'esame, nell'ordine in cui le sostieni.
  - **Progressi** — vedi che cosa hai fatto e dove sbagli.
- **Azione (link):** Allenati con 10 domande

**Fonti.** Le tre prove, nel loro ordine: specifica §7.9, con il carteggio da
`PROVA_CARTEGGIO`. Il 10 viene da `preparaBreve().quanti`: è 10 finché il quiz
base ha almeno dieci domande, e il nome del link resta quello deciso.

**Perché.** Risponde alla prima domanda di chi comincia da zero (specifica §1,
§7.1). La mappa è la differenza fra le sezioni detta in una riga ciascuna, con
la parola che la distingue: in Allenati *ti eserciti*, in Esame *fai le prove*,
in Progressi *vedi*. I Segnali sono nominati qui, come terzo segmento di
Allenati, invece di avere un pannello a sé. La frase di Progressi vale nei due
stati: senza account mostra le attività della pagina aperta, con l'account la
mappa per argomento.

### Pannello 2 — Come funziona una domanda

**Che cosa deve sapere chi lo legge:** che cosa succede quando risponde, che
cosa fa dopo un errore, e come ritrova una domanda.

- **Titolo:** Come funziona una domanda
- **Testo:** Rispondi toccando, o con i tasti 1, 2 e 3. Vedi subito se è giusta,
  accanto alla risposta esatta. Nella simulazione, invece, la correzione arriva
  alla fine.
- **Testo:** Dopo un errore puoi segnare perché: «Non lo sapevo» o «Svista». Poi
  lo riapri da «Ripassa gli errori».
- **Testo:** Con il segnalibro tieni da parte una domanda. Se studi sul libro,
  la ritrovi dal suo numero.
- **Azione:** nessuna. Chi non ha ancora risposto non ha errori da riaprire.

**Fonti.** Nessun numero. I comportamenti vengono dalla specifica:
- i tasti, la correzione e la simulazione: §7.5;
- i due tag: §5.4 e R-TAG-01;
- il segnalibro, «Ripassa gli errori» e la ricerca per numero: §5.3.

**Perché.** È la schermata che chi studia vede più spesso, e nessun pannello
del prototipo la spiegava. I nomi fra virgolette sono quelli che si leggono
nell'app, così chi li incontra li riconosce. «Segnala un problema» resta fuori:
lo si trova sotto la domanda, e un pannello che elenca tutto annoia.

### Pannello 3 — Il carteggio, al tavolo

**Che cosa deve sapere chi lo legge:** che il carteggio è la prima prova e va
superata, che si fa al tavolo e non al telefono, e che il giudizio è suo.

- **Titolo:** Il carteggio, al tavolo
- **Testo:** All'esame si comincia da qui, e va superato per andare avanti: **4**
  esercizi sulla carta nautica in **60** minuti, almeno **3** giusti.
- **Testo:** Qui trovi i **135** esercizi del Ministero, sulle carte **5/D** e
  **42/D**. Li fai al tavolo, con squadrette e compasso, poi metti la tua
  risposta accanto a quella esatta e giudichi tu.
- **Azione (link):** Apri il Carteggio
- **Pulsante di contorno, già nel prototipo:** «Rivedi l'esercizio sulla carta».
  Nel prototipo si chiama «Rivedi il triangolo delle correnti», ma chi comincia
  non sa che cos'è il triangolo delle correnti.

**Fonti.**
- 4, 60 e 3 vengono da `PROVA_CARTEGGIO` (`esercizi`, `minuti`, `soglia`), DM
  323/2021, art. 6 c. 6.
- 135 sono gli esercizi in `carteggio.json`.
- 5/D e 42/D sono le carte degli esercizi (`carta`).

**Perché.** Nella lettura da fuori un solo lettore su cinque ha capito che
cos'è il carteggio. Chi comincia da zero non sa che è la prima prova, e non sa
che le carte si comprano (specifica §1). «Va superato per andare avanti» dice
la sostanza di «propedeutiche alla sua prosecuzione» del DM 323/2021 senza la
parola «eliminatoria», che è una parafrasi
(`docs/ricerca-programma-esame.md` §4.3). «Giudichi tu» è R-UX-03 detto in
breve. La frase lo dice prima di Inizia, nella preparazione, e la Home non la
sostituisce.

**Lasciato fuori:** «Che tecnica serve?», il riconoscimento senza carte. Sta
nel Carteggio e lo si trova lì. Se l'autore lo vuole nella Home, è una frase in
più: «Al telefono, senza carte, puoi allenarti a capire che tecnica serve.»

### Pannello 4 — Quello che non torna

**Che cosa deve sapere chi lo legge:** che le domande sono quelle dell'esame,
che alcune non tornano, e che il sito lo dice invece di nasconderlo.

- **Titolo:** Quello che non torna
- **Testo:** Qui ci sono le **1.722** domande del Ministero: **1.472** del quiz
  base e **250** della vela. Nel 2024 il Ministero ne ha tolte **37**
  dall'esame. Qui restano, e lo dicono prima che tu risponda.
- **Testo:** In **4** una nota, dopo la risposta, dice dove la norma è cambiata
  o la risposta sembra sbagliata: all'esame vale quella del Ministero. A **1**
  manca la figura.
- **Azione (link):** Leggi note e fonti → Profilo → Info, aperto su «Che cosa
  non torna, e lo diciamo» (`data-info-section="difetti"`).

**Fonti.**
- 1.722 sono le domande in `quiz.json`.
- 1.472 e 250 sono le domande per `k`, uguali a `meta.stats`.
- 37 sono le domande con `osc`.
- 4 sono quelle con `nb`: tre citano il DM 133/2024, una è il quesito dei flap,
  base-405.
- 1 è base-59, l'unica con `fm`.
- «Nel 2024»: la circolare MIT 30432 del 15 novembre 2024.

**Perché.** I limiti dichiarati sono la cosa che distingue il sito (specifica
§2.5), e qui hanno un pannello. Stanno dopo il pannello 2, così chi incontra la
nota di una domanda tolta sa già che cosa vuol dire.

**Che cosa non dice, di proposito.** «11 divergono dal DM 133/2024», come il
README: otto di quelle undici sono anche fra le 37 tolte. Dire 37 e 4 conta
ogni domanda una volta, e il conto si fa sui file della banca.

### Pannello 5 — Con l'account, le risposte restano

**Che cosa deve sapere chi lo legge:** a che cosa serve registrarsi.

- **Titolo:** Con l'account, le risposte restano *(titolo deciso, decisione 12)*
- **Testo:** Ritrovi le tue risposte quando torni, anche da un altro telefono.
  In Progressi vedi, argomento per argomento, che cosa hai preso, che cosa è da
  rifare e che cosa non hai mai visto.
- **Azione:** nessuna (R-ACC-03). Chi vuole registrarsi trova «Accedi» in alto.

**Fonti.** La conservazione e i dispositivi: specifica §3.2. La mappa di
Progressi: §7.4. «Da rifare» e «mai visti» sono parole di Q-STATI. «Preso» sta
per gli altri tre stati insieme: «da confermare», «recuperati» e «acquisiti».

**Perché.** Il pannello dice i vantaggi che esistono e nessun altro. I cinque
stati di Progressi non si spiegano qui: li spiega la loro legenda, con il `?`.

**Alternativa.** Aggiungere: «Anche una prova di carteggio lasciata a metà
riprende da dove eri.» È vero (la bozza, §7.6), ed è il vantaggio più concreto
per chi fa il carteggio. Costa una riga.

## 4. Negli altri stati della Home

I pannelli 1–5 non cambiano. Cambia il primo pannello, e non lo decide questo
file: lo decide R-VOLTO-09.
- **Con risposte senza account (H1):** «Le attività di questa pagina» e
  l'invito stanno nel pannello 0.
- **Con l'account (HA):** il pannello 0 mostra la proposta consigliata.
- **Banca che non risponde:** i numeri dei pannelli 0, 3 e 4 non si scrivono, e
  il pannello lo dice. Non compare nessun numero inventato.

Una frase va detta diversamente con l'account (HA). Il pannello 1 dice «Per
cominciare non serve registrarsi», che a chi è già dentro non serve. Proposta:
in HA quella frase non c'è.

## 5. Note per la regia

Le cose che toccano controlli, specifica o altri prompt. Nessuna è stata
cambiata qui.

1. **Da 11 a 6 pannelli.** Il percorso scende da 11 a 6 triangoli. Toccano:
   - R-VOLTO-02 («gli undici triangoli») e R-VOLTO-04 («undici link»);
   - la decisione 12 del volto (la tappa 10), il §10 di `volto-progetto.md` con
     i testi delle tappe, e i controlli di T-15 che contano pannelli e triangoli.

   P-101, che scrive i controlli della Home a pannelli, è stato avvisato il 29
   ottobre.
2. **R-VOLTO-08 cerca nel testo numeri che qui non ci sono più:** i 53 segnali,
   la dimensione dell'allenamento consigliato e i pesi dei temi («N delle 20
   domande»). Restano nel testo le domande (1.722), gli esercizi (135), le
   domande tolte (37), le note (4), quella senza figura (1) e le condizioni
   della prova (20, 30, 4). Il controllo va riscritto sull'elenco nuovo, oppure
   l'autore rimette una di quelle frasi.
3. **R-RIF-21 per significato.** «Per cominciare non serve registrarsi»
   (pannello 1) non dice né «account» né che le risposte non restano, quindi
   non dovrebbe scattare. Va comunque provato, perché è la frase più vicina al
   confine.
4. **«1.722» con il punto.** `toLocaleString('it-IT')` non raggruppa sotto le
   cinque cifre. P-102 deve scriverlo con una funzione che lo faccia sempre.
5. **«domanda» e «quesito».** L'app scrive «Cerca un quesito per numero», e la
   Home dice «domanda». Le regole di I-23 vogliono una parola sola. Rinominare
   l'app è un lavoro a parte.
6. **I tasti 1, 2 e 3** (pannello 2) valgono dove c'è una tastiera. La Home a
   pannelli è quella al computer (sopra 1.200 × 680 px). Se i pannelli finiscono
   anche al telefono, quella frase va tolta lì, come fa il runner (§7.5).
7. **Il titolo principale** cambia da «Preparati alla patente nautica, un passo
   alla volta.» a «La patente nautica, un passo alla volta.», per D-36. Le
   misure vanno rifatte sulla pagina vera.
8. **«Rivedi il triangolo delle correnti»** diventa «Rivedi l'esercizio sulla
   carta». Cambia solo l'etichetta.
