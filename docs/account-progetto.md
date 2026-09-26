# Gli account — progetto di realizzazione

**Aperto il 25 settembre 2026.** Documento di lavoro, non specifica.
**Parte da:** `docs/adr/ADR-003-account-obbligatorio-e-dati-sul-server.md` e
`docs/adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md`. Gli ADR
dicono *che cosa* e *perché*, e lasciano apposta a questo documento il *come*:
tabelle, hashing, sessione, forma dell'API — dall'ADR-003 — e, dall'ADR-004, il
passaggio di chi ha già un archivio nel browser, la sessione mentre l'email non
è confermata, le impostazioni senza account, che cosa resta nel browser
all'uscita.
**Riprende senza rifarle** le sezioni ancora valide di
`docs/recupero-progetto.md`: §5 (l'endpoint su un'origine sua, misurata), §8
(dove vive il codice), §9 (che cosa diventa falso), §10 (che cosa non è
misurato). Qui c'è solo quello che cambia rispetto a loro.
**Territorio:** neutro. Le proposte accolte entrano in `docs/specifica.md` per
mano di chi la fa (§0 della specifica).
**Niente codice:** l'interfaccia è in ridisegno. Il server, che non tocca
`site/`, può partire dopo questo documento (`docs/prossime-sessioni.md`,
punto 3-bis); il client aspetta una fetta del ridisegno.

Ogni scelta porta un'etichetta: **Proposto** (la raccomandazione, con il perché)
oppure **Aperto** (manca una decisione, e la riga dice chi la prende). Dove c'è
un numero, è misurato e lo dice; dove non lo è, lo dice lo stesso.

**Scritto senza l'account Scaleway**, che la coda indicava come necessario.
Tutto ciò che dipende da Scaleway — prestazioni della macchina, posta,
certificato, copie di sicurezza — è progettato sui requisiti e marcato **da
misurare** (§19). Nessuna scelta di questo documento cambia se le misure
tornano, e nessuna è stata presa per non doverle fare.

---

## 1. Quattro regole, prima dei dettagli

Il resto discende da queste. Sono le tre regole di `recupero-progetto.md` §1
tradotte per righe in chiaro, più una che prima non serviva.

1. **Il server conserva righe, mai stato.** Lo specchio non viaggia in nessuna
   direzione e si ricalcola sempre in locale con `ripiega()` (R-ARCH-01). Il
   server non ha un «progresso per quesito», non ha una copertura, non ha una
   colonna che un giorno qualcuno sarebbe tentato di fondere.
2. **Nessuna riga si modifica, e nessuna si perde in silenzio.** Il server
   aggiunge; non corregge, non riscrive, non normalizza. Quello che restituisce
   è byte per byte quello che ha ricevuto. Una riga che rifiuta la dichiara, con
   il motivo, e il client la tiene — visibile — invece di buttarla.
3. **«Salvato» si scrive solo dopo la conferma per `uid`.** Un 200 dice che una
   richiesta è arrivata. Il client toglie dalla coda soltanto le righe che il
   server nomina come accolte o già presenti: è la correzione della 0.4.6, dove
   `filter` sulla coda corrente buttava le risposte date durante l'invio.
4. **Una cancellazione è l'unica operazione che toglie, ed è sempre chiesta.**
   L'unione per `uid` non ha conflitti, ma ha un nemico: il dispositivo rimasto
   offline che, dopo un azzeramento fatto altrove, rimanda le righe cancellate.
   Senza un freno la cancellazione **non cancella**, e lo fa senza un errore.
   Il freno è la *generazione* (§8.4).

---

## 2. Dove gira

### 2.1 L'origine: quella di `recupero-progetto.md` §5

**Invariata:** `https://api.rottagiusta.it`, un'origine separata dal sito.
statichost.eu serve solo file statici; il service worker ignora già le altre
origini (`site/sw.js:143` — era la 91 quando `recupero-progetto.md` è stato
scritto: la riga si è spostata, la regola no). Il guscio offline non sa che
l'API esiste.

**Una misura nuova la rende obbligatoria in HTTPS dal primo giorno.**
`rottagiusta.it` risponde, misurato oggi:

```
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

`includeSubDomains` vale per **ogni** sottodominio, compreso `api.`: un browser
che ha visto il sito rifiuta di parlargli in chiaro per un anno. Nessuna fase di
prova in HTTP sul dominio vero.

### 2.2 Su che cosa — Proposto

**Una macchina Scaleway in `fr-par`, un processo Node, un file SQLite, zero
dipendenze npm.**

| Pezzo | Con che cosa | Perché |
|---|---|---|
| HTTP | `node:http` | niente framework: sono una ventina di rotte |
| Hashing | `crypto.argon2` | misurato presente in Node 25.3 senza avvisi sperimentali (§5) |
| Database | `node:sqlite`, in WAL | un file, un solo scrittore (§2.3) |
| Posta | `fetch` verso l'API di Scaleway Transactional Email | nessun client SMTP da installare |
| Validazione delle righe | **`site/engine.js`, importato** | la stessa funzione nel browser e sul server (§4) |

La ragione che pesa di più è l'ultima riga. `AGENTS.md` vieta una seconda
implementazione della logica, «in nessun posto». Un server in Node importa
`engine.js` così com'è — logica pura, senza DOM né rete, cioè esattamente la
forma che lo rende importabile — e il browser e il server rifiutano **le stesse**
righe per **gli stessi** motivi. Un server in un altro linguaggio avrebbe una
seconda copia delle regole, e il giorno in cui le due divergono una riga
accettata dal server rompe `ripiega()` su ogni dispositivo dell'account: è la
riga con `ts: "boh"` della 0.4.6, che spegneva la palestra dappertutto.

**Il prezzo, dichiarato:** `node:sqlite` in Node 25.3 stampa ancora
`ExperimentalWarning: SQLite is an experimental feature`. Il rischio è sulla
**firma delle funzioni**, non sui dati: il formato del file è SQLite, lo stesso
di sempre, leggibile da qualunque altro strumento. Un'API che cambia rompe la
suite al primo aggiornamento di Node, non un archivio.

**Deciso il 26 settembre 2026, su delega dell'autore:** questa forma. L'altra
era Serverless Containers più il database PostgreSQL gestito di Scaleway: toglie
la macchina da tenere aggiornata, e aggiunge una dipendenza (`pg`), un secondo
servizio da pagare e il problema del §2.3. L'autore ha detto di non avere gli
elementi per scegliere; la scelta è quella con meno pezzi, e si riapre solo se
le misure su Scaleway (§19) la smentiscono — per esempio se la macchina più
piccola non regge Argon2id sotto i 250 ms.

### 2.3 Perché un solo scrittore conta: il cursore

Il client scarica le righe nuove dall'ultima che ha visto (§8.2). Il cursore
**non può essere `ts`**: `ts` lo scrive l'orologio del telefono, e una risposta
data offline il 3 e inviata il 10 ha un `ts` più vecchio dell'ultimo scaricato —
un cursore su `ts` la salterebbe per sempre, su ogni altro dispositivo, senza un
errore. Il cursore è un numero di sequenza **assegnato dal server** all'arrivo.

Con un solo scrittore i numeri diventano visibili nell'ordine in cui sono
assegnati. Con più transazioni concorrenti — PostgreSQL, una sequenza — la 101
può essere confermata prima della 100: chi legge in quel momento vede la 101,
avanza il cursore, e la 100 non la vedrà mai. È un difetto noto e risolvibile,
ma è un difetto da risolvere; con SQLite in WAL non esiste.

### 2.4 Quanto pesa, misurato

Un database con 100 account da 2.100 risposte l'uno — cento preparazioni
complete, righe sintetiche nella forma vera — scritto con `node:sqlite` sul
Mac: **210.000 righe in 771 ms, 69,6 MiB, 347 byte a riga** con la chiave e
l'indice sul cursore. Il doppio dei 192 byte di una riga in IndexedDB, perché
accanto al JSON verbatim ci sono le colonne estratte (§3). Mille preparazioni
stanno in meno di un giga.

### 2.5 Il backup, con il ripristino provato

È una delle tre cose che `prossime-sessioni.md` chiede **prima** della prima
riga di codice server, ed è la lezione della 0.4.6 portata sui dati di altri:
*un backup mai ripristinato non è un backup, è un file.*

**Proposto:**

- la copia si fa con `VACUUM INTO`, **mai** copiando il file: in WAL il file
  principale può essere vuoto mentre i dati stanno nel `-wal` accanto —
  misurato il 24 agosto sul progetto originario, zero righe nel `.db`, 108 nel
  WAL;
- ogni copia si verifica (`PRAGMA integrity_check`) e **si confronta il numero di
  righe con la precedente**: le righe si tolgono solo per cancellazione, quindi
  un calo senza cancellazioni registrate nel §15 è un allarme, non un dato;
- due volte al giorno, verso l'Object Storage di Scaleway in **un'altra regione**
  (`nl-ams`), con uno strumento della macchina e non con codice del server;
- **le copie si tengono 30 giorni, non di più**: una copia è anche un posto in
  cui un dato cancellato sopravvive (§14.4);
- `ripristina --prova` fa il giro intero su un'istanza sacrificabile — scrive,
  copia, cancella, ripristina, confronta — ed entra nella suite del server.

---

## 3. Le tabelle

Nomi italiani, come il resto del repo. Date in UTC, ISO 8601, salvo `ts` delle
righe, che resta com'è arrivato.

```sql
account (
  id                     INTEGER PRIMARY KEY,   -- interno, mai esposto
  email                  TEXT NOT NULL UNIQUE,  -- minuscolo, spazi tolti
  email_verificata_il    TEXT,                  -- NULL finché non confermata
  password               TEXT NOT NULL,         -- stringa PHC, con i parametri dentro
  creato_il              TEXT NOT NULL,
  ultimo_accesso_il      TEXT NOT NULL,         -- il GIORNO, non l'ora (§14.2)
  avviso_inattivita_il   TEXT,                  -- quando è partito l'avviso dei due anni
  generazione            INTEGER NOT NULL DEFAULT 1,   -- sale a ogni azzeramento (§8.4)
  azzerato_il            TEXT,
  data_esame             TEXT,                  -- facoltativa, specifica §2.4
  chiave_locale          TEXT NOT NULL UNIQUE   -- casuale: il nome dell'archivio nel browser (§8.1)
)

riga (
  account_id   INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  uid          TEXT NOT NULL,
  seq          INTEGER NOT NULL UNIQUE,  -- il cursore, assegnato all'arrivo (§2.3)
  tipo         TEXT NOT NULL,            -- _t
  item_id      TEXT,
  ts           TEXT,                     -- verbatim; NULL solo per le righe di tag storiche (§4.2)
  ricevuta_il  TEXT NOT NULL,
  dati         TEXT NOT NULL,            -- la riga intera, JSON, così come è arrivata
  PRIMARY KEY (account_id, uid)
) WITHOUT ROWID

sessione (
  id_hash       BLOB PRIMARY KEY,    -- SHA-256 del token; il token non si conserva
  account_id    INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  creata_il     TEXT NOT NULL,
  usata_il      TEXT NOT NULL,       -- aggiornata al più una volta al giorno
  scade_il      TEXT NOT NULL
)

gettone (                            -- i link che partono per email
  id_hash       BLOB PRIMARY KEY,    -- SHA-256; il gettone non si conserva
  account_id    INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  scopo         TEXT NOT NULL,       -- 'verifica' | 'password' | 'email'
  nuova_email   TEXT,                -- solo per 'email'
  creato_il     TEXT NOT NULL,
  scade_il      TEXT NOT NULL,
  usato_il      TEXT
)

segnali (                            -- i punteggi del gioco, fuori dall'archivio (§4.5 della specifica)
  account_id    INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  modo          TEXT NOT NULL,
  migliore      INTEGER NOT NULL,
  giocate       INTEGER NOT NULL,
  PRIMARY KEY (account_id, modo)
)

registro (                           -- sicurezza e responsabilità, §15
  id            INTEGER PRIMARY KEY,
  quando        TEXT NOT NULL,
  evento        TEXT NOT NULL,
  account_id    INTEGER,             -- senza vincolo: sopravvive alla cancellazione dell'account
  ip            TEXT,                -- tolto dopo 6 mesi; la riga dopo un anno (§15.3)
  dettaglio     TEXT
)
```

Cinque scelte che non si vedono dallo schema.

- **La chiave delle righe è `(account_id, uid)`, non `uid`.** L'`uid` lo genera
  il browser (`site/app.html:1186`: millisecondi in base 36 più otto caratteri
  casuali). Unico dentro un archivio, non fra archivi di persone diverse — e
  soprattutto non **garantito** dal server. Con la chiave composta, nessuno può
  scrivere nell'archivio di un altro indovinando un `uid`.
- **`dati` è la riga intera, verbatim.** La forma delle righe la decide la
  pagina e cresce nel tempo (`chosen`, `sim_uid`, `input_json`, `attempt_uid`…).
  Il server non la ricostruisce dalle colonne: la restituisce com'è arrivata,
  così l'export dal server è lo stesso file di `esporta()` (§7) e un campo nuovo
  del client non richiede una migrazione del server. Le colonne estratte servono
  a indicizzare, alle statistiche e alla scadenza, e basta.
- **Nessun sacco di impostazioni in JSON** accanto all'account. `data_esame` è
  una colonna; quello che Q-ONBOARD deciderà di chiedere diventerà colonne,
  ognuna con la sua validazione. Un campo `impostazioni TEXT` diventerebbe un
  secondo schema che nessuno valida.
- **Nessun user-agent, nessun nome di dispositivo** nelle sessioni. Un elenco
  «i tuoi dispositivi» sarebbe comodo e raccoglierebbe dati che nessuna delle
  tre aspettative dell'ADR-003 chiede.
- **`id` intero e mai esposto.** Il client sa di essere dentro perché il
  cookie funziona, e l'API risponde sempre «il mio account», mai «l'account 42».
  L'unico identificatore che vede è `chiave_locale`, casuale, che serve solo a
  dare un nome all'archivio nel suo browser (§8.1).

---

## 4. Le righe che il server accetta

### 4.1 Una funzione sola: `validaRiga()`, nel motore

**Fatto il 26 settembre 2026.** `site/engine.js` esporta
`validaRiga(riga, { quesiti }) → null | motivo`, e la usano — o la useranno —
**tre** chiamanti: `fondiArchivio()` nel browser (da subito), la conversione di
un file (§11) e il server. Prima `fondiArchivio()` aveva la sua regola in linea —
`uid`, `_t` e `ts` presenti — e il server ne avrebbe avuta un'altra: la forma
del difetto di casa, due conti della stessa cosa in due posti. R-ACC-07 della
specifica.

Il motivo è una frase breve e stabile — «data non valida», «senza uid», «tag
non valido» — e `fondiArchivio()` restituisce ora anche `motivi`,
`{ motivo: quante }`: l'import può dire **perché** ha scartato, non solo quante.
`quesiti` è l'insieme degli id della banca: se c'è, un `item_id` inesistente è
rifiutato; la pagina oggi non lo passa, il server sì.

**Le regole sono state misurate prima di fissarle**, sull'archivio vero del
progetto di preparazione (2.341 righe: 2.100 quiz, 52 carteggio, 29 prove, 160
tag; lette sulla macchina dove stanno, non copiate). Hanno cambiato una regola:
**135 righe hanno la data in UTC con la `Z`**, scritte prima della 0.4.5, e
«con offset» vuol dire anche quella. Poi `validaRiga()` è stata eseguita su
tutte e 2.341, con la banca accanto: **2.341 accettate, zero scarti**.

| Campo | Regola |
|---|---|
| `uid` | stringa, 1–64 caratteri (nell'archivio vero: tutte stringhe, da 17) |
| `_t` | uno di `q c t s g` |
| `ts` | obbligatorio salvo per `g` (§4.2), e se c'è dev'essere una data; ISO 8601 **con `Z` o `±hh:mm`** e `Date.parse` finito. Senza offset si rifiuta: un'ora senza fuso non dice quando è |
| `item_id` | obbligatorio per `q c t`; con `quesiti`, esistente nella banca — la banca è immutabile, quindi un id sconosciuto è un sintomo |
| `g` | `attempt_uid` presente e `tag` uno di `N L C` (nell'archivio vero: 139, 20, 1) |
| la riga intera | ≤ 4 KiB serializzata: il carteggio porta testo libero in `input_json`; la più grande misurata pesa 241 byte |
| campi sconosciuti | **ammessi e conservati**: la regola 2 del §1 vale anche per quello che il server non capisce |

**Cambiare `fondiArchivio()` cambia che cosa scarta, quindi prima si sono
elencati i chiamanti** (regola di `AGENTS.md`): uno solo, `importa()` in
`app.html`, che legge `nuove`, `gia` e `scartate` e non tocca altro. Con la regola
nuova scarta di meno (le righe di tag, §4.2) e di più (`ts` che non è una data,
`ts` senza offset, `uid` non stringa); sull'archivio vero la differenza è
soltanto la prima. `motivi` è un campo in più: la pagina può cominciare a
mostrarlo quando vuole, senza che niente si rompa prima.

### 4.2 Due difetti trovati misurando, che vanno chiusi prima

**Le righe dei tag N/L/C non hanno `ts`, e ogni import le scartava.**
`app.html:4319` scrive `{ _t: 'g', uid, attempt_uid, tag }` e basta.
`fondiArchivio()` rifiutava ogni riga senza `ts`. Misurato: un file con una
risposta e il suo tag dava `nuove: 1, scartate: 1`. **Chiuso nel motore il 26
settembre**: `validaRiga()` accetta `g` senza data, e il test che lo tiene fermo
era rosso prima della correzione. Nell'archivio vero erano 160 righe: chi avesse
esportato e reimportato quella preparazione le avrebbe perse tutte.

**Ritaggare cancella la riga vecchia.** `app.html:4316-4318` toglie le righe di
tag dello stesso tentativo con `ARCH.cancella()` prima di scrivere la nuova. È
l'unico punto in cui l'archivio **non** è append-only. Con l'unione per `uid`
la riga cancellata su un dispositivo resta sul server e torna indietro alla
sincronia successiva: due tag per lo stesso tentativo, nessun errore.

**Proposto, per `ui/*` e prima del client degli account:** le righe di tag
nascono con `ts`, ritaggare **aggiunge** una riga e non cancella niente, e chi
legge prende l'ultima per tentativo. `validaRiga()` continuerà ad accettare `g`
senza `ts`, perché negli archivi di oggi ce ne sono; il server non le ordina mai
per `ts`.

---

## 5. La password e l'hashing

### 5.1 L'algoritmo — Proposto

**Argon2id, `m = 19456` (19 MiB), `t = 2`, `p = 1`**: una delle cinque
configurazioni equivalenti della cheat sheet OWASP sul salvataggio delle
password, consultata oggi. Sale di 16 byte casuali per password, uscita di 32,
tutto nella stringa PHC:

```
$argon2id$v=19$m=19456,t=2,p=1$<sale>$<hash>
```

Misurato sul Mac con `crypto.argon2Sync` di Node 25.3:

| Configurazione | ms |
|---|---:|
| Argon2id m=19456 t=2 p=1 | 27 |
| Argon2id m=47104 t=1 p=1 | 34 |
| Argon2id m=65536 t=3 p=1 | 148 |
| scrypt N=2¹⁵ r=8 p=1 | 47 |
| scrypt N=2¹⁶ r=8 p=1 | 95 |
| scrypt N=2¹⁷ r=8 p=1 | 191 |

Sulla macchina Scaleway sarà più lento: **da misurare** lì, e i parametri si
alzano finché un accesso resta sotto i 250 ms. Il ripiego, se `crypto.argon2`
non ci fosse nella versione di Node installata, è scrypt `N=2¹⁷, r=8, p=1`,
l'altra riga OWASP.

**I parametri stanno nella stringa**, quindi alzarli non richiede una
migrazione: all'accesso riuscito, se la stringa porta parametri vecchi, si
ricalcola con quelli nuovi.

**Niente pepe** (un segreto aggiunto a tutte le password): protegge solo se il
database esce e il segreto no, e aggiunge una chiave da custodire e da non
perdere, perché perderla vuol dire che nessuno entra più. Da riconsiderare solo
se il database finisse su una macchina diversa da quella del processo.

**19 MiB per ogni accesso in corso** sono il modo più semplice per esaurire la
memoria di una macchina piccola: al massimo **due** calcoli insieme, gli altri
in coda. Il limite di frequenza (§6.5) fa il resto.

### 5.2 Le regole sulla password

**NIST SP 800-63B-4**, letto oggi: una password usata da sola **deve** essere
lunga almeno **15 caratteri**; il massimo ammesso deve essere almeno 64;
**nessuna regola di composizione** (maiuscole, cifre, simboli); e va confrontata
con un elenco di password comuni o compromesse.

**Proposto:** 15 caratteri, massimo 256 (oltre, il calcolo diventa un modo di
consumare CPU), nessuna regola di composizione, nessuna scadenza periodica, e un
elenco locale delle password più comuni sul server. La schermata suggerisce una
frase — «tre o quattro parole» — invece di chiedere simboli.

**Deciso il 26 settembre 2026, dall'autore:** 15 caratteri, come NIST. È più
di quello a cui chi arriva è abituato, e per questo la schermata suggerisce una
frase invece di una parola. R-ACC-10 della specifica.

**Aperto — una misura e poi l'autore: l'elenco.** Deve essere **locale**: il
servizio più usato per il controllo delle password compromesse gira su
Cloudflare e riceverebbe un pezzo dell'hash di ogni password scelta. Un file di
password comuni è materiale di terzi, quindi licenza e provenienza vanno
dichiarate nel README, e `strumenti/controlla.py` deve continuare a fallire su
quello che non è dichiarato.

### 5.3 Non dire chi è iscritto

- **Accesso sbagliato**: un messaggio solo, «email o password non corrette», e
  per un'email che non esiste si calcola comunque un hash, così la risposta
  impiega lo stesso tempo.
- **Registrazione con un'email già iscritta**: la schermata dice la stessa cosa
  di sempre — «ti abbiamo scritto» — e la mail dice «hai già un account; se hai
  dimenticato la password, eccola da reimpostare». Solo il proprietario
  dell'indirizzo lo scopre.
- **Password dimenticata**: sempre `202`, sempre «se l'indirizzo è iscritto, ti
  è arrivata una mail».

---

## 6. La sessione

### 6.1 Il cookie — Proposto

```
Set-Cookie: __Host-rg=<32 byte casuali, base64url>; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=5184000
```

- **Opaco**, non un JWT: la sessione vive in una riga della tabella `sessione`,
  quindi si revoca cancellando la riga. Il server conserva l'**hash** del
  token: chi legge il database non trova sessioni da usare.
- **`__Host-`**: il browser lo accetta solo se `Secure`, `Path=/` e senza
  `Domain` — cioè legato a `api.rottagiusta.it` e a nessun altro sottodominio.
- **`SameSite=Strict` funziona anche fra le due origini**, ed è il punto che
  rende possibile un'origine separata: `rottagiusta.it` e `api.rottagiusta.it`
  sono origini diverse ma **lo stesso sito** (stesso dominio registrabile), e il
  cookie viaggia con le `fetch` fatte dalla pagina con
  `credentials: 'include'`. Da nessun altro sito viaggia.
- **Unico cookie** dell'account, tecnico: nessun banner (ADR-003).

**Da misurare, ed è Q-PROVE:** che Safari tratti `api.rottagiusta.it` come
stesso sito anche con la prevenzione del tracciamento attiva. È documentato, non
verificato qui.

### 6.2 Quanto dura — Proposto

**60 giorni senza uso**, rinnovati a ogni richiesta (al più una scrittura al
giorno), **e un anno al massimo** dalla creazione. Una preparazione dura
settimane e si fa soprattutto dal telefono: chiedere la password ogni giorno
spingerebbe verso password peggiori. L'anno al massimo serve a non avere
sessioni eterne su dispositivi dimenticati.

### 6.3 Che cosa la chiude

| Evento | Sessioni |
|---|---|
| «Esci» | quella corrente |
| «Esci da tutti i dispositivi» | tutte |
| Password cambiata o reimpostata | tutte **tranne** quella da cui si è cambiata; con il reimpostare da email, tutte |
| Email cambiata | nessuna; ma all'indirizzo vecchio parte un avviso |
| Account cancellato | tutte, con l'account |

### 6.4 CSRF, e perché non serve un token apposta

Tre difese che si sommano, nessuna nuova: il cookie `SameSite=Strict`; il
server **rifiuta ogni richiesta che cambia qualcosa se l'intestazione `Origin`
non è esattamente `https://rottagiusta.it`**; e il corpo è sempre
`application/json`, che obbliga il browser a un preflight che il CORS del §7.3
non concede a nessun'altra origine.

### 6.5 I limiti di frequenza — Proposto

In memoria, non nel database: si perdono al riavvio, ed è accettabile.

| Che cosa | Limite |
|---|---|
| Accessi falliti per account | dal quinto, un'attesa che raddoppia fino a 15 minuti — **mai un blocco**: un blocco è un modo di chiudere fuori il proprietario |
| Accessi per indirizzo IP | 30 all'ora |
| Registrazioni e mail di reimpostazione per IP | 5 all'ora |
| Mail per indirizzo di destinazione | 3 all'ora, 10 al giorno: nessuno usa il sito per tempestare una casella altrui |
| Richieste complessive per sessione | 600 all'ora |

---

## 7. L'API

JSON dentro e fuori, sotto `/v1`. Ogni errore è
`{ "errore": "<codice>", "messaggio": "<che cosa è successo e che cosa fare>" }`:
il principio del §8 della specifica — un errore è un'informazione più un modo di
uscirne — vale anche per chi legge la risposta in console.

### 7.1 L'account

| Rotta | Che cosa | Risposte |
|---|---|---|
| `POST /v1/registrazione` `{email, password}` | crea l'account **non verificato**, apre la sessione, spedisce la mail (§9) | `201` + cookie; `202` se l'email era già iscritta, con la stessa forma (§5.3); `422` password che non rispetta il §5.2, col perché; `503` se la mail non è partita (§9.3) |
| `POST /v1/accesso` `{email, password}` | apre la sessione | `200` + cookie; `401` |
| `POST /v1/uscita` | chiude questa sessione | `204` |
| `POST /v1/uscita/ovunque` | chiude tutte | `204` |
| `GET /v1/io` | chi sono | `{email, verificata, scade_se_non_verificata, data_esame, generazione, chiave_locale, righe, ultima_seq}`; `401` |
| `POST /v1/verifica` `{gettone}` | conferma l'email | `200`; `410` gettone scaduto o usato |
| `POST /v1/verifica/rinvia` | nuova mail di verifica | `202` |
| `POST /v1/password/dimenticata` `{email}` | mail di reimpostazione | sempre `202` |
| `POST /v1/password/nuova` `{gettone, password}` | reimposta | `200`; `410` |
| `POST /v1/password/cambia` `{attuale, nuova}` | cambia | `200`; `401` |
| `POST /v1/email/cambia` `{password, nuova}` | mail di conferma al nuovo indirizzo, avviso al vecchio | `202` |
| `PUT /v1/profilo` `{data_esame, segnali}` | onboarding e impostazioni (§13) | `200` |
| `POST /v1/azzera` `{password}` | cancella le righe, alza la generazione (§8.4) | `200` con la generazione nuova |
| `DELETE /v1/account` `{password}` | cancella tutto, adesso (§14.1) | `204` |

### 7.2 Le righe

| Rotta | Che cosa | Risposte |
|---|---|---|
| `POST /v1/righe` `{generazione, righe: [...]}` | aggiunge, per `uid` | `200 {nuove: [uid], gia: [uid], scartate: [{uid, motivo}], ultima_seq}`; `409` generazione vecchia; `413` oltre 2.000 righe o 2 MiB |
| `GET /v1/righe?dopo=<seq>` | le righe arrivate dopo il cursore, al più 5.000 | `200 {righe, ultima_seq, altre: bool}` |
| `GET /v1/esporta` | **il file dei progressi**, nella forma di `esporta()` | `200`, `Content-Disposition: attachment` |

**`/v1/righe` risponde con gli `uid`, non con i conteggi soli.** I conteggi
sono quello che la schermata scrive; gli `uid` sono quello che serve al client
per togliere dalla coda esattamente le righe accolte (regola 3). Una risposta
con i soli numeri è la forma che nella 0.4.6 ha fatto sparire risposte.

**`/v1/esporta` è la portabilità dell'art. 20 senza una riga di codice nuovo**
dal lato di chi riceve: il file si ricarica con `importa()`, identico a oggi.
Si scarica dal server, non da `S.archivio`, e questo chiude per chi ha un
account il difetto aperto dalla 0.19.2 — con due schede aperte l'export scriveva
95 righe su 101.

### 7.3 CORS

Quello di `recupero-progetto.md` §5, con i cookie al posto di `Authorization`:

```
Access-Control-Allow-Origin: https://rottagiusta.it
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
Vary: Origin
```

`open-patente-nautica.pages.dev` resta fuori, per la ragione già scritta lì.

### 7.4 In quale pagina l'API esiste

**Proposto:** la pagina ricava l'indirizzo dell'API dal proprio. Su
`rottagiusta.it`, `https://api.rottagiusta.it`; in locale, il server di sviluppo
(§16.3); **altrove, nessuno** — e la pagina lo dice invece di mostrare un modulo
di accesso che fallirà. È il caso di `.pages.dev` finché resta acceso, ed è lo
stesso rilevamento che oggi accende l'avviso del trasloco (R-STA-09).

---

## 8. La sincronia delle righe

### 8.1 Nel browser, per chi ha un account — Proposto

- **Un database IndexedDB per account**, `rg-account-<chiave>`, con `<chiave>`
  la `chiave_locale` che `GET /v1/io` restituisce: casuale, fissata alla
  creazione dell'account e buona solo a questo. Non l'`id`, che non si espone
  (§3); non un hash dell'email, che cambierebbe con l'indirizzo e lascerebbe
  l'archivio locale sotto un nome che nessuno cerca più. Mai
  `open-patente-nautica`, che resta l'archivio di prima degli account ed è
  oggetto del §12.
- **Perché uno per account e non uno solo:** su un dispositivo condiviso, se B
  entra dove A è appena uscito e trova le righe di A nell'archivio, la prima
  sincronia le carica nell'account di B. Unione per `uid`, nessun conflitto,
  nessun errore — e due persone mescolate per sempre.
- Ogni riga porta in locale un segno **«da inviare»**, che si toglie solo quando
  il suo `uid` torna in `nuove` o in `gia`.
- Le righe **scartate** restano, con il motivo, e compaiono nella scheda
  Archivio di Info e sul pallino ambra: non si ritentano all'infinito in
  silenzio e non si buttano.

### 8.2 Quando

- **Invio:** dopo ogni risposta (con un breve ritardo che raccoglie quelle
  vicine), al ritorno della rete, all'apertura, prima dell'uscita.
- **Ricezione:** all'apertura e dopo ogni invio, con `?dopo=<ultima_seq>`
  finché `altre` è vero. Le righe ricevute entrano con `put` per `uid`:
  riceverne una che si ha già non cambia niente.
- **Poi `ripiega()`.** Lo specchio si ricalcola, sempre in locale.

**Offline** tutto funziona come oggi, sull'archivio del dispositivo. La coda
cresce e parte al ritorno della rete.

### 8.3 Due schede

Inviano le stesse righe due volte: il server le mette in `gia` la seconda.
Ricevono le stesse righe due volte: `put` per `uid`. L'unione è idempotente, e
due schede non possono farle danni.

### 8.4 La generazione: perché un azzeramento resti un azzeramento

`account.generazione` parte da 1 e sale di uno a ogni «azzera i progressi». Il
client la ricorda accanto all'archivio e la manda con ogni invio.

Un invio con una generazione vecchia riceve `409` con la generazione attuale e
la data dell'azzeramento. Il client **non** rimanda le righe e **non** le
butta: dice «il 12 ottobre hai azzerato i progressi da un altro dispositivo; qui
ci sono 37 risposte di prima che non sono mai state salvate» e offre
**scaricale** o **scartale**. Solo dopo la scelta svuota l'archivio locale e
riceve dall'inizio.

Senza la generazione, un telefono rimasto in un cassetto rimanderebbe, alla
prima connessione, tutte le righe cancellate: una cancellazione che non cancella
è anche un problema del GDPR, non solo di interfaccia.

### 8.5 All'uscita

**Proposto:** uscendo, l'archivio locale di quell'account **si cancella**: sta
sul server, e rientrando si riscarica. Il dispositivo condiviso è il caso che
conta, ed è l'ADR-004 a chiederlo.

**Tranne se ci sono righe da inviare.** Allora l'uscita si ferma e dice
«3 risposte non sono ancora sul server: collegati alla rete, o scaricale», con
i due pulsanti. Un'uscita che le cancellasse sarebbe una perdita scoperta dopo.

Lo stesso vale quando il server risponde `401` perché la sessione è scaduta o
l'account è stato cancellato da un altro dispositivo: le righe da inviare non
si toccano finché chi studia non ha scelto.

---

## 9. La verifica dell'email

### 9.1 I gettoni

32 byte casuali, in base64url nel link, **SHA-256** nel database. Monouso.
Validità: **24 ore** per la verifica e il cambio d'indirizzo — il limite di
NIST SP 800-63A-4 §3.8 per un codice di conferma mandato a un indirizzo email;
la prima stesura diceva 48, che è il predefinito di Discourse e non una norma —
e **1 ora** per la reimpostazione della password. Un link scaduto non è un
vicolo cieco: «rimandami la mail» è sempre a un tocco, e l'account intanto
funziona (§9.6). Un gettone nuovo dello stesso scopo annulla i
precedenti.

### 9.2 Il link

```
https://rottagiusta.it/app#verifica=<gettone>
https://rottagiusta.it/app#password=<gettone>
```

**Nel frammento, dopo `#`, e non nella query.** Il frammento non parte mai verso
il server che serve la pagina: statichost.eu non lo vede e non lo scrive in
nessun log. La pagina lo legge, lo manda con `POST` all'API, e **lo toglie
dall'indirizzo** con `history.replaceState` prima di fare qualunque altra cosa,
così non resta nella cronologia né in una cattura di schermo condivisa.
`/app` è nel guscio: il link si apre anche con la rete debole, e la conferma
parte appena c'è.

### 9.3 Una mail che non parte si dice

Scaleway Transactional Email risponde a ogni richiesta di invio. **Se non
accetta la mail, la registrazione risponde `503`** e la schermata dice «non
siamo riusciti a spedire la mail di conferma: riprova fra qualche minuto» —
l'account esiste, la sessione pure, niente è perso. Un «ti abbiamo scritto» con
la mail mai partita è il guasto muto nella sua forma più ordinaria.

**Il tetto gratuito dichiarato dall'ADR-003 è di 300 mail al mese**, e le spende
tutto: verifiche, reimpostazioni, avvisi dei due anni. Si conta, il conto sta
nella diagnostica del titolare (§15), e il superamento è un `503` dichiarato,
non una mail che sparisce.

### 9.4 Il mittente, e la posta che c'è già

Misurato oggi sul dominio:

```
rottagiusta.it          TXT  "v=spf1 include:_spf-eu.ionos.com ~all"
rottagiusta.it          MX   mx00.ionos.it, mx01.ionos.it
_dmarc.rottagiusta.it   → dmarc.ionos.it   "v=DMARC1; p=none;"
```

Il dominio ha già una posta, su IONOS, e **un SPF solo**. Aggiungere un secondo
record SPF per Scaleway accanto a questo invaliderebbe entrambi (due record SPF
sono un errore permanente per chi riceve), cioè romperebbe **la posta
dell'autore**, in silenzio, per aggiungere quella del sito.

**Proposto:** il sito spedisce da un sottodominio suo,
`noreply@posta.rottagiusta.it`, con SPF e DKIM su `posta.` soltanto. Il record
dell'apice non si tocca. L'allineamento DMARC regge sul sottodominio, e la
politica `p=none` si eredita dall'apice. I nomi esatti dei record di Scaleway
sono **da misurare** nel pannello.

### 9.5 Le mail

Testo semplice più un HTML minimo, **nessun pixel di tracciamento e nessun
link riscritto** per contare i clic: se il servizio lo offre, spento, e
verificato leggendo il sorgente della mail arrivata. Nessuna mail contiene dati
di studio. Ogni mail dice perché è arrivata e che cosa fare se non l'hai chiesta.

La schermata dopo l'invio nomina il mittente e dice di guardare nello spam dopo
cinque minuti: è il modo in cui il flusso di reimpostazione «fallisce in
silenzio», scritto dall'ADR-002 fra le ragioni contro gli account, e non si
toglie — si dichiara.

### 9.6 Prima della conferma — la domanda dell'ADR-004

**Proposto:** l'account non confermato **funziona**: salva, sincronizza, mostra
i Progressi. Chiedere la conferma prima di salvare vorrebbe dire tenere le
risposte della pagina aperta in bilico dietro una mail che magari è nello spam,
cioè il momento peggiore per perderle.

Due limiti, entrambi dichiarati in schermata dal primo momento:

- **Sette giorni.** Un account non confermato entro sette giorni si cancella,
  con le sue righe. La schermata dice la data, e la ripete finché la conferma
  non arriva. Protegge chi è iscritto a sua insaputa con un indirizzo non suo, e
  toglie gli account scritti con un refuso, che nessuno potrebbe mai più
  recuperare.

  **Non c'è uno standard**, e l'autore ha chiesto dei riferimenti. NIST regola
  quanto vale il *codice* (24 ore, §9.1), non quanto vive l'account che lo
  aspetta. Due software molto diffusi lo scrivono nel codice: **Mastodon**
  cancella gli utenti non confermati dopo **7 giorni**
  (`UNCONFIRMED_ACCOUNTS_MAX_AGE_DAYS = 7`), **Discourse** dopo **14**
  (`purge_unactivated_users_grace_period_days`). Qui sette, il più corto dei
  due, perché un account non confermato può contenere risposte legate
  all'indirizzo di qualcun altro, e meno a lungo restano meglio è.
  **In attesa della conferma dell'autore.**
- **Niente cambio d'indirizzo** prima della conferma: si corregge l'email solo
  dopo aver dimostrato di possederne una.

**Il caso dell'indirizzo preso da un altro.** Se qualcuno si iscrive con
l'email di X e X, poi, chiede di reimpostare la password: la reimpostazione
conferma l'indirizzo **e** mostra «questo account non era confermato e contiene
42 risposte registrate il 3 ottobre: tienile o cancellale». La scelta è di X,
detta prima.

---

## 10. Registrarsi alla fine di un'attività

È il momento che l'ADR-004 sceglie per raccomandare l'account, ed è l'unico in
cui c'è davvero qualcosa da perdere.

**Proposto:**

1. La pagina ha le risposte dell'attività **in memoria** (`S.archivio`, nel modo
   «pagina» che l'ADR-004 richiede: niente IndexedDB senza account).
2. Registrazione o accesso riusciti → **`POST /v1/righe`** con quelle righe,
   subito, prima di qualunque altra cosa.
3. Solo quando tutti gli `uid` tornano in `nuove` o `gia`: si aprono l'archivio
   dell'account e i Progressi, e la schermata scrive «42 risposte salvate».
4. Finché non tornano, la schermata dice **«non chiudere la pagina: le risposte
   non sono ancora salvate»** e ritenta. Senza rete per registrarsi non si
   arriva nemmeno qui: la registrazione stessa la chiede.

**All'accesso a un account che esiste già**, le righe della pagina salgono lo
stesso — ma con una domanda, non in silenzio: «porta nel tuo account le 42
risposte di adesso?», con il «sì» già scelto. Su un dispositivo condiviso
l'attività appena fatta potrebbe non essere di chi sta entrando.

La conversione e questo passaggio sono **la stessa porta**: `fondiArchivio()`
nel browser, `/v1/righe` sul server, `validaRiga()` in entrambi.

---

## 11. La conversione di un file esportato

La terza aspettativa dell'ADR-003: chi ha già studiato porta il proprio file.

**Proposto:** da registrati, «carica un file di progressi» in Info.

- Il file si legge **nel browser**, come oggi `importa()`: `righe` e `segPunti`.
  Il campo `app` non si guarda — oggi `importa()` non lo legge, e i file
  scaricati prima della 0.20.0 dicono ancora `open-patente-nautica`.
- Le righe partono a **lotti da 2.000**, ognuno idempotente. Un file da 30.000
  risposte sono 15 richieste, con l'avanzamento in schermata; un lotto fallito
  si ritenta, e un lotto ripetuto finisce tutto in `gia`.
- Alla fine **un solo** riepilogo, sommato: «2.087 nuove · 13 già presenti ·
  0 scartate». Se ce ne sono di scartate, **i motivi**, raggruppati: «12 righe
  senza data». È R-STA-03 con la ragione accanto al numero.
- I punteggi dei Segnali si fondono con il **massimo** per modo, sia `migliore`
  sia `giocate` (§13.2).
- Caricare due volte lo stesso file non fa niente, ed è giusto.

Quello che il server non può sapere: se il file è davvero di chi lo carica. Il
file non ha un proprietario scritto dentro, e inventarne uno ora non
proteggerebbe i file che esistono già. Lo si dichiara nell'informativa, come
responsabilità di chi carica.

---

## 12. Chi ha già un archivio nel browser — la condizione 4

«Un archivio che esiste già non sparisce in silenzio.» Il *come* è lasciato a
questo documento.

### 12.1 Che cosa c'è da trovare

L'archivio di prima può essere in **due** posti, e il passaggio li guarda
entrambi: il database IndexedDB `open-patente-nautica`, oppure la chiave
`localStorage` `pn.archivio`, dove l'app ripiega quando IndexedDB non si apre
(`app.html:1261`). Guardarne uno solo lascerebbe indietro chi usa Safari in
navigazione privata — cioè esattamente chi ha già un archivio fragile.

### 12.2 Proposto

- Dalla versione con gli account, quell'archivio **non si scrive più** e **non
  alimenta più i Progressi** di chi non ha un account: farlo sarebbe la variante
  «risposte nel browser, Progressi senza account» che l'ADR-004 ha scartato.
- **Si legge per due cose soltanto**: contarne le righe e portarle altrove.
- Finché contiene righe non portate, **il primo stato della Rotta** è un avviso,
  sul modello di quello del trasloco (R-STA-09): «In questo browser ci sono 2.087
  risposte salvate prima degli account. Da questa versione, senza account non si
  salva più niente. Portale nel tuo account, oppure scaricale.» Due pulsanti:
  **Registrati o entra e portale** · **Scarica il file**. «Più tardi» nasconde
  l'avviso per la pagina aperta, non per sempre.
- Portarle è il §11 con l'archivio al posto del file: lotti, conteggi, motivi.
  Si leggono **da IndexedDB**, non da `S.archivio` — per non ripetere il difetto
  delle due schede della 0.19.2.
- **Dopo il trasferimento** l'app scrive nel `localStorage` un segno —
  quante righe, verso quale account (la chiave locale del §8.1), in che data —
  e l'avviso diventa una riga in Info: «2.087 risposte portate nel tuo account il
  3 novembre». Il segno si scrive solo se il server ha confermato **tutti** gli
  `uid`.
- **Il database vecchio non si cancella da solo.** Dopo il trasferimento, Info
  offre «cancella la copia rimasta in questo browser». Cancellarla prima che
  chi studia l'abbia chiesto è il tipo di pulizia che questo progetto non fa.

### 12.3 Sul vecchio indirizzo

Su `open-patente-nautica.pages.dev` l'API non c'è (§7.3, §7.4). Lì la strada è
quella che l'avviso del trasloco indica già: scaricare il file, e caricarlo su
`rottagiusta.it` con il §11. Il redirect di Pages (D2) non prima del 16 ottobre
2026 congela sul vecchio indirizzo la versione che c'è in quel momento
(`docs/migrazione-hosting.md`): se gli account escono dopo, chi è rimasto lì
vede solo l'avviso del trasloco, ed è giusto così.

---

## 13. L'onboarding e le impostazioni

### 13.1 La data d'esame

Colonna `data_esame` dell'account, **facoltativa** (specifica §2.4, R-STA-01).
L'onboarding la chiede dopo la registrazione e si può saltare. Il resto del
contenuto dell'onboarding è **Q-ONBOARD**, e questo progetto non lo anticipa:
quando sarà deciso, ogni domanda nuova diventa una colonna con la sua
validazione (§3).

### 13.2 I punteggi dei Segnali

Con l'account, tabella `segnali`, fusa con il **massimo** sia su `migliore` sia
su `giocate`. Il massimo è idempotente: rimandare gli stessi valori non cambia
niente. Il prezzo, dichiarato: due dispositivi che giocano in parallelo contano
le partite di uno solo. **Oggi `importa()` somma `giocate`**, quindi caricare due
volte lo stesso file raddoppia le partite: è un difetto piccolo, esistente, e il
server non lo eredita.

### 13.3 Senza account — la domanda dell'ADR-004

**Deciso il 26 settembre 2026, dall'autore: senza account nel browser non resta
niente, nemmeno le preferenze.** La proposta era di tenere i filtri, perché non
sono risposte; l'autore ha letto la promessa dell'ADR-004 alla lettera, ed è la
lettura che non ha bisogno di una nota a piè di pagina. R-ACC-09 della
specifica.

| Oggi in `localStorage` | Senza account | Con l'account |
|---|---|---|
| `pn.esame` (la data) | vale per la pagina aperta | sul server |
| `pn.segPunti` | vale per la pagina aperta | sul server |
| `pn.filtro`, `pn.auto`, `pn.segModo`, `pn.diagOrdine`, `pn.prep` | valgono per la pagina aperta | nel dispositivo, legate all'account, e si cancellano all'uscita con l'archivio locale (§8.5) |

Due cose restano nel browser anche senza account, e l'informativa le nomina:
**la cache del service worker**, che contiene il sito e la banca e non una riga
di chi studia — è ciò che fa funzionare l'offline dalla prima visita —, e
**l'archivio di prima degli account**, finché chi l'ha non sceglie che cosa
farne (§12). Nessuna delle due è scritta dalla versione con gli account.

Come per i testi di `site/`, il cambiamento entra **nella stessa versione** degli
account: oggi quelle chiavi sono vere, perché oggi il sito salva nel browser.

---

## 14. La cancellazione

### 14.1 Chiesta da chi studia

`DELETE /v1/account`, con la password: righe, sessioni, gettoni, segnali e
l'account, **in una transazione**, adesso. Prima, la schermata offre di scaricare
il file (`/v1/esporta`). Una mail conferma che è successo. Nel `registro` resta
«account cancellato» con l'`id` interno e la data, **senza l'email** (§15.3).

«Azzera i progressi» è un'altra cosa — toglie le righe e tiene l'account — e
passa dalla generazione (§8.4).

### 14.2 Due anni di inattività — l'ADR-003

- **Attività** è qualunque richiesta con una sessione valida, sincronia
  compresa: chi studia offline e si collega una volta al mese è attivo.
  `ultimo_accesso_il` è il **giorno**, non l'ora: basta a contare due anni e
  dice meno di come si studia.
- Un lavoro quotidiano sul server.
- A **730 − 30 giorni** senza attività parte l'avviso: «il tuo account e le tue
  risposte si cancellano il …; per tenerle basta entrare», con il link al file
  dei progressi da scaricare prima.
- A **730 giorni**, se non c'è stata attività dopo l'avviso, si cancella come al
  §14.1.
- **Una mail d'avviso che rimbalza non ferma la cancellazione.** Non si può fare
  di meglio senza tenere i dati di più, e l'informativa lo dice.

### 14.3 Gli account non confermati

Sette giorni (§9.6), stesso lavoro quotidiano, nessun avviso oltre a quello già
in schermata.

### 14.4 «Deve cancellare davvero» — l'ADR-003

- **`PRAGMA secure_delete = ON`**: SQLite sovrascrive con zeri il contenuto
  cancellato invece di lasciarlo nelle pagine libere del file.
- **Le copie di sicurezza** contengono i dati cancellati finché non scadono:
  30 giorni (§2.5). L'informativa dice «un dato cancellato sparisce dalle copie
  di sicurezza entro 30 giorni», che è vero, invece di «sparisce subito», che
  non lo sarebbe.
- **Il ripristino da una copia** riporterebbe in vita account cancellati dopo
  quella copia. Il `registro` tiene gli `id` degli account cancellati, e il
  ripristino **li ricancella** prima di riaprire il servizio. Fa parte di
  `ripristina --prova`.

---

## 15. Il titolare che legge

L'ADR-003 esiste perché i dati servono leggibili, per il supporto e per le
statistiche. Leggerli è quindi una funzione del prodotto, e ha le sue regole.

### 15.1 Il supporto

**Proposto:** nessuna pagina di amministrazione sul web. Il titolare legge sulla
macchina, con uno strumento a riga di comando — `leggi --email … --motivo "…"` —
che mostra l'account e le sue sessioni ricostruite (`sessioni()` del motore, la
stessa funzione della pagina) e **scrive nel registro** chi ha letto, quando,
quale account e perché. Una lettura che non lascia traccia è una lettura che
nessuno potrà mai rendicontare.

### 15.2 Le statistiche

Query aggregate sulle colonne di `riga` — quante risposte, quali quesiti si
sbagliano di più, quanti account attivi — senza email e senza `id` nell'uscita.
**Mostrarle a chi studia** («questo quesito lo sbaglia il 60 % di chi lo vede»)
rompe il §4.6 della specifica, «il motore non sa niente degli altri utenti», e
richiede soglie e decisioni che qui non ci sono: **Aperto — decide l'autore, in
un documento suo.** Questo progetto si ferma al titolare.

### 15.3 Il registro, e gli indirizzi IP

L'ADR-003: una violazione si notifica entro 72 ore, e accorgersene richiede log.

Il `registro` tiene accessi riusciti e falliti, registrazioni,
reimpostazioni, cambi di password e d'indirizzo, azzeramenti, cancellazioni,
letture del titolare, e le mail rifiutate dal fornitore. **Nessun log di accesso
HTTP** con indirizzi o intestazioni. Mai password, gettoni o cookie, in nessun
log: c'è un test (R-ACC-15, §17).

**Deciso il 26 settembre 2026, su delega dell'autore: l'IP per 6 mesi, l'evento
per un anno.** Il riferimento è la raccomandazione della CNIL sulla
journalisation (delibera n. 2021-122 del 14 ottobre 2021): i log che tracciano
gli accessi a un sistema si conservano **fra sei mesi e un anno**. Qui si prende
il minimo per l'indirizzo, che è il dato più personale della riga, e il massimo
per l'evento senza indirizzo. Sei mesi e non trenta giorni, come diceva la prima
stesura, perché una violazione si scopre spesso tardi, e le 72 ore dell'art. 33
cominciano da quando te ne accorgi: trenta giorni di storia non bastano a capire
da quando qualcuno provava. Le letture del titolare stanno nello stesso registro,
per un anno: il provvedimento del Garante del 27 novembre 2008 sugli amministratori di
sistema chiede di conservarne gli accessi «non meno di sei mesi».

`recupero-progetto.md` proponeva di non tenere affatto gli IP. Lì non c'erano
identità da proteggere da tentativi di accesso; qui ci sono, e senza IP un
attacco a molti account dallo stesso indirizzo non si vede.

L'informativa scrive i due numeri.

---

## 16. Dove vive il codice

`recupero-progetto.md` §8 vale: logica pura in un modulo testabile sotto
`node --test`, il trasporto e le schermate nella pagina. Qui cambiano i nomi e
arriva il server.

### 16.1 Il client

- **`validaRiga()` in `site/engine.js`**, con i suoi test in
  `tests/test_engine.mjs`. È del motore, e può entrare **subito**, prima di ogni
  schermata.
- **La contabilità della coda** — quali righe inviare, che cosa togliere dopo
  una risposta del server, il `409` della generazione — è logica pura e va nel
  motore anch'essa, non in `app.html`, per la ragione di sempre: in `app.html`
  nessun test arriva.
- Il trasporto (`fetch`), l'archivio per account e le schermate stanno in
  `app.html`, sul ramo `ui/*`, dentro una fetta del ridisegno.
- Nessun modulo nuovo in `site/`, quindi nessuna voce nuova nel guscio.

### 16.2 Il server

**Proposto: in questo repo, in `server/`**, e non in un repo a parte: importa
`site/engine.js` con un percorso relativo, e la suite lo prova insieme al motore
che usa. Un repo separato avrebbe una copia di `engine.js`, cioè la seconda
implementazione che il §2.2 esiste per evitare.

Le tre cose che `prossime-sessioni.md` chiede prima della prima riga, e come:

1. **Il territorio.** `server/**` nel territorio `motore`, rivendicato da
   `main`. `territori.yaml` è delle regole: la modifica la fa Claude su `main`,
   nello stesso commit che crea la cartella.
2. **La quinta suite.** `tests/test_server.mjs`, sotto `node --test`: avvia il
   server nello stesso processo su un database temporaneo e lo interroga con
   `fetch`. Così i requisiti del server non sono «scoperti»: si eseguono.
3. **Il backup con il ripristino provato**, §2.5, dentro la stessa suite.

E in più: `strumenti/controlla.py` passa anche su `server/`, e impara a fallire
su una chiave dell'API di Scaleway scritta in un file. I segreti stanno nella
macchina, mai nel repo.

### 16.3 In locale

`strumenti/serve.py` serve il sito come oggi; il server gira accanto su un'altra
porta dello stesso `localhost`. Le due porte sono lo stesso sito, quindi il
cookie viaggia come in produzione. **Da misurare:** che il prefisso `__Host-` e
`Secure` reggano su `http://localhost` nei tre browser — Chrome lo documenta, per
Safari non è detto.

---

## 17. I requisiti

Si aggiungono a R-ACC-01…06. **Quattro sono entrati nel §9.9 della specifica il
26 settembre 2026**, con le decisioni dell'autore e con `validaRiga()`:

| ID | Requisito | Controllo |
|---|---|---|
| R-ACC-07 | Una riga si accetta o si rifiuta con una regola sola, `validaRiga()`, e il rifiuto dice il motivo | `test_engine.mjs` — la metà del browser; la metà del server si aggiunge con `test_server.mjs` |
| R-ACC-08 | Le righe dei tag N/L/C, che nascono senza data, si importano | `test_engine.mjs` — l'import; che ritaggare non cancelli righe è della pagina, e resta scoperto |
| R-ACC-09 | Senza account la pagina non conserva niente nel browser, nemmeno le preferenze | scoperto — è la pagina |
| R-ACC-10 | Una password più corta di 15 caratteri è rifiutata, senza regole di composizione | scoperto — il server non c'è ancora |

Gli altri sono **proposti** ed entrano nella specifica con il codice che li
controlla. Con il server nella suite, la maggior parte smette di essere
scoperta.

| ID | Requisito | Controllo proposto |
|---|---|---|
| R-ACC-11 | Una riga accolta torna dal server byte per byte com'era, campi sconosciuti compresi | `test_server.mjs` |
| R-ACC-12 | La risposta a un invio nomina gli `uid` accolti, già presenti e scartati, e il client toglie dalla coda solo i primi due | `test_engine.mjs` sulla contabilità della coda |
| R-ACC-13 | Una riga arrivata tardi con un `ts` vecchio compare nella ricezione successiva | `test_server.mjs` |
| R-ACC-14 | Dopo un azzeramento, un invio con la generazione vecchia è rifiutato e le sue righe non rientrano | `test_server.mjs` |
| R-ACC-15 | Nessuna password, gettone o cookie compare nel database in chiaro né nel registro | `test_server.mjs` |
| R-ACC-16 | L'accesso con un'email inesistente e con una password sbagliata danno la stessa risposta | `test_server.mjs` |
| R-ACC-17 | L'export dal server si ricarica con `importa()` e dà le stesse righe | `test_server.mjs` più `test_engine.mjs` |
| R-ACC-18 | Una cancellazione toglie tutte le righe dell'account, e un ripristino da una copia precedente non le riporta | `test_server.mjs`, con `ripristina --prova` |
| R-ACC-19 | Una copia di sicurezza si ripristina e ha le stesse righe dell'originale | `test_server.mjs` |
| R-ACC-20 | Una mail che il fornitore non accetta produce un errore dichiarato, mai «ti abbiamo scritto» | `test_server.mjs`, con il fornitore finto che rifiuta |
| R-ACC-21 | All'uscita, righe non inviate fermano la cancellazione dell'archivio locale | scoperto — è la pagina |
| R-ACC-22 | Un archivio di prima degli account, in IndexedDB o in `pn.archivio`, produce l'avviso finché non è portato o scaricato | scoperto — è la pagina, e va provato su un browser con un archivio vero (è R-ACC-05 reso concreto) |

---

## 18. Che cosa diventa falso — le aggiunte

L'elenco di `site/` è in `docs/prossime-sessioni.md` §1, più completo di
`recupero-progetto.md` §9, e vale. Mancano i testi che un **server** — non un
account — rende falsi, e stanno fuori da `site/`:

| File | Che cosa dice | Territorio |
|---|---|---|
| `AGENTS.md`, «Comandi» | «Non c'è nessun servizio da riavviare, nessuna macchina remota, nessun database.» | regole |
| `AGENTS.md`, «Architettura» | «`site/` è l'unica cosa pubblicata» — resta vero per statichost.eu, ma `server/` gira altrove e va nominato | regole |
| `AGENTS.md` e `docs/specifica.md` §11 | l'elenco dei comandi di test, senza la quinta suite | regole, motore |
| `docs/specifica.md` §3 | il titolo, «non c'è un backend» — già in §2.5 della specifica fra le parti da riscrivere | motore |
| `README.md`, «Come funziona» e «Struttura del repo» | nessun backend; nessuna cartella `server/` | regole |

Come per il resto: **nella stessa versione in cui il server risponde ai
visitatori**, non prima.

---

## 19. Che cosa non è misurato

Vale `recupero-progetto.md` §10, per la parte che riguarda ancora il prodotto
(nessuna prova su un dispositivo Apple). In più:

- **Tutto ciò che è di Scaleway**, perché l'account non c'è ancora: il tempo di
  Argon2id sulla macchina scelta; i record DNS esatti di Transactional Email per
  `posta.rottagiusta.it`; che il servizio non riscriva i link né aggiunga pixel;
  il certificato per `api.rottagiusta.it`; la copia verso `nl-ams`.
- **Le regole di `validaRiga()` su archivi diversi da quello dell'autore.**
  Misurate su uno solo (§4.1): 2.341 righe su 2.341. Un archivio che ha
  attraversato versioni diverse, o importato da altrove, può avere forme che
  quello non ha; per questo il rifiuto dice il motivo invece di un numero.
- **Il cookie fra `rottagiusta.it` e `api.rottagiusta.it` su Safari**, con la
  prevenzione del tracciamento attiva (§6.1). È Q-PROVE.
- **Il peso reale sul server**: i 347 byte a riga del §2.4 vengono da righe
  sintetiche.
- **`crypto.argon2` nella versione di Node che girerà sulla macchina**:
  misurato presente in Node 25.3 sul Mac, non verificato altrove.

---

## 20. Aperto, con chi decide

| Questione | Decide | Proposta |
|---|---|---|
| ~~Macchina con SQLite, o container con PostgreSQL gestito~~ | — | **deciso** su delega: macchina, SQLite, Node senza dipendenze (§2.2) |
| ~~Lunghezza minima della password~~ | — | **deciso**: 15, come NIST (§5.2) |
| Elenco delle password comuni: quale, con che licenza | una misura, poi l'autore | un file dichiarato nel README (§5.2) |
| Durata della sessione | l'autore | 60 giorni senza uso, un anno al massimo (§6.2) |
| Account non confermato: quanto vive | l'autore, sui riferimenti | sette giorni, funzionante — Mastodon 7, Discourse 14, nessuno standard (§9.6) |
| ~~Preferenze dell'interfaccia senza account~~ | — | **deciso**: non si conservano nemmeno quelle (§13.3) |
| ~~IP nel registro di sicurezza~~ | — | **deciso** su delega: 6 mesi l'IP, un anno l'evento, dalla CNIL (§15.3) |
| Statistiche mostrate a chi studia | l'autore, in un documento suo | fuori da qui (§15.2) |
| Cosa chiede l'onboarding oltre alla data | l'autore | Q-ONBOARD, specifica §10 |
| Chiudere il difetto dei tag che resta (§4.2): ritaggare cancella, e i tag nascono senza data | `ui/*` | prima del client degli account; l'import li accetta già |

---

## Registro

- **25 settembre 2026 — prima stesura.** Dall'ADR-003 e dall'ADR-004, sulle
  sezioni 5, 8, 9 e 10 di `recupero-progetto.md`, senza l'account Scaleway.
  Cinque misure l'hanno orientata: l'HSTS con `includeSubDomains` sul dominio,
  che rende `api.` HTTPS dal primo giorno; il record SPF unico della posta
  IONOS, che non si può affiancare e porta al sottodominio `posta.`; Argon2id
  presente in Node 25.3 e a 27 ms con i parametri OWASP; 347 byte a riga in
  SQLite; e **le righe dei tag N/L/C, che non hanno `ts` e che ogni import
  scarta** — misurato con `fondiArchivio()`: una risposta e il suo tag danno
  una riga nuova e una scartata. Insieme al tag che ritaggando si cancella, è
  l'unico punto in cui l'archivio non è append-only, ed è il primo che l'unione
  per `uid` avrebbe tradito.
- **26 settembre 2026 — `validaRiga()` e le decisioni dell'autore.**
  `validaRiga()` è nel motore, con quattro test scritti prima e rossi finché la
  funzione non c'era; provati al contrario cinque volte. Le regole sono state
  misurate sull'archivio vero prima di fissarle: 135 date con la `Z` hanno
  allargato «con offset», e alla fine 2.341 righe su 2.341 accettate. L'import
  accetta ora i tag senza data. Decisi dall'autore i 15 caratteri e le
  preferenze che senza account non restano; decisi su sua delega la macchina
  con SQLite e i tempi del registro, sei mesi l'IP e un anno l'evento, sulla
  CNIL. Il link di conferma passa da 48 a 24 ore, il numero di NIST. Per
  l'account non confermato non c'è uno standard: sette giorni come Mastodon,
  in attesa della conferma dell'autore. I requisiti proposti sono rinumerati
  da R-ACC-11, perché quattro sono entrati nella specifica.
