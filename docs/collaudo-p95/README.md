# P-95 — la scala nella pagina

24 ottobre 2026 · ripresa da `25ea918` su `ui/main` · versione 0.34.0 invariata.

La candidata del primo giro è stata recuperata dopo la verifica dello SHA-256
registrato sotto. La ripresa usa il contratto aggiornato di R-RIF-28: distanze
nello stesso strato e, con un dialogo aperto, solo dentro il dialogo.
Il motivo del fermo e la sua risoluzione sono nel §10.1 di
[regole-disegno-progetto.md](../regole-disegno-progetto.md).

## Prima e dopo per l'autore

Sono state guardate tutte le 24 immagini del confronto seguente. Le dodici
`prima-` mostrano `3a96f29`: il canonico è identico in `25ea918`, che cambia
il controllo e i documenti. Le dodici `finale-` mostrano la pagina corretta.
Le immagini `dopo-` più sotto appartengono invece al primo tentativo interrotto.

Chrome headless, senza account, viewport CSS 375×812 e 1280×800,
Manrope effettivamente caricato. Home senza risposte; Allenati sul segmento
Quiz; Esame con il modulo chiuso; preparazione del solo quesito base-1293
ricercato per il numero 1.8.1-5; runner dopo una risposta errata; riepilogo
aperto con «Termina l’attività». Le catture attendono la risposta registrata,
non il solo clic, e partono dallo scorrimento zero.

| Superficie | Prima, 375×812 | Dopo, 375×812 | Prima, 1280×800 | Dopo, 1280×800 |
|---|---|---|---|---|
| Home H0 | [prima-home-375.png](prima-home-375.png) | [finale-home-375.png](finale-home-375.png) | [prima-home-1280.png](prima-home-1280.png) | [finale-home-1280.png](finale-home-1280.png) |
| Allenati · Quiz | [prima-allenati-375.png](prima-allenati-375.png) | [finale-allenati-375.png](finale-allenati-375.png) | [prima-allenati-1280.png](prima-allenati-1280.png) | [finale-allenati-1280.png](finale-allenati-1280.png) |
| Esame | [prima-esame-375.png](prima-esame-375.png) | [finale-esame-375.png](finale-esame-375.png) | [prima-esame-1280.png](prima-esame-1280.png) | [finale-esame-1280.png](finale-esame-1280.png) |
| Runner dopo errore | [prima-runner-375.png](prima-runner-375.png) | [finale-runner-375.png](finale-runner-375.png) | [prima-runner-1280.png](prima-runner-1280.png) | [finale-runner-1280.png](finale-runner-1280.png) |
| Riepilogo con errore | [prima-riepilogo-375.png](prima-riepilogo-375.png) | [finale-riepilogo-375.png](finale-riepilogo-375.png) | [prima-riepilogo-1280.png](prima-riepilogo-1280.png) | [finale-riepilogo-1280.png](finale-riepilogo-1280.png) |
| Preparazione per numero | [prima-preparazione-375.png](prima-preparazione-375.png) | [finale-preparazione-375.png](finale-preparazione-375.png) | [prima-preparazione-1280.png](prima-preparazione-1280.png) | [finale-preparazione-1280.png](finale-preparazione-1280.png) |

Le colonne di testo da 480 px sono state mantenute: a 1280 px la Home
conserva il rapporto con l’illustrazione, Allenati ed Esame conservano i
contenitori larghi, mentre i paragrafi vanno a capo prima; nel riepilogo la
colonna è unica e centrata. L'approvazione visiva dell'autore resta da fare
su queste immagini, come prevede la decisione C. Non è stata richiesta una
larghezza diversa.

## Realizzazione e revisione

Un solo `:root` dichiara corpi, spazi, pesi, interlinee, larghezza e colori.
Le dichiarazioni CSS, gli attributi HTML e gli stili generati dagli script
usano la scala, con l'arrotondamento C. Il corpo delle risposte è 16 px;
40 px resta soltanto sull'h1 della Home sopra 900 px. I titoli di sezione
sono a 24 px, senza maiuscolo sistematico; le preparazioni e il contesto
del runner hanno un h1. Il marchio desktop usa il corpo 16 del testo per
non introdurre un sesto corpo nelle superfici compatte; i titoli della Home
con risposte usano 24 come gli altri h2.

Paragrafi, elenchi, domanda e risposte hanno una larghezza massima di
480 px; le risposte restano a 16 e la domanda a 19. Le note di conservazione
fuori dai paragrafi usano 14, con parole, ruolo e posizione accanto all’avvio
invariati. Nessuna nota è stata accorciata o nascosta. Il grassetto lungo del
Carteggio è limitato a «Sei tu a giudicare:»; i nomi di tema sui pulsanti
usano il minuscolo per non creare etichette maiuscole su più righe.

La barra, il footer e le azioni dell’invito hanno distanze esplicite. Nei
Segnali l’avvio precede le modalità, che restano subito sotto: il corpo 16
dell’introduzione non spinge più Inizia dietro la barra a 375×667.
La barra mobile conserva una riga geometrica per l'area sicura, senza
trasformarla in uno spazio editoriale. Nessuna nuova eccezione numerica.
La tabella «Valori fuori scala» resta identica.

Il riepilogo dei quiz è una superficie `position:fixed` autonoma sotto la testata;
i fratelli che costituiscono domanda e controlli del runner diventano
`visibility:hidden` quando il risultato dei quiz è aperto. Nel runner dei quiz non restano
controlli precedenti visibili o focalizzabili sotto la superficie del risultato.
Lo sfondo dei dialoghi Info e Accedi conserva la propria presentazione:
l'esperimento con opacità zero è stato eliminato.

Non cambiano funzioni condivise di selezione, contabilità o navigazione.
I soli cambi negli script sono i token di presentazione nelle stringhe HTML.
Non sono stati modificati motore, server, test, dati, versione o tag.
Le quattordici dichiarazioni di difetto T-13/scala-css sono rimosse insieme
alla correzione; i gruppi girano per intero.

## Verifica conclusiva

Le [misure finali di T-13](misure-finali.json) registrano 36 combinazioni
superficie/larghezza: massimo 72 caratteri per riga a 1280 px, al più cinque
corpi nel primo schermo, Home H0 a 77 parole e distanza minima di 8 px fra
bersagli confrontabili. Il file include lo SHA-256 del canonico misurato.


Il primo giro completo ha dato 42 rossi su 3.849, tutti nei tragitti N-01
H0/H1/HA a partire dalla consegna degli esercizi su carta. La regola che
nasconde i fratelli del riepilogo era stata estesa anche al Carteggio:
impediva al banco di completare la sua consegna a due tocchi e i tragitti
successivi restavano sulla superficie precedente. L'estensione al Carteggio
e ai Segnali è stata rimossa; posizione fissa autonoma e occultamento dei
fratelli restano soltanto sul riepilogo dei quiz, dove servono a T-13.
T-13 e i tre gruppi N-01 dei tragitti sono poi verdi, 84/84.
Esito conclusivo, sul canonico: **3.849/3.849** verifiche dell'interfaccia,
con T-13, scala CSS, T-12, T-10, T-11, C-02, T-06 e tutte le parti N-01 verdi.
Prima dell'ultimo avvio la 8620 è stata osservata libera per **90,170 s
consecutivi**, 85 campioni, dalle 17:04:23 alle 17:05:53 CEST.
Motore 215/219, con quattro salti previsti; dati 225; specifica 1.096;
server 89/89 con Node 25.3.0 di sistema e 89/89 con Node 24.22.0 LTS.
L'archivio ufficiale `node-v24.22.0-darwin-arm64.tar.gz`, già scaricato per
P-93, è stato riutilizzato dopo un nuovo confronto SHA-256 con
`SHASUMS256.txt` e riestratto in una cartella temporanea dedicata:
`6a9724d9b50a5f22b4816cded441b5a8d9ddae546191a5e5b7efa5a5e2ee26d5`.
Guardiano e controllo condiviso della documentazione verdi.

La revisione contro i criteri di P-95 passa: scala unica e valori calcolati,
gerarchia dei titoli, interlinee, pesi, distanze nello stesso strato, ruoli
dei colori, larghezza del testo e tetto delle parole; regressioni del giro 1
verificate dalla suite intera. L'approvazione visiva della decisione C resta
all'autore. La specifica R-RIF-23…30 va allineata dalla regia dopo la merge.
Versione invariata; nessun tag, push o modifica alla produzione.

Limiti: Chrome senza account per le schermate; nessuna prova con persone,
Safari o dispositivo Apple reale. I test con account mantengono il proprio
perimetro; non equivalgono a una revisione visiva degli stati con account.
Tema scuro, legali e carattere del marchio restano fuori da questo giro.
Le 24 immagini sono viewport, non prove dell'intero contenuto della banca.

## Storia del fermo e della candidata precedente

La sezione seguente conserva il collaudo del primo tentativo, antecedente
alla correzione del banco su main. I suoi esiti rossi e i riferimenti al
canonico ripristinato descrivono quel momento, non la pagina finale sopra.

### Primo tentativo: confronto interrotto sul controllo delle distanze

24 ottobre 2026 · base `3a96f29` · `ui/main` · versione 0.34.0.

Il punto di arresto e la richiesta per main stanno nel §10.1, Giro 2, di
[regole-disegno-progetto.md](../regole-disegno-progetto.md).
Queste schermate **non sono una consegna approvabile**: `dopo-` rappresenta
una candidata incompleta con difetti ancora aperti. Il canonico è stato
ripristinato alla base e le dichiarazioni di difetto sono intatte.

Chrome headless, senza account, viewport CSS e pixel delle immagini
375×812 e 1280×800, Manrope caricato (`document.fonts.check` vero).
Sito locale servito con `strumenti/serve.py`. Home senza risposte; per la
preparazione si cerca il numero 1.8.1-5 e si apre il solo base-1293; runner
dopo una risposta errata, riepilogo dopo «Termina l’attività». La guardia
contro i doppi tocchi è rispettata aspettando la risposta registrata.
Le prime catture senza risposta sono state scartate e sostituite.
Tutte le immagini della tabella sono state guardate.

| Superficie | Prima, 375×812 | Candidata, 375×812 | Prima, 1280×800 | Candidata, 1280×800 |
|---|---|---|---|---|
| Home H0 | [prima-home-375.png](prima-home-375.png) | [dopo-home-375.png](dopo-home-375.png) | [prima-home-1280.png](prima-home-1280.png) | [dopo-home-1280.png](dopo-home-1280.png) |
| Allenati · Quiz | [prima-allenati-375.png](prima-allenati-375.png) | [dopo-allenati-375.png](dopo-allenati-375.png) | [prima-allenati-1280.png](prima-allenati-1280.png) | [dopo-allenati-1280.png](dopo-allenati-1280.png) |
| Esame | [prima-esame-375.png](prima-esame-375.png) | [dopo-esame-375.png](dopo-esame-375.png) | [prima-esame-1280.png](prima-esame-1280.png) | [dopo-esame-1280.png](dopo-esame-1280.png) |
| Runner dopo errore | [prima-runner-375.png](prima-runner-375.png) | [dopo-runner-375.png](dopo-runner-375.png) | [prima-runner-1280.png](prima-runner-1280.png) | [dopo-runner-1280.png](dopo-runner-1280.png) |
| Riepilogo con errore | [prima-riepilogo-375.png](prima-riepilogo-375.png) | [dopo-riepilogo-375.png](dopo-riepilogo-375.png) | [prima-riepilogo-1280.png](prima-riepilogo-1280.png) | [dopo-riepilogo-1280.png](dopo-riepilogo-1280.png) |
| Preparazione per numero | [prima-preparazione-375.png](prima-preparazione-375.png) | [dopo-preparazione-375.png](dopo-preparazione-375.png) | [prima-preparazione-1280.png](prima-preparazione-1280.png) | [dopo-preparazione-1280.png](dopo-preparazione-1280.png) |

Il confronto mostra i titoli di sezione a 24 px, le risposte a 16 px, il
40 della sola Home desktop e le colonne di lettura a 480 px. La colonna del
riepilogo è più stretta del contenitore precedente; nella preparazione il
contenitore e il pulsante restano larghi, mentre i paragrafi hanno il limite.
Il giudizio visivo preliminare non richiede un altro valore di larghezza.
Non sostituisce l'approvazione dell'autore né il collaudo conclusivo.

La candidata ha ancora difetti: la barra mobile ha link che sporgono di
5 px, alcuni paragrafi restano piccoli e alcuni controlli si toccano.
L'esperimento di sfondo trasparente dei dialoghi non è una soluzione
consegnata. Nessuno di questi difetti viene attribuito al controllo.

Le immagini specifiche della diagnosi sono:

- [Home ferma: la porta è dietro la barra](diagnosi-distanze-home-375.png).
- [Home dopo lo scorrimento: la porta è raggiungibile](diagnosi-distanze-home-375-scorrimento.png).
- [Viewport, rettangoli e bersaglio in primo piano](diagnosi-distanze-home-375.json).

T-13 confronta tutti i rettangoli visibili al CSS, anche se coperti.
Nella diagnosi `elementFromPoint(55,810)` individua «Home», mentre il
rettangolo della porta sottostante passa per lo stesso punto.
Il rimedio proposto per il banco è nel piano e non è stato implementato qui.

Misure sulla candidata, non sul canonico ripristinato: quattro verifiche
statiche della scala verdi; T-10 5/5, T-11 2/2, T-12 12/12. T-13 visita
36 combinazioni superficie/larghezza, massimo 72 caratteri per riga,
al più cinque corpi nel primo schermo, Home H0 a 77 parole. Testo, spazi
e distanze restano rossi. Nessuna esecuzione delle cinque suite complete,
nessuna osservazione della 8620 per 90 s per un collaudo conclusivo.

Candidata temporanea: `/private/tmp/rg-p95/index-candidata.html`, SHA-256
`9f224f8c66df4b075cfb2ccaef6b8ec507d17b8cc1db816beb05659391ef9a5f`.
Esiti mirati: `/private/tmp/rg-p95/esiti-gruppi.json`; script di acquisizione
e diagnosi nella stessa cartella. Questi file sono fuori dal repo e possono
sparire a un riavvio. La ripresa deve verificarli prima di usarli.
Guardiano e controllo condiviso della documentazione verdi dopo il
ripristino del canonico. Nessun account reale o servizio esterno modificato;
niente commit o push.
