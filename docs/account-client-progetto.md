# Gli account — progetto del client

**P-13, decisioni di interfaccia del 26 settembre 2026, da implementare.**
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
  versione con gli account e comportamenti richiesti alla pagina; P-11 per
  le rotte ancora da chiudere, P-13 per il perimetro di questa sessione.
- [Specifica](specifica.md), §2.4, §4.3 e §9.9: ingresso, soglie e R-ACC.
  [Filosofia](filosofia.md): promesse vere, perdita dichiarata, nessun invito
  insistente, dati leggibili dal titolare.
- [Area 1](area-1-progetto.md): modello del documento e flussi già progettati.
  Questo progetto sostituisce le sue promesse di persistenza senza account;
  conserva proposta, libertà di scelta, riscontro e ritorni.
- Letti nella base `8f6a0c0`: `site/engine.js` per firme e risultati della coda,
  `server/conti.mjs` per registrazione, reimpostazione e descrizione dell'account.

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

**Prerequisiti del codice, da verificare prima dell'implementazione:** P-09 e
P-10 esistono e hanno test; P-11 deve consegnare il `409` della registrazione,
profilo/data/Segnali, cambio email e cancellazione. Nella base letta la
registrazione duplicata dà ancora `202`, come dichiarano le fonti. La pagina
non trasforma quel `202` in un accesso riuscito. Server testato e server
raggiungibile in produzione sono due evidenze distinte; l'origine e il cookie
reali richiedono la messa in esercizio e la prova del §12.

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
si torna alla destinazione d'origine. Nei Segnali il blocco dice «salvare i
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

Solo il `409` della rotta registrazione con il codice d'errore previsto da
P-11 produce: **«Questa email è già registrata.»** Poi «Accedi per conservare
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
P-11 deve rendere disponibile questo contratto e l'export completo.

Lo stesso contratto vale per le partite nuove dei Segnali con account:
il risultato aggiorna la copia del solo account corrente, si invia al profilo
quando c'è rete e resta dichiarato «Punteggi da inviare» fino al PUT riuscito.
Offline la copia e il bisogno di invio sopravvivono alla ricarica nell'archivio
dell'account; al ritorno della rete si rimandano i valori, che il server fonde
per massimo. Non sono righe da infilare nella coda delle risposte e non
si sommano in pagina i contatori ricevuti da altri dispositivi. La lettura
dei punteggi dal profilo/risultato API resta il contratto P-11 da verificare.
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
«tutto salvato». Caso di una singola riga oltre limite: controllo da aggiungere,
senza spezzare o modificare la riga in pagina.

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

**Contatti da risolvere su main prima del codice che ne dipende:** un
risultato del motore per riepilogare un trasferimento su più lotti con uid
già confermati, scarti locali/server e ritenti, se i risultati esistenti non
bastano; un risultato per descrivere righe non inviabili entro il limite,
senza calcolo alternativo nella pagina; contratto definitivo P-11 per
profilo/Segnali, lettura dei punteggi e codice dell'email già registrata.
Claude aggiunge export/test dove servono; non si cambia la regola nel client
per aggirare un contratto mancante. L'unione di uid identici con payload
diversi nelle due fonti vecchie va esercitata preservando i file originali.

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
