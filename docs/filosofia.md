# Rotta Giusta — filosofia e valori

**Data:** 12 settembre 2026.
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
ancora visto abbastanza per dirti qualcosa". Sicura, perché quello che scrivi
resta tuo: nel tuo browser, senza account, senza un server a cui potrebbe
arrivare o da cui potrebbe uscire.

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

Nessun account, nessuna registrazione, nessuna newsletter, nessun cookie di
tracciamento. Non perché la legge lo imponga — non trattiamo dati personali,
quindi in gran parte non ci si applicherebbe nemmeno — ma perché non c'è
niente da vendere e nessuno a cui vendere l'attenzione di chi studia.

Non c'è **gamification**: nessuna streak da non rompere, nessun badge, nessuna
notifica che chiede di tornare. È una scelta esplicita contro la pratica
dominante nelle app di studio, che punta a trattenere. Chi prepara un esame in
poche settimane non ha bisogno di essere trattenuto: ha bisogno di sapere dove
è scoperto e di andarsene quando ha finito.

Non c'è nessun **dark pattern** possibile, perché non c'è un imbuto in cui far
cadere qualcuno: non c'è un piano gratuito pensato per essere frustrante, non
c'è un pulsante di conferma reso più piccolo di quello che promette qualcosa.
Un'eccezione unica, e dichiarata: il gioco dei Segnali è l'unica parte del
sito pensata per essere divertente prima che utile, ed è anche l'unica scritta
interamente dall'autore, non da un motore di selezione.

### I tuoi dati restano tuoi, per come è costruito il sito

Le risposte che dai restano nel browser in cui studi. Non è una promessa scritta
in una informativa: è che non esiste un server a cui potrebbero arrivare. Il
sito è statico, senza backend, senza database — l'unica copia dello storico è
quella sul tuo dispositivo, e l'unico modo di portarla altrove è scaricarla tu
stesso in un file.

Questo è più forte di una promessa di privacy, ed è deliberato: una promessa si
può rompere con un aggiornamento silenzioso; un'architettura che non ha dove
mandare il dato non si rompe per errore.

### Accompagniamo la preparazione, non la sostituiamo

Il sito non insegna: allena e dà riscontri. Chi studia ha un manuale, una
scuola, un istruttore — questo sito serve a esercitarsi fra una lezione e
l'altra e a scoprire, prima dell'esame, dove sono ancora scoperti. L'unica
eccezione dichiarata è il gioco dei Segnali, che insegna per davvero a
riconoscere fanali e segnali a colpo d'occhio.

Questa distinzione conta perché cambia che cosa il sito può onestamente
promettere. Non diciamo "impari con noi": diciamo "ti eserciti, e ti diciamo
la verità su come sta andando". È una promessa più piccola, ed è per questo
che possiamo mantenerla.

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
pubblicità o di dati rivenduti: non ne abbiamo di dati da rivendere, e non
abbiamo intenzione di crearne il bisogno. Non promettiamo un risultato che non
possiamo misurare — "supera l'esame con noi" non lo diciamo, perché non
sappiamo che cosa studi fuori da questo sito, e fingere di saperlo sarebbe
esattamente il tipo di rassicurazione vuota che rifiutiamo altrove.

## A che cosa serve questo documento

Non è un elenco di requisiti — quello è `docs/specifica.md`, con i suoi
controlli eseguibili. È il livello sopra: il perché, in modo che chi scrive
un requisito nuovo, un test nuovo o un testo nuovo per una schermata possa
chiedersi se è coerente con questi valori prima ancora di chiedersi se supera
un test. Un requisito può cambiare. Questi valori sono il motivo per cui, se
cambia, deve cambiare in una direzione e non nell'altra.

---

## Registro

- **12 settembre 2026 — prima stesura.** Scritto su richiesta esplicita, per
  dare all'interfaccia una fonte di filosofia distinta dalla specifica
  tecnica: la specifica dice che cosa esiste e come si verifica, questo
  documento dice perché esiste ed è fatto così. Il contenuto è una sintesi di
  ciò che il progetto aveva già stabilito e verificato — in `specifica.md`
  (§1, §2, Appendice A), nel README e nel CHANGELOG — non principi nuovi
  inventati per l'occasione.
