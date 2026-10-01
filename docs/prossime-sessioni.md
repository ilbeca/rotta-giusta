# Prossime sessioni — la coda, con i prompt

**Aggiornato il 30 settembre 2026.** Territorio neutro. **Penna: la sessione di regia** (sotto, «Come si usa»).

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

Sei la nuova sessione di regia della versione con gli account di Rotta
Giusta. Leggi AGENTS.md, e poi docs/prossime-sessioni.md per intero:
«Come si usa», «Che cosa fa la regia, passo per passo», la coda, il §4
e il §6 con gli esiti di tutti i prompt chiusi. È l'unica memoria della
regia precedente: quello che non c'è scritto non lo sai, e non lo
inventi.

Poi controlla lo stato vero — git log, git status nella cartella
principale e in ../rotta-giusta-ui, i rami non fusi — e dimmi in poche
righe dove siamo, che cosa è in corso, che cosa è pronto da lanciare e
che cosa aspetta una mia decisione. Non lanciare niente e non scrivere
niente finché non te lo chiedo: da lì ti incollerò i resoconti.
```

La prima risposta della sessione nuova è anche la prova che questo file basta:
se dice qualcosa di sbagliato o le manca qualcosa, il difetto è qui, e va
scritto qui.

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
| 8 | La messa in esercizio del server su Scaleway, con l'autore — **in corso** | Claude e l'autore | `main`, a mano, e pannelli | niente | P-15 |
| 26b | La realizzazione dell'area 6 — la rifinitura dei cinque difetti T-* | ChatGPT | `ui/main` | niente — **pronto** | P-25 |
| 34 | Scrivere le decisioni del 1° ottobre nel §8 dell'area 6 e nel §10 della specifica | la regia | `main` | P-15 (la cartella principale) | §4 |
| 35 | Il rilascio di correzione 0.28.1, con il solo P-36 — commit `affc37d` dell'autore e tag `v0.28.1` | la regia e l'autore | worktree `../rotta-giusta-fix`, ramo `fix/0.28.1` | **pushato** il 1° ottobre; «Build now» dal ramo `fix/0.28.1` nel pannello di statichost.eu, dell'autore, poi il `curl` della regia | §4 |
| 9 | **La versione con gli account** — il traguardo | tutti | `main` | P-15, e gli adempimenti del §4 | segnaposto P-27 |
| — | Decisioni e passi dell'autore | l'autore | — | — | §4 |

**Le due colonne corrono in parallelo**, e si sono incontrate: il client degli
account è nella pagina (P-18), Progressi è la mappa (P-23), e il carteggio ha
i suoi contratti e controlli su `main` (P-32…P-35). **Per Claude, l'ordine
consigliato:** P-15, la messa in esercizio, quando
l'autore ha il tempo; per il resto, niente di pronto. **Per ChatGPT: P-25**,
pronto dal 1° ottobre. I prompt di Claude vanno uno alla volta nella cartella principale, e
la suite dell'interfaccia di un worktree esclude quella dell'altro, per la porta
8620. Il numero di una riga è il suo nome, non la sua posizione. Il traguardo,
P-27, non aspetta le aree 4–6: aspetta il server in esercizio, i testi e gli
adempimenti.

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

- **Da `b50edec`, il 29 settembre 2026, `main` non si pusha fino al
  traguardo.** Contiene la pagina con gli account, e il server in produzione non
  c'è ancora: finché `.pages.dev` è acceso un push la pubblica lì da solo, con
  una registrazione che non può funzionare e un'informativa che descrive un
  server che non esiste. Su `rottagiusta.it` servirebbe «Build now», ma il
  rischio di `.pages.dev` basta. Se serve un rilascio prima del traguardo — una
  correzione urgente —, si fa da un ramo che parte dal tag `v0.28.0`, non da
  `main`. Il redirect di `.pages.dev` (fase D2, dal 16 ottobre) toglie la
  metà automatica del rischio, non l'altra.
- **Quattro proposte di P-24 da decidere prima di P-25**, nel §8 di
  `docs/area-6-progetto.md`: se cambiare la gerarchia di una vista, se
  cambiare il nome o il posto di un ingresso già deciso, come descrivere le
  figure a chi usa un lettore di schermo senza svelare la risposta, e Q-TEMA,
  il tema scuro. Non bloccano niente prima di P-25.
- **La privacy scritta da P-18 è una bozza**, da completare e verificare da te
  prima del rilascio, con i punti del §15.4 di `account-progetto.md`.
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
- **La suite che dura, e Safari** — rimandati dall'autore il 29 settembre, e
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
  Da scrivere dove si decidono — §8 dell'area 6, §10 della specifica — **dalla
  regia quando P-15 lascia la cartella principale**: è la riga 34 della coda.
- **Il sito pubblicato perde il testo del carteggio senza dirlo** (trovato da
  P-50 il 1° ottobre 2026, verificato dalla regia sul tag): la v0.28.0 non ha
  l'avviso e la conferma del browser di P-36, che sono su `main` dal 26
  settembre ma non sono mai usciti. Due strade: aspettare il traguardo, che
  porta la bozza vera; oppure un rilascio di correzione da un ramo che parte da
  `v0.28.0`, con il solo P-36, come dice la prima riga di questo §4. **Deciso
  dall'autore il 1° ottobre: il rilascio di correzione, 0.28.1.** Due cose che
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
- **Gli adempimenti: proposte, non decisioni** (1° ottobre 2026), per i punti
  del §15.4 di `account-progetto.md`: l'indirizzo postale — casa o un
  domicilio, sceglie l'autore —; la base giuridica del registro di sicurezza,
  legittimo interesse (art. 6.1.f, considerando 49), **da far confermare**;
  `privacy@` su una casella nell'UE invece dell'inoltro a Gmail, o dichiarato
  nell'informativa; due anni per le richieste evase; il DPA di statichost.eu da
  chiedere e firmare. Da fare, senza niente da decidere: i due fattori su Gmail,
  Scaleway e IONOS, il PDF del DPA di Scaleway, «Secure your account».
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

**Stato:** **in corso dal 1° ottobre 2026**, in una sessione di Claude Code aperta dall'autore. Il tag `v0.28.0` contiene il server, senza R-ACC-49 (P-43): il prompt lo dice. **Dove:** Claude Code, `~/Software/rotta-giusta`,
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

**Esito:** —

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

**Stato:** pronto dal 1° ottobre 2026: P-45 e P-21 sono chiusi, e l'autore ha
deciso le quattro proposte del §8 (§4). **Dove:** app di ChatGPT, progetto
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

**Esito:** —

---

### I segnaposto — i prompt che non si possono ancora scrivere

Qui sotto c'è **tutto quello che resta** fino alla versione con gli account e
alla fine del ridisegno, perché niente si perda. Ogni segnaposto ha già il suo
numero, che cosa aspetta, e che cosa il prompt dovrà contenere; il testo del
prompt no, perché punterebbe a documenti che non esistono ancora. La regia lo
scrive quando si chiude quello che aspetta, e lo scrive **qui, al posto del
segnaposto**.

#### P-42 — assorbito in P-47

Il secondo tempo di `consigli()` si fa nella stessa sessione di P-47, che
aspettava la stessa merge: il prompt è lì. **Chiuso con P-47**, `d579bb6`.

#### P-27 — la regia, con tutti: il traguardo

**Aspetta:** P-15, P-52, e gli adempimenti del §15.4 di
`account-progetto.md` chiusi dall'autore. **Dove:** `main`. **Dovrà
contenere:** la merge di tutto; il rilascio come dice `AGENTS.md` — numero nei
tre posti, voce, tag, push chiesto, «Build now» — **più il server**, aggiornato
con `rg-aggiorna` allo stesso tag; poi le due verifiche che solo quel giorno può
fare: un archivio vero nel browser che passa nell'account senza perdere una riga
(R-ACC-05), e il cookie fra `rottagiusta.it` e `api.` su un Safari vero
(Q-PROVE). Il §5 di questo file è la lista di controllo. **Trenta giorni
dopo**, la soglia degli allarmi riletta sul registro vero
(`account-progetto.md` §15.4). **Nello stesso commit del rilascio** si toglie
la nota in testa a `docs/filosofia.md`, che lo dice di sé (P-26). **E il ramo
di build di statichost.eu torna a `main`**, se il rilascio 0.28.1 l'ha portato
su `fix/0.28.1`: il `curl` di `sw.js` deve mostrare il numero nuovo, non
`rg-0.28.1`. Il numero del traguardo è 0.29.0. Il CHANGELOG di `main` porta
anche la sezione `[0.28.1]`.

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
