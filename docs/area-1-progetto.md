# Area 1 — Percorso e primo ingresso

**Decisioni di progetto del 12 settembre 2026, da implementare.** Questo documento
chiude le scelte richieste per l'area 1; non dichiara una verifica di usabilità
né un'interfaccia già realizzata. La sessione produce solo questo file e il
CHANGELOG. L'implementazione successiva è prevista su GPT-5.6 Sol, in `ui/main`.

## 1. Fonti, precedenze e perimetro

Letti i capitoli 3–7 della **Specifica della nuova esperienza e interfaccia,
revisione del 12 settembre 2026**, nella copia
`Rotta-Giusta-Specifica-UX-UI (1).docx` fornita nel contesto di lavoro
(SHA-256 `b3384dc24d62245e6315a78205d3b240c271dc1ebc17cf37274f805a702f6cc4`).
La copia senza `(1)` è del 9 settembre. Il documento Word resta esterno al repo;
le decisioni necessarie a questa area sono riportate qui per esteso.

Riferimenti di repository:

- [Specifica di lavoro](prossima-versione.md), §§4–6 e 8: tempo, contratti,
  ripartizione del lavoro e accettazione.
- [Decisioni aperte](decisioni-aperte.md), punti 1–5 e soprattutto la chiusura
  del punto 5: tre sole affermazioni ammesse dopo una breve attività.
- [Specifica del prodotto](specifica.md), §§3–7: archivio, motore, ingressi e
  comportamenti da preservare; [filosofia](filosofia.md) per promessa e tono.
- [Eccezioni dell'interfaccia](eccezioni-interfaccia.md): correzioni tipografiche
  da eseguire insieme alla futura implementazione, non in questa sessione.
- `site/app.html`: `dipingi()`, `dipingiStatoRotta()`, `apri()`, `fine()`,
  `chiudi()`, `apriRivedi()` e gli ingressi `data-rotta-*`, letti senza modifiche.

**Precedenza:** il task e il punto 5 chiuso prevalgono sulle proposte anteriori.
Quindi non si attuano «primi indizi sulle conoscenze», «il quadro si chiarirà»,
«punto di partenza» come misura, né durate fisse. Il rinvio del tempo nel Word
è superato da R-TEMPO-01/02/03. La tabella delle aree in `prossima-versione.md`
conserva l'ordine iniziale, ma il suo paragrafo successivo e questo task fissano
Percorso come area 1 e ciclo completo come area 3.

**Entra:** Percorso, accoglienza integrata, intestazione, porte verso le viste
esistenti, prima attività e suo minimo riscontro finale, data facoltativa,
avvisi e sette eccezioni tipografiche di `app.html`.
**Non entra:** ridisegno di Quiz, Carteggio, Progressi o Info; ciclo generale
«riprova questi N»; vetrina; ambiti del lavoro B; dati, motore e nuove modalità.
Le modifiche minime al runner indicate al §5 servono soltanto a mantenere la
promessa della prima attività: non autorizzano a riscrivere il runner generale.

## 2. Decisioni che chi scrive deve applicare

| Decisione | Scelta e motivo | Alternativa scartata |
|---|---|---|
| Nome | **Percorso** nella navigazione e **Il tuo percorso** come titolo. Dice la funzione della pagina senza richiedere di interpretare una metafora. | Nuovo nome tecnico della vista: mantenere `oggi` e gli ID esistenti evita migrazioni inutili. |
| Accoglienza | Una schermata operativa, senza domanda sulla fase di preparazione (opzione C del punto 4). Il task delega qui la scelta; non è l'esito di un confronto con utenti. | Domanda che cambia solo una frase: il beneficio non è dimostrato e il motore non usa un livello dichiarato. Nessuna variante A/B da implementare adesso. |
| Primo avvio | Fino a **10 quiz base** selezionati da `mirata()`. Dieci è il limite richiesto, il numero visibile è sempre la lunghezza effettiva. | Screening completo, diagnosi iniziale, dieci domande scelte o bilanciate dalla UI. |
| Ritorno | Fino a **25 quiz base**, con la stessa funzione. Il cambio dipende da risposte ai quiz base già presenti, non da visite o giorni. | Obiettivi giornalieri, adattamento del numero alla data o ai minuti disponibili. |
| Guida e libertà | Un avvio dominante, «Scegli un'attività» subito accanto; Carteggio accessibile autonomamente dalla barra e dal suo riquadro. | Tour obbligatorio, prerequisito di dieci quiz, cinque schede equivalenti. |
| Proposta | Una sola selezione consigliata, esplicitamente **Quiz base**. Nessuna alternanza automatica con Carteggio e nessuna classifica di temi nel Percorso. | Confrontare coperture di filoni diversi per stabilire cosa fare. |
| Riepilogo breve | Fatti della lista appena svolta, errori consultabili e libertà di concludere. | Percentuale dominante, voto, miglioramento, previsione d'esame o diagnosi attenuata da una clausola. |
| Tempo | Sotto soglia, garanzia di arresto; con ritmo affidabile, stima del motore. | «2–3 minuti», tempo medio fisso, selettore «quanto tempo hai?». |
| Continuità | Risposte persistenti e lista temporanea. «Continua ad allenarti» prepara una nuova lista. | «Riprendi» dopo una ricarica, flag persistente di primo accesso o archivio parallelo. |
| Grafica | Tema chiaro e identità nautica esistenti; titolo semplice e illustrazione secondaria. | Grande hero promozionale, tappe che sembrano sblocchi, etichette minuscole. |

La scelta sull'accoglienza chiude il dettaglio operativo **per questa area**;
non riscrive `decisioni-aperte.md` e non presenta come validata l'utilità
comparativa delle alternative. Le cinque intenzioni di Quiz e il nome dello
screening appartengono all'area 2: qui se ne conservano le porte esistenti.

## 3. Struttura e stati del Percorso

### 3.1 Ordine unico dei contenuti

Ordine del DOM e della lettura, identico su telefono e desktop:

1. **Intestazione:** marchio, Percorso / Quiz / Carteggio / Progressi, Info.
   Il marchio torna al Percorso; nome accessibile: «Rotta Giusta, vai al Percorso».
   Nessuna nuova voce principale. Info conserva il pallino e aggiunge il testo
   della condizione quando occorre (§7).
2. **Avvisi attivi**, prima del titolo e delle attività. Gli avvisi urgenti di
   salvataggio hanno precedenza; gli altri restano distinti e leggibili.
3. **Titolo e contesto**, senza eyebrow. L'introduzione cambia come al §3.2.
4. **Proposta Quiz base:** titolo, scopo, quantità, garanzia/stima, azione
   principale; «Scegli un'attività» è immediatamente disponibile. Importazione
   e «Come funziona» sono collegamenti testuali nello stesso blocco quando
   l'archivio è vuoto o incerto.
5. **Due filoni:** Quiz (base e vela distinti) e Carteggio. Il secondo mantiene
   il risalto attuale; su desktop può affiancare la proposta, su mobile la segue.
   Sono porte verso ambienti, non una sequenza da completare.
6. **Ultima attività nei quiz**, solo se esiste, con accesso alle sue risposte.
7. **Scelta libera:** «Scegli un argomento» e «Simula la prova dei quiz».
   Qui atterra «Scegli un'attività» mediante scroll e focus sul titolo.
   Anche da qui rimangono visibili le porte «Apri Quiz» e «Apri Carteggio».
8. **Allenamenti extra**, con Segnali fuori dai conteggi della copertura.
9. **Data d'esame facoltativa**, sue eventuali informazioni, e conservazione
   dei progressi. Link a fonti e difetti dichiarati attraverso Info.

L'importazione resta accessibile anche con storico presente, nel blocco finale
«I tuoi progressi». Nessun elenco di errori o temi ordinati per difficoltà nel
Percorso. `consigli()` continua a essere consumata nella destinazione esistente:
non se ne copia la classifica qui. Il consiglio operativo del Percorso è la
lista di `mirata()`; non aggiungere un secondo «cosa fare adesso» né modificare
la graduatoria di Progressi nell'area 1.

### 3.2 Stato iniziale: separare archivio, filone e salvataggio

La pagina non sa se una persona è nuova. **Vuoto** significa caricamento
riuscito, fonte ordinaria leggibile e nessuna attività in archivio. Una lettura
fallita, un ripiego di archivio o una banca non caricata non sono questo stato.
Le condizioni di errore del §7 si sovrappongono agli altri stati e prevalgono
su qualunque frase che prometta salvataggio.

| Stato verificato | Introduzione sotto «Il tuo percorso» | Proposta |
|---|---|---|
| Archivio ordinario vuoto | «Allena quiz e carteggio per la patente nautica senza limiti, insieme allo studio con la scuola o il manuale.» Poi: «Non ci sono ancora attività in questo browser.» | Prima attività base, fino a 10. Nessuno zero statistico, percentuale o semaforo. |
| Attività presenti, nessuna risposta base | «Qui ritrovi le attività svolte in questo browser. Quiz e carteggio restano due allenamenti distinti.» | «Comincia con i quiz base», fino a 10. Non dire che l'archivio è vuoto se contiene vela, tecniche o carteggio. |
| Almeno una risposta base | «Puoi continuare con i quiz oppure scegliere un'altra attività. I riscontri descrivono le risposte date qui.» | «Continua con i quiz base», fino a 25, anche dopo una sola risposta o una lunga pausa. |
| Solo punteggi Segnali | Introduzione di orientamento; al posto della frase di archivio vuoto: «Non ci sono ancora risposte a quiz o carteggio in questo browser. I risultati dei Segnali restano separati.» | Prima attività base, fino a 10. |
| Lista mirata vuota, banca caricata | Mantieni il contesto dell'archivio. Nella proposta: «Non ci sono quesiti in questa selezione.» | «Puoi scegliere un argomento oppure una simulazione.» Nessun pulsante Inizia inerte e nessuna selezione sostitutiva automatica. |

La condizione base si legge da `traccia(..., 'base', ...).risposte > 0`.
L'assenza di base non nasconde i dati degli altri filoni. Nessuna soglia
ulteriore divide «dati parziali» e «utente esperto»: il Percorso descrive fatti
in tutti i casi. L'importazione invalida lo snapshot, ripiega l'archivio con il
percorso esistente e ridisegna anche proposta, conteggi e stima.

### 3.3 Testi dei due filoni e degli extra

**Quiz**

- Titolo: «Quiz».
- Testo: «Scegli gli argomenti della banca base o vela e confronta le tue risposte con quelle ufficiali.»
- Azione: «Apri Quiz» → vista `quiz`, senza avvio automatico.
- Base senza risposte: «Quiz base: nessuna risposta registrata qui.»
- Vela senza risposte: «Quiz vela: nessuna risposta registrata qui.»
- Per ciascuna banca con risposte, tre etichette con i valori di `traccia()`:
  «Corretti all'ultima risposta: {coperti}»; «Da ripassare: {da_ripassare}»;
  «Mai incontrati qui: {mai_visti}».
- Spiegazione comune: «Questi numeri riguardano i quesiti della banca, non tutto quello che hai studiato.»
- Link testuale: «Vedi i progressi» → `diag`. Niente freccia come unica etichetta.

**Carteggio**

- Titolo: «Carteggio».
- Testo sempre presente: «Svolgi gli esercizi sulla carta nautica. Qui confronti il risultato con la risposta ufficiale e lo valuti tu.»
- Seconda frase: «Puoi anche allenarti a riconoscere le tecniche.»
- Azione: «Apri Carteggio» → `cart`, senza quiz preliminari.
- Se non esistono righe `_t: 'c'`: «Nessun esercizio sulla carta registrato qui.»
- Se esistono: «Hai registrato esercizi sulla carta. Ritrovi i risultati in Carteggio.»
- Se esistono righe `_t: 't'`, aggiungere: «Hai svolto attività di riconoscimento delle tecniche. Sono distinte dagli esercizi sulla carta.»

Per Carteggio si usano solo queste presenze, non un nuovo totale derivato di
esercizi, tecniche o prove. Il motore espone qui misure diverse: sommarle sarebbe
una nuova contabilità. La spiegazione completa di materiali e attività resta
nella sua area; nessun riferimento all'ordine ministeriale delle prove viene
aggiunto in questa sessione.

**Scelta libera**

Titolo «Scegli un'attività»; frase «Puoi scegliere da dove cominciare e cambiare attività quando vuoi.»
«Scegli un argomento» → modalità `argomento` esistente; descrizione
«Apri gli argomenti dei quiz e scegli cosa esercitare.»
«Simula la prova dei quiz» → configurazione `sim`; descrizione
«Una prova con il timer. Leggi le condizioni prima di iniziare.»
Non avviare lo screening dietro uno di questi nomi. La modalità `screening`
rimane raggiungibile da Quiz finché l'area 2 non ne riordina l'ingresso.

**Extra**

Titolo «Allenamenti extra»; testo «Attività originali di Rotta Giusta. I risultati non modificano la copertura dei quiz.»
Azione «Riconosci fanali e segnali» → stessa vista `seg` della porta COLREG.
Descrizione «Esercitati con fanali, segnali diurni e sonori.»
Nessun badge o punteggio entra nella proposta principale.

### 3.4 Ultima attività e conservazione

Usare `E.sessioni(S.archivio, { limite: 1 })[0]`; titolo esplicito
«Ultima attività nei quiz», perché il contratto non include tutti gli esercizi
di Carteggio. Mostrare banca («Quiz base» / «Quiz vela»), data locale, etichette
«Risposte: {n}» e «Corrette: {esatte}». Nessuna durata nel Percorso qui.
Azione «Rivedi le risposte» → `apriRivedi(id)`, sullo stesso identificatore
restituito dalla chiamata. Chiudere la revisione riporta al Percorso e al
controllo d'origine. Se `fonte === 'risposte'`, aggiungere prima del link:
«Il raggruppamento di questa attività è ricostruito dalle risposte.»
Se manca la sessione, non mostrare un riquadro vuoto. Se l'import la elimina
mentre la revisione è aperta: «Questa attività non è più disponibile nell'archivio.»
con «Torna al Percorso»; non aprire un'altra attività al suo posto.

Blocco finale «I tuoi progressi»:
«I progressi restano in questo browser. Non si sincronizzano e possono andare persi se cancelli i dati del sito.»
Azioni «Scarica i progressi» → esportazione esistente; «Importa un file dei progressi»
→ controllo di importazione esistente in Info, con focus sul controllo;
«Fonti e difetti dichiarati» → sezione pertinente di Info.

## 4. Primo ingresso: dalla vetrina alla prima risposta

```text
Vetrina: collegamento esistente a /app ─┐
Apertura diretta di /app ───────────────┴→ caricamento banca e archivio
  ├─ errore → stato esplicito e azioni del §7
  └─ dati leggibili → Percorso: proposta + scelta libera + importazione
       ├─ Inizia l'attività → prima domanda → risposta → riscontro
       ├─ Scegli un'attività → porte Quiz / Carteggio / argomento / simulazione
       ├─ Come funziona → spiegazione breve → ritorno alla stessa proposta
       └─ Importa → Info / importazione → Percorso ricalcolato, nessun reset
```

Non cambiare `site/index.html`: il collegamento esistente ad `/app` è il
confine della vetrina. L'apertura diretta riceve le stesse informazioni utili.
Un ingresso diretto già supportato verso un'altra vista non viene deviato in
un'accoglienza obbligatoria. Non introdurre nuovi URL profondi in quest'area.

«Come funziona» apre un pannello richiudibile, disponibile anche al ritorno
nel Percorso e tramite un link in Info. Contenuto esatto:

> **Come funziona Rotta Giusta**
>
> Nei quiz scegli una risposta e vedi quella ufficiale dopo ogni domanda.
> Nel carteggio svolgi gli esercizi sulla carta e valuti il risultato confrontandolo con quello ufficiale.
> Il sito affianca la scuola o il manuale: qui trovi esercizi e riscontri, non un corso completo.
> Non serve un account. Le risposte restano in questo browser; puoi scaricarle in un file.

Chiusura «Torna al Percorso», oppure Esc, con ripristino del focus. Il pannello
non richiede conferma di lettura e non registra completamenti. In caso di
salvataggio fallito, sostituire la sua ultima frase con il testo del §7.

**Posto per B:** separare nel flusso la risoluzione della destinazione dalla
preparazione della proposta. Il futuro passo sull'ambito si inserirà lì, dopo
l'ingresso e prima della proposta. In A quel passo viene saltato: niente
selettore nascosto, campo `ambito` precompilato, preferenza salvata, riga
nell'archivio o opzione non servita. Non confondere futuro ambito di patente
con banca base/vela. La scheda iniziale dichiara «Quiz base»; chi vuole vela
entra in Quiz, dove la sceglie prima dell'avvio.

## 5. Prima attività: quantità, comportamento, testi e conclusione

### 5.1 Scheda prima dell'avvio

Etichetta di ambito in testo normale: «Quiz base».
Titolo: «Comincia con i quiz base».
Testo: «Una breve attività per cominciare. Vedrai la risposta ufficiale dopo ogni domanda.»
Quantità: «{N} domande», oppure «1 domanda».
Garanzia ordinaria: **«Ti fermi quando vuoi, e quello che hai risposto resta.»**
Azione principale: **«Inizia l'attività»**.
Azione secondaria, visibile senza scorrere: **«Scegli un'attività»**.
Altre porte: «Come funziona»; «Hai già un file dei progressi? Importalo».

Aiuto «Perché queste domande?»:
«È una selezione di quiz base per iniziare a usare il sito. Non copre tutti gli argomenti e non misura la tua preparazione.»
Niente promessa che la lista tocchi un numero minimo di temi: è la lista del
motore. Nessun «test iniziale» e nessuna modalità dimostrativa non registrata.

### 5.2 Contratto di selezione e snapshot

Per ogni aggiornamento del Percorso, con banca e archivio leggibili:

```js
const base = E.traccia(banca, prog, oggi, 'base', scadenzaPiano, inizio);
const primaBase = base.risposte === 0;
const scelta = E.mirata(banca, prog, oggi, {
  n: primaBase ? 10 : 25,
  pesi: meta.pesi_esame,
  kind: 'base',
  esame: dataEsame
});
// Un solo snapshot in memoria: scelta, lista = scelta.map(x => x.it),
// perche per id, primaBase e relativo contesto di origine.
// N = lista.length; click => apri(lista, 'mirata', { perche, ...contesto }).
```

`n` è un tetto, non un conteggio della banca. Non fare una seconda chiamata
al click. Un aggiornamento dei dati o della data invalida **insieme** lista,
numero e motivazione; durante il runner la lista rimane congelata. Un doppio
click non avvia due runner. I filtri di Quiz, inclusi «solo mai fatte», figure
e argomenti, non restringono di nascosto questa Mirata.

La prima lista porta un contesto temporaneo `primaBase` e origine Percorso,
separato dal nome persistito della modalità, che resta `mirata`. Non inventare
una modalità `onboarding`, non salvare `S.rotta` o la lista in localStorage.
Una prima risposta chiude la condizione «nessuna risposta base» solo per la
**prossima** proposta: non trasforma in corsa la lista da 10 in una da 25.

### 5.3 Dalla prima domanda al riscontro

Usare il runner esistente, con domanda, figura ingrandibile, risposte, note
prima/dopo e correzione ufficiale. Il primo aiuto inline, solo per questo
avvio, è: «Tocca una risposta per vedere quella ufficiale.» Il tocco registra
la risposta secondo il comportamento attuale; non aggiungere «Conferma».
Da tastiera rimangono disponibili i controlli esistenti.

Per la prima attività l'avanzamento automatico è **spento soltanto nel runner
corrente**, senza riscrivere la preferenza salvata: il nuovo utente deve poter
leggere il riscontro. Pulsante «Prossima domanda», e dopo l'ultima «Vedi il
riepilogo». Conservare le note e i tag di errore esistenti. Non promettere una
spiegazione didattica dove c'è soltanto la risposta ufficiale.

Azione di uscita durante questa attività: «Termina l'attività». Con almeno una
risposta apre il riepilogo parziale; con zero risposte torna al Percorso senza
salvare righe o fabbricare una sessione. Non marcare le domande saltate come
errori. Se il browser viene chiuso, restano solo le risposte davvero salvate:
alla riapertura nessuna promessa di recuperare la lista e la posizione.

### 5.4 Riepilogo della prima attività: specifica minima per l'area 1

Si applica soltanto al contesto temporaneo di prima attività, anche se terminata
prima di N. Riutilizzare `fine()`, `R.esiti`, `R.errori`, `E.esito()` e la
revisione già esistente; nessuna nuova statistica. **Non mostrare il grande
{percentuale}% attuale**, neppure con una spiegazione cautelativa sotto.

Ordine e stringhe:

1. Titolo completo: «Attività conclusa». Titolo parziale: «Ti sei fermato qui».
2. «Hai risposto a {A} domande su {N}.» Singolare: «Hai risposto a 1 domanda su {N}.»
3. Due valori: «Risposte corrette: {C}» e «Risposte da rivedere: {E}».
4. Con errori: titolo «Le risposte da rivedere» e frase
   «Qui trovi le domande a cui hai risposto in modo errato, con la tua risposta e quella ufficiale.»
   Seguono **gli errori di questa lista**, usando il dettaglio già raccolto dal
   runner, con domanda, note e confronto «La tua risposta» / «Risposta ufficiale».
5. Senza errori: «Tutte le risposte date in questa attività sono corrette.»
   Nessun giudizio su domande non risposte o sul resto della preparazione.
6. Con domande non affrontate nella lista: «Domande non affrontate in questa attività: {U}.»
   `U = N - A`, semplice avanzamento del runner, non nuova statistica di studio.
7. Se il caricamento è valido, fatto di copertura base da `traccia()` aggiornata:
   «Quiz base mai incontrati qui: {mai_visti}.» Non chiamarli «da studiare» e
   non usare `rimanenti`, che comprende anche i ripassi. Omettere la riga a zero.
8. Azione principale **«Torna al Percorso»**. Alternativa **«Scegli un'altra attività»**
   → scelta libera del Percorso. Frase finale: **«Puoi concludere qui.»**

`A`, `C`, `E` vengono dagli esiti della stessa lista; se manca una risposta
nell'archivio per un guasto, il riepilogo descrive ciò che è accaduto nel runner
ma **non lo presenta come salvato** e mantiene l'avviso del §7 davanti ai risultati.

Non aggiungere in area 1 il pulsante «Riprova questi {E}»: appartiene al ciclo
generale dell'area 3, che dovrà usare `erroriSessione()`. La lettura degli errori
è già possibile qui; il documento non promette una capacità futura come se
fosse presente. Il progetto dell'area 3 eredita queste stringhe e questi limiti,
ma decide il proprio ciclo generale. Non alterare adesso i riepiloghi delle
simulazioni, la loro soglia, il timer o la revisione generale dello storico.

## 6. Ritorno, motivazione e tempo

### 6.1 Una proposta, con un motivo vero

Titolo «Continua con i quiz base»; azione «Continua ad allenarti»; quantità dalla
lista effettiva. Testo comune: «Una nuova selezione a partire dalle risposte registrate qui.»
Poi mostrare una sola frase composta dai seguenti frammenti, presenti **solo**
se nella lista esiste il relativo stato di `E.classifica(prog[it.id])`:

- `da_ripassare`: «Rivedrai domande con una risposta da ripassare.»
- `mai_visto`: «Incontrerai domande a cui non hai ancora risposto qui.»
- `coperto`: «Ritroverai anche domande già risposte correttamente.»

Ordine dei frammenti come sopra. È presentazione degli stati esportati, non
una seconda regola di scelta. Non contare i «nuovi» sottraendo richiami e
conferme né interpretare le stringhe `perche` per inventare categorie: il codice
attuale lo fa, ma classifica e motivazione della selezione sono concetti diversi.
I motivi per quesito del motore rimangono associati alla lista nel runner.

Aiuto «Perché queste domande?»:
«La selezione usa le risposte registrate in questo browser e la distribuzione dei quesiti per tema. Non conosce lo studio che hai fatto altrove.»
Niente parole «debole» o «miglioramento» nella scheda; non trasferire qui i
motivi grezzi destinati al dettaglio di un singolo quesito.

Se la Mirata è vuota, applicare §3.2 anche quando `daAllenare().lista` è piena.
Non convertire il suggerimento in un ripasso casuale. La scelta autonoma rimane
aperta; nessun «Hai finito la preparazione».

### 6.2 Durata: un solo criterio di presentazione

Calcolare `ritmo()` sulle righe **quiz base** pertinenti, senza abbassare la
soglia né includere tecniche, Carteggio, Segnali o risultati delle prove `_t:'s'`.
La banca della proposta è base: non usare la velocità della vela per annunciarla.

```js
const r = E.ritmo(righeBase);
const stima = E.stimaImpegno(prog, lista.length, 1,
  r.affidabile ? { msPerDomanda: r.msPerDomanda } : {});
const mostraDurata = r.affidabile && stima.fonte === 'orologio';
```

**Scelta prudente esplicita:** in quest'area si mostra una durata dell'attività
solo con ritmo affidabile all'orologio. `stima.affidabile` può essere vero
anche per `cronometro`, che esclude la lettura del riscontro; quindi da solo
non basta. Le 30 risposte sono una soglia del contratto, non prova empirica di
precisione per ogni persona. Non esporre al pubblico questi dettagli tecnici.

- Se `mostraDurata` è falso: **nessuna durata**, neppure in tooltip o testo
  accessibile. Usare «Ti fermi quando vuoi, e quello che hai risposto resta.»
- Se vero e `minutiTotali > 1`: «Durata stimata: circa {minutiTotali} minuti.»
- Se il valore è 1: «Durata stimata: circa 1 minuto.»
- Se è 0 con lista non vuota: «Durata stimata: meno di un minuto.» È la resa
  dell'arrotondamento del motore, non un minimo imposto alla stima.
- Con durata visibile aggiungere «Puoi fermarti quando vuoi.»
- Durante salvataggio fallito sostituire sempre la garanzia di permanenza con
  «Puoi fermarti quando vuoi. Le ultime risposte potrebbero non essere salvate.»

Non calcolare intervalli, percentili, medie, tempo per quesito o fattori
correttivi in pagina. Non introdurre in area 1 sessioni a tempo fisso neppure
nell'inverso ammesso da R-TEMPO-04. Il timer di una simulazione è una condizione
della prova, non una stima dell'attività consigliata: resta nel suo ambiente.

### 6.3 Data d'esame: facoltativa e separata dalla proposta

Titolo «Hai una data d'esame?»; etichetta «Data d'esame (facoltativa)».
Senza data: «Puoi aggiungerla quando la conosci. Puoi allenarti anche senza una data.»
Con data: «Data d'esame: {data in italiano}.» Azione «Rimuovi la data» oltre
all'input modificabile. Nessun conto alla rovescia dominante.

Preservare `calcolaDate()` e la sua data di chiusura quiz già esistente:
non inventare un nuovo piano né spostare la scadenza in questa area. Con
risposte base presenti, data futura e scadenza quiz non superata, usare i valori
di `traccia()` in un dettaglio richiudibile **«Quiz e data d'esame»**:

- «Traguardo dei quiz nel sito: {chiusura_quiz}. È fissato quattro giorni prima della data d'esame.»
- «Quesiti base ancora da esercitare: {rimanenti}.»
- «Quota indicativa fino al traguardo: {quota} quesiti al giorno.»
- «La quota riguarda i quiz base ancora da coprire; non misura la preparazione completa.»
- `verde`: «Copertura dei quiz in linea con il traguardo impostato.»
- `giallo`: «Copertura dei quiz poco sotto il traguardo previsto per oggi.»
- `rosso`: «Copertura dei quiz sotto il traguardo previsto per oggi.»
- `attesa`: «Il confronto con il traguardo non è disponibile.»

Il colore accompagna il testo, non lo sostituisce. Si legge `semaforo`, non lo
si ricalcola. Non usare la quota per dimensionare la lista da 10/25. Non
aggiungere minuti giornalieri in questa area. Senza data il dettaglio non c'è;
con archivio vuoto il dettaglio non mostra quote o semaforo e dice soltanto
«La data è facoltativa. I riscontri sui quiz compariranno dopo le prime risposte.»

Se la scadenza quiz è passata ma l'esame è futuro: «Il traguardo dei quiz impostato per {data} è passato. Puoi continuare ad allenarti.»
Se l'esame è oggi: «La data d'esame impostata è oggi. Puoi continuare ad allenarti.»
Se è passato: «La data d'esame impostata è passata. Puoi aggiornarla o rimuoverla.»
In questi tre casi niente quota compressa in un giorno e niente semaforo.
Con data non valida: «Inserisci una data valida oppure lascia il campo vuoto.»
Non alterare lo storico, non trattare la persona come promossa o bocciata.

## 7. Caricamento, salvataggio e offline: testi che prevalgono

| Condizione osservata | Testo esatto | Azione e comportamento |
|---|---|---|
| Caricamento in corso | «Caricamento delle attività…» | Proposta non avviabile finché banca e archivio non sono letti. Non disegnare zeri provvisori. |
| Banca non caricata | «Non riusciamo a caricare i quiz. Controlla la connessione e riprova.» | «Riprova» ripete il caricamento; Info rimane raggiungibile. Non promettere che la prima apertura con rete renda automaticamente tutto offline. |
| Archivio ordinario non leggibile, ripiego disponibile (`ARCH.nota`) | «Non riusciamo ad accedere all'archivio principale. Stiamo usando un archivio alternativo in questo browser: potresti non vedere tutte le risposte precedenti.» | «Controlla l'archivio» → Info. Mostrare i dati disponibili come tali, niente accoglienza che dichiari zero attività nella storia della persona. |
| Archivio non leggibile e nessun ripiego leggibile | «Non riusciamo a leggere i progressi in questo browser. Questo non significa che siano stati cancellati.» | «Riprova» / «Controlla l'archivio». Non iniziare un'attività sopra uno stato sconosciuto né offrire Azzera come rimedio. |
| Scrittura fallita | «Le ultime risposte potrebbero non essere salvate.» Poi: «Scarica i progressi prima di chiudere la pagina e controlla l'archivio.» | «Scarica i progressi» usa `esporta()`; «Controlla l'archivio» → Info. Avviso persistente e garanzia di permanenza sospesa. |
| Offline non pronto | «Il sito non è ancora pronto per l'uso senza rete.» | «Controlla l'offline» → sezione offline di Info. Non dire che le risposte non sono salvate se c'è solo questa condizione. |
| Carteggio non caricato | «Gli esercizi di carteggio non sono disponibili in questa apertura.» | «Apri Carteggio» rimane una porta verso il suo stato esplicito; non mostrare «nessun esercizio svolto». Nessun blocco dei quiz caricati. |

Avviso di scrittura prima delle attività e **visibile anche sopra runner e
revisione**, senza coprire domanda o controlli. Stato sintetico nell'intestazione:
«Salvataggio da controllare»; per il solo offline «Offline da completare».
Con entrambi si mostrano entrambi, in quest'ordine. Non spegnere il pallino
quando si legge Info e non usare solo un toast a scadenza. Le etichette di
stato aprono Info senza perdere lo stato del runner ancora in memoria.

**Trappola osservata nel codice:** `ARCH.carica()` ripiega su
`LS.get('archivio', [])`, che può mascherare una lettura non riuscita come lista
vuota. Per distinguere gli stati sopra, nell'implementazione serve un esito
esplicito di caricamento del ripiego (assente / letto / errore), in memoria.
È gestione I/O di `app.html`, non calcolo del motore: leggere il ripiego con
try/catch esplicito, distinguere chiave assente da errore o JSON invalido,
senza cambiare chiavi, schema, migrazioni o scritture. Se non si completa questo
segnale, lo stato di errore va dichiarato; non fingere di aver verificato
l'archivio vuoto. I nuovi casi di guasto richiedono controlli coordinati con
chi possiede i test prima di considerare implementata l'area.

## 8. Tipografia e disposizione da realizzare

Nessun asset nuovo e nessuna dipendenza. Riutilizzare token, icone e immagini
presenti; le immagini nautiche restano decorative (`alt=""`). La grande scena
non precede l'azione e su telefono può essere omessa. Nessuna scritta dentro
immagini. Spaziatura e ordine devono funzionare anche senza illustrazioni.

| Selettore / uso | Decisione vincolante | Eccezione da rimuovere dopo la correzione |
|---|---|---|
| `.brand-tag` | Conservare «STUDIA. NAVIGA. SUPERA.» a **11 px**, interlinea 1,35 e spaziatura lettere 0,5 px; consentire il normale spazio nell'intestazione. Mai 6 px sul telefono. | Entrambe le righe 8 e 6 px. |
| `.eyebrow` generale | **12 px**, interlinea 1,4, niente spaziatura eccessiva. Adeguare la regola condivisa, preservando i contenuti fuori Percorso. | Riga 10 px; non rinviarla all'area 2. |
| `.rotta-intro .eyebrow` | Eliminare l'etichetta e la sua regola: «Il tuo percorso» basta. | Riga 9 px. |
| `.recommend-card .eyebrow` | Sostituire con la sola etichetta informativa «Quiz base», **14 px**, senza stile promozionale né regola sotto soglia. | Riga 9 px. |
| `.cart-route-card small` | Testo sul confronto/autovalutazione a **14 px**, interlinea 1,5, anche sotto 650 px. È necessario per scegliere l'attività. | Riga 10 px. |
| `.progress-stat span` | Etichette a **13 px**, interlinea 1,5, senza `<br>` imposti per stringerle. | Riga 10 px. |

Set della schermata: titolo 28 px sul telefono / 36 px desktop; titoli di
sezione 22/24 px; corpo e pulsanti 16 px; testo di supporto almeno 14 px.
Gli 11 px sono l'eccezione ammessa per il payoff, non la misura del corpo.
Testi e controlli possono andare a capo: non ridurre il font per farli entrare.

Telefono: colonna unica, margini 16 px, spazio 16 px fra blocchi; barra esistente
con quattro parole intere e spazio finale perché non copra contenuti. Desktop:
contenitore massimo 1120 px; proposta e Carteggio affiancabili, contenuti
successivi a tutta larghezza. Niente altezza fissa delle schede.

A **375 × 812**, stato ordinario e testo al 100%, «Inizia l'attività» e «Scegli
un'attività» devono essere entrambi visibili senza scroll o menu. Ridurre
illustrazione e spazio decorativo, non testo. In presenza di un guasto prevale
la leggibilità dell'avviso: l'azione può scendere sotto la piega. A zoom 200%
si ammette scorrimento verticale, mai troncamento o perdita di controlli.
Obiettivo di progetto: controlli almeno 44 × 44 px, focus visibile, contrasto
verificato sui token effettivi, pannelli chiudibili con Esc e ritorno del focus.
Non dichiarare conformità completa sulla sola base di queste misure.

Togliere **solo dopo la correzione** le sette righe relative ad `app.html`
nella tabella «Testi sotto gli 11 px». Lasciare la riga di `index.html` e quella
dell'alt generico del runner: appartengono ad altri lavori. Non rimuovere
selettivamente una dichiarazione dal CSS lasciando attiva una seconda regola
sotto soglia. Collaudare anche Quiz e Carteggio per l'effetto di `.eyebrow`.

## 9. Contratti di contatto e cose da non fare

| Ingresso / informazione | Fonte e parametri | Destinazione / limite |
|---|---|---|
| Prima attività | `mirata(..., {n:10, pesi, kind:'base', esame})` | Snapshot → runner Mirata; ritorno Percorso. |
| Attività al ritorno | Stessa chiamata con `n:25` | Nessuna nuova selezione al click. |
| Argomenti | Vista `quiz`, modalità `argomento`; i filtri visibili governano l'anteprima | `daAllenare(..., kind, extra)` nel flusso esistente, non al posto di Mirata. |
| Conteggi di lavoro | `daAllenare().daFare` | `lista.length` è la lista disponibile, **non** l'arretrato. Non aggiungere un conteggio qui se non serve. |
| Copertura | `traccia()` per banca, stati da `classifica()` | Mai sommare quiz e carteggio in una percentuale unica. |
| Data e ritmo | `traccia()`, `ritmo()`, `stimaImpegno()` come §6 | Non calcolare quote o durate in pagina. |
| Ultima attività | `sessioni(...,{limite:1})`, stesso ID | Revisione esistente; contesto di ritorno conservato. |
| Errori della prima lista | `R.errori`, `E.esito(R.esiti)` | Confronto già esistente nel riepilogo. |
| Ripetizione degli errori | Futuro `erroriSessione(righe, items, id)` | Area 3; mai sostituire con tutti gli errori dello storico. |
| Carteggio / tecniche / Segnali / simulazione | Porte esistenti | Nessuna selezione, soglia o ordine d'esame nuovo. |

Non eliminare chiamate al motore perché non servono alla scheda nuova: sono
anche di altre viste. Conservare in particolare `consigli`, `tendenza`, i
selettori di Carteggio e gli ingressi alle tecniche, alla revisione, alle
simulazioni e ai Segnali. Non resuscitare `peggiori()` come classifica sul
Percorso. Il vincolo di una proposta nel Percorso non autorizza a riprogettare
Progressi: eventuali incoerenze di quella destinazione restano all'area 5.

Il perimetro non richiede **nuovi export del motore**. Non promettere numeri
che qui non sono specificati; se un requisito ulteriore ne richiede uno,
registrare la dipendenza e chiedere l'export a chi possiede il motore.
Un'esigenza di test su `tests/` si coordina con Claude; non si aggira il hook.

## 10. Verifica dell'implementazione e prova documentale svolta qui

### 10.1 Casi obbligatori per chi implementa

Questa è una lista di accettazione da eseguire; **non** risultati del sito nuovo.

| Caso | Esito richiesto |
|---|---|
| Archivio vuoto, senza data | Orientamento, import, scelta libera; lista base effettiva fino a 10; nessuna durata, percentuale, quota o semaforo. |
| Archivio vuoto, con data | Stessa prima attività; la data non crea una diagnosi a zero né una quota da completare prima dell'avvio. |
| Solo Carteggio / solo vela / solo Segnali | Non cancellare o nascondere quelle attività; prima lista base fino a 10 e parole appropriate alla fonte. |
| 10 risposte, 7 corrette, 3 errori | Riepilogo 10/10, 7 corrette, 3 da rivedere, stessa lista di errori; al ritorno nuova Mirata fino a 25. |
| Stop dopo 3 risposte, di cui 1 errore | 3 su N, 2 corrette, 1 da rivedere; N−3 non affrontate, nessun errore attribuito alle restanti. |
| Stop prima della prima risposta | Zero scritture nuove e ritorno al Percorso, nessun riepilogo fittizio. |
| 29 / 30 risposte base temporizzate | Prima niente durata; dopo stima solo se ritmo affidabile. Ripetere con timestamp insufficienti e cronometro affidabile: ancora niente durata dell'attività. |
| Import fra visualizzazione e avvio | Lista, motivi e N aggiornati insieme. Ripiegamento esistente, nessuna duplicazione dello storico. |
| Banca esaurita / lista più corta / vuota | Numero reale; nessuna lista sostitutiva o messaggio di preparazione completata. |
| Data futura / scadenza quiz passata / oggi / passata / rimossa | Dettaglio e testi del §6.3, mai `null`, `NaN`, quota inventata o nuova dimensione della lista. |
| Lettura principale fallita e ripiego vuoto / malformato | Stato incerto o errore esplicito, mai falsa prima visita. Nessun reset. |
| Scrittura fallita durante il quiz e dopo l'ultima risposta | Avviso visibile sopra il runner, nel riepilogo e su ogni destinazione; esportazione disponibile, nessuna garanzia falsa. |
| Solo offline incompleto | Messaggio offline, nessuna falsa accusa di risposte perse; Info ancora raggiungibile. |
| Ricarica dopo stop e dopo completamento | Si rivedono risposte salvate; nessuna promessa di recuperare posizione e lista. |
| Visite a tutte le porte | Quiz, Carteggio, Progressi, Info, argomenti, simulazione, screening esistente, Segnali, tecniche e revisione ancora raggiungibili. |
| Telefono / desktop | Screenshot a 375 e 1280 px; focus, zoom, testi e controlli; verifica `getComputedStyle` dei sette difetti corretti e controllo delle altre viste per lo stile condiviso. |

Provare inoltre con una persona nuova: avviare senza aiuto, scegliere Carteggio
senza quiz preliminari, trovare l'importazione e spiegare cosa significano
7 corrette e 3 da rivedere. Registrare errori e aiuti richiesti. La verifica
con persone resta da svolgere e non si sostituisce con quattro suite verdi.

### 10.2 Evidenze di questa sessione di progetto

Precondizioni: cartella corretta, ramo `ui/main`, working tree pulito.
`HEAD..main` conteneva **16**, non 14 commit: i due aggiuntivi erano documentali
(`f2b8c8d`, `e984d74`). `git merge main` ha eseguito un fast-forward da
`252629f` a `e984d74`, senza commit di merge o conflitti. Nessun codice
applicativo è stato scritto da questa sessione.

Quattro suite sulla base allineata:

- `node --test tests/test_engine.mjs`: **121 casi, 120 passati, 1 skip previsto,
  0 fallimenti** (lo skip riguarda la vecchia copia UI di `daAllenare`, rimossa).
- `python3 tests/test_dati.py`: **199 verifiche passate**.
- `python3 tests/test_interfaccia.py`: **128 verifiche passate**.
- `python3 tests/test_specifica.py`: **210 verifiche passate**.

Eseguiti inoltre casi sintetici in memoria con la banca del repo e il motore
reale, data 12 settembre 2026, senza dati personali e senza scritture:

- Mirata iniziale: 10 quesiti; dopo 7 risposte corrette e 3 errate,
  `traccia()` restituisce 7 coperti, 3 da ripassare, **1.462 mai visti** e
  **1.465 rimanenti**. I due ultimi numeri non sono intercambiabili.
  `erroriSessione()` restituisce 3 errori; la proposta successiva ha 25 quesiti.
- Sessioni artificiali a intervalli di 20 secondi: con 29 risposte il ritmo
  è non affidabile; con 30 è affidabile e `stimaImpegno(...,25,1,...)`
  restituisce **8 minuti**, fonte `orologio`. È verifica del contratto,
  non validazione della durata per una persona.
- Tutti i quiz base corretti alla prima: `mirata()` restituisce **0**,
  mentre `daAllenare()` restituisce **1.472** elementi con **daFare 0**.
  Da qui la scelta di non sostituire silenziosamente una lista vuota.

La futura implementazione chiude con collaudo visivo e funzionale, quattro
suite verdi, rimozione delle sole eccezioni effettivamente corrette, CHANGELOG
additivo e un commit con trailer. Nessun bump, tag, push o modifica alla vetrina
è parte di questa consegna documentale.
