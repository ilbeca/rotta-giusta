# Open Patente Nautica — CLAUDE.md

Sito statico open source: quiz e carteggio per la patente nautica senza limiti
dalla costa. È l'estratto di un progetto personale con cui l'autore ha superato
l'esame; ora è **pubblico**, ha **più utenti** e **nessuna scadenza**. I vincoli
del progetto originario (data d'esame, freeze, utente singolo, server) non
valgono più. Quelli qui sotto sì, e sono il metodo che ha fatto passare l'esame.

## Da leggere prima di lavorare

@README.md — da dove vengono i dati, che cosa è stato corretto e perché.
@CHANGELOG.md — le voci da 0.4.2 in poi spiegano *perché* certe scelte sembrano
strane. Leggile prima di «semplificare» qualcosa. Dalla 0.19.0 è la storia di
questo sito.
@docs/adr/ — le decisioni di questo progetto.

## Comandi

```bash
node --test tests/test_engine.mjs                 # il motore, e le tre versioni allineate
python3 tests/test_dati.py                        # dati, invarianti, e il guardiano
python3 strumenti/controlla.py                    # il guardiano da solo
python3 fonte/verifica.py                         # i testi del carteggio contro il PDF (serve pypdf)
python3 strumenti/serve.py                        # il sito in locale, come lo serve Pages
```

Tutto gira sull'Air con node e python di sistema. Non c'è nessun servizio da
riavviare, nessuna macchina remota, nessun database.

## Architettura

- `site/` è **l'unica cosa pubblicata**: Cloudflare Pages, nessun comando di
  build, cartella di output `site`. Tutto il resto del repo è sorgente, verifica
  e documentazione.
- **La logica di selezione sta solo in `site/engine.js`.** Logica pura, senza
  DOM né rete, che gira identica nella pagina e sotto `node --test`. Nessuna
  seconda implementazione, in nessun posto.
- **L'archivio delle risposte vive nel browser** (IndexedDB, una riga per
  risposta) ed è l'unica copia. Lo specchio per quesito che il motore legge
  **non si salva mai**: si ricalcola con `E.ripiega()` a ogni avvio e dopo ogni
  import, e c'è un test che pretende che coincida con `E.applica()` risposta
  per risposta. Non introdurre una seconda contabilità.
- **Niente build step, bundler o dipendenze nuove.** `index.html` è una pagina
  autoconsistente che importa solo `/engine.js`. Quello che è nel repo è quello
  che gira.
- **Non toccare `site/dati/`** se non con una correzione motivata, fissata da
  un test in `tests/test_dati.py` e dichiarata nel README. È la copia
  dell'Allegato A al DD 131/2022. Una risposta della banca **non si cambia per
  convinzione**: si aggiunge una nota e si cita la fonte; all'esame vale il
  decreto.

## Vincoli di lavoro

- **Verificare empiricamente, sempre.** Riprodurre e misurare, non dedurre dal
  codice. Un'osservazione non è una spiegazione. Per una modifica che si vede,
  la verifica è guardarla: screenshot o `getComputedStyle`. Leggere il testo nel
  DOM dimostra solo che il testo è stato scritto.
- **Sospettare gli strumenti che rassicurano.** Ogni difetto trovato in questo
  progetto era silenzioso e conviveva con un'interfaccia che diceva che andava
  tutto bene. Quando ripari qualcosa, chiediti anche come renderlo visibile la
  prossima volta. Una scrittura nell'archivio che fallisce accende il pallino
  su Info e lo scrive: non spegnerlo mai «per pulizia».
- **Un numero promesso e la lista che si apre devono venire dalla stessa
  fonte.** È il difetto tornato tre volte. Vale anche per i numeri nel testo:
  i conteggi in schermata (oscurati, note, figure) si contano dalla banca
  caricata, non si scrivono a mano.
- **Prima di semplificare una funzione condivisa, elenca i suoi chiamanti e di'
  che cosa cambia per ciascuno.** `estrai()` serve simulazione e prova di
  carteggio e **ignora lo storico di proposito** (pesca come il ministero);
  `estraiNuoviPrima()` serve lo screening e il selettore «solo mai fatte».
  Sono due funzioni perché sono due mestieri.
- **Il guscio offline è scritto in due posti** — `GUSCIO` in `sw.js` e in
  `index.html` — e devono restare identici. C'è un test.
- **Gli indirizzi sono quelli che serve Pages, non i nomi dei file**:
  `/privacy` e `/avvertenza`, mai `/privacy.html`. Pages risponde **308** al
  percorso con l'estensione, e una risposta rediretta messa in cache **non si
  può servire a una navigazione**: la pagina muore con `ERR_FAILED`, anche
  online, perché il service worker legge prima la cache. Vale per il guscio e
  per ogni `href` interno; due test lo tengono fermo, e
  `strumenti/serve.py` riproduce in locale gli stessi 308.
- **Una versione, in tre posti, tenuta insieme da un test**: `VERSION`, `CACHE`
  in `site/sw.js`, `versione` in `site/dati/meta.json`. Non c'è un server che
  la sostituisca al volo. Dopo un rilascio serve **una ricarica in più** sul
  dispositivo: la prima serve ancora dalla cache precedente, e la schermata
  Info dice quale cache è installata.
- **Niente dati che non escono di casa.** `strumenti/controlla.py` fallisce se
  nel repo rientrano identificatori delle macchine dell'autore, il suo nome,
  materiale di terzi o file di provenienza non dichiarata. Gira nella suite.
  Il repo di origine è privato e resta tale: non si forka, non si copia da
  `data/seed/`.
- **Test verdi prima di ogni commit. Una sessione = una versione = un commit.**
  Voce di CHANGELOG che spiega **il perché**, non solo il cosa, con i numeri di
  ciò che è stato verificato.
- **Niente push senza chiedere.** Un push pubblica il sito.

## Chiusura di ogni sessione

Test verdi → bump di `VERSION`, di `CACHE` in `sw.js` e di `versione` in
`meta.json` → voce di CHANGELOG con lo stesso numero → un commit → tag annotato
`vX.Y.Z` → chiedere prima del push.

## Il rischio caratteristico: il guasto muto

L'offline che non è mai esistito, lo specchio locale sovrascritto, le righe
scartate con HTTP 200, il pulsante che prometteva 76 quesiti e ne apriva zero,
il semaforo verde a copertura zero. Nessuno di questi ha mai mostrato un
errore. Verifica riproducendo e misurando; una tabella vuota è un'osservazione,
non una spiegazione.

## Difetti noti, aperti

- Il gioco dei Segnali non entra nell'archivio, per scelta: i punteggi vivono in
  localStorage e viaggiano nel file dei progressi solo come migliore/giocate.
- Il ritaglio delle sessioni per righe senza `sim_uid` (archivi importati da
  altrove) è ricostruito e dichiarato in schermata; non è mai stato esercitato
  su un archivio esterno vero.
- Su Safari IndexedDB in navigazione privata può non aprirsi: l'app ripiega su
  localStorage e lo dichiara nella scheda Archivio. Non verificato su un
  dispositivo Apple reale.
