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
| [`a-carta-viva/`](a-carta-viva/) | **A — La carta che vive, release candidate**: una copia della A spinta oltre con impeccable (overdrive), 25 ottobre. La A resta com'è |
| [`d-segnalamento/`](d-segnalamento/) | **D — Il segnalamento**, 25 ottobre: le boe cardinali, nero e giallo. Uno dei quattro stili provati accanto alla RC |
| [`e-bandiere/`](e-bandiere/) | **E — Le bandiere**: il Codice internazionale dei segnali, blu bandiera e colori piatti |
| [`f-manuale-a-schede/`](f-manuale-a-schede/) | **F — Il manuale a schede**: il libro della scuola nautica, una linguetta colorata per tema |
| [`g-regata/`](g-regata/) | **G — La regata**: i colori del mare aperto e delle boe arancio, con la carta che vive della RC nella Home |
| [`h-frase-e-faro/`](h-frase-e-faro/) | **H — La frase e il faro**, 25 ottobre: bianco e nero, un colore solo; il faro lampeggia dentro il titolo. Una delle quattro direzioni nate con le skill taste e ui-ux-pro-max |
| [`i-giornale-di-bordo/`](i-giornale-di-bordo/) | **I — Il giornale di bordo**: il registro di bordo, fogli verde pallido, inchiostro blu, il margine rosso; una riga del giornale da toccare |
| [`j-tessere/`](j-tessere/) | **J — Le tessere**: la Home a tessere di misure diverse, una tessera scura dove il faro lampeggia di notte |
| [`k-due-colori/`](k-due-colori/) | **K — La stampa a due colori**: blu e arancio fluorescente come un manifesto stampato con due lastre, il secondo colore un poco fuori registro |
| [`l-percorso-a-boe/`](l-percorso-a-boe/) | **L — Il percorso a boe**, 25 ottobre: la Home è una rotta che scende di boa in boa; gli argomenti sono zone di mare grandi quanto pesano. Il primo dei quattro impianti diversi, tutti nei colori della Regata |
| [`m-carta-e-pannello/`](m-carta-e-pannello/) | **M — La carta e il pannello**: la carta ferma dietro, il contenuto in un pannello che sale dal basso o sta di lato, come un'app di navigazione |
| [`n-una-cosa-per-schermo/`](n-una-cosa-per-schermo/) | **N — Una cosa per schermo**: schermate intere da scorrere, carte da sfogliare, risposte a tutta larghezza e la correzione che sale come un foglio |
| [`o-banco-a-due-colonne/`](o-banco-a-due-colonne/) | **O — Il banco a due colonne**: a sinistra, ferma, la cosa su cui lavori; a destra il resto |
| [`p-rotta-che-si-accende/`](p-rotta-che-si-accende/) | **P — La rotta che si accende**, 25 ottobre: la Home della Regata con il percorso a boe animato; scorrendo, la linea si riempie, la barca scende e ogni tappa spiega come funziona il sito |
| [`q-regata-sulla-carta/`](q-regata-sulla-carta/) | **Q — La Regata sulla carta**: la carta nautica ferma dietro la pagina, vista da finestre; nessun pannello |
| [`sorgenti/`](sorgenti/) | Da dove sono composti: le quattro pagine comuni, `comune.css`, un `tema.css` e un'illustrazione per direzione, le icone, `build.py`, e i due script di cattura; in `stili/` le sorgenti, il costruttore e lo script di cattura dei quattro stili del 25 ottobre |

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

> **Release candidate, dal 25 ottobre 2026.** Così l'ha chiamata l'autore: la
> versione di riferimento del ridisegno. I file di `a-carta-viva/` e le sue
> sorgenti (`sorgenti/a2/`) non si toccano; gli altri stili si provano in
> cartelle nuove, accanto.

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

## Gli altri stili — 25 ottobre 2026

Chiesti dall'autore il 25 ottobre: altri vestiti per lo stesso sito, accanto
alla release candidate, che non è stata toccata. Quattro stili, scelti fra le
proposte della sessione: **D — Il segnalamento**, **E — Le bandiere**, **F — Il
manuale a schede**, **G — La regata**. Il confronto con la RC, che cosa cambia
per chi studia e i rischi stanno nella scheda I-29, in fondo.

Ogni stile ha **le stesse sei schermate e gli stessi testi della RC**: le cinque
pagine dopo la Home sono una copia di quelle della RC (`sorgenti/stili/base/`),
e la Home cambia soltanto il disegno da toccare, il suo titolo e le sue voci.
Ognuno ha il suo oggetto che insegna, come le luci della RC: le boe cardinali
(D), cinque bandiere, fra cui la Alfa e quella del subacqueo, che sono nella
banca (E), il peso di ogni tema all'esame (F), le andature rispetto al vento
(G). In F la Home ha in più, nel riquadro della prova, una barra con le 20
domande divise per tema, senza testo visibile (la dice l'etichetta per i
lettori di schermo). Il filo fra le schermate della RC (View Transitions) c'è
anche qui.

**Da verificare dall'autore**, perché è contenuto didattico: i testi delle
quattro cardinali (D), dei significati delle bandiere (E) e delle andature (G),
e i ritmi delle luci in D (Sc. continua, Sc.(3) 10s, Sc.(6) e un lampo lungo
15s, Sc.(9) 15s) scritti in parole dove la sigla italiana non è sicura.

Per rifarli, da questa cartella (scrive soltanto le quattro cartelle nuove; le
direzioni A, B, C e la RC le scrive `sorgenti/build.py`, che qui non si chiama):

```bash
python3 sorgenti/stili/build.py . ../../../site/caratteri/manrope-latin-wght-normal.woff2
node sorgenti/stili/cattura-stili.mjs "$PWD"
```

**Misurato** da `sorgenti/stili/cattura-stili.mjs` su tutte le 72 combinazioni
(quattro stili, sei schermate, 375×812, 375×667 e 1280×800): nessuno
sbordamento orizzontale, un solo `data-ruolo="principale"` visibile, Manrope
caricato. Nella Home a 375×667 «Simula il quiz base» finisce fra 594 e 596 px,
sopra la barra (600–602): al primo giro finiva fra 629 e 664, sotto la barra,
e le strisce e i numeri al telefono sono stati ridotti. «Avanti» dopo un errore
a 375×667 sta fra 599 e 655 px, e il suo centro è suo (`elementFromPoint`). La
figura della domanda lunga sta intera fra 323 e 534 px a 375×812 (326–537 in
F), con la domanda da 124 e il centro della prima risposta a 678. L'avviso della
preparazione finisce 12 px sopra «Inizia», sopra la barra. Contrasti calcolati
sui colori dei temi: testo secondario da 6,0 a 6,9:1 sul bianco, testo sui
pulsanti pieni da 8,9 a 16,9:1, bianco sulle otto linguette di F da 5,5 a
8,8:1, verde e rosso degli esiti sui loro fondi da 5,5 a 5,9:1. Il rilevatore di
impeccable non trova niente da correggere: le strisce ripetute e il bordo
laterale che segnala sono nel CSS comune della A, non usati qui; i «bordi a
filo» sono i disegni che riempiono la loro cornice. Tutte le schermate sono
state guardate.

**Non controllato:** nessuna persona li ha visti; Safari e il gesto vero; le
transizioni sono state guardate solo nelle schermate, non in movimento; al
telefono in F le scritte del sommario dentro il disegno sono troppo piccole per
leggerle (le dice la legenda, toccando).

### D — Il segnalamento: fondo bianco, nero pieno, il giallo segnale nelle fasce; la secca con le quattro boe cardinali che lampeggiano con i loro ritmi

| Schermata | Che cosa mostra |
|---|---|
| [`d-segnalamento/schermate/home-375.png`](d-segnalamento/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`d-segnalamento/schermate/home-375x667.png`](d-segnalamento/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`d-segnalamento/schermate/home-375-intera.png`](d-segnalamento/schermate/home-375-intera.png) | Home intera al telefono, con il disegno da toccare |
| [`d-segnalamento/schermate/home-1280.png`](d-segnalamento/schermate/home-1280.png) | Home al computer, primo schermo |
| [`d-segnalamento/schermate/home-tocca-1280.png`](d-segnalamento/schermate/home-tocca-1280.png) | Home al computer con il primo elemento del disegno toccato: sotto, che cosa vuol dire |
| [`d-segnalamento/schermate/home-1280-intera.png`](d-segnalamento/schermate/home-1280-intera.png) | Home intera al computer |
| [`d-segnalamento/schermate/quiz-375.png`](d-segnalamento/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`d-segnalamento/schermate/quiz-375x667.png`](d-segnalamento/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`d-segnalamento/schermate/quiz-375-intera.png`](d-segnalamento/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`d-segnalamento/schermate/quiz-1280.png`](d-segnalamento/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`d-segnalamento/schermate/quiz-1280-intera.png`](d-segnalamento/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`d-segnalamento/schermate/preparazione-375.png`](d-segnalamento/schermate/preparazione-375.png) | La preparazione al telefono |
| [`d-segnalamento/schermate/preparazione-375x667.png`](d-segnalamento/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`d-segnalamento/schermate/preparazione-1280.png`](d-segnalamento/schermate/preparazione-1280.png) | La preparazione al computer |
| [`d-segnalamento/schermate/runner-375.png`](d-segnalamento/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`d-segnalamento/schermate/runner-375x667.png`](d-segnalamento/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`d-segnalamento/schermate/runner-1280.png`](d-segnalamento/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`d-segnalamento/schermate/runner-figura-375.png`](d-segnalamento/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo |
| [`d-segnalamento/schermate/runner-figura-375x667.png`](d-segnalamento/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`d-segnalamento/schermate/runner-figura-1280.png`](d-segnalamento/schermate/runner-figura-1280.png) | La stessa al computer |
| [`d-segnalamento/schermate/riepilogo-375.png`](d-segnalamento/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`d-segnalamento/schermate/riepilogo-375x667.png`](d-segnalamento/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`d-segnalamento/schermate/riepilogo-375-intera.png`](d-segnalamento/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`d-segnalamento/schermate/riepilogo-1280.png`](d-segnalamento/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`d-segnalamento/schermate/riepilogo-1280-intera.png`](d-segnalamento/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

### E — Le bandiere: bianco, blu bandiera, angoli vivi; la drizza con cinque bandiere che si alzano e si leggono toccandole

| Schermata | Che cosa mostra |
|---|---|
| [`e-bandiere/schermate/home-375.png`](e-bandiere/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`e-bandiere/schermate/home-375x667.png`](e-bandiere/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`e-bandiere/schermate/home-375-intera.png`](e-bandiere/schermate/home-375-intera.png) | Home intera al telefono, con il disegno da toccare |
| [`e-bandiere/schermate/home-1280.png`](e-bandiere/schermate/home-1280.png) | Home al computer, primo schermo |
| [`e-bandiere/schermate/home-tocca-1280.png`](e-bandiere/schermate/home-tocca-1280.png) | Home al computer con il primo elemento del disegno toccato: sotto, che cosa vuol dire |
| [`e-bandiere/schermate/home-1280-intera.png`](e-bandiere/schermate/home-1280-intera.png) | Home intera al computer |
| [`e-bandiere/schermate/quiz-375.png`](e-bandiere/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`e-bandiere/schermate/quiz-375x667.png`](e-bandiere/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`e-bandiere/schermate/quiz-375-intera.png`](e-bandiere/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`e-bandiere/schermate/quiz-1280.png`](e-bandiere/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`e-bandiere/schermate/quiz-1280-intera.png`](e-bandiere/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`e-bandiere/schermate/preparazione-375.png`](e-bandiere/schermate/preparazione-375.png) | La preparazione al telefono |
| [`e-bandiere/schermate/preparazione-375x667.png`](e-bandiere/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`e-bandiere/schermate/preparazione-1280.png`](e-bandiere/schermate/preparazione-1280.png) | La preparazione al computer |
| [`e-bandiere/schermate/runner-375.png`](e-bandiere/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`e-bandiere/schermate/runner-375x667.png`](e-bandiere/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`e-bandiere/schermate/runner-1280.png`](e-bandiere/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`e-bandiere/schermate/runner-figura-375.png`](e-bandiere/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo |
| [`e-bandiere/schermate/runner-figura-375x667.png`](e-bandiere/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`e-bandiere/schermate/runner-figura-1280.png`](e-bandiere/schermate/runner-figura-1280.png) | La stessa al computer |
| [`e-bandiere/schermate/riepilogo-375.png`](e-bandiere/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`e-bandiere/schermate/riepilogo-375x667.png`](e-bandiere/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`e-bandiere/schermate/riepilogo-375-intera.png`](e-bandiere/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`e-bandiere/schermate/riepilogo-1280.png`](e-bandiere/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`e-bandiere/schermate/riepilogo-1280-intera.png`](e-bandiere/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

### F — Il manuale a schede: pagina bianca, inchiostro quasi nero, otto colori di capitolo; il sommario con le linguette lunghe quanto pesa il tema

| Schermata | Che cosa mostra |
|---|---|
| [`f-manuale-a-schede/schermate/home-375.png`](f-manuale-a-schede/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`f-manuale-a-schede/schermate/home-375x667.png`](f-manuale-a-schede/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`f-manuale-a-schede/schermate/home-375-intera.png`](f-manuale-a-schede/schermate/home-375-intera.png) | Home intera al telefono, con il disegno da toccare |
| [`f-manuale-a-schede/schermate/home-1280.png`](f-manuale-a-schede/schermate/home-1280.png) | Home al computer, primo schermo |
| [`f-manuale-a-schede/schermate/home-tocca-1280.png`](f-manuale-a-schede/schermate/home-tocca-1280.png) | Home al computer con il primo elemento del disegno toccato: sotto, che cosa vuol dire |
| [`f-manuale-a-schede/schermate/home-1280-intera.png`](f-manuale-a-schede/schermate/home-1280-intera.png) | Home intera al computer |
| [`f-manuale-a-schede/schermate/quiz-375.png`](f-manuale-a-schede/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`f-manuale-a-schede/schermate/quiz-375x667.png`](f-manuale-a-schede/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`f-manuale-a-schede/schermate/quiz-375-intera.png`](f-manuale-a-schede/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`f-manuale-a-schede/schermate/quiz-1280.png`](f-manuale-a-schede/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`f-manuale-a-schede/schermate/quiz-1280-intera.png`](f-manuale-a-schede/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`f-manuale-a-schede/schermate/preparazione-375.png`](f-manuale-a-schede/schermate/preparazione-375.png) | La preparazione al telefono |
| [`f-manuale-a-schede/schermate/preparazione-375x667.png`](f-manuale-a-schede/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`f-manuale-a-schede/schermate/preparazione-1280.png`](f-manuale-a-schede/schermate/preparazione-1280.png) | La preparazione al computer |
| [`f-manuale-a-schede/schermate/runner-375.png`](f-manuale-a-schede/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`f-manuale-a-schede/schermate/runner-375x667.png`](f-manuale-a-schede/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`f-manuale-a-schede/schermate/runner-1280.png`](f-manuale-a-schede/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`f-manuale-a-schede/schermate/runner-figura-375.png`](f-manuale-a-schede/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo |
| [`f-manuale-a-schede/schermate/runner-figura-375x667.png`](f-manuale-a-schede/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`f-manuale-a-schede/schermate/runner-figura-1280.png`](f-manuale-a-schede/schermate/runner-figura-1280.png) | La stessa al computer |
| [`f-manuale-a-schede/schermate/riepilogo-375.png`](f-manuale-a-schede/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`f-manuale-a-schede/schermate/riepilogo-375x667.png`](f-manuale-a-schede/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`f-manuale-a-schede/schermate/riepilogo-375-intera.png`](f-manuale-a-schede/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`f-manuale-a-schede/schermate/riepilogo-1280.png`](f-manuale-a-schede/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`f-manuale-a-schede/schermate/riepilogo-1280-intera.png`](f-manuale-a-schede/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

### G — La regata: bianco e blu mare, l'arancio delle boe; il mare a tutta larghezza, la carta della RC da toccare, le tappe come boe

Dal 25 ottobre, su richiesta dell'autore («i colori della regata, l'animazione
della release candidate»), la Home della G ha il disegno della RC — faro con
Lam.(2) 10s, boa cardinale est con Sc.(3) 10s, rotta che si disegna — ridipinto
nei colori della G: mare `#0A4F6E`, terra bianca, rotta e settore del faro
nell'arancio e nel bianco caldo, la boa con il suo nero e giallo e un bordo
bianco per staccarla dal mare scuro. Le quattro andature sono uscite. Le
schermate qui sotto sono quelle nuove; le altre pagine non cambiano.

| Schermata | Che cosa mostra |
|---|---|
| [`g-regata/schermate/home-375.png`](g-regata/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`g-regata/schermate/home-375x667.png`](g-regata/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`g-regata/schermate/home-375-intera.png`](g-regata/schermate/home-375-intera.png) | Home intera al telefono, con il disegno da toccare |
| [`g-regata/schermate/home-1280.png`](g-regata/schermate/home-1280.png) | Home al computer, primo schermo |
| [`g-regata/schermate/home-tocca-1280.png`](g-regata/schermate/home-tocca-1280.png) | Home al computer con il primo elemento del disegno toccato: sotto, che cosa vuol dire |
| [`g-regata/schermate/home-1280-intera.png`](g-regata/schermate/home-1280-intera.png) | Home intera al computer |
| [`g-regata/schermate/quiz-375.png`](g-regata/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`g-regata/schermate/quiz-375x667.png`](g-regata/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`g-regata/schermate/quiz-375-intera.png`](g-regata/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`g-regata/schermate/quiz-1280.png`](g-regata/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`g-regata/schermate/quiz-1280-intera.png`](g-regata/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`g-regata/schermate/preparazione-375.png`](g-regata/schermate/preparazione-375.png) | La preparazione al telefono |
| [`g-regata/schermate/preparazione-375x667.png`](g-regata/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`g-regata/schermate/preparazione-1280.png`](g-regata/schermate/preparazione-1280.png) | La preparazione al computer |
| [`g-regata/schermate/runner-375.png`](g-regata/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`g-regata/schermate/runner-375x667.png`](g-regata/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`g-regata/schermate/runner-1280.png`](g-regata/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`g-regata/schermate/runner-figura-375.png`](g-regata/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo |
| [`g-regata/schermate/runner-figura-375x667.png`](g-regata/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`g-regata/schermate/runner-figura-1280.png`](g-regata/schermate/runner-figura-1280.png) | La stessa al computer |
| [`g-regata/schermate/riepilogo-375.png`](g-regata/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`g-regata/schermate/riepilogo-375x667.png`](g-regata/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`g-regata/schermate/riepilogo-375-intera.png`](g-regata/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`g-regata/schermate/riepilogo-1280.png`](g-regata/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`g-regata/schermate/riepilogo-1280-intera.png`](g-regata/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

## Le direzioni nate con taste e ui-ux-pro-max — 25 ottobre 2026

Chieste dalla regia il 25 ottobre: altre direzioni accanto alla release
candidate e alla Regata, che restano il metro di confronto e non sono state
toccate. Questa volta le proposte non vengono dall'istinto della sessione ma da
due skill. **taste** (design-taste-frontend) ha «dato le carte»: tre modi di
comporre su venti, estratti dal suo script per un sito di studio — «la frase è
la pagina», «solo tipografia», «la pagina è l'oggetto del suo mondo».
**ui-ux-pro-max** ha cercato nel suo archivio di stili: il minimalismo
esagerato, la griglia editoriale, le tessere («bento»). Il suo primo
suggerimento per «app di studio per esami» era la «claymorphism» viola con
caratteri di Google: scartato, perché il viola è il colore di default dei
modelli e qui si usa soltanto Manrope, servito dal sito.

L'autore ha scelto tutte e tre le proposte e ha chiesto una sorpresa. Quattro
direzioni, con le stesse sei schermate e gli stessi testi degli altri stili:

- **H — La frase e il faro** (`h-frase-e-faro/`): bianco, nero pieno, l'arancio
  della luce. Il titolo è la composizione, e al posto di una parola c'è una
  finestrella dove il faro lampeggia con la sua sigla vera, Lam.(2) 10s;
  toccandola si legge che cosa vuol dire. Angoli vivi, risposte a bordo nero,
  domanda a 22 px al telefono e 30 al computer, tappe quadrate.
- **I — Il giornale di bordo** (`i-giornale-di-bordo/`): fogli verde pallido da
  registro, inchiostro blu-nero, il filo rosso del margine come segno. I numeri
  stanno in colonna sotto la loro intestazione; le tappe della domanda sono
  tacche contate a mano; il riepilogo ha il timbro del giorno. Nella Home si
  tocca una riga del giornale: Ora, Pb, Pv, V, Miglia.
- **J — Le tessere** (`j-tessere/`): fondo grigio-azzurro, tessere bianche di
  misure diverse, una tessera scura dove il faro e la boa della RC lampeggiano
  di notte; il verde petrolio per l'unico pulsante. In Allenati gli argomenti
  sono tessere, e le due che valgono 4 domande sono larghe il doppio e scure.
  La domanda ha una barra a dieci tratti.
- **K — La stampa a due colori** (`k-due-colori/`), la sorpresa: il blu e
  l'arancio fluorescente dei manifesti stampati con due lastre. Tutto è blu;
  l'arancio è un retino nel disegno, un fondo chiaro nel riquadro che conta e
  un registro sfalsato di 3 px sotto i titoli e i numeri grandi. Il disegno è un
  piccolo manifesto: il sole, il mare, un faro a strisce che lampeggia, la boa
  cardinale est nei suoi colori veri.

**Da verificare dall'autore**, perché è contenuto didattico: le cinque voci del
giornale di bordo in I (soprattutto «Pv · prora vera: la prora bussola
corretta di deviazione e declinazione»). H, J e K usano le sigle e le frasi
della RC, le stesse da verificare.

Per rifarle, da questa cartella (scrive soltanto le quattro cartelle nuove):

```bash
python3 sorgenti/stili/build.py . ../../../site/caratteri/manrope-latin-wght-normal.woff2 h i j k
node sorgenti/stili/cattura-stili.mjs "$PWD" h-frase-e-faro i-giornale-di-bordo j-tessere k-due-colori
```

H e J hanno una Home loro (`sorgenti/stili/h/home.html`, `sorgenti/stili/j/home.html`),
copiata da quella comune e cambiata; I e K usano quella comune.

**Misurato** da `cattura-stili.mjs` su tutte le 72 combinazioni: nessuno
sbordamento orizzontale, un solo `data-ruolo="principale"` visibile, Manrope
caricato. Nella Home a 375×667 «Simula il quiz base» finisce a 527 (H), 579
(I), 541 (J) e 593 px (K), sopra la barra (600–603); in I al primo giro finiva a
611, sotto la barra, e la striscia del telefono e l'intestazione del riquadro
sono state accorciate. «Avanti» dopo un errore a 375×667 sta fra 599 e 655 px e
il suo centro è suo. La figura della domanda lunga sta intera prima di
rispondere: 357–568 px in H (la domanda è più grande), 321–536 negli altri, con
il centro della prima risposta fra 676 e 714 su 812. L'avviso della
preparazione finisce 12 px sopra «Inizia», sopra la barra. **Contrasti**: un
controllo a parte, non nel repo, ha letto i colori calcolati di ogni testo
visibile fuori dai disegni nelle 6 schermate a 375 e 1280 px di ogni
direzione: nessuno sotto 4,5:1 (3:1 per il testo grande). Non legge il testo
dentro i disegni SVG.

**Trovato guardando, e corretto:** in H la finestrella del faro era minuscola,
perché un pulsante non eredita il corpo del titolo; in I la penna non aveva
finito di scrivere quando si fotografava, e sotto i numeri del riepilogo
compariva una lineetta; in J la fila delle tessere si spezzava al computer
lasciando buchi, e «27» restava solo al telefono; in K il riflesso del sole,
sovrastampato, veniva quasi nero sul blu.

**Non controllato:** nessuna persona le ha viste; Safari e il gesto vero; le
animazioni solo nelle schermate. In H la finestrella del faro misura 54×28 px al
telefono: sopra il minimo AA di 24, sotto i 44 del progetto (il faro si tocca
anche nel disegno più in basso).

### H — La frase e il faro: bianco e nero, un colore solo; il faro lampeggia dentro il titolo

| Schermata | Che cosa mostra |
|---|---|
| [`h-frase-e-faro/schermate/home-375.png`](h-frase-e-faro/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`h-frase-e-faro/schermate/home-375x667.png`](h-frase-e-faro/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`h-frase-e-faro/schermate/home-375-intera.png`](h-frase-e-faro/schermate/home-375-intera.png) | Home intera al telefono |
| [`h-frase-e-faro/schermate/home-1280.png`](h-frase-e-faro/schermate/home-1280.png) | Home al computer, primo schermo |
| [`h-frase-e-faro/schermate/home-tocca-1280.png`](h-frase-e-faro/schermate/home-tocca-1280.png) | Home al computer con il primo elemento del disegno toccato: sotto, che cosa vuol dire |
| [`h-frase-e-faro/schermate/home-1280-intera.png`](h-frase-e-faro/schermate/home-1280-intera.png) | Home intera al computer |
| [`h-frase-e-faro/schermate/quiz-375.png`](h-frase-e-faro/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`h-frase-e-faro/schermate/quiz-375x667.png`](h-frase-e-faro/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`h-frase-e-faro/schermate/quiz-375-intera.png`](h-frase-e-faro/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`h-frase-e-faro/schermate/quiz-1280.png`](h-frase-e-faro/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`h-frase-e-faro/schermate/quiz-1280-intera.png`](h-frase-e-faro/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`h-frase-e-faro/schermate/preparazione-375.png`](h-frase-e-faro/schermate/preparazione-375.png) | La preparazione al telefono |
| [`h-frase-e-faro/schermate/preparazione-375x667.png`](h-frase-e-faro/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`h-frase-e-faro/schermate/preparazione-1280.png`](h-frase-e-faro/schermate/preparazione-1280.png) | La preparazione al computer |
| [`h-frase-e-faro/schermate/runner-375.png`](h-frase-e-faro/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`h-frase-e-faro/schermate/runner-375x667.png`](h-frase-e-faro/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`h-frase-e-faro/schermate/runner-1280.png`](h-frase-e-faro/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`h-frase-e-faro/schermate/runner-figura-375.png`](h-frase-e-faro/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo |
| [`h-frase-e-faro/schermate/runner-figura-375x667.png`](h-frase-e-faro/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`h-frase-e-faro/schermate/runner-figura-1280.png`](h-frase-e-faro/schermate/runner-figura-1280.png) | La stessa al computer |
| [`h-frase-e-faro/schermate/riepilogo-375.png`](h-frase-e-faro/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`h-frase-e-faro/schermate/riepilogo-375x667.png`](h-frase-e-faro/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`h-frase-e-faro/schermate/riepilogo-375-intera.png`](h-frase-e-faro/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`h-frase-e-faro/schermate/riepilogo-1280.png`](h-frase-e-faro/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`h-frase-e-faro/schermate/riepilogo-1280-intera.png`](h-frase-e-faro/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

### I — Il giornale di bordo: fogli da registro, inchiostro blu, il margine rosso; una riga del giornale da toccare

| Schermata | Che cosa mostra |
|---|---|
| [`i-giornale-di-bordo/schermate/home-375.png`](i-giornale-di-bordo/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`i-giornale-di-bordo/schermate/home-375x667.png`](i-giornale-di-bordo/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`i-giornale-di-bordo/schermate/home-375-intera.png`](i-giornale-di-bordo/schermate/home-375-intera.png) | Home intera al telefono |
| [`i-giornale-di-bordo/schermate/home-1280.png`](i-giornale-di-bordo/schermate/home-1280.png) | Home al computer, primo schermo |
| [`i-giornale-di-bordo/schermate/home-tocca-1280.png`](i-giornale-di-bordo/schermate/home-tocca-1280.png) | Home al computer con il primo elemento del disegno toccato: sotto, che cosa vuol dire |
| [`i-giornale-di-bordo/schermate/home-1280-intera.png`](i-giornale-di-bordo/schermate/home-1280-intera.png) | Home intera al computer |
| [`i-giornale-di-bordo/schermate/quiz-375.png`](i-giornale-di-bordo/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`i-giornale-di-bordo/schermate/quiz-375x667.png`](i-giornale-di-bordo/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`i-giornale-di-bordo/schermate/quiz-375-intera.png`](i-giornale-di-bordo/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`i-giornale-di-bordo/schermate/quiz-1280.png`](i-giornale-di-bordo/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`i-giornale-di-bordo/schermate/quiz-1280-intera.png`](i-giornale-di-bordo/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`i-giornale-di-bordo/schermate/preparazione-375.png`](i-giornale-di-bordo/schermate/preparazione-375.png) | La preparazione al telefono |
| [`i-giornale-di-bordo/schermate/preparazione-375x667.png`](i-giornale-di-bordo/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`i-giornale-di-bordo/schermate/preparazione-1280.png`](i-giornale-di-bordo/schermate/preparazione-1280.png) | La preparazione al computer |
| [`i-giornale-di-bordo/schermate/runner-375.png`](i-giornale-di-bordo/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`i-giornale-di-bordo/schermate/runner-375x667.png`](i-giornale-di-bordo/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`i-giornale-di-bordo/schermate/runner-1280.png`](i-giornale-di-bordo/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`i-giornale-di-bordo/schermate/runner-figura-375.png`](i-giornale-di-bordo/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo |
| [`i-giornale-di-bordo/schermate/runner-figura-375x667.png`](i-giornale-di-bordo/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`i-giornale-di-bordo/schermate/runner-figura-1280.png`](i-giornale-di-bordo/schermate/runner-figura-1280.png) | La stessa al computer |
| [`i-giornale-di-bordo/schermate/riepilogo-375.png`](i-giornale-di-bordo/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`i-giornale-di-bordo/schermate/riepilogo-375x667.png`](i-giornale-di-bordo/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`i-giornale-di-bordo/schermate/riepilogo-375-intera.png`](i-giornale-di-bordo/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`i-giornale-di-bordo/schermate/riepilogo-1280.png`](i-giornale-di-bordo/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`i-giornale-di-bordo/schermate/riepilogo-1280-intera.png`](i-giornale-di-bordo/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

### J — Le tessere: tessere di misure diverse, la notte in mare in una tessera scura

| Schermata | Che cosa mostra |
|---|---|
| [`j-tessere/schermate/home-375.png`](j-tessere/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`j-tessere/schermate/home-375x667.png`](j-tessere/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`j-tessere/schermate/home-375-intera.png`](j-tessere/schermate/home-375-intera.png) | Home intera al telefono |
| [`j-tessere/schermate/home-1280.png`](j-tessere/schermate/home-1280.png) | Home al computer, primo schermo |
| [`j-tessere/schermate/home-tocca-1280.png`](j-tessere/schermate/home-tocca-1280.png) | Home al computer con il primo elemento del disegno toccato: sotto, che cosa vuol dire |
| [`j-tessere/schermate/home-1280-intera.png`](j-tessere/schermate/home-1280-intera.png) | Home intera al computer |
| [`j-tessere/schermate/quiz-375.png`](j-tessere/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`j-tessere/schermate/quiz-375x667.png`](j-tessere/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`j-tessere/schermate/quiz-375-intera.png`](j-tessere/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`j-tessere/schermate/quiz-1280.png`](j-tessere/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`j-tessere/schermate/quiz-1280-intera.png`](j-tessere/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`j-tessere/schermate/preparazione-375.png`](j-tessere/schermate/preparazione-375.png) | La preparazione al telefono |
| [`j-tessere/schermate/preparazione-375x667.png`](j-tessere/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`j-tessere/schermate/preparazione-1280.png`](j-tessere/schermate/preparazione-1280.png) | La preparazione al computer |
| [`j-tessere/schermate/runner-375.png`](j-tessere/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`j-tessere/schermate/runner-375x667.png`](j-tessere/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`j-tessere/schermate/runner-1280.png`](j-tessere/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`j-tessere/schermate/runner-figura-375.png`](j-tessere/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo |
| [`j-tessere/schermate/runner-figura-375x667.png`](j-tessere/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`j-tessere/schermate/runner-figura-1280.png`](j-tessere/schermate/runner-figura-1280.png) | La stessa al computer |
| [`j-tessere/schermate/riepilogo-375.png`](j-tessere/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`j-tessere/schermate/riepilogo-375x667.png`](j-tessere/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`j-tessere/schermate/riepilogo-375-intera.png`](j-tessere/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`j-tessere/schermate/riepilogo-1280.png`](j-tessere/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`j-tessere/schermate/riepilogo-1280-intera.png`](j-tessere/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

### K — La stampa a due colori: blu e arancio fluorescente, il secondo colore fuori registro

| Schermata | Che cosa mostra |
|---|---|
| [`k-due-colori/schermate/home-375.png`](k-due-colori/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`k-due-colori/schermate/home-375x667.png`](k-due-colori/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`k-due-colori/schermate/home-375-intera.png`](k-due-colori/schermate/home-375-intera.png) | Home intera al telefono |
| [`k-due-colori/schermate/home-1280.png`](k-due-colori/schermate/home-1280.png) | Home al computer, primo schermo |
| [`k-due-colori/schermate/home-tocca-1280.png`](k-due-colori/schermate/home-tocca-1280.png) | Home al computer con il primo elemento del disegno toccato: sotto, che cosa vuol dire |
| [`k-due-colori/schermate/home-1280-intera.png`](k-due-colori/schermate/home-1280-intera.png) | Home intera al computer |
| [`k-due-colori/schermate/quiz-375.png`](k-due-colori/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`k-due-colori/schermate/quiz-375x667.png`](k-due-colori/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`k-due-colori/schermate/quiz-375-intera.png`](k-due-colori/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`k-due-colori/schermate/quiz-1280.png`](k-due-colori/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`k-due-colori/schermate/quiz-1280-intera.png`](k-due-colori/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`k-due-colori/schermate/preparazione-375.png`](k-due-colori/schermate/preparazione-375.png) | La preparazione al telefono |
| [`k-due-colori/schermate/preparazione-375x667.png`](k-due-colori/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`k-due-colori/schermate/preparazione-1280.png`](k-due-colori/schermate/preparazione-1280.png) | La preparazione al computer |
| [`k-due-colori/schermate/runner-375.png`](k-due-colori/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`k-due-colori/schermate/runner-375x667.png`](k-due-colori/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`k-due-colori/schermate/runner-1280.png`](k-due-colori/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`k-due-colori/schermate/runner-figura-375.png`](k-due-colori/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere: domanda, figura intera e prima risposta nel primo schermo |
| [`k-due-colori/schermate/runner-figura-375x667.png`](k-due-colori/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`k-due-colori/schermate/runner-figura-1280.png`](k-due-colori/schermate/runner-figura-1280.png) | La stessa al computer |
| [`k-due-colori/schermate/riepilogo-375.png`](k-due-colori/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`k-due-colori/schermate/riepilogo-375x667.png`](k-due-colori/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`k-due-colori/schermate/riepilogo-375-intera.png`](k-due-colori/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`k-due-colori/schermate/riepilogo-1280.png`](k-due-colori/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`k-due-colori/schermate/riepilogo-1280-intera.png`](k-due-colori/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

## Gli impianti diversi — 25 ottobre 2026

Dopo H, I, J e K l'autore ha detto: «ha cambiato lo stile ma sostanzialmente è
rimasto tutto il layout uguale, si può provare qualcosa di veramente diverso?».
Aveva ragione: quelle quattro cambiano il vestito, e Home, domanda e riepilogo
restano disposti come nella release candidate. Questi quattro cambiano la
**disposizione e il modo di muoversi**, e tengono contenuti e testi. Per far
vedere solo quello, **sono tutti nei colori della Regata** (il loro `tema.css`
comincia con una copia di `sorgenti/stili/g/tema.css`); la G non è stata toccata.
L'autore li ha scelti tutti e quattro fra quattro proposte.

- **L — Il percorso a boe** (`l-percorso-a-boe/`). La Home non è un menu ma una
  rotta: una linea tratteggiata scende di boa in boa — la prova d'esame con la
  barca «sei qui», la carta del faro, le 10 domande, i quesiti, il carteggio, i
  fanali, le prove — fino al porto, i limiti detti prima. Al computer la rotta
  scende al centro e le tappe si alternano. In Allenati gli otto argomenti sono
  **zone di mare grandi quanto pesano**: venti caselle, una per domanda della
  prova, e più un tema pesa più l'acqua è profonda; gli altri modi sono quattro
  boe in fila. Al computer la domanda ha la rotta delle dieci domande in
  verticale accanto; preparazione e riepilogo mostrano le dieci boe, quelle
  fatte con il loro colore.
- **M — La carta e il pannello** (`m-carta-e-pannello/`). Come un'app di
  navigazione: la carta sta ferma dietro, i comandi galleggiano sopra come
  pillole bianche, e il contenuto vive in un pannello che al telefono sale dal
  basso e al computer sta di lato. Il faro e la boa si toccano sulla carta
  stessa; al computer quello che dicono appare in una scheda sulla carta. Nella
  domanda, al computer, la carta resta accanto al pannello.
- **N — Una cosa per schermo** (`n-una-cosa-per-schermo/`). La Home è una pila
  di otto schermate intere, ognuna con una cosa sola (la prova; le 10 domande su
  un campo di mare; 1.722, 135 e 27 enormi; la carta; le prove; i limiti), con i
  puntini a destra al computer. Allenati è una fila di carte da sfogliare di
  lato, la prima quella consigliata; gli argomenti hanno il peso in grande prima
  del nome. Nella domanda le risposte sono fasce larghe quanto lo schermo e la
  correzione — l'esito, il perché e «Avanti» — sale come un foglio sotto il
  pollice. Il riepilogo è un numero per riga, enorme.
- **O — Il banco a due colonne** (`o-banco-a-due-colonne/`). Al computer a
  sinistra, ferma su un campo di colore, la cosa su cui lavori (la prova,
  l'allenamento consigliato, la domanda con la figura grande, il risultato); a
  destra, che scorre, tutto il resto (la carta, gli argomenti, le note, le
  risposte). Al telefono la colonna di sinistra è una fascia in cima.

Per rifarli, da questa cartella:

```bash
python3 sorgenti/stili/build.py . ../../../site/caratteri/manrope-latin-wght-normal.woff2 l m n o
node sorgenti/stili/cattura-stili.mjs "$PWD" l-percorso-a-boe m-carta-e-pannello n-una-cosa-per-schermo o-banco-a-due-colonne
```

Ogni impianto ha le sue pagine in `sorgenti/stili/<lettera>/`: L la Home,
Allenati, la preparazione e il riepilogo; M tutte e sei (la carta entra in
ognuna); N la Home, Allenati, la preparazione, la domanda e il riepilogo; O
tutte e sei.

**Misurato** da `cattura-stili.mjs` sulle 72 combinazioni: nessuno
sbordamento, un solo `data-ruolo="principale"` visibile, Manrope caricato.
Nella Home a 375×667 «Simula il quiz base» finisce a 446 (L), 533 (M), 429 (N)
e 446 px (O), sopra la barra. «Avanti» dopo un errore a 375×667 sta fra 599 e
655 px e il suo centro è suo. La figura della domanda lunga sta intera prima di
rispondere, 304–534 px, con il centro della prima risposta fra 665 e 678 su 812.
L'avviso della preparazione finisce 12 px sopra «Inizia», sopra la barra.
Contrasti AA sui colori calcolati di ogni testo visibile fuori dai disegni, con
il controllo a parte delle direzioni precedenti.

**Trovato guardando, e corretto:** in L, al computer, la carta lasciava un vuoto
sotto la prova e la sua boa copriva la barca; in M, al computer, la scheda del
faro copriva la sigla e metà carta stava sotto il pannello, e «Avanti» era
coperto dal pannello della domanda; in N i puntini coprivano il testo al
telefono, le schermate non erano allineate alla testata, i numeri del riepilogo
erano piccoli e la domanda grande spingeva la prima risposta al bordo; in O la
preparazione aveva l'avviso sopra «Inizia» e la domanda con figura non si
divideva in colonne. **Una cosa del misuratore, non della pagina:** le foto
«intere» di N sono vuote dopo la prima schermata, perché il misuratore allunga
la finestra e le schermate alte quanto la finestra si allungano con lei; per N ci
sono le schermate fotografate una per una, scorrendo.

**Non controllato:** nessuna persona; Safari e il gesto vero (lo scorrimento a
scatti di N, il pannello di M che sale con il dito); in M il pannello non si
trascina, scorre con la pagina; le animazioni solo nelle foto.

### L — Il percorso a boe: la Home è una rotta, gli argomenti sono zone di mare

| Schermata | Che cosa mostra |
|---|---|
| [`l-percorso-a-boe/schermate/home-375.png`](l-percorso-a-boe/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`l-percorso-a-boe/schermate/home-375x667.png`](l-percorso-a-boe/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`l-percorso-a-boe/schermate/home-375-intera.png`](l-percorso-a-boe/schermate/home-375-intera.png) | Home intera al telefono |
| [`l-percorso-a-boe/schermate/home-1280.png`](l-percorso-a-boe/schermate/home-1280.png) | Home al computer, primo schermo |
| [`l-percorso-a-boe/schermate/home-tocca-1280.png`](l-percorso-a-boe/schermate/home-tocca-1280.png) | Home al computer con il faro toccato: sotto, che cosa vuol dire |
| [`l-percorso-a-boe/schermate/home-1280-intera.png`](l-percorso-a-boe/schermate/home-1280-intera.png) | Home intera al computer |
| [`l-percorso-a-boe/schermate/quiz-375.png`](l-percorso-a-boe/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`l-percorso-a-boe/schermate/quiz-375x667.png`](l-percorso-a-boe/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`l-percorso-a-boe/schermate/quiz-375-intera.png`](l-percorso-a-boe/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`l-percorso-a-boe/schermate/quiz-1280.png`](l-percorso-a-boe/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`l-percorso-a-boe/schermate/quiz-1280-intera.png`](l-percorso-a-boe/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`l-percorso-a-boe/schermate/preparazione-375.png`](l-percorso-a-boe/schermate/preparazione-375.png) | La preparazione al telefono |
| [`l-percorso-a-boe/schermate/preparazione-375x667.png`](l-percorso-a-boe/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`l-percorso-a-boe/schermate/preparazione-1280.png`](l-percorso-a-boe/schermate/preparazione-1280.png) | La preparazione al computer |
| [`l-percorso-a-boe/schermate/runner-375.png`](l-percorso-a-boe/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`l-percorso-a-boe/schermate/runner-375x667.png`](l-percorso-a-boe/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`l-percorso-a-boe/schermate/runner-1280.png`](l-percorso-a-boe/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`l-percorso-a-boe/schermate/runner-figura-375.png`](l-percorso-a-boe/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere |
| [`l-percorso-a-boe/schermate/runner-figura-375x667.png`](l-percorso-a-boe/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`l-percorso-a-boe/schermate/runner-figura-1280.png`](l-percorso-a-boe/schermate/runner-figura-1280.png) | La stessa al computer |
| [`l-percorso-a-boe/schermate/riepilogo-375.png`](l-percorso-a-boe/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`l-percorso-a-boe/schermate/riepilogo-375x667.png`](l-percorso-a-boe/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`l-percorso-a-boe/schermate/riepilogo-375-intera.png`](l-percorso-a-boe/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`l-percorso-a-boe/schermate/riepilogo-1280.png`](l-percorso-a-boe/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`l-percorso-a-boe/schermate/riepilogo-1280-intera.png`](l-percorso-a-boe/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

### M — La carta e il pannello: la carta dietro, il contenuto in un pannello

| Schermata | Che cosa mostra |
|---|---|
| [`m-carta-e-pannello/schermate/home-375.png`](m-carta-e-pannello/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`m-carta-e-pannello/schermate/home-375x667.png`](m-carta-e-pannello/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`m-carta-e-pannello/schermate/home-375-intera.png`](m-carta-e-pannello/schermate/home-375-intera.png) | Home intera al telefono |
| [`m-carta-e-pannello/schermate/home-1280.png`](m-carta-e-pannello/schermate/home-1280.png) | Home al computer, primo schermo |
| [`m-carta-e-pannello/schermate/home-tocca-1280.png`](m-carta-e-pannello/schermate/home-tocca-1280.png) | Home al computer con il faro toccato: sotto, che cosa vuol dire |
| [`m-carta-e-pannello/schermate/home-1280-intera.png`](m-carta-e-pannello/schermate/home-1280-intera.png) | Home intera al computer |
| [`m-carta-e-pannello/schermate/quiz-375.png`](m-carta-e-pannello/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`m-carta-e-pannello/schermate/quiz-375x667.png`](m-carta-e-pannello/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`m-carta-e-pannello/schermate/quiz-375-intera.png`](m-carta-e-pannello/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`m-carta-e-pannello/schermate/quiz-1280.png`](m-carta-e-pannello/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`m-carta-e-pannello/schermate/quiz-1280-intera.png`](m-carta-e-pannello/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`m-carta-e-pannello/schermate/preparazione-375.png`](m-carta-e-pannello/schermate/preparazione-375.png) | La preparazione al telefono |
| [`m-carta-e-pannello/schermate/preparazione-375x667.png`](m-carta-e-pannello/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`m-carta-e-pannello/schermate/preparazione-1280.png`](m-carta-e-pannello/schermate/preparazione-1280.png) | La preparazione al computer |
| [`m-carta-e-pannello/schermate/runner-375.png`](m-carta-e-pannello/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`m-carta-e-pannello/schermate/runner-375x667.png`](m-carta-e-pannello/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`m-carta-e-pannello/schermate/runner-1280.png`](m-carta-e-pannello/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`m-carta-e-pannello/schermate/runner-figura-375.png`](m-carta-e-pannello/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere |
| [`m-carta-e-pannello/schermate/runner-figura-375x667.png`](m-carta-e-pannello/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`m-carta-e-pannello/schermate/runner-figura-1280.png`](m-carta-e-pannello/schermate/runner-figura-1280.png) | La stessa al computer |
| [`m-carta-e-pannello/schermate/riepilogo-375.png`](m-carta-e-pannello/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`m-carta-e-pannello/schermate/riepilogo-375x667.png`](m-carta-e-pannello/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`m-carta-e-pannello/schermate/riepilogo-375-intera.png`](m-carta-e-pannello/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`m-carta-e-pannello/schermate/riepilogo-1280.png`](m-carta-e-pannello/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`m-carta-e-pannello/schermate/riepilogo-1280-intera.png`](m-carta-e-pannello/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

### N — Una cosa per schermo: schermate intere, carte da sfogliare, la correzione come un foglio

| Schermata | Che cosa mostra |
|---|---|
| [`n-una-cosa-per-schermo/schermate/home-375.png`](n-una-cosa-per-schermo/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`n-una-cosa-per-schermo/schermate/home-375x667.png`](n-una-cosa-per-schermo/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`n-una-cosa-per-schermo/schermate/home-375-intera.png`](n-una-cosa-per-schermo/schermate/home-375-intera.png) | Home intera al telefono |
| [`n-una-cosa-per-schermo/schermate/home-1280.png`](n-una-cosa-per-schermo/schermate/home-1280.png) | Home al computer, primo schermo |
| [`n-una-cosa-per-schermo/schermate/home-tocca-1280.png`](n-una-cosa-per-schermo/schermate/home-tocca-1280.png) | Home al computer con il faro toccato: sotto, che cosa vuol dire |
| [`n-una-cosa-per-schermo/schermate/home-1280-intera.png`](n-una-cosa-per-schermo/schermate/home-1280-intera.png) | Home intera al computer |
| [`n-una-cosa-per-schermo/schermate/quiz-375.png`](n-una-cosa-per-schermo/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`n-una-cosa-per-schermo/schermate/quiz-375x667.png`](n-una-cosa-per-schermo/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`n-una-cosa-per-schermo/schermate/quiz-375-intera.png`](n-una-cosa-per-schermo/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`n-una-cosa-per-schermo/schermate/quiz-1280.png`](n-una-cosa-per-schermo/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`n-una-cosa-per-schermo/schermate/quiz-1280-intera.png`](n-una-cosa-per-schermo/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`n-una-cosa-per-schermo/schermate/preparazione-375.png`](n-una-cosa-per-schermo/schermate/preparazione-375.png) | La preparazione al telefono |
| [`n-una-cosa-per-schermo/schermate/preparazione-375x667.png`](n-una-cosa-per-schermo/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`n-una-cosa-per-schermo/schermate/preparazione-1280.png`](n-una-cosa-per-schermo/schermate/preparazione-1280.png) | La preparazione al computer |
| [`n-una-cosa-per-schermo/schermate/runner-375.png`](n-una-cosa-per-schermo/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`n-una-cosa-per-schermo/schermate/runner-375x667.png`](n-una-cosa-per-schermo/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`n-una-cosa-per-schermo/schermate/runner-1280.png`](n-una-cosa-per-schermo/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`n-una-cosa-per-schermo/schermate/runner-figura-375.png`](n-una-cosa-per-schermo/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere |
| [`n-una-cosa-per-schermo/schermate/runner-figura-375x667.png`](n-una-cosa-per-schermo/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`n-una-cosa-per-schermo/schermate/runner-figura-1280.png`](n-una-cosa-per-schermo/schermate/runner-figura-1280.png) | La stessa al computer |
| [`n-una-cosa-per-schermo/schermate/riepilogo-375.png`](n-una-cosa-per-schermo/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`n-una-cosa-per-schermo/schermate/riepilogo-375x667.png`](n-una-cosa-per-schermo/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`n-una-cosa-per-schermo/schermate/riepilogo-375-intera.png`](n-una-cosa-per-schermo/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`n-una-cosa-per-schermo/schermate/riepilogo-1280.png`](n-una-cosa-per-schermo/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`n-una-cosa-per-schermo/schermate/riepilogo-1280-intera.png`](n-una-cosa-per-schermo/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |
| [`n-una-cosa-per-schermo/schermate/home-375-schermata-1.png`](n-una-cosa-per-schermo/schermate/home-375-schermata-1.png) | Home al telefono, schermata 1 di 8, fotografata scorrendo |
| [`n-una-cosa-per-schermo/schermate/home-375-schermata-2.png`](n-una-cosa-per-schermo/schermate/home-375-schermata-2.png) | Home al telefono, schermata 2 di 8, fotografata scorrendo |
| [`n-una-cosa-per-schermo/schermate/home-375-schermata-3.png`](n-una-cosa-per-schermo/schermate/home-375-schermata-3.png) | Home al telefono, schermata 3 di 8, fotografata scorrendo |
| [`n-una-cosa-per-schermo/schermate/home-375-schermata-4.png`](n-una-cosa-per-schermo/schermate/home-375-schermata-4.png) | Home al telefono, schermata 4 di 8, fotografata scorrendo |
| [`n-una-cosa-per-schermo/schermate/home-375-schermata-5.png`](n-una-cosa-per-schermo/schermate/home-375-schermata-5.png) | Home al telefono, schermata 5 di 8, fotografata scorrendo |
| [`n-una-cosa-per-schermo/schermate/home-375-schermata-6.png`](n-una-cosa-per-schermo/schermate/home-375-schermata-6.png) | Home al telefono, schermata 6 di 8, fotografata scorrendo |
| [`n-una-cosa-per-schermo/schermate/home-375-schermata-7.png`](n-una-cosa-per-schermo/schermate/home-375-schermata-7.png) | Home al telefono, schermata 7 di 8, fotografata scorrendo |
| [`n-una-cosa-per-schermo/schermate/home-375-schermata-8.png`](n-una-cosa-per-schermo/schermate/home-375-schermata-8.png) | Home al telefono, schermata 8 di 8, fotografata scorrendo |
| [`n-una-cosa-per-schermo/schermate/home-1280-schermata-1.png`](n-una-cosa-per-schermo/schermate/home-1280-schermata-1.png) | Home al computer, schermata 1 di 8 |
| [`n-una-cosa-per-schermo/schermate/home-1280-schermata-2.png`](n-una-cosa-per-schermo/schermate/home-1280-schermata-2.png) | Home al computer, schermata 2 di 8 |
| [`n-una-cosa-per-schermo/schermate/home-1280-schermata-3.png`](n-una-cosa-per-schermo/schermate/home-1280-schermata-3.png) | Home al computer, schermata 3 di 8 |
| [`n-una-cosa-per-schermo/schermate/home-1280-schermata-4.png`](n-una-cosa-per-schermo/schermate/home-1280-schermata-4.png) | Home al computer, schermata 4 di 8 |
| [`n-una-cosa-per-schermo/schermate/home-1280-schermata-5.png`](n-una-cosa-per-schermo/schermate/home-1280-schermata-5.png) | Home al computer, schermata 5 di 8 |
| [`n-una-cosa-per-schermo/schermate/home-1280-schermata-6.png`](n-una-cosa-per-schermo/schermate/home-1280-schermata-6.png) | Home al computer, schermata 6 di 8 |
| [`n-una-cosa-per-schermo/schermate/home-1280-schermata-7.png`](n-una-cosa-per-schermo/schermate/home-1280-schermata-7.png) | Home al computer, schermata 7 di 8 |
| [`n-una-cosa-per-schermo/schermate/home-1280-schermata-8.png`](n-una-cosa-per-schermo/schermate/home-1280-schermata-8.png) | Home al computer, schermata 8 di 8 |
| [`n-una-cosa-per-schermo/schermate/riepilogo-375-schermata-1.png`](n-una-cosa-per-schermo/schermate/riepilogo-375-schermata-1.png) | Il riepilogo al telefono, schermata 1 di 3 |
| [`n-una-cosa-per-schermo/schermate/riepilogo-375-schermata-2.png`](n-una-cosa-per-schermo/schermate/riepilogo-375-schermata-2.png) | Il riepilogo al telefono, schermata 2 di 3 |
| [`n-una-cosa-per-schermo/schermate/riepilogo-375-schermata-3.png`](n-una-cosa-per-schermo/schermate/riepilogo-375-schermata-3.png) | Il riepilogo al telefono, schermata 3 di 3 |

### O — Il banco a due colonne: a sinistra la cosa su cui lavori, a destra il resto

| Schermata | Che cosa mostra |
|---|---|
| [`o-banco-a-due-colonne/schermate/home-375.png`](o-banco-a-due-colonne/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`o-banco-a-due-colonne/schermate/home-375x667.png`](o-banco-a-due-colonne/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`o-banco-a-due-colonne/schermate/home-375-intera.png`](o-banco-a-due-colonne/schermate/home-375-intera.png) | Home intera al telefono |
| [`o-banco-a-due-colonne/schermate/home-1280.png`](o-banco-a-due-colonne/schermate/home-1280.png) | Home al computer, primo schermo |
| [`o-banco-a-due-colonne/schermate/home-tocca-1280.png`](o-banco-a-due-colonne/schermate/home-tocca-1280.png) | Home al computer con il faro toccato: sotto, che cosa vuol dire |
| [`o-banco-a-due-colonne/schermate/home-1280-intera.png`](o-banco-a-due-colonne/schermate/home-1280-intera.png) | Home intera al computer |
| [`o-banco-a-due-colonne/schermate/quiz-375.png`](o-banco-a-due-colonne/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`o-banco-a-due-colonne/schermate/quiz-375x667.png`](o-banco-a-due-colonne/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`o-banco-a-due-colonne/schermate/quiz-375-intera.png`](o-banco-a-due-colonne/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`o-banco-a-due-colonne/schermate/quiz-1280.png`](o-banco-a-due-colonne/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`o-banco-a-due-colonne/schermate/quiz-1280-intera.png`](o-banco-a-due-colonne/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`o-banco-a-due-colonne/schermate/preparazione-375.png`](o-banco-a-due-colonne/schermate/preparazione-375.png) | La preparazione al telefono |
| [`o-banco-a-due-colonne/schermate/preparazione-375x667.png`](o-banco-a-due-colonne/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`o-banco-a-due-colonne/schermate/preparazione-1280.png`](o-banco-a-due-colonne/schermate/preparazione-1280.png) | La preparazione al computer |
| [`o-banco-a-due-colonne/schermate/runner-375.png`](o-banco-a-due-colonne/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`o-banco-a-due-colonne/schermate/runner-375x667.png`](o-banco-a-due-colonne/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`o-banco-a-due-colonne/schermate/runner-1280.png`](o-banco-a-due-colonne/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`o-banco-a-due-colonne/schermate/runner-figura-375.png`](o-banco-a-due-colonne/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere |
| [`o-banco-a-due-colonne/schermate/runner-figura-375x667.png`](o-banco-a-due-colonne/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`o-banco-a-due-colonne/schermate/runner-figura-1280.png`](o-banco-a-due-colonne/schermate/runner-figura-1280.png) | La stessa al computer |
| [`o-banco-a-due-colonne/schermate/riepilogo-375.png`](o-banco-a-due-colonne/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`o-banco-a-due-colonne/schermate/riepilogo-375x667.png`](o-banco-a-due-colonne/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`o-banco-a-due-colonne/schermate/riepilogo-375-intera.png`](o-banco-a-due-colonne/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`o-banco-a-due-colonne/schermate/riepilogo-1280.png`](o-banco-a-due-colonne/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`o-banco-a-due-colonne/schermate/riepilogo-1280-intera.png`](o-banco-a-due-colonne/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |

## Dopo la scelta dell'autore: la rotta che si accende e la Regata sulla carta — 25 ottobre 2026

Guardati gli impianti, l'autore: «mi piace il percorso a boe: lo terrei però come
una animazione, per la home/hero page, e scorrendo in basso il triangolino si
riempie o si illumina. La hero page potrebbe, nei vari pannelli che si
susseguono scendendo, illustrare come funziona e le varie modalità di
allenamento»; e «mi piace la carta come sfondo, ma non molto il pannello.
possiamo mettere nella "regata" della sessione precedente - ovviamente in un
mock separato?». Due mock nuovi, tutti e due nei colori della Regata; la G e la
L non sono state toccate.

- **P — La rotta che si accende** (`p-rotta-che-si-accende/`). La testa è quella
  della Regata (titolo, la prova d'esame, le 10 domande). Sotto, **«Come
  funziona»**: una rotta tratteggiata scende per dieci tappe, e scorrendo la
  linea si riempie d'arancio fino a poco sotto la metà dello schermo, la barca
  sta in punta e ogni triangolo superato si accende (si colora, cresce, ha un
  alone) e resta acceso; il disegno della tappa, sbiadito prima, prende colore.
  Le tappe: si prova senza account; la simulazione come all'esame; dieci domande
  con la correzione; l'allenamento consigliato; un argomento alla volta (con le
  zone di mare della L in piccolo); gli errori che tornano; il carteggio sulla
  carta vera; fanali e segnali (la carta del faro e della boa, da toccare);
  l'esame in ordine; e il porto, con l'account. Al telefono la rotta scende a
  sinistra; al computer al centro, con testo e disegno che si alternano. Chi
  chiede meno movimento vede tutto acceso e fermo. Le altre pagine sono quelle
  della Regata.
- **Q — La Regata sulla carta** (`q-regata-sulla-carta/`). La carta nautica sta
  ferma dietro tutta la pagina, e si vede da **finestre**: la testa della Home
  (con un velo di mare sotto il testo, solo a sinistra al computer) e una fascia
  dopo «Che cosa trovi qui», dove il faro e la boa si toccano sulla carta
  stessa. Il resto è pagina bianca che scorre sopra la carta: nessun pannello.
  Allenati, la preparazione e il riepilogo hanno la loro testa sulla carta; la
  domanda è bianca al telefono e al computer ha la carta ai lati.

**Testi nuovi, da verificare dall'autore:** in P i titoli e le frasi delle dieci
tappe e «Come funziona · Scendi lungo la rotta…». Sono presi da quello che il
sito già dice (specifica, Allenati, preparazione, riepilogo), ma messi insieme
qui per la prima volta.

Per rifarli, da questa cartella:

```bash
python3 sorgenti/stili/build.py . ../../../site/caratteri/manrope-latin-wght-normal.woff2 p q
node sorgenti/stili/cattura-stili.mjs "$PWD" p-rotta-che-si-accende q-regata-sulla-carta
```

P ha la sua Home in `sorgenti/stili/p/`; Q ha tutte e sei le pagine in
`sorgenti/stili/q/`.

**Misurato** sulle 36 combinazioni: nessuno sbordamento, un solo principale,
«Simula il quiz base» a 446 px a 375×667 in tutti e due, «Avanti» a 599–655 px
e scoperto, la figura intera prima di rispondere (323–534, centro della prima
risposta a 678), l'avviso a 12 px da «Inizia». Contrasti AA con il controllo a
parte; il testo bianco della testa sta su un velo di mare al 72%, che nel caso
peggiore (sopra la terra bianca) fa un fondo `#4D6877`, a 5,9:1 con il bianco.
Le foto della discesa di P e della finestra di Q sono fatte scorrendo.

**Trovato guardando, e corretto:** in P le tappe al computer erano troppo
distanti, il testo delle tappe di destra era centrato e la carta del faro stava
stretta nel suo riquadro; in Q, al telefono, la carta era così ingrandita che la
boa era tagliata e la scheda copriva il faro (ora la carta occupa il 70%
dell'altezza e sta più in basso), la legenda del computer compariva anche al
telefono, «Avanti» era più stretto per un contenitore con lo stesso nome, e — lo
ha trovato il controllo dei contrasti — la domanda al telefono aveva il fondo
blu sotto il testo scuro.

**Non controllato:** nessuna persona; Safari e lo scorrimento vero con il dito
(l'animazione di P è guardata nelle foto, tappa per tappa); in Q lo sfondo fermo
su iPhone, dove `position:fixed` durante lo scorrimento si comporta a modo suo.

### P — La rotta che si accende: la Home della Regata con il percorso a boe animato

| Schermata | Che cosa mostra |
|---|---|
| [`p-rotta-che-si-accende/schermate/home-375.png`](p-rotta-che-si-accende/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`p-rotta-che-si-accende/schermate/home-375x667.png`](p-rotta-che-si-accende/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`p-rotta-che-si-accende/schermate/home-375-intera.png`](p-rotta-che-si-accende/schermate/home-375-intera.png) | Home intera al telefono |
| [`p-rotta-che-si-accende/schermate/home-1280.png`](p-rotta-che-si-accende/schermate/home-1280.png) | Home al computer, primo schermo |
| [`p-rotta-che-si-accende/schermate/home-tocca-1280.png`](p-rotta-che-si-accende/schermate/home-tocca-1280.png) | Home al computer con il faro toccato: sotto, che cosa vuol dire |
| [`p-rotta-che-si-accende/schermate/home-1280-intera.png`](p-rotta-che-si-accende/schermate/home-1280-intera.png) | Home intera al computer |
| [`p-rotta-che-si-accende/schermate/quiz-375.png`](p-rotta-che-si-accende/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`p-rotta-che-si-accende/schermate/quiz-375x667.png`](p-rotta-che-si-accende/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`p-rotta-che-si-accende/schermate/quiz-375-intera.png`](p-rotta-che-si-accende/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`p-rotta-che-si-accende/schermate/quiz-1280.png`](p-rotta-che-si-accende/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`p-rotta-che-si-accende/schermate/quiz-1280-intera.png`](p-rotta-che-si-accende/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`p-rotta-che-si-accende/schermate/preparazione-375.png`](p-rotta-che-si-accende/schermate/preparazione-375.png) | La preparazione al telefono |
| [`p-rotta-che-si-accende/schermate/preparazione-375x667.png`](p-rotta-che-si-accende/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`p-rotta-che-si-accende/schermate/preparazione-1280.png`](p-rotta-che-si-accende/schermate/preparazione-1280.png) | La preparazione al computer |
| [`p-rotta-che-si-accende/schermate/runner-375.png`](p-rotta-che-si-accende/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`p-rotta-che-si-accende/schermate/runner-375x667.png`](p-rotta-che-si-accende/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`p-rotta-che-si-accende/schermate/runner-1280.png`](p-rotta-che-si-accende/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`p-rotta-che-si-accende/schermate/runner-figura-375.png`](p-rotta-che-si-accende/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere |
| [`p-rotta-che-si-accende/schermate/runner-figura-375x667.png`](p-rotta-che-si-accende/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`p-rotta-che-si-accende/schermate/runner-figura-1280.png`](p-rotta-che-si-accende/schermate/runner-figura-1280.png) | La stessa al computer |
| [`p-rotta-che-si-accende/schermate/riepilogo-375.png`](p-rotta-che-si-accende/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`p-rotta-che-si-accende/schermate/riepilogo-375x667.png`](p-rotta-che-si-accende/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`p-rotta-che-si-accende/schermate/riepilogo-375-intera.png`](p-rotta-che-si-accende/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`p-rotta-che-si-accende/schermate/riepilogo-1280.png`](p-rotta-che-si-accende/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`p-rotta-che-si-accende/schermate/riepilogo-1280-intera.png`](p-rotta-che-si-accende/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-1.png`](p-rotta-che-si-accende/schermate/home-375-tappa-1.png) | Home al telefono scorrendo: la tappa 1 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-2.png`](p-rotta-che-si-accende/schermate/home-375-tappa-2.png) | Home al telefono scorrendo: la tappa 2 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-3.png`](p-rotta-che-si-accende/schermate/home-375-tappa-3.png) | Home al telefono scorrendo: la tappa 3 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-4.png`](p-rotta-che-si-accende/schermate/home-375-tappa-4.png) | Home al telefono scorrendo: la tappa 4 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-5.png`](p-rotta-che-si-accende/schermate/home-375-tappa-5.png) | Home al telefono scorrendo: la tappa 5 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-6.png`](p-rotta-che-si-accende/schermate/home-375-tappa-6.png) | Home al telefono scorrendo: la tappa 6 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-7.png`](p-rotta-che-si-accende/schermate/home-375-tappa-7.png) | Home al telefono scorrendo: la tappa 7 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-8.png`](p-rotta-che-si-accende/schermate/home-375-tappa-8.png) | Home al telefono scorrendo: la tappa 8 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-9.png`](p-rotta-che-si-accende/schermate/home-375-tappa-9.png) | Home al telefono scorrendo: la tappa 9 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-375-tappa-10.png`](p-rotta-che-si-accende/schermate/home-375-tappa-10.png) | Home al telefono scorrendo: la tappa 10 di 10 al centro dello schermo, con le tappe sopra già accese |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-1.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-1.png) | Home al computer, la tappa 1 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-2.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-2.png) | Home al computer, la tappa 2 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-3.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-3.png) | Home al computer, la tappa 3 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-4.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-4.png) | Home al computer, la tappa 4 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-5.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-5.png) | Home al computer, la tappa 5 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-6.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-6.png) | Home al computer, la tappa 6 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-7.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-7.png) | Home al computer, la tappa 7 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-8.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-8.png) | Home al computer, la tappa 8 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-9.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-9.png) | Home al computer, la tappa 9 di 10 al centro |
| [`p-rotta-che-si-accende/schermate/home-1280-tappa-10.png`](p-rotta-che-si-accende/schermate/home-1280-tappa-10.png) | Home al computer, la tappa 10 di 10 al centro |

### Q — La Regata sulla carta: la carta ferma dietro, le finestre, nessun pannello

| Schermata | Che cosa mostra |
|---|---|
| [`q-regata-sulla-carta/schermate/home-375.png`](q-regata-sulla-carta/schermate/home-375.png) | Home, primo schermo a 375×812 |
| [`q-regata-sulla-carta/schermate/home-375x667.png`](q-regata-sulla-carta/schermate/home-375x667.png) | Home su un telefono piccolo: «Simula il quiz base» sopra la barra |
| [`q-regata-sulla-carta/schermate/home-375-intera.png`](q-regata-sulla-carta/schermate/home-375-intera.png) | Home intera al telefono |
| [`q-regata-sulla-carta/schermate/home-1280.png`](q-regata-sulla-carta/schermate/home-1280.png) | Home al computer, primo schermo |
| [`q-regata-sulla-carta/schermate/home-tocca-1280.png`](q-regata-sulla-carta/schermate/home-tocca-1280.png) | Home al computer con il faro toccato: sotto, che cosa vuol dire |
| [`q-regata-sulla-carta/schermate/home-1280-intera.png`](q-regata-sulla-carta/schermate/home-1280-intera.png) | Home intera al computer |
| [`q-regata-sulla-carta/schermate/quiz-375.png`](q-regata-sulla-carta/schermate/quiz-375.png) | Allenati · Quiz, primo schermo al telefono |
| [`q-regata-sulla-carta/schermate/quiz-375x667.png`](q-regata-sulla-carta/schermate/quiz-375x667.png) | Allenati · Quiz su un telefono piccolo |
| [`q-regata-sulla-carta/schermate/quiz-375-intera.png`](q-regata-sulla-carta/schermate/quiz-375-intera.png) | Allenati · Quiz intera al telefono |
| [`q-regata-sulla-carta/schermate/quiz-1280.png`](q-regata-sulla-carta/schermate/quiz-1280.png) | Allenati · Quiz al computer |
| [`q-regata-sulla-carta/schermate/quiz-1280-intera.png`](q-regata-sulla-carta/schermate/quiz-1280-intera.png) | Allenati · Quiz intera al computer |
| [`q-regata-sulla-carta/schermate/preparazione-375.png`](q-regata-sulla-carta/schermate/preparazione-375.png) | La preparazione al telefono |
| [`q-regata-sulla-carta/schermate/preparazione-375x667.png`](q-regata-sulla-carta/schermate/preparazione-375x667.png) | La preparazione su un telefono piccolo: l'avviso «senza account» 12 px sopra «Inizia», sopra la barra |
| [`q-regata-sulla-carta/schermate/preparazione-1280.png`](q-regata-sulla-carta/schermate/preparazione-1280.png) | La preparazione al computer |
| [`q-regata-sulla-carta/schermate/runner-375.png`](q-regata-sulla-carta/schermate/runner-375.png) | La domanda 1.7.6-19 dopo una risposta sbagliata, a 375×812 |
| [`q-regata-sulla-carta/schermate/runner-375x667.png`](q-regata-sulla-carta/schermate/runner-375x667.png) | La stessa su un telefono piccolo: «Avanti» nel primo schermo |
| [`q-regata-sulla-carta/schermate/runner-1280.png`](q-regata-sulla-carta/schermate/runner-1280.png) | La domanda dopo l'errore, al computer |
| [`q-regata-sulla-carta/schermate/runner-figura-375.png`](q-regata-sulla-carta/schermate/runner-figura-375.png) | La domanda più lunga con figura, prima di rispondere |
| [`q-regata-sulla-carta/schermate/runner-figura-375x667.png`](q-regata-sulla-carta/schermate/runner-figura-375x667.png) | La stessa su un telefono piccolo |
| [`q-regata-sulla-carta/schermate/runner-figura-1280.png`](q-regata-sulla-carta/schermate/runner-figura-1280.png) | La stessa al computer |
| [`q-regata-sulla-carta/schermate/riepilogo-375.png`](q-regata-sulla-carta/schermate/riepilogo-375.png) | Il riepilogo di due domande, primo schermo |
| [`q-regata-sulla-carta/schermate/riepilogo-375x667.png`](q-regata-sulla-carta/schermate/riepilogo-375x667.png) | Il riepilogo su un telefono piccolo |
| [`q-regata-sulla-carta/schermate/riepilogo-375-intera.png`](q-regata-sulla-carta/schermate/riepilogo-375-intera.png) | Il riepilogo intero al telefono |
| [`q-regata-sulla-carta/schermate/riepilogo-1280.png`](q-regata-sulla-carta/schermate/riepilogo-1280.png) | Il riepilogo al computer |
| [`q-regata-sulla-carta/schermate/riepilogo-1280-intera.png`](q-regata-sulla-carta/schermate/riepilogo-1280-intera.png) | Il riepilogo intero al computer |
| [`q-regata-sulla-carta/schermate/home-375-finestra-1.png`](q-regata-sulla-carta/schermate/home-375-finestra-1.png) | Home al telefono con la finestra del faro al centro: la carta ferma dietro, la scheda sopra |
| [`q-regata-sulla-carta/schermate/home-1280-finestra-1.png`](q-regata-sulla-carta/schermate/home-1280-finestra-1.png) | La stessa al computer |

## Che cosa non è stato controllato

Vale per tutti i mock, anche per gli stili e le direzioni del 25 ottobre. T-12 e T-13 misurano la pagina vera, non questi file; nessuna persona li ha
visti; Safari e il gesto vero; gli stati con l'account, i Segnali, il Carteggio,
Esame, Progressi, la revisione e il salvataggio fallito, che non hanno un mock in
nessuna direzione; la domanda dopo lo scorrimento a 375×667.
