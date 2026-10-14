# P-69 — Il giro di un’attività

13–14 ottobre 2026 · passo 5 di 5 · mock, non realizzazione del sito.

Apri [il confronto degli accessi](giro.html). Il giro di studio vive sempre in
[giro-attivita.html](giro-attivita.html): [H0](giro-attivita.html?accesso=H0),
[H1](giro-attivita.html?accesso=H1), [HA](giro-attivita.html?accesso=HA).
I link dell’indice scelgono una fixture iniziale nuova; non sono passaggi del
tragitto. Dentro il giro nessuna sezione, revisione, registrazione o nota
legale cambia documento. L’unico link per il revisore apre questa nota in
un’altra scheda.

Base `114ce0d`, `ui/main`, Local, albero iniziale pulito. Verificati cartella,
ramo e altri chat: nessun altro scrivente attivo in questo worktree. Il pull
iniziale, dopo il permesso della sandbox, ha trovato il ramo senza upstream;
non è stato scelto o integrato un ramo remoto. Nessun file del prodotto,
`tests/`, versione o coda modificato. Eccezione esplicita: voce additiva nel
CHANGELOG, come richiesto dalla chiusura.

## Fonti e forma

Letti AGENTS.md, README e CHANGELOG; [tragitti P-65](tragitti.md) e le tre note
[Home](home-note.md), [attività](attivita-note.md), [Progressi](progressi-note.md);
[P-59](../../idee-dopo-gli-account.md), decisioni 9, 12, 15, 20, 21, 28 e 30,
I-07, I-10, I-14, I-16, I-17, N-01 e C-03;
[ADR-006 per intero](../../adr/ADR-006-l-invito-in-home-il-sito-che-spiega-la-costanza-e-la-stima.md);
[specifica](../../specifica.md) §4.4, §4.5, §7.5–7.7, §8 e §9.6;
[area 3](../../area-3-progetto.md) e [area 4](../../area-4-progetto.md),
soprattutto testi, consegna, confronto e giudizio rinviato;
[filosofia](../../filosofia.md), «Accompagniamo la preparazione» e
«Non ti inganniamo mai»; [forma del resoconto](../../prossime-sessioni.md#il-resoconto).
P-59 finale prevale sulle vecchie tre classificazioni dell’area 3.

La forma ereditata è quella dei passi precedenti: Manrope incorporato,
[licenza già presente](home-manrope-OFL.txt), colori, margini, barra e avatar.
La barra sparisce nel runner; l’avatar rimane. La Home, Allenati, Esame e la
voce di Progressi qui sono superfici di servizio con le porte pertinenti al
giro: non sostituiscono il confronto completo di P-66–P-68. Non sono nuovi
nomi o decisioni di prodotto; nessun PRODUCT.md o DESIGN.md fuori perimetro.

## Snapshot e stato della pagina

Generazione dalla radice:

```sh
node docs/prototipi/interfaccia-2026-10/giro-snapshot.mjs
```

Il [generatore](giro-snapshot.mjs) importa il motore del repo, legge le banche
pubbliche e scrive [giro-dati.json](giro-dati.json); aggiorna anche il blocco
incorporato nell’HTML. Giorno della fixture 13 ottobre, seme 69, SHA-256 di
motore, quiz, carta e meta. Nessun archivio personale. H0 parte vuoto, H1 ha
le dieci risposte sintetiche di P-68 (sette corrette, tre errate), HA la sua
fonte account: 326 risposte quiz più una riga di prova. H1 riapre davvero il
risultato e la revisione delle dieci righe, oltre alle attività nuove.

Le selezioni sono congelate: base 20, vela 5, Meteorologia 20, breve 10,
voce Coordinate geografiche Allena 20 / Rifai 5, giro tecniche 7, tappeto 4,
prova carta 4 e Fanali notturni 10. Provengono da `simulazione()`,
`simulazioneVela()`, `coda()`, `estraiNuoviPrima()`, `giroTecniche()`,
`tappeto()`, `provaCarteggio()` e `domandeSegnali()`; i riferimenti della voce
riusano lo snapshot P-68. Le figure disponibili sono incorporate dalla banca.

Per consentire scelte libere senza contare in pagina, il generatore produce
3.275 stati numerici (quantità 1–25, risposte/corrette), con `sessioni()` sul
confine dell’attività ed `esito()`. Ogni scelta indica la transizione da
leggere; l’HTML non somma corrette, errate o mancanti e non decide promozioni.
I frammenti di errore di ogni scelta sono prodotti da `erroriSessione()`:
l’HTML conserva quei riferimenti, nell’ordine ricevuto, senza filtrare le
risposte o applicare una seconda selezione. La Revisione usa gli stessi
riferimenti. La verifica confronta numero e lista del giro con una chiamata
**intera** a `sessioni()` / `erroriSessione()` sulle righe effettivamente
scelte: i frammenti non sono una contabilità alternativa del prodotto.

Sulla carta 2.349 combinazioni null/0/1 arrivano da `nuovaBozza()`,
`modificaBozza()`, `concludiBozza()` e `dettaglioCarteggio()`. Testi scritti e
vuoti leggono una tavola del generatore. Il browser conserva soltanto testi,
scelte e riferimenti allo stato già prodotto; non corregge stringhe o
ricostruisce una soglia. `null` non diventa un errore. Gli intervalli della
risposta ufficiale sono lasciati come nella fonte.

Il documento tiene righe, tentativi, tag, segnalibri, certezza, testi, giudizi,
origine e campi del modulo in memoria. History contiene solo `{mock: numero}`;
nessuna risposta, email o testo nell’URL o in `history.state`. Il riferimento
al tentativo è conservato nei contesti in memoria anche per Indietro/Avanti.
Nessun IndexedDB, localStorage, sessionStorage, cookie o richiesta API. Una
ricarica perde il patrimonio anonimo: il limite è dichiarato prima e dopo.
La conservazione della bozza account è **illustrata**, non implementata.

## Elementi, azioni e limiti delle promesse

| Elemento | Comportamento del giro | Che cosa non promette |
|---|---|---|
| Runner quiz | Numero ministeriale, domanda, figure, risposte ancorate al fondo; tasti 1/2/3 e A/B/C, Invio ed Esc dichiarati | Un’azione da tastiera non significa prova su screen reader o tastiera di un telefono |
| Note | `nbp` prima; `nb` dopo la risposta negli allenamenti, dopo consegna in simulazione; caso dedicato Note della banca | Una nota ministeriale o del progetto non è una nuova spiegazione verificata |
| Simulazione | Timer reale della pagina; rosso sotto cinque minuti; scadenza e consegna anche vuota, senza correzione durante la prova | Esito dell’esame vero, timer come durata dello studio o previsione |
| Base e vela | Due tentativi, risultati e timer; vela avviata solo per comando; ritorno dalla revisione base al risultato vela | Un risultato aggregato o una prova vela registrata se non iniziata |
| Consegna parziale | Allenamento con risposte → risultato parziale; zero → origine; simulazione → conferma in pagina | Le domande non affrontate non diventano errori o risposte inventate |
| Risultato quiz | Che cosa è successo, quali risposte rivedere, che cosa non è stato affrontato (§4.2 area 3); nessun voto di preparazione | Stima, «sei pronto», miglioramento, padronanza o tema debole da una lista breve |
| Revisione | Tua risposta e ufficiale, tutte/solo errori; nessuna nuova risposta dalla lettura | Riparare retroattivamente il tentativo perché il quesito ora è stato risposto bene |
| Riprova | Anteprima della lista esatta, nuovo tentativo, niente timer; caso di selezione cambiata bloccato | Ripasso dello storico, domande non risposte o selezione aggiornata di nascosto |
| Tag | Non lo sapevo / Svista, facoltativi, legati all’UID del tentativo | Diagnosi della causa o filtro che oggi non esiste; nessuna conversione dei vecchi L/C |
| Segnalibro | Un gesto in memoria per aggiunta/rimozione; ultimo gesto visibile | Una modifica alla banca o una persistenza anonima |
| Certezza | Ero sicuro / Avevo un dubbio solo dopo una giusta, facoltativi | Uso nella stima, efficacia validata o dato inviato al server |
| Segnalazione | Indirizzo visibile e riferimento copiabile, anche con fallback selezionabile | Mail inviata: `indirizzo-da-scegliere@example.invalid` è un segnaposto dichiarato, la scelta resta all’autore |
| Spiegazione | Struttura fissa: perché giusta, perché l’altra inganna, fonte, data, versione; dopo risposta/ dopo consegna | Testo didattico: è **finto**, senza una tesi nautica; anche «verificata il 13 ottobre 2026» e MOCK-1 sono finti. Nessuna verifica dell’autore è avvenuta |
| Carteggio | Testi liberi, posizioni accessibili, prova 60 minuti, confronto ministeriale e giudizio personale; nessuna spiegazione finta sulla carta | Correzione automatica, tolleranza calcolata o procedimento giusto perché il risultato coincide |
| Giudizio rinviato | Confronto riapribile, testi e giudizi provvisori intatti; nessuna riga definitiva prima della conclusione | Terzo esito, esercizio fatto o invito a salvare risposte autovalutate ancora inesistenti |
| Bozza account | Comando di ripresa dichiaratamente simulato: stessa lista, posizione, testi e scadenza; nessun nuovo timer | Salvataggio reale sul dispositivo, server o ripresa su un altro dispositivo |
| Carta senza account | Avviso prima/durante/dopo; conferma browser su uscita con testo; memoria intatta nel giro | Resistere alla ricarica; il comportamento del browser su uscita non è stato provato su telefono fisico |
| Allenamento carta | Giro e tappeto: risultati scritti, vuoti, coincidenti e da rivedere; revisione | Soglia, promozione o voto di preparazione |
| Segnali | Partita e riepilogo separati, scena notturna e colori di contenuto; righe quiz intatte | Banca ministeriale, copertura, esito d’esame o archivio delle singole risposte. Migliore/giocate del prodotto non sono salvati dal mock |
| Invito | Dopo azioni del Risultato/riepilogo; Continua senza account lo chiude; Revisione libera | «Da queste risposte possiamo proporti da dove iniziare» come vantaggio già realizzato: è dichiarato futuro P-76, come richiede ADR-006 |
| Registrazione | Modulo, legale sopra il modulo, errore/retry/rinuncia; creazione → copia → accoglimento come stati esplicitamente finti | Account o invio reali; la creazione da sola non dice «sul server» |
| Avatar e guasto | Accessibile nel runner, pallino e Info; guasto persistente dopo lettura | Guasto risolto perché si chiude Info; possibilità di aprire il sito senza rete |
| Ritorno | Home, segmento di Allenati o voce di Progressi, posizione e controllo ripristinati | Router o indirizzi profondi del sito già realizzati |

Un invito non appare nel runner, nel confronto con giudizi rinviati, nella
Revisione, nella voce di Progressi o nel pannello Segnala. L’avatar resta una
porta generica. Il modulo dice di usare credenziali finte. La sequenza di
acquisizione conserva gli UID di **tutte** le risposte della pagina, comprese
quelle iniziali di H1; nessuno stato simulato è presentato come prova su API.

## Tragitti rimisurati

[Tragitti misurati](giro-riscontri/tragitti-misurati.json): 162 associazioni
ID/larghezza per **81 ID** (01–07, 11 e 12), più due giri dalla voce di
Progressi. Le tre persone Z/F/R hanno lo stesso tragitto nell’interfaccia:
per ciascun accesso e viewport si esegue il giro canonico e si associa il
riscontro ai tre ID. Non sono 162 prove con persone o 162 giri distinti.
Ogni riga sotto ha gli stessi tocchi a 375 e 1280 px.

I tocchi comprendono le risposte quiz e il comando Avanti. Escludono lo
scorrimento, la digitazione, il lavoro sulla carta e i metadati facoltativi
(tag, certezza, segnalibro, segnalazione). I giri completi includono Risultato,
Revisione e ritorno; Segnali include il suo riepilogo e ritorno.

01: 2 fino alla domanda, **46 fino alla Home**. 02: **3 / 46**, nella variante
con i temi nel segmento; non sono diventati due tocchi all’argomento.
03: 4 / 23 con sette esercizi; 04: 5 / 18 con quattro; 05: 3 / 16;
06: 3 / 24 con dieci situazioni. Non si moltiplica una quantità ipotetica.
07 senza account: **2 / 52**, passando dal modulo a Privacy, errore di rete,
riprova del modulo, Continua senza account e ritorno. È il ramo di rinuncia,
non un account creato. HA: **2 / 48**, con due tocchi aggiuntivi per aprire e
richiudere Account: la differenza dal 46 di P-65 è esplicita.
L’acquisizione illustrata con UID invariati è provata separatamente nei
controlli finali; non è spacciata per creazione/invio reali o per il ramo
07 con errore.
11: **2 / 5** da Home, con una risposta; dal runner dopo quella risposta
**due tocchi** (Termina → ritorno), dalla Preparazione già aperta **uno**.
12 resta **1 / 2**; H1 aggiunge la revisione delle dieci righe sintetiche.

| ID P-65 | Giro eseguito | Prima domanda/esercizio/situazione | Fino al ritorno |
|---|---|---:|---:|
| F-H0-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| F-H0-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| F-H0-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| F-H0-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| F-H0-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| F-H0-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| F-H0-07 | Risultato → modulo/Account → ritorno | 2 | 52 |
| F-H0-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| F-H0-12 | Progressi → Home, risposte intatte | 1 | 2 |
| F-H1-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| F-H1-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| F-H1-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| F-H1-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| F-H1-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| F-H1-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| F-H1-07 | Risultato → modulo/Account → ritorno | 2 | 52 |
| F-H1-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| F-H1-12 | Progressi → Home, risposte intatte | 1 | 2 |
| F-HA-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| F-HA-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| F-HA-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| F-HA-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| F-HA-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| F-HA-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| F-HA-07 | Risultato → modulo/Account → ritorno | 2 | 48 |
| F-HA-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| F-HA-12 | Progressi → Home, risposte intatte | 1 | 2 |
| R-H0-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| R-H0-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| R-H0-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| R-H0-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| R-H0-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| R-H0-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| R-H0-07 | Risultato → modulo/Account → ritorno | 2 | 52 |
| R-H0-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| R-H0-12 | Progressi → Home, risposte intatte | 1 | 2 |
| R-H1-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| R-H1-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| R-H1-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| R-H1-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| R-H1-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| R-H1-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| R-H1-07 | Risultato → modulo/Account → ritorno | 2 | 52 |
| R-H1-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| R-H1-12 | Progressi → Home, risposte intatte | 1 | 2 |
| R-HA-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| R-HA-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| R-HA-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| R-HA-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| R-HA-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| R-HA-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| R-HA-07 | Risultato → modulo/Account → ritorno | 2 | 48 |
| R-HA-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| R-HA-12 | Progressi → Home, risposte intatte | 1 | 2 |
| Z-H0-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| Z-H0-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| Z-H0-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| Z-H0-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| Z-H0-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| Z-H0-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| Z-H0-07 | Risultato → modulo/Account → ritorno | 2 | 52 |
| Z-H0-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| Z-H0-12 | Progressi → Home, risposte intatte | 1 | 2 |
| Z-H1-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| Z-H1-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| Z-H1-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| Z-H1-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| Z-H1-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| Z-H1-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| Z-H1-07 | Risultato → modulo/Account → ritorno | 2 | 52 |
| Z-H1-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| Z-H1-12 | Progressi → Home, risposte intatte | 1 | 2 |
| Z-HA-01 | Simulazione base completa → Revisione → Home | 2 | 46 |
| Z-HA-02 | Meteorologia completa → Revisione → Allenati/Quiz | 3 | 46 |
| Z-HA-03 | Giro delle tecniche → Confronto → Revisione → Carteggio | 4 | 23 |
| Z-HA-04 | A tappeto → Confronto → Revisione → Carteggio | 5 | 18 |
| Z-HA-05 | Prova carta → Confronto → Revisione → Esame | 3 | 16 |
| Z-HA-06 | Fanali notturni → Riepilogo → Allenati/Segnali | 3 | 24 |
| Z-HA-07 | Risultato → modulo/Account → ritorno | 2 | 48 |
| Z-HA-11 | Una risposta breve → stop → risultato parziale → Home | 2 | 5 |
| Z-HA-12 | Progressi → Home, risposte intatte | 1 | 2 |

Porte secondarie che chiudono la consegna:

| Porta | Arrivo e ritorno rimisurati | Riscontro / limite |
|---|---|---|
| Progressi → tema → voce → Rifai → Inizia | **5 / 18**, cinque quesiti, Revisione compresa | Stessa voce, fuoco `rifai-voce`; 70 px a telefono, 0 a desktop |
| Progressi → tema → voce → Allena → Inizia | **5 / 10**, fermandosi dopo una risposta, Revisione compresa | Stessa voce, fuoco `allena-voce`; il ritorno parziale è eseguito, non un giro completo di venti |
| Esame → Base e vela | 3 alla prima domanda; due risultati e due revisioni disponibili | Avvio vela esplicito, nuovo id e timer; revisione base → risultato vela |
| Allenati/Carteggio → prova | 4 fino al primo esercizio | Stessa prova di Esame, origine diversa; rinvio e riapertura del confronto verificati |
| H1: Progressi → attività della pagina → Revisione | 3 alla Revisione; chiusure restituiscono risultato e riga in Progressi | Tua scelta e ufficiale delle dieci risposte, tre errori esatti |
| Risultato → Riprova → Inizia | 2 fino al nuovo runner | Nuovo id, lista immutata, nessun timer; vecchio tentativo intatto |
| Risultato → modulo → Privacy → modulo → risultato | Passaggi nativi con campi e risposte conservati | Nessuna navigazione fra file; l’errore non dichiara un’acquisizione |
| Runner → Avatar → Info → due chiusure | 4 | Stessa attività, risposte intatte, pallino del guasto ancora presente |
| Home → Allenati → Esame → Progressi → Home, Avatar/legale/Info | Giro eseguito in H1 | Gli stessi dieci UID prima e dopo; Indietro/Avanti non ricreano lo stato |

Le porte preparatorie non riprodotte per un altro mestiere (riconoscimento
tecniche, altre tre modalità Segnali, personalizzazione completa dei Quiz)
restano nei mock P-67 e nei loro contratti: non si dichiara qui un loro giro
completo. Questa nota completa i tragitti indicati per le attività richieste
in P-69 e distingue i tratti eseguiti da quelli della futura realizzazione.


## Browser, review e consegna

Le misure e i controlli riproducibili sono in [giro-riscontri](giro-riscontri/verifica.mjs)
e [verifica finale](giro-riscontri/verifica-finale.mjs). Sono prove del mock in
Chrome headless, con gesti nativi e confronto con il motore; non le suite del
prodotto, né una prova con persone.

La prima verifica completa dei cicli principali ha passato i due accessi,
H0/H1/HA e le due larghezze, poi ha segnalato il ritorno della voce. Il driver
centrava il pulsante con `scrollIntoView()` anche quando era già visibile:
lo scorrimento precedente al tocco non coincideva con quello di ingresso.
La diagnosi con il controllo già visibile ha misurato **70 px prima e dopo**,
fuoco `rifai-voce`, pagina `voice`. Il driver ora scorre soltanto i controlli
fuori dal viewport; misura il gesto effettivo e conserva il contesto nativo.

Il lettore dei contesti è stato completato con il riferimento al tentativo
in memoria per Indietro/Avanti; la revisione della base dopo vela restituisce
il risultato vela. La spiegazione finta ha un avviso completo nello stesso
blocco: la data non può essere letta come una verifica reale.

Impeccable: eseguito una volta sui due HTML. Avvisi sulla barra per inset e
sul testo da 11 px. Il secondo è corretto a 12 px; l’inset è fornito dalla
`.wrap`: 18 px a 375, 90 px nel riscontro di stile a 1280 (82,5 quando compare
la barra verticale da 15 px). Nessun overflow orizzontale nascosto.

**P-70:** provare con tre-cinque persone e bot sulle varianti già consegnate:
trovabilità dei temi, costo di scorrimento prima/dopo risposta, riconoscimento
di simulazione/allenamento, consegna parziale e non affrontati, due fasi,
giudizio personale e rinviato, distinzione fra nota e spiegazione nostra,
comprensione dell’invito e libertà di chiuderlo. Provare i nomi ancora aperti,
senza promuoverli per il solo esito dei bot. Misurare sul telefono fisico
Indietro/Avanti, fuoco, tastiera, zoom, Safari e accessibilità reale.

**Realizzazione:** integrare il router nel documento canonico e i selettori
completi dell’area 2; tutti i mestieri/varianti dell’inventario, compresi
riconoscimento delle tecniche e altri tre giochi di Segnali, mantengono i
contratti già progettati. Questo giro rappresenta le attività richieste dal
prompt, non sostituisce l’inventario. Collegare fonti parziali, errori di banca,
concorrenza e selezione cambiata reali; leggere i numeri da contratti del
motore, senza portare le tavole di mock nel prodotto. Provare uid e righe
prima/dopo ogni freccia, acquisizione di tutta la pagina, coda e accoglimento,
bozza account con scrittura confermata, ricarica e scadenza originaria, guasti,
uscita/scarto e altre schede. Legale canonico nel documento, non segnaposto.

**Autore:** indirizzo di segnalazione e licenza delle spiegazioni prima della
loro realizzazione; verifica di ogni testo didattico, lotto misto di 50 e
misura dell’effetto/trasferimento secondo I-16. P-69 non decide una licenza o
un recapito. Q-COSTANZA, ambito della conclusione e fasi proposte restano per
P-76, già scritti dalla regia: non sono un blocco del giro. Q-CART4 va
confermato con la scuola. Non è stata cercata una nuova regola ministeriale.

**Browser finale:** [490 misure](giro-riscontri/misure.json),
[32 misure finali](giro-riscontri/misure-finali.json) e
[12 del layout finale](giro-riscontri/misure-layout.json): **534 geometrie**.
Tutte hanno `scrollWidth = clientWidth`, zero elementi oltre i bordi, a
**375 × 812** e **1280 × 900**. A desktop `clientWidth` può essere 1265 per
la barra verticale: non è uno sbordamento orizzontale. Il corpo è Manrope
16 px, gli inset e i colori sono letti da `getComputedStyle`.

[164 controlli](giro-riscontri/controlli.json),
[49 finali](giro-riscontri/controlli-finali.json),
[6 del layout](giro-riscontri/controlli-layout.json): **219 esiti verdi**,
nessuna eccezione JavaScript. I cicli principali sono salvati anche come
checkpoint `*-principali.json`; `verifica.mjs --secondari` riprende i soli
secondari da quelli, senza rifare le risposte già controllate.

L’uscita con una bozza ha fatto apparire la protezione `beforeunload` e
fermato il reset della fixture nel banco: il driver ora rimuove il gestore
**solo prima di caricare intenzionalmente una nuova fixture**, non nel giro
dello studente. I controlli coperti dal pannello risposte vengono fatti
scorrere prima del tocco; un centro geometrico coperto non è un click riuscito.
La ripresa simulata aveva il gestore ma non il comando visibile: il controllo
l’ha rilevato e il pulsante account è stato aggiunto prima del verde finale.

Nell’ispezione a 375 la prima domanda era inizialmente spinta sotto le
risposte. Tolto il titolo operativo ridondante, il numero precede la domanda
come titolo; i comandi del banco vengono dopo il contenuto. Le sei catture
finali del runner mostrano la prima domanda intera sopra il pannello inferiore,
misurata in tutti gli accessi e viewport. I quesiti più lunghi e la spiegazione
possono richiedere scorrimento: questo costo rimane per P-70.

Ispezionati runner e risultato alle due larghezze, bozza account, confronto
scaduto, riepilogo carta, revisione H1, spiegazione/risposta e acquisizione finta.
Esempi: [runner 375](giro-riscontri/finale-runner-H0-375.png),
[runner 1280](giro-riscontri/finale-runner-HA-1280.png),
[confronto scaduto](giro-riscontri/finale-carta-scaduta-1280.png),
[acquisizione illustrata](giro-riscontri/finale-acquisizione-finta-375.png).
Le catture dei cicli principali precedono la rifinitura del titolo del runner;
quelle `finale-runner-*` documentano la forma finale.

**Review contro il prompt: passa come mock.** Tutti i tre mestieri richiesti
nei due accessi hanno il giro; consegna parziale, note e spiegazione al momento
giusto, revisione/riprova, giudizio rinviato, bozza illustrata, partita extra,
invito richiudibile e ritorno sono eseguiti. I confini non provati sono
elencati sopra per P-70 e per la realizzazione. Guardiano verde (**175 file di testo**), controllo condiviso della documentazione
verde e recinto del ramo verde. Le suite motore, server, dati, interfaccia e
specifica non sono state rilanciate: nessun codice del prodotto o requisito
che verificano è cambiato. I 219 controlli qui sono del mock, senza sostituire
quelle suite. Stage per nome e diff delle esclusioni controllati prima del commit.
Nessun telefono fisico, persone, Safari, zoom nativo, screen reader, rete,
account, sincronizzazione, ripristino su disco o produzione provati qui.
