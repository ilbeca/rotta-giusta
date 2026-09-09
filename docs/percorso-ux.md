# Rotta Giusta — percorso di progettazione UX

Documento di lavoro aperto il 7 settembre 2026, sul prodotto v0.22.1.
Stato: **definizione dell’esperienza, prima di progettare le schermate**.

## 1. Obiettivo

Trasformare la palestra nata per un autore che ne conosceva già il funzionamento
in un’esperienza comprensibile anche a chi inizia a prepararsi per la patente
nautica senza limiti. Conservare la qualità del motore e dei dati, ripensando
insieme orientamento, percorsi, sezioni, linguaggio e identità visiva.

Il sito accompagna la preparazione con una scuola o un manuale. Oggi offre
allenamento e riscontri; un’offerta di apprendimento è un’evoluzione possibile,
che richiederà contenuti didattici verificati.

Questo documento guida il lavoro: **non è una specifica di implementazione**.
La fase corrente non autorizza modifiche all’app né una pubblicazione.

## 2. Come teniamo traccia delle decisioni

- **Condiviso**: direzione concordata con l’autore, non ancora necessariamente
  verificata con altri utenti.
- **Osservato**: comportamento o elemento visto direttamente, con contesto.
- **Ipotesi**: proposta da confrontare con alternative o provare.
- **Verificato**: risultato di una prova descritta, con evidenza e limiti.
- **Aperto**: domanda cui non abbiamo ancora risposto.

Una preferenza estetica non dimostra usabilità. Una prova di usabilità non
dimostra efficacia didattica né probabilità di superare l’esame.
Per ogni fase annotiamo decisioni, motivazioni, evidenze e domande rimaste.

## 3. Documenti e stato del lavoro

- **Questo documento:** metodo, fasi, attività e avanzamento del lavoro UX.
- **[Specifiche UX](specifiche-ux.md):** output progettuale della sessione e
  fonte delle decisioni di prodotto, dei requisiti, delle proposte e delle
  questioni aperte. La prima bozza raccoglie quanto emerso finora.

Il confronto iniziale ha identificato i bisogni di copertura, comprensione dei
risultati e scelta della prossima attività. È stata concordata la coesistenza
tra sessione consigliata e scelta libera. Dettagli e stati delle decisioni
vivono nella specifica, evitando copie da tenere allineate.

**Avanzamento:** fase 1 in corso; sono emersi elementi per le fasi successive,
ma ricerca con altri candidati, verifica ministeriale e prove restano da fare.

## 4. Percorso di lavoro

Le fasi sono iterative: una prova può farci tornare su una decisione precedente.

### Fase 1 — Persone, contesto e promessa del prodotto

**Domanda:** chi aiutiamo, in quale momento e con quale risultato?

- [ ] Descrivere principiante, persona già in formazione e persona in ripasso.
- [ ] Considerare uso al telefono, al tavolo con carte e strumenti, tempi brevi
  e sessioni lunghe, ritorno dopo una pausa.
- [ ] Raccogliere esperienze di alcuni candidati, oltre a quella dell’autore:
  come studiano, dove si bloccano, come decidono cosa fare.
- [ ] Inventariare ciò che esiste e ciò che richiederebbe nuove funzionalità.
- [ ] Definire la promessa attuale e il confine con scuola, manuale e pratica.

**Risultato:** breve descrizione del pubblico, bisogni prioritari e ambito.
**Si procede quando:** sappiamo quale problema affronta la prima versione UX
e quali bisogni rinviamo consapevolmente.

### Fase 2 — Percorso d’esame e percorso di preparazione

**Domanda:** che cosa deve capire una persona per organizzarsi?

- [ ] Verificare struttura e condizioni delle prove sulle fonti ufficiali,
  registrando fonte, data e ambito di applicazione.
- [ ] Distinguere ordine delle prove, programma ministeriale e suggerimenti
  didattici del sito: non sono la stessa cosa.
- [ ] Collegare il programma alle attività effettivamente disponibili.
- [ ] Chiarire cosa si può esercitare sul telefono e cosa richiede strumenti.
- [ ] Definire copertura degli esercizi e risultati osservati senza presentarli
  come misura dello studio esterno; applicare la decisione Q-07 delle specifiche.

**Risultato:** mappa comprensibile della preparazione, con fonti e limiti.
**Si procede quando:** ogni tappa ha uno scopo e non suggerisce prerequisiti
artificiali o copertura di contenuti assenti.

### Fase 3 — Prima visita e ritorno

**Domanda:** come accompagniamo senza imporre un percorso lungo?

- [ ] Raccontare la prima visita dal punto di vista di una persona nuova.
- [ ] Decidere quali informazioni chiedere e quale scelta concreta cambia
  grazie a ciascuna risposta; rendere modificabili le preferenze.
- [ ] Prevedere ingresso rapido, percorso guidato e importazione dei progressi.
- [ ] Scegliere una prima attività adatta a chi non ha ancora studiato.
- [ ] Progettare il ritorno dopo una sessione e dopo un periodo di inattività.
- [ ] Spiegare al momento opportuno conservazione locale e copia dei progressi.

**Risultato:** sequenza narrativa dalla prima apertura alla seconda sessione.
**Si procede quando:** è chiaro come iniziare, saltare la guida e ripartire.

### Fase 4 — Sezioni e navigazione

**Domanda:** dove trova ogni cosa la persona che studia?

- [ ] Confrontare poche alternative di organizzazione usando gli stessi compiti.
- [ ] Definire il significato delle isole e recuperare il riferimento originale.
- [ ] Collocare quiz, carteggio, tecniche, segnali, simulazioni e progressi.
- [ ] Dare accesso riconoscibile a fonti, anomalie della banca, archivio e offline.
- [ ] Tenere visibili i guasti anche fuori dalla pagina delle informazioni.
- [ ] Verificare nomi e raggruppamenti con persone che non conoscono l’app.

**Risultato:** mappa delle sezioni e percorsi principali, prima del dettaglio grafico.
**Si procede quando:** ogni attività ha una collocazione comprensibile e il
percorso consigliato convive con la scelta libera.

### Fase 5 — Bozze dell’esperienza e direzione visiva

**Domanda:** come rendiamo concretamente leggibile e piacevole il percorso?

- [ ] Disegnare prima apertura, ritorno, quiz, risultato e accesso al carteggio.
- [ ] Includere stati vuoti, parziali, errori, interruzioni e risultati negativi.
- [ ] Confrontare l’uso di superfici chiare e navy senza assumere il tema attuale.
- [ ] Definire gerarchie, tipografia, icone, illustrazioni e linguaggio comuni.
- [ ] Progettare a 375 px e su desktop: figure, testi lunghi e controlli devono
  restare utilizzabili, non solo rientrare nello schermo.
- [ ] Considerare contrasto, ingrandimento del testo, tastiera, lettori di
  schermo, significati non affidati al solo colore e movimento ridotto.

**Risultato:** bozze confrontabili; poi un prototipo separato, se autorizzato.
**Si procede quando:** possiamo far svolgere i compiti principali senza spiegare
a voce come funziona la proposta.

### Fase 6 — Prove con persone nuove e revisione

**Domanda:** la proposta aiuta davvero a orientarsi e agire?

- [ ] Coinvolgere un piccolo gruppo iniziale di candidati con esperienze diverse.
- [ ] Assegnare compiti realistici senza suggerire pulsanti o percorsi.
- [ ] Osservare comprensione, completamento autonomo, esitazioni, errori e aiuti.
- [ ] Verificare che la mappa sia comprensibile e che le stime non siano lette
  come garanzie di preparazione.
- [ ] Annotare problemi per gravità, rivedere le bozze e riprovare dove necessario.

Compiti iniziali: capire cosa offre il sito; scegliere da dove partire; trovare
un esercizio di carteggio; allenare un argomento affrontato a lezione; capire un
risultato; riprendere dopo una pausa; trovare come conservare i progressi.

**Risultato:** registro delle prove e decisioni sostenute da evidenze.
**Si procede quando:** i problemi che impediscono i compiti principali sono
risolti e i limiti delle verifiche sono dichiarati. I criteri precisi vanno
stabiliti prima delle prove, senza inventare ora soglie numeriche.

### Fase 7 — Preparazione dell’implementazione

- [ ] Tradurre le decisioni in schermate, stati e criteri di accettazione.
- [ ] Distinguere modifiche di presentazione da nuove logiche o nuovi contenuti.
- [ ] Pianificare una sequenza coerente e verificare la tutela degli archivi.
- [ ] Prevedere controlli funzionali, visivi, di accessibilità e offline.
- [ ] Applicare il processo di test, versione, commit e autorizzazione al push
  del repository quando inizierà il lavoro di implementazione e rilascio.

**Risultato:** piano eseguibile, con priorità e verifiche, da approvare prima di
modificare l’app.

## 5. Vincoli che accompagnano tutte le fasi

- Logica e storico conservano le garanzie documentate nel progetto.
- Conteggi e liste derivano dalla stessa fonte; dati mancanti e guasti si vedono.
- Le anomalie dichiarate della banca restano accessibili e comprensibili.
- Nessuna promessa di account, sincronizzazione o contenuti inesistenti.
- Correttezza nautica delle immagini; colori didattici dei segnali preservati.
- Le regole di allenamento e simulazione restano distinguibili.
- Niente nuove dipendenze o riscritture architetturali implicite nel design.
- Nessuna modifica ai dati ministeriali per ragioni grafiche.

## 6. Organizzazione e prossima attività

Questa conversazione resta il luogo delle decisioni trasversali. Task separati
potranno servire successivamente per contenuti didattici, prototipi e
implementazione, con un riferimento comune alle decisioni qui raccolte.

**Prossima attività:** confrontare la struttura e i flussi consolidati nelle
specifiche UX, poi preparare le bozze della rotta e dell’ambiente Carteggio.
Restano aperte la verifica delle fonti ministeriali, la ricerca con candidati
e il recupero del riferimento originale delle isolette. L’accoglienza è definita
quanto basta per procedere con l’organizzazione; testi e domande non sono finali.

A fine incontro aggiornare le decisioni e le questioni aperte nelle specifiche;
qui aggiornare avanzamento e prossimo risultato da preparare. Non spuntare attività per
il solo fatto di averne parlato.

## 7. Riferimenti di metodo

- [Design Council — Framework for Innovation](https://www.designcouncil.org.uk/resources/framework-for-innovation/):
  comprendere, definire, esplorare, provare e migliorare.
- [Nielsen Norman Group — Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/):
  linguaggio comprensibile, controllo, riconoscibilità, stato visibile ed errori.
- [Nielsen Norman Group — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/):
  complessità presentata gradualmente, mantenendo accessibili i dettagli.

Questi principi orientano le scelte; non certificano automaticamente il design.
