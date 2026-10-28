# Rotta Giusta — la specifica

**Data:** 9 settembre 2026.
**Prodotto di riferimento:** la v0.32.0, il ridisegno, dal 20 ottobre 2026; la
v0.30.0 era la versione con gli account e senza offline, dal 3 ottobre. La prima stesura descriveva la v0.22.1 pubblicata,
più il lavoro allora in corso sul ramo `ui/main`. **Dal 15 ottobre 2026 (P-80)
il §5, il §6 e il §7 descrivono il ridisegno** deciso dall'autore e progettato da
P-79. La pagina su `main` lo ha dal 20 ottobre 2026 (P-81, merge `ebe2e47`), e
da P-89 i controlli conoscono soltanto lui (§6.2); il sito pubblicato lo ha
dalla v0.32.0, il rilascio del 20 ottobre 2026.
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

**Il sito accompagna una preparazione, non la sostituisce.** Spieghiamo perché
una risposta è quella giusta, e lo diciamo quando la spiegazione è nostra e non
del decreto. Non sostituiamo la scuola né il manuale. Il gioco dei Segnali
insegna per davvero, ed è l'unica parte scritta interamente dall'autore.

*Deciso il 4 ottobre 2026 (ADR-006, decisioni 11 e 28 di P-59).* Fino ad allora
qui c'era scritto «non insegna: allena e dà riscontri», e della pagina di oggi
è ancora vero: le spiegazioni non ci sono, e quando ci saranno usciranno solo
verificate dall'autore, dopo la risposta e mai prima (§10).

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

**La decisione è nel prodotto pubblicato dalla v0.29.0**, il rilascio del 3
ottobre 2026. La pagina ha il client degli account (P-18) e i testi di `site/`
che lo dicono; il server è in esercizio su `api.rottagiusta.it` (P-15); questo
documento, `README.md`, `AGENTS.md` e la skill del progetto descrivono il sito
con gli account (P-26). Fino alla v0.28.1 chi apriva `rottagiusta.it` trovava
il sito di prima, senza registrazione e con tutto nel browser, e `main` non si
è pushato finché il rilascio non c'era. Testi e prodotto sono cambiati **nella
stessa versione** — non prima e non dopo. Un'informativa che descrive un server che
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
| **Nessun analytics** | L'ADR-003 chiede statistiche, e si fanno **leggendo le righe delle risposte** che il server già conserva. Non autorizzano script di terzi, né il tracciamento della navigazione. Chi si oppone esce da ogni conteggio, e le sue risposte restano nel suo account (R-ACC-67, §3.7). |

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
perdite toccano chi si registra, la quarta chi non lo fa, la quinta chi
studiava prima degli account, la sesta tutti.

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
5. **Per chi aveva risposte nel browser prima del 3 ottobre 2026, e non le ha
   portate né scaricate, quelle risposte** — dall'ADR-005, che toglie il
   passaggio dell'archivio di prima. Non si cancellano: restano nel suo
   browser, e la pagina non le legge, non le mostra e non lo dice. Quante
   siano queste persone non si sa. È una perdita scoperta dopo, scelta
   apposta, e l'ADR-005 dice perché e con quali frasi di `docs/filosofia.md`
   è in tensione.
6. **L'offline, per tutti** — dall'ADR-005. Senza rete il sito non si apre,
   nemmeno dall'icona sulla schermata Home e nemmeno con l'account; «anche in
   barca» esce dalla Home. Una pagina già aperta continua, e con l'account
   quello che si risponde senza rete resta nella copia del dispositivo e parte
   quando la rete torna (§3.2). In cambio sparisce la seconda ricarica dopo un
   rilascio.

**E un imbuto, più piccolo di quello dell'ADR-003 ma vero:** per salvare bisogna
registrarsi. L'ADR-004 lo sposta dal primo quesito alla fine della prima
attività; non lo toglie.

**Che cosa si compra con questo prezzo:** chi si registra non perde più tutto
cambiando telefono o svuotando il browser — il difetto più grave che il prodotto
aveva verso chi lo usa — e chi scrive per un problema si può aiutare guardando i
suoi dati. E di chi non si registra non resta niente, da nessuna parte.

### 2.4 Come si entra — Deciso il 25 settembre 2026 (ADR-004)

Chi arriva fa il primo quesito **senza account**. Fino al 3 ottobre 2026
l'offline funzionava dalla prima visita; l'ADR-005 l'ha tolto (§3.5). L'ADR-003
aveva scelto la registrazione obbligatoria per usare il sito; l'ADR-004 la
sostituisce, perché nessuna delle tre aspettative dell'ADR-003 la richiedeva e
il suo costo cadeva sul primo ingresso (§7.1).

Senza account i Progressi non ci sono, e **non è un ricatto**: sono misure su
uno storico, e senza salvataggio lo storico non esiste. Il ricatto sarebbe stato
salvare le risposte nel browser e nasconderne le misure; è l'alternativa
scartata dall'ADR-004.

Quattro condizioni fanno parte della decisione, e sono R-ACC-02…05 nel §9.9.
La quarta l'ha sostituita l'ADR-005, il 3 ottobre 2026; la seconda l'ADR-006,
il 4 ottobre 2026:

1. **Senza account si dice che non resta niente**, prima di cominciare e alla
   fine di ogni attività.
2. **La registrazione si raccomanda con i vantaggi veri, in tre posti**
   (ADR-006): nella Home, a chi ha risposto senza account; nel risultato di
   una simulazione; nei riepiloghi delle attività. Fuori da quei tre posti non
   c'è un invito, né durante un'attività né a ogni schermata. Nessuna metrica
   si promette sotto le soglie del §4.3, e risultato e revisione restano a chi
   non si registra. Fino al 4 ottobre 2026 la condizione diceva «quando c'è
   qualcosa da perdere — la fine di un'attività — e non a ogni schermata», ed è
   ancora quello che la pagina fa e che R-ACC-03 tiene fermo: cambiano con il
   progetto del ridisegno (§10, decisione 12).
3. **Senza account non si toglie niente apposta**: tutte le attività, con
   riepilogo e revisione della sessione. Ai registrati restano solo le viste che
   vivono di uno storico.
4. **L'archivio di prima degli account resta nel browser, e la pagina non lo
   guarda** (ADR-005): non lo legge, non lo cancella, non ne dice niente, e
   niente ne passa nell'account. Fino al 3 ottobre 2026 la condizione era
   l'opposto — «un archivio che esiste già non sparisce in silenzio: chi ha le
   risposte nel browser il giorno del rilascio le porta nell'account o le
   scarica» —, e la v0.29.0 l'ha rispettata con un passaggio; l'autore l'ha
   tolto lo stesso giorno, con il criterio che per chi arriva dalla v0.29.0
   l'esperienza non cambia. Il prezzo è la perdita 5 del §2.3.

**Deciso il 25 settembre 2026, dall'autore:** chi si registra passa da un
**onboarding**, che raccoglie fra l'altro la data d'esame. La data vi resta
**facoltativa**: lo è per il §7.1 e per R-STA-01 — chi comincia da zero spesso
non ce l'ha, e senza data il motore non inventa quota né semaforo — e un
onboarding non la rende obbligatoria senza una decisione che lo dica. Che
cos'altro chieda, e se il sito consigli un piano di studio strutturato, è
Q-ONBOARD nel §10: chiusa il 1° ottobre 2026, e decisa di nuovo il 4 ottobre
dalle decisioni 13 e 16 di P-59 — l'onboarding chiede anche «che cosa stai
preparando?», e il Percorso diventa una mappa con il «sei qui».

**Deciso il 26 settembre 2026, dall'autore:** senza account nel browser **non
resta niente, nemmeno le preferenze** — filtri, modalità automatica, ordine
della diagnosi. La proposta di tenerle, perché non sono risposte, è stata
scartata: la promessa si legge alla lettera. Dall'ADR-005 non resta nemmeno la
cache del sito, che non conteneva niente di chi studia (R-ACC-09, R-ARCH-15). L'archivio di prima degli
account, se c'è, è nel browser per conto suo: la pagina non lo scrive, non lo
legge e non lo cancella (R-ACC-05, ADR-005). Il come di tutto il §2 sta in
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
  §3.4 aggiungono la ricezione dal server; il §3.5 diceva che l'API non entra
  nel guscio, e dall'ADR-005 dice che il guscio non c'è.
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

Le righe del §5 che descrivevano le sei modalità dei Quiz e il selettore
globale le ha riscritte P-12, il 30 settembre 2026, con il regime vecchio dei
controlli (§9.4). **Il 15 ottobre 2026 P-80 ha riscritto il §5, il §6 e il §7
sul ridisegno** (`docs/ridisegno-progetto.md`), con la pagina di prima conservata
nei paragrafi *Nel regime di transizione* e nel §6.2, fino alla merge di P-81.
P-81 è fuso il 20 ottobre 2026, e P-89 ha tolto quei paragrafi e, dai
controlli, il regime di prima.

E una cosa che c'è e resta: **il sito dichiara i propri difetti**, quesito per
quesito. Fra i concorrenti guardati il 3 ottobre 2026 nessuno lo fa, ma
chiunque potrebbe farlo: quello che ci distingue non è l'idea, è tenerla su
tutta la banca e a ogni rilascio. È il motivo per cui i 37 oscurati, gli 11
divergenti dal DM 133/2024 e le dieci figure riabbinate stanno in prima pagina
invece che in una nota. *(Corretto il 4 ottobre 2026, dopo il confronto con
ChatGPT in `docs/idee-dopo-gli-account.md`: qui c'era scritto «è l'unica cosa
che nessun concorrente può copiare», ed era più di quanto si sappia.)*

---

## 3. L'architettura: righe che viaggiano, e niente altro

Fino alla v0.28.1 qui c'era scritto «non c'è un backend», ed era vero. Con gli
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
         'b' segnalibro (da P-71) · 'a' avvio di una prova (P-72, §9.13)
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
proposti quanti esercizi aveva la lista proposta (carteggio e tecniche, da P-33)
pos      la posizione dell'esercizio in quella lista, da 0 (carteggio e tecniche, da P-33)
variante 'cieca' | 'nuoviPrima', solo nella prova di carteggio (da P-32)
tag      'N' | 'S' nelle righe di tag; 'L' | 'C' quelle di prima (da P-71)
segnato  1|0   (segnalibro: 1 lo mette, 0 lo toglie; da P-71)
```

**I tag e i segnalibri, dal 4 ottobre 2026** (P-71, decisioni 15 e 20 di P-59).
Un tag dice perché si è sbagliato: **«Non lo sapevo»**, `N`, lo stesso di
prima, e **«Svista»**, `S`, un codice nuovo. `L` «Letto male» e `C` «Calcolo»
sono della classificazione precedente: restano validi per sempre — una regola
che li rifiutasse farebbe scartare all'import e al server le righe di prima — e
non si riconvertono. «Svista» non riusa `L`, perché un `L` di prima e uno di
dopo sarebbero la stessa riga con due significati. Un segnalibro è una riga
`_t: 'b'` per gesto, con il quesito e `segnato`: togliere il segno è una riga in
più, non una cancellazione, e vale l'ultimo gesto per istante, come per i tag.
Non è una risposta (`rigaDiRisposta()` dice falso, `ripiega()` non lo legge).

**La riga d'avvio, dal 4 ottobre 2026** (P-72; `esito-esame-progetto.md` §4,
dove sta per esteso). A Inizia di ogni simulazione completa, e di ogni fase di
«Base e vela», la pagina con l'account scrive una riga `_t: 'a'`: la prova che
comincia (`sim_uid`, la sua `kind`, la scelta `prova`), l'istante, la versione
del motore e le `stime` dei metodi di previsione attivi — oggi uno,
`regola-semplice-1`, il metro che un modello dovrà battere. L'`uid` è il
`sim_uid` più «:a», quindi una seconda scrittura della stessa prova è un rinvio
e non una seconda previsione; la riga `_t: 's'` della consegna ha come `uid` lo
stesso `sim_uid`, e una prova abbandonata è un avvio senza consegna. La compone
il motore (`rigaAvvio()`), e un metodo che lancia non la toglie: c'è con
`errore`. **Non è uno specchio, ed è da dire perché sembra esserlo**: è un
numero calcolato dalle righe e salvato, la forma che il §3.3 vieta. La
differenza è che niente la rilegge per decidere o per disegnare — nessuna
funzione del motore che seleziona, misura o prepara una schermata guarda
`_t: 'a'`, e due controlli lo pretendono, uno sul sorgente e uno eseguendo
(R-PREV-02, R-PREV-08). È una testimonianza, non uno stato; il giorno in cui
una schermata la leggesse servirebbe una decisione. **Non è una risposta**:
`rigaDiRisposta()` dice falso, e ogni numero che la pagina scrive come
«risposte» la lascia fuori, compresi i due che le arrivano già contati dal
motore — `confermateRisposte` di un trasferimento, `nonSalvateRisposte` di un
conflitto (R-PREV-07, 11, 12). Senza account non si scrive, e nemmeno con un
server che non dichiara `'a'` in `tipi_riga` (R-PREV-05, 09). La pagina di oggi
non la scrive: la scriverà B-2, e fino ad allora P-01 pretende che non ci sia
(§9.13). **E il server non la raccoglie** finché la sua informativa non c'è
(P-86, §3.7): a raccolta spenta non dichiara `'a'` e la scarta con il motivo
«riga d'avvio non raccolta», anche da un import (R-ACC-83, 86).

**Come la pagina sa che il server li accetta.** Il server dice `tipi_riga` in
`GET /v1/io` (P-73), ed è `TIPI_RIGA` del suo motore: `'b'` c'è solo da P-71.
Un tag nuovo non ha un campo suo, e si riconosce dal tipo nato **nello stesso
commit**: un server che dichiara `'b'` ha un `validaRiga()` che accetta `S`, per
costruzione. Un server che non dice `tipi_riga` è della v0.30.0 o di prima, e
accetta `q c t s g` con `N L C`. Lo dice `rigaScrivibile(riga, tipiRiga)`, che
la pagina chiama prima di scrivere: un gesto che il server non accoglierebbe
non lo offre (R-TAG-02).

**Carteggio e tecniche: lo schema del 30 settembre 2026** (P-33, D-02 del §10.1
di `area-4-progetto.md`, dove sta per esteso). Ogni attività su carta — prova,
giro, tappeto — e ogni riconoscimento delle tecniche scrive un `sim_uid` nuovo
a ogni avvio, lo stesso su tutte le sue righe, con `proposti` e `pos`; la prova
anche `variante`, e resta la sola con una riga `_t:'s'`. La pagina
le scrive così dalla v0.29.0 (P-21, 30 settembre 2026). Fino alla v0.28.1
scriveva le righe di prima —
giro e tappeto con `sim_uid: null`, le tecniche senza legame, nessuna con
`proposti` o `pos` —; il motore legge quelle righe per come sono:
ricostruite e dichiarate, con quantità, ordine e variante «non registrati», mai
dedotti (§4.4).

È **append-only**: non si corregge una riga, se ne aggiunge un'altra.

**Dove vive dipende dall'accesso** (ADR-004; nella pagina da P-18):

- **Senza account, in memoria, e basta.** Le righe della pagina aperta non
  finiscono in IndexedDB, `localStorage`, `sessionStorage`, cookie o Cache
  Storage (R-ACC-09): una ricarica le perde, e la pagina lo dice prima di
  cominciare e alla fine di ogni attività (R-ACC-02). Registrandosi alla fine di
  un'attività, le righe di tutte le attività della pagina salgono sull'account
  (R-ACC-43).
- **Con l'account, sul server e nel dispositivo.** Il server le conserva in
  chiaro, byte per byte (§3.7, R-ACC-12). Il dispositivo ne tiene una copia, in
  un database IndexedDB per account, `rg-account-<chiave_locale>`,
  con righe e coda scritte nella stessa transazione (R-ACC-45). Le due copie si
  uniscono per `uid` (R-ACC-06): le righe non si modificano, quindi nessuna è in
  conflitto e nessuna vince. Una riga esce dalla coda solo quando il server la
  nomina (R-ACC-13), e la si dice salvata solo allora (R-ACC-39). All'uscita, la
  copia del dispositivo si cancella (R-ACC-46).

**Perché la copia del dispositivo c'è, senza offline.** Fino al 3 ottobre 2026
serviva anche ad aprire il sito senza rete, con il guscio del service worker.
L'ADR-005 ha tolto l'offline, e la copia resta com'è, per due ragioni che non ne
dipendevano: è **la coda**, che tiene le risposte date mentre la rete è caduta a
pagina aperta e le manda quando torna, e una ricarica non le perde; ed è dove
vive **la bozza del carteggio** (§7.6), che regge una ricarica a metà prova. Il
sito non si apre senza rete; quello che si è risposto prima che la rete cadesse
non si perde.

Fino alla v0.28.1 questa sezione diceva «l'unica copia», ed era la ragione per
cui cambiare telefono perdeva tutto. Oggi senza account di copie non ce n'è
nessuna, e con l'account ce ne sono due — ma **nessuna delle due è derivata**:
si uniscono righe, non stati, ed è per questo che non è la sincronia della
0.4.2 (§2.2).

La scelta di IndexedDB è misurata, non dedotta: una riga pesa 192 byte;
`localStorage` sta intorno ai 5 MB in Chrome e Safari, cioè ~27.000 risposte, e
**il modo in cui fallisce è il guasto di casa** — `setItem` lancia, e se nessuno
la prende la risposta sparisce mentre la schermata dice che va tutto bene.
IndexedDB nello stesso browser dichiara 3,7 GB, scrive 30.000 righe in 1,9 s.

**Non c'è più il ripiego su `localStorage`.** Fino alla v0.28.1, se IndexedDB
non si apriva, l'app ripiegava lì e lo dichiarava. Con l'account la copia del
dispositivo sta solo in IndexedDB; se non si apre, l'accesso lo dice, e la
pagina non scrive «salvato sul dispositivo» (`account-client-progetto.md`
§9.2). Senza account non c'è niente da aprire.

**La bozza del carteggio non è una riga** (§7.6, §9.11): sta nella copia
dell'account ma fuori dalle righe, non ha `_t`, `uid` né `ts`, e `validaRiga()`
la rifiuta. Il testo in corso non è una seconda contabilità: diventa righe solo
alla conclusione.

**Una riga entra solo se `validaRiga()` la accetta** (R-ACC-07), la stessa
funzione che il server importa dal motore: il browser e il server rifiutano le
stesse righe per gli stessi motivi. Le righe di tag (`_t: 'g'`) scritte prima
del 26 settembre 2026 sono le sole senza `ts`, e fino a quel giorno ogni import
le scartava (R-ACC-08); da P-01 i tag nascono con la data.

**Il database di prima si chiama `open-patente-nautica`**, il nome del progetto
fino alla 0.19.2. È l'archivio che chi studiava prima degli account ha nel
browser, con il ripiego `pn.archivio` in `localStorage` e le altre chiavi `pn.`
della versione di prima. **Dall'ADR-005 la pagina non lo apre, non lo legge e
non lo cancella** (R-ACC-05): restano nel browser di chi le ha. Fino al 3
ottobre 2026 la pagina lo leggeva per proporre di portarlo nell'account, e per
questo il nome non si rinominava: cercare un database che non c'è avrebbe fatto
sparire ogni risposta di prima dalla proposta **senza un errore**. Il motivo è
uscito con il passaggio; resta che quel nome non si riusa, e in `site/` non
compare più dal giorno in cui la pagina smette di leggerlo (R-ARCH-07).

### 3.3 Lo specchio — in memoria, **non si salva mai**

Per ogni quesito: `n` risposte, `c` esatte, `first` (1 se la prima era esatta),
`s` streak, `lw` giorno dell'ultimo errore, `k` riprese dopo un errore, `t`
giorno dell'ultimo tocco, `avg` tempo medio; e dal 4 ottobre 2026 (P-71) `gp` e
`gu`, l'istante in millisecondi della prima e dell'ultima risposta giusta della
serie in corso — la serie che `s` conta, che un errore chiude. Servono ai cinque
stati (§4.1): lo specchio di prima non portava gli istanti delle risposte
giuste, e «due giuste ad almeno 12 ore» non si poteva dire. `applica()` li
riceve come sesto argomento, il `ts` della riga; senza, restano vuoti e nessuna
conferma si inventa.

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

### 3.5 Niente offline — Deciso il 3 ottobre 2026 (ADR-005)

**Il sito si apre con la rete, e basta.** Fino alla v0.29.0 c'era un service
worker cache-first, con un guscio scritto in due posti, una cache per rilascio,
le 102 figure da scaricare con un pulsante e portate da un rilascio all'altro,
un'autodiagnosi in Info, e la **seconda ricarica** dopo ogni rilascio. L'ADR-005
li ha tolti per semplicità; il prezzo — senza rete il sito non si apre — è
scritto lì e nel §2.3.

- **La pagina non registra un service worker e non apre una cache**
  (R-ARCH-15). Le pagine e la banca arrivano dalla rete, con la cache del
  browser: statichost.eu le serve con `Cache-Control: public, max-age=0,
  must-revalidate`, un ETag e un `Last-Modified`, e risponde **304** quando il
  file è quello di prima — misurato il 3 ottobre 2026 su `/`, `/app`,
  `/engine.js`, `/dati/*.json`, `/figure/*`, `/manifest.json` e `/privacy`, con
  `If-None-Match` e con `If-Modified-Since`. Quindi una pagina e la banca
  arrivano fresche a ogni visita, e un rilascio si prende con **una** ricarica.
  `strumenti/serve.py` riproduce la riconvalida con la data (R-ARCH-12).
- **`site/sw.js` si toglie di mezzo** (R-ARCH-16, R-ARCH-17, R-ARCH-18). Chi
  ha visitato la 0.29.0 ha il suo service worker, che serve la pagina dalla
  cache: senza un file nuovo a quell'indirizzo resterebbe sulla 0.29.0 per
  sempre. Il file nuovo, quando il browser lo trova, si installa al posto di
  quello vecchio, cancella le cache del sito e si disinstalla; non ricarica le
  pagine aperte — senza account una ricarica perde le risposte —, non ha un
  gestore di `fetch` e non apre una cache. **Resta pubblicato almeno fino al 3
  ottobre 2028** (ADR-005), e lo toglie un prompt della regia.
  `site/_headers` lo tiene in `Cache-Control: no-cache`.
- **Gli indirizzi sono quelli puliti, non i nomi dei file**: `/privacy`, mai
  `/privacy.html`. La regola è nata sull'host precedente, Cloudflare Pages, che
  rispondeva **308** al percorso con l'estensione: una risposta rediretta nella
  cache del service worker **non si poteva servire a una navigazione**, e la
  pagina moriva con `ERR_FAILED` anche online (0.19.2). Non c'è più né
  quell'host né quella cache, e la regola **resta**: è lei che rende il sito
  indifferente all'host. Un test la tiene ferma (R-ARCH-05), e
  `strumenti/serve.py` riproduce in locale l'host di **oggi**, misurato.
- **Le figure** si caricano quando un quesito le mostra, come ogni altra
  immagine: niente pulsante, niente cache sua.

**Per P-61, la pagina** (ChatGPT, `ui/main`; il contratto, che i controlli del
§9 tengono):

- in `site/app.html`: via la registrazione di `/sw.js`; via `GUSCIO`, il
  pulsante «Scarica tutto per l'offline», l'autodiagnosi offline di Info con le
  sue righe e la parte del pallino ambra che la riguarda — il pallino resta per
  una scrittura fallita (R-STA-05) —, ogni `caches.open` e ogni ricerca di una
  cache `rg-`; la versione in Info si legge da `meta.json`, non dalla cache;
- ogni testo che promette l'offline o la seconda ricarica — la Home («anche
  in barca», le spunte dell'offline), l'app, Info, la privacy se nomina
  la cache del service worker — dice il sito di adesso; la frase della
  conservazione con l'account diventa quella del §11.2 del progetto del client;
- `site/_headers`: resta la regola di `/sw.js`, e il commento che dice «il resto
  lo governa sw.js, cache-first» diventa vero: il resto lo governa l'host, con
  `max-age=0, must-revalidate` e il 304. Nessuna regola nuova serve — misurato;
- `site/manifest.json`: resta com'è — `start_url`, `scope`, le icone (R-ARCH-06):
  l'icona sulla schermata Home apre il sito, e senza rete non si apre, come il
  sito;
- `site/sw.js` non si tocca: è questo;
- le righe C-21 e C-22 dei «Difetti aperti dichiarati» di
  `docs/eccezioni-interfaccia.md` escono nello stesso commit.

### 3.6 La versione, in due posti

`VERSION` e `versione` in `site/dati/meta.json`. Nessuno la sostituisce al
volo: se uno dei due resta indietro la suite è rossa (R-ARCH-03). Fino al 3
ottobre 2026 erano tre, con il nome della cache in `site/sw.js`; dall'ADR-005
la cache non c'è, e `sw.js` non porta una versione. Dopo un rilascio basta
**una** ricarica.

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
  profilo — data d'esame, le scelte di preparazione (P-83) e punteggi dei
  Segnali —, e un registro di sicurezza.
  Il titolare le legge per il supporto e per le statistiche; niente esce verso
  script di terzi (§2.1).
- **E, se chi studia lo dice, l'esito del suo esame** (P-73, schema 5;
  `esito-esame-progetto.md` §3): una riga per prova e per giorno — carteggio,
  quiz base, quiz vela, pratica —, con l'esito e, se lo sa, gli errori. Sta in
  una tabella sua, `esito`, e non fra le righe, perché un esito si deve poter
  togliere davvero: `DELETE` lo cancella dai byte del database e del WAL, e un
  ripristino non lo riporta, perché il ritiro passa prima dal file delle
  cancellazioni e il server lo rilegge a ogni avvio. Un azzeramento dei
  progressi non lo tocca; la cancellazione dell'account sì, anche con il codice
  di un rilascio che non conosce la tabella; l'export lo porta, l'import non lo
  carica; chi si è opposto è fuori dalla fonte `esiti` delle statistiche
  (R-ESITO-01, 05…09). `GET /v1/io` porta `esiti` e `tipi_riga`: un campo
  assente — il server di prima — spegne la funzione nella pagina, non la accende
  (R-ESITO-03, R-PREV-09). La pagina di oggi non chiede l'esito: lo chiederà
  B-1, e fino ad allora E-01 pretende che non lo faccia (§9.13).
- **Le tre raccolte nuove sono spente fino alla loro decisione** (deciso
  dall'autore il 17 ottobre 2026; P-86, `account-progetto.md` §2.7-bis): l'esito
  dell'esame e la riga d'avvio con la previsione si accendono con la merge di
  P-75, le scelte di preparazione con il rilascio di P-81, perché base
  giuridica e informativa vengono prima del trattamento. Spente vuol dire
  scritture rifiutate sul server con un motivo che si legge — `PUT /v1/esito`
  un `403`, una riga `'a'` scartata riga per riga anche da un import, le due
  scelte nel profilo un `422` con il campo —, e capability non dichiarate nella
  descrizione: niente `esiti`, `'a'` fuori da `tipi_riga`, le scelte fuori da
  `campi_profilo`, cioè la strada del server di prima. Quello che c'è già resta
  leggibile, esportabile e cancellabile. L'interruttore sta nel codice,
  `RACCOLTE` in `server/raccolte.mjs`, così un tag dice che cosa è acceso, e
  `GET /v1/salute` lo dice da fuori. La v0.31.0 è uscita con tutte spente; la
  v0.32.0, il rilascio del ridisegno, accende le scelte di preparazione nello
  stesso tag dell'informativa che le nomina, e tiene spenti esiti e previsioni
  fino a P-75 (R-ACC-82…86).
- **Il titolare legge un account da un posto solo**, `server/leggi.mjs`, dalla
  macchina e mai dal web: un'email e un motivo obbligatorio, l'account e le sue
  attività con le funzioni del motore, e una riga nel registro per ogni
  lettura, scritta nella stessa transazione e per prima. Non cambia niente
  dell'account (R-ACC-71…74; `account-progetto.md` §15.1).
- **Le statistiche passano da un posto solo**, `server/statistiche.mjs`, che
  legge fonti già filtrate: chi si è opposto al trattamento — un segno
  sull'account, che il titolare mette e toglie dalla macchina, annotato nel
  registro — non entra in nessun conteggio, e le sue risposte restano nel suo
  account. L'email non è in nessuna fonte. Oggi nessuna statistica si calcola,
  e nessuna rotta ne espone una (R-ACC-67…70; `account-progetto.md` §15.2).
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

**I cinque stati, accanto ai tre** (decisione 14 di P-59; contratto da P-71, 4
ottobre 2026). I tre dicono soltanto com'è andata l'ultima risposta.
`statoQuesito()` ne dà cinque, disgiunti, che sommano al totale
(`contaStati()`):

- `mai_visto` — nessuna risposta;
- `debole` — l'ultima risposta è sbagliata: sempre sbagliato, o una regressione;
- `sistemato` — dopo l'ultimo errore, due giuste ad almeno `CONFERMA_ORE` = 12
  ore l'una dall'altra; le giuste dopo la mantengono, un errore la riapre;
- `ok` — nessun errore, e due giuste ad almeno 12 ore;
- `incerto` — il resto del visto.

«Due giuste ad almeno 12 ore» dentro la serie in corso è `gu − gp ≥ 12 ore`
(§3.3): la prima e l'ultima sono le più lontane, quindi **una risposta giusta
non toglie mai una conferma** — il controesempio di ChatGPT a «le ultime due
giuste» (I-06) è un test. Le 12 ore sono una scelta pratica, con un nome, da
rivedere con i dati. **Nessuno stato si salva**: si leggono dallo specchio, che
si ricalcola dalle righe, e R-ARCH-01 resta.

**I tre si ottengono dai cinque, misurato** (`STATI_IN_TRE`): ogni `incerto` ha
l'ultima risposta giusta, quindi `coperto` = incerto + sistemato + ok,
`da_ripassare` = debole, e «Rifai N errori» (`soloDaRifare`) apre esattamente i
deboli. **`classifica()` non cambia**: la usano la barra, `quadro()`,
`dovePesa()` e `traccia()`, che passano ai cinque con il ridisegno.

**I nomi nel codice non sono quelli della barra.** `mai_visto`, `debole`,
`incerto`, `sistemato`, `ok` sono gli identificatori del contratto; le parole in
schermata sono, nell'ordine, «mai visti · da rifare · da confermare · recuperati · acquisiti» (Q-STATI, chiusa il 13 ottobre 2026 su delega
dell'autore, §10). Un controllo le tiene ferme dal giorno in cui la pagina le
scrive (R-STATI-06).

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
| `codaSegnalibri()` | i quesiti segnati adesso, nell'ordine della banca, con il numero e i segni su quesiti che la banca non ha (da P-71) | sì, i segnalibri |
| `cercaNumero()` | dal progressivo del decreto («1.1.1-24») ai quesiti: esatti, parziali, oscurati (da P-71) | no |

**La ricerca per numero** (decisione 8 di P-59, P-71). Il testo si legge come lo
scrive chi ha il libro accanto — spazi, «N.» davanti, un trattino lungo —; un
numero che non c'è è una ricerca valida senza risultati, un testo che non è un
numero lo dice. Parziali: la parte prima del trattino per segmenti interi
(«1.1» non prende 1.10), il numero dopo per prefisso («1.1.1-2» prende 20…29).
Un oscurato si trova, e sta in `oscurati`. **Due difetti della banca, misurati
il 4 ottobre 2026 e riletti sul PDF del decreto il 13 ottobre (P-77)**: dei
quattro progressivi che non si leggevano, uno era un errore di estrazione —
base-8, che il decreto numera 1.1.1-8 (pagina 2), e la banca ora porta quel
numero —; gli altri tre il decreto li scrive così, con un punto dove gli altri
hanno il trattino (base-385 «1.3.2.113», base-943 «1.6.1.97», base-1326
«1.8.1.38»), e quei quesiti non si trovano per numero. Gli undici numeri
portati da due quesiti diversi sono ripetuti nel decreto, tutti e undici, e la
ricerca li apre tutti e due. Non si ricostruisce dal contesto il numero che il
decreto non scrive: all'esame vale lui. La tabella, con le pagine, è
`test_dati.py::test_progressivi`; R-NUM-02 fissa la misura nel motore.

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
| `ritmo()` | il tempo per domanda **all'orologio**, mediana fra sessioni | `affidabile` solo con almeno `MIN_MISURATE = 30` risposte **misurate**: in sessioni di almeno due risposte, tutte con un `ts` che è una data. Senza orologio `msPerDomanda` è `null`, e il cronometro non lo sostituisce (P-16) |
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

**Carteggio e tecniche: lo stesso confine, un contratto a parte** (dal 30
settembre 2026, P-33). `sessioni()` ed `erroriSessione()` leggono soltanto le
righe `_t:'q'`, e restano così: il confine per pausa di `ritmo()` non cambia.
Le righe `_t:'c'` e `_t:'t'` hanno `attivitaCarteggio(righe, { tipo })` — il
tipo si nomina, e `'q'` o un tipo sconosciuto sono un errore — e
`dettaglioCarteggio(righe, banca, id, { tipo, filtro })`. Il confine è sempre
quello dell'attività: le righe di un `sim_uid` stanno insieme oltre ogni pausa
e intrecciate con altre attività, e quelle senza legame si ricostruiscono e lo
dichiarano — sulla carta per **istante e modalità**, perché `salvaCart()` ha
sempre scritto un solo `ts` per salvataggio; sulle tecniche con le regole dei
quiz. Un'attività ambigua — un esercizio ripetuto, due modalità, lo stesso id
su un altro tipo, una riga di prova estranea, due varianti, una quantità
proposta incoerente — si dice, e non apre un dettaglio. Il dettaglio dà dalla
stessa fonte le schede, i conteggi e il filtro della revisione: sulla carta
coincidenti, da rivedere, senza giudizio, campi scritti, vuoti e non
registrati; sulle tecniche scelte coincidenti e non coincidenti; su entrambi i
non affrontati, soltanto quando la quantità proposta è registrata. Un giudizio
che manca non diventa «da rivedere», e la soglia della prova si dice solo con
tutti i giudizi. Nessuna riprova per questi tipi: il ciclo dell'area 4 si
chiude con revisione e nuova preparazione (`area-4-progetto.md` §7.3).

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
v0.28.1 stavano in `localStorage`.

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
  (`account-progetto.md` §20). *Cambierà con la stima* (ADR-006, decisione 24
  di P-59): la difficoltà dei quesiti sarà stimata sulle prime risposte di
  tutti i registrati, senza chi si è opposto e sopra una soglia di persone.
  Finché la stima non c'è, questa riga descrive il motore. **Intanto la
  previsione si registra** (P-72, §3.2): a Inizia di ogni simulazione completa
  la riga d'avvio porta quella di `regola-semplice-1`, che guarda soltanto le
  ultime cinque prove di chi studia, e niente la mostra né la rilegge
  (R-PREV-01…12). La stima che userà gli altri non c'è; quando ci sarà, la riga
  d'avvio avrà un metodo in più.
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
site/index.html   la Home.
```

---

## 5. Inventario: che cosa esiste, e dove ci si arriva

**Questa è la tabella la cui assenza ha fatto sparire una schermata.** Una
funzionalità che non è qui non esiste; una che è qui e non ha un ingresso è un
difetto, non una scelta.

Colonna «ingresso»: **come ci si arriva partendo da zero**, non dove vive il
codice.

**Un regime solo, dal 20 ottobre 2026 (P-89).** Il §5, il §6 e il §7
descrivono il **ridisegno** deciso dall'autore il 3 e 4 ottobre (Q-NAV, §10),
progettato da P-79 (`docs/ridisegno-progetto.md`) e realizzato da P-81. Dal 15
ottobre, per P-80, convivevano due regimi: la pagina di prima — sette viste in
`app.html`, la Home a parte — continuava a passare i suoi controlli, e dove
differiva un paragrafo *Nel regime di transizione* lo diceva. Il regime di
transizione scadeva con la merge di P-81: P-89 ha tolto i paragrafi, e dai
controlli il ramo che teneva verde la pagina di prima, che ora è rossa (§6.2).

### 5.1 Le pagine

| Funzionalità | Vive in | Ingresso | Requisito |
|---|---|---|---|
| Il documento di studio: Home, Allenati, Esame, Progressi | `site/index.html` | `/` — è la pagina che deve comparire nelle ricerche —, e `/?sezione=allenati`, `/?sezione=esame`, `/?sezione=progressi`; `/app` ci rimanda | R-NAV-01, R-NAV-10, R-ARCH-06 |
| La porta `/app` | `site/app.html` | `/app`, dai link e dalle icone di prima del ridisegno: una pagina statica senza banca, archivio o client, che manda a `/?sezione=allenati&segmento=quiz` e porta il frammento di un link di verifica o di password in memoria, mai nell'indirizzo | R-NAV-12, R-ARCH-09 |
| Privacy, Avvertenza | file propri | i link canonici `/privacy`, `/avvertenza`, `/avvertenza#condizioni`, da ogni superficie; toccati dal documento di studio si aprono sopra il lavoro, caricati direttamente sono il file autonomo | R-ARCH-05, R-ARCH-06 |

### 5.2 Le sezioni e le superfici

**Deciso nel progetto (P-79):** quattro sole sezioni `.view`, esattamente con
questi id. Le preparazioni, gli ambienti e i pannelli sono superfici interne,
inventariate sotto; non si tengono sette viste vuote per tenere verde un
censimento (R-NAV-06).

| Sezione | id | Porta principale | Indirizzo | Requisito |
|---|---|---|---|---|
| Home | `v-home` | il marchio, la prima voce della barra | `/` | R-NAV-01 |
| Allenati | `v-allenati` | barra; si apre sul segmento del link, altrimenti su Quiz | `/?sezione=allenati&segmento=quiz` · `carteggio` · `segnali` | R-NAV-01, R-NAV-03 |
| Esame | `v-esame` | barra; dalla Home «Simula il quiz base» apre la sua preparazione in un tocco | `/?sezione=esame` | R-NAV-01, R-NAV-04 |
| Progressi | `v-progressi` | barra, anche senza account | `/?sezione=progressi` | R-NAV-01, R-ACC-04 |

Sul telefono le quattro voci stanno nella barra in basso e l'avatar
nell'intestazione; sul desktop la barra sta in alto. L'avatar dice «Accedi»
senza account e «Account» con, anche nel runner; il pallino ambra dei guasti
sta su di lui, e resta finché il guasto c'è (R-STA-05). Nel runner la barra
delle sezioni sparisce; restano il titolo dell'attività, il comando di uscita
e l'avatar.

| Superficie | Si apre da | Ritorno |
|---|---|---|
| Segmenti Quiz · Carteggio · Segnali | Allenati | si torna al segmento, ai filtri, alla posizione e al fuoco di prima |
| Preparazione dei quiz | Home, Quiz, Esame, la mappa di Progressi, i segnalibri, la ricerca per numero | la porta effettiva, non una destinazione fissa |
| Preparazione della carta: esercizi e prova, due modalità dello stesso ambiente | Allenati → Carteggio, Esame → Prova di carteggio | Allenati/Carteggio o Esame |
| Preparazione delle tecniche, «Che tecnica serve?» | Allenati → Carteggio | Allenati/Carteggio |
| Runner e confronto | Inizia, mai l'ingresso in una sezione, mai un indirizzo | il gestore di uscita del §7.5 |
| Riepilogo, revisione, riprova | la conclusione, o un'attività esistente | revisione → riepilogo → origine, con il tentativo conservato |
| Profilo e i suoi pannelli: account, data d'esame, «che cosa stai preparando?», Dati, Info e diagnostica, note legali | l'avatar, `#profilo`, sopra ogni superficie, anche il runner; il timer continua | l'origine |
| Ricerca per numero, elenco dei segnalibri | Allenati → Quiz | lo stesso segmento, con la casella e la configurazione |
| «Com'è fatto l'esame», sintesi e approfondimento | Esame | lo stesso punto di Esame |
| Privacy, condizioni, avvertenza | i link canonici, sopra qualunque origine | lo stesso modulo, lavoro, scorrimento e fuoco |
| «Segnala un problema» | sotto il quesito, nel runner e nella revisione | lo stesso quesito, senza una risposta scritta |

**Dove sono finite le sette viste di prima**, perché nessuna sparisca in
silenzio come «Che tecnica serve?» il 9 settembre 2026:

| Vista di prima | Posto nuovo |
|---|---|
| `v-oggi`, il Percorso | la Home per l'azione e i fatti; Progressi per la mappa e la storia. Nessuna seconda classifica (§6.3) |
| `v-quiz` | Allenati → Quiz; le preparazioni e il runner sono gli stessi che apre Esame |
| `v-cart` | Allenati → Carteggio; Esame → Prova di carteggio apre lo stesso ambiente |
| `v-diag`, Progressi | Progressi; senza account il riepilogo vero della pagina, con l'account la mappa e la storia |
| `v-tec`, «Che tecnica serve?» | Allenati → Carteggio → Che tecnica serve?, con la sua preparazione e il suo runner |
| `v-seg`, i Segnali | Allenati → Segnali, extra banca: preparazione, partita, riepilogo |
| `v-info` | avatar → Profilo → Info e diagnostica, raggiungibile sopra ogni attività |

Le porte `data-v` di oggi — `quiz`, `cart`, `seg`, `tec`, `diag`, `oggi`,
`info` — possono restare come **alias** verso questi posti; una porta verso una
vista che non c'è è una porta verso niente, e un controllo la nomina
(R-NAV-01). Il raccordo `navigazioneSito()` traduce gli alias come la tabella
dice (R-NAV-10).

### 5.3 Le attività

**Tutte, in tutti e due gli stati d'accesso** (R-ACC-04), ognuna fino al suo
punto d'arrivo, con riepilogo e revisione. L'ultima colonna dice se l'attività
scrive righe: senza account restano nella memoria della pagina aperta, con
l'account vanno nella copia del dispositivo e sul server (§3.2). Le dieci
attività restano quelle del 26 settembre 2026; il ridisegno aggiunge tre
**porte**, non attività: il breve, i segnalibri e la ricerca per numero aprono
la stessa preparazione dei quiz e lo stesso runner.

| Attività | Dove | Motore | Scrive righe |
|---|---|---|---|
| Allenamento consigliato (la Mirata) | Allenati → Quiz; nella Home con l'account, come proposta | `mirata()`, fino a 25 quiz base, da `selezioneQuiz()` | sì, `mode` proprio |
| Scegli un argomento | Allenati → Quiz; i temi nel segmento, tre tocchi dalla Home alla domanda (A-1, deciso il 15 ottobre 2026) | `daAllenare()`; con «solo domande mai fatte» `coda({stati: ['nuovo']})` | sì |
| Ripassa gli errori | Allenati → Quiz | `coda({soloSbagliate})` | sì |
| Simula la prova (base, vela, base e vela) | Esame; dalla Home «Simula il quiz base» in un tocco; da Allenati → Quiz la porta manda a Esame | `simulazione()`, `simulazioneVela()` | sì, più una riga `_t:'s'` per prova |
| Un giro tra gli argomenti | Allenati → Quiz, dietro «Altri modi di esercitarti» | `screening()`, con il numero da `lunghezzaScreening()` | sì |
| Allenamento breve, «Allenati con 10 domande» | la Home, in tutti gli stati; porta, non attività | `preparaBreve()`: una `coda()` sul base intero e una `estraiNuoviPrima()` a dieci (R-NAV-11) | sì, come un allenamento |
| I miei segnalibri | Allenati → Quiz → Segnalibri; porta, non attività | `preparaSegnalibri()` e `avviaSegnalibri()` su `codaSegnalibri()`, senza tetto (R-NAV-11, R-SEGNO-02) | sì, come un allenamento |
| Cerca un quesito per numero | Allenati → Quiz; porta verso la preparazione del quesito trovato | `ricercaNumero()` su `cercaNumero()`, il testo com'è digitato (R-NAV-11, R-NUM-01) | sì, come un allenamento |
| Allena da Progressi | Progressi → tema o voce → «Allena» | `anteprimaAllenaProgressi()` e `avviaAllenaProgressi()`: una `coda()` con il filtro della riga e venti quesiti (R-MAPPA-18) | sì |
| Prova di carteggio | Esame → Prova di carteggio; Allenati → Carteggio → Prova | `provaCarteggio()`, cieca, o «prima i mai provati», da `preparaCarteggio()` | sì, `_t:'c'` e una riga `_t:'s'`, da `concludiCarteggio()` |
| Giro delle tecniche | Allenati → Carteggio → Esercizi su carta | `giroTecniche()`, da `preparaCarteggio()` | sì, da `concludiCarteggio()` |
| A tappeto | Allenati → Carteggio → Esercizi su carta | `tappeto()`, da `preparaCarteggio()` | sì, da `concludiCarteggio()` |
| Che tecnica serve? | Allenati → Carteggio | `coda()` sulle tecniche, da `preparaCarteggio()` | sì, `_t:'t'`, da `rispostaTecnica()` |
| Gioco dei Segnali (4 modalità) | Allenati → Segnali | `domandeSegnali()` | **no**, e §4.5 dice perché |

Le cinque intenzioni dei Quiz sono quelle dell'area 2
(`docs/area-2-progetto.md`), dal 26 settembre 2026 (P-05): Batteria non è un
ingresso, il suo mestiere sta in «Scegli un argomento» senza filtri, e le sue
righe storiche restano leggibili. La selezione di ogni intenzione passa da
`selezioneQuiz()`, che il controllo esegue (R-NAV-04); le tre porte nuove e
Allena passano da raccordi loro, al primo livello e fuori da `MODI`, che il
controllo esegue allo stesso modo (R-NAV-11, R-MAPPA-18).

### 5.4 I controlli e i riscontri

| Cosa | Dove | Nota |
|---|---|---|
| Filtro «solo domande mai fatte» | Allenati → Quiz → Scegli un argomento | Locale a quell'attività: chiede al motore `stati: ['nuovo']`, e nessun'altra intenzione lo riceve (R-NAV-05). Fino al 26 settembre 2026 era un selettore globale in cima a Quiz, che valeva anche per la prova di carteggio |
| Filtro «solo quesiti con figura» | Allenati → Quiz → Scegli un argomento | Locale come l'altro. Si spegne da solo su una banca che non ne ha, col perché scritto |
| Spunte argomenti, spunte voci | Allenati → Quiz | Più voci insieme; per la vela le spunte viaggiano come `voci`, non `temi` |
| Banca base / vela, quante | Allenati → Quiz | |
| Data d'esame | Esame, e Profilo → Data d'esame | Facoltativa. Senza, `quota` e `giorni` sono `null` e il semaforo è `attesa`. Senza account vale per la pagina aperta; con l'account sta nel profilo sul server, e dopo la registrazione si propone senza salvarla da sola (R-ACC-55) |
| «Che cosa stai preparando?» | l'onboarding dopo la registrazione, Profilo, Esame | Due scelte facoltative — solo motore o anche vela, prima patente o estensione dalla entro 12 —, nulle per chi non risponde; senza account valgono per la pagina aperta. Con l'account si dicono salvate solo quando il server le ha: i due campi del profilo, `abilitazione` e `conseguimento`, sono sul server da P-83 (A-5, deciso il 15 ottobre 2026; R-ACC-78…81), dichiarati da `campi_profilo` in `GET /v1/io`, e la pagina li consuma con P-81 |
| I cinque stati | Progressi, con l'account | La barra per tema e per voce con «mai visti · da rifare · da confermare · recuperati · acquisiti» (Q-STATI), da `contaStati()` con il filtro della riga, una chiamata per aggregato; i tre di `classifica()` restano per le azioni (R-MAPPA-18, R-STATI-06). Senza account nessuna copertura cumulativa: non c'è uno storico da coprire |
| La mappa per tema, e «Dove pesa di più adesso» | Progressi, con l'account | `quadro()` e `dovePesa()` attraverso il raccordo del §10.1 di `area-5-progetto.md`: una riga per tema, le voci al tocco, «Rifai N errori» e «Allena», e in cima la frase solo quando il motore la dà (R-MAPPA-14…18) |
| Barrette dell'andamento | Progressi | `serieGruppi()`, `tendenza()` |
| «Le sessioni che hai fatto» | Progressi | `sessioni()` con il confine dell'attività; ogni riga si riapre. Con l'account; senza, «Le attività di questa pagina» da `riepilogoPagina()` (R-ARCH-19) |
| «Che cosa non torna, e lo diciamo» | la Home, in tutti gli stati | I numeri si contano dalla banca caricata |
| Scarica / ricarica / azzera i progressi | Profilo → Dati | Con l'account: scaricare è l'export del server, e dice quante risposte da inviare non contiene (R-ACC-56); ricaricare porta un file nell'account, con l'anteprima dei conteggi del motore (R-ACC-50); azzerare chiede la password e vale su tutti i dispositivi (R-ACC-15). Senza account: si scaricano o si azzerano le risposte della pagina aperta, e un file non si carica. In tutti e due, un import dice quante righe ha preso, quante aveva già, **quante ha scartato** |
| Accedi / Account | l'avatar nell'intestazione, anche nel runner | «Accedi» senza account, «Account» con: email, verifica, stato dell'invio, data d'esame, trasferimenti, uscita, azzeramento, cancellazione |
| «Senza account non resta niente» | prima di ogni avvio senza account, e nel riepilogo | R-ACC-02 |
| L'invito a registrarsi | tre posti, e nessun altro: la Home con risposte senza account, il risultato di una simulazione, i riepiloghi delle attività | Con i vantaggi che esistono; «Continua senza account» lo chiude senza chiedere altro (R-ACC-03, ADR-006). Nel risultato di una simulazione la frase è «Conserva questa prova e ritrovala quando torni», senza la seconda metà dell'ADR-006 fino a P-76 (A-6, deciso il 15 ottobre 2026) |
| Lo stato dell'invio | Account, e Profilo → Info | Da inviare, in corso, confermate, non accolte con il motivo: dalla coda del motore, non da un conto della pagina |
| «Com'è andato l'esame?» | un riquadro nella Home con l'account; «Il tuo esame» nel Profilo | **Non c'è ancora: lo porta P-75** (`esito-esame-progetto.md` §3, §10.1). Il riquadro solo con la data d'esame passata da al più 90 giorni e senza esiti da trenta giorni prima in poi, mai in un'attività, in un riepilogo o in una finestra modale; «Salvato» solo dopo il `200` (R-ESITO-02…04). Fino ad allora E-01 pretende che la pagina non lo faccia |
| La riga d'avvio delle simulazioni | nessuna voce in schermata; in Info «prove avviate N» | **Non c'è ancora: la porta P-75** (§3.2). A Inizia, con l'account e un server che la dichiara; non si vede, non è una risposta in nessun conteggio e `riepilogoPagina()` non la legge (R-PREV-05…08). Fino ad allora P-01 pretende che la pagina non la scriva |
| Pallino ambra dei guasti | sull'avatar, visibile da ogni superficie, runner compreso | R-STA-05 |
| Tag sugli errori | runner, riepilogo e revisione | «Non lo sapevo» (`N`) e «Svista» (`S`), facoltativi, un tag per tentativo; `L` e `C` di prima si mostrano come classificazione precedente (R-TAG-01). Un tag nuovo si scrive solo se il server che si ha davanti lo accoglie, da `permessoGesto()` su `rigaScrivibile()` (R-TAG-02, R-NAV-11) |
| Segnalibro | sotto il quesito, nel runner e nella revisione | Una riga `_t:'b'` per gesto, vale l'ultimo; non è una risposta (R-SEGNO-01…03); stesso permesso dei tag |
| Cerca un quesito per numero | Allenati → Quiz | `ricercaNumero()`: esatti e parziali, i numeri ripetuti tutti, un oscurato trovato e detto prima di rispondere (R-NUM-01, R-NAV-11) |
| «Segnala un problema» | sotto ogni quesito, anche carta e tecniche e revisione | Copia il riferimento; l'indirizzo è un segnaposto dichiarato finché l'autore non lo sceglie (A-3, §10) |
| «Com'è fatto l'esame» | Esame | La sintesi con i valori di `PROVA_CARTEGGIO` e `meta.prove`, l'approfondimento con le fonti datate del dossier |
| Revisione di una sessione | riepilogo di ogni attività; con l'account anche Progressi e Carteggio | La tua risposta accanto a quella esatta. Senza account si rivedono le attività della pagina aperta |
| Spiegazioni in schermata (`?`) | Progressi, la legenda dei cinque stati | Funzionano col mouse **e al tocco** |

---

## 6. La navigazione

### 6.1 Che cosa è deciso

**Deciso l'8 settembre 2026.** Il Carteggio è un **ambiente autonomo** nel quale
si entra apposta, ed è una parte fondamentale della preparazione: ha rilievo
nella Home e nelle sezioni. Il ruolo preliminare del carteggio rispetto ai quiz
va **spiegato**, non scoperto tardi — ma **senza blocco artificiale**: l'ordine
dell'esame e la libertà di prepararsi in parallelo restano distinti. *Cambiata
il 4 ottobre 2026 dalla decisione 3 di P-59 nella parte «un accesso nella
navigazione principale»:* il Carteggio resta un ambiente, e le sue porte sono
in Allenati e in Esame, non nella barra.

**Deciso il 9 settembre 2026.** Il gioco dei Segnali è un **extra originale** del
progetto, e l'identità può accogliere in futuro altre attività dello stesso tipo.
*Dal 4 ottobre 2026* è il terzo segmento di Allenati, fuori dalla mappa della
copertura (R-UX-04).

**Deciso il 9 settembre 2026.** La direzione estetica chiara è confermata.

**Deciso il 3 e 4 ottobre 2026, dall'autore (Q-NAV, decisioni 1–9 di P-59; i
nomi chiusi provvisori il 14 ottobre).** Il menu è **Home · Allenati · Esame ·
Progressi**, più l'avatar che apre il Profilo. Allenati ha tre segmenti, Quiz ·
Carteggio · Segnali. Esame mette le prove nell'ordine in cui si sostengono.
Progressi unisce Percorso e Progressi. La Home è `/`, in tre stati. La
simulazione si raggiunge in un tocco dalla Home e da Esame, e apre la stessa
preparazione. I nomi «vetrina» e «palestra» escono. Si cerca un quesito per
numero. **Dopo il primo caricamento il sito resta un documento solo**, e chi
non ha l'account non perde le risposte passando fra le sezioni né aprendo un
link (decisione 9). Il progetto è `docs/ridisegno-progetto.md`.

**Deciso il 14 ottobre 2026, nel progetto (P-79).** Gli indirizzi delle sezioni
sono query su `/` — `/?sezione=allenati&segmento=quiz` —, perché `/allenati`
una ricarica la paga con un 404 (misurato sul server locale che riproduce
l'host); `/app` diventa una porta statica di compatibilità; `start_url` è `/`.
Il contesto di navigazione sta in memoria, e `history.state` porta solo un
riferimento: niente di chi studia va nell'indirizzo, nella cronologia o in uno
storage.

**Deciso il 15 ottobre 2026, dall'autore (A-1, A-5, A-6 di P-79).** I temi
stanno nel segmento Quiz, tre tocchi dalla Home alla domanda; le scelte di
«che cosa stai preparando?» entrano nel profilo sul server (P-83); nel
risultato di una simulazione l'invito dice «Conserva questa prova e ritrovala
quando torni», senza la promessa del Percorso fino a P-76.

### 6.2 Il regime è uno (P-89, 20 ottobre 2026)

**Il regime si legge dalla pagina**, con la lezione di P-51: il documento di
studio è nel ridisegno se dichiara, al primo livello e fuori dai commenti,
`navigazioneSito()` **e** `VISTE_RIDISEGNO = ['home', 'allenati', 'esame',
'progressi']`, insieme, esattamente così (R-NAV-09). Mai dal nome di un
pulsante. Una pagina senza nessuna delle due è quella **di prima** del
ridisegno, e una con una sola, o con una lista diversa, è **a metà**: tutte e
due sono un rosso con il motivo, in `test_interfaccia.py` e in `test_dati.py`.
La regola sta in un modulo solo, `tests/regime_pagina.py`, letto dalle due
suite.

Il documento canonico è `site/index.html`, su `/`; `site/app.html` è la porta
(R-NAV-12). I controlli pretendono le quattro sezioni (R-NAV-06), la barra con
quattro parole intere — quattro link, ognuno con l'indirizzo canonico della sua
sezione, `/` e `/?sezione=…` — e i tre segmenti (R-NAV-03), gli alias delle
porte di prima che vanno dove dice la tabella C del §10.1 del progetto
(R-NAV-01, R-NAV-10); i banchi dei quiz, del ciclo, della mappa — con i cinque
stati e Allena (R-MAPPA-18) —, del Carteggio e del client leggono il canonico e
lo servono su `/`. `RG_PAGINA=<file>` sostituisce il canonico, e il regime si
legge dalla copia; il canonico da solo, però: la porta `/app`, il manifest e
le pagine legali restano quelli di `site/`, ed è così che P-81 si è fermato il
17 ottobre 2026. Per una copia intera c'è `RG_SITO=<cartella>` (P-84), che sta
per `site/` tutta — canonico, porta, manifest, pagine legali, dati, figure — in
`test_interfaccia.py`, nel banco del client in Chrome e nei banchi sotto Node
(`tests/sito.mjs`), e in `test_dati.py`, con `test_indirizzi` e il manifest.
Le due variabili insieme sono un errore detto, e una cartella che non c'è o
senza `index.html` un rosso, mai un ripiego su `site/`. La riga finale di ogni
suite dice la copia: un verde su una copia non è un verde di `main`.

**Il banco dei tragitti, da P-82 (16 ottobre 2026).** Il gruppo N-01 del
banco del client guida in Chrome la pagina: il documento che resta lo stesso,
la cronologia, gli indirizzi, i legali sopra il lavoro, lo storage e
`history.state`, i tre posti dell'invito, la registrazione con l'insieme intero
delle righe, i cinque stati in schermata, i gesti con i server di prima, la
ricerca, le scelte, e i 108 tragitti del §9 del progetto, uno per stato e
compito (R-NAV-08, R-NAV-14, R-STATI-06). Gira sulla pagina vera e sulla
pagina di riferimento del client, `tests/pagina-client-ridisegno.html`, che
passa tutti i gruppi del client e porta le rotture: le sue e, da P-89, quelle
della pagina di riferimento di prima. **Che cosa resta al collaudo** — fatto da
P-81 a 375 e 1280 px, e che nessun controllo ripete —: la gerarchia e la
geometria delle sezioni, i testi che il banco non cerca, il `?` della legenda
dei cinque stati, il gesto vero e il tocco, Safari.

**Fino al 20 ottobre 2026 i regimi erano due** (P-80, 15 ottobre 2026). La
struttura nuova era decisa e i suoi controlli esistevano prima della pagina,
com'è stato per le aree 2–5: senza le due dichiarazioni la pagina era nel
regime di prima, il documento di studio era `site/app.html` con sette viste, e
ogni controllo girava com'era, verifica per verifica; nel ridisegno valevano le
regole di sopra. Il regime di transizione scadeva con la merge di P-81
(`ebe2e47`, 20 ottobre 2026), e P-89 ha tolto dai controlli il suo ramo — come
P-12, P-37, P-47 e P-50 hanno fatto per le aree —, tenendo pagine di
riferimento, rotture e controlli. **Prima di toglierlo, misurato**: il sito di
v0.31.0 — la Home, l'app, il manifest e le pagine legali che P-81 ha
sostituito — passava l'interfaccia con 3.002 verifiche su 3.015, e i 13 rossi
erano tutti delle chiamate al motore che P-81 aveva dichiarato, nessuno del
regime; i dati con 230 su 230. **Dopo**, lo stesso sito è rosso, e un
controllo lo pretende a ogni esecuzione (`test_copia_del_sito`): il regime
letto è «di prima», con il motivo, in tutte e due le suite. La pagina di
riferimento del client di prima, `tests/pagina-client-account.html`, è uscita:
le sue 235 rotture e le sue 3 varianti sono passate a quella del ridisegno —
195 rotture e una variante com'erano, 40 rotture e 2 varianti riscritte sul suo
codice, nessuna tolta —, e le 7 rotture del sito e del service worker girano
accanto a lei. Sedici delle riscritte si applicavano al testo e passavano
verdi, perché sul ridisegno la stessa frase o lo stesso codice sta anche in un
altro punto; e due rotture dell'uscita di P-01:conti passavano verdi per un
verde falso del banco — Info, che nel ridisegno è un pannello, restava aperto e
«Esci» non si premeva —, corretto (CHANGELOG, P-89).

### 6.3 Gli invarianti, qualunque struttura si scelga

Questi valgono con quattro sezioni, con sette, e con qualunque altra cosa.

- **Ogni sezione ha almeno un ingresso, e ogni superficie una porta.** Una
  vista senza porta è codice morto che sembra vivo.
- **Una stanza, una porta principale.** Un secondo accesso a una stessa attività
  non è un difetto, ma deve aprire *la stessa preparazione*, con lo stesso titolo
  e lo stesso ritorno. Due strade con intestazioni diverse sono due gerarchie.
- **Non due classifiche concorrenti di «cosa fare adesso».** Ce n'erano due —
  «Le tue voci più deboli» in Rotta e «Cosa studiare adesso» in Progressi. Q-DUE
  (§10) le ha tolte tutte e due: resta, al massimo, la frase in cima a
  Progressi.
- **I guasti non possono essere visibili soltanto dopo aver aperto Info.**
- **Non ridurre il testo per far entrare la navigazione.** A 375 px sette voci da
  54 px stavano senza sbordamento: è il limite già toccato. Le etichette restano
  parole intere; con quattro voci il limite non si tocca.
- **Gli extra non stanno dentro la mappa della copertura.** Un'attività che non
  scrive in archivio, messa fra quelle che ci scrivono, suggerisce che il suo
  punteggio sia copertura.
- **Un indirizzo è una rotta che il server serve.** Niente nel sito produce un
  indirizzo che una ricarica paga con un 404, e niente di chi studia sta in un
  indirizzo (R-NAV-10).
- **Un runner non si apre da un indirizzo né da una ricarica**: solo da Inizia,
  dopo la preparazione.

---

## 7. Le schermate

Il modello è quello di `dev-standards`, `references/specifiche.md`. Dove una voce
non si applica, è scritto perché. Gli stati e i testi comuni ai due accessi
sono nel §4 di `docs/ridisegno-progetto.md`, e il §8 qui li riassume.

### 7.1 Home

**Scopo.** Rispondere a «da dove comincio» e a «che cosa faccio adesso» senza
chiedere a chi arriva di saper già leggere un cruscotto.

**Ci si arriva da.** `/`, il marchio, la prima voce della barra, la porta
`/app`.

**Cosa si vede.** Tre stati, e lo stato d'accesso viene prima degli altri.
- *H0, senza risposte*: che cos'è il sito, con i suoi benefici; **Simula il
  quiz base** per primo, con le condizioni accanto da `meta.prove.base`;
  **Allenati con 10 domande**, che scrive il numero vero quando la banca ne ha
  meno; le anteprime delle quattro sezioni; «Che cosa non torna». Nessun invito
  a registrarsi.
- *H1, con risposte senza account*: gli stessi avvii, poi «Le attività di questa
  pagina» da `riepilogoPagina()` — quante risposte per tipo e il riepilogo di
  ognuna —, e l'invito: «Conserva le risposte», con i vantaggi che esistono e
  **Continua senza account**, che lo chiude per le righe già offerte e torna
  solo con risposte nuove (R-ACC-03).
- *HA, con l'account*: «Che cosa vuoi fare adesso?»; la proposta è
  l'allenamento consigliato di `selezioneQuiz('mirata')`, con il suo perché;
  «Simula il quiz base» in un tocco; l'ultima simulazione da
  `sessioni(...,{confine:'attivita'})`, o «Non ci sono simulazioni salvate»;
  «Vedi i Progressi». Un account vuoto non è un account nuovo (§4.6).

**Stati.** *Caricamento* dell'account e della banca detti, senza una mappa o
una proposta provvisoria. *Banca non raggiungibile*: la presentazione e i
legali restano, i totali e Inizia no. *Errore di salvataggio*: l'avviso prima
delle attività. *Rete caduta con l'account*: «Sei offline…» solo dopo una
scrittura riuscita, con il numero da inviare dalla coda del motore.

**Cosa si può fare.** Avviare la simulazione o il breve → preparazione.
Scegliere → Allenati o Esame. Leggere i progressi → Progressi. Conservare le
risposte → registrazione.

**Casi limite.** Senza account ogni visita sembra la prima, e la pagina non
può sapere se lo è: per questo «Accedi» sta sull'avatar. Fuori casa — su un
indirizzo che non è `rottagiusta.it` — la pagina lo dice per prima cosa e
offre di scaricare le risposte (R-STA-09).

**Come deve sentirsi chi la usa.** Orientato, non misurato.

### 7.2 Allenati → Quiz

**Scopo.** Allenarsi sui 1.722 quesiti, scegliendo l'ambito.

**Cosa si vede.** I segmenti Quiz · Carteggio · Segnali; in Quiz le cinque
intenzioni (§5.3) — quattro in vista, il giro dietro «Altri modi di
esercitarti» —, i temi direttamente nel segmento (A-1), **Segnalibri** e
**Cerca un quesito per numero**; «Simula la prova» manda a Esame. Ogni
preparazione dice **prima di Inizia** quanti quesiti apre, dalla stessa
chiamata che poi li apre, e il ritorno nominato. I filtri valgono solo per
l'attività in cui li scegli.

**Stati.** *Selezione vuota*: il motivo e due uscite vere — mai un pulsante
che non produce niente. *Filtro che azzera*: il conteggio lo dice prima, non
dopo. *Segnalibri vuoti*, *numero che non c'è*, *testo che non è un numero*:
ognuno con la sua frase, dal motore quando è lui a dirlo.

**Casi limite.** La vela non ha temi: le spunte viaggiano come `voci`. Una
banca senza quesiti con figura spegne il filtro figure da sola, col perché
scritto. Un segno su un quesito che la banca non ha si nomina, non sparisce dal
conto. Un numero ripetuto nel decreto apre tutti e due i quesiti; un oscurato si
trova e lo dice prima di rispondere.

**Come deve sentirsi chi la usa.** In controllo: tre tocchi e parte.

### 7.3 Carteggio

**Scopo.** Preparare la prova eliminatoria in un ambiente dedicato.

**Ci si arriva da.** Allenati → Carteggio, e Esame → Prova di carteggio: due
porte, un ambiente, con due modalità — gli esercizi e la prova.

**Cosa si vede.** Tre porte distinte, con il **materiale necessario dichiarato
prima di iniziare**: esercizi su carta (giro delle tecniche, a tappeto),
riconoscimento delle tecniche (senza carte, con i suoi limiti espliciti), prova
di carteggio.

**Vincolo.** All'ingresso dell'ambiente, **prima** dell'avvio, va detto che il
giudizio della prova è di chi studia, anche arrivando da Esame. È la cosa che
più sorprende chi arriva, e non deve arrivare alla consegna. Lo tiene R-UX-03,
guidando la pagina in un browser vero: la frase si cerca nel testo che si vede,
prima di Inizia.

**La lista annunciata è quella che parte** (area 4, §8.1 e D-04). Numero,
carte, condizioni, assunzione di Q-CART4 e riprese si scrivono dalla
preparazione, che le prende dal motore; Inizia apre la stessa lista, con
un'identità nuova, oppure non avvia niente e lo dice. R-SEL-17.

**Dove c'è.** Le tre porte, le preparazioni, la guida e l'esempio, il confronto,
il giudizio, il riepilogo e la revisione sono nella pagina dalla v0.29.0 (P-21,
30 settembre 2026), con il raccordo del §10.1 dell'area 4; dal 1° ottobre il
controllo ha un regime solo (P-50, §9.6).

**Stati.** *Foglio finito* nel tappeto: dirlo, non spegnere il pulsante in
silenzio.

**Casi limite.** La carta 42/D non ha **nessun** esercizio di carburante, quindi
la regola «un esercizio per ciascuno dei quattro argomenti» non potrebbe reggersi
su una carta sola. È un'assunzione, non una regola del decreto (§10), e la
preparazione la dichiara prima dell'avvio con il testo del motore.

**Come deve sentirsi chi la usa.** Come al tavolo, non davanti a un quiz.

### 7.4 Progressi

**Scopo.** Rispondere a «ho affrontato tutto?», «dove ho difficoltà?» e — con
collegamenti, non con una seconda classifica — «che cosa faccio adesso».

**Per chi.** La mappa e la storia sono di chi ha un account (ADR-004): sono
misure su uno storico, e senza salvataggio lo storico non c'è. Senza account la
sezione non diventa un cruscotto di zeri né un pulsante bloccato: *H0* dice
«Nessuna risposta in questa pagina» e porta ad Allenati; *H1* mostra **Le
attività di questa pagina** da `riepilogoPagina()`, con i riepiloghi e le
revisioni veri, e la disclosure «Perché qui manca lo storico». Nessun invito
nel contenuto: i tre posti dell'invito sono altri (R-ACC-03, R-ACC-04).

**Cosa si vede, con l'account.** La mappa per tema con i **cinque stati** —
«mai visti · da rifare · da confermare · recuperati · acquisiti», da
`contaStati()` con il filtro della riga, una chiamata per aggregato —, la
legenda «In base alle ultime risposte», il `?` che spiega le 12 ore; «Visti Y
su N» e «X su Y giusti al primo tentativo» solo sopra soglia; per tema
«{peso} domande nella prova»; al tocco le voci; **Rifai N errori** sui deboli
senza tetto e **Allena** sulla lista della riga a venti (R-MAPPA-18). Sotto,
separati: le prove, l'andamento, le sessioni con il confine dell'attività.
Tutto dalle righe dell'account, comprese quelle arrivate da un altro
dispositivo: dopo una ricezione la vista si ridisegna dallo stesso specchio
nuovo.

**Vincolo.** Copertura e risultati non si presentano come padronanza
dell'argomento. Con dati insufficienti si dice; con dati assenti non si mostra
preparazione positiva. Le soglie del §4.3 non si abbassano per far comparire
prima una tessera. **Nessuno stato si salva**: si leggono dallo specchio
ricalcolato dalle righe (R-ARCH-01), e ogni `applica()` riceve il `ts` della
riga (R-STATI-05).

**Casi limite.** «Poco esercitato» ed «errori osservati» possono coesistere, e
l'app **non sa perché** si sbaglia: si usano descrizioni come «poche domande
viste qui» ed «errori nelle risposte», mai una diagnosi sulle cause.

**Difetto chiuso, dalla 0.3.0 al 30 settembre 2026.** Le tabelle *Per tema* e
*Per voce* sforavano di 89 px a 375 px. P-23 le ha tolte, con la mappa a schede
al loro posto, e il suo collaudo misura 0 px di sbordamento a 375 px. Che le
tabelle non tornino lo tiene R-MAPPA-14; lo sbordamento della mappa non lo
ripete nessun controllo, ed è R-MAPPA-17.

### 7.5 Il runner dei quiz

**Cosa si vede.** Il numero del quesito del decreto sopra la domanda; la domanda;
la figura, se c'è, subito sotto; le risposte ancorate in fondo, sotto il
pollice, quando lo schermo ha spazio; la posizione nella lista. Quando non ne
ha, scorre l'intero runner, da qualunque punto, e un quesito nuovo comincia
dall'inizio (P-91, R-RIF-17 e 18). «Metti un segnalibro» e «Segnala un
problema» stanno dopo le risposte e il proseguimento. La
nota `nbp` **prima** di rispondere, la `nb` **dopo**; nelle simulazioni solo
dopo la consegna. L'avatar resta disponibile, con il pallino dei guasti.

**Cosa si può fare.** Rispondere col tocco o coi tasti `1 2 3` / `A B C`, e la
schermata **lo dichiara** sui dispositivi con tastiera. Modalità *auto*: sulla
risposta esatta avanza da solo dopo un secondo, sull'errore resta — è lì che c'è
qualcosa da imparare. Dopo un errore, taggarlo «Non lo sapevo» o «Svista»,
facoltativo; mettere o togliere un segnalibro; segnalare un problema. Ogni
risposta costruisce **una volta** riga, `uid` e `ts`, e `applica()` riceve lo
stesso `ts`.

**Vincolo.** Nella simulazione **non c'è correzione durante la prova**: l'esito
arriva alla fine, come all'esame. Il conto alla rovescia, da una scadenza
assoluta, diventa rosso sotto i cinque minuti e chiude la prova a zero.

**Il gestore di uscita.** «Termina l'attività», Esc e Indietro passano dallo
stesso gestore; nella simulazione «Consegna la prova» chiede conferma in pagina
mentre il timer continua. Un tocco su un'altra sezione con un'attività in corso
chiede di uscire (`navigazioneSito()`, effetto `chiedi-uscita`); il Profilo e
i legali si aprono sopra senza chiederlo, e il timer continua.

**Casi limite.** Duecento millisecondi di sordità agli input dopo ogni cambio di
schermata: su un telefono un doppio tocco rispondeva alla domanda dopo senza
averla letta. I modificatori escludono le scorciatoie di sistema — ⌘A rispondeva
A, e scriveva un errore nello storico. Un runner non si apre da un indirizzo o
da una ricarica: `fase=runner` nell'indirizzo porta alla preparazione.

**La fine di un'attività** (area 3, §§4–6 del suo progetto; controlli da
P-31). Con almeno una risposta, «Termina l'attività» ed Esc aprono il
riepilogo **parziale**; senza risposte un allenamento torna all'origine senza
righe, mentre una simulazione chiede conferma della consegna e, consegnata anche
vuota, ha il suo riepilogo con le domande senza risposta — non superata. Il
riepilogo **non dà un voto sulla preparazione**: che cosa è successo, quali
risposte rivedere, che cosa non è stato affrontato. Dal riepilogo si apre la
**revisione** di quel tentativo — tutte le risposte o solo gli errori, la tua e
quella ufficiale — che non scrive niente oltre ai tag e ai segnalibri, e la
**riprova esatta** degli errori di quell'attività, con un'anteprima prima
dell'avvio. Base e vela sono due fasi con due riepiloghi e due riprove. È nella
pagina dalla v0.29.0 (P-19, 26 settembre 2026); dal 30 settembre il controllo
del ciclo ha un regime solo (P-37, §9.6).

### 7.6 Il runner del carteggio

**Con l'account il testo regge una ricarica; senza, resta finché la pagina è
aperta, e la pagina lo dice.** È così dalla v0.29.0 (P-21, 30 settembre
2026). La v0.28.0 non aveva né la bozza né gli account, e nemmeno un avviso:
lì il testo stava solo in memoria e una ricarica lo perdeva senza che la pagina
lo dicesse. La v0.28.1, il 1° ottobre, ha portato l'avviso e la conferma del
browser di P-36; la bozza è arrivata con gli account.

**La storia, perché non si ripeta.** Fino al 26 settembre 2026 qui c'era
scritto, come Vincolo, che quello che scrivi è salvato **a ogni tasto**. Non era
vero, e non lo era dalla 0.5.0: `annotaCart()` teneva il testo solo in memoria,
e una ricarica durante la prova di un'ora perdeva tutto. Lo ha trovato il
progetto dell'area 4 (`docs/area-4-progetto.md` §3.3) e la regia l'ha
verificato nel codice; P-36 l'ha dichiarato in pagina; il 30 settembre P-34
l'ha dimostrato in un browser vero, con l'account — due testi scritti, una
ricarica, e niente da riprendere —, e R-BOZZA-06 è stato un difetto aperto
dichiarato finché P-21 non ha portato la bozza. Da lì il suo controllo gira
intero sulla pagina vera.

**Che cosa vale.** Il contratto è nel motore (§9.11) e nel §9.4 di
`docs/account-client-progetto.md`. **Senza account non si conserva niente**
(ADR-004): il testo resta finché la pagina è aperta, la pagina lo dice prima e
durante, e la conferma del browser protegge un'uscita per sbaglio (R-BOZZA-05).
**Con l'account**, a ogni input — testo, esercizio, consegna, giudizio — il
lavoro diventa una bozza nella copia dell'account su questo dispositivo, e la
pagina dice «salvato» solo quando la scrittura è confermata, «in corso» prima,
e un guasto con il modo di uscirne. Dopo una ricarica il lavoro si **propone**,
non si riapre da solo; riaperto ha la stessa lista, la stessa posizione, gli
stessi testi e giudizi e **la scadenza di prima**; una prova scaduta a pagina
chiusa si apre al confronto. Un giudizio rinviato resta nella bozza e non
diventa una risposta. La bozza non è una risposta: non entra in Progressi, nei
conteggi né negli invii, non va sul server, non si riprende su un altro
dispositivo. Si cancella solo con la conclusione — le risposte e la bozza tolta
nella stessa scrittura — o con uno scarto confermato; l'uscita la conta, anche
quella di un'altra scheda, e non la cancella senza una scelta (R-BOZZA-06).
L'intenzione di allora — un'ora di lavoro non deve dipendere dall'aver premuto
un pulsante — è vera per chi ha l'account.

**Il lavoro ha la stessa forma nei due stati** (D-04, P-35). Dall'avvio il
runner della carta tiene il suo lavoro come una bozza di `nuovaBozza()`, **in
memoria**: con l'account lo stesso oggetto si scrive nella copia dell'account,
senza account no, e niente arriva in uno storage (R-BOZZA-05). Le righe finali
vengono da `concludiBozza()` in tutti e due gli stati — nessuna con un giudizio
rinviato, gli stessi uid a un ritento —, e la pagina non ne scrive altre
(R-FLU-23).

Il pallino verde sul numero dice «qui ho scritto qualcosa», non «è giusto». La
consegna è a due tocchi, in pagina, **mai** con `confirm()` nativo. Alla
correzione, la risposta ministeriale accanto alla tua, e **giudichi tu**.
Indietro con del lavoro chiede «Vuoi tornare al Carteggio? Il lavoro resta in
questa pagina»; la scadenza continua.

### 7.7 Segnali

**Scopo.** Riconoscere fanali, segnali diurni e sonori a colpo d'occhio.

**Ci si arriva da.** Allenati → Segnali, il terzo segmento.

**Vincolo.** È materiale **extra banca** e lo dichiara. La lunghezza della
partita è `min(10, pool)` e la schermata scrive quella, non 10 fisso: i pool sono
27 / 9 / 9 / 8. Due situazioni che mostrano la stessa cosa condividono una
`firma`, e un distrattore con la firma del segnale mostrato non entra mai in
campo — altrimenti la domanda avrebbe due risposte giuste.

**Vincolo.** I colori dei fanali, il cielo notturno e la carta dei segnali diurni
**sono contenuto, non interfaccia**: imitano le figure del decreto e non cambiano
con il tema. Mai una barra di copertura, mai righe nell'archivio (§4.5).

### 7.8 Profilo, Info e Dati

**Ci si arriva da.** L'avatar, sopra ogni superficie, anche il runner: il
pannello comune dell'account, `aria-modal`, con il fuoco confinato, Esc e il
ritorno alla porta. Le voci: account (email, verifica, invio, Esci), Data
d'esame, Che cosa stai preparando?, Dati, Info e diagnostica, Privacy,
Condizioni per l'account, Avvertenza. Queste porte volontarie non sono inviti
(ADR-006).

**L'onboarding**, dopo la creazione o l'accesso e **dopo** che le righe della
pagina sono nell'account: «Che cosa stai preparando?», due scelte facoltative
senza un default, e la data d'esame facoltativa; **Salva le scelte**, **Salta
per ora**. Senza account «Scelte applicate a questa pagina», mai «salvate»;
con l'account «Scelte salvate» solo con i valori riletti dalla risposta del
server (R-ACC-55). I due campi del profilo sono sul server da P-83 (15 ottobre
2026), dichiarati da `campi_profilo`: con un server che non li dichiara il ramo
con l'account non promette la persistenza.

**Info e diagnostica.** La versione che gira su questo dispositivo, letta da
`meta.json`. L'archivio, nei due stati: senza account le righe della pagina
aperta, dette come tali; con l'account la copia del dispositivo, lo stato
dell'invio — da inviare, in corso, confermate, non accolte con il motivo — e la
riga «ultima scrittura fallita». Le fonti e le anomalie della banca. Nessun
controllo offline (ADR-005).

**Dati.** Senza account: scarica o azzera le risposte della pagina aperta, e
nessun import. Con l'account: scarica i progressi dal server, con quante
risposte da inviare non contiene; importa un file nell'account, con
l'anteprima dei conteggi; azzera i progressi con la password; cancella
l'account. **Non è più l'unica via di salvataggio**: con l'account si salva
sul server, e il file è l'export, una portabilità.

**Vincolo.** Un pulsante che risponde «fatto» per righe che ha scartato è un
difetto: l'import dice quante ne ha prese, quante aveva già e **quante ne ha
scartate**.

### 7.9 Esame

**Scopo.** Mettere le prove nell'ordine in cui si sostengono — carteggio, quiz
base, quiz vela —, con le condizioni del decreto, e prepararle in parallelo,
senza sblocchi.

**Cosa si vede**, in quest'ordine dal 24 ottobre 2026 (P-93, decisione B del
§11 di `docs/regole-disegno-progetto.md`): **Le prove** — **Prova di
carteggio**, **Simula il quiz base**, **Simula il quiz vela**, **Quiz base e
vela**, che aprono le stesse preparazioni di Allenati —, le prove che servono
all'obiettivo scelto e il quiz base ad **accesso libero** anche per
l'estensione; poi «che cosa stai preparando?» e la data d'esame, in un
`details` chiuso il cui sommario dice la scelta e la data, o «Non l'hai detto»;
**Com'è fatto l'esame**, una sintesi con i valori di `PROVA_CARTEGGIO` e
`meta.prove` e l'approfondimento con le fonti del dossier, datate; le prove fatte, con l'esito e la data, dal motore, «Esiti autovalutati» sulla
carta; senza account «Prove di questa pagina». Nessuna attività è disabilitata
dall'obiettivo o dall'assenza di data.

**Vincolo.** La composizione della prova di carteggio è un'assunzione del
progetto (Q-CART4), e la sintesi lo dice; l'ordine dell'esame non limita la
libertà di esercitarsi.

---

## 8. Gli stati trasversali

Da disegnare e provare per **ogni** flusso, non solo per quello che va bene.

| Stato | Regola |
|---|---|
| **Vuoto** | Orientamento, non una diagnosi a zero. Senza account è lo stato di ogni apertura; con l'account, un archivio vuoto non prova che l'account sia nuovo. |
| **Dati parziali** | Dirlo. Sotto le soglie del §4.3 non si mostra la misura, si mostra che non c'è. |
| **Interruzione** | Con l'account, quello che è stato risposto è nella copia del dispositivo e parte per il server: il numero in schermata deve dirlo, altrimenti sembra lavoro perduto — è già successo. Senza account resta finché la pagina è aperta, e una ricarica lo perde: la pagina l'ha detto prima di cominciare, e non lo nasconde dopo. |
| **Offline** | Senza rete il sito non si apre (ADR-005, §3.5), e la pagina non promette il contrario. Una pagina già aperta continua: con l'account una risposta data senza rete resta nella copia del dispositivo e parte quando la rete torna, e il numero da inviare lo dice (R-RIF-02). |
| **Contenuto mancante** | Una figura indisponibile si dichiara con il perché (base-59), non si lascia un buco. |
| **Errore di salvataggio** | Avviso in schermata + pallino su Info + riga nella scheda Archivio, che chiede di scaricare i progressi adesso. **Non si spegne mai «per pulizia».** |
| **Selezione vuota** | «Niente da fare con questa selezione», mai un clic che non produce niente. |
| **Banca non raggiungibile** | Lo si dice. Non si inventano cifre: la Home, se `meta.json` non risponde, scrive che non può contare gli argomenti invece di mostrare tessere vuote. |

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
| R-ARCH-03 | La versione è una sola, nei due posti — `VERSION` e `meta.json` —, con la sua voce nel CHANGELOG, e `sw.js` non ne porta una: fino al 3 ottobre 2026 i posti erano tre, con il nome della cache | `test_engine.mjs::la versione e una sola` |
| R-ARCH-05 | Nessun `href` interno finisce in `.html`, in nessuna pagina: gli indirizzi puliti rendono il sito indifferente all'host | `test_dati.py::test_sw` |
| R-ARCH-06 | `start_url` è il documento di studio, `/`, un documento solo, e le pagine legali tornano a `/`. Il regime si legge dalla pagina, con la regola di `tests/regime_pagina.py`: la pagina di prima del ridisegno, o una a metà, è rossa anche qui. Fino a P-89 valeva anche il regime di prima, con `start_url` `/app` e la Home che rimandava all'app | `test_dati.py::test_indirizzi` |
| R-ARCH-07 | Il nome del database di prima, `open-patente-nautica`, non si riusa e la pagina non lo nomina: in `site/` compare soltanto nella costante della lettura che l'ADR-005 toglie, e solo finché quella lettura è un difetto aperto dichiarato (C-21 in `docs/eccezioni-interfaccia.md`); tolta la riga, da nessuna parte. Fino al 3 ottobre 2026 diceva che il nome non cambia col nome del progetto, perché la pagina lo cercava per il passaggio | `test_dati.py::test_rinomino` |
| R-ARCH-09 | I due `<title>` sono diversi: il canonico è «Rotta Giusta — quiz e carteggio per la patente nautica», e nomina la patente, e la porta «Apri Allenati · Rotta Giusta», e la porta passa la regola della porta (R-NAV-12) | `test_dati.py::test_indirizzi` |
| R-ARCH-12 | `strumenti/serve.py` risponde come l'host di produzione misurato: codici, assenza di redirect, 404, `Cache-Control` da `_headers`, e il 304 di una riconvalida, che senza service worker è ciò che fa arrivare fresche le pagine e la banca | `test_dati.py::test_serve` |
| R-ARCH-13 | Di un tentativo vale l'ultimo tag N/L/C, per istante: i tag storici senza data prima di ogni tag datato, UTC e offset locale confrontati come istanti, l'ordine dell'archivio a parità di istante — e un ritag aggiunge una riga, non cancella quella di prima | `test_engine.mjs::tagPerTentativo: i tag storici senza data vengono prima di quelli datati` |
| R-ARCH-14 | Una riga di tag che `validaRiga()` rifiuterebbe — tag fuori da N/L/C, senza tentativo, data rotta — non sovrascrive il tag buono di un tentativo | `test_engine.mjs::tagPerTentativo: una riga che l archivio non accetterebbe non decide un tag` |
| R-ARCH-15 | La pagina non registra un service worker e non apre una cache (ADR-005); e un browser con la 0.29.0 installata — servita in locale dal tag, sulla stessa origine — prende la versione nuova, il `sw.js` nuovo cancella le cache del sito e si disinstalla senza ricaricare le pagine aperte, e alla visita dopo, arrivata dalla rete, non c'è nessun service worker e nessuna cache. Guidato in Chrome (C-22). **Difetto aperto dichiarato sulla pagina vera** finché P-61 non toglie la registrazione | `test_interfaccia.py::test_client_offline` |
| R-ARCH-16 | `sw.js`, eseguito com'è pubblicato contro una Cache Storage con quello che la 0.29.0 lascia: salta l'attesa, cancella tutte le cache del sito e poi si disinstalla | `test_engine.mjs::sw.js: si toglie di mezzo` |
| R-ARCH-17 | `sw.js` non forza la ricarica delle pagine aperte — niente `clients.claim()`, `matchAll()` né `navigate()` —, non ha un gestore di `fetch` e non apre una cache; e se una cache non si cancella, si disinstalla lo stesso | `test_engine.mjs::sw.js: non forza la ricarica` |
| R-ARCH-18 | `site/sw.js` resta pubblicato, senza guscio, senza nome di cache e senza gestore di `fetch`, e si disinstalla: almeno fino al 3 ottobre 2028 (ADR-005) | `test_dati.py::test_sw` |
| R-ARCH-19 | «Le attività di questa pagina» vengono da un conto solo, nel motore: `riepilogoPagina()` compone `sessioni()` con il confine dell'attività, `attivitaCarteggio()` per tipo, `rigaDiRisposta()` e `validaRiga()` — nessun secondo ritaglio —; conta le risposte per tipo e a parte i tag e i segnalibri, prende ogni `uid` una volta, conta le righe rotte senza farle entrare, dichiara le attività ricostruite e ambigue e i riferimenti che la banca non ha, e non legge né conta la riga d'avvio (R-PREV-02, R-PREV-08) | `test_engine.mjs::riepilogoPagina: conta risposte e gesti a parte` |
| R-ARCH-20 | Senza account una risposta entra una volta sola nello specchio della pagina: dopo una risposta, lo specchio che la pagina passa alle selezioni dei quiz — `coda()`, `mirata()`, `daAllenare()`, `estraiNuoviPrima()` — è quello di `E.ripiega()` sulle righe che passa a `riepilogoPagina()`, campo per campo. È R-ARCH-01 vista dalla pagina: P-81 l'aveva trovata applicata due volte, `n: 2` contro `n: 1`, e l'ha corretta prima della merge. Nessun numero in schermata lo dice senza account, e il banco lo legge da quegli argomenti, con `/engine.js` servito con le cinque funzioni rivestite (C-23:specchio, P-89); provato al contrario sulla pagina vera con il difetto rimesso e su una rottura della pagina di riferimento | `test_interfaccia.py::test_client_specchio` |

**L'offline se ne va (P-60).** L'ADR-005 ha tolto l'offline, e con lui
escono cinque requisiti e i loro controlli, e i loro numeri non si riusano.
**Che cosa tenevano fermo, e chi se ne accorgerebbe senza.** Il guscio uguale in
`sw.js` e in `app.html` (`il GUSCIO di sw.js`, nel motore): senza,
l'autodiagnosi avrebbe detto «pronto per l'offline» con un buco dentro; senza
guscio non c'è niente da tenere uguale. Il prefisso della cache uno solo
(`test_prefisso_cache`): senza, Info avrebbe detto la versione sbagliata;
senza cache Info la legge da `meta.json`. Le figure che passano da un rilascio
all'altro, e soltanto loro (tre test del motore su `sw.js`): senza, chi
studiava in barca avrebbe riscaricato 102 file a ogni rilascio; senza cache le
figure arrivano quando un quesito le mostra. L'autodiagnosi offline era
scoperta, e non era mai stata eseguita. E la parte offline di R-ACC-01, in
C-01, con le due rotture che la tenevano accesa — la banca chiesta fuori dal guscio, il service
worker mai registrato. Nessuno se ne accorgerebbe, perché non c'è più niente da
rompere: è il motivo per cui escono invece di restare verdi a vuoto. **Entrano**
R-ARCH-15…18. R-ARCH-15 è **C-22** nel banco del client, in due parti: la
pagina che non registra un service worker e non apre una cache — uno strumento
nella scheda registra ogni `register()` e ogni `caches.open()`, e accanto si
guarda lo stato per tutta la finestra d'osservazione: lo stato da solo, misurato
il 3 ottobre 2026, mancava la pagina vera due giri su tre, perché il `sw.js`
nuovo si disinstalla in pochi millisecondi —; e il passaggio dalla 0.29.0 — il suo sito
preso dal tag con `git archive`, servito sulla stessa origine, installato e
ricaricato finché la pagina è servita dalla cache; poi la versione nuova al suo
posto, una visita in un'altra scheda, che è quella che fa controllare al
browser se `sw.js` è cambiato; e allora niente service worker né cache, la
scheda aperta con la 0.29.0 non ricaricata, e la visita dopo dalla rete, senza
nessuno in mezzo. Sei rotture, tutte rosse ognuna nella verifica che la
riguarda: la pagina che registra il service worker, quella che apre una cache, e
quattro `sw.js` serviti al posto di quello vero nella sola versione nuova —
uno che ricarica le pagine aperte, uno che non si disinstalla, uno che lascia le
cache, e quello della 0.29.0 rimasto pubblicato. **Sulla pagina vera C-22 è un
difetto aperto dichiarato**: misurato il 3 ottobre 2026, la pagina registra
`/sw.js` e apre lei stessa una cache `rg-0.29.0`, due volte; il passaggio dalla 0.29.0
arriva in fondo verde anche lì, perché è del `sw.js` e non della pagina.
R-ARCH-16 e R-ARCH-17 eseguono `sw.js` nel motore, in una Cache Storage finta,
e sette rotture del file li fanno rossi; R-ARCH-18 ne guarda la forma. **Che
cosa non vedono:** Safari e Firefox; un browser che torna dopo mesi; un
`.pages.dev` dietro il redirect di D2, che deve continuare a servire `/sw.js`
(ADR-005); la cache HTTP del browser, che oggi decide l'host con
`max-age=0, must-revalidate` e che il banco non misura — la misura è del 3
ottobre 2026, con `curl` su `rottagiusta.it` (§3.5).

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
| R-SEL-17 | La pagina compone la prova e ne scrive le condizioni da `provaCarteggio()` e `PROVA_CARTEGGIO`, senza un secondo algoritmo né un secondo conto degli argomenti (area 4, D-04): la lista annunciata del giro, del tappeto, della prova e del riconoscimento viene da una sola selezione del motore, con condizioni, carte, assunzione di Q-CART4, mancanti e riprese com'erano, e Inizia apre quella lista, con un'identità nuova, solo se la selezione di adesso è la stessa — eseguiti sulla pagina vera, che fa almeno le verifiche della pagina di riferimento; una pagina senza il raccordo, o con una sua `componiProva()` e le costanti `PROVA_*`, è rossa | `test_interfaccia.py::test_carteggio_preparazione` |

### 9.4 La navigazione e la reperibilità

I primi sei non esistevano prima del 9 settembre 2026, e i primi due sono la
ragione per cui questo documento è stato scritto. Dal 15 ottobre 2026 (P-80)
ogni riga valeva **nei due regimi** del §6.2: sulla pagina di prima com'era, e
sul ridisegno come il §5 e il §6 lo descrivono. Da P-89, il 20 ottobre, il
regime è uno, e le righe dicono soltanto il ridisegno.

| ID | Requisito | Controllo |
|---|---|---|
| R-NAV-01 | Ogni sezione del §5.2 ha **almeno un ingresso** nella pagina; ogni `data-v` è una sezione o un alias della tabella C del §10.1 del progetto, e nessuna vista di prima resta nel file | `test_interfaccia.py::test_ogni_vista_ha_una_porta` |
| R-NAV-02 | Ogni funzione esportata dal motore è chiamata dalla pagina, o sta nell'elenco dichiarato delle eccezioni; e nessuna chiamata sparisce in silenzio (R-PRES-01). Nel ridisegno si legge sul canonico, `index.html` | `test_interfaccia.py::test_motore_senza_orfani` |
| R-NAV-03 | Ogni voce della barra — un `<a>` o un `<button>` con `data-v` — porta a una vista dichiarata e ha un'etichetta di testo, non la sola icona; le voci sono le quattro, Home · Allenati · Esame · Progressi, in quest'ordine, ognuna un link con l'`href` canonico della sua sezione — `/`, `/?sezione=allenati`, `/?sezione=esame`, `/?sezione=progressi` (progetto §3.1 e §3.3) —, e un pulsante al posto di un link, un link senza `href`, un `href` diverso dal canonico, con l'estensione o verso una rotta che il server non serve (`/allenati`) sono rossi con il motivo; e i tre segmenti di Allenati hanno una porta. La regola è provata a ogni esecuzione sulle due pagine di riferimento e su otto rotture (P-85), fra cui una barra di pulsanti come quella di prima, che fino a P-89 il controllo leggeva com'era | `test_interfaccia.py::test_voci_barra` |
| R-NAV-04 | I quiz hanno le cinque intenzioni dell'area 2, ognuna con una porta, nessun ingresso Batteria, e ognuna apre la selezione del §6 di `area-2-progetto.md` — funzione del motore, parametri e lista eseguiti, non letti. Una pagina a sei ingressi, o che fa meno verifiche della pagina di riferimento, è rossa. La porta della simulazione sta in Esame | `test_interfaccia.py::test_modalita_quiz` |
| R-NAV-05 | «Solo mai fatte» e «solo con figura» esistono solo nella scelta per argomento, dove chiedono al motore `stati: ['nuovo']` e `soloFigura`, e nessun'altra intenzione li riceve | `test_interfaccia.py::test_selettori` |
| R-NAV-06 | L'elenco delle sezioni del §5.2 è esattamente quello che sta nel file: **quattro** `.view` con gli id del progetto; nessuna aggiunta e nessuna sparizione in silenzio. Fino a P-89 valeva anche il censimento delle sette viste di prima | `test_interfaccia.py::test_viste_dichiarate` |
| R-NAV-07 | Il controllo dei quiz è provato contro sé stesso a ogni esecuzione: una pagina di riferimento lo passa, e ciascuna delle sue rotture dichiarate lo fa fallire nominando il difetto | `test_interfaccia.py::test_intenzioni_provate_al_contrario` |
| R-NAV-08 | I tragitti del §9 del progetto, in un browser vero: dopo il primo caricamento il documento resta lo stesso — la stessa finestra JavaScript, nessun documento nuovo chiesto — attraverso sezioni, segmenti, Profilo e legali, con le stesse righe; Indietro, Avanti e Chiudi riportano allo stesso punto con scorrimento e fuoco, e Avanti su un tentativo concluso mostra il risultato; il timer continua sopra il Profilo e i legali; le query si ricaricano, `/allenati` è 404, `/app` e i suoi frammenti si puliscono; niente di chi studia sta nell'indirizzo, in `history.state` o in uno storage; la registrazione porta nell'account ogni riga della pagina; ognuno dei 108 tragitti arriva con i tocchi del §9 e torna alla sua porta; e i gruppi del client, C-19 e le attività di C-01 compresi, passano nel ridisegno. Sulla pagina vera e sulla pagina di riferimento del client; fino a P-89 sulla pagina di prima il controllo diceva che non si applicava | `test_interfaccia.py::test_ridisegno_tragitti` |
| R-NAV-09 | Il regime della pagina si legge da due dichiarazioni insieme, `navigazioneSito()` e `VISTE_RIDISEGNO = ['home', 'allenati', 'esame', 'progressi']`, mai dal nome di un pulsante; nessuna delle due è la pagina di prima del ridisegno, una sola o una lista diversa è a metà, e tutte e due sono rosse con il motivo; il ridisegno vive in `index.html` e `app.html` non lo dichiara; la regola è una, in `tests/regime_pagina.py`, provata al contrario su pagine finte e, a ogni esecuzione, sul sito di v0.31.0, rosso in tutte e due le suite (`test_copia_del_sito`, P-89) | `test_interfaccia.py::test_regime_pagina` |
| R-NAV-10 | `navigazioneSito()` è una funzione, eseguita contro i casi del §3 del progetto: le quattro sezioni e i segmenti dalle query su `/`, gli alias delle porte di oggi come dice la tabella C, `/app` come Allenati/Quiz con l'indirizzo canonico, il gettone di un link in memoria e mai nell'indirizzo prodotto, `/allenati` e un parametro sconosciuto «indisponibili» con il motivo, un runner mai aperto da un indirizzo, i legali sopra la tappa quando sono toccati e dal file autonomo quando sono caricati, l'attività in corso che chiede di uscire e quella conclusa che mostra il risultato; nessun indirizzo prodotto è una rotta che il server non serve. E la statica: quattro sezioni, la barra a link con l'`href` canonico come in R-NAV-03, i segmenti, gli alias | `test_interfaccia.py::test_ridisegno_navigazione` |
| R-NAV-11 | I cinque raccordi aggiuntivi del §10.1 del progetto, eseguiti contro il motore vero con una spia sulle chiamate: `preparaBreve` con una `coda()` sul base intero e una `estraiNuoviPrima()` a dieci, mai una seconda pescata, e lo stato «ridotta» quando sono meno; `preparaSegnalibri` da una `codaSegnalibri()` senza tetto, con i segni fuori banca; `avviaSegnalibri` che rilegge e confronta id e ordine; `ricercaNumero` con il testo com'è digitato e il risultato intero, duplicati e oscurati compresi; `permessoGesto` con `rigaScrivibile()` sui tipi del server che si ha davanti, `null` per un server di prima | `test_interfaccia.py::test_ridisegno_raccordi` |
| R-NAV-12 | `site/app.html` è una porta statica di compatibilità: niente banca, archivio o client, un `location.replace()` verso `/?sezione=allenati&segmento=quiz`, il frammento di un link letto in memoria e tolto con `replaceState`, il link «Apri Allenati» per chi non ha lo script, il titolo «Apri Allenati · Rotta Giusta». La regola è provata al contrario su una porta finta e, in `test_copia_del_sito`, sull'app di v0.31.0 al posto della porta | `test_interfaccia.py::test_porta_app` |
| R-NAV-13 | Il banco del ridisegno è provato contro sé stesso a ogni esecuzione: la pagina di riferimento lo passa per intero, ciascuna delle sue trenta rotture lo fa fallire nominando il difetto, e sulle rotture che toccano le due dichiarazioni il regime letto da Python coincide con quello del banco | `test_interfaccia.py::test_ridisegno_provato_al_contrario` |
| R-NAV-14 | Il gruppo dei tragitti è provato contro sé stesso a ogni esecuzione: ciascuna delle ventotto rotture dei tragitti sulla pagina di riferimento del client si applica e fa fallire la parte che la riguarda nominando il difetto, e la pagina con le due dichiarazioni e senza il grafo è rossa dal primo passo | `test_interfaccia.py::test_ridisegno_tragitti_provati_al_contrario` |

**Che cosa questi controlli non fanno.** Fino al 4 ottobre 2026 non fissavano
la composizione della barra, perché era Q-NAV e decideva l'autore; Q-NAV è
chiusa, e nel ridisegno R-NAV-03 e R-NAV-06 la fissano. Non vedono il DOM che
si muove, i testi, il fuoco, i ritorni, la geometria, e che il documento resti
lo stesso: è R-NAV-08. R-UX-01 dice che il Carteggio ha una sua stanza, non
che debba stare nella barra: nel ridisegno le sue porte sono in Allenati e in
Esame.

**Un regime solo per i quiz (P-12).** R-NAV-04 e R-NAV-05 erano scritti per
il passaggio all'area 2 (`area-2-progetto.md` §10.1), in due regimi: la pagina
pubblicata a sei modalità e quella progettata a cinque intenzioni, perché
`main` restasse verde mentre la seconda si realizzava. P-05 è fuso dal 26
settembre 2026, e dal 30 settembre il regime a sei ingressi non c'è più: il
banco (`tests/quiz_intenzioni.mjs`) gira su ogni pagina, ne estrae
`selezioneQuiz()` e la esegue contro il motore vero con una spia sulle
chiamate, e la pagina vera deve fare almeno le verifiche della pagina di
riferimento, gruppo per gruppo — il conteggio di P-40 e P-47. Provato sulla
pagina di prima di P-05 (`ccd98f0^1`): prima di P-12 passava con 5 verifiche e
nessun rosso, ora ha 7 rossi, fra cui Batteria, `selezioneQuiz()` che manca e
le verifiche dei filtri a 0 su 16. La pagina di riferimento
(`tests/pagina-quiz-intenzioni.html`) resta, per le rotture. Il contratto che la
pagina deve rispettare è nel §10.1 di quel progetto. Che cosa il controllo non
vede — la gerarchia, il giro dietro un disclosure, i testi, il focus, i
ritorni, «Base e vela» come due fasi — resta collaudo a 375 e 1280 px.

**Il ridisegno, e che cosa i controlli non vedono.** Dal 15 al 20 ottobre
2026 i regimi erano due (P-80), con il meccanismo delle aree 2–5 e la lezione di
P-51: il regime si legge dalla pagina; P-89 ha tolto quello di prima, e una
pagina senza le due dichiarazioni è rossa (§6.2). Il banco del ridisegno
(`tests/ridisegno.mjs`) estrae `navigazioneSito()` e i cinque raccordi con le
funzioni e le costanti in maiuscolo che nominano — mai lo stato della pagina —
e li esegue; la pagina di riferimento (`tests/pagina-ridisegno.html`) porta
trenta rotture, tutte rosse per il loro motivo; il banco della mappa pretende i
cinque stati e Allena (R-MAPPA-18); il banco del client serve il canonico su `/`
e traduce le porte di prima con gli alias quando la pagina non le tiene. I banchi sotto Node non vedono il DOM, i
testi, il fuoco, i ritorni, la geometria, e che il documento resti lo stesso:
la navigazione si prova come funzione — un indirizzo entra, una destinazione
esce. **Lo vede, da P-82, il gruppo dei tragitti in Chrome** (N-01 in
`tests/client_account.mjs`): sulla pagina vera e sulla pagina di riferimento
del client, con le parti documento, cronologia, indirizzi, storage, invito,
registrazione, stati, gesti, ricerca, scelte e i tragitti per stato. Il
documento si riconosce da un segno nella finestra JavaScript e dalle richieste
di tipo `Document`: un segno nel DOM la pagina lo ricreerebbe. I tocchi si
contano uno per gesto voluto, e ogni conteggio si dice con il titolo d'arrivo e
con il ritorno; il ciclo della registrazione è di quattro tocchi e non dei
cinque del §9, perché il modulo si chiude alla creazione — uno scostamento
detto nel §10.1 del progetto. Il banco è provato contro sé stesso a ogni
esecuzione (R-NAV-14): ventotto rotture della pagina di riferimento e la pagina
con le due dichiarazioni e senza il grafo, tutte rosse per il loro motivo; e
una difesa tolta alla volta, a mano: tre rotture passavano verdi prima di
rinforzare il banco — i link con `data-v` che saltavano il ramo rotto, il
timer che riparte guardato senza l'orologio, gli stati letti dopo la
ricezione dal server, che nascondeva un `applica()` senza istante —, e senza
il registro delle chiamate a `pushState` la voce che porta i dati passa verde.
**Che cosa non vede**, oltre a quello che il collaudo guarda: una lista che
cambia fra l'anteprima e Inizia (è dei raccordi sotto Node, R-NAV-11); un
modulo ricreato senza i campi sopra un legale; un 200 con scarti alla
registrazione (lo tengono C-10 e C-12, che girano sulla stessa pagina); la
ricezione da un altro dispositivo che aggiorna la mappa; la copia negli
appunti che fallisce davvero, che il banco accetta in tutti e due gli esiti. Un
segnalibro contato come risposta in schermata lo vede da P-89 C-23:coda, nello
stato dell'invio (R-SEGNO-04); le varianti giuste della pagina di riferimento
di prima — la domanda più corta, i gemelli con l'esatta diversa — girano da
P-89 su quella del ridisegno.

### 9.5 Gli stati

| ID | Requisito | Controllo |
|---|---|---|
| R-STA-01 | Senza data d'esame non compaiono `NaN` né numeri inventati | `test_engine.mjs::traccia: senza una scadenza niente quota` |
| R-STA-02 | Sotto le soglie misurate si usa il ripiego, **dichiarato** | `test_engine.mjs::stimaImpegno: sotto le 30 risposte` |
| R-STA-03 | L'import dice quante righe ha preso, quante aveva già, quante ha scartato | `test_engine.mjs::fondiArchivio: per uid, senza doppioni` |
| R-STA-04 | Una coda vuota produce un messaggio, non un clic senza effetto | scoperto — la suite non esercita il DOM di `app.html`; oggi si verifica solo guidando la pagina |
| R-STA-05 | Una scrittura fallita accende l'avviso, il pallino e la riga in Archivio | scoperto — richiede di far fallire IndexedDB nella pagina viva |
| R-STA-07 | Una figura indisponibile si dichiara con il perché | `test_dati.py::test_figure` |
| R-STA-08 | Una lettura che fallisce non ripiega su un dato plausibile: le letture cieche ancora presenti sono dichiarate, con l'area che le chiude | `test_interfaccia.py::test_letture_che_non_mascherano` |
| R-STA-09 | Aperte su un indirizzo che non è `rottagiusta.it`, l'app lo dichiara per prima cosa e offre di scaricare i progressi, e la Home manda all'app sul nuovo indirizzo | `test_interfaccia.py::test_trasloco` |

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
| R-TEMPO-09 | Senza orologio non c'è ritmo: righe senza un `ts` che sia una data non danno un ritmo `affidabile` né un numero, anche quando portano `sim_uid` e `ms` | `test_engine.mjs::ritmo: senza orologio non dice orologio` |
| R-TEMPO-10 | Il chiamante passa l'archivio com'è: le righe senza data non spostano il ritmo misurato sulle altre, e filtrarle prima non cambia niente | `test_engine.mjs::ritmo: il chiamante non deve filtrare le righe senza data` |
| R-TEMPO-11 | La soglia del ritmo conta le risposte misurate all'orologio, non quelle viste: né le risposte senza data né quelle sole nella loro lista la raggiungono | `test_engine.mjs::ritmo: la soglia conta le risposte misurate, non quelle viste` |
| R-TEMPO-12 | Una sessione senza orologio non ha una `durata`: è `null`, non la somma dei tempi di risposta | `test_engine.mjs::sessioni: senza orologio la durata non si inventa` |
| R-FLU-01 | Ogni attività si chiude con un passo che propone azioni derivate da quello che è appena successo. **Quiz, coperti:** riepilogo dell'attività intera — risposte, corrette, errate, non affrontate, esito solo per una prova e mai superata con domande senza risposta — e la riprova che offre, pronta o bloccata col suo motivo, eseguiti sulla pagina vera, che fa almeno le verifiche della pagina di riferimento; una pagina senza il raccordo è rossa. **Carteggio e tecniche:** R-FLU-24 per il riepilogo e la revisione, R-FLU-25 per la riprova che non c'è — due controlli distinti, come R-FLU-01 e R-FLU-10 per i quiz; il contratto del motore è R-FLU-12…22. **Segnali, scoperti:** il loro ciclo non è progettato | `test_interfaccia.py::test_ciclo_riepilogo` |
| R-FLU-02 | Gli errori di una sessione si riaprono come esercizio, senza mescolarli con quelli di sempre: tutti e soltanto gli errori di quell'attività, nell'ordine delle risposte, anche se nel frattempo sono stati corretti altrove | `test_engine.mjs::erroriSessione: apre esattamente gli errori di quella lista` |
| R-FLU-03 | Il conteggio annunciato e la lista che si apre coincidono anche per gli errori di sessione, nel motore; nella pagina lo tiene R-FLU-10 | `test_engine.mjs::erroriSessione: il conteggio promesso e la lista coincidono` |
| R-FLU-04 | Un confine di sessione ricostruito si dichiara invece di passare per registrato: il motore lo dice in `fonte`, e il riepilogo e l'istantanea della riprova lo portano fino alla pagina | `test_engine.mjs::erroriSessione: un confine ricostruito si dichiara` |
| R-FLU-05 | Un'attività registrata si riapre intera anche oltre una pausa: gli errori sono tutti i suoi, e la `fonte` registrata non copre un confine tagliato | `test_engine.mjs::erroriSessione: un attivita registrata resta intera oltre la pausa` |
| R-FLU-06 | Con il confine dell'attività ogni id compare una volta sola e le attività non si mescolano, nemmeno intrecciate nel tempo o con una riprova | `test_engine.mjs::sessioni: con confine attivita ogni id e unico e le attivita non si mescolano` |
| R-FLU-07 | Un id che raccoglie un quesito ripetuto, due modalità o due banche si dichiara ambiguo con il motivo, e non apre una lista né promette «zero errori» | `test_engine.mjs::sessioni: un id riusato con un quesito ripetuto o un altra modalita e ambiguo` |
| R-FLU-08 | Un errore su un quesito che la banca caricata non ha si nomina, invece di sparire dal conteggio | `test_engine.mjs::erroriSessione: un errore su un quesito che la banca non ha si nomina` |
| R-FLU-09 | Un confine sessione sconosciuto è un errore, non un ritorno silenzioso al predefinito | `test_engine.mjs::sessioni: un confine sconosciuto e un errore, non un ripiego` |
| R-FLU-10 | «Riprova questi N» apre l'istantanea presa al riepilogo — stesso numero, stessa lista, stesso ordine —, con un'identità nuova, senza timer e senza avanzamento automatico; se fra un clic e l'altro gli errori dell'attività sono cambiati, o l'attività non c'è più o non si legge, l'anteprima lo dice e Inizia non avvia niente. Un tag, un'altra attività o la banca ricaricata non cambiano la lista | `test_interfaccia.py::test_ciclo_riprova` |
| R-FLU-11 | Il controllo del ciclo si prova contro sé stesso a ogni esecuzione: una pagina di riferimento lo passa, e ciascuna delle sue rotture dichiarate lo fa fallire nominando il difetto | `test_interfaccia.py::test_ciclo_provato_al_contrario` |
| R-FLU-12 | Le attività del carteggio e delle tecniche si leggono con un contratto proprio, che nomina il tipo: un tipo mancante, sconosciuto o dei quiz è un errore, e `sessioni()` e `ritmo()` restano dei soli quiz | `test_engine.mjs::attivitaCarteggio: il tipo si sceglie per nome` |
| R-FLU-13 | Un'attività di carteggio o di tecniche registrata resta intera oltre qualunque pausa, e il suo dettaglio conta tutte le sue righe | `test_engine.mjs::attivitaCarteggio: un attivita registrata resta intera oltre la pausa` |
| R-FLU-14 | Le attività non si mescolano: fra due intrecciate nel tempo, con i quiz, con l'altro tipo, e ognuna porta soltanto le sue righe; la prova porta la sua riga di prova, un allenamento nessuna | `test_engine.mjs::attivitaCarteggio: le attivita non si mescolano, nemmeno intrecciate` |
| R-FLU-15 | Le righe senza legame si ricostruiscono e lo dichiarano — sulla carta per istante e modalità, sulle tecniche con le regole dei quiz —, e l'id di un gruppo ricostruito non dipende dall'ordine in cui l'archivio restituisce le righe | `test_engine.mjs::attivitaCarteggio: le righe senza legame si ricostruiscono` |
| R-FLU-16 | Un legame ambiguo — esercizio ripetuto, modalità diverse, tipi diversi, riga di prova estranea, variante diversa, quantità proposta incoerente — si dichiara con il motivo, e non apre schede né conteggi | `test_engine.mjs::attivitaCarteggio: un legame ambiguo si dice` |
| R-FLU-17 | Le schede, i conteggi e il filtro della revisione di carteggio vengono dalla stessa chiamata: «da rivedere» conta le schede che il filtro apre, le schede sono nell'ordine registrato della lista, e un campo vuoto è distinto da un campo non registrato | `test_engine.mjs::dettaglioCarteggio: schede, conteggi e filtro dalla stessa fonte` |
| R-FLU-18 | Un giudizio che manca non diventa «da rivedere», e la soglia di una prova di carteggio si dice soltanto con tutti i giudizi | `test_engine.mjs::dettaglioCarteggio: un giudizio che manca non diventa` |
| R-FLU-19 | Il riconoscimento delle tecniche conta le scelte coincidenti e non coincidenti e i non affrontati, e il filtro «non coincidenti» apre quelle che conta; nessuna scelta è distinta da una scelta non registrata | `test_engine.mjs::dettaglioCarteggio: le tecniche contano le scelte che non coincidono e i non affrontati` |
| R-FLU-20 | Le righe di prima non inventano niente: quantità proposta, non affrontati, variante e ordine sono «non registrati» quando mancano, e la quantità di una prova vecchia viene dalla sua riga di prova | `test_engine.mjs::dettaglioCarteggio: le righe vecchie non inventano quantita, variante ne ordine` |
| R-FLU-21 | Un esercizio che la banca caricata non ha si nomina e conserva il risultato proprio; senza la banca i mancanti non si dicono «nessuno», e i conteggi restano quelli delle righe | `test_engine.mjs::dettaglioCarteggio: un esercizio che la banca non ha si nomina` |
| R-FLU-22 | Un ritento della scrittura con gli stessi uid non conta due volte, uno con uid nuovi è un esercizio ripetuto, e un id che non c'è non è un'attività vuota | `test_engine.mjs::dettaglioCarteggio: un ritento con gli stessi uid non conta due volte` |
| R-FLU-23 | La pagina scrive le righe di carta e tecniche con lo schema di P-33 — un `sim_uid` nuovo a ogni attività, anche per giro, tappeto e tecniche, `proposti` e `pos`, gli stessi uid al ritento — e ne legge riepilogo e revisione da `attivitaCarteggio()` e `dettaglioCarteggio()`, senza filtrare le righe da sé: le righe della carta sono quelle di `concludiBozza()` sul lavoro dell'avvio, nessuna con un giudizio rinviato e le stesse a un ritento; quelle del riconoscimento hanno il legame e l'esito esatto; fuori dal raccordo la pagina non scrive righe del Carteggio e non le filtra per tipo. Eseguito sulla pagina vera, che fa almeno le verifiche della pagina di riferimento; le righe di prima di `salvaCart()` e `correggiTec()` sono uscite con P-21 | `test_interfaccia.py::test_carteggio_righe` |
| R-FLU-24 | Carta e riconoscimento si chiudono con un riepilogo e una revisione dell'attività intera, da una sola chiamata a `dettaglioCarteggio()`: conteggi, schede ed esito come il motore li dà — l'esito solo per una prova con tutti i giudizi —, «Rivedi quelli da rivedere (D)» con D uguale alle schede che apre, un legame ambiguo senza numeri, una lettura fallita distinta da un'attività che non c'è, i mancanti `null` senza la banca; anche per le prove di prima, i giri ricostruiti e fra attività estranee. Eseguito sulla pagina vera, che fa almeno le verifiche della pagina di riferimento | `test_interfaccia.py::test_carteggio_riepilogo` |
| R-FLU-25 | La riprova esatta resta dei quiz: il riepilogo del Carteggio non chiama `erroriSessione()` né offre una lista da riaprire, e il seguito è una preparazione nuova (area 4 §7.3). Un controllo suo, distinto da quello del riepilogo | `test_interfaccia.py::test_carteggio_senza_riprova` |
| R-FLU-26 | Il controllo del Carteggio si prova contro sé stesso a ogni esecuzione: una pagina di riferimento lo passa, e ciascuna delle sue rotture dichiarate lo fa fallire nominando il difetto | `test_interfaccia.py::test_carteggio_provato_al_contrario` |

**Un regime solo per il ciclo, e che cosa il controllo non vede** (P-31 e
P-37). R-FLU-01 e R-FLU-10 erano scritti per il passaggio all'area 3 (§10.1 del
suo progetto), in due regimi, con il meccanismo di R-NAV-04: la pagina di prima
aveva il riepilogo con gli errori del runner, e `main` doveva restare verde con
lei mentre il nuovo si realizzava. P-19 è fuso dal 26 settembre 2026, e dal 30
settembre il regime di prima non c'è più: il banco (`tests/ciclo_quiz.mjs`)
gira su ogni pagina, ne estrae le tre funzioni di raccordo —
`riepilogoQuiz()`, `anteprimaRiprova()`, `avviaRiprova()` — e fa il giro
riepilogo → anteprima → avvio contro il motore e la banca veri, con uno storico
estraneo e i dati che cambiano fra un clic e l'altro; e la pagina vera deve
fare almeno le verifiche della pagina di riferimento, gruppo per gruppo — il
conteggio di P-40, P-47 e P-12. Provato sulla pagina di prima di P-19
(`4129dfc^1`): prima di P-37 passava con tre verifiche e nessun rosso, ora ha
sei rossi — le tre funzioni che mancano, e riepilogo e giro a zero verifiche su
38 e 28. La pagina di riferimento (`tests/pagina-ciclo-quiz.html`) resta, per
le ventisette rotture. R-FLU-02…04 restano sul motore, dove i loro test li
tengono; R-FLU-10 li porta nella colla fra pagina e motore. **Non vede**, e
resta al collaudo a 375 e 1280 px — fatto da P-19, §10.4 del progetto —: i
testi dell'anteprima — quelli del riepilogo, dal 1° ottobre 2026, li legge
R-UX-06 nel banco del client —, la gerarchia delle uscite, il focus e i
ritorni, Esc, la conferma e la consegna idempotente di una simulazione, i tag
nella revisione, gli avvisi di scrittura e di lettura, le figure, Base e vela
come flusso. Che un'attività fermata dopo una risposta abbia il suo riepilogo e
la sua revisione, nel browser, lo tiene R-ACC-01.

**Un regime solo per il Carteggio, e che cosa il controllo non vede** (D-04,
P-35, P-50). R-SEL-17, R-FLU-23…26 e R-UX-07 erano scritti per il passaggio
all'area 4, in due regimi, con il meccanismo di R-NAV-04 e R-FLU-01: la pagina
di prima componeva la prova con la sua `componiProva()`, e `main` doveva restare
verde con lei mentre il nuovo si realizzava. P-21 è fuso dal 30 settembre 2026,
e dal 1° ottobre il regime di prima non c'è più: il banco
(`tests/ciclo_carteggio.mjs`) gira su ogni pagina, ne estrae le cinque funzioni
di raccordo — `preparaCarteggio()`, `avviaCarteggio()`, `concludiCarteggio()`,
`rispostaTecnica()`, `riepilogoCarteggio()`, il cui contratto è nel §10.1 di
`area-4-progetto.md` — e fa il giro preparazione → avvio → conclusione →
riepilogo contro il motore e le banche vere, con i dati che cambiano fra un clic
e l'altro; e la pagina vera deve fare almeno le verifiche della pagina di
riferimento, gruppo per gruppo — il conteggio di P-40, P-47, P-12 e P-37.
Provato sulla pagina di prima di P-21 (`1bb916a^1`): prima di P-50 passava con
otto verifiche e nessun rosso, ora ha undici rossi — le cinque funzioni che
mancano, e sei gruppi sotto il conto, preparazione a zero su 51, riepilogo a
zero su 93. La pagina di riferimento (`tests/pagina-ciclo-carteggio.html`)
resta, per le sue trentanove rotture. L'assunzione di Q-CART4 e i minuti della
prova tornano dal banco con un valore suo, così una pagina che li copia dal
motore a mano esce rossa. **Il lavoro del runner ha la forma della bozza in
tutti e due gli stati d'accesso**, in memoria: le righe finali e i loro uid
vengono da `concludiBozza()` con e senza account, e con l'account lo stesso
oggetto si scrive come bozza (§7.6, §9.11). **Non vede**, e resta al collaudo a
375 e 1280 px — fatto da P-21 nei due stati d'accesso —: i testi, i materiali,
la guida e l'esempio, la consegna a due tocchi, il confronto affiancato, il
giudizio rinviato come stato della pagina, «Valutazione in corso», i ritorni e
il focus, le tre porte. Che il giudizio sia detto prima dell'avvio lo guarda
R-UX-03, nel browser.

**Nessun banco riconosceva più un regime di pagina** (P-51, P-50) **fino a
P-80**. Il controllo al contrario di R-UX-07 etichettava `app.html` come
«attuale», e con il raccordo di P-21 sarebbe stato rosso con la pagina giusta:
si è fermato così P-21. P-51 gli ha fatto riconoscere il regime invece di
fissarlo; con P-50 il riconoscimento è uscito con il regime vecchio, e la
prova al contrario di R-UX-07 gira su una copia della pagina vera e su una
della pagina di riferimento. Quiz, ciclo, mappa e Carteggio hanno un regime
solo per il loro raccordo (P-12, P-37, P-47, P-50). Dal 15 ottobre 2026 c'è
di nuovo un regime di pagina, quello del ridisegno (§6.2), letto da due
dichiarazioni e con la scadenza alla merge di P-81: cambia il documento che i
banchi leggono, non i loro raccordi. Per misurare una bozza senza toccare
`site/`, `RG_PAGINA=<file>` fa girare la suite dell'interfaccia su una copia del
canonico — di qualunque regime —, e la riga finale lo dice. Per misurare un
sito intero, porta e manifest compresi, `RG_SITO=<cartella>` (P-84, §6.2) fa
lo stesso con una copia di `site/`, e lo fa anche `test_dati.py`; il
controllo `test_copia_del_sito` lo prova contro sé stesso a ogni esecuzione.

### 9.8 Che cosa non deve sparire, e che cosa si deve leggere

Nati dall'audit del 12 settembre 2026 e dalla richiesta di ChatGPT di registrare,
per ogni area, i comportamenti esistenti da preservare. Sono controlli e non
liste, perché una lista in un prompt è una regola da ricordare.

| ID | Requisito | Controllo |
|---|---|---|
| R-PRES-01 | Una funzione del motore che la pagina consuma non smette di essere consumata in silenzio | `test_interfaccia.py::test_chiamate_al_motore_preservate` |
| R-A11Y-01 | Nessun testo sotto gli 11 px, salvo eccezioni dichiarate con l'area che le corregge | `test_interfaccia.py::test_testi_leggibili` |
| R-A11Y-02 | Un'immagine che porta contenuto dichiara che cosa mostra; `alt=""` resta per le decorative | `test_interfaccia.py::test_alt_di_contenuto` |
| R-A11Y-03 | Contrasto ≥ 4,5:1 sul testo normale, misurato sui colori calcolati; le aree di tocco sono R-RIF-12, e il resto dell'accessibilità il §9.11 | `test_interfaccia.py::test_rifinitura_contrasto` |
| R-UX-06 | Una breve attività dichiara che cosa è successo, quali rivedere e che cosa non hai toccato: nessuna quarta affermazione, e nessun voto sulla preparazione. **Coperto, per quello che il banco vede** (P-53): sulla pagina vera, senza account e in un browser vero, il riepilogo dei quiz dice nel testo che si vede — l'`innerText` di `#r-fine`, che non contiene quello che è nascosto — i numeri di quello che il banco ha fatto in due attività della stessa pagina: risposte su totale, corrette, errate; con errori la frase del §4.2 di `area-3-progetto.md`, «Rivedi gli errori» e «Riprova» con N uguale alle errate, senza errori la frase «tutte corrette» e nessuna riprova; le non affrontate con la loro frase. Ogni riga e ogni uscita sta in un elenco chiuso di frasi ammesse — il §4.2, la conservazione del §3, l'invito del client §4.1 —, e nessuna parola da voto: percentuali, «pronto», «migliorato», «livello», «debole». Non vede l'ordine delle frasi, un testo reso invisibile con `opacity` o col colore del fondo, il riepilogo di una simulazione (§4.3, che un esito ce l'ha) e quello con l'account, dove cambia solo la frase della conservazione; i numeri del raccordo contro il motore restano a R-FLU-01 | `test_interfaccia.py::test_riepilogo_frasi` |

### 9.7 Le decisioni di prodotto

| ID | Requisito | Controllo |
|---|---|---|
| R-UX-01 | Il Carteggio è un ambiente proprio, raggiungibile senza cercarlo fra i quiz | `test_interfaccia.py::test_ogni_vista_ha_una_porta` |
| R-UX-02 | Il gioco dei Segnali non scrive nell'archivio delle risposte | scoperto — richiede di giocare e contare le righe; verificato a mano nella 0.19.2, quattro partite e archivio fermo a 101 righe |
| R-UX-03 | La prova di carteggio dichiara **prima dell'avvio** che il giudizio è di chi studia, nel testo che si vede del Carteggio e non alla consegna: guidata in un browser vero senza account, prima di Inizia. La frase riconosciuta è quella del progetto dell'area 4 (§4, «Sei tu a giudicare»), che la pagina ha da P-21; quella di prima, «e dici quali avevi preso», è uscita con il regime vecchio del Carteggio (P-50) | `test_interfaccia.py::test_client_tutte_le_attivita` |
| R-UX-04 | Gli extra non compaiono dentro la mappa della copertura | scoperto — dipende dalla struttura della Rotta, ancora aperta (§10) |
| R-UX-05 | Il carico di un'attività si annuncia in minuti, non solo in domande | scoperto — decisione aperta (§10) |
| R-UX-07 | Finché Q-AMBITO è aperta, la pagina non carica `carteggio_e12.json`: provato al contrario su una copia della pagina vera e su una della pagina di riferimento | `test_interfaccia.py::test_carteggio_ambito` |

### 9.9 L'accesso

Nati dall'ADR-004. Gli account sono nel sito pubblicato dalla v0.29.0, e nella
pagina dal 29 settembre 2026 (P-18): i requisiti della pagina si controllano su
quella, in un browser vero, e dal 30 settembre (P-40)
una pagina senza il client è rossa. Quello che il banco non vede è scritto in
righe sue, scoperte con il motivo (R-ACC-59…62). Quelli del server hanno il loro
controllo in `test_server.mjs`.

| ID | Requisito | Controllo |
|---|---|---|
| R-ACC-01 | Si arriva al primo quesito senza registrarsi, anche alla prima visita; fermata dopo una risposta, l'attività ha il suo riepilogo e la sua revisione. Fino al 3 ottobre 2026 anche offline, con il guscio caricato: l'ADR-005 ha tolto l'offline | `test_interfaccia.py::test_client_primo_ingresso` |
| R-ACC-02 | Senza account nessuna risposta resta dopo la chiusura della pagina, e la pagina lo dice prima di cominciare e alla fine di ogni attività: le due frasi del §4.1 del progetto del client, in testo che si vede; dopo una ricarica non mostra niente di prima. «Prima di cominciare» è la preparazione: dal 24 ottobre 2026 (P-92, decisione A del giro 1 delle regole di disegno) la frase si cerca nella preparazione della simulazione e in quella dei Segnali, prima di «Inizia», e non più nella Home; dove sta, e che stia una volta sola, lo tiene R-RIF-21, che dal 25 ottobre 2026 (P-97) la cerca nella Home anche parafrasata | `test_interfaccia.py::test_client_senza_account` |
| R-ACC-03 | La registrazione si raccomanda con i vantaggi che esistono in **tre posti** e in nessun altro (ADR-006): la Home a chi ha risposto senza account, il risultato di una simulazione — con «Conserva questa prova e ritrovala quando torni», senza la promessa del Percorso fino a P-76 (A-6) —, i riepiloghi delle attività; «Continua senza account» lo chiude senza chiedere altro, e torna solo con risposte nuove; mai durante un'attività, nella revisione, nel confronto, nei legali o nel contenuto di Progressi. Il banco prova il riepilogo e le viste senza invito (C-03), e i tre posti, la rinuncia che tiene la memoria e nessun quarto posto (N-01:invito, P-82), sulla pagina di riferimento del client e sulla pagina vera | `test_interfaccia.py::test_client_invito_e_viste` |
| R-ACC-04 | Senza account si fanno tutte le attività — i Quiz per argomento, la simulazione con la sua consegna, «Che tecnica serve?», la prova di carteggio, i Segnali —, ognuna fino al suo punto d'arrivo; ai registrati restano solo le viste che vivono di uno storico. Progressi senza account non è un cruscotto di zeri: mostra il riepilogo vero della pagina da `riepilogoPagina()` — «Nessuna risposta in questa pagina» o «Le attività di questa pagina» — e spiega perché manca lo storico, senza un invito nel contenuto | `test_interfaccia.py::test_client_tutte_le_attivita` |
| R-ACC-05 | L'archivio di prima degli account resta nel browser, e la pagina non lo guarda (ADR-005): con un database IndexedDB `open-patente-nautica` e le chiavi `localStorage` `pn.archivio` e `pn.esame` scritti prima, senza account e con — all'avvio, in un'attività fino al riepilogo, dopo una ricarica, all'accesso, all'uscita —, la pagina non apre quel database e non legge, non scrive e non cancella le chiavi `pn.`; non dice niente delle risposte di prima nel Percorso, in Info e dopo l'accesso; niente ne arriva nell'account; e alla fine l'archivio è quello di prima, byte per byte. Fino al 3 ottobre 2026 diceva il contrario — l'archivio si porta nell'account o si scarica —, con C-09. **Difetto aperto dichiarato sulla pagina vera** finché P-61 non toglie il passaggio, che lo legge a ogni avvio | `test_interfaccia.py::test_client_archivio_di_prima` |
| R-ACC-06 | Le righe della pagina aperta e quelle dell'account si uniscono per `uid`, senza doppioni e senza vincitore | `test_engine.mjs::fondiArchivio: per uid, senza doppioni` |
| R-ACC-07 | Una riga si accetta o si rifiuta con una regola sola, `validaRiga()`, e il rifiuto dice il motivo | `test_engine.mjs::validaRiga: una riga rotta` |
| R-ACC-08 | Le righe dei tag N/L/C, che nascono senza data, si importano | `test_engine.mjs::fondiArchivio: i tag si importano` |
| R-ACC-09 | Senza account la pagina non conserva niente nel browser, nemmeno le preferenze: dopo un'attività e la data d'esame, niente in IndexedDB, localStorage, sessionStorage, cookie, né in Cache Storage altro che file del sito, e nessuna richiesta all'API | `test_interfaccia.py::test_client_senza_account` |
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
| R-ACC-39 | Un trasferimento verso l'account — le righe della pagina alla registrazione, un file — si dice salvato solo quando il server ha nominato ogni sua riga, in un invio o in una ricezione: non per deduzione dalla coda, non dopo un azzeramento, e non con le conferme di un database che un ripristino ha sostituito; scarti locali e del server si contano per motivo | `test_engine.mjs::trasferimento: salvate solo le righe che il server nomina, anche su piu lotti` |
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
| R-ACC-55 | La data d'esame dopo la registrazione è facoltativa e non inventata: la data scritta nella pagina si propone e si salva solo al clic, com'è anche se passata; senza, il campo è vuoto; un salvataggio fallito lo dice; entrando in un account che ha la data, il passo non si ripete, la data resta e la pagina mostra quella del server. L'onboarding chiede anche «che cosa stai preparando?», due scelte facoltative senza un default, con le stesse regole: «salvate» solo con i valori riletti dal server, e solo con un server che dichiara i due campi in `campi_profilo` (P-83, A-5, sul server dal 15 ottobre 2026, e spenti nel server in esercizio fino al rilascio di P-81, la v0.32.0, che li accende: P-86, R-ACC-84): con uno che non li dichiara nessuna promessa di persistenza. Lo provano N-01:scelte e l'onboarding di N-01:registrazione (P-82): «Scelte salvate» e il database con i due campi; un 200 che rilegge valori diversi non è «salvate»; senza `campi_profilo` nessuna promessa e niente al server; senza account «Scelte applicate a questa pagina» (N-01:storage). Dal P-88 la raccolta la accende la parte sul server della sua corsia, su qualunque pagina — accesa per «Scelte salvate», per il 200 che rilegge e per l'onboarding; spenta davvero, e non una descrizione a cui si tolgono campi, per «senza `campi_profilo`», dove il banco guarda anche che nessun `PUT /v1/profilo` porti una scelta —, così la pagina vera del ridisegno passa N-01:scelte prima del rilascio che le accende sul server vero | `test_interfaccia.py::test_client_data` |
| R-ACC-56 | «Scarica i tuoi progressi» con l'account è l'export del server, e dice quante risposte da inviare non contiene, scaricabili a parte; su un'origine senza API nessun modulo d'account, nessuna richiesta all'API e niente di personale nel browser: un link a `rottagiusta.it/app` | `test_interfaccia.py::test_client_export` |
| R-ACC-57 | I testi di `site/` sono quelli della versione con gli account: nessuna delle frasi che gli account rendono false, commenti compresi, e tutte quelle del §11.2 del progetto del client. Il contenuto giuridico dell'informativa resta al gate dell'autore | `test_interfaccia.py::test_client_testi` |
| R-ACC-58 | La pagina ha il client degli account: dichiara `indirizzoApi()`, e una pagina che non la dichiara — quella di prima di P-18 — è rossa, qui e in ogni gruppo del banco | `test_interfaccia.py::test_client_nella_pagina` |
| R-ACC-59 | Il cookie di sessione va e torna fra `rottagiusta.it` e `api.rottagiusta.it`, in HTTPS e con il prefisso `__Host-`, anche su Safari con la sua protezione dal tracciamento; e un IndexedDB che su Safari non si apre si dichiara | scoperto — il banco guida solo Chrome, su `http://localhost` e due porte (§12 del progetto del client, «Il banco»); si prova in esercizio (P-15) e su un Safari vero (Q-PROVE) |
| R-ACC-60 | I moduli dell'account si usano con il gesto vero: tastiera e fuoco, lettore di schermo, incolla e riempimento del gestore di password, a 375 e 1280 px | scoperto — i clic del banco sono `element.click()` e i campi si scrivono da uno script; è il collaudo della pagina, fatto da P-18 in Chrome e nel dialogo di accesso su Safari |
| R-ACC-61 | Le mail di conferma, di recupero e d'avviso arrivano nella casella e non nello spam, con i link com'erano | scoperto — il banco ha una posta sua, e il server sa solo che il fornitore l'ha accettata; si vede alla messa in esercizio (P-15) |
| R-ACC-63 | «Scarica e passa al nuovo archivio», dopo un azzeramento fatto altrove, fa quello che dice: il file porta le risposte non salvate e si ricarica; dopo il download si chiede di confermare di aver conservato il file, e senza la conferma la copia non cambia; confermato, la copia è quella del server e nessuna risposta del file rientra, mentre una risposta nuova entra | `test_interfaccia.py::test_client_scarica_dopo_azzeramento` |
| R-ACC-64 | «Cancella queste risposte», dopo il recupero della password di un account che non era confermato, fa quello che dice: chiede una conferma esplicita e senza la spunta non cancella niente; confermata, le risposte spariscono dal server con una generazione nuova, la copia di questo dispositivo le segue, e l'account resta usabile | `test_interfaccia.py::test_client_cancella_dopo_recupero` |
| R-ACC-65 | Con punteggi dei Segnali che il server non ha accolto non si esce, e lo si dice; «Scarica le risposte non salvate» porta anche i punteggi, e dopo la scelta esplicita si esce senza mandarli a nessun account; con la rete «Riprova l'invio» li manda, e solo dopo esce | `test_interfaccia.py::test_client_uscita_segnali` |
| R-ACC-66 | Un pulsante di conferma premuto senza la conferma dice che cosa manca, invece di non fare niente: «Carica il nuovo archivio» senza «Ho conservato il file», «Cancella queste risposte» senza «Confermo la cancellazione». Il messaggio sta nella finestra, in testo che si vede, e nomina la casella; intanto né la copia né il server cambiano. Quello che il banco non vede — che il lettore di schermo lo annunci, il colore e il contrasto — è di R-ACC-60 e di R-A11Y-03 | `test_interfaccia.py::test_client_conferma_mancante` |
| R-ACC-67 | Chi si è opposto al trattamento per le statistiche è fuori da ogni conteggio — sulle righe, sugli account e sui punteggi dei Segnali, semplice, per gruppo o di persone distinte —, e nel suo account non cambia niente: le risposte, l'export, la descrizione. Il segno sta nel database: regge un riavvio e un azzeramento, e si toglie. L'export non lo porta | `test_server.mjs::statistiche: chi si e opposto esce da ogni conteggio, e le sue risposte restano nel suo account` |
| R-ACC-68 | Il segno lo mette e lo toglie il titolare dalla macchina, con il servizio acceso, e ogni cambio è una riga del registro con il numero dell'account e un motivo obbligatorio, che non porta email; rimetterlo non scrive niente, e un database o un account che non ci sono — o un file vuoto al posto del database — non producono un database vuoto né un «fatto» | `test_server.mjs::statistiche: il titolare mette e toglie il segno dalla riga di comando, con il servizio acceso, e il registro lo annota` |
| R-ACC-69 | Ogni statistica passa da `server/statistiche.mjs`: fuori di lì una query che aggrega, o che legge le righe di tutti, è rossa se non è dichiarata con il motivo per cui non è una statistica; e una statistica che nomina una tabella vera, o che fa uscire chi ha risposto, le righe intere o un'email, è rifiutata. Su un database di prima del segno non si conta | `test_server.mjs::statistiche: una query aggregata o su tutte le righe fuori da server/statistiche.mjs e rossa, se non e dichiarata` |
| R-ACC-70 | Il ripristino di una copia non rimette nei conteggi chi si è opposto dopo la copia, e non tiene fuori chi ha ritirato: il segno si rilegge dal file delle cancellazioni, per `id` e chiave, anche da una copia di prima dello schema 4 e anche se il ripristino l'ha fatto il rilascio di prima, perché il server lo rilegge a ogni avvio. Un'opposizione non spiega un calo di righe fra due copie | `test_server.mjs::ripristino: chi si e opposto dopo la copia resta fuori dai conteggi, anche da una copia di prima del segno` |
| R-ACC-71 | Il titolare legge un account dalla macchina, con il servizio acceso, con `server/leggi.mjs`: un'email e un motivo, e lo strumento mostra l'account — senza password, chiave della copia locale né impronte — e le sue attività con le funzioni del motore, le stesse della pagina: le righe com'erano, `sessioni()` con il confine dell'attività, `attivitaCarteggio()` e `dettaglioCarteggio()`, `traccia()`, `tagPerTentativo()`; le risposte contate con `rigaDiRisposta()`, come le conta la pagina, e a parte, con il loro nome, le prove avviate — le righe `'a'` com'erano, con motore e stime —, i segnalibri — `segnalibri()`, l'ultimo gesto per quesito — e i tag (dal P-78). Ogni lettura è una riga del registro, `lettura del titolare`, con quando, il numero dell'account e il motivo, senza IP; anche la seconda con lo stesso motivo. Niente di un altro account esce | `test_server.mjs::letture: il titolare legge un account dalla riga di comando, con il servizio acceso, e ogni lettura e una riga del registro` |
| R-ACC-72 | Senza la riga nel registro non si legge: senza motivo, con un'email nel motivo, senza email, con un account o un database che non ci sono, con un file vuoto o che non è un database di questo server, su un database di prima del registro o che non si può scrivere, e se la lettura si rompe a metà, lo strumento non mostra niente, non annota niente, non dice «fatto», e non crea né migra un database | `test_server.mjs::letture: senza motivo, senza account, senza database o senza poter scrivere il registro non si legge niente` |
| R-ACC-73 | Una lettura non cambia niente dell'account: ogni tabella tranne il registro resta com'era — nemmeno «ultimo accesso» —, niente va nel file delle cancellazioni, e chi studia non vede niente di diverso. La riga della lettura sopravvive alla cancellazione dell'account, con il suo numero e senza email, e dura un anno come gli altri eventi del registro | `test_server.mjs::letture: una lettura non cambia niente dell account, e la sua riga sopravvive alla cancellazione e dura un anno` |
| R-ACC-74 | Il titolare ha una strada sola per leggere, e fuori dal web: i file di `server/` e di `strumenti/macchina/` che leggono le righe di un account sono dichiarati uno per uno con il motivo, e un file nuovo è rosso finché non lo è; solo `server/leggi.mjs` importa `server/letture.mjs`; lo strumento non ha query sue, non apre in sola lettura e non migra. Le prove avviate e i segnalibri (P-78) non hanno chiesto né una query né una dichiarazione nuova: vengono dalle righe che `leggiAccount()` legge già | `test_server.mjs::letture: chi legge le righe di un account e dichiarato, e il titolare ha una strada sola, fuori dal web` |
| R-ACC-75 | Chi si registra incontra le condizioni per l'account e l'età prima di creare l'account: nel modulo «Crea un account» aperto dal riepilogo di un'attività, dentro la finestra e in testo che si vede, prima del pulsante «Crea l'account e salva» — nel documento e sullo schermo —, c'è un link a `/avvertenza#condizioni`, l'indirizzo pulito e dentro il sito, e la frase dice i 18 anni; seguito il link, l'ancora c'è nella pagina che il sito serve, si vede, ed è il titolo delle condizioni per l'account; e in `site/avvertenza.html` l'ancora è una sola, su quel titolo, in una sezione che dice gli stessi 18 anni. Coperto per quello che il banco vede: non la frase parola per parola, non le altre due porte del modulo; che la finestra non sia coperta è R-ACC-76 | `test_interfaccia.py::test_client_condizioni` |
| R-ACC-76 | Il modulo «Crea un account» aperto dal riepilogo di un'attività si vede davvero: a 375 px il titolo, il link alle condizioni, la frase sui 18 anni e il pulsante che crea l'account, portati al centro, stanno nello schermo, non sono trasparenti, non hanno niente sopra e hanno il contrasto minimo. Fino al 2 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera: la finestra si apriva sotto il riepilogo — `.account-panel` aveva `z-index` 30, i runner 80 —; P-58 l'ha portata sopra, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_client_modulo_visto` |
| R-ACC-77 | Una statistica sulle risposte conta soltanto risposte: la fonte `risposte` ha le righe per cui `rigaDiRisposta()` del motore dice vero, con il filtro costruito da `TIPI_RIGA` e non da un elenco scritto a mano, e la fonte `righe` ha tutte le righe con il loro tipo — anche i tag, le righe d'avvio e i segnalibri —, filtrata dagli iscritti come le altre. Una query che legge `risposte` e cerca per testo un tipo che lì non c'è (`tipo = 'a'`) è rifiutata, e dice di leggere `righe`: conterebbe zero in silenzio | `test_server.mjs::statistiche: la fonte risposte ha solo le risposte, e le righe d avvio, i segnalibri e i tag stanno in righe` |
| R-ACC-78 | `abilitazione` e `conseguimento` sono facoltativi e nulli, ognuno uno dei suoi valori o `null`; assente non modifica, `null` azzera; un valore estraneo o un campo che il profilo non conosce è un `422` con il campo, e non lascia scritti gli altri; la descrizione li porta con `campi_profilo`; un azzeramento non li tocca | `test_server.mjs::profilo: abilitazione e conseguimento, facoltativi e nulli, assente non modifica, null azzera, e un valore estraneo e un 422 che non scrive niente` |
| R-ACC-79 | L'export porta le scelte, e un altro account che carica il file come la pagina — righe e punteggi — resta con le sue | `test_server.mjs::esporta: il file porta le scelte di preparazione, e un altro account che lo carica non le riceve` |
| R-ACC-80 | Una copia dello schema 5 si ripristina allo schema 6 con le scelte nulle, non inventate; una dello schema 6 le riporta; lo strumento del titolare le dice `null` su un database di prima | `test_server.mjs::ripristino: una copia dello schema 5 si porta allo schema 6, e le scelte dette dopo la copia si perdono, non si inventano` |
| R-ACC-81 | Il rilascio di prima sul database di dopo parte, non dichiara `campi_profilo`, butta le scelte con un `200` — la ragione della capability —, e cancellando un account le porta via anche dai byte | `test_server.mjs::profilo: il rilascio di prima sul database di dopo non dice campi_profilo, butta le scelte con un 200, e cancellando le porta via dai byte` |
| R-ACC-82 | Le raccolte nuove hanno un interruttore nel codice del server, `RACCOLTE` in `server/raccolte.mjs`, uno per decisione — `esiti_e_previsioni`, `scelte_di_preparazione` —, e il codice dice che cosa il rilascio accende — la v0.31.0 tutti e due spenti, la v0.32.0 le sole scelte di preparazione —; `GET /v1/salute` dice le raccolte accese, e il processo avviato come sulla macchina le prende dal codice e non dall'ambiente; un nome o un valore sbagliato nell'opzione d'avvio è un errore | `test_server.mjs::raccolte: l interruttore sta nel codice, il rilascio dice quali accende, e la salute lo dice` |
| R-ACC-83 | Con esiti e previsioni spenti, un `PUT /v1/esito` che dice una prova è un `403 raccolta_spenta` che si legge, prima di guardare il corpo, e niente è scritto; un `PUT` di soli `null` e il `DELETE` tolgono; una riga `'a'` in `POST /v1/righe` è scartata con il motivo «riga d'avvio non raccolta», le altre dello stesso invio entrano, e un trasferimento la conta fra gli scarti; la descrizione non porta `esiti` e `tipi_riga` non porta `'a'` | `test_server.mjs::raccolte: con esiti e previsioni spenti, l esito e la riga d avvio sono rifiutati con il motivo, e niente si scrive` |
| R-ACC-84 | Con le scelte di preparazione spente, `PUT /v1/profilo` con `abilitazione` o `conseguimento` non nulli è un `422 raccolta_spenta` con il campo, e niente è scritto, nemmeno la data o i punteggi accanto; `null` toglie; la descrizione non porta le scelte e `campi_profilo` è `['data_esame', 'segnali']` | `test_server.mjs::raccolte: con le scelte di preparazione spente, il profilo le rifiuta con il campo e non scrive niente` |
| R-ACC-85 | Spegnere dopo aver acceso non toglie niente: esiti, riga d'avvio e scelte restano nel database; l'export li porta, la ricezione restituisce la riga d'avvio, lo strumento del titolare li mostra; la riga d'avvio già raccolta, rimandata, è «già presente»; `DELETE /v1/esito`, un `PUT` di soli `null`, `null` su una scelta, l'azzeramento e la cancellazione dell'account li tolgono | `test_server.mjs::raccolte: spegnere dopo aver acceso non toglie niente, e quello che c e si legge, si porta via e si cancella` |
| R-ACC-86 | Dalla pagina vera, con il server com'è nel codice, un file con una riga d'avvio importato nell'account: le risposte arrivano, la riga d'avvio no, la finestra la dice scartata con il suo motivo, e sta fra le righe non importate da scaricare; con la raccolta accesa la stessa riga arriva com'era (C-10:avvio). Dal P-88 i due versi girano su ogni pagina, accesi e spenti dalla parte sul server della sua corsia: fino ad allora il verso lo decideva la pagina, spento per quella vera e acceso per quelle di riferimento | `test_interfaccia.py::test_client_import_avvio` |

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
dell'interfaccia, le sostituzioni si spezzerebbero a ogni suo ritocco. Da P-89 è
quella del ridisegno, `tests/pagina-client-ridisegno.html`: la pagina di
riferimento di prima, `tests/pagina-client-account.html`, è uscita con il
regime di prima, e le sue rotture e le sue varianti sono passate qui (§6.2). Quello
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

**L'esclusione dalle statistiche (P-54).** R-ACC-67…70 nascono da una promessa
dell'informativa — chi si oppone resta con le sue risposte ed esce dai conteggi
— che oggi non è falsa solo perché nessuna statistica si calcola. I controlli
si eseguono contro il server vero e contro i due strumenti della macchina,
lanciati come processi. R-ACC-69 ha due metà, e la riga nomina quella statica:
quella che esegue le query rifiutate è `statistiche: una statistica legge solo
le fonti filtrate`, e il caso del calo di righe di R-ACC-70 è `copia: un
opposizione non spiega un calo di righe`. **Che cosa non vedono:** una query
scritta a mano in `sqlite3` sulla macchina; SQL costruito a pezzi, o un
conteggio fatto in JavaScript su righe lette da una query dichiarata; un alias
che fa uscire il numero dell'account; che il titolare lanci davvero lo
strumento quando arriva una richiesta, e in quanto tempo; e la macchina, dove
questo codice arriva con il traguardo. Il controllo statico guarda `server/` e
`strumenti/macchina/`, riga per riga: prende lo sbaglio, non chi lo vuole
aggirare.

**Le letture del titolare (P-55).** R-ACC-71…74 nascono da un'altra promessa
dell'informativa — «ogni lettura è annotata nel registro di sicurezza» — che
il 2 ottobre 2026 non era falsa solo perché nessuno aveva ancora letto: lo
strumento del §15.1 di `account-progetto.md` era «Proposto». I controlli
lanciano `server/leggi.mjs` come processo contro il database di un server
acceso, e chiamano `leggiAccount()` dove serve l'orologio del test. **La
lettura di un account passa il controllo di R-ACC-69 senza una dichiarazione**,
misurato: quel controllo lascia passare per costruzione una query che si ferma
a un account. Per questo R-ACC-74 ha un elenco suo: un secondo strumento che
leggesse un account senza annotare non lo vedrebbe nessun altro controllo.
**Che cosa non vedono:** una lettura fatta con `sqlite3` sulla macchina, che
non lascia traccia ed è della procedura del titolare, fuori dal repo — gli
account si leggono con `leggi.mjs`; chi ha lanciato il comando, perché il
titolare è uno e la riga dice «il titolare»; che cosa, dell'account, è stato
guardato a schermo; che il motivo scritto sia quello vero; le letture annotate
dopo una copia, che un ripristino perde come ogni evento del registro
(misurato: §15.1 di `account-progetto.md`, e §20 per l'autore); un file che
leggesse le righe con SQL costruito a pezzi, perché l'elenco di R-ACC-74 è sul
testo; e la macchina, dove questo codice arriva con il traguardo.

**Le risposte e le righe (P-78).** Il server accoglie le righe d'avvio (P-72) e
i segnalibri (P-71) da quando il motore li conosce, perché importa
`validaRiga()`; ma lo strumento del titolare li contava fra le righe senza
nominarli, e la fonte `risposte` delle statistiche li comprendeva, quindi
«quante risposte» contava anche quello che risposta non è, se chi scriveva la
statistica non si ricordava di filtrare per tipo. Ora R-ACC-71 dice le risposte
con `rigaDiRisposta()` e il resto a parte, ed entra R-ACC-77: `risposte` ha
le sole risposte, `righe` tutto. La forma, e perché non una colonna `tipo`
documentata, è nel §15.2 di `account-progetto.md`. **Che cosa non vedono:** un
tipo cercato con un parametro (`tipo = ?`), che la guardia di R-ACC-77 non
legge perché è sul testo; una statistica scritta prima di P-78 fuori dal repo,
che su `risposte` conta adesso meno righe di prima senza errore se non cerca un
tipo — è il cambio voluto, e fino a oggi nessuna statistica si è calcolata
(§3.7); e la
query del §4.7 di `esito-esame-progetto.md`, che legge gli avvii da `risposte`
e va riscritta su `righe`: oggi la guardia la ferma.

**Le scelte di preparazione nel profilo (P-83).** La decisione A-5 del 15
ottobre 2026 mette sul server «che cosa stai preparando?», perché l'onboarding
del ridisegno possa dire «salvate» solo quando lo è: R-ACC-78…81, proposti nel
§17 di `account-progetto.md` e portati qui dalla regia con i nomi dei test
letti in `tests/`. Si eseguono contro il server vero, e R-ACC-80 e 81 anche
contro il `ripristina.mjs` e il server della v0.30.0 estratti dal tag. **Un
difetto corretto per traverso**, misurato: fino a P-83 `PUT /v1/profilo` con
un campo sconosciuto rispondeva `200` e lo buttava, il «200 che ignora un
valore mandato» che il §2 di `esito-esame-progetto.md` aveva già trovato per
l'esito; ora è un `422` con il campo. **Che cosa non vedono:** la pagina,
che li consumerà con P-81 leggendo `campi_profilo` (R-ACC-55, con il banco di
P-82); l'informativa, che li nomina con P-81 (§11.2 del progetto del client);
le statistiche, che non li portano in nessuna fonte finché l'autore non
decide (§15.2 e §20 di `account-progetto.md`); e che l'export porti la data
d'esame, che oggi non porta mentre porta le due scelte (§20).

**Le raccolte spente (P-86).** La decisione dell'autore del 17 ottobre 2026
(§3.7, `account-progetto.md` §2.7-bis): le tre raccolte nuove dalla v0.30.0
restano spente sul server fino alla loro informativa. R-ACC-82…85 si eseguono
contro il server vero, nei tre versi — spente, accese, spente dopo l'accensione
con i dati ancora lì —; R-ACC-86 in Chrome, sulla pagina vera e su quella di
riferimento. Provati al contrario: ventidue rotture del server, una alla volta,
tutte rosse nel test che le riguarda, e la parte del banco rossa con il server
che accoglie la riga d'avvio. **Che cosa non vedono:** la macchina, che riceve
questo codice con il rilascio; un `PUT /v1/profilo` o una riga mandati da una
pagina di prima che non legge le capability — oggi non ce n'è —; il segnalibro
e il tag «Svista», nuovi anche loro e **non** spenti, la cui copertura
nell'informativa è una domanda per l'autore (§20 di `account-progetto.md`); e
la riga d'avvio rifiutata che resta nella copia del dispositivo fra le non
accolte, che è il comportamento della pagina per ogni scarto.

**Le condizioni nel modulo di registrazione (P-57).** L'informativa poggia il
salvataggio sull'esecuzione del contratto, cioè sulle condizioni per l'account,
e dice che l'account è per chi ha compiuto 18 anni; P-56 ha messo nel modulo
«Crea un account» la frase che le fa incontrare a chi si registra. R-ACC-75 la
tiene lì: un gruppo nuovo del banco del client, C-20, apre il modulo dal
riepilogo di un'attività, a 375 px e senza account, e cerca nella finestra — non
nella pagina sotto —, nel testo che si vede e prima del pulsante, il link con
la sua destinazione esatta e i 18 anni; poi segue il link, in un'altra scheda,
fino all'ancora. La frase non si cerca parola per parola: è dell'interfaccia.
L'ancora si guarda anche nel file, dove un giro fermato prima non arriva, e le
tre rotture del **sito** — l'ancora tolta, su un'altra sezione, nascosta —
girano con la pagina di riferimento intatta e l'avvertenza rotta, servita dal
banco al posto di quella di `site/`.

**R-ACC-76 è nato misurando R-ACC-75, ed è un difetto della pagina vera.**
`innerText` e i rettangoli dicono che un testo non è nascosto, non che niente
gli stia sopra: sulla pagina vera le quattro verifiche della frase erano verdi
mentre il modulo, aperto dal riepilogo, stava **sotto** il riepilogo — la
schermata prima e dopo il clic è la stessa, byte per byte, a 375 e a 1280 px.
Per questo C-20 ha una quinta verifica, con le misure degli avvisi dell'area 6
su titolo, link, frase e pulsante. Sulla pagina vera è stata un difetto aperto
dichiarato in `docs/eccezioni-interfaccia.md` fino a P-58 (2 ottobre 2026), che
ha portato `.account-panel` sopra runner, revisione e riepiloghi e ha tolto la
riga: da allora la verifica gira verde sulla pagina vera, e la suite lo
pretende. È separata apposta: la frase resta controllata anche se la finestra
tornasse coperta. La riproduzione, da quando c'è e che cosa lo chiude sono nel §12 del
progetto del client, «Le condizioni nel modulo». **Che cosa non vedono:** le
altre due porte del modulo sulla pagina vera, «Crea un account» dalla finestra
di accesso e dall'import di un file, che passano dalla stessa funzione; le
altre finestre dell'account aperte sopra un runner, che stanno allo stesso
livello di questa; che chi si registra legga la frase, e che cosa le condizioni
dicano — il loro contenuto è del gate dell'autore —; che i link delle
finestre dell'account si aprano in una scheda nuova, come fanno da P-58 perché
la pagina con le risposte da salvare non si ricarichi: l'ha guardato il suo
collaudo, e nessun controllo lo ripete; un lettore di schermo; Safari.

**L'archivio di prima resta dov'è (P-60).** L'ADR-005 ha tolto il passaggio
dell'archivio di prima degli account, e R-ACC-05 dice ora il contrario di
prima: la pagina non lo legge e non lo cancella. **Che cosa tenevano fermo i
controlli che escono, e chi se ne accorgerebbe senza.** C-09 teneva fermo il
passaggio — l'avviso con le due fonti unite per uid, il download senza rete, la
domanda prima di portarle, il segno sugli uid, «Più tardi» che non scrive, la
lettura fallita detta —; senza il passaggio non tiene fermo niente, e nessuno
se ne accorge, perché non c'è più niente da rompere. Il requisito che chiedeva
di portare un archivio vero senza perdite, scoperto, non era mai stato
eseguito, e chiedeva una cosa che non si fa più: è uscito dalla tabella, e il
suo numero non si riusa. Le sette rotture di C-09 escono con lui, e con il passaggio esce
dalla pagina di riferimento del client. **C-21** prende il posto, in due parti,
senza account e con l'account fino all'uscita: un archivio di prima scritto da
un'altra scheda — quattro righe in IndexedDB, due in `pn.archivio`, la data in
`pn.esame` —, e nella scheda dell'app uno strumento che registra ogni
`open` e `deleteDatabase` di quel database e ogni `getItem`, `setItem`,
`removeItem` e `clear` delle chiavi `pn.`. Poi il testo visibile, il database
del server, e l'archivio riletto dall'altra scheda e confrontato byte per byte.
Sei rotture della pagina di riferimento, tutte rosse ognuna in una verifica
sola: una lettura all'avvio, un'apertura all'accesso, una cancellazione
all'uscita — le vede lo strumento —; e tre che gli passano accanto, una
cancellazione per proprietà (`delete localStorage[…]`), un avviso nato da
`indexedDB.databases()` e una lettura per enumerazione (`{ ...localStorage }`)
che porta le righe nell'account — le prendono l'archivio riletto, il testo
visibile e il server. In ciascuna le altre verifiche restano verdi, quindi
ognuna delle quattro difese è l'unica a prendere la sua rottura. **Sulla pagina
vera C-21 è un difetto aperto dichiarato**: misurato il 3 ottobre 2026, la
pagina apre `open-patente-nautica` e legge `pn.archivio` all'avvio, nelle due
parti. **Che cosa non vede:** una lettura per enumerazione che non diventa né
un avviso né una riga sul server; `indexedDB.databases()` da solo, che non
legge le risposte; le chiavi della versione di prima senza il prefisso `pn.`,
se ce ne sono; Safari; e un archivio di prima vero, di mesi, che il banco non ha
e nessuno ha cercato.

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
| R-MAPPA-18 | La mappa porta i cinque stati sul totale e su ogni riga, da una `contaStati()` per aggregato con il filtro della riga di `quadro()` — mai ricontati in pagina con `statoQuesito()`, mai una sola chiamata spalmata —, i tre di `classifica()` restano per le azioni, e «Allena» passa da `anteprimaAllenaProgressi()` e `avviaAllenaProgressi()`: una `coda()` con il filtro della riga e venti quesiti, non «Rifai», e Inizia rilegge e confronta id e ordine o si ferma su «cambiata». Eseguito sulla pagina vera e sulla pagina di riferimento della mappa, con dieci rotture; fino a P-89 sulla pagina di prima il controllo diceva che non si applicava | `test_interfaccia.py::test_mappa_stati` |
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

### 9.11 La bozza del carteggio

Nati da D-03 del §10.1 di `area-4-progetto.md` e dal §7.6, il 30 settembre
2026 (P-34). Il contratto puro è nel motore; il raccordo della pagina è il §9.4
di `account-client-progetto.md`, e C-19 lo prova in un browser vero. La pagina
vera ha la bozza dal 30 settembre 2026 (P-21), e C-19 gira intero su di lei. Fino
ad allora R-BOZZA-06 era un **difetto aperto dichiarato** in
`docs/eccezioni-interfaccia.md`, e il suo controllo pretendeva che restasse rosso
finché lo era; P-21 ha tolto la dichiarazione nello stesso commit. Il sito
pubblicato ha la bozza dalla v0.29.0, il rilascio degli account.

| ID | Requisito | Controllo |
|---|---|---|
| R-BOZZA-01 | La bozza non è una riga: `validaRiga()` la rifiuta, `ripiega()`, `attivitaCarteggio()`, `fondiArchivio()`, la coda e i trasferimenti non la vedono; e una bozza con i campi di una riga non è una bozza | `test_engine.mjs::bozza: non e una riga, e resta fuori da specchio, attivita, import e invii` |
| R-BOZZA-02 | Scrivendo una bozza non cambiano lista, modalità, variante, inizio né scadenza; il testo consegnato non si riscrive; una revisione vecchia non sovrascrive quella di un'altra scheda, e una bozza conclusa o scartata altrove non si ricrea | `test_engine.mjs::sostituisciBozza: una revisione vecchia non sovrascrive, e una bozza sparita non si ricrea` |
| R-BOZZA-03 | Riaperta dopo una ricarica, la prova ha la scadenza di prima; scaduta a pagina chiusa si apre al confronto, con i testi e la consegna all'istante della scadenza; un allenamento non scade | `test_engine.mjs::riprendiBozza: la scadenza e quella di prima, e scaduta apre il confronto con il testo scritto` |
| R-BOZZA-04 | Con un giudizio rinviato nessuna riga; giudicata tutta, le righe finali hanno lo schema di D-02, uid che nascono dalla bozza, e il motore le legge come un'attività sola, registrata, con l'esito dei giudizi | `test_engine.mjs::concludiBozza: con un giudizio rinviato nessuna riga, e le righe finali sono quelle di P-33` |
| R-BOZZA-05 | Senza account il testo del carteggio non si scrive in nessuno storage né verso l'API, la pagina dice che resta finché è aperta, e dopo una ricarica non c'è niente da riprendere | `test_interfaccia.py::test_client_bozza_senza_account` |
| R-BOZZA-06 | Con l'account il testo è una bozza nella copia dell'account: regge una ricarica senza tempo nuovo, una prova scaduta si apre al confronto, un guasto non dice «salvato» e offre di copiare, il giudizio rinviato non diventa una riga, la conclusione scrive le righe e toglie la bozza, «Esci» non la cancella senza una scelta e lo scarto chiede conferma, e fra due schede l'uscita la conta, la scheda ferma non ricrea la copia e un altro account non la trova. Sulla pagina vera, C-19 intero, dal 30 settembre 2026 (P-21); fino ad allora difetto aperto dichiarato | `test_interfaccia.py::test_client_bozza` |
| R-BOZZA-07 | Il banco della bozza è provato contro sé stesso: la pagina di riferimento passa C-19 intero, e ciascuna delle sue rotture lo fa fallire nominando il difetto | `test_interfaccia.py::test_client_provato_al_contrario` |

**Che cosa questi controlli non vedono**, per esteso nel §12 del progetto del
client: giro e tappeto nella pagina (la stessa bozza, provata nel motore), la
conferma del browser, se «Copia i risultati» copia davvero, il pallino di Info,
un `401` o un azzeramento con una bozza aperta, Safari.

### 9.11 La rifinitura trasversale

Nati dal §10.1 di `docs/area-6-progetto.md` (P-24), fissati da P-45 il 30
settembre 2026. Quelli coperti li esegue il banco del client in Chrome — gruppi
T-01…T-09 di `tests/client_account.mjs` — sulla pagina vera e sulla pagina di
riferimento con le sue rotture, e **misurano**: la geometria dal rettangolo che
il browser dà, il fuoco con i tasti veri del protocollo, i colori calcolati,
l'avviso nell'albero di accessibilità del browser. Il contratto — gli agganci,
le frasi, dove sta la fonte di ogni numero — è nel §10.1 di quel progetto.

**I due regimi, qui, sono quelli d'accesso**: la prova senza account e
l'account, e ogni requisito dice in quale si prova. **Il passaggio all'area 6
non ha invece un raccordo da riconoscere**, come le aree 2–5: queste garanzie
valgono per la pagina di oggi come per quella di P-25. Quello che la pagina di
oggi non rispetta — misurato, e sono difetti veri — sta fra i «Difetti aperti
dichiarati» di `docs/eccezioni-interfaccia.md`, sette righe `T-*`, e la suite
pretende che sia ancora vero; il giorno che non lo è, la riga diventa rossa lei.
**Alla merge di P-25 quelle righe non ci devono più essere**: è lì che si esige
il regime nuovo.

| ID | Requisito | Controllo |
|---|---|---|
| R-RIF-01 | Senza account nessuna frase dice che le risposte sono conservate — «N risposte salvate», «nel tuo account», «confermate sul server», «su questo dispositivo», «salvato» da solo, «riprendi domani» —: nel Percorso, nel runner dopo una risposta, nel riepilogo, in Progressi e in Info | `test_interfaccia.py::test_rifinitura_senza_account` |
| R-RIF-02 | Con l'account la pagina dice che le risposte sono sul server solo quando il server le ha: con la rete che non risponde, e poi senza rete, con due risposte in coda non lo dice, e dice quante sono da inviare. **Difetto aperto dichiarato sulla pagina vera**: lo stato si ridipinge solo a invio finito | `test_interfaccia.py::test_rifinitura_invio` |
| R-RIF-03 | I numeri di Info e dell'invio vengono dalla loro fonte, letta dal banco e non dalla schermata: senza account le risposte della pagina aperta, con l'account le righe della copia `rg-account-<chiave>` e la sua coda | `test_interfaccia.py::test_rifinitura_invio` |
| R-RIF-04 | Una scrittura nella copia che fallisce si annuncia in una regione viva che il browser espone, si vede davvero con il runner aperto, nel riepilogo e nel Percorso, e la porta di Info la segnala in ogni vista anche dopo una scrittura riuscita | `test_interfaccia.py::test_rifinitura_guasto` |
| R-RIF-05 | Dopo un `401` durante il lavoro la pagina offre di nuovo «Accedi»; chi entra dalla stessa scheda vede in Info le sue righe e nessuna dell'identità di prima, e la risposta rimasta nel dispositivo non va a nessun account | `test_interfaccia.py::test_rifinitura_identita` |
| R-RIF-06 | Una finestra modale aperta da tastiera prende il fuoco, lo tiene con Tab e Maiusc+Tab, si chiude con Esc e lo restituisce a chi l'ha aperta; il browser la espone come dialogo modale con un nome. Provato sulla finestra «Accedi» | `test_interfaccia.py::test_rifinitura_finestra` |
| R-RIF-07 | Nel Percorso a 375 px ogni arresto di Tab cambia aspetto quando prende il fuoco, e il suo centro sta nello schermo senza niente sopra (WCAG 2.4.7 e 2.4.11). **Difetto aperto dichiarato sulla pagina vera**: la barra fissa copre tre arresti | `test_interfaccia.py::test_rifinitura_fuoco` |
| R-RIF-08 | Un avviso si vede davvero, non solo nel DOM: occupa spazio, portato al centro sta nello schermo, non è trasparente, non ha niente sopra, il suo testo ha il contrasto minimo, e l'albero di accessibilità non lo ignora. Provato sugli avvisi della prova — dal 24 ottobre 2026 quello della preparazione dell'allenamento breve, non più quello della Home (P-92) — e su quello del guasto | `test_interfaccia.py::test_rifinitura_avvisi` |
| R-RIF-09 | Reflow: a 1280, 640, 375 e 320 px nessuna vista della prova, né il runner, il riepilogo o la finestra «Accedi», scorre di lato, esce dallo schermo, scorre di lato dentro un contenitore o taglia un testo, e la pagina si dispone alla larghezza dello schermo; con l'account lo stesso a 375 e 320 px per Percorso, Progressi, Info e il pannello. **Difetto aperto dichiarato sulla pagina vera a 320 px**, nei due regimi | `test_interfaccia.py::test_rifinitura_larghezze` |
| R-RIF-10 | Con lo zoom del browser al 200 % e con il solo testo ingrandito al 200 %, e con la spaziatura del testo di WCAG 1.4.12, nessuna risposta, nota, azione o stato diventa irraggiungibile, nei due regimi | scoperto — il banco guida Chrome headless con una larghezza emulata, che non è lo zoom: 640 px sono la larghezza CSS di 1280 px al 200 %, e R-RIF-09 misura solo quella. Lo zoom nativo e il testo ingrandito si provano a mano, con la procedura qui sotto |
| R-RIF-11 | Contrasto del tema chiaro: ogni testo che si vede ha almeno 4,5:1 sul suo fondo, 3:1 se grande, dai colori calcolati, in ogni vista della prova, nel runner, nel riepilogo e nella finestra «Accedi», a 375 px. **Difetto aperto dichiarato sulla pagina vera**: quattro testi fra 4,09 e 4,26:1 (appendice A) | `test_interfaccia.py::test_rifinitura_contrasto` |
| R-RIF-12 | Bersagli: nelle stesse superfici ogni controllo che si vede misura almeno 24 × 24 px, il minimo AA, e 44 × 44, l'obiettivo del progetto; un link dentro una frase è escluso (WCAG 2.5.8), una casella si misura con la sua etichetta. **Difetto aperto dichiarato sulla pagina vera** per i 44 px | `test_interfaccia.py::test_rifinitura_bersagli` |
| R-RIF-13 | Contrasto degli elementi non testuali — bordi dei campi, stati, indicatore del fuoco — almeno 3:1, e nessun significato affidato al solo colore | scoperto — il banco confronta testo e fondo, non un bordo col suo intorno né un significato col colore che lo porta: serve guardare, con la procedura qui sotto |
| R-RIF-14 | I percorsi completi solo con la tastiera, nei due regimi: primo quiz, configurazione e filtri, runner e riepilogo, revisione e riprova, Carteggio, Progressi, Info e Account, accesso, verifica, import e export, conflitto, azzeramento; le scorciatoie dei quiz spente mentre si scrive in un campo | scoperto — il banco prova la finestra «Accedi» e gli arresti di Tab del Percorso (R-RIF-06, 07), non un percorso intero: i suoi gruppi del client premono con `element.click()` |
| R-RIF-15 | Un lettore di schermo reale annuncia titoli e gruppi, etichette, la domanda nuova, il riscontro, la scrittura fallita, lo stato dell'invio, il timer senza un annuncio al secondo, i dialoghi e il ritorno del fuoco; le figure dei quiz hanno il limite dichiarato del §6 del progetto | scoperto — l'albero di accessibilità dice che cosa il browser espone (R-RIF-04, 06, 08), non che cosa un lettore dice: la prova è manuale, con la procedura qui sotto |
| R-RIF-16 | Contrasto, bersagli, fuoco e avvisi anche con l'account e sugli stati del client — verifica dell'email, conflitto, import parziale, uscita con righe pendenti, `401` | scoperto — il banco li misura sulle superfici della prova e sulla finestra «Accedi»; con l'account misura lo sbordo (R-RIF-09) e l'avviso del guasto (R-RIF-04). Estenderlo agli stati del client è lavoro dopo P-25, sullo stesso banco |
| R-RIF-17 | Il pulsante per proseguire si raggiunge sempre (D-29 di I-27 in `docs/idee-dopo-gli-account.md`): nel runner dei quiz, dopo una risposta giusta e dopo una sbagliata, a 375×812 e a 375×667, con i due quesiti più lunghi della banca — base-1293, e base-829 con la figura — aperti per numero e l'avanzamento automatico spento, «Avanti» o «Vedi il riepilogo» sta nel primo schermo con il centro sotto il dito, oppure `scrollIntoView` lo porta lì muovendo soltanto contenitori che scorrono con il dito (overflow `auto` o `scroll`, o il documento); e niente di fisso gli sta sopra (`elementFromPoint`). Provato al contrario su tre rotture — il runner fisso che taglia, quello che sborda, un velo fisso sopra il pulsante —, e su due difese tolte una alla volta. Fino al 23 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera, nei quattro casi — il runner era fisso e non scorreva, e dopo la risposta la domanda si schiacciava a 22 px —; P-91 ha fatto scorrere l'intero runner, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_rifinitura_proseguire` |
| R-RIF-18 | La figura si vede prima di rispondere (D-01, D-02 e D-14 di I-27 in `docs/idee-dopo-gli-account.md`): nel runner dei quiz, a 375×812 e prima di rispondere, con i due quesiti con figura base-828 e base-829 — il più lungo con figura — aperti per numero, la figura caricata sta intera nell'area visibile, cioè nella finestra tagliata da ogni antenato con overflow diverso da `visible`, senza scorrere; niente le sta sopra (`elementFromPoint` sul suo centro); e nella stessa area ci sono l'inizio della domanda e il centro della prima risposta, sotto il dito. Provato al contrario su quattro rotture — un'area che taglia la figura, la figura sotto il bordo dello schermo, un velo sopra la figura, la figura nascosta —, e su due difese tolte una alla volta. Fino al 23 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera — i gesti di servizio stavano fra la domanda e la figura, e `.qbody` si tagliava prima della figura —; P-91 li ha spostati dopo le risposte e ha dato alla figura un tetto di 26vh sul telefono, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_rifinitura_figura` |
| R-RIF-19 | In ogni superficie della prova l'azione principale è una, ed è l'unica con lo stile pieno (D-12 di I-27): senza account, a 375×812 e a 375×667, nella Home prima e dopo una risposta, in Esame, nei segmenti Carteggio e Segnali, in sei preparazioni e nel riepilogo con un errore, nel primo schermo nessun elemento fuori dall'azione principale ha un fondo con contrasto ≥ 3:1 con la pagina — la soglia di WCAG 1.4.11 presa a prestito —, barra, avatar e segmenti esclusi; e un'azione principale che è un pulsante ce l'ha. L'azione la conosce il banco, con gli identificatori della pagina: la misura non legge l'aggancio. Provato al contrario su due rotture — un secondo pulsante pieno nel riepilogo, la principale senza fondo pieno —, e sulla difesa tolta a mano. Sulla pagina vera è verde dal primo giorno, misurato il 24 ottobre 2026: anche nel riepilogo con un errore l'invito sta sotto il primo schermo, e il punto 9 dell'audit del 21 ottobre non si ripete a 375 px. **Dal 25 ottobre 2026 (P-97, il volto, decisione 7)** D-14 è riscritta: contano le sole cose che si toccano — la carta, il velo e le schede che contengono testo non sono un secondo fondo pieno —, il fondo si misura contro la superficie che sta dietro e non contro la pagina, e la Home al computer si misura anche a 1280×800: con la pagina scura della U il pulsante pieno dentro la scheda bianca si confronta con la scheda | `test_interfaccia.py::test_disegno_principale` |
| R-RIF-20 | L'azione principale sta nel primo schermo (D-01): a 375×812 e a 375×667, scorrimento zero, il pulsante — o la prima porta di un gruppo — ha il bordo inferiore entro lo schermo e il centro sotto il dito (`elementFromPoint`). In Esame il titolo «Le prove» e la prima porta vengono prima di ogni campo di «Che cosa stai preparando?», nell'ordine del documento e nel primo schermo, e il modulo sta in un `details` chiuso il cui sommario dice la scelta e la data, o «Non l'hai detto» (decisione B del §11 di `docs/regole-disegno-progetto.md`, 24 ottobre 2026). Provato al contrario su quattro rotture — «Inizia» sotto la piega anche a 812, «Inizia» dei Segnali sotto la piega a 667, il modulo prima delle prove, il modulo aperto —, e sulla misura a 667 tolta a mano. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-93 l'ha chiuso, e la verifica gira verde senza eccezione. Dal 25 ottobre 2026 (P-97) la stessa misura vale per la Home al computer a 1280×800 e a 1200×700, sopra la soglia della U; sulla pagina vera è verde | `test_interfaccia.py::test_disegno_primo_schermo` |
| R-RIF-21 | L'avviso «senza account» si dice una volta, accanto a «Inizia» (D-14, D-24, D-30; decisione A del §11 del progetto, 24 ottobre 2026): nessuna frase del §4.1 del progetto del client nella Home, in Esame né nel segmento Carteggio; in ogni preparazione — simulazione, breve, «Scegli un argomento», prova ed esercizi di carteggio, «Che tecnica serve?», Segnali — la frase c'è, trovata per testo, una sola, al più a 48 px dall'azione principale (soglia nostra) e senza un altro bersaglio in mezzo; è testo e non un riquadro — fondo < 1,5:1 con la pagina e bordo su meno di tre lati (soglia nostra) —, occupa al più il 15 % del primo schermo (soglia nostra), e si vede davvero con le misure di R-RIF-08. La pagina lo dichiara: un solo `data-ruolo="principale"` sull'azione della mappa del banco, ogni avviso dentro un `data-ruolo="avviso"`. Provato al contrario su dieci rotture e sulle difese tolte una alla volta. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-93 l'ha chiuso, e la verifica gira verde senza eccezione. Dal 25 ottobre 2026 (P-97, volto §6.2) nella Home, in Esame e nel segmento Carteggio l'avviso si cerca anche **per significato**: una frase che dice «senza account» e, nella stessa frase, che le risposte non restano — la tappa 1 del mock della U, due parole meno della frase esatta — è rossa; misurata anche nella Home al computer a 1280×800. Non vede una parafrasi che non nomina l'account. Provato su una rottura in più, la frase parafrasata in una tappa | `test_interfaccia.py::test_disegno_avviso` |
| R-RIF-22 | Nel primo schermo della Home e delle preparazioni al più quattro bersagli (D-13, soglia nostra), barra, avatar, segmenti e il ritorno della preparazione (`[data-prep="chiudi"]`) esclusi; un'opzione si conta con la sua etichetta. Provato al contrario su una rottura. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera — 5 bersagli nella preparazione della simulazione, 8 in «Scegli un argomento» —; P-93 l'ha chiuso, e la verifica gira verde senza eccezione. Dal 25 ottobre 2026 (P-97, decisione 6 del volto) vale anche per la Home al computer, a 1280×800 e a 1200×700: il percorso è una navigazione ed è escluso come la barra (ogni `<nav>`), il faro e la boa contano, il conto atteso è quattro. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera — a 1280×800 la Home aveva 5 bersagli nel primo schermo —; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_disegno_scelte` |
| R-RIF-23 | I corpi calcolati dei testi visibili appartengono alla scala 12, 14, 16, 20, 24, 32 px; 56 solo per l'h1 della Home al computer sopra la soglia della U (1.200 × 680 px), 44 solo per «Come funziona» al computer e per i numeri dell'esame — un blocco di sole cifre — sopra i 900 px (dal 25 ottobre 2026, P-97, decisioni 1 e 2 del volto: la scala della Regata, che sostituisce 12, 14, 16, 19, 24, 30 e 40). I testi dentro la carta della Home — `svg[role="img"]` o `aria-hidden` — sono disegno e non si contano. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (titoli a 30, h1 della Home a 40, la domanda a 19); P-98 l'ha chiuso, e la verifica gira verde senza eccezione. Al più cinque corpi nel primo schermo (D-16, soglia nostra). Il contratto indipendente è SCALA_CSS in test_interfaccia.py; test_scala_css legge fogli, attributi e stringhe degli script. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (sulla Home sette corpi, Accedi a 11 px, titolo largo a 48); P-95 l'ha chiuso, e la verifica gira verde senza eccezione. T-13:home tiene anche il tetto di 78 parole di H0 a 375×812 (decisione E, soglia nostra), verde e senza eccezione. Provato al contrario sul riferimento con rotture dedicate | `test_interfaccia.py::test_scala_corpi` |
| R-RIF-24 | Un h1 nella vista attiva, al più tre livelli senza salti; nessun titolo è più piccolo del testo che introduce o di un titolo di livello inferiore nella stessa vista (D-15, dimensioni: soglia nostra). Un blocco di sole cifre («20», «30′», «4») non è il testo che il titolo introduce (P-97, volto §6.3). Info e Accedi sono dialoghi con h2. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (h2 della Home a 13 sopra h3 a 23 e testo a 16); P-95 l'ha chiuso, e la verifica gira verde senza eccezione. Provato al contrario sul riferimento con rotture dedicate | `test_interfaccia.py::test_scala_titoli` |
| R-RIF-25 | Margini, padding e gap dalla scala 4, 8, 12, 16, 24, 32, 48, 64 px — il 64 dal 25 ottobre 2026, decisione 5 del volto —, anche negli stili scritti da script; fra sezioni verticali più spazio che fra i figli della stessa sezione (D-22, D-23); fra due pannelli alti uno schermo e contigui si misura lo spazio fra i contenuti, non fra le scatole (P-97, volto §6.3). test_scala_css e T-13:spazi, auto ed eccezioni geometriche della tabella Valori fuori scala esclusi. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (padding 10/14 nella testata e in Esame 24 px fra gruppi contro 24/30 dentro); P-95 l'ha chiuso, e la verifica gira verde senza eccezione. Provato al contrario sul riferimento con rotture dedicate | `test_interfaccia.py::test_scala_spazi` |
| R-RIF-26 | Solo pesi 400, 600, 700 e 800, mai meno di regular; 800 solo per i titoli da 24 px in su e per i numeri (dal 25 ottobre 2026, decisione 4 del volto); nel paragrafo un tratto in grassetto ha al più cinque parole (D-20, soglie nostre per quantità e parole). test_scala_css e T-13:pesi. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (500, 550, 650 e 800 calcolati); P-95 l'ha chiuso, e la verifica gira verde senza eccezione. Provato al contrario sul riferimento con rotture dedicate | `test_interfaccia.py::test_scala_pesi` |
| R-RIF-27 | Testo corrente, domanda e risposte almeno 16 px; interlinea 1,45 per il testo e 1,2 per i titoli (decisione C, soglie nostre), 1,05 per i titoli da 44 e 56 px (dal 25 ottobre 2026, decisione 3 del volto); nessun giustificato, maiuscolo oltre una riga o paragrafo centrato oltre due righe (D-17, D-18, D-21, soglia nostra per il centrato). Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (paragrafi a 13/14, risposte a 15,5 e interlinee diverse); P-95 l'ha chiuso, e la verifica gira verde senza eccezione. Provato al contrario sul riferimento con rotture dedicate | `test_interfaccia.py::test_scala_testo` |
| R-RIF-28 | Almeno 8 px fra i rettangoli dei bersagli, esclusi i figli di tablist e i link dentro un paragrafo; caselle e radio con la loro etichetta (D-28). Si confrontano solo bersagli dello stesso strato — la pagina che scorre, o lo stesso contenitore `position:fixed` (barra, runner, pannello) —, e con un dialogo modale aperto solo quelli del dialogo: fra la barra fissa e la porta che le passa sotto la distanza dipende dallo scorrimento (P-95, 24 ottobre 2026). Non vede la vicinanza vera fra due strati, per esempio un bottone in fondo alla pagina subito sopra la barra a fine scorrimento. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (le voci della barra sono a 0 px); P-95 l'ha chiuso, e la verifica gira verde senza eccezione. Provato al contrario sul riferimento con rotture dedicate — due anche dentro la barra fissa e dentro il dialogo —, con due varianti che devono restare verdi, la barra fissa sopra il contenuto e il dialogo steso sopra la pagina, e con le due difese tolte una alla volta | `test_interfaccia.py::test_scala_distanze` |
| R-RIF-29 | A 1280×800 ogni riga di testo corrente ha al più 75 caratteri, con Range sui nodi di testo e unione per riga anche attraverso link e strong (D-19). --testo-max è 480 px: sul riferimento con Manrope il massimo misurato è 72. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (massimo del giro 110); P-95 l'ha chiuso, e la verifica gira verde senza eccezione. Provato al contrario sul riferimento con rotture dedicate | `test_interfaccia.py::test_scala_righe` |
| R-RIF-30 | L’accento --acc solo sulle azioni o loro parti, --ko sugli errori e sulle risposte errate, --warn sugli avvisi, --ok sulle risposte giuste: ruoli nostri, D-25, colori calcolati contro il contratto indipendente. Dal 25 ottobre 2026 (P-97, decisione 8 del volto) i valori sono quelli della Regata — `--acc` `#0a4f6e`, `--ko` `#b3261e`, `--ok` `#12663a`, `--warn` `#765000` che resta — e ci sono i ruoli «segno» (`--boa` `#ff6a1a`, `--rotta` `#b23f00`) e «terra» (`--terra` `#f2e6cf`): l'arancio delle boe su un testo, su un comando — colore, fondo, bordo o sottolineatura — o su un esito è rosso. I colori della carta (i settori del faro, il giallo della cardinale) sono contenuto e non si misurano. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera nella parte statica (`:root` non dichiarava i token della Regata); P-98 l'ha chiuso, e la verifica gira verde senza eccezione. Fino al 24 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera (accento sui segni informativi non interattivi delle tecniche); P-95 l'ha chiuso, e la verifica gira verde senza eccezione. Provato al contrario sul riferimento con rotture dedicate | `test_interfaccia.py::test_scala_colori` |
| R-VOLTO-01 | Sopra la soglia della U — 1.200 px di larghezza e 680 di altezza, decisione 9 del volto — la Home ha la carta: uno strato fisso dentro `#v-home` che copre lo schermo; sotto, a 1199×800 e a 1440×679, nessuno strato fisso, nessun fondo scuro e nessuno scorrimento a scatti; e la carta c'è solo con la Home aperta: in Allenati né strato né fondo scuro né scatti, e tornando alla Home di nuovo. Provato al contrario su due rotture — la classe della carta che resta fuori dalla Home, lo scorrimento a scatti su tutto il documento. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_soglia` |
| R-VOLTO-02 | A 1200×700, 1280×800, 1280×1024, 1440×900 e 1920×1080 gli undici triangoli del percorso stanno sulla terra — il pixel al loro centro, nella schermata con tutto nascosto tranne la carta, è il beige del contratto —, e il faro e la boa stanno dentro lo schermo e fuori dalla colonna del testo. Provato al contrario sulla terra ancorata in percentuale come nel mock, rossa solo a 1280×1024; senza quella dimensione la rottura passa verde. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_costa` |
| R-VOLTO-03 | Ogni testo della Home al computer ha il contrasto minimo — 4,5:1, 3:1 se grande — contro il **pixel peggiore** dietro di lui, alle cinque dimensioni, pannello per pannello: i testi resi trasparenti, una schermata, `tests/png.mjs` (decisione 14: il banco legge i pixel per questa misura sola; la carta non è un antenato del testo, e la composizione degli antenati direbbe il mare uniforme). Provato al contrario sul velo in percentuale, rosso solo a 1200×700, e su una cifra di scandaglio sotto l'h1; con la composizione degli antenati al posto dei pixel la seconda passa verde. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_velo` |
| R-VOLTO-04 | Il percorso è una navigazione: una `<nav>` con un nome e undici link, ciascuno con un nome e `href="#id"` verso il suo pannello; `aria-current="location"` sulla tappa del pannello in vista mentre si scorre; un tocco porta al pannello e il fuoco al suo titolo, senza cambiare l'indirizzo né la lunghezza della cronologia; bersagli di 44×44 px a 8 px; i triangoli, vuoti e pieni, a 3:1 sulla terra. Provato al contrario su tre rotture — il link che cambia l'indirizzo, i triangoli nell'arancio delle boe, i bersagli di 13×14 px; senza il confronto dell'indirizzo e della cronologia la prima passa verde. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_percorso` |
| R-VOLTO-05 | Con Tab da pagina appena aperta, a 1280×800, dopo la testata il primo fuoco è l'azione principale della Home; nessun fuoco va su un elemento che non si vede o che non fa niente, come il contenitore della carta. Provato al contrario su due rotture — il percorso prima dell'azione, la carta con `overflow:auto` che prende il fuoco | `test_interfaccia.py::test_volto_fuoco` |
| R-VOLTO-06 | Il faro e la boa sono pulsanti di almeno 44 px con `aria-expanded`; toccati, la sigla — «Lam.(2)», «Sc.(3)» — si legge in testo vero, fuori dal disegno, in un `aria-live="polite"`, e la scheda non copre la colonna del testo né l'azione principale, alle cinque dimensioni. Provato al contrario sulla scheda sopra la colonna. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_luci` |
| R-VOLTO-07 | Con il movimento ridotto emulato (`movimento()` in `tests/browser.mjs`) niente si muove: nessuna animazione in corso, le luci `[data-luce]` accese ferme, la rotta `[data-rotta]` disegnata intera; senza, le luci lampeggiano e «Ferma le luci» le ferma (WCAG 2.2.2 e 2.3.3, decisione 10). Provato al contrario su due rotture — le luci che lampeggiano anche con il movimento ridotto, nessun comando per fermarle. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera, nelle due verifiche; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_movimento` |
| R-VOLTO-08 | I numeri della Home al computer vengono dalla banca e dal motore, contati dal banco sui dati che serve e cercati nel testo visibile: i quesiti, gli esercizi del carteggio, i segnali (`E.SEGNALI`, 53), gli oscurati, le note dopo la risposta, il quesito senza figura, le condizioni della prova (`meta.prove.base`), la dimensione dell'allenamento consigliato (`E.mirata`), e i pesi dei temi dove una riga dice «N delle 20 domande». Non distingue un numero giusto scritto a mano da uno contato. Provato al contrario su «27 fanali e segnali», l'errore del mock. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_numeri` |
| R-VOLTO-09 | La Home al computer tiene gli stati che il mock non disegna (decisione 11): in H1 «Le attività di questa pagina» e l'invito nel primo pannello, in HA la proposta consigliata nel primo pannello, ogni `[role="alert"]` della Home nel primo pannello prima del suo titolo, e con la banca che non risponde nessun numero inventato e la frase che lo dice. Provato al contrario su un numero scritto a mano con la banca che non risponde. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_stati` |
| R-VOLTO-10 | Dalla Home al computer ad Allenati e Indietro il documento resta lo stesso, la carta va via in Allenati e torna nella Home, e lo scorrimento torna al pannello di prima. È N-01 sopra la soglia, per i passi che la U tocca; N-01 com'è continua a girare a 756×469. Provato al contrario sulle due rotture di R-VOLTO-01. Fino al 26 ottobre 2026 era un difetto aperto dichiarato sulla pagina vera; P-98 l'ha chiuso, e la verifica gira verde senza eccezione | `test_interfaccia.py::test_volto_documento` |
| R-VOLTO-11 | Le schermate del giro B, guardate a 375 e 1280 px, sono approvate dall'autore | scoperto — è uno sguardo, non una misura |

**Il volto, giro A (P-97, 25 ottobre 2026).** R-VOLTO-01…10 sono il gruppo T-15 del banco del client, per parti (`docs/volto-progetto.md` §6.4–§6.6), con la Home U nella pagina di riferimento sopra la soglia; R-RIF-19, 21…27 e 30 cambiano con le decisioni 1–8. Sulla pagina vera tutto T-15, T-12:scelte, T-13:corpi e la scala statica erano difetti aperti dichiarati; **P-98 li ha chiusi** (merge del 28 ottobre 2026), e le quattordici righe sono uscite da `docs/eccezioni-interfaccia.md` nello stesso commit della pagina. **Che cosa T-15 non vede**, oltre a quello che il §13 del progetto dice: la bellezza e le schermate del giro B (R-VOLTO-11); il gesto vero sul percorso e sulle luci, un lettore di schermo vero, Safari e un iPad; le prestazioni dello strato fisso; un testo nella carta che dice una cosa diversa dalla scheda; un numero giusto scritto a mano.

**Che cosa questi controlli non vedono.** L'altezza del testo quando la famiglia
di caratteri di sistema cambia; un contrasto sopra un'immagine o una
trasparenza, che la misura conta e dichiara «non misurabile» invece di
indovinare; un avviso che il browser espone e che un lettore poi non dice; il
gesto vero e il tocco; Safari, che il banco non guida (Q-PROVE). E un difetto
che P-25 introduca in una superficie che il banco non visita: le superfici sono
elencate nel §10.1 del progetto, e una nuova si aggiunge lì.

**Le prove manuali**, per R-RIF-10, 13, 14 e 15. Si registrano nell'appendice A
con data, browser e versione, sistema, strumento e che cosa si è fatto e
sentito; una prova non eseguita resta «non fatta», mai «da considerarsi
conforme».

- *Zoom (R-RIF-10).* Chrome e Safari desktop a 1280 × 800: zoom del browser al
  200 % (⌘+ fino a 200), poi in Safari «Ingrandisci solo il testo» al 200 %,
  poi il bookmarklet della spaziatura di WCAG 1.4.12 (interlinea 1,5, spazio fra
  paragrafi 2, fra lettere 0,12, fra parole 0,16). Per ognuno, nei due regimi:
  Percorso, un quiz fino al riepilogo, la revisione, il Carteggio, Progressi
  con l'account, Info, la finestra «Accedi» e il pannello dell'account. Esito:
  che cosa non si raggiunge, dove, con una schermata.
- *Non testuali (R-RIF-13).* Alle stesse superfici, a 375 e 1280 px: i bordi di
  campi, caselle e schede contro il loro fondo, l'indicatore del fuoco, e ogni
  stato detto da un colore — semaforo, giusti/da rifare/mai visti, esatta ed
  errata — letto in scala di grigi.
- *Tastiera (R-RIF-14).* Senza mouse, i percorsi della riga, prima senza
  account e poi con l'account di prova: ordine di Tab, fuoco sempre visibile,
  Esc e ritorno, e i tasti 1 2 3 che non rispondono mentre si scrive.
- *Lettore di schermo (R-RIF-15).* VoiceOver con Safari su macOS, e se c'è un
  iPhone VoiceOver su iOS: gli stessi percorsi, annotando che cosa si sente a
  ogni passo, e per le figure un campione di riconoscimento, di carteggio e la
  figura mancante di base-59.

### 9.12 I contratti per il ridisegno: stati, tag, segnalibri, numero

Nati dalle decisioni 8, 14, 15 e 20 di P-59, il 4 ottobre 2026 (P-71). Sono del
motore. Fino al ridisegno la pagina non li chiamava, e stavano fra gli orfani
dichiarati di `docs/eccezioni-interfaccia.md`; da P-81 li chiama, e sono fra le
chiamate protette.

| ID | Requisito | Controllo |
|---|---|---|
| R-STATI-01 | Cinque stati per quesito, con le conferme ad almeno 12 ore fra due risposte giuste, misurate come istanti: una risposta giusta non toglie una conferma (il controesempio di I-06), un errore la riapre, e una risposta senza data non conferma niente | `test_engine.mjs::statoQuesito: cinque stati, con le conferme ad almeno 12 ore` |
| R-STATI-02 | I cinque stati sono disgiunti e sommano al totale, per banca e sotto un filtro, e i tre di `classifica()` si ottengono dai cinque, quesito per quesito: coperto = incerto + sistemato + ok, da ripassare = debole | `test_engine.mjs::statoQuesito: i cinque stati sono disgiunti, sommano al totale` |
| R-STATI-03 | «Rifai N errori» apre i deboli: su ogni tema e ogni voce della banca vera la lista di `soloDaRifare` è quella dei deboli, e il loro conto è il suo numero | `test_engine.mjs::statoQuesito: «Rifai N errori» apre i deboli` |
| R-STATI-04 | Con l'istante della riga `applica()` costruisce lo stesso specchio di `ripiega()`, conferme comprese; senza, nessuna conferma si inventa e i tre stati non cambiano | `test_engine.mjs::applica: con l istante, lo stesso specchio di ripiega` |
| R-STATI-05 | Una pagina che legge i cinque stati passa a ogni `E.applica()` il `ts` della riga: altrimenti una risposta conterebbe come conferma solo dopo una ricarica. Il controllo tace finché la pagina non li legge, ed è provato contro sé stesso a ogni esecuzione | `test_interfaccia.py::test_applica_con_istante` |
| R-STATI-06 | Le parole dei cinque stati in schermata sono quelle di Q-STATI, «mai visti · da rifare · da confermare · recuperati · acquisiti», nell'ordine dei cinque stati del motore; la legenda dice che valgono «in base alle ultime risposte» e il `?` spiega le 12 ore; i numeri vengono da `contaStati()` per aggregato (R-MAPPA-18). In Chrome, con un account e righe sul server per ognuno degli stati (N-01:stati, P-82): le parole nell'ordine, i numeri del motore sulle stesse righe, la somma uguale al totale scritto, la legenda; e la seconda giusta a 13 ore dalla prima sposta il quesito ad «acquisiti» senza ricarica e prima che il server risponda, cioè dall'`applica()` con l'istante. Il `?` non lo legge: è del collaudo di P-81 | `test_interfaccia.py::test_ridisegno_stati_in_schermata` |
| R-TAG-01 | I tag «Non lo sapevo» (`N`) e «Svista» (`S`) si scrivono e si leggono; `L` e `C` restano validi, anche senza data, e non si riconvertono: vale l'ultimo tag per istante, qualunque sia | `test_engine.mjs::validaRiga: i tag «Non lo sapevo» e «Svista», e i vecchi restano` |
| R-TAG-02 | Un tag o un tipo di riga nuovo si scrive solo se il server che la pagina ha davanti lo accoglie, dal suo `tipi_riga`: provato contro i motori della v0.30.0 e del main di P-73, estratti dal repo, che rifiutano il tag `S` e il segnalibro | `test_engine.mjs::rigaScrivibile: un tag o un tipo nuovo solo se il server che hai davanti lo accetta` |
| R-SEGNO-01 | Il segnalibro è un tipo di riga, `_t: 'b'`, con data, quesito e `segnato` 1 o 0, che il server dichiara; non è una risposta | `test_engine.mjs::validaRiga: il segnalibro` |
| R-SEGNO-02 | Vale l'ultimo gesto per istante, i segni rotti non decidono, e l'allenamento «i miei segnalibri» dà la lista e il numero dalla stessa chiamata, nomina i segni su quesiti che la banca non ha e si restringe per banca | `test_engine.mjs::segnalibri: vale l ultimo gesto` |
| R-SEGNO-03 | I segnalibri non cambiano niente di quello che il motore seleziona o misura, entrano dall'import per `uid` e viaggiano nella coda | `test_engine.mjs::il segnalibro non e una risposta` |
| R-SEGNO-04 | Con l'account una coda con una risposta e un segnalibro si dice «1 risposta da inviare», non due: il segnalibro non è una risposta, e il numero conta le sole righe per cui `rigaDiRisposta()` dice vero. In Chrome, con la rete che non risponde, nella coda della copia una risposta e un segnalibro, e in schermata il numero 1 (C-23:coda, P-89). P-81 l'aveva trovata contata riga per riga, e l'ha corretta prima della merge; provato al contrario sulla pagina vera con il difetto rimesso e su una rottura della pagina di riferimento | `test_interfaccia.py::test_client_coda_segnalibro` |
| R-NUM-01 | Dal progressivo del decreto al quesito, base e vela: scritto come lo scrive chi studia, esatto o parziale per segmenti interi, un numero che non c'è senza risultati, un testo che non è un numero detto, un oscurato trovato e nominato, e ogni quesito con un progressivo leggibile trovato con il suo | `test_engine.mjs::cercaNumero: dal progressivo del decreto al quesito` |
| R-NUM-02 | La misura dei difetti della banca, riletta sul PDF del decreto (P-77): tre progressivi illeggibili, scritti così nel decreto, che non si trovano né per numero né per somiglianza, e undici numeri ripetuti nel decreto, che aprono tutti i loro quesiti; base-8, l'errore di estrazione, si trova con il suo numero, 1.1.1-8 | `test_engine.mjs::cercaNumero: sulla banca vera tre progressivi` |

**Che cosa questi controlli non vedono.** La pagina: i gesti, la barra e la
casella di ricerca li prova N-01 in Chrome da P-82, sulla pagina vera da P-81, e
un segnalibro contato fra le risposte da inviare C-23:coda da P-89; i testi — le
parole degli stati, dei tag, del segnalibro, i messaggi della ricerca — sono
dell'interfaccia. Il server accoglie già il tag `S` e il segnalibro, perché
importa `validaRiga()`; dal P-78 lo strumento del titolare li nomina a parte —
i segnalibri con `segnalibri()`, i tag fra i tag — e la fonte `risposte` delle
statistiche non li comprende: stanno in `righe` (R-ACC-71, R-ACC-77). Che un
tag `S` si mostri al titolare come «Svista» no: `leggi.mjs` conta i tentativi
con un tag, non le parole. E la regola delle 12 ore, che è una
scelta e non una misura: se rende, lo dirà l'archivio vero.

### 9.13 «Com'è andata» e le previsioni registrate

Nati da `docs/esito-esame-progetto.md` (P-64), con le decisioni dell'autore del
4 ottobre 2026 nel suo §11. Il motore li ha da P-72, il server da P-73, i
controlli della pagina da P-74, che porta qui i requisiti del §9 di quel
progetto con i nomi dei test che le sessioni hanno scritto. La pagina li avrà
con B-1 e B-2.

**Il server in esercizio li tiene spenti fino alla merge di P-75** (deciso
dall'autore il 17 ottobre 2026; P-86, §3.7): `PUT /v1/esito` e la riga d'avvio
sono rifiutati, e la descrizione non dichiara `esiti` né `'a'`. I requisiti del
server qui sotto dicono che cosa fa la raccolta **accesa**, e i loro test la
accendono con l'opzione d'avvio; che cosa fa spenta lo dicono R-ACC-82…86. Nel
banco della pagina ogni gruppo comincia con il server com'è nel codice, e dal
P-88 la parte che prova una raccolta la accende sul server della sua corsia,
su qualunque pagina: E-01 e P-01 accendono esiti e previsioni — anche nella
parte `spento`, perché una pagina senza raccordo non deve chiedere l'esito né
scrivere righe d'avvio nemmeno quando il server le accoglierebbe —, e le loro
parti `prima` le spengono davvero. Fino a P-88 le accendeva la pagina: tutte
per quelle di riferimento, nessuna per quella vera.

| ID | Requisito | Controllo |
|---|---|---|
| R-ESITO-01 | Un esito si scrive per prova e per giorno, con le regole del §3.3 del progetto: un `422` dice il campo e non lascia scritto niente, un campo che il server non conosce è un `422` e non un `200` che lo butta | `test_server.mjs::esito: si scrive per prova e per giorno, e un campo rotto non lascia scritti gli altri` |
| R-ESITO-02 | Senza account non c'è né la domanda né la voce «Il tuo esame», e nessuna richiesta va a `/v1/esito` | `test_interfaccia.py::test_esito_senza_account` |
| R-ESITO-03 | Il riquadro compare solo con la data d'esame passata da al più 90 giorni — dal giorno stesso — e senza esiti da trenta giorni prima della data in poi, nel Percorso e in nessun altro posto: mai in un'altra vista, in un'attività, in un riepilogo, in una finestra modale; «Non chiedermelo più» lo spegne su ogni dispositivo; e mai se `GET /v1/io` non porta `esiti` | `test_interfaccia.py::test_esito_quando` |
| R-ESITO-04 | «Salvato» solo dopo il `200`, e l'elenco che la pagina mostra è quello della risposta, non quello mandato | `test_interfaccia.py::test_esito_salvato` |
| R-ESITO-05 | Togliere cancella dai byte del database e del WAL; un ripristino da una copia di prima non lo riporta, nemmeno fatto con il `ripristina.mjs` di prima, perché il server lo rilegge all'avvio | `test_server.mjs::esito: togliere cancella davvero, e un ripristino non lo riporta` |
| R-ESITO-06 | La cancellazione dell'account porta via i suoi esiti, anche con il codice di un rilascio che non conosce la tabella | `test_server.mjs::esito: la cancellazione dell account li porta via, anche con il codice di prima` |
| R-ESITO-07 | Chi si è opposto è fuori dalla fonte `esiti`; una statistica che nomina `esito` è rifiutata; una query su `esito` fuori dal posto solo è rossa | `test_server.mjs::statistiche: gli esiti passano dalla fonte filtrata` |
| R-ESITO-08 | L'export porta gli esiti, e il file, caricato in un altro account, non li porta con sé: si ricarica con `importa()` con le stesse righe. Che l'anteprima dell'import lo dica è della pagina, con B-1 | `test_server.mjs::esporta: il file porta gli esiti, e importa non li carica` |
| R-ESITO-09 | Un azzeramento non tocca gli esiti | `test_server.mjs::azzera: gli esiti restano` |
| R-PREV-01 | `validaRiga()` accetta una riga `_t: 'a'` con le sue regole — `uid` uguale a `sim_uid` più «:a», `kind` base o vela, `stime` un oggetto semplice con chiavi `nome-N` — e rifiuta le altre forme con «avvio non valido» | `test_engine.mjs::validaRiga: la riga d avvio` |
| R-PREV-02 | Nessuna funzione del motore che seleziona, misura o disegna cambia il suo risultato per una riga d'avvio in più, in coda, in testa o mescolata: le funzioni del §7 del progetto, quelle che lo specchio alimenta e, da P-74, i cinque stati, i segnalibri e la ricerca per numero | `test_engine.mjs::la riga d avvio non cambia niente di quello che il motore calcola` |
| R-PREV-03 | `regola-semplice-1` conta le ultime 5 prove della stessa `kind`, una per `uid`, strettamente prima dell'avvio, e nessuna dopo | `test_engine.mjs::regola-semplice-1: le prove prima dell avvio, e nessuna dopo` |
| R-PREV-04 | Le uscite di ogni metodo registrato sono fissate su un archivio di prova: cambiarle senza cambiare il numero del metodo è rosso | `test_engine.mjs::un metodo che cambia cambia numero` |
| R-PREV-05 | Con l'account, a Inizia di ogni simulazione completa e di ogni fase di «Base e vela», una riga d'avvio nella copia prima della prima risposta, con l'`uid` della prova più «:a» — lo stesso `sim_uid` delle risposte e della riga della consegna —, la vela dopo la consegna della base, sul server con lo stesso `uid`, e le prove di prima contate; senza account nessuna, nemmeno portata nell'account alla registrazione | `test_interfaccia.py::test_avvio_registrato` |
| R-PREV-06 | La previsione non si vede: preparazione, runner e riepilogo di una simulazione sono gli stessi con e senza riga d'avvio, cifre a parte, e non dicono una percentuale né una parola di previsione | `test_interfaccia.py::test_avvio_non_si_vede` |
| R-PREV-07 | I conteggi che la pagina chiama «risposte» non contano le righe d'avvio: con il solo avvio in coda nessun «N risposte da inviare» e nessuna frase che dica tutto sul server, «prove avviate» in Info a parte, e l'uscita bloccata senza dire «N risposte»; con una risposta, N uguale alle risposte in coda | `test_interfaccia.py::test_avvio_non_e_una_risposta` |
| R-PREV-08 | Nessuna funzione del motore, salvo `validaRiga()`, `rigaAvvio()`, `rigaDiRisposta()` e i metodi di previsione, legge `_t: 'a'`: nel sorgente, e con una riga d'avvio che annota ogni campo che le si legge | `test_engine.mjs::la riga d avvio non la rilegge nessuno` |
| R-PREV-09 | Con un server che non dichiara `'a'` in `tipi_riga` la pagina non scrive righe d'avvio, né nella copia né sul server, e l'uscita non si blocca | `test_interfaccia.py::test_avvio_server_di_prima` |
| R-PREV-10 | Un metodo che lancia non ferma la prova: il runner si apre, e la riga d'avvio c'è con `errore` e senza la stima di quel metodo | `test_interfaccia.py::test_avvio_con_un_errore` |
| R-PREV-11 | «N risposte salvate nel tuo account» conta le sole risposte: `riepilogoTrasferimento()` dà `confermateRisposte` accanto a `confermate`, con `rigaDiRisposta()` sulle righe dell'archivio — un file esportato da un account porta anche righe d'avvio, tag e segnalibri, che sono righe salvate e non risposte —; un uid senza la sua riga non si conta | `test_engine.mjs::trasferimento: confermateRisposte conta le sole risposte` |
| R-PREV-12 | «Qui ci sono N risposte non salvate» conta le sole risposte: il conflitto di `dopoInvio()` e `dopoRicezione()` dà `nonSalvateRisposte` accanto a `nonSalvate`, e con soli avvii e tag in coda è zero | `test_engine.mjs::coda: il conflitto conta a parte le risposte non salvate` |

**Due regimi, e una scadenza** (P-74). R-ESITO-02…04 e R-PREV-05…07, 09, 10
si eseguono sulla pagina vera, in un browser vero, con il server degli account
accanto — gruppi E-01 e P-01 del banco del client, il contratto nel §10.1 del
progetto. La pagina di oggi non ha né il riquadro né la riga d'avvio, e il
banco la riconosce da un raccordo di quattro funzioni — `domandaEsito()` e
`salvaEsito()` per B-1, `avvioProva()` e `daInviare()` per B-2 —, letto dal
testo della pagina e non fissato nel controllo, come vuole la lezione di
P-51. Senza raccordo E-01 e P-01 girano la parte `spento`: con un account che
avrebbe le condizioni del riquadro e una simulazione completa, la pagina non
chiama `/v1/esito`, non mostra il riquadro e non scrive righe `_t: 'a'`, né
nella copia né sul server. È quello che i sette requisiti dicono oggi della
pagina vera, e il controllo lo pretende; una coppia del raccordo a metà è
rossa. Con il raccordo i due gruppi girano per intero, come sulla pagina di
riferimento del client, che lo realizza. **Il regime senza raccordo ha una
scadenza: la merge di P-75**, dopo la quale una pagina senza raccordo è rossa.
Ventinove rotture della pagina di riferimento, tutte rosse per il loro motivo:
le tredici che il §10.1 del progetto elenca, dodici nate scrivendo il banco —
fra le altre l'elenco di quello che la pagina ha mandato, il riquadro con il
server di prima, la vela senza la sua riga, le prove contate senza lo storico,
l'uscita che con il solo avvio in coda non si blocca, una frase che cambia con
la previsione senza numeri, e la previsione detta anche senza riga d'avvio —, e
quattro che tolgono il raccordo, o ne lasciano metà, con la funzione rimasta.
**Che cosa non vedono**, per esteso nel §12 del progetto del client: chi
risponde e chi no, e perché; un manuale aperto accanto a una simulazione;
l'orologio sbagliato di un dispositivo; un testo che lascia capire la
previsione senza scriverla né cambiare fra i due casi; il server di prima
vero, che dal P-88 il banco prova con la raccolta spenta davvero — la pagina
vede la stessa descrizione, senza `esiti` e senza `'a'`, ma con `tipi_riga`, e
il server rifiuta con un motivo dove quello di prima rispondeva `404` o «tipo
sconosciuto» —, e che fino ad allora imitava togliendo due campi a
`GET /v1/io`, con il server dietro che le accoglieva; «Non l'ho ancora
fatto», la correzione e il ritiro dell'esito dalla pagina, la pratica in un
altro giorno; Safari.

---

## 10. Che cosa non è deciso

Ogni riga dice **chi decide**. Una questione senza un decidente non si chiude mai.

| ID | Questione | Decide | Conseguenza se resta aperta |
|---|---|---|---|
| Q-DIM | La dimensione della prima attività per chi comincia | l'autore, dopo un confronto fra due varianti | Restano i 25 quesiti attuali, mai verificati su chi inizia |
| Q-PROG | Il programma d'esame come dataset | serve una fonte, poi l'autore | Nessuna mappa del programma è possibile: nel repo non c'è (§4.6) |
| Q-AMBITO | Se `carteggio_e12.json` esce dal cassetto | l'autore | 50 esercizi pubblicati e non usati; cambia il pubblico più di ogni scelta di navigazione. Finché resta aperta, un controllo pretende che la pagina non li carichi (R-UX-07): tirarli fuori è una decisione, non un ritocco |
| Q-CART4 | «Un esercizio per ciascuno dei quattro argomenti» è un'assunzione | serve la scuola nautica | La composizione della prova resta non confermata, e la 42/D non ha esercizi di carburante. Dal 30 settembre 2026 l'assunzione viaggia con il contratto, `PROVA_CARTEGGIO.assunzione`, e chi compone la prova la riceve con la lista (R-SEL-12). Dal 30 settembre 2026 (P-35) arriva anche alla preparazione della pagina, che la dichiara prima dell'avvio come la dà il motore, e un controllo la segue fino lì (R-SEL-17) |
| Q-STIMA | La frase di `docs/filosofia.md` sulla stima (proposta in I-12); chi fissa, prima di vedere i risultati, le soglie con cui la stima si mostra (ADR-006); e se chiedere «com'è andata» anche per email — è un uso dell'email che oggi la filosofia non nomina. **La strada in pagina c'è** (`esito-esame-progetto.md` §3, R-ESITO-01…09): il riquadro nel Percorso e «Il tuo esame», con il server da P-73 e i controlli della pagina da P-74; la porta B-1. Resta l'email, che l'autore ha rimandato il 4 ottobre 2026 (§11, punto 6 di quel progetto) | l'autore | La stima si registra (§3.2) ma non si mostra; la frase di oggi resta; «com'è andata» si chiede solo a chi torna sul sito |
| Q-PROVE | Verifiche con dispositivi reali e con persone — e Safari, che il banco del browser non raggiunge (rimandato dall'autore il 29 settembre 2026) | l'autore fornisce dispositivi e persone | Nessuna prova su hardware Apple vero, e nessuna prova con persone diverse dall'autore. Safari nel banco vorrebbe «Allow remote automation», un'impostazione dell'autore, e anche così WebDriver non legge lo storage (`account-client-progetto.md` §12): il cookie fra `rottagiusta.it` e `api.` su Safari si prova a mano |

**Chiuse, e non si riaprono senza un motivo nuovo:**

- **Q-COSTANZA: che cosa fa un giorno di attività** (17 ottobre 2026,
  l'autore, su una proposta della regia rivista dopo un parere di ChatGPT). Per
  «giorni di attività qui negli ultimi 14» (decisione 19, ADR-006 §3) un giorno
  conta se in quel giorno ci sono **almeno 10 quesiti distinti**, sommando le
  risposte ai quiz — simulazione compresa — e quelle del riconoscimento delle
  tecniche (`_t:'t'`), **oppure almeno un esercizio di carteggio con il
  giudizio registrato** (`_t:'c'`), **anche negativo**: si conta l'attività,
  non il successo. Lo stesso quesito ripetuto nel giorno conta una volta; la
  riga di consegna di una prova (`_t:'s'`) non aggiunge niente; un giudizio
  rinviato conta il giorno in cui si registra, come lo scrive
  `concludiBozza()`. I quattordici giorni sono **quattordici date di
  calendario, oggi compreso**, nel giorno locale del `ts`; una riga vecchia in
  UTC si conta nel suo giorno UTC, e lo si dice. **Una simulazione vela da sola
  non basta**, perché sono cinque domande: accettato. **Il 10 è una soglia
  pratica iniziale, non una misura validata dello studio**: la sua ragione è la
  coerenza con «Allenati con 10 domande» della Home, e i circa 23 secondi a
  domanda sono di una persona sola (`prossima-versione.md` §4.2), quindi non si
  promette una durata. **La schermata dice che cosa viene contato.** **I
  Segnali restano fuori, ed è una revisione esplicita della decisione 19**, che
  chiedeva «criteri giusti per quiz, carteggio e Segnali»: i Segnali non
  lasciano una data (§4.5), contarli vorrebbe una riga nuova o un dato nel
  profilo, e la misura propria non direbbe da sola chi studia solo coi Segnali;
  si riapre con una domanda e una misura sue. «N quesiti da confermare oggi»
  sono gli incerti la cui prima risposta giusta della serie è di almeno 12 ore
  fa, nella banca pertinente a «che cosa stai preparando?», con lista e numero
  dalla stessa funzione del motore. Scartate: una risposta sola (il guasto muto
  dell'ADR-006); dieci risposte anche ripetute; «un'attività conclusa», perché
  le righe non registrano la conclusione di un'attività (§4.4) e contarla
  vorrebbe uno stato salvato. Il contratto lo scrive P-76; con questa decisione
  la costanza non lo ferma più, e restano ferme le fasi e l'ambito di «hai
  concluso quello che ti avevamo proposto».

- **Q-STATI: le parole dei cinque stati** (13 ottobre 2026, la regia su delega
  dell'autore, «decidi tu e procedi»). Sulla barra e nella legenda, nell'ordine
  dei cinque stati del motore: **mai visti** (`mai_visto`), **da rifare**
  (`debole`), **da confermare** (`incerto`), **recuperati** (`sistemato`),
  **acquisiti** (`ok`). Le ragioni: «da rifare» resta la parola di oggi per il
  segmento che «Rifai N errori» apre, e i deboli sono esattamente quella lista
  (R-STATI-03), quindi chi conosce la barra di oggi non impara una parola nuova
  per la stessa cosa; «da confermare» è la parola che la decisione 19 usa già
  per la costanza — «N quesiti da confermare oggi» sono gli incerti a cui manca
  la seconda giusta a 12 ore —, e un quesito incerto è proprio questo: preso
  giusto, non ancora confermato; «recuperati» dice che c'è stato un errore e
  che dopo sono venute le due giuste, senza nascondere l'errore come farebbe
  «giusti»; «acquisiti» dice che non c'è mai stato un errore e le due giuste ci
  sono. Tutte plurali e senza verbo, come «mai visti», così stanno in una
  legenda da cinque voci a 375 px. Scartate: «giusti», perché copre due stati
  diversi e sparisce dalla barra; «da ripassare», per la ragione di Q-DUE punto
  3; «sicuri», perché promette una padronanza che il motore non misura (§7.4);
  «sistemati» e «ok», che sono i nomi del codice e non dicono niente a chi non
  l'ha scritto. La legenda dice che gli stati si leggono «in base alle ultime
  risposte», e il `?` spiega le 12 ore. I tre stati di prima si leggono dai
  cinque come `STATI_IN_TRE`: coperti = da confermare + recuperati + acquisiti.
  R-STATI-06 nomina le parole, e resta scoperto finché la pagina non le scrive.
  Si riapre dopo P-70, se le persone non le capiscono: è un testo, non un
  contratto.

- **Le decisioni del brainstorming P-59** (3 e 4 ottobre 2026, l'autore;
  scritte qui il 4 ottobre, con P-63). Le schede e la formulazione di ognuna
  sono in `docs/idee-dopo-gli-account.md`, «Le decisioni di P-59», e i numeri
  qui sotto sono i loro. Quelle che cambiano una promessa sono l'**ADR-006**:
  l'invito (12), le spiegazioni (11, 28), la costanza (19), la stima (23–27).
  **Il §5, il §6, il §7 e i requisiti del §9 non sono riscritti**: descrivono
  la pagina che c'è, e i loro controlli la tengono verde. Accanto a ogni
  decisione, che cosa cambierà con il progetto del ridisegno o con i contratti
  del motore.

  **Q-NAV, chiusa: la struttura** (decisioni 1–9; I-01, I-02, I-13, I-18).
  1. Il menu è **Home · Allenati · Esame · Progressi**, più l'avatar, che apre
     il Profilo — account, data d'esame, obiettivo, dati, Info, note legali,
     Esci —, e senza account «Accedi». Il pallino dei guasti sta sull'avatar,
     raggiungibile anche durante un'attività. Sul desktop la barra sta in alto.
     *Cambierà:* §5.2, §6.2, R-NAV-01…07, e la riga del pallino nel §5.4, che
     oggi sta sulla voce Info.
  2. **Allenati** ha tre segmenti, Quiz · Carteggio · Segnali: si apre sul
     segmento da cui si arriva, altrimenti su Quiz, e il ritorno da un'attività
     ripristina origine, segmento e posizione. «Che tecnica serve?» sta in
     Carteggio. Chiude anche **Q-EXTRA**: i Segnali sono il terzo segmento di
     Allenati, fuori dalla mappa della copertura come vuole il §6.3 (R-UX-04).
  3. **Esame** mette le prove nell'ordine in cui si sostengono — carteggio,
     quiz base, quiz vela —, con le condizioni del decreto, la data e le prove
     fatte, e mostra quelle che servono all'obiettivo scelto (13). Il carteggio
     d'allenamento e la prova di carteggio sono un ambiente solo, con due
     modalità e due ingressi. *Cambia* la decisione dell'8 settembre nel §6.1
     per la parte «un accesso nella navigazione principale»: il Carteggio resta
     un ambiente, e le sue porte sono in Allenati e in Esame. *Cambierà:* §7.3,
     R-UX-01.
  4. **Progressi** unisce Percorso e Progressi: in alto il «sei qui», poi i
     temi, le prove, l'andamento, le sessioni. Senza account mostra il
     riepilogo vero della pagina aperta, e che cosa l'account aggiunge.
     *Cambierà:* §7.1, §7.4, R-ACC-04.
  5. **La Home è `/`**, in tre stati. Senza risposte: che cos'è il sito, con i
     suoi benefici; **«Simula il quiz base»** come primo pulsante, con le
     condizioni accanto («20 domande · 30 minuti · al più 4 errori»);
     «Allenati con 10 domande»; le schermate; «Che cosa non torna». Con
     risposte e senza account: l'invito a conservarle (ADR-006). Con
     l'account: il cruscotto — una proposta per oggi con il suo perché,
     «Simula il quiz base», una riga di fatti e di costanza. *Cambierà:* §5.1,
     §7.1, e R-ARCH-06 se l'icona sulla schermata Home smette di aprire l'app.
  6. **La simulazione si raggiunge in un tocco**, dalla Home e da Esame, e apre
     la stessa preparazione: la regola «una stanza, una porta principale» del
     §6.3 resta.
  7. **I nomi «vetrina» e «palestra» escono**, e si usano i nomi delle sezioni.
     Da `AGENTS.md`, da questo documento, dal README e dalla skill li ha tolti
     P-63: la pagina iniziale è «la Home», `/app` è «l'app». Il CHANGELOG e i
     registri restano come sono stati scritti. Nella pagina — il `<title>` di
     `/app`, «La palestra · Rotta Giusta», e i testi — li toglie
     l'interfaccia. «Una palestra onesta e sicura», l'impegno in testa a
     `docs/filosofia.md`, è rimasta: è una parola dell'impegno e non il nome
     di una pagina, e toglierla è dell'autore.
  8. **Cerca un quesito per numero** del decreto, in Allenati → Quiz.
     *Contratto del motore da P-71:* `cercaNumero()`, §4.2, R-NUM-01 e 02.
  9. **Chi non ha l'account non perde le risposte passando fra le sezioni, né
     aprendo un link** — privacy, condizioni, donazione, registrazione —: dopo
     il primo caricamento il sito resta un documento solo, e un controllo
     guarda **i tragitti**, non solo le porte. Oggi la Home e l'app sono due
     documenti, e passare dall'una all'altra ricarica la pagina: la decisione 5
     non esce senza questa. *Cambierà:* R-NAV-01, che oggi chiede soltanto una
     porta per vista.

  ~~I nomi delle voci si provano con persone prima di chiudersi del tutto
  (decisione 33; `docs/prossime-sessioni.md` §4, «Dopo P-59», punto 4).~~
  **Deciso il 14 ottobre 2026, dall'autore:** la prova con le persone non si
  fa prima del ridisegno, perché le persone non ci sono; i nomi si chiudono
  **provvisori**, sui nomi approvati e sui 300 giri dei bot di P-70 — «Home ·
  Allenati · Esame · Progressi», «Simula il quiz base», «Allenati con 10
  domande», «Accedi», e **senza** il richiamo «Quiz · Carteggio · Segnali»
  accanto alla porta Allenati, l'unico punto con un segnale, contro —, e si
  provano con le persone dopo il rilascio, sul sito vero, con chi lo usa. Il
  prezzo è scritto nel §4 della coda, punto 4: i nomi entrano nel codice senza
  che una persona li abbia letti, come la barra del 9 settembre; stavolta è
  detto, e si prova dopo.

  **Q-DUE punto 3, riaperto: cinque stati per quesito** (decisione 14; I-06,
  la issue #1). *Mai visto*; *debole* — l'ultima risposta è sbagliata;
  *sistemato* — dopo l'ultimo errore, due risposte giuste ad almeno 12 ore
  l'una dall'altra, mantenuto dalle giuste successive e riaperto da un errore;
  *ok* — nessun errore, e due giuste ad almeno 12 ore; *incerto* — il resto del
  visto. Sono disgiunti e sommano al totale. Le 12 ore sono una scelta pratica,
  da rivedere con i dati. «Rifai N errori» apre i deboli, cioè la lista di oggi
  (`soloDaRifare`). Le parole sulla barra sono quelle di Q-STATI, chiusa il 13
  ottobre 2026 (sotto).
  *Cambierà:* il §4.1, `classifica()` con i suoi chiamanti, `quadro()` e
  `dovePesa()`, R-ARCH-02, R-MAPPA-01…13. *Contratto del motore da P-71:*
  `statoQuesito()` e `contaStati()` accanto a `classifica()`, che non cambia;
  lo specchio con `gp` e `gu` (§3.3, §4.1), R-STATI-01…06.

  **Le altre** — quelle dell'ADR-006 sono là:
  - **10. Le viste che vivono di uno storico sono dei registrati**: Progressi
    con la mappa e gli stati nel tempo, la stima, il Percorso. È la condizione
    3 dell'ADR-004, applicata. (I-03)
  - **13. L'onboarding chiede la data d'esame e «che cosa stai preparando?»** —
    solo motore o anche vela, prima patente o estensione dalla entro 12 —,
    tutte e due facoltative e modificabili, anche prima dell'account: senza
    account valgono per la pagina aperta, e nel browser non restano (R-ACC-09).
    Niente età, niente livello. Sostituisce «soltanto la data d'esame» di
    Q-ONBOARD. (I-04, C-01) *Cambierà:* R-ACC-55.
  - **15. Due tag, «Non lo sapevo» e «Svista»**, facoltativi; i `L` e i `C` di
    prima restano nelle righe e si mostrano come classificazione precedente,
    senza riconvertirli. (I-07) *Cambierà:* la riga dei tag nel §5.4; e
    `validaRiga()` oggi accetta soltanto N, L e C (R-ARCH-14): come si scrive il
    tag nuovo lo dicono i contratti del motore. *Contratto da P-71:* `N` e `S`,
    con `L` e `C` validi per sempre (§3.2, R-TAG-01 e 02).
  - **16. Il Percorso è una mappa con il «sei qui»**, ricalcolata dalle risposte
    e mai salvata (R-ARCH-01 resta), con fasi che orientano e non chiudono
    porte, una quota minima di esplorazione, e controlli proposti dal motore
    quando è il momento. Sostituisce «il sito non consiglia un piano di studio»
    di Q-ONBOARD; i limiti del §4.6 restano — il motore non ha il programma
    d'esame (Q-PROG) e non sa che cosa studi altrove —, e le fasi si reggono su
    quello che sa. (I-05)
  - **17. Il tempo al giorno si suggerisce, non si chiede**: minuti di
    esercizio, come intervallo, con la fonte; mai «ti bastano N minuti per
    essere pronto». Sotto le soglie del ritmo non si suggerisce niente:
    R-TEMPO-01 e R-TEMPO-03 restano. (I-04)
  - **18. La prima simulazione fa da test d'ingresso**; il dettaglio viene a
    blocchi di 10 domande, che esplorano le parti poco osservate. (I-14)
    *Cambierà forse:* «Un giro tra gli argomenti» nel §5.3, che oggi è un
    blocco solo, e con lui R-SEL-06 e R-SEL-11.
  - **20. I segnalibri**: una riga per gesto, vale l'ultimo, come i tag
    (`tagPerTentativo()`). È un tipo di riga nuovo, che `validaRiga()` deve
    conoscere: dei contratti del motore. (I-17) *Contratto da P-71:* `_t: 'b'`,
    `segnalibri()` e `codaSegnalibri()` (§3.2, §4.2, R-SEGNO-01…03).
  - **21. «Ero sicuro / avevo un dubbio»**, facoltativo dopo una risposta
    giusta; da verificare prima di usarlo nella stima. (N-01)
  - **22. La ripresa dopo un'assenza, e «hai concluso quello che ti avevamo
    proposto».** (N-03) Il secondo dice quanto era proposto e quanto ne resta:
    va costruito dalle righe, senza uno stato salvato, oppure tocca il §4.4,
    «non esiste una sessione prospettica». Quale delle due lo dice il contratto
    del motore; se serve uno stato salvato, è una decisione dell'autore.
  - **29. L'effetto delle spiegazioni si misura**: rilascio a scaglioni, in
    ordine casuale fra spiegazioni pronte, anche sul trasferimento ad altri
    quesiti; si registra che la spiegazione è stata mostrata, e quale versione —
    soltanto per chi ha l'account, perché senza non resta niente (ADR-004).
    (I-16)
  - **30. «Segnala un problema»** sotto ogni quesito, con l'indirizzo visibile
    e «copia il riferimento». L'indirizzo è da scegliere — la proposta è
    `segnalazioni@` (`docs/prossime-sessioni.md` §4, «Dopo P-59», punto 2) —, e
    va nell'informativa. (C-03)
  - **31. «Com'è fatto l'esame»**, in Esame: una sintesi comprensibile, con
    l'approfondimento e le citazioni datate. (C-02)
  - **32. Le donazioni sì, dopo il parere** del professionista sulle 14
    domande; il link si apre in una scheda nuova (decisione 9). (I-11)
  - **33. Il collaudo**: giri lunghi automatici, agenti esplorativi con un
    rapporto, e poche persone vere prima del ridisegno completo. Non chiude
    Q-PROVE: le persone e i dispositivi restano dell'autore. (I-09) *Non
    rispettata per metà, deciso dall'autore il 14 ottobre 2026:* i giri degli
    agenti ci sono (P-70, 300 giri sui mock), le persone no, e il ridisegno
    non le aspetta; la prova con le persone passa a dopo il rilascio, sul
    sito vero.
  - **34. Le prestazioni**: prima la misura, su telefono e Safari veri. (I-08)
- **Q-TEMA, Q-ONBOARD e Q-SUITE** (1° ottobre 2026, l'autore, su una proposta
  verificata dalla regia). **Q-TEMA:** il tema scuro è un'opzione futura, non
  un requisito; il tema chiaro si misura da solo (appendice A). **Q-ONBOARD:**
  l'onboarding chiede soltanto la data d'esame, facoltativa (R-ACC-55), e il
  sito non consiglia un piano di studio: un piano dovrebbe reggersi su quello
  che il motore non sa — il programma d'esame (Q-PROG), lo studio fatto altrove,
  quanto tempo hai (R-TEMPO-03). Si riapre se l'uso lo chiede. *Decisa di
  nuovo il 4 ottobre 2026 dalle decisioni 13, 16 e 17 di P-59, qui sotto:
  l'onboarding chiede anche che cosa stai preparando, il Percorso orienta con
  delle fasi, e il tempo al giorno si suggerisce.* **Q-SUITE:** la
  suite dell'interfaccia resta com'è, circa 240 s con Chrome e la porta 8620:
  accorciarla vorrebbe dire aprire il CORS del server a più origini o accorciare
  attese che hanno già dato rossi falsi, cioè pagare in sicurezza o affidabilità
  due minuti. Mentre si lavora si fa girare un gruppo solo; la suite intera
  prima del commit, e un'esecuzione saltata si dice. *Misurato di nuovo il 16
  ottobre 2026 (P-82):* con il gruppo dei tragitti, la pagina di riferimento del
  ridisegno con tutti i gruppi del client e le sue rotture, la suite fa 2.938
  verifiche in 4 min 07 s — erano 2.604 in 4 min 16 s —, perché il lavoro in
  più, circa un quarto, va nelle corsie libere e nelle otto con l'API. Con la
  macchina occupata da un altro programma al 270 % di CPU lo stesso banco ha
  impiegato 1.119 s e i rossi erano attese scadute: il tetto del banco è salito
  da 600 a 1.800 s, e un giro rosso su una macchina carica si rifà a macchina
  scarica prima di cercare un difetto.
- **Le quattro proposte del §8 dell'area 6** (1° ottobre 2026, l'autore): «no,
  per ora». Il dettaglio è nel §8 di `docs/area-6-progetto.md`. Le prove con
  zoom nativo al 200 % e con un lettore di schermo vero (R-RIF-10, 13, 14, 15)
  restano dell'autore, fuori dalla merge di P-25 e dal traguardo.
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
     *Precisato il 4 ottobre 2026 dalla decisione 14 di P-59: una risposta
     giusta toglie un quesito dai deboli, e lo fa «sistemato» soltanto la
     seconda ad almeno 12 ore. La issue #1 si chiude in questo verso.*
  3. **Le parole della barra: «giusti · da rifare · mai visti»**, con il `?`
     «in base all'ultima risposta», e il pulsante «Rifai N errori» con N uguale
     al segmento «da rifare». In schermata non compaiono «aperto», «ripreso»,
     «coperto». Scartato «da ripassare»: nei Quiz «Ripasso degli errori» apre
     tutti gli errori di sempre, e la stessa parola indicherebbe due liste.
     *Riaperto il 4 ottobre 2026 dalla decisione 14 di P-59: gli stati
     diventano cinque, e le parole sono Q-STATI. Fino a quel giorno, e finché
     la barra non cambia, valgono queste.*
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
  di essere trattenuto, ha bisogno di sapere dove è scoperto. *Cambierà con la
  costanza* (ADR-006, decisione 19 di P-59): per chi ha l'account, «giorni di
  attività qui negli ultimi 14» e i quesiti da confermare oggi — senza una
  serie che si spezza, senza badge né notifiche. È una spinta a tornare, e la
  filosofia lo dice. Finché la costanza non c'è, questa riga descrive il sito.
- **Un imbuto dichiarato, e nessun dark pattern.** Il 9 settembre qui c'era
  scritto «nessun dark pattern possibile: non c'è account, non c'è un imbuto».
  Dall'ADR-004 un imbuto c'è — per salvare bisogna registrarsi — e quindi un
  dark pattern è **possibile**: non lo impedisce più l'architettura, lo
  impediscono promesse con il loro controllo. Si prova senza account, tutte le
  attività (R-ACC-04); che non resta niente si dice prima e dopo (R-ACC-02);
  l'invito sta nel riepilogo, con i vantaggi che esistono, e «Continua senza
  account» lo chiude senza chiedere altro (R-ACC-03); le risposte non si tengono
  per nasconderne le misure. Niente da vendere, come prima.
- ~~**Offline-first vero**, verificato misurando **zero byte trasferiti** a
  pagina ricaricata, e non dedotto dalla presenza del service worker.~~ —
  *tolto dall'ADR-005 il 3 ottobre 2026: senza rete il sito non si apre.*
- **Errori con una via d'uscita** e non rimproveri.
- **Progressive disclosure** già applicata: le spiegazioni `?` accanto ai numeri
  derivati, e funzionano al tocco oltre che in hover.

### Le misure del tema chiaro

La tavolozza scura è stata misurata voce per voce nella 0.21.0, con due valori
alzati perché non passavano. **Il tema chiaro l'ha misurato P-45, il 30
settembre 2026**, sulla pagina di `main` di quel giorno: Chrome 154 headless, a
375 × 800 px, 1280, 640 e 320 dove è detto, senza account salvo dove è detto, sui
colori e sui rettangoli che il browser calcola, non sui nomi dei token. Le
misure che il banco ripete a ogni esecuzione sono i requisiti del §9.11; quelle
che il banco non sa fare sono scritte «non fatto», con il requisito che le
aspetta. **Non è una dichiarazione di conformità a WCAG 2.2 AA**: una parte dei
criteri non si è misurata, e quattro misure non passano.

| Criterio | Soglia | Stato al 30 settembre 2026 |
|---|---|---|
| Contrasto testo normale | ≥ 4,5:1 (WCAG AA) | misurato: 33 coppie di colori di testo su fondo nelle sette viste e nel runner, tutte fra 4,56 e 17,77:1, tranne `rgb(96, 120, 135)` su `rgb(243, 246, 246)` — piè di pagina, versione, indicazioni `.hint` del Carteggio — a **4,26:1**, e sull'azzurro `rgb(230, 243, 247)` dei Segnali a **4,09:1**. Lo stesso grigio sul bianco delle schede fa 4,63: passa sulla scheda e non sul fondo della pagina. Il riepilogo e la finestra «Accedi», che R-RIF-11 misura anche, non ne aggiungono altri. Difetto dichiarato, R-RIF-11 |
| Contrasto testo grande | ≥ 3:1 | misurato: il più basso è 9,78:1 |
| Contrasto di elementi non testuali (bordi, stati, fuoco) | ≥ 3:1 | **non fatto**: R-RIF-13, a mano |
| Aree di tocco | ≥ 24 px (AA), ≥ 44 px (progetto) | misurato a 375 px: nessun controllo sotto i 24 px; sotto i 44 i tag N/L/C del runner e del riepilogo, 31 × 29, e il sommario «La banca è del 2022…» di Info, alto 41. Le «58 px» scritte qui il 9 settembre erano del tema scuro. Difetto dichiarato, R-RIF-12 |
| Sbordamento orizzontale a 375 px | 0 | misurato: 0 in ogni vista della prova, nel runner, nel riepilogo, nella finestra «Accedi», e con l'account in Percorso, Progressi, Info e nel pannello. Le due tabelle che dalla 0.3.0 sforavano di 89 px in Progressi non ci sono più (P-23); ora lo tiene R-RIF-09 |
| Reflow senza scorrimento orizzontale | fino a 320 px | misurato e guardato in una schermata: la pagina scorre di **16 px** in ogni vista senza account e di **23** con l'account, perché l'intestazione non ci sta e «Accedi» esce dallo schermo; di **49** in «Che tecnica serve?», dove escono una tessera e la tabella; il toast `#sync` esce di 6 px. Difetto dichiarato, R-RIF-09 |
| Reflow equivalente allo zoom al 200 % | 640 px | misurato: 0 in ogni vista. **Non è lo zoom**: è la larghezza CSS che 1280 px hanno al 200 % |
| Ingrandimento del testo, zoom del browser | fino al 200 % | **non fatto**: R-RIF-10, a mano |
| Fuoco da tastiera visibile ovunque | sì | misurato nel Percorso a 375 px, con i tasti veri: ogni arresto cambia aspetto (un contorno di 3 px), ma «Inizia l'attività», «Scegli un'attività» e la scheda dei Segnali prendono il fuoco **sotto la barra fissa in basso** (WCAG 2.4.11), visto in una schermata. Difetto dichiarato, R-RIF-07. La finestra «Accedi» prende, tiene e restituisce il fuoco (R-RIF-06). Il resto dei percorsi: R-RIF-14 |
| Nessun significato affidato al **solo** colore | sì | **non fatto**: R-RIF-13. Il semaforo ha tre stati e usa anche la parola |
| Lettore di schermo sui percorsi principali | sì | **non fatto**: R-RIF-15. Il browser espone la finestra «Accedi» come dialogo modale con il suo nome, e l'avviso di una scrittura fallita in una regione viva: è quello che un lettore riceve, non quello che dice |

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
- ~~**Il pallino ambra è acceso alla prima apertura**, perché l'offline non è
  ancora pronto.~~ — *risolto togliendo l'offline (ADR-005): il pallino resta
  per una scrittura fallita, e alla prima apertura non c'è niente da segnalare.*

### Il limite di questa appendice

Le misure del tema chiaro sono di un browser, non di una persona: dicono che
cosa il browser disegna e che cosa espone, non che cosa si legge al sole su un
telefono né che cosa un lettore di schermo dice. Nessuna di queste righe è
stata verificata con una persona diversa dall'autore.
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
- **30 settembre 2026 — l'attività intera per carteggio e tecniche (P-33).** D-02
  del §10.1 di `area-4-progetto.md`: `attivitaCarteggio()` e
  `dettaglioCarteggio()`, un contratto a parte che nomina il tipo, perché
  `sessioni()` e `ritmo()` restano dei quiz. §3.2 porta lo schema delle righe
  nuove — `sim_uid` per ogni attività, `proposti`, `pos` — e §4.4 il confine;
  nuovi R-FLU-12…22, coperti, e R-FLU-23, la pagina, scoperto finché non la
  realizza P-21. Trentasette rotture del motore, tutte rosse nel loro test; due
  erano rosse per la ragione sbagliata alla prima stesura — un errore di sintassi
  e un crash — e sono state rifatte come rotture di comportamento.
- **30 settembre 2026 — la bozza del carteggio (P-34).** Il §7.6 dice che cosa
  la bozza promette quando la pagina l'avrà, e che oggi il difetto è dimostrato
  in un browser vero. Nuovo §9.11, R-BOZZA-01…07: quattro sul motore, tre sulla
  pagina, e R-BOZZA-06 è il primo requisito con un **difetto aperto
  dichiarato** — un controllo che resta rosso sulla pagina vera, tenuto acceso
  da una tabella in `docs/eccezioni-interfaccia.md` invece che spento. Il §3.2
  dice che la bozza non è una riga.
- **30 settembre 2026 — i controlli del Carteggio (P-35).** D-04 del §10.1 di
  `area-4-progetto.md`, con il meccanismo di P-06, P-31 e P-44: il raccordo in
  cinque funzioni, scritto in quel §10.1 prima della pagina, e il regime
  riconosciuto da lui. R-SEL-17 e R-FLU-23, lasciati scoperti per la pagina da
  P-32 e P-33, diventano coperti per quello che il banco esegue; nuovi R-FLU-24
  (il riepilogo di carta e tecniche), R-FLU-25 (la riprova che resta dei quiz,
  con un controllo suo), R-FLU-26 (il banco contro sé stesso) e R-UX-07
  (Q-AMBITO). R-UX-03 passa a coperto, **prima dell'avvio**, nel browser: C-01
  cerca la frase nel testo che si vede del Carteggio. §7.3 e §7.6 dicono che la
  lista annunciata è quella che parte e che il lavoro ha la forma della bozza in
  tutti e due gli stati. Trentanove rotture della pagina di riferimento, tutte
  rosse per il loro motivo; una è nata provando il banco contro sé stesso.
- **30 settembre 2026 — la rifinitura trasversale (P-45).** I controlli che il
  §10.1 dell'area 6 chiedeva, nel banco del client e misurando nel browser:
  nuovo §9.11 con R-RIF-01…16, undici coperti e cinque scoperti con la
  procedura della prova manuale; R-A11Y-03 coperto. I due regimi sono quelli
  d'accesso; il passaggio a P-25 non ha un raccordo, e quello che la pagina di
  oggi non rispetta sono sette difetti aperti dichiarati, misurati. L'appendice
  A ha le misure del tema chiaro, e dice «non fatto» dove non si è misurato.
- **30 settembre 2026 — il regime della pagina vera si riconosce (P-51).** Il
  controllo al contrario di R-UX-07 fissava `app.html` nel regime attuale, e ha
  fermato P-21 con la pagina giusta; ora legge il regime della pagina vera, e
  gira anche con due pagine nel progettato al posto della vera. Cercati gli
  altri punti nei banchi dei quiz, del ciclo, della mappa, del Carteggio, del
  client e dell'area 6: nessun altro fissa il regime, e il §9.6 lo dice.
  `RG_PAGINA` fa girare la suite su una copia della palestra.
- **30 settembre 2026 — un regime solo per i quiz (P-12).** Il regime a sei
  ingressi esce dai controlli: R-NAV-04, 05 e 07 dicono quello che la pagina fa,
  e la pagina a sei ingressi di prima di P-05 è rossa, anche per il conteggio
  delle verifiche contro la pagina di riferimento, che resta per le rotture.
  §5.3, §5.4 e §7.2 descrivono le cinque intenzioni e i filtri locali al posto
  di Batteria e del selettore globale; il §2.5 lo dice.
- **30 settembre 2026 — un regime solo per il ciclo (P-37).** Il regime del
  ciclo di prima di P-19 esce dai controlli: il banco gira su ogni pagina, e la
  pagina vera fa almeno le verifiche della pagina di riferimento, gruppo per
  gruppo. La pagina di `4129dfc^1` è rossa, sei rossi dove prima ne aveva zero
  con tre verifiche. R-FLU-01 e 11, §7.5 e il §9.6 dicono quello che la
  pagina fa; R-UX-06 resta scoperto per le frasi, con il motivo di oggi.
- **30 settembre 2026 — l'orologio che non c'è (P-16).** Il collaudo di P-05
  aveva riprodotto trenta righe con `sim_uid` e `ms` ma senza `ts` per cui
  `ritmo()` dava `affidabile: true` e `fonte: 'orologio'`: `sessioni()`
  ripiegava sulla somma dei tempi di risposta quando non poteva misurare da capo
  a coda, e `ritmo()` la prendeva per un orologio. **R-TEMPO-05 era falso su
  quelle righe**, e il suo controllo non lo vedeva perché le sue righe hanno
  tutte la data; **R-TEMPO-07 era vero alla lettera** — `stimaImpegno()`
  dichiarava la fonte di quello che riceveva — ma riceveva un cronometro con il
  nome sbagliato. Ora la `durata` di una sessione senza orologio è `null`, il
  ritmo si misura solo sulle sessioni che l'orologio misura, e la sua soglia
  conta le risposte misurate e non quelle viste: R-TEMPO-05 e 07 tornano veri
  senza cambiare testo, e i nuovi R-TEMPO-09…12 tengono fermo il caso. Il
  `ritmo()` entra nella tabella delle soglie del §4.3, dove mancava.
- **30 settembre 2026 — l'ultimo tag, nel motore (P-17).** Da P-01 ritaggare
  aggiunge una riga e la pagina sceglieva l'ultima con una funzione sua,
  `tagPerTentativo()`, che nessun test esercitava. La regola sta ora nel motore
  con lo stesso nome, e un test tiene la copia della pagina identica sulle
  righe che l'archivio accetta finché la pagina non la ricabla; su quelle rotte
  il motore è più stretto. Entrano R-ARCH-13 e 14, coperti. La funzione è fra
  gli orfani dichiarati fino a P-52, o alla prossima penna su `app.html`.
- **1° ottobre 2026 — un regime solo per il Carteggio (P-50).** Il regime del
  Carteggio di prima di P-21 esce dai controlli: il banco gira su ogni pagina, e
  la pagina vera fa almeno le verifiche della pagina di riferimento, gruppo per
  gruppo. La pagina di `1bb916a^1` è rossa, undici rossi dove prima ne aveva
  zero con otto verifiche. R-SEL-17, R-FLU-23, 24 e 26, R-UX-03 e 07, il §9.6 e
  il §9.11 dicono quello che la pagina fa; il §7.6 e R-BOZZA-06 dicono il
  presente, con la bozza nella pagina su `main` e non ancora nel sito
  pubblicato; il §5.3 e il §3.2 non descrivono più la `componiProva()` e le
  righe di prima come se fossero nella pagina.
- **1° ottobre 2026 — le frasi del riepilogo dei quiz, nel banco (P-53).**
  R-UX-06 passa da scoperto a coperto per quello che il banco vede: il gruppo
  F-01 del banco del client guida la pagina vera senza account, dà una risposta
  giusta e una sbagliata sapendo dalla banca qual è quale, poi una seconda
  attività con una sola risposta giusta, e legge nel testo che si vede del
  riepilogo le tre affermazioni con quei numeri, un elenco chiuso di frasi e di
  uscite, e nessuna parola da voto. La pagina di riferimento del client prende
  i numeri del riepilogo da un raccordo sulle righe dell'attività, come quella
  vera, e porta nove rotture nuove, tutte rosse per il loro motivo, e una
  variante che deve restare verde: otto coppie di quesiti base hanno testo e
  risposte identici e l'esatta diversa, e il banco lì legge l'esito dal
  riscontro invece di darlo per rosso. Il §9.6 non
  mette più i testi del riepilogo fra quelli che nessun controllo legge.
- **1° ottobre 2026 — Q-TEMA, Q-ONBOARD e Q-SUITE chiuse.** Decise
  dall'autore con le quattro proposte del §8 dell'area 6, e scritte dalla regia
  fra le chiuse del §10; le tre righe escono dalla tabella delle aperte.
- **1° ottobre 2026 — l'esclusione dalle statistiche (P-54).** Il punto 8 del
  §15.4 del progetto degli account: un segno sull'account, messo e tolto dal
  titolare, e `server/statistiche.mjs` come posto solo da cui passa ogni
  conteggio. Entrano R-ACC-67…70, coperti; il §2.1 e il §3.7 lo dicono. Due
  cose trovate sul ripristino, che il prompt non nominava: una copia di prima
  avrebbe rimesso nei conteggi chi si era opposto dopo, e il ripristino del
  rilascio di prima non conosce quelle voci. Quarantatré rotture, tutte rosse;
  una era passata verde alla prima stesura, e una era rossa per un errore di
  sintassi invece che per il suo motivo.
- **2 ottobre 2026 — le letture del titolare (P-55).** L'informativa promette
  che ogni lettura di un account è annotata nel registro, e lo strumento non
  c'era: ora è `server/leggi.mjs`, con `leggiAccount()` che legge con le
  funzioni del motore e annota nella stessa transazione. Entrano R-ACC-71…74,
  coperti; il §3.7 lo dice. R-ACC-68 dice anche il file vuoto, che
  `opposizione.mjs` trasformava in un database. Quaranta rotture, tutte rosse;
  una era passata verde alla prima corsa — la lettura che aggiorna «ultimo
  accesso», invisibile nel giorno in cui la data di oggi coincide con quella
  dell'account —, e il test che la prende è stato corretto.
- **2 ottobre 2026 — le condizioni nel modulo di registrazione (P-57).** P-56
  ha messo nel modulo «Crea un account» la frase sulle condizioni per l'account
  e sui 18 anni; il suo controllo è il gruppo C-20 del banco del client, e
  R-ACC-75. Misurandolo è uscito un difetto della pagina vera che nessun
  controllo vedeva, perché il banco preme con `element.click()`: dal riepilogo
  di un'attività il modulo si apre sotto il riepilogo, da P-18. È R-ACC-76, con
  una verifica sua e una riga fra i difetti aperti dichiarati; lo chiude
  `ui/*`. Ventuno rotture — diciotto della pagina di riferimento e tre del
  sito —, tutte rosse per il loro motivo.
- **2 ottobre 2026 — R-ACC-76 senza eccezione (P-58).** L'interfaccia ha
  portato la finestra dell'account sopra runner, revisione e riepiloghi, e ha
  tolto la riga C-20 dai difetti aperti dichiarati: la quinta verifica di C-20
  gira verde sulla pagina vera. I link delle finestre dell'account si aprono
  ora in una scheda nuova; nessun controllo lo tiene, ed è detto fra le cose
  che i controlli non vedono.
- **3 ottobre 2026 — il rilascio degli account, la v0.29.0.** Le frasi che
  dicevano «il sito pubblicato, la v0.28.0, non li ha ancora» — nel §2, §3.2,
  §7.3, §7.5, §7.6, §9.9 e §9.11 — dicono ora il presente: gli account, il
  ciclo dei quiz, il Carteggio con la bozza e la mappa di Progressi sono nel
  sito pubblicato. Dove si legge «fino alla v0.28.1» è l'ultima versione senza
  account, la correzione del 1° ottobre. Il prodotto di riferimento in testa
  è la v0.29.0.
- **3 ottobre 2026 — via l'offline e l'archivio di prima (P-60).** L'autore
  ha deciso di togliere l'offline e il passaggio dell'archivio di prima degli
  account, per semplicità, ed è l'ADR-005, che sostituisce la quarta condizione
  dell'ADR-004 e le sue frasi sull'offline. Il §3.5 diventa «Niente offline»,
  con quello che P-61 cambia nella pagina; il §3.6 dice la versione in due
  posti; il §3.2 dice perché la copia del dispositivo resta. Escono, con i loro
  controlli, i requisiti del guscio, del prefisso della cache, delle figure da
  un rilascio all'altro — due — e dell'autodiagnosi, e la parte offline di
  R-ACC-01;
  entrano R-ARCH-15…18, con C-22 nel banco del client — un difetto aperto
  dichiarato fino a P-61 — e tre test del motore che eseguono il `sw.js` nuovo. Il §2.3 ha una
  quinta perdita, chi aveva risposte nel browser prima degli account e non le
  ha portate, e una sesta, l'offline; il §2.4, il §3.2, il §5.4, il §7.1 e il §7.8 non descrivono più il
  passaggio come presente. R-ACC-05 dice il contrario di prima — la pagina non
  legge e non cancella quell'archivio — con un controllo nuovo, C-21, che è un
  difetto aperto dichiarato finché P-61 non toglie il codice; il requisito
  dell'archivio vero, scoperto e mai eseguito, esce, e il suo numero non si
  riusa;
  R-ARCH-07 dice che cosa resta del nome. C-09 e le sue sette rotture escono;
  sei rotture nuove, tutte rosse ognuna in una verifica sola.
- **4 ottobre 2026 — le decisioni di P-59, formali (P-63).** Le 34 decisioni
  del brainstorming, prese dall'autore il 3 e il 4 ottobre, entrano qui con la
  loro data: Q-NAV chiusa con la struttura delle decisioni 1–9, e con lei
  Q-EXTRA; Q-DUE punto 3 riaperto dai cinque stati, con Q-STATI per le parole;
  le altre fra le chiuse del §10, ognuna con accanto che cosa cambierà. Tre
  domande nuove fra le aperte: Q-STATI, Q-COSTANZA — i Segnali non lasciano una
  data, e la costanza dovrebbe contarli — e Q-STIMA. Quelle che cambiano una
  promessa sono l'ADR-006: il §1 ha la frase sulle spiegazioni, la condizione 2
  del §2.4 è sostituita, il §4.6 e l'appendice A hanno una nota su che cosa
  cambierà. Il §2.5 non dice più che i difetti dichiarati non si possono
  copiare. I nomi «vetrina» e «palestra» escono dal documento, fuori dal
  registro: la pagina iniziale è la Home, `/app` è l'app. Il §5, il §6, il §7 e
  il §9 non sono riscritti, se non per i due nomi: descrivono la pagina che
  c'è, e cambiano con il progetto del ridisegno. Nessun requisito nuovo né
  tolto.
- **4 ottobre 2026 — i contratti per il ridisegno (P-71).** Quattro decisioni
  di P-59 entrano nel motore, accanto a quello che c'è e senza cambiarlo: i
  cinque stati per quesito (14), con lo specchio che porta l'istante della
  prima e dell'ultima giusta della serie (§3.3, §4.1); i tag `N` e `S` con `L`
  e `C` validi per sempre (15); il segnalibro, `_t: 'b'` (20); la ricerca per
  numero del decreto (8), con due difetti della banca misurati e non corretti
  — quattro progressivi illeggibili, undici ripetuti (§4.2). Nuovo §9.12, con
  R-STATI-01…06, R-TAG-01 e 02, R-SEGNO-01…03, R-NUM-01 e 02: dodici coperti e
  uno scoperto, le parole degli stati, che sono Q-STATI. `classifica()` non
  cambia, e un test pretende che i tre stati si ottengano dai cinque.
  Trentotto rotture del motore, tutte rosse nel loro test; due erano passate
  verdi alla prima corsa, e i test che le prendono sono stati scritti dopo.
- **13 ottobre 2026 — «com'è andata» e le previsioni registrate (P-74).** I
  requisiti del §9 di `esito-esame-progetto.md` entrano nel nuovo §9.13 con i
  nomi dei test che P-72 e P-73 hanno scritto — letti in `tests/`, non copiati
  dalla proposta — e con i sette della pagina, che P-74 ha scritto nel banco
  del client: E-01 per l'esito, P-01 per la riga d'avvio. Due regimi, con il
  raccordo di quattro funzioni scritto nel §10.1 del progetto prima del banco,
  e la scadenza alla merge di P-75. Due conti nuovi nel motore, R-PREV-11 e 12:
  le sole risposte fra le righe confermate di un trasferimento e fra quelle non
  salvate di un conflitto, perché la pagina riceve i numeri e non gli uid.
  R-PREV-02 conta anche i cinque stati, i segnalibri e la ricerca per numero di
  P-71. §3.2 dice la riga d'avvio e perché non è uno specchio, §3.7 gli esiti
  sul server, §4.6 che la previsione si registra, §5.4 le due voci che la pagina
  non ha ancora, Q-STIMA che la strada in pagina c'è e resta l'email.
- **13 ottobre 2026 — i progressivi della banca, riletti sul decreto (P-77).**
  I quattro progressivi illeggibili e gli undici ripetuti di P-71 guardati sul
  PDF di `fonte/`, pagina per pagina, a 300 dpi: base-8 era un errore di
  estrazione e porta ora 1.1.1-8, come il decreto; gli altri tre e gli undici
  ripetuti sono del decreto, e restano. §4.2 e R-NUM-02 dicono il nuovo stato,
  e `test_dati.py::test_progressivi` fissa la correzione e i numeri del decreto
  con le loro pagine.
- **14 ottobre 2026 — i nomi chiusi provvisori, senza le persone.** La prova
  dei mock con le persone (P-70) non si è fatta, perché l'autore non le ha;
  ha deciso di chiudere i nomi sui nomi approvati e sui bot, provvisori, e di
  provarli dopo il rilascio del ridisegno sul sito vero. La decisione 33 è
  marcata come non rispettata per metà. Scritto nel §10 accanto a Q-NAV e
  alla decisione 33.
- **15 ottobre 2026 — il ridisegno, prima della pagina (P-80).** Il §5, il
  §6 e il §7 descrivono il ridisegno di P-79 — Home · Allenati · Esame ·
  Progressi, un documento solo su `/`, la porta `/app`, il Profilo, le tre
  porte nuove dei quiz, i cinque stati e Allena in Progressi, l'invito in tre
  posti —, e la pagina di oggi resta nei paragrafi *Nel regime di
  transizione*; il §6.2 dice come il regime si legge dalla pagina, da due
  dichiarazioni insieme, con la scadenza alla merge di P-81. R-NAV-01…07
  riscritti per i due regimi; entrano R-NAV-08 (i tragitti, scoperto fino a
  P-82), R-NAV-09…13 (il regime, `navigazioneSito()`, i cinque raccordi, la
  porta, il banco contro sé stesso), R-MAPPA-18 (i cinque stati e Allena nel
  raccordo della mappa), R-ARCH-19 (`riepilogoPagina()`); R-ACC-03, R-ACC-04,
  R-ACC-55, R-STATI-06, R-ARCH-06 e R-ARCH-09 dicono i due regimi. Il motore
  ha `riepilogoPagina()`, una composizione di `sessioni()` e
  `attivitaCarteggio()` che non legge la riga d'avvio: R-PREV-08 l'ha fermata
  quando la contava, e il contratto lo dice. Il contratto consegnato — le
  firme, i chiamanti, che cosa resta a P-82 e P-83 — è nel §10.1 del
  progetto. Un regime nuovo di pagina, dopo che P-12, P-37, P-47 e P-50
  avevano chiuso quelli delle aree: letto, non fissato, come vuole P-51.
- **13 ottobre 2026 — Q-STATI chiusa, su delega.** Le parole dei cinque stati,
  «mai visti · da rifare · da confermare · recuperati · acquisiti», decise dalla regia
  con il «decidi tu e procedi» dell'autore, scritte fra le chiuse del §10 con le
  ragioni e le scartate; il §4.1 e la nota della decisione 14 le dicono;
  R-STATI-06 le nomina e resta scoperto finché la pagina non le scrive. Sblocca
  P-68, il mock di Progressi.
- **15 ottobre 2026 — le scelte di preparazione sul server (P-83).** R-ACC-78…81
  entrano nel §9.9 con i test di P-83, letti in `tests/`; il §3.7, il §5.4, il
  §7.8 e R-ACC-55 non dicono più che i due campi non ci sono: sono sul server,
  dichiarati da `campi_profilo`, e la pagina li consuma con P-81. Scritti dalla
  regia alla chiusura di P-83, che la specifica non la toccava.
- **16 ottobre 2026 — il banco dei tragitti, prima della pagina (P-82).** Il
  punto E del §10.1 del progetto: il gruppo N-01 in Chrome, la pagina di
  riferimento del client nel regime nuovo e le sue ventisette rotture. R-NAV-08 e
  R-STATI-06 passano da scoperti a coperti; entra R-NAV-14, il gruppo contro sé
  stesso; R-ACC-03 dice i tre posti provati, R-ACC-55 le scelte. Il §6.2 e il
  §9.4 dicono che cosa il banco vede e che cosa resta al collaudo di P-81. Un
  regime solo letto, due pagine: la pagina di oggi passa i suoi controlli e
  per lei il gruppo non si applica.
- **17 ottobre 2026 — una copia intera del sito, per i controlli (P-84).**
  P-81 si è fermato perché `RG_PAGINA` sostituisce il solo canonico, e la porta,
  il manifest e le pagine legali restavano quelli di `site/`. `RG_SITO=<cartella>`
  sostituisce `site/` intera, nelle due suite che leggono il sito e nei banchi;
  il §6.2 e il §9.6 lo dicono accanto a `RG_PAGINA`. Nessun requisito nuovo, e
  nessun controllo nuovo sulla pagina: `test_copia_del_sito` prova il
  meccanismo, non la pagina. Misurato sulla copia della pagina di riferimento
  del client: con `RG_SITO` gli stessi rossi di `RG_PAGINA` meno la porta e
  `N-01:indirizzi`; gli 86 che restano sono quella pagina, che non è un
  canonico intero (CHANGELOG, P-84).
- **17 ottobre 2026 — la barra a link, nei banchi (P-85).** Il §3.3 del
  progetto vuole link con `href` reale, e P-81 ha costruito la barra così;
  `test_voci_barra()` e la statica di `tests/ridisegno.mjs` censivano i soli
  `<button data-v>`, quindi la barra giusta era rossa con «voci:» vuoto e una
  barra di pulsanti verde. Ora il censimento prende link e pulsanti, e nel
  ridisegno pretende quattro link con l'indirizzo canonico della sezione;
  R-NAV-03 e R-NAV-10 lo dicono, e il §6.2. Le due pagine di riferimento del
  ridisegno passano ai link; otto rotture della barra, rosse in Python e in
  Node ognuna per il suo motivo. Nessun requisito nuovo.
- **17 ottobre 2026 — Q-COSTANZA chiusa.** L'autore ha deciso che cosa fa un
  giorno di attività: 10 quesiti distinti fra quiz e tecniche, oppure un
  esercizio di carteggio giudicato, anche negativo; quattordici date, oggi
  compreso; i Segnali fuori, come revisione esplicita della decisione 19. La
  proposta della regia è stata rivista dopo un parere di ChatGPT, che ha tolto
  due giustificazioni più forti delle prove — i 23 secondi a domanda di una
  persona sola, e l'osservazione al giorno del modello come misura di un giorno
  di studio. La riga esce dalle aperte e va fra le chiuse del §10; l'ADR-006 §3
  ha la nota sui Segnali. Nessun requisito nuovo: li scrive P-76 con il
  contratto.
- **18 ottobre 2026 — le raccolte nuove spente sul server (P-86).** La
  decisione dell'autore del 17 ottobre: gli esiti, la riga d'avvio con la
  previsione e le scelte di preparazione si raccolgono solo dopo la loro
  informativa. Il §3.2, il §3.7, R-ACC-55 e il §9.13 lo dicono; entrano
  R-ACC-82…86 nel §9.9, quattro sul server e uno sulla pagina vera, con un
  interruttore nel codice che un tag porta con sé. Il segnalibro e il tag
  «Svista» restano accesi, e la loro copertura nell'informativa è nel §20 di
  `account-progetto.md`, per l'autore.
- **18 ottobre 2026 — il banco accende le raccolte per parte (P-88).** Il terzo
  punto del fermo di P-81 (§10.1 di `ridisegno-progetto.md`): il banco del
  client decideva le raccolte dalla pagina, e la pagina vera del ridisegno non
  poteva passare N-01:scelte prima del rilascio che le accende sul server vero.
  Ora ogni gruppo comincia dal codice, e la parte che prova una raccolta la
  accende, o la spegne davvero, sul server della sua corsia. R-ACC-55,
  R-ACC-86 e il §9.13 lo dicono; nessun requisito nuovo.
- **20 ottobre 2026 — il regime è uno (P-89).** P-81 è fuso (`ebe2e47`), e il
  regime di transizione di P-80 è scaduto: il §5, il §6 e il §7 perdono i
  paragrafi *Nel regime di transizione*, il §6.2 dice che il regime è uno, e i
  requisiti che dicevano due regimi — R-ARCH-06 e 09, R-NAV-01, 03, 04, 06, 08,
  09, 12 e 14, R-ACC-03, 04 e 55, R-MAPPA-18 — dicono il solo ridisegno. Dai
  controlli esce il ramo che teneva verde la pagina di prima, misurato prima di
  toglierlo: il sito di v0.31.0 passava 3.002 verifiche su 3.015, e ora è rosso
  con il motivo, in tutte e due le suite, a ogni esecuzione. La pagina di
  riferimento del client di prima esce, e le sue rotture passano a quella del
  ridisegno. Entrano R-ARCH-20 e R-SEGNO-04, i due conti che P-81 ha trovato e
  corretto nella sua copia — una risposta senza account applicata due volte allo
  specchio, un segnalibro contato fra le risposte da inviare —, con il loro
  controllo sulla pagina vera e una rottura ciascuno.

- **20 ottobre 2026 — il rilascio del ridisegno, la v0.32.0.** Il sito
  pubblicato è quello che il §5, il §6 e il §7 descrivono, e il server accende
  le scelte di preparazione nello stesso tag della privacy che le nomina:
  R-ACC-82 dice che il codice del rilascio accende le sole scelte, e il suo
  test lo tiene fermo; esiti e previsioni restano spenti fino a P-75. Le frasi
  che dicevano «fino al rilascio» dicono il presente.

- **21 ottobre 2026 — R-RIF-17, il pulsante per proseguire (T-10).** Dalla
  regola D-29 delle regole di disegno (I-27): un gruppo nuovo del banco del
  client, T-10, misura nel runner dei quiz se «Avanti» si vede o si raggiunge
  scorrendo con il dito. Sulla pagina vera è rosso nei quattro casi, anche dopo
  una risposta giusta a 375×812 — misurato e guardato sul sito pubblicato: la
  domanda a 22 px, «Vedi il riepilogo» a 804–856 px su 812 —, ed è un difetto
  aperto dichiarato finché P-91 non lo chiude. La pagina di riferimento del
  client mostra ora «Vedi il riepilogo» anche dopo l'ultima domanda, come la
  pagina vera.

- **23 ottobre 2026 — R-RIF-18, la figura prima di rispondere (T-11).** Dalle
  regole D-01, D-02 e D-14 (I-27): un gruppo nuovo del banco del client, T-11,
  misura nel runner dei quiz, a 375×812 e prima di rispondere, se la figura si
  vede intera nel primo schermo, con l'inizio della domanda e della prima
  risposta. Sulla pagina vera è rosso: con base-828 la figura sta a 448–724 px
  e `.qbody` si taglia a 415; con base-829 l'area di `.qbody` va da 193 a 226
  px, e non si vede nemmeno l'inizio della domanda. È un difetto aperto
  dichiarato finché P-91 non lo chiude. La pagina di riferimento del client
  mostra ora la figura del quesito, fra la domanda e le risposte.

- **23 ottobre 2026 — il runner dei quiz scorre (P-91).** La merge di P-91
  chiude i difetti di R-RIF-17 e R-RIF-18: scorre l'intero runner, la figura
  viene prima dei gesti di servizio, un quesito nuovo comincia dall'inizio. Le
  cinque righe T-10 e T-11 escono dai difetti aperti dichiarati nello stesso
  commit della pagina, e il §7.5 dice il runner com'è.

- **24 ottobre 2026 — le regole di disegno, giro 1, nel banco (P-92).** Le
  decisioni A e B dell'autore — l'avviso «senza account» accanto a «Inizia»,
  Esame che apre sulle prove — diventano T-12 nel banco del client, prima della
  pagina: entrano R-RIF-19…22, e R-ACC-02 e R-RIF-08 cercano l'avviso nella
  preparazione e non più nella Home, con il testo del requisito com'era. Sulla
  pagina vera T-12 è rosso in undici verifiche, dichiarate, e verde in quella
  della principale; le chiude P-93.

- **24 ottobre 2026 — l'avviso accanto a «Inizia», Esame sulle prove (P-93).**
  La merge di P-93 chiude le undici verifiche di T-12 sulla pagina vera:
  l'avviso «senza account» esce dalla Home, dal segmento Carteggio e dalla
  testa dei Segnali e di «Che tecnica serve?», e sta accanto a «Inizia» in ogni
  preparazione; Esame apre su «Le prove», con il modulo in un `details` chiuso;
  le azioni principali stanno nel primo schermo e portano `data-ruolo`. Le righe
  `T-12:*` escono dai difetti aperti dichiarati nello stesso commit della
  pagina, e R-RIF-20…22 non dicono più «difetto aperto».

- **24 ottobre 2026 — la scala nella pagina (P-95).** Prima della pagina il
  controllo: `T-13:distanze` confrontava anche la barra fissa con la porta che
  le passa sotto, e da quel giorno confronta i bersagli solo nello stesso
  strato e, con un dialogo aperto, solo nel dialogo (R-RIF-28). Poi la merge di
  P-95 chiude le quattordici verifiche della scala sulla pagina vera — dieci
  di T-13 e quattro di `test_scala_css` —: un solo `:root`, corpi, spazi e pesi
  dalla scala, titoli di sezione a 24 px, risposte a 16, testo a 480 px. Le
  righe escono dai difetti aperti dichiarati nello stesso commit della pagina,
  e R-RIF-23…30 non dicono più «difetto aperto». I 480 px li approva l'autore
  sulle schermate del collaudo.

- **25 ottobre 2026 — il volto, giro A, i controlli (P-97).** La Home al
  computer «U — Terra beige» e i colori della Regata entrano nei controlli
  prima della pagina, con le decisioni 1–14 di `docs/volto-progetto.md`: la
  scala della Regata in R-RIF-23…27 e i suoi colori in R-RIF-30; D-14 riscritta
  in R-RIF-19; T-12 anche al computer in R-RIF-20…22, con l'avviso cercato per
  significato; e R-VOLTO-01…11, il gruppo T-15 nuovo, con il contrasto sopra la
  carta letto sui pixel. Sulla pagina vera sono difetti aperti dichiarati,
  una riga per verifica: li toglie P-98.

- **28 ottobre 2026 — il volto, giro A, la pagina (P-98).** La merge di P-98
  porta nella pagina il `:root` della Regata, le icone nella barra e la Home al
  computer «U — Terra beige», con la carta, il faro, la boa e i numeri dalla
  banca; le quattordici righe dichiarate da P-97 escono nello stesso commit
  della pagina. R-RIF-22, 23 e 30 e R-VOLTO-01…04 e 06…10 non dicono più
  «difetto aperto». Prima, P-99 ha adattato il banco a Chrome 156. Suite su
  `main` dopo le due merge: interfaccia 4.866, cioè le 4.892 di P-97 meno le
  ventisei verifiche delle dichiarazioni — due per ognuna delle dodici `T-*`
  (il riferimento verde, la rottura rossa) e una per ognuna delle due della
  scala statica —; nessun controllo in meno. Le schermate e i testi delle due
  luci li approva l'autore.
