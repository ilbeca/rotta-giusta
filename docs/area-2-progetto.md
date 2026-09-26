# Area 2 — Quiz: cinque intenzioni con gerarchia

**Sessione P-04, decisioni di progetto del 26 settembre 2026, da realizzare.**
Consegna documentale sul modello di [Area 1](area-1-progetto.md): testi,
disposizione, stati, flussi, contratti e criteri di accettazione. Non è una
verifica di usabilità né una schermata già realizzata. Questa sessione modifica
solo questo documento e il CHANGELOG. L'ordine e i prompt restano esclusivamente
in [prossime-sessioni.md](prossime-sessioni.md).

## 1. Fonti, precedenze e perimetro

Letti i capitoli **8, 9 e 11** della *Specifica della nuova esperienza e
interfaccia*, revisione del 12 settembre 2026, copia esterna al repo
`Rotta-Giusta-Specifica-UX-UI (1).docx`, SHA-256
`b3384dc24d62245e6315a78205d3b240c271dc1ebc17cf37274f805a702f6cc4`.
Le scelte necessarie sono riportate qui: chi realizza non deve recuperare il Word.

Riferimenti del repository:

- [Specifica di lavoro](prossima-versione.md), §§4, 5.1, 6 e 8: area 2,
  tempo, contratti e accettazione.
- [Specifica del prodotto](specifica.md), §§2, 4–9: selezioni, ingressi,
  banca vela, archivio e garanzie.
- [Decisioni aperte](decisioni-aperte.md), punti 1, 2 e 5: cinque intenzioni,
  screening senza promessa diagnostica, limiti del riscontro breve.
- [ADR-004](adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md),
  [filosofia](filosofia.md), [progetto account](account-progetto.md), §§8.5,
  9.6, 10, 12 e 13.3: prova libera, permanenza dei dati e preferenze.
- [Eccezioni dell'interfaccia](eccezioni-interfaccia.md): `lunghezzaScreening`
  è ancora orfana; la pagina conta in `totScreening()` leggendo `meta.json`.
- `site/app.html`: `MODI`, `SUB`, `costruisciFiltri()`, `gruppiEffettivi()`,
  `selezione()`, `anteprima()`, `avviaSim()`, ingressi dal Percorso e da
  Progressi; `site/engine.js` e i controlli delle modalità, letti senza edit.

**Precedenza:** il prompt P-04 e le decisioni degli ADR/account prevalgono
sulle promesse di conservazione dell'area 1 e del Word. Il §4 della specifica
di lavoro prevale sulle durate fisse. Il nome scelto è **Un giro tra gli
argomenti**, senza variante A/B in questa consegna. Il punto 5 impedisce di
promettere una diagnosi anche chiamandola «primi indizi».

**Entra:** vista Quiz, gerarchia e nomi delle cinque intenzioni, configurazioni
locali, anteprime, ricablaggio dello screening, preparazione della simulazione,
titolo e ritorno del runner per conservare il contesto. Le nuove spiegazioni
sostituiscono quelle di modalità, non i testi ministeriali.

**Non entra:** redesign generale del runner, cambio del modello di risposta,
consegna e timer, riepilogo generale e «riprova questi N» (area 3), Carteggio,
Progressi, Percorso, vetrina, ambiti entro 12/estensione, client o server account.
L'area 2 non risolve Q-ONBOARD e non crea una mappa del programma d'esame.

## 2. Decisioni da applicare

| Decisione | Scelta e motivo |
|---|---|
| Cinque intenzioni | **Allenamento consigliato / Scegli un argomento / Ripassa gli errori / Simula la prova / Un giro tra gli argomenti**. Le chiavi interne restano `mirata`, `argomento`, `sbagliate`, `sim`, `screening`. |
| Gerarchia | Una proposta principale, scelta per argomento subito visibile, ripasso e simulazione come righe riconoscibili; il giro in «Altri modi di esercitarti». Nessuna griglia di cinque tessere equivalenti. |
| Batteria | Sparisce come ingresso e configurazione. Il suo mestiere resta in «Scegli un argomento» con «Tutti gli argomenti». Le righe storiche `mode: 'batteria'` restano leggibili. |
| Consiglio | Fino a **25 quiz base** da `E.mirata()`, anche senza archivio. I 10 del primo ingresso appartengono al Percorso; non si sposta quel flusso qui. |
| Filtri | Locali alla configurazione dell'attività; «Solo domande mai fatte» compare soltanto nella scelta per argomento. Nessun filtro visibile viene ignorato. |
| Giro | Conserva 1, 2, 4, 6 per voce; default 1. Le profondità maggiori sono una scelta ulteriore, non una diagnosi più affidabile promessa dalla UI. |
| Simulazione | Selezione della prova e avvio distinti. «Base e vela» sostituisce «Completa», perché non comprende Carteggio. |
| Anteprima | Quantità effettiva e runner dalla stessa lista in memoria; lo screening usa anche `E.lunghezzaScreening()` per le opzioni. Nessuna pescata nuova al click. |
| Continuità | Risposte e preferenze seguono il regime reale del prodotto (§3); nessuna lista prospettica persistente e nessun «Riprendi la prova» dopo ricarica. |
| Riscontro | Scopo e comportamento prima dell'avvio. La scelta del tocco immediato, auto, note e tastiera mantiene il comportamento esistente. |

Queste sono scelte operative per l'area, non risultati validati con persone.
La rimozione di Batteria richiede l'allineamento dei controlli su `main` (§10),
non un aggiramento della suite da parte di chi realizza l'interfaccia.

## 3. Che cosa si ricorda: tre regimi, senza anticipare gli account

Gli account **non sono ancora nel prodotto**. Il ridisegno può essere realizzato
prima: non cambia da solo il regime di archivio, non presenta accessi o
registrazioni inesistenti. I testi dei tre stati qui sotto sono contratti per
il rilascio che li abilita, non tre alternative lasciate a chi implementa.

| Regime reale | Fonte al motore | Testo prima dell'avvio |
|---|---|---|
| Prodotto attuale, prima degli account | Archivio locale letto con successo, ripiegato nel modo esistente | «Puoi fermarti quando vuoi. Le risposte date restano in questo browser; la lista corrente non si riprende dopo una ricarica.» |
| Prova senza account, dalla versione account | Soltanto righe in memoria della pagina aperta | «Puoi provare tutte le attività senza account. Le risposte restano solo finché questa pagina è aperta: chiudendola o ricaricandola le perdi.» |
| Account con accesso, dalla versione account | Righe dell'account e copia offline, ripiegate; stato di salvataggio reale | «Le risposte si salvano nel tuo account. Puoi fermarti quando vuoi; la lista corrente non si riprende dopo una ricarica.» |

Questa informazione compare nella configurazione **prima** del pulsante di
avvio; senza account ricompare alla fine, anche se si interrompe. L'area 3 e il
client account consumano questo contratto per il riepilogo. Senza account il
testo finale è: «Queste risposte restano solo nella pagina aperta. Se la chiudi
o la ricarichi le perdi.» L'invito di registrazione alla fine usa il progetto
account §10, una volta nel contesto pertinente, e non accompagna ogni scelta
di filtro. Registrarsi porta le righe in memoria tramite unione per `uid`,
non salva lo specchio né la lista futura.

L'account in attesa di conferma non si spaccia per prova anonima: segue il
contratto del client in `account-progetto.md` §9.6, con avviso della data di
cancellazione dopo sette giorni senza conferma. La scheda Quiz mantiene
visibile quell'avviso; non implementa qui verifica email, scadenza o accesso.

**Senza account tutte le cinque attività restano disponibili.** Mirata e giro
usano ciò a cui si è risposto nella pagina aperta; Ripassa gli errori usa gli
errori di quella pagina, anche di più attività appena svolte. Non è un accesso
ai Progressi né un archivio durevole. Senza risposte la sua selezione è vuota,
non vietata dalla registrazione. Con account usa l'archivio dell'account;
prima degli account usa quello locale. Non mostrare un confronto con ieri a
chi prova, né una diagnosi del livello sulle risposte appena date.

I nuovi stati di configurazione dell'area 2 e gli snapshot sono **in memoria**,
distinti per attività; non aggiungere chiavi `localStorage`, cookie o righe
di archivio per conservarli. Restano durante la pagina aperta e tornano ai
default al ricaricamento. Il client account potrà conservare preferenze di
dispositivo legate all'account secondo §13.3, cancellandole all'uscita: ciò
non rende persistente lo snapshot. Senza account nemmeno le preferenze si
salvano. L'area 2 non cancella vecchie chiavi o archivi per «pulizia» e non
realizza la migrazione: l'archivio preesistente segue §12 del progetto account.

**Errore prevalente:** una lettura fallita non è uno storico vuoto. Nel prodotto
attuale/registrato mostrare «Non riusciamo a leggere le risposte. Apri Info per
controllare l'archivio.» e «Apri Info». Bloccare consiglio e ripasso che
richiedono quella lettura, senza inventare uno storico vuoto; la simulazione,
che non ne dipende, resta raggiungibile con rischio di salvataggio dichiarato.
Una scrittura fallita sostituisce ogni garanzia con «Le ultime risposte
potrebbero non essere salvate. Apri Info e scarica i progressi adesso.»;
mantenere pallino e riga di errore. Per l'account offline con copia leggibile:
«Le risposte restano su questo dispositivo in attesa di sincronizzazione.»
Non dichiararle già sul server. I dettagli della sincronia sono del client.
Se è leggibile soltanto l'archivio alternativo (`ARCH.nota`), mantenerne l'uso
dichiarando «Stiamo usando un archivio alternativo: potresti non vedere tutte
le risposte precedenti.» Non convertirlo né in errore totale né in storico
completo; il blocco riguarda l'assenza di qualsiasi fonte leggibile.

## 4. La vista Quiz e i suoi ingressi

**Scopo:** decidere come esercitarsi senza dover conoscere sei algoritmi.
Serve chi vuole un suggerimento, chi segue un argomento studiato a scuola e
chi vuole ripassare o provare il timer. Deve dare controllo, senza un percorso
obbligatorio. Nessun audio nuovo.

Ordine del DOM, uguale a 375 e 1280 px:

1. Intestazione e barra esistenti, Info con gli avvisi attivi.
2. `h1` **Quiz**; introduzione «Scegli come esercitarti con i quiz base o vela.
   Puoi cambiare attività quando vuoi.»
3. Proposta compatta **Allenamento consigliato**, descrizione «Una selezione
   di quiz base a partire dalle risposte disponibili qui. Ogni domanda dice
   perché è stata proposta.» Pulsante principale «Apri l'allenamento
   consigliato»: apre la configurazione, non il runner.
4. Porta ben visibile **Scegli un argomento**, descrizione «Scegli i quiz base
   o vela e gli argomenti che vuoi esercitare.» Pulsante omonimo.
5. Due righe con pulsanti **Ripassa gli errori** e **Simula la prova**,
   descrizioni rispettivamente «Rivedi i quesiti sbagliati nelle risposte
   disponibili qui.» e «Esercitati con composizione, timer e soglia della
   prova scelta.» Nessun menu necessario per trovarle.
6. Disclosure **Altri modi di esercitarti**, chiusa all'ingresso: contiene la
   porta **Un giro tra gli argomenti**, descrizione «Incontra tutte le voci
   della banca scelta, con pochi quesiti per ciascuna.»

Un ingresso apre **una sola configurazione** nella stessa vista `quiz`, con
`h2` corrispondente, e porta lì il focus. Il menu delle intenzioni rimane
raggiungibile con «Cambia attività», che torna alla lista e al controllo
d'origine. Il disclosure rimane aperto se si torna dal giro. Nessun avvio
automatico entrando da barra, Percorso, suggerimento o Progressi.

Da Percorso «Scegli un argomento» apre direttamente `argomento`; «Simula la
prova dei quiz» apre `sim`. Da «Allena questa voce» si apre la medesima
configurazione per argomento, banca e voce esplicite; si azzerano per
**quell'ingresso** solo-mai-fatte e solo-figura, come il comportamento attuale,
e si mostra «Tutti i quesiti di questa voce», quantità Tutte. Titolo e ritorno
conservano l'origine: «Torna ai Progressi» o «Torna al Percorso». Non si
eredita un filtro di un'altra attività. La porta COLREG → Segnali resta nella
configurazione per argomento, distinta come extra fuori dalla copertura.

## 5. Configurazioni e testi per esteso

### 5.1 Allenamento consigliato

Titolo **Allenamento consigliato**. Testo «Quiz base selezionati dalle risposte
disponibili qui e dalla distribuzione dei quesiti per tema. La selezione non
conosce lo studio che hai fatto altrove.» Quantità **{N} quiz base** dalla
lista, massimo 25; nessun controllo base/vela o quantità che il consiglio
ignorerebbe. Azione «Inizia l'allenamento».

Aiuto richiudibile «Come vengono scelte le domande?»:
«La selezione può includere domande da ripassare, domande mai incontrate qui
e conferme. Il motivo di ciascuna compare durante l'attività.» Conservare i
motivi restituiti dal motore, senza analizzare `perche` per inventare conteggi
diagnostici. Non scrivere «dove rende di più» o «punti recuperati al minuto»
come promessa di risultato della persona.

Se la lista è vuota: «Non ci sono quesiti in questa selezione. Puoi scegliere
un argomento o simulare una prova.» Due azioni omonime, avvio disabilitato con
motivo leggibile. Non sostituire Mirata con `daAllenare()` o pescata casuale.

### 5.2 Scegli un argomento

Titolo **Scegli un argomento**. Testo «Puoi scegliere uno o più argomenti,
oppure allenarti su tutti. Vedrai la risposta ufficiale dopo ogni domanda.»

Ordine: Banca → riepilogo argomenti → filtri attivi → Quante → anteprima e
conservazione → «Inizia i quiz». Default **Quiz base / Tutti gli argomenti /
20 / filtri spenti**. Quantità 20, 50, 100, Tutte (`n:0`); se la lista è più
corta mostrare il numero reale, non il limite scelto.

«Scegli gli argomenti» apre un pannello con spunte multiple. Base: temi,
e voci quando c'è un solo tema selezionato. Vela: un solo elenco delle voci,
senza duplicare temi e voci. Etichette intere della banca; nessuna tassonomia
inventata. Conteggi di banca da item caricati, non costanti della pagina.
Non esporre qui accuratezze, semafori o graduatorie dei Progressi.
Per una voce con nome vuoto usare «Voce senza nome nel decreto» solo come
etichetta di presentazione; il valore passato al motore resta quello della banca.

Nessuna spunta significa **Tutti gli argomenti**; azioni «Seleziona tutti» e
«Azzera la selezione» (aiuto: «Torna a tutti gli argomenti»), mai «Nessuno».
Con un solo tema e nessuna voce: «Tutte le voci di {tema}». Con più temi si
azzera la restrizione per voce e si dichiara «Valgono tutte le voci dei temi
selezionati». Il cambio banca azzera temi e voci, conserva quantità e filtri
compatibili nella sola attività; non applica nomi base alla vela.

Pannello **Filtri**, aperto su richiesta:

- «Solo domande mai fatte». Aiuto «Include soltanto quesiti a cui non hai
  ancora risposto qui.» Con prova senza account, sostituire *qui* con
  «in questa pagina aperta». Parametro `stati:['nuovo']`, non una regola UI.
- «Solo quesiti con figura». Mostrare quanti ne passano nel filtro corrente,
  dalla stessa selezione di motore. Se l'intera banca non ha figure, spegnere
  e disabilitare: «Questa banca non ha quesiti con figura.» Se solo il filtro
  corrente ne ha zero, mantenerlo selezionato e dire che la selezione è vuota.

Fuori dal pannello rimangono visibili banca, temi/voci e filtri attivi, ciascuno
con rimozione nominata («Rimuovi filtro Solo domande mai fatte», ecc.).
«Rimuovi tutti i filtri» azzera temi, voci, solo-mai-fatte e solo-figura;
non cambia banca o quantità. «Applica» chiude aggiornando l'anteprima; «Annulla»
ed Esc ripristinano la configurazione precedente. Le modifiche nel pannello
sono una bozza in memoria, non uno stato salvato prima di Applica.

Anteprima normale: «{totale} quesiti disponibili con questa selezione.
Ne aprirai {N}.» Se `daFare > 0`, aggiungere «{daFare} mai incontrati o da
ripassare; gli altri sono disponibili per il ripasso.» Se `daFare === 0` e
la lista non è vuota: «Qui restano quesiti di ripasso.» Con solo-mai-fatte:
«{totale} quesiti mai incontrati con questa selezione. Ne aprirai {N}.»
Non chiamare `lista.length` arretrato, non dire «prima i mai visti» quando gli
errori aperti precedono i nuovi. Aiuto sull'ordine: «Prima gli errori ancora
da ripassare e i quesiti mai incontrati, poi gli altri quesiti di ripasso.»

Vuoto: «Nessun quesito con questi filtri. Modifica i filtri o rimuovili.»
Se è solo-mai-fatte: «Nessun quesito mai incontrato con questi filtri.
Puoi togliere Solo domande mai fatte per ripassare.» Avvio disabilitato,
azioni «Modifica i filtri» e «Rimuovi tutti i filtri». Mai «sono tutti chiusi»
come spiegazione di una lista azzerata dalle figure.

### 5.3 Ripassa gli errori

Titolo **Ripassa gli errori**. Testo «Rivedi i quesiti sbagliati almeno una
volta nelle risposte disponibili qui. Restano disponibili anche dopo una
risposta corretta; quelli ancora da ripassare vengono prima.» Niente promessa
di ordine «dal più recente»: il motore ordina prima non ripresi, poi ultima
attività crescente e, a parità, ultimo errore decrescente.

Banca base/vela, argomenti multipli e quantità 20/50/100/Tutte come §5.2.
Default base, tutti, 20. Nessun filtro solo-mai-fatte né solo-figura in questa
configurazione. «{totale} quesiti sbagliati almeno una volta con questa
selezione. Ne aprirai {N}.» Azione «Inizia il ripasso».
Il pannello di personalizzazione qui contiene solo gli argomenti: la rimozione
dei filtri azzera soltanto temi/voci del ripasso, non i filtri di altre attività.

Senza account aggiungere «Sono gli errori delle attività svolte in questa
pagina aperta.» Vuoto senza restrizioni: «Non ci sono quesiti sbagliati nelle
risposte disponibili qui. Puoi scegliere un argomento o simulare una prova.»
Vuoto con restrizioni: «Non ci sono quesiti sbagliati con questi filtri.
Puoi cambiare argomenti o rimuovere i filtri.» Non scrivere «nessun errore»
come giudizio sulla preparazione; mantenere la scelta delle altre attività.

Questa selezione **non** è «Errori di questa attività». L'area 3 userà
`erroriSessione()` e l'identificativo della sessione per quella porta; qui
si conserva `coda({soloSbagliate:true})` sull'intera fonte disponibile.

### 5.4 Un giro tra gli argomenti

Titolo **Un giro tra gli argomenti**. Default base e 1 per voce. Testo:
«Con una domanda per ogni voce incontri tutti gli argomenti della banca
scelta. Un errore può suggerire che cosa approfondire; una risposta corretta
non dimostra padronanza dell'argomento.»

Banca base/vela; nessun filtro per temi, voci, figure, solo-mai-fatte o
quantità totale. Testo «Il giro comprende tutte le voci. In ciascuna propone
prima quesiti mai incontrati qui, se ce ne sono; può includere quesiti già
fatti.» Opzione visibile «1 per voce · {N1} domande». Disclosure **Più quesiti
per voce**: opzioni 2, 4, 6, ognuna con il proprio numero effettivo. Aiuto
«Da una voce con pochi quesiti prenderemo solo quelli disponibili.»

Con `perVoce > 1`, sostituire la prima frase con «Fino a {perVoce} domande
per ogni voce della banca scelta.» Anteprima «Quiz {base|vela}: {N} domande.
Il giro comprende tutte le voci della banca.» Azione «Inizia il giro».
Non moltiplicare il numero di voci per la profondità; niente «una per voce × N».
Nessuna durata fissa, promessa di scoprire debolezze o diagnosi al riepilogo.
Una banca vuota segue §8, non si trasforma in giro completato.

### 5.5 Simula la prova

Titolo **Simula la prova**. Testo «Le domande sono estratte con le regole della
prova scelta, senza tener conto delle tue risposte precedenti. La correzione
arriva alla fine. Il risultato riguarda questa simulazione: non garantisce
l'esito dell'esame.» Nessun prerequisito di copertura o account.

Tre scelte esclusive, default **Quiz base**: **Quiz base / Quiz vela /
Base e vela**. Toccarle prepara la scheda, non avvia il timer. Parametri da
`meta.prove.base`, `meta.prove.vela` e `pesi_esame`, non costanti nuove:

- Base: «{n} domande · {minuti} minuti · massimo {errori_max} errori».
- Vela: stessa forma, senza chiamare la banca attuale «a tre risposte».
- Base e vela: due righe con condizioni separate e testo «Prima i quiz base,
  poi i quiz vela. Due prove, con timer ed esito separati. Il carteggio non è
  incluso.» Conservare la porta di passaggio fra fasi: il secondo timer non
  parte dal riepilogo della prima senza il comando della persona.

Mostrare composizione base come approfondimento «Come è composta la prova»;
non confondere la ripartizione per voce del prodotto con quella ministeriale
per tema. Testo di continuità del §3 e «La prova si avvia quando premi Inizia
la prova. Se esci o ricarichi, non riprendi il timer e la lista da dove eri.»
Pulsante **Inizia la prova** unico, distinto dal selettore.

Non esistono filtri personali in questa scheda. Un filtro impostato altrove
non ne cambia la composizione. Tempo e soglie sono condizioni della prova,
non stime di durata, quindi si mostrano anche senza risposte misurate.
Non aggiungere ritorno a domande, cambio risposta o tempo esteso che il runner
non serve oggi. Scadenza e consegna conservano le regole esistenti.

## 6. Contratti di selezione e snapshot

Notazione: `items = S.banca`, `prog` è lo specchio della fonte del §3,
`oggi` la data locale; `g` è `{temi, voci}` per base oppure **solo `{voci}`**
per vela. Gli array vuoti significano tutti. `n` è un tetto, `0` significa
Tutte. Non cambia nessuna funzione del motore.

| Ingresso | Chiamata / parametri | Lista annunciata e aperta |
|---|---|---|
| Allenamento consigliato | `E.mirata(items, prog, oggi, {n:25, kind:'base', pesi:S.meta.pesi_esame, esame:S.date.esame})` | Un solo risultato; `N = risultato.length`, lista `x.it` e motivi per ID dallo stesso risultato. |
| Scegli un argomento | `E.daAllenare(items, prog, oggi, kind, {...g, soloFigura})` | `lista` intera e `daFare`; applicare soltanto il tetto `n` con slice per la lista di avvio. |
| Argomento, solo mai fatte | `E.coda(items, prog, oggi, {kind, ...g, soloFigura, stati:['nuovo'], n:0})` | Risultato intero per totale, medesimo slice per avvio; nessun `daFare` ricalcolato dagli stati. |
| Ripassa gli errori | `E.coda(items, prog, oggi, {kind, ...g, soloSbagliate:true, n:0})` | Totale dal risultato, medesimo slice per avvio. Nessun filtro `stati:['nuovo']`. |
| Giro: conteggi opzioni | `E.lunghezzaScreening(items, perVoce, kind)` | Conteggio dalla banca per ciascuna opzione; R-SEL-11. |
| Giro: lista | `E.screening(items, prog, oggi, perVoce, kind, seme)` | Uno snapshot, `N = lista.length`, uguale al conteggio dell'opzione scelta. |
| Simulazione base | `E.simulazione(items, prog, oggi, S.meta.pesi_esame, seme)` | Nessun filtro dello storico o della UI; esclude gli oscurati. |
| Simulazione vela | `E.simulazioneVela(items, prog, oggi, S.meta.prove.vela.n, seme)` | Nessun filtro personale; quantità dal contratto e dalla configurazione. |
| Base e vela | Due snapshot con le chiamate precedenti | Condizioni e liste distinte; `mode:'simulazione'` e identità separate come nel flusso attuale. |

Quando si apre una configurazione o si applica un filtro si prepara uno
snapshot in memoria: configurazione, fonte, giorno, lista, eventuali motivi.
Il seme delle pescate si fissa lì; il click **non** richiama `selezione()` con
un seme diverso. L'import, le risposte appena date, un cambio di account,
giorno o banca invalidano la selezione e ridisegnano quantità e motivi insieme.
Se la fonte cambia fra anteprima e click, aggiornare prima l'anteprima e
chiedere un nuovo click sull'avvio, senza partire con un elenco non visto.
Il doppio click non crea due runner o due identità di attività.

Per lo screening la sostituzione è completa: eliminare **definizione e tutti
i chiamanti di `totScreening()`**, usare `E.lunghezzaScreening(S.banca, pv,
kind)` per le opzioni e confrontare il risultato con lo snapshot scelto.
Se divergono, bloccare l'avvio e mostrare «La selezione è cambiata. Riapri il
giro per aggiornare le domande.» Non correggere il numero silenziosamente né
aprire una lista sostitutiva. Nel medesimo commit di realizzazione togliere
`lunghezzaScreening` dagli orfani di `eccezioni-interfaccia.md` e aggiungerla
alle chiamate protette. **In P-04 l'eccezione resta:** nessuna pagina la chiama
ancora. Nessun export nuovo è necessario per questa area.

## 7. Tempo, runner e ritorni

Nelle configurazioni di allenamento usare la regola dell'area 1 §6.2:
`E.ritmo()` sulle righe `_t:'q'` della **banca pertinente**, con ritmo
affidabile passato come `msPerDomanda` a
`E.stimaImpegno(prog, lista.length, 1, ...)`; durata solo con fonte
`orologio`. Base non usa tempi vela e viceversa. Sotto soglia o con fonte
`cronometro`/`ripiego`, nessun minuto stimato, neppure negli aiuti o negli
attributi accessibili. Testo «Puoi fermarti quando vuoi» e conservazione del
§3. Con stima: «Durata stimata: circa {minutiTotali} minuti», singolare per 1,
«meno di un minuto» per 0 e lista non vuota. Non calcolare medie o correttivi
in pagina; non introdurre un selettore di minuti. La simulazione usa i propri
limiti anche se non esiste un ritmo affidabile.

Nel runner cambiano solo titolo, indicazione della banca, spiegazione della
prima risposta e contesto di ritorno. Titolo coerente con l'ingresso:
Allenamento consigliato / Quiz per argomento / Ripasso degli errori /
Un giro tra gli argomenti / Simulazione quiz base o vela. Prima risposta negli
allenamenti: «Tocca una risposta per vedere quella ufficiale.» Conservare
numero ministeriale, note prima/dopo, figure, protezione dal doppio tocco,
scorciatoie senza modificatori, modalità auto esplicita e tag N/L/C di P-01.
Non si modificano qui alt generico e revisione generale, assegnati all'area 3.

Righe nuove: `mode` conserva `mirata`, `argomento`, `sbagliate`, `screening`
o `simulazione`; non introdurre stringhe dai titoli tradotti. Righe vecchie
`batteria` restano «Batteria (attività precedente)», senza riscriverle o
eliminarle. Le porte attuali che avviano `batteria`, compresa «Allena» dal
Percorso, passano alla configurazione `argomento` senza restrizioni e con
quantità Tutte; continuano a usare `daAllenare()`. Le prime attività del
Percorso conservano il loro contratto, non entrano in questa migrazione.
Un vecchio `filtro.modo === 'batteria'` si normalizza ad `argomento`, tutti
gli argomenti, filtri spenti, senza fare una migrazione delle risposte.

Si conserva in memoria origine, controllo d'origine e configurazione.
Uscita/riepilogo torna alla configurazione pertinente o alla destinazione
esplicita d'origine, col focus ripristinato. Se non esiste origine valida:
Quiz. «Cambia attività» non riprende una lista precedente. L'area 3 aggiungerà
il passo successivo e il ripasso della sessione senza sostituire questi ritorni
con il ripasso di tutto lo storico.

## 8. Caricamento, errore e offline

| Stato | Testo e azione |
|---|---|
| Banca in caricamento | «Caricamento dei quiz…». Nessun numero zero provvisorio e nessun avvio abilitato. |
| Banca non raggiungibile | «Non riusciamo a caricare i quiz. Controlla la connessione e riprova.» → «Riprova»; Info raggiungibile. |
| Configurazione prove assente/incoerente | «Non possiamo verificare le condizioni della prova. Riprova a caricare i dati.» Bloccare il timer, non riempire con costanti. Verificare che lista e quantità prevista coincidano prima dell'avvio. |
| Archivio vuoto leggibile | Attività libere, messaggi vuoti pertinenti; nessun voto, semaforo o invito obbligatorio a registrarsi. |
| Archivio non leggibile | Errore del §3; mai «non hai ancora sbagliato» o una falsa prima visita. |
| Selezione azzerata dai filtri | Numero 0 esplicito, spiegazione e correzione del §5; nessun click senza effetto. |
| Offline con banca disponibile | «Sei offline. Puoi usare i quiz disponibili su questo dispositivo.» Conservazione secondo regime e stato, non una garanzia indistinta. |
| Figure non disponibili | Avviso prima dell'avvio «Alcune figure potrebbero non essere disponibili offline. Apri Info per controllarle.» Solo se la verifica reale lo indica. Nel runner il motivo compare al posto della figura; mai saltarla e cambiare lista in silenzio. |
| Scrittura fallita | Avviso del §3 anche sopra il runner e nel riepilogo, Info e recupero disponibili. |

Nessun filtro o schermata nuova nasconde gli avvisi urgenti. Una ricarica
non ricrea posizione o timer; senza account non ricrea neppure righe o filtri.
L'archivio precedente agli account non si svuota come conseguenza di un ingresso
senza account: conversione/esportazione spettano al client account.

## 9. Disposizione e accessibilità da realizzare

Tema chiaro e token esistenti dell'area 1, nessun asset nuovo. Telefono: colonna
unica, margini 16–20 px, testi estesi, pannelli a larghezza utile. Desktop:
contenitore della vista esistente, testo di configurazione entro circa 70
caratteri per riga; ripasso e simulazione possono affiancarsi, conservando
ordine DOM e gerarchia. Il giro non diventa una tessera pari alla proposta.

Titolo 28–32 px, titoli di configurazione 22–24, corpo e controlli 16,
spiegazioni almeno 14; nessun testo nuovo sotto 11 px. Target almeno 44×44 px,
contrasto almeno 4,5:1 sul testo normale e 3:1 su confini e indicatori utili.
Nessun testo ministeriale troncato, nessuna altezza fissa delle risposte.
I colori didattici delle figure restano contenuto.

Scelte esclusive banca/quantità/prova con radio native o semantica equivalente;
argomenti e filtri con checkbox ed etichetta completa. Disclosure con stato
espanso accessibile. Pannelli: titolo, focus iniziale, Tab contenuto se modali,
Esc/Annulla, ritorno al controllo di apertura. Conteggio aggiornato in una
regione `aria-live="polite"`, senza spostare il focus a ogni spunta.
Avvio disabilitato con motivo visibile. Indicatore della selezione non affidato
al colore. Nessuna barra fissa nuova che copra anteprima, avvisi o focus;
verificare zoom 200%, tastiera e testi lunghi a entrambe le larghezze.

## 10. Dipendenze e verifica di accettazione

### 10.1 Il contatto con chi tiene i test e la specifica

**Dipendenza prima della chiusura di P-05:** oggi
`tests/test_interfaccia.py::test_modalita_quiz` pretende sei chiavi di `MODI`,
compresa `batteria`; R-NAV-04 nella specifica dice ancora sei modalità e
R-NAV-05 parla di filtri globali. La verifica verde di oggi conferma il
prodotto precedente, non i cinque ingressi progettati qui.

Claude su `main` aggiorna questi contratti alla mappa del §6 e alle cinque
intenzioni; i controlli devono esercitare la selezione effettiva e la
reperibilità, preservando filtro figure e solo-mai-fatte nel loro ambito.
Occorre fissare rimozione dell'ingresso Batteria ma conservazione del suo
mestiere senza filtri, titoli/ritorni, base/vela e quantità annunciata.
Chi realizza su `ui/main` non tocca `tests/` o `specifica.md`, non mantiene
una sesta modalità fittizia per far passare il test e non deseleziona nulla.
La regia coordina l'allineamento; P-04 non cambia la coda.
L'aggiornamento dei controlli deve consentire il passaggio dalla pagina attuale
a quella nuova senza lasciare `main` rosso: riconoscere esplicitamente il
regime attuale a sei ingressi e quello progettato a cinque, verificando in
quest'ultimo anche funzioni e parametri. Non basta eliminare l'asserzione su
Batteria o accettare qualsiasi insieme di nomi. La regia chiude il controllo
sul solo regime nuovo quando integra l'area realizzata.

`lunghezzaScreening()` e le selezioni sono già esportate e testate. L'unico
aggiornamento del registro di eccezioni in P-05 è quello del §6, insieme alla
chiamata reale. `erroriSessione` resta orfana fino all'area 3; `peggiori` resta
in attesa di Q-DUE. Nessuna chiamata protetta di altre viste va rimossa.

**Come lo legge il controllo — scritto da P-06, 26 settembre 2026.**
`tests/test_interfaccia.py` riconosce il regime da `const MODI = [...]`: le sei
chiavi di oggi sono il regime attuale; nessuna `batteria` e chiavi fra le cinque
sono il regime progettato, e lì ne pretende esattamente cinque. Nel regime
progettato la pagina deve avere:

- in `MODI` le chiavi `mirata`, `argomento`, `sbagliate`, `sim`, `screening`
  (il primo elemento di ogni riga, o un campo `k:`), e per ciascuna una porta
  `data-modo="<chiave>"`, scritta o generata da `MODI`; nessuna porta Batteria;
- nessun `totScreening`;
- una funzione di primo livello **`selezioneQuiz(intenzione, conf, fonte)`**,
  dove la configurazione diventa una chiamata al motore. Deve dipendere solo
  dai suoi argomenti, da `E` e da altre funzioni dichiarate al primo livello:
  il controllo la estrae ed esegue senza DOM e senza `S`.

`fonte` è `{ items, prog, oggi, pesi, prove, esame }` — `S.banca`, lo specchio,
il giorno, `meta.pesi_esame`, `meta.prove`, la data d'esame. `conf` per
intenzione: `mirata {}`; `argomento { kind, temi, voci, soloNuovi, soloFigura,
n }`; `sbagliate { kind, temi, voci, n }`; `screening { kind, perVoce, seme }`;
`sim { prova: 'base' | 'vela', seme }`. Per la vela gli argomenti stanno in
`voci`. Restituisce `{ lista }` e in più: `perche` per la Mirata, `totale` per
argomento e ripasso, `daFare` per argomento senza solo-mai-fatte, `previsto`
per il giro, da `E.lunghezzaScreening()`. Il controllo verifica per ciascuna la
**sola** chiamata di selezione della tabella del §6, i suoi parametri, e che la
lista sia quella restituita dal motore con il solo tetto `n`; mette in ogni
configurazione campi di altre attività e pretende che non passino. «Base e
vela» è due chiamate `sim` in sequenza e resta al collaudo.

La pagina di riferimento `tests/pagina-quiz-intenzioni.html` mostra la forma
minima che passa; non è un disegno né un prototipo. Il controllo la esegue a
ogni run insieme a sedici rotture che devono fallire (R-NAV-07). Se il
contratto sta stretto alla realizzazione, si dice alla regia: cambiarlo tocca
`tests/`, che da `ui/*` non si scrive.

### 10.2 Casi obbligatori per la realizzazione

Sono controlli da eseguire, **non risultati della schermata nuova**.

| Caso | Esito richiesto |
|---|---|
| Ingresso dalla barra, archivio vuoto | Cinque intenzioni reperibili con gerarchia; solo giro dietro un disclosure; scelta della modalità non avvia attività. |
| Porte da Percorso e Progressi | Configurazione pertinente, banca/voce/filtri espliciti, ritorno e focus corretti; Segnali e altre viste raggiungibili. |
| Nessun filtro / tutti selezionati | Stessa lista completa da `daAllenare()`, stesso ordine; nessuna porta Batteria aggiuntiva. |
| 2 errori e 1 corretta su tre quiz base | `daFare` distinto da lista disponibile; ripasso solo dei due sbagliati. |
| Errore poi risposta corretta | Quesito ancora nel ripasso, ma dopo gli errori aperti secondo l'ordine del motore. |
| Cambio attività con filtri attivi | Nessuna restrizione trasferita a Mirata, ripasso, giro o simulazione; il ritorno alla stessa configurazione recupera solo il suo stato in memoria. |
| Base → vela con temi/voci e figura | Restrizioni base azzerate; vela usa solo voci; eventuale figura senza banca supportata si spegne col motivo. |
| Più temi / più voci vela | Conteggio e lista rispecchiano tutti i filtri; nessun tema `VELA` usato al posto delle voci. |
| Applica / Annulla / Esc | Anteprima cambia solo all'applicazione; annullare conserva configurazione e focus. |
| Solo nuovi esauriti / solo figura azzera | Zero con motivo e correzione; nessuna sostituzione; non dichiarare banca completata. |
| Tutti base corretti | Mirata vuota, per argomento ancora disponibile per ripasso; nessuna promessa di preparazione completata. |
| Giro base 1/2/4/6; vela 1/2/4/6 | Conteggi opzioni = `lunghezzaScreening` = lista realmente aperta; una banca ridotta non legge vecchi conteggi di meta. |
| Modifica storico/seme fra anteprima e click | Snapshot e motivi coerenti, aggiornamento prima dell'avvio; doppio click non crea doppioni. |
| Simulazione base/vela/Base e vela | Solo Inizia avvia; timer/soglie da meta, composizione e oscurati dal motore; filtri personali non incidono. Due fasi ed esiti distinti. |
| Timer, stop, consegna e risposte mancanti | Comportamento esistente preservato e dichiarato; nessuna correzione durante la prova e nessuna ripresa dopo ricarica. |
| 29/30 righe misurate e timestamp insufficienti | Durata solo con ritmo affidabile della banca e fonte orologio; nessuna durata fissa nello screening. |
| Senza account, dopo l'integrazione client | Tutte le attività e revisione corrente; ripasso solo della pagina aperta; ricarica perde risposte e filtri, nessuna scrittura personale in storage/rete. Avviso prima e dopo. |
| Account offline e scrittura fallita | Attesa sincronizzazione distinta dal salvataggio server; avviso/pallino/riga errore preservati. |
| Archivio locale preesistente | Nessuna cancellazione in silenzio; percorso di conversione/esportazione del progetto account. |
| Collaudo a 375 e 1280 px | Screenshot guardati, computed style per misure, nessun overflow, target/contrasto/focus/zoom verificati. Non basta leggere il DOM. |

Per la reperibilità: cinque persone devono trovare senza aiuto **Ripassa gli
errori**, avviare vela per un argomento e spiegare che cosa promette il giro.
Registrare riuscita, errori e aiuti per ciascun compito. La prova con persone
resta da organizzare dall'autore (Q-PROVE); una suite verde non la sostituisce.

### 10.3 Evidenze della sessione P-04 e limiti

Base letta: `ui/main`, **282923b**, working tree pulito e stesso HEAD di `main`.
`git pull --ff-only` non applicabile: il ramo non ha upstream; nessuna
configurazione modificata e nessuna merge da remoto eseguita.

Quattro suite sulla base corrente, senza deselezioni:

- Motore: **132 casi, 131 passati, 1 skip previsto, 0 fallimenti**; lo skip
  riguarda la vecchia copia UI di `daAllenare()`, già rimossa.
- Dati: **221 verifiche passate**. Il controllo del server locale ha richiesto
  esecuzione fuori sandbox per il bind, poi la suite è passata integralmente.
- Interfaccia: **135 verifiche passate**.
- Specifica: **262 verifiche passate**.

Controllo condiviso della documentazione verde; il guardiano è passato anche
con il documento nuovo, dentro la suite dati. Riferimenti locali risolti e
diff controllato: soltanto progetto e aggiunta al CHANGELOG.

Riprodotti sotto Node, con motore e banca reali e dati sintetici in memoria,
giorno 26 settembre, senza scritture di risposte:

| Misura | Risultato |
|---|---|
| Screening base, 1/2/4/6 per voce | **44 / 85 / 167 / 249**; uguali alla lista per semi 1, 42 e 987. |
| Screening vela, 1/2/4/6 per voce | **3 / 6 / 12 / 18**; stessa uguaglianza per i tre semi. |
| Banca ridotta a un quiz base, 6 per voce | Conteggio e lista **1**; nessun uso di meta per il conto. |
| Due errori + una corretta base | Lista argomento **1.472**, da fare **1.471**, ripasso errori **2**, solo nuovi **1.469**. |
| Filtro prima voce vela della banca | **99** quiz, tutti della voce scelta. |
| Tutti i base corretti una volta | Mirata **0**, lista argomento **1.472**, da fare **0**. |
| Simulazione, seme 42 | Base **20**, vela **5**; base identica con specchio vuoto o tutti corretti, **0 oscurati**. |

Sono prove dei contratti, non validazione del disegno o dei tempi per una
persona. Nessun prototipo, screenshot o collaudo del nuovo Quiz in questa
sessione: il codice non è stato modificato. I testi account restano dipendenti
dal client e dal suo rilascio; il ridisegno pre-account usa il regime attuale.
La realizzazione chiude solo dopo l'allineamento del §10.1, quattro suite
verdi, collaudo funzionale e visivo, eccezione aggiornata con la chiamata,
CHANGELOG additivo e commit con trailer, senza bump, tag o push.
