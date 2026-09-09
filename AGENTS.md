# Rotta Giusta — AGENTS.md

Sito statico open source: quiz e carteggio per la patente nautica senza limiti
dalla costa. È l'estratto di un progetto personale con cui l'autore ha superato
l'esame; ora è **pubblico**, ha **più utenti** e **nessuna scadenza**. I vincoli
del progetto originario (data d'esame, freeze, utente singolo, server) non
valgono più. Quelli qui sotto sì, e sono il metodo che ha fatto passare l'esame.

## Da leggere prima di lavorare

@docs/specifica.md — **il documento unico di progetto**: che cos'è il sito, per
chi, com'è fatto sotto, dove vive ogni funzionalità, e per ogni garanzia il
controllo che la tiene ferma. È la casella SPECIFICA del ciclo, e ha una penna
sola: Claude, su `main`. Ha assorbito `docs/motore.md` e i documenti UX.

@README.md — da dove vengono i dati, che cosa è stato corretto e perché.
@CHANGELOG.md — le voci da 0.4.2 in poi spiegano *perché* certe scelte sembrano
strane. Leggile prima di «semplificare» qualcosa. Dalla 0.19.0 è la storia di
questo sito.
@docs/adr/ — le decisioni di questo progetto.

## Comandi

```bash
node --test tests/test_engine.mjs                 # il motore, e le tre versioni allineate
python3 tests/test_dati.py                        # dati, invarianti, e il guardiano
python3 tests/test_interfaccia.py                 # le viste, le porte, le modalità
python3 tests/test_specifica.py                   # ogni requisito ha il suo controllo
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

## Chi tocca cosa

Su questo repo lavorano due agenti. I confini non sono galateo: sono il modo in
cui non ci si sovrascrive a vicenda. Il 07/09/2026, su `patente-gioco`, questa
stessa coppia nella stessa cartella si e' rotta in **cinque modi** — fra gli
altri un `git add -A` che ha annullato in silenzio il revert dell'altro agente,
e `VERSION` che si spostava sotto le mani di chi lo stava leggendo. Nessuno dei
cinque ha prodotto un errore o un conflitto. Il perche' per esteso e' in
`~/Software/Standards/ADR/ADR-004-la-regola-diventa-un-controllo.md`, che
conclude: una regola che un agente deve ricordare si sostituisce con un
controllo che git esegue.

**La lista che vale e' `territori.yaml`**, alla radice: e' quella che il
`pre-commit` legge. La tabella qui sotto la spiega, non la sostituisce.

| territorio | file | chi |
|---|---|---|
| **motore** | `site/engine.js`, `site/dati/`, `site/figure/`, `fonte/`, `strumenti/`, `tests/`, `docs/adr/`, `docs/motore.md` | Claude, su `main` |
| **regole** | `AGENTS.md`, `CLAUDE.md`, `territori.yaml`, `docs-check.yaml`, `.githooks/`, `.claude/`, `.agents/`, `.gitignore`, `README.md`, `LICENSE`, `VERSION` | Claude, su `main` |
| **interfaccia** | il resto di `site/`, e `docs/*-ux.md` | ChatGPT, su `ui/*` |
| *condivisi* | `CHANGELOG.md`, `site/sw.js` | tutti |

Cinque cose che la tabella non dice.

- **`site/engine.js` sta in `site/` ma e' del motore.** E' logica pura, senza DOM
  ne' rete, testata sotto `node --test`: la regola «la selezione sta in un solo
  file» vale piu' della cartella in cui il file abita. Stessa ragione per
  `site/dati/` e `site/figure/`, che sono l'Allegato A al decreto e non asset
  grafici: il marchio e le icone, quelli si', sono dell'interfaccia.
- **`VERSION` sta fra le regole e `site/dati/meta.json` e' del motore: da `ui/*`
  non si rilascia.** La versione vive in tre posti e i tag sono condivisi fra i
  worktree, quindi due rami che chiudessero entrambi con un bump si
  scontrerebbero per forza. Il rilascio e' un commit solo, su `main`, dopo la
  merge.
- **`docs/` non e' tutto del motore.** I documenti UX sono lavoro
  sull'interfaccia e li scrive ChatGPT con l'autore; gli ADR e `docs/motore.md`
  restano di qui. Il resto di `docs/` e' **neutro**, e un file neutro lo tocca
  chiunque: e' quello che serve ai documenti scritti a quattro mani.
- **`main` rivendica `motore` e `regole` apposta.** Un territorio che nessun ramo
  rivendica si tocca da ogni ramo, e l'app Codex in modalita' Worktree crea rami
  con nomi suoi (`codex/…`) che non combaciano `ui/*`. Con entrambi rivendicati,
  un ramo sconosciuto puo' toccare solo i condivisi e i neutri. Non e' teoria:
  il 09/09/2026 due worktree cosi' esistevano gia' in `~/.codex/worktrees/`,
  staccati, con dentro 480 KB di lavoro che non era in nessun commit.

### I punti di contatto

- **`CHANGELOG.md` e' additivo.** Si aggiunge in fondo alla sezione
  `[Unreleased]`; non si riscrivono mai le voci di un altro. Due mani che
  aggiungono non collidono, due che riscrivono si'. Il hook lo fa rispettare:
  rifiuta un commit che cancella righe del changelog fuori da un rilascio.
- **Il guscio offline e' scritto in due posti** — `GUSCIO` in `site/sw.js` e in
  `site/app.html` — e chi aggiunge un asset li aggiorna tutti e due. C'e' un
  test. E' per questo che `sw.js` e' condiviso invece di essere dell'interfaccia.
- **Chi disegna non ricalcola.** `site/app.html` e `site/index.html` consumano
  `site/engine.js`: se serve un numero che il motore non espone, si chiede un
  export nuovo invece di rifare il conto in pagina. E' la regola «un numero
  promesso e la lista che si apre vengono dalla stessa fonte» vista dall'altro
  lato. L'esempio gia' in casa: **`daAllenare()` oggi vive in `app.html`** e va
  spostata nel motore, con i suoi test, *prima* che la schermata venga rifatta.
- **Una sola penna su `app.html` alla volta**, chiunque sia l'agente: e' un file
  da 200 KB, e l'unita' di conflitto e' il file, non il fornitore. Il territorio
  `interfaccia` e' del ramo `ui/*`; se un giorno una sessione Claude scrive
  interfaccia, lo fa su `ui/*` nello stesso worktree, mentre ChatGPT e' fermo.

### Come si lavora

ChatGPT sta nel worktree `~/Software/rotta-giusta-ui`, sul ramo `ui/main`,
aperto come progetto in modalita' **Local**: mai nel checkout principale, mai
«Hand off», mai la modalita' Worktree dell'app, che crea rami `codex/*` estranei
al recinto. **Un solo thread scrivente per volta** su quella cartella, perche'
l'app ne permette piu' d'uno sulla stessa. Claude e l'autore stanno nel
checkout principale, su `main`.

Ogni commit di ChatGPT porta il trailer
`Co-authored-by: ChatGPT <noreply@openai.com>`.

**Mai `--no-verify`. Mai `git add -A` ne' `git add .`:** si mette in stage solo
cio' che si e' modificato apposta per quel commit, e prima di committare si
guardano `git status` e `git diff --cached`. Il hook protegge quello che entra
nel commit; lo stage per nome riduce il rischio prima che ci entri. Se il hook
rifiuta, nomina il file e scrive il rimedio: il commit e' sbagliato, non il hook.

Il lavoro di ChatGPT arriva su `main` con una **merge** fatta da Claude o
dall'autore; nessun agente fa «hand off» nel checkout principale.

**La merge non passa dal `pre-commit`**, ed e' deliberato: e' il punto in cui un
umano guarda. Chi fa la merge lancia prima il controllo sul diff del ramo:

```sh
python3 ../Standards/tools/check_territories.py --range main...ui/main
```

I percorsi vengono da `git diff --name-only main...ui/main` e le righe cancellate
dal changelog si contano sull'intervallo; lo stage non si legge. Il ramo con cui si
leggono i territori e' il lato destro dell'intervallo. Esce 1 se c'e' una
violazione, e nomina i file.

Poi si guarda il `CHANGELOG.md`, che e' il posto dove il conflitto arriva.

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
- **Test verdi prima di ogni commit, e una sessione un commit.** Voce di
  CHANGELOG che spiega **il perché**, non solo il cosa, con i numeri di ciò che
  è stato verificato. *Una sessione = una versione* vale su `main`: sul ramo
  dell'interfaccia il numero non si tocca, vedi «Chiusura di ogni sessione».
- **Niente push senza chiedere.** Un push pubblica il sito.

## Chiusura di ogni sessione

Dipende dal ramo, e non e' un dettaglio: il numero di versione vive in tre posti
e i tag sono condivisi fra i worktree, quindi due rami che rilasciassero
entrambi si scontrerebbero per forza.

**Su `ui/*`** — test verdi → voce di CHANGELOG in fondo a `[Unreleased]` → un
commit con il trailer. **Il numero non si tocca**, e non si tagga.

**Su `main`** — test verdi → un commit. Il **rilascio** e' un commit a se', dopo
la merge, e lo fa chi la merge la fa: bump di `VERSION`, di `CACHE` in `sw.js` e
di `versione` in `meta.json` → voce di CHANGELOG con lo stesso numero → tag
annotato `vX.Y.Z` → chiedere prima del push.

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
