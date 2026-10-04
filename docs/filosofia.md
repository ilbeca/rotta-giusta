# Rotta Giusta — filosofia e valori

**Data:** 12 settembre 2026. **Riscritto il 25 settembre 2026**, dopo
l'ADR-003 e l'ADR-004: senza account si prova e non resta niente; con l'account
si salva, e le risposte stanno sul server in chiaro. **Rivisto il 3 ottobre
2026**, dopo l'ADR-005: niente offline, e niente passaggio dell'archivio di
prima degli account. **Rivisto il 4 ottobre 2026**, dopo l'ADR-006: il sito
comincia a spiegare, l'invito a registrarsi sta anche nella Home e nel
risultato di una simulazione, e la costanza si dice.
**Che cos'è:** non è una specifica e non prescrive un'interfaccia. È il perché
sotto le scelte — in che cosa crediamo, e da dove viene ogni convinzione.
Serve come sorgente a due destinazioni diverse: a `docs/specifica.md`, quando
deve motivare un requisito invece di limitarsi a elencarlo; e a chi scrive i
testi dell'interfaccia, quando deve decidere che cosa dire in una schermata
"perché esiste questo sito" senza reinventare ogni volta il tono.
**Penna:** Claude, su `main` — stesso territorio di `specifica.md`, per la
stessa ragione: due mani che riscrivono un documento di valori produrrebbero
due filosofie leggermente diverse, ed è esattamente il tipo di divergenza
silenziosa che questo progetto ha già pagato una volta (vedi `specifica.md`,
§0).

---

## Il nostro impegno

**Creare una palestra onesta e sicura per chi si prepara a questo esame.**

Onesta, perché dice sempre la verità su come sta andando la tua preparazione
— anche quando la verità è scomoda: "questo quesito non torna", "non
sappiamo che cosa hai studiato fuori da qui", "su questo argomento non hai
ancora visto abbastanza per dirti qualcosa". E perché dice la verità anche su
di sé: che cosa conserviamo di te, dove, e chi lo legge.

Sicura, perché se ti registri i tuoi progressi non si perdono più quando cambi
telefono, e perché quello che conserviamo lo custodiamo come si deve e lo
cancelliamo quando non serve più. **Non vuol dire più** quello che voleva dire
fino al 25 settembre 2026 — che le tue risposte non potevano arrivare a
nessuno. Se ti registri arrivano a noi, e le leggiamo. Il perché, e che cosa
costa, è più sotto.

Non è uno slogan scritto una volta e poi lasciato lì. È la stessa promessa
che il resto di questo documento verifica riga per riga — e per questo, se un
giorno smettesse di essere vera, sarebbe questa la prima riga da correggere.

## Da dove veniamo

Questo sito nasce da un bisogno vero: l'autore doveva prendere la patente
nautica, ha scritto per sé una palestra di quiz e carteggio, e con quella
palestra ha superato l'esame il 3 settembre 2026. Il codice, i test, il metodo
di lavoro — tutto quello che oggi è "Rotta Giusta" — è cresciuto dentro quel
bisogno, non da un piano per costruire un prodotto.

Averlo reso pubblico non è un pivot commerciale. È aver notato che il problema
che aveva l'autore — una banca di 1.722 quesiti ministeriali difficile da
usare, un carteggio che nessuno spiega bene, un esame che si supera o si perde
per un dettaglio — ce l'ha chiunque si prepari a questa patente. Il codice
esisteva già, funzionava, ed era stato pagato con il tempo e gli errori
dell'autore: tenerlo privato non lo avrebbe reso migliore per nessuno.

Questa origine spiega più delle nostre scelte di quanto sembri. Non c'è un
modello di business da proteggere, perché non è mai stato pensato per averne
uno. Le nostre priorità sono quelle di chi ha vissuto lo stesso studio, non
quelle di chi deve massimizzare un tempo di permanenza o una conversione.

## In che cosa crediamo

### La verità prima della rassicurazione

La cosa più diversa di questo sito rispetto a un concorrente qualunque non
sono i quiz: è che **dichiariamo quello che non torna**, invece di
nasconderlo. 37 quesiti oscurati dal Ministero, 11 che divergono dalla norma
più recente, dieci figure che nell'estrazione automatica erano finite abbinate
al quesito sbagliato — sono in prima pagina, con la fonte citata, non in una
nota a piè di pagina scritta per zittire la coscienza di chi ha scritto il
codice.

Il motivo non è morale in astratto: è che uno strumento di studio che nasconde
i propri limiti fa un danno specifico, misurabile, a chi lo usa — studia una
cosa sbagliata pensando di aver studiato quella giusta, e lo scopre il giorno
dell'esame. Un difetto dichiarato costa un rigo di testo. Un difetto nascosto
costa un anno di attesa per ridare l'esame.

Questo vale anche verso l'interno, non solo verso chi studia: un test che dice
"verde" senza aver misurato niente è la stessa bugia, rivolta a chi scrive il
codice invece che a chi lo usa. La chiamiamo **il guasto muto**, ed è il
rischio che temiamo più di ogni altro: qualcosa che si rompe senza che niente,
in schermata o in un log, lo dica.

### L'autorità sta nella fonte, non in noi

I quesiti sono un atto dello Stato — l'Allegato A al DD 131/2022 — e la
risposta che conta all'esame è quella del decreto, non quella che a noi sembra
più giusta. Quando un quesito sembra sbagliato — un flap che sembra invertito,
una dotazione di sicurezza superata da una norma più recente — non cambiamo la
risposta: aggiungiamo una nota che lo spiega e citiamo la fonte, e lasciamo
che sia chi studia a decidere che cosa farne. All'esame vince il decreto, non
la nostra convinzione, per quanto fondata.

È una forma di onestà specifica: non spacciare un'opinione per un fatto solo
perché è nostra e il software la esegue con sicurezza.

### Non ti inganniamo mai

Per provare non ti chiediamo niente: apri il sito e fai tutte le prove che
vuoi. Per tenere i progressi ti registri, con un'email e una password: senza
account non conserviamo niente, nemmeno nel tuo browser. L'email
serve ad accedere, a riprendere la password e a ricevere l'avviso prima che un
account inattivo venga cancellato. Nessuna newsletter, nessun cookie di
tracciamento: c'è un solo cookie, quello che ti tiene dentro dopo l'accesso, e
chi non si registra non ha nemmeno quello. Non c'è niente
da vendere e nessuno a cui vendere l'attenzione di chi studia.

Non c'è la **gamification** che punisce: nessuna serie da non rompere, nessun
badge, nessuna notifica che chiede di tornare. Fino al 4 ottobre 2026 qui c'era
scritto «non c'è gamification», e basta. Da quel giorno (ADR-006), per chi ha
l'account, c'è una cosa sola che le somiglia, e la chiamiamo con il suo nome:
**la costanza, detta** — in quanti degli ultimi quattordici giorni hai studiato
qui, e quanti quesiti oggi sono da confermare. Un giorno saltato non cancella
niente; il numero scende piano, e arriva a zero solo dopo quattordici giorni
senza studio. È una spinta a tornare, e non fingiamo che non lo sia. La ragione
per darla è vera: tornare un altro giorno conta più che ripetere subito, e la
stima che stiamo costruendo conta una osservazione per quesito al giorno.
Resta una scelta contro la pratica dominante nelle app di studio, che punta a
trattenere. Chi prepara un esame in poche settimane non ha bisogno di essere
trattenuto: ha bisogno di sapere dove è scoperto, quando tornare serve, e di
andarsene quando ha finito.

Fino al 25 settembre 2026 qui c'era scritto che nessun **dark pattern** era
possibile, perché non c'era un imbuto in cui far cadere qualcuno. **Non è più
vero.** Per non perdere i progressi bisogna registrarsi, e questo **è un
imbuto**. Non lo chiamiamo in un altro modo.

Abbiamo deciso dove metterlo: non davanti al primo quesito, ma dove hai
qualcosa da perdere — alla fine di un'attività, nel risultato di una
simulazione, e nella Home quando ci torni con risposte che non hai salvato.
Fino al 4 ottobre 2026 stava soltanto alla fine di un'attività; l'abbiamo
allargato (ADR-006) perché chi non finiva un'attività non lo vedeva mai, e una
simulazione appena fatta è il momento in cui c'è di più da perdere. Tre posti,
e in nessun altro: non durante una prova, non a ogni pagina. L'imbuto così è
più largo di prima, e lo diciamo. Chi arriva vede prima che cosa gli
offriamo, e decide dopo. Per poche ore la decisione è stata l'altra —
registrazione obbligatoria per entrare — e l'abbiamo cambiata perché il suo
costo cadeva proprio su chi comincia da zero, nel momento in cui decide se
restare.

Quello che resta è una scelta, non più una conseguenza dell'architettura: un
imbuto che c'è non si usa contro chi ci passa. Senza account ti diciamo, prima
di cominciare e alla fine, che non resta niente: una perdita che scegli tu è
una scelta, una che scopri dopo è un inganno. Ti raccomandiamo di registrarti
mostrandoti che cosa ci guadagni, e i vantaggi che mostriamo sono quelli che
esistono; te lo diciamo quando serve, non a ogni pagina. Le prove restano tutte
tue anche senza account. I Progressi no, e non per spingerti: sono misure su
quello che hai fatto nel tempo, e senza salvare non c'è niente da misurare. Non
faremo mai il contrario — tenere le tue risposte e nasconderti che cosa dicono
finché non ti registri. Il costo si dice prima, non dopo; non c'è un pulsante di conferma reso più piccolo di quello che promette
qualcosa; i tuoi dati si scaricano e si cancellano da dove si vedono, non da un
modulo sepolto. Prima nessuno poteva rompere queste promesse. Adesso potremmo,
ed è il motivo per cui le scriviamo.

**Una volta, scelta, le abbiamo rotte, e lo diciamo qui.** Il 3 ottobre 2026
(ADR-005) abbiamo tolto il passaggio con cui chi aveva studiato nel browser
prima degli account ritrovava le sue risposte. Il criterio è stato la
semplicità, e l'ipotesi che nessuno avesse usato il sito prima degli account.
Se qualcuno l'ha fatto e non le ha portate, quelle risposte sono ancora nel suo
browser, ma il sito non le mostra e non glielo dice: una perdita che si scopre
dopo, proprio quella che qui sopra chiamiamo un inganno, e il costo non è stato
detto prima a chi lo paga. Lo scriviamo invece di lasciare le frasi qui sopra a
dire una cosa che in quel caso non è vera; se le frasi vadano corrette o la
decisione rivista, lo decide l'autore.

Un'eccezione unica, e dichiarata: il gioco dei Segnali è l'unica parte del
sito pensata per essere divertente prima che utile, ed è anche l'unica scritta
interamente dall'autore, non da un motore di selezione.

### I tuoi dati li teniamo noi, e lo diciamo

Finché provi senza account, non conserviamo niente: le risposte valgono finché
la pagina è aperta, e non arrivano a nessuno. Da quando ti registri, stanno sul nostro
server, legate al tuo account, **in chiaro**. Le leggiamo per due ragioni, e solo per quelle: per aiutare chi ci
scrive quando qualcosa non torna, e per le statistiche. Stanno in Europa,
presso un fornitore con cui c'è un accordo scritto. Puoi scaricarle quando
vuoi, nello stesso file di sempre, e puoi farle cancellare; dopo due anni in
cui non entri, ti avvisiamo e le cancelliamo noi.

Fino al 25 settembre 2026 questa sezione diceva il contrario, e diceva che era
più forte di una promessa: le risposte restavano nel browser perché **non
esisteva un server a cui potessero arrivare**, e un'architettura che non ha
dove mandare il dato non si rompe per errore. Era vero, e l'abbiamo lasciato
andare.

Per chi si registra l'abbiamo lasciato andare perché quella garanzia costava a
chi studia la cosa peggiore che il sito gli facesse: l'archivio era una copia sola, e chi cambiava telefono o
svuotava il browser perdeva tutto. Avevamo cercato una via di mezzo — una
copia cifrata che nemmeno noi potessimo leggere — e l'abbiamo scartata quando
abbiamo capito che i dati ci servono leggibili: una copia che nessuno può
leggere non si legge nemmeno per aiutare chi ci chiede perché i suoi numeri
non tornano.

Quello che adesso tiene al sicuro i tuoi dati sono le regole che ci siamo dati
e gli obblighi di legge, non l'impossibilità. **È più debole**, e non fingiamo
che non lo sia: una promessa si può rompere, anche per errore, e un server si
può violare. Se succede, lo diciamo — la legge ci dà 72 ore, e per accorgersene
servono i registri che per questo teniamo.

Una cosa della vecchia architettura resta, ed è quella che rende sicura la
nuova: le risposte sono righe che non si modificano mai, e fondere la copia del
server con quella del tuo browser è un'unione, non una gara fra due versioni.
Nessuna delle due può cancellare l'altra. È il motivo per cui questa
sincronizzazione non può rifare il danno di quella che, nel progetto da cui il
sito viene, ha perso giorni di studio.

### Accompagniamo la preparazione, non la sostituiamo

**Spieghiamo perché una risposta è quella giusta, e lo diciamo quando la
spiegazione è nostra e non del decreto. Non sostituiamo la scuola né il
manuale.** Chi studia ha un manuale, una scuola, un istruttore — questo sito
serve a esercitarsi fra una lezione e l'altra, a capire una risposta quando la
dai, e a scoprire, prima dell'esame, dove è ancora scoperto. Il gioco dei
Segnali insegna per davvero a riconoscere fanali e segnali a colpo d'occhio.

Fino al 4 ottobre 2026 qui c'era scritto «il sito non insegna: allena e dà
riscontri», e la promessa che ne seguiva era: *«Non diciamo "impari con noi":
diciamo "ti eserciti, e ti diciamo la verità su come sta andando". È una
promessa più piccola, ed è per questo che possiamo mantenerla.»* Da quel giorno
(ADR-006) la promessa è più grande, e quindi più facile da rompere: una
spiegazione sbagliata insegna il falso con l'aria di essere giusta, e chi
studia non ha modo di accorgersene. Per questo una spiegazione esce solo quando
l'ha verificata una persona, porta la data della verifica, dice che è nostra e
non del decreto, e dove il decreto sembra sbagliato dice che all'esame vale
lui. La diamo a tutti, anche senza account: non vive di uno storico, e non la
teniamo per spingere a registrarsi. Finché le spiegazioni non ci sono, la frase
di prima descrive ancora il sito.

### Un numero promesso e la lista che si apre vengono dalla stessa fonte

Non è solo una regola tecnica — è un principio di rispetto. Se una schermata
dice "76 quesiti da fare" e il pulsante ne apre zero, quel numero era una
bugia anche se nessuno l'aveva scritta apposta. È successo tre volte nella
storia di questo progetto, sempre con la stessa forma: un conteggio calcolato
in un punto e una lista costruita altrove, che finiscono per raccontare due
storie diverse. Un numero che vedi deve poter essere verificato aprendo
esattamente quello che promette.

### Verifichiamo, non deduciamo

Un'osservazione non è una spiegazione, e leggere il codice non è la stessa
cosa che guardarlo girare. Ogni difetto serio trovato in questo progetto era
silenzioso e conviveva con un'interfaccia che sembrava a posto — un
comportamento offline mai esistito, uno specchio dello storico sovrascritto,
un pulsante che prometteva domande e non ne apriva nessuna. Nessuno di questi
avrebbe mai fatto fallire un test scritto per dimostrare che il codice fa
quello che sembra fare. Per questo, prima di dire che qualcosa funziona, lo
riproduciamo e lo misuriamo: uno screenshot, un conteggio vero, una pagina
guidata in un browser reale — non una lettura del codice sorgente che si
convince da sola.

### Aperto per davvero

Il codice è pubblicato con licenza MIT: chiunque può usarlo, modificarlo,
farci qualcosa di commerciale, anche una scuola nautica. Non è un simbolo:
è la stessa logica di "niente da nascondere" applicata al codice invece che ai
dati. I quesiti e le figure non hanno bisogno di una licenza nostra — sono un
atto dello Stato, escluso dal diritto d'autore — e su quelli non concediamo né
neghiamo alcun diritto, perché semplicemente non sono nostri da concedere.

## Che cosa non siamo

Non siamo un prodotto che deve crescere per giustificare un investimento: non
c'è un investimento da giustificare. Non siamo un servizio che vive di
pubblicità o di dati rivenduti. Fino al 25 settembre 2026 potevamo dire che di
dati da rivendere non ne avevamo; adesso li abbiamo, e la differenza è che non
rivenderli è una scelta nostra, non un fatto dell'architettura.

Non promettiamo un risultato che non possiamo misurare — "supera l'esame con
noi" non lo diciamo, perché non sappiamo che cosa studi fuori da questo sito, e
fingere di saperlo sarebbe esattamente il tipo di rassicurazione vuota che
rifiutiamo altrove.

*Questa frase aspetta una decisione dell'autore* (ADR-006, 4 ottobre 2026). Il
sito calcolerà una stima — se supereresti la prossima simulazione completa del
quiz base — e la registrerà senza mostrarla, finché non avrà passato la prova
sulle simulazioni vere di chi si registra; quando si mostrerà, questa frase non
basterà più a dire che cosa promettiamo. La proposta per sostituirla è in
`docs/idee-dopo-gli-account.md`, I-12: «Non ti diciamo che supererai l'esame.
Ti diciamo, quando abbiamo abbastanza risposte per dirlo, come andresti in una
prova estratta come all'esame — e che cosa questa stima non sa». La scelta è
dell'autore (`docs/prossime-sessioni.md` §4, «Dopo P-59», punto 1). Finché la
stima non si mostra, la frase di sopra è vera; dal giorno in cui la previsione
si registra, «I tuoi dati li teniamo noi» deve dire anche quella.

## Che cosa abbiamo perso

Detto in un posto solo, perché sparso nelle sezioni sopra si leggerebbe meno.
Con le risposte di chi si registra sul nostro server abbiamo rinunciato a:

- **la garanzia che non dipendeva da nessuno** — «le tue risposte non arrivano
  a nessuno», vera per costruzione. Per chi si registra, adesso arrivano a noi;
- **l'anonimato** — di chi si registra il sito sa chi è e che cosa ha risposto,
  e noi lo possiamo leggere;
- **il non avere niente da custodire** — un fornitore in più, un registro dei
  trattamenti, un'informativa vera, una violazione possibile da notificare;
- **l'assenza di un imbuto** — per salvare bisogna registrarsi;
- **a chi non si registra, quello che davamo a tutti** — un archivio nel
  browser, i Progressi, la ripresa dal giorno prima, senza chiedere niente.

E il 3 ottobre 2026, per semplicità (ADR-005), a due cose ancora:

- **l'offline** — senza rete il sito non si apre, per nessuno; in cambio dopo
  un aggiornamento basta una ricarica, non due;
- **le risposte di chi studiava prima degli account** e non le ha portate —
  restano nel suo browser, e il sito non le guarda più.

Non abbiamo rinunciato, perché si prova senza account, al primo quesito senza
chiedere niente. All'offline dalla prima visita sì, con l'ADR-005.

In cambio: **chi si registra non perde più il proprio lavoro** cambiando
telefono, e chi ci scrive per un problema possiamo aiutarlo davvero. Chi non si
registra non perde niente in silenzio: sa dall'inizio che non resta niente, e
di lui non resta niente da nessuna parte. Lo abbiamo ritenuto un cambio giusto.

## A che cosa serve questo documento

Non è un elenco di requisiti — quello è `docs/specifica.md`, con i suoi
controlli eseguibili. È il livello sopra: il perché, in modo che chi scrive
un requisito nuovo, un test nuovo o un testo nuovo per una schermata possa
chiedersi se è coerente con questi valori prima ancora di chiedersi se supera
un test. Un requisito può cambiare. Questi valori sono il motivo per cui, se
cambia, deve cambiare in una direzione e non nell'altra.

---

## Registro

- **4 ottobre 2026 — dopo l'ADR-006** (P-63, le decisioni del brainstorming
  P-59). «Il sito non insegna» lascia il posto alla frase approvata
  dall'autore in I-10, con quella di prima citata accanto; «niente
  gamification» diventa la costanza detta, senza serie che si spezza; l'imbuto
  ha tre posti, la Home e il risultato di una simulazione oltre al riepilogo.
  La frase sulla stima, in «Che cosa non siamo», non è riscritta: la nuova la
  sceglie l'autore, e accanto c'è che cosa la aspetta. «Una palestra onesta e
  sicura», nell'impegno, è rimasta: è una parola dell'impegno, non il nome di
  una pagina, e se toglierla con i nomi «vetrina» e «palestra» (decisione 7) è
  dell'autore.

- **3 ottobre 2026 — dopo l'ADR-005.** Via l'offline e il passaggio
  dell'archivio di prima, per semplicità. «Che cosa abbiamo perso» ha le due
  perdite nuove; e accanto a «una che scopri dopo è un inganno» c'è un
  paragrafo che dice che per chi studiava prima degli account quella promessa,
  scelta, non vale. Le frasi non sono state riscritte: è una decisione
  dell'autore.

- **3 ottobre 2026 — la nota in testa è tolta.** Diceva che il documento
  descriveva il sito deciso e non quello pubblicato, e che si toglieva nel
  commit del rilascio che porta gli account: è questo, la v0.29.0. Da qui il
  sito che chi studia apre è quello che queste pagine descrivono.

- **30 settembre 2026 — la nota in testa, dopo P-18 e P-26.** Diceva che gli
  account non esistevano e che le pagine di `site/` descrivevano ancora il sito
  senza registrazione. Dal 29 settembre la pagina su `main` ha gli account e i
  testi nuovi; il sito pubblicato no. La nota dice ora questo, e quando si
  toglie: nel commit del rilascio che porta gli account. Il resto del
  documento non cambia.

- **25 settembre 2026 — dopo l'ADR-004.** L'account serve per salvare, non per
  usare: senza account si fanno tutte le prove e non resta niente, e i
  Progressi sono dei registrati. Il paragrafo sull'imbuto dice dove lo abbiamo
  messo, perché la decisione di poche ore prima è cambiata, e porta le
  condizioni dell'ADR come promesse — compresa quella di non tenere le risposte
  per poi nasconderne le misure. «Che cosa abbiamo perso» perde il primo quesito
  e l'offline alla prima visita, e guadagna la perdita di chi non si registra.

- **25 settembre 2026 — riscritto dopo l'ADR-003.** Account obbligatorio e
  risposte sul server in chiaro, leggibili dal titolare: quattro affermazioni
  di questo documento diventavano false — «senza account, senza un server»
  nell'impegno, «non trattiamo dati personali», «nessun dark pattern
  possibile», e l'intera sezione sui dati che restano nel browser per
  architettura. Sono state riscritte dicendo che cosa erano, che cosa sono ora
  e perché, invece di essere sostituite in silenzio; e c'è una sezione nuova,
  «Che cosa abbiamo perso». Un impegno è nuovo e non viene dall'ADR: che i dati
  si scaricano e si cancellano «da dove si vedono». Discende dall'ADR (export
  esistente, cancellazione che cancella davvero), ma la forma è una promessa di
  questo documento.

- **12 settembre 2026 — prima stesura.** Scritto su richiesta esplicita, per
  dare all'interfaccia una fonte di filosofia distinta dalla specifica
  tecnica: la specifica dice che cosa esiste e come si verifica, questo
  documento dice perché esiste ed è fatto così. Il contenuto è una sintesi di
  ciò che il progetto aveva già stabilito e verificato — in `specifica.md`
  (§1, §2, Appendice A), nel README e nel CHANGELOG — non principi nuovi
  inventati per l'occasione.
