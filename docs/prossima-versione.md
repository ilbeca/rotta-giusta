# La prossima versione — specifica di lavoro

**Aperta il 12 settembre 2026.** Base di partenza: **v0.23.0**, pubblicata.
**Chi ci lavora:** l'autore decide, ChatGPT fa l'interfaccia, Claude fa il motore,
i dati, i test, i documenti e GitHub.

**Che cos'è.** Il ponte fra le decisioni prese e il codice: che cosa entra, in
quale ordine, chi lo fa, con quali contratti fra le due metà e con quali criteri
si dice che è finito. Non è una specifica di prodotto — quella è
[`specifica.md`](specifica.md) — né una specifica d'esperienza, che è la
*Specifica UX/UI* di ChatGPT nella sua revisione del 12 settembre.

**Dove sta.** Nella parte **neutra** di `docs/`: lo leggono e lo annotano tutti e
tre, e il `pre-commit` non lo rifiuta a nessuno dei due rami.

---

## 1. Che cosa entra, e perché in due versioni e non in una

Ci sono due corpi di lavoro, e **metterli nella stessa versione è la forma di
intervento a rischio più alto che questo progetto conosca**: una riscrittura
dell'architettura dell'informazione insieme a un cambiamento del modello dei
dati, su una pagina sola da 200 KB senza passo di build.

| | Che cosa | Chi la guida |
|---|---|---|
| **A — L'esperienza** | Il ridisegno secondo la Specifica UX/UI: Percorso, cinque intenzioni con gerarchia, ciclo che si chiude, carteggio spiegato. Più il tempo e le stime (§4) e le esportazioni di motore che servono (§6) | ChatGPT, con il motore di Claude sotto |
| **B — Le due patenti** | L'ambito *entro 12 miglia* accanto a *senza limiti*: il carteggio che cambia, la simulazione che cambia, e che cosa il sito dice a chi estende | Claude per dati e motore, ChatGPT per le schermate |

**La proposta di Claude è A prima, B subito dopo**, e la ragione non è la
dimensione ma una regola del progetto: *non si chiede una cosa che non si sa
ancora servire*. Chiedere «quale patente prepari?» in un'accoglienza che poi non
ha niente da dare a chi risponde «entro 12 miglia» sarebbe una promessa senza
contenuto, cioè il difetto di casa.

**Vincolo che A deve rispettare perché B non costringa a rifare l'accoglienza:**
ChatGPT progetta il primo ingresso **lasciando il posto** alla domanda
sull'ambito, e la Specifica UX/UI già prevede una domanda iniziale facoltativa
nella stessa posizione.

**Decide l'autore** se invertire l'ordine: se servire subito il pubblico entro 12
miglia conta più della coerenza dell'accoglienza, B viene prima. È una scelta di
priorità, non di correttezza.

---

## 2. Chi fa che cosa

Il confine non è galateo, è `territori.yaml`, e lo fa rispettare il `pre-commit`.

| Ambito | Chi | Dove |
|---|---|---|
| Motore di selezione e statistiche, dati della banca, figure | **Claude** | `site/engine.js`, `site/dati/`, `site/figure/` — ramo `main` |
| Test, strumenti, verifica contro il decreto | **Claude** | `tests/`, `strumenti/`, `fonte/` — ramo `main` |
| Specifica di prodotto, ADR, regole, README, versione | **Claude** | `docs/specifica.md`, `docs/adr/`, `AGENTS.md`, `README.md`, `VERSION` — ramo `main` |
| GitHub: issue, merge, tag, rilascio, pubblicazione | **Claude**, con il sì dell'autore per il push | — |
| Tutto il resto di `site/`: schermate, runner, testi, componenti | **ChatGPT** | ramo `ui/*` |
| Documenti UX | **ChatGPT** | `docs/*-ux.md` — ramo `ui/*` |
| CHANGELOG, service worker | **entrambi, in aggiunta** | `CHANGELOG.md`, `site/sw.js` |

**Le tre regole di contatto**, che valgono per tutta la lavorazione:

1. **Chi disegna non ricalcola.** Se una schermata ha bisogno di un numero
   derivato, si chiede un'esportazione al motore. Il §6 elenca quelle già
   previste: se ne manca una, si chiede prima di scriverla in pagina.
2. **Il CHANGELOG è additivo.** Si aggiunge in fondo a `[Unreleased]`, non si
   riscrivono le voci dell'altro.
3. **La versione non si tocca su `ui/*`.** Il rilascio è un commit a sé, su
   `main`, dopo la merge.

---

## 3. Le due patenti

### 3.1 Il fatto, e la fonte

La patente entro 12 miglia è la grande maggioranza della domanda in Italia;
quella senza limiti è la minoranza. Oggi il sito serve **solo la seconda**, e lo
dice fin dal titolo.

Il rapporto fra le due prove non è un'opinione: è nell'art. 6 del **DM 323/2021**,
già spogliato in [`ricerca-programma-esame.md`](ricerca-programma-esame.md).

| Prova | Composizione | Passa con | Tempo | Norma |
|---|---|---|---|---|
| Quiz base | 20 quesiti, 3 risposte | ≥ 16 | 30 min | art. 6 c. 3 |
| Quiz vela | 5 quesiti a risposta singola | ≥ 4 | 15 min | art. 6 c. 5 |
| **Quiz su elementi di carteggio** *(entro 12 mg)* | **5 quesiti a risposta singola** | **≥ 4** | **20 min** | **art. 6 c. 4** |
| Prova di carteggio *(senza limiti)* | 4 quesiti indipendenti | ≥ 3 | 60 min | art. 6 c. 6 |

E due regole che cambiano che cosa il sito deve dire a chi:

- **Il quiz base si fa «solo in assenza di abilitazione entro le 12 miglia»**
  (art. 6 c. 2). Chi estende **non lo sostiene**.
- **Per chi estende, la prova di carteggio *è* l'esame integrativo teorico**
  (art. 6 c. 11). Non è la prima di tre prove: è l'unica.

È la discrepanza **D-5** già registrata nella ricerca: *il sito non distingue i
due candidati, e propone 1.472 quesiti base a tutti.*

### 3.2 Che cosa cambia davvero, e che cosa non cambia

Misurato sui dati, non assunto.

**Non cambia la banca dei quiz.** I progressivi del decreto dicono che la sezione
**1.x** è il quiz base (1.472 quesiti) e la **2.x** il quiz vela (250): non
esiste una sezione separata per ambito. **Le due patenti condividono gli stessi
quesiti**, e tutto l'allenamento sui quiz vale già oggi per entrambe.

**Cambia il carteggio, e cambia di forma, non solo di contenuto.**

| | Entro 12 miglia | Senza limiti |
|---|---|---|
| File | `carteggio_e12.json` | `carteggio.json` |
| Sezione del decreto | 4.1.1 | 5.1.x |
| Esercizi | **50** | 135 |
| Forma | **uno scenario con 5 quesiti**, ciascuno con la sua risposta e la sua tolleranza | un esercizio, **una** risposta ufficiale |
| Incognite | **sempre le stesse cinque, nello stesso ordine**: distanza · ora o velocità · carburante · coordinate partenza · coordinate arrivo | quattro *argomenti*: correnti, navigazione costiera, scarroccio, carburante |
| Classificazione derivata | nessuna | 12 tecniche, non ministeriali |

Verificato oggi su tutti e 50 i record: **cinque quesiti ciascuno, cinque
etichette distinte, zero risposte vuote**, su quattro settori geografici. La
forma del dato e l'art. 6 c. 4 combaciano.

**Questa regolarità è una buona notizia per il progetto:** l'esercizio entro 12
ha uno scheletro fisso, quindi il runner può etichettare ogni campo e
l'autovalutazione è per quesito. Non servono né argomenti né tecniche derivate.

### 3.3 Lo stato di partenza, misurato

- **`carteggio_e12.json` non è referenziato da nessuna parte**: né in
  `site/app.html`, né nel guscio offline di `site/sw.js`. È pubblicato e morto da
  cinque versioni.
- **I parametri della prova di carteggio sono costanti nel codice** —
  `PROVA_MIN = 60`, `PROVA_N = 4`, `PROVA_SOGLIA = 3` in `app.html` — mentre
  quelli dei quiz stanno in `meta.json` sotto `prove`. È un'incoerenza che va
  sanata ora che le prove diventano tre.
- **`app.html` chiama il carteggio «la fase 1, quella eliminatoria»**: è la
  discrepanza **D-4**, una parafrasi presentata come fatto. Il decreto dice
  «propedeutiche alla sua prosecuzione».

### 3.4 Il modello dei dati — decisioni di Claude

**L'ambito è una preferenza dichiarata, non un dato dello storico.** Vive dove
vive la data d'esame: locale, facoltativo, modificabile. **Non entra
nell'archivio delle risposte**, perché una riga di archivio è un fatto su un
quesito e non su chi lo ha svolto; e cambiare ambito non deve riscrivere il
significato di quello che hai già fatto.

**Tre valori, non due:**

| valore | chi è | che cosa deve sostenere |
|---|---|---|
| `e12` | prepara la patente entro 12 miglia | quiz base + quiz su elementi di carteggio |
| `sl` | prepara la patente senza limiti, senza averne una | prova di carteggio + quiz base + (vela) |
| `est` | **estende** da entro 12 a senza limiti | **solo** la prova di carteggio |

Il terzo non è un dettaglio: è quello per cui il sito oggi propone 1.472 quesiti
a chi non deve sostenerne nessuno.

**L'autovalutazione dell'entro 12 produce cinque giudizi, non uno.** La decisione:
**cinque righe di archivio, una per quesito**, con `item_id` composto
(`"4.1.1 - 1#3"`). Ragioni: l'archivio resta a sole aggiunte e una riga continua
a corrispondere a una cosa giudicata; la copertura per quesito continua a
funzionare senza un secondo schema; e non nasce una seconda contabilità.

**Che cosa non si fa:** non si filtra la banca dei quiz per ambito, perché è la
stessa. Non si nasconde niente: chi estende **vede** che il quiz base esiste, e
legge che per lui non è richiesto. Dichiarare, non nascondere.

### 3.5 Quello che non entra adesso

- **Le tecniche per l'entro 12.** Le 12 tecniche sono derivate dai testi senza
  limiti; derivarne altre per l'e12 è un lavoro di contenuto, non di interfaccia.
- **Il drill «che tecnica serve?» sull'e12**, per la stessa ragione.
- **Il cambio di identità pubblica del sito.** Se il sito serve entrambe le
  patenti, cambiano il titolo, la vetrina, il README e la parola chiave con cui
  ci si fa trovare — e «patente nautica entro 12 miglia» ha più volume di ricerca
  di «senza limiti». È un lavoro suo, con i suoi test (§7), e va fatto **dopo**
  che la funzionalità esiste, non prima.

---

## 4. Il tempo e le stime

La Specifica UX/UI rinvia questa parte: la scrive Claude, ed è l'esito della
misura del 12 settembre registrata in
[`decisioni-aperte.md`](decisioni-aperte.md), punto 3.

### 4.1 Due regimi, non uno

La domanda giusta non è «quanti secondi» ma **a che cosa serve il numero**, e
serve a due cose diverse in due momenti diversi.

**Prima di conoscere la persona** — sotto `MIN_MISURATE = 30` risposte — non
esiste nessuna stima onesta: qualunque numero è la media di qualcun altro. Quello
che serve non è precisione ma una **decisione**: comincio adesso o no. E per
quella basta una garanzia, che non richiede statistica.

**Dopo** il motore ha **le sue** risposte, e una stima personale è legittima
perché sta misurando lei.

Il confine fra i due regimi è già nel codice. Non serve un numero migliore:
serve **smettere di annunciare un tempo prima della soglia**.

### 4.2 Che cosa dice l'interfaccia — requisiti

- **R-TEMPO-01.** Sotto `MIN_MISURATE` risposte misurate, **nessuna schermata
  annuncia una durata**. Al suo posto va una garanzia vera: *«Ti fermi quando
  vuoi, e quello che hai risposto resta.»*
- **R-TEMPO-02.** Sopra la soglia, una durata si può annunciare, **dichiarata
  come stima** e derivata da `stimaImpegno()`, mai scritta a mano.
- **R-TEMPO-03.** Nessuna schermata offre un selettore «quanto tempo hai?» che
  dimensioni una sessione. Misurato: fra sessioni vere la durata per domanda va
  da 9,8 a 39,3 secondi — **un fattore quattro** — quindi una quantità di lavoro
  promessa su una durata sarebbe inaffidabile per costruzione.
- **R-TEMPO-04.** È invece ammesso l'inverso: *«esercitati per circa N minuti»*
  con chiusura dopo la domanda corrente. Promette solo ciò che l'app controlla —
  quando fermarti — e non ciò che dipende dalla persona.

**Il numero misurato resta fuori dal codice.** 23,5 secondi per domanda è la
velocità di **una persona sola**: trasformarlo in una costante sarebbe la misura
su un campione di uno travestita da valore predefinito.

### 4.3 Il difetto del motore, da correggere — lavoro di Claude

`stimaImpegno()` usa la **media grezza** dei tempi per quesito. Sull'unico
archivio misurabile, **31 risposte su 2.100** oltre i due minuti — una lasciata
aperta 17,9 minuti — spostano quella media da 14,9 a **20,2 secondi**: il 36 %.

Chi supera le 30 risposte riceve quindi una stima costruita su una statistica
**non robusta**, e per giunta sul cronometro (`ms`, tempo fino alla risposta)
invece che sull'orologio. Il divario fra i due, misurato su 19 sessioni, è del
**14 %**.

**R-TEMPO-05.** `stimaImpegno()` usa una statistica robusta e dichiara quale
tempo misura. La correzione vale per chiunque, non solo per l'autore, e ha il suo
test.

---

## 5. L'esperienza — il lavoro di ChatGPT

Vale la *Specifica UX/UI*, revisione del 12 settembre, con le decisioni già
riconciliate in [`decisioni-aperte.md`](decisioni-aperte.md). Non la si ripete
qui. Tre cose che questo documento aggiunge e che la riguardano:

1. **Il §4 sopra sostituisce la sezione rinviata sul timer.** I quattro requisiti
   `R-TEMPO-*` sono vincoli, non proposte.
2. **Il primo ingresso lascia il posto alla domanda sull'ambito** (§1), anche se
   la domanda arriva nella versione dopo.
3. **Ogni ingresso dichiara comportamento e parametri** (§6), e il controllo
   esercita la selezione effettiva, non la presenza del nome.

---

## 6. I contratti che il motore espone — lavoro di Claude

Sono le esportazioni su cui l'interfaccia può progettare. Quelle marcate *nuova*
non esistono ancora: **finché non esistono, non si scrivono in pagina.**

| Contratto | Stato | A che serve |
|---|---|---|
| `mirata(items, prog, oggi, opt)` | c'è | attività consigliata, con il motivo per quesito |
| `daAllenare(items, prog, oggi, kind, extra)` | c'è | scelta per argomento e senza filtri; `lista` e `daFare` |
| `coda(items, prog, oggi, opt)` | c'è | ripasso errori, filtri locali |
| `screening(items, prog, oggi, perVoce, kind, seme)` | c'è | «Un giro tra gli argomenti» |
| `simulazione()` / `simulazioneVela()` | c'è | le prove sui quiz |
| `stimaImpegno(prog, rimanenti, giorni)` | **da correggere** | §4.3 |
| `AMBITI` e `ambitoValido(a)` | **nuova** | i tre valori di §3.4, in un posto solo |
| `proveDi(ambito, meta)` | **nuova** | quali prove deve sostenere chi ha quell'ambito, e con quali numeri — letti da `meta.json`, non da costanti |
| `provaCarteggio(esercizi, prog, oggi, ambito, seme)` | **nuova** | per `sl` quattro esercizi come oggi; per `e12` **uno scenario con i suoi cinque quesiti** |
| `esitoCarteggio(verdetti, ambito, meta)` | **nuova** | applica la soglia giusta: 3 su 4, oppure 4 su 5 |

E due cambiamenti ai dati, sempre di Claude:

- **`meta.json` dichiara tutte e tre le prove**, `carteggio` ed `elementi` incluse,
  con i numeri dell'art. 6. Le costanti `PROVA_*` spariscono da `app.html`.
- **`carteggio_e12.json` entra nel guscio offline** e viene caricato dall'app,
  con la stessa regola degli altri dati.

---

## 7. GitHub, verifica e rilascio — lavoro di Claude

- **Una issue per ogni questione aperta** di `decisioni-aperte.md` e del §9, così
  la decisione ha un posto dove vivere fuori da un documento lungo.
- **La merge di `ui/*` la fa Claude o l'autore**, mai un «hand off»: prima
  `check_territories.py --range main...ui/main`, poi il CHANGELOG, che è dove il
  conflitto arriva.
- **Il rilascio è un commit a sé**: `VERSION`, `CACHE` in `sw.js`, `versione` in
  `meta.json`, voce di CHANGELOG con lo stesso numero, tag annotato.
- **Niente push senza chiedere.** Un push pubblica il sito.
- **`docs/specifica.md` recepisce le decisioni** con la loro data, e i requisiti
  nuovi — `R-TEMPO-*`, quelli dell'ambito — prendono la loro riga con il proprio
  controllo.

---

## 8. Criteri di accettazione

Binari: passano o non passano. Quelli marcati *(prova)* richiedono una persona.

**Dell'ambito**

1. Con ambito `est`, il sito dichiara che il quiz base non è richiesto **e non lo
   nasconde**.
2. La prova entro 12 miglia apre **uno scenario con cinque quesiti etichettati**,
   e la soglia applicata è 4 su 5 in 20 minuti.
3. L'autovalutazione entro 12 produce **cinque righe** di archivio, e la copertura
   per esercizio le conta una per una.
4. Cambiare ambito **non modifica nessuna riga già in archivio**, e un test lo
   pretende.
5. I numeri delle tre prove in schermata vengono da `meta.json`, non da costanti.
6. `carteggio_e12.json` è nel guscio: l'app apre la prova entro 12 **offline**.

**Del tempo**

7. Con meno di 30 risposte misurate, **nessuna schermata scrive una durata**.
8. Sopra la soglia, la durata annunciata viene da `stimaImpegno()` e si dichiara
   stima.
9. `stimaImpegno()` regge una risposta lasciata aperta diciotto minuti senza che
   la stima si sposti in modo apprezzabile — con il caso nel test.

**Dell'esperienza**

10. Ogni ingresso dei quiz apre **la lista che ha dichiarato**, filtri e archivio
    vuoto compresi; il controllo esercita la selezione, non il nome.
11. Ogni schermata ha almeno un ingresso, e la barra porta solo a viste dichiarate.
12. Dopo un'attività con errori esiste un passo che **riapre quegli errori**, e la
    lista coincide con il conteggio annunciato.
13. *(prova)* Una persona nuova avvia un'attività senza aiuto, e sa dire che cosa
    il sito fa e non fa.

---

## 9. Che cosa resta aperto

| Questione | Decide | Nota |
|---|---|---|
| **L'ordine fra A e B** (§1) | l'autore | Priorità, non correttezza |
| Le cinque questioni di `decisioni-aperte.md` | l'autore | Punto 5 aspetta ancora la posizione di ChatGPT |
| Se il sito cambia identità pubblica quando serve due patenti | l'autore | Titolo, vetrina, README, parole chiave |
| Se l'ambito si chieda all'accoglienza o si deduca dall'uso | l'autore, con ChatGPT | Vale la regola: ogni domanda deve avere una conseguenza visibile |
| Le tecniche derivate per l'entro 12 | rinviato | Lavoro di contenuto |
| Prove con persone e dispositivi reali | l'autore fornisce entrambi | Nessuna prova è mai stata fatta con altri |

---

## Registro

- **12 settembre 2026 — apertura.** Scritta dopo la revisione della Specifica
  UX/UI di ChatGPT del 12 settembre, che recepisce le correzioni concordate e
  rinvia la sezione sul tempo. Le tre misure che reggono il §3 sono state fatte
  oggi sui dati del repo: i quiz sono gli stessi per le due patenti (sezioni 1 e
  2 del decreto), `carteggio_e12.json` non è referenziato in nessun file, e tutti
  e 50 gli esercizi entro 12 hanno esattamente cinque quesiti con le stesse
  cinque etichette — la forma che l'art. 6 c. 4 prescrive. Nessuna decisione
  presa, nessun file di `site/` toccato.
