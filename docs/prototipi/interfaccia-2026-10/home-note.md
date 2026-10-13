# P-66 — La Home nei tre stati

13 ottobre 2026 · passo 2 di 5 · mock, non modifica del sito né nuova specifica.

Apri [il confronto](home.html): H0, H1, HA e tre casi dell’account
(caricamento, errore, vuoto confermato). **Dodici pagine**, ogni caso con
nomi approvati e proposti; tredicesimo HTML per il confronto.
Ogni pagina contiene CSS, script e carattere, e si apre anche dal file locale.
Le schermate delle funzionalità sono anteprime HTML illustrative, non immagini
del sito di oggi né prove di un’implementazione. Nessuna risorsa da altri host.

## Fonti e precedenze

Letti AGENTS.md; [P-65 per intero](tragitti.md); [P-59](../../idee-dopo-gli-account.md),
le decisioni e I-01/I-09/I-13/I-15; [ADR-006](../../adr/ADR-006-l-invito-in-home-il-sito-che-spiega-la-costanza-e-la-stima.md)
per intero; [specifica](../../specifica.md) §1, §4.3, §7.1;
[filosofia](../../filosofia.md), «Non ti inganniamo mai»;
[esito d’esame](../../esito-esame-progetto.md) §3.2 e §3.5;
[coda](../../prossime-sessioni.md) §4, «Dopo P-59», 4 e 13.
P-59 finale prevale sulle proposte precedenti nelle schede.

Struttura decisa: **Home · Allenati · Esame · Progressi, più avatar**.
Nomi, composizione, porte e futura meccanica restano distinguibili:
nessuna scelta sui nomi o su Q-COSTANZA è stata presa da P-66.
Non è stato creato un PRODUCT.md o un DESIGN.md: il perimetro di questo prompt
è la cartella dei prototipi, e le decisioni di prodotto sono già nelle fonti.

## Che cosa mostra ogni stato, e che cosa non promette

| Elemento | Che cosa mostra | Che cosa non promette |
|---|---|---|
| H0 | Benefici, banca ufficiale, due pulsanti, porte con segmenti, limiti | Nessuna prima visita riconosciuta, nessun livello a zero, nessun test d’ingresso obbligatorio |
| Simula il quiz base | Azione principale in H0/H1; 20 domande · 30 minuti · al più 4 errori | Un tocco apre la Preparazione, non la prima domanda. Non simula tutte le prove e non corregge durante la prova |
| Allenati con 10 domande / Prova 10 domande | Azione secondaria; correzione dopo ogni risposta | Non è una simulazione, non promette una durata o copertura completa |
| H1 | Dieci righe finte: 7 giuste e 3 sbagliate, un solo allenamento | Nessuno storico recuperato, diagnosi cumulativa, percentuale, freccia, ritmo o minuto suggerito |
| Invito H1 | Conservare le risposte sul server, ritrovarle da un altro dispositivo, scaricarle; chiusura con Continua senza account | Nessun Percorso già realizzato, nessuna diagnosi sotto soglia, nessun salvataggio prima che copia e server lo confermino |
| HA proposta | Una proposta principale: 8 quesiti da confermare, perché sono trascorse almeno 12 ore; rimando a Progressi | Dato finto, non selezione del motore. Nessuna stima e nessun “sei pronto” |
| HA fatti | Ultima simulazione: 2 errori su 20, 11 ottobre, esempio finto | Non è un pronostico sull’esame o un esito dell’esame vero |
| HA costanza | 6 giorni di attività negli ultimi 14, esempio finto | Nessuna serie che si spezza, badge, notifica o traguardo. Non è deciso che cosa faccia un giorno; non è deciso come contare i Segnali. Dopo 14 giorni senza attività il numero può essere zero |
| Tempo al giorno | Non compare | Nessuna durata inventata da dati insufficienti, nessun “bastano N minuti” |
| HA caricamento | Stiamo caricando le tue risposte | Mai una mappa vuota provvisoria, zeri, proposta o costanza da risposte non ancora arrivate |
| HA errore | Motivo e Riprova, unica azione principale | Riprova apre il caso statico di caricamento, non finge una richiesta al server riuscita |
| HA vuoto | Account caricato e nessuna risposta; libera simulazione e porta al file in Profilo | Il vuoto non prova che l’account sia nuovo e non diventa una diagnosi a zero |
| Avatar e guasto | Avatar nominato Accedi/Account, pallino ambra e guasto finto dichiarato nel pannello | Leggere il guasto non lo risolve; una copia sul dispositivo non prova l’accoglimento sul server |
| Allenati | Quiz · Carteggio · Segnali nominati; anteprima dei tre mestieri | I Segnali sono extra banca; il carteggio è autovalutato e richiede strumenti. Nessuna porta nascosta sotto Quiz/Altro |
| Esame | Prove in ordine; carteggio propedeutico; vela condizionata all’obiettivo | La simulazione base è libera, ma facoltativa per l’estensione dalla entro 12; nessun blocco da età/livello/tempo richiesto |
| Spiegazioni | Beneficio qualificato: quando disponibili, solo verificate, per tutti | Nessuna spiegazione ancora assente venduta come esistente, nessuna spiegazione prima della risposta |
| Difetti | Conteggi dalla banca, fonte, note sui flap e assenza della figura, giudizio della carta | Nessun 11 copiato come se fosse stato contato, nessuna risposta del decreto cambiata per convinzione |
| Porte legali | Un pannello sopra l’origine, con Chiudi; condizioni su /avvertenza#condizioni nella descrizione | Nessun testo legale duplicato, nessun router del sito implementato, nessuna prova dell’host o di Indietro/Avanti |

Le soglie della specifica restano quelle esistenti: prima risposta per riga
solo da 5 quesiti distinti, frase di peso da 20, ritmo affidabile da 30 risposte
misurate, tendenza da 2 giorni e 10 risposte. H1 non mostra nessuna di queste
misure. La sua fixture non porta nemmeno timestamp affidabili: dieci righe non
bastano a costruire un andamento. La proposta HA e il 6 su 14 sono esempi
**esplicitamente finti**, non una nuova contabilità in pagina.

## Il posto di «com’è andata»

HA caricato mostra la **richiesta**, non un esito dichiarato affiancato a una
simulazione. È separata dalla riga di fatti e il testo indica che gli esiti
si vedono solo in **Profilo → Il tuo esame**, senza confronto con simulazioni,
previsioni, altri utenti o medie (§3.5). Il pannello futuro separerà le quattro
prove; non è stato costruito il modulo di raccolta.

Scenario visibile: oggi 13 ottobre 2026, esame 10 ottobre, tre giorni trascorsi,
nessuna riga d’esito. Il contratto per la realizzazione è quello di §3.2:
account presente, data locale uguale alla data d’esame o successiva, distanza
**da 0 a 90 giorni inclusi**, nessun esito con giorno da trenta giorni prima
della data in poi. Data futura, assente, più di 90 giorni o esito già presente:
il richiamo non c’è; **Il tuo esame** resta sempre nel Profilo.
Questi confini sono documentati, non un algoritmo realizzato nel mock statico.

Tre porte: Rispondi → sagoma del modulo; Non l’ho ancora fatto → testo della
modifica della data; Non chiedermelo più → chiusura del riquadro con avviso
esplicito che il mock non ha salvato niente. Nel prodotto l’ultimo gesto
scrive “non detto” per quel giorno e agisce su tutti i dispositivi; qui no.

## Due varianti, senza decidere i nomi

| Punto | Nome approvato | Proposta P-65 visualizzata |
|---|---|---|
| Secondo pulsante H0/H1 | Allenati con 10 domande | Prova 10 domande |
| Pannello dell’avatar anonimo | Accedi, poi Crea un account | Accedi o registrati, con Crea un account visibile |
| Porta Allenati | Allenati, con i tre segmenti nominati nel blocco | Richiamo Quiz · Carteggio · Segnali immediatamente accanto alla porta |

L’avatar resta **Accedi** in entrambe: P-65 propone il nome del pannello,
non la rinomina dell’avatar. HA non mostra un invito a creare un altro account.
Le varianti conservano le stesse porte e gli stessi tocchi. Il richiamo
proposto ripete volutamente i nomi vicino alla porta: l’autore può confrontare
la trovabilità con l’ingombro, senza che P-66 scelga al suo posto.

## Dati finti e conteggi reali

[home-dati.json](home-dati.json) è la fixture dichiarata. Le dieci risposte H1
sono anche visibili in pagina: i tre errori sono le domande 3, 6 e 9.
L’ultima simulazione HA, costanza, proposta, date e guasti sono tutti finti;
non provengono da un account vero o da un motore eseguito sullo storico.

I **conteggi reali** si ricavano da `site/dati/quiz.json` del checkout, letto
senza modificarlo: `sum(bool(q.get(campo)) for q in banca)` per `osc`, `nb`,
`fm`; per le note del DM, `sum('133/2024' in (q.get('nb') or '') for q in banca)`.
Totali di banca: `len(quiz)` e `len(carteggio)`. Riscontro del 13 ottobre:

- 1.722 quesiti, 135 esercizi di carteggio;
- 37 oscurati (`osc`); 37 avvisi prima della risposta (`nbp`);
- 4 note dopo la risposta (`nb`), di cui 3 con DM 133/2024;
- 1 quesito senza figura (`fm`), base-59;
- 119 quesiti con un riferimento figura (`f`): non sono 119 disegni distinti.

Sono **snapshot contati**, non costanti di prodotto: il mock è autoconsistente
e non scarica la banca. Prima di riusarlo con una banca diversa vanno ricontati.
L’impronta SHA-256 del quiz sta in `home-dati.json`.
Il numero storico delle figure riabbinate viene dal README e non dal campo `f`:
non è ripresentato come un conteggio della banca.

**Trovato:** `site/index.html` e README dichiarano 11 quesiti divergenti dal
DM 133/2024; il JSON locale contiene solo 3 note che lo citano, più quella sui
flap. Non deduciamo che siano solo tre le divergenze normative reali: questo
è il conteggio delle note presenti, e non una nuova ricerca giuridica.
La regia deve confrontare banca e testi; P-66 non tocca dati, README o sito.

Carattere: Manrope, incorporato nel singolo HTML dalla risorsa già dichiarata
nel README, `site/caratteri/manrope-latin-wght-normal.woff2`. La licenza SIL OFL
è riprodotta in [home-manrope-OFL.txt](home-manrope-OFL.txt). Nessun asset da
altri host e nessuna immagine generata o materiale di terzi nuovo.

## Misure nel browser, non conteggi di carta

Riscontri nel **browser integrato di Codex, Chromium**, viewport CSS
**375 × 812** e **1280 × 900**. Dodici pagine × due larghezze = **24 combinazioni**.
[Misure grezze](home-riscontri/misure.json) e 24 screenshot completi
`home-riscontri/<stato>-<variante>-<larghezza>.png` restano accanto al mock.
Ogni misura registra viewport, `document.documentElement.scrollWidth`, larghezza
del body, bounding box fuori dal viewport, font e risorse esterne dichiarate.

- Tutte e 24, più l’indice alle due larghezze (26 misure totali): `scrollWidth == innerWidth`, body uguale al viewport,
  **zero sbordamenti orizzontali**, nessun elemento visibile fuori dai bordi.
  Non è stato usato `overflow-x:hidden` per nasconderli.
- H0/H1: pulsante e condizioni della simulazione terminano prima della piega
  in entrambe le varianti. A 375 px il fondo delle condizioni è 493–513 px;
  a 1280 px è 515 px. HA: 799 px su 812 a 375, 355 px su 900 a 1280.
- 100 aperture di porte, sui tre stati principali × due varianti × due
  larghezze: titolo atteso, **1 tocco all’arrivo, 2 con Chiudi**, stesso
  documento e fuoco restituito alla porta, pallino non cancellato.
- Modulo: H0 in 2 tocchi, H1 in 1, per entrambe le varianti a 375.
  Legale sopra modulo → Chiudi → modulo; Continua senza account chiude.
  Il valore dei campi è redatto dall’API: nessuna asserzione automatica sul
  valore. Guardato lo screenshot [modulo-legale-375](home-riscontri/modulo-legale-375.png):
  il campo di esempio finto è ancora compilato dopo la chiusura del legale.
- H1: Continua senza account nasconde l’invito, conserva le 10 righe della
  fixture e mostra l’avviso di perdita alla ricarica; entrambe le varianti.
- Errore: Riprova apre lo stato Stiamo caricando le tue risposte, senza
  ripiego su una mappa vuota. È una navigazione tra fixture, non rete reale.

La prima lettura mobile ha portato a rendere il breve un pulsante secondario
e a compattare HA, per tenere le condizioni della simulazione sopra la piega.
La conferma misura lo stato finale. La composizione eredita marchio, Manrope,
navy, blu leggibile e carta del sito; non introduce un’identità di marca nuova.
Il controllo meccanico di Impeccable non è eseguito: la cache della skill è
passata da 4.5.0 a 4.5.2 durante la sessione e il nuovo motore non è installato.
Non sono state installate dipendenze per questo mock. La review visiva e le
misure sopra sono dirette; non si attribuisce un verde allo strumento assente.

**Limiti:** nessuna prova con persone, telefono fisico, Safari, zoom nativo,
screen reader o gesto Indietro/Avanti del sistema. Nessun invio/acquisizione
reale, nessun uid, nessuna sincronizzazione o continuità dell’app di oggi
verificata. Le dieci righe fisse non provano la conservazione di risposte vere.

## Ogni tragitto P-65: il tratto offerto dalla Home

Le misure sottostanti si riferiscono al **tratto effettivamente presente**:
porta Home → pannello di destinazione, non al compito completo. Le anteprime
non sono altre porte. Le famiglie di tragitti condividono il medesimo comando;
Z/F/R cambiano intento e tema, non struttura. Le 100 aperture verificano le
porte comuni; non sono 108 attività completate.

Per 07 l’arrivo al modulo dal Risultato non è misurabile: P-66 offre solo
l’inizio della stessa simulazione, senza costruire runner e Risultato.
Per 11 non c’è una partenza dalla Home: P-65 parte da Preparazione/runner già
aperti; qui si misura soltanto Chiudi dal pannello aperto dalla Home.
Nove righe 11 sono dunque incluse per completezza, **99 tragitti partono da Home**.
I totali completi di P-65 rimangono conteggi di progetto, non diventano misure
empiriche per il fatto che esiste questa Home.

| ID P-65 | Tocco offerto dal mock | Conteggio rimisurato / confine |
|---|---|---|
| Z-H0-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| Z-H0-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-H0-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-H0-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-H0-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| Z-H0-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-H0-07 | Simula il quiz base | 1 alla Preparazione; domanda e modulo da Risultato non presenti |
| Z-H0-08 | Avatar Accedi → Crea un account | 2 al modulo illustrativo; AC non eseguito |
| Z-H0-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| Z-H0-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| Z-H0-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| Z-H0-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |
| Z-H1-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| Z-H1-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-H1-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-H1-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-H1-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| Z-H1-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-H1-07 | Simula il quiz base | 1 alla Preparazione; domanda e modulo da Risultato non presenti |
| Z-H1-08 | Conserva le risposte | 1 al modulo illustrativo; AC non eseguito |
| Z-H1-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| Z-H1-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| Z-H1-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| Z-H1-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |
| Z-HA-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| Z-HA-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-HA-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-HA-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-HA-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| Z-HA-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| Z-HA-07 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| Z-HA-08 | Avatar Account | 1 al Profilo, 2 con Chiudi; nessuna nuova registrazione |
| Z-HA-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| Z-HA-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| Z-HA-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| Z-HA-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |
| F-H0-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| F-H0-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-H0-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-H0-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-H0-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| F-H0-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-H0-07 | Simula il quiz base | 1 alla Preparazione; domanda e modulo da Risultato non presenti |
| F-H0-08 | Avatar Accedi → Crea un account | 2 al modulo illustrativo; AC non eseguito |
| F-H0-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| F-H0-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| F-H0-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| F-H0-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |
| F-H1-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| F-H1-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-H1-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-H1-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-H1-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| F-H1-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-H1-07 | Simula il quiz base | 1 alla Preparazione; domanda e modulo da Risultato non presenti |
| F-H1-08 | Conserva le risposte | 1 al modulo illustrativo; AC non eseguito |
| F-H1-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| F-H1-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| F-H1-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| F-H1-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |
| F-HA-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| F-HA-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-HA-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-HA-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-HA-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| F-HA-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| F-HA-07 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| F-HA-08 | Avatar Account | 1 al Profilo, 2 con Chiudi; nessuna nuova registrazione |
| F-HA-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| F-HA-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| F-HA-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| F-HA-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |
| R-H0-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| R-H0-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-H0-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-H0-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-H0-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| R-H0-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-H0-07 | Simula il quiz base | 1 alla Preparazione; domanda e modulo da Risultato non presenti |
| R-H0-08 | Avatar Accedi → Crea un account | 2 al modulo illustrativo; AC non eseguito |
| R-H0-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| R-H0-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| R-H0-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| R-H0-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |
| R-H1-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| R-H1-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-H1-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-H1-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-H1-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| R-H1-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-H1-07 | Simula il quiz base | 1 alla Preparazione; domanda e modulo da Risultato non presenti |
| R-H1-08 | Conserva le risposte | 1 al modulo illustrativo; AC non eseguito |
| R-H1-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| R-H1-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| R-H1-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| R-H1-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |
| R-HA-01 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| R-HA-02 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-HA-03 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-HA-04 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-HA-05 | Esame | 1 alla porta Esame; prova di carteggio non presente (P-67) |
| R-HA-06 | Allenati → pannello Quiz e nomi dei tre segmenti | 1 alla porta Allenati; attività e prima domanda/esercizio non presenti (P-67) |
| R-HA-07 | Simula il quiz base | 1 alla Preparazione; domanda e Risultato non presenti |
| R-HA-08 | Avatar Account | 1 al Profilo, 2 con Chiudi; nessuna nuova registrazione |
| R-HA-09 | Privacy nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| R-HA-10 | Condizioni per l’account nel piè di pagina | 1 al pannello, 2 con Chiudi; testo canonico non caricato |
| R-HA-11 | Chiudi, da un pannello già aperto | 1 al ritorno; non parte da Home; runner e consegna parziale non presenti |
| R-HA-12 | Progressi | 1 al riepilogo/sagoma, 2 con Chiudi; mappa e revisione non presenti (P-68/P-69) |

Altre porte dell’albero P-65 che partono direttamente dalla Home:

| Porta | Misura sul mock | Resta da costruire |
|---|---|---|
| Allenamento breve | 1 alla Preparazione, 2 con Chiudi | Inizia e runner; il nome varia, i tocchi no |
| Perché questa proposta? [HA] | 1 a Progressi/punto della proposta, 2 con Chiudi | Mappa e spiegazione dai dati del motore |
| Proposta del giorno [HA] | 1 alla Preparazione consigliata, 2 con Chiudi | Lista unica del motore e avvio |
| Com’è fatto l’esame | Porta Esame, stesso pannello | Sintesi, approfondimento e fonti datate in P-67 |
| Che cosa non torna → Note, fonti e riferimenti | 1 al pannello, 2 con Chiudi | Elenco navigabile e note dei singoli quesiti |
| Avatar → Info e diagnostica / Dati / impostazioni / Il tuo esame | Avatar misurato in 1; il resto non contato come tragitto completo | Pannelli del Profilo e operazioni reali |

## Consegna a P-67 e all’autore

**P-67:** disegnare Allenati nei tre segmenti, Esame nelle prove pertinenti,
le Preparazioni identiche da più porte e i ritorni. Mostrare la variante con
temi direttamente nel segmento Quiz: **F-H0-02**, e analoghi H1/HA, scende da
quattro a tre tocchi alla prima domanda nel progetto. P-66 **non ha ridotto**
quei tragitti inserendo una porta diretta Home → tema o saltando Preparazione.
Per arrivare a due tocchi serve la decisione dell’autore del §4, punto 13;
la trovabilità va poi provata in P-70, non dedotta da un link cliccabile.

**P-68/P-69:** dettaglio Progressi e nomi degli stati; runner, Risultato,
Revisione, invito dal Risultato e ritorni. Segnali separati dalla copertura,
avatar con guasto anche quando la barra sparisce. Router, Indietro/Avanti,
legale canonico, account e acquisizione/invio si proveranno nella realizzazione,
con risposte vere e uid prima/dopo ogni passaggio, come richiede P-65.

**Per l’autore:** confrontare le varianti del breve, del pannello account e
del richiamo ai tre segmenti; non sono nomi promossi a decisione. Q-COSTANZA
resta aperta: il mock mostra il posto, non decide la soglia o le date dei
Segnali. Per la regia: la discrepanza 11 / 3 note DM 133/2024 descritta sopra,
senza confonderla con una nuova verifica normativa.

## Review contro il prompt

| Criterio | Esito e prova |
|---|---|
| Cartella, ramo, una penna | rotta-giusta-ui, ui/main; albero iniziale pulito, nessun altro chat scrivente attivo nella cartella |
| Solo cartella prototipi, eccezione CHANGELOG richiesta | Diff per nome prima del commit; nessuna modifica a site/, tests/, versione o coda |
| Tre stati, caricamento, errore, vuoto | Dodici file e relativi screenshot; nessuna mappa o cifra provvisoria |
| Un’azione principale, simulazione visibile | Gerarchia visiva e bounding box: H0/H1 simulazione piena, HA proposta piena e simulazione secondaria, errore Riprova |
| Invito chiudibile e riepilogo H1 | Due chiusure provate; dieci righe restano visibili; niente metriche sotto soglia |
| Costanza, proposta, com’è andata | Dati finti accanto ai numeri, ragione, tre porte dell’esito, nessun pronostico o serie |
| Conteggi banca e guasto visibile | Snapshot ricontato e impronta, pallino sempre presente; discrepanti le 11 note nei testi attuali |
| Varianti senza decisione | HTML paralleli; pannello Accedi / Accedi o registrati, breve e richiamo segmenti |
| ID e conteggi P-65 | 108 ID espliciti, confini dichiarati; 100 aperture, non 108 compiti completati |
| Browser alle due larghezze | 24 misure e screenshot, zero sbordamento; non device fisico o test con persone |

Guardiano e controllo condiviso della documentazione eseguiti dopo la nota,
con risultato riportato nel CHANGELOG e nel resoconto. Le suite motore,
server, dati, interfaccia e specifica non vengono rilanciate: il lavoro è un
mock separato, senza modifiche al codice o ai requisiti da loro controllati.
Il controllo sulla nota verifica 108 ID univoci e tutti i riferimenti locali.
Un commit su ui/main con trailer; niente bump, tag, push o pubblicazione.
