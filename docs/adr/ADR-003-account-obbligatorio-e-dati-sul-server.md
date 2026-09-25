# ADR-003: Account obbligatorio, con i dati sul server

## Status

**Accepted** — 25 settembre 2026. **Sostituisce ADR-002**, dello stesso giorno.

**Sostituito in parte da ADR-004**, lo stesso giorno: l'account non è più
obbligatorio per **usare** il sito, ma per **salvare**. Senza account si fanno
tutte le attività, e non resta niente; con l'account si salva e si vedono i
progressi. Tutto il resto di questo ADR vale com'è. Il titolo e il
paragrafo «Obbligatorio» qui sotto restano come sono stati scritti, perché sono
il testo che l'ADR-004 ha dovuto correggere.

## Date

2026-09-25

## Context

L'archivio delle risposte è **una copia sola**, in IndexedDB, nel browser di chi
studia. Chi cambia telefono o svuota i dati del sito perde tutto, e l'unica via
di salvataggio è un file da scaricare a mano: il difetto più grave che il
prodotto ha verso chi lo usa.

L'ADR-002 aveva scelto la via che minimizza il rischio: frase di recupero e
archivio cifrato nel browser, con il server che custodisce byte che non può
leggere. **Poggiava su un'assunzione mai verificata** — che al titolare non
servisse leggere i dati.

Verificata, la risposta è stata no. Servono leggibili, per il supporto a chi
scrive e per le statistiche. E un archivio cifrato lato client **non si può
leggere per definizione**: non è un limite da aggirare, è la proprietà stessa.
Quindi l'ADR-002 cade per intero, e non per un dettaglio.

Le aspettative dichiarate dall'autore, che questa decisione deve soddisfare:

1. gli utenti si registrano;
2. le risposte stanno sul server, ed è possibile leggerle;
3. chi ha già studiato può **convertire il proprio file esportato** in account.

## Decision

**Account con email e password, obbligatorio, e le righe sul server in chiaro.**

- **Obbligatorio**: si studia da registrati. Vedi «Alternatives» per la variante
  che è stata considerata e non scelta.
- **Verifica dell'email** richiesta: senza, un indirizzo sbagliato si scopre al
  primo reset, cioè quando i dati servono.
- **Le righe viaggiano, lo specchio no** (vedi sotto).
- **Import del file esistente**: chi ha un archivio locale lo carica e diventa il
  contenuto del suo account, dalla porta che esiste già.
- **Conservazione**: due anni di inattività, **con avviso** prima, poi
  cancellazione.

### Perché qui la sincronia non è il disastro della 0.4.2

È la domanda che questa decisione deve superare, perché la sincronia è ciò che
in questo progetto ha cancellato giorni di studio.

Quel disastro aveva una causa precisa: si fondeva **lo specchio**, cioè lo stato
derivato — «questo quesito l'hai visto tre volte» contro «no, cinque» — e
qualcuno doveva vincere. Quando il server ne sapeva meno, vinceva lui, e la
memoria spariva.

**Le righe non hanno quel problema.** Sono **append-only**, ognuna con il suo
`uid`, e non si modificano mai: fondere due archivi è un'**unione di insiemi**.
Nessuno deve vincere perché nessuno è in conflitto. È già quello che fa
`fondiArchivio()` per l'import da file, ed è già testato (R-STA-03).

```
righe sul server  ⟷  righe nel browser     unione per uid, nessun conflitto
       |                      |
       +-- lo specchio si ricalcola SEMPRE in locale, con ripiega() --+
```

**Lo specchio non viaggia mai, in nessuna direzione.** R-ARCH-01 — «lo specchio
ricalcolato coincide con quello costruito risposta per risposta» — resta intatta,
e resta il controllo che la tiene ferma.

È la ragione per cui questa decisione è tecnicamente sicura dove la 0.4.2 non lo
era, e non è merito di questo ADR: è merito del modello dei dati scelto nella
0.3.0, quando l'archivio è stato fatto append-only per un altro motivo.

## Alternatives Considered

- **ADR-002 — frase di recupero e archivio cifrato.** Minimizza tutto: nessuna
  email detenuta, nessun fornitore di posta, una violazione non espone niente di
  leggibile. Scartata perché rende **impossibile** leggere i dati, che è un
  requisito.

- **Opzione C — email e password, ma chiave derivata dalla password.** Accesso
  familiare e server che non legge. Scartata per lo stesso motivo della
  precedente, e in più il reset della password perderebbe i dati.

- **Account obbligatorio per *salvare*, libero per *provare*.** Registrazione
  richiesta solo nel momento in cui si vogliono conservare i progressi; chi
  arriva può rispondere subito, e si iscrive quando ha qualcosa da perdere.
  Soddisfa **tutte e tre** le aspettative sopra, perché chi studia sul serio
  vuole che i suoi progressi restino.

  **Non scelta**, ma va scritto che cosa costa non sceglierla, perché è il punto
  su cui questo ADR è più debole:

  - il primo uso richiede rete, registrazione e una mail di verifica **prima**
    di poter rispondere a un quesito, e `docs/specifica.md` §7.1 dice che la
    prima schermata «decide se una persona resta»;
  - l'offline resta possibile dopo l'accesso, ma **non alla prima visita**, e
    l'offline vero è una delle poche cose misurate di questo prodotto (zero byte
    trasferiti a pagina ricaricata);
  - `docs/filosofia.md` dichiara «nessun dark pattern possibile, perché non c'è
    un imbuto in cui far cadere qualcuno». **Una registrazione obbligatoria è un
    imbuto**, e quel documento va riscritto di conseguenza — non aggirato.

  Resta reversibile: renderla facoltativa è una riga di prodotto, non una
  riscrittura.

## Consequences

### I Vincoli che cadono

Del §2 di `docs/specifica.md` cadono quattro voci su sette: **nessun account**,
**nessun backend**, **nessuna sincronizzazione**, **nessun cookie** (ne serve uno
di sessione — tecnico, quindi senza banner di consenso).

Restano in piedi, e vanno difesi: nessuna seconda contabilità dello storico,
nessuna correzione automatica del carteggio, nessun build step, la banca
immutabile.

### Il GDPR, per intero e senza drammi

Sono **dati personali** — l'email lo è per definizione, e le risposte legate a
essa sono informazioni relative a una persona identificata. **Non** sono dati
particolari dell'art. 9: niente salute, religione, opinioni. Obblighi ordinari.

| | |
|---|---|
| Base giuridica | **Contratto** (art. 6.1.b): un servizio a cui ci si iscrive |
| Informativa | `site/privacy.html` da riscrivere: oggi dichiara che nessun dato è trattato |
| Registro dei trattamenti | Da tenere: il trattamento non è occasionale |
| Accesso e portabilità | **L'export esiste già** |
| Cancellazione | Da costruire, e deve cancellare davvero |
| Sicurezza (art. 32) | Hashing della password, TLS, controllo accessi, backup |
| Violazioni (art. 33) | Notifica entro 72 ore — e accorgersene richiede log |
| Responsabili | Un accordo con Scaleway (calcolo, database, posta) |
| Conservazione | Due anni di inattività, con avviso prima |

### Lo stack

Tre fornitori: **registrar + statichost.eu + Scaleway**. Scaleway copre calcolo,
database **e posta transazionale** (300 email/mese gratuite, `fr-par`,
infrastruttura europea), quindi l'account non ne aggiunge un quarto.

### I documenti che diventano falsi

Oltre a `privacy.html`, che è quello che pesa di più:

- **`docs/filosofia.md`** — «nessun account, nessuna registrazione», «nessun
  dark pattern possibile, perché non c'è un imbuto». È il documento dei valori,
  e va riscritto con onestà, non con un giro di parole.
- `site/index.html`, la vetrina — dichiara che non servono account.
- `docs/specifica.md` §2, e le sezioni che ne discendono.
- `README.md` — «Niente account, niente registrazione».

### Quello che questo ADR non decide

Forma delle tabelle sul server, algoritmo di hashing, durata della sessione,
struttura dell'API, e **se e come si mostrano statistiche aggregate**. Sono
scelte di realizzazione: vanno in un documento di progetto, non qui.
