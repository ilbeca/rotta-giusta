# Il menu nuovo e le due porte — progetto P-107

**Data:** 18 novembre 2026. **Base:** `main` a `991b4b8`, sito pubblicato
v0.35.1. **Nasce da:** la scheda I-32 di `docs/idee-dopo-gli-account.md` e il
passo B-3 di `docs/piano-2026-11.md`, con le decisioni dell'autore del 18
novembre: il menu cambia in questo giro (C-0), la simulazione preseleziona le
prove (C-5, la fa P-109 prima), un pulsante solo per accedere e creare
l'account (C-6), i Segnali dentro Quiz (C-7).
**Che cos'è:** il contratto da cui B-4 scrive i controlli e B-5 la pagina. Niente
codice. Neutro; penna della regia alla merge.
**Che cosa non è:** non decide i concetti (B-6), non tocca la Home a pannelli
oltre ai suoi testi (A-1, A-2), non riscrive la specifica: i requisiti che
cambiano o nascono stanno nel §7.5, e li porta B-4, che ha la penna.

**Come sono state verificate le affermazioni su che cosa c'è oggi.** Il sito di
`main` servito in locale con `python3 strumenti/serve.py 8631` e guidato nel
browser della sessione a 375×812, il 18 novembre: barra, segmenti, porte delle
sezioni, preparazioni, pannello dell'account, indirizzi. Dove una riga dice
«guardato», è così; dove dice «dal progetto» o «dal codice», è letta e non
vista, e lo dice.

---

## 1. Da dove si parte: che cosa c'è oggi, guardato

- **La barra** ha quattro link: Home `/`, Allenati `/?sezione=allenati`, Esame
  `/?sezione=esame`, Progressi `/?sezione=progressi`; il marchio porta a `/`;
  a destra un pulsante solo, «Accedi» (con l'account «Account»). Le viste sono
  quattro: `v-home`, `v-allenati`, `v-esame`, `v-progressi`.
- **Allenati** ha tre segmenti, Quiz · Carteggio · Segnali, con gli indirizzi
  `&segmento=quiz|carteggio|segnali`.
  - *Quiz*: «Allenamento consigliato», «Scegli un argomento», «Ripassa gli
    errori», un pulsante «Simula la prova» che manda a Esame, «Altri modi di
    esercitarti» con «Un giro tra gli argomenti», «Gli argomenti» (gli otto
    temi, ognuno una scorciatoia), «Segnalibri», «Cerca un quesito per numero».
  - *Carteggio*: tre porte — «Prova di carteggio», «Esercizi su carta» (giro
    delle tecniche o a tappeto, scelti con due radio nella preparazione), «Che
    tecnica serve?» —, «Prima di cominciare» con i materiali, «Come funziona»,
    «Vedi un esempio», e due scorciatoie, «Ho carta e strumenti» (il giro) e
    «Sono senza strumenti» (le tecniche).
  - *Segnali*: quattro modalità e «Inizia — fanali notturni».
- **Esame** ha «Le prove» — Prova di carteggio, Simula il quiz base, Simula il
  quiz vela, Quiz base e vela —, poi «Che cosa stai preparando?» e la data
  d'esame in un `details` chiuso, «Com'è fatto l'esame», «Prove di questa
  pagina». La preparazione della simulazione ha «Quale prova» con tre radio.
  A 375 px i titoli delle porte vanno una parola per riga: è la correzione Q-1,
  non ancora fusa.
- **Progressi**, senza account: «Le attività di questa pagina», «Vai ad
  Allenati», «Perché qui manca lo storico»; con l'account (dal progetto, non
  visto: serve un account) la mappa dei cinque stati con «Rifai» e «Allena»,
  le prove, l'andamento, le sessioni.
- **La preparazione di «Scegli un argomento»**: Banca (base 1472, vela 250),
  «Scegli gli argomenti», «Filtri» (solo mai fatte, solo con figura), «Quante»
  20 · 50 · 100 · Tutte, «Inizia i quiz», «Torna ad Allenati · Quiz».
- **Il pannello «Accedi»** (guardato): email, password, «Mostra password»,
  «Accedi», «Ho dimenticato la password», «Crea un account», «Torna
  all'attività», poi le voci del Profilo — «Che cosa stai preparando?», «Data
  d'esame», «Dati», «Info e diagnostica», Privacy, Condizioni per l'account,
  Avvertenza. «Crea un account» sostituisce il modulo con un altro, «Crea un
  account», che **non ha un ritorno all'accesso** e si chiude con «Torna al
  riepilogo» anche quando è stato aperto dalla Home, dove un riepilogo non c'è.
- **La Home** pubblicata è quella del volto, giro A: al computer undici tappe
  («Si prova senza account», «La simulazione, come all'esame», «Dieci domande,
  con la correzione», «L'allenamento consigliato», «Un argomento alla volta»,
  «Gli errori tornano», «Il carteggio, sulla carta vera», «Fanali e segnali»,
  «L'esame, in ordine», «Con l'account, le risposte restano»), con i link «Apri
  Carteggio», «Apri Segnali», «Apri Esame», «Vedi i Progressi». La Home a sei
  pannelli (A-2, testi in `docs/prototipi/stitch-2026-10/argomenti-pannelli.md`)
  arriva prima di B-5, e questo progetto riscrive quella.

**Il motore di P-105.** Al momento di questa stesura P-105 non è fuso, e il suo
ramo non ha commit. Le firme del §7 sono quelle del suo prompt, controllate sul
lavoro in corso nel suo worktree, letto e non toccato: `allenati(items,
progress, oggi, { n = 25, kind = 'base', seme })` restituisce `{ lista: [{ it,
perche, fase }], fase, fasi, voci: { totale, sottoSoglia }, mancano }`, con
`ALLENATI_MIN_PER_VOCE = 2`; `coda()` prende `statiQuesito`; il giro con la
precedenza è una funzione accanto, `giroTecnicheDaRivedere(esercizi,
progress)`, che restituisce `[{ e, tecniche, daRivedere }]`. **Se P-105 si
chiude con firme diverse, valgono le sue, e B-4 corregge il §7 prima di
scrivere un controllo.**

---

## 2. Il menu nuovo

### 2.1 Che cosa è deciso

**Simulazione · Quiz · Carteggio · Statistiche**, in quest'ordine, quattro
link nella barra — in basso sul telefono, in alto sul computer, come oggi. Il
**marchio** porta alla Home, che resta una sezione ma non ha più una voce
nella barra. L'**avatar** («Accedi», con l'account «Account») apre il Profilo,
sopra ogni superficie, anche il runner, come oggi. La **prova di carteggio**
sta in Simulazione, accanto a quiz base e vela. I **Segnali** sono un extra
dentro Quiz.

| Voce | id della vista | Indirizzo canonico | Titolo del documento | Icona |
|---|---|---|---|---|
| (marchio) Home | `v-home` | `/` | Rotta Giusta — quiz e carteggio per la patente nautica | — |
| Simulazione | `v-simulazione` | `/?sezione=simulazione` | Simulazione · Rotta Giusta | l'orologio di Esame |
| Quiz | `v-quiz` | `/?sezione=quiz` | Quiz · Rotta Giusta | il libro di Allenati |
| Carteggio | `v-carteggio` | `/?sezione=carteggio` | Carteggio · Rotta Giusta | la bussola di Home |
| Statistiche | `v-statistiche` | `/?sezione=statistiche` | Statistiche · Rotta Giusta | la mappa di Progressi |

**Le parole entrano, misurato.** A 375×812, con il carattere della barra
(Manrope 700, 12 px), una voce è larga 87,75 px; «Simulazione» misura 72 px,
«Statistiche» 65, «Carteggio» 58, «Quiz» 26. Oggi la più larga, «Progressi»,
ne misura 55. A 320 px la voce scende a 80 px: «Simulazione» ci sta, con poco
margine, e T-07 e T-13:distanze lo misurano già a quella larghezza.

**Il marchio è la porta della Home** e lo dice: nome accessibile «Rotta Giusta,
Home», `aria-current="page"` quando la Home è aperta. È un rischio dichiarato:
chi non sa che il marchio porta alla Home non ha più una parola che glielo
dica. La pratica lo regge (il marchio come porta della Home è la convenzione
più diffusa), ma qui nessuno l'ha provato con persone, come per tutti i nomi
(decisione 33 di P-59).

### 2.2 Dove va ogni cosa di oggi, nessuna esclusa

Come «Dove sono finite le sette viste di prima» nel §5.2 della specifica:
nessuna cosa sparisce in silenzio.

| Oggi | Dove sta domani |
|---|---|
| Home (sezione e voce della barra) | Home, dal marchio; nessuna voce nella barra |
| Allenati → Quiz, «Allenamento consigliato» | Quiz → **Allenati** |
| Allenati → Quiz, «Scegli un argomento» | Quiz → **Scegli tu** |
| Allenati → Quiz, «Ripassa gli errori» | Quiz → Scegli tu, «Da rifare» (e la scorciatoia «Da rifare», §4.1) |
| Allenati → Quiz, «Simula la prova» | esce: la Simulazione è nella barra |
| Allenati → Quiz, «Altri modi» → «Un giro tra gli argomenti» | esce come porta: è il modo in cui *Allenati* comincia quando sa poco (§4.2) |
| Allenati → Quiz, «Gli argomenti» (otto temi) | Quiz, sotto Scegli tu: ognuno apre Scegli tu con «Dove» già scelto (A-1 resta: tre tocchi dalla Home alla domanda) |
| Allenati → Quiz, «Segnalibri» | Quiz → Scegli tu, «Segnate» (e la scorciatoia «Segnate», §4.1) |
| Allenati → Quiz, «Cerca un quesito per numero» | Quiz, uno strumento sotto le porte, com'è |
| Allenati → Quiz, filtri «solo mai fatte», «solo con figura» | Scegli tu: «Mai viste» diventa una scelta di «Che cosa»; «Solo con figura» resta un filtro |
| Allenati → Carteggio, «Prova di carteggio» | Simulazione → Prova di carteggio (la sola porta); in Carteggio un link alla sezione (§5.1) |
| Allenati → Carteggio, «Esercizi su carta» → giro delle tecniche | Carteggio → **Allenati sulla carta**, con la precedenza alle tecniche andate male |
| Allenati → Carteggio, «Esercizi su carta» → a tappeto | Carteggio → **Scegli tu**, «Mai fatti, nell'ordine del foglio» |
| Allenati → Carteggio, «Che tecnica serve?» | Carteggio, a parte, com'è |
| Allenati → Carteggio, «Prima di cominciare», «Come funziona», «Vedi un esempio» | Carteggio, com'è |
| Allenati → Carteggio, «Ho carta e strumenti», «Sono senza strumenti» | escono: dicevano le due porte che ora ci sono (Allenati sulla carta, Che tecnica serve?) |
| Allenati → Segnali, le quattro modalità e la partita | Quiz → riquadro **Segnali**, extra banca → la preparazione dei Segnali, com'è |
| Esame → Le prove (carteggio, base, vela, base e vela) | Simulazione → Le prove, le stesse quattro |
| Esame → preselezione delle prove (C-5, P-109) | Simulazione, invariata (§2.4) |
| Esame → «Che cosa stai preparando?», data d'esame | Simulazione, nello stesso `details` chiuso; e nel Profilo, com'è |
| Esame → «Com'è fatto l'esame» | Simulazione |
| Esame → «Prove di questa pagina» / le prove fatte | Simulazione, e in Statistiche → Prove sostenute, come oggi in Esame e in Progressi |
| Progressi, senza account: «Le attività di questa pagina», «Perché qui manca lo storico» | Statistiche, com'è; «Vai ad Allenati» diventa «Vai ai Quiz» |
| Progressi, con l'account: mappa dei cinque stati, legenda, «Dove pesa di più adesso» | Statistiche, com'è |
| Progressi → «Rifai N errori» | Statistiche → **Scegli tu già compilato**: Dove = la riga, Che cosa = Da rifare, Quante = Tutte (§4.4) |
| Progressi → «Allena» | Statistiche → **Scegli tu già compilato**: Dove = la riga, Che cosa = Tutte, Quante = 20 (§4.4) |
| Progressi → Prove sostenute, Andamento, Sessioni | Statistiche, com'è |
| Profilo (avatar) e i suoi pannelli | invariati, tranne il modulo d'accesso (§3) |
| Runner, risultato, revisione, riprova | invariati; cambia solo il nome del ritorno («Torna ai Quiz», «Torna a Simulazione») |
| Privacy, condizioni, avvertenza | invariate, sopra il lavoro |

### 2.3 Gli indirizzi di oggi continuano a portare al posto giusto

Le query su `/` restano la scelta del ridisegno (P-79): un indirizzo vero,
copiabile, che una ricarica non paga con un 404. `navigazioneSito()` accetta
quelle di oggi come alias e restituisce l'indirizzo canonico, che la pagina
scrive con `replaceState`, come fa oggi con `/app`. Un segnalibro del browser
di ieri porta al posto di oggi.

| Arriva | Va | Indirizzo canonico scritto |
|---|---|---|
| `/?sezione=allenati`, `&segmento=quiz` | Quiz | `/?sezione=quiz` |
| `/?sezione=allenati&segmento=carteggio` | Carteggio | `/?sezione=carteggio` |
| `/?sezione=allenati&segmento=segnali` | Quiz, preparazione dei Segnali | `/?sezione=quiz&attivita=segnali` |
| `/?sezione=esame` | Simulazione | `/?sezione=simulazione` |
| `/?sezione=progressi` | Statistiche | `/?sezione=statistiche` |
| `sezione=quiz` (alias di oggi, sezione di domani) | Quiz | `/?sezione=quiz` |
| `sezione=cart` | Carteggio | `/?sezione=carteggio` |
| `sezione=seg` | Quiz, preparazione dei Segnali | `/?sezione=quiz&attivita=segnali` |
| `sezione=tec` | Carteggio, preparazione di «Che tecnica serve?» | `/?sezione=carteggio&attivita=tecniche` |
| `sezione=diag` | Statistiche | `/?sezione=statistiche` |
| `sezione=oggi` | Home | `/` |
| `sezione=info` | Home, pannello Info | `/` |
| `/app`, con o senza query o frammento | Quiz (oggi Allenati/Quiz) | `/?sezione=quiz` |
| `#profilo` | il pannello Profilo sopra la sezione chiesta | invariato |
| `/allenati`, `/quiz`, ogni percorso non servito | Home, «Questa destinazione non è disponibile…» | `/` |

**La porta `/app`** (`site/app.html`) oggi fa `location.replace()` verso
`/?sezione=allenati&segmento=quiz`, con il link «Apri Allenati» e il titolo
«Apri Allenati · Rotta Giusta». Funzionerebbe anche così, passando dall'alias;
ma nomina una sezione che non c'è più. Proposta, decisione 1 del §10: la porta
va a `/?sezione=quiz`, link «Apri i quiz», titolo «Apri i quiz · Rotta Giusta».
La regola sul frammento del gettone non cambia.

### 2.4 La preselezione delle prove (C-5) passa con Simulazione

P-109 la fa prima, nella sezione Esame di oggi: con «che cosa stai
preparando?» detto, la preparazione della simulazione parte sulla prova che
serve, dalla fonte che oggi in Esame dice quali prove servono
(`scelteConfermate()`). Quando Esame diventa Simulazione, la preselezione
**non si riscrive**: la stessa funzione, la stessa preparazione, lo stesso
controllo di P-109, con la porta che parte da `#v-simulazione` invece che da
`#v-esame`. P-109 non è fuso mentre si scrive questo progetto: se cambia la
forma delle porte di Esame, B-4 la porta com'è, e qui non si anticipa niente.

**Gli appunti dell'autore** (I-32, punto 3) dicono di più: «si sceglie se
includere la vela e se includere il carteggio, e si comincia», cioè una
simulazione intera, carteggio e quiz di seguito. È un'attività nuova — 60
minuti di carta e poi 30 di quiz, con due esiti —, e non è nel piano.
Decisione 4 del §10, con la proposta di rimandarla.

### 2.5 La Home, i testi riscritti per il menu nuovo

La Home di riferimento è quella a sei pannelli di A-2. I pannelli che nominano
le sezioni di oggi sono l'1, il 2, il 5 e, in HA, lo 0. Nuovi testi, nella
forma di `argomenti-pannelli.md` §3; le parole contate come lì, sul testo che
si legge senza i link.

**Pannello 1 — Da dove si comincia.**
- **Titolo:** Da dove si comincia
- **Testo:** All'esame le prove sono tre: il carteggio, il quiz base e, se prendi
  anche la vela, il quiz vela. Per cominciare non serve registrarsi: bastano
  dieci domande.
- **La mappa, quattro righe:**
  - **Simulazione** — fai le prove come all'esame, nell'ordine in cui le
    sostieni.
  - **Quiz** — ti alleni: decide il sito, o scegli tu.
  - **Carteggio** — gli esercizi sulla carta.
  - **Statistiche** — vedi che cosa hai fatto e dove sbagli.
- **Azione (link):** Allenati con 10 domande → apre Quiz → Allenati con Quante =
  10 (§4.2).
- 61 parole senza il titolo, contate separando sugli spazi: il testo di oggi,
  contato allo stesso modo, ne ha 62, il tetto dei pannelli. I Segnali escono dalla riga
  della mappa, perché sono un extra di Quiz e il pannello li nominava solo come
  terzo segmento di Allenati; restano nel riquadro di Quiz.

**Pannello 2 — Come funziona una domanda.** Una frase cambia: «Poi lo riapri da
«Ripassa gli errori».» diventa **«Poi lo ritrovi in Quiz, fra quelle da
rifare.»** Le altre restano.

**Pannello 3 — Il carteggio, al tavolo.** Il link «Apri il Carteggio» resta e
ora porta a una voce della barra. Una frase in più, facoltativa: **«La prova a
tempo la trovi in Simulazione.»** (decisione 9 del §10).

**Pannello 5 — Con l'account, le risposte restano.** «In Progressi vedi,
argomento per argomento, …» diventa **«In Statistiche vedi, argomento per
argomento, …»**.

**Pannello 0, con l'account (HA).** La proposta consigliata apre Quiz →
Allenati; «Vedi i Progressi» diventa **«Vedi le Statistiche»**.

**Se A-2 non è fusa quando parte B-5**, cambiano le tappe della Home di oggi:
«Apri Esame» → «Apri Simulazione»; «Apri Segnali» → apre Quiz, preparazione
dei Segnali; «Vedi i Progressi» → «Vedi le Statistiche»; «Allenati con dieci
domande» e «Prova con dieci domande» → Quiz → Allenati, Quante = 10;
«L'allenamento consigliato» → Quiz → Allenati; «Scegli un argomento» → Quiz →
Scegli tu; «Ripassa gli errori» (nella tappa «Gli errori tornano») → Scegli tu,
Da rifare.

**Gli altri testi della pagina che nominano le sezioni** (guardati):
«Torna ad Allenati · Quiz» → «Torna ai Quiz»; «Torna a Esame» → «Torna a
Simulazione»; «Vai ad Allenati» → «Vai ai Quiz»; il sottotitolo di Allenati,
«Quiz, lavoro sulla carta, riconoscimento dei segnali.», esce con la sezione.
B-5 cerca nella pagina ogni occorrenza di «Allenati» come nome di sezione,
«Esame» come sezione e «Progressi»: «Allenati» resta, ma come nome della porta,
e chi legge non deve trovare tutte e due le cose con la stessa parola nella
stessa schermata (§4.2).

---

## 3. Il pulsante unico per accedere e creare l'account (C-6)

### 3.1 Il problema, guardato

Oggi nell'intestazione il pulsante è già uno, «Accedi». Ma dentro ce ne sono
due: il modulo d'accesso, con «Crea un account» come pulsante secondario che lo
sostituisce con un altro modulo; e quel modulo non torna all'accesso, e si
chiude con «Torna al riepilogo» anche dalla Home (§1). Chi ha già un account e
apre l'invito «Conserva le risposte» arriva nel modulo di creazione, e lo
scopre solo con il `409` di «Questa email è già registrata.» (R-ACC-41). Chi
studia deve sapere prima di scrivere se ha un account o no, e scegliere la
strada giusta.

### 3.2 La proposta: un modulo, un pulsante, e la strada la trova il sito

**Dove sta.** Nell'intestazione, a destra, dove sta oggi: «Accedi» senza
account, «Account» con (decisione 6 del §10: la parola resta «Accedi», uno dei
nomi chiusi il 14 ottobre). Il pulsante apre il pannello comune dell'account,
`aria-modal`, com'è.

**Che cosa apre.** Un modulo solo:

- **Titolo:** «Accedi o crea un account» dall'intestazione; «Conserva le
  risposte» dai tre posti dell'invito (§3.4).
- **Campi:** Email, Password, «Mostra password».
- **Sotto i campi, sempre visibili:** «Se non hai ancora un account, lo crei con
  questa email e questa password. Almeno 15 caratteri: puoi usare una frase di
  tre o quattro parole.»; la frase sulle email e i dati con «Come trattiamo i
  dati»; la frase di R-ACC-75: «Creando l'account accetti le condizioni per
  l'account; l'account è per chi ha compiuto 18 anni.». Prima del pulsante che
  può creare l'account, come R-ACC-75 e R-ACC-76 vogliono.
- **Un pulsante pieno:** **«Continua»**.
- **Secondari:** «Ho dimenticato la password»; il ritorno, con il nome
  dell'origine vera — «Torna alla Home», «Torna al risultato», «Torna
  all'attività» — e non più «Torna al riepilogo» dovunque.

**Che cosa fa «Continua».** Senza un server nuovo: le rotte di oggi, in un
ordine che dipende da dove si è entrati.

- **Dall'intestazione** (chi studia vuole entrare): `POST /v1/accesso`.
  - `200`: dentro, come oggi (con la scelta sulle risposte della pagina di
    R-ACC-44 e R-ACC-48).
  - `401`: «Non troviamo un account con questa email e questa password.» Due
    azioni: **«Crea l'account con questi dati»** (pieno) e «Ho dimenticato la
    password». Il primo fa `POST /v1/registrazione` con gli stessi campi:
    `201` dentro, con l'onboarding; `409` «Questa email è già registrata: la
    password non è quella giusta.» con «Reimposta la password»; `422` il motivo
    della password accanto al campo, com'è (R-ACC-48).
  - `429`, `403`: come oggi (R-ACC-48).
- **Dai tre posti dell'invito** (chi studia vuole conservare):
  `POST /v1/registrazione`.
  - `201`: dentro, le righe della pagina salgono (R-ACC-43), l'onboarding.
  - `409`: «Questa email è già registrata.» con **«Accedi con questa password»**
    (pieno) — che fa `POST /v1/accesso` con gli stessi campi, senza chiederli
    di nuovo — e «Reimposta la password». È R-ACC-41 com'è oggi, con un tocco
    in meno: la password non si riscrive.

**Perché l'ordine dipende dall'origine, e non uno solo per tutti.** Tentare
sempre prima la registrazione farebbe consumare a chi entra
dall'intestazione le cinque registrazioni l'ora per indirizzo (R-ACC-30), e
calcolerebbe un hash inutile. Tentare sempre prima l'accesso farebbe vedere a
chi arriva da un invito — il caso più comune lì è chi non ha l'account — un
«Non troviamo un account» prima di poterlo creare.

**Perché non «prima l'email, poi il sito ti dice se esiste».** Vorrebbe una
rotta nuova che dice se un indirizzo è iscritto: l'accesso non lo dice per
scelta (R-ACC-17), la password dimenticata nemmeno (R-ACC-28). La
registrazione lo dice dal 26 settembre, ma solo a chi prova a registrarsi e con
il limite delle cinque l'ora: è lì che la proposta lo usa.

**Che cosa non cambia.** Nessun account nasce senza un tocco esplicito su un
pulsante che dice di crearlo («Continua» da un invito, «Crea l'account con
questi dati» dall'intestazione), con le condizioni e i 18 anni visibili prima.
Il server non cambia. Un indirizzo scritto male crea un account che non si
conferma e si cancella al settimo giorno (R-ACC-11), come oggi.

**L'alternativa**, decisione 5 del §10: tenere i due moduli di oggi, aggiungere
al modulo di creazione «Ho già un account» che torna all'accesso con l'email
già scritta, e correggere il nome del ritorno. Costa meno, ma lascia a chi
studia la scelta fra due strade.

### 3.3 Il modulo nei due stati, e il conto dei tocchi

- **Senza account:** il modulo, com'è descritto; il Profilo sotto (Che cosa stai
  preparando?, Data d'esame, Dati, Info e diagnostica, legali), com'è.
- **Con l'account:** «Account» apre il Profilo dell'account, com'è oggi: email,
  verifica, stato dell'invio, uscita, azzeramento, cancellazione.
- **AC** (il ciclo del §9 del ridisegno, dal modulo aperto): focus Email, focus
  Password, «Continua», «Salta per ora», Chiudi: 5, come oggi; dall'intestazione
  con un account nuovo, 6, con «Crea l'account con questi dati». P-82 ha misurato
  4 invece di 5 perché il modulo si chiude alla creazione; vale ancora.

### 3.4 I posti dell'invito (R-ACC-03) non cambiano

Tre posti e nessun altro: la Home a chi ha risposto senza account, il risultato
di una simulazione («Conserva questa prova e ritrovala quando torni»), i
riepiloghi delle attività. «Continua senza account» li chiude come oggi. Il
pulsante dell'intestazione non è un invito, e non lo diventa: non porta
vantaggi né frasi da vendere. Cambia soltanto che cosa aprono i loro pulsanti:
lo stesso modulo, con il titolo «Conserva le risposte» e l'ordine dell'invito.
Le sezioni rinominate non spostano nessun invito: Statistiche senza account non
ne ha, come Progressi.

---

## 4. Le due porte dei quiz

### 4.1 La sezione Quiz

Dall'alto, a 375 px:

- **Titolo:** Quiz
- **Sottotitolo:** «Le {N} domande del Ministero, base e vela. Puoi lasciar
  decidere al sito, o scegliere tu.» — {N} dalla banca caricata (1.722), mai
  scritto a mano.
- **Porta 1, riquadro «Allenati»** — «Il sito sceglie le domande dalle tue
  risposte e ti dice perché ognuna è lì: prima esplora, poi ripara gli errori,
  poi conferma.» Pulsante pieno **«Allenati»** (`data-porta="allenati"`,
  `data-ruolo="principale"`).
- **Porta 2, riquadro «Scegli tu»** — «Decidi tu dove, che cosa e quante: un
  argomento, solo gli errori, le domande che hai segnato.» Pulsante di contorno
  **«Scegli tu»** (`data-porta="scegli"`).
  - **Le scorciatoie, sotto:** «Gli argomenti», gli otto temi in ordine di peso
    d'esame, ognuno apre Scegli tu con «Dove» = quel tema (A-1: Home → Quiz →
    tema → Inizia, tre tocchi). E due pulsanti piccoli che compaiono **solo con
    un numero maggiore di zero**, dalla stessa chiamata che aprirebbe la lista:
    «Da rifare · {N}» e «Segnate · {N}» (decisione 3 del §10). Non sono porte:
    aprono la preparazione di Scegli tu, già compilata.
- **Strumento, «Cerca un quesito per numero»**, com'è (`ricercaNumero()`): la
  casella, la banca, «Cerca», i risultati con «Inizia» sul quesito trovato.
- **Riquadro «Segnali»**, extra banca — «Fanali, segnali diurni e suoni da
  riconoscere a colpo d'occhio. Non sono quesiti del Ministero e non entrano
  nelle Statistiche.» Pulsante di contorno **«Gioca ai Segnali»** → la
  preparazione dei Segnali di oggi, con le quattro modalità e i punteggi.

Una sola azione piena nel primo schermo, «Allenati» (R-RIF-19); al più quattro
bersagli nel primo schermo (R-RIF-22): Allenati, Scegli tu, il primo tema e il
secondo. B-4 lo misura; se non entra, i temi scendono sotto il primo schermo,
non si toglie una porta.

### 4.2 «Allenati» — decide il sito, e dice perché

**La parola.** «Allenati» era il nome della sezione; da domani è il nome della
porta, e la sezione non c'è più. Nello stesso schermo non compaiono mai tutte e
due le cose (§2.5).

**La preparazione, per esteso:**

- **Titolo:** Allenati
- **Testo:** «Il sito sceglie le domande dalle risposte che vede e ti dice,
  domanda per domanda, perché è lì. Tu scegli soltanto quante.»
- **Quante:** 10 · 25 · 50 (25 di partenza; 10 se si arriva da «Allenati con 10
  domande» della Home).
- **La fase**, una riga, da `allenati().fase`:
  - `esplora`: «Adesso il sito esplora: cerca prima di vedere ogni parte della
    banca.» E, se `mancano` è maggiore di zero: «Ti mancano {mancano} risposte
    per vedere almeno {ALLENATI_MIN_PER_VOCE} domande di ogni gruppo della banca
    ({voci.totale} in tutto).» (decisione 10 del §10). È un fatto contato dal
    motore, non una diagnosi: non dice «poi sapremo dove sei debole».
  - `ripara`: «Adesso il sito ripara: riprende le domande sbagliate.»
  - `conferma`: «Adesso il sito conferma: rivede le domande prese giuste una volta
    sola.»
- **Il conteggio:** «Ne aprirai {quanti}.», dalla stessa chiamata che apre la
  lista. I minuti stimati **solo** se `ritmo()` è affidabile, con la fonte
  `orologio` (R-TEMPO-01, 02), com'è oggi nell'allenamento consigliato.
- **Senza account**, una riga in più, prima dell'avviso: «Il sito vede solo le
  risposte date in questa pagina: per questo comincia quasi sempre esplorando.»
  Non contiene «senza account»: l'avviso del §4.1 del progetto del client resta
  uno solo, accanto a «Inizia» (R-RIF-21), e questa riga non deve contare come
  un secondo.
- **Con l'account:** «Il sito sceglie dalle risposte del tuo account, anche
  quelle date su un altro dispositivo.», poi la frase HA della conservazione e
  lo stato dell'invio, come oggi.
- **Pulsante pieno:** «Inizia l'allenamento». **Ritorno:** «Torna ai Quiz»
  (`data-prep="chiudi"`), alla porta, con fuoco e scorrimento.
- **Nel runner** ogni domanda porta il suo perché, nella pillola dove oggi
  l'allenamento consigliato mette i motivi di `mirata()`. Avanzamento, tag,
  segnalibro e riepilogo come oggi; `mode` della riga `'allenati'` (§7.4).

**Gli stati:**

| Stato | Che cosa si vede |
|---|---|
| Caricamento dell'account | «Stiamo caricando le tue risposte…»; nessuna fase, nessun conteggio |
| Banca non raggiungibile | «Non riusciamo a caricare la banca. Riprova con la rete disponibile.» con «Riprova»; Inizia disabilitato |
| Lettura delle risposte incompleta | «Non riusciamo a caricare tutte le risposte. Riprova prima di usare questi dati per scegliere un'attività.» con «Riprova»; Inizia non avvia: *Allenati* sceglie dalle risposte, e da un vuoto di ripiego sceglierebbe il falso. La riga offre la simulazione, che pesca senza guardare le risposte (le «prove cieche» del §4 del ridisegno) |
| Senza account, pagina vuota | la fase è `esplora`, `mancano` è il totale; testi come sopra |
| Lista vuota | non succede con una banca caricata: *Allenati* conferma quando non c'è altro. Se succede, «Niente da fare con questa selezione.» con «Scegli tu» |
| Lista cambiata fra preparazione e Inizia | «La selezione è cambiata. Torna alla preparazione per vedere la lista aggiornata.» Nessun avvio diverso sotto lo stesso numero |

**Lo screening non è più una porta.** È il modo in cui *Allenati* comincia
quando una voce è sotto la soglia: `allenati()` compone `screening()` e
`mirata()`, non le riscrive (P-105). «Un giro tra gli argomenti», con il suo
selettore 1/2/4/6 per voce, esce; chi lo vuole ottiene lo stesso con Scegli
tu → «Tutte» → «Mai viste». **Si perde** la possibilità di chiedere «sei
domande per ogni voce» con un tocco: dichiarato in I-32, accettato dall'autore
con l'ordine del piano.

### 4.3 «Scegli tu» — dove, che cosa, quante

**La preparazione, per esteso:**

- **Titolo:** Scegli tu
- **Testo:** «Scegli dove, che cosa e quante. Vedi la risposta esatta dopo ogni
  domanda.»
- **Dove:**
  - Banca: «Quiz base · {n}», «Quiz vela · {n}», dalla banca caricata;
  - Argomenti: «Tutti gli argomenti» o «Scegli gli argomenti», com'è oggi (temi
    e voci; la vela per voce, R-SEL-09). Il «punto da studiare» arriva con B-6.
- **Che cosa**, cinque scelte, ognuna con il numero accanto:
  - «Tutte · {n}»
  - «Mai viste · {n}»
  - «Da rifare · {n}»
  - «Da confermare · {n}»
  - «Segnate · {n}»

  Sono le parole di Q-STATI usate come selettore: «da rifare» sono i deboli,
  «da confermare» gli incerti. «Recuperati» e «acquisiti» non si scelgono: non
  c'è niente da fare su un quesito confermato, e nessuna delle due l'autore l'ha
  chiesta (I-32). Ogni numero è il `quanti` della **stessa selezione** che
  aprirebbe quella scelta, senza tetto: il numero promesso e la lista vengono
  dalla stessa fonte.
- **Filtri:** «Solo quesiti con figura», com'è; si spegne da solo su una banca
  che non ne ha, col perché scritto.
- **Quante:** 20 · 50 · 100 · Tutte.
- **Il conteggio:** «{disponibili} quesiti con questa selezione. Ne aprirai
  {quanti}.»; e l'ordine, una riga: con «Tutte» «Prima gli errori ancora da
  riprendere e i quesiti mai incontrati, poi gli altri.» (com'è oggi); con «Da
  rifare» «Dal più trascurato.»; con «Segnate» «Nell'ordine della banca.».
- **Con «Segnate»** il «Dove» si riduce alla banca: gli argomenti si
  disabilitano, con «I segnalibri si scelgono per banca.» Il motore non filtra i
  segnalibri per tema (`codaSegnalibri()`), e la pagina non lo fa da sé. I segni
  su quesiti che la banca non ha si nominano, come oggi (R-SEGNO-02).
- **Pulsante pieno:** «Inizia i quiz». **Ritorno:** il nome dell'origine vera —
  «Torna ai Quiz», «Torna alle Statistiche», «Torna alla Home».
- **Senza account:** gli stati sono quelli delle risposte della pagina aperta; la
  pagina vuota ha «Mai viste» uguale a «Tutte» e le altre a zero, e le scelte a
  zero restano visibili, con il numero, ma non si avviano: «Niente da fare con
  questa selezione.» con «Scegli Tutte».

**Gli stati:**

| Stato | Che cosa si vede |
|---|---|
| Caricamento | «Stiamo caricando le tue risposte…»; i numeri non si scrivono |
| Banca non raggiungibile | come Allenati; nessun numero inventato |
| Lettura incompleta | il messaggio del §4 del ridisegno, con «Riprova»; nessuna delle cinque si avvia, nemmeno «Tutte», che mette prima gli errori e quindi legge le risposte; si offre la simulazione |
| Selezione vuota | «Niente da fare con questa selezione.» con due uscite vere: «Togli i filtri» e «Scegli Tutte» |
| Lista cambiata a Inizia | come Allenati |

### 4.4 Scegli tu già compilato: da Statistiche, dai segnalibri, dai temi

| Da dove | Dove | Che cosa | Quante | Ritorno | Contratto che resta |
|---|---|---|---|---|---|
| Statistiche → «Rifai N errori» (tema, voce, frase) | il `filtro` della riga di `quadro()` | Da rifare | Tutte | Torna alle Statistiche | R-MAPPA-15: N è `daRifare`, la lista è quella di `soloDaRifare` **senza tetto** |
| Statistiche → «Allena» | il `filtro` della riga | Tutte | 20 | Torna alle Statistiche | R-MAPPA-18: una `coda()` con il filtro della riga e venti quesiti |
| Quiz → un tema | quel tema | Tutte | 20 | Torna ai Quiz | A-1 |
| Quiz → «Da rifare · N» | Tutto, la banca di base | Da rifare | Tutte | Torna ai Quiz | il «Ripasso degli errori» di oggi apre **tutti** gli errori di sempre (`soloSbagliate`); da domani «Da rifare» apre i deboli (§7.2) |
| Quiz → «Segnate · N» | la banca | Segnate | Tutte | Torna ai Quiz | R-SEGNO-02, senza tetto |
| Home → «Allenati con 10 domande» | — | — | — | è *Allenati*, Quante = 10 (§4.2) | `preparaBreve()` esce (§7.3) |

**Già compilato non vuol dire bloccato:** chi studia cambia ogni campo prima di
Inizia. Ma a ogni cambio il conteggio si rifà, e il titolo dell'origine sparisce
appena il filtro non è più quello della riga: «Scegli tu · da Statistiche»
diventa «Scegli tu».

**Che cosa si perde, ed è da dire all'autore** (decisione 11 del §10): oggi
«Ripassa gli errori» apre `soloSbagliate`, cioè anche gli errori già ripresi;
«Da rifare» apre solo quelli la cui ultima risposta è sbagliata. Chi vuole
ripassare tutti gli errori di sempre, anche quelli già sistemati, non ha più una
porta. Proposta: va bene così — «da rifare» è la lista della mappa e dei cinque
stati, e chi ha ripreso un errore lo trova fra «da confermare» o «recuperati» —,
e `soloSbagliate` resta nel motore per chi lo vorrà.

### 4.5 Dove finiscono le otto porte di oggi

La tabella di I-32, con il raccordo e la funzione del motore.

| Oggi | Domani | Raccordo di domani | Motore |
|---|---|---|---|
| Allenamento consigliato (`data-modo="mirata"`) | *Allenati* | `preparaAllenati` | `allenati()`, che compone `mirata()` |
| Allenati con 10 domande (Home, `preparaBreve`) | *Allenati*, Quante = 10 | `preparaAllenati` | `allenati({ n: 10 })` |
| Un giro tra gli argomenti (`screening`) | *Allenati* nei primi giorni | `preparaAllenati` | `allenati()`, che compone `screening()` |
| Ripassa gli errori (`sbagliate`) | *Scegli tu*, «Da rifare» | `preparaScelta` | `coda({ soloDaRifare })` |
| Scegli un argomento (`argomento`) | *Scegli tu*, «Dove» | `preparaScelta` | `daAllenare()` con «Tutte» |
| Solo mai fatte, solo con figura | «Mai viste» di *Scegli tu*; il filtro «Solo con figura» | `preparaScelta` | `coda({ stati: ['nuovo'] })`; `soloFigura` |
| I miei segnalibri (`preparaSegnalibri`) | *Scegli tu*, «Segnate» | `preparaScelta` | `codaSegnalibri()` |
| Allena / Rifai da Progressi | *Scegli tu*, già compilato | `preparaScelta` con l'origine | `coda()` con il filtro della riga |
| Cerca un quesito per numero | uno strumento, non una modalità | `ricercaNumero`, invariato | `cercaNumero()` |
| (Simula la prova, `sim`) | Simulazione | `selezioneSimulazione`, il ramo `sim` di oggi | `simulazione()`, `simulazioneVela()` |

---

## 5. Le porte del Carteggio

### 5.1 La sezione Carteggio

- **Titolo:** Carteggio
- **Testo**, com'è (R-UX-03): «Tu svolgi gli esercizi sulla carta. Rotta Giusta
  ti propone una selezione e mostra la risposta ministeriale per confrontare il
  risultato. Sei tu a giudicare: il sito non corregge il carteggio.»
- **Porta 1, «Allenati sulla carta»** — «Il sito sceglie gli esercizi: un giro
  che tocca tutte le tecniche, prima quelle degli esercizi andati male.»
  Pulsante pieno «Allenati sulla carta».
- **Porta 2, «Scegli tu»** — «Scegli tecnica, argomento o carta, e se rifare gli
  esercizi da rivedere o proseguire con quelli mai fatti.» Pulsante di contorno
  «Scegli tu».
- **A parte, «Che tecnica serve?»** — «Senza carte: riconosci come impostare il
  problema. Non equivale a svolgerlo.», com'è: è l'unica attività del Carteggio
  che si fa senza carta (I-32).
- **Un link, non una porta:** «La prova a tempo, {esercizi} esercizi in {minuti}
  minuti, sta in Simulazione.» → `/?sezione=simulazione`, sulla porta della prova
  (decisione 8 del §10). I numeri da `PROVA_CARTEGGIO`.
- «Prima di cominciare», «Come funziona», «Vedi un esempio», com'è. «Ho carta e
  strumenti» e «Sono senza strumenti» escono (§2.2).

### 5.2 «Allenati sulla carta»

- **Titolo:** Allenati sulla carta
- **Testo:** «Un giro che tocca tutte le tecniche degli esercizi di questa banca.
  Prima vengono le tecniche degli esercizi che hai giudicato da rivedere. Svolgi
  gli esercizi sulla carta, senza limite di tempo; poi confronti e giudichi tu.»
- **Il conteggio:** «{n} esercizi · Carte richieste: {carte}», dalla preparazione
  (R-SEL-17).
- **Per ogni esercizio**, nel runner, «porta al giro: …» com'è oggi, e in più le
  tecniche `daRivedere` con «da rivedere: …».
- **Senza account:** «Il sito vede solo i giudizi dati in questa pagina: senza
  esercizi da rivedere, il giro è quello di sempre.», poi l'avviso della carta del
  §4 del ridisegno, accanto a Inizia.
- **Pulsante pieno:** «Inizia gli esercizi». **Ritorno:** «Torna al Carteggio».
- **Stati:** banca del carteggio non raggiungibile — «Non riusciamo a caricare gli
  esercizi del carteggio. Riprova con la rete disponibile.» con «Riprova»; lista
  cambiata a Inizia — come i quiz; lettura incompleta — «Allenati sulla carta» non
  si avvia, come *Allenati*.
- **Motore:** `giroTecnicheDaRivedere(esercizi, progress)` (P-105); senza
  esercizi andati male è il `giroTecniche()` di oggi, e il test di P-105 lo
  pretende. `mode` della riga `'giro'`, com'è, così le attività di prima e di
  dopo si leggono allo stesso modo (§7.4).

### 5.3 «Scegli tu» sulla carta

- **Titolo:** Scegli tu
- **Dove:** «Tutto il foglio», oppure una tecnica (le 12 di `tecniche.json`), un
  argomento (correnti, navigazione costiera, scarroccio, carburante), una carta
  (5/D, 42/D). Uno solo dei tre alla volta, per la prima versione.
- **Che cosa:** «Tutti · {n}», «Mai fatti · {n}», «Da rivedere · {n}». Da
  rivedere sono gli esercizi la cui ultima riga ha il giudizio «da rivedere».
- **Ordine:** con «Mai fatti» e «Tutto il foglio» **nell'ordine del foglio**: è
  «A tappeto» di oggi, che riprende da dove eri senza segnaposto (R-SEL-07).
- **Quante:** 1 · 2 · 4 · 8.
- **Pulsante pieno:** «Inizia gli esercizi». **Ritorno:** «Torna al Carteggio».
- **Senza account:** «Da rivedere» vede solo i giudizi della pagina aperta, e a
  pagina vuota è zero.
- **Foglio finito:** con «Mai fatti» e niente da fare, «Hai provato tutti gli
  esercizi di questa selezione.» con «Scegli Da rivedere» e «Scegli Tutti»: mai
  un pulsante spento in silenzio (§7.3 della specifica).
- **Motore:** qui manca una funzione. `tappeto()` fa soltanto «Mai fatti, tutto
  il foglio»; un filtro per tecnica, argomento o carta e «Da rivedere» non ci
  sono, e P-105 non li scrive. Serve un export prima di B-5 (§7.2), altrimenti
  la pagina filtrerebbe da sé gli esercizi, che è proprio quello che R-SEL-17
  vieta. Decisione 12 del §10.

### 5.4 Simulazione → Prova di carteggio

È la porta di oggi in Esame, spostata: la stessa preparazione, la stessa
`provaCarteggio()`, la cieca o «prima i mai provati», la frase «Sei tu a
giudicare» prima di Inizia (R-UX-03), il ritorno «Torna a Simulazione». La
bozza con l'account regge una ricarica, com'è (§7.6 della specifica).

---

## 6. Simulazione e Statistiche

### 6.1 Simulazione

- **Titolo (h1):** Simulazione d'esame; nella barra «Simulazione» (decisione 15
  del §10).
- **Testo:** «Le prove come all'esame, nell'ordine in cui si sostengono. Le
  prepari quando vuoi, senza sblocchi.»
- **Le prove:** Prova di carteggio · Simula il quiz base · Simula il quiz vela ·
  Quiz base e vela, con le condizioni accanto da `PROVA_CARTEGGIO` e
  `meta.prove`, le stesse preparazioni di oggi e la preselezione di P-109.
- Poi, come oggi in Esame: «Che cosa stai preparando?» e la data, nel `details`
  chiuso il cui sommario dice la scelta o «Non l'hai detto»; «Com'è fatto
  l'esame»; le prove fatte.
- Il risultato di una simulazione tiene il suo invito (R-ACC-03).

### 6.2 Statistiche

Tutto quello che oggi è Progressi, con il nome nuovo nei testi. Le azioni
«Rifai» e «Allena» aprono Scegli tu già compilato (§4.4) invece di una
preparazione a parte; il conteggio e la lista restano quelli dei raccordi di
oggi, e un controllo pretende che coincidano (§8). Senza account «Le attività
di questa pagina» e «Perché qui manca lo storico», com'è; «Vai ad Allenati»
diventa «Vai ai Quiz». I Segnali non entrano (R-UX-04).

---

## 7. Il contratto per B-4 e B-5

### 7.1 La navigazione e il regime

**`VISTE_RIDISEGNO`**, con lo stesso nome, ora con cinque viste:

```
const VISTE_RIDISEGNO = ['home', 'simulazione', 'quiz', 'carteggio', 'statistiche'];
```

Il nome resta perché dice «le viste della pagina ridisegnata», e cambiarlo
toccherebbe ogni banco senza aggiungere niente. **La regola del regime** in
`tests/regime_pagina.py` riconosce, per un periodo di transizione, due liste
esatte: quella di ottobre, `['home', 'allenati', 'esame', 'progressi']`, regime
**«ridisegno»**; e questa, regime **«porte»**. Una lista diversa, una sola delle
due dichiarazioni, o nessuna: rosso con il motivo, com'è. È il meccanismo di
P-80: B-4 scrive i controlli del regime «porte» mentre la pagina vera è ancora
nel «ridisegno», che continua a passare i suoi; la pagina di riferimento è nel
nuovo. **Il regime «ridisegno» scade alla merge di B-5**: da lì la regia toglie
il suo ramo dai controlli, come P-89 ha fatto per quello di prima, e tiene
pagine di riferimento, rotture e controlli.

**`navigazioneSito({ url, evento, contesto })`**, la stessa firma; cambia il
ritorno:

```
→ { sezione, attivita, fase, pannello, ritorno, effetto, motivo, url, gettone }
  sezione   'home' | 'simulazione' | 'quiz' | 'carteggio' | 'statistiche'
  attivita  null | 'allenati' | 'scegli' | 'segnali'           in quiz
            null | 'allenati' | 'scegli' | 'tecniche'          in carteggio
            null | 'prova-carteggio' | 'quiz-base' | 'quiz-vela' | 'base-e-vela'   in simulazione
  fase      'preparazione' o null, com'è
  pannello, ritorno, effetto, motivo, gettone   com'è
  url       l'indirizzo canonico del §2.3, mai un alias
```

`segmento` esce dal ritorno: le sezioni nuove non hanno segmenti. Come
parametro d'ingresso resta accettato, solo per tradurre gli indirizzi di oggi
(§2.3); con una sezione nuova è «parametro sconosciuto». I parametri ammessi
restano `sezione`, `segmento`, `attivita`, `fase`, `banca`, `temi`, `voci`, `n`:
niente di chi studia nell'indirizzo, quindi nemmeno «Che cosa» di Scegli tu,
che sta nel contesto in memoria. Le regole di oggi restano: un runner non si
apre da un indirizzo; i legali sopra la tappa; l'attività in corso chiede di
uscire; la conclusa mostra il risultato.

**Le tabelle in maiuscolo** che il banco del ridisegno estrae: `ALIAS`
diventa la tabella del §2.3; `PARAMETRI` com'è.

**La barra** (R-NAV-03): quattro link, ognuno con il suo `href` canonico, in
quest'ordine, con la parola intera; il marchio è un link a `/` con nome
accessibile, e non è una voce della barra. Gli `data-v` della pagina: le cinque
sezioni e gli alias del §2.3, nessun altro.

**La porta `/app`** (R-NAV-12): la regola com'è, con la destinazione e il titolo
della decisione 1.

### 7.2 I raccordi, che sostituiscono `selezioneQuiz()` e `MODI`

Puri, al primo livello, fuori da ogni elenco di modalità; `fonte` è quella di
`selezioneQuiz()` oggi (banca, specchio, righe, oggi, stato della lettura,
accesso). Ogni raccordo chiama **una** selezione del motore per la lista che
apre, e i numeri che la pagina scrive vengono da lì.

```
const PORTE = ['allenati', 'scegli'];                       sostituisce MODI
const COSE  = ['tutte', 'mai', 'rifare', 'confermare', 'segnate'];

preparaAllenati(conf, fonte)
  conf  { kind: 'base', n: 10 | 25 | 50, seme }
  una E.allenati(items, prog, oggi, { n, kind, seme })
  → { stato: 'pronta' | 'vuota' | 'bloccata', motivo,
      lista: [it], perche: [stringa], fase, fasi, mancano, voci, quanti }
  'bloccata' con la lettura incompleta o la banca assente, senza chiamare il motore

avviaAllenati(preparazione, fonte, avvia)
  rifà la stessa E.allenati e confronta id e ordine;
  uguali → avvia(preparazione.lista, 'allenati', { origine, perche }) una volta
  diversi → { avviata: false, stato: 'cambiata' }

preparaScelta(conf, fonte)
  conf  { kind, temi, voci, cosa, soloFigura, n, origine }
  la lista da una sola selezione, secondo «cosa»:
    tutte       E.daAllenare(items, prog, oggi, kind, { temi, voci, soloFigura })
    mai         E.coda(items, prog, oggi, { kind, temi, voci, soloFigura, stati: ['nuovo'], n })
    rifare      E.coda(items, prog, oggi, { kind, temi, voci, soloFigura, soloDaRifare: true, n })
    confermare  E.coda(items, prog, oggi, { kind, temi, voci, soloFigura, statiQuesito: ['incerto'], n })
    segnate     E.codaSegnalibri(banca, righe, { kind })      temi e voci ignorati, e la pagina lo dice
  → { stato, lista, disponibili, quanti, conteggi: { tutte, mai, rifare, confermare, segnate }, fuori, origine }
  ogni voce di `conteggi` è il `disponibili` della sua selezione, senza tetto

avviaScelta(preparazione, fonte, avvia)
  come avviaAllenati; avvia(lista, 'scegli', { origine })

selezioneSimulazione(conf, fonte)
  il ramo 'sim' di selezioneQuiz() di oggi, invariato, con la preselezione di P-109

preparaCarteggio(scelta, fonte)          firma di oggi; scelta.attivita:
  'prova'     E.provaCarteggio(), com'è
  'allenati'  E.giroTecnicheDaRivedere(esercizi, prog)               P-105
  'scegli'    E.sceltaCarteggio(esercizi, prog, { tecnica | argomento | carta, cosa, n })   da scrivere
  'tecniche'  com'è
avviaCarteggio, concludiCarteggio, rispostaTecnica, riepilogoCarteggio   invariati

ricercaNumero, permessoGesto, mappaProgressi, anteprimaProgressi, avviaProgressi   invariati
anteprimaAllenaProgressi, avviaAllenaProgressi   restano; l'anteprima apre Scegli tu
  già compilato, e un controllo pretende che la sua lista sia quella di preparaScelta
  con { temi/voci della riga, cosa: 'tutte', n: 20 }
```

**Che cosa resta da scrivere nel motore prima di B-5**, oltre a P-105:
`sceltaCarteggio(esercizi, progress, opt)`, con `opt = { tecnica, argomento,
carta, cosa: 'tutti' | 'mai' | 'rivedere', n }`; con `cosa: 'mai'` e nessun
filtro restituisce `tappeto(n)`, e un test lo pretende; «da rivedere» è
`classifica() === 'da_ripassare'` sullo specchio della carta, come in
`giroTecnicheDaRivedere()`. Additiva, con i suoi test provati al contrario.

**Due conti da verificare in B-4, non da supporre:**
- `preparaScelta` con «mai», «rifare», «confermare» deve dare gli stessi numeri
  di `contaStati()` sullo stesso filtro (mai_visto, debole, incerto): R-STATI-03
  lo prova per «rifare», gli altri due no. Se divergono, ha ragione il motore e
  si scrive perché.
- `preparaScelta` da «Rifai» deve dare esattamente `rifai` di `quadro()` per
  quella riga, su ogni tema e ogni voce della banca vera: è R-MAPPA-15 spostato.

### 7.3 Che cosa esce dalla pagina, e dalle eccezioni

- `MODI`, `selezioneQuiz()`, `preparaBreve()`, `preparaSegnalibri()`,
  `avviaSegnalibri()` escono. `selezioneSimulazione()` e i raccordi del §7.2
  entrano.
- In `docs/eccezioni-interfaccia.md`, fra le chiamate protette: `mirata`,
  `screening`, `lunghezzaScreening` ed `estraiNuoviPrima` non sono più chiamati
  dalla pagina — li chiama `allenati()` nel motore, o nessuno — e passano agli
  orfani dichiarati con il motivo, nello stesso commit di B-5 (R-PRES-01 e
  R-NAV-02 lo pretendono). `giroTecniche` e `tappeto` restano chiamati solo se
  `giroTecnicheDaRivedere()` e `sceltaCarteggio()` non li compongono nel motore:
  B-5 elenca i chiamanti prima. `allenati`, `giroTecnicheDaRivedere`,
  `sceltaCarteggio` passano da orfani a protette.

### 7.4 Le righe: i `mode`

Le righe nuove portano `mode: 'allenati'` (la porta Allenati), `mode: 'scegli'`
(Scegli tu, qualunque «cosa»), `mode: 'giro'` (Allenati sulla carta, com'è),
`mode: 'tappeto'` (Scegli tu sulla carta con «Mai fatti, tutto il foglio»),
`mode: 'scelta'` (le altre configurazioni di Scegli tu sulla carta). Le righe di
prima restano com'erano e si leggono: `sessioni()` e `attivitaCarteggio()`
spezzano per modalità, quindi una modalità nuova è un'attività nuova e mai un
legame ambiguo. In Statistiche, nell'elenco delle sessioni, i nomi delle
modalità nuove: «Allenati», «Scegli tu», «Giro delle tecniche», «Mai fatti, in
ordine», «Scegli tu sulla carta»; quelli di prima restano i loro.

### 7.5 I requisiti che cambiano e quelli che nascono

| Requisito | Che cosa cambia |
|---|---|
| R-NAV-01 | ogni sezione delle cinque ha un ingresso; ogni `data-v` è una sezione o un alias del §2.3; e la parte nuova del §7.7 |
| R-NAV-03 | la barra: Simulazione · Quiz · Carteggio · Statistiche, quattro link con l'`href` del §2.1; il marchio a `/` fuori dalla barra, con nome accessibile |
| R-NAV-04 | i quiz hanno due porte, *Allenati* e *Scegli tu*, ognuna con la sua selezione del §7.2, eseguita contro il motore con una spia; nessun `MODI` a cinque intenzioni; la simulazione sta in Simulazione |
| R-NAV-05 | «Che cosa» (cinque valori) e «Solo con figura» esistono solo in *Scegli tu*, e arrivano al motore come la tabella del §7.2; *Allenati* non ne riceve nessuno |
| R-NAV-06 | cinque `.view`, esattamente con gli id del §2.1 |
| R-NAV-07 | il banco dei quiz riscritto sulle due porte (proposta: `tests/quiz_porte.mjs`, con la sua pagina di riferimento) provato contro sé stesso |
| R-NAV-08 | i tragitti del §7.6 |
| R-NAV-09 | il regime da `navigazioneSito()` e `VISTE_RIDISEGNO` con la lista del §7.1; due liste in transizione, fino alla merge di B-5 |
| R-NAV-10 | `navigazioneSito()` sui casi del §2.3 e del §7.1 |
| R-NAV-11 | i raccordi: escono `preparaBreve`, `preparaSegnalibri`, `avviaSegnalibri`; entrano `preparaAllenati`, `avviaAllenati`, `preparaScelta`, `avviaScelta`; `ricercaNumero` e `permessoGesto` restano |
| R-NAV-12 | la porta `/app` con la destinazione e il titolo della decisione 1 |
| R-NAV-13, R-NAV-14 | le rotture del banco del ridisegno e dei tragitti, riscritte |
| R-SEL-17 | la preparazione della carta da `preparaCarteggio()` con le quattro attività del §7.2; la prova da Simulazione |
| R-ACC-03 | i tre posti invariati; i loro pulsanti aprono il modulo unico con il titolo «Conserva le risposte» |
| R-ACC-41 | il `409` da un invito offre «Accedi con questa password» senza riscriverla |
| R-ACC-75, R-ACC-76 | la frase delle condizioni nel modulo unico, prima di «Continua» e di «Crea l'account con questi dati» |
| R-UX-01 | il Carteggio è una voce della barra |
| R-UX-03 | «Sei tu a giudicare» prima di Inizia nella preparazione della prova (in Simulazione) e in quelle della carta (in Carteggio) |
| R-UX-04 | i Segnali in Quiz, fuori dalle porte e dalle Statistiche, con «extra banca» scritto |
| R-MAPPA-15, R-MAPPA-18 | «Rifai» e «Allena» aprono Scegli tu già compilato; numero e lista come oggi |
| R-RIF-19…22 (T-12) | le superfici: Home, Simulazione, Quiz, Carteggio e le otto preparazioni (Allenati, Scegli tu, simulazione, prova di carteggio, Allenati sulla carta, Scegli tu sulla carta, Che tecnica serve?, Segnali); l'avviso una volta accanto a Inizia in ognuna |
| R-ACC-02 | «prima di cominciare» si cerca nelle preparazioni di Allenati e dei Segnali |

| Nasce | Che cosa dice | Controllo proposto |
|---|---|---|
| R-PORTE-01 | *Allenati* dice la fase e, per ogni domanda, il perché, da una sola `allenati()`; senza account dice che vede solo la pagina aperta, senza un secondo avviso «senza account» | banco dei quiz, e N-01 per il testo |
| R-PORTE-02 | in *Scegli tu* il numero accanto a ogni «cosa» è quello della lista che apre, senza tetto; i tre stati coincidono con `contaStati()` | banco dei quiz |
| R-PORTE-03 | *Scegli tu* già compilato da Statistiche apre la stessa lista di «Rifai» e «Allena» di oggi, su ogni riga della banca vera | banco della mappa |
| R-PORTE-04 | *Allenati sulla carta* è `giroTecnicheDaRivedere()`; *Scegli tu* sulla carta è `sceltaCarteggio()`, e con «Mai fatti, tutto il foglio» è il tappeto | banco del Carteggio |
| R-PORTE-05 | le porte di prima hanno un posto: §7.7 | `test_interfaccia.py::test_porte_di_prima` |
| R-ACC-87 | un pulsante nell'intestazione, un modulo, «Continua» nell'ordine dell'origine; dopo un `401` si offre di creare l'account e non lo si crea da solo; nessun account senza un tocco su un pulsante che lo dice, con le condizioni visibili | banco del client, un gruppo nuovo |
| R-ACC-88 | il ritorno del modulo nomina l'origine vera: mai «Torna al riepilogo» senza un riepilogo | banco del client |

### 7.6 I 108 tragitti di N-01

Le persone Z, F e R condividono le porte: un compito ha lo stesso percorso per
le tre, e cambia per stato solo dove lo dice la tabella. Quindi i 108 ID
cambiano in dodici righe. «=» vuol dire «come oggi».

| Compito | Domani, dalla Home | Tocchi alla prima domanda (oggi → domani) | Ritorno domani |
|---|---|---|---|
| 01 Simulare il quiz base | Home → Simula il quiz base → preparazione → Inizia | 2 → 2 | Home; da Simulazione → Simulazione |
| 02 Quiz su un argomento | Home → Quiz → Meteorologia → (Scegli tu, Dove = Meteorologia) → Inizia | 3 → 3 (la via A di oggi, 4, esce: «Scegli un argomento» non è più un passaggio) | Quiz, con tema, scorrimento e fuoco |
| 03 Giro delle tecniche | Home → Carteggio → Allenati sulla carta → Inizia | 4 → **3** | Carteggio, porta Allenati sulla carta |
| 04 A tappeto | Home → Carteggio → Scegli tu → «Mai fatti» → Inizia | 5 → **4** | Carteggio, porta Scegli tu |
| 05 Prova di carteggio | Home → Simulazione → Prova di carteggio → Inizia | 3 → 3 | Simulazione, porta della prova |
| 06 Segnali | Home → Quiz → Gioca ai Segnali → Inizia | 3 → 3 | Quiz, riquadro Segnali |
| 07 Registrarsi dal risultato | H0, H1: … → Risultato → «Crea un account e salva» → modulo unico (Conserva le risposte) → AC; HA: = | H0, H1: 44 al modulo, =; successo = | = |
| 08 Registrarsi dalla Home | H0: Accedi → modulo unico → «Continua» → `401` → «Crea l'account con questi dati»; H1: «Conserva le risposte» → modulo unico → «Continua»; HA: = | H0: 2 → **1** al modulo, totale 7 → 7; H1: =; HA: = | = |
| 09 Privacy | = | = | = |
| 10 Condizioni | = | = | = |
| 11 Tornare indietro | Home → Allenati con 10 domande → (Allenati, Quante = 10) → Inizia → una risposta → Termina → risultato parziale → ritorno | 2 → 2 | la porta effettiva: Home, Quiz, Carteggio, Simulazione |
| 12 Trovare i progressi | Home → Statistiche → … → Home | 1 → 1 | Home |

**Che cosa cambia per tutti:** i nomi d'arrivo (Simulazione, Quiz, Carteggio,
Statistiche al posto di Allenati, Esame, Progressi), gli agganci che il banco
clicca (`data-porta`, i link della barra), e le porte di ritorno. **Che cosa
cambia nei conti:** 03 e 04 un tocco in meno, perché il Carteggio è nella barra
e le preparazioni della carta non passano più da «Esercizi su carta»; 08 in H0
un tocco in meno al modulo e uno in più dopo, perché l'accesso viene prima.
**Le porte secondarie** del §9 del ridisegno: Progressi → tema → Rifai diventa
Statistiche → tema → Rifai → (Scegli tu) → Inizia, gli stessi tocchi; i
segnalibri Home → Quiz → «Segnate · N» → Inizia, tre invece di quattro; la
ricerca Home → Quiz → Cerca → risultato → Inizia, quattro invece di cinque.

**H0, il compito 11.** Oggi «Allenati con 10 domande» apre `preparaBreve()`, una
`estraiNuoviPrima()` a dieci; domani apre `allenati({ n: 10 })`, che in H0
esplora con `screening()` su più voci. Le dieci domande non sono le stesse, e il
banco non deve pretendere quelle di prima: pretende che siano quelle di
`allenati()`.

### 7.7 R-NAV-01 si estende prima che le otto porte escano

Il 9 settembre «Che tecnica serve?» ha perso l'ingresso senza che niente se ne
accorgesse. Qui le porte che escono sono otto e le sezioni tre: il rischio è lo
stesso, moltiplicato.

**Il controllo, `test_porte_di_prima` (R-PORTE-05)**, nel banco del client, in
Chrome, sulla pagina del regime «porte». Per ognuna delle otto porte del §4.5,
per «Simula la prova», per i tre segmenti, per le quattro prove di Esame, per
Progressi e i suoi «Rifai» e «Allena», una tabella **del test** — non della
pagina, che la riscriverebbe insieme alle porte — dice dove deve arrivare e con
che cosa:

| Porta di prima | Arrivo atteso, guardato |
|---|---|
| Allenamento consigliato | preparazione Allenati, Quante = 25, una fase scritta |
| Allenati con 10 domande | preparazione Allenati, Quante = 10 |
| Un giro tra gli argomenti | preparazione Allenati, fase «esplora» a pagina vuota |
| Ripassa gli errori | preparazione Scegli tu, «Da rifare» |
| Scegli un argomento (Meteorologia) | preparazione Scegli tu, Dove = Meteorologia |
| Solo mai fatte | preparazione Scegli tu, «Mai viste» |
| Solo con figura | preparazione Scegli tu, il filtro acceso, il conteggio dei quesiti con figura |
| I miei segnalibri | preparazione Scegli tu, «Segnate» |
| Rifai, Allena | preparazione Scegli tu, già compilata con la riga |
| Cerca per numero | la casella in Quiz, e il risultato con «Inizia» |
| Giro delle tecniche, A tappeto, Che tecnica serve? | le preparazioni del §5 |
| Prova di carteggio, quiz base, vela, base e vela | le preparazioni di Simulazione |
| Segnali, le quattro modalità | la preparazione dei Segnali, da Quiz |
| Allenati, Esame, Progressi (indirizzi) | Quiz, Simulazione, Statistiche, con l'indirizzo canonico |

Ogni riga è un tragitto: dalla Home, con i tocchi veri, fino alla preparazione,
dove il banco legge il titolo e la configurazione nel testo che si vede. Provato
al contrario sulla pagina di riferimento: una rottura toglie la scorciatoia
«Segnate», una porta a Scegli tu con «Tutte» invece di «Da rifare», una toglie
«Che tecnica serve?» dal Carteggio — rosse ognuna per il suo motivo.

**Perché prima.** Il controllo nasce con B-4 e gira sulla pagina di
riferimento; sulla pagina vera, ancora nel regime «ridisegno», le stesse righe
lette con le porte di oggi sono verdi, e B-4 lo misura: la tabella è giusta
anche per la pagina che c'è. Solo dopo, B-5 toglie le otto porte, e il
controllo pretende i posti nuovi.

### 7.8 B-4 in due sessioni: dove passa il taglio

Sì, due. Il taglio passa fra **il menu** e **le porte**, perché i banchi che
toccano sono diversi e la pagina di riferimento si può costruire in due tempi.

- **B-4a, il menu e l'account.** `tests/regime_pagina.py` con le due liste;
  `tests/ridisegno.mjs` (navigazione, alias, barra, porta `/app`) e la sua
  pagina di riferimento; nel banco del client la pagina di riferimento con le
  cinque viste e il modulo unico, N-01 per i compiti 01, 05, 07, 08, 09, 10,
  12, il gruppo nuovo di R-ACC-87/88, C-04, C-05, C-08 e C-20 che oggi cliccano
  «Crea un account»; T-12 sulle superfici nuove; la specifica §5, §6 e le righe
  R-NAV-01, 03, 06, 09, 10, 12, R-ACC-03, 41, 75, 76, R-UX-01. Le porte, nella
  pagina di riferimento, restano quelle di oggi, spostate sotto le sezioni
  nuove.
- **B-4b, le porte.** Il motore che manca (`sceltaCarteggio()`, se non lo fa una
  sessione a parte: decisione 12); `tests/quiz_porte.mjs` al posto di
  `tests/quiz_intenzioni.mjs`; `tests/ciclo_carteggio.mjs`;
  `tests/mappa_progressi.mjs` per R-PORTE-03; N-01 per i compiti 02, 03, 04,
  06, 11; `test_porte_di_prima`; le righe R-NAV-04, 05, 07, 11, R-SEL-17,
  R-UX-03, R-MAPPA-15, 18 e le R-PORTE.

**B-5 in due sessioni anche lui** (decisione 13): B-5a il menu e l'account,
B-5b le porte, con il rilascio v0.37.0 solo dopo B-5b. Fra le due la pagina è
nel regime «porte» con le porte di oggi, e i controlli di B-4b sono rossi e
dichiarati in `docs/eccezioni-interfaccia.md`, «Lo chiude B-5b».

---

## 8. Che cosa questo progetto non vede

- Le persone: nessun nome nuovo è stato provato con chi studia, come per la
  barra di ottobre (decisione 33 di P-59). «Allenati» come porta e «Scegli tu»
  sono le parole degli appunti dell'autore e di I-32.
- Il motore di P-105 non è fuso: le firme sono quelle del suo prompt e del suo
  lavoro in corso.
- P-109 non è fuso: la preselezione è descritta come passa, non com'è.
- Progressi con l'account, «Rifai» e «Allena» non sono stati guardati: servono un
  account e righe. Sono descritti dal progetto del ridisegno e dalla specifica.
- La geometria delle sezioni nuove: misurate solo le parole della barra; il primo
  schermo di Quiz e di Carteggio lo misura B-4 con T-12.
- Safari e il gesto vero, come per tutto il resto.

---

## 9. Trovato guardando, fuori da questo progetto

- Il modulo «Crea un account» aperto dalla Home si chiude con «Torna al
  riepilogo», e non ha un ritorno all'accesso (§3.1). Il modulo unico lo
  risolve; se la decisione 5 sceglie l'alternativa, va corretto lo stesso.
- A 375 px le porte di Esame vanno una parola per riga: la correzione è Q-1,
  non ancora fusa.

---

## 10. Le decisioni rimaste per l'autore

Una per riga, con la proposta. Nessuna ferma B-4a; le 12 e 3 fermano B-4b, la 1
ferma B-4a solo sulla porta `/app`.

| # | Domanda | Proposta |
|---|---|---|
| 1 | La porta `/app`: dove va e come si chiama | a `/?sezione=quiz`, «Apri i quiz», titolo «Apri i quiz · Rotta Giusta» |
| 2 | *Allenati* anche sulla vela | sì, una scelta «Banca: base · vela» nella preparazione, base di partenza: `allenati()` accetta `kind` |
| 3 | In Quiz le scorciatoie «Da rifare · N» e «Segnate · N» accanto ai temi | sì, solo quando N è maggiore di zero |
| 4 | La simulazione intera degli appunti (carteggio e quiz di seguito) | non in questo giro: le quattro porte restano separate; è un'attività nuova, con due esiti |
| 5 | Il modulo unico (§3.2) o i due moduli con il passaggio nei due versi | il modulo unico, con l'ordine che dipende dall'origine |
| 6 | La parola dell'intestazione | resta «Accedi»; il titolo del modulo «Accedi o crea un account» |
| 7 | L'aiuto in un posto fisso (WCAG 3.2.6, appunto 6) | rimandato: oggi un aiuto generale non c'è; quando ci sarà, una voce del Profilo, uguale in ogni schermata |
| 8 | Nel Carteggio, la prova a tempo | un link alla Simulazione, non una seconda porta |
| 9 | Nel pannello 3 della Home, «La prova a tempo la trovi in Simulazione.» | sì |
| 10 | In *Allenati*, la frase «Ti mancano N risposte per vedere almeno due domande di ogni gruppo della banca» | sì: è un conto del motore (`mancano`), detto come fatto |
| 11 | «Ripassa gli errori» di oggi apre anche gli errori già ripresi; «Da rifare» no | va bene: «da rifare» è la lista della mappa; `soloSbagliate` resta nel motore |
| 12 | Chi scrive `sceltaCarteggio()` nel motore | una sessione piccola dopo P-105 e prima di B-4b, come P-105: additiva, con i test |
| 13 | B-5 in due sessioni, con un solo rilascio dopo la seconda | sì |
| 14 | Le prove fatte in Simulazione e in Statistiche, come oggi in Esame e in Progressi | tutte e due |
| 15 | Il titolo della sezione | nella barra «Simulazione», in testa alla sezione «Simulazione d'esame» |
