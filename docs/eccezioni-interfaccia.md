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
| app.html | 8 | `.brand-tag` | Il payoff sotto il marchio. Lo corregge l'area 1, che rifà l'header |
| app.html | 6 | `.brand-tag` | Lo stesso payoff sotto i 650 px, cioè **sul telefono**. Area 1 |
| app.html | 10 | `.eyebrow` | L'etichetta sopra il titolo; è anche il pattern «hero SaaS» segnalato dall'audit. Aree 1 e 2 |
| app.html | 9 | `.rotta-intro .eyebrow` | Come sopra, nella Rotta. Area 1 |
| app.html | 9 | `.recommend-card .eyebrow` | Come sopra, nella proposta. Area 1 |
| app.html | 10 | `.cart-route-card small` | Sottotitolo della tessera Carteggio. Area 1 |
| app.html | 10 | `.progress-stat span` | Etichette del riepilogo. Area 1 |
| index.html | 10 | `.logo .payoff` | Il payoff nella vetrina, che non è in nessuna delle sei aree: la corregge la sessione dedicata, in parallelo |

## Testi alternativi generici

`alt=""` è corretto per un'immagine decorativa affiancata da un testo
equivalente. Un alt **generico** è peggio di nessuno: dichiara che c'è
un'immagine e non dice quale.

| file | alt | perché è ancora qui |
|---|---|---|
| app.html | `figura` | L'unica riga che inserisce le 102 figure del decreto, su 119 quesiti: per un lettore di schermo quei quesiti restano senza contenuto. Il testo alternativo va preso dal quesito, non inventato. Area 3, il runner |

## Funzioni del motore che la pagina non consuma

Il gemello del controllo sugli orfani. Una funzione che la pagina consumava e non
consuma più va tolta **anche da questo elenco**, nello stesso commit che la
toglie dalla pagina, e il commit dice perché. Quello che non va bene è che
sparisca in silenzio.

*Nessuna, al momento: la pagina consuma tutte e trentatré.*
