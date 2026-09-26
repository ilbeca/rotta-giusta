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
| 1 | Allineare ChatGPT e chiudere il difetto dei tag | ChatGPT | `ui/main` | niente | P-01 |
| 2 | Le misure su Scaleway, e come si aggiorna e si torna indietro | Claude | `main` | niente: l'account c'è | P-02 |
| 3 | I tre prerequisiti del server | Claude | `main` | 2 | P-03 |
| 4 | Il server degli account, un pezzo per volta | Claude | `main` | 3 | da scrivere dopo P-03 |
| 5 | Area 2, Quiz: prima il progetto, poi la realizzazione | ChatGPT | `ui/main` | 1, per la penna su `app.html` | P-04, P-05 |
| 6 | Aree 3–6 del ridisegno | ChatGPT | `ui/main` | la precedente | da scrivere |
| 7 | Il client degli account, dentro una fetta del ridisegno | ChatGPT | `ui/main` | 4 | da scrivere |
| 8 | La messa in esercizio del server su Scaleway | Claude e l'autore | `main`, pannelli | 4 | da scrivere |
| 9 | **La versione con gli account** — il traguardo | tutti | `main` | 7, 8, e gli adempimenti del §4 | da scrivere |
| — | Decisioni e passi dell'autore | l'autore | — | — | §4 |

**Le due colonne corrono in parallelo**: Claude sul server (non tocca `site/`),
ChatGPT sull'interfaccia. **Si possono lanciare insieme adesso P-01 e P-02**:
stanno su due cartelle diverse. Si incontrano al punto 7, e il punto 9 è il
giorno in cui gli account arrivano a chi studia.

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
  cancellano all'uscita.

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

- **Il difetto dei tag N/L/C che resta** (§4.2) — ChatGPT, su `ui/*`: ritaggare
  cancella la riga vecchia, unico punto non append-only dell'archivio; e le
  righe di tag nascono senza `ts`. Nello stesso giro, l'import può mostrare
  `motivi`, che `fondiArchivio()` restituisce ora accanto a `scartate`.

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
- **Gli adempimenti degli account**, che nessuna sessione fa al posto tuo e che
  bloccano il punto 9: l'accordo con Scaleway come responsabile, il registro dei
  trattamenti, un contatto del titolare che non sia un canale pubblico, e il
  modo in cui ti accorgi di una violazione e la notifichi entro 72 ore. L'elenco
  è la tabella «Il GDPR, per intero» dell'ADR-003; il testo dell'informativa è
  lavoro di `ui/*` (§1).
- **I record DNS su IONOS** per `api.` e `posta.rottagiusta.it`, quando la
  sessione P-02 li avrà letti su Scaleway (`account-progetto.md` §9.4 e §19). Il
  record SPF dell'apice non si tocca: regge la tua posta.

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

**Stato:** pronto. **Dove:** app di ChatGPT, progetto `~/Software/rotta-giusta-ui`,
ramo `ui/main`, modalità Local. **Aspetta:** niente.

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

**Esito:** —

### P-02 — Claude: le misure su Scaleway, e come si aggiorna il server

**Stato:** pronto. **Dove:** Claude Code, su `rotta-giusta` — dal pulsante
della regia, in un worktree suo (vedi «Come si usa», punto 6). **Aspetta:**
niente. Si può lanciare insieme a P-01.

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

**Esito:** —

### P-03 — Claude: i tre prerequisiti del server

**Stato:** in attesa di P-02. **Dove:** Claude Code, `~/Software/rotta-giusta`,
ramo **`main`** — non da un pulsante: tocca `territori.yaml` e `tests/`, che il
`pre-commit` accetta solo da `main`.

```
Sessione P-03, su main. Leggi docs/account-progetto.md §2.5 e §16, il
§3-bis di docs/prossime-sessioni.md, e l'esito di P-02 nel suo §6.

I tre prerequisiti, prima del server vero: server/** nel territorio
di territori.yaml indicato dal §16.2; la suite tests/test_server.mjs,
che avvia nello stesso processo un server che per ora risponde solo
alla salute, e che AGENTS.md elenca fra i comandi; il backup con il
ripristino provato, dentro la stessa suite. controlla.py passa anche
su server/ e fallisce su una chiave di Scaleway scritta in un file.

Prima il test che fallisce. Non toccare docs/prossime-sessioni.md.
Suite verdi, voce in fondo a [Unreleased], un commit. Chiudi con il
resoconto di docs/prossime-sessioni.md.
```

**Esito:** —

### P-04 — ChatGPT: il progetto dell'area 2, Quiz

**Stato:** in attesa di P-01 e della sua merge. **Dove:** app di ChatGPT,
progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`.

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

**Esito:** —

### P-05 — ChatGPT: la realizzazione dell'area 2

**Stato:** in attesa di P-04 e della sua merge. **Dove:** come P-04.

```
Sessione P-05. Realizza docs/area-2-progetto.md in site/app.html.

Non toccare docs/prossime-sessioni.md. Quattro suite verdi, collaudo
guardato a 375 e 1280 px, voce in fondo a [Unreleased], un commit con
il trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
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
