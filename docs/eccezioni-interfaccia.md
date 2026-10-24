# Eccezioni dichiarate dell'interfaccia

**File neutro, e non per comodità.** I controlli stanno in
`tests/test_interfaccia.py`, che è territorio `motore`; le **eccezioni** stanno
qui, che è neutro, perché a toglierle è chi corregge il difetto — e chi corregge
l'interfaccia lavora su `ui/*`, dove `tests/` gli è precluso. Senza questa
separazione una correzione lascerebbe la suite rossa e nessuno potrebbe chiuderla.

**Come si usa.** Correggi il difetto → togli la sua riga da qui, nello stesso
commit. Se lasci la riga, il controllo te lo dice: **un'eccezione che non serve
più nasconde la prossima.** Se aggiungi una riga, scrivi il perché e l'area che
la chiuderà: una dichiarazione senza motivo non è una decisione, è un rinvio.

Le tabelle sono lette da `tests/test_interfaccia.py`. Non cambiare le
intestazioni né l'ordine delle colonne.

## Testi sotto gli 11 px

Sotto quella soglia un testo non è piccolo: è illeggibile per una parte delle
persone, e il contesto d'uso primario dichiarato di questo prodotto è il
telefono. I difetti qui sotto vengono dall'audit del 12 settembre 2026.

| file | px | selettore | perché è ancora qui |
|---|---|---|---|

*Nessuno, al momento: le sette eccezioni di `app.html` le ha chiuse l'area 1, quella di `index.html` la vetrina (12 settembre 2026).*

## Testi alternativi generici

`alt=""` è corretto per un'immagine decorativa affiancata da un testo
equivalente. Un alt **generico** è peggio di nessuno: dichiara che c'è
un'immagine e non dice quale.

| file | alt | perché è ancora qui |
|---|---|---|

*Nessuno, al momento: l'alt `figura` di `app.html` l'ha chiuso l'area 3 (26 settembre 2026) — runner e revisione dei quiz prendono il testo alternativo dal quesito. Era l'unica inserzione delle figure del decreto nella pagina; il Carteggio non ne ha una sua.*

## Funzioni del motore che nessuno chiama

Una funzione esportata e testata che nessuno chiama è codice che sembra vivo. A
volte è voluto — sta lì in attesa dell'area che la consumerà — e allora si
dichiara qui, **con l'area che la chiuderà**.

Quando la pagina comincia a chiamarla: togli la riga da qui e aggiungi il nome
alla tabella sotto, nello stesso commit. Il controllo lo pretende in tutti e due
i versi, perché una funzione dichiarata orfana *mentre* la pagina la usa è una
dichiarazione che mente.

| funzione | perché è ancora qui |
|---|---|
| `estrai` | La prova di carteggio la chiama nel motore tramite `provaCarteggio()`; la pagina non la passa più come valore. Resta esportata per il motore e i suoi test, senza chiamanti diretti nella pagina |
| `rimescola` | La composizione della prova è nel motore; la pagina non rimescola più la lista |
| `fondi` | Fusione di due specchi: serviva alla sincronia col server, tolta nella 0.19.0. Resta esportata e testata perché descrive la semantica della fusione, ma nessuno la chiama. Non ha un'area: è storia |
| `rigaAvvio` | La riga d'avvio di una simulazione, con le previsioni registrate (P-72, A-1 del §10.1 di `docs/esito-esame-progetto.md`). La scrive la pagina a Inizia, con l'account e solo se il server dichiara `'a'` fra i `tipi_riga`: B-2, su `ui/main`. `previsioniProva()` non è qui perché la chiama `rigaAvvio()` |
| `rigaDiRisposta` | Il predicato con cui la pagina conta le «risposte» senza le righe d'avvio e i tag (§4.3 e §7 di `docs/esito-esame-progetto.md`; i chiamanti sono elencati nel §10.1, A-1): B-2, su `ui/main` |

<!-- P-81: classifica esce dalle protette: l’unico chiamante diretto era il motivo
     rotta-rec-motivo nella vecchia Home, tolto dal ridisegno. Resta nel motore
     tramite quadro, dovePesa e traccia (§10.1 del progetto, decisione 18 ottobre). -->

## Chiamate al motore protette

Le funzioni che `app.html` consuma **oggi**. Il controllo pretende che ognuna
resti consumata: è il gemello del controllo sugli orfani visto dall'altro lato —
quello prende una funzione che nessuno chiama, questo prende una funzione che la
pagina chiamava e non chiama più. Nasce dal caso `peggiori()`, uscita dal
prodotto nella merge del 9 settembre 2026 senza che nessuno l'avesse deciso.

**Aggiungi una riga** quando la pagina comincia a chiamare qualcosa di nuovo: da
quel momento è protetta. **Togli una riga** solo insieme alla chiamata, e scrivi
nel commit perché: quello che non va bene non è che una chiamata sparisca, è che
sparisca in silenzio.

L'elenco comprende anche ciò che la pagina consuma **senza chiamarlo**:
`SEGNALI` è una costante. La prova di carteggio usa ora il raccordo con
`provaCarteggio()`; `estrai` ed `estraiNuoviPrima` restano nel motore, senza una
seconda composizione nella pagina.

| funzione |
|---|
| `contaStati` |
| `rigaScrivibile` |
| `codaSegnalibri` |
| `cercaNumero` |
| `estraiNuoviPrima` |
| `riepilogoPagina` |
| `accoda` |
| `attivitaCarteggio` |
| `addGiorni` |
| `applica` |
| `concludiBozza` |
| `coda` |
| `daAllenare` |
| `dettaglioCarteggio` |
| `domandeSegnali` |
| `dopoInvio` |
| `dopoRicezione` |
| `dovePesa` |
| `erroriSessione` |
| `esito` |
| `fondiArchivio` |
| `giorniTra` |
| `giroTecniche` |
| `isoLocale` |
| `lottoDaInviare` |
| `lunghezzaPartita` |
| `lunghezzaScreening` |
| `mirata` |
| `modificaBozza` |
| `nonInviabili` |
| `nuovaCoda` |
| `nuovaBozza` |
| `nuovoTrasferimento` |
| `ordinaRighe` |
| `poolSegnali` |
| `provaCarteggio` |
| `quadro` |
| `registraEsito` |
| `riepilogoTrasferimento` |
| `ripiega` |
| `riprendiBozza` |
| `risolviConflitto` |
| `ritmo` |
| `sbagliato` |
| `screening` |
| `SEGNALI` |
| `serieGruppi` |
| `sessioni` |
| `simulazione` |
| `simulazioneVela` |
| `stato` |
| `stimaImpegno` |
| `sostituisciBozza` |
| `tagPerTentativo` |
| `tappeto` |
| `tendenza` |
| `validaBozza` |
| `traccia` |

## Letture che possono mascherare un guasto

Una lettura che ripiega su un valore di comodo quando fallisce trasforma un
errore in un dato plausibile: è la forma esatta del guasto muto. Qui stanno
quelle che esistono ancora, con l'area che le chiude.

| file | espressione | perché è ancora qui |
|---|---|---|

## Difetti aperti dichiarati

Un controllo che dimostra un difetto del prodotto, e che resta rosso finché il
difetto c'è. Dichiararlo qui tiene `main` verde senza spegnere il controllo:
la suite pretende che la verifica nominata **giri sulla pagina vera e sia
rossa**, con i passi prima di lei verdi — cioè che il difetto sia ancora vero e
misurato per il motivo giusto. Il giorno che la verifica diventa verde, la riga
è una dichiarazione che mente, e la suite lo dice: chi corregge il difetto
toglie la riga nello stesso commit, e il banco esegue il gruppo per intero
sulla pagina vera.

| parte | verifica | perché è ancora qui |
|---|---|---|
| T-13:corpi | i corpi calcolati del testo visibile appartengono alla scala | P-94, giro 2: Home a 375: 7 corpi, compreso Accedi a 11 px e h2 a 13; a 1280 il titolo Home è 48 px, fuori dal 40 previsto. Correzione su ui/* |
| T-13:corpi | nel primo schermo al piu' cinque corpi (soglia nostra) | P-94, giro 2: Home H0: 7 corpi a entrambe le larghezze; Segnali arriva a 9 a 375 e 10 a 1280, contro il massimo di 5. Correzione su ui/* |
| T-13:titoli | un h1 per vista, al piu' tre livelli e nessun titolo piu' piccolo del testo o dei sottotitoli (soglia nostra per le dimensioni) | P-94, giro 2: Home: h2 a 13 px sopra h3 a 23 e testo a 16; in Allenati gli h2 introducono testo più grande. Correzione su ui/* |
| T-13:testo | testo corrente e risposte almeno 16 px, interlinea 1,45 e titoli 1,2 (soglie nostre), senza giustificato o maiuscolo su piu' righe | P-94, giro 2: Paragrafi a 13 e 14 px, risposte del runner a 15,5; titoli con interlinea 1,45 invece di 1,2; testo a 1,55 invece di 1,45. Correzione su ui/* |
| T-13:spazi | gli spazi calcolati appartengono alla scala | P-94, giro 2: Testata a 375 con padding 10 e 14 px e gap del marchio di 6; la scala ammette 4, 8, 12, 16, 24, 32, 48. Correzione su ui/* |
| T-13:spazi | fra due sezioni piu' spazio che fra i figli della stessa sezione | P-94, giro 2: In Esame a 375 fra prove e modulo 24 px, dentro le prove 24; a 1280 dentro 30, maggiore dei 24 esterni. Correzione su ui/* |
| T-13:pesi | pesi 400, 600, 700 e grassetto al piu' cinque parole nel paragrafo (soglia nostra) | P-94, giro 2: Marchio a 800, altri testi a 650, 550 e 500; la decisione C ammette solo 400, 600 e 700. Correzione su ui/* |
| T-13:distanze | fra due bersagli dello stesso strato almeno 8 px, esclusi segmenti e link nella frase; con un dialogo aperto, solo nel dialogo | P-94, giro 2: Voci della barra a 0 px; la soglia è 8 px. Solo i figli di tablist e i link dentro un paragrafo sono esclusi. Correzione su ui/* |
| T-13:righe | a 1280 px le righe di testo corrente hanno al piu' 75 caratteri | P-94, giro 2: A 1280 la Home arriva a 105 caratteri per riga, il massimo del giro è 110; soglia 75. Correzione su ui/* |
| T-13:colori | i colori di ruolo sono riservati ad azioni, errori e avvisi (ruoli nostri) | P-94, giro 2: Il colore di accento #076f99 compare sui segni informativi non interattivi delle tecniche; il ruolo è riservato a ciò che si tocca. Correzione su ui/* |
| scala-css | i corpi scritti negli stili appartengono alla scala | P-94, giro 2: Nei fogli 11, 12,5, 13, 15,5 e altri valori; i corpi contrattuali sono 12, 14, 16, 19, 24, 30 e il 40 limitato alla Home larga. Correzione su ui/* |
| scala-css | gli spazi scritti negli stili appartengono alla scala | P-94, giro 2: Margini e padding da 1, 2, 3, 5, 6, 10, 14, 18 e 22 px, più valori in em e calc con numeri fuori scala. Correzione su ui/* |
| scala-css | i pesi scritti negli stili appartengono alla scala | P-94, giro 2: Dichiarazioni 500, 550, 650, 750, 800 invece di 400, 600, 700; il descrittore @font-face è escluso perché dichiara il file, non un peso usato. Correzione su ui/* |
| scala-css | in :root i token dichiarano il contratto della scala e dei colori | P-94, giro 2: Cinque blocchi :root, nessun --t-* o --s-*; mancano i token delle interlinee, dei pesi e della larghezza. Correzione su ui/* |

*P-91 ha chiuso T-10 e T-11: proseguimento raggiungibile scorrendo il runner
e figura in vista prima della risposta. I gruppi girano per intero sulla
pagina vera; misure e limiti in [runner-quiz-ux.md](runner-quiz-ux.md).*

*P-25 ha chiuso i cinque difetti di fuoco, reflow, contrasto e bersagli: i gruppi T-* girano per intero sulla pagina vera.*

*P-58 ha chiuso C-20: il pannello comune dell'account sta sopra runner,
revisione e riepiloghi. R-ACC-76 gira verde sulla pagina vera, senza eccezione.*

*P-61 ha chiuso C-21 e C-22: la pagina non legge né cancella l'archivio di
prima, non registra un service worker e non apre cache. I due gruppi girano
per intero sulla pagina vera, senza difetti dichiarati.*

## Valori fuori scala

Eccezioni geometriche della decisione C, non nuovi spazi della scala.
Lo statico ammette solo le coppie esatte qui elencate; T-13 limita l'eccezione
calcolata al selettore e alla proprietà descritti.

| proprietà | valore | perché |
|---|---|---|
| `padding-top` | `calc(var(--altezza-testata) + 12px)` | Il runner e la revisione lasciano libera la testata fissa: 70 o 88 px più 12, cioè 82 o 100 px; misura geometrica, non spaziatura editoriale |
| `padding-bottom` | `90px` | main sul telefono lascia libero il posto della barra fissa e il respiro del contenuto sotto di essa; decisione C |
| `padding` | `0 16px calc(90px + var(--safe-b))` | La stessa riserva sotto la barra con l'area sicura del dispositivo; decisione C |
