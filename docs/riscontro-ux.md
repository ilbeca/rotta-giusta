# Rotta Giusta — riscontro alle specifiche UX

**Data:** 8 settembre 2026. **Prodotto di riferimento:** v0.22.1.
**Che cos’è:** una revisione critica di [`specifiche-ux.md`](specifiche-ux.md),
scritta leggendo il codice pubblicato e aprendo la palestra con archivio vuoto.
**Che cosa non è:** una specifica, un piano di lavoro o un’autorizzazione a
modificare l’app. Nessun file del sito è stato toccato per scriverlo.

Le decisioni di prodotto restano nelle specifiche: quando una proposta di questo
documento verrà accolta, va riportata **lì**, non tenuta in due copie.

## 1. Come leggere questo documento

Oltre al vocabolario delle specifiche, ogni affermazione qui è marcata con la
sua fonte, perché le tre non valgono la stessa cosa:

- **[codice]** — letto in `site/engine.js`, `site/app.html` o `site/dati/`, con
  il riferimento. Verificabile subito, senza chiedere niente a nessuno.
- **[osservato]** — visto aprendo il sito in locale (`strumenti/serve.py`) a
  375 px con archivio vuoto, il 7 settembre 2026. È un’osservazione, non una
  spiegazione.
- **[fonte]** — richiede una verifica normativa o documentale che nessuno ha
  ancora fatto.
- **[ipotesi]** — mia congettura sugli utenti. Non è evidenza, e nessuna
  decisione dovrebbe reggersi solo su una di queste.

## 2. Giudizio complessivo

Il pregio più raro delle specifiche è la disciplina sugli stati: quasi nessuna
proposta viene spacciata per decisione. Tre scelte centrano bersagli veri —
Carteggio come ambiente autonomo, il rifiuto di far registrare a mano lo studio
esterno, e il divieto di trasformare l’ordine delle prove in un ordine
obbligatorio di allenamento.

Restano due debolezze di fondo.

**Il documento è scritto senza guardare il motore.** Ripete, prudentemente, che
«non si presume che il motore attuale realizzi già ogni comportamento
proposto». Il risultato è che non distingue le proposte che sono **già
implementate e sotto test** da quelle che il prodotto strutturalmente **non fa**.
Le due cose stanno mescolate, ed è la differenza fra una risistemazione della
presentazione e una riscrittura con dati nuovi. Il §5 e il §6 di questo
riscontro provano a separarle.

**La disciplina sugli stati è diventata anche un modo per non decidere.** In 398
righe le decisioni prese sono quattro; tutto il resto è proposta da verificare,
con prove non ancora pianificate. Un documento in cui ogni frase è falsificabile
solo dopo una prova che nessuno ha in calendario non guida le bozze: la fase 5
arriverebbe con le stesse domande aperte di oggi.

## 3. I cinque rischi, in ordine di gravità

### R-01 — «Sessione consigliata» introduce una contabilità che il prodotto non ha

**[codice]** Le sessioni in Rotta Giusta non esistono come oggetto: si derivano
a posteriori dalle risposte in archivio, con quattro regole, in `sessioni()`
(`site/engine.js:1010`). È una scelta motivata (CHANGELOG 0.13.0): una tabella
di sessioni avrebbe registrato solo il futuro, lasciando invisibile lo storico
già presente. Per la stessa ragione `tappeto()` riprende da dove eri **senza
segnaposto**, perché lo deduce dai fatti.

**Corretto il 9 settembre: questo rischio, come era formulato, è sbagliato.**
Citavo F-02 come prova che le specifiche proponessero una sessione persistente.
Quella frase dice il contrario — «la ripresa di un’attività interrotta va
proposta solo quando lo stato è realmente recuperabile […] non promettere il
secondo per il solo fatto che esiste la prima» — cioè è un presidio contro il
rischio, non la sua causa. **[codice]** E una lista prospettica in memoria
esiste già: `S.run` in `apri()` (`app.html:2106`) porta coda, indice, esiti,
errori e `simUid`, e `chiudi()` la distrugge. Stato durante l’attività, nessuna
persistenza: è già la forma giusta.

**Che cosa resta.** Non un rischio ma un presidio, da tenere scritto: «continua
ad allenarti» non deve diventare «ripristina la stessa lista». Q-05 parla ancora
di una «dimensione» della sessione consigliata, e una dimensione dichiarata in
anticipo è la porta da cui un ripristino entrerebbe.

**La forma su cui siamo d’accordo.** La sessione consigliata resta derivata: un ordine e un motivo
ricalcolati a ogni apertura, mai salvati. È ciò che fa già `mirata()`
(`site/engine.js:784`). **Beneficio per chi studia:** la ripresa è gratis per
costruzione, e non c’è nessuno stato che si possa perdere mentre l’interfaccia
dice che va tutto bene.

### R-02 — Chiudere Q-07 toglie l’unico modo di distinguere «non l’ho ancora studiato» da «lo sbaglio»

**[codice]** L’archivio distingue *mai visto*, *sbagliato* e *sbagliato e
ripreso* (`classifica()`, 0.6.0). Non distingue **sbagliato perché non l’ho
ancora studiato** da **sbagliato pur avendolo studiato**: sono la stessa riga.

Q-07 è chiusa per semplicità, e la scelta è condivisibile: una lista di
argomenti da spuntare non la compila nessuno. Ma ha un costo che le specifiche
non nominano, e che collide con una promessa che le specifiche fanno. UX-04
pretende che «sia chiara la differenza fra poco esercitato e difficoltà
osservata»: *poco esercitato* l’app lo sa (è copertura), *molto esercitato e
sbagliato perché mai studiato* le risulta identico a una difficoltà.

E Q-03 invita esplicitamente chi non ha studiato a provare subito i quiz.
**[ipotesi]** Conseguenza prevedibile: per settimane le sue voci più deboli e la
lista «Solo sbagliate» saranno dominate da argomenti su cui non ha ancora aperto
il manuale. **[codice]** `peggiori()` (`site/engine.js:473`) si difende due
volte: la voce deve avere almeno **5 quesiti distinti visti** — non 5 risposte,
come scrivevo prima del confronto del 9 settembre — e almeno un errore alla
prima risposta (`esatte1 < visti`), quindi una voce presa tutta giusta non
compare mai. **[ipotesi]** Che 5 quesiti distinti siano una soglia bassa per chi
non ha ancora studiato resta una mia congettura, e il codice non la dimostra.

**Corretto il 9 settembre: anche questa formulazione è sbagliata, e
l’alternativa che proponevo era peggiore del problema.** UX-04 non promette di
conoscere lo studio esterno: promette di distinguere *poco esercitato* da
*difficoltà osservata*, e sono due cose entrambe misurabili nell’app. E chiamare
«argomento nuovo» una voce solo perché è poco esercitata **qui** sarebbe l’app
che afferma una cosa che non sa — cioè il difetto che il progetto insegue,
servito sotto forma di riparazione.

**Che cosa resta, e non si decide discutendo.** Non che cosa l’app *dichiara*,
ma che cosa una persona *legge* quando una classifica intitolata «le tue voci
più deboli» è guidata da argomenti su cui non ha ancora aperto il manuale. È una
domanda empirica e appartiene alla fase 6: si mette davanti a qualcuno quella
schermata con un archivio giovane e gli si chiede che cosa gli dice di lui.
Nessuna modifica alle specifiche prima di quella prova.

### R-03 — «Esame» è un corridoio, non una stanza, e apre due porte sulla prova di carteggio

**[codice]** Le voci di navigazione a 375 px sono misurate e costose: sette voci
da 54 px, senza sbordamento, è il limite già toccato (0.9.0). La destinazione
«Esame» contiene, per ammissione delle specifiche, soltanto **accessi** a cose
che vivono altrove; e la prova di carteggio diventa raggiungibile da due punti.
Le specifiche vedono il rischio e lo risolvono per il codice («un accesso
aggiuntivo, non una seconda implementazione»), non per il modello mentale di chi
studia.

Sotto c’è però un bisogno vero: **[ipotesi]** chi comincia deve capire che
l’esame è fatto di più prove — ed è l’evidenza di partenza dell’autore, che il
ruolo preliminare del carteggio non l’aveva capito. Ma quel bisogno è
*informativo*, e un lanciatore non lo soddisfa: chi non sa che esiste una prova
di carteggio non va a cercarla in un elenco di prove.

**Alternativa.** La spiegazione delle prove sta nella guida e nella mappa, dove
serve a orientarsi; l’avvio della prova sta come ultima azione, in evidenza,
**dentro** Quiz e **dentro** Carteggio, accanto all’allenamento su cui misura.
Quattro destinazioni invece di cinque. **Beneficio:** una porta per stanza, e lo
slot risparmiato va dove passa il traffico quotidiano.

**Controargomento da non liquidare:** una voce «Esame» dice a colpo d’occhio che
l’esame esiste ed è fatto di prove. Se le bozze la conservano, deve contenere
*spiegazione* e non solo pulsanti, altrimenti resta un corridoio.

### R-04 — La storia del progetto finirà scritta in tre posti

**[codice]** La vetrina su `/` racconta già che cos’è il sito, per chi è, perché
è gratuito e che cosa non torna, ed è **deliberatamente fuori dal guscio
offline** (0.22.0, perché una presentazione in cache resterebbe congelata).
UX-01 chiede una presentazione sintetica anche dentro la palestra, «senza
presumere che abbia letto la vetrina». Info raccoglie fonti, anomalie e
conservazione dei progressi. Sono tre superfici con lo stesso contenuto e
nessun test che le tenga insieme — mentre il `GUSCIO` scritto in due file e il
prefisso della cache scritto in quattro punti hanno **entrambi** un test,
perché entrambi avevano già morso (0.5.0, 0.20.0).

**Alternativa.** L’accoglienza in app non ripete la vetrina: dice le tre cose
che cambiano il comportamento nei primi due minuti — i progressi restano in
questo browser, non è un corso, la banca è ministeriale con anomalie dichiarate
— e rimanda per il resto. **Beneficio:** quello che si legge in prima pagina e
quello che si legge in app non possono divergere alle spalle di chi studia.

### R-05 — La data d’esame diventa facoltativa e sparisce l’unico motore di ritmo, senza sostituto

**[codice]** Senza data, `traccia()` (`site/engine.js:611`) restituisce
`giorni: null`, `quota: null` e semaforo `attesa`. È corretto e voluto: è la
correzione della 0.19.0 contro il «NaN al giorno», due numeri falsi con l’aria
di essere una misura. Ma significa che per un utente senza data **tutto
l’apparato di ritmo di *Oggi* è inerte**: niente quota, niente semaforo, niente
«sei indietro».

**[osservato]** Con archivio vuoto e senza data, *Oggi* mostra tre zeri, «1722
quesiti rimasti · 7 h 11 m di risposta» e due pulsanti che promettono 1472 e
250. Nessuna misura che si muova, e nessun traguardo più vicino di sette ore.

F-01 rende la data facoltativa — ed è giusto, **[ipotesi]** chi comincia spesso
non l’ha prenotata — ma le specifiche non dicono che cosa dia il senso di «per
oggi basta» a chi non la mette. Senza denominatore, «che cosa faccio adesso» è
una lista senza fine.

**Alternativa.** L’unità di ritmo predefinita non è la scadenza ma la sessione
conclusa e la copertura della voce su cui si sta lavorando («Sicurezza: 12 su
47» invece di «1722 rimasti»); la data resta un potenziamento che trasforma il
ritmo in scadenza. **Beneficio:** chi non ha ancora prenotato l’esame ha
comunque un motivo per tornare domani.

## 4. Risposte alle sei domande poste

**Coerenza dell’esperienza.** Le specifiche sanno dove vogliono arrivare, ma il
punto d’ingresso resta indeterminato: Q-04 lascia aperte le domande iniziali e
la prima attività. Finché non è deciso che cosa fa concretamente, nei primi due
minuti, chi non ha ancora studiato, la coerenza non è verificabile. E la
risposta oggi implicita — «prova subito i quiz» — ha la conseguenza sui dati
descritta in R-02, che va accettata a voce alta o mitigata.

**Sezioni.** Sovrapposizioni reali:

- **Rotta ↔ Progressi**: entrambe portano copertura, difficoltà e prossima
  azione. È la sovrapposizione che **esiste già oggi** fra *Oggi* («Le tue voci
  più deboli») e *Diagnosi* («Cosa studiare adesso»), e la proposta la conserva
  invece di scioglierla. Merita una decisione esplicita: chi dei due dice che
  cosa fare, e chi si limita a spiegare perché.
- **vetrina ↔ accoglienza ↔ Info** (R-04).
- **Esame ↔ Carteggio** (R-03).

Passaggio evitabile: Esame come solo lanciatore.

Attività difficile da collocare, e le specifiche non la discutono: **Segnali
finisce sotto «Quiz»**, cioè sotto l’etichetta che significa «i 1722 quesiti
ministeriali». **[codice]** È invece l’unica parte del sito che *insegna* —
schede scritte dall’autore sulle regole COLREG, extra banca — ed è l’unica che
per scelta **non scrive in archivio** (0.9.0). Metterla lì è filarla sotto
l’etichetta che più la contraddice; e siccome si impara giocando senza sapere
niente prima, **[ipotesi]** è anche la candidata più seria come prima attività
per chi non ha ancora studiato (vedi R-02: non sporca la diagnosi).

**Ruolo di Carteggio.** È la parte migliore delle specifiche, e non ho critiche
sostanziali: ambiente autonomo, tre porte distinte (con carte, senza carte,
prova), materiale dichiarato prima di iniziare, nessun blocco artificiale dei
quiz, separazione esplicita fra riconoscere la tecnica e aver svolto
l’esercizio. Un’aggiunta: **la prova di carteggio non si corregge da sola**, e
questa è la cosa che più sorprende chi arriva. Va detta all’ingresso
dell’ambiente, non alla consegna.

**Semplicità.** Ben difesa su Q-07 e su F-01 (domande iniziali solo se cambiano
una proposta concreta). Ma le specifiche introducono complessità in due punti
che non riconoscono come tali: la sessione con stato (R-01) e la quinta
destinazione (R-03). Entrambe sembrano semplificazioni dell’interfaccia e sono
complicazioni del modello.

**Corrispondenza con il prodotto** e **lacune**: §5, §6 e §7.

## 5. Che cosa esiste già nel motore, ed è re-presentazione

**[codice]** Quanto segue è in `site/engine.js` — logica pura, sotto
`node --test` — **tranne l’ultima riga**, che sta nella pagina: la suite non
esercita `app.html`, lo legge solo come testo per confrontare il `GUSCIO`.
Distinzione dovuta a Codex, e non è un dettaglio: «esiste» e «è garantito da un
test» non sono la stessa cosa.

| Proposta delle specifiche | Che cosa esiste già |
|---|---|
| UX-03, sessione consigliata con motivazione | `mirata()` (`engine.js:784`): deterministica a parità di storico e giorno, tre blocchi con budget (richiami, esplorazione, consolidamento), **il motivo dichiarato per ogni quesito** |
| UX-04, «che cosa faccio adesso» per voce | `consigli()` (`engine.js:516`): voci in ordine di domande d’esame in ballo, con il perché («mai aperta», «ci sbagli», «quasi tutta da vedere») e i minuti stimati sul tempo misurato |
| UX-05, conteggio promesso = attività aperta | `daAllenare()` (`app.html:1970`, **non sotto test**): **tre** chiamate a `coda()` divise in quattro gruppi — aperte, mai visti, riprese, il resto — e restituisce lista **e** arretrato dalla stessa fonte. È la riparazione della 0.16.0, la cui voce di CHANGELOG dice «quattro chiamate» ed è imprecisa |
| F-02, storico riapribile | `sessioni()` (`engine.js:1010`), con la fonte del confine dichiarata quando è ricostruita |
| UX-04, difficoltà distinta dallo storico | `diagnosi()` calcola `aperti` accanto a `sbagliati`, per tema e per voce (0.16.0) |

La cautela delle specifiche è prudente ma lascia soldi sul tavolo: **UX-03 e
buona parte di UX-04 costano molto meno di quanto il documento lasci credere**,
e sapere quali comportamenti sono già garantiti da un test cambia sia il piano
sia il rischio.

## 6. Che cosa richiede dati o contenuti nuovi

**UX-02 è un progetto di contenuto, non di presentazione.** **[codice]** Nel
repo non esiste nessun «programma ministeriale»: esistono la tassonomia della
banca (8 temi, 44 voci, in `site/dati/meta.json`) e `pesi_esame`, che il README
dichiara **non ministeriale** — viene da tre scuole nautiche concordi, non dal
testo del decreto. **[fonte]** Una mappa che mostri «le parti del programma non
coperte dalle attività del sito» richiede un secondo dataset — il programma
d’esame — che nessuno ha ancora cercato. Va scritto in Q-02, altrimenti la fase
5 disegna una mappa senza contenuto; e la mappa non deve in nessun caso
presentare i pesi come ministeriali.

**Le prove non sono dati.** **[codice]** `meta.prove` conosce solo `base`
(20 domande, 30 minuti, max 4 errori) e `vela` (5, 15, max 1). I parametri della
prova di carteggio (4 esercizi, 60 minuti, 3 su 4) sono scritti nel codice, e
**l’ordine delle prove non è dato da nessuna parte**. Se «Esame» o l’accoglienza
devono spiegare com’è fatto l’esame, quello è materiale nuovo da verificare
**[fonte]** e da mettere dove i numeri in schermata si contano dalla stessa
fonte, come già vale per tutto il resto.

**L’ambito (Q-01) tocca dati già pubblicati.** **[codice]**
`site/dati/carteggio_e12.json` — 50 esercizi di carteggio entro 12 miglia,
ritrovati tutti nel PDF dalla verifica del 4 settembre — è pubblicato e l’app
non lo usa. Decidere l’ambito è anche decidere se quel materiale esce dal
cassetto: **[ipotesi]** cambia il pubblico più di qualunque scelta di
navigazione, perché la patente entro 12 miglia è la più diffusa.

## 7. Lacune prima delle bozze

- **Il tema chiaro ha un argomento misurabile, che le specifiche non usano.**
  **[codice]** Le figure del decreto sono servite su `background:#fff`
  (`app.html:150`): oggi c’è una cucitura bianca dentro una schermata navy, su
  119 quesiti con figura. Su superficie chiara sparisce. **Contro:** la
  tavolozza della 0.21.0 è stata *misurata* — rapporti di contrasto voce per
  voce, due valori alzati perché non passavano — e un tema chiaro significa
  rifare quel lavoro per intero. E restano fuori, perché sono contenuto
  didattico e non interfaccia, il cielo notturno dei Segnali e i quattro colori
  dei fanali.
- **Dove vive lo stato dell’accoglienza.** Se sta in `localStorage`, chi cambia
  browser o pulisce i dati rivede la guida, e chi importa i progressi da un file
  dovrebbe non rivederla. È piccolo, ed è esattamente la classe di dettaglio che
  in questo progetto diventa un guasto muto.
- **Una pagina di «decisioni prese».** Oggi sono quattro, sparse in 398 righe fra
  decine di proposte. Un elenco corto in testa alle specifiche le rende
  utilizzabili e rende visibile quanto poco è ancora deciso.
- **Il pallino ambra su Info alla prima apertura.** **[osservato]** È acceso
  appena si apre l’app, perché l’offline non è ancora pronto (`DIAG.off`,
  `app.html:1285`). È corretto per la regola di casa — un guasto muto deve
  restare visibile — ma per chi apre il sito la prima volta è un allarme senza
  causa. È una tensione fra due principi giusti, e non ho una risposta.

## 8. Raccomandazione sulla sequenza

La lacuna più grossa non è nel contenuto: è che le specifiche **non propongono
un ordine di attuazione**. Descrivono un’architettura nuova, un’accoglienza
nuova, una mappa nuova e un tema nuovo — cioè la riscrittura di un `app.html` da
200 KB in pagina sola, senza build step, in un progetto la cui regola è «una
sessione = una versione = un commit». È la forma di intervento a rischio più
alto possibile, ed è quella in cui i guasti muti di questo progetto sono sempre
nati.

Se se ne dovesse scegliere **una** da fare per prima, la mia proposta è la
schermata a **archivio vuoto e senza data d’esame**: è il punto in cui una
persona nuova decide se restare, è misurabile senza spostare una sola attività,
e non richiede né dati nuovi né una nuova navigazione. Mappa, isole, tema chiaro
e nuova architettura reggono meglio dopo aver visto due o tre persone vere
provare a cominciare.

## 9. Osservazioni empiriche di supporto

**[osservato]** Il 7 settembre 2026, sito servito in locale da
`strumenti/serve.py`, `/app` a 375 px, archivio vuoto e nessuna data d’esame.
Sono osservazioni, non spiegazioni.

- Sopra la piega, nell’ordine: il selettore **«Solo domande mai fatte»**
  («0 su 1722 già viste almeno una volta»), il marchio, il campo **data
  d’esame**, tre tessere di copertura a **0 / 1472**, **0 / 250**, **0 / 135**,
  la riga «1722 quesiti rimasti · 7 h 11 m di risposta», e i due pulsanti
  **1472** e **250**. Il primo elemento della prima schermata è un filtro che a
  chi comincia non serve, e il primo campo chiede una data che spesso non c’è.
- Le voci deboli sono vuote, con la nota che spiega perché — ed è la cosa giusta.
- **La terza tessera di «Che cosa faccio adesso» stampa la parola `null`.**
  **[codice]** `traccia()` restituisce `quota: null` senza data d’esame, e
  `azione()` gestisce il caso scrivendo «ne restano 1472» (`app.html:1711`); la
  tessera delle Tecniche è scritta a mano lì accanto e interpola `${tc.quota}`
  nudo (`app.html:1447`). Non è un difetto grafico ed è nel punto cieco
  dell’autore: **lo vede solo chi apre l’app per la prima volta**, perché chi ha
  una data non lo incontra mai. Lasciato dov’è, come reperto per la fase 7.
- La barra ha sette voci con icone geometriche astratte (cerchio, rombo,
  quadrato, triangolo, anello, mezzaluna, i). **[ipotesi]** Non portano
  significato: la parola sotto fa tutto il lavoro.

## 10. Registro

- **9 settembre 2026 — correzioni dopo il confronto con Codex.** Tre
  affermazioni marcate **[codice]** erano sbagliate, e le ha trovate leggendo il
  codice: `daAllenare()` fa **tre** chiamate a `coda()` in quattro gruppi (e non
  è coperto dai test del motore, che non esercitano `app.html`); la soglia di
  `peggiori()` conta **5 quesiti distinti visti**, non 5 risposte; e una lista
  prospettica in memoria esiste già in `apri()`. Ritirati nella formulazione
  **R-01** — la frase di F-02 che citavo come prova è un presidio contro il
  rischio, non la sua causa — e **R-02**, dove UX-04 non prometteva ciò che le
  attribuivo e la mia alternativa avrebbe fatto affermare all'app una cosa che
  non sa. Di R-01 resta un presidio, di R-02 una domanda per la fase 6. Corretta
  anche l'attribuzione di «sotto test» al §5. Il resto del documento è invariato.

- **8 settembre 2026 — prima stesura.** Revisione critica di `specifiche-ux.md`
  alla revisione dell’8 settembre. Cinque rischi, inventario di ciò che il
  motore già garantisce, elenco di ciò che richiede dati nuovi, e le osservazioni
  del 7 settembre sulla prima apertura. Nessuna modifica all’app, nessuna
  decisione presa: le proposte accolte vanno riportate nelle specifiche.
