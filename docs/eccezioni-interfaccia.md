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
| scala-css | i corpi scritti negli stili appartengono alla scala | P-97, il volto, giro A: la scala della Regata (decisione 1 di `docs/volto-progetto.md`) non ha più 19, 30 e 40. Misurato il 25 ottobre 2026 su `site/index.html`: 24 dichiarazioni `font-size:var(--t-19)` e `var(--t-30)` nei fogli. Lo chiude P-98 |
| scala-css | in :root i token dichiarano il contratto della scala e dei colori | P-97: in `:root` mancano `--t-20`, `--t-32`, `--t-44`, `--t-56`, `--s-64`, `--w-800`, `--lh-titoli-grandi`, `--boa`, `--rotta`, `--terra`, e `--acc`, `--ko`, `--ok` risolvono ai valori del giro 2 (`#076f99`, `#a4261d`, `#126832`) invece di `#0a4f6e`, `#b3261e`, `#12663a` (§5.1 del progetto). Lo chiude P-98 |
| T-13:corpi | i corpi calcolati del testo visibile appartengono alla scala | P-97: misurato il 25 ottobre 2026, i titoli delle sezioni e delle preparazioni a 30 px, l'h1 della Home a 40 sopra i 900 px, i numeri di «Che tecnica serve?» a 30, la domanda del runner a 19; nella scala della Regata sono 32, 56 solo al computer sopra la soglia, 20. Lo chiude P-98 |
| T-12:scelte | al piu' quattro bersagli nel primo schermo della Home e delle preparazioni, anche al computer con il percorso escluso | P-97: a 1280×800 la Home ha 5 bersagli nel primo schermo — «Simula il quiz base», «Allenati con 10 domande» e le anteprime Allenati, Esame, Progressi —; nella U sono quattro: la simulazione, il breve, il faro e la boa (decisione 6). Lo chiude P-98 |
| T-15:soglia | sotto la soglia della U (1.200 × 680 px) nessuno strato fisso, nessun fondo scuro e nessuno scorrimento a scatti; sopra, la carta c'e' | P-97: a 1280×800 la Home non ha la carta (nessuno strato fisso dentro `#v-home`, fondo 243,246,246). Sotto la soglia, a 1199×800 e a 1440×679, la pagina e' gia' giusta. Lo chiude P-98 |
| T-15:costa | a ogni dimensione del contratto gli undici triangoli stanno sulla terra, e il faro e la boa dentro lo schermo e fuori dalla colonna del testo | P-97: a 1200×700, 1280×800, 1280×1024, 1440×900 e 1920×1080 la Home non ha la carta, quindi ne' terra ne' percorso ne' luci. Lo chiude P-98 |
| T-15:velo | ogni testo sopra la carta ha il contrasto minimo contro il pixel peggiore dietro di lui, pannello per pannello | P-97: a nessuna delle cinque dimensioni la Home ha la carta da misurare. Lo chiude P-98 |
| T-15:percorso | il percorso e' una navigazione: undici link con un nome, aria-current sul pannello in vista, un tocco porta al pannello e al suo titolo senza cambiare l'indirizzo ne' la cronologia, bersagli di 44 px a 8 px, triangoli a 3:1 sulla terra | P-97: a 1280×800 nella Home non c'e' una `<nav>`, quindi 0 tappe su 11. Lo chiude P-98 |
| T-15:luci | il faro e la boa sono pulsanti di almeno 44 px con aria-expanded; toccati, la scheda dice la sigla in testo vero e non copre la colonna ne' l'azione principale | P-97: nessuna carta, quindi ne' faro ne' boa, a tutte e cinque le dimensioni. Lo chiude P-98 |
| T-15:movimento | con il movimento ridotto niente si muove: nessuna animazione, le luci accese ferme, la rotta disegnata intera | P-97: nella Home non ci sono luci `[data-luce]` ne' la rotta `[data-rotta]` (gli agganci del §11.1 del progetto). Lo chiude P-98 |
| T-15:movimento | senza il movimento ridotto le luci lampeggiano, e «Ferma le luci» le ferma | P-97: nessuna luce lampeggia, e non c'e' «Ferma le luci» (decisione 10). Lo chiude P-98 |
| T-15:numeri | i numeri della Home al computer vengono dalla banca e dal motore | P-97: a 1280×800 il testo della Home non dice «1722 quesiti», «135 esercizi», «53 segnali» ne' «fino a 25 quiz» dell'allenamento consigliato; dice gia', dalla banca, i 37 oscurati, le 4 note, il quesito senza figura e le condizioni della prova. Lo chiude P-98 |
| T-15:stati | la Home al computer tiene H1, HA, gli avvisi sopra il titolo e la banca non raggiungibile senza numeri inventati | P-97: senza pannelli non c'e' un primo pannello che tenga «Le attivita' di questa pagina», l'invito e la proposta; nella Home nessun `[role="alert"]`; con la banca che non risponde la Home non dice che i numeri non si contano. Lo chiude P-98 |
| T-15:documento | dalla Home al computer ad Allenati e Indietro: lo stesso documento, la carta via in Allenati e di nuovo nella Home, lo scorrimento tornato al pannello di prima | P-97: la Home al computer non ha la carta, prima e dopo Indietro. Lo chiude P-98 |

*P-97 (25 ottobre 2026) ha scritto i controlli del volto prima della pagina, come i giri 1 e 2: le righe qui sopra le toglie P-98, nello stesso commit della pagina.*

*P-95 ha chiuso le dieci verifiche T-13 e le quattro della scala CSS.
I gruppi girano per intero sulla pagina vera; confronto visivo e limiti
in [collaudo-p95/README.md](collaudo-p95/README.md).*

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
