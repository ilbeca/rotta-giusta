# P-68 — Progressi, con Percorso e fatti separati

13 ottobre 2026 · passo 4 di 5 · mock statico, non realizzazione del sito.

Apri [il confronto](progressi.html) o [l’account caricato](progressi-mappa.html?caso=account).
Due HTML autoconsistenti, CSS, Manrope, script e fixture incorporati, senza
risorse da altri host. Il carattere e la [licenza](home-manrope-OFL.txt)
sono quelli di P-66. Dieci casi nell’indice; viste interne nello stesso documento.
La barra Home · Allenati · Esame · Progressi più avatar è la struttura decisa.

Base iniziale `6698db3`, `ui/main`, worktree richiesto e albero pulito. L’inventario
dell’app non mostrava altre chat attive su questa cartella. Il pull `--ff-only`
non trova un upstream configurato: nessun ramo remoto scelto o integrato.

## Fonti e forma

Letti AGENTS.md, [tragitti P-65](tragitti.md), [home-note](home-note.md),
[attivita-note](attivita-note.md), [P-59](../../idee-dopo-gli-account.md)
decisioni 4, 10, 14, 16, 19, 22 e schede I-05, I-06, I-13, I-15;
[specifica](../../specifica.md) §4.1, §4.3, §4.4, §7.4, §8, §9.10, §9.12,
Q-STATI chiusa nel §10;
[ADR-004](../../adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md),
[ADR-006 §1](../../adr/ADR-006-l-invito-in-home-il-sito-che-spiega-la-costanza-e-la-stima.md);
[coda](../../prossime-sessioni.md) §4 Dopo P-59 punti 10 e 12 e forma del resoconto.
Letti anche filosofia, README, CHANGELOG e contratti del motore.

Si eredita la forma di P-66/P-67: Manrope, navy/blu, fondo chiaro, barra
desktop in alto, navigazione mobile a quattro voci, guasti ambra, un solo
pulsante pieno per vista. La lettura parte dal «sei qui», poi mappa,
prove, andamento e sessioni, in quell’ordine. Non viene creata una nuova
identità né vengono aggiunti PRODUCT.md o DESIGN.md fuori dal perimetro.
Il mock serve a chi consulta le proprie risposte tra due momenti di studio:
per questo l’evidenza resta leggibile anche senza il grafico.

Le parole sono decise: **mai visti · da rifare · da confermare · recuperati ·
acquisiti**, associate in quest’ordine a `mai_visto`, `debole`, `incerto`,
`sistemato`, `ok`. Il testo «In base alle ultime risposte» e il `?` accompagnano
la mappa. Il colore aiuta a distinguere; nomi e quantità restano testo.
«acquisiti» e «recuperati» descrivono risposte qui, senza promettere padronanza.

## Snapshot e liste, una sola fonte

[progressi-snapshot.mjs](progressi-snapshot.mjs) importa `site/engine.js` senza
modificarlo. Esecuzione dalla radice:

```sh
node docs/prototipi/interfaccia-2026-10/progressi-snapshot.mjs
```

Produce [p68-dati.json](p68-dati.json) e aggiorna la copia incorporata in
`progressi-mappa.html`, se presente: istante fisso 13 ottobre 2026 ore 12
locali, seme 68 per la prova, impronte SHA-256 di motore, quiz e meta.
Sono **risposte sintetiche** su quesiti della banca del repo, non un archivio vero.
Gli HTML incorporano lo snapshot: nessuna chiamata al motore, selezione,
contabilità, percentuale di correttezza o diagnosi viene ricostruita in pagina.
Le larghezze delle barre sono valori già prodotti nello snapshot; la pagina
li applica soltanto al CSS. La lista usa i riferimenti incorporati della banca,
non li scarica e non inventa contenuto mancante.

La fonte account contiene 326 risposte e una prova base completa finta;
la base conta 1.472 quesiti: 1.310 mai visti, 42 da rifare, 55 da confermare,
32 recuperati, 33 acquisiti. Queste quantità appartengono alla fixture,
non alla persona e non alla versione futura del sito.

Per ciascuna delle otto righe base, delle 44 voci base e delle tre voci vela:

- `E.quadro()` dà ordine, peso solo al tema base, visti, primo tentativo e filtri;
- `E.contaStati()` dà i cinque segmenti sotto lo stesso filtro;
- `E.coda()` con `r.rifai` produce tutti i da rifare, senza tetto; assert nello
  generatore verifica quantità = `daRifare` = `contaStati().debole`;
- `Allena` mostra una lista di al più 20 da `E.coda()` sul filtro della riga,
  distinta dalla lista degli errori; Inizia riusa quella lista incorporata;
- `E.dovePesa()` legge esattamente lo stesso quadro base, senza una classifica
  parallela. I suoi pulsanti portano nello snapshot quantità e lista coincidenti.

Il «tema proposto» apre il tema selezionato da `dovePesa()`, poi offre Allena
e Rifai. Non trasforma la frase in un allenamento sui soli mai visti: per
quello servirà una porta che usi la selezione del relativo pulsante. Nessun
minuto, stima, semaforo o giudizio di preparazione viene mostrato.

Le sessioni e le prove sono `E.sessioni(..., {confine:'attivita'})`:
28 gruppi, una prova, 27 allenamenti. La revisione riapre riferimenti di quel
gruppo; i suoi errori vengono da `E.erroriSessione()`. Tre sessioni recenti
sono visibili e le altre riapribili nella disclosure. Il confine ricostruito
è previsto e dichiarato dove la fonte lo dà; la fixture principale usa `sim_uid`.
La carta non ha risultati in questa fixture: lo si dice, con il giudizio
autovalutato qualificato, senza un numero inventato. I Segnali sono extra e
non entrano nella copertura o nelle sessioni quiz.

L’andamento è `E.tendenza()`, con giorni costruiti dalle righe nel generatore,
non nell’HTML. Mostra giuste e totali giornalieri, ripetizioni comprese;
un cambio di selezione può cambiare i risultati. Non è costanza né preparazione.
La costanza degli ultimi 14 giorni resta nella Home.

## Le fasi proposte per P-76

Le fasi **non sono decise**. La pagina le dichiara proposte e lascia sempre
libere Allenati ed Esame. Nessuna fase, avanzamento o percentuale di un piano
viene salvata. La fase mostrata è un’illustrazione del criterio sotto,
ricalcolabile sui numeri dello snapshot; non è un export del motore esistente.

| Fase proposta | Numeri del motore che la sostengono | Criterio da proporre in P-76 | Che cosa non promette |
|---|---|---|---|
| Esplorare | `quadro().totale.visti/n`, `contaStati().mai_visto`, `dovePesa()` per il tema | Dare precedenza all’esplorazione quando almeno metà della banca pertinente è mai vista; nella fixture 1.310 su 1.472 | Mai visto non significa non studiato; metà non è una soglia d’esame |
| Ritornare sulle risposte | `contaStati().debole/incerto`, filtri e liste di quadro; istanti `gp/gu` del ripiego | Sotto quella quota di mai visti, dare precedenza a errori o conferme ancora presenti, mantenendo una quota minima di esplorazione | Non basta una giusta per chiudere l’errore; nessun recupero di padronanza |
| Mettersi alla prova | Risultati di `sessioni()` e liste cieche di simulazione, separati dalla copertura | Con poca parte mai vista e senza errori/conferme pendenti, proporre un controllo dal motore; il momento e la quota minima restano da progettare | Nessun «sei pronto», nessun controllo obbligatorio, nessun superamento futuro |

Il 50% è una **proposta da discutere**, non una decisione o una soglia aggiunta
al motore. Il criterio non si fonda sulla stima ancora non pubblicabile.
P-76 dovrà restituire fase, motivo e attività dalla stessa funzione/snapshot,
decidere la banca pertinente all’obiettivo, quota minima di esplorazione,
casi pari/senza dati/assenza e momento dei controlli; un test terrà i criteri.
Prima di P-76 l’HTML illustra il posto e la spiegazione, senza realizzare il Percorso.

«60 quesiti da confermare oggi» è anch’esso **un criterio proposto dichiarato**:
il generatore filtra gli `incerto` del motore con `gp` datato almeno 12 ore
prima dell’istante fisso. Non equivale al totale degli incerti di una banca:
base e vela sono incluse, e manca il contratto per obiettivo/quantità/ritorni.
P-76 deve esportare lista e numero di «oggi»; il mock non pretende che esista
già una funzione del motore per quel numero. Le 12 ore sono la scelta pratica
decisa per la conferma, da rivedere con i dati; date assenti non confermano.

## Senza account e sotto soglia

H0 mostra «Nessuna risposta in questa pagina» e porta ad Allenati.
H1 legge dieci righe sintetiche dell’allenamento corrente: sette giuste,
tre errori, cinque riferimenti in Sicurezza e cinque in Meteorologia.
Rivedi apre i tre errori di **quell’attività**, non tutti gli errori di uno storico.
Il riepilogo deriva davvero dalle righe della fixture, non da una sagoma di
statistiche registrate. Non è una prova su risposte reali dell’app di oggi.

Nessuna mappa cumulativa, diagnosi, percentuale, freccia, ritmo o invito al
modulo in H0/H1. «Perché qui manca lo storico» spiega che cosa l’account
aggiunge: è la lettura dell’ADR-006 §1 ultimo punto e del §4 punto 12 della coda.
Il generico avatar Accedi resta la porta della barra; non è una CTA ripetuta
nel contenuto. Non è stato deciso un quarto posto per l’invito.

Account con quattro risposte: la fonte è completa, ma insufficiente per la
frase e per il primo tentativo; si mostrano i dati disponibili e il perché
delle misure assenti. `primo` è `null` sotto cinque quesiti distinti per riga;
la frase manca sotto venti. La pagina non espone `esatte1` a parte.
Andamento assente sotto due giorni e dieci risposte. Nessun ritmo o durata
stimata viene richiesto, quindi la soglia di trenta misurate non viene aggirata.

## «Hai concluso quello che ti avevamo proposto»

[Caso concluso](progressi-mappa.html?caso=concluso): frase separata dalla mappa,
tre quesiti proposti e tre risposte nella pagina, permesso di fermarsi o scegliere.
Nessun premio, nessun obbligo a proseguire, nessun quesito acquisito per il solo
fatto di avere concluso. **È un esempio illustrativo**, non un calcolo sulle
326 righe della fixture account e non una decisione presa dal mock.

Nella pagina aperta basta trattenere **in memoria** lista proposta e istante
iniziale, e confrontarli con le righe di risposta dell’attività identificata.
Le righe verificano ciò che è stato risposto, ma da sole **non dicono quale
proposta precedente sia stata mostrata**, né se sia stata rifiutata o sostituita.
Ricalcolare la Mirata dopo le risposte non ricostruisce quella proposta.
`sim_uid` lega un’attività iniziata, non una proposta ancora non avviata.

Per ritrovare *quella stessa proposta* dopo ricarica, assenza o su un altro
dispositivo serve un’identità/lista proposta registrata, o un nuovo contratto
di evento che la renda ricostruibile. Oggi sarebbe persistenza di un obiettivo
prospettico e toccherebbe il §4.4. Lo decide l’autore, poi lo progetta P-76.
Una conclusione limitata all’attività della pagina può restare derivata dalle
righe con contesto in memoria; il mock non sceglie fra i due ambiti.

## Stati, azioni e promesse

| Elemento/caso | Tocco e uscita | Che cosa non promette |
|---|---|---|
| Account caricato | Apri il tema proposto, unica principale; altre porte testuali | Controllo prescritto, minuti o voto sulla preparazione |
| Tema / voce | Allena principale, Rifai secondaria; voce → Preparazione | Lista ricalcolata in pagina o «da rifare» che includa tutti gli errori passati |
| Preparazione | Inizia principale; lista completa visibile; ritorno all’origine | Runner utilizzabile o risposta salvata |
| Mappa vela | Tre voci, nessun peso né frase | Peso per voce inventato o secondo test obbligatorio |
| ? | Spiegazione dei cinque stati e delle 12 ore, ritorno alla mappa | Padronanza, diagnosi sulle cause o soglia scientificamente validata |
| Prova / sessione | Riepilogo → riferimenti della Revisione → ritorno al medesimo riepilogo | Ripresa di attività a metà, riprova operativa o spiegazione verificata inventata |
| Caricamento | Stato senza cifre; solo controllo del mock per vedere il caricato | Archivio provvisoriamente vuoto o successo di rete |
| Errore / ricezione incompleta | Riprova → caricamento senza cifre | Zeri, selezioni o andamento da una fonte incompleta |
| Vuoto caricato | Vai ad Allenati; spiegazione e porta avatar | Account nuovo, preparazione positiva o zero diagnostico |
| Poche risposte | Mappa dei fatti, misure assenti e motivo | Soglie abbassate per riempire tessere |
| Selezione cambiata | Preparazione bloccata; ritorno e riapertura della mappa | Avvio di una lista diversa da quella annunciata |
| Errori anonimi | Tre riferimenti dall’attività della pagina; ritorno | Storico salvato o invito alla registrazione nella revisione |
| Figura mancante | Avviso sui riferimenti della lista, nessuna figura sostitutiva | Immagine recuperata o domanda risolvibile nel mock |
| Avatar / Info | Account: guasto della copia e scarico suggerito; anonimo: figura indisponibile, riferimento e motivo; pallino persistente | Guasto risolto alla lettura o copia locale uguale ad accoglimento server |

L’avviso di perdita senza account rimane nel riepilogo e nella Preparazione.
Nessun salvataggio anonimo: dati e contesti solo in memoria, History contiene
soltanto un riferimento numerico di navigazione. Chiusure e Indietro ripristinano
tema/voce, banca, posizione e fuoco del controllo d’origine; Avanti riapre il
contesto illustrato. I pannelli non sono modali e mantengono barra e avatar.

## Tragitti P-65 e consegna

Le righe 12 partono dalla **Home locale di servizio del mock**, che permette
di toccare la barra senza cambiare documento. Non sostituisce la Home completa
di P-66: evita che un salto tra file faccia passare la fixture per continuità
dell’app. Il ritorno locale conserva le righe della fonte, non prova UID/invio.

| ID P-65 | Tocco offerto e testo all’arrivo | Tocchi rimisurati / limite |
|---|---|---|
| Z-H0-12 | Progressi → Nessuna risposta in questa pagina; Home | 1 all’arrivo, 2 col ritorno; zero righe |
| Z-H1-12 | Progressi → Le risposte di questa pagina; Home | 1 all’arrivo, 2 col ritorno; dieci righe conservate |
| Z-HA-12 | Progressi → Sei qui, temi, prove, andamento, sessioni; Home | 1 all’arrivo, 2 col ritorno; 326 risposte sintetiche |
| F-H0-12 | Progressi → Nessuna risposta in questa pagina; Home | 1 all’arrivo, 2 col ritorno; zero righe |
| F-H1-12 | Progressi → Le risposte di questa pagina; Home | 1 all’arrivo, 2 col ritorno; dieci righe conservate |
| F-HA-12 | Progressi → Sei qui, temi, prove, andamento, sessioni; Home | 1 all’arrivo, 2 col ritorno; 326 risposte sintetiche |
| R-H0-12 | Progressi → Nessuna risposta in questa pagina; Home | 1 all’arrivo, 2 col ritorno; zero righe |
| R-H1-12 | Progressi → Le risposte di questa pagina; Home | 1 all’arrivo, 2 col ritorno; dieci righe conservate |
| R-HA-12 | Progressi → Sei qui, temi, prove, andamento, sessioni; Home | 1 all’arrivo, 2 col ritorno; 326 risposte sintetiche |

| Porta secondaria da Home locale | Tocchi offerti | Confine |
|---|---|---|
| Progressi → tema → voce → Allena → Inizia | 5; quattro dopo essere entrati in Progressi | Apertura illustrativa sulla stessa lista; P-69 realizza la domanda |
| Progressi → tema → voce → Rifai N errori → Inizia | 5; quattro dentro Progressi | Soltanto i da rifare della voce, senza tetto |
| Progressi → tema → Allena / Rifai → Inizia | 4; tre dentro Progressi | Il tema è già disponibile nella mappa; nessun tocco di voce nascosto |
| Progressi → Rifai dalla scheda tema → Inizia | 3; due dentro Progressi | La scorciatoia apre la medesima selezione del tema |
| H1: Progressi → Rivedi i tre errori | 2 | Solo riferimenti della revisione, correzioni P-69 |
| Progressi → prova/sessione → Rivedi le risposte | 3 | Riepilogo e riferimenti; nessuna attività completa conteggiata |
| Home → Perché questa proposta? | 1 previsto nella struttura P-65 | Non collegato tra i file di P-66 e P-68: qui si prova il tratto locale dentro Progressi |

Il conteggio non include scorrimento, lavoro sulle risposte, né apertura delle
sessioni più vecchie: quella disclosure aggiunge **un tocco**. Le misure
registrano i tratti eseguiti, non trasformano le formule di P-65 in esiti.
Il ritorno dall’attività torna prima alla Preparazione, poi a voce/tema/mappa.
Il ritorno dal Risultato al punto di Progressi verrà misurato con il giro P-69.

**P-69:** runner, consegna/parziale, timer, Risultato e Revisione con correzioni,
spiegazioni solo se verificate, riprova, ritorno effettivo alla voce di Progressi;
invito nei riepiloghi e Risultato, senza oscurare la revisione anonima; carteggio
autovalutato e bozza; Segnali separati, avatar raggiungibile nell’attività.
Serve un unico documento di mock per il giro completo, se si vuole misurare
la conservazione passando realmente da P-66/P-67 a P-68. I salti tra HTML
autoconsistenti sono confronti per il revisore, non continuità provata.

**Autore / P-76:** scegliere ambito della conclusione (pagina o persistente),
discutere fasi e criteri, funzione unica fase/motivo/lista, «oggi» e quota minima,
obiettivo e ripresa dopo assenza. L’assenza cambia la proposta derivata dalle
risposte, non cancella fatti. Nessuna decisione nuova su Q-COSTANZA o inviti.

**P-70 / realizzazione:** comprensione delle cinque parole, trovabilità e
scorrimento con persone; gesto Indietro/Avanti su dispositivo; fonti parziali
vere, ricezione concorrente e selezione cambiata fra preview e avvio; UID prima
e dopo i tragitti, account/invio, legale canonico. Il mock non sostituisce queste prove.

## Browser e review

[misure.json](progressi-riscontri/misure.json): **216 misure geometriche**,
108 viste/stati per ciascuna larghezza, in Chrome headless a **375 × 812** e
**1280 × 900**. Tutte hanno `scrollWidth = clientWidth = innerWidth`, nessun
elemento oltre bordo e al più una principale attiva; nessun overflow nascosto.
La legenda ha sempre cinque voci: a telefono va su tre righe, mai in uno
scorrimento orizzontale. Tutti gli otto temi base, le 44 voci base e le tre
voci vela sono stati aperti; le loro liste vengono confrontate allo snapshot.

[controlli.json](progressi-riscontri/controlli.json): **184 esiti verdi**, liste
Allena/Rifai, ritorni, guasto persistente, errore → caricamento, blocco della
selezione cambiata e conservazione delle dieci righe anonime.
[tragitti-misurati.json](progressi-riscontri/tragitti-misurati.json): nove ID 12
eseguiti a 375 e due aperture dalla voce, Allena/Rifai, in cinque tocchi dalla
Home locale. I conteggi delle scorciatoie sono confermati dalla struttura e
da controlli puntuali; nessuna attività completa viene spacciata per eseguita.

[misure-finali.json](progressi-riscontri/misure-finali.json) aggiunge quattro
geometrie Avatar/Info anonimo e due letture degli stili;
[controlli-finali.json](progressi-riscontri/controlli-finali.json) aggiunge
**14 controlli verdi**: guasto coerente con lo stato d’accesso, ritorno esatto
a voce/scorrimento/fuoco, lista conservata dopo l’apertura, scorciatoia Rifai,
cinque voci, risorse dichiarate senza host esterni e Avanti della cronologia.
In totale **220 geometrie, due letture degli stili e 198 controlli**, nessuna
eccezione JavaScript. Il driver riproducibile
[verifica.mjs](progressi-riscontri/verifica.mjs) usa il banco Chrome esistente,
adattato soltanto in memoria per esporre CDP e acquisire screenshot/gesti:
nessuna scrittura a `tests/`. I gesti sono nativi; si aspetta ogni ritorno
prima del successivo, evitando di saturare la cronologia di Chrome.

Ispezionati gli screenshot integrali e del viewport: account alle due
larghezze, anonimo, poche risposte e Preparazione Rifai; avatar anonimo
controllato negli stili e nelle geometrie. Esempi:
[account a 375](progressi-riscontri/account-375-viewport.png),
[account a 1280](progressi-riscontri/account-1280-viewport.png),
[anonimo](progressi-riscontri/anonimo-375.png),
[Rifai sei errori](progressi-riscontri/base-rifai-0-375.png).

**Osservato per P-70:** la principale dell’account è a y=1.003,73 px su
telefono, quindi richiede scorrimento; a desktop è a y=668,52 px. Il «sei qui»
spiega le fasi prima dell’azione, come composizione da provare: il conteggio
dei tocchi non dimostra trovabilità o velocità. La legenda è larga 339 px
a telefono e 1.100 px a desktop, con tutte le cinque parole dentro i bordi.
Non è stato dichiarato un verde di usabilità su questo costo.

Impeccable eseguito una volta: un avviso `cramped-padding` sulla barra del
mock, lo stesso limite di P-67. La `.wrap` interna fornisce l’inset: misurati
18 px a 375 e 90 px a 1280. Il testo non è a filo del viewport. Non è stato
applicato un redesign per eliminare un falso positivo meccanico.

| Criterio del prompt | Verifica / esito |
|---|---|
| Solo cartella prototipi, eccezione CHANGELOG | Diff nominato prima del commit; esclusi site/, tests/, coda e versione |
| Due accessi, caricamento, errore, vuoto e parziale | Dieci casi dell’indice; Riprova non produce cifre o un successo finto |
| Sei qui proposto e derivabile | Criterio e quantità nel generatore, dichiarazione in pagina e tabella per P-76 |
| Cinque parole decise, 12 ore e soglie | Legenda in ordine, spiegazione, `primo` nullo sotto cinque, frase e andamento assenti sotto soglia |
| Numero e lista coincidenti | Assert del generatore e confronti nel browser su temi e voci |
| Prove, andamento e sessioni separati | Sezioni ordinate, dati da funzioni del motore; nessuna stima o padronanza |
| Riepilogo anonimo e account come spiegazione | Dieci righe, due temi, tre errori da quell’attività; niente CTA nel contenuto |
| Proposta conclusa | Caso illustrativo esplicito; memoria/persistenza e decisione dell’autore documentate |
| Una principale, guasto e ritorni | Geometrie, 198 controlli, scroll e fuoco restituiti, pallino persistente |
| ID 12, aperture e consegna | Nove righe esplicite, misure con confine P-69, compiti completi non attribuiti |
| Due viewport, nessuno sbordamento | 220 misure geometriche; tutte le cinque voci della legenda visibili |

Review contro il prompt: **passa come mock**, con il costo di scorrimento e
le decisioni ancora aperte dichiarati. Guardiano e controllo condiviso della
documentazione verdi. Le suite motore, server, dati, interfaccia e specifica
non sono state rilanciate: nessun codice del prodotto o requisito è stato
modificato. Non sono stati provati persone, telefono fisico, Safari, zoom
nativo, screen reader, account, sincronizzazione, rete o UID reali.

Nessuna modifica alla coda; niente versione, tag, push, pubblicazione o produzione.
