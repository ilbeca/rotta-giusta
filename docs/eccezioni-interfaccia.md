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
| `estraiNuoviPrima` | La variante di allenamento della prova la chiama nel motore tramite `provaCarteggio()`; la pagina non la passa più come valore |
| `rimescola` | La composizione della prova è nel motore; la pagina non rimescola più la lista |
| `fondi` | Fusione di due specchi: serviva alla sincronia col server, tolta nella 0.19.0. Resta esportata e testata perché descrive la semantica della fusione, ma nessuno la chiama. Non ha un'area: è storia |

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
| `accoda` |
| `attivitaCarteggio` |
| `addGiorni` |
| `applica` |
| `classifica` |
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
| C-22 | la pagina non registra un service worker e non apre una cache | L'offline è uscito con l'ADR-005 (P-60, 3 ottobre 2026), e la pagina registra ancora `/sw.js` a ogni avvio; il service worker nuovo si disinstalla da sé, ma la registrazione c'è, e con lei per un attimo un service worker. Lo toglie P-61, con il guscio, l'autodiagnosi e il pulsante delle figure, e con questa riga, nello stesso commit |
| C-21 | la pagina non apre, non legge e non cancella l'archivio di prima: IndexedDB «open-patente-nautica» e le chiavi «pn.» | Il passaggio dell'archivio di prima è uscito con l'ADR-005 (P-60, 3 ottobre 2026), e la pagina lo fa ancora: `leggiVecchio()` apre `open-patente-nautica` e legge `pn.archivio` a ogni avvio e all'accesso, `mostraVecchio()` ne dice il conteggio, e con una conferma lo cancella. Lo toglie P-61, con questa riga e con la riga `NOME_VECCHIO_DB`, nello stesso commit |

*P-25 ha chiuso i cinque difetti di fuoco, reflow, contrasto e bersagli: i gruppi T-* girano per intero sulla pagina vera.*

*P-58 ha chiuso C-20: il pannello comune dell'account sta sopra runner,
revisione e riepiloghi. R-ACC-76 gira verde sulla pagina vera, senza eccezione.*
