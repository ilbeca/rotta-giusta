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
| `fondi` | Fusione di due specchi: serviva alla sincronia col server, tolta nella 0.19.0. Resta esportata e testata perché descrive la semantica della fusione, ma nessuno la chiama. Non ha un'area: è storia |
| `provaCarteggio` | La composizione della prova di carteggio nel motore (P-32, D-01 del §10.1 di `area-4-progetto.md`): lista, argomenti rappresentati e mancanti, riprese, completamento dichiarato, e le condizioni 4/60/3 in `PROVA_CARTEGGIO`. La pagina compone ancora con la sua `componiProva()`, che un test del motore tiene identica. La consuma la realizzazione dell'area 4 (P-21): allora `componiProva()`, `argomentiSenzaNuovi()` e le tre costanti `PROVA_*` escono dalla pagina, questa riga esce da qui, e se la pagina non chiama più `E.estrai` né `E.estraiNuoviPrima` le loro righe escono dalle chiamate protette, nello stesso commit |
| `attivitaCarteggio` | Le attività del Carteggio con il confine dell'attività, per `_t:'c'` e `_t:'t'` (P-33, D-02 del §10.1 di `area-4-progetto.md`): intere oltre le pause, ricostruite e dichiarate per le righe senza legame, isolate dai quiz e dall'altro tipo, ambigue con il motivo. La pagina non ha ancora un riepilogo o una revisione di carta e tecniche fuori dalla prova: la consuma la realizzazione dell'area 4 (P-21), e allora questa riga esce da qui |
| `nuovaBozza` | La bozza del carteggio (P-34, D-03 del §10.1 di `area-4-progetto.md`): una per runner aperto con l'account, lista congelata e scadenza da `PROVA_CARTEGGIO`. La pagina tiene ancora il testo solo in memoria (§7.6 della specifica, difetto aperto qui sotto): la consuma la realizzazione dell'area 4 (P-21) con il contratto del §9.4 di `account-client-progetto.md`, e allora questa riga esce da qui |
| `modificaBozza` | Il lavoro che cambia in una bozza — posizione, testi, consegna, giudizi — senza cambiare lista, tempo o modalità (P-34). La consuma P-21 insieme a `nuovaBozza` |
| `sostituisciBozza` | La regola di una scrittura della bozza dentro la transazione: una revisione vecchia non sovrascrive, una bozza conclusa o scartata altrove non si ricrea (P-34). La consuma P-21 insieme a `nuovaBozza` |
| `riprendiBozza` | La ripresa dopo una ricarica: la scadenza di prima, e una prova scaduta al confronto con il testo scritto (P-34). La consuma P-21 insieme a `nuovaBozza` |
| `concludiBozza` | Le righe finali di una bozza giudicata tutta, con lo schema di D-02 e gli uid che nascono dalla bozza; con un giudizio rinviato nessuna riga (P-34). La sostituisce, in P-21, la costruzione delle righe in `salvaCart()`, e allora questa riga esce da qui |
| `dettaglioCarteggio` | Schede, conteggi — coincidenti e da rivedere, scelte non coincidenti, campi vuoti e non registrati, non affrontati — e filtro della revisione di carta e tecniche, dalla stessa fonte (P-33, D-02). Oggi la revisione di una prova di carteggio filtra le righe in `apriRivedi()`; la sostituisce la realizzazione dell'area 4 (P-21), e allora questa riga esce da qui |
| `tagPerTentativo` | L'ultima classificazione N/L/C di ogni tentativo, per istante, con i tag storici senza data prima e le righe rotte ignorate (P-17, R-ARCH-13 e 14). La pagina la calcola ancora con la sua `tagPerTentativo()`, che un test del motore tiene uguale sulle righe che l'archivio accetta. La ricabla P-52, o la prossima penna su `app.html`: la revisione chiama `E.tagPerTentativo(S.archivio)`, la copia esce dalla pagina e questa riga esce da qui, nello stesso commit, con il nome aggiunto alle chiamate protette. `ordinaRighe` resta protetta: la pagina la chiama anche altrove |

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
`SEGNALI` è una costante, ed `estrai` ed `estraiNuoviPrima` viaggiano come valore
dentro `componiProva()`. Cercare `E.nome(` con la parentesi ne perderebbe tre su
trentatré — misurato scrivendo il controllo.

| funzione |
|---|
| `accoda` |
| `addGiorni` |
| `applica` |
| `classifica` |
| `coda` |
| `daAllenare` |
| `domandeSegnali` |
| `dopoInvio` |
| `dopoRicezione` |
| `dovePesa` |
| `erroriSessione` |
| `esito` |
| `estrai` |
| `estraiNuoviPrima` |
| `fondiArchivio` |
| `giorniTra` |
| `giroTecniche` |
| `isoLocale` |
| `lottoDaInviare` |
| `lunghezzaPartita` |
| `lunghezzaScreening` |
| `mirata` |
| `nonInviabili` |
| `nuovaCoda` |
| `nuovoTrasferimento` |
| `ordinaRighe` |
| `poolSegnali` |
| `quadro` |
| `registraEsito` |
| `riepilogoTrasferimento` |
| `rimescola` |
| `ripiega` |
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
| `tappeto` |
| `tendenza` |
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
| `C-19:ricarica` | `con l'account il testo scritto resta dopo una ricarica` | Il testo del carteggio sta solo in memoria dalla 0.5.0 (`annotaCart()`), e una ricarica durante la prova lo perde: §7.6 della specifica, dimostrato nel browser da P-34. Il contratto della bozza è nel §9.4 di `account-client-progetto.md` e nel motore; la pagina di riferimento del banco lo passa per intero. Lo chiude la realizzazione dell'area 4 (P-21) |
| `T-02` | `con due risposte che il server non ha, la pagina non dice che sono sul server` | Lo stato dell'invio (`#conto-stato`) si ridipinge solo quando un tentativo d'invio finisce, non quando una risposta entra in coda (`archivia()` chiama `pianificaInvio()` e non `dipingiContoStato()`): con due risposte in coda la pagina dice ancora «Le risposte di questo dispositivo sono confermate sul server». Misurato da P-45 il 30 settembre 2026: offline per circa un secondo, con una rete che non risponde per tutto il tempo della richiesta, fino ai 15 s del timeout di `chiamaApi()`. Lo chiude la realizzazione dell'area 6 (P-25), §3 e §7 del progetto |
| `T-02` | `mentre l'invio non risponde, il numero da inviare e' quello della coda` | Stessa causa della riga sopra: finche' la richiesta non finisce la pagina non scrive «N risposte da inviare». Lo chiude P-25 con la stessa correzione |
| `T-05:arresti` | `nel Percorso, a 375 px, nessun arresto di Tab resta coperto o fuori dallo schermo` | Con la tastiera, a 375 × 800 px, «Inizia l'attività», «Scegli un'attività» e la scheda dei Segnali prendono il fuoco sotto la barra fissa in basso: il browser le porta sul bordo dello schermo e la barra le copre (WCAG 2.4.11). Visto in una schermata da P-45. Lo chiude P-25, area 6 §5 («Barre fisse e azioni ancorate lasciano visibili […] il focus») |
| `T-07:prova` | `a 320 px nessuna vista, ne' il runner, il riepilogo o la finestra «Accedi», sborda` | A 320 px l'intestazione e' larga 336 px in ogni vista, e «Accedi» esce dallo schermo; in «Che tecnica serve?» le tessere e la tabella escono di 49 px; il toast `#sync` di 6 px. Misurato e guardato in una schermata da P-45. Lo chiude P-25, area 6 §5 («Partire da 320 CSS px») |
| `T-07:conto` | `con l'account, a 320 px Percorso, Progressi, Info e il pannello dell'account non sbordano` | Con l'account la barra ha anche Progressi, e a 320 px l'intestazione sborda di 23 px. Stessa causa della riga sopra, e la chiude P-25 |
| `T-08` | `a 375 px ogni testo che si vede ha il contrasto minimo sul suo fondo` | Sul tema chiaro il colore `rgb(96, 120, 135)` su `rgb(243, 246, 246)` misura 4,26:1 (pie' di pagina, versione, indicazioni `.hint`) e 4,09:1 sul fondo azzurro dei Segnali, contro 4,5:1: misurato da P-45 sui colori calcolati, appendice A della specifica. Lo chiude P-25, area 6 §4 |
| `T-09` | `a 375 px ogni controllo misura almeno 44 × 44 px, l'obiettivo del progetto` | I tag N/L/C del runner e del riepilogo misurano 31 × 29 px, e il sommario «La banca è del 2022…» di Info e' alto 41 px: sopra il minimo AA di 24 px, sotto l'obiettivo di 44 dell'appendice A. Misurato da P-45. Lo chiude P-25, area 6 §6 |
