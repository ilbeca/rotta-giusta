# ADR-002: Il recupero dei progressi si fa con una frase, non con un account

## Status

**Superseded da ADR-003** — 25 settembre 2026, lo stesso giorno.

Resta qui per intero, e non per archivio: l'analisi del rischio che contiene —
che cosa si detiene, che cosa espone una violazione, perche' la sincronia in
questo progetto e' pericolosa — vale ancora, ed e' il materiale su cui l'ADR-003
ha dovuto rispondere. Una decisione superata si dichiara: cancellarla farebbe
sparire anche il ragionamento che ha portato alla successiva.

**Perche' e' caduta.** Chiedeva una cosa sola, implicita e mai verificata: che
al titolare del sito **non servisse leggere i dati**. Verificata, la risposta e'
stata no — servono per il supporto e per le statistiche. E un archivio che il
server non puo' decifrare non si puo' leggere per definizione: non e' una
limitazione da aggirare, e' la proprieta' stessa.

## Date

2026-09-25

## Context

L'archivio delle risposte è **una copia sola**, in IndexedDB, nel browser di chi
studia (§3.2 della specifica). Chi cambia telefono, svuota i dati del sito o
perde il dispositivo perde tutto. L'unica via di salvataggio che l'app offre è
il file da scaricare dalla schermata Info — che funziona, ed è l'unica cosa che
nessuno si ricorda di fare prima che serva.

È il difetto più grave che il prodotto ha verso chi lo usa, e non è un difetto
di codice: è una conseguenza scelta dell'architettura, dichiarata nel README
(«scaricale prima di cambiare telefono»).

La via ovvia per ripararlo è un account: email, password, i progressi sul
server. Ma tocca **quattro Vincoli** del §2 della specifica — niente account,
niente backend, niente sincronizzazione, niente form — e quei Vincoli si
spostano solo con un ADR che dica perché. Questo è quell'ADR.

Tre fatti vincolano la scelta, e vanno messi in fila prima di decidere.

**Oggi il sito non tratta nessun dato personale.** Non è una promessa
nell'informativa: non esiste un server a cui i dati possano arrivare. Non c'è un
registro dei trattamenti da tenere né una base giuridica da individuare, perché
non c'è trattamento. Qualunque cosa si aggiunga, si aggiunge **partendo da
zero obblighi** — e il primo byte che arriva a un server li accende tutti.

**Il costo di un account non è il conto in banca, è quello che detieni.** Con
email e password si custodiscono indirizzi di posta di persone reali, cioè
esattamente il dato che rende dannosa una violazione. Con l'archivio in chiaro
sul server si custodisce anche la storia di studio di ognuno.

**Un account porta con sé l'aspettativa della sincronia**, e la sincronia è la
classe di guasto che in questo progetto è costata di più: nella 0.4.2 la fusione
fra due copie dello storico cancellò giorni di studio, e la 0.19.0 tolse la
seconda copia proprio per questo (§3.3, R-ARCH-01).

## Decision

**Si adotta il recupero con una frase e l'archivio cifrato nel browser.**
Nessun account, nessuna email, nessuna password.

1. Alla prima attivazione il browser genera una **frase di recupero** casuale
   (dodici parole da un dizionario noto). Non si sceglie, non si ricorda: si
   scrive da qualche parte.
2. Dalla frase si deriva **nel browser** una chiave.
3. L'archivio viene **cifrato nel browser** e caricato già cifrato.
4. Il server conserva due cose: un identificatore derivato dalla frase, e un
   blocco di byte **che non può decifrare**.

Quello che il server sa di te, per costruzione e non per promessa, è: *esiste
qualcuno con questo identificatore, e ha depositato questi byte*.

### Perché questo non introduce una seconda contabilità

È l'obiezione che conta, perché l'invariante architetturale del progetto è che
**l'archivio sia una copia sola**.

Non la rompe, e la ragione dev'essere precisa: **il blocco cifrato non è una
seconda fonte di verità, è una fotografia.** Il motore non lo legge mai. Non si
fonde da solo. Non c'è niente che decida «chi vince» fra il dispositivo e il
server, perché non c'è nessun confronto continuo.

Rimetterlo dentro passa dalla porta che esiste già: `fondiArchivio()`, la stessa
dell'import da file, che fonde per `uid`, **dichiara quante righe ha preso,
quante aveva già e quante ne ha scartate** (R-STA-03), e poi ricalcola lo
specchio da zero con `ripiega()`.

Detto in una riga: **non è sincronia, è il file di export parcheggiato da
qualche parte.** Il Vincolo «nessuna sincronizzazione» resta vero nella sostanza
— nessuna riconciliazione continua, nessuna fusione in sottofondo — e cade solo
il Vincolo «nessun backend», nella forma più stretta possibile: *un* endpoint
che accetta e restituisce byte opachi, e nient'altro.

## Alternatives Considered

- **Account con email e password.** Otterrebbe la stessa funzione e in più il
  recupero se dimentichi la frase. Scartata per che cosa ti lascia addosso:
  indirizzi email di persone reali, l'archivio in chiaro, un fornitore di posta
  in più con il suo contratto, i record SPF/DKIM/DMARC sul dominio, e un flusso
  di reset **che fallisce in silenzio** quando le email finiscono in spam — la
  funzione esiste in schermata e non funziona nella realtà, che è la forma di
  guasto che questo progetto insegue. In più sposta il modello di minaccia sul
  furto dell'account.

- **Non fare niente, e rendere scarica/ricarica difficile da dimenticare**: un
  promemoria dopo N risposte, l'export più in evidenza, un avviso quando
  l'archivio è cresciuto molto dall'ultimo salvataggio. Costo zero, obblighi
  zero, nessun Vincolo toccato. **Resta una buona idea e va fatta comunque**,
  perché è la rete di sicurezza per chi la frase la perde. Non basta da sola:
  non copre il telefono che si rompe fra un salvataggio e l'altro.

- **Sincronia vera fra dispositivi**, con fusione continua. Scartata senza
  esitazione: è precisamente il meccanismo che nella 0.4.2 ha perso giorni di
  studio, e la 0.19.0 lo ha rimosso apposta.

## Consequences

**Quello che si accetta, e va scritto in schermata prima e non dopo:**

- **Perdi la frase, perdi il blocco.** Nessuno può recuperarlo, e non è un
  limite tecnico da superare: è la stessa proprietà che impedisce a noi di
  leggerlo. È anche, esattamente, la situazione di oggi — perdi il file, perdi
  l'archivio — quindi non è un peggioramento.

**Quello che cambia negli obblighi:**

- Si diventa **titolare del trattamento**. Gli indirizzi IP arrivano a un
  server, e un archivio di risposte è un dato personale anche se pseudonimo.
  Servono informativa, base giuridica, registro dei trattamenti e un accordo con
  il fornitore. La superficie però è minima: il registro è di due righe e una
  violazione non espone niente di leggibile.
- **`site/privacy.html` va riscritta**, e questo è il punto da non dimenticare:
  oggi dice «non esiste un server che li riceva», e diventerebbe **falsa**. Una
  pagina che continua a dichiarare una garanzia che non vale più è il guasto
  muto in forma di prosa.

**Quello che non cambia, e va tenuto fermo:**

- `engine.js` resta senza DOM e senza rete. Il cifrario e il trasporto vivono
  nella pagina, come l'archivio.
- La banca resta statica e immutabile, e il guscio offline non dipende in nessun
  modo dal backup: **l'app deve funzionare identica senza rete e senza mai aver
  depositato niente.**
- L'archivio locale resta l'unica copia che il motore legge.

**Quello che questo ADR non decide** — sono scelte di realizzazione, non di
architettura: l'algoritmo di derivazione della chiave, la lunghezza e il
dizionario della frase, il formato del blocco, e dove esattamente sta
l'endpoint.
