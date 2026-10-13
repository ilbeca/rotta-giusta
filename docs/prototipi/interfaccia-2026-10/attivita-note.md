# P-67 — Allenati, Esame e le Preparazioni

13 ottobre 2026 · passo 3 di 5 · mock statico, non realizzazione del sito.

Apri [il confronto](attivita.html), [temi in Quiz](attivita-temi.html?vue=allenati)
o [temi nella Preparazione](attivita-preparazione.html?vue=allenati).
Base iniziale `24fbbd7`, ramo `ui/main`, albero pulito; nessun altro chat attivo
in scrittura sul worktree. Il pull iniziale non ha un upstream configurato:
nessun ramo remoto è stato scelto o integrato.

Tre HTML autoconsistenti: CSS, script, snapshot e Manrope incorporati, senza
richieste ad altri host. Il carattere proviene da P-66 e conserva
[la sua licenza](home-manrope-OFL.txt). Le viste cambiano nel medesimo documento;
l'indice di confronto è una pagina per il revisore, non una quinta voce del sito.

## Fonti

Letti AGENTS.md; [tragitti P-65 per intero](tragitti.md);
[home-note, consegna a P-67](home-note.md#consegna-a-p-67-e-allautore);
[P-59](../../idee-dopo-gli-account.md), decisioni finali, soprattutto 2, 3, 6,
8, 13 e 31, I-18, C-01 e C-02; [specifica](../../specifica.md) §1, §4.2,
§5.3, §7.2, §7.3, §8 e Q-CART4 nel §10;
[area 2](../../area-2-progetto.md) §5 e [area 4](../../area-4-progetto.md) §4–5;
[coda](../../prossime-sessioni.md) §4, Dopo P-59, punto 13 e forma del resoconto.
Letti anche filosofia, README, CHANGELOG e i contratti del motore.

La struttura Home · Allenati · Esame · Progressi più avatar è decisa.
Il mock mostra i nomi dell'autore e i titoli proposti da P-65; non li approva.
«Esercizi di carteggio», «Riconosci fanali e segnali», i titoli delle
Preparazioni e la disposizione dei temi restano confrontabili, non nuove decisioni.
Il brief richiede la forma di P-66: si ereditano Manrope, colori, barra e
separazione fra contenuto e avvisi. Nessun PRODUCT.md o DESIGN.md aggiunto fuori scope.

L'approfondimento di «Com’è fatto l’esame» è nel
[dossier del repo](../../ricerca-programma-esame.md), verifica del 9 settembre
2026, DM 323/2021 art. 6 e Allegato C. Nel mock la porta apre una sintesi e
un approfondimento testuale con fonte e data; un link per il revisore apre
questa nota in un'altra scheda. La futura pagina pubblica dovrà mantenere il
testo canonico nel documento di studio. P-67 non verifica la normativa sul web:
riporta i contratti e il dossier già richiesti dal prompt.

## I numeri e il loro confine

[attivita-snapshot.mjs](attivita-snapshot.mjs) importa il motore senza cambiarlo.
Dalla radice: `node docs/prototipi/interfaccia-2026-10/attivita-snapshot.mjs`.
Scrive [attivita-dati.json](attivita-dati.json): giorno fisso 13 ottobre 2026,
seme 67, impronte SHA-256 di motore e quattro file di banca/configurazione.
Gli HTML incorporano la stessa copia; non importano il motore a runtime e
non fanno selezioni o contabilità. Per aggiornare lo snapshot degli HTML va
sostituito il contenuto del blocco `script#fixture` con il JSON rigenerato.

La fonte principale è **senza risposte**; il ripasso usa tre errori sintetici
costruiti con `applica()`. Date, prove fatte, account e guasto sono finti,
dichiarati in pagina. Condizioni e quantità sono fatti dello snapshot, mai
misure della persona. I tre stati H0/H1/HA servono a confrontare porte e
conservazione, non simulano un database o una diagnosi cumulativa.

| Preparazione | Snapshot / condizioni | Che cosa non promette |
|---|---|---|
| Allenamento consigliato | 25 base da mirata() | Studio fatto altrove, resa individuale o durata |
| Allenamento breve | 10 da estraiNuoviPrima() | Simulazione o copertura completa |
| Argomento | 208 configurazioni base/vela, tema o voce, 20/50/100/Tutte, mai fatte/figure; daAllenare() o coda() | Conteggio rifatto dalla pagina, diagnosi o selezione multipla già operativa nel mock |
| Ripasso | 3 da coda(soloSbagliate), vuoto in H0 | Solo gli ultimi errori o solo quelli del tentativo corrente |
| Giro | base 44/85/167/249; vela 3/6/12/18 da screening() | Una moltiplicazione delle voci o una risposta giusta come padronanza |
| Quiz base | 20, 30 min, al più 4 errori da meta.prove | Esito dell'esame vero; correzione durante la prova |
| Quiz vela | 5, 15 min, al più 1 errore da meta.prove | Un secondo timer che parte senza comando |
| Base e vela | Le due condizioni separate; prima base | Carteggio incluso o unico risultato per due prove |
| Giro tecniche | 7 esercizi che incontrano 12 tecniche da giroTecniche(); carta 5/D | Tecniche ministeriali o esercizi scelti sulle debolezze |
| A tappeto | 4 da tappeto(); carta 5/D | Ripresa di una prova a metà o foglio finito come padronanza |
| Prova carteggio | 4, 60 min, almeno 3 su 4 da PROVA_CARTEGGIO; carte 5/D e 42/D dalla lista | Correzione automatica o composizione confermata dal decreto |
| Che tecnica serve? | 15 testi da coda() sulle tecniche | Esercizio risolto, classificazione ministeriale, bisogno di strumenti |
| Segnali | Quantità da domandeSegnali() / lunghezzaPartita(), quattro modalità | Righe di risposta, copertura della banca, soglia d'esame |
| Segnalibri | Fonte finta senza segni, codaSegnalibri() vuota | Portare un conteggio inventato o avviare altro al posto dei segni |
| Cerca per numero | cercaNumero(): 1.1.2-31 → base-106 oscurato; 9.9.9-9999 → ricerca valida senza risultati | Una ricerca generale implementata in pagina o un oscurato ammesso alla simulazione |
| Avatar | Guasto finto e Info; pallino persistente | Lettura del guasto come risoluzione; copia locale come accoglimento server |
| Data / prove fatte | 20 novembre 2026; tre esempi del 12 ottobre, tutti finti | Countdown, previsione, esito ufficiale, salvataggio riuscito |

Nel Carteggio materiali e **Sei tu a giudicare** precedono Inizia.
L'assunzione Q-CART4 arriva letteralmente da PROVA_CARTEGGIO.assunzione:
un esercizio per argomento è un'assunzione del sito, la 42/D non ha carburante,
una prova così può richiedere più carte; conferma con la scuola. La variante
prima i mai provati resta distinta dalla prova cieca; le riprese dello scenario
vuoto sono una lista vuota, non la promessa «solo mai fatti».

La quinta intenzione Quiz, **Simula la prova**, porta a Esame; lì i tre
pulsanti aprono le Preparazioni corrispondenti. Il giro resta dietro «Altri
modi di esercitarti». La vela usa voci, non temi; il filtro figure si spegne
col motivo. Il mock illustra un tema per volta: selezione multipla e voci
all'interno di un tema base, personalizzazione completa del ripasso e
pannelli Applica/Annulla dell'area 2 restano da riprodurre nella realizzazione
successiva a P-70. I testi conservano la capacità attuale e questo limite è
scritto accanto ai controlli: non si propone di togliere quei controlli dal prodotto.

## Esame nei quattro obiettivi

| Obiettivo | Prove pertinenti, in ordine | Base libero |
|---|---|---|
| Prima patente, motore | Carteggio, quiz base | Nella sequenza |
| Prima patente, anche vela | Carteggio, quiz base, quiz vela | Nella sequenza |
| Estensione dalla entro 12, motore | Carteggio | Sotto «Accesso libero, facoltativo» |
| Estensione dalla entro 12, anche vela | Carteggio, quiz vela | Sotto «Accesso libero, facoltativo» |
| Scelta rimandata | Tutte, vela qualificata «se la prepari» | Nella sequenza |

Nessun quiz entro 12 o prova pratica aggiunti. Data e obiettivo restano
facoltativi e modificabili; con account la scrittura deve riuscire prima
della conferma. «Le prove fatte» mostra fatti di simulazioni, con il giudizio
autovalutato della carta, e una porta dichiarata al futuro Risultato/Revisione.

## Ritorni e stati

La Preparazione base è la stessa da Home ed Esame; la carta è la stessa da
Allenati/Carteggio ed Esame. Il contesto di ritorno cambia, il contenuto no.
Chiusura e Indietro del browser ripristinano il contenuto dell'origine,
controlli, segmento, scroll e fuoco. Contesti e campi restano in memoria;
History contiene solo un riferimento numerico di navigazione. Si usa
scrollRestoration manuale per lasciare la posizione al contesto del mock.
Nessun dato anonimo salvato in storage, nessun router di produzione provato.

Prova puntuale: Carteggio → Esercizi → chiusura, fuoco `esercizi`, scroll
301 px e segmento Carteggio identici prima e dopo. Il comando di ingresso
nativo evita lo scorrimento implicito di focus/click dei locator. Non è una
prova del gesto Indietro su Android o iOS. Avatar e pallino restano visibili
anche nell'apertura illustrativa. Legale e Profilo sono porte dichiarate,
non account, servizi o testi legali canonici funzionanti.

Vuoto concreto da motore: Normativa + solo figura → zero, Inizia disabilitato
con motivo e «Rimuovi tutti i filtri»; la rimozione prepara una lista valida.
H0 nel ripasso ha la spiegazione del vuoto. Errore banca → Riprova → caricamento
senza cifre → comando **esplicito** «Mostra il caso caricato (mock)».
Fonte parziale: niente zeri diagnostici, motivo e accesso alla prova cieca.
Figura mancante nell'apertura illustrativa: avviso e nessuna risposta richiesta.
La rete non viene simulata come disponibile; nessuna promessa offline.

## Tragitti P-65 rimisurati

[tragitti-misurati.json](attivita-riscontri/tragitti-misurati.json): **144 esecuzioni**,
72 ID distinti in due varianti, senza digitazione, scorrimento o lavoro su carta.
**45 ID (02–06) attraversano Allenati/Esame**; 18 ID (01 e 07) condividono la
Preparazione di Home; 9 ID (11) provano la chiusura già dalla Preparazione.
I restanti 36 ID sono fuori dal perimetro: registrazione dalla Home, legale,
Progressi. Tutti gli ID della matrice sono riportati sotto per non perderli.

Il confine misurato è **l'apertura illustrativa dopo Inizia**, non una prima
domanda utilizzabile. Il mock mostra il primo riferimento della stessa lista
annunciata e dichiara P-69. Non sono stati eseguiti QB, QA, CC, SS o AC completi;
46, 50 e le formule dei totali di P-65 non diventano risultati di questa sessione.
La riga 07 si ferma a due tocchi, senza registrazione dal Risultato.
La riga 11 misura una chiusura, senza runner, consegna parziale o giudizi.

Per l'argomento scelto: **Allenati → tema → Inizia = tre**, oppure
**Allenati → Scegli un argomento → tema → Inizia = quattro**.
I temi nella Preparazione sono radio già visibili, non un menu da aprire:
il conteggio non nasconde un tocco. Il menu nativo iniziale avrebbe aggiunto
l'apertura del selettore; è stato sostituito prima dei riscontri finali.
Per arrivare a due serve la decisione dell'autore del punto 13 della coda.
A 375 px i temi in Quiz richiedono scorrimento: tre tocchi non provano
trovabilità o velocità; P-70 deve provare se quel costo basta con le persone.

| ID P-65 | Tocco offerto / percorso | Misura temi in Quiz / in Preparazione | Ritorno o limite |
|---|---|---|---|
| Z-H0-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| Z-H0-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| Z-H0-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| Z-H0-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| Z-H0-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| Z-H0-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| Z-H0-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| Z-H0-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-H0-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-H0-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-H0-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| Z-H0-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |
| Z-H1-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| Z-H1-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| Z-H1-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| Z-H1-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| Z-H1-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| Z-H1-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| Z-H1-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| Z-H1-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-H1-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-H1-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-H1-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| Z-H1-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |
| Z-HA-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| Z-HA-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| Z-HA-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| Z-HA-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| Z-HA-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| Z-HA-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| Z-HA-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| Z-HA-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-HA-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-HA-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| Z-HA-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| Z-HA-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |
| F-H0-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| F-H0-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| F-H0-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| F-H0-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| F-H0-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| F-H0-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| F-H0-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| F-H0-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-H0-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-H0-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-H0-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| F-H0-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |
| F-H1-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| F-H1-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| F-H1-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| F-H1-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| F-H1-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| F-H1-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| F-H1-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| F-H1-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-H1-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-H1-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-H1-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| F-H1-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |
| F-HA-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| F-HA-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| F-HA-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| F-HA-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| F-HA-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| F-HA-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| F-HA-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| F-HA-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-HA-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-HA-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| F-HA-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| F-HA-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |
| R-H0-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| R-H0-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| R-H0-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| R-H0-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| R-H0-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| R-H0-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| R-H0-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| R-H0-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-H0-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-H0-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-H0-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| R-H0-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |
| R-H1-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| R-H1-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| R-H1-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| R-H1-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| R-H1-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| R-H1-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| R-H1-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| R-H1-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-H1-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-H1-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-H1-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| R-H1-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |
| R-HA-01 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| R-HA-02 | Allenati → tema → Inizia / Allenati → Scegli un argomento → tema → Inizia | 3 / 4 | Preparazione identica al ritorno; origine conservata |
| R-HA-03 | Allenati → Carteggio → Esercizi → Inizia | 4 / 4 | Preparazione identica al ritorno; origine conservata |
| R-HA-04 | Allenati → Carteggio → Esercizi → A tappeto → Inizia | 5 / 5 | Preparazione identica al ritorno; origine conservata |
| R-HA-05 | Esame → Prova di carteggio → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| R-HA-06 | Allenati → Segnali → Inizia | 3 / 3 | Preparazione identica al ritorno; origine conservata |
| R-HA-07 | Home → Simula il quiz base → Inizia | 2 / 2 | Home; Risultato e registrazione P-69 |
| R-HA-08 | Avatar / registrazione dalla Home | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-HA-09 | Privacy | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-HA-10 | Condizioni per l’account | Non rimisurato: fuori P-67 | P-66; acquisizione e legale canonico nella realizzazione |
| R-HA-11 | Chiudi dalla Preparazione base già aperta | 1 / 1 | 1 chiusura a Home; uscita runner P-69 |
| R-HA-12 | Progressi | Non rimisurato: fuori P-67 | P-66; dettaglio in P-68/P-69 |

Porte secondarie P-65, verificate per struttura e controlli puntuali:

| Porta | Tocco offerto e costo da Home (default) | Limite |
|---|---|---|
| Base da Esame | Esame → Simula il quiz base → Inizia: 3 | Stessa scheda di Home; niente QB completo |
| Carta da Allenati | Allenati → Carteggio → Prova di carteggio → Inizia: 4 | Stessa scheda di Esame; niente CC completo |
| Tecniche | Allenati → Carteggio → Che tecnica serve? → Inizia: 4 | Nessun lavoro su carta o giudizio numerico |
| Vela / base e vela | Esame → prova → Inizia: 3 | Esiti distinti futuri; base e vela facoltativi nell'estensione |
| Mirata / ripasso | Allenati → intenzione → Inizia: 3 se disponibile | In H0 ripasso vuoto, nessun avvio implicito |
| Giro | Allenati → Altri modi → Un giro → Inizia: 4 | Anche il tocco della disclosure conta |
| Breve | Allenati con 10 domande → Inizia: 2 | Allenamento, nessuna simulazione |
| Ricerca | Allenati → Cerca → campo → Cerca: 4, digitazione esclusa | Solo due fixture, nessuna ricerca generale in HTML |
| Segnalibri | Allenati → Segnalibri: 2 al vuoto dichiarato | Nessun avvio della lista vuota |
| Segnali, altre modalità | Allenati → Segnali → modalità → Inizia | Selettore nativo: apertura e scelta sono gesti opzionali aggiuntivi; nessun totale unico dichiarato |
| Guida esame | Esame → Com’è fatto l’esame: 2 alla sintesi | Disclosure aggiunge un tocco, dossier datato nel repo |
| Bozza / prove fatte | Carteggio o Esame → porta nominata | Sagome P-69, nessuna ripresa o revisione reale |
| Progressi → voce → Allena / Rifai | Porta Progressi visibile nella barra | P-68: mappa e lista reale da disegnare; non conteggiati |
| Avatar / Info / legale | Avatar → Info; chiusure all'origine | Porte illustrate, nessun testo canonico o servizio |

I numeri delle porte secondarie sono conteggi della struttura cliccabile;
solo le esecuzioni con ID nel JSON e i controlli puntuali sotto sono prove
registrate, non un collaudo completo di ogni percorso secondario.

## Browser e review

[misure.json](attivita-riscontri/misure.json): **110 misure** in Chrome,
53 viste/stati × due larghezze, due risultati di ricerca espansi a 375 e
indice a 375/1280. In ogni misura: larghezza richiesta, clientWidth,
scrollWidth, elementi oltre bordo, titolo, numero di principali attive.
**Zero sbordamento orizzontale**: scrollWidth = clientWidth, max eccedenza 0 px.
Il viewport è 375/1280; lo scrollbar riserva 15 px sulle pagine lunghe,
quindi il client è 360/1265. Nessun overflow nascosto per mascherare difetti.
Nessuna vista ha più di una principale attiva. Pagine di lettura/vuoto possono
avere solo ritorno o alternative: Inizia non diventa un comando senza effetto.

Gli screenshot integrali corrispondono ai nomi nel JSON. Ispezionati il
confronto, Allenati/Quiz, Esame, Preparazione carta, tema e ricerca, alle due
larghezze. [Carta a 375](attivita-riscontri/p14-375.png),
[Esame a 1280](attivita-riscontri/p58-1280.png).
[controlli.json](attivita-riscontri/controlli.json): 5 confronti, Preparazioni
comuni e ritorno esatto. [controlli-finali.json](attivita-riscontri/controlli-finali.json):
32 esiti verdi, 18 chiusure, 5 obiettivi con base libero, vuoto/rimozione/vela.
Ricerca e Riprova/caricamento esercitati nel browser; screenshot della ricerca
con avviso prima della risposta. Le 126 aperture hanno ritorno alla stessa
Preparazione; le altre 18 misurano la chiusura della riga 11.

Impeccable: rilevatore meccanico eseguito una volta. Due avvisi di padding
sulla barra di mock nelle due varianti; l'inset è in .wrap, non nel parent.
[stili.json](attivita-riscontri/stili.json) misura 82,5 px per lato a 1280;
a telefono .wrap mantiene il margine di P-66. Riscontro visivo: il testo non
è a filo del bordo. Nessun redesign o correzione automatica della struttura.

| Criterio del prompt | Esito / evidenza |
|---|---|
| Solo prototipi, eccezione CHANGELOG | Diff nominato; site/, tests/, versione e coda esclusi |
| Tre segmenti, cinque intenzioni e ricerca | Due HTML, indice e due ricerche con uscita esplicita |
| Materiali, giudizio e Q-CART4 prima dell'avvio | Testo visibile nella Preparazione e screenshot carta |
| Esame ordinato e quattro obiettivi | 5 casi, condizioni dal contratto e base facoltativo per estensione |
| Preparazioni comuni e ritorni | 5 controlli puntuali; 144 percorsi con esito registrato |
| Tre contro quattro senza decidere nomi | 18 esecuzioni dell'argomento con radio visibili; nome della barra invariato |
| Errori, vuoto e guasto persistente | Avvio bloccato col perché; recovery esplicito; avatar e Info |
| Quantità e stati senza ingannare | Snapshot reale su fonte finta, nessuna misura della persona |
| Browser e zero sbordamento | 110 misure, screenshot, stili calcolati; niente overflow nascosto |

Review contro il prompt: **passa come mock**, con i confini dichiarati.
Guardiano e controllo della documentazione vengono eseguiti dopo questa nota;
i numeri sono riportati nel CHANGELOG e nel resoconto. Le suite motore,
server, dati, interfaccia e specifica non sono state rilanciate: nessun file
che ne cambi codice o requisiti è stato modificato. Non sono stati provati
telefono fisico, Safari, lettore di schermo o usabilità con persone.

## Che cosa resta

**P-68:** Progressi: «sei qui», mappa, cinque stati coi nomi dell'autore,
riepilogo della pagina anonima, spiegazione della proposta, porte Allena e
Rifai con la lista promessa. Nessuna stima ancora non validata.

**P-69:** attività, timer, scadenza e interruzione; Risultato e Revisione,
registrazione sopra Risultato, due fasi base/vela, bozza su carta e ripresa,
confronto e giudizi, Segnali senza barra ma con avatar e pallino. I totali
completi di P-65 andranno rimisurati soltanto lì. Nessuna consegna parziale
è dimostrata dall'apertura illustrativa di questa sessione.

**Per l'autore / P-70:** confrontare le due posizioni dei temi e i nomi
ancora proposti; decidere se i tre tocchi bastano. Se vuoi due tocchi,
serve richiamo diretto dalla Home o salto della Preparazione (coda §4.13).
I temi a telefono sono sotto lo scorrimento: i bot o il numero dei tocchi
non dimostrano che una persona li trovi. Q-CART4 resta della scuola nautica.

**Realizzazione dopo P-70:** selettori completi dell'area 2, vero router,
URL diretto e cronologia su dispositivo, legale canonico senza cambio documento,
account e acquisizione/invio con uid prima/dopo ogni freccia. Nessuno di
questi controlli è sostituito dal mock o dal guardiano verde.

Nessuna modifica alla coda; niente bump, tag, push, pubblicazione o produzione.
