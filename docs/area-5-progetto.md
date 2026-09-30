# Area 5 — Progressi: una mappa per tema

**Sessione P-22, progetto del 29 settembre 2026, da realizzare.** Consegna
sul modello delle [aree 1–4](area-4-progetto.md): testi, stati, contratti,
disposizione e accettazione. Questa sessione scrive soltanto questo documento e
il CHANGELOG; non realizza la pagina né modifica la coda.

Chi apre Progressi deve poter distinguere ciò che ha visto, ciò che l'ultima
risposta ha lasciato da rifare e ciò che non ha ancora visto. La pagina mostra
una mappa stabile, non un voto di preparazione o una graduatoria di debolezze.

## 1. Fonti, precedenze e perimetro

- [Specifica di lavoro](prossima-versione.md) §5.1: quinta fetta, dopo Percorso
  e ciclo; [specifica del prodotto](specifica.md) §§4.2–4.3, 7.4, 9.10 e 10:
  **Q-DUE chiusa il 29 settembre 2026, con tutti e sette i punti**, e
  R-MAPPA-01…14. Il resoconto P-41 è nel §6 di
  [prossime-sessioni.md](prossime-sessioni.md).
- [ADR-004](adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md) e
  [progetto del client](account-client-progetto.md) §§3, 9–10: Progressi solo
  per chi ha un account; il client decide identità, lettura, invio, offline,
  conflitti e testi degli stati di accesso. [Filosofia](filosofia.md) per
  misura onesta, libertà di scegliere e numero/lista dalla stessa fonte.
- [Area 1](area-1-progetto.md) per Percorso e ritorni; [area 2](area-2-progetto.md)
  per Quiz e il distinto «Ripasso degli errori»; [area 3](area-3-progetto.md)
  per riepilogo, revisione e ritorno; [area 4](area-4-progetto.md) per le prove
  di carteggio e le tecniche, senza sommarle ai quiz.
- Letti senza modifiche `site/engine.js` (`quadro()`, `dovePesa()`, `coda()`,
  `serieGruppi()`, `sessioni()`), `site/app.html` (vista `diag`, tabelle,
  consiglio, sessioni e revisioni) e
  [eccezioni dell'interfaccia](eccezioni-interfaccia.md).

**Precedenza:** Q-DUE e P-41 sono contratti già decisi. Questo progetto ne
definisce la resa e i raccordi. I vecchi testi che chiamano l'accuratezza alla
prima risposta «quanto sai» e la lista `consigli()` «Cosa studiare adesso» non
descrivono la nuova pagina. Le soglie del §4.3 restano quelle del motore.

**Entra:** vista Progressi registrata; mappa quiz base e vela, frase facoltativa,
azioni dalla mappa, prove, andamento e sessioni separati, stati vuoti e di
errore, risoluzione dello sbordamento a 375 px. **Non entra:** motore, banca,
client account, scelta della patente, piano di studio (Q-ONBOARD), previsione
dell'esito d'esame, contabilità delle tecniche o dei Segnali, nuova metrica.
La realizzazione è P-23, dopo il client account e i controlli del §10.1.

## 2. Le sette decisioni da applicare

| Punto di Q-DUE | Resa obbligatoria nell'area 5 |
|---|---|
| 1. Forma | Al massimo una frase iniziale; otto temi base in ordine fisso con nome, peso, barra a tre stati, legenda in parole e dati sotto. Aprendo un tema, voci in ordine di banca. Sotto la mappa, prove, andamento e sessioni distinti. Nessuna classifica parallela. |
| 2. Chiusura dell'errore | La barra legge l'**ultima** risposta: una giusta sposta il quesito da «da rifare» a «giusti». Il suo primo tentativo resta quello che era. Non si aggiunge una prova più severa; [l'idea è aperta](https://github.com/ilbeca/rotta-giusta/issues/1). |
| 3. Parole e azione | «Giusti · da rifare · mai visti», con spiegazione «In base all'ultima risposta». «Rifai N errori» usa N dal segmento «da rifare» della stessa riga e apre quella lista. «Ripasso degli errori» dei Quiz continua a includere anche errori già ripresi. |
| 4. Vela | Le tre voci della vela sono righe, nell'ordine della banca; nessun peso per voce e nessuna frase «Dove pesa di più adesso». |
| 5. Primo tentativo | «X su Y giusti al primo tentativo»: interi esatti, Y uguale ai visti della riga. Conta solo la prima volta, non migliora ripassando. Con meno di cinque quesiti distinti visti: «Troppo poche risposte per dire come va», senza X né percentuale. |
| 6. Frase | Solo `dovePesa()` decide tema, motivo, ordine e selezioni dei pulsanti; quando manca, non si crea un sostituto. Servono almeno 20 quesiti distinti visti nell'insieme base. |
| 7. Tempo | Nessun minuto sui pulsanti o sulle righe di azione: non c'è una stima verificata per quelle selezioni. |

Questi punti sono l'esito deciso, non opzioni da votare nella realizzazione.

## 3. Accesso e fonte delle risposte

Progressi è una vista di **storico salvato associato a un account**. La fonte
per ridisegnarla è lo snapshot delle righe che il client attribuisce
all'account riconosciuto: specchio ricalcolato con `E.ripiega()`, banca caricata,
giorno e pesi d'esame quando disponibili nei metadati. Non persistere lo specchio né
costruire una contabilità della mappa in pagina. Dopo una ricezione, ridisegnare
dallo snapshot nuovo; una lista di Quiz già avviata rimane congelata, come nel
§10 del progetto del client.

| Stato del client | Cosa vede chi apre Progressi |
|---|---|
| Prova senza account | Niente voce Progressi nella barra. Un vecchio ingresso diretto mostra il testo del client: «I Progressi descrivono le attività salvate nel tuo account. Senza account puoi fare tutte le attività e rivedere quelle della pagina aperta.» Azioni «Vai al Percorso» e «Accedi». Nessuna mappa ricavata dalle risposte temporanee e nessun invito ripetuto su altre viste. |
| Verifica della sessione all'apertura | «Verifica dell'accesso in corso…», senza mostrare dati della copia locale prima di conoscere l'account. Le attività libere restano raggiungibili. |
| Account confermato o non ancora confermato | La mappa usa le righe di quell'account. Se l'email non è confermata, resta visibile l'avviso del client con la scadenza reale; la vista non lo nasconde né sostituisce lo stato di invio. |
| Account già riconosciuto, offline | Mappa dalla copia locale di quell'account, con l'avviso offline e lo stato delle risposte in attesa forniti dal client. Non chiamare «sul server» le nuove risposte locali. |
| `401`, cambio d'account o generazione diversa | Copia congelata, riaccesso o scelta scaricare/scartare secondo il client. Non attribuire una mappa di A a B, né presentare lo snapshot congelato come progresso aggiornato. Dopo la scelta e la nuova ricezione, ricostruire dal nuovo archivio. |
| Errore di lettura o banca indisponibile | Stato di errore con «Riprova»; non trasformare lettura fallita o banca incompleta in zero risposte. Le revisioni già disponibili seguono il client; nessuna azione apre una lista ricostruita da dati incerti. I soli pesi assenti lasciano leggibile la mappa senza peso né frase, come `dovePesa()` richiede. |

La barra, il vecchio ingresso e il blocco account vengono dal client. Qui non
nascono un secondo modulo di accesso o una politica di invio. Account vuoto
non significa utente anonimo: può vedere la mappa con tutti i quesiti «mai
visti», il testo «Non hai ancora risposto ai quiz con questo account» e le
attività libere. Nessuna preparazione positiva a copertura zero.

## 4. La mappa, dalla fonte al gesto

### 4.1 Ordine, righe e testi

Ordine del DOM e della lettura: titolo «Progressi»; eventuale frase di §5;
selettore «Quiz base / Vela»; mappa; prove sostenute; andamento; sessioni.
La scelta base/vela cambia solo la mappa, la sua frase e il suo totale. Prove,
andamento complessivo e sessioni non spariscono per effetto del selettore:
ogni sezione dice esplicitamente se contiene entrambi i tipi o mostra il
proprio filtro. Il ritorno da Quiz e dalla revisione ripristina la vista e il
focus dell'azione di partenza, senza rimescolare le righe.

Con Quiz base: una riga per ciascuno degli otto temi, nell'ordine di
`E.quadro(..., 'base', pesi).righe`, che eredita `diagnosi().temi`. Non ordinare
per errori, percentuale o `inBallo`. Ogni intestazione reca nome e, solo se
`peso` è presente, «N domande nella prova»; la barra ha tre segmenti proporzionali a
`giusti`, `daRifare`, `maiVisti` su `n`, e sotto tre etichette **con numeri**.
`giusti + daRifare + maiVisti = n`; non si disegna una percentuale unica che
nasconda gli errori. Il `?` accessibile spiega: «Giusti e da rifare seguono
l'ultima risposta a ciascun quesito. Mai visti non hanno risposte.»

Sotto ogni barra: «Visti Y su N», `primo` reso come testo esatto o il testo
sotto soglia del punto 5, poi l'azione «Rifai N errori» quando N > 0. Con N = 0,
«Nessun errore da rifare qui» come testo, senza pulsante da zero. Il titolo del
tema apre un dettaglio con le sue voci; ciascuna ripete la stessa struttura
compatta, ma **senza peso**. Tema chiuso non cancella le sue voci né le
selezioni; lo stato aperto è interfaccia, non progresso salvato.

Con Vela: `E.quadro(..., 'vela', null).righe` porta tre voci di primo livello,
nell'ordine di banca. Il loro `peso: null` non è uno zero: nessuna etichetta
«domande nella prova» per voce e nessuna classifica. La barra e il testo del
primo tentativo seguono lo stesso contratto. I totali base e vela restano
separati; nessuna media fra banche diverse.

### 4.2 Selezioni e snapshot

Una volta scelto il tipo, chiamare `E.quadro(banca, specchio, oggi, kind,
pesi)` e, solo per la base, `E.dovePesa(quadro)`. Usare il **medesimo oggetto**
di `quadro()` per testo, segmenti, dettaglio e pulsanti. La pagina non richiama
`E.diagnosi()` per rifare l'ordine o i conteggi, né `E.consigli()` per una
seconda lista. Non arrotondare `primo` in percentuale e non mostrare i suoi
numeri quando è `null`.

Per «Rifai N errori», N è `riga.daRifare` e la selezione è `riga.rifai`:
`E.coda(banca, specchio, oggi, riga.rifai)`. La selezione contiene
`soloDaRifare: true` e `n: 0`, quindi **nessun tetto**; non sostituirla con
`soloSbagliate`, che è il distinto Ripasso dei Quiz. Mostrare prima dell'avvio
il numero reale di quesiti della lista pronta. Se nel frattempo archivio o
banca cambiano, rigenerare insieme riga, numero e lista; se la selezione non
coincide o manca un quesito, non avviare una lista più corta chiamandola N.
Il runner usa la lista congelata e torna ai Progressi alla conclusione, con
il ciclo e la revisione dell'area 3.

## 5. Una sola indicazione in cima

Se `dovePesa(quadro).indicazione` esiste, mostrare il titolo «Dove pesa di
più adesso», il nome del tema e un testo breve aderente al `motivo`:

- `da rifare`: «In [tema] hai [N] risposte da rifare. È il tema con più
  domande d'esame ancora in ballo in questa mappa.»
- `mai visti`: «In [tema] ci sono [N] quesiti mai visti. È il tema con più
  domande d'esame ancora in ballo in questa mappa.»

«In ballo» significa quota non presa all'ultima risposta pesata con le
domande del tema, **non** previsione di errori alla prova. Accanto, usare
`indicazione.pulsanti` nell'ordine dato: «Rifai N errori» per `rifai`, «Prova
N mai visti» per `mai visti`. N è `quanti`, la lista è `E.coda(...,
selezione)` dello stesso pulsante; mai un pulsante da zero, mai un tempo.
Preparazione e avvio seguono la regola di snapshot del §4.2.

Se `indicazione` è `null`, **non renderizzare il blocco**: niente frase
generica, altra classifica, riquadro vuoto o invito inventato. Vale per
`assente: 'sotto soglia'` (meno di 20 visti), `'senza pesi'`, `'niente da fare'`
e `'pari'`; vale sempre sulla vela. La mappa resta leggibile e le sue azioni
restano disponibili. Non abbassare `FRASE_MIN_VISTI` per riempire lo spazio.

## 6. Risultati e storia, distinti dalla mappa

**Prove sostenute:** sotto la mappa, elenco delle prove quiz e di carteggio
effettivamente consegnate, con data, tipo, punteggio/soglia ed esito propri.
Una prova di carteggio è autovalutata; non chiamarla correzione automatica.
Nessuna prova → «Nessuna prova sostenuta ancora». Un allenamento non diventa
prova, né il suo risultato diventa voto sulla preparazione.

**Andamento:** serie delle risposte nel tempo dal motore (`serieGruppi()` e
`tendenza()` dove applicabile), con periodo e quantità dichiarati. La freccia
compare solo quando `tendenza()` la restituisce: almeno due giorni e dieci
risposte (§4.3). Grafico accompagnato da date e valori leggibili senza colore
o `title`; zero serie → «Ancora nessuna risposta da mostrare nel tempo».
Non trasformare una variazione di esatte alla prima in miglioramento della
copertura all'ultima risposta.

**Sessioni:** elenco storico da `E.sessioni(righe, { confine: 'attivita' })`,
riapribile con il ciclo di revisione dell'area 3. Include tutti i tipi di
sessione quiz, non soltanto simulazioni, e non segue silenziosamente il
selettore base/vela della mappa. Il confine ricostruito senza `sim_uid`, un
raggruppamento ambiguo e i quesiti mancanti restano dichiarati, non diventano
una sessione apparentemente esatta. Zero sessioni → «Nessuna sessione salvata
ancora». Il dettaglio aperto conserva fonte e ritorno ai Progressi.

La mappa descrive lo stato **oggi**, le prove un esito consegnato, l'andamento
una serie e le sessioni tentativi passati. Titoli, separazione visiva e testi
mantengono esplicite le quattro fonti; niente totale unico o classifica che le
mescoli. Il gioco dei Segnali conserva la sua contabilità separata.

## 7. Disposizione e accessibilità

A 375 px ogni tema e ogni voce sono una **scheda verticale**: intestazione
testuale, barra larga quanto la scheda, legenda con numeri che può andare a
capo, dati e azione su righe proprie. Nessuna tabella a colonne minime, nessun
contenuto necessario raggiungibile solo scorrendo orizzontalmente. Su desktop
si possono affiancare contenuti della stessa scheda; ordine di DOM e lettura
restano quelli del telefono. Sostituire le tabelle *Per tema* e *Per voce* che
dal 0.3.0 sforano di 89 px a 375 px; `overflow-x: auto` da solo non chiude il
difetto. Titoli lunghi, numeri grandi, testi di stato e pulsanti devono
restare entro la larghezza della pagina anche al 200% di zoom.

Il tema è un controllo con nome e stato aperto/chiuso annunciati; tastiera e
touch aprono lo stesso dettaglio. Il `?` della barra è raggiungibile e ha un
testo visibile anche al tocco; i tre stati hanno parole e cifre, non solo
colori. Focus visibile, ritorno al controllo di partenza, target almeno 44 px
e nessuna freccia affidata al solo colore. Quando dati o accesso cambiano,
annunciare lo stato senza spostare il focus sotto le mani di chi legge.

## 8. Contratti e chiamanti da preservare

| Chiamante oggi | Effetto della realizzazione |
|---|---|
| `dipingiDiag()` e `tabella()` | La vecchia diagnosi a due tabelle ordinate per «Punti persi/Tasso d'errore» diventa la mappa da `quadro()`; nessun ordinamento locale. Le altre eventuali chiamate a `tabella()` si inventariano prima di rimuoverla. |
| `dipingiConsigli()` → `E.consigli()` | La lista e i minuti escono. La chiamata a `consigli()` sparisce; nel medesimo commit spostare la funzione da «Chiamate al motore protette» agli orfani dichiarati di `eccezioni-interfaccia.md`, con motivo «esce», come prescrive specifica §4.3. Claude la toglierà dal motore in un secondo tempo. |
| `E.quadro()` e `E.dovePesa()` | Entrano come chiamate reali; nel medesimo commit escono dagli orfani e entrano fra le chiamate protette. |
| `E.coda()` nei Quiz | «Ripasso degli errori» conserva `soloSbagliate`; i pulsanti di Progressi usano `soloDaRifare` o la selezione dei mai visti già restituita dal motore. |
| Percorso, runner e revisione | Ingressi e ritorni già esistenti a Progressi restano; la revisione apre la sessione scelta e non scrive nuove risposte. |
| `serieGruppi()`, `tendenza()`, `sessioni()` | Restano fonti di andamento e sessioni; verificare gli altri chiamanti prima di cambiare contenitori o firme. |

`peggiori()` è già uscita dal motore con P-41; non farla riapparire nella
pagina. Nessun cambio di `engine.js` è richiesto dai sette punti.

## 9. Casi di accettazione della realizzazione

| Caso | Passa soltanto se |
|---|---|
| A-01, account e anonimato | In prova libera nessuna mappa o storico temporaneo; vecchio ingresso con i due testi/azioni del client. Account riconosciuto, anche non confermato o offline, mostra solo i propri dati e i propri avvisi. `401`/conflitto non mostra dati di A come dati di B. |
| A-02, fonte e ordine | Otto temi base nell'ordine di `quadro()`, voci in ordine di banca; vela con tre voci e nessun peso. Da 0 risposte a molte, per ogni riga i tre numeri sommano a N e «Visti Y su N» usa Y del motore. |
| A-03, prima risposta e soglie | `primo: null` mostra soltanto il testo sotto soglia; con cinque visti mostra interi X/Y. Ripassare modifica la barra quando cambia l'ultima risposta, senza cambiare X; niente percentuale arrotondata. |
| A-04, azioni | Per un tema e una voce con più di 20 errori aperti, numero, anteprima e runner aprono **tutti** e soli i quesiti di `riga.rifai`; i Quiz mantengono la lista storica `soloSbagliate`. I pulsanti della frase aprono `indicazione.pulsanti[].selezione`, senza minuti o pulsanti da zero. |
| A-05, frase assente | Con meno di 20 visti, parità, niente da fare, pesi assenti e vela il blocco non esiste; la mappa e le azioni valide restano. Con indicazione c'è un solo tema, motivo e ordine dei pulsanti restituiti. |
| A-06, prove/andamento/sessioni | Quattro sezioni distinte, stati vuoti veri, nessun filtro base/vela che dimezzi di nascosto la storia; soglia di `tendenza()` rispettata, sessione riaperta corretta oltre pausa e confine ricostruito dichiarato. |
| A-07, cambiamenti e guasti | Una ricezione aggiorna tutta la mappa dallo stesso snapshot; runner già aperto non cambia lista. Lettura fallita, banca mancante, `401` e generazione diversa non diventano zero o verde; Info conserva gli avvisi di scritture/scarti del client. |
| A-08, geometria e interazione | A 375 e 1280 px, con nomi lunghi, dettagli aperti, stati vuoti ed errore, `scrollWidth` della pagina e delle schede non supera `clientWidth`; nessun dato tagliato, focus/voce/stato leggibili con tastiera e touch. Misurare e **guardare** screenshot; ricontrollare al 200% con zoom reale dove disponibile. |

Le prove con persone e Safari restano Q-PROVE nella specifica: non si
attribuiscono alle suite o a un collaudo Chromium.

## 10. Dipendenze, controlli ed evidenze

### 10.1 Contatto con chi tiene motore, test e specifica

**Motore consegnato da P-41.** `quadro()` e `dovePesa()` con soglie e filtri
sono nel §4.3 della specifica e coperti da R-MAPPA-01…13. La pagina non chiede
una nuova formula. R-MAPPA-14 resta **scoperto** finché P-23 non consuma quelle
funzioni; P-22, che scrive solo documentazione, non lo chiude.

**Prima di P-23, dipendenza da Claude su `main` per test e specifica.** Come
§10.1 delle aree 2–4, preparare in `tests/test_interfaccia.py` un controllo
che riconosca il regime attuale della diagnosi e quello progettato della
mappa. Entrambi devono essere verificati durante la transizione; alla merge
resta il regime nuovo. Definire nel repo un raccordo estraibile della pagina
che, da `{ banca, progress, oggi, kind, pesi }`, chiami davvero `E.quadro()` e
`E.dovePesa()` e restituisca le righe e le selezioni **senza** ricalcolarle;
la firma precisa si fissa nel controllo prima del codice UI, insieme a P-23.
La pagina di riferimento deve passare; rotture deliberate devono fallire per
numero/lista diversa, `n` che taglia oltre 20, `soloSbagliate` al posto di
`soloDaRifare`, ordine alterato, primo mostrato sotto soglia, frase inventata
quando assente, peso vela inventato e `consigli()` ancora chiamata. Una ricerca
di stringhe o il solo test del motore non prova R-MAPPA-14. Il browser prova
anche accesso, ricezione, click, rendering e geometria di §9, con R-ACC-04;
il test della pagina non dichiara coperto il client prima della sua merge.

Il controllo degli orfani/protetti legge
`docs/eccezioni-interfaccia.md`: P-23 sposta `quadro`, `dovePesa` e
`consigli` come al §8. Claude coordina il controllo, R-MAPPA-14 e la sua
copertura nella specifica; ChatGPT su `ui/main` realizza la pagina e il file
neutro. Se il raccordo consegnato non coincide, allineare questo §10.1 **prima**
di codificare; non mantenere una classifica nascosta o abbassare test/soglie
per tenere verde la suite. P-22 non modifica quei file né la coda.

**Come lo legge il controllo — scritto da P-44, 30 settembre 2026.** La
dipendenza dei controlli è chiusa: `tests/test_interfaccia.py` riconosce il
regime di Progressi dal **raccordo**. Una pagina che dichiara al primo livello
una di queste tre funzioni è nel regime progettato, e deve dichiararle tutte:

```js
mappaProgressi(richiesta)                  // righe, totale, frase: dal motore, senza rifarli
anteprimaProgressi(azione, richiesta)      // quanti quesiti apre un pulsante adesso, o niente
avviaProgressi(azione, richiesta, avvia)   // Inizia: la lista dell'anteprima, o niente
```

Devono dipendere solo dai loro argomenti, da `E` e da altre funzioni dichiarate
al primo livello: il controllo le estrae e le esegue senza DOM e senza `S`.
Senza nessuna delle tre, la pagina è nel regime attuale, e lì non deve chiamare
`E.quadro` né `E.dovePesa`, né scrivere «Rifai N errori», `soloDaRifare` o «Dove
pesa di più»: sarebbe la mappa senza il raccordo, un numero con una seconda
fonte. E la diagnosi di oggi — `dipingiDiag()`, `E.diagnosi()`, le tabelle
`d-temi` e `d-voci` — resta finché la mappa non c'è.

`richiesta` è `{ banca, progress, oggi, kind, pesi }`: la banca caricata; lo
specchio dell'account ricalcolato con `E.ripiega()` (§3); il giorno; `'base'` o
`'vela'`, il selettore della mappa; `meta.pesi_esame`, oppure `null` quando i
metadati non li hanno. La richiesta non si scrive: il controllo la congela.

`mappaProgressi()` chiama **una volta** `E.quadro(banca, progress, oggi, kind,
pesi)` e, sulla base, **una volta** `E.dovePesa()` sul **medesimo oggetto**;
nessun'altra funzione che conti o scelga — né `diagnosi()` per l'ordine, né
`consigli()`, né `classifica()` per ricontare. Restituisce
`{ kind, righe, totale, indicazione, assente }`:

- `righe` sono le righe di `quadro()`, **nello stesso ordine**, e le `voci` di
  ciascun tema nel loro: ogni campo che il motore dà — `nome`, `peso`, `n`,
  `giusti`, `daRifare`, `maiVisti`, `visti`, `primo`, `filtro`, `rifai` — resta
  com'è. `primo` resta `null` sotto soglia, `peso` resta `null` sulle voci e
  sulla vela. In più ogni riga porta `azione`, il suo «Rifai N errori»:
  `{ azione: 'rifai', quanti: riga.daRifare, selezione: riga.rifai }`, oppure
  `null` quando `daRifare` è zero — mai un pulsante da zero. La pagina può
  aggiungere campi suoi, come lo stato aperto di un tema; non cambiarne.
- `totale` è quello di `quadro()`.
- `indicazione` e `assente` sono quelli di `dovePesa()`: sulla vela
  `indicazione: null` e `assente: 'senza pesi'`, chiamando o no `dovePesa()`.
  Quando `indicazione` è `null` la pagina non ne mette un'altra. I pulsanti
  della frase sono `indicazione.pulsanti`, ognuno già `{ azione, quanti,
  selezione }`.

`anteprimaProgressi(azione, richiesta)` riceve un'azione — di una riga o della
frase — e chiama **una volta** `E.coda(banca, progress, oggi,
azione.selezione)` con la selezione com'è: senza tetto, `soloDaRifare` e non
`soloSbagliate`. Restituisce `{ stato: 'pronta', quanti, lista }` solo quando
la lista ha esattamente `azione.quanti` quesiti; altrimenti `{ stato:
'cambiata', quanti: null, lista: [] }` — una lista diversa dal numero promesso
non si apre chiamandola N, e la pagina rifà la mappa. Può chiamare anche
`quadro()` e `dovePesa()` per rifarla; nessun'altra selezione.

`avviaProgressi(azione, richiesta, avvia)` fa la stessa verifica e, solo se
l'anteprima è `'pronta'`, chiama **una volta** `avvia(lista, modo, opt)` con
la lista dell'anteprima, e restituisce `{ avviata: true, quanti }`;
altrimenti `{ avviata: false, stato }`. `modo` e `opt` sono della pagina — il
controllo non li legge. La pagina passa come `avvia` il suo `apri()`, anche
dentro una freccia; disegna la mappa da `mappaProgressi()`; fuori dalle tre
funzioni non chiama `E.quadro` né `E.dovePesa`; e `E.consigli` non si chiama
più, in nessun punto (§8).

Il controllo esegue il raccordo con la banca vera e sei storici: uno con 35
errori aperti in un tema, 25 in una sua voce e tre errori già ripresi —
`soloSbagliate` ne aprirebbe 38 —, righe sopra e sotto la soglia di «X su Y», e
la vela; lo stesso sulla vela, con i pesi nella richiesta; cinque risposte,
sotto la soglia della frase; senza pesi; nessuna risposta; tutto giusto; e
quasi tutto giusto, dove la frase parla degli errori da rifare con i suoi due
pulsanti. I pesi della richiesta hanno due temi scambiati rispetto al decreto:
una pagina che li scrive a mano esce rossa. Poi apre ogni azione — il tema, la
voce, i pulsanti delle due frasi — e fra un passo e l'altro cambia i dati: una
risposta in un altro tema e la banca ricaricata non cambiano niente; un errore
del tema ripreso, un errore nuovo nel tema e un azzeramento devono fermare
anteprima e Inizia; riaperta la mappa, numero e lista tornano insieme.

La pagina di riferimento `tests/pagina-mappa-progressi.html` mostra la forma
minima che passa; non è un disegno. Il controllo gira su di lei e su 23 sue
rotture a ogni esecuzione — le otto del paragrafo qui sopra, in dieci rotture,
e tredici nate provandolo —, finché la pagina pubblicata è nel regime attuale.
**Dal 30 settembre 2026 (P-47) il regime attuale non c'è più:** P-23 ha portato
la mappa nella pagina vera, il banco gira su ogni pagina come su una pagina con
il raccordo, e una pagina senza di lui — o con le tabelle `d-temi` e `d-voci`
accanto alla mappa, la ventiquattresima rottura — è rossa. La pagina di
riferimento resta, per le rotture.

**Che cosa il controllo non vede**, e resta al collaudo del §9: i testi
(«Visti Y su N», «X su Y giusti al primo tentativo», «Troppo poche risposte per
dire come va», «Dove pesa di più adesso»), il disegno della barra e della
legenda, il dettaglio che si apre, il focus e i ritorni, la geometria a 375 e
1280 px, gli stati d'accesso del §3 con il client (A-01), prove, andamento e
sessioni (A-06), il ridisegno dopo una ricezione (A-07). Un disegno che
scrivesse numeri presi da un'altra parte invece che dal risultato di
`mappaProgressi()` passerebbe: del collegamento il controllo legge soltanto
che il raccordo sia l'unico a chiedere la mappa e che Inizia passi da lui.

**Due cose per P-23 che il §8 non dice.** `E.diagnosi()` ha un solo chiamante
in pagina, `dipingiDiag()`: quando la vecchia diagnosi esce, esce anche la
riga `diagnosi` dalle «Chiamate al motore protette», nello stesso commit — la
funzione resta viva nel motore, perché `quadro()` la usa. E `E.serieGruppi()`
oggi lo chiama solo `dipingiDiag()`, per le barrette: se l'andamento del §6 lo
chiama da un'altra funzione, la riga resta; se l'andamento esce, esce con lui.

### 10.2 Evidenze di P-22 e limiti

P-22 ha letto il contratto del motore, le decisioni Q-DUE, il progetto del
client e la pagina attuale. La tabella attuale sta in due contenitori con
`overflow-x: auto`, e la specifica e il CHANGELOG registrano il difetto di
89 px a 375 px dalla 0.3.0. La chiusura è **criterio di P-23**, non un difetto
già riparato da questo documento. Nessun browser, persona o account di
produzione è stato usato per validare la nuova interfaccia in questa sessione.
