# Prossime sessioni — la coda, con i prompt

**Aggiornato il 26 settembre 2026.** Territorio neutro. **Penna: la sessione di regia** (sotto, «Come si usa»).

> **Questo file invecchia.** È una coda, non una verità: quando un lavoro è
> fatto, il suo prompt si chiude con l'esito e resta, la riga della coda si
> toglie. Se una riga contraddice un documento di progetto,
> **ha ragione il documento**. I prompt qui sotto sono corti apposta: **puntano,
> non ripetono.** Un prompt che riassume un piano diverge dal piano appena il
> piano cambia — è il difetto che qui dentro è costato tre versioni divergenti
> dello stesso documento.

---

## Dove sta che cosa

**Questo è l'unico file con l'ordine dei lavori e con i prompt.** Gli altri
documenti dicono *che cosa* e *come*, e non portano né una sequenza né un
prompt: se ne trovi uno altrove, è vecchio, e vale questo. Il motivo è lo
stesso della specifica unica: un ordine scritto in due posti diverge, ed è
successo — la tabella delle aree in `prossima-versione.md` §5.1 ha tenuto per
due settimane una numerazione che nessuno seguiva più.

**Le domande aperte, invece, restano dove si decidono**, e qui si puntano:
quelle di prodotto nel §10 della specifica, quelle degli account nel §20 di
`account-progetto.md`. Copiarle qui farebbe due elenchi da tenere allineati.

| Documento | Che cos'è | Penna | Stato |
|---|---|---|---|
| **`docs/prossime-sessioni.md`** | la coda, con i prompt | **la sessione di regia**, su `main` | vivo |
| `docs/specifica.md` | che cosa è il prodotto, i requisiti col loro controllo, le domande aperte (§10) | Claude, su `main` | vivo |
| `docs/filosofia.md` | il perché, e il tono dei testi | Claude, su `main` | vivo |
| `docs/adr/` | le decisioni, una per file | Claude, su `main` | ADR-002 superato, 001/003/004 validi |
| `docs/prossima-versione.md` | il piano del ridisegno in sei aree, e i contratti col motore | neutro | vivo; l'ordine delle aree sta qui sotto |
| `docs/account-progetto.md` | come si fanno gli account; aperte nel §20, non misurate nel §19 | neutro | vivo |
| `docs/area-1-progetto.md` | il progetto dell'area 1 | neutro | **fatto** — resta come modello per le aree successive |
| `docs/decisioni-aperte.md` | i cinque punti sull'esperienza discussi in tre dal 10 settembre | neutro | lo stato di ciascuno sta nel file; non verificato il 26 settembre quali siano ancora aperti |
| `docs/eccezioni-interfaccia.md` | le eccezioni che i test dell'interfaccia leggono | neutro | vivo, lo legge `test_interfaccia.py` |
| `docs/migrazione-hosting.md` | il trasloco su statichost.eu | neutro | resta la fase D, dell'autore |
| `docs/recupero-progetto.md` | il backup con una frase | neutro | **superato** dall'ADR-003; valgono §5, 8, 9, 10 |
| `docs/specifiche-ux.md`, `riscontro-ux.md`, `percorso-ux.md` | come si è arrivati alle decisioni UX | interfaccia | storici, non si aggiornano |
| `docs/motore.md` | puntatore alla specifica | — | storico |

---

## Come si usa: la regia

Dal 26 settembre 2026 la versione con gli account si conduce così, perché è la
modifica più grande del progetto e nessuna informazione deve vivere solo in una
chat.

1. **Una sessione di regia**, Claude su `main`, è **l'unica penna di questo
   file**. Le altre sessioni lo leggono e non lo toccano. È una regola, non un
   controllo: il file è neutro e il `pre-commit` non sa quale sessione scrive.
   Per questo la regia, a ogni resoconto, guarda
   `git log --oneline -- docs/prossime-sessioni.md`: un commit che non è suo è
   un'altra penna, e si dice.
2. **Ogni prompt ha un numero, `P-NN`, e sta nel §6.** L'autore lo copia da
   qui, mai dalla chat della regia: così quello che una sessione ha ricevuto è
   quello che è scritto.
3. **Niente vive solo in un resoconto.** Ogni sessione, prima di chiudere,
   scrive nel repo tutto quello che vale oltre la chat — nel CHANGELOG, nel
   documento del suo lavoro, nel §10 della specifica se è una domanda per
   l'autore. Il resoconto **punta** a quei posti, non li sostituisce.
4. **Il resoconto ha una forma sola**, quella qui sotto. L'autore lo incolla
   nella regia; la regia lo confronta con il repo — i commit esistono, le suite
   danno quei numeri —, chiude il prompt con il suo esito, aggiorna la coda,
   scrive i prompt che il risultato ha sbloccato, e fa un commit.
5. **Le merge dei rami `ui/*` le fa la regia**, con il controllo dei territori
   sul diff del ramo prima (`AGENTS.md`), e poi allinea `ui/main` e
   `ui/vetrina` a `main` perché ChatGPT parta sempre dalla base giusta.
6. **Una sessione di Claude può partire da un pulsante** che la regia propone
   nella sua chat. Il pulsante non ripete il prompt: dice soltanto di copiarlo
   dal §6, così resta uno solo. La sessione che parte così lavora **in un
   worktree suo**, su un ramo che il recinto non rivendica: può toccare solo i
   file neutri e i condivisi, e il suo commit arriva su `main` con la merge
   della regia. Un prompt che tocca `motore` o `regole` — `tests/`,
   `territori.yaml`, `site/engine.js` — non parte da un pulsante: si apre a
   mano, nel checkout principale su `main`. Il §6 dice quale è quale. ChatGPT
   non ha pulsanti: si apre la sua app.

### Il resoconto

Ogni prompt finisce con «Chiudi con il resoconto di docs/prossime-sessioni.md»,
e la sessione risponde con questo blocco, compilato, e con niente altro dopo:

```
RESOCONTO P-NN
Ramo e commit: <ramo> — <hash> <titolo>, uno per riga
Suite: motore <passati>/<totale> · dati <n> · interfaccia <n> · specifica <n>
       (e server, quando esiste)
Fatto: <che cosa, in poche righe>
Non fatto, e perché: <o «niente»>
Trovato: <difetti, sorprese, misure> — e dove sta scritto nel repo
Per l'autore: <decisioni che servono> — e dove sta scritto nel repo
Per la coda: <che cosa cambia nei passi successivi>
Fuori dal repo: <pannelli, macchine, account toccati; o «niente»>
```

Una riga «Trovato» o «Per l'autore» **senza un posto nel repo** è
un'informazione che vive solo in chat, e la regia la rimanda indietro.

---

## La coda, in ordine

| # | Lavoro | Chi | Dove | Aspetta | Prompt |
|---|---|---|---|---|---|
| 10 | Allineare i controlli dei quiz all'area 2 | Claude | `main`, a mano | niente | P-06 |
| 5 | Area 2, Quiz: la realizzazione (il progetto è chiuso) | ChatGPT | `ui/main` | P-06 | P-05 |
| 4a | Il server, pezzo 1: l'account, la password, la sessione, la verifica dell'email | Claude | `main`, a mano | P-06, perché è la stessa cartella | P-09 |
| 4b | Il server, pezzo 2: le righe e la sincronia, con la metà client di R-ACC-24 nel motore | Claude | `main`, a mano | 4a | da scrivere |
| 4c | Il server, pezzo 3: cancellazione, due anni, allarmi al titolare | Claude | `main`, a mano | 4b | da scrivere |
| 6 | Aree 3–6 del ridisegno | ChatGPT | `ui/main` | la precedente | da scrivere |
| 7 | Il client degli account, dentro una fetta del ridisegno | ChatGPT | `ui/main` | 4b | da scrivere |
| 8 | La messa in esercizio del server su Scaleway | Claude e l'autore | `main`, pannelli | 4c, e dal §4: la macchina, le chiavi | da scrivere |
| 9 | **La versione con gli account** — il traguardo | tutti | `main` | 7, 8, e gli adempimenti del §4 | da scrivere |
| — | Decisioni e passi dell'autore | l'autore | — | — | §4 |

**Le due colonne corrono in parallelo**: Claude sul server (non tocca `site/`),
ChatGPT sull'interfaccia. **Adesso è pronto P-06**, e dopo la sua merge P-05 per
ChatGPT e P-09 per Claude possono stare aperti insieme. Tutto quello che tocca
`server/`, `tests/` o la specifica passa dalla cartella principale, una sessione
per volta: è la strettoia della colonna di Claude, e si accetta perché il
recinto la vuole. Il numero di una riga è il suo nome, non la sua posizione:
l'ordine è quello della tabella. Le due colonne si incontrano al punto 7, e il
punto 9 è il giorno in cui gli account arrivano a chi studia.

I prompt «da scrivere» li scrive la regia quando si chiude quello da cui
dipendono, non prima: un prompt scritto in anticipo punta a uno stato che nel
frattempo è cambiato.

## Lo stato al 26 settembre 2026

**Chiuso.** La migrazione a `rottagiusta.it` su statichost.eu (v0.26.0–0.26.2).
`lunghezzaScreening()` nel motore con i suoi test. **ADR-003**: account con email
e password, verifica dell'indirizzo, righe sul server in chiaro, cancellazione
dopo due anni di inattività con avviso. **ADR-004**, lo stesso giorno: l'account
serve per **salvare**, non per usare. Senza account si fanno tutte le prove e
non resta niente, nemmeno nel browser; con l'account si salva, si vedono i
Progressi e si passa da un onboarding. Quattro condizioni fanno parte della
decisione: R-ACC-02…05 nel §9.9 della specifica.

**Il 26 settembre:** `validaRiga()` nel motore, e l'import che non scarta più i
tag; tutte le decisioni del §20 di `account-progetto.md`;
**l'account Scaleway è aperto**. `ui/main` e `ui/vetrina` sono stati allineati a
`main` (8857b79) lo stesso giorno: fino ad allora ChatGPT lavorava su una base
senza ADR-003, ADR-004 e questo file. `main` è avanti su `origin`, e il push
si chiede: quanti commit lo dice `git rev-list --count origin/main..main`, non
questo file — un numero scritto qui invecchia al commit successivo, ed è
successo (erano «undici», misurati quattordici poche ore dopo).

**Superati, e marcati come tali** — non cancellati, perché contengono il
ragionamento su cui le decisioni successive hanno dovuto rispondere:
`docs/adr/ADR-002-…`, la parola «obbligatorio» dell'ADR-003, e
`docs/recupero-progetto.md` (di quest'ultimo restano valide le sezioni 5, 8, 9 e
10).

---

## 1 · I testi di `site/` che gli account renderanno falsi — per `ui/*`

`docs/filosofia.md` e il §2 di `docs/specifica.md` sono riscritti. Restano i
testi che chi studia legge davvero, e sono tutti dell'interfaccia.

**Non si cambiano adesso.** Oggi sono **veri**: il sito pubblicato non ha
account e tiene tutto nel browser. Si cambiano **nella stessa versione** in cui
gli account entrano — un'informativa che descrive un server che non c'è è falsa
quanto una che tace quello che c'è. Le frasi nuove si prendono da
`docs/filosofia.md`, non si reinventano.

**Con l'ADR-004 il sito ha due stati, e ogni testo va letto in tutti e due.**
Senza account non resta niente, quindi quasi ogni frase di oggi sul «tuo
browser» diventa falsa **in entrambi**: per chi prova, perché non si salva più
nemmeno lì; per chi si registra, perché si salva sul server.

Cercato con `grep` sul checkout di `main` il 25 settembre 2026, non ricordato;
i numeri di riga invecchiano, le frasi no.

**La privacy — `site/privacy.html`.** È quella che pesa di più, perché è un
documento con valore giuridico. Va riscritta per i due stati, non ritoccata:

| Riga | Oggi dice | Senza account | Registrato |
|---|---|---|---|
| 8 | `description`: «nessun account, nessun cookie, nessun analytics. Le tue risposte restano nel tuo browser» | falso su «restano nel browser»: non restano | falso su cookie e browser; «nessun analytics» resta vero |
| 42 | «questo sito non sa chi sei. Niente account, niente cookie, niente analytics, niente form da compilare» | vero | falso quasi per intero |
| 44–50 | «Cosa resta nel tuo browser»: le risposte in IndexedDB, «non esiste un server che li riceva»; scarica, ricarica, cancella dalla schermata Info | falso: non resta niente oltre la pagina aperta | falso: le righe stanno sul server, in chiaro, e il titolare le legge per supporto e statistiche |
| 56 | «L'autore di questo sito non riceve quell'indirizzo e non ha log da consultare» | vero | falso per il server degli account: l'ADR-003 chiede log per accorgersi di una violazione |
| 58–59 | «Cosa non c'è»: «Nessun dato personale viene trattato … non c'è un registro dei trattamenti … né una base giuridica … né dati da cancellare» | vero per chi prova | falso per intero, e il paragrafo è formulato per tutti |
| 62 | contatto solo dalle issue pubbliche su GitHub, «non scriverci dati personali» | — | serve un contatto del titolare per esercitare i diritti, e non può essere un canale pubblico |

E quello che l'informativa nuova deve contenere, dall'ADR-003 (§Consequences,
tabella GDPR) e dall'ADR-004: che **senza account** non si tratta niente e non
si conserva niente, nemmeno nel browser; e per chi si registra — titolare e
contatto; che cosa si tratta (email, risposte legate all'account, comprese
quelle della pagina aperta al momento della registrazione, i dati
dell'onboarding come la data d'esame); per che cosa (accesso, supporto,
statistiche); **base giuridica: contratto, art. 6.1.b**; il fornitore del server
come responsabile, e dove stanno i dati; il cookie di sessione, tecnico;
**conservazione: due anni di inattività, con avviso prima**; i diritti —
accesso e portabilità (l'export), cancellazione — e come esercitarli. La
sezione su statichost.eu resta; quella sull'offline va riletta, perché senza
account il service worker tiene in cache il sito ma nessuna risposta.

**La vetrina — `site/index.html`.**

| Riga | Oggi dice | Con gli account |
|---|---|---|
| 7 | `description`: «Gratis, senza account, tutto nel tuo browser» | falso: senza account non resta niente, con l'account sta sul server |
| 12 | `og:description`: «Gratis, senza account, open source» | ambiguo: si prova senza, si salva con |
| 220 | sottotitolo dell'hero: «Gratis, senza account, tutto nel tuo browser» | come riga 7 |
| 238 | pregio «**Senza account** — Le risposte restano nel tuo browser» | falso per intero, ed è una delle tre promesse in prima vista |
| 380 | spunta «Nessun account, nessun cookie, nessun analytics» | falso su account e cookie per chi si registra |
| 381 | spunta «Funziona offline, anche in barca» | vero per provare, anche alla prima visita; per salvare offline serve essere entrati almeno una volta |

**La palestra — `site/app.html`.** Dice le stesse cose, e alcune nel momento in
cui chi studia decide se fidarsi:

| Riga | Oggi dice | Con gli account |
|---|---|---|
| 20, 23 | `og:description` e `description`: «senza account», «Tutto nel tuo browser, nessun account» | come la vetrina |
| 729 | «I progressi restano in questo browser. Non si sincronizzano e possono andare persi» | falso in entrambi gli stati; è il posto naturale di R-ACC-02 — senza account «non resta niente» — e dell'invito a registrarsi |
| 981–982 | «non arrivano a nessun server: non esiste un account e non c'e' niente da recuperare se le perdi» | falso: senza account non c'è niente da perdere perché non si salva; con l'account si recupera |
| 1025, 1613 | «Non serve un account. Le risposte restano in questo browser; puoi scaricarle in un file» — due copie della stessa frase, la seconda riscrive la prima | vero a metà: non serve per provare, serve per salvare |
| 1136 | commento: «Non c'e' un server. Tutto quello che l'app sa di te sta in questo browser» | falso in entrambi gli stati |

**E il lavoro nuovo che l'ADR-004 chiede alla pagina**, oltre ai testi:

- dire senza account che non resta niente, prima di cominciare e alla fine di
  ogni attività (R-ACC-02);
- raccomandare la registrazione alla fine di un'attività, con i vantaggi che
  esistono — il salvataggio, i Progressi, le metriche, l'onboarding — e non a
  ogni schermata (R-ACC-03);
- tutte le attività con riepilogo e revisione anche senza account; Progressi e
  metriche ai soli registrati (R-ACC-04);
- il passaggio di chi ha già un archivio nel browser il giorno del rilascio: nell'account o
  scaricato, mai perso in silenzio (R-ACC-05);
- l'onboarding di chi si registra, con la data d'esame **facoltativa**
  (specifica §2.4); il resto del contenuto è Q-ONBOARD;
- **senza account, niente nel `localStorage`**, nemmeno le preferenze — `pn.filtro`,
  `pn.auto`, `pn.segModo`, `pn.diagOrdine`, `pn.prep`, `pn.esame`, `pn.segPunti`:
  valgono per la pagina aperta (R-ACC-09, deciso dall'autore il 26 settembre;
  `docs/account-progetto.md` §13.3). Con l'account restano nel dispositivo e si
  cancellano all'uscita;
- la schermata di accesso lascia lavorare i gestori di password e il
  riempimento automatico, permette di incollare, e alla scadenza dice «sono
  passati 30 giorni» (P-07; `account-progetto.md` §5.2 e §6.2);
- l'informativa nomina `privacy@rottagiusta.it` come contatto del titolare, la
  Polonia come luogo dei dati e i Paesi Bassi per le copie, e porta i punti del
  §15.4 una volta decisi (P-08).

Il *come* lo decide il progetto di realizzazione, §2.

**Fuori da `site/`, su `main`, nella stessa versione:** `README.md` righe 9–10
e 113 («Niente account, niente registrazione … non arrivano mai a nessuno»), e
`.claude/skills/rotta-giusta/SKILL.md` righe 15 e 18 («Nessun server»). Sono del
territorio `regole`.

## 2 · Il progetto di realizzazione degli account — fatto

È `docs/account-progetto.md`, e le decisioni del suo §20 sono prese tutte,
l'ultima il 26 settembre: l'account non confermato vive sette giorni.
**Restano le misure su Scaleway** del suo §19: l'account è aperto dal 26 settembre,
quindi sono il primo passo della sessione del server (§3-bis).

`validaRiga()` è nel motore dal 26 settembre, misurata sull'archivio vero, e
l'import accetta ora i tag. Resta un lavoro piccolo, **prima** del client degli
account:

- ~~Il difetto dei tag N/L/C che resta~~ — **chiuso da P-01** il 26 settembre:
  l'archivio è append-only anche per i tag, e l'import dice perché scarta.

## 3 · ChatGPT, su `ui/main`

**Una penna sola su `app.html`**: i punti qui sotto si fanno uno dopo l'altro,
un commit ciascuno, e fra l'uno e l'altro c'è la merge su `main`.

### 3.0 Prima di tutto: allinearsi, e il difetto dei tag

ChatGPT non è stato informato di niente di quello che è successo dal 25
settembre. Il ramo è allineato; il prompt è **P-01** nel §6.

### 3.1 Il ridisegno: le aree

**L'ordine che vale è questo**, deciso da ChatGPT il 12 settembre. La tabella
del §5.1 di `prossima-versione.md` lo riporta ora con la stessa numerazione;
fino al 26 settembre ne aveva un'altra.

| Area | Che cosa | Stato |
|---|---|---|
| 1 | Percorso e primo ingresso | **fatta** (v0.25.0), progetto in `area-1-progetto.md` |
| 2 | Quiz: cinque intenzioni con gerarchia, screening rinominato | **prossima** |
| 3 | Il ciclo che si chiude: riepilogo, revisione, «riprova questi N» | |
| 4 | Carteggio | |
| 5 | Progressi | |
| 6 | Rifinitura trasversale | |

Il ridisegno non aspetta la registrazione: con l'ADR-004 il primo quesito resta
senza account. Ma va letto l'ADR-004 prima di disegnare una schermata che
promette di ricordare qualcosa: senza account non si salva, e i Progressi sono
dei registrati. Come per l'area 1, **prima il progetto, poi la realizzazione**,
in due sessioni.

I due prompt sono **P-04** (progetto) e **P-05** (realizzazione), nel §6.

## 3-bis · Il codice: due metà con vincoli opposti

Dopo il progetto (§2) il codice **non è un lavoro solo**, e le due metà si
possono fare in momenti diversi.

**Il server può partire subito.** API, database, ciclo di vita dell'account,
verifica dell'email, cancellazione a due anni: **non tocca `site/`**, quindi non
collide con il ridisegno. È la metà che si può costruire e collaudare mentre
l'interfaccia è in mano a qualcun altro.

**Il client aspetta.** Registrazione, accesso, conversione del file esportato,
stato della sessione vivono in `site/app.html` e `site/index.html` — cioè nelle
stesse schermate che il ridisegno sta rifacendo. Costruirle prima significa
rifarle. O entra dentro una fetta del ridisegno, o viene dopo.

### Tre cose da sistemare **prima** della prima riga di codice server

1. **Il territorio non esiste.** `territori.yaml` conosce `motore`, `regole`,
   `interfaccia` e i condivisi. Un server non è nessuno dei quattro: va aggiunto,
   con il ramo che lo rivendica, altrimenti il recinto a due agenti ha un buco
   proprio dove stanno i dati delle persone.

2. **Serve una quinta suite.** Oggi sono `node --test` sul motore e tre suite
   Python su dati, interfaccia e specifica. Il server ha bisogno della sua, e
   vale la regola di casa: **prima il test che fallisce**.

3. **Il backup del database, con il ripristino provato.** È la lezione della
   0.4.6, pagata su un archivio di una persona sola: *un backup mai ripristinato
   non è un backup, è un file*. Allora fu risolta con un `--prova` che faceva il
   giro intero — scrive, salva, cancella, ripristina, confronta — su un'istanza
   sacrificabile. Dal primo giorno in cui il server tiene i dati di **altri**,
   quella prova vale più di prima, non meno.

### I prompt

Il server comincia con **P-02** e **P-03**, nel §6; i pezzi successivi li
scrive la regia quando P-03 è chiuso. Il client entra dentro una fetta del
ridisegno, con un prompt che si scrive quando il server c'è ed è testato: lì si
consuma, non si riprogetta.

## 4 · Fuori dalle sessioni — l'autore

- Q-ONBOARD (specifica §10): che cosa chiede l'onboarding oltre alla data, e se
  il sito consiglia un piano di studio strutturato.
- Il push di `main`, quando lo si vuole. Ricorda che su `rottagiusta.it` il push
  non pubblica niente da solo: serve «Build now» su statichost.eu.
- **Dal 16 ottobre 2026**, non prima: il redirect da `.pages.dev` (fase D2 di
  `docs/migrazione-hosting.md`).
- Le altre questioni aperte stanno dove si decidono: specifica §10,
  `account-progetto.md` §20, `prossima-versione.md` §9.
- ~~Le decisioni del §20~~ — **tutte prese il 26 settembre**, e scritte in
  `account-progetto.md`: le tue, quelle su delega (Argon2id, il limite dei 100
  tentativi) e i due standard scelti da P-07.
- ~~I record DNS di `posta.`, la pulizia dopo P-02, il contatto del titolare~~ —
  **fatti in P-08**: quattro record verificati, `privacy@rottagiusta.it` provato,
  la chiave SSH delle prove tolta.
- **Gli adempimenti rimasti**, sei punti, tutti nel §15.4 di
  `account-progetto.md` e bloccano il punto 9: l'indirizzo postale del titolare,
  la base giuridica del registro di sicurezza (da far confermare), l'inoltro di
  `privacy@` verso Gmail (un possibile trasferimento fuori dall'UE), per quanto
  si tengono le richieste evase, il DPA di statichost.eu, i due fattori su
  Gmail, Scaleway e IONOS. In più: scaricare il PDF del DPA di Scaleway e
  tenerlo accanto al registro, e «Secure your account» nella console di
  Scaleway. Il registro dei trattamenti e la procedura per le violazioni sono
  bozze tue, fuori dal repo.
- **Alla messa in esercizio** (punto 8), con una sessione che ti accompagna come
  P-08: creare la STARDUST1-S, la chiave API di sola scrittura sul bucket, una
  chiave SSH nuova, la chiave API di Transactional Email, e il record di `api.`.
  Le chiavi si mettono sulla macchina, mai nel repo.
- **I worktree `~/Software/rotta-giusta-p07` e `-p08`** con i loro rami, già
  fusi in `main`: si tolgono quando le due sessioni sono chiuse.

## 5 · Il traguardo: la versione con gli account

È il lavoro più grande della coda, e **non è una sessione**: è il punto in cui
quattro filoni arrivano insieme, e la regola del §1 — i testi cambiano nella
stessa versione in cui entrano gli account, non prima né dopo — vale per tutti.

| Filone | Chi | Dove è scritto | Pronto quando |
|---|---|---|---|
| Il server, testato | Claude | `account-progetto.md` §2–15, §16.2 | la sua suite è verde e il backup è stato ripristinato davvero |
| Il server, in esercizio su Scaleway | Claude e l'autore | `account-progetto.md` §2, §9.4, §19 | risponde su `api.rottagiusta.it`, spedisce da `posta.`, copia verso `nl-ams` |
| Il client e i testi | ChatGPT | §1 qui sopra, `account-progetto.md` §10–13 | R-ACC-01…11 hanno il loro controllo o un «scoperto» motivato |
| Gli adempimenti | l'autore | §4 qui sopra, ADR-003 | firmati e scritti, prima che una sola email arrivi al server |

Poi il rilascio, come ogni altro: merge, numero, tag, push chiesto, «Build now».
**Con una differenza**: il server non si pubblica con «Build now», e oggi **non
è scritto da nessuna parte come si aggiorna e come si torna indietro** sulla
macchina Scaleway. La chiude P-02, prima di ogni riga di server, non il giorno
del rilascio.

E due verifiche che solo il giorno vero può fare: un archivio esistente nel
browser che passa nell'account senza perdere una riga (R-ACC-05, il guasto muto
più probabile di tutta la versione), e il cookie fra `rottagiusta.it` e `api.`
su un Safari vero (§19, Q-PROVE).

## 6 · I prompt

Ognuno si copia **da qui**, per intero, blocco compreso. «Stato» e «Esito» li
scrive la regia. Le regole comuni — territori, trailer di ChatGPT, niente
`git add -A`, niente push — stanno in `AGENTS.md`, che ogni sessione legge da
sé: i prompt non le ripetono.

### P-01 — ChatGPT: allinearsi, e il difetto dei tag

**Stato:** **chiuso il 26 settembre 2026**, merge `6e07525`. **Dove:** app di
ChatGPT, progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`, modalità Local.

```
Sessione P-01. Il ramo ui/main è stato allineato a main, e da allora
sono cambiate decisioni di fondo: leggi, in quest'ordine,
docs/adr/ADR-003-…, docs/adr/ADR-004-…, docs/filosofia.md e
docs/prossime-sessioni.md per intero — l'ordine dei lavori e i prompt
stanno solo lì. I tre docs/*-ux.md, docs/recupero-progetto.md e
docs/motore.md sono storici: non si aggiornano e non si spostano.

Il lavoro: il difetto dei tag N/L/C che resta,
docs/account-progetto.md §4.2 — le righe di tag nascono con ts,
ritaggare aggiunge una riga e non cancella, chi legge prende l'ultima
per tentativo; e l'import mostra i motivi degli scarti, che
fondiArchivio() restituisce ora in `motivi`.

Non toccare docs/prossime-sessioni.md. Quattro suite verdi, voce in
fondo a [Unreleased], un commit con il trailer, versione non toccata.
Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `aabfb7a` su `ui/main`, merge `6e07525` su `main`, voce
«Corretto — P-01» nel CHANGELOG. Ritaggare aggiunge una riga con `ts`; il
riepilogo legge l'ultima classificazione per tentativo con `E.ordinaRighe()`;
l'import scrive i motivi degli scarti. Controllato dalla regia: il commit e il
trailer esistono, il diff tocca solo `site/app.html` e `CHANGELOG.md`, i
territori sono puliti, e dopo la merge le suite danno motore 131 + 1 skip, dati
221, interfaccia 135, specifica 262, come dichiarato. La regia **non** ha
ripetuto il collaudo nel browser: vale quello della sessione, a 375 e 1280 px,
con un file sintetico di tre righe rotte e tre motivi. Il file è rimasto nella
cartella Download dell'autore. I cinque controlli «sotto Node» della sessione
non sono nella suite, perché `tests/` è fuori dal territorio di `ui/*`: il
comportamento nuovo dei tag resta coperto solo dal collaudo di quel giorno.

### P-02 — Claude: le misure su Scaleway, e come si aggiorna il server

**Stato:** **chiuso il 26 settembre 2026**, merge `f452c67`. **Dove:** dal
pulsante della regia, worktree `~/Software/rotta-giusta-p02`, ramo `sessione/p-02`.

```
Sessione P-02. Leggi docs/account-progetto.md, e in
docs/prossime-sessioni.md «Come si usa» e il §5.

Due cose, e nessuna riga di codice del server:
1. Le misure su Scaleway del §19 di account-progetto.md, sulla forma
   decisa nel §2.2. Ogni risorsa che costa si crea solo con il sì
   dell'autore, e i record DNS non si toccano: si leggono, e li mette
   l'autore. Se una misura smentisce una scelta del documento,
   fermati e dillo prima di proseguire.
2. Come si aggiorna il server e come si torna indietro: oggi non è
   scritto da nessuna parte. Scrivilo in account-progetto.md, con
   quello che hai misurato.

I segreti restano sulla macchina, mai nel repo. Non toccare
docs/prossime-sessioni.md. Suite verdi, voce in fondo a [Unreleased],
un commit. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `4a0b185`, merge `f452c67` su `main`, voce «Misurato —
Scaleway» nel CHANGELOG. Le misure stanno in `account-progetto.md` §2.6, come si
aggiorna e si torna indietro nel §2.7 (provato: 1,5 s per aggiornare, 1,1 per
tornare, circa 105 ms senza risposta), i record di `posta.` nel §9.4, il bucket
nel §2.5, quello che manca nel §19, e tre decisioni nuove nel §20. Si è fermata
a chiedere quando una misura ha smentito il costo del §2.2, come il prompt
chiedeva. Controllato dalla regia: il commit esiste, il diff tocca solo
`account-progetto.md` e `CHANGELOG.md`, territori puliti. **La merge ha avuto un
conflitto nel CHANGELOG**, perché P-01 e P-02 avevano aggiunto entrambe una voce
in fondo a `[Unreleased]`: risolto tenendo le due voci, senza una riga tolta,
poi le suite su `main` — motore 131 + 1 skip, dati 221, interfaccia 135,
specifica 262. È il conflitto che `AGENTS.md` prevede; con due sessioni che
chiudono lo stesso giorno succederà ogni volta, e si risolve così.

### P-03 — Claude: i tre prerequisiti del server

**Stato:** **chiuso il 26 settembre 2026**, commit `d12b0ad` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`,
ramo **`main`** — non da un pulsante: tocca `territori.yaml` e `tests/`, che il
`pre-commit` accetta solo da `main`.

```
Sessione P-03, su main. Leggi docs/account-progetto.md §2.5, §2.7 e
§16, il §3-bis di docs/prossime-sessioni.md, e l'esito di P-02 nel
suo §6.

I tre prerequisiti, prima del server vero: server/** nel territorio
di territori.yaml indicato dal §16.2; la suite tests/test_server.mjs,
che avvia nello stesso processo un server che per ora risponde solo
alla salute, che AGENTS.md elenca fra i comandi, e che gira anche con
Node 24 LTS, non solo con la versione del Mac; il backup con il
ripristino provato, dentro la stessa suite. Il database nasce con
PRAGMA user_version, con l'epoca, e con il file delle cancellazioni
fuori dal database, come dice il §2.7: ripristina --prova li
esercita tutti, e R-ACC-20 e R-ACC-24 hanno il loro controllo.
controlla.py passa anche su server/ e fallisce su una chiave di
Scaleway scritta in un file.

Prima il test che fallisce. Non toccare docs/prossime-sessioni.md.
Suite verdi, voce in fondo a [Unreleased], un commit. Chiudi con il
resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `d12b0ad`, voce nel CHANGELOG. `server/**` nel territorio
`motore`; `tests/test_server.mjs`, la quinta suite, con un server che risponde
solo a `GET /v1/salute`; il database con `user_version`, l'epoca e
`secure_delete`; `server/copie.mjs` e `ripristina --prova` in 20 controlli;
R-ACC-20 e R-ACC-24 nella specifica; `controlla.py` su `server/` e contro le
chiavi di Scaleway. Tre cose trovate scrivendo il codice, nel §2.7: l'`id` che si
riusa dopo un ripristino, l'azzeramento da non rifare, il cursore da un
contatore. **R-ACC-24 è coperto a metà**: manca la regola del client nella
contabilità della coda, che va nel pezzo 4b; e il nome per l'epoca lato client
va scelto diverso da `epoca(ts)`, che nel motore esiste già e fa un'altra cosa.
Controllato dalla regia: suite del server 23/23 con Node 25; con la 24 LTS lo
dichiara la sessione, non l'ha rifatto la regia.

### P-04 — ChatGPT: il progetto dell'area 2, Quiz

**Stato:** **chiuso il 26 settembre 2026**, merge `c57ac3e`. **Dove:** app di
ChatGPT, progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`.

```
Sessione P-04. Progetta l'area 2 di docs/prossima-versione.md §5.1,
Quiz, in docs/area-2-progetto.md, sul modello di
docs/area-1-progetto.md. Solo il documento e la voce di CHANGELOG:
niente site/. Comprende il ricablaggio di E.lunghezzaScreening() al
posto di totScreening() — vedi docs/eccezioni-interfaccia.md. Prima
di disegnare una schermata che promette di ricordare qualcosa, rileggi
l'ADR-004: senza account non si salva.

Non toccare docs/prossime-sessioni.md. Un commit con il trailer,
versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `9f397a1`, merge `c57ac3e`: `docs/area-2-progetto.md` e la
sua voce nel CHANGELOG. Cinque intenzioni al posto delle sei modalità, filtri
locali invece che globali, i testi letti con l'ADR-004, e il ricablaggio a
`E.lunghezzaScreening()`. **Ha trovato la dipendenza che blocca P-05**: i test e
la specifica pretendono ancora le sei modalità (`test_modalita_quiz`, R-NAV-04,
R-NAV-05); il §10.1 del progetto dice come vanno allineati senza lasciare `main`
rosso, ed è P-06. Controllato dalla regia: territori puliti, il diff tocca solo
il progetto e il CHANGELOG; secondo conflitto additivo nel CHANGELOG, risolto
tenendo le due voci; suite su `main` invariate (131 + 1 skip, 221, 135, 262).

### P-05 — ChatGPT: la realizzazione dell'area 2

**Stato:** in attesa di P-06, e che la regia allinei `ui/main` dopo la sua merge. **Dove:** come P-04.

```
Sessione P-05. Realizza docs/area-2-progetto.md in site/app.html.

Non toccare docs/prossime-sessioni.md. Quattro suite verdi, collaudo
guardato a 375 e 1280 px, voce in fondo a [Unreleased], un commit con
il trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-06 — Claude: i controlli dei quiz allineati all'area 2

**Stato:** pronto: P-03 è chiuso e la cartella è libera. **Dove:** Claude
Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano: tocca `tests/` e la
specifica.

```
Sessione P-06, su main. Leggi docs/area-2-progetto.md, soprattutto §6
e §10.1, e R-NAV-04 e R-NAV-05 in docs/specifica.md.

Il progetto sostituisce le sei modalità dei quiz con cinque
intenzioni, e i controlli di oggi pretendono ancora le sei. Allinea
tests/test_interfaccia.py e la specifica come chiede il §10.1: il
controllo riconosce il regime di oggi, a sei ingressi, e quello
progettato, a cinque, e in quest'ultimo esercita le funzioni e i
parametri, non la presenza dei nomi. Non basta togliere l'asserzione
su Batteria. Main resta verde con la pagina di oggi; il regime vecchio
lo toglie la regia quando integra P-05.

Provalo al contrario: una pagina a cinque ingressi che perde
un'intenzione, o ne apre una con i parametri sbagliati, deve
diventare rossa. Non toccare docs/prossime-sessioni.md. Suite verdi,
voce in fondo a [Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-07 — Claude: uno standard per la sessione e per le password comuni

**Stato:** **chiuso il 26 settembre 2026**, merge `f926819`. **Dove:** worktree
`~/Software/rotta-giusta-p07`, ramo `sessione/p-07`.

```
Sessione P-07. Due righe del §20 di docs/account-progetto.md l'autore
le ha affidate a uno standard: la durata della sessione e l'elenco
delle password comuni. Per ciascuna scegli uno standard riconosciuto,
citato nella sua versione corrente: per la sessione, il livello che
corrisponde a un sito come questo; per l'elenco, una fonte la cui
licenza ne permetta l'uso in un repo MIT, e che cosa pesa. Scrivi la
scelta e il perché nel §5.2, nel §6.2 e nel §20; se serve un
requisito, proponilo nel §17. Se uno standard contraddice qualcosa
già deciso nel documento, fermati e dillo.

Solo docs/account-progetto.md e CHANGELOG.md. Non toccare
docs/prossime-sessioni.md. Suite verdi, voce in fondo a [Unreleased],
un commit. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `cc8b5cb`, merge `f926819`. Lo standard è **NIST SP
800-63B-4** per tutte e due: sessione AAL1, **30 giorni dall'accesso**, senza
rinnovo né scadenza per inattività; elenco delle password comuni di Burnett
(pubblico dominio) dal file di SecLists (MIT), fissato per commit e SHA-256,
tenendo le sole 10.898 voci da 15 caratteri. Proposti R-ACC-25 e R-ACC-26 nel
§17. Ha trovato che il «mai un blocco» del §6.5 contraddice un obbligo dello
standard: **deciso dalla regia**, dentro la delega dell'autore, il limite dei
100 tentativi (§6.5 e §20). Non fatti, e giustamente: lo script che genera
l'elenco e il file, che sono codice del server (pezzo 4a). La licenza di Burnett
poggia su una copia marcata su Internet Archive: l'articolo originale risponde
403, ed è scritto nel §5.2. Controllato dalla regia: territori puliti; conflitti
additivi nel CHANGELOG e nel registro del documento, risolti tenendo le due
voci.

### P-08 — Claude con l'autore: i passi a mano

**Stato:** **chiuso il 26 settembre 2026**, merge `1760df9`. **Dove:** worktree
`~/Software/rotta-giusta-p08`, ramo `sessione/p-08`.

```
Sessione P-08: accompagni l'autore nei passi che deve fare a mano per
gli account. Ha chiesto molto aiuto: un passo alla volta, spiegando
che cosa fa e perché, aspettando che dica «fatto», e verificando tu
dove si può — dig per il DNS, la console di Scaleway in lettura.

L'elenco è il §4 di docs/prossime-sessioni.md; il perché di ogni passo
sta nei punti di docs/account-progetto.md e dell'ADR-003 a cui
rimanda. In questa sessione: i record DNS di posta.rottagiusta.it su
IONOS (§9.4); che cosa tenere di quello che P-02 ha lasciato sul Mac e
su Scaleway; gli adempimenti dell'ADR-003 — l'accordo con Scaleway, il
registro dei trattamenti, un contatto del titolare, come ci si accorge
di una violazione. La macchina di produzione e la chiave del bucket
vengono con la messa in esercizio: se l'autore vuole creare subito la
STARDUST1-S per non trovarla esaurita, gli spieghi il costo e decide
lui.

Non inserisci credenziali, non accetti condizioni e non firmi niente
al suo posto. I documenti con i suoi dati personali non entrano nel
repo, e strumenti/controlla.py lo impedisce: nel repo si scrive solo
che cosa è fatto, quando, e dove sta, in docs/account-progetto.md nei
punti a cui appartiene. Non toccare docs/prossime-sessioni.md. Un
commit, e chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `76d8e5c`, merge `1760df9`. Fatti con l'autore: i quattro
record di `posta.` su IONOS, verificati con `dig` e «Verified» su Scaleway;
`privacy@rottagiusta.it`, provato; la chiave SSH delle prove tolta da Scaleway e
dal Mac, il worktree di P-02 rimosso; il DPA di Scaleway verificato come parte
del contratto. Il nuovo §15.4 porta lo stato degli adempimenti e sei punti
aperti per l'autore (§4 qui sopra). **Ha corretto una deduzione del progetto**:
sull'apice non c'era nessuna casella di posta, quindi «rompere la posta
dell'autore» non era un rischio vero; `posta.` resta la scelta giusta (§9.4). Ha
rispettato i limiti: due cancellazioni di credenziali fermate dai permessi le ha
fatte l'autore, non sono state aggirate. La STARDUST1-S non è creata: l'autore
la crea alla messa in esercizio. Per il server: gli allarmi al titolare
(accessi falliti oltre soglia, una copia con meno righe) vanno nel pezzo 4c.
Controllato dalla regia: territori puliti, conflitti additivi risolti, cinque
suite verdi su `main` dopo le tre merge.

### P-09 — Claude: il server, pezzo 1 — l'account

**Stato:** in attesa di P-06, che lavora nella stessa cartella. **Dove:** Claude
Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano.

```
Sessione P-09, su main. Leggi docs/account-progetto.md per intero —
soprattutto §3, §5, §6, §7.1 e §9, e il §20 dove tutte le decisioni
sono prese — e gli esiti di P-03 e P-07 nel §6 di
docs/prossime-sessioni.md.

Il primo pezzo del server: l'account. Le tabelle che servono, la
registrazione e l'accesso con Argon2id e i parametri del §20, la
password di almeno 15 caratteri contro l'elenco delle password comuni
del §5.2 — lo script che lo genera dalla fonte in strumenti/, il file
in server/, la dichiarazione nel README con la nota MIT di SecLists —,
la sessione del §6 a 30 giorni, i limiti del §6.5 con i 100 tentativi,
il §5.3 che non dice chi è iscritto, e la verifica dell'email del §9
con un fornitore finto nella suite. Le righe e la sincronia no: sono il
pezzo dopo. I requisiti del §17 che questo pezzo tocca entrano nella
specifica con il loro controllo in test_server.mjs.

Prima il test che fallisce, uno per requisito. Se il pezzo è troppo per
un commit, fermati a un confine pulito e dillo nel resoconto. La suite
del server gira anche con Node 24 LTS. Non toccare
docs/prossime-sessioni.md. Suite verdi, voce in fondo a [Unreleased],
un commit. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** —

---

## Registro

- **25 settembre 2026 — prima stesura.** Scritta perché la sessione che aveva il
  contesto stava per chiudersi. Nasce anche da un errore di quella sessione: si
  era lavorato su una fotografia vecchia del repo, senza accorgersi che nel
  frattempo erano uscite quattro versioni. `git log` è un comando, e va eseguito
  **prima**.
- **25 settembre 2026 — il punto 1 è fatto.** `docs/filosofia.md` e il §2 della
  specifica sono riscritti; al loro posto c'è l'elenco dei testi di `site/` da
  cambiare quando arrivano gli account, per chi lavora su `ui/*`.
- **25 settembre 2026 — la collisione è chiusa.** ADR-004: senza account si
  prova e non resta niente; con l'account si salva e si vedono i Progressi. La
  fetta del ridisegno non aspetta la registrazione, e l'elenco per `ui/*` legge
  ogni testo nei due stati. Entra Q-ONBOARD fra le decisioni dell'autore.
- **25 settembre 2026 — il punto 2 è fatto**, senza Scaleway: il progetto è
  `docs/account-progetto.md`, con quello che dipende da Scaleway marcato «da
  misurare». Ha trovato due difetti vivi nelle righe dei tag, che entrano qui
  come lavoro per `ui/*`.
- **26 settembre 2026 — `validaRiga()` e le decisioni del §20.** La funzione è
  nel motore e l'import non scarta più i tag. L'autore ha deciso la password da
  15 caratteri e che senza account non restino nemmeno le preferenze, e ha
  delegato la macchina e i tempi del registro; resta la durata dell'account non
  confermato.
- **26 settembre 2026 — un posto solo per l'ordine dei lavori.** In testa la
  mappa dei documenti e la coda in una tabella; la regola che l'ordine e i
  prompt stanno solo qui, mentre le domande aperte restano dove si decidono. La
  tabella delle aree in `prossima-versione.md` §5.1 è rinumerata come il lavoro
  l'ha seguita — Percorso 1, Quiz 2, ciclo 3 — e rimanda qui per lo stato.
  ChatGPT allineato a `main` e il suo prompt d'ingresso in §3.0; Scaleway aperto,
  quindi il server non aspetta più l'autore.
- **26 settembre 2026 — l'ultima decisione del §20.** L'account non confermato
  vive sette giorni (R-ACC-11). Tolto dalla coda il numero dei commit da
  spingere, che era già sbagliato: si legge da git.
- **26 settembre 2026 — il traguardo.** La coda arrivava al client degli
  account e si fermava: mancavano la messa in esercizio su Scaleway, gli
  adempimenti dell'autore e il rilascio che li tiene insieme. Entrano come punti
  7 e 8 e nel nuovo §5, con la domanda che nessun documento ancora chiude: come
  si aggiorna il server e come si torna indietro. Il prompt di ChatGPT dice
  quali documenti sono storici.
- **26 settembre 2026 — la regia.** Da qui la versione con gli account si
  conduce da una sessione di regia, unica penna di questo file: i prompt hanno
  un numero e stanno solo nel nuovo §6, ogni sessione chiude con un resoconto in
  forma fissa, e niente vale solo in chat — quello che conta si scrive nel repo
  prima del resoconto, che lo punta. I prompt che erano sparsi nei §3 e §3-bis
  sono diventati P-01…P-05; P-02 è nuovo, e chiude la domanda su come si
  aggiorna il server prima di ogni riga di codice. La coda passa da otto a nove
  punti: le misure e i prerequisiti sono due sessioni, non una. Le sessioni di
  Claude che toccano solo file neutri possono partire da un pulsante, in un
  worktree loro.
- **26 settembre 2026 — P-01 chiuso.** Merge `6e07525`; P-04 pronto. Nel suo
  esito resta scritto che cosa la regia ha controllato e che cosa no: il
  collaudo nel browser è della sessione, e il comportamento nuovo dei tag non ha
  un test nella suite.
- **26 settembre 2026 — P-02 chiuso.** Merge `f452c67`, con il primo conflitto
  del CHANGELOG fra due sessioni della regia, risolto tenendo le due voci. P-03
  riscritto con l'epoca, il file delle cancellazioni e Node 24; aspetta il sì
  dell'autore. Nel §4 le decisioni che P-02 ha riaperto e quello che ha lasciato
  sul Mac e su Scaleway.
- **26 settembre 2026 — P-04 chiuso, le decisioni dell'autore, tre prompt
  nuovi.** Merge `c57ac3e`. L'autore ha deciso le due proposte del §2.7 e il
  §20 riaperto da P-02, e le decisioni sono scritte in `account-progetto.md`
  nello stesso commit, non solo in chat. P-03 pronto. Entrano P-06 (i controlli
  che P-04 ha trovato fermi alle sei modalità, prima di P-05), P-07 (gli
  standard che l'autore ha chiesto) e P-08 (i passi a mano, accompagnati, in una
  sessione separata come ha chiesto l'autore).
- **26 settembre 2026 — P-03, P-07 e P-08 chiusi.** Tre resoconti insieme,
  due merge con conflitti solo additivi. La regia ha chiuso su delega il limite
  dei 100 tentativi, che P-07 aveva trovato in contraddizione con lo standard.
  Il server si divide in tre pezzi (4a, 4b, 4c) e il primo è P-09; P-06 è
  pronto. Nel §1 entrano le cose della pagina che P-07 e P-08 hanno trovato; nel
  §4 restano i sei adempimenti del §15.4 e le chiavi della messa in esercizio.
