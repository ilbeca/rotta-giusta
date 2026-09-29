# Gli account — progetto del client

**P-13, decisioni di interfaccia del 26 settembre 2026, da implementare.**
**Riallineato da P-28 il 26 settembre 2026** al server che P-11 ha chiuso
(§1, §5.2, §8), alla simulazione consegnata senza risposte dell'area 3 (§4.1)
e ai contratti del motore per i trasferimenti (§9.3). **P-29 ha aggiunto al §12
il banco del browser**, con la misura che l'ha scelto e il contratto che la
pagina deve rispettare; **P-38 l'ha reso stabile e P-39 ci ha aggiunto i
gruppi C-01 completo, C-03, C-04, C-06, C-11 e C-15**, con il contratto che
cresce di conseguenza; **P-43 ha scritto gli altri dieci e C-15 per intero**.
Il resto è di P-13.
Questo documento specifica flussi, testi, stati e controlli del client. Non
dichiara un client realizzato, un server in esercizio o una prova con utenti.
La sessione produce questo file e una voce di CHANGELOG.

Chi arriva può non conoscere il sito; chi torna può avere anni di risposte in
un browser o in un file. Entrambi devono poter provare senza compilare un
modulo e sapere quali risposte sono davvero salvate. Il timore da risolvere
è perdere il lavoro o ritrovarlo nell'account di un'altra persona.

## 1. Fonti, precedenze e perimetro

- [ADR-004](adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md): tutte
  le attività senza account, salvataggio e Progressi con account, quattro
  condizioni del passaggio. Resta l'ADR-003 per il trattamento dei dati.
- [Progetto degli account](account-progetto.md), §§5–13: password, sessione,
  API, sincronia, verifica, trasferimenti e impostazioni. La pagina consuma
  questi contratti; non modifica hashing, cookie, limiti o schema del server.
- [Prossime sessioni](prossime-sessioni.md), §1: testi da sostituire nella
  versione con gli account e comportamenti richiesti alla pagina; P-13 per il
  perimetro di questa sessione, P-11 e P-28 per quello che le hanno cambiato.
- [Specifica](specifica.md), §2.4, §4.3 e §9.9: ingresso, soglie e R-ACC.
  [Filosofia](filosofia.md): promesse vere, perdita dichiarata, nessun invito
  insistente, dati leggibili dal titolare.
- [Area 1](area-1-progetto.md): modello del documento e flussi già progettati.
  Questo progetto sostituisce le sue promesse di persistenza senza account;
  conserva proposta, libertà di scelta, riscontro e ritorni.
- Letti nella base `8f6a0c0`: `site/engine.js` per firme e risultati della coda,
  `server/conti.mjs` per registrazione, reimpostazione e descrizione dell'account.
  P-28 li ha riletti dopo P-11 (`cd490ac`), e con loro `server/righe.mjs`.

**Precedenza:** task e decisioni esplicite dell'autore, ADR accettati,
contratti del progetto account, questo documento per il loro consumo. Le
proposte anteriori di account obbligatorio e preferenze anonime persistenti
sono superate. Q-ONBOARD resta nel §10 della specifica: qui si realizza soltanto
la domanda già decisa sulla data, senza introdurre un piano o altre domande.

**Entra:** accesso dalla palestra, registrazione a fine attività, verifica e
recupero password, uscita, archivio per account, coda, conversione di file e
archivio preesistente, data facoltativa, stato senza account, testi pubblici.
Le impostazioni account espongono anche le rotte già definite al §7.1 del
progetto account, senza ridisegnare Progressi o Carteggio.

**Prerequisiti del codice.** P-09, P-10 e P-11 esistono e hanno test
(R-ACC-10…38 nel §9.9 della specifica): il server ha tutte le rotte del §7.1
del progetto account. Server testato e server raggiungibile in produzione sono
due evidenze distinte; l'origine e il cookie reali richiedono la messa in
esercizio (P-15) e la prova del §12.

*Che cosa è cambiato con P-11 (`cd490ac`), rispetto alla base che P-13 ha
letto:*

- **Email già registrata:** la registrazione risponde `409` con
  `{ errore: 'email_registrata', messaggio }`, senza sessione, senza cookie e
  senza mail. Non esiste più il `202` indistinguibile che P-13 aveva letto:
  la pagina riconosce il caso dal codice **e** da `errore`, non dal testo
  (§5.2). Il `409` conta fra le cinque registrazioni l'ora per indirizzo, e
  la password si controlla prima: un `422` di password arriva prima del `409`.
- **Mail di conferma rifiutata:** `503` con `errore: 'posta'`, e il corpo porta
  già la descrizione dell'account (email, `scade_se_non_verificata`,
  generazione, epoca, `chiave_locale`) insieme al cookie. `GET /v1/io` resta
  la verifica quando la risposta si perde (§4.3).
- **Profilo:** `PUT /v1/profilo` con `{ data_esame, segnali }`, ognuno
  facoltativo; `data_esame: null` la toglie; i punteggi si fondono con il
  massimo di `migliore` e `giocate` per modo; un campo rotto è un `422` che non
  scrive nemmeno gli altri. La risposta è la descrizione dell'account.
- **Lettura di data e punteggi:** la descrizione dell'account — `GET /v1/io`,
  `POST /v1/accesso`, `POST /v1/verifica`, `PUT /v1/profilo` — porta
  `data_esame` e `segnali`, nella forma di `segPunti`; `GET /v1/esporta` porta
  `segPunti` accanto alle righe.
- **Cambio d'indirizzo:** `POST /v1/email/cambia` con la password, solo da un
  indirizzo già confermato; l'indirizzo cambia quando il nuovo apre il suo
  link, con `POST /v1/email/conferma`, entro 24 ore. Una password cambiata
  annulla la richiesta.
- **Cancellazione:** `DELETE /v1/account` con la password, `204` e cookie tolto.
- **Azzeramento:** `POST /v1/azzera` con la password, già di P-10.

## 2. Decisioni che chi implementa deve applicare

| Decisione | Scelta e motivo |
|---|---|
| Ingresso | Percorso e primo quesito senza registrazione; nessun tour obbligatorio. |
| Invito | Un blocco alla fine di ogni attività, dopo il riscontro; nessun popup a ogni vista. Accesso volontario sempre raggiungibile. |
| Prova | Archivio, filtri, data e Segnali solo in memoria finché resta aperta la pagina. Ricaricare ricomincia; nessun salvataggio in `sessionStorage`. |
| Storico | Progressi e metriche longitudinali soltanto con account. Riepilogo e revisione dell'attività rimangono disponibili a tutti. |
| Registrazione | L'account non verificato funziona subito. Confermare l'email entro la scadenza restituita dal server resta necessario per conservarlo. |
| Importazione | File, risposte della pagina e archivio vecchio entrano dalla stessa porta: motore e API delle righe. Nessun trasferimento dello specchio. |
| Accesso esistente | Le risposte anonime entrano solo dopo una domanda esplicita; il sì è proposto ma non eseguito da solo. |
| Archivio vecchio | Si legge e si preserva; non alimenta i Progressi anonimi e non riceve nuove risposte. |
| Uscita | Conferma del server, poi cancellazione della copia dell'account e delle sue preferenze. Righe non salvate e scartate richiedono prima una scelta. |
| Data | Domanda facoltativa dopo il salvataggio iniziale, saltabile; server per l'account, memoria per la prova. |
| Contabilità | La pagina trasporta e presenta; il motore decide coda, cursore, conflitti, validazione e unione. |

## 3. Stati, porte e struttura

### 3.1 Stato di accesso distinto dallo stato di salvataggio

| Stato | Fonte delle attività | Cosa si mostra e si può fare |
|---|---|---|
| Prova senza account | Righe della pagina aperta | Tutte le attività, riepiloghi e revisioni correnti; avviso di temporaneità. |
| Apertura con verifica della sessione | Memoria; copia locale isolata, se già associata | «Verifica dell'accesso in corso…». Il primo quesito resta accessibile; nessuna copia di un account sconosciuto viene caricata nella prova. |
| Account verificato | Archivio `rg-account-<chiave_locale>` e server | Attività e Progressi; stato dell'invio separato dall'identità. |
| Account non verificato | Stesso archivio e stesse funzioni | Avviso di conferma con data/ora di cancellazione, sempre visibile fin dal primo momento. |
| Account già riconosciuto, offline | Sua copia locale e coda | Attività e Progressi locali; «Sei offline. Le nuove risposte sono in questo dispositivo e saranno inviate quando tornerà la rete.» |
| `401` da una rotta autenticata | Copia congelata dell'account | Riaccesso; nessun invio anonimo o verso un altro account. «L'accesso non è più valido. Entra di nuovo per inviare le risposte rimaste in questo dispositivo.» |
| Generazione diversa | Copia congelata e conflitto del motore | Scelta scaricare/scartare, prima di ricevere o inviare altro (§10). |
| Archivio vecchio trovato | Fonte di migrazione separata | Avviso di passaggio prima delle attività (§7), anche se si è già entrati. |
| Origine senza API | Memoria e archivio vecchio separato | Prova e download della copia vecchia; collegamento a `https://rottagiusta.it/app`, nessun modulo destinato a fallire. |

L'avviso di verifica non sostituisce quello di salvataggio: possono coesistere.
La lettura fallita del vecchio archivio dice «Non siamo riusciti a leggere le
risposte già presenti in questo browser. Riprova prima di cancellare i dati del
sito», con «Riprova»; non diventa «nessuna risposta».
Un `401` non prova che siano passati trenta giorni: può essere revoca o
cancellazione. La frase «Sono passati 30 giorni dall'ultimo accesso. Entra di
nuovo» si usa solo se il client conosce quella scadenza; altrimenti la frase
generica della tabella. Il client non prolunga la durata usando il sito.

### 3.2 Porte per stato

Percorso, Quiz, Carteggio, Segnali, simulazioni, esercizi sulla carta e
riconoscimento delle tecniche restano raggiungibili senza account. Restano
anche motivazioni della selezione, correzioni, note, figure, timer, riepiloghi
parziali e «Rivedi gli errori»/«Rivedi le risposte» dell'attività corrente.
Nessun click su «Inizia» apre un modulo account.

Senza account la barra non presenta Progressi come una vista con zeri o come
un pulsante bloccato. Un ingresso precedente verso Progressi mostra:
«I Progressi descrivono le attività salvate nel tuo account. Senza account puoi
fare tutte le attività e rivedere quelle della pagina aperta.» Azioni «Vai al
Percorso» e «Accedi»; niente dashboard costruita dallo storico temporaneo.
Nel Percorso anonimo niente copertura cumulativa, diagnosi, andamento, elenco
di sessioni storiche o quota/semaforo da storico. Il motore può usare le righe
temporanee per scegliere la prossima attività; questo non rende lo storico
persistente. Le misure con account conservano tutte le soglie già previste.

Nell'intestazione: «Accedi» senza account, «Account» con account; da Account
si entra anche da Info. Il pannello ha titolo «Il tuo account», email, stato
di verifica, stato dell'archivio, data d'esame, trasferimenti e impostazioni.
L'invito a registrarsi è nel riepilogo; nel modulo di accesso resta un semplice
link «Crea un account». Info è sempre raggiungibile e mantiene il pallino
ambra per scritture fallite e righe scartate.

## 4. Provare e registrarsi alla fine di un'attività

### 4.1 Prima di cominciare e nel riepilogo

Prima di ogni avvio anonimo, accanto al pulsante:
**«Senza account le risposte valgono solo finché questa pagina resta aperta.
Se la chiudi o la ricarichi, le perdi. Non salviamo niente, nemmeno le tue
preferenze.»** Nessuna checkbox obbligatoria. Vale anche per Segnali:
«Senza account anche i punteggi dei Segnali valgono solo per questa pagina.»

Nel riepilogo, prima il risultato e le azioni di revisione, poi:

> **Vuoi conservare le attività di questa pagina?**
>
> Senza account, chiudendo o ricaricando la pagina perdi le risposte e le
> preferenze. Crea un account per salvare le risposte, ritrovarle su un altro
> dispositivo e vedere i Progressi quando ci sono abbastanza dati.
>
> Le risposte saranno legate alla tua email e conservate sul nostro server,
> in chiaro. Il titolare può leggerle per supporto e statistiche.

Azioni «Crea un account e salva» e «Continua senza account», entrambe normali,
leggibili e con target almeno 44 px. Link «Hai già un account? Accedi» e
«Come trattiamo i dati» → `/privacy`. Si conserva il riepilogo se si chiude il
modulo. Continuare non richiede una seconda conferma e non riapre l'invito
durante la prossima attività; il blocco torna al suo riepilogo.
Con zero risposte nessuna frase «salva questa attività» o sessione inventata:
si torna alla destinazione d'origine. **Eccezione, la simulazione consegnata**
(allineata da P-28 al §4.1 di [area 3](area-3-progetto.md)): una prova
consegnata o scaduta con zero risposte apre il suo riepilogo — prova conclusa
con domande mancanti, non superata — e conserva la riga `_t:'s'` che il runner
già scrive. Non crea risposte e non mostra il blocco «Vuoi conservare le
attività di questa pagina?»: quel riepilogo non ha risposte da salvare. La
riga `_t:'s'` resta nelle righe della pagina, e se più tardi chi studia si
registra viaggia con le altre (§4.3). Un allenamento fermato con zero
risposte torna all'origine, come sopra. Nei Segnali il blocco dice «salvare i
punteggi»; non li conta come risposte né come copertura dei quiz.

### 4.2 Modulo di registrazione

Titolo «Crea un account»; testo «Salva le risposte di questa pagina e ritrovale
quando torni.» Campi etichettati «Email» e «Password», `type=email`,
`autocomplete=username` e `autocomplete=new-password`. Aiuto password:
«Almeno 15 caratteri, al massimo 256. Puoi usare una frase di tre o quattro
parole. Non servono maiuscole, numeri o simboli obbligatori.»
Permettere incolla, autofill e gestori; pulsante «Mostra password»/«Nascondi
password» con stato accessibile. Nessun secondo campo di conferma.
Il server decide lunghezza, password comune e parole del contesto; la pagina
mostra il motivo del `422` accanto al campo e suggerisce una frase diversa.
Non replica in JavaScript l'elenco delle password comuni.

Prima dell'azione: «L'email serve per accedere, recuperare la password e
ricevere gli avvisi sull'account. Nessuna newsletter. Puoi scaricare e
cancellare i tuoi dati; dopo due anni di inattività ti avvisiamo prima di
cancellarli.» Link `/privacy`. Nessuna casella di consenso marketing o
accettazione obbligatoria dell'informativa. La revisione legale resta il gate
del rilascio, indicato in `prossime-sessioni.md` §4.

Azioni «Crea l'account e salva» e «Torna al riepilogo» (oppure «Torna al
Percorso» per ingresso volontario). Durante la richiesta: «Creazione
dell'account in corso…», invio disabilitato contro il doppio click; i campi e
il riepilogo non spariscono. Non memorizzare la password e non inserirla in
log, URL o messaggi d'errore.

### 4.3 Esito e primo invio

```text
Riepilogo → modulo → POST registrazione
  ├─ 422 / 429 / errore rete → stesso modulo, risposte ancora in memoria
  ├─ 409 email iscritta → accesso o recupero (§5)
  └─ 201, oppure 503 con account/sessione effettivamente creati
       → identità + scadenza conferma → invio delle righe della pagina
          ├─ in attesa / errore → non dichiarare salvato
          └─ tutti gli uid confermati → copia account → data facoltativa
               → ritorno al riepilogo / Percorso, Progressi disponibili
```

Congelare lo snapshot delle righe da trasferire, incluse le precedenti
attività della stessa pagina; non soltanto l'ultimo quiz. Usare `fondiArchivio`
e `nuovaCoda`, con generazione ed epoca dell'account. Il primo lavoro dopo
l'identificazione è `POST /v1/righe`, prima di onboarding o navigazione ai
Progressi. Il conto mostrato proviene dagli esiti del motore sullo snapshot.
«{N} risposte salvate nel tuo account» soltanto quando ogni uid dello snapshot
è riconosciuto dal server, anche tramite una ricezione, senza scarti irrisolti.
Non basta HTTP 200, né una coda senza righe da ritentare.

Finché manca la conferma: **«Non chiudere la pagina: le risposte non sono
ancora salvate nel tuo account.»** «Riprova l'invio» e «Scarica le risposte
di questa pagina». Nessun ciclo di tentativi continuo: un tentativo al ritorno
della rete o su richiesta; per `429` rispettare `Retry-After`. Con scarti:
«{N} risposte salvate · {S} righe non salvate», motivi e download; niente
successo pieno. Lo snapshot resta disponibile finché risolto o abbandonato
esplicitamente dopo una scelta che spiega la perdita.

Un `503` di posta può avere già creato account e cookie: verificare con
`GET /v1/io`, mostrare la scadenza e inviare le risposte se l'identità è
confermata. Dire «L'account è creato, ma non siamo riusciti a spedire la mail
di conferma. Riprova fra qualche minuto», con «Rimanda la mail».
Non ritentare la registrazione di quell'account. Se la risposta di creazione
si perde, verificare la sessione prima di ripetere; se non si riesce a sapere,
dire «Non sappiamo se l'account è stato creato. Le risposte sono ancora qui.
Riprova a verificare l'accesso o entra con email e password.»

## 5. Accesso, email già registrata e password

### 5.1 Accesso e passaggio delle risposte correnti

Titolo «Accedi»; campi Email (`autocomplete=username`) e Password
(`autocomplete=current-password`); «Accedi», «Ho dimenticato la password»,
«Crea un account», «Torna all'attività». Durante il POST: «Accesso in corso…».
`401`: «Email o password non corrette. Riprova oppure reimposta la password.»
Non distinguere email sconosciuta e password sbagliata. `429`: «Troppi
tentativi. Puoi riprovare fra {attesa}», dal `Retry-After`; `403` di password
disattivata: messaggio del server e accesso alla reimpostazione, senza dire
che l'email esiste.

Se esistono righe della prova, dopo il riconoscimento dell'account e prima
di trasferirle: «Vuoi portare nel tuo account le {N} risposte di questa
pagina?» Scelta «Sì, portale» proposta; alternativa «No, continua senza
portarle»; pulsante «Conferma la scelta». Mostrare l'email di destinazione.
I Segnali hanno una scelta distinta «Porta anche i punteggi dei Segnali».
Mai caricare per effetto della sola selezione predefinita.

Il sì segue §4.3. Il no separa le righe della prova dall'account: il riepilogo
corrente rimane consultabile come risultato temporaneo, ma quelle righe non
entrano nello specchio o nella coda dell'account. Dalla prossima attività si
usa l'archivio dell'account; il no non viene domandato di nuovo a ogni vista.
Con zero righe e nessun punteggio si salta la domanda.

### 5.2 Email già registrata

Solo il `409` della rotta registrazione con `errore: 'email_registrata'`
(P-11) produce: **«Questa email è già registrata.»** Poi «Accedi per conservare
le risposte di questa pagina, oppure reimposta la password se non la ricordi.»
Azioni «Accedi» e «Reimposta la password», con email già compilata e password
non trasferita fra moduli; «Torna al riepilogo». Non apre una sessione e non
dice «ti abbiamo scritto». Le righe rimangono in memoria. Il `409` delle righe
è un altro caso (§10), mai un messaggio sull'email.

### 5.3 Recupero e cambio password

«Reimposta la password», campo Email e «Chiedi il link». Dopo `202`:
«Se questo indirizzo è iscritto, riceverai una mail da Rotta Giusta. Il link
vale un'ora. Se dopo cinque minuti non la trovi, controlla lo spam.»
Non garantire che la mail sia partita: la rotta protegge l'iscrizione anche
quando il fornitore rifiuta. «Torna all'accesso» e, dopo l'attesa consentita,
«Chiedi un altro link». Il mittente è quello effettivo del §9.4 del progetto
account, da verificare nella mail reale, non un indirizzo inventato qui.

Link `#password`: modulo «Scegli una nuova password», stesse regole e
accessibilità della registrazione; `POST /v1/password/nuova`. `410`:
«Questo link è scaduto o è già stato usato. Chiedi un nuovo link per
reimpostare la password.» `422` conserva il gettone in memoria e permette
di correggere la password. Successo: «Password aggiornata. Le sessioni
precedenti sono state chiuse», poi identità e scelta sulle righe della pagina.
La sessione nuova restituita dal server è consumata, non simulata dal client.

Se `confermato_ora` è vero e ci sono righe preesistenti sul server, prima
di unirle alle risposte correnti: «Questo account non era confermato e
contiene {N} risposte. Vuoi tenerle o cancellarle?» Azioni «Tienile» e
«Cancella queste risposte», nessuna cancellazione predefinita. Le date si
mostrano soltanto se disponibili dalle righe ricevute; `GET /v1/io` fornisce
il numero, non la data di registrazione delle risposte. Cancellare usa
`POST /v1/azzera` con password e conferma esplicita, poi la generazione
nuova; le righe anonime restano separate fino alla loro scelta.

Da Account, «Cambia password»: Attuale e Nuova, POST dedicato; successo e
chiusura delle altre sessioni come §6.3 del progetto account.

## 6. Verifica dell'email

Dal primo esito autenticato non verificato, sopra le attività e nel pannello
Account: **«Conferma {email} entro il {data e ora}. Se non lo fai, l'account
e tutte le sue risposte saranno cancellati. Nel frattempo puoi allenarti,
salvare e vedere i Progressi.»** La data deriva da `scade_se_non_verificata`,
non da sette giorni aggiunti dall'orologio del browser.
Se manca quel campo, dire che la scadenza non è disponibile e rileggere
l'account; non omettere l'avviso con un falso stato normale.

Azioni «Rimanda la mail» e «Ho confermato: verifica lo stato» (GET io).
`202` al rinvio: «La mail di conferma è stata inviata. Il link vale 24 ore.
Usa l'ultimo link ricevuto. Se dopo cinque minuti non trovi la mail di Rotta
Giusta, controlla lo spam.» `503`: messaggio di mail non spedita, nessuna
frase di successo. `429`: attesa dichiarata. Rinviare non cambia i sette giorni.
Prima della verifica, cambio email indisponibile con spiegazione «Conferma
prima l'indirizzo attuale»; le altre attività restano aperte.

All'apertura di `/app#verifica=<gettone>` o `#password=<gettone>` leggere il
gettone in memoria e rimuovere subito il frammento con `history.replaceState`,
prima di richieste o rendering ordinario. Mai localStorage, cache o log.
Verifica: `POST /v1/verifica`, `200` → «Email confermata», poi rileggere io;
un link di verifica non equivale a un accesso. Se manca la sessione, offrire
«Accedi». Se la scheda contiene un account diverso, non cambiare identità
né fondere archivi per effetto del link.

`410`: «Il link è scaduto o è già stato usato. Se l'email non è ancora
confermata, entra nel tuo account e chiedi una nuova mail.» Se io dice già
verificata, mostrare quello stato senza inventare un errore dell'account.
Offline: «La conferma richiede la rete. Lascia aperta questa pagina e
riprova quando sei online»; gettone solo in memoria, «Riprova». Un esito perso
si risolve anche rileggendo io. Nessun blocco del runner già aperto.

## 7. Passaggio del vecchio archivio

Leggere entrambe le fonti: IndexedDB `open-patente-nautica` e fallback
`pn.archivio`. Non usare soltanto `S.archivio`, né creare un database vuoto
durante una ricerca per poi scambiarlo per un archivio trovato. Se entrambe
contengono righe, unione per uid tramite il motore; conservare originali e
scarti per il download. Gli uid uguali con contenuti diversi richiedono
diagnostica e conservazione delle fonti: non scegliere un vincitore in pagina.
Rileggere le fonti persistenti prima di download e trasferimento, per includere
le righe che un'altra scheda vecchia ha scritto nel frattempo.

Primo avviso nel Percorso, dopo eventuali errori urgenti:
«In questo browser ci sono {N} risposte salvate prima degli account. Da questa
versione, senza account non si salva più niente. Portale nel tuo account,
oppure scaricale.» Azioni **«Registrati o entra e portale»**, **«Scarica il
file»**, «Più tardi». Più tardi nasconde solo nella pagina aperta. Non aggiunge
un flag anonimo persistente. Info conserva la porta anche dopo il rinvio.

Il trasferimento passa da autenticazione e domanda sulla destinazione,
mostrando email e quantità; se ci sono anche risposte correnti, le due fonti
sono indicate separatamente, senza doppioni nei dati uniti dal motore.
Segue §8. Il download prima dell'account è locale e non richiede rete.
Le vecchie data/preferenze/punteggi non diventano silenziosamente quelli
dell'account: proporre esplicitamente data e Segnali, trattare i filtri come
preferenze nuove dell'account. Il solo vecchio archivio non rende autenticati.

Segno di trasferimento soltanto dopo conferma di tutti gli uid, senza scarti:
numero, chiave locale di destinazione, data e manifest degli uid trasferiti.
Il manifest permette di rilevare nuove righe vecchie anche a conteggio uguale;
nessuna seconda contabilità delle risposte. Il segno è metadata della
migrazione autorizzata con account, non una preferenza scritta durante la
prova. Se la sua scrittura fallisce, l'avviso resta e lo dichiara; ripetere il
trasferimento è idempotente. Per un altro account non si dà per trasferito a lui.

Info: «{N} risposte portate nel tuo account il {data}». Il database vecchio
resta. «Cancella la copia precedente da questo browser» richiede conferma
con le fonti che saranno cancellate; eventuali righe nuove o scartate
richiedono prima download o scelta esplicita di perdita. Una lettura fallita
impedisce la cancellazione. Scaricare non cancella e non finge un trasferimento
server. Senza account l'eventuale rimozione della copia vecchia è una scelta
esplicita dopo download, mai un effetto dell'apertura del sito.

Su `.pages.dev` niente API: «Le risposte sono in questo browser sul vecchio
indirizzo. Scarica il file e caricalo nel tuo account su rottagiusta.it.»
Non tentare di leggere storage di un'altra origine. Il redirect e la sua data
rimangono il lavoro di migrazione hosting, non un'azione di questo client.

## 8. Conversione di un file esportato

Porta «Importa un file dei progressi» nel Percorso e in Info. Senza account
spiega «Per conservare le risposte del file, crea un account o accedi» e offre
le due azioni; il file scelto resta solo in memoria e non parte prima della
scelta. Annullare lascia inalterati file, risposte correnti e archivio vecchio.
Con account si legge nel browser, conservando il formato storico di
`importa()` e usando `fondiArchivio(..., { quesiti })` per validazione e unione:
`quesiti` è l'insieme degli id delle banche quiz e carteggio caricate.
Il chiamante esistente `importa()` scrive oggi archivio e Segnali: va adattato
per separare lettura/anteprima dalla conferma, senza eseguirne prima gli
effetti persistenti. Non
filtrare sul campo `app`; i vecchi nomi sono validi. Lo specchio non si importa.

Anteprima: nome file, email di destinazione, conteggi del motore per nuove,
già presenti e scartate con motivi; «Importa nel mio account» e «Annulla».
«Carica soltanto un file di progressi che ti appartiene.» Il file non contiene
una prova di proprietà. JSON illeggibile o formato non valido: «Non riusciamo
a leggere questo file di progressi. Scegli un file esportato da Rotta Giusta»,
senza mutare l'archivio. Le righe di tag N/L/C senza data sono valide secondo
`validaRiga()`: non aggiungere una regola di data nella pagina.

Invii preparati solo da `lottoDaInviare`: al più 2.000 righe e 2 MiB per corpo,
non semplici fette da 2.000. «Importazione in corso: {confermate} di {valide}
righe confermate dal server»; le scartate restano visibili separatamente.
Un ritento non somma di nuovo gli stessi uid ai conteggi di esito. Il riepilogo
unico finale separa scarti locali e scarti server senza contare due volte una
riga: «{nuove} nuove · {gia} già presenti · {scartate} scartate», con motivi
raggruppati e «Scarica le righe non importate». Non ricopiare la contabilità
del motore per decidere cosa è ancora da inviare. Se occorre un risultato
aggregato non esposto dal motore, chiederne l'export a Claude (§12).

La copia per account conserva righe e coda insieme, così una ricarica riprende
l'invio. I rifiuti locali restano scaricabili: non spariscono dopo l'anteprima.
Errore rete/401/conflitto segue §§9–10; la fonte originale non si cancella.
Importare due volte produce soltanto già presenti, senza alterare lo specchio
con una contabilità parallela.

`segPunti` è una parte distinta del trasferimento, inviata al profilo: il
server fonde per massimo di `migliore` e `giocate` per modo. Non chiamare il
vecchio ramo di `importa()` che somma `giocate`. Dichiarare «Le partite dei
Segnali usano il massimo tra i dispositivi: le partite svolte in parallelo
non si sommano». Il riepilogo dice separatamente se i punteggi sono stati
confermati; un fallimento del profilo non fa ripetere le righe già accolte.
P-11 ha reso disponibile questo contratto e l'export completo (§1).

Lo stesso contratto vale per le partite nuove dei Segnali con account:
il risultato aggiorna la copia del solo account corrente, si invia al profilo
quando c'è rete e resta dichiarato «Punteggi da inviare» fino al PUT riuscito.
Offline la copia e il bisogno di invio sopravvivono alla ricarica nell'archivio
dell'account; al ritorno della rete si rimandano i valori, che il server fonde
per massimo. Non sono righe da infilare nella coda delle risposte e non
si sommano in pagina i contatori ricevuti da altri dispositivi. I punteggi
si leggono da `segnali` nella descrizione dell'account (§1).
Una uscita con punteggi non confermati offre download e scelta di perdita
come per le risposte; un file di recupero include anche `segPunti`.

## 9. Contratti con motore, archivio e trasporto

### 9.1 Una sola contabilità

| Passaggio | Chiamata e consumo della pagina |
|---|---|
| Validare e unire | `validaRiga(riga, opt)` / `fondiArchivio(presenti, importate, opt)`; mostrare `nuove`, `gia`, `scartate`, `motivi`; conservare le fonti rifiutate. |
| Coda iniziale | `nuovaCoda({generazione, epocaDb, righe})`; valori server, non generazione inventata. |
| Nuova risposta | Salvare riga e risultato di `accoda(coda, uid)` insieme. |
| Preparare invio | `lottoDaInviare(righe, coda)` restituisce corpo completo oppure `null`. |
| Risposta all'invio | `dopoInvio(codaCorrente, lottoCongelato, {codice, corpo}, archivioCorrente)`; salvare la coda restituita e presentare `salvate`, `scartate`, `conflitto`, `epocaCambiata`. |
| Ricevere | GET con `coda.cursore`, poi `dopoRicezione(codaCorrente, {codice, corpo}, archivioCorrente)`; persistere `righe` per uid e nuova coda insieme; proseguire se `continua`. |
| Conflitto scelto | `risolviConflitto(coda, conflitto)` soltanto dopo §10; svuotare copia precedente e ricevere da zero. |
| Trasferimento | `nuovoTrasferimento`, `registraEsito`, `riepilogoTrasferimento` (P-28): §9.3. |
| Righe che non partono | `nonInviabili(righe, coda)` quando `lottoDaInviare` restituisce `null` con la coda non vuota (P-28): §9.3. |
| Specchio | `ripiega()` dall'archivio risultante dopo ogni import/ricezione, mai salvato o inviato. |

`codaCorrente` si rilegge alla conferma, non è la copia di inizio fetch:
una risposta data mentre l'invio è in corso deve restare in coda. Il lotto
resta congelato. Persistenza atomica e rilettura nella transazione impediscono
che due schede si sovrascrivano la coda; la rete non occupa una transazione
IndexedDB aperta. Le risposte tardive dopo uscita/cambio account sono ignorate
per identità e ciclo di accesso, senza scrivere nel nuovo archivio.

L'uscita avvisa le altre schede della stessa origine, per esempio tramite
`BroadcastChannel`, senza usare uno storage anonimo come bus. Ogni scheda
ferma invii e runner dell'account, chiude la connessione al database e pulisce
la memoria privata; non accoda altre risposte dopo l'uscita. Prima di ripartire
al ritorno in primo piano o dopo un riaccesso, rileggere io e confrontare la
chiave locale. Il cookie è condiviso fra schede: un cambio a B non autorizza
una scheda rimasta su A a inviare con il cookie nuovo. Il cambio account
attende l'arresto delle catene e la pulizia di A; se una scheda impedisce la
chiusura, chiedere di chiuderla e riprovare, senza dichiarare uscita completa.
C-06 e C-15 devono esercitare anche questa corsa, non solo ignorare la
risposta tardiva: l'invio sbagliato sul server sarebbe già un danno.

La pagina non modifica direttamente `daInviare`, `scartate`, `cursore`,
`generazione` o `epocaDb`. `ultima_seq` di POST e GET io non sposta il cursore.
Un'epoca cambiata richiama il recupero deciso dal motore, con ricezione da
zero e reinvio; non si confonde con l'azzeramento volontario della generazione.
`lottoDaInviare === null` con coda ancora pendente è un'anomalia visibile:
«Ci sono righe che non riusciamo a inviare. Scaricale e riprova», niente
«tutto salvato». Quali righe e perché lo dice `nonInviabili()` (§9.3); la
pagina non spezza e non modifica la riga.

### 9.2 Persistenza e origini

Account: `rg-account-<chiave_locale>` per righe, coda e metadata offline;
preferenze del dispositivo associate alla stessa chiave. La chiave casuale
non è una credenziale e non si ricava dall'email. Password e cookie non sono
letti o conservati dalla pagina. L'identità offline si riusa solo per l'account
già entrato su quel dispositivo; non si sceglie il primo database trovato.
Un accesso di B non importa la copia di A, neppure se A ha una coda pendente.

Senza account: nessuna nuova scrittura di dati della persona in IndexedDB,
localStorage, sessionStorage, cookie o Cache Storage; filtri, `pn.auto`,
`pn.segModo`, `pn.diagOrdine`, `pn.prep`, `pn.esame` e `pn.segPunti` in memoria.
Le vecchie chiavi sono fonti di migrazione protette, non preferenze da
continuare ad aggiornare. Restano la cache del sito/banca e la copia vecchia
da gestire; la cache può essere installata/aggiornata dal service worker,
ma non contiene risposte o risultati API. Il download volontario è un file
scelto dalla persona, non una conservazione automatica del sito.

Se la copia account non si può scrivere, non mostrare «salvato sul dispositivo»
e non ripiegare su `pn.archivio`. «Non riusciamo a conservare le nuove risposte
in questo dispositivo. Non chiudere la pagina finché l'invio non è confermato,
oppure scaricale.» Con rete l'invio può confermarle sul server; offline
rimangono soltanto in memoria. Il fallimento non spegne il pallino di Info.

API solo sull'origine di produzione e sulla configurazione locale prevista
dal progetto account. Fetch con `credentials: 'include'`, JSON per mutazioni;
nessun token client alternativo al cookie. API mai nel guscio offline né nella
cache del service worker. Nessuna richiesta autenticata automatica sulle
origini escluse. Errori non JSON o risposte mancanti sono errori di trasporto,
non successi. Timeout interrompe l'attesa e permette il ritento idempotente,
senza cancellare il lotto. Timeout di trasporto: **15 secondi**, dopo i quali
«Il server non ha risposto. Le risposte sono ancora qui: riprova l'invio»;
non è una prova che la richiesta non sia stata accolta.

### 9.3 Trasferimenti e righe che non partono (P-28)

Il §12 chiedeva al motore due risultati, «se i risultati esistenti non
bastano». **Non bastavano**, ed è stato misurato sulle sei funzioni di P-10
prima di aggiungerne: «salvata» dedotta come «uid del trasferimento meno
`daInviare` meno `scartate`» dà per salvate **tutte** le righe dopo un
azzeramento scelto con `risolviConflitto()`, che svuota la coda mentre il
server le ha tolte; e dà per salvata una riga mai messa in coda. E una riga
che da sola supera il limite, in testa alla coda, faceva restituire `null` a
`lottoDaInviare()` con tre righe in coda: le altre non partivano mai. Il
motore ha quindi quattro funzioni in più, e `lottoDaInviare()` salta la riga
troppo grande invece di fermarsi (R-ACC-39 e 40).

**Un trasferimento** è un insieme di righe da portare per intero nell'account:
le righe della pagina alla registrazione (§4.3) o dopo «Sì, portale» (§5.1),
un file convertito (§8), l'archivio di prima degli account (§7). È un oggetto
semplice, da salvare con la coda. Registra le conferme **per nome**, con la
generazione e l'epoca del database in cui sono state date.

| Funzione | Che cosa fa |
|---|---|
| `nuovoTrasferimento(coda, righe, opt)` | Passa ogni riga da `validaRiga(riga, opt)`: le rifiutate restano in `trasferimento.rifiutate`, `[{ riga, motivo }]`, per scaricarle. Le altre vanno in coda anche se ne erano uscite, perché l'assenza dalla coda non prova che siano sul server: rimandata, una riga che c'è torna «già presente». Le scartate dal server non ripartono. Restituisce `{ trasferimento, coda }`. |
| `registraEsito(trasferimento, esito)` | Con l'esito di `dopoInvio()` o di `dopoRicezione()`: gli uid nominati — `salvate` o `righe` — diventano confermati; un `conflitto` si ricorda; con un'epoca diversa valgono solo le conferme di questo esito. |
| `riepilogoTrasferimento(trasferimento, coda, righe)` | `{ stato, completo, righe, confermate, daInviare, bloccate, scartate, daVerificare, nonSalvate, motivi, conflitto }`. |
| `nonInviabili(righe, coda)` | `[{ uid, motivo }]`: «oltre il limite di un invio» (con `byte`) e «senza riga nell'archivio». |

Gli stati di `riepilogoTrasferimento`, e che cosa ne fa la pagina:

| `stato` | Significa | La pagina |
|---|---|---|
| `completo` | Ogni riga nominata dal server, niente scartato | «{`confermate`} risposte salvate nel tuo account». È l'unico stato che lo permette. |
| `in corso` | `daInviare` righe da ritentare | «Non chiudere la pagina: le risposte non sono ancora salvate nel tuo account.», «Riprova l'invio» (§4.3). |
| `da verificare` | Niente da ritentare, ma `daVerificare` uid non sono in coda e il server non li ha nominati: li ha inviati un'altra scheda, o un ripristino ha tolto valore alle conferme | Una ricezione (`GET /v1/righe`) li conferma; non scrivere «salvate» prima. |
| `con scarti` | Tutto ciò che poteva arrivare è arrivato, e `nonSalvate` righe no | «{`confermate`} risposte salvate · {`nonSalvate`} righe non salvate», `motivi`, download di `rifiutate`, `scartate` e `bloccate` (§4.3). |
| `sospeso` | Un `409` aspetta la scelta | §10, «Generazione diversa». |
| `annullato` | La generazione è cambiata: i progressi sono stati azzerati, anche le righe confermate prima | `confermate` è 0: nessun «salvate». |

**Esempio d'uso**, la registrazione alla fine di un'attività (§4.3); il
trasporto e la persistenza sono della pagina, qui abbreviati:

```js
// 201 (o 503 con account creato): generazione ed epoca dalla descrizione.
let coda = E.nuovaCoda({ generazione: io.generazione, epocaDb: io.epoca });
let t;
({ trasferimento: t, coda } = E.nuovoTrasferimento(coda, righeDellaPagina));
salva({ archivio, coda, t });                       // insieme, atomico (§9.1)

for (let lotto; (lotto = E.lottoDaInviare(archivio, coda)); ) {
  const risposta = await invia(lotto);              // { codice, corpo }; codice 0 senza rete
  const esito = E.dopoInvio(rileggiCoda(), lotto, risposta, archivio);
  coda = esito.coda; t = E.registraEsito(t, esito);
  salva({ coda, t });
  if (esito.conflitto || risposta.codice !== 200) break;   // §10, o riprova su richiesta
}
const r = E.riepilogoTrasferimento(t, coda, archivio);
if (r.completo) mostra(`${r.confermate} risposte salvate nel tuo account`);
else if (r.stato === 'da verificare') ricevi();     // poi registraEsito(t, dopoRicezione(...))
else mostraNonSalvate(r);                           // in corso, con scarti, sospeso, annullato
```

Con un file (§8) cambia solo l'origine delle righe: `fondiArchivio` le mette
nell'archivio dell'account e ne dice i conteggi all'anteprima;
`nuovoTrasferimento(coda, righeDelFile, { quesiti })` le accoda e tiene le
rifiutate con la stessa regola. Un trasferimento risolto o abbandonato con una
scelta esplicita si butta; fino ad allora si conserva con la coda, così una
ricarica non trasforma «in corso» in «salvato».

## 10. Sincronia, uscita e azzeramenti

Inviare dopo ogni risposta, con ritardo di raccolta **500 ms**, all'apertura,
al ritorno della rete e prima dell'uscita. Una catena di invii per scheda;
ricevere all'apertura e dopo gli invii fino a `continua === false`. Il numero
500 è una scelta di trasporto, non una regola di coda. Due schede possono
inviare gli stessi uid: l'idempotenza del server resta la garanzia. Quando
arrivano righe, ridisegnare proposta e Progressi dallo stesso nuovo specchio;
la lista del runner aperto rimane congelata.

Stati in Account/Info: «Invio in corso», «{N} risposte da inviare»,
«Le risposte di questo dispositivo sono confermate sul server» soltanto
senza pendenti/scarti, oppure «{N} righe non accolte dal server» con motivi e
download. I conteggi leggono il risultato/stato del motore, non un secondo
insieme locale di uid. Non chiamare salvati i punteggi o la data se il loro
PUT è ancora pendente.

**Uscita:** «Esci» tenta l'invio. Con pendenti o scarti: «{N} risposte non
sono sul server. Collegati alla rete e riprova, oppure scaricale prima di
uscire». Azioni «Riprova l'invio», «Scarica le risposte non salvate», «Resta
qui». Dopo il download, scelta esplicita «Ho conservato il file: esci e
cancella la copia da questo dispositivo». Non dedurre che il file sia al
sicuro soltanto perché è stato avviato il download.
Con niente da preservare: POST uscita → `204` → chiudere transazioni/connessioni,
cancellare database account, preferenze e metadata d'identità, memoria e
riscontri privati; tornare al Percorso in prova vuota. La copia vecchia è
un'altra fonte e non viene cancellata dall'uscita.

Senza rete il server non può revocare il cookie HttpOnly: «Per uscire
dall'account serve la rete. Puoi scaricare le risposte e restare qui; non
lasciare il dispositivo condiviso finché l'uscita non è confermata.» Nessun
falso «sei uscito». `401` all'uscita indica sessione già non valida: dopo
la scelta sulle righe, pulizia locale. Un errore di cancellazione locale
impedisce il messaggio di uscita completa: «L'accesso è chiuso, ma la copia
su questo dispositivo non è stata cancellata. Chiudi le altre schede e
riprova», mantenendo il controllo di pulizia. «Esci da tutti i dispositivi»
usa la sua rotta e applica le stesse cautele su questo dispositivo; gli altri
scoprono la revoca con `401`, non con una pulizia remota inventata.

**Generazione diversa:** il risultato `conflitto` del motore sospende invii
e ricezioni. «Il {data} i progressi sono stati azzerati da un altro
dispositivo. Qui ci sono {nonSalvate} risposte non salvate. Scaricale oppure
scegli di scartarle prima di caricare il nuovo archivio.» Data solo se presente,
altrimenti «I progressi sono stati azzerati da un altro dispositivo».
Azioni «Scarica e passa al nuovo archivio», «Scarta e passa al nuovo archivio»,
«Decidi più tardi»; download richiede la conferma di aver conservato il file,
scarto una conferma di perdita. Con zero pendenti dichiarare comunque che
la copia precedente verrà sostituita e chiedere «Carica il nuovo archivio».
Solo dopo la scelta usare `risolviConflitto`, svuotare copia e ricevere da zero.
Un `401` congela la coda: rientrando nello stesso account la si riprende,
entrando in un altro non la si trasferisce.

Da Account: «Azzera i progressi» e «Cancella l'account» hanno password,
descrizione di ciò che cancella la rotta e conferma esplicita, download prima
dell'azione e gestione delle righe pendenti. Azzerare usa la generazione nuova;
cancellare con `204` applica la pulizia di uscita. «Cambia email» usa la rotta
dedicata solo da verificati: indirizzo attuale resta quello di io finché il
server non conferma il nuovo; nessuna rinomina del database locale.

## 11. Onboarding, data e testi pubblici

### 11.1 Un passo dopo la conservazione delle risposte

Dopo la registrazione e il primo trasferimento risolto, titolo «Hai una data
d'esame?»; campo «Data d'esame (facoltativa)»; «Puoi aggiungerla quando la
conosci. Puoi allenarti anche senza una data.» Azioni «Salva la data» e
«Continua senza data». Il salto è immediato, non un campo obbligatorio o
una data precompilata. Con data temporanea o vecchia disponibile proporla
indicando l'origine, senza salvarla prima del click. Il normale accesso a un
account esistente non ripete questo passo né cancella la data già sul server.

`PUT /v1/profilo` con la data; vuoto/rimozione → `data_esame: null`, mai oggi
come ripiego. Validazione server e testi di Area 1 §6.3, anche per data passata.
Successo «Data salvata»; errore «La data non è stata salvata. Riprova oppure
continua senza cambiarla», valore del server ancora distinto dalla bozza.
Offline la bozza resta tale e dichiarata; non promettere aggiornamento remoto
né introdurre una nuova coda profilo nel motore delle risposte. In Account e
Percorso la data è modificabile/rimuovibile dalla stessa rotta.
Per chi prova, il controllo facoltativo dice «Questa data vale soltanto per
la pagina aperta»; non abilita viste di storico o un piano promesso.

Nessuna fase di preparazione, obiettivo giornaliero, numero di ore o consiglio
di piano aggiunto: Q-ONBOARD richiede una decisione dell'autore nella specifica.
Questo non impedisce di implementare il passo minimo già deciso.

### 11.2 Sostituzioni nella stessa versione degli account

La ricerca va ripetuta per frasi nel codice alla realizzazione: le righe del
§1 di `prossime-sessioni.md` sono un indice datato. Sostituire anche entrambe
le copie di «Come funziona», meta description/OG e commenti falsi.

| Luogo | Testo/contratto nuovo |
|---|---|
| Hero e metadata vetrina/palestra | «Gratis e open source. Prova quiz e carteggio senza account; crea un account per salvare i progressi.» |
| Pregio vetrina | «Prova senza account» — «Tutte le attività sono disponibili. Senza account non conserviamo risposte o preferenze.» |
| Spunte vetrina | «Nessuna newsletter e nessun cookie di tracciamento.» Offline: «Puoi provare offline dopo aver caricato il sito. Con un account già aperto su questo dispositivo, salvi qui e invii quando torna la rete.» |
| Come funziona, entrambe le copie | «Non serve un account per provare. Senza account le risposte e le preferenze valgono solo finché questa pagina resta aperta. Con l'account salvi sul server e vedi i Progressi.» |
| Percorso, conservazione | In prova, §4.1; con account «Le risposte si conservano nel tuo account e in questo dispositivo per l'offline. Controlla lo stato dell'invio in Info.» Gli errori prevalgono sulla promessa. |
| Info, Archivio | Fonte corrente, coda/scarti e motivi; export server, import, vecchio archivio e impostazioni nello stesso luogo. Non dire che non esiste un server o che tutto rimane soltanto nel browser. |
| Privacy | Due stati, cache/offline e copia vecchia; dati account e onboarding, server in chiaro, lettura per supporto/statistiche, cookie tecnico, contratto art. 6.1.b, export/cancellazione/due anni con avviso. Contatto `privacy@rottagiusta.it`; dati in Polonia, copie nei Paesi Bassi, fornitore e titolare effettivi dal §15.4 del progetto account. Gate legale e operativo del rilascio, non un testo giuridico approvato da questa sessione. |

Download ordinario con account: `GET /v1/esporta`, dopo tentativo di inviare
i pendenti. Se restano, dire «Il file del server non contiene ancora le {N}
risposte da inviare» e offrire anche il download locale di recupero, nominato
come tale. Non spacciare `S.archivio` per export completo del server. Senza
account il download volontario riguarda soltanto la pagina o la copia vecchia,
con quelle etichette. Link interni `/privacy` e `/avvertenza`, senza `.html`.
README, skill e specifica restano il lavoro di Claude su main nella versione
degli account; qui non si riscrivono.

## 12. Controlli richiesti e accettazione

Le suite del motore/server provano logica e API, non il DOM, storage e rete
del client. **Claude su main aggiunge i controlli elencati qui**, usando un
browser reale per i flussi e storage e risposte API controllabili per i guasti;
le verifiche statiche da sole non coprono questi requisiti. La realizzazione
su `ui/*` esegue i controlli e il collaudo visivo. Nessun test viene scritto
in questa sessione documentale.

La verifica documentale confronta inoltre ogni collegamento locale con un
file esistente e ogni firma citata con il motore della base. Le nuove
schermate non hanno screenshot in P-13 perché non esistono ancora.

| Caso/controllo da aggiungere | Esito obbligatorio e requisito |
|---|---|
| C-01, nuovo browser, rete presente e offline con guscio caricato | Primo quesito senza account; tutte le attività complete, stop parziale, riepilogo e revisione. R-ACC-01/04. |
| C-02, prova con tutte le attività e tutti i controlli preferenze | Avviso prima e dopo; nessuna scrittura personale in IDB/local/sessionStorage/cookie/cache, nessun invio righe. Ricarica senza risposte, data o punteggi. Cache del sito resta. R-ACC-02/09. |
| C-03, visite fra viste e fine attività | Invito soltanto nei riepiloghi, niente popup o obbligo; Progressi storici assenti, revisione presente. R-ACC-03/04. |
| C-04, registrazione dopo più attività, doppio click e perdita risposta HTTP | Uno snapshot completo, trasferimento prima di onboarding; successo solo per uid confermati; verifica io prima del ritento. R-ACC-06/13. |
| C-05, duplicato email | `409`, testo e due porte, zero sessioni/mail nuove; risposte correnti intatte. R-ACC-30, parte API di P-11 e parte DOM da aggiungere. |
| C-06, accesso con sì/no su dispositivo condiviso | Soltanto le righe autorizzate entrano nell'account; A e B isolati, niente import della coda di A in B. R-ACC-06/09. |
| C-07, mail rifiutata, rinvio, link validi/usati/scaduti, altra scheda | `503` non dice mail spedita; account creato salva; scadenza server visibile subito e fino alla conferma. Frammento rimosso, gettone mai persistito. R-ACC-11/21/29. |
| C-08, password corta/comune, incolla/autofill, 401/403/429 e recupero | Motivo e azioni corretti; stessa frase di accesso per email assente; richiesta recupero sempre condizionale; link 1 ora, scelta delle righe di account appena confermato. R-ACC-10/17/25/27/28/29. |
| C-09, archivio vecchio reale, soltanto fallback, entrambe le fonti, lettura fallita | Download e trasferimento completi senza perdita o cancellazione implicita; più tardi non persistente; segno solo a conferma completa; nuove righe riaccendono avviso. R-ACC-05/07/08. |
| C-10, file vecchio/nome app precedente, tag senza data, uid doppi, scarti e Segnali anche offline | Anteprima e unico riepilogo verificabili; reimport idempotente; massimo Segnali, punteggi pendenti dopo ricarica e uscita protetta, scarti scaricabili. Nessuna validazione UI alternativa. R-ACC-06/07/08/18. |
| C-11, risposta aggiunta durante fetch, due schede e reload durante import | Riga e coda atomiche; la risposta tardiva resta da inviare; uid nominati soltanto vengono tolti; nessun doppione. R-ACC-12/13. |
| C-12, lotto per byte, riga oltre limite, 413 e ricezione oltre 5.000 | Corpi dal motore nei due limiti; guasto leggibile, nessun falso completamento; tutte le pagine ricevute; POST e io non spostano cursore. R-ACC-14/31/32/33. |
| C-13, azzeramento altrove scoperto in invio e sola ricezione | Congela, chiede, conserva fino alla scelta, poi svuota e riparte; niente reinserimento automatico. R-ACC-15, manca il controllo dell'interazione oltre a motore/server. |
| C-14, ripristino server con nuova epoca | Il client chiama il motore con archivio intero, reinvia le righe perse e le riceve su altro dispositivo. R-ACC-24, manca il collegamento reale del client al controllo già esistente. |
| C-15, uscita normale/pendenti/scarti/offline/401/cancellazione IDB bloccata | Nessuna perdita implicita o falso logout; dopo uscita copia e preferenze account assenti; altra scheda e risposta tardiva non le ricreano. R-ACC-09/13/26. |
| C-16, data vuota/salto/importata/passata, PUT fallito | Onboarding dopo salvataggio, nessuna data obbligatoria/default, bozza distinta dal server; Q-ONBOARD non attuato. R-STA-01 e §2.4. |
| C-17, export con pendenti e origini escluse | Server export completo dichiarato, pendenti a parte, vecchio dominio download locale; niente API/cookie/cache personale su origine esclusa. R-ACC-18. |
| C-18, ricerca testi per i due stati | Tutte le frasi del §11.2 e del §1 della coda coerenti nello stesso rilascio, inclusi metadata e copie dinamiche; privacy passa il gate dell'autore. R-ACC-02/09. |

R-ACC-12…14/18/31…33 e R-ACC-24 hanno già controlli di motore/server: quelli
sopra ne provano il consumo da parte della pagina. R-ACC-11 prova già la
cancellazione server, non la scadenza scritta sullo schermo. R-ACC-16 e 20
(segreti server e ripristino della copia) restano controlli server esistenti,
da rieseguire; non diventano funzioni da ricostruire nel client. R-ACC-26
richiede anche riaccesso dopo scadenza senza perdita locale.

**Contatti da risolvere su main prima del codice che ne dipende — chiusi.**
Il riepilogo di un trasferimento su più lotti e le righe non inviabili sono
nel motore (P-28, §9.3, R-ACC-39 e 40); il contratto di profilo, Segnali,
lettura dei punteggi e codice dell'email già registrata è quello di P-11 (§1).
Claude aggiunge export/test dove servono; non si cambia la regola nel client
per aggirare un contratto mancante. L'unione di uid identici con payload
diversi nelle due fonti vecchie va esercitata preservando i file originali.

### Il banco (P-29, 26 settembre 2026)

**La misura.** Prima del codice, le strade per guidare un browser vero dalla
suite senza aggiungere una dipendenza, provate sul Mac con script da buttare:

| Strada | Regge? | Che cosa costa, misurato | Che cosa non copre |
|---|---|---|---|
| **Chrome headless con il suo protocollo (CDP) su una pipe**, `--remote-debugging-pipe` | **sì** | Chrome 153. Risponde 0,33 s dopo l'avvio, primo carico a 0,45 s. Lo script di misura — cookie, IndexedDB, localStorage, sessionStorage e Cache Storage letti da fuori, service worker che controlla la pagina, ricarica offline servita dalla cache, due schede con `BroadcastChannel`, una risposta dell'API sostituita — gira in 2,6 s, identico con Node 25.3 e 24.21 | solo Chromium; vedi sotto |
| Lo stesso protocollo sul WebSocket, `--remote-debugging-port=0` e il `WebSocket` globale di Node | sì | 0,34 s con Node 25.3, 0,36 con 24.21 | come sopra, più una porta aperta sulla macchina e il file `DevToolsActivePort` da aspettare: nessun vantaggio sulla pipe |
| Firefox 156 headless, WebDriver BiDi sul WebSocket | **non misurato** | non parte: quattro tentativi — profilo temporaneo, `-profile`, profilo nella cartella di lavoro, fuori dal sandbox dei comandi — danno tutti «Could not find profile folder». Non indagato oltre | — |
| Safari 27, `safaridriver` | **no, senza un passo dell'autore** | `session not created`: serve «Allow remote automation» nelle impostazioni sviluppatore di Safari, un'impostazione del sistema che una sessione non cambia. E WebDriver classico non legge lo storage né emula l'offline, e apre una finestra vera | — |
| La pagina che esegue il test e manda l'esito con una POST (il tentativo di P-34, in quarantena) | in parte | nessun protocollo, solo Chrome e l'HTTP di Node | la pagina controlla sé stessa: storage, cookie, offline e ricarica si vedono solo da dentro, cioè con gli strumenti della cosa sotto esame |

**Scelta la prima.** Misurato anche, e serve al §16.3 del progetto degli
account: in Chrome il cookie `__Host-rg`, `Secure`, arriva e torna fra
`http://localhost:<sito>` e `http://localhost:8620` con `credentials: 'include'`;
un contesto isolato (`Target.createBrowserContext`) non vede né i cookie né
IndexedDB di un altro, quindi è un «nuovo browser» e ne servono molti con un
Chrome solo.

**Com'è fatto.** `tests/browser.mjs` pilota Chrome; `tests/client_account.mjs`
serve il sito come l'host, con `/app` sostituita dalla pagina sotto esame,
avvia il server degli account vero (`server/server.mjs`) sulla porta 8620 con
l'orologio, la posta e Argon2id economico passati da lì, e crea l'account che
C-05 trova già iscritto; `tests/test_interfaccia.py` riconosce il regime e
chiama il banco una volta per tutta la suite. **Due regimi**, con il meccanismo
di P-06: la pagina che dichiara `function indirizzoApi(` ha il client e passa i
controlli del progetto; quella che non la dichiara è la pagina di oggi, che
deve mantenere la promessa di oggi — la risposta resta nel browser e torna dopo
una ricarica — senza frasi o rotte del client. Finché P-18 non c'è, il regime
progettato gira su `tests/pagina-client-account.html`, su ventiquattro rotture
di quella pagina (`ROTTURE_CLIENT`; ventitré da P-29, una da P-38), ognuna rossa
e con il difetto nominato, e su una variante che deve restare verde
(`VARIANTI_CLIENT`, P-38).
**Il regime attuale ha una scadenza:** lo toglie la regia quando integra P-18.

**Il contratto che la pagina deve rispettare**, perché il banco la guida:

- gli agganci del runner di oggi: `[data-rotta-start]` abilitato quando la
  palestra è pronta, `#r-text` con il testo del quesito com'è nella banca (il
  campo `d`, e nient'altro), `#r-ans .ans` una per risposta, la risposta esatta segnata
  `.ans.ok` con `#r-verdict` dopo una risposta, `#r-close`, `#r-fine.on` con il
  suo `h1`, `[data-ciclo="risposte"]`, `#rivedi.on` con `#rv-body`;
  `#esame-data` per la data, e `#rotta-last` per l'ultima attività;
- `function indirizzoApi(loc)`, dal §7.4 del progetto degli account:
  `https://api.rottagiusta.it` su `rottagiusta.it`, `http://<stesso host>:8620`
  su `localhost` e `127.0.0.1`, altrimenti `null`;
- i testi e le etichette di questo progetto, cercati nel testo **che si vede**:
  le due frasi del §4.1, «Crea un account e salva», le etichette «Email» e
  «Password» (`<label>` che punta al campo), «Crea l'account e salva», «Questa
  email è già registrata.», «Accedi», «Reimposta la password», «Torna
  all'attività» nel modulo di accesso.

Da P-39, per le attività e per l'account:

- **le attività di oggi**, con i loro agganci: dal Percorso una porta
  `[data-v]` verso ogni vista (`quiz`, `cart`, `diag`, `seg`, `info`), e
  `[data-v="tec"]` dal Carteggio; nei Quiz `[data-modo="argomento"]` e
  `[data-modo="sim"]`, poi `#start`; nella simulazione `#r-pos` che avanza a
  ogni risposta senza `.ans.ok`, e `#r-close` che apre la conferma in pagina
  `[data-consegna="si"]`; nel riepilogo `[data-ciclo="ritorno"]`; in «Che
  tecnica serve?» `#t-start`, `#r-text` con il testo di un esercizio, le
  `#r-ans .chip`, `#r-next` che corregge e `#r-verdict` che nomina le tecniche
  dell'esercizio; nella prova di carteggio `#c-start`, `#c-testo`, `#c-input`,
  `#c-consegna` a due tocchi e `#c-fine` con la risposta scritta accanto a
  quella ministeriale; nei Segnali `#s-start`, `#sr-ans button`, `#sr-next`,
  `#sr-fine` con un punteggio «n / N». Ogni testo si riconosce dalla banca —
  `quiz.json`, `carteggio.json`, le schede di `E.SEGNALI` —, mai dalla forma;
- **le porte dell'account**: nell'intestazione «Accedi» senza account e
  «Account» con l'account (§3.2), e nel pannello dell'account «Esci»; senza
  account in Progressi la frase del §3.2 con «Vai al Percorso» e «Accedi», e
  nessuno di `#d-temi`, `#d-voci`, `#d-cons`, `#sessioni` visibile;
- **i testi dei flussi**: «Continua senza account», «Hai una data d'esame?» con
  «Continua senza data» (§11.1), «Non chiudere la pagina: le risposte non sono
  ancora salvate nel tuo account.», «{N} risposte salvate nel tuo account» (anche
  al singolare), «Non sappiamo se l'account è stato creato» (§4.3), «Vuoi
  portare nel tuo account …» con l'email di destinazione, le etichette «Sì,
  portale» e «No, continua senza portarle», «Conferma la scelta» (§5.1), «{N}
  risposte non sono sul server», «Per uscire dall'account serve la rete.»,
  «L'accesso è chiuso, ma la copia su questo dispositivo non è stata
  cancellata.» (§10), e la frase dei Segnali del §4.1;
- **la finestra modale**: un pannello aperto porta `aria-modal="true"`, e il
  banco cerca pulsanti e campi lì dentro; si chiude con Esc;
- **l'archivio dell'account** in IndexedDB si chiama `rg-account-<chiave_locale>`
  (§9.2): il banco lo cerca per nome, e senza account non ce n'è nessuno.

Da P-43, per i gruppi che restavano:

- **l'archivio dell'account**: le risposte stanno nell'archivio `righe` di
  `rg-account-<chiave_locale>`, una per uid. Il banco le conta da fuori
  (C-12, C-13, C-14), e un altro archivio con lo stesso numero di voci lo
  ingannerebbe: per questo il nome è nel contratto;
- **la verifica** (§6): l'avviso «Conferma {email} entro il {giorno} …», con il
  giorno e il mese scritti in italiano nell'ora di Roma, dalla descrizione
  dell'account; «Rimanda la mail» e «Ho confermato: verifica lo stato»; «L'account
  è creato, ma non siamo riusciti a spedire la mail di conferma.»; «La mail di
  conferma è stata inviata. Il link vale 24 ore.» e, se il fornitore rifiuta,
  «Non siamo riusciti a spedire la mail di conferma.»; «Email confermata» e «Il
  link è scaduto o è già stato usato.»; `/app#verifica=` e `/app#password=`
  lasciano l'indirizzo appena la pagina si apre;
- **la password** (§4.2, §5.1, §5.3): il `messaggio` del server accanto al
  campo; «Email o password non corrette. Riprova oppure reimposta la
  password.»; «Troppi tentativi. Puoi riprovare fra {attesa}.», con «30
  secondi» quando il `Retry-After` dice 30; «Ho dimenticato la password» nel
  modulo di accesso, poi «Chiedi il link» e «Se questo indirizzo è iscritto,
  riceverai una mail da Rotta Giusta. Il link vale un'ora.»; «Scegli una nuova
  password» con «Salva la nuova password»; «Password aggiornata. Le sessioni
  precedenti sono state chiuse»; «Questo account non era confermato e contiene
  {N} risposte. Vuoi tenerle o cancellarle?» con «Tienile» e «Cancella queste
  risposte»; «Questo link è scaduto o è già stato usato. Chiedi un nuovo link
  per reimpostare la password.»;
- **l'archivio di prima** (§7): «In questo browser ci sono {N} risposte
  salvate prima degli account.», «Registrati o entra e portale», «Scarica il
  file», «Più tardi»; entrando, «Vuoi portare nel tuo account le {N} risposte
  salvate in questo browser prima degli account?» con l'email e «Portale nel
  mio account»; in Info «{N} risposte portate nel tuo account il …»; una
  lettura fallita «Non siamo riusciti a leggere le risposte già presenti in
  questo browser.» con «Riprova»;
- **un file** (§8): in Info il campo `#importa-file`, etichettato «Importa un
  file dei progressi»; «Non riusciamo a leggere questo file di progressi.»;
  senza account «Per conservare le risposte del file, crea un account o
  accedi»; l'anteprima con il nome del file, l'email e «{nuove} nuove · {gia}
  già presenti · {scartate} scartate», poi «Importa nel mio account», lo stesso
  riepilogo alla fine e «Scarica le righe non importate»; «Punteggi da
  inviare» finché il profilo non ha accolto una partita;
- **l'azzeramento altrove** (§10): «… i progressi sono stati azzerati da un altro
  dispositivo», «Qui ci sono {N} risposte non salvate», le tre scelte del §10,
  «Sì, scartale e passa al nuovo archivio» con «andranno perse», «Carica il
  nuovo archivio» senza risposte da perdere, e dopo «Decidi più tardi» un
  «Scegli adesso» che la riapre;
- **l'uscita** (§10): «Scarica le risposte non salvate», poi «Ho conservato il
  file: esci e cancella la copia da questo dispositivo»; nel pannello «Esci da
  tutti i dispositivi»; all'apertura con una sessione revocata «L'accesso non è
  più valido.»;
- **la data** (§11.1): nel passo «Hai una data d'esame?» il campo «Data d'esame
  (facoltativa)», «Salva la data», «Data salvata», e «La data non è stata
  salvata. Riprova oppure continua senza cambiarla»; `#esame-data` mostra la
  data dell'account;
- **l'export e le origini senza API** (§11.2, §3.1): in Info «Scarica i tuoi
  progressi», «Il file del server non contiene ancora le {N} risposte da
  inviare», «Scarica le risposte da inviare»; su un'origine senza API un link
  visibile a `https://rottagiusta.it/app`, e nessun «Accedi».

Un aggancio cambiato è una conversazione con `main`, non un controllo da
aggirare: il prompt di P-18 lo dice.

**Che cosa il banco non copre**, e resta al collaudo o a un'altra strada:

- **Safari e WebKit.** ITP, i cookie fra `rottagiusta.it` e `api.rottagiusta.it`,
  IndexedDB nella navigazione privata: resta Q-PROVE, su un Safari vero.
- **I sottodomini veri e HTTPS.** Il banco usa `http://localhost` su due porte;
  il `__Host-` sui domini veri si vede solo in esercizio (P-15).
- **Le richieste del service worker.** L'emulazione dell'offline e le risposte
  sostituite valgono per la scheda, non per il worker: per questo, durante la
  fase offline, il sito del banco smette anche di rispondere. Senza quel passo
  la rottura «la banca chiesta fuori dal guscio» passa verde, ed è misurato. Il
  `sw.js` vero ignora le altre origini, quindi le richieste all'API partono
  dalla pagina e il banco le vede.
- **Il gesto vero.** I clic sono `element.click()`: niente tastiera, fuoco,
  lettore di schermo, 375 e 1280 px, gestore di password. Collaudo di P-18.
- **Le condizioni.** Serve Chrome (`RG_CHROME` se non sta in `/Applications`):
  senza, il banco è rosso e lo dice, non salta. Serve la porta 8620 libera: un
  server di sviluppo acceso lì fa un rosso che lo nomina.
- **Il tempo.** `tests/test_interfaccia.py` passa da 3 a circa 50 s. Il grosso
  sono le attese che una rottura esaurisce — 10 s per un caricamento, 5 per una
  reazione a un clic, parecchie volte sopra i tempi misurati —; quelle sul
  server degli account girano in fila, perché il suo CORS accetta un'origine
  sola, e le altre in parallelo, ognuna col suo sito. Con attese di 2,5 s e sei
  prove in parallelo una rottura è uscita rossa per il motivo sbagliato — un
  quesito non ancora disegnato sotto carico — e alla corsa dopo per quello
  giusto: un rosso che a volte mente è il difetto opposto a quello di casa, e
  le attese sono state alzate. **Quella lettura era sbagliata**, e l'ha
  corretta P-38 qui sotto: con ogni probabilità quel quesito era disegnato, ed
  era uno degli otto troppo corti per il banco.

**Il banco contro sé stesso**, una difesa tolta alla volta: il sito acceso
durante l'offline → «la banca chiesta fuori dal guscio» passa verde; il testo
cercato nel DOM invece che in quello che si vede → «nessun avviso prima di
cominciare» passa verde, e la pagina di riferimento diventa rossa, perché il
sorgente dello script contiene «Questa email è già registrata.»; niente `409`
finti → le rotture sul riconoscimento da codice e da testo passano verdi; la
POST non guardata → «la frase detta senza chiedere al server» passa verde; la
Cache Storage non letta → «le risposte in Cache Storage» passa verde.

### Il banco stabile (P-38, 29 settembre 2026)

**Il sintomo.** La regia aveva fatto girare `tests/test_interfaccia.py` quattro
volte sullo stesso albero: due rosse, sulla pagina di riferimento, con «Inizia
non apre un quesito con le sue risposte» o «troppo poche verifiche: il giro non
è arrivato in fondo»; due verdi.

**La misura, prima di toccare niente**, sul Mac dell'autore (10 core, Chrome
153, Node 25.3), con i soli controlli del banco del client — gli stessi della
suite, importati da lì — giro dopo giro:

| Condizione | Giri | Rossi | Dove | Durata media |
|---|---|---|---|---|
| senza carico | 20 | **2** | giro 16: pagina di riferimento, «il primo quesito compare senza account»; giro 18: la rottura «al 409 la pagina segna l'email in un cookie», rossa per il motivo sbagliato — lo stesso quesito che non compare | 52,2 s |
| sotto carico: dieci `yes > /dev/null`, uno per core, load average 24 | 20 | **1** | giro 2: pagina di riferimento, «il primo quesito compare senza account» | 55,4 s |

Tre rossi su quaranta, **tutti nello stesso punto**, e il carico non li
moltiplica. Non era lentezza.

**La causa.** Il banco riconosceva il quesito in schermata da
`#r-text` con **più di 10 caratteri** e almeno due risposte visibili. Otto
quesiti base su 1.472 sono più corti — «I flaps:», «La tuga è:», «La meda è:»,
tre «La brezza:», «Il fronte:», «Il nodo è:» —, e la pagina di riferimento
pesca il primo quesito con `E.estrai(…, Date.now() % 997)`: 5 semi su 997 ne
mettono uno in testa, lo **0,5 % di ogni avvio**, e un giro ne fa una
quarantina fra pagina di riferimento e rotture. Il quesito era in schermata;
era il banco a non riconoscerlo. Su C-01 il giro si ferma a cinque verifiche,
quindi lo stesso difetto dà anche il secondo messaggio, «troppo poche
verifiche». La pagina vera non ne era toccata, e anche questo è misurato: la
sua prima attività è la Mirata con il seme del giorno, e su 365 giorni dal 1°
settembre 2026, con un archivio vuoto, non mette mai in testa uno degli otto. Il
client di P-18 però pescherà come vorrà: il banco non può dipendere da quale
quesito esce.

**Provata deterministicamente**, non dedotta dalla frequenza: la pagina di
riferimento con la pesca che comincia dal testo più corto della banca dà, col
banco di prima, «Inizia non apre un quesito» online e offline e cinque verifiche
su C-01; col banco corretto, undici verifiche verdi. Esclusi misurando due altri
sospetti: dopo `vai()` e `ricarica()` la scheda era sulla pagina giusta e
completa 40 volte su 40; e quando il «guscio pronto» diventava vero il service
worker era attivo o in attivazione 40 volte su 40.

**Che cosa aspetta il banco adesso**, uno stato e non un tempo:

- **il quesito**: `#r-text` mostra il testo di un quesito della banca — il
  banco legge `site/dati/quiz.json`, la stessa che il sito serve — e sotto ci
  sono tante risposte visibili quante quel quesito ne ha. Lo giudica il banco,
  non la pagina (`attendiValore()` in `tests/browser.mjs`), e un rosso dice che
  cosa c'era in schermata invece di «non apre»;
- **il guscio**: un service worker **attivo** e in cache `/app`, `/engine.js`,
  `/dati/quiz.json`. L'install scrive la cache prima di attivarsi, quindi la
  sola cache non bastava; non ha mai dato un rosso misurato, ma è lo stato da
  cui dipende la ricarica offline;
- **la ricarica di C-02**: la palestra di nuovo pronta, controllata, prima di
  guardare che non mostri niente di prima. Prima il risultato si ignorava, e
  una pagina che non si ricaricava sarebbe passata per «vuota»;
- **i `409` finti di C-05**: se il giro non arriva al riepilogo, un rosso che
  lo dice. Prima il gruppo tornava in silenzio e i due controlli dei `409`
  sparivano senza che la pagina di riferimento diventasse rossa.

**La seconda causa, trovata dai giri dopo la prima correzione.** Venti giri
della suite intera senza carico, tutti verdi; venti sotto carico, **uno
rosso, e dalla parte peggiore**: la rottura «le risposte in Cache Storage» è
passata **verde**. C-02 aspettava mezzo secondo dopo il riepilogo e leggeva lo
storage una volta sola. Misurato con 60 prove per condizione, dal clic su
«Termina» a quando la scrittura della rottura si vede da fuori: mediana 32 ms e
massimo **271 ms** senza carico; mediana 17 ms e massimo **592 ms** sotto
carico, una volta su sessanta oltre i 500. E la lettura dopo la ricarica non la
ripescava: una scrittura non ancora partita muore con la pagina. È il difetto
che P-29 aveva visto «passare una volta su tre» e aveva curato allungando la
stessa pausa.

**Le attese a tempo che restano, dichiarate.** `CARICO` (10 s) e `REAZIONE`
(5 s) sono scadenze, non attese: una pagina che funziona non le raggiunge, e le
esaurisce solo una rottura. Il tocco ripetuto sulla risposta, ogni 250 ms fino
a venti volte, c'è perché la sordità di 200 ms dopo un cambio di schermata
(specifica §7.5) non si vede da fuori: si ripete il gesto e si aspetta lo stato
`.ans.ok`. Resta **una sola finestra a tempo**, `OSSERVAZIONE`, in C-02: il
controllo è che una scrittura **non** avvenga, e un'assenza non ha un evento da
aspettare. Non è più una pausa seguita da una lettura: il banco rilegge lo
storage da fuori per tre secondi e si ferma alla prima scrittura trovata, quindi
una pagina rotta non paga la finestra e una giusta la paga intera. Tre secondi
sono cinque volte il peggio misurato; **una scrittura partita più di tre
secondi dopo il riepilogo sfuggirebbe**, ed è il limite dichiarato di questo
controllo. La rottura nuova «le risposte in Cache Storage, un secondo dopo il
riepilogo» lo tiene fermo: col banco di prima passava verde sempre, anche dopo
la ricarica, e ora è rossa sia prima sia dopo.

**Il banco contro i propri rossi falsi.** Le rotture lo provano contro i verdi
falsi; ora c'è anche il verso opposto: `VARIANTI_CLIENT` in
`tests/test_interfaccia.py`, varianti della pagina di riferimento che devono
restare **verdi**. La prima comincia la pesca da «I flaps:», e a ogni
esecuzione della suite tiene fermo il caso di P-38.

**I giri**, con la suite dell'interfaccia intera, venti per condizione:

| Codice | Condizione | Giri | Rossi | Durata media |
|---|---|---|---|---|
| solo la prima correzione | senza carico | 20 | 0 | 55 s |
| solo la prima correzione | sotto carico | 20 | 1, il verde falso qui sopra | 62 s |
| **finale** | senza carico, nessun `yes` vivo | 20 | **0** | 55 s |
| **finale** | dieci `yes` | 20 | **0** | 61 s |
| **finale** | venti `yes`, load average fino a 181 (gli ultimi due giri con dieci) | 20 | **0** | 78 s |

La serie con dieci e quella con venti `yes` non erano previste così: dieci
processi di una misura precedente erano rimasti orfani, e se ne è accorto il
load average. Le due serie valgono come carico, più pesante del previsto; la
serie senza carico è stata rifatta dopo averli fermati. Con la LTS 24.21.0 la
suite dà gli stessi 576.

Le rotture, ventiquattro con quella nuova, sono rosse ognuna per il suo motivo
a ogni giro: è un controllo della suite stessa. La finestra di tre secondi non
allunga la suite in modo misurabile, perché le prove di C-02 girano in
parallelo: 55 s senza carico, come prima.

**Quali gruppi ci sono, al 29 settembre 2026:**

| Gruppo | Stato | Che cosa esegue |
|---|---|---|
| C-01 | **fatto** (P-29, P-39) | Nuovo browser, attività consigliata del Percorso: primo quesito senza campi password, risposta, «Termina», riepilogo, revisione; poi lo stesso offline, dopo che il guscio è in cache. Poi le altre attività, ognuna fino al suo punto d'arrivo e senza un campo password: Quiz per argomento con riepilogo e revisione, simulazione con la consegna confermata in pagina e nessuna correzione durante la prova, «Che tecnica serve?» con la correzione che nomina le tecniche dell'esercizio, prova di carteggio con la risposta scritta accanto a quella ministeriale, una partita dei Segnali fino al punteggio. Offline, solo il Percorso. |
| C-02 | **fatto** (P-29, P-39) | Avviso prima e dopo in testo visibile; una partita dei Segnali con la sua frase, un'attività e la data; niente in IndexedDB, localStorage, sessionStorage, cookie, né in Cache Storage oltre il guscio e le figure, per tutta la finestra d'osservazione; nessuna richiesta all'API; ricarica senza risposte né data, e ancora niente conservato. |
| C-03 | **fatto** (P-39) | Dal Percorso ogni vista: nessun invito, campo password o finestra modale. Progressi senza account: la frase del §3.2, «Vai al Percorso», «Accedi», nessun cruscotto. L'invito nel riepilogo; «Continua senza account» lo chiude senza aprire altro; durante l'attività dopo non c'è, nel suo riepilogo torna. |
| C-04 | **fatto** (P-39) | Due attività, poi la registrazione con un doppio clic: una POST sola. La risposta dell'invio trattenuta dopo il server: per tutta la finestra niente «salvate» e niente data d'esame, e «Non chiudere la pagina…» visibile; lasciata andare, «2 risposte salvate» con 2 righe nel database, poi la data facoltativa. La risposta alla registrazione persa dopo il server: `GET /v1/io` prima di ripetere, nessuna seconda registrazione, e le risposte salvate. **Non** esercita un `503` di posta, un `422` o un `429`: sono C-07 e C-08. |
| C-05 | **fatto** (P-29) | Registrazione dal riepilogo con un'email iscritta sul server vero: la frase, le due porte, zero cookie, zero sessioni e zero mail nuove, Accedi con l'email e senza password, riepilogo e revisione intatti; un `409` finto di un altro genere non parla di email, e uno con un messaggio diverso non spegne la frase. |
| C-06 | **fatto** (P-39) | Con risposte di prova l'accesso chiede se portarle e dice dove; per la finestra intera la scelta proposta non manda niente; con il no l'account resta vuoto, e la risposta dopo l'accesso ci entra. La corsa: A risponde e la sua richiesta resta ferma prima di partire; da un'altra scheda A esce e B entra; lasciata andare, nel database di B nessuna riga, e quella di A è nel suo account; la copia di A non resta. La coda di A congelata da un `401` non entra in B, e resta nella copia di A. |
| C-11 | **fatto** (P-39) | Una risposta data mentre la conferma della precedente è ferma arriva anche lei. Due schede rispondono nello stesso istante: quattro righe sul server, non tre. Una ricarica con il trasferimento fermo prima del server: la pagina riprende e dice «salvate» con la riga nel database. **Non** esercita l'import di un file né più lotti: sono C-10 e C-12. |
| C-15 | **fatto** (P-39, P-43) | Con una riga che non parte, «Esci» dice quante non sono sul server e non esce. Offline dice che serve la rete, e copia, cookie e sessione restano. Con un'altra scheda sulla copia, la sessione si chiude e la pagina dice che la copia non è stata cancellata. L'uscita normale da una scheda mentre l'altra ha una conferma in volo: sessione chiusa, niente dell'account nel browser per tutta la finestra, anche dopo la risposta tardiva, e l'altra scheda senza account. Da P-43: un `401` all'uscita pulisce la copia senza dire che serve la rete; con la sessione revocata e una risposta non inviata la fa scaricare e cancella solo dopo «Ho conservato il file…», senza mandarla a nessun account; «Esci da tutti i dispositivi» chiude ogni sessione sul server e qui la copia, e l'altro dispositivo lo scopre con un `401` e tiene la sua. |
| C-07 | **fatto** (P-43) | Posta del banco che rifiuta: la frase del `503`, l'account che salva, la scadenza del server dal primo momento — l'orologio del server è tre giorni avanti, così una scadenza del browser cade in un altro giorno — e dopo una ricarica; il rinvio rifiutato senza successo, quello accolto con la mail. Il link aperto in un'altra scheda: frammento tolto, email confermata sul server, l'avviso che sparisce nell'altra scheda, il gettone in nessuno storage; il link usato e quello scaduto lo dicono. |
| C-08 | **fatto** (P-43) | Password corta e comune: il `messaggio` del server — chiesto dal banco allo stesso server — accanto al campo, con l'email ancora scritta. La stessa frase per email ignota e password sbagliata; al sesto tentativo il `429` del server vero, con l'attesa del `Retry-After`; un `403` finto con il suo messaggio e «Reimposta la password». Recupero: la frase condizionale per iscritto e non iscritto, il link della password con il gettone tenuto dopo un `422`, le sessioni di prima chiuse, la domanda su un account appena confermato e nessuna cancellazione da sola; il link scaduto dopo un'ora e un minuto. |
| C-09 | **fatto** (P-43) | L'archivio di prima scritto nel browser prima del primo carico, IndexedDB e `pn.archivio` con un uid in comune. Avviso con l'unione, file scaricato con tutte, domanda all'accesso, niente prima del sì, poi tutte sul server; Info lo dice; l'archivio resta; dopo una ricarica niente avviso, e una riga nuova a conteggio uguale lo riaccende. «Più tardi» senza scritture, e l'avviso che torna. Una lettura fallita — `IDBFactory.open` che lancia, iniettato prima del carico — detta, con l'archivio intatto. Nel regime di oggi: aprire la palestra non perde l'archivio. |
| C-10 | **fatto** (P-43) | Un file illeggibile; senza account niente parte e niente resta. Con un file del nome di prima, un tag senza data, un uid doppio, una data rotta e un quesito che non c'è: l'anteprima con i conteggi del motore, niente prima del clic, poi le righe valide sul server, gli scarti scaricati, i Segnali per massimo, e la seconda importazione che non cambia niente. Una partita offline «da inviare» che, dopo una ricarica con la rete, arriva. |
| C-12 | **fatto** (P-43) | 2.500 righe da un chilo e mezzo, 3,7 MiB, importate da un file: tutte sul server, in più invii. Un `413` finto che si legge e non dice «salvate», poi «Riprova l'invio». 5.200 righe ricevute in più pagine; poi tre righe di un altro dispositivo e una risposta qui: la conferma dell'invio non sposta il cursore, e arrivano. |
| C-13 | **fatto** (P-43) | Scoperto inviando, con la ricezione che non passa: quante risposte non salvate, le tre scelte, niente che rientri né riparta per la finestra intera, la perdita confermata, la copia vuota, poi una risposta nuova che entra da sola. Scoperto ricevendo, dopo una ricarica: «Carica il nuovo archivio», la copia ferma prima della scelta; «Decidi più tardi», una risposta, «Scegli adesso» che la conta. |
| C-14 | **fatto** (P-43) | Una risposta, una copia del database del server, un'altra risposta, il ripristino — il server si ferma e riparte sulla stessa porta con un'epoca nuova —: la pagina rimanda quella persa, e un altro dispositivo le riceve tutte e due. Solo sulle corsie con una porta qualunque (§12, qui sotto). |
| C-16 | **fatto** (P-43) | Dopo la registrazione: una data passata scritta nella pagina si propone, non si salva prima del clic e si salva com'è; senza, il campo è vuoto e «Continua senza data» lascia il server senza data; un `PUT` fallito lo dice. Entrando in un account con la data, il passo non si ripete e la pagina la mostra. |
| C-17 | **fatto** (P-43) | Con la ricezione e l'invio fermati, una riga di un altro dispositivo sul server e una risposta qui: il file è l'export del server, la pagina dice la risposta che non contiene, e questa si scarica a parte. Su `rotta.test` (Chrome con `--host-resolver-rules`): il link a `rottagiusta.it/app`, nessun «Accedi», nessun invito nel riepilogo, nessuna richiesta all'API e niente nel browser. |
| C-18 | **fatto** (P-43), senza browser | `test_client_testi` in `tests/test_interfaccia.py`: undici frasi che gli account rendono false (§1 della coda, ricontate da P-43) e sette del §11.2, commenti compresi, nei due regimi, provato al contrario sui testi stessi. Non guarda il contenuto giuridico dell'informativa. |

**La corsa fra schede di «da verificare»** (§9.3, ultimo paragrafo; §9.1)
entra con C-06, C-11 e C-15 in questa forma, che il banco sa già fare: due
schede **nello stesso contesto**, cioè con lo stesso cookie; A invia e B
riceve, o A esce mentre B ha un invio in volo, con una risposta del server
trattenuta dall'intercettazione finché l'altra scheda non ha agito. Il
controllo non guarda solo lo schermo: legge il database del server, perché
«l'invio sbagliato sul server sarebbe già un danno» (§9.1), e pretende che
nessuna riga di A arrivi nell'account di B e che «salvate» compaia solo dopo
che il server ha nominato ogni uid. **Fatto da P-39**, qui sotto; lo stato
«da verificare» in sé il banco non lo provoca, e lo dice.

### Il resto dei controlli (P-39, 29 settembre 2026)

**Tre misure prima dei controlli**, con un'API finta su due porte e il banco:

| Che cosa | Misurato |
|---|---|
| Una risposta fatta fallire dopo il server (`Fetch.failRequest` alla fase *Response*) | la pagina vede `Failed to fetch`, ma **il cookie c'è**: un `GET` dopo parte con il cookie nuovo. Una registrazione la cui risposta si perde ha quindi già aperto la sessione, e `GET /v1/io` lo dice (§4.3) |
| Una richiesta trattenuta prima di partire, poi annullata dalla pagina con `AbortController` e lasciata andare dal banco | **non arriva al server**: arriva solo il preflight, senza cookie |
| La stessa richiesta non annullata, lasciata andare dopo un accesso con un altro account | **parte con il cookie nuovo**: la riga di A finirebbe in B. È il danno del §9.1, riprodotto; la difesa è annullare l'invio prima che l'uscita si compia |

**Come la pagina di riferimento aspetta le altre schede.** Con un lucchetto
condiviso per scheda (`navigator.locks`), preso all'accesso e lasciato quando
la scheda si è fermata — invio annullato, archivio chiuso, memoria pulita —; chi
esce avvisa con un `BroadcastChannel` e chiede il lucchetto esclusivo, per al
più tre secondi, poi dice di chiudere l'altra scheda. È un modo, non il
contratto: il banco guarda il database del server e il browser, non il
lucchetto, e una pagina che aspetta in un altro modo passa lo stesso. Per
questo la rottura «l'uscita non avvisa le altre schede» qui è rossa perché
l'uscita non si compie, e in una pagina senza lucchetto lo sarebbe sulla riga
di A in B.

**Un verde falso trovato, dal tempo.** La prima rottura di C-11 per due schede
scriveva riga e coda in due transazioni con un secondo in mezzo, e passava
verde sotto carico e a volte da sola. Misurato con un registro nella pagina: le
due schede leggono la coda nello stesso millisecondo, ma **il timer da un
secondo della scheda in secondo piano scatta dopo 1,76 s**, quando l'altra ha
già inviato la sua riga, e la sovrascrittura non perde niente di non inviato.
Due correzioni: il banco fa il clic nelle due schede nello stesso istante,
passata la sordità di 200 ms, invece di ritoccare a turno; e la rottura è
diventata quella che il §9.1 nomina — la coda tenuta in memoria da ogni scheda
e scritta intera —, rossa tre volte su tre.

**Le corsie.** Il server accetta una sola origine (§7.3 del progetto degli
account), quindi i gruppi con l'API giravano in fila; con i gruppi nuovi e le
loro rotture la fila supera i quattro minuti. Ora sono quattro corsie, ognuna
con un sito, un server con il suo database, il suo orologio e la sua posta:
la corsia 0 è sulla porta 8620 e porta la pagina vera; le altre ascoltano su
una porta qualunque, e la pagina che ci gira ha `:8620` riscritto con la sua —
solo la pagina di riferimento e le sue rotture, mai quella vera. Una rottura
chiede solo la parte del gruppo che rompe (`C-06:corsa`), e nelle uscite di
C-15 il giro si ferma al primo rosso, perché ogni passo parte dallo stato del
precedente: una rottura lì costava 37 s di scadenze.

**Il tempo.** `tests/test_interfaccia.py` passa da 576 a 722 verifiche e da
55 s a circa 61 s senza carico. Senza le corsie e le parti, misurato, erano
84 s con una rottura sola da 37 s.

**Che cosa i gruppi nuovi non coprono**, oltre al §12 «Il banco»:

- **lo stato «da verificare» in sé.** La pagina di riferimento tiene il
  trasferimento nell'archivio condiviso, e ogni scheda vi registra le sue
  conferme: le due schede non lo producono. Il banco controlla l'invariante —
  «salvate» solo quando il server ha ogni riga, letto nel database — e non
  lo stato; una pagina che tiene il trasferimento per scheda lo produrrà, e
  il controllo resterà lo stesso;
- **una corsa più stretta di quella che il banco sa provocare.** Due clic nello
  stesso istante e una richiesta trattenuta sono le finestre più larghe; una
  scrittura non atomica con una finestra di pochi millisecondi può passare. Il
  §9.1 resta un requisito da leggere nel codice alla merge di P-18;
- **il `401` all'uscita, «Esci da tutti i dispositivi», un `IndexedDB` che non
  si scrive** (§9.2) — di C-15 e del resto del §10;
- **la scheda in secondo piano.** Chrome rallenta i timer delle schede che non
  si vedono: è la stessa cosa del telefono con due schede, ma i tempi del banco
  non sono quelli di un telefono.

**Il resto dei gruppi**, da scrivere sullo stesso banco. Nessuno è impossibile
per il banco; le parti che non vedrà sono scritte accanto.

| Gruppo | Che cosa chiede al banco | Che cosa non vedrà |
|---|---|---|
| C-07 | la posta del banco che rifiuta (`503`), i gettoni letti dalle mail del banco, il frammento `#verifica=` e `history.replaceState`, la scadenza scritta dal primo momento | la mail vera, lo spam |
| C-08 | `422`, `401`, `403`, `429` dal server vero o finti, il recupero con il gettone della mail | incolla e autofill: il gesto vero e il gestore di password sono del collaudo |
| C-09 | un archivio di prima scritto nel contesto prima del primo carico (IndexedDB `open-patente-nautica` e `pn.archivio`), una lettura fallita | un archivio vero di anni: è P-27 (R-ACC-05) |
| C-10 | un file dato al campo con `DOM.setFileInputFiles`, i Segnali per massimo sul server | — |
| C-12 | più di 2.000 righe e più di 2 MiB, un `413` finto, più di 5.000 righe da ricevere | il tempo di un archivio grande su un telefono |
| C-13 | un azzeramento dal banco con la generazione nuova, scoperto inviando e ricevendo | — |
| C-14 | un ripristino di una copia del database del server a metà giro (`server/copie.mjs`) | — |
| C-16 | un `PUT /v1/profilo` fallito, una data passata | Q-ONBOARD, che non è deciso |
| C-17 | un'origine esclusa: un nome che non sia `localhost` né `127.0.0.1` per il sito, per esempio con `--host-resolver-rules` | — |
| C-18 | la ricerca delle frasi nelle due pagine e nei metadati | la privacy: il suo gate è dell'autore |

### I gruppi che restavano (P-43, 29 settembre 2026)

**Tutti e diciotto i gruppi ci sono.** La pagina di riferimento è diventata un
client che fa quello che i gruppi chiedono — verifica e link, recupero,
archivio di prima, file, Segnali con l'account, conflitto, ripristino, uscita
da tutti i dispositivi, export, origini senza API —, e ogni gruppo ha le sue
rotture: 53 nuove, **110 in tutto**, ognuna rossa per il suo motivo in ogni giro.
Nel regime della pagina di oggi i gruppi nuovi controllano che il client non
ci sia, e C-09 che aprire la palestra non perda l'archivio che c'è.

**Un difetto del server, trovato misurando prima di scrivere C-08.** Il §5.1
vuole «Troppi tentativi. Puoi riprovare fra {attesa}», dal `Retry-After`. La
pagina sta su un'origine e l'API su un'altra, e un'intestazione che il CORS non
espone il browser la nasconde: in Chrome `headers.get('Retry-After')` dava
`null` senza `Access-Control-Expose-Headers` e `'30'` con. Il server la
mandava, e nessuna pagina poteva leggerla. Ora il CORS la espone, e solo al
sito (R-ACC-49, `test_server.mjs`). Il gruppo C-08 usa il `429` del server
vero, quindi lo tiene fermo anche dal lato della pagina.

**Due difetti della pagina di riferimento, trovati dai controlli.** Dopo
«Decidi più tardi» la scelta sull'azzeramento non si poteva riaprire, e una
risposta data intanto sarebbe finita buttata da «Carica il nuovo archivio»,
che non chiede niente perché al momento dell'avviso non c'era niente da
perdere: le risposte non salvate si ricontano al momento della scelta. E il
modulo di registrazione restava aperto sopra «Riprova l'invio», l'unica
azione utile dopo un `413`. P-18 ha gli stessi due punti da guardare.

**Tre verdi falsi del banco, trovati facendolo girare.** In C-12 le prime
1.600 righe grandi e le altre piccole: IndexedDB le rende in ordine di uid, le
mescola, e una fetta da 2.000 stava sotto i 2 MiB — la rottura «lotti a fette
di 2.000 righe» passava; ora le righe sono tutte grandi. In C-10 la rottura
«punteggi da inviare tenuti solo in memoria» passava sotto carico: il banco
tornava online prima che l'invio fallito fosse davvero partito; ora aspetta la
fine della richiesta — `browser.mjs` segna come finisce ognuna —, non un tempo.
In C-13 l'azzeramento, sotto carico, lo scopriva la ricezione dopo il primo
invio e non l'invio: un percorso giusto, che ha la sua parte; in quella
«inviando» la ricezione ora non passa. **E un banco appeso:** un'eccezione
dentro un `onsuccess` del banco lasciava una promessa aperta per sempre, e la
suite non finiva; ora il passo rifiuta, e ogni comando al browser scade dopo
30 s con un rosso che dice quale. **E un banco caduto, una volta su diciassette giri:**
168 rossi in 54 s, senza un motivo, perché il rosso riportava solo l'avviso
sperimentale di `node:sqlite`. Il meccanismo, riprodotto: C-14 chiude il server
della sua corsia e lo riapre sulla stessa porta; se in quell'istante la porta è
presa, il riavvio fallisce, la corsia richiude alla fine un server già chiuso, e
la seconda chiusura è un'eccezione non gestita che fa uscire il banco con 1 e
nessun risultato. Che sia stato questo in quel giro non si può dimostrare — la
sua uscita non c'è più —; è l'unico meccanismo trovato che dà quel sintomo. Ora
il riavvio riprova per cinque secondi e poi è un rosso che nomina la porta, la
corsia non chiude due volte, e un banco caduto dice il codice d'uscita e
l'errore invece dell'avviso.

**Il banco contro sé stesso**, una difesa tolta alla volta: senza l'orologio
del server tre giorni avanti, «la scadenza calcolata con l'orologio del
browser» passa verde; con le righe di C-12 di prima, «lotti a fette di 2.000
righe»; senza cercare il gettone negli storage, «il gettone salvato in
sessionStorage»; senza guardare il database del server dopo «Tienile», «le
risposte … cancellate senza chiedere».

**Il tempo.** Con i gruppi nuovi e le loro rotture il banco è passato da 61 a
182 s, misurato gruppo per gruppo con `RG_TEMPI=1`: il tempo andava nelle
rotture, che dopo il primo rosso continuavano e pagavano le scadenze del resto.
Due correzioni: le parti dei gruppi nuovi si fermano al primo rosso
(`fermaAlPrimo()`, la regola delle uscite di C-15), e le corsie sono otto
invece di quattro. `tests/test_interfaccia.py` fa **928 verifiche in circa
85 s** (erano 722 in 61).

**Le corsie e la porta 8620.** C-14 riavvia il server a metà giro, e sulla 8620
un'altra suite può prendersi la porta in quell'istante: gira solo sulle corsie
con una porta qualunque. **Misurato il 29 settembre, e non teorico:** la suite
di P-18 nel worktree dell'interfaccia e questa si contendono la 8620, e una
parte quando l'altra la tiene è rossa con «la porta 8620 è occupata». Chi fa
girare la suite con un'altra sessione aperta guarda prima la porta
(`lsof -iTCP:8620 -sTCP:LISTEN`); `esegui(prove, { portaApi })` sposta la corsia
0 per chi prova soltanto la pagina di riferimento. È un pezzo di Q-SUITE.

**Che cosa i gruppi nuovi non vedono**, oltre a quello scritto nella tabella
del «Resto dei controlli»: la mail vera e lo spam (C-07); incolla, riempimento
automatico e gestore di password (C-08); un archivio vero di anni — il banco ne
scrive uno sintetico di sei righe, e R-ACC-05 lo dice coperto su quello (C-09;
l'archivio vero resta al collaudo di P-27); la scelta «Scarica e passa al nuovo
archivio» di C-13, che non esercita; «Cancella queste risposte» dopo il
recupero, che il banco non preme; un'uscita con punteggi dei Segnali non
confermati; il tempo di un archivio grande su un telefono; la privacy, il cui
gate è dell'autore.

**Collaudo dell'implementazione:** screenshot a 375 e 1280 px, prova al 200%,
tastiera, focus di ritorno al riepilogo/controllo d'origine, lettore di schermo,
gestore password e Safari reale per cookie fra sottodomini e IDB. Moduli
in colonna, etichette sempre visibili, messaggi accanto ai campi e riepilogo
errori focalizzato; stati annunciati con live region, senza interrompere ogni
risposta. Avvisi non affidati al colore; pannelli richiudibili con Esc e focus
ripristinato, senza chiudere o perdere il runner. Nessun audio nuovo; i suoni
dei Segnali mantengono i controlli esistenti.

Provare con una persona nuova: arrivare al primo quesito, spiegare cosa
succede alla chiusura, registrarsi dopo il riepilogo e trovare una mail
scaduta. Con una persona che ha uno storico: scaricare o trasferire e
spiegare quali righe sono sul server. La prova con persone resta distinta
dal superamento delle suite.

## 13. Evidenze e limiti di P-13

Precondizioni: worktree `rotta-giusta-ui`, ramo `ui/main`, albero pulito,
base `8f6a0c0` coincidente con `main` all'apertura. Il pull richiesto dallo
standard Git non ha un upstream configurato per `ui/main`; non è stata
inventata una merge da un remoto. L'allineamento resta quello della regia.

La lettura documentale e delle firme ha verificato le sei funzioni della
coda e distinto i test esistenti dai controlli C-01…18 richiesti. Non sono
stati modificati `site/`, motore, server, test, specifica o coda delle sessioni.
Non sono stati usati account reali, pannelli o macchine remote. I risultati
delle suite della base e i limiti osservati sono riportati nella voce P-13
del CHANGELOG; non dimostrano un flusso client ancora inesistente.

Per l'autore resta Q-ONBOARD, già nel §10 della specifica; non blocca il
passo minimo della data facoltativa qui progettato. Per la regia, questo
documento dà i contratti del client da ereditare nel progetto del ciclo
completo e nella realizzazione, con P-11 e i controlli del §12 come contatti
espliciti. L'ordine e i prompt rimangono soltanto in `prossime-sessioni.md`.
