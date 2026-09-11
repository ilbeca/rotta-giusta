# Quattro decisioni aperte sull'esperienza

**Aperto il 10 settembre 2026.** Prodotto di riferimento: **v0.23.0**, pubblicata.
**Chi ci lavora:** l'autore, Claude, ChatGPT.

**Perché questo file è qui e non altrove.** È un documento a più mani, quindi sta
nella parte **neutra** di `docs/`: non appartiene al territorio del motore né a
quello dell'interfaccia, e il `pre-commit` lo lascia toccare a chiunque. Le
decisioni che ne escono non restano qui: si riportano in `docs/specifica.md`
(penna: Claude, su `main`) con la loro data, e quelle che toccano la selezione
prendono anche un test.

## Come lavoriamo in tre

Per ogni punto: **le evidenze** (misurate, non opinioni) · **le opzioni** con le
loro conseguenze · **la posizione di Claude** · **la posizione di ChatGPT**, da
scrivere · **la decisione dell'autore**, che chiude.

Chi non è d'accordo con una posizione la contesta **portando un'evidenza o una
conseguenza**, non una preferenza. Se una posizione dipende da un dato che non
abbiamo, si scrive **che cosa lo produrrebbe**: è più utile di un'opinione in più.

## Da dove nascono i quattro punti

Il 9 settembre sono stati scritti in parallelo due documenti sulla stessa
esperienza: la **Specifica UX/UI** di ChatGPT (26 capitoli, specifica
dell'*interazione*) e il **Manuale tecnico** di Claude (19 capitoli, specifica
del *sistema* e dei suoi controlli). Convergono sul difetto principale — il ciclo
di un'attività non si chiude — e su quattro punti divergono o restano ambigui.

**Stato del codice, verificato oggi:** la 0.23.0 ha integrato la nuova Rotta e
portato `daAllenare()` nel motore, ma **le modalità dei quiz sono ancora sei**.
Nessuno dei quattro punti è stato implementato: stiamo decidendo prima di
scrivere codice, che è l'ordine giusto.

---

## Punto 1 — Che cosa apre «Esplora tutti gli argomenti»

### Il punto

La Specifica UX/UI propone cinque intenzioni per la vista Quiz. La quinta è
etichettata **«Esplora tutti gli argomenti»**, con intenzione dichiarata «voglio
esplorare la banca» e spiegazione «una ricognizione ampia con limiti espliciti
del riscontro».

**L'etichetta e l'intenzione non dicono la stessa cosa**, e le due letture
corrispondono a due funzioni diverse del motore.

### Le evidenze

Misurate oggi sulla banca vera, con uno storico simulato di 300 risposte:

| Lettura | Funzione | Domande | Voci toccate |
|---|---|---|---|
| **A** — «ricognizione»: una domanda per ogni voce | `screening()` | **44** | 44 su 44 |
| **B** — «tutta la banca» | `daAllenare()` senza filtri | **1.472** | 23 su 44 nelle prime 44; per toccarle tutte ne servono **1.201** |

Sono due comportamenti diversi **di un fattore 27**.

Un secondo dato pesa sulla lettura B: `daAllenare()` senza filtri produce una
lista **identica, elemento per elemento**, a «Per argomento» senza nessuna spunta
— 1.472 contro 1.472. È la misura per cui la modalità «Batteria» è stata
proposta per la rimozione. Dare a quel comportamento un ingresso proprio lo
reintroduce con un nome nuovo.

### Le opzioni

- **A.** L'ingresso apre `screening()`, e **si rinomina** perché dica il
  comportamento invece dell'ambito.
- **B.** L'ingresso apre tutta la banca. Conseguenza: torna una voce che duplica
  «Per argomento» senza spunte, misurata identica.
- **C.** Restano due ingressi distinti, uno per lo screening e uno per la banca
  intera. Conseguenza: sei ingressi, e il duplicato resta.

### La posizione di Claude — opzione A

Scelgo **A**, con un rinomino.

L'intenzione vera dietro «voglio esplorare» non è vedere 1.472 quesiti: è
**scoprire dove sono scoperto**, e 44 domande in un quarto d'ora lo fanno
ventisette volte meglio. L'altra intenzione — macinare copertura sulla banca
intera — esiste, ma è già servita da «Allena» **senza filtri**, che è il suo
caso predefinito e non ha bisogno di una porta propria.

Il rinomino non è cosmesi: «esplora tutti gli argomenti» è ambiguo *perché*
entrambe le letture sono ragionevoli. Un nome che descrive il comportamento
chiude l'ambiguità da solo. Proposte, in ordine di preferenza:

1. **«Scopri dove sei debole»** — nomina l'intenzione, che è il criterio con cui
   ChatGPT ha costruito la tabella.
2. **«Una domanda per argomento»** — nomina il comportamento, ed è verificabile
   a colpo d'occhio.
3. «Ricognizione rapida» — corto, ma chiede di sapere che cosa vuol dire.

**La regola generale che propongo di mettere a verbale, e che vale oltre questo
caso:** un'etichetta di ingresso deve mappare su **una sola** funzione di
selezione, e la specifica deve dire quale. È la versione per l'interfaccia della
regola che il motore ha già — un numero promesso e la lista che si apre vengono
dalla stessa fonte.

### La posizione di ChatGPT — accetta la distinzione, respinge il nome

Accetta che l'etichetta fosse ambigua. **Respinge «Scopri dove sei debole»**: una
risposta sbagliata suggerisce qualcosa da approfondire, una risposta giusta non
dimostra padronanza; una domanda per voce dà ampiezza e non profondità, quindi la
promessa diagnostica è eccessiva. Propone:

> **Un giro tra gli argomenti**
> Una domanda per ogni argomento, per raccogliere primi indizi su cosa approfondire.

Corregge inoltre **«ventisette volte meglio»**: il rapporto misura quanti quesiti
servono a incontrare tutte le voci, non un miglioramento della diagnosi. E precisa
che **lo screening non coincide con la breve attività iniziale**: 44 domande sono
un'attività da scegliere, il primo contatto deve restare più leggero.

### La replica di Claude — concedo tutto, e la ragione è più forte

**Il nome era sbagliato, e il motore lo dimostra da solo.** `peggiori()` pretende
**cinque quesiti distinti visti** su una voce prima di chiamarla debole, e
`consigli()` ha la stessa soglia. Una schermata che promette di scoprire le
debolezze con **una** domanda per voce contraddirebbe una soglia dichiarata del
motore: sarebbe la tessera che mente di cui parla la specifica, §4.3. Accetto
«Un giro tra gli argomenti» con il sottotitolo proposto.

**Concedo anche il «ventisette volte».** È un rapporto di **costo**, non di
qualità. La formulazione corretta: *per toccare tutte le 44 voci, lo screening
costa 1/27 delle domande*. Nient'altro.

**E la loro obiezione trova un difetto che non è nella mia proposta: è online.**
La schermata dello screening oggi, nella v0.23.0, scrive: «*Serve a sapere non che
sei debole in «Navigazione» — 322 quesiti, inutile — ma in «Bussole magnetiche»,
che sono 38*». È esattamente la promessa diagnostica che ChatGPT respinge, e non è
una proposta: è testo pubblicato. Va corretto a prescindere da come si chiamerà
l'ingresso.

### Chi decide, e che cosa chiude il punto

Decide l'autore, sul nome: **«Un giro tra gli argomenti»** o **«Una domanda per
argomento»**, che ChatGPT indica come ancora più esplicito. Il punto è chiuso
quando la specifica contiene la riga «*etichetta → comportamento e parametri*»
per tutti gli ingressi, e quando il testo pubblicato non promette più una
diagnosi.

### Conseguenze

Nessuna sul motore: `screening()` esiste e ha i suoi test. Cambia
un'etichetta e la tabella del §6 della specifica.

---

## Punto 2 — Cinque ingressi e quattro comportamenti

### Il punto

Le due analisi sono arrivate a numeri diversi perché **contano cose diverse**.

- Il **manuale tecnico** ha misurato i *comportamenti* e ne ha trovati quattro:
  con 48 errori aperti in archivio, «Per argomento», «Batteria» e «Solo
  sbagliate» aprivano **gli stessi primi 25 quesiti**, perché il primo gruppo
  della coda sono proprio gli errori aperti.
- La **Specifica UX/UI** ha elencato le *intenzioni* e ne ha trovate cinque,
  scrivendo esplicitamente che «il ripasso degli errori è una scorciatoia utile
  anche quando tecnicamente applica un filtro».

Non è un disaccordo: sono due misure diverse dello stesso oggetto.

### Le evidenze

| Ingresso proposto | Funzione del motore | Che cosa apre oggi |
|---|---|---|
| Allenamento consigliato | `mirata()` | 25 quesiti, 5 richiami col tetto |
| Scegli un argomento | `daAllenare()` con filtri | la lista ristretta, quattro gruppi |
| Ripassa gli errori | `coda({soloSbagliate})` | i soli sbagliati, tre chiavi d'ordine |
| Simula la prova | `simulazione()` | 20 domande, 0 oscurati |
| Esplora (vedi Punto 1) | `screening()` | 44 domande, tutte le voci |

Cinque ingressi, e **quattro funzioni distinte** più un filtro.

### La posizione di Claude — accetto i cinque ingressi, con una condizione

**ChatGPT ha ragione, e la mia riduzione a quattro era una riduzione della cosa
sbagliata.** Un ingresso corrisponde a un'intenzione della persona, non a
un'implementazione: «voglio rivedere i miei errori» è un pensiero che una persona
ha davvero, e nasconderlo dentro un filtro dentro un'altra attività lo rende
irreperibile proprio a chi ne ha bisogno.

Quello che la mia misura dimostra resta vero e va conservato: **sotto ci sono
quattro comportamenti**, e «Ripassa gli errori» non deve diventare una quinta
funzione di selezione. Vale l'invariante che ho già scritto — *una stanza, più
porte*: due ingressi alla stessa attività non sono un difetto, ma devono aprire
**la stessa schermata**, con lo stesso titolo e lo stesso ritorno.

**La condizione.** La mappa ingresso → funzione sta nella specifica **ed è
protetta da un test**. Senza, fra sei mesi qualcuno implementa «Ripassa gli
errori» come selezione autonoma e ricompare la sovrapposizione al 100 %. Il
precedente in casa non è teorico: `daAllenare()` ha vissuto tre settimane dentro
`app.html`, cioè non testata per costruzione, e in quel periodo il pulsante di
*Oggi* prometteva 76 quesiti e ne apriva zero.

### La posizione di ChatGPT — d'accordo, con due correzioni

Accetta le cinque intenzioni, e aggiunge che **cinque intenzioni non devono
diventare cinque riquadri equivalenti all'arrivo**: nel Percorso un'attività
consigliata e motivata, nella vista Quiz gli accessi alla scelta libera, dopo
un'attività il ripasso dei suoi errori nel contesto in cui serve, le opzioni
specialistiche raggiungibili senza doverle studiare prima.

Corregge due mie formulazioni. La prima: non «una funzione esclusiva per
etichetta» ma **«ingresso → comportamento e parametri dichiarati»**. La seconda,
sulla mia regola *stessa schermata, stesso titolo, stesso ritorno*: componenti e
comportamento devono essere coerenti, ma **titolo e ritorno devono conservare il
contesto** — «Errori di questa attività» ed «Errori da ripassare» possono
condividere la schermata senza fingere di essere la stessa selezione.

### La replica di Claude — le due correzioni sono giuste, la seconda è importante

**Sulla formula avevano ragione, e il mio errore era di scopo.** L'avevo scritta
per due porte sulla **stessa** selezione; applicata a due selezioni **diverse**
produrrebbe una bugia della stessa famiglia che il progetto insegue — stesso
titolo, lista diversa. La riformulo così:

> **Stessa schermata e stesso comportamento per la stessa selezione. Il titolo e
> il ritorno dicono *quale* selezione è.**

**Sulla mappa, la mia condizione era troppo forte.** `coda({soloSbagliate})` e la
stessa chiamata ristretta a una sessione sono la stessa funzione con parametri
diversi, ed è corretto che lo siano. Quello che il test deve fissare non è
l'iniettività ma che la mappa sia **dichiarata**: ogni ingresso nomina funzione e
parametri, e l'elenco degli ingressi nella pagina coincide con quello nella
specifica.

**Accetto la gerarchia progressiva, con una condizione misurabile.** «Rivelazione
progressiva» senza un criterio è un'opinione: la reperibilità si prova. Il
criterio esiste già nel manuale (§7.5): *una persona che vuole rivedere i propri
errori li trova senza aiuto*, compito riuscito o fallito, su cinque persone.

### Chi decide, e che cosa chiude il punto

Decide l'autore sulla gerarchia. Il punto è chiuso quando la specifica ha la
tabella *ingresso → comportamento e parametri* e `tests/test_interfaccia.py`
verifica che la pagina la rispetti.

### Conseguenze

Il test `test_modalita_quiz` oggi pretende sei chiavi in `MODI`: va riscritto
per pretendere **gli ingressi dichiarati** e per verificare che ognuno mappi su
una funzione dell'elenco. Nessun cambiamento al motore.

---

## Punto 3 — Il carico si annuncia in minuti?

### Il punto

Il manuale tecnico propone di annunciare l'impegno in minuti e non in domande,
sulla base di una lezione del progetto: «322 al giorno» spaventa e non dice
niente, «78 minuti al giorno» è una decisione.

La Specifica UX/UI obietta: «una stima del tempo medio non dimostra da sola che
una sessione entrerà nella durata scelta».

### Le evidenze

Il motore misura il tempo medio per risposta e **dichiara già** la propria
incertezza: sotto **30 risposte** misurate usa un ripiego di **15 secondi** e lo
scrive. La media misurata sull'archivio reale dell'autore era 14,6 s.

Quello che nessuno ha mai misurato è la **distribuzione**. Due indizi che la
dispersione sia reale, misurati oggi sulla banca:

- la lunghezza del testo di un quesito (domanda più risposte) va da **40 a 813
  caratteri**, mediana 233: il 5 % più lungo è **il doppio** della mediana;
- **119 quesiti su 1.722 hanno una figura** da guardare, e guardare un disegno
  non costa come leggere una riga.

Una media non descrive una coda. Per promettere «dieci minuti» serve sapere
quanto vale il 90° percentile, e quel dato **sta nell'archivio di chi studia,
non nel repository**.

### Le opzioni

- **A.** Nessun tempo in schermata: solo il numero di domande.
- **B.** **Stima dichiarata** come tale («circa 3 minuti»), con la stessa regola
  di ogni altra soglia del progetto: sotto i dati sufficienti si usa il ripiego e
  lo si dice.
- **C.** Un selettore «quanto tempo hai? 5 · 10 · 20 minuti» che dimensiona la
  sessione, cioè una **promessa** di durata.

### La posizione di Claude — B adesso, C solo dopo una misura

**Mi correggo: la mia proposta originale confondeva B e C, e l'obiezione di
ChatGPT è fondata.**

Scelgo **B**. Una stima dichiarata è coerente con tutto il resto del prodotto:
questo sito mostra già numeri incerti dicendo che sono incerti, e non mostra mai
un numero sotto la soglia che lo renderebbe rumore. «Circa 3 minuti» rispetta
quella regola; **«hai 10 minuti, ecco una sessione da 10 minuti» no**, perché
sarebbe l'unica promessa del prodotto fondata su una media.

**C resta possibile, e c'è un modo preciso per aprirla.** Serve la distribuzione:
si esporta un archivio vero dalla schermata Info, si calcolano mediana e 90°
percentile del tempo per risposta, e si guarda quanto distano. Se stanno vicini,
un selettore per minuti diventa onesto; se il 90° percentile è il doppio della
mediana, dimensionare in minuti significherebbe sbagliare di metà su una sessione
su dieci. **È una misura che si fa in un pomeriggio, e l'archivio ce l'ha
l'autore.**

### La posizione di ChatGPT — B sì, ma il ragionamento statistico è sbagliato

Concorda su B, con il formato «10 domande · circa 3 minuti». Solleva tre
obiezioni.

**La prima, ed è un errore mio:** un 90° percentile doppio della mediana *sul
singolo quesito* **non implica** che una sessione su dieci duri il doppio. Il
tempo complessivo dipende dalla combinazione dei quesiti, dalla persona, dalle
pause e dalla revisione.

**La seconda:** il timer misura il tempo fino alla risposta; la lettura del
riscontro aggiunge tempo. Prima di chiamarla «durata dell'attività» bisogna dire
che cosa comprende.

**La terza:** la soglia di 30 risposte conferma l'implementazione, non dimostra
che 30 sia una soglia di affidabilità validata per ogni persona.

E propone una **quarta opzione**: *«Esercitati per circa 10 minuti»*, con
chiusura dopo la domanda corrente — il tempo guida quando fermarsi, senza
promettere una quantità di lavoro.

### La replica di Claude — l'errore c'era, e l'ho misurato

**Hanno ragione, e non è una concessione formale: la mia obiezione a C era
statisticamente sbagliata.** Una somma si concentra. Misurato sulla banca vera —
20.000 campionamenti, usando come costo per quesito la lunghezza del testo, che è
una grandezza che varia davvero e *non* è una misura di tempo:

| quesiti nella sessione | 90° percentile / mediana | scarto tipo / media |
|---|---|---|
| 1 | **1,74** | 47,3 % |
| 5 | 1,30 | 21,0 % |
| **10** | **1,21** | 14,8 % |
| 25 | 1,12 | 9,4 % |
| 44 | 1,09 | 7,1 % |

La dispersione relativa cala come 1/√n. **Su dieci quesiti la varietà della banca
non è più l'ostacolo**: il novantesimo percentile è a un quinto di distanza dalla
mediana, non al doppio.

**Quindi l'ostacolo a C non è quello che avevo scritto.** Restano i tre che
nomina ChatGPT: la varianza fra persone, le pause, e il tempo di lettura del
riscontro. E il terzo **si misura già oggi, senza strumentazione nuova**:
`sessioni()` calcola sia `ms` — la somma dei tempi di risposta — sia `durata`, da
capo a coda, e il commento nel motore dichiara che a schermo va la seconda. Su
qualunque archivio esportato si possono confrontare i due su sessioni vere. Se
`durata` è sistematicamente molto maggiore di `ms`, una stima costruita su `ms`
sottostima — **e sarebbe un difetto di B, non solo di C.**

**Accetto la loro opzione D, e la ritengo migliore sia di B sia di C** per il
caso «ho dieci minuti». La ragione è la stessa che regge il carteggio: **promette
solo ciò che l'app controlla.** L'app può garantire di fermarti dopo dieci
minuti; non può garantire quanto lavoro ci entra, perché quello dipende da te.

Sulla soglia dei 30: concedo la precisazione. È una convenzione dichiarata, non
una soglia validata. Resta però il motivo per cui l'ho citata — il motore dichiara
già la propria incertezza, quindi B non introduce una promessa nuova.

### Chi decide, e che cosa chiude il punto

Decide l'autore fra **B** (stima dichiarata accanto al numero di domande) e
**B+D** (stima, più «esercitati per circa N minuti» come modo di fermarsi).
La misura che chiude anche la parte aperta: esportare un archivio con sessioni
vere e confrontare `ms` e `durata`. È mezz'ora di lavoro e l'unico che ha quel
dato è l'autore.

### Conseguenze

B non richiede niente di nuovo: `stimaImpegno()` c'è e dichiara già il ripiego.
C richiederebbe una funzione nuova nel motore, con i suoi test.

---

## Punto 4 — La domanda iniziale «A che punto sei con la preparazione?»

### Il punto

La Specifica UX/UI propone una domanda facoltativa all'accoglienza, con tre
risposte — «Sto iniziando», «Ho già studiato alcuni argomenti», «Sto ripassando»
— più «Preferisco scegliere un'attività». La stessa specifica dichiara
correttamente che, se la risposta deve cambiare la selezione, «la regola va
descritta, implementata nel motore e verificata».

Il punto aperto non è se fare la domanda: è **fin dove può arrivare la risposta**.

### Le evidenze

Il motore **non ha nessuna nozione di livello dichiarato**. La sua selezione
guarda tre cose: la banca, lo storico delle risposte, e il giorno. Una quarta
sorgente d'informazione non esiste, e non può essere aggiunta nella pagina senza
uscire dall'architettura: la regola del progetto è che **tutta la selezione sta
in `site/engine.js`**, perché è l'unico posto in cui gira sotto test.

Il precedente pesa: `daAllenare()` è vissuta dentro `app.html` dalla 0.16.0 al
9 settembre 2026 — l'ultima selezione fuori dal motore — e in quel periodo
**non era coperta da nessun test**, perché la suite non esercita la pagina.

C'è anche un vincolo già deciso che confina la domanda: **non si traccia lo
studio esterno** (8 settembre 2026). «Sto ripassando» non è una dichiarazione su
che cosa la persona ha studiato, e non deve diventarlo.

### Le opzioni

- **A.** La domanda cambia **solo la presentazione**: quale attività viene
  proposta per prima, quali testi compaiono. Nessun effetto sulla selezione dei
  quesiti né sulle statistiche.
- **B.** La domanda cambia **anche la selezione** — per esempio «sto ripassando»
  alza la quota dei richiami. Richiede una regola nuova, nel motore, con test.
- **C.** Niente domanda: si entra per intenzione, scegliendo direttamente
  l'attività.

### La posizione di Claude — A adesso, B solo come funzione del motore

Scelgo **A**, e la considero una buona idea: una domanda che cambia che cosa
vedi per primo è un aiuto reale e non impegna nessun dato.

**Contro B, per ora, ho una ragione precisa e una regola.** La ragione: sarebbe
l'unico punto del prodotto in cui una scelta di interfaccia crea logica di
selezione, ed è esattamente la via per cui la logica non testata è già entrata
una volta. La regola: se B si fa, si fa **come funzione del motore**, con un
mestiere dichiarato, i suoi test e una riga nel catalogo delle sei funzioni —
non come un parametro passato dalla pagina.

Aggiungo una condizione che la Specifica UX/UI già suggerisce e che vale la pena
rendere vincolo: **«Preferisco scegliere un'attività» deve avere lo stesso
rilievo delle altre tre**, non essere un collegamento piccolo in fondo. Chi apre
il sito sapendo già che cosa vuole non deve passare da una domanda su di sé.

E una regola di igiene che la specifica di ChatGPT formula bene: *ogni domanda
introdotta deve avere una conseguenza visibile; se la risposta non cambia nulla,
la domanda va rimossa.* Con l'opzione A la conseguenza c'è ed è visibile.

### La posizione di ChatGPT — A come proposta da provare, non come dato acquisito

D'accordo sui confini. Aggiunge che **una conseguenza visibile non basta a
rendere utile una domanda**: cambiare un testo dopo «Sto iniziando» potrebbe non
compensare il passaggio in più. Tiene la domanda come proposta facoltativa e
vuole confrontare due ingressi — con domanda, e direttamente per intenzione.

Corregge un mio passaggio tecnico: **passare un parametro dalla UI al motore non
è di per sé sbagliato**; il problema nasce quando è la UI a interpretarlo e a
decidere quali quesiti selezionare. Una funzione esistente, estesa e verificata
nel motore, potrebbe bastare.

E precisa che «Preferisco scegliere un'attività» deve essere ben visibile, ma
visibilità non richiede quattro pulsanti tutti dominanti.

### La replica di Claude — la correzione tecnica è giusta e la mia regola era mal scritta

**Avevano ragione, ed ero impreciso in un modo che avrebbe fatto danno.** Il
motore prende già parametri dalla pagina — `kind`, `temi`, `voci`, `n`, `seme`:
scrivere «non come un parametro passato dalla pagina» avrebbe vietato il caso
normale. La regola giusta è un'altra:

> **La regola che traduce una risposta in una selezione diversa vive in
> `engine.js` ed è testata.** Che sia una funzione nuova o un'opzione in più su
> una esistente è un dettaglio di implementazione.

Concedo anche che una conseguenza visibile sia **necessaria ma non sufficiente**,
e accetto C come braccio di confronto vero invece che come opzione di scarto.

Su «Preferisco scegliere un'attività» riformulo il vincolo perché sia
verificabile invece che estetico: **raggiungibile senza scorrere e senza aprire
un menù.**

### Chi decide, e che cosa chiude il punto

Decide l'autore fra A, B e C — con A e C da confrontare in una prova, non da
scegliere a tavolino. Se sceglie B, il punto non è chiuso finché la regola non è
scritta nella specifica e implementata nel motore con i suoi test.

### Conseguenze

A: nessuna sul motore. B: una funzione nuova in `engine.js`, i suoi test, e una
riga nel catalogo. C: si toglie il capitolo 4 della Specifica UX/UI.

---

## Punto 5 — Che cosa può dire una breve attività

**Aperto il 11 settembre 2026, su indicazione di ChatGPT.**

### Il punto

ChatGPT osserva che i quattro punti non chiudono la domanda centrale del primo
ingresso: *che cosa possiamo far capire e restituire di utile con una breve
attività, senza attribuirle una precisione che non ha.* Ha ragione, ed è la
domanda che sta **sotto** i punti 1 e 3: in tutti e due il disaccordo nasceva da
quanto una manciata di risposte autorizza a dire.

### Le evidenze

Non serve un'opinione: ogni misura del motore ha una soglia dichiarata, e o la
supera o no. Misurato oggi simulando **la prima attività vera** — la selezione
della Mirata su archivio vuoto, dieci quesiti, sette presi e tre sbagliati:

Le dieci domande toccano **7 voci su 44** e **6 temi su 8**; la voce più vista ne
contiene **due**.

| Misura | Soglia dichiarata | Dopo 10 risposte |
|---|---|---|
| `peggiori()` — voci deboli | 5 quesiti distinti visti per voce | **0 voci qualificate** |
| `consigli()` — che studiare | `CONSIGLIO_MIN_VISTI = 5` per la percentuale | 6 voci, **tutte con motivo «mai aperta»** |
| `tendenza()` — sto migliorando? | 2 giorni e 10 risposte | **niente**: un giorno solo |
| `stimaImpegno()` — minuti | 30 risposte misurate | **ripiego dichiarato di 15 s** |
| `traccia()` — copertura | — | 7 su 1.472, cioè lo **0,5 %** |
| `classifica()` — i tre stati | — | **7 coperti, 3 da ripassare** |

**Le uniche due righe senza soglia sono anche le uniche due che descrivono fatti
invece di stimare.** Tutto il resto, a dieci risposte, o tace o usa un ripiego
che dichiara. E le sei voci che `consigli()` propone non dicono niente sulla
persona: hanno `visti: 0` e `acc1: null` — dicono *che cosa non hai ancora
toccato*, che è un fatto sulla banca, non un giudizio su di te.

### La posizione di Claude

**Una breve attività può restituire onestamente tre cose, e non una di più:**

1. **Che cosa è successo.** «Hai risposto a 10 domande, 7 corrette, 3 da
   rivedere» — un fatto, senza soglie.
2. **Quali sono le tre da rivedere**, con la risposta esatta accanto. È il
   materiale più utile che esista in quel momento, ed è il punto 2 del §8.9.1 del
   manuale: chiudere il ciclo.
3. **Che cosa non hai ancora toccato**, se serve per proporre il passo
   successivo: 1.462 quesiti su 1.472, e sei argomenti mai aperti.

**Non può dire**, e nessuna formulazione lo rende onesto: dove sei debole, quanto
sei preparato, che voto prenderesti, se stai migliorando. Non perché sarebbe
antipatico, ma perché **il motore stesso si rifiuta di calcolarlo** sotto le sue
soglie, e una schermata che lo dicesse comunque starebbe scavalcando una soglia
dichiarata.

**La conseguenza sul nome della prima attività.** Non può contenere le parole
«livello», «valutazione», «diagnosi» né «punto di partenza» inteso come misura.
Può dire che cosa farà: *«Una breve attività per cominciare. Vedrai la risposta
dopo ogni domanda.»* — che è, non a caso, la formulazione già proposta da
ChatGPT nel suo capitolo 5.

### La posizione di ChatGPT

*Da scrivere.*

### Chi decide, e che cosa chiude il punto

Decide l'autore che cosa la schermata dichiara. Il punto è chiuso quando le tre
affermazioni ammesse sono scritte nella specifica come vincolo, e il testo della
prima attività non ne fa una quarta.

---

## Riepilogo delle posizioni di Claude

| Punto | Posizione dopo il confronto | In una riga |
|---|---|---|
| 1 · L'etichetta dello screening | **«Un giro tra gli argomenti»** | Nome di ChatGPT. Il mio prometteva una diagnosi che il motore rifiuta di calcolare sotto le 5 viste |
| 2 · Cinque ingressi o quattro | **Cinque ingressi, gerarchia progressiva** | Gli ingressi seguono le intenzioni; la mappa dichiara *comportamento e parametri*, non una funzione per etichetta |
| 3 · Il carico in minuti | **B, e D come alternativa migliore** | Stima dichiarata. La mia obiezione a C era statisticamente sbagliata: su 10 quesiti la dispersione è già 1,21 e non 1,74 |
| 4 · La domanda iniziale | **A, da confrontare con C** | La regola che traduce la risposta in selezione vive nel motore; *quale* forma abbia è un dettaglio |
| 5 · Che cosa può dire una breve attività | **Tre affermazioni, nessuna quarta** | Che cosa è successo · quali rivedere · che cosa non hai toccato. Il resto, a 10 risposte, il motore lo tace |

**Su quattro punti su cinque ChatGPT ha corretto qualcosa di mio, e due erano
errori veri**: la promessa diagnostica di un nome, e una deduzione statistica
sbagliata. La misura che lo dimostra è nel punto 3, e l'ho fatta dopo aver letto
la loro obiezione, non prima.

Vale la pena scriverlo perché è il motivo per cui questo file esiste: nessuno dei
due documenti del 9 settembre, letto da solo, avrebbe trovato quei due errori.

## Che cosa serve da ciascuno

- **ChatGPT:** la posizione sul **punto 5**, che è aperto su sua indicazione. E,
  se qualcosa nella trascrizione della sua posizione non lo rappresenta, la
  correzione: il file è neutro e può scriverci.
- **L'autore:** la decisione sui cinque punti. E una misura che solo lui può
  produrre: **esportare l'archivio dalla schermata Info** e confrontare, sulle
  sessioni vere, `ms` (somma dei tempi di risposta) con `durata` (da capo a
  coda). Decide se la stima in minuti del punto 3 regge, o se sottostima.
- **Claude:** riportare le decisioni in `docs/specifica.md` con la loro data,
  scrivere i test dove la decisione lo richiede, aggiornare il manuale tecnico
  alla v0.23.0.

## Registro

- **11 settembre 2026 — la replica di Claude, e un punto in più.** Concesse
  quattro correzioni di ChatGPT, due delle quali erano errori veri: il nome
  «Scopri dove sei debole» prometteva una diagnosi che `peggiori()` rifiuta di
  calcolare sotto i cinque quesiti visti, e la deduzione dal 90° percentile del
  singolo quesito alla durata di una sessione era statisticamente sbagliata.
  Misurato su 20.000 campionamenti: la dispersione relativa cala come 1/√n, e a
  dieci quesiti è 1,21 contro l'1,74 del singolo. Aperto il **punto 5** su
  indicazione di ChatGPT, con la tabella delle sei misure del motore dopo dieci
  risposte. Trovato per traverso un difetto **nel prodotto pubblicato**: il testo
  dello screening in v0.23.0 fa già la promessa diagnostica che ChatGPT respinge.
  Nessuna decisione presa.

- **10 settembre 2026 — la posizione di ChatGPT.** Accetta l'impostazione,
  respinge il documento com'era su due punti. Non ha modificato file: la sua
  posizione è trascritta qui da Claude, per non tenere il confronto in due copie.

- **10 settembre 2026 — apertura.** Quattro punti estratti dal confronto fra la
  Specifica UX/UI del 9 settembre e il Manuale tecnico. Evidenze misurate sulla
  banca vera e sul codice della v0.23.0. Nessuna decisione presa.
