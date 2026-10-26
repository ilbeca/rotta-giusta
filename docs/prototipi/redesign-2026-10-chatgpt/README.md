# P-96 — Tre modi di studiare, tre identità

24 ottobre 2026 · brainstorm indipendente di ChatGPT · base `45f1254` · `ui/main`.

**Raccomando Linea di rotta.** La sua unità visiva è il lavoro da fare: una domanda, una selezione, un risultato. Offre il miglior punto di partenza per una classe eterogenea che usa il telefono fra le lezioni. Atlante è la scelta più editoriale; Circolo la più espansiva. La scelta resta all'autore: questi sono prototipi da confrontare, nessuna direzione è approvata.

Apri la [galleria](index.html), poi confronta **prima i runner, poi Allenati, infine le Home**. Una Home può convincere in dieci secondi e diventare stancante dopo venti domande. I mock comprendono anche le preparazioni e un quesito con risposte lunghe.

## Che cosa è stato guardato

L'app della base è stata servita con `python3 strumenti/serve.py 8796`, in Chrome headless, con contesti nuovi senza account, a **375×812** e **1280×800**. Dieci superfici per misura, venti catture nuove, elencate una per una sotto. Non sono immagini ricostruite dal DOM. Le misure di viewport, larghezze e titoli sono in [attuale/misure.json](attuale/misure.json).

Il riferimento del giro precedente è [il collaudo P-95](../../collaudo-p95/README.md). Sono state riaperte anche `finale-home-375.png`, `finale-allenati-1280.png`, `finale-runner-1280.png` e `finale-riepilogo-375.png`: la diagnosi riguarda il risultato finale del giro 2, non la candidata interrotta. Il brief parla di tre giri; il documento del progetto alla base dichiara il giro 3 ancora da fare. Non attribuisco alla pagina modifiche che quel giro non ha portato.

| Superficie e stato | 375×812 | 1280×800 | Che cosa si osserva |
|---|---|---|---|
| Home, H0 | [Home telefono](attuale/home-375.png) | [Home desktop](attuale/home-1280.png) | Presentazione lunga, avvii finalmente chiari; scena illustrata molto tenue solo sul largo. |
| Allenati, Quiz | [Quiz telefono](attuale/quiz-375.png) | [Quiz desktop](attuale/quiz-1280.png) | L'allenamento è una grande scheda, la scelta un'altra scheda con un pulsante dentro. |
| Allenati, Carteggio | [Carteggio telefono](attuale/carteggio-375.png) | [Carteggio desktop](attuale/carteggio-1280.png) | Porte e descrizioni fanno colonne accidentali; sul telefono «Esercizi su carta» va su tre righe. |
| Allenati, Segnali | [Segnali telefono](attuale/segnali-375.png) | [Segnali desktop](attuale/segnali-1280.png) | Il gioco si presenta attraverso testo e selettori: nessun segnale nel primo schermo. |
| Esame, modulo chiuso | [Esame telefono](attuale/esame-375.png) | [Esame desktop](attuale/esame-1280.png) | L'ordine delle prove si legge, ma le porte sembrano righe di un modulo. «Quiz base e vela» diventa una colonnina. |
| Progressi, H0 | [Progressi telefono](attuale/progressi-375.png) | [Progressi desktop](attuale/progressi-1280.png) | Stato vuoto onesto; sul largo l'azione prende tutta la riga pur avendo poche parole. Non è stata guardata la mappa con account. |
| Preparazione del quesito 1.8.1-5 | [Preparazione telefono](attuale/preparazione-375.png) | [Preparazione desktop](attuale/preparazione-1280.png) | Pannello largo, testo stretto, avvio largo: tre misure senza una composizione leggibile. «1 domande» è visibile. |
| Runner, base-1293 dopo errore | [Runner telefono](attuale/runner-375.png) | [Runner desktop](attuale/runner-1280.png) | Sul largo domanda centrata, riscontro a sinistra, tag a destra, risposte su tre colonne. Sul telefono i tag precedono la prima risposta. |
| Riepilogo, stessa attività terminata | [Riepilogo telefono](attuale/riepilogo-375.png) | [Riepilogo desktop](attuale/riepilogo-1280.png) | Una risposta su una proposta, etichetta «Attività interrotta»; cinque azioni impilate e quasi tutte riempite. |
| Accedi sopra Progressi | [Accedi telefono](attuale/accedi-375.png) | [Accedi desktop](attuale/accedi-1280.png) | Mostra password, recupero, registrazione, ritorno e porte del profilo assumono la stessa forma di grande bottone. |

Sono osservazioni, non una prova delle loro cause. Il giudizio estetico seguente è una lettura di design; nessuna intervista con studenti è stata svolta. Nessuna proposta dell'altra esplorazione e nessuna scheda I-29 sono state lette.

## Diagnosi: che cosa la rende brutta

**Manca un'intenzione visiva che sopravviva al cambio di schermata.** La Home promette un sito nautico gentile, con barca e faro; il runner sembra un pannello amministrativo. La piccola prua del marchio, la scena pastello e il blu dei controlli appartengono allo stesso argomento, ma non allo stesso linguaggio. Se si copre il marchio, Allenati potrebbe essere un portale per qualunque certificazione. Non serve «più nautica» ovunque: serve scegliere che cosa della nautica diventa il carattere del prodotto.

**La gerarchia è tipografica, ma poco compositiva.** I titoli adesso hanno dimensioni corrette. Tuttavia un paragrafo corto, una scelta, un avviso e un gruppo di strumenti continuano a occupare fasce larghe e regolari. Nella Home desktop l'occhio incontra due colonne di avvii, tre colonne di porte e un'illustrazione, senza un rapporto forte fra di loro. Nel runner la domanda ha una colonna da lettura e le risposte tornano a riempire il monitor: l'occhio deve ricostruire ogni volta dove prosegue il compito.

**È contemporaneamente ariosa e faticosa.** La densità non coincide con il numero di parole. Una scheda larga con tre righe strette lascia spazio inutilizzato; una sequenza di cinque pulsanti larghi produce comunque competizione. Sul telefono l'altezza delle introduzioni e dei contenitori ritarda il lavoro. Sul desktop i vuoti sono spesso residui della larghezza del contenitore, non pause costruite intorno a un contenuto.

**Il ritmo cambia poco.** Troppi elementi hanno identici raggio, riempimento pallido e allineamento. Ci sono pochi momenti di vera compressione e pochi di apertura. La ripetizione rende ordinata una lista, ma applicata a ogni parte dell'app rende tutto una lista di impostazioni.

**L'illustrazione non sostiene la promessa centrale.** La scena del faro è gradevole come introduzione a una vacanza o a un manuale generico, ma non parla del gesto di studiare. A 375 px sparisce: l'identità affidata a lei sparisce con lei. Aumentarne la saturazione non risolverebbe il distacco fra Home e attività. Nei mock l'identità è affidata anzitutto a tipografia, proporzioni e composizione; nessuna nuova immagine è necessaria per giudicare questa ipotesi. Le figure ufficiali dei quesiti restano contenuto, non decorazione.

**Il colore si è ridotto a due intensità di blu.** L'azzurro compare su pulsanti secondari, selettori, schede e pillole. Non dice più con precisione se qualcosa è da premere, selezionato, informativo o un contenitore. Il testo grigio blu su fondo grigio freddo smorza ancora tutto. Anche con contrasto sufficiente il risultato può sembrare spento: contrasto e vivacità non sono la stessa misura.

**La tipografia è coerente, ma troppo uniforme nel tono.** Manrope è leggibile e può restare. Il problema è assegnare quasi sempre lo stesso lavoro a pesi e corpi vicini, più una riga stretta dentro una struttura molto larga. La domanda a 19 px e il titolo a 30 px danno al contesto più autorità del contenuto da capire. Un nuovo carattere da solo non ripara questo rapporto.

**I componenti sembrano moduli perché quasi ogni scelta è confezionata come un campo.** In Esame il titolo della prova e la descrizione stanno fianco a fianco come etichetta e valore, ma senza colonne controllate: le parole si spezzano. In Accedi un vero campo e una scelta secondaria hanno poi lo stesso peso dei grandi avvii di studio. Una porta verso un'attività deve poter essere una riga editoriale, un nome con un verbo, una superficie intera: non sempre un pulsante dentro un pannello.

L'età e la composizione della classe descrivono persone da includere, non una licenza per estetica militare, yacht di lusso o app infantile. La differenza utile è fra **pochi minuti al telefono** e **lavoro concentrato al tavolo**. Corpi leggibili, parole intere, contrasti chiari e tasti raggiungibili servono a entrambi.

## Le regole che aiutano e il loro limite

I riferimenti sono D-01…D-35 di I-27; nessuna regola viene modificata qui.

| Regole | Da tenere | Come una lettura meccanica può spegnere il disegno |
|---|---|---|
| D-01, D-02 | Compito chiaro, contenuto necessario. | «Una cosa» non significa che tutti i contenuti abbiano bisogno di una schermata introduttiva o di un grande riquadro. |
| D-03…D-11 | Parole comuni, frasi e paragrafi corti, verbi, titoli e link espliciti. | Accorciare frase per frase non progetta l'ordine dell'insieme. Le note essenziali non si sacrificano al tetto delle parole. |
| D-12, D-13 | Una priorità, alternative subordinate. | Un solo pulsante scuro non basta se altri cinque hanno stessa area e stessa forma. La soglia delle scelte non valuta la fatica dello scorrimento. |
| D-14 | La priorità deve essere evidente. | L'indice area × contrasto è una spia, non un modello dell'attenzione: premia grandi riempimenti, non misura significato, posizione e ritmo. |
| D-15 | Struttura semantica e gerarchia leggibile. | Avere un h1 e corpi in ordine non rende forte una composizione. Nel mock il quesito diventa l'h1 del runner; il contesto è testo. |
| D-16, D-17, D-18 | Scala dichiarata, corpo comodo, interlinea. | «Al più cinque corpi» non impone sei corpi precisi per sempre. La scala del giro 2 era una scelta locale, non una legge ottica. |
| D-19 | Righe sotto il limite, soprattutto su desktop. | 480 px è una soluzione misurata con un carattere e un corpo. Applicarla a tutto non giustifica poi contenitori da oltre 1.000 px. Va misurata la riga resa, non venerata la larghezza. |
| D-20, D-21 | Pesi leggibili, enfasi selettiva, allineamento stabile. | Titoli, domanda e azioni possono avere voci diverse; uniformare non significa rendere ogni testo intercambiabile. |
| D-22, D-23 | Scala degli spazi e prossimità. | Essere multipli di quattro non crea ritmo; occorre scegliere dove compattare e dove lasciare una pausa. |
| D-24 | Pochi contenitori. | Il conteggio esclude pulsanti e campi: può passare una pagina ancora piena di scatole. Va guardata la somma delle superfici. |
| D-25, D-26 | Ruoli, contrasto, stato detto anche a parole. | «Accento per le azioni» non implica riempire ogni azione dello stesso azzurro. Un colore di identità può vivere nel marchio senza diventare uno stato. |
| D-27, D-28, D-29 | Bersagli ampi, distanze, prosecuzione raggiungibile. Sono vincoli decisivi. | Non obbligano ad allargare tutti i pulsanti alla pagina. La barra persistente va provata con risposte lunghe e fuoco da tastiera, non soltanto col quesito breve. |
| D-30, D-31, D-32 | Avviso vicino al gesto; guasto esplicito; annunci senza rubare il fuoco. | Non si nasconde un guasto per alleggerire la vista. Il pallino ambra e il testo di recupero restano nel progetto reale, anche nel runner. |
| D-33, D-34, D-35 | Nomi coerenti, gruppi leggibili, navigazione ferma. | Coerente non vuol dire uniforme: una Home, un confronto di risposte e un accesso non hanno lo stesso mestiere. |

Le D-01…D-35 sono una rete di protezione. **Nessuna garantisce che un sito abbia carattere.** Non propongo di togliere la rete; propongo di aggiungere una scelta visiva da valutare sul lavoro ripetuto.

## Tre direzioni

I riferimenti seguenti sono **fonti di principi e analogie di progetto**, consultate il 24 ottobre 2026. Non sono studi sull'efficacia dei nostri mock, né immagini copiate. Le conseguenze visive sono mie inferenze.

### Atlante — una pagina da studiare

**Idea:** la dignità di un buon libro di navigazione, con la velocità di una pagina web. Avorio caldo, inchiostro verde, Newsreader per titoli e domanda; Manrope per risposte e comandi. Pochi angoli, righe di catalogo aperte, due colonne editoriali sul largo. La Home oppone una frase grande a una colonna di avvii; il riepilogo sembra una pagina annotata, non una scheda punteggio.

**Riferimenti:** la distinzione fra oggetto, titolo e scheda nelle [collezioni dei Royal Museums Greenwich](https://www.rmg.co.uk/collections/objects); il rapporto fra foglio stampato e uso al tavolo di [NOAA Custom Charts](https://nauticalcharts.noaa.gov/charts/noaa-custom-charts.html); il carattere da lettura [Newsreader, sorgente e licenza](https://github.com/google/fonts/tree/main/ofl/newsreader). Non si imita una carta nautica e non si inventano coordinate decorative.

**Per chi studia:** invita a leggere la domanda fino in fondo; mantiene le risposte pratiche e scansionabili. I temi sono un indice; sul desktop domanda e risposta stanno su due pagine affiancate. Per chi fa carteggio ha una continuità plausibile col materiale sul tavolo.

**Rischio:** può sembrare troppo letteraria o lenta a chi vuole venti quiz veloci. Il serif in un runner va giudicato dopo una batteria intera, non da un titolo. Non assumo che piaccia ai cinquantenni e non ai ventenni.

**Contratto visivo:** fondo `#faf7ef`, testo `#20382f`, azione `#235441`; titoli Home 44/64 px, domanda 26/32 px, risposte 16 px, note 14 px. Spazi prevalentemente 8/16/24/32/48; raggio 2 px. Newsreader è servito localmente, non cercato sul computer del lettore. Nel runner la domanda è il punto d'ingresso e le risposte formano una colonna.

[Home](atlante/home.html) · [Quiz](atlante/quiz.html) · [preparazione](atlante/preparazione.html) · [runner](atlante/runner.html) · [riepilogo](atlante/riepilogo.html).

### Linea di rotta — lo strumento di tutti i giorni

**Idea:** uno strumento nitido, attuale e veloce. Bianco, blu deciso, inchiostro scuro; Manrope da solo, ma con una scala più contrastata. Un'unica superficie scura segnala l'allenamento consigliato. Gli argomenti tornano un elenco, le azioni secondarie tornano testo. Nel runner si legge da sinistra a destra: domanda, poi risposte in verticale; sul telefono tutto diventa una colonna.

**Riferimenti:** la separazione fra nome del compito e informazione di stato della [Task list di GOV.UK](https://design-system.service.gov.uk/components/task-list/); «coerente, non uniforme» e contesto d'uso nei [Government Design Principles](https://www.gov.uk/guidance/government-design-principles). Prendo la chiarezza dei ruoli, non l'aspetto istituzionale né stati di completamento che qui non esistono.

**Per chi studia:** meno riconoscimenti da fare, temi raggiungibili senza aprire un pannello intermedio, risposte sempre nello stesso ordine visivo. Il bottone Avanti rimane vicino al pollice; classificare l'errore è una scelta facoltativa che si apre dopo aver letto la correzione. La nuova composizione usa l'ampiezza desktop per accostare i due pezzi dello stesso ragionamento, senza tre risposte su tre colonne.

**Rischio:** è la meno insolita delle tre. Se ci si ferma al blu e ai raggi diventa un'altra app generica. La sua identità deve venire dalla disciplina delle larghezze, dal contrasto tipografico e dall'unico percorso di lettura. Non si recuperano poi tutte le vecchie schede «per coerenza».

**Contratto visivo:** fondo bianco, testo `#112c43`, azione `#005ccb`, superficie tenue `#edf4ff`; Home 40/56 px, domanda 24/28 px, risposte 16 px, note 14 px. Raggi 8/12/16 per controlli e uniche superfici di raggruppamento. Spazi 8/12/16/24/32/48. In ogni vista il riempimento forte appartiene a una sola priorità.

[Home](rotta/home.html) · [Quiz](rotta/quiz.html) · [preparazione](rotta/preparazione.html) · [runner](rotta/runner.html) · [riepilogo](rotta/riepilogo.html).

### Circolo — energia senza punteggi da difendere

**Idea:** un circolo nautico aperto, giovane senza infantilizzare. Titoli grandi, segno circolare, carta chiara, inchiostro quasi nero e giallo caldo. Le azioni sono pillole; il contenuto resta aperto, con tagli orizzontali. La Home è un manifesto breve con gli avvii sotto; in Quiz vengono prima gli argomenti sul telefono. Il runner desktop resta una sequenza verticale da leggere, non una plancia.

**Riferimenti:** la relazione fra pratica, corsi e club nel sito della [Royal Yachting Association](https://www.rya.org.uk/training), come analogia di un luogo in cui si impara facendo; il principio di partire dai bisogni delle persone, ancora dai [Government Design Principles](https://www.gov.uk/guidance/government-design-principles). La voce grafica grande e il giallo sono una proposta originale, non il marchio RYA e non una copia del suo sito.

**Per chi studia:** dà voglia di iniziare senza promettere un risultato; ogni gruppo di risposte è una pagina corta. Il riepilogo dice che cosa è successo con numeri leggibili e tre etichette, senza percentuale di bravura, medaglie o serie da mantenere.

**Rischio:** la scala può sovrastare i testi lunghi e far scorrere troppo. Nel runner con una risposta lunga il comando persiste, ma il contenuto continua sotto: è il caso da provare al telefono. Il giallo non è mai «giusto», «errore» o «salvato». L'ambra dei guasti dovrà restare distinguibile per forma, testo e posizione nell'avatar, non affidata alla sola tonalità.

**Contratto visivo:** carta `#fffdf8`, testo `#242826`, azione `#e8b83b` con testo scuro, mai bianco; Home 48/72 px, domanda 24/32 px, risposte 16 px, note 14 px. Raggi 28 per azioni, nessun riquadro intorno ai temi. Spazi 8/16/24/32/48; Newsreader non usato. I numeri del riepilogo sono fatti dell'attività e non un voto su chi studia.

[Home](circolo/home.html) · [Quiz](circolo/quiz.html) · [preparazione](circolo/preparazione.html) · [runner](circolo/runner.html) · [riepilogo](circolo/riepilogo.html).

## La scelta raccomandata

**Linea di rotta**, adottata come sistema completo. Il compito dominante è ripetere quesiti sul telefono, con risposte anche lunghe e interruzioni frequenti. La domanda guadagna priorità; il risultato perde l'aspetto di un modulo; la pagina da studio acquista un colore forte senza affidare la propria identità a una figura che sul telefono sparisce. Restano sufficienti serietà e spazio di lettura per chi prepara il carteggio al tavolo.

La distinzione è visibile soprattutto nei runner: Atlante accosta due pagine, Linea di rotta accosta due parti dello stesso compito, Circolo le mette in sequenza. Non raccomando un collage del titolo di Circolo, del colore di Atlante e delle schede di Linea di rotta: rimetterebbe insieme tre voci senza sceglierne una.

Aprirei la direzione scelta su un telefono vero, farei leggere il quesito lungo e chiederei poi di raggiungere una preparazione per argomento e di interpretare il riepilogo. La prova di preferenza estetica e quella del compito devono restare distinguibili. Una piccola prova con persone potrà smentire la raccomandazione.

## Che cosa i mock dimostrano e che cosa lasciano aperto

Sono **21 documenti HTML statici**, sette per direzione, con CSS e contenuto nel documento; unico asset comune, i caratteri locali in `risorse/`, con le licenze. Nessun build, JS, import, libreria o risorsa da altri host. Apribili anche come file locali, tenendo la cartella intera. Per servirli, dalla radice del repo:

```sh
python3 -m http.server 8797 --bind 127.0.0.1 --directory docs/prototipi/redesign-2026-10-chatgpt
```

Poi aprire `http://127.0.0.1:8797/`. Gli HTML hanno estensione perché sono uno storyboard nella documentazione: non propongono nuovi indirizzi del prodotto. I link fanno cambiare documento, mentre l'app reale deve restare un documento solo. L'esempio non possiede archivio, selezione, contabilità o API. Nessun account viene creato; i campi di Accedi non inviano dati. Non è un'implementazione da copiare su `site/`.

Ogni direzione contiene Home H0, Allenati/Quiz, preparazione del breve, preparazione della simulazione, runner dopo una risposta errata, variante lunga e riepilogo parziale. I link degli argomenti e dell'allenamento consigliato convergono deliberatamente sulla stessa preparazione di esempio: non dimostrano filtri né elenchi reali. La simulazione ha un pulsante dichiarato inattivo: non si fa vedere una correzione immediata spacciandola per esame. Avanti porta al riepilogo per accorciare il confronto; il mock lo dichiara.

I quesiti `base-522` e `base-1293`, incluse le risposte e i numeri, sono copiati dalla banca del repo, Allegato A al DD 131/2022. Le parole delle risposte non sono riscritte e non c'è una spiegazione didattica inventata. Il primo è breve per mostrare la composizione, il secondo stressa le lunghezze. Il contatore 4/10 e il riepilogo 3 corrette, 1 errata, 6 non affrontate sono **dati di esempio**, non una sessione generata dal motore. Non si trasferiranno come numeri hardcoded nella pagina reale.

Le preparazioni e i riepiloghi conservano l'avviso completo sulla perdita senza account; il riepilogo mantiene scelta di continuare senza account e conservazione in chiaro sul server. La Home mantiene i limiti dichiarati della banca. Gli extra restano separati dalla copertura; niente stima di promozione, classifiche, badge, streak, correzione automatica del carteggio o nuove spiegazioni.

Non sono disegnati qui: mappa con account, stati caricamento/errore, runner con figura, simulazione attiva, carteggio completo, revisione completa, registrazione e legali. Non sono nascosti per il progetto successivo: **vanno progettati nella direzione scelta prima di implementarla**. Il guasto di salvataggio rimane un pallino ambra sull'avatar con frase e uscita praticabile; una coda non è «salvata». Con banca indisponibile rimangono presentazione e legali, non avvii e totali. Lo stato vuoto non diventa una preparazione positiva. Nessuna variazione delle garanzie della specifica è autorizzata dal mock.

## Verifiche ed evidenze dei mock

Le 42 catture finali del primo schermo sono viewport alle due misure richieste; sei catture mostrano il fondo del runner lungo; tre il fuoco da tastiera nel gruppo dei tag. Tutte le immagini finali vanno lette come proposte, non come prove di usabilità con persone. Le [misure dei mock](verifica-mock.json) e il [controllo di contrasto e reflow](accessibilita-mock.json) registrano i controlli empirici. Il secondo visita anche 320 px e 640 px, quest'ultimo come controllo di reflow equivalente a una finestra desktop da 1280 a zoom 200%, senza certificare l'esatto comportamento del browser allo zoom.

I controlli su contrasto, reflow, caratteri, fuoco e scorrimento documentano il perimetro effettivo, non una dichiarazione di conformità WCAG dell'app futura. Restano da esercitare lettore di schermo, tastiera per tutti i percorsi, errori reali e dispositivi reali. I prototipi usano HTML semantico, un h1 per documento, link con nome, etichette dei campi, stati delle risposte detti a parole, outline visibile e preferenza di moto ridotto. Il giallo non comunica da solo uno stato. I comandi di prosecuzione sono raggiungibili anche con il testo lungo.

### Atlante: schermate finali

| Superficie | 375×812 | 1280×800 |
|---|---|---|
| Home | [Home telefono](atlante/schermate/home-375.png) | [Home desktop](atlante/schermate/home-1280.png) |
| Allenati/Quiz | [Quiz telefono](atlante/schermate/quiz-375.png) | [Quiz desktop](atlante/schermate/quiz-1280.png) |
| Preparazione breve | [Preparazione telefono](atlante/schermate/preparazione-375.png) | [Preparazione desktop](atlante/schermate/preparazione-1280.png) |
| Preparazione simulazione | [Simulazione telefono](atlante/schermate/simulazione-375.png) | [Simulazione desktop](atlante/schermate/simulazione-1280.png) |
| Runner dopo errore | [Runner telefono](atlante/schermate/runner-375.png) | [Runner desktop](atlante/schermate/runner-1280.png) |
| Runner lungo, inizio | [Lungo telefono](atlante/schermate/runner-lungo-375.png) | [Lungo desktop](atlante/schermate/runner-lungo-1280.png) |
| Runner lungo, fondo | [Fondo telefono](atlante/schermate/runner-lungo-fondo-375.png) | [Fondo desktop](atlante/schermate/runner-lungo-fondo-1280.png) |
| Riepilogo parziale | [Riepilogo telefono](atlante/schermate/riepilogo-375.png) | [Riepilogo desktop](atlante/schermate/riepilogo-1280.png) |
| Tag aperti, fuoco | [Fuoco telefono](atlante/schermate/tag-fuoco-375.png) | — |

### Linea di rotta: schermate finali

| Superficie | 375×812 | 1280×800 |
|---|---|---|
| Home | [Home telefono](rotta/schermate/home-375.png) | [Home desktop](rotta/schermate/home-1280.png) |
| Allenati/Quiz | [Quiz telefono](rotta/schermate/quiz-375.png) | [Quiz desktop](rotta/schermate/quiz-1280.png) |
| Preparazione breve | [Preparazione telefono](rotta/schermate/preparazione-375.png) | [Preparazione desktop](rotta/schermate/preparazione-1280.png) |
| Preparazione simulazione | [Simulazione telefono](rotta/schermate/simulazione-375.png) | [Simulazione desktop](rotta/schermate/simulazione-1280.png) |
| Runner dopo errore | [Runner telefono](rotta/schermate/runner-375.png) | [Runner desktop](rotta/schermate/runner-1280.png) |
| Runner lungo, inizio | [Lungo telefono](rotta/schermate/runner-lungo-375.png) | [Lungo desktop](rotta/schermate/runner-lungo-1280.png) |
| Runner lungo, fondo | [Fondo telefono](rotta/schermate/runner-lungo-fondo-375.png) | [Fondo desktop](rotta/schermate/runner-lungo-fondo-1280.png) |
| Riepilogo parziale | [Riepilogo telefono](rotta/schermate/riepilogo-375.png) | [Riepilogo desktop](rotta/schermate/riepilogo-1280.png) |
| Tag aperti, fuoco | [Fuoco telefono](rotta/schermate/tag-fuoco-375.png) | — |

### Circolo: schermate finali

| Superficie | 375×812 | 1280×800 |
|---|---|---|
| Home | [Home telefono](circolo/schermate/home-375.png) | [Home desktop](circolo/schermate/home-1280.png) |
| Allenati/Quiz | [Quiz telefono](circolo/schermate/quiz-375.png) | [Quiz desktop](circolo/schermate/quiz-1280.png) |
| Preparazione breve | [Preparazione telefono](circolo/schermate/preparazione-375.png) | [Preparazione desktop](circolo/schermate/preparazione-1280.png) |
| Preparazione simulazione | [Simulazione telefono](circolo/schermate/simulazione-375.png) | [Simulazione desktop](circolo/schermate/simulazione-1280.png) |
| Runner dopo errore | [Runner telefono](circolo/schermate/runner-375.png) | [Runner desktop](circolo/schermate/runner-1280.png) |
| Runner lungo, inizio | [Lungo telefono](circolo/schermate/runner-lungo-375.png) | [Lungo desktop](circolo/schermate/runner-lungo-1280.png) |
| Runner lungo, fondo | [Fondo telefono](circolo/schermate/runner-lungo-fondo-375.png) | [Fondo desktop](circolo/schermate/runner-lungo-fondo-1280.png) |
| Riepilogo parziale | [Riepilogo telefono](circolo/schermate/riepilogo-375.png) | [Riepilogo desktop](circolo/schermate/riepilogo-1280.png) |
| Tag aperti, fuoco | [Fuoco telefono](circolo/schermate/tag-fuoco-375.png) | — |

Per esiti delle suite, revisione indipendente, limiti e warning del detector: [verifiche.md](verifiche.md).

## Fonti degli asset

Manrope e la sua licenza sono copiati da `site/caratteri/`, senza modificarli. Newsreader regolare variabile viene dal [repository ufficiale Google Fonts](https://github.com/google/fonts/tree/main/ofl/newsreader), file `Newsreader[opsz,wght].ttf` e `OFL.txt`, scaricati il 24 ottobre 2026. Le impronte sono in [risorse/impronte.txt](risorse/impronte.txt); le licenze in [OFL.txt](risorse/OFL.txt) e [newsreader-OFL.txt](risorse/newsreader-OFL.txt). Nessuna immagine esterna o di terzi è inclusa: le PNG sono acquisizioni dei nostri documenti. Freccia e cerchio sono segni geometrici provvisori; non cambiano il marchio pubblicato.

## Decisioni da chiedere all'autore

1. **Quale delle tre direzioni scegli come base, guardando il runner oltre alla Home?** Raccomandazione: Linea di rotta; è una proposta da approvare, non una decisione presa qui.
2. **La domanda può diventare il titolo dominante del runner?** Nei mock contesto e numero restano, ma non competono con la cosa da leggere. La classificazione facoltativa dell'errore si apre su richiesta dopo le risposte.
3. **Approvi la riapertura della scala del giro 2 nella direzione scelta?** I titoli Home salgono, la domanda sale a 24–26 sul telefono e 28–32 sul desktop; risposta e testo corrente restano a 16. Servirà una decisione esplicita e un adeguamento dei contratti su main prima dell'implementazione.
4. **Preferisci l'identità affidata a tipografia e composizione, come qui, o vuoi anche un'immagine originale?** Se vuoi un'immagine, va definita dopo la direzione e provata anche a 375 px; non deve essere l'unico elemento distintivo né spostare l'avvio sotto la barra.
5. **Possiamo validare con persone il runner lungo e la scelta per argomento?** Breve prova al telefono con chi fa quiz e al tavolo con chi fa carteggio; non soltanto una votazione fra Home. Nessun calendario o reclutamento è stato avviato.

Le decisioni non autorizzano ancora la sostituzione della pagina. Dopo la scelta, la regia dovrà completare gli stati e le superfici mancanti, aggiornare specifica e controlli che fissano la scala e poi preparare un prompt di implementazione. P-96 non cambia né la coda né i documenti a penna unica.
