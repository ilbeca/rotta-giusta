# Il ridisegno visivo — i mock di Claude, 24 ottobre 2026

La diagnosi, le tre direzioni e le decisioni per l'autore stanno nella scheda
**I-29** di [`docs/idee-dopo-gli-account.md`](../../idee-dopo-gli-account.md).
Qui ci sono i mock della direzione raccomandata, **A — La carta nautica**, la
tavola con le tre direzioni, e le schermate: di oggi e dei mock.

Sono **mock**: HTML statici, non il sito. Nessun file di `site/` è stato
toccato. I dati sono quelli veri della banca (1.722 quesiti, i pesi d'esame, il
quesito 1.7.6-19), il resto è un esempio senza account.

## I file

| File | Che cosa mostra |
|---|---|
| [`direzioni.html`](direzioni.html) | Le tre direzioni a confronto: la stessa Home in A, B e C |
| [`home.html`](home.html) | La Home senza risposte, direzione A |
| [`quiz.html`](quiz.html) | Allenati · Quiz, direzione A |
| [`runner.html`](runner.html) | La domanda dopo una risposta sbagliata, direzione A |
| [`riepilogo.html`](riepilogo.html) | Il riepilogo di un allenamento breve fermato dopo 2 domande su 10 |
| [`sorgenti/`](sorgenti/) | Da dove sono composti: `comune.css`, le icone, la carta disegnata, `build.py`, e i due script di cattura |

Ogni HTML è **autoconsistente**: il carattere Manrope (licenza SIL OFL 1.1, il
testo in `site/caratteri/OFL.txt`) è incorporato in base64, stile e icone sono
nel file, nessuna risorsa da altri host. Si aprono con un doppio clic, e si
adattano da 375 a 1280 px.

Per rifarli dalle sorgenti:

```bash
python3 docs/prototipi/redesign-2026-10-claude/sorgenti/build.py docs/prototipi/redesign-2026-10-claude site/caratteri/manrope-latin-wght-normal.woff2
```

## Le schermate di oggi — `oggi/`

`main` a `3e64758` (v0.34.0), servito con `strumenti/serve.py`, senza account,
Chrome headless, 24 ottobre 2026. Le ha prese `sorgenti/cattura-oggi.mjs`.
Sono quelle su cui poggia la diagnosi di I-29; tutte guardate.

| Schermata | Che cosa si vede, e il punto della diagnosi |
|---|---|
| [`oggi/home-375-intera.png`](oggi/home-375-intera.png) | Home intera al telefono: nessuna immagine, tre bianchi, le tre sezioni ripetute come schede (punti 1, 3, 8) |
| [`oggi/home-1280.png`](oggi/home-1280.png) | Home al computer: l'unica illustrazione del sito, piccola, e due avvii alla pari per misura |
| [`oggi/quiz-375-intera.png`](oggi/quiz-375-intera.png) | Allenati · Quiz al telefono: 14 pulsanti azzurri pallidi uguali, titoli ripetuti nei pulsanti (punti 2, 4) |
| [`oggi/quiz-1280.png`](oggi/quiz-1280.png) | Allenati al computer: schede da 1056 px con il testo a 480, metà vuota (punto 6) |
| [`oggi/carteggio-375-intera.png`](oggi/carteggio-375-intera.png) | Il Carteggio: tre schede di testo, «Prima di cominciare» con l'ombra, quattro pulsanti pallidi; nessuna carta disegnata (punti 1, 4) |
| [`oggi/carteggio-1280.png`](oggi/carteggio-1280.png) | Il Carteggio al computer: righe larghe con poco dentro |
| [`oggi/segnali-375-intera.png`](oggi/segnali-375-intera.png) | I Segnali: il contenuto più visivo del sito presentato come testo e schede |
| [`oggi/esame-375-intera.png`](oggi/esame-375-intera.png) | Esame al telefono: le prove in schede a colonne strette, un muro di testo in «Com'è fatto l'esame» (punti 6, 8) |
| [`oggi/esame-1280.png`](oggi/esame-1280.png) | Esame al computer: «Quiz / base / e / vela» una parola per riga |
| [`oggi/progressi-375.png`](oggi/progressi-375.png) | Progressi senza account: un titolo, una frase, un pulsante pallido |
| [`oggi/preparazione-375.png`](oggi/preparazione-375.png) | La preparazione dell'allenamento breve: una scheda bordata dentro la pagina |
| [`oggi/runner-risposta-375.png`](oggi/runner-risposta-375.png) | La domanda dopo una risposta: tre pastiglie in cima, la striscia «Quiz / Quiz base», nessun segno di avanzamento (punto 7) |
| [`oggi/runner-risposta-1280.png`](oggi/runner-risposta-1280.png) | La domanda al computer, con una figura: il testo fluttua, l'esito finisce in basso a sinistra (punti 6, 7) |
| [`oggi/riepilogo-375.png`](oggi/riepilogo-375.png) | Il riepilogo: «Attività interrotta», risultati come campi di un modulo, quattro pulsanti (punto 7) |
| [`oggi/riepilogo-1280.png`](oggi/riepilogo-1280.png) | Il riepilogo al computer: cinque pulsanti di pari peso su tre righe |
| [`oggi/accedi-375.png`](oggi/accedi-375.png) | Il pannello Accedi: dieci pulsanti in colonna, l'accesso sembra un menu (punto 2) |

## Le schermate dei mock — `schermate/`

Prese con `sorgenti/cattura.mjs` dagli HTML di questa cartella, Chrome headless,
24 ottobre 2026; tutte guardate. Accanto, quello che lo script ha misurato:
sbordamento orizzontale e il fondo dell'unico `data-ruolo="principale"`.

| Schermata | Che cosa mostra | Misura |
|---|---|---|
| [`schermate/direzioni-1280-intera.png`](schermate/direzioni-1280-intera.png) | Le tre direzioni affiancate, con riferimenti, che cosa cambia per chi studia e il rischio | sbordamento 0 |
| [`schermate/direzioni-375-intera.png`](schermate/direzioni-375-intera.png) | Le stesse, una sotto l'altra al telefono | sbordamento 0 |
| [`schermate/home-375.png`](schermate/home-375.png) | Home, primo schermo a 375×812: titolo, striscia di carta, i tre numeri della prova, «Simula il quiz base» | principale a 552 px |
| [`schermate/home-375x667.png`](schermate/home-375x667.png) | Home su un telefono piccolo: il pulsante resta sopra la barra | principale a 552 px su 603 utili |
| [`schermate/home-375-intera.png`](schermate/home-375-intera.png) | Home intera: le quattro righe con i numeri, «I limiti, detti prima» come nota di carta, la barra con le icone | sbordamento 0 |
| [`schermate/home-1280.png`](schermate/home-1280.png) | Home al computer: due colonne vere, la carta disegnata con il bordo a scala | principale a 553 px |
| [`schermate/home-1280-intera.png`](schermate/home-1280-intera.png) | Home intera al computer | sbordamento 0 |
| [`schermate/quiz-375-intera.png`](schermate/quiz-375-intera.png) | Allenati · Quiz: segmenti a pillola, l'unico riquadro con il reticolo, righe al posto dei pulsanti, il peso d'esame a pallini | principale a 458 px |
| [`schermate/quiz-1280.png`](schermate/quiz-1280.png) | Allenati al computer: i modi a sinistra, gli argomenti a destra | principale a 487 px |
| [`schermate/quiz-1280-intera.png`](schermate/quiz-1280-intera.png) | Allenati intera al computer | sbordamento 0 |
| [`schermate/runner-375.png`](schermate/runner-375.png) | La domanda dopo un errore: la rotta delle dieci tappe, «La tua risposta» e «Risposta del decreto», l'esito sopra «Avanti» | «Avanti» a 800 px su 812 |
| [`schermate/runner-375x667.png`](schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» resta nel primo schermo (D-29), la terza risposta scorre | «Avanti» nel primo schermo |
| [`schermate/runner-1280.png`](schermate/runner-1280.png) | La domanda al computer, in una colonna da 760 px | sbordamento 0 |
| [`schermate/riepilogo-375-intera.png`](schermate/riepilogo-375-intera.png) | Il riepilogo: il fatto come titolo, tre numeri grandi, la traccia, un pulsante e due link, l'invito in una nota | principale a 558 px |
| [`schermate/riepilogo-1280.png`](schermate/riepilogo-1280.png) | Il riepilogo al computer | principale a 639 px |

## Che cosa non è stato controllato

T-12 e T-13 misurano la pagina vera, non questi file; nessuna persona li ha
visti; Safari e il gesto vero; il tema scuro; gli stati con l'account, i
Segnali, il Carteggio e Progressi, che non hanno un mock.
