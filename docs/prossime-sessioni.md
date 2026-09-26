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
| 5b | Chiudere il regime vecchio dei controlli dei quiz, e il §5 della specifica | Claude | `main`, a mano | la cartella libera | P-12 |
| 14 | I contratti del motore che il client chiede | Claude | `main`, a mano | niente — **per primo** | P-28 |
| 15 | La prova nel browser, per i controlli del client | Claude | `main`, a mano | P-28 | P-29 |
| 6a | Il progetto dell'area 3, il ciclo che si chiude | ChatGPT | `ui/main` | niente | P-14 |
| 8 | La messa in esercizio del server su Scaleway, con l'autore | Claude e l'autore | `main`, a mano, e pannelli | un tag che contenga il server: il rilascio del §4 | P-15 |
| 12 | `ritmo()` che dice «orologio» senza orologio | Claude | `main`, a mano | la cartella libera | P-16 |
| 13 | L'ultimo tag di una risposta, nel motore | Claude | `main`, a mano | la cartella libera | P-17 |
| 7b | La realizzazione del client degli account | ChatGPT | `ui/main` | P-28 e P-29 | P-18 |
| 6b | Le aree del ridisegno che restano: 3 realizzata, poi 4, 5, 6 | ChatGPT | `ui/main` | la precedente | segnaposto P-19…P-25 |
| 9a | I testi fuori da `site/` nella versione con gli account | Claude | `main`, a mano | P-18 | segnaposto P-26 |
| 9 | **La versione con gli account** — il traguardo | tutti | `main` | 7b, 8, 9a, e gli adempimenti del §4 | segnaposto P-27 |
| — | Decisioni e passi dell'autore | l'autore | — | — | §4 |

**Le due colonne corrono in parallelo**: Claude sul server (non tocca `site/`),
ChatGPT sull'interfaccia. **Adesso è pronto P-14 per ChatGPT, e per Claude P-28,
poi P-29** — sono loro che sbloccano il client, P-18 —; P-12, P-16 e P-17
riempiono i buchi, e P-15 parte quando c'è un tag con il server e l'autore ha il
tempo. I prompt di Claude vanno uno alla volta, perché stanno tutti nella
cartella principale: è la strettoia della colonna di Claude, e si accetta perché
il recinto la vuole. Il numero di una riga è il suo nome, non la sua posizione:
l'ordine è quello della tabella. Le due colonne si incontrano al punto 7b, e il
punto 9 è il giorno in cui gli account arrivano a chi studia.

**L'ordine consigliato per ChatGPT, dopo P-05: prima il client degli account
(P-13), poi l'area 3 (P-14).** Il traguardo ha bisogno del client e non delle
aree 3–6; con il client prima, gli account arrivano a chi studia senza
aspettare il resto del ridisegno. Le aree successive lo erediteranno invece di
doverlo rincorrere. Decide l'autore: basta scambiare le due righe.

I prompt «da scrivere» li scrive la regia quando si chiude quello da cui
dipendono, non prima: un prompt scritto in anticipo punta a uno stato che nel
frattempo è cambiato. Quelli già scritti con lo stato «in attesa di» si
rileggono alla chiusura del loro predecessore, e si correggono lì se il
resoconto ha cambiato qualcosa.

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
- ~~La registrazione dice chi è iscritto~~ — **deciso dall'autore il 26
  settembre 2026, nella regia: si dice apertamente.** Registrarsi con un'email
  già iscritta dà un errore esplicito, e la pagina scrive «Questa email è già
  registrata», con le due strade: accedere, o reimpostare la password. È la
  prima delle tre strade del §20 di `account-progetto.md`, resa esplicita invece
  che nascosta dietro la stessa frase; il freno resta il limite di 5
  registrazioni l'ora (§6.5). Conseguenze, che la regia ne deriva: la mail «hai
  già un account» del §5.3 non parte più, perché serviva solo a non dirlo; il
  `202` del §7.1 diventa un errore con il suo perché; l'accesso sbagliato e la
  password dimenticata restano come sono, e R-ACC-28 con loro — non proteggono
  più l'iscrizione, ma non costano niente e non danno un'informazione in più.
  Scritta anche in `account-progetto.md` (§5.3, §7.1, §20) e nella specifica
  come R-ACC-30; il server la fa con P-11, con il suo test.
- ~~La merge di P-05 è ferma~~ — **fatta il 26 settembre** (`ccd98f0`) con
  `merge=union`, che l'autore ha scelto: si è chiusa da sola. Il difetto di
  `Standards` resta, con la sua segnalazione,
  [ilbeca/standards#1](https://github.com/ilbeca/standards/issues/1).
- **Q-PROVE**, riaperta da P-05: le prove con persone e lo zoom nativo al 200 %,
  che il browser integrato non fa. `docs/area-2-collaudo-ux.md` dice che cosa
  manca.
- **Q-DUE**, prima dell'area 5: le due classifiche di «cosa fare adesso»
  (specifica §10).
- **Un rilascio intermedio — sì dell'autore il 26 settembre: v0.28.0.** `site/` è cambiato con
  P-01 e con l'area 2, e chi studia oggi non lo vede; e P-15 può avviare il
  server soltanto da un tag pubblicato che lo contenga (`account-progetto.md`
  §2.7), mentre l'ultimo, `v0.27.0`, è di prima del server. Un rilascio adesso
  fa le due cose: la pagina di oggi non chiama il server, quindi pubblicarlo non
  cambia niente per chi studia. La regia lo fa quando dici sì — numero, voce,
  tag, push chiesto, «Build now».
- ~~La soglia degli allarmi~~ — **decisa dalla regia su tua delega**: resta
  100 accessi falliti in 24 ore, e si rilegge dopo trenta giorni di esercizio
  (`account-progetto.md` §15.4; è nel segnaposto P-27).
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

**Stato:** **chiuso il 26 settembre 2026**, merge `ccd98f0`. **Dove:** come P-04.

```
Sessione P-05. Realizza docs/area-2-progetto.md in site/app.html.

Il §10.1 del progetto è ora un contratto che la suite esegue: una
selezioneQuiz(intenzione, conf, fonte) di primo livello e pura, le
porte con data-modo, nessun totScreening. tests/quiz_intenzioni.mjs la
estrae e la esegue sulla banca vera, e tests/pagina-quiz-intenzioni.html
è la pagina di riferimento con cui è stata provata. Se il contratto ti
sta stretto, fermati e dillo nel resoconto: cambiarlo tocca tests/, che
non è del tuo ramo. Non tenere una sesta modalità per far passare un
controllo.

Non toccare docs/prossime-sessioni.md. Quattro suite verdi, collaudo
guardato a 375 e 1280 px, voce in fondo a [Unreleased], un commit con
il trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `0645970` su `ui/main`: le cinque
intenzioni, i filtri locali, un'istantanea condivisa fra anteprima e avvio, la
simulazione in due fasi, ritorni e focus; il collaudo in
`docs/area-2-collaudo-ux.md`. Controllato dalla regia: territori puliti, il diff
tocca `site/app.html`, il CHANGELOG, `docs/eccezioni-interfaccia.md` e il
collaudo; con la merge provata, le cinque suite danno motore 130 + 2 skip,
server 42, dati 242, interfaccia 277, specifica 312. Il secondo skip è voluto: il
controllo di compatibilità di `totScreening()` si ritira da solo ora che la
pagina chiama `lunghezzaScreening()`. Trovato: `ritmo()` dice «orologio» anche
senza orologio, e diventa P-16.

La prima merge si era fermata sul `pre-commit` e la regia l'aveva annullata;
rifatta dopo `merge=union` e dopo il commit di P-10, si è chiusa da sola. Suite
sullo stato fuso: motore 141 + 2 skip, server 52, dati 242, interfaccia 295,
specifica 344. La regia ha aggiunto la riga vuota che il driver non mette fra le
voci di P-10 e P-05.

### P-06 — Claude: i controlli dei quiz allineati all'area 2

**Stato:** **chiuso il 26 settembre 2026**, commit `af28901` su `main`. **Dove:** Claude
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

**Esito:** commit `af28901`, voce «Test — P-06» nel CHANGELOG. I controlli
dei quiz riconoscono i due regimi leggendo `MODI`: in quello di oggi, a sei
ingressi, restano quelli di prima e in più si rifiuta l'ibrido; in quello a
cinque, un banco nuovo (`tests/quiz_intenzioni.mjs`) estrae `selezioneQuiz()` e
la esegue sulla banca vera con una spia sul motore, intenzione per intenzione.
Il contratto sta nel §10.1 di `area-2-progetto.md`; R-NAV-04 e R-NAV-05
riscritti, R-NAV-07 nuovo. **Il banco è stato provato contro sé stesso**:
sedici rotture di una pagina di riferimento, e quattro controlli indeboliti uno
per volta, uno dei quali è passato verde e ha fatto nascere la sedicesima
rottura. Non coperti dal banco, e dichiarati nel §9.4 della specifica: «Base e
vela», la gerarchia visiva, i testi, il focus, i ritorni; restano al collaudo.
Controllato dalla regia: cinque suite su `main` — motore 131 + 1 skip, server
23, dati 236, interfaccia 183, specifica 274 —, e la coda toccata solo dalla
regia. Dopo P-05 la regia toglie il regime vecchio: punto 5b della coda.

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

**Stato:** **chiuso il 26 settembre 2026**, commit `b6ce503` su `main`. **Dove:**
Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano.

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

**Esito:** commit `b6ce503`, voce nel CHANGELOG. Le rotte del §7.1 dalla
registrazione al cambio della password; Argon2id con i parametri del §20; la
sessione `__Host-` di 30 giorni; i gettoni monouso; i limiti del §6.5 con i 100
tentativi, e il conto dei fallimenti **nel database**; gli account non
confermati cancellati al settimo giorno; lo schema 2 con una migrazione
additiva; l'elenco delle password comuni generato da `strumenti/password_comuni.py`
e dichiarato nel README. Nove requisiti del §9.9 con il loro test, scritti prima
e provati al contrario su 18 rotture. **Si è fermata a un confine pulito**: il
cambio d'indirizzo, il profilo, l'azzeramento e `DELETE /v1/account` vanno con i
pezzi dopo, il fornitore di Scaleway è scritto e non misurato. Cinque cose
trovate, tutte scritte nei §5.3, §6.5 e §9.3; la più importante torna
all'autore (§4): **la registrazione dice chi è iscritto**. E una, la seconda,
vale per tutto il progetto: il conto tenuto in memoria lasciava la suite verde
solo perché nessun test riavviava il server. Controllato dalla regia: cinque
suite su `main` — motore 131 + 1 skip, server 42, dati 242, interfaccia 183,
specifica 310.

### P-10 — Claude: il server, pezzo 2 — le righe e la sincronia

**Stato:** **chiuso il 26 settembre 2026**, commit `c5dc396` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo
**`main`**, a mano.

```
Sessione P-10, su main. Leggi docs/account-progetto.md — soprattutto
§1, §2.3, §2.7, §4, §7.2, §8 e §16.1 — e gli esiti di P-03 e P-09 nel
§6 di docs/prossime-sessioni.md.

Il secondo pezzo del server: le righe. L'API del §7.2 sopra
aggiungiRighe e righeDopo, che esistono già in server/db.mjs, con
validaRiga() del motore; il cursore, l'epoca in ogni risposta, la
generazione e l'azzeramento con il suo 409 (§8.4). E la metà che sta
nel motore (§16.1): la contabilità della coda — quali righe inviare,
che cosa togliere dopo una risposta, il 409, e l'epoca che cambia —,
logica pura in site/engine.js con i suoi test, che chiude la metà
client di R-ACC-24. Il nome per l'epoca del database va scelto diverso
da epoca(ts), che nel motore esiste già e fa un'altra cosa. Il
cambio d'indirizzo, il profilo e la cancellazione no: sono il pezzo
dopo.

Prima il test che fallisce, uno per requisito, e un test che riavvia il
server dove lo stato potrebbe vivere in memoria. Se il pezzo è troppo
per un commit, fermati a un confine pulito e dillo. La suite del server
gira anche con Node 24 LTS. Non toccare docs/prossime-sessioni.md.
Suite verdi, voce in fondo a [Unreleased], un commit. Chiudi con il
resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `c5dc396`, voce nel CHANGELOG. Il §7.2 in
`server/righe.mjs`: invio con `validaRiga()` e la banca accanto, lettura a pagine
di 5.000, `GET /v1/esporta` che `importa()` ricarica, `POST /v1/azzera` con la
password e il file delle cancellazioni; epoca e generazione in ogni risposta, e
il `409` che non scrive niente. Nel motore la contabilità della coda — sei
funzioni, con l'epoca del database che si chiama `epocaDb` —, e con lei **la
metà client di R-ACC-24 è chiusa**. Otto requisiti nel §9.9 con il loro test,
scritti prima e provati al contrario su 13 rotture. Trovato, e scritto sotto il
§7.2: `ultima_seq` non è un cursore (R-ACC-31); il primo `413` chiudeva la
connessione; e **un test a due dispositivi lasciava passare un client che
ignorava l'epoca** — ora sono tre. Rimandati a P-11: cambio d'indirizzo,
profilo, `DELETE /v1/account` e i punteggi dei Segnali nell'export. Controllato
dalla regia: cinque suite su `main` — motore 142 + 1 skip, server 52, dati 242,
interfaccia 201, specifica 344.

### P-11 — Claude: il server, pezzo 3 — quello che chiude le sue rotte

**Stato:** **chiuso il 26 settembre 2026**, commit `cd490ac` su `main`. **Dove:** Claude
Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano.

```
Sessione P-11, su main. Leggi docs/account-progetto.md — soprattutto
§5.3, §7.1, §9.3, §13, §14 e §15 — e gli esiti di P-09 e P-10 nel §6
di docs/prossime-sessioni.md.

Il terzo pezzo del server, che chiude le sue rotte:
- «email già registrata», deciso dall'autore il 26 settembre (§5.3):
  409 senza sessione e senza mail, e R-ACC-30 con il suo test;
- il cambio d'indirizzo e il profilo, con la data d'esame
  dell'onboarding (§13), e i punteggi dei Segnali nell'export (§13.2),
  che P-10 ha lasciato fuori;
- DELETE /v1/account, che cancella davvero, e i due anni di
  inattività con l'avviso prima (§14), passando dal file delle
  cancellazioni del §2.7;
- gli allarmi al titolare del §15.4 — accessi falliti oltre soglia,
  una copia con meno righe, una mail rifiutata —, letti dalla tabella
  registro, e il conto delle 300 mail del §9.3: un avviso, mai un
  blocco.

Prima il test che fallisce, uno per requisito, e un test che riavvia
il server dove lo stato potrebbe vivere in memoria. Se è troppo per un
commit, fermati a un confine pulito e dillo. La suite del server gira
anche con Node 24 LTS. Non toccare docs/prossime-sessioni.md. Suite
verdi, voce in fondo a [Unreleased], un commit. Chiudi con il
resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `cd490ac`, voce nel CHANGELOG. Tutte le rotte del §7.1:
«email già registrata» con `409`, senza sessione né mail (R-ACC-30); il cambio
d'indirizzo con una rotta in più, `POST /v1/email/conferma`, e l'avviso al
vecchio indirizzo (R-ACC-34); il profilo con la data d'esame e i punteggi dei
Segnali, anche nell'export (R-ACC-35); `DELETE /v1/account` (R-ACC-19); i due
anni con l'avviso (R-ACC-36); gli allarmi al titolare (R-ACC-37) e il conto
delle 300 mail (R-ACC-38). Schema 3, additivo. **Trovato il difetto più serio
del server finora: una cancellazione non cancellava davvero** — email e
risposte restavano leggibili nel `-wal` anche con `secure_delete`, e solo
`wal_checkpoint(TRUNCATE)` le toglie; valeva anche per le cancellazioni al
settimo giorno di P-09 (§14.4). Per P-15: `RG_TITOLARE` nell'ambiente della
macchina, altrimenti gli allarmi restano nel registro, e `server/copia.mjs`
che scrive il suo esito nel registro. Una decisione per l'autore, nel §4: la
soglia degli allarmi. Controllato dalla regia: server 58, motore 141 + 2 skip,
dati 242, interfaccia 295, specifica 370, `ripristina --prova` 20 su 20.

### P-12 — Claude: chiudere il regime vecchio dei controlli dei quiz

**Stato:** pronto, dopo P-11 nell'ordine consigliato. **Dove:**
Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano.

```
Sessione P-12, su main. P-05 ha realizzato l'area 2 e la regia l'ha
fusa: leggi i suoi esiti e quello di P-06 nel §6 di
docs/prossime-sessioni.md, e il §10.1 di docs/area-2-progetto.md.

Chiudi il regime vecchio, come P-06 ha lasciato scritto: togli
MODI_SEI e il ramo a sei ingressi da tests/test_interfaccia.py, così
la pagina a cinque intenzioni è l'unica che passa, e decidi che cosa
resta di tests/pagina-quiz-intenzioni.html. Aggiorna il §5 della
specifica, che descrive ancora Batteria e il selettore globale, e ogni
altro punto che nomina le sei modalità. Provalo al contrario: la
pagina di prima, a sei ingressi, ora dev'essere rossa.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-13 — ChatGPT: il progetto del client degli account

**Stato:** **chiuso il 26 settembre 2026**, merge `f875e0c`. **Dove:** app di ChatGPT,
progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`.

```
Sessione P-13. Progetta il client degli account in
docs/account-client-progetto.md, sul modello di
docs/area-1-progetto.md: la registrazione alla fine di un'attività,
l'accesso e l'uscita, «email già registrata», la verifica dell'email,
il passaggio di chi ha già un archivio nel browser, la conversione di
un file esportato, l'onboarding con la data facoltativa, e il sito
senza account che non conserva niente.

Le fonti: l'ADR-004; docs/account-progetto.md dal §5 al §13 — il
server c'è già ed è testato, qui si consuma, non si riprogetta —; il
§1 di docs/prossime-sessioni.md, con i testi di site/ che diventano
falsi e le cose che la pagina deve fare; i requisiti R-ACC nel §9.9
della specifica. La contabilità della coda sta nel motore: la pagina
la chiama, non la rifà. Dove un comportamento non ha un controllo,
scrivi nel documento quale serve: lo aggiunge Claude su main.

Solo il documento e la voce di CHANGELOG: niente site/. Non toccare
docs/prossime-sessioni.md. Un commit con il trailer, versione non
toccata. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `3aa4e9e`, `docs/account-client-progetto.md` e la sua voce.
Flussi, testi, stati, i contratti con il motore, e **diciotto gruppi di
controlli, C-01…C-18, che chiede a Claude di scrivere su `main` prima della
realizzazione, in un browser vero** (§12): il resoconto non lo diceva, la regia
l'ha letto nel documento. Più due contratti del motore da risolvere prima del
codice. Scritto sulla base di prima di P-11: il `202` della registrazione e le
rotte mancanti sono descritti com'erano. Da qui P-28 (i contratti, e il
progetto riallineato a P-11) e P-29 (la prova nel browser), prima di P-18.
Controllato dalla regia: territori puliti, il diff tocca solo il progetto e il
CHANGELOG, merge chiusa da sola con `merge=union`.

### P-14 — ChatGPT: il progetto dell'area 3, il ciclo che si chiude

**Stato:** pronto: P-13 è chiuso. **Dove:** come P-13.

```
Sessione P-14. Progetta l'area 3 di docs/prossima-versione.md §5.1, il
ciclo che si chiude — riepilogo, revisione, «riprova questi N» —, in
docs/area-3-progetto.md, sul modello di docs/area-1-progetto.md e
docs/area-2-progetto.md. erroriSessione() è già nel motore, ed è
dichiarata orfana in docs/eccezioni-interfaccia.md fino a questa area.
Rileggi l'ADR-004: senza account la revisione vale per la pagina
aperta. Se il progetto chiede di cambiare test o specifica, scrivi la
dipendenza come fa il §10.1 dell'area 2.

Solo il documento e la voce di CHANGELOG: niente site/. Non toccare
docs/prossime-sessioni.md. Un commit con il trailer, versione non
toccata. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** —

### P-15 — Claude con l'autore: la messa in esercizio su Scaleway

**Stato:** in attesa di un tag che contenga il server — il rilascio del §4 — e del tempo dell'autore. **Dove:** Claude Code, `~/Software/rotta-giusta`,
ramo **`main`**, a mano: gli strumenti della macchina stanno nel repo. È una
sessione che si fa **insieme**, come P-08.

```
Sessione P-15: la messa in esercizio del server su Scaleway, insieme
all'autore. Lui agisce nei pannelli e con le chiavi; tu spieghi un
passo alla volta, prepari, aspetti che dica «fatto», e verifichi.
Leggi docs/account-progetto.md §2 per intero, §9.4, §15.4 e §19, e gli
esiti di P-02, P-08, P-09, P-10 e P-11 nel §6 di
docs/prossime-sessioni.md.

Nell'ordine: la STARDUST1-S a pl-waw-2 con una chiave SSH nuova; la
macchina come dice il §2.7 — utente, unità di systemd, Node LTS,
cartelle, rg-aggiorna e rg-torna —; il gruppo di sicurezza guardato
prima di aprire la 443; il record di api. su IONOS e il certificato;
la chiave di Transactional Email e quella di sola scrittura sul
bucket, messe dall'autore sulla macchina, e RG_TITOLARE nell'ambiente,
senza il quale gli allarmi restano nel registro; le copie due volte al
giorno verso nl-ams con server/copia.mjs, che scrive il suo esito nel
registro; il server avviato da un tag pubblicato. Poi le misure
che il §19 lascia a questo giorno: il sorgente di una mail vera, una
copia arrivata a nl-ams e ripristinata, il riavvio dopo un
aggiornamento del kernel, Argon2id sulla macchina vera.

Se serve un tag che non c'è, fermati: il rilascio lo fa la regia. Il
server in esercizio non riceve ancora nessuno, perché la pagina non lo
chiama fino alla versione con gli account. Non inserisci credenziali e
non accetti condizioni al posto dell'autore; nessun segreto nel repo.
Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-16 — Claude: `ritmo()` dice «orologio» anche senza orologio

**Stato:** pronto, dopo P-11 e P-12 nell'ordine consigliato. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** il resoconto
di P-05.

```
Sessione P-16, su main. Il collaudo di P-05 ha trovato che E.ritmo()
può restituire affidabile: true e fonte: 'orologio' su trenta righe
con sim_uid e ms ma senza ts, perché sessioni() ripiega sulla somma
dei tempi quando non può misurare l'intervallo fra prima e ultima
risposta: docs/area-2-collaudo-ux.md, «Trovato e contatto con la
regia». Il Quiz se ne difende passando solo righe con ts; gli altri
chiamanti no.

Prima elenca i chiamanti di ritmo(), di sessioni() e di stimaImpegno(),
e scrivi che cosa cambia per ciascuno (AGENTS.md). Poi un test che
fallisce e riproduce il caso, e la correzione nel motore, così che
nessun chiamante debba difendersene da sé. R-TEMPO-05 e R-TEMPO-07
nella specifica restano veri, o si correggono dicendo perché.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-17 — Claude: l'ultimo tag di una risposta, nel motore

**Stato:** pronto quando la cartella principale è libera. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** l'esito di
P-01, che lo lasciava scritto come difetto di copertura.

```
Sessione P-17, su main. P-01 ha messo in site/app.html una funzione,
tagPerTentativo(), che sceglie l'ultima classificazione N/L/C di ogni
tentativo con E.ordinaRighe(). È una regola sulle righe dell'archivio,
vive nella pagina, e nessun test la esercita: l'esito di P-01 nel §6
di docs/prossime-sessioni.md lo dice.

Portala nel motore come funzione pura, con i suoi test scritti prima:
tag storici senza data, date miste UTC e offset locale, lo stesso
istante, un ritag. La pagina non si tocca: la nuova funzione entra fra
gli orfani dichiarati in docs/eccezioni-interfaccia.md, con l'area che
la ricablerà. Quella riga è un punto della coda, non un ricordo.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-28 — Claude: i contratti del motore che il client chiede

**Stato:** pronto. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo
**`main`**, a mano. **Nasce da:** P-13, §12 di `docs/account-client-progetto.md`,
«Contatti da risolvere su main prima del codice che ne dipende».

```
Sessione P-28, su main. Leggi il §9 e il §12 di
docs/account-client-progetto.md, il §16.1 di docs/account-progetto.md,
e gli esiti di P-10, P-11 e P-13 nel §6 di docs/prossime-sessioni.md.

P-13 chiede al motore quello che la pagina non deve calcolare da sé:
un risultato che riepiloghi un trasferimento su più lotti — uid già
confermati, scarti locali e del server, ritenti —, e uno che descriva
le righe che non si possono inviare entro il limite. Prima guarda se
le sei funzioni della coda di P-10 bastano già: se sì, scrivilo nel
§9 del progetto del client con l'esempio d'uso, e non aggiungere
niente. Se no, le funzioni nuove con i loro test scritti prima, fra
gli orfani dichiarati finché P-18 non le chiama.

Il progetto del client è stato scritto prima di P-11: dove il suo §1 o
il §9 descrivono il server com'era — il 202 della registrazione, le
rotte che mancavano —, correggili con quello che P-11 ha fatto,
dicendo che cosa è cambiato. Non ridisegnare niente del client.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-29 — Claude: la prova nel browser, per i controlli del client

**Stato:** pronto, dopo P-28. **Dove:** Claude Code, `~/Software/rotta-giusta`,
ramo **`main`**, a mano. **Nasce da:** P-13, §12 di
`docs/account-client-progetto.md`.

```
Sessione P-29, su main. Il §12 di docs/account-client-progetto.md
chiede diciotto gruppi di controlli, C-01…C-18, che guardano la pagina
vera: storage, rete, cookie, due schede, offline. La suite oggi non
guida nessun browser, e il repo non ha dipendenze.

Prima una misura, poi il codice. Misura le strade per guidare un
browser vero dalla suite — per esempio Chrome headless attraverso il
suo protocollo con il WebSocket che Node ha già — e scrivi nel §12
del progetto quale regge, con che cosa costa e che cosa non copre. Se
nessuna regge senza una dipendenza nuova, fermati e dillo nel
resoconto: aggiungerne una è una decisione dell'autore.

Poi il banco, con il meccanismo di P-06: i controlli riconoscono se la
pagina ha il client degli account o no, main resta verde con la pagina
di oggi, e il regime nuovo si esercita su una pagina di riferimento
finché P-18 non c'è. Comincia da C-01, C-02 e C-05, e prova ognuno al
contrario; gli altri entrano quando il banco regge, in questa
sessione o in una dopo — dillo nel resoconto. R-ACC dal banco nel §9.9
della specifica.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-18 — ChatGPT: la realizzazione del client degli account

**Stato:** in attesa di P-28 e P-29, e che la regia allinei `ui/main`. **Dove:**
app di ChatGPT, progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`.

```
Sessione P-18. Realizza docs/account-client-progetto.md in
site/app.html e site/index.html. Prima leggi gli esiti di P-11, P-28 e
P-29 nel §6 di docs/prossime-sessioni.md: il server ha le rotte che il
progetto dava per mancanti, e i controlli del §12 ora esistono e
girano. I testi del §1 di docs/prossime-sessioni.md cambiano in questa
stessa sessione, tutti — la privacy compresa, che poi passa
dall'autore.

La contabilità della coda è nel motore: la pagina la chiama, non la
rifà. Se la funzione di P-17 esiste, sostituisce tagPerTentativo().
Se un contratto o un controllo ti sta stretto, fermati e dillo: cambiarlo
tocca main.

Non toccare docs/prossime-sessioni.md. Tutte le suite verdi, i
controlli del §12 compresi, collaudo guardato a 375 e 1280 px e in un
Safari vero se c'è, voce in fondo a [Unreleased], un commit con il
trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

---

### I segnaposto — i prompt che non si possono ancora scrivere

Qui sotto c'è **tutto quello che resta** fino alla versione con gli account e
alla fine del ridisegno, perché niente si perda. Ogni segnaposto ha già il suo
numero, che cosa aspetta, e che cosa il prompt dovrà contenere; il testo del
prompt no, perché punterebbe a documenti che non esistono ancora. La regia lo
scrive quando si chiude quello che aspetta, e lo scrive **qui, al posto del
segnaposto**.

#### P-19 — ChatGPT: la realizzazione dell'area 3

**Aspetta:** P-14. **Dove:** `ui/main`. **Dovrà contenere:** realizzare
`docs/area-3-progetto.md`; `erroriSessione()` che esce dagli orfani dichiarati;
le dipendenze da test e specifica che il progetto avrà scritto, chiuse prima da
Claude come ha fatto P-06 per l'area 2.

#### P-20 e P-21 — ChatGPT: l'area 4, Carteggio — progetto, poi realizzazione

**Aspetta:** P-19. **Dove:** `ui/main`. **Dovrà contenere:** i capitoli 12–15
della Specifica UX/UI (`prossima-versione.md` §5.1); il vincolo del §7.3 della
specifica — il giudizio è di chi studia, detto all'ingresso (R-UX-03) —;
l'eccezione `figura` di `docs/eccezioni-interfaccia.md`, se l'area 3 non l'ha
chiusa.

#### P-22 e P-23 — ChatGPT: l'area 5, Progressi — progetto, poi realizzazione

**Aspetta:** P-21. **Dove:** `ui/main`. **Dovrà contenere:** il capitolo 16;
**Progressi è dei soli registrati** (ADR-004), quindi viene dopo il client;
Q-DUE — le due classifiche, e `peggiori()` ancora orfana — deciso dall'autore
prima del progetto; le tabelle che sforano a 375 px, difetto aperto dalla 0.3.0.

#### P-24 e P-25 — ChatGPT: l'area 6, rifinitura trasversale — progetto, poi realizzazione

**Aspetta:** P-23. **Dove:** `ui/main`. **Dovrà contenere:** i capitoli 17–22;
le misure dell'appendice A della specifica rifatte sul tema chiaro; lo zoom
nativo al 200 % che P-05 non ha potuto verificare nel browser integrato.

#### P-26 — Claude: i testi fuori da `site/`, nella versione con gli account

**Aspetta:** P-18. **Dove:** `main`, a mano. **Dovrà contenere:** i punti del
§1 di questo file che non sono della pagina — `README.md` («niente account,
niente registrazione»), la skill `.claude/skills/rotta-giusta/SKILL.md`
(«nessun server»), `AGENTS.md` («`site/` è l'unica cosa pubblicata»,
`account-progetto.md` §18) —; il §2.5 della specifica e le sezioni che
descrivevano il prodotto senza account, riscritte ora che è vero; il §2 di
`docs/filosofia.md` riletto. Nella stessa versione in cui la pagina cambia, non
prima.

#### P-27 — la regia, con tutti: il traguardo

**Aspetta:** P-15, P-18, P-26, e gli adempimenti del §15.4 di
`account-progetto.md` chiusi dall'autore. **Dove:** `main`. **Dovrà
contenere:** la merge di tutto; il rilascio come dice `AGENTS.md` — numero nei
tre posti, voce, tag, push chiesto, «Build now» — **più il server**, aggiornato
con `rg-aggiorna` allo stesso tag; poi le due verifiche che solo quel giorno può
fare: un archivio vero nel browser che passa nell'account senza perdere una riga
(R-ACC-05), e il cookie fra `rottagiusta.it` e `api.` su un Safari vero
(Q-PROVE). Il §5 di questo file è la lista di controllo. **Trenta giorni
dopo**, la soglia degli allarmi riletta sul registro vero
(`account-progetto.md` §15.4).

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
- **26 settembre 2026 — P-06 chiuso.** I controlli dei quiz reggono i due
  regimi, e P-05 riceve il contratto che la suite esegue. Pronti insieme P-05 e
  P-09. Entra il punto 5b: chiudere il regime vecchio dopo P-05.
- **26 settembre 2026 — P-09 chiuso.** L'account c'è. P-10 pronto per le righe
  e la sincronia; il pezzo 4c prende anche il cambio d'indirizzo e il profilo,
  e aspetta la decisione dell'autore sulla registrazione che dice chi è
  iscritto. P-10 porta dentro la lezione di P-09: un test che riavvia il server.
- **26 settembre 2026 — «email già registrata».** L'autore ha deciso che la
  registrazione dice apertamente se un'email è iscritta. Scritto nel §4 con le
  conseguenze; lo porta nel progetto, nella specifica e nel server P-11, perché
  P-10 lavora negli stessi file.
- **26 settembre 2026 — da P-11 a P-15.** Su richiesta dell'autore, i prompt
  scritti prima che si chiudano quelli da cui dipendono, con lo stato «in
  attesa di» accanto: il pezzo 4c del server con «email già registrata», la
  chiusura del regime vecchio dei quiz, il progetto del client degli account, il
  progetto dell'area 3 e la messa in esercizio accompagnata. Restano da scrivere
  la realizzazione del client, le aree 4–6 e il traguardo, perché dipendono da
  documenti che non esistono ancora. La decisione «email già registrata» è
  scritta anche in `account-progetto.md` e nella specifica (R-ACC-30): la
  cartella principale era libera.
- **26 settembre 2026 — i segnaposto, e P-05 fermo alla merge.** Su richiesta
  dell'autore, tutto quello che resta ha un numero nel §6: P-16 e P-17 scritti
  per intero, perché nascono dai resoconti di P-05 e P-01; da P-18 a P-27 come
  segnaposto, con che cosa aspettano e che cosa dovranno contenere. La merge di
  P-05 si è fermata sul `pre-commit`, che non riconosce la chiusura di una
  merge: annullata senza perdite, e nel §4 le due strade per rifarla.
- **26 settembre 2026 — `merge=union`.** Scelta dell'autore: il CHANGELOG si
  fonde da sé. La merge di P-05 aspetta che P-10 liberi la cartella.
- **26 settembre 2026 — la segnalazione a `Standards`.** Con il sì dell'autore:
  [ilbeca/standards#1](https://github.com/ilbeca/standards/issues/1), etichetta
  `bug`.
- **26 settembre 2026 — P-10 e P-05 chiusi.** P-05 fuso con `merge=union`,
  che ha tenuto da solo le voci dei due lati. Pronti P-13 per ChatGPT e P-11,
  P-12, P-16, P-17 per Claude, in quest'ordine: P-11 per primo perché è sulla
  strada del traguardo. P-11 prende anche i punteggi dei Segnali nell'export.
- **26 settembre 2026 — P-11 e P-13 chiusi.** Il server ha tutte le sue rotte.
  Il progetto del client chiede diciotto controlli in un browser vero prima del
  codice: nascono P-28 (i contratti del motore, e il progetto riallineato a
  P-11) e P-29 (la prova nel browser), e P-18 passa da segnaposto a prompt. P-15
  aspetta un tag che contenga il server: il rilascio intermedio del §4 serve
  anche a quello.
- **26 settembre 2026 — la soglia, e il sì al rilascio intermedio.** Soglia a
  100 su delega, da rileggere dopo trenta giorni di esercizio. La regia rilascia
  la v0.28.0 in un commit a sé.
