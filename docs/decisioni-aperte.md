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

### Chi decide, e che cosa chiude il punto

Decide l'autore, sul nome. Il punto è chiuso quando la specifica contiene la
riga «*etichetta → funzione*» per tutti gli ingressi.

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

### Chi decide, e che cosa chiude il punto

Decide l'autore. Il punto è chiuso quando la specifica ha la tabella
ingresso → funzione e `tests/test_interfaccia.py` la controlla.

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

### Chi decide, e che cosa chiude il punto

B lo decide l'autore adesso. C si riapre quando esiste la misura, ed è l'autore
a poterla produrre esportando il proprio archivio.

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

### Chi decide, e che cosa chiude il punto

Decide l'autore fra A, B e C. Se sceglie B, il punto non è chiuso finché la
regola non è scritta nella specifica e implementata nel motore con i suoi test.

### Conseguenze

A: nessuna sul motore. B: una funzione nuova in `engine.js`, i suoi test, e una
riga nel catalogo. C: si toglie il capitolo 4 della Specifica UX/UI.

---

## Riepilogo delle posizioni di Claude

| Punto | Scelta | In una riga |
|---|---|---|
| 1 · «Esplora tutti gli argomenti» | **A** | È lo screening, e va rinominato perché dica il comportamento. Un'etichetta, una funzione |
| 2 · Cinque ingressi o quattro | **Cinque ingressi** | ChatGPT ha ragione: gli ingressi seguono le intenzioni. Sotto restano quattro comportamenti, e un test lo tiene fermo |
| 3 · Il carico in minuti | **B** | Stima dichiarata sì, promessa no. C si apre con una misura che l'autore può produrre |
| 4 · La domanda iniziale | **A** | Cambi la presentazione sì, la selezione solo se diventa una funzione del motore |

Su due punti su quattro la posizione di ChatGPT era migliore della mia, e su un
terzo la sua obiezione mi ha fatto correggere una proposta. Vale la pena
scriverlo, perché è il motivo per cui questo file esiste invece di una decisione
presa da uno solo.

## Che cosa serve da ciascuno

- **ChatGPT:** la propria posizione su ognuno dei quattro punti, sotto quella di
  Claude, con la stessa struttura — evidenza o conseguenza, non preferenza. Se
  una posizione dipende da un dato mancante, dire quale.
- **L'autore:** la decisione su ognuno dei quattro. Sul punto 3, se vuole aprire
  l'opzione C, l'esportazione del proprio archivio dalla schermata Info.
- **Claude:** riportare le decisioni in `docs/specifica.md` con la loro data,
  scrivere i test dove la decisione lo richiede, aggiornare il manuale tecnico
  alla v0.23.0.

## Registro

- **10 settembre 2026 — apertura.** Quattro punti estratti dal confronto fra la
  Specifica UX/UI del 9 settembre e il Manuale tecnico. Evidenze misurate sulla
  banca vera e sul codice della v0.23.0. Nessuna decisione presa.
