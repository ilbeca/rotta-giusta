# Idee dopo gli account — il brainstorming

**Aperto il 3 ottobre 2026**, sessione P-59, con l'autore davanti. Prodotto di
riferimento: la **v0.29.0** pubblicata, più P-60 su `main` (via l'offline e il
passaggio dell'archivio di prima, ADR-005); P-61, la pagina, è da fare. *Al 4
ottobre P-61 è fuso su `main` (`6ad7342`) e pubblicato con la **v0.30.0**
(`decdf76`), verificata in linea dalla regia (CHANGELOG, «Verificato — la
v0.30.0, in linea»): niente offline, e la versione nuova arriva alla prima
ricarica.*

**Che cos'è.** La casella BRAINSTORM del ciclo di `dev-standards`. **Niente qui
è deciso**: sono idee, con le domande che le rendono chiare e i costi che si
vedono già. Le smista la regia, dopo, in quattro mucchi — decisioni
dell'autore, ricerche, lavoro di Claude su `main`, lavoro di ChatGPT su
`ui/main` —; una decisione presa non resta qui, va nella specifica con la sua
data.

**Il file unico delle idee, dal 17 ottobre 2026.** Deciso dall'autore: le idee
per le prossime release stanno **qui, e in nessun file nuovo**. Ogni sessione
di brainstorming aggiunge in fondo una sezione sua, con la data, e le sue righe
nell'indice. Il nome resta «dopo gli account» perché altri documenti lo
citano: non è più una descrizione, è un indirizzo.

**Penna.** File **neutro**: lo toccano tutti. Si scrive mentre si discute, non
alla fine, perché la chat non sopravvive alla sessione.

**Chi propone.** Ogni idea dice da dove viene: **[autore]**, **[Claude]**, o
**[regia]** se arrivava già scritta nel prompt. Dentro un'idea dell'autore, le
osservazioni di Claude stanno sotto «La posizione di Claude».

**Nota dell'autore, 4 ottobre 2026 — andare oltre.** «In questa sessione
dobbiamo andare oltre a quello che c'è scritto in filosofia o negli ADR: stiamo
discutendo funzionalità nuove, e puntare anche altrove sarà necessario.» Quindi
in questo file **filosofia, ADR e Vincoli non sono un limite**: la riga
«Promesse che tocca» di ogni idea dice **che cosa andrebbe riscritto** se l'idea
passa, non che l'idea è vietata. Le riscritture le fa poi chi ne ha la penna,
con la decisione dell'autore.

**La forma di ogni idea**, come la chiede P-59: il problema; per quale delle tre
persone del §1 della specifica (*chi comincia da zero*, *chi è già in
formazione*, *chi ripassa sotto esame*); che cosa cambia per chi studia; quale
promessa tocca; che cosa motore e server sanno già e che cosa no; quanto è
grande, a occhio; i rischi, il guasto muto per primo; le decisioni dell'autore.
Più, finché è in discussione, **le domande aperte di questa sessione**. Un'idea
scartata resta scritta, con il perché.

**Grandezza a occhio:** S = una sessione; M = due-tre sessioni, un lato solo;
L = più sessioni, motore **e** interfaccia, con un progetto prima; XL = un
lavoro che dura settimane e cambia che cosa il sito *è*.

---

## Indice

| # | Idea | Da | Stato |
|---|---|---|---|
| I-01 | Una Home che mostra il sito, prima di chiedere niente | autore | discussa: la Home è `/`, menu da rifare |
| I-02 | Un quiz d'esame subito, senza domande | autore | discussa: simulazione completa con il timer |
| I-03 | Far vedere che cosa dà l'account | autore | discussa: cinque sezioni, extra con l'account |
| I-04 | Un onboarding più ricco: età, livello, tempo, durata suggerita | autore | discussa: solo la data; il tempo si suggerisce |
| I-05 | Un test d'ingresso, un percorso, e controlli periodici che lo correggono | autore | discussa: mappa, ricalcolata, controlli dal motore |
| I-06 | Quattro stati per quesito invece di tre | autore | discussa: cinque stati, regole date |
| I-07 | Due tag invece di tre: «non lo sapevo» e «svista» | autore | discussa: due tag, Calcolo in Svista |
| I-08 | Il browser: gli standard di oggi, e niente doppia ricarica | autore | doppia ricarica tolta con la v0.30.0; il resto da misurare |
| I-09 | Il collaudo con utenti simulati | autore | discussa: giri lunghi e agenti esplorativi |
| I-10 | La modalità apprendimento: perché è giusta, perché le altre no | autore | discussa: dopo ogni risposta, verifica l'autore, solo quiz |
| I-11 | Le donazioni | regia | sì dell'autore, dopo il parere |
| I-12 | Una stima del risultato d'esame | autore | discussa: risposte date, livello 2 o 3 sospeso |
| I-13 | Home, cruscotto e una pagina sola per Percorso e Progressi | autore e Claude | superata da I-18 nella struttura; il cruscotto resta |
| I-14 | Il test d'ingresso: perché farlo, e come non farlo pesare | autore | discussa: la prima simulazione fa da test |
| I-15 | La costanza, detta: una gamification leggera | autore | sì dell'autore |
| I-16 | Misurare se le spiegazioni aiutano | autore e ChatGPT | sì dell'autore al metodo |
| I-17 | I segnalibri | Claude, da GreenWay | sì dell'autore |
| I-18 | Il menu rifatto da zero | Claude e un'altra sessione | sì dell'autore: Home · Allenati · Esame · Progressi |
| N-01 | «Ero sicuro / avevo un dubbio» | ChatGPT | sì dell'autore |
| N-02 | La raccolta dei dubbi | ChatGPT | non scelta il 4 ottobre |
| N-03 | La ripresa dopo un'assenza, e «hai concluso» | ChatGPT | sì dell'autore |
| N-04 | Pagine pubbliche per argomento | ChatGPT | non scelta il 4 ottobre |
| C-01 | Il candidato che ha già la patente entro 12 miglia | Claude | sì dell'autore |
| C-02 | Spiegare l'esame a chi comincia da zero | Claude | sì dell'autore |
| C-03 | «Questo quesito non torna»: un modo di segnalarlo | Claude | sì dell'autore; indirizzo da scegliere |
| I-19 | Il miglioramento continuo: la misura come quinto passo del ciclo | autore e Claude | sì dell'autore, prossima release (17 ottobre) |
| I-20 | La classe: la scuola nautica e l'istruttore dentro il sito | autore e Claude | sospesa: l'autore la propone alle scuole |
| I-21 | Una casella per le segnalazioni | Claude | sì dell'autore; casella da creare |
| I-22 | La lettura da fuori: chi non sa niente del progetto, come controllo ricorrente | autore e Claude | prima prova fatta il 20 ottobre; il metodo è da decidere |
| I-23 | Che cosa ha trovato la prima lettura da fuori | Claude, dai lettori | da smistare: un difetto grave, poi testi |
| I-24 | La lettura da fuori di ChatGPT: domanda, Avanti e fonti sul telefono | ChatGPT | osservata e misurata; nessuna correzione |
| I-25 | La lettura da fuori di ChatGPT: comprensione e parole | ChatGPT | cinque lettori, 45 risposte; riscritture proposte |
| I-26 | La lettura da fuori di ChatGPT: metodo e confronto | ChatGPT | proposta per le verifiche, nessuna regola adottata |
| I-27 | Le regole dai buoni standard, e l'audit delle schermate | autore e Claude | in corso dal 21 ottobre: regole e audit della Home |

**Le decisioni prese, in una riga ciascuna, sono in fondo al file: «Le decisioni
di P-59»; quelle del 17 ottobre in «Il miglioramento continuo».** Le schede qui
sotto raccontano come ci si è arrivati, e dove una scheda e quella sezione non
coincidono vale la sezione.

---

## I concorrenti, guardati il 3 ottobre 2026

L'autore ha indicato tre siti, «molto migliori e più gradevoli di noi … più
eleganti, chiari, semplici», chiedendo che cosa prendere senza che si capisca
che abbiamo copiato. Guardati da Claude nel browser della sessione, a 375 px e
su desktop, senza registrarsi, con i cookie non essenziali rifiutati.

### Che cosa fanno

**Nauticalize** — <https://nauticalize.com/quiz/#/esame/senza-limiti>. Gratis,
senza registrazione, con un magazine, un manuale e una guida alla patente
accanto ai quiz.
- In cima, una riga di fonti: «Banche DD 131/2022 e DD 62/2025 · Procedura DD
  199/2026» (vedi «Trovato», sotto).
- Tre passi numerati, grandi: *Studia* (per argomento, «libero, senza
  registrazione») · *Simula l'esame* · *Ripassa gli errori*, quest'ultimo
  sbiadito con «si sblocca dopo le prime risposte».
- **La simulazione è un elenco di prove**, una per riga, ognuna con le sue
  condizioni in una frase: «20 domande in 30 minuti · soglia 16/20». Sotto
  «Senza limiti» scrive: «Stesso quiz base dell'entro 12 miglia: cambia solo il
  carteggio». Un tocco e la prova parte, senza altre domande.
- **Il runner della simulazione**: intestazione fissa «Domanda 1 di 20» con il
  timer; una **griglia 1–20** per saltare fra le domande e tornare indietro;
  «Prossima domanda» e «Consegna e vedi il risultato» sempre visibili;
  «**Segnala un problema**» sotto ogni domanda; all'uscita «Vuoi davvero
  uscire? Uscendo abbandoni questa prova senza risultato».
- Le **pagine per tema** sono pagine statiche, pensate per i motori di ricerca:
  «120 domande ufficiali spiegate», «Aggiornato il 23 settembre 2026», tre
  domande d'esame **con spiegazione**, le domande frequenti, il rimando a un
  capitolo del manuale, un PDF con le spiegazioni.
- Senza account tiene nel browser le prove recenti, per non ripetere le stesse
  domande (`localStorage`, `nqn_recent_exams_v1`, letto il 3 ottobre).
- Tipografia grande e condensata, molto spazio bianco, due colori.

**Quiz Patente Nautica** — <https://www.quizpatentenautica.com>. A pagamento:
3 giorni gratis con 20 domande, poi da 5,99 € al mese a ~30 € per sei mesi.
Google Analytics col consenso.
- La prima schermata: titolo, «Prova gratis», «Vedi piani», e **un portatile con
  dentro la schermata delle statistiche**: è l'«effetto Apple» che descrive
  l'autore.
- Promette «spiegazioni delle domande con IA» e la «previsione del risultato del
  tuo esame reale» con «modelli predittivi di intelligenza artificiale»; durata e
  soglia d'esame personalizzabili; esito in PDF o per email; un «test veloce con
  10 domande casuali»; la «scelta casuale "intelligente"» delle domande
  difficili.

**Navigo (9app)** — <https://www.9app.it/navigo/>. Un'app, gratis con una
versione Pro. Videocorsi 3D, carteggio, «Metodo 0 Errori» con «spiegazioni
interattive», recensioni a stelle, scuole nautiche partner, modalità scura.

### Perché sembrano migliori — la diagnosi di Claude

Non per le funzioni: Rotta Giusta ne ha quasi quante Nauticalize, e più dei
due a pagamento senza chiedere niente. **Per la densità.** Una schermata loro
fa **una** cosa, con **un** pulsante grande e i numeri detti in pochi caratteri
(«20 domande in 30 minuti · soglia 16/20»). La nostra prima schermata, guardata
a 375 px il 3 ottobre: il riquadro della proposta ha «Inizia l'attività», «Scegli
un'attività», «Come funziona», «Hai già un file dei progressi? Importalo»,
«Perché queste domande?» — cinque azioni in un riquadro —; più giù, «Apri Quiz»
e «Apri Carteggio» compaiono due volte; e ogni blocco ha due-tre frasi di
spiegazione. Ogni frase è vera e ha un motivo nella specifica; tutte insieme
sono rumore. **Il difetto è la somma, non un pezzo.**

### Che cosa prendere: l'idea, non la forma

Le idee e gli schemi d'uso non sono di nessuno; i testi, la grafica, gli
elementi riconoscibili sì. Elenco, con l'idea del nostro file a cui si lega:

| Da loro | Che cosa prendiamo | Lega a |
|---|---|---|
| Nauticalize, l'elenco delle prove | La simulazione come elenco di prove, ognuna con le condizioni in una riga, un tocco e parte | I-02 |
| Nauticalize, «Stesso quiz base dell'entro 12» | Dire chiaramente che il quiz base è lo stesso, e che per noi cambia il carteggio — risponde alla domanda delle 12 miglia senza fare domande | I-02, C-01 |
| Nauticalize, griglia 1–20 | **Da verificare prima:** se all'esame vero si torna indietro fra le domande. Se sì, la nostra simulazione dovrebbe permetterlo (è un fatto del decreto o della procedura, non un gusto); se no, no | I-02, Trovato |
| Nauticalize, «Segnala un problema» | Un modo di segnalare un quesito | C-03 |
| Nauticalize, tre passi con il terzo «si sblocca» | Mostrare che cosa arriverà, senza nasconderlo: per noi, «Progressi» con l'account | I-03 |
| Nauticalize, pagine per tema con data | Pagine statiche per tema, trovabili dai motori di ricerca, con «aggiornato il» e i nostri difetti dichiarati | I-01, I-10 |
| Nauticalize e QPN, spiegazioni | La modalità apprendimento c'è già altrove: **non ci differenzia**, la fa chiunque. Ci differenzia farla **onesta** (verificata, con fonte, dichiarata nostra) | I-10 |
| QPN, il portatile con la schermata | Le schermate nella Home | I-01 |
| QPN, «test veloce con 10 domande» | Abbiamo la Mirata da 10; manca il nome semplice | I-02 |
| Tutti, una cosa per schermata | **La regola più importante:** una schermata, un'azione principale, i numeri in una riga | I-01 |

### Che cosa non prendere, e perché

- ~~**La «previsione del risultato del tuo esame reale»** (QPN)~~ — *spostata
  il 3 ottobre 2026 in un'idea sua, I-12: l'autore vuole rivedere la filosofia su
  questo punto.* Il testo di prima: la filosofia lo esclude per nome — «"supera
  l'esame con noi" non lo diciamo, perché non sappiamo che cosa studi fuori da
  questo sito» —, e il §4.6: il motore non lo sa.
- **Durata e soglia d'esame personalizzabili** (QPN): chi studia sceglie lui
  quanto dura la prova (per esempio 40 minuti invece di 30) e quante risposte
  esatte servono per «superarla» (per esempio il 70 % invece di 16 su 20). Una
  prova così si chiama simulazione ma non simula l'esame: il decreto fissa 20
  domande in 30 minuti con al più 4 errori (DM 323/2021, art. 6), e un
  «superata» con condizioni più morbide è un verde che non misura niente. Un
  allenamento a tempo, più lungo o più breve, va bene, se si chiama
  allenamento e non dice «superata»; e lo abbiamo già (Quiz per argomento).
- **Le recensioni a stelle e i partner** (Navigo): non ne abbiamo, e non se ne
  scrivono. Raccoglierne di vere, con il consenso, è un'idea per dopo.
- ~~**La spiegazione «con IA» senza revisione** (QPN): è il rischio di I-10, messo
  in Home come pregio.~~ — *corretto il 4 ottobre 2026, dopo il confronto
  con ChatGPT:* dalle pagine pubbliche **non si sa** se le loro spiegazioni
  siano riviste; il giudizio era più forte dell'evidenza. Resta vero per noi:
  una spiegazione scritta da un modello e non rivista non si pubblica (I-10).
- **Il pagamento e la pubblicità**: il nostro argomento è il contrario —
  gratis, senza pubblicità, senza tracciamento, senza registrazione per provare.
  Va detto più forte, in prima riga, non in fondo.
- **Il righello della bussola «000°…360°»** sotto il titolo, la tipografia
  condensata e il bordeaux di Nauticalize: sono la loro faccia. Prenderli è
  esattamente ciò che si vede.

### Regole per non copiare

1. **Nessun testo**: si riscrive tutto da capo, con le nostre parole e il nostro
   tono; non si apre la loro pagina mentre si scrive la nostra.
2. **Nessun elemento grafico riconoscibile**: colori, caratteri, icone,
   decorazioni restano i nostri (navy, Manrope, il marchio).
3. **Le spiegazioni (I-10) in camera pulita**: chi le scrive non legge le loro.
   Il guardiano `strumenti/controlla.py` non vedrebbe un testo parafrasato; la
   regola sì.
4. **Prendere il «perché», non il «come»**: una prova in un tocco perché chi
   arriva vuole provare; la forma la decide l'area dell'interfaccia.

### Trovato guardando

- **«Procedura DD 199/2026» — cercato, e non ci riguarda.** Nauticalize cita
  un decreto direttoriale del 2026 sulla procedura d'esame. Sulla pagina del
  MIT, letta nel browser della sessione il 3 ottobre 2026
  (<https://www.mit.gov.it/normativa/decreto-dirigenziale-n-199-del-22042026>,
  pubblicata il 22/04/2026), il Decreto Dirigenziale n. 199 del 22/04/2026
  definisce le procedure di vigilanza e verifica del corso e della prova di
  idoneità **per la patente nautica di categoria D, tipo D1**, e il modulo
  della domanda. **Non tocca la categoria A**: composizione, tempi e soglie del
  nostro esame restano quelli del DM 323/2021. L'elenco della normativa sulle
  patenti nautiche del MIT
  (<https://www.mit.gov.it/temi/patenti-mezzi-abilitazioni/patenti-nautiche/normativa>,
  prima pagina, letta lo stesso giorno) non mostra atti nuovi sulla categoria A
  dopo il DD 131/2022; gli atti del 2025–2026 sono tutti sulla D1 (DD 62/2025,
  la sua banca di quesiti; DD 195/2025, il modello di patente; DD 31/2026 e DD
  199/2026, le procedure).
- **La patente D1 esiste, ed è un pubblico che non abbiamo.** Dal DD 62/2025 ha
  una banca sua, 792 quesiti (contati da Nauticalize, non da noi); si può
  prendere dai 16 anni (fonte secondaria, `ildiritto.it`; non letto nel
  decreto). Il nostro sito è la categoria A senza limiti. Allargare l'ambito è
  Q-AMBITO, e decide l'autore: è un'idea, non una decisione presa qui.
- **La griglia 1–20 di Nauticalize resta da verificare**: se all'esame vero si
  torna indietro fra le domande non lo dice nessuna delle fonti guardate qui.
- **La doppia ricarica, vista sul sito vero.** Nel browser della sessione, che
  aveva già visitato `rottagiusta.it`, la prima apertura di `/app` mostrava sotto
  la proposta «**Ti fermi quando vuoi, e quello che hai risposto resta.**» — una
  frase che senza account è falsa, e che **non è** nel `site/app.html` del tag
  `v0.29.0` (confrontato byte per byte con quello servito da statichost.eu: è
  identico, e la frase non c'è). La pagina era controllata dal service worker,
  con una cache sola, `rg-0.29.0`; lo script in esecuzione conteneva la frase,
  la cache e la rete no. Alla ricarica la frase giusta: «Senza account le
  risposte valgono solo per questa pagina». Come quel contenuto sia arrivato lì
  non è stato ricostruito. È il guasto che l'ADR-005 toglie, e una ragione per
  non rimandare P-61.
- **Nauticalize distingue «entro 12» e «senza limiti» solo nel carteggio**,
  come il decreto (art. 6 c. 2 del DM 323/2021, nella nostra ricerca §4.2): la
  domanda «entro o oltre 12 miglia» di I-02, per i quiz, non cambia niente.

### Un riferimento visivo: GreenWay (Dribbble), 4 ottobre 2026

L'autore ha aperto in Safari un *concept* su Dribbble, «GreenWay — Driving
Theory Tests Mobile App» di V. Alipov
(<https://dribbble.com/shots/26873346-GreenWay-Driving-Theory-Tests-Mobile-App>),
un'app per la teoria della patente di guida. È un progetto grafico, non un
prodotto in uso. Letto dal testo della pagina catturata (non dalle immagini):
schermate *Practice* con «Questions 326/820», un *Mock Exam*, e sotto «More to
explore» *Random Questions*, *Mistakes*, *Bookmarks*, *Marathon*; una pagina
*Theory* per argomento con «Seen 120 · 25 % · Not Seen 560» e una riga per tema
(«4/76 Questions», «Completed»); una barra con *Overview · Theory · Practice ·
My Progress*; illustrazioni 3D morbide, palette chiara e calda. Il testo
dell'autore del concept dice gli obiettivi: gerarchia chiara, conteggi
visti/non visti, barre di avanzamento, **e le *streak***.

**Che cosa ci dice (Claude).** Conferma la regola «una schermata, un'azione»
e il valore dei conteggi visti/non visti, che abbiamo già (i tre stati, ora
cinque). Porta un'idea nuova, i **segnalibri** («salva questo quesito per
dopo»), che non abbiamo: piccola, e dei soli registrati se deve durare. Le
*streak* no: la filosofia («niente gamification», appendice A) le esclude per
nome. Le illustrazioni 3D sono un linguaggio grafico, da valutare con la
regola «niente elementi riconoscibili di altri».

---

## Il confronto con ChatGPT, 4 ottobre 2026

L'autore ha fatto leggere questo file a ChatGPT, che ha guardato anche specifica,
filosofia, i concorrenti e la nostra pagina. Il suo parere, riassunto, e la
risposta di Claude punto per punto. Dove ChatGPT ha ragione, il testo sopra è
stato corretto con la data; dove il suo parere rimette in discussione una
**decisione dell'autore**, la riga lo dice, e decide l'autore.

**La sua sintesi:** separare il ridisegno dalle funzioni che devono ancora
dimostrare di essere affidabili; la previsione merita una ricerca a sé e non
deve rallentare il resto. La promessa da costruire: **«capisci gli errori, sai
che cosa esercitare adesso, e puoi vedere su quali dati si basa il
consiglio».** Claude è d'accordo con la sintesi e con la frase: è la versione
in avanti di «la verità prima della rassicurazione».

| # | ChatGPT | Claude | Esito |
|---|---|---|---|
| 1 | Dalle pagine di QPN non si deduce che le spiegazioni non siano riviste né che il modello non sia validato | Ha ragione: giudizi più forti dell'evidenza | **Corretto** nel testo |
| 2 | «I difetti dichiarati non si possono copiare» è eccessivo | Ha ragione; la frase è della specifica (§2.5) | **Corretto** qui; per la regia, nel §2.5 |
| 3 | Home, Percorso e Progressi rischiano di sembrare tre posti dove cercare «come sto andando». Responsabilità: Home = che cosa fare adesso; Percorso = perché, e come si inserisce; Progressi = evidenze e storico. Provare se il Percorso serve come voce o come approfondimento della Home | D'accordo. Con il cruscotto della Home (I-03), per chi ha fatto l'accesso Home e Percorso dicono quasi la stessa cosa. Proposta: il Percorso come **secondo livello della Home** («perché questa proposta» → la mappa), non come voce della barra; le voci tornano cinque con i Segnali | **Rimette in discussione** la decisione delle cinque/sei sezioni: decide l'autore |
| 4 | «Sei voci ci stanno» verifica lo spazio, non che la struttura si capisca | Ha ragione | Va provato con persone (I-09, Q-PROVE) |
| 5 | Accanto alla simulazione completa, tenere visibile l'allenamento breve | D'accordo; c'è già (10 domande) | Due porte, non una |
| 6 | Il primo vantaggio dell'account: «conservi ciò che fai e lo ritrovi sugli altri dispositivi» | D'accordo: è il vantaggio che esiste oggi | Va in cima alla tabella di I-03 |
| 7 | **Le spiegazioni anche senza account**: mostrano il valore nella prima attività | D'accordo, e c'è una ragione in più: l'ADR-004, condizione 3 — «senza account non si toglie niente apposta», e ai registrati restano solo le viste che **vivono di uno storico». Una spiegazione non vive di uno storico: toglierla a chi non è registrato è proprio la leva che la condizione vieta | **Rimette in discussione** «tutti gli extra con la registrazione» (I-03): decide l'autore |
| 8 | Le spiegazioni dipendono dalla modalità: subito nell'apprendimento, **dopo la consegna nella simulazione** | Ha ragione, ed era un errore di Claude: la simulazione **non corregge durante la prova** (§7.5, Vincolo) | **Corretto** in I-10 |
| 9 | Il pilota da 50 non solo sui più sbagliati: anche ambigui, con figura, con calcoli, divergenti dalla norma | D'accordo: un campione stratificato prova il metodo dove è difficile | **Corretto** in I-10 |
| 10 | Verificare il contenuto è metà: bisogna vedere se la spiegazione **aiuta** a rispondere dopo a un quesito collegato | D'accordo. Si misura confrontando, sulla stessa voce, chi ha visto la spiegazione e chi no — cioè un esperimento con due gruppi: una scelta di metodo e di privacy, per l'autore | Nuova decisione |
| 11 | La mappa del Percorso non diventi una sequenza obbligatoria | D'accordo: il «sei qui» orienta, non chiude porte | Annotato in I-05 |
| 12 | **Asimmetria**: «ok» con due giuste nello stesso momento, «sistemata» con due giorni diversi. E «giorni diversi» può essere cinque minuti a cavallo della mezzanotte | Ha ragione su tutte e due. Proposta: la stessa regola di distanza per «ok» e «sistemata», e la distanza in **ore**, non in date (per esempio almeno 12 ore fra le due risposte) | **Rimette in discussione** la regola decisa per I-06: decide l'autore |
| 13 | Gli stati descrivono i tentativi; «ok» non è «sai l'argomento per sempre». Il dettaglio ricco, il consiglio semplice | D'accordo (§7.4: copertura non è padronanza) | Annotato in I-06 |
| 14 | L'incertezza sui mai visti non rende prudente la stima da sola | Ha ragione | **Corretto** in I-12 |
| 15 | Dieci ripetizioni nella stessa mezz'ora non sono dieci osservazioni indipendenti | Ha ragione, e si concilia con «tutte le risposte» dell'autore: si contano **tutti i giorni**, ma **una osservazione per quesito per giorno** (o per finestra di ore). Chi ha studiato fra un giorno e l'altro sale; chi ripete nella stessa mezz'ora conta una volta | Proposta per l'autore |
| 16 | La difficoltà dagli altri utenti dipende da chi risponde e da quante volte ha ripetuto | Ha ragione. Proposta: la difficoltà di un quesito si stima sulle **prime risposte** di ciascuno, e su un modello che tenga conto della bravura di chi risponde (*item response theory*), non sulla percentuale grezza | Annotato in I-12 |
| 17 | Una formula esatta può poggiare su ipotesi sbagliate. **Validare**: prima i fatti; poi un modello sperimentale che predice le **simulazioni future** dalle sole risposte precedenti, e che deve battere una regola semplice (l'andamento delle ultime prove); poi gli esiti veri. Calibrazione: se dice 70, circa 7 su 10 | D'accordo, e migliora il piano di Claude: le simulazioni future degli utenti veri sono un banco di prova **reale**, disponibile prima degli esiti d'esame, e più onesto degli studenti finti, che restano per trovare le fragilità | **Adottato** in I-12 |
| 18 | «Com'è andata» separato per quiz base, vela, carteggio, pratica | D'accordo: la stima è dei quiz | Annotato in I-12 |
| 19 | Errori attesi sotto 4 non vuol dire probabilità alta di passare; il budget spiega le priorità, non è un semaforo | Ha ragione: nel grafico di prova, 3,65 errori attesi danno circa 71 su 100 (ricalcolato il 4 ottobre): sotto la soglia in media, e una prova su tre bocciata | Il budget resta, **senza** verde/rosso |
| 20 | Niente probabilità al centro della Home prima della validazione | D'accordo: la Home mostra i fatti (livello 1) finché il modello non ha passato la prova del punto 17 | Proposta per l'autore |
| 21 | Il tempo per rispondere non è il tempo per imparare: niente «ti bastano N minuti per essere pronto» | Ha ragione, ed era un eccesso in I-04: il motore misura il tempo di **esercizio**, non quello di **apprendimento** | **Corretto** in I-04 |
| 22 | Tag facoltativi; un errore di calcolo può essere una lacuna | Facoltativi lo sono già (saltabili). Accorpare «Calcolo» in «Svista» è reversibile: le righe vecchie restano `C`, si cambia solo come si leggono | Annotato in I-07 |
| 23 | Poche persone vere già prima del ridisegno | D'accordo (Q-PROVE) | Annotato in I-09 |
| 24 | C-01 disponibile e modificabile anche prima della registrazione | D'accordo; senza account vale per la pagina aperta (R-ACC-09: niente resta nel browser, nemmeno le preferenze) | Annotato in C-01 |
| 25 | C-02 e C-03 presto | D'accordo | Priorità |

**La priorità.** ChatGPT propone: (1) ingresso, navigazione, orientamento
all'esame; (2) spiegazioni verificate e un percorso che propone il passo
dopo; (3) classificazione più forte e modello predittivo sperimentale.
**Claude è d'accordo, con tre aggiunte:** P-61 (la doppia ricarica) prima di
tutto, perché è un guasto visto dal vivo; C-03, «Segnala», insieme alle
spiegazioni, perché ne è il canale di correzione; e **«com'è andata» presto**,
anche se il modello viene dopo: gli esiti d'esame arrivano mesi dopo le
risposte, e se si comincia a chiederli solo quando il modello è pronto, non ci
sarà niente con cui validarlo.

**Le decisioni che il confronto rimanda all'autore — risposte del 4 ottobre:**
1. Il Percorso come voce o secondo livello della Home (riga 3) — **in linea di
   massima Percorso e Progressi diventano una pagina sola**; menu e cruscotto
   vanno ripensati: I-13.
2. Le spiegazioni anche senza account (riga 7) — **sì, per tutti**.
3. La stessa regola di distanza per «ok» e «sistemata», in ore (riga 12) —
   **sì**: almeno 12 ore fra le due risposte giuste, per tutti e due. Sostituisce
   «in due giorni diversi» di I-06.
4. Una osservazione per quesito per giorno nella stima (riga 15) — **sì, ma va
   detto a chi studia**, e lì si può usare una gamification leggera: I-15.
5. Misurare l'effetto delle spiegazioni (riga 10) — **sì, ma l'autore non sa
   come**: una proposta di metodo in I-16.
6. La Home senza probabilità finché il modello non è validato (riga 20) —
   **sì; e la validazione si fa con gli studenti simulati** (I-09). Claude:
   d'accordo che si comincia da lì; ma uno studente finto è costruito da noi, e
   un modello che lo indovina dimostra che il modello capisce i nostri finti. Il
   controllo sulle **simulazioni future dei registrati** (riga 17) non costa
   niente in più, arriva da solo, ed è l'unico dei due fatto di persone vere.
   Proposta: i finti per trovare dove il modello si rompe, le simulazioni vere
   per dire se si può mostrare.

**E due richieste dell'autore, il 4 ottobre:**
- **La simulazione d'esame resta raggiungibile da subito, con un pulsante ben
  visibile**: «molte persone accederanno per fare la simulazione direttamente,
  e se le ostacoliamo e facciamo perdere troppo tempo chiuderanno il sito». È un
  vincolo del ridisegno: I-13.
- **I nomi «vetrina» e «palestra» si tolgono** (I-03).

---

## I-01 — Una Home che mostra il sito, prima di chiedere niente [autore]

**L'idea, con le parole dell'autore.** Uno «splash screen»: oggi la home è un
concentrato di pulsanti inorganico, le funzionalità non si capiscono e
l'utente si confonde. Una prima pagina con le schermate delle funzionalità,
come le pagine di Apple con gli iPhone che mostrano le app. E un pulsante che
porta subito ai quiz, perché chi arriva vuole fare un quiz subito, come sui
siti dei concorrenti (vedi I-02).

**Il problema.** Chi arriva non capisce che cosa può fare, e se ne va prima di
provarci.

**Per chi.** *Chi comincia da zero* soprattutto — §1: «la prima schermata non è
un cruscotto: è la risposta a "da dove comincio"». Anche *chi è già in
formazione*, che vuole partire in due tocchi.

**Che cosa cambia per chi studia.** Vede che cosa c'è — quiz, simulazione,
carteggio, mappa dei progressi, segnali — prima di sceglierlo, e ha **un
pulsante** che lo mette dentro un quiz.

**Promesse che tocca.** Nessun Vincolo. «Il sito dichiara i propri difetti» in
prima pagina (§2.5 della specifica) deve sopravvivere al ridisegno. ~~È l'unico
argomento che i concorrenti non possono copiare.~~ — *corretto il 4 ottobre,
dopo il confronto con ChatGPT: possono copiarlo. La frase viene dalla specifica
(§2.5), e la regia la deve rivedere lì. Il vantaggio non è l'idea ma la
continuità con cui la manteniamo (vedi «Il confronto con ChatGPT»).* «Nessuna risorsa di terzi»
(`test_nessuna_risorsa_di_terzi`): le schermate vanno servite da `site/`, non
da un servizio esterno.

**Che cosa c'è già.** Due pagine diverse, e conviene sapere quale delle due è
«la home»:

- **`/`, la Home di oggi** (`site/index.html`, dalla 0.22.0): titolo, tre passi
  «Studia / Mettiti alla prova / Simula», le dieci tessere degli argomenti
  contate dalla banca, «Che cosa non torna», «Un progetto aperto». Tre link a
  `/app`. Niente schermate.
- **`/app`, il Percorso** (`#v-oggi`): proposta, Quiz, Carteggio, ultima
  attività, «Scegli un'attività», allenamenti extra, data d'esame, progressi.
  Otto blocchi in una pagina sola: è probabilmente questo il «concentrato di
  pulsanti».

**Grandezza.** M se è la sola Home (HTML statico, schermate come immagini in
`site/`, nessun motore). L se si ridisegna anche il Percorso.

**Rischi.** *Guasto muto:* le schermate sono immagini, e un'immagine **non si
aggiorna da sola** quando la pagina cambia; fra tre rilasci la Home mostra
un sito che non c'è più, e niente lo dice. Una via: le schermate si rifanno da
uno script nel rilascio (il banco guida già Chrome e sa fare screenshot), e un
controllo confronta la loro data con quella della pagina. Poi: il peso — oggi
la Home è 29 KB; dieci schermate PNG possono essere 1–2 MB, sul telefono in
3G. Poi: le schermate devono mostrare **dati finti dichiarati**, non un account
vero (privacy).

**La posizione di Claude.** Sono d'accordo sul problema, e lo dicono anche i
documenti: l'appendice A della specifica nota che «il primo elemento della
prima schermata è un filtro che a chi comincia non serve». Distinguerei le due
pagine: la Home **mostra** (schermate, un pulsante), il Percorso **fa** (una
cosa proposta, il resto un tocco più in là). Il modello Apple funziona perché
ogni schermata ha **una** frase sotto; dieci schermate senza frase sono un
carosello, e i caroselli non li guarda nessuno oltre la prima slide.

**Decisioni per l'autore.** Quale delle due pagine; quante funzionalità in
Home; se la Home resta chiara e le altre sezioni scure (era aperto dalla
0.22.0, «Rimane aperto»).

**Risposto dall'autore, 3 ottobre 2026:** «la home» è **`/app`, «Il tuo
percorso»**, e «credo che tutti i menù andranno totalmente rivisti». Quindi
I-01 non è più solo una Home nuova: è il ridisegno del sito intero,
navigazione compresa — cioè **Q-NAV** (§10 della specifica, aperta, decide
l'autore) e un lavoro dell'interfaccia di misura L, con un progetto prima. La
regola presa dai concorrenti, una schermata e un'azione principale, ne è il
criterio. La Home con le schermate resta un pezzo a parte, più piccolo.

**Domande aperte (sessione).**
1. ~~«La home» è `/` o `/app`?~~ — `/app`, vedi sopra.
2. Hai in mente un sito concorrente preciso da guardare? Se sì, quale — lo
   guardo e scrivo che cosa fa, senza copiarne niente.
3. Il pulsante «fai un quiz» porta dentro un quiz **senza passare dal
   Percorso**?

---

## I-02 — Un quiz d'esame subito, senza domande [autore]

**L'idea.** Chi arriva può fare subito un quiz che simula la sessione d'esame,
senza domande, al massimo «entro o oltre 12 miglia».

**Il problema.** Il primo minuto decide se una persona resta (§7.1: «alla prima
apertura questa schermata decide se una persona resta»). Oggi dal `/` alla
prima domanda ci sono: un clic sulla Home, il Percorso, e «Inizia
l'attività» — che apre la Mirata da 10, **non** una simulazione.

**Per chi.** Tutte e tre, ma in modo diverso: *chi comincia da zero* vuole
vedere com'è l'esame; *chi ripassa* vuole sapere se lo passerebbe.

**Che cosa cambia per chi studia.** Un tocco, e ha davanti 20 domande in 30
minuti come all'esame, con l'esito alla fine.

**Promesse che tocca.** R-ACC-01 (si arriva al primo quesito senza
registrarsi): la rafforza. ADR-004, condizione 1: «senza account si dice che
non resta niente, prima di cominciare» — la frase deve restare anche nel
percorso più corto. La decisione dell'area 1 (ingresso diretto, prima attività
corta e non una diagnosi) va rivista: la prima attività diventerebbe una prova
da 20 con un esito, e la specifica del §7.1 dice che alla prima apertura si dà
«orientamento, non una diagnosi a zero».

**Che cosa c'è già.** Tutto il motore: `simulazione()`, `simulazioneVela()`, la
consegna, il riepilogo con l'esito (§7.5). Manca solo l'ingresso.

**Grandezza.** S per l'ingresso. Il resto è I-01 e la domanda delle 12 miglia
(C-01).

**Rischi.** *Guasto muto:* chi ha 30 minuti e non 20 domande in testa
abbandona a metà; il riepilogo parziale c'è (area 3), ma una simulazione
interrotta **non è** un esito, e non deve sembrarlo. Poi: un primo «non
superata» a chi comincia da zero può scoraggiare più di quanto informi — è
esattamente il motivo per cui l'area 1 aveva scelto una prima attività corta.

**La posizione di Claude.** L'ingresso diretto alla simulazione è economico e
giusto **come seconda porta**, accanto a «comincia da qui». Come unica porta
toglierebbe a chi comincia da zero l'orientamento che il §1 promette. Su «entro
o oltre 12 miglia» c'è una sorpresa del decreto, in C-01: la domanda giusta
forse non è quella.

**Decisioni per l'autore.** Se la simulazione è **la** prima attività o **una**
delle prime; se chiedere qualcosa prima (vedi C-01).

**Risposto dall'autore, 3 ottobre 2026:** **simulazione completa, con il
timer** — 20 domande in 30 minuti, come all'esame. Conseguenza da dire: chi
comincia da zero e la sceglie avrà quasi certamente un «non superata»; il
riepilogo deve dirlo come fatto e non come giudizio (R-UX-06, nessun voto sulla
preparazione), e offrire subito un seguito. Guardando Nauticalize, per i quiz la
domanda «entro o oltre 12 miglia» non serve: il quiz base è lo stesso (vedi
«Trovato guardando»).

**Domande aperte (sessione).**
1. ~~Completa o assaggio?~~ — completa, con il timer.
2. Base soltanto, o base + vela come all'esame?
3. Per «entro o oltre 12 miglia» intendi *quale patente stai prendendo*, o *se
   hai già la entro 12*? Cambiano cose diverse (C-01).

---

## I-03 — Far vedere che cosa dà l'account [autore]

**L'idea.** In qualche modo l'utente deve vedere le funzionalità che avrebbe
registrandosi: invogliarlo a registrarsi.

**Il problema.** Oggi l'invito sta **solo** nel riepilogo di un'attività
(R-ACC-03), e chi non finisce un'attività non lo vede mai.

**Per chi.** *Chi è già in formazione* e *chi ripassa*: sono quelli che hanno
qualcosa da perdere.

**Che cosa cambia per chi studia.** Sa prima che cosa ottiene con l'account —
Progressi, ripresa su un altro dispositivo, la bozza del carteggio.

**Promesse che tocca — è qui il nodo.**
- **ADR-004, condizione 2**: la registrazione si raccomanda «quando c'è qualcosa
  da perdere — la fine di un'attività — e non a ogni schermata». È una decisione,
  con un ADR.
- **R-ACC-03**, con il suo controllo: «in nessuna vista un invito, un modulo o
  una finestra d'account». Un invito in più nelle sezioni lo fa diventare
  rosso.
- **`docs/filosofia.md`**, «Non ti inganniamo mai»: «te lo diciamo quando
  serve, non a ogni pagina», e «i vantaggi che mostriamo sono quelli che
  esistono».

**Che cosa c'è già.** L'invito nel riepilogo, con i vantaggi veri, e «Continua
senza account» che lo chiude.

**Grandezza.** S nella Home; M nelle altre sezioni (un ADR, il controllo, i
testi).

**Rischi.** *Guasto muto:* un vantaggio promesso che non c'è — «riprendi
domani» quando una ricarica lo perde, o una funzione mostrata in Home che
il rilascio dopo cambia. Poi il rischio di prodotto: l'imbuto che diventa
insistenza, che è proprio ciò che la filosofia promette di non fare.

**La posizione di Claude.** C'è una via che non rompe niente: **la Home**
(`/`) non è una vista di `/app`, e lì una sezione «Con un account» che
mostra Progressi e la ripresa è descrizione del prodotto, non un invito a ogni
schermata. Lo stesso nel **Progressi senza account**, che già oggi deve dire
perché non c'è (R-ACC-04): lì mostrare *come sarebbe* — con dati finti
dichiarati — è la spiegazione, non una pressione. Tutto quello che va oltre
(un banner, un promemoria a metà quiz) chiede di riscrivere l'ADR-004, e lo
sconsiglio: la filosofia ne ha fatto una promessa pubblica.

**Decisioni per l'autore.** Se basta la Home più Progressi-senza-account, o
se si riapre l'ADR-004.

**Risposto dall'autore, 3 ottobre 2026 — la navigazione e l'invito.**
Le sezioni che l'autore vede necessarie:

1. **Home** — mostra le funzionalità «come Apple» (I-01), e anche qui un invito
   a registrarsi;
2. **Quiz**;
3. **Carteggio**;
4. **Percorso** — «che forza a registrarsi»: è dei soli registrati;
5. **Progressi**.

E i vantaggi: **tutte le funzionalità extra — i grafici, il monitoraggio dei
progressi, le stime — sono legate alla registrazione.** Da pensare insieme.

**Che cosa comporta (Claude).**
- È la risposta dell'autore a **Q-NAV** (§10 della specifica, «le destinazioni
  della barra»): cinque voci, sotto il limite di cinque che l'appendice A cita
  come pratica corrente. Fuori dalla barra restano da collocare **Segnali**, **Che
  tecnica serve?** e **Info** (oggi Info sta nell'intestazione).
- **Percorso dei soli registrati** regge l'ADR-004 se il Percorso diventa quello
  di I-05 — una guida costruita sulla tua storia —, perché la condizione 3 dice
  «ai registrati restano solo le viste che vivono di uno storico». **Non** lo
  regge se dietro la registrazione finisce un'attività: oggi il Percorso è anche
  la porta della prima attività, e quella porta deve spostarsi in Home o in Quiz.
  Senza account, il Percorso fa come Progressi oggi (R-ACC-04): dice che cosa
  sarebbe, con un esempio, e porta ad Accedi; non è una pagina vuota né un
  pulsante bloccato.
- **L'invito in Home** e **la porta del Percorso** sono due inviti fuori dal
  riepilogo: l'ADR-004, condizione 2, e R-ACC-03 vanno riscritti. La Home è la
  stessa schermata per tutti o cambia con l'accesso? Vedi la domanda 3.
- **«Forza» va detto con onestà**: la filosofia promette che i vantaggi mostrati
  sono quelli che esistono, e che le risposte non si tengono per nasconderne le
  misure. Senza account non si salva niente, quindi le misure non ci sono: non è
  un ricatto, è lo stesso argomento di Progressi.

**I vantaggi, prima stesura da discutere** — che cosa c'è con l'account e senza,
con le idee di oggi:

| | Senza account | Con l'account |
|---|---|---|
| Quiz, simulazione, carteggio, segnali, tecniche | tutto, fino al riepilogo e alla revisione | tutto |
| Le risposte | solo finché la pagina è aperta | salvate, su ogni dispositivo |
| Ripasso degli errori | quelli della pagina aperta | tutti, di sempre |
| La bozza del carteggio | si perde con una ricarica | regge una ricarica |
| Progressi: mappa, cinque stati (I-06), andamento | — | sì |
| La stima d'esame, ragnatela e budget degli errori (I-12) | — | sì |
| Il Percorso guidato (I-05) | — | sì |
| La data d'esame e i minuti al giorno (I-04) | per la pagina aperta | salvati, con il confronto |

**Domande aperte (sessione).**
1. ~~Dove l'invito?~~ — Home e Percorso, oltre al riepilogo.
2. ~~Quali vantaggi?~~ — gli extra legati alla registrazione; tabella sopra, da
   rivedere.
3. ~~La Home è la stessa per tutti?~~ — **no: per chi ha fatto l'accesso
   diventa un'altra cosa** (l'autore, 3 ottobre). Per «riepilogo» Claude
   intendeva **non** Progressi, ma un **cruscotto corto di oggi**: la stima in un
   numero, che cosa fare adesso, un pulsante. Progressi resta il dettaglio
   (mappa, stati, andamento, prove). Da confermare.
4. ~~Dove vanno Segnali, Tecniche, Info?~~ — **i Segnali sono una sezione a
   sé**; **«Che tecnica serve?» va dentro Carteggio** (l'autore, 3 ottobre).
   Info non detto: proposta di Claude, nell'intestazione come oggi. Le voci della
   barra diventano **sei** — Home, Quiz, Carteggio, Percorso, Progressi, Segnali
   — una più del limite che l'appendice A cita; a 375 px sette voci da 54 px
   stavano (§6.3), quindi sei ci stanno, ma va misurato con le etichette nuove.
   Il §6.3 resta: i Segnali, che non scrivono righe, non entrano nella mappa
   della copertura.
5. ~~La Home è `/` o `/app`?~~ — **la Home è la pagina `/` di oggi**, che
   cambia per chi ha fatto l'accesso (l'autore, 3 ottobre).

**E i nomi «palestra» e «vetrina» si dismettono** (l'autore, 3 e 4 ottobre):
«palestra» «non ha molto senso, è ridondante e non è in tema barche»; tutti e
due sono «un concetto vecchio, che crea solo confusione». Si usano i **nomi
delle sezioni**: Home, Quiz, Carteggio, Progressi, Segnali. Oggi «palestra» sta
nel `<title>` di `/app` («La palestra · Rotta Giusta») e nei testi della pagina;
tutti e due i nomi stanno in molti documenti (`AGENTS.md`, la specifica, la
skill, il CHANGELOG). Un nome nuovo per l'insieme non serve: il sito si chiama
Rotta Giusta. In questo file, dal 4 ottobre, sono già sostituiti; nei
documenti delle regole li sostituisce la regia, nella pagina l'interfaccia.

**Che cosa comporta la Home su `/` che cambia con l'accesso (Claude).**
- Oggi `/` e `/app` sono due pagine; con la Home su `/` e le altre sezioni in
  `/app`, la barra deve portare fra le due pagine, o le due diventano una. È una
  scelta di struttura per il progetto dell'interfaccia.
- **Come sa `/` che hai fatto l'accesso, senza chiedere al server per ogni
  visitatore?** Chiedere a `api.rottagiusta.it` da ogni visita della Home
  manderebbe al server l'IP di chiunque passi, anche di chi non si è mai
  registrato: un trattamento nuovo, da scrivere nell'informativa, e oggi R-ACC-09
  pretende «nessuna richiesta all'API» senza account. La via pulita: il browser
  sa già da solo se c'è una copia dell'account (`rg-account-<chiave>` in
  IndexedDB); solo allora la Home chiede al server. Chi non ha mai fatto
  l'accesso non manda niente a nessuno.
- `/` è la pagina che i motori di ricerca indicizzano: la versione per chi non è
  entrato resta quella che vedono loro.

---

## I-04 — Un onboarding più ricco: età, livello, tempo, durata suggerita [autore]

**L'idea.** Dopo la registrazione un onboarding che chiede l'età, la data
dell'esame, il livello di preparazione, il tempo disponibile ogni giorno, e
calcola una durata suggerita da dedicare ogni giorno ai test.

**Il problema.** Chi si registra non sa quanto studiare al giorno, né se ce la
fa per la data.

**Per chi.** *Chi ripassa sotto esame* (ha una data), *chi è in formazione*.
Per *chi comincia da zero* la data spesso non c'è (§2.4).

**Che cosa cambia per chi studia.** Riceve un numero: «N minuti al giorno fino
al …», e magari «con il tempo che hai, non basta».

**Promesse che tocca.**
- **Q-ONBOARD, chiusa il 1° ottobre 2026** dall'autore: l'onboarding chiede
  soltanto la data d'esame, facoltativa, e il sito non consiglia un piano di
  studio. «Si riapre se l'uso lo chiede.» Riaprirla è una decisione nuova, con il
  suo motivo.
- **R-TEMPO-03** (scoperto): «nessun selettore "quanto tempo hai?" dimensiona
  una sessione» — misurato che fra sessioni la durata per domanda varia di un
  fattore quattro. **R-TEMPO-04** ammette l'inverso.
- **L'età**: l'informativa e le condizioni dicono che l'account è per chi ha
  compiuto 18 anni. Chiedere **l'età** è un dato personale in più
  (minimizzazione, art. 5.1.c GDPR); chiedere **«hai 18 anni?»** no.
- **Livello di preparazione**: Punto 4 di `decisioni-aperte.md` e l'area 1, che
  hanno scelto l'ingresso diretto senza la domanda; e §4.6 — il motore **non sa
  che cosa hai studiato fuori dal sito**, e per decisione dell'8 settembre non
  lo chiede.

**Che cosa sanno già motore e server.** Molto più di quanto sembri:
`traccia()` dà già quota e giorni dalla data, `stimaImpegno()` dà già **minuti
al giorno** fino al traguardo, con la fonte dichiarata (orologio, cronometro,
ripiego), e `ritmo()` misura il tempo vero per domanda. Con la data, la pagina
scrive già la **quota in quesiti al giorno** («Quota indicativa fino al
traguardo: N quesiti al giorno», `site/app.html`, letto il 3 ottobre); i
**minuti** li annuncia solo per un'attività e solo con il ritmo affidabile
(area 1). **La durata suggerita è a un passo**: il motore ha già i pezzi;
quello che manca è dirla in minuti e il **confronto con il tempo che hai**.

**Grandezza.** S per «18 anni sì/no» e per mostrare meglio quello che il motore
già calcola. M per il tempo disponibile come confronto. L se il livello deve
cambiare la selezione (Punto 4, opzione B: una funzione nuova nel motore, con i
suoi test).

**Rischi.** *Guasto muto:* un numero di minuti che rassicura senza misurare —
«20 minuti al giorno bastano» calcolato con il ripiego di 15 s a domanda, prima
che ci siano 30 risposte misurate: è il semaforo verde a copertura zero, in
minuti. Poi: domande che non cambiano niente (Punto 4: «se la risposta non
cambia nulla, la domanda va rimossa»).

**La posizione di Claude.** Il pezzo con più valore e meno rischio è il
**confronto**: «hai detto 20 minuti; per arrivare alla data con tutto coperto
ne servono circa 45» — con la fonte del numero scritta, e nessun numero sotto
le soglie del §4.3. Non dimensiona una sessione, quindi non tocca R-TEMPO-03.
Sull'età terrei la dichiarazione dei 18 anni, che c'è già, e non chiederei
l'età. Sul livello, terrei la decisione dell'area 1: dopo dieci risposte il
motore sa più di quello che la persona dichiara.

**Decisioni per l'autore.** Riaprire Q-ONBOARD sì/no; età o solo «18 anni»; il
livello cambia la presentazione (A) o la selezione (B).

**Risposto dall'autore, 3 ottobre 2026.** **Età no. Livello no.** Il **tempo
al giorno non si chiede: si suggerisce**, e cresce con quanto si è impreparati —
chi è molto indietro rispetto alla data si vede proporre più minuti. Il
cruscotto della Home per chi ha fatto l'accesso (I-03) è approvato.

**Che cosa ne viene (Claude).** L'onboarding resta quello deciso il 1° ottobre
— **la sola data d'esame, facoltativa** —: Q-ONBOARD non si riapre. Il tempo è
un'**uscita** del motore, non una domanda. Si calcola da ciò che resta per
arrivare alla soglia entro la data — con la stima di I-12, i quesiti deboli,
incerti e mai visti, pesati dall'esame — e dal **ritmo misurato** di chi
studia. *Precisato il 4 ottobre (ChatGPT):* sono **minuti di esercizio**, non
di apprendimento — il motore misura quanto ci metti a rispondere, non quanto ti
serve per imparare —; quindi mai «ti bastano N minuti per essere pronto», ma
«per esercitarti su quello che resta, circa N minuti al giorno». Tre condizioni
già scritte nella specifica: senza data niente minuti
(R-STA-01); sotto le 30 risposte misurate nessuna durata annunciata, o il
ripiego dichiarato (R-TEMPO-01, R-TEMPO-02); e la parola è «circa», con la
fonte. Non dimensiona una sessione (R-TEMPO-03): dice quanto, non taglia.

**Domande aperte (sessione).**
1. ~~Perché l'età?~~ — non si chiede.
2. Il livello di preparazione, nella tua idea, cambia **che cosa ti proponiamo**
   o serve solo a te per sapere dove sei?
3. Il tempo disponibile: lo vuoi come vincolo («fammi sessioni da 20 minuti») o
   come confronto («ti basta / non ti basta»)?

---

## I-05 — Un test d'ingresso, un percorso, e controlli periodici che lo correggono [autore]

**L'idea.** Dopo l'onboarding, una serie di test per capire gli argomenti
deboli; da lì un percorso di pratica; e controlli periodici il cui risultato
modifica il percorso.

**Il problema.** Chi studia non sa da dove partire né quando ha finito un
argomento.

**Per chi.** *Chi comincia da zero* (da dove comincio) e *chi ripassa* (dove
sono ancora scoperto).

**Promesse che tocca.**
- **§4.4 della specifica**: «non esiste, in nessun punto del prodotto, una
  sessione prospettica: un obiettivo dichiarato in anticipo, con una dimensione
  e uno stato di avanzamento da riprendere. La linea da non passare è la
  persistenza.» Un **percorso salvato** passa quella linea.
- **R-ARCH-01 / §3.3**: una sola contabilità dello storico. Un percorso con uno
  stato suo («sei al passo 4 di 12») sarebbe una seconda contabilità, a meno che
  non sia **derivato** dalle righe come tutto il resto.
- **Q-ONBOARD**: «il sito non consiglia un piano di studio», perché un piano
  dovrebbe reggersi su quello che il motore non sa (Q-PROG, lo studio esterno,
  il tempo).
- **Filosofia**: «non promettiamo un risultato che non possiamo misurare».

**Che cosa c'è già, ed è tanto.** Il test d'ingresso esiste: **«Un giro tra gli
argomenti»**, `screening()`, *n* quesiti da ognuna delle 44 voci. Il percorso
che si adatta esiste: **la Mirata**, `mirata()`, che sceglie richiami,
esplorazione pesata sulla resa e conferme, **dallo storico, ogni volta**. Il
controllo periodico esiste: **la simulazione**. E «dove pesa di più adesso»,
`dovePesa()`, è la frase che dice su che cosa lavorare. Quello che **non** c'è è
il **racconto**: niente lega le tre cose in una sequenza che chi studia vede.

**Grandezza.** M se è un racconto derivato sopra quello che c'è. L–XL se è un
piano persistente con passi, scadenze e ricalcoli.

**Rischi.** *Guasto muto:* un percorso che si «modifica» ma in realtà ripropone
le stesse cose — è il difetto della scala dei richiami, tolta nella 0.5.1
perché «non spaziava niente» e nessuno se n'era accorto. Poi: un passo «fatto»
che dice preparazione dove c'è solo copertura (§7.4: copertura e risultati non
si presentano come padronanza).

**La posizione di Claude.** Proporrei un percorso **derivato e non salvato**:
in ogni momento il Percorso dice in quale fase sei, calcolato dalle righe —
*esplorazione* (molti mai visti) → *consolidamento* (errori da rifare) →
*prove* (simulazioni) —, con il criterio scritto accanto («passi alle prove
quando i mai visti sono sotto il X % e gli errori da rifare sotto Y»). Ha tutto
quello che chiedi — si adatta, ha i controlli — e non passa la linea del §4.4,
perché non c'è niente da salvare né da riparare. Le soglie le decide l'autore e
le tiene un test.

**Decisioni per l'autore.** Percorso derivato o salvato; se salvato, un ADR che
superi il §4.4.

**Risposto dall'autore, 3 ottobre 2026.** Il Percorso è **una mappa con un
«sei qui»**; i **controlli** arrivano **quando il motore pensa che sia il
momento**, non a scadenza fissa; e il Percorso è **ricalcolato** dalle risposte,
mai salvato. Quindi il §4.4 della specifica regge, senza ADR: nessuna sessione
prospettica, nessuno stato da riparare. È dei soli registrati (I-03).

**Che cosa resta da progettare (Claude).** Le **fasi** e i **criteri** per
passare dall'una all'altra, scritti accanto alla mappa e tenuti da un test —
per esempio *esplorazione* (molti mai visti) → *consolidamento* (deboli e
incerti) → *prove* (simulazioni) —, e il criterio del «momento del controllo»:
per esempio quando il budget degli errori di I-12 scende sotto la soglia, o
quando una fase finisce. Una funzione nuova nel motore, che restituisce fase,
criterio e attività proposta dalla stessa fonte. I criteri numerici li decide
l'autore, sulla proposta del progetto.

**Domande aperte (sessione).**
1. ~~Sequenza o mappa?~~ — mappa con il «sei qui».
2. ~~Controlli fissi o dal motore?~~ — dal motore.
3. ~~Salvato o ricalcolato?~~ — ricalcolato.

---

## I-06 — Quattro stati per quesito invece di tre [autore]

**L'idea.** Sostituire le categorie di oggi con quattro:

1. **ok** — la domanda è sempre stata risposta giusta;
2. **sistemata** — ci sono stati errori, ma le ultime N risposte (da definire)
   sono state giuste;
3. **incerta** — mai fatta, oppure una volta sola giusta, oppure circa 50 e 50;
4. **debole** — una o più volte, sempre sbagliata.

**Il problema.** I tre stati di oggi — *giusti · da rifare · mai visti*
(Q-DUE, punto 3), dall'**ultima** risposta — dicono poco: un quesito sbagliato
cinque volte e azzeccato la sesta è «giusto» quanto uno azzeccato sempre. È lo
stesso problema della **issue #1** («Un errore si chiude con una sola risposta
giusta: valutare una regola più forte»), aperta il 29 settembre.

**Per chi.** *Chi ripassa sotto esame*: è lui che deve sapere dove è ancora
fragile.

**Promesse che tocca.**
- **R-ARCH-02** e §4.1: gli stati sommano al totale, sempre. Quattro possono
  farlo, se sono disgiunti.
- **Q-DUE, punto 3** (29 settembre, l'autore): le parole della barra «giusti ·
  da rifare · mai visti», e «Rifai N errori» con N uguale al segmento. Cambiare
  gli stati riapre Q-DUE.
- **§4.1**: «due contabilità della stessa cosa, e non è un errore» — per la
  **selezione** due stati, per la **copertura** tre. Quattro stati per la
  copertura non obbligano a cambiare la selezione.

**Che cosa c'è già.** Tutto il dato: le righe sono append-only, e `applica()`
tiene già `n`, `c`, `first`, la streak `s`, `lw`. **Cambiare la regola
riclassifica da sola lo storico di tutti**, senza migrazione (la issue #1 lo
dice: «si può rimandare senza rischi»). Il server non c'entra.

**Grandezza.** M per il motore (`classifica()`, `quadro()`, `dovePesa()`,
`coda()`, e i loro chiamanti, elencati come chiede `AGENTS.md`); M per la
pagina (barra, legenda, filtri); più la misura prima.

**Rischi.** *Guasto muto:* «incerta» che **mescola i mai visti con i visti una
volta**: il buco della copertura sparirebbe dentro un colore giallo — è
esattamente il difetto che la 0.6.0 ha tolto («con due soli stati un quesito
preso male conterebbe come coperto»). Poi: «Rifai N errori» con N che non
coincide con la lista che si apre, se le parole cambiano e il filtro no (il
difetto tornato tre volte). Poi: «50 e 50» è una soglia su campioni piccoli —
due risposte, una giusta e una sbagliata, sono 50 % per caso.

**La posizione di Claude.** Utile, e la misura per sceglierla si può fare
**adesso**, sull'archivio vero di tutti gli account: quante volte un quesito
«sistemato» con una sola risposta giusta viene sbagliato di nuovo all'incontro
dopo, contro quelli sistemati con due. È la misura che la issue #1 chiede. Due
modifiche alla proposta: **i mai visti restano uno stato a sé** (se no il buco
si nasconde), quindi gli stati diventano cinque o «incerta» perde i mai visti;
e le soglie stanno nel motore, dichiarate come quelle del §4.3. Uno schema
possibile, disgiunto: *mai visto · debole* (ultima sbagliata) *· incerto*
(ultima giusta, ma storia mista o una sola risposta) *· sistemato* (errori in
passato, ultime N giuste) *· solido* (mai sbagliato, almeno M risposte).
Attenzione al nome «ok» per un quesito risposto **una** volta giusto: è
fortuna quanto è sapere, con tre risposte possibili.

**Decisioni per l'autore.** Quanti stati e come si chiamano; N di «sistemata»;
se si fa la misura prima (consigliato).

**Risposto dall'autore, 3 ottobre 2026.** **Il mai visto resta uno stato a
sé**, e **«ok» vuol dire almeno due risposte giuste e nessun errore**. Gli stati
diventano cinque: *mai visto · debole · incerta · sistemata · ok*. Lo schema,
con le due regole di dettaglio ancora da chiudere (domande 3 e 4):

| Stato | Quando | Da chiudere |
|---|---|---|
| mai visto | nessuna risposta | — |
| ok | almeno 2 risposte, tutte giuste, **e due di quelle giuste ad almeno 12 ore** (4 ottobre, la stessa regola di «sistemata») | — |
| sistemata | almeno un errore in passato, e le ultime due giuste ~~in due giorni diversi~~ **ad almeno 12 ore l'una dall'altra** (4 ottobre) | — |
| debole | **l'ultima risposta è sbagliata**: sempre sbagliata, e le regressioni | — |
| incerta | tutto il resto che è stato visto: una sola risposta giusta, storia mista | — |

Le cinque sono disgiunte e sommano al totale per costruzione, se «incerta» è
definita come il resto: R-ARCH-02 si tiene. Restano da decidere le parole sulla
barra (Q-DUE, punto 3) e che cosa apre «Rifai N errori».

**Legame con I-12.** Gli stati possono restare **regole** leggibili, come sopra,
mentre il modello di I-12 fa la stima. Tenerli separati è la proposta di
Claude: una regola si spiega in una riga a chi studia («due giuste di fila dopo
l'errore»), una soglia su una probabilità no.

**Domande aperte (sessione).**
1. ~~*ok* con una sola risposta?~~ — no: almeno due giuste, nessun errore.
2. ~~Il mai fatto in *incerta*?~~ — no: stato a sé.
3. ~~Per «sistemata», quante giuste?~~ — **due, in giorni diversi** (l'autore,
   3 ottobre). Conseguenza: è la issue #1, chiusa nel verso «giorno diverso»; la
   misura che la issue proponeva (quanto ricadono i ripresi nello stesso giorno)
   resta utile per dire, dopo, se la regola ha reso.
4. ~~Una **regressione** — giusta, giusta, poi sbagliata — dove va? Nella tua
   definizione non è «debole» (non è sempre sbagliata) né «ok». Proposta di
   Claude: «debole» = **l'ultima risposta è sbagliata**, che comprende «sempre
   sbagliata» e le regressioni; così «Rifai N errori» resta quello di oggi, il
   segmento della barra, e il numero e la lista restano la stessa cosa.~~ —
   **sì** (l'autore, 3 ottobre).

**Lo schema, completo, come l'ha deciso l'autore in brainstorming** — una
proposta per la regia, da riportare nella specifica solo con la decisione
formale: *mai visto · debole* (ultima sbagliata) *· sistemata* (errori in
passato, ultime due giuste in giorni diversi) *· ok* (almeno due giuste, nessun
errore) *· incerta* (il resto del visto). Tocca `classifica()`, `quadro()`,
`dovePesa()`, `coda()` e i loro chiamanti, R-ARCH-02, R-MAPPA-01…13, Q-DUE punto
3, la issue #1. Nessuna migrazione: lo specchio si ricalcola dalle righe.

---

## I-07 — Due tag invece di tre: «non lo sapevo» e «svista» [autore]

**L'idea.** I tag sugli errori sono sostanzialmente due casi: non lo sapevo, e
svista.

**Il problema.** Oggi sono tre (`TAG_NOMI` in `site/app.html`): **N** «Non lo
sapevo», **L** «Letto male», **C** «Calcolo». *Calcolo* serve a pochi quesiti
(navigazione stimata, consumi); *letto male* e una svista sono quasi la stessa
cosa per chi la sceglie in mezzo secondo.

**Per chi.** Tutte e tre; conta di più per *chi ripassa*: una svista si
corregge con l'attenzione, un «non lo sapevo» con lo studio.

**Che cosa cambia per chi studia.** Una scelta in meno, più rapida.

**Promesse che tocca.** **Append-only**: le righe di tag di prima con `L` e `C`
restano nell'archivio e sul server, e **`validaRiga()` le deve accettare per
sempre** (R-ACC-07, R-ARCH-13/14): togliere `C` dalla regola farebbe scartare
all'import e al server le righe vecchie, in silenzio. Il tag nuovo va
**aggiunto**, e i vecchi vanno **letti** come uno dei due.

**Che cosa c'è già.** `tagPerTentativo()` nel motore; i tag si scrivono, si
esportano, viaggiano. **Nessuno li usa per selezionare**: oggi un tag non
cambia niente di quello che il motore propone. Il server non li legge.

**Grandezza.** S–M (motore: mappa dei vecchi; pagina: due pulsanti; controlli).

**Rischi.** *Guasto muto:* `validaRiga()` stretta a due tag che fa scartare le
righe storiche — l'import dice «scartate», ma al server nessuno guarda. Poi: un
tag che non serve a niente resta un gesto vuoto, a due o a tre.

**La posizione di Claude.** D'accordo sulla semplificazione. Ma la domanda vera
è un'altra: **a che cosa servono i tag?** Oggi a niente che il sito usi. Se
servono — per esempio «Rifai solo le sviste» non serve, «rifai i non lo
sapevo» sì, o una spiegazione (I-10) che si apre solo su «non lo sapevo» —
valgono il tocco. Se no, proporrei di chiedersi se toglierli.

**Decisioni per l'autore.** Due tag o tre; che cosa ci fa il sito.

**Risposto dall'autore, 3 ottobre 2026.** Due tag: **«Non lo sapevo»** e
**«Svista»**. **«Calcolo» va in «Svista»**, e anche «Letto male». I tag
**restano**, anche se oggi non si sa bene a che cosa serviranno: si raccolgono
adesso perché un uso futuro (un filtro, la stima di I-12, la spiegazione di
I-10) trovi i dati già lì. Il prezzo, dichiarato: un tocco in più a ogni
errore, senza che il sito ne faccia ancora niente.

Per chi lo realizza: le righe storiche `L` e `C` restano valide per
`validaRiga()` e si **leggono** come «Svista»; un tag nuovo si scrive con un
codice nuovo o con `L`, deciso nel motore e non nella pagina.

**Domande aperte (sessione).**
1. ~~*Calcolo* dove va?~~ — in «Svista».
2. ~~Che cosa fa il sito con i tag?~~ — per ora niente; si tengono.

---

## I-08 — Il browser: gli standard di oggi, e niente doppia ricarica [autore]

**L'idea.** Ottimizzare il sito seguendo gli standard più recenti, ed evitare
la doppia ricarica.

**Stato di fatto.** **La doppia ricarica è già decisa via**: ADR-005 del 3
ottobre 2026 (P-60, su `main`) toglie l'offline e il service worker
cache-first; dopo un rilascio basta **una** ricarica, perché statichost.eu
risponde `max-age=0, must-revalidate` con il 304 (misurato). Manca **P-61**, la
pagina, su `ui/main`. Chi ha visitato la 0.29.0 prende la versione nuova
appena il browser trova il `sw.js` nuovo, che si disinstalla.

**Il resto è da chiarire.** «Gli standard di oggi» può voler dire cose molto
diverse: prestazioni (Core Web Vitals: LCP, INP), `<dialog>` nativo per le
finestre, View Transitions fra le schermate, `content-visibility` su una pagina
da 200 KB, `fetchpriority` sulla banca. Una domanda prima.

**Per chi.** Tutti, sul telefono.

**Promesse che tocca.** Nessun build step né dipendenze (§2.1): ogni
miglioramento sta nel solo HTML/CSS/JS del browser.

**Grandezza.** S–L secondo che cosa.

**Rischi.** *Guasto muto:* un'ottimizzazione che rompe Safari, che il banco non
guida (Q-PROVE). Il banco misura solo Chrome.

**La posizione di Claude.** Prima di ottimizzare, **misurare**: un rapporto
Lighthouse/CWV della Home e di `/app` su un telefono vero, e partire dal
numero peggiore. ~~`app.html` è una pagina sola da ~200 KB con tutto dentro: è il
candidato ovvio.~~ — *corretto il 4 ottobre (ChatGPT): la dimensione da sola non
dice dov'è il collo di bottiglia; lo dice la misura.*

**Visto in questa sessione, 3 ottobre 2026:** la doppia ricarica dal vivo su
`rottagiusta.it` (vedi «Trovato guardando», sotto «I concorrenti»): una prima
apertura con un testo della pagina che non è quello pubblicato, giusto alla
seconda. È la ragione per cui P-61 non va rimandato.

**Domande aperte (sessione).**
1. Che cosa ti dà fastidio oggi, oltre alla doppia ricarica? *Non risposto in
   sessione: resta la proposta di misurare prima (Lighthouse e Core Web Vitals
   su un telefono vero) e partire dal numero peggiore.*

---

## I-09 — Il collaudo con utenti simulati [autore]

**L'idea.** Agenti o bot con profili come utenti veri, che provano le
funzionalità: registrarsi, fare i quiz, usare il sistema, cancellarsi.

**Il problema.** Il banco di oggi (C-01…C-22, T-01…T-09, F-01) prova **contratti
uno per uno**, con `element.click()`; nessuno fa il **giro di una persona**, e
nessuno lo fa su Safari o con il gesto vero (R-ACC-60, scoperto).

**Che cosa c'è già.** Molto: `tests/browser.mjs` guida Chrome, `client_account.mjs`
avvia il server vero, con orologio e posta del test. Un «utente simulato» è un
giro lungo sullo stesso banco.

**Promesse che tocca.** Se gira **in produzione**: account veri nel database,
righe nelle statistiche (R-ACC-67…70, che le dovrebbero escludere), mail vere
contate fra le 300 del mese (R-ACC-38), allarmi al titolare, righe nel registro
di sicurezza. Tutto da evitare, o da dichiarare.

**Grandezza.** M per un giro scritto (deterministico); L per agenti che
esplorano da soli (un modello linguistico che guida il browser con un profilo:
«ho 50 anni, non so cos'è il carteggio»).

**Rischi.** *Guasto muto:* il verde dell'agente. Un agente che esplora e dice «è
andato tutto bene» è lo strumento che rassicura per eccellenza: non dice che
cosa ha **controllato**. Un giro utile ha asserzioni, come il banco.

**La posizione di Claude.** Due cose diverse, entrambe utili. (1) **Giri
lunghi deterministici** nel banco, uno per persona del §1, su un server locale:
è lavoro di Claude su `main`, e prende i difetti di **sequenza** che i gruppi
isolati non vedono (il modulo sotto il riepilogo, R-ACC-76, è stato trovato
così: per caso). (2) **Agenti esplorativi** che producono **un rapporto da
leggere**, non un verde: utili per l'usabilità («qui mi sono perso»), che il
banco non misura. Mai in produzione; sempre su un'istanza locale, come le prove
di P-02. Non sostituiscono Q-PROVE: un agente non è una persona.

**Risposto dall'autore, 3 ottobre 2026: tutti e due** — i giri lunghi
deterministici nel banco, uno per persona del §1, e gli agenti esplorativi con
un profilo, che scrivono un rapporto da leggere. Sempre su un'istanza locale,
mai in produzione. Gli stessi studenti finti servono a tarare la stima di I-12:
conviene progettarli una volta sola, con i profili che rompono le ipotesi del
modello (chi impara a memoria, chi tira a indovinare, chi si stanca).

**Domande aperte (sessione).**
1. ~~Difetti o usabilità?~~ — tutti e due.

### La ricerca del 4 ottobre 2026: che cosa esiste già [Claude]

Chiesta dall'autore, che vuole i bot non solo per Rotta Giusta ma per tutti i
prossimi siti. Dei lavori citati sono stati letti riassunti e abstract, non gli
articoli interi.

**Uno standard per i «bot UX» non esiste.** Esistono standard per che cosa
misurare e come riferirlo, nati per valutatori umani:

- **ISO 9241-11**: usabilità = efficacia, efficienza, soddisfazione, per utenti
  e compiti dichiarati.
- **ISO/IEC 25062 (CIF)**: il formato del rapporto di un test — compiti,
  completamento, tempi, problemi.
- **Valutazione euristica** (le 10 euristiche di Nielsen) e **cognitive
  walkthrough** (a ogni passo: un principiante capirebbe che cosa fare, e che
  cosa è successo?).
- **WCAG 2.2**, la parte misurabile, che il banco copre già (T-01…T-09).

**Che cosa dice la ricerca sugli agenti (2024–2026):**

- *UXAgent* (arXiv 2504.09407) e *UXCascade* (arXiv 2601.15777): persone
  simulate che navigano un sito vero e producono un rapporto. Utili ai
  ricercatori per preparare uno studio; comportamento non del tutto realistico.
- *Synthetic Cognitive Walkthrough* (arXiv 2512.03568): gli agenti **completano
  più compiti degli umani, seguono percorsi più diretti e trovano meno punti di
  inciampo**.
- *Does GenAI Make Usability Testing Obsolete?* (arXiv 2411.00634): precisione
  0,61–0,66, richiamo 0,35–0,38 — quello che trovano è spesso vero, ma perdono
  la maggior parte dei problemi. *Catching UX Flaws in Code* (arXiv
  2512.04262): i giudizi di gravità sono instabili fra un giro e l'altro.
- *Nielsen Norman Group*, «Synthetic Users» (21 giugno 2024): utenti sintetici
  compiacenti e idealizzati; buoni per preparare e fare ipotesi, mai come
  sostituto.
- Strumenti: Playwright ha dalla 1.56 agenti propri e un server MCP basato
  sull'albero di accessibilità.

**Che cosa ne viene: un'asimmetria.** Un agente è **più bravo** di una persona
a trovare la strada. Quindi: se il bot **non** arriva, o ci arriva a fatica, il
segnale è forte; se arriva liscio, il segnale è debole — non prova che una
persona ci arrivi. E quello che il bot **dice** («mi è piaciuto») non conta: è
il punto in cui i modelli sono compiacenti. Conta quello che **fa**.

**Tre tipi di bot, da non mescolare:**

| Bot | Che cosa fa | Esito |
|---|---|---|
| Giro lungo scritto | Una persona dall'arrivo alla cancellazione, passi fissi | Verde o rosso, nella suite |
| Agente con un profilo | Un modello con una persona e uno scopo, che vede solo schermata e albero di accessibilità | Un rapporto da leggere, mai un verde |
| Studenti finti | Risposte statistiche, senza modello linguistico, per I-12 | Dati |

**Quattro regole per l'agente con un profilo:**

1. **Handicap dichiarato.** Niente codice sorgente, schermo a 375 px, un
   profilo con conoscenze limitate, un tetto di passi.
2. **«Contento o scontento» è una misura, non un'opinione.** Il profilo porta
   scritte le sue **regole di abbandono** (sotto), e l'esito si legge dai
   passi: arrivato o no, tocchi oltre il minimo, ritorni indietro, primo tocco
   giusto o sbagliato, muri incontrati.
3. **Ogni rilievo porta la prova** — schermata e passo —, e un rilievo
   confermato diventa un controllo scritto nel banco, o si scarta.
4. **Provato al contrario, e più giri.** Si rimette un difetto noto (il modulo
   sotto il riepilogo, R-ACC-76) e si guarda se l'agente lo trova; ogni profilo
   gira più volte, e conta la frequenza: 4 su 5 è un segnale, 1 su 5 è rumore.

Il rapporto ricalca il CIF. Sempre su un'istanza locale, mai in produzione.

### I primi due profili, per il menu [autore, 4 ottobre 2026]

L'autore vuole usare i bot **adesso**, per ottimizzare il menu (I-13, I-18):
il bot vuole fare una cosa, si collega, cerca, e si vede se l'interfaccia lo
porta lì.

**Profilo 1 — «Mi serve la patente».** Vuole solo passare l'esame; nessuna
passione per il mare, la prende per andare in barca con gli amici. Scopo: **una
simulazione del quiz, subito**. Non vuole registrarsi.
*Proposta di Claude per le regole di abbandono:* se ne va se dopo tre tocchi
dall'arrivo non ha una domanda d'esame davanti; se per cominciare gli si
chiede di registrarsi; se deve leggere più di una schermata di testo prima di
partire. *Misure:* tocchi dall'arrivo alla prima domanda della simulazione
(minimo possibile contro fatti), primo tocco, se è finito in un'attività che
non è la simulazione credendo che lo fosse.

**Profilo 2 — «Voglio tutto».** Appassionato: vuole registrarsi e avere il
massimo — un percorso, le statistiche, il resto. Scopo: **creare l'account,
trovare il percorso e i progressi, capire che cosa gli danno**.
*Regole di abbandono proposte:* se non trova dove ci si registra senza prima
finire un'attività; se dopo la registrazione non capisce dove sono percorso e
statistiche; se trova due posti che sembrano dire la stessa cosa e non sa quale
guardare (il rischio di I-13). *Misure:* tocchi fino al modulo di
registrazione, tocchi dalla registrazione alla prima vista dei progressi, voci
del menu aperte per sbaglio.

**Due usi, per il menu (Claude):**

- **Sul sito com'è**, per avere la base prima del ridisegno.
- **Sulle varianti del menu prima di costruirle**: al bot si dà solo l'albero
  delle voci (le etichette, senza pagine) e lo scopo, e si chiede dove
  toccherebbe. È il *tree testing* dei ricercatori UX: costa pochissimo, e
  confronta le proposte di I-18 fra loro con gli stessi profili.

**Per tutti i siti.** Il kit — chi guida il browser, il modello del rapporto,
le quattro regole — starebbe in `Standards`; ogni progetto aggiunge due file,
profili e compiti. La regola «nessuna dipendenza» di questo repo non si tocca.

**Resta vero:** un agente non è una persona (Q-PROVE).

**Risposto dall'autore, 4 ottobre 2026: tutti e due gli usi** — la base sul
sito com'è, e le varianti del menu prima di costruirle.

**Dove girano (Claude, su domanda dell'autore).** Tre pezzi: il **sito**, una
copia locale con il server degli account su un database temporaneo, come fa il
banco; il **browser**, Chrome; e il **modello** che decide il prossimo tocco,
che gira da Anthropic e riceve schermata e albero di accessibilità — quindi
solo dati finti, mai un account vero. La prova delle varianti del menu non ha
né sito né browser: è solo testo. Il pilota gira sull'Air, dentro una sessione;
il **Mac mini** dell'autore, oggi quasi fermo, serve quando i giri diventano
ricorrenti e senza nessuno davanti (di notte, a ogni rilascio), e toglie la
contesa sulla porta 8620. Da decidere allora: come paga il modello lì
(abbonamento con `claude -p`, o chiave API a consumo). **L'autore, 4
ottobre:** il Mac mini era per un modello locale, gratuito; è una
complicazione, si tralascia. I bot girano con l'abbonamento, sull'Air.

**Il pilota, 4 ottobre 2026: il banco c'è, i giri no.** Sta in `~/bot-ux/`,
fuori da ogni repo, con il suo `LEGGIMI.md` (struttura, comandi, la tabella del
red team); qui non è entrato niente. **Misurato:** un sotto-agente lanciato da
questo repo eredita specifica e CHANGELOG — circa 190.000 token prima di
cominciare, e il modello piccolo lo rifiuta —, quindi il bot è un processo
`claude -p` lanciato da una cartella vuota, con due soli strumenti: un'azione
sul telefono e la lettura della schermata. Il traguardo di ogni profilo è
un'espressione sullo stato della pagina, letta dal banco: un bot che dice
«arrivato» senza esserlo è un `falso_arrivo`, e si conta. La prova del menu
confronta quattro prototipi di carta — oggi, la prima proposta di I-18,
l'ibrida approvata, e una rotta apposta per vedere se lo strumento distingue.
Provato con bot finti: orchestrazione, falso arrivo e uso fuori dalle regole
vengono presi.

**Girato il 4 ottobre 2026** — la lettura intera è in
`~/bot-ux/rotta-giusta/lettura-2026-10-04.md`. Dieci giri sul sito com'è
(Sonnet, 35–97 s e 0,16–0,42 $ di stima l'uno, dentro l'abbonamento): 10 su 10
arrivati e confermati dal banco, nessun falso arrivo. Il profilo 1 arriva
sempre in 4 tocchi — il tetto della sua regola d'abbandono —, e nessuno dei
cinque vede il pulsante «Simula la prova dei quiz» del Percorso, che sta sotto
la piega: tutti passano da Quiz o da «Scegli un'attività», e tutti dichiarano
di aver preso l'allenamento da 10 per la prova. Il profilo 2 fa cinque volte la
stessa strada, scorre la Home a vuoto cercando «Registrati», e trova «Crea un
account» solo dentro «Accedi». La prova del menu (Haiku, 120 giri, 0,90 $): la
variante rotta apposta crolla sulle etichette opache ma non sull'account
nascosto — lo strumento vede le parole, non la profondità —; **«Rotta» non
dice progressi** (0/5), **i Segnali sotto «Quiz → Altro» non li trova
nessuno** (0/5), e nella struttura approvata **«quiz su un argomento» cade a
1/5** perché «Allenati con 10 domande» in Home ruba l'intenzione alla voce
«Allenati» della barra. Un bot che arriva è un segnale debole; cinque giri di
uno stesso profilo valgono una o due osservazioni; frasi e prototipi li ha
scritti Claude, e vanno riletti dall'autore.

---

## I-10 — La modalità apprendimento [autore]

**L'idea.** Una modalità in cui, per ogni risposta sbagliata, il sito spiega
perché la risposta giusta è giusta e perché le altre sono sbagliate. Vuol dire
analizzare tutto il database e scrivere una piccola spiegazione per ogni
quesito: l'autore pensa di farlo un po' alla volta, nei limiti dei suoi token.
Secondo l'autore è ciò che potrebbe davvero differenziare il sito.

**Il problema.** Oggi un errore dice *che cosa* era giusto, non *perché*. Chi
non lo sa resta senza, e rischia di imparare a memoria la lettera della
risposta.

**Per chi.** *Chi comincia da zero* più di tutti; anche *chi è in formazione*
fra una lezione e l'altra.

**Che cosa cambia per chi studia.** Dopo un errore, tre righe: perché è questa,
perché non le altre. È il passo da un allenamento a qualcosa che insegna.

**Promesse che tocca — è l'idea che ne tocca di più.**
- **Filosofia, «Accompagniamo la preparazione, non la sostituiamo»**: «il sito
  non insegna: allena e dà riscontri … Non diciamo "impari con noi" … È una
  promessa più piccola, ed è per questo che possiamo mantenerla.» E §1 della
  specifica, l'ultima riga. Una modalità apprendimento cambia questa frase:
  serve una decisione esplicita, forse un ADR.
- **Filosofia, «L'autorità sta nella fonte, non in noi»**, e §2.1, «nessuna
  modifica alla banca per convinzione». Una spiegazione **non** è la banca, ma
  dice *perché* il decreto ha ragione: e se il decreto ha torto? Il caso c'è già,
  **base-405** (i flap), dove la risposta ministeriale sembra invertita: la
  spiegazione dovrebbe dire «all'esame vale questa, e la fisica dice l'altra»,
  come fa la nota di oggi.
- **Gli 11 divergenti dal DM 133/2024 e i 37 oscurati**: la spiegazione deve
  sapere della nota, o contraddirla.
- **`strumenti/controlla.py`**: niente materiale di terzi. Spiegazioni prese da
  manuali o da altri siti non possono entrare. E la licenza: le spiegazioni sono
  dell'autore, quindi MIT come il codice — da dire.

**Che cosa c'è già.** I campi `nbp` e `nb` della banca — una nota prima e una
dopo — e la regola che li separa (una nota letta prima è un suggerimento).
Una spiegazione è un `nb` per tutti, scritto da noi e non dal decreto. Il server
ha le righe di tutti: **sa quali quesiti si sbagliano di più**, e da lì si
potrebbe partire (una statistica, che passa da `server/statistiche.mjs`).

**Grandezza.** XL di contenuto (1.722 quesiti, più 135 esercizi di carteggio);
S–M di codice (un campo, una revisione, un controllo).

**Rischi — il guasto muto qui è grave.** **Una spiegazione sbagliata insegna il
falso con l'aria di essere giusta**: è il difetto delle dieci figure scambiate
(0.12.0), che «non insegnava niente — insegnava il falso, e lo faceva con l'aria
di essere corretto». Scritte da un modello linguistico, 1.722 spiegazioni ne
avranno di sbagliate, e chi studia non ha modo di accorgersene. Poi: le
spiegazioni non si aggiornano quando cambia la norma (il DM 133/2024 ha già reso
false 11 risposte). Poi: «spiega perché le altre sono sbagliate» su quesiti dove
la banca è ambigua.

**La posizione di Claude.** È l'idea con più valore **e** con il rischio più
alto, e tutte e due le cose sono vere. La renderei onesta con quattro regole,
nello spirito del resto del sito: (1) ogni spiegazione dichiara di essere
**nostra e non del decreto**, e quando è stata **verificata da una persona**; una
non verificata o non si mostra, o si mostra marcata. (2) Ogni spiegazione cita
una **fonte** dove ce n'è una (la regola COLREG, l'articolo del DM 146/2008), e un
test pretende il campo. (3) Si comincia dai quesiti **che si sbagliano di più**,
misurati, non dal primo della banca. (4) Un modo di dire «questa spiegazione non
torna» (C-03). E l'ordine: prima una prova su 50 quesiti, guardata da te una per
una, per misurare quante sono da correggere; da quella misura si decide se il
resto si fa a mano, con un modello e revisione, o non si fa.

**Decisioni per l'autore.** Se il sito comincia a insegnare (filosofia, §1); chi
verifica le spiegazioni; se si mostrano le non verificate; la licenza.

**Risposto dall'autore, 3 ottobre 2026.**
- La spiegazione si vede **dopo ogni risposta**, anche giusta: chi ha indovinato
  ne ha bisogno quanto chi ha sbagliato. Resta la regola dei due campi della
  banca: **mai prima** di rispondere (§3.1, `nbp` e `nb`).
  *Precisato il 4 ottobre, dopo il confronto con ChatGPT:* **in una simulazione,
  dopo la consegna** — mai durante la prova, che non corregge (§7.5, Vincolo);
  negli allenamenti, subito dopo la risposta.
- **La verifica la fa l'autore.** Ne segue, proposta di Claude: si mostrano
  **solo le spiegazioni verificate**, e ognuna porta il segno «verificata il
  …»; quelle scritte e non ancora verificate non escono. Il ritmo lo dà
  l'autore; l'ordine, i quesiti più sbagliati da tutti (I-12, la difficoltà
  dagli altri utenti), con la prova sui primi 50 per misurare quante vanno
  corrette. *Precisato il 4 ottobre (ChatGPT):* i 50 della prova non solo i più
  sbagliati, ma un campione che metta il metodo in difficoltà — quesiti
  ambigui, con figura, con calcoli, divergenti dal DM 133/2024, oscurati, il
  flap di base-405.
- **Solo i quiz**, non il carteggio.
- **La frase della filosofia**, approvata: *«Spieghiamo perché una risposta è
  quella giusta, e lo diciamo quando la spiegazione è nostra e non del decreto.
  Non sostituiamo la scuola né il manuale.»* Va in `docs/filosofia.md` al posto
  di «il sito non insegna: allena e dà riscontri» (§ «Accompagniamo la
  preparazione»), e nel §1 della specifica; penna di Claude su `main`, alla
  decisione formale.

**Ancora aperto, per dopo:** la **licenza** delle spiegazioni (sono dell'autore:
MIT come il codice, o una licenza per i testi, come CC BY?), e dove stanno — un
file nuovo accanto alla banca, mai dentro `quiz.json`, che è l'Allegato A e non
si tocca (§2.1).

**Domande aperte (sessione).**
1. ~~Solo dopo un errore?~~ — dopo ogni risposta.
2. ~~Chi verifica?~~ — l'autore.
3. ~~Anche il carteggio?~~ — solo quiz.

---

## I-11 — Le donazioni [regia]

**Da dove viene.** Il prompt di P-59 lo pone come tema già aperto: le donazioni
con PayPal. In `docs/prossime-sessioni.md` §4 c'è che cosa diceva una ricerca
del 25 settembre, fatta prima degli account; P-59 chiede di riverificarla sulle
pagine ufficiali, con fonte e data, e di scrivere la parte fiscale come domande.

**La riverifica, 3 ottobre 2026.** Fatta da un agente di questa sessione sulle
pagine ufficiali. Legenda: **[letta]** = pagina scaricata e letta il 3 ottobre
2026; **[snippet]** = solo risultato di ricerca, pagina non aperta;
**[memoria]** = non verificato. Le tariffe PayPal sono passate da un estrattore
automatico: da rileggere a mano prima di decidere.

### Le quattro affermazioni del 25 settembre

1. **«Il pulsante Dona di PayPal è solo per enti; a un privato resta
   PayPal.Me sul conto personale»** — **smentita nella forma.** Le Condizioni
   d'uso PayPal per l'Italia, aggiornate al 7 settembre 2026 **[letta]**,
   <https://www.paypal.com/it/legalhub/paypal/useragreement-full>: i conti
   Business sono per «persone e aziende … per ricevere pagamenti online in
   occasione di compravendite o donazioni», quindi non solo per gli enti. Le
   stesse condizioni dicono che un conto Business «non è idoneo a ricevere
   transazioni personali», e vietano di «richiedere o inviare un pagamento a
   titolo di transazione personale per eseguire una transazione commerciale».
   Le tariffe distinguono «donazioni nazionali» (3,40 % + 0,35 €) da «enti
   benefici» (1,80 % + 0,35 €) **[letta]**,
   <https://www.paypal.com/it/webapps/mpp/merchant-fees>. **Non verificato:**
   se un privato con conto personale in Italia possa creare il pulsante; la
   pagina italiana delle donazioni risponde 404, e la documentazione del Donate
   SDK **[letta]** (<https://developer.paypal.com/sdk/donate.md>) descrive solo
   l'integrazione con uno **script**, che il sito non può caricare.
2. **«Una donazione resta liberalità solo se non promette niente in cambio»**
   — **da precisare: è una domanda per il professionista** (sotto). Fatti
   sulle piattaforme: Liberapay **[letta]**, <https://liberapay.com/about/faq>,
   «transactions must not be linked to a contract nor a promise of
   recompense»; GitHub Sponsors **[letta]** prevede livelli con ricompense e
   dice che i fondi sono reddito di chi li riceve, «responsible for evaluating
   and paying their own taxes»
   (<https://docs.github.com/en/sponsors/receiving-sponsorships-through-github-sponsors/tax-information-for-github-sponsors>).
3. **«Liberapay e GitHub Sponsors sono alternative»** — **confermata, con
   riserve.** Liberapay **[letta]**: «can be used by anyone», sede in Francia,
   nessuna commissione propria (restano Stripe o PayPal); che l'Italia sia
   supportata per ricevere non è scritto esplicitamente. GitHub Sponsors
   **[letta]**: l'Italia è fra le regioni supportate
   (<https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors>),
   con il modulo W-8BEN prima di pubblicare il profilo.
4. **«Anche un semplice link va dichiarato nell'informativa»** — **da
   precisare: domanda per il legale.** Un `<a href>` non manda niente prima del
   clic. Ma chi riceve una donazione via PayPal riceve nome ed email del
   donatore (lo dice Liberapay, <https://liberapay.com/about/payment-processors>,
   **[letta]**: «PayPal always allows donors and recipients to see each other's
   names and email addresses»), e le Condizioni PayPal dicono che venditore e
   PayPal sono «titolari autonomi del trattamento» **[letta]**: quel
   trattamento esiste, ed è dell'autore.

### Le opzioni

| Servizio | Privato italiano? | Commissioni | Link o script | Dati del donatore all'autore | Account del donatore |
|---|---|---|---|---|---|
| PayPal.Me, conto personale | Sì per l'uso personale; se ricevere donazioni per un sito sia «commerciale» (quindi vietato in «amici e familiari») è una domanda | Gratuito in EUR senza conversione **[letta]**, <https://www.paypal.com/it/webapps/mpp/paypal-fees>; nessuna Protezione acquisti per pagamenti personali e donazioni **[letta]**, <https://www.paypal.com/it/legalhub/paypal/buyer-protection> | Link | Nome ed email **[letta, via Liberapay]** | Sì **[letta]**, <https://www.paypal.com/it/digital-wallet/send-receive-money/paypal-me> |
| PayPal, conto Business / pulsante Dona | Conto Business previsto per «persone» **[letta]**; pulsante da conto personale non verificato | 3,40 % + 0,35 € **[letta]** | SDK con script (escluso); link ospitato non verificato | Nome ed email | Non verificato |
| Liberapay | «anyone» **[letta]**; Italia non scritta | 0 % proprio; storico ~3 % via Stripe, ~5 % via PayPal **[letta]** | Link **[memoria]** | Via PayPal nome ed email; via Stripe «can be secret» **[letta]** | Probabilmente sì **[memoria]** |
| GitHub Sponsors | Sì, con W-8BEN **[letta]** | 0 % da conti personali; fino al 6 % da organizzazioni **[letta]** | Link | Username **[memoria]** | Sì, di fatto **[dedotto]** |
| Stripe Payment Links | Non detto se una persona senza P.IVA possa aprire il conto **[letta]** | Carte SEE 1,5 % + 0,25 €, premium 2,8 % + 0,25 € **[letta]**, <https://stripe.com/it/pricing> | Link **[memoria]** | Almeno email e nome **[memoria]** | No **[memoria]** |
| Ko-fi | Non verificato | 0 % sulle donazioni nel piano gratuito **[snippet; ko-fi.com risponde 403]** | Link **[memoria]** | Non verificato | Non verificato |
| Buy Me a Coffee | Non verificato | 5 % più Stripe **[snippet; prezzi 404]** | Link **[memoria]** | Non verificato | Non verificato |
| Open Collective Europe (*fiscal host*) | Per «groups without a separate legal organisation» **[letta]**, <https://docs.opencollective.com/oceurope/faq/general-faqs>; i fondi li amministra l'host, spesi con giustificativi: non sono reddito personale | ~8–10 % più carta **[snippet]** | Link | Non verificato | Non verificato |
| Satispay | Business con P.IVA o visura **[snippet]** | Non verificato | Link di richiesta **[snippet]** | Non verificato | Sì (app) |

**Per il sito:** ogni opzione con un **link** rispetta «nessuna risorsa di
terzi» (`test_nessuna_risorsa_di_terzi`); il pulsante PayPal con lo SDK no.

### Domande per il professionista (non risposte)

*Fisco.*
1. Donazioni spontanee a una persona fisica senza P.IVA per un sito gratuito:
   liberalità (art. 783 o 770 c.c.) o reddito, e di quale categoria (redditi
   diversi, art. 67 TUIR; lavoro autonomo occasionale)?
2. Cambia qualcosa se sono **ricorrenti** (mensili, come Liberapay o Sponsors)?
3. Livelli con ricompensa (nome nel README, accesso anticipato) trasformano la
   donazione in un corrispettivo, con IVA o P.IVA? E senza ricompense attivate?
4. C'è una soglia, di importo o di frequenza, oltre la quale l'attività diventa
   abituale o commerciale?
5. Dove si dichiarano (730, Redditi PF)? Serve un registro dei donatori?
6. Per GitHub (USA) basta il W-8BEN? Effetti in Italia: credito d'imposta,
   quadro RW per saldi su conti esteri (PayPal, Stripe)?
7. DAC7 (dir. UE 2021/514, d.lgs. 32/2023 **[snippet]**): una piattaforma di
   donazioni può segnalare l'autore come «venditore» all'Agenzia? Con quali
   conseguenze, se riceve liberalità?
8. CESOP (dir. UE 2020/284 **[memoria]**): la segnalazione dei beneficiari di
   molti pagamenti transfrontalieri riguarda l'autore?
9. Un conto PayPal personale in «amici e familiari» per donazioni di
   sconosciuti viola le Condizioni d'uso? Serve un conto Business, e con quali
   conseguenze fiscali?

*Privacy.*
10. Ricevendo nome ed email del donatore, l'autore è titolare autonomo? Che
    informativa (art. 13 o 14), e dove?
11. Un link esterno senza dati prima del clic va menzionato nell'informativa?
12. Per quanto si conservano i dati dei donatori, anche ai fini fiscali, e con
    quale base?
13. Ringraziare pubblicamente un donatore per nome richiede il consenso?

*Responsabilità.*
14. Chiedere donazioni cambia il regime di un sito gratuito «così com'è»
    (`site/avvertenza.html`)? Le condizioni devono dire che la donazione non
    dà diritto a nessuna prestazione?

### Che cosa non si è potuto verificare
Il pulsante Dona da conto personale in Italia; le pagine ufficiali di Ko-fi
(403) e Buy Me a Coffee (404); se Stripe apre un conto a una persona senza
P.IVA; se il donatore Liberapay deve avere un account e se l'Italia riceve;
che cosa vede il maintainer su GitHub Sponsors; il testo di DAC7 su EUR-Lex
(non si è aperto); Satispay.

### Il resto della scheda
**Il problema.** Il sito costa (Scaleway, OVHcloud, il dominio, il tempo
dell'autore) e non ha entrate. **Per chi.** Per nessuna delle tre persone: è
per il sito. **Che cosa cambia per chi studia.** Un link in più, in Home o
in Info; niente altro, se non promette niente. **Promesse.** Filosofia, «Che
cosa non siamo»: «non c'è un modello di business da proteggere» — una
donazione senza ricompense non lo cambia, una con livelli sì;
«nessun dark pattern»: un invito a donare messo nel riepilogo sarebbe un
secondo imbuto accanto a quello dell'account; l'informativa (domande 10–13).
**Motore e server.** Niente: un link. **Grandezza.** S di pagina, più il
parere. **Rischi.** *Guasto muto:* un conto PayPal personale che PayPal
chiude o limita per uso commerciale, con il link che resta in pagina e porta
a un errore, e nessuno lo vede; poi un trattamento di dati (i donatori) che
l'informativa non dice. **Decisioni per l'autore.** Se chiedere donazioni;
quale servizio; dove sta il link; il parere prima.

**Risposto dall'autore, 3 ottobre 2026: sì alle donazioni.** Il servizio e il
posto del link restano da scegliere, e **prima viene il parere** sulle 14
domande; la proposta di Claude resta Liberapay.

**La posizione di Claude.** Fra le opzioni verificate, **Liberapay** è quella
più vicina ai valori del sito: nessuna ricompensa per regola, nessuna
commissione propria, donazioni che possono restare anonime via Stripe, un link.
**GitHub Sponsors** è comodo ma ha i livelli con ricompense, che rendono più
difficile la domanda 3, e serve un account GitHub. **PayPal.Me personale** è il
più semplice ma ha la domanda 9 sopra la testa. In ogni caso, prima il parere.

---

## I-12 — Una stima del risultato d'esame [autore]

**L'idea.** Guardando Quiz Patente Nautica, che vende una «previsione del
risultato del tuo esame reale», l'autore ha detto il 3 ottobre 2026: «penso che
dovremmo cambiare la nostra filosofia» su questo punto.

**Il problema.** *Chi ripassa sotto esame* ha una domanda sola — «se l'esame
fosse domani, passerei?» — e il sito oggi gli dà i pezzi (copertura, mappa,
prove sostenute) ma non la risposta.

**Per chi.** *Chi ripassa sotto esame*, quasi solo lui. A *chi comincia da
zero* un numero basso il primo giorno non serve.

**Che cosa cambia per chi studia.** Un numero, o una frase, che dice quanto è
vicino alla soglia: fino a 4 errori su 20 nel quiz base, 1 su 5 nella vela.

**Promesse che tocca — tutte e tre le grandi.**
- **`docs/filosofia.md`**, «Che cosa non siamo»: «"supera l'esame con noi" non
  lo diciamo, perché non sappiamo che cosa studi fuori da questo sito, e fingere
  di saperlo sarebbe esattamente il tipo di rassicurazione vuota che rifiutiamo
  altrove». E «La verità prima della rassicurazione».
- **§4.6 della specifica**: il motore non sa che cosa hai studiato fuori, non
  conosce gli altri, non ha il programma d'esame.
- **§4.3**: ogni misura ha una soglia sotto la quale non si mostra, «perché un
  numero calcolato sotto quella soglia è rumore con l'aria di essere una
  misura».

**Che cosa c'è già.** Più di quanto serva per una stima onesta: le prove
sostenute (righe `_t:'s'`, con l'esito); per ogni quesito la storia delle
risposte; la composizione ministeriale delle 20 domande (`pesi_esame`,
Allegato C al DM 323/2021) e `simulazione()` che la rispetta; `quadro()` per
tema. Il server ha le righe di tutti i registrati. **Quello che manca è uno:
il risultato dell'esame vero.** Nessuno ce lo dice, quindi nessuna stima si può
confrontare con la realtà.

**Tre livelli, dal più onesto al più rischioso** — la proposta di Claude:

1. **I fatti, senza modello.** «Nelle ultime 5 simulazioni: superate 4, errori
   2, 5, 3, 1, 2.» Nessuna previsione, solo quello che è successo, con una
   soglia (almeno 3 prove). Oggi è sparso in Progressi; detto in una riga è già
   gran parte della risposta.
2. **Una stima sulla banca, dichiarata come tale.** Per ogni quesito una
   probabilità di risposta giusta presa dalla tua storia (per i mai visti, la
   tua media sul tema, come già fa `dovePesa()` per la parte non vista); poi il
   motore estrae mille simulazioni con la composizione del decreto e conta
   quante stanno sotto i 4 errori. Esce un numero *e un intervallo*: «su prove
   estratte come all'esame, ne supereresti circa 7 su 10». È **la previsione
   della simulazione**, non dell'esame: si scrive così. Logica pura, nel motore,
   con i test; deterministica col seme.
3. **Una stima tarata sull'esame vero.** Solo se un giorno abbiamo i risultati
   veri: dopo la data d'esame, chi ha l'account può dire «com'è andata»
   (facoltativo, con la sua base giuridica). Con abbastanza risposte si misura
   se il livello 2 ci azzecca, e quanto. Prima di quel giorno, la parola
   «previsione» non ha niente sotto.

**Che cosa non può dire, in nessun livello.** Il **carteggio**, che apre
l'esame e lo decide per primo: lo giudica chi studia, e il sito non sa se il
giudizio è giusto (§4.5). Una stima «passeresti» che tace il carteggio è falsa
per chi lo sbaglia. Va detto accanto al numero, sempre.

**Grandezza.** Livello 1: S. Livello 2: M nel motore (una funzione, i test,
una soglia) e S nella pagina. Livello 3: L, e una decisione di privacy.

**Rischi.** *Guasto muto:* il **verde a copertura zero, in forma di
percentuale**. Chi ha visto 100 quesiti su 1.472 e li ha presi tutti avrebbe
«superi 10 su 10» se ai mai visti si presta la sua media; il numero deve
**pesare l'ignoto**, e sotto una copertura minima non comparire. Poi: la
memoria — chi ripete gli stessi quesiti li impara a memoria e la stima sale
senza che salga la preparazione. Poi: un modello che nessuno ha mai confrontato
con l'esame vero, presentato come se l'avesse fatto. ~~È esattamente quello che
fa QPN.~~ — *corretto il 4 ottobre (ChatGPT): dalle loro pagine pubbliche non si
sa come abbiano validato il modello.*

**La posizione di Claude.** Cambiare la filosofia sì, se si cambia **una
frase precisa** e non il principio. Il principio — non dire più di quello che
si misura — regge anche una stima:
il livello 2 dice una cosa vera («su prove estratte come all'esame»). Quello
che resta escluso è la parola «esame reale» finché non c'è il livello 3. Una
riscrittura possibile della frase: *«Non ti diciamo che supererai l'esame. Ti
diciamo, quando abbiamo abbastanza risposte per dirlo, come andresti in una
prova estratta come all'esame — e che cosa questa stima non sa.»* La penna di
`docs/filosofia.md` è di Claude su `main`, ma la decisione è dell'autore.

**Decisioni per l'autore.** Se cambiare la filosofia, e con quale frase; fino a
quale livello; le soglie (quante risposte, quanta copertura) prima che il
numero compaia; se chiedere «com'è andato l'esame» (livello 3).

**Risposto dall'autore, 3 ottobre 2026.**
- La stima la vede **solo chi si registra**: è anche un motivo per
  registrarsi (I-03). Regge l'ADR-004, condizione 3: «ai registrati restano solo
  le viste che vivono di uno storico», e una stima vive di uno storico.
- **Sì**, dopo la data d'esame si chiede «com'è andata» (livello 3).
- Sul livello 2 o «esame reale», l'autore vuole fermarsi a pensarci, e chiede
  due cose: una **probabilità di passare l'esame** con un indicatore grafico,
  per esempio una **ragnatela**; e un **modello inventato da noi**, da provare
  con utenti simulati (I-09), in cui chi risponde bene ad alcune domande di
  meteorologia ha più probabilità di rispondere bene anche alle altre.

### Approfondimento — il modello, il grafico, la prova (Claude, 3 ottobre)

**Il modello che l'autore descrive esiste, e ha un nome: si chiama
«prestito di forza» (*partial pooling*) in un modello gerarchico.** Per ogni
quesito non si ha quasi niente — una o due risposte —, ma si sa a quale voce e
a quale tema appartiene. Allora:

- la probabilità di risposta giusta di un **quesito** parte da quella della sua
  **voce** (per esempio «Venti», 21 quesiti), e si sposta verso la tua storia su
  quel quesito tanto più quante più risposte ci hai dato;
- la **voce** parte dal suo **tema** (Meteorologia), il **tema** dalla tua
  media generale;
- un quesito mai visto eredita la stima della sua voce, con **più incertezza**.

Con due numeri per livello (un *beta-binomiale*: risposte giuste e sbagliate,
più un «peso» del livello sopra) è una formula chiusa, senza addestramento,
che gira nel motore come logica pura, deterministica e testabile. Il motore ha
già il germe: la `debolezza` di `diagnosi()`, `(errori + 1) / (visti + 3)`, è un
liscio dello stesso tipo, sul tema intero. È anche la risposta al rischio del
«verde a copertura zero»: il mai visto non riceve la media, riceve la media
**con la sua incertezza**. ~~E l'incertezza abbassa la probabilità prudente.~~ —
*corretto il 4 ottobre (ChatGPT): l'incertezza non rende prudente la stima da
sola; lo fa solo se si mostra il limite basso dell'intervallo, o si decide una
regola che lo usi. Da decidere nel progetto.*

**Dalla probabilità per quesito alla probabilità di passare.** La prova base è
20 domande con la composizione del decreto, al più 4 errori. Dai p dei quesiti
si calcola **esattamente** la distribuzione del numero di errori (una
convoluzione, nessuna estrazione a caso), o con mille estrazioni con il seme
come `simulazione()`. Esce una probabilità di stare sotto i 4 errori, **e un
intervallo** dall'incertezza: «fra 55 e 80 su 100». Due raffinamenti da
decidere: contare soltanto la **prima** risposta o le risposte date **in giorni
diversi**, perché chi ripete gli stessi quesiti li impara a memoria e la stima
salirebbe senza che salga la preparazione (è la issue #1, vista da un altro
lato); e pesare di più le risposte **recenti**.

**Usare le risposte degli altri? Solo con una decisione.** Il modello può
imparare anche **quanto è difficile ogni quesito per tutti** (*item response
theory*): «questo quesito lo sbaglia il 60 % dei registrati». Renderebbe la
stima molto migliore sui mai visti. Ma oggi il motore «non sa niente degli altri
utenti» (§4.6), il server li ha e il titolare li legge solo per le statistiche,
e mostrare a chi studia qualcosa degli altri è una decisione aperta
(`account-progetto.md` §20). Un parametro aggregato per quesito, calcolato da
`server/statistiche.mjs` (senza chi si è opposto, R-ACC-67) e pubblicato con la
banca, è tecnicamente piccolo; è una scelta di privacy e di filosofia.

**Il grafico.** Due forme, provate con dati finti nella sessione:
- **La ragnatela** (otto assi, uno per tema, quanto rispondi giusto). Si legge a
  colpo d'occhio la **forma** — dove sei forte, dove no —, ed è quella che si
  vede nelle app. Due difetti noti: l'area cambia con l'ordine degli assi, e
  **non mostra il peso d'esame**: Navigazione al 60 % costa quattro volte
  Motori al 60 %, e sulla ragnatela sono due punte uguali.
- **Il budget degli errori**: una barra da 0 a 5 con la soglia a 4, e dentro
  quanti errori attesi «spende» ogni tema (peso × probabilità di sbagliare). Si
  legge **la regola dell'esame**, e il tema che pesa di più è il pezzo più
  largo. Sotto, la probabilità di passare in un numero.
- **La proposta:** il budget come indicatore principale, perché dice la cosa
  che conta; la ragnatela se si vuole, come profilo, sempre accanto e mai da
  sola. La **mappa per tema** di Progressi (Q-DUE) resta: è il posto dove si
  agisce.

**La prova con utenti simulati (I-09).** Il modo giusto di provarlo:
1. si inventano **studenti finti** di cui conosciamo la verità — una bravura
   vera per tema e per voce;
2. li si fa rispondere a sessioni realistiche, si dà al modello solo le loro
   righe, e si confronta la sua probabilità di passare con quante delle loro
   simulazioni passano davvero. Una stima è **tarata** se, quando dice 70, le
   prove superate sono circa 70 su 100.

**Il guasto muto di questa prova**: se gli studenti finti sono costruiti con la
stessa struttura che il modello presuppone (bravura per tema, quesiti
indipendenti), il modello sembra perfetto per costruzione. Il test si fa
**anche** con studenti che rompono le ipotesi: chi impara a memoria i quesiti
ripetuti, chi tira a indovinare, chi migliora nel tempo, chi sa una voce sì e
quella accanto no, chi si stanca. Una taratura buona solo sui finti «gentili»
non vale niente. E nessuno studente finto sostituisce il livello 3: la verità è
l'esito dell'esame vero, che chiederemo.

**Che cosa resta fuori, sempre:** il **carteggio**. La stima è dei quiz; il
carteggio apre l'esame e lo giudica chi studia. La frase accanto al numero lo
dice.

**Grandezza.** M per il motore (il modello, la convoluzione, i test, le
soglie) più M per il banco degli studenti finti (lavoro di Claude su `main`); S–M
per la pagina; il parametro di difficoltà dagli altri è una decisione prima che
un lavoro.

**Domande aperte (sessione).**
1. ~~Livello 2 o «esame reale»?~~ — sospeso dall'autore per pensarci.
2. ~~Solo chi si registra?~~ — sì.
3. ~~Chiedere «com'è andata»?~~ — sì.
4. ~~Budget degli errori, ragnatela, o tutti e due?~~ — **tutti e due**
   (l'autore, 3 ottobre).
5. ~~La difficoltà dei quesiti dalle risposte di tutti?~~ — **sì** (l'autore, 3
   ottobre). Che cosa comporta, per la regia: cambia una riga del §4.6 («non sa
   niente degli altri utenti») e chiude in un verso la questione aperta del §20
   di `account-progetto.md`; il dato passa da `server/statistiche.mjs`, quindi
   **senza chi si è opposto** (R-ACC-67); l'informativa deve dire che un
   aggregato delle risposte di tutti torna a chi studia; e serve una **soglia
   minima** di persone per quesito sotto la quale la difficoltà non si pubblica
   — con tre persone che hanno risposto, un aggregato dice qualcosa di loro, ed è
   anche rumore (§4.3). Nessun dato di un singolo esce mai: solo un numero per
   quesito.
6. ~~Tutte le risposte, o solo la prima?~~ — **tutte** (l'autore, 3 ottobre),
   con la ragione: «è vero quello che dici, ma è anche vero che uno nel
   frattempo potrebbe aver studiato». Annotazione di Claude, non una
   contraddizione: le due cose stanno insieme se le risposte **più recenti
   pesano di più**. Chi ha sbagliato e poi ha studiato risponde giusto, e la
   stima sale; chi ha imparato a memoria nella stessa mezz'ora pesa quanto chi ha
   studiato, ed è il prezzo dichiarato. Quanto pesa il recente si sceglie con la
   prova degli studenti finti, mettendoci anche quelli che imparano a memoria.

---

## I-13 — Home, cruscotto e una pagina sola per Percorso e Progressi [autore e Claude]

**Da dove viene.** Il 4 ottobre l'autore ha accettato «in linea di massima» di
unire Percorso e Progressi, e ha chiesto di ripensare menu e cruscotto; e ha
fissato un vincolo: **la simulazione d'esame da subito, con un pulsante ben
visibile.** Qui la proposta di Claude, da discutere.

**Il problema.** Per chi studia ci sono tre domande, non tre pagine: *che cosa
faccio adesso?*, *come sto andando?*, *voglio provare l'esame*. Oggi rispondono
quattro posti diversi, e la terza domanda — la più frequente per chi arriva —
è a tre tocchi.

**La proposta: quattro voci, più i Segnali.**

| Voce | Senza account | Con l'account |
|---|---|---|
| **Home** (`/`) | Che cos'è il sito in una frase; **«Simula l'esame» come primo pulsante**, con le condizioni accanto («20 domande · 30 minuti · al più 4 errori»); «Allenati 10 minuti» come secondo; poi le schermate delle funzionalità, «Com'è fatto l'esame» (C-02), i difetti dichiarati, e che cosa dà l'account | **Il cruscotto**: una proposta sola per oggi con il suo perché (dal motore), **«Simula l'esame» sempre lì**, l'esito delle ultime simulazioni (fatti, I-12 livello 1), la costanza (I-15), i minuti suggeriti (I-04) |
| **Quiz** | Le intenzioni di oggi (argomento, errori, simulazione, giro) | Lo stesso |
| **Carteggio** | Le tre porte, con «Che tecnica serve?» dentro | Lo stesso |
| **La tua rotta** (nome da scegliere) | Che cosa sarebbe, con un esempio, e Accedi | **Percorso e Progressi insieme**: in alto la mappa con il «sei qui» (I-05); sotto i temi con i cinque stati (I-06), la stima e i grafici (I-12) quando sono validati, le prove, l'andamento, le sessioni |
| **Segnali** | Il gioco | Lo stesso |

E nell'intestazione: Accedi/Account e Info.

**Perché così (Claude).**
- **La simulazione è un pulsante della Home, non una voce di menu**: è la cosa
  più cercata, e nella barra sarebbe un'icona fra cinque. Sul telefono il
  primo pulsante della prima schermata è il posto più visibile che c'è.
- **Il cruscotto e «La tua rotta» non si sovrappongono** se il cruscotto dice
  *una* cosa — la proposta di oggi e il suo perché in una riga — e «La tua
  rotta» dice *il resto*. Il «perché» del cruscotto apre la mappa. È la regola
  di ChatGPT (Home = che cosa fare, rotta = perché, progressi = evidenze),
  con le ultime due in una pagina.
- **Il nome**: «Percorso» e «Progressi» sono due cose; «La tua rotta» le tiene
  insieme ed è in tema, con il nome del sito. È una proposta: decide l'autore.
- **Quattro voci più i Segnali sono cinque**: dentro il limite, ma «ci stanno»
  non vuol dire «si capiscono» (ChatGPT): va provato con persone.

**Grandezza.** L: è il progetto dell'interfaccia del ridisegno, con i controlli
che oggi pretendono le viste di adesso (R-NAV-01…07, R-ACC-03, R-ACC-04).

**Rischi.** *Guasto muto:* il cruscotto che propone una cosa e la pagina che si
apre un'altra — il difetto tornato tre volte. La proposta e l'attività vengono
dalla stessa funzione del motore, come «Rifai N errori». Poi: una Home che per
chi ha fatto l'accesso nasconde la simulazione dentro il cruscotto.

**Domande aperte (sessione).**
1. Il cruscotto: quali tre cose al massimo, in quale ordine?
2. «La tua rotta», «Rotta», «Progressi» o un altro nome per la pagina unita?

---

## I-14 — Il test d'ingresso: perché farlo, e come non farlo pesare [autore]

**Il dubbio dell'autore, 4 ottobre:** «il motivo del test da 50 domande va
spiegato bene, e dobbiamo motivare bene le persone a farlo: molte non vorranno
perdere così tanto tempo e impegno.» (Il giro di oggi, «Un giro tra gli
argomenti», è una domanda per ognuna delle 44 voci: 44 domande, circa un quarto
d'ora al ritmo misurato di 23 s a domanda.)

**Per chi.** *Chi comincia da zero* e *chi è in formazione* appena registrato.

**Le idee di Claude, dalla più semplice:**
1. **Non serve un test separato: la prima simulazione è il test d'ingresso.**
   L'autore vuole che chi arriva faccia subito la simulazione; 20 domande con la
   composizione del decreto toccano già gli otto temi nel loro peso. Con il
   modello di I-12, che presta la forza fra quesiti dello stesso tema, 20
   risposte danno già una prima mappa. Nessuno deve «fare un test»: l'ha fatto
   senza accorgersene.
2. **A rate.** Se serve più dettaglio, il giro si spezza in blocchi da 10
   domande (circa 4 minuti), uno per volta, e **dopo ogni blocco la mappa si
   accende di un pezzo**: si vede che cosa è servito.
3. **Adattivo.** Prima una domanda per tema (8); si scende nelle voci solo dove
   il tema è incerto. Il motore sa già fare la selezione per voce
   (`screening()`); l'adattivo è una regola nuova, nel motore.
4. **Il perché, detto in una riga e con il vantaggio concreto**: «10 domande per
   sapere da dove partire: dopo, il sito ti propone ogni giorno quello che ti
   serve, e non quello che sai già». Mai «obbligatorio», sempre «salta».

**Promesse che tocca.** Il test non deve diventare una porta chiusa
(un'attività dietro un altro passo); con le idee 1–3 non lo è.

**Grandezza.** S per l'idea 1 (è una frase e un collegamento); M per 2 e 3.

**Rischi.** *Guasto muto:* una mappa «accesa» dopo 10 risposte che sembra una
diagnosi: le soglie del §4.3 valgono anche qui — sotto, si dice che non si sa
ancora.

**Risposto dall'autore, 4 ottobre 2026: «perfetto»** — la prima simulazione
fa da test d'ingresso, e i blocchi da 10 per il dettaglio. **E un aggancio per
la registrazione:** nel risultato di «Simula l'esame», a chi non ha l'account,
un messaggio del tipo «Registrati: con queste risposte possiamo già costruire
il tuo percorso». È vero — 20 risposte sugli otto temi bastano per una prima
mappa — ed è il momento in cui si ha qualcosa da perdere (lo stesso criterio
dell'ADR-004). Il testo esatto va scritto con le soglie del §4.3: «una prima
mappa», non «la tua preparazione».

**Domande aperte (sessione).**
1. ~~Quale test da 50?~~ — il giro tra gli argomenti.
2. ~~La prima simulazione come test?~~ — sì.

---

## I-15 — La costanza, detta: una gamification leggera [autore]

**L'idea, 4 ottobre.** La stima conta **una osservazione per quesito al
giorno** (riga 15 del confronto): tornare un altro giorno vale più di ripetere
subito. L'autore vuole che lo si dica a chi studia, e che lì si usi una
**gamification leggera**, anche una *streak*.

**Il problema.** Chi studia non sa che ripetere la stessa domanda nella stessa
mezz'ora non serve, e che tornare domani sì; e non ha niente che lo inviti a
tornare.

**Per chi.** Tutte e tre; conta di più per *chi ripassa sotto esame*.

**Promesse che tocca (da riscrivere, se passa):** la filosofia, «Non c'è
gamification: nessuna streak, nessun badge, nessuna notifica»; l'appendice A
della specifica, «Niente gamification». La nota dell'autore del 4 ottobre dice
di andare oltre.

**La proposta di Claude: una costanza che non punisce.**
- **Non la *streak* che si spezza** («hai perso la serie di 12 giorni»): è il
  pezzo della gamification che fa male, perché un giorno saltato cancella il
  lavoro fatto e fa abbandonare. Al suo posto, **«giorni di studio negli ultimi
  14»**: 9 su 14, che sale e scende piano e non si azzera.
- **Detto con il suo perché**: «Tornare un altro giorno conta di più: la stima
  conta una risposta per quesito al giorno.» È la verità del modello, non un
  trucco.
- **Il ritorno che si vede**: i quesiti che oggi «maturano» — giusti ieri, da
  confermare a 12 ore (I-06) — come proposta del giorno: «8 quesiti da
  confermare oggi». È il motivo concreto per tornare, ed è vero.
- **Niente notifiche, niente badge** per ora: non servono a dire la verità, e
  le notifiche chiedono un canale che non abbiamo.

**Che cosa c'è già.** Le righe con `ts`: «giorni di studio» è un conto sulle
righe, nel motore; i quesiti da confermare vengono dalla regola di I-06.

**Grandezza.** S–M. **Rischi.** *Guasto muto:* un contatore che sale con le
risposte e non con lo studio — 9 giorni su 14 con una risposta al giorno. La
soglia di un «giorno di studio» (quante risposte?) va decisa.

**Domande aperte (sessione).**
1. ~~Giorni di studio o *streak*?~~ — **sì alla proposta** (l'autore, 4
   ottobre): «giorni di studio negli ultimi 14», che non si azzera. *Nota per
   la regia:* una sessione parallela sul menu, riportata dall'autore lo stesso
   giorno, scrive «congelamento della serie scartato, visto che hai deciso che
   si azzera»: è il contrario di questa decisione, e va riallineata.
2. ~~Quante risposte fanno un «giorno di studio»?~~ — **deciso dall'autore il
   17 ottobre 2026** (Q-COSTANZA, chiusa nel §10 della specifica): 10 quesiti
   distinti fra quiz e tecniche, o un esercizio di carteggio giudicato, anche
   negativo; i Segnali fuori. Il testo di prima: aperto; proposta di quella
   sessione: un'attività conclusa, anche da dieci domande.

---

## I-16 — Misurare se le spiegazioni aiutano [autore e ChatGPT]

**Da dove viene.** ChatGPT (riga 10 del confronto): verificare che una
spiegazione sia giusta è metà; l'altra metà è vedere se **aiuta** a rispondere
dopo. L'autore, 4 ottobre: «sono d'accordo, ma non ho idea di come fare».

**Il metodo più semplice, proposto da Claude: il rilascio a scaglioni fa da
esperimento.** Le spiegazioni escono poche alla volta, perché le verifica
l'autore (I-10). Quindi per un periodo alcuni quesiti hanno la spiegazione e
altri, simili, non ancora. Si confronta, sulle risposte dei registrati:
- per i quesiti **con** spiegazione: chi li ha sbagliati e ha letto la
  spiegazione, quanto spesso li prende giusti la volta dopo (ad almeno 12 ore,
  come I-06);
- per i quesiti **senza** spiegazione, sbagliati nello stesso periodo: quanto
  spesso li prendono giusti la volta dopo.

Se i primi migliorano di più, la spiegazione aiuta. **Nessuno è escluso apposta**
da niente: la differenza c'è già, perché le spiegazioni arrivano a rate. Il
limite: i quesiti spiegati per primi sono i più sbagliati, quindi non sono un
gruppo uguale agli altri; il confronto va fatto **fra quesiti simili** (stesso
tema, difficoltà simile), o sul **prima e dopo** dello stesso quesito.

**Se non basta: un esperimento vero.** Per ogni persona, metà dei quesiti
mostrano la spiegazione e metà no, scelti a caso ma fissi (dall'identità
dell'account e del quesito), per un periodo dichiarato. È più forte, ma toglie
per un po' una spiegazione a qualcuno: va detto nell'informativa, e deciso.

**Che cosa serve.** Sapere se la spiegazione è stata **mostrata** — una riga in
più, o un campo nella riga della risposta — e i conti passano da
`server/statistiche.mjs`, senza chi si è opposto (R-ACC-67). Le spiegazioni
date a chi non ha l'account non entrano: le sue risposte non restano.

**Grandezza.** M. **Rischi.** *Guasto muto:* concludere «aiuta» da un confronto
fra gruppi diversi (i più difficili migliorano di più anche da soli, per
regressione verso la media).

**Domande aperte (sessione).**
1. ~~Rilascio a scaglioni prima?~~ — **sì** (l'autore, 4 ottobre).

---

## I-17 — I segnalibri [Claude, da GreenWay]

**L'idea.** «Salva questo quesito per dopo»: un segno su un quesito, e un
allenamento «i miei segnalibri». Visto nel concept GreenWay (*Bookmarks*).

**Per chi.** *Chi è in formazione*: il quesito su cui vuole chiedere
all'istruttore, o rileggere il manuale.

**Che cosa serve.** Una riga nuova nell'archivio (`_t` nuovo, con `ts`, come i
tag), che viaggia per `uid` e si fonde come le altre; togliere il segno è una
riga in più, non una cancellazione (append-only). Dei soli registrati se deve
durare; senza account vale per la pagina aperta.

**Grandezza.** S–M. **Risposto dall'autore, 4 ottobre: sì.**

---

## I-18 — Il menu rifatto da zero [Claude, su domanda dell'autore]

**La domanda dell'autore, 4 ottobre 2026:** «se tu dovessi ridisegnare da zero,
in maniera pulita e ottimizzata, tutti i menu, per una UX ottimale, che cosa
faresti?» Con davanti: la proposta I-13, l'analisi di GreenWay e le 14
schermate di una sessione parallela sul menu (riportata dall'autore, non nel
repo), il parere di ChatGPT.

### I principi (Claude)

1. **Il menu segue i tre lavori di chi studia, non le funzioni del sito:**
   *provare l'esame*, *allenarsi su quello che serve*, *sapere come sto*. Più
   il carteggio, che è un'attività fisica diversa (al tavolo, con la carta).
2. **Una schermata, un'azione principale.** Mai due pulsanti che aprono la
   stessa cosa nella stessa schermata.
3. **Ogni attività ha lo stesso giro**: *Preparazione* (una schermata, i valori
   già scelti, un pulsante) → *attività a tutto schermo, senza barra* →
   *Risultato* (i fatti, **un** passo successivo) → *Revisione*. Chiudendo si
   torna da dove si era partiti. Da qualunque porta si entri, è la stessa
   Preparazione.
4. **Profondità massima due tocchi** dalla barra a qualunque attività.
5. **L'account non è una voce**: è l'avatar in alto a destra.
6. **Ogni sezione ha il suo indirizzo** (`/quiz`, `/carteggio`, `/rotta`…): il
   tasto indietro del telefono fa quello che ci si aspetta, e un link si può
   mandare. Oggi `/app` è una pagina sola con le viste dentro.

### La struttura

**Barra: quattro voci.** Sul desktop sale in alto, come oggi.

| Voce | Che cosa risponde | Contenuto |
|---|---|---|
| **Oggi** (la Home) | «che cosa faccio adesso?» | Vedi sotto: cambia con lo stato |
| **Quiz** | «mi alleno sui quiz» | In cima **Simula l'esame** (base, vela, base e vela). Poi **L'allenamento di oggi** (la Mirata, 10 domande). Poi gli otto temi come righe con la barra a cinque stati, che aprono la Preparazione. In fondo «Altro»: errori, segnalibri, giro fra gli argomenti, **Segnali**, **Cerca un quesito per numero** |
| **Carteggio** | «mi alleno sulla carta» | «Giudichi tu» in testa; tre tessere: Prova a tempo, Esercizi, Che tecnica serve?; la bozza da riprendere, se c'è |
| **Rotta** | «come sto andando?» | In alto il «sei qui» del Percorso (I-05) e una riga di fatti (ultime simulazioni, giorni di studio); poi i temi con i cinque stati, tocco → voci → «Allena»; poi prove, andamento, sessioni. Stima e grafici (I-12) quando sono validati |

**In alto a destra: l'avatar** (o «Accedi»), che apre il **Profilo**: account,
data d'esame, «ho già la entro 12» (C-01), scarica / ricarica / azzera, Info,
privacy e condizioni, Esci. Il pallino ambra dei guasti sta sull'avatar,
visibile da ogni schermata.

**«Oggi» in tre stati**, non due:

| Stato | Che cosa mostra |
|---|---|
| Arrivi per la prima volta | Una frase su che cos'è; **Simula l'esame** con le condizioni («20 domande · 30 minuti · al più 4 errori»); **Allenati con 10 domande**; tre schermate dei vantaggi; «Com'è fatto l'esame» (C-02); «Che cosa non torna» |
| Hai risposto, senza account | In cima: «Hai N risposte in questa pagina — salvale e costruiamo il tuo percorso» (I-14); poi gli stessi due pulsanti |
| Con l'account: il cruscotto | **Una** proposta per oggi con il suo perché in una riga (dal motore); **Simula l'esame**; una riga di fatti; il perché apre Rotta |

### Le scelte che differiscono dalle altre proposte, e perché

- **Quattro voci, non cinque: i Segnali stanno in Quiz → Altro, e in una
  tessera della Home.** L'autore li voleva come sezione a sé. La ragione per
  non metterli nella barra: la barra è per i lavori dell'esame che si fanno
  ogni giorno, e i Segnali sono un gioco che si apre ogni tanto; una voce di
  barra usata di rado ruba spazio e attenzione alle altre quattro. La sezione
  resta (una schermata sua, un indirizzo suo, `/segnali`): cambia solo la
  porta. **Decide l'autore.**
- **«Oggi» invece di «Home».** Con l'account la prima voce è il cruscotto di
  oggi, e «Oggi» dice che cosa c'è; «Home» dice solo dove si è. Funziona anche
  senza account («che cosa faccio oggi?»). La sessione parallela proponeva
  «Percorso» o «Oggi»: Claude sceglie «Oggi».
- **«Rotta» invece di «La tua rotta»**: in una barra, una parola. È anche il
  nome del sito.
- **Niente pagina «Traguardi» né badge per ora** (li proponeva la sessione
  parallela). I-15 dà la costanza in una riga; una griglia di badge è una
  schermata in più e non dice niente che la Rotta non dica. Se si vogliono, dopo.
- **La simulazione in due posti (Oggi e Quiz) apre la stessa Preparazione**
  (lo notava anche la sessione parallela): è il principio 3.
- **«Allenati con 10 domande», non «10 minuti»**: senza account il ritmo non è
  misurato, e i minuti sarebbero inventati (la sessione parallela ha ragione).
- **Cerca un quesito per numero** (`1.3.8-15`): è un'idea nuova di Claude. Chi
  studia con il manuale o con la scuola ha il numero del decreto davanti, e
  oggi non ha modo di aprire quel quesito.

### Che cosa resta come oggi
La Preparazione, il runner, il riepilogo e la revisione dei quiz (aree 2 e 3),
le tre porte del Carteggio (area 4), la mappa per tema (area 5): il contenuto
c'è già ed è controllato. Il ridisegno cambia **le porte e i nomi**, non i
mestieri — ed è il motivo per cui è fattibile.

### Grandezza e rischi
L, con un progetto dell'interfaccia prima e i controlli di navigazione riscritti
(R-NAV-01…07, R-ACC-03, R-ACC-04). *Guasto muto:* una schermata che perde il suo
ingresso nel trasloco — il caso di «Che tecnica serve?» del 9 settembre, da cui
è nata la specifica. Il controllo R-NAV-01 («ogni schermata ha una porta») è
fatto apposta: va tenuto acceso durante il ridisegno, con l'elenco nuovo.

### Risposte dell'autore, 4 ottobre
1. Segnali nella barra: **«non so»**.
2. «Oggi» o «Home», «Rotta» o «La tua rotta»: non risposto.
3. **Cerca un quesito per numero: sì.**

### Una seconda proposta: Home · Allenati · Esame · Progressi

L'autore ha portato, lo stesso giorno, la proposta di un'altra sessione
(riassunta qui, non copiata):

```
Home · Allenati · Esame · Progressi                    [serie] [avatar]
```

- **Home**: senza account presentazione, «Simula l'esame», «Allenati con 10
  domande»; con l'account il «sei qui», la proposta di oggi, la serie,
  «Simula l'esame».
- **Allenati**: un selettore a tre segmenti, **Quiz** (aperto per primo),
  **Carteggio** (esercizi e «Che tecnica serve?»), **Segnali**.
- **Esame**: le prove nell'ordine in cui si sostengono — prova di carteggio (4
  esercizi, 60 minuti, 3 su 4), quiz base (20, 30 minuti, al più 4 errori),
  quiz vela (5, 15 minuti, al più 1) —, la data d'esame con i giorni, e le
  simulazioni fatte con l'esito.
- **Progressi**: settimana e serie, traguardi, mappa per tema, andamento,
  sessioni.
- Il suo argomento: **«Esame» come voce a sé è il cambiamento che conta**: dice
  senza spiegoni che l'esame ha più prove e che il carteggio viene per primo, e
  dà un posto fisso a «Simula l'esame»; e separa l'allenamento, che corregge
  strada facendo, dalla prova, che no. Il prezzo che dichiara: Quiz e Carteggio
  perdono la voce propria, e il carteggio ha due ingressi.

### Il confronto, e la raccomandazione di Claude: cambio idea

**La voce «Esame» è migliore della mia soluzione**, per tre ragioni:
- risponde meglio alla paura dell'autore — chi arriva per la simulazione la
  trova in una voce che porta il suo nome, sempre, con o senza account;
- **insegna la struttura dell'esame con la struttura del sito** (C-02 senza una
  pagina in più): tre prove, in ordine, con le loro condizioni;
- si adatta da sola a chi ha già la patente entro 12 miglia (C-01): per lui la
  voce Esame mostra il carteggio (e la vela), non il quiz base.

E il principio che la regge — **allenamento da una parte, prova dall'altra** —
vale per quiz e carteggio allo stesso modo: è più coerente del mio, dove la
simulazione stava dentro Quiz e la prova di carteggio dentro Carteggio.

**Risolve anche i Segnali**: terzo segmento di Allenati, a un tocco, senza una
voce di barra. È la risposta al «non so» dell'autore.

**Che cosa terrei del mio, e che cosa correggerei nell'altra:**
1. **La mappa «sei qui» sta in Progressi**, non in Home: l'autore ha deciso di
   unire Percorso e Progressi; la Home ne mostra una riga, e il perché della
   proposta apre Progressi. Così Home dice *che cosa fare*, Progressi *dove sei
   e perché* (la distinzione di ChatGPT).
2. **Niente serie che si azzera e niente traguardi**: l'autore ha approvato
   I-15, «giorni di studio negli ultimi 14». In intestazione, al posto della
   serie, niente: la costanza sta in una riga di Home e di Progressi.
3. **«Propedeutica», non «eliminatoria»**: la parola del decreto (DM 323/2021,
   art. 6 c. 7, nella nostra ricerca §4.3) è «propedeutiche alla sua
   prosecuzione»; «eliminatoria» è una parafrasi.
4. **Cerca un quesito per numero** in Allenati → Quiz (sì dell'autore).
5. **Allenati si apre su Quiz**, sempre; chi cerca «i quiz» li trova al primo
   tocco. Il rischio vero dell'altra proposta è questo: la parola «Quiz» sparisce
   dalla barra, ed è la parola che la gente cerca. Si prova con persone.
6. **Il carteggio con due ingressi deve sembrare un ambiente solo**: la
   preparazione, la bozza e la revisione sono le stesse schermate, da Allenati
   come da Esame.

**La struttura che ne esce:**

| Voce | Senza account | Con l'account |
|---|---|---|
| **Home** | Che cos'è; **Simula l'esame**; Allenati con 10 domande; schermate; che cosa non torna | La proposta di oggi con il suo perché; **Simula l'esame**; una riga di fatti e di costanza |
| **Allenati** | Quiz (temi, errori, giro, segnalibri, cerca per numero) · Carteggio (esercizi, «Che tecnica serve?») · Segnali | Lo stesso, con i cinque stati sui temi |
| **Esame** | Le prove in ordine con le loro condizioni; la data (per la pagina aperta) | Lo stesso, con la data salvata, i giorni, e le prove fatte con l'esito |
| **Progressi** | Che cosa sarebbe, con un esempio, e Accedi | Il «sei qui», la mappa per tema, la stima quando è validata, andamento, sessioni |
| avatar | Accedi | Profilo: account, data, entro 12, dati, Info, legale, Esci |

**Risposto dall'autore, 4 ottobre 2026:** **sì alla struttura ibrida**, Home ·
Allenati · Esame · Progressi; **sì a «Quiz» dentro Allenati**. Resta da provare
con persone (I-09, Q-PROVE) che chi cerca «i quiz» li trovi.

---

## C-01 — Il candidato che ha già la patente entro 12 miglia [Claude]

**Il problema.** `docs/ricerca-programma-esame.md` §4.2 e §4.5, dal decreto (DM
323/2021 art. 6 c. 2 e c. 11): all'esame senza limiti il **quiz base** si fa
«solo in assenza di abilitazione entro le 12 miglia». Chi ha già la 12 miglia e
la estende fa **solo** la prova di carteggio (più quiz vela e pratica a vela, se
vela). Il sito oggi propone a tutti 1.472 quesiti base. È il punto **D-5** di
quella ricerca, mai deciso.

**Perché adesso.** È la domanda giusta dietro il «entro o oltre 12 miglia» di
I-02: per il sito, chi prende la *entro 12* è fuori ambito (Q-AMBITO, i 50
esercizi `carteggio_e12.json` nel cassetto), mentre chi *ha già* la 12 miglia è
dentro, e ha bisogno di un sito diverso — carteggio prima di tutto.

**Per chi.** Una parte di *chi è in formazione* e di *chi ripassa* che oggi non
abbiamo modo di distinguere.

**Che cosa cambia.** Una domanda («hai già la patente entro 12 miglia?»), e per
chi dice sì: niente quiz base nella proposta, simulazione solo vela, il
Carteggio in primo piano.

**Promesse.** Tocca Q-AMBITO (si allarga) solo se si apre anche alla *entro 12*;
altrimenti nessuna.

**Grandezza.** S–M. **Rischi:** un'informazione che cambia la selezione deve
vivere nel motore (Punto 4 di `decisioni-aperte.md`). **Decisione per
l'autore:** se distinguere i due candidati.

**Risposto dall'autore, 3 ottobre 2026: sì.** Una domanda alla registrazione
(«hai già la patente entro 12 miglia?»), facoltativa come la data, che sposta il
Percorso e la stima (I-12) sul carteggio e sulla vela. È la sola domanda in più
dell'onboarding (I-04), e cambia la selezione: la regola vive nel motore.

---

## C-02 — Spiegare l'esame a chi comincia da zero [Claude]

**Il problema.** Il §1 dice che chi comincia da zero **non sa** che l'esame ha
più prove e che il carteggio viene per primo: era l'evidenza di partenza
dell'autore. `docs/ricerca-programma-esame.md` §4 ha già i fatti, dal decreto:
l'ordine delle prove, la propedeuticità del carteggio, le cinque ore di scuola
obbligatorie, le **vie d'uscita** (art. 6 c. 10: chi fallisce il carteggio può
ripiegare sulla 12 miglia; chi fallisce il solo quiz vela, sulla solo motore).
La ricerca lo chiama «materiale di orientamento di alto valore e di costo nullo
per il motore», e non è mai entrato nel sito.

**Che cosa cambia.** Una pagina «Com'è fatto l'esame», dalla Home e dal
Percorso, con le citazioni del decreto.

**Promesse.** Nessuna; rafforza «la verità prima della rassicurazione». È
contenuto, non insegnamento: dice fatti del decreto, non spiega la materia.

**Grandezza.** S. **Rischi:** testi che invecchiano con la norma (il DM 133/2024
l'ha già fatto); citare, non parafrasare (la ricerca nota che «eliminatoria» è
una parafrasi del sito, non del decreto).

**Risposto dall'autore, 3 ottobre 2026: sì.** Un posto naturale è la Home per
chi non ha fatto l'accesso (I-01, I-03).

---

## C-03 — «Questo quesito non torna»: un modo di segnalarlo [Claude]

**Il problema.** I difetti della banca li ha trovati l'autore studiando (le
figure scambiate, i flap). Con utenti veri, chi trova un quesito strano non ha
dove dirlo, se non le issue di GitHub, che chi studia non usa. E I-10 senza
questo canale è peggio: una spiegazione sbagliata non la segnala nessuno.

**Che cosa cambia.** Sotto un quesito, «Segnala», che apre una mail a
`privacy@`… o meglio a un indirizzo suo, con il numero del quesito già scritto.
Un link `mailto:`, niente modulo e niente server.

**Promesse.** Un indirizzo email nuovo che riceve dati personali (chi scrive) va
nell'informativa. Un modulo invece passerebbe dal server: più lavoro, più dati.

**Grandezza.** S. **Rischi:** una casella che nessuno legge è un guasto muto
rivolto a chi segnala; serve che la lettura stia nella procedura del titolare.

**Risposto dall'autore, 3 ottobre 2026: sì.** L'indirizzo non è stato scelto:
`privacy@` o uno nuovo (proposta di Claude: `segnalazioni@`, perché `privacy@`
è il recapito del titolare per i diritti GDPR e mescolarci le segnalazioni sui
quesiti rende più facile perdere una richiesta con una scadenza di legge).
Nauticalize ha «Segnala un problema» sotto ogni domanda: è l'idea, la forma
resta nostra.

---

## Il secondo parere di ChatGPT — il prompt, 4 ottobre 2026

Scritto da Claude su richiesta dell'autore, che lo lancia nell'app di ChatGPT.
La risposta torna qui con l'autore, come la prima volta («Il confronto con
ChatGPT»).

```
Sei ChatGPT, nel worktree ~/Software/rotta-giusta-ui. Questa è una richiesta
di parere, non di lavoro: non modificare nessun file, non fare commit.

Leggi per intero /Users/ilbeca/Software/rotta-giusta/docs/idee-dopo-gli-account.md
nel checkout principale (sul ramo main, non ancora committato: per questo il
percorso assoluto). È il brainstorming P-59 su che cosa viene dopo la versione
con gli account, fra l'autore e Claude, 3 e 4 ottobre 2026. Contiene anche il
tuo primo parere e la risposta punto per punto («Il confronto con ChatGPT»).

Una regola dell'autore per questa sessione: filosofia, ADR e Vincoli della
specifica NON sono un limite. Stiamo discutendo funzionalità nuove; per ogni
idea si dice che cosa andrebbe riscritto se passa, non che è vietata. Vai oltre
anche tu: proponi, non solo correggere.

Che cosa ti chiedo, su tutto il file:
1. Per ogni idea (I-01…I-18, C-01…C-03) un giudizio breve: che cosa regge,
   che cosa no, che cosa manca. Distingui ciò che hai verificato (nel repo, nel
   browser, su una fonte) da ciò che è un'opinione.
2. Più a fondo su quattro punti:
   a. La struttura dei menu decisa dall'autore (I-18): Home · Allenati · Esame
      · Progressi, Quiz/Carteggio/Segnali come segmenti di Allenati, l'avatar.
      Dove si perde chi studia? Il carteggio con due ingressi (esercizi in
      Allenati, prova in Esame) sembra un ambiente solo o due?
   b. La Home in tre stati (prima visita, risposte senza account, cruscotto) e
      l'aggancio alla registrazione nel risultato della simulazione (I-14).
   c. La stima d'esame (I-12): il modello gerarchico, la difficoltà dagli altri
      utenti, una osservazione per quesito al giorno, la validazione con gli
      studenti simulati e con le simulazioni future. Che cosa manca perché si
      possa mostrare una probabilità senza mentire?
   d. I cinque stati per quesito (I-06) con la regola delle 12 ore, e la
      costanza senza serie che si azzera (I-15).
3. Che cosa non abbiamo visto: idee nuove, rischi, il guasto muto di ogni idea
   che il file non nomina.
4. Un ordine dei lavori proposto, con il perché, distinguendo: decisioni
   dell'autore, ricerche, lavoro su main (motore, server, controlli, documenti)
   e lavoro su ui/main (interfaccia).

Forma della risposta: in italiano, per punti, con il numero dell'idea in testa
a ogni punto; dove non sei d'accordo con una decisione già presa dall'autore,
dillo e spiega perché, ma tienila distinta dalle proposte. Niente codice.
```

---

## Il secondo parere di ChatGPT, e la risposta — 4 ottobre 2026

ChatGPT ha letto il file intero, ha distinto ciò che ha verificato (repo,
browser, fonti) dalle opinioni, e non ha modificato niente. Qui il suo parere
riassunto e la posizione di Claude. Le fonti che cita: Cepeda e altri, sulla
distribuzione nel tempo (<https://pubmed.ncbi.nlm.nih.gov/19076480/>); due
lavori sugli agenti nei test d'usabilità (<https://arxiv.org/abs/2512.03568>,
<https://arxiv.org/abs/2411.00634>); la guida di Stan su modelli gerarchici e
IRT (<https://mc-stan.org/docs/stan-users-guide/regression.html>); la
calibrazione in scikit-learn
(<https://scikit-learn.org/stable/modules/calibration.html>). Non rilette da
Claude.

| Idea | ChatGPT | Claude | Esito |
|---|---|---|---|
| I-01 | I benefici prima delle schermate («capisci gli errori», «sai cosa allenare», «ritrovi il lavoro»). **Guasto muto:** tornare alla Home con una navigazione completa fa perdere le risposte anonime | D'accordo su tutte e due. Il secondo è grave e strutturale: oggi Home (`/`) e sezioni (`/app`) sono **due documenti**, e passare dall'uno all'altro ricarica la pagina, cioè **perde le risposte senza account**. Con la Home dentro la navigazione la cosa diventa quotidiana. Conseguenza tecnica: dopo il primo caricamento il sito deve restare **un documento solo**, con indirizzi veri ma cambiati senza ricaricare (History API); oppure ogni passaggio da un documento all'altro deve dirlo prima | Requisito per il progetto del ridisegno |
| I-02 | «Simula il quiz base», non «Simula l'esame»: l'esame sono tre prove. Il risultato di una prova breve non deve sembrare un «superato» ufficiale | D'accordo: con la voce Esame (I-18) le tre prove hanno ognuna il suo nome; in Home il pulsante dice «Simula il quiz base» con le condizioni | Correzione di testo |
| I-03 | Distinguere account creato, risposte acquisite, sincronizzazione completata | C'è già: R-ACC-39 e R-ACC-43 dicono «salvate» solo quando il server ha nominato ogni riga. Va tenuto nel nuovo giro | I controlli esistenti restano |
| I-04 | Intervalli, non un numero; dire che cosa include | D'accordo | Precisazione |
| I-05 | Una quota minima di esplorazione, e controlli indipendenti dall'ultimo allenamento | D'accordo; la Mirata ha già un blocco di esplorazione, va reso regola del Percorso | Nel progetto del Percorso |
| I-06 | **Controesempio alla regola «le ultime due giuste»:** lunedì 8:00 giusta, martedì 8:00 giusta → sistemata; martedì 8:05 giusta → le ultime due distano 5 minuti → torna incerta. Una risposta giusta non deve togliere una conferma. Regola proposta: **dopo l'ultimo errore, due giuste ad almeno 12 ore l'una dall'altra; altre giuste la mantengono; un errore la riapre.** Le 12 ore sono una scelta pratica, non una soglia dimostrata | Ha ragione, ed è un errore nello schema scritto da Claude. La regola giusta è la sua, e vale allo stesso modo per «ok» (due giuste a 12 ore, nessun errore). Le 12 ore si dichiarano come scelta, e si rivedono con i dati | **Da confermare dall'autore** |
| I-07 | Non convertire i vecchi `C` in «Svista»: mostrarli come classificazione precedente | D'accordo: costa niente ed evita di attribuire una causa che non sappiamo. Le righe restano `C` comunque | **Da confermare dall'autore** |
| I-08 | Criteri misurabili (tempo alla prima domanda, ritorni, Safari vero); stati espliciti quando il server degli account non risponde | D'accordo | Nel progetto |
| I-09 | Tre usi distinti (giri, agenti, studenti statistici); persone che cercano «quiz» senza sapere il menu | D'accordo | Nel progetto del collaudo |
| I-10 | Struttura fissa della spiegazione (perché giusta, perché l'altra inganna, fonte, data); **versione** di ogni spiegazione | D'accordo | Nel progetto delle spiegazioni |
| I-11 | Il pagamento esterno non deve far perdere l'attività anonima | D'accordo: il link si apre in una scheda nuova, come i link delle finestre dell'account da P-58 | Nel progetto |
| I-12 | Definire l'evento: **«superare la prossima simulazione completa del quiz base, senza aiuti»**, vela a parte. Una osservazione al giorno = **la prima risposta del giorno, prima di vedere la correzione**. Errori correlati: il calcolo è esatto solo rispetto alle ipotesi. Registrare la previsione **prima** della prova; soglie di pubblicazione decise prima di vedere i risultati; versione del modello e data. **Calcolare senza mostrare**, intanto i fatti | D'accordo su tutto; corregge tre frasi di Claude («calcolo esatto», «prudente», e l'ipotesi che gli altri utenti migliorino da soli la stima). Una cosa da aggiungere: registrare le previsioni è un dato nuovo sul server — non una seconda contabilità delle risposte, ma va scritto nell'informativa | **Da confermare dall'autore** l'evento e «calcolare senza mostrare» |
| I-13 | Progressi senza account deve mostrare un **riepilogo vero della pagina aperta**, non un esempio. Il caricamento non è un archivio vuoto | D'accordo: è il lavoro appena fatto, e nasconderlo sarebbe la leva che l'autore ha già escluso per le spiegazioni | **Da confermare dall'autore** |
| I-14 | «Prima visita» non si sa: senza memoria nel browser un ritorno sembra una prima visita. 20 risposte bastano per un punto di partenza, non per le voci. Testo: «Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo proporti da dove iniziare». Risultato e revisione restano senza registrarsi | D'accordo su tutto; il testo è migliore di quello di Claude | Correzione di testo |
| I-15 | Arriva a zero dopo 14 giorni: non dire «non si azzera». «Ripetere subito non serve» è troppo forte. Criteri giusti per carteggio e Segnali, e per chi ha cominciato da tre giorni | D'accordo | Precisazione |
| I-16 | Misurare il **trasferimento** (un altro quesito sullo stesso concetto); «mostrata» non è «letta»; versione; ordine di pubblicazione casuale fra spiegazioni pronte | D'accordo; l'ordine casuale fra spiegazioni già verificate è un'idea pulita: nessuno perde niente | Nel progetto |
| I-17 | Semantica di aggiunta e rimozione fra dispositivi | Si risolve come i tag: una riga per ogni gesto, vale l'ultima per istante (`tagPerTentativo()` fa già così) | Nel motore |
| I-18 | Allenati non apre «sempre» su Quiz: apre sul segmento da cui si arriva, e il ritorno ripristina origine e posizione. Il controllo deve guardare **i tragitti**, non solo che ogni schermata abbia una porta | D'accordo: «sempre» era sbagliato. Il controllo dei tragitti è una buona aggiunta a R-NAV-01 | **Da confermare dall'autore** |
| C-01 | L'obiettivo completo: motore o vela, prima patente o estensione | D'accordo: la domanda diventa «che cosa stai preparando?» con tre o quattro risposte | **Da confermare dall'autore** |
| C-02 | Nell'interfaccia si può parafrasare, se la citazione sta nell'approfondimento | D'accordo | Precisazione |
| C-03 | `mailto:` non apre niente senza un programma di posta: mostrare anche l'indirizzo e un «copia il riferimento»; non dire «inviata» | D'accordo | Nel progetto |

**Idee nuove di ChatGPT** (sue, non ancora discusse con l'autore):
- **N-01 «Ero sicuro / avevo un dubbio»**, facoltativo, dopo una risposta
  giusta: per proporre spiegazioni e conferme. Rischio: dichiararsi sempre sicuri.
- **N-02 La raccolta dei dubbi**: segnalibri, errori e giuste con dubbio in una
  lista che lo studente sceglie, da portare all'istruttore.
- **N-03 La ripresa dopo un'assenza** («da dove riprendere», con un controllo
  breve) e **«hai concluso quello che ti avevamo proposto»**, perché il sito non
  sembri chiedere lavoro infinito.
- **N-04 Pagine pubbliche per argomento**, con spiegazioni verificate e
  l'ingresso all'allenamento (era nel confronto con i concorrenti, senza un
  posto nei lavori).
- **N-05 Conservare l'evidenza**: la previsione prima della prova, la versione
  del modello, la versione della spiegazione mostrata. Claude: d'accordo, è ciò
  che rende verificabili I-12 e I-16.
- **Consolidare il documento**: una sola formulazione per decisione. Si fa in
  fondo al file, «Le decisioni di P-59», dopo le risposte dell'autore.

**L'ordine dei lavori di ChatGPT:** (1) menu, percorsi e continuità (I-18,
I-14, C-01); (2) i contratti del motore (I-06, I-05, I-07, I-15); (3) il
ridisegno completo; (4) primo lotto di spiegazioni, segnalazioni, segnalibri;
(5) la stima come ricerca parallela, pubblicata solo dopo la validazione; (6)
prestazioni e collaudi sempre, donazioni quando il percorso è stabile. **Claude
è d'accordo**, con due aggiunte già dette: fondere e pubblicare P-61 per primo
(è pronto), e cominciare **subito** a chiedere «com'è andata» e a registrare le
previsioni, perché i dati per validare arrivano mesi dopo.


**Risposte dell'autore al secondo confronto, 4 ottobre 2026:** **sì a tutte e
sette** le decisioni rimandate (I-06, I-07, I-13, I-12, I-18, C-01, I-02); **sì
a N-01 e N-03**; N-02 e N-04 non scelte, e restano scritte qui sopra.

---

## Le decisioni di P-59

Una formulazione sola per ogni decisione presa dall'autore il 3 e il 4 ottobre
2026, come la chiedeva ChatGPT. Sono **decisioni di brainstorming**: la regia le
smista, e diventano vincolanti quando entrano nella specifica o in un ADR, con
la loro data. «Da riscrivere» dice che cosa cambia nei documenti di oggi, se
passano. Dove una scheda sopra dice altro, vale questa sezione.

**La regola della sessione.** Filosofia, ADR e Vincoli non erano un limite
(l'autore, 4 ottobre): le righe «da riscrivere» sono la conseguenza, non un
divieto.

### Struttura e nomi
1. **Il menu è Home · Allenati · Esame · Progressi**, più l'avatar (Profilo:
   account, data d'esame, obiettivo, dati, Info, note legali, Esci; senza
   account «Accedi»). Il pallino dei guasti sull'avatar, raggiungibile anche
   durante un'attività. Sul desktop la barra in alto. (I-18) — *Da riscrivere:*
   §5 e §6 della specifica, Q-NAV chiusa, R-NAV-01…07.
2. **Allenati** ha tre segmenti, Quiz · Carteggio · Segnali; si apre sul
   segmento da cui si arriva, altrimenti su Quiz; il ritorno da un'attività
   ripristina origine, segmento e posizione. «Che tecnica serve?» sta in
   Carteggio. (I-18, I-03)
3. **Esame** mette le prove in ordine — carteggio, quiz base, quiz vela —, con le
   condizioni del decreto, la data e le prove fatte; mostra le prove che servono
   all'obiettivo scelto. Il carteggio d'allenamento e la prova di carteggio sono
   un ambiente solo con due modalità. (I-18, C-01)
4. **Progressi** unisce Percorso e Progressi: in alto il «sei qui», poi i temi,
   le prove, l'andamento, le sessioni. Senza account mostra il riepilogo vero
   della pagina aperta, e che cosa l'account aggiunge. (I-13, I-05)
5. **La Home** è `/`. Senza risposte: che cos'è il sito con i suoi benefici,
   **«Simula il quiz base»** come primo pulsante con le condizioni («20 domande ·
   30 minuti · al più 4 errori»), «Allenati con 10 domande», schermate,
   «Che cosa non torna». Con risposte e senza account: l'invito a conservarle.
   Con l'account: il cruscotto — una proposta per oggi con il perché, «Simula il
   quiz base», una riga di fatti e di costanza. (I-01, I-02, I-14)
6. **La simulazione si raggiunge subito**, in un tocco, da Home ed Esame, e apre
   la stessa preparazione. (I-02, I-18)
7. **I nomi «vetrina» e «palestra» si tolgono**; si usano i nomi delle sezioni.
   (I-03) — *Da riscrivere:* il titolo di `/app`, `AGENTS.md`, la specifica, la
   skill.
8. **Cerca un quesito per numero** del decreto, in Allenati → Quiz. (I-18)
9. **Requisito trasversale, dal secondo confronto:** chi non ha l'account non
   perde le risposte passando fra le sezioni, né aprendo un link (privacy,
   condizioni, donazione, registrazione). Dopo il primo caricamento il sito resta
   un documento solo. Un controllo guarda i **tragitti**, non solo le porte.

### Account e registrazione
10. **Le funzioni che vivono di uno storico sono dei registrati**: Progressi con
    la mappa e gli stati nel tempo, la stima, il Percorso. (I-03)
11. **Le spiegazioni sono per tutti**, anche senza account. (Confronto, riga 7)
12. **L'invito a registrarsi** sta nella Home, nel risultato di una simulazione
    («Conserva questa prova e ritrovala quando torni. Da queste risposte possiamo
    proporti da dove iniziare») e nei riepiloghi; risultato e revisione restano
    senza registrarsi. (I-03, I-14) — *Da riscrivere:* ADR-004 condizione 2,
    R-ACC-03.
13. **L'onboarding chiede la data d'esame e «che cosa stai preparando?»** —
    solo motore o anche vela, prima patente o estensione dalla entro 12 —,
    tutte e due facoltative e modificabili, anche prima dell'account (senza
    account per la pagina aperta). Niente età, niente livello. (I-04, C-01)

### Il motore
14. **Cinque stati per quesito**: *mai visto*; *debole* — l'ultima risposta è
    sbagliata; *sistemato* — dopo l'ultimo errore, due risposte giuste ad almeno
    12 ore l'una dall'altra, mantenuto dalle giuste successive e riaperto da un
    errore; *ok* — nessun errore e due giuste ad almeno 12 ore; *incerto* — il
    resto del visto. Disgiunti, sommano al totale. Le 12 ore sono una scelta
    pratica, da rivedere con i dati. «Rifai N errori» apre i deboli. (I-06,
    issue #1) — *Da riscrivere:* `classifica()` e chiamanti, R-ARCH-02,
    R-MAPPA-01…13, Q-DUE punto 3.
15. **Due tag, «Non lo sapevo» e «Svista»**, facoltativi; i vecchi `L` e `C`
    restano e si mostrano come classificazione precedente, senza
    riconvertirli. (I-07)
16. **Il Percorso è una mappa con il «sei qui»**, ricalcolata dalle risposte e
    mai salvata, con fasi che orientano e non chiudono porte, una quota minima di
    esplorazione, e controlli proposti dal motore quando è il momento. (I-05)
17. **Il tempo al giorno si suggerisce, non si chiede**: minuti di esercizio,
    come intervallo, con la fonte; mai «ti bastano N minuti per essere pronto».
    (I-04)
18. **La prima simulazione fa da test d'ingresso**; il dettaglio a blocchi di
    10 domande, che esplorano le parti poco osservate. (I-14)
19. **La costanza: «giorni di attività qui negli ultimi 14»**, senza serie che
    si spezza, con criteri giusti per quiz, carteggio e Segnali; più «N quesiti
    da confermare oggi». (I-15) — *Da riscrivere:* filosofia e appendice A,
    «niente gamification».
20. **I segnalibri**: una riga per gesto, vale l'ultimo. (I-17)
21. **«Ero sicuro / avevo un dubbio»**, facoltativo dopo una risposta giusta; da
    verificare prima di usarlo nella stima. (N-01)
22. **La ripresa dopo un'assenza** e **«hai concluso quello che ti avevamo
    proposto»**. (N-03)

### La stima d'esame
23. **L'evento previsto** è «superare la prossima simulazione completa del quiz
    base, senza aiuti»; la vela a parte; il carteggio fuori dalla stima, detto
    accanto. (I-12)
24. **Il modello**: gerarchico (quesito → voce → tema), con la difficoltà dei
    quesiti stimata dalle risposte di tutti i registrati — prime risposte, senza
    chi si è opposto, soglia minima di persone —; una osservazione per quesito al
    giorno, la prima prima della correzione, e lo si dice a chi studia. (I-12) —
    *Da riscrivere:* §4.6 della specifica, l'informativa, §20 di
    `account-progetto.md`.
25. **Si calcola e si registra senza mostrarlo**, con la previsione salvata prima
    di ogni prova, la versione del modello e la data; si valida con gli studenti
    simulati (per le fragilità) e con le simulazioni future dei registrati (per
    la taratura), contro una regola semplice. Le soglie di pubblicazione si
    decidono prima. Intanto la Home e Progressi mostrano i fatti. (I-12,
    confronto)
26. **Quando si mostra**: ragnatela e budget degli errori, il budget principale e
    senza verde/rosso; solo ai registrati. (I-12)
27. **Dopo l'esame si chiede «com'è andata»**, separato per quiz base, vela,
    carteggio e pratica; si comincia a chiederlo presto. (I-12) — *Da
    riscrivere:* la filosofia, «"supera l'esame con noi" non lo diciamo»
    (proposta di frase in I-12).

### Le spiegazioni
28. **Spiegazioni per i quiz**, verificate dall'autore, mostrate solo se
    verificate, con struttura fissa (perché giusta, perché l'altra inganna,
    fonte, data), versione, e il segno «verificata il …»; negli allenamenti
    dopo la risposta, nella simulazione dopo la consegna; anche dopo una risposta
    giusta. Il primo lotto: 50 quesiti misti — più sbagliati, ambigui, con
    figura, con calcoli, divergenti. In un file loro, mai dentro `quiz.json`.
    (I-10) — *Da riscrivere:* filosofia, «il sito non insegna» (frase nuova
    approvata in I-10), §1 della specifica.
29. **Misurarne l'effetto** dal rilascio a scaglioni, con l'ordine casuale fra
    spiegazioni pronte, misurando anche il trasferimento ad altri quesiti; si
    registra che la spiegazione è stata mostrata, e quale versione. (I-16)
30. **«Segnala un problema»** sotto ogni quesito, con l'indirizzo visibile e
    «copia il riferimento»; indirizzo dedicato da scegliere (proposta
    `segnalazioni@`). (C-03)

### Altro
31. **«Com'è fatto l'esame»**: in Esame, una sintesi comprensibile con
    l'approfondimento e le citazioni datate. (C-02)
32. **Donazioni sì, dopo il parere** del professionista sulle 14 domande; link in
    una scheda nuova. (I-11)
33. **Il collaudo**: giri lunghi automatici, agenti esplorativi con un rapporto,
    e poche persone vere, prima del ridisegno completo. (I-09)
34. **Le prestazioni**: prima la misura, su telefono e Safari veri. (I-08)

### L'ordine proposto (ChatGPT, con le aggiunte di Claude)
~~P-61 fuso e pubblicato~~ (fatto: v0.30.0, 3 ottobre) → menu, percorsi e continuità → contratti del motore
(stati, percorso, tag, costanza) → ridisegno → primo lotto di spiegazioni,
segnalazioni, segnalibri → la stima come ricerca parallela, con la raccolta di
«com'è andata» e delle previsioni avviata **subito** → donazioni dopo il parere.

---

## Il miglioramento continuo — brainstorming del 17 ottobre 2026

**Con l'autore, mentre P-81 è in corso.** Niente codice. Il punto di partenza
dell'autore: le funzionalità sono buone, l'interfaccia no, perché il sito è nato
come strumento per una persona sola e non è mai stato pensato per il grande
pubblico. Due domande: farsi aiutare dai generatori di siti (ChatGPT Sites, la
modalità design di Claude), o ripensare la UX da zero intorno all'utente.

### La lettura di Claude, accolta

- **Il «da zero intorno all'utente» è già stato fatto**: le persone del §1, le
  decisioni di P-59, i 108 tragitti di P-65, i mock di P-66…69, il progetto di
  P-79. Quello che manca è **l'utente vero**: P-70 ha zero persone, i nomi sono
  chiusi provvisori, Q-PROVE è aperta. Ripartire da zero rifarebbe lo stesso
  passo con lo stesso buco. Si esce P-81, e da lì si misura.
- **I generatori servono a monte, mai come fonte del sito.** Sono buoni per
  varianti visive e prototipi da mettere davanti a una persona. Una pagina
  generata altrove salterebbe i controlli e quasi certamente rifarebbe i conti in
  pagina («chi disegna non ricalcola»). Il loro risultato è materiale per un mock
  o per un prompt su `ui/*`, mai un file che finisce in `site/`.

### I-19 — Il miglioramento continuo: la misura come quinto passo [autore e Claude]

**Il problema.** Il ciclo BRAINSTORM → SPECIFICA → IMPLEMENTA → REVIEW →
RILASCIO non si chiude: niente torna indietro da chi usa il sito. Il punto cieco
più grande è chi entra senza account e se ne va: per scelta (ADR-004) non lascia
traccia, ed è proprio la persona su cui il ridisegno ha lavorato di più.

**Il ciclo proposto.** Si aggiunge **MISURA → BRAINSTORM**. Le osservazioni
diventano voci con la loro evidenza accanto, non con un'opinione; un triage ogni
mese o ogni stagione; un problema alla volta, con la metrica scritta **prima** del
cambio, come `regola-semplice-1`; poi mock, `ui/*`, rilascio, e la misura dopo.

**Le fonti.**
- **La misura propria** (sotto): conteggi aggregati di eventi sul server del sito.
- **Le righe delle risposte**, attraverso `server/statistiche.mjs`: prove avviate
  e non consegnate (le righe `'a'`), attività non concluse, quesiti che sbagliano
  quasi tutti.
- **Le segnalazioni** (I-21) e **«com'è andato l'esame»** (P-75).
- **Le persone vere**: poche, spesso, con il protocollo di `prova-persone.md`.
  Da dove vengano è ancora da decidere (I-20 è una risposta possibile).
- **I bot di P-70**, solo come controllo che le cose si trovino ancora, non come
  verità sulle persone.

**«Migliorare», per l'autore:** l'interfaccia e la pulizia delle funzionalità.
Pulire non vuol dire per forza togliere: possono entrare prove ed esami nuovi,
modi nuovi di consigliare la priorità degli argomenti, suggerimenti su quale
modalità usare. Si misura con le attività concluse, con il ritorno, con l'esito
dell'esame, **e anche con il numero di registrazioni** (sotto).

**Promesse che tocca.** «Nessun analytics» nel §2.1 della specifica e nella
filosofia. R-ACC-09, che oggi pretende che senza account la pagina non faccia
**nessuna richiesta all'API**. `test_nessuna_risorsa_di_terzi`, che resta valido
se la misura passa dal server del sito. Le due regole diventeranno rosse al primo
contatore, ed è giusto: la decisione è un ADR che le riscrive, non un passaggio
in silenzio. L'informativa.

**Grandezza.** L: un ADR, il server, la pagina, la specifica, l'informativa.

### I-20 — La classe: la scuola nautica e l'istruttore dentro il sito [autore e Claude]

**Il problema.** Chi prepara l'esame resta uno-tre mesi, poi se ne va. Una
community generica (un forum) con venti persone è una stanza vuota, e i contenuti
scritti dagli utenti portano obblighi di moderazione che una persona sola non
regge. L'idea di partenza dell'autore: «perché non una community, e non solo un
sito per l'esame?».

**La forma proposta da Claude.** Un istruttore, o una scuola, crea una classe; gli
studenti ci entrano con l'account; l'istruttore vede l'avanzamento aggregato: chi
è indietro, quali argomenti pesano per tutta la classe. Risolve quattro cose
insieme: le persone vere arrivano ogni stagione da una fonte stabile; entrare in
una classe è un motivo vero per creare l'account; la community è quella che conta
in quel momento (compagni e istruttore); una scuola porta una classe intera ogni
anno.

**Il costo.** L'istruttore vedrebbe dati personali degli studenti: serve una
base giuridica, il consenso dello studente, una sezione nuova dell'informativa.
Il motore regge: `quadro()` su più account è un'aggregazione.

**Prima di costruire, si prova la domanda a costo zero**: una scuola, un
istruttore, la classe successiva, magari con un gruppo di messaggistica accanto.
Se l'istruttore non lo usa, non si costruisce.

**Dopo, forse:** la discussione per quesito («perché la risposta è questa?»),
legata alle spiegazioni e alle segnalazioni. **Fuori per ora:** il «dopo la
patente» (diportisti, uscite), che è un prodotto diverso.

**Stato.** Sospesa ma non persa: l'autore la propone alle scuole nautiche, senza
una risposta a breve.

### I-21 — Una casella per le segnalazioni [Claude]

**Il problema.** «Segnala un problema» (decisione 30, C-03) ha un segnaposto
come indirizzo (A-3): finché resta così, il canale qualitativo è spento.

**La proposta.** `segnalazioni@rottagiusta.it`, una seconda casella Zimbra
Starter su OVH accanto a `privacy@`, che ha già l'accordo sui dati: 0,37 €/mese,
circa 4,50 € l'anno. Le alternative scartate:
- un **alias** verso `privacy@` costerebbe zero, ma mescolerebbe le segnalazioni
  con le richieste che hanno scadenze di legge (un mese, 72 ore), che
  l'attività programmata cerca proprio lì;
- le issue di GitHub chiedono a chi segnala un account GitHub;
- un modulo che scrive sul server vuol dire più lavoro e più dati da custodire.

**Dopo la casella:** l'indirizzo nell'informativa e al posto del segnaposto,
dopo P-81. L'attività programmata può leggere anche questa casella.

### Le decisioni del 17 ottobre 2026

1. **La misura propria, sì**: conteggi aggregati di eventi, senza cookie, sul
   server del sito, per la **prossima release**, con un ADR che riscrive «nessun
   analytics» e R-ACC-09. Niente tracciamento di terzi. P-82 resta com'è.
2. **Il contatore degli ingressi, sì**, come primo pezzo della misura propria.
   Che cosa conta di preciso è da definire.
3. **Le registrazioni si misurano**, insieme alle altre metriche. Non vuol dire
   dark pattern: la leva è **dare più valore all'account**.
4. **Open source e GitHub restano come sono.**
5. **L'interfaccia e la pulizia delle funzionalità** sono il campo del
   miglioramento (I-19).
6. **La classe (I-20) è sospesa**: l'autore la propone alle scuole nautiche.
7. **La casella delle segnalazioni va fatta** (I-21). La crea l'autore su OVH.
8. **Le persone vere: da decidere** da dove e ogni quanto.
9. **Questo file è il file unico delle idee** per le prossime release.

---

## La lettura da fuori — 20 ottobre 2026

**Con l'autore, dopo il rilascio della v0.32.0.** L'autore ha segnalato quattro
testi che confondono: «Simula il quiz base», che poi chiede base, vela o tutti e
due; «Ne aprirai 10» sotto «Allenati con 10 domande»; il riquadro «Che cosa non
torna» in Home; e «Esame», che non si capisce («Il mio esame»?). Poi ha chiesto
come fare perché Claude trovi da solo errori di questo tipo. **Il compito, nelle
sue parole: vedere che cosa capisce un utente che non sa niente del progetto,
«che poi sarà veramente il caso reale». Dobbiamo lavorare tanto sul rendere il
progetto più esplicativo e facile da usare.**

### I-22 — La lettura da fuori come controllo ricorrente [autore e Claude]

**Il problema.** I controlli del progetto misurano che un numero e la lista
che apre vengono dalla stessa fonte, non che una frase si capisca. E chi scrive
e chi rilegge i testi ha letto la specifica: a Claude «Ne aprirai 10» sembrava
naturale perché sa da quale regola viene (R-SEL-03, il numero promesso uguale
alla lista). Due dei quattro esempi dell'autore sono **le nostre regole e la
nostra filosofia finite in schermata** come frasi: «Ne aprirai 10» è la regola
del numero promesso, «I limiti si dichiarano, quesito per quesito» è una frase
di `filosofia.md`.

**Per chi.** Tutte e tre le persone del §1, e soprattutto chi comincia da zero.

**I metodi, e che cosa vede ciascuno.** Nessuno basta da solo.

| Metodo | Che cosa vede | Che cosa non vede | Costo |
|---|---|---|---|
| **Lettori senza contesto, al telefono** (fatto, sotto) | dove ci si blocca, i pulsanti che promettono altro, le parole non capite, la differenza fra quello che il lettore si aspetta e quello che succede | un modello capisce più di una persona: un suo fallimento è un segnale forte, un suo successo è debole | 0,15–0,30 $ e 1–2 minuti a giro |
| **Domande di comprensione a giro chiuso** (fatto) | i fraintendimenti di cui il lettore non si accorge: crede di aver capito e ha capito male | solo le domande che abbiamo pensato di fare | quasi niente, nello stesso giro |
| **Inventario dei testi** (fatto, da un agente con il contesto) | il glossario incoerente, il gergo, le ripetizioni, i pulsanti che portano altrove, contando su tutta la pagina | non è un lettore da fuori: vede la coerenza, non la comprensione | un agente, una volta |
| **Primo sguardo di cinque secondi** | che cosa capisce chi apre la Home: che cos'è il sito, per chi, che cosa toccherebbe | tutto quello che sta dopo la prima schermata | minimo; si fa con una schermata e un lettore |
| **Spiega con parole tue** | si mostra una schermata e si chiede di spiegare ogni elemento; il confronto con il significato voluto è un controllo, non un'opinione | il tragitto | basso |
| **Il lettore che fa da utente sbagliato**: chi ha già la entro 12, chi fa solo vela, chi non legge bene l'italiano, chi ha 60 anni e non scorre | i testi che danno per scontato chi sei | — | basso, un profilo in più |
| **Le parole di chi studia**: come chiamano le cose le scuole, i libri, i concorrenti («schede», «simulazione d'esame», «quiz ministeriali») | i nomi nostri che nessuno usa | — | una ricerca |
| **Persone vere**: la classe dell'autore, due o tre persone, dieci minuti ciascuna, con un compito e senza aiuto | tutto quello che un modello non sa fingere: noia, paura di sbagliare, il gesto vero, Safari | — | il tempo dell'autore; Q-PROVE |
| **La misura propria** (I-19) e «Segnala un problema» (I-21) | dove la gente vera abbandona, a sito pubblicato | il perché | già deciso |

**La proposta di Claude.** Una **lettura da fuori a ogni cambio di testi o di
schermate**, prima della merge su `main`: i cinque lettori di oggi più quelli
che servono a quel cambio, con le stesse domande a giro chiuso, e il confronto
con il giro precedente. Si legge come frequenza, non come prova: «tre lettori
su cinque non capiscono "oscurato"» vale, «arrivano tutti» no. Accanto, **un
elenco di regole per scrivere i testi** (sotto, I-23), da dare a chi scrive
l'interfaccia, e dove una regola si può verificare, un controllo. E poche
persone vere ogni tanto, che restano la sola prova che conta.

**Dove sta lo strumento.** `~/bot-ux/`, fuori dal repo, perché i lettori
partono da una cartella vuota e non ereditano la specifica (misurato il 4
ottobre: lanciato dal repo, un sotto-agente parte con circa 190.000 token di
progetto). Il 20 ottobre il banco ha due cose in più: `--istruzioni`, per dare
al lettore il compito «dimmi che cosa capisci» (`kit/istruzioni-capire.md`)
invece di «arriva lì», e `--domande`, domande che il lettore vede **solo a
giro chiuso**, quando il sito non lo vede più. Profili e domande sono in
`~/bot-ux/rotta-giusta/capire/`, i giri in `capire/giri/`.

**Decisioni dell'autore.** Se la lettura da fuori diventa un passo fisso prima
della merge; chi la lancia (la regia, chi fa la merge, la sessione che cambia i
testi); se le regole di scrittura diventano un documento o una sezione della
specifica.

### I-23 — Che cosa ha trovato la prima lettura da fuori [Claude, dai lettori]

**Come.** Il 20 ottobre, sul sito di `main` (v0.32.0) servito in locale con il
server degli account accanto, cinque lettori Sonnet senza contesto, a 375 px,
senza account: un 24enne iscritto da una settimana; un 19enne impaziente; un
velista di 58 anni che legge tutto; un tedesco che legge l'italiano a livello
B1; un'infermiera di 28 anni con l'esame fra dieci giorni. Il compito di
ciascuno era il suo, più «dimmi che cosa capisci»; a giro chiuso, nove domande
di comprensione. In tutto 1,1 $ e circa otto minuti. Accanto, l'inventario dei
testi di `site/index.html` fatto da un agente con il contesto, con le righe.
**Ogni difetto di funzionamento qui sotto è stato riprodotto a mano, nel
browser, prima di scriverlo.**

**1. Un difetto grave, e non di testo: dopo una risposta sbagliata «Avanti»
può finire fuori dallo schermo, e niente scorre.** Due lettori su cinque si
sono fermati lì e sono usciti con «Termina l'attività» («mi è sembrato di aver
rotto qualcosa»). Riprodotto su `rottagiusta.it` il 20 ottobre: il runner
`#quizrun` è `position: fixed` alto quanto lo schermo, con `overflow` visibile;
dopo un errore il verdetto, l'argomento, la frase dei tag e i due tag spingono
in basso le risposte. A 375×667 (iPhone SE, o un telefono più grande con la
barra di Safari) «Avanti» sta a 745–797 px, sotto il bordo, e né lo scorrimento
della pagina né quello del runner lo portano su. A 375×812 basta una domanda
con tre risposte lunghe (base, 1.8.2-40, la pesca) o la nota di un oscurato.
Nessun controllo lo vede: R-RIF-09 misura lo sbordamento in larghezza, e i
banchi del client rispondono con `element.click()`, che preme anche un
pulsante fuori dallo schermo. **Va corretto prima di tutto il resto**, ed è
dell'interfaccia; un controllo nel banco del client (dopo un errore, a 375×667,
il centro di «Avanti» sta nello schermo e niente gli sta sopra, come R-ACC-76)
è di `main`.

**2. Altri due difetti del runner, visti nelle schermate e misurati.**
- **Dopo la risposta la domanda sparisce.** Il riquadro della domanda (`.qbody`,
  che scorre da solo) si riduce a una riga, e resta visibile solo il numero del
  quesito tagliato a metà: chi ha sbagliato non rilegge che cosa gli era stato
  chiesto.
- **«Metti un segnalibro» e «Segnala un problema» stanno sopra le risposte o
  sopra i tag.** Misurato: «Segnala un problema» a 409–461 px e la prima
  risposta a 405–498; dopo un errore, i tag a 374–418 sopra «Segnala un
  problema» a 330–382. Il lettore B1: «una scatola copriva il testo della
  domanda e delle risposte».

**3. Che cosa hanno capito, dalle domande a giro chiuso.**

| Domanda | Hanno capito | Che cosa vuol dire |
|---|---|---|
| È gratis? | 5 su 5 | «Gratis e open source» in Home funziona («open source» no, per due) |
| Senza account che cosa resta? | 5 su 5 | l'avviso funziona; anzi è ripetuto troppo (sotto) |
| A che cosa serve registrarsi? | 5 su 5 «a salvare»; che cosa si vede in più lo immaginano, nessuno l'ha visto | il valore dell'account non si vede: l'infermiera ha aperto Progressi cercando dove è scoperta e ha trovato un conteggio; «il momento peggiore» |
| Com'è fatto il quiz d'esame? | 5 su 5 | le condizioni in Home funzionano |
| Allenati ed Esame, che differenza c'è? | 0 su 5 sicuri | nessuno ha aperto Esame; il tedesco: «allora che cos'è "Simula il quiz base"?». Conferma l'autore |
| Che cos'è il carteggio, si fa sul telefono? | 1 su 5, chi l'ha aperto | «Quiz e carteggio» e «confronta il lavoro sulla carta» non spiegano niente a chi non lo sa già |
| Che cosa sono gli oscurati? | 2 li hanno visti, nessuno ha capito perché ci sono | «Quesito oscurato dal Ministero — circolare 30432 … dopo il DM 133/2024 … In aula compaiono barrati»: «non so se devo rispondere o saltarla» |
| Il sito ti dice i suoi limiti? | solo il velista, che legge tutto, ricorda «Che cosa non torna» | il riquadro non arriva a chi scorre |
| Come riprendi domani? | 0 su 5 sicuri | il file da scaricare e ricaricare lo ricorda solo il velista, senza averlo provato; e due su cinque pensano che il sito sia per la patente **entro 12 miglia**, con «senza limiti dalla costa» scritto in testa |

**4. Le frasi e le parole, in ordine di quante volte sono tornate.**
- **«Tocca una risposta per vedere quella ufficiale.»** (3 lettori su 5):
  sembra «sbircia la soluzione», non «rispondi». → «Scegli la risposta».
- **«Ne aprirai 10.»** (3 su 5, i tre che l'hanno vista): «aprirai» è una parola strana per delle
  domande, e ripete il titolo. Conferma l'autore.
- **L'avviso «senza account»** (5 su 5 lo ricordano, e 5 su 5 lo trovano
  ripetuto): l'inventario lo conta in circa otto punti, fino a tre volte prima
  della prima domanda. R-ACC-02 lo chiede prima e alla fine, non ovunque.
- **I tag dopo l'errore** (3 su 5): «Se vuoi, indica perché hai sbagliato.
  Puoi saltare questo passaggio.» — «come lo salto?»; «Non lo sapevo» cambia
  colore e basta; «Svista, parola da vecchi». Con il difetto del punto 1 il tag
  sembra il pulsante per andare avanti.
- **«nuovo»** accanto al numero della domanda (3 su 5): «nuovo che cosa?».
- **«tasti 1 2 3 oppure A B C»** su un telefono (3 su 5).
- **«Quiz / Quiz base»** in testa al runner (4 su 5): due righe che dicono la
  stessa cosa e tolgono spazio.
- **«Attività interrotta»** e **«Hai affrontato 1 domanda su 10 proposte. 9 non
  sono state affrontate.»** (2 su 5): sembra un errore, e «affrontate» è
  burocratico.
- **«N. 1.8.2-40»** (3 su 5): nessuno sa a che cosa serve il numero del
  quesito. Serve a chi studia col libro: va detto, o messo più in piccolo.
- **Il gergo** che l'inventario ha trovato e i lettori hanno confermato:
  «banca» («per me è dove tengo i soldi»), «quesiti», «decreto», «DM»,
  «oscurato», «sblocchi», «giro», «foglio», «diagnostica», «avatar», «pallino
  ambra», «in chiaro» («mi è suonato inquietante»), «Carta 0 · Tecniche 0»,
  «COLREG», «estratte» («l'ho letto come tolte»).
- **Un codice interno in schermata**: la preparazione della prova di carteggio
  mostra «Q-CART4: un esercizio per ciascuno dei quattro argomenti è
  un'assunzione del sito…» (`site/index.html:4403`, il testo è
  `PROVA_CARTEGGIO.assunzione` in `site/engine.js:536`). Il codice della
  domanda aperta va tolto dal testo del motore: è di `main`.

**5. Pulsanti che promettono altro** (inventario e lettori).
- «Simula il quiz base» apre «Simula la prova», con la scelta fra tre (autore,
  il tedesco, l'inventario).
- Due «Simula la prova» in Allenati → Quiz: uno porta alla sezione Esame,
  l'altro apre la preparazione.
- Nel Profilo, «Dati» apre «Info e diagnostica», e «Che cosa stai preparando?»
  e «Data d'esame» aprono lo stesso modulo; il velista ha cercato che cosa il
  sito fa dei suoi dati ed è finito in un pannello «da tecnici» con «0,0 MB su
  10240,0».
- «Note, fonti e riferimenti» in Home apre «Info e diagnostica», con i difetti
  in fondo, chiusi.
- «Torna al riepilogo» e «Torna all'attività» anche quando non c'è né l'uno né
  l'altra.
- «Vedi un esempio» nel Carteggio apre l'esempio sotto, fuori dallo schermo:
  «sembrava non succedere nulla».
- «Allenati con 10 domande» porta a una preparazione e non alla prima domanda
  (3 su 5 non se l'aspettavano): una schermata in più fra il tocco e la domanda.

**6. Il glossario.** Lo stesso concetto ha molti nomi, e la stessa parola fa
due mestieri. Dall'inventario, con i conteggi:
- domanda / quesito / quiz (52 «quesito», 27 «domanda»);
- prova / simulazione / esame, e «Prova» anche verbo («Prova 155 mai visti»,
  che è un allenamento);
- progressi / archivio / copia / righe / dati / storico;
- Info / Account / Profilo / Dati: «Profilo» compare nei testi e nessun
  elemento si chiama così;
- sette etichette per due gesti, rivedere e rifare; e «Riprova» vale sia
  «rifai l'operazione» sia «rifai le domande sbagliate»;
- mai visti / mai incontrati / mai fatte / mai provati / «nuovo»;
- ufficiale / ministeriale;
- argomento / tema / voce, che si scambiano.

**7. Le regole per scrivere i testi, proposte da Claude.** Ogni testo che si
vede passa da queste domande:
1. Il pulsante promette quello che si apre? Il titolo di ciò che si apre è il
   pulsante, o lo continua.
2. Il numero dice qualcosa che il titolo non dice? Se no, via.
3. C'è una parola nostra? Banca, quesito, oscurato, decreto, riga, archivio,
   copia, attività, sblocco, diagnostica, ufficiale: ognuna o si spiega lì, o si
   cambia. I codici (Q-…, R-…, P-…, DM, circolari) mai in schermata fuori da un
   «Approfondisci».
4. È già stato detto su questa schermata, o su quella prima? Una volta basta.
5. Si capisce senza aver letto altro? Chi arriva da un link legge da lì.
6. Dice che cosa fare, non solo che cosa non succede? Niente negazioni in fila.
7. Una parola, un significato; un significato, una parola (il glossario sopra).
8. Su un telefono, a 375×667: il pulsante che serve per andare avanti si vede?

Le regole 1, 2, 3 (i codici), 7 e 8 si possono controllare almeno in parte; le
altre sono lettura.

**Che cosa non ha visto.** La sezione Esame (nessun lettore l'ha aperta, ed è
già un risultato); l'account; il carteggio oltre l'esempio; la vela; Safari; il
gesto vero. Un lettore Sonnet non si annoia e non ha paura di rompere qualcosa
come una persona: le persone vere restano Q-PROVE.

**Decisioni dell'autore, in parole semplici.**
1. **Chi corregge il blocco su «Avanti»** e quando: è il più urgente, perché chi
   sbaglia una domanda su un telefono piccolo non può più andare avanti. È un
   file dell'interfaccia: ChatGPT su `ui/main`, oppure Claude sullo stesso ramo
   con ChatGPT fermo.
2. **I nomi.** «Simula il quiz» al posto di «Simula il quiz base» in Home (sì
   dell'autore, 20 ottobre); «Il mio esame» al posto di «Esame» nella barra
   (proposta dell'autore: va misurato che le quattro voci stiano a 320 px senza
   rimpicciolire il testo, §6.3). Più la parola unica per ogni riga del
   glossario.
3. **«Che cosa non torna»** in Home: dividerlo. I limiti della banca restano,
   detti in parole semplici; le due righe sulla privacy vanno con l'avviso
   «senza account»; il carteggio va nel Carteggio. Le due righe sulla privacy
   non c'erano nel testo deciso (`ridisegno-progetto.md` §4) e sono entrate
   durante la realizzazione; mancano invece i benefici che lì erano previsti.
4. **Il metodo** (I-22): se diventa un passo fisso.

---

## 21 ottobre 2026 — La lettura da fuori di ChatGPT

**Autore: ChatGPT. Stato: osservazioni e proposte, nessuna decisione né correzione.**
Il sito esaminato è la **v0.32.0**, servita in locale dal worktree `ui/main`:
base `b7d2e2c`, `site/` e `server/` senza differenze rispetto al tag. La
lettura riguarda ciò che una persona può capire dalla pagina, non la
conformità della banca né la validità legale dell'esame. I-22 e I-23 non
sono state lette durante questa prova: il confronto è aggiunto soltanto dopo
la scrittura di questa sezione. Il mandato anticipava già il possibile
problema di «Avanti»: la sua verifica è indipendente, la scoperta non può
essere dichiarata cieca. I lettori non hanno ricevuto questa anticipazione.

### I-24 — Sul telefono: proseguire, leggere la domanda, trovare le fonti

**Autore: ChatGPT.** Questi sono difetti riprodotti nel Chrome locale dal
coordinatore, con schermate e misure. I racconti dei lettori sono indicati a
parte. Coordinate e dimensioni qui sono **pixel CSS**; i PNG sono al doppio.
Non sono prove su un telefono fisico.

**1. Dopo un errore il comando per proseguire può uscire dal telefono.**
A 375×667, nell'allenamento breve, sul quesito **1.3.3-42** oscurato,
«Avanti» è a **y=746,20…798,20**, largo 347 e alto 52: nessuna parte è
sullo schermo. Il runner è alto 667 ma il contenuto arriva a 798;
`overflow-y` del runner è `visible`. Una rotella da 1.100 px non cambia
posizione né `scrollTop`. Non è soltanto un bottone più in basso nella pagina.

Controprova ripetibile dalla ricerca pubblica, senza modificare la pagina:
Allenati → cerca **1.3.3-42** → apri il quesito → Inizia → scegli «due»
invece dell'ufficiale «tre». Su questa attività di un quesito il comando
si chiama «Vedi il riepilogo», e ha gli stessi **y=746,20…798,20**.
Dopo rotella e gesto touch resta fuori. Ripetuto con emulazione touch attiva
(`hover:none`): stessa posizione, `scrollTop=0`. A **375×812** lo stesso
quesito e lo stesso errore lasciano tutto il comando in vista, e il tocco
apre il riepilogo. Non è dunque un blocco su ogni errore o ogni telefono.

Sul quesito **1.1.1-1**, sempre a 375×667, dopo errore il comando è a
**645,70…697,70**: resta una striscia visibile di circa **21,30 px**. Questo
è un comando tagliato, non la prova che sia completamente irraggiungibile.
Dando la risposta giusta sullo stesso quesito, invece, sta a **529…581** e
il tocco apre il riepilogo. A 375×812 anche l'errore lascia il comando
integro (**674…726**), azionato con successo. Non ho usato `element.click()`
per dichiarare funzionante un controllo fuori schermo.

Evidenze esterne: `verifica/errore-667.png`,
`verifica/errore-scorso-667.png`, `verifica/misure.json`;
`verifica-casi/1.3.3-42-667-errore-dopo.png`,
`verifica-casi/1.3.3-42-812-errore-dopo.png` e `verifica-casi/misure.json`;
`verifica-extra/oscurato-touch-errore.png` e relativo `misure.json`.
Il giro diagnostico sceglie apposta risposte sbagliate dalla banca: non
attribuisce al modello la capacità di sbagliare su comando. L'uscita
«Termina l'attività» resta: è bloccato il proseguimento col dito, non tutto
il sito. Renderer: `site/index.html:120`, `:127`, `:769`, `:3237`.

**2. La domanda può ridursi a una fessura prima ancora della risposta.**
Sul medesimo oscurato, a 375×667, `.qbody` misura **347×22**, con **289 px**
di contenuto interno; la domanda nella schermata iniziale non si legge.
Sono visibili numero mozzato, avviso e tre risposte. A 375×812 la stessa
area è alta **161,33 px**. Non sto deducendo l'invisibilità da un selettore:
la schermata `verifica-casi/1.3.3-42-667-errore-prima.png` la mostra.
Lo scorrimento interno esiste, ma una fessura di 22 px non restituisce una
lettura normale. È la stessa famiglia di impaginazione del punto 1, non
un secondo conteggio di utenti bloccati. Nei due giri casuali di verifica
l'overflow orizzontale misurato era **0 px** a entrambe le altezze: questo
non impediva il guasto verticale.

**Un secondo meccanismo, riprodotto dopo la segnalazione di E.** A 375×812,
segno dalla ricerca i quesiti **1.1.1-24** (figura) e **1.7.5-17** (formula),
apro l'allenamento sui due segnalibri, scorro la figura, rispondo e premo
«Avanti». La domanda nuova eredita una posizione interna: `.qbody` è a
**y=193,48…401,78**, con `scrollTop=160`; il testo comincia a **y=69,66**, e
l'inizio rimane fuori dall'area che lo ritaglia. La lettrice lo descrive come
«coperto da Quiz / Quiz base», ma la misura mostra **scorrimento interno
rimasto sulla domanda successiva**, non prova che il titolo si sovrapponga.
La rotella del banco a **(187,420)** non cambia nulla: quel punto è sotto la
fine dell'area scorrevole. Ripetendola **dentro** l'area, a circa **(187,298)**,
`scrollTop` torna a **0**, il testo comincia a **229,66** e l'inizio ricompare.
Evidenze: `verifica-scroll-due/seconda.png`, `seconda-scroll-banco.png`,
`seconda-scroll-interno.png`, `misure.json`; il suo percorso originale è in
`e-01/bot/schermate/006.png`–`008.png`. Ho riprodotto il taglio, **non** un
blocco assoluto della lettura su un telefono vero. Il banco aggrava il difetto
perché non permette al lettore di scegliere dove scorrere. Le otto domande
di un primo tentativo casuale non l'avevano riprodotto: non bastava ripetere
un giro diverso. Nessuna risposta è stata cambiata nella banca.

**3. «Note, fonti e riferimenti» apre la diagnostica dall'inizio.**
C cercava affidabilità e provenienza dei quesiti. Ho ripetuto il tocco dalla
Home a **375×812**: titolo «Info e diagnostica» a **y=36**, pannello alto
780 px con `scrollTop=0`; «Che cosa non torna, e lo diciamo» è a
**y=1229,34**, e il dettaglio sottostante a **1298,94**, **chiuso**.
Le fonti esistono più sotto: non sono assenti, ma il punto di arrivo non
corrisponde alla promessa della porta. Evidenza: `verifica-fonti/dopo-tocco.png`
e `verifica-fonti/misure.json`. Il bottone è in `site/index.html:812`;
`vaiInfo('difetti')` a `:5127` aprirebbe il dettaglio, ma il gestore in capture
di `data-v` a `:5816` precede quel percorso. Questa è una spiegazione dal
codice successiva alla riproduzione, non una riparazione.

Nello stesso pannello ho anche visto e misurato **due copie consecutive** di
«spazio usato dal sito 0,0 MB su 10240,0 disponibili». È una ripetizione
riprodotta, di gravità inferiore, non una prova che lo spazio sia calcolato
male. C l'aveva segnalata; l'evidenza è la stessa schermata.

**L'avvio della simulazione: attrito verificato, non pulsante rotto.**
«Simula il quiz base» apre una preparazione, come prescrive il §7.1 della
specifica, non una domanda. In quella preparazione, senza aprire i dettagli,
«Inizia la prova» comincia a **y=866,88** e finisce a **918,88**, sia a
375×667 sia a 375×812. Con uno scorrimento diventa accessibile:
**531,88…583,88** sul basso e **676,88…728,88** sull'alto. B si è fermato
prima di farlo; D ha trovato l'avvio dopo aver aperto anche la composizione.
Evidenze: `verifica-extra/sim-667.png`, `sim-812.png`, `sim-scorso-667.png`,
`sim-scorso-812.png` e `misure.json`. L'interpretazione «parte subito» è
un disaccordo tra etichetta e aspettativa, anche se il contratto tecnico è
rispettato; non autorizza da sola a togliere la preparazione.

### I-25 — Che cosa è passato e che cosa no

**Autore: ChatGPT.** I cinque profili e le nove domande sono gli stessi file
usati dall'altra prova, senza leggerne i risultati. A = 24 anni da zero;
B = 19 anni impaziente; C = velista di 58 anni con patente entro 12;
D = 35 anni, italiano B1; E = candidata di 28 anni, esame fra dieci giorni.
Non sono cinque persone, né cinque modelli diversi: sono cinque esecuzioni
indipendenti dello stesso modello. Le frequenze qui descrivono questi giri.

| Lettore | Mosse | Tocchi | Scorrimenti | Secondi | Chiusura dichiarata e riscontro reale |
|---|---:|---:|---:|---:|---|
| A | 6 | 6 | 0 | 107 | «arrivato»; riepilogo parziale di 2 risposte corrette |
| B | 1 | 1 | 0 | 28 | abbandona nella preparazione; nessuna domanda affrontata |
| C | 26 | 10 | 15 | 341 | «arrivato»; privacy, esempio di carteggio e preparazione della simulazione, senza avviarla |
| D | 5 | 3 | 2 | 109 | «arrivato»; runner reale 1/20 con timer, senza rispondere |
| E | 20 | 16 | 4 | 245 | «arrivato»; 5 risposte, 3 corrette e 2 errate, Progressi e revisione |

Sono **58 mosse, 36 tocchi, 21 scorrimenti e un Indietro**; 63 schermate,
zero tocchi classificati a vuoto dal banco e zero eccezioni JavaScript
registrate. Questi zeri convivono con i difetti di I-24. Quattro «arrivato»
non dimostrano che quattro persone arriverebbero, né che abbiano capito tutto.
I profili hanno `traguardo: false`: non ho riciclato quel valore in una
percentuale di successo. Il riepilogo di A, il timer di D e la revisione di E
sono riscontri di stato; «ho capito» resta una dichiarazione del modello.

**Le nove domande, accanto al significato voluto.** Le risposte sotto sono
quelle dei rapporti finali, trascritte senza correggerle. Le domande sono
state consegnate dal banco soltanto dopo `arrivato`/`abbandona`, quando ogni
ulteriore azione sul sito viene rifiutata. In ciascun rapporto la chiave
`domande` contiene tutte e nove le risposte.

**1. Gratis.** Significato voluto: Tutte le attività sono gratuite; l’account serve a conservare, non a sbloccare attività. `index.html:805`, specifica §2.4.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | Sì, nella Home c'era scritto «Gratis e open source» e che potevo provare senza account. |
| B | Non lo so, ho saltato i paragrafi. |
| C | Sì. All’inizio c’era scritto Gratis e potevo aprire le attività senza registrarmi. |
| D | Sì, nella pagina iniziale c’era scritto Gratis. |
| E | Sì, nella Home c’era scritto Gratis e open source. |

**2. Chiudere senza account.** Significato voluto: Non resta niente: risposte e preferenze solo nella memoria della pagina, perse anche ricaricando. `:806`, §3.2.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | Non resta niente: perdo le risposte e anche le preferenze. |
| B | Non lo so. |
| C | Non resta niente: perdo risposte e preferenze anche ricaricando la pagina. |
| D | Non resta niente: le risposte si perdono chiudendo o ricaricando la pagina. |
| E | Non resta niente: le risposte si perdono chiudendo o ricaricando la pagina. |

**3. Registrarsi.** Significato voluto: Salvare risposte e ritrovarle nel tempo e su altri dispositivi; mappa e storico dei Progressi. Non equivale a riprendere una simulazione interrotta. `:810`, `:855`, §7.4.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | A salvare i progressi. |
| B | Non lo so. |
| C | A conservare risposte, risultati e progressi e ritrovarli in seguito. Serve un’email. |
| D | A salvare i progressi. |
| E | A salvare i progressi e ritrovare le risposte quando torno. |

**4. Quiz d’esame.** Significato voluto: Base: 20 domande, 30 minuti, massimo 4 errori. Vela: 5, 15 minuti, massimo 1. Numeri da `meta.prove`, `:2536`; correzione finale.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | 20 domande, 30 minuti, al massimo 4 errori. |
| B | 20 domande, 30 minuti, massimo 4 errori. |
| C | Base: 20 domande, 30 minuti, massimo 4 errori. Vela: 5 domande, 15 minuti, massimo un errore. La correzione arriva alla fine. |
| D | Il quiz base ha 20 domande, 30 minuti e permette al massimo 4 errori. C’erano anche vela e base e vela, ma non so come funzionino. |
| E | 20 domande, 30 minuti, al massimo 4 errori. |

**5. Allenati / Esame.** Significato voluto: Allenati offre quiz con riscontro immediato, carta e segnali; Esame organizza le prove e le simulazioni a tempo. Il carteggio resta autovalutato in entrambe le porte. `:814`, `:854`, §7.9.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | Nell'allenamento mi corregge dopo ogni risposta; nella simulazione la correzione arriva alla fine. |
| B | Non lo so. |
| C | Allenati permette esercizi e quiz anche per argomento, con correzione durante l’allenamento. Esame propone prove a tempo con correzione finale. |
| D | Non lo so. Ho visto un pulsante per allenarsi con 10 domande; nella simulazione la correzione arriva alla fine. |
| E | Nell’allenamento scelto erano dieci domande con correzione dopo ogni risposta; nell’esame la correzione arriva alla fine. |

**6. Carteggio e telefono.** Significato voluto: Problemi di navigazione su carta nautica fisica con strumenti; telefono per testo, risultato ufficiale e giudizio proprio. Riconoscimento tecniche possibile senza carte, non equivalente a risolvere. `:820`–`:827`, §7.3.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | Non lo so. Ho visto che c'entra il lavoro sulla carta, ma non ho capito se si fa sul telefono. |
| B | Non lo so. |
| C | Sono problemi di navigazione da costruire sulla carta nautica con squadrette e compasso. Il telefono mostra il problema e il risultato ministeriale; il lavoro sulla carta lo giudico io. |
| D | Non lo so. Ho pensato a un lavoro sulla carta nautica, ma non ho capito se si fa sul telefono. |
| E | È il lavoro sulla carta nautica. Ricordo che il sito parlava di confrontare il lavoro sulla carta; non so cosa si possa fare direttamente sul telefono. |

**7. Quesiti oscurati.** Significato voluto: Oscurati dal Ministero, non escono all’esame; conservati negli allenamenti con avviso, esclusi dalle simulazioni. La Home dice solo «non escono nella simulazione», il dettaglio spiega il resto. `:2532`, `:2572`, `notaPrima()`, README.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | Non li ho visti. |
| B | Non li ho visti. |
| C | Li ho visti nominare: sono 37 e non compaiono nella simulazione. Non ho capito perché siano oscurati. |
| D | non li ho visti |
| E | Non li ho visti. |

**8. Limiti dichiarati.** Significato voluto: Il sito affianca scuola e manuale; non è materiale ufficiale né una garanzia di superamento; banca datata con note e oscurati, carteggio autovalutato. `:812`, `:954`, `:978`, §1 e §7.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | Ricordo che l'allenamento non è una simulazione e che senza account non salva niente. Altri limiti non li ricordo. |
| B | Non lo so, non ho letto le spiegazioni. |
| C | Dice che la raccolta è del 2022, che alcune domande hanno limiti o note e che manca una figura. Non corregge il lavoro di carteggio e superare la simulazione non garantisce l’esame. |
| D | Diceva che il risultato della simulazione non garantisce l’esito dell’esame e che senza account non salva niente. |
| E | Mi ha avvertita che senza account perdevo le risposte e che le misure richiedono abbastanza dati. Non ricordo altri limiti dichiarati. |

**9. Riprendere domani.** Significato voluto: Creare l’account e conservare le risposte prima di chiudere; accedere per ritrovarle. Senza account le risposte chiuse non si recuperano. Una nuova simulazione non riparte dallo stesso timer/lista. `:1410`, `:1740`, §7.5.

| Lettore | Risposta dopo la chiusura |
|---|---|
| A | Per riprendere con i progressi salvati dovrei registrarmi. Le risposte fatte oggi senza account le perderei chiudendo la pagina. |
| B | Non lo so. |
| C | Mi registrerei per conservare i progressi. Senza registrazione non ritroverei le risposte dopo aver chiuso. Una simulazione interrotta non riprende con lo stesso tempo e la stessa lista. |
| D | Penso che serva registrarsi per salvare i progressi. Senza account dovrei ricominciare; il tempo e la lista non riprendono da dove ero. |
| E | Avrei dovuto creare un account per salvare. Avendo provato senza registrarmi, se chiudo domani devo ricominciare. |

**Lettura delle risposte.** Quattro su cinque ricordano gratuità, perdita
alla chiusura e utilità del salvataggio; B non lo sa perché ha saltato i
paragrafi. Tutti e cinque ricordano **20/30/4**, ma E conosceva già l'esame
nel profilo: non significa che il sito lo abbia insegnato a cinque lettori.
A e D non sanno spiegare il carteggio; E sa che è lavoro sulla carta ma non
quale parte si faccia sul telefono. Soltanto C ne descrive strumenti e
autovalutazione, dopo avere visitato l'ambiente. B non sa nulla: sono
**quattro risposte non complete su cinque**, non quattro interpretazioni
errate del medesimo testo. Quattro non hanno visto gli oscurati; C li ha
visti ma ricorda solo l'esclusione dalla simulazione. Non si può concludere
che cinque persone abbiano letto e frainteso l'avviso completo.

A e D non ricordano una spiegazione completa dei limiti didattici; E nomina
soprattutto salvataggio e soglie. C coglie più limiti perché legge più
superfici. E attribuisce uno dei propri errori alla domanda tagliata: il
taglio è riprodotto in I-24, ma **non è dimostrato** che avrebbe risposto
correttamente con il testo intero. Il registro ha ricevuto la risposta che
ha dato: questa prova non autorizza a cambiarla.

**Frasi e parole: frequenza dei segnali espliciti, non voto al testo.**
Nella prima colonna conto una volta ciascuno dei cinque lettori che ha
annotato un dubbio, una ripetizione o un'utilità non capita; distinguo questi
casi. Le citazioni sono riportate nella forma del sorgente quando esiste:
le apostrofi del rapporto non sono una prova di esatta trascrizione. Non
conto come comprensione chi non ha incontrato una frase. I due primi sguardi
e la spiegazione isolata sono un gruppo separato.

| Frequenza | Frase esatta o frammento visibile | Dove | Osservazione |
|---|---|---|---|
| 4/5: A,C,D,E | «Senza account le risposte valgono solo finché questa pagina resta aperta. Se la chiudi o la ricarichi, le perdi. Non salviamo niente, nemmeno le tue preferenze.» | `index.html:806`, `:818`, `:915`, costante `:1410` | Capita da tutti e quattro, ma annotata come lunga o ripetuta; E la seconda volta la salta. Non è una frase incomprensibile. |
| 3/5: C,D,E | «Gratis e open source.» | `:805` | C e D non capiscono il valore di «open source»; E non ne vede utilità per studiare. «Gratis» funziona. |
| 3/5: A,D,E | «N. 1.5.1-65», «N. 1.4.1-21», «N. 1.1.1-24» | numero dinamico da `:3140`, trasformato in maiuscolo dal CSS | A e D non sanno che uso farne accanto a 1/N; E intuisce un codice ma non lo usa. Il riferimento ha una funzione col libro, non va cancellato per questo. |
| 2/5: A,D | «confronta il lavoro sulla carta.»; «carteggio» | `:805`; ambiente `:820` | Non descrive a chi comincia il gesto concreto; D ipotizza la carta nautica senza capirne il ruolo. |
| 2/5: A,E | «Ne aprirai 10.» | `:5779` | Ripete numero nel titolo e descrizione; è ridondanza percepita, non conteggio sbagliato. |
| 2/5: A,E | «tasti 1 2 3 oppure A B C» / «tasti: 1 2 3 oppure A B C» | `:3158`, `:3159` | Superflui per il telefono impersonato. Il banco emula le dimensioni mobili ma non attiva il touch: non dimostra che compaiano su un telefono reale. |
| 1/5: C | «Carteggio, quiz base e vela: preparali in parallelo, senza sblocchi.» | `:811` | «Senza sblocchi» presuppone una restrizione che C non si aspettava; la capisce più tardi in Esame. |
| 1/5: C | «Con l'account ritrovi la mappa e la storia.» | `:811` | Non sa quale mappa né quale storia prima di averle viste. |
| 1/5: C | «La banca è del 2022. I limiti si dichiarano, quesito per quesito.» | `:812` | Intuisce «banca», non sa se il materiale sia adeguato al proprio esame. |
| 1/5: C | «37 quesiti oscurati: non escono nella simulazione d'esame; l'avviso compare prima della risposta.» | generata in `:2532` | Resta il dubbio decisivo: escono o no all'esame vero? In questi giri nessuno ha letto l'avviso completo prima di rispondere. |
| 1/5: C | «4 quesiti con nota dopo la risposta; 3 citano il DM 133/2024.» | generata in `:2532` | Conteggi visibili sulla banca di oggi: C non capisce l'effetto pratico, non contesta il numero. |
| 1/5: C | «Scegli un giro fra tecniche diverse o prosegui nell'ordine del foglio» | `:826` | Non sa quale foglio. |
| 1/5: E | «5 risposte in questa pagina · Quiz 5 · Carta 0 · Tecniche 0» | generata in `:5570` | Non sa che cosa sia «Tecniche»; «Carta» abbrevia un'altra attività. |
| 1/5: E | «Le misure compaiono solo quando ci sono abbastanza dati.» | `:855` | Non sa quali misure né quale soglia; qui la mappa richiede anzitutto l'account, non altre risposte anonime. |
| 1/5: C | «il pallino ambra sull’avatar si accende da solo.» | `:930` | Non riconosce l'avatar a cui la frase rimanda. |
| 1/5: D | «La ripartizione ministeriale dei quiz base è per tema.» | `:2926` | Decodifica con fatica; «Quiz vela» e «Base e vela» non gli spiegano l'aggiunta all'esame. |
| 1/5: C | «issue pubbliche», «sincronia», «in chiaro», «analytics», «indirizzo IP», «sito statico», «posta transazionale» | `privacy.html:45`, `:48`–`:50`, `:53`, `:67` | Alcuni termini li deduce dagli esempi; non vanno tutti letti come fallimenti. «In chiaro» diventa comprensibile leggendo chi può accedere. |

A non capisce «fanale di coronamento»; D annota «condotta», «diportistica»,
«segnalamento», «scafo», «ormeggi», «concessionario», «natanti» e la risposta
lunga del quesito **1.4.1-21**. Sono testo della banca o denominazioni dei suoi
temi, non microcopy da riscrivere liberamente (`site/dati/quiz.json`, una riga
sola). La prova segnala un bisogno di supporto didattico; **non propone di
semplificare l'Allegato A**. Avere indovinato due risposte non dimostra che A
abbia imparato i termini.

**Le porte e ciò che ci si aspettava.**

| Porta | Lettori che annotano lo scarto | Che cosa accade | Valutazione |
|---|---|---|---|
| «Allenati con 10 domande» | A,E | Preparazione e «Inizia l’allenamento» | Promessa di avvio percepita; il passaggio intermedio rispetta la specifica ma sorprende. |
| «Simula il quiz base» | B,D; C osserva il passaggio e lo accetta | Preparazione con «Quale prova» già selezionata e avvio sotto la piega | B abbandona; D prosegue; non è la stessa gravità per tutti. |
| «Note, fonti e riferimenti» | C | Inizio di Info e diagnostica | Scarto di destinazione verificato in I-24, non semplice gusto. |
| «Progressi» | E | Attività della pagina, non mappa per argomento senza account | Comportamento intenzionale (§7.4), aspettativa non soddisfatta; la revisione le permette comunque di trovare gli errori. |
| «Avanti» | E | Inizio della domanda successiva fuori dall'area visibile | Riprodotto in I-24, con il contributo del banco al mancato recupero. |

**Proposte di riscrittura — decide l'autore.** Non sono requisiti adottati,
né una proposta di rifare Home · Allenati · Esame · Progressi.

| Testo attuale | Proposta da provare | Perché e limite |
|---|---|---|
| «Esercitati sui quesiti del decreto e confronta il lavoro sulla carta.» | «Fai pratica con le domande ufficiali. Per il carteggio risolvi problemi di navigazione sulla carta nautica e confronti il tuo risultato con quello ufficiale.» | Spiega un gesto e un oggetto prima del termine; andrebbe provata anche una versione più corta. |
| «37 quesiti oscurati: non escono nella simulazione d'esame…» | «37 domande escluse dal Ministero: non escono all'esame e nelle nostre simulazioni. Negli allenamenti le trovi con un avviso.» | Dice prima l'effetto sullo studio; il numero resta derivato dalla banca, non scritto a mano. |
| «Con l'account ritrovi la mappa e la storia.» | «Con l'account ritrovi le risposte dei giorni precedenti e gli errori per argomento.» | Nomina il contenuto; non promette una diagnosi attendibile sotto soglia. |
| «…preparali in parallelo, senza sblocchi.» | «Puoi esercitarti su ogni prova fin da subito.» | Toglie il concetto estraneo di sblocco mantenendo l'accesso libero. |
| «Simula il quiz base» / «Allenati con 10 domande» | Se resta il passaggio intermedio: «Prepara la simulazione del quiz base» / «Prepara un allenamento di 10 domande». | Da provare, non necessariamente il testo finale. Un avvio diretto sarebbe una diversa decisione di comportamento, non una correzione silenziosa del copy. |
| «Le misure compaiono solo quando ci sono abbastanza dati.» | «La mappa per argomento e lo storico richiedono un account. I risultati che non hanno abbastanza risposte restano in attesa.» | Separa la condizione account dalla sufficienza dei dati. Le soglie precise vanno descritte vicino alla misura interessata. |
| «Quiz 5 · Carta 0 · Tecniche 0» | «Quiz 5 · Esercizi su carta 0 · Riconoscimento delle tecniche 0» | Stessi nomi delle attività; quantità sempre dal riepilogo del motore. |
| «N. 1.4.1-21» | «Numero nel decreto: 1.4.1-21» | Mantiene il riferimento utile al libro e lo distingue dalla posizione nella prova. |
| Avviso anonimo lungo ripetuto | Per le ripetizioni: «Le risposte restano finché tieni aperta questa pagina. Chiudendo o ricaricando le perdi.» | Da confrontare con il testo completo, senza togliere l'informazione sulle preferenze dove viene scelta una preferenza. Non propongo di nascondere il costo del mancato salvataggio. |

Per «Note, fonti e riferimenti» non basta un sinonimo: occorre decidere se
la porta debba arrivare direttamente alle fonti già presenti. Non propongo
di togliere la diagnostica né il pallino dei guasti. «Gratis» resta ben
visibile; spostare il dettaglio sul codice libero nelle informazioni è una
proposta editoriale, non la prova che l'open source sia inutile.

### I-26 — Metodo, limiti e proposta per le prossime verifiche

**Autore: ChatGPT.** Ho usato il banco esistente e aggiunto un gemello
`giro-codex.mjs` soltanto nella cartella esterna della prova. Il vecchio
`kit/giro.mjs` e il suo avvio di Claude non sono stati cambiati. Il comando
`codex` di Homebrew non partiva per un binario mancante; ho usato il CLI
incluso nell'app desktop, con **gpt-6.1-sol**, ragionamento **medium**.
Otto processi distinti: cinque giri e tre letture di immagini. Nessun
riuso della conversazione fra lettori, nessun modello Claude.

**Che cosa entrava nel contesto, verificato.** Ogni processo parte nella
propria cartella `bot/`, fuori da ogni repository e inizialmente vuota;
poi vi arrivano le schermate del suo Chrome. Riceve il profilo, il testo di
`istruzioni-capire.md` (solo «Read» adattato a `view_image`), il percorso di
`passo.mjs` e le normali istruzioni del CLI e degli strumenti. Non riceve
questo coordinatore, la specifica, la filosofia, AGENTS del repo o risultati
altrui. `~/.codex/AGENTS.md` risulta **vuoto, 0 byte**; non mi sono affidato
soltanto a questo. Ho imposto `project_doc_max_bytes=0`, disattivato memoria,
plugin, app e hook, ignorato la configurazione utente nell'esecuzione,
usato `--skip-git-repo-check` e `--ephemeral`. Autenticazione esistente,
senza copiarla o stamparla.

La prima esportazione `debug prompt-input` mostrava ancora **38 nomi di
skill globali**, fra cui coordinate nautiche, pur partendo fuori dal repo.
Li ho disabilitati esplicitamente. Ogni giro conserva un `contesto.json`:
nessun catalogo di skill, nessun blocco di memoria, nessun AGENTS di progetto;
restano istruzioni generiche su permessi e agenti, ambiente e prompt del
lettore. Sono circa **16 KB** di input aggiunto per i cinque giri, oltre al
prompt base del CLI e alle descrizioni degli strumenti: non è una stima del
numero di token dell'intera conversazione. Non ho modificato `HOME` o la
configurazione dell'autore. L'audit delle trascrizioni trova **zero comandi
esterni a `node …/passo.mjs …`**; le altre letture sono immagini. Questa è
isolazione del contesto con audit, non una gabbia del filesystem che renda
materialmente impossibile leggere qualunque altro file.

**Banco.** Prima di ciascuno dei cinque giri e del banco diagnostico:
`lsof` su **8620, 8787 e 8799**, tutte libere. Un giro alla volta, Chrome e
database nuovi, account server locale, nessuna email inviata. Pagina e
conti reali non utilizzati. I giri usano **375×812**, scala 2. Le verifiche
aggiunte confrontano **375×667 e 375×812**. Il tetto tecnico è 35 azioni,
ma restano i limiti più stretti e le condizioni di abbandono dei profili.
Nessuno lo raggiunge: massimo C con 26. La schermata mostra il sito vero,
non una versione di carta. Il banco non è stato adattato per far passare
questa interfaccia; il suo punto fisso di scorrimento resta un limite
misurato in I-24. La ripetizione dei suggerimenti di tastiera è un altro
segno dell'emulazione incompleta: dimensioni mobili non equivalgono a un
telefono fisico.

**Gli altri metodi e il loro campo visivo.**

| Metodo | Che cosa ha trovato | Che cosa non poteva vedere |
|---|---|---|
| Primo sguardo, due processi nuovi su Home a 375×667 e 375×812 | Entrambi riconoscono gratuità, patente senza limiti, quiz e carteggio; entrambi non sanno spiegare «carteggio» e «quesiti del decreto». Sul basso scelgono «Simula il quiz base», sull'alto «Allenati con 10 domande». | È una consegna di sguardo rapido su PNG, **non un'esposizione umana cronometrata di cinque secondi**. Non misura attenzione reale, salienza statistica o esito del tocco. |
| Spiega con parole tue, processo nuovo sulla prima schermata Carteggio | 17 elementi spiegati. Capisce che servono carta e strumenti e che giudica lui; non sa come cominciare o valutare un procedimento sconosciuto. «La prova», «risposte valgono», «tracciamento» e l'icona i accanto ad Accedi lasciano dubbi. | Legge soltanto ciò che entra nel PNG: non vede «Vedi un esempio» sotto la piega. Non prova che quella funzione manchi. |
| Inventario del coordinatore | 216 frammenti HTML letterali con numero di riga, più lettura dei template dinamici attraversati; stessa attività chiamata Carta / carteggio / esercizi su carta, tecniche abbreviate, descrizioni di comportamento con «banca», «voci», «misure». | Non è l'inventario di tutti gli stati autenticati, degli errori e dei template possibili. È un controllo mirato, distinto dalle frequenze dei lettori. |
| Lettore fuori dall'aspettativa media, già compreso nei cinque | C entra con patente entro 12 e diffidenza sui dati; D legge in italiano B1. Producono rispettivamente dubbi su fonti/aggiornamento e attrito linguistico. | Non c'è un giro dedicato alla sola vela, né una popolazione rappresentativa. |

I due primi sguardi e la lettura per elementi non entrano nel denominatore
5 delle frequenze. Non ho usato la mia conoscenza della specifica per
riempire i loro «non lo so». Il questionario è rimasto identico: le domande
non anticipano il percorso, ma alcune parole («oscurati») sollecitano a
ricordare una cosa che il lettore potrebbe non avere cercato spontaneamente.

**Costi e tempi misurabili.**

| Esecuzione | Secondi | Input cumulativo | Di cui cache | Output |
|---|---:|---:|---:|---:|
| a-01 | 107 | 499.823 | 471.808 | 3.031 |
| b-01 | 28 | 170.586 | 151.296 | 1.116 |
| c-01 | 341 | 2.694.029 | 2.635.904 | 9.297 |
| d-01 | 109 | 421.813 | 379.008 | 3.807 |
| e-01 | 245 | 1.766.687 | 1.715.456 | 6.198 |
| sguardo-667 | 8 | 26.959 | 12.288 | 103 |
| sguardo-812 | 7 | 26.126 | 12.288 | 121 |
| spiega-carteggio | 44 | 27.227 | 12.288 | 1.657 |
| **Totale** | **889** | **5.633.250** | **5.390.336** | **25.330** |

Sono **14 minuti e 49 secondi sommati** dei processi, non il tempo di lavoro
complessivo; le tre letture di PNG sono state eseguite durante il giro C.
Input non in cache: **242.914 token**; 549 token di ragionamento sono una
parte dell'output, non un costo da sommare di nuovo. L'input cumulativo
conta i successivi invii della conversazione e per il **95,7%** è in cache:
non significa che ai lettori siano entrati cinque milioni di token di
progetto all'inizio. Il CLI autenticato con l'account riporta uso, **non
un importo in dollari o euro**. L'importo monetario non è quindi misurato:
non lo converto con un listino diverso dal contratto di questo account.
Questi totali non comprendono i token del coordinatore né assegnano un
prezzo al tempo umano. Preparazione, riproduzioni e scrittura sono lavoro
aggiuntivo, non nascosto nel tempo dei lettori.

**Il mio parere sul metodo — proposta.** Sì a una lettura da fuori prima
di ogni merge che cambia testi o schermate, ma **proporzionata al cambiamento**:
per poche etichette, uno sguardo o una parafrasi indipendente sulla superficie
toccata e un giro del profilo interessato; per ingresso, navigazione,
salvataggio o percorso di studio, tutti e cinque i profili e le stesse nove
domande a giro chiuso. Il pannello di confronto deve conservare anche
«non l'ho visto», distinguere esposizione da comprensione e confrontare la
stessa versione. Una frequenza su cinque esecuzioni non è una percentuale
prevista di utenti in difficoltà e non diventa un test verde di usabilità.

Terrei fissi: principiante da zero, impaziente che salta paragrafi, esperto
entro 12 che cerca prove e fonti, lettore B1, candidata sotto esame che vuole
capire gli errori. Sono gli stessi cinque di oggi: tre sotto i trent'anni,
uno fra 50 e 60, una donna su cinque; la composizione riflette grossolanamente
il corso riferito dall'autore ma non rende il campione rappresentativo.
La sola vela va aggiunta quando cambia quel percorso. Per il runner
aggiungerei sempre una risposta volutamente sbagliata, un quesito con figura
e lo schermo basso, **con scorrimento che possa indicare il punto**.
Niente nuova soglia meccanica «passano 4 su 5»: un solo blocco riprodotto
pesa più di quattro successi dichiarati. Una correzione visibile richiede
poi la sua verifica su pagina e dispositivo; i bot restano segnali per
una prova con persone, non la sua sostituzione.

Proporrei queste regole di scrittura: nominare l'effetto prima del meccanismo;
usare lo stesso nome per un'attività in porta, riepilogo e ritorno; far
corrispondere il verbo del bottone al passo che apre; spiegare un termine
nautico necessario al primo incontro; mantenere gratuità e perdita dei dati
esplicite evitando copie lunghe identiche su ogni passaggio; distinguere
«hai risposto così» da «sei preparato»; dichiarare un limite con la conseguenza
pratica e l'azione possibile, invece del solo numero del decreto. Le parole
ministeriali della banca restano quelle: il supporto si aggiunge intorno,
non si riscrive il quesito. Nessuna di queste proposte modifica la specifica.

**Che cosa non ha visto questa prova.** Persone e gesti veri, Safari e iOS,
tastiera virtuale, lettori di schermo, rete lenta o caduta, account e progressi
con storia reale, ritorno domani, scelta sola vela, pratica nautica,
affidabilità delle fonti esterne e validità delle risposte ministeriali.
Nessuno dei cinque ha incontrato il dettaglio completo sugli oscurati; il
coordinatore lo ha esercitato per il difetto verticale, che è un'altra prova.
Non ho ripetuto ciascun profilo per stimarne la variabilità: una scelta
casuale diversa cambia i quesiti incontrati, come si è visto cercando di
riprodurre E. Il «primo sguardo» non misura cinque secondi di una persona.
Il mio inventario non può essere chiamato una seconda lettura cieca: ho
letto specifica, filosofia, sorgente e istruzioni, come richiesto al
coordinatore. Solo i lettori hanno il contesto isolato.

**Materiale grezzo, fuori dal repository.** Tutto è sotto
`~/bot-ux/rotta-giusta/capire/chatgpt-2026-10-21/`: cinque cartelle `a-01`…`e-01`
con prompt, contesto, comando, azioni, schermate, trascrizione, rapporto ed
esito; `sguardo-667`, `sguardo-812`, `spiega-carteggio`; cartelle `verifica*`
con immagini e geometria; gemello Codex, script diagnostici, inventario e
audit. Le domande originali restano nel loro file, non nei prompt iniziali.
Una copia di questa stesura, prima di aprire I-22/I-23, è conservata come
`lettura-prima-del-confronto.md`, con hash e data in `indipendenza.json`.

#### Confronto con la lettura di Claude

Aggiunto **dopo** avere scritto I-24–I-26 nel worktree e conservato la copia
indipendente con hash `c627ba57a96219492310d8972f666144a11c86eb11dad7d27a315b2a977c5aa6`.
Letto con `git show main:docs/idee-dopo-gli-account.md`, dal `main` locale
**34bf4ca**. Non ho importato I-22 e I-23 nel mio ramo, né riscritto i risultati
indipendenti alla luce del confronto. I numeri di Claude qui sono **quelli
che riporta I-23**, non una mia ri-esecuzione dei suoi giri.

**Trovato da entrambi.** Il blocco del proseguimento dopo errore sullo schermo
basso; la domanda che si riduce a una riga; le due porte Home che aprono una
preparazione anziché una domanda; l'avviso anonimo ripetuto; «Ne aprirai 10»;
il codice del quesito senza spiegazione; il gergo di banca, mappa, storia,
Tecniche, avatar; difficoltà nel dare senso al carteggio senza aprirlo;
valore dell'account poco visibile; la porta delle fonti che arriva alla
diagnostica. Le mie misure confermano quest'ultima, non solo lo scarto di
aspettativa. Per le parole, i conteggi dei due gruppi vanno mantenuti
separati: non sono dieci persone indipendenti.

**La verifica richiesta su «Avanti».** I-24 conferma già il blocco basso,
prima della lettura di I-23. Dopo il confronto ho cercato anche il quesito
preciso indicato da Claude, **1.8.2-40**, e ho sbagliato apposta. A **375×812**
il comando finale è a **y=821,77…873,77**: interamente fuori; a **375×667**
ha le stesse coordinate. Rotella e gesto touch non lo recuperano. Nel giro
singolo il testo è «Vedi il riepilogo»: è lo stesso controllo `#r-next`,
mentre il mio giro breve di I-24 ha misurato il testo «Avanti». Evidenze
aggiunte *dopo* il confronto: `confronto-claude/misure.json` e
`1.8.2-40-812-errore-dopo.png`. Questo estende la mia verifica a un caso
che si blocca anche a 812; non invalida i due controlli su quesiti più corti
che a quell'altezza funzionavano. Concordo con la priorità proposta da Claude:
il proseguimento va messo davanti alla rifinitura dei testi. Qui non lo
correggo, come richiesto.

**In più nella mia prova, rispetto a quanto scritto in I-22/I-23.**
La sequenza di E isola un altro meccanismo: dopo avere scorso una figura,
la domanda seguente conserva lo scorrimento interno, e il banco prova a
scorrere fuori da quell'area. Ho separato taglio reale e limite dello
strumento; non registro come «impossibile leggere» ciò che recupero
scorrendo nel punto giusto. I due primi sguardi mostrano anche una scelta
diversa al cambiare della porzione visibile della Home, senza dedurne una
percentuale di preferenza. La parafrasi del Carteggio capisce carta e
strumenti ma non il gesto da compiere o come autovalutarsi senza sapere il
procedimento: è più specifico di «non sa cos'è il carteggio». Sul metodo,
la sonda ha trovato il catalogo globale delle skill ancora presente fuori
dal repo, prima di disabilitarlo. Il raddoppio dello spazio disponibile in
Info è riprodotto e documentato, ma resta un rilievo minore.

**Solo nella lettura di Claude, non emerso spontaneamente nei miei cinque.**
«Tocca una risposta» inteso come sbirciare; tag che sembrano obbligatori o
«Svista» non capita; «nuovo» ambiguo; «Attività interrotta» vissuto come un
errore; il codice **Q-CART4** nella preparazione della prova; «Dati» e i
ritorni del Profilo; «Vedi un esempio» interpretato come un comando senza
effetto perché l'esempio si apre sotto. C nei miei giri ha trovato e seguito
l'esempio: non smentisce chi non l'ha trovato nell'altro gruppo. Non ho
riprodotto tutti questi ulteriori casi, e non li promuovo a difetti verificati
da ChatGPT. Anche per la sovrapposizione degli strumenti descritta da Claude
serve distinguere rettangolo e pittura: nei miei casi i rettangoli degli
strumenti possono intersecare quelli delle risposte, ma il genitore li
ritaglia. I soli `getBoundingClientRect` non dimostrano quale controllo si
veda o riceva il tocco. Il taglio di E è confermato; la sua spiegazione
«coperto da Quiz / Quiz base» non era il meccanismo misurato.

**Dove differiscono risultati e giudizio.** Claude riporta **5/5** su gratis,
perdita e salvataggio: qui sono **4/5**, perché B salta quei paragrafi e non
risponde. Su Allenati/Esame Claude riporta **0/5 sicuri**: qui A, C ed E
spiegano correttamente la differenza del riscontro immediato/finale, D la
spiega solo in parte, B non sa. Non equivale a conoscere tutta la struttura
delle due sezioni: solo C visita Esame. Sul ritorno domani, quattro dei miei
lettori sanno dire «registrarsi per conservare», B no; nessuno prova davvero
il ritorno o la ripresa dopo una chiusura. Non ho osservato il fraintendimento
«sito per la entro 12» riportato da Claude per due lettori: D resta incerto
su quale patente gli serva, che è diverso. Sono variazioni di modello,
esposizione, quesiti casuali e criterio di lettura, **non un miglioramento
tra due versioni del sito**, che è la stessa v0.32.0. Non trasformerei le
frequenze più favorevoli del mio gruppo in un via libera.

Sul metodo concordo con il controllo prima della merge, ma proporrei la
scala di I-26 invece di imporre cinque giri completi per ogni piccola
etichetta. Concordo con parole coerenti, verbo fedele alla destinazione,
assenza di codici interni e prova sul basso. Non adotterei «una volta basta»
come divieto assoluto di ripetere: chi entra da un link deve trovare lì le
informazioni necessarie, e il costo di chiudere va detto vicino alla scelta.
Né metterei automaticamente ogni riferimento normativo dietro
«Approfondisci»: **Q-CART4** è un codice interno da togliere dal linguaggio
utente, una fonte ministeriale può essere utile dopo averne spiegato l'effetto.

I-23 registra già il sì dell'autore a «Simula il quiz» e una proposta su
«Il mio esame». Questa prova non li applica né li converte in una nuova
struttura. La mia proposta indipendente «Prepara la simulazione» va letta
accanto a quella decisione: togliere «base» può semplificare il nome, ma da
solo non chiarisce che il primo tocco apre una preparazione. La scelta del
testo e del comportamento resta dell'autore.

---

## Le regole dai buoni standard — 21 ottobre 2026

### I-27 — Le regole dai buoni standard, e l'audit delle schermate [autore e Claude]

**Da dove nasce.** Le due letture da fuori (I-22…I-26) dicono dove chi arriva
si perde. L'autore vuole di più: pagine e contenuti **più semplici, eleganti e
curati** — «gli altri siti mi sembrano meglio» — e non ha un campione di
persone vere. Il 21 ottobre ha scelto di **partire dagli standard e dalle
buone pratiche**, invece che dal gusto o da siti da imitare.

**La misura che ha orientato la scelta** (Home a 375×812, 20 ottobre, nel
browser): Rotta Giusta 106 parole nel primo schermo, 247 in tutto, 2,9
schermi, 7 corpi di carattere, 8,3 parole per frase, Gulpease 73; Nauticalize
57, 1.371, 12,6 schermi, 13 corpi, 14,2 parole per frase, Gulpease 60. Le
nostre frasi sono più corte e più leggibili: il problema non è la scrittura
delle frasi, è **che cosa mettiamo in testa e la gerarchia visiva**.
L'elemento più evidente del nostro primo schermo è un riquadro bordato che
avvisa che senza account si perde tutto.

**Le fonti, in tre gradi.**
- *Standard misurabili*: WCAG 2.2; ISO 24495-1:2023 (linguaggio chiaro);
  l'indice Gulpease per l'italiano.
- *Sistemi di design pubblici, provati con le persone*: Designers Italia (AgID),
  GOV.UK Design System e la sua guida al contenuto, Apple Human Interface
  Guidelines, Material 3.
- *Pratiche di mestiere*: Refactoring UI, la tipografia pratica di Butterick,
  le leggi della UX, le euristiche di Nielsen.

Le regole danno chiarezza, semplicità e coerenza; non danno da sole un
carattere riconoscibile, che resta una scelta dell'autore. La verità detta dal
sito non si toglie: si sposta e si dice una volta (filosofia, ADR-004).

**Il piano.**
1. **Le regole**: una trentina, ognuna con la sua fonte verificata, se si
   misura e come. *In corso.*
2. **L'audit della Home** a 375×812, 375×667 e 1280 px: misure, schermate e
   violazioni, regola per regola. *In corso.*
3. L'audit della schermata della domanda: dopo la Home.
4. Le regole misurabili diventano controlli nei test e vincoli nella
   specifica (Claude, su `main`); le altre una lista di revisione per chi
   disegna (`ui/*`).
5. Un piccolo sistema di design nel CSS — scala dei caratteri, scala degli
   spazi, ruoli dei colori — su `ui/*`.
6. L'elemento distintivo del marchio: decisione dell'autore, dopo.

**Prima di tutto, a parte:** il blocco su «Avanti» dopo una risposta
sbagliata, confermato da tutte e due le letture (I-23 e I-24), è un difetto
di funzionamento e non aspetta le regole.
