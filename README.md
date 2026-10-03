# Rotta Giusta

**Quiz e carteggio per la patente nautica senza limiti dalla costa.**

Un sito gratuito e open source per prepararsi all'esame di patente nautica
categoria A senza alcun limite dalla costa, motore e vela: i 1.722 quesiti e i
135 esercizi di carteggio dell'elenco unico nazionale, con simulazioni d'esame,
progressi per argomento e un allenamento per il carteggio che si fa senza carte.

**Si prova senza account, e si salva con l'account.** Senza registrarsi si
fanno tutte le attività, ma le risposte valgono solo finché la pagina resta
aperta: il sito non conserva niente, nemmeno nel browser. Con un account
(email e password) le risposte si salvano sul server del sito, **in chiaro**:
si ritrovano su un altro dispositivo, danno i Progressi, e il titolare le può
leggere per il supporto e per le statistiche. Che cosa si tratta, dove e per
quanto lo dice l'[informativa](site/privacy.html); perché si è scelto così lo
dicono l'[ADR-003](docs/adr/ADR-003-account-obbligatorio-e-dati-sul-server.md)
e l'[ADR-004](docs/adr/ADR-004-senza-account-si-prova-con-l-account-si-salva.md).

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
  1 Motori — governa la simulazione e tutte le priorità dell'app, ed **è
  ministeriale**: è l'**Allegato C al DM 10 agosto 2021, n. 323** (GU Serie
  generale n. 232 del 28 settembre 2021, p. 39), «Distribuzione dei quesiti
  secondo i temi previsti dal programma di esame». Gli otto numeri coincidono
  uno per uno con quelli usati qui.

  Fino al 9 settembre 2026 questo README dichiarava il contrario — «non è nel
  decreto, viene da tre scuole nautiche» — e la ragione dell'errore vale più
  della correzione: nel repo c'era **un solo** decreto, l'elenco dei quesiti
  (DD 131/2022), e lì dentro la composizione della scheda infatti non c'è. Sta
  nell'altro decreto, quello che stabilisce le prove, che nessuno aveva cercato.
  Le tre scuole nautiche non avevano dedotto niente: stavano citando l'Allegato C.
  Le evidenze sono in [`docs/ricerca-programma-esame.md`](docs/ricerca-programma-esame.md).

  **Quello che resta non ministeriale è la ripartizione dentro un tema.**
  L'Allegato C dice quanti quesiti per tema e nient'altro: come si distribuiscano
  fra le 44 voci non è scritto in nessun atto. Ogni priorità per voce — la resa
  della diagnosi, il costo in domande d'esame, i consigli, la Mirata — è una
  costruzione di questo sito.
- **La prova di carteggio pesca «un esercizio per ciascuno dei quattro
  argomenti»: è un'assunzione, non una regola.** L'art. 6 comma 6 del DM 323/2021
  dice soltanto «quattro quesiti indipendenti», e non nomina gli argomenti. Nella
  banca la carta 42/D non ha **nessun** esercizio di carburante, quindi la regola
  non potrebbe reggersi su una carta sola. Va confermata con la propria scuola.
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

### L'elenco delle password comuni

`server/password-comuni.txt` serve al server degli account: una password che
sta in questo elenco si rifiuta, come chiede NIST SP 800-63B-4 (il perché è in
`docs/account-progetto.md` §5.2). Sono **10.898 voci, 191.989 byte**, una per
riga, in minuscolo e ordinate: soltanto quelle lunghe almeno 15 caratteri, perché
una password più corta la rifiuta già la lunghezza.

- **Da dove viene.** I «ten million passwords» di Mark Burnett (febbraio 2015),
  rilasciati in **pubblico dominio**, nella versione ordinata e deduplicata di
  [SecLists](https://github.com/danielmiessler/SecLists): il file
  `Passwords/Common-Credentials/xato-net-10-million-passwords-1000000.txt`, le
  prime 1.000.000 per frequenza, al commit
  `c205c36a445bff37f8e58a9ec829105cd4975c58` (8 maggio 2025), impronta SHA-256
  `424a3e03a17df0a2bc2b3ca749d81b04e79d59cb7aeec8876a5a3f308d0caf51`.
  L'articolo originale di Burnett oggi non si apre; il marchio di pubblico
  dominio sta sulla copia dell'Internet Archive
  (`archive.org/details/10MillionPasswords`).
- **Come si rifà.** Non è trascritto: lo genera `strumenti/password_comuni.py`,
  che scarica la fonte, ne controlla l'impronta e scrive il file. Il file che
  produce ha impronta SHA-256
  `cbdc28a68ea4bc20d214755fb333d816c55ceada6cc3da3bd9b70ecea42aead0`, e la suite
  del server pretende che quello nel repo l'abbia.

  ```bash
  python3 strumenti/password_comuni.py --verifica
  ```

- **La licenza di SecLists**, che si porta dietro il file:

  ```
  MIT License

  Copyright (c) 2018 Daniel Miessler

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  ```

### Il carattere della vetrina

`site/caratteri/manrope-latin-wght-normal.woff2` è **Manrope**, di The Manrope
Project Authors ([sharanda/manrope](https://github.com/sharanda/manrope)), con
licenza **SIL Open Font License 1.1**, il cui testo sta accanto, in
`site/caratteri/OFL.txt`. È la versione variabile, pesi da 200 a 800, dei soli
caratteri latini, presa dal pacchetto `@fontsource-variable/manrope` 5.2.8 il
1° ottobre 2026: 24.836 byte, SHA-256
`a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972`.

Si serve da qui e non da Google Fonts perché ogni richiesta a un altro host
manda l'IP di chi visita a un terzo; fino a quel giorno la vetrina lo faceva
senza che l'informativa lo dicesse. Un test lo tiene fermo: nessuna pagina di
`site/` carica risorse da un altro host.

## Come funziona

- **Le pagine sono statiche.** L'hosting è
  [statichost.eu](https://www.statichost.eu/), in Svezia, all'indirizzo
  `rottagiusta.it`; i file JSON in `site/dati/` sono la banca. Nessun analytics
  e nessun cookie di tracciamento: c'è un solo cookie, quello di sessione, e
  solo per chi ha fatto l'accesso.
- **Il server degli account sta a parte**, all'indirizzo `api.rottagiusta.it`,
  su una macchina Scaleway nell'Unione europea: un processo Node senza
  dipendenze npm e un file SQLite, in `server/`. Importa `site/engine.js`, quindi
  rifiuta le stesse righe del browser con la stessa funzione, `validaRiga()`.
  Sulla macchina gira soltanto un tag pubblicato di questo repo, e le copie di
  sicurezza hanno un ripristino provato (`docs/account-progetto.md` §2.5–2.7).
- **Le risposte sono righe, una per risposta, che non si modificano mai.** Senza
  account stanno solo nella memoria della pagina aperta, e una ricarica le
  perde: il sito lo dice prima di cominciare e alla fine di ogni attività. Con
  l'account stanno sul server e in una copia nel browser, che le tiene se la
  rete cade a pagina aperta; le due si uniscono per `uid`, senza un vincitore. Da quelle righe l'app deriva
  tutto — la copertura, i Progressi, le sessioni —, e quello che deriva non si
  salva e non viaggia: si ricalcola in locale.
- **Dalla schermata Info si scarica un file.** Con l'account è l'export del
  server, e un file dei progressi si carica nell'account; senza account si
  scaricano le risposte della pagina aperta. Chi aveva scaricato il file prima
  degli account lo carica nell'account allo stesso modo. Le risposte di prima
  rimaste nel browser, invece, la pagina non le legge e non le cancella: restano
  lì, e il sito non le porta più nell'account
  ([ADR-005](docs/adr/ADR-005-semplificare-senza-offline-e-senza-archivio-di-prima.md)).
- **Non funziona offline**, dal 3 ottobre 2026 (ADR-005): senza rete il sito non
  si apre. Le pagine e la banca arrivano dalla rete, con la cache del browser,
  e dopo un aggiornamento basta una ricarica. Con l'account, una risposta data
  mentre la rete è caduta a pagina aperta resta nella copia del dispositivo e
  parte quando la rete torna. `site/sw.js` c'è ancora, ma solo per
  disinstallare il service worker che la 0.29.0 ha lasciato a chi l'ha
  visitata.
- **La logica di selezione sta in un solo file**, `site/engine.js`, che gira
  identico nella pagina, nel server e sotto `node --test`. Non ha DOM né rete.
- **Niente build step.** Le pagine importano `engine.js` e basta; quello che è
  nel repo è quello che gira.

I Quiz: l'allenamento consigliato (richiami, esplorazione pesata sulla resa
d'esame, conferme), la scelta per argomento, il ripasso degli errori, la
simulazione d'esame con composizione, tempi e soglie del ministero, e un giro
fra tutte le 44 voci. I Progressi, per chi ha un account: per tema e per voce,
con l'accuratezza sulla prima risposta. La prova di carteggio con cronometro (4
esercizi, 60 minuti, 3 su 4) **non si corregge da sola**: l'app mette la
risposta ministeriale accanto alla tua e sei tu a giudicare. Il drill «che
tecnica serve?» sui 135 testi, senza carte; e il **gioco dei Segnali** (fanali,
segnali diurni e sonori COLREG), l'unica parte interamente scritta
dall'autore, extra banca.

## Struttura del repo

```
site/                 quello che statichost.eu pubblica, e niente altro
  index.html          la vetrina
  app.html            la palestra, una pagina sola, con il client degli account
  engine.js           motore di selezione e statistiche (logica pura, testata)
  sw.js               il service worker che si disinstalla (ADR-005)
  dati/               quiz.json, meta.json, tecniche.json, carteggio.json, carteggio_e12.json
  figure/             le figure del decreto (103 caselle, 102 disegni: la n. 8 era un doppione)
  privacy.html, avvertenza.html
server/               il server degli account, che gira su api.rottagiusta.it
fonte/                il PDF dell'Allegato A al DD 131/2022 e verifica.py
strumenti/            controlla.py (il guardiano), serve.py, password_comuni.py, prepara.py
tests/                le cinque suite: motore, server, dati, interfaccia, specifica
docs/                 specifica.md, filosofia.md, i progetti, e adr/ con le decisioni
CHANGELOG.md          la storia, compresa quella del progetto da cui è estratto
```

## Sviluppo

```bash
python3 strumenti/serve.py                        # il sito in locale, come lo serve statichost.eu
node --test tests/test_engine.mjs                 # il motore
node --test tests/test_server.mjs                 # il server degli account
python3 tests/test_dati.py                        # i dati, le invarianti, e controlla.py
python3 tests/test_interfaccia.py                 # la pagina, anche in Chrome headless
python3 tests/test_specifica.py                   # ogni requisito ha il suo controllo
```

Che cosa serve a ciascuna — Chrome, la porta 8620 libera, una LTS pari di Node —
lo dice `AGENTS.md`, «Comandi».

Un rilascio alza **due** numeri che un test tiene insieme — `VERSION` e
`versione` in `site/dati/meta.json` — e ha una voce nel CHANGELOG con lo stesso
numero. Nessuno sostituisce il numero al volo: se uno dei due resta indietro, la
suite è rossa. Dopo un rilascio ogni dispositivo prende la versione nuova alla
prima ricarica, e il server degli account si aggiorna a parte, sulla sua
macchina, allo stesso tag.

Le regole di lavoro sono in [`CLAUDE.md`](CLAUDE.md); vale anche per gli umani.

## Come si contribuisce

Le segnalazioni vanno nelle [issue](https://github.com/ilbeca/rotta-giusta/issues).
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
