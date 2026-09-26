# Area 3 — Il ciclo che si chiude

**Sessione P-14, decisioni di progetto del 26 settembre 2026. Realizzato da P-19 lo stesso giorno: evidenze e scarti nel §10.4.**
Consegna sul modello delle aree [1](area-1-progetto.md) e
[2](area-2-progetto.md): riepilogo, revisione e «Riprova questi N» con testi,
stati, flussi, contratti e accettazione. Non è una verifica di usabilità né
un'interfaccia realizzata. La sessione modifica solo questo documento e il
CHANGELOG. La coda e i prompt restano in
[prossime-sessioni.md](prossime-sessioni.md).

## 1. Fonti, precedenze e perimetro

Riferimenti letti nel repository:

- [Specifica di lavoro](prossima-versione.md), §§4, 5.1 e 6: area 3,
  corrispondente al capitolo 10 della Specifica UX/UI, e separazione UI/motore.
  Questa consegna usa i contratti riportati nel repo; non dichiara una nuova
  lettura della copia Word esterna citata dalle aree precedenti.
- [Specifica del prodotto](specifica.md), §§2.4, 4.4, 4.7, 7.5 e 9:
  R-FLU-01…04, R-UX-06, conservazione e controlli esistenti;
  [filosofia](filosofia.md) per tono, libertà di concludere e verità dei dati.
- [Area 1](area-1-progetto.md), §§5–7: prima attività, tre affermazioni ammesse,
  avvisi; [area 2](area-2-progetto.md), §§3, 6–10: cinque intenzioni,
  snapshot, simulazioni, ritorni e dipendenze.
- [ADR-004](adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md),
  [progetto account](account-progetto.md), §§9.6, 10, 12 e 13.3, e
  [progetto del client](account-client-progetto.md), §§3–6 e 9–10:
  revisione libera nella pagina aperta e registrazione a fine attività.
- [Eccezioni dell'interfaccia](eccezioni-interfaccia.md): `erroriSessione`
  orfana e alt `figura`, entrambi assegnati all'area 3.
- `site/app.html`: `apri()`, `mostra()`, `rispondi()`, `fine()`, `chiudi()`,
  `chiudiSoft()`, `avviaSim()`, `apriRivedi()`, `rivediQuiz()`,
  `rivediTesta()`, `tagPerTentativo()` e gestori di click/tastiera;
  `site/engine.js`: `esito()`, `sessioni()`, `erroriSessione()`;
  i relativi test, letti senza edit.

**Precedenza:** ADR-004 e progetto client prevalgono sulle vecchie promesse
di salvataggio dell'area 1. Il regime reale decide i testi (§3); progettare
la prova anonima non la abilita nella versione attuale. L'area 3 completa e
sostituisce il riepilogo minimo dell'area 1 §5.4, conservandone i limiti sulle
affermazioni e le uscite. Conserva selezioni e ritorni dell'area 2.

**Entra:** conclusione completa o anticipata dei quiz base/vela, prima attività,
allenamento consigliato, argomento, ripasso, giro e simulazione; riepilogo
per fase, revisione delle risposte e riprova degli errori di quella attività.
La revisione dei quiz già raggiungibile da Percorso/Progressi usa gli stessi
componenti. Entra l'alternativo delle figure nel runner e nella revisione.

**Non entra:** ridisegno di navigazione, configurazioni Quiz, Carteggio,
tecniche, Segnali, Progressi o client account; nuove patenti, metriche,
correzioni ministeriali, audio o asset. `rivediCarteggio()` conserva il suo
contratto: una modifica al componente condiviso `rivediTesta()` deve limitarsi
ai quiz. Il ciclo di Carteggio resta all'area 4; quello dei Segnali conserva
riepilogo e contabilità separati. R-FLU-01 per tutte le attività non si
dichiara chiuso dalla sola area 3.

**Per chi:** chi ha appena risposto vuole capire cosa è successo, leggere una
correzione e scegliere se esercitarsi ancora. Può conoscere già il quesito
dal manuale; può temere che un errore sia una diagnosi della sua preparazione.
La schermata descrive il tentativo e offre uscite, senza voto sul livello,
celebrazioni, pressione a continuare o registrazione obbligatoria.

## 2. Decisioni da applicare

| Decisione | Scelta e motivo |
|---|---|
| Un ciclo comune | Runner → riepilogo → revisione o nuova riprova. La prima attività usa gli stessi componenti con il proprio contesto, senza un riepilogo concorrente. |
| Riepilogo breve | Quantità risposte, corrette, errate e non affrontate; nessuna percentuale dominante, semaforo di preparazione, confronto prima/dopo o diagnosi. |
| Revisione | Tutte le risposte date, con filtro «Solo errori»; domanda, scelta, risposta ufficiale, figura, note e tag nello stesso blocco. Nessuna risposta nuova durante la lettura. |
| Riprova | Tutti e soltanto i quesiti errati dell'attività selezionata, da `E.erroriSessione()`. Non è «Ripassa gli errori» di tutto lo storico. |
| Identità | La riprova è un nuovo allenamento con nuovo `sim_uid` e nuovi `uid`; il tentativo precedente resta immutato. |
| Correzione | Immediata nella riprova, anche se nasce da una simulazione. Avanzamento automatico spento soltanto per questo runner; preferenza conservata. |
| Mancanti | Domande non risposte separate dagli errori; non vengono archiviate come risposte errate né incluse in «Riprova questi N». |
| Libertà | Ritorno e scelta di un'altra attività sempre espliciti; nessuna riprova obbligatoria, nessun avvio automatico dal riepilogo. |
| Permanenza | Senza account, dalla versione client, tutto il ciclo funziona sulla pagina aperta. Nessuna persistenza della lista, del riepilogo o della posizione. |
| Simulazione | Esito della sola prova/fase, soglia e timer esistenti; Base e vela mantiene due fasi, senza punteggio aggregato né promessa di superamento dell'esame. |

Sono decisioni operative di questa area. La loro comprensibilità con persone
resta da verificare (§10.2).

## 3. Conservazione, accesso e invito account

| Regime reale | Fonte del ciclo | Testo nel riepilogo e nella revisione |
|---|---|---|
| Prodotto attuale, prima del client account | Righe dell'archivio locale; per l'attività appena svolta anche il dettaglio in memoria del runner | «Le risposte date restano in questo browser. La lista corrente non si riprende dopo una ricarica.» |
| Prova senza account, dalla versione client | Solo righe in memoria della pagina aperta | «Queste risposte restano solo nella pagina aperta. Se la chiudi o la ricarichi le perdi.» |
| Account con accesso, dalla versione client | Righe dell'account e copia offline, secondo stato effettivo | «Le risposte si salvano nel tuo account. La lista corrente non si riprende dopo una ricarica.» Solo quando il client conferma il salvataggio; altrimenti usare lo stato sotto. |

Il testo anonimo compare anche **prima** della riprova, accanto al pulsante:
«Senza account le risposte valgono solo finché questa pagina resta aperta.
Se la chiudi o la ricarichi, le perdi. Non salviamo niente, nemmeno le tue
preferenze.» È lo stesso contratto del client §4.1. Nessun gate per aprire
riepilogo, revisione o riprova. L'anonimo non riceve link ai Progressi o
all'archivio storico; può rivedere attività svolte in questa pagina, anche
quando torna dal Quiz, finché il loro contesto in memoria è disponibile.

Conservare nell'attuale pagina i contesti delle attività appena concluse in
memoria permette di tornare al loro riepilogo: è un indice temporaneo alle
righe e alla lista, non una seconda contabilità né un archivio persistente.
Le righe restano la fonte dei tentativi. Senza account non scrivere niente
in IndexedDB/localStorage/sessionStorage, cookie o API per rendere possibile
la revisione. Dopo ricarica non ricostruire la prova dalle vecchie chiavi.

Il futuro invito account si colloca **dopo risultato e azioni del ciclo**, nel
riepilogo con risposte, una sola volta per quella visualizzazione: contenuto,
azioni «Crea un account e salva» / «Continua senza account» e link sono
esattamente quelli del client §4.1. Non ricompare aprendo la revisione,
cambiando filtro o tornando al medesimo riepilogo. Alla fine di una nuova
attività può comparire di nuovo. Il modulo richiudibile conserva il riepilogo
e restituisce il focus al suo controllo. L'import per `uid` porta tutte le
righe della pagina, inclusi tentativi e tag della riprova, senza lo specchio.
Registrazione/accesso/attesa email sono del client, non di questa area.

Gli avvisi prevalgono su ogni frase ordinaria:

- **Account offline/in attesa:** «Le risposte restano su questo dispositivo
  in attesa di sincronizzazione.» Nessuna conferma che siano già sul server.
- **Scrittura locale fallita:** «Le ultime risposte potrebbero non essere
  salvate. Apri Info e scarica i progressi adesso.» Info, pallino e riga
  d'errore restano visibili; esportazione solo nel regime che la supporta.
- **Account non confermato:** mantenere l'avviso del client §6 con la data
  reale di cancellazione; non sostituirlo col testo anonimo.
- **Fonte alternativa leggibile:** «Stiamo usando un archivio alternativo:
  potresti non vedere tutte le risposte precedenti.»

Una scrittura fallita non cancella il dettaglio corrente: le righe costruite
dal runner, con i loro `uid`, restano disponibili in memoria per revisione e
riprova; non si dichiarano salvate. Il client gestisce eventuali ritentativi.
Un errore di lettura dello storico non si trasforma in «Nessun errore».

## 4. Conclusione e riepilogo

### 4.1 Ingressi, stop e zero risposte

- Ultima risposta → «Vedi il riepilogo». Un avanzamento automatico già
  attivo può raggiungerlo secondo il comportamento corrente; non avvia
  mai la riprova. Prima attività e riprova conservano auto spento.
- Durante un allenamento, controllo testuale **«Termina l'attività»** ed Esc:
  con almeno una risposta aprono il riepilogo parziale; con zero ritornano
  all'origine e mostrano «Attività terminata senza risposte.» Nessuna riga
  inventata e nessun invito «salva questa attività».
- Durante la simulazione, controllo **«Consegna la prova»** ed Esc aprono
  una conferma: «Vuoi consegnare la prova? Hai risposto a {R} domande su
  {T}. Dopo la consegna non puoi completare questa prova.» Azioni
  «Consegna» / «Continua la prova». Il timer continua anche nella conferma;
  a zero la consegna automatica ha precedenza e chiude il pannello.
- Scadenza o consegna della simulazione apre il riepilogo anche con zero
  risposte: la prova è conclusa con domande mancanti, non superata; nessuna
  risposta `_t:'q'` fittizia. Conservare la riga `_t:'s'` idempotente prevista
  dal runner. Nessun invito a salvare risposte inesistenti.

Il passaggio al riepilogo ferma tick e avanzamenti pendenti, congela contesto
e risultati; due eventi simultanei consegnano una sola volta. Aprire/chiudere
la revisione non richiama la consegna e non scrive una seconda prova.

### 4.2 Ordine e testi dell'allenamento

Ordine del DOM identico a 375 e 1280 px:

1. Avvisi attivi, con Info accessibile sopra ogni overlay.
2. `h1` **«Attività conclusa»**, oppure **«Ti sei fermato qui»** se parziale;
   nome dell'attività e banca in testo normale: per esempio
   «Quiz per argomento · Quiz vela» o «Riprova degli errori · Quiz base».
3. «Hai risposto a {R} domande su {T}.» Singolare: «Hai risposto a 1 domanda
   su {T}.» Tre etichette: **«Risposte corrette: {C}»**,
   **«Risposte errate: {E}»**, **«Domande non affrontate: {M}»**.
4. Con errori: «Puoi rivedere la tua risposta e quella ufficiale, poi
   riprovare questi quesiti.» Senza errori e R > 0:
   «Tutte le risposte date in questa attività sono corrette.»
   Se M > 0 segue «Le domande non affrontate non sono conteggiate come errori.»
5. Azioni del §6, prima di qualunque invito account.
6. Conservazione del §3 e futuro invito account nel posto previsto.
7. «Puoi concludere qui.»

Non elencare tutte le correzioni nel riepilogo: il dettaglio si apre nella
revisione. La prima attività conserva i soli tre tipi di affermazione:
che cosa è successo, quali risposte rivedere, che cosa non è stato affrontato.
Il dato facoltativo già esistente «Quiz base mai incontrati qui: {mai_visti}»
può restare **solo per la prima attività**, da `E.traccia()`; non è un
giudizio sullo studio esterno. Non estenderlo al giro come «programma coperto».
Nessun «Sei migliorato», «Sei pronto», «livello iniziale» o tema debole dedotto
dalla lista breve. Nessun confronto di punteggi fra tentativi.

### 4.3 Simulazioni e Base e vela

Titolo **«Simulazione quiz base conclusa»** / **«Simulazione quiz vela conclusa»**.
Sottotitolo «Esito di questa prova, non una previsione dell'esame.» Valori:
«Risposte corrette: {C} su {T}», «Risposte errate: {E}»,
«Domande senza risposta: {M}», «Errori ammessi: {erroriMax}»;
**«Prova superata»** / **«Prova non superata»** dal contratto del §7.
Se timer a zero: «Tempo scaduto. La prova è stata consegnata.» Altrimenti
«Prova consegnata.» Non presentare il limite di tempo come durata misurata.

Con M > 0: «Le domande senza risposta non entrano nella riprova degli errori.
Puoi esercitarle scegliendo un argomento.» L'esito resta non superato anche
con E entro soglia: il comportamento attuale è conservato e dichiarato.

Per **Base e vela**, ogni fase ha un proprio `sim_uid`, riepilogo e riprova.
Dopo base, azione principale «Continua con la vela» se la prova passa;
altrimenti «Prosegui comunque con la vela», con testo
«Il quiz base non è superato. Puoi proseguire con la vela per esercitarti;
all'esame il quiz base deve essere superato per proseguire.» Nessuna inferenza
sul superamento dell'intero esame. Il timer vela nasce solo al suo avvio.

Revisione della base e ritorno al riepilogo lasciano intatta la fase in attesa.
Se si sceglie riprova prima della vela, l'anteprima del §6.2 aggiunge
«La vela non è ancora iniziata. Avviare un altro allenamento conclude qui
questa simulazione.» Il click «Inizia la riprova» conclude la simulazione;
«Torna al riepilogo» conserva la fase in attesa. Per «Scegli un'altra
attività» un pannello con lo stesso testo offre «Scegli un'altra attività» /
«Torna al riepilogo». Ritorno finale alla configurazione
conclude le fasi non avviate; non registra una prova vela mancata.
Dopo vela, aggiungere «Rivedi il quiz base» se il dettaglio è disponibile;
«Riprova questi N» riguarda soltanto la vela mostrata. Non unire i due elenchi.

## 5. Revisione: leggere e classificare un tentativo

Ingressi: riepilogo con **«Rivedi le risposte»** oppure **«Rivedi gli errori»**;
porte esistenti da Percorso e sessioni/prove nei Progressi quando disponibili.
La revisione della sessione corrente usa il suo contesto, senza richiedere
che una scrittura persistente sia riuscita. Titolo `h1`
**«Revisione dell'attività»**, con nome e banca; per simulazioni
**«Revisione della simulazione quiz base»** / **«… quiz vela»**.
Data per lo storico, nessuna durata inferita o percentuale colorata nuova.

Due controlli esclusivi: **«Tutte le risposte ({R})»** e
**«Solo errori ({E})»**. Il secondo è selezionato dall'ingresso «Rivedi gli
errori»; negli altri casi il primo. Con E = 0 il filtro resta leggibile e
porta a «Non ci sono risposte errate in questa attività.» e al controllo
«Tutte le risposte». I numeri vengono dallo stesso dettaglio del §7, non
dallo stato attuale del quesito nello specchio. Un errore antico corretto
in seguito rimane un errore di **quel** tentativo.

Ogni blocco, nell'ordine delle risposte della sessione, contiene:

1. Posizione nella lista originale quando disponibile; tema, voce e numero
   ministeriale già presenti. Non rinumerare «Solo errori» come una lista nuova.
2. Testo ministeriale per esteso e figura, ingrandibile come nel runner.
3. Esito testuale **«Corretta»** / **«Errata»**; **«La tua risposta»** e
   **«Risposta ufficiale»**, entrambe anche per una risposta corretta.
4. Nota prima (`nbp`, incluso oscuramento) e nota dopo (`nb`), distinte come
   nel riscontro esistente. Nessuna spiegazione didattica inventata.
5. Solo per risposte errate, classificazione facoltativa del tentativo:
   «Se vuoi, indica perché hai sbagliato. Puoi saltare questo passaggio.»
   Pulsanti **«N — Non lo sapevo»**, **«L — Letto male»**,
   **«C — Calcolo»**, con selezione annunciata. Il tag riguarda `auid`,
   mai l'ultimo quesito globale. Una riclassificazione aggiunge una riga
   `_t:'g'` con `ts`; si legge l'ultima per quel tentativo tramite il contratto
   esistente (o il successore del motore, se già consegnato).

La lettura e i filtri non archiviano risposte né prove. Classificare è l'unica
scrittura ammessa qui, con il regime del §3 e avvisi se fallisce. Il tag non
cambia `correct`, ordine o numero del ripasso. Con tag assente nessun default
N; con prima attività i tag sono disponibili ma facoltativi come negli altri
allenamenti. Non aggiungere una seconda implementazione del lettore di tag.

Per una scelta non registrata/importata: **«La tua risposta non è registrata.»**
Non dire «senza risposta»: la riga prova che una risposta è stata data.
Per un quesito assente dalla banca: blocco conservato con identificativo e
**«Il testo di questo quesito non è disponibile nella banca caricata.»**
Non scartare il blocco in silenzio. Con dettaglio assente:
**«Di questa attività non è disponibile il dettaglio delle risposte.»**
Esito della prova, se registrato, leggibile ma nessuna riprova fittizia.

Confine ricostruito (`fonte === 'risposte'`): mostrare prima dei filtri
**«Il raggruppamento di questa attività è ricostruito dalle risposte:
inizio e fine non erano registrati.»** Vale anche nell'anteprima di riprova.
I quesiti non risposti della lista corrente restano un numero separato:
nessun blocco con una falsa scelta o tag. Per lo storico di allenamento il
totale originariamente selezionato può essere sconosciuto: mostrare soltanto
le risposte disponibili, senza inventare domande mancanti.

Chiusura **«Torna al riepilogo»** per l'attività corrente, **«Torna al
Percorso»** o **«Torna ai Progressi»** per ingressi da quelle viste. Esc chiude
soltanto la revisione; focus al controllo d'origine. Se la sessione sparisce
dopo azzeramento/import: **«Questa attività non è più disponibile.»**,
ritorno all'origine valida, o Quiz se manca. Non aprire la sessione successiva.

## 6. Azioni e riprova

### 6.1 Gerarchia delle uscite

| Condizione | Azione principale | Altre azioni visibili |
|---|---|---|
| Errori disponibili, nessuna fase pendente | **«Riprova questi {N} quesiti»**; singolare «Riprova questo quesito» | «Rivedi gli errori», «Rivedi le risposte», ritorno esplicito, «Scegli un'altra attività» |
| Nessun errore, R > 0 | Ritorno esplicito | «Rivedi le risposte», «Scegli un'altra attività»; nessun pulsante riprova disabilitato |
| Fase vela pendente | Proseguimento del §4.3 | Revisione e riprova base, ritorno, scelta libera |
| Errori presenti ma elenco incompleto/non verificabile | «Rivedi le risposte» se possibile, altrimenti ritorno | Stato del §8; nessuna riprova con quantità inferiore non spiegata |

Ritorno esplicito: **«Torna al Percorso»** per origine Percorso e prima
attività; **«Torna ai Progressi»** solo quando l'origine è Progressi ed è
accessibile; **«Torna alla configurazione Quiz»** per Quiz. Senza origine valida
**«Torna ai Quiz»**. Focus al controllo d'origine o al titolo della destinazione.
«Scegli un'altra attività» porta alla lista delle cinque intenzioni, focus su
Quiz; per la prima attività conserva l'uscita dell'area 1 verso il blocco
«Scegli un'attività» del Percorso, dove Carteggio è direttamente raggiungibile.

### 6.2 Anteprima prima dell'avvio

Click su riprova apre un pannello nella stessa superficie, non il runner:

> **Riprova gli errori di questa attività**
>
> {N} quesiti · Quiz {base/vela}
>
> Sono i quesiti a cui hai risposto in modo errato in questa attività.
> Vedrai la risposta ufficiale dopo ogni domanda. È un nuovo allenamento,
> senza il timer della simulazione.

Segue il testo di conservazione del §3 (anonimo: anche avviso pre-avvio),
quello sul confine ricostruito se necessario e le azioni **«Inizia la
riprova»** / **«Torna al riepilogo»** (o «Torna alla revisione» dall'ingresso
storico). Nessun filtro, numero da scegliere o durata fissa. La durata
facoltativa segue area 2 §7: solo `ritmo()` affidabile della banca e
`stimaImpegno()` con fonte `orologio`; non è necessaria per avviare.

Il numero e la lista sono un solo risultato congelato di `erroriSessione()`.
Il click Inizia usa **quella lista**, nello stesso ordine, senza rimescolare,
senza `coda()` e senza seconda selezione. Non escludere errori già corretti
in un tentativo successivo, oscurati o quesiti non compatibili con filtri
personali: è il ripasso di questo tentativo. Note e figure restano dichiarate.

Un import/sincronia/cambio account/banca/azzeramento che invalida il contesto
richiede aggiornare insieme conteggio e lista prima di Inizia:
**«Le risposte disponibili sono cambiate. Riapri la riprova per aggiornare
la selezione.»** Ritorno al riepilogo/revisione; nuovo click esplicito.
Una semplice riclassificazione N/L/C non invalida la lista. Se i dati non sono
cambiati, non aggiornare l'anteprima soltanto perché è passato del tempo.

### 6.3 Nuovo runner e sua conclusione

Titolo **«Riprova degli errori»**, banca esplicita; prima domanda:
**«Questi quesiti vengono dagli errori dell'attività appena scelta.»**
Correzione immediata, nessun conto alla rovescia, auto spento per questa
attività, «Prossima domanda» / «Vedi il riepilogo», stop del §4.1.
La nuova lista non porta `sim` o fasi pendenti. La chiave persistita rimane
`mode: 'sbagliate'`; il contesto temporaneo distingue riprova di sessione e
ripasso generale, senza aggiungere una sesta intenzione o un tipo di riga.

Al termine si applica lo stesso riepilogo, riferito **solo** al nuovo tentativo.
Se resta un errore, riprova soltanto quelli di questo nuovo tentativo; se non
ne restano, «Tutte le risposte date in questa attività sono corrette.» Non
dire «Errori risolti definitivamente» o confrontare la percentuale precedente.
Il ritorno finale conserva l'origine dell'attività iniziale, senza ricrearla.
Il riepilogo precedente resta consultabile nei contesti della pagina e,
quando salvato, dalla revisione storica. Nessuna catena automatica o obbligo
di continuare finché E = 0.

### 6.4 Flusso completo

```text
Runner quiz
  ├─ allenamento senza risposte + stop → origine, nessuna sessione inventata
  └─ ultima risposta / stop con risposte / consegna o scadenza simulazione
       → riepilogo del tentativo
          ├─ Rivedi → tutte le risposte / solo errori → stesso riepilogo
          ├─ Riprova questi N → anteprima dello snapshot
          │    ├─ annulla → stesso riepilogo o revisione
          │    └─ Inizia → nuovo allenamento, nuova identità → nuovo riepilogo
          ├─ fase vela in attesa → avvio vela → riepilogo vela distinto
          ├─ ritorno → origine e focus
          ├─ altra attività → scelta libera
          └─ futuro invito account → modulo/client → riepilogo conservato
Revisione storica accessibile → anteprima errori di quel tentativo → nuovo runner
Ricarica → nessuna ripresa della lista; anonimo perde anche risposte e contesti
```

## 7. Contratti con il motore e identità dei dati

### 7.1 Una fonte per dettaglio, numeri e lista

Il contesto corrente conserva in memoria: identità dell'attività/fase,
lista originale, riferimenti alle righe `_t:'q'` costruite dal runner,
origine/focus/configurazione e stato completo/parziale/consegnato/scaduto.
Si conserva il dettaglio anche se la persistenza fallisce. Non duplicare lo
specchio `S.prog` e non riscrivere i timestamp per influire sul raggruppamento.

Per il dettaglio corrente, `E.esito()` consuma i valori booleani `correct`
delle stesse righe mostrate in revisione. Allenamento: usare `totale`, `esatte`
ed `errori`, ignorare `superata` con soglia nulla. T è la lunghezza della
lista originale, M = T − totale è una differenza fra quantità note, non una
nuova statistica. Simulazione: soglia da `meta.prove`, esito da `E.esito()`;
superata soltanto con `superata === true` **e M === 0**, come oggi.
Il `_t:'s'` non si ricrea aprendo la revisione. Nella revisione storica il
totale della prova viene da `_t:'s'`; se manca, non ricostruire una lista
prospettica dai conteggi dell'archivio.

**Contratto consegnato da `main` (P-30, 26 settembre 2026).** La forma
proposta qui è stata adottata, con quattro precisazioni che la proposta
lasciava a `main`. Il riferimento è il commento di `sessioni()` ed
`erroriSessione()` in `site/engine.js`, e §4.4 della specifica.

```js
// Fonte: archivio leggibile o righe in memoria della pagina/attività.
const opzioni = { confine: 'attivita' };
const sessione = E.sessioni(fonte, opzioni).find(s => s.id === id);
const riprova = E.erroriSessione(fonte, banca, id);   // confine sempre 'attivita'
// riprova = { lista, quanti, fonte, trovata, ambigua, motivi, mancanti }
// Snapshot in memoria: id, revisione dei dati, riprova.
// Etichetta N = riprova.quanti; Inizia => apri(riprova.lista, 'sbagliate', ...).
```

- **`sessioni(righe, { confine })`** accetta `'pausa'`, il predefinito, e
  `'attivita'`; qualunque altro valore **lancia**, invece di essere ignorato.
  Con `'attivita'` tutte le righe di un `sim_uid` stanno in un gruppo, oltre
  la pausa e anche intrecciate con un'altra attività (due schede), e ogni id
  compare una volta sola. Le righe senza legame si ricostruiscono come nel
  predefinito — stessi gruppi, stessi id, `fonte: 'risposte'` —: non si
  uniscono in pagina né nel motore.
- **Il predefinito non cambia.** `ritmo()` lo usa, e un controllo pretende che
  un'attività ripresa dopo 21 minuti non ne gonfi la misura.
- **`erroriSessione()` usa sempre il confine dell'attività**, e un
  `opt.confine` diverso lancia: gli errori di mezza attività non sono mai la
  risposta giusta. Non serve passargli l'opzione.
- **Un id ambiguo si dichiara.** Un gruppo che raccoglie un quesito ripetuto,
  due modalità o due banche porta `ambigua: true` e `motivi` (fra
  `'quesito ripetuto'`, `'modalità diverse'`, `'banca diversa'`), sia in
  `sessioni()` sia in `erroriSessione()`. Qui `erroriSessione()` restituisce
  `lista: []` e **`quanti: null`**: non «nessun errore», che sarebbe falso,
  ma «non si sa». La UI blocca la riprova col testo del §8.
- **I quesiti mancanti si nominano.** `mancanti` sono gli `item_id` sbagliati
  che la banca passata non ha: gli errori dell'attività sono
  `quanti + mancanti.length`, senza che la pagina li riconti.

**Dalla pagina al motore passa un raccordo solo** (P-31): `riepilogoQuiz()`,
`anteprimaRiprova()` e `avviaRiprova()`, di cui il §10.1 dà il contratto che
il controllo esegue. Lo snippet qui sopra è quello che le tre funzioni fanno
dentro; la pagina non chiama `E.erroriSessione` fuori da loro.

Per una sessione senza legame registrato, usare il confine ricostruito dal
motore e dichiararlo. Il nuovo contratto preserva l'ordine delle righe e gli
errori per tentativo.

**Che cosa oggi la pagina fa ancora col confine per pausa** (letto nel codice
di `app.html` a `31aa19b`, non guidato nel browser): l'elenco delle sessioni
in Progressi, la revisione di una sessione o di una prova (`sessioniTutte()`)
e «l'ultima attività» del Percorso (`E.sessioni(S.archivio, { limite: 1 })`).
Un'attività ripresa dopo una pausa vi compare **in due righe con lo stesso
id**, e tutte e due aprono la metà più recente; la revisione di una
simulazione con una pausa oltre 20 minuti ne mostra una parte. Sono chiamanti
di interfaccia: passano a `confine: 'attivita'` con la realizzazione di
quest'area, insieme al riepilogo.

Quando `trovata` è false: sessione indisponibile, non «nessun errore».
Quando `quanti !== lista.length`: avvio bloccato e guasto visibile (§8).
Quando `mancanti` non è vuoto, cioè il dettaglio contiene E errori ma
`quanti < E` per quesiti assenti dalla banca: dettaglio conservato e riprova
bloccata; nessun «Riprova questi E» che ne apra meno. Quando `ambigua` è
true: dettaglio disponibile, riprova bloccata col testo «contratto ambiguo»
del §8. Zero risposte della simulazione ha dettaglio vuoto noto,
non si tratta come sessione persa.

### 7.2 Chiamanti e comportamenti da preservare

| Punto della pagina | Che cosa cambia | Che cosa si conserva |
|---|---|---|
| `fine()` e ramo `primaBase` | Riepilogo comune, azioni contestuali, snapshot errori | `E.esito()`, dettagli correnti, avviso salvataggio e tre affermazioni ammesse |
| `apri()` / `mostra()` / `rispondi()` | Titolo riprova, auto locale, testo stop, alt della figura | Un nuovo `sim_uid` per ogni avvio, `uid` per risposta, note, doppio tocco, tastiera e `E.applica()` |
| `chiudi()` / Esc | Con risposte allenamento passa dal riepilogo; ritorno finale esplicito | Origine, configurazione e focus dell'area 2; timer fermato alla vera conclusione |
| `avviaSim()` / `chiudiSoft()` / fasi | Conferma consegna, contesti distinti base/vela | Timer e soglie da meta, nessuna correzione in prova, identità `_t:'s'` idempotente |
| `apriRivedi()` / `rivediQuiz()` | Revisione comune corrente/storica, filtri e riprova | Porte esistenti, dati per tentativo, dichiarazione ricostruzione, offline |
| `rivediTesta()` | Nei soli quiz numeri descrittivi e vero esito della prova | Carteggio mantiene titolo, giudizio e dati del suo ramo |
| `tagPerTentativo()` e suoi chiamanti | Riutilizzati nella revisione e nella prima attività | Append-only con `ts`, ultimo tag per `auid`, nessun tag automatico |

Prima della realizzazione elencare nuovamente tutti i chiamanti reali delle
funzioni condivise: il ramo può aver ricevuto altri lavori. Non cambiare
`sessioni()` o `ritmo()` dalla UI e non togliere chiamate protette.

Nel commit che introduce la chiamata reale, togliere `erroriSessione` dagli
orfani di `eccezioni-interfaccia.md` e aggiungerla alle chiamate protette.
In P-14 la riga resta. `fondi`, `peggiori` e la coda account non appartengono
a questa chiusura.

## 8. Stati di errore, figure e offline

| Stato | Testo e uscita |
|---|---|
| Dettaglio in caricamento | «Caricamento delle risposte…»; avvii disabilitati, ritorno disponibile, nessuno zero provvisorio. |
| Lettura fallita, nessun dettaglio corrente disponibile | «Non riusciamo a leggere le risposte di questa attività. Apri Info per controllare l'archivio.» → Info e ritorno. |
| Sessione rimossa | «Questa attività non è più disponibile.» → origine valida o Quiz. |
| Nessun errore verificato | «Non ci sono risposte errate in questa attività.» Revisione di tutte e ritorno disponibili. |
| Quesito mancante | «Non possiamo riaprire tutti i quesiti errati: alcuni non sono disponibili nella banca caricata. Riprova a caricare i quiz.» → caricamento dati con contesto in memoria conservato, oppure ritorno. |
| Contratto ambiguo/conteggio incoerente | «Non possiamo verificare l'elenco degli errori di questa attività. Puoi rivedere le risposte disponibili o tornare ai Quiz.» Riprova bloccata, errore registrato e visibile. |
| Fonte aggiornata dopo anteprima | Testo del §6.2 e riapertura esplicita; nessun elenco sostitutivo al click. |
| Figura con `fm` | «Figura non disponibile: {motivo}.» nello spazio della figura. |
| Immagine che non carica | «Figura non disponibile. Apri Info per controllare le figure offline.»; testo/risposte/note restano leggibili, nessun salto del quesito. |
| Offline, banca e dettaglio disponibili | Ciclo completo disponibile; testo di conservazione secondo regime, nessun invito a registrarsi che prometta riuscita senza rete. |
| Scrittura/tag/sincronia fallita | Avviso del §3 e stato del client; revisione corrente possibile, mai falsa conferma di salvataggio. |

La stessa funzione di presentazione della figura si usa nel runner e nella
revisione quiz. Alternativo preso dal testo del quesito, escapato come gli
altri testi: **«Figura del quesito {progressivo}: {domanda}»**; senza
progressivo **«Figura del quesito: {domanda}»**. Nome del controllo di
ingrandimento **«Ingrandisci la figura del quesito {progressivo}»**, senza
progressivo «Ingrandisci la figura del quesito». Non inventare una descrizione
delle linee del disegno né suggerire la risposta. La ripetizione del testo
identifica la figura; non costituisce una trascrizione del suo contenuto e
non rende automaticamente risolvibile un disegno con lettore di schermo.

Togliere l'eccezione alt `figura` soltanto insieme alla sostituzione reale
dell'inserimento comune, verificando anche i quesiti di tecniche che transitano
nel runner quiz. Il loro flusso non si ridisegna. Se una diversa inserzione
di Carteggio risultasse ancora generica, mantenerne un'eccezione motivata per
l'area 4; non dichiarare risolta l'accessibilità di tutte le figure.

## 9. Disposizione, focus e tastiera

Tema chiaro, token e contenitore esistenti. Telefono: una colonna con margini
16–20 px, numeri accanto alle etichette, azioni a larghezza utile. Desktop:
colonna di lettura entro circa 70 caratteri, valori del riepilogo affiancabili,
scelte e correzioni in ordine verticale. Nessuna dashboard o griglia di temi.
Titoli 28–32 px, sottotitoli 22–24, corpo/controlli 16, note almeno 14;
target almeno 44×44 px, contrasto testo ≥ 4,5:1 e indicatori ≥ 3:1.
Testi ministeriali e risposte senza troncamento o altezze fisse.

Riepilogo, revisione e anteprima sono superfici con titolo accessibile e una
sola attiva per volta; la pagina sottostante non riceve focus. All'apertura
focus al titolo (`tabindex=-1`), alla chiusura al controllo di ingresso.
L'ingrandimento della figura restituisce il focus al suo pulsante. Filtri con
radio native o semantica equivalente; tag con nome esteso e stato premuto.
Aggiornamenti piccoli dei filtri annunciati con `aria-live="polite"` senza
far rileggere tutte le correzioni; avvisi urgenti con `role="alert"`.

Scorciatoie 1/2/3 e A/B/C del runner disattive su riepilogo, revisione,
anteprima, conferma consegna e moduli account. Non reagiscono con modificatori
o mentre si scrive in un campo. Tab/Shift+Tab, Invio/Spazio e scroll lavorano
sulla superficie attiva. Esc: figura → revisione → riepilogo, un livello per
volta; dal riepilogo esegue il ritorno esplicito, senza nuova consegna o
scritture. Nessun audio nuovo o lampeggio di esito. Zoom al 200 % e viewport
375/1280 devono mantenere titoli, correzioni, avvisi e uscite raggiungibili.

## 10. Dipendenze, verifiche ed evidenze

### 10.1 Contatto con chi tiene motore, test e specifica

**Dipendenza prima della realizzazione su `ui/main`: il confine dell'attività.**
**Chiusa da P-30 su `main` il 26 settembre 2026:** il caso qui sotto è un
test, e il contratto consegnato sta nel §7.1. Restano aperte le altre
dipendenze di questa sezione.
Riprodotto in P-14 sulla base `80e9120`: tre righe `_t:'q'`, tutte con
`sim_uid: 'attivita'`, `mode:'argomento'`, `kind:'base'`, quesiti distinti;
orari `10:00:00`, `10:01:00`, `10:22:01` del 26 settembre 2026, offset
`+02:00`; esiti falso/vero/falso. `E.sessioni()` restituisce due gruppi
con lo stesso id (1 risposta e 2 risposte, il più recente per primo).
`E.erroriSessione()` trova il primo e restituisce **1 quesito, l'ultimo**, a
fronte dei **2 errori** dell'attività ancora aperta. Succede anche passando
soltanto quelle tre righe: isolare il runner non risolve il taglio per pausa.

Non è una suite rossa: i cinque test esistenti di `erroriSessione()` passano
e non esercitano questa condizione. Il conteggio può restare coerente con
la lista sbagliata: R-FLU-03 da solo non protegge R-FLU-02 per l'intera
attività. In simulazione base, che dura più del limite di pausa, è possibile
anche senza uscire dal timer.

Claude su `main` deve prima fissare con un test che fallisce questo caso,
poi consegnare il contratto del §7.1: attività registrata completa anche
oltre pausa, sessione ricostruita dichiarata, isolamento tra attività,
nuova riprova con identità diversa, identificativi ambigui rilevati,
quesiti mancanti segnalati. L'opzione proposta evita di cambiare in silenzio
il raggruppamento predefinito usato da ritmo. Prima di modificarlo elencare
i chiamanti di `sessioni()` e `erroriSessione()` e l'effetto su ciascuno;
preservare il test del quesito ripetuto nel regime attuale. Nessun timestamp
normalizzato in pagina, duplicato dell'algoritmo o unione UI di gruppi.
Se l'API finale differisce dalla proposta, allineare questo §7.1 prima di
realizzare, non affidare il contratto soltanto al resoconto.

**Dipendenza dei controlli e della specifica:** aggiornare §4.4, §7.5,
R-FLU-01…04 e R-UX-06 per distinguere attività registrata e sessione
ricostruita, stop parziale, riepilogo senza voto di preparazione, revisione
e riprova esatta. R-FLU-01 deve dichiarare coperti i quiz e lasciare
esplicitamente scoperti i cicli non ancora realizzati. Conservazione anonima
R-ACC-04 si verifica insieme al client; non la si dichiara attiva prima.

I controlli nuovi devono **eseguire** il percorso riepilogo → anteprima →
avvio contro motore e dati reali, con storico estraneo e aggiornamento dei
dati fra i click; non basta trovare la stringa `E.erroriSessione`. Richiesti
conteggio/lista/ordine, nuovo `sim_uid`, nessuna correzione o scrittura durante
la lettura, tag per `auid`, consegna idempotente, mancate risposte distinte,
base/vela separate, focus/ritorno, guasti di lettura/scrittura e figure.
Servono controlli automatici dove possibile e collaudo browser per rendering
e interazioni, con ogni copertura dichiarata nella specifica.

Allineare anche il client §4.1 sulla simulazione consegnata con zero risposte:
la sua regola generale oggi dice ritorno all'origine con zero, mentre il
§4.1 qui conserva il riepilogo di una prova realmente consegnata e la riga
`_t:'s'` già prevista dal runner. L'eccezione riguarda solo la simulazione,
non crea risposte o un invito «salva questa attività». Questa dipendenza
va risolta nel documento del client prima di collegare i due lavori.

Come nell'area 2 §10.1, il passaggio deve lasciare `main` verde: controlli
del ciclo attuale riconosciuto e del ciclo progettato riconosciuto, con una
pagina di riferimento e rotture deliberate provate per il nuovo contratto.
Il ciclo nuovo si riconosce dalla funzione di raccordo che chiama realmente
`erroriSessione()` nel riepilogo e avvia la sua lista, non dall'esistenza di
un pulsante decorativo. Alla merge la regia chiude il regime precedente.
Chi tiene i test scrive il contratto estraibile/eseguibile nel repo prima
del codice UI, come `selezioneQuiz()` per l'area 2. Non abbassare controlli,
non mantenere percentuali fittizie per farli passare, non deselezionare test.

P-14 non tocca motore, test, specifica o registro eccezioni. La regia coordina
questa dipendenza e l'allineamento del ramo prima della realizzazione; la
coda non viene duplicata o modificata qui.

**Come lo legge il controllo — scritto da P-31, 26 settembre 2026.** La
dipendenza dei controlli è chiusa: `tests/test_interfaccia.py` riconosce il
regime del ciclo dal **raccordo**. Una pagina che dichiara al primo livello una
di queste tre funzioni è nel regime progettato, e deve dichiararle tutte:

```js
riepilogoQuiz(contesto, fonte)      // il riepilogo, e l'istantanea della riprova
anteprimaRiprova(riprova, fonte)    // la stessa istantanea, se i dati non sono cambiati
avviaRiprova(riprova, fonte, avvia) // Inizia: avvia l'istantanea, o niente
```

Devono dipendere solo dai loro argomenti, da `E` e da altre funzioni dichiarate
al primo livello (per esempio `uid()`): il controllo le estrae e le esegue
senza DOM e senza `S`. Senza nessuna delle tre, la pagina è nel regime attuale,
e lì non deve chiamare `E.erroriSessione` né scrivere «Riprova questi/questo»:
sarebbe una riprova senza il raccordo, un numero con una seconda fonte.

`fonte` è `{ righe, banca, letturaFallita }`: le righe che la pagina ha — in
questa versione `S.archivio`, che tiene anche le risposte la cui scrittura è
fallita; dalla versione del client, le righe in memoria della pagina —, la
banca caricata, e `true` quando l'archivio non si è potuto leggere.
`contesto` è `{ id, totale, erroriMax, corrente }`: l'id da `E.sessioni()` (il
`sim_uid`, o l'id ricostruito); T, la lunghezza della lista originale, oppure
`null` quando non si conosce (storico di allenamento); la soglia da
`meta.prove` per una simulazione, `null` per un allenamento; `true` per
l'attività appena conclusa in questa pagina.

`riepilogoQuiz()` restituisce
`{ stato, righe, risposte, corrette, errate, nonAffrontate, superata, confine, riprova }`:

- `stato` è `'pronto'`, `'indisponibile'` (l'attività dello storico non c'è
  più) o `'illeggibile'` (non c'è, e l'archivio non si è letto). Un'attività
  **corrente** senza righe è `'pronto'` con zero risposte: è la simulazione
  consegnata vuota del §4.1, non un'attività persa.
- `righe` sono le `_t:'q'` dell'attività da `E.sessioni(righe, { confine:
  'attivita' })`, trovata **per id**; le stesse della revisione (§5). I numeri
  vengono da `E.esito()` su quelle righe: `nonAffrontate` è T − risposte, o
  `null`; `superata` è `null` per un allenamento, e per una simulazione vale
  `true` solo con `esito.superata` **e** zero domande senza risposta (§7.1).
  `confine` è la `fonte` della sessione.
- `riprova` è l'istantanea: `{ id, stato, quanti, lista, mancanti, motivi,
  confine }` dal **solo** risultato di `E.erroriSessione(righe, banca, id)`.
  `stato` è `'pronta'`, `'nessun errore'`, `'ambigua'`, `'mancanti'`,
  `'incoerente'` (`quanti` diverso dalla lunghezza della lista), o lo stato del
  riepilogo quando non è pronto; `lista` è vuota salvo che per `'pronta'`.
  L'etichetta «Riprova questi N» è `riprova.quanti`, e solo con `'pronta'`.

`anteprimaRiprova(riprova, fonte)` richiama `E.erroriSessione()` sui dati di
adesso e restituisce `{ stato, quanti, lista, confine }`: `'pronta'` con
**l'istantanea** — non la lista ricalcolata — quando gli errori sono gli
stessi, negli stessi id e nello stesso ordine; `'cambiate'` quando l'attività
c'è ma gli errori no; `'indisponibile'` o `'illeggibile'` quando non c'è più. Un
tag N/L/C, un'altra attività o la banca ricaricata non cambiano niente.

`avviaRiprova(riprova, fonte, avvia)` fa la stessa verifica e, solo se
l'anteprima è `'pronta'`, chiama **una volta**
`avvia(riprova.lista, 'sbagliate', { simUid, riprovaDi, auto: false })` con un
`simUid` nuovo, e restituisce `{ avviata: true, simUid }`; altrimenti
`{ avviata: false, stato }` senza avviare niente. La pagina passa come `avvia`
il suo `apri()`, eventualmente dentro una freccia che aggiunge origine e
`quiz`; e `apri()` usa `opt.simUid` come `sim_uid` delle risposte e
`opt.auto` per l'avanzamento automatico. Nessuna delle tre funzioni scrive
nella fonte, e nessuna chiama un'altra selezione del motore. Fuori da loro
la pagina non chiama `E.erroriSessione`.

Il controllo esegue il giro con la banca vera e uno storico che non è solo
quello dell'attività: il caso del §10.1 con un'altra scheda intrecciata, sei
errori di un'altra attività fra cui lo stesso quesito, un errore corretto in
un tentativo dopo, simulazione base e vela consecutive con le loro `_t:'s'`,
un confine ricostruito, un id ambiguo, un quesito che la banca non ha. Fra un
passo e l'altro i dati cambiano — un tag, un'altra attività, la banca
ricaricata, una riclassificazione; poi una risposta dell'attività arrivata da
un import, un azzeramento, una lettura che fallisce — e il controllo pretende
che il numero e la lista si aggiornino insieme solo a una riapertura. La fonte
è congelata: una funzione che la scrive lancia. Poi il nuovo tentativo scrive
le sue righe con l'identità ricevuta, e il suo riepilogo riguarda solo lui,
mentre quello di prima resta com'era.

La pagina di riferimento `tests/pagina-ciclo-quiz.html` mostra la forma minima
che passa, compreso il collegamento con `apri()`; non è un disegno. Il
controllo la esegue a ogni run insieme a ventisette rotture che devono fallire
nominando il difetto (R-FLU-11). **Che cosa non vede**, e resta al collaudo
del §10.2: i testi, la gerarchia delle uscite, il focus e i ritorni, Esc, la
conferma di consegna e la consegna idempotente, i tag nella revisione, gli
avvisi, le figure, Base e vela come flusso. Se il contratto sta stretto alla
realizzazione, si dice alla regia: cambiarlo tocca `tests/`, che da `ui/*` non
si scrive.

### 10.2 Criteri di accettazione della realizzazione

| Caso | Esito richiesto |
|---|---|
| Prima attività 10, 3 risposte, 1 errore | R = 3, C = 2, E = 1, M = 7; riepilogo parziale, nessuna diagnosi, revisione di tre e riprova di uno. |
| Allenamento completato, nessun errore | Fatti e ritorno; revisione completa; nessuna riprova inerte o promessa di preparazione completa. |
| Stop senza risposte / Esc | Allenamento torna all'origine con messaggio, senza righe né invito a salvare; simulazione chiede consegna e distingue zero/mancanti. |
| Due errori qui e cinque in altra attività | Pulsante N = 2 apre esattamente e nello stesso ordine i due di qui, indipendentemente dallo specchio attuale e dai filtri Quiz. |
| Errore qui, corretto in tentativo successivo | Revisione e riprova del primo conservano quell'errore; il secondo non modifica il primo. |
| Tre risposte con pausa di 21:01 | Revisione di tre, riprova dei due errori, senza taglio dell'attività registrata. |
| Sessione ricostruita / id ambiguo | Confine dichiarato; nessuna unione UI. Ambiguità blocca la riprova con messaggio. |
| Quesito o scelta assenti dopo import | Blocco conservato con motivo, nessuna scelta «senza risposta» inventata; elenco incompleto non avvia meno di quanto promesso. |
| Revisione di corrette/errate, filtro e tag | Nessuna nuova risposta/prova; tag append-only sul giusto tentativo, ultimo selezionato, ritorno e focus corretti. |
| Doppio click, timer e consegna simultanei | Una conclusione e una riga prova; un solo nuovo runner alla riprova. |
| Riprova e altra riprova | Nuove identità, `mode:'sbagliate'`, timer assente, auto locale spento; il nuovo riepilogo riguarda solo il nuovo tentativo. |
| Fonte cambia dopo anteprima | Avvio bloccato, numero/lista aggiornati insieme soltanto dopo riapertura; tag N/L/C da solo non cambia la lista. |
| Simulazione incompleta / tempo scaduto | Esito non superato con mancanti distinti; errore risposto soltanto nella riprova; nessuna correzione prima di consegna. |
| Base e vela | Due contesti e timer separati; revisione base non avvia vela, riprova anticipata dichiara che la vela non è iniziata; nessun esito aggregato. |
| Prodotto precedente al client | Testi browser veritieri, nessun account inesistente; ciclo intero senza cambiare la persistenza. |
| Prova senza account con client | Tutto il ciclo in memoria, nessuna scrittura personale in storage/API; ricarica perde il contesto; avviso prima/dopo, nessuna porta Progressi. |
| Registrazione dalla fine, modulo chiuso o invio fallito | Riepilogo preservato; uid senza doppioni; conferma di salvataggio solo dal client, invito non ripetuto durante revisione. |
| Scrittura fallita / storico illeggibile | Avvisi mantenuti; dettaglio corrente rivedibile in memoria; storico fallito non si spaccia per vuoto. |
| Figure caricate, assenti e offline | Alt preso dal quesito, ingrandimento/focus, motivo visibile; nessun salto o cancellazione di quesiti. |
| Porte storiche da Percorso/Progressi | Revisione stessa fonte, ritorno corretto; anonimo solo dati di pagina; Carteggio e altri chiamanti condivisi preservati. |
| 375/1280 px, tastiera e zoom 200 % | Screenshot guardati, computed style per misure, lettura/scroll/uscite/avvisi accessibili; nessuna scorciatoia risposta negli overlay. |

Per la prova con persone: cinque persone, su riepilogo con due errori, devono
aprire la revisione, identificare risposta propria e ufficiale, avviare la
riprova di quei due e poi concludere. Nel regime anonimo devono spiegare
che cosa si perde chiudendo la pagina. Annotare riuscita, errori e aiuti per
ogni compito; organizzazione dell'autore, Q-PROVE. Una suite verde non prova
usabilità né rende già verificati questi criteri.

### 10.3 Evidenze di P-14 e limiti

Base letta: `ui/main`, **80e9120**, working tree pulito e stesso HEAD di
`main`; hook `.githooks`, worktree UI distinto. Il ramo non ha upstream:
`git pull --ff-only` non applicabile, nessuna configurazione o merge modificata.
Il difetto di pausa del §10.1 è riprodotto sotto Node con motore reale e tre
righe sintetiche in memoria; non sono stati scritti dati personali o di sito.
La verifica del progetto controlla riferimenti, contratti, stati e diff.
Le suite correnti verificano il prodotto esistente, non la realizzazione
progettata. Nessun collaudo visivo o prova con persone viene dichiarato da
questa sessione documentale.

Cinque suite complete, senza deselezioni: motore **141/143, 2 skip previsti**
(le due vecchie copie UI sono state rimosse), dati **242**, interfaccia **295**,
specifica **370**. Server **58/58** su Node **25.3.0** e sulla LTS **24.21.0**,
pacchetto separato verificato contro `SHASUMS256.txt` scaricato da nodejs.org.
I bind locali delle suite dati/server hanno richiesto esecuzione fuori
sandbox; nessun test è stato escluso per aggirare quel limite.
I **12 riferimenti locali** del progetto sono risolti; guardiano e controllo
condiviso della documentazione verdi. Diff limitato a questo file e alla voce
additiva in fondo a `[Unreleased]`; nessuna modifica a versione, `site/`,
eccezioni o `prossime-sessioni.md`.

### 10.4 Realizzazione di P-19 e limiti

Realizzato in `site/app.html` su `ui/main`, scritto da Claude con ChatGPT
fermo. La pagina è nel regime progettato del controllo: dichiara le tre
funzioni di raccordo, `apri()` legge `opt.simUid` e `opt.auto`, e
`E.erroriSessione` compare solo dentro il raccordo. Il banco del ciclo gira
quindi anche sulla pagina vera, oltre che su quella di riferimento.

**Il difetto di P-30, guardato.** Prima: un'attività con una pausa di 21:01
compariva in Progressi in due righe con lo stesso id, e la seconda apriva la
revisione della prima metà; il Percorso diceva «Risposte: 1». Dopo, con le tre
chiamate a `sessioni()` sul confine dell'attività: una riga, tre risposte.

**Scelte prese realizzando, dove il progetto lasciava spazio.**

- La riprova si apre dal riepilogo e dalla revisione **storica**; la revisione
  dell'attività appena conclusa rimanda al riepilogo, che ha già il pulsante.
- La croce del runner è diventata «Termina l'attività» per ogni allenamento,
  non solo per la prima attività: con la croce un allenamento finiva senza
  riepilogo.
- Nella revisione di una prova non si mostra una durata: `ms` delle righe
  `_t:'s'` è il tempo concesso (0.19.2), e il §5 vieta durate inferite. La
  riga non è stata cambiata.
- L'ingrandimento della figura è un `<dialog>` nativo, che Esc chiude da sé
  senza chiudere la revisione o il runner sotto.
- Lo sfondo del runner e della revisione è `inert`: prima il Tab arrivava alla
  pagina sotto.

**Non fatto, e resta al collaudo o ad altre aree.** Zoom del testo al 200 %,
lettore di schermo sui percorsi del ciclo, prova con persone (Q-PROVE). Il
regime senza account e l'invito alla registrazione del §3 sono del client
(P-18): oggi il testo di conservazione è quello del prodotto attuale. Il
controllo del regime vecchio del ciclo è ora senza oggetto, e lo chiude P-37.
