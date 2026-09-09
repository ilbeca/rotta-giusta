# Rotta Giusta — specifiche UX

**Stato:** bozza consolidata per accoglienza e organizzazione, aggiornata il 9 settembre 2026; prime proposte visive da confrontare.
**Prodotto di riferimento:** v0.22.1.
**Scopo:** raccogliere l’esperienza da realizzare, con motivazioni, requisiti,
flussi e criteri di verifica. È l’output progettuale della sessione.

Il [percorso UX](percorso-ux.md) descrive metodo, fasi e attività.
Questo documento è la fonte delle decisioni di prodotto: aggiornarle qui,
senza mantenerne una seconda copia nel percorso.
La bozza non è pronta per l’implementazione e non autorizza modifiche all’app.

## Decisioni condivise — riepilogo

- Esperienza per persone nuove, con orientamento e accesso libero agli esercizi.
- Sessione consigliata e scelta autonoma devono coesistere.
- Carteggio è un ambiente autonomo e centrale nella preparazione.
- Nessuna registrazione dello studio esterno (Q-07 chiusa).
- Programma ministeriale come riferimento futuro, dopo verifica delle fonti.
- Identità nautica coerente con i riferimenti visivi forniti.
- Riscontro sulle prime bozze del 9 settembre: direzione estetica confermata;
  il risalto attuale del Carteggio è adeguato per ora.
- Segnali deve essere evidenziato come attività extra originale del progetto;
  questa identità può accogliere in futuro altri esercizi interattivi.

Le proposte operative e di navigazione sotto non sono approvate da questo riepilogo.

## 1. Stato delle informazioni

- **Condiviso:** concordato con l’autore; non equivale a validato con altri utenti.
- **Vincolo esistente:** garanzia del prodotto da conservare.
- **Proposta:** soluzione formulata, ancora da discutere o confrontare.
- **Aperto:** scelta o informazione mancante.
- **Verificato:** comprovato da una prova registrata con contesto e limiti.

Al momento non ci sono soluzioni UX verificate con utenti esterni. I criteri
riportati sotto sono controlli da eseguire, non risultati già ottenuti.

### Riferimenti della revisione

Il confronto dell’8 settembre usa [riscontro-ux.md](riscontro-ux.md) e
[motore.md](motore.md). Questi documenti contengono analisi e inventario tecnico;
qui restano requisiti e scelte. Le affermazioni sul codice sono state controllate
sui sorgenti, non assunte dai documenti. I 102 test esistenti del motore passano;
questo non costituisce una verifica di usabilità o dei flussi completi dell’app.

Precisazioni necessarie per leggere i riferimenti: `S.run` conserva già in
memoria lista, indice ed esiti; manca il ripristino persistente della lista dopo
chiusura. `peggiori()` richiede cinque quesiti distinti visti, non cinque
ripetizioni. `classifica()` distingue mai visto / coperto / da ripassare;
la storia degli errori usa altre misure. `daAllenare()` è nella pagina, non
nel motore: la sua integrazione non è dimostrata dai soli test di `engine.js`.

## 2. Problema e pubblico

### Evidenza di partenza

L’autore riferisce che il programma nacque dopo il ciclo delle lezioni:
svolgeva quiz casuali e tornava a studiare gli argomenti corrispondenti.
Gli mancavano contemporaneamente una visione della copertura, un riscontro
sulle proprie conoscenze e un criterio per scegliere l’attività successiva.
Riferisce inoltre di non aver inizialmente compreso il ruolo preliminare del
carteggio nel proprio esame.

Questa esperienza orienta il progetto, ma non rappresenta una ricerca su più
candidati. Le regole delle prove richiedono verifica ufficiale aggiornata.

### Situazioni da servire

| Situazione | Bisogno | Stato |
|---|---|---|
| Sto iniziando con scuola o manuale | Capire cosa mi aspetta e da dove partire | Pubblico di riferimento condiviso; dettagli da approfondire |
| Ho seguito le lezioni e faccio quiz senza un criterio | Coprire il programma e organizzare l’allenamento | Bisogno emerso dall’esperienza dell’autore |
| Sto studiando un argomento specifico | Scegliere direttamente gli esercizi pertinenti | Da approfondire |
| Sto ripassando per la prova | Individuare difficoltà e mettermi alla prova | Da approfondire |

Sono situazioni che possono cambiare nel tempo, non profili rigidi da assegnare
permanentemente. Contesti da considerare: telefono in sessioni brevi, tavolo
con carte e strumenti, ritorno dopo un’interruzione o una pausa.

## 3. Promessa e ambito

**Promessa proposta:** Rotta Giusta aiuta a orientarsi nella preparazione della
patente nautica senza limiti, allenarsi sul programma d’esame e capire che cosa
è stato esercitato e che cosa richiede ancora lavoro.

**Direzioni condivise:**

- Ripensare esperienza, organizzazione, linguaggio e aspetto insieme.
- Offrire orientamento iniziale e guida all’allenamento.
- Affiancare scuola e studio; non presentarsi come loro sostituto.
- Conservare l’accesso diretto per chi sa già cosa vuole esercitare.
- Usare il programma ministeriale come riferimento, previa verifica delle fonti.
- Predisporre una struttura capace di accogliere l’apprendimento futuro.

**Evoluzione futura, non inclusa automaticamente:** lezioni, spiegazioni ed
esercizi didattici progressivi. Richiederanno un progetto dei contenuti e una
verifica di accuratezza. Non mostrare oggi sezioni che promettono materiale assente.

## 4. Requisiti dell’esperienza

### UX-01 — Orientarsi alla prima apertura

**Stato:** esigenza condivisa; sequenza da progettare.

Chi arriva deve comprendere a chi è rivolto il sito, come può aiutarlo e come
iniziare. Deve poter capire il ruolo delle diverse prove e attività senza
conoscere già il funzionamento della palestra.

**Da verificare:** una persona nuova descrive correttamente l’offerta e trova
una prima attività senza istruzioni del facilitatore.

#### Accoglienza di chi non ha ancora studiato

**Condiviso l’8 settembre:** la guida parte dal programma e aiuta a individuare
cosa affrontare con scuola o manuale, mantenendo possibile provare subito i
quiz. La scelta di iniziare dai quiz non richiede di completare prima la guida.
Il dettaglio dei passaggi e delle domande iniziali resta una proposta.

#### Presentazione sintetica del progetto

**Richiesta dell’autore:** informazioni sommarie sul progetto.
**Proposta dopo R-04:** nell’accoglienza una sintesi operativa: che cosa si può
fare, il supporto a scuola/manuale, conservazione nel browser e banca con anomalie
dichiarate. Per storia estesa e motivazioni rimandare alla vetrina; per fonti,
anomalie, archivio e offline rimandare a Info, disponibile anche nell’app offline.
Non duplicare tre racconti completi del progetto e non obbligare a un tour.

La sintesi deve funzionare anche entrando direttamente in app. Una ripetizione
breve di fatti essenziali è legittima, ma ridurla non garantisce l’allineamento:
per ogni fatto ripetuto individuare una fonte canonica e includere le superfici
interessate nella verifica editoriale. Numeri derivati dalla banca conservano
la fonte dati comune. Nessun nuovo caricamento remoto necessario all’accoglienza.

**Da verificare:** l’utente comprende offerta e conservazione dei progressi;
i fatti comuni concordano e gli approfondimenti dichiarati offline funzionano.

### UX-02 — Avere una visione del programma

**Stato:** obiettivo del programma condiviso; attuazione in due livelli proposta.

**Nella prima versione UX:** rappresentare le attività e gli argomenti della
banca disponibile, chiamandoli «Argomenti dei quiz» o «Attività disponibili».
Non presentarli come programma completo e non indicare parti mancanti senza
un confronto documentato. Distinguere base, vela e carteggio: gli otto temi e
le 44 voci descrivono la banca base, non tutta la preparazione.

**Evoluzione subordinata a Q-02:** acquisire e verificare il programma ufficiale,
collegarlo alle attività e solo allora rappresentare copertura e lacune del
programma. Il riferimento strutturato non è oggi nei dati dell’app; non occorre
bloccare l’accoglienza o la mappa della banca nell’attesa.

**Pesi d’esame — verificato il 9 settembre 2026.** La distribuzione delle 20
domande per tema **è ministeriale**: è l’Allegato C al DM 10 agosto 2021, n. 323
(GU Serie generale n. 232 del 28/09/2021, p. 39), e i suoi otto valori coincidono
uno per uno con `pesi_esame` di `meta.json`. Si può quindi presentare come
distribuzione ufficiale, citando l’atto. La cautela precedente — «non verificati
direttamente nel decreto» — nasceva dal fatto che nel repo c’era solo l’elenco dei
quesiti (DD 131/2022), non il decreto che stabilisce le prove.

**La cautela resta però sulle voci.** L’Allegato C fissa i quesiti **per tema** e
nient’altro: la ripartizione fra le 44 voci non è in nessun atto, quindi le
priorità per voce del motore restano una costruzione del sito e non vanno
presentate come ministeriali. Conseguenza per la mappa: **una vista per tema può
dirsi ufficiale, una vista per voce no.**

Evidenze, riferimenti puntuali e questioni ancora aperte in
[ricerca-programma-esame.md](ricerca-programma-esame.md). Il riscontro, §6, e il
motore, §9, contengono su questo punto la formulazione superata.

**Accolto nel confronto del 9 settembre:** non mostrare valori numerici dei pesi
d’esame nelle schermate iniziali. La motivazione dei consigli resta leggibile
a parole e coerente con il motore, senza trasformare una stima in una certezza
ministeriale. Eventuali valori in Progressi devono portare vicino al numero
provenienza e natura derivata; la formulazione verbale non elimina questo limite.

**Da verificare:** titoli e indicatori non confondono banca e programma;
ogni attività della mappa esiste e ogni conteggio proviene dai dati caricati.

### UX-03 — Scegliere tra consiglio e autonomia

**Stato:** condiviso esplicitamente.

Devono coesistere una sessione consigliata e la scelta libera da una mappa che
evidenzi le priorità. I nomi «Allenamento consigliato» ed «Esplora il programma»
sono etichette provvisorie.

**Base esistente verificata nel codice:** la selezione mirata e i consigli per
voce esistono già e sono sotto test; non si propone di riscriverli. La pagina
oggi avvia la Mirata su 25 quesiti base: estenderla a vela o carteggio, o adattarla
ai minuti disponibili, sarebbe lavoro aggiuntivo, da valutare separatamente.
Vedi [motore, catalogo e misure](motore.md#4-il-catalogo-sei-mestieri-non-sei-varianti).

**Proposta dopo R-01:** «sessione consigliata» significa una selezione finita
ricalcolata dai progressi all’avvio. Durante lo svolgimento lista e avanzamento
restano in memoria, come già oggi. Nessun obiettivo giornaliero persistente né
nuovo registro di completamento. La motivazione generale deve essere coerente
con i motivi prodotti dal motore, senza inventare un piano didattico.

Dopo la chiusura, «Continua ad allenarti» avvia una nuova selezione aggiornata:
non promette di ripristinare esattamente lista e posizione precedenti. Rivedere
risposte nello storico è un’altra azione. Le attività libere concorrono agli
stessi progressi. Non serve una seconda copia dello storico per questa proposta.

**Da verificare:** conteggio e lista coincidono; la motivazione è riconducibile
alla selezione; dopo chiusura e riapertura sono conservate le risposte realmente
salvate, senza promettere recupero delle domande non ancora affrontate.

### UX-04 — Comprendere i progressi

**Stato:** bisogno condiviso; presentazione da definire su misure esistenti.

La diagnosi distingue già errori storici e aperti, copertura e prima risposta;
i consigli combinano parte mai vista ed errori aperti. Riutilizzare questi
comportamenti e le soglie esistenti: vedi [motore, misure](motore.md#5-le-misure-con-le-loro-soglie-dichiarate).
La specifica richiede di renderli comprensibili, non di ricrearli.

L’esperienza deve rispondere a: «Ho affrontato tutto?», «Dove ho difficoltà?» e
«Che cosa faccio adesso?». Copertura dei quesiti e risultati non devono essere
presentati come dimostrazione di padronanza completa dell’argomento.

**Decisione condivisa l’8 settembre:** non introdurre la registrazione degli
argomenti studiati a scuola o sul manuale. L’autore privilegia la semplicità
e non ritiene utile questa compilazione. Non chiedere una lista di argomenti
già studiati durante l’accoglienza o in seguito.
I progressi descrivono le attività registrate nel sito, senza dedurre che un
argomento mai esercitato non sia mai stato studiato. Chi vuole allenarsi su
una lezione sceglie direttamente l’argomento dalla mappa.
Questa decisione non determina ancora se chiedere una generica fase di
preparazione iniziale, che resta una proposta da valutare in Q-04.

**Chiarimento dopo R-02:** «poco esercitato» e «errori osservati» possono
coesistere. Il sito non sa perché si sbaglia e non deduce «non studiato» o
«argomento nuovo per te» dalla copertura. Usare descrizioni come «poche domande
viste qui» ed «errori nelle risposte», senza diagnosi sulle cause.
Non modificare soglie o ranking per introdurre tale distinzione: un cambiamento
delle soglie sarebbe una proposta separata, con motivazione e verifica.

**Da verificare:** con pochi tentativi, l’interfaccia non suggerisce una certezza
che i dati non sostengono; è chiara la differenza fra poco esercitato e difficoltà
osservata.

### UX-05 — Conservare fiducia, correttezza e continuità

**Stato:** vincoli esistenti del progetto.

- Conteggio promesso e attività aperta devono avere la stessa fonte.
- Problemi di salvataggio e dati mancanti restano visibili.
- Conservazione locale, esportazione e importazione devono essere comprensibili.
- Anomalie della banca e fonti rimangono accessibili.
- Simulazione e allenamento mantengono regole riconoscibili; la simulazione
  ignora lo storico di proposito.
- Nel carteggio resta esplicito il confronto con la risposta ufficiale e
  l’autovalutazione; non promettere correzione automatica.
- Nessun account o sincronizzazione impliciti nell’interfaccia.

**Da verificare:** scenari di errore, assenza di dati e interruzione, oltre al
percorso normale; controlli empirici coerenti con AGENTS.md e storia del progetto.

## 5. Flussi principali — proposta da portare nelle bozze

Le direzioni condivise sono requisiti; le sequenze qui formulate sono proposte
progettuali da provare. Non considerare approvato ogni dettaglio per effetto
della richiesta di completare il documento.

### F-01 — Primo ingresso

1. Presentazione sintetica del progetto, utile anche entrando direttamente in app.
2. Due possibilità: farsi accompagnare oppure scegliere subito un’attività.
3. Nel percorso guidato, proposta di chiedere motore/vela ed eventualmente la
   fase di preparazione. La seconda domanda rimane da giustificare: mantenerla
   solo se cambia concretamente la proposta iniziale. Nessuna lista dello studio esterno.
4. Accesso alla rotta, con orientamento sul programma e prima attività proposta.

La data d’esame è proposta come facoltativa e modificabile successivamente.
Il tempo disponibile appartiene alla scelta della sessione, non a un profilo
permanente. Testi e domande non sono ancora definitivi.

Chi non ha studiato può orientarsi sul programma e prepararsi con scuola o
manuale, oppure provare subito i quiz. Il salto della guida non blocca attività.
La guida e le informazioni del progetto devono essere ritrovabili in seguito.
Archivio vuoto non prova che sia la prima visita: offrire anche importazione e
scelta diretta. Eventuali preferenze di accoglienza sono distinte dallo storico.
Se esistono progressi, evitare di trattare la persona come un nuovo candidato:
prevedere accesso al lavoro esistente e alla funzione di importazione, senza reset.

### F-02 — Ritorno e scelta dell’attività

La rotta offre una prossima attività motivata e la mappa per la scelta libera.
Il riepilogo dei progressi rimanda al dettaglio senza occupare il posto dell’azione.
Con archivio vuoto, dare orientamento anziché mostrare una diagnosi a zero.
Con pochi dati, esplicitare che il suggerimento non è una diagnosi completa.

La continuità segue UX-03: dopo chiusura si ricalcola, senza ripristino persistente
promesso. Con lista ancora attiva si usa lo stato in memoria esistente.

**Proposta dopo R-05:** senza data, evidenziare un traguardo locale: completare
la selezione avviata, poi leggere il riepilogo e scegliere se fermarsi o continuare.
Non chiamarlo «quota giornaliera raggiunta» né «per oggi hai studiato abbastanza».
La quantità predefinita per la prima attività resta Q-05; non serve un budget
persistente. La copertura dell’area è un secondo segnale, non un voto.
Con data presente restano disponibili quota e ritmo rispetto alla scadenza.
La data è già facoltativa nel prodotto: questa proposta migliora lo stato senza
data, non introduce la possibilità di ometterla.

### F-03 — Allenamento sui quiz

Ingresso dalla rotta, dalla sezione Quiz o da una difficoltà in Progressi.
Selezione semplice dell’attività; opzioni più dettagliate disponibili quando servono.
Avvio con ambito e quantità comprensibili, risposta, riscontro, revisione e scelta
successiva. Modalità, nomi e controlli del runner saranno specificati nelle bozze.

Filtri e quantità appartengono al contesto dei quiz, senza dominare Carteggio o
la prima apertura. Il filtro «mai fatte» non deve suggerire effetti sulle simulazioni.
Se il filtro non trova quesiti, spiegare il motivo e offrire di modificarlo.

### F-04 — Ambiente Carteggio

**Decisione condivisa l’8 settembre:** Carteggio è un ambiente autonomo, nel quale
si entra appositamente, e una parte fondamentale della preparazione. Deve avere
un accesso nella navigazione principale e rilievo nella rotta e nell’accoglienza.

Proposta per l’ingresso nell’ambiente:

- **Esercitati con carte e strumenti:** accesso agli esercizi disponibili e scelta
  dell’argomento; chiarire il materiale necessario prima di iniziare.
- **Riconosci la tecnica:** attività praticabile senza carte, con finalità e limiti
  espliciti; non equivale ad aver svolto l’esercizio completo.
- **Prova di carteggio:** accesso alla prova con le condizioni e il materiale
  necessario, prima dell’avvio del tempo.

L’autore sottolinea il ruolo preliminare del carteggio rispetto ai quiz d’esame.
La formulazione normativa e l’ambito vanno verificati in Q-02. Il requisito UX è
che tale ruolo sia spiegato e non scoperto tardi nella preparazione.
**Nessun blocco artificiale dei quiz di allenamento:** ordine dell’esame e libertà
di prepararsi in parallelo restano distinti.

Già all’ingresso dell’ambiente e prima dell’avvio spiegare che il giudizio della
prova è dell’utente: non farlo scoprire alla consegna.

L’esito della prova mantiene il confronto con la risposta ufficiale e la
valutazione dell’utente. Risultati autovalutati e riconoscimento delle tecniche
non devono essere confusi fra loro o con correzioni automatiche.

### F-05 — Simulazione e risultato

Proposta preferita dopo R-03: ingresso dentro Quiz o Carteggio, con un’azione
«Simula la prova» riconoscibile e distinta dall’allenamento. Prima di iniziare,
chiarire quale prova si sta simulando, condizioni, tempi e modalità di valutazione.
Un indice delle prove non deve promettere un esame completo concatenato se tale
comportamento non esiste. Durante una simulazione, conservare le regole proprie
che la distinguono dall’allenamento. Alla fine: esito, revisione e attività successiva.

Se si mantiene l’alternativa con Esame autonomo, gli accessi convergono sulla
stessa prova. La scelta fra quattro e cinque destinazioni resta dell’autore.

### F-06 — Progressi e gestione dei dati

Dalla sintesi si accede al dettaglio per area e alle attività pertinenti.
Mostrare separatamente copertura, difficoltà osservate e risultati delle prove.
Con dati insufficienti, dirlo; con dati assenti non mostrare preparazione positiva.

Esportazione/importazione vivono in Info e impostazioni, raggiungibili anche da
Progressi tramite un collegamento. I problemi di conservazione restano visibili
nella schermata corrente e nell’accesso alle informazioni.

### Stati trasversali da disegnare e provare

Per ciascun flusso: ingresso, uscita, ritorno, archivio vuoto, dati parziali,
interruzione, offline, contenuto mancante ed errore di salvataggio quando applicabili.
L’offline non è una promessa generica: lo stato deve riflettere la disponibilità
reale di banca, guscio e figure. Una figura indisponibile deve essere dichiarata.

## 6. Architettura delle sezioni e direzione visiva

### Navigazione proposta

La scelta di Carteggio autonomo è condivisa. La seguente struttura consolida la
proposta complessiva; nomi, ordine e disposizione sono da verificare nelle bozze.

| Destinazione | Compito principale | Contenuti |
|---|---|---|
| **Rotta** | Orientarmi e decidere cosa fare adesso | Attività consigliata, mappa, riepilogo essenziale |
| **Quiz** | Allenarmi direttamente sui quesiti | Argomenti, ripasso, modalità di allenamento; accesso ai Segnali da COLREG in una delle varianti da confrontare |
| **Carteggio** | Preparare questa parte in un ambiente dedicato | Esercizi, riconoscimento delle tecniche, prova di carteggio |
| **Progressi** | Comprendere il lavoro svolto e le difficoltà | Copertura, risultati, storico e collegamenti al ripasso |

La destinazione generica «Allenati» viene precisata in «Quiz», perché Carteggio
ha un ambiente autonomo: entrambi sono allenamento, senza una gerarchia di valore.

**Proposta confermata per la prova nelle bozze il 9 settembre, non struttura decisa:**
quattro destinazioni, Rotta / Quiz /
Carteggio / Progressi; simulazioni evidenti nei rispettivi ambienti. La precedente
alternativa con Esame autonomo resta aperta solo se gli assegniamo un compito
ricorrente ulteriore rispetto all’avvio delle prove. Due accessi alla stessa
attività non sono di per sé un difetto, ma non giustificano da soli una quinta voce.

Quattro destinazioni sono una proposta da provare a 375 px. Non ridurre il testo
per far entrare la navigazione: verificare etichette, spazi e aree di tocco nelle
bozze. Su desktop usare gli stessi nomi e raggruppamenti, con disposizione adatta.

### Collocazione delle funzioni esistenti

| Oggi nel prodotto | Collocazione proposta |
|---|---|
| Oggi | Rotta |
| Allena: Mirata, Per argomento, Solo sbagliate, Screening, Batteria | Quiz, con etichette e gerarchie da affinare |
| Allena: Simulazione | Quiz → Simula la prova (proposta) |
| Carteggio | Carteggio, accesso autonomo |
| Tecniche | Carteggio → Riconosci la tecnica |
| Diagnosi | Progressi |
| Segnali | Due varianti da confrontare: ingresso dalla mappa della Rotta oppure da Quiz → argomento COLREG; sempre dichiarato extra banca, con punteggi distinti dall’archivio quiz |
| Info | Info e impostazioni, accesso persistente nell’intestazione |

**Segnali — proposta da confrontare nelle bozze:** nessuna delle due collocazioni
è scelta a tavolino. Nella variante dalla mappa, l’accesso resta disponibile
anche per chi torna, non soltanto nell’accoglienza. Nella variante COLREG,
presentarlo come attività visiva extra banca senza equiparare il punteggio del
gioco alla copertura dei quesiti. Confrontare la reperibilità per il primo uso
e per l’allenamento successivo.

**Riscontro condiviso sulle bozze, 9 settembre:** il gioco dei Segnali va
evidenziato come un extra originale di Rotta Giusta. L’autore immagina la
possibilità di sviluppare altre attività dello stesso tipo, citando come
esempio un simulatore di suoni di avvisi nautici. È una direzione di prodotto,
non l’approvazione di un nome, di una collocazione definitiva o di una nuova
funzionalità da implementare.

**Proposta successiva:** dare agli extra un riquadro riconoscibile sulla Rotta,
disponibile anche al ritorno, con titolo provvisorio «Allenamenti extra» e
accesso ai Segnali. Conservare il collegamento contestuale da COLREG come
possibilità complementare. Il riquadro mostrerebbe solo attività disponibili,
senza tessere inattive per sviluppi futuri; non implica una quinta destinazione
di navigazione. Nome, composizione e accessi restano da confrontare nelle bozze.
L’eventuale allenamento sonoro richiederà una propria progettazione e verifica
dei contenuti: non è parte della consegna attuale.

**Proposta di responsabilità:** Rotta serve a scegliere l’azione successiva;
Progressi spiega copertura e risultati, con collegamenti contestuali all’esercizio.
Non mostrare due classifiche concorrenti di «cosa fare adesso».
Rotta e Progressi rimandano agli stessi ambienti: non duplicano gli esercizi.
Info raccoglie progetto, fonti e anomalie, conservazione dei progressi, offline e
preferenze. I guasti non possono essere visibili soltanto dopo aver aperto Info.

### Organizzazione della rotta

Proposta per chi torna: attività consigliata con motivazione, mappa liberamente
esplorabile, sintesi dei progressi. Alla prima visita l’orientamento può avere
più rilievo; non definire l’ordine grafico finale senza una prova.

Carteggio deve essere riconoscibile nella mappa e accessibile senza cercarlo
fra i quiz. Il significato delle isole resta aperto: il loro numero non deve
essere fissato per imitare un’immagine. Non confondere programma completo,
aree coperte dall’app e ordine delle prove. Usare nomi espliciti e collegamenti
comprensibili anche senza interpretare la metafora nautica.

### Identità e accessibilità

**Riferimento condiviso:** immagini di Rotta Giusta fornite dall’autore,
identità nautica, palette blu, superfici chiare, immagini e icone curate.
Testi e dettagli delle immagini non costituiscono requisiti funzionali.

La direzione prevalentemente chiara delle prime bozze è stata confermata
dall’autore il 9 settembre. Il tema scuro opzionale resta una proposta;
l’approvazione estetica non equivale a validazione di usabilità o accessibilità,
né approva automaticamente ogni dettaglio tipografico e funzionale.
Il riferimento preciso delle tre isolette non è stato ancora ritrovato.

Progettare testi lunghi e figure utilizzabili, accesso da tastiera, compatibilità
con lettori di schermo, contrasto, ingrandimento e significati non affidati al
solo colore. Illustrazioni di orientamento lasciano spazio ai contenuti didattici
mentre si svolgono gli esercizi. Misure e dettagli saranno definiti con le bozze.

Preservare correttezza dei fanali e colori didattici dei Segnali. Nessuna scelta
grafica deve introdurre dipendenze o riscritture architetturali implicite.

## 7. Questioni aperte

| ID | Decisione o verifica necessaria | Conseguenza |
|---|---|---|
| Q-01 | Confermare la promessa e precisare l’ambito di patente supportato | Testi di ingresso e copertura dichiarata |
| Q-02 | Acquisire programma ufficiale strutturato e verificare regole; nell’attesa proposta di mappa della banca | Nessuna pretesa di copertura del programma completo |
| Q-03 | Direzione condivisa: partire da programma e studio con scuola/manuale, lasciando accesso immediato ai quiz; dettagliare il flusso | Prima attività e ruolo di scuola/manuale |
| Q-04 | Decidere quali informazioni iniziali chiedere e perché | Durata e utilità dell’accoglienza |
| Q-05 | Definire priorità, spiegazione e dimensione delle sessioni consigliate | Comportamento da confrontare col motore esistente |
| Q-06 | Carteggio autonomo e risalto attuale condivisi; quattro destinazioni ancora proposte; identità extra dei Segnali condivisa, nome e collocazione dell’area da definire | Bozze della mappa e sezioni |
| Q-07 — chiusa | Non tracciare lo studio esterno: privilegiare la semplicità | Nessuna lista da compilare; progressi riferiti alle attività nel sito |
| Q-08 | Direzione estetica chiara delle prime bozze confermata; dettagli e tema scuro opzionale restano aperti | Consolidamento grafico e verifiche di accessibilità |

Q-03 ha ricevuto una risposta l’8 settembre: la direzione è condivisa, mentre
sequenza delle schermate e testi restano da progettare. Le informazioni sommarie
sul progetto sono state richieste; la loro articolazione in UX-01 è una proposta.

## 8. Ordine di attuazione proposto

**Stato: proposta, non autorizzazione a implementare.**

1. **Intervento isolato: Oggi con archivio vuoto e senza data.** Preparare una
   bozza con sintesi operativa, prima attività finita e accesso evidente a
   Carteggio. Riutilizzare avvii e selezioni esistenti; mantenere navigazione,
   tema, archivio e dati. Non introdurre mappa ministeriale o stato giornaliero.
   Correggere nella futura attuazione anche il `null` delle Tecniche, verificato
   nel template, perché fa parte della medesima esperienza iniziale.
2. Dopo confronto della bozza, implementare quel solo stato e provarlo con utenti
   nuovi, verificando anche il ritorno dopo le prime risposte e archivi importati.
3. Rendere visibili consiglio e progressi negli stati con storico, usando le
   misure esistenti e chiarendo le responsabilità Rotta/Progressi.
4. Applicare la navigazione confermata e organizzare Carteggio, preservando i runner.
5. Estendere identità visiva e mappa delle attività. Il programma ufficiale
   completo segue la verifica e la preparazione del contenuto, non la precede.

Criteri per il primo intervento: accessi funzionanti ai quiz e a Carteggio;
nessun `null`, falsa quota o diagnosi positiva senza dati; quantità annunciata
uguale alla lista avviata; avvisi di archivio/offline ancora comprensibili e
visibili; comportamento con storico invariato. Verificare a 375 px e desktop,
con lettura visiva e controlli funzionali, prima di qualsiasi rilascio.

Offline da completare e scrittura fallita richiedono spiegazioni diverse:
proposta di rendere esplicita la causa dell’indicatore, senza nasconderlo.
Non risolvere il primo ingresso spegnendo il pallino.

## 9. Verifica e maturità della specifica

**Ipotesi per la fase 6, non decisione sul testo:** provare il titolo «Dove hai
incontrato difficoltà» con persone il cui archivio contiene poche attività.
Chiedere che cosa comunica sulla loro preparazione, senza suggerire la risposta.
Non cambiare misure, soglie o dati per questa prova; il nuovo titolo non è ancora
considerato una soluzione verificata.

Le prove useranno compiti concreti, senza suggerire il percorso: iniziare,
trovare un argomento, scegliere un consiglio, comprendere un risultato e
riprendere. Registrare completamento autonomo, incomprensioni e aiuti necessari.
Definire condizioni e criteri precisi prima delle prove.

La specifica sarà pronta a guidare l’implementazione quando flussi prioritari,
contenuti, stati, requisiti di accessibilità e criteri di accettazione saranno
completi; le questioni residue dovranno avere un rinvio esplicito. Le prove con
utenti, le revisioni e gli eventuali limiti saranno documentati, senza dichiarare
validazioni che non sono state svolte.

### Prime bozze di Oggi/Rotta — 9 settembre 2026

**Stato aggiornato dopo il riscontro dell’autore:** direzione estetica e risalto
attuale del Carteggio condivisi; identità extra dei Segnali condivisa. Le altre
soluzioni e i dettagli restano proposte, senza validazione con utenti esterni.

- [Tavole di confronto](prototipi/rotta-2026-09-09/confronto.html): archivio
  vuoto e prime attività, entrambi senza data, a 375 px e desktop a 1280 px.
- [Prototipo autonomo](prototipi/rotta-2026-09-09/index.html): selettori dei
  due stati, delle varianti Segnali e di un errore di salvataggio dimostrativo.
- [Passaggio di consegne e verifiche](prototipi/rotta-2026-09-09/PASSAGGIO.md):
  inventario, provenienza dei dati, immagini osservate e limiti della prova.

**Proposte messe alla prova negli artefatti:**

1. Superfici chiare, illustrazioni nautiche originali e un riquadro navy per
   l’attività consigliata. Tipografia locale Avenir Next con fallback di
   sistema: scelta esplorativa, non sostituzione approvata di Manrope.
2. Un primo avvio dei quiz base direttamente dalla Rotta, con numero di quesiti
   e spiegazione del consiglio. Carteggio affiancato su desktop e subito dopo
   su telefono, sempre raggiungibile anche dalla navigazione proposta.
   L’autore considera adeguato per ora il risalto dato al Carteggio; ciò non
   stabilisce una priorità didattica dei quiz. La durata di 25 quesiti riprende il comportamento esistente;
   non è stata verificata come dimensione adatta a chi comincia.
3. Scelta libera sotto l’attività consigliata; riepilogo iniziale senza tre
   zeri e, con storico parziale, poche osservazioni sulle risposte. Nessuna
   diagnosi complessiva, quota giornaliera o percentuale di preparazione.
4. Segnali A: accesso diretto nella mappa delle attività, presente anche al
   ritorno. Segnali B: accesso dentro COLREG, con richiamo all’attività visiva
   nell’ingresso dell’argomento. La seconda variante privilegia il contesto
   aggiungendo un passaggio e dando un richiamo dedicato a COLREG sulla Rotta;
   anche questo privilegio dell’argomento va valutato. Nessuna delle due è
   stata scelta.
5. Conservazione locale spiegata in fondo alla Rotta, approfondimento in Info;
   in caso di errore, avviso esplicito prima delle attività e indicatore su
   Info. Il pannello è un’anteprima: non dimostra salvataggio o recupero reali.

I dati sono dimostrativi, calcolati dal motore esistente: lo stato parziale usa
una piccola sequenza simulata di risposte, non dati personali. Numeri e lista
del consiglio provengono dallo stesso snapshot. I pannelli successivi servono
solo a confrontare reperibilità e passaggi, non costituiscono nuove specifiche
complete per Quiz, Carteggio, Progressi o Info.

Questo lavoro esplora composizione e navigazione trasversali per richiesta
dell’autore; non cambia l’ordine di attuazione proposto nel §8 e non autorizza
l’integrazione del prototipo nell’app. Non è ancora stata svolta la fase 6.

**Riscontro ricevuto:** direzione estetica approvata («assolutamente sì»);
nessun aumento del risalto del Carteggio per ora; richiesta di evidenziare
Segnali come extra originale, con possibilità di altre attività future.
La proposta conseguente di un riquadro per gli extra è descritta nella sezione
Segnali. Restano aperti la sua forma, la navigazione definitiva, il tema scuro
opzionale e la dimensione della prima attività. Le tavole conservano le due
varianti precedenti come materiale di confronto, non come decisione finale.

### Registro delle revisioni

- **9 settembre 2026 — riscontro dell’autore sulle bozze:** confermate la
  direzione estetica e l’adeguatezza attuale del risalto del Carteggio; condivisa
  l’identità extra e originale dei Segnali. Registrati come proposta il riquadro
  «Allenamenti extra» e come idea futura l’allenamento sonoro, senza approvarne
  collocazione, nome o implementazione. Nessuna modifica al prototipo o all’app.

- **9 settembre 2026 — prime bozze visive:** aggiunti i riferimenti alle quattro
  viste e al confronto Segnali, con le scelte esplicitamente in stato di
  proposta. Annotati controlli visivi e funzionali del solo prototipo nel
  passaggio di consegne. Nessuna nuova approvazione di prodotto, modifica
  all’app, al motore, ai dati o alle versioni; nessuna pubblicazione.

- **9 settembre 2026 — esito del confronto:** registrati soltanto i quattro
  punti richiesti: navigazione a quattro come proposta per le bozze; due
  varianti per Segnali; esclusione accolta dei pesi numerici all’ingresso;
  titolo della diagnosi come ipotesi da provare in fase 6. Nessuna bozza o
  modifica all’app realizzata in questo aggiornamento.
- **8 settembre 2026 — confronto con la revisione di Claude:** controllati i
  riferimenti nel codice e passati 102 test del motore. Precisati selezione
  derivata e stato temporaneo, limiti della diagnosi, riuso del motore e mappa
  della banca in attesa del programma. Proposti quattro accessi, sintesi
  operativa nell’accoglienza, traguardo locale senza data e attuazione graduale.
  Queste alternative restano proposte; nessuna nuova decisione dell’autore
  è implicita. Nessuna modifica a sito, dati o documenti di revisione/motore.

- **9 settembre 2026 — pesi d’esame:** corretta in UX-02 l’attribuzione della
  distribuzione delle 20 domande per tema, che risulta ministeriale (Allegato C
  al DM 323/2021) e non derivata da fonti secondarie. Mantenuta e resa esplicita
  la cautela sulla ripartizione per voce, che nessun atto stabilisce. Nessun’altra
  parte della specifica è stata toccata; Q-02 resta aperta per le parti diverse
  dai pesi. Nessuna modifica ad app, motore o dati.

- **8 settembre 2026 — organizzazione:** consolidati flussi e collocazione delle
  funzioni; registrata la decisione di Carteggio autonomo e centrale nella
  preparazione. Proposta navigazione Rotta / Quiz / Carteggio / Esame / Progressi.
  Le scelte non ancora condivise restano esplicitamente proposte.

- **8 settembre 2026 — semplicità:** esclusa la registrazione dello studio
  esterno; chiusa Q-07 e chiarito il significato dei progressi.
- **8 settembre 2026 — accoglienza:** registrata la direzione per chi non ha
  ancora studiato e aggiunta la proposta di presentazione sintetica del progetto.
- **7 settembre 2026 — prima bozza:** separata dal documento di percorso;
  raccolti bisogni, direzioni condivise, requisiti iniziali e questioni aperte.
  Nessuna modifica all’app o decisione di rilascio.
