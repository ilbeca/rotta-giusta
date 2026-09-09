# Rotta Giusta — il motore, e come sta insieme il resto

**Data:** 8 settembre 2026, aggiornato il 9. **Prodotto di riferimento:** v0.22.1.

**A che cosa serve.** A capire che cosa il sito **sa fare già** e che cosa **non
sa**, senza leggere 64 KB di `site/engine.js`. È nato per il lavoro sulla UX,
dove la domanda ricorrente è: questa proposta è una presentazione diversa, o
richiede logica e dati nuovi?

**Che cosa non è.** Non è la documentazione delle funzioni, e non ripete il
*perché* delle scelte: quello sta nei commenti del codice — che qui sono
insolitamente ricchi — e nelle voci del CHANGELOG, ed è lì che va letto e
aggiornato. Questo documento è una **mappa e un elenco di contratti**: le cose
che restano vere anche quando l’implementazione cambia. Se una riga di qui
contraddice il codice, ha ragione il codice.

## 1. La forma dei dati: tre oggetti, e uno solo si salva

### La banca — `site/dati/*.json`, immutabile

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
osc  1 | null          oscurato dal MIT: non può uscire all’esame
nbp  nota              da mostrare **prima** di rispondere
nb   nota              da mostrare **dopo** aver risposto
```

`nbp` e `nb` sono due campi e non uno per una ragione che non va persa: una nota
letta prima della risposta è un suggerimento, tranne quella sull’oscuramento,
che non dice quale risposta sia esatta e cambia che cosa fai adesso (0.14.1).

Un esercizio di carteggio (135 in `carteggio.json`): `id` («5.1.3-1», il numero
del foglio), `carta` (5/D o 42/D), `argomento` (correnti, navigazione costiera,
scarroccio, carburante), `famiglia`, `testo`, `risposta_ufficiale`, `tecniche`
(le 12 derivate, **non** ministeriali), `incognita`.

`meta.json` porta i conteggi, le 8+44 voci con le loro numerosità, `pesi_esame`
(la composizione delle 20 domande) e `prove` (base: 20 in 30 minuti, max 4
errori; vela: 5 in 15, max 1).

### L’archivio — IndexedDB, una riga per risposta, **l’unica copia**

```
_t       'q' quiz · 'c' carteggio · 't' tecnica · 'g' tag · 's' prova sostenuta
uid      identificatore della riga: la fusione all’import avviene su questo
item_id  il quesito o l’esercizio
ts       ISO 8601 con offset **locale** (non UTC: vedi 0.4.5)
ms       tempo impiegato
mode     la modalità in cui è uscito
kind     base | vela
sim_uid  la lista in cui è uscito, quando registrata
correct  1|0   (quiz e tecniche)
verdict  1|0   (carteggio: il giudizio è di chi studia)
delta    sempre null nel carteggio, perché nessuno analizza la tua risposta
```

È append-only: non si corregge una riga, se ne aggiunge un’altra.

### Lo specchio — in memoria, **non si salva mai**

Per ogni quesito:

```
n  risposte    c  esatte     first 1|0 se la prima risposta era esatta
s  streak      lw  giorno dell’ultimo errore     k  riprese dopo un errore
t  giorno dell’ultimo tocco       avg  tempo medio in ms
```

Si ricalcola con `ripiega()` (`engine.js:974`) a ogni avvio e dopo ogni import,
e un test pretende che coincida con `applica()` risposta per risposta. **Questa
è l’invariante architetturale del progetto:** una copia sola dello storico,
quindi un numero in schermata e la lista che apre non possono divergere. Nel
progetto originario lo specchio era una seconda copia da fondere col server, e
la fusione perse giorni di studio (0.4.2).

## 2. Il giro dei dati

```
IndexedDB (righe)  --ripiega()-->  specchio  --coda/mirata/diagnosi/...-->  schermata
       ^                                                                        |
       +---------------------- archivia(riga) <--------- una risposta -----------+
```

Nessun server, nessuna rete, nessun account. `engine.js` non ha né DOM né
`fetch`: gira identico nella pagina e sotto `node --test`.

## 3. Due contabilità della stessa cosa, e non è un errore

**Per la selezione** bastano due stati (`stato()`): `nuovo` (mai risposto),
`chiuso` (risposto almeno una volta).

**Per la copertura** ce ne vogliono tre (`classifica()`), e la proprietà che li
tiene onesti è che **sommano al totale**:

- `mai_visto` — mai risposto
- `coperto` — l’ultima risposta era esatta
- `da_ripassare` — l’ultima risposta era un errore

Con due soli stati un quesito preso male conterebbe come coperto, e il buco
sparirebbe dentro il numero verde (0.6.0). Chi disegna una barra di avanzamento
deve usare i tre, non la percentuale sola.

## 4. Il catalogo: sei mestieri, non sei varianti

| Funzione | Mestiere | Guarda lo storico? |
|---|---|---|
| `coda()` | filtro + ordine generici: banca, temi, voci, stati, solo sbagliate, solo con figura | sì |
| `estrai()` | pescata **cieca**, come il ministero | **no, di proposito** |
| `estraiNuoviPrima()` | esplorazione: prima i mai visti | sì |
| `simulazione()` / `simulazioneVela()` | composizione ministeriale, **esclusi i 37 oscurati** | no |
| `screening()` | n quesiti da **ognuna** delle 44 voci | sì |
| `mirata()` | sessione consigliata: richiami, esplorazione pesata sulla resa d’esame, conferme | sì |
| `giroTecniche()` | copertura greedy delle 12 tecniche di carteggio | sì (a parità preferisce i mai fatti) |
| `tappeto()` | i prossimi n esercizi mai fatti, nell’ordine del foglio | sì |
| `daAllenare()` | che cosa mi manca sotto una restrizione qualunque: la lista **e** l’arretrato, dalla stessa fonte | sì |

**Due funzioni di estrazione e non una** perché sono due mestieri: una prova che
ti serve solo quesiti mai visti misura quanto è vergine il foglio, non il voto
che prenderesti (0.6.0, e la regola sta in `AGENTS.md`).

L’ordine di «solo sbagliate» ha tre chiavi — errore ancora aperto, poi il più
trascurato, poi l’errore più fresco — e la seconda è quella che fa avanzare la
lista **senza segnaposto**: quello che hai appena fatto scende in fondo da solo
(0.16.0). Stessa idea in `tappeto()`: la ripresa è gratis perché è derivata.

`daAllenare(items, progress, oggi, kind, extra)` non è una selezione nuova: sono
tre chiamate a `coda()` composte in quattro gruppi — **aperte → mai visti → già
riprese → il resto** — e restituisce due cose che non vanno confuse. `lista` è
tutto, in ordine di priorità, perché una batteria non deve restare a corto di
domande; `daFare` sono i soli primi due gruppi, cioè `rimanenti` di `traccia()`.
`extra` sono le opzioni di `coda()` (`temi`, `voci`, `voce`, `soloFigura`) e
valgono su tutte e tre le chiamate: è così che il numero promesso e la lista che
si apre non possono divergere nemmeno sotto un filtro. Chi disegna scrive
`daFare` come «da fare» e la differenza come ripasso; scriverli uguali sarebbe la
bugia opposta a quella riparata nella 0.16.0.

Tutte le selezioni con seme sono **deterministiche**: stesso storico e stesso
giorno, stessa lista. `semeGiorno()` è il seme delle selezioni riproducibili.

## 5. Le misure, con le loro soglie dichiarate

| Funzione | Che cosa dà | Soglia dichiarata |
|---|---|---|
| `diagnosi()` | per tema e per voce: visti, esatte **alla prima risposta**, sbagliati, **aperti**, tempo medio, copertura, costo in domande d’esame | — |
| `peggiori()` | le voci più deboli | almeno **5 risposte** su una voce |
| `consigli()` | che cosa studiare adesso, con il perché e i minuti | `CONSIGLIO_MIN_VISTI = 5` |
| `traccia()` | copertura nei tre stati, rimanenti, quota, giorni, semaforo | **senza data d’esame `quota` e `giorni` sono `null` e il semaforo è `attesa`** |
| `semaforo()` | verde/giallo/rosso sull’atteso lineare | l’inizio è **il giorno della prima risposta**, non «oggi» |
| `stimaImpegno()` | ore e minuti al giorno | sotto `MIN_MISURATE = 30` usa `RIPIEGO_MS = 15000` **e lo dichiara** |
| `tendenza()` | la freccia ↑ → ↓ | almeno **2 giorni** e **10 risposte** |
| `lunghezzaPartita()` | quante domande ha una partita dei Segnali | `min(10, pool)` |

Ogni soglia esiste perché un numero calcolato sotto quella soglia è rumore con
l’aria di essere una misura. Chi disegna non può abbassarle per far comparire
prima una tessera: comparirebbe una tessera che mente.

## 6. Le sessioni sono derivate, non registrate

`sessioni()` (`engine.js:1010`) ritaglia le righe in liste **a posteriori**.
Di norma il confine è registrato (ogni risposta porta il `sim_uid` della lista in
cui è uscita); per le righe senza legame — un archivio importato da altrove — si
ricostruisce, e la sessione si chiude quando cambia `sim_uid`, cambia modalità o
banca, passano più di **20 minuti**, oppure **ricompare un quesito già uscito**.

Non esiste, in nessun punto del prodotto, una sessione **prospettica**: un
obiettivo dichiarato in anticipo, con una dimensione e uno stato di
avanzamento da riprendere. Non è una dimenticanza: derivare invece di registrare
è ciò che ha fatto comparire 15 sessioni sullo storico già esistente il giorno
in cui la funzione è stata scritta, senza migrazione e senza uno stato da
riparare (0.13.0). Introdurne una sarebbe **una seconda contabilità**, che
`AGENTS.md` vieta.

## 7. Le due eccezioni

**Il carteggio non si corregge da solo.** L’app mette la risposta ministeriale
accanto alla tua e sei tu a giudicare; `delta` resta `null` perché nessuno
analizza quello che hai scritto. Le risposte ufficiali contengono già la
tolleranza come intervallo, quindi un confronto automatico si potrebbe scrivere:
non c’è perché sbaglierebbe dicendo «errato» a una risposta giusta scritta in
un altro formato, sulla prova che manda a casa (0.5.0).

**Il gioco dei Segnali non entra nell’archivio.** Ha un runner suo; restano solo
migliore e giocate in `localStorage`, che viaggiano nel file dei progressi. È
l’unica parte del sito interamente scritta dall’autore, extra banca — e l’unica
che *insegna* invece di interrogare.

## 8. Le garanzie che l’interfaccia non deve rompere

1. **Il numero promesso e la lista che si apre vengono dalla stessa fonte.** È
   il difetto tornato tre volte; `daAllenare()` esiste per questo. Dal 9
   settembre 2026 sta **nel motore**, con i suoi sette test, dopo essere vissuta
   in `app.html` dalla 0.16.0: era l’ultima selezione fuori da `engine.js`.
   L’interfaccia la chiama come `E.daAllenare(banca, prog, oggi, kind, extra)` e
   non ne tiene una copia.
2. **Nessuna seconda copia dello storico.** Lo specchio si ricalcola, non si
   salva.
3. **La simulazione ignora lo storico e gli oscurati**, e resta distinguibile
   dall’allenamento: nessuna correzione in corsa, soglie e tempi del decreto.
4. **Una risposta della banca non si cambia**: si aggiunge una nota e si cita la
   fonte.
5. **Una scrittura fallita si vede**: avviso in schermata, pallino su Info, riga
   nella scheda Archivio. Non si spegne «per pulizia».
6. **I conteggi in schermata si contano dalla banca caricata**, non si scrivono
   a mano.
7. **Gli indirizzi sono quelli che serve Pages** (`/privacy`, non
   `/privacy.html`): una risposta rediretta in cache uccide la navigazione.

## 9. Che cosa il motore **non** sa

È la sezione da leggere prima di proporre una schermata.

- **Non sa che cosa hai studiato fuori dal sito**, e per decisione condivisa non
  lo chiederà (Q-07 delle specifiche). Conseguenza diretta: non può distinguere
  *sbagliato perché non l’ho ancora studiato* da *sbagliato pur avendolo
  studiato*. Sono la stessa riga.
- **Non ha il programma d’esame.** Ha la tassonomia della banca — 8 temi, 44
  voci — e `pesi_esame`, che il README dichiara **non ministeriale**: viene da
  tre scuole nautiche concordi, non dal testo del decreto. Una mappa del
  programma richiede un dataset che non esiste nel repo.
- **Non conosce l’ordine delle prove d’esame**, né i parametri della prova di
  carteggio: `meta.prove` conosce solo base e vela. Il resto è scritto nel
  codice o non c’è.
- **Non sa niente degli altri utenti.** Nessun server, quindi nessuna
  calibrazione della difficoltà, nessuna media, nessun confronto: la difficoltà
  di un quesito è solo la tua.
- **Non ha un budget di tempo.** Non sa quanti minuti hai oggi, né che ora è.
  `stimaImpegno()` stima quanto **costa** ciò che resta, non quanto puoi fare.
- **Non ha una sessione con un obiettivo** (§6).
- **Non giudica il carteggio** (§7).
- **Non ha account né sincronizzazione**, e non ne avrà: i progressi restano nel
  browser, e l’unica via di salvataggio è il file da scaricare.
- **Non sa se sei alla prima visita.** Un archivio vuoto è indistinguibile da un
  archivio cancellato o aperto in un altro browser.

## 10. Dove si tocca che cosa

```
site/engine.js    tutta la selezione e tutte le statistiche. Logica pura.
                  Se una regola di scelta o un numero derivato non è qui, è nel
                  posto sbagliato.
site/app.html     una pagina sola: DOM, archivio, runner, disegno. Importa solo
                  /engine.js.
site/index.html   la vetrina su `/`. Fuori dal guscio offline, deliberatamente.
site/sw.js        service worker cache-first. Il nome della cache segue VERSION.
site/dati/        la banca. Non si tocca senza un test e una nota nel README.
tests/            test_engine.mjs (motore) · test_dati.py (dati e invarianti)
```

Un rilascio alza tre numeri tenuti insieme da un test: `VERSION`, `CACHE` in
`sw.js`, `versione` in `meta.json`.

## 11. Registro

- **8 settembre 2026 — prima stesura.** Scritta leggendo `site/engine.js`,
  `site/app.html` e `site/dati/` alla v0.22.1, per il lavoro sulla UX. Nessuna
  modifica all’app. Contratti e mappa, non documentazione delle funzioni: il
  perché resta nei commenti del codice e nel CHANGELOG.
