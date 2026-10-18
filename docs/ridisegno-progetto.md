# Il ridisegno dell'interfaccia — progetto P-79

14 ottobre 2026 · base `43638eb` · documento per P-80 e P-81.

**Stato:** progetto da integrare nella specifica, non descrizione della pagina
pubblicata. La struttura e i nomi chiusi dall'autore valgono; le scelte tecniche
qui esplicitamente decise sono la consegna di P-79. I punti **Aperto — autore**
non diventano decisioni perché compaiono in un mock. P-79 modifica solo questo
documento e la voce additiva nel CHANGELOG; nessuna realizzazione, nessun test
nuovo, nessuna pubblicazione.

## 1. Fonti, precedenze e perimetro

Precedenza: [AGENTS](../AGENTS.md), [specifica](specifica.md) §§0, 1, 2,
4.1, 4.2, 4.7, 5–8, 9.4, 9.9, 9.12, 10; decisioni 1–9 di Q-NAV e
«I nomi chiusi provvisori» del 14 ottobre; Q-STATI del 13 ottobre;
[ADR-004](adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md),
[ADR-005](adr/ADR-005-semplificare-senza-offline-e-senza-archivio-di-prima.md),
[ADR-006](adr/ADR-006-l-invito-in-home-il-sito-che-spiega-la-costanza-e-la-stima.md);
[filosofia](filosofia.md). La specifica §§5–7 descrive ancora la pagina attuale:
le modifiche richieste qui entrano con il raccordo di P-80, non per una
riscrittura anticipata di P-79.

I cinque passi di mock sono P-65, [tragitti](prototipi/interfaccia-2026-10/tragitti.md),
P-66, [Home](prototipi/interfaccia-2026-10/home.html) e
[nota](prototipi/interfaccia-2026-10/home-note.md), P-67,
[Allenati/Esame](prototipi/interfaccia-2026-10/attivita.html) e
[nota](prototipi/interfaccia-2026-10/attivita-note.md), P-68,
[Progressi](prototipi/interfaccia-2026-10/progressi.html) e
[nota](prototipi/interfaccia-2026-10/progressi-note.md), P-69,
[giro](prototipi/interfaccia-2026-10/giro.html) e
[nota](prototipi/interfaccia-2026-10/giro-note.md). Letto anche il verbale
[P-70](prototipi/interfaccia-2026-10/prova-persone.md): 300 giri di bot,
nessuna persona, nessuna comprensione dei cinque nomi o trovabilità sotto
scorrimento misurata. Non è un'approvazione implicita delle varianti.

Per i comportamenti che restano: [area 2](area-2-progetto.md),
[area 3](area-3-progetto.md), [area 4](area-4-progetto.md),
[area 5](area-5-progetto.md), [area 6](area-6-progetto.md);
[client](account-client-progetto.md) §§3, 4, 12, compresi i raccordi dei
banchi, e [eccezioni](eccezioni-interfaccia.md), orfani P-71.
Letti [coda](prossime-sessioni.md) §4 «Dopo P-59», punti 4, 9, 10, 12, 13, 15;
README, CHANGELOG e i contratti effettivi di pagina, motore e profilo.

| Entra in P-81 | Fonte e confine |
|---|---|
| Home · Allenati · Esame · Progressi, più avatar | Decisioni 1–9; nomi provvisori chiusi il 14 ottobre, senza richiamo accanto ad Allenati |
| Un documento di studio, Home `/`, continuità anonima | Decisione 9; URL e compatibilità nel §3 |
| Invito nei tre posti | ADR-006; nessun invito aggiunto a Progressi |
| Data e «Che cosa stai preparando?» | Decisione 13; impostazioni facoltative, non un piano o un obiettivo prospettico |
| Mappa a cinque stati, due tag, segnalibri, numero | Contratti P-71 del §9.12, senza cambiare il motore da `ui/main` |
| Segnala un problema | Decisione 30; indirizzo segnaposto dichiarato fino alla scelta dell'autore |
| Com'è fatto l'esame | Decisione 31; sintesi e approfondimento con fonti datate |

| Non entra | Posto di aggancio, senza una sagoma pubblicata |
|---|---|
| «Sei qui», fasi, ripresa dopo assenza, costanza | P-76: sopra la mappa in Progressi e sopra i fatti nella Home HA. Niente criterio del 50%, niente «N da confermare oggi» |
| Obiettivo del percorso e «hai concluso quello che ti avevamo proposto» | P-76: stesso spazio in Progressi/Home; l'ambito pagina/persistente resta dell'autore, coda §4.10. La scelta descrittiva dell'esame del §6 non crea questo obiettivo |
| Spiegazioni | Riga 22: dopo correzione negli allenamenti e dopo consegna nelle simulazioni; mai prima, mai sulla carta. Restano `nbp` e `nb`; nessun testo finto o promessa di spiegazioni già disponibili |
| «Com'è andata» e riga d'avvio | P-75, [esito §10.1](esito-esame-progetto.md#101-chi-fa-che-cosa): trasportare il suo raccordo, senza ridisegnare raccolta, testi o gate. Se non fuso, restano E-01/P-01 spenti |
| Stima | Ricerca separata: nessuna percentuale, budget errori, ragnatela o previsione visibile. Le prove fatte restano fatti |
| Donazione | Nessun pulsante prima del parere; quando autorizzato, nuova scheda, senza lasciare quella di studio |
| Certezza «Ero sicuro / avevo un dubbio» | Il mock P-69 la illustra, ma P-79 non introduce un tipo di dato o un invio non richiesto. Contratto e uso da consegnare separatamente prima dell'attivazione |

**Deciso nel progetto:** ereditare tema chiaro, marchio e Manrope già locali,
senza nuove risorse o identità. Nessun build step, bundler o dipendenza;
selezioni e misure solo dal motore. La copia anonima non viene scritta in
storage, cookie, cache, URL o `history.state`.

## 2. Inventario nuovo: sezioni, superfici e porte

**Deciso nel progetto:** quattro sole sezioni `.view`, esattamente con questi
id. Preparazioni, ambienti e pannelli sono superfici interne, inventariate
sotto: non si mantengono sette viste vuote per soddisfare R-NAV-06.

| Sezione | id nuovo | Porta principale | URL |
|---|---|---|---|
| Home | `v-home` | Marchio e Home | `/` |
| Allenati | `v-allenati` | Allenati | `/?sezione=allenati` |
| Esame | `v-esame` | Esame | `/?sezione=esame` |
| Progressi | `v-progressi` | Progressi, anche senza account | `/?sezione=progressi` |

Desktop: barra in alto, quattro parole intere. Telefono: quattro voci nella
barra mobile e avatar nell'intestazione. Nel runner la barra delle sezioni
sparisce; titolo attività, comando di uscita e avatar con guasto restano.
L'avatar ha testo «Accedi» senza account e «Account» con account, anche nel
runner; nome accessibile, non una sola icona. Il segnale ambra resta finché
il guasto è risolto, anche dopo aver letto Info.

| Inventario precedente della specifica §5.2 | Posto nuovo e porta effettiva |
|---|---|
| `v-oggi`, Rotta | Home per azione e fatti; Progressi per mappa e storia. Nessuna seconda classifica |
| `v-quiz`, Quiz | Allenati → Quiz; preparazioni e runner dei quiz condivisi con Esame |
| `v-cart`, Carteggio | Allenati → Carteggio; Esame → Prova di carteggio apre lo stesso ambiente |
| `v-diag`, Progressi | Progressi; anonimo: riepilogo vero della pagina, HA: mappa/storia |
| `v-tec`, Che tecnica serve? | Allenati → Carteggio → Che tecnica serve?, preparazione e runner tecniche |
| `v-seg`, Segnali | Allenati → Segnali, preparazione/partita/riepilogo extra banca |
| `v-info`, Info | Avatar → Profilo → Info e diagnostica; raggiungibile sopra ogni attività |

| Superficie | Gesto e risultato | Ritorno |
|---|---|---|
| Segmenti Quiz / Carteggio / Segnali | Allenati apre quello esplicito nel link, altrimenti Quiz | Memoria di segmento, filtri, posizione e fuoco quando si torna dall'attività |
| Preparazione quiz | Home, Quiz, Esame, mappa, segnalibri o ricerca | Porta effettiva; non una destinazione fissa |
| Preparazione carta | Esercizi / Prova, due modalità del medesimo ambiente | Allenati/Carteggio o Esame |
| Preparazione tecniche | Che tecnica serve? | Allenati/Carteggio |
| Runner / confronto | Inizia, mai l'ingresso nella sezione | Gestore di uscita comune del §7 |
| Riepilogo / revisione / riprova | Conclusione o apertura attività esistente | Revisione → riepilogo → origine, con tentativo conservato |
| Profilo e sottopannelli | Avatar, `#profilo`, account/data/preparazione/dati/Info | Origine conservata, anche runner; timer continua |
| Ricerca / elenco segnalibri | Allenati/Quiz | Stesso segmento e casella/configurazione |
| Sintesi/approfondimento esame | Esame → Com'è fatto l'esame | Stesso punto di Esame |
| Privacy / condizioni / avvertenza | Link canonici sopra qualunque origine | Stesso modulo, lavoro, scroll e fuoco |
| Segnalazione | Sotto il quesito, runner o revisione | Stesso quesito; nessuna risposta scritta |

Le dieci attività del §5.3 restano tutte: mirata, argomento, ripasso, simulazione
(base, vela, entrambe), screening, prova carta, giro tecniche, tappeto,
riconoscimento tecniche, quattro modalità Segnali. Breve, ricerca e segnalibri
sono porte aggiuntive, non sostituti. Il mestiere Batteria resta nell'argomento
senza filtri e le sue righe precedenti restano leggibili.

## 3. Un documento con indirizzi che il server sa servire

### 3.1 Misura P-79 e scelta tecnica

**Misurato il 14 ottobre 2026**, importando `strumenti/serve.py` invariato e
avviando `server(0)` sul sito attuale, porta libera, otto GET:

| Richiesta | HTTP | Corpo / byte | Redirect |
|---|---:|---|---|
| `/` | 200 | `index.html`, 30.680 | nessuno |
| `/?sezione=allenati` | 200 | stesso `index.html`, 30.680 | nessuno |
| `/?sezione=esame` | 200 | stesso `index.html`, 30.680 | nessuno |
| `/?sezione=progressi` | 200 | stesso `index.html`, 30.680 | nessuno |
| `/allenati` | 404 | `404 Not Found`, 13 | nessuno |
| `/app` | 200 | `app.html`, 359.569 | nessuno |
| `/privacy` | 200 | `privacy.html`, 8.641 | nessuno |
| `/avvertenza` | 200 | `avvertenza.html`, 6.970 | nessuno |

I 200 avevano `Cache-Control: public, max-age=0, must-revalidate`; il 404
`no-cache`. Questa è la riproduzione locale dell'host misurato, non una nuova
prova di produzione. I byte sono uno snapshot della base, non valori promessi.

In Chrome headless, con un oggetto sintetico in memoria e il riferimento al
documento: `pushState({nav:1}, '', '/allenati')` lascia documento e oggetto
identici, senza `popstate`; Indietro torna a `/`, stesso documento/oggetto,
un `popstate`; Avanti ritorna alla rotta. Caricando di nuovo `/allenati`:
404 e oggetto assente. Caricando `/?sezione=allenati`: Home attuale, 200 e
memoria nuova; oggi la query non disegna Allenati perché il router non c'è.
È una misura di trasporto/cronologia, non della continuità del futuro client.

**Deciso nel progetto:** adottare le query su `/` già proposte da P-65.
`/allenati` non è una rotta del prodotto progettato: una sua ricarica dà 404,
e nessun `pushState` del sito deve produrla. Fare il contrario richiederebbe
file/alias di ingresso o una riscrittura dell'host provata; non basta una
404 personalizzata, né una copia autonoma dell'app per ogni sezione.
Gli indirizzi query sono veri, copiabili, servibili direttamente e senza `.html`.
Ricarica ripristina la sezione, non l'archivio anonimo.

La semantica è confermata dalle fonti tecniche consultate il 14 ottobre:
[MDN pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
e [popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event).
La prima modifica la cronologia senza caricare la risorsa; la seconda
notifica l'attraversamento della cronologia. Per questo il controllo HTTP
deve affiancare quello del browser.

### 3.2 Canonico, `/app`, manifest e link precedenti

**Deciso nel progetto:** `site/index.html` contiene Home, UI, client e script
di studio; importa soltanto `/engine.js`. `site/app.html` diventa una porta
statica di compatibilità senza banca, archivio o client duplicato, che fa
`location.replace()` verso `/?sezione=allenati&segmento=quiz` prima di qualunque
attività; senza script mostra il link «Apri Allenati». Non si usa `/app` come
destinazione di un tocco interno dopo l'avvio. L'origine del sito resta la
stessa: la copia `rg-account-<chiave>` non cambia nome o origine.

Il manifest `site/manifest.json` passa da `start_url: '/app'` a
`start_url: '/'`, `scope: '/'` resta. Chi ha un'icona col vecchio start_url
entra comunque dalla porta `/app`; non è garantito quando il sistema aggiorni
il manifest. Niente offline e nessuna registrazione di service worker.
Titolo canonico «Rotta Giusta — quiz e carteggio per la patente nautica»;
titolo della porta «Apri Allenati · Rotta Giusta». Durante il giro il titolo
diventa «{schermata} · Rotta Giusta». R-ARCH-06 e R-ARCH-09 vanno riscritti
in P-80 per distinguere documento di studio e porta, non eliminati.

Inventariare in P-81 **tutti** gli `href` di `site/` e i link costruiti dal
client: marchio → `/`; ritorni legali → `/`; porte attività → query canonica;
link di accesso su origine esclusa → `https://rottagiusta.it/`.
Restano `/privacy`, `/avvertenza`, `/avvertenza#condizioni`.
I link storici `/app` non si rompono: la porta li traduce, senza cambiare il
server delle mail nel lavoro UI.

`/app#verifica=<gettone>` e `/app#password=<gettone>` meritano un percorso
separato: la porta legge il frammento in memoria, lo toglie subito dall'URL
con `replaceState`, poi passa al canonico con il frammento indispensabile;
il canonico lo consuma e ripulisce subito, con i gestori già esistenti.
Mai in query, storage, log, `history.state` o `Referer`. Se il caricamento
fallisce si offre di riaprire il link ricevuto, senza dichiararlo usato.
P-80 prova questa sequenza, compreso un link già usato/scaduto; nessuna
conversione di gettoni e nessuna seconda implementazione del client.

Query consentite: `sezione`, `segmento`, `attivita`, `fase`, banca e filtri
pubblici. Esempio `/?attivita=quiz-base&fase=preparazione`. Non mettere data
d'esame, scelta personale, risposte, ricerca digitata, email o testo carta
nell'URL. Risultato e revisione usano un riferimento opaco al contesto in
memoria: se assente, «Questa attività non è disponibile qui. Puoi iniziarne
una nuova.» e «Apri la preparazione». Nessun runner si avvia da un link
diretto o da una ricarica. Parametro sconosciuto: Home, con «Questa
destinazione non è disponibile. Puoi scegliere un'attività da Allenati.»

### 3.3 Tocchi, cronologia, legale e continuità

Link con `href` reale: si intercetta solo il tocco ordinario nello stesso
sito. Apertura in nuova scheda o con modificatori resta una nuova visita,
senza copia automatica dell'archivio. Il contesto di navigazione sta in una
mappa in memoria: origine, segmento, filtri, lista preparata, tentativo,
scroll e controllo di ritorno. `history.state` contiene **solo** `{nav: id}`;
il riferimento non ricostruisce dati dopo ricarica. `replaceState` annota
l'ingresso, `pushState` le tappe, `popstate` le ripristina. Domande successive
e input non aggiungono tappe. `scrollRestoration='manual'`, fuoco restaurato
senza scorrimento implicito, poi posizione originale.

Privacy e avvertenza restano file canonici propri. Il tocco interno carica
il contenuto della pagina legale del sito, lo inserisce come testo/markup
controllato nel pannello sopra l'origine e cambia l'URL al percorso pulito;
non esegue script importati, non duplica il testo nell'HTML di studio e
non introduce una risorsa esterna. Ancora `condizioni` visibile nel pannello.
Una ricarica su `/privacy` o `/avvertenza#condizioni` serve il file legale
autonomo: è un nuovo caricamento, perde la memoria anonima e non promette
il ritorno al lavoro. Il link «Torna alla Home» del file autonomo apre `/`.

Errore legale: «Non riusciamo ad aprire questo testo. Le risposte sono
ancora in questa pagina.» Azioni «Riprova», «Chiudi», «Apri in una nuova
scheda», quest'ultima dichiarata e `rel=noopener`. Nessun ripiego che
naviga automaticamente la scheda di studio. Sopra il modulo, Chiudi/Esc/
Indietro restituiscono anche i campi compilati. Nel runner il timer continua;
alla scadenza si conclude la prova sottostante, senza perderla né ripartire.

Indietro durante attività attraversa il gestore di uscita del §7; annullare
riporta alla tappa del runner senza accumulare voci. Avanti su un tentativo
concluso mostra il riepilogo, mai una nuova prova o un nuovo timer. Chiusura
della revisione torna al riepilogo; chiusura del riepilogo all'origine vera.
Indietro oltre l'ingresso, ricarica, scarto della scheda, chiusura e crash
escono dalla garanzia: il testo di perdita resta esplicito. La cache di
navigazione non è una modalità di salvataggio.

## 4. Stati e testi comuni nei due accessi

Ogni schermata dei §§5–8 usa questi stati prima del proprio contenuto.
**H0:** anonimo, zero risposte nella pagina; **H1:** anonimo con attività/righe
correnti; **HA:** account riconosciuto, separato da invio e verifica email.
Non si deduce la prima visita o un account nuovo dal vuoto.

| Stato | Testo per esteso e azioni |
|---|---|
| Anonimo, prima di ogni avvio e nel riepilogo | «Senza account le risposte valgono solo finché questa pagina resta aperta. Se la chiudi o la ricarichi, le perdi. Non salviamo niente, nemmeno le tue preferenze.» |
| Segnali anonimo | In aggiunta: «Senza account anche i punteggi dei Segnali valgono solo per questa pagina.» |
| Carta anonimo, prima/durante/dopo | «Il lavoro e i giudizi di questa attività restano solo nella pagina aperta. Se la chiudi o la ricarichi li perdi.» |
| HA, preparazione e riepilogo | «Con l'account le risposte vanno nella copia su questo dispositivo e vengono inviate al server. Puoi ritrovarle da un altro dispositivo dopo che il server le ha accolte.» Stato concreto dell'invio accanto, non un «salvato» incondizionato |
| Verifica sessione | «Verifica dell'accesso in corso…». Attività libera, nessuna copia di un account sconosciuto in H0/H1 |
| Caricamento account/banca | «Stiamo caricando le tue risposte…» / «Stiamo caricando la banca…». Niente mappa provvisoria, proposta o conteggi a zero |
| Errore lettura / fonte incompleta | «Non riusciamo a caricare tutte le risposte. Riprova prima di usare questi dati per scegliere un'attività.» «Riprova»; prove cieche disponibili se banca pronta; nessuna diagnosi dal vuoto di ripiego |
| Banca non raggiungibile | «Non riusciamo a caricare la banca. Riprova con la rete disponibile.» «Riprova»; la Home mantiene presentazione/legali ma non inventa totali, esempio o Inizia |
| Rete caduta in HA già aperto | «Sei offline. Le nuove risposte sono in questo dispositivo e saranno inviate quando tornerà la rete.» Si dice solo dopo scrittura riuscita; conteggio da coda motore |
| `401` | «L'accesso non è più valido. Entra di nuovo per inviare le risposte rimaste in questo dispositivo.» «Accedi»; copia congelata, mai trasferita ad altro account |
| Scrittura fallita | «Non siamo riusciti a salvare le ultime risposte su questo dispositivo. Scarica le risposte adesso.» «Scarica le risposte», «Apri Info». Memoria e pallino ambra conservati |
| Lista cambiata fra anteprima e Inizia | «La selezione è cambiata. Torna alla preparazione per vedere la lista aggiornata.» «Torna alla preparazione»; nessun avvio diverso sotto lo stesso numero |
| Figura mancante | Avviso del quesito, prima di rispondere; per base-59 «La figura di questo quesito non è disponibile. Il riferimento resta visibile.» Nessuna figura sostitutiva inventata |
| Dati insufficienti | «Troppo poche risposte per dire come va.» Per andamento «Servono almeno due giorni e dieci risposte per mostrare l'andamento.» Non si abbassano soglie |

Quantità `{N}` e simili sono campi del risultato di un contratto, non
formule che l'implementatore deve indovinare. Singolare/plurale curato.
Niente minuti stimati o semafori di preparazione in questo ridisegno.
Avvisi di conferma email, conflitto, export, uscita e cancellazione del client
restano integri: spostarli nel Profilo non ne cambia priorità o condizioni.

## 5. Home, Allenati ed Esame

### 5.1 Home nei tre stati

**H0:** titolo «Preparati alla patente nautica, un passo alla volta.»;
«Quiz e carteggio per la patente senza limiti dalla costa. Esercitati sui
quesiti del decreto e confronta il lavoro sulla carta.» Primo pulsante
**Simula il quiz base**, condizioni accanto «{n} domande · {minuti} minuti ·
al più {errori_max} errori» da `meta.prove.base` (oggi 20/30/4); secondario
**Allenati con 10 domande**, «Un allenamento breve, con correzione dopo ogni
risposta.» Entrambi aprono la preparazione, non la domanda. Avviso anonimo
§4. Se la banca disponibile ha meno di dieci domande la porta scrive
«Allenati con {N} domande» e il motivo; mai promettere dieci aprendone meno.

Benefici: «Tutte le attività sono aperte, anche senza account. Non
sostituiamo la scuola né il manuale.»; «Esercitati sulla banca ufficiale:
negli allenamenti vedi la risposta ufficiale dopo ogni domanda.»;
«Confronta il carteggio: lavora sulla carta, poi confronta i risultati con
quelli del decreto. Il giudizio è tuo.»; «Ritrova il lavoro con l'account:
le risposte accolte dal server si ritrovano anche da un altro dispositivo.
Puoi scaricarle e cancellarle.» È descrizione, senza CTA di registrazione
nella Home vuota. Anteprime delle quattro sezioni, con link espliciti a
Quiz, Carteggio, Segnali, Esame e Progressi, non il richiamo accanto alla
voce Allenati eliminato il 14 ottobre.

**H1:** stessi due avvii e contenuti, poi «Le attività di questa pagina»,
quantità per tipo e link al riepilogo vero da `riepilogoPagina()` (§10.1).
Mai dieci righe di fixture o una percentuale cumulativa. Invito:
«Conserva le risposte.»; «Hai {N} risposte in questa pagina. Con l'account
puoi ritrovare quelle accolte dal server quando torni, anche da un altro
dispositivo, e scaricarle.»; «Le risposte saranno legate alla tua email e
conservate sul nostro server, in chiaro. Il titolare può leggerle per
supporto e statistiche.» Azioni **Conserva le risposte** → registrazione,
**Continua senza account** → nasconde il blocco per le righe già offerte,
conservando attività e avviso. Torna con nuove risposte, non col solo
passaggio avanti/indietro; nessuna preferenza di rinuncia persistita.
Solo punteggi Segnali: «Hai punteggi dei Segnali in questa pagina», non
«N risposte»; stesse azioni con «Conserva i punteggi».

**HA caricato:** titolo «Che cosa vuoi fare adesso?»; proposta
**Allenamento consigliato**, «Quiz base selezionati dalle risposte disponibili
qui. La selezione non conosce lo studio che hai fatto altrove.» Il numero
e il perché vengono da `selezioneQuiz('mirata', {}, fonte)`; «Apri
l'allenamento consigliato» → stessa preparazione di Quiz, massimo 25.
«Come vengono scelte le domande?» apre l'aiuto del §5.2. Questa è la
Mirata esistente, non la proposta «oggi»/fasi di P-76. Se vuota, nessuna
proposta sostitutiva: «Non ci sono quesiti in questa selezione. Puoi
scegliere un argomento o simulare una prova.»
**Simula il quiz base** rimane in un tocco con condizioni visibili;
«Ultima simulazione quiz {base|vela}: {esito}, {errori} errori su {totale} ·
{data}», da ultima prova di `sessioni(...,{confine:'attivita'})`;
nessuna prova: «Non ci sono simulazioni salvate.» Nessuna costanza.
«Vedi i Progressi» → mappa. HA vuoto confermato: «Non ci sono risposte
nel tuo account. Puoi iniziare una prova o caricare un file dei progressi
da Profilo → Dati.» Non dice che l'account è nuovo.

In **tutti gli stati**, blocco «Che cosa non torna»:
«La banca è del 2022. I limiti si dichiarano, quesito per quesito. All'esame
vale la risposta del decreto.»; «{oscurati} quesiti oscurati: non escono
nella simulazione d'esame; l'avviso compare prima della risposta.»;
«{note} quesiti con nota dopo la risposta; {noteDM} citano il DM 133/2024.»;
«{figureMancanti} quesiti con figura non disponibile.»; «Il carteggio lo
giudichi tu: il sito non corregge il lavoro sulla carta.»
«Note, fonti e riferimenti» → Info. Contare i campi della banca caricata,
non ripetere «11 note»: P-66 ha contato tre citazioni DM e quattro `nb`,
che non è una verifica del numero di divergenze normative del README.
Non cambiare banca o dichiarare risolta questa differenza (§11).

### 5.2 Allenati → Quiz e preparazioni

Titolo **Allenati**, «Quiz, lavoro sulla carta, riconoscimento dei segnali.»
Segmenti **Quiz · Carteggio · Segnali**. Quiz: «Scegli come esercitarti con i
quiz base o vela. Puoi cambiare attività quando vuoi.» Cinque porte di area
2 mantenute con `MODI`: `mirata`, `argomento`, `sbagliate`, `sim`, `screening`.
Simula la prova porta a Esame; da lì le prove aprono la preparazione condivisa.
La Mirata rimane visibile; il giro rimane dietro **Altri modi di esercitarti**.
In più **Segnalibri** e **Cerca un quesito per numero** (§8).

**Aperto — autore A-1:** temi direttamente in Quiz (tre tocchi Home →
Allenati → tema → Inizia) oppure nella preparazione (quattro con Scegli un
argomento). P-67/P-69 mostrano tre, P-65 quattro; §1 della specifica dice
due. Nessun mock soddisfa i due tocchi all'argomento. Il progetto si ferma
su questa scelta, non salta la preparazione. Le due varianti restano nel
§9 e P-80 deve parametrizzare entrambe, poi fissare quella scelta prima
di P-81. Spunte multiple, filtri e voci rimangono in entrambe.

| Preparazione | Testi, controlli e lista; comuni ai due accessi |
|---|---|
| Allenamento consigliato | «Quiz base selezionati dalle risposte disponibili qui e dalla distribuzione dei quesiti per tema. La selezione non conosce lo studio che hai fatto altrove.» «{N} quiz base», da `mirata`, massimo 25. «Come vengono scelte le domande?» → «La selezione può includere domande da ripassare, domande mai incontrate qui e conferme. Il motivo di ciascuna compare durante l'attività.» **Inizia l'allenamento** |
| Allenamento breve | «{N} domande, con correzione dopo ogni risposta. Questa attività non è una simulazione.» Una chiamata `estraiNuoviPrima` con base, seme e limite 10, lista conservata; nessuna durata. **Inizia l'allenamento** |
| Scegli un argomento | «Puoi scegliere uno o più argomenti, oppure allenarti su tutti. Vedrai la risposta ufficiale dopo ogni domanda.» Base/vela; temi multipli e voci con un solo tema base, sole voci vela; 20/50/100/Tutte; **Scegli gli argomenti**, **Filtri**, **Applica**, **Annulla**. Default base/tutti/20/filtri spenti. **Inizia i quiz** |
| Ripassa gli errori | «Rivedi i quesiti sbagliati almeno una volta nelle risposte disponibili qui. Restano disponibili anche dopo una risposta corretta; quelli ancora da ripassare vengono prima.» Base/vela, temi/voci, 20/50/100/Tutte; default base/tutti/20; `soloSbagliate`, non `soloDaRifare`; nessun filtro mai-fatte/figure. **Inizia il ripasso** |
| Un giro tra gli argomenti | «Con una domanda per ogni voce incontri tutti gli argomenti della banca scelta. Un errore può suggerire che cosa approfondire; una risposta corretta non dimostra padronanza dell'argomento.» Base/vela, default 1 per voce; **Più quesiti per voce** → 2/4/6. «Fino a {perVoce} domande per ogni voce della banca scelta.» N da `lunghezzaScreening`, lista da `screening`; niente moltiplicazione in pagina. **Inizia il giro** |
| Simulazione base/vela | «Le domande sono estratte con le regole della prova scelta, senza tener conto delle tue risposte precedenti. La correzione arriva alla fine. Il risultato riguarda questa simulazione: non garantisce l'esito dell'esame.» Condizioni da `meta.prove`; scelta **Quiz base / Quiz vela / Base e vela**. **Inizia la prova** |

Sotto ogni preparazione: avviso di accesso §4, quantità reale e ritorno
nominato «Torna alla Home», «Torna ad Allenati · Quiz», «Torna a Esame» o
«Torna ai Progressi». Il click rientra nel contesto, non ripesca.
Senza account in ripasso: «Sono gli errori delle attività svolte in questa
pagina aperta.»; nel filtro nuovi: «Include soltanto quesiti a cui non hai
ancora risposto in questa pagina aperta.» Con account: «Include soltanto
quesiti a cui non hai ancora risposto qui.»

Argomento: «Solo domande mai fatte», «Solo quesiti con figura» solo qui.
Nessuna spunta → «Tutti gli argomenti»; «Seleziona tutti», «Azzera la
selezione», aiuto «Torna a tutti gli argomenti»; più temi → «Valgono tutte
le voci dei temi selezionati» e voci azzerate. Cambio banca azzera temi/voci
e mantiene solo controlli compatibili. **Rimuovi tutti i filtri** azzera
temi/voci/mai-fatte/figure, non banca/quantità. Annulla/Esc non applicano
la bozza. «Questa banca non ha quesiti con figura» spegne il filtro quando
vale per tutta la banca, non quando lo azzera una restrizione corrente.

Anteprima: «{totale} quesiti disponibili con questa selezione. Ne aprirai
{N}.»; con nuovi «{totale} quesiti mai incontrati con questa selezione.
Ne aprirai {N}.»; `daFare > 0` → «{daFare} mai incontrati o da ripassare;
gli altri sono disponibili per il ripasso»; zero → «Qui restano quesiti
di ripasso.» I campi sono quelli di `selezioneQuiz`, senza contare di nuovo.
Ripasso: «{totale} quesiti sbagliati almeno una volta con questa selezione.
Ne aprirai {N}.» Vuoto: «Nessun quesito con questi filtri. Modifica i filtri
o rimuovili.»; solo nuovi: «Nessun quesito mai incontrato con questi filtri.
Puoi togliere Solo domande mai fatte per ripassare.»; ripasso vuoto senza
filtri: «Non ci sono quesiti sbagliati nelle risposte disponibili qui.
Puoi scegliere un argomento o simulare una prova.» Inizia disabilitato col
motivo e due uscite reali, non un clic inerte.

### 5.3 Allenati → Carteggio e Segnali

**Carteggio:** «Tu svolgi gli esercizi sulla carta. Rotta Giusta ti propone
una selezione e mostra la risposta ministeriale per confrontare il risultato.
Sei tu a giudicare: il sito non corregge il carteggio.»
**Prima di cominciare:** «Per la prova e gli esercizi su carta servono le
carte nautiche indicate nella selezione, squadrette nautiche, compasso,
matita, gomma e fogli per i calcoli. Il sito mostra il problema: il
tracciamento si fa sulla carta. Verifica con la tua scuola il materiale e
le condizioni della prova.» Prima di `#c-start`, anche arrivando da Esame.

Porte **Esercizi su carta**, «Scegli un giro fra tecniche diverse o prosegui
nell'ordine del foglio»; **Che tecnica serve?**, «Riconosci come impostare
il problema, senza carte. Non equivale a svolgerlo»; **Prova di carteggio**,
«Quattro esercizi a tempo, poi confronto e giudizio tuo».
**Ho carta e strumenti** → Esercizi; **Sono senza strumenti** → Tecniche.
Guida «Come funziona»: «1. Scegli un'attività e controlla le carte richieste.
2. Svolgi gli esercizi sulla carta e scrivi qui i risultati. 3. Confrontali
con la risposta ministeriale e decidi come sono andati.»
**Vedi un esempio** conserva l'esempio di area 4, tre passi senza scrivere
risposte: «Questa dimostrazione non registra risposte o giudizi», testo
ministeriale da `tappeto`, nessun procedimento o esito finto.

Esercizi: **Giro delle tecniche / A tappeto**, giro iniziale; carta e
quantità compatibili da area 4; carte richieste e quantità effettive da
`preparaCarteggio`. «Giro delle tecniche» usa `giroTecniche`; «A tappeto»
usa `tappeto`. «Hai incontrato tutti gli esercizi con questa selezione.
Puoi scegliere un'altra carta o ripassare.» quando la lista è finita,
non un voto di padronanza. **Inizia gli esercizi**.
Tecniche: «Riconosci le tecniche necessarie per impostare il problema.
La classificazione è del progetto, non del Ministero.» Lista da `coda`
sulle tecniche, **Inizia il riconoscimento**. Non serve carta e non equivale
a risolvere. HA → «Esiti autovalutati» e attività salvate; anonimo →
«Attività di questa pagina», soltanto quelle concluse.

Prova: condizioni, lista, carte, rappresentati/mancanti, riprese e
assunzione vengono interi da `provaCarteggio` via raccordo. **Prima i mai
provati** è variante distinta dalla prova cieca, indicata nella revisione;
non cambia la composizione in pagina. Assunzione Q-CART4 mostrata
letteralmente da `PROVA_CARTEGGIO.assunzione`; mai attribuirla al decreto.
Una lista inferiore al richiesto blocca Inizia e nomina l'assenza. **Inizia
la prova**. Senza account/HA applicano i testi carta §4 e la bozza §7.3.

**Segnali:** titolo «Riconosci fanali e segnali»; «Il gioco è extra banca.
Non entra nella copertura dei quiz e non registra le singole risposte.»
Quattro modalità **Fanali notturni / Segnali diurni / Suoni da nebbia /
Segnali di manovra**, Fanali iniziale; «{N} situazioni» da
`lunghezzaPartita`/`domandeSegnali`, non 10 fisso. **Inizia**, **Avanti**,
**Vedi il risultato**, «{giuste} su {N}», **Torna ad Allenati · Segnali**.
Senza account avviso punteggi §4; HA migliore e giocate dal profilo,
stato «Punteggi da inviare» se pendenti. Mai barra di copertura, righe quiz,
stima o giorni di attività dedotti. Colori/scena delle figure sono contenuto.

### 5.4 Esame e «Com'è fatto l'esame»

Titolo **Esame**; «Le prove sono nell'ordine in cui si sostengono. Qui puoi
prepararle in parallelo, senza sblocchi.» Data e scelta di preparazione
§6; **Com'è fatto l'esame**, sintesi subito e **Approfondisci**.
Prima patente motore → Carteggio, base; anche vela → Carteggio, base, vela.
Estensione dalla entro 12 motore → Carteggio; anche vela → Carteggio, vela.
Scelta rimandata → tutte, vela con «Se prepari anche la vela».
Il base resta **Accesso libero, facoltativo** per l'estensione; nessuna
attività viene disabilitata dall'obiettivo o dall'assenza di data.

**Simula il quiz base**, **Simula il quiz vela**, **Quiz base e vela**,
**Prova di carteggio** aprono le stesse preparazioni del §5.2/5.3.
Dal quiz base in Home e da Esame: un tocco alla stessa preparazione,
secondo tocco al runner. «Prima i quiz base, poi i quiz vela. Due prove,
con timer ed esito separati. Il carteggio non è incluso.» per entrambe.

Sintesi per esteso: «Per la patente senza limiti dalla costa, il carteggio
apre la prova teorica ed è propedeutico ai quiz. La prova proposta qui ha
{esercizi} esercizi, {minuti} minuti e richiede almeno {soglia} risultati
corretti: il giudizio nel sito è tuo. Il quiz base ha {nBase} domande,
{minBase} minuti e ammette al più {errBase} errori. Se prepari anche la vela,
il quiz vela ha {nVela} domande, {minVela} minuti e ammette al più {errVela}
errore. La pratica si prepara con la scuola: questo sito non la simula.
Per l'estensione dalla entro 12, controlla le prove pertinenti qui sotto.
L'ordine dell'esame non limita la libertà di esercitarti.»
Valori da `PROVA_CARTEGGIO` e `meta.prove`; oggi 4/60/3, 20/30/4, 5/15/1.

Approfondimento: «Le condizioni dei quiz e il ruolo propedeutico del
carteggio sono descritti nel DM 10 agosto 2021 n. 323, art. 6 e Allegato C;
le estensioni nell'art. 7. Il programma della categoria A è nell'Allegato A.
La banca dei quesiti è l'Allegato A al DD 131/2022. La composizione della
prova di carteggio del sito, un esercizio per argomento, è un'assunzione del
progetto: verifica con la tua scuola. Le carte e il materiale richiesto
possono dipendere dalla sede. Il sito non certifica il procedimento svolto
né la preparazione alla prova pratica.»
Accanto: «Fonti controllate nel dossier il 9 settembre 2026», collegamenti
ufficiali del [dossier](ricerca-programma-esame.md), sintesi nel documento
canonico. P-79 riporta quella verifica datata, non dichiara una nuova
verifica normativa. P-81 controlla i link delle citazioni prima del rilascio,
senza sostituire la sintesi con un link a un Markdown non pubblicato.

**Le prove fatte:** righe dal motore, per tipo con data/esito;
«Esiti autovalutati» sulla carta. HA legge prove salvate; anonimo solo
«Prove di questa pagina», vuoto «Non hai concluso prove in questa pagina».
Una riga apre riepilogo → revisione, non riprende la prova. Nessun confronto
fra esiti ufficiali di P-75 e simulazioni.

## 6. Avatar, Profilo, onboarding e dati

### 6.1 Pannelli e scelta facoltativa

Avatar → pannello comune sopra ogni superficie, titolo **Accedi** anonimo,
**Il tuo account** HA. Mantiene `aria-modal=true`, fuoco confinato,
Esc/Chiudi e ritorno alla porta. Il legale apre un livello sopra il modulo;
non sostituisce il modulo con una nuova istanza. Il pallino non scompare.
Voci **Data d'esame**, **Che cosa stai preparando?**, **Dati**, **Info e
diagnostica**, **Privacy**, **Condizioni per l'account**, **Avvertenza**;
HA ha email, verifica, invio, **Esci**. P-75 aggiungerà/trasporterà
**Il tuo esame** col proprio contratto. Nessuna voce Obiettivo del percorso
prima di P-76. Queste porte volontarie non sono inviti di ADR-006.

Onboarding dopo creazione/accesso e **dopo** conservazione dello snapshot:
titolo «Che cosa stai preparando?»; «Puoi scegliere adesso o più tardi.
Puoi cambiare queste informazioni dal Profilo. Non limitano le attività.»
Due gruppi senza default implicito: «Solo motore» / «Anche vela»;
«Prima patente» / «Estensione dalla entro 12 miglia». Entrambi facoltativi,
nessuna risposta dedotta dall'altro. Etichetta «Data d'esame (facoltativa)»,
nessun giorno precompilato; «Hai una data d'esame?»; **Salva le scelte**,
**Salta per ora**, **Togli la data**, **Azzera le scelte**.
Data e scelte sono modificabili anche prima dell'account dal Profilo o
da Esame; non si interrompe il primo quesito per chiederle.

Anonimo: «Queste scelte valgono solo per questa pagina. Se la chiudi o la
ricarichi le perdi.» Conferma «Scelte applicate a questa pagina», mai
«Salvate». HA: «Le scelte vengono conservate nel tuo account solo dopo
la conferma del server.» In corso «Salvataggio delle scelte in corso…»;
successo «Scelte salvate» solo con valori riletti nella risposta;
errore «Le scelte non sono state salvate. Riprova oppure continua senza
cambiarle.» **Riprova**, **Continua senza cambiarle**. Bozza e valori
confermati distinti. Accesso con scelte anonime non le salva automaticamente:
si propone la bozza e si richiede il gesto, come R-ACC-55 per la data.

**Trovato — contratto mancante:** oggi `PUT /v1/profilo` gestisce soltanto
`data_esame` e `segnali`; non conserva i due assi della decisione 13.
Non è un export di selezione né la fase di P-76. P-80 deve consegnare il
contratto di profilo del §10.1, oppure la regia deve scorporarlo in un
passo su `main` prima di P-81. Mandare un campo ignoto e fidarsi del 200
è il guasto muto. **Aperto — autore A-5:** confermare che la persistenza
di queste scelte descrittive entra ora, mentre l'obiettivo prospettico resta
a P-76; se «obiettivo rimandato» comprende anche queste, il ramo HA del
salvataggio resta sospeso e lo si dice, non si promette persistenza.

### 6.2 Accesso, registrazione, acquisizione

**Accedi**: titolo omonimo, campi «Email», «Password», link **Crea un
account**, **Ho dimenticato la password**, azioni **Accedi**, **Torna
all'attività**. «Email o password non corrette. Riprova oppure reimposta
la password.»; «Troppi tentativi. Puoi riprovare fra {attesa}.» da
`Retry-After`. Recupero: **Chiedi il link**, «Se questo indirizzo è iscritto,
riceverai una mail da Rotta Giusta. Il link vale un'ora.» Gestori e protezioni
del client restano, nessuna enumerazione nuova o registrazione automatica.

**Crea un account**: «Salva le risposte di questa pagina e ritrovale quando
torni.» Campi etichettati «Email», «Password», autocomplete e incolla
conservati. «Almeno 15 caratteri, al massimo 256. Puoi usare una frase di tre
o quattro parole. Non servono maiuscole, numeri o simboli obbligatori.»
**Mostra password / Nascondi password**, nessun secondo campo.
«L'email serve per accedere, recuperare la password e ricevere gli avvisi
sull'account. Nessuna newsletter. Puoi scaricare e cancellare i tuoi dati;
dopo due anni di inattività ti avvisiamo prima di cancellarli.»
«Creando l'account accetti le condizioni per l'account; l'account è per chi
ha compiuto 18 anni.» Link `/privacy` e `/avvertenza#condizioni` prima
dell'azione, visibili e cliccabili. **Crea l'account e salva**;
**Torna al riepilogo** oppure **Torna alla Home** secondo origine.
Nessuna checkbox nuova. Password mai loggata o in URL/storia.

Creazione: «Creazione dell'account in corso…», doppio invio bloccato.
409 → «Questa email è già registrata.» con **Accedi**, **Reimposta la
password**. Errori campo/422 e 429 restano nel modulo con motivi del server.
201, o 503 con identità confermata → account creato, scadenza verifica,
**snapshot di tutta la pagina**, poi scrittura locale e invio, prima
dell'onboarding. «Non chiudere la pagina: le risposte non sono ancora
salvate nel tuo account.» finché gli uid non sono confermati, anche se
il modulo dice Account. **Riprova l'invio**, **Scarica le risposte di
questa pagina**. «{N} risposte salvate nel tuo account» solo col risultato
del motore sulle sole risposte e tutti gli uid dello snapshot accolti;
scarti «{N} risposte salvate · {S} righe non salvate», motivo e download.
Tag/segnalibri/prove nominati a parte se servono; zero non significa successo.

503 posta: «L'account è creato, ma non siamo riusciti a spedire la mail
di conferma. Riprova fra qualche minuto», **Rimanda la mail**. Risposta
HTTP perduta: verificare `/v1/io` prima del ritento; dubbio «Non sappiamo
se l'account è stato creato. Le risposte sono ancora qui. Riprova a
verificare l'accesso o entra con email e password.»
Accesso volontario su account esistente chiede **Sì, portale / No,
continua senza portarle**, email di destinazione e **Conferma la scelta**,
come client §5.1. Nessuna coda di A in B. Modulo chiuso → origine con
campi/risultato e risposte intatti; salvataggio riuscito → stesso risultato,
non un nuovo giro o una Home che lo copre.

### 6.3 Info e Dati nei due accessi

**Info e diagnostica**: versione da `meta.json`, stato archivio e invio,
ultima scrittura fallita, banca/fonti/note; nessun controllo offline.
HA: «Da inviare», «Invio in corso», «Confermate», «Non accolte» con motivi,
dal motore, risposte distinte dalle altre righe. P-75 porta «prove avviate
{N}»; P-79 non lo attiva. Anonimo: «Queste sono le righe della pagina
aperta. Il sito non le conserva dopo una chiusura o una ricarica.»

**Dati** anonimo: **Scarica le risposte di questa pagina**, **Azzera le
risposte di questa pagina** con conferma d'ambito; nessun import applicato
senza account. HA: **Scarica i tuoi progressi** dal server; «Il file del
server non contiene ancora le {N} risposte da inviare», dati non-risposta
nominati a parte; **Scarica le risposte da inviare**. **Importa un file
dei progressi**, anteprima «{nuove} nuove · {gia} già presenti · {scartate}
scartate», email/destinazione, **Importa nel mio account**, stessa resa
alla fine e **Scarica le righe non importate**. **Azzera i progressi**,
password e ambito tutti i dispositivi; **Cancella l'account**, conferme
esistenti. Nessuna nuova scorciatoia distruttiva.

Uscita HA conserva le scelte e i blocchi del client: **Esci**, **Esci da
tutti i dispositivi**, rete richiesta; coda intera, scarti, punteggi e bozza
proteggono il lavoro anche se non sono «risposte». «Per uscire dall'account
serve la rete.»; «L'accesso è chiuso, ma la copia su questo dispositivo
non è stata cancellata.» quando è vero. Scelte scarica/scarta/rimanda e
relative conferme restano; leggere Info non le risolve.

## 7. Runner, fine attività, revisione e ritorno

### 7.1 Quiz e tecniche

Numero ministeriale, domanda integrale, figura/avviso, risposte sotto il
pollice, posizione sulla lista; `nbp` prima, `nb` dopo correzione, nelle
simulazioni solo dopo consegna. Tasti 1/2/3 e A/B/C dichiarati con tastiera;
modificatori esclusi, sordità di 200 ms, auto dopo un secondo solo su giusta
conservati. Avatar sempre disponibile. Nessuna spiegazione della riga 22,
nessun controllo certezza della fixture. **Termina l'attività** / Esc /
Indietro usano lo stesso gestore; simulazione **Consegna la prova** →
«Consegnare la prova?» con **Continua la prova**, **Consegna**.
Timer da scadenza assoluta, rosso sotto cinque minuti, zero consegna.

Allenamento con risposte → riepilogo parziale; zero → origine senza righe.
Simulazione anche vuota → riepilogo con non risposte e non superata;
conclusione idempotente, nessun invito di salvataggio per sole righe di prova
e nessuna risposta. Ogni risposta costruisce **una volta** riga, `uid`, `ts`;
ogni `E.applica(progress,id,corretto,ms,giorno,ts)` riceve lo stesso `ts`
della riga, mai un Date.now successivo o un giorno al posto dell'istante.
Ricezione/import ricalcolano con `ripiega`, poi disegnano dallo stesso
specchio. R-STATI-05 si attiva con `contaStati` (§10.1).

### 7.2 Risultato e revisione

Allenamento, ordine: titolo **Attività conclusa** o **Attività interrotta**;
nome/banca; «Hai affrontato {R} domande su {T} proposte. {M} non sono state
affrontate.»; «Risposte corrette: {C}»; «Risposte errate: {E}»;
se E>0 «Puoi rivedere le risposte o riprovare gli errori di questa attività»;
E=0, R>0 «Tutte le risposte date in questa attività sono corrette»;
M>0 «Le domande non affrontate non sono conteggiate come errori».
Azioni **Rivedi le risposte**, **Rivedi gli errori**, **Riprova questi {N}**
solo con lista pronta, **Scegli un'altra attività**, ritorno nominato.
Poi conservazione §4, invito §7.4 quando dovuto, «Puoi concludere qui.»
Numeri e lista da `riepilogoQuiz`, non conteggi sul DOM.

Simulazione: **Simulazione quiz base conclusa** / **Simulazione quiz vela
conclusa**; «Esito di questa prova, non una previsione dell'esame.»;
«Risposte corrette: {C} su {T}», «Risposte errate: {E}», «Domande senza
risposta: {M}», «Errori ammessi: {erroriMax}», **Prova superata / Prova non
superata** dal raccordo. «Tempo scaduto. La prova è stata consegnata» o
«Prova consegnata». Con M>0: «Le domande senza risposta non entrano nella
riprova degli errori. Puoi esercitarle scegliendo un argomento.»
Non si presenta il timer come tempo d'esercizio misurato.

Base e vela: due identità, due riepiloghi e riprove; **Continua con la vela**
se base superata, **Prosegui comunque con la vela** altrimenti, con il testo
«Il quiz base non è superato. Puoi proseguire con la vela per esercitarti;
all'esame il quiz base deve essere superato per proseguire.» Timer vela
solo al comando. Avviare riprova prima della vela richiede «La vela non è
ancora iniziata. Avviare un altro allenamento conclude qui questa
simulazione», **Inizia la riprova / Torna al riepilogo**. La revisione
base non cancella la fase in attesa; dopo vela **Rivedi il quiz base**.

Revisione: **Tutte le risposte ({R}) / Solo errori ({E})**; numero, domanda,
«La tua risposta», «Risposta ministeriale», note e figura, tag/segnalibro/
segnalazione §8. Lettura non scrive risposte o prova, tag solo per `auid`
del tentativo. **Torna al riepilogo** ripristina posizione. Anteprima
riprova: «Riprovare questi {N} quesiti»; lista esatta da `erroriSessione`,
**Inizia la riprova / Torna al riepilogo**; nuovo `sim_uid`, nessun timer.
Fonte cambiata/ambigua/mancante → blocco col motivo, non meno domande sotto
lo stesso N. «Questa attività è ricostruita dalle risposte: il confine non
era registrato» quando lo dice il motore; assente diverso da zero errori.

### 7.3 Carta, bozza, confronto

Testo libero, esercizio/posizione, navigazione, timer prova; il pallino verde
sul numero significa «qui ho scritto», non giusto. **Concludi e confronta**
per esercizi o **Consegna** per prova, conferma in pagina a due tocchi.
Zero testo allenamento → preparazione, senza righe; zero testo prova →
confronto, «Non hai scritto un risultato», giudizi comunque richiesti.
Indietro con lavoro: «Vuoi tornare al Carteggio? Il lavoro resta in questa
pagina», **Continua / Torna al Carteggio**, sospensione, scadenza continua.

Confronto: «Il sito non corregge il carteggio. Confronta il tuo risultato
con la risposta ministeriale e valuta ogni esercizio. Dove c'è un intervallo,
quello è la tolleranza. Un risultato coincidente non dimostra che il
procedimento sia corretto; per i dubbi, confrontati con la scuola.»
**Coincide / Da rivedere / Valuto dopo**, giudizi nulli separati; **Concludi
la valutazione** solo quando pronta, «Mancano {N} giudizi. Puoi valutarli
ora o riprendere il confronto più tardi.» Nessuna riga o invito prima della
conclusione. Righe da `concludiBozza` via `concludiCarteggio`, identici uid
al ritento; risposte e rimozione bozza nella stessa scrittura account.

HA già riconosciuto all'avvio: a ogni input bozza locale, **in corso /
salvato** solo dopo conferma; «Non siamo riusciti a salvare il lavoro su
questo dispositivo», **Riprova / Copia i risultati**, pallino. Ricarica:
**Riapri il lavoro**, stessa lista/posizione/testi/giudizi/scadenza, non
sessanta minuti nuovi; scaduta «Il tempo della prova è scaduto. Confronta
i risultati che avevi scritto». «La bozza resta solo su questo dispositivo;
non viene inviata al server e non si riprende da un altro dispositivo.»
Anonimo: stessa forma in memoria e avviso §4, niente storage; l'attività
iniziata anonima resta senza bozza persistente anche se intanto si accede.

Risultato: **Esiti autovalutati**, conteggi del raccordo, non affrontati
se noti, variante della prova o «Variante non registrata» per la vecchia;
**Rivedi i risultati / Rivedi quelli da rivedere ({D})**, ritorno effettivo,
invito solo dopo righe definitive. Nessuna riprova automatica carta.
Uscita account con lavoro: «Su questo dispositivo c'è del lavoro di
carteggio non concluso: uscendo lo perdi.» **Resta qui / Copia i risultati /
Scarta il lavoro ed esci**; scarto **Sì, scarta la bozza**. Invarianti C-19
anche fra schede, senza ricreare la copia di A dopo il suo logout.

### 7.4 I tre posti dell'invito

Home H1: testo §5.1. Risultato di simulazione con risposte: titolo
**Conserva questa prova**; «Conserva questa prova e ritrovala quando torni.»
**Non aggiungere** «Da queste risposte possiamo proporti da dove iniziare»
prima che P-76 lo renda vero: ADR-006 nomina proprio questo costo.
Nel riepilogo delle altre attività: **Vuoi conservare le attività di questa
pagina?**; «Senza account, chiudendo o ricaricando la pagina perdi le risposte
e le preferenze. Crea un account per salvare le risposte, ritrovarle su un
altro dispositivo e vedere i Progressi quando ci sono abbastanza dati.»
In entrambi: «Le risposte saranno legate alla tua email e conservate sul
nostro server, in chiaro. Il titolare può leggerle per supporto e statistiche.»
**Crea un account e salva / Continua senza account**, link **Hai già un
account? Accedi**, **Come trattiamo i dati** → legale nel documento.
Segnali: sostituire risposte con punteggi, senza contarli come quiz.

Result/revisione restano utilizzabili senza modulo e dopo rinuncia.
Rinuncia nel riepilogo vale per quel tentativo; nessun popup torna nel
runner successivo, il nuovo riepilogo può invitare. HA non vede inviti.
Progressi anonimo ha soltanto la spiegazione §8.1 e avatar generico:
**Aperto — autore A-2** se vuole un quarto posto, prima ADR-006 e controllo.
Il progetto non lo introduce.

## 8. Progressi, stati, tag, segnalibri e ricerca

### 8.1 Progressi nei due accessi

**HA:** titolo **Progressi**, «Le risposte date qui, lette come fatti.
Copertura e risultati sono cose diverse.» La prima release parte da mappa,
prove, andamento, sessioni, senza fasi. Sopra la mappa al massimo
**Dove pesa di più adesso: {tema}**, motivo e azioni **esattamente** da
`dovePesa` sul quadro corrente, nulla sotto soglia o senza indicazione.
**Perché questa proposta?** spiega i pesi e il motivo del motore, non la
fase o i quesiti «oggi» di P-76. Nessuna seconda classifica.

Mappa **Quiz base / Quiz vela**, righe da `quadro`, base nell'ordine del
peso, voci nell'ordine di banca; vela tre voci senza pesi/frase.
Barra cinque stati da `contaStati` sotto lo stesso filtro; testo e numeri
anche senza colore. **mai visti · da rifare · da confermare · recuperati ·
acquisiti**, nell'ordine; «In base alle ultime risposte. Ogni quesito sta
in un solo stato.» `?` apribile anche al tocco:
«Mai visti: nessuna risposta. Da rifare: l'ultima risposta è sbagliata.
Da confermare: hai risposto correttamente ma manca una conferma.
Recuperati: dopo l'ultimo errore hai dato due risposte giuste distanti
almeno 12 ore. Acquisiti: non ci sono errori e hai dato due risposte giuste
distanti almeno 12 ore. Una risposta sbagliata riapre il quesito. Le 12 ore
sono una scelta pratica del sito, da rivedere con i dati. Gli stati
descrivono risposte qui, non la padronanza dell'argomento.»

«Visti {Y} su {N}», «{X} su {Y} giusti al primo tentativo» solo se `primo`
non è null; «Conta soltanto la prima risposta: ripassando questo numero
non migliora, si muovono gli stati.» Sotto soglia testo §4, senza esporre
esatte1 a lato. Peso sul tema soltanto: «{peso} domande nella prova».
Tema → voci, stessa forma; **Allena** → preparazione con lista da `coda`
sul filtro e limite 20; **Rifai {N} errori** → tutti i deboli con
`soloDaRifare`, nessun tetto, N uguale a `contaStati().debole`. Zero:
«Nessun errore da rifare qui», senza pulsante. Ricezione/import/riga nuova
ridisegnano dallo specchio, senza aspettare ricarica.

**Le prove:** esiti di simulazioni e **Esiti autovalutati** carta, separati
dalla copertura, riga → riepilogo → revisione. **L'andamento:** da
`serieGruppi`/`tendenza`, soglie già esistenti, testo «Risultati delle
risposte nei giorni osservati. Ripetizioni incluse; cambia anche la
selezione dei quesiti. Non è una misura della preparazione.»
**Le sessioni:** `sessioni(...,{confine:'attivita'})`, righe apribili,
prime tre e **Mostra le altre sessioni**, limite ricostruito dichiarato.
«Puoi riaprire il riepilogo delle risposte. Non riprendi un'attività a metà.»
Segnali fuori mappa; nessuna media fra base, vela e carta.

**H0:** «Nessuna risposta in questa pagina. Puoi fare tutte le attività
senza account e rivederle qui finché la pagina resta aperta.» **Vai ad
Allenati**. **H1:** **Le attività di questa pagina**, risultati e link
veri a riepilogo/revisione, non una mappa cumulativa o un andamento.
Per entrambi: disclosure **Perché qui manca lo storico** →
«I Progressi nel tempo descrivono le attività salvate nel tuo account.
Senza account puoi fare tutte le attività e rivedere quelle della pagina
aperta. Con l'account ritrovi le risposte accolte dal server anche quando
torni e da un altro dispositivo. Le misure compaiono solo quando ci sono
abbastanza dati.» Nessuna CTA nel contenuto, nessuna sagoma dimostrativa
di uno storico. Avatar Accedi resta disponibile. HA vuoto: «Non ci sono
risposte nel tuo account», **Vai ad Allenati**, porta file in Profilo/Dati.

### 8.2 Tag e segnalibri

Errore corretto o in revisione: «Se vuoi, indica perché hai sbagliato.
Puoi saltare questo passaggio.» **Non lo sapevo** (`N`), **Svista** (`S`),
`aria-pressed`, facoltativi; ultimo tag per istante da `tagPerTentativo`,
una riga `_t:'g'` per gesto con `auid`, mai modifica della risposta.
«Classificazione precedente: Letto male» (`L`) / «Classificazione
precedente: Calcolo» (`C`) per righe storiche; non riconvertire in S.
«I tag non cambiano la selezione delle domande.»

Segnalibro: **Metti un segnalibro / Rimuovi segnalibro**, stato accessibile,
una riga `_t:'b'`, `uid`, `ts`, `item_id`, `segnato:1|0`; ultimo gesto
dal motore. Non è risposta, non cambia stati/esito/peso/sessioni.
Anonimo usa i contratti correnti `TIPI_RIGA` solo in memoria; HA prima
di ogni nuovo gesto chiede `rigaScrivibile(riga, io.tipi_riga)`, il risultato
è **null se scrivibile**, altrimenti motivo. Capacità assente/stale/vecchio
server: non scrivere S o b, non accodarli per tentare alla cieca.
«Il server collegato non accoglie ancora questo gesto. Puoi continuare
l'attività; riprova dopo l'aggiornamento.» N resta possibile se accettato.
Capability non è un numero versione inventato in pagina. Anche il gesto
in revisione/import segue il contratto del trasporto; errori restano visibili.

**Segnalibri** in Quiz: base/vela/tutte, elenco e «{quanti} quesiti segnati»
da **una** `codaSegnalibri`; **Allenati sui {quanti} segnalibri** →
preparazione/lista identica, senza tagliare a 20 di nascosto.
«Non ci sono quesiti segnati con questa banca. Puoi segnare una domanda
mentre ti eserciti o la rivedi.» se vuoto; `fuori` → «Questi riferimenti
segnati non sono presenti nella banca caricata: {riferimenti}», download
di recupero in caso di guasto, non sparizione dal conteggio. Anonimo
«I segnalibri valgono solo finché questa pagina resta aperta»; HA stato
invio come altre righe. Un segnalibro aggiunto/tolto tra preview e Inizia
ferma l'avvio se cambia la lista, conservando l'anteprima precedente.

### 8.3 Numero e segnalazione

**Cerca un quesito per numero**, etichetta «Numero del decreto», esempio
`1.1.1-24`, scelta base/vela/tutte; **Cerca**. Testo digitato passa a
`cercaNumero` senza parser, alias con punto, somiglianza o ricostruzione UI.
`valido:false` → motivo del motore; `quanti:0` valido → «Nessun quesito
con questo numero. Controlla il numero o prova una sua parte.»;
altrimenti «{quanti} quesiti trovati», gruppi **Numero esatto / Numeri
che lo completano**, riferimenti/testo dalla banca, tutti i duplicati.
Oscurati: «Oscurato: all'esame non esce. Puoi esercitarlo qui», prima
della risposta. Risultato → preparazione del quesito → Inizia,
nota `nbp` preservata; mai mostrare risposta ufficiale prima di rispondere.
Ritorno alla ricerca con campo e scroll in memoria.
Tre progressivi con punto restano non trovabili col contratto attuale;
decisione coda §4.14 separata, nessuna normalizzazione nuova in P-81.

Sotto ogni quesito, anche carta/tecniche e revisione: **Segnala un problema**.
Pannello «Segnala un problema»; «Copia il riferimento e descrivi che cosa
non torna. Non inserire password o dati dell'account.» Riferimento:
tipo/banca, `id`, numero ministeriale se presente, versione da meta;
**Copia il riferimento** → «Riferimento copiato» solo dopo Clipboard
riuscita; altrimenti «Non riusciamo a copiarlo. Seleziona e copia il testo
qui sotto», testo selezionabile. Indirizzo visibile
`indirizzo-da-scegliere@example.invalid`, con «Indirizzo non ancora
definito dall'autore: questo è un segnaposto». Nessun mailto attivo o
promessa di mail inviata; scelta reale e informativa sono **A-3, autore**.
Chiusura torna al quesito, timer non si ferma. Non aggiunge inviti account.

## 9. Tutti i tragitti P-65: destinazione, tocchi e continuità

La matrice sotto mantiene **108 ID**, 3 persone Z/F/R × H0/H1/HA × 12
compiti. Non sono prove con 108 persone. Le persone condividono le porte,
non il loro bisogno; parole lette nei §§5–8. Le quattro note rimisurano
tratti e P-69 il ciclo intero su fixture; questo progetto distingue quella
evidenza dai conteggi richiesti alla futura pagina.

Ogni freccia qui è **[M]**, memoria conservata nello stesso documento;
creazione/acquisizione è **[A]** solo con copia e uid accolti, non al clic.
Il controllo P-80 misura entrambi. Scroll, digitazione, lavoro sulla carta,
tag/segnalibri e scelte facoltative esclusi dal conto base; si annotano
separatamente. Avanzamento manuale nei conteggi, auto disattivato.

| Codice | Tratto dopo l'avvio, fino al ritorno |
|---|---|
| QB | n risposte, n−1 Avanti, Consegna → conferma, Rivedi → Chiudi → ritorno: `2n+4`, n=20 → 44 |
| QA | n risposte, n−1 Avanti, riepilogo, Rivedi → Chiudi → ritorno: `2n+3` |
| CC | n−1 Avanti, consegna/confronto a due tocchi, n giudizi, Concludi, Rivedi → Chiudi → ritorno: `2n+5` |
| SS | n risposte, n−1 Avanti, risultato, ritorno: `2n+1`; n reale della modalità |
| AC | Modulo già aperto: focus Email, focus Password, Crea l'account e salva, Salta per ora, Chiudi: 5; attese API non sono tocchi. Errori, retry o compilazione onboarding cambiano il conto |
| PA | Runner con una risposta già data: Termina → risultato parziale → ritorno, 2; da preparazione Chiudi, 1 |

Per 02, **A** = temi nella preparazione, 4 tocchi alla domanda;
**B** = temi in Quiz, 3. Entrambe passano dalla preparazione; niente promessa
di due. Per 03 n=7 e 04 n=4 sono le fixture P-67/P-69, non quantità
costanti di prodotto. Per 07 il successo P-65 è distinto dal ramo P-69
legale/errore/rinuncia: 52 senza account; HA 48 include Account aperto e
chiuso, contro 46 del vecchio conteggio che non li contava.

| ID P-65 / compito | Tocchi e parole, arrivo | Conteggio | Ritorno |
|---|---|---|---|
| Z-H0-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home, ora H1 dopo risposte |
| Z-H0-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| Z-H0-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| Z-H0-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| Z-H0-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| Z-H0-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| Z-H0-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB fino al Risultato → Crea un account e salva → AC [A]; Chiudi risultato [M] | 44 al modulo con n=20; 50 successo; 52 ramo errore/rinuncia P-69 | Stesso Risultato; successo Home HA, rinuncia Home H1 |
| Z-H0-08 · Registrarsi dalla Home | Accedi → Crea un account → AC [A] [M] | 2 al modulo; 7 successo | Home HA al successo; errore stesso modulo/origine |
| Z-H0-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home H0, stessa posizione/fuoco |
| Z-H0-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home H0, stessa posizione/fuoco |
| Z-H0-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| Z-H0-12 · Trovare i progressi | Progressi → Nessuna risposta in questa pagina → Home [M] | 1 all'arrivo; 2 totale | Home H0, righe intatte; dettagli richiudono su Progressi |
| Z-H1-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home H1 |
| Z-H1-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| Z-H1-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| Z-H1-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| Z-H1-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| Z-H1-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| Z-H1-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB fino al Risultato → Crea un account e salva → AC [A]; Chiudi risultato [M] | 44 al modulo con n=20; 50 successo; 52 ramo errore/rinuncia P-69 | Stesso Risultato; successo Home HA, rinuncia Home H1 |
| Z-H1-08 · Registrarsi dalla Home | Conserva le risposte → Crea un account → AC [A] [M] | 1 al modulo; 6 successo | Home HA al successo; errore stesso modulo/origine |
| Z-H1-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home H1, stessa posizione/fuoco |
| Z-H1-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home H1, stessa posizione/fuoco |
| Z-H1-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| Z-H1-12 · Trovare i progressi | Progressi → Le attività di questa pagina, risultati/revisioni veri → Home [M] | 1 all'arrivo; 2 totale | Home H1, righe intatte; dettagli richiudono su Progressi |
| Z-HA-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home HA |
| Z-HA-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| Z-HA-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| Z-HA-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| Z-HA-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| Z-HA-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| Z-HA-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB; Risultato → Account → Chiudi → ritorno; registrazione già soddisfatta [M] | 2 alla domanda; 48 totale con Account | Stesso Risultato, poi Home HA |
| Z-HA-08 · Registrarsi dalla Home | Account → Profilo → Chiudi; nessun secondo account [M] | 1 al Profilo; 2 totale | Home HA, stesso punto |
| Z-HA-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home HA, stessa posizione/fuoco |
| Z-HA-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home HA, stessa posizione/fuoco |
| Z-HA-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| Z-HA-12 · Trovare i progressi | Progressi → mappa cinque stati, prove/andamento/sessioni (senza fasi) → Home [M] | 1 all'arrivo; 2 totale | Home HA, righe intatte; dettagli richiudono su Progressi |
| F-H0-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home, ora H1 dopo risposte |
| F-H0-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| F-H0-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| F-H0-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| F-H0-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| F-H0-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| F-H0-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB fino al Risultato → Crea un account e salva → AC [A]; Chiudi risultato [M] | 44 al modulo con n=20; 50 successo; 52 ramo errore/rinuncia P-69 | Stesso Risultato; successo Home HA, rinuncia Home H1 |
| F-H0-08 · Registrarsi dalla Home | Accedi → Crea un account → AC [A] [M] | 2 al modulo; 7 successo | Home HA al successo; errore stesso modulo/origine |
| F-H0-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home H0, stessa posizione/fuoco |
| F-H0-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home H0, stessa posizione/fuoco |
| F-H0-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| F-H0-12 · Trovare i progressi | Progressi → Nessuna risposta in questa pagina → Home [M] | 1 all'arrivo; 2 totale | Home H0, righe intatte; dettagli richiudono su Progressi |
| F-H1-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home H1 |
| F-H1-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| F-H1-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| F-H1-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| F-H1-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| F-H1-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| F-H1-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB fino al Risultato → Crea un account e salva → AC [A]; Chiudi risultato [M] | 44 al modulo con n=20; 50 successo; 52 ramo errore/rinuncia P-69 | Stesso Risultato; successo Home HA, rinuncia Home H1 |
| F-H1-08 · Registrarsi dalla Home | Conserva le risposte → Crea un account → AC [A] [M] | 1 al modulo; 6 successo | Home HA al successo; errore stesso modulo/origine |
| F-H1-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home H1, stessa posizione/fuoco |
| F-H1-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home H1, stessa posizione/fuoco |
| F-H1-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| F-H1-12 · Trovare i progressi | Progressi → Le attività di questa pagina, risultati/revisioni veri → Home [M] | 1 all'arrivo; 2 totale | Home H1, righe intatte; dettagli richiudono su Progressi |
| F-HA-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home HA |
| F-HA-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| F-HA-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| F-HA-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| F-HA-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| F-HA-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| F-HA-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB; Risultato → Account → Chiudi → ritorno; registrazione già soddisfatta [M] | 2 alla domanda; 48 totale con Account | Stesso Risultato, poi Home HA |
| F-HA-08 · Registrarsi dalla Home | Account → Profilo → Chiudi; nessun secondo account [M] | 1 al Profilo; 2 totale | Home HA, stesso punto |
| F-HA-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home HA, stessa posizione/fuoco |
| F-HA-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home HA, stessa posizione/fuoco |
| F-HA-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| F-HA-12 · Trovare i progressi | Progressi → mappa cinque stati, prove/andamento/sessioni (senza fasi) → Home [M] | 1 all'arrivo; 2 totale | Home HA, righe intatte; dettagli richiudono su Progressi |
| R-H0-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home, ora H1 dopo risposte |
| R-H0-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| R-H0-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| R-H0-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| R-H0-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| R-H0-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| R-H0-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB fino al Risultato → Crea un account e salva → AC [A]; Chiudi risultato [M] | 44 al modulo con n=20; 50 successo; 52 ramo errore/rinuncia P-69 | Stesso Risultato; successo Home HA, rinuncia Home H1 |
| R-H0-08 · Registrarsi dalla Home | Accedi → Crea un account → AC [A] [M] | 2 al modulo; 7 successo | Home HA al successo; errore stesso modulo/origine |
| R-H0-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home H0, stessa posizione/fuoco |
| R-H0-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home H0, stessa posizione/fuoco |
| R-H0-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| R-H0-12 · Trovare i progressi | Progressi → Nessuna risposta in questa pagina → Home [M] | 1 all'arrivo; 2 totale | Home H0, righe intatte; dettagli richiudono su Progressi |
| R-H1-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home H1 |
| R-H1-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| R-H1-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| R-H1-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| R-H1-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| R-H1-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| R-H1-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB fino al Risultato → Crea un account e salva → AC [A]; Chiudi risultato [M] | 44 al modulo con n=20; 50 successo; 52 ramo errore/rinuncia P-69 | Stesso Risultato; successo Home HA, rinuncia Home H1 |
| R-H1-08 · Registrarsi dalla Home | Conserva le risposte → Crea un account → AC [A] [M] | 1 al modulo; 6 successo | Home HA al successo; errore stesso modulo/origine |
| R-H1-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home H1, stessa posizione/fuoco |
| R-H1-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home H1, stessa posizione/fuoco |
| R-H1-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| R-H1-12 · Trovare i progressi | Progressi → Le attività di questa pagina, risultati/revisioni veri → Home [M] | 1 all'arrivo; 2 totale | Home H1, righe intatte; dettagli richiudono su Progressi |
| R-HA-01 · Simulare il quiz base | Home → Simula il quiz base → Preparazione quiz base → Inizia; QB → Preparazione comune → runner → Risultato → Revisione [M] | 2 alla domanda; 46 totale | Home HA |
| R-HA-02 · Quiz su un argomento | Home → Allenati → Scegli un argomento → Meteorologia → Inizia (A); oppure Allenati → Meteorologia → Inizia (B); QA → Preparazione argomento → runner → Risultato → Revisione [M] | A: 4, totale 2n+7 (47 con n=20); B: 3, totale 2n+6 (46 con n=20) | Allenati/Quiz, argomento/filtri/scroll/fuoco |
| R-HA-03 · Giro delle tecniche | Home → Allenati → Carteggio → Esercizi su carta → Inizia (Giro delle tecniche); CC → Runner carta → Confronto → Risultato → Revisione [M] | 4 al primo; 2n+9 totale (23 con n=7) | Allenati/Carteggio, Esercizi/Giro, stesso punto |
| R-HA-04 · A tappeto | Home → Allenati → Carteggio → Esercizi su carta → A tappeto → Inizia; CC → Runner carta → Confronto → Risultato → Revisione [M] | 5 al primo; 2n+10 totale (18 con n=4) | Allenati/Carteggio, Esercizi/Tappeto, stesso punto |
| R-HA-05 · Prova di carteggio | Home → Esame → Prova di carteggio → Inizia; CC → Runner prova carta → Confronto → Risultato → Revisione [M] | 3 al primo; 16 totale | Esame, Prova di carteggio, stesso punto |
| R-HA-06 · Segnali | Home → Allenati → Segnali → Inizia (Fanali notturni); SS → Partita → Risultato Segnali [M] | 3 alla situazione; 2n+4 totale (24 con n=10) | Allenati/Segnali, Fanali, stesso punto |
| R-HA-07 · Registrarsi dal risultato | Simula il quiz base → Inizia → QB; Risultato → Account → Chiudi → ritorno; registrazione già soddisfatta [M] | 2 alla domanda; 48 totale con Account | Stesso Risultato, poi Home HA |
| R-HA-08 · Registrarsi dalla Home | Account → Profilo → Chiudi; nessun secondo account [M] | 1 al Profilo; 2 totale | Home HA, stesso punto |
| R-HA-09 · Privacy | Privacy → testo canonico sopra Home, /privacy → Chiudi [M] | 1 al testo; 2 totale | Home HA, stessa posizione/fuoco |
| R-HA-10 · Condizioni | Condizioni per l'account → testo canonico sopra Home, /avvertenza#condizioni → Chiudi [M] | 1 al testo; 2 totale | Home HA, stessa posizione/fuoco |
| R-HA-11 · Tornare indietro | Breve → Inizia → una risposta → Termina/Indietro → Risultato parziale → ritorno; oppure Chiudi dalla Preparazione [M] | Da Home: 2 alla domanda, 5 totale; dal runner risposto 2; da Preparazione 1 | Porta effettiva: Home breve, Quiz argomento, Carteggio carta, Esame prova; configurazione intatta |
| R-HA-12 · Trovare i progressi | Progressi → mappa cinque stati, prove/andamento/sessioni (senza fasi) → Home [M] | 1 all'arrivo; 2 totale | Home HA, righe intatte; dettagli richiudono su Progressi |

Porte secondarie, tutte **[M]**: Home → Carteggio esplicito → Esercizi →
Inizia, tre anziché quattro; Home → Segnali esplicito → Inizia, due;
Allenati → Simula la prova → Esame → prova → Inizia, quattro dalla Home
se si passa prima da Allenati; la scorciatoia Home rimane due.
Progressi → tema → voce → Allena/Rifai → Inizia, cinque dalla Home;
senza voce quattro; Rifai dalla scheda tema tre. Sessione → riepilogo →
revisione: tre dalla Home; disclosure sessioni vecchie aggiunge uno.
Segnalibri: Home → Allenati → Segnalibri → Allenati sui N → Inizia,
quattro. Ricerca: Home → Allenati → Cerca → risultato → Inizia,
cinque contando il comando Cerca, digitazione esclusa. Guida/esempio,
bozza ripresa, legale sopra modulo e dati sono tragitti aggiuntivi del
banco, non nuove voci di barra.

Ritorno sempre alla porta nominata nella matrice, stesso segmento, filtri,
posizione e fuoco. Dopo un'attività anonima H0 diventa H1; HA resta HA,
ma «salvato sul server» dipende dall'invio. In 08 HA il compito
registrarsi è già soddisfatto: nessun secondo account o logout artificiale.
Se AC fallisce, modulo/origine intatti e **Continua senza account**;
se dati o servizi non sono pronti il banco registra un ramo, non un arrivo
fittizio. Fasi/«sei qui» sono rimossi dagli arrivi 12 HA di P-65 in questa
release; si arriva alla mappa del §8.1.

## 10. Accettazione, dipendenze e consegna

P-80 prova il disegno dei controlli contro pagine giuste e rotte.
P-81 prova la pagina vera coi controlli consegnati e la guarda a 375 e
1280 px: nessuno sbordamento, conteggi/condizioni leggibili, target almeno
44 px, contrasto, focus e pannelli sopra i runner. La leggibilità dei
testi e dei cinque stati non è provata dal DOM; screenshot e stile
calcolato sono evidenza visiva, persone/Safari/zoom nativo/lettore di
schermo rimangono le prove dell'autore dopo rilascio, riga 18.

### 10.1 Prompt per chi tiene controlli e pagina

#### P-80 — Claude, `main`: contratti, banchi e specifica prima di P-81

Lavora nel checkout principale sul ramo `main`, leggi AGENTS e questo
progetto per intero; non modificare `site/index.html`, `site/app.html`,
manifest o legali. Implementa le dipendenze sotto, con un commit e
resoconto della coda. Non costruire fasi/costanza/stima/P-75. Se A-1/A-5
non sono decise, consegna i controlli delle due posizioni temi e il
contratto proposto del profilo, nominando il gate; non scegliere per l'autore.

**A. Fonte e regime.** Nuovo raccordo di primo livello
`navigazioneSito(richiesta)` e dichiarazione
`const VISTE_RIDISEGNO = ['home','allenati','esame','progressi'];`.
`richiesta` è `{url, evento, contesto}`; la funzione pura normalizza solo
destinazioni/alias del §3 e restituisce `{sezione, segmento, attivita,
fase, pannello, ritorno, effetto}`. Nessun archivio/DOM/HTTP dentro, nessuna
serializzazione delle risposte. `effetto` distingue apri/ripristina/chiedi
uscita/mostra risultato/indisponibile, non corregge o conclude prove.
P-80 fissa nel documento la firma finale **prima** di P-81.

Il regime si riconosce da **entrambe** le dichiarazioni, non dal nome di
un pulsante. Una sola, una lista diversa, client perso o router senza
raccordo → rosso con motivo. Senza entrambe si verifica la pagina attuale,
sette id del §5.2 e controlli esistenti interi; con entrambe il documento
canonico è `index.html`, esattamente i quattro id del §2, e tutti i
controlli nuovi interi. Non rendere facoltative le funzioni delle aree già
realizzate. Il banco accetta `RG_PAGINA` anche per la copia canonica e
la sostituisce su `/` e sulle query; `/app` testa la porta di compatibilità,
non sostituisce con una seconda copia della pagina. Gli orfani/protetti
si leggono sul sorgente canonico nel regime nuovo, su app nel precedente.

**B. Specifica e scadenza.** Riscrivi §§5, 6, 7 e R-NAV-01…07 per inventario,
struttura, preparazione comune, ritorni e tragitti del progetto; conserva
esplicitamente il regime attuale in un raccordo di transizione datato
P-80, con **scadenza alla merge della realizzazione P-81**. R-NAV-06 è
esattamente quattro `.view`, più inventario/porte delle superfici interne,
non un sottoinsieme permissivo. R-NAV-01 prova tragitti oltre porte;
02 conserva chiamate/orfani; 03 quattro voci intere e segmenti raggiunti;
04 tutte cinque intenzioni, sim che passa da Esame e le liste reali;
05 filtri locali; 07 prova banchi contro sé stessi. Aggiorna R-ACC-03/04
per tre posti/riepilogo anonimo, R-ACC-55 per onboarding, R-STATI-06 per
parole/legenda, R-ARCH-06/09 per canonico/manifest/porta. Il regime
precedente non è «scoperto»: deve continuare a passare i suoi controlli.
Alla merge della pagina la regia elimina solo il regime precedente,
senza buttare pagina di riferimento, rotture e controlli attivi.

**C. Agganci da conservare o cambiare, elencati prima del codice.**

| Banco / aggancio | Contratto per P-80/P-81 |
|---|---|
| `indirizzoApi(loc)` | Stessa firma, origini, CORS e porta 8620; estratto dal canonico. Nessuna replica del client nella porta `/app` |
| `[data-v]` e viste attuali | Barra nuova `home/allenati/esame/progressi`; porte reali compatibili `quiz/cart/seg/tec/info/diag/oggi` possono restare come alias: quiz→Allenati/Quiz, cart→Carteggio, seg→Segnali, tec→preparazione tecniche, info→Profilo/Info, diag→Progressi, oggi→Home. Nessuna vista vecchia fittizia. Banco guida il nuovo grafo e verifica i segmenti degli alias |
| `[data-rotta-start]`, `#rotta-last`, `#esame-data` | Mantieni su vera proposta Mirata/ultima attività/data; se duplicati tra Home e Profilo usa un solo id e un nuovo `data-` per la seconda resa, dichiarato nel banco. Niente elementi nascosti solo per i test |
| `MODI`, `[data-modo]`, `#start`, `selezioneQuiz(intenzione,conf,fonte)` | Cinque chiavi e firma invariate. `sim` ha ora porta a Esame; banco segue quella porta prima di `#start`. Breve, segni e numero fuori da MODI, con raccordo separato che il banco esegue |
| `riepilogoQuiz`, `anteprimaRiprova`, `avviaRiprova` | Firme e consumo E invariati, estraibili senza DOM/S. Origine contiene riferimento al nuovo contesto in memoria; nessun riconto di errori o lista |
| `mappaProgressi`, `anteprimaProgressi`, `avviaProgressi` | Mantieni firme area 5; estendi solo ritorno della mappa con `stati` su totale/tema/voce da `E.contaStati` sotto filtro identico, una chiamata per aggregato. Campi/ordine di `quadro`, `dovePesa` sul medesimo oggetto e azioni vecchie invariati. Aggiungi `anteprimaAllenaProgressi(riga,richiesta)` e `avviaAllenaProgressi(preparazione,richiesta,avvia)` per Allena, una `coda` con filtro e n=20; Inizia confronta lista e ordine, anche se il numero resta uguale, e usa lo snapshot o blocca. Non mascherare Allena come Rifai |
| `preparaCarteggio`, `avviaCarteggio`, `concludiCarteggio`, `riepilogoCarteggio` | Firme area 4/D-04 invariate; ingresso Allenati/Esame, giudizio prima di start; stessa bozza/mode/lista, stesso ritorno effettivo |
| Runner quiz `#r-text`, `#r-ans .ans`, `.ans.ok`, `#r-verdict`, `#r-pos`, `#r-close`, `#r-next` | Mantieni su elementi reali. Simulazione niente `.ok` fino alla consegna; tecniche `.chip` e verdetto propri; avvio non consuma tag o b come risposta |
| Carta `#c-start`, `#c-testo`, `#c-input`, `#c-consegna`, `#c-fine`; tecniche `#t-start` | Mantieni; banco raggiunge preparazione nel nuovo grafo prima di usarli, compreso R-UX-03 nel testo visibile |
| Ciclo `#r-fine.on`, `#rivedi.on`, `#rv-body`, `[data-ciclo="risposte"]`, `[data-ciclo="ritorno"]`, `[data-consegna="si"]` | Mantieni; anche nuovo router deve chiamare la stessa uscita/consegna; revisione non può essere una sagoma che il banco trova senza aver chiuso il tentativo |
| Segnali `#s-start`, `#sr-ans button`, `#sr-next`, `#sr-fine` | Mantieni; rotta verso segmento Segnali, quantità vera della modalità |
| Account `aria-modal`, etichette/campi, `#account-esito`, `#importa-file` | Mantieni pannello comune, messaggi dentro la finestra, testi/scelte distruttive del client. Legale ora livello sopra il modulo; C-20 deve seguirlo nel documento e provare anche ingresso diretto in altra scheda |
| Mappa/diagnosi nel client C-03 | Vecchi `#d-temi/#d-voci/#d-cons/#sessioni` non diventano richiesti nel regime nuovo: niente cruscotto storico anonimo, sì attività reali della pagina. Cerca mappa/account per sorgente e dati visibili, non per id storico assente |
| P-75 `domandaEsito`, `salvaEsito`, `avvioProva`, `daInviare`, `input[name="quiz-prova"]`, `[data-fase]` | Non riscrivere il raccordo di esito §10.1. Se fuso, E-01 cerca il riquadro in `#v-home`, non `#v-oggi`; fuori da runner/riepilogo/modal. Se non fuso, i regimi spenti restano. P-01 continua a provare avvio prima della risposta e invisibilità previsione |

**D. Numeri/contratti che mancano.** Quelli P-71 ci sono: non riscriverli.
P-80 confronta esigenze e firma finale prima di creare export. Richiesti:

1. `riepilogoPagina(righe, banca)` puro: restituisce conteggi separati
   quiz/tecniche/carta/prove, esatte/errate per quiz dove appropriato,
   attività e riferimenti da `sessioni(...,{confine:'attivita'})`, totale
   risposte e altri gesti separati. Niente b/g/a nelle risposte; nessuna
   storia cumulativa, nessun Segnale contato come risposta. Casi uid
   duplicati, righe ricostruite/ambigue e fonte vuota dichiarati. Serve
   Home H1 e Progressi anonimo: non sommare/filtrare per tipo in pagina.
   Se una composizione di export esistenti già dà esattamente questi
   campi, consegnala come raccordo puro eseguibile, con un unico oggetto
   per conteggio e lista; niente duplicato dell'algoritmo di sessioni.
2. Trasferimento/conflitto: controlla i conti «risposte» già richiesti da
   P-75 (`confermateRisposte`, `nonSalvateRisposte`) contro tag e b oltre
   ad a. Se mancano, estendi il contratto del motore prima della UI;
   la condizione che blocca l'uscita continua a leggere la coda intera.
3. Onboarding, dipendenza `main` di profilo dopo A-5: due campi facoltativi
   nullable `abilitazione: 'motore'|'vela'|null` e
   `conseguimento: 'prima'|'estensione_e12'|null`, separati dalla data,
   restituiti in `/v1/io`, risposta profilo ed export; assente non modifica,
   null azzera; validazione atomica, valore estraneo 422 con campo, nessun
   200 che ignora un valore richiesto. Migrazione additiva, export/import,
   ripristino e cancellazione verificati; capability esplicita
   `campi_profilo` nella descrizione, non una deduzione dalla versione.
   Server di prima → scelte temporanee dichiarate, nessun «salvate».
   Non registrare fasi o un obiettivo prospettico. Aggiorna il progetto
   degli account e il client per questo contratto; se la regia lo
   scorpora, P-81 aspetta la sua merge come P-80.
   *Fatto da P-83 il 15 ottobre 2026, su `main`:* schema 6 con le due
   colonne; `abilitazione`, `conseguimento` e `campi_profilo` nella
   descrizione dell'account (`GET /v1/io` e ogni risposta nella sua forma),
   le due scelte nell'export; un valore o un campo che il profilo non conosce
   è un `422 {errore, campo, messaggio}` che non scrive niente. Il server di
   `v0.30.0` non dichiara `campi_profilo` e butta le scelte con un `200`,
   misurato: è il ramo «scelte temporanee dichiarate». Il contratto per la
   pagina è nel §11.1 di `account-client-progetto.md`, quello del server nel
   §7.1 e nel §13.4 di `account-progetto.md`; la riga dell'informativa resta
   a P-81.

Nessun export per fasi, costanza, «oggi», durata o stima qui. Per la mappa
`contaStati` basta: i tre campi del quadro restano per azioni/compatibilità,
la barra nuova legge i cinque senza convertirli in pagina.

**Raccordi aggiuntivi da fissare nello stesso P-80**, puri e al primo
livello come quelli delle aree; non sono nuove modalità dentro MODI:

| Firma proposta | Ingresso e uscita da eseguire nel banco |
|---|---|
| `preparaBreve(conf,fonte)` | `fonte` come selezioneQuiz; `conf` con seme. Pool base completo da `E.coda(items,prog,oggi,{kind:'base',n:0,includiChiusi:true})`, poi una `E.estraiNuoviPrima(pool,prog,oggi,10,seme)`; ritorna `{lista,quanti,stato}`. Nessun filtro di banca duplicato in pagina. Conservare il risultato fino a Inizia; nessuna seconda pescata alla stessa apertura |
| `preparaSegnalibri(richiesta)` | `{banca,righe,kind}` → chiamata unica a `E.codaSegnalibri`, ritorno `{lista,quanti,fuori,stato}` senza tetto. `fuori` resta intero anche con banca filtrata |
| `avviaSegnalibri(preparazione,richiesta,avvia)` | Rilegge il contratto e confronta id/ordine con lo snapshot, non solo lunghezza. Invariato → `avvia(preparazione.lista,...)` una volta; cambiato → `{avviata:false,stato:'cambiata'}` senza avvio |
| `ricercaNumero(richiesta)` | `{banca,testo,kind}` → una `E.cercaNumero`, tutti i campi restituiti interi. Nessun parser UI e nessun filtro che nasconda duplicati/oscurati; scelta risultato per id → preparazione del quesito trovato, non risposta già corretta |
| `permessoGesto(riga,fonte)` | `fonte` distingue anonimo e HA, con `tipiRiga` correnti per anonimo e `io.tipi_riga` per HA; una `E.rigaScrivibile`, ritorno `{scrivibile:motivo===null,motivo}`. La UI verifica prima del gesto e il banco controlla che non venga archiviata una riga rifiutata |

Le righe g/b restano append-only nel client esistente, non prodotte dal
router. P-80 prova i raccordi e il loro collegamento ai veri gesti anche
quando la capability cambia dopo che la preparazione è stata aperta.

**E. Controllo dei tragitti, prima della pagina.** Aggiungi al banco Chrome
esistente un gruppo riconoscibile del ridisegno, senza dipendenze. Servi
la pagina come `strumenti/serve.py`, anche ingressi query/legali/porta;
sessione browser isolata, server account vero di prova, nessuna produzione.
Il raccordo puro da solo non prova la continuità. Per tutti i 108 ID §9,
condividere il giro quando le persone hanno lo stesso percorso, ma
registrare ID, stato, destinazione, tocchi attesi/osservati, ritorno.
Il controllo deve misurare:

- `Document`/loader identico, zero nuove richieste di documento dopo il
  primo ingresso nei tocchi ordinari; uid/payload/righe e bozza identici
  sulle frecce che leggono, mutazioni solo dove previste. Un token DOM
  da solo non basta se la pagina lo ricrea dopo una navigazione;
- anche quantità n, lista/ordine/id tentativo a preparazione e avvio;
  correzione/consegna/mancanti, uscite e revisione, testo visibile prima
  di start, timer che continua sopra Profilo/legale, fonte aggiornata
  fra anteprima e Inizia. Mai asserire un conteggio di tocchi senza il
  testo/titolo di arrivo e la possibilità di premere la porta;
- Home↔tre sezioni/segmenti; Profilo/Info; privacy, condizioni e
  avvertenza sopra Home, runner, confronto e modulo con campi compilati;
  Indietro/Avanti e Chiudi riportano allo stesso punto, non ripesca;
- ricarica/diretto query 200 e sezione giusta, anonimo vuoto e nessuna
  preferenza/punteggio; `/allenati` 404 dichiarato; ingresso `/app` e
  frammenti storici puliti; manifest nuovo e porta vecchia funzionante;
- C-02 storage da fuori per tutta `OSSERVAZIONE`, più registrazione delle
  scritture e verifica che `history.state`/URL non contengano dati di
  studio; nessun uid/testo/campo in log di fallimento (valori redatti);
- tre posti dell'invito esatti, nessun quarto nel contenuto di Progressi,
  nessun invito in runner/revisione/confronto/legale; rinuncia conserva
  memoria e non riapre al semplice Indietro;
- registrazione da Home e risultato dopo più attività: insieme completo
  degli uid prima, dopo copia locale, dopo server; coda/scarti e HTTP
  200 parziale; legale/errore/retry/rinuncia non cancellano niente;
- cinque stati visibili e ordinati, esatta somma, `ts` in tutti gli
  `applica`, seconda giusta a 12 ore immediatamente visibile senza
  reload; errore riapre; ricezione da altro dispositivo aggiorna mappa;
- N/S per auid, L/C storici, b add/remove senza effetti su risposta,
  `rigaScrivibile` con server P-73/v0.30.0 e contratto corrente; ricerca
  esatta/parziale/duplicata/oscurata/vuota/non valida/tre punti non trovati;
  clipboard riuscita e fallita, segnaposto non attivo;
- C-19 bozza e tutte le attività C-01 ancora complete; copie A/B isolate,
  account scaduto, scarti, export/uscita protetta e guasti visibili
  sull'avatar in ogni superficie. Niente parte esclusa per la nuova UI.

Pagina di riferimento **completa nel raccordo**, rotture deliberate:
link Home che ricarica; `/allenati` introdotto senza file; tappa/segmento
errati; perdita filtri/scroll/fuoco; dati in history/storage; runner
riavviato con Avanti; timer nuovo o congelato nel legale; modulo ricreato
senza campi; lista differente a Inizia; quarto invito o invito sul confronto;
«salvate» alla creazione/200 con scarti; un'attività scomparsa; alias cart
su Quiz; `applica` senza ts; N/S invertiti/L convertito; b contato come
risposta; segnalibri tagliati; oscurato senza avviso; un duplicato perso;
profilo ignorato e «salvato». Ogni rottura deve fallire **per il suo motivo**,
con passi precedenti verdi. Togli una difesa e prova che la relativa
rottura passa: prova il banco contro sé stesso. Mantieni anche varianti
giuste (domanda corta, nessuna figura, dati parziali, prova vuota) verdi.
Specifica nomi dei test veri/esiti scoperti, non copertura da stringhe.

**F. Chiusura P-80.** Tutte le suite necessarie, server anche Node 24 da
pacchetto verificato se modificato; interfaccia con 8620 libera, guardiano,
specifica e documentazione. Scrivi qui il contratto consegnato se differisce
dalla proposta, chiamanti coinvolti, copertura/limiti e scadenza dei due
regimi; aggiorna la specifica nella sua penna. La pagina attuale rimane
verde. Non chiudere gli orfani P-71 fino al consumo reale di P-81.
Rivedi inoltre tutti i controlli che leggono per nome `app.html`, non
soltanto R-NAV: architettura, risorse locali, testi/privacy, client e
rifinitura devono provare il sorgente canonico nel regime nuovo; la porta
`app.html` deve passare controlli suoi di compatibilità. Un vincolo non
sparisce perché il file che il test legge diventa una porta vuota.

##### Contratto consegnato da P-80 — 15 ottobre 2026

Scritto **prima del codice**, come i §10.1 delle aree. Dove differisce dalla
proposta sopra lo dice; i punti E (il banco dei tragitti in Chrome) e D.3 (i
due campi del profilo) restano a P-82 e P-83, e qui sta scritto che cosa
P-80 lascia loro.

**I chiamanti delle funzioni del motore che P-80 tocca, e che cosa cambia
per ciascuno.** Nessuna funzione esistente cambia firma o risultato.

| Funzione | Chiamanti oggi | Che cosa cambia |
|---|---|---|
| `riepilogoPagina(righe, banca)` | **nuova**: nessuno. Orfana dichiarata fino a P-81, che la consuma nella Home H1 e in Progressi anonimo | — |
| `sessioni(righe, {confine:'attivita'})` | `app.html` (ultima attività, riepilogo, elenco), `server/letture.mjs`, `erroriSessione()`, i banchi del ciclo | nessuno: `riepilogoPagina()` la **chiama**, non la copia |
| `attivitaCarteggio(righe, {tipo})` | `app.html` (riepilogo e revisione del Carteggio), `dettaglioCarteggio()`, `server/letture.mjs`, il banco del Carteggio | nessuno: chiamata com'è, una volta per tipo |
| `rigaDiRisposta(r)` | `riepilogoTrasferimento()`, `conflittoDa()`, `server/letture.mjs`, `server/statistiche.mjs` | nessuno: è il predicato con cui `riepilogoPagina()` separa risposte e gesti |
| `validaRiga(riga)` | import, server, `segnalibri()`, `tagPerTentativo()` | nessuno: `riepilogoPagina()` la usa per contare le righe che non hanno la forma di una riga, senza la banca |
| `riepilogoTrasferimento()`, `dopoInvio()`, `dopoRicezione()` | `app.html`, pagina di riferimento del client, `test_server.mjs` | **nessuno**. D.2 è una verifica, non una modifica: `confermateRisposte` e `nonSalvateRisposte` passano da `rigaDiRisposta()`, che dice falso per `'g'`, `'a'` e `'b'`; il test del conflitto mette ora anche un segnalibro fra le sole righe in coda, e il conto delle risposte resta zero |
| `contaStati()`, `codaSegnalibri()`, `cercaNumero()`, `rigaScrivibile()`, `estraiNuoviPrima()`, `coda()` | i primi quattro nessuno in pagina (orfani di P-71); `coda()` e `estraiNuoviPrima()` dalla pagina e dal motore | nessuno nel motore: li chiamano i raccordi della pagina, che il banco esegue |

**Il regime, da due dichiarazioni insieme** (A). Una pagina è nel regime del
ridisegno se il suo script dichiara, al primo livello e fuori dai commenti,
`function navigazioneSito(` **e** `const VISTE_RIDISEGNO = ['home', 'allenati',
'esame', 'progressi']`, esattamente questi quattro in quest'ordine. Nessuna
delle due → regime attuale, e i controlli di oggi girano interi. Una sola, o
una lista diversa → rosso con il motivo, in ogni suite che legge la pagina.
Il documento canonico: nel regime nuovo `site/index.html`; nell'attuale
`site/app.html`. Un `app.html` che dichiarasse il ridisegno è rosso: il
ridisegno vive in `index.html`, e `app.html` è la porta. `RG_PAGINA=<file>`
sostituisce il canonico, qualunque sia: il regime si legge dalla copia, e la
copia sta per `index.html` o per `app.html` di conseguenza; `site/app.html`
resta letto da `site/` quando è la porta. La regola sta in un modulo solo,
`tests/regime_pagina.py`, che `test_interfaccia.py` e `test_dati.py`
importano: due copie divergerebbero.

**La porta `app.html`, nel regime nuovo** (A, F): nessun `import` di
`/engine.js`, nessun `indirizzoApi()`, nessun `indexedDB`, nessuna richiesta
alla banca; un `location.replace(` verso `/?sezione=allenati&segmento=quiz`
che legge prima `location.hash` e lo toglie con `replaceState`; un
`<a href="/?sezione=allenati&segmento=quiz">Apri Allenati</a>` per chi non ha
lo script; `<title>Apri Allenati · Rotta Giusta</title>`; nessuna frase che
gli account rendono false. Il canonico ha il titolo «Rotta Giusta — quiz e
carteggio per la patente nautica», le icone, i meta Open Graph e le frasi
della versione con gli account che oggi stanno in due file. Il manifest ha
`start_url: '/'`. Le pagine legali tornano a `/`.

**`navigazioneSito(richiesta)`, la firma finale** (A). Pura: nessun DOM,
nessun archivio, nessuna rete, nessuna serializzazione di risposte.

```
navigazioneSito({ url, evento, contesto })
  url       percorso + query + frammento, com'è in location ('/?sezione=allenati&segmento=quiz', '/app#verifica=…')
  evento    'carica' | 'tocco' | 'cronologia'
  contesto  { attivita: null | { stato: 'in corso' | 'conclusa', riferimento },
              tappa: null | { sezione, segmento, pannello } }      la voce in memoria di history.state.nav
→ { sezione, segmento, attivita, fase, pannello, ritorno, effetto, motivo, url, gettone }
  sezione   'home' | 'allenati' | 'esame' | 'progressi'
  segmento  'quiz' | 'carteggio' | 'segnali' per allenati (quiz se assente), altrimenti null
  attivita  il valore di ?attivita, o null; 'tecniche' per l'alias tec
  fase      'preparazione' o null: un runner, un risultato o una revisione non si aprono da un URL
  pannello  'privacy' | 'avvertenza' | 'condizioni' | 'profilo' | 'info' | null
  ritorno   contesto.tappa, dove la chiusura del pannello o dell'attività riporta
  effetto   'apri' | 'ripristina' | 'chiedi-uscita' | 'mostra-risultato' | 'indisponibile'
  motivo    con 'indisponibile': 'parametro sconosciuto' | 'rotta non servita' | 'attivita non disponibile'
  url       l'indirizzo canonico, senza il frammento del gettone: quello che la pagina scrive con replaceState
            ('/privacy' e '/avvertenza#condizioni' per i pannelli legali)
  gettone   { tipo: 'verifica' | 'password', valore } letto dal frammento, o null; non torna mai in url
```

Regole. Un percorso diverso da `/`, `/app`, `/privacy`, `/avvertenza` è
`indisponibile` per «rotta non servita», con `sezione: 'home'` e `url: '/'`:
la funzione **non produce mai** un indirizzo del genere. `/app`, con o senza
query, è Allenati/Quiz. Gli alias dei `data-v` di oggi si accettano come
valore di `sezione`: `quiz` → allenati/quiz, `cart` → allenati/carteggio,
`seg` → allenati/segnali, `tec` → allenati/carteggio con `attivita:
'tecniche'`, `diag` → progressi, `oggi` → home, `info` → home con `pannello:
'info'`; il frammento `#profilo` apre il pannello `profilo` sulla sezione
chiesta. Un'`attivita` senza `sezione` è Allenati/Quiz. Un parametro che non è fra `sezione`, `segmento`, `attivita`,
`fase`, `banca` e i filtri pubblici (`temi`, `voci`, `n`), o un valore di
`sezione`/`segmento` sconosciuto, è `indisponibile` per «parametro
sconosciuto», sulla Home. `fase` diversa da `preparazione` è «attivita non
disponibile», con `fase: 'preparazione'` offerta. `/privacy`,
`/avvertenza`, `/avvertenza#condizioni` con `evento: 'tocco'` o
`'cronologia'` sono un pannello sopra la tappa del contesto (la Home senza
tappa); con `'carica'` sono «rotta non servita» dal canonico, perché quel
caricamento lo serve il file autonomo. Con un'attività in corso, un tocco o
una voce di cronologia che lascia la sezione è `chiedi-uscita`; il pannello
`profilo`/`info`/legale si apre sopra senza chiederla. Con un'attività
conclusa e `evento: 'cronologia'` l'effetto è `mostra-risultato`.
`'cronologia'` senza attività è `ripristina`. I segmenti e le sezioni si
leggono in minuscolo; una query vuota è la Home.

**I cinque raccordi aggiuntivi, e le due funzioni di Allena** (C, D). Puri,
al primo livello, fuori da `MODI`; `fonte` è quella di `selezioneQuiz()`.

| Firma consegnata | Contratto che il banco esegue |
|---|---|
| `preparaBreve(conf, fonte)` | `conf = { seme }`. Una `E.coda(items, prog, oggi, { kind: 'base', n: 0, includiChiusi: true })`, poi una `E.estraiNuoviPrima(<quel pool>, prog, oggi, 10, conf.seme)`; nessun'altra selezione. Ritorna `{ lista, quanti, stato }`: `lista` è il risultato della seconda com'è, `quanti === lista.length`, `stato` `'pronta'` con dieci, `'ridotta'` con meno di dieci e almeno una, `'vuota'` con zero. Il risultato si conserva fino a Inizia |
| `preparaSegnalibri(richiesta)` | `richiesta = { banca, righe, kind }`, `kind` anche `undefined` per tutte le banche. Una `E.codaSegnalibri(banca, righe, { kind })`; ritorna `{ lista, quanti, fuori, stato }` con i tre campi del motore com'erano — nessun tetto, `fuori` intero anche con `kind` — e `stato` `'pronta'` o `'vuota'` |
| `avviaSegnalibri(preparazione, richiesta, avvia)` | Rifà la stessa `E.codaSegnalibri` sulla richiesta di adesso e confronta **id e ordine** con `preparazione.lista`. Uguali → `avvia(preparazione.lista, 'segnalibri', { origine: 'quiz' })` una volta, `{ avviata: true, quanti }`; diversi, anche a lunghezza uguale → `{ avviata: false, stato: 'cambiata' }` senza avvio |
| `ricercaNumero(richiesta)` | `richiesta = { banca, testo, kind }`. Una `E.cercaNumero(banca, testo, { kind })`, con il testo com'è digitato; ritorna i campi del motore interi — `valido, motivo, numero, esatti, parziali, quanti, oscurati` —, duplicati e oscurati compresi, e `quanti === esatti.length + parziali.length` |
| `permessoGesto(riga, fonte)` | `fonte = { accesso: 'anonimo' | 'account', tipiRiga, io }`: senza account `E.rigaScrivibile(riga, fonte.tipiRiga)`, dove `tipiRiga` è `E.TIPI_RIGA`; con l'account `E.rigaScrivibile(riga, fonte.io && fonte.io.tipi_riga ? fonte.io.tipi_riga : null)` — `null` è il server di prima. Una chiamata; ritorna `{ scrivibile: motivo === null, motivo }` |
| `mappaProgressi(richiesta)` | Come l'area 5, più `stati` sul totale e su ogni riga: `E.contaStati(banca, progress, filtro)` con **lo stesso `filtro` della riga** di `quadro()` (`{ kind }` per il totale), una chiamata per aggregato e nessuna conversione dei cinque in tre. `righe`, `totale`, `indicazione`, `assente` e le azioni «Rifai» restano quelli di prima |
| `anteprimaAllenaProgressi(riga, richiesta)` | Una `E.coda(banca, progress, oggi, { ...riga.filtro, n: 20 })`; ritorna `{ stato: 'pronta', quanti, lista }` o `{ stato: 'vuota', quanti: 0, lista: [] }`. Non è «Rifai»: niente `soloDaRifare` |
| `avviaAllenaProgressi(preparazione, richiesta, avvia)` | Rifà la stessa `coda` e confronta id e ordine con `preparazione.lista`; uguali → `avvia(preparazione.lista, 'argomento', { origine: 'progressi' })` una volta, `{ avviata: true, quanti }`; diversi → `{ avviata: false, stato: 'cambiata' }` |

Differenze dalla proposta: `permessoGesto` prende `accesso` esplicito invece
di dedurlo da `io`, perché una pagina senza account ha `io` nullo e un
server di prima lo ha senza `tipi_riga`, e i due casi non si devono
confondere; `preparaBreve` dichiara `stato` perché la Home scrive «Allenati
con {N} domande» quando il pool è corto; i raccordi di Allena ricevono la
riga intera e ne leggono `filtro`, così la selezione è quella della riga e
non una ricostruita da nome del tema.

**`riepilogoPagina(righe, banca)`** (D.1), nel motore, una composizione
degli export che ci sono: `sessioni(righe, { confine: 'attivita' })`,
`attivitaCarteggio(righe, { tipo: 'c' })`, `attivitaCarteggio(righe, { tipo:
't' })`, `rigaDiRisposta()`, `validaRiga()`. Nessuna seconda copia del
ritaglio. Le righe si prendono una volta per `uid` (la prima); una riga che
`validaRiga()` rifiuta si conta in `scartate` e non entra. `banca` è `{
quiz, carteggio, tecniche }` — gli elenchi caricati — o `null`.

```
→ { vuoto, righe, doppioni, scartate,
    risposte: { totale, quiz, carteggio, tecniche, prove },
    quiz:      { risposte, esatte, errate },
    carteggio: { esercizi, coincidenti, daRivedere, senzaGiudizio },
    tecniche:  { risposte, coincidenti, nonCoincidenti },
    prove:     { quiz, carteggio },
    altri:     { tag, segnalibri },
    attivita:  [ { tipo: 'q'|'c'|'t', id, fonte, ambigua, motivi, mode, kind, n, esatte, inizio, fine, prova } … ],
    ricostruite, ambigue,
    mancanti:  banca ? { quiz: [...], carteggio: [...], tecniche: [...] } : null }
```

`vuoto` è vero senza risposte, anche con tag o segnalibri; `risposte.totale`
conta le righe per cui `rigaDiRisposta()` dice vero, `prove` le righe `'s'`;
`altri` i gesti che risposte non sono, e nessuno di loro entra altrove. **La
riga d'avvio non compare e non si conta**, nemmeno fra gli altri: la proposta
diceva «altri gesti separati» e la prima stesura contava gli avvii, e R-PREV-08
l'ha fermata — il tipo `'a'` compariva in una funzione che prepara una
schermata. La riga d'avvio è una testimonianza (§3.2 della specifica), e il
riepilogo ne legge soltanto il tipo per lasciarla passare; R-PREV-02 e
R-PREV-08 eseguono anche `riepilogoPagina()`. Le
attività sono quelle delle tre chiamate, più recenti prima, con `esatte`
le giuste dei quiz, i «coincide» della carta e le coincidenti delle
tecniche; `ricostruite` conta le `fonte: 'risposte'`, `ambigue` le
`ambigua: true`. I Segnali non hanno righe e non compaiono. Nessuna storia
cumulativa, nessun «oggi», nessuna durata né stima.

**I banchi** (A, C). Nel regime attuale ogni banco gira com'era, sulla
pagina di oggi, verifica per verifica; nel regime nuovo:

- il nuovo `tests/ridisegno.mjs` estrae dal canonico `VISTE_RIDISEGNO`,
  `navigazioneSito()` e i cinque raccordi — con le funzioni di primo livello
  che nominano e le costanti in MAIUSCOLO che queste leggono (le tabelle degli
  alias e dei parametri), mai lo stato `S` della pagina, così un raccordo che
  lo legge lancia come nei banchi dei quiz e della mappa —, e li esegue contro
  il motore vero con una spia sulle chiamate, come `selezioneQuiz()`: la navigazione sui
  casi del §3 (le quattro sezioni, gli alias, `/app`, `/allenati`, il
  frammento con il gettone, il parametro sconosciuto, la fase runner, i
  legali, l'attività in corso e conclusa); il breve con la banca vera e con
  una banca di sette e di zero quesiti; i segnalibri con segni, rimozioni,
  segni fuori banca e la lista cambiata a Inizia a lunghezza uguale; la
  ricerca su esatti, parziali, i numeri ripetuti, un oscurato, un testo non
  valido; il permesso con `E.TIPI_RIGA`, con `tipi_riga` della v0.30.0 e di
  P-73 e senza. In statica: quattro `.view` con gli id del §2 e nessuna
  delle sette di prima, una `<nav>` con le quattro voci intere, i tre
  `[data-segmento]`, gli alias `[data-v]` solo fra quelli della tabella C.
  La pagina di riferimento è `tests/pagina-ridisegno.html`, con le rotture
  del §10.1 che un banco sotto Node vede: `/allenati` prodotto, la tappa e il
  segmento sbagliati, l'alias `cart` su Quiz, il gettone che resta nell'URL,
  il runner aperto da un link, una seconda pescata del breve, i segnalibri
  tagliati, un duplicato o un oscurato persi dalla ricerca, il gesto `S`
  scritto a un server di prima, Inizia che non confronta l'ordine;
- il banco della mappa (`tests/mappa_progressi.mjs`) riceve il regime e nel
  nuovo pretende `stati` da una `contaStati` per aggregato, con il filtro
  della riga, e le due funzioni di Allena; la sua pagina di riferimento le
  realizza, e porta le rotture (stati convertiti in tre, un filtro diverso,
  una `contaStati` sola per tutto, Allena mascherato da Rifai, l'ordine
  non confrontato a Inizia);
- i banchi dei quiz, del ciclo e del Carteggio leggono il canonico e
  girano com'erano: le loro firme non cambiano (tabella C); nel regime nuovo
  la porta `data-modo="sim"` sta in `#v-esame`;
- il banco del client e la rifinitura leggono il canonico e lo servono su
  `/` invece che su `/app`, con `site/app.html` servito com'è come porta; le
  porte `[data-v]` di oggi si traducono con gli alias della tabella C quando
  la pagina non le tiene. **Nel regime nuovo nessuna pagina li esercita in
  P-80**: la pagina di riferimento del client in Chrome, i gruppi del
  ridisegno e le loro rotture sono P-82, con il banco dei tragitti. P-80
  consegna l'innesto — il regime letto, l'ingresso, la traduzione delle
  porte — e lo dice qui invece di dichiararlo provato.

**La specifica** (B): §5, §6 e §7 riscritti sul progetto, con il regime di
oggi conservato in «Il regime di transizione (P-80)» nel §6, datato 15
ottobre 2026 e con **scadenza alla merge di P-81**: alla merge la regia
toglie dai controlli il ramo del regime attuale, e tiene pagine di
riferimento, rotture e controlli. R-NAV-01…07 riscritti; nuovi R-NAV-08
(i tragitti, scoperto fino a P-82), R-NAV-09 (il regime letto da due
dichiarazioni), R-NAV-10 (`navigazioneSito`), R-NAV-11 (i raccordi
aggiuntivi), R-NAV-12 (la porta `app.html`), R-NAV-13 (il banco del
ridisegno contro sé stesso), R-MAPPA-18 (gli stati e Allena), R-ARCH-19
(`riepilogoPagina`); R-ACC-03/04, R-ACC-55, R-STATI-06, R-ARCH-06/09
aggiornati come il punto B dice.

**Che cosa resta a P-82 e P-83.** P-82: il gruppo dei tragitti in Chrome
(E) per intero — documento identico, cronologia, legali sopra il lavoro,
storage e `history.state`, i tre posti dell'invito, i cinque stati in
schermata e le parole di Q-STATI (R-STATI-06), i gesti con i server di
prima dal browser, la porta `/app` e il frammento visti dal browser —, con
la pagina di riferimento del client nel regime nuovo e le rotture del §10.1
che qui non si vedono (link Home che ricarica, perdita di filtri/scroll/
fuoco, dati in storage, timer nel legale, modulo ricreato, «salvate» con
scarti, quarto invito, `applica` senza `ts` in esecuzione, N/S invertiti,
`b` contato come risposta in schermata). P-83: D.3 per intero sul server, e
il campo `campi_profilo` che l'onboarding leggerà; fino ad allora
`permessoGesto` non sa niente del profilo, e il banco non chiede niente di
«salvate» alle scelte di preparazione.

**Che cosa questi controlli non vedono.** Tutto quello che il §10.1 di
`account-client-progetto.md` dice dei banchi sotto Node: il DOM, i testi,
il fuoco, i ritorni, la geometria. La navigazione si prova come funzione —
un indirizzo entra, una destinazione esce —, non come documento che resta
lo stesso: quello è E. Che i raccordi siano **collegati** ai gesti veri — la
casella di ricerca, il pulsante del segnalibro, Inizia — lo guarda solo il
collegamento statico (chi li chiama nello script), come per la mappa.

##### E, consegnato da P-82 — 16 ottobre 2026

**Fatto.** Il gruppo N-01 del banco del client (`tests/client_account.mjs`),
riconosciuto dal regime che `tests/regime_pagina.py` legge e che
`test_interfaccia.py` passa a ogni prova; la pagina di riferimento del client
nel regime nuovo, `tests/pagina-client-ridisegno.html`, con la porta
`tests/pagina-porta-app.html` su `/app`; ventisette rotture in `ROTTURE_NAV` e
la pagina di P-80 con le due dichiarazioni e senza il grafo, rosse ognuna per
il suo motivo; i controlli `test_ridisegno_tragitti` (R-NAV-08),
`test_ridisegno_stati_in_schermata` (R-STATI-06) e
`test_ridisegno_tragitti_provati_al_contrario` (R-NAV-14), e le parti
dell'invito e delle scelte sotto R-ACC-03 e R-ACC-55. Sulla pagina di oggi il
gruppo non si applica, e il controllo lo dice; dalla merge di P-81 gira sulla
pagina vera, con tutti i gruppi del client, nel regime nuovo. I 108 ID del §9
sono dodici compiti per tre stati, con un giro condiviso dalle tre persone
(Z, F, R) che hanno lo stesso percorso: per ognuno una verifica dell'arrivo —
il titolo, i tocchi attesi e osservati, fino all'arrivo e fino al ritorno — e
una del ritorno, con la sezione, il segmento, il fuoco sulla porta e, dove il
§9 lo chiede, lo scorrimento.

**Scostamenti dalla proposta, detti invece di nascosti.**

- **AC è di quattro tocchi, non cinque**: «Email», «Password», «Crea l'account
  e salva», «Salta per ora». Il §9 conta un «Chiudi» dopo «Salta per ora» che
  il client non ha — il modulo si chiude alla creazione, §4.3 del progetto del
  client, e C-04 e C-07 lo tengono fermo. Le formule di 07 e 08 usano AC = 4.
- **Nella simulazione la risposta si dice** con `aria-pressed` sulla scelta, e
  «Avanti» porta alla domanda dopo (QB: «n risposte, n−1 Avanti»): nessuna
  correzione durante la prova, come prima.
- **`[data-rotta-start]` apre la preparazione**, non la domanda (§5.2: un
  runner si apre solo da Inizia); i gruppi del client ci passano da Inizia.
- **I segmenti dicono il loro stato con `aria-selected`**, e il banco legge la
  tappa da lì; Info è un pannello che si apre dal Profilo sopra ogni
  superficie, e l'alias `info` porta alla Home come vuole la tabella C.
- **Rotture della proposta che non ci sono**, perché il gruppo non le vede o le
  vede un altro controllo: la lista che cambia fra anteprima e Inizia (R-NAV-11,
  sotto Node); il modulo ricreato senza campi sopra un legale; «salvate» con
  un 200 parziale (C-10 e C-12 girano sulla stessa pagina); un'attività
  scomparsa; il segnalibro contato come risposta in schermata; i segnalibri
  tagliati. E le varianti giuste — domanda corta, nessuna figura, dati
  parziali, prova vuota — non girano sulla pagina nuova: girano sulla pagina di
  riferimento di oggi.
- **Il banco contro sé stesso, una difesa alla volta**, a mano: senza il
  registro delle chiamate a `pushState` la voce con i dati della tappa passa
  verde; tre rotture passavano verdi prima di rinforzare il banco — i link con
  `data-v` saltavano il ramo rotto del gestore, il timer che riparte si
  confrontava con sé stesso invece che con l'orologio, e gli stati si leggevano
  dopo la ricezione dal server, che nascondeva un `applica()` senza istante:
  ora le righe si trattengono mentre si guarda.

**Trovato costruendo la pagina, per P-81** (difetti che una realizzazione del
ridisegno può ripetere, e che il banco ora vede): dopo la registrazione dal
risultato, il risultato restava con l'invito e la frase di chi non ha
l'account (N-01:registrazione); `giroTecniche()` restituisce `{ e, tecniche }`,
non l'esercizio, e preso per esercizio il giro si apre vuoto (tragitti 03); un
tocco su un'altra sezione con un'attività in corso chiede di uscire, mentre
un'attività conclusa si chiude e lascia il suo risultato; e un salto nella
cronologia è asincrono — un `pushState` durante un `history.go()` in corso
mescola la pila, quindi i gesti arrivati intanto si rinviano.

**Che cosa resta al collaudo di P-81**, a 375 e 1280 px: la gerarchia e la
geometria, il `?` della legenda dei cinque stati, i testi che il banco non
cerca, il tocco vero, Safari.

#### P-81 — ChatGPT, `ui/main`, Local: realizzazione dopo P-80 fuso

Verifica cartella/ramo e un solo scrivente. Leggi AGENTS, questo documento,
il contratto consegnato da P-80 e le decisioni A-1/A-5 dell'autore.
Se P-80 o un gate indispensabile manca, lavora sulla copia temporanea che
non dipende dal gate, senza inventare il contratto; non pubblicare una
versione incompleta del grafo. Nessuna modifica a motore, tests, specifica,
coda, VERSION o dati; `sw.js` escluso. Non implementare i rimandati del §1.

**Tre passi di lavorazione, un solo commit finale P-81**, perché un cambio
di documento a metà farebbe perdere le risposte passando da Home:

1. In una copia dell'HTML fuori da `site/`, porta Home/client/runner nel
   canonico e costruisci raccordo/router, quattro viste, segmenti,
   Profilo/legali e compatibilità `/app`/manifest. Esegui il banco sulla
   copia con `RG_PAGINA`; pagina attuale intatta e verde, riferimento nuovo
   e rotture sempre eseguiti da P-80. La copia non si pubblica e non è
   un secondo ramo di prodotto.
2. Nella stessa copia consuma contratti per mappa, tag, segnalibri, numero,
   onboarding e riepilogo anonimo; conserva tutte le funzioni delle aree
   e il client con i suoi guasti. Realizza §§4–8 con testi per esteso,
   singolare/plurale e porte del §9. P-75 solo se già fuso, secondo il suo
   raccordo; nessuna attivazione dei suoi regimi spenti per emulazione.
3. Verifica tutti i tragitti sulla copia, i due accessi e stati di errore,
   screenshot/stili a 375/1280 e tastiera. Quando tutto passa, sostituisci
   `index.html`, porta `app.html`, manifest e link legali insieme. Aggiorna
   anche l'elenco dei dati nell'informativa se A-5 porta i due campi nel
   profilo: nomina le scelte facoltative di preparazione, senza introdurre
   il percorso o la stima. Il segnaposto segnalazioni resta fino ad A-3.
   Aggiorna
   `docs/eccezioni-interfaccia.md` nello stesso commit: sposta
   `contaStati`, `rigaScrivibile`, `codaSegnalibri`, `cercaNumero` e
   `estraiNuoviPrima` (ora chiamata da preparaBreve) dagli
   orfani alle chiamate protette; le chiamate indirette `statoQuesito` e
   `segnalibri` non diventano chiamate finte. `classifica` resta protetta
   finché una chiamata reale resta; se sostituita in tutte le rese, dichiarane
   chiamanti e motivo nel diff, senza togliere gli export del motore.
   Proteggi anche l'eventuale export riepilogoPagina quando consumato.
   Orfani P-75 gestiti solo col suo lavoro. Nessuna pulizia di altre righe.

Prima del commit suite intere, guardiano, doc-current, diff mirato anche
su file esclusi; stage per nome, CHANGELOG additivo coi numeri verificati,
trailer ChatGPT. Se la lavorazione richiede più turni, la regia conserva
la copia e lo stato di avanzamento, non fonde un frammento di navigazione
a metà. Se serve davvero suddividerla in più commit pubblicabili, la regia
deve scrivere un nuovo raccordo/termine prima, non lasciare due documenti
di studio attivi. Alla merge finale la regia chiude il regime precedente
di P-80; poi rilascio separato su `main`, e prova con persone riga 18.
Nessun push, tag o pubblicazione in P-81. Chiudi col resoconto della coda.

##### P-81 — blocco del collaudo sulla copia, 17 ottobre 2026

**Fermato prima della realizzazione**, secondo l'istruzione di segnalare un
contratto che si contraddice senza cambiare i controlli. Il passo 1 pretende
il verde sulla copia con `RG_PAGINA=<copia>` dalla cartella principale;
il passo 3 mantiene `site/` intatto fino al collaudo riuscito e alla
sostituzione simultanea di canonico, porta, manifest e link. Il contratto
consegnato da P-80 dice però che `RG_PAGINA` sostituisce soltanto il canonico:
`site/app.html` resta letto dal sito. Non c'è una porta della copia che
questa variabile possa sostituire.

**Riprodotto**, senza modificare pagine o test, sul checkout principale
alla base `e626ded` (stessa base di `ui/main`). Copiata la pagina di
riferimento `tests/pagina-client-ridisegno.html` fuori dal repo; impostato
`RG_PAGINA` su quella copia; importato `tests/test_interfaccia.py` dalla
cartella principale ed eseguito il suo `test_porta_app()`: regime
`ridisegno`, canonico `index.html`, **6 controlli riusciti su 7**. Il rosso
è «nel ridisegno site/app.html è la porta di compatibilità»: la pagina
letta importa ancora il motore, dichiara il client, apre IndexedDB e non
è la porta richiesta. Verificata anche l'uguaglianza fra il testo letto
da `leggi('app.html')` e quello di `site/app.html` del checkout principale.
È una prova mirata del blocco, non l'esecuzione della suite intera e non
un collaudo dell'interfaccia di P-81.

Il medesimo limite riguarda il browser: `banco_client()` passa alla prova
`app` il solo canonico; il server di `tests/client_account.mjs` serve
`/app` dal proprio `site/`. N-01:indirizzi pretende invece il passaggio
da `/app` alla query canonica. La pagina di riferimento del ridisegno
riceve separatamente la porta tramite `sito`, mentre la prova della copia
non la riceve. Questo secondo punto è letto nel codice, non rieseguito
in Chrome in questa verifica.

**Alla regia:** consegnare un modo di collaudare insieme la copia del
canonico e i suoi file accompagnatori, oppure autorizzare un banco
isolato dell'intero sito con i controlli invariati. Sono possibilità da
decidere, non modifiche al contratto approvate qui. Fino a quel raccordo
non si può promettere il verde richiesto sulla copia lasciando intatta la
pagina attuale. Nessuna implementazione, sostituzione o commit parziale;
nessun controllo adattato e nessuna eccezione aggiunta.

**Il raccordo c'è, dal 17 ottobre 2026 (P-84, `2554a36`).** `RG_SITO=<cartella>`
sta per `site/` intera — canonico, porta, manifest, pagine legali, dati, figure
e motore — in `tests/test_interfaccia.py`, nel banco del client in Chrome, nei
cinque banchi sotto Node (`tests/sito.mjs`) e in `tests/test_dati.py`; il
regime si legge dalla copia; `RG_PAGINA` resta; le due insieme, una cartella
che manca o senza `index.html` sono un rosso detto, mai un ripiego su `site/`;
la riga finale di ogni suite dice che ha misurato una copia e quale. Il
blocco qui sopra è un test, `test_copia_del_sito`, rosso con il codice di
prima in 20 verifiche su 22. **Il metro della copia è la pagina intera di
P-81, non la pagina di riferimento del client**: su quella, con `RG_SITO`,
restano 86 rossi che sono la pagina di riferimento — non ha `MODI`, i
raccordi delle aree, `CASA`, i testi di C-18 — e nessuno riguarda la porta,
N-01 o `RG_SITO`. P-81 misura la sua copia con `RG_SITO=<cartella> python3
tests/test_interfaccia.py` e `tests/test_dati.py` dalla cartella principale.

##### P-81 — contratto della barra da chiarire, 17 ottobre 2026

**Fermato sulla copia, prima della sostituzione.** Il §3.3 prescrive «Link
con `href` reale» e conserva l'apertura in una nuova scheda o con
modificatori. La barra della copia usa perciò quattro `<a data-v>` con
`href` `/`, `/?sezione=allenati`, `/?sezione=esame`,
`/?sezione=progressi`. I controlli `test_voci_barra()` in
`tests/test_interfaccia.py` e `statica()` in `tests/ridisegno.mjs`
censiscono invece soltanto `<button data-v>`. La pagina di riferimento
ha pulsanti, senza questi indirizzi sulla barra. Non decido qui se il
§3.3 debba essere precisato o il banco debba riconoscere anche i link:
sostituirli con pulsanti rinuncerebbe al comportamento nativo richiesto;
affiancare porte duplicate per il controllo non sarebbe il grafo deciso.

**Riprodotto dalla cartella principale**, base `f57459a`, con
`RG_SITO=/private/tmp/rg-p81/sito`, regime letto **ridisegno**. Dodici
controlli mirati — navigazione e raccordi del ridisegno, modalità quiz,
istante in `applica`, righe/azioni/stati della mappa, riepilogo/riprova
del ciclo, preparazione/righe/riepilogo del Carteggio — danno **798
verifiche riuscite su 799**. Il rosso è «la barra ha le quattro voci,
in ordine: Home · Allenati · Esame · Progressi», con «voci:» vuoto.
Controprova **solo in memoria** sullo stesso HTML: sostituiti i quattro
link della barra con pulsanti, il banco del ridisegno non ha rossi.
Nessun controllo modificato; non è il verde della suite intera.

In Chrome la copia si apre senza eccezioni JavaScript; guardata la Home
H0 a **375 e 1280 px**, con screenshot e stili calcolati: quattro link
con le parole e gli indirizzi attesi, **0 px di sbordamento orizzontale**
in entrambe le misure. È la verifica della Home e della barra, non dei
108 tragitti o dell'intero client. La 8620 è stata osservata libera per
90 secondi, fino alle 09:17:37 del 17 ottobre (Europe/Rome); nessuna suite
completa dell'interfaccia è stata avviata dopo il fermo.

**Stato conservato:** copia completa in `/private/tmp/rg-p81/sito`,
script e nota di ripresa in `/private/tmp/rg-p81/lavoro`, misure in
`/private/tmp/rg-p81/evidenze`. Predisposti canonico, quattro sezioni,
segmenti, preparazioni, Profilo/legali, porta e manifest; raccordi e
consumi P-71/onboarding in lavorazione, **non collaudati nel browser**.
Restano i gruppi completi dell'interfaccia, tutti i guasti del client e
N-01, la revisione dei testi e delle chiamate vive, i link ufficiali,
le tre frasi della privacy, le eccezioni e il collaudo completo di §9.
`site/` resta intatto; nessuna sostituzione o commit parziale, nessun
push, tag o rilascio. Il passo successivo richiede prima il chiarimento
della regia sul contratto della barra; la copia non è pronta da fondere.

**Il banco riconosce la barra a link, da P-85 (17 ottobre 2026).** Il
contratto resta il §3.3: nel ridisegno le quattro voci sono `<a data-v>` con
l'`href` canonico della sezione — `/`, `/?sezione=allenati`,
`/?sezione=esame`, `/?sezione=progressi` —, nell'ordine di `VISTE_RIDISEGNO`.
`test_voci_barra()` e la statica di `tests/ridisegno.mjs` censiscono link e
pulsanti con `data-v`, e nel ridisegno un pulsante al posto di un link, un
link senza `href`, un `href` diverso dal canonico, con l'estensione o verso
`/allenati` sono rossi con il motivo. Le due pagine di riferimento del
ridisegno hanno i link; il banco del client in Chrome li preme con lo stesso
clic generico, e la pagina di riferimento del client passa tutti i suoi
gruppi. La barra della copia di P-81 è verde così com'è.

**Le scelte di preparazione si accendono con il rilascio di P-81** (deciso
dall'autore il 17 ottobre 2026, `account-progetto.md` §2.7-bis). Fino ad
allora il server in esercizio non dichiara `campi_profilo` e rifiuta i due
campi: la v0.31.0 esce così, prima di P-81. Per la pagina di P-81 non cambia
niente — senza `campi_profilo` l'onboarding non promette la persistenza, ed è
il ramo che N-01:scelte già prova —, e i banchi accendono i campi sul server
di prova. Li accende sul server vero il commit di rilascio di P-81, nello
stesso tag che porta la riga dell'informativa del §11.2 del progetto del
client; l'interruttore è di P-86. *(18 ottobre 2026, P-86: fatto. È
`scelte_di_preparazione` in `RACCOLTE`, `server/raccolte.mjs`; spente, il
profilo le rifiuta con un `422` e `campi_profilo` dice `['data_esame',
'segnali']` — `account-progetto.md` §2.7-bis.)*

##### P-81 — collaudo e fermo sulle dichiarazioni delle chiamate, 18 ottobre 2026

**Copia conservata, nessuna sostituzione.** Ripresa su `ui/main`, base
`8e32369`, con i controlli del checkout principale `ab1bb95`. La suite
intera, eseguita dal checkout principale con
`RG_SITO=/private/tmp/rg-p81/sito`, legge **ridisegno** e misura **3.245
verifiche riuscite su 3.366**, **121 rosse**, in **544,07 secondi**.
La 8620 era libera da 90 secondi alle 14:47:53 (Europe/Rome).
È la misura della copia all'inizio della sessione, prima delle correzioni
successive, non un collaudo superato della copia attuale.

**Il contratto di chiusura non è eseguibile così scritto.** Il prompt
richiede il verde sulla copia prima della sostituzione, eseguendo la suite
**dalla cartella principale**, e sposta le sei dichiarazioni in
`docs/eccezioni-interfaccia.md` soltanto nella chiusura del lavoro UI.
`RG_SITO` sostituisce `site/`, mentre `tests/test_interfaccia.py` legge
`ECCEZIONI = RADICE / 'docs' / 'eccezioni-interfaccia.md'`, con `RADICE`
ricavata dal percorso del test. Legge quindi il documento di **main**,
non quello del worktree UI e non un documento della copia temporanea.
Le chiamate reali a `contaStati`, `rigaScrivibile`, `codaSegnalibri`,
`cercaNumero`, `estraiNuoviPrima` e `riepilogoPagina`, richieste da P-81,
producono sei rossi per gli orfani consumati e uno per le nuove chiamate
non protette. Anche aggiornare il documento UI non cambierebbe il file
letto da quel comando. Non si modifica il checkout principale, non si
spostano i controlli e non si introduce una chiamata finta per ottenere
il verde. Serve alla regia definire come il collaudo della copia debba
leggere le dichiarazioni che accompagnano quella stessa copia.

**Un secondo punto da precisare riguarda `classifica`.** L'unico chiamante
nella pagina attuale è la composizione del testo `rotta-rec-motivo` nella
vecchia Home; la copia non lo conserva. Il controllo la pretende ancora
fra le chiamate vive. Questo §10.1 consente di dichiararne chiamanti e
motivo quando sostituita in tutte le rese; il prompt della ripresa limita
invece il diff delle eccezioni ai sei spostamenti, «nessun'altra riga
toccata». La rimozione della protezione di `classifica` non è stata fatta
né sostituita con un consumo artificiale. La regia deve esplicitare il
trattamento di questa riga. I due controlli non modificati su orfani e
protette riproducono **8 rossi su 151 verifiche**; sette riguardano le sei
nuove chiamate, uno `classifica`. Non spiegano gli altri rossi della pagina.

**Il secondo collaudo evidenzia anche il disallineamento di N-01 con
P-86.** In `tests/client_account.mjs`, `corsia().esegui()` assegna
`RACCOLTE` alla prova chiamata `app`, mentre accende entrambe le raccolte
per le pagine di riferimento. `server/raccolte.mjs` su `ab1bb95` ha
`scelte_di_preparazione: false`. Per `app`, quindi, il caso «dichiarati»
di `N-01:scelte` non riceve `campi_profilo`, ma pretende che il modulo
prometta la conservazione e salvi le due scelte; anche il caso «ignorati»
parte da questa pretesa. `SERVER.oggi` non altera la risposta del server.
La pagina che rispetta il controllo della capability non può soddisfare
quel ramo. Il paragrafo precedente di questo progetto e il prompt dicono
invece che i banchi accendono le scelte sul server di prova. Il collaudo
mirato riproduce entrambi i rossi del modulo e quello dell'onboarding
`N-01:registrazione`. Non si accende il server dal ramo UI, non si rinomina
la pagina come riferimento, non si elude `campi_profilo`: serve allineare
il contratto del banco per P-81 conservando la verifica del caso spento.

**Correzioni solo nella copia:** chiusura delle preparazioni e ritorni,
fuoco e scorrimento, porte degli esercizi, Profilo/Info, controlli e testi
delle scelte, tag N/S con lettura di L/C, segnalibro, ricerca per numero,
inviti e testi del riepilogo. I dodici controlli mirati dei raccordi danno
**801/801**. Nel browser, ritorno alla porta di un argomento con lo stesso
fuoco e scorrimento (**705 px a 375**, **547 px a 1280**); nessuno
sbordamento orizzontale. Esercitati ricerca per numero, N poi S,
segnalibro e riferimento della segnalazione a 375 px: nessun errore
JavaScript, nessuno sbordamento. Screenshot guardati. Sono prove
circoscritte: non attestano i 108 tragitti, l'intero client o l'accessibilità
completa. Il secondo collaudo mirato, già avviato al momento del fermo,
misura **282 verifiche riuscite su 347**, **65 rosse**, in **359,31 secondi**;
8620 libera da 90 secondi alle 14:59:02. Il conteggio riguarda soltanto i
gruppi selezionati, senza le verifiche Python di completezza né riferimenti
e rotture: non è confrontabile con il totale della suite intera. Restano
rossi su Carteggio/Segnali, ritorni, client, scelte e gesti; alcuni tragitti
si fermano prima del termine. La relativa istantanea è conservata,
separata dalla copia aggiornata dopo l'avvio. Guardiano (**183 file**) e
controllo documentale passano sul worktree UI.

**Ripresa:** cartella completa `/private/tmp/rg-p81/sito`; istantanea iniziale
`lavoro/index-inizio-18.html`, istantanea del secondo collaudo
`lavoro/index-collaudo-18-mirata.html`, script e nota in `lavoro/`, log,
misure e screenshot in `evidenze/`, sotto `/private/tmp/rg-p81`.
Il file `evidenze/contratto-eccezioni-18.json` registra anche i percorsi
realmente letti dalla suite. Restano i difetti della pagina, il collaudo
completo e la chiusura atomica. `site/`, test, motore, documenti protetti,
versione e dichiarazioni delle eccezioni restano intatti; nessun commit
parziale, push, tag o rilascio. Non fondere la copia.

**I tre punti, decisi il 18 ottobre 2026** — i primi due dalla regia, con il
sì dell'autore; il terzo è P-88.

1. **Le dichiarazioni si leggono dal worktree della copia.** P-81 lancia la
   suite dal suo worktree, `~/Software/rotta-giusta-ui`, con
   `RG_SITO=/private/tmp/rg-p81/sito`: `test_interfaccia.py` legge le
   eccezioni accanto a sé, cioè quelle che accompagnano la copia. Lì sposta
   prima le sei dichiarazioni, e la riga di `classifica` del punto 2, nel suo
   `docs/eccezioni-interfaccia.md`, che è fra i file che può toccare. La
   garanzia che i controlli siano quelli di `main`: `ui/main` allineato a
   `main` e `git diff main -- tests/ server/ site/engine.js` vuoto prima di
   ogni misura. Nessun codice nuovo. Fino alla sostituzione la suite lanciata
   da quel worktree **senza** `RG_SITO` è rossa sulle dichiarazioni, ed è
   atteso: la pagina che gli corrisponde è la copia.
2. **`classifica` esce dalle chiamate protette.** L'unica chiamata della pagina
   di oggi è la frase del motivo nella vecchia Home (`site/app.html`, la
   `rotta-rec-motivo`), che il ridisegno toglie. `classifica()` resta usata
   dentro il motore — da `quadro()`, `dovePesa()` e `traccia()` (§4.1 della
   specifica) —, e il controllo sugli orfani la accetta come `semaforo()`.
   P-81 toglie la riga con il motivo scritto accanto; è l'unica riga in più
   oltre ai sei spostamenti.
3. **N-01 contro P-86: il banco accende per parte, non per pagina.** È un buco
   del contratto di P-86, non della pagina. P-88 lo chiude in
   `tests/client_account.mjs`: la parte che prova una raccolta accesa la
   accende sul suo server, su qualunque pagina, e il caso spento si prova con
   il server spento davvero. Con P-88 entra anche la terza raccolta, i
   **segnalibri**, spenti fino al rilascio di P-81 (`account-progetto.md`
   §2.7-bis): N-01:gesti li accende come N-01:scelte le scelte, e il rilascio
   di P-81 accende sul server vero scelte e segnalibri, con le due righe
   dell'informativa del §11.2 del progetto del client.

P-81 riparte con P-88 fuso, dalla copia, con lo stesso prompt aggiornato.

### 10.2 Verifica documentale di P-79 e limiti

Verificati cartella, ramo, albero iniziale pulito e inventario delle chat:
nessun altro scrivente attivo sul worktree. `main` e `ui/main` locali sulla
base `43638eb`; pull `--ff-only` non applicato perché manca upstream, nessun
ramo remoto scelto. Non è una prova di allineamento al remoto.
Misura locale del §3: otto richieste e giro Chrome sintetico, nessun file
di `site/` modificato. Letti nel browser i tre Home approvati, le due
varianti attività, mappa e giro; guardata schermata HA a 375 px, dove la
proposta «8 da confermare oggi» è esplicitamente finta e qui rimandata.
Questa lettura non ricollauda i mock né la pagina pubblicata.

Controlli di chiusura e conteggi effettivi sono nella voce P-79 del
CHANGELOG e nel resoconto. Non si attribuisce a P-79 un verde del router
di produzione, dei 108 tragitti su risposte vere, della normativa nuova,
dell'acquisizione, di Safari o di usabilità con persone. Nessun contatto
esterno, produzione o pannello hosting toccato.

## 11. Decisioni che servono all'autore, e incompatibilità ferme

| Punto | Scelta e conseguenza, senza decidere al posto dell'autore |
|---|---|
| A-1 — Temi e due tocchi | Scegli temi in Quiz (tre) o nella preparazione (quattro). I due tocchi richiesti dal §1 non sono realizzati da nessun mock: un accesso diretto dalla Home o saltare preparazione è decisione nuova. Ferma la disposizione e il budget tocchi di 02 in P-81; P-80 può provare entrambe **Deciso dall'autore il 15 ottobre 2026: i temi nel segmento Quiz, tre tocchi.** I due tocchi del §1 restano non fatti, dichiarati; lo scorrimento a 375 px si prova con le persone dopo il rilascio (coda §4, «Dopo P-59», 16). |
| A-2 — Progressi anonimo | Il progetto applica la spiegazione senza CTA del mock P-68/ADR-006. Se intendi un invito, serve il quarto posto nell'ADR e nel banco prima di scriverlo. Non ferma il progetto nel regime dei tre posti |
| A-3 — Indirizzo segnalazioni | Scegli l'indirizzo e il testo dell'informativa. Fino ad allora segnaposto visibile, copia funzionante, nessun mailto. Ferma solo l'indirizzo operativo, non i tragitti |
| A-4 — Ambito/fasi/costanza | Le tre fasi e il 50% di P-68, «oggi» di P-66/P-68, obiettivo e conclusione sono esempi, non export. Aspettano P-76 e le decisioni coda §4.9/10/15; non entrano di nascosto nelle Home/Progressi P-81 |
| A-5 — Scelte di preparazione in HA | Conferma il contratto di persistenza descrittiva ora, distinto dall'obiettivo di P-76, oppure rimandalo e accetta scelte dichiarate temporanee. Il mock mostra quattro obiettivi ma il profilo attuale non li conserva: ferma il «salvate» e la chiusura completa di onboarding HA **Deciso dall'autore il 15 ottobre 2026: sì, i due campi nel profilo**, con P-83 sul server prima di P-81 e una riga nell'informativa (coda §4, punto 17). |
| A-6 — Promessa nel risultato | La frase ADR-006 «Da queste risposte possiamo proporti da dove iniziare» non regge con P-76 rimandato. Il progetto la lascia fuori mantenendo «Conserva questa prova e ritrovala quando torni». Se vuoi la frase completa al primo rilascio, P-76 diventa dipendenza; non si pubblica una promessa futura come esistente **Deciso dall'autore il 15 ottobre 2026: solo la prima metà**, «Conserva questa prova e ritrovala quando torni», fino a P-76 (coda §4, punto 18). |

Tre altre discrepanze sono già risolte dal perimetro, senza nuove decisioni:
i mock sono HTML separati per il revisore, non documenti da copiare come
navigazione di produzione; le loro varianti di nomi restano superate dai
nomi provvisori del 14 ottobre; P-69 ha una spiegazione e una certezza
finte, che P-81 non deve trasportare. P-75 conserva il proprio progetto e
i propri gate, nessuna nuova decisione sull'esito o sulla stima qui.

**Da sapere per la regia:** P-66 trova tre note con DM 133/2024 nel JSON,
README/Home storica parlano di undici divergenze: sono oggetti diversi e
non è una confutazione normativa. Il ridisegno conta le note esistenti;
l'eventuale revisione della banca/README è un lavoro motivato su `main`.
I nomi non hanno ancora una prova con persone; l'autore l'ha spostata dopo
il rilascio. Non dichiarare che P-70 abbia collaudato lettura, scroll o
comprensione, e non usare il guardiano come prova di queste cose.
