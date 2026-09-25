# Prossime sessioni — la coda, con i prompt

**Aggiornato il 25 settembre 2026.** Territorio neutro.

> **Questo file invecchia.** È una coda, non una verità: quando un lavoro è
> fatto, la riga si toglie. Se una riga contraddice un documento di progetto,
> **ha ragione il documento**. I prompt qui sotto sono corti apposta: **puntano,
> non ripetono.** Un prompt che riassume un piano diverge dal piano appena il
> piano cambia — è il difetto che qui dentro è costato tre versioni divergenti
> dello stesso documento.

---

## Lo stato al 25 settembre 2026

**Chiuso.** La migrazione a `rottagiusta.it` su statichost.eu (v0.26.0–0.26.2).
`lunghezzaScreening()` nel motore con i suoi test. **ADR-003**: account con email
e password, verifica dell'indirizzo, righe sul server in chiaro, cancellazione
dopo due anni di inattività con avviso. **ADR-004**, lo stesso giorno: l'account
serve per **salvare**, non per usare. Senza account si fanno tutte le prove e
non resta niente, nemmeno nel browser; con l'account si salva, si vedono i
Progressi e si passa da un onboarding. Quattro condizioni fanno parte della
decisione: R-ACC-02…05 nel §9.9 della specifica.

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
  (specifica §2.4); il resto del contenuto è Q-ONBOARD.

Il *come* lo decide il progetto di realizzazione, punto 2.

**Fuori da `site/`, su `main`, nella stessa versione:** `README.md` righe 9–10
e 113 («Niente account, niente registrazione … non arrivano mai a nessuno»), e
`.claude/skills/rotta-giusta/SKILL.md` righe 15 e 18 («Nessun server»). Sono del
territorio `regole`.

## 2 · Il progetto di realizzazione degli account

L'ADR-003 e l'ADR-004 dicono *che cosa* e *perché*, e dichiarano di non decidere
il *come*. L'ADR-004 elenca tre domande lasciate apposta a questo progetto.

**Claude, su `main`. Richiede l'account Scaleway** (calcolo, database, posta).

```
Leggi docs/adr/ADR-003, docs/adr/ADR-004 e docs/recupero-progetto.md — superato, ma le
sezioni 5 (l'endpoint e la sua origine propria, misurata), 8, 9 e 10
valgono ancora e non vanno rifatte. Scrivi il progetto di realizzazione
degli account: tabelle, hashing, sessione, forma dell'API, verifica
dell'email, conversione di un file esportato, le risposte della pagina
aperta che salgono alla registrazione, il passaggio di chi ha già un
archivio nel browser, i dati dell'onboarding, cancellazione a due anni.
Niente codice: l'interfaccia è in ridisegno.
```

## 3 · Il ridisegno, la fetta successiva

**ChatGPT, su `ui/main`.** Non aspetta la registrazione: con l'ADR-004 il
primo quesito resta senza account. Ma va letto l'ADR-004 prima di disegnare
una schermata che promette di ricordare qualcosa: senza account non si salva, e
i Progressi sono dei registrati.

```
La fetta successiva di docs/prossima-versione.md §5.1. Include il
ricablaggio di E.lunghezzaScreening() al posto di totScreening() in
app.html — vedi docs/eccezioni-interfaccia.md.
```

## 4 · Fuori dalle sessioni — l'autore

- Aprire l'account **Scaleway** (blocca il punto 2).
- Q-ONBOARD (specifica §10): che cosa chiede l'onboarding oltre alla data, e se
  il sito consiglia un piano di studio strutturato.

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
