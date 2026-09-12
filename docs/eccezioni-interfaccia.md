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
| index.html | 10 | `.logo .payoff` | Il payoff nella vetrina, che non è in nessuna delle sei aree: la corregge la sessione dedicata, in parallelo |

## Testi alternativi generici

`alt=""` è corretto per un'immagine decorativa affiancata da un testo
equivalente. Un alt **generico** è peggio di nessuno: dichiara che c'è
un'immagine e non dice quale.

| file | alt | perché è ancora qui |
|---|---|---|
| app.html | `figura` | L'unica riga che inserisce le 102 figure del decreto, su 119 quesiti: per un lettore di schermo quei quesiti restano senza contenuto. Il testo alternativo va preso dal quesito, non inventato. Area 3, il runner |

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
| `erroriSessione` | Riapre come esercizio gli errori di una sessione sola (12 settembre 2026): è il pezzo di motore che chiude il ciclo di un'attività, R-FLU-02. La chiamerà il riepilogo — **area 3** |
| `fondi` | Fusione di due specchi: serviva alla sincronia col server, tolta nella 0.19.0. Resta esportata e testata perché descrive la semantica della fusione, ma nessuno la chiama. Non ha un'area: è storia |
| `peggiori` | «Le tue voci più deboli» è sparita dalla Rotta nel ridisegno del 9 settembre 2026. È Q-DUE in `docs/specifica.md` §10 — due classifiche concorrenti, e decide l'autore — non ancora deciso. Toglierla dal motore prima della decisione perderebbe la costruzione se la Rotta la richiamasse |

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
| `SEGNALI` |
| `addGiorni` |
| `applica` |
| `classifica` |
| `coda` |
| `consigli` |
| `daAllenare` |
| `diagnosi` |
| `domandeSegnali` |
| `esito` |
| `estrai` |
| `estraiNuoviPrima` |
| `fondiArchivio` |
| `giorniTra` |
| `giroTecniche` |
| `isoLocale` |
| `lunghezzaPartita` |
| `mirata` |
| `ordinaRighe` |
| `poolSegnali` |
| `rimescola` |
| `ritmo` |
| `ripiega` |
| `sbagliato` |
| `screening` |
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
