# Rotta Giusta — la specifica

**Data:** 9 settembre 2026.
**Prodotto di riferimento:** v0.22.1 pubblicata, più il lavoro in corso sul ramo
`ui/main` (non committato al momento della stesura).
**Che cos'è:** il documento unico di progetto. Che cosa il sito è, per chi, com'è
fatto sotto, dove vive ogni funzionalità, e — per ogni garanzia — **il controllo
che la tiene ferma**.
**Penna:** Claude, su `main`. Vedi §0.

---

## 0. Come si usa questo documento

### Perché uno solo

Il 9 settembre 2026 `specifiche-ux.md` esisteva in **tre versioni divergenti** —
526, 530 e 620 righe — e **nessuna conteneva le altre**. La più recente riportava
indietro, in silenzio, una correzione del giorno prima: un guasto muto servito da
un file che sembrava soltanto aggiornato. Nello stesso periodo la conoscenza del
prodotto era sparsa in cinque documenti che si citavano a vicenda, e nessuno dei
cinque diceva *dove sta ogni cosa*.

Il costo si è visto subito. Il 9 settembre la schermata «Che tecnica serve?» ha
perso il suo unico ingresso durante il ridisegno dell'interfaccia: la vista
esiste ancora, la sua logica pure, e **nessun elemento della pagina la apre**.
Nessun test è diventato rosso, nessun messaggio è comparso. Non esisteva da
nessuna parte un elenco che dicesse «questa funzionalità esiste e ci si arriva
di qui».

Questo documento è quell'elenco, più tutto il resto.

### Le tre etichette, e nessuna quarta

Ogni affermazione qui è una di queste tre. Non ce ne sono altre, ed è
deliberato:

- **Vincolo** — una garanzia del prodotto. Si rompe solo con un ADR che dica
  perché.
- **Deciso** — una scelta presa, con la data. Si cambia decidendo di nuovo.
- **Aperto** — manca una decisione, e la riga dice **chi** la prende.

L'etichetta che manca è **«proposta»**. La versione precedente di questo
materiale aveva 398 righe di cui quattro decisioni e tutto il resto proposte da
verificare: un documento in cui ogni frase è falsificabile solo dopo una prova
che nessuno ha in calendario non guida niente. Una proposta vive in una issue o
in un ramo, non qui. **Qui entra ciò che è stato deciso, e il giorno in cui lo è
stato.**

### Ogni requisito porta il suo controllo

Il §9 numera i requisiti. Ogni riga ha una colonna **controllo**: il nome del
test che lo dimostra, oppure la parola **scoperto** con il motivo.

`tests/test_specifica.py` legge questo file, estrae ogni identificatore `R-*` e
**fallisce se un requisito nomina un test che non esiste**, o se non dichiara di
essere scoperto. È l'ADR-004 di `Standards` applicato ai documenti: *una regola
che qualcuno deve ricordare si sostituisce con un controllo che git esegue.*

Il motivo per cui questa è la parte più importante del documento: il difetto
fondativo di questo progetto è **il semaforo verde a copertura zero** — uno
strumento che rassicura mentre non misura niente. Una specifica che dichiara
garanzie senza controlli è esattamente quello, in forma di prosa.

### Chi scrive

**Una penna sola, su `main`.** Questo file sta nel territorio `motore` di
`territori.yaml`, quindi il `pre-commit` rifiuta un commit che lo tocchi da
`ui/*`.

Non è galateo: una specifica non è additiva. Il `CHANGELOG.md` è condiviso
perché **si aggiunge in fondo**, e due mani che aggiungono non collidono. Una
specifica si **riscrive**, e due mani che riscrivono producono le tre versioni
divergenti di cui sopra.

ChatGPT progetta l'interfaccia sul ramo `ui/*` e propone da lì: bozze,
prototipi, documenti di lavoro. **Le proposte accolte le riporta qui chi fa la
merge.** Il lavoro di progettazione non passa da questo file; ci arriva il suo
esito.

### Che cosa questo documento ha assorbito

`docs/motore.md` (ora un puntatore a qui), `docs/specifiche-ux.md`,
`docs/riscontro-ux.md` e `docs/percorso-ux.md`. I tre `*-ux.md` restano sul
disco come **materiale storico**: raccontano come si è arrivati alle decisioni, e
non vanno più aggiornati. Dettaglio in appendice B.

---

## 1. Per chi è

Tre persone, e le loro paure contano quanto le loro competenze.

**Chi comincia da zero.** Ha deciso di prendere la patente, forse non ha ancora
prenotato l'esame, spesso non ha ancora aperto un manuale. **Non sa** che l'esame
è fatto di più prove, e che il carteggio è quella eliminatoria — è l'evidenza di
partenza dell'autore, che non l'aveva capito. **Teme** di scoprire tardi di aver
studiato la cosa sbagliata. Per lui la prima schermata non è un cruscotto: è la
risposta a «da dove comincio».

**Chi è già in formazione.** Frequenta una scuola o studia sul manuale, e usa il
sito per esercitarsi fra una lezione e l'altra. Sa di che cosa parla, vuole
scegliere l'argomento e cominciare. **Teme** di perdere tempo su quello che sa
già. Per lui il sito deve togliersi di mezzo: due tocchi e una batteria parte.

**Chi ripassa sotto esame.** Ha una data, ha coperto quasi tutto, e la domanda è
una sola: dove sono ancora scoperto, e quanto mi costa. **Teme** di arrivare
impreparato senza accorgersene — che è il motivo per cui in questo prodotto un
numero che rassicura senza misurare è considerato un difetto grave.

**Il contesto d'uso è il telefono in verticale, con una mano.** L'eccezione è il
carteggio, che si fa al tavolo con carta nautica, squadrette e compasso: è
l'unica attività che il telefono non basta a svolgere, e il sito lo dice prima
di iniziare invece di lasciarlo scoprire.

**Il sito accompagna una preparazione, non la sostituisce.** Non insegna: allena
e dà riscontri. L'unica eccezione dichiarata è il gioco dei Segnali, che insegna
per davvero, ed è anche l'unica parte scritta interamente dall'autore.

---

## 2. Che cos'è, e che cosa non è

Il 25 settembre 2026 l'**ADR-003** ha cambiato questa sezione più di qualunque
altra: **account, e le risposte sul server in chiaro**, leggibili dal titolare.
Lo stesso giorno l'**ADR-004** (`docs/adr/`, non quello di `Standards`) ha
precisato per che cosa serve l'account: **per salvare**, non per usare. Senza
account si fanno tutte le attività, e non resta niente. Quattro dei sette Vincoli che stavano
qui cadono. Sotto: che cosa
resta, che cosa cade, e che cosa si perde — detto per esteso, perché è il posto
in cui una decisione del genere si è tentati di scriverla a mezza voce.

**La decisione è nel prodotto su `main`, non ancora in quello pubblicato.**
Dal 29 settembre 2026 la pagina su `main` ha il client degli account (P-18), e
con lei i testi di `site/`; il server è scritto e provato dalla sua suite; dal
30 settembre (P-26) questo documento, `README.md`, `AGENTS.md` e la skill del
progetto descrivono il sito con gli account. La versione pubblicata, la
v0.28.0, non li ha: finché il rilascio che li porta non c'è, chi apre
`rottagiusta.it` trova il sito di prima, e `main` non si pusha
(`docs/prossime-sessioni.md` §4). Testi e prodotto cambiano **nella stessa
versione** — non prima e non dopo. Un'informativa che descrive un server che
non c'è è falsa quanto una che tace quello che c'è.

### 2.1 Che cosa resta — Vincolo

Queste nessuna bozza le sposta senza un ADR, e né l'ADR-003 né l'ADR-004 le
toccano.

| Non c'è | Perché |
|---|---|
| **Nessuna seconda contabilità dello storico** | §3.3. Con un server conta **di più**, non di meno: le righe viaggiano, lo specchio **mai**, in nessuna direzione, e si ricalcola sempre in locale con `ripiega()`. R-ARCH-01 resta il controllo. |
| **Nessuna correzione automatica del carteggio** | §4.5. |
| **Nessun build step, nessun bundler, nessuna dipendenza nella pagina** | `index.html` e `app.html` importano solo `/engine.js`. Quello che è nel repo è quello che gira. Che esista un server non autorizza un bundler nella pagina. |
| **Nessuna modifica alla banca per convinzione** | §3.1. È l'Allegato A al DD 131/2022: si annota e si cita la fonte. |
| **Nessun analytics** | L'ADR-003 chiede statistiche, e si fanno **leggendo le righe delle risposte** che il server già conserva. Non autorizzano script di terzi, né il tracciamento della navigazione. |

### 2.2 Che cosa cade — Deciso il 25 settembre 2026 (ADR-003 e ADR-004)

| Era un Vincolo | Che cosa diventa |
|---|---|
| **Nessun account, nessuna registrazione** | Account con email e password, con verifica dell'indirizzo, **per salvare** (ADR-004). Senza account si fanno tutte le attività, ma le risposte vivono solo finché la pagina è aperta: nessun archivio, né nel browser né sul server, e quindi nessun Progresso. Registrandosi alla fine di un'attività, le sue risposte salgono sull'account; chi ha un file esportato lo carica. |
| **Nessun backend** | Un server con un database che conserva le righe **in chiaro**, e che il titolare legge per il supporto e per le statistiche. La banca e le pagine restano statiche su statichost.eu. |
| **Nessuna sincronizzazione** | Le righe si sincronizzano, come **unione per `uid`**. Non è la sincronia che nella 0.4.2 ha cancellato giorni di studio: lì si fondeva lo specchio, cioè stato derivato, e qualcuno doveva vincere; qui si uniscono righe append-only, e nessuno è in conflitto (`fondiArchivio()`, R-STA-03). |
| **Nessun cookie, nessun form** | Per chi ha fatto l'accesso, un cookie di sessione, tecnico, quindi senza banner di consenso. Un modulo di registrazione e di accesso. Chi prova senza account non ha né l'uno né l'altro. |

In più, e non era scritto da nessuna parte perché non serviva: **i dati si
conservano fino a due anni di inattività**, poi, dopo un avviso, si cancellano.

### 2.3 Che cosa si perde

Non sono effetti collaterali: sono il prezzo, e si paga tutto. Le prime tre
perdite toccano chi si registra, la quarta chi non lo fa.

1. **Una garanzia che non dipendeva da nessuno.** «Le risposte non arrivano a
   nessuno» era vero per costruzione: non esisteva un posto dove mandarle, e
   nessun aggiornamento sbagliato poteva cambiarlo. Da adesso, per chi si
   registra, arrivano a un server per scelta, e a tenerle al sicuro restano
   obblighi e promesse — che si possono rompere, anche per errore.
2. **L'anonimato.** A chi si registra il sito sa chi è, perché ha la sua email,
   e sa che cosa ha risposto; il titolare lo può leggere. Sono dati personali
   (non dell'art. 9: niente salute, niente opinioni). Un server violato
   esporrebbe email e storico insieme.
3. **Il non avere niente da custodire.** Un fornitore in più che vede i dati, e
   con lui un accordo da firmare; un registro dei trattamenti; un'informativa con
   una base giuridica; una violazione da notificare entro 72 ore, cioè log per
   accorgersene; una cancellazione che deve cancellare davvero; un server da
   tenere acceso. Prima non c'era niente di tutto questo perché non c'era niente
   da proteggere.
4. **Per chi non si registra, quello che il sito dava a tutti.** Fino a oggi
   chiunque aveva un archivio nel browser, i Progressi, la ripresa dal giorno
   prima, senza chiedere niente. Senza account, da quando arrivano gli account,
   non resta niente oltre la pagina aperta. È la perdita che l'autore ha scelto
   apposta, perché il salvataggio è ciò che l'account offre (ADR-004).

**E un imbuto, più piccolo di quello dell'ADR-003 ma vero:** per salvare bisogna
registrarsi. L'ADR-004 lo sposta dal primo quesito alla fine della prima
attività; non lo toglie.

**Che cosa si compra con questo prezzo:** chi si registra non perde più tutto
cambiando telefono o svuotando il browser — il difetto più grave che il prodotto
aveva verso chi lo usa — e chi scrive per un problema si può aiutare guardando i
suoi dati. E di chi non si registra non resta niente, da nessuna parte.

### 2.4 Come si entra — Deciso il 25 settembre 2026 (ADR-004)

Chi arriva fa il primo quesito **senza account**, con l'offline che funziona
dalla prima visita. L'ADR-003 aveva scelto la registrazione obbligatoria per
usare il sito; l'ADR-004 la sostituisce, perché nessuna delle tre aspettative
dell'ADR-003 la richiedeva e il suo costo cadeva sul primo ingresso (§7.1).

Senza account i Progressi non ci sono, e **non è un ricatto**: sono misure su
uno storico, e senza salvataggio lo storico non esiste. Il ricatto sarebbe stato
salvare le risposte nel browser e nasconderne le misure; è l'alternativa
scartata dall'ADR-004.

Quattro condizioni fanno parte della decisione, e sono R-ACC-02…05 nel §9.9:

1. **Senza account si dice che non resta niente**, prima di cominciare e alla
   fine di ogni attività.
2. **La registrazione si raccomanda con i vantaggi veri, quando c'è qualcosa da
   perdere** — la fine di un'attività — e non a ogni schermata. Nessuna metrica
   si promette sotto le soglie del §4.3.
3. **Senza account non si toglie niente apposta**: tutte le attività, con
   riepilogo e revisione della sessione. Ai registrati restano solo le viste che
   vivono di uno storico.
4. **Un archivio che esiste già non sparisce in silenzio**: chi ha le risposte
   nel browser il giorno del rilascio le porta nell'account o le scarica.

**Deciso il 25 settembre 2026, dall'autore:** chi si registra passa da un
**onboarding**, che raccoglie fra l'altro la data d'esame. La data vi resta
**facoltativa**: lo è per il §7.1 e per R-STA-01 — chi comincia da zero spesso
non ce l'ha, e senza data il motore non inventa quota né semaforo — e un
onboarding non la rende obbligatoria senza una decisione che lo dica. Che
cos'altro chieda, e se il sito consigli un piano di studio strutturato, è
Q-ONBOARD nel §10.

**Deciso il 26 settembre 2026, dall'autore:** senza account nel browser **non
resta niente, nemmeno le preferenze** — filtri, modalità automatica, ordine
della diagnosi. La proposta di tenerle, perché non sono risposte, è stata
scartata: la promessa si legge alla lettera. Restano soltanto la cache del sito,
che non contiene niente di chi studia, e l'archivio di prima degli account
finché chi l'ha non sceglie (R-ACC-05). R-ACC-09. Il come di tutto il §2 sta in
`docs/account-progetto.md`.

### 2.5 Le parti di questo documento riscritte per i due stati

Fino al 30 settembre 2026 questa sezione elencava le parti del documento
**vere solo senza account**, e non le riscriveva perché dipendevano da scelte —
tabelle, sessione, API, statistiche — che spettavano al progetto di
realizzazione. Quelle scelte sono state prese (`docs/account-progetto.md`,
`docs/account-client-progetto.md`) e realizzate (P-09…P-11 il server, P-18 la
pagina), e P-26 ha riscritto le parti per i due stati. Che cosa è cambiato:

- **§3**, a cominciare dal titolo: c'è un backend, e ha una sezione sua (§3.7).
  Il §3.2 non dice più «l'unica copia» — senza account di copie non ce n'è
  nessuna, con l'account ce ne sono due, sul server e nel dispositivo, unite
  per `uid` —, e non dice più che l'app ripiega su `localStorage`. Il §3.3 e il
  §3.4 aggiungono la ricezione dal server; il §3.5 dice che l'API non entra
  nel guscio.
- **§4.5**, i punteggi dei Segnali: non stanno più in `localStorage`, ma in
  memoria senza account e nel profilo sul server con l'account. Non era
  nell'elenco, ed era falso anche lui.
- **§4.6**: il motore continua a non sapere niente degli altri e della prima
  visita; il server e la pagina sanno qualcosa, e si dice che cosa.
- **§5.3 e §5.4**: in quale stato vale ogni attività e ogni controllo, e i
  controlli nuovi dell'accesso.
- **§7.1**, la Rotta: lo stato senza account, e il caso limite dell'archivio
  vuoto, che senza account è la regola e non un caso.
- **§7.4**, Progressi, che è dei soli registrati; **§7.8**, Info, dove
  scaricare e ricaricare non sono più l'unica via di salvataggio.
- **§8**, gli stati trasversali: *Vuoto* e *Interruzione* dicevano che quello
  che è stato risposto è salvato. Senza account non lo è, e la pagina lo dice.
  Nemmeno questo era nell'elenco.
- **Appendice A**: «nessun dark pattern possibile, non c'è un imbuto» — c'è,
  per salvare, e l'appendice dice quali promesse lo tengono onesto.

Restano com'erano, e non sono di questo lavoro, le righe del §5 che descrivono
le sei modalità dei Quiz e il selettore globale: le toglie P-12 con il regime
vecchio dei controlli.

E una cosa che c'è e resta: **il sito dichiara i propri difetti**, quesito per
quesito. È l'unica cosa che nessun concorrente può copiare, ed è il motivo per
cui i 37 oscurati, gli 11 divergenti dal DM 133/2024 e le dieci figure riabbinate
stanno in prima pagina invece che in una nota.

---

## 3. L'architettura: righe che viaggiano, e niente altro

Fino alla v0.28.0 qui c'era scritto «non c'è un backend», ed era vero. Con gli
account un backend c'è (§3.7), ma fa un mestiere solo: **conserva le righe delle
risposte di chi si registra, e le restituisce.** Non seleziona, non calcola
misure, non ha uno specchio. Tutto il resto è ancora un **livello di dati**
fatto di tre oggetti, nel browser e nel motore. Uno solo si salva, e solo con
l'account.

### 3.1 La banca — `site/dati/*.json`, immutabile

È l'Allegato A al DD 131/2022, un atto ufficiale dello Stato. Non si modifica per
convinzione: si annota e si cita la fonte, perché all'esame vale il decreto.

Un quesito (1.722 in `quiz.json`):

```
id   "base-1"          identificatore interno
k    "base" | "vela"   quale banca
t    tema              uno degli 8
v    voce              una delle 44
d    domanda           testo
r    [risposte]        due o tre stringhe
x    indice            quale di `r` è esatta secondo il decreto
p    "1.1.1-1"         progressivo del decreto, quello da citare
f    "figura-007.png"  o null
fm   motivo            perché la figura manca (solo base-59)
osc  1 | null          oscurato dal MIT: non può uscire all'esame
nbp  nota              da mostrare **prima** di rispondere
nb   nota              da mostrare **dopo** aver risposto
```

**`nbp` e `nb` sono due campi e non uno**, e la ragione non va persa: una nota
letta prima della risposta è un suggerimento — tranne quella sull'oscuramento,
che non dice quale risposta sia esatta e cambia che cosa fai *adesso*, perché se
all'esame non uscirà lo salti (0.14.1).

Un esercizio di carteggio (135 in `carteggio.json`): `id` («5.1.3-1», il numero
del foglio), `carta` (5/D o 42/D), `argomento` (correnti, navigazione costiera,
scarroccio, carburante), `famiglia`, `testo`, `risposta_ufficiale`, `tecniche`
(le 12 derivate, **non** ministeriali), `incognita`.

`meta.json` porta i conteggi, le 8 + 44 voci con le loro numerosità, `pesi_esame`
(la composizione delle 20 domande, che è l'Allegato C al DM 323/2021) e `prove`
(base: 20 in 30 minuti, max 4 errori; vela: 5 in 15, max 1).

C'è anche `carteggio_e12.json` — 50 esercizi entro 12 miglia, verificati contro
il PDF — **pubblicato e non usato dall'app**. È materiale nel cassetto, e la
decisione se tirarlo fuori è §10, Q-AMBITO.

### 3.2 L'archivio — una riga per risposta, in due stati

```
_t       'q' quiz · 'c' carteggio · 't' tecnica · 'g' tag · 's' prova sostenuta
uid      identificatore della riga: la fusione all'import avviene su questo
item_id  il quesito o l'esercizio
ts       ISO 8601 con offset **locale** (non UTC: vedi 0.4.5)
ms       tempo impiegato
mode     la modalità in cui è uscito
kind     base | vela
sim_uid  la lista in cui è uscito, quando registrata
correct  1|0   (quiz e tecniche)
verdict  1|0   (carteggio: il giudizio è di chi studia)
delta    sempre null nel carteggio, perché nessuno analizza la tua risposta
```

È **append-only**: non si corregge una riga, se ne aggiunge un'altra.

**Dove vive dipende dall'accesso** (ADR-004; nella pagina da P-18):

- **Senza account, in memoria, e basta.** Le righe della pagina aperta non
  finiscono in IndexedDB, `localStorage`, `sessionStorage`, cookie o Cache
  Storage (R-ACC-09): una ricarica le perde, e la pagina lo dice prima di
  cominciare e alla fine di ogni attività (R-ACC-02). Registrandosi alla fine di
  un'attività, le righe di tutte le attività della pagina salgono sull'account
  (R-ACC-43).
- **Con l'account, sul server e nel dispositivo.** Il server le conserva in
  chiaro, byte per byte (§3.7, R-ACC-12). Il dispositivo ne tiene una copia per
  l'offline, in un database IndexedDB per account, `rg-account-<chiave_locale>`,
  con righe e coda scritte nella stessa transazione (R-ACC-45). Le due copie si
  uniscono per `uid` (R-ACC-06): le righe non si modificano, quindi nessuna è in
  conflitto e nessuna vince. Una riga esce dalla coda solo quando il server la
  nomina (R-ACC-13), e la si dice salvata solo allora (R-ACC-39). All'uscita, la
  copia del dispositivo si cancella (R-ACC-46).

Fino alla v0.28.0 questa sezione diceva «l'unica copia», ed era la ragione per
cui cambiare telefono perdeva tutto. Oggi senza account di copie non ce n'è
nessuna, e con l'account ce ne sono due — ma **nessuna delle due è derivata**:
si uniscono righe, non stati, ed è per questo che non è la sincronia della
0.4.2 (§2.2).

La scelta di IndexedDB è misurata, non dedotta: una riga pesa 192 byte;
`localStorage` sta intorno ai 5 MB in Chrome e Safari, cioè ~27.000 risposte, e
**il modo in cui fallisce è il guasto di casa** — `setItem` lancia, e se nessuno
la prende la risposta sparisce mentre la schermata dice che va tutto bene.
IndexedDB nello stesso browser dichiara 3,7 GB, scrive 30.000 righe in 1,9 s.

**Non c'è più il ripiego su `localStorage`.** Fino alla v0.28.0, se IndexedDB
non si apriva, l'app ripiegava lì e lo dichiarava. Con l'account la copia del
dispositivo sta solo in IndexedDB; se non si apre, l'accesso lo dice, e la
pagina non scrive «salvato sul dispositivo» (`account-client-progetto.md`
§9.2). Senza account non c'è niente da aprire.

**Una riga entra solo se `validaRiga()` la accetta** (R-ACC-07), la stessa
funzione che il server importa dal motore: il browser e il server rifiutano le
stesse righe per gli stessi motivi. Le righe di tag (`_t: 'g'`) scritte prima
del 26 settembre 2026 sono le sole senza `ts`, e fino a quel giorno ogni import
le scartava (R-ACC-08); da P-01 i tag nascono con la data.

**Il database di prima si chiama ancora `open-patente-nautica`**, anche dopo il
rinomino del progetto. È l'archivio che chi studiava prima degli account ha nel
browser: la pagina lo legge soltanto, per proporre di portarlo nell'account o
di scaricarlo, e non lo cancella da sola (R-ACC-05). Rinominarlo farebbe
cercare un database che non c'è, e ogni risposta di prima sparirebbe dalla
proposta **senza un errore**. È l'unica eccezione ammessa al rinomino, ed è
dichiarata da un test.

### 3.3 Lo specchio — in memoria, **non si salva mai**

Per ogni quesito: `n` risposte, `c` esatte, `first` (1 se la prima era esatta),
`s` streak, `lw` giorno dell'ultimo errore, `k` riprese dopo un errore, `t`
giorno dell'ultimo tocco, `avg` tempo medio.

Si ricalcola con `ripiega()` a ogni avvio, dopo ogni import e dopo ogni
ricezione dal server, e un test pretende che coincida con `applica()` risposta
per risposta.

**Questa è l'invariante architetturale del progetto.** Una contabilità sola
dello storico, quindi un numero in schermata e la lista che apre non possono
divergere. Nel progetto originario lo specchio era una seconda copia da fondere
col server, e la fusione perse giorni di studio (0.4.2). Con gli account il
server è tornato, e la regola conta di più: **le righe viaggiano, lo specchio
mai**, in nessuna direzione. Il server non ne ha uno.

### 3.4 Il giro dei dati

```
                    server degli account (righe)            solo con l'account
                        ^ invio, dalla coda   | ricezione, dal cursore
                        |                     v
righe (memoria, o IndexedDB dell'account) --ripiega()--> specchio --coda/mirata/...--> schermata
       ^                                                                                  |
       +----------------------------- archivia(riga) <----------- una risposta -----------+
```

`engine.js` non ha né DOM né `fetch`: gira identico nella pagina, nel server e
sotto `node --test`. La contabilità della coda — che cosa inviare, che cosa
togliere, dove spostare il cursore, che cosa fare di una generazione diversa —
è anche lei nel motore, logica pura (`account-progetto.md` §16.1); la pagina fa
solo il trasporto.

### 3.5 Il guscio offline

Service worker cache-first, perché la banca è immutabile. Due cose che sono già
costate:

- **Il guscio è scritto in due posti** — `GUSCIO` in `sw.js` e in `app.html` — e
  devono restare identici. C'è un test.
- **Gli indirizzi sono quelli puliti, non i nomi dei file**: `/privacy`, mai
  `/privacy.html`. La regola è nata sull'host precedente, Cloudflare Pages, che
  rispondeva **308** al percorso con l'estensione: una risposta rediretta in
  cache **non si può servire a una navigazione**, e la pagina moriva con
  `ERR_FAILED` anche online (0.19.2). statichost.eu serve entrambe le forme con
  200, quindi oggi quel guasto non può succedere — e la regola **resta** per
  questo: è lei che rende il sito indifferente all'host. Due test la tengono
  ferma, e `strumenti/serve.py` riproduce in locale l'host di **oggi**, misurato,
  non quello di ieri.
- **L'API non entra nel guscio.** Sta su un'altra origine, `api.rottagiusta.it`,
  e il service worker ignora le richieste verso le altre origini: nessuna
  risposta dell'API finisce in cache. Senza account la cache contiene il sito e
  la banca, e nessuna risposta di chi studia (R-ACC-09).

Le figure si scaricano con un pulsante, apposta: sono 102 file. **E si scaricano
una volta sola**: a ogni rilascio l'`activate` le copia dalla cache vecchia a
quella nuova prima di cancellarla. Solo le figure, che sono l'Allegato A e non
cambiano; la banca e le pagine si riprendono dalla rete all'install. La cache
resta una sola, perché la pagina la cerca con `startsWith('rg-')` e prende la
prima che trova. Fino alla 0.26.0 le figure si perdevano a ogni rilascio
(R-ARCH-10, R-ARCH-11).

### 3.6 La versione, in tre posti

`VERSION`, `CACHE` in `site/sw.js`, `versione` in `site/dati/meta.json`. Nessuno
la sostituisce al volo: se uno dei tre resta indietro la suite è rossa. Dopo un
rilascio ogni dispositivo prende la versione nuova alla **seconda** ricarica, e
la schermata Info dice quale cache è installata.

Il server degli account legge `VERSION` dal tag che gira e la dice in `GET
/v1/salute`, ma non la scrive nelle pagine: le pagine e il server si aggiornano
in due passi, allo stesso tag (§3.7), e un rilascio fermato a metà li lascia su
due numeri.

### 3.7 Il server degli account — `server/`

Deciso il 25 settembre 2026 (ADR-003, ADR-004); il come è
`docs/account-progetto.md`, e questa sezione ne dice soltanto quello che resta
vero anche quando l'implementazione cambia.

- **Dove.** `https://api.rottagiusta.it`, un'origine separata dal sito, in HTTPS
  dal primo giorno. Una macchina Scaleway nell'Unione europea — la STARDUST1-S a
  Varsavia, decisa dall'autore e creata alla messa in esercizio —, un processo
  Node di una LTS pari, senza dipendenze npm, e un file SQLite con un solo
  scrittore. Le copie di sicurezza vanno in un altro Paese dell'Unione, e il
  ripristino è provato (R-ACC-20, R-ACC-24).
- **Che cosa conserva.** Gli account (l'email, e la password solo come
  impronta Argon2id: R-ACC-16), le sessioni, le righe delle risposte **in chiaro**, il
  profilo — data d'esame e punteggi dei Segnali —, e un registro di sicurezza.
  Il titolare le legge per il supporto e per le statistiche; niente esce verso
  script di terzi (§2.1).
- **Che cosa non fa.** Non seleziona quesiti, non calcola misure, non ha uno
  specchio. Accoglie righe che `validaRiga()` — **importata da
  `site/engine.js`** — accetta, e le restituisce com'erano. Una seconda copia
  delle regole in un altro linguaggio sarebbe la riga con `ts: "boh"` della
  0.4.6, accettata dal server e fatale su ogni dispositivo.
- **Come si aggiorna.** Sulla macchina gira soltanto un tag pubblicato di questo
  repo, lo stesso delle pagine; codice e database tornano indietro
  separatamente; lo schema cambia solo per aggiunte
  (`account-progetto.md` §2.7).
- **Come si prova.** La quinta suite, `tests/test_server.mjs`, avvia il server
  nello stesso processo su un database temporaneo, con l'orologio e la posta del
  test; `node server/ripristina.mjs --prova` fa il giro della copia. I
  requisiti del server stanno nel §9.9.

---

## 4. Il motore: contratti, non funzioni

Questo non è l'elenco delle funzioni — quello sta nei commenti di `engine.js`,
che sono insolitamente ricchi. Qui ci sono **le cose che restano vere anche
quando l'implementazione cambia**. Se una riga di qui contraddice il codice, ha
ragione il codice.

### 4.1 Due contabilità della stessa cosa, e non è un errore

**Per la selezione** bastano due stati (`stato()`): `nuovo`, `chiuso`.

**Per la copertura** ce ne vogliono tre (`classifica()`), e la proprietà che li
tiene onesti è che **sommano al totale**:

- `mai_visto` — mai risposto
- `coperto` — l'ultima risposta era esatta
- `da_ripassare` — l'ultima risposta era un errore

Con due soli stati un quesito preso male conterebbe come coperto, e il buco
sparirebbe dentro il numero verde (0.6.0). **Chi disegna una barra di
avanzamento usa i tre, non la percentuale sola.**

### 4.2 Il catalogo: sei mestieri, non sei varianti

| Funzione | Mestiere | Guarda lo storico? |
|---|---|---|
| `coda()` | filtro + ordine generici: banca, temi, voci, stati, solo sbagliate, solo da rifare, solo con figura | sì |
| `estrai()` | pescata **cieca**, come il ministero | **no, di proposito** |
| `estraiNuoviPrima()` | esplorazione: prima i mai visti | sì |
| `simulazione()` / `simulazioneVela()` | composizione ministeriale, **esclusi i 37 oscurati** | no |
| `screening()` | n quesiti da **ognuna** delle 44 voci | sì |
| `mirata()` | sessione consigliata: richiami, esplorazione pesata sulla resa, conferme | sì |
| `provaCarteggio()` | la prova di carteggio: un esercizio per argomento, il completamento dichiarato su una banca che ne manca uno, argomenti rappresentati e mancanti, carte, e le condizioni di `PROVA_CARTEGGIO` | **no, di proposito**; sì nella variante «prima i mai provati», che dichiara le riprese per argomento |
| `giroTecniche()` | copertura greedy delle 12 tecniche di carteggio | sì (a parità preferisce i mai fatti) |
| `tappeto()` | i prossimi n esercizi mai fatti, nell'ordine del foglio | sì |
| `daAllenare()` | che cosa mi manca sotto una restrizione qualunque: la lista **e** l'arretrato, dalla stessa fonte | sì |

**Due funzioni di estrazione e non una** perché sono due mestieri: una prova che
ti serve solo quesiti mai visti misura quanto è vergine il foglio, non il voto
che prenderesti.

**Prima di semplificare una di queste, si elencano i chiamanti e si dice che cosa
cambia per ciascuno.** È una regola nata da un caso vero: la semplificazione di
`estrai()` nella 0.5.1 era giusta per la simulazione e sbagliata per lo
screening, che tornò a pescare a caso.

`daAllenare()` restituisce **due** numeri che non vanno confusi: `lista` è tutto,
in ordine di priorità, perché una batteria non deve restare a corto di domande;
`daFare` sono i soli primi due gruppi (aperte + mai visti), cioè `rimanenti` di
`traccia()`. Chi disegna scrive `daFare` come «da fare» e la differenza come
ripasso.

**Due liste di errori, e non una** (dal 29 settembre 2026, P-41).
`soloSbagliate` apre tutti gli errori di sempre, anche quelli già ripresi: è il
«Ripasso degli errori» dei Quiz, e sbagliare una volta non scade (0.5.1).
`soloDaRifare` apre soltanto quelli la cui **ultima** risposta è sbagliata —
il segmento «da rifare» della mappa di Progressi, contato da `classifica()`
come la barra — ed è il «Rifai N errori» di Q-DUE. Il secondo apre gli N **per
contratto**: con il primo e un tetto a N si otterrebbero gli stessi N solo
perché le riprese stanno in fondo, e il primo tetto diverso le rimescolerebbe
dentro. Le due liste hanno lo stesso ordine; cambia chi ci entra.

Tutte le selezioni con seme sono **deterministiche**: stesso storico e stesso
giorno, stessa lista.

### 4.3 Le misure, con le loro soglie dichiarate

| Funzione | Che cosa dà | Soglia dichiarata |
|---|---|---|
| `diagnosi()` | per tema e per voce: visti, esatte **alla prima risposta**, sbagliati, **aperti**, tempo medio, copertura, costo in domande d'esame | — |
| `quadro()` | la mappa di Progressi: per tema e per voce giusti, da rifare, mai visti, visti, e «X su Y giusti al primo tentativo»; la selezione di «Rifai N errori» | `primo` è `null` sotto `PRIMA_MIN_VISTI = 5` quesiti distinti visti nella riga |
| `dovePesa()` | la frase in cima a Progressi: un tema, il motivo, i pulsanti con le loro selezioni — oppure niente, e perché | almeno `FRASE_MIN_VISTI = 20` quesiti distinti visti, le domande di una prova base; e mai sulla vela |
| `traccia()` | copertura nei tre stati, rimanenti, quota, giorni, semaforo | **senza data d'esame `quota` e `giorni` sono `null` e il semaforo è `attesa`** |
| `semaforo()` | verde/giallo/rosso sull'atteso lineare | l'inizio è **il giorno della prima risposta**, non «oggi» |
| `stimaImpegno()` | ore e minuti al giorno | sotto `MIN_MISURATE = 30` usa `RIPIEGO_MS = 15000` **e lo dichiara** |
| `tendenza()` | la freccia ↑ → ↓ | almeno **2 giorni** e **10 risposte** |
| `lunghezzaPartita()` | quante domande ha una partita dei Segnali | `min(10, pool)` |
| `lunghezzaScreening()` | quante domande apre uno screening a *n* per voce | somma dei `min(n, quesiti della voce)`: **non** `n × 44` |

**Ogni soglia esiste perché un numero calcolato sotto quella soglia è rumore con
l'aria di essere una misura.** Chi disegna non può abbassarle per far comparire
prima una tessera: comparirebbe una tessera che mente.

**La mappa di Progressi** (Q-DUE, §10; motore da P-41, 29 settembre 2026).
`quadro()` dà una riga per tema, nell'ordine di `diagnosi().temi` — peso
d'esame, poi dimensione: non si muove con lo storico —, con il suo `peso` e le
sue voci in ordine di banca. Sulla vela le tre voci fanno da righe, con
`peso: null`: un peso per voce non esiste, e non si inventa. I tre stati,
`giusti`, `daRifare`, `maiVisti`, sono quelli di `classifica()` letti
all'ultima risposta, sommano a `n`, e i primi due fanno `visti`. «X su Y» è
`primo: { esatte, su }`, interi esatti con `su` uguale a `visti`, e sotto soglia
`null`: le esatte alla prima risposta non si espongono da sole, così non c'è
niente da scrivere per sbaglio. Ogni riga porta `filtro`, le opzioni di
`coda()` che la restringono, e `rifai`, la selezione di «Rifai N errori»
**senza tetto** — il tetto predefinito di `coda()` è 20, e «Rifai 35 errori»
ne aprirebbe 20 in silenzio. Le righe si costruiscono sugli aggregati di
`diagnosi()`: nessuna seconda contabilità.

**La frase in cima** la decide `dovePesa()`, su fatti e non su stime. Per ogni
tema, *in ballo* = domande d'esame × (da rifare + mai visti) / quesiti del
tema: quanta parte del tema non hai preso giusta all'ultima risposta, pesata
da quanto vale all'esame. **Non è una previsione** di quante ne sbaglierai, e
per questo non presta alla parte mai vista una debolezza che non si è misurata,
come faceva `consigli()`, uscita dal motore. Vince il valore più alto, confrontato in interi. Il
motivo è la parte più grossa — «da rifare» se gli errori sono almeno quanti i
mai visti, altrimenti «mai visti» —; i pulsanti sono prima quello del motivo,
poi l'altro, mai uno da zero, e ciascuno porta `quanti` e la selezione che
apre esattamente quelli. La frase non c'è, e `assente` dice perché, in quattro
casi: `senza pesi` (la vela, o i pesi mancanti), `sotto soglia`, `niente da
fare`, `pari` — due temi in testa con lo stesso valore, dove sceglierne uno
sarebbe l'ordine dell'elenco travestito da consiglio. Niente minuti (punto 7).

**Confermate dall'autore il 29 settembre 2026** le tre scelte che P-41 aveva
preso su delega: la vela non ha la frase, perché un peso per voce non esiste;
la soglia è `FRASE_MIN_VISTI = 20`, le domande di una prova base; il motivo è
«da rifare» quando gli errori sono almeno quanti i mai visti.

**Misurato il 30 settembre 2026 (P-44), da sapere e non da decidere:** con i
pesi del decreto, chi ha visto 20 quesiti e più **senza toccare né Navigazione
né Manovra** non ha la frase, per `pari`. I due temi valgono 4 domande
ciascuno, e interamente mai visti sono in ballo per 4 × 322 / 322 = 4 × 155 /
155 = 4: nessun altro tema può superarli, e fra loro due la regola non sceglie.
Riprodotto con 25 risposte nei COLREG: `assente: 'pari'`; con le stesse 25 in
Navigazione, la frase indica Manovra. È la regola confermata qui sopra che fa
il suo lavoro — scegliere uno dei due sarebbe l'ordine dell'elenco —, e la
mappa sotto resta leggibile; se l'autore volesse una frase anche lì, sarebbe
una decisione nuova su `dovePesa()`. L'ha trovato il banco della pagina,
provato contro sé stesso: con i pesi veri al posto dei suoi, scambiati, il suo
storico dava `pari`, e la premessa «lo storico ha una frase» è diventata rossa.

**`peggiori()` e `consigli()`, i chiamanti e che cosa ne è stato** (P-41).
`peggiori()` non aveva chiamanti in pagina dal 9 settembre 2026 — era fra gli
orfani dichiarati, in attesa di Q-DUE — e nel motore la citavano soltanto i
suoi test e il commento di `consigli()`. Non serve alla frase: conta gli errori
alla **prima** risposta, che ripassando non calano, mentre la mappa legge
l'ultima. **È uscita dal motore**, con i suoi due test e la riga fra gli
orfani; il test del liscio della diagnosi è rimasto, senza di lei.
`consigli()` aveva un chiamante, «Cosa studiare adesso» in Progressi, e con
lei `CONSIGLIO_MIN_VISTI`. Non serve alla frase — presta una debolezza alla
parte mai vista, e calcola minuti — e Q-DUE ha tolto la sua lista dalla pagina.
**È uscita anche lei, in due tempi**: la realizzazione dell'area 5 (P-23, 30
settembre 2026) ha tolto la chiamata e l'ha spostata fra gli orfani dichiarati
di `docs/eccezioni-interfaccia.md`, con il motivo «esce»; lo stesso giorno P-47
ha contato i chiamanti rimasti — nessuno in `site/`, nessuno in `server/`,
soltanto i suoi sette test — e l'ha tolta dal motore, con `CONSIGLIO_MIN_VISTI`,
i sette test e la riga fra gli orfani. Il suo liscio, `(errori + 1) / (visti +
3)`, resta nella `debolezza` di `diagnosi()`, che la Mirata usa; lo tiene il
test del liscio, come per `peggiori()`.

### 4.4 Le sessioni sono derivate, non registrate

`sessioni()` ritaglia le righe in liste **a posteriori**. Di norma il confine è
registrato (`sim_uid`); per le righe senza legame si ricostruisce, e la sessione
si chiude quando cambia `sim_uid`, cambia modalità o banca, passano più di 20
minuti, oppure **ricompare un quesito già uscito**.

**Due confini, scelti per nome** (dal 26 settembre 2026, P-30). Quello **per
pausa** è il predefinito e applica le quattro regole anche alle righe con il
legame: lo usa `ritmo()`, perché misura il passo fra due risposte e una pausa
dentro un gruppo lo falserebbe. Il suo prezzo è che un'attività ripresa dopo
20 minuti esce in due gruppi **con lo stesso id**. Quello **dell'attività**
(`confine: 'attivita'`) tiene insieme tutte le righe di un `sim_uid`, oltre la
pausa e anche intrecciate con un'altra attività, e ogni id compare una volta;
le righe senza legame si ricostruiscono come nell'altro, e lo dichiarano. È il
confine di un riepilogo, di una revisione e di `erroriSessione()`, che non ne
accetta un altro. Un `sim_uid` che raccoglie un quesito ripetuto, due modalità
o due banche non è una lista che il runner possa scrivere: si dichiara
`ambigua` con i suoi motivi, e non riapre niente. Un confine sconosciuto è un
errore, non un ripiego.

**Non esiste, in nessun punto del prodotto, una sessione prospettica**: un
obiettivo dichiarato in anticipo, con una dimensione e uno stato di avanzamento
da riprendere. Derivare invece di registrare è ciò che ha fatto comparire 15
sessioni sullo storico già esistente il giorno in cui la funzione è stata
scritta, senza migrazione e senza uno stato da riparare (0.13.0).

Una lista **in memoria** durante l'attività esiste già ed è la forma giusta:
`S.run` porta coda, indice ed esiti, e si distrugge alla chiusura. La linea da
non passare è la **persistenza**: «continua ad allenarti» avvia una selezione
nuova, non ripristina la precedente.

**Il ciclo che si chiude sta sopra questo, e non lo cambia** (area 3,
`docs/area-3-progetto.md` §§4–7; controlli da P-31, 26 settembre 2026). Il
riepilogo di un'attività e la sua riprova leggono l'attività **intera**, con il
confine dell'attività e per id — mai «l'ultima sessione», mai le risposte che
cadono nello stesso orario —, e il confine ricostruito si dichiara. Il
riepilogo conta risposte, corrette, errate e non affrontate dalle righe di
quell'attività; le non affrontate non sono errori e non entrano nella riprova.
«Riprova questi N» è un'**istantanea** di `erroriSessione()`, presa al
riepilogo: l'anteprima e Inizia la riaprono solo se i dati danno ancora gli
stessi errori, e altrimenti non avviano niente finché chi studia non riapre.
La riprova è un'attività nuova, con un `sim_uid` nuovo, `mode: 'sbagliate'` e
senza timer: il tentativo di prima resta com'era. Anche l'istantanea vive solo
in memoria, come `S.run`: dopo una ricarica non si riprende.

### 4.5 Le due eccezioni

**Il carteggio non si corregge da solo.** L'app mette la risposta ministeriale
accanto alla tua e sei tu a giudicare; `delta` resta `null`. Le risposte ufficiali
contengono già la tolleranza come intervallo, quindi un confronto automatico si
potrebbe scrivere: non c'è perché sbaglierebbe dicendo «errato» a una risposta
giusta scritta in un altro formato, **sulla prova che manda a casa**.

**Il gioco dei Segnali non entra nell'archivio.** Ha un runner suo; restano solo
migliore e giocate per modalità. Senza account valgono per la pagina aperta; con
l'account stanno nel profilo sul server, fusi con il massimo così che rimandarli
non cambi niente, e viaggiano nel file dei progressi (R-ACC-35). Fino alla
v0.28.0 stavano in `localStorage`.

### 4.6 Che cosa il motore **non** sa

È la sezione da leggere prima di proporre una schermata.

- **Non sa che cosa hai studiato fuori dal sito**, e per decisione condivisa non
  lo chiederà. Conseguenza diretta: non può distinguere *sbagliato perché non
  l'ho ancora studiato* da *sbagliato pur avendolo studiato*. Sono la stessa riga.
- **Non ha il programma d'esame.** Ha la tassonomia della banca (8 temi, 44 voci)
  e `pesi_esame`. Una mappa del programma richiede un dataset che non esiste nel
  repo.
- **Non conosce l'ordine delle prove d'esame.** I parametri della prova di
  carteggio — 4 esercizi, 60 minuti, 3 su 4, DM 323/2021 art. 6 c. 6 — li porta
  `PROVA_CARTEGGIO` dal 30 settembre 2026 (P-32), insieme alla composizione per
  argomento, che resta un'assunzione (Q-CART4); `meta.prove` conosce solo base e
  vela.
- **Non sa niente degli altri utenti.** Nessuna calibrazione, nessuna media,
  nessun confronto: la difficoltà di un quesito è solo la tua. Con gli account
  il **server** ha le righe di tutti i registrati, e il titolare le legge per le
  statistiche (`account-progetto.md` §15.2); il motore no, e riceve soltanto
  le righe di chi è entrato. Mostrare a chi studia qualcosa degli altri — una
  media, un confronto — è una decisione dell'autore ancora aperta
  (`account-progetto.md` §20).
- **Non ha un budget di tempo.** Non sa quanti minuti hai oggi.
  `stimaImpegno()` stima quanto **costa** ciò che resta, non quanto puoi fare.
- **Non giudica il carteggio.**
- **Non sa se sei alla prima visita.** Un archivio vuoto è indistinguibile da un
  archivio cancellato o aperto in un altro browser. La pagina sa soltanto se
  sei entrato: senza account le righe sono solo quelle della pagina aperta, e
  ogni visita comincia vuota **per costruzione** — anche quella di chi ha mesi
  di risposte nel suo account e non ha ancora fatto l'accesso. Con l'account,
  un archivio vuoto non prova che l'account sia nuovo.

### 4.7 Il confine con l'interfaccia

**Chi disegna non ricalcola.** Se serve un numero che il motore non espone, si
chiede un export nuovo invece di rifare il conto in pagina. È la regola «un
numero promesso e la lista che si apre vengono dalla stessa fonte» vista
dall'altro lato.

Il precedente: `daAllenare()` è vissuta in `app.html` dalla 0.16.0 al 9 settembre
2026 — l'ultima selezione fuori da `engine.js` — e in quel periodo **non era
coperta da nessun test**, perché la suite del motore non esercita `app.html`.
Ora sta nel motore con i suoi sette test.

```
site/engine.js    tutta la selezione e tutte le statistiche. Logica pura.
                  Se una regola di scelta o un numero derivato non è qui, è nel
                  posto sbagliato.
site/app.html     una pagina sola: DOM, archivio, runner, disegno.
site/index.html   la vetrina, fuori dal guscio offline.
```

---

## 5. Inventario: che cosa esiste, e dove ci si arriva

**Questa è la tabella la cui assenza ha fatto sparire una schermata.** Una
funzionalità che non è qui non esiste; una che è qui e non ha un ingresso è un
difetto, non una scelta.

Colonna «ingresso»: **come ci si arriva partendo da zero**, non dove vive il
codice.

### 5.1 Le pagine

| Funzionalità | Vive in | Ingresso | Requisito |
|---|---|---|---|
| Vetrina | `site/index.html` | `/` — è la pagina che deve comparire nelle ricerche | R-NAV-01 |
| Palestra | `site/app.html` | `/app`, e dal pulsante della vetrina | R-NAV-01 |
| Privacy, Avvertenza | file propri | piè di pagina di ogni schermata | R-ARCH-06 |

### 5.2 Le schermate della palestra

| Schermata | id | Ingresso oggi (v0.22.1) | Requisito |
|---|---|---|---|
| Rotta (già *Oggi*) | `v-oggi` | barra, prima voce | R-NAV-02 |
| Quiz (già *Allenamento*) | `v-quiz` | barra | R-NAV-02 |
| Carteggio | `v-cart` | barra | R-NAV-02 |
| Progressi (già *Diagnosi*) | `v-diag` | barra | R-NAV-02 |
| Che tecnica serve? | `v-tec` | barra — **ingresso perso sul ramo `ui/main`** | R-NAV-03 |
| Il gioco dei segnali | `v-seg` | barra | R-NAV-03 |
| Info e diagnostica | `v-info` | barra | R-NAV-04 |

### 5.3 Le attività

**Tutte, in tutti e due gli stati** (R-ACC-04), ognuna fino al suo punto
d'arrivo, con riepilogo e revisione. L'ultima colonna dice se l'attività scrive
righe: senza account restano nella memoria della pagina aperta, con l'account
vanno nella copia del dispositivo e sul server (§3.2).

| Attività | Dove | Motore | Scrive righe |
|---|---|---|---|
| Mirata | Quiz | `mirata()` | sì, `mode` proprio |
| Per argomento | Quiz | `daAllenare()` + `coda()` | sì |
| Solo sbagliate | Quiz | `coda({soloSbagliate})` | sì |
| Simulazione d'esame (base, vela, completa) | Quiz | `simulazione()`, `simulazioneVela()` | sì, più una riga `_t:'s'` |
| Screening completo | Quiz | `screening()` | sì |
| Batteria | Quiz | `daAllenare()` | sì |
| Prova di carteggio | Carteggio | `provaCarteggio()`, cieca, o «prima i mai provati» come variante; la pagina compone ancora con `componiProva()`, identica per test, fino alla realizzazione dell'area 4 | sì, `_t:'c'` |
| Giro delle tecniche | Carteggio | `giroTecniche()` | sì |
| A tappeto | Carteggio | `tappeto()` | sì |
| Che tecnica serve? | schermata propria | selezione per tecnica | sì, `_t:'t'` |
| Gioco dei Segnali (4 modalità) | schermata propria | `domandeSegnali()` | **no**, e §4.5 dice perché |

### 5.4 I controlli e i riscontri

| Cosa | Dove | Nota |
|---|---|---|
| Selettore «solo domande mai fatte» | in cima a Quiz | Ignorato da simulazione e screening, **e lo dichiara** |
| Filtro «solo quesiti con figura» | Quiz → Per argomento | Si spegne da solo su una banca che non ne ha, col perché scritto |
| Spunte argomenti, spunte voci | Quiz | Più voci insieme; per la vela le spunte viaggiano come `voci`, non `temi` |
| Banca base / vela, quante | Quiz | |
| Data d'esame | Rotta | Facoltativa. Senza, `quota` e `giorni` sono `null` e il semaforo è `attesa`. Senza account vale per la pagina aperta; con l'account sta nel profilo sul server, e dopo la registrazione si propone senza salvarla da sola (R-ACC-55) |
| Tessere di copertura a tre stati | Rotta, con l'account | La barra è impilata: il buco sta *dentro* la barra. Senza account nessuna copertura cumulativa: non c'è uno storico da coprire |
| La mappa per tema, e «Dove pesa di più adesso» | Progressi, con l'account | `quadro()` e `dovePesa()`, attraverso il raccordo del §10.1 di `area-5-progetto.md`: una riga per tema con la barra a tre stati, le voci al tocco, «Rifai N errori», e in cima la frase solo quando il motore la dà (R-MAPPA-14…17). Al suo posto c'erano «Cosa studiare adesso», `consigli()`, e le due tabelle *Per tema* e *Per voce*: uscite dalla pagina con P-23, e `consigli()` dal motore con P-47. «Le tue voci più deboli», `peggiori()`, era uscita il 29 settembre 2026 |
| Barrette dell'andamento | Progressi | `serieGruppi()`, `tendenza()` |
| «Le sessioni che hai fatto» | Progressi | `sessioni()`; ogni riga si riapre. Progressi è dei soli registrati (§7.4) |
| «Che cosa non torna, e lo diciamo» | Rotta | I numeri si contano dalla banca caricata |
| Scarica / ricarica / azzera i progressi | Info | Con l'account: scaricare è l'export del server, e dice quante risposte da inviare non contiene (R-ACC-56); ricaricare porta un file nell'account, con l'anteprima dei conteggi del motore (R-ACC-50); azzerare chiede la password e vale su tutti i dispositivi (R-ACC-15). Senza account: si scaricano o si azzerano le risposte della pagina aperta, e un file non si carica. In tutti e due, un import dice quante righe ha preso, quante aveva già, **quante ha scartato** |
| Accedi / Account | intestazione, e da Info | «Accedi» senza account, «Account» con: email, verifica, stato dell'invio, data d'esame, trasferimenti, uscita, azzeramento, cancellazione |
| «Senza account non resta niente» | accanto a ogni avvio senza account, e nel riepilogo | R-ACC-02 |
| L'invito a registrarsi | nel riepilogo di un'attività senza account, e in nessun altro posto | Con i vantaggi che esistono; «Continua senza account» lo chiude (R-ACC-03) |
| L'archivio di prima degli account | Rotta, prima delle attività, e Info | Le risposte trovate nel browser si portano nell'account o si scaricano; non si cancellano da sole (R-ACC-05) |
| Lo stato dell'invio | Account e Info | Da inviare, in corso, confermate, non accolte con il motivo: dalla coda del motore, non da un conto della pagina |
| Autodiagnosi offline | Info | Apre ogni voce del guscio e guarda che sia *servibile*, non che la chiave esista |
| Pallino ambra dei guasti | sulla voce Info, visibile da ogni schermata | R-STA-05 |
| Tag N/L/C sugli errori | runner e riepilogo | Un tag per tentativo |
| Revisione di una sessione | riepilogo di ogni attività; con l'account anche Progressi e Carteggio | La tua risposta accanto a quella esatta. Senza account si rivedono le attività della pagina aperta |
| Spiegazioni in schermata (`?`) | Rotta | Funzionano col mouse **e al tocco** |

---

## 6. La navigazione

### 6.1 Che cosa è deciso

**Deciso l'8 settembre 2026.** Il Carteggio è un **ambiente autonomo** nel quale
si entra apposta, ed è una parte fondamentale della preparazione: ha un accesso
nella navigazione principale e rilievo nella Rotta. Il ruolo preliminare del
carteggio rispetto ai quiz va **spiegato**, non scoperto tardi — ma **senza
blocco artificiale**: l'ordine dell'esame e la libertà di prepararsi in parallelo
restano distinti.

**Deciso il 9 settembre 2026.** Il gioco dei Segnali è un **extra originale** del
progetto, e l'identità può accogliere in futuro altre attività dello stesso tipo.

**Deciso il 9 settembre 2026.** La direzione estetica chiara è confermata, e il
risalto attuale del Carteggio è adeguato.

### 6.2 Che cosa non è deciso, e sta già cambiando

**Aperto — decide l'autore.** Le destinazioni della barra. Le specifiche
registrano quattro destinazioni (Rotta / Quiz / Carteggio / Progressi) come
*proposta da provare nelle bozze*, non come struttura decisa; il ramo `ui/main`
le ha **già implementate**.

Va scritto perché è il caso da cui nasce questo documento: **una struttura di
navigazione è entrata nel codice prima di entrare in una decisione**, e con lei
sono uscite due cose che nessuno ha deciso di togliere (§9, R-NAV-03 e R-NAV-05).
Non è una colpa dell'implementazione: è quello che succede quando l'unico posto
in cui una struttura è scritta è il file che la disegna.

### 6.3 Gli invarianti, qualunque struttura si scelga

Questi valgono con quattro destinazioni, con cinque, e con qualunque altra cosa.

- **Ogni schermata ha almeno un ingresso.** Una vista senza porta è codice morto
  che sembra vivo.
- **Una stanza, una porta principale.** Un secondo accesso a una stessa attività
  non è un difetto, ma deve aprire *la stessa schermata*, con lo stesso titolo e
  lo stesso ritorno. Due strade con intestazioni diverse sono due gerarchie.
- **Non due classifiche concorrenti di «cosa fare adesso».** Ce n'erano due —
  «Le tue voci più deboli» in Rotta e «Cosa studiare adesso» in Progressi. Q-DUE
  (§10) le ha tolte tutte e due: resta, al massimo, la frase in cima a
  Progressi.
- **I guasti non possono essere visibili soltanto dopo aver aperto Info.**
- **Non ridurre il testo per far entrare la navigazione.** A 375 px sette voci da
  54 px stavano senza sbordamento: è il limite già toccato. Le etichette restano
  parole intere; se non entrano, sono troppe le voci.
- **Gli extra non stanno dentro la mappa della copertura.** Un'attività che non
  scrive in archivio, messa fra quelle che ci scrivono, suggerisce che il suo
  punteggio sia copertura.

---

## 7. Le schermate

Il modello è quello di `dev-standards`, `references/specifiche.md`. Dove una voce
non si applica, è scritto perché.

### 7.1 Rotta

**Scopo.** Rispondere a «che cosa faccio adesso» senza chiedere a chi arriva di
saper già leggere un cruscotto.

**Ci si arriva da.** L'apertura dell'app, il marchio, la prima voce della barra,
la vetrina.

**Cosa si vede.** Un'attività consigliata con la sua motivazione e il numero di
quesiti che apre; la scelta libera; una sintesi dei progressi che rimanda al
dettaglio senza occupare il posto dell'azione; il riquadro dei difetti
dichiarati; in fondo, dove restano i progressi — senza account da nessuna
parte, con l'account nel tuo account e in questo dispositivo.

**Stati.** Quello d'accesso viene prima degli altri, e non li sostituisce.
- *Senza account*: tutte le attività, e l'avviso che non resta niente accanto
  all'avvio (R-ACC-02). **È lo stato *archivio vuoto* per costruzione**, a ogni
  apertura: niente copertura cumulativa, diagnosi, andamento, sessioni di prima,
  quota o semaforo da storico, perché uno storico non c'è. Il motore può usare
  le righe della pagina aperta per scegliere l'attività dopo; questo non le
  rende uno storico (`account-client-progetto.md` §3.2).
- *Archivio di prima trovato*: l'avviso di passaggio viene prima delle attività,
  anche con l'accesso fatto (R-ACC-05).
- *Con l'account*: gli stati qui sotto, sulle righe dell'account.
- *Archivio vuoto*: orientamento, **non** una diagnosi a zero. Con archivio vuoto
  e senza data, il prodotto v0.22.1 mostrava tre zeri, «1722 quesiti rimasti ·
  7 h 11 m» e due pulsanti da 1472 e 250: nessuna misura che si muova e nessun
  traguardo più vicino di sette ore.
- *Dati parziali*: poche osservazioni sulle risposte, dichiarando che non è una
  diagnosi completa.
- *Senza data d'esame*: niente quota, niente semaforo, niente «sei indietro» — e
  **nessun numero inventato al loro posto**. Il traguardo è locale: la selezione
  avviata, poi il riepilogo. Non chiamarlo «quota giornaliera raggiunta».
- *Con data*: quota, ritmo e semaforo rispetto alla scadenza. Senza account la
  data vale per la pagina aperta, e non accende misure da storico.
- *Errore di salvataggio*: avviso esplicito **prima** delle attività.

**Cosa si può fare.** Avviare l'attività consigliata → runner. Scegliere
liberamente → Quiz o Carteggio. Aprire un extra. Leggere i progressi → Progressi.
Mettere o togliere la data d'esame.

**Casi limite.** Senza account ogni visita sembra la prima, e la pagina non può
sapere se lo è: chi ha mesi di risposte nel suo account e non è ancora entrato
vede la stessa Rotta di chi arriva adesso. Per questo «Accedi» sta
nell'intestazione, e l'archivio di prima, se c'è, si propone da sé. Con
l'account, un archivio vuoto non prova che l'account sia nuovo: offrire anche
l'importazione di un file. Se esistono progressi, non trattare la persona come
un nuovo candidato.

**Accessibilità.** Le spiegazioni `?` funzionano col mouse **e al tocco** — un
aiuto che esiste solo in hover, su un telefono, non esiste. Si chiudono con Esc.

**Come deve sentirsi chi la usa.** Orientato, non misurato. Alla prima apertura
questa schermata decide se una persona resta.

### 7.2 Quiz

**Scopo.** Allenarsi sui 1.722 quesiti, scegliendo l'ambito.

**Cosa si vede.** Le sei modalità (§5.3), i controlli di ambito e quantità, e
**prima di Inizia** quanti quesiti apre la selezione corrente.

**Stati.** *Selezione vuota*: spiegare il motivo e offrire di modificarla — mai
un pulsante che non produce niente. *Filtro che azzera*: il conteggio lo dice
prima, non dopo.

**Casi limite.** La vela non ha temi: le spunte viaggiano come `voci`. Una banca
senza quesiti con figura spegne il filtro figure da sola, col perché scritto.

**Come deve sentirsi chi la usa.** In controllo: due tocchi e parte.

### 7.3 Carteggio

**Scopo.** Preparare la prova eliminatoria in un ambiente dedicato.

**Cosa si vede.** Tre porte distinte, con il **materiale necessario dichiarato
prima di iniziare**: esercizi con carte e strumenti, riconoscimento delle
tecniche (senza carte, con i suoi limiti espliciti), prova di carteggio.

**Vincolo.** All'ingresso dell'ambiente, **prima** dell'avvio, va detto che il
giudizio della prova è di chi studia. È la cosa che più sorprende chi arriva, e
non deve arrivare alla consegna.

**Stati.** *Foglio finito* nel tappeto: dirlo, non spegnere il pulsante in
silenzio.

**Casi limite.** La carta 42/D non ha **nessun** esercizio di carburante, quindi
la regola «un esercizio per ciascuno dei quattro argomenti» non potrebbe reggersi
su una carta sola. È un'assunzione, non una regola del decreto (§10).

**Come deve sentirsi chi la usa.** Come al tavolo, non davanti a un quiz.

### 7.4 Progressi

**Scopo.** Rispondere a «ho affrontato tutto?», «dove ho difficoltà?» e — con
collegamenti, non con una seconda classifica — «che cosa faccio adesso».

**Per chi.** Per chi ha un account (ADR-004): i Progressi sono misure su uno
storico, e senza salvataggio lo storico non c'è. Senza account la vista non
diventa un cruscotto di zeri né un pulsante bloccato: dice perché non c'è, e
porta al Percorso o ad Accedi (R-ACC-04, `account-client-progetto.md` §3.2).
Non è un ricatto: il ricatto sarebbe salvare le risposte e nasconderne le
misure, ed è l'alternativa che l'ADR-004 ha scartato.

**Cosa si vede.** Copertura, difficoltà osservate e risultati delle prove,
**separati**. L'andamento nel tempo. Le sessioni, riapribili. Tutto dalle righe
dell'account, comprese quelle arrivate da un altro dispositivo: dopo una
ricezione la vista si ridisegna dallo stesso specchio nuovo.

**Vincolo.** Copertura e risultati non si presentano come padronanza
dell'argomento. Con dati insufficienti si dice; con dati assenti non si mostra
preparazione positiva. Le soglie del §4.3 non si abbassano per far comparire
prima una tessera.

**Casi limite.** «Poco esercitato» ed «errori osservati» possono coesistere, e
l'app **non sa perché** si sbaglia: si usano descrizioni come «poche domande
viste qui» ed «errori nelle risposte», mai una diagnosi sulle cause.

**Difetto chiuso, dalla 0.3.0 al 30 settembre 2026.** Le tabelle *Per tema* e
*Per voce* sforavano di 89 px a 375 px. P-23 le ha tolte, con la mappa a schede
al loro posto, e il suo collaudo misura 0 px di sbordamento a 375 px (voce nel
CHANGELOG). Che le tabelle non tornino lo tiene R-MAPPA-14; lo sbordamento
della mappa non lo ripete nessun controllo, ed è R-MAPPA-17.

### 7.5 Il runner dei quiz

**Cosa si vede.** Il numero del quesito del decreto sopra la domanda; la domanda;
le risposte ancorate in fondo, sotto il pollice. La nota `nbp` **prima** di
rispondere, la `nb` **dopo**.

**Cosa si può fare.** Rispondere col tocco o coi tasti `1 2 3` / `A B C`, e la
schermata **lo dichiara** sui dispositivi con tastiera. Modalità *auto*: sulla
risposta esatta avanza da solo dopo un secondo, sull'errore resta — è lì che c'è
qualcosa da imparare. Taggare un errore N/L/C.

**Vincolo.** Nella simulazione **non c'è correzione durante la prova**: l'esito
arriva alla fine, come all'esame. Il conto alla rovescia diventa rosso sotto i
cinque minuti e chiude la prova a zero.

**Casi limite.** Duecento millisecondi di sordità agli input dopo ogni cambio di
schermata: su un telefono un doppio tocco rispondeva alla domanda dopo senza
averla letta. I modificatori escludono le scorciatoie di sistema — ⌘A rispondeva
A, e scriveva un errore nello storico.

**La fine di un'attività** (area 3, §§4–6 del suo progetto; controlli da
P-31). Con almeno una risposta, «Termina l'attività» ed Esc aprono il
riepilogo **parziale**; senza risposte un allenamento torna all'origine senza
righe, mentre una simulazione chiede conferma della consegna e, consegnata anche
vuota, ha il suo riepilogo con le domande senza risposta — non superata. Il
riepilogo **non dà un voto sulla preparazione**: che cosa è successo, quali
risposte rivedere, che cosa non è stato affrontato. Dal riepilogo si apre la
**revisione** di quel tentativo — tutte le risposte o solo gli errori, la tua e
quella ufficiale — che non scrive niente oltre ai tag, e la **riprova esatta**
degli errori di quell'attività, con un'anteprima prima dell'avvio. Base e vela
sono due fasi con due riepiloghi e due riprove. Nel prodotto pubblicato c'è
ancora il riepilogo di prima, con gli errori del runner e senza riprova:
arriva con P-19 (`tests/test_interfaccia.py` riconosce i due regimi).

### 7.6 Il runner del carteggio

**Difetto aperto, dichiarato il 26 settembre 2026.** Fino a quel giorno qui
c'era scritto, come Vincolo, che quello che scrivi è salvato **a ogni tasto**.
Non era vero, e non lo era dalla 0.5.0: `annotaCart()` tiene il testo solo in
memoria, e una ricarica durante la prova di un'ora perde tutto. Lo ha trovato il
progetto dell'area 4 (`docs/area-4-progetto.md` §3.3) e la regia l'ha verificato
nel codice. **Che cosa vale oggi:** il testo resta finché la pagina è aperta, e
la pagina lo dice, con la conferma del browser prima di lasciarla (P-36). **Che
cosa vale dopo:** una bozza legata all'account, separata dalle risposte valutate
(P-34); senza account non si conserva niente (ADR-004). L'intenzione resta
quella di allora — un'ora di lavoro non deve dipendere dall'aver premuto un
pulsante —, e questo paragrafo la chiama con il suo nome finché non è vera.

Il pallino verde sul numero dice «qui ho scritto qualcosa», non «è giusto». La consegna è a due tocchi, in pagina,
**mai** con `confirm()` nativo. Alla correzione, la risposta ministeriale accanto
alla tua, e **giudichi tu**.

### 7.7 Segnali

**Scopo.** Riconoscere fanali, segnali diurni e sonori a colpo d'occhio.

**Vincolo.** È materiale **extra banca** e lo dichiara. La lunghezza della
partita è `min(10, pool)` e la schermata scrive quella, non 10 fisso: i pool sono
27 / 9 / 9 / 8. Due situazioni che mostrano la stessa cosa condividono una
`firma`, e un distrattore con la firma del segnale mostrato non entra mai in
campo — altrimenti la domanda avrebbe due risposte giuste.

**Vincolo.** I colori dei fanali, il cielo notturno e la carta dei segnali diurni
**sono contenuto, non interfaccia**: imitano le figure del decreto e non cambiano
con il tema.

### 7.8 Info

**Cosa si vede.** La versione che gira su questo dispositivo **e la cache
installata**, che con un guscio offline possono divergere per giorni.
L'archivio, nei due stati: senza account le righe della pagina aperta, dette
come tali; con l'account la copia del dispositivo, lo stato dell'invio — da
inviare, in corso, confermate, non accolte con il motivo — e la riga «ultima
scrittura fallita». L'autodiagnosi offline. Le fonti e le anomalie della banca.
Scarica / ricarica / azzera (§5.4), e la porta dell'archivio di prima degli
account, anche dopo «Più tardi».

**Non è più l'unica via di salvataggio.** Fino alla v0.28.0 scaricare il file
era l'unico modo di non perdere tutto cambiando telefono. Con l'account si
salva sul server, e il file è l'export, una portabilità; senza account è il
modo di portarsi via le risposte della pagina aperta, e il sito non ne
conserva altre.

**Vincolo.** Un pulsante che risponde «fatto» per righe che ha scartato è un
difetto: l'import dice quante ne ha prese, quante aveva già e **quante ne ha
scartate**.

---

## 8. Gli stati trasversali

Da disegnare e provare per **ogni** flusso, non solo per quello che va bene.

| Stato | Regola |
|---|---|
| **Vuoto** | Orientamento, non una diagnosi a zero. Senza account è lo stato di ogni apertura; con l'account, un archivio vuoto non prova che l'account sia nuovo. |
| **Dati parziali** | Dirlo. Sotto le soglie del §4.3 non si mostra la misura, si mostra che non c'è. |
| **Interruzione** | Con l'account, quello che è stato risposto è nella copia del dispositivo e parte per il server: il numero in schermata deve dirlo, altrimenti sembra lavoro perduto — è già successo. Senza account resta finché la pagina è aperta, e una ricarica lo perde: la pagina l'ha detto prima di cominciare, e non lo nasconde dopo. |
| **Offline** | Non una promessa generica: lo stato riflette la disponibilità **reale** di guscio, banca e figure, e una voce in cache ma non servibile compare in rosso. |
| **Contenuto mancante** | Una figura indisponibile si dichiara con il perché (base-59), non si lascia un buco. |
| **Errore di salvataggio** | Avviso in schermata + pallino su Info + riga nella scheda Archivio, che chiede di scaricare i progressi adesso. **Non si spegne mai «per pulizia».** |
| **Selezione vuota** | «Niente da fare con questa selezione», mai un clic che non produce niente. |
| **Banca non raggiungibile** | Lo si dice. Non si inventano cifre: la vetrina, se `meta.json` non risponde, scrive che non può contare gli argomenti invece di mostrare tessere vuote. |

**Il principio sui messaggi d'errore.** Un errore non è un rimprovero: è
un'informazione **più un modo di uscirne**. Ogni messaggio dice che cosa è
successo e che cosa fare adesso.

---

## 9. I requisiti, con il loro controllo

Ogni riga: che cosa deve essere vero, e **che cosa lo dimostra**. La colonna
controllo nomina un test esistente oppure dice **scoperto** con il motivo.

`tests/test_specifica.py` legge questa sezione e fallisce se un controllo nomina
un test che non esiste. Non si aggiunge un requisito senza compilare la terza
colonna: «scoperto, perché …» è una risposta accettabile, «—» no.

### 9.1 I dati — la banca è un atto dello Stato

| ID | Requisito | Controllo |
|---|---|---|
| R-DATI-01 | Nessun quesito annotato ha la risposta modificata rispetto al seed | `test_dati.py::test_invarianti` |
| R-DATI-02 | Ogni quesito ha **esattamente una** risposta esatta | `test_dati.py::test_quiz` |
| R-DATI-03 | I 37 oscurati esistono in banca e lo dichiarano **prima** di rispondere | `test_dati.py::test_invarianti` |
| R-DATI-04 | Nessuna nota che anticipa la risposta compare fra quelle mostrate prima | `test_dati.py::test_invarianti` |
| R-DATI-05 | I dieci abbinamenti figura restano corretti, e base-59 dichiara perché non ha figura | `test_dati.py::test_figure` |
| R-DATI-06 | I conteggi di `meta.json` coincidono con la banca caricata | `test_dati.py::test_meta` |
| R-DATI-07 | Le risposte ufficiali del carteggio restano verbatim | `test_dati.py::test_carteggio` |
| R-DATI-08 | Nessun dato di casa e nessun materiale di terzi rientra nel repo | `test_dati.py::test_controlla` |

### 9.2 L'architettura

| ID | Requisito | Controllo |
|---|---|---|
| R-ARCH-01 | Lo specchio ricalcolato coincide con quello costruito risposta per risposta | `test_engine.mjs::ripiega: dalle righe lo stesso specchio` |
| R-ARCH-02 | Coperti + da ripassare + mai visti = totale, sempre | `test_engine.mjs::coperti + da_ripassare + mai_visti === totale` |
| R-ARCH-03 | La versione è una sola, nei tre posti | `test_engine.mjs::la versione e una sola` |
| R-ARCH-04 | Il guscio di `sw.js` e quello di `app.html` sono la stessa lista | `test_engine.mjs::il GUSCIO di sw.js` |
| R-ARCH-05 | Nessun percorso del guscio e nessun `href` interno finisce in `.html` | `test_dati.py::test_indirizzi` |
| R-ARCH-06 | `start_url` è la palestra, non la vetrina | `test_dati.py::test_indirizzi` |
| R-ARCH-07 | Il nome del database IndexedDB non cambia col nome del progetto | `test_dati.py::test_rinomino` |
| R-ARCH-08 | Il prefisso della cache è uno solo, in tutti i punti che lo cercano | `test_dati.py::test_prefisso_cache` |
| R-ARCH-09 | I due `<title>` sono diversi, e quello della vetrina nomina la patente | `test_dati.py::test_indirizzi` |
| R-ARCH-10 | Le figure scaricate per l'offline sopravvivono a un rilascio, nella cache nuova e senza un secondo download | `test_engine.mjs::sw.js: le figure scaricate sopravvivono a un rilascio` |
| R-ARCH-11 | Da un rilascio all'altro passano solo le figure: la banca e le pagine vengono dalla rete | `test_engine.mjs::sw.js: da un rilascio all` |
| R-ARCH-12 | `strumenti/serve.py` risponde come l'host di produzione misurato: codici, assenza di redirect, 404, `Cache-Control` da `_headers` | `test_dati.py::test_serve` |

### 9.3 La selezione

| ID | Requisito | Controllo |
|---|---|---|
| R-SEL-01 | La simulazione non pesca i 37 oscurati | `test_engine.mjs::la simulazione non pesca i quesiti oscurati` |
| R-SEL-02 | La simulazione rispetta la composizione ministeriale | `test_engine.mjs::la simulazione rispetta la composizione ministeriale` |
| R-SEL-03 | Il numero promesso e la lista che si apre vengono dalla stessa fonte | `test_engine.mjs::daAllenare: daFare sono le aperte piu i mai visti` |
| R-SEL-04 | Una lista rifatta non ripete la precedente finché c'è altro | `test_engine.mjs::solo sbagliate" avanza da sola` |
| R-SEL-05 | Ogni quesito della Mirata sa dire perché è lì | `test_engine.mjs::mirata: ogni quesito sa dire perche e li` |
| R-SEL-06 | Lo screening tocca ogni voce, e non ripesca finché ci sono mai visti | `test_engine.mjs::lo screening tocca ogni voce` |
| R-SEL-07 | Il tappeto riprende da dove si era rimasti, senza segnaposto | `test_engine.mjs::tappeto: si riprende da dove si era rimasti` |
| R-SEL-08 | La partita dei Segnali è lunga quanto la schermata promette | `test_engine.mjs::segnali: la partita e lunga quanto la schermata promette` |
| R-SEL-09 | La banca vela si restringe per voce, non per tema | `test_engine.mjs::la banca vela si restringe per voce` |
| R-SEL-10 | La prova di carteggio: uno per argomento, soglia 3 su 4 | `test_engine.mjs::la soglia della prova di carteggio e 3 su 4` |
| R-SEL-11 | Lo screening apre esattamente le domande che promette, e il numero lo da' il motore contando la banca | `test_engine.mjs::lunghezzaScreening: il numero promesso e la lista che si apre coincidono` |
| R-SEL-12 | Le condizioni della prova di carteggio — 4 esercizi, 60 minuti, 3 su 4 — hanno una sorgente sola nel motore, con la loro fonte, e l'assunzione Q-CART4 viaggia con il contratto invece di stare in un commento | `test_engine.mjs::provaCarteggio: le condizioni della prova hanno una sorgente sola` |
| R-SEL-13 | La prova di carteggio apre quattro esercizi distinti, uno per argomento, rimescolati, senza filtro per carta, e le carte richieste vengono dalla lista | `test_engine.mjs::provaCarteggio: quattro esercizi distinti, uno per argomento, sulla banca vera` |
| R-SEL-14 | La prova cieca non guarda lo storico, risultato intero compreso, e le sue riprese non si contano: `null`, non zero | `test_engine.mjs::provaCarteggio: la prova cieca non guarda lo storico` |
| R-SEL-15 | Con la precedenza ai mai provati le riprese effettive si dichiarano per argomento e per esercizio, prima dell'avvio, e la prova non esce mai corta | `test_engine.mjs::provaCarteggio: con la precedenza ai mai provati le riprese si dicono per argomento` |
| R-SEL-16 | Su una banca incompleta gli argomenti mancanti si nominano e non contano come rappresentati, il completamento dal resto si dichiara, e una lista corta non si dice pronta | `test_engine.mjs::provaCarteggio: su una banca incompleta i mancanti si nominano` |
| R-SEL-17 | La pagina compone la prova e ne scrive le condizioni da `provaCarteggio()` e `PROVA_CARTEGGIO`, senza un secondo algoritmo né un secondo conto degli argomenti | scoperto — la pagina compone ancora con la sua `componiProva()` e le sue costanti `PROVA_*`: finché ci sono, `test_engine.mjs` le esegue estratte dal file e pretende la stessa prova, e il test si ritira con la copia. Il passaggio è la realizzazione dell'area 4 (P-21), il controllo che lo tiene fermo è D-04 |

### 9.4 La navigazione e la reperibilità

I primi sei non esistevano prima del 9 settembre 2026, e i primi due sono la
ragione per cui questo documento è stato scritto.

| ID | Requisito | Controllo |
|---|---|---|
| R-NAV-01 | Ogni schermata dichiarata nel §5.2 ha **almeno un ingresso** nella pagina | `test_interfaccia.py::test_ogni_vista_ha_una_porta` |
| R-NAV-02 | Ogni funzione esportata dal motore è chiamata dalla pagina, o sta nell'elenco dichiarato delle eccezioni | `test_interfaccia.py::test_motore_senza_orfani` |
| R-NAV-03 | Ogni voce della barra porta a una vista dichiarata e ha un'etichetta di testo, non la sola icona | `test_interfaccia.py::test_voci_barra` |
| R-NAV-04 | I quiz sono in uno dei due regimi riconosciuti. **Attuale:** le sei modalità esistono tutte, e nessuna pagina tiene Batteria accanto al contratto nuovo. **Progettato** (area 2): cinque intenzioni con una porta ciascuna, nessun ingresso Batteria, e ognuna apre la selezione del §6 di `area-2-progetto.md` — funzione del motore, parametri e lista eseguiti, non letti | `test_interfaccia.py::test_modalita_quiz` |
| R-NAV-05 | «Solo mai fatte» e «solo con figura» esistono: globali nel regime attuale; nel progettato solo nella scelta per argomento, dove chiedono al motore `stati: ['nuovo']` e `soloFigura`, e nessun'altra intenzione li riceve | `test_interfaccia.py::test_selettori` |
| R-NAV-06 | L'elenco delle schermate del §5.2 è esattamente quello che sta nel file: nessuna aggiunta e nessuna sparizione in silenzio | `test_interfaccia.py::test_viste_dichiarate` |
| R-NAV-07 | Il controllo del regime progettato gira a ogni esecuzione, anche finché la pagina pubblicata è a sei ingressi: una pagina di riferimento lo passa, e ciascuna delle sue rotture dichiarate lo fa fallire nominando il difetto | `test_interfaccia.py::test_intenzioni_provate_al_contrario` |

**Che cosa questi controlli non fanno.** Non fissano la composizione della
barra: quante voci abbia e come si chiamino è Q-NAV, e decide l'autore (§10). Un
test che ne fissasse l'elenco prenderebbe quella decisione al posto suo. Fissano
gli invarianti che valgono con quattro destinazioni, con sette e con qualunque
altra scelta — e R-UX-01 dice che il Carteggio ha una sua stanza, non che debba
stare nella barra.

**I due regimi dei quiz, e quando ne resta uno.** R-NAV-04 e R-NAV-05 sono
scritti per il passaggio all'area 2 (`area-2-progetto.md` §10.1): la pagina
pubblicata ha sei modalità, quella progettata cinque intenzioni, e `main` deve
restare verde con la prima mentre la seconda si realizza. Il controllo riconosce
il regime da `MODI`; nel progettato estrae `selezioneQuiz()` e la esegue contro
il motore vero con una spia sulle chiamate (`tests/quiz_intenzioni.mjs`). Il
contratto che la pagina deve rispettare è nel §10.1 di quel progetto. **Il
regime attuale ha una scadenza:** lo toglie la regia quando integra P-05, e da
quel momento i due requisiti tornano ad avere un regime solo. Che cosa il
controllo non vede — la gerarchia, il giro dietro un disclosure, i testi, il
focus, i ritorni, «Base e vela» come due fasi — resta collaudo a 375 e 1280 px.

### 9.5 Gli stati

| ID | Requisito | Controllo |
|---|---|---|
| R-STA-01 | Senza data d'esame non compaiono `NaN` né numeri inventati | `test_engine.mjs::traccia: senza una scadenza niente quota` |
| R-STA-02 | Sotto le soglie misurate si usa il ripiego, **dichiarato** | `test_engine.mjs::stimaImpegno: sotto le 30 risposte` |
| R-STA-03 | L'import dice quante righe ha preso, quante aveva già, quante ha scartato | `test_engine.mjs::fondiArchivio: per uid, senza doppioni` |
| R-STA-04 | Una coda vuota produce un messaggio, non un clic senza effetto | scoperto — la suite non esercita il DOM di `app.html`; oggi si verifica solo guidando la pagina |
| R-STA-05 | Una scrittura fallita accende l'avviso, il pallino e la riga in Archivio | scoperto — richiede di far fallire IndexedDB nella pagina viva |
| R-STA-06 | L'autodiagnosi offline apre ogni voce del guscio, non ne controlla la chiave | scoperto — richiede un service worker attivo su HTTPS |
| R-STA-07 | Una figura indisponibile si dichiara con il perché | `test_dati.py::test_figure` |
| R-STA-08 | Una lettura che fallisce non ripiega su un dato plausibile: le letture cieche ancora presenti sono dichiarate, con l'area che le chiude | `test_interfaccia.py::test_letture_che_non_mascherano` |
| R-STA-09 | Aperte su un indirizzo che non è `rottagiusta.it`, la palestra lo dichiara per prima cosa e offre di scaricare i progressi, e la vetrina manda alla palestra sul nuovo indirizzo | `test_interfaccia.py::test_trasloco` |

### 9.6 Il tempo, e il ciclo che si chiude

Nati dal confronto a tre del 10-12 settembre 2026 e dalla misura sull'archivio
del progetto di preparazione. Il §4 di `prossima-versione.md` li motiva.

| ID | Requisito | Controllo |
|---|---|---|
| R-TEMPO-01 | Sotto `MIN_MISURATE` risposte nessuna schermata annuncia una durata: al suo posto una garanzia vera | scoperto — è un testo di schermata, si fissa quando il testo è definitivo |
| R-TEMPO-02 | Una durata annunciata viene da `stimaImpegno()` e si dichiara stima, mai scritta a mano | scoperto — la suite non esercita il DOM di `app.html` |
| R-TEMPO-03 | Nessun selettore «quanto tempo hai?» dimensiona una sessione | scoperto — misurato che fra sessioni la durata per domanda varia di un fattore quattro |
| R-TEMPO-04 | È ammesso l'inverso — «esercitati per circa N minuti» con chiusura dopo la domanda corrente | scoperto — non esiste ancora nel prodotto, e il controllo sarà sul runner, che la suite non esercita |
| R-TEMPO-05 | Il ritmo si misura all'orologio, non al cronometro, ed è robusto senza soglie da tarare | `test_engine.mjs::ritmo: una sessione in cui ti sei alzato dal tavolo` |
| R-TEMPO-06 | Il ritmo non dipende dalla lunghezza della sessione | `test_engine.mjs::ritmo: una sessione corta non e` |
| R-TEMPO-07 | `stimaImpegno()` dichiara quale dei tre tempi sta riportando | `test_engine.mjs::stimaImpegno: con il ritmo misurato usa l` |
| R-TEMPO-08 | Il ritmo si misura sul confine per pausa, e un'attività ripresa dopo una pausa non lo gonfia | `test_engine.mjs::sessioni: il confine per pausa resta quello di prima, e ritmo lo usa` |
| R-FLU-01 | Ogni attività si chiude con un passo che propone azioni derivate da quello che è appena successo. **Quiz, coperti:** riepilogo dell'attività intera — risposte, corrette, errate, non affrontate, esito solo per una prova e mai superata con domande senza risposta — e la riprova che offre, pronta o bloccata col suo motivo. **Carteggio, tecniche e Segnali, scoperti:** i loro cicli non sono ancora realizzati (area 4, P-35) | `test_interfaccia.py::test_ciclo_riepilogo` |
| R-FLU-02 | Gli errori di una sessione si riaprono come esercizio, senza mescolarli con quelli di sempre: tutti e soltanto gli errori di quell'attività, nell'ordine delle risposte, anche se nel frattempo sono stati corretti altrove | `test_engine.mjs::erroriSessione: apre esattamente gli errori di quella lista` |
| R-FLU-03 | Il conteggio annunciato e la lista che si apre coincidono anche per gli errori di sessione, nel motore; nella pagina lo tiene R-FLU-10 | `test_engine.mjs::erroriSessione: il conteggio promesso e la lista coincidono` |
| R-FLU-04 | Un confine di sessione ricostruito si dichiara invece di passare per registrato: il motore lo dice in `fonte`, e il riepilogo e l'istantanea della riprova lo portano fino alla pagina | `test_engine.mjs::erroriSessione: un confine ricostruito si dichiara` |
| R-FLU-05 | Un'attività registrata si riapre intera anche oltre una pausa: gli errori sono tutti i suoi, e la `fonte` registrata non copre un confine tagliato | `test_engine.mjs::erroriSessione: un attivita registrata resta intera oltre la pausa` |
| R-FLU-06 | Con il confine dell'attività ogni id compare una volta sola e le attività non si mescolano, nemmeno intrecciate nel tempo o con una riprova | `test_engine.mjs::sessioni: con confine attivita ogni id e unico e le attivita non si mescolano` |
| R-FLU-07 | Un id che raccoglie un quesito ripetuto, due modalità o due banche si dichiara ambiguo con il motivo, e non apre una lista né promette «zero errori» | `test_engine.mjs::sessioni: un id riusato con un quesito ripetuto o un altra modalita e ambiguo` |
| R-FLU-08 | Un errore su un quesito che la banca caricata non ha si nomina, invece di sparire dal conteggio | `test_engine.mjs::erroriSessione: un errore su un quesito che la banca non ha si nomina` |
| R-FLU-09 | Un confine sessione sconosciuto è un errore, non un ritorno silenzioso al predefinito | `test_engine.mjs::sessioni: un confine sconosciuto e un errore, non un ripiego` |
| R-FLU-10 | «Riprova questi N» apre l'istantanea presa al riepilogo — stesso numero, stessa lista, stesso ordine —, con un'identità nuova, senza timer e senza avanzamento automatico; se fra un clic e l'altro gli errori dell'attività sono cambiati, o l'attività non c'è più o non si legge, l'anteprima lo dice e Inizia non avvia niente. Un tag, un'altra attività o la banca ricaricata non cambiano la lista | `test_interfaccia.py::test_ciclo_riprova` |
| R-FLU-11 | Il controllo del ciclo progettato gira a ogni esecuzione, anche finché la pagina pubblicata ha il ciclo di prima: una pagina di riferimento lo passa, e ciascuna delle sue rotture dichiarate lo fa fallire nominando il difetto | `test_interfaccia.py::test_ciclo_provato_al_contrario` |

**I due regimi del ciclo, e che cosa il controllo non vede.** R-FLU-01 e
R-FLU-10 sono scritti per il passaggio all'area 3 (§10.1 del suo progetto), con
il meccanismo di R-NAV-04: la pagina pubblicata ha il riepilogo di prima, e
`main` deve restare verde con lei mentre il nuovo si realizza. Il controllo
riconosce il regime dal **raccordo** — `riepilogoQuiz()`, `anteprimaRiprova()`,
`avviaRiprova()` —, non da un pulsante: nel regime attuale pretende che il
riepilogo e la revisione di oggi ci siano e che nessuna riprova esista senza il
raccordo; nel progettato estrae le tre funzioni e fa il giro riepilogo →
anteprima → avvio contro il motore e la banca veri, con uno storico estraneo e
i dati che cambiano fra un clic e l'altro (`tests/ciclo_quiz.mjs`). R-FLU-02…04
restano sul motore, dove i loro test li tengono; R-FLU-10 li porta nella colla
fra pagina e motore. **Non vede**, e resta al collaudo a 375 e 1280 px: i testi
del riepilogo e dell'anteprima, la gerarchia delle uscite, il focus e i
ritorni, Esc, la conferma e la consegna idempotente di una simulazione, i tag
nella revisione, gli avvisi di scrittura e di lettura, le figure, Base e vela
come flusso. **Il regime attuale ha una scadenza:** lo toglie la regia quando
integra P-19.

### 9.8 Che cosa non deve sparire, e che cosa si deve leggere

Nati dall'audit del 12 settembre 2026 e dalla richiesta di ChatGPT di registrare,
per ogni area, i comportamenti esistenti da preservare. Sono controlli e non
liste, perché una lista in un prompt è una regola da ricordare.

| ID | Requisito | Controllo |
|---|---|---|
| R-PRES-01 | Una funzione del motore che la pagina consuma non smette di essere consumata in silenzio | `test_interfaccia.py::test_chiamate_al_motore_preservate` |
| R-A11Y-01 | Nessun testo sotto gli 11 px, salvo eccezioni dichiarate con l'area che le corregge | `test_interfaccia.py::test_testi_leggibili` |
| R-A11Y-02 | Un'immagine che porta contenuto dichiara che cosa mostra; `alt=""` resta per le decorative | `test_interfaccia.py::test_alt_di_contenuto` |
| R-A11Y-03 | Contrasto ≥ 4,5:1 sul testo normale e aree di tocco ≥ 44 px | scoperto — serve il rendering, e si verifica guardando a 375 e 1280 px |
| R-UX-06 | Una breve attività dichiara che cosa è successo, quali rivedere e che cosa non hai toccato: nessuna quarta affermazione, e nessun voto sulla preparazione | scoperto — i numeri delle tre affermazioni vengono dal raccordo e li tiene R-FLU-01; le frasi sono testo di schermata, e si fissano al collaudo di P-19 |

### 9.7 Le decisioni di prodotto

| ID | Requisito | Controllo |
|---|---|---|
| R-UX-01 | Il Carteggio è un ambiente proprio, raggiungibile senza cercarlo fra i quiz | `test_interfaccia.py::test_ogni_vista_ha_una_porta` |
| R-UX-02 | Il gioco dei Segnali non scrive nell'archivio delle risposte | scoperto — richiede di giocare e contare le righe; verificato a mano nella 0.19.2, quattro partite e archivio fermo a 101 righe |
| R-UX-03 | La prova di carteggio dichiara **all'ingresso** che il giudizio è di chi studia | scoperto — è un testo in schermata, si fissa quando il testo è definitivo |
| R-UX-04 | Gli extra non compaiono dentro la mappa della copertura | scoperto — dipende dalla struttura della Rotta, ancora aperta (§10) |
| R-UX-05 | Il carico di un'attività si annuncia in minuti, non solo in domande | scoperto — decisione aperta (§10) |

### 9.9 L'accesso

Nati dall'ADR-004. Gli account non esistono ancora nel sito pubblicato, ma
sono nella pagina su `main` dal 29 settembre 2026 (P-18): i requisiti della
pagina si controllano su quella, in un browser vero, e dal 30 settembre (P-40)
una pagina senza il client è rossa. Quello che il banco non vede è scritto in
righe sue, scoperte con il motivo (R-ACC-59…62). Quelli del server hanno il loro
controllo in `test_server.mjs`.

| ID | Requisito | Controllo |
|---|---|---|
| R-ACC-01 | Si arriva al primo quesito senza registrarsi, anche alla prima visita, con la rete e offline con il guscio caricato; fermata dopo una risposta, l'attività ha il suo riepilogo e la sua revisione | `test_interfaccia.py::test_client_primo_ingresso` |
| R-ACC-02 | Senza account nessuna risposta resta dopo la chiusura della pagina, e la pagina lo dice prima di cominciare e alla fine di ogni attività: le due frasi del §4.1 del progetto del client, in testo che si vede; dopo una ricarica non mostra niente di prima | `test_interfaccia.py::test_client_senza_account` |
| R-ACC-03 | La registrazione si raccomanda alla fine di un'attività con i vantaggi che esistono, e non a ogni schermata: in nessuna vista un invito, un modulo o una finestra d'account; nel riepilogo sì, «Continua senza account» lo chiude senza chiedere altro, e non torna durante l'attività dopo ma nel suo riepilogo | `test_interfaccia.py::test_client_invito_e_viste` |
| R-ACC-04 | Senza account si fanno tutte le attività — il Percorso, i Quiz per argomento, la simulazione con la sua consegna, «Che tecnica serve?», la prova di carteggio, i Segnali —, ognuna fino al suo punto d'arrivo; ai registrati restano solo le viste che vivono di uno storico, e Progressi senza account dice perché non c'è invece di un cruscotto di zeri | `test_interfaccia.py::test_client_tutte_le_attivita` |
| R-ACC-05 | Un archivio locale che esiste il giorno del rilascio non sparisce in silenzio: si porta nell'account o si scarica. L'avviso conta le due fonti — IndexedDB `open-patente-nautica` e `pn.archivio` — unite per uid; «Scarica il file» le porta tutte senza rete; portarle chiede con quante e dove, e le lascia dov'erano; il segno guarda gli uid, e una riga nuova riaccende l'avviso a conteggio uguale; «Più tardi» non scrive niente; una lettura fallita si dice e non diventa «nessuna risposta» | `test_interfaccia.py::test_client_vecchio_archivio` |
| R-ACC-06 | Le righe della pagina aperta e quelle dell'account si uniscono per `uid`, senza doppioni e senza vincitore | `test_engine.mjs::fondiArchivio: per uid, senza doppioni` |
| R-ACC-07 | Una riga si accetta o si rifiuta con una regola sola, `validaRiga()`, e il rifiuto dice il motivo | `test_engine.mjs::validaRiga: una riga rotta` |
| R-ACC-08 | Le righe dei tag N/L/C, che nascono senza data, si importano | `test_engine.mjs::fondiArchivio: i tag si importano` |
| R-ACC-09 | Senza account la pagina non conserva niente nel browser, nemmeno le preferenze: dopo un'attività e la data d'esame, niente in IndexedDB, localStorage, sessionStorage, cookie, né in Cache Storage oltre il guscio e le figure, e nessuna richiesta all'API | `test_interfaccia.py::test_client_senza_account` |
| R-ACC-10 | Una password più corta di 15 caratteri è rifiutata, senza regole di composizione | `test_server.mjs::account: una password piu corta di 15 caratteri e rifiutata, senza regole di composizione` |
| R-ACC-11 | Un account non confermato entro sette giorni si cancella con le sue righe, e la schermata dice la data dal primo momento | `test_server.mjs::verifica: un account non confermato entro sette giorni si cancella con le sue righe` |
| R-ACC-12 | Una riga accolta torna dal server byte per byte com'era, campi sconosciuti compresi | `test_server.mjs::righe: una riga accolta torna dal server byte per byte, campi sconosciuti compresi` |
| R-ACC-13 | La risposta a un invio nomina gli `uid` accolti, già presenti e scartati, e il client toglie dalla coda solo quelli che il server nomina | `test_engine.mjs::coda: dopo un invio si tolgono solo gli uid che il server nomina, non tutto tranne gli scartati` |
| R-ACC-14 | Una riga arrivata tardi con un `ts` vecchio compare nella ricezione successiva | `test_server.mjs::righe: una riga arrivata tardi con un ts vecchio compare nella ricezione successiva` |
| R-ACC-15 | Dopo un azzeramento, un invio con la generazione vecchia è rifiutato con `409`, le sue righe non rientrano, e il client non le rimanda né le butta finché chi studia non sceglie | `test_server.mjs::azzera: dopo un azzeramento un invio con la generazione vecchia e rifiutato, e le sue righe non rientrano` |
| R-ACC-16 | Nessuna password, gettone o cookie compare nel database in chiaro, né nel registro, né nel log | `test_server.mjs::segreti: nessuna password, gettone o cookie nel database in chiaro ne nel registro` |
| R-ACC-17 | L'accesso con un'email inesistente e con una password sbagliata danno la stessa risposta, e costano lo stesso calcolo | `test_server.mjs::accesso: un email inesistente e una password sbagliata danno la stessa risposta` |
| R-ACC-18 | L'export dal server si ricarica con `importa()` e dà le stesse righe | `test_server.mjs::esporta: il file dal server si ricarica con importa e da le stesse righe` |
| R-ACC-19 | Una cancellazione chiesta toglie l'account con le sue righe, i suoi punteggi e le sue sessioni, anche dai byte del database e del WAL, e un ripristino da una copia di prima non lo riporta | `test_server.mjs::cancellazione: DELETE /v1/account toglie tutto, anche dai byte del file, e un ripristino da una copia di prima non lo riporta` |
| R-ACC-20 | Una copia di sicurezza si ripristina e ha le stesse righe dell'originale, byte per byte | `test_server.mjs::copia: si ripristina con le stesse righe dell originale` |
| R-ACC-21 | Una mail che il fornitore non accetta produce un errore dichiarato, mai «ti abbiamo scritto» | `test_server.mjs::posta: una mail che il fornitore rifiuta produce un errore dichiarato` |
| R-ACC-24 | Dopo il ripristino di una copia, una riga accolta dopo la copia torna sul server dal dispositivo che la ha, e ogni altro dispositivo la riceve | `test_server.mjs::epoca: con la contabilita del motore, dopo un ripristino le righe perse tornano e ogni dispositivo le riceve` |
| R-ACC-25 | Una password dell'elenco delle comuni, in qualunque combinazione di maiuscole, o uguale all'email o alla sua parte prima della `@`, è rifiutata, e il rifiuto dice perché | `test_server.mjs::account: una password comune in qualunque maiuscola, o uguale all email, e rifiutata con il perche` |
| R-ACC-26 | Una sessione vale 30 giorni dall'accesso e l'uso non la allunga: il trentunesimo giorno la stessa richiesta risponde `401` | `test_server.mjs::sessione: vale 30 giorni dall accesso e l uso non la allunga` |
| R-ACC-27 | Al centesimo accesso fallito di fila la password si disattiva, anche attraverso un riavvio, finché non arriva una reimpostazione; e un'email che non esiste riceve gli stessi codici | `test_server.mjs::accesso: al centesimo fallimento di fila la password si disattiva` |
| R-ACC-28 | La richiesta di reimpostare la password risponde allo stesso modo per un'email iscritta e per una che non lo è | `test_server.mjs::password dimenticata: risponde allo stesso modo per un email iscritta e una no` |
| R-ACC-29 | Un gettone mandato per email vale una volta sola e per il suo tempo — 24 ore la verifica, un'ora la password —, e uno nuovo dello stesso scopo annulla i precedenti | `test_server.mjs::verifica: un gettone vale una volta sola e per il suo tempo` |
| R-ACC-30 | Registrarsi con un'email già iscritta dà un errore esplicito, «email già registrata», senza aprire la sessione e senza mandare una mail; il `409` conta fra le cinque registrazioni l'ora per indirizzo | `test_server.mjs::registrazione: un email gia registrata risponde 409, senza sessione e senza mail` |
| R-ACC-31 | Il cursore della ricezione lo sposta solo una ricezione: l'`ultima_seq` di un invio non lo tocca | `test_engine.mjs::coda: l invio non sposta il cursore, lo sposta solo la ricezione` |
| R-ACC-32 | Un invio oltre 2.000 righe o 2 MiB riceve un `413` che si legge, e niente entra; il lotto che il motore prepara sta nei limiti, che il server importa dal motore | `test_server.mjs::righe: oltre 2000 righe o 2 MiB la risposta e 413, e niente entra` |
| R-ACC-33 | La ricezione va a pagine di 5.000 righe, e le pagine insieme non perdono e non ripetono una riga | `test_server.mjs::righe: la ricezione va a pagine di 5000, e insieme non perde e non ripete` |
| R-ACC-34 | L'indirizzo cambia solo con la password, da un indirizzo già confermato, e quando il nuovo conferma entro 24 ore; il vecchio riceve un avviso che dice verso dove, e una password cambiata annulla la richiesta | `test_server.mjs::email: l indirizzo cambia solo quando il nuovo conferma, il vecchio riceve l avviso, e una password nuova annulla la richiesta` |
| R-ACC-35 | Il profilo tiene la data d'esame, facoltativa e solo se è una data vera, e i punteggi dei Segnali fusi con il massimo, così rimandarli non cambia niente; un campo rotto non lascia scritti gli altri, e l'export porta i punteggi | `test_server.mjs::profilo: la data d esame facoltativa e i punteggi dei Segnali fusi con il massimo, e l export li porta` |
| R-ACC-36 | A 700 giorni senza attività parte un avviso con la data; trenta giorni dopo l'avviso, se nessuno è tornato, l'account si cancella passando dal file delle cancellazioni; un accesso dopo l'avviso lo salva, e un riavvio non manda un secondo avviso | `test_server.mjs::inattivita: a 700 giorni un avviso con la data, a 730 senza attivita si cancella, e un accesso lo salva` |
| R-ACC-37 | Cento accessi falliti in 24 ore, una copia con meno righe senza cancellazioni che lo spieghino e una mail rifiutata dal fornitore avvisano il titolare, senza email né indirizzi nella mail, una volta sola, anche attraverso un riavvio | `test_server.mjs::allarmi: accessi falliti oltre soglia, una copia con meno righe e una mail rifiutata avvisano il titolare, una volta sola` |
| R-ACC-38 | Le mail si contano per mese dal registro: raggiunte le 300 comprese il titolare riceve un avviso, uno al mese, e nessuna mail è bloccata | `test_server.mjs::mail del mese: oltre le 300 la mail parte lo stesso, e il titolare riceve un avviso solo` |
| R-ACC-39 | Un trasferimento verso l'account — le righe della pagina alla registrazione, un file, l'archivio di prima — si dice salvato solo quando il server ha nominato ogni sua riga, in un invio o in una ricezione: non per deduzione dalla coda, non dopo un azzeramento, e non con le conferme di un database che un ripristino ha sostituito; scarti locali e del server si contano per motivo | `test_engine.mjs::trasferimento: salvate solo le righe che il server nomina, anche su piu lotti` |
| R-ACC-40 | Una riga che da sola supera il limite di un invio non ferma quelle dietro, e le righe in coda che non partiranno mai si nominano con il motivo | `test_engine.mjs::coda: una riga oltre il limite non ferma quelle dietro, e si nomina` |
| R-ACC-41 | La pagina dice «Questa email è già registrata.» dal `409` della registrazione riconosciuto da codice **e** `errore`, con Accedi — email già scritta, password vuota — e Reimposta la password; zero cookie, zero sessioni e zero mail nuove, e le risposte della pagina ancora nel riepilogo. Un `409` di un altro genere non parla di email | `test_interfaccia.py::test_client_email_registrata` |
| R-ACC-42 | Il banco del client è provato contro sé stesso a ogni esecuzione, in un browser vero: una pagina di riferimento lo passa, ciascuna delle sue rotture dichiarate lo fa fallire nominando il difetto, e le sue varianti restano verdi | `test_interfaccia.py::test_client_provato_al_contrario` |
| R-ACC-43 | Registrandosi dopo più attività, le righe di tutte arrivano nell'account; un doppio clic fa una registrazione sola; «N risposte salvate» e la data d'esame vengono solo dopo che il server ha nominato ogni riga, e finché no la pagina dice di non chiuderla; una risposta persa si verifica con `GET /v1/io` prima di ripetere, e non si ripete | `test_interfaccia.py::test_client_registrazione` |
| R-ACC-44 | Su un dispositivo condiviso le risposte di prova entrano nell'account solo con un sì confermato, e la scelta proposta non parte da sola; una risposta di A in volo quando A esce da un'altra scheda non arriva nell'account di B, letto nel database del server; la coda di A congelata da un accesso non più valido non entra in B | `test_interfaccia.py::test_client_dispositivo_condiviso` |
| R-ACC-45 | Nella pagina riga e coda si scrivono insieme: una risposta data mentre un invio è in volo arriva anche lei, due schede che rispondono nello stesso istante mandano ogni riga, e una ricarica a metà trasferimento riprende dalla coda salvata e dice «salvate» solo quando il server le ha | `test_interfaccia.py::test_client_coda` |
| R-ACC-46 | «Esci» non perde niente e non finge: con righe non inviate non esce e lo dice, offline dice che serve la rete e non cancella, una copia che un'altra scheda tiene aperta si dichiara non cancellata; dopo l'uscita niente dell'account resta nel browser, e la risposta tardiva di un'altra scheda non lo ricrea | `test_interfaccia.py::test_client_uscita` |
| R-ACC-47 | La verifica dell'email si vede e non si finge: con la mail di conferma rifiutata dal fornitore la pagina dice che l'account c'è e la mail no, e l'account salva; la scadenza è quella del server, dal primo momento e dopo una ricarica, fino alla conferma; un rinvio rifiutato non dice «inviata»; il gettone del link esce dall'indirizzo appena la pagina si apre e non resta in nessuno storage; un link già usato o scaduto lo dice | `test_interfaccia.py::test_client_verifica` |
| R-ACC-48 | La password e l'accesso dicono il motivo vero: il rifiuto di una password nuova è quello del server, accanto al campo e con l'email ancora scritta; email ignota e password sbagliata danno la stessa frase; un `429` dice quanto aspettare, dal `Retry-After`; un `403` porta alla reimpostazione; la richiesta del link risponde con la stessa frase condizionale; il gettone della password resta in memoria dopo un `422`; un account appena confermato con risposte chiede se tenerle, e non ne cancella nessuna da solo | `test_interfaccia.py::test_client_password` |
| R-ACC-49 | Il `Retry-After` di un `429` lo legge anche la pagina, che sta su un'altra origine: il CORS lo espone, e solo al sito | `test_server.mjs::cors: il Retry-After di un 429 lo legge anche la pagina, che sta su un altra origine` |
| R-ACC-50 | Un file dei progressi si porta nell'account dalla stessa porta delle righe: un file illeggibile lo dice; senza account non parte e non si conserva; l'anteprima dice i conteggi del motore, con il nome del file e l'account, senza filtrare sul nome dell'app né scartare i tag senza data; importato, le righe valide sono sul server, gli scarti si scaricano, i Segnali si fondono con il massimo; reimportato non cambia niente; una partita dei Segnali offline resta «da inviare» anche attraverso una ricarica, e arriva | `test_interfaccia.py::test_client_file` |
| R-ACC-51 | Dalla pagina i limiti del server reggono: più di 2.000 righe e più di 2 MiB arrivano tutte, in lotti che il server accetta; un `413` si legge e non dice «salvate»; oltre 5.000 righe si ricevono tutte; la conferma di un invio non sposta il cursore, e le righe di un altro dispositivo arrivano lo stesso | `test_interfaccia.py::test_client_limiti` |
| R-ACC-52 | Un azzeramento fatto altrove, scoperto inviando o ricevendo, sospende invii e ricezioni finché chi studia non sceglie: la pagina dice quante risposte di qui non sono salvate, niente rientra, scartare chiede di confermare la perdita, la scelta rimandata resta raggiungibile e riaperta conta anche le risposte date intanto; dopo, la copia è quella del server e le risposte nuove entrano | `test_interfaccia.py::test_client_azzeramento` |
| R-ACC-53 | Dopo il ripristino di una copia, la pagina vede l'epoca nuova, rimanda la risposta che il server ha perso, e un altro dispositivo la riceve: R-ACC-24 visto dalla pagina | `test_interfaccia.py::test_client_ripristino` |
| R-ACC-54 | L'uscita regge anche una sessione che non c'è più: un `401` all'uscita pulisce la copia, non dice che serve la rete; con la sessione revocata e risposte non inviate le fa scaricare e cancella solo dopo una scelta esplicita, senza mandarle a nessun account. «Esci da tutti i dispositivi» chiude ogni sessione sul server e pulisce qui; l'altro dispositivo lo scopre con un `401` e tiene la sua copia, congelata | `test_interfaccia.py::test_client_uscita` |
| R-ACC-55 | La data d'esame dopo la registrazione è facoltativa e non inventata: la data scritta nella pagina si propone e si salva solo al clic, com'è anche se passata; senza, il campo è vuoto; un salvataggio fallito lo dice; entrando in un account che ha la data, il passo non si ripete, la data resta e la pagina mostra quella del server | `test_interfaccia.py::test_client_data` |
| R-ACC-56 | «Scarica i tuoi progressi» con l'account è l'export del server, e dice quante risposte da inviare non contiene, scaricabili a parte; su un'origine senza API nessun modulo d'account, nessuna richiesta all'API e niente di personale nel browser: un link a `rottagiusta.it/app` | `test_interfaccia.py::test_client_export` |
| R-ACC-57 | I testi di `site/` sono quelli della versione con gli account: nessuna delle frasi che gli account rendono false, commenti compresi, e tutte quelle del §11.2 del progetto del client. Il contenuto giuridico dell'informativa resta al gate dell'autore | `test_interfaccia.py::test_client_testi` |
| R-ACC-58 | La pagina ha il client degli account: dichiara `indirizzoApi()`, e una pagina che non la dichiara — quella di prima di P-18 — è rossa, qui e in ogni gruppo del banco | `test_interfaccia.py::test_client_nella_pagina` |
| R-ACC-59 | Il cookie di sessione va e torna fra `rottagiusta.it` e `api.rottagiusta.it`, in HTTPS e con il prefisso `__Host-`, anche su Safari con la sua protezione dal tracciamento; e un IndexedDB che su Safari non si apre si dichiara | scoperto — il banco guida solo Chrome, su `http://localhost` e due porte (§12 del progetto del client, «Il banco»); si prova in esercizio (P-15) e su un Safari vero (Q-PROVE) |
| R-ACC-60 | I moduli dell'account si usano con il gesto vero: tastiera e fuoco, lettore di schermo, incolla e riempimento del gestore di password, a 375 e 1280 px | scoperto — i clic del banco sono `element.click()` e i campi si scrivono da uno script; è il collaudo della pagina, fatto da P-18 in Chrome e nel dialogo di accesso su Safari |
| R-ACC-61 | Le mail di conferma, di recupero e d'avviso arrivano nella casella e non nello spam, con i link com'erano | scoperto — il banco ha una posta sua, e il server sa solo che il fornitore l'ha accettata; si vede alla messa in esercizio (P-15) |
| R-ACC-62 | Un archivio di prima vero, di mesi di risposte, si porta nell'account o si scarica senza perdite, anche su un telefono | scoperto — il banco ne scrive uno sintetico di sei righe (R-ACC-05 è coperto su quello); l'archivio vero è del collaudo del traguardo (P-27) |
| R-ACC-63 | «Scarica e passa al nuovo archivio», dopo un azzeramento fatto altrove, fa quello che dice: il file porta le risposte non salvate e si ricarica; dopo il download si chiede di confermare di aver conservato il file, e senza la conferma la copia non cambia; confermato, la copia è quella del server e nessuna risposta del file rientra, mentre una risposta nuova entra | `test_interfaccia.py::test_client_scarica_dopo_azzeramento` |
| R-ACC-64 | «Cancella queste risposte», dopo il recupero della password di un account che non era confermato, fa quello che dice: chiede una conferma esplicita e senza la spunta non cancella niente; confermata, le risposte spariscono dal server con una generazione nuova, la copia di questo dispositivo le segue, e l'account resta usabile | `test_interfaccia.py::test_client_cancella_dopo_recupero` |
| R-ACC-65 | Con punteggi dei Segnali che il server non ha accolto non si esce, e lo si dice; «Scarica le risposte non salvate» porta anche i punteggi, e dopo la scelta esplicita si esce senza mandarli a nessun account; con la rete «Riprova l'invio» li manda, e solo dopo esce | `test_interfaccia.py::test_client_uscita_segnali` |
| R-ACC-66 | Un pulsante di conferma premuto senza la conferma dice che cosa manca, invece di non fare niente: «Carica il nuovo archivio» senza «Ho conservato il file», «Cancella queste risposte» senza «Confermo la cancellazione». Il messaggio sta nella finestra, in testo che si vede, e nomina la casella; intanto né la copia né il server cambiano. Quello che il banco non vede — che il lettore di schermo lo annunci, il colore e il contrasto — è di R-ACC-60 e di R-A11Y-03 | `test_interfaccia.py::test_client_conferma_mancante` |

R-ACC-20 e R-ACC-24 sono i primi requisiti del server con un controllo che si
esegue, e il giro intero sta in `node server/ripristina.mjs --prova`, che la
suite lancia. **R-ACC-24 è coperto per intero dal 26 settembre (P-10):** il
suo controllo mette tre dispositivi, ognuno con la contabilità della coda di
`site/engine.js` (`account-progetto.md` §16.1), contro il server vero, e
ripristina una copia in mezzo; due scoprono l'epoca nuova inviando, il terzo
solo ricevendo. La regola del client, «epoca cambiata: azzera il cursore e
rimanda tutto», ha anche il suo test nel motore.

**Le righe (P-10).** R-ACC-12…15, 18 e 31…33 si eseguono come quelli
dell'account. Quello che i loro controlli non vedono: la contabilità della coda
è logica pura, e che la pagina la chiami — salvando la coda accanto
all'archivio, mostrando le scartate e il conflitto — è del client degli
account, che non esiste ancora; e il `409` visto da chi studia, «scaricale o
scartale», è un testo di schermata. Di R-ACC-15 il server prova il rifiuto, il
motore che il `409` lasci la coda com'era.

**Il pezzo dell'account (P-09).** R-ACC-10, 11, 16, 17, 21 e 25…29 si eseguono
contro il server avviato nello stesso processo, con l'orologio, la posta e i
parametri di Argon2id passati dal test. Tre cose restano fuori dai loro
controlli, e si dicono. **R-ACC-11 è coperto per metà:** il server cancella al
settimo giorno e dà la data in `GET /v1/io`; che la schermata la scriva dal
primo momento è della pagina. **R-ACC-17 non misura il tempo:** conta i calcoli
di Argon2id — uno per l'email che non esiste come per quella sbagliata —,
perché un confronto di millisecondi nella suite sarebbe un test che a volte
passa. E **la registrazione dice chi è iscritto**: fino al 26 settembre per il
solo codice di risposta, `201` per un'email nuova e `202` per una già iscritta.
Quel giorno l'autore ha deciso di dirlo apertamente, «Questa email è già
registrata» (`account-progetto.md` §5.3): è R-ACC-30, coperto da P-11. Accesso
e password dimenticata, R-ACC-17 e R-ACC-28, restano come sono.

**Il pezzo che chiude le rotte (P-11).** R-ACC-19, 30 e 34…38 si eseguono come
gli altri, e dove lo stato potrebbe vivere in memoria — il gettone del cambio
d'indirizzo, i punteggi, il segno dell'avviso dei due anni, gli allarmi già
detti — il test riavvia il server a metà. **R-ACC-19 misura i byte**, non le
righe: `secure_delete` non bastava, perché l'email e le risposte restavano nei
frame vecchi del WAL anche dopo un checkpoint normale (`account-progetto.md`
§14.4). Quello che i controlli non vedono: che una mail d'avviso arrivi davvero
e non rimbalzi — il server sa solo che il fornitore l'ha accettata, e un
rimbalzo non ferma la cancellazione (§14.2 di quel progetto); che il titolare
legga la mail degli allarmi; e che la copia sulla macchina giri davvero due
volte al giorno, che è della messa in esercizio. L'onboarding e le schermate
che mostrano data, punteggi, cambio d'indirizzo e cancellazione sono della
pagina.

**La pagina, in un browser vero (P-29).** R-ACC-01, 02, 09, 41 e 42 si
eseguono guidando Chrome headless con il suo protocollo, senza dipendenze:
`tests/browser.mjs` lo pilota, `tests/client_account.mjs` è il banco, e
`tests/test_interfaccia.py` riconosceva il regime — la pagina che dichiara
`indirizzoApi()` ha il client — con il meccanismo di R-NAV-04 e R-FLU-01. Il
server degli account accanto è quello vero, sulla porta 8620. Il regime della
pagina senza client l'ha tolto P-40, qui sotto. La misura
che ha scelto questa strada, il contratto che la pagina deve rispettare e che
cosa il banco **non** copre — Safari e WebKit, i cookie fra i sottodomini veri,
le richieste fatte dal service worker, le persone — stanno nel §12 del progetto
del client, «Il banco». Dei diciotto gruppi di quel §12 ci sono C-01 (per
l'attività consigliata), C-02 e C-05; gli altri sono ancora da scrivere, e
R-ACC-30 resta al server per la metà dell'API.

**Il resto dei controlli del client (P-39).** C-01 è completo — le cinque
attività oltre il Percorso, ognuna fino al suo punto d'arrivo, con gli agganci
della pagina di oggi —, e entrano C-03, C-04, C-06, C-11 e C-15: R-ACC-03 e 04
passano a coperti, e R-ACC-43…46 dicono che cosa tengono fermo. C-06, C-11 e
C-15 guardano il database del server, non lo schermo: una riga nell'account
sbagliato si vede lì. Nel regime della pagina di allora i gruppi nuovi
controllavano solo che il client non ci fosse. **Restavano scoperti** C-07…C-10,
C-12…C-14 e C-16…C-18, per dimensione e non perché il banco non li regga,
salvo le parti dichiarate nel §12 del progetto del client; R-ACC-05 restava
scoperto con loro. Che cosa il banco non vede nei gruppi nuovi — il gesto
vero, il lucchetto fra schede come unico modo di aspettarle, una corsa più
stretta di quella che il banco sa provocare — sta nello stesso §12.

**I gruppi che restavano (P-43).** Entrano C-07…C-10, C-12…C-14, C-16 e C-17
sullo stesso banco, e C-15 per intero — il `401` all'uscita e «Esci da tutti i
dispositivi» —; C-18 è una ricerca di frasi, senza browser. R-ACC-05 passa a
coperto, su un archivio di prima sintetico; entrano R-ACC-47…57. R-ACC-11 ha ora
anche la metà della pagina, in R-ACC-47: la scadenza scritta dal primo momento,
ed è quella del server. **R-ACC-49 è del server**, e nasce da una misura fatta
per C-08: il CORS non esponeva il `Retry-After`, e nessuna pagina su un'altra
origine poteva leggere l'attesa di un `429`. Nel regime della pagina di allora
i gruppi nuovi controllavano che il client non ci fosse. Che cosa non vedono — la
mail vera, il gestore di password, un archivio vero di anni, la privacy — sta nel
§12 del progetto del client, «I gruppi che restavano».

**Un regime solo (P-40).** P-18 ha portato il client nella pagina vera, e la
regia l'ha fuso il 29 settembre 2026. Da P-40 il banco guida ogni pagina come
una pagina con il client: il regime di prima — la risposta che resta nel
browser, nessuna frase e nessuna rotta del client — non esiste più, e la pagina
di prima di P-18, senza `indirizzoApi()`, è rossa in ogni gruppo e nel controllo
statico di R-ACC-58. La pagina di riferimento del banco resta, perché porta le
rotture e la variante che tengono il banco onesto (R-ACC-42): sulla pagina vera,
dell'interfaccia, le sostituzioni si spezzerebbero a ogni suo ritocco. Quello
che il banco non vede non è più scritto solo in prosa: sono R-ACC-59…63,
scoperti con il motivo. R-ACC-11 resta sul server e ha la metà della pagina in
R-ACC-47; R-ACC-30 ha la metà della pagina in R-ACC-41.

**Le tre scelte che nessuno premeva (P-46).** R-ACC-63 le raccoglieva scoperte:
«Scarica e passa al nuovo archivio», «Cancella queste risposte» dopo il
recupero, e l'uscita con punteggi dei Segnali non accolti. Ora sono R-ACC-63,
64 e 65, ognuna con il suo controllo sulla pagina vera — parti dei gruppi C-13,
C-08 e C-15 che girano con loro e si registrano a parte — e con le sue rotture
della pagina di riferimento. Tutte e tre fanno quello che dicono. **Non lo faceva il
modo in cui rifiutano una conferma mancante:** senza la spunta, i due pulsanti
di conferma non facevano niente e non dicevano niente. È R-ACC-66: l'ha
corretto l'interfaccia (P-48), e da P-49 lo tiene un controllo sulle stesse
due parti, C-13:scarica e C-08:cancella. Il banco conta quante volte il nome
della casella compare nel testo visibile della finestra: prima solo
l'etichetta, dopo il clic anche il messaggio. Un messaggio in un elemento che
non c'è, nascosto, fuori dalla finestra, o che non nomina la casella non
passa, e la pagina di prima di P-48 è rossa proprio lì. La riproduzione del
difetto e che cosa il controllo non vede sono nel §12 del progetto del
client.

### 9.10 La mappa di Progressi

Nati da Q-DUE (§10), chiusa dall'autore il 29 settembre 2026; il motore è di
P-41, i controlli della pagina di P-44, la pagina di P-23. Dal 30 settembre
2026 (P-47) i controlli hanno un regime solo: la mappa (sotto la tabella).

| ID | Requisito | Controllo |
|---|---|---|
| R-MAPPA-01 | «Rifai N errori» apre soltanto gli errori la cui ultima risposta è sbagliata, e il «Ripasso degli errori» continua ad aprirli tutti | `test_engine.mjs::soloDaRifare: apre solo gli errori la cui ultima risposta e sbagliata` |
| R-MAPPA-02 | Il numero di «Rifai N errori» e la lista che apre coincidono su ogni tema e ogni voce della banca vera, base e vela, senza tetto e con un tetto più alto di N | `test_engine.mjs::soloDaRifare: il numero del quadro e la lista che si apre coincidono, riga per riga` |
| R-MAPPA-03 | Giusti, da rifare e mai visti sono disgiunti e sommano al totale, per tema, per voce e in tutto; visti sono giusti più da rifare | `test_engine.mjs::quadro: tre stati disgiunti che sommano al totale` |
| R-MAPPA-04 | «X su Y giusti al primo tentativo» è fatto di interi esatti, con Y uguale ai visti; sotto `PRIMA_MIN_VISTI` non c'è un numero, e le esatte non si espongono da sole | `test_engine.mjs::quadro: X su Y giusti al primo tentativo, esatti, e sotto soglia nessun numero` |
| R-MAPPA-05 | I temi stanno in ordine fisso di peso d'esame, che lo storico non muove, e le voci in ordine di banca, senza un peso | `test_engine.mjs::quadro: i temi in ordine fisso di peso d esame, le voci in ordine di banca` |
| R-MAPPA-06 | Sulla vela le tre voci fanno da righe, in ordine di banca, con peso nullo anche quando il chiamante passa il peso della prova, e si restringono per voce | `test_engine.mjs::quadro: la vela per voce, senza un peso inventato` |
| R-MAPPA-07 | La frase indica il tema con più domande d'esame in ballo, con il motivo e i pulsanti di quello che dice, ciascuno con il numero e la selezione che apre esattamente quelli, e senza minuti | `test_engine.mjs::dovePesa: vince il tema che pesa di piu in domande d esame, e i pulsanti aprono quello che dicono` |
| R-MAPPA-08 | Il valore in ballo è la quota del tema non presa, non il numero dei suoi quesiti | `test_engine.mjs::dovePesa: conta la quota del tema che non hai preso, non i quesiti` |
| R-MAPPA-09 | Quando gli errori da rifare sono almeno quanti i mai visti la frase parla di quelli, e non offre un pulsante da zero | `test_engine.mjs::dovePesa: quando gli errori da rifare sono di piu, parla di quelli` |
| R-MAPPA-10 | Sotto `FRASE_MIN_VISTI` quesiti visti la frase non c'è | `test_engine.mjs::dovePesa: sotto la soglia dichiarata nessuna frase` |
| R-MAPPA-11 | A pari merito in testa la frase non c'è: non si sceglie per ordine d'elenco | `test_engine.mjs::dovePesa: a pari merito nessuna frase` |
| R-MAPPA-12 | Con niente da fare la frase non c'è | `test_engine.mjs::dovePesa: con niente da fare nessuna frase` |
| R-MAPPA-13 | Sulla vela, e senza pesi d'esame, la frase non c'è | `test_engine.mjs::dovePesa: sulla vela nessuna frase, perche un peso per voce non esiste` |
| R-MAPPA-14 | La pagina prende i numeri della mappa e la frase da `quadro()` e `dovePesa()` attraverso il raccordo, senza rifarli: una chiamata a `quadro()` con i dati e i pesi della richiesta e `dovePesa()` sullo stesso oggetto; i temi e le voci nel loro ordine; giusti, da rifare, mai visti e visti del motore; `primo` nullo sotto soglia; nessun peso sulle voci né sulla vela; nessuna frase dove `dovePesa()` non ne dà, e nessun'altra funzione che conti. Una pagina senza il raccordo è rossa, e anche una che tiene le tabelle *Per tema* e *Per voce* o chiama `E.diagnosi()` accanto alla mappa: sarebbero la seconda classifica che Q-DUE ha tolto. La pagina vera fa tante verifiche quante la pagina di riferimento, gruppo per gruppo | `test_interfaccia.py::test_mappa_righe` |
| R-MAPPA-15 | Dalla pagina, «Rifai N errori» di un tema, di una voce e i pulsanti della frase aprono esattamente la selezione del motore: N è `daRifare`, la lista è `coda()` con `soloDaRifare` e senza tetto — tutti i 35, non 20, e non i 38 di `soloSbagliate` —; mai un pulsante da zero; se fra un clic e l'altro gli errori della riga sono cambiati, l'anteprima dice «cambiata» e Inizia non avvia niente, mentre una risposta altrove o la banca ricaricata non cambiano niente | `test_interfaccia.py::test_mappa_azioni` |
| R-MAPPA-16 | Il banco della mappa è provato contro sé stesso a ogni esecuzione: una pagina di riferimento lo passa, e ciascuna delle sue rotture dichiarate lo fa fallire nominando il difetto | `test_interfaccia.py::test_mappa_provata_al_contrario` |
| R-MAPPA-17 | La schermata scrive quello che il raccordo restituisce e niente altro: «N domande nella prova» solo con un peso, «Visti Y su N», «X su Y giusti al primo tentativo» o «Troppo poche risposte per dire come va», «Rifai N errori» o «Nessun errore da rifare qui», la frase con il suo titolo, e nessun riquadro dove la frase manca | scoperto — sono testi e disegno, e il banco della mappa esegue il raccordo sotto Node, senza DOM: un disegno che prendesse i numeri da un'altra parte passerebbe. Il collaudo di P-23 li ha guardati in Chrome a 375 e 1280 px, con e senza account, e lo sbordamento a 0 px; nessun controllo lo ripete. Il banco del client guida già la pagina vera in Chrome con un account, ed è da lì che un controllo potrebbe leggerli |

**Un regime solo, e che cosa il controllo non vede** (P-44 e P-47, 30
settembre 2026). R-MAPPA-14 e R-MAPPA-15 erano nati per il passaggio all'area 5,
con il meccanismo di R-NAV-04 e R-FLU-01: finché la pagina aveva la diagnosi a
due tabelle e «Cosa studiare adesso», il controllo riconosceva il regime dal
**raccordo** — `mappaProgressi()`, `anteprimaProgressi()`, `avviaProgressi()`,
contratto nel §10.1 di `area-5-progetto.md` — e `main` restava verde con lei.
P-23 ha portato la mappa nella pagina vera, e P-47 ha tolto il regime di
prima: il banco estrae le tre funzioni da ogni pagina e le esegue contro il
motore e la banca veri, su sei storici e con i dati che cambiano fra un clic e
l'altro (`tests/mappa_progressi.mjs`). La pagina di prima di P-23 è rossa —
provato: le tre funzioni mancano, i gruppi non hanno righe da confrontare, e le
tabelle e `E.diagnosi()` sono ancora lì. La pagina di riferimento resta, per le
sue ventiquattro rotture, per la ragione di quella del client (§9.9, «Un regime
solo»). R-MAPPA-01…13 restano sul motore, dove i loro test li tengono;
R-MAPPA-14 e 15 li portano nella colla fra pagina e motore. **Non vede**, ed è
R-MAPPA-17 o il collaudo del §9 del progetto: i testi, la barra, il dettaglio,
il focus e i ritorni, la geometria, gli stati d'accesso, prove, andamento e
sessioni, il ridisegno dopo una ricezione.

---

## 10. Che cosa non è deciso

Ogni riga dice **chi decide**. Una questione senza un decidente non si chiude mai.

| ID | Questione | Decide | Conseguenza se resta aperta |
|---|---|---|---|
| Q-NAV | Le destinazioni della barra: quattro, cinque, quali etichette | l'autore | Il codice decide al posto suo, come è già successo (§6.2) |
| Q-EXTRA | Nome, forma e collocazione del riquadro degli extra | l'autore | I Segnali restano dove capita |
| Q-DIM | La dimensione della prima attività per chi comincia | l'autore, dopo un confronto fra due varianti | Restano i 25 quesiti attuali, mai verificati su chi inizia |
| Q-TEMA | Il tema scuro: opzione futura o requisito | l'autore | Il tema chiaro va comunque misurato da solo (appendice A) |
| Q-PROG | Il programma d'esame come dataset | serve una fonte, poi l'autore | Nessuna mappa del programma è possibile: nel repo non c'è (§4.6) |
| Q-AMBITO | Se `carteggio_e12.json` esce dal cassetto | l'autore | 50 esercizi pubblicati e non usati; cambia il pubblico più di ogni scelta di navigazione |
| Q-CART4 | «Un esercizio per ciascuno dei quattro argomenti» è un'assunzione | serve la scuola nautica | La composizione della prova resta non confermata, e la 42/D non ha esercizi di carburante. Dal 30 settembre 2026 l'assunzione viaggia con il contratto, `PROVA_CARTEGGIO.assunzione`, e chi compone la prova la riceve con la lista (R-SEL-12) |
| Q-PROVE | Verifiche con dispositivi reali e con persone — e Safari, che il banco del browser non raggiunge (rimandato dall'autore il 29 settembre 2026) | l'autore fornisce dispositivi e persone | Nessuna prova su hardware Apple vero, e nessuna prova con persone diverse dall'autore. Safari nel banco vorrebbe «Allow remote automation», un'impostazione dell'autore, e anche così WebDriver non legge lo storage (`account-client-progetto.md` §12): il cookie fra `rottagiusta.it` e `api.` su Safari si prova a mano |
| Q-ONBOARD | Che cosa chiede l'onboarding di chi si registra, oltre alla data d'esame; e se il sito consiglia un piano di studio strutturato | l'autore | Un piano deve reggersi su quello che il motore sa: niente programma d'esame (Q-PROG), niente studio fatto altrove (chiusa l'8 settembre), niente «quanto tempo hai?» (R-TEMPO-03), e senza data niente quota. I pezzi ci sono già — `traccia()`, `quadro()`, `dovePesa()`, `stimaImpegno()` —, e il piano di 17 sessioni del progetto originario è stato tolto nella 0.19.0 con il resto del servizio personale |
| Q-SUITE | La suite dell'interfaccia vuole Chrome e la porta 8620 libera, da P-29, e dura circa 150 s da P-46 (85 s con P-43, un minuto prima): la pagina vera parla solo con la 8620, quindi i suoi gruppi con l'API girano in fila su una corsia, e quella somma è la durata. È il prezzo del browser vero, accettarlo o accorciarlo. La 8620 è una sola anche fra i worktree, e due suite in parallelo — P-18 e P-43 il 29 settembre — si escludono | l'autore, rimandata il 29 settembre 2026 | Accorciarla vuol dire aprire il CORS del server a più origini o accorciare attese che hanno già dato un rosso falso; finché resta aperta, la suite si fa girare intera e un'esecuzione saltata si dice |

**Chiuse, e non si riaprono senza un motivo nuovo:**

- **Q-DUE: Progressi diventa una mappa per tema** (29 settembre 2026, l'autore,
  dopo un confronto con Claude e ChatGPT). Nessuna delle due classifiche —
  `peggiori()` in Rotta, `consigli()` in Progressi — resta come lista. Il
  perché è misurato: su quattro storici sintetici le prime cinque voci delle
  due liste coincidevano due, quattro e cinque volte su cinque, e la tabella
  *Per voce* ordinata per «punti persi» era una terza copia della stessa
  graduatoria. Sette punti fanno parte della decisione:
  1. **La forma.** In cima, al massimo una frase «Dove pesa di più adesso», con
     il perché e pulsanti coerenti con quello che dice; poi una riga compatta
     per ciascuno degli otto temi, in ordine fisso di peso d'esame
     (`diagnosi().temi`), con nome, peso, barra a tre stati con la legenda in
     parole, e i dati sotto; toccando un tema, le sue voci in ordine di banca;
     sotto, separati, prove, andamento, sessioni. È un punto di partenza, da
     rivedere con l'uso.
  2. **Un errore si chiude con una risposta giusta**, come oggi; rafforzarlo è
     un'idea, [ilbeca/rotta-giusta#1](https://github.com/ilbeca/rotta-giusta/issues/1).
     Rimandare è sicuro: lo stato si ricalcola dalle righe con `ripiega()`.
  3. **Le parole della barra: «giusti · da rifare · mai visti»**, con il `?`
     «in base all'ultima risposta», e il pulsante «Rifai N errori» con N uguale
     al segmento «da rifare». In schermata non compaiono «aperto», «ripreso»,
     «coperto». Scartato «da ripassare»: nei Quiz «Ripasso degli errori» apre
     tutti gli errori di sempre, e la stessa parola indicherebbe due liste.
  4. *(su delega)* **La vela**: le sue tre voci fanno da righe, in ordine di
     banca. Un peso per voce non esiste, e non si inventa.
  5. *(su delega)* **«X su Y giusti al primo tentativo»**, con X le esatte alla
     prima risposta e Y i visti, numeri esatti e non frazioni arrotondate — lo
     stesso Y di «Visti Y su N». Si dichiara che conta solo la prima volta e non
     migliora ripassando: col ripasso si muove la barra. Sotto soglia nessun
     numero, ma «troppo poche risposte per dire come va».
  6. *(su delega)* **La frase in cima la decide una regola del motore**, che
     restituisce anche il motivo e le selezioni dei pulsanti. Sotto soglia, o
     senza un'indicazione fondata, la frase non compare. La soglia entra nel
     §4.3 con le altre.
  7. *(su delega)* **Niente minuti sui pulsanti** dell'area 5, finché non c'è
     una stima verificata (R-TEMPO-01/02): nel prototipo «66 errori · circa 99′»
     faceva 90 secondi a domanda, contro i circa 23 dell'archivio vero.

  Due fatti trovati nel confronto, che diventano lavoro del motore:
  `coda({ soloSbagliate })` include anche gli errori già ripresi e li mette in
  fondo, quindi «Rifai N errori» aprirebbe gli N giusti solo per ordinamento e
  tetto, non per contratto — serve un filtro esplicito —; e `peggiori()` conta
  gli errori alla prima risposta, che ripassando non calano. **Chiusi da P-41**
  (29 settembre 2026): `coda({ soloDaRifare })`, la mappa di `quadro()`, la
  frase di `dovePesa()`, e `peggiori()` fuori dal motore — §4.2, §4.3, §9.10.

- **Non si traccia lo studio esterno** (8 settembre 2026). Nessuna lista di
  argomenti da spuntare: non la compila nessuno. Il costo è dichiarato: l'app non
  può distinguere «sbagliato perché non l'ho studiato» da «sbagliato pur avendolo
  studiato», e non deve fingere di saperlo.
- **La composizione delle 20 domande è ministeriale** (9 settembre 2026):
  Allegato C al DM 323/2021. Resta non ministeriale la ripartizione *dentro* un
  tema.
- **Q-ACCESSO: l'account serve per salvare, non per usare** (25 settembre 2026,
  ADR-004). Senza account si fanno tutte le attività e non resta niente; con
  l'account si salva e si vedono i Progressi. Chiusa con quattro condizioni,
  §2.4.

---

## 11. Come si lavora

**Due agenti, e il confine lo fa rispettare git.** `territori.yaml` dice chi tocca
che cosa e il `pre-commit` rifiuta un commit fuori territorio. Il motivo per
esteso è in `AGENTS.md`; il precedente è l'ADR-004 di `Standards`.

**Il ciclo**, da `dev-standards`:

```
BRAINSTORM → SPECIFICA → IMPLEMENTA → REVIEW → RILASCIO
```

Questo documento è la casella **SPECIFICA**, e non si salta: si scopre la
decisione mancante mentre costa una frase, invece che dopo, quando costa una
riscrittura.

**Prima il test che fallisce, poi la correzione.** Un test scritto dopo dimostra
che il codice fa quello che fa; scritto prima dimostra che il difetto c'era e non
c'è più.

**Verificare empiricamente, sempre.** Riprodurre e misurare, non dedurre dal
codice. Per una modifica che si vede, la verifica è **guardarla**: screenshot o
`getComputedStyle`. Leggere il testo nel DOM dimostra solo che il testo è stato
scritto.

**I comandi:**

```bash
node --test tests/test_engine.mjs    # il motore — 109 test al 9 settembre 2026
python3 tests/test_dati.py           # dati e invarianti — 193 verifiche
python3 tests/test_specifica.py      # ogni requisito ha il suo controllo
python3 tests/test_interfaccia.py    # le porte, le modalità, e la pagina in Chrome headless
node --test tests/test_server.mjs    # il server degli account, e il ripristino provato
python3 strumenti/serve.py           # il sito in locale, come lo serve statichost.eu
```

**Chiusura di sessione.** Su `ui/*`: test verdi, voce di CHANGELOG in fondo a
`[Unreleased]`, un commit col trailer, **la versione non si tocca**. Su `main`:
test verdi, un commit; il rilascio è un commit a sé dopo la merge. Niente push
senza chiedere; e su `rottagiusta.it` il push non basta: il sito si pubblica con
«Build now» su statichost.eu, che non ha un webhook sul repo.

---

## Appendice A — Confronto con le pratiche correnti

**Fatto il 9 settembre 2026.** Va riletto con una data davanti: una sezione
«best practice» senza data invecchia e comincia a suonare autorevole.

Il confronto distingue due cose che di solito vengono confuse. Ci sono pratiche
**misurabili** — un rapporto di contrasto o un'area di tocco si misurano e
passano o non passano — e ci sono **opinioni di progettazione**, per quanto
diffuse. In questo progetto le prime sono requisiti, le seconde sono materiale
per una decisione.

### Dove il progetto è già sopra la media, e non per caso

- **Dichiara i propri difetti** quesito per quesito. Non è una pratica diffusa: è
  il contrario di quella diffusa.
- **Ogni soglia è dichiarata** e nessun numero si mostra sotto la sua (§4.3). La
  pratica corrente è mostrare comunque una percentuale, che è il modo standard di
  fabbricare fiducia senza misura.
- **Niente gamification**: nessuna streak, nessun badge, nessuna notifica. È una
  divergenza consapevole dalla pratica dominante nelle app di studio, ed è
  coerente col pubblico: chi prepara un esame in poche settimane non ha bisogno
  di essere trattenuto, ha bisogno di sapere dove è scoperto.
- **Un imbuto dichiarato, e nessun dark pattern.** Il 9 settembre qui c'era
  scritto «nessun dark pattern possibile: non c'è account, non c'è un imbuto».
  Dall'ADR-004 un imbuto c'è — per salvare bisogna registrarsi — e quindi un
  dark pattern è **possibile**: non lo impedisce più l'architettura, lo
  impediscono promesse con il loro controllo. Si prova senza account, tutte le
  attività (R-ACC-04); che non resta niente si dice prima e dopo (R-ACC-02);
  l'invito sta nel riepilogo, con i vantaggi che esistono, e «Continua senza
  account» lo chiude senza chiedere altro (R-ACC-03); le risposte non si tengono
  per nasconderne le misure. Niente da vendere, come prima.
- **Offline-first vero**, verificato misurando **zero byte trasferiti** a pagina
  ricaricata, e non dedotto dalla presenza del service worker.
- **Errori con una via d'uscita** e non rimproveri.
- **Progressive disclosure** già applicata: le spiegazioni `?` accanto ai numeri
  derivati, e funzionano al tocco oltre che in hover.

### Le misure da rifare sul tema chiaro

La tavolozza scura è stata misurata voce per voce nella 0.21.0, con due valori
alzati perché non passavano. **Il tema chiaro va misurato allo stesso modo,** e
non c'è scorciatoia:

| Criterio | Soglia | Stato |
|---|---|---|
| Contrasto testo normale | ≥ 4,5:1 (WCAG AA) | da rifare sul chiaro |
| Contrasto testo grande | ≥ 3:1 | da rifare |
| Contrasto di elementi non testuali (bordi, stati) | ≥ 3:1 | da rifare |
| Aree di tocco | ≥ 44 px sul telefono | misurato a 58 px sul prodotto attuale |
| Sbordamento orizzontale a 375 px | 0 | 0 in Progressi nel collaudo di P-23 (30 settembre 2026), dove la mappa ha sostituito le due tabelle che sforavano di 89 px dalla 0.3.0; non lo ripete un controllo |
| Reflow senza scorrimento orizzontale | fino a 320 px | mai verificato |
| Ingrandimento del testo | fino al 200 % | mai verificato |
| Fuoco da tastiera visibile ovunque | sì | mai verificato per intero |
| Nessun significato affidato al **solo** colore | sì | il semaforo ha tre stati e usa anche la parola: da riverificare sul chiaro |
| Lettore di schermo sui percorsi principali | sì | mai verificato |

**Un argomento misurabile a favore del tema chiaro**, che le bozze non hanno
usato: le figure del decreto sono servite su fondo bianco, quindi oggi c'è una
cucitura bianca dentro una schermata navy su 119 quesiti con figura. Su superficie
chiara sparisce.

### Dove il prodotto attuale non è allineato

- **Sette voci di barra** superano il limite consigliato dalla pratica corrente
  (cinque). La riduzione a quattro lo risolve.
- **Icone geometriche astratte** (cerchio, rombo, quadrato…) che non portano
  significato: la parola sotto fa tutto il lavoro. Se l'icona non aiuta a
  riconoscere, occupa spazio verticale per niente.
- **Il primo elemento della prima schermata è un filtro** che a chi comincia non
  serve, e il primo campo chiede una data che spesso non c'è.
- **Il pallino ambra è acceso alla prima apertura**, perché l'offline non è ancora
  pronto. È corretto per la regola di casa — un guasto muto deve restare visibile
  — ma per chi apre il sito la prima volta è un allarme senza causa. È una
  tensione fra due principi giusti, e non ha ancora una risposta.

### Il limite di questa appendice

Nessuna di queste righe è stata verificata con una persona diversa dall'autore.
Una preferenza estetica non dimostra usabilità; una prova di usabilità non
dimostra efficacia didattica. Le prove con persone sono Q-PROVE.

---

## Appendice B — Che cosa questo documento ha assorbito

| Documento | Che cosa ne è stato | Stato |
|---|---|---|
| `docs/motore.md` | assorbito nei §3, §4, §11 | diventa un puntatore a qui |
| `docs/specifiche-ux.md` | decisioni → §6 e §10; flussi → §7; stati → §8 | materiale storico, non si aggiorna più |
| `docs/riscontro-ux.md` | i rischi ancora vivi → §6.3, §10, appendice A | materiale storico |
| `docs/percorso-ux.md` | metodo → §11 | materiale storico |
| `docs/prototipi/rotta-2026-09-09/` | bozze visive | resta com'è: è un artefatto datato, non una specifica |

I tre `*-ux.md` **restano sul disco** e restano nel territorio `interfaccia`:
raccontano come si è arrivati alle decisioni, e quella storia ha valore. Non
vanno più aggiornati, perché una decisione scritta in due posti diverge — è
successo, ed è il motivo per cui questo file esiste.

---

## Registro

- **9 settembre 2026 — prima stesura.** Nasce da due fatti dello stesso giorno:
  la schermata «Che tecnica serve?» che perde il suo unico ingresso senza che
  niente lo segnali, e `E.peggiori()` che resta senza chiamanti. Entrambi trovati
  guardando, non deducendo: la pagina è stata servita in locale dal worktree
  dell'interfaccia e interrogata nel browser. Nessuno dei due avrebbe fatto
  fallire un test, perché non esisteva un elenco di che cosa deve esistere.
  Il documento assorbe `motore.md` e i tre documenti UX; i requisiti del §9 sono
  41, di cui **34 con un controllo eseguibile** e 7 dichiarati scoperti
  con il loro motivo.

- **25 settembre 2026 — il §2 dopo l'ADR-003.** Account obbligatorio e righe sul
  server in chiaro: dei sette Vincoli ne cadono quattro (account, backend,
  sincronizzazione, cookie e form), e il §2 li separa in che cosa resta, che
  cosa cade e che cosa si perde. Entrano «Nessuna modifica alla banca» fra i
  Vincoli, perché l'ADR la nomina fra quelli da difendere e qui mancava, e
  Q-ACCESSO nel §10. Le sezioni che descrivono ancora il prodotto senza account
  sono elencate nel §2.5 e non riscritte: dipendono dal progetto di
  realizzazione. Corretto per traverso un rimando: la correzione del carteggio
  sta nel §4.5, non nel §7.5.
- **25 settembre 2026 — Q-ACCESSO chiusa dall'ADR-004.** L'account serve per
  salvare, non per usare: senza account si fanno tutte le attività e non resta
  niente, e i Progressi sono dei registrati. Il §2 perde due perdite
  dell'ADR-003 (il primo quesito senza chiedere niente, l'offline alla prima
  visita) e ne guadagna una, dichiarata: chi non si registra non ha più
  l'archivio nel browser che fino a oggi aveva chiunque. Il §2.4 porta le
  quattro condizioni della decisione; nuovo §9.9 con sei requisiti, cinque
  scoperti con il motivo e uno coperto dal test che esiste già. Entrano anche
  l'onboarding di chi si registra, deciso dall'autore, con la data che resta
  facoltativa, e Q-ONBOARD nel §10 per il suo contenuto e per un piano di
  studio strutturato.
- **26 settembre 2026 — `validaRiga()` e quattro requisiti di accesso.** La
  regola che dice se una riga è buona sta ora nel motore, sola, e l'import la
  usa: misurata sull'archivio vero prima di fissarla, 2.341 righe su 2.341. Le
  righe di tag, che nascono senza data, non si scartano più. Entrano R-ACC-07 e
  08, coperti, e R-ACC-09 e 10, scoperti con il motivo, dalle decisioni
  dell'autore: senza account niente nel browser, nemmeno le preferenze; la
  password lunga almeno 15 caratteri, come NIST.
- **26 settembre 2026 — R-ACC-11.** Un account con l'email non confermata vive
  sette giorni, poi si cancella con le sue righe: deciso dall'autore sui
  riferimenti di `docs/account-progetto.md` §9.6 (Mastodon 7, Discourse 14;
  nessuno standard).
- **26 settembre 2026 — R-ACC-20 e R-ACC-24, la quinta suite.** Nasce
  `server/`, nel territorio `motore`, con un server che risponde solo alla
  salute e la copia di sicurezza con il ripristino provato:
  `tests/test_server.mjs`, verde con Node 25.3 e con la 24.21.0 LTS della
  macchina. Entrano i due requisiti che il §2.7 di `account-progetto.md` aveva
  proposto per la copia e per l'epoca, con il loro controllo.
- **26 settembre 2026 — R-NAV-04 e R-NAV-05 per due regimi, e R-NAV-07.** Il
  progetto dell'area 2 sostituisce le sei modalità dei quiz con cinque
  intenzioni e i filtri globali con filtri locali; i controlli pretendevano
  ancora le sei. Ora riconoscono il regime attuale e quello progettato, e nel
  secondo eseguono la selezione invece di leggere i nomi. R-NAV-07 tiene
  acceso quel ramo finché la pagina pubblicata non lo usa: senza, sarebbe un
  controllo scritto e mai eseguito. Il §5, che descrive ancora Batteria e il
  selettore globale, lo aggiorna chi integra P-05, con la pagina che cambia.
- **26 settembre 2026 — l'account del server (P-09).** R-ACC-10 e R-ACC-11
  passano da scoperti a un test in `test_server.mjs`, il secondo per la metà del
  server; entrano R-ACC-16, 17, 21, 25 e 26, proposti dal progetto degli
  account, e tre nuovi nati scrivendo il codice: R-ACC-27, i cento tentativi del
  §6.5 di quel progetto; R-ACC-28, la password dimenticata che non dice chi è
  iscritto; R-ACC-29, i gettoni monouso e a tempo. Ognuno è stato provato al
  contrario. Il paragrafo sotto la tabella del §9.9 dice che cosa i controlli non
  vedono, compresa la registrazione che dice chi è iscritto, aperta per
  l'autore.
- **26 settembre 2026 — le righe del server (P-10).** Entrano R-ACC-12, 13,
  14, 15 e 18, proposti dal progetto degli account, e tre nati scrivendo il
  codice: R-ACC-31, il cursore che un invio non deve spostare — l'`ultima_seq`
  di un invio conta anche le righe di un altro dispositivo, e un cursore messo
  lì le salterebbe per sempre —; R-ACC-32, il `413` che si legge; R-ACC-33, le
  pagine della ricezione. R-ACC-24 passa da coperto per metà a coperto per
  intero. Ognuno è stato provato al contrario: tredici rotture, ognuna rossa
  in almeno un test.
- **26 settembre 2026 — il pezzo che chiude le rotte (P-11).** R-ACC-30 passa
  da scoperto a coperto: «email già registrata» con `409`, senza sessione né
  mail. Entrano R-ACC-19, proposto dal progetto degli account, e cinque nuovi:
  R-ACC-34 il cambio d'indirizzo, R-ACC-35 il profilo con i punteggi dei
  Segnali, R-ACC-36 i due anni, R-ACC-37 gli allarmi al titolare, R-ACC-38 il
  conto delle 300 mail. Ognuno è stato provato al contrario: ventisei
  rotture, tutte rosse nel loro test.
- **26 settembre 2026 — la pagina in un browser vero (P-29).** Misurate le
  strade per guidare un browser dalla suite: regge Chrome headless con il suo
  protocollo su una pipe, senza dipendenze. R-ACC-01, 02 e 09 passano da
  scoperti a coperti, R-ACC-02 e 09 in due regimi; entrano R-ACC-41, il `409`
  visto dalla pagina, e R-ACC-42, le rotture che tengono acceso il regime
  progettato. R-ACC-04 resta scoperto con un motivo più stretto. Ventitré
  rotture della pagina di riferimento, tutte rosse nel loro controllo, e il
  banco contro sé stesso: cinque sue difese tolte una alla volta, e ogni volta
  una rottura passa verde.
- **26 settembre 2026 — il confine dell'attività (P-30).** Il progetto
  dell'area 3 aveva trovato, e la regia riprodotto, un'attività registrata
  ripresa dopo 21 minuti che `erroriSessione()` riapriva a metà dichiarando
  il confine registrato. §4.4 porta ora i due confini; entrano R-FLU-05…09 e
  R-TEMPO-08, tutti coperti. Ogni controllo è stato provato al contrario:
  quindici rotture del motore, tutte rosse nel loro test.
- **26 settembre 2026 — il trasferimento verso l'account (P-28).** Il progetto
  del client chiedeva al motore due risultati che la pagina non deve calcolare
  da sé. Misurato prima di scriverli: le sei funzioni della coda non bastavano.
  «Salvata» dedotta dall'assenza dalla coda dà per salvate le righe dopo un
  azzeramento scelto e una riga mai messa in coda; e una riga troppo grande in
  testa alla coda faceva restituire `null` a `lottoDaInviare()`, con le altre
  ferme dietro. Entrano R-ACC-39 e R-ACC-40, coperti, e un test del server
  che esegue contro il server vero l'esempio d'uso scritto nel progetto del
  client. Quindici rotture del motore, tutte rosse nel loro test; quattro di
  loro rosse anche nel test del server.
- **26 settembre 2026 — i controlli del ciclo (P-31).** Il progetto dell'area 3
  chiedeva, prima della sua realizzazione, controlli che eseguano il ciclo
  invece di cercarne i nomi, in due regimi come quelli dell'area 2. §4.4 e §7.5
  descrivono il ciclo che si chiude; R-FLU-01 passa da scoperto a coperto per i
  quiz, e dichiara scoperti carteggio, tecniche e Segnali; R-FLU-02…04 dicono
  che cosa tiene il motore; entrano R-FLU-10, la riprova nella colla fra pagina
  e motore, e R-FLU-11, le rotture che tengono acceso il regime progettato;
  R-UX-06 dice quale metà è coperta. Il contratto delle tre funzioni di
  raccordo è nel §10.1 di `area-3-progetto.md`. Ventisette rotture della
  pagina di riferimento, tutte rosse nel loro controllo, e il banco provato
  contro sé stesso.
- **26 settembre 2026 — il §7.6 smette di promettere.** «Salvato a ogni tasto»
  era scritto come Vincolo e non era vero dalla 0.5.0: il testo del carteggio
  sta solo in memoria. Trovato da P-20, verificato dalla regia; il paragrafo
  dice ora che cosa vale oggi (l'avviso e la conferma del browser, P-36) e dopo
  (la bozza con l'account, P-34).
- **29 settembre 2026 — Q-DUE chiusa, due questioni rimandate.** Progressi
  diventa una mappa per tema, con i sette punti della decisione nel §10; le due
  classifiche escono dalla pagina. Entrano Q-SUITE — la suite dell'interfaccia
  che dura un minuto — e Safari dentro Q-PROVE, tutte e due rimandate
  dall'autore e scritte perché non si perdano.
- **29 settembre 2026 — il motore della mappa (P-41).** I due fatti di Q-DUE
  diventano contratti: `coda({ soloDaRifare })` accanto a `soloSbagliate`,
  `quadro()` con i tre stati e «X su Y», `dovePesa()` con la frase e i suoi
  quattro modi di mancare; soglie nuove nel §4.3, `PRIMA_MIN_VISTI` e
  `FRASE_MIN_VISTI`. `peggiori()` esce dal motore, `consigli()` esce in due
  tempi con l'area 5: i chiamanti e il perché nel §4.3. Nuovo §9.10, tredici
  requisiti coperti e uno scoperto. Ventiquattro rotture del motore, tutte
  rosse nel loro test; tre erano passate verdi alla prima stesura, e il test
  che le prende è stato scritto dopo.
- **29 settembre 2026 — il resto dei controlli del client (P-39).** Sullo
  stesso banco: C-01 completo, C-03, C-04, C-06, C-11 e C-15. R-ACC-03 e 04 da
  scoperti a coperti; entrano R-ACC-43…46. Trentatré rotture nuove della
  pagina di riferimento, tutte rosse ognuna per il suo motivo; una era passata
  verde per una ragione di tempo misurata — il timer di una scheda in secondo
  piano — ed è stata sostituita con quella che il §9.1 del progetto del client
  nomina. Dieci gruppi restano da scrivere, e lo dicono.
- **29 settembre 2026 — le tre scelte di `dovePesa()` confermate.** L'autore
  conferma la vela senza frase, la soglia a 20 e la regola del motivo, prese da
  P-41 su delega; il §4.3 lo dice.
- **29 settembre 2026 — i gruppi del client che restavano (P-43).** C-07…C-10,
  C-12…C-14, C-16…C-18 e il resto di C-15: R-ACC-05 da scoperto a coperto, nuovi
  R-ACC-47…57, uno del server — il `Retry-After` che il CORS non esponeva, trovato
  misurando. Cinquantatré rotture nuove della pagina di riferimento, tutte rosse
  per il loro motivo; tre verdi falsi del banco trovati facendolo girare, e un
  banco che si appendeva, corretti. Il §12 del progetto del client dice che cosa
  resta fuori.
- **30 settembre 2026 — un regime solo per il client (P-40).** P-18 è fuso, e il
  banco guida ogni pagina come una pagina con il client: la pagina senza
  `indirizzoApi()` è rossa, nel controllo statico di R-ACC-58, nuovo, e in 16
  gruppi su 17 — provato sulla pagina di `f218935`. R-ACC-02, 09, 41, 42 e 57
  perdono i due regimi; entrano R-ACC-59…63, scoperti con il motivo, per quello
  che il banco non vede. La pagina di riferimento resta per le rotture.
- **30 settembre 2026 — i controlli della mappa di Progressi (P-44).** Il §10.1
  del progetto dell'area 5 chiedeva, prima della sua realizzazione, controlli
  che eseguano la mappa invece di cercarne i nomi, in due regimi come quelli
  delle aree 2 e 3. Il contratto del raccordo — `mappaProgressi()`,
  `anteprimaProgressi()`, `avviaProgressi()` — è nel §10.1 di quel progetto;
  R-MAPPA-14 passa da scoperto a coperto per quello che il banco esegue, ed
  entrano R-MAPPA-15, le azioni, R-MAPPA-16, le rotture, e R-MAPPA-17, i testi e
  il disegno, scoperto. Ventitré rotture della pagina di riferimento, tutte
  rosse per il loro motivo; il §4.3 porta una misura sul `pari` che il banco ha
  trovato da solo.
- **30 settembre 2026 — le tre scelte che nessuno premeva (P-46).** R-ACC-63
  si divide: 63, 64 e 65 coperti, uno per scelta, sulla pagina vera; tredici
  rotture nuove della pagina di riferimento, tutte rosse per il loro motivo, e
  un verde del banco che non misurava niente — la copia, al momento della
  domanda, era vuota su tutte e due le pagine —, corretto. Entra R-ACC-66,
  scoperto: un difetto della pagina, i pulsanti di conferma muti senza la
  spunta.
- **30 settembre 2026 — il documento per i due stati (P-26).** Le parti che il
  §2.5 elencava come vere solo senza account sono riscritte: §3, con un titolo
  nuovo e il server degli account nel §3.7; §4.6; §5.3 e §5.4, con i controlli
  dell'accesso; §7.1, §7.4, §7.8; l'Appendice A. Due parti fuori dall'elenco
  erano false anche loro, e sono corrette: i punteggi dei Segnali nel §4.5, e
  *Vuoto* e *Interruzione* nel §8. Il §2 dice che la decisione è nel prodotto
  su `main` e non ancora in quello pubblicato; il §2.5 dice che cosa è
  cambiato. Nessun requisito nuovo: quelli che tengono le frasi nuove ci sono
  già, e sono citati accanto a ognuna.
- **30 settembre 2026 — un regime solo per Progressi, e `consigli()` fuori
  dal motore (P-47).** P-23 ha portato la mappa nella pagina vera, e il banco
  di P-44 gira ora su ogni pagina come su una pagina con la mappa: senza il
  raccordo è rossa, e anche con le tabelle di prima accanto alla mappa — una
  rottura nuova, la ventiquattresima, lo prova —, e la pagina vera deve fare
  tante verifiche quante la pagina di riferimento. Provato sulla pagina di
  prima di P-23: otto verifiche rosse della mappa. R-MAPPA-14 e 16 senza i due
  regimi, R-MAPPA-17 scoperto con il motivo di oggi. `consigli()` esce dal
  motore con `CONSIGLIO_MIN_VISTI` e i suoi sette test, dopo che P-23 ne aveva
  tolto l'ultima chiamata: §4.3 e §5.4. Il §7.4 chiude il difetto delle tabelle
  che sforavano dalla 0.3.0, sulla misura del collaudo di P-23.
- **30 settembre 2026 — R-ACC-66 coperto (P-49).** P-48 ha corretto i due
  pulsanti di conferma muti, e il controllo entra sulle parti di P-46:
  C-13:scarica e C-08:cancella, premuto il pulsante senza la spunta, guardano
  prima che né la copia né il server cambino, poi che la finestra nomini la
  casella che manca in testo che si vede. Nuovo
  `test_client_conferma_mancante`. Undici rotture nuove della pagina di
  riferimento — il silenzio, il messaggio in un elemento che non c'è, nascosto,
  fuori dalla finestra, generico, e l'azione fatta lo stesso —, tutte rosse per
  il loro motivo; il banco contro sé stesso su tre difese. La pagina di prima
  di P-48 (`9ae8359`) è rossa sulle due verifiche nuove, e solo lì.
- **30 settembre 2026 — la prova di carteggio nel motore (P-32).** D-01 del
  §10.1 di `area-4-progetto.md`: la composizione che stava in `componiProva()`
  della pagina è ora `provaCarteggio()`, con le condizioni 4/60/3 in
  `PROVA_CARTEGGIO` accanto alla loro fonte e all'assunzione Q-CART4. Dalla
  stessa chiamata la lista, gli argomenti rappresentati e mancanti, il
  completamento su una banca incompleta, le riprese della variante e le carte;
  la prova cieca non conta riprese, e lo dice con `null`. `estrai()` resta
  cieca, `estraiNuoviPrima()` com'era: i loro chiamanti, elencati prima, non
  cambiano. Nuovi R-SEL-12…16, coperti, e R-SEL-17, la pagina, scoperto finché
  non la realizza P-21. Diciotto rotture del motore, tutte rosse; due le vedeva
  solo il test che si ritirerà con la copia della pagina, e per una c'è ora
  un'asserzione che resta.
