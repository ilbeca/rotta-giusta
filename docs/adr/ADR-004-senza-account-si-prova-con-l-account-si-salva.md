# ADR-004: Senza account si prova, con l'account si salva

## Status

**Accepted** — 25 settembre 2026. **Sostituisce in parte ADR-003**, dello stesso
giorno: soltanto la parola «obbligatorio», nel senso di «per usare il sito».
Tutto il resto dell'ADR-003 vale com'è — account con email e password, verifica
dell'indirizzo, righe sul server in chiaro e leggibili dal titolare, import del
file esportato, cancellazione dopo due anni di inattività con avviso.

(Non è l'ADR-004 di `Standards`, «la regola diventa un controllo», che
`AGENTS.md` e la specifica citano sempre con il nome del repo accanto.)

## Date

2026-09-25

## Context

L'ADR-003 ha scelto l'account **obbligatorio per usare il sito**, e ha
registrato fra le alternative la variante *obbligatorio per salvare, libero per
provare*. Di quella variante ha scritto per esteso che cosa costava non
sceglierla — il primo quesito dietro un modulo e un'email di verifica, l'offline
perso alla prima visita, un imbuto sulla schermata che secondo
`docs/specifica.md` §7.1 decide se una persona resta — e ha scritto che
soddisfa **tutte e tre** le aspettative della decisione:

1. gli utenti si registrano;
2. le risposte stanno sul server, ed è possibile leggerle;
3. chi ha già studiato converte il proprio file esportato in account.

Non ha scritto **perché** non l'ha scelta. Una decisione con i costi dichiarati e
la ragione mancante non si può difendere né smontare; si può solo eseguire.
Chiesto all'autore, un motivo che richiedesse la registrazione **dalla prima
risposta** non c'era.

L'autore ha poi precisato che cosa intende per «provare», e la precisazione è
parte di questa decisione: **senza account si usano tutte le prove, ma non si
salva niente**; la registrazione si raccomanda mostrandone i vantaggi, e dà
accesso alle metriche.

## Decision

**Senza account si prova: tutte le attività, e niente che resti. Con l'account
si salva, e si vedono i progressi.**

- **Senza account** si fanno quiz, simulazioni, carteggio e Segnali, ognuno con
  il suo riepilogo di fine attività. Le risposte vivono **finché la pagina è
  aperta**, in memoria, e poi spariscono. Nel browser non si scrive l'archivio;
  sul server non arriva niente. Nessun dato personale, nessun cookie.
- **Con l'account** le risposte si salvano — sul server, e nel browser per
  l'offline — e si vedono i **Progressi**: copertura, diagnosi, andamento,
  sessioni, e le metriche che il server rende possibili.
- **Registrarsi alla fine di un'attività non la butta via.** Le risposte della
  pagina aperta salgono con la registrazione, dalla porta dell'import che esiste
  già: `fondiArchivio()`, un'**unione per `uid`**, senza doppioni e senza un
  vincitore. È ciò che rende vero l'invito a registrarsi nel momento in cui c'è
  qualcosa da perdere. Lo specchio non viaggia, come nell'ADR-003.

### Perché i Progressi ai soli registrati non è un ricatto

Copertura, diagnosi e andamento sono **misure su uno storico**. Senza account
lo storico non esiste — le risposte finiscono con la pagina — e una misura su
niente non si mostra (§4.3 della specifica: sotto la soglia non si mostra la
misura, si mostra che non c'è). Non è una funzione tolta per spingere a
registrarsi: è una funzione che senza salvataggio non ha niente su cui lavorare.

La variante che sarebbe stata un ricatto è l'altra, considerata e scartata:
risposte salvate nel browser, e Progressi nascosti finché non ci si registra.
Lì i dati ci sarebbero, sul dispositivo di chi studia, e glieli terremmo al
buio.

### Quattro condizioni, e fanno parte della decisione

Senza di esse, questa decisione non vale.

1. **Senza account si dice che non resta niente**: prima di cominciare, e alla
   fine di ogni attività, con parole che non si possono fraintendere. Una
   perdita dichiarata è una scelta di chi studia; una perdita scoperta dopo è il
   guasto di casa.
2. **La registrazione si raccomanda con i vantaggi veri, quando c'è qualcosa da
   perdere.** La fine di un'attività è quel momento. I vantaggi mostrati sono
   quelli che esistono — il salvataggio, i Progressi, le metriche — e nessuna
   metrica si promette sotto le soglie del §4.3. **Non a ogni schermata:** un
   invito che torna finché non cedi è il dark pattern che `docs/filosofia.md`
   promette di non usare.
3. **Senza account non si toglie niente apposta.** Tutte le attività, con il
   loro riepilogo e la revisione degli errori della sessione, restano a chi
   prova. Ai registrati restano soltanto le viste che vivono di uno storico.
4. **Un archivio che esiste già non sparisce in silenzio.** Chi oggi ha le
   risposte nel browser, nel database `open-patente-nautica`, il giorno del
   rilascio le trova ancora, con due strade dichiarate: registrarsi e portarle
   nell'account, o scaricarle. Il modo lo decide il progetto di realizzazione;
   che non si perdano senza un avviso, no.

## Alternatives Considered

- **Obbligatorio per usare il sito (ADR-003).** Un solo stato da progettare, e
  dati di chiunque abbia risposto anche a un solo quesito. Scartato perché il suo
  costo cade su chi comincia da zero, nel momento in cui decide se restare, e
  perché nessuna delle tre aspettative lo richiede.
- **Senza account, risposte nel browser come oggi e Progressi locali; ai
  registrati il server e metriche nuove.** Toglie meno a chi prova, e tiene un
  incentivo più debole. Scartato dall'autore, che lega il salvataggio
  all'account: senza, non si salva.
- **Senza account, risposte nel browser e Progressi nascosti.** Scartato perché
  terrebbe al buio dati che sono già sul dispositivo di chi studia. Vedi sopra.

## Consequences

**Tornano veri, rispetto all'ADR-003:** il primo quesito senza chiedere niente;
l'offline alla prima visita, per provare; il primo ingresso dell'area 1, già
rilasciato, che si adatta invece di rifarsi.

**Si perde, per chi non si registra,** quello che il sito fino a oggi dava a
tutti: un archivio nel browser, i Progressi, la ripresa dal giorno prima. È una
perdita vera, e va detta — dalla condizione 1 in schermata, e da
`docs/filosofia.md` nei valori.

**Si guadagna, per chi non si registra,** che di lui non resta niente, da nessuna
parte.

**Restano, dall'ADR-003,** per chi si registra: i dati personali, il server in
chiaro, il cookie di sessione, gli obblighi GDPR per intero.

**Il motore non se ne accorge.** `ripiega()` legge righe in entrambi i casi:
quelle della pagina aperta, o quelle dell'archivio. Cambiano la pagina e il
progetto di realizzazione.

**Lasciato al progetto di realizzazione**, perché è un *come*: il passaggio di
chi ha già un archivio locale (condizione 4); che cosa succede alla sessione
aperta mentre l'email di verifica non è ancora confermata; la sorte delle
impostazioni senza account — la data d'esame, i punteggi migliori dei Segnali —
che oggi stanno in `localStorage`; che cosa resta nel browser all'uscita, su un
dispositivo condiviso; quali metriche, oltre ai Progressi di oggi.
