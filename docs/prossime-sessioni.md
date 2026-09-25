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
e password, **obbligatorio**, verifica dell'indirizzo, righe sul server in
chiaro, cancellazione dopo due anni di inattività con avviso.

**Superati, e marcati come tali** — non cancellati, perché contengono il
ragionamento su cui l'ADR-003 ha dovuto rispondere:
`docs/adr/ADR-002-…` e `docs/recupero-progetto.md` (di quest'ultimo restano
valide le sezioni 5, 8, 9 e 10).

---

## La collisione da guardare per prima

**L'ADR-003 tocca una cosa già costruita e rilasciata.** Il «primo ingresso» —
la schermata che secondo `docs/specifica.md` §7.1 «decide se una persona resta» —
è stato progettato e consegnato per un prodotto **senza account**. Con la
registrazione obbligatoria, la prima cosa che vede chi arriva diventa un modulo
e un'email di verifica, **prima** di poter rispondere a un quesito.

Non è un dettaglio di realizzazione: cambia la schermata che decide tutto, e va
affrontato prima di costruire il resto del ridisegno, non dopo.

L'ADR-003 registra in «Alternatives Considered» la variante non scelta —
*account obbligatorio per **salvare**, libero per **provare*** — che soddisfa le
stesse tre aspettative senza toccare il primo ingresso. È reversibile: è una
riga di prodotto, non una riscrittura. Decide l'autore.

---

## 1 · I testi di `site/` che gli account renderanno falsi — per `ui/*`

`docs/filosofia.md` e il §2 di `docs/specifica.md` sono stati riscritti il 25
settembre 2026. Restano i testi che chi studia legge davvero, e sono tutti
dell'interfaccia.

**Non si cambiano adesso.** Oggi sono **veri**: il sito pubblicato non ha
account e tiene tutto nel browser. Si cambiano **nella stessa versione** in cui
gli account entrano — un'informativa che descrive un server che non c'è è falsa
quanto una che tace quello che c'è. Le frasi nuove si prendono da
`docs/filosofia.md`, non si reinventano. E la forma dipende da Q-ACCESSO
(specifica §10): se la registrazione diventa obbligatoria solo per salvare,
«provi senza account» resta vero e metà di questa lista cambia.

Cercato con `grep` sul checkout di `main` il 25 settembre 2026, non ricordato;
i numeri di riga invecchiano, le frasi no.

**La privacy — `site/privacy.html`.** È quella che pesa di più, perché è un
documento con valore giuridico e oggi afferma il contrario del prodotto deciso.
Va riscritta, non ritoccata:

| Riga | Oggi dice | Con gli account |
|---|---|---|
| 8 | `description`: «nessun account, nessun cookie, nessun analytics. Le tue risposte restano nel tuo browser» | falso su account, cookie e browser; «nessun analytics» resta vero |
| 42 | «questo sito non sa chi sei. Niente account, niente cookie, niente analytics, niente form da compilare» | falso quasi per intero |
| 44–50 | «Cosa resta nel tuo browser»: «Non vengono trasmessi a nessuno … non esiste un server che li riceva»; «se cancelli i dati del sito … sparisce tutto» | falso: le righe stanno sul server, in chiaro, e il titolare le legge per supporto e statistiche |
| 56 | «L'autore di questo sito non riceve quell'indirizzo e non ha log da consultare» | vero per statichost.eu, falso per il server degli account: l'ADR-003 chiede log proprio per accorgersi di una violazione |
| 58–59 | «Cosa non c'è»: «Nessun dato personale viene trattato … non c'è un registro dei trattamenti … né una base giuridica … né dati da cancellare» | falso per intero |
| 62 | contatto solo dalle issue pubbliche su GitHub, «non scriverci dati personali» | serve un contatto del titolare per esercitare i diritti, e non può essere un canale pubblico |

E quello che l'informativa nuova deve contenere, dall'ADR-003 (§Consequences,
tabella GDPR): titolare e contatto; che cosa si tratta (email, risposte legate
all'account); per che cosa (accesso, supporto, statistiche); **base giuridica:
contratto, art. 6.1.b**; il fornitore del server come responsabile, e dove
stanno i dati; il cookie di sessione, tecnico; **conservazione: due anni di
inattività, con avviso prima**; i diritti — accesso e portabilità (l'export),
cancellazione — e come esercitarli. La sezione su statichost.eu e quella
sull'offline restano.

**La vetrina — `site/index.html`.**

| Riga | Oggi dice | Con gli account |
|---|---|---|
| 7 | `description`: «Gratis, senza account, tutto nel tuo browser» | falso su account e browser |
| 12 | `og:description`: «Gratis, senza account, open source» | falso su account |
| 220 | sottotitolo dell'hero: «Gratis, senza account, tutto nel tuo browser» | falso su account e browser |
| 238 | pregio «**Senza account** — Le risposte restano nel tuo browser» | falso per intero: è una delle tre promesse in prima vista |
| 380 | spunta «Nessun account, nessun cookie, nessun analytics» | falso su account e cookie |
| 381 | spunta «Funziona offline, anche in barca» | vero dopo l'accesso, **non alla prima visita**: va detto |

**La palestra — `site/app.html`.** Non era chiesta, ma dice le stesse cose, e
alcune le dice nel momento in cui chi studia decide se fidarsi:

| Riga | Oggi dice |
|---|---|
| 20, 23 | `og:description` e `description`: «senza account», «Tutto nel tuo browser, nessun account» |
| 729 | «I progressi restano in questo browser. Non si sincronizzano e possono andare persi» |
| 981–982 | «non arrivano a nessun server: non esiste un account e non c'e' niente da recuperare se le perdi» |
| 1025, 1613 | «Non serve un account. Le risposte restano in questo browser» — due copie della stessa frase, la seconda riscrive la prima |
| 1136 | commento: «Non c'e' un server. Tutto quello che l'app sa di te sta in questo browser» |

**Fuori da `site/`, su `main`, nella stessa versione:** `README.md` righe 9–10
e 113 («Niente account, niente registrazione … non arrivano mai a nessuno»), e
`.claude/skills/rotta-giusta/SKILL.md` righe 15 e 18 («Nessun server»). Sono del
territorio `regole`.

## 2 · Il progetto di realizzazione degli account

L'ADR-003 dice *che cosa* e *perché*, e dichiara di non decidere il *come*.

**Claude, su `main`. Richiede l'account Scaleway** (calcolo, database, posta).

```
Leggi docs/adr/ADR-003 e docs/recupero-progetto.md — superato, ma le
sezioni 5 (l'endpoint e la sua origine propria, misurata), 8, 9 e 10
valgono ancora e non vanno rifatte. Scrivi il progetto di realizzazione
degli account: tabelle, hashing, sessione, forma dell'API, verifica
dell'email, conversione di un file esportato, cancellazione a due anni.
Niente codice: l'interfaccia è in ridisegno.
```

## 3 · Il ridisegno, la fetta successiva

**ChatGPT, su `ui/main`.** Da fare **dopo** che l'autore ha deciso Q-ACCESSO
(specifica §10): se e come la registrazione entra nel primo ingresso.

```
La fetta successiva di docs/prossima-versione.md §5.1. Include il
ricablaggio di E.lunghezzaScreening() al posto di totScreening() in
app.html — vedi docs/eccezioni-interfaccia.md.
```

## 4 · Fuori dalle sessioni — l'autore

- Aprire l'account **Scaleway** (blocca il punto 2).
- Decidere sulla collisione qui sopra: obbligatorio davvero, o obbligatorio per
  salvare. È Q-ACCESSO nel §10 della specifica.

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
