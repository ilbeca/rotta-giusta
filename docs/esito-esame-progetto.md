# «Com'è andata» e le previsioni registrate — il progetto

**Sessione P-64, progetto del 4 ottobre 2026, da realizzare.** Consegna sul
modello dei progetti delle [aree](area-5-progetto.md): che cosa si chiede, con
quali parole, dove sta il dato, i contratti, il guasto muto, l'informativa, e
nel §10.1 le dipendenze abbastanza precise da diventare prompt. Questa sessione
scrive soltanto questo documento e il CHANGELOG: non tocca `site/`, `server/`,
`tests/`, la specifica né la coda.

Due raccolte di dati, e una ragione sola per farle **adesso**: la stima d'esame
(riga 23 della coda) si può dire tarata solo confrontandola con quello che è
successo dopo, e quello che succede dopo arriva mesi dopo le risposte. Un
esame si sostiene settimane o mesi dopo la registrazione; una previsione
registrata oggi serve il giorno in cui c'è un modello da giudicare. **Nessuna
delle due raccolte aspetta il modello**: tutte e due hanno un uso il primo
giorno, con la regola semplice del §4.5.

---

## 1. Fonti, precedenze e perimetro

- [`docs/idee-dopo-gli-account.md`](idee-dopo-gli-account.md): la scheda I-12,
  il secondo parere di ChatGPT alla riga I-12 (evento, osservazione al giorno,
  previsione registrata **prima**, soglie decise prima, versione e data,
  «calcolare senza mostrare»), N-05 («conservare l'evidenza») e le **decisioni
  23–27**.
- [ADR-006](adr/ADR-006-l-invito-in-home-il-sito-che-spiega-la-costanza-e-la-stima.md),
  §4 della decisione e «Che cosa costa — La stima», punti 1 e 3: la previsione è
  «un dato nuovo per ogni registrato, che lui non vede», e va nell'informativa
  prima della prima registrata; «com'è andata» è «un dato in più, facoltativo,
  dichiarato da chi studia e non verificabile», e la strada per chiederlo è di
  questo progetto.
- [`docs/account-progetto.md`](account-progetto.md) §3 (le tabelle, e «nessun
  sacco di impostazioni in JSON»), §7 (l'API), §2.7 (lo schema cambia solo per
  aggiunte, il file delle cancellazioni, il rilascio di prima sul database di
  dopo), §13 (profilo), §14 (cancellazione), §15 (il titolare che legge, le
  statistiche, il registro), §20.
- [`site/privacy.html`](../site/privacy.html), come pubblicata dalla v0.29.0, e
  [`server/statistiche.mjs`](../server/statistiche.mjs): le tre fonti filtrate e
  il rifiuto delle tabelle vere.
- [Specifica](specifica.md) §2.4 (la data d'esame facoltativa), §3.2 (le righe),
  §3.3 (lo specchio non si salva), §4.5 (il carteggio non si corregge da solo),
  §4.6 (che cosa il motore non sa), Q-STIMA e Q-COSTANZA nel §10.
- [`docs/ricerca-programma-esame.md`](ricerca-programma-esame.md) §4: scritta e
  pratica in **due giornate diverse con due commissioni** (DM 323/2021 art. 3
  c. 1); l'ordine dei test della scritta (art. 6 c. 2); il carteggio
  «propedeutico alla prosecuzione» (art. 6 c. 7); chi ha la entro 12 miglia non
  rifà il quiz base; si ripete **una volta** la sola prova non superata, dopo
  almeno trenta giorni (art. 3 c. 2).

**Precedenza.** Le decisioni 23–27 e l'ADR-006 sono decise; qui c'è il *come*.
Dove questo documento propone una scelta che una di loro non fa, lo dice, e la
scelta finisce nel §11.

**Entra:** la domanda «com'è andata» e il suo dato; la riga che registra
l'avvio di ogni simulazione completa con le previsioni; la regola semplice;
l'informativa; lo schema, le rotte, le statistiche, i controlli; l'ordine di
rilascio. **Non entra:** il modello (gerarchico, la difficoltà dagli altri, gli
studenti finti), le soglie di pubblicazione, come la stima si mostra — sono la
riga 23 e Q-STIMA. E nessuna email: chiedere «com'è andata» per posta è un uso
dell'email che `docs/filosofia.md` non nomina, e resta all'autore (§11).

---

## 2. Tre misure, prima di scegliere

Fatte il 4 ottobre 2026 sul codice di `main`, che per `server/` e
`site/engine.js` è identico byte per byte al tag `v0.30.0` in esercizio
(`git diff v0.30.0 -- server site/engine.js` vuoto): il server vero, avviato
nello stesso processo su un database temporaneo, come fa la suite.

1. **Un campo sconosciuto nel profilo sparisce con un `200`.** `PUT
   /v1/profilo` con `{ data_esame, esito: {…} }` risponde `200`, scrive la data
   e butta `esito` senza dirlo: `GET /v1/io` non lo ha. È il guasto muto in
   forma pura, e decide il §3.3: un esito che vivesse nel profilo, con il
   server tornato al rilascio di prima (`rg-torna`), si perderebbe a ogni
   salvataggio mentre la pagina dice «salvato».
2. **Un tipo di riga nuovo è rifiutato, e il rifiuto si vede.** `POST
   /v1/righe` con una riga `_t: 'a'` risponde `200` con
   `scartate: [{ uid, motivo: 'tipo sconosciuto' }]`. Non è muto: la pagina,
   letto nel codice e non guidato, scrive «N righe non accolte dal server»
   (`site/app.html:1560`) e **blocca l'uscita e la cancellazione
   dell'account** finché non si scaricano (`site/app.html:1823`). Decide il
   §6: una riga nuova non si scrive finché il server non dice di accettarla.
3. **Una rotta nuova sul server di prima è un `404` che si legge**:
   `{"errore":"sconosciuta","messaggio":"/v1/esito non esiste: …"}`. Una
   tabella e una rotta nuove falliscono rumorosamente con un rilascio
   indietro; un campo in più no.

E una quarta, per il §4.7: **la statistica di validazione gira attraverso
`statistica()`**, sulle fonti filtrate, senza nominare una tabella vera. Su un
database sintetico — quattro righe d'avvio, tre prove consegnate, una
abbandonata, due account; le righe inserite nella tabella a mano, perché il
server di oggi le rifiuterebbe — dà il punteggio di Brier della regola
semplice (0,2448, rifatto a mano) e il numero delle prove abbandonate (1); dopo
`opponi()` sul secondo account il conto scende a due prove (0,3472, rifatto a
mano). Il segno dell'opposizione basta: nessuna riga in più da ricordare.

---

## 3. «Com'è andata»

### 3.1 Che cosa si chiede, e con quali parole

**Una riga per prova sostenuta**: quale prova, in che giorno, com'è andata, e,
se lo si sa, quanti errori. Le prove sono le quattro dell'esame:

| Prova | Si chiede | Il numero, facoltativo |
|---|---|---|
| Carteggio | superata · non superata · non l'ho sostenuta | errori, da 0 a 4 |
| Quiz base | superata · non superata · non l'ho sostenuta | errori, da 0 a 20 |
| Quiz vela | superata · non superata · non l'ho sostenuta | errori, da 0 a 5 |
| Prova pratica | superata · non superata · non l'ho sostenuta | — |

Per prova e non per esame, perché l'esame vero è fatto così: la pratica è in
un altro giorno e con un'altra commissione, si ripete **la sola prova non
superata** dopo trenta giorni, e chi ha la entro 12 miglia non fa il quiz base.
Un «superato sì/no» per l'esame intero mescolerebbe il carteggio, che la stima
non vede (decisione 23), con i quiz, che sono il suo evento.

**Gli errori sono la parte che conta di più per la stima**, e la sola
facoltativa dentro una risposta facoltativa. La previsione è una probabilità di
stare entro 4 errori; un «superata» dice solo da che parte di 4 si è caduti, un
«2 errori» dice dove. Chi non lo sa lascia vuoto, e vuoto non è zero.

**I testi**, per la pagina:

- **Il riquadro** — titolo «Com'è andato l'esame del 3 settembre?»; testo «Se ti
  va, dicci com'è andata, prova per prova. Ci serve a capire se le simulazioni
  di questo sito somigliano all'esame vero. È facoltativo, e puoi cambiarlo o
  toglierlo quando vuoi.»; tre pulsanti, «Rispondi», «Non l'ho ancora fatto»,
  «Non chiedermelo più».
- **Il modulo** — titolo «Il tuo esame». Campo «Giorno della prova scritta»,
  con la data d'esame già scritta e modificabile. Per carteggio, quiz base e
  quiz vela le tre scelte e «Errori, se lo sai». Sotto i quiz, una riga:
  «Se dopo il carteggio non hai proseguito con i quiz, segnali come non
  sostenuti.» — la parola del decreto è «propedeutica alla prosecuzione», non
  «eliminatoria» (`ricerca-programma-esame.md` §4.3), e la riga non spiega la
  regola: dice che cosa segnare. Per la pratica le tre scelte e un suo
  «Giorno della pratica», vuoto: «La pratica è in un altro giorno. Se non l'hai
  ancora fatta, lascia vuoto: puoi aggiungerla dopo, da Profilo.» In fondo:
  «Una prova lasciata vuota non la registriamo.» Pulsanti «Salva» e
  «Annulla».
- **Dopo il salvataggio** — «Salvato. Lo usiamo soltanto in conteggi
  aggregati.» Se una prova è «non superata», sotto: «Se la ripeti, metti la
  nuova data: dopo ti chiediamo di nuovo com'è andata.» con «Metti la nuova
  data». Niente consolazione, niente festa, niente confronto: è un'informazione,
  non un traguardo.
- **Un errore** — «Non l'abbiamo salvato: il server non risponde. Riprova fra
  poco; finché non lo vedi qui sotto, non è salvato.» Con la rete assente lo
  stesso testo; con un `401`, quello del client per la sessione scaduta; con un
  `404` — il server di prima, §2 punto 3 — «Questa funzione non è ancora
  disponibile» e il modulo si chiude senza perdere niente.

**Quali prove si mostrano.** Quando ci sarà l'obiettivo (decisione 13, «che
cosa stai preparando?»): chi prepara il solo motore non vede il quiz vela, chi
estende dalla entro 12 miglia non vede il quiz base. Finché non c'è, tutte e
quattro, nessuna scelta preselezionata.

**Che cosa non si chiede, e perché.** Né la scuola, né la città, né la
capitaneria: aiuterebbero a capire le differenze fra commissioni, e
renderebbero riconoscibile una persona dentro un conteggio piccolo. Né «era la
prima volta?»: si ricava dalle righe, una per giorno. Né un voto al sito.

### 3.2 Quando, e a chi

**Solo con l'account.** Senza account non resta niente (ADR-004), e un esito
detto senza account sparirebbe alla ricarica: la domanda non c'è.

**Il riquadro compare** quando valgono tutte e tre:

1. l'account ha una data d'esame, e oggi — il giorno locale della pagina,
   `E.isoLocale().slice(0, 10)` — è **quella data o dopo**: lo scritto si sa la
   sera stessa;
2. sono passati **al più 90 giorni** da quella data: dopo, chi non ha risposto
   non risponderà, e chiederlo diventa rumore (§11, il numero è dell'autore);
3. l'account non ha nessuna riga d'esito con un giorno **da trenta giorni prima
   della data in poi**. Non «con quel giorno esatto»: chi aveva scritto il 3 e
   l'ha fatto il 5 ha risposto, e non va richiesto.

**Dove**: in un posto solo, il cruscotto — oggi il Percorso (`v-oggi`), dopo il
ridisegno la Home con l'account (decisione 5). Mai durante un'attività, mai una
finestra modale, mai in un riepilogo: il riepilogo è il posto dell'invito a
registrarsi, e chi ha l'account non lo vede, ma due richieste nello stesso
posto si confonderebbero. **Sempre**, in Profilo — oggi la finestra Account —,
la voce «Il tuo esame», da cui si dice un esito anche senza data, anche fuori
dai 90 giorni, anche per una prova ripetuta.

**I tre pulsanti.** «Rispondi» apre il modulo. «Non l'ho ancora fatto» apre il
campo della data: «Quando lo fai? La data serve a dirti quanto resta e a
chiederti, dopo, com'è andata.», con «Salva la data» e «Togli la data»; la data
nuova passa da `PUT /v1/profilo`, come oggi. «Non chiedermelo più» scrive per
quel giorno una riga «non detto» (§3.3) e il riquadro sparisce, su tutti i
dispositivi.

**Chi non ha messo una data** non vede il riquadro: la voce in Profilo c'è.
**Chi la sposta in avanti** prima del giorno non vede niente: la domanda segue
la data. **Chi la sposta dopo il giorno, senza rispondere**, perde la domanda
per la data vecchia, ed è voluto: la voce in Profilo resta per dirlo. **Chi
mette una data passata** (R-ACC-55 lo permette) vede il riquadro subito, se è
nei 90 giorni.

**Il prezzo, dichiarato: risponderà soprattutto chi torna sul sito dopo
l'esame**, e chi è passato ha meno motivi di tornare di chi deve ripetere — o
più motivi di dirlo: non si sa in che verso. Il campione non è casuale, e nessun
uso del dato lo può trattare come tale (§3.7). L'email lo allargherebbe, ed è
una decisione dell'autore (§11).

### 3.3 Dove sta il dato

Tre posti possibili, e le misure del §2 scelgono.

| | Nel profilo, colonne dell'account | Una riga dell'archivio | **Una tabella sua** |
|---|---|---|---|
| Più esami, prove ripetute, la pratica in un altro giorno | no: una colonna per prova tiene un esame solo | sì | sì |
| Con il server di prima | **perso in silenzio**, misurato (§2.1) | rifiutato, visibile, e blocca l'uscita (§2.2) | `404` che si legge (§2.3) |
| Togliere davvero | sì | **no**: le righe non si modificano; un ritiro è una riga in più, e quella di prima resta in chiaro sul server e nelle copie dei dispositivi | sì, `DELETE` con `secure_delete` e il WAL svuotato |
| Un azzeramento dei progressi | resta | **se ne va con le risposte** | resta |
| Le statistiche, senza chi si oppone | dalla fonte `iscritti` | dalla fonte `risposte` | una fonte nuova, `esiti` |

**Proposto: una tabella sua, `esito`, con lo schema 5**, una migrazione
additiva come le quattro di prima. La riga dell'archivio è la forma giusta per
le risposte, che non si ritirano; un esito d'esame detto da chi studia si deve
poter togliere, e togliere vuol dire che non c'è più (art. 17, e la promessa
«una cancellazione che deve cancellare davvero» dell'ADR-003).

```sql
esito (
  account_id   INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  giorno       TEXT NOT NULL,      -- AAAA-MM-GG, il giorno della prova, detto da chi studia
  prova        TEXT NOT NULL,      -- 'carteggio' | 'base' | 'vela' | 'pratica'
  esito        TEXT NOT NULL,      -- 'superata' | 'non_superata' | 'non_sostenuta' | 'non_detto'
  errori       INTEGER,            -- facoltativo: 0..4 carteggio, 0..20 base, 0..5 vela; NULL per la pratica
  detto_il     TEXT NOT NULL,      -- la prima volta, UTC
  cambiato_il  TEXT NOT NULL,      -- l'ultima, UTC
  PRIMARY KEY (account_id, giorno, prova)
) WITHOUT ROWID
```

Colonne e non un JSON, per la regola del §3 di `account-progetto.md`: ogni
valore ha la sua validazione. `non_detto` è la risposta «Non chiedermelo più»:
tre righe, una per prova della scritta, per quel giorno. Tiene il riquadro
spento su ogni dispositivo senza una colonna di profilo, che il server di prima
butterebbe (§2.1), e si toglie come le altre.

**Le rotte** (§7.1 di `account-progetto.md`, da aggiungere):

| Rotta | Che cosa | Risposte |
|---|---|---|
| `PUT /v1/esito` `{ giorno, prove: { carteggio?, base?, vela?, pratica? } }`, ogni prova `{ esito, errori? }` o `null` | scrive le prove nominate per quel giorno; una prova assente resta com'è, `null` la toglie | `200 { esiti }`; `422` con il campo che non va, e niente scritto; `409` oltre 20 giorni per account |
| `DELETE /v1/esito` `{ giorno }` | toglie tutte le prove di quel giorno | `200 { esiti }` |
| `GET /v1/io` | porta anche `esiti`, l'elenco intero, ordinato per giorno e prova | — |
| `GET /v1/esporta` | il file porta anche `esiti` | — |

Le regole di `PUT`, scritte qui perché la pagina non ne inventi altre: un
giorno è una data vera, **non nel futuro** — oltre il giorno UTC del server più
uno, per i fusi —; `errori` è un intero nel suo intervallo, oppure assente;
`superata` con più errori di quelli ammessi — 1 nel carteggio, che si supera con
tre su quattro; 4 nel quiz base; 1 nella vela — è un `422`, perché i due campi si
contraddicono; `non_detto` non porta errori.
Tutto si controlla prima di scrivere, come nel profilo. **Senza password**: si
scrive e si toglie una cosa detta da sé, come la data d'esame.

**Il registro di sicurezza non lo annota.** Non è un evento di sicurezza, e il
registro vive un anno oltre l'account.

### 3.4 Come si corregge e come si cancella

- **Si corregge** rifacendo il modulo dallo stesso giorno: `PUT` sostituisce le
  prove nominate, `cambiato_il` si aggiorna. Si cambia anche il giorno: la
  pagina toglie il giorno vecchio e scrive il nuovo, in due richieste; se la
  seconda fallisce lo dice, e in Profilo si vede che cosa c'è.
- **Si toglie** da Profilo, per giorno: «Togli l'esito dell'esame del 3
  settembre? Lo cancelliamo dal server; dalle copie di sicurezza sparisce entro
  30 giorni.» con «Togli» e «Annulla». Il server cancella con `secure_delete`
  e svuota il WAL (`account-progetto.md` §14.4), come una cancellazione
  d'account.
- **Un ripristino non lo riporta.** Una copia di prima del ritiro ha ancora la
  riga: è la trappola del §2.7, e ha la stessa cura. Il ritiro si scrive
  **prima** anche nel file delle cancellazioni — numero dell'account, chiave
  casuale, giorno, quando; nessun valore dell'esito —, il ripristino lo rilegge
  e ricancella le righe di quel giorno con `cambiato_il` precedente; e il
  server, a ogni avvio, lo rilegge anche lui, come fa con le opposizioni,
  perché il `ripristina.mjs` del rilascio di prima conterebbe quella voce fra le
  illeggibili e non la applicherebbe (§15.2 di `account-progetto.md`, misurato
  per le opposizioni).
- **Un esito scritto o corretto dopo la copia si perde con un ripristino**, e
  si dice: non passa dalla coda, quindi l'epoca non lo fa tornare. Un esito
  nuovo si ripara da sé — il riquadro ricompare, se è nei 90 giorni —; una
  correzione no, e in Profilo si vede il valore di prima. La finestra è di
  dodici ore al più; le copie sono due al giorno.
- **Un azzeramento dei progressi non lo tocca** (proposto, §11): azzerare è
  ricominciare a studiare, l'esame resta sostenuto. La conferma lo dice: «Le
  risposte si cancellano su tutti i dispositivi. L'esito dell'esame, se ce l'hai
  detto, resta: lo togli da Profilo.»
- **La cancellazione dell'account lo porta via** con tutto il resto: la chiave
  esterna con `ON DELETE CASCADE` e `PRAGMA foreign_keys = ON`
  (`server/db.mjs:134`) fanno sì che anche il codice di prima, che non sa della
  tabella, lo cancelli cancellando l'account. Va provato, non dedotto (§9,
  R-ESITO-06), e il controllo dei byte di R-ACC-19 lo cerca anche lì.
- **L'export lo porta; l'import non lo carica.** Il file dei progressi ha
  `esiti` accanto a `righe` e `segPunti`: è l'accesso e la portabilità. Un file
  si ricarica in qualunque account, anche di un'altra persona, e un esito è una
  dichiarazione del titolare dell'account, non una risposta: è la stessa ragione
  per cui il segno dell'opposizione non viaggia (§15.2, scelta 1). L'anteprima
  dell'import lo dice: «Il file contiene l'esito di un esame: non lo
  importiamo. Se è tuo, dillo di nuovo da Profilo.» `importa()` oggi salta un
  campo che non conosce, e R-ACC-18 deve restare verde con `esiti` nel file.

### 3.5 Che cosa ne vede chi studia

**Il suo, e niente altro.** In Profilo, «Il tuo esame»: una riga per giorno —
«3 settembre 2026 · carteggio superata · quiz base superata, 2 errori · quiz
vela non sostenuta» —, con «Modifica» e «Togli»; un giorno «non detto» si legge
«3 settembre 2026 · non ce l'hai detto», con «Rispondi».

**Mai** accanto a una previsione o a una simulazione: nessun «il sito ti aveva
dato 71 su 100», nessun confronto con gli altri, nessuna media. La stima non si
mostra (decisione 25), e un esito messo accanto alle prove fatte è già un
confronto. Il titolare lo legge con `server/leggi.mjs`, quando chi studia
chiede aiuto (§15.1): lo strumento lo mostra con il resto dell'account.

### 3.6 Le statistiche

**Una quarta fonte in `server/statistiche.mjs`**, filtrata come le altre dagli
`iscritti`:

```sql
esiti AS (
  SELECT e.account_id AS chi, e.giorno, e.prova, e.esito, e.errori, e.detto_il
  FROM esito e JOIN iscritti i ON i.chi = e.account_id
)
```

`FONTI` ne prende le colonne, `TABELLE` impara la parola `esito` — una
statistica che la nomina è rifiutata —, e il controllo statico di R-ACC-69
diventa rosso anche per una query su `esito` fuori dal posto solo. Chi si è
opposto esce da tutto, esiti compresi, senza una riga nuova da ricordare: il
filtro è quello degli iscritti.

Le prime statistiche che il dato rende possibili, lanciate dal titolare con
`server/statistica.mjs`:

- **quanti rispondono**: gli iscritti con una data d'esame passata da più di
  una settimana, e quanti di loro hanno un esito — è il numero che dice quanto
  vale tutto il resto;
- **la scritta, per prova**: quante superate, quante non superate, quante non
  sostenute, senza i `non_detto`;
- **le simulazioni e l'esame**: fra chi ha detto l'esito del quiz base, la quota
  di simulazioni base superate nei trenta giorni prima, divisa per esito vero.
  È la prima validazione possibile, e non ha bisogno di un modello: dice se le
  simulazioni del sito somigliano all'esame.

**Una soglia anche per il titolare**: con meno di 20 persone in un gruppo, un
conteggio non si scrive fuori dalla macchina — non in un documento del repo,
non in un messaggio —, perché con tre persone che hanno detto «non superata»
un aggregato dice qualcosa di loro. La soglia che la decisione 24 vuole per la
difficoltà dei quesiti vale qui allo stesso modo; il numero è dell'autore
(§11).

### 3.7 Il guasto muto

1. **Un campione che sembra un campione.** Il guasto più probabile e il più
   difficile da vedere: con il 15 % che risponde, e chi è passato più o meno
   propenso a dirlo, una stima «tarata sugli esiti» lo è su chi ha risposto.
   Lo rende visibile la prima statistica del §3.6, scritta accanto a ogni altra:
   nessun risultato sugli esiti si legge senza il tasso di risposta.
2. **Il riquadro che non compare mai**, per una condizione sbagliata — la data
   letta in UTC, `esiti` assente da `/v1/io` preso per «nessun esito», o il
   contrario: preso per «niente da chiedere» quando il server di prima non lo
   manda. **Un campo assente spegne la funzione, non la accende**: la pagina
   mostra il riquadro e la voce di Profilo solo se `GET /v1/io` porta `esiti`,
   anche vuoto. Il controllo lo prova sui due lati (§9).
3. **Un esito ritirato che torna** con un ripristino: il file delle
   cancellazioni, e la rilettura all'avvio (§3.4).
4. **Un esito che resta dopo la cancellazione dell'account**: la chiave
   esterna, e i byte (§3.4).
5. **Un esito che conta chi si è opposto**: la fonte filtrata (§3.6).
6. **«Salvato» senza che il server l'abbia**: la pagina scrive «Salvato» solo
   alla risposta `200`, e mostra l'elenco che la risposta porta, non quello che
   ha mandato.

---

## 4. Le previsioni registrate

### 4.1 L'evento, e quale prova si registra

L'evento previsto è quello della decisione 23: **superare la prossima
simulazione completa del quiz base, senza aiuti**. La vela a parte, con lo
stesso meccanismo. Il carteggio fuori.

**«La prossima» si legge alla lettera: la simulazione che sta per cominciare.**
La previsione si registra a Inizia di una simulazione completa — la
preparazione della simulazione del §6 di `area-2-progetto.md`, e in «Base e
vela» all'inizio di ciascuna fase — e prevede quella prova lì. Il suo esito è
la riga `_t: 's'` che la stessa prova scrive alla consegna, con lo stesso
`sim_uid`. Una prova consegnata con domande senza risposta è «non superata»,
come già scrive la pagina (`passed: e.superata && !senzaRisposta`). **Una prova
abbandonata** — la pagina chiusa prima della consegna — non ha una riga `_t:
's'`: con la riga d'avvio si vede, e si conta a parte. Senza la riga d'avvio
non si vedrebbe mai, e le prove che vanno male sono quelle che si
abbandonano: la validazione avrebbe un campione ripulito proprio dei fallimenti.

**«Senza aiuti»**: dentro la pagina una simulazione è sempre senza aiuti — non
corregge durante la prova (§7.5 della specifica), non mostra note prima della
risposta (gli oscurati, che le portano, non escono). Un manuale aperto accanto
non si vede, e non si chiede: una domanda «l'hai fatta da solo?» dopo una prova
andata male invita una giustificazione, e sporca il dato nel verso peggiore.
Proposto, §11.

**Solo con l'account.** Senza account le righe valgono per la pagina aperta, e
una previsione calcolata su di loro non avrebbe uno storico: non c'è. Una
simulazione fatta senza account e portata nell'account alla registrazione non
ha una riga d'avvio, e resta fuori dalla validazione per costruzione.

### 4.2 Che cosa si salva

Una riga nuova dell'archivio, `_t: 'a'`, «avvio di una prova»:

```js
{
  _t: 'a',
  uid: '<sim_uid>:a',          // deterministico: due Inizia della stessa prova sono una riga
  sim_uid: '<sim_uid>',        // la prova che prevede; la sua riga 's' ha questo uid
  kind: 'base' | 'vela',
  prova: 'base' | 'vela' | 'entrambe',   // la scelta in Quiz → Simula la prova
  ts: '2026-10-04T10:00:00+02:00',       // l'istante di Inizia, isoLocale(), prima della prima risposta
  motore: '0.31.0',            // la versione della banca e del motore caricati, da meta.json
  stime: {                     // una voce per metodo attivo; {} se nessuno ha potuto dire niente
    'regola-semplice-1': { superate: 3, n: 5, prove: ['…', '…', '…', '…', '…'] },
    // quando ci sarà: 'gerarchico-1': { p: 0.71, basso: 0.55, alto: 0.82 }
  },
  errore: 'messaggio'          // solo se un metodo ha lanciato: la prova parte lo stesso
}
```

- **La versione sta nel nome del metodo**, `regola-semplice-1`: un metodo che
  cambia comportamento cambia numero. La data è `ts`; la versione del codice che
  l'ha calcolata è `motore`.
- **Numeri esatti dove si può.** La regola semplice salva i due interi da cui
  la probabilità discende (§4.5), non un decimale; un modello salverà la sua
  probabilità e l'intervallo, con tre decimali.
- **Le prove usate**, per la regola semplice: gli `uid` delle righe `_t: 's'`
  che ha contato. Servono a rifare il conto dopo, e a vedere se la pagina ha
  contato le prove giuste.
- **Un errore non toglie la riga.** Se un metodo lancia, la riga c'è con
  `stime` senza quel metodo e con `errore`: «nessuna previsione» e «prova mai
  avviata» restano due cose diverse.
- Pesa meno di 400 byte con cinque `uid`; il tetto di una riga è 4.096
  (`RIGA_MAX_BYTE`).

### 4.3 Dove

**Nell'archivio, come riga, e non in una tabella sua** — il contrario della
scelta per l'esito, e per le ragioni opposte:

- **la previsione deve esistere prima della prova anche se la rete cade a
  Inizia**: la riga entra nella copia dell'account con la coda, nella stessa
  transazione (R-ACC-45), e parte quando la rete torna. Una richiesta a una
  rotta sua, fallita a Inizia, sarebbe una previsione persa, cioè una prova che
  sembra non prevista;
- **non si ritira**: è un fatto — «il … alle 10:00 il metodo diceva …» —, come
  una risposta; se ne va con un azzeramento, insieme alle risposte da cui è
  calcolata, e con l'account;
- **le statistiche, l'export e il ripristino ci sono già**: la fonte `risposte`
  la filtra (§2, quarta misura), il file dei progressi la porta, l'epoca la fa
  tornare dopo un ripristino (R-ACC-24).

**Non è una seconda contabilità, e va scritto perché sembra esserlo.** È un
numero calcolato dalle righe e salvato, cioè la forma che il §3.3 della
specifica vieta per lo specchio. La differenza è che **niente la rilegge per
decidere o per disegnare**: nessuna funzione del motore che seleziona, misura o
prepara una schermata guarda `_t: 'a'`, e un controllo lo pretende (§9,
R-PREV-08). È una testimonianza, non uno stato. Il giorno in cui una schermata
la leggesse — «la tua stima di ieri era…» — sarebbe una seconda contabilità, e
servirebbe una decisione.

**Il prezzo nei conteggi.** Dove la pagina scrive «N risposte» contando righe,
una riga d'avvio diventa una risposta che nessuno ha dato: oggi «N risposte da
inviare» conta la coda intera (`site/app.html:1561`), e con la rete caduta a
Inizia direbbe «1 risposte da inviare» prima della prima domanda. È il difetto
di casa — un numero e la cosa che conta da due fonti — e il precedente è
P-48, che ha tolto «0 risposte» dall'uscita con i soli punteggi dei Segnali.
Il motore esporta un predicato, `rigaDiRisposta(r)`, e ogni conteggio che la
pagina chiama «risposte» lo usa; le righe d'avvio in attesa si nominano a
parte, «e l'avvio di una simulazione», dove serve — nell'uscita con righe non
inviate, che deve continuare a non perderle (R-ACC-46).

### 4.4 Chi lo calcola

**La pagina, con il motore, a Inizia.** Tre ragioni:

1. è l'unico punto che sa, con certezza strutturale, che la prova non è ancora
   cominciata: la riga si scrive prima della prima risposta, dalla stessa
   funzione che apre il runner;
2. ha le righe che contano, comprese quelle date su questo dispositivo e non
   ancora inviate, e quelle degli altri dispositivi già ricevute;
3. il metodo è logica pura in `site/engine.js`, che gira identico nella pagina
   e nel server (§3.4 della specifica): il server **può rifare** il conto sulle
   stesse righe, e un rifacimento che non torna è la prova che qualcosa si è
   rotto.

Il server non calcola niente a Inizia: non sa che una prova comincia, e
saperlo vorrebbe dire una richiesta che può fallire. Quando il modello avrà
bisogno di un dato da tutti — la difficoltà dei quesiti (decisione 24) — lo
calcolerà il server, con `server/statistiche.mjs`, e la pagina lo scaricherà
come un file con la sua versione, scritta in `stime`. È della riga 23.

**Il rifacimento, e dove sta.** Rifare la previsione di tutti gli account vuol
dire leggere le righe di tutti: è una statistica, e passa dal posto solo — il
controllo di R-ACC-69 è rosso altrimenti. Con la regola semplice basta l'SQL
(§4.7); con un modello no, e il conto in JavaScript su righe lette da una query
dichiarata è un punto che il controllo di oggi non vede (§15.2 di
`account-progetto.md`, «Che cosa non vedono»). Come farlo è della riga 23; qui
si fissa che le righe d'avvio portano quello che serve per rifarlo.

### 4.5 Che cosa si registra oggi, senza modello

**Tutto quello che non si può ricostruire dopo, più la regola che il modello
dovrà battere.**

**Non si ricostruisce dopo**: che una prova è cominciata, e quando. Le
risposte di una prova abbandonata ci sono, con il loro `sim_uid`, ma una prova
abbandonata alla prima domanda non lascia niente, e una cominciata senza
account nemmeno. E l'istante di Inizia: la riga `_t: 's'` porta l'istante della
consegna e in `ms` il tempo **concesso**, non quello impiegato — un difetto
noto dalla 0.19.2 (§7.5 della specifica). **Si ricostruisce dopo**, in teoria,
tutto il resto: le righe sono append-only e datate. In pratica no del tutto —
un azzeramento le toglie, e un metodo scritto dopo aver visto gli esiti è
tarato su quegli esiti. Registrare la regola prima la fissa prima.

**`regola-semplice-1`**, proposta, da fissare prima della prima riga (§11):

> Le ultime **5** righe `_t: 's'` della stessa `kind`, con l'istante prima
> dell'avvio, nell'ordine di `ordinaRighe()`. `n` quante sono (da 0 a 5),
> `superate` quante hanno `passed: 1`. La probabilità di superare è
> **(superate + 1) / (n + 2)**.

Il liscio di Laplace la rende definita anche senza prove — 1/2, cioè «non so» —
ed è dello stesso tipo della `debolezza` di `diagnosi()`. Cinque e non tre
perché con tre prove i valori possibili sono quattro; e una finestra per numero
di prove e non per giorni, perché chi fa una prova al mese e chi ne fa cinque
al giorno hanno ritmi che la regola non deve conoscere. È la «regola semplice»
del secondo parere di ChatGPT, «l'andamento delle ultime prove»: un modello che
non la batte non vale il suo costo, per quanto sia elegante.

**Che cosa non fa, ed è voluto**: non guarda le risposte, non sa niente dei
temi, non sa della composizione. È il metro, non la stima: e proprio perché è
banale si può scrivere oggi, e prova oggi tutta la strada — la riga, la coda, il
server che la accoglie, l'export, l'informativa, la statistica — prima che il
modello ci passi sopra.

**E la seconda regola, che non si registra**: la frequenza di superamento di
tutte le simulazioni base nel periodo, uguale per tutti. Si calcola dopo dalle
righe `_t: 's'`, è il metro più basso — un metodo che fa peggio di lei non sa
niente di chi studia — e non ha bisogno di una riga.

### 4.6 Che cosa ne vede chi studia

**Niente, in schermata.** Nessuna percentuale, nessuna frase, nessun cambio di
testo a seconda della previsione: la preparazione e il riepilogo di una
simulazione sono gli stessi con e senza la riga d'avvio. Il controllo lo
pretende con la regola di R-UX-06, un elenco chiuso di frasi ammesse nel testo
che si vede (§9, R-PREV-06).

**Nel file dei progressi sì**, perché ci sono tutte le righe: chi lo apre trova
`_t: 'a'` con i suoi numeri. È l'accesso dell'art. 15, non una scelta da
evitare; l'informativa lo dice (§5). In Info la riga dell'archivio conta le
prove avviate a parte («prove avviate N»), senza i numeri dentro.

### 4.7 Le statistiche

Dalla fonte `risposte`, già filtrata: niente da aggiungere a
`statistiche.mjs`. La statistica di validazione della regola semplice, provata
il 4 ottobre 2026 su un database sintetico (§2, quarta misura):

```sql
SELECT count(s.ts) AS consegnate, count(*) - count(s.ts) AS abbandonate,
  avg(((json_extract(a.dati, '$.stime."regola-semplice-1".superate') + 1.0)
        / (json_extract(a.dati, '$.stime."regola-semplice-1".n') + 2.0)
        - json_extract(s.dati, '$.passed')) * ( … la stessa differenza … )) AS brier
FROM risposte a LEFT JOIN risposte s
  ON s.chi = a.chi AND s.tipo = 's' AND json_extract(s.dati, '$.uid') = json_extract(a.dati, '$.sim_uid')
WHERE a.tipo = 'a' AND json_extract(a.dati, '$.kind') = 'base'
```

`chi` si usa nel collegamento e non esce; `dati` si apre con `json_extract` e
non esce; `statistica()` la accetta così com'è. Le altre che servono: quante
prove sono abbandonate, per account e in tutto; la calibrazione per fasce —
quando il metodo dice fra 0,6 e 0,7, quante prove sono superate —; il confronto
fra due metodi sulle stesse prove. **Le soglie con cui si dice che un metodo è
tarato, e con cui si mostra, si decidono prima di lanciarle** (decisione 25,
Q-STIMA): non sono qui.

### 4.8 Il guasto muto

1. **La previsione che si vede.** Un testo che cambia con `stime`, un conteggio
   che include le righe d'avvio, un «Sei sulla buona strada» scritto da chi ha
   la riga sotto mano: la decisione 25 rotta senza un errore. Il controllo del
   testo che si vede, e `rigaDiRisposta()` (§4.3).
2. **La previsione che ha visto l'esito.** Calcolata alla consegna invece che a
   Inizia, rifatta dopo una ricarica a metà prova, o con le risposte della prova
   stessa dentro: un metodo che «indovina» perché ha già visto. Tre difese:
   l'`uid` deterministico, così una seconda scrittura è un rinvio idempotente e
   non una seconda previsione; `ts` della riga d'avvio prima della prima riga
   `q` di quel `sim_uid`; e le `prove` contate, tutte con l'istante prima
   dell'avvio. Il controllo guarda tutte e tre (§9).
3. **Il metodo che cambia senza cambiare nome.** Un ritocco a
   `regola-semplice-1` che sposta i numeri mescola due metodi sotto un nome.
   Un test del motore fissa le sue uscite su un archivio di prova, e il messaggio
   del rosso dice «cambia il numero del metodo» (§9, R-PREV-04).
4. **La prova che parte senza riga, in silenzio.** Una funzione che lancia e
   la pagina che apre comunque il runner: dopo, «prova senza avvio» e «prova
   senza previsione» si confondono. La riga si scrive anche con un errore
   (§4.2), e una statistica conta le prove `s` senza una riga `a` fra quelle
   avviate con l'account dopo il rilascio: devono essere zero, salvo quelle
   portate da un file o da una registrazione.
5. **Il server di prima** rifiuta le righe d'avvio e blocca l'uscita (§2.2): la
   pagina le scrive solo se il server dice di accettarle (§6).
6. **L'orologio del dispositivo.** `ts` è del dispositivo, e uno sbagliato
   sposta l'ordine. Il server ha un orologio suo, `ricevuta_il` e `seq`: con la
   rete accesa la riga d'avvio arriva prima della riga `s`, e una statistica lo
   verifica. Con la rete caduta arrivano insieme, e lì vale l'ordine della
   coda, che è quello di scrittura.

---

## 5. L'informativa

Cambia **nella stessa versione** in cui la pagina scrive la prima riga d'avvio
o mostra la domanda, non prima e non dopo: è la regola del §2 della specifica,
«un'informativa che descrive un server che non c'è è falsa quanto una che tace
quello che c'è». La scrive l'interfaccia, in `site/privacy.html`; la base
giuridica è una **domanda per l'autore**, qui con le alternative, non una
risposta.

**Proposta di testo**, nel paragrafo «Con un account: quali dati e perché»,
dopo «… gli eventi di sicurezza del servizio.»:

> **Se ce lo dici, l'esito del tuo esame**: per ogni prova — carteggio, quiz
> base, quiz vela, pratica — se l'hai superata, non superata o non sostenuta, il
> giorno e, se lo sai, quanti errori. È facoltativo: puoi non rispondere,
> cambiarlo o toglierlo da Profilo, e toglierlo lo cancella dal server. Lo
> usiamo soltanto in conteggi aggregati, per capire se le simulazioni del sito
> somigliano all'esame vero; non lo mostriamo a nessuno e non decide niente su
> di te. La base giuridica è **[DA DECIDERE]**.
>
> **Prima di ogni simulazione completa dei quiz**, la palestra registra nel tuo
> account che la stai cominciando e una previsione di come andrà, calcolata
> dalle tue simulazioni precedenti, con il nome del metodo, la sua versione e la
> data. Non te la mostriamo: serve a verificare, confrontandola con la prova,
> se il metodo funziona, prima di decidere se mostrarlo. Non decide niente su di
> te. Le previsioni stanno nel file dei tuoi progressi, e si cancellano con
> l'azzeramento e con l'account. La base giuridica è **[DA DECIDERE]**.

Nel paragrafo «Per quanto li conserviamo», due voci:

> - L'esito dell'esame: finché non lo togli, o finché l'account esiste. Un
>   azzeramento dei progressi non lo cancella.
> - Le previsioni delle simulazioni: come le risposte, fino all'azzeramento o
>   alla cancellazione dell'account.

Quando la previsione verrà da un modello che usa la difficoltà dei quesiti
stimata su tutti i registrati, «calcolata dalle tue simulazioni precedenti»
diventa falsa: il testo cambia con la riga 23, nella sua versione.

**Le domande per l'autore sulla base giuridica** — da far confermare, come
quelle del §15.4 di `account-progetto.md`:

1. **L'esito dell'esame.** *Consenso* (art. 6.1.a): il modulo è già un atto
   volontario, il ritiro è «Togli», e togliere cancella; ma un consenso dev'essere
   specifico e informato, e il modulo dovrebbe portare la frase della finalità
   accanto a «Salva». Oppure *legittimo interesse* (6.1.f), come le statistiche,
   con l'opposizione: più coerente con il resto dell'informativa, meno con un
   dato che chi studia ci dà apposta. L'esecuzione del contratto (6.1.b) no: il
   servizio non ne ha bisogno.
2. **Le previsioni.** *Legittimo interesse* a verificare e migliorare il
   servizio, con l'opposizione, è la proposta. Due domande che il parere
   dovrebbe vedere: se una previsione dell'esito di una prova sia una
   **profilazione** (art. 4.4: «prevedere aspetti riguardanti il rendimento»), e
   quindi vada nominata come tale e abbia il diritto di opposizione dell'art.
   21.1; e se chi si oppone debba solo uscire dai conteggi — come oggi per le
   statistiche, e come fa da sé la fonte `risposte` — o se le previsioni non si
   debbano proprio registrare per lui, perché senza i conteggi non hanno uno
   scopo. La seconda vorrebbe che la pagina sapesse dell'opposizione, cioè un
   campo in `GET /v1/io` che il §15.2 di `account-progetto.md` oggi non mette
   (scelta 1).
3. **La LIA delle statistiche** (`lia-statistiche.md`, nella cartella del
   titolare) va estesa ai due dati nuovi, e il **registro dei trattamenti** ne
   prende nota; la **nota sulla DPIA** va riletta per la profilazione.

---

## 6. Lo schema, e il rilascio

**Lo schema passa a 5, per aggiunta**: la tabella `esito`. Le righe d'avvio non
toccano lo schema — `riga.dati` le porta com'è —, ma toccano `validaRiga()`,
cioè il motore, che il server importa.

**Il server dice che cosa accetta.** `GET /v1/io` porta due campi nuovi:
`esiti`, l'elenco, e `tipi_riga`, i tipi che il suo `validaRiga()` accoglie —
`TIPI_RIGA` del motore, esportato. La pagina:

- scrive una riga `_t: 'a'` solo se l'ultima `GET /v1/io` di questo accesso
  porta `tipi_riga` con `'a'` dentro;
- mostra il riquadro e la voce «Il tuo esame» solo se porta `esiti`.

Un campo assente — il server di prima — spegne tutte e due, e la pagina resta
quella di oggi: nessuna riga rifiutata, nessuna uscita bloccata (§2.2), nessun
modulo verso una rotta che risponde `404`. Il prezzo: le simulazioni fatte in
quel tempo non hanno la riga d'avvio, e una statistica le vede.

**L'ordine del rilascio**, un rilascio solo come vuole `AGENTS.md`: commit di
rilascio con server, motore e pagina; «Build now»; `rg-aggiorna` allo stesso
tag. Nei minuti fra i due la pagina nuova parla con il server di prima, e i due
campi assenti la tengono spenta: è il motivo per cui i campi esistono.
**Tornare indietro** con `rg-torna` lascia la tabella `esito` nel database
(additivo, §2.7, regola 3) e la pagina nuova spenta; con il codice di prima, la
cancellazione di un account porta via i suoi esiti per la chiave esterna, ed è
il caso che il §9 prova.

**Il `ripristina.mjs` del rilascio di prima** conterà fra le illeggibili le
voci «esito tolto» del file delle cancellazioni, come conta le opposizioni: il
server nuovo, a ogni avvio, le rilegge e le applica (§3.4).

---

## 7. Contratti e chiamanti da preservare

**Prima di aggiungere un tipo a `TIPI_RIGA`, i chiamanti**, letti nel codice
il 4 ottobre 2026 — chi legge le righe per tipo, e che cosa cambia per lui con
`_t: 'a'`:

| Chiamante | Come legge | Con `'a'` |
|---|---|---|
| `ripiega()` (`engine.js:1299`) | sceglie la destinazione per tipo, `null` per gli altri | ignorata, nessun cambio |
| `sessioni()`, `erroriSessione()`, `ritmo()` (`:1363`, `:1366`) | `'s'` per le prove, `'q'` per il resto | ignorata |
| `attivitaCarteggio()` (`:1624`–`1630`) | `'s'`, il tipo nominato, e i `sim_uid` di `q`/`c`/`t` come «altrui» | ignorata: il controllo deve provarlo, perché un `sim_uid` su un tipo che non conosce non diventi una prova estranea |
| `tagPerTentativo()` (`:1279`) | solo `'g'` | ignorata |
| `validaRiga()`, `fondiArchivio()` | `TIPI_RIGA` | accettata con le sue regole (§10.1) |
| la coda, `nuovoTrasferimento()`, `riepilogoTrasferimento()` | per `uid` | contata fra le righe: i testi che dicono «risposte» usano `rigaDiRisposta()` |
| `statoArchivio()` in pagina (`app.html:2242`) | conta per tipo | una voce sua, «prove avviate» |
| «N risposte da inviare» (`app.html:1561`), l'uscita (`:1964`), l'export senza le pendenti (`:2162`) | la coda intera | `rigaDiRisposta()`, e le righe d'avvio nominate a parte |
| `server/leggi.mjs` | righe per tipo | le mostra con le altre; e mostra gli esiti |
| il controllo statico di R-ACC-74 | file che leggono le righe di un account | invariato; `esito` entra nell'elenco come tabella di un account |

**I contratti che non si toccano**: la riga `_t: 's'` resta com'è — nessun
campo nuovo, il suo `uid` resta il `sim_uid` —; `simulazione()` e
`simulazioneVela()` non guardano lo storico e non cambiano; lo specchio non si
salva (§3.3 della specifica: le righe d'avvio non sono uno specchio, §4.3);
la data d'esame resta una colonna del profilo, facoltativa (R-STA-01, R-ACC-55).

---

## 8. Casi di accettazione della realizzazione

1. Con l'account, la data d'esame al 3 settembre e oggi il 4: il riquadro è nel
   Percorso e in nessun'altra vista; «Rispondi», carteggio superata, base
   superata con 2 errori, vela non sostenuta, Salva: sul server tre righe
   d'esito, `GET /v1/io` le porta, il riquadro sparisce, Profilo mostra la riga.
2. Lo stesso su un secondo dispositivo dello stesso account: niente riquadro.
3. «Non chiedermelo più»: tre righe `non_detto`, nessun riquadro su nessun
   dispositivo; Profilo dice «non ce l'hai detto».
4. «Non l'ho ancora fatto», data al 20 ottobre: il riquadro sparisce, ricompare
   il 20.
5. Senza data: nessun riquadro; Profilo offre «Il tuo esame».
6. Senza account: nessun riquadro, nessuna voce, nessuna richiesta a `/v1/esito`.
7. Togli: le righe spariscono dal server e dai byte del database e del WAL; una
   copia di prima del ritiro, ripristinata, non le riporta.
8. Base superata con 6 errori: `422`, niente scritto, il modulo dice perché.
9. Con il server di prima (senza `esiti` né `tipi_riga` in `/v1/io`): nessun
   riquadro, nessuna riga d'avvio, una simulazione completa uguale a oggi,
   l'uscita non bloccata.
10. Con l'account, una simulazione base: alla pressione di Inizia, prima della
    prima risposta, nella copia e poi sul server una riga `_t: 'a'` con
    `sim_uid` della prova, `regola-semplice-1` con le prove giuste; consegnata,
    la riga `s` con lo stesso `sim_uid`; il testo che si vede uguale a una
    simulazione senza riga d'avvio.
11. Una ricarica a metà simulazione, poi un nuovo Inizia: due `sim_uid`, due
    righe d'avvio, la prima senza riga `s` — abbandonata, e contata così.
12. La rete caduta a Inizia: la riga d'avvio in coda; «N risposte da inviare»
    non la conta come una risposta.
13. «Base e vela»: due righe d'avvio, una per fase, ciascuna con la sua
    `kind`; la vela scritta all'inizio della fase vela.
14. Un azzeramento: le righe d'avvio se ne vanno con le risposte; gli esiti
    restano, e la conferma lo dice.
15. Un file esportato e ricaricato in un altro account: righe d'avvio
    importate, esiti no, e l'anteprima lo dice.

---

## 9. I requisiti proposti, con il loro controllo

Da portare nel §9 della specifica da chi la scrive (§10.1, A-4); i nomi dei test
sono proposte.

| ID | Requisito | Controllo |
|---|---|---|
| R-ESITO-01 | Un esito si scrive per prova e per giorno, con le regole del §3.3: un `422` dice il campo e non lascia scritto niente | `test_server.mjs::esito: si scrive per prova e per giorno, e un campo rotto non lascia scritti gli altri` |
| R-ESITO-02 | Senza account non c'è né la domanda né la voce, e nessuna richiesta a `/v1/esito` | `test_interfaccia.py::test_esito_senza_account` |
| R-ESITO-03 | Il riquadro compare solo con la data d'esame passata da al più 90 giorni e senza esiti da trenta giorni prima in poi, in un posto solo, mai in un'attività; e mai se `GET /v1/io` non porta `esiti` | `test_interfaccia.py::test_esito_quando` |
| R-ESITO-04 | «Salvato» solo dopo il `200`, e l'elenco mostrato è quello della risposta | `test_interfaccia.py::test_esito_salvato` |
| R-ESITO-05 | Togliere cancella dai byte del database e del WAL; un ripristino da una copia di prima non lo riporta, nemmeno fatto con il `ripristina.mjs` di prima, perché il server lo rilegge all'avvio | `test_server.mjs::esito: togliere cancella davvero, e un ripristino non lo riporta` |
| R-ESITO-06 | La cancellazione dell'account porta via i suoi esiti, anche con il codice di un rilascio che non conosce la tabella | `test_server.mjs::esito: la cancellazione dell account li porta via, anche con il codice di prima` |
| R-ESITO-07 | Chi si è opposto è fuori dalla fonte `esiti`; una statistica che nomina `esito` è rifiutata; una query su `esito` fuori dal posto solo è rossa | `test_server.mjs::statistiche: gli esiti passano dalla fonte filtrata` |
| R-ESITO-08 | L'export porta gli esiti, l'import non li carica e lo dice, e il file si ricarica con `importa()` con le stesse righe | `test_server.mjs::esporta: il file porta gli esiti, e importa non li carica` |
| R-ESITO-09 | Un azzeramento non tocca gli esiti | `test_server.mjs::azzera: gli esiti restano` |
| R-PREV-01 | `validaRiga()` accetta una riga `_t: 'a'` con le sue regole e rifiuta le altre forme con un motivo | `test_engine.mjs::validaRiga: la riga d avvio` |
| R-PREV-02 | Nessuna funzione del motore che seleziona, misura o disegna cambia il suo risultato per una riga d'avvio in più | `test_engine.mjs::la riga d avvio non cambia niente di quello che il motore calcola` |
| R-PREV-03 | `regola-semplice-1` conta le ultime 5 prove della stessa `kind` prima dell'avvio, e nessuna dopo | `test_engine.mjs::regola-semplice-1: le prove prima dell avvio, e nessuna dopo` |
| R-PREV-04 | Le uscite di ogni metodo registrato sono fissate su un archivio di prova: cambiarle senza cambiare il numero del metodo è rosso | `test_engine.mjs::un metodo che cambia cambia numero` |
| R-PREV-05 | Con l'account, a Inizia di ogni simulazione completa, e di ogni fase di «Base e vela», una riga d'avvio, prima della prima risposta, con un `uid` che una seconda scrittura non duplica; senza account nessuna | `test_interfaccia.py::test_avvio_registrato` |
| R-PREV-06 | La previsione non si vede: il testo della preparazione, del runner e del riepilogo di una simulazione è lo stesso con e senza riga d'avvio, e sta nell'elenco chiuso | `test_interfaccia.py::test_avvio_non_si_vede` |
| R-PREV-07 | I conteggi che la pagina chiama «risposte» non contano le righe d'avvio | `test_interfaccia.py::test_avvio_non_e_una_risposta` |
| R-PREV-08 | Nessuna funzione esportata dal motore, salvo `validaRiga()`, `fondiArchivio()`, la coda e i metodi di previsione, legge `_t: 'a'` | `test_engine.mjs::la riga d avvio non la rilegge nessuno` |
| R-PREV-09 | Con un server che non dichiara `'a'` in `tipi_riga` la pagina non scrive righe d'avvio, e l'uscita non si blocca | `test_interfaccia.py::test_avvio_server_di_prima` |
| R-PREV-10 | Un metodo che lancia non ferma la prova: la riga d'avvio c'è, con `errore` | `test_interfaccia.py::test_avvio_con_un_errore` |

**Che cosa non vedono, già da ora**: chi risponde e chi no, e perché (§3.7,
punto 1); un manuale aperto accanto a una simulazione; l'orologio sbagliato di
un dispositivo con la rete caduta; un testo che lascia capire la previsione
senza scriverla; Safari.

---

## 10. Dipendenze ed evidenze

### 10.1 Chi fa che cosa

Quattro lavori su `main`, poi due su `ui/main`, poi un rilascio solo. I testi
di questo documento sono quelli da usare; se un lavoro trova che non reggono,
si ferma, li corregge qui e lo dice nel resoconto.

**A-1 — Claude su `main`: il motore** (`site/engine.js`, `tests/test_engine.mjs`).

- `TIPI_RIGA` diventa esportato e prende `'a'`. `validaRiga()` per `_t: 'a'`:
  `sim_uid` una stringa da 1 a 60 caratteri, perché con «:a» l'`uid` resti
  entro i 64; `uid` uguale a `sim_uid + ':a'`;
  `kind` `'base'` o `'vela'`; `prova` `'base'`, `'vela'` o `'entrambe'`; `ts`
  come le altre; `motore` una stringa al più di 16 caratteri; `stime` un oggetto
  semplice, chiavi nella forma `nome-N`; `errore`, se c'è, una stringa al più di
  200; niente `item_id`. Motivi nuovi, brevi e stabili: «avvio non valido».
- `PREVISIONI`, congelata: l'elenco dei metodi attivi, oggi uno,
  `'regola-semplice-1'`, con la sua definizione scritta accanto come quella di
  `PROVA_CARTEGGIO`.
- `previsioniProva(righe, kind, ts)` → `{ stime, errore? }`: ogni metodo in un
  `try`, così un metodo che lancia non toglie gli altri.
- `rigaAvvio({ simUid, kind, prova, ts, motore, righe })` → la riga intera; la
  pagina non la compone da sé.
- `rigaDiRisposta(r)`: vero per `q`, `c`, `t`, `s`; falso per `g` e `a`. Prima,
  elencare i chiamanti della pagina che contano «risposte» (§7) e scriverli nel
  resoconto: sono il lavoro di B-2.
- I test di R-PREV-01…04 e 08, ognuno provato al contrario; per R-PREV-02 le
  funzioni sono quelle del §7, eseguite con e senza una riga d'avvio, e un
  confronto profondo. Le funzioni nuove fra gli orfani dichiarati di
  `docs/eccezioni-interfaccia.md` finché B-2 non le chiama.

**A-2 — Claude su `main`: il server** (`server/`, `tests/test_server.mjs`).

- Schema 5: la tabella `esito` del §3.3, una migrazione additiva; R-ACC-19 la
  include nel controllo dei byte.
- `server/esiti.mjs` (o dentro `conti.mjs`, se la regola dei file lo vuole):
  `PUT` e `DELETE /v1/esito` con le regole del §3.3; il ritiro scritto prima
  nel file delle cancellazioni (`esito tolto`: `id`, chiave, giorno, quando);
  `secure_delete` e il WAL svuotato; il tetto di 20 giorni.
- `GET /v1/io` porta `esiti` e `tipi_riga`; `/v1/esporta` porta `esiti`.
- `ripristina.mjs` e l'avvio del server rileggono i ritiri, come le
  opposizioni; `leggiCancellazioni()` li restituisce a parte, perché non
  spiegano un calo di righe.
- `server/statistiche.mjs`: la fonte `esiti`, `esito` in `TABELLE`, il
  controllo statico di R-ACC-69 esteso alla tabella; `server/leggi.mjs` mostra
  gli esiti, e R-ACC-74 dichiara la tabella.
- I test di R-ESITO-01, 05…09; R-ESITO-06 si prova davvero con il codice del
  tag `v0.30.0`, estratto in una cartella, come P-54 ha fatto per lo schema 4.
  Con la 24.21.0 LTS come sempre.
- `docs/account-progetto.md`: §3, §7.1, §14, §15.2 e il §20 con le righe nuove.

**A-3 — Claude su `main`: i controlli della pagina** (`tests/client_account.mjs`,
`tests/test_interfaccia.py`, la pagina di riferimento del client).

- Due gruppi nuovi del banco: E-01 per l'esito (R-ESITO-02…04), P-01 per
  l'avvio (R-PREV-05…07, 09, 10), con il server vero sulla 8620 e un server
  finto per il caso del server di prima (`/v1/io` senza i due campi).
- La pagina di riferimento li realizza con i testi del §3.1, e porta le
  rotture: il riquadro senza data, dopo 90 giorni, con un esito già detto, in
  un riepilogo, in una finestra modale; «Salvato» prima del `200`; la riga
  d'avvio scritta alla consegna, senza account, due volte con due `uid`, con il
  server di prima; una percentuale nel riepilogo; «1 risposte da inviare» per una
  riga d'avvio; un metodo che lancia e ferma la prova.
- Che cosa non vedono, scritto nel §12 del progetto del client.

**A-4 — Claude su `main`: la specifica.** §3.2 (la riga d'avvio, e perché non è
uno specchio), §3.7 (il server conserva gli esiti), §4.6 (la nota sulla stima
diventa «si registra»), §5.4 (le due voci), i requisiti del §9 di questo
documento nel §9 della specifica, Q-STIMA nel §10 aggiornato: la strada in
pagina c'è, resta l'email.

**B-1 — ChatGPT su `ui/main`: «com'è andata»**, dopo A-2 e A-3 fusi
(`site/app.html`, `site/privacy.html`).

- Il riquadro nel Percorso e la voce «Il tuo esame» nella finestra Account, con
  i testi del §3.1, le condizioni del §3.2, i tre pulsanti, il modulo, gli
  errori; la conferma dell'azzeramento con la frase del §3.4; l'anteprima
  dell'import con la frase del §3.4.
- Accesi solo se `GET /v1/io` porta `esiti`.
- Il collaudo a 375 e 1280 px, nei due stati d'accesso, con il server degli
  account in locale su un database temporaneo.

**B-2 — ChatGPT su `ui/main`: la riga d'avvio**, dopo A-1 e A-3 fusi.

- A Inizia di ogni simulazione completa, e di ogni fase, con l'account e con
  `'a'` in `tipi_riga`: `archivia(E.rigaAvvio(…))` prima di aprire il runner,
  nella stessa funzione che lo apre; niente in schermata.
- I conteggi del §7 con `E.rigaDiRisposta()`; «prove avviate» in Info; le righe
  d'avvio pendenti nominate a parte nell'uscita.
- L'informativa del §5, con la base giuridica che l'autore avrà scelto: entra
  nello stesso commit di B-1 o di B-2, quello che arriva primo, e copre tutte e
  due. Senza la scelta dell'autore, B-1 e B-2 non si fondono.

**Il rilascio**, dopo B-1 e B-2: un commit, «Build now», `rg-aggiorna` (§6).
Se l'autore vuole partire prima con una delle due raccolte — le previsioni non
hanno un testo da scrivere oltre all'informativa —, B-2 esce da sola con A-1 e
la sua metà di A-3, e la tabella `esito` aspetta.

**Rispetto al ridisegno** (riga 21): le due raccolte vanno sulla pagina di
oggi, e il ridisegno le porta con sé — il riquadro nel cruscotto della Home,
la voce nel Profilo. Aspettare il ridisegno vorrebbe dire mesi di dati che non
ci sono, che è la ragione per cui la decisione 27 dice «presto».

### 10.2 Evidenze di P-64 e limiti

Misurato: le tre risposte del server del §2, sul codice del tag in esercizio;
la statistica del §4.7 attraverso `statistica()`, con l'opposizione, su righe
sintetiche inserite a mano. Letto nel codice e non guidato: che la pagina
blocchi l'uscita con righe non accolte, e i conteggi del §7. Non fatto: niente
in un browser, niente sulla macchina, nessuna prova con persone; nessuna
misura di quanti risponderanno.

---

## 11. Decisioni per l'autore

1. **La base giuridica dell'esito**: consenso o legittimo interesse (§5,
   domanda 1).
2. **La base giuridica delle previsioni**, se sono una profilazione, e se per
   chi si oppone si smette di registrarle o escono soltanto dai conteggi (§5,
   domanda 2). Ferma B-1 e B-2: l'informativa non si scrive senza.
3. **Il parere**: se chiederlo per questi due punti, o pubblicare come per il
   resto dell'informativa sul primo parere.
4. **Gli errori, se lo sai**: chiederli o no (§3.1). La proposta è sì,
   facoltativi: sono la parte che serve di più alla stima.
5. **Novanta giorni**, la finestra del riquadro (§3.2).
6. **Un'email dopo l'esame** per chiedere com'è andata: allargherebbe il
   campione, ed è un uso dell'email che `docs/filosofia.md` non nomina (ADR-006,
   «La stima», punto 3; Q-STIMA). La proposta è no, per ora: misurare prima
   quanti rispondono senza.
7. **L'azzeramento non tocca l'esito** (§3.4). Proposta sì.
8. **`regola-semplice-1`**: le ultime 5 prove, (superate + 1) / (n + 2) (§4.5).
   Si fissa prima della prima riga, e non si ritocca: un'altra regola è un
   altro numero.
9. **«Senza aiuti» non si chiede** (§4.1). Proposta: non chiederlo.
10. **La vela registrata come il base** (§4.1), e **la prova di carteggio
    no**, per ora: la stima non la guarda (decisione 23).
11. **La soglia di persone** sotto la quale un conteggio sugli esiti non esce
    dalla macchina (§3.6). Proposta 20, la stessa che servirà alla difficoltà
    dei quesiti.
12. **Partire con una raccolta sola** se l'altra aspetta (§10.1, il rilascio).
