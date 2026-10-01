# Area 6 — Rifinitura trasversale

**Sessione P-24, progetto del 30 settembre 2026, da realizzare.** Consegna sul
modello delle [aree 1–5](area-5-progetto.md): parole, componenti, responsive,
accessibilità, stati e criteri di accettazione. Questo documento e la voce di
CHANGELOG sono l'intera modifica della sessione. L'implementazione è P-25,
dopo le aree 4 e 5; la coda resta in
[prossime-sessioni.md](prossime-sessioni.md).

La rifinitura deve rendere leggibile e verificabile l'esperienza che le aree
hanno costruito. Non riapre le loro scelte di percorso, selezione, giudizio o
misura. Vale per chi prova senza account e per chi usa un account, comprese
attese, errori, offline, migrazione e operazioni sui dati.

## 1. Fonti, precedenze e perimetro

Letti i capitoli **17–22** della *Specifica della nuova esperienza e
interfaccia*, revisione del 12 settembre 2026, copia esterna al repo
`Rotta-Giusta-Specifica-UX-UI (1).docx`, SHA-256
`b3384dc24d62245e6315a78205d3b240c271dc1ebc17cf37274f805a702f6cc4`.
Le indicazioni necessarie sono riportate qui: P-25 non richiede il Word.

- [Specifica di lavoro](prossima-versione.md) §5.1: sesta fetta, capitoli
  17–22; [specifica del prodotto](specifica.md) §§2.4–2.5, 7–10 e appendice A:
  due regimi, stati e misure ancora da rifare sul chiaro.
- [Filosofia](filosofia.md), [ADR-004](adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md)
  e [client degli account](account-client-progetto.md) §§2–12: nessuna
  persistenza anonima, salvataggio dell'account e suoi stati distinti.
- [Aree 1](area-1-progetto.md), [2](area-2-progetto.md),
  [3](area-3-progetto.md), [4](area-4-progetto.md) e
  [5](area-5-progetto.md): testi, gerarchie, figure, ritorni, giudizi e
  contratti già scelti. Il [collaudo P-05](area-2-collaudo-ux.md) e gli esiti
  P-19/P-18 nel CHANGELOG delimitano le verifiche già fatte.
- `site/app.html` e [registro delle eccezioni](eccezioni-interfaccia.md),
  letti senza modifiche: stili del tema chiaro, componenti, avvisi, overlay,
  navigazione, runner e pannello Account esistenti.

**Precedenza:** decisioni dell'autore, ADR-004, specifica canonica e contratti
delle aree realizzate prevalgono sugli esempi del Word. Il capitolo 22 parla di
progressi che «restano nel browser» e di account inesistente: è superato da
P-18. Il capitolo 20 contiene composizioni indicative, non autorizza un nuovo
disegno delle aree. La tavolozza scura è Q-TEMA: il tema chiaro si misura adesso,
senza decidere qui se mantenere una variante scura.

**Entra:** revisione coerente dei testi di interfaccia, ruoli visivi e
componenti condivisi, stati dei controlli, reflow, tastiera e focus, zoom
nativo, lettore di schermo, errori e conservazione nei due regimi, con prove
manuali e automatiche. Sono comprese le viste Percorso, Quiz, Carteggio,
Progressi, Info, Account, i runner/riepiloghi/revisioni e l'extra Segnali
nelle parti condivise. **Non entra:** cambiare le cinque intenzioni, la mappa,
la composizione delle prove, il giudizio umano del Carteggio, l'archivio o la
sincronia; riscrivere banca e figure; aggiungere una modalità, metrica, tutorial,
font o dipendenza. Eventuali cambi di area passano dal §8.

## 2. Regole di applicazione

| Tema | Regola per P-25 |
|---|---|
| Una scelta già presa | Conservare nomi, ordine, azioni e ritorni delle aree. Correggere una resa incoerente; proporre all'autore un cambio di scelta (§8). |
| Una fonte per ogni promessa | Numero e lista, stato di invio e azione, testo di conservazione e regime vengono dallo stesso snapshot/contratto già usato dalla vista. La rifinitura non calcola un secondo stato. |
| Testo ufficiale | Quesiti e risposte ministeriali restano intatti e distinti dalle istruzioni del sito. Una spiegazione didattica nuova richiede fonte e revisione, fuori da P-25. |
| Due regimi | La prova anonima conserva risposte e preferenze solo finché la pagina è aperta; l'account salva localmente e invia secondo il client. La stessa frase «salvato» non copre entrambi. |
| Evidenza | Un testo nel DOM, una regola CSS o un test verde non dimostrano da soli ciò che una persona vede, sente o riesce a usare. Per ogni promessa si indica la prova osservabile. |

## 3. Linguaggio e contenuti (capitolo 17)

La voce è adulta, breve ma completa: dice **fatto → conseguenza → azione**
quando c'è un errore; per un risultato dice che cosa è stato osservato e
lascia scegliere il seguito. Metafora nautica nel marchio e nei titoli già
decisi, parole concrete nei pulsanti. «Consigliato» richiede il motivo del
motore; «prova» distingue una simulazione dall'allenamento; «da rivedere»
descrive un'azione, non una qualità della persona. Non trasformare dati scarsi
in un voto o in una promessa di preparazione.

| Contesto | Controllo editoriale prima del rilascio |
|---|---|
| Avvio e riepilogo anonimi | Prima di iniziare e alla fine: risposte disponibili soltanto nella pagina aperta; il riepilogo corrente si può leggere e l'account si propone al momento previsto dal client. Mai «salvato» o «riprendi domani». |
| Account riconosciuto | Distinguere «in questo dispositivo», «in attesa di invio» e «sul server» dagli esiti reali; un account non verificato mostra la scadenza fornita dal server. Non presentare il solo login come prova di invio. |
| Errore | Dire che cosa è fallito, se il lavoro corrente esiste ancora e quale recupero è davvero disponibile. «Scarica una copia» compare come rimedio solo quando quella fonte è leggibile e completa. |
| Esiti e dati | Nomi «Giusti · da rifare · mai visti», primo tentativo, ripasso e risultati del Carteggio restano quelli delle aree. Numeri dalla banca e dallo snapshot, mai negli esempi di testo. |
| Figure e fonte | «Risposta ministeriale» separata dal giudizio della persona e dalle note del sito. Un'alternativa che ripete la domanda identifica l'immagine, ma non garantisce equivalenza didattica (§6). |

Fare un inventario delle stringhe visibili in Percorso, Quiz, Carteggio,
Progressi, Info e Account: etichetta, punto d'uso, regime, fonte del dato e
stato. Correggere duplicazioni contraddittorie fra avviso locale e Info; un
messaggio non deve sparire se il pannello Account viene chiuso. I testi lunghi
di conferma email, import, conflitto, cambio account e cancellazione sono casi
di prova, non frasi da accorciare fino a perdere la conseguenza.

## 4. Ruoli visivi e componenti (capitoli 18–19)

Il tema chiaro usa i ruoli già presenti nella pagina: superficie, testo
principale/secondario, azione, bordo, focus, successo, attenzione, errore.
Misurare le **coppie effettive** di primo piano e sfondo in tutti gli stati,
anche note, placeholder, link, testo su pulsanti, avvisi e controlli
disabilitati che comunicano un motivo. Non sostituire una misurazione con il
nome del token. Il navy evidenzia l'azione primaria; schede e bordi delimitano
un'unità interattiva o un confronto, senza aggiungere contenitori a ogni riga.
Le figure ufficiali conservano il loro colore e il fondo bianco; lo stato di
interfaccia non si comunica soltanto con il colore.

La scala del Word è un riferimento **proposto**, non una dimensione da imporre
contro componenti già collaudati: titoli pagina 28–32 px telefono e 32–40 px
desktop; sezione 22–24/24–28; quesiti e risposte 18–20/18–22; corpo 16–18;
metadati 14–16. Interlinea di partenza 1,45–1,6. Verificare testi lunghi,
zoom e font di sistema prima di cambiare dimensioni. Nessuna informazione
essenziale si sposta in una nota piccola. La spaziatura 4/8/12/16/24/32/48 px
serve a far leggere i gruppi, senza fissare altezze che tagliano contenuto.

Per ogni famiglia di controlli condivisi — barra e Info, pulsante/link,
selezione e filtri, input/textarea, disclosure, dialoghi, avvisi e azioni sui
dati — verificare normale, hover quando esiste, focus, premuto/selezionato,
caricamento, disabilitato ed errore **se applicabili**. Un link naviga, un
pulsante esegue; l'azione primaria nomina il gesto concreto. Un controllo
disabilitato spiega perché quando la persona deve decidere cosa fare. Durante
un invio o un download si comunica l'operazione e si evita il doppio gesto,
senza bloccare l'intera pagina. Pannelli e finestre hanno titolo, Esc dove
appropriato, Tab confinato se modali e ritorno del focus all'apertura.

L'eventuale movimento conferma soltanto azioni già comprensibili dal testo;
`prefers-reduced-motion` lo toglie senza nascondere esiti. La figura ingrandita
mostra l'intero contenuto disponibile, consente chiusura e ritorno, e non
promette dettagli che la risoluzione della fonte non offre. Nel confronto del
Carteggio restano le etichette «La tua risposta» e «Risposta ministeriale»
anche quando le colonne si impilano.

## 5. Responsive e ingrandimento (capitoli 19–20)

Partire da **320 CSS px**, poi 375–390, una larghezza tablet e 1280 px.
L'ordine di DOM, lettura e tastiera resta sensato quando le colonne diventano
righe. Le quattro destinazioni previste dal client con account e le porte
senza Progressi nel regime anonimo devono avere etichette intere, Info e
Account raggiungibili, senza riga di navigazione tagliata. I punti di cambio
si scelgono dove il contenuto non tiene più, non da un elenco di telefoni.

Per ciascuna larghezza esercitare titoli e nomi lunghi, note estese, numeri
grandi, filtri aperti, avvisi contemporanei, tastiera del telefono, landscape,
figure, riepiloghi, tabelle/confronti e dialogo Account. La pagina non deve
scorrere orizzontalmente; una figura o una rappresentazione che richiede
scorrimento interno si dichiara e conserva controlli e testo utilizzabili.
Progressi usa le schede verticali già progettate nell'area 5; le due tabelle
che la specifica registrava a **+89 px su 375 px** sono da rimisurare dopo
P-23. Non considerare `overflow-x:auto` da solo la correzione. Barre fisse e
azioni ancorate lasciano visibili ultima risposta, errore e focus.

Il collaudo di P-05 ha provato un reflow **equivalente** a 200 % con viewport
640 × 500, non lo zoom nativo. P-25 deve usare il comando di zoom **reale del
browser** fino al 200 % su desktop e l'ingrandimento del solo testo fino al
200 % dove disponibile: registrare browser, versione, viewport, fattore e
stato provato. Cambiare viewport o `deviceScaleFactor` non vale come zoom
nativo. Con testo ingrandito e spaziatura personalizzata, nessuna risposta,
nota, azione o stato deve diventare irraggiungibile. Se l'ambiente automatizzato
non applica davvero lo zoom, la prova resta aperta per un browser controllato
dall'autore e si dichiara il solo reflow equivalente.

## 6. Accessibilità e prove manuali (capitolo 21)

Il Word propone **WCAG 2.2 AA sui percorsi completi** come obiettivo, non come
conformità già dimostrata. L'appendice A della specifica chiede sul tema
chiaro: contrasto ≥4,5:1 per testo normale, ≥3:1 per testo grande e indicatori
non testuali necessari; target di progetto ≥44×44 px sui controlli principali;
reflow a 320 px, testo 200 %, focus visibile e nessun significato affidato al
solo colore. Il minimo AA generale per il tocco è distinto dall'obiettivo di
progetto: il Word lo indica come 24×24 CSS px con eccezioni. Registrare per
ogni campione selettore, stato, colori/rapporti misurati, rettangolo e risultato.
Un campione per ruolo non sostituisce la verifica delle varianti reali.

Percorsi da completare **solo con tastiera**, nei due regimi: primo quiz,
configurazione e filtri, runner e riepilogo, revisione e riprova; ingresso e
confronto Carteggio dopo P-21; Progressi dopo P-23; Info/Account, accesso,
verifica email, import/export, conflitto e azzeramento. Tab/Shift+Tab in ordine,
focus sempre visibile e non coperto, Esc e ritorno dal dialogo, scorciatoie
quiz inattive mentre si scrive in un campo. Timer consultabile senza annunci
ogni secondo; prova a tempo e allenamento restano diversi. Hover, trascinamento
o gesto complesso non sono l'unica via a un'azione. Segnali conserva i suoi
controlli e il suo audio facoltativo, senza essere riorganizzato.

Almeno **una combinazione reale browser + lettore di schermo** attraversa gli
stessi percorsi principali, con resoconto di sistema, versioni e azioni
effettivamente ascoltate: titoli e gruppi, etichette dei campi, domanda nuova,
riscontro, errore di scrittura, stato di invio, timer, dialoghi, ritorno del
focus. Un `aria-live` nel DOM non dimostra l'annuncio. Gli avvisi urgenti non
devono sommergersi, duplicarsi a ogni render o essere nascosti a chi legge.
La suite browser del client usa `element.click()` e non copre tastiera, lettore,
gestore password o dimensioni: il suo verde non chiude questa prova.

Le 119 figure dei quiz citate dall'appendice A hanno una difficoltà didattica
specifica. Dopo l'area 3 l'alt deriva dalla domanda e identifica la figura;
non descrive necessariamente linee e simboli, e non dimostra che il quesito si
possa risolvere senza vista. Campionare figure di riconoscimento, carteggio e
figure mancanti con lettore di schermo; registrare i limiti per quesito/tipo.
Un'alternativa didattica che rivelerebbe la risposta o cambierebbe il testo
ufficiale richiede decisione e fonte fuori da P-25. Non dichiarare risolta
l'accessibilità delle figure per la sola presenza di `alt`.

## 7. Stati e conservazione (capitolo 22)

La stessa condizione deve essere spiegata nel punto d'uso; Info conserva il
quadro generale e il pallino di guasto. Non spegnere il pallino di una scrittura
fallita per ottenere una schermata più pulita. Per ogni stato si provano
visibilità, annuncio, conseguenza, recupero e persistenza del messaggio.

| Condizione | Prova senza account | Account |
|---|---|---|
| Vuoto o dati insufficienti | Nessuno zero che sembri diagnosi; si può cominciare, senza Progressi storici. | Mappa e misure solo dove fonti e soglie le permettono; account vuoto non equivale a prima visita. |
| Selezione vuota / banca o figura mancante | Spiegare filtro o risorsa mancante, con modifica/riprova reali; conservare ciò che è in pagina. | Stesso punto d'uso, più stato locale/remoto distinto quando incide sul recupero. |
| Attività interrotta | Riepilogo e revisione corrente finché la pagina vive; ricarica perde le risposte. Il testo del Carteggio resta in memoria finché D-03 non è consegnata. | Riepilogo da righe davvero scritte; bozza di Carteggio solo quando D-03 è verificata, senza confonderla con una risposta valutata. |
| Offline | App, banca e figure hanno disponibilità separate. Nessuna promessa di invio o registrazione riuscita offline. | Copia già associata all'account riconosciuto, nuove righe in attesa e server non aggiornato; nessuna copia di identità sconosciuta mostrata. |
| Scrittura o invio fallito | Nessuna falsa frase «salvato»; errore locale e possibilità realmente disponibile, senza inventare un archivio anonimo. | Avviso persistente in attività, Info/Archivio e coda secondo client; distinguere fallimento locale da invio non riuscito. |
| Import parziale / conflitto / `401` | Report delle righe accettate, duplicate e scartate se import consentito; vecchio archivio separato. | Report dalla fonte client, scelta richiesta quando prevista; copia congelata non passa all'account nuovo e non diventa zero. |
| Cancellare o uscire | Nessuna cancellazione di server implicita; avviso che la prova si perde alla chiusura. | Conseguenza e conferma specifica, scelta per righe pendenti, download solo se verificato; uscita/azzeramento/cancellazione restano azioni diverse. |

«Pronto offline» richiede una prova delle risorse realmente servibili, non una
chiave in cache. Un aggiornamento non tronca un runner aperto. Nessun errore di
lettura si rende come archivio vuoto; nessun invio HTTP riuscito si traduce in
«tutto salvato» se le righe non sono state confermate. Le frasi e le scelte
specifiche del client restano la fonte: la tabella è un piano di verifica, non
una nuova macchina a stati.

## 8. Cambi di area da proporre all'autore

Questi punti richiedono una scelta esplicita **prima** che P-25 li attui. Finché
restano aperti, P-25 conserva le aree e può correggere difetti misurati senza
trasformare una proposta in decisione.

| Proposta | Perché emerge | Decisione richiesta |
|---|---|---|
| Ridurre schede o cambiare gerarchia di Percorso/Quiz/Carteggio | Il capitolo 18 propone meno riquadri e il 20 nuove composizioni, ma le aree 1–4 hanno già scelto ordine e azioni. | L'autore indica una modifica concreta per una vista, dopo confronto guardato; una pulizia di CSS che preserva la gerarchia non richiede nuova scelta. |
| Cambiare parola o collocazione di un ingresso già deciso | Il capitolo 17 invita a provare i nomi con persone, ma «Un giro tra gli argomenti», le tre porte Carteggio e le voci di Progressi hanno contratti propri. | L'autore approva la coppia vecchio/nuovo e l'effetto su ritorni e controlli. La sola correzione di errore o incoerenza non riapre il nome. |
| Descrizioni didattiche delle figure | L'alt attuale non rende equivalente ogni immagine. | L'autore, con fonte e revisione didattica, sceglie una strada che non sveli la risposta; P-25 registra il limite senza riscrivere la banca. |
| Tema scuro | Q-TEMA nella specifica canonica resta aperta. | L'autore decide se la variante sia requisito futuro. La misura del chiaro procede comunque. |

**Decise dall'autore il 1° ottobre 2026: tutte e quattro «no, per ora».**
Nessun cambio di gerarchia nelle viste, perché le aree 1–5 hanno già scelto
ordine e azioni e i controlli le tengono ferme; nessun ingresso rinominato o
spostato prima di prove con persone (Q-PROVE), perché un nome non provato è
un'opinione contro un'altra; le figure tengono l'alt di oggi, «Figura del
quesito n: domanda», con il limite dichiarato — 119 descrizioni da scrivere e
far rivedere rischierebbero di svelare la risposta —; il tema scuro è
un'opzione futura, non un requisito (Q-TEMA, chiusa nel §10 della
specifica). P-25 è stato quindi rifinitura: i cinque difetti T-* misurati da
P-45. Le prove con zoom nativo e lettore di schermo restano dell'autore.

Anche Q-PROVE resta dell'autore: servono dispositivi e persone per un collaudo
esterno e per Safari reale, in particolare il cookie fra i due sottodomini.
Una prova su Safari installato a 375/1280 px di P-18 non è prova su hardware
Apple reale né verifica del cookie in produzione.

## 9. Criteri di accettazione di P-25

| Caso | Evidenza richiesta |
|---|---|
| Testi nei due regimi | Inventario delle frasi confrontato con le schermate e il client: anonimo prima/dopo attività, account verificato/non verificato, offline, pendenti, `401`, import parziale, cambio account, eliminazione; nessuna promessa falsa di permanenza o diagnosi. |
| Componenti e contrasti | Rapporti e target misurati sui colori **calcolati**, per tutti gli stati applicabili e le superfici chiare/scure residue; campioni falliti corretti e rimisurati. Screenshots guardati, anche quando il DOM contiene il testo. |
| Reflow | 320, 375/390, tablet e 1280 px, contenuto estremo e due regimi; `scrollWidth` pagina ≤ `clientWidth`, nessuna azione coperta, confronti e figure utilizzabili. Difetto storico delle tabelle rimisurato dopo P-23. |
| Zoom | Prova reale al 200 % del browser e del testo, con strumenti/versioni registrati; se non eseguibile, limite esplicito e solo reflow equivalente dichiarato. |
| Tastiera e lettore | Flussi completi, inclusi errori e gestione dati, osservati con tastiera e almeno un lettore reale; focus, annunci e recuperi annotati. Un controllo automatico non sostituisce il resoconto. |
| Stati | Guasto locale, invio pendente/fallito, offline parziale, banca/figura mancante, selezione vuota, conflitto e operazione distruttiva mostrano conseguenza e uscita reale; Info non perde il segnale di guasto. |
| Regressioni | Nessuna selezione, conteggio, giudizio, ritorno o persistenza cambiati senza decisione. Suite complete e guardiano verdi, 375/1280 guardati, nessuna nuova dipendenza o modifica della banca. |

## 10. Dipendenze, controlli ed evidenze

### 10.1 Contatto con Claude su `main`: prima della realizzazione

**Controlli e specifica sono di Claude.** Prima di P-25, aggiungere in
`tests/test_interfaccia.py` controlli del regime trasversale, con riferimento
alla pagina **effettivamente presente** e casi rotti deliberati: stato anonimo
che dice «salvato», account offline che dice «sul server», errore di scrittura
che spegne Info, `401` che mostra righe dell'identità precedente, conteggio
senza fonte, pannello che perde focus, avviso presente nel DOM ma occultato,
tabella che sborda a 320/375 px. La sola ricerca di classi o stringhe non
prova geometria, ordine di focus o annuncio. Tenere verificato il regime
attuale durante la transizione; alla merge esigere quello nuovo. Non togliere
controlli delle aree precedenti per far passare la rifinitura.

La specifica canonica §9 deve avere requisiti con controllo (o **scoperto**
motivato) per contrasto del tema chiaro, reflow/zoom, target/focus, stati in
entrambi i regimi e lettore di schermo. Distinguere la parte automatizzabile
dalla prova manuale con data, strumento e limite; `tests/test_specifica.py`
deve continuare a verificarne i puntatori. Aggiornare l'appendice A con le
misure osservate, senza anticipare «conforme AA» o dichiarare passata una prova
di zoom/lettore non eseguita. Se emergono modifiche ai contratti del motore o
del client, documentare chiamanti e rischio, e chiuderle su `main` prima della
UI. P-24 non modifica `tests/`, `specifica.md`, motore o coda.

Il banco Chrome del client ha il vincolo della porta **8620**: le suite
interfaccia dei worktree si escludono. Per il lettore, lo zoom nativo, Safari
reale e persone, un test `element.click()` non fornisce evidenza: preparare la
prova manuale e registrarne l'esito. L'accessibilità delle figure può restare
un limite dichiarato, con una decisione dell'autore al §8, senza fabbricare
un'alternativa che sveli il quesito. Claude chiude test e specifica su `main`;
ChatGPT applica su `ui/main` soltanto i contratti consegnati.

### 10.2 Evidenze di P-24 e limiti

P-24 ha letto la copia Word con impronta coincidente, i documenti delle aree,
la specifica canonica, il progetto del client e gli esiti di area 1,
P-05/P-19/P-18. L'area 1 aveva guardato 375/1280 px, target, contrasto,
focus e stop del primo flusso: quella prova non copre le altre viste e gli
stati introdotti dal client.
P-05 ha misurato a 375/1280 px e un reflow equivalente al 200 %, ma **non**
lo zoom nativo. P-19 dichiara ancora non provati zoom del testo al 200 %, lettore
sui percorsi del ciclo e persone. Il banco del client non copre gesto reale,
tastiera, lettore, dimensioni o gestore di password; P-18 ha guardato geometria
e dialogo account a 375/1280 px in Chrome e Safari installato. L'appendice A
chiede ancora la misura sistematica del tema chiaro. L'area 4 ha prove di
contratto e limiti dichiarati in P-20, ma non un collaudo visivo della UI
progettata; l'area 5 è anch'essa un progetto in attesa di realizzazione. I
loro flussi si collaudano dopo P-21 e P-23. Non si dichiara qui un audit
visivo o una conformità già conseguita.

### 10.3 Il contratto dei controlli — consegnato da P-45, 30 settembre 2026

Questo paragrafo l'ha scritto Claude su `main` (P-45), dopo il progetto: è quello
che il §10.1 chiedeva. I controlli sono i gruppi **T-01…T-09** del banco del
client (`tests/client_account.mjs`), registrati in `tests/test_interfaccia.py`
come `test_rifinitura_*`; i requisiti sono R-RIF-01…16 nel §9.11 della
specifica, e l'appendice A ha le misure del 30 settembre.

**I due regimi sono quelli d'accesso.** Ogni gruppo dice in quale gira: T-01,
T-05, T-06, T-07:prova, T-08 e T-09 nella prova senza account; T-02, T-03, T-04
e T-07:conto con un account vero sul server del banco. **Il passaggio a P-25
non ha un raccordo da riconoscere**: le garanzie valgono per la pagina di oggi
come per quella nuova. Quello che la pagina di oggi non rispetta sta fra i
«Difetti aperti dichiarati» di `docs/eccezioni-interfaccia.md` — sette righe
`T-*` —, con la verifica che lo dimostra: la suite pretende che sia ancora
rossa. **P-25 chiude i sette difetti e toglie le righe nello stesso commit**;
una riga che resta con il difetto chiuso fa diventare rossa la suite, e alla
merge la regia controlla che non ne resti nessuna.

**Che cosa la pagina deve avere**, oltre agli agganci del §12 del progetto del
client (`[data-rotta-start]`, `#r-text`, `#r-ans .ans`, `#r-close`, `#r-fine.on`,
`[data-ciclo="ritorno"]`, l'archivio `rg-account-<chiave>` con `righe` e la coda
in `meta`):

- le porte `[data-v="oggi|quiz|cart|diag|tec|seg|info"]` e le viste
  `#v-<nome>`: sono le **superfici** che T-07, T-08 e T-09 visitano, insieme al
  runner con una risposta, al riepilogo e alla finestra «Accedi». Una superficie
  nuova entra nel banco da `main`, nella lista `VISTE_RIF`;
- `<meta name="viewport" content="width=device-width, initial-scale=1">`: senza,
  il telefono dispone la pagina a 980 px, e il banco lo dice;
- `#conto-porta` nell'intestazione: «Accedi» senza account e dopo un `401`,
  «Account» dentro; apre una finestra `[aria-modal="true"]` con un nome, che
  prende il fuoco, lo tiene con Tab, si chiude con Esc e lo restituisce;
- in Info, «risposte ai quiz N», con N contato dalla fonte: le risposte della
  pagina aperta senza account, le righe `_t:'q'` della copia con l'account;
- con l'account e righe in coda, «N risposte da inviare», con N la lunghezza di
  `coda.daInviare`; le frasi che dicono il server — «confermate sul server»,
  «risposte salvate nel tuo account», «N risposte salvate» — solo quando il
  server ha le righe. Senza account nessuna frase di conservazione
  (`FRASI_SALVATO` nel banco, l'elenco è lì);
- dopo una scrittura fallita nella copia: «Le ultime risposte potrebbero non
  essere salvate.» che si vede davvero con il runner aperto, nel riepilogo e nel
  Percorso; una regione viva (`role="alert"`, `status`, o `aria-live`) che dice
  «non … salvat…»; e la porta `[data-v="info"]` che dice «Salvataggio da
  controllare» in ogni vista, anche dopo una scrittura riuscita.

**Che cosa si misura, e come.** Un avviso «si vede davvero» se occupa spazio,
portato al centro sta nello schermo, non è trasparente, non ha niente sopra al
centro della sua prima riga, ha il contrasto minimo, e l'albero di
accessibilità del browser non lo ignora. Il fuoco si muove con i tasti del
protocollo, non con `focus()`; un indicatore c'è se l'aspetto dell'elemento
cambia quando lo prende. Lo sbordo guarda la pagina che scorre di lato, un
elemento che esce in parte dallo schermo, un contenitore che scorre di lato al
suo interno — `overflow-x:auto` non è una correzione — e un testo o un
controllo tagliato da un antenato che nasconde. Contrasto e bersagli si
misurano sui colori e sui rettangoli calcolati; un fondo con un'immagine o una
trasparenza è «non misurabile», e si conta.

**Il banco provato contro sé stesso.** La pagina di riferimento
(`tests/pagina-client-account.html`) passa tutti i gruppi, e 31 rotture sue
sono rosse ognuna per il suo motivo. Sei difese del banco tolte una alla volta
— che cosa sta sopra un avviso, l'albero di accessibilità, l'opacità, il
confronto dell'aspetto al fuoco, i contenitori che scorrono, i testi tagliati —
fanno passare verde la rottura che le riguarda.

**Che cosa non vede**, e resta alle prove manuali del §9.11 della specifica:
lo zoom nativo e il testo ingrandito, il contrasto non testuale e il colore da
solo, i percorsi interi a tastiera, il lettore di schermo, Safari, e gli stati
del client oltre a quelli elencati (verifica, conflitto, import parziale,
uscita), dove contrasto e bersagli non sono ancora misurati (R-RIF-16).
