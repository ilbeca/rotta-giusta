# Product

<!-- impeccable:product-schema 1 -->

> **Questo file è una sintesi per le skill di disegno, non una fonte.** Se dice
> una cosa diversa da `docs/specifica.md` o da `docs/filosofia.md`, valgono
> loro, e questo file si corregge. Una sola penna, Claude su `main` (territorio
> `motore`); una modifica alla specifica che tocca il suo §1 o il §2 si porta
> qui nello stesso commit. Come si usa: `docs/procedure-disegno.md`, §8.
> Scritto il 26 ottobre 2026 con l'autore, con l'intervista di
> `impeccable init`.

## Platform

web

## Users

Chi prepara l'esame per la patente nautica **senza limiti dalla costa**, motore
e vela. Tre persone (specifica §1), e nessuna vince sempre: **si decide
superficie per superficie**. La Home, per esempio, favorisce **chi comincia da
zero**: spiega come funziona il sito, com'è fatto l'esame, e perché qui è bello
prepararlo.

- **Chi comincia da zero.** Spesso non sa che l'esame è fatto di più prove e che
  il carteggio è eliminatorio; teme di studiare la cosa sbagliata.
- **Chi è in formazione.** Studia con una scuola o un manuale e si esercita fra
  una lezione e l'altra; vuole due tocchi e partire.
- **Chi ripassa sotto esame.** Ha una data e vuole sapere dove è ancora
  scoperto; un numero che rassicura senza misurare è per lui un difetto grave.

**Il pubblico osservato** — un'osservazione dell'autore sulla sua classe, una
classe sola, non una statistica: per lo più uomini sotto i 30 anni, quattro
donne su venti; i 50–60enni fanno il carteggio sul serio.

**Le scuole nautiche e gli istruttori** sono un pubblico come chi consiglia il
sito ai suoi allievi. Oggi non hanno funzionalità loro (I-20, sospesa); un
piccolo richiamo che le inviti a scrivere all'autore è proposto in I-20 e non
deve promettere funzionalità che non ci sono.

## Product Purpose

Allenare all'esame con la banca ufficiale — i 1.722 quesiti e i 135 esercizi di
carteggio dell'Allegato A al DD 131/2022 — e dire la verità su come sta andando
la preparazione. Accompagna la preparazione, non la sostituisce: non prende il
posto della scuola né del manuale.

**Che cosa vuol dire che funziona**, per l'autore (26 ottobre 2026):
1. **chi lo usa passa l'esame**, carteggio compreso;
2. **chi prova si registra**, per scelta, perché l'account dà valore — non per
   un trucco (decisione 3 del 17 ottobre 2026);
3. **lo consigliano**: un compagno di corso a un altro, o una scuola ai suoi
   allievi.

## Positioning

Quattro cose che un concorrente non potrebbe dire tutte insieme:

- **Dichiara i propri difetti**, quesito per quesito: i 37 oscurati dal
  Ministero, gli 11 che divergono dal DM 133/2024, le figure riabbinate. La
  risposta del decreto non si cambia per convinzione: si annota e si cita la
  fonte.
- **Il carteggio vero**: la prova eliminatoria si allena sulla carta nautica,
  con la risposta ministeriale accanto e il giudizio di chi studia. Il sito non
  la corregge da solo.
- **Gratis e senza trucchi**: niente pubblicità, niente analytics di terzi,
  niente dati venduti, codice open source (MIT); si fanno tutte le attività
  senza account.
- **Fatto da chi l'ha superato**: nato come lo strumento con cui l'autore ha
  preparato e superato l'esame, il 3 settembre 2026.

## Operating Context

- **Il telefono, in verticale, con una mano**: è l'uso di tutti i giorni, fra
  una lezione e l'altra, nei ritagli di tempo.
- **Il carteggio si fa al tavolo**, con carta nautica (5/D, 42/D), squadrette e
  compasso: il telefono o il computer stanno accanto, e il sito dice prima che
  cosa serve.
- **L'esame vero**: quiz base (20 domande in 30 minuti, al più 4 errori), quiz
  vela (5 in 15, al più 1), prova di carteggio (4 esercizi in 60 minuti, 3 su 4).
  La composizione delle 20 domande è l'Allegato C al DM 323/2021.

## Capabilities and Constraints

- **Senza account si fanno tutte le attività e non resta niente**, nemmeno nel
  browser; **con l'account si salva**, sul server, in chiaro, e si vedono i
  Progressi (ADR-003, ADR-004). L'invito a registrarsi sta in tre posti e in
  nessun altro (ADR-006).
- **Niente offline** (ADR-005): senza rete il sito non si apre.
- **Pagine statiche, niente build step, niente dipendenze, nessuna risorsa da
  altri host**: il carattere è servito dal sito.
- **Un numero promesso e la lista che si apre vengono dalla stessa fonte**: la
  selezione e le misure stanno solo nel motore (`site/engine.js`).
- **Sotto le soglie dichiarate una misura non si mostra**: si dice che non c'è.
- La struttura è Home · Allenati (Quiz, Carteggio, Segnali) · Esame ·
  Progressi, più il Profilo (specifica §5–§7). Il ridisegno visivo è aperto
  (riga 39 della coda); la struttura e i vincoli no.

## Brand Commitments

Fermi qualunque direzione prenda il ridisegno (l'autore, 26 ottobre 2026):

- **il nome, Rotta Giusta**, e il dominio `rottagiusta.it`;
- **il marchio**: la nave con i due fanali, della v0.21.0 (7 settembre 2026),
  in `site/marchio.svg`, `site/marchio-negativo.svg` e nelle icone che ne
  derivano.

La voce dei testi **non** è fissata dall'autore: può cambiare con il ridisegno,
dentro gli impegni di `filosofia.md` — dire i limiti, non ingannare, spiegare
quando una spiegazione è nostra e non del decreto.

## Evidence on Hand

- La banca ufficiale, con il PDF del decreto in `fonte/` e la verifica
  rieseguibile (`fonte/verifica.py`); le 102 figure del decreto in
  `site/figure/`.
- I difetti dichiarati della banca, con le loro fonti (README).
- Il gioco dei Segnali, scritto dall'autore: materiale extra banca.
- **Non ci sono**, e non si inventano: recensioni, testimonianze, numeri di
  utenti, percentuali di promossi, loghi di scuole, articoli di stampa. Le prove
  con persone non sono state fatte (Q-PROVE).

## Product Principles

1. **La verità prima della rassicurazione**: un numero che non misura è un
   difetto, e un difetto dichiarato costa meno di uno nascosto.
2. **L'autorità sta nella fonte**: all'esame vale il decreto, non la nostra
   convinzione.
3. **Un imbuto che c'è non si usa contro chi ci passa**: si prova senza
   account, il costo si dice prima, nessun dark pattern.
4. **Ogni superficie ha un lavoro**: la Home orienta chi comincia; le
   attività si tolgono di mezzo; i Progressi dicono dove si è scoperti.

## Accessibility & Inclusion

WCAG 2.2 AA, misurato e tenuto fermo dai controlli del §9.11 della specifica:
contrasto 4,5:1, bersagli di almeno 24 px e obiettivo 44 px, fuoco visibile e
non coperto, nessuno scorrimento di lato a 320 px. L'uso con una mano al
telefono è il caso di riferimento. Lo zoom al 200 %, i percorsi interi da
tastiera e un lettore di schermo vero restano prove a mano, non fatte (R-RIF-10,
13, 14, 15).
