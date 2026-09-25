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

## 1 · I documenti che l'ADR-003 rende falsi — *farlo per primo*

Non è lavoro tecnico: è decidere che cosa il sito dichiara di essere. Oggi
`docs/filosofia.md` dice «nessun account, nessuna registrazione» e «nessun dark
pattern possibile, perché non c'è un imbuto in cui far cadere qualcuno».

**Claude, su `main`.**

```
Leggi docs/adr/ADR-003 e riscrivi docs/filosofia.md e il §2 di
docs/specifica.md di conseguenza: in chiaro, senza giri di parole, e
dichiarando che cosa si perde. Poi lascia l'elenco di che cosa resta da
cambiare in site/ (vetrina, privacy) per chi lavora su ui/*.
```

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

**ChatGPT, su `ui/main`.** Da fare **dopo** che il punto 1 ha chiarito se e come
la registrazione entra nel primo ingresso.

```
La fetta successiva di docs/prossima-versione.md §5.1. Include il
ricablaggio di E.lunghezzaScreening() al posto di totScreening() in
app.html — vedi docs/eccezioni-interfaccia.md.
```

## 4 · Fuori dalle sessioni — l'autore

- Aprire l'account **Scaleway** (blocca il punto 2).
- Decidere sulla collisione qui sopra: obbligatorio davvero, o obbligatorio per
  salvare.

---

## Registro

- **25 settembre 2026 — prima stesura.** Scritta perché la sessione che aveva il
  contesto stava per chiudersi. Nasce anche da un errore di quella sessione: si
  era lavorato su una fotografia vecchia del repo, senza accorgersi che nel
  frattempo erano uscite quattro versioni. `git log` è un comando, e va eseguito
  **prima**.
