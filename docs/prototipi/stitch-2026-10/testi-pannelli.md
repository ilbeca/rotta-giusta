# I testi degli 11 pannelli della Home — proposta

> **Superato il 29 ottobre 2026** da [`argomenti-pannelli.md`](argomenti-pannelli.md):
> l'autore ha deciso 6 pannelli, e i testi validi sono quelli. Questo file resta
> per il metodo e le misure; il suo §6 («tutti i numeri di R-VOLTO-08 ci sono»)
> vale per 11 pannelli e non più.

**Data:** 29 ottobre 2026. **Che cos'è:** una proposta da far decidere
all'autore, pannello per pannello, con il perché di ogni scelta, la fonte di
ogni numero e la lunghezza misurata. Il riferimento è uno solo, il prototipo
[`carta-corretta/index.html`](carta-corretta/index.html) con la sua
[analisi](analisi-2026-10-28.md). Il prototipo **non è stato toccato**: i testi
stanno in una copia, [`testi-prova/index.html`](testi-prova/index.html), con le
fotografie in [`testi-prova/schermate/`](testi-prova/schermate/). Le correzioni
al prototipo le fa P-100, dopo il sì dell'autore; la pagina vera P-102.

La copia si apre come il prototipo, servendo la radice del repo:
`python3 -m http.server <porta>`, poi
`/docs/prototipi/stitch-2026-10/testi-prova/?ridotto`. Con `&stato=h1`,
`&stato=ha` o `&stato=errore` si vedono gli altri stati; con `&pannello=p7` si
apre su un pannello.

## 0. Le regole che i testi seguono

- **La voce** di `docs/filosofia.md`: la verità prima della rassicurazione,
  l'autorità sta nel decreto, nessuna promessa che il sito non misura. Niente
  stima, niente spiegazioni promesse, nessun voto sulla preparazione («pronto»,
  percentuali, «livello»).
- **Senza account**, la frase della conservazione non sta nella Home (decisione A
  del giro 1, R-RIF-21, anche parafrasata); la si dice accanto a «Inizia». Nella
  Home senza risposte (H0) **nessun invito a registrarsi** (R-ACC-03): il pannello
  dell'account descrive, non invita.
- **Le regole di scrittura di I-23** e le D-01…D-35 di I-27: una parola per
  significato, niente gergo nostro («banca», «quesito», «oscurato», «decreto»,
  «sblocchi», «ufficiale», «Mirata»), frasi al più di 25 parole (D-04), indice
  Gulpease almeno 60 (D-06), pulsanti che cominciano con un verbo e dicono dove
  portano (D-10, D-11), una cosa una volta per schermata (D-08), una sola azione
  piena per schermata (D-12), al più quattro cose da toccare nel primo schermo
  (D-13, R-RIF-22).
- **D-36, adottata dall'autore il 29 ottobre 2026** (dal parere di taste,
  `analisi-taste-2026-10-29.md` §9): un titolo non finisce con una parola sola, e
  il titolo principale della Home al computer sta in tre righe al più. Qui vale
  per tutti i titoli dei pannelli, alle due misure.
- **Il glossario scelto qui**, perché la stessa cosa non abbia tre nomi:
  *domanda* (non quesito, non quiz) per la singola domanda; *quiz base* e *quiz
  vela* per le prove; *argomento* (non tema, non voce); *risposta esatta* (non
  ufficiale, non ministeriale) e *del Ministero* (non del decreto); *mai viste*
  (non mai incontrate, non nuove); *da rifare* come in Progressi.
- **I nomi decisi** restano: «Simula il quiz base», «Allenati con 10 domande»
  (mai «Prova con dieci domande» né «Allenati con dieci domande»), «Con
  l'account, le risposte restano» (decisione 12), Home · Allenati · Esame ·
  Progressi.
- **Ogni numero viene dalla banca o dal motore** (sotto, per ognuno, da dove),
  e si scrive con il punto delle migliaia: **1.722**, **1.472**. Il punto non lo
  mette `toLocaleString('it-IT')`, che sotto le cinque cifre non raggruppa: va
  scritto con una funzione che lo faccia sempre.

## 1. Come è stato misurato

La lunghezza è misurata nella copia, in Chrome, con il movimento ridotto (tutto
il testo visibile da subito): per ogni pannello, dove comincia il primo elemento
del testo e dove finisce l'ultimo, in pixel dall'alto del pannello. Un pannello
**entra** se il testo sta fra la testata (64 px) e il fondo dello schermo — al
telefono, fra la testata e la barra in basso.

**Al computer (1280×800)** la disposizione è quella del prototipo, com'è:
colonna di 480 px, titolo principale a 56 px, titoli a 32, testo a 16.

**Al telefono (375×812)** il prototipo **non ha una disposizione**: misurato
com'è, il titolo va su sei righe, il pannello iniziale arriva a 794 px su 812 e
i triangoli del percorso passano sopra il testo. Per misurare i testi la copia
ha una disposizione **minima, mia, non una proposta di disegno**: testata di 64
px, barra in basso di 64 px, margine di 16 px a sinistra e di 68 a destra
(per il percorso), quindi una colonna di **291 px**; titolo principale a 32 px,
titoli a 24, testo a 16, numeri della prova a 32. Lo spazio per il testo va da
64 a 748 px. Se P-100 o P-102 scelgono un'altra disposizione, le misure al
telefono vanno rifatte; il testo più corto qui sotto lascia margine.

**Il riassunto delle misure** (in px dall'alto del pannello; ✓ entra):

| Pannello | 375×812 H0 | 1280×800 H0 | 375×812 H1 | 375×812 HA | 375×812 errore | 375×667 H0 |
|---|---|---|---|---|---|---|
| 1 · La prova d'esame | 128–676 ✓ | 125–731 ✓ | 95–717 ✓ | 116–688 ✓ | 155–657 ✓ | 56–603 ✗ |
| 2 · Tutte le domande | 194–618 ✓ | 286–578 ✓ | = | = | 306–506 ✓ | 122–545 ✓ |
| 3 · La simulazione | 264–548 ✓ | 301–563 ✓ | = | = | 318–494 ✓ | 191–476 ✓ |
| 4 · Allenamento breve | 309–503 ✓ | 340–524 ✓ | = | = | = | 237–430 ✓ |
| 5 · Allenamento consigliato | 283–529 ✓ | 321–543 ✓ | = | = | 306–506 ✓ | 211–456 ✓ |
| 6 · Un argomento | 278–534 ✓ | 320–544 ✓ | = | = | 301–511 ✓ | 206–461 ✓ |
| 7 · Gli errori | 309–503 ✓ | 340–524 ✓ | = | = | = | 237–430 ✓ |
| 8 · Il carteggio | 203–609 ✓ | 305–559 ✓ | = | = | 214–598 ✓ | 130–537 ✓ |
| 9 · Fanali e segnali | 298–514 ✓ | 340–524 ✓ | = | = | = | 225–442 ✓ |
| 10 · L'esame, in ordine | 255–557 ✓ | 309–555 ✓ | = | = | = | 182–485 ✓ |
| 11 · Con l'account | 305–491 ✓ | 343–505 ✓ | = | 298–514 ✓ | = | 233–418 ✓ |

Al computer negli altri stati: H1 140–724 ✓, HA 113–743 ✓, errore 174–690 ✓.
Nessuno sbordamento orizzontale (larghezza del documento uguale alla finestra) a
375 e a 1280.

**A 375×667** (un telefono piccolo, o uno grande con la barra di Safari: le
regole D-01 lo misurano) entrano i pannelli 2–11 in tutti gli stati; il primo
**no**, salvo con le domande che non si caricano (82–585): senza risposte manca
per 8 px (56–603), con risposte e con l'account non entra (23–644, 44–615). Con
il sottotitolo corto della decisione 2 (§5) entra anche H0.
Il compito chiedeva 375×812 e 1280×800, che passano; 375×667 è detto perché è
il limite vero.

**La leggibilità**, sul testo che si vede in H0, con la formula di D-06: fra 64
e 87 in tutti i pannelli (un calcolo approssimato, sul testo estratto) (il più basso è «Un argomento alla volta», 64, per i
nomi degli argomenti); nessuna frase oltre le 24 parole. Negli stati d'errore i
testi sono di una o due frasi corte, dove l'indice dice poco.

**D-36, misurata** con le righe vere di ogni titolo (`__titoli()` nella copia,
che conta le parole riga per riga con un Range): nessun titolo finisce con una
parola sola, a 375×812 e a 1280×800, nei quattro stati; il titolo principale
sta in tre righe anche a 1920×1080. Per i titoli dei pannelli serve
`text-wrap: balance` (nella copia c'è, sui soli h2 e h3): senza, cinque titoli
lasciano l'ultima parola da sola — «La simulazione, come all'esame» alle due
misure, «Con l'account, le risposte restano» a 1280, «Tutte le domande
dell'esame» e «Il carteggio, sulla carta vera» a 375. Il bilanciamento non
serve al titolo principale, che anzi peggiora («nautica, un / passo alla
volta»), e non salva un titolo di due parole che va a capo: è il caso di
«L'allenamento consigliato» al telefono, cambiato (pannello 5). Il CSS è di
P-100 e P-102; `text-wrap: balance` c'è in Chrome e in Safari dalla 17.5.

## 2. Gli 11 pannelli

Per ogni pannello: il ruolo, il nome nel percorso (il nome accessibile del suo
triangolo), il titolo, il testo, l'azione, la fonte dei numeri, il perché, e
un'alternativa dove la scelta non è ovvia. I testi sono quelli della copia, in
H0 (la Home senza risposte e senza account); gli altri stati sono nel §3.

### Pannello 1 — La prova d'esame

**Ruolo.** Dire che cos'è il sito e far partire la prova in un tocco (§7.1, H0).
**Nel percorso:** «La prova d'esame».

- **Titolo (h1):** La patente nautica, un passo alla volta.
- **Sottotitolo:** Quiz e carteggio per la patente senza limiti dalla costa, a
  motore e a vela. Gratis.
- **Scheda:** *La prova d'esame dei quiz* — **20** domande · **30** minuti ·
  **4** errori ammessi — pulsante pieno **Simula il quiz base** — «La correzione
  arriva alla fine, come all'esame.»
- **Sotto la scheda:** link **Allenati con 10 domande**, e «Con la correzione
  dopo ogni risposta.»

**Fonti.** 20, 30 e 4: `meta.prove.base` (`n`, `minuti`, `errori_max`). Il 10
del link: `preparaBreve().quanti` (che è 10 finché il quiz base ha almeno dieci
domande; il nome resta «Allenati con 10 domande» come deciso).

**Perché.** «Preparati alla patente nautica, un passo alla volta.», il titolo
della Home pubblicata, al computer va su quattro righe con «volta.» da sola: non
passa D-36. Senza «Preparati» sta in tre righe, «La patente / nautica, un passo
/ alla volta.», al computer e al telefono, e dice la stessa cosa. Il sottotitolo aggiunge «a motore e a vela» e «Gratis»: nella
lettura da fuori del 20 ottobre (I-23) due lettori su cinque hanno creduto che
il sito fosse per la patente entro 12 miglia, e «Gratis» è stato capito da
tutti e cinque. **«30» e non «30′»**: con «minuti» sotto, l'apice dice la
stessa cosa due volte. **«errori ammessi» e non «errori al più»**: «4 / errori
al più» si legge al contrario. Il breve sta qui come seconda azione, in link e
non in pulsante, perché la regola D-12 vuole un solo pulsante pieno; con il
pulsante, il link, il faro e la boa le cose da toccare sono quattro, il limite
di D-13.

**Alternative.**
- «La patente nautica, passo dopo passo.»: tre righe da due parole, anche lei
  dentro D-36.
- Il sottotitolo corto, «Quiz e carteggio per la patente senza limiti dalla
  costa. Gratis.»: misurato, fa entrare il pannello anche a 375×667, ma perde «a
  motore e a vela» (decisione 2).
- «Simula il quiz» al posto di «Simula il quiz base»: l'autore gli ha detto sì
  il 20 ottobre (I-23, decisione 2), ma non è mai entrato nella pagina, e i
  controlli leggono «Simula il quiz base». Consiglio di tenere «base»: la vela ha
  la sua simulazione, e il pulsante apre quella del base (decisione 3).

### Pannello 2 — Tutte le domande dell'esame

**Ruolo.** Che cosa c'è dentro, e che cosa non torna. Nel prototipo questo
pannello era «Come funziona» e spiegava i triangoli («Scendi lungo la rotta…»).
**Nel percorso:** «Tutte le domande».

- **Titolo:** Tutte le domande dell'esame
- **Testo:** Le **1.722** domande che il Ministero usa per l'esame: **1.472**
  del quiz base e **250** della vela, ognuna con la sua risposta esatta.
- **Testo:** Quello che non torna, lo diciamo. **37** domande il Ministero le
  ha tolte dall'esame nel 2024: qui restano, e lo dicono prima che tu risponda.
  In **4** una nota, dopo la risposta, dice dove la norma è cambiata o la
  risposta sembra sbagliata: all'esame vale quella del Ministero. A **1** manca
  la figura.
- **Azione:** link **Leggi i limiti uno per uno** → Profilo → Info, aperto sui
  limiti (`data-info-section="difetti"`).

**Fonti.** 1.722: le domande caricate (`S.banca.length`); 1.472 e 250: per
banca (`k`), uguali a `meta.stats.quiz_base` e `quiz_vela`. 37: `osc`. 4: `nb`
(tre citano il DM 133/2024, una è il quesito dei flap, base-405). 1: `fm`
(base-59).

**Perché.** I difetti dichiarati sono la cosa che distingue il sito
(specifica §2.5): stanno «in prima pagina invece che in una nota». La Home
pubblicata li ha in un riquadro in fondo, «I limiti, detti prima», che nella
lettura da fuori ricordava solo chi legge tutto. Qui hanno un pannello, il
secondo, e parole semplici: **«tolte dall'esame»** al posto di «oscurate» (che
nessun lettore ha capito), **«del Ministero»** al posto di «del decreto». Il
testo che spiegava i triangoli esce: descriveva il congegno della pagina, e
«scendi» lo dice già il pannello che scatta (I-22: niente regole nostre in
schermata).

**Che cosa non dice, di proposito.** «11 divergono dal DM 133/2024», come il
README: otto di quelle undici sono anche fra le 37 tolte, e la banca porta la
nota solo sulle tre che restano all'esame. Dire 37 e 4 conta ogni domanda una
volta, e si conta dalla banca.

**Alternativa.** Tenere «Come funziona» (con il testo del prototipo) e mettere i
limiti nel pannello 10 o in fondo all'11. Sconsiglio: i limiti finirebbero dove
non arriva quasi nessuno, ed è il difetto di oggi (decisione 1).

### Pannello 3 — La simulazione, come all'esame

**Ruolo.** Che cos'è la simulazione, oltre a quello che dice già la scheda del
pannello 1. **Nel percorso:** «La simulazione».

- **Titolo:** La simulazione, come all'esame
- **Testo:** Ogni argomento ha le domande che ha all'esame: **4** di
  navigazione, **4** di manovra, **3** di sicurezza, e così via. Le **37** tolte
  dall'esame non escono.
- **Testo:** Per la vela: **5** domande in **15** minuti, al più **1** errore.
- **Azione:** link **Simula il quiz base**.

**Fonti.** 4, 4, 3: `meta.pesi_esame` (Navigazione, Manovra, Sicurezza), che è
l'Allegato C al DM 323/2021; 37: `osc`, esclusi da `simulazione()` (R-SEL-01);
5, 15, 1: `meta.prove.vela`.

**Perché.** Il prototipo ripeteva qui «20 domande in 30 minuti, al più 4
errori. Nessuna correzione durante la prova» — le stesse parole della scheda
del pannello 1, un pannello sopra. Questo pannello dice le due cose che la
scheda non dice e che rendono la simulazione «come all'esame»: la stessa
composizione per argomento e le domande tolte che non escono. E la vela, che
nella Home non compare altrove con le sue condizioni.

### Pannello 4 — Un allenamento breve

**Ruolo.** L'allenamento breve. **Nel percorso:** «Allenamento breve».

- **Titolo:** Un allenamento breve
- **Testo:** Sono **10** domande del quiz base, prima quelle che non hai mai
  visto. Dopo ogni risposta vedi se è giusta e qual è quella esatta. Ti fermi
  quando vuoi.
- **Azione:** link **Allenati con 10 domande**.

**Fonti.** 10: `preparaBreve().quanti` (`coda()` sul base, poi
`estraiNuoviPrima()` a dieci: da qui «prima quelle che non hai mai visto»).

**Perché.** Il titolo del prototipo, «Dieci domande, con la correzione»,
scriveva in lettere il numero che il pulsante scrive in cifre: due nomi per una
cosa (è il problema noto della Home pubblicata, «Prova con dieci domande»). Il
titolo nuovo dice che cos'è, il numero sta una volta nel testo e una nel nome
deciso. «la tua accanto a quella del decreto» diventa «se è giusta e qual è
quella esatta»: niente «decreto», e dice quello che si vede. «Ti fermi quando
vuoi» è vero: «Termina» apre il riepilogo delle risposte date.

**Alternativa.** «Dieci domande, con la correzione», il titolo del prototipo.

### Pannello 5 — L'allenamento consigliato

**Ruolo.** L'allenamento consigliato. **Nel percorso:** «Allenamento
consigliato».

- **Titolo:** L'allenamento che consigliamo
- **Testo:** Sono **25** domande del quiz base. All'inizio sono domande mai
  viste; quando hai risposto, entrano anche alcune che hai sbagliato. Ogni
  domanda dice perché è lì.
- **Azione:** link **Apri l'allenamento consigliato**.

**Fonti.** 25: `selezioneQuiz('mirata').lista.length`, la stessa selezione che
apre la preparazione (misurato: 25 con la pagina vuota). Non «fino a 25»: il
numero è quello della lista, e quando la lista è più corta il numero scende.

**Perché del titolo.** «L'allenamento consigliato», il nome dell'attività, al
telefono va a capo e lascia «consigliato» da solo: due parole che vanno a capo
non si bilanciano (D-36). «L'allenamento che consigliamo» va su due righe con
due parole in fondo, e dice la stessa cosa; il pulsante tiene il nome,
«Apri l'allenamento consigliato».

**Perché del testo.** È il difetto noto della Home pubblicata: «scelti dalle tue risposte»
detto anche a chi non ha risposto. Il motore, senza risposte, sceglie solo
domande mai viste, pesate su quanto rendono all'esame; con le risposte aggiunge
i richiami degli errori (al più un quinto) e le conferme. Il testo dice le due
fasi senza promettere di più. «Alcune» e non «al più 5»: il 5 è un conto
interno del motore (`quotaRichiami`), che il motore non espone, e chi disegna
non ricalcola.

**Alternativa.** «All'inizio sono domande mai viste, di più negli argomenti che
rendono di più all'esame»: più preciso, più difficile. La preparazione lo dice
comunque domanda per domanda.

### Pannello 6 — Un argomento alla volta

**Ruolo.** «Scegli un argomento». **Nel percorso:** «Un argomento».

- **Titolo:** Un argomento alla volta
- **Testo:** Scegli uno o più argomenti, del quiz base o della vela. Navigazione
  e manovra portano **4** delle **20** domande ciascuna, motori e teoria dello
  scafo **1**.
- **Testo:** Puoi tenere solo le domande mai fatte, o solo quelle con la figura.
- **Azione:** link **Scegli un argomento**.

**Fonti.** 4 e 1: `meta.pesi_esame`; 20: `meta.prove.base.n`.

**Perché.** Il peso degli argomenti è un fatto del decreto e aiuta a scegliere
da dove cominciare, senza dirlo al posto di chi studia: il «vale la pena
cominciare da lì» della U era un consiglio, e i consigli li dà `dovePesa()` solo
con abbastanza risposte (§10 del progetto del volto). I due filtri esistono e
sono locali a questa attività (R-NAV-05).

### Pannello 7 — Gli errori, da ripassare

**Ruolo.** «Ripassa gli errori». **Nel percorso:** «Gli errori».

- **Titolo:** Gli errori, da ripassare
- **Testo:** Riapri le domande che hai sbagliato, a cominciare da quelle che
  sbagli ancora. Dopo un errore puoi segnare perché: non lo sapevi, o è stata
  una svista.
- **Azione:** link **Ripassa gli errori**.

**Perché.** «Gli errori tornano», il titolo del prototipo, dice che tornano da
soli; dalla 0.5.1 non è vero (§10 del progetto del volto): si riaprono qui, e
alcuni entrano nell'allenamento consigliato. «A cominciare da quelle che sbagli
ancora» è l'ordine di `coda({ soloSbagliate })`: prima chi ha l'errore ancora
aperto. I due tag sono «Non lo sapevo» e «Svista» (decisione 15 di P-59).

**Alternativa.** «Ripassa gli errori» come titolo, uguale all'azione (D-10 lo
ammette: lo stesso verbo nel titolo e nel pulsante).

### Pannello 8 — Il carteggio, sulla carta vera

**Ruolo.** Che cos'è il carteggio, per chi non lo sa, e dove si allena. È qui
anche il comando che rifà il disegno sulla carta. **Nel percorso:** «Il
carteggio».

- **Titolo:** Il carteggio, sulla carta vera
- **Testo:** All'esame si comincia da qui, ed è la prova da superare per andare
  avanti: **4** esercizi sulla carta nautica in **60** minuti, almeno **3**
  giusti.
- **Testo:** Qui trovi i **135** esercizi del Ministero, sulle carte **5/D** e
  **42/D**. Li fai al tavolo, con la carta, le squadrette e il compasso; poi
  metti la tua risposta accanto a quella esatta, e giudichi tu.
- **Azioni:** link **Apri il Carteggio**; pulsante di contorno **Rivedi
  l'esercizio sulla carta** (rifà l'animazione del pannello 1).

**Fonti.** 4, 60, 3: `PROVA_CARTEGGIO` (`esercizi`, `minuti`, `soglia`), dal DM
323/2021 art. 6 c. 6. 135: gli esercizi caricati (`S.cart.length`). 5/D e
42/D: le carte di `meta.argomenti_carteggio`.

**Perché.** Nella lettura da fuori solo un lettore su cinque, quello che l'ha
aperto, ha capito che cos'è il carteggio e che non si fa sul telefono. Il
pannello dice le tre cose che chi comincia da zero non sa (specifica §1): è la
prima prova, va superata per andare avanti, e si fa al tavolo con le carte, che
vanno comprate. Non dice «eliminatoria» né «ti fermi lì»: il DM 323/2021 dice
che le prove sono «propedeutiche alla sua prosecuzione», e
`docs/ricerca-programma-esame.md` §4.3 avverte che «eliminatoria» è una
parafrasi; «la prova da superare per andare avanti» dice la stessa sostanza con
le parole del decreto. «Sei tu a giudicare» resta, con parole più semplici. «Rivedi il
triangolo delle correnti» diventa «Rivedi l'esercizio sulla carta»: chi
comincia non sa che cos'è il triangolo delle correnti, e il disegno è un
esercizio.

**Alternativa.** Senza le carte («sulle carte 5/D e 42/D»): una riga in meno, ma
è la cosa che costa scoprire tardi.

### Pannello 9 — Fanali e segnali

**Ruolo.** Il gioco dei Segnali, che è extra banca e lo dichiara (§7.7).
**Nel percorso:** «Fanali e segnali».

- **Titolo:** Fanali e segnali
- **Testo:** Un gioco con **53** segnali: fanali di notte, segnali di giorno,
  suoni nella nebbia e in manovra. Non sono domande dell'esame: servono a
  riconoscerli a colpo d'occhio.
- **Azione:** link **Apri i Segnali**.

**Fonti.** 53: `E.SEGNALI.length` (27 fanali, 9 diurni, 9 nebbia, 8 manovra:
le quattro famiglie nominate sono `SEGNALI_MODI`).

**Perché.** «53 segnali da riconoscere» del prototipo non diceva che sono un
gioco nostro e non domande d'esame: la specifica vuole che lo dichiari. Non si
scrivono i conti per famiglia: il 27 è proprio il numero sbagliato della U
(«27 fanali e segnali»).

**Il faro e la boa, decisi dall'autore il 29 ottobre 2026.** Il prototipo
diceva anche «Sulla carta ogni luce ha la sua sigla: tocca il faro o la boa per
leggerla», ma sul pannello 9 il faro e la boa non ci sono: stanno sul primo
tratto di costa, e la carta scorre di un pannello alla volta (guardato in una
fotografia a 1280×800; l'ha trovato anche il parere di taste, §5). L'autore ha deciso: «non mettere faro e boa, si cambia testo». La frase
esce, e il pannello dice solo i Segnali. Le luci restano toccabili nel primo
pannello, dove si vedono; la loro sigla la dice la scheda che si apre.

### Pannello 10 — L'esame, in ordine

**Ruolo.** Che cosa c'è in Esame, e in che cosa è diverso da Allenati.
**Nel percorso:** «L'esame, in ordine».

- **Titolo:** L'esame, in ordine
- **Testo:** In Esame trovi le prove nell'ordine in cui le sostieni: carteggio,
  quiz base, quiz vela, ognuna con le condizioni dell'esame. Le prepari quando
  vuoi, anche in un altro ordine.
- **Testo:** Lì dici anche che cosa prepari, solo motore o anche vela, e la data
  dell'esame, se ce l'hai.
- **Azione:** link **Apri Esame**.

**Perché.** Nella lettura da fuori nessuno dei cinque lettori ha saputo dire la
differenza fra Allenati ed Esame, e nessuno ha aperto Esame. Il pannello dice
che cosa ci trovi e che cosa ci fai (la scelta di che cosa prepari e la data,
§7.9). «Senza sblocchi», gergo nostro, diventa «Le prepari quando vuoi, anche
in un altro ordine». La data è detta facoltativa («se ce l'hai»), come per
R-STA-01.

### Pannello 11 — Con l'account, le risposte restano

**Ruolo.** Che cosa dà l'account, senza invitare (decisione 12; R-ACC-03: in
H0 nessun invito). **Nel percorso:** «Con l'account».

- **Titolo:** Con l'account, le risposte restano
- **Testo:** Restano sul nostro server: le ritrovi quando torni, anche da un
  altro telefono o dal computer. E in Progressi vedi, argomento per argomento,
  che cosa hai già visto e che cosa devi rifare.
- **Azione:** nessuna in H0 e in H1 (si accede da «Accedi», in alto).

**Perché.** Titolo deciso. Il testo dice **dove** restano, «sul nostro server»:
la filosofia vuole che il costo si dica prima, e la parola «server» qui è la
più corta che lo dica. «Vedi i Progressi» del prototipo diventa che cosa si
vede in Progressi, con le parole della mappa (mai viste, da rifare): è il
vantaggio vero, e nella lettura da fuori nessun lettore lo immaginava.
«Telefono o computer» al posto di «dispositivo».

## 3. Gli stati che il prototipo non disegna

### H1 — con risposte, senza account

Cambia solo il pannello 1 (decisione 11 del volto: attività e invito nel primo
pannello, R-VOLTO-09). Per farlo entrare al telefono:

- **escono** il sottotitolo, il link al breve (c'è nel pannello 4) e i tre
  numeri della scheda (ci sono nel pannello 3 e nella preparazione): la scheda
  tiene il titolo, il pulsante e la nota;
- **Le attività di questa pagina** (link al riepilogo vero): **12** risposte, in
  **2** allenamenti.
- **Conserva le risposte.** — «Con l'account le ritrovi quando torni, anche da
  un altro dispositivo. Restano sul nostro server, in chiaro: il titolare può
  leggerle per supporto e statistiche.» — **Conserva le risposte** · **Continua
  senza account**, tutti e due di contorno.

**Fonti.** 12 e 2: `riepilogoPagina()` (risposte per tipo, attività).

**Perché.** Con i testi decisi dell'invito (§4 di `ridisegno-progetto.md`: «Hai
{N} risposte in questa pagina. Con l'account puoi ritrovare quelle accolte dal
server…» e «Le risposte saranno legate alla tua email…») il pannello è alto
**856 px** a 375×812, su 684 disponibili. Il testo proposto unisce le due frasi,
tiene tutto quello che dicono (dove, in chiaro, chi le legge e perché) e dice il
numero una volta sola, nelle attività. I pulsanti sono di contorno perché il
pannello ha già il suo pulsante pieno (D-12). Misurato: 76–736 a 375×812,
111–753 a 1280×800. A 375×667 non entra.

**Il conflitto da decidere** (decisione 4). Anche così, al computer il primo
pannello in H1 ha **sei** cose da toccare (pulsante, attività, due pulsanti
dell'invito, faro, boa) contro le quattro di D-13 e R-RIF-22, che T-12 misura
anche «dopo una risposta». L'alternativa: in H1 l'invito va nel pannello 11, che
parla già dell'account, e nel pannello 1 resta solo «Le attività di questa
pagina». Così entra tutto anche a 375×667, i bersagli tornano quattro, e
l'invito sta dove si parla di account; ma cambia la decisione 11 e R-VOLTO-09,
e l'invito si vede solo scendendo fino in fondo.

### HA — con l'account

Cambia il pannello 1 (senza sottotitolo, che a chi ha l'account non serve più) e
il pannello 11.

- **Pannello 1, sotto la scheda:** *L'allenamento consigliato* — «**25**
  domande: **3** da rifare, **22** mai viste.» — link **Apri l'allenamento
  consigliato**; poi «Ultima simulazione: **17** su **20**, superata, il **27
  ottobre**.» Senza simulazioni: «Non ci sono simulazioni salvate.»
- **Pannello 11:** titolo **Le tue risposte restano** — «Sono nel tuo account,
  sul nostro server: le ritrovi da qualunque telefono o computer in cui entri.
  In Progressi vedi, argomento per argomento, che cosa hai già visto e che cosa
  devi rifare.» — link **Vedi i Progressi**.

**Fonti.** 25, 3, 22: la lista di `selezioneQuiz('mirata')` e il motivo di ogni
domanda (`perche`: «richiamo», «mai visto», «conferma»). Contare i motivi della
lista è leggere quello che il motore ha dato, ma un export che li conti sarebbe
più pulito (nota per la regia). 17, 20, superata, la data: l'ultima prova da
`sessioni(…, { confine: 'attivita' })` e la sua riga `_t:'s'`. I numeri della
copia sono di esempio.

**Perché.** È la HA del §7.1 («la proposta con il suo perché», «Simula il quiz
base», «l'ultima simulazione», «Vedi i Progressi»). «Vedi i Progressi» sta nel
pannello 11 e non nel primo: nel primo, al computer, le cose da toccare
sarebbero cinque. «Superata» è l'esito di quella prova, non un voto sulla
preparazione. Misurato: 97–707 a 375×812, 84–772 a 1280×800 (stretto: 16 px di
margine). La testata con l'account dice «Account» e non «Accedi» (§5.2): la
copia non lo cambia.

### Le domande non si caricano

Quando l'elenco delle domande non risponde (o mentre si carica), nessun numero
che ne dipende si scrive, e la pagina lo dice (§8, R-VOLTO-09):

- **Pannello 1, in cima:** avviso «Le domande non si caricano. Controlla la
  connessione e ricarica la pagina.» La scheda perde i numeri; «Simula il quiz
  base» è spento; il link al breve esce.
- **Pannello 2:** «Le domande non si caricano: adesso non possiamo contarle, e
  non scriviamo numeri a memoria.»
- **Pannello 3:** «Le domande non si caricano, e con loro le condizioni della
  prova.»
- **Pannello 5:** «Quante sono, lo diciamo quando le domande si caricano. Ogni
  domanda dice perché è lì.»
- **Pannello 6:** resta la prima frase, senza i pesi.
- **Pannello 8:** se non si caricano gli esercizi di carteggio, esce la frase
  con il 135; le condizioni della prova vengono dal motore e restano.
- **Durante il caricamento:** «Stiamo caricando le domande…» al posto di ogni
  numero, senza tessere vuote.

**Perché.** «Ricarica la pagina» è sicuro solo qui: senza domande non si è potuto
rispondere, quindi una ricarica non perde niente. Una formula sola, «Le domande
non si caricano», in tutti i pannelli; «l'elenco non risponde», della prima
stesura, aveva l'indice di leggibilità sotto 60. Il 53 dei Segnali viene da
`engine.js`, che carica con la pagina: resta. Misurato: 136–676 a 375×812,
144–720 a 1280×800.

## 4. I testi della carta e delle luci

**Le due luci** (la scheda che si apre toccandole, in testo vero):
- **Faro · Lam.(2) BRV 10s** — «Due lampi ogni 10 secondi. Il colore dice in che
  settore sei: di solito nel bianco si passa, il rosso e il verde coprono un
  pericolo.»
- **Boa cardinale est · Sc.(3) 10s** — «Tre scintillii ogni 10 secondi, poi
  buio. Coni con le basi unite, nero giallo nero: il pericolo è a ovest, si
  passa a est.»

Rispetto al prototipo: il nome di ciò che si tocca in testa («Faro», «Boa
cardinale est»), perché la sigla da sola non dice che cosa si sta guardando;
**«di solito»** sul bianco, perché il significato dei settori lo dà la carta di
ogni faro (il faro è di fantasia, analisi §1); i coni e i colori della boa, che
sono la metà di quello che serve per riconoscerla. **Da verificare
dall'autore**: la notazione («Lam.(2) BRV 10s», con il punto e l'ordine BRV, e
«Sc.(3) 10s») e le due frasi, che sono didattiche (§10 del progetto del volto).
Fotografia: `luce-faro-1280x800.jpg` — dove si vede anche che la scheda del
faro copre la sigla della boa: è di P-100.

**Il comando del movimento**, in alto: **Ferma il movimento** / **Riprendi il
movimento** (ferma le luci e il vento insieme). La decisione 10 diceva «Ferma
le luci» nella scheda, e R-VOLTO-07 lo cerca con quel nome (nota per la regia).

**Il nome della carta** per chi non la vede (oggi è `aria-hidden`):
«Carta illustrativa: un faro a settori, una boa cardinale est e un esercizio di
carteggio con corrente e vento, che dà la prua da tenere.» La carta è
decorazione con un contenuto; un nome corto la rende leggibile anche a un lettore
di schermo.

**Le scritte del disegno** (10:00, «Rv 165°», «Dc 075° · Vc 2,0 kn», «Rs 184° ·
Vp 6,0 kn», «Ve 5,7 kn», 11:00, «vento da W: Sc −5°», «Pv = Rs − Sc = 189°»,
«2,0 kn», N, 184°, le lettere B R V) sono calcolate nel prototipo, e restano. Al
telefono sono troppo piccole, come nella Home pubblicata: la carta ha 14 unità
di corpo su un disegno largo 1.440, che a 375×812 diventano circa **12,6 px**
(la carta scala sull'altezza, 0,90). Proposta per P-100 e P-102: al telefono le
sigle del faro e della boa almeno a 14 px veri; le altre scritte possono restare
piccole perché la scheda le dice in testo.

## 5. Le decisioni per l'autore

1. **Il secondo pannello: «Tutte le domande dell'esame», con i limiti, al
   posto di «Come funziona».** *Raccomandazione:* sì. I limiti sono la cosa che
   ci distingue, e «Come funziona» spiegava i triangoli.
2. **Il titolo principale e il sottotitolo.** Il titolo di oggi non passa D-36;
   la proposta è «La patente nautica, un passo alla volta.» (o «La patente
   nautica, passo dopo passo.»). Il sottotitolo: «…senza limiti dalla costa, a
   motore e a vela. Gratis.», o il corto «…senza limiti dalla costa. Gratis.»,
   che fa entrare il primo pannello anche a 375×667. *Raccomandazione:* il
   titolo proposto e il sottotitolo lungo; il corto se i telefoni piccoli
   contano di più di «a motore e a vela».
3. **«Simula il quiz base» o «Simula il quiz».** *Raccomandazione:* «Simula il
   quiz base», com'è nella pagina e nei controlli.
4. **Dove sta l'invito con risposte senza account.** (a) Nel primo pannello,
   come la decisione 11, con il testo accorciato del §3: sei cose da toccare al
   computer e non entra a 375×667. (b) Nel pannello 11, con nel primo solo «Le
   attività di questa pagina». *Raccomandazione:* (b), che rispetta il limite
   delle quattro scelte e mette l'invito dove si parla dell'account; costa la
   decisione 11 e R-VOLTO-09.
5. **Il testo dell'invito**, se resta nel primo pannello: quello accorciato del
   §3 al posto dei due paragrafi decisi nel ridisegno. *Raccomandazione:* sì;
   dice le stesse cose in una frase in meno.
6. ~~Il faro e la boa sul pannello dei Segnali.~~ *Deciso dall'autore il 29
   ottobre 2026: si cambia testo, faro e boa restano nel primo pannello.*
7. **Le carte nel pannello del carteggio** («sulle carte 5/D e 42/D»).
   *Raccomandazione:* tenerle.
8. **«Ferma il movimento» o «Ferma le luci».** *Raccomandazione:* «Ferma il
   movimento», perché ferma anche il vento.
9. **Le due frasi delle luci e la notazione delle sigle**: da verificare, sono
   didattiche.
10. **Il glossario del §0** (domanda, argomento, risposta esatta, del Ministero,
    mai viste): *raccomandazione:* adottarlo nella Home, e nel giro 3 in tutto
    il sito.

## 6. Note per la regia (P-101, P-100, P-102)

Le cose che un controllo legge o potrebbe leggere, e che questi testi cambiano.
Nessun controllo è stato toccato.

- **R-VOLTO-08 / T-15:numeri.** Nella Home ci sono tutti i numeri che il
  controllo cerca, ognuno in un pannello: quesiti 1.722 (2), esercizi 135 (8),
  segnali 53 (9), tolte 37 (2 e 3), note dopo la risposta 4 (2), senza figura 1
  (2), condizioni 20, 30, 4 (1), allenamento consigliato 25 (5), «4 delle 20
  domande» (6). Il controllo li cerca nel testo che si vede: nella Home a
  pannelli il testo di ogni pannello si vede solo scendendo.
- **«30′» diventa «30».** R-RIF-24 nomina «30′» fra i blocchi di sole cifre.
- **«Come funziona»** non c'è più come titolo: la decisione 1 del volto dà il
  corpo 44 a «Come funziona» (R-RIF-23). Il nuovo titolo del secondo pannello è
  un h2 come gli altri.
- **«Ferma il movimento»** al posto di «Ferma le luci» (R-VOLTO-07).
- **L'invito in H1**: testo accorciato e pulsanti di contorno (N-01:invito cerca
  il pulsante «Conserva le risposte» nel primo pannello e il titolo «Conserva le
  risposte.»; restano). Se l'autore sceglie (b) della decisione 4, cambiano
  R-VOLTO-09 e la decisione 11.
- **HA: i motivi dell'allenamento consigliato** («3 da rifare, 22 mai viste») si
  contano dai `perche` della lista. Meglio un conto esportato dal motore, se si
  vuole tenere la regola «chi disegna non ricalcola» alla lettera.
- **D-36** (adottata il 29 ottobre): i titoli dei pannelli passano solo con
  `text-wrap: balance` sugli h2; il titolo principale passa senza. Il suo
  controllo, in T-13, è da scrivere; `__titoli()` della copia fa la stessa misura.
- **I titoli cambiati per D-36**: il titolo principale («La patente nautica, un
  passo alla volta.») e quello del pannello 5 («L'allenamento che
  consigliamo»). Se un controllo cerca «Preparati alla patente nautica», va
  allineato.
- **Il pannello 9** non dice più «tocca il faro o la boa» (decisione
  dell'autore, 29 ottobre).
- **Il punto delle migliaia**: `toLocaleString('it-IT')` scrive «1722»; serve una
  funzione che metta sempre il punto.
- **Il nome dei triangoli** (il nome accessibile dei link del percorso): La prova
  d'esame · Tutte le domande · La simulazione · Allenamento breve · Allenamento
  consigliato · Un argomento · Gli errori · Il carteggio · Fanali e segnali ·
  L'esame, in ordine · Con l'account.
- **Il telefono**: il prototipo non ha una disposizione sotto i 900 px; le misure
  a 375 di questo documento sono su quella minima della copia (§1).

## 7. Che cosa non è stato fatto

- Nessuna lettura da fuori (I-22) su questi testi: è il passo che direbbe se si
  capiscono. Il Gulpease e le misure dicono solo che sono corti e che entrano.
- Nessuna prova su Safari o su un telefono vero; nessun lettore di schermo.
- Le misure al telefono dipendono dalla disposizione minima della copia.
- La Home pubblicata (`site/index.html`) non è stata toccata, né il prototipo.

## Le fotografie

In [`testi-prova/schermate/`](testi-prova/schermate/), tutte con il movimento
ridotto: `h0-p0`, `h0-p1`, `h0-p4`, `h0-p7`, `h0-p8`, `h0-p10` a 375×812;
`h0-p0`, `h0-p1`, `h0-p7`, `h0-p8` a 1280×800; `h1-p0`, `ha-p0` ed `errore-p0`
alle due dimensioni; `luce-faro-1280x800` con la scheda del faro aperta. Al
telefono le fotografie sono del browser della sessione, a 2×: Chrome senza
finestra non scende sotto i 500 px di larghezza, e le sue fotografie a 375 px
erano sbagliate.
