# P-65 — La mappa dei tragitti

12 ottobre 2026 · passo 1 di 5 · documento di mock, senza schermate né codice.

## Che cosa è deciso, che cosa si propone

La struttura dell'autore è **Home · Allenati · Esame · Progressi, più
l'avatar**. Le porte, i testi operativi e gli indirizzi sotto sono proposte
concrete per provarla. Non sono un aggiornamento della specifica né una prova
che il sito di oggi abbia questi comportamenti. P-66 disegnerà le schermate;
P-65 verifica sulla carta che ogni destinazione abbia un ingresso e un ritorno.

Fonti lette: [specifica §1](../../specifica.md#1-per-chi-è),
[§5](../../specifica.md#5-inventario-che-cosa-esiste-e-dove-ci-si-arriva),
[§6.3](../../specifica.md#63-gli-invarianti-qualunque-struttura-si-scelga);
[decisioni di P-59](../../idee-dopo-gli-account.md#le-decisioni-di-p-59),
I-13, I-14, I-18, secondo parere I-01 e I-09 «I primi due profili»;
[ADR-004](../../adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md),
[ADR-005](../../adr/ADR-005-semplificare-senza-offline-e-senza-archivio-di-prima.md).
Le decisioni finali prevalgono sulle proposte precedenti nelle schede: niente
Progressi dimostrativi al posto delle risposte vere, niente «sempre su Quiz»
quando si torna da Carteggio, niente serie o traguardi. Letti anche AGENTS.md,
filosofia, README e le voci pertinenti del CHANGELOG.

Tre persone: **Z**, chi comincia da zero e teme di studiare la cosa sbagliata;
**F**, chi è in formazione e vuole scegliere senza perdere tempo;
**R**, chi ripassa sotto esame e vuole vedere dove manca evidenza.
Le persone non determinano blocchi o menu diversi: cambia il loro intento.

Tre stati: **H0**, senza account e senza risposte nella pagina corrente
(«prima visita» nel mock, non un fatto conoscibile sul ritorno della persona);
**H1**, risposte nella pagina aperta, senza account; **HA**, con account.
Un account in caricamento non è un account vuoto: «Stiamo caricando le tue
risposte», poi contenuti o errore con «Riprova». Mai una mappa vuota provvisoria.

## Albero delle voci e indirizzi proposti

Un ingresso nella barra apre una sezione. Allenati aperto dalla barra senza
contesto mostra **Quiz**; un link esplicito a Carteggio o Segnali apre quel
segmento. Tornare da un'attività ripristina sezione, segmento, filtri,
posizione di scorrimento e controllo che aveva il fuoco. Non si pesca di nuovo.

```text
Home (/)
├─ Simula il quiz base → Preparazione quiz base (stessa di Esame)
├─ Prova 10 domande [nome proposto, §Nomi] → Preparazione allenamento breve
├─ Registrati / Conserva le risposte → Registrazione [porte sotto]
├─ Perché questa proposta? [HA] → Progressi, punto pertinente
├─ Com'è fatto l'esame → Esame, sintesi e approfondimento
└─ Che cosa non torna → Note sulla banca, fonti e riferimenti
Allenati (/?sezione=allenati; segmento predefinito quiz)
├─ Quiz (/?sezione=allenati&segmento=quiz)
│  ├─ Allenamento consigliato → Preparazione (Mirata)
│  ├─ Scegli un argomento → Preparazione (base/vela, temi/voci, quantità)
│  ├─ Ripassa gli errori → Preparazione (risposte disponibili)
│  ├─ Un giro tra gli argomenti → Preparazione (screening)
│  ├─ Segnalibri → Elenco → quesito / Preparazione [P-59, da realizzare]
│  └─ Cerca un quesito per numero → Ricerca → quesito [P-59, da realizzare]
├─ Carteggio (/?sezione=allenati&segmento=carteggio)
│  ├─ Esercizi → Preparazione: Giro delle tecniche / A tappeto
│  ├─ Che tecnica serve? → Preparazione riconoscimento → runner tecniche
│  ├─ Prova di carteggio → stessa Preparazione di Esame, modalità prova
│  ├─ Riprendi la bozza [se presente] → stesso ambiente, stessa scadenza
│  ├─ Come funziona / Esempio → guida / esempio, nessuna risposta scritta
│  └─ Le attività di carteggio fatte → riepilogo → revisione
└─ Segnali (/?sezione=allenati&segmento=segnali)
   └─ Fanali notturni / Segnali diurni / Suoni da nebbia / Segnali di manovra
      → stessa Preparazione di gioco → partita → risultato
Esame (/?sezione=esame)
├─ Com'è fatto l'esame → sintesi → approfondimento con fonti datate
├─ Prova di carteggio → Preparazione (4 esercizi, 60 min, 3 su 4)
├─ Simula il quiz base → Preparazione (20 domande, 30 min, al più 4 errori)
├─ Simula il quiz vela → Preparazione (5 domande, 15 min, al più 1 errore)
├─ Quiz base e vela → Preparazione → due fasi con risultati distinti
├─ Data d'esame / Che cosa stai preparando? → stesse impostazioni del Profilo
└─ Le prove fatte → risultato → revisione, fonti disponibili nel proprio stato
Progressi (/?sezione=progressi)
├─ H0: Nessuna risposta in questa pagina; che cosa aggiunge l'account
├─ H1: Le risposte di questa pagina → attività → risultato → revisione vera
└─ HA: Sei qui (Percorso) → temi → voci → Allena / Rifai N errori
   ├─ prove → risultato → revisione / riprova degli errori
   ├─ andamento e sessioni → dettaglio → risultato → revisione
   └─ Perché questa proposta? → spiegazione del punto della mappa
Avatar (/?pannello=profilo, sovrapposto alla vista di origine)
├─ H0/H1: Accedi → Accesso → Crea un account / Password dimenticata
├─ HA: Account → email, verifica, stato dell'invio, Esci
├─ Data d'esame / Che cosa stai preparando? (facoltative e modificabili)
├─ Dati → Scarica / Carica [solo HA] / Azzera (ambito dichiarato)
├─ Info e diagnostica → banca, versione, guasti e stato dell'invio
├─ Privacy (/privacy)
└─ Condizioni per l'account (/avvertenza#condizioni) / Avvertenza (/avvertenza)
Da ogni schermata, anche attività: avatar con segnale del guasto + link legali.
```

Ogni attività ha **Preparazione → attività → Risultato → Revisione**.
Preparazione conserva titolo, condizioni e valori qualunque sia la porta;
solo il contesto di ritorno cambia. Le risposte e la lista vengono dal motore:
il mock non ricalcola Mirata, conteggi, stati, quote o «Rifai N errori».
La prova di carteggio ha la variante «Prima i mai provati», distinta dalla
prova cieca; resta nella stessa preparazione. Le condizioni d'esame sono
quelle registrate nella specifica, non una nuova ricerca normativa di P-65.

Per gli indirizzi delle attività si propone `/?attivita=quiz-base&fase=preparazione`,
`/?attivita=argomento&fase=preparazione`, `/?attivita=carteggio&modo=prova&fase=preparazione`
e gli analoghi per esercizi, tecniche e Segnali. Il titolo della Preparazione
è lo stesso nell'albero e nei tragitti; il ritorno segue sempre la stessa
regola «alla porta effettiva», anche quando la porta è diversa. Parametri per
filtri condivisibili sono ammessi; risposte, email, testi su carta e dati personali non entrano nell'URL.
Le domande successive non aggiungono tappe alla cronologia: il percorso del
runner resta una sola tappa, senza serializzare il lavoro.
Un risultato ha un riferimento al tentativo **in memoria**, non le risposte
nell'indirizzo: se il tentativo non esiste si dice «Questa attività non è
disponibile qui» e si offre la Preparazione, senza inventare un risultato.

### Copertura dell'inventario attuale (§5.2 e §5.3)

| Voce attuale | Porta proposta, sempre raggiungibile | Chiusura / ritorno |
|---|---|---|
| Rotta (`v-oggi`) | Home per proposta e fatti; Progressi per Percorso e spiegazione; Esame per data e prove; Home → Che cosa non torna | Ritorno alla porta effettiva, nessuna seconda classifica della preparazione |
| Quiz (`v-quiz`) | Allenati → Quiz | Barra; le attività riportano a Quiz con filtri e posizione |
| Carteggio (`v-cart`) | Allenati → Carteggio; Esame → Prova di carteggio | Origine Allenati/Carteggio o Esame, stesso ambiente |
| Progressi (`v-diag`) | Progressi nella barra; Home → Perché questa proposta? | Dalla spiegazione si torna al punto della mappa; Home dalla barra |
| Che tecnica serve? (`v-tec`) | Allenati → Carteggio → Che tecnica serve? | Allenati/Carteggio; porta esplicita, mai sotto Quiz/Altro |
| Gioco dei segnali (`v-seg`) | Allenati → Segnali; possibile richiamo Home alla stessa vista | Allenati/Segnali o Home, secondo la porta |
| Info e diagnostica (`v-info`) | Avatar → Info e diagnostica, anche nel runner | Vista o attività sospesa da cui si è aperto |
| Allenamento consigliato / Mirata | Allenati → Quiz → Allenamento consigliato; proposta Home se il motore la dà | Origine esatta; stesso tentativo, nessuna nuova selezione al ritorno |
| Scegli un argomento (anche tutta la banca) | Allenati → Quiz → Scegli un argomento | Quiz con selezione base/vela, temi/voci, quantità, filtri locali |
| Ripassa gli errori | Allenati → Quiz → Ripassa gli errori; Progressi → Rifai N errori quando disponibile | Quiz o voce della mappa; il conteggio apre la sua lista |
| Simulazioni base / vela / base e vela | Esame → pulsante corrispondente; Home → Simula il quiz base | Esame o Home; base e vela mantengono due riepiloghi e due riprove |
| Un giro tra gli argomenti | Allenati → Quiz → Un giro tra gli argomenti | Quiz; nessuna trasformazione tacita in test d'ingresso obbligatorio |
| Prova di carteggio, cieca / prima i mai provati | Esame → Prova di carteggio; Allenati → Carteggio → Prova di carteggio | Porta effettiva; stessa bozza e stessa revisione |
| Giro delle tecniche | Allenati → Carteggio → Esercizi, scelta già su Giro delle tecniche | Carteggio, Esercizi selezionati |
| A tappeto | Allenati → Carteggio → Esercizi → A tappeto | Carteggio, Esercizi/A tappeto selezionati |
| Riconoscimento delle tecniche | Allenati → Carteggio → Che tecnica serve? | Carteggio; risultato e revisione delle scelte, non del lavoro su carta |
| Segnali, quattro modalità | Allenati → Segnali → modalità nella Preparazione | Segmento Segnali e modalità; extra separato dalla copertura |

Tutte le righe valgono senza account fino al risultato e alla revisione.
Senza errori, segnalibri o risposte pertinenti si mostra il vuoto con il motivo,
non si avvia una lista diversa. Per i segnalibri il contratto è futuro; la porta
non giustifica anticiparne la contabilità in pagina. Nessuna porta è ripristinata
nel codice in questa sessione.

I controlli di §5.4 conservano anch'essi una porta: filtri «Solo domande mai
fatte» e «Solo quesiti con figura», base/vela, quantità e spunte nella Preparazione
per argomento; note prima/dopo la risposta al loro momento; tag facoltativi su
errori e revisione; figura ingrandita → «Chiudi la figura» → stessa domanda.
Le spiegazioni verificate, quando ci saranno, saranno per tutti: dopo la
risposta nell'allenamento, dopo la consegna nella simulazione. Le spiegazioni
in schermata (`?`) restano al tocco e al mouse. Trasferimenti, stato dell'invio,
verifica email, recupero password, uscita e cancellazione stanno nel Profilo/Info:
i guasti si vedono già sull'avatar, anche con la barra nascosta nel runner.

## Continuità: il significato di ogni passaggio

Nelle tabelle, **[M]** dopo un tocco significa: le risposte già date
**sopravvivono**, perché si cambia vista nel medesimo documento e l'archivio in
memoria non viene ricreato. Vale per ogni freccia, compresa chiusura e ritorno.
In H0 il patrimonio iniziale è vuoto; dalla prima risposta vale la medesima
regola di H1. In HA lo stesso passaggio conserva memoria, copia e coda, senza
per questo dichiarare che il server abbia già accolto ogni riga.

**[A]** significa: la registrazione acquisisce le risposte di **tutte** le
attività della pagina, non soltanto della simulazione appena conclusa. Prima
della conferma della copia restano in memoria; dopo, nella copia dell'account e
nella coda; «Sul server» solo dopo l'accoglimento delle righe. Errori di rete,
email non verificata, rifiuti o scritture fallite non cancellano il patrimonio
anonimo né fingono un'acquisizione completata. Il modulo resta sopra il risultato.

**[N]** (usato nelle eccezioni): il link apre una nuova scheda; la scheda di
studio conserva le risposte perché non naviga. La nuova scheda non le eredita.
**[P]**: ricarica, chiusura, abbandono del documento o scarto esplicito; senza
account la perdita resta possibile o voluta. Nessun [P] è necessario nei
108 tragitti ordinari sotto.

### Un documento di studio, indirizzi reali, nessun salvataggio anonimo

Oggi `/` e `/app` sono due documenti. La decisione 9 chiede di eliminare quel
cambio dopo l'ingresso: cambiare soltanto la barra senza cambiare questo fatto
renderebbe «Home» una perdita quotidiana. **Proposta da implementare dopo i
mock:** portare Home e attività nel documento canonico servito su `/`;
`/app` diventa una porta di compatibilità che, prima di qualsiasi risposta,
manda alla sezione Allenati/Quiz del documento canonico. Non si torna poi a
caricare `/app` da un link della Home. Il titolo pubblico e la presentazione
della Home restano leggibili anche prima che la banca sia pronta.

Le sezioni usano query sul percorso già servito `/`, per esempio
`/?sezione=progressi`: indirizzi copiabili e apribili direttamente senza
supporre che l'host statico abbia un ripiego per `/progressi`. Percorsi nuovi
come `/allenati` restano un'alternativa, da provare sull'host prima di adottarli.
Questo evita di confondere un URL cambiato nel browser con una rotta che il
server sappia davvero servire. P-65 non modifica pagina né hosting.

Meccanica proposta: i link interni hanno un vero `href`; il tocco normale cambia
vista senza navigazione completa. `pushState` aggiunge una tappa;
`replaceState` annota quella iniziale; `popstate` ripristina vista e contesto.
Sono le capacità descritte da [MDN, History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API),
consultata il 12 ottobre 2026. Nell'oggetto della cronologia stanno solo rotta e
riferimenti di navigazione: **mai righe delle risposte, testi del carteggio,
email o preferenze da recuperare dopo una ricarica**. L'archivio anonimo resta
soltanto in memoria; non si aggira ADR-004 con `history.state`, storage,
cookie o cache. Fuoco, filtri e scorrimento stanno nel contesto in memoria.

Privacy e avvertenza conservano i loro indirizzi puliti: `/privacy` e
`/avvertenza#condizioni`. Un tocco interno apre il testo nel documento di
studio, sopra l'origine, con «Chiudi»; il testo proviene dalla pagina legale
canonica, senza una seconda copia da mantenere. Si aggiorna l'URL senza
navigare. Un'apertura diretta o una ricarica su quel percorso apre invece il
documento legale autonomo: non promette di riavere le risposte della scheda
precedente. Se il testo non arriva si resta sull'origine con «Non riusciamo ad
aprire questo testo» e «Riprova» / «Apri in una nuova scheda» [N]; **mai** un
ripiego automatico che navighi la scheda di studio. I link legali del modulo
devono preservare anche i campi già compilati quando si chiude il testo.

Riscontro sui file attuali: le condizioni sono un'ancora in
`site/avvertenza.html` (`id="condizioni"`); il modulo attuale usa
`/avvertenza#condizioni` in una nuova scheda. Non si inventa `/condizioni`
come pagina già esistente. P-65 ha letto questi riferimenti, non ha provato il
futuro caricamento del testo dentro Home.

### Indietro, chiusure, attività e ricarica

| Passaggio | Risposte senza account | Comportamento proposto e parole lette |
|---|---|---|
| Home ↔ sezioni / segmenti / Preparazione | [M] Sì | Stesso documento, vista e titolo cambiano; Indietro ripercorre la tappa reale |
| Preparazione → Inizia | [M] Sì | Una sola selezione del motore; lista e contesto del tentativo rimangono in memoria |
| Risposta quiz → domanda successiva | [M] Sì | Riga in memoria; nell'allenamento correzione dopo risposta, nella simulazione solo dopo consegna |
| Testo/giudizio del carteggio → altro esercizio | [M] Sì per le righe precedenti; bozza in memoria | «Il testo resta finché questa pagina è aperta»; il testo in corso non è una risposta né una sessione nei Progressi |
| Consegna → Risultato → Revisione → Chiudi | [M] Sì | Conclusione una volta sola; revisione non riscrive risposte; eventuale tag è un gesto nuovo |
| Chiudi Preparazione | [M] Sì | Origine, segmento, filtri, posizione e fuoco di prima |
| Indietro / Termina durante quiz con risposte | [M] Sì | Allenamento: Risultato parziale; simulazione: «Consegnare la prova?» → «Continua la prova» oppure «Consegna» → Risultato parziale |
| Indietro durante quiz senza risposte | [M] Sì, nessuna nuova risposta | Allenamento: origine; simulazione: conferma e risultato con non risposte, nessun falso superamento |
| Indietro durante carta con testo in corso | [M] Sì, anche bozza in memoria | «Vuoi tornare al Carteggio? Il lavoro resta in questa pagina» → «Continua» / «Torna al Carteggio»; si sospende, non si consegna; prova con scadenza che continua |
| Riprendi la bozza, da Allenati o Esame | [M] Sì | Stessa lista, testi, giudizi e scadenza; si riprende il lavoro, non una nuova prova |
| Avatar / Info durante runner | [M] Sì | Pannello sopra l'attività; «Chiudi» torna alla stessa domanda; il timer continua |
| Privacy / condizioni durante modulo o runner | [M] Sì | Testo sopra l'origine, «Chiudi» o Indietro riporta all'origine senza perdere modulo o lavoro; timer continua |
| Registrazione: apri → compila → invia → esito | [M], poi [A] se acquisizione riuscita | Gli stati «Account creato», «Risposte acquisite sul dispositivo» e «Risposte sul server» restano distinti |
| Indietro nel risultato verso un runner concluso | [M] Sì | Non riapre la prova come attiva, non duplica righe, non riavvia timer: mostra il risultato di quel tentativo |
| Avanti nel browser dopo la chiusura | [M] Sì | Un tentativo vivo si ritrova; uno concluso mostra Risultato; mai un altro avvio implicito |
| Indietro oltre il primo ingresso nel sito | [P] Non garantite | Si lascia il documento: la memoria può sparire; tornare dal sito esterno non è un ripristino promesso |
| Ricarica / chiusura / scheda scartata dal telefono | [P] No | URL ripristina una destinazione, non le risposte. «Senza account, chiudere o ricaricare questa pagina perde le risposte e il lavoro in corso» |
| Link condiviso / nuova scheda / altro dispositivo | Nessuna copia automatica | Si apre la destinazione; non si porta l'archivio anonimo. Con account si caricano le righe accolte dal server, non la bozza locale della carta |
| Donazione esterna, quando autorizzata dopo il parere | [N] Sì nella scheda originale | Nuova scheda, dichiarata prima del tocco; porta futura, non un pagamento introdotto in P-65 |

La chiusura di Revisione torna al Risultato; la chiusura del Risultato torna
alla porta effettiva. È lo stesso contratto per Home ed Esame, non un ritorno
fisso a Esame. La barra sparisce nell'attività, ma avatar e segnale dei guasti
restano disponibili. Le risposte conservate non significano che una prova
sospesa smetta di consumare il suo tempo.

Indietro durante un'attività deve attraversare il medesimo gestore di uscita
usato dal comando visibile. Per la simulazione, annullare la conferma mantiene
runner e tappa corrente; confermare porta al risultato, consumando la tappa
operativa del runner. Questa è una richiesta per il futuro controllo del
router, non una garanzia già provata sul gesto Indietro di Android/iOS.

Nessun avviso può impedire uno scarto della scheda o un arresto del browser.
`beforeunload` può offrire una conferma generica, ma non è affidabile su tutti
i percorsi mobili: [MDN, beforeunload](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event),
consultata il 12 ottobre 2026. Non è il meccanismo di conservazione.

### Quello che resta impossibile, da dire a chi studia

Senza account non possiamo promettere ripresa domani, continuità dopo ricarica,
recupero da una scheda scartata, trasferimento fra dispositivi o fra schede.
Alla Preparazione e al Risultato: **«Senza account, le risposte restano solo in
questa pagina. Se la chiudi o la ricarichi, le perdi»**. Per la carta si aggiunge
il lavoro in corso. In Home H1: **«Hai N risposte in questa pagina»**, N dal
motore, mai una costante; «Conserva le risposte» apre il modulo. Scaricare le
risposte è una porta manuale in Dati: il file si ricarica solo con account,
non è un salvataggio automatico anonimo. L'account protegge righe e coda sul
dispositivo solo quando la scrittura riesce; la bozza della carta resta sul
dispositivo che l'ha creata, non sul server.

Senza rete il sito non si apre e una ricarica può non riuscire, con o senza
account (ADR-005). Una pagina aperta usa ciò che ha già caricato; banca,
figure o testi ancora da caricare possono mancare e lo dichiarano.
La continuità interna non reintroduce offline, migrazione dell'archivio di
prima o una seconda contabilità. Il risultato di una simulazione è il fatto
di quella prova; 20 risposte non diventano una diagnosi completa delle voci.

## Come leggere e contare i tragitti

Le frecce sono tocchi: **«parola del comando» [M] → titolo o testo che appare**.
I cicli sotto sono espansi qui una volta e richiamati nelle righe per non
nascondere gli stessi passaggi in 108 ripetizioni. Ogni passo del ciclo ha il
proprio indicatore di continuità; `n` è la quantità nella Preparazione, dal
motore. I conteggi sono del percorso di mock con avanzamento manuale, **non
misure sul browser**. Non contano digitazione, lavoro sulla carta, scorrimenti
o scelte facoltative; contano focus dei due campi del modulo. Le colonne
separano tocchi per arrivare alla prima domanda dal resto: la distinzione
impedisce di dire «un tocco» fino alla domanda quando un tocco apre Preparazione.

| Ciclo | Ogni tocco, parole lette e conservazione | Tocchi dopo l'ingresso |
|---|---|---|
| QB: quiz base completo | Per ciascuna delle n domande «risposta scelta» [M] → «Risposta registrata» senza esito; per n−1 volte «Prossima domanda» [M] → numero e domanda successivi; «Consegna la prova» [M] → «Consegnare la prova?»; «Consegna» [M] → «Risultato del quiz base», errori e non risposte; «Rivedi le risposte» [M] → «Revisione del quiz base»; «Chiudi» [M] → Risultato; «Chiudi» [M] → origine | 2n+4; per n=20: 44 |
| QA: quiz d'allenamento completo | n volte «risposta scelta» [M] → correzione e spiegazione se verificata; n−1 volte «Avanti» [M] → domanda successiva; «Vedi il riepilogo» [M] → «Risultato dell'allenamento»; «Rivedi le risposte» [M] → Revisione; «Chiudi» [M] → Risultato; «Chiudi» [M] → origine | 2n+3 |
| CC: esercizi o prova su carta | Si scrive il testo [M, bozza]; n−1 volte «Avanti» [M] → esercizio successivo; «Concludi e confronta» (esercizi) / «Consegna» (prova) [M] → conferma; «Conferma» [M] → «Confronta i risultati»; n giudizi «Coincide» / «Da rivedere» [M] → giudizio proprio accanto alla risposta ufficiale; «Concludi» [M] → Risultato, righe dai giudizi; «Rivedi i risultati» [M] → Revisione; «Chiudi» [M] → Risultato; «Chiudi» [M] → origine | 2n+5, testi digitati esclusi; nella prova n=4: 13 |
| SS: Segnali | n volte «risposta scelta» [M] → correzione del gioco; n−1 volte «Avanti» [M] → situazione successiva; «Risultato» [M] → punteggio; «Chiudi» [M] → origine | 2n+1; n da min(10, pool), mai 10 fisso |
| AC: crea account, modulo già aperto | «Email» [M] → campo compilato; «Password» [M] → requisiti e campo compilato; «Crea un account» [A] → stato creazione/acquisizione/invio, verifica email; «Salta per ora» [M] → data e obiettivo rimandati; «Chiudi» [M] → origine conservata | 5; digitazione esclusa; successo condizionato ai servizi |
| PA: fine parziale d'allenamento | Dopo almeno una risposta: «Termina l'attività» [M] → «Risultato parziale», affrontate e non affrontate; «Chiudi» [M] → origine | 2, prima risposta già data |

In CC «giudichi tu» si legge **prima dell'avvio**; giudizi rinviati non diventano
risposte. Non basta consegnare il testo per dichiarare una prova superata.
Il ciclo AC include il testo «Creando l'account accetti le condizioni per
l'account; l'account è per chi ha compiuto 18 anni» e i link legali; non chiede
un nuovo campo età. «Account creato» non significa email verificata o tutte le
risposte sul server. Se AC fallisce si resta nel modulo con il motivo,
«Riprova» e «Continua senza account» [M] → origine; nessuna risposta sparisce.

Nei percorsi di registrazione da Risultato si usa **QB fino al Risultato**:
sono 41 tocchi dopo l'ingresso, senza i tre tocchi di revisione e chiusure.
Con HA il compito «registrarsi» è già soddisfatto: la riga dimostra la porta
Account e il ritorno, non propone di creare un secondo account o uscire.

## Matrice dei tragitti: una riga per persona, stato e compito

Ogni gruppo parte da Home nello stato indicato. In H0, finita la prima attività
che scrive risposte, Home diventa H1 (una partita di Segnali da sola non aggiunge
risposte); dopo AC diventa HA. H1 conserva anche le attività precedenti
al compito; HA include un caso vuoto di archivio senza simulare dati finti.
Nella tabella «totale» comprende ingresso, ciclo e chiusura, salvo la riga
«Tornare indietro» che parte esplicitamente da un'attività già aperta.

### Z — chi comincia da zero

Vuole capire da dove partire; prima della carta legge che servono carta nautica, squadrette e compasso, e in Esame che la prova di carteggio è propedeutica. Nessuna lettura obbligatoria blocca i quiz.

#### H0

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| Z-H0-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, ora H1 |
| Z-H0-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Sicurezza della navigazione» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| Z-H0-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| Z-H0-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| Z-H0-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| Z-H0-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| Z-H0-07 · Registrarsi dal risultato | «Simula il quiz base» [M] → Preparazione e condizioni; «Inizia» [M] → prima domanda; QB fino al Risultato; «Conserva questa prova» [M] → «Crea un account. Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove iniziare»; AC; «Chiudi» [M] sul Risultato → Home | 3 al modulo + 41 della prova; 50 totale con AC e chiusura | AC chiuso → stesso Risultato; risultato chiuso → Home HA; fallimento → stessa origine senza account |
| Z-H0-08 · Registrarsi dalla Home | «Accedi» sull’avatar [M] → Accesso e «Crea un account»; «Crea un account» [M] → modulo; AC | 2 al modulo; 7 totale | Home HA; «Progressi» [M] apre Sei qui in 1 ulteriore tocco, senza test obbligatorio |
| Z-H0-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H0, stessa posizione |
| Z-H0-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H0, stessa posizione |
| Z-H0-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| Z-H0-12 · Trovare i progressi | «Progressi» [M] → «Nessuna risposta in questa pagina; cosa aggiunge l’account»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home H0; dettagli e revisioni richiudono prima sul punto di Progressi |

#### H1

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| Z-H1-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, H1 |
| Z-H1-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Sicurezza della navigazione» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| Z-H1-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| Z-H1-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| Z-H1-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| Z-H1-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| Z-H1-07 · Registrarsi dal risultato | «Simula il quiz base» [M] → Preparazione e condizioni; «Inizia» [M] → prima domanda; QB fino al Risultato; «Conserva questa prova» [M] → «Crea un account. Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove iniziare»; AC; «Chiudi» [M] sul Risultato → Home | 3 al modulo + 41 della prova; 50 totale con AC e chiusura | AC chiuso → stesso Risultato; risultato chiuso → Home HA; fallimento → stessa origine senza account |
| Z-H1-08 · Registrarsi dalla Home | «Conserva le risposte» [M], sotto «Hai N risposte in questa pagina» → modulo; AC | 1 al modulo; 6 totale | Home HA, risposte di tutta la pagina acquisite; «Progressi» [M] in 1 ulteriore tocco |
| Z-H1-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H1, stessa posizione |
| Z-H1-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H1, stessa posizione |
| Z-H1-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| Z-H1-12 · Trovare i progressi | «Progressi» [M] → «Le risposte di questa pagina; attività vere e limiti del riepilogo»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home H1; dettagli e revisioni richiudono prima sul punto di Progressi |

#### HA

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| Z-HA-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, HA |
| Z-HA-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Sicurezza della navigazione» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| Z-HA-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| Z-HA-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| Z-HA-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| Z-HA-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| Z-HA-07 · Registrarsi dal risultato: già registrato | «Simula il quiz base» [M] → Preparazione; «Inizia» [M] → prima domanda; QB fino al Risultato; «Account» sull’avatar [M] → stato dell’invio; «Chiudi» [M] → stesso Risultato; «Chiudi» [M] → Home | nessun modulo di registrazione; 46 totale | Risultato, poi Home HA; non si disconnette per ripetere AC |
| Z-HA-08 · Registrarsi dalla Home: già registrato | «Account» sull’avatar [M] → Profilo, email/verifica e stato dell’invio; «Chiudi» [M] → Home | 1 al Profilo; 2 totale | Home HA; creare un altro account non è un compito disponibile in questo stato |
| Z-HA-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home HA, stessa posizione |
| Z-HA-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home HA, stessa posizione |
| Z-HA-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| Z-HA-12 · Trovare i progressi | «Progressi» [M] → «Sei qui; temi, prove, andamento e sessioni, oppure nessuna risposta ancora»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home HA; dettagli e revisioni richiudono prima sul punto di Progressi |

### F — chi è in formazione

Vuole un argomento preciso e usa il riferimento del manuale. Il tema di esempio è Meteorologia, senza dati inventati sulla sua competenza.

#### H0

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| F-H0-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, ora H1 |
| F-H0-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Meteorologia» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| F-H0-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| F-H0-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| F-H0-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| F-H0-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| F-H0-07 · Registrarsi dal risultato | «Simula il quiz base» [M] → Preparazione e condizioni; «Inizia» [M] → prima domanda; QB fino al Risultato; «Conserva questa prova» [M] → «Crea un account. Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove iniziare»; AC; «Chiudi» [M] sul Risultato → Home | 3 al modulo + 41 della prova; 50 totale con AC e chiusura | AC chiuso → stesso Risultato; risultato chiuso → Home HA; fallimento → stessa origine senza account |
| F-H0-08 · Registrarsi dalla Home | «Accedi» sull’avatar [M] → Accesso e «Crea un account»; «Crea un account» [M] → modulo; AC | 2 al modulo; 7 totale | Home HA; «Progressi» [M] apre Sei qui in 1 ulteriore tocco, senza test obbligatorio |
| F-H0-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H0, stessa posizione |
| F-H0-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H0, stessa posizione |
| F-H0-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| F-H0-12 · Trovare i progressi | «Progressi» [M] → «Nessuna risposta in questa pagina; cosa aggiunge l’account»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home H0; dettagli e revisioni richiudono prima sul punto di Progressi |

#### H1

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| F-H1-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, H1 |
| F-H1-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Meteorologia» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| F-H1-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| F-H1-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| F-H1-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| F-H1-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| F-H1-07 · Registrarsi dal risultato | «Simula il quiz base» [M] → Preparazione e condizioni; «Inizia» [M] → prima domanda; QB fino al Risultato; «Conserva questa prova» [M] → «Crea un account. Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove iniziare»; AC; «Chiudi» [M] sul Risultato → Home | 3 al modulo + 41 della prova; 50 totale con AC e chiusura | AC chiuso → stesso Risultato; risultato chiuso → Home HA; fallimento → stessa origine senza account |
| F-H1-08 · Registrarsi dalla Home | «Conserva le risposte» [M], sotto «Hai N risposte in questa pagina» → modulo; AC | 1 al modulo; 6 totale | Home HA, risposte di tutta la pagina acquisite; «Progressi» [M] in 1 ulteriore tocco |
| F-H1-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H1, stessa posizione |
| F-H1-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H1, stessa posizione |
| F-H1-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| F-H1-12 · Trovare i progressi | «Progressi» [M] → «Le risposte di questa pagina; attività vere e limiti del riepilogo»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home H1; dettagli e revisioni richiudono prima sul punto di Progressi |

#### HA

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| F-HA-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, HA |
| F-HA-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Meteorologia» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| F-HA-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| F-HA-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| F-HA-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| F-HA-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| F-HA-07 · Registrarsi dal risultato: già registrato | «Simula il quiz base» [M] → Preparazione; «Inizia» [M] → prima domanda; QB fino al Risultato; «Account» sull’avatar [M] → stato dell’invio; «Chiudi» [M] → stesso Risultato; «Chiudi» [M] → Home | nessun modulo di registrazione; 46 totale | Risultato, poi Home HA; non si disconnette per ripetere AC |
| F-HA-08 · Registrarsi dalla Home: già registrato | «Account» sull’avatar [M] → Profilo, email/verifica e stato dell’invio; «Chiudi» [M] → Home | 1 al Profilo; 2 totale | Home HA; creare un altro account non è un compito disponibile in questo stato |
| F-HA-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home HA, stessa posizione |
| F-HA-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home HA, stessa posizione |
| F-HA-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| F-HA-12 · Trovare i progressi | «Progressi» [M] → «Sei qui; temi, prove, andamento e sessioni, oppure nessuna risposta ancora»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home HA; dettagli e revisioni richiudono prima sul punto di Progressi |

### R — chi ripassa sotto esame

Vuole prove complete e una mappa che mostri anche quello che non si sa. Consulta i fatti e i non affrontati, senza una previsione ancora da validare.

#### H0

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| R-H0-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, ora H1 |
| R-H0-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Meteorologia» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| R-H0-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| R-H0-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| R-H0-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| R-H0-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| R-H0-07 · Registrarsi dal risultato | «Simula il quiz base» [M] → Preparazione e condizioni; «Inizia» [M] → prima domanda; QB fino al Risultato; «Conserva questa prova» [M] → «Crea un account. Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove iniziare»; AC; «Chiudi» [M] sul Risultato → Home | 3 al modulo + 41 della prova; 50 totale con AC e chiusura | AC chiuso → stesso Risultato; risultato chiuso → Home HA; fallimento → stessa origine senza account |
| R-H0-08 · Registrarsi dalla Home | «Accedi» sull’avatar [M] → Accesso e «Crea un account»; «Crea un account» [M] → modulo; AC | 2 al modulo; 7 totale | Home HA; «Progressi» [M] apre Sei qui in 1 ulteriore tocco, senza test obbligatorio |
| R-H0-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H0, stessa posizione |
| R-H0-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H0, stessa posizione |
| R-H0-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| R-H0-12 · Trovare i progressi | «Progressi» [M] → «Nessuna risposta in questa pagina; cosa aggiunge l’account»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home H0; dettagli e revisioni richiudono prima sul punto di Progressi |

#### H1

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| R-H1-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, H1 |
| R-H1-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Meteorologia» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| R-H1-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| R-H1-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| R-H1-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| R-H1-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| R-H1-07 · Registrarsi dal risultato | «Simula il quiz base» [M] → Preparazione e condizioni; «Inizia» [M] → prima domanda; QB fino al Risultato; «Conserva questa prova» [M] → «Crea un account. Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove iniziare»; AC; «Chiudi» [M] sul Risultato → Home | 3 al modulo + 41 della prova; 50 totale con AC e chiusura | AC chiuso → stesso Risultato; risultato chiuso → Home HA; fallimento → stessa origine senza account |
| R-H1-08 · Registrarsi dalla Home | «Conserva le risposte» [M], sotto «Hai N risposte in questa pagina» → modulo; AC | 1 al modulo; 6 totale | Home HA, risposte di tutta la pagina acquisite; «Progressi» [M] in 1 ulteriore tocco |
| R-H1-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H1, stessa posizione |
| R-H1-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home H1, stessa posizione |
| R-H1-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| R-H1-12 · Trovare i progressi | «Progressi» [M] → «Le risposte di questa pagina; attività vere e limiti del riepilogo»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home H1; dettagli e revisioni richiudono prima sul punto di Progressi |

#### HA

| ID / compito | Tocchi e parole, in ordine | Conteggio | Dove torna chiudendo |
|---|---|---|---|
| R-HA-01 · Simulare il quiz base | «Simula il quiz base» [M] → «Preparazione quiz base: 20 domande · 30 minuti · al più 4 errori»; «Inizia» [M] → prima domanda; QB | 2 alla domanda; 46 totale | Home, HA |
| R-HA-02 · Quiz su un argomento | «Allenati» [M] → «Quiz · Carteggio · Segnali», Quiz aperto e «Scegli un argomento»; «Scegli un argomento» [M] → Preparazione; «Meteorologia» [M] → selezione e quantità; «Inizia» [M] → prima domanda; QA | 4 alla domanda; 4+(2n+3) totale | Allenati/Quiz, stesso argomento e posizione |
| R-HA-03 · Esercizi, giro delle tecniche | «Allenati» [M] → Quiz e tre segmenti; «Carteggio» [M] → «Esercizi / Che tecnica serve? / Prova di carteggio»; «Esercizi» [M] → Preparazione, Giro delle tecniche preselezionato, «Giudichi tu; servono carta, squadrette e compasso»; «Inizia» [M] → primo esercizio; CC | 4 al primo esercizio; 4+(2n+5) totale | Allenati/Carteggio, Esercizi, stessa posizione |
| R-HA-04 · Esercizi, a tappeto | «Allenati» [M] → Quiz e segmenti; «Carteggio» [M] → porte della carta; «Esercizi» [M] → Preparazione; «A tappeto» [M] → lista e carte richieste; «Inizia» [M] → primo esercizio; CC | 5 al primo esercizio; 5+(2n+5) totale | Allenati/Carteggio, Esercizi/A tappeto |
| R-HA-05 · Prova di carteggio | «Esame» [M] → «Carteggio, quiz base, quiz vela», condizioni e ordine; «Prova di carteggio» [M] → Preparazione, «4 esercizi · 60 minuti · 3 su 4; giudichi tu», carte richieste; «Inizia» [M] → primo esercizio; CC | 3 al primo esercizio; 16 totale | Esame, Prova di carteggio, stessa posizione |
| R-HA-06 · Segnali | «Allenati» [M] → Quiz e tre segmenti; «Segnali» [M] → Preparazione gioco, «Extra: non conta nella copertura», Fanali notturni preselezionati e n dal motore; «Inizia» [M] → prima situazione; SS | 3 alla situazione; 3+(2n+1) totale | Allenati/Segnali, Fanali notturni |
| R-HA-07 · Registrarsi dal risultato: già registrato | «Simula il quiz base» [M] → Preparazione; «Inizia» [M] → prima domanda; QB fino al Risultato; «Account» sull’avatar [M] → stato dell’invio; «Chiudi» [M] → stesso Risultato; «Chiudi» [M] → Home | nessun modulo di registrazione; 46 totale | Risultato, poi Home HA; non si disconnette per ripetere AC |
| R-HA-08 · Registrarsi dalla Home: già registrato | «Account» sull’avatar [M] → Profilo, email/verifica e stato dell’invio; «Chiudi» [M] → Home | 1 al Profilo; 2 totale | Home HA; creare un altro account non è un compito disponibile in questo stato |
| R-HA-09 · Aprire privacy | «Privacy» nel piè di pagina [M] → «Privacy» sopra Home, URL /privacy; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home HA, stessa posizione |
| R-HA-10 · Aprire condizioni | «Condizioni per l’account» nel piè di pagina [M] → «Le condizioni per l’account», URL /avvertenza#condizioni; «Chiudi» [M] → Home | 1 al testo; 2 totale | Home HA, stessa posizione |
| R-HA-11 · Tornare indietro da un’attività | Dalla Preparazione aperta: «Chiudi» [M] → porta di origine (1 tocco). Dall’allenamento già aperto e con almeno una risposta: PA, oppure Indietro [M] con lo stesso esito | 1 da Preparazione; 2 da runner con risposte | Porta originaria: Home per breve; Allenati/Quiz per argomento; carta e simulazione seguono la tabella delle uscite |
| R-HA-12 · Trovare i progressi | «Progressi» [M] → «Sei qui; temi, prove, andamento e sessioni, oppure nessuna risposta ancora»; «Home» [M] → Home | 1 al riepilogo; 2 totale | Home HA; dettagli e revisioni richiudono prima sul punto di Progressi |

## Porte secondaires: stessi luoghi, ritorni da provare

Queste righe completano le porte dell'inventario che non sono fra i dodici
compiti principali. Si applicano a Z/F/R e H0/H1/HA; [M] vale a ogni passaggio.
«Origine» include il punto di scorrimento e il segmento, non solo il nome della
sezione. Non servono inviti a registrarsi dentro le attività.

| Compito / porta | Tocchi, parole e arrivo | Chiusura |
|---|---|---|
| Quiz base da Esame | «Esame» [M] → prove ordinate; «Simula il quiz base» [M] → medesima Preparazione di Home; «Inizia» [M] → domanda | QB → Esame; 3 alla domanda, 47 completo |
| Carta da Allenati | «Allenati» [M] → Quiz; «Carteggio» [M] → ambiente; «Prova di carteggio» [M] → medesima Preparazione di Esame; «Inizia» [M] → esercizio | CC → Allenati/Carteggio; 4 all'esercizio, 17 completo |
| Che tecnica serve? | «Allenati» [M] → Quiz; «Carteggio» [M] → tre porte; «Che tecnica serve?» [M] → Preparazione riconoscimento, classificazione del progetto; «Inizia» [M] → esercizio da riconoscere; scelte e «Avanti» [M]; «Concludi il riconoscimento» [M] → Risultato; «Rivedi le scelte» [M] → Revisione | «Chiudi» [M] → Risultato; «Chiudi» [M] → Allenati/Carteggio; 4 al primo esercizio |
| Vela / base e vela | «Esame» [M] → prove pertinenti all'obiettivo; «Simula il quiz vela» / «Quiz base e vela» [M] → Preparazione corrispondente; «Inizia» [M] → prima domanda | Risultati e revisioni distinti per fase; «Chiudi» [M] → Esame; 3 alla prima domanda |
| Mirata / errori / giro | «Allenati» [M] → Quiz; «Allenamento consigliato» / «Ripassa gli errori» / «Un giro tra gli argomenti» [M] → Preparazione distinta, quantità dal motore; «Inizia» [M] → domanda | QA → Allenati/Quiz; 3 alla domanda; se vuoto motivo e «Chiudi» [M] → Quiz |
| Breve dalla Home | «Allenati con 10 domande» (nome deciso, alternativa proposta sotto) [M] → Preparazione allenamento breve; «Inizia» [M] → domanda | QA → Home; 2 alla domanda; nessuna promessa di simulazione o copertura completa |
| Cerca per numero | «Allenati» [M] → Quiz; «Cerca un quesito per numero» [M] → Ricerca; campo numero e «Cerca» [M] → quesito o «Numero non trovato» | «Chiudi» [M] → Ricerca; «Chiudi» [M] → Quiz; futuro contratto, non altra selezione in pagina |
| Segnalibri | «Allenati» [M] → Quiz; «Segnalibri» [M] → Elenco reale o vuoto; quesito [M] → dettaglio / Preparazione | «Chiudi» [M] → Elenco; «Chiudi» [M] → Quiz; futura contabilità del motore |
| Revisione e riprova | Risultato → «Rivedi le risposte» [M] → Revisione; «Riprova questi errori» [M] → anteprima lista esatta; «Inizia» [M] → nuovo tentativo | «Chiudi» [M] sulla Revisione → Risultato precedente; la riprova è un tentativo distinto e non rimpiazza il precedente |
| Progressi → voce → allena | «Progressi» [M] → mappa [HA]; tema [M] → voci; «Allena» / «Rifai N errori» [M] → Preparazione sulla lista promessa; «Inizia» [M] → attività | Risultato chiuso [M] → Progressi, stessa voce; H1 ha attività della pagina con «Rivedi», senza mappa cumulativa; H0 dichiara il vuoto |
| Info da qualunque vista | Avatar [M] → Profilo/Accesso; «Info e diagnostica» [M] → banca, versione e motivo del pallino | «Chiudi» [M] → Profilo; «Chiudi» [M] → vista/runner originale, timer non fermato |
| Guasto dentro un'attività | Avatar con pallino [M] → «Problema di salvataggio/invio»; «Info e diagnostica» [M] → motivo e rimedio | Due chiusure [M] → stessa attività; il guasto non si spegne per averlo letto |
| Impostazioni prima dell'account | Avatar/Esame [M] → «Data d'esame» / «Che cosa stai preparando?»; «Salva per questa pagina» [M] → impostazione facoltativa in memoria | «Chiudi» [M] → origine; nessuna preferenza salvata in browser; con HA è profilo e si dichiara l'esito della scrittura |
| Legale dal Profilo | Avatar [M] → Profilo/Accesso; «Privacy» / «Condizioni per l'account» [M] → testo | «Chiudi» [M] → Profilo; «Chiudi» [M] → origine |
| Legale dalla registrazione sul risultato | «Conserva questa prova» [M] → modulo; «Privacy» / «Condizioni per l'account» [M] → testo, campi conservati | «Chiudi» [M] → stesso modulo; «Continua senza account» [M] → stesso Risultato; mai ritorno fisso alla Home |
| Note sulla banca | Home → «Che cosa non torna» [M] → conteggi dalla banca e riferimenti; quesito [M] → nota corrispondente | «Chiudi» [M] → elenco note; «Chiudi» [M] → Home; nessuna cifra scritta a mano |
| Dati | Avatar [M] → Profilo; «Dati» [M] → Scarica / Carica / Azzera e ambiti; «Scarica» [M] → file (senza navigazione) | «Chiudi» [M] → Profilo → «Chiudi» [M] → origine; senza account nessun Carica; export HA dichiara le righe ancora da inviare |
| Carica [HA] | Dati → «Carica» [M] → scelta file, anteprima del motore; «Conferma» [M] → accolte/già presenti/scartate | «Chiudi» [M] → Dati; nessuna contabilità parallela o promessa su righe scartate |
| Azzera / Esci / Cancella account | Profilo/Dati → comando [M] → conseguenze, password quando richiesta e scelta esplicita | «Annulla» [M] → origine intatta; conferma può cancellare [P] per scelta dichiarata. Fuori dai tragitti di conservazione ordinaria |

## Home, obiettivo e costanza: limiti che i mock devono mostrare

- **H0:** prima i benefici («esercitati sui quiz, confronta il carteggio,
  capisci gli errori quando c'è una spiegazione verificata»), poi le schermate
  del sito; «Simula il quiz base» con condizioni e il breve; nessun ostacolo
  account. L'avatar ha il nome accessibile «Accedi», non un'icona anonima.
- **H1:** le risposte sono quelle della pagina, non un archivio recuperato;
  «Conserva le risposte» sopra le stesse porte. Progressi ne mostra attività e
  revisione vere. Nessuna diagnosi cumulativa, esempio spacciato per dato o
  invito insistente dentro ogni sezione.
- **HA:** una proposta dal motore con il suo perché, il pulsante di simulazione,
  fatti delle prove e **«giorni di attività negli ultimi 14»**. La costanza è
  anche in Progressi: nessuna serie che si spezza, nessun traguardo, badge o
  contatore separato in intestazione. I criteri per carta e Segnali devono
  arrivare dal motore, non dal conteggio delle sole righe quiz.

Data e obiettivo sono facoltativi. Senza scelta si mostrano tutte le possibilità
con la precisazione della vela; una scelta esplicita prima patente/estensione,
motore/anche vela rende pertinenti le prove di Esame. Chi prepara l'estensione
dalla entro 12 non deve essere spinto a rifare il quiz base. Il pulsante deciso
«Simula il quiz base» resta un accesso libero alla prova, qualificato come
facoltativo se non serve all'obiettivo. La priorità della proposta di Home
segue l'obiettivo; in Esame non si mostra il base fra le prove richieste per
l'estensione. Non si aggiungono quiz entro 12 o prove pratiche inesistenti.

La prima simulazione offre risposte da cui proporre un punto di partenza,
non impone un test separato di 44/50 domande. Il dettaglio a blocchi di 10 e
la futura mappa dipendono dai contratti del motore. Se mancano dati si dice
«Non abbiamo ancora abbastanza risposte per dirlo». La stima ancora non
validata non compare in Home né in Progressi; si mostrano fatti osservati.

## Nomi ancora aperti: proposte per l'autore

La riga 5 di P-59 conserva **«Allenati con 10 domande»**. La dicitura «Prova
10 domande» nell'albero è una **proposta da approvare**, non una decisione che
questa sessione sostituisce. I tre segmenti e i quattro nomi della barra
restano quelli decisi.

| Punto | Alternative | Proposta e motivo / rischio |
|---|---|---|
| Secondo pulsante della Home | «Allenati con 10 domande»; «Prova 10 domande»; «10 domande per cominciare» | Provare «Prova 10 domande», con «Un allenamento breve, con correzione dopo ogni risposta». Evita la collisione testuale con Allenati; “prova” può però essere scambiata per simulazione: va confrontata con le condizioni ben visibili del quiz base. «10 domande per cominciare» è più chiaro per Z, meno adatto al ritorno di F/R |
| Chi cerca “i quiz” | Barra sempre «Allenati»; testo sotto il pulsante breve «Per scegliere un argomento: Allenati → Quiz»; richiamo Home «Quiz per argomento» → stessa Preparazione | Prima proposta: esplicitare «Quiz · Carteggio · Segnali» accanto alla porta Allenati nella Home e mostrare «Quiz» subito dopo il primo tocco; provare un richiamo «Quiz per argomento» se non basta. Non rinominare la barra in «Quiz», non duplicare il breve come soluzione |
| Allenamento consigliato | «Allenamento consigliato»; «L'allenamento di oggi» | Conservare «Allenamento consigliato» finché quantità e ragione dipendono dal motore; “oggi” richiede una proposta coerente al ritorno e non una pesca nuova al tocco |
| Carta d'allenamento | «Esercizi»; «Esercizi di carteggio» | «Esercizi di carteggio» nei richiami fuori dal segmento; «Esercizi» dentro Carteggio. Titolo condiviso della Preparazione: «Esercizi di carteggio», con Giro/A tappeto come modalità |
| Porta account | «Accedi» → «Crea un account»; «Accedi o registrati» → due azioni | Provare «Accedi o registrati» come nome del pannello, con entrambe le azioni visibili. Avatar mantiene «Accedi» nello stato anonimo; non cambiare due tocchi al modulo in una registrazione obbligatoria |
| Invito H1 / risultato | «Conserva le risposte»; «Conserva questa prova»; «Registrati» | Conserva indica il vantaggio concreto; il pannello deve dire subito «Crea un account». Nel risultato vale il testo approvato: «Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove iniziare» |
| Segnali | «Segnali»; «Riconosci fanali e segnali» | Segmento «Segnali» deciso; titolo della Preparazione «Riconosci fanali e segnali», extra dichiarato. Non torna sotto Quiz → Altro |
| Le prove | «Simula il quiz base»; «Simula il quiz vela»; «Prova di carteggio» | Primo nome fissato dall'autore; gli altri coerenti con prove separate. Non usare un comando generico che faccia credere di simulare tutte le prove insieme |

Il segnale di I-09, datato **4 ottobre 2026**, è debole: 10 giri sul sito,
120 sull'albero testuale; nella variante approvata “quiz su un argomento”
arrivava 1/5 e Segnali sotto Quiz/Altro 0/5. Sono risultati riportati nella
scheda, **non nuove misure di P-65**; i bot vedevano parole e non tutta la
profondità, e le frasi le aveva scritte chi proponeva il menu. Non promuovere
un'etichetta perché il bot la sceglie. Decide l'autore, poi si confrontano
medesimi compiti con bot e persone.

## Resistenza dei tragitti, verifica di P-65 e consegna a P-66

**La struttura regge le destinazioni dell'inventario sulla carta**: tutti i
sette schermi di §5.2 e tutti i dieci mestieri di §5.3 hanno porte; le tre
varianti di simulazione, le due varianti della prova di carta, i due modi di
esercizio e i quattro giochi restano espliciti. Non c'è un tragitto che imponga
una quinta voce. Questo non dimostra trovabilità o qualità su telefono.

Due costi vanno mostrati, senza riaprire la struttura:

1. **F-H0-02 (vale anche H1 e HA): quattro tocchi da Home alla prima domanda
   su un argomento**, contro il desiderio del §1 di iniziare in due. I primi
   due portano alla Preparazione; il terzo sceglie il tema, il quarto avvia.
   Proposta da confrontare in P-66: temi direttamente nel segmento Quiz,
   ciascuno apre la stessa Preparazione già selezionata; riduce a tre dal
   momento che la conferma «Inizia» rimane. L'allenamento breve in Home non
   soddisfa l'intento “un argomento scelto”. Per ottenere due tocchi occorre
   una decisione sul richiamo diretto dell'argomento dalla Home o sul salto
   della Preparazione: P-65 non la prende.
2. **Z-H0-01: due tocchi alla prima domanda**, uno alla Preparazione e uno
   «Inizia». “Un tocco” della decisione 6 è rispettato **alla Preparazione**,
   anche quando si è già su Esame. I-09 deve misurare l'arrivo alla domanda
   separatamente; non si dichiara un solo tocco per il profilo “Mi serve la
   patente”. Restiamo sotto i tre della sua regola proposta. Z-H0-08 porta
   al modulo di registrazione in due tocchi; dopo AC Progressi è a un tocco.

La profondità di I-18 si conta fino alla **Preparazione**: da Allenati un
tocco al segmento Carteggio e uno alla porta, non fino all'esercizio. Scegliere
«A tappeto» aggiunge un controllo dentro quella Preparazione; non è un'altra
stanza. La matrice espone comunque tutti i tocchi, incluso quel controllo.
Le misure sono conteggi di progetto, non usabilità empiricamente provata.

| Criterio P-65 | Riscontro nel documento | Limite della verifica |
|---|---|---|
| Struttura decisa e nessuna porta persa | Albero, tabella di copertura §5.2/§5.3, porte secondarie | Inventario confrontato riga per riga con i documenti; non una navigazione eseguita |
| Tre persone × tre stati × dodici compiti | 108 righe con ID, tocchi, letture, chiusure | Percorsi di carta, variabili n dichiarate e conteggi ricalcolati |
| Ogni passaggio conserva o dichiara la perdita | [M]/[A] nei cicli e in ogni riga; tabella [N]/[P] per eccezioni | Nessun router implementato; meccanismo proposto da verificare nel browser |
| Home anonima senza cambio documento | Documento canonico su /, compatibilità /app, History API, nessun archivio in history.state | Ricarica/scarto restano perdita; host e router futuri da provare |
| Registrazione e legale con origine conservata | AC; porte legali del modulo; percorso risultato → legale → modulo → risultato | Errori, mancata verifica e invio in coda espliciti; nessun servizio reale chiamato |
| Costanza e pulsante corretti | Giorni di attività negli ultimi 14; Simula il quiz base | Nessuna serie/traguardo e nessuna stima pubblicata prima della validazione |
| Nomi non promossi a decisioni | Tabella alternative e segnali I-09 | Approvazione dell'autore e prova con persone ancora necessarie |

Per P-66: mantenere gli ID per confrontare i tragitti con le schermate;
disegnare i tre stati di Home, vuoto/caricamento/errore dell'account, stessa
Preparazione da porte diverse, origine visibile nelle chiusure, modulo sopra
Risultato e legale sopra modulo; tenere Segnali separati dalla mappa e avatar
con guasto dentro il runner. Usare dati finti dichiarati, non numeri inventati
come prova della preparazione. Il conteggio dei tocchi sarà rimisurato sui
mock; una schermata bella non chiude le verifiche di continuità.

Per il controllo futuro dei tragitti (dopo i mock): dare risposte senza
account, passare Home → Allenati → Esame → Progressi → Info → legale → Home,
poi registrarsi dal risultato con un errore di rete e riprovare. Controllare
stessi uid e stesso numero dal motore prima/dopo **ogni** freccia; ripetere
Indietro/Avanti, consegna parziale, Revisione, ripresa carta e URL diretto.
Una ricarica deve perdere il solo patrimonio anonimo e dichiararlo; con
account verificare coda e bozza sul dispositivo. Questi sono criteri di
consegna, non test scritti in `tests/` da P-65.

Verifiche eseguite in P-65: `python3 strumenti/controlla.py` verde (116 file
di testo); controllo condiviso della documentazione verde; controllo temporaneo
fuori dal repo su 108 righe, nove gruppi da dodici, ID univoci, colonne e
annotazioni presenti, sette schermate, riferimenti locali e formule dei tocchi.
Review di aderenza al prompt completata: i costi e le proposte aperte sono
esplicitati sopra. Le suite motore, server, dati, interfaccia e specifica non
sono state rilanciate: la modifica è documentale, senza cambiamenti al codice
o ai requisiti che quelle suite verificano.
Nessuna verifica su dispositivo, browser o persone è dichiarata da questa mappa.
