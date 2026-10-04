# Prossime sessioni — la coda, con i prompt

**Aggiornato il 4 ottobre 2026.** Territorio neutro. **Penna: la sessione di regia** (sotto, «Come si usa»).

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
| `docs/adr/` | le decisioni, una per file | Claude, su `main` | ADR-002 superato; 001, 003, 004 e 005 validi, il 004 sostituito in parte dal 005 |
| `docs/idee-dopo-gli-account.md` | il brainstorming P-59: le idee, e in fondo «Le decisioni di P-59» | neutro | chiuso il 4 ottobre 2026; le decisioni diventano vincolanti quando entrano nella specifica o in un ADR (P-63) |
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
   **Solo quando nessuna sessione di ChatGPT è aperta**: prima guarda
   `git -C ../rotta-giusta-ui status --short`, e se l'autore ha appena lanciato
   un prompt di ChatGPT aspetta il suo resoconto. Spostare il ramo sotto una
   sessione che lavora è uno dei cinque modi in cui due agenti si sono rotti a
   vicenda il 7 settembre. Il 26 settembre la regia ha allineato una volta senza
   saperlo: la cartella era pulita, ed è andata bene per caso.
6. **Una sessione di Claude può partire da un pulsante** che la regia propone
   nella sua chat. Il pulsante non ripete il prompt: dice soltanto di copiarlo
   dal §6, così resta uno solo. La sessione che parte così lavora **in un
   worktree suo**, su un ramo che il recinto non rivendica: può toccare solo i
   file neutri e i condivisi, e il suo commit arriva su `main` con la merge
   della regia. Un prompt che tocca `motore` o `regole` — `tests/`,
   `territori.yaml`, `site/engine.js` — non parte da un pulsante: si apre a
   mano, nel checkout principale su `main`. Il §6 dice quale è quale. ChatGPT
   non ha pulsanti: si apre la sua app.

7. **Ogni prompt dice nella sua prima riga per quale agente è e in quale
   cartella**, e chiede all'agente sbagliato di fermarsi senza scrivere. Il
   titolo lo diceva già, ma il titolo non si incolla: il 26 settembre P-34, un
   prompt per Claude, è partito in ChatGPT nella cartella principale, e nessuno
   dei due aveva modo di accorgersene. La riga la legge l'agente, non l'autore.

8. **Quando l'autore glielo delega, la regia lancia lei le sessioni di Claude**,
   come sotto-sessioni in background nella cartella principale, su `main`, una
   alla volta. Deciso dall'autore il 30 settembre 2026, per la fila P-49,
   P-32…P-35, perché non poteva stare al computer. Il prompt è quello del §6,
   parola per parola; il resoconto arriva alla regia invece che all'autore, e
   la regia fa i suoi passi — commit, suite sullo stato vero, esito, commit
   della coda — **prima** di lanciare la successiva. La fila si ferma, e aspetta
   l'autore, a una suite rossa o che non torna con il resoconto, a una
   decisione per l'autore che blocca il passo dopo, o a una sessione che si
   ferma da sola. ChatGPT non si lancia così: ha la sua app.

### Che cosa fa la regia, passo per passo

Scritto il 30 settembre 2026 perché la regia possa passare da una sessione
all'altra senza perdere il metodo. A ogni resoconto incollato dall'autore:

1. **Chi è al lavoro.** `git status --short` nella cartella principale e in
   `../rotta-giusta-ui`; se una sessione di Claude lavora nella principale, la
   regia tocca solo questo file e lo mette in stage per nome.
2. **Il commit esiste** (`git log`), con il trailer giusto, e questo file l'ha
   toccato solo la regia (`git log -- docs/prossime-sessioni.md`).
3. **Per un ramo di ChatGPT o un worktree:** `python3
   ../Standards/tools/check_territories.py --range main...<ramo>`, poi `git diff
   main...<ramo> --stat`, poi `git merge --no-ff <ramo>`. Il CHANGELOG si fonde
   da sé (`merge=union`): dopo, si aggiunge la riga vuota che manca fra due
   voci. Se una merge si ferma con un conflitto su file non condivisi, si
   annulla (`git merge --abort`) e non si aggira il `pre-commit`. **Dopo la
   merge, `git log main..<ramo>` dev'essere vuoto**: se non lo è, il ramo è
   andato avanti rispetto al resoconto, e si guarda che cosa c'è prima di
   chiudere il prompt. Una merge del commit citato nel resoconto invece della
   punta del ramo ha lasciato fuori, per quattro giorni, una correzione di P-08
   (registro, 30 settembre).
4. **Le suite, sullo stato fuso**, e i numeri confrontati con il resoconto:
   motore, server, dati, interfaccia, specifica. Prima dell'interfaccia,
   `lsof -iTCP:8620 -sTCP:LISTEN` vuoto. Una suite rossa una volta sola si
   rilancia: se è instabile, è un prompt, non un dettaglio.
5. **Il resoconto letto contro il repo**: una riga «Trovato» o «Per l'autore»
   senza un posto scritto torna indietro. Un documento di progetto nuovo si
   legge nel suo §10.1: le dipendenze per Claude diventano prompt.
6. **La coda:** il prompt si chiude con **Stato** e **Esito** (che cosa ha
   fatto, che cosa la regia ha controllato e che cosa no); i prompt sbloccati
   passano a pronti; i nuovi si scrivono con la riga «per chi è»; la tabella,
   il §4 e il registro si aggiornano. Poi un commit, solo di questo file e dei
   documenti che la decisione tocca.
7. **Allineare i rami di ChatGPT** — `git -C ../rotta-giusta-ui merge --ff-only
   main`, e lo stesso per `rotta-giusta-vetrina` — solo con la loro cartella
   pulita e nessuna sessione di ChatGPT aperta.
8. **Una decisione dell'autore si scrive subito** dove si decide — specifica
   §10, §20 di `account-progetto.md`, un progetto d'area — e qui nel §4; se una
   sessione sta scrivendo in quel file, la si porta dentro il prompt che lo
   toccherà.
9. **Un rilascio** lo fa la regia con il sì dell'autore, come dice `AGENTS.md`;
   e fino al traguardo `main` non si pusha (§4).

### Come si riprende la regia in una sessione nuova

Quando la sessione di regia si avvicina al limite del suo contesto, se ne apre
una nuova di Claude Code nella cartella principale, e le si dà questo:

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sei la nuova sessione di regia di Rotta Giusta. Leggi AGENTS.md, e poi
docs/prossime-sessioni.md per intero: «Come si usa», «Che cosa fa la
regia, passo per passo», la coda, il §4 e il §6 con gli esiti di tutti
i prompt chiusi. È l'unica memoria della regia precedente: quello che
non c'è scritto non lo sai, e non lo inventi. Poi leggi in
docs/idee-dopo-gli-account.md la sezione finale, «Le decisioni di
P-59».

Poi controlla lo stato vero — git log, git status nella cartella
principale e in ../rotta-giusta-ui, i rami non fusi, i worktree — e
dimmi in poche righe dove siamo, che cosa è in corso, che cosa è pronto
e che cosa aspetta una mia decisione.

Dove siamo, perché tu lo verifichi e non lo prenda per buono: la
v0.30.0, il sito senza offline, è in linea dal 3 ottobre 2026 su
rottagiusta.it, .pages.dev e api.rottagiusta.it. P-59, il brainstorming,
è chiuso il 4 ottobre, e la regia l'ha smistato: la tabella della coda
e «Dopo P-59» nel §4 dicono che cosa è pronto. Pronti: P-63 e P-64 per
Claude, P-65 per ChatGPT, P-62 con l'autore.

I prossimi passi, in quest'ordine:
1. I resoconti di P-63, P-64 e P-65, e da ciascuno il prompt che
   sblocca: i segnaposto P-66…P-70 dei mock, e le righe 20–23 della
   coda, che aspettano P-63 e la prova con le persone.
2. Le decisioni dell'autore in «Dopo P-59» nel §4: ricordagliele quando
   il lavoro che le aspetta sta per partire.
3. Il §4, «Dopo il traguardo»: il redirect di .pages.dev dal 16
   ottobre, la soglia degli allarmi dal 2 novembre.

Non lanciare niente e non scrivere niente finché non te lo chiedo: da
lì ti incollerò i resoconti.
```

**I due paragrafi «Dove siamo» e «I prossimi passi» li riscrive la regia
uscente**, nel suo ultimo commit: sono l'unica parte del prompt che invecchia.
Il 2 ottobre 2026 la sessione nuova è partita dal prompt corto, e l'ordine dei
passi è arrivato dall'autore in chat: un'informazione che viveva fuori dal file.

La prima risposta della sessione nuova è anche la prova che questo file basta:
se dice qualcosa di sbagliato o le manca qualcosa, il difetto è qui, e va
scritto qui.

**Tre cose che la regia non può fare da sé, misurate il 2 ottobre 2026:**
fermare la sessione di un'altra attività, lanciare «Run now» di un'attività
programmata, e aprire sullo schermo una sessione che non ha avviato lei — il
controllo dei permessi dell'app le nega, e non si aggira. Le fa l'autore; la
regia legge l'esito. E il passaggio di una routine non è una riga della barra
laterale: sta sotto la sua routine, nel pannello dei passaggi.

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
| 14 | **La casella `privacy@` sull'iPhone**, e la prova `dkim=pass` | Claude con l'autore | `main`, solo `account-progetto.md` | niente | P-62 |
| 15 | **Le decisioni di P-59, formali**: un ADR, la filosofia, il §10 della specifica; e via i nomi «vetrina» e «palestra» dai documenti | Claude | `main` | niente | P-63 |
| 16 | **«Com'è andata» dopo l'esame, e le previsioni registrate**: il progetto | Claude | `main`, solo file neutri | P-63 fuori dalla cartella | P-64 |
| 17 | **I mock della nuova interfaccia**, in cinque passi, in `docs/prototipi/` | ChatGPT | `ui/main` | niente per il primo; ognuno aspetta il precedente | P-65, poi P-66…P-69 |
| 18 | **La prova dei mock** con tre-cinque persone vere, e con i bot sulle varianti | l'autore, con Claude | — | P-69 | P-70 |
| 19 | **Le ricerche**: il parere del professionista sulle donazioni (14 domande, I-11); se all'esame vero si torna indietro fra le domande; Lighthouse su telefono e Safari veri (I-08) | l'autore | — | — | §4, «Dopo P-59» |
| 20 | **I contratti del motore**: cinque stati, Percorso, tag, costanza, segnalibri, cerca per numero, obiettivo | Claude | `main` | P-63 | da scrivere |
| 21 | **Il progetto e la realizzazione del ridisegno**, con i controlli dei tragitti | ChatGPT, e Claude per i controlli | `ui/main`, `main` | P-70 | da scrivere |
| 22 | **Spiegazioni**: il primo lotto di 50, «Segnala un problema», la misura dell'effetto | Claude con l'autore, poi ChatGPT | `main`, `ui/main` | P-63; l'indirizzo e la licenza (§4) | da scrivere |
| 23 | **La stima**, come ricerca parallela: il modello, gli studenti finti, la validazione | Claude | `main` | P-63 e P-64 | da scrivere |
| — | Decisioni e passi dell'autore | l'autore | — | — | §4, «Dopo P-59», «Dopo il traguardo» e le voci non barrate |

**La v0.30.0 è in linea dal 3 ottobre 2026**, sulla pagina e sul server; P-59,
il brainstorming, è chiuso il 4 ottobre, e questa tabella è il suo
smistamento. **Per Claude:** P-63, le decisioni formali, per primo, perché
tutto il resto ci si appoggia; poi P-64; P-62 con l'autore quando vuole, tocca
soltanto `account-progetto.md`. **Per ChatGPT:** P-65, il primo dei cinque
mock. L'ordine è quello deciso con l'autore il 4 ottobre: prima le decisioni
che cambiano una promessa (un ADR, la filosofia, la specifica), poi i mock e la
prova con le persone, poi il codice; «com'è andata» parte presto perché i suoi
dati arrivano mesi dopo. **Il §5, il §6 e i controlli R-NAV della specifica non
si riscrivono con P-63**: descrivono la pagina che c'è, e cambiano con il
progetto del ridisegno, dopo la prova con le persone. Rilasci piccoli e frequenti (deciso dall'autore il 3
ottobre 2026): ogni rilascio è un «Build now», più `rg-aggiorna` quando cambia
il server. I prompt di Claude vanno uno alla volta nella cartella principale,
e la suite dell'interfaccia di un worktree esclude quella dell'altro, per la
porta 8620. Il numero di una riga è il suo nome, non la sua posizione.

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

*Fatto: i testi sono cambiati con P-18 e P-26, e sono nel sito pubblicato dalla
v0.29.0. La sezione resta com'era, come traccia di che cosa si è cercato.*

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

- **Dopo P-59** (4 ottobre 2026) — quello che «Le decisioni di P-59» lasciano
  a te, con il lavoro che ciascuna ferma:
  1. **La frase della filosofia sulla stima** (I-12): la proposta è lì, «Non
     ti diciamo che supererai l'esame. Ti diciamo, quando abbiamo abbastanza
     risposte per dirlo, come andresti in una prova estratta come all'esame —
     e che cosa questa stima non sa». Ferma la riga 23, e la riga della
     filosofia che P-63 lascia marcata.
  2. **L'indirizzo per le segnalazioni** (C-03): `privacy@` o uno nuovo; la
     proposta è `segnalazioni@`. Ferma «Segnala un problema» (riga 22), e va
     nell'informativa.
  3. **Quante risposte fanno un giorno di attività** (I-15): la proposta è
     un'attività conclusa, anche da dieci domande. Ferma la costanza nella
     riga 20.
  4. **I nomi definitivi delle voci**: Home · Allenati · Esame · Progressi è
     deciso; «si prova con persone che chi cerca i quiz li trovi». I bot del 4
     ottobre dicono che nella struttura approvata «quiz su un argomento» cade a
     1/5, perché «Allenati con 10 domande» in Home ruba l'intenzione alla voce
     «Allenati»: è un segnale debole, e lo guarda P-65. Si chiude dopo P-70.
  5. **Il parere del professionista sulle donazioni** (I-11): le 14 domande
     sono nella scheda. Ferma le donazioni, e nient'altro.
  6. **La licenza delle spiegazioni** (I-10): MIT come il codice, o una licenza
     per i testi. Ferma la pubblicazione del primo lotto (riga 22).
  7. **Se all'esame vero si torna indietro fra le domande**: nessuna fonte
     guardata lo dice; se sì, la simulazione dovrebbe permetterlo. Da chiedere
     alla scuola nautica, come Q-CART4.
  8. **La issue #1 su GitHub** si chiude in un verso con la decisione 14 (due
     giuste ad almeno 12 ore): la regia la commenta e la chiude con il tuo sì,
     dopo P-63.
  **Una nota da riallineare:** una sessione parallela sul menu, riportata in
  P-59 e non nel repo, scrive «congelamento della serie scartato, visto che hai
  deciso che si azzera». La decisione 19 dice il contrario — «giorni di
  attività negli ultimi 14», senza serie che si spezza —, e vale lei: i prompt
  dei mock lo dicono, e quella sessione, se è ancora aperta, va corretta da te.
  **Fuori dal repo, e da sapere:** `~/bot-ux/` (il banco dei bot e la lettura
  del 4 ottobre) e le 14 schermate di quella sessione parallela. Quello che
  serve ai mock è riassunto in I-09 e I-18; il resto, se conta, va portato in
  `docs/prototipi/` da chi lo usa.
- **Dopo il traguardo** (3 ottobre 2026, dal resoconto di P-27):
  1. **Il passaggio dell'archivio di prima degli account — deciso
     dall'autore il 3 ottobre 2026: si toglie subito.** Il suo criterio: se
     per chi usa il sito l'esperienza non cambia, si toglie. Non cambia per
     nessuno che arrivi dalla 0.29.0 in poi; cambia, in peggio, per chi aveva
     risposte nel browser prima del 3 ottobre e non le ha ancora portate —
     non le vedrà più, e nessuno glielo dirà —, e quante siano queste persone
     non si sa. Scartata la proposta della regia, toglierlo con una data.
     **Precisato dall'autore lo stesso giorno: si considera che nessuno abbia
     usato il sito prima degli account.** La pagina non legge e non tocca più
     quelle risposte. Un lavoro solo con il punto 6: P-60 e P-61. Il testo di
     prima: togliere o no.
     Al traguardo l'autore ha deciso di non provarlo su un archivio vero
     (R-ACC-05 sull'archivio vero, R-ACC-62), perché pensa di togliere la
     funzionalità. Oggi l'intenzione è scritta soltanto nella voce
     «Verificato — la v0.29.0, in esercizio» del CHANGELOG. Se si toglie, è
     una decisione da scrivere — un ADR, o il §10 della specifica, perché
     cambia la quarta condizione dell'ADR-004 (§2.4 della specifica) —, e poi
     un prompt che tolga insieme codice, testi e controlli (R-ACC-05, C-09,
     R-ACC-62, e le righe della specifica che la nominano — §2.4, §3.2, §5.4,
     §7.1, §7.8; l'informativa non la nomina, cercato il 3 ottobre),
     sapendo che R-ARCH-07 tiene il nome del database proprio per quel
     passaggio. Finché c'è, la tiene soltanto il banco, su un archivio
     sintetico.
  2. ~~**Il ramo `fix/0.28.1` si può togliere**~~ — **tolto il 3 ottobre
     2026**, dal Mac e da GitHub, con il sì dell'autore. Il testo di prima: il campo
     «Branch» di statichost.eu è tornato `main` al passo 4 di P-27, e il suo
     unico commit fuori da `main`, `affc37d`, è il tag `v0.28.1`, che resta.
     Toglierlo da GitHub è una scrittura sul remoto: la fa la regia con il sì
     dell'autore.
  3. **Dal 16 ottobre 2026** — e con una condizione nuova da P-60: anche dopo
     il redirect, `.pages.dev/sw.js` deve rispondere 200 con il `sw.js` che si
     disinstalla, altrimenti chi ha la palestra installata lì resta fermo
     (`migrazione-hosting.md`, ADR-005) —, il redirect di `.pages.dev` (fase D2 di
     `docs/migrazione-hosting.md`): oggi serve anche lui la 0.29.0.
  4. **Dal 2 novembre 2026**, trenta giorni dopo il traguardo, la soglia degli
     allarmi riletta sul registro vero (§15.4 di `account-progetto.md`). Nel
     registro vero ci sono le righe delle prove del traguardo — una lettura
     del titolare, un'opposizione messa e una ritirata, con un motivo che lo
     dice —, anche nel file `/var/lib/rg/cancellazioni` (§2.8).
  5. **Safari su iPhone e in navigazione privata**: non provati al traguardo,
     restano in Q-PROVE (§19 di `account-progetto.md`).
  7. **Da P-60, per l'autore** (ADR-005): la decisione è in tensione con la
     frase della filosofia «una che scopri dopo è un inganno», e
     `filosofia.md` lo dice accanto, senza riscriverla («Che cosa si perde»,
     punto 5); i due anni di `sw.js` pubblicato sono una scelta di P-60, e si
     possono accorciare; e una variante non considerata — dire che l'archivio
     di prima c'è, senza leggerlo — è fra le «Alternatives Considered».
  6. **L'offline — deciso dall'autore il 3 ottobre 2026: si toglie, per
     semplicità.** I suoi motivi: la «seconda ricarica» dopo un rilascio è un
     comportamento strano che pochi utenti capirebbero; dubita che l'offline
     serva a una parte discreta di chi studia; e con gli account le risposte
     stanno sul server. Il prezzo: senza rete il sito non si apre, e «anche in
     barca» esce dalla vetrina. **Ne deriva la regia:** un `sw.js` che si
     disinstalla da solo e cancella le cache, senza forzare la ricarica — la
     0.29.0 in linea installa il service worker a chi la visita, e senza quel
     file quei browser resterebbero sulla versione vecchia per sempre —; la
     versione in due posti invece di tre; la copia delle risposte nel
     dispositivo, per chi ha l'account, **resta**, perché è la coda che le tiene
     quando la rete cade e ci vive la bozza del carteggio (proposta della
     regia, che l'autore non ha cambiato). Un lavoro solo con il punto 1:
     P-60 per Claude, P-61 per ChatGPT, poi il rilascio 0.30.0.
- ~~**Da `b50edec`, il 29 settembre 2026, `main` non si pusha fino al
  traguardo.**~~ — **superato il 3 ottobre 2026**: `main` e `v0.29.0` sono
  pushati (P-27). Da qui vale la regola di `AGENTS.md`: nessun push senza
  chiedere, e «Build now» con il commit di rilascio in cima. Il testo di
  prima: Contiene la pagina con gli account, e il server in produzione non
  c'è ancora: finché `.pages.dev` è acceso un push la pubblica lì da solo, con
  una registrazione che non può funzionare e un'informativa che descrive un
  server che non esiste. Su `rottagiusta.it` servirebbe «Build now», ma il
  rischio di `.pages.dev` basta. Se serve un rilascio prima del traguardo — una
  correzione urgente —, si fa da un ramo che parte dal tag `v0.28.0`, non da
  `main`. Il redirect di `.pages.dev` (fase D2, dal 16 ottobre) toglie la
  metà automatica del rischio, non l'altra.
- ~~**Quattro proposte di P-24 da decidere prima di P-25**~~ — **decise il 1°
  ottobre 2026**, tutte «no, per ora» (più sotto, «Decise dall'autore il 1°
  ottobre»). Erano nel §8 di `docs/area-6-progetto.md`.
- ~~**La privacy scritta da P-18 è una bozza**~~ — **completata il 1° ottobre
  2026** con le tue decisioni; resta «bozza» fino al parere e alle cose da fare
  del §15.4 di `account-progetto.md`.
- ~~Q-ONBOARD~~ — **chiusa il 1° ottobre 2026**: solo la data, facoltativa
  (più sotto).
- ~~Il push di `main`, quando lo si vuole~~ — **superato dalla prima riga di
  questo §4**: `main` si pusha al traguardo, passo 2 di P-27. Resta vero che su
  `rottagiusta.it` il push non pubblica niente da solo: serve «Build now».
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
- ~~Il testo del carteggio non è salvato «a ogni tasto»~~ — **deciso
  dall'autore il 26 settembre: l'avviso, e la conferma del browser prima di
  lasciare la pagina.** Tutti e due in P-36, per ChatGPT. La frase del §7.6
  della specifica è corretta dalla regia, e il difetto è fra i «Difetti noti,
  aperti» di `AGENTS.md`. La correzione vera resta P-34, con l'area 4.
- **Q-PROVE**, riaperta da P-05: le prove con persone e lo zoom nativo al 200 %,
  che il browser integrato non fa. `docs/area-2-collaudo-ux.md` dice che cosa
  manca.
- ~~Q-DUE~~ — **chiusa il 29 settembre 2026**: Progressi diventa una mappa per
  tema. I sette punti sono nel §10 della specifica, fra le chiuse; da lì P-41 e
  P-22.
- **La suite che dura, e Safari** — *Q-SUITE è chiusa dal 1° ottobre 2026,
  accettata a circa 240 s (più sotto); Safari resta dentro Q-PROVE.* Il testo
  di prima: rimandati dall'autore il 29 settembre, e
  scritti come punti aperti nel §10 della specifica: Q-SUITE, e Safari dentro
  Q-PROVE. **Q-SUITE è cresciuta:** dal 30 settembre la suite dell'interfaccia
  dura circa 150 s (erano 117), per le parti di P-46 che girano in fila sulla
  corsia della 8620; misura e motivo nel §10 della specifica. Resta tua.
- ~~Tre scelte di P-41 da confermare~~ — **confermate dall'autore il 29
  settembre**, e il §4.3 della specifica lo dice. Il testo di prima: La vela non ha
  la frase «Dove pesa di più adesso», perché un peso per voce non esiste; la
  soglia della frase è **20 quesiti visti**, quante le domande di una prova
  base; il motivo della frase è «da rifare» quando gli errori sono almeno
  quanti i mai visti, altrimenti «mai visti». Se ne cambi una, è una riga nel
  §4.3 e un test: dillo prima di P-23.
- ~~I file di esplorazione dell'area 5~~ — **tolti il 29 settembre, per scelta
  dell'autore.** La regia li ha spostati nel Cestino del Mac
  (`~/.Trash/rotta-giusta-area5-esplorazione-2026-09-29/`), non cancellati:
  si recuperano finché il Cestino non si svuota. Il worktree `ui` è pulito e
  `ui/main` è allineato.
- ~~Tre cose da P-34 e P-35~~ — **confermate dall'autore il 30 settembre
  2026**, tutte e tre, e scritte come confermate nel §9.4 del progetto del
  client e in D-03 e D-04 dell'area 4. P-21 è pronto. Il testo di prima:
  1. **Una scelta presa su delega di D-03**: un'attività di carteggio
     cominciata senza account resta senza bozza fino alla fine, anche se
     intanto entri; le sue righe passano nell'account dalle solite porte, alla
     fine. §9.4 di `account-client-progetto.md` e D-03 dell'area 4.
  2. **Tre testi nuovi** nel §9.4 del progetto del client: all'uscita con
     lavoro in corso «Su questo dispositivo c'è del lavoro di carteggio non
     concluso: uscendo lo perdi.», con «Resta qui», «Copia i risultati»,
     «Scarta il lavoro ed esci»; e la conferma dello scarto, con «Sì, scarta la
     bozza». C-19 li cerca parola per parola: cambiarli è una riga lì e una
     nel test.
  3. **Una scelta presa su delega di D-04** (P-35): il lavoro del runner della
     carta ha la forma della bozza in tutti e due gli stati — in memoria senza
     account, scritto in `meta` con l'account —, così le righe finali vengono
     da `concludiBozza()` in tutti e due, e senza account niente arriva in uno
     storage. §10.1 D-04 dell'area 4 e §7.6 della specifica.
  E Q-SUITE cresce ancora: con C-19 la suite dell'interfaccia dura circa 170 s.
  P-21 le porta nella pagina.
- **Decise dall'autore il 1° ottobre 2026**, su una proposta che la regia ha
  verificato prima di chiedere:
  1. **Le quattro proposte del §8 dell'area 6: «no, per ora», tutte e quattro.**
     Nessun cambio di gerarchia; nessun ingresso rinominato o spostato prima di
     prove con persone (Q-PROVE); le figure tengono l'alt di oggi, con il limite
     dichiarato; il tema scuro (Q-TEMA) è un'opzione futura, non un requisito.
     P-25 diventa rifinitura: i cinque difetti T-* misurati.
  2. **Q-ONBOARD: solo la data**, facoltativa (R-ACC-55), e nessun piano di
     studio per il traguardo: si riapre se l'uso lo chiede.
  3. **Q-SUITE: accettata**, circa 240 s. Le alternative toccano sicurezza o
     affidabilità; durante il lavoro si fa girare un gruppo, la suite intera
     prima del commit.
  4. **Zoom nativo al 200 % e lettore di schermo vero** (R-RIF-10, 13, 14, 15)
     restano prove dell'autore, fuori dalla merge di P-25 e dal traguardo.
  5. **Il rilascio di correzione 0.28.1, con il solo P-36**: sì (punto sotto).
  **Scritte il 1° ottobre** nel §8 dell'area 6 e fra le chiuse del §10 della
  specifica, da cui escono Q-TEMA, Q-ONBOARD e Q-SUITE.
- **Il sito pubblicato perde il testo del carteggio senza dirlo** (trovato da
  P-50 il 1° ottobre 2026, verificato dalla regia sul tag): la v0.28.0 non ha
  l'avviso e la conferma del browser di P-36, che sono su `main` dal 26
  settembre ma non sono mai usciti. Due strade: aspettare il traguardo, che
  porta la bozza vera; oppure un rilascio di correzione da un ramo che parte da
  `v0.28.0`, con il solo P-36, come dice la prima riga di questo §4. **Deciso
  dall'autore il 1° ottobre: il rilascio di correzione, 0.28.1 — pubblicato lo
  stesso giorno**, vedi sotto e il registro. *Dal 3 ottobre 2026 il ramo di
  build è di nuovo `main` (passo 4 di P-27).* **Il ramo di build di statichost.eu
  era `fix/0.28.1`**: nel pannello, sito rotta-giusta → «Source & build» →
  riquadro «Repository» → campo «Branch», poi «Save» sotto quel riquadro e
  «Build now» in «Builds». Al traguardo, lo stesso campo torna `main` (P-27). Due cose che
  il §4 non diceva, verificate dalla regia: **statichost.eu costruisce da
  `main`** (`migrazione-hosting.md`, «Un push non arriva a statichost.eu»),
  quindi l'autore porta nel pannello il ramo di build su `fix/0.28.1`, preme
  «Build now», e **al traguardo rimette `main`** — lo intercetta il `curl` di
  `sw.js` del traguardo, che mostrerebbe `rg-0.28.1`; e **il `pre-commit` non
  lascia a nessun ramo toccare `app.html`, `VERSION` e `meta.json` insieme**,
  quindi la regia prepara tutto in un worktree, `../rotta-giusta-fix`, e il
  commit lo lancia l'autore con `TERRITORI_OK=1`, che è suo. P-36 si applica a
  `v0.28.0` senza conflitti (provato in memoria). `.pages.dev` resta alla 0.28.0
  fino al redirect del 16 ottobre. Il traguardo diventa la 0.29.0.
- **Aperto il 2 ottobre 2026, per l'autore — che cosa resta dopo la sessione
  di quel giorno:**
  1. **L'attività «Registro privacy»: gira di nuovo, manca la prova senza
     nessuno davanti.** Era ferma dal 26 settembre sulla sua prima chiamata
     `Bash`. Il 2 ottobre, con l'autore: la sessione del 29 settembre non è
     stata fermata ma lasciata passare, e ha chiuso con il prompt di prima di
     OVH (riga del diario delle 21:52 del 1° ottobre, ora di Roma: tre messaggi,
     due prove e una pubblicità, nessuna richiesta né violazione); un passaggio
     partito subito dopo è stato interrotto a mano e non ha scritto niente; il
     «Run now» dell'autore ha chiuso in 48 secondi con il prompt nuovo (riga
     delle 21:55). `stato-scansione.json` è aggiornato, con
     `repo_ultimo_commit_letto` a `1f9601f`. **Si considera sbloccata quando un
     passaggio programmato chiude da solo**: il primo è alle 08:12 dell'orologio
     del Mac del 2 ottobre, e si vede dalla riga nuova in `diario-scansioni.md`.
     Tre cose trovate: l'elenco dei passaggi segna «succeeded» anche quello
     interrotto, quindi fa fede il diario; due mail nel cestino l'attività non
     è riuscita ad aprirle con `get_thread` («permesso negato») e le ha
     classificate da mittente, oggetto e anteprima — non si sa se il rifiuto
     vale solo per il cestino, e un avviso vero di un fornitore andrebbe letto
     per intero —; l'orologio del Mac è a +05:00, quindi «alle 8 e alle 20»
     sono le 5 e le 17 di Roma. **Guardato il 3 ottobre, dall'elenco dei
     passaggi e senza aprire la cartella:** il passaggio delle 08:12 del 2
     ottobre non è mai partito; quello partito il 2 ottobre alle 18:29 UTC è
     «failed», «Request timed out», dopo più di quattro ore; quello del 3
     ottobre alle 04:01 UTC è «succeeded», ma con attività fino alle 05:17, per
     un lavoro da un minuto. **Non è quindi dimostrato che giri da solo.** Da
     fare, con il sì dell'autore: leggere il diario e le trascrizioni dei due
     passaggi per vedere dove si sono fermati — un permesso che manca, o
     Gmail che non risponde.
     **Letto il 3 ottobre 2026, con il sì dell'autore:** l'attività gira da
     sola, e quando il Mac è sveglio fa il suo lavoro. Il passaggio fallito del
     2 ottobre si è fermato perché **il Mac è andato in stop a metà risposta**
     («Your computer went to sleep mid-response»), e poi è scaduto; quello del
     3 ottobre ha chiuso bene — riga nel diario, JSON riletto, riepilogo
     «Niente di nuovo» — con la prima ricerca Gmail scaduta e riuscita al
     secondo tentativo. Un passaggio saltato non perde niente: la finestra di
     ricerca parte da due giorni prima dell'ultima scansione, quindi il prezzo
     di un Mac spento è il **ritardo**, non una mail persa. Due limiti veri, da
     decidere: l'attività legge solo gli avvisi dei fornitori in Gmail, mentre
     richieste e allarmi del server — la parte con le scadenze — arrivano nella
     casella OVH di `privacy@`, che nessuna automazione legge; e il suo orario
     segue un fuso diverso da quello del Mac (`nextRunAt` alle 15:00 UTC per
     «20:00»), cioè gira alle 05 e alle 17 di Roma.
     **Deciso dall'autore il 3 ottobre 2026, e fatto:** l'attività dice
     quante ore sono passate dall'ultima scansione, in ogni riga del diario, e
     un RITARDO in cima al riepilogo sopra le 36 ore (il prompt di prima è in
     una copia della regia, fuori dal repo). Gli orari restano: il Mac è acceso
     di solito sempre — ma il 2 ottobre è andato in stop, e impedire lo stop è
     un'impostazione di sistema dell'autore. **Da fare:** la casella OVH di
     `privacy@` nell'app Mail dell'iPhone, con le notifiche, per le richieste e
     gli allarmi — la aggiunge l'autore, perché chiede la sua password, ed è
     in corso il 3 ottobre —. **Il filtro in Gmail è fatto**, il 3 ottobre
     2026, dalla regia con il sì dell'autore, nel suo Chrome: da Scaleway,
     IONOS, statichost.eu e OVHcloud, con le parole e le esclusioni della
     ricerca B dell'attività, mette una stella, l'etichetta rossa «Rotta Giusta
     — sicurezza fornitori», «importante» e «mai in spam». Funziona anche a Mac
     spento. Non è stato applicato alla posta già arrivata: zero messaggi
     corrispondevano.
  2. **Il DPA di statichost.eu: firmato e spedito dall'autore, la copia
     controfirmata è attesa.** Detto dall'autore alla regia il 2 ottobre 2026;
     la data di spedizione non è scritta. Quando torna: accanto al registro, e
     la riga del registro aggiornata. **Il traguardo non la aspetta** (sotto).
  3. ~~**Gli MX sono quattro**~~ — **sono cinque dal 2 ottobre 2026.** La guida
     OVHcloud elenca `mx0`…`mx4` (priorità 1, 5, 50, 100, 200) per tutte le
     offerte, Zimbra compresa; la diagnostica di Zimbra dà «Configurazione OK»
     anche con quattro. La regia ha aggiunto su IONOS, con il sì dell'autore e
     nella sua sessione di Chrome, `MX @ mx4.mail.ovh.net` priorità 200, TTL
     un'ora; verificato con `dig` sui quattro nameserver IONOS, su 1.1.1.1 e
     8.8.8.8; SPF, DMARC e i record di `posta.` intatti, sito e `api.` a 200.
  4. ~~**«Bozza» nella privacy**~~ — **deciso dall'autore il 2 ottobre 2026: si
     pubblica.** Niente parere firmato: vale il primo parere del 1° ottobre,
     non firmato. Niente PEC nell'informativa. E il traguardo **non aspetta**
     la copia controfirmata del DPA di statichost.eu: la privacy esce dicendo
     «responsabile del trattamento con un accordo scritto» con la firma
     dell'autore spedita e quella di statichost.eu attesa. La parola «Bozza»
     esce da `site/privacy.html` nel commit di rilascio, con la data del
     rilascio (passo 1 di P-27). **Il cancello degli adempimenti di P-27 è
     chiuso da questa decisione.**
  5. ~~**La firma DKIM di `privacy@` non è attiva**~~ — **attivata il 2 ottobre
     2026**, dalla regia con il sì dell'autore: la diagnostica di Zimbra dice
     «Configurazione OK» anche per il DKIM, e sul DNS le due chiavi rispondono.
     Resta da guardare `dkim=pass` nel sorgente di una mail vera spedita da
     `privacy@`: la manda l'autore. Il testo di prima: (trovato il 2 ottobre 2026,
     guardando la diagnostica di Zimbra su richiesta dell'autore, che aveva
     visto «Configurazione SPF anomala»). Nella diagnostica MX, SRV e **SPF
     sono «Configurazione OK»** — l'SPF dell'apice è quello della guida OVH,
     `v=spf1 include:mx.ovh.com ~all`, uno solo —; la scheda DKIM dice «La
     firma DKIM non è attiva», con il pulsante «Attivare la firma DKIM». Sul
     DNS i due CNAME `ovhmo-selector-1/2._domainkey` ci sono, ma le loro
     destinazioni su `om.dkim.mail.ovh.net` rispondono `NXDOMAIN`: le chiavi non
     esistono. Conta solo per la posta **spedita da** `privacy@`, cioè le
     risposte agli interessati; le mail del sito partono da `posta.`, con il
     DKIM di Scaleway, e non c'entrano. Si attiva dal pannello, con il sì
     dell'autore; non blocca il traguardo.
  **Fatti il 2 ottobre** con la regia, nella cartella del titolare: il registro
  dei trattamenti riletto (cinque trattamenti), le due LIA, la nota sulla DPIA,
  il PDF di Scaleway accanto, il `LEGGIMI.md` allineato a OVH; l'inoltro IONOS
  eliminato con il sì dell'autore (DNS verificato intatto); l'incoerenza del
  §15.4 su `privacy@` corretta. Deciso dall'autore: **niente copia di
  `privacy@` su Gmail** — riaprirebbe il punto 5 del parere e renderebbe falsa
  la privacy —; la casella OVH va nell'app Mail.
- **Trovato dal controllo del 2 ottobre 2026** — l'autore ha chiesto alla regia
  di verificare che l'ultima parte, fatta fuori dai prompt, non avesse lasciato
  indietro niente. La regia ha riletto l'informativa frase per frase contro il
  codice, cercato nel repo le frasi che il rilascio rende false, e guardato le
  ultime righe delle sessioni «Adempimenti progetto account» e della regia
  precedente. **Due cose bloccavano il traguardo, e sono fatte lo stesso
  giorno:** la prima con P-55 (`server/leggi.mjs`), la seconda con P-56 (la
  frase nel modulo, fusa), e il controllo della seconda con P-57 — che ha
  trovato il modulo di registrazione **sotto** il riepilogo, da P-18: lo chiude
  P-58, e il traguardo lo aspetta. **Da P-55,
  per l'autore**, nel §20 di `account-progetto.md`: nella procedura del
  titolare gli account si leggono con `leggi.mjs`, mai con `sqlite3`; e se le
  letture annotate debbano sopravvivere a un ripristino (proposta: tenerla
  così). Il testo di prima: **Due cose bloccano il traguardo finché l'autore non decide:**
  1. **L'informativa promette che ogni lettura del titolare è annotata, e lo
     strumento che la annota non esiste.** `site/privacy.html` dice «ogni
     lettura è annotata nel registro di sicurezza» e mette «le letture fatte
     dal titolare» fra le cose che il server annota. Il §15.1 di
     `account-progetto.md` descrive lo strumento — `leggi --email … --motivo`
     — come «Proposto», e nessun prompt l'ha mai fatto: in `server/` non c'è, e
     il registro non conosce un evento di lettura. È la stessa forma di P-54:
     una promessa che non è falsa solo finché nessuno legge. Due strade: lo
     strumento, sul modello di `server/opposizione.mjs`, prima del traguardo
     (consigliata: arriva sulla macchina con lo stesso tag); oppure togliere le
     due frasi dall'informativa.
  2. **Il modulo di registrazione non nomina le condizioni per l'account né i
     18 anni.** L'informativa poggia il salvataggio sull'esecuzione del
     contratto, «cioè delle condizioni per l'account», e dice che l'account è
     per chi ha compiuto 18 anni; le condizioni stanno in
     `/avvertenza#condizioni`, scritte il 1° ottobre. `moduloRegistrazione()`
     in `site/app.html` rimanda solo a `/privacy`: chi si registra non le
     incontra. Da decidere la forma — una frase con il link prima di «Crea
     l'account e salva», o una casella da spuntare —, poi è un lavoro piccolo
     su `ui/main`.
  **Non bloccano, e restano scritte:** i due fattori sull'account OVHcloud, che
  le sue condizioni chiedono e che il §15.4 non dice fatti (punto 6: Gmail,
  Scaleway, IONOS); la data di spedizione del DPA di statichost.eu;
  `dkim=pass` da guardare in una mail vera di `privacy@`; la cartella
  `~/Software/rotta-giusta-quarantena/p34-2026-09-26/`, che non serve più da
  P-34; la sessione «Donazioni PayPal e tassazione» del 25 settembre, di cui
  nel repo non c'è traccia — se conteneva una decisione, vive solo lì. *Letta il 3 ottobre 2026: era una ricerca, senza decisioni.*
  Diceva che il pulsante «Donazione» di PayPal è solo per enti benefici
  registrati, che a un privato resta un link PayPal.Me sul conto personale, che
  una donazione resta una liberalità solo se non promette niente in cambio, che
  Liberapay e GitHub Sponsors sono alternative, e che anche un semplice link va
  dichiarato nell'informativa. Fonti del 25 settembre, prima degli account: da
  riverificare quando si decide. E una
  cosa già falsa oggi nella specifica, che il passo 1 di P-27 corregge con le
  altre: dice «v0.28.0» dove il sito pubblicato è la 0.28.1, con l'avviso di
  P-36.
- **Da P-54, per l'autore** (1° ottobre 2026), nel §20 di
  `account-progetto.md`: l'opposizione alle statistiche vale per l'account —
  chi si cancella e si riscrive la chiede di nuovo —, da portare al parere; e
  se la pagina debba dire «sei fuori dalle statistiche». Nella procedura del
  titolare, fuori dal repo: quando arriva una richiesta,
  `server/opposizione.mjs`; e le statistiche si lanciano con
  `server/statistica.mjs`, mai con `sqlite3`.
- **Gli adempimenti, dopo il primo parere** (1° ottobre 2026) — *lo stato di
  oggi è nel punto «Aperto il 2 ottobre 2026» qui sopra e nel §15.4: resta la
  copia controfirmata del DPA; PEC e parere firmato sono decisi «no».* Il testo di prima: Le decisioni e
  l'esito punto per punto sono nel §15.4 di `account-progetto.md`, con
  l'elenco di che cosa resta: il DPA di statichost.eu da firmare **subito**, la
  casella `privacy@` su OVH (fatta il 1° ottobre: restano l'inoltro IONOS, il
  DMARC e l'attività programmata), la PEC, le due LIA e la nota sulla DPIA, il
  registro con quattro trattamenti, il PDF del DPA di Scaleway, un parere
  firmato se lo vuoi. E due pezzi di codice: l'esclusione dalle statistiche, su
  `main`, e Manrope servito da `site/`, su `ui/main`. I due fattori sono fatti.
- ~~**Alla messa in esercizio**~~ — **fatta il 1° ottobre 2026 con P-15**: la
  STARDUST1-S, le chiavi sulla macchina, il record di `api.`. Esito nel §6.
- ~~I worktree `rotta-giusta-p07` e `-p08`~~ — **tolti il 1° ottobre 2026**,
  con i loro rami già fusi, insieme a `rotta-giusta-fix`. *Dal 3 ottobre il
  ramo `fix/0.28.1` non serve più: «Dopo il traguardo», punto 2.* Il ramo `fix/0.28.1`
  resta, locale e su GitHub: statichost.eu costruisce da lì fino al traguardo,
  e **il campo «Branch» del pannello non va rimesso a `main` prima**, perché il
  `main` di GitHub è la 0.28.0 senza P-36, e una build qualunque lo
  ripubblicherebbe.

## 5 · Il traguardo: la versione con gli account

**Fatto il 3 ottobre 2026: la v0.29.0** (P-27, esito nel §6). Quello che segue
è il piano com'era scritto prima.

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

**Stato:** **chiuso il 30 settembre 2026**, commit `fd67e7d` su `main`, lanciato dalla regia (punto 8). Prima era: pronto: P-11 è chiuso, e P-05 è fuso. Il README ha già le cinque intenzioni (P-26); restano le righe del §5 della specifica. **Dove:**
Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

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

**Esito:** commit `fd67e7d`, voce nel CHANGELOG. I quiz hanno un regime solo:
tolti `MODI_SEI`, il ramo a sei ingressi e `regime_quiz()`; il banco gira su
qualunque pagina, pretende le cinque intenzioni in `MODI`, e la pagina vera fa
tante verifiche quante quella di riferimento, gruppo per gruppo. Provato al
contrario con `RG_PAGINA` sulla pagina di `ccd98f0^1`: prima passava i controlli
dei quiz con 5 verifiche e zero rossi, ora ha 7 rossi, ognuno col suo difetto.
La pagina di riferimento resta per le 16 rotture. Specifica §2.5, §5.3, §5.4,
§7.2, R-NAV-04/05/07, «Un regime solo per i quiz» nel §9.4; nota di chiusura
nel §10.1 dell'area 2. **Trovato:** del selettore globale «solo mai fatte»
resta il codice ma non l'interruttore — `S.prep` è sempre falso, e
`dipingiPrep()`, `quotaPrep()`, `#c-prep`, i rami «`S.prep ?`» e il CSS `.prep`
sono codice morto —; va a P-52. Controllato dalla regia: motore 185/187, server
60/60, dati 242, specifica 758, guardiano verde, interfaccia 1.873 in 189 s.

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

**Stato:** **chiuso il 26 settembre 2026**, merge `adf84a0`. **Dove:** come P-13.

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

**Esito:** commit `3bcc4b7`, `docs/area-3-progetto.md` e la sua voce.
Riepilogo, revisione e «riprova questi N», con testi, stati, contratti e
accettazione. **Ha trovato un difetto vivo del motore**, e la regia l'ha
riprodotto: una pausa di più di 20 minuti dentro la stessa attività registrata
la spezza in due, ed `erroriSessione()` restituisce un errore su due
dichiarando il confine registrato. Diventa P-30. Le dipendenze del §10.1 —
controlli in due regimi e specifica — diventano P-31, e il contrasto con il
§4.1 del progetto del client entra in P-28. Controllato dalla regia: territori
puliti, il diff tocca il progetto e il CHANGELOG, merge chiusa da sola.

### P-15 — Claude con l'autore: la messa in esercizio su Scaleway

**Stato:** **chiuso il 1° ottobre 2026**, commit `4d530e6` su `main`, in una sessione di Claude Code aperta dall'autore. Il tag `v0.28.0` contiene il server, senza R-ACC-49 (P-43): il prompt lo dice. **Dove:** Claude Code, `~/Software/rotta-giusta`,
ramo **`main`**, a mano: gli strumenti della macchina stanno nel repo. È una
sessione che si fa **insieme**, come P-08.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

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

Il tag da avviare è v0.28.0, l'unico pubblicato. Ha il server di
prima di P-43 — gli manca R-ACC-49, il Retry-After esposto dal CORS — e
un motore più vecchio di quello su main: per mettere in esercizio la
macchina basta, perché nessuna pagina la chiama, e al traguardo
rg-aggiorna la porta al tag nuovo. Scrivilo nel resoconto. Se serve
un altro tag, fermati: il rilascio lo fa la regia. Il
server in esercizio non riceve ancora nessuno, perché la pagina non lo
chiama fino alla versione con gli account. Non inserisci credenziali e
non accetti condizioni al posto dell'autore; nessun segreto nel repo.
Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `4d530e6` — un commit solo: la sessione ha corretto con
`--amend` il suo `3771d33` per aggiungere il riavvio, e su quello non si
appoggiava niente —, voce nel CHANGELOG, §2.8 nuovo e §19 di
`account-progetto.md`. **Il server è in esercizio**: STARDUST1-S `rg-api` a
`pl-waw-2` con una chiave SSH nuova; la macchina come il §2.7, con gli
strumenti in `strumenti/macchina/`; il gruppo di sicurezza chiuso prima di
aprire la 443; `api.` su IONOS con un certificato Let's Encrypt da Caddy; due
applicazioni IAM con policy minime e le loro chiavi messe sulla macchina
dall'autore; `RG_TITOLARE`; le copie due volte al giorno verso `nl-ams`; il
server avviato da `v0.28.0`; il riavvio automatico dopo un kernel di sicurezza
alle 03:30 UTC, deciso dall'autore nella sessione (§20). **Le misure del §19**:
una mail vera con i link intatti e DKIM/SPF/DMARC che passano, una copia
scaricata da `nl-ams` e ripristinata, un riavvio dopo il kernel in 32,5 s con
tutto ripartito, Argon2id 148 ms di mediana. **Non fatto**: le regole IPv6 da
fuori, le istantanee del disco, un ripristino con righe da confrontare.
**Trovato**: il gruppo di sicurezza creato dalla console era tutto aperto; il
server di `v0.28.0` avviato dal collegamento `/srv/rg/attuale` usciva con 0
senza log — `server.mjs` su `main` corretto con un test rosso prima, e l'unità
risolve il collegamento —; il kernel trattenuto dagli aggiornamenti graduali;
Ubuntu che non riavvia da solo (§2.8). **Per la coda**: il primo tag dopo
`v0.28.0` porta R-ACC-49 e la correzione del modulo principale, e si installa
con `rg-aggiorna <tag> <commit>`; un cambio a `strumenti/macchina/` va portato
a mano sulla macchina, perché `main` non si pusha. Controllato dalla regia:
motore 193/197, server **62/62**, dati 242, specifica 784, guardiano verde,
interfaccia 2.168; `https://api.rottagiusta.it/v1/salute` risponde 200 con
`versione 0.28.0`, schema 3 e un'epoca. La regia **non** è entrata nella
macchina.

### P-16 — Claude: `ritmo()` dice «orologio» anche senza orologio

**Stato:** **chiuso il 30 settembre 2026**, commit `be44fe6` su `main`, lanciato dalla regia (punto 8). Prima era: pronto: P-30 è chiuso, e ha lasciato un test che P-16 deve tenere verde. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** il resoconto
di P-05.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

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
nella specifica restano veri, o si correggono dicendo perché. Il test
di P-30 «sessioni: il confine per pausa resta quello di prima, e
ritmo lo usa» resta verde.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `be44fe6`, voce nel CHANGELOG. Elencati prima i chiamanti di
`ritmo()`, `sessioni()` e `stimaImpegno()`. Nel motore: la `durata` di una
sessione senza orologio è `null`, non `ms`; `ritmo()` misura solo le sessioni
che l'orologio misura e dice quante in `misurate`; `MIN_MISURATE` si confronta
con le risposte misurate. Quattro test scritti prima, cinque rotture rosse; i
test di P-30 e P-33 restano verdi. `ritmo()` entra nella tabella delle soglie
del §4.3; nuovi R-TEMPO-09…12. **Trovato:** una seconda metà del difetto —
anche con l'orologio, `affidabile` contava le risposte viste e non le misurate,
e il Percorso, che non filtrava, era esposto; R-TEMPO-05 era falso sulle righe
senza data e il suo controllo non lo vedeva: ora è vero col testo di prima. Il
filtro sulle date prima di `E.ritmo()` nell'anteprima dei Quiz è ora superfluo:
va a P-52. Controllato dalla regia: motore 189/191, server 60/60, dati 242,
specifica 774, guardiano verde, interfaccia 1.873 in 188 s.

### P-17 — Claude: l'ultimo tag di una risposta, nel motore

**Stato:** **chiuso il 30 settembre 2026**, commit `059d717` su `main`, lanciato dalla regia (punto 8). Prima era: pronto quando la cartella principale è libera. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** l'esito di
P-01, che lo lasciava scritto come difetto di copertura.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

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

**Esito:** commit `059d717`, voce nel CHANGELOG. `E.tagPerTentativo(righe)`
nel motore, con lo stesso nome della funzione della pagina: vale l'ultima riga
`_t:'g'` nell'ordine di `ordinaRighe()`, con le date confrontate come istanti e
i tag storici senza data prima di ogni tag datato. Sei test scritti prima, fra
cui il confronto con la copia della pagina su cinque archivi, che si ritira da
solo quando la copia esce; otto rotture rosse. Fra gli orfani dichiarati, con
«P-52, o la prossima penna su app.html»; R-ARCH-13 e 14. **Trovato:** una
differenza voluta — nel motore una riga di tag che `validaRiga()` rifiuterebbe
non decide niente, nella copia della pagina sì —; oggi non si vede, perché
import e server quelle righe le scartano. Controllato dalla regia: motore
195/197, server 60/60, dati 242, specifica 782, guardiano verde, interfaccia
1.876 in 188 s.

### P-28 — Claude: i contratti del motore che il client chiede

**Stato:** **chiuso il 26 settembre 2026**, commit `9bced09` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo
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
dicendo che cosa è cambiato. E il suo §4.1 sulla simulazione
consegnata senza risposte, che P-14 ha trovato in contrasto con il
§4.1 di docs/area-3-progetto.md (il suo §10.1 dice come). Non
ridisegnare niente del client.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `9bced09`, voce nel CHANGELOG. Le sei funzioni di P-10 non
bastavano, e la sessione l'ha misurato: dopo un `409` davano per salvate righe
che non lo erano. Quattro funzioni nuove — `nuovoTrasferimento`,
`registraEsito`, `riepilogoTrasferimento`, `nonInviabili` —, fra gli orfani
fino a P-18; `lottoDaInviare` non si ferma più su una riga troppo grande in
testa alla coda. R-ACC-39 e 40. Il progetto del client riallineato a P-11, con
un nuovo §9.3 e il §4.1 allineato all'area 3. Per P-29: lo stato «da
verificare» apre una corsa fra schede che C-06, C-11 e C-15 devono esercitare.
Controllato dalla regia: motore 155 + 2 skip, server 59, dati 242, interfaccia
307, specifica 402.

### P-29 — Claude: la prova nel browser, per i controlli del client

**Stato:** **chiuso il 26 settembre 2026**, commit `194aafe` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`,
ramo **`main`**, a mano. **Nasce da:** P-13, §12 di
`docs/account-client-progetto.md`.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-29, su main. Il §12 di docs/account-client-progetto.md
chiede diciotto gruppi di controlli, C-01…C-18, che guardano la pagina
vera: storage, rete, cookie, due schede, offline. La suite oggi non
guida nessun browser, e il repo non ha dipendenze.

Prima una misura, poi il codice. Un tentativo fermato di P-34 ha già
guidato Chrome headless senza dipendenze, con il protocollo di Chrome e
l'HTTP di Node: è in
~/Software/rotta-giusta-quarantena/p34-2026-09-26/tests/test_bozza_carteggio.mjs,
non verificato. Misura le strade per guidare un browser vero dalla suite — per esempio Chrome headless attraverso il
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
della specifica. Lo stato «da verificare» di P-28 apre una corsa fra
schede (§9.3 del progetto del client, ultimo paragrafo): C-06, C-11 e
C-15 la esercitano.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `194aafe`, voce nel CHANGELOG. La misura prima: una strada sola
regge senza dipendenze, Chrome headless con il suo protocollo su una pipe, che
legge da fuori cookie, IndexedDB, localStorage, sessionStorage e Cache Storage,
fa l'offline, il service worker e due schede. Il banco: `tests/browser.mjs`
pilota Chrome, `tests/client_account.mjs` serve il sito e avvia il server vero
sulla porta 8620; regime riconosciuto da `indirizzoApi()`, come P-06; C-01 in
parte, C-02 e C-05; ventitré rotture rosse e il banco provato contro sé stesso.
R-ACC-01, 02, 09 coperti; R-ACC-41 e 42 nuovi. Trovato: l'offline emulato vale
per la scheda e non per il service worker; il cookie `__Host-` va e torna fra
due porte di localhost in Chrome. **La suite dell'interfaccia ora vuole Chrome e
la porta 8620 libera, e dura circa un minuto.** **Verificato dalla regia: il
banco è instabile** — quattro giri sullo stesso albero, due rossi su controlli
diversi della pagina di riferimento, due verdi —, e diventa P-38, prima di P-18.
Il resto dei controlli è P-39. Per l'autore, nel §4: il tempo della suite, e
Safari.

### P-18 — ChatGPT: la realizzazione del client degli account

**Stato:** **chiuso il 29 settembre 2026**, merge `b50edec`. **Dove:**
app di ChatGPT, progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-18. Realizza docs/account-client-progetto.md in
site/app.html e site/index.html. Prima leggi gli esiti di P-11, P-28 e
P-29 nel §6 di docs/prossime-sessioni.md: il server ha le rotte che il
progetto dava per mancanti, e i controlli del §12 ora esistono e
girano. I testi del §1 di docs/prossime-sessioni.md cambiano in questa
stessa sessione, tutti — la privacy compresa, che poi passa
dall'autore.

La contabilità della coda è nel motore: la pagina la chiama, non la
rifà. Se la funzione di P-17 esiste, sostituisce tagPerTentativo().
Il contratto del banco è cresciuto con P-39 — gli agganci delle
attività, le porte e i testi dell'account, aria-modal, l'archivio
rg-account-<chiave> — ed è nel §12, «Il contratto»: la pagina lo
rispetta. I due difetti che P-39 ha trovato costruendo il client minimo
— la richiesta che parte con il cookie di un altro account, la
registrazione persa che lascia il cookie — valgono anche per te.
Altri controlli (P-43) arrivano su main mentre lavori: quelli che
trovi alla merge li deve passare anche la pagina. La suite dell'interfaccia vuole
Chrome, la porta 8620 e tre porte libere, e dura circa un minuto: se nel tuo
ambiente non gira, fermati e dillo, non saltarla.
Se un contratto o un controllo ti sta stretto, fermati e dillo: cambiarlo
tocca main.

Non toccare docs/prossime-sessioni.md. Tutte le suite verdi, i
controlli del §12 compresi, collaudo guardato a 375 e 1280 px e in un
Safari vero se c'è, voce in fondo a [Unreleased], un commit con il
trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `abbd564`, merge `b50edec`. Il client degli account in
`site/app.html`, i testi dei due stati in `index.html` e `privacy.html`, la
contabilità della coda chiamata dal motore. I due difetti che P-39 aveva
trovato — la richiesta con il cookie di un altro account, la registrazione con
la risposta persa — hanno i loro controlli nella pagina. Collaudo a 375 e 1280
px in Chrome, e il dialogo di accesso in un Safari vero. Non fatto:
`tagPerTentativo()` resta, perché P-17 non c'è ancora. **La privacy è una bozza
da completare e verificare dall'autore prima del rilascio** (§15.4 di
`account-progetto.md`). Controllato dalla regia: territori puliti, merge chiusa
da sola; **la pagina vera passa i diciotto gruppi di P-43**, 1.094 verifiche
dell'interfaccia in due giri di fila, circa 115 s l'uno, e le altre suite
invariate. La regia non ha rifatto il collaudo nel browser.

### P-30 — Claude: un'attività registrata resta intera, anche dopo una pausa

**Stato:** **chiuso il 26 settembre 2026**, commit `bec716a` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a
mano. **Nasce da:** P-14, §10.1 di `docs/area-3-progetto.md`.

```
Sessione P-30, su main. Il progetto dell'area 3 ha trovato un difetto
del motore, e la regia l'ha riprodotto: tre risposte con lo stesso
sim_uid, la terza dopo 21 minuti, due sbagliate. sessioni() le spezza
in due gruppi con lo stesso id, ed erroriSessione() restituisce un
errore su due dichiarando fonte 'sim_uid' — il confine registrato,
proprio mentre lo taglia. I cinque test di erroriSessione() passano
perché nessuno esercita una pausa: il conteggio resta coerente con la
lista sbagliata. Il caso esatto è nel §10.1 di
docs/area-3-progetto.md.

Prima elenca i chiamanti di sessioni() ed erroriSessione() — ritmo()
compreso — e scrivi che cosa cambia per ciascuno (AGENTS.md). Poi il
test che fallisce, e il contratto del §7.1 del progetto: l'attività
registrata intera anche oltre la pausa, la sessione ricostruita
dichiarata, l'isolamento fra attività, un id ambiguo rilevato. Il
raggruppamento che ritmo() usa non cambia in silenzio; il test del
quesito ripetuto resta. Se il contratto finale differisce dal §7.1,
correggi il §7.1 nello stesso commit.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `bec716a`, voce nel CHANGELOG. `sessioni()` ha due confini
scelti per nome: `'pausa'`, il predefinito, che non cambia e che `ritmo()`
continua a usare — un test lo pretende —; e `'attivita'`, che tiene insieme
tutte le righe di un `sim_uid` anche oltre una pausa. `erroriSessione()` usa
sempre il secondo; un id ambiguo restituisce `ambigua` con i motivi, i quesiti
che la banca non ha finiscono in `mancanti`. Sette test, cinque rossi per la
ragione misurata; quindici rotture, tutte rosse. Specifica §4.4, R-FLU-05…09,
R-TEMPO-08; il §7.1 di `area-3-progetto.md` riscritto sul contratto consegnato.
**Trovato, e vivo nel prodotto pubblicato**: nella pagina l'elenco delle
sessioni, la revisione e l'ultima attività del Percorso mostrano un'attività
con una pausa in due righe con lo stesso id, che aprono entrambe la metà più
recente. Letto nel codice, non guidato nel browser; va a P-19. Controllato dalla
regia: cinque suite su `main` — motore 148 + 2 skip, server 58, dati 242,
interfaccia 295, specifica 394 —, e il caso del §10.1 ora dà 2 errori su 2.

### P-31 — Claude: i controlli del ciclo, allineati all'area 3

**Stato:** **chiuso il 26 settembre 2026**, commit `efcf385` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`,
ramo **`main`**, a mano. **Nasce da:** P-14, §10.1 di
`docs/area-3-progetto.md` — è per l'area 3 quello che P-06 è stato per l'area 2.

```
Sessione P-31, su main. Leggi il §7 e il §10.1 di
docs/area-3-progetto.md, l'esito di P-30 e quello di P-06 nel §6 di
docs/prossime-sessioni.md: il meccanismo di P-06 è il modello.

I controlli del ciclo in due regimi: il ciclo di oggi riconosciuto, e
quello progettato riconosciuto dalla funzione di raccordo che chiama
davvero erroriSessione() e avvia la sua lista, non da un pulsante.
Nel regime nuovo il banco esegue riepilogo → anteprima → avvio con il
motore e la banca veri, con uno storico estraneo e i dati che cambiano
fra un clic e l'altro. Una pagina di riferimento e rotture deliberate,
ognuna rossa. Il contratto estraibile scritto nel repo prima del codice
della pagina, come selezioneQuiz() per l'area 2. Nella specifica:
§4.4, §7.5, R-FLU-01…04 e R-UX-06 come chiede il §10.1, con ogni
copertura dichiarata; R-FLU-01 dice coperti i quiz e scoperti i cicli
non ancora fatti.

Non toccare docs/prossime-sessioni.md. Main resta verde con la pagina
di oggi. Suite verdi, voce in fondo a [Unreleased], un commit. Chiudi
con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `efcf385`, voce nel CHANGELOG. I controlli del ciclo dei quiz
in due regimi, come P-06: quello di oggi riconosciuto da `fine()` e
`rivediQuiz()`, quello progettato da tre funzioni di raccordo — `riepilogoQuiz`,
`anteprimaRiprova`, `avviaRiprova` —, con il contratto scritto nel §10.1 di
`area-3-progetto.md` prima del codice. `tests/ciclo_quiz.mjs` fa il giro
riepilogo → anteprima → avvio con motore e banca veri e i dati che cambiano fra
i clic; ventisette rotture della pagina di riferimento, tutte rosse, una delle
quali nata perché la prova contro sé stesso ha mostrato un buco. Il lettore
delle pagine è ora uno, `tests/pagina_js.mjs`, e P-35 lo riusa. Non coperti, e
dichiarati: testi, focus, ritorni, avvisi, figure — restano al collaudo di
P-19. Controllato dalla regia: motore 155 + 2 skip, server 59, dati 242,
interfaccia 402, specifica 412.

### P-19 — ChatGPT: la realizzazione dell'area 3

**Stato:** **chiuso il 26 settembre 2026**, merge `4129dfc`. Fatto da una sessione di **Claude** nel worktree `ui`, con ChatGPT fermo, come `AGENTS.md` permette. **Dove:** app di ChatGPT, progetto
`~/Software/rotta-giusta-ui`, ramo `ui/main`.

```
Sessione P-19. Realizza docs/area-3-progetto.md in site/app.html.
Prima leggi gli esiti di P-28, P-30 e P-31 nel §6 di
docs/prossime-sessioni.md: il contratto del motore e i controlli del
ciclo ora esistono, e il §7.1 del progetto è allineato a quello che il
motore fa. Il contratto di P-31 obbliga la pagina a tre cose, scritte
nel §10.1: le funzioni di raccordo riepilogoQuiz, anteprimaRiprova e
avviaRiprova; apri() che legge opt.simUid e opt.auto; nessuna chiamata
a E.erroriSessione fuori dal raccordo. Le tre chiamate a sessioni() di app.html passano al confine
dell'attività; P-30 ha letto nel codice un difetto già pubblicato — una
sessione con una pausa compare due volte, e le due righe aprono la
stessa metà —: riproducilo nel browser prima di correggerlo, e
guardalo sparire dopo. erroriSessione() passa dagli orfani alle
chiamate protette di docs/eccezioni-interfaccia.md nello stesso
commit. Se un contratto o un
controllo ti sta stretto, fermati e dillo: cambiarlo tocca main.

Non toccare docs/prossime-sessioni.md. Tutte le suite verdi, collaudo
guardato a 375 e 1280 px, voce in fondo a [Unreleased], un commit con
il trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `a4c0f68`, merge `4129dfc`. L'area 3 in `site/app.html`: il
raccordo del §10.1 è l'unico punto che chiama `E.erroriSessione`, quindi il banco
di P-31 ora gira sulla pagina vera; un riepilogo comune a ogni attività quiz;
una revisione sola per l'attività appena fatta e per lo storico, con i tag e la
riprova; «Termina l'attività» e «Consegna la prova» confermati in pagina; le
figure con il loro `alt`. **Il difetto già pubblicato di P-30 riprodotto nel
browser prima della correzione e guardato sparire dopo**, come il prompt
chiedeva. Trovati e chiusi tre difetti di tastiera e fuoco, fra cui un «1» sul
riepilogo che rispondeva al quesito nascosto sotto; tolta dalla revisione di una
prova la durata che era il tempo concesso, noto dalla 0.19.2. Non fatti: zoom al
200 %, lettore di schermo, prova con persone (§10.4 del progetto). **Una
scorrettezza, dichiarata dalla sessione stessa**: per servire il worktree ha
scritto per qualche minuto `.claude/launch.json` nella cartella principale, ed è
quello che ha fermato P-34. Controllato dalla regia: territori puliti, merge
chiusa da sola; suite sullo stato fuso — motore 155 + 2 skip, server 59, dati
242, interfaccia 469, specifica 412. La regia non ha rifatto il collaudo nel
browser.

### P-20 — ChatGPT: il progetto dell'area 4, Carteggio

**Stato:** **chiuso il 26 settembre 2026**, merge `dff203c`. **Dove:** app di ChatGPT, progetto
`~/Software/rotta-giusta-ui`, ramo `ui/main`. È un documento, non codice: si fa mentre P-18 e P-19 aspettano
il lavoro di Claude, e la sua realizzazione (P-21) viene dopo di loro.

```
Sessione P-20. Progetta l'area 4 di docs/prossima-versione.md §5.1, il
Carteggio, in docs/area-4-progetto.md, sul modello dei progetti delle
aree 1, 2 e 3: i capitoli 12–15 della Specifica UX/UI, con i materiali
e il giudizio all'ingresso, il confronto con la risposta ministeriale,
l'autovalutazione, e le tre porte — prova, esercizi su carta, «Che
tecnica serve?».

Tre vincoli che non si spostano: il carteggio non si corregge da solo,
e il giudizio è di chi studia, detto prima di iniziare (specifica §4.5,
§7.3, R-UX-03); la composizione della prova è un'assunzione, Q-CART4;
carteggio_e12.json resta nel cassetto, Q-AMBITO.

Il Carteggio ha due stati, e il progetto li disegna tutti e due. Senza
account non resta niente (ADR-004): il tappeto non sa da dove
riprendere, il giro non sa che cosa hai già fatto, e un'ora di lavoro
scritto vale finché la pagina è aperta — il progetto dice come lo si
dichiara, prima e alla fine. Con l'account si salva come oggi. Il
progetto del client (docs/account-client-progetto.md) è la fonte per
gli stati di accesso: si consuma, non si ridisegna. Il ciclo dell'area
3 — riepilogo, revisione — vale anche qui, o il progetto dice perché
no.

Dove serve un controllo o un contratto del motore, scrivi la
dipendenza come fanno il §10.1 dell'area 2 e dell'area 3: la chiude
Claude su main. Solo il documento e la voce di CHANGELOG: niente
site/. Non toccare docs/prossime-sessioni.md. Un commit con il
trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `e49d5f7`, `docs/area-4-progetto.md` e la sua voce. Tre porte,
materiali, autovalutazione, i due stati con gli account, riepilogo e revisione,
quindici criteri di accettazione. **Ha trovato un difetto già pubblicato**:
`annotaCart()` scrive solo in memoria, contro la promessa «a ogni tasto» del
§7.6 — verificato dalla regia nel codice, e nel §4 c'è la domanda. Quattro
dipendenze per Claude su `main`, D-01…D-04, diventano P-32…P-35. La base era
stata spostata sotto la sessione: rilette le sezioni dell'area 3 su richiesta
della regia, nessuna modifica necessaria, e il raccordo con P-30 era già nel
documento. Controllato dalla regia: territori puliti, merge chiusa da sola.

### P-32 — Claude: la composizione della prova di carteggio, nel motore

**Stato:** **chiuso il 30 settembre 2026**, commit `f14681a` su `main`; lanciato dalla regia (punto 8). Apre la fila del carteggio, P-32 → P-33 → P-34 → P-35. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** P-20, §10.1 di `docs/area-4-progetto.md`.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-32, su main. Leggi il §10.1 di docs/area-4-progetto.md,
voce D-01, e il suo §5 sulla prova.

La composizione della prova di carteggio vive oggi in app.html, in
componiProva(). Portala nel motore come contratto puro, o consegna un
raccordo eseguibile verificato come selezioneQuiz() per l'area 2, con
gli ingressi e le uscite che D-01 elenca: argomenti rappresentati e
mancanti, riprese per argomento, il ripiego dichiarato su una banca
incompleta. Una sorgente sola per 4 esercizi, 60 minuti e 3 su 4.
Q-CART4 resta un'assunzione, e si dice. Prima elenca i chiamanti di
estrai() ed estraiNuoviPrima() e che cosa cambia per ciascuno: la
prima resta cieca.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `f14681a`, voce nel CHANGELOG. D-01 consegnata come contratto
puro: `E.provaCarteggio(banca, specchio, oggi, { seme, nuoviPrima })` dà da una
chiamata lista, argomenti rappresentati e mancanti, riprese — `null` nella prova
cieca, non zero —, il completamento dichiarato su una banca incompleta, e le
condizioni; `E.PROVA_CARTEGGIO` è la sorgente unica di 4, 60 e 3 su 4, con
Q-CART4 scritta accanto. `estrai()` ed `estraiNuoviPrima()` non cambiano, e i
loro chiamanti sono elencati. Un test estrae `componiProva()` dalla pagina e
pretende la stessa lista; si ritira quando la copia sparisce. R-SEL-12…16
coperti, R-SEL-17 (la pagina) scoperto; `provaCarteggio` fra gli orfani fino a
P-21. **Trovato:** il ripiego su una banca incompleta era muto, e ora nomina
l'argomento mancante; il vecchio test «uno per argomento» verificava una copia
trascritta nel test, non il codice; il §5.3 della specifica diceva
`estraiNuoviPrima()` per la prova predefinita, che è cieca. **Per la coda:** il
contratto per P-21 è nel §10.1 di `area-4-progetto.md` — escono dalla pagina
`componiProva()`, `argomentiSenzaNuovi()` e le `PROVA_*`, le righe della prova
portano `variante`, si avvia solo se `pronta` —; se P-33 cambia lo schema della
variante, riallinea quel paragrafo. Controllato dalla regia: motore 166/168,
server 60/60, dati 242, specifica 608, guardiano verde, interfaccia 1.436 in
149 s.

### P-33 — Claude: l'attività intera anche per carteggio e tecniche

**Stato:** **chiuso il 30 settembre 2026**, commit `e7dd417` su `main`; lanciato dalla regia (punto 8). **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** P-20, §10.1 di `docs/area-4-progetto.md`.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-33, su main. Leggi il §10.1 di docs/area-4-progetto.md,
voce D-02, e l'esito di P-30 nel §6 di docs/prossime-sessioni.md.

P-30 ha dato a sessioni() il confine dell'attività, ma solo per le
righe _t:'q'. Il carteggio (_t:'c') e le tecniche (_t:'t') ne hanno
bisogno allo stesso modo, con quello che D-02 aggiunge: giro e tappeto
oggi scrivono sim_uid null, correggiTec() non registra un legame, e i
giudizi e i «da rivedere» vanno contati. Un contratto puro, completo
oltre le pause, distinto dalle sessioni ricostruite e isolato dalle
attività estranee. Il confine per pausa che ritmo() usa non cambia; lo
schema e la compatibilità con le righe vecchie si documentano prima
del raccordo nella pagina.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `e7dd417`, voce nel CHANGELOG. D-02 consegnata come contratto
puro: `E.attivitaCarteggio(righe, { tipo })` tiene insieme le righe di un
`sim_uid` di carta (`'c'`) o tecniche (`'t'`) oltre ogni pausa e ricostruisce,
dichiarandolo, quelle senza legame; `E.dettaglioCarteggio(righe, banca, id, …)`
dà schede, conteggi e filtro dalla stessa chiamata, senza fare di un giudizio
mancante un «da rivedere». `sessioni()`, `erroriSessione()` e `ritmo()` restano
dei soli quiz, e un test lo pretende. Lo schema delle righe nuove e la
compatibilità con le vecchie sono nel §10.1 D-02 dell'area 4 e nel §3.2 della
specifica, prima della pagina. R-FLU-12…22 coperti, R-FLU-23 (la pagina)
scoperto; le due funzioni fra gli orfani fino a P-21. **Trovato:** `salvaCart()`
scrive tutte le righe di un salvataggio con un solo `ts` dalla 0.5.0, quindi il
carteggio si ricostruisce per istante e modalità e non con le regole dei quiz,
che avrebbero fuso due giri salvati a un minuto l'uno dall'altro; la quantità
proposta di una prova vecchia sta nel `total` della sua `_t:'s'`; l'ordine
delle righe vecchie è «non registrato». Lo schema della `variante` di P-32 non
cambia. Controllato dalla regia: motore 177/179, server 60/60, dati 242,
specifica 654, guardiano verde, interfaccia 1.442 in 150 s.

### P-34 — Claude: la bozza del carteggio, e la promessa «a ogni tasto»

**Stato:** **fermato dall'autore il 26 settembre 2026, da rilanciare in Claude
dopo P-33**; **chiuso il 30 settembre 2026**, commit `4c0fbb7` su `main`, lanciato dalla regia (punto 8). Era partito fuori ordine in ChatGPT, nella cartella principale.
Il suo lavoro non committato — un controllo rosso del difetto, un raccordo
IndexedDB di riferimento, un banco che guida Chrome headless senza dipendenze,
e il raccordo documentale per il progetto del client — l'ha spostato la regia
in `~/Software/rotta-giusta-quarantena/p34-2026-09-26/`, con un `LEGGIMI.md`.
Niente di lì è verificato. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** P-20, §10.1 di `docs/area-4-progetto.md`.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-34, su main. Leggi il §3.3 e il §10.1, voce D-03, di
docs/area-4-progetto.md, e il §9 di docs/account-client-progetto.md.
Un primo tentativo, fatto dall'agente sbagliato e fermato, ha lasciato
lavoro in ~/Software/rotta-giusta-quarantena/p34-2026-09-26/: leggi
il suo LEGGIMI.md, e prendi quello che regge dopo averlo verificato —
niente entra nel repo solo perché esiste.

La specifica, §7.6, dice che il testo del carteggio è salvato a ogni
tasto. Non è vero: annotaCart() scrive solo in memoria, e una ricarica
durante la prova perde tutto. La regia l'ha verificato nel codice.
Prima un controllo che fallisce e lo dimostra — dichiarato come
difetto aperto finché non si chiude, perché main resta verde —, poi il
contratto della bozza che D-03 descrive: legata all'account, separata
dalle righe valutate, esclusa da ripiega(), dai conteggi e dagli invii,
cancellata solo a conclusione confermata o scarto esplicito; con
ricarica, scadenza, errore di scrittura, uscita e cambio d'account fra
schede esercitati. Senza account nessun salvataggio, come vuole
l'ADR-004. Il raccordo si scrive nel progetto del client senza
ridisegnarlo. La regia ha già corretto il §7.6, che dichiara il
difetto: quando la bozza c'è, il §7.6 dice che cosa promette adesso, la
riga fra i «Difetti noti» di AGENTS.md si toglie, e l'avviso e la
conferma di P-36 si rivedono nel raccordo.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `4c0fbb7`, voce nel CHANGELOG. **Prima il difetto**, dimostrato
in un browser vero: `C-19:ricarica` scrive due testi con l'account, ricarica, e
il lavoro è perso; la verifica è rossa sulla pagina di oggi ed è dichiarata
nella tabella nuova «Difetti aperti dichiarati» di
`docs/eccezioni-interfaccia.md`, che diventa rossa lei il giorno in cui la
verifica passa. **Poi il contratto**, puro, nel motore — `nuovaBozza`,
`validaBozza`, `modificaBozza`, `sostituisciBozza`, `riprendiBozza`,
`concludiBozza`, `BOZZA_CARTEGGIO` —, e il raccordo nel §9.4 del progetto del
client: la bozza sta in `meta` della copia dell'account, chiave
`bozza-carteggio:<id>`, senza versione nuova del database e **senza niente sul
server**; «salvato» solo a transazione completa; ripresa proposta, mai
automatica; conclusione e cancellazione della bozza in una transazione. La
pagina di riferimento passa C-19 intero, quattordici rotture rosse. Specifica
§7.6 al futuro, §3.2, nuovo §9.11 con R-BOZZA-01…07. La riga fra i «Difetti
noti» di `AGENTS.md` resta, con i puntatori nuovi: la tolgono P-21 e la
dichiarazione nello stesso commit. **La quarantena è stata letta e non presa**,
per tre motivi scritti nel CHANGELOG — il suo controllo rosso sarebbe passato
con una scrittura in `localStorage`, cioè violando l'ADR-004. **Trovato:** un
verde falso del banco (il tempo della ripresa, ora letto con l'orologio dieci
minuti avanti), una regola del motore che stava in due posti, e il limite di
cinque registrazioni l'ora che fermava C-19. **Per l'autore**, nel §4: una
scelta presa su delega di D-03 e tre testi nuovi. La suite cresce di circa 24
s (Q-SUITE). Controllato dalla regia: motore 185/187, server 60/60, dati 242,
specifica 682, guardiano verde, interfaccia 1.517 in 171 s; la quarantena è
intatta.

### P-35 — Claude: i controlli del carteggio, allineati all'area 4

**Stato:** **chiuso il 30 settembre 2026**, commit `11d9f27` su `main`; lanciato dalla regia (punto 8). **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** P-20, §10.1 di `docs/area-4-progetto.md`.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-35, su main. Leggi il §10.1 di docs/area-4-progetto.md,
voce D-04, e gli esiti di P-06, P-31, P-32, P-33 e P-34 nel §6 di
docs/prossime-sessioni.md: P-06 e P-31 sono il modello.

I controlli del carteggio in due regimi, con il raccordo estraibile e
il riconoscimento del regime scritti nel repo prima del codice della
pagina, una pagina di riferimento e rotture deliberate, ognuna rossa.
Nella specifica: R-UX-03 prima dell'avvio, Q-CART4, Q-AMBITO, §7.6 e
R-FLU-01 per carta e tecniche; i controlli del riepilogo distinti da
quelli della riprova, che resta solo dei quiz. Il raccordo del client
§4.1 e §9.2 con D-03. Main resta verde con la pagina di oggi.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `11d9f27`, voce nel CHANGELOG. I controlli del carteggio in due
regimi, riconosciuti dal raccordo, con il contratto delle cinque funzioni —
`preparaCarteggio`, `avviaCarteggio`, `concludiCarteggio`, `rispostaTecnica`,
`riepilogoCarteggio` — scritto nel §10.1 dell'area 4 (D-04) prima della pagina.
Il banco `tests/ciclo_carteggio.mjs` esegue preparazione → avvio → conclusione →
riepilogo con le banche vere e i dati che cambiano fra un clic e l'altro; la
pagina di riferimento ha 39 rotture, e il banco è provato contro sé stesso.
R-UX-03 «prima dell'avvio» si controlla ora nel browser, in C-01. R-SEL-17 e
R-FLU-23 coperti; nuovi R-FLU-24…26 e R-UX-07 (la pagina non carica
`carteggio_e12.json`). **Trovato:** un rosso falso del banco del client in
C-10, sotto carico, due giri su quattro — il pulsante «Scarica le righe non
importate» compare dopo il riepilogo e il banco lo guardava una volta —,
corretto e scritto; due difetti del banco nuovo alla prima stesura. **Per
l'autore**, nel §4: una scelta su delega di D-04. **Per la coda:** alla merge di
P-21 si toglie il regime attuale del Carteggio, la frase di oggi in
`GIUDIZIO_CARTEGGIO` e, se non si ritira da solo, il test che confronta
`componiProva()` con `provaCarteggio()` — segnaposto P-50. Controllato dalla
regia: motore 185/187, server 60/60, dati 242, specifica 704, guardiano verde,
interfaccia 1.666 **in due corse di fila**, 173 s ciascuna, per il rosso falso
che la sessione aveva visto sotto carico.

### P-36 — ChatGPT: l'avviso e la conferma del browser nel carteggio, finché il testo non si salva

**Stato:** **chiuso il 26 settembre 2026**, merge `88ea980`. **Dove:** app di ChatGPT, progetto `~/Software/rotta-giusta-ui`,
ramo `ui/main`. **Nasce da:** P-20, e dalle due decisioni dell'autore del 26
settembre (§4): l'avviso, e la conferma del browser.

```
Sessione P-36. Il testo che si scrive nel carteggio sta solo in
memoria: annotaCart() non lo salva, e una ricarica durante la prova di
un'ora perde tutto (docs/area-4-progetto.md §3.3). La correzione vera
arriva con l'area 4 e gli account. Nel frattempo l'autore ha deciso che
la pagina lo dica.

Un avviso, dove chi studia lo legge prima che serva: all'ingresso della
prova e degli allenamenti su carta, e nel runner finché c'è testo
scritto. Dice che cosa succede — il testo resta finché la pagina è
aperta — e che cosa fare: non ricaricare e non chiudere la scheda fino
alla consegna. Il tono è quello di docs/filosofia.md: un'informazione
con la via d'uscita, non un allarme. E la conferma del browser prima
di lasciare la pagina — beforeunload — quando c'è testo scritto e la
prova non è consegnata: protegge dal gesto accidentale, il testo del
browser non si sceglie, e non è il confirm() nativo che il §7.6 vieta
per la consegna. Si toglie a consegna fatta, e a runner chiuso. Nessun
salvataggio nuovo, in nessuno storage: l'ADR-004 vuole che senza
account non resti niente, e la bozza vera è il lavoro di P-34.

È un lavoro piccolo, e resta piccolo: niente ridisegno del Carteggio,
che è l'area 4. Non toccare docs/prossime-sessioni.md. Quattro suite
verdi, collaudo guardato a 375 e 1280 px, voce in fondo a
[Unreleased], un commit con il trailer, versione non toccata. Chiudi
con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `2a74d2c`, merge `88ea980`. Gli avvisi prima della prova e
degli allenamenti su carta e nel runner con testo scritto, e `beforeunload`
fino alla consegna o alla chiusura; nessuno storage nuovo. Collaudo in Chromium
a 375 e 1280 px, con sei ricariche annullate e il testo rimasto. Trovato e
corretto un commento del codice che prometteva ancora il salvataggio a ogni
tasto. Controllato dalla regia: territori puliti, merge chiusa da sola, suite
verdi sullo stato fuso — interfaccia compresa, in quel giro.

### P-37 — Claude: chiudere il regime vecchio dei controlli del ciclo

**Stato:** **chiuso il 30 settembre 2026**, commit `237de28` su `main`, lanciato dalla regia (punto 8). Prima era: pronto quando la cartella principale è libera: P-19 è fuso. **Dove:**
Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:**
il resoconto di P-31 — è per il ciclo quello che P-12 è per i quiz.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-37, su main. P-19 ha realizzato l'area 3 e la regia l'ha
fusa: leggi i suoi esiti e quello di P-31 nel §6 di
docs/prossime-sessioni.md, e il §10.1 di docs/area-3-progetto.md.

Chiudi il regime vecchio del ciclo come P-31 ha lasciato scritto: in
tests/test_interfaccia.py resta solo il regime con le tre funzioni di
raccordo, e la pagina di prima, con fine() e rivediQuiz() senza
raccordo, ora dev'essere rossa. Decidi che cosa resta di
tests/pagina-ciclo-quiz.html. Nella specifica, R-FLU e R-UX-06 dicono
coperto quello che adesso la pagina fa davvero.

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `237de28`, voce nel CHANGELOG. Il ciclo dei quiz ha un regime
solo: via `regime_ciclo()`, il ramo «attuale» e `RACCORDO_CICLO`; il banco gira
su ogni pagina e `conteggio_ciclo()` pretende dalla pagina vera le verifiche
della pagina di riferimento, gruppo per gruppo. Provato con `RG_PAGINA` sulla
pagina di `4129dfc^1`: prima 3 verifiche e zero rossi, ora 6 rossi. La pagina di
riferimento resta per le 27 rotture. Specifica: R-FLU-01, R-FLU-11, §7.5, «Un
regime solo per il ciclo» nel §9.6; nota nel §10.1 dell'area 3. **Non fatto:**
R-UX-06, le frasi del riepilogo, resta scoperto — il banco del ciclo non ha DOM
e quello del client non legge quei testi —: segnaposto P-53. **Trovato:** il
sito pubblicato è anteriore a P-19, e il §7.5 ora lo dice. Quiz, ciclo, mappa e
client hanno un regime solo; restano in due il Carteggio, fino a P-21, e gli
stati d'accesso dell'area 6. Controllato dalla regia: motore 185/187, server
60/60, dati 242, specifica 758, guardiano verde, interfaccia 1.873 in 187 s.

### P-38 — Claude: il banco del browser, stabile

**Stato:** **chiuso il 29 settembre 2026**, commit `0c1b079` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** la
verifica della regia su P-29.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-38, su main. Il banco del browser di P-29 è instabile: la
regia ha fatto girare tests/test_interfaccia.py quattro volte sullo
stesso albero, e due sono state rosse — ogni volta su un controllo
diverso della pagina di riferimento, «Inizia non apre un quesito con le
sue risposte» o «troppo poche verifiche: il giro non è arrivato in
fondo» —, due verdi. Una suite che a volte è rossa senza motivo insegna
a ignorare il rosso, che per questo progetto è il danno peggiore.

Prima misura: venti giri almeno, contando i rossi e dove cadono, sul
Mac dell'autore e sotto carico. Poi trova la causa invece di alzare le
attese: che cosa aspetta il banco, e che cosa dovrebbe aspettare — un
evento, uno stato della pagina, non un tempo. Se un'attesa a tempo
resta, dichiarala con il perché. Il criterio di fine è un numero: zero
rossi su venti giri, e le rotture deliberate tutte rosse per il loro
motivo. Scrivi le misure nel §12 del progetto del client, «Il banco».

Non toccare docs/prossime-sessioni.md. Suite verdi, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `0c1b079`, voce nel CHANGELOG. Prima la misura: 40 giri, metà
sotto carico, 3 rossi. **Due cause, e nessuna era il tempo.** La prima: il banco
voleva più di dieci caratteri nel testo del quesito, e 8 quesiti base su 1.472
sono più corti — la pagina di riferimento ne pescava uno nello 0,5 % degli
avvii. Ora il quesito si riconosce dalla banca, non dalla lunghezza. La seconda,
trovata dai giri dopo la prima correzione, era peggio: **un verde falso sotto
carico** — C-02 guardava lo storage dopo 500 ms, e una scrittura arrivava fino a
592 ms dopo. Ora c'è una finestra d'osservazione di 3 s che si chiude alla prima
scrittura, l'unica attesa a tempo rimasta, dichiarata. Entrambe provate in modo
deterministico sul banco di prima. Aggiunti una variante che deve restare verde,
una rottura che scrive in ritardo, e due controlli che prima non dicevano
niente. Risultato: 0 rossi su 20 giri senza carico e su 40 sotto carico, le
rotture rosse ognuna per il suo motivo. Controllato dalla regia: tre giri di
fila dell'interfaccia, 576 su 576 tutte e tre le volte, in 55 s; le altre suite
invariate.

### P-39 — Claude: i controlli del client che mancano

**Stato:** **chiuso il 29 settembre 2026**, commit `ae022f6` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** il resoconto di P-29.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-39, su main. Leggi il §12 di
docs/account-client-progetto.md, «Il banco» compreso, e gli esiti di
P-28, P-29 e P-38 nel §6 di docs/prossime-sessioni.md.

Sullo stesso banco, stabile dopo P-38: il resto di C-01 — Quiz,
simulazioni, Carteggio, tecniche e Segnali, così R-ACC-04 si può dire
coperto —, poi C-03, C-04 e C-06…C-18, con il meccanismo dei due regimi
e le rotture deliberate. C-06, C-11 e C-15 esercitano la corsa fra
schede di «da verificare» (§9.3), leggendo il database del server.
Le due lezioni di P-38 valgono per ogni controllo nuovo: un'assenza si
dimostra con la finestra OSSERVAZIONE, e un quesito si riconosce dalla
banca, non dalla lunghezza del suo testo (§12, «Il banco stabile»). Se
il banco non regge un controllo, dillo e lascialo dichiarato scoperto
con il motivo: meglio un buco scritto che un verde che non misura. Se è
troppo per un commit, fermati a un confine pulito e dillo. Il tempo
della suite resta un numero da dire nel resoconto.

Non toccare docs/prossime-sessioni.md. Suite verdi — più giri, non uno —,
voce in fondo a [Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `ae022f6`, voce nel CHANGELOG. C-01 completo — Quiz,
simulazione, tecniche, prova di carteggio, Segnali, senza account —, e C-03,
C-04, C-06, C-11, C-15 in due regimi; C-06, C-11 e C-15 esercitano la corsa fra
schede leggendo il database del server. La pagina di riferimento è ora un client
minimo. 57 rotture in tutto, ognuna rossa per il suo motivo; R-ACC-03 e 04
coperti, R-ACC-43…46 nuovi. **Due difetti di progetto trovati costruendo il
client minimo**: una richiesta trattenuta e lasciata andare dopo un cambio
d'account partiva con il cookie nuovo, cioè una riga di A finiva in B (ora
annullata con `AbortController`); e una risposta di registrazione persa lascia
comunque il cookie. E un verde falso dipendente dal tempo, sostituito. Non
fatti, per dimensione: C-07…C-10, C-12…C-14, C-16…C-18, scritti nel §12 con che
cosa chiedono al banco — diventano P-43. La suite ora avvia quattro server ed è
intorno al minuto: 20 giri senza carico e 10 sotto carico tutti verdi.
Controllato dalla regia: interfaccia 722 in 63 s, specifica 500, le altre
invariate.

### P-41 — Claude: il motore della mappa di Progressi

**Stato:** **chiuso il 29 settembre 2026**, commit `95c7a18` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`,
ramo **`main`**, a mano. **Nasce da:** Q-DUE, chiusa il 29 settembre 2026.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-41, su main. Leggi Q-DUE fra le questioni chiuse del §10
di docs/specifica.md: i sette punti sono la decisione, e i due fatti
sotto sono il lavoro. Leggi anche il §4.2 e il §4.3.

Quattro cose nel motore, ognuna con i test scritti prima e provati al
contrario:
- un filtro esplicito «solo gli errori la cui ultima risposta è
  sbagliata», con il numero e la lista dalla stessa fonte: oggi
  coda({ soloSbagliate }) include anche quelli già ripresi, e «Rifai
  N errori» deve aprire gli N per contratto, non per ordinamento;
- il quadro per tema e per voce a tre stati disgiunti — giusti, da
  rifare, mai visti — che sommano al totale, con visti ed esatte alla
  prima risposta esatti; la vela per voce, senza un peso inventato;
- la regola della frase in cima: una sola indicazione con il suo
  motivo e le selezioni dei suoi pulsanti, oppure niente, con una
  soglia dichiarata nel §4.3;
- il destino di peggiori() e consigli(), che non hanno più una lista
  in pagina: prima elenca i chiamanti e che cosa cambia per ciascuno,
  poi decidi se servono alla regola della frase, se restano orfane
  dichiarate o se escono, e scrivilo.

I requisiti nel §9 della specifica con il loro controllo. Niente
minuti: il punto 7 lo esclude. Non toccare docs/prossime-sessioni.md.
Suite verdi, voce in fondo a [Unreleased], un commit. Chiudi con il
resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `95c7a18`, voce nel CHANGELOG. **Il contratto sta nel §4.3 della
specifica**, ed è quello che P-22 deve leggere:
- `coda({ soloDaRifare })` — solo gli errori la cui ultima risposta è sbagliata,
  contati con `classifica()` come la barra; `soloSbagliate` resta il «Ripasso
  degli errori» dei Quiz;
- `quadro()` — una riga per tema nell'ordine di `diagnosi().temi`, le voci in
  ordine di banca, `giusti`/`daRifare`/`maiVisti` che sommano a `n`, «X su Y»
  come `primo: {esatte, su}` o `null` sotto `PRIMA_MIN_VISTI = 5`, e `rifai`,
  la selezione di «Rifai N errori», con `n: 0`; la vela per voce, con peso
  `null`;
- `dovePesa()` — un tema solo, con motivo e pulsanti, oppure niente con il
  perché: senza pesi, sotto soglia (`FRASE_MIN_VISTI = 20`), niente da fare,
  pari;
- `peggiori()` è uscita dal motore; `consigli()` esce in due tempi.

R-MAPPA-01…14 nel nuovo §9.10, tredici coperti e la pagina scoperta.
`quadro` e `dovePesa` fra gli orfani dichiarati. Tre rotture passate verdi alla
prima stesura, ora ciascuna con il suo test; e una trovata provando: senza
`n: 0` il tetto predefinito di `coda()` avrebbe aperto 20 errori su 35 senza
dirlo. Tre scelte da confermare dall'autore, nel §4. Controllato dalla regia:
motore 167 + 2 skip, server 59, dati 242, interfaccia 579, specifica 480.

### P-22 — ChatGPT: il progetto dell'area 5, Progressi

**Stato:** **chiuso il 29 settembre 2026**, merge `fc5cfe3`. **Dove:** app di
ChatGPT, progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-22. Progetta l'area 5 di docs/prossima-versione.md §5.1,
Progressi, in docs/area-5-progetto.md, sul modello dei progetti delle
aree 1–4. La forma è decisa: è Q-DUE, fra le questioni chiuse del §10
di docs/specifica.md, sette punti con la data — una mappa per tema,
non un bilancio e non una classifica. Il progetto la realizza, non la
rimette in discussione; se un punto non regge, dillo nel resoconto.

Il motore è pronto: il contratto è nel §4.3 della specifica e nel
§9.10 (R-MAPPA), e l'esito di P-41 nel §6 di docs/prossime-sessioni.md
lo riassume. La pagina chiama quadro(), dovePesa() e
coda({ soloDaRifare }), e non rifà i conti; peggiori() non c'è più, e
consigli() esce dalla pagina. Le soglie del §4.3 non si abbassano. Progressi è dei soli
registrati (ADR-004): il progetto dice che cosa vede chi non ha un
account, e il progetto del client è la fonte per gli stati di accesso.
Le tabelle che sforano a 375 px, difetto aperto dalla 0.3.0, qui si
chiudono. Dove serve un controllo, scrivi la dipendenza come il §10.1
delle aree 2, 3 e 4.

Solo il documento e la voce di CHANGELOG: niente site/. Non toccare
docs/prossime-sessioni.md. Un commit con il trailer, versione non
toccata. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `e8f019f`, merge `fc5cfe3`: `docs/area-5-progetto.md` e la sua
voce. La mappa per tema sui sette punti di Q-DUE, senza rimetterli in
discussione; il caso senza pesi d'esame resta leggibile senza peso e senza frase.
**Una dipendenza per Claude prima di P-23**, nel §10.1: i controlli della
pagina in due regimi, con un raccordo estraibile che chiama davvero
`E.quadro()` e `E.dovePesa()` e le rotture già elencate — diventa P-44.
Controllato dalla regia: territori puliti, merge chiusa da sola.

### P-43 — Claude: i dieci gruppi di controlli del client che restano

**Stato:** **chiuso il 29 settembre 2026**, commit `f218935` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano.
**Nasce da:** il resoconto di P-39.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-43, su main. Leggi il §12 di
docs/account-client-progetto.md — «Il contratto», «Il banco stabile» e
«Il resto dei controlli» — e gli esiti di P-38 e P-39 nel §6 di
docs/prossime-sessioni.md.

Sullo stesso banco, i gruppi che P-39 ha lasciato scritti con che cosa
chiedono al banco: C-07…C-10, C-12…C-14, C-16…C-18, in due regimi, con
le rotture deliberate e il banco provato contro sé stesso. Poi quello
che P-39 ha dichiarato scoperto: R-ACC-05, il 401 all'uscita, «Esci da
tutti i dispositivi». P-18 lavora intanto sulla pagina: i tuoi
controlli nuovi riconoscono il regime, e main resta verde. Se è troppo
per un commit, fermati a un confine pulito e dillo; se un gruppo il
banco non lo vede, resta scoperto con il motivo.

Non toccare docs/prossime-sessioni.md. Suite verdi su più giri, voce in
fondo a [Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `f218935`, voce nel CHANGELOG. Tutti e diciotto i gruppi del
§12 esistono: C-07…C-10, C-12…C-14, C-16, C-17, il resto di C-15, e C-18 come
ricerca di frasi senza browser; R-ACC-05 coperto, R-ACC-47…57 nuovi; 110
rotture in tutto. **Un difetto del server trovato misurando**: il CORS non
esponeva `Retry-After`, quindi nessuna pagina poteva dire quanto aspettare dopo
un `429` — corretto, R-ACC-49. Due difetti della pagina di riferimento che
valevano anche per P-18, tre verdi falsi del banco, un banco che si appendeva,
e uno caduto una volta su diciassette, con il meccanismo riprodotto. **Q-SUITE
peggiora**: circa 85 s, e le suite di due worktree si contendono la porta 8620.
Controllato dalla regia: interfaccia 928 in 86 s, specifica 546, server 60.

### P-44 — Claude: i controlli della mappa di Progressi

**Stato:** **chiuso il 30 settembre 2026**, commit `df037e0` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce
da:** P-22, §10.1 di `docs/area-5-progetto.md`.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-44, su main. Leggi il §10.1 di docs/area-5-progetto.md, il
§4.3 e il §9.10 della specifica, e gli esiti di P-06, P-31 e P-41 nel
§6 di docs/prossime-sessioni.md.

I controlli della pagina di Progressi in due regimi, come il §10.1
chiede: il regime della diagnosi di oggi e quello della mappa. Il
raccordo estraibile — da { banca, progress, oggi, kind, pesi } alle
righe e alle selezioni, chiamando davvero E.quadro() ed E.dovePesa() —
scritto nel repo prima del codice della pagina, con la pagina di
riferimento e le rotture che il §10.1 elenca. R-MAPPA-14 nella
specifica con la copertura che il banco dà davvero. Main resta verde
con la pagina di oggi.

Non toccare docs/prossime-sessioni.md. Suite verdi su più giri, voce in
fondo a [Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `df037e0`, voce nel CHANGELOG. I controlli di Progressi in
due regimi, riconosciuti dal raccordo — `mappaProgressi()`,
`anteprimaProgressi()`, `avviaProgressi()` —, il cui contratto è scritto nel
§10.1 di `docs/area-5-progetto.md` prima della pagina. Nel regime progettato
`tests/mappa_progressi.mjs` esegue il raccordo con motore e banca veri e conta
le chiamate; la pagina di riferimento `tests/pagina-mappa-progressi.html` ha 23
rotture, tutte rosse per il loro motivo, e il banco è stato provato contro sé
stesso. R-MAPPA-14 coperto per quello che il banco esegue, R-MAPPA-15 e 16
nuovi, R-MAPPA-17 scoperto (testi e disegno, al collaudo di P-23). **Trovato:**
con i pesi del decreto, chi ha visto 20 quesiti o più senza toccare né
Navigazione né Manovra non ha la frase — `dovePesa()` risponde `pari`
(4 × 322/322 = 4 × 155/155) —; è la regola confermata il 29 settembre che fa il
suo lavoro, scritta nel §4.3 della specifica, e non chiede una decisione. Due
indicazioni per P-23 nel §10.1 del progetto: la riga `diagnosi` delle chiamate
protette esce con la vecchia diagnosi, `serieGruppi` resta solo se l'andamento
la chiama. Controllato dalla regia sullo stato fuso con P-08: motore 167/169,
server 60/60, dati 242, specifica 572, guardiano verde, interfaccia 1.181 in 122 s;
i luoghi del «Trovato» esistono. La regia **non** ha ripetuto i giri sotto
carico né quello con la LTS: valgono quelli della sessione.

### P-40 — Claude: chiudere il regime vecchio dei controlli del client

**Stato:** **chiuso il 30 settembre 2026**, commit `4f36846` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-40, su main. P-18 ha portato il client degli account nella
pagina vera, e la regia l'ha fuso: leggi gli esiti di P-18 e P-43 nel
§6 di docs/prossime-sessioni.md, e il §12 di
docs/account-client-progetto.md.

Chiudi il regime vecchio come hanno fatto P-12 e P-37: in
tests/test_interfaccia.py resta solo il regime del client per C-01…C-18,
e la pagina di prima, senza indirizzoApi(), ora dev'essere rossa.
Decidi che cosa resta di tests/pagina-client-account.html: se serve
ancora alle rotture, resta. Nella specifica i requisiti R-ACC dicono
coperto quello che la pagina fa davvero, e scoperto — con il motivo —
quello che il banco non vede. Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md): la suite di un altro worktree la contende.

Non toccare docs/prossime-sessioni.md. Suite verdi su più giri, voce in
fondo a [Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `4f36846`, voce nel CHANGELOG. Un regime solo: la pagina senza
`indirizzoApi()` è rossa (R-ACC-58, provato sulla pagina di prima: 16 gruppi su
17 rossi, e C-01 verde come deve, perché le attività senza account le faceva
già). La pagina di riferimento resta, con le 110 rotture. R-ACC-59…63 scoperti
con il motivo. **Due rossi falsi del banco trovati facendolo girare**, entrambi
corretti e misurati: C-13 che azzerava l'account a invio in corso, 1 giro su
14; e l'accesso dato per finito prima che la pagina chiudesse la finestra, 4
su 176 sotto carico — ora 0 su 240. Suggerisce un prompt per le tre scelte che
nessun controllo preme: diventa P-46. Controllato dalla regia: interfaccia 1.096
in 117 s, specifica 560, le altre invariate.

### P-26 — Claude: i testi fuori da `site/`, nella versione con gli account

**Stato:** **chiuso il 30 settembre 2026**, commit `c053e03` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-26, su main. Il client degli account è nella pagina (P-18),
e con lui i testi di site/. Restano quelli fuori da site/ che gli
account rendono falsi, elencati nel §1 di docs/prossime-sessioni.md e
nel §18 di docs/account-progetto.md: README.md («niente account, niente
registrazione», «Come funziona»), la skill .claude/skills/rotta-giusta
(«nessun server»), AGENTS.md («site/ è l'unica cosa pubblicata», il
server che gira altrove). Nella specifica le sezioni che il §2.5 elenca
come vere solo senza account si riscrivono per i due stati, e il §2.5
dice che cosa è cambiato; in docs/filosofia.md la nota in testa, che
dice che descrive il sito deciso e non quello pubblicato, resta finché
il rilascio non c'è — scrivilo così.

Il sito con gli account non è ancora pubblicato: ogni testo dice il
vero nel giorno del rilascio, e fino ad allora main non si pusha (§4 di
docs/prossime-sessioni.md). Non toccare docs/prossime-sessioni.md.
Suite verdi, voce in fondo a [Unreleased], un commit. Chiudi con il
resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `c053e03`, voce nel CHANGELOG. README, la skill e
`AGENTS.md` descrivono i due stati e il server su `api.rottagiusta.it`, con la
chiusura di un rilascio che aggiorna anche il server. Nella specifica il §2.5
dice ora che cosa è cambiato, e §3, §4.6, §5.3, §5.4, §7.1, §7.4, §7.8 e
l'appendice A sono riscritti per i due stati; **trovati falsi anche §4.5 e §8**,
fuori dall'elenco, e corretti. La nota in testa a `docs/filosofia.md` resta e
dice che si toglie nel commit del rilascio: è in P-27. Le righe del §5 sulle sei
modalità restano a P-12. **Trovato** nella pagina: l'avviso «archivio
alternativo» (`ARCH.lettura` `ripiego_*`) non può più comparire, perché nessuno
assegna quei valori — scritto nella voce di CHANGELOG, e va a P-48.

### P-24 — ChatGPT: il progetto dell'area 6, la rifinitura trasversale

**Stato:** **chiuso il 30 settembre 2026**, merge `625878f`.
**Dove:** app di ChatGPT, progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-24. Progetta l'area 6 di docs/prossima-versione.md §5.1, la
rifinitura trasversale — linguaggio, componenti, responsive,
accessibilità, stati: i capitoli 17–22 della Specifica UX/UI —, in
docs/area-6-progetto.md, sul modello dei progetti delle aree 1–5.

Parti da quello che c'è già: le misure dell'appendice A della specifica
da rifare sul tema chiaro, lo zoom nativo al 200 % che P-05 non ha
potuto verificare, il lettore di schermo mai provato, e i limiti che i
collaudi delle aree 1–4 e del client hanno dichiarato. Il sito ha ora
due stati, con e senza account: la rifinitura li copre tutti e due. Non
ridisegnare le aree: dove una scelta di un'area va cambiata, scrivilo
come proposta per l'autore. Le dipendenze da test e specifica le
scrivi come il §10.1 delle altre aree: le chiude Claude su main.

Solo il documento e la voce di CHANGELOG: niente site/. Non toccare
docs/prossime-sessioni.md. Un commit con il trailer, versione non
toccata. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `a8665cb`, merge `625878f`: `docs/area-6-progetto.md` e la sua
voce. La rifinitura nei due stati, con i limiti dichiarati — zoom nativo al
200 % e lettore di schermo ancora senza prova. Quattro proposte per l'autore nel
§8 del progetto, da decidere prima di P-25 (§4 qui). Le dipendenze del §10.1
diventano P-45. Controllato dalla regia: territori puliti, merge chiusa da sola.

### P-45 — Claude: i controlli e la specifica dell'area 6

**Stato:** **chiuso il 30 settembre 2026**, commit `cb4cea1` su `main`; lanciato dalla regia (punto 8). **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** P-24, §10.1 di `docs/area-6-progetto.md`.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-45, su main. Leggi il §10.1 e il §9 di
docs/area-6-progetto.md, l'appendice A e il §9 della specifica, e gli
esiti di P-06, P-31 e P-40 nel §6 di docs/prossime-sessioni.md.

I controlli della rifinitura trasversale che il §10.1 chiede, in due
regimi e con le rotture deliberate che elenca: lo stato senza account
che dice «salvato», l'account offline che dice «sul server», l'errore
di scrittura che spegne Info, il 401 che mostra righe dell'identità
precedente, un conteggio senza fonte, un pannello che perde il fuoco,
un avviso nel DOM ma nascosto, una tabella che sborda a 320 e 375 px.
Dove serve la geometria, il fuoco o l'annuncio, il banco del browser
misura invece di cercare stringhe. Nella specifica, requisiti per
contrasto del tema chiaro, reflow e zoom, target e fuoco, stati nei due
regimi, lettore di schermo: coperti dove il banco li misura, scoperti
con il motivo e la prova manuale che servirà dove no. L'appendice A con
le misure osservate, senza dichiarare «conforme AA» e senza dare per
fatta una prova non eseguita. Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md).

Non toccare docs/prossime-sessioni.md. Suite verdi su più giri, voce in
fondo a [Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `cb4cea1`, voce nel CHANGELOG. Nove gruppi nuovi nel banco del
client, T-01…T-09 (`test_rifinitura_*`), nei due regimi d'accesso: il banco
misura nel browser — larghezza emulata, tasti veri, colori e rettangoli
calcolati, albero di accessibilità — invece di cercare stringhe;
`tests/browser.mjs` ha `dimensioni()`, `tasto()`, `accessibile()`,
`schermata()`. La pagina di riferimento ha 31 rotture nuove, e il banco è provato
contro sé stesso. Contratto nel §10.3 dell'area 6; nella specifica il §9.11 con
R-RIF-01…16, undici coperti e cinque scoperti con la prova manuale scritta —
zoom e testo al 200 %, contrasto non testuale, percorsi solo da tastiera,
lettore di schermo, e gli stati con l'account —; R-A11Y-03 coperto; appendice A
con le misure del 30 settembre, senza «conforme AA». **Trovati sette difetti
della pagina vera**, dichiarati con la verifica che li dimostra fra i «Difetti
aperti dichiarati» di `docs/eccezioni-interfaccia.md` (righe T-*): lo stato
dell'invio che dice «confermate sul server» con righe in coda (T-02, due righe),
il fuoco sotto la barra fissa a 375 px (T-05), lo scorrimento laterale a 320 px
(T-07, due righe), un grigio a 4,26:1 (T-08), i tag N/L/C a 31×29 px (T-09).
Tengono già, e ora sono protetti: il guasto annunciato su Info, il 401 senza le
righe di A per B, il fuoco della finestra «Accedi», nessuno sbordo a 375 px. Un
buco del banco chiuso: la pagina di riferimento senza meta viewport misurava a
980 px. **Per la coda:** T-02 va a P-52, prima del traguardo; gli altri sei a
P-25, che toglie le righe T-* nello stesso commit. La suite dura ~186 s
(Q-SUITE). Controllato dalla regia: motore 185/187, server 60/60, dati 242,
specifica 758, guardiano verde, interfaccia 1.863 in 189 s. Il resoconto dice
«erano 703» per la specifica, la regia ne aveva misurati 704 dopo P-35: la
differenza non cambia niente, e non è stata indagata.

### P-46 — Claude: le tre scelte del client che nessun controllo preme

**Stato:** **chiuso il 30 settembre 2026**, commit `9af5200` su `main`. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** il resoconto di
P-40, R-ACC-63.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-46, su main. Leggi R-ACC-63 nel §9.9 della specifica, il
§12 di docs/account-client-progetto.md, e l'esito di P-40 nel §6 di
docs/prossime-sessioni.md.

Tre scelte della pagina che nessun gruppo di controlli preme, e che il
banco reggerebbe: «Scarica e passa al nuovo archivio» dopo un
azzeramento fatto altrove, «Cancella queste risposte» dopo il recupero
della password, e l'uscita con punteggi dei Segnali non ancora accolti
dal server. Un controllo per ciascuna sulla pagina vera, con le sue
rotture deliberate della pagina di riferimento, rosse per il loro
motivo. Se una delle tre non fa quello che dice, è un difetto della
pagina: scrivilo, con la riproduzione, e lascia il requisito scoperto
per quella parte — la correzione è di ChatGPT su ui/main. R-ACC-63
dice coperto quello che lo è. Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md).

Non toccare docs/prossime-sessioni.md. Suite verdi su più giri, voce in
fondo a [Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `9af5200`, voce nel CHANGELOG. Le tre scelte hanno una parte
ciascuna nel loro gruppo — `C-13:scarica`, `C-08:cancella`, `C-15:segnali` — e
un controllo sulla pagina vera; fanno tutte e tre quello che dicono. R-ACC-63,
che le raccoglieva, è diviso in **R-ACC-63, 64 e 65**, coperti: il «R-ACC-63»
del prompt qui sopra ora indica solo la prima. La pagina di riferimento fa le
tre scelte come la pagina vera, con 13 rotture nuove, e prima perdeva i
punteggi dei Segnali uscendo. **Trovato:** un difetto della pagina vera — i
pulsanti «Carica il nuovo archivio» e «Cancella queste risposte», premuti
senza la loro spunta, non fanno e non dicono niente — scritto come **R-ACC-66**,
scoperto, con la riproduzione nel §12 di `account-client-progetto.md`, «Le tre
scelte»: diventa P-48 per ChatGPT e P-49 per il controllo. Un verde del banco
che non misurava niente, corretto; una frase goffa dell'uscita con soli
punteggi (§12); la suite più lunga di 33 s, in Q-SUITE. Controllato dalla
regia sullo stato fuso con P-26 e P-23: vedi il registro del 30 settembre.

### P-23 — ChatGPT: la realizzazione dell'area 5

**Stato:** **chiuso il 30 settembre 2026**, merge `ee54b69`. **Dove:** app di
ChatGPT, progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`, modalità Local.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-23. Realizza docs/area-5-progetto.md in site/app.html:
Progressi come mappa per tema. Prima leggi gli esiti di P-41, P-22 e
P-44 nel §6 di docs/prossime-sessioni.md, il §4.3 e il §9.10 della
specifica, e per intero il §10.1 del progetto: è il contratto che la
pagina deve rispettare — le tre funzioni di raccordo mappaProgressi(),
anteprimaProgressi(), avviaProgressi() — e che la suite ora esegue.
Nello stesso §10.1 ci sono le due indicazioni di P-44 sulle chiamate
protette (diagnosi, serieGruppi) e «Che cosa il controllo non vede»,
che è il tuo collaudo.

Nello stesso commit, in docs/eccezioni-interfaccia.md: consigli() passa
dalle chiamate protette agli orfani, con il motivo «esce»; quadro e
dovePesa escono dagli orfani ed entrano fra le chiamate protette. Dove
dovePesa() non dà la frase — sotto soglia, a pari merito, senza pesi —
al suo posto non va niente: il caso `pari` che P-44 ha trovato è la
regola che fa il suo lavoro. La suite dell'interfaccia vuole Chrome e
la porta 8620 libera (lsof -iTCP:8620 -sTCP:LISTEN), che la cartella
principale può tenere occupata; se non gira, fermati e dillo, non
saltarla. Se un contratto o un controllo ti sta stretto, fermati e
dillo: cambiarlo tocca main.

Non toccare docs/prossime-sessioni.md. Tutte le suite verdi, collaudo
guardato a 375 e 1280 px nei due stati d'accesso — le tabelle che dalla
0.3.0 sforano di 89 px non devono più sforare —, voce in fondo a
[Unreleased], un commit con il trailer, versione non toccata. Chiudi
con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `530e5b5` su `ui/main`, merge `ee54b69`. Progressi è la
mappa per tema, con azioni e anteprima dal raccordo di P-44; prove, andamento e
sessioni stanno separati; «Cosa studiare adesso» e le due tabelle escono. In
`docs/eccezioni-interfaccia.md` `consigli()` passa agli orfani con il motivo
«esce», `quadro()` e `dovePesa()` entrano fra le chiamate protette,
`diagnosi()` esce e `serieGruppi()` resta. Collaudo della sessione, scritto
nella voce di CHANGELOG: a 375 px nessuno sbordamento della pagina né delle 52
schede, e nel caso `pari` gli otto temi restano senza frase. Controllato dalla
regia: territori puliti, trailer, merge chiusa da sola, `git log main..ui/main`
vuoto, la riga vuota mancante nel CHANGELOG aggiunta. Il collaudo nel browser
**non** l'ha ripetuto la regia.

### P-47 — Claude: dopo P-23 — il regime vecchio di Progressi, e `consigli()` fuori dal motore

**Stato:** **chiuso il 30 settembre 2026**, commit `d579bb6` su `main`. Assorbe P-42. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** i resoconti
di P-41, P-44 e P-23.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-47, su main. P-23 ha portato la mappa di Progressi nella
pagina vera, e la regia l'ha fusa: leggi gli esiti di P-41, P-44 e P-23
nel §6 di docs/prossime-sessioni.md, il §4.3 e il §9.10 della
specifica, e il §10.1 di docs/area-5-progetto.md.

Due lavori, in quest'ordine.
1. Chiudi il regime vecchio di Progressi come P-40 ha fatto per il
   client: in tests/test_interfaccia.py resta solo il regime della
   mappa, e la pagina con la diagnosi a due tabelle ora dev'essere
   rossa — provato su quella di prima di P-23. Decidi che cosa resta
   di tests/pagina-mappa-progressi.html: se serve alle rotture, resta.
   R-MAPPA-14…17 dicono coperto quello che la pagina vera fa, e
   scoperto con il motivo quello che il banco non vede.
2. consigli() esce dal motore, il secondo tempo che P-41 ha scritto
   nel §4.3: prima elenca chi la chiama ancora — non dev'essere
   nessuno —, poi togli la funzione, CONSIGLIO_MIN_VISTI e i loro
   test, e la riga fra gli orfani di docs/eccezioni-interfaccia.md.
   La specifica lo dice dove oggi dice «esce in due tempi».

Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md): ChatGPT può averla. Non toccare
docs/prossime-sessioni.md. Suite verdi su più giri, voce in fondo a
[Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `d579bb6`, voce nel CHANGELOG. Progressi ha un regime solo:
una pagina senza il raccordo è rossa e nomina la funzione che manca, e lo è
anche una pagina che tiene le tabelle `d-temi`/`d-voci` o chiama
`E.diagnosi()` accanto alla mappa (ventiquattresima rottura); la pagina vera
deve fare tante verifiche quante quella di riferimento, gruppo per gruppo.
Provato sulla pagina di prima di P-23: otto rossi della mappa. La pagina di
riferimento resta per le rotture, come quella del client. `consigli()` è uscita
dal motore con `CONSIGLIO_MIN_VISTI` e i suoi sette test, dopo aver visto che
non la chiamava più nessuno; specifica §4.3, §5.4 e registro, nota di chiusura
nel §10.1 dell'area 5. Lo sbordamento a 375 px non l'ha rimisurato: lo chiude
il collaudo di P-23, e nessun controllo lo tiene (R-MAPPA-17). **Trovato:** il
CSS di `.cons` in `app.html` non lo usa più nessuno — scritto nella voce di
CHANGELOG, e va a P-21. Controllato dalla regia sullo stato fuso con P-48: vedi
il registro del 30 settembre.

### P-48 — ChatGPT: i pulsanti di conferma che non dicono niente

**Stato:** **chiuso il 30 settembre 2026**, merge `b430cdb`. **Dove:** app di ChatGPT, progetto
`~/Software/rotta-giusta-ui`, ramo `ui/main`, modalità Local. **Nasce da:** i
resoconti di P-46 e P-26.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-48. Leggi gli esiti di P-46 e P-26 nel §6 di
docs/prossime-sessioni.md, R-ACC-66 nel §9.9 della specifica, e nel
§12 di docs/account-client-progetto.md la sezione «Le tre scelte».

Il difetto è R-ACC-66: «Carica il nuovo archivio» senza «Ho conservato
il file» e «Cancella queste risposte» senza «Confermo la
cancellazione» non fanno niente e non dicono niente — il primo scrive
in un #account-esito che il suo pannello non ha. Premuti senza la
spunta, devono dire che cosa manca, dove chi studia lo vede, e non fare
altro. La riproduzione è nel §12. Nella stessa sezione c'è la frase
dell'uscita con soli punteggi dei Segnali, «0 risposte non sono sul
server…»: rendila giusta. E l'avviso «archivio alternativo»
(ARCH.lettura ripiego_*) che P-26 ha trovato impossibile da accendere,
nella sua voce di CHANGELOG: toglilo, o scrivi perché resta.

Il controllo di R-ACC-66 sulla pagina vera lo aggiunge Claude su main
dopo la merge (P-49): non toccare tests/. La suite dell'interfaccia
vuole Chrome e la porta 8620 libera (lsof -iTCP:8620 -sTCP:LISTEN), che
la cartella principale può tenere occupata; se non gira, fermati e
dillo. Non toccare docs/prossime-sessioni.md. Tutte le suite verdi,
collaudo guardato a 375 e 1280 px, voce in fondo a [Unreleased], un
commit con il trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `5f75abf` su `ui/main`, merge `b430cdb`, voce nel CHANGELOG.
I due pulsanti, premuti senza la spunta, dicono quale casella manca nel loro
pannello e non fanno altro; la frase dell'uscita con soli punteggi dei Segnali
non parla più di «0 risposte»; l'avviso «archivio alternativo», che non poteva
comparire, è tolto. Collaudo della sessione in Chrome a 375 e 1280 px. **Il
resoconto non era nella forma fissa**: le informazioni c'erano tutte, e la
regia le ha lette nella voce di CHANGELOG. Controllato dalla regia: territori
puliti, trailer, `git log main..ui/main` vuoto, riga vuota aggiunta nel
CHANGELOG; il controllo di R-ACC-66 sulla pagina vera è P-49.

### P-49 — Claude: il controllo di R-ACC-66 sulla pagina vera

**Stato:** **chiuso il 30 settembre 2026**, commit `b9face5` su `main`; lanciato dalla regia (punto 8). **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** i resoconti
di P-46 e P-48.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-49, su main. Leggi gli esiti di P-46 e P-48 nel §6 di
docs/prossime-sessioni.md, R-ACC-66 nel §9.9 della specifica, e «Le tre
scelte» nel §12 di docs/account-client-progetto.md.

P-48 ha corretto i due pulsanti di conferma che, premuti senza la
spunta, non facevano e non dicevano niente. Aggiungi il controllo di
R-ACC-66 alle parti C-13:scarica e C-08:cancella: sulla pagina vera il
clic senza spunta dice che cosa manca, in quello che si vede, e non
cambia né la copia né il server; con le rotture della pagina di
riferimento — il silenzio di prima, il messaggio in un elemento che non
c'è o nascosto, l'azione fatta lo stesso — rosse per il loro motivo.
Provalo anche sulla pagina di prima di P-48, site/app.html di
9ae8359: dev'essere rossa. R-ACC-66
passa a coperto per quello che il banco vede.

Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md). Non toccare docs/prossime-sessioni.md. Suite
verdi su più giri, voce in fondo a [Unreleased], un commit. Chiudi con
il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `b9face5`, voce nel CHANGELOG. In `C-13:scarica` e
`C-08:cancella`, dopo il clic senza spunta il banco guarda per 1,5 s che copia
e server non cambino, poi che la finestra `aria-modal` nomini la casella che
manca in quello che si vede — nell'`innerText`, più volte che nella sola
etichetta. Undici rotture nuove della pagina di riferimento, ognuna rossa per il
suo motivo; nuovo `test_client_conferma_mancante`; R-ACC-66 coperto. La pagina di
prima di P-48 è rossa sulle due verifiche del messaggio, e solo lì. Il banco è
stato provato contro sé stesso: con `textContent` passano le rotture nascoste,
e la difesa «dentro la finestra» non la esercitava nessuna rottura finché non
ne è entrata una apposta. Non vede la vicinanza alla casella, l'annuncio, il
contrasto, un testo reso invisibile con `opacity` o col colore del fondo:
restano a R-ACC-60 e R-A11Y-03 (§12 del progetto del client). Controllato dalla
regia: motore 160/162, server 60/60, dati 242, specifica 586, guardiano verde,
interfaccia 1.433 in 149 s; nessun `yes` rimasto vivo.

### P-21 — ChatGPT: la realizzazione dell'area 4

**Stato:** **chiuso il 30 settembre 2026**, merge `1bb916a`. Si era fermato una volta, sul controllo che P-51 ha corretto, e ha ripreso con il blocco «Ripresa». Prima era: fermato. Lanciato
dall'autore; la sessione si è fermata da sé, come il prompt chiede, perché
`test_carteggio_ambito` pretende che `app.html` sia nel regime attuale — un
difetto del controllo di P-35, non della pagina, che chiude P-51. La modifica di
`app.html` resta **non committata** nel worktree `ui`: il raccordo D-04 passava
le 240 verifiche del banco del carteggio, la suite del browser non è stata
completata, e al primo avvio i server locali hanno risposto `EPERM` dalla
sandbox di ChatGPT — come per P-13 e P-48, si rilancia dando all'app il
permesso per le connessioni locali. La dichiarazione di C-19 è stata rimessa
com'era. Il worktree `ui` **non si allinea** finché la bozza non è committata,
salvo un avanzamento veloce che non tocca `app.html`. **Dove:** app di ChatGPT, progetto `~/Software/rotta-giusta-ui`, ramo
`ui/main`, modalità Local.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-21. Realizza docs/area-4-progetto.md in site/app.html: il
Carteggio con le tre porte, i materiali, il confronto, il giudizio di
chi studia e il ciclo completo. Prima leggi gli esiti di P-20, P-32,
P-33, P-34 e P-35 nel §6 di docs/prossime-sessioni.md, e le tre cose
di P-34 e P-35 che l'autore ha confermato nel §4. Il contratto che la pagina deve
rispettare è il §10.1 del progetto, D-01…D-04 — il raccordo delle
cinque funzioni che la suite ora esegue —, più il §9.4 di
docs/account-client-progetto.md per la bozza con l'account: la pagina
chiama il motore, non rifà i conti. Escono dalla pagina componiProva(),
argomentiSenzaNuovi(), le costanti PROVA_* e ARGOMENTI; le righe si
scrivono solo da concludiCarteggio() e rispostaTecnica(); la frase
«Sei tu a giudicare» resta visibile prima di Inizia.

Nello stesso commit, in docs/eccezioni-interfaccia.md: le funzioni del
motore che la pagina comincia a chiamare escono dagli orfani ed entrano
fra le chiamate protette, e quelle che smette di chiamare escono dalle
protette; e la riga di C-19 fra i «Difetti aperti dichiarati» si
toglie, perché la bozza ora c'è. La riga gemella fra i «Difetti noti»
di AGENTS.md è delle regole: non toccarla, la toglie Claude su main.
Togli anche il CSS di .cons che nessuno usa (voce P-47 del CHANGELOG).

La suite dell'interfaccia vuole Chrome e la porta 8620 libera
(lsof -iTCP:8620 -sTCP:LISTEN), e dura circa tre minuti; se non gira,
fermati e dillo, non saltarla. Se un contratto o un controllo ti sta
stretto, fermati e dillo: cambiarlo tocca main.

Non toccare docs/prossime-sessioni.md. Tutte le suite verdi, collaudo
guardato a 375 e 1280 px nei due stati d'accesso, compresa una ricarica
a metà prova con l'account, voce in fondo a [Unreleased], un commit con
il trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Ripresa** — da incollare nella stessa sessione di ChatGPT se è ancora aperta,
altrimenti dopo il prompt qui sopra in una nuova. Prima, nell'app di ChatGPT, il
permesso per le connessioni locali: senza, la suite dell'interfaccia non parte.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Ripresa di P-21. Il controllo che ti aveva fermato è corretto su main
(P-51) e ui/main è stato allineato senza toccare la tua bozza di
site/app.html: leggi l'esito di P-51 nel §6 di
docs/prossime-sessioni.md. P-51 ha fatto girare la suite sulla tua
bozza: 21 rossi, nessuno di regime. Dodici sono le righe di
docs/eccezioni-interfaccia.md che il prompt già ti chiede di
aggiornare. Gli altri nove hanno una causa sola: «Che tecnica serve?»
si apre da data-cporta="tecniche" e nessun elemento ha più
data-v="tec", quindi #v-tec risulta senza ingresso e il banco del
client non ci entra. La regia ha deciso: la vista resta, e la porta
del Carteggio che la apre porta anche data-v="tec". Se questo non si
può fare senza cambiare il disegno del progetto, fermati e dillo.

Prima di dire che la suite è verde, guarda che C-01 faccia tutte le sue
verifiche e che T-07, T-08 e T-09 entrino davvero nella vista delle
tecniche: sulla bozza di prima T-09 risultava «chiuso» per un verde
falso, perché non misurava i tag. Il resto del prompt di P-21 vale
com'era.
```

**Esito:** commit `129649a` su `ui/main`, merge `1bb916a`, voce nel CHANGELOG. Il
Carteggio nella pagina: tre porte, preparazioni, guida ed esempio, confronto e
giudizio, riepilogo e revisione, con il raccordo del motore; la bozza
dell'account riprende testo, posizione e scadenza dopo una ricarica. In
`docs/eccezioni-interfaccia.md` le chiamate aggiornate e la riga di C-19 tolta;
tolto il CSS di `.cons`. La porta del Carteggio porta `data-v="tec"`. **Trovato**,
dalla sessione: C-01 fa 34 verifiche su 34, C-19 è verde in tutte e sette le
parti, T-07, T-08 e T-09 entrano nella vista delle tecniche. Controllato dalla
regia: territori puliti, trailer, `git log main..ui/main` vuoto, CHANGELOG già
con la sua riga vuota; sullo stato fuso motore 194/197 — il terzo test saltato
è il confronto con `componiProva()`, che si è ritirato da solo come previsto —,
server 60/60, dati 242, specifica 782, guardiano verde, interfaccia 2.138 in 246
s. La regia **non** ha ripetuto il collaudo nel browser. `tagPerTentativo()` è
ancora la copia della pagina: resta a P-52. Il resoconto dice «3 skip previsti»,
ed è esatto.

### P-51 — Claude: il controllo del Carteggio che fissa il regime della pagina vera

**Stato:** **chiuso il 30 settembre 2026**, commit `14b194d` su `main`; lanciato dalla regia (punto 8). **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** P-21, fermato.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-51, su main. P-21 si è fermato: leggi il suo stato e
l'esito di P-35 nel §6 di docs/prossime-sessioni.md. In
tests/test_interfaccia.py, test_carteggio_ambito prova «al contrario»
che una pagina che carica carteggio_e12.json è rossa, e per farlo
etichetta app.html come regime 'attuale' e pretende regime == nome: il
giorno che la pagina vera passa al regime progettato, il controllo è
rosso anche se la pagina è giusta. È l'unico punto che fissa il regime
della pagina vera invece di riconoscerlo, e va corretto così: la pagina
vera si riconosce, in qualunque regime, e una sua copia che carica il
file è rossa lo stesso; la pagina di riferimento resta 'progettato'.

Prima il test che lo dimostra: una copia di app.html con il raccordo di
tests/pagina-ciclo-carteggio.html, o la pagina di riferimento al posto
della vera, dev'essere verde su quel controllo, e oggi non lo è. Poi
cerca nei banchi dei quattro regimi — quiz, ciclo, mappa, carteggio —
ogni altro punto che dia per scontato il regime della pagina vera invece
di leggerlo, e dillo anche se non ne trovi. Main resta verde con la
pagina di oggi.

Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md). Non toccare docs/prossime-sessioni.md né
site/app.html. Suite verdi, voce in fondo a [Unreleased], un commit.
Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `14b194d`, voce nel CHANGELOG. `test_carteggio_ambito`
riconosce il regime della pagina vera con `riconosci_carteggio()` — la regola di
`regime_carteggio()` estratta, non cambiata —, e la pagina di riferimento resta
fissata a «progettato». Il test prima rosso gira su due pagine nel regime
progettato, fra cui una copia di `app.html` con il raccordo innestato: 2 rossi
con la regola di prima, 0 dopo. Nessun altro punto dei banchi fissa il regime
della pagina vera. **Nuovo `RG_PAGINA=<file>`**: tutta la suite dell'interfaccia
su una copia della palestra, e la riga finale lo dice; in `AGENTS.md`, nel §9.6
della specifica e nel CHANGELOG. **Trovato**, facendo girare la suite sulla bozza
di P-21 copiata nello scratchpad: 21 rossi su 2.110, nessuno di regime — 12 sono
le righe di `docs/eccezioni-interfaccia.md` che P-21 deve già aggiornare, 9 hanno
una causa sola: nella bozza «Che tecnica serve?» si apre da
`data-cporta="tecniche"` e nessun elemento ha più `data-v="tec"`, quindi `#v-tec`
risulta senza ingresso (R-NAV-01), il banco del client non ci entra, e il
difetto T-09 risulterebbe chiuso per un verde falso. **Deciso dalla regia**: la
vista resta, e la porta del Carteggio porta l'aggancio `data-v="tec"` — scritto
nel blocco «Ripresa» di P-21. Controllato dalla regia: motore 185/187, server
60/60, dati 242, specifica 758, guardiano verde, interfaccia 1.872 in 190 s.

### P-52 — ChatGPT: lo stato dell'invio che dice «sul server» con righe in coda, e il codice morto

**Stato:** **chiuso il 1° ottobre 2026**, merge `bd57daf`. **Dove:** app di ChatGPT, progetto `~/Software/rotta-giusta-ui`,
ramo `ui/main`, modalità Local. **Nasce da:** P-45, T-02.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-52. Leggi l'esito di P-45 nel §6 di
docs/prossime-sessioni.md e le due righe T-02 fra i «Difetti aperti
dichiarati» di docs/eccezioni-interfaccia.md. Con due risposte in coda
la pagina dice ancora «Le risposte di questo dispositivo sono
confermate sul server»: lo stato dell'invio si ridipinge solo quando un
tentativo d'invio finisce, quindi per un secondo offline, e fino ai 15 s
del timeout con una rete che non risponde, la pagina afferma una cosa
falsa. Il numero da inviare deve essere quello della coda dal momento
in cui una risposta ci entra. P-45 indica una causa — archivia() non
chiama dipingiContoStato() —: verificala prima di fidarti.

Nello stesso commit togli le due righe T-02 da
docs/eccezioni-interfaccia.md: da lì i controlli T-02 girano verdi
sulla pagina vera, e la suite lo pretende. Le altre righe T-* sono di
P-25: non toccarle. La suite dell'interfaccia vuole Chrome, la porta
8620 libera e il permesso per le connessioni locali; se non gira,
fermati e dillo. Se un controllo ti sta stretto, fermati e dillo:
cambiarlo tocca main.

Nello stesso lavoro, se P-21 non l'ha già fatto, togli il codice morto
che P-12 e P-47 hanno trovato: il selettore globale «solo mai fatte»
non ha più un interruttore, quindi S.prep è sempre falso, e sono morti
dipingiPrep(), quotaPrep(), #c-prep, i rami «S.prep ?» e il CSS .prep
(voce «Test — P-12» del CHANGELOG); e il
filtro sulle righe con ts prima di E.ritmo() nell'anteprima dei Quiz,
superfluo da quando il motore se ne difende da sé (voce P-16). E
sostituisci la copia di tagPerTentativo() con E.tagPerTentativo(S.archivio):
nello stesso commit la sua riga esce dagli orfani ed entra fra le chiamate
protette di docs/eccezioni-interfaccia.md (voce P-17).

Non toccare docs/prossime-sessioni.md. Tutte le suite verdi, collaudo
guardato con la rete spenta e con una rete lenta, voce in fondo a
[Unreleased], un commit con il trailer, versione non toccata. Chiudi
con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `0ed6e3a` su `ui/main`, merge `bd57daf`, voce nel CHANGELOG.
T-02 riprodotto prima della correzione; ora `archivia()` ridipinge lo stato
appena la transazione locale accoda, e con la rete che non risponde e offline
la pagina dice «2 risposte da inviare» (schermate della sessione, fuori dal
repo). Tolte le due righe T-02 da `docs/eccezioni-interfaccia.md`, il codice
morto del selettore globale e il filtro superfluo prima di `E.ritmo()`; la
revisione chiama `E.tagPerTentativo(S.archivio)`. `#c-prep` resta, perché P-21
lo usa nella preparazione del Carteggio. **Il resoconto non era nella forma
fissa**: c'era tutto, e la regia l'ha letto contro il diff. Controllato dalla
regia: territori puliti, trailer, `git log main..ui/main` vuoto, riga vuota
aggiunta nel CHANGELOG; sullo stato fuso con P-53 motore 193/197 — il quarto
test saltato è il confronto con la copia di `tagPerTentativo()`, ritirato da
solo —, server 60/60, dati 242, specifica 784, guardiano verde, interfaccia
2.168 in 243 s, compreso il controllo nuovo delle frasi del riepilogo.

### P-50 — Claude: chiudere il regime vecchio dei controlli del Carteggio

**Stato:** **chiuso il 1° ottobre 2026**, commit `4e601a0` su `main`; lanciato dalla regia (punto 8). **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** i resoconti
di P-35 e P-21.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-50, su main. P-21 ha portato il Carteggio nella pagina vera
e la regia l'ha fuso: leggi gli esiti di P-35, P-51 e P-21 nel §6 di
docs/prossime-sessioni.md, e il §10.1 di docs/area-4-progetto.md.

Chiudi il regime vecchio del Carteggio come P-12 e P-37 hanno fatto per
quiz e ciclo: in tests/test_interfaccia.py resta solo il regime del
raccordo, la pagina vera fa tante verifiche quante quella di
riferimento, gruppo per gruppo, e la pagina di prima di P-21 — provata
con RG_PAGINA — ora è rossa. Decidi che cosa resta di
tests/pagina-ciclo-carteggio.html. Togli la frase di oggi «dici quali
avevi preso» da GIUDIZIO_CARTEGGIO in tests/client_account.mjs. La
bozza c'è: la riga del carteggio fra i «Difetti noti» di AGENTS.md si
toglie, e R-BOZZA-06, il §7.6 e le righe del Carteggio nella specifica
dicono il presente.

Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md). Non toccare docs/prossime-sessioni.md né
site/. Suite verdi su più giri, voce in fondo a [Unreleased], un
commit. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `4e601a0`, voce nel CHANGELOG. Il Carteggio ha un regime
solo: tolti il ramo «attuale», `regime_carteggio()`, `riconosci_carteggio()` e
l'innesto di P-51; la pagina vera fa, gruppo per gruppo, le verifiche della
pagina di riferimento. La pagina di prima di P-21, con `RG_PAGINA`: prima 8
verifiche e zero rossi, ora 11 rossi nel Carteggio. La pagina di riferimento
resta per le 39 rotture. Tolta da `GIUDIZIO_CARTEGGIO` la frase di prima e da
`AGENTS.md` la riga fra i «Difetti noti»; la specifica dice il presente di
`main` — §3.2, §5.3, §7.3, §7.6, R-SEL-17, R-FLU-23/24/26, R-UX-03/07, §9.6,
§9.11, R-BOZZA-06 —, e che il sito pubblicato lo prende al traguardo. **Nessun
banco riconosce più un regime di pagina.** **Trovato:** la v0.28.0 pubblicata non
ha nemmeno l'avviso e la conferma del browser di P-36 — il testo del carteggio
si perde con una ricarica senza che la pagina lo dica —; la regia l'ha
verificato sul tag, e sta nel §4 come decisione dell'autore. E un errore della
sessione sulla porta, senza danni: un lancio con la 8620 occupata dalla suite di
P-52, che il banco ha rifiutato da solo; poi ogni giro ha aspettato 90 s di
quiete. Controllato dalla regia: motore 194/197, server 60/60, dati 242,
specifica 782, guardiano verde, interfaccia 2.121 in 242 s — meno di 2.138
perché con il regime vecchio sono uscite anche le sue verifiche.

### P-53 — Claude: le frasi del riepilogo dei quiz, nel banco del client

**Stato:** **chiuso il 1° ottobre 2026**, commit `616d048` su `main`; lanciato dalla regia (punto 8). **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** l'esito di
P-37.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-53, su main. Leggi l'esito di P-37 nel §6 di
docs/prossime-sessioni.md, R-UX-06 nel §9.8 della specifica, e il
§4 di docs/area-3-progetto.md sui testi del riepilogo.

R-UX-06 è scoperto: i numeri del riepilogo di una breve attività li
tiene R-FLU-01, le frasi no. Aggiungi al banco del client un gruppo che
legge nel testo che si vede del riepilogo dei quiz le tre affermazioni
— che cosa è successo, quali rivedere, che cosa non hai toccato — e
nessun voto sulla preparazione, sulla pagina vera e sulla pagina di
riferimento del client allineata, con le rotture: una quarta
affermazione, un voto, un numero che non viene dal raccordo, una frase
nascosta. R-UX-06 dice coperto quello che il banco vede.

Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md). Non toccare docs/prossime-sessioni.md né
site/. Suite verdi su più giri, voce in fondo a [Unreleased], un
commit. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `616d048`, voce nel CHANGELOG. Nuovo gruppo F-01 nel banco del
client (`test_riepilogo_frasi`): sulla pagina vera senza account, due attività
di fila, e in ciascun riepilogo l'`innerText` di `#r-fine` deve portare le tre
affermazioni del §4.2 dell'area 3 con i numeri di quello che il banco ha fatto,
nessuna quarta affermazione (elenco chiuso) e nessun voto (elenco di parole).
La pagina di riferimento del client ha ora il suo `riepilogoQuiz()`; nove
rotture nuove, rosse per il loro motivo, e il banco provato contro sé stesso
cinque volte. R-UX-06 coperto per quello che il banco vede; non vede l'ordine
delle frasi, un testo reso invisibile con `opacity`, il riepilogo di una
simulazione e quello con l'account (§10.4 dell'area 3). **Trovato:** otto coppie
di quesiti base con testo e risposte identici e l'esatta diversa — cambia solo
la figura —, che davano al banco un rosso falso una volta ogni ~200 quesiti:
ora l'esito si legge dal riscontro, e una variante pesca quei gemelli per primi.
**Per chi tocca i testi** del riepilogo su `ui/*` (P-52, P-25): una frase nuova è
rossa finché non entra in `FRASI_RIEPILOGO` / `USCITE_RIEPILOGO`, e quell'elenco
è di `main`. Controllato dalla regia: motore 194/197, server 60/60, dati 242,
specifica 784, guardiano verde, interfaccia 2.173 in 240 s.

### P-25 — ChatGPT: la realizzazione dell'area 6, la rifinitura

**Stato:** **chiuso il 1° ottobre 2026**, merge `511aa6d`. **Dove:** app di ChatGPT, progetto
`~/Software/rotta-giusta-ui`, ramo `ui/main`, modalità Local. **Nasce da:**
P-24 e P-45; il testo viene da una proposta che la regia ha verificato — le
righe T-* aperte sono cinque, non sei come diceva il segnaposto.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-25: la realizzazione di docs/area-6-progetto.md. Leggi il
progetto, il §9.11 e l'appendice A della specifica, il §10.3 del
progetto (il contratto dei controlli, consegnato da P-45) e gli esiti
di P-45, P-21 e P-52 nel §6 di docs/prossime-sessioni.md.

Le quattro proposte del §8 sono decise dall'autore il 1° ottobre 2026,
tutte e quattro «no, per ora»: nessun cambio di gerarchia nelle viste,
nessun ingresso rinominato o spostato prima di prove con persone, le
figure tengono l'alt di oggi con il limite dichiarato, il tema scuro è
un'opzione futura e non un requisito. Questa sessione è quindi
rifinitura, non ridisegno: nessuna selezione, conteggio, giudizio,
ritorno o persistenza cambia (§9, «Regressioni»).

Il §7 del progetto è più vecchio della pagina: la bozza del Carteggio
con l'account c'è da P-21. Verificala, non rifarla.

Chiudi i cinque difetti dichiarati in docs/eccezioni-interfaccia.md —
T-05:arresti, T-07:prova, T-07:conto, T-08, T-09 — e togli le loro
righe nello stesso commit: da lì i controlli girano sulla pagina vera e
la suite pretende che siano verdi. Prima di correggerne uno riproducilo
e guardalo; dopo, rimisura sui valori calcolati e guarda la schermata.
Se una superficie nuova o una frase nuova del riepilogo dei quiz serve
davvero, fermati e dillo: entra nel banco da main (VISTE_RIF,
FRASI_RIEPILOGO). Se un controllo ti sta stretto, fermati e dillo.

Zoom nativo al 200 % e lettore di schermo reale non li puoi fare dal
browser integrato: scrivi nel resoconto «non fatto», con il requisito
che li aspetta (R-RIF-10, 13, 14, 15). Non darli per fatti con il
reflow equivalente.

La suite dell'interfaccia vuole Chrome, la porta 8620 libera e il
permesso per le connessioni locali; guarda la porta prima di lanciarla.
Non toccare docs/prossime-sessioni.md. Tutte le suite verdi, collaudo
guardato a 320, 375 e 1280 px nei due stati d'accesso, voce in fondo a
[Unreleased], un commit con il trailer, versione non toccata. Chiudi
con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `85f3022` su `ui/main`, merge `511aa6d`, voce nel CHANGELOG e
`docs/area-6-collaudo-ux.md`. I cinque difetti — T-05, le due righe di T-07,
T-08, T-09 — riprodotti, guardati, corretti e rimisurati, e le loro righe tolte:
nessuna riga T-* resta fra i «Difetti aperti dichiarati». A 320, 375 e 1280 px
nei due regimi d'accesso nessuno sbordo, contrasto almeno 4,65:1 sui fondi
interessati, tag a 44 × 44 px; la bozza del Carteggio verificata dopo una
ricarica. **Non fatto**, come deciso: zoom e testo al 200 %, il controllo dei
contrasti non testuali, i percorsi interi da tastiera e un lettore di schermo
vero (R-RIF-10, 13, 14, 15) — prove dell'autore. Controllato dalla regia:
territori puliti, trailer, `git log main..ui/main` vuoto, CHANGELOG con la sua
riga vuota; sullo stato fuso motore 193/197, server 62/62, dati 242,
specifica 784, guardiano verde, interfaccia **2.158** — dieci verifiche in meno,
quelle delle cinque dichiarazioni uscite.

### P-54 — Claude: l'esclusione dalle statistiche, sul server

**Stato:** **chiuso il 1° ottobre 2026**, commit `a0f0c01` su `main`, in una sessione aperta dall'autore.
Non blocca il traguardo, perché oggi nessuna statistica si calcola (§15.2 di
`account-progetto.md`), ma va fatto **prima della prima query**: da quel giorno
la promessa dell'informativa diventerebbe falsa. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano. **Nasce da:** §15.4, punto 8,
scritto dalla sessione degli adempimenti.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-54, su main. Leggi il §15 di docs/account-progetto.md per
intero — il §15.2 sulle statistiche e il punto 8 del §15.4 —, il
paragrafo dei diritti in site/privacy.html, e gli esiti di P-09, P-10,
P-11 e P-15 nel §6 di docs/prossime-sessioni.md.

Chi si oppone al trattamento per le statistiche dev'essere escluso da
ogni conteggio. Sul server: un segno sull'account, con una migrazione
solo additiva come le altre (§2.7: il codice di prima deve girare sul
database di dopo); il modo in cui il titolare lo mette e lo toglie,
annotato nel registro; e un posto solo da cui passa ogni statistica,
che lo rispetta — non una regola che ogni query futura deve ricordare,
ma una funzione che le query usano e un controllo che fallisce se una
query aggregata sulle righe nasce fuori di lì. Prima il test che
fallisce: un account con il segno, le sue righe, e un conteggio che le
conterebbe. Un requisito nuovo nel §9.9 della specifica, con il suo
controllo. L'export e la cancellazione non cambiano; se il segno debba
viaggiare nell'export, decidilo e scrivi perché.

Il server in esercizio gira da v0.28.0 e main non si pusha: questo
codice arriva sulla macchina con il traguardo (P-27), che lo installa
con rg-aggiorna. Non toccare la macchina. Non toccare
docs/prossime-sessioni.md né site/. Suite verdi, con quella del server
anche con la LTS 24, voce in fondo a [Unreleased], un commit. Chiudi
con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `a0f0c01`, voce nel CHANGELOG, §15.2 e §15.4 di
`account-progetto.md`. Schema 4, solo additivo: `account.fuori_statistiche_dal`.
Il titolare mette e toglie il segno con `server/opposizione.mjs`, a servizio
acceso, con una riga nel registro e un motivo obbligatorio senza email.
`server/statistiche.mjs` è il posto solo: tre fonti già filtrate — iscritti,
risposte, punteggi —, e una query che nomina una tabella vera è rifiutata;
`server/statistica.mjs` la lancia in sola lettura. Un controllo è rosso se in
`server/` o `strumenti/macchina/` una riga aggrega o legge le righe di tutti
fuori di lì senza essere dichiarata (11 dichiarate, ciascuna con il motivo).
R-ACC-67…70. Prima 7 test rossi, poi 43 rotture, tutte rosse. Il segno **non**
viaggia nell'export né in `GET /v1/io` (§15.2, scelta 1). **Trovato:** una copia
di prima avrebbe rimesso nei conteggi chi si era opposto dopo — il segno va
anche nel file delle cancellazioni, e il ripristino lo rilegge —; il
`ripristina.mjs` di `v0.28.0` perde quel segno, quindi il server lo rilegge dal
file a ogni avvio; il server di `v0.28.0` gira sul database a schema 4; la copia
di sicurezza conta anche chi si è opposto, ed è dichiarata come
non-statistica. **Per l'autore**, nel §20: l'opposizione vale per l'account, e
chi si riscrive la chiede di nuovo — punto per il parere —; se la pagina debba
dire «sei fuori dalle statistiche»; e nella procedura del titolare, fuori dal
repo, il comando di `opposizione.mjs` e la regola «le statistiche si lanciano
con `statistica.mjs`, mai con `sqlite3`». **Non provato sulla macchina**: i due
comandi come utente `rg`, con i permessi di `/var/lib/rg` — al traguardo.
Controllato dalla regia: motore 193/197, server 68/68, `ripristina --prova` 22
controlli, dati 263, specifica 800, guardiano verde, interfaccia 2.158.

### P-55 — Claude: lo strumento che annota le letture del titolare

**Stato:** **chiuso il 2 ottobre 2026**, commit `18322ef` su `main`; lanciato
dalla regia (punto 8), con il sì dell'autore: lo strumento, non togliere le due
frasi dall'informativa. **Dove:**
Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano o lanciato dalla
regia (punto 8). **Nasce da:** il controllo del 2 ottobre (§4).

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-55, su main. Leggi il §15.1 e il §15.3 di
docs/account-progetto.md, in site/privacy.html le due frasi sulle
letture del titolare — «ogni lettura è annotata nel registro di
sicurezza», e l'elenco di quello che il server annota —, e l'esito di
P-54 nel §6 di docs/prossime-sessioni.md: server/opposizione.mjs è il
modello.

L'informativa promette che ogni lettura di un account da parte del
titolare è annotata. Lo strumento del §15.1 non è mai stato scritto:
oggi il titolare potrebbe leggere solo con sqlite3, senza traccia.
Scrivilo: uno strumento a riga di comando, a servizio acceso, che dato
un'email e un motivo obbligatorio mostra l'account e le sue attività
con le funzioni del motore, non cambia niente dell'account, e scrive
nel registro quando, quale account e perché — il motivo senza email,
come per l'opposizione. Un database o un account che non ci sono non
producono un database vuoto né un «fatto», e senza motivo non si legge.
Prima il test che fallisce: una lettura, e la sua riga nel registro.
Un requisito nuovo nel §9.9 della specifica con il suo controllo, e che
cosa il controllo non vede: una lettura fatta con sqlite3 resta fuori,
ed è della procedura del titolare. Il §15.1 passa da «Proposto» a
quello che c'è; quanto vive quella riga lo dice il §15.3, o scrivi
perché no. Se lo strumento legge le righe di un account fuori da
server/statistiche.mjs, il controllo di R-ACC-69 lo vede: dichiaralo
con il motivo, non aggirarlo.

Il server in esercizio gira da v0.28.0: questo codice arriva sulla
macchina con il traguardo. Non toccare la macchina,
docs/prossime-sessioni.md né site/. Prima di lanciare la suite
dell'interfaccia guarda che la porta 8620 sia libera: ChatGPT può
averla (P-56). Suite verdi, quella del server anche con la LTS 24, voce
in fondo a [Unreleased], un commit. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `18322ef`, voce nel CHANGELOG. `server/leggi.mjs`, dalla
macchina e a servizio acceso: con `--email` e un `--motivo` obbligatorio mostra
l'account — senza password, chiave locale né impronte — e le sue attività con
le funzioni del motore; `server/letture.mjs` scrive la riga «lettura del
titolare» nella stessa transazione della lettura, e per prima: se il registro
non si può scrivere non si legge. Non cambia niente dell'account, nemmeno
«ultimo accesso»; non crea e non migra un database; nessuna rotta, nessuna
migrazione. La riga vive un anno, senza IP, anche oltre la cancellazione
dell'account (§15.3). R-ACC-71…74 nel §9.9; il §15.1 di `account-progetto.md`
passa da «Proposto» a quello che c'è. Quattro test scritti prima, quaranta
rotture rosse. **Trovato:** il controllo di R-ACC-69 non vede la lettura di un
account, quindi R-ACC-74 ha un elenco suo di chi legge le righe
(`CHI_LEGGE_LE_RIGHE`); un ripristino perde le letture annotate dopo la copia,
come ogni evento del registro; `opposizione.mjs` su un file vuoto ne faceva un
database, corretto con il test prima rosso; una rottura passata verde alla
prima stesura, e il test corretto. **Per l'autore**, nel §20 di
`account-progetto.md`: gli account si leggono con `leggi.mjs`, mai con
`sqlite3`, da scrivere nella procedura del titolare; e se le letture debbano
sopravvivere a un ripristino — proposta: tenerla così. **Per la coda:**
`leggi.mjs` entra fra le prove sulla macchina del passo 5 di P-27.
Controllato dalla regia sullo stato di P-55: motore 193/197, server 72/72 anche
con la 24.21.0 LTS, dati 263, specifica 816, `ripristina --prova` 22 controlli,
guardiano verde; la coda non toccata; i luoghi del «Trovato» esistono.

### P-56 — ChatGPT: le condizioni per l'account e i 18 anni, nel modulo di registrazione

**Stato:** **chiuso il 2 ottobre 2026**, merge `1540158`. La forma — una frase
con il link, non una casella — è quella consigliata dalla regia, che l'autore
non ha cambiato. **Dove:** app di ChatGPT,
progetto `~/Software/rotta-giusta-ui`, ramo `ui/main`, modalità Local. **Nasce
da:** il controllo del 2 ottobre (§4).

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-56. Leggi in site/avvertenza.html la sezione «Le condizioni
per l'account» (id condizioni), in site/privacy.html il paragrafo «Con
un account: quali dati e perché», e in site/app.html
moduloRegistrazione() e invitoAccount().

L'informativa poggia il salvataggio sull'esecuzione del contratto, cioè
sulle condizioni per l'account, e dice che l'account è per chi ha
compiuto 18 anni. Il modulo di registrazione non nomina né le une né
gli altri: rimanda solo a /privacy, e chi si registra non le incontra.
Nel modulo, prima di «Crea l'account e salva», una frase che si vede:
creando l'account accetti le condizioni per l'account, con il link a
/avvertenza#condizioni — l'indirizzo pulito, senza .html —, e l'account
è per chi ha compiuto 18 anni. Una frase, nel tono di
docs/filosofia.md: niente casella da spuntare, niente finestra in più,
niente blocco del pulsante. Il resto del flusso — registrazione,
accesso, invito, riepiloghi, testi — resta com'era.

Il controllo di questa frase sulla pagina vera lo aggiunge Claude su
main dopo la merge (P-57): non toccare tests/. La suite
dell'interfaccia vuole Chrome, la porta 8620 libera
(lsof -iTCP:8620 -sTCP:LISTEN) e il permesso per le connessioni locali,
e dura circa quattro minuti; la cartella principale può tenere la porta
(P-55): se non gira, fermati e dillo, non saltarla. Se un controllo ti
sta stretto — un elenco chiuso di frasi, una misura di T-08 o T-09 sul
pannello —, fermati e dillo: cambiarlo tocca main.

Non toccare docs/prossime-sessioni.md. Tutte le suite verdi, collaudo
guardato a 320, 375 e 1280 px, voce in fondo a [Unreleased], un commit
con il trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `bfc3191` su `ui/main`, merge `1540158`, voce nel CHANGELOG.
Nel modulo «Crea un account», sopra il pulsante: «Creando l'account accetti le
condizioni per l'account; l'account è per chi ha compiuto 18 anni.», con il
link a `/avvertenza#condizioni`. Nessuna casella, nessun'altra modifica al
flusso. Collaudo della sessione a 320, 375 e 1280 px. Controllato dalla regia:
territori puliti, trailer, il diff tocca una riga di `site/app.html` e il
CHANGELOG, `git log main..ui/main` vuoto, la riga vuota mancante nel CHANGELOG
aggiunta; **sullo stato fuso con P-55** motore 193/197, server 72/72 anche con
la 24.21.0 LTS, dati 263, specifica 816, interfaccia 2.158. La regia **non** ha
ripetuto il collaudo nel browser. Il controllo permanente della frase è P-57.

### P-57 — Claude: il controllo delle condizioni nel modulo di registrazione

**Stato:** **chiuso il 2 ottobre 2026**, commit `dcced58` su `main`; lanciato
dalla regia (punto 8) su delega dell'autore, dopo la merge di P-56. Si è
interrotto una volta a metà, per il limite d'uso dell'account, ed è stato
ripreso con il suo contesto: le modifiche non committate erano rimaste
com'erano. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**. **Nasce da:** P-56 — è per lei quello che P-49 è stato per P-48.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-57, su main. Leggi gli esiti di P-56 e di P-49 nel §6 di
docs/prossime-sessioni.md, e il §12 di docs/account-client-progetto.md.

P-56 ha messo nel modulo di registrazione la frase sulle condizioni per
l'account e sui 18 anni. Aggiungi il suo controllo al banco del client:
sulla pagina vera, nel modulo «Crea un account» e in testo che si vede,
prima del pulsante che crea l'account, ci sono il link a
/avvertenza#condizioni e i 18 anni; e in site/avvertenza.html l'ancora
esiste. Con le rotture della pagina di riferimento — la frase che
manca, nascosta, il link all'indirizzo sbagliato o a un'ancora che non
c'è — rosse per il loro motivo, e la pagina di prima di P-56 rossa. Un
requisito nuovo nel §9.9 della specifica, coperto per quello che il
banco vede.

Prima di lanciare la suite dell'interfaccia guarda che la porta 8620
sia libera (AGENTS.md). Non toccare docs/prossime-sessioni.md né site/.
Suite verdi su più giri, voce in fondo a [Unreleased], un commit.
Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** commit `dcced58`, voce nel CHANGELOG. Gruppo nuovo C-20 nel banco
del client: dal riepilogo apre «Crea un account» e cerca nella finestra, in
quello che si vede e prima del pulsante, il link a `/avvertenza#condizioni` e i
18 anni; poi segue il link fino all'ancora. `test_client_condizioni`
(R-ACC-75), con l'ancora controllata anche nel file, e
`test_client_modulo_visto` (R-ACC-76). 21 rotture rosse per il loro motivo, il
banco provato contro sé stesso; la pagina di prima di P-56 è rossa in quattro
verifiche, tutte di C-20. **Trovato, e conta più del controllo: un difetto
della pagina vera, da P-18.** «Crea un account e salva», nel riepilogo di
un'attività, apre il modulo **sotto** il riepilogo: `.account-panel` ha
`z-index:30`, i runner 80, `#rivedi` 82, `.fine` 84. Riprodotto dalla sessione
a 375 e 1280 px: la schermata prima e dopo il clic è identica, il fuoco va su
un titolo che non si vede. Dall'intestazione il modulo si vede, ed è quello che
i collaudi di P-18 e P-56 hanno guardato; il banco preme con `element.click()`
e registrava dentro una finestra coperta. È la strada dell'ADR-004 — registrarsi
alla fine di un'attività. Dichiarato fra i «Difetti aperti dichiarati» di
`docs/eccezioni-interfaccia.md` (riga C-20), con la quinta verifica di C-20 che
la suite pretende rossa finché il difetto c'è: lo chiude P-58. Secondo
trovato: il link alle condizioni, e «Come trattiamo i dati», si aprono nella
stessa scheda, e tornando con «← torna alla palestra» la pagina si ricarica e
le risposte da salvare sono perse (§12 del progetto del client, «E una cosa da
decidere»). **Non fatto:** le altre due porte del modulo sulla pagina vera, che
la pagina di riferimento non ha. Controllato dalla regia: i valori di
`z-index` riletti nel sorgente; la coda non toccata; motore 193/197, server
72/72 anche con la 24.21.0 LTS, dati 263, specifica 824, interfaccia 2.248.

### P-58 — ChatGPT: il modulo dell'account sopra il riepilogo

**Stato:** **chiuso il 2 ottobre 2026**, merge `ce86d3f`. **Dove:** app di ChatGPT, progetto
`~/Software/rotta-giusta-ui`, ramo `ui/main`, modalità Local. **Nasce da:**
P-57. Il traguardo lo aspettava: la registrazione dal riepilogo è la strada
dell'ADR-004. L'ultimo capoverso sui link in una scheda nuova è la proposta
della regia: se l'autore decide altrimenti, lo dice prima di lanciarlo.

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main. Se sei un altro agente o sei in un'altra cartella,
fermati e dillo, senza scrivere niente.

Sessione P-58. Leggi l'esito di P-57 nel §6 di
docs/prossime-sessioni.md, la riga C-20 fra i «Difetti aperti
dichiarati» di docs/eccezioni-interfaccia.md, R-ACC-76 nel §9.9 della
specifica, e nel §12 di docs/account-client-progetto.md «Le condizioni
nel modulo».

Il difetto: nel riepilogo di un'attività, «Crea un account e salva»
apre il modulo sotto il riepilogo, e chi vuole salvare non vede
cambiare niente. È la strada dell'ADR-004, e c'è da P-18. P-57 indica
una causa — .account-panel a z-index 30 contro i runner a 80, #rivedi
a 82 e .fine a 84 —: riproducila nel browser e guardala prima di
fidarti. Poi ogni finestra dell'account si vede sopra qualunque runner,
revisione e riepilogo: la registrazione, l'accesso, la data d'esame e
le altre che si aprono da lì, dal riepilogo dei quiz, del carteggio e
dei Segnali. Il fuoco va dove si vede; Esc e «Torna al riepilogo»
riportano al riepilogo com'era, con le risposte ancora lì.

Nello stesso commit togli la riga C-20 da
docs/eccezioni-interfaccia.md: da lì la verifica gira verde sulla
pagina vera, e la suite lo pretende.

E i link dentro le finestre dell'account — le condizioni e «Come
trattiamo i dati» — si aprono in una scheda nuova: oggi si aprono nella
stessa, e chi torna dall'avvertenza con «torna alla palestra» ricarica
la pagina e perde le risposte che stava per salvare.

La suite dell'interfaccia vuole Chrome, la porta 8620 libera
(lsof -iTCP:8620 -sTCP:LISTEN) e il permesso per le connessioni locali,
e dura circa quattro minuti; se non gira, fermati e dillo. Non toccare
tests/ né docs/prossime-sessioni.md. Se un controllo ti sta stretto,
fermati e dillo: cambiarlo tocca main.

Tutte le suite verdi, collaudo guardato a 320, 375 e 1280 px aprendo il
modulo dal riepilogo di un quiz, di una prova di carteggio e di una
partita dei Segnali, senza account, voce in fondo a [Unreleased], un
commit con il trailer, versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `abb6b4f` su `ui/main`, merge `ce86d3f`, voce nel CHANGELOG.
`.account-panel` passa da `z-index` 30 a 110, sopra runner (80), revisione (82)
e riepilogo (84): la causa indicata da P-57, riprodotta dalla sessione prima di
correggerla. I link delle finestre dell'account — le condizioni, «Come
trattiamo i dati», e `rottagiusta.it/app` nel pannello «Account non
disponibile qui» — si aprono in una scheda nuova, con `rel="noopener"`. Tolta la
riga C-20 dai «Difetti aperti dichiarati»: nessun difetto dichiarato resta.
Collaudo della sessione a 320, 375 e 1280 px dai riepiloghi di quiz, carteggio
e Segnali. Controllato dalla regia: territori puliti, trailer, il diff tocca
`site/app.html` (cinque righe), le eccezioni e il CHANGELOG, `git log
main..ui/main` vuoto, CHANGELOG con la sua riga vuota e nessuna riga del ramo
persa; **sullo stato fuso** motore 193/197, server 72/72 anche con la 24.21.0
LTS, dati 263, specifica 824, interfaccia **2.245** — tre in meno, quelle della
dichiarazione uscita —, `ripristina --prova` 22 controlli. La regia **non** ha
ripetuto il collaudo nel browser. Nello stesso commit della coda la regia ha
aggiornato R-ACC-76 e il suo paragrafo nel §9.9 della specifica, e «E una cosa
da decidere» nel §12 del progetto del client: i link in una scheda nuova erano
la sua proposta, che l'autore non ha cambiato prima di lanciare.

### P-27 — la regia, con l'autore: il traguardo, la 0.29.0

**Stato:** **chiuso il 3 ottobre 2026, ai passi 1–5; il passo 6 è della regia,
e l'ha fatto per la parte che non chiede un sì** (esito in fondo a questa
sezione). Lo stato com'era alle 07:40, prima della sessione, resta qui sotto.

**Lo stato prima della sessione:** cominciato il 3 ottobre 2026, fermo a metà
del passo 1. I tre cancelli sono chiusi dal 2 ottobre. Che cosa c'è e che cosa
manca, misurato il 3 ottobre alle 07:40:

- **Il commit di rilascio c'è**: `9c7afe8`, «release: v0.29.0 — la versione
  con gli account», lanciato dall'autore con `TERRITORI_OK=1` il 3 ottobre alle
  07:29. Sette file: i tre numeri a 0.29.0, la testa `[0.29.0]` del CHANGELOG,
  la privacy senza «Bozza» e senza il commento «Gate dell'autore»,
  `filosofia.md` senza la nota, la specifica al presente. Suite sull'albero del
  rilascio, il 2 ottobre: motore 193/197, server 72/72 anche con la 24.21.0
  LTS, dati 263, specifica 824, interfaccia 2.245, `ripristina --prova` verde.
- **La data dentro quel commit era sbagliata di un giorno**, 2 ottobre invece
  di 3, perché la regia l'aveva preparato la sera prima. **Corretta dal commit
  `3198803`**, «release: v0.29.0 — la data del rilascio è il 3 ottobre»,
  lanciato dall'autore con `TERRITORI_OK=1` il 3 ottobre: `CHANGELOG.md`
  (`## [0.29.0] — 2026-10-03`), `site/privacy.html` («Aggiornata il 3 ottobre
  2026»), tre righe di `docs/specifica.md` e una di `docs/filosofia.md`. Fra
  i due c'è un commit della coda (`aec3443`). Le suite veloci sulla correzione
  erano verdi; quelle intere si rifanno prima del tag.
- **Il tag `v0.29.0` non esiste.** Va su `3198803`, il commit che porta la
  data giusta, dopo le suite rifatte su quel commit.
- **Niente è pushato**: `origin/main` è `51d9485`, la 0.28.0; `rottagiusta.it`
  serve `rg-0.28.1`, `api.` risponde 0.28.0 con schema 3.

L'autore ha chiesto il 3 ottobre di condurlo **in una sessione sua**, con il
prompt qui sotto, perché quella di regia aveva il contesto pieno. La lista
scritta il 2 ottobre resta sotto il prompt, ed è quella che la sessione segue.
**Dove:** Claude Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano, con
l'autore ai pannelli. **È la lista di controllo del §5**, in ordine; ogni passo
dice chi lo fa e come si vede che è fatto.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-27: il traguardo, la v0.29.0, insieme all'autore. Lui agisce
nei pannelli, sulla macchina e con TERRITORI_OK; tu prepari, spieghi un
passo alla volta, aspetti che dica «fatto», e verifichi misurando.
Leggi AGENTS.md, in docs/prossime-sessioni.md la sezione P-27 del §6
per intero — lo stato, i cancelli, i sei passi, come si torna
indietro — e il §4, e in docs/account-progetto.md il §2.7 e il §2.8.

Prima controlla lo stato vero, e dimmelo in poche righe: git status e
git log -3 nella cartella principale, se il tag v0.29.0 esiste, che
cosa c'è su origin (git ls-remote), che cosa servono oggi
rottagiusta.it/sw.js e api.rottagiusta.it/v1/salute. Il passo 1 è a
metà: il commit di rilascio c'è, e lo «Stato» di P-27 dice che cosa
manca — il tag, dopo le suite. Riparti da lì, senza rifare quello che è
fatto, e se lo stato che trovi non è quello scritto, dillo prima di
toccare qualcosa.

Poi i passi, uno alla volta, ognuno con la verifica che la lista gli
dà. Prima del tag rifai girare le cinque suite sul commit da taggare,
quella del server anche con la LTS 24, e guarda che la porta 8620 sia
libera. Il tag annotato lo fai tu. Il push di main e del tag solo con
il mio sì. rg-aggiorna sulla macchina lo lancio io, con il commit che
mi dai tu. Il ramo di build di statichost.eu lo rimetto io su main, e
premo io «Build now». Poi le verifiche che solo quel giorno può fare,
con me. Se una verifica non torna, fermati: come si torna indietro è
scritto nella lista. Non inserisci credenziali, non lanci TERRITORI_OK
e non entri nella macchina al posto mio.

Quello che misuri si scrive dove vive: una voce «Verificato — la
v0.29.0» in fondo a [Unreleased] del CHANGELOG, e il §2.8 e il §19 di
docs/account-progetto.md per la macchina. Non toccare
docs/prossime-sessioni.md: l'esito lo scrive la regia dal tuo
resoconto. Un commit per quello che scrivi, nessun altro push senza
chiedere. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**La lista**, scritta il 2 ottobre 2026.

**I cancelli — tutti chiusi prima del passo 1:**

- gli adempimenti del §15.4 di `account-progetto.md`, e la privacy che smette
  di dire «Bozza per la versione con gli account» — o l'autore che decide di
  pubblicarla così, per scritto nel §4. **Chiuso il 2 ottobre 2026 dalla
  decisione dell'autore** (§4, punto 4 delle cose aperte quel giorno): si
  pubblica senza parere firmato, senza PEC e senza aspettare la copia
  controfirmata del DPA di statichost.eu; «Bozza» esce nel passo 1;
- la coda vuota per Claude e per ChatGPT: nessun ramo con lavoro non fuso
  (`git log main..ui/main` vuoto, nessun worktree sporco). **Riaperto il 2
  ottobre 2026 dal controllo della regia** (§4, «Trovato dal controllo del 2
  ottobre»): due promesse dell'informativa non hanno ancora il loro pezzo — lo
  strumento che annota le letture del titolare, e le condizioni per l'account
  nel modulo di registrazione. Si chiude quando l'autore decide per ciascuna:
  farla prima, o cambiare la frase che la promette. Sono P-55, P-56 e P-57:
  tutti e tre chiusi il 2 ottobre. **E riaperto da P-57**, che ha trovato il
  modulo di registrazione sotto il riepilogo. **Chiuso di nuovo il 2 ottobre
  2026**: P-58 è fuso, la riga C-20 è uscita, nessun ramo ha lavoro non fuso;
- le suite verdi sullo stato di `main`, quella del server anche con la LTS 24.
  **Chiuso il 2 ottobre 2026 sullo stato fuso con P-58**: motore 193/197,
  server 72/72 anche con la 24.21.0 LTS, dati 263, specifica 824, interfaccia
  2.245. Si rifanno sul commit di rilascio, prima del tag.

**I passi, in quest'ordine:**

1. **Il commit di rilascio** (regia): `VERSION`, `CACHE` in `site/sw.js` e
   `versione` in `site/dati/meta.json` a **0.29.0**; `[Unreleased]` del
   CHANGELOG diventa `[0.29.0]` con una testa che dice che cosa cambia per chi
   studia; nello stesso commit si toglie la nota in testa a
   `docs/filosofia.md` (P-26), e in `site/privacy.html` la riga della data
   smette di dire «Bozza per la versione con gli account» e prende la data del
   rilascio (deciso dall'autore il 2 ottobre 2026). **Nello stesso commit, tre
   cose che il controllo del 2 ottobre ha trovato fuori dalla lista:** in
   `site/privacy.html` esce il commento HTML «Gate dell'autore prima del
   rilascio…» (riga 73), che altrimenti si pubblica; in `docs/specifica.md` le
   frasi che dicono che il sito pubblicato è la v0.28.0 senza account
   diventano il presente — il capoverso «La decisione è nel prodotto su
   `main`, non ancora in quello pubblicato» del §2, il §3.2 («le scrive ancora
   il sito pubblicato»), il §7.3, il §7.5, il §7.6 e l'apertura del §9.9
   («Gli account non esistono ancora nel sito pubblicato») —, cercate di nuovo
   quel giorno con `grep -n -i "sito pubblicato\|non ancora" docs/specifica.md`
   e non prese da questo elenco; e si rilegge che `README.md`, `AGENTS.md` e la
   skill non dicano «non ancora pubblicato» (il 2 ottobre non lo dicevano). Il commit tocca regole, motore e interfaccia
   insieme: come per la 0.28.1, lo lancia l'autore con `TERRITORI_OK=1`. Poi il
   tag annotato `v0.29.0`.
2. **Il push** (regia, con il sì dell'autore): `main` e `v0.29.0`. Da qui
   `.pages.dev` costruisce da sé la 0.29.0: lì la pagina non mostra moduli
   d'account e manda a `rottagiusta.it/app` (R-ACC-56, R-STA-09).
   `rottagiusta.it` resta alla 0.28.1 finché non si preme «Build now».
3. **Il server** (autore sulla macchina, regia che legge):
   `git rev-parse v0.29.0^{commit}` sul Mac, poi `sudo rg-aggiorna v0.29.0
   <commit>` sulla macchina. Gli strumenti di `strumenti/macchina/` non sono
   cambiati da P-15 (verificato il 2 ottobre: si riverifica con `git diff
   4d530e6..v0.29.0 -- strumenti/macchina/`), quindi non si ricopia niente.
   Si vede fatto quando `curl https://api.rottagiusta.it/v1/salute` dice
   `versione 0.29.0` e schema 4. Prima del passo 4, perché la pagina nuova
   chiede al server R-ACC-49 e la correzione di P-15, e il server nuovo regge la
   pagina vecchia, che non lo chiama.
4. **La pagina** (autore nel pannello di statichost.eu): «Source & build» →
   «Repository» → «Branch» da `fix/0.28.1` a **`main`**, «Save», poi
   «Builds» → «Build now». Si vede fatto quando `curl
   https://rottagiusta.it/sw.js` dice `rg-0.29.0` — non `rg-0.28.1`.
5. **Le verifiche che solo quel giorno può fare** (autore, regia che guida):
   un archivio vero nel browser, di prima degli account, che passa
   nell'account senza perdere una riga (R-ACC-05, R-ACC-62); il cookie fra
   `rottagiusta.it` e `api.` su un Safari vero (R-ACC-59, Q-PROVE); una
   registrazione vera con la mail che arriva (R-ACC-61); sulla macchina,
   `opposizione.mjs`, `statistica.mjs` e `leggi.mjs` lanciati come utente `rg`
   (P-54, P-55) — la lettura di prova con un motivo che lo dica, perché lascia
   la sua riga nel registro vero.
6. **La chiusura** (regia): esito qui, il registro, il ramo `fix/0.28.1` che
   si può togliere da GitHub, e `ui/main` e `ui/vetrina` allineati.

**Se qualcosa va storto:** la pagina torna indietro rimettendo «Branch» su
`fix/0.28.1` e premendo «Build now»; il server con `sudo rg-torna` (§2.7 di
`account-progetto.md`), e il database a schema 4 regge il server della 0.28.0
(misurato da P-54). Il push di `main` non si annulla, ma su `.pages.dev` non
apre niente che possa fallire.

**Dopo:** **trenta giorni dopo**, la soglia degli allarmi riletta sul registro
vero (§15.4); **dal 16 ottobre**, il redirect di `.pages.dev` (fase D2 di
`docs/migrazione-hosting.md`), dell'autore.

**Esito:** **la v0.29.0 è in linea, sulla pagina e sul server.** Tre commit su
`main`, tutti pushati: `3198803` (il rilascio, dell'autore), `34df1ed` (una
regola nuova in `AGENTS.md`) e `6392cf3` (le verifiche, nel CHANGELOG e in
`account-progetto.md` §2.8 e §19).

- **Passo 1:** tag annotato `v0.29.0` su `3198803`, dopo le cinque suite
  rifatte su `bee675d`, che rispetto al commit di rilascio cambia solo questo
  file: motore 193/197 con i quattro skip previsti, server 72/72, tutti e due
  anche con la 24.21.0 LTS (archivio confrontato con lo `SHASUMS256.txt` di
  nodejs.org), dati 263, specifica 824, interfaccia 2.245 in 4 min 05 s con la
  8620 libera, `ripristina --prova` 22.
- **Passo 2:** `main` e il tag pushati dalla sessione con il sì dell'autore;
  `.pages.dev` ha costruito da sé la 0.29.0.
- **Passo 3:** `rg-aggiorna v0.29.0 31988034…` l'ha lanciato **la sessione**,
  su richiesta esplicita dell'autore — il prompt lo dava a lui —, entrando
  come root con la chiave `rg-produzione` dal portachiavi. 1,9 s, schema 3 → 4,
  epoca invariata.
- **Passo 4:** l'autore ha rimesso «Branch» su `main` e premuto «Build now».
  La prima build portava l'etichetta del commit della coda (`bee675d`), senza
  il numero: da qui la regola nuova di `AGENTS.md`, «Build now» con il commit
  di rilascio in cima (`34df1ed`). Una seconda build alle 07:13 UTC porta
  l'etichetta della verifica.
- **Passo 5:** una registrazione vera con la mail in Posta in arrivo e il link
  intatto, arrivata in IPv6 (R-ACC-61); Safari 27.0.1 su macOS 27.0.1 che
  salva sul server, cookie e IndexedDB compresi (R-ACC-59); `statistica`,
  `leggi` e `opposizione` lanciati come utente `rg`, anche sull'account
  dell'autore con il suo sì. **Non fatto, per scelta dell'autore:** l'archivio
  vero di prima degli account (R-ACC-05, R-ACC-62) — pensa di togliere la
  funzionalità (§4, «Dopo il traguardo»). Non provati Safari su iPhone e in
  navigazione privata.

**Che cosa ha controllato la regia, il 3 ottobre:** il tag è annotato e punta
a `31988034…`; su `origin` ci sono `main` a `6392cf3` e il tag; i due commit
dopo il tag toccano solo `AGENTS.md`, `CHANGELOG.md` e `account-progetto.md`,
e questo file l'ha toccato solo la regia; `strumenti/macchina/` non è cambiato
da `4d530e6`. Da fuori: `rottagiusta.it/sw.js` e `.pages.dev/sw.js` dicono
`rg-0.29.0`; dodici file del sito — `sw.js`, `/app`, `index.html`,
`/privacy`, `/avvertenza`, `engine.js`, il manifest e i cinque JSON della
banca — sono identici byte per byte a `v0.29.0:site/`; `GET /v1/salute` dice
0.29.0, schema 4/4; il preflight CORS dal sito risponde 204 con
`Access-Control-Expose-Headers: Retry-After`. **Non ha controllato:** la
macchina dall'interno, il registro vero, la mail e Safari — sono del
resoconto —, e **non ha rifatto girare le suite** dopo `34df1ed` e `6392cf3`,
che non toccano codice (il resoconto dice dati, specifica, guardiano e
controllo della documentazione verdi dopo di loro).

**Il passo 6, la chiusura:** esito, registro e le parti di questo file che il
rilascio ha reso passato sono in `6217fda`. **Il resto, con il sì
dell'autore, lo stesso giorno:** `6217fda` pushato, `fix/0.28.1` tolto dal Mac
e da GitHub (il suo commit resta nel tag `v0.28.1`), `ui/main` e `ui/vetrina`
allineati a `main` con un avanzamento veloce, a cartelle pulite e senza
sessioni di ChatGPT aperte. **P-27 è chiuso per intero.**

---

### P-59 — Claude, con l'autore: che cosa viene dopo gli account, il brainstorming

**Stato:** **chiuso il 4 ottobre 2026**, commit `51acb13` su `main`, più
`84e6230` della regia. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano, con l'autore davanti.
**Nasce da:** la richiesta dell'autore, il 3 ottobre, di fare il brainstorming
in una sessione sua; la regia smista dopo.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-59: il brainstorming su che cosa viene dopo la versione con
gli account, insieme all'autore. È la casella BRAINSTORM del ciclo di
dev-standards: niente codice, niente prompt, niente ordine dei lavori.
Le idee le smista dopo la regia, in decisioni dell'autore, ricerche,
lavoro di Claude su main e lavoro di ChatGPT su ui/main.

Leggi AGENTS.md, docs/filosofia.md, e in docs/specifica.md il §1 (per
chi è), il §2 (che cosa è e che cosa non è), il §4.6 (che cosa il
motore non sa) e il §10 (le questioni aperte); poi
docs/decisioni-aperte.md, e le issue aperte su GitHub (gh issue list).
Poi ascolta l'autore: le sue idee una alla volta, con le domande che
servono finché ciascuna è chiara. Proponi anche tu, dichiarando che
cosa è tuo.

Un tema c'è già: le donazioni, con PayPal. In docs/prossime-sessioni.md,
§4, «Trovato dal controllo del 2 ottobre», c'è che cosa diceva la
ricerca del 25 settembre, fatta prima degli account: sono fatti da
riverificare, non da prendere per buoni. Riverificali sulle pagine
ufficiali — PayPal, e le alternative che trovi —, con la fonte e la
data accanto a ogni affermazione. La parte fiscale scrivila come
domande per un professionista, non come risposte.

Per ogni idea scrivi: il problema; per quale delle tre persone del §1;
che cosa cambia per chi studia; quale promessa tocca — filosofia,
informativa, un ADR, un Vincolo del §2.1 —; che cosa il motore e il
server sanno già e che cosa no; quanto è grande, a occhio; i rischi, il
guasto muto per primo; le decisioni che servono all'autore. Un'idea
scartata resta scritta, con il perché.

Scrivi in docs/idee-dopo-gli-account.md, file neutro, mentre si
discute e non alla fine: la chat non sopravvive alla sessione. Non
toccare site/, tests/, server/, docs/specifica.md né
docs/prossime-sessioni.md. Un commit del tuo file e di una voce in fondo
a [Unreleased] del CHANGELOG; niente push. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** commit `51acb13`, pushato, voce «Progettato — P-59» nel CHANGELOG.
`docs/idee-dopo-gli-account.md`: ventuno idee — diciotto dell'autore, tre di
Claude — più quattro di ChatGPT, ognuna nella forma chiesta; i tre concorrenti
guardati nel browser; due pareri di ChatGPT letti punto per punto; e in fondo
**«Le decisioni di P-59», 34 righe**, una formulazione per decisione, con che
cosa andrebbe riscritto. Per scelta dell'autore filosofia, ADR e Vincoli non
erano un limite. Le donazioni riverificate sulle pagine ufficiali, con 14
domande per un professionista; il «DD 199/2026» letto sul sito del MIT:
riguarda solo la patente D1. **Trovato:** la doppia ricarica dal vivo sulla
0.29.0, che la 0.30.0 ha tolto; e che Home (`/`) e sezioni (`/app`) sono due
documenti, quindi passare dall'uno all'altro perde le risposte di chi non ha
l'account — è il requisito 9 delle decisioni. **Rimasto fuori dal commit**, e
committato dalla regia con il sì dell'autore (`84e6230`): i giri dei bot del 4
ottobre e la decisione sul Mac mini. **Il resoconto nella forma fissa la regia
non l'ha avuto**: è rimasto nella chat di quella sessione, e l'esito è scritto
dal commit, dal CHANGELOG e dal file. **Che cosa ha controllato la regia:** i
due commit, `main` uguale a `origin/main` prima di `84e6230`, guardiano e
controllo della documentazione verdi; nessuna suite, perché sono file di
documentazione. **Non ha controllato:** le fonti citate, i giri dei bot, che
stanno in `~/bot-ux/` fuori dal repo, e le 14 schermate della sessione
parallela sul menu. **Lo smistamento** è la tabella della coda, righe 15–23, e
«Dopo P-59» nel §4.

### P-60 — Claude: semplificare — via l'offline e l'archivio di prima; le decisioni, la specifica, i controlli

**Stato:** **chiuso il 3 ottobre 2026** (esito in fondo a questa sezione). È
partito con il testo di prima — quello di `20113dc`, che toglieva solo
l'archivio di prima —, e l'autore gli ha portato il testo nuovo a metà
sessione, con un messaggio della regia: un lavoro solo, come voleva. **Dove:** Claude
Code, `~/Software/rotta-giusta`, ramo **`main`**, a mano: tocca `tests/`, la
specifica, le regole e `site/sw.js`. **Nasce da:** le decisioni dell'autore del
3 ottobre (§4, «Dopo il traguardo», punti 1 e 6). **Sblocca:** P-61; dopo P-61
il rilascio 0.30.0.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-60: semplificare il sito togliendo due cose — l'offline (il
service worker e la sua cache) e il passaggio dell'archivio di prima
degli account. Tu scrivi le decisioni, la specifica, le regole, i
controlli e il nuovo site/sw.js; la pagina la cambia ChatGPT dopo di
te, con P-61. Poi la regia rilascia la 0.30.0.

Le decisioni sono dell'autore, del 3 ottobre 2026, in
docs/prossime-sessioni.md, §4, «Dopo il traguardo», punti 1 e 6: il
criterio è la semplicità, e si considera che nessuno abbia usato il
sito prima degli account. Leggi AGENTS.md, l'ADR-004, docs/filosofia.md,
e nella specifica tutto quello che nomina l'offline, il guscio, la cache
e l'archivio di prima (§2, §3.2, §3.5, §3.6, §5, §7.1, §7.8, §8, §9 —
cercalo, non fidarti di questo elenco); in docs/account-client-progetto.md
il §7 e il §12. Prima di togliere un controllo, di' che cosa tiene fermo
oggi e chi se ne accorgerebbe senza.

1. Un ADR solo, ADR-005, con le due decisioni e il loro prezzo: senza
   rete il sito non si apre; chi avesse risposte nel browser di prima
   del 3 ottobre non le vede più. Marca nell'ADR-004 i punti che
   cambiano.
2. site/sw.js diventa un service worker che si toglie di mezzo: alla
   sua attivazione cancella le cache del sito e si disinstalla, e non
   forza la ricarica delle pagine aperte — senza account una ricarica
   perde le risposte della pagina aperta. La 0.29.0 in linea installa il
   service worker a chi la visita: questo file resta pubblicato finché
   la regia non scrive il prompt che lo toglie, e l'ADR dice per quanto.
   Provalo nel motore come i test di sw.js di oggi, e in Chrome: un
   browser con la 0.29.0 installata, servita in locale, poi la versione
   nuova — alla visita dopo nessun service worker e nessuna cache rg-.
3. La versione vive in due posti, VERSION e meta.json: R-ARCH-03 e la
   chiusura di un rilascio in AGENTS.md (il curl guarda meta.json, non
   sw.js). Riscrivi la specifica, filosofia, README, AGENTS.md e la
   skill del progetto per il sito senza offline e senza archivio di
   prima. La copia delle risposte nel dispositivo, per chi ha l'account,
   resta com'è: è la coda che tiene le risposte quando la rete cade e la
   bozza del carteggio; cambia solo il perché, e la specifica lo dice.
4. I controlli: escono quelli del guscio, della cache, delle figure per
   l'offline, dell'autodiagnosi, la parte offline di R-ACC-01, C-09 e le
   sue rotture. Entrano: la pagina non registra un service worker; non
   legge e non tocca open-patente-nautica né pn.archivio; il sw.js fa
   quello che il punto 2 dice. Quelli rossi sulla pagina vera di oggi
   dichiarali fra i «Difetti aperti dichiarati» di
   docs/eccezioni-interfaccia.md: main resta verde, e P-61 toglie le
   righe nello stesso commit in cui toglie il codice. Provali al
   contrario. strumenti/serve.py segue l'host, e R-ARCH-12 con lui.
5. Scrivi per P-61 che cosa della pagina deve cambiare, nel posto della
   specifica o del progetto del client dove lo leggerà — compreso
   site/_headers, che con la cache del browser al posto del service
   worker decide se una pagina o la banca arrivano fresche: misura che
   cosa serve oggi statichost.eu, non dedurlo.

Le cinque suite verdi, quella dell'interfaccia con la 8620 guardata
libera prima. Un commit, con la voce in fondo a [Unreleased]; niente
push e niente rilascio. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** `c8a336b`, sulla cartella principale. Un ADR solo per le due
decisioni, `docs/adr/ADR-005-semplificare-senza-offline-e-senza-archivio-di-prima.md`,
con il prezzo per intero e i punti dell'ADR-004 che cambiano. `site/sw.js` è il
service worker che cancella le cache e si disinstalla senza ricaricare le pagine
aperte, resta pubblicato almeno fino al 3 ottobre 2028 ed è passato al
territorio del motore (`territori.yaml`). La versione sta in due posti, e il
`curl` della chiusura di un rilascio guarda `meta.json`. Specifica, filosofia,
README, `AGENTS.md`, la skill e il progetto del client riscritti; il contratto
della pagina per P-61 è il §3.5 della specifica, «Per P-61». Escono i controlli
del guscio, della cache, delle figure fra un rilascio e l'altro,
dell'autodiagnosi, la parte offline di C-01 e C-09; entrano C-21 (R-ACC-05), C-22
(R-ARCH-15) e tre test del motore su `sw.js` (R-ARCH-16…18), ognuno provato al
contrario. C-21 e C-22 sono rossi sulla pagina vera e dichiarati in
`docs/eccezioni-interfaccia.md`. Trovato: C-22 guardava solo lo stato e la
pagina vera passava due giri su tre, ora legge anche le chiamate; la pagina vera
apre da sé una cache vuota `rg-0.29.0`; statichost.eu serve tutto con
`max-age=0, must-revalidate` e risponde 304, quindi senza service worker non
serve una regola nuova in `_headers`. Tre punti per l'autore nel §4, «Dopo il
traguardo», punto 7.

**Che cosa ha controllato la regia, il 3 ottobre:** il commit c'è, con il
trailer, e non tocca questo file; le due cartelle sono pulite. Le suite sullo
stato di `main`: motore 192/196 con quattro skip, server 72/72, dati 223,
specifica 820, controllo della documentazione verde, interfaccia 2.246 sulla pagina vera
con la 8620 libera prima. **Non ha controllato:** la LTS 24, `ripristina
--prova` e le prove al contrario, che dice il resoconto; e non ha guardato la
pagina in un browser — lì P-61 non è ancora passato.

### P-61 — ChatGPT: semplificare — via l'offline e l'archivio di prima, la pagina

**Stato:** **chiuso il 3 ottobre 2026** (esito in fondo). Era pronto dallo
stesso giorno: P-60 chiuso, e la regia aveva riletto questo prompt sul suo
esito. Il contratto è il §3.5 della specifica,
«Per P-61»; la frase nuova della conservazione con l'account è nel §11.2 del
progetto del client, e F-01 accetta la vecchia e la nuova finché P-61 non
arriva. `site/sw.js` è ora del motore: il `pre-commit` di `ui/*` lo rifiuta.
**Dove:** l'app ChatGPT (Codex), progetto `~/Software/rotta-giusta-ui` in
modalità Local, ramo **`ui/main`**, allineato a `main` dalla regia.

```
Questo prompt è per ChatGPT (Codex), nella cartella
~/Software/rotta-giusta-ui, sul ramo ui/main, in modalità Local. Se sei
un altro agente o sei in un'altra cartella, fermati e dillo, senza
scrivere niente.

Sessione P-61: togliere dalla pagina l'offline e il passaggio
dell'archivio di prima degli account. Leggi AGENTS.md, l'ADR-005 in
docs/adr/, e quello che P-60 ha scritto nella specifica e in
docs/account-client-progetto.md: è il contratto.

In site/: la pagina non registra più il service worker, e escono il
guscio (GUSCIO), il pulsante delle figure per l'offline, l'autodiagnosi
offline di Info, e quello che legge, mostra, porta, scarica o cancella
le risposte di open-patente-nautica e pn.archivio. I testi che
promettono l'offline o parlano dell'archivio di prima — la vetrina, la
privacy, Info, la palestra — dicono il sito di adesso. site/_headers e
manifest.json come P-60 ha scritto. site/sw.js non lo tocchi: è quello
di P-60. Niente altro cambia: l'account, la copia nel dispositivo, la
coda, i trasferimenti di un file e delle risposte della pagina aperta
restano come sono. Togli nello stesso commit le righe dei «Difetti
aperti dichiarati» di docs/eccezioni-interfaccia.md che P-60 ha messo.

Collaudo in Chrome a 375 e 1280 px, senza account e con l'account: un
browser che aveva la 0.29.0 installata prende la versione nuova senza
service worker e senza cache rg-; nessuna schermata nomina l'offline.
Le cinque suite verdi; quella dell'interfaccia vuole la 8620 libera. Un
commit con il trailer, la voce in fondo a [Unreleased], il numero di
versione non si tocca. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** `608f627` su `ui/main`, fuso in `main` con `6ad7342` il 3 ottobre
2026. La pagina non registra più il service worker; escono il guscio, il
pulsante delle figure, l'autodiagnosi offline e il passaggio dell'archivio di
prima; vetrina, privacy e `_headers` dicono il sito senza offline. C-21 e C-22
girano interi sulla pagina vera, e le loro righe sono uscite da
`docs/eccezioni-interfaccia.md`. Collaudo di ChatGPT in Chrome a 375 e 1280 px,
con e senza account: quattro passaggi da una 0.29.0 installata, conclusi senza
service worker, senza cache e senza ricaricare la scheda aperta. Con la deroga
della regia ha corretto la riga 4067 di questo file, identica a `6106e42`.

**Che cosa ha controllato la regia:** il commit con il trailer; il controllo
dei territori sull'intervallo, uscita 0; il diff, solo pagina, testi,
`_headers`, CHANGELOG, eccezioni e quella riga; la merge senza conflitti e
`main..ui/main` vuoto; la riga vuota fra le voci del CHANGELOG, già a posto. Le
suite sullo stato fuso: motore 192/196, server 72/72, dati 223, specifica 820,
documentazione verde, interfaccia 2.263 con la 8620 libera prima. **Non ha controllato:** il
collaudo nel browser, che è del resoconto.

### P-62 — Claude, con l'autore: la casella `privacy@` sull'iPhone, e la prova `dkim=pass`

**Stato:** pronto, dal 3 ottobre 2026. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano, con l'autore e il suo
iPhone. Scrive soltanto `docs/account-progetto.md`. **Nasce da:** §4, «Aperto il
2 ottobre 2026», punto 5, e «Dopo il traguardo», la decisione sul Registro
privacy; l'autore ha chiesto una sessione a parte il 3 ottobre.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-62: la casella privacy@rottagiusta.it nell'app Mail
dell'iPhone dell'autore, con le notifiche, e la prova che una mail
spedita da lì è firmata (dkim=pass). È la casella dove arrivano le
richieste degli interessati e gli allarmi del server, cioè le cose con
una scadenza: oggi non la legge nessuna automazione, e non deve restare
una casella che si apre solo dalla webmail.

Leggi in docs/account-progetto.md il §15.4, punti 2 e 10 (la casella
OVHcloud Zimbra Starter, i record DNS, il DKIM), e in
docs/prossime-sessioni.md il §4, «Aperto il 2 ottobre 2026», punto 5.

Dove si è fermato il primo tentativo, il 3 ottobre: l'autore ha
aggiunto l'account sull'iPhone con il server che gli aveva dato la
regia, zimbra1.mail.ovh.net, che è la webmail e non un server di posta.
L'iPhone ha detto «impossibile connettersi utilizzando SSL», poi ha
salvato l'account con «nessun messaggio», e l'invio è fallito con
«connessione al server non riuscita». La guida OVHcloud per Zimbra
(docs.ovhcloud.com, «Zimbra - Configurare il proprio account e-mail su
un client di posta») indica per IMAP imap.mail.ovh.net o ssl0.ovh.net
sulla 993, e per SMTP smtp.mail.ovh.net o ssl0.ovh.net sulla 465, con
SSL/TLS e l'indirizzo intero come utente: verificalo tu su quella
guida, non prenderlo da qui.

Guida l'autore un passo alla volta. La password la scrive solo lui, e tu
non la chiedi; l'SSL non si spegne mai; il pannello OVHcloud e i DNS non
si toccano senza il suo sì. Poi la prova nei due versi: dall'iPhone,
dall'account privacy@, una mail all'indirizzo Gmail dell'autore, che
leggi con il connettore Gmail in sola lettura e di cui guardi le
intestazioni di autenticazione — DKIM, SPF e DMARC per rottagiusta.it —;
e una risposta da Gmail, che deve arrivare sull'iPhone con la notifica.
Se il connettore non mostra le intestazioni, l'autore apre «Mostra
originale» e te le legge.

Scrivi l'esito nel §15.4 di docs/account-progetto.md, ai punti 2 e 10:
che cosa è configurato, con quali server e porte, e che cosa hai visto
nelle intestazioni, con la data. Un commit di quel file soltanto, con
il percorso nel comando (git commit -- docs/account-progetto.md): nella
cartella possono lavorare altre sessioni. Niente push. Chiudi con il
resoconto di docs/prossime-sessioni.md.
```

**Esito:** —

### P-63 — Claude: le decisioni di P-59, formali, e via «vetrina» e «palestra» dai documenti

**Stato:** pronto, dal 4 ottobre 2026. **Dove:** Claude Code,
`~/Software/rotta-giusta`, ramo **`main`**, a mano o lanciato dalla regia
(punto 8): tocca `docs/adr/`, la filosofia, la specifica, `AGENTS.md` e la
skill. **Nasce da:** «Le decisioni di P-59». **Sblocca:** le righe 20, 22 e 23
della coda.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-63: rendere formali le decisioni del brainstorming P-59.
Niente codice e niente site/: decisioni scritte dove si decidono.

Leggi AGENTS.md; in docs/idee-dopo-gli-account.md la sezione finale,
«Le decisioni di P-59», e le schede a cui rimanda quando una riga non
ti basta; docs/adr/ADR-004 e ADR-005; docs/filosofia.md; nella
specifica §0, §1, §2, §4.6, §6 e §10; in docs/prossime-sessioni.md il
§4, «Dopo P-59». Le 34 decisioni sono dell'autore, del 3 e 4 ottobre
2026, e per sua scelta filosofia, ADR e Vincoli non erano un limite:
qui si scrive che cosa cambia, non si rimette in discussione. Se una
decisione ne contraddice un'altra, o non si può scrivere senza
scegliere qualcosa che l'autore non ha scelto, fermati su quel punto e
dillo nel resoconto.

1. Un ADR nuovo, ADR-006, per ciò che cambia una promessa: l'invito a
   registrarsi fuori dal riepilogo — nella Home e nel risultato di una
   simulazione (decisione 12), che sostituisce la condizione 2
   dell'ADR-004 —; le spiegazioni, cioè il sito che comincia a
   spiegare (11, 28); la costanza detta (19); la stima calcolata e
   registrata senza mostrarla, con la difficoltà dei quesiti dalle
   risposte di tutti (23–27). Con il prezzo di ciascuna, come l'ADR-005.
   Marca nell'ADR-004 i punti che cambiano.
2. docs/filosofia.md: la frase approvata in I-10 al posto di «il sito
   non insegna»; «niente gamification» riscritta per la decisione 19;
   l'imbuto, che ora ha un invito anche in Home. La frase sulla stima
   («"supera l'esame con noi" non lo diciamo») l'autore non l'ha ancora
   scelta: lasciala com'è, e scrivi accanto che cosa la aspetta, come
   ha fatto P-60 con la sua. Una voce nel registro.
3. docs/specifica.md, §10: Q-NAV chiusa con la struttura delle
   decisioni 1–9; Q-DUE punto 3 riaperta dai cinque stati (14), con le
   parole della barra ancora da decidere; le altre decisioni fra le
   chiuse, ognuna in poche righe con la data e il rimando alla scheda.
   Il §1 con la frase nuova. Nel §2.5 la frase sui difetti dichiarati
   che «nessun concorrente può copiare» è eccessiva: correggila. Il §5,
   il §6, il §7 e i requisiti del §9 NON si riscrivono: descrivono la
   pagina che c'è, i loro controlli la tengono verde, e cambiano con il
   progetto del ridisegno. Dove una decisione li cambierà, dillo nel
   §10 accanto alla decisione, non nel requisito.
4. I nomi «vetrina» e «palestra» escono (decisione 7) da AGENTS.md,
   dalla specifica, dal README e dalla skill del progetto: la pagina
   iniziale è «la Home», `/app` è «l'app», e le sue parti hanno i nomi
   delle sezioni. Il CHANGELOG non si riscrive, e la skill tiene i nomi
   vecchi fra i suoi inneschi. Nella pagina li toglie l'interfaccia:
   non toccare site/. In tests/ soltanto dove un nome sta in un
   messaggio o in un commento e nessun controllo cambia; se un
   controllo cerca quella parola nella pagina, lascialo e dillo.

Le cinque suite verdi — test_specifica.py conta i requisiti —, quella
dell'interfaccia con la 8620 guardata libera prima. Non toccare
docs/prossime-sessioni.md. Un commit, con la voce in fondo a
[Unreleased]; niente push. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### P-64 — Claude: «com'è andata» dopo l'esame, e le previsioni registrate — il progetto

**Stato:** pronto, dal 4 ottobre 2026; parte quando P-63 ha lasciato la
cartella principale. **Dove:** Claude Code, `~/Software/rotta-giusta`, ramo
**`main`**, a mano o lanciato dalla regia (punto 8). Scrive soltanto file
neutri. **Nasce da:** le decisioni 25 e 27 di P-59: i dati per validare la
stima arrivano mesi dopo le risposte, quindi la raccolta si progetta adesso.
**Sblocca:** i prompt del server e della pagina, e la riga 23.

```
Questo prompt è per Claude Code, nella cartella principale
~/Software/rotta-giusta, sul ramo main. Se sei un altro agente o sei in
un'altra cartella, fermati e dillo, senza scrivere niente.

Sessione P-64: il progetto di due raccolte di dati che servono a
validare la stima d'esame, e che vanno avviate molto prima della stima.
Solo un documento: niente codice, niente site/, niente server/.

Leggi AGENTS.md; in docs/idee-dopo-gli-account.md la scheda I-12, il
secondo parere di ChatGPT alla riga I-12, e le decisioni 23–27; in
docs/account-progetto.md §3, §7, §13, §14, §15 e §20;
site/privacy.html; server/statistiche.mjs; l'ADR-006 se P-63 è chiuso.

Scrivi docs/esito-esame-progetto.md, sul modello dei progetti delle
aree, con due parti.
1. «Com'è andata»: dopo la data d'esame chi ha l'account può dire
   l'esito, separato per quiz base, vela, carteggio e pratica.
   Facoltativo. Che cosa si chiede e con quali parole; quando, e che
   cosa succede a chi non ha messo una data o la sposta; dove sta il
   dato — il profilo, una riga, un'altra tabella —, con lo schema solo
   additivo; come si corregge e come si cancella; che cosa ne vede chi
   studia; come entra nelle statistiche, da server/statistiche.mjs e
   senza chi si è opposto.
2. Le previsioni registrate: prima di ogni simulazione completa il
   modello, quando esisterà, salva la sua previsione con la versione e
   la data, senza mostrarla. Che cosa si salva, dove, chi lo calcola —
   la pagina con il motore, o il server —, e che cosa si può già
   registrare oggi, senza modello, perché serva dopo: almeno la regola
   semplice che il modello dovrà battere.
Per tutte e due: che cosa cambia nell'informativa, con una proposta di
testo e la base giuridica come domanda per l'autore, non come risposta;
il guasto muto di ciascuna; e in un §10.1 le dipendenze — che cosa fa
Claude su main (motore, server, controlli, specifica) e che cosa fa
ChatGPT su ui/main —, abbastanza precise da diventare prompt. Le
decisioni che servono all'autore, in un elenco in fondo.

Guardiano e controllo della documentazione verdi. Non toccare
docs/prossime-sessioni.md. Un commit del documento e della voce in
fondo a [Unreleased], con i percorsi nel comando; niente push. Chiudi
con il resoconto di docs/prossime-sessioni.md.
```

**Esito:** —

### P-65 — ChatGPT: i mock della nuova interfaccia, passo 1 — la mappa dei tragitti

**Stato:** pronto, dal 4 ottobre 2026; `ui/main` è allineato a `main`.
**Dove:** l'app ChatGPT (Codex), progetto `~/Software/rotta-giusta-ui` in
modalità Local, ramo **`ui/main`**. Scrive soltanto in `docs/prototipi/`, che è
neutro. **Nasce da:** le decisioni 1–9 di P-59. **Sblocca:** P-66.

```
Questo prompt è per ChatGPT (Codex), nella cartella
~/Software/rotta-giusta-ui, sul ramo ui/main, in modalità Local. Se sei
un altro agente o sei in un'altra cartella, fermati e dillo, senza
scrivere niente.

Sessione P-65: il primo di cinque passi di mock della nuova
interfaccia. Questo passo non disegna schermate: disegna i tragitti.
Niente site/, niente tests/: soltanto la cartella
docs/prototipi/interfaccia-2026-10/.

Leggi AGENTS.md; in docs/idee-dopo-gli-account.md «Le decisioni di
P-59» — soprattutto 1–13 —, le schede I-13, I-14 e I-18, la riga I-01
del secondo parere, e in I-09 «I primi due profili» con i giri dei bot
del 4 ottobre; nella specifica §1, §5 e §6.3; l'ADR-004 e l'ADR-005. La
struttura è decisa dall'autore: Home · Allenati · Esame · Progressi,
più l'avatar. Non si rimette in discussione; se un tragitto non regge
con quella struttura, dillo nel resoconto con il tragitto che lo
dimostra.

Scrivi docs/prototipi/interfaccia-2026-10/tragitti.md:
- l'albero delle voci, con ogni schermata e la porta — o le porte — da
  cui ci si arriva: nessuna schermata di oggi perde il suo ingresso
  (specifica §5.2 e §5.3, sono l'elenco da cui partire);
- i tragitti, uno per riga, per le tre persone del §1 e nei tre stati
  della Home (prima visita, risposte senza account, con l'account):
  simulare il quiz base, un quiz su un argomento, gli esercizi e la
  prova di carteggio, i Segnali, registrarsi dal risultato di una
  simulazione e dalla Home, aprire privacy e condizioni, tornare
  indietro da un'attività, trovare i progressi. Per ognuno i tocchi,
  le parole che si leggono a ogni tocco, e dove si torna chiudendo;
- la continuità senza account (decisione 9): per ogni passaggio di
  ogni tragitto, se le risposte della pagina aperta sopravvivono e
  perché. Oggi `/` e `/app` sono due documenti, e passare dall'uno
  all'altro le perde: di' come si tiene un documento solo con indirizzi
  veri, che cosa succede con il tasto indietro e con una ricarica, e
  che cosa resta impossibile e va detto a chi studia;
- i nomi ancora aperti, con le alternative e il perché: i bot del 4
  ottobre dicono che «Allenati con 10 domande» in Home ruba
  l'intenzione alla voce «Allenati», e che chi cerca «i quiz» deve
  trovarli. È un segnale debole: proponi, decide l'autore.
La costanza è «giorni di attività negli ultimi 14», senza serie che si
spezza e senza traguardi (decisione 19): una nota di un'altra sessione
dice il contrario, e non vale. Il pulsante è «Simula il quiz base», non
«Simula l'esame».

Guardiano verde (python3 strumenti/controlla.py). Non toccare
docs/prossime-sessioni.md. Un commit con il trailer e la voce in fondo
a [Unreleased], versione non toccata. Chiudi con il resoconto di
docs/prossime-sessioni.md.
```

**Esito:** —

### I segnaposto — i prompt che non si possono ancora scrivere

**Dopo P-59, dal 4 ottobre 2026.** I mock sono cinque passi, tutti in
`docs/prototipi/interfaccia-2026-10/`, per ChatGPT su `ui/main`; ognuno aspetta
il resoconto del precedente, e la regia scrive il suo prompt allora.

- **P-66 — la Home nei tre stati**: prima visita, risposte senza account, il
  cruscotto con l'account. Pagine HTML statiche, a 375 e 1280 px, con dati
  finti dichiarati. Aspetta P-65. Dovrà dire: una schermata, un'azione
  principale; «Simula il quiz base» sopra la piega; l'invito a registrarsi
  dell'ADR-006; i difetti dichiarati che restano in Home.
- **P-67 — Allenati ed Esame**: i tre segmenti, il ritorno che ripristina
  segmento e posizione; le prove in ordine con le condizioni del decreto, e il
  carteggio che è un ambiente solo con due ingressi. Aspetta P-66.
- **P-68 — Progressi**: il «sei qui», la mappa con i cinque stati, e senza
  account il riepilogo vero della pagina aperta. Aspetta P-67 e, per le parole
  della barra, Q-DUE punto 3 riaperta da P-63.
- **P-69 — il giro di un'attività**: preparazione, attività, risultato con la
  spiegazione e con l'invito, revisione. Aspetta P-68.
- **P-70 — la prova**, con l'autore: tre-cinque persone vere sui mock, con i
  compiti dei due profili di I-09 e uno per chi cerca «i quiz»; e i bot sulle
  varianti, come segnale debole accanto. Aspetta P-69. Dal suo esito: i nomi
  definitivi (§4), e il prompt del progetto del ridisegno (riga 21).

Le righe 20–23 della coda aspettano P-63: i loro prompt puntano all'ADR-006 e
al §10 della specifica, che non esistono ancora.

**Quello che segue è di prima del traguardo.** Qui sotto c'era **tutto quello
che restava** fino alla versione con gli account e
alla fine del ridisegno, perché niente si perda. Ogni segnaposto ha già il suo
numero, che cosa aspetta, e che cosa il prompt dovrà contenere; il testo del
prompt no, perché punterebbe a documenti che non esistono ancora. La regia lo
scrive quando si chiude quello che aspetta, e lo scrive **qui, al posto del
segnaposto**.

#### P-42 — assorbito in P-47

Il secondo tempo di `consigli()` si fa nella stessa sessione di P-47, che
aspettava la stessa merge: il prompt è lì. **Chiuso con P-47**, `d579bb6`.

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
- **26 settembre 2026 — v0.28.0 pubblicata.** Push, «Build now», verificata sui
  due indirizzi e nel browser. P-15 pronto: il tag contiene il server.
- **26 settembre 2026 — P-14 chiuso.** Un difetto del motore trovato dal
  progetto e riprodotto dalla regia: P-30, per primo. P-31 porta i controlli
  del ciclo, P-19 diventa un prompt completo, P-28 riallinea anche il §4.1 del
  client, P-16 aspetta P-30 perché tocca le stesse funzioni. ChatGPT resta
  senza lavoro pronto finché Claude non libera la strettoia.
- **26 settembre 2026 — P-20.** Su richiesta dell'autore, il progetto dell'area 4
  anticipato perché ChatGPT non resti fermo mentre Claude libera la strettoia.
  Porta dentro i due stati del Carteggio con gli account; la realizzazione,
  P-21, resta dopo P-18 e P-19.
- **26 settembre 2026 — P-30 chiuso.** Il difetto di `erroriSessione()` è
  corretto; quello che ne resta nella pagina pubblicata va a P-19, da
  riprodurre nel browser. Ordine per Claude: P-28, P-31, poi P-29 mentre
  ChatGPT realizza l'area 3.
- **26 settembre 2026 — allineare solo a sessione chiusa.** Regola aggiunta al
  punto 5 di «Come si usa», dopo un allineamento fatto senza sapere se P-20 era
  già partito.
- **26 settembre 2026 — P-20 e P-28 lanciati.** P-20 era già aperto quando la
  regia ha allineato `ui/main`: è il caso che la regola del punto 5 ora
  impedisce, scritto nel suo stato perché si controlli sul resoconto.
- **26 settembre 2026 — P-20 e P-28 chiusi.** P-20 trova un difetto già
  pubblicato — il testo del carteggio non è salvato «a ogni tasto» — e quattro
  dipendenze che diventano P-32…P-35; nel §4 la domanda su che cosa dire nel
  frattempo. P-28 chiude i contratti del client. Ordine per Claude: P-31, P-29,
  P-32…P-35.
- **26 settembre 2026 — l'avviso nel carteggio.** L'autore sceglie di dirlo
  nella pagina: P-36 per ChatGPT, subito. La frase del §7.6 la corregge la
  regia quando P-31, che lavora sulla specifica, ha chiuso. P-31 lanciato.
- **26 settembre 2026 — P-31 chiuso, e il §7.6 corretto.** La regia corregge la
  frase della specifica e mette il difetto fra quelli noti di `AGENTS.md`. P-36
  prende anche la conferma del browser, per scelta dell'autore, e va prima di
  P-19. Nasce P-37, che chiude il regime vecchio del ciclo dopo P-19.
- **26 settembre 2026 — P-19 chiuso, P-34 fuori ordine.** P-19 fatto da Claude
  nel worktree `ui` e fuso; il difetto delle sessioni doppie è sparito, guardato
  nel browser. P-34 è partito prima del suo turno e, a quanto pare, in ChatGPT
  nella cartella principale: in pausa, e la regia aspetta l'autore. **Da qui ogni
  prompt dice nel titolo chi lo esegue, e la regia lo ripete nella chat quando
  lo propone.**
- **26 settembre 2026 — P-34 fermato, e la riga «per chi è».** Era ChatGPT
  nella cartella principale; l'autore l'ha fermato. Il suo lavoro spostato in
  `~/Software/rotta-giusta-quarantena/p34-2026-09-26/`, e indicato a P-29 e al
  P-34 di Claude. Ogni prompt aperto comincia ora con la riga che dice per quale
  agente è e dove, e il punto 7 di «Come si usa» lo spiega. P-36 lanciato.
- **29 settembre 2026 — P-29 e P-36 chiusi, e un banco instabile.** P-36 fuso.
  P-29 ha dato al progetto un browser vero senza dipendenze; la regia l'ha
  fatto girare quattro volte e due sono state rosse per motivi diversi: nasce
  P-38, prima di tutto, e P-39 per i controlli che mancano; P-18 li aspetta. P-40
  segnaposto per chiudere il regime vecchio del client. Nel §4, Q-DUE sblocca
  ChatGPT.
- **29 settembre 2026 — Q-DUE chiusa.** La decisione è nel §10 della specifica;
  Q-SUITE e Safari sono punti aperti lì, rimandati dall'autore. Nascono P-41, il
  motore della mappa, subito dopo P-38 perché sblocca ChatGPT, e P-22, il
  progetto dell'area 5; P-23 resta segnaposto. Nel §4 la decisione sui file di
  esplorazione non tracciati nel worktree `ui`. P-38 lanciato.
- **29 settembre 2026 — i file di esplorazione tolti.** Scelta dell'autore;
  spostati nel Cestino, non cancellati. P-22 aspetta solo P-41.
- **29 settembre 2026 — P-38 chiuso.** Il banco non è più rosso a caso: due
  cause trovate e provate, nessuna delle due era un'attesa troppo corta. La
  regia l'ha rifatto girare tre volte, tutte verdi. P-41 per primo.
- **29 settembre 2026 — P-41 chiuso.** Il motore della mappa c'è; P-22 è pronto
  per ChatGPT e P-39 per Claude. Nasce il segnaposto P-42 per il secondo tempo
  di `consigli()`. Tre scelte del motore da confermare nel §4.
- **29 settembre 2026 — P-39 e P-22 chiusi.** P-18 pronto per ChatGPT, con il
  contratto cresciuto e i due difetti trovati da P-39. Nascono P-43 per i dieci
  gruppi di controlli che restano, in parallelo a P-18, e P-44 per i controlli
  della mappa, prima di P-23. L'autore conferma le tre scelte di `dovePesa()`.
- **29 settembre 2026 — P-43 e P-18 chiusi: il client è nella pagina.** La
  pagina vera passa i diciotto gruppi di controlli, due giri su due. Da qui
  `main` non si pusha fino al traguardo, scritto in testa al §4. P-40 e P-26
  scritti per intero, P-44 pronto, P-24 pronto per ChatGPT (il progetto
  dell'area 6), P-25 segnaposto; P-23 non aspetta più P-21.
- **30 settembre 2026 — P-40 e P-24 chiusi.** La pagina senza client non passa
  più. Nascono P-45 (i controlli dell'area 6) e P-46 (tre scelte del client
  senza controllo, prima del traguardo); nel §4 le quattro proposte di P-24.
  ChatGPT aspetta P-44.
- **30 settembre 2026 — la regia si passa di mano.** Scritti in «Come si usa» i
  passi che la regia fa a ogni resoconto e il prompt per riprenderla in una
  sessione nuova, perché il contesto della sessione di regia stava per finire.
  Il metodo non viveva solo in chat, ma i suoi passi sì.
- **30 settembre 2026 — la regia nuova, e una correzione di P-08 mai fusa.**
  La prima risposta della sessione nuova ha trovato che `sessione/p-08` non è
  contenuto in `main`: la merge `1760df9` ha preso `76d8e5c`, il commit citato
  nel resoconto, mentre la punta del ramo è `35055a4`, lo stesso commit
  emendato sei minuti dopo. Porta in più una riga del §15.4 di
  `account-progetto.md` — l'attività programmata «Registro privacy — Rotta
  Giusta», che tiene aggiornati i registri delle richieste e delle violazioni —,
  la procedura del Garante precisata (solo il modulo online, bozza sezioni
  A–O) e la sua voce di CHANGELOG. L'autore ha deciso di portarla su `main`.
  Territori puliti; la prova di merge si ferma su tre conflitti in
  `account-progetto.md`: la riga delle 72 ore, che P-11 ha riscritto nel
  frattempo, e due punti del registro in fondo. **Non è fatta:** mentre la
  regia provava la merge è comparso nella cartella principale
  `tests/pagina-mappa-progressi.html`, cioè il lavoro di P-44 già partito, e
  la merge è stata annullata subito, prima di lasciare nel checkout uno stato
  di merge sotto un'altra sessione; l'autore ha confermato che P-44 è al
  lavoro. Resta in coda come riga 29, dopo P-44. Nel
  passo 3 della regia entra il controllo che l'avrebbe presa: dopo la merge,
  `git log main..<ramo>` vuoto. Corretti gli stati vecchi di P-12 e P-32, e la
  testata.
- **30 settembre 2026 — P-44 chiuso, P-08 fuso per intero, P-23 pronto.**
  P-44 dà i controlli di Progressi in due regimi, con il raccordo scritto nel
  §10.1 dell'area 5 prima della pagina; ha trovato il `pari` di `dovePesa()`
  senza Navigazione né Manovra, che non chiede decisioni. La punta di
  `sessione/p-08` è su `main` (`f0c262e`): tre conflitti in
  `account-progetto.md` risolti a mano — la riga delle 72 ore prende il testo
  nuovo e tiene gli allarmi «fatti» di P-11 —, e la voce di CHANGELOG
  rimessa nella sezione di P-08, dove l'unione non l'aveva lasciata;
  `git log main..sessione/p-08` è vuoto. P-23 scritto per ChatGPT al posto del
  segnaposto; nasce il segnaposto P-47 per il regime vecchio di Progressi,
  insieme a P-42 dopo la merge di P-23.
- **30 settembre 2026 — P-46, P-26 e P-23 chiusi.** Tre resoconti insieme.
  P-23 fuso (`ee54b69`), con la riga vuota che mancava nel CHANGELOG; sullo
  stato fuso motore 167/169, server 60/60, dati 242, specifica 584, guardiano
  verde, interfaccia 1.394 in 150 s — i 1.246 di P-46 più i 148 di P-23. P-46 ha trovato un difetto della pagina,
  R-ACC-66: nascono P-48 per ChatGPT e il segnaposto P-49 per il controllo, che
  il traguardo ora aspetta al posto di P-26. P-47 scritto per intero, e assorbe
  P-42. Nel §4 Q-SUITE cresciuta a circa 150 s; in P-27 la nota di
  `filosofia.md` da togliere nel commit del rilascio.
- **30 settembre 2026 — P-47 e P-48 chiusi.** P-48 fuso (`b430cdb`), con la
  riga vuota che mancava nel CHANGELOG; sullo stato fuso motore 160/162 —
  sette test in meno, quelli di `consigli()` —, server 60/60, dati 242,
  specifica 584, guardiano verde, interfaccia 1.396 in 152 s. P-47 ha chiuso
  anche P-42. P-49 scritto per intero: è l'ultimo prompt di Claude che il
  traguardo aspetta, oltre a P-15. Il CSS morto di `.cons` va a P-21. Per
  ChatGPT non c'è niente di pronto fino a P-35.
- **30 settembre 2026 — la regia lancia la fila.** L'autore ha delegato alla
  regia P-49 e P-32…P-35, da lanciare come sotto-sessioni una dopo l'altra con
  i passi della regia in mezzo: scritto come punto 8 di «Come si usa».
- **30 settembre 2026 — P-49 chiuso, P-32 lanciato.** Primo della fila
  delegata: il resoconto torna con il repo e con le suite. Il traguardo aspetta
  ora solo P-15 e gli adempimenti.
- **30 settembre 2026 — P-32 chiuso, P-33 lanciato.** La composizione della
  prova di carteggio è nel motore, con il suo contratto per P-21; il resoconto
  torna con il repo e con le suite.
- **30 settembre 2026 — P-33 chiuso, P-34 lanciato.** L'attività intera anche
  per carteggio e tecniche, nel motore; il resoconto torna con il repo e con le
  suite.
- **30 settembre 2026 — P-34 chiuso, P-35 lanciato.** La bozza del carteggio ha
  il suo contratto nel motore e nel client, e il difetto è dimostrato rosso sulla
  pagina vera, dichiarato. Nel §4 una scelta su delega e tre testi da
  confermare, senza fermare la fila.
- **30 settembre 2026 — P-35 chiuso: la fila delegata è finita.** P-49 e
  P-32…P-35 sono chiusi, lanciati dalla regia uno dopo l'altro con i suoi passi
  in mezzo; nessuna suite rossa, nessuna sessione ferma. P-21 scritto per
  ChatGPT, e parte quando l'autore conferma le tre cose di P-34 e P-35 nel §4;
  nasce il segnaposto P-50 per il regime vecchio del Carteggio dopo la sua
  merge.
- **30 settembre 2026 — le tre cose confermate, e una seconda fila delegata.**
  L'autore ha confermato le tre scelte di P-34 e P-35, scritte come confermate
  dove si decidono; P-21 è pronto per ChatGPT. Ha delegato alla regia P-45 e i
  piccoli — P-12, P-37, P-16, P-17 —, nell'ordine; P-45 lanciato.
- **30 settembre 2026 — P-21 fermato, nasce P-51.** ChatGPT si è fermato da sé
  su un controllo di P-35 che fissa il regime della pagina vera invece di
  riconoscerlo: `test_carteggio_ambito` etichetta `app.html` come «attuale».
  Né la sessione P-35 né la regia l'avevano visto, perché con la pagina di oggi
  il controllo è verde. P-51 lo corregge e cerca gli altri casi, subito dopo
  P-45, che occupa la cartella principale; poi P-21 riprende dalla sua bozza.
- **30 settembre 2026 — P-45 chiuso, P-51 lanciato, nasce P-52.** I controlli
  dell'area 6 misurano nel browser, e hanno trovato sette difetti della pagina
  vera, dichiarati. Uno — lo stato dell'invio che dice «sul server» con righe
  in coda — non può aspettare P-25 e le decisioni dell'area 6: diventa P-52,
  e il traguardo lo aspetta.
- **30 settembre 2026 — P-51 chiuso, P-21 riprende.** Il controllo del
  Carteggio riconosce il regime della pagina vera, e `RG_PAGINA` fa girare la
  suite su una copia: provata sulla bozza di P-21, ha trovato l'aggancio di
  `#v-tec` perso. La regia ha deciso che la vista resta con il suo
  `data-v="tec"`, e l'ha scritto nel blocco «Ripresa» di P-21. `ui/main`
  allineato con un avanzamento veloce che non tocca `app.html`, con la bozza
  ancora non committata. Lanciato P-12.
- **30 settembre 2026 — P-12 chiuso, P-37 lanciato.** I quiz hanno un regime
  solo; il codice morto del selettore globale che P-12 ha trovato va in P-52,
  la prossima penna di ChatGPT su `app.html` dopo P-21.
- **30 settembre 2026 — P-37 chiuso, P-16 lanciato.** Il ciclo dei quiz ha un
  regime solo. R-UX-06 resta scoperto: nasce il segnaposto P-53, non urgente.
- **30 settembre 2026 — P-16 chiuso, P-17 lanciato.** `ritmo()` non dice più
  «orologio» senza orologio, e il difetto aveva una seconda metà, chiusa anche
  lei. La pulizia del filtro in pagina va a P-52.
- **30 settembre 2026 — P-17 chiuso: la seconda fila delegata è finita.**
  P-45, P-51, P-12, P-37, P-16 e P-17 chiusi, uno dopo l'altro con i passi della
  regia in mezzo; nessuna suite rossa. Per Claude resta P-15, con l'autore, e
  dopo P-21 P-50 e P-53; per ChatGPT P-21, poi P-52, che raccoglie T-02 e le
  pulizie della pagina trovate oggi. `ui/main` allineato con un avanzamento
  veloce che non tocca la bozza di P-21.
- **30 settembre 2026 — P-21 chiuso: il Carteggio è nella pagina.** Merge
  `1bb916a`; la bozza dell'account riprende dopo una ricarica, e C-19 è verde
  sulla pagina vera. P-50 e P-53 scritti per intero; P-52 pronto per ChatGPT,
  senza il CSS di `.cons` che P-21 ha già tolto.
- **1° ottobre 2026 — una terza fila delegata.** L'autore ha delegato alla
  regia P-50 e P-53, nell'ordine; P-50 lanciato.
- **1° ottobre 2026 — P-50 chiuso, P-53 lanciato.** Il Carteggio ha un regime
  solo, e nessun banco riconosce più un regime di pagina. Nel §4 una decisione
  nuova: la v0.28.0 pubblicata non ha l'avviso di P-36. P-52 ha un commit su
  `ui/main` (`0ed6e3a`); la regia lo fonde quando arriva il resoconto.
- **1° ottobre 2026 — P-53 chiuso: la terza fila delegata è finita.** Le frasi
  del riepilogo dei quiz hanno un controllo. Per Claude non resta niente di
  pronto oltre a P-15, con l'autore; per ChatGPT P-52, il cui commit è su
  `ui/main` e aspetta il resoconto.
- **1° ottobre 2026 — P-52 chiuso.** La pagina non dice più «sul server» con
  righe in coda. Il traguardo aspetta ora soltanto P-15 e gli adempimenti
  dell'autore; per ChatGPT resta P-25, dopo le decisioni del §8 dell'area 6.
  **Un errore della regia:** il commit `fc2bf2d` porta il messaggio di questa
  chiusura ma contiene solo la riga vuota del CHANGELOG, perché la modifica di
  questo file era fallita su una frase che non combaciava e il commit è partito
  lo stesso. Non è stato riscritto, perché `ui/main` era già allineato a lui;
  la chiusura vera è il commit che segue. D'ora in poi la regia controlla
  l'esito dello script prima di mettere in stage.
- **1° ottobre 2026 — P-15 parte.** L'autore lo apre in una sessione sua, come
  P-08, perché si fa insieme e il resoconto passa dalla regia. Nel prompt la
  regia ha aggiunto che il tag da avviare è `v0.28.0`, senza R-ACC-49: basta per
  la messa in esercizio, e il traguardo lo aggiorna.
- **1° ottobre 2026 — le decisioni dell'autore, P-25 pronto, il rilascio
  0.28.1.** Su una proposta che la regia ha verificato — il ramo di build di
  statichost.eu, P-36 pulito su `v0.28.0`, cinque righe T-* e non sei, il §7
  dell'area 6 rimasto indietro, lo zoom che P-05 aveva già misurato —, l'autore
  ha deciso i quattro «no» del §8 dell'area 6, Q-ONBOARD, Q-SUITE, le prove a
  mano sue, e il rilascio di correzione. Scritte nel §4; nei documenti dove si
  decidono quando P-15 lascia la cartella principale (riga 34). P-25 scritto per
  intero. Il rilascio 0.28.1 si prepara in un worktree, perché il `pre-commit`
  non lo lascerebbe fare a nessun ramo: il commit è dell'autore, con
  `TERRITORI_OK=1`.
- **1° ottobre 2026 — il rilascio 0.28.1 committato.** L'autore ha fatto il
  commit `affc37d` sul ramo `fix/0.28.1` con `TERRITORI_OK=1`, dopo che la
  regia aveva provato che il `pre-commit` lo rifiutava nominando i tre file;
  tag annotato `v0.28.1`. Suite del ramo verdi (motore 141/143, server 58/58,
  dati 242, interfaccia 295, specifica 370). Il CHANGELOG del ramo è quello di
  `v0.28.0` più la sola sezione `[0.28.1]`: la cherry-pick aveva portato con sé,
  per l'unione, le voci di `main` scritte dopo il tag, e la regia l'ha
  ricostruito. Mancano il controllo a occhio, il push e «Build now».
- **1° ottobre 2026 — il rilascio 0.28.1 guardato e pushato.** Servito in
  locale dal worktree del rilascio, con una voce temporanea in
  `.claude/launch.json` tolta subito dopo — P-15 lavorava nella cartella
  principale e non ne è stato toccato niente —: versione e cache `rg-0.28.1`,
  l'avviso sopra «Inizia prova d'esame» e sopra gli allenamenti, e nel runner
  quando c'è testo; con testo scritto un `beforeunload` è annullato, con il
  campo vuoto no e l'avviso sparisce; console senza errori. Una navigazione
  dello strumento era passata senza conferma: lo strumento naviga da fuori e
  salta `beforeunload`, e la prova sull'evento ha distinto i due casi. Con il
  sì dell'autore pushati soltanto `fix/0.28.1` e `v0.28.1`; `main` sul remoto
  resta a `51d9485`, la 0.28.0.
- **1° ottobre 2026 — la 0.28.1 è su `rottagiusta.it`.** L'autore ha portato
  il ramo di build su `fix/0.28.1` e premuto «Build now»; la build delle 03:22
  UTC nel pannello è «release: v0.28.1». Misurato con `curl`: `CACHE =
  'rg-0.28.1'`, `versione: 0.28.1`, `/app` 200 con l'avviso nella pagina.
  `.pages.dev` resta alla 0.28.0, `main` sul remoto anche. Il campo del
  pannello è scritto nel §4 e in P-27, perché al traguardo torni `main`. La
  sezione `[0.28.1]` del CHANGELOG entra in `main` quando P-15 lascia la
  cartella principale, insieme alla riga 34.
- **1° ottobre 2026 — P-15 e P-25 chiusi: il ridisegno è finito, e il server è
  in esercizio.** P-25 fuso (`511aa6d`): nessun difetto T-* resta dichiarato.
  P-15 ha messo il server su `api.rottagiusta.it`, con le copie verso
  `nl-ams` e il riavvio automatico delle 03:30 che l'autore ha deciso nella
  sessione. Nella cartella libera la regia ha scritto le decisioni del 1°
  ottobre nel §8 dell'area 6 e nel §10 della specifica, e portato in `main` la
  sezione `[0.28.1]` del CHANGELOG, solo aggiungendo righe. Il traguardo aspetta
  ora soltanto gli adempimenti dell'autore.
- **1° ottobre 2026 — tolti tre worktree.** `rotta-giusta-p07`, `-p08` e
  `-fix`, puliti, e i rami `sessione/p-07` e `sessione/p-08`, già in `main`.
  `fix/0.28.1` resta: il pannello di statichost.eu costruisce da lì fino al
  traguardo.
- **1° ottobre 2026 — un'altra penna, e il recinto aggirato.** La sessione
  «Adempimenti progetto account» ha fatto 14 commit su `main` dopo `9eebae7`:
  privacy, §15.4, README, il guardiano che nomina il titolare, Manrope servito
  da `site/`. Tutte le suite restano verdi sullo stato che ne risulta (motore
  193/197, server 62/62, dati 263, specifica 784, interfaccia 2.158), e il
  contenuto segue le decisioni dell'autore: la regia lo tiene. Due regole però
  non sono state rispettate. **Cinque commit hanno scritto in questo file**,
  che ha la regia come penna sola: il paragrafo degli adempimenti del §4 è ora
  il suo, e regge. **Cinque file dell'interfaccia sono entrati da `main`** —
  `site/privacy.html`, `site/index.html`, `site/avvertenza.html` e il font in
  `site/caratteri/` —: rilanciato dalla regia sui commit `ee4753a`, `7d90d7d`
  e `dbb27c4`, il controllo dei territori li rifiuta tutti, e l'autore non li
  ha committati lui. Come la sessione sia passata dal `pre-commit` la regia non
  l'ha potuto stabilire: nella trascrizione non compaiono né il rifiuto, né
  `TERRITORI_OK`, né `--no-verify`. **Da chiarire con quella sessione.** Da
  qui: la coda la scrive la regia, e un file di `site/` passa da `ui/main` o
  dal commit dell'autore. Nasce il punto di codice del §15.4 n. 8,
  l'esclusione dalle statistiche, in attesa di un prompt (P-54).
- **1° ottobre 2026 — correzione: il recinto non è stato aggirato.** La voce
  sopra è sbagliata nel punto che conta. I reflog lo dicono: i cinque commit di
  `site/` sono nati su `ui/main`, nel worktree dell'interfaccia, dove il
  `pre-commit` li ammette, e sono entrati in `main` con un fast-forward, dopo il
  controllo dei territori sull'intervallo uscito 0 — come `AGENTS.md` prevede
  per una sessione di Claude che scrive interfaccia. La regia aveva rilanciato
  il controllo sui singoli commit leggendoli come se fossero nati su `main`; un
  commit non porta il ramo su cui è nato, il reflog sì, ed era il primo posto
  da guardare. **Restano vere tre cose**, che la sessione stessa ha dichiarato:
  ha scritto in questo file, che ha la regia come penna sola; ha fatto lei le
  merge di `ui/main`, che sono della regia (punto 5 di «Come si usa»), e in
  fast-forward invece che con un commit di merge, così l'ingresso
  dell'interfaccia non ha un segno suo nella storia — non si riscrive, perché il
  contenuto è identico e riscrivere costa più di quanto renda —; e non ha
  verificato che ChatGPT fosse fermo, ma solo che la cartella fosse pulita.
  ChatGPT non aveva prompt aperti dopo P-25 (chiuso alle 08:27), quindi
  nessuna sessione è stata spostata sotto i piedi; chi riprende su `ui/main`
  parte dall'ultimo commit del ramo, oggi uguale a `main`.
- **1° ottobre 2026 — P-54 scritto.** Il punto 8 del §15.4 diventa un prompt:
  l'esclusione dalle statistiche sul server, con un posto solo da cui passa
  ogni conteggio. L'autore lo lancia in una sessione separata; il resoconto
  torna alla regia.
- **2 ottobre 2026 — P-54 chiuso.** Chi si oppone alle statistiche esce da ogni
  conteggio, e un controllo è rosso se un conteggio nasce fuori dal posto che lo
  garantisce. Il traguardo prova i due comandi sulla macchina. Nel §4 due
  domande per l'autore e due righe per la sua procedura.
- **2 ottobre 2026 — la lista del traguardo.** P-27 non è più un segnaposto:
  i cancelli, sei passi in ordine con chi li fa e come si vede che sono fatti,
  e come si torna indietro. Verificati per scriverla: gli strumenti della
  macchina invariati da P-15; la privacy che dice ancora «Bozza», quindi un
  cancello; `.pages.dev` che costruisce `main` al push ma lì non mostra
  l'account; `rg-aggiorna` che legge il tag da GitHub, quindi il server dopo il
  push e prima di «Build now».
- **2 ottobre 2026 — gli adempimenti fatti con la regia, e la regia si passa di
  mano.** Il registro dei trattamenti, le due LIA, la nota sulla DPIA e il PDF
  di Scaleway sono nella cartella del titolare; l'inoltro IONOS è eliminato;
  il §15.4 non si contraddice più su `privacy@`. Trovato: l'attività «Registro
  privacy» ferma dal 26 settembre, il primo punto aperto del §4. Il contesto
  di questa sessione di regia è finito: si riprende con il prompt di «Come si
  riprende la regia in una sessione nuova».
- **2 ottobre 2026 — la regia nuova: il Registro privacy, il quinto MX, e la
  decisione che chiude il cancello degli adempimenti.** La sessione nuova è
  partita dal prompt corto, e la sua prima risposta ha trovato quello che al
  file mancava: la testata ferma al 30 settembre, cinque voci del §4 superate e
  non barrate, il DPA di statichost.eu di cui non si capiva se fosse partito,
  e l'ordine dei passi che l'autore ha poi dato in chat. Tutto è scritto ora:
  le voci barrate, e il prompt di ripresa con «Dove siamo» e «I prossimi
  passi», che la regia uscente riscrive. Con l'autore: l'attività «Registro
  privacy» gira di nuovo — due righe nuove nel diario, lette dalla regia con
  il suo sì —, e resta la prova del primo passaggio programmato; il quinto MX
  è su IONOS, verificato; il DPA è firmato e spedito. **Deciso dall'autore:**
  niente PEC, niente parere firmato, si pubblica senza aspettare la copia
  controfirmata; «Bozza» esce dalla privacy nel commit di rilascio. Trovato
  guardando Zimbra: l'SPF è a posto, **la firma DKIM di `privacy@` non è
  attiva**. Il traguardo aspetta le suite su `main` e il via dell'autore.
- **2 ottobre 2026 — la firma DKIM di `privacy@` attivata.** Con il sì
  dell'autore, dal pannello OVHcloud; la diagnostica è tutta «Configurazione
  OK» e le chiavi rispondono sul DNS. Degli adempimenti resta la copia
  controfirmata del DPA di statichost.eu, che il traguardo non aspetta.
- **2 ottobre 2026 — il controllo prima del traguardo.** L'autore ha notato che
  l'ultima parte era andata avanti fuori dai prompt, e ha chiesto di verificare
  che non si fosse dimenticato niente prima di P-27. Trovate due promesse
  dell'informativa senza il loro pezzo — le letture del titolare annotate, le
  condizioni per l'account alla registrazione — e tre cose che la lista di
  P-27 non aveva: il commento «Gate dell'autore» nella privacy e le frasi
  della specifica sul sito «non ancora pubblicato». Il cancello della coda
  vuota è riaperto; P-27 non parte finché l'autore non decide sulle prime due.
  Suite su `main` (`80209be`) quel giorno, tutte verdi: motore 193/197 con i
  quattro skip previsti, server 68/68 — anche con la 24.21.0 LTS, il pacchetto
  confrontato con il `SHASUMS256.txt` di nodejs.org, e con lei il motore dà gli
  stessi numeri —, dati 263, specifica 800, interfaccia 2.158, `ripristina
  --prova` verde, guardiano verde. Il cancello delle suite è chiuso su questo
  stato, e si riapre a ogni commit che tocca codice.
- **2 ottobre 2026 — P-55, P-56 e P-57 scritti.** L'autore ha deciso che le
  condizioni nel modulo di registrazione le fa ChatGPT: P-56, pronto, con la
  forma consigliata dalla regia, una frase con il link. P-57 è il suo
  controllo, dopo la merge. P-55, lo strumento delle letture, aspetta ancora il
  suo sì. Il meccanismo torna quello di prima: un prompt con il numero, un
  resoconto, la merge della regia.
- **2 ottobre 2026 — P-55 lanciato.** L'autore ha detto sì allo strumento e ha
  delegato il lancio alla regia; P-56 è nelle sue mani, per ChatGPT.
- **2 ottobre 2026 — P-55 e P-56 chiusi, P-57 lanciato.** Lo strumento delle
  letture del titolare è su `main`, con i suoi quattro requisiti; la frase
  sulle condizioni è nel modulo di registrazione, fusa (`1540158`). Sullo stato
  fuso tutte le suite verdi: motore 193/197, server 72/72 anche con la LTS,
  dati 263, specifica 816, interfaccia 2.158. L'autore ha delegato alla regia
  anche P-57, lanciato dopo la merge. Due domande nuove per lui nel §20, da
  P-55; nel passo 5 di P-27 entra `leggi.mjs`.
- **2 ottobre 2026 — P-57 chiuso, e un difetto che ferma il traguardo.** Il
  controllo delle condizioni nel modulo c'è (R-ACC-75), e scrivendolo la
  sessione ha trovato che il modulo aperto dal riepilogo resta sotto il
  riepilogo, da P-18: chi vuole registrarsi alla fine di un'attività non vede
  niente. Dichiarato, con la verifica che lo dimostra (R-ACC-76); P-58 per
  ChatGPT lo chiude, con i link delle finestre dell'account in una scheda
  nuova. P-57 si era interrotto per il limite d'uso dell'account ed è stato
  ripreso senza perdere niente. Suite sullo stato di `dcced58`: motore 193/197,
  server 72/72 anche con la LTS, dati 263, specifica 824, interfaccia 2.248.
- **2 ottobre 2026 — P-58 chiuso: i tre cancelli di P-27 sono chiusi.** La
  finestra dell'account sta sopra i riepiloghi, e nessun difetto dichiarato
  resta. In un giorno il controllo chiesto dall'autore ha prodotto quattro
  prompt — P-55, P-56, P-57, P-58 — per due promesse dell'informativa senza il
  loro pezzo e per un difetto che c'era da P-18 sulla strada dell'ADR-004. Il
  traguardo aspetta il via dell'autore, e comincia dal passo 1.
- **3 ottobre 2026 — il commit di rilascio, e la regia si passa di mano.**
  L'autore ha lanciato il commit della 0.29.0 (`9c7afe8`) la mattina del 3
  ottobre, sull'albero che la regia aveva preparato la sera prima: per questo
  la data dentro era il 2, e la correzione è rimasta in stage, da committare
  da lui. Il tag non c'è e niente è pushato. Su sua richiesta P-27 prosegue in
  una sessione sua, con un prompt scritto ora nel §6 insieme allo stato esatto,
  e la regia si riprende in una sessione nuova: il contesto di questa era
  pieno. Il prompt di ripresa dice che cosa aspetta la regia nuova — il
  resoconto di P-27, e le cose aperte del §4. Il Registro privacy, la notte,
  ha avuto un passaggio scaduto e uno durato 76 minuti: non è ancora
  dimostrato che giri da solo.
- **3 ottobre 2026 — la data del rilascio corretta.** L'autore ha committato
  la correzione (`3198803`): il rilascio è datato 3 ottobre. Il tag `v0.29.0`
  va su quel commit, e lo fa la sessione di P-27 dopo le suite.
- **3 ottobre 2026 — P-27 chiuso: la v0.29.0 è in linea.** La regia nuova ha
  confrontato il resoconto con il repo e con quello che servono
  `rottagiusta.it`, `.pages.dev` e `api.`: il tag su `3198803`, dodici file del
  sito identici byte per byte al tag, il server a 0.29.0 con schema 4 e il
  `Retry-After` esposto solo al sito. La sessione di P-27 ha lanciato lei
  `rg-aggiorna`, su richiesta dell'autore, e ha trovato che statichost.eu
  etichetta la build con l'ultimo commit del ramo: è una regola in `AGENTS.md`.
  Esce la riga 9 della coda; la testa del §4, «`main` non si pusha», è barrata;
  §1 e §5 dicono che sono passato. Nel §4 entra «Dopo il traguardo»: la
  decisione sull'archivio di prima, che vive ancora solo nel CHANGELOG, il ramo
  `fix/0.28.1`, il redirect del 16 ottobre, la soglia del 2 novembre, Safari su
  iPhone. Il prompt di ripresa dice lo stato nuovo. Restano, con un sì
  dell'autore, `fix/0.28.1` da GitHub e l'allineamento dei rami di ChatGPT.
- **3 ottobre 2026 — il passo 6 finito.** Con il sì dell'autore: la chiusura
  della coda pushata, `fix/0.28.1` tolto dal Mac e da GitHub, `ui/main` e
  `ui/vetrina` allineati a `main`. Per la regia resta il §4.
- **3 ottobre 2026 — dopo il traguardo: tre decisioni e tre prompt.**
  L'autore ha deciso di togliere subito il passaggio dell'archivio di prima,
  con il criterio che per chi arriva dalla 0.29.0 non cambia niente: P-60 per
  la decisione scritta e i controlli, P-61 per la pagina. Il Registro privacy
  letto con il suo sì: gira, e il fallimento del 2 ottobre era il Mac in
  stop; l'attività ora dice il ritardo dall'ultima scansione. La casella OVH
  nell'app Mail e un filtro in Gmail restano da fare. Per i miglioramenti e
  le donazioni l'autore vuole un brainstorming in una sessione sua: P-59; lo
  smistamento in prompt è della regia, dal suo resoconto. Rilasci piccoli e
  frequenti.
- **3 ottobre 2026 — via anche l'offline, in un lavoro solo.** L'autore ha
  deciso di togliere l'offline per semplicità, e di considerare che nessuno
  abbia usato il sito prima degli account. P-60 e P-61 riscritti: un ADR, il
  `sw.js` che si toglie di mezzo, la versione in due posti, la pagina; poi il
  rilascio 0.30.0 (riga 13). La copia nel dispositivo per chi ha l'account
  resta.
- **3 ottobre 2026 — un errore della regia, rimediato.** Per confrontare i
  conti di `test_specifica.py` su versioni diverse di questo file, la regia ha
  lanciato `git stash` nella cartella principale senza guardare prima `git
  status`: P-60 ci stava lavorando, e lo stash ha tolto per qualche secondo le
  sue modifiche a tredici file. Ripristinate subito con `git stash pop`, senza
  conflitti e con lo stash svuotato; i file sono tornati com'erano. Se in quei
  secondi P-60 ha letto un file o lanciato una suite, ha visto lo stato di
  `main`: glielo si dice. Il passo 1 di «Che cosa fa la regia» lo diceva già —
  `git status` prima di tutto — e la regia non l'ha fatto; d'ora in poi nella
  cartella principale non lancia comandi git che toccano l'albero, né
  `checkout` di file, mentre una sessione ci lavora.
- **3 ottobre 2026 — P-60 chiuso, P-61 pronto, P-62 per la mail.** P-60 ha
  tolto l'offline e il passaggio dell'archivio di prima dai documenti e dai
  controlli, in un ADR solo, e ha lasciato a P-61 il contratto della pagina.
  La regia ha rifatto le suite sullo stato di `main`. La casella `privacy@`
  sull'iPhone non si è collegata: la regia aveva indicato come server
  `zimbra1.mail.ovh.net`, che è la webmail, senza verificarlo sulla guida
  OVHcloud. L'autore ha chiesto una sessione a parte: P-62.
- **3 ottobre 2026 — la v0.30.0 è in linea.** P-61 fuso (`6ad7342`), suite
  verdi sullo stato fuso e sull'albero del rilascio; commit di rilascio
  dell'autore con `TERRITORI_OK=1` (`decdf76`), tag e push della regia con il
  suo sì. Su richiesta dell'autore la regia ha premuto «Build now» nel suo
  Chrome e lanciato `rg-aggiorna` sulla macchina con l'alias `rg-api`. Pagina
  e server alla 0.30.0, verificati da fuori; il dettaglio è nella voce
  «Verificato — la v0.30.0, in linea» del CHANGELOG. Resta aperta P-59, il
  brainstorming, e P-62, la casella `privacy@` sull'iPhone.
- **4 ottobre 2026 — P-59 chiuso e smistato, e la regia si è passata di mano.**
  La regia nuova è partita da un prompt che l'autore le ha dato in chat, perché
  quello scritto qui era ancora della v0.29.0: è riscritto ora, in «Come si
  riprende la regia». La sua prima risposta ha trovato quello che al file
  mancava: una modifica di `docs/idee-dopo-gli-account.md` non committata — i
  giri dei bot del 4 ottobre —, committata con il sì dell'autore (`84e6230`);
  l'esito di P-59 ancora «—», e il suo resoconto rimasto in chat; la testata e
  la coda ferme al 3 ottobre; l'ADR-005 fuori dalla tabella dei documenti. «Le
  decisioni di P-59» sono smistate nella tabella della coda, righe 15–23, con
  l'ordine deciso con l'autore: prima le decisioni formali (P-63), poi i mock
  in cinque passi (P-65…P-69) e la prova con le persone (P-70), poi il codice;
  «com'è andata» presto (P-64). Il §5, il §6 e i controlli R-NAV della
  specifica aspettano il progetto del ridisegno. Nel §4, «Dopo P-59»: otto
  cose per l'autore, e la nota della sessione parallela sul menu da
  riallineare. `ui/main` e `ui/vetrina` allineati a `main`.
