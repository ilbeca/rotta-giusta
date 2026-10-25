# Il ridisegno visivo — i mock di Claude, 24 ottobre 2026

La diagnosi, le tre direzioni, la raccomandazione e le decisioni per l'autore
stanno nella scheda **I-29** di
[`docs/idee-dopo-gli-account.md`](../../idee-dopo-gli-account.md). Qui ci sono i
mock di **tutte e tre le direzioni**, la tavola che le mette a confronto, e le
schermate: di oggi e dei mock.

**Aggiornati il 25 ottobre** con il parere di ChatGPT sulla A
(`docs/prototipi/redesign-2026-10-chatgpt/parere-su-A.md`, ramo `ui/main`): la
versione «ridotta» della A, le stesse correzioni nelle altre due, e due
schermate nuove per gli stati difficili. Che cosa è cambiato e perché, in I-29.

Sono **mock**: HTML statici, non il sito. Nessun file di `site/` è stato
toccato. Le tre direzioni hanno le stesse sei schermate con **gli stessi
testi**, perché si confronti il volto e non il contenuto. I dati sono quelli
veri della banca (1.722 quesiti, i pesi d'esame, il quesito 1.7.6-19), il resto
è un esempio senza account.

## I file

| File | Che cosa mostra |
|---|---|
| [`direzioni.html`](direzioni.html) | Le tre direzioni affiancate, con i link ai loro mock, e la raccomandazione in fondo |
| [`a-carta-nautica/`](a-carta-nautica/) | **A — La carta nautica**, nella versione ridotta: le sei schermate |
| [`b-plancia-di-notte/`](b-plancia-di-notte/) | **B — La plancia di notte**: le stesse sei schermate |
| [`c-quaderno-a-colori/`](c-quaderno-a-colori/) | **C — Il quaderno a colori**: le stesse sei schermate |
| [`a-carta-viva/`](a-carta-viva/) | **A — La carta che vive**: una copia della A spinta oltre con impeccable (overdrive), 25 ottobre. La A resta com'è |
| [`sorgenti/`](sorgenti/) | Da dove sono composti: le quattro pagine comuni, `comune.css`, un `tema.css` e un'illustrazione per direzione, le icone, `build.py`, e i due script di cattura |

Le sei schermate di ogni direzione: `home.html`, la Home senza risposte;
`quiz.html`, Allenati · Quiz; `preparazione.html`, l'allenamento breve con
l'avviso «senza account» accanto a «Inizia»; `runner.html`, la domanda 1.7.6-19
dopo una risposta sbagliata; `runner-figura.html`, la domanda più lunga con
figura (1.5.3-103, base-829) prima di rispondere, quinta di 25;
`riepilogo.html`, un allenamento breve concluso dopo 2 domande su 10. La figura
è la 79 del decreto, incorporata nel file.

Ogni HTML è **autoconsistente**: il carattere Manrope (licenza SIL OFL 1.1, il
testo in `site/caratteri/OFL.txt`) è incorporato in base64, stile e icone sono
nel file, nessuna risorsa da altri host. `sorgenti/misura-stati.mjs` misura la
figura prima di rispondere (come T-11) e l'avviso accanto a «Inizia» (come
T-12) in tutte e tre le direzioni. Si aprono con un doppio clic, e si
adattano da 375 a 1280 px.

Per rifarli dalle sorgenti, da questa cartella:

```bash
python3 sorgenti/build.py . ../../../site/caratteri/manrope-latin-wght-normal.woff2
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

## Le schermate dei mock

Prese con `sorgenti/cattura.mjs` dagli HTML di questa cartella, Chrome headless,
24 ottobre 2026; tutte guardate. Su ognuna lo script ha misurato: nessuno
sbordamento orizzontale, un solo `data-ruolo="principale"`, Manrope caricato;
«Simula il quiz base» finisce fra 551 e 552 px a 375×812 e resta sopra la barra
a 375×667 (603 px utili); «Avanti» resta nel primo schermo a 375×667. Nella
domanda con figura, a 375×812, la figura sta intera fra 323 e 534 px, la domanda
comincia a 124 e il centro della prima risposta è a 678; nella preparazione, a
375×667, l'avviso finisce 12 px sopra «Inizia» e niente da toccare sta in mezzo.

| Schermata | Che cosa mostra |
|---|---|
| [`schermate/direzioni-1280-intera.png`](schermate/direzioni-1280-intera.png) | Le tre direzioni affiancate, con riferimenti, che cosa cambia per chi studia, il rischio, e la raccomandazione dopo |
| [`schermate/direzioni-375-intera.png`](schermate/direzioni-375-intera.png) | Le stesse, una sotto l'altra al telefono |

### A — La carta nautica, ridotta: fondo caldo, la carta disegnata con il bordo a scala, il magenta solo nel disegno

| Schermata | Che cosa mostra |
|---|---|
| [`a-carta-nautica/schermate/home-375.png`](a-carta-nautica/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`a-carta-nautica/schermate/home-375x667.png`](a-carta-nautica/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`a-carta-nautica/schermate/home-375-intera.png`](a-carta-nautica/schermate/home-375-intera.png) | Home intera al telefono |
| [`a-carta-nautica/schermate/home-1280.png`](a-carta-nautica/schermate/home-1280.png) | Home al computer, primo schermo |
| [`a-carta-nautica/schermate/home-1280-intera.png`](a-carta-nautica/schermate/home-1280-intera.png) | Home intera al computer |
| [`a-carta-nautica/schermate/quiz-375-intera.png`](a-carta-nautica/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`a-carta-nautica/schermate/quiz-1280.png`](a-carta-nautica/schermate/quiz-1280.png) | Allenati · Quiz al computer, primo schermo |
| [`a-carta-nautica/schermate/quiz-1280-intera.png`](a-carta-nautica/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`a-carta-nautica/schermate/preparazione-375x667.png`](a-carta-nautica/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso accanto a «Inizia», sopra la barra |
| [`a-carta-nautica/schermate/preparazione-1280.png`](a-carta-nautica/schermate/preparazione-1280.png) | La preparazione al computer |
| [`a-carta-nautica/schermate/runner-375.png`](a-carta-nautica/schermate/runner-375.png) | La domanda dopo un errore, a 375×812: la prima tappa resta la corrente finché non premi «Avanti» |
| [`a-carta-nautica/schermate/runner-375x667.png`](a-carta-nautica/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`a-carta-nautica/schermate/runner-1280.png`](a-carta-nautica/schermate/runner-1280.png) | La domanda al computer |
| [`a-carta-nautica/schermate/runner-figura-375.png`](a-carta-nautica/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo; la traccia compatta «5 di 25» |
| [`a-carta-nautica/schermate/runner-figura-1280.png`](a-carta-nautica/schermate/runner-figura-1280.png) | La stessa al computer |
| [`a-carta-nautica/schermate/riepilogo-375-intera.png`](a-carta-nautica/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`a-carta-nautica/schermate/riepilogo-1280.png`](a-carta-nautica/schermate/riepilogo-1280.png) | Il riepilogo al computer |

### B — La plancia di notte: fondo navy scurissimo, azione ambra, segno ciano, la fila di luci

| Schermata | Che cosa mostra |
|---|---|
| [`b-plancia-di-notte/schermate/home-375.png`](b-plancia-di-notte/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`b-plancia-di-notte/schermate/home-375x667.png`](b-plancia-di-notte/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`b-plancia-di-notte/schermate/home-375-intera.png`](b-plancia-di-notte/schermate/home-375-intera.png) | Home intera al telefono |
| [`b-plancia-di-notte/schermate/home-1280.png`](b-plancia-di-notte/schermate/home-1280.png) | Home al computer, primo schermo |
| [`b-plancia-di-notte/schermate/home-1280-intera.png`](b-plancia-di-notte/schermate/home-1280-intera.png) | Home intera al computer |
| [`b-plancia-di-notte/schermate/quiz-375-intera.png`](b-plancia-di-notte/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`b-plancia-di-notte/schermate/quiz-1280.png`](b-plancia-di-notte/schermate/quiz-1280.png) | Allenati · Quiz al computer, primo schermo |
| [`b-plancia-di-notte/schermate/quiz-1280-intera.png`](b-plancia-di-notte/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`b-plancia-di-notte/schermate/preparazione-375x667.png`](b-plancia-di-notte/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso accanto a «Inizia», sopra la barra |
| [`b-plancia-di-notte/schermate/preparazione-1280.png`](b-plancia-di-notte/schermate/preparazione-1280.png) | La preparazione al computer |
| [`b-plancia-di-notte/schermate/runner-375.png`](b-plancia-di-notte/schermate/runner-375.png) | La domanda dopo un errore, a 375×812: la prima tappa resta la corrente finché non premi «Avanti» |
| [`b-plancia-di-notte/schermate/runner-375x667.png`](b-plancia-di-notte/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`b-plancia-di-notte/schermate/runner-1280.png`](b-plancia-di-notte/schermate/runner-1280.png) | La domanda al computer |
| [`b-plancia-di-notte/schermate/runner-figura-375.png`](b-plancia-di-notte/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo; la traccia compatta «5 di 25» |
| [`b-plancia-di-notte/schermate/runner-figura-1280.png`](b-plancia-di-notte/schermate/runner-figura-1280.png) | La stessa al computer |
| [`b-plancia-di-notte/schermate/riepilogo-375-intera.png`](b-plancia-di-notte/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`b-plancia-di-notte/schermate/riepilogo-1280.png`](b-plancia-di-notte/schermate/riepilogo-1280.png) | Il riepilogo al computer |

### C — Il quaderno a colori: bianco, blu saturo con il sole, tessere colorate, la barra a segmenti

| Schermata | Che cosa mostra |
|---|---|
| [`c-quaderno-a-colori/schermate/home-375.png`](c-quaderno-a-colori/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`c-quaderno-a-colori/schermate/home-375x667.png`](c-quaderno-a-colori/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`c-quaderno-a-colori/schermate/home-375-intera.png`](c-quaderno-a-colori/schermate/home-375-intera.png) | Home intera al telefono |
| [`c-quaderno-a-colori/schermate/home-1280.png`](c-quaderno-a-colori/schermate/home-1280.png) | Home al computer, primo schermo |
| [`c-quaderno-a-colori/schermate/home-1280-intera.png`](c-quaderno-a-colori/schermate/home-1280-intera.png) | Home intera al computer |
| [`c-quaderno-a-colori/schermate/quiz-375-intera.png`](c-quaderno-a-colori/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`c-quaderno-a-colori/schermate/quiz-1280.png`](c-quaderno-a-colori/schermate/quiz-1280.png) | Allenati · Quiz al computer, primo schermo |
| [`c-quaderno-a-colori/schermate/quiz-1280-intera.png`](c-quaderno-a-colori/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`c-quaderno-a-colori/schermate/preparazione-375x667.png`](c-quaderno-a-colori/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso accanto a «Inizia», sopra la barra |
| [`c-quaderno-a-colori/schermate/preparazione-1280.png`](c-quaderno-a-colori/schermate/preparazione-1280.png) | La preparazione al computer |
| [`c-quaderno-a-colori/schermate/runner-375.png`](c-quaderno-a-colori/schermate/runner-375.png) | La domanda dopo un errore, a 375×812: la prima tappa resta la corrente finché non premi «Avanti» |
| [`c-quaderno-a-colori/schermate/runner-375x667.png`](c-quaderno-a-colori/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`c-quaderno-a-colori/schermate/runner-1280.png`](c-quaderno-a-colori/schermate/runner-1280.png) | La domanda al computer |
| [`c-quaderno-a-colori/schermate/runner-figura-375.png`](c-quaderno-a-colori/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo; la traccia compatta «5 di 25» |
| [`c-quaderno-a-colori/schermate/runner-figura-1280.png`](c-quaderno-a-colori/schermate/runner-figura-1280.png) | La stessa al computer |
| [`c-quaderno-a-colori/schermate/riepilogo-375-intera.png`](c-quaderno-a-colori/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`c-quaderno-a-colori/schermate/riepilogo-1280.png`](c-quaderno-a-colori/schermate/riepilogo-1280.png) | Il riepilogo al computer |

## La carta che vive — `a-carta-viva/`

Una **copia** della A, fatta il 25 ottobre con impeccable in modalità
«overdrive»: la A di `a-carta-nautica/` non è cambiata di un byte. Due momenti, e
solo due, scelti dall'autore:

- **La carta che vive**, nella Home. Il faro lampeggia con il suo ritmo vero,
  Lam.(2) 10s, due lampi e poi buio ogni 10 secondi; la boa cardinale est fa i
  suoi tre lampi scintillanti, Sc.(3) 10s. Toccando una luce compare che cosa
  vuol dire la sigla. La rotta si disegna all'apertura; al telefono la carta da
  toccare è una sezione sua, «Una luce, una sigla», e lì la rotta si disegna
  mentre entra in vista. La rosa dei venti proposta in rotazione **non** ruota:
  su una carta il nord non si muove, e il disegno insegnerebbe il falso.
- **La rotta come filo**, fra le schermate. «Simula il quiz base» e gli altri
  avvii si trasformano nella testata della domanda, e la testata nel riquadro
  del riepilogo (View Transitions fra documenti). La domanda si gioca: tre
  domande vere della banca, i tasti 1-2-3 e Invio, l'anello che scivola alla
  tappa dopo solo con «Avanti»; il riepilogo legge che cosa hai fatto e fa
  salire i numeri. Chi chiede meno movimento vede tutto fermo.

Il resto è la A ridotta con i ritocchi della critica di impeccable: niente
occhielli sopra i titoli, la nota senza la striscia laterale, le superfici del
browser disegnate (selezione, fuoco, barra di scorrimento, cursore).

**Per vedere le transizioni** la cartella va servita in http — aperta con un
doppio clic, il browser non le fa:

```bash
python3 -m http.server 8799 --directory docs/prototipi/redesign-2026-10-claude
```

e poi `http://localhost:8799/a-carta-viva/home.html`. Provato in Chrome: Home →
domanda → riepilogo con la transizione, a 375 e a 1280 px; su Firefox si passa
senza animazione.

**Da verificare dall'autore**, perché è contenuto didattico: le sigle all'italiana
(«Lam.», «Sc.», come nella figura 79 del decreto) e le due frasi che le spiegano.

Il rilevatore di impeccable sulla copia: spariti gli occhielli (4) e la
pastiglia sopra il titolo; restano il fondo crema e la cornice a scala, che sono
la direzione scelta, i bordi «a filo» della carta disegnata, voluti, e una
striscia laterale letta sul CSS comune ma annullata nella pagina. Le molle con
il rimbalzo, che il rilevatore aveva segnalato nella domanda, sono state tolte.

| Schermata | Che cosa mostra |
|---|---|
| [`a-carta-viva/schermate/home-375.png`](a-carta-viva/schermate/home-375.png) | Home al telefono: la striscia di carta con il faro che lampeggia, nessun occhiello sopra il titolo |
| [`a-carta-viva/schermate/home-375-intera.png`](a-carta-viva/schermate/home-375-intera.png) | Home intera al telefono, con la sezione «Una luce, una sigla»: la carta da toccare |
| [`a-carta-viva/schermate/home-1280.png`](a-carta-viva/schermate/home-1280.png) | Home al computer, a rotta già disegnata |
| [`a-carta-viva/schermate/home-lampo-1280.png`](a-carta-viva/schermate/home-lampo-1280.png) | Home al computer a 1,7 s dall'apertura: il secondo lampo del faro, Lam.(2) 10s, e la rotta che si sta disegnando |
| [`a-carta-viva/schermate/home-luce-1280.png`](a-carta-viva/schermate/home-luce-1280.png) | La boa toccata: sotto la carta la sigla spiegata |
| [`a-carta-viva/schermate/home-1280-intera.png`](a-carta-viva/schermate/home-1280-intera.png) | Home intera al computer |
| [`a-carta-viva/schermate/quiz-375.png`](a-carta-viva/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`a-carta-viva/schermate/quiz-375-intera.png`](a-carta-viva/schermate/quiz-375-intera.png) | Allenati · Quiz intera |
| [`a-carta-viva/schermate/quiz-1280.png`](a-carta-viva/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`a-carta-viva/schermate/quiz-1280-intera.png`](a-carta-viva/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`a-carta-viva/schermate/preparazione-375.png`](a-carta-viva/schermate/preparazione-375.png) | La preparazione al telefono |
| [`a-carta-viva/schermate/preparazione-1280.png`](a-carta-viva/schermate/preparazione-1280.png) | La preparazione al computer |
| [`a-carta-viva/schermate/runner-375.png`](a-carta-viva/schermate/runner-375.png) | La domanda prima di rispondere: si gioca davvero, tre domande vere della banca |
| [`a-carta-viva/schermate/runner-dopo-375.png`](a-carta-viva/schermate/runner-dopo-375.png) | Dopo una risposta sbagliata: l'anello resta sulla prima tappa |
| [`a-carta-viva/schermate/runner-seconda-375.png`](a-carta-viva/schermate/runner-seconda-375.png) | Dopo «Avanti»: l'anello è scivolato alla seconda tappa, la prima è verde |
| [`a-carta-viva/schermate/runner-1280.png`](a-carta-viva/schermate/runner-1280.png) | La domanda al computer |
| [`a-carta-viva/schermate/runner-dopo-1280.png`](a-carta-viva/schermate/runner-dopo-1280.png) | Dopo la risposta, al computer |
| [`a-carta-viva/schermate/runner-figura-375.png`](a-carta-viva/schermate/runner-figura-375.png) | La domanda lunga con figura |
| [`a-carta-viva/schermate/runner-figura-1280.png`](a-carta-viva/schermate/runner-figura-1280.png) | La stessa al computer |
| [`a-carta-viva/schermate/riepilogo-375.png`](a-carta-viva/schermate/riepilogo-375.png) | Il riepilogo di tre domande giocate: i numeri salgono contando |
| [`a-carta-viva/schermate/riepilogo-375-intera.png`](a-carta-viva/schermate/riepilogo-375-intera.png) | Il riepilogo intero |
| [`a-carta-viva/schermate/riepilogo-1280.png`](a-carta-viva/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`a-carta-viva/schermate/riepilogo-1280-intera.png`](a-carta-viva/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

## Che cosa non è stato controllato

T-12 e T-13 misurano la pagina vera, non questi file; nessuna persona li ha
visti; Safari e il gesto vero; gli stati con l'account, i Segnali, il Carteggio,
Esame, Progressi, la revisione e il salvataggio fallito, che non hanno un mock in
nessuna direzione; la domanda dopo lo scorrimento a 375×667.
