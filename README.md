# Rotta Giusta

**Quiz e carteggio per la patente nautica senza limiti dalla costa.**

Un sito statico, gratuito e open source, per prepararsi all'esame di patente
nautica categoria A senza alcun limite dalla costa, motore e vela: i 1.722
quesiti e i 135 esercizi di carteggio dell'elenco unico nazionale, con
simulazioni d'esame, diagnosi per argomento e un allenamento per il carteggio
che si fa senza carte. Niente account, niente registrazione: le risposte
restano nel browser di chi studia e non arrivano mai a nessuno.

È la palestra che l'autore ha scritto per sé, con l'aiuto di Claude, e con cui
ha superato l'esame il 3 settembre 2026. Ora la restituisce alla comunità che
lo ha aiutato.

## La cosa da sapere prima di tutto: i difetti dichiarati

Quello che rende questo sito diverso dagli altri non sono i quiz. È che
**dichiara quello che non torna**, quesito per quesito, invece di nasconderlo.

- **37 quesiti sono stati oscurati dal Ministero** con la circolare MIT n. 30432
  del 15 novembre 2024, dopo il DM 133/2024: all'esame non escono. Restano in
  banca, lo dicono *prima* che tu risponda, e sono esclusi dalla simulazione
  d'esame ma non dalle batterie, dove si impara comunque.
- **11 quesiti divergono dal DM 133/2024** (in vigore dal 21 ottobre 2024), che
  ha riscritto le dotazioni di sicurezza: portano una nota *dopo* la risposta,
  e **la risposta non è stata cambiata**, perché all'esame vale quella del
  decreto. (base-274, 277, 278, 281, 293, 295, 297, 304, 308, 313, 314; otto di
  questi sono anche fra gli oscurati.)
- **Il quesito dei flap (base-405)** ha una risposta ministeriale che sembra
  invertita rispetto alla fisica. Porta una nota che lo spiega, e tiene la
  risposta del decreto: dichiarare sì, ribaltare no.
- **Dieci figure erano abbinate al quesito sbagliato** dall'estrazione automatica
  del PDF. Sono state riabbinate a mano dopo averle guardate tutte, una
  per una; un test fissa i dieci abbinamenti (base-177, 178, 647, 650, 662, 679,
  1062, 1063, vela-130, vela-131).
- **Un quesito è senza figura (base-59)**: nel PDF il suo disegno è uscito come
  doppione di un'altra figura. Lo dice in schermata invece di lasciare un buco.
- **Due quesiti avevano la risposta esatta rotta** nell'estrazione (base-226 e
  base-1418: due risposte marcate esatte, o nessuna) e sono stati corretti a mano
  con la motivazione accanto. Sono gli unici due casi *rilevabili*; dove la banca
  ne marca una sola, anche se sembra sbagliata, la risposta resta quella.
- **La composizione delle 20 domande per tema** — 4 Navigazione, 4 Manovra,
  3 Sicurezza, 3 Normativa, 2 COLREG, 2 Meteorologia, 1 Teoria dello scafo,
  1 Motori — governa la simulazione e tutte le priorità dell'app, e **non è nel
  decreto**: viene da tre scuole nautiche indipendenti e concordi fra loro. Va
  confermata con la propria. Lo stesso vale per l'assunzione che la prova di
  carteggio peschi un esercizio per ciascuno dei quattro argomenti.
- **Le 12 «tecniche» di carteggio non sono ministeriali**: sono una
  classificazione derivata dai testi degli esercizi, alla cieca, per l'allenamento
  «che tecnica serve?». L'*argomento* di ogni esercizio (correnti, carburante,
  navigazione costiera, scarroccio) invece è nel decreto.

Fa fede il decreto, non questo sito: vedi [Avvertenza](site/avvertenza.html).

## Da dove vengono i dati

I quesiti (1.472 base, 250 vela), le figure e i 135 esercizi di carteggio
senza limiti sono l'**Allegato A al Decreto Direttoriale n. 131 del 31 maggio
2022** del Ministero delle Infrastrutture e dei Trasporti, l'elenco unico
nazionale dei quesiti. È un atto ufficiale dello Stato, e la legge sul diritto
d'autore (art. 5 L. 633/1941) non si applica ai testi degli atti ufficiali
dello Stato. Per questo il repo **non applica nessuna licenza ai dati**: non
sono dell'autore, e non si possono concedere diritti su un atto dello Stato.

Il PDF del decreto è nel repo, in `fonte/`, accanto allo script che confronta i
dati pubblicati col suo testo. Chiunque può rifare la verifica:

```bash
pip3 install pypdf
python3 fonte/verifica.py
```

Eseguita il 4 settembre 2026: **135 testi su 135** e **134 risposte ufficiali
su 135** ritrovati parola per parola nel decreto. L'unica differenza è in
`5.1.3-3`, dove i dati scrivono una «E» dopo la prima longitudine che il PDF non
scrive: notazione, non contenuto. Anche i 50 esercizi del carteggio entro 12
miglia (`carteggio_e12.json`, che l'app oggi non usa) sono stati ritrovati
tutti.

Gli esercizi di carteggio sono arrivati attraverso una trascrizione, non
direttamente dal PDF; la verifica sopra dimostra che la trascrizione è stata
solo un veicolo. Le annotazioni didattiche che quella trascrizione conteneva
sono state tolte (`strumenti/prepara.py` documenta come), e un controllo che
gira nella suite, `strumenti/controlla.py`, fallisce se rientrano.

## Come funziona

- **Sito statico.** Nessun backend, nessun database, nessun form, nessun cookie,
  nessun analytics. L'hosting è Cloudflare Pages; i quattro file JSON in
  `site/dati/` sono la banca.
- **Le risposte restano nel browser**, in IndexedDB, una riga per risposta. Da
  quelle righe l'app deriva tutto: la copertura, la diagnosi, le sessioni.
  Dalla schermata Info si scaricano in un file e si ricaricano su un altro
  dispositivo. Non c'è nessun altro modo di recuperarle: scaricale prima di
  cambiare telefono.
- **Funziona offline** (service worker, cache-first: la banca è immutabile). Le
  figure si scaricano con un pulsante, apposta.
- **La logica di selezione sta in un solo file**, `site/engine.js`, che gira
  identico nella pagina e sotto `node --test`. Non ha DOM né rete.
- **Niente build step.** La pagina importa `engine.js` e basta; quello che è
  nel repo è quello che gira.

Le modalità: simulazione d'esame con composizione, tempi e soglie del ministero;
allenamento per argomento, screening di tutte le 44 voci, batteria, solo
sbagliate, e *Mirata* (richiami, esplorazione pesata sulla resa d'esame,
conferme); diagnosi per tema e per voce con l'accuratezza sulla prima risposta;
prova di carteggio con cronometro (4 esercizi, 60 minuti, 3 su 4) che **non si
corregge da sola**: l'app mette la risposta ministeriale accanto alla tua e sei
tu a giudicare; il drill «che tecnica serve?» sui 135 testi, senza carte; e il
**gioco dei Segnali** (fanali, segnali diurni e sonori COLREG), l'unica parte
interamente scritta dall'autore, extra banca.

## Struttura del repo

```
site/                 quello che Cloudflare Pages pubblica, e niente altro
  index.html          la palestra, una pagina sola
  engine.js           motore di selezione e statistiche (logica pura, testata)
  sw.js               service worker; il nome della cache segue VERSION
  dati/               quiz.json, meta.json, tecniche.json, carteggio.json, carteggio_e12.json
  figure/             le figure del decreto (103 caselle, 102 disegni: la n. 8 era un doppione)
  privacy.html, avvertenza.html
fonte/                il PDF dell'Allegato A al DD 131/2022 e verifica.py
strumenti/            controlla.py (il guardiano), prepara.py, tecniche-carteggio/
tests/                test_engine.mjs (motore), test_dati.py (dati e invarianti)
docs/adr/             le decisioni, con il perché
CHANGELOG.md          la storia, compresa quella del progetto da cui è estratto
```

## Sviluppo

```bash
python3 strumenti/serve.py                        # il sito in locale, come lo serve Pages
node --test tests/test_engine.mjs                 # il motore
python3 tests/test_dati.py                        # i dati, le invarianti, e controlla.py
```

Un rilascio alza **tre** numeri che un test tiene insieme — `VERSION`, `CACHE`
in `site/sw.js`, `versione` in `site/dati/meta.json` — e ha una voce nel
CHANGELOG con lo stesso numero. Non c'è un server che sostituisca il numero al
volo: se uno dei tre resta indietro, la suite è rossa. Dopo un rilascio ogni
dispositivo prende la versione nuova alla **seconda** ricarica.

Le regole di lavoro sono in [`CLAUDE.md`](CLAUDE.md); vale anche per gli umani.

## Come si contribuisce

Le segnalazioni vanno nelle [issue](https://github.com/ilbeca/open-patente-nautica/issues).
Due cose contano più delle altre:

- **Una risposta della banca non si cambia per convinzione.** Se un quesito
  sembra sbagliato, si aggiunge una nota che lo dichiara e si cita la fonte;
  la risposta resta quella del decreto, perché all'esame vale quella. Le uniche
  correzioni ammesse sono quelle *rilevabili* (due esatte, nessuna esatta,
  figura scambiata), e vanno fissate da un test.
- **Un numero promesso e la lista che si apre devono venire dalla stessa
  fonte.** È il difetto tornato tre volte nel progetto originario: un pulsante
  che prometteva 76 quesiti e ne apriva zero.

## Licenza

Il codice e le schede del gioco dei Segnali sono dell'autore e sono pubblicati
con licenza [MIT](LICENSE): usali, anche in una scuola nautica, anche per
farci qualcosa di commerciale.

La licenza **non copre** i quesiti, gli esercizi di carteggio e le figure in
`site/dati/` e `site/figure/`: sono l'Allegato A al DD 131/2022 del Ministero
delle Infrastrutture e dei Trasporti, un atto ufficiale dello Stato italiano,
escluso dal diritto d'autore (art. 5 L. 633/1941), su cui l'autore non concede
e non può concedere alcun diritto. Il file `LICENSE` contiene il solo testo
MIT, senza questa nota, perché GitHub riconosca la licenza dal file.

## Origine

Estratto da un progetto personale di preparazione all'esame, che girava come
servizio in casa dell'autore. Non è un fork: il repo di origine resta privato,
perché la sua storia contiene i dati della sua rete. Il perché è in
[ADR-001](docs/adr/ADR-001-repo-nuovo-non-fork.md); le voci del CHANGELOG fino
alla 0.18.0 raccontano quel progetto, e spiegano *perché* certe scelte sembrano
strane.
