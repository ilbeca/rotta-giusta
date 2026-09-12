# Rotta Giusta — la specifica

**Data:** 9 settembre 2026.
**Prodotto di riferimento:** v0.22.1 pubblicata, più il lavoro in corso sul ramo
`ui/main` (non committato al momento della stesura).
**Che cos'è:** il documento unico di progetto. Che cosa il sito è, per chi, com'è
fatto sotto, dove vive ogni funzionalità, e — per ogni garanzia — **il controllo
che la tiene ferma**.
**Penna:** Claude, su `main`. Vedi §0.

---

## 0. Come si usa questo documento

### Perché uno solo

Il 9 settembre 2026 `specifiche-ux.md` esisteva in **tre versioni divergenti** —
526, 530 e 620 righe — e **nessuna conteneva le altre**. La più recente riportava
indietro, in silenzio, una correzione del giorno prima: un guasto muto servito da
un file che sembrava soltanto aggiornato. Nello stesso periodo la conoscenza del
prodotto era sparsa in cinque documenti che si citavano a vicenda, e nessuno dei
cinque diceva *dove sta ogni cosa*.

Il costo si è visto subito. Il 9 settembre la schermata «Che tecnica serve?» ha
perso il suo unico ingresso durante il ridisegno dell'interfaccia: la vista
esiste ancora, la sua logica pure, e **nessun elemento della pagina la apre**.
Nessun test è diventato rosso, nessun messaggio è comparso. Non esisteva da
nessuna parte un elenco che dicesse «questa funzionalità esiste e ci si arriva
di qui».

Questo documento è quell'elenco, più tutto il resto.

### Le tre etichette, e nessuna quarta

Ogni affermazione qui è una di queste tre. Non ce ne sono altre, ed è
deliberato:

- **Vincolo** — una garanzia del prodotto. Si rompe solo con un ADR che dica
  perché.
- **Deciso** — una scelta presa, con la data. Si cambia decidendo di nuovo.
- **Aperto** — manca una decisione, e la riga dice **chi** la prende.

L'etichetta che manca è **«proposta»**. La versione precedente di questo
materiale aveva 398 righe di cui quattro decisioni e tutto il resto proposte da
verificare: un documento in cui ogni frase è falsificabile solo dopo una prova
che nessuno ha in calendario non guida niente. Una proposta vive in una issue o
in un ramo, non qui. **Qui entra ciò che è stato deciso, e il giorno in cui lo è
stato.**

### Ogni requisito porta il suo controllo

Il §9 numera i requisiti. Ogni riga ha una colonna **controllo**: il nome del
test che lo dimostra, oppure la parola **scoperto** con il motivo.

`tests/test_specifica.py` legge questo file, estrae ogni identificatore `R-*` e
**fallisce se un requisito nomina un test che non esiste**, o se non dichiara di
essere scoperto. È l'ADR-004 di `Standards` applicato ai documenti: *una regola
che qualcuno deve ricordare si sostituisce con un controllo che git esegue.*

Il motivo per cui questa è la parte più importante del documento: il difetto
fondativo di questo progetto è **il semaforo verde a copertura zero** — uno
strumento che rassicura mentre non misura niente. Una specifica che dichiara
garanzie senza controlli è esattamente quello, in forma di prosa.

### Chi scrive

**Una penna sola, su `main`.** Questo file sta nel territorio `motore` di
`territori.yaml`, quindi il `pre-commit` rifiuta un commit che lo tocchi da
`ui/*`.

Non è galateo: una specifica non è additiva. Il `CHANGELOG.md` è condiviso
perché **si aggiunge in fondo**, e due mani che aggiungono non collidono. Una
specifica si **riscrive**, e due mani che riscrivono producono le tre versioni
divergenti di cui sopra.

ChatGPT progetta l'interfaccia sul ramo `ui/*` e propone da lì: bozze,
prototipi, documenti di lavoro. **Le proposte accolte le riporta qui chi fa la
merge.** Il lavoro di progettazione non passa da questo file; ci arriva il suo
esito.

### Che cosa questo documento ha assorbito

`docs/motore.md` (ora un puntatore a qui), `docs/specifiche-ux.md`,
`docs/riscontro-ux.md` e `docs/percorso-ux.md`. I tre `*-ux.md` restano sul
disco come **materiale storico**: raccontano come si è arrivati alle decisioni, e
non vanno più aggiornati. Dettaglio in appendice B.

---

## 1. Per chi è

Tre persone, e le loro paure contano quanto le loro competenze.

**Chi comincia da zero.** Ha deciso di prendere la patente, forse non ha ancora
prenotato l'esame, spesso non ha ancora aperto un manuale. **Non sa** che l'esame
è fatto di più prove, e che il carteggio è quella eliminatoria — è l'evidenza di
partenza dell'autore, che non l'aveva capito. **Teme** di scoprire tardi di aver
studiato la cosa sbagliata. Per lui la prima schermata non è un cruscotto: è la
risposta a «da dove comincio».

**Chi è già in formazione.** Frequenta una scuola o studia sul manuale, e usa il
sito per esercitarsi fra una lezione e l'altra. Sa di che cosa parla, vuole
scegliere l'argomento e cominciare. **Teme** di perdere tempo su quello che sa
già. Per lui il sito deve togliersi di mezzo: due tocchi e una batteria parte.

**Chi ripassa sotto esame.** Ha una data, ha coperto quasi tutto, e la domanda è
una sola: dove sono ancora scoperto, e quanto mi costa. **Teme** di arrivare
impreparato senza accorgersene — che è il motivo per cui in questo prodotto un
numero che rassicura senza misurare è considerato un difetto grave.

**Il contesto d'uso è il telefono in verticale, con una mano.** L'eccezione è il
carteggio, che si fa al tavolo con carta nautica, squadrette e compasso: è
l'unica attività che il telefono non basta a svolgere, e il sito lo dice prima
di iniziare invece di lasciarlo scoprire.

**Il sito accompagna una preparazione, non la sostituisce.** Non insegna: allena
e dà riscontri. L'unica eccezione dichiarata è il gioco dei Segnali, che insegna
per davvero, ed è anche l'unica parte scritta interamente dall'autore.

---

## 2. Che cos'è, e che cosa non è

**Vincolo.** Queste sono le cose che nessuna bozza può spostare senza un ADR.

| Non c'è | Perché |
|---|---|
| **Nessun account, nessuna registrazione** | Le risposte restano nel browser di chi studia e non arrivano a nessuno. Un pulsante «Accedi» sarebbe una bugia in prima pagina. |
| **Nessun backend** | Sito statico su Cloudflare Pages. I quattro JSON in `site/dati/` sono la banca; non c'è un server che sostituisca un numero al volo. |
| **Nessun build step, nessun bundler, nessuna dipendenza** | `index.html` e `app.html` importano solo `/engine.js`. Quello che è nel repo è quello che gira. |
| **Nessuna sincronizzazione** | L'archivio delle risposte è **una copia sola**. L'unica via di salvataggio è il file da scaricare. |
| **Nessun cookie, nessun analytics, nessun form** | Non c'è niente da tracciare perché non si tratta nessun dato. |
| **Nessuna correzione automatica del carteggio** | §7.5. |
| **Nessuna seconda contabilità dello storico** | §3.3. |

E una cosa che c'è e va detta: **il sito dichiara i propri difetti**, quesito per
quesito. È l'unica cosa che nessun concorrente può copiare, ed è il motivo per
cui i 37 oscurati, gli 11 divergenti dal DM 133/2024 e le dieci figure riabbinate
stanno in prima pagina invece che in una nota.

---

## 3. L'architettura: non c'è un backend

Quello che in un'altra applicazione sarebbe il backend, qui è un **livello di
dati** fatto di tre oggetti. Uno solo si salva.

### 3.1 La banca — `site/dati/*.json`, immutabile

È l'Allegato A al DD 131/2022, un atto ufficiale dello Stato. Non si modifica per
convinzione: si annota e si cita la fonte, perché all'esame vale il decreto.

Un quesito (1.722 in `quiz.json`):

```
id   "base-1"          identificatore interno
k    "base" | "vela"   quale banca
t    tema              uno degli 8
v    voce              una delle 44
d    domanda           testo
r    [risposte]        due o tre stringhe
x    indice            quale di `r` è esatta secondo il decreto
p    "1.1.1-1"         progressivo del decreto, quello da citare
f    "figura-007.png"  o null
fm   motivo            perché la figura manca (solo base-59)
osc  1 | null          oscurato dal MIT: non può uscire all'esame
nbp  nota              da mostrare **prima** di rispondere
nb   nota              da mostrare **dopo** aver risposto
```

**`nbp` e `nb` sono due campi e non uno**, e la ragione non va persa: una nota
letta prima della risposta è un suggerimento — tranne quella sull'oscuramento,
che non dice quale risposta sia esatta e cambia che cosa fai *adesso*, perché se
all'esame non uscirà lo salti (0.14.1).

Un esercizio di carteggio (135 in `carteggio.json`): `id` («5.1.3-1», il numero
del foglio), `carta` (5/D o 42/D), `argomento` (correnti, navigazione costiera,
scarroccio, carburante), `famiglia`, `testo`, `risposta_ufficiale`, `tecniche`
(le 12 derivate, **non** ministeriali), `incognita`.

`meta.json` porta i conteggi, le 8 + 44 voci con le loro numerosità, `pesi_esame`
(la composizione delle 20 domande, che è l'Allegato C al DM 323/2021) e `prove`
(base: 20 in 30 minuti, max 4 errori; vela: 5 in 15, max 1).

C'è anche `carteggio_e12.json` — 50 esercizi entro 12 miglia, verificati contro
il PDF — **pubblicato e non usato dall'app**. È materiale nel cassetto, e la
decisione se tirarlo fuori è §10, Q-AMBITO.

### 3.2 L'archivio — IndexedDB, una riga per risposta, **l'unica copia**

```
_t       'q' quiz · 'c' carteggio · 't' tecnica · 'g' tag · 's' prova sostenuta
uid      identificatore della riga: la fusione all'import avviene su questo
item_id  il quesito o l'esercizio
ts       ISO 8601 con offset **locale** (non UTC: vedi 0.4.5)
ms       tempo impiegato
mode     la modalità in cui è uscito
kind     base | vela
sim_uid  la lista in cui è uscito, quando registrata
correct  1|0   (quiz e tecniche)
verdict  1|0   (carteggio: il giudizio è di chi studia)
delta    sempre null nel carteggio, perché nessuno analizza la tua risposta
```

È **append-only**: non si corregge una riga, se ne aggiunge un'altra.

La scelta di IndexedDB è misurata, non dedotta: una riga pesa 192 byte;
`localStorage` sta intorno ai 5 MB in Chrome e Safari, cioè ~27.000 risposte, e
**il modo in cui fallisce è il guasto di casa** — `setItem` lancia, e se nessuno
la prende la risposta sparisce mentre la schermata dice che va tutto bene.
IndexedDB nello stesso browser dichiara 3,7 GB, scrive 30.000 righe in 1,9 s.

Se IndexedDB non si apre, l'app ripiega su `localStorage`, **lo dichiara** nella
scheda Archivio, e lascia che `setItem` lanci.

**Il nome del database resta `open-patente-nautica`** anche dopo il rinomino del
progetto. È l'identità dell'archivio nel browser di chi studia: rinominarlo
aprirebbe un database vuoto e ogni risposta data finora sparirebbe **senza un
errore**. È l'unica eccezione ammessa al rinomino, ed è dichiarata da un test.

### 3.3 Lo specchio — in memoria, **non si salva mai**

Per ogni quesito: `n` risposte, `c` esatte, `first` (1 se la prima era esatta),
`s` streak, `lw` giorno dell'ultimo errore, `k` riprese dopo un errore, `t`
giorno dell'ultimo tocco, `avg` tempo medio.

Si ricalcola con `ripiega()` a ogni avvio e dopo ogni import, e un test pretende
che coincida con `applica()` risposta per risposta.

**Questa è l'invariante architetturale del progetto.** Una copia sola dello
storico, quindi un numero in schermata e la lista che apre non possono divergere.
Nel progetto originario lo specchio era una seconda copia da fondere col server,
e la fusione perse giorni di studio (0.4.2).

### 3.4 Il giro dei dati

```
IndexedDB (righe)  --ripiega()-->  specchio  --coda/mirata/diagnosi/...-->  schermata
       ^                                                                        |
       +---------------------- archivia(riga) <--------- una risposta -----------+
```

`engine.js` non ha né DOM né `fetch`: gira identico nella pagina e sotto
`node --test`.

### 3.5 Il guscio offline

Service worker cache-first, perché la banca è immutabile. Due cose che sono già
costate:

- **Il guscio è scritto in due posti** — `GUSCIO` in `sw.js` e in `app.html` — e
  devono restare identici. C'è un test.
- **Gli indirizzi sono quelli che serve Pages, non i nomi dei file**: `/privacy`,
  mai `/privacy.html`. Pages risponde **308** al percorso con l'estensione, e una
  risposta rediretta in cache **non si può servire a una navigazione**: la pagina
  muore con `ERR_FAILED` anche online. Due test lo tengono fermo, e
  `strumenti/serve.py` riproduce in locale gli stessi 308.

Le figure si scaricano con un pulsante, apposta: sono 102 file.

### 3.6 La versione, in tre posti

`VERSION`, `CACHE` in `site/sw.js`, `versione` in `site/dati/meta.json`. Non c'è
un server che la sostituisca al volo: se uno dei tre resta indietro la suite è
rossa. Dopo un rilascio ogni dispositivo prende la versione nuova alla
**seconda** ricarica, e la schermata Info dice quale cache è installata.

---

## 4. Il motore: contratti, non funzioni

Questo non è l'elenco delle funzioni — quello sta nei commenti di `engine.js`,
che sono insolitamente ricchi. Qui ci sono **le cose che restano vere anche
quando l'implementazione cambia**. Se una riga di qui contraddice il codice, ha
ragione il codice.

### 4.1 Due contabilità della stessa cosa, e non è un errore

**Per la selezione** bastano due stati (`stato()`): `nuovo`, `chiuso`.

**Per la copertura** ce ne vogliono tre (`classifica()`), e la proprietà che li
tiene onesti è che **sommano al totale**:

- `mai_visto` — mai risposto
- `coperto` — l'ultima risposta era esatta
- `da_ripassare` — l'ultima risposta era un errore

Con due soli stati un quesito preso male conterebbe come coperto, e il buco
sparirebbe dentro il numero verde (0.6.0). **Chi disegna una barra di
avanzamento usa i tre, non la percentuale sola.**

### 4.2 Il catalogo: sei mestieri, non sei varianti

| Funzione | Mestiere | Guarda lo storico? |
|---|---|---|
| `coda()` | filtro + ordine generici: banca, temi, voci, stati, solo sbagliate, solo con figura | sì |
| `estrai()` | pescata **cieca**, come il ministero | **no, di proposito** |
| `estraiNuoviPrima()` | esplorazione: prima i mai visti | sì |
| `simulazione()` / `simulazioneVela()` | composizione ministeriale, **esclusi i 37 oscurati** | no |
| `screening()` | n quesiti da **ognuna** delle 44 voci | sì |
| `mirata()` | sessione consigliata: richiami, esplorazione pesata sulla resa, conferme | sì |
| `giroTecniche()` | copertura greedy delle 12 tecniche di carteggio | sì (a parità preferisce i mai fatti) |
| `tappeto()` | i prossimi n esercizi mai fatti, nell'ordine del foglio | sì |
| `daAllenare()` | che cosa mi manca sotto una restrizione qualunque: la lista **e** l'arretrato, dalla stessa fonte | sì |

**Due funzioni di estrazione e non una** perché sono due mestieri: una prova che
ti serve solo quesiti mai visti misura quanto è vergine il foglio, non il voto
che prenderesti.

**Prima di semplificare una di queste, si elencano i chiamanti e si dice che cosa
cambia per ciascuno.** È una regola nata da un caso vero: la semplificazione di
`estrai()` nella 0.5.1 era giusta per la simulazione e sbagliata per lo
screening, che tornò a pescare a caso.

`daAllenare()` restituisce **due** numeri che non vanno confusi: `lista` è tutto,
in ordine di priorità, perché una batteria non deve restare a corto di domande;
`daFare` sono i soli primi due gruppi (aperte + mai visti), cioè `rimanenti` di
`traccia()`. Chi disegna scrive `daFare` come «da fare» e la differenza come
ripasso.

Tutte le selezioni con seme sono **deterministiche**: stesso storico e stesso
giorno, stessa lista.

### 4.3 Le misure, con le loro soglie dichiarate

| Funzione | Che cosa dà | Soglia dichiarata |
|---|---|---|
| `diagnosi()` | per tema e per voce: visti, esatte **alla prima risposta**, sbagliati, **aperti**, tempo medio, copertura, costo in domande d'esame | — |
| `peggiori()` | le voci più deboli | almeno **5 quesiti distinti visti**, e almeno un errore alla prima risposta |
| `consigli()` | che cosa studiare adesso, con il perché e i minuti | `CONSIGLIO_MIN_VISTI = 5` |
| `traccia()` | copertura nei tre stati, rimanenti, quota, giorni, semaforo | **senza data d'esame `quota` e `giorni` sono `null` e il semaforo è `attesa`** |
| `semaforo()` | verde/giallo/rosso sull'atteso lineare | l'inizio è **il giorno della prima risposta**, non «oggi» |
| `stimaImpegno()` | ore e minuti al giorno | sotto `MIN_MISURATE = 30` usa `RIPIEGO_MS = 15000` **e lo dichiara** |
| `tendenza()` | la freccia ↑ → ↓ | almeno **2 giorni** e **10 risposte** |
| `lunghezzaPartita()` | quante domande ha una partita dei Segnali | `min(10, pool)` |

**Ogni soglia esiste perché un numero calcolato sotto quella soglia è rumore con
l'aria di essere una misura.** Chi disegna non può abbassarle per far comparire
prima una tessera: comparirebbe una tessera che mente.

### 4.4 Le sessioni sono derivate, non registrate

`sessioni()` ritaglia le righe in liste **a posteriori**. Di norma il confine è
registrato (`sim_uid`); per le righe senza legame si ricostruisce, e la sessione
si chiude quando cambia `sim_uid`, cambia modalità o banca, passano più di 20
minuti, oppure **ricompare un quesito già uscito**.

**Non esiste, in nessun punto del prodotto, una sessione prospettica**: un
obiettivo dichiarato in anticipo, con una dimensione e uno stato di avanzamento
da riprendere. Derivare invece di registrare è ciò che ha fatto comparire 15
sessioni sullo storico già esistente il giorno in cui la funzione è stata
scritta, senza migrazione e senza uno stato da riparare (0.13.0).

Una lista **in memoria** durante l'attività esiste già ed è la forma giusta:
`S.run` porta coda, indice ed esiti, e si distrugge alla chiusura. La linea da
non passare è la **persistenza**: «continua ad allenarti» avvia una selezione
nuova, non ripristina la precedente.

### 4.5 Le due eccezioni

**Il carteggio non si corregge da solo.** L'app mette la risposta ministeriale
accanto alla tua e sei tu a giudicare; `delta` resta `null`. Le risposte ufficiali
contengono già la tolleranza come intervallo, quindi un confronto automatico si
potrebbe scrivere: non c'è perché sbaglierebbe dicendo «errato» a una risposta
giusta scritta in un altro formato, **sulla prova che manda a casa**.

**Il gioco dei Segnali non entra nell'archivio.** Ha un runner suo; restano solo
migliore e giocate in `localStorage`, che viaggiano nel file dei progressi.

### 4.6 Che cosa il motore **non** sa

È la sezione da leggere prima di proporre una schermata.

- **Non sa che cosa hai studiato fuori dal sito**, e per decisione condivisa non
  lo chiederà. Conseguenza diretta: non può distinguere *sbagliato perché non
  l'ho ancora studiato* da *sbagliato pur avendolo studiato*. Sono la stessa riga.
- **Non ha il programma d'esame.** Ha la tassonomia della banca (8 temi, 44 voci)
  e `pesi_esame`. Una mappa del programma richiede un dataset che non esiste nel
  repo.
- **Non conosce l'ordine delle prove d'esame**, né i parametri della prova di
  carteggio: `meta.prove` conosce solo base e vela.
- **Non sa niente degli altri utenti.** Nessuna calibrazione, nessuna media,
  nessun confronto: la difficoltà di un quesito è solo la tua.
- **Non ha un budget di tempo.** Non sa quanti minuti hai oggi.
  `stimaImpegno()` stima quanto **costa** ciò che resta, non quanto puoi fare.
- **Non giudica il carteggio.**
- **Non sa se sei alla prima visita.** Un archivio vuoto è indistinguibile da un
  archivio cancellato o aperto in un altro browser.

### 4.7 Il confine con l'interfaccia

**Chi disegna non ricalcola.** Se serve un numero che il motore non espone, si
chiede un export nuovo invece di rifare il conto in pagina. È la regola «un
numero promesso e la lista che si apre vengono dalla stessa fonte» vista
dall'altro lato.

Il precedente: `daAllenare()` è vissuta in `app.html` dalla 0.16.0 al 9 settembre
2026 — l'ultima selezione fuori da `engine.js` — e in quel periodo **non era
coperta da nessun test**, perché la suite del motore non esercita `app.html`.
Ora sta nel motore con i suoi sette test.

```
site/engine.js    tutta la selezione e tutte le statistiche. Logica pura.
                  Se una regola di scelta o un numero derivato non è qui, è nel
                  posto sbagliato.
site/app.html     una pagina sola: DOM, archivio, runner, disegno.
site/index.html   la vetrina, fuori dal guscio offline.
```

---

## 5. Inventario: che cosa esiste, e dove ci si arriva

**Questa è la tabella la cui assenza ha fatto sparire una schermata.** Una
funzionalità che non è qui non esiste; una che è qui e non ha un ingresso è un
difetto, non una scelta.

Colonna «ingresso»: **come ci si arriva partendo da zero**, non dove vive il
codice.

### 5.1 Le pagine

| Funzionalità | Vive in | Ingresso | Requisito |
|---|---|---|---|
| Vetrina | `site/index.html` | `/` — è la pagina che deve comparire nelle ricerche | R-NAV-01 |
| Palestra | `site/app.html` | `/app`, e dal pulsante della vetrina | R-NAV-01 |
| Privacy, Avvertenza | file propri | piè di pagina di ogni schermata | R-ARCH-06 |

### 5.2 Le schermate della palestra

| Schermata | id | Ingresso oggi (v0.22.1) | Requisito |
|---|---|---|---|
| Rotta (già *Oggi*) | `v-oggi` | barra, prima voce | R-NAV-02 |
| Quiz (già *Allenamento*) | `v-quiz` | barra | R-NAV-02 |
| Carteggio | `v-cart` | barra | R-NAV-02 |
| Progressi (già *Diagnosi*) | `v-diag` | barra | R-NAV-02 |
| Che tecnica serve? | `v-tec` | barra — **ingresso perso sul ramo `ui/main`** | R-NAV-03 |
| Il gioco dei segnali | `v-seg` | barra | R-NAV-03 |
| Info e diagnostica | `v-info` | barra | R-NAV-04 |

### 5.3 Le attività

| Attività | Dove | Motore | Scrive in archivio |
|---|---|---|---|
| Mirata | Quiz | `mirata()` | sì, `mode` proprio |
| Per argomento | Quiz | `daAllenare()` + `coda()` | sì |
| Solo sbagliate | Quiz | `coda({soloSbagliate})` | sì |
| Simulazione d'esame (base, vela, completa) | Quiz | `simulazione()`, `simulazioneVela()` | sì, più una riga `_t:'s'` |
| Screening completo | Quiz | `screening()` | sì |
| Batteria | Quiz | `daAllenare()` | sì |
| Prova di carteggio | Carteggio | `estraiNuoviPrima()` per argomento | sì, `_t:'c'` |
| Giro delle tecniche | Carteggio | `giroTecniche()` | sì |
| A tappeto | Carteggio | `tappeto()` | sì |
| Che tecnica serve? | schermata propria | selezione per tecnica | sì, `_t:'t'` |
| Gioco dei Segnali (4 modalità) | schermata propria | `domandeSegnali()` | **no**, e §4.5 dice perché |

### 5.4 I controlli e i riscontri

| Cosa | Dove | Nota |
|---|---|---|
| Selettore «solo domande mai fatte» | in cima a Quiz | Ignorato da simulazione e screening, **e lo dichiara** |
| Filtro «solo quesiti con figura» | Quiz → Per argomento | Si spegne da solo su una banca che non ne ha, col perché scritto |
| Spunte argomenti, spunte voci | Quiz | Più voci insieme; per la vela le spunte viaggiano come `voci`, non `temi` |
| Banca base / vela, quante | Quiz | |
| Data d'esame | Rotta | Facoltativa. Senza, `quota` e `giorni` sono `null` e il semaforo è `attesa` |
| Tessere di copertura a tre stati | Rotta | La barra è impilata: il buco sta *dentro* la barra |
| «Le tue voci più deboli» | Rotta | `peggiori()` — **senza chiamanti sul ramo `ui/main`** |
| «Cosa studiare adesso» | Progressi | `consigli()` — classifica **diversa** da quella sopra: ordina per domande d'esame in ballo e nomina anche le voci mai aperte |
| Barrette dell'andamento | Progressi | `serieGruppi()`, `tendenza()` |
| «Le sessioni che hai fatto» | Progressi | `sessioni()`; ogni riga si riapre |
| «Che cosa non torna, e lo diciamo» | Rotta | I numeri si contano dalla banca caricata |
| Scarica / ricarica / azzera i progressi | Info | `fondiArchivio()`; dice quante righe ha preso, quante aveva già, **quante ha scartato** |
| Autodiagnosi offline | Info | Apre ogni voce del guscio e guarda che sia *servibile*, non che la chiave esista |
| Pallino ambra dei guasti | sulla voce Info, visibile da ogni schermata | R-STA-05 |
| Tag N/L/C sugli errori | runner e riepilogo | Un tag per tentativo |
| Revisione di una sessione | Progressi e Carteggio | La tua risposta accanto a quella esatta |
| Spiegazioni in schermata (`?`) | Rotta | Funzionano col mouse **e al tocco** |

---

## 6. La navigazione

### 6.1 Che cosa è deciso

**Deciso l'8 settembre 2026.** Il Carteggio è un **ambiente autonomo** nel quale
si entra apposta, ed è una parte fondamentale della preparazione: ha un accesso
nella navigazione principale e rilievo nella Rotta. Il ruolo preliminare del
carteggio rispetto ai quiz va **spiegato**, non scoperto tardi — ma **senza
blocco artificiale**: l'ordine dell'esame e la libertà di prepararsi in parallelo
restano distinti.

**Deciso il 9 settembre 2026.** Il gioco dei Segnali è un **extra originale** del
progetto, e l'identità può accogliere in futuro altre attività dello stesso tipo.

**Deciso il 9 settembre 2026.** La direzione estetica chiara è confermata, e il
risalto attuale del Carteggio è adeguato.

### 6.2 Che cosa non è deciso, e sta già cambiando

**Aperto — decide l'autore.** Le destinazioni della barra. Le specifiche
registrano quattro destinazioni (Rotta / Quiz / Carteggio / Progressi) come
*proposta da provare nelle bozze*, non come struttura decisa; il ramo `ui/main`
le ha **già implementate**.

Va scritto perché è il caso da cui nasce questo documento: **una struttura di
navigazione è entrata nel codice prima di entrare in una decisione**, e con lei
sono uscite due cose che nessuno ha deciso di togliere (§9, R-NAV-03 e R-NAV-05).
Non è una colpa dell'implementazione: è quello che succede quando l'unico posto
in cui una struttura è scritta è il file che la disegna.

### 6.3 Gli invarianti, qualunque struttura si scelga

Questi valgono con quattro destinazioni, con cinque, e con qualunque altra cosa.

- **Ogni schermata ha almeno un ingresso.** Una vista senza porta è codice morto
  che sembra vivo.
- **Una stanza, una porta principale.** Un secondo accesso a una stessa attività
  non è un difetto, ma deve aprire *la stessa schermata*, con lo stesso titolo e
  lo stesso ritorno. Due strade con intestazioni diverse sono due gerarchie.
- **Non due classifiche concorrenti di «cosa fare adesso».** Oggi ce ne sono due
  — «Le tue voci più deboli» in Rotta e «Cosa studiare adesso» in Progressi — e
  sono *davvero* diverse (§5.4). O si dichiara la differenza, o se ne tiene una.
- **I guasti non possono essere visibili soltanto dopo aver aperto Info.**
- **Non ridurre il testo per far entrare la navigazione.** A 375 px sette voci da
  54 px stavano senza sbordamento: è il limite già toccato. Le etichette restano
  parole intere; se non entrano, sono troppe le voci.
- **Gli extra non stanno dentro la mappa della copertura.** Un'attività che non
  scrive in archivio, messa fra quelle che ci scrivono, suggerisce che il suo
  punteggio sia copertura.

---

## 7. Le schermate

Il modello è quello di `dev-standards`, `references/specifiche.md`. Dove una voce
non si applica, è scritto perché.

### 7.1 Rotta

**Scopo.** Rispondere a «che cosa faccio adesso» senza chiedere a chi arriva di
saper già leggere un cruscotto.

**Ci si arriva da.** L'apertura dell'app, il marchio, la prima voce della barra,
la vetrina.

**Cosa si vede.** Un'attività consigliata con la sua motivazione e il numero di
quesiti che apre; la scelta libera; una sintesi dei progressi che rimanda al
dettaglio senza occupare il posto dell'azione; il riquadro dei difetti
dichiarati; in fondo, dove restano i progressi.

**Stati.**
- *Archivio vuoto*: orientamento, **non** una diagnosi a zero. Con archivio vuoto
  e senza data, il prodotto v0.22.1 mostrava tre zeri, «1722 quesiti rimasti ·
  7 h 11 m» e due pulsanti da 1472 e 250: nessuna misura che si muova e nessun
  traguardo più vicino di sette ore.
- *Dati parziali*: poche osservazioni sulle risposte, dichiarando che non è una
  diagnosi completa.
- *Senza data d'esame*: niente quota, niente semaforo, niente «sei indietro» — e
  **nessun numero inventato al loro posto**. Il traguardo è locale: la selezione
  avviata, poi il riepilogo. Non chiamarlo «quota giornaliera raggiunta».
- *Con data*: quota, ritmo e semaforo rispetto alla scadenza.
- *Errore di salvataggio*: avviso esplicito **prima** delle attività.

**Cosa si può fare.** Avviare l'attività consigliata → runner. Scegliere
liberamente → Quiz o Carteggio. Aprire un extra. Leggere i progressi → Progressi.
Mettere o togliere la data d'esame.

**Casi limite.** Archivio vuoto non prova che sia la prima visita: offrire anche
l'importazione. Se esistono progressi, non trattare la persona come un nuovo
candidato.

**Accessibilità.** Le spiegazioni `?` funzionano col mouse **e al tocco** — un
aiuto che esiste solo in hover, su un telefono, non esiste. Si chiudono con Esc.

**Come deve sentirsi chi la usa.** Orientato, non misurato. Alla prima apertura
questa schermata decide se una persona resta.

### 7.2 Quiz

**Scopo.** Allenarsi sui 1.722 quesiti, scegliendo l'ambito.

**Cosa si vede.** Le sei modalità (§5.3), i controlli di ambito e quantità, e
**prima di Inizia** quanti quesiti apre la selezione corrente.

**Stati.** *Selezione vuota*: spiegare il motivo e offrire di modificarla — mai
un pulsante che non produce niente. *Filtro che azzera*: il conteggio lo dice
prima, non dopo.

**Casi limite.** La vela non ha temi: le spunte viaggiano come `voci`. Una banca
senza quesiti con figura spegne il filtro figure da sola, col perché scritto.

**Come deve sentirsi chi la usa.** In controllo: due tocchi e parte.

### 7.3 Carteggio

**Scopo.** Preparare la prova eliminatoria in un ambiente dedicato.

**Cosa si vede.** Tre porte distinte, con il **materiale necessario dichiarato
prima di iniziare**: esercizi con carte e strumenti, riconoscimento delle
tecniche (senza carte, con i suoi limiti espliciti), prova di carteggio.

**Vincolo.** All'ingresso dell'ambiente, **prima** dell'avvio, va detto che il
giudizio della prova è di chi studia. È la cosa che più sorprende chi arriva, e
non deve arrivare alla consegna.

**Stati.** *Foglio finito* nel tappeto: dirlo, non spegnere il pulsante in
silenzio.

**Casi limite.** La carta 42/D non ha **nessun** esercizio di carburante, quindi
la regola «un esercizio per ciascuno dei quattro argomenti» non potrebbe reggersi
su una carta sola. È un'assunzione, non una regola del decreto (§10).

**Come deve sentirsi chi la usa.** Come al tavolo, non davanti a un quiz.

### 7.4 Progressi

**Scopo.** Rispondere a «ho affrontato tutto?», «dove ho difficoltà?» e — con
collegamenti, non con una seconda classifica — «che cosa faccio adesso».

**Cosa si vede.** Copertura, difficoltà osservate e risultati delle prove,
**separati**. L'andamento nel tempo. Le sessioni, riapribili.

**Vincolo.** Copertura e risultati non si presentano come padronanza
dell'argomento. Con dati insufficienti si dice; con dati assenti non si mostra
preparazione positiva. Le soglie del §4.3 non si abbassano per far comparire
prima una tessera.

**Casi limite.** «Poco esercitato» ed «errori osservati» possono coesistere, e
l'app **non sa perché** si sbaglia: si usano descrizioni come «poche domande
viste qui» ed «errori nelle risposte», mai una diagnosi sulle cause.

**Difetto noto, aperto.** Le tabelle *Per tema* e *Per voce* sforano di 89 px a
375 px. C'è dalla 0.3.0.

### 7.5 Il runner dei quiz

**Cosa si vede.** Il numero del quesito del decreto sopra la domanda; la domanda;
le risposte ancorate in fondo, sotto il pollice. La nota `nbp` **prima** di
rispondere, la `nb` **dopo**.

**Cosa si può fare.** Rispondere col tocco o coi tasti `1 2 3` / `A B C`, e la
schermata **lo dichiara** sui dispositivi con tastiera. Modalità *auto*: sulla
risposta esatta avanza da solo dopo un secondo, sull'errore resta — è lì che c'è
qualcosa da imparare. Taggare un errore N/L/C.

**Vincolo.** Nella simulazione **non c'è correzione durante la prova**: l'esito
arriva alla fine, come all'esame. Il conto alla rovescia diventa rosso sotto i
cinque minuti e chiude la prova a zero.

**Casi limite.** Duecento millisecondi di sordità agli input dopo ogni cambio di
schermata: su un telefono un doppio tocco rispondeva alla domanda dopo senza
averla letta. I modificatori escludono le scorciatoie di sistema — ⌘A rispondeva
A, e scriveva un errore nello storico.

### 7.6 Il runner del carteggio

**Vincolo.** Quello che scrivi è salvato **a ogni tasto**: un'ora di lavoro non
deve dipendere dall'aver premuto un pulsante. Il pallino verde sul numero dice
«qui ho scritto qualcosa», non «è giusto». La consegna è a due tocchi, in pagina,
**mai** con `confirm()` nativo. Alla correzione, la risposta ministeriale accanto
alla tua, e **giudichi tu**.

### 7.7 Segnali

**Scopo.** Riconoscere fanali, segnali diurni e sonori a colpo d'occhio.

**Vincolo.** È materiale **extra banca** e lo dichiara. La lunghezza della
partita è `min(10, pool)` e la schermata scrive quella, non 10 fisso: i pool sono
27 / 9 / 9 / 8. Due situazioni che mostrano la stessa cosa condividono una
`firma`, e un distrattore con la firma del segnale mostrato non entra mai in
campo — altrimenti la domanda avrebbe due risposte giuste.

**Vincolo.** I colori dei fanali, il cielo notturno e la carta dei segnali diurni
**sono contenuto, non interfaccia**: imitano le figure del decreto e non cambiano
con il tema.

### 7.8 Info

**Cosa si vede.** La versione che gira su questo dispositivo **e la cache
installata**, che con un guscio offline possono divergere per giorni. L'archivio:
righe, spazio, e la riga «ultima scrittura fallita». L'autodiagnosi offline. Le
fonti e le anomalie della banca. Scarica / ricarica / azzera.

**Vincolo.** Un pulsante che risponde «fatto» per righe che ha scartato è un
difetto: l'import dice quante ne ha prese, quante aveva già e **quante ne ha
scartate**.

---

## 8. Gli stati trasversali

Da disegnare e provare per **ogni** flusso, non solo per quello che va bene.

| Stato | Regola |
|---|---|
| **Vuoto** | Orientamento, non una diagnosi a zero. E un archivio vuoto non prova che sia la prima visita. |
| **Dati parziali** | Dirlo. Sotto le soglie del §4.3 non si mostra la misura, si mostra che non c'è. |
| **Interruzione** | Quello che è stato risposto è salvato. Il numero in schermata deve dirlo, altrimenti sembra lavoro perduto — è già successo. |
| **Offline** | Non una promessa generica: lo stato riflette la disponibilità **reale** di guscio, banca e figure, e una voce in cache ma non servibile compare in rosso. |
| **Contenuto mancante** | Una figura indisponibile si dichiara con il perché (base-59), non si lascia un buco. |
| **Errore di salvataggio** | Avviso in schermata + pallino su Info + riga nella scheda Archivio, che chiede di scaricare i progressi adesso. **Non si spegne mai «per pulizia».** |
| **Selezione vuota** | «Niente da fare con questa selezione», mai un clic che non produce niente. |
| **Banca non raggiungibile** | Lo si dice. Non si inventano cifre: la vetrina, se `meta.json` non risponde, scrive che non può contare gli argomenti invece di mostrare tessere vuote. |

**Il principio sui messaggi d'errore.** Un errore non è un rimprovero: è
un'informazione **più un modo di uscirne**. Ogni messaggio dice che cosa è
successo e che cosa fare adesso.

---

## 9. I requisiti, con il loro controllo

Ogni riga: che cosa deve essere vero, e **che cosa lo dimostra**. La colonna
controllo nomina un test esistente oppure dice **scoperto** con il motivo.

`tests/test_specifica.py` legge questa sezione e fallisce se un controllo nomina
un test che non esiste. Non si aggiunge un requisito senza compilare la terza
colonna: «scoperto, perché …» è una risposta accettabile, «—» no.

### 9.1 I dati — la banca è un atto dello Stato

| ID | Requisito | Controllo |
|---|---|---|
| R-DATI-01 | Nessun quesito annotato ha la risposta modificata rispetto al seed | `test_dati.py::test_invarianti` |
| R-DATI-02 | Ogni quesito ha **esattamente una** risposta esatta | `test_dati.py::test_quiz` |
| R-DATI-03 | I 37 oscurati esistono in banca e lo dichiarano **prima** di rispondere | `test_dati.py::test_invarianti` |
| R-DATI-04 | Nessuna nota che anticipa la risposta compare fra quelle mostrate prima | `test_dati.py::test_invarianti` |
| R-DATI-05 | I dieci abbinamenti figura restano corretti, e base-59 dichiara perché non ha figura | `test_dati.py::test_figure` |
| R-DATI-06 | I conteggi di `meta.json` coincidono con la banca caricata | `test_dati.py::test_meta` |
| R-DATI-07 | Le risposte ufficiali del carteggio restano verbatim | `test_dati.py::test_carteggio` |
| R-DATI-08 | Nessun dato di casa e nessun materiale di terzi rientra nel repo | `test_dati.py::test_controlla` |

### 9.2 L'architettura

| ID | Requisito | Controllo |
|---|---|---|
| R-ARCH-01 | Lo specchio ricalcolato coincide con quello costruito risposta per risposta | `test_engine.mjs::ripiega: dalle righe lo stesso specchio` |
| R-ARCH-02 | Coperti + da ripassare + mai visti = totale, sempre | `test_engine.mjs::coperti + da_ripassare + mai_visti === totale` |
| R-ARCH-03 | La versione è una sola, nei tre posti | `test_engine.mjs::la versione e una sola` |
| R-ARCH-04 | Il guscio di `sw.js` e quello di `app.html` sono la stessa lista | `test_engine.mjs::il GUSCIO di sw.js` |
| R-ARCH-05 | Nessun percorso del guscio e nessun `href` interno finisce in `.html` | `test_dati.py::test_indirizzi` |
| R-ARCH-06 | `start_url` è la palestra, non la vetrina | `test_dati.py::test_indirizzi` |
| R-ARCH-07 | Il nome del database IndexedDB non cambia col nome del progetto | `test_dati.py::test_rinomino` |
| R-ARCH-08 | Il prefisso della cache è uno solo, in tutti i punti che lo cercano | `test_dati.py::test_prefisso_cache` |
| R-ARCH-09 | I due `<title>` sono diversi, e quello della vetrina nomina la patente | `test_dati.py::test_indirizzi` |

### 9.3 La selezione

| ID | Requisito | Controllo |
|---|---|---|
| R-SEL-01 | La simulazione non pesca i 37 oscurati | `test_engine.mjs::la simulazione non pesca i quesiti oscurati` |
| R-SEL-02 | La simulazione rispetta la composizione ministeriale | `test_engine.mjs::la simulazione rispetta la composizione ministeriale` |
| R-SEL-03 | Il numero promesso e la lista che si apre vengono dalla stessa fonte | `test_engine.mjs::daAllenare: daFare sono le aperte piu i mai visti` |
| R-SEL-04 | Una lista rifatta non ripete la precedente finché c'è altro | `test_engine.mjs::solo sbagliate" avanza da sola` |
| R-SEL-05 | Ogni quesito della Mirata sa dire perché è lì | `test_engine.mjs::mirata: ogni quesito sa dire perche e li` |
| R-SEL-06 | Lo screening tocca ogni voce, e non ripesca finché ci sono mai visti | `test_engine.mjs::lo screening tocca ogni voce` |
| R-SEL-07 | Il tappeto riprende da dove si era rimasti, senza segnaposto | `test_engine.mjs::tappeto: si riprende da dove si era rimasti` |
| R-SEL-08 | La partita dei Segnali è lunga quanto la schermata promette | `test_engine.mjs::segnali: la partita e lunga quanto la schermata promette` |
| R-SEL-09 | La banca vela si restringe per voce, non per tema | `test_engine.mjs::la banca vela si restringe per voce` |
| R-SEL-10 | La prova di carteggio: uno per argomento, soglia 3 su 4 | `test_engine.mjs::la soglia della prova di carteggio e 3 su 4` |

### 9.4 La navigazione e la reperibilità

Questi cinque non esistevano prima del 9 settembre 2026, e i primi due sono la
ragione per cui questo documento è stato scritto.

| ID | Requisito | Controllo |
|---|---|---|
| R-NAV-01 | Ogni schermata dichiarata nel §5.2 ha **almeno un ingresso** nella pagina | `test_interfaccia.py::test_ogni_vista_ha_una_porta` |
| R-NAV-02 | Ogni funzione esportata dal motore è chiamata dalla pagina, o sta nell'elenco dichiarato delle eccezioni | `test_interfaccia.py::test_motore_senza_orfani` |
| R-NAV-03 | Ogni voce della barra porta a una vista dichiarata e ha un'etichetta di testo, non la sola icona | `test_interfaccia.py::test_voci_barra` |
| R-NAV-04 | Le sei modalità dei quiz esistono tutte | `test_interfaccia.py::test_modalita_quiz` |
| R-NAV-05 | I due selettori globali — «solo mai fatte» e «solo con figura» — esistono | `test_interfaccia.py::test_selettori` |
| R-NAV-06 | L'elenco delle schermate del §5.2 è esattamente quello che sta nel file: nessuna aggiunta e nessuna sparizione in silenzio | `test_interfaccia.py::test_viste_dichiarate` |

**Che cosa questi controlli non fanno.** Non fissano la composizione della
barra: quante voci abbia e come si chiamino è Q-NAV, e decide l'autore (§10). Un
test che ne fissasse l'elenco prenderebbe quella decisione al posto suo. Fissano
gli invarianti che valgono con quattro destinazioni, con sette e con qualunque
altra scelta — e R-UX-01 dice che il Carteggio ha una sua stanza, non che debba
stare nella barra.

### 9.5 Gli stati

| ID | Requisito | Controllo |
|---|---|---|
| R-STA-01 | Senza data d'esame non compaiono `NaN` né numeri inventati | `test_engine.mjs::traccia: senza una scadenza niente quota` |
| R-STA-02 | Sotto le soglie misurate si usa il ripiego, **dichiarato** | `test_engine.mjs::stimaImpegno: sotto le 30 risposte` |
| R-STA-03 | L'import dice quante righe ha preso, quante aveva già, quante ha scartato | `test_engine.mjs::fondiArchivio: per uid, senza doppioni` |
| R-STA-04 | Una coda vuota produce un messaggio, non un clic senza effetto | scoperto — la suite non esercita il DOM di `app.html`; oggi si verifica solo guidando la pagina |
| R-STA-05 | Una scrittura fallita accende l'avviso, il pallino e la riga in Archivio | scoperto — richiede di far fallire IndexedDB nella pagina viva |
| R-STA-06 | L'autodiagnosi offline apre ogni voce del guscio, non ne controlla la chiave | scoperto — richiede un service worker attivo su HTTPS |
| R-STA-07 | Una figura indisponibile si dichiara con il perché | `test_dati.py::test_figure` |

### 9.6 Il tempo, e il ciclo che si chiude

Nati dal confronto a tre del 10-12 settembre 2026 e dalla misura sull'archivio
del progetto di preparazione. Il §4 di `prossima-versione.md` li motiva.

| ID | Requisito | Controllo |
|---|---|---|
| R-TEMPO-01 | Sotto `MIN_MISURATE` risposte nessuna schermata annuncia una durata: al suo posto una garanzia vera | scoperto — è un testo di schermata, si fissa quando il testo è definitivo |
| R-TEMPO-02 | Una durata annunciata viene da `stimaImpegno()` e si dichiara stima, mai scritta a mano | scoperto — la suite non esercita il DOM di `app.html` |
| R-TEMPO-03 | Nessun selettore «quanto tempo hai?» dimensiona una sessione | scoperto — misurato che fra sessioni la durata per domanda varia di un fattore quattro |
| R-TEMPO-04 | È ammesso l'inverso — «esercitati per circa N minuti» con chiusura dopo la domanda corrente | scoperto — non esiste ancora nel prodotto, e il controllo sarà sul runner, che la suite non esercita |
| R-TEMPO-05 | Il ritmo si misura all'orologio, non al cronometro, ed è robusto senza soglie da tarare | `test_engine.mjs::ritmo: una sessione in cui ti sei alzato dal tavolo` |
| R-TEMPO-06 | Il ritmo non dipende dalla lunghezza della sessione | `test_engine.mjs::ritmo: una sessione corta non e` |
| R-TEMPO-07 | `stimaImpegno()` dichiara quale dei tre tempi sta riportando | `test_engine.mjs::stimaImpegno: con il ritmo misurato usa l` |
| R-FLU-01 | Ogni attività si chiude con un passo che propone azioni derivate da quello che è appena successo | scoperto — è interfaccia, e arriva con il ridisegno |
| R-FLU-02 | Gli errori di una sessione si riaprono come esercizio, senza mescolarli con quelli di sempre | `test_engine.mjs::erroriSessione: apre esattamente gli errori di quella lista` |
| R-FLU-03 | Il conteggio annunciato e la lista che si apre coincidono anche per gli errori di sessione | `test_engine.mjs::erroriSessione: il conteggio promesso e la lista coincidono` |
| R-FLU-04 | Un confine di sessione ricostruito si dichiara invece di passare per registrato | `test_engine.mjs::erroriSessione: un confine ricostruito si dichiara` |

### 9.8 Che cosa non deve sparire, e che cosa si deve leggere

Nati dall'audit del 12 settembre 2026 e dalla richiesta di ChatGPT di registrare,
per ogni area, i comportamenti esistenti da preservare. Sono controlli e non
liste, perché una lista in un prompt è una regola da ricordare.

| ID | Requisito | Controllo |
|---|---|---|
| R-PRES-01 | Una funzione del motore che la pagina consuma non smette di essere consumata in silenzio | `test_interfaccia.py::test_chiamate_al_motore_preservate` |
| R-A11Y-01 | Nessun testo sotto gli 11 px, salvo eccezioni dichiarate con l'area che le corregge | `test_interfaccia.py::test_testi_leggibili` |
| R-A11Y-02 | Un'immagine che porta contenuto dichiara che cosa mostra; `alt=""` resta per le decorative | `test_interfaccia.py::test_alt_di_contenuto` |
| R-A11Y-03 | Contrasto ≥ 4,5:1 sul testo normale e aree di tocco ≥ 44 px | scoperto — serve il rendering, e si verifica guardando a 375 e 1280 px |
| R-UX-06 | Una breve attività dichiara che cosa è successo, quali rivedere e che cosa non hai toccato: nessuna quarta affermazione | scoperto — è un testo di schermata, si fissa quando il testo è definitivo |

### 9.7 Le decisioni di prodotto

| ID | Requisito | Controllo |
|---|---|---|
| R-UX-01 | Il Carteggio è un ambiente proprio, raggiungibile senza cercarlo fra i quiz | `test_interfaccia.py::test_ogni_vista_ha_una_porta` |
| R-UX-02 | Il gioco dei Segnali non scrive nell'archivio delle risposte | scoperto — richiede di giocare e contare le righe; verificato a mano nella 0.19.2, quattro partite e archivio fermo a 101 righe |
| R-UX-03 | La prova di carteggio dichiara **all'ingresso** che il giudizio è di chi studia | scoperto — è un testo in schermata, si fissa quando il testo è definitivo |
| R-UX-04 | Gli extra non compaiono dentro la mappa della copertura | scoperto — dipende dalla struttura della Rotta, ancora aperta (§10) |
| R-UX-05 | Il carico di un'attività si annuncia in minuti, non solo in domande | scoperto — decisione aperta (§10) |

---

## 10. Che cosa non è deciso

Ogni riga dice **chi decide**. Una questione senza un decidente non si chiude mai.

| ID | Questione | Decide | Conseguenza se resta aperta |
|---|---|---|---|
| Q-NAV | Le destinazioni della barra: quattro, cinque, quali etichette | l'autore | Il codice decide al posto suo, come è già successo (§6.2) |
| Q-EXTRA | Nome, forma e collocazione del riquadro degli extra | l'autore | I Segnali restano dove capita |
| Q-DIM | La dimensione della prima attività per chi comincia | l'autore, dopo un confronto fra due varianti | Restano i 25 quesiti attuali, mai verificati su chi inizia |
| Q-TEMA | Il tema scuro: opzione futura o requisito | l'autore | Il tema chiaro va comunque misurato da solo (appendice A) |
| Q-PROG | Il programma d'esame come dataset | serve una fonte, poi l'autore | Nessuna mappa del programma è possibile: nel repo non c'è (§4.6) |
| Q-AMBITO | Se `carteggio_e12.json` esce dal cassetto | l'autore | 50 esercizi pubblicati e non usati; cambia il pubblico più di ogni scelta di navigazione |
| Q-CART4 | «Un esercizio per ciascuno dei quattro argomenti» è un'assunzione | serve la scuola nautica | La composizione della prova resta non confermata, e la 42/D non ha esercizi di carburante |
| Q-PROVE | Verifiche con dispositivi reali e con persone | l'autore fornisce dispositivi e persone | Nessuna prova su hardware Apple vero, e nessuna prova con persone diverse dall'autore |
| Q-DUE | Due classifiche di «cosa fare adesso»: dichiararne la differenza o tenerne una | l'autore | La sovrapposizione resta, e sul ramo `ui/main` una delle due è già sparita senza decisione |

**Chiuse, e non si riaprono senza un motivo nuovo:**

- **Non si traccia lo studio esterno** (8 settembre 2026). Nessuna lista di
  argomenti da spuntare: non la compila nessuno. Il costo è dichiarato: l'app non
  può distinguere «sbagliato perché non l'ho studiato» da «sbagliato pur avendolo
  studiato», e non deve fingere di saperlo.
- **La composizione delle 20 domande è ministeriale** (9 settembre 2026):
  Allegato C al DM 323/2021. Resta non ministeriale la ripartizione *dentro* un
  tema.

---

## 11. Come si lavora

**Due agenti, e il confine lo fa rispettare git.** `territori.yaml` dice chi tocca
che cosa e il `pre-commit` rifiuta un commit fuori territorio. Il motivo per
esteso è in `AGENTS.md`; il precedente è l'ADR-004 di `Standards`.

**Il ciclo**, da `dev-standards`:

```
BRAINSTORM → SPECIFICA → IMPLEMENTA → REVIEW → RILASCIO
```

Questo documento è la casella **SPECIFICA**, e non si salta: si scopre la
decisione mancante mentre costa una frase, invece che dopo, quando costa una
riscrittura.

**Prima il test che fallisce, poi la correzione.** Un test scritto dopo dimostra
che il codice fa quello che fa; scritto prima dimostra che il difetto c'era e non
c'è più.

**Verificare empiricamente, sempre.** Riprodurre e misurare, non dedurre dal
codice. Per una modifica che si vede, la verifica è **guardarla**: screenshot o
`getComputedStyle`. Leggere il testo nel DOM dimostra solo che il testo è stato
scritto.

**I comandi:**

```bash
node --test tests/test_engine.mjs    # il motore — 109 test al 9 settembre 2026
python3 tests/test_dati.py           # dati e invarianti — 193 verifiche
python3 tests/test_specifica.py      # ogni requisito ha il suo controllo
python3 strumenti/serve.py           # il sito in locale, come lo serve Pages
```

**Chiusura di sessione.** Su `ui/*`: test verdi, voce di CHANGELOG in fondo a
`[Unreleased]`, un commit col trailer, **la versione non si tocca**. Su `main`:
test verdi, un commit; il rilascio è un commit a sé dopo la merge. Niente push
senza chiedere: un push pubblica il sito.

---

## Appendice A — Confronto con le pratiche correnti

**Fatto il 9 settembre 2026.** Va riletto con una data davanti: una sezione
«best practice» senza data invecchia e comincia a suonare autorevole.

Il confronto distingue due cose che di solito vengono confuse. Ci sono pratiche
**misurabili** — un rapporto di contrasto o un'area di tocco si misurano e
passano o non passano — e ci sono **opinioni di progettazione**, per quanto
diffuse. In questo progetto le prime sono requisiti, le seconde sono materiale
per una decisione.

### Dove il progetto è già sopra la media, e non per caso

- **Dichiara i propri difetti** quesito per quesito. Non è una pratica diffusa: è
  il contrario di quella diffusa.
- **Ogni soglia è dichiarata** e nessun numero si mostra sotto la sua (§4.3). La
  pratica corrente è mostrare comunque una percentuale, che è il modo standard di
  fabbricare fiducia senza misura.
- **Niente gamification**: nessuna streak, nessun badge, nessuna notifica. È una
  divergenza consapevole dalla pratica dominante nelle app di studio, ed è
  coerente col pubblico: chi prepara un esame in poche settimane non ha bisogno
  di essere trattenuto, ha bisogno di sapere dove è scoperto.
- **Nessun dark pattern possibile**: non c'è account, non c'è un imbuto, non c'è
  niente da vendere.
- **Offline-first vero**, verificato misurando **zero byte trasferiti** a pagina
  ricaricata, e non dedotto dalla presenza del service worker.
- **Errori con una via d'uscita** e non rimproveri.
- **Progressive disclosure** già applicata: le spiegazioni `?` accanto ai numeri
  derivati, e funzionano al tocco oltre che in hover.

### Le misure da rifare sul tema chiaro

La tavolozza scura è stata misurata voce per voce nella 0.21.0, con due valori
alzati perché non passavano. **Il tema chiaro va misurato allo stesso modo,** e
non c'è scorciatoia:

| Criterio | Soglia | Stato |
|---|---|---|
| Contrasto testo normale | ≥ 4,5:1 (WCAG AA) | da rifare sul chiaro |
| Contrasto testo grande | ≥ 3:1 | da rifare |
| Contrasto di elementi non testuali (bordi, stati) | ≥ 3:1 | da rifare |
| Aree di tocco | ≥ 44 px sul telefono | misurato a 58 px sul prodotto attuale |
| Sbordamento orizzontale a 375 px | 0 | oggi 89 px nelle due tabelle della Diagnosi, difetto aperto dalla 0.3.0 |
| Reflow senza scorrimento orizzontale | fino a 320 px | mai verificato |
| Ingrandimento del testo | fino al 200 % | mai verificato |
| Fuoco da tastiera visibile ovunque | sì | mai verificato per intero |
| Nessun significato affidato al **solo** colore | sì | il semaforo ha tre stati e usa anche la parola: da riverificare sul chiaro |
| Lettore di schermo sui percorsi principali | sì | mai verificato |

**Un argomento misurabile a favore del tema chiaro**, che le bozze non hanno
usato: le figure del decreto sono servite su fondo bianco, quindi oggi c'è una
cucitura bianca dentro una schermata navy su 119 quesiti con figura. Su superficie
chiara sparisce.

### Dove il prodotto attuale non è allineato

- **Sette voci di barra** superano il limite consigliato dalla pratica corrente
  (cinque). La riduzione a quattro lo risolve.
- **Icone geometriche astratte** (cerchio, rombo, quadrato…) che non portano
  significato: la parola sotto fa tutto il lavoro. Se l'icona non aiuta a
  riconoscere, occupa spazio verticale per niente.
- **Il primo elemento della prima schermata è un filtro** che a chi comincia non
  serve, e il primo campo chiede una data che spesso non c'è.
- **Il pallino ambra è acceso alla prima apertura**, perché l'offline non è ancora
  pronto. È corretto per la regola di casa — un guasto muto deve restare visibile
  — ma per chi apre il sito la prima volta è un allarme senza causa. È una
  tensione fra due principi giusti, e non ha ancora una risposta.

### Il limite di questa appendice

Nessuna di queste righe è stata verificata con una persona diversa dall'autore.
Una preferenza estetica non dimostra usabilità; una prova di usabilità non
dimostra efficacia didattica. Le prove con persone sono Q-PROVE.

---

## Appendice B — Che cosa questo documento ha assorbito

| Documento | Che cosa ne è stato | Stato |
|---|---|---|
| `docs/motore.md` | assorbito nei §3, §4, §11 | diventa un puntatore a qui |
| `docs/specifiche-ux.md` | decisioni → §6 e §10; flussi → §7; stati → §8 | materiale storico, non si aggiorna più |
| `docs/riscontro-ux.md` | i rischi ancora vivi → §6.3, §10, appendice A | materiale storico |
| `docs/percorso-ux.md` | metodo → §11 | materiale storico |
| `docs/prototipi/rotta-2026-09-09/` | bozze visive | resta com'è: è un artefatto datato, non una specifica |

I tre `*-ux.md` **restano sul disco** e restano nel territorio `interfaccia`:
raccontano come si è arrivati alle decisioni, e quella storia ha valore. Non
vanno più aggiornati, perché una decisione scritta in due posti diverge — è
successo, ed è il motivo per cui questo file esiste.

---

## Registro

- **9 settembre 2026 — prima stesura.** Nasce da due fatti dello stesso giorno:
  la schermata «Che tecnica serve?» che perde il suo unico ingresso senza che
  niente lo segnali, e `E.peggiori()` che resta senza chiamanti. Entrambi trovati
  guardando, non deducendo: la pagina è stata servita in locale dal worktree
  dell'interfaccia e interrogata nel browser. Nessuno dei due avrebbe fatto
  fallire un test, perché non esisteva un elenco di che cosa deve esistere.
  Il documento assorbe `motore.md` e i tre documenti UX; i requisiti del §9 sono
  41, di cui **34 con un controllo eseguibile** e 7 dichiarati scoperti
  con il loro motivo.
