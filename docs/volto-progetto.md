# Il volto del sito nella pagina — progetto

**Data:** 25 ottobre 2026. **Che cos'è:** il piano per portare nel sito il volto
che l'autore ha scelto il 25 ottobre, dopo i mock di I-29
([idee-dopo-gli-account.md](idee-dopo-gli-account.md)): **la Home al computer
«U — Terra beige»** e, per tutto il resto, **lo stile della Regata (G)**. È il
contratto da cui la regia scrive i prompt: prima i controlli su `main` (Claude),
poi la pagina su `ui/main` (ChatGPT), con il metodo di
[regole-disegno-progetto.md](regole-disegno-progetto.md).

**Stato al 25 ottobre 2026:** le decisioni 1–14 del §12 sono prese
dall'autore, tutte come raccomandato; restano le 15–18, che servono prima del
giro B. I controlli del giro A sono scritti (P-97, su un ramo per `main`; la
nota di consegna nel §11.1); la pagina no: il prossimo passo è A-pagina, P-98. **File
neutro**, come gli altri `*-progetto.md`: lo legge chi scrive i controlli su
`main` e chi rifà la pagina su `ui/*`.

**Le fonti.** I mock sono in `docs/prototipi/redesign-2026-10-claude/`:
`u-terra-beige/` (la Home al computer; le altre cinque schermate sono quelle
della Regata), `g-regata/`, e accanto `t-terra-in-fondo/`,
`p-rotta-che-si-accende/` e `q-regata-sulla-carta/`, da cui la U è nata. Le
sorgenti sono in `sorgenti/stili/` (`u/`, `g/`, `base/`, `build.py`) e
`sorgenti/comune.css`. **I mock sono materiale da citare, non da copiare:** la
pagina ha le sue regole, i suoi controlli e i suoi stati, che i mock non hanno.

---

## 1. Scopo e perimetro

**In parole semplici.** Il sito è ordinato ma non ha una faccia (I-29, «la
diagnosi»). Con questo lavoro chi apre Rotta Giusta sul computer trova una
carta nautica ferma dietro la pagina — il mare, un tratto di costa beige, un
faro con i suoi settori e una boa — e, scorrendo, undici pannelli che spiegano
che cosa si può fare qui, con un piccolo percorso di triangoli sulla terra che
dice dove si è arrivati. Sul telefono e in tutte le altre schermate il sito
prende i colori e i segni della Regata: il bianco, il blu del mare, l'arancio
delle boe solo come segno. **Che cosa non cambia:** che cosa si può fare, dove
si trova, che cosa si salva, i numeri e le regole dell'esame.

**Che cosa vuole ottenere**, oltre al volto: che il volto nuovo **non rompa in
silenzio** nessuna delle garanzie che i giri 1 e 2 hanno messo nei controlli, e
che le cose nuove — la carta dietro il testo, il percorso, le luci che
lampeggiano — abbiano un controllo loro prima di arrivare nella pagina.

**Che cosa non fa.**
- Non cambia la struttura di Q-NAV né il documento solo (§6 della specifica).
- Non decide la struttura delle schermate che i mock disegnano diversamente da
  oggi (Allenati, il riepilogo): le elenca nel §9.15 come decisioni a parte.
- Non porta «la rotta come filo», cioè le transizioni fra schermate di
  `a-carta-viva/` (I-29, decisione 12: dopo).
- Non tocca il tema scuro (Q-TEMA) né i Segnali, che restano notturni (§7.7).
- Non riscrive le parole: il giro 3 (I-27) è sospeso, e riparte dentro questa
  direzione (decisione 17).

---

## 2. Che cosa cambia per chi studia, pagina per pagina

| Dove | Oggi | Dopo | Mock |
|---|---|---|---|
| **Home al computer** (sopra la soglia della decisione 9) | Una colonna su fondo grigio verdino, con `paesaggio.svg` a destra; «Simula il quiz base», «Allenati con 10 domande», le tre schede, «Che cosa non torna» | La carta ferma dietro, il testo bianco su un velo di mare a sinistra, la terra beige a destra; il primo pannello con la prova d'esame (20 · 30′ · 4) e «Simula il quiz base»; poi «Come funziona» in dieci pannelli, uno per modo di prepararsi; il percorso sulla terra; in fondo «Che cosa trovi qui» e «I limiti, detti prima». Il faro e la boa si toccano e dicono la loro sigla | `u-terra-beige/home.html` |
| **Home al telefono** e fra 900 px e la soglia | Una colonna, senza immagini sotto i 900 px | La Home della Regata: il mare in testa in una striscia, i tre numeri grandi della prova, le righe al posto delle schede, la carta da toccare in una sezione sua | `g-regata/home.html` |
| **Allenati · Quiz** | 14 pulsanti su 15 dello stesso azzurro pallido | Le azioni secondarie come righe con la freccia; il peso d'esame di ogni argomento scritto («4 su 20»); un solo pulsante pieno | `g-regata/quiz.html` |
| **Preparazioni** | Titolo, conteggio, opzioni, «Inizia» con l'avviso accanto | Gli stessi contenuti, con i numeri della preparazione grandi e l'avviso a 12 px da «Inizia» | `g-regata/preparazione.html` |
| **La domanda** | Tre pastiglie in cima e una striscia «Quiz / Quiz base» | Le tappe come boe triangolari, la corrente con l'anello finché non si preme «Avanti»; l'esito sopra «Avanti»; con 25 domande o più una traccia compatta e «5 di 25» | `g-regata/runner.html`, `runner-figura.html` |
| **Riepilogo** | Due caselle che sembrano campi di un modulo | I tre numeri con le loro parole; un solo pulsante pieno | `g-regata/riepilogo.html` |
| **Allenati · Carteggio, Allenati · Segnali, Esame, Progressi, Profilo, Accedi** | — | **Nessun mock.** Restano da disegnare nel giro B con i componenti della Regata (§8) | — |

**Le parole cambiano poco, ed è voluto.** Dove i mock hanno testi nuovi — le
dieci tappe di «Come funziona», il titolo del riepilogo — sono testi da far
verificare all'autore (§10) o decisioni del giro 3, non cose che il volto porta
con sé.

---

## 3. Lo stato, al 25 ottobre 2026

### 3.1 La pagina

Letta in `site/index.html` (v0.34.0, con il giro 2 fuso), non dedotta.

- **Un solo `:root`** con la scala del giro 2: corpi `--t-12…--t-30` e
  `--t-40`, spazi `--s-4…--s-48`, pesi `--w-400/600/700`, `--lh-testo:1.45`,
  `--lh-titoli:1.2`, `--testo-max:480px`. I colori hanno nomi della tavolozza
  di prima: `--navy #0B1F33`, `--blue #123E63`, `--sky #076F99`, `--paper
  #F3F6F6`, con i ruoli `--acc`, `--ok`, `--ko`, `--warn`.
- **La Home** (`#v-home`) ha più stati di quanti ne mostri la U: gli avvisi
  (`#rotta-alerts`, `#conto-verifica`), la proposta con l'account
  (`#home-consiglio`), le attività della pagina (`#rotta-last`), l'invito di H1
  (`#invito-home`, uno dei tre posti di R-ACC-03), le porte e «Che cosa non
  torna», con i numeri **contati dalla banca** (`index.html:2621`).
- **I numeri della banca**, contati il 25 ottobre: 1.722 quesiti, 37 oscurati,
  4 con la nota dopo la risposta, 1 con la figura mancante, 135 esercizi di
  carteggio; `E.SEGNALI` ha **53** schede, 27 fanali notturni, 9 segnali
  diurni, 9 suoni da nebbia, 8 di manovra.
- **Il frammento dell'indirizzo è già usato:** la pagina legge
  `#verifica=`, `#password=`, `#email=` (`index.html:1402`) e passa
  `location.hash` a `navigazioneSito()` al caricamento (`:5781`).

### 3.2 I controlli, e dove guardano

- **T-12** (giro 1) misura **solo a 375×812 e 375×667**. La U, che vale sopra
  i 900 px, oggi non la vede nessuna sua parte.
- **T-13** (giro 2) misura a 375×812 **e a 1280×800**, quindi vede la Home al
  computer: corpi, titoli, testo, spazi, pesi, distanze, righe, colori.
- **Il contrasto** (T-08/T-09, R-RIF-11) si misura a 375 px, con `K.fondo()`,
  che compone i fondi **degli antenati** dell'elemento. La carta della U non è
  un antenato del testo: è uno strato fisso accanto. `K.fondo()` arriva al
  `body`, cioè al mare uniforme, e direbbe 8,91:1 per ogni testo bianco
  qualunque cosa ci sia dietro.
- **Il viewport predefinito del banco** è 756×469 (misurato in Chrome
  headless, il 25 ottobre): i gruppi che non fissano le dimensioni — N-01 e
  quasi tutti i C-* — girano sotto i 900 px e non vedranno mai la U.
- **`SCALA_CSS`** (`tests/test_interfaccia.py`) è il contratto indipendente:
  corpi `[12, 14, 16, 19, 24, 30]` più 40 per l'`h1` della Home sopra 900 px,
  spazi fino a 48, pesi `[400, 600, 700]`, colori `--acc #076f99`, `--ko
  #a4261d`, `--warn #765000`, `--ok #126832`.

### 3.3 I mock, misurati

**Come.** La Home `u-terra-beige/home.html` aperta da file in Chrome headless
con `tests/browser.mjs`, il 25 ottobre, a otto dimensioni: 900×700, 1024×768,
1200×800, 1280×800, 1280×1024, 1366×768, 1440×900, 1920×1080. Lo scorrimento
a scatti spento durante la misura, perché faceva scattare la pagina fra la
lettura dei rettangoli e la schermata. **Il contrasto si è misurato sui
pixel:** per ogni pannello, i rettangoli dei testi che stanno sopra la carta
(non dentro una scheda opaca); poi il testo e le icone resi trasparenti, una
schermata, e per ogni testo il pixel peggiore dietro di lui, contro il suo
colore. **La costa** si è letta nella schermata con tutto nascosto tranne la
carta: dove compare il beige `#F2E6CF` nelle righe dei triangoli. Lo script e i
numeri sono fuori dal repo, nella cartella delle note di questo gruppo di
sessioni (`misura-u.mjs`, `misure-*.json`); il metodo è quello che il §6.3
chiede al banco.

| Dimensione | Triangoli sulla terra | Costa alla riga dei triangoli | Colonna del testo | Testi sopra la carta sotto AA | Il peggiore |
|---|---|---|---|---|---|
| 900×700 | 0 su 11 | fuori schermo | 106–626 px, 70 % | 10 su 29 | 1,28:1, «Scendi lungo la rotta…» sopra una cifra di scandaglio |
| 1024×768 | 0 su 11 | fuori schermo | 61 % | 4 su 29 | 1,30:1, la stessa frase; l'`h1` a 1,50:1 sopra il «37» |
| 1200×800 | 10 su 11 | 1.083–1.131 px | 52 % | 2 su 29 | 2,35:1, l'`h1` sopra il basso fondale |
| 1280×800 | 11 su 11 | 1.102–1.150 | 49 % | 0 | 6,43:1 |
| 1280×1024 | **0 su 11** | fuori schermo; **il faro a x 1.341, fuori** | 49 % | 0 | — |
| 1366×768 | 11 su 11 | 1.177–1.224 | 46 % | 0 | — |
| 1440×900 | 11 su 11 | 1.241–1.288 | 43 % | 0 | **4,54:1**, la nota da 14 px sopra il basso fondale |
| 1920×1080 | 11 su 11 | 1.659–1.702 | 33 % | 0 | 7,43:1 |

**Altre misure, uguali a ogni dimensione:**
- **Il primo schermo** ha 9 corpi: 9, 10, 12, 13 (i testi dentro la carta,
  misurati in unità del disegno), 14, 16, 20, 44, 56; senza la carta, 6. Pesi
  400, 600, 700, 800.
- **Bersagli nel primo schermo**, testata esclusa: 15 — faro, boa, gli 11
  triangoli, «Simula il quiz base», «Oppure allenati con 10 domande».
- **I triangoli del percorso** sono link di 13×14 px, uno ogni 26 px.
- **L'ordine del fuoco** da pagina appena aperta: 1 faro, 2 boa, 3–8 la
  testata, 9–19 i triangoli, **20 «Simula il quiz base»**.
- **La scheda della sigla** (340×74 px, fissa in basso a destra) a 900×700 sta
  a x 513–853: **sopra la colonna del testo**, che finisce a 626.

**Contrasti dei colori**, calcolati sui valori dei temi:
- il bordo del triangolo vuoto sul beige 2,67:1, l'arancio pieno sul beige
  2,32:1 (sotto il 3:1 di WCAG 1.4.11);
- l'arancio delle boe `#FF6A1A` sul bianco 2,87:1, sul mare 3,11:1;
- la «R» rossa del settore sul mare 2,91:1, la «V» verde 3,75:1;
- il mare `#0A4F6E` sul bianco 8,91:1 e sul beige 7,21:1; `#4D6772` sul beige
  4,86:1, `#B23F00` sul beige 4,72:1.

**Lette nel CSS e non misurate:** il comportamento con
`prefers-reduced-motion` (`tests/browser.mjs` non emula le preferenze); il
gesto vero; Safari e un iPad vero; le prestazioni dello strato fisso.

**Le cause, lette nelle sorgenti.** La carta si scala per coprire lo schermo
(`s = max(W/600, H/380)`) e si sposta di lato del 22,5 % della larghezza: su
uno schermo più stretto di 1,58:1 comanda l'altezza, la carta si ingrandisce e
la terra — che nel disegno comincia a x 362 su 600 — esce a destra. Il velo è
in percentuali (opaco fino al 40 %, nullo al 58 %) mentre la colonna del testo
è in pixel (106–626): sotto i 1.200 px la colonna esce dal velo e il testo
passa sopra le cifre di scandaglio, che sono bianche.

---

## 4. Il metodo

È quello di [regole-disegno-progetto.md](regole-disegno-progetto.md) §3, e non
cambia:

1. **Su `main`, Claude scrive il contratto e i controlli** — il contratto qui
   (§6), i controlli nel banco del client e in `tests/test_interfaccia.py`, i
   requisiti nel §9.11 della specifica.
2. **I controlli sono verdi sulla pagina di riferimento del client**
   (`tests/pagina-client-ridisegno.html`, che prende la Home U sopra la soglia),
   hanno rotture che li fanno fallire per il loro motivo (§6.6), e si provano
   contro sé stessi.
3. **Sulla pagina vera sono rossi per il motivo giusto**, e quello che la
   pagina non rispetta sta fra i «Difetti aperti dichiarati» di
   [eccezioni-interfaccia.md](eccezioni-interfaccia.md), una riga per verifica.
4. **ChatGPT rifà la pagina su `ui/*`** e toglie le righe nello stesso commit.
5. **Claude fa la merge e allinea la specifica**: §5, §7, §9.11.

**Tre cose in più per questo progetto.**

- **Il banco misura anche al computer, e a dimensioni scomode.** La U si rompe
  a 1024×768 e a 1280×1024, non a 1280×800 (§3.3). Le dimensioni del contratto
  sono quelle dove si rompe.
- **Il banco legge i pixel, per una cosa sola.** Il contrasto del testo sopra
  la carta non si può comporre dagli antenati (§3.2). `tests/browser.mjs` dice
  oggi delle schermate «per guardare, non per confrontare pixel»: qui non si
  confrontano immagini, si misura la luminanza dietro un testo, con le
  animazioni ferme. È un'eccezione dichiarata, decisione 14.
- **Il vestito prima della struttura.** Dove un mock cambia che cosa c'è in una
  schermata, non solo come appare, è una decisione a parte (§9.15). Il volto
  non toglie porte, intenzioni, frasi controllate o stati.

---

## 5. I componenti

### 5.1 I token della Regata, e il `:root` di oggi

Dalla sorgente `sorgenti/stili/g/tema.css`, confrontata con il `:root` di
`site/index.html`.

| Ruolo | Oggi (`:root`) | Regata | Contrasto | Nota |
|---|---|---|---|---|
| Fondo della pagina | `--paper #F3F6F6` | `--carta #FFFFFF` | — | il bianco «come una vela»; I-29 trovava tre bianchi quasi uguali (1,04–1,13) |
| Superficie seconda | `--surface #FFFFFF`, `--sky-soft #E6F3F7` | `--carta-2 #EEF4F6` | — | per le note e la scheda della sigla |
| Testo | `--navy #0B1F33` | `--ink #0B2530` | 15,89:1 sul bianco | |
| Testo secondario | `--text-soft #526B7B`, `--text-faint #576F7E` | `--ink-2 #33505B`, `--ink-3 #4D6772` | 8,61 e 6,00:1 sul bianco | |
| Azione piena, link, fuoco | `--acc #076F99` (link), `--blue #123E63` (pulsante pieno) | `--azione`, `--link`, `--fuoco` = `--mare #0A4F6E` | 8,91:1 | un blu solo per le azioni |
| Giusto | `--ok #126832` | `--ok #12663A` | 7,03:1 | |
| Errore | `--ko #A4261D` | `--ko #B3261E` | 6,54:1 | |
| Avviso | `--warn #765000` | **non c'è** | 7,20:1 | da tenere (decisione 8) |
| Segno del sito | — | `--boa #FF6A1A` | 2,87:1 sul bianco | solo disegni e segni, **mai testo, comando o esito** |
| Segno scuro | — | `--rotta #B23F00`, `--rotta-chiara #FFE8DA` | 5,83:1 sul bianco | per un segno che si deve vedere (il triangolo pieno del percorso, §5.3) |
| Acqua | — | `--acqua #E3EEF2`, `--acqua-2 #C3DAE3`, `--acqua-3 #6E9AAB` | `--acqua-2` 1,45:1 | fondi dei disegni; `--acqua-2` non è un bordo di controllo |
| Terra | `--sand #F7F4EC` | `--terra #FFF0E5` (G), `#F2E6CF` (la terra della U) | — | due beige: decisione 8 |
| Mare scuro | `--night #07192A` | `--mare #0A4F6E`, il fondo della Home al computer | 8,91:1 col bianco | |
| Raggio | `--r 14px` | `--r 14px` | | |

**Quattro cose da decidere o da sistemare, e i loro controlli:**

- **I valori di `SCALA_CSS['colori']` cambiano** (R-RIF-30, `test_scala_css`
  «token»): `--acc` diventa `#0A4F6E`, `--ko #B3261E`, `--ok #12663A`; `--warn`
  resta `#765000`. Il contratto è indipendente dalla pagina: cambia prima nel
  test, poi nella pagina.
- **Nella Regata i numeri dell'esame sono del colore delle azioni**
  (`.scandaglio b{color:var(--mare)}`): T-13:colori lo direbbe «accento su
  testo non interattivo». Proposta: i numeri in `--ink`, il mare resta delle
  azioni (decisione 8).
- **Il link della Regata ha la sottolineatura arancio**
  (`.link-freccia{border-bottom-color:var(--boa)}`, anche nei pannelli della
  U): il segno del sito su un comando, contro la regola che la Regata si dà da
  sola e contro la correzione di ChatGPT entrata nei mock il 25 ottobre.
  Proposta: la sottolineatura del colore del link.
- **Ruoli nuovi** in D-25 (I-29, decisione 2): «segno» (`--boa`, `--rotta`),
  «terra», e «carta» — i colori dei settori `#3DBE78`, `#FF5A55` e il giallo
  della cardinale `#F2C200`, che sono contenuto come i fanali dei Segnali
  (§7.7) e non cambiano con il tema.

### 5.2 La carta

**Che cos'è.** Un disegno SVG fermo dietro la Home al computer: il mare con il
reticolo e le cifre di scandaglio, il basso fondale, la terra beige, il faro con
i tre settori (verde, bianco, rosso) e la sigla «Lam.(2) BRV 10s», la boa
cardinale est con «Sc.(3) 10s», e la rotta arancio che passa a est della boa ed
entra nel settore bianco. Sorgente: `sorgenti/stili/u/illustrazione.svg` (5,7
KB).

**Il contratto.**

- **Dentro la pagina, non in un file a parte.** In `site/index.html`, dentro
  `#v-home`, perché le classi delle animazioni e gli id devono essere quelli
  del foglio della pagina; nessuna risorsa da un altro host (R-ARCH, il
  controllo che c'è).
- **C'è solo dove serve.** Lo strato fisso esiste solo con la Home aperta e
  sopra la soglia; passando ad Allenati sparisce (non resta dietro un'altra
  sezione), e il fondo scuro della pagina con lui. Una classe sul documento, per
  esempio `html[data-volto="carta"]`, scritta dal codice della navigazione: lo
  scorrimento a scatti e il fondo del `body` dipendono da lei, mai da un selettore
  globale.
- **La posizione si calcola dalla costa, non in percentuale.** La terra è
  ancorata al bordo destro: la sua costa sta a una distanza fissa dal bordo,
  larga almeno quanto il percorso più un margine (proposta: `max(10 % della
  larghezza, 132 px)`), a qualunque proporzione dello schermo. Il faro sta sulla
  costa, la boa e la rotta si dispongono rispetto al faro, e il disegno si
  scala con l'**altezza** solo finché il faro resta dentro lo schermo. A
  1280×1024 oggi il faro sta a x 1.341, fuori (§3.3).
- **Il velo segue la colonna del testo**, in pixel: opaco 0,92 fino al bordo
  destro della colonna più 32 px, poi una sfumatura di 160 px. E una **zona
  libera**: nessun elemento chiaro del disegno (cifre, etichette, settori,
  rotta) dentro il rettangolo della colonna più 32 px. Le cifre di scandaglio
  sono decorazione, e dove capitano sotto il testo si spostano o si tolgono.
- **La scheda della sigla non copre mai la colonna** né l'azione principale:
  se non c'è posto accanto, sta sulla terra o si apre sopra la luce toccata.
- **Il disegno non è un posto dove arriva il fuoco.** Il contenitore usa
  `overflow:clip`, che non crea un contenitore scorrevole; il disegno è
  `aria-hidden` oppure ha un'etichetta sola, perché il suo significato lo
  portano i due pulsanti e la scheda.
- **I testi dentro la carta sono disegno.** Escono dal conteggio dei corpi di
  T-13 (sono in unità del disegno: 9, 10, 12, 13), ma resi sullo schermo
  stanno sopra i 16 px — oggi fra 21 e 28 px a 1280 — e quello che dicono è
  anche nella scheda, in testo vero.
- **Le luci.** Due pulsanti di 48×48 px sopra il faro e la boa, con
  `aria-expanded` e un nome («Il faro: leggi la sua sigla»); la scheda è
  `aria-live="polite"`. I lampi seguono la sigla — due lampi ogni 10 s, tre
  scintille ogni 10 s —, e qui c'è un conflitto con WCAG 2.2.2 (§7, 6).

### 5.3 Il percorso

**Che cos'è.** Undici tappe in colonna, ferme sulla terra a destra: un filo
sottile, un triangolo per pannello, vuoto finché non ci arrivi e pieno dopo;
quello del pannello in vista è più grande e acceso. Toccandolo si va al
pannello; il nome compare accanto.

**È una navigazione**, e si comporta come tale:

- **`<nav aria-label="Le tappe della Home">`** con undici link, ognuno con il
  nome della tappa come nome accessibile, e `aria-current="location"` su quello
  del pannello in vista (il mock usa `step`, che dice un passo di una procedura:
  qui non c'è una procedura da seguire, §6.1 «senza sblocchi»).
- **L'indirizzo non cambia.** Un tocco porta al pannello e il fuoco va al suo
  titolo (`tabindex="-1"`); nessun `#t-3` nell'indirizzo e nessuna voce in
  cronologia. Il frammento è già usato dalla pagina per i gettoni dei link
  (§3.1), e una voce in cronologia per ogni pannello cambierebbe che cosa fa
  «Indietro» in tutti i tragitti di N-01.
- **L'ordine del fuoco:** la testata, poi l'azione principale del primo
  pannello e il suo link, poi il percorso, poi le luci, poi il resto. Oggi
  «Simula il quiz base» arriva al ventesimo Tab (§3.3).
- **Bersagli.** Il triangolo resta di 13 px, fine come l'ha chiesto l'autore;
  il bersaglio intorno è di 44×44 px, uno ogni 52 px (8 px fra l'uno e l'altro,
  D-28). Undici tappe fanno 564 px: sopra la soglia di altezza della decisione
  9 ci stanno. Oggi sono 13×14 px a passo 26: WCAG 2.5.8 li ammette per
  l'eccezione della spaziatura (cerchi di 24 px che non si toccano), l'obiettivo
  di 44 px del progetto (R-RIF-12) no.
- **Si vedono a 3:1 sul beige.** Il contorno del triangolo vuoto in `--ink-3`
  (4,86:1), il pieno in `--rotta` (4,72:1) invece che in `--boa` (2,32:1); il
  bagliore arancio resta come decorazione. Lo stato non è affidato al solo
  colore: vuoto e pieno sono forme diverse, e la tappa in vista è più grande.
- **Il nome** compare al passaggio del mouse e al fuoco. Su uno schermo a
  tocco sopra la soglia non c'è passaggio: il tocco porta al pannello, e il
  pannello ha il suo titolo. È un limite dichiarato.
- **Con lo scorrimento a scatti**, «leggero» (`proximity`), solo con la Home al
  computer aperta (§5.2). Tornando alla Home con «Indietro», la pagina torna
  dov'era senza scattare a un altro pannello.

### 5.4 Gli stati della Home al computer

La U disegna solo la Home **senza risposte e senza account** (H0). La pagina ne
ha altri, e nessuno sparisce:

| Stato | Che cosa c'è oggi | Dove va nella U (proposta, decisione 11) |
|---|---|---|
| H0 | la prova, il breve, le porte, i limiti | come nel mock |
| H1, risposte senza account | «Le attività di questa pagina» e l'invito «Conserva le risposte» (R-ACC-03) | nel primo pannello, sotto la prova; l'invito resta dov'è per regola, uno dei tre posti |
| HA, con l'account | la proposta consigliata, l'ultima simulazione, «Vedi i Progressi» | nel primo pannello: la proposta al posto di «Oppure allenati con 10 domande», l'ultima simulazione sotto; il tetto dei bersagli (§7, 2) vale anche qui |
| Caricamento, banca non raggiungibile | detti, senza tessere provvisorie | in cima al primo pannello; i numeri di «Che cosa trovi qui» dicono che non si possono contare, non zero |
| Errore di salvataggio, verifica dell'email | `#rotta-alerts`, `#conto-verifica` | in cima al primo pannello, prima del titolo |
| Fuori casa (R-STA-09) | detto per prima cosa | prima di tutto, anche della carta |

«Come funziona» resta in tutti e tre gli stati, sotto il primo pannello.

### 5.5 Il resto del sito: i componenti della Regata

Le schermate della Regata si fanno con pochi pezzi, tutti già nei mock:

- **la scheda** (`.carta`): bianca, bordo `--filo`, raggio 14, un'ombra lunga
  e chiara; una per cosa che conta, non una per riga;
- **le righe** (`.righe`): un elenco con l'icona tonda, il titolo, una riga
  piccola e la freccia; è la forma delle azioni secondarie (I-29, decisione 5);
- **i numeri grandi** (`.scandagli`): la cifra e la sua parola sotto;
- **il pulsante pieno**, uno per schermata, e il **link con la freccia**;
- **le tappe triangolari** della domanda e l'anello;
- **la striscia di mare** in testa alla Home al telefono, alta al più 96 px
  (decisione D di I-27: nel mock della Regata è 100, da portare a 96);
- **la barra in basso con le icone**, se l'autore lo decide (I-29, decisione
  8): le parole restano (R-NAV-03).

---

## 6. Il contratto dei controlli

### 6.1 La scala: `SCALA_CSS` e `test_scala_css`

Con le decisioni 1–5 come raccomandate, il contratto diventa:

- **corpi** `[12, 14, 16, 20, 24, 32]`, più `44` e `56` **per ruolo**: 56 solo
  nell'`h1` della Home sopra la soglia; 44 solo in «Come funziona» sopra la
  soglia e nei numeri dell'esame (un blocco fatto di sole cifre, §6.3) sopra
  i 900 px. Al posto di `'home': 40` un elenco `'ruoli'` con selettore,
  larghezza minima e corpo, che il banco riceve come oggi riceve `home`.
  Chi passa da 19 a 20 e da 30 a 32: la domanda, i titoli delle schermate;
- **spazi** con `64` in più; i 106 px del mock (un resto della variante con il
  percorso a sinistra) tornano nella scala;
- **pesi** `[400, 600, 700, 800]`, con 800 solo per titoli da 24 px in su e per
  i numeri;
- **interlinea** 1,45 il testo e 1,2 i titoli fino a 32 px; 1,05 per i titoli
  da 44 e 56 px;
- **colori**: §5.1.

`test_scala_css` resta com'è nel modo di leggere; cambia il contratto che
riceve. **Le rotture del giro 2 si rifanno sui numeri nuovi** (un corpo a 19
diventa rosso; un 56 fuori dall'`h1` della Home è rosso).

### 6.2 T-12, al computer

T-12 oggi non misura sopra i 375 px. Per la sola Home, sopra la soglia, a
1280×800:

- **`T-12:principale`** misura il fondo pieno **contro la superficie che sta
  dietro ogni elemento**, non contro il `body`. Oggi, con la pagina scura, il
  pulsante `#0A4F6E` dentro la scheda bianca risulterebbe «senza fondo pieno»
  (1,00:1 contro il mare del `body`), e la scheda della sigla e il triangolo
  della prima tappa (beige, 13 px) risulterebbero fondi pieni. Con D-14
  riscritta (decisione 7) restano fuori le superfici che non si toccano: la
  carta, il velo, le schede che contengono testo.
- **`T-12:scelte`**: il percorso è una navigazione e si esclude come la barra,
  l'avatar e i segmenti; faro e boa contano. Il conto atteso in H0 è 4:
  «Simula il quiz base», «Oppure allenati con 10 domande», faro, boa (oggi 15,
  §3.3).
- **`T-12:avviso`** trova la frase **per significato**, non solo per testo
  esatto: la tappa 1 del mock dice «Senza account le risposte valgono finché la
  pagina resta aperta», due parole meno di `PRIMA`, e oggi passerebbe. Un avviso
  di conservazione nella Home è rosso in qualunque forma (decisione A del giro
  1; D-08).
- **`T-12:primo-schermo`**: invariato, e misurato anche a 1280×800 e 1200×700.

### 6.3 T-13, i cambi

- **`T-13:corpi`**: i testi dentro `svg[role="img"]` o `aria-hidden` della
  carta non si contano (sono disegno, §5.2); il tetto di cinque corpi resta.
  Con la carta fuori, il primo schermo della U ha 6 corpi (12, 14, 16, 20, 44,
  56): il disegno si adatta portando le etichette dei numeri da 12 a 14.
- **`T-13:titoli`**: un blocco fatto di **sole cifre** («20», «30′», «4») non
  è «il testo che il titolo introduce». Oggi «La prova d'esame dei quiz», `h2`
  da 16 px, introdurrebbe un «20» da 44 px e sarebbe rosso. Il banco riconosce
  le cifre dal testo, non da un aggancio. Restano rossi, e vanno corretti nel
  disegno, gli `h2` più piccoli degli `h3` che seguono: nel mock «La prova
  d'esame dei quiz» (16) e «Che cosa trovi qui» (24) stanno sopra tappe in `h3`
  da 32. Le tappe diventano `h2`, o i titoli sopra crescono.
- **`T-13:sezioni`**: i pannelli alti uno schermo sono sezioni contigue (0 px
  fra l'una e l'altra) con 16 px dentro: la regola li direbbe senza
  separazione. Fra due pannelli si misura lo spazio fra i **contenuti**, non fra
  le scatole.
- **`T-13:colori`**: con i ruoli nuovi; `--boa` su un testo, su un link o su un
  esito è rosso.

### 6.4 T-15, il volto (nuovo)

Nel banco del client, senza account, con la pagina vera e con quella di
riferimento. **Le dimensioni:** 1200×700, 1280×800, 1280×1024, 1440×900,
1920×1080, e 1199×800, dove la U non deve esserci. Le animazioni ferme per le
misure (con l'emulazione di `prefers-reduced-motion`, §6.5).

- **`T-15:soglia`** — sotto la soglia (decisione 9: 1.200 px di larghezza e
  680 di altezza; misurata a 1199×800 e a 1440×679) nessuno strato fisso,
  nessun fondo scuro, nessuno scorrimento a scatti; sopra, la carta c'è.
- **`T-15:costa`** — a ogni dimensione gli 11 triangoli stanno sulla terra
  (pixel beige nella schermata con il resto nascosto), il faro e la boa stanno
  dentro lo schermo e fuori dalla colonna del testo.
- **`T-15:velo`** — ogni testo che sta sopra la carta ha almeno 4,5:1 (3:1 se
  grande) contro il pixel peggiore dietro di lui, pannello per pannello.
- **`T-15:percorso`** — una `nav` con undici link e un nome ciascuno;
  `aria-current="location"` sul pannello in vista mentre si scorre; un tocco
  porta al pannello, il fuoco al suo titolo, l'indirizzo e la lunghezza della
  cronologia non cambiano; bersagli di 44×44 px a 8 px; triangoli e stati a 3:1
  sul beige.
- **`T-15:fuoco`** — con Tab da pagina appena aperta, dopo la testata il primo
  fuoco è l'azione principale; nessun fuoco su un elemento che non si vede o
  che non fa niente (il contenitore della carta).
- **`T-15:luci`** — faro e boa sono pulsanti di almeno 44 px con
  `aria-expanded`; toccati, la scheda dice la sigla in testo vero; la scheda non
  copre la colonna né l'azione principale.
- **`T-15:movimento`** — con movimento ridotto, dopo un secondo
  `document.getAnimations()` è vuoto, le luci sono accese ferme, la rotta è
  disegnata intera; senza, c'è il comando che ferma le luci (decisione 10) e
  premuto le ferma.
- **`T-15:numeri`** — i numeri della Home vengono dalla banca e dal motore: i
  quesiti, gli esercizi, i segnali, gli oscurati, le note dopo la risposta, le
  figure mancanti, le condizioni della prova (`meta.prove.base`), i pesi dei temi
  nominati, la dimensione dell'allenamento consigliato. Il banco li calcola dai
  dati che serve e li cerca nel testo visibile.
- **`T-15:stati`** — H1 con l'attività e l'invito nel primo pannello, HA con la
  proposta, gli avvisi sopra il titolo, banca non raggiungibile senza numeri
  inventati.
- **`T-15:documento`** — la Home al computer, poi Allenati e Indietro: lo
  stesso documento, lo strato fisso via in Allenati e di nuovo nella Home,
  lo scorrimento tornato al pannello di prima. È N-01 sopra la soglia, per i
  passi che la U tocca; N-01 com'è continua a girare sotto i 900 px.

### 6.5 Il banco

- **`tests/browser.mjs`**: un `movimento(ridotto)` con
  `Emulation.setEmulatedMedia`, e un lettore di PNG senza dipendenze (zlib di
  Node, filtri delle righe: una trentina di righe, provato in questa sessione) in
  un modulo a parte, con il commento che dice a che cosa serve e a che cosa no.
- **La pagina di riferimento del client** prende la Home U sopra la soglia: è
  il metro di T-15, come è stata il metro di T-12 e T-13.
- **Q-SUITE.** Stima, da misurare con `RG_TEMPI=1`: T-15 a sei dimensioni, una
  schermata per pannello nella parte del velo, circa 30–45 s di lavoro nelle
  corsie libere. Le rotture chiedono la sola parte che rompono.

### 6.6 Le rotture, e le difese da togliere

**Rotture della pagina di riferimento**, ognuna rossa per il suo motivo:

1. la terra ancorata in percentuale, come nel mock — rossa a 1280×1024 in
   `T-15:costa`;
2. il velo in percentuale — rossa a 1200×700 in `T-15:velo`;
3. una cifra di scandaglio sotto l'`h1` — `T-15:velo`;
4. la scheda della sigla sopra la colonna — `T-15:luci`;
5. il percorso con `href="#t-3"` che cambia l'indirizzo — `T-15:percorso`;
6. il percorso prima dell'azione nel fuoco — `T-15:fuoco`;
7. i triangoli in `--boa` sul beige — `T-15:percorso`;
8. i bersagli di 13×14 px — `T-15:percorso`;
9. il contenitore della carta con `overflow:auto` che prende il fuoco —
   `T-15:fuoco`;
10. le luci che lampeggiano anche con movimento ridotto — `T-15:movimento`;
11. nessun comando per fermare le luci — `T-15:movimento`;
12. «27 fanali e segnali» scritto a mano — `T-15:numeri` (la banca ne ha 53);
13. lo strato fisso che resta in Allenati — `T-15:documento`;
14. lo scorrimento a scatti su tutto il documento — `T-15:documento`;
15. la frase della conservazione parafrasata in una tappa — `T-12:avviso`;
16. l'invito in H0 — R-ACC-03, `N-01:invito`;
17. un 56 px fuori dall'`h1` della Home — `T-13:corpi`;
18. la sottolineatura del link in `--boa` — `T-13:colori`.

**Difese da togliere a mano, una alla volta**, perché il banco si provi:
- con `K.fondo()` al posto dei pixel la rottura 3 passa verde;
- senza 1280×1024 la rottura 1 passa verde;
- senza l'emulazione del movimento la rottura 10 passa verde;
- senza il confronto dell'indirizzo e della cronologia la rottura 5 passa
  verde;
- senza l'esclusione delle cifre in `T-13:titoli` il riferimento giusto è
  rosso.

---

## 7. I conflitti, con i numeri

Ognuno con il requisito e il controllo che tocca, la via proposta e la
decisione che serve.

1. **I corpi della U fuori scala — R-RIF-23, `test_scala_css`, T-13:corpi.**
   La scala è 12, 14, 16, 19, 24, 30, più 40 per l'`h1` della Home sopra 900
   px. La U usa 56 per l'`h1`, 44 per «Come funziona» e per i numeri, 32 per le
   tappe, 20 per il testo dei pannelli e per l'introduzione. **E non è solo la
   Home:** tutta la Regata è costruita su `sorgenti/comune.css`, che ha la scala
   di I-29 (decisione 4): 12, 14, 16, 20, 24, 32, 44, 56, spazi fino a 64, pesi
   fino a 800. Nel primo schermo della U i corpi sono 9 (6 senza la carta),
   contro un tetto di 5. *Via:* adottare la scala di I-29 con i ruoli del §6.1,
   la carta fuori dal conteggio, le etichette dei numeri a 14. Decisioni 1–5.
2. **I bersagli nel primo schermo — R-RIF-22, T-12:scelte.** Al più 4, esclusi
   barra, avatar, segmenti e il ritorno della preparazione. La U ne ha 15. Oggi
   T-12 non lo vede, perché misura a 375 px; il requisito è scritto senza
   larghezza. *Via:* il percorso conta come navigazione; faro e boa contano; il
   conto torna a 4. Decisione 6.
3. **Il contrasto sopra la carta — R-RIF-11 e WCAG 1.4.3, T-08/T-09.** I
   controlli compongono i fondi degli antenati e vedrebbero 8,91:1 dappertutto.
   Sui pixel: a 900 e 1024 px testi a 1,28–1,56:1, a 1200 px a 2,35:1, a 1440 px
   una nota a 4,54:1, a un passo dalla soglia. *Via:* il velo e la zona libera in
   pixel (§5.2), `T-15:velo` sui pixel. Decisioni 9 e 14.
4. **Un solo fondo pieno — D-12 e D-14, R-RIF-19, T-12:principale.** La misura
   confronta con il `body`; con la pagina scura il pulsante dentro la scheda
   bianca risulterebbe senza fondo pieno e la scheda della sigla un secondo
   fondo pieno. *Via:* misurare contro la superficie dietro, e D-14 riscritta
   come «la cosa interattiva più evidente» (I-29, decisione 3). Decisione 7.
5. **I ruoli dei colori — D-25, R-RIF-30, `test_scala_css`, T-13:colori.** I
   valori del contratto non sono quelli della Regata (§5.1); la Regata non ha un
   colore per gli avvisi; i numeri sono del colore delle azioni; il link ha la
   sottolineatura del segno. *Via:* §5.1. Decisione 8.
6. **Le luci che lampeggiano — WCAG 2.2.2 (AA), nessun controllo oggi.** Un
   lampeggio che parte da solo, dura più di 5 secondi e sta accanto ad altro
   contenuto vuole un modo di fermarlo; `prefers-reduced-motion` è una
   preferenza del sistema, non un comando nella pagina. Il ritmo è sotto le tre
   accensioni al secondo (WCAG 2.3.1). *Via:* «Ferma le luci» nella scheda,
   oppure luci accese ferme e lampeggio solo dopo il tocco. Decisione 10.
7. **Il movimento ridotto — WCAG 2.3.3, nessun controllo oggi.** Letto nel
   CSS: i lampi si fermano accesi, la rotta è disegnata, le transizioni del
   percorso spente; restano le transizioni dell'anello delle luci (0,2–0,3 s).
   Non misurato. *Via:* `T-15:movimento`.
8. **Il fuoco e la tastiera sul percorso — WCAG 2.4.3, D-01, nessun controllo
   al computer.** «Simula il quiz base» al ventesimo Tab. *Via:* l'ordine del
   §5.3, `T-15:fuoco`.
9. **Il percorso, bersagli e contrasti — R-RIF-12 (a 375 px), WCAG 1.4.11.**
   13×14 px; contorno 2,67:1 e pieno 2,32:1 sul beige. *Via:* §5.3. Decisione 13.
10. **Le larghezze — nessun controllo al computer oltre T-13 a 1280×800.** La
    terra esce dallo schermo a 900×700, 1024×768 e 1280×1024; il faro esce a
    1280×1024; la scheda copre la colonna a 900×700. *Via:* la carta ancorata
    alla costa (§5.2) e una soglia per la U. Decisione 9.
11. **I numeri scritti a mano — AGENTS.md, «i conteggi si contano dalla banca
    caricata»; R-DATI-06 per `meta.json`.** Il mock scrive 1.722, 135, 27, 37,
    4, 1, 20 · 30′ · 4, «25 quiz base», «4 delle 20». **Uno è già sbagliato:**
    «27 fanali e segnali» e «27 segnali da riconoscere» — la banca dei Segnali
    ne ha 53, e 27 sono i soli fanali notturni. *Via:* `T-15:numeri`.
12. **Gli stati della Home — R-ACC-03, R-STA-09, §7.1.** La U disegna solo H0.
    *Via:* §5.4. Decisione 11.
13. **L'avviso ripetuto nella Home — decisione A del giro 1, D-08,
    T-12:avviso.** La tappa 1 riprende la frase della conservazione con due
    parole in meno, e in fondo c'è «Si prova senza account; con l'account salvi
    i progressi». *Via:* T-12:avviso per significato (§6.2), la tappa 1 senza la
    frase (§10).
14. **La tappa 10 e l'invito — R-ACC-03, §7.1 H0, decisione A-6.** In H0
    «nessun invito a registrarsi», e la promessa del Percorso aspetta P-76.
    «Con l'account, la rotta resta» descrive un vantaggio, senza pulsante; ma
    «la rotta resta» si legge come il Percorso. Decisione 12.
15. **La struttura dei mock — R-NAV-04, R-NAV-11, R-UX-06 (F-01).** Allenati nel
    mock ha «Allenamento consigliato» come azione principale, «Altri modi» e
    «Dove pesa di più all'esame» in righe; oggi ha le cinque intenzioni dell'area
    2, i temi, i segnalibri e la ricerca per numero, che i controlli tengono
    fermi. Il riepilogo del mock si intitola «Hai risposto a N domande su M»,
    fuori dall'elenco chiuso di frasi di F-01. *Via:* il giro B veste, non
    cambia la struttura; le differenze sono decisioni del giro 3 o a parte.
    Decisione 15.
16. **Lo strato fisso nel documento solo — R-NAV-08, N-01.** Lo scorrimento a
    scatti e il fondo scuro, se scritti su `html` e `body` come nel mock,
    valgono per tutte le sezioni; il ritorno con «Indietro» deve tornare allo
    stesso punto. N-01 gira a 756×469 e non lo vede. *Via:* §5.2,
    `T-15:documento`.
17. **La striscia della Home al telefono — decisione D di I-27.** Al più 96 px;
    nella Regata è 100. *Via:* 96.
18. **I testi della carta nel conteggio dei corpi — T-13:corpi.** 9, 10, 12, 13
    in unità del disegno. *Via:* §6.3.
19. **I titoli più piccoli dei titoli sotto — R-RIF-24, T-13:titoli.** §6.3.
20. **Le sezioni contigue — R-RIF-25 (D-23), T-13:sezioni.** §6.3.

**Che cosa non è un conflitto**, misurato o letto: le righe a 1280 px (letto:
il testo dei pannelli a 20 px in una colonna di 520 px fa una cinquantina di
caratteri, sotto i 75); lo sbordamento (misurato nel README dei mock: nessuno a
1280×800); la distanza fra i triangoli (misurata: 12 px, sopra gli 8 di D-28);
il nome accessibile dei link del percorso (letto: è il nome della tappa).

---

## 8. Le superfici senza mock

Allenati · Carteggio, Allenati · Segnali, Esame, Progressi, Profilo con Info e
Dati, Accedi. Il giro B le disegna con i componenti del §5.5, e prima di
scrivere il codice ChatGPT ne mostra una schermata a 375 e 1280 px all'autore,
come ha fatto il giro 2. Che cosa devono tenere:

- **Carteggio:** le tre porte come gruppo di porte alla pari (T-12, il gruppo
  è l'azione principale); «Sei tu a giudicare» prima di Inizia (R-UX-03); i
  materiali dichiarati prima. Il linguaggio della carta ha qui la sua casa
  naturale: la scheda «Prima di cominciare» oggi con l'ombra diventa una nota.
- **Segnali:** restano notturni — il cielo, i fanali e la carta dei segnali
  diurni sono contenuto e non cambiano con il tema (§7.7); il vestito tocca solo
  la preparazione, i pulsanti e il riepilogo.
- **Esame:** le prove in righe invece che in schede a tre colonne strette (I-29,
  diagnosi 6: «Quiz / base / e / vela», una parola per riga); il modulo chiuso
  con la scelta nel sommario (decisione B del giro 1); «Com'è fatto l'esame» con
  i numeri grandi dei `scandagli`.
- **Progressi:** i cinque stati con i loro colori, che restano di ruolo — da
  rifare non è un errore appena fatto, e il rosso dell'errore non va sulla barra
  senza una decisione; la legenda e il `?` (R-STATI-06); i numeri grandi.
- **Profilo, Info, Dati, Accedi:** dialoghi `aria-modal` (R-RIF-06); le azioni
  secondarie in righe, non dieci pulsanti in colonna (I-29, diagnosi 2); i
  messaggi d'errore e di conferma mancante restano dove sono (R-ACC-66).

---

## 9. I requisiti proposti per il §9.11

Proposti con il nome dei controlli; il numero e il testo definitivi li scrive
la sessione che fa i controlli, con i nomi letti in `tests/`. Un prefisso
nuovo, `R-VOLTO`, perché R-RIF-31…35 sono già proposti dal giro 3.

**Requisiti che cambiano:**

| Requisito | Che cosa cambia | Controllo |
|---|---|---|
| R-RIF-22 | sopra la soglia anche al computer; il percorso escluso come navigazione | T-12:scelte |
| R-RIF-23 | la scala di I-29 con i ruoli; i testi della carta fuori dal conteggio | `test_scala_css`, T-13:corpi |
| R-RIF-24 | i blocchi di sole cifre non sono testo introdotto | T-13:titoli |
| R-RIF-25 | il 64 nella scala; fra i pannelli contigui lo spazio fra i contenuti | `test_scala_css`, T-13:spazi |
| R-RIF-26 | 800 per titoli da 24 px in su e per i numeri | `test_scala_css`, T-13:pesi |
| R-RIF-27 | interlinea 1,05 per i titoli da 44 e 56 px | T-13:testo |
| R-RIF-19 | il fondo pieno misurato contro la superficie dietro; D-14 riscritta | T-12:principale |
| R-RIF-30 | i valori della Regata e i ruoli «segno», «terra», «carta» | `test_scala_css`, T-13:colori |
| R-ACC-02 | l'avviso nella Home trovato anche quando è parafrasato | T-12:avviso |

**Requisiti nuovi:**

| ID proposto | Requisito | Controllo |
|---|---|---|
| R-VOLTO-01 | Sopra la soglia la Home ha la carta ferma, sotto no; la carta c'è solo con la Home aperta | T-15:soglia, T-15:documento |
| R-VOLTO-02 | A ogni dimensione del contratto il percorso sta sulla terra, il faro e la boa dentro lo schermo e fuori dalla colonna | T-15:costa |
| R-VOLTO-03 | Il testo sopra la carta ha il contrasto minimo contro il pixel peggiore dietro di lui | T-15:velo |
| R-VOLTO-04 | Il percorso è una navigazione: undici link con un nome, `aria-current` sul pannello in vista, un tocco porta al pannello e al suo titolo senza cambiare l'indirizzo né la cronologia; bersagli di 44 px a 8 px; triangoli e stati a 3:1 | T-15:percorso |
| R-VOLTO-05 | Dopo la testata il primo fuoco è l'azione principale; nessun fuoco su ciò che non si vede | T-15:fuoco |
| R-VOLTO-06 | Faro e boa sono pulsanti con `aria-expanded`; la sigla si legge in testo vero; la scheda non copre la colonna | T-15:luci |
| R-VOLTO-07 | Con movimento ridotto niente si muove; senza, le luci si fermano con un comando | T-15:movimento |
| R-VOLTO-08 | I numeri della Home vengono dalla banca e dal motore | T-15:numeri |
| R-VOLTO-09 | La Home al computer tiene H1, HA, gli avvisi e la banca non raggiungibile | T-15:stati |
| R-VOLTO-10 | Indietro dalla Home al computer torna allo stesso pannello, e il documento resta lo stesso | T-15:documento |
| R-VOLTO-11 | Le schermate del giro B, guardate a 375 e 1280 px, approvate dall'autore | scoperto — è uno sguardo, non una misura |

---

## 10. I testi da far verificare all'autore

Sono contenuto, e alcuni sono didattici. Dal mock `u-terra-beige/home.html` e
da `sorgenti/stili/u/home.json`.

**Le sigle e le frasi della carta.**
- Faro: «Faro · Lam.(2) BRV 10s» — «Due lampi ravvicinati ogni 10 secondi. Il
  colore dice dove sei: nel settore bianco la rotta è libera, nel rosso e nel
  verde no.» La notazione (il punto dopo «Lam», l'ordine «BRV») e la regola dei
  settori sono di fantasia come il faro (I-29, T e U).
- Boa: «Boa cardinale est · Sc.(3) 10s» — «Tre luci scintillanti ogni 10
  secondi. Coni base contro base, nero giallo nero: si passa a est della boa.»
- Sulla carta, le lettere V, B, R dei settori.

**Le dieci tappe**, con la nota della sessione:

| # | Titolo | Testo | Da guardare |
|---|---|---|---|
| 1 | Si prova senza account | Apri una domanda e rispondi: non serve registrarsi. Senza account le risposte valgono finché la pagina resta aperta. | la seconda frase è l'avviso della conservazione, detto nella Home: esce (§7, 13) |
| 2 | La simulazione, come all'esame | 20 domande in 30 minuti, al più 4 errori. Nessuna correzione durante la prova: l'esito arriva alla fine. | i numeri da `meta.prove.base` |
| 3 | Dieci domande, con la correzione | Dieci quiz base, con la correzione dopo ogni risposta: la tua accanto a quella del decreto. Puoi fermarti quando vuoi. | |
| 4 | L'allenamento consigliato | 25 quiz base scelti dalle tue risposte. Ogni domanda dice perché è lì. | in H0 non ci sono risposte, e la selezione dice «fino a» 25; il numero dalla stessa fonte della preparazione |
| 5 | Un argomento alla volta | Base o vela, uno o più argomenti. Navigazione e Manovra portano 4 delle 20 domande ciascuna: vale la pena cominciare da lì. | «vale la pena cominciare da lì» è un consiglio: la frase che consiglia la dà `dovePesa()`, e solo con abbastanza risposte |
| 6 | Gli errori tornano | Riapri le domande che hai sbagliato. Dopo un errore puoi segnare perché: non lo sapevi, o è stata una svista. | gli errori non tornano da soli dalla 0.5.1: tornano nell'allenamento consigliato (al più 5) e in «Ripassa gli errori» |
| 7 | Il carteggio, sulla carta vera | 135 esercizi: tracci sulla carta nautica con squadrette e compasso, poi confronti con la risposta ministeriale. Sei tu a giudicare. | il numero dalla banca |
| 8 | Fanali e segnali | 27 segnali da riconoscere a colpo d'occhio, come di notte in mare. Sulla carta ogni luce ha la sua sigla: toccala per leggerla. | **sbagliato**: le schede sono 53, i fanali 27; e i segnali diurni non sono «di notte» |
| 9 | L'esame, in ordine | Carteggio, quiz base, quiz vela: con le condizioni del decreto. Le prepari quando vuoi, senza sblocchi. | |
| 10 | Con l'account, la rotta resta | Ritrovi le tue risposte quando torni, anche da un altro telefono, e vedi i Progressi. | deciso (decisione 12): il titolo diventa «Con l'account, le risposte restano», senza pulsante |

**Il resto della Home:** «Scendi lungo la rotta: ogni pannello è un modo di
prepararsi, e il suo triangolo, qui a lato, si accende quando ci arrivi»;
«Che cosa trovi qui» con «1.722 quesiti del decreto», «135 esercizi di
carteggio», «27 fanali e segnali» (lo stesso errore della tappa 8); «I limiti,
detti prima»; «Gratis e open source. Si prova senza account; con l'account
salvi i progressi», che ripete l'introduzione.

---

## 11. I giri, chi fa che cosa

**Giro A — i token, i componenti condivisi, la Home.**
- **A-controlli, Claude su `main`:** le decisioni nel contratto; `SCALA_CSS`
  nuovo e le rotture del giro 2 rifatte; T-12 e T-13 come nel §6.2–6.3; T-15 e
  le sue rotture; `movimento()` e il lettore di PNG nel banco; la pagina di
  riferimento del client con la Home U; R-VOLTO e i requisiti che cambiano nel
  §9.11; i difetti dichiarati sulla pagina vera. Nessun file di `site/`.
- **A-pagina, ChatGPT su `ui/main`:** il `:root` della Regata; la barra, la
  testata, il pulsante, il link, le righe, la scheda; la Home al telefono della
  Regata; la Home al computer con la carta, il percorso e i suoi stati; i testi
  della Home come l'autore li ha verificati (§10); le righe dichiarate tolte;
  prima e dopo a 375×667, 375×812, 1200×700, 1280×800, 1280×1024 e 1920×1080,
  con le schermate guardate.

Cambiando il `:root`, **tutte le schermate cambiano colore nel giro A**: è
voluto, perché i token sono valori e non forme. Le forme — righe al posto dei
pulsanti pallidi, tappe triangolari, numeri grandi — arrivano nel giro B.

**Giro B — le altre sezioni**, una o due per volta, nell'ordine di I-29
(decisione 9): prima la domanda e il riepilogo, dove chi studia passa più
tempo; poi le preparazioni e Allenati; poi Esame, Carteggio, Segnali,
Progressi, il Profilo e Accedi. Per ogni passo: se serve un controllo nuovo,
Claude su `main` prima; poi ChatGPT su `ui/main`, con le schermate mostrate
all'autore prima della merge.

**I prompt li scrive la regia** in `docs/prossime-sessioni.md`, uno per passo,
ognuno con la riga che dice per quale agente è. Questo file è il contratto che
citano.

### 11.1 Il prompt proposto per A-controlli

*Proposto il 25 ottobre 2026, dopo le decisioni 1–14; la versione che vale è
quella che la regia scrive nella coda.*

```
Questo prompt è per Claude, su main (in un worktree che parte da main).
Se sei su un altro ramo o in un worktree di ui/*, fermati e dillo.

Sessione A-controlli del volto: i controlli prima della pagina per la Home
al computer «U — Terra beige» e i colori della Regata. Leggi AGENTS.md,
docs/volto-progetto.md per intero (le decisioni 1–14 del §12 sono prese),
docs/regole-disegno-progetto.md §3 e §10.1 «Giro 2», e in tests/ il
contratto SCALA_CSS (test_interfaccia.py) e T-12/T-13 (client_account.mjs).

Che cosa fai, con il metodo del §4 del progetto:
- SCALA_CSS come nel §6.1 e nel §5.1 (corpi con i ruoli, 64, 800, interlinea
  dei titoli grandi, i colori della Regata, i ruoli «segno» e «terra»); le
  rotture del giro 2 rifatte sui numeri nuovi;
- T-12 e T-13 come nel §6.2 e nel §6.3;
- T-15 come nel §6.4, alle dimensioni dette; in tests/browser.mjs
  movimento(ridotto) e, in un modulo a parte, il lettore di PNG (§6.5);
- la pagina di riferimento del client con la Home U sopra la soglia, verde
  per intero; le diciotto rotture del §6.6, ognuna rossa per il suo motivo;
  le difese del §6.6 tolte a mano, una alla volta;
- nella specifica §9.11 i requisiti che cambiano e R-VOLTO-01…11 (§9 del
  progetto), con i nomi dei test letti in tests/;
- sulla pagina vera, i rossi dichiarati in docs/eccezioni-interfaccia.md, una
  riga per verifica, con i numeri misurati.

Nessun file di site/. Le cinque suite, l'interfaccia con la 8620 guardata
libera per 90 s, e i tempi con RG_TEMPI=1 (Q-SUITE). Una nota di consegna
nel §11.1 di docs/volto-progetto.md; voce in fondo a [Unreleased]; un
commit, niente push. Chiudi con il resoconto di docs/prossime-sessioni.md.
```

**Consegnato da P-97 (25 ottobre 2026): il contratto per P-98.** I controlli
stanno su `main` prima della pagina, come per i giri 1 e 2. Che cosa la pagina
deve fare per passarli, oltre al §5 e al §6, lo dicono gli agganci e le misure
qui sotto; il metro e' `tests/pagina-client-ridisegno.html`, che ha la Home U
sopra la soglia e passa tutto il banco.

- **La scala e i colori** (`SCALA_CSS` in `tests/test_interfaccia.py`): in un
  solo `:root` `--t-12`, `--t-14`, `--t-16`, `--t-20`, `--t-24`, `--t-32`,
  `--t-44`, `--t-56`; `--s-4`…`--s-64`; `--w-400`, `--w-600`, `--w-700`,
  `--w-800`; `--lh-testo:1.45`, `--lh-titoli:1.2`, `--lh-titoli-grandi:1.05`,
  `--testo-max:480px`; `--acc:#0a4f6e`, `--ko:#b3261e`, `--warn:#765000`,
  `--ok:#12663a`, `--boa:#ff6a1a`, `--rotta:#b23f00`, `--terra:#f2e6cf` (alias
  ammessi se risolvono a questi valori). 19, 30 e 40 non ci sono piu'. I ruoli,
  che T-13:corpi legge: 56 solo nell'`h1` di `#v-home` da 1.200×680 px; 44 solo
  nell'`h2` di `#v-home` il cui testo e' esattamente «Come funziona», da
  1.200×680, e in un blocco di sole cifre sopra i 900 px. 800 solo su un titolo
  da 24 px in su o su un blocco di sole cifre.
- **La soglia** si legge dalle dimensioni: la carta c'e' da 1.200×680 in su, e
  solo con la Home aperta; il banco misura dopo un cambio di dimensioni, quindi
  la pagina deve rispondere a un `matchMedia` che cambia, non solo al primo carico.
- **La carta** e' uno strato `position:fixed` dentro `#v-home` che copre lo
  schermo: il banco la riconosce cosi', senza un aggancio. Dentro, i testi stanno
  in un `svg[role="img"]` o sotto `aria-hidden` (fuori dal conto dei corpi). Il
  contenitore non prende il fuoco. Ogni elemento della carta sta tutto dentro lo
  schermo (T-07 misura gli sbordi anche a 1280×900, e ora li' c'e' la U).
- **Due agganci, gli unici nuovi:** `data-luce` su ciascun lampo (faro e boa) e
  `data-rotta` sul tracciato della rotta. Con il movimento ridotto un'animazione
  spenta non dice piu' che cos'era, e il banco li cerca per controllare che le
  luci siano accese ferme (opacita' ≥ 0,9) e la rotta intera
  (`stroke-dashoffset` 0).
- **Il percorso** e' la `<nav>` di `#v-home`, con un `aria-label`, e undici link
  con un nome (testo o `aria-label`) e `href="#<id del pannello>"`: e' dall'href
  che il banco trova i pannelli. Il tocco non cambia l'indirizzo ne' la
  cronologia, e porta il fuoco al primo titolo del pannello. `aria-current="location"`
  si aggiorna scorrendo. Il triangolo e' la prima forma SVG del link: vuoto si
  misura sul contorno, pieno sul riempimento, a 3:1 sul beige.
- **Le luci** sono due pulsanti di `#v-home` il cui nome contiene «faro» e «boa»,
  con `aria-expanded`; la sigla — «Lam.(2)», «Sc.(3)» — sta in testo vero, fuori
  da `svg` e `aria-hidden`, dentro un `aria-live="polite"`; «Ferma le luci» e' un
  pulsante con quel testo, visibile almeno con la scheda del faro aperta.
- **La colonna del testo** per il banco e' l'unione dei testi visibili della Home
  fuori dagli strati fissi: la scheda della sigla, il faro e la boa non la
  toccano.
- **I numeri** che T-15:numeri cerca nel testo visibile della Home al computer:
  «1722 quesiti» (con o senza il punto), «135 esercizi», «53 …segnali» (o
  fanali), gli oscurati, «4 … note», «1 … figura», le condizioni della prova
  (20 … domande, 30 … minuti, 4 … errori) e «25 … quiz» dell'allenamento
  consigliato. Con la banca che non risponde: nessuno di questi conti della
  banca, nessuno zero, e una frase con «banca non risponde» o «non si possono
  contare».
- **Il primo pannello** e' la destinazione del primo link del percorso: li'
  stanno «Le attivita' di questa pagina» e l'invito in H1, la proposta in HA, e
  ogni `[role="alert"]` della Home, prima del titolo.

**Le rotture e le difese.** Le diciotto del §6.6 sono in `ROTTURE_RIFINITURA`,
piu' due: «un corpo a 19 px» (il giro 2 rifatto sui numeri nuovi, con «sei corpi
nel primo schermo» che passa da 19 a 20) e un numero scritto a mano con la banca
che non risponde, perche' T-15:stati avesse la sua. Ognuna e' rossa per il suo
motivo; la terra in percentuale solo a 1280×1024 e il velo in percentuale solo a
1200×700, come nel mock. Le cinque difese tolte a mano, una alla volta, sul banco
copiato e rimesso com'era: con il contrasto composto dagli antenati (il numero
che `kitPagina().contrasto` dice) al posto dei pixel la cifra sotto l'h1 passa
verde; senza 1280×1024 la terra in percentuale passa verde; senza la misura con
il movimento ridotto le luci che lampeggiano lo stesso passano verdi; senza il
confronto dell'indirizzo e della cronologia il link che cambia l'indirizzo passa
verde; senza l'esclusione delle cifre in T-13:titoli il riferimento giusto e'
rosso («La prova d'esame dei quiz», 16 px, introdurrebbe «20» a 44).

**Tre cose del banco trovate scrivendo.** T-13 misurava subito dopo il cambio di
dimensioni, e una pagina che risponde con `matchMedia` era misurata nello stato di
prima: ora aspetta 100 ms. Con un dialogo modale aperto il primo schermo per i
cinque corpi e' il dialogo, come per le distanze dal P-95: «Accedi» sopra la Home
al computer contava i corpi della Home dietro. E la rottura del percorso con
`href` era prima scritta togliendo `preventDefault`: il salto al frammento toglie
anche il fuoco, e la rottura restava rossa per il fuoco anche senza il confronto
dell'indirizzo; ora cambia l'indirizzo con `pushState`, e la difesa si prova.

**Sulla pagina vera** quattordici verifiche rosse, ognuna dichiarata in
`docs/eccezioni-interfaccia.md` con i numeri: le due della scala statica, T-13:corpi,
T-12:scelte (5 bersagli a 1280×800) e le dieci di T-15. Tutto il resto, T-12 al
computer compreso, gira verde.

---

## 12. Decisioni per l'autore

Ognuna con la raccomandazione. Le decisioni 1–14 servono prima di
A-controlli, e l'autore le ha prese il 25 ottobre 2026, tutte come
raccomandato; le 15–18 le ha prese il 26 ottobre, anche loro come
raccomandato.

1. **La scala dei corpi.** Adottare la scala di I-29 (12, 14, 16, 20, 24, 32,
   44, 56) al posto di quella del giro 2 (12, 14, 16, 19, 24, 30, 40)? Cambia la
   decisione C del giro 2, che l'autore ha approvato guardando le schermate.
   *Raccomandazione:* sì, con 56 solo per il titolo della Home al computer e 44
   solo per «Come funziona» e per i numeri dell'esame; approvata guardando i
   mock, come C.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

2. **Il tetto di cinque corpi nel primo schermo.** *Raccomandazione:* resta; i
   testi della carta non contano, e le etichette dei numeri passano da 12 a 14.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

3. **L'interlinea dei titoli grandi.** *Raccomandazione:* 1,05 per i titoli da
   44 e 56 px; 1,2 resta per gli altri.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

4. **Il peso 800.** *Raccomandazione:* sì, solo per titoli da 24 px in su e per
   i numeri, come nei mock (I-29, decisione 4).
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

5. **Lo spazio da 64 px.** *Raccomandazione:* sì; i 106 px del mock tornano
   nella scala.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

6. **I bersagli nel primo schermo al computer.** Il percorso conta come
   navigazione, come la barra; faro e boa contano. *Raccomandazione:* sì; il
   conto torna a quattro.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

7. **D-14 riscritta**, «l'azione principale è la cosa **interattiva** più
   evidente», e il fondo pieno misurato contro la superficie dietro.
   *Raccomandazione:* sì (I-29, decisione 3); senza, la U con la pagina scura
   non passa.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

8. **I colori.** I valori della Regata nel contratto (azione `#0A4F6E`, errore
   `#B3261E`, giusto `#12663A`); l'ambra degli avvisi `#765000` resta; i ruoli
   nuovi «segno» (arancio delle boe, solo disegni e segni) e «terra»; i numeri
   in inchiostro e non nel blu delle azioni; la sottolineatura dei link del
   colore del link. E la terra: il beige `#F2E6CF` della U anche nella Regata,
   al posto di `#FFF0E5`? *Raccomandazione:* sì a tutto; un beige solo,
   `#F2E6CF`.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

9. **Da quale larghezza vale la U.** Misurato: regge da 1.200 px se la carta è
   ancorata alla costa, non regge a 900 e a 1.024. *Raccomandazione:* la U da
   **1.200 px di larghezza e 680 di altezza**; sotto, la Home della Regata, che
   ha già la sua forma larga (`g-regata/schermate/home-1280.png`).
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato. Soglia: 1.200 px di larghezza e 680 di altezza.*

10. **Le luci che lampeggiano** (WCAG 2.2.2). (a) Lampeggiano all'apertura, con
    «Ferma le luci» nella scheda; (b) accese ferme, lampeggiano solo dopo il
    tocco. *Raccomandazione:* (a), che tiene la carta viva come l'autore l'ha
    scelta.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato. Scelta (a): le luci lampeggiano, con «Ferma le luci» nella scheda.*

11. **Gli stati della Home al computer.** H1 e HA nel primo pannello, sotto la
    prova; «Come funziona» sotto in tutti gli stati. *Raccomandazione:* sì,
    come nel §5.4; ChatGPT ne mostra le schermate prima della merge.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

12. **La tappa 10.** «Con l'account, la rotta resta» descrive un vantaggio
    senza un pulsante, ma «la rotta» richiama il Percorso. *Raccomandazione:*
    resta come descrizione, senza pulsante, con un titolo che non promette il
    Percorso, per esempio «Con l'account, le risposte restano».
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato. Titolo: «Con l'account, le risposte restano».*

13. **Il percorso.** Il triangolo resta di 13 px; il bersaglio intorno di 44 px
    a passo 52; il contorno in `--ink-3` e il pieno in arancio scuro `--rotta`
    al posto dell'arancio delle boe, che resta come bagliore.
    *Raccomandazione:* sì; è più leggibile e il filo resta fine.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

14. **Il banco legge i pixel** per il contrasto del testo sopra la carta, con
    un lettore di PNG nel banco. *Raccomandazione:* sì, solo per questo.
   *Deciso dall'autore il 25 ottobre 2026, come raccomandato.*

15. **La struttura dei mock.** Allenati con «Allenamento consigliato» in testa e
    le altre intenzioni in righe; il titolo del riepilogo «Hai risposto a N
    domande su M». *Raccomandazione:* il giro B veste le schermate com'è oggi la
    loro struttura; Allenati e il riepilogo nuovi sono decisioni del giro 3, con
    i controlli che li tengono fermi (R-NAV-04, F-01) aggiornati prima.
   *Deciso dall'autore il 26 ottobre 2026, come raccomandato: il giro B veste le schermate com'è oggi la loro struttura; Allenati e il riepilogo nuovi sono del giro 3.*
16. **Le icone nella barra in basso** (I-29, decisione 8). *Raccomandazione:*
    sì, nel giro A, con le parole che restano.
   *Deciso dall'autore il 26 ottobre 2026, come raccomandato: le icone nella barra in basso nel giro A, con le parole che restano.*
17. **Il giro 3, le parole**, riparte dopo il giro A, dentro la Regata.
    *Raccomandazione:* sì; le tappe nuove sono già parole da rivedere.
   *Deciso dall'autore il 26 ottobre 2026, come raccomandato: il giro 3 riparte dopo il giro A, dentro la Regata.*
18. **L'ordine.** Giro A, poi giro B dalla domanda e dal riepilogo.
    *Raccomandazione:* sì.
   *Deciso dall'autore il 26 ottobre 2026, come raccomandato: giro A, poi giro B dalla domanda e dal riepilogo.*

---

## 13. Che cosa non si copre

- **La bellezza.** I controlli tengono ferme le garanzie, non il volto: quello
  lo approva l'autore guardando le schermate.
- **Un iPad vero e Safari**, dove la U vale in orizzontale (1.024 px, se la
  soglia scende) e lo strato fisso non è provato (Q-PROVE).
- **Il gesto vero e un lettore di schermo vero** sul percorso e sulle luci
  (R-RIF-14, R-RIF-15).
- **Le prestazioni** dello strato fisso e del velo che sfuma mentre si scorre.
- **Le persone.** Che la discesa in undici pannelli si capisca, e che chi
  arriva non si fermi alla carta, nessun controllo lo dice.

---

## Registro

- **25 ottobre 2026 — prima stesura.** Dopo la scelta della U e della Regata.
  Lette le sorgenti dei mock, la pagina, `SCALA_CSS`, T-12 e T-13; misurata la
  Home U in Chrome headless a otto dimensioni, con il contrasto sui pixel. Venti
  conflitti con i loro numeri; un errore già nel mock (i Segnali sono 53, non
  27); il contratto di T-15; diciotto decisioni per l'autore.

- **25 ottobre 2026 — le decisioni 1–14.** L'autore le ha prese tutte come
  raccomandato, presentate a gruppi nella sessione del progetto. Segnate nel
  §12; il titolo della tappa 10 nel §10; la soglia in T-15:soglia; il prompt
  proposto per A-controlli nel §11.1.

- **25 ottobre 2026 — i controlli del giro A (P-97).** `SCALA_CSS` della Regata,
  T-12 e T-13 come nel §6.2–§6.3, T-15 nuovo, `movimento()` e il lettore di PNG
  nel banco, la Home U nella pagina di riferimento, R-VOLTO-01…11 nella
  specifica, i rossi della pagina vera dichiarati. La nota di consegna, con gli
  agganci per P-98, nel §11.1.
