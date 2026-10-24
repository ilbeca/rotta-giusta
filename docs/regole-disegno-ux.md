# P-93 — L’avviso una volta e l’avvio nel primo schermo

24 ottobre 2026 · `ui/main`, allineato con `git merge --ff-only main` a
`9f0f256` · versione 0.33.0 invariata.

## Perimetro e risultato

Il giro 1 di [regole-disegno-progetto](regole-disegno-progetto.md), §4,
§10.1 e decisioni A, B, E e F del §11, applica I-27. L’avviso della prova
non è più nella Home o nel segmento Carteggio: la Home conserva la frase
dell’introduzione e perde anche il doppione «Tutte le attività…». In ogni
preparazione la frase sta immediatamente prima dell’azione, come nota senza
bordo. Nei Segnali riguarda i punteggi. Nessun invito è stato tolto.

Esame mostra prima le quattro prove. Sotto, il modulo chiuso ha un sommario
con abilitazione, conseguimento e data effettivi, oppure «Non l’hai detto».
Le porte del Carteggio precedono materiali e aiuti. L’avvio dei quiz precede
le opzioni, che restano aperte e leggibili; nelle preparazioni su carta
restano visibili giudizio personale,
condizioni, numero e carte, con assunzioni, materiali e opzioni più sotto.
Il riconoscimento apre sul titolo, senza scorrere fino alla spiegazione.
Il fondo pieno dell’invito nel riepilogo diventa secondario, anche a 1280 px.

Gli agganci sono quelli del contratto: `data-ruolo="principale"`,
`data-ruolo="avviso"`, `data-prep="chiudi"` anche su «Cambia attività» dei quiz.
Le undici righe T-12 dichiarate rosse escono da
[eccezioni-interfaccia](eccezioni-interfaccia.md) con la correzione.
Nessun file di motore, test, dati o versione modificato.

Chiamanti verificati per le funzioni condivise:
`dipingi()` aggiorna Esame in avvio, navigazione e ricezione dell’account;
il sommario consuma le stesse scelte confermate e la stessa data del modulo.
`dipingiPreparazioneCart()` è usata da `dipingiCart()`, `scegliCarteggio()` e
`avviaCart()` quando la selezione cambia; i cambi delle opzioni tornano da
`scegliCarteggio()`: distribuisce gli stessi paragrafi tra introduzione
e approfondimenti, senza cambiare la lista. `azioniRiepilogo()` serve
`htmlRiepilogo()` e dichiara il ruolo dell’azione già scelta.
`invitoAccount()` serve i riepiloghi di quiz, carteggio e Segnali: in tutti
il pulsante per creare un account è secondario, con testi e destinazioni
invariati. La selezione del motore e la contabilità non cambiano.

## Metodo

Chrome headless con il protocollo e il banco già presenti nel repository;
sito servito da `strumenti/serve.py`, copia iniziale conservata prima delle
modifiche. Senza account, banche dei quiz, del carteggio e delle tecniche
caricate prima di aprire le porte. Le prime acquisizioni anticipate del
carteggio sono state scartate: mostravano una preparazione con zero esercizi
prima del caricamento. Le misure sotto vengono dalle acquisizioni ripetute.

Rettangoli CSS letti con `getBoundingClientRect()` a scorrimento zero, dopo
il caricamento dei caratteri; schermate guardate a 375×667, 375×812 e
1280×800: **72 schermate** del confronto prima/dopo. Sono compresi Home
H0/H1 e riepilogo con una risposta errata.
Nel riepilogo le coordinate sono quelle della sua superficie in primo piano;
non quelle del runner rimasto sotto. I controlli T-12 misurano anche il centro
con `elementFromPoint`, la distanza dall’avviso, il contrasto e i bersagli.
Script, JSON, log e PNG grezzi restano nella cartella temporanea `rg-p93`,
fuori dal repo. Nessun pannello esterno o account reale toccato.

## Coordinate verticali, in px CSS

Gli intervalli sono `top–bottom`, arrotondati al pixel. Nelle dieci superfici
iniziali le coordinate sono identiche alle due altezze del telefono: le
tabelle 375 valgono separatamente per **375×667 e 375×812**. La barra fissa
inizia a 598 px nel telefono da 667; l’avvio dei Segnali termina a 596 px,
interamente sopra la barra.

| Superficie a 375 px | Azione prima | Azione dopo | Avviso prima | Avviso dopo |
|---|---:|---:|---:|---:|
| Home H0 | 543–595 | 411–463 | 393–513 | assente |
| Esame (prima prova) | 923–995 | 230–303 | assente | assente |
| Carteggio (prima porta) | 1056–1128 | 370–442 | 248–369 | assente |
| Segnali | 804–856 | 544–596 | 248–322 | 494–531 |
| Simulazione base | 867–919 | 502–554 | 779–854 | 415–490 |
| Allenamento breve | 433–485 | 432–484 | 345–420 | 345–420 |
| Scegli un argomento | 1045–1097 | 502–554 | 958–1033 | 415–490 |
| Prova di carteggio | 898–950 | 511–563 | assente | 424–499 |
| Esercizi su carta | 977–1029 | 379–431 | assente | 292–367 |
| Che tecnica serve? | 811–863 | 354–406 | 119–263 | 267–342 |

| Superficie a 1280×800 | Azione prima | Azione dopo | Avviso prima | Avviso dopo |
|---|---:|---:|---:|---:|
| Home H0 | 503–555 | 416–468 | 398–473 | assente |
| Esame (prima prova) | 917–981 | 256–320 | assente | assente |
| Carteggio (prima porta) | 967–1031 | 378–442 | 286–360 | assente |
| Segnali | 693–745 | 480–532 | 286–337 | 449–467 |
| Simulazione base | 682–734 | 417–469 | 632–669 | 368–405 |
| Allenamento breve | 371–423 | 371–423 | 321–359 | 321–359 |
| Scegli un argomento | 834–886 | 417–469 | 784–822 | 368–405 |
| Prova di carteggio | 630–682 | 380–432 | assente | 330–368 |
| Esercizi su carta | 747–799 | 317–369 | assente | 268–305 |
| Che tecnica serve? | 656–708 | 316–368 | 155–229 | 267–304 |

Per Home H1 l’azione e l’avviso hanno le stesse coordinate di H0 nelle tre
misure, prima e dopo. Nel riepilogo con un errore «Riprova questo quesito»
resta a 499–548 px a entrambe le altezze del telefono e a 376–424 px sul
desktop. La frase di conservazione del riepilogo resta a 797–862 px sul
telefono (raggiungibile scorrendo) e 494–538 px sul desktop: R-ACC-02 non è
stata tolta. Il secondo pulsante pieno dell’invito era a 790–839 px sul
desktop; ora ha stile secondario. L’invito della Home H1 resta sotto il primo
schermo, a 1227–1276 px sul telefono e 953–1002 px sul desktop.


Le coordinate orizzontali dopo la correzione sono `left / width`, in px:

| Superficie | Azione a 375 | Avviso a 375 | Azione a 1280 | Avviso a 1280 |
|---|---:|---:|---:|---:|
| home | 16 / 343 | assente | 101 / 516 | assente |
| esame | 16 / 343 | assente | 101 / 526 | assente |
| carteggio | 16 / 343 | assente | 101 / 1064 | assente |
| segnali | 16 / 343 | 16 / 343 | 101 / 1064 | 101 / 572 |
| sim | 37 / 301 | 37 / 301 | 208 / 850 | 208 / 572 |
| breve | 37 / 301 | 37 / 301 | 215 / 850 | 215 / 572 |
| argomento | 37 / 301 | 37 / 301 | 208 / 850 | 208 / 572 |
| prova | 19 / 301 | 19 / 301 | 25 / 800 | 25 / 572 |
| esercizi | 19 / 301 | 19 / 301 | 25 / 800 | 25 / 572 |
| tecnica | 37 / 301 | 37 / 301 | 208 / 850 | 208 / 572 |

Prova funzionale aggiuntiva: scegliendo «Solo motore», «Prima patente» e
12 dicembre 2026, poi richiudendo il modulo, il sommario mostra
«Stai preparando: motore, prima patente · esame il 12 dicembre».
La schermata è stata guardata a 375×812.

## Parole della Home e limite del giro 1

A 375×812, Home H0: **99 parole prima, 78 dopo**. Il conteggio considera i
nodi di testo con lettere, il rettangolo del genitore visibile che interseca
il viewport, senza barra e intestazione: lo stesso criterio del banco
dell’audit citato in I-27, senza copiarne il codice nel repository. Non è un
conteggio delle sole righe completamente libere dalla barra. **78 è il tetto
misurato del giro 1** (decisione E), non la stima 80 né la soglia 60 del giro 3.
La riscrittura delle schede della Home e dei limiti resta al giro 3.

## Controlli

La controprova iniziale sulla pagina vera produce le undici verifiche T-12
rosse dichiarate; T-12:principale, C-02 e T-06 sono verdi. Dopo la correzione **32/32** verifiche dei gruppi T-12, C-02 e T-06 sono
verdi per intero sulla pagina vera.

Il primo giro completo ha trovato due rossi di N-01:cronologia: il nome
dell’argomento scelto era nascosto dentro il dettaglio della configurazione.
Le opzioni sono rimaste aperte sotto l’avvio; la seconda misura T-12 resta
verde senza aggiungere un gesto. Nessun contratto o controllo cambiato.
Nel secondo giro completo N-01 è verde, ma due controprove sulla pagina di
riferimento non riconoscono il loro difetto: «l’archivio di prima cancellato
all’uscita» e «l’avviso è fuori dallo schermo». Entrambe erano verdi nel
primo giro. Il giro finale è stato eseguito senza altre acquisizioni Chrome in
parallelo; non si attribuisce una causa a questi due esiti dal solo risultato.

La revisione dei rettangoli ha corretto anche il margine effettivo dei modi
nei Segnali: modificare solo il margine dell’avvio non lo spostava, perché
collassava con quelli vicini. La tabella riporta la misura finale, con il
pulsante interamente libero dalla barra.

Esiti finali e controlli completi sono registrati nel CHANGELOG della P-93.

I limiti del collaudo restano quelli del progetto: Chrome, senza account,
nessuna prova con persone o Safari reale; nessuna pubblicazione. Il giro 2
resta responsabile della scala tipografica, degli spazi e delle distanze.

## Esito finale prima del commit

- Interfaccia: **3612/3612**, in **341,1 s**, dopo la 8620 osservata libera
  per **91,0 s**. T-12, C-02, T-06 e N-01 verdi per intero; verdi anche le
  due controprove fallite nel secondo giro. Non si assume da questo che
  la causa dei due rossi intermedi sia stata il carico della macchina.
- Le 22 verifiche in meno rispetto alle 3634 di P-92 sono le due verifiche
  del riferimento per ciascuna delle undici dichiarazioni eliminate
  (`test_rifinitura_provata_al_contrario`); nessuna verifica esclusa.
- Motore: **215/219**, quattro skip previsti; dati: **225**;
  specifica: **1064**; server: **89/89** con Node 25.3.0 e **89/89** con
  Node 24.22.0, scaricato da nodejs.org e verificato con `SHASUMS256.txt`.
- Guardiano, documentazione e `git diff --check` verdi; nessun cambiamento
  in `tests/`, `server/`, `site/engine.js`, `site/dati/` o `VERSION`.
- Versione invariata, nessun push, tag, rilascio o accesso alla produzione.
