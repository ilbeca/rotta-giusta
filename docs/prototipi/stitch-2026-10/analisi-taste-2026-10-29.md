# Il prototipo della Home a pannelli, letto da taste — 29 ottobre 2026

**Che cosa:** il parere della skill **taste** sul mock
[`carta-corretta/index.html`](carta-corretta/index.html), la Home a pannelli che
l'autore ha approvato come nuova Home, salvo ritocchi minimi. Procedura A di
`docs/procedure-disegno.md`, in sola lettura: nessun file del mock, del sito o
dei test è stato toccato. L'analisi del 28 ottobre
([`analisi-2026-10-28.md`](analisi-2026-10-28.md)) non si rifà: qui si dice dove
taste è d'accordo e dove no. Su richiesta dell'autore si guarda **soltanto il
prototipo**; il sito pubblicato è stato misurato all'inizio ma non entra nel
rapporto.

## 1. Bersaglio, stati, misure

- **Bersaglio:** `docs/prototipi/stitch-2026-10/carta-corretta/index.html` al
  commit `38e0eff`, servito dalla radice del repo con
  `python3 -m http.server 8792`; `?ridotto` per il movimento ridotto.
- **Modalità:** il pannello 0 è *Persuade* (chi comincia da zero, H0); i
  pannelli 1–10 sono *Read*, una guida da scorrere. taste ha girato due volte,
  come pagina e con `--app`, e i due giudizi si leggono insieme (§3).
- **Stati guardati:** il pannello 0 a metà della costruzione e alla fine
  (12 s), i pannelli 1–10 uno per uno, il faro toccato, il movimento ridotto
  (pannelli 0, 1 e 8), sei Tab dalla testata.
- **Misure dello schermo:** 1280×800, 1920×1080, 1280×1024 e 1200×700, cioè
  sopra la soglia della U, dove questa Home esiste. L'ispettore di taste
  fotografa con altezze sue (1280×800, 1920×1200) e anche a 375 px: lì il
  prototipo non è disegnato — sotto la soglia la Home è la Regata — e a 375 px
  il titolo va su sei righe con il percorso sopra il testo. **Non conta**, e non
  è fra i difetti.
- **Risultati di lavoro** fuori dal repo, nella cartella temporanea della
  sessione: `report.json` delle due ispezioni, fotografie dell'ispettore, uno
  script di cattura sui `lib/cdp.mjs` di taste con le sue misure in
  `misure.json`.

## 2. Versioni e modo del giudizio

taste **2.1.5** (`Leonxlnx/taste-skill`), con `lint.mjs --app`,
`inspect.mjs` (pagina e `--app`), e le domande di `references/critique.md` e del
§2.7 di `references/app-screens.md`. **impeccable e UI UX Pro Max non sono stati
usati**: il compito era il parere di taste. Niente critique a due agenti, quindi
niente punteggi di Nielsen; il giudizio qui sotto è di un contesto solo.

## 3. Che cosa misura taste

**Il lint** (`--app`): 1 FAIL, 0 WARN. Il FAIL è il velo, un `linear-gradient`
sotto la colonna del testo (riga 32).

**L'ispettore**, per larghezza:

| | 1920 | 1280 | 375 |
|---|---|---|---|
| come pagina | 6 FAIL, 3 WARN | 5 FAIL, 3 WARN | 5 FAIL (non conta, §1) |
| come schermata d'app | 2 FAIL, 4 WARN | 2 FAIL, 4 WARN | — |

I FAIL e i WARN, con che cosa sono:

| Regola di taste | Dove | Che cosa è, guardato |
|---|---|---|
| `headline-lines` FAIL | h1, 56 px | **vero**: quattro righe a ogni misura, e l'ultima è una parola sola, «volta.». La colonna è larga 480 px |
| `gradient` FAIL | `.velo` | il velo che tiene leggibile il testo sopra la carta: una scrim, che taste ammette sopra una fotografia. Disaccordo (§6) |
| `eyebrow` FAIL (pagina) | «La prova d'esame dei quiz» sopra 20 · 30′ · 4 | un'etichetta sopra dei valori, che le regole di taste per le schermate d'app ammettono. Disaccordo (§6) |
| `few-pictures`, `no-footage` | pagina | regole da sito vetrina, già nel registro come «non si applica» |
| `off-centre` | pagina | taste conta la carta in SVG come vuoto, quindi vede il contenuto tutto a sinistra. La metà destra è la carta. Disaccordo (§6) |
| `palette-cream` WARN | testata `#fbf8f2`, testo `#f6efe0` | **vero per la testata**: il sito ha la testata bianca, il mock una crema. Non è la terra delle carte, è una superficie della pagina |
| `hairline` WARN | il bordo sotto la testata | trascurabile: il sito ha lo stesso bordo |
| `rainbow-chart`, `colour-sprawl`, `app-title-size` (app) | la carta, l'h1 | regole da cruscotto: R, B e V sono i settori del faro e il blu è il mare; i 56 px sono R-RIF-23. Già nel registro, o non si applicano |

**Le misure fatte apposta** (script di cattura, Chrome headless):

- **Il titolo:** quattro righe a 56 px a 1200, 1280 e 1920 px; nel sito
  pubblicato, largo 560 px, sono tre.
- **I pannelli 1–10:** il testo occupa da 117 a 169 px di altezza su 800. In
  nessuno dei dieci la carta mostra il faro o la boa (`[data-luce]` fuori dallo
  schermo), **compreso il pannello 8, che dice «tocca il faro o la boa per
  leggerla»**.
- **La tastiera:** dopo la testata il Tab va ai triangoli del percorso
  («1. Inizio», «2. Come funziona»…), non a «Simula il quiz base»: nel DOM
  `nav.percorso` viene prima di `main`. R-VOLTO-05 chiede il contrario.
- **Contrasti:** il triangolo `#8a3200` sulla terra 6,7:1; il testo della carta
  `#f6efe0` sul velo 13,7:1 e sul mare 8,4:1; la nota della scheda 8,5:1; la
  rotta `#ff8a3d` sul mare 4,1:1, che basta per un segno (3:1) e non per un
  testo.
- **Sbordamento:** 0 a tutte le misure del computer.

## 4. Le fotografie

- [`taste-p0-1280x800.jpg`](taste-p0-1280x800.jpg) — il pannello 0 a
  costruzione finita. La carta è la cosa migliore del mock; il titolo è su
  quattro righe, con «volta.» da sola; in basso la barca è tagliata dal bordo;
  la rotta passa sopra «Sc.(3) 10s» e sopra i fondali 34 e 32; «21» sta
  sull'arco bianco del faro, e il simbolo della corrente «2,0 kn» sopra la «B».
- [`taste-p0-1920x1080.jpg`](taste-p0-1920x1080.jpg) — la stessa cosa al
  computer grande: fra la colonna (che finisce a 544 px) e la costruzione
  (che comincia a circa 1000) ci sono 450 px di mare vuoto, e «Sc −5°» si
  scontra con i fondali 27 e 26.
- [`taste-p0-1280x1024.jpg`](taste-p0-1280x1024.jpg) — su uno schermo alto il
  punto nave delle 10:00 e «Ve 5,7 kn» finiscono sotto il velo e si leggono
  spenti: è il «a pochi pixel dalla colonna» dell'analisi del 28, che qui si
  vede.
- [`taste-p1-1280x800.jpg`](taste-p1-1280x800.jpg) — il pannello 1, e insieme
  a lui gli altri nove: una linea tratteggiata, la barca, qualche fondale, il
  segno della corrente. Due righe di testo in un 800 px.
- [`taste-p8-1280x800.jpg`](taste-p8-1280x800.jpg) — il pannello 8 dice di
  toccare il faro o la boa, e sullo schermo non ci sono.
- [`taste-p7-1920x1080.jpg`](taste-p7-1920x1080.jpg) — il pannello 7 al
  computer grande: l'unico con un'azione («Rivedi il triangolo delle
  correnti»), e i fondali 37 e 35 sopra la rotta.
- [`taste-faro-1280x800.jpg`](taste-faro-1280x800.jpg) — il faro toccato: la
  sigla in testo vero, leggibile, e la scheda che si apre sopra la boa e la
  barca, lontana dalla colonna del testo.

## 5. Il parere

### Che cosa funziona

- **L'idea viene dal soggetto, e passa la prova del concorrente.** Sul pannello
  0 la Home disegna un esercizio di carteggio vero — il 2° problema delle
  correnti, con i numeri calcolati — e un faro con la sua sigla e il suo ritmo.
  Un altro sito di quiz non potrebbe mettere il proprio nome su questa pagina:
  è la cosa che le pagine premiate studiate da taste hanno e le altre no. È la
  stessa conclusione dell'analisi del 28, e taste la rafforza.
- **Il primo schermo dice che cos'è e che cosa fare**: il titolo, la frase,
  le condizioni della prova (20 · 30′ · 4) e un solo pulsante pieno, nel primo
  schermo anche a 1200×700.
- **Il movimento ha un perché**: una cosa per volta (prima la costruzione, poi
  la rotta), le luci con il ritmo della loro sigla, il comando per fermarle, e
  con il movimento ridotto tutto disegnato e fermo. Su questo taste e l'analisi
  del 28 sono d'accordo.
- **Una cosa viva**: il faro e la boa si toccano e dicono la loro sigla in testo
  vero. taste la chiede a ogni pagina, ed è già qui.
- **Disciplina del disegno**: niente ombre sulle cose ferme, niente schede
  dentro schede, una famiglia di caratteri, il colore sul dato (la rotta) e
  sull'azione, contrasti AA, nessuno sbordamento.

### Che cosa non funziona, e perché

1. **Dieci pannelli su undici sono lo stesso schermo vuoto.** Il pannello 0 è
   un manifesto; i pannelli 1–10 sono due righe di testo a sinistra e, a
   destra, una linea tratteggiata con una barca. È il difetto che taste trova
   più spesso anche nei siti buoni: un primo schermo con un'idea, poi blocchi
   tutti uguali. Per chi studia vuol dire scorrere dieci volte la stessa
   immagine per leggere dieci frasi; con gli scatti obbligati, ogni frase costa
   uno schermo intero.
2. **Il pannello 8 promette una cosa che non c'è.** «Tocca il faro o la boa per
   leggerla», e faro e boa stanno sette schermi più su. Non è gusto: è un testo
   che non corrisponde a quello che si vede, cioè un piccolo inganno, proprio
   nella Home.
3. **Il titolo va su quattro righe con una parola sola in fondo.** A 56 px in
   480 px di colonna, «volta.» resta da sola su tutte le misure. È la prima
   cosa che si legge, e sembra spezzata.
4. **Le etichette della carta si scontrano.** La rotta attraversa «Sc.(3) 10s»
   e i fondali; «21», «27», «26» cadono sugli archi e sulle note del vento; la
   corrente copre la «B». Su una carta vera i numeri non si sovrappongono alle
   linee: qui è l'unica cosa che fa sembrare il disegno meno vero di quello che
   è.
5. **Con la tastiera, l'azione principale arriva dopo undici triangoli.** Chi
   usa il Tab passa per tutto il percorso prima di «Simula il quiz base».
6. **La testata non è quella del sito**: crema invece che bianca, e il nome
   scritto invece del marchio con la nave e i due fanali, che `PRODUCT.md`
   tiene fermo.

### Che cosa cambierei per primo

1. **Ogni pannello mostra sulla carta la cosa di cui parla**, almeno il
   pannello 8: un faro e una boa nel tratto di costa del pannello 8, con le
   stesse sigle toccabili. È il ritocco più piccolo che toglie l'inganno. Poi,
   pannello per pannello, quello che la scheda I-30 chiede già e il mock non ha
   ancora: la miniatura animata dello schermo vero (punto 2), il secondo faro, la
   secca e il porticciolo lungo la costa (punto 3), le annotazioni del
   carteggio a ogni tratto — punti nave con l'ora, un rilevamento al faro
   (punto 4). taste dice la stessa cosa con altre parole: la rotta che scende
   è il filo, e da sola non riempie dieci schermi.
2. **Il titolo su tre righe senza parola sola**: la larghezza del sito (560 px)
   per l'h1 e `text-wrap: balance` sui titoli. Restano i 56 px di R-RIF-23.
3. **Le etichette della carta che non si toccano**: spostare a mano i fondali
   vicini alla rotta e alle note (sono generati: basta escluderli da una
   fascia intorno a ogni linea e a ogni testo), e «Sc.(3) 10s» dall'altra
   parte della boa. Insieme, l'ordine del Tab: il percorso dopo il contenuto
   nel DOM, o fuori dalla sequenza fino al primo pannello.

La testata del sito vero (bianca, con il marchio) la porterà da sé la
costruzione in `site/`: qui si segnala solo perché il mock non la mostra.

### Il punteggio, nella forma di taste

```
ROUND 1
Seen in one second: la carta nautica con la costruzione arancione, e il titolo bianco.
Idea (one sentence): la Home è un esercizio di carteggio che si traccia da solo, sulla costa che si scorre.
Live thing: il faro e la boa, che si toccano e dicono la sigla; «Rivedi il triangolo delle correnti».
Layout words by section: p0=manifesto / p1=riga+carta / p2=riga+carta / … / p10=riga+carta
Scores: design 6.5 · usability 7 · creativity 8.5 · content 7 → overall 7.1
Caps applied: un FAIL dell'ispettore e un titolo su tre o più righe → 6.0 (e 6.5);
  due o più schermi quasi vuoti → design non oltre 6.5 (già applicato).
Top three problems:
1. pannelli 1–10 identici e vuoti — taste-p1-1280x800.jpg — una scena per pannello, prima il p8
2. il p8 promette faro e boa che non ci sono — taste-p8-1280x800.jpg — faro e boa nel suo tratto
3. h1 su quattro righe con «volta.» sola — taste-p0-1280x800.jpg — 560 px e balance
```

Senza i tetti il mock vale **7,1**, cioè vicino ai siti premiati dalla giuria
di taste per idea (8,5) e sotto per costruzione dei pannelli dopo il primo. Con
i tetti di taste vale **6,0**, quasi tutto per il titolo: corretto quello, il
tetto sale a 6,5 finché restano i pannelli vuoti.

## 6. La tabella

| Difetto | Chi l'ha trovato | Regola nostra | Standard | Contraddice una nostra regola? | Gravità | Che cosa farne |
|---|---|---|---|---|---|---|
| Il p8 dice «tocca il faro o la boa» e non ci sono | misura (script), giudizio | nessuna | — | no | P1 | **diventa una regola** (D-36, sotto) e si corregge |
| Pannelli 1–10 uguali e quasi vuoti | taste (critique, pass 9 e 11) | I-30, punti 2–4 (proposti) | — | no | P2 | correggere nel giro B (I-30); il p8 subito |
| h1 su quattro righe, parola sola in fondo | taste `headline-lines`, misura | R-RIF-23 (corpo), nessuna sulle righe | — | no | P2 | **diventa una regola** (D-37) e si corregge |
| Tab: il percorso prima dell'azione principale | misura (script) | R-VOLTO-05 | WCAG 2.4.3 | no | P1 | correggere; lo vede T-15:fuoco, segnalato a P-101 |
| Etichette della carta sopra linee e altre etichette | giudizio (§2.7, domanda 6) | nessuna | — | no | P2 | correggere (ritocco) |
| Costruzione sotto il velo a 1280×1024 | giudizio, già nell'analisi del 28 | R-VOLTO-03 | WCAG 1.4.3 | no | P2 | correggere; lo misura T-15:velo |
| Barca tagliata dal bordo a 1280×800 | giudizio | nessuna | — | no | P3 | ritocco |
| Testata crema e senza marchio | taste `palette-cream`, giudizio | `PRODUCT.md`, marchio fermo | — | no | P3 | la porta il sito |
| Velo in gradiente | taste `gradient` | volto, decisione 14 | — | sì | — | **scartato**, riga nel registro |
| Etichetta sopra i numeri della prova | taste `eyebrow` (pagina) | R-RIF-24 | — | sì | — | **scartato**, riga nel registro |
| Contenuto «a sinistra», carta non contata | taste `off-centre` | volto (U) | — | sì | — | **scartato**, riga nel registro |

**Due regole proposte**, ciascuna con il suo controllo (metodo del §3 di
`regole-disegno-progetto.md`); decide l'autore, e i numeri D-36 e D-37 sono
provvisori:

- **D-36 — una frase che indica un oggetto della carta lo trova sullo schermo.**
  Un pannello che dice «tocca il faro», «la boa», «sulla carta» ha quell'oggetto
  visibile nel suo schermo mentre è il pannello corrente. *Controllo:* nel banco
  della Home a pannelli, per ogni pannello che nomina una luce, almeno un
  `[data-luce]` di quel tipo ha il rettangolo dentro la finestra e un
  `elementFromPoint` che lo restituisce, a 1280×800 e 1920×1080. *Rottura:* la
  luce lasciata solo nel pannello 0.
- **D-37 — un titolo non finisce con una parola sola, e l'h1 della Home sta in
  tre righe al più**, alle misure sopra la soglia della U. È la regola
  `headline-lines` di taste presa a metà: due righe a 56 px con questo titolo non
  ci stanno. *Controllo:* in T-13, le righe di ogni titolo visibile contate con
  Range sui nodi di testo, e l'ultima riga con almeno due parole. *Rottura:* la
  colonna del titolo a 480 px.

## 7. Righe per il registro dei disaccordi (§3 della procedura)

Proposte; le scrive in `docs/procedure-disegno.md` chi ha la penna, con il sì
dell'autore.

| Regola della skill | Che cosa dice | Da noi | Stato proposto |
|---|---|---|---|
| taste `gradient`, sul velo della Home a pannelli | niente gradienti, salvo una scrim sopra una fotografia | il velo fa da scrim sopra la carta, che sta al posto della fotografia; lo misura R-VOLTO-03 sui pixel | **Eccezione motivata dal soggetto** |
| taste `eyebrow`, su un'etichetta sopra dei valori | niente occhielli sopra i titoli | «La prova d'esame dei quiz» sopra 20 · 30′ · 4 è un'etichetta di valori, che taste stesso ammette nelle schermate d'app | **Non si applica** a un'etichetta di valori; resta vietato sopra un titolo |
| taste `off-centre`, `few-pictures` sulla Home al computer | il contenuto tutto da un lato; quattro fotografie | la carta in SVG è il contenuto della metà destra, e taste non la conta | **Non si applica** alla Home con la carta |
| taste `headline-lines` | al più due righe | proposta D-37: al più tre per l'h1 della Home, mai una parola sola | **Adottata in parte**, se l'autore accoglie D-37 |

## 8. Che cosa non è stato controllato

Nessuna persona; Safari; un iPad e il gesto vero sulle luci; un lettore di
schermo; le prestazioni del vento e dello strato fisso; il contrasto sui pixel
dietro ogni testo (R-VOLTO-03), che misura il banco e non taste; i testi, che
l'autore aveva messo da parte nell'analisi del 28 e che qui si toccano solo dove
non corrispondono all'immagine (il pannello 8). Nessuna critique di impeccable,
nessun controllo dei dark pattern: il mock non chiede scelte oltre «Simula» e
«Accedi».

## 9. Le decisioni dell'autore, 29 ottobre 2026

Proposte così:

1. Il pannello 8: faro e boa nel suo tratto di costa, o un testo diverso?
2. D-36 e D-37 diventano regole con il loro controllo?
3. Le quattro righe del registro (§7).
4. I pannelli 1–10: la miniatura e la costa di I-30 nel giro B, o restano la
   rotta che scende, accettando che siano schermi di respiro?

Decise dall'autore lo stesso giorno («non mettere faro e boa, si cambia testo.
solo d-37. ok registro disaccordi. per i pannelli e cosa mettere, aspettiamo la
sessione dedicata»):

1. **Il pannello 8 cambia testo**: faro e boa restano nel pannello 0. Il testo
   lo scrive chi ha la penna sui testi dei pannelli.
2. **D-36 (l'oggetto nominato sta sullo schermo) non si adotta. D-37 sì**, e
   prende il numero libero: è **D-36** nella scheda I-27 di
   `docs/idee-dopo-gli-account.md`. Il suo controllo è da scrivere.
3. **Le quattro righe del registro** sono nel §3 di `docs/procedure-disegno.md`.
4. **Che cosa mettere nei pannelli 1–10** lo decide la sessione dedicata.

Dove sopra si legge «D-37», la regola adottata è D-36; dove si legge «D-36»,
è la proposta scartata.
