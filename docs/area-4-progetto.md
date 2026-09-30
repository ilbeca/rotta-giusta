# Area 4 — Carteggio: il lavoro sulla carta e il giudizio di chi studia

**Sessione P-20, decisioni di progetto del 26 settembre 2026, da realizzare.**
Consegna sul modello delle aree [1](area-1-progetto.md),
[2](area-2-progetto.md) e [3](area-3-progetto.md): testi per esteso,
disposizione, stati, flussi, contratti e accettazione. Non è un'interfaccia
realizzata né una verifica di usabilità. Questa sessione modifica soltanto
questo documento e il CHANGELOG; ordine e prompt restano esclusivamente in
[prossime-sessioni.md](prossime-sessioni.md).

Chi arriva può conoscere i quiz ma non il funzionamento del Carteggio. Chi
torna può avere carta e strumenti sul tavolo, oppure soltanto il telefono.
Deve sapere che cosa occorre, chi giudica e che cosa resta del lavoro, prima
di dedicargli tempo. La schermata deve farlo sentire al tavolo, con libertà di
fermarsi e senza scambiare un risultato coincidente per un procedimento giusto.

## 1. Fonti, precedenze e perimetro

Letti i capitoli **12–15** della *Specifica della nuova esperienza e
interfaccia*, revisione del 12 settembre 2026, copia esterna al repo
`Rotta-Giusta-Specifica-UX-UI (1).docx`, SHA-256
`b3384dc24d62245e6315a78205d3b240c271dc1ebc17cf37274f805a702f6cc4`.
Le scelte necessarie sono riportate qui: la realizzazione non richiede il Word.

Riferimenti del repository:

- [Specifica di lavoro](prossima-versione.md), §§4–6 e 8: fetta 4 e tempo.
- [Specifica del prodotto](specifica.md), §§3.1, 4.5, 7.3, 7.6, 9–10:
  R-UX-03, Q-CART4 e Q-AMBITO; [README](../README.md) per provenienza,
  classificazione delle tecniche e limiti della composizione della prova.
- [Filosofia](filosofia.md), [ADR-004](adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md)
  e [progetto del client](account-client-progetto.md), §§3–6 e 9–10:
  permanenza, accesso, invito finale e salvataggio effettivo.
- [Area 2](area-2-progetto.md), §§6–10: configurazioni locali, snapshot e
  dipendenze; [area 3](area-3-progetto.md), §§3–10: conclusione, revisione,
  identità dell'attività, ritorni e controlli.
- `site/app.html`: `dipingiCart()`, `componiProva()`, `argomentiSenzaNuovi()`,
  `avviaCart()`, `annotaCart()`, `consegnaCart()`, `dipingiCorrezione()`,
  `salvaCart()`, `chiudiCart()`, `rivediCarteggio()`, `apriTec()`,
  `mostraTec()`, `correggiTec()` e relativi gestori, letti senza edit.
  `site/engine.js`: `giroTecniche()`, `tappeto()`, `coda()`, `estrai()`,
  `estraiNuoviPrima()`, `ripiega()`, `sessioni()` ed `erroriSessione()`.

**Precedenza:** prompt P-20, ADR-004 e client prevalgono sulle promesse di
conservazione anonima dei progetti anteriori e del Word. Il client è la fonte
degli stati di accesso: qui si consumano, senza moduli o politiche concorrenti.
Il tempo delle prove è una condizione, non una stima di durata personale.

**Entra:** ingresso autonomo, guida dimostrativa, tre porte, preparazioni,
runner sulla carta, confronto, autovalutazione, riepilogo e revisione di tutte
le attività di Carteggio, riconoscimento delle tecniche e ritorni. Il ciclo
dell'area 3 si estende a questi filoni con le differenze motivate al §7.

**Non entra:** `carteggio_e12.json` (Q-AMBITO), scelta della patente, motore,
dati, test, specifica canonica, nuovi materiali didattici o soluzioni,
analisi di foto, correzione numerica, nuove metriche, redesign di Progressi,
server/client account o gioco dei Segnali. Le porte Segnali esistenti da
Percorso e COLREG rimangono: il capitolo 15 non autorizza a rifare quel gioco.

## 2. Decisioni da applicare

| Decisione | Scelta e motivo |
|---|---|
| Tre porte | **Prova di carteggio / Esercizi su carta / Che tecnica serve?** sempre visibili, senza obbligo di quiz, guida o account. |
| Prima spiegazione | Materiali e giudizio nell'ingresso e in ogni preparazione; nessuna informazione decisiva nascosta in un disclosure. |
| Due contesti | «Ho carta e strumenti» porta agli esercizi; «Sono senza strumenti» alle tecniche. Sono scorciatoie facoltative, non un questionario obbligatorio. |
| Prova | Quattro esercizi, 60 minuti, soglia 3; un esercizio per argomento è **l'assunzione di questo sito**, da confermare con la scuola. Nessun filtro per una sola carta. |
| Allenamenti su carta | Giro delle tecniche e tappeto, senza soglia e senza autoconsegna. Selezioni esistenti del motore, non una diagnosi delle debolezze. |
| Giudizio | «Il risultato coincide» / «Da rivedere», nessuno preselezionato; tolleranze ufficiali visibili e `delta: null`. |
| Giudizio rinviato | Si può rimandare nella pagina aperta. Nessun terzo valore archivistico inventato e nessun `null` trasformato in errore. |
| Fine | Confronto → riepilogo → revisione o nuova preparazione. La consegna non chiude direttamente l'ambiente con una notifica. |
| Revisione | Risposte proprie, ufficiali e giudizi dello stesso tentativo; lettura senza nuove righe o cambiamenti retroattivi. |
| Tecniche | Riscontro rispetto alla classificazione del progetto; nessuna equivalenza con avere risolto l'esercizio sulla carta. |
| Persistenza | Due stati del prodotto con account, più il regime attuale documentato al §3. Bozza in corso e risposta valutata sono oggetti distinti. |

Scelte operative di progetto, non risultati di prove con persone. I numeri
della prova restano le condizioni esistenti, da raccordare su `main` (§10.1);
quantità e carte della selezione si leggono dalla lista realmente preparata.

## 3. Conservazione e stati di accesso consumati dal client

### 3.1 I due stati del Carteggio nella versione account

| Stato | Fonte e comportamento | Dichiarazione prima dell'avvio |
|---|---|---|
| Senza account | Righe, testo, giudizi provvisori e configurazione solo nella memoria della pagina. Nessun dato personale in storage, cache o API. | Testo del client §4.1: «Senza account le risposte valgono solo finché questa pagina resta aperta. Se la chiudi o la ricarichi, le perdi. Non salviamo niente, nemmeno le tue preferenze.» Sulla carta aggiungere «Anche i risultati che scrivi durante il lavoro restano soltanto qui.» |
| Con account | Risposte autovalutate salvate come oggi, con copia dell'account e coda del client; conferma server distinta dalla scrittura locale. Bozza in corso separata (§3.3). | «Il giudizio è tuo. Le risposte valutate si salvano nel tuo account.» Stato reale della bozza e dell'invio subito sotto, senza promettere un invio già completato. |

Senza account, alla prima apertura il tappeto parte dai primi esercizi e il
giro non conosce ciò che è stato fatto in altre aperture. Testo nella scelta:
**«Senza account non sappiamo quali esercizi hai già fatto nelle aperture
precedenti. Il tappeto riparte dall'inizio; il giro può riproporre gli stessi
esercizi.»** Le sole risposte **valutate e concluse** nella pagina aperta
alimentano `ripiega()` e le selezioni successive; la bozza non conta come
esercizio provato. Quindi nella stessa apertura il tappeto può avanzare e il
giro preferire altri esercizi a parità di copertura, senza simulare uno storico
durevole. Dopo ricarica entrambi perdono questa informazione.

Alla fine, anche interrompendo: **«Il lavoro e i giudizi di questa attività
restano solo nella pagina aperta. Se la chiudi o la ricarichi li perdi.»**
Per le tecniche usare «Le risposte di questa attività» al posto di «Il lavoro
e i giudizi». Dopo risultato e revisione, inserire **il blocco del client
§4.1**, per esteso: titolo «Vuoi conservare le attività di questa pagina?»,
vantaggi, server in chiaro, azioni «Crea un account e salva» e «Continua senza
account», link accesso e `/privacy`. La registrazione conserva tutte le righe
della pagina, non solo l'ultimo esercizio; errori e scarti seguono il client.
Non duplicare l'invito in guida, configurazione, confronto o singole schede.

Con giudizi ancora rinviati, «salva» non comprende una risposta autovalutata
inesistente: il blocco account compare nel riepilogo definitivo; il confronto
offre di rimanere lì per valutare. L'accesso volontario nell'intestazione
rimane disponibile. Il trasferimento di eventuali bozze all'identificazione
richiede il contratto del §10.1, non una riga `_t:'c'` fittizia.

### 3.2 Stati trasversali e regime attuale

Account non verificato: stessi esercizi e archivio, più avviso di scadenza
restituita dal server. Account offline riconosciuto: propria copia leggibile,
testo e coda locali; frase del client §3.1 «Sei offline. Le nuove risposte sono
in questo dispositivo e saranno inviate quando tornerà la rete.» Non dichiarare
«salvato sul server». Verifica iniziale, `401`, generazione diversa, archivio
vecchio e origine senza API seguono **client §§3, 7, 9–10**; nessuna nuova
scelta di accesso viene presa dal Carteggio. Le bozze devono rispettare anche
uscita/cambio account e arresto fra schede (§10.1).

Una fonte che non si legge non diventa storico vuoto. Bloccare le selezioni
che dipendono dallo storico: «Non riusciamo a leggere gli esercizi già
valutati. Apri Info per controllare l'archivio.» Azione «Apri Info». La prova
cieca resta preparabile con il rischio di salvataggio dichiarato. Copia
alternativa leggibile: «Stiamo usando un archivio alternativo: potresti non
vedere tutte le risposte precedenti.» Non chiamarlo completo.

**Prima del client account**, l'area può usare soltanto l'archivio locale
esistente e dire «Le risposte valutate restano in questo browser». Nessun
modulo account o testo «senza account non salviamo niente» in un prodotto
che salva ancora localmente. Non promettere oggi la ripresa della bozza:
§3.3 e §10.3 documentano la discrepanza. Il regime progettato si abilita con
il client, non con il solo cambio di parole dell'area 4.

### 3.3 Testo in corso: una promessa che richiede un contratto

Il requisito §7.6 «a ogni tasto» va distinto dal salvataggio finale dei giudizi.
Nella base letta `annotaCart()` aggiorna `S.cprova.risp` soltanto; la scrittura
di righe avviene in `salvaCart()`. L'esecuzione isolata descritta al §10.3
conferma il primo comportamento. Non si può presentare la bozza come già
persistente o già sincronizzata perché la textarea contiene testo.

**Contratto da chiudere su `main` prima di promettere continuità con account:**
conservazione locale per account del testo a ogni input, senza farne una
risposta valutata, con stato di scrittura osservabile, ripristino esplicito e
regole di cancellazione/uscita. Il §10.1 ne definisce le condizioni. Non si
introduce qui un archivio parallelo delle risposte né un invio per tasto al
server. La bozza non diventa automaticamente un'attività riprendibile su un
altro dispositivo. Le risposte definitive viaggiano dalle API delle righe.

Solo dopo conferma della scrittura della bozza: «Il testo in corso è salvato
su questo dispositivo per il tuo account. I giudizi si salvano quando concludi
la valutazione.» Durante attesa: «Salvataggio del testo in corso…»; guasto:
**«Non riusciamo a conservare il testo in questo dispositivo. Non chiudere o
ricaricare la pagina: copia i risultati prima di uscire.»** Azione «Copia i
risultati», con testo selezionabile se gli appunti del dispositivo falliscono;
pallino e dettaglio in Info conservati. Nessuna falsa conferma verde.

Una bozza ritrovata per lo stesso account apre «Hai del lavoro di carteggio
in corso su questo dispositivo», con «Riapri il lavoro» e «Scarta la bozza»
(con perdita spiegata e conferma in pagina). Allenamento: nessun nuovo limite
di tempo. Prova: scadenza assoluta originaria, mai 60 minuti nuovi; se scaduta
si apre il confronto, con «Il tempo della prova è scaduto. Confronta i risultati
che avevi scritto». Nessuna nuova pescata o risposta prima dell'autovalutazione.

## 4. Ingresso, guida e tre porte

Ingresso da barra, riquadro del Percorso, prima accoglienza, ritorno del runner
o revisione. Ordine del DOM identico a 375 e 1280 px:

1. Intestazione esistente, Info e avvisi del client/salvataggio.
2. `h1` **Carteggio**. «Tu svolgi gli esercizi sulla carta. Rotta Giusta ti
   propone una selezione e mostra la risposta ministeriale per confrontare
   il risultato. **Sei tu a giudicare: il sito non corregge il carteggio.**»
3. Blocco **Prima di cominciare**: «Per la prova e gli esercizi su carta
   servono le carte nautiche indicate nella selezione, squadrette nautiche,
   compasso, matita, gomma e fogli per i calcoli. Il sito mostra il problema:
   il tracciamento si fa sulla carta.» Non fingere di fornire le carte o di
   elencare il materiale ammesso in ogni sede d'esame; «Verifica con la tua
   scuola il materiale e le condizioni della prova».
4. «Come funziona» e «Vedi un esempio», facoltativi e sempre ritrovabili.
5. Scorciatoie **Ho carta e strumenti** → preparazione Esercizi su carta;
   **Sono senza strumenti** → preparazione Che tecnica serve?.
6. Tre porte: **Prova di carteggio**,
   «Quattro esercizi a tempo, poi confronto e giudizio tuo»;
   **Esercizi su carta**, «Scegli un giro fra tecniche diverse o prosegui
   nell'ordine del foglio»; **Che tecnica serve?**, «Riconosci come impostare
   il problema, senza carte. Non equivale a svolgerlo».
7. Con account, prove salvate con etichetta **Esiti autovalutati**, accesso
   alla revisione esistente. Senza account soltanto **Attività di questa
   pagina**, se esistono attività concluse, senza andamento, copertura,
   semaforo o contatori longitudinali. Non mostrare uno storico con zeri.

Le tre porte aprono una preparazione, **mai** il timer. Una configurazione
per volta, `h2` con focus, «Cambia attività» torna alle porte e al controllo
d'origine. Un ingresso da Percorso conserva «Torna al Percorso»; quello da
Progressi mantiene «Torna ai Progressi» solo se il client ne consente l'accesso.

**Guida «Come funziona»**, tre passi: «1. Scegli un'attività e controlla le
carte richieste. 2. Svolgi gli esercizi sulla carta e scrivi qui i risultati.
3. Confrontali con la risposta ministeriale e decidi come sono andati.»
Poi «Il riconoscimento delle tecniche è un'attività diversa: confronta le tue
scelte con una classificazione del progetto, senza svolgere l'esercizio».

**«Vedi un esempio»** apre tre passi in pagina, titolo **Esempio dimostrativo**,
avviso «Questa dimostrazione non registra risposte o giudizi». Usare il primo
esercizio della selezione `E.tappeto(banca, {}, 1)` solo come esempio letto:
ID, carta e testo integrali; secondo passo «Il lavoro si fa sulla carta. Qui
scrivi il risultato che hai trovato», campo illustrativo non compilabile;
terzo passo etichette «La tua risposta» con «Qui comparirà il tuo risultato»
e «Risposta ministeriale» dalla stessa fonte. Nessun risultato sintetico,
tracciamento, spiegazione del procedimento o giudizio simulato. «Avanti»,
«Indietro», «Chiudi l'esempio», focus restituito. Si può saltare; nessun flag
persistente di guida completata. Banca indisponibile: guida testuale ancora
leggibile, esempio non apribile e motivo espresso (§8).

## 5. Preparazioni: materiali, lista e comportamento prima del click

### 5.1 Prova di carteggio

Titolo **Prova di carteggio**. Testo:
«Quattro esercizi indipendenti, 60 minuti, soglia di 3 risultati corretti su 4.
Il tempo parte solo quando premi Inizia la prova; alla scadenza si apre il
confronto con ciò che hai scritto. La risposta ministeriale compare dopo la
consegna e il giudizio è tuo.»

Avviso sempre aperto, prima dell'avvio:
**«Questa simulazione propone un esercizio per ciascuno dei quattro argomenti.
È un'assunzione del sito, non una composizione confermata dal decreto.
Confermala con la tua scuola nautica. La carta 42/D non contiene esercizi di
carburante: una prova così può richiedere più carte.»** Q-CART4 resta aperta;
non scrivere «pesca come il Ministero» come garanzia della composizione.

Preparare una sola lista, mostrare **{N} esercizi · Carte richieste: {carte}**
con nomi delle carte distinti ricavati da quella lista, poi materiali del §4,
conservazione del §3 e «Inizia la prova». Nessun risultato o tecnica associata
rivelati in anticipo. Se `N !== 4`, avvio bloccato con «Non riusciamo a
preparare quattro esercizi. Riprova il caricamento o scegli un allenamento».
Nessun completamento silenzioso che finga quattro argomenti coperti.

Configurazione locale **Altre opzioni**, chiusa, contiene la capacità oggi
esistente, rinominata **Dai precedenza agli esercizi mai provati qui**, default
spento. Non eredita `S.prep` dai Quiz. Aiuto «È una variante di allenamento:
la selezione tiene conto delle risposte disponibili qui; può riproporre
esercizi già provati quando non ne restano di nuovi in un argomento».
Senza account: «qui» diventa «in questa pagina aperta». Accesa, titolo runner
e riepilogo **Prova di carteggio · prima i mai provati**, avviso visibile
«Variante di allenamento, con precedenza ai mai provati». Le riprese sono
dichiarate dall'esito del motore prima dell'avvio, per argomento; mai promessa
«solo mai fatti». Timer, soglia e autovalutazione restano quelli della prova.
Il contratto per composizione, fallback e variante è dipendenza §10.1.

### 5.2 Esercizi su carta

Titolo **Esercizi su carta**. «Svolgi gli esercizi sulla carta, senza limite
di tempo. Poi confronti i risultati con quelli ministeriali e li valuti tu.
Puoi fermarti quando vuoi.» Due scelte, default giro:

- **Esercitati su tecniche diverse** (chiave `giro-tecniche`). «Un giro che
  incontra tutte le tecniche associate agli esercizi di questa banca. Alcuni
  esercizi ne comprendono più di una. A parità di tecniche nuove per il giro,
  vengono preferiti esercizi non ancora provati qui. Non è una selezione
  delle tue debolezze.» Quantità **{N} esercizi**, tecniche coperte da risultato
  del motore, carte dalla stessa lista. Le tecniche che ciascun esercizio
  porta al giro sono presentate come «Classificazione del progetto» durante
  questo allenamento, non come istruzioni per risolverlo.
- **Prosegui nell'ordine del foglio** (chiave `tappeto`). «I prossimi esercizi
  non ancora valutati qui, nell'ordine della banca. Una nuova selezione
  salta quelli già valutati; non riprende una prova a metà.» Fino a 4 per
  attività, numero reale **{N} esercizi**. Senza account mostrare sempre anche
  il limite delle aperture precedenti del §3.1.

Entrambe mostrano materiali, carte, conservazione e **«Inizia gli esercizi»**.
Il cronometro misura il tempo trascorso, senza scadenza e senza soglia;
nessun «circa un'ora» o stima dalla velocità dei quiz. Filtri per carta,
argomento, figure o tempo non esistono qui: non aggiungerli ignorandoli al click.

Tappeto vuoto con banca e fonte leggibili: **«Foglio finito: hai già valutato
tutti gli esercizi nelle risposte disponibili qui. Puoi rifare un giro delle
tecniche o preparare una prova.»** Senza account «nelle risposte disponibili
qui» diventa «in questa pagina aperta». Pulsante di avvio disabilitato con
motivo, due azioni «Esercitati su tecniche diverse» e «Prepara una prova».
Non dire che il carteggio è padroneggiato. Giro vuoto segue §8, non si chiama
foglio finito né percorso completato.

### 5.3 Che tecnica serve?

Titolo **Che tecnica serve?**. «Leggi il problema e scegli tutte le tecniche
che ritieni necessarie, anche più di una. Il riscontro confronta le scelte
con la classificazione di Rotta Giusta: non è un elenco ministeriale di
procedimenti. Non svolgi il problema sulla carta e questa attività non conta
come esercizio risolto.» **«Non servono carte o strumenti»** prima dell'avvio.

Fino a 15 testi, da `E.coda()` sul filone tecniche; quantità reale **{N}
esercizi da riconoscere**, conservazione del §3, «Inizia il riconoscimento».
Nessuna soglia d'esame, tempo promesso o diagnosi «l'errore quasi mai sta nel
tracciamento». Con fonte account disponibile la selezione conserva la
priorità del motore; senza account usa soltanto le risposte della pagina.

Problema integrale, ID e carta, sopra opzioni multiselezione. Nomi interi
delle tecniche, gruppi esistenti e «Altro» per tecniche non classificate in
una famiglia; nessuna opzione scompare. Stato di selezione espresso in testo
e `aria-pressed` o checkbox, non solo nel colore. «Confronta le tecniche»
con nessuna scelta: «Scegli almeno una tecnica prima di confrontare», senza
registrare un errore. Riscontro: **«Hai scelto: {scelte}»** e **«Il progetto
associa a questo esercizio: {attese}»**; «Le scelte coincidono» oppure «Le
scelte non coincidono». Non «Impostazione esatta» come garanzia del procedimento.
Niente spiegazioni generate dai nomi: eventuali definizioni didattiche
richiedono una fonte e revisione separata. La risposta numerica ministeriale
non è necessaria al riscontro di riconoscimento.

## 6. Runner sulla carta, consegna e autovalutazione

### 6.1 Scrivere e muoversi

Intestazione con attività, **Esercizio {i} di {N}**, ID ministeriale, carta,
tempo e «Concludi l'attività». Numeri degli esercizi accessibili liberamente,
«Precedente»/«Successivo»: quattro problemi aperti in ordine libero nella
prova, lista intera negli allenamenti. Non adattare il runner dei quiz a
fare una domanda irreversibile per volta.

Problema integrale sempre leggibile, senza dati in pannelli richiusi.
Textarea **La tua risposta**, aiuto «Scrivi il risultato trovato sulla carta,
con le unità», formato atteso se deducibile senza svelare valori. Testo libero:
non rifiutare gradi, virgole, orari o parole perché diversi dalla stringa
ufficiale. Indicatore del numero **«Risultato scritto»**, neutro, mai «corretto».
La navigazione conserva il testo; ogni input aggiorna memoria e, per account,
il contratto di bozza verificato del §3.3. Nessuna risposta `_t:'c'` per tasto.

Nella prova niente tecnica associata o risposta ufficiale prima della consegna.
Nel giro mostrare il motivo del motore («Tecniche che questo esercizio porta
al giro: {nomi} · classificazione del progetto»), senza soluzione commentata.
Il timer non annuncia ogni secondo al lettore di schermo.

### 6.2 Consegna e uscita

Allenamento: «Concludi e confronta». Prova: «Consegna». Primo tocco apre un
blocco in pagina: **«Hai scritto un risultato per {S} esercizi su {N}.
{V} campi sono vuoti. Dopo la consegna non puoi cambiare i risultati di questo
tentativo; potrai confrontarli e valutarli.»** Azioni «Conferma e confronta»
e «Torna agli esercizi». Scrivere, cambiare esercizio o annullare revoca la
conferma pendente; Esc la annulla. Nessun `confirm()` nativo. Doppio click,
scadenza simultanea e riapertura non consegnano due volte.

Scadenza prova: «Tempo scaduto. Confronta i risultati che hai scritto»;
testo congelato e timer fermo, nessun errore calcolato dalle stringhe. Uscita
con testo → stessa conclusione e confronto, conservando origine; con zero
testo in allenamento → ritorno alla preparazione, nessuna attività inventata.
Una prova realmente consegnata/scaduta con zero testo mantiene confronto
e riepilogo di quella prova: campi vuoti distinti, giudizio ancora richiesto,
come l'eccezione della simulazione dell'area 3. Raccordo col client §10.1.

### 6.3 Confronto e giudizio

Titolo **Confronta i risultati**. «Il sito non corregge il carteggio.
Confronta il tuo risultato con la risposta ministeriale e valuta ogni
esercizio. Dove la risposta ufficiale indica un intervallo, quello è la
tolleranza da considerare. Un risultato coincidente non dimostra da solo
che il procedimento sia corretto; se hai dubbi, confrontati con la scuola.»

Ogni scheda, nello stesso ordine: ID, carta e argomento → testo del problema
integrale (può richiudersi solo qui, con «Leggi il problema») → **La tua
risposta** → **Risposta ministeriale** → tecniche del progetto → giudizio.
Risposte con unità, segni, a capo e tolleranze della fonte, senza parse o
normalizzazione numerica. Campo vuoto: «Non hai scritto un risultato»;
non `verdict: 0` automatico. Testo proprio neutro finché non è giudicato.

Controlli esclusivi **«Il risultato coincide»** (`true`) e **«Da rivedere»**
(`false`), senza default. Aiuto «La scelta è tua e comprende il confronto con
le tolleranze indicate». Giudizio modificabile **prima** della conclusione;
stato leggibile «Secondo la tua valutazione: …», senza colore come unico segno.
Conto **«{G} esercizi valutati su {N} · {P} ancora da valutare»**.

Si può scegliere **«Valuterò più tardi»**: il confronto e i suoi dati restano
riapribili nella pagina, un richiamo nell'ambiente dice **Valutazione in corso**.
«Il giudizio non è concluso. Le risposte definitive di questa attività non
sono ancora registrate.» Senza account aggiungere l'avviso di perdita;
con account la bozza segue esclusivamente §3.3. Non è un terzo esito nelle
righe e non produce voto, riga di prova o esercizi fatti nello specchio.
Nessun obbligo di dichiarare falso per poter uscire; lo scarto definitivo
richiede «Scarta questo lavoro» e conferma della perdita in pagina.

Un solo lavoro su carta aperto o in attesa di giudizio per pagina. Provare
a iniziarne un altro mostra «Hai una valutazione di carteggio in corso»,
con «Riprendi il confronto» e «Scarta il lavoro e prepara un'altra attività»:
il secondo richiede la conferma di perdita già prevista. Nessuna nuova lista
sovrascrive quella sospesa. Si possono usare Quiz e riconoscimento delle
tecniche nella stessa pagina conservando il contesto sospeso; il runner
condiviso non ne cancella testo o giudizi. La bozza account ritrovata si
gestisce prima di avviare un altro lavoro sulla carta, secondo §3.3 e D-03.

Solo con tutti i giudizi espliciti: **«Concludi la valutazione»** registra
il tentativo una volta, passa al riepilogo e mostra lo stato reale della
scrittura/invio. Senza account registra soltanto nelle righe in memoria.
Se mancano giudizi il pulsante è disabilitato con «Valuta gli esercizi rimasti
oppure rimanda il giudizio» e ritorno al primo non valutato. I campi vuoti
possono ricevere «Da rivedere» da chi studia; restano indicati come non scritti.
Una scrittura fallita conserva confronto e dettaglio, mostra errore e Info,
senza chiudere e dichiarare salvato. Ritentare usa gli stessi uid.

## 7. Il ciclo comune: riepilogo, revisione e seguito

### 7.1 Riepilogo degli esercizi e della prova

Dopo la conclusione: titolo **Attività conclusa** oppure **Prova di carteggio
consegnata** / **Tempo della prova scaduto**. Contesto (giro, tappeto, variante),
quantità proposta, risultati scritti e campi vuoti, poi **«Secondo la tua
valutazione: {C} risultati coincidenti · {D} da rivedere»**. Nessuna accuratezza
aggregata con quiz/tecniche, nessuna promessa di preparazione o miglioramento.
Allenamenti: nessuna soglia o promozione. Prova, solo con tutti i giudizi:
**«Soglia raggiunta secondo la tua valutazione»** oppure **«Soglia non raggiunta
secondo la tua valutazione»**, con **{C} su {N}, soglia {soglia}**. Ribadire
che riguarda questa simulazione e la sua composizione assunta.

Ordine delle azioni come area 3: risultato → **Rivedi i risultati** →
**Prepara un'altra attività** → **Torna al Carteggio** (o origine esplicita),
poi conservazione/invito client. Nessun avvio automatico. Con D > 0:
«Puoi rileggere gli esercizi che hai segnato Da rivedere» e ingresso
**Rivedi quelli da rivedere ({D})**, dalla stessa fonte delle schede.
Con D = 0 mantenere revisione completa senza inventare errori.

### 7.2 Revisione corrente e salvata

Stesso componente di confronto, **in sola lettura**: problema, risultato
inserito, risposta ministeriale, giudizio di quel tentativo, tecniche con
provenienza. Filtro **Tutti / Da rivedere**, conteggio e schede dal medesimo
risultato del motore; vuoto «In questa attività non hai segnato risultati
Da rivedere». Nessun giudizio nuovo, rettifica retroattiva o copia di riga
aprendo il dettaglio. «Torna al riepilogo» ripristina posizione/filtro e focus;
storico aperto dall'ambiente ritorna alla riga d'origine, non a un runner.

Senza account tutta l'attività corrente e quelle concluse nella pagina sono
rivedibili fino alla ricarica. Con account mantenere la revisione storica già
esistente delle prove; allenamenti con identità registrata entrano nello stesso
contratto, senza inventare legami alle righe vecchie. Per righe ricostruite:
«Questa attività è ricostruita dalle risposte disponibili; il confine potrebbe
non coincidere con l'allenamento originale». Quantità proposta, campi vuoti
e variante sconosciuti non si deducono da righe assenti: mostrarli come
«non registrati». ID mancanti in banca: risultato proprio conservato,
«Il testo o la risposta ministeriale di questo esercizio non sono disponibili
nella banca caricata», azioni «Riprova il caricamento» / «Torna al riepilogo».

### 7.3 Tecniche e differenze rispetto all'area 3

Il riconoscimento si chiude, anche anticipatamente con risposte, con
**Riconoscimento concluso**: «Hai confrontato {R} esercizi su {N}. In {C} le
scelte coincidono con la classificazione del progetto; in {D} non coincidono.
{M} esercizi non affrontati». **Rivedi le scelte**, filtro Tutte / Non
coincidenti, testo e scelte proprie/attese, nessuna risposta nuova nella
revisione. Zero risposte e stop torna alla preparazione. Mantiene archivio
`_t:'t'`, specchio tecniche e quantità separate dallo svolgimento sulla carta.
Seguono **Esercizi su carta** → preparazione §5.2 con materiali, e
**Torna al Carteggio**; niente timer avviato dalla revisione.

Il ciclo riepilogo → revisione dell'area 3 **vale per tutti e tre gli ingressi**.
La sua «Riprova questi N» invece **non si collega oggi**: `erroriSessione()`
legge solo `_t:'q'`, e le righe tecniche attuali non hanno un legame di attività;
non filtrare quelle righe in pagina per simulare l'API. Su carta, inoltre,
«Da rivedere» è un giudizio personale e richiede una nuova preparazione coi
materiali, non una correzione immediata da quiz. Questa area consegna revisione
completa e nuova selezione esplicita; una riprova esatta di tecniche o risultati
richiede un contratto di motore ulteriore, non necessario per queste tre porte.
La motivazione non esenta il riepilogo o la revisione dal confine dell'attività.

```text
Carteggio → preparazione (materiali, giudizio, conservazione, lista)
  ├─ prova / esercizi → scrittura → consegna o stop → confronto
  │     ├─ giudizi mancanti → rimanda nella pagina / scarta esplicitamente
  │     └─ tutti giudicati → registra una volta → riepilogo → revisione
  └─ tecniche → scelte e riscontro → conclusione → riepilogo → revisione
Da ogni riepilogo → nuova preparazione oppure ritorno all'origine
Senza account → invito del client dopo il riscontro, continuazione libera
```

## 8. Contratti di selezione, archivio e stati di errore

### 8.1 Una lista preparata e una contabilità

| Attività | Fonte di selezione | Snapshot in memoria |
|---|---|---|
| Giro su carta | `E.giroTecniche(banca, cprog)` | Lista di `e`, tecniche portate da ogni elemento; N dalla lista, carte da `e.carta` |
| Tappeto | `E.tappeto(banca, cprog, 4)` | Esattamente i prossimi esercizi; N e carte dalla lista |
| Prova | `E.provaCarteggio(banca, cprog, oggi, { seme, nuoviPrima })`, consegnata da P-32 (§10.1, D-01): `estrai` cieca, `estraiNuoviPrima` nella variante | Lista unica, `carte`, `rappresentati`/`mancanti`, `completamento`, `riprese` dall'esito; avvio solo se `pronta` |
| Riconoscimento | `E.coda(itemsTecniche, tprog, oggi, {n:15})`, adattamento esistente degli esercizi a `k:'tec'` | Lista e referenza `_e` per testo/attese, N reale |

Snapshot include origine, controllo per il focus, configurazione locale, regime
di accesso, revisione della fonte e identità dell'attività. «Inizia» usa la
stessa lista annunciata; cambio opzione, aggiornamento della banca o della
fonte rigenera l'anteprima e richiede un nuovo click, senza una nuova pescata
invisibile. Carte uniche ed etichette sono presentazione della lista; selezione,
copertura delle tecniche e statistiche sono del motore. Per un numero che
il motore non espone si chiede l'export (§10.1), non lo si ricalcola nel DOM.

Righe finali su carta: `_t:'c'`, `uid`, `item_id`, `ts`, `input_json` con
risposta libera, `verdict: 1|0` scelto dalla persona, **`delta: null`**, `mode`,
`ms`, legame registrato dell'attività (`sim_uid`, `proposti`, `pos`: schema
consegnato da P-33, §10.1 D-02). Solo la prova
ha `_t:'s', kind:'carteggio'`, score/total/passed dal risultato del motore,
mai un allenamento; «passed» è sempre presentato come autovalutazione.
Righe tecniche `_t:'t'`, `chosen`, `correct`, proprio legame di attività:
nessun `_t:'c'` né incremento dello specchio carteggio. `ripiega()` unica
fonte degli specchi; append-only e coda del client per le risposte definitive.
Tempo totale della lista non spacciato per tempo realmente misurato per
esercizio; mantenere compatibilità delle righe esistenti e limite dichiarato.

Dettaglio corrente: proposta, testo, campi vuoti e giudizi provvisori restano
nel runner anche se la scrittura fallisce. Dettaglio storico: contratto del
motore richiesto al §10.1, non `E.sessioni()` applicato a tipi che scarta.
Non riusare `E.esito()` su giudizi `null`: il suo conto li tratterebbe come
falsi. La valutazione conclusa usa soltanto giudizi espliciti, tramite il
contratto del motore. Registrazione, sincronia, scarti e conflitti seguono
il client, con gli stessi uid al ritento e nessun successo dedotto da HTTP 200.

### 8.2 Stati da mostrare

| Stato | Testo e azioni |
|---|---|
| Banca in caricamento | «Caricamento degli esercizi di carteggio…». Guida leggibile, avvii disabilitati con motivo; non mostrare foglio finito. |
| Errore di caricamento | «Non riusciamo a caricare gli esercizi. Riprova con la rete disponibile». «Riprova il caricamento», «Apri Info»; nessuna banca vuota inventata. |
| Banca vuota | «La banca caricata non contiene esercizi di carteggio. Apri Info per controllare». Nessun conto di padronanza o prova ridotta. |
| Giro senza selezione su banca non vuota | «Non riusciamo a preparare un giro delle tecniche da questa banca». «Apri Info» e «Prosegui nell'ordine del foglio», senza dichiarare percorso finito. |
| Tecniche senza selezione | «Non ci sono esercizi in questa selezione di riconoscimento». Ritorno alle altre porte; nessuna diagnosi di capacità sulla carta. |
| Materiali mancanti | Nessun blocco account: «Se non hai le carte richieste, puoi scegliere Che tecnica serve?». Porta alla preparazione tecniche. |
| Offline con banca in cache | Tutte le attività utilizzabili con regime di memoria/copia account dichiarato; niente garanzia di API disponibili. |
| Fonte di revisione assente | «Non troviamo questa attività nelle risposte disponibili qui». «Torna al Carteggio», senza revisione vuota presentata come nessun errore. |
| Guasto di scrittura/invio | Testo del client e del §3.3, dettaglio conservato, Info e download delle righe confermate/pendenti; copiare separatamente la bozza non ancora archiviata. |
| Giudizio rinviato | Stato Valutazione in corso, nessun voto e nessuna riga definitiva inventata; «Riprendi il confronto» nella stessa pagina. |

Non spegnere pallino o righe di errore per rendere il runner più pulito.
Cambio account o uscita in un'altra scheda ferma il runner e segue il client,
senza spostare testo e giudizi nella prova anonima o nell'account nuovo.

## 9. Disposizione, accessibilità e chiamanti da preservare

A 1280 px contenuti centrati, preparazione compatta e leggibile, testo del
problema accanto al campo se lo spazio lo permette. Nel confronto **La tua
risposta** a sinistra e **Risposta ministeriale** a destra. A 375 px stesso
ordine impilato, etichette ripetute, unità e intervalli senza tagli; nessuno
scroll orizzontale. Barra azioni non copre campo, tastiera o ultimi controlli.
Non aggiungere audio, illustrazioni o dipendenze; eventuale guida riusa testo
e banca lecita, senza scritture di tentativi.

Focus al titolo della preparazione/confronto/riepilogo; ritorno al controllo
d'origine. Tab raggiunge carte, campo, numeri e azioni; Enter nella textarea
inserisce un a capo. Nessuna scorciatoia dei quiz intercetta testo o consegna.
Esc annulla conferma pendente, altrimenti propone la conclusione; non scarta
il lavoro in silenzio. Pulsanti con nome e stato: «Esercizio 2 di 4, risultato
scritto», «Il risultato coincide»/«Da rivedere». Target almeno 44 px,
focus visibile e contrasto verificato; stati comprensibili senza colore.
Avvisi urgenti annunciati una volta, quantità aggiornate con `aria-live`
moderato. Guide e pannelli gestiscono chiusura e ritorno senza intrappolare
il focus. Il timer è consultabile, non letto ogni secondo.

Prima di cambiare funzioni condivise elencare i chiamanti reali aggiornati:

| Punto | Cambia | Si conserva |
|---|---|---|
| `dipingiCart`, porte dal Percorso/barra | Tre ingressi, preparazione e avvisi per regime | Autonomia Carteggio, Info, accesso senza quiz |
| `componiProva`, `argomentiSenzaNuovi`, avvii giro/tappeto | Raccordo con contratti puri e snapshot | Pescate del motore, motivi del giro, ordine tappeto, variante mai provati dichiarata |
| `avviaCart`, `mostraCart`, `annotaCart`, gestori input/numeri | Contesto, stato bozza e continuità verificata | Navigazione libera, testo completo, ID/carta e campo libero |
| `consegnaCart`, `cronoCart`, chiusura | Confronto e riepilogo, stop e zero testo | Scadenza assoluta, due tocchi in pagina, revoca scrivendo, niente autogiudizio |
| `salvaCart` | Chiusura idempotente, legame dell'allenamento, permanenza reale | Righe per esercizio, `delta:null`, prova soltanto per simulazione, coda account |
| `rivediCarteggio`, `rivediTesta`, `apriRivedi` | Revisione corrente/storica coerente e ritorni | Tentativi precedenti immutati, ramo quiz dell'area 3 e porte Progressi |
| `apriTec`, `mostraTec`, `correggiTec`, runner/fine condivisi | Riscontro nominato, riepilogo e revisione tecniche | Multiselezione, famiglie/Altro, archivio e specchio tecniche distinti |

Nessuna funzione orfana si dichiara consumata senza chiamata reale.
`erroriSessione()` e la riprova dei quiz restano dell'area 3; aggiornamenti
eventuali al registro delle eccezioni appartengono alla realizzazione.

## 10. Dipendenze, accettazione ed evidenze

### 10.1 Contatto con Claude su `main`: prima della realizzazione

**D-01 — Composizione e anteprima della prova.** Portare il contratto puro
nel motore, o consegnare un raccordo eseguibile verificato come nell'area 2:
ingressi banca SL, specchio, giorno, seme, precedenza ai nuovi; uscita lista,
argomenti rappresentati/mancanti e riprese effettive per argomento. Quattro
elementi distinti, niente filtro per carta, assunzione espressa, comportamento
del fallback su banca incompleta esplicito. La pagina non implementa un secondo
algoritmo o interpreta argomenti assenti come coperti. Conservare `estrai`
cieca e `estraiNuoviPrima` per i loro chiamanti; elencarli prima di modificarle.
La variante deve essere distinguibile anche nella revisione di nuove prove;
per righe precedenti il dato è sconosciuto, non default inventato. Sorgente
unica delle condizioni 4/60/3 e conto delle tecniche/carte da fissare insieme
al contratto; nessun dato della banca cambiato per far tornare una prova.

*Consegnata il 30 settembre 2026 (P-32), come contratto puro nel motore.*
`E.provaCarteggio(banca, specchio, oggi, { seme, nuoviPrima })`, con banca SL
intera (`S.cart`) e specchio del carteggio (`S.cprog`), restituisce dalla
stessa chiamata: `lista` (al più 4, rimescolata); `pronta` (`lista.length === 4`:
se no, avvio bloccato come nel §5.1); `variante` (`'cieca'` o `'nuoviPrima'`);
`argomenti`, uno per argomento nell'ordine fisso, `{ argomento, esercizi, nuovi,
preso, ripresa }`; `rappresentati` e `mancanti`; `completamento`, gli esercizi
presi dal resto della banca al posto di un argomento che non ha esercizi,
`[{ id, argomento }]`; `riprese`, `[{ id, argomento }]` della lista già provati;
`carte`, distinte nell'ordine della lista; `condizioni` `{ esercizi: 4, minuti:
60, soglia: 3, erroriMax: 1 }`; `assunzione`, il testo di Q-CART4. Nella prova
cieca `riprese`, `nuovi` e `ripresa` sono `null`: non misurati, non zero, e il
risultato intero non dipende dallo specchio. Le condizioni e il testo
dell'assunzione stanno in `E.PROVA_CARTEGGIO`, con la fonte (DM 323/2021, art.
6 c. 6): la pagina non ne tiene una copia. Il ripiego su una banca incompleta
è quello di prima, **dichiarato**: si completa dal resto, `mancanti` nomina
l'argomento assente e `completamento` l'esercizio che lo sostituisce; la
pagina non lo presenta come un argomento coperto. Le riprese della variante
prima dell'avvio si leggono da `argomenti` (`nuovi === 0` dove la variante
ripesca; `ripresa` sull'esercizio preso) e da `riprese`, che conta anche un
completamento già provato. La variante si scrive nelle righe `_t:'c'` e
`_t:'s'` della prova nuova come campo `variante`, con il valore dell'uscita;
nelle righe di prima manca, ed è sconosciuta, non `'cieca'` — il resto della
lettura storica è D-02. Niente tecniche nell'uscita: il §5.1 non le rivela
prima dell'avvio. Stessa prova della pagina a parità di seme: finché
`componiProva()` vive in `app.html`, un test del motore la esegue e pretende
la stessa lista; alla realizzazione escono `componiProva()`,
`argomentiSenzaNuovi()` e le costanti `PROVA_*`, e `provaCarteggio` esce dagli
orfani di `docs/eccezioni-interfaccia.md`. `estrai()` resta cieca ed
`estraiNuoviPrima()` invariata; i loro chiamanti — `simulazione()`,
`simulazioneVela()`, `screening()`, e ora `provaCarteggio()` — non cambiano.
Requisiti: R-SEL-12…16, coperti, e R-SEL-17 per la pagina, scoperto.

**D-02 — Attività intera, riepilogo e revisione di carta/tecniche.** Nella base
le funzioni `sessioni()`/`erroriSessione()` considerano soltanto `_t:'q'`,
anche dopo P-30: il confine `attivita` è consegnato per i quiz, non per `c`/`t`.
`salvaCart()` lega le righe alla prova solo in simulazione; giro/tappeto hanno
`sim_uid:null`. `correggiTec()` non registra un legame. La consegna deve
prevedere identità nuova per ogni attività nuova e uid stabili al ritento,
senza riga `_t:'s'` fittizia per un allenamento. Richiesto un contratto puro
per dettaglio e conteggi dai tipi `c` e `t`, completo oltre pause, distinto
da ricostruzioni dichiarate e isolato da attività estranee. Non applicare
silenziosamente ai nuovi tipi l'API quiz attuale o cambiarne il default usato
da ritmo. Coprire campi vuoti noti della lista corrente, giudizi espliciti,
conteggio dei Da rivedere e delle scelte non coincidenti, banca mancante,
legami ambigui, righe vecchie e filtro di revisione. Proposta, quantità e
variante storiche si mostrano solo quando realmente registrate: `main`
documenta schema e compatibilità prima del raccordo UI. Non serve una nuova
API di riprova per chiudere il ciclo progettato (§7.3).

*Consegnata il 30 settembre 2026 (P-33), come contratto puro nel motore.*
`sessioni()`, `erroriSessione()` e `ritmo()` non cambiano: leggono solo
`_t:'q'`, e il confine per pausa resta il predefinito. Carta e tecniche hanno
due funzioni che **nominano il tipo** (`'c'` o `'t'`; `'q'` o un tipo
sconosciuto lanciano):

- `E.attivitaCarteggio(righe, { tipo })`: le attività dalla più recente, con
  `id`, `fonte` (`'sim_uid'` o `'risposte'`), `mode`, `inizio`, `fine`, `n`,
  `ms` (somma dei tempi registrati, non una misura per esercizio), `righe`,
  `prova` (la riga `_t:'s'`, solo per una prova di carteggio), `proposti`,
  `variante`, `ordine` (`'registrato'` o `'non registrato'`), `ambigua` e
  `motivi`. Le righe di un `sim_uid` stanno insieme oltre ogni pausa e
  intrecciate con altre attività. Senza legame: sulla carta un gruppo per
  **istante e modalità** — `salvaCart()` scrive un solo `ts` per salvataggio
  dalla 0.5.0 —, sulle tecniche le regole di `sessioni()` (modalità,
  esercizio ricomparso, pausa oltre 20 minuti, una riga con legame in mezzo).
  L'id ricostruito è `'r:'` + il più piccolo uid del gruppo, stabile qualunque
  sia l'ordine dell'archivio. Righe con lo stesso uid contano una volta (un
  ritento); la prima vince, come in `fondiArchivio()`. I motivi di ambiguità:
  «esercizio ripetuto», «modalità diverse», «tipi diversi» (lo stesso
  `sim_uid` su righe `q` o dell'altro tipo), «riga di prova estranea» (una
  `_t:'s'` con lo stesso uid che non è `kind: 'carteggio'` su una
  `simulazione`, o che sta su un allenamento o sulle tecniche), «variante
  diversa», «quantità proposta incoerente».
- `E.dettaglioCarteggio(righe, banca, id, { tipo, filtro })`: `schede`,
  `mostrate`, `conteggi`, `mancanti`, `esito`, più i campi dell'attività e
  `trovata`, `banca`. Scheda carta: `risposta` com'è (o `null` se la riga non
  la registra), `scritta` (`false` vuota, `null` non registrata), `giudizio`
  (`true`, `false`, `null` se manca). Scheda tecniche: `scelte` (`[]` se
  nessuna, `null` se non registrate), `attese` dalla banca, `coincidono`
  (l'esito registrato allora, non ricalcolato). Ogni scheda ha `esercizio`
  dalla banca o `null`. Conteggi carta: `proposti, esercizi, scritti, vuoti,
  nonRegistrati, coincidenti, daRivedere, senzaGiudizio, nonAffrontati`;
  tecniche: `proposti, risposte, coincidenti, nonCoincidenti, senzaEsito,
  nonAffrontati`. Filtri per nome: `'tutti' | 'da-rivedere'` sulla carta,
  `'tutte' | 'non-coincidenti'` sulle tecniche; un altro è un errore.
  `esito` `{ coincidenti, su, soglia, raggiunta }` solo per una `simulazione`
  con **tutti** i giudizi, con la soglia di `PROVA_CARTEGGIO`; un allenamento
  non ne ha. Con la banca `null`, `mancanti` è `null`: non si sa. Un'attività
  ambigua ha schede vuote e `conteggi`/`esito` `null`; un id assente
  `trovata: false`.

**Lo schema delle righe nuove**, che la realizzazione (P-21) scrive:

| Riga | Campi di prima | Campi nuovi |
|---|---|---|
| `_t:'c'` prova, giro, tappeto | `uid`, `item_id`, `ts`, `input_json` `{ risposta }`, `verdict` 1/0 scelto, `delta: null`, `ms`, `mode` | `sim_uid` **nuovo a ogni avvio**, anche per giro e tappeto (oggi `null`), uguale su tutte le righe e, nella prova, all'uid della `_t:'s'`; `proposti`, la lunghezza della lista preparata; `pos`, 0…`proposti`−1; `variante` solo nella prova (P-32, invariata) |
| `_t:'t'` | `uid`, `item_id`, `ts`, `correct` 1/0, `ms`, `chosen` `'a\|b'` | `sim_uid` nuovo a ogni `apriTec()`, lo stesso per ogni risposta di quella lista (oggi non c'è); `proposti`, la lunghezza della coda; `pos`, `R.i` |
| `_t:'s'` | invariata, solo per la prova; `variante` da P-32 | nessuna per giro, tappeto o tecniche |

Gli uid delle righe nascono una volta — alla conclusione sulla carta, alla
risposta sulle tecniche — e un ritento della scrittura li riusa. Nessuna riga
con `verdict` diverso da 1/0: il giudizio rinviato non si scrive (D-03). Per
il riepilogo corrente la pagina chiama le stesse due funzioni sulle righe
dell'attività appena conclusa (anche in memoria, senza account), e con
`esito` scrive la `_t:'s'`: `score` da `coincidenti`, `total` da `su`,
`passed` da `raggiunta`. «Rivedi quelli da rivedere ({D})» è
`conteggi.daRivedere`, e apre `mostrate` con `'da-rivedere'`; il ramo della
prova in `apriRivedi()`, che filtra le righe da sé, esce.

**Compatibilità con le righe di prima, che restano come sono:** giro e
tappeto senza legame si ricostruiscono per istante e modalità, e la pagina li
dice ricostruiti (§7.2); le tecniche senza legame con le regole dei quiz, con
il limite dichiarato che due riconoscimenti entro 20 minuti senza esercizi in
comune diventano uno. Nessuna riga di prima porta `proposti` o `pos`:
quantità, non affrontati e ordine sono «non registrati» — l'ordine è quello
del tempo, e per le righe di uno stesso salvataggio quello dell'archivio, non
garantito. Le prove di prima di P-32 hanno il legame e non la variante:
`variante: null`, sconosciuta; la quantità proposta viene da `total` della
loro `_t:'s'`. Lo schema della variante di D-01 non cambia; una `_t:'s'` che
porta una variante diversa dalle sue righe rende la prova ambigua.

Requisiti: R-FLU-12…22 coperti, R-FLU-23 per la pagina scoperto. Le due
funzioni sono fra gli orfani dichiarati di `docs/eccezioni-interfaccia.md`
fino a P-21.

**D-03 — Bozza account e giudizio rinviato.** Discrepanza §7.6 / runtime al
§10.3: fissarla con un controllo che fallisce prima della correzione, poi
chiudere la conservazione per input prima di prometterla. Claude definisce
contratto di archivio/account e controllo: testo, lista, posizione, modalità,
scadenza assoluta e giudizi provvisori separati dalle righe valutate; bozza
associata all'account già riconosciuto, esclusa da `ripiega`, conteggi e invii
di risposte; cancellazione solo dopo conclusione confermata o scarto esplicito.
Ricarica e scadenza, errore di scrittura, uscita e cambio account fra schede
devono essere esercitati. Nessun salvataggio anonimo e nessun ripiego sul
vecchio archivio. Scrivere il raccordo nel progetto del client senza
ridisegnarne accesso o sincronia. Chiarire il trasferimento della bozza quando
ci si identifica durante il lavoro; nessun `verdict:null` valido per UI e
falso nello specchio. Non dichiarare salvato ciò che esiste solo in memoria.

*Consegnata il 30 settembre 2026 (P-34), come contratto nel motore e raccordo
nel progetto del client.* Il difetto prima, dimostrato in un browser vero: con
l'account, due testi scritti, una ricarica, e nessuna traccia del lavoro — la
verifica `C-19:ricarica` di `tests/client_account.mjs`, rossa sulla pagina di
oggi e dichiarata in `docs/eccezioni-interfaccia.md` («Difetti aperti
dichiarati»), così `main` resta verde e il controllo non si spegne. Poi il
contratto. **Nel motore**, puro: `E.nuovaBozza({ id, modo, lista, inizio,
variante })` — lista congelata, scadenza da `PROVA_CARTEGGIO` nella prova, niente
nei due allenamenti —; `E.validaBozza()`, che rifiuta anche una bozza con i campi
di una riga, così le due forme non si confondono in nessun verso;
`E.modificaBozza()`, che cambia posizione, testi, consegna e giudizi e mai lista,
tempo, modalità o variante, e non riscrive il testo consegnato;
`E.sostituisciBozza(presente, proposta, revisione)`, la regola di ogni
scrittura dentro la transazione — una revisione vecchia non sovrascrive, una
bozza conclusa o scartata altrove non si ricrea —; `E.riprendiBozza(bozza,
adesso)`, con la scadenza di prima e la prova scaduta al confronto, consegnata
all'istante della scadenza; `E.concludiBozza(bozza, { ts })`, le righe finali
con lo schema di D-02 e gli uid che nascono dalla bozza, e con un giudizio
rinviato **nessuna riga**. **Nella pagina**, il raccordo del §9.4 di
`account-client-progetto.md`: la bozza in `meta` della copia dell'account, alla
chiave `bozza-carteggio:<id>`; «salvato» solo su `oncomplete`; la ripresa
proposta e mai automatica; la conclusione in una transazione con righe e coda;
lo scarto con conferma; l'uscita che conta le bozze anche dentro il lucchetto;
l'avviso e la conferma di P-36 rivisti per i due stati. Il trasferimento chiesto
qui sopra: **un runner cominciato senza account resta senza bozza fino alla
fine**, anche se nel frattempo si entra, e le sue righe finali passano dalle
porte del §4.3 e del §5.1 del progetto del client; Confermato dall'autore il 30 settembre 2026., con i testi
dell'uscita e dello scarto. Il banco lo prova su una
pagina di riferimento con quattordici rotture (§12 del progetto del client, «La
bozza del carteggio»). Requisiti: R-BOZZA-01…07. Le funzioni della bozza sono
fra gli orfani dichiarati fino a P-21, che le consuma, toglie la dichiarazione
del difetto nello stesso commit, e fa girare C-19 intero sulla pagina vera.

**D-04 — Controlli e specifica del ciclo.** Fissare R-UX-03 prima dell'avvio,
Q-CART4, Q-AMBITO, §7.6 e R-FLU-01 per carta/tecniche; distinguere i controlli
del riepilogo da quelli della riprova solo quiz. Raccordare client §4.1 con
prova consegnata senza testo e giudizio rinviato, e client §9.2 con D-03.
R-ACC-04 resta verificato sul prodotto con client, non dal solo documento.
Controlli automatici eseguibili con riferimento e rotture deliberate per
il regime progettato, più prove browser per rendering e storage. Durante
la transizione riconoscere precisamente regime attuale e progettato come
area 2 §10.1; alla merge chiudere il vecchio. Non rimuovere asserzioni o
inventare righe per tenere verde la suite. Definire il raccordo estraibile
e il riconoscimento del regime nel repo prima di scrivere UI.

*Consegnata il 30 settembre 2026 (P-35): il raccordo, e come lo legge il
controllo.* Scritto qui prima della pagina di riferimento e del banco, come
`selezioneQuiz()` per l'area 2 (P-06), il ciclo per l'area 3 (P-31) e la mappa
per l'area 5 (P-44). `tests/test_interfaccia.py` riconosce il regime del
Carteggio dal **raccordo**: una pagina che dichiara al primo livello una di
queste cinque funzioni è nel regime progettato, e deve dichiararle tutte.

```js
preparaCarteggio(scelta, fonte)            // la lista annunciata, dal motore, e che cosa dichiarare prima di Inizia
avviaCarteggio(preparazione, fonte, avvia) // Inizia: la stessa lista, con un'identità nuova, o niente
concludiCarteggio(lavoro, fonte)           // le righe finali della carta: E.concludiBozza(), o nessuna
rispostaTecnica(corsa, pos, scelte, fonte) // la riga di una risposta del riconoscimento
riepilogoCarteggio(contesto, fonte)        // riepilogo e revisione di un'attività: E.dettaglioCarteggio()
```

Dipendono solo dai loro argomenti, da `E` e da altre funzioni di primo livello
(come `uid()`): il controllo le estrae e le esegue senza DOM e senza `S`. Senza
nessuna delle cinque la pagina è nel regime attuale, e lì non chiama
`E.provaCarteggio`, `E.attivitaCarteggio`, `E.dettaglioCarteggio`,
`E.nuovaBozza` né `E.concludiBozza`: sarebbe il carteggio nuovo senza il
raccordo, un numero con una seconda fonte. E il ciclo di oggi — `componiProva()`,
`dipingiCorrezione()`, `salvaCart()`, `rivediCarteggio()`, `correggiTec()` —
resta finché il nuovo non c'è. **Il regime attuale ha una scadenza:** lo toglie
la regia quando integra P-21.

**`fonte`** è una sola per le cinque, e il controllo la congela: `{ banca,
specchio, tecniche, specchioTecniche, righe, oggi, adesso, ts, letturaFallita }`.
`banca` è `carteggio.json` caricata (o `null`), `specchio` lo specchio del
carteggio ricalcolato con `E.ripiega()` dalle righe dell'account o della pagina
aperta (§3.1), `tecniche` e `specchioTecniche` lo stesso per il
riconoscimento, `righe` le righe da cui si legge un riepilogo, `oggi` il giorno,
`adesso` l'orologio in millisecondi, `ts` l'istante di `E.isoLocale()`,
`letturaFallita` vero quando le righe non si sono lette (§3.2).

**`preparaCarteggio(scelta, fonte)`**, con `scelta = { attivita, seme,
nuoviPrima }` e `attivita` `'prova' | 'giro-tecniche' | 'tappeto' |
'tecniche'`, chiama **una volta** la selezione del §8.1 con i dati della fonte,
e nessun'altra: `E.provaCarteggio(banca, specchio, oggi, { seme, nuoviPrima })`;
`E.giroTecniche(banca, specchio)`; `E.tappeto(banca, specchio, 4)`;
`E.coda(voci, specchioTecniche, oggi, { n: 15 })`, con `voci` le tecniche nella
forma `{ id, k: 'tec', _e }` di oggi. Restituisce `{ scelta, attivita, stato,
lista, quanti, carte, motivi, condizioni, assunzione, variante, argomenti,
mancanti, completamento, riprese }`:

- `lista` sono gli esercizi della banca che la selezione ha dato, gli oggetti
  della banca e nel suo ordine; `quanti` è la sua lunghezza.
- Nella prova `condizioni`, `assunzione` (Q-CART4), `variante`, `argomenti`,
  `mancanti`, `completamento`, `riprese` e `carte` sono quelli del risultato di
  `provaCarteggio()`, come sono: `riprese` resta `null` nella prova cieca. Negli
  allenamenti e nel riconoscimento sono `null`, e `carte` sono le carte della
  lista, distinte, nel suo ordine — `null` nel riconoscimento, che non ne vuole.
- `motivi` nel giro sono, esercizio per esercizio, le tecniche che porta al giro
  secondo `giroTecniche()`; altrove `null`.
- `stato` è `'pronta'`, oppure dice perché non si avvia: `'corta'` (la prova non
  è `pronta`: §5.1), `'foglio finito'` (il tappeto vuoto su una banca che ha
  esercizi), `'vuota'` (il giro o il riconoscimento senza selezione), `'senza
  banca'` (la banca non c'è o non ha esercizi: nessuna chiamata), `'illeggibile'`.
  **Una fonte che non si legge non diventa uno storico vuoto** (§3.2): con
  `letturaFallita` il giro, il tappeto, il riconoscimento e la variante «prima i
  mai provati» non chiamano il motore e dicono `'illeggibile'`; la prova cieca,
  che non guarda lo storico, si prepara lo stesso.

La pagina scrive le condizioni, le carte e l'assunzione da qui, e non tiene una
sua `componiProva()`, `argomentiSenzaNuovi()`, né le costanti `PROVA_*` o
`ARGOMENTI` (D-01). **Il giudizio di chi studia prima dell'avvio** (R-UX-03) non
è un campo del raccordo, perché è una frase fissa del §4: lo guarda il banco del
browser, nel testo che si vede del Carteggio prima di Inizia.

**`avviaCarteggio(preparazione, fonte, avvia)`** rifà la preparazione con la
stessa `scelta` sulla fonte di adesso e, solo se è `'pronta'` con gli stessi
esercizi nello stesso ordine, chiama **una volta** `avvia(lista, modo, opt)`
con la lista della preparazione, e restituisce `{ avviata: true, simUid }`;
altrimenti `{ avviata: false, stato }`, con `'cambiata'` quando la selezione di
adesso è un'altra — un clic non avvia una pescata che nessuno ha visto (§8.1).
`modo` è `'simulazione' | 'giro-tecniche' | 'tappeto' | 'tecnica'`; `opt` porta
`simUid`, **un'identità nuova a ogni avvio**, e `proposti`, il numero della
lista. Sulla carta `opt.lavoro` è `E.nuovaBozza({ id: simUid, modo, lista: ids,
inizio: fonte.adesso, variante })`, con la variante della preparazione nella
prova: **il lavoro del runner ha la forma della bozza in tutti e due gli stati**,
in memoria; con l'account lo stesso oggetto si scrive in `meta` (§9.4 del
client), senza account no. Così la scadenza è quella del motore, e le righe
finali e il loro uid non dipendono dallo stato d'accesso. **Confermato dall'autore il 30 settembre 2026.** Nel giro `opt.motivi`
sono i `motivi` della preparazione.

**`concludiCarteggio(lavoro, fonte)`** chiama **una volta**
`E.concludiBozza(lavoro, { ts: fonte.ts, quesiti })`, con `quesiti` gli id della
banca (o `undefined` senza banca), e restituisce `{ righe, motivo }` come sono.
La pagina scrive quelle righe e nessun'altra: con un giudizio rinviato `righe`
è vuota, e un ritento della stessa conclusione dà gli stessi uid (D-02, D-03).
`concludiCarteggio()` non scrive: la scrittura, la coda e la bozza tolta nella
stessa transazione sono della pagina (§9.4 del client).

**`rispostaTecnica(corsa, pos, scelte, fonte)`** — `corsa = { simUid, lista,
proposti }` come l'ha data l'avvio, `pos` la posizione nella lista, `scelte` le
tecniche scelte, e in `fonte` anche `ms` e `uid`, nati una volta alla risposta —
restituisce la riga `{ _t: 't', uid, item_id, ts, correct, ms, chosen,
sim_uid, proposti, pos }` dello schema di D-02: `correct` è 1 se e solo se le
scelte sono **esattamente** le tecniche dell'esercizio, `chosen` le scelte
unite da `|`. Non scrive.

**`riepilogoCarteggio(contesto, fonte)`**, con `contesto = { id, tipo, filtro }`
e `tipo` `'c' | 't'`, chiama **una volta** `E.dettaglioCarteggio(righe, banca,
id, { tipo, filtro })` — la banca del tipo: `banca` per la carta, `tecniche`
per il riconoscimento — e nessun'altra funzione che conti: né
`attivitaCarteggio()`, né `sessioni()`, né un filtro sulle righe. Restituisce
`{ stato, tipo, id, confine, mode, variante, proposti, ordine, motivi, schede,
mostrate, filtro, conteggi, esito, mancanti, rivedi }`, i campi di
`dettaglioCarteggio()` come sono (`confine` è la sua `fonte`); `stato` è
`'pronto'`, `'ambigua'` (con `conteggi` ed `esito` `null`: non «zero da
rivedere»), `'indisponibile'`, o `'illeggibile'` quando l'attività non si trova
e la lettura è fallita. `rivedi` è `{ filtro, quanti }` — `'da-rivedere'` con
`conteggi.daRivedere` sulla carta, `'non-coincidenti'` con
`conteggi.nonCoincidenti` nel riconoscimento — oppure `null` quando è zero:
«Rivedi quelli da rivedere ({D})» apre, riaperto con quel filtro, le `mostrate`
che conta. **Nessuna riprova** (§7.3): il riepilogo non chiama
`erroriSessione()` e non restituisce un campo `riprova`; il seguito è una
preparazione nuova. Vale per il riepilogo corrente, dalle righe appena
concluse, come per la revisione di una prova salvata.

**Il collegamento con la pagina.** Fuori dalle cinque funzioni la pagina non
chiama `E.provaCarteggio`, `E.giroTecniche`, `E.tappeto`,
`E.dettaglioCarteggio`, `E.nuovaBozza` né `E.concludiBozza`, non scrive righe
`_t: 'c'`, `_t: 't'` o `kind: 'carteggio'` da sé, e non filtra le righe per
tipo per costruire una revisione; e chiama ciascuna delle cinque. Le funzioni
della bozza che servono all'account — `modificaBozza`, `sostituisciBozza`,
`riprendiBozza` — restano della pagina. `attivitaCarteggio()` può servire
all'elenco delle attività salvate. **Q-AMBITO resta aperta:** in tutti e due i
regimi la pagina non carica `carteggio_e12.json`.

**Che cosa il controllo esegue.** `tests/ciclo_carteggio.mjs` estrae le cinque
funzioni e le esegue con le banche vere, specchi sintetici e un `E` che
registra le chiamate e poi esegue il motore, salvo due cose: l'assunzione di
Q-CART4 e i minuti delle condizioni tornano dal banco con un valore suo, così
una pagina che li scrive a mano esce rossa invece di passare per coincidenza.
Prepara le quattro attività, anche su una banca di tre esercizi, una senza un
argomento, una senza esercizi, con la lettura fallita; fra la preparazione e
Inizia cambia i dati — un esercizio del tappeto o del giro fatto altrove deve
fermare Inizia, la banca ricaricata e una risposta ai quiz no —; poi porta il
lavoro al confronto e ai giudizi con le funzioni vere del motore, conclude,
rilegge il riepilogo di quelle righe fra altre attività e righe di prima, e fa
lo stesso con il riconoscimento. La pagina di riferimento
`tests/pagina-ciclo-carteggio.html` mostra la forma minima che passa; non è un
disegno. Il controllo gira su di lei e sulle sue rotture a ogni esecuzione.

**Che cosa il controllo non vede**, e resta al collaudo del §10.2: i testi, i
materiali, la guida e l'esempio, la consegna a due tocchi, il confronto
affiancato, il giudizio rinviato come stato della pagina, «Valutazione in
corso», i ritorni e il focus, la geometria a 375 e 1280 px, le tre porte e le
scorciatoie. Una pagina che scrivesse in schermata numeri presi da un'altra
parte invece che dal risultato del raccordo passerebbe: del collegamento il
controllo legge soltanto che il raccordo sia l'unico a chiedere selezioni,
righe e dettaglio, e che la pagina lo chiami.

Tutte le dipendenze sono di **Claude su `main`**: motore, test, dati di
contratto e specifica non si scrivono da `ui/main`. Se l'API consegnata differisce,
allineare questo documento prima del codice. La regia coordina D-01…04 e
il loro arrivo insieme a client e area 3; P-20 non scrive prompt né modifica
la coda. Il documento è consegnabile oggi, la realizzazione richiede questi
contratti e gli allineamenti della sessione successiva.

### 10.2 Criteri di accettazione della realizzazione

| Caso | Passa soltanto se |
|---|---|
| C-01, ingresso diretto/da Percorso | Tre porte autonome, giudizio e materiali visibili prima dell'avvio; nessun quiz o modulo obbligatorio. |
| C-02, guida ed esempio | Saltabili e ritrovabili; testo/ufficiale dalla banca; zero righe, metriche e flag persistenti; nessuna soluzione inventata. |
| C-03, prova e variante | 4/60/3 dichiarati, Q-CART4 visibile, carte dalla lista, nessun filtro singola carta; variante locale e riprese nominate; preview e runner stessi ID e ordine. |
| C-04, tappeto/giro con fonte vuota e dopo valutazione | Numero reale; tappeto nell'ordine del foglio, giro con motivi del motore; fonte temporanea/registrata distinta. Foglio finito dichiarato, niente diagnosi. |
| C-05, anonimo dopo ricarica | Zero nuove scritture personali in storage/API; testo e attività persi come dichiarato prima e alla fine; tappeto/giro senza memoria delle aperture precedenti. |
| C-06, account offline/non verificato/401/cambio account | Stati del client mantenuti, conferma email e invio separati; nessuna bozza o riga di A passa a B o nella prova anonima. |
| C-07, testo libero e bozza | Navigazione conserva tutto; indicatore significa scritto. Con account ricarica recupera davvero la bozza di D-03, timer non riparte; guasto visibile e copia testo possibile. |
| C-08, consegna/stop/scadenza/doppio click | Due tocchi in pagina, annullamento scrivendo, congelamento e chiusura una volta; zero testo e campi vuoti senza giudizio automatico. |
| C-09, confronto e rinvio | Propria/ministeriale ordinate, tolleranze intatte, scelta umana esplicita; rinvio non diventa falso o prova sostenuta; nessun salvataggio dichiarato senza evidenza. |
| C-10, fine e scrittura fallita | Riepilogo e stato reale; prova autovalutata distinta dall'allenamento; dettaglio conservato e stesso uid al ritento; nessun toast al posto del ciclo. |
| C-11, revisione corrente/storica | Stesso tentativo, filtro e conteggio dalla medesima fonte anche dopo pause; lettura senza scritture, confini ricostruiti/mancanti dichiarati, ritorno e focus corretti. |
| C-12, tecniche | Multiselezione dichiarata e completa, classificazione del progetto nominata; riepilogo/revisione propri; nessun aumento del carteggio risolto; passaggio alla preparazione sulla carta. |
| C-13, account finale | Un blocco del client dopo riscontro/revisione, continuazione libera; registrazione conserva tutte le righe della pagina, scarti non diventano successo. |
| C-14, banca/fonte/ID mancanti | Errore distinto da vuoto, avvii incoerenti bloccati, risultati propri leggibili, Info e azioni per recuperare. |
| C-15, 375 e 1280 px/tastiera | Screenshot guardati di ingresso, preparazione, scrittura, confronto, rinvio e riepilogo nei due regimi; niente tagli; tastiera/focus/target e stati senza colore verificati. |

Prova con persone distinta dal collaudo tecnico: una persona nuova deve
saper dire chi svolge e chi giudica, quali carte servono alla propria lista,
che cosa resta dopo una ricarica, e perché riconoscere tecniche non equivale
allo svolgimento. Usare anche carte e strumenti reali per osservare un flusso
completo; non dichiarare comprensibilità dal solo DOM o dalle suite verdi.

### 10.3 Evidenze di P-20 e limiti

Base iniziale **31aa19b**, `ui/main`, working tree pulito e stesso HEAD di `main`.
Worktree UI distinto, hook `.githooks`; il ramo non ha upstream, quindi
`git pull --ff-only` non è applicabile. Nessuna configurazione o merge cambiata.
Lettura del Word e controllo della sua impronta, contratti e chiamanti reali.
Durante P-20 il ramo ha ricevuto P-30 e il suo aggiornamento di regia, fino a
**afb0b9c**: riletti il contratto `sessioni` e area 3 §7.1, rieseguite le suite
interessate. L'attività intera oltre pausa è ora supportata per i quiz;
le dipendenze per carta e tecniche di D-02 restano necessarie. Gli aggiornamenti
ricevuti non fanno parte delle modifiche scritte da P-20.

Riprodotto sotto Node con banca pubblicata e progressi sintetici in memoria:
135 esercizi; `tappeto(..., {}, 4)` apre `5.1.3-1`…`5.1.3-4`, dopo quattro
valutazioni apre `5.1.3-5`, `5.1.3-6`, `5.2.3-1`, `5.2.3-2`. Il giro restituisce
7 esercizi in entrambi i casi; cambia `5.1.3-1` in `5.1.3-5` quando il primo
risulta già provato. Una fonte vuota ricomincia dalla prima selezione:
sono selezioni di attività disponibile, non conoscenza del lavoro fuori sito.

Eseguita la funzione reale `annotaCart()` estratta dalla pagina in un contesto
isolato con DOM minimo e contatori per archivio/storage: il risultato scritto
compare in `S.cprova.risp`, **zero chiamate di persistenza**. Questa prova
dimostra il comportamento del gestore, non un collaudo di ricarica nel browser.
La discrepanza con la promessa «a ogni tasto» è D-03; non è una perdita reale
di dati di una persona. Le API delle sessioni per `c`/`t` e i legami attuali
sono osservazioni del sorgente, da fissare con i controlli di D-02.

Cinque suite complete, senza deselezioni: motore **148/150, 2 skip previsti**
(vecchie copie UI rimosse), dati **242**, interfaccia **295**, specifica **394**;
server **58/58** su Node **25.3.0** e LTS **24.21.0**. Archivio ufficiale LTS
disponibile separatamente, SHA-256 ricalcolato e coincidente con il manifesto
`SHASUMS256.txt` di nodejs.org già scaricato; binario confrontato con quello
contenuto nell'archivio. I bind locali delle suite dati/server hanno richiesto
esecuzione fuori sandbox; nessun test escluso per aggirare il limite.
**12 riferimenti locali** risolti, guardiano e controllo condiviso della
documentazione verdi. Queste verifiche riguardano il prodotto esistente e
l'integrità della consegna documentale; non rendono realizzati questi flussi.
Nessun collaudo visivo o prova con persone dichiarati in P-20. Nessuna modifica
a `site/`, versione, specifica, client, test, eccezioni o `prossime-sessioni.md`.
