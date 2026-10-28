# Le procedure di disegno — analizzare e correggere mock e pagine

**Data:** 25 ottobre 2026.
**Che cos'è:** come si usano tre skill di disegno — **impeccable**, **taste** e
**UI UX Pro Max** — per analizzare e poi correggere i mock in
`docs/prototipi/` e le pagine di `site/`, e ogni pagina web che faremo. Dice
che cosa fa ciascuna skill, che cosa abbiamo misurato provandola su questo
sito, come si trattano gli anti-pattern, e i passi delle due procedure.
**Penna:** una sola alla volta, come `specifica.md` e `filosofia.md`: è un
documento di regole, e due mani che riscrivono le regole producono due metodi.
Chi propone un cambio lo fa dal suo worktree; le proposte accolte le riporta qui
chi fa la merge. Fino al 28 ottobre 2026 il file stava nel territorio `motore`
di `territori.yaml`, che l'ADR-007 ha tolto.

**Il rapporto con le regole che ci sono già.** Le regole D-01…D-35 (scheda
I-27 di `docs/idee-dopo-gli-account.md`), i giri di
`docs/regole-disegno-progetto.md` e i requisiti R-RIF del §9.11 della
specifica restano il metro ufficiale. Le skill non li sostituiscono: portano
il giudizio che i nostri controlli non hanno — identità, gerarchia, la pagina
«corretta ma senza vita» che l'autore ha visto il 24 ottobre dopo tre giri — e
un secondo strumento di misura. Quello che trovano è un'ipotesi finché qualcuno
non l'ha guardata; quello che deve restare vero per sempre diventa una regola
con il suo controllo, con il metodo del §3 di `regole-disegno-progetto.md`.

---

## 1. Le tre skill, e il mestiere di ciascuna

Versioni lette il 25 ottobre 2026, nei loro repository (cloni in
`~/.claude/plugins/marketplaces/`): impeccable 4.7.1 (`pbakaus/impeccable`,
commit `9368675`), taste 2.1.5 (`Leonxlnx/taste-skill`, `12af471`), UI UX Pro
Max 2.15.0 (`nextlevelbuilder/ui-ux-pro-max-skill`, `d14efff`). Sono
installate per l'utente, in tutte le sessioni Claude.

| | Che cos'è | Che cosa ci serve | Che cosa non si usa |
|---|---|---|---|
| **impeccable** | Un metodo da direttore artistico, con una ventina di comandi e un rilevatore di 62 regole | `critique` (il giudizio, §5 passo 3), `audit` (cinque misure tecniche, su 20), `detect` (il rilevatore, sul file e sull'indirizzo); per correggere `polish`, `layout`, `typeset`, `clarify`, `distill`, `quieter`, `harden`, `adapt` | Il tiro dei «mondi» visivi e `overdrive`, `bolder`, `delight` sulle pagine del sito: inventano, non correggono. Si usano solo in un mock dichiarato come esplorazione |
| **taste** | Lo strumento di misura, con una casa di regole severe | `lint.mjs` sul sorgente; `inspect.mjs` in Chrome, alle larghezze scelte, con le fotografie e un `report.json`; le domande per giudicare le fotografie (`references/critique.md`, e §2.7 di `references/app-screens.md`) | Le regole da sito vetrina — almeno otto elementi in movimento, almeno quattro fotografie vere: valgono per una pagina da scorrere, non per un runner di quiz; e `draw.mjs` per scegliere una direzione |
| **UI UX Pro Max** | Un archivio da consultare, che funziona senza rete | `search.py --domain ux` (119 regole, con il criterio WCAG e la gravità), `--domain typography`, `--domain color`; la lista di `references/pro-rules.md` prima della consegna | Il generatore di sistema di design (`--design-system`) e soprattutto `--persist`: vedi il §2 |

**Dove sono, su questa macchina.** I percorsi cambiano con la versione, quindi
non si scrivono a mano: si leggono dal registro dei plugin.

```bash
python3 -c "import json,os;d=json.load(open(os.path.expanduser('~/.claude/plugins/installed_plugins.json')))['plugins'];[print(k,'→',d[k][0]['installPath']) for k in ('impeccable@impeccable','taste-skill@taste-skill','ui-ux-pro-max@ui-ux-pro-max-skill')]"
```

Da lì: `IMP=<impeccable>/skills/impeccable/scripts/impeccable`,
`TASTE=<taste>/skills/taste-skill`,
`UIUX=<ui-ux-pro-max>/.claude/skills/ui-ux-pro-max`.

**Che cosa esce dalla macchina.** `search.py` di UI UX Pro Max non usa la rete.
Il rilevatore di impeccable e gli script di misura di taste neppure; il
lanciatore di impeccable scarica il suo eseguibile una volta. Usano la rete il
tiro dei mondi di impeccable (`impeccable.style`) e `assets.mjs` di taste
(archivi pubblici di immagini): nessuno dei due serve alle procedure di
questo documento. Nelle query non va niente di privato.

## 2. Che cosa abbiamo misurato provandole, il 25 ottobre 2026

Sulla Home vera, solo in lettura, da una cartella temporanea fuori dal repo.

1. **Aperta come file, taste misura una pagina rotta.** `inspect.mjs` su
   `site/index.html` serve la cartella con un suo server, e la pagina mostra in
   testa «Questa destinazione non è disponibile»: per `navigazioneSito()`
   `/index.html` non è un indirizzo del sito. La misura era plausibile e
   sbagliata. Puntato a `http://localhost:8787/`, servito da
   `strumenti/serve.py`, il messaggio non c'è. **Le pagine del sito si
   misurano sempre dall'indirizzo, mai dal file.**
2. **Il rilevatore di impeccable sul file vede poco.** Su una copia della Home
   fuori da `site/` ha trovato solo un'immagine rotta, perché i percorsi
   relativi non portano più a niente. Sull'indirizzo, con
   `--viewport 375x812`, ha trovato un titolo sbilanciato e una parola sola
   sull'ultima riga; a `1280x800` niente. **Il rilevatore si fa girare
   sull'indirizzo, alle due larghezze.**
3. **taste trova cose vere.** Il lint: un'emoji ⚠ usata come icona
   (`site/index.html:2401`, un FAIL), due regole `.eyebrow`, due sfocature
   dietro i pannelli, dieci ombre su elementi fermi, 37 lineette lunghe.
   L'ispettore: il titolo della Home su tre righe a 375 px (FAIL), una fascia
   vuota di 56 px nelle schede Esame e Progressi a 1280 px.
4. **taste ha regole che contraddicono le nostre.** Vuole il titolo di una
   schermata d'app fra 18 e 32 px; noi abbiamo deciso 40 px per la Home sopra i
   900 px (R-RIF-23, decisione C). È il caso tipico del §3.
5. **Il generatore di UI UX Pro Max non va bene per noi.** Per «exam
   preparation quiz study app mobile» ha proposto la *claymorphism*, il viola
   `#7C3AED`, Varela Round e Nunito Sans caricati da Google Fonts, cioè un
   carattere da altri host che `test_nessuna_risorsa_di_terzi` farebbe rosso,
   e un viola che tutte e due le altre skill segnano come il colore di
   default dei modelli. La sessione di I-29 l'aveva già scartato.
6. **Le misure dello schermo non coincidono.** taste fotografa a larghezze
   fisse (`--widths`), con un'altezza sua; i nostri controlli guardano 375×812,
   375×667 e 1280×800. Che cosa sta nel primo schermo lo dicono i nostri banchi
   (T-10…T-13) o le nostre fotografie, non quelle di taste.

## 3. La regola sugli anti-pattern

Un anti-pattern è un elenco di cose da non fare, con il loro perché. Ce ne sono
quattro famiglie, e non si trattano allo stesso modo.

| Famiglia | Da dove | Che cos'è | Come si tratta |
|---|---|---|---|
| **Difetti misurabili** | le 31 regole «quality» del rilevatore di impeccable; i FAIL di misura di taste; le regole WCAG di UI UX Pro Max | contrasto basso, testo che sborda o è coperto, testo minuscolo, righe lunghe, livelli di titolo saltati, immagini rotte, errori di script | **Si correggono**, oppure diventano una regola D-xx con il suo controllo. Coincidono in gran parte con R-RIF e con la scala del giro 2 |
| **Mode delle pagine generate** | le 31 regole «slop» di impeccable; il registro datato di taste (`references/tells.md`) e le sue regole di casa | testo sfumato, viola, occhielli, numerini 01/02/03, ombre luminose, fondo crema, schede tutte uguali, lineette lunghe | **Ipotesi.** O si toglie, o si tiene con un motivo scritto nel registro qui sotto. Mai ignorata in silenzio, mai obbedita per riflesso: taste stesso dice che alcune le vieta per gusto del suo autore, contro la moda dei siti premiati |
| **«Avoid» generiche** | la colonna degli anti-pattern di UI UX Pro Max | «stile incoerente», «contrasto scarso» | **Non decidono niente** da sole: servono a trovare la regola WCAG da citare |
| **Dark pattern** | il catalogo di Intent (agente `intent:vigil`, skill `intent:evaluate`) | interfacce che ingannano: urgenza finta, rinunce nascoste, il pulsante che conferma più grande di quello che rinuncia | **Si controllano sempre** su ogni schermata che chiede una scelta — l'invito a registrarsi, «Continua senza account», l'uscita, l'azzeramento. Non è gusto: è la promessa di `filosofia.md`, «un imbuto che c'è non si usa contro chi ci passa» |

**La via d'uscita è delle skill stesse.** impeccable: «the brief wins» — un
colore, un'epoca, un materiale voluti dal brief valgono anche contro un
avviso. taste: se il soggetto ha colori suoi, si prendono quelli. Un'eccezione
si difende quindi con il soggetto — la carta nautica, il decreto, chi studia —
e non con il gusto di chi disegna.

### Il registro dei disaccordi

Ogni regola di una skill che non adottiamo, o che adottiamo con un'eccezione,
ha una riga qui, con la data e chi ha deciso. Il rilevatore di impeccable e il
lint di taste le possono ignorare con le loro configurazioni
(`impeccable hooks ignore-rule`, `taste-skill-ignore` nel sorgente, `--allow`
nell'ispettore) **solo dopo** che la riga c'è.

| Regola della skill | Che cosa dice | Da noi | Stato |
|---|---|---|---|
| taste `app-title-size` | il titolo di una schermata d'app fra 18 e 32 px | 40 px per il titolo della Home sopra i 900 px (R-RIF-23) | **Non adottata**, 24 ottobre 2026, decisione C |
| taste: movimento minimo, quattro fotografie | almeno otto elementi in movimento, almeno quattro fotografie vere | il sito è fatto di schermate d'app; taste stesso esclude le schermate d'app dal minimo di movimento | **Non si applica**, salvo una pagina vetrina dichiarata tale |
| impeccable `cream-palette`, taste «assistant palette» | il fondo crema o beige è la superficie «di buon gusto» scelta per riflesso | la direzione scelta il 25 ottobre (`docs/volto-progetto.md`) usa il beige `#F2E6CF` come la terra delle carte nautiche, su un tratto di costa della Home al computer, non come fondo della pagina | **Eccezione motivata dal soggetto**, se il rilevatore la segnala: la terra delle carte è beige. Il fondo della pagina resta fuori dalla regola, e un fondo crema su tutta la pagina andrebbe deciso di nuovo |
| impeccable `kicker-above-heading`, taste «no eyebrows» | niente occhiello sopra un titolo; per impeccable nessun brief lo giustifica | `.eyebrow` nella Home vera | **Da decidere**: tutte e due le skill lo vietano, e nessuna nostra regola lo difende |
| impeccable `em-dash-overuse`, taste `em-dash` | lineette lunghe a saturazione sono una cadenza da modello | la prosa italiana del progetto ne usa molte; 37 nella Home | **Da decidere**: nei testi dell'interfaccia, non nei documenti |
| taste: niente ombre a riposo, niente sfocature | le ombre solo su ciò che galleggia davvero | dieci ombre e due sfocature nella Home vera | **Da decidere** con la direzione |
| taste `headline-lines` | un titolo al massimo su due righe, a ogni larghezza | nessuna regola nostra; il titolo della Home va su tre righe a 375 px | **Da decidere**: candidata a diventare una regola D-xx |

## 4. Le regole fisse, per tutte e due le procedure

- **Il bersaglio si serve come lo serve l'host.** Le pagine del sito da
  `python3 strumenti/serve.py` (in una sessione Claude, `preview_start` con
  `sito`, porta 8787; il worktree dell'interfaccia con `sito-ui`, 8788). Un mock
  autoconsistente si può aprire dal file, ma la prima fotografia si guarda
  sempre, per vedere che non mostri uno stato rotto.
- **Le misure dello schermo sono tre**: 375×812, 375×667, 1280×800. taste con
  `--widths 1280,768,375`; impeccable con `--viewport 375x812` e `1280x800`.
- **La modalità si dice per superficie, non per prodotto** (impeccable): il
  runner, le preparazioni, Progressi e il Profilo sono *Operate*; le pagine
  legali *Read*; solo la Home senza risposte (H0) ha una parte *Persuade*. In
  taste tutto si misura con `--app`, salvo una pagina vetrina dichiarata.
- **Gli stati si nominano prima**: H0, H1 e HA della Home; il runner prima e
  dopo una risposta, giusta e sbagliata; il riepilogo; Accedi aperto. Una
  misura senza lo stato non si confronta con la successiva.
- **I file di lavoro restano fuori dal repo.** `.impeccable/` e `.taste-skill/`
  sono nel `.gitignore`; gli script si lanciano da una cartella temporanea,
  con `--out` verso di lei. Nel repo entra soltanto il README di analisi (§7),
  con le fotografie scelte e i punteggi trascritti.
- **UI UX Pro Max non scrive mai nel repo**: niente `--persist`, niente
  `--force`. I suoi script si lanciano con `python3`, senza `-I`, perché
  importano i moduli accanto.
- **Una penna per cartella.** L'analisi è in sola lettura e può girare accanto
  a chi lavora; la correzione la fa soltanto chi ha la penna su quella
  cartella: il mock la sessione che l'ha fatto, `site/index.html` la sessione a cui la coda lo assegna.
- **Niente risorse da altri host, WCAG AA, niente gamification che punisce, i
  difetti dichiarati**: i vincoli di prodotto valgono anche contro una skill.
- **Il controllo automatico di impeccable.** Dopo ogni modifica a un file
  d'interfaccia, in ogni sessione Claude, impeccable fa girare il suo
  rilevatore e lo dice nel contesto; alla fine della sessione ne fa un giro
  completo. I suoi messaggi sono indizi da verificare, come ogni altro
  risultato delle skill.

## 5. Procedura A — l'analisi

In sola lettura, su un mock o su una pagina. Il risultato è un README di
analisi (§7) e le decisioni da chiedere all'autore.

**0. Preparare.** Scrivere in cima al README: il bersaglio (cartella del mock,
o indirizzo e commit del sito), la modalità di ogni superficie, gli stati, le
tre misure dello schermo, e la cartella temporanea dei risultati.

**1. Misurare.** Dalla cartella temporanea:

```bash
node "$TASTE/scripts/lint.mjs" --app <file o cartella>
node "$TASTE/scripts/inspect.mjs" --app <indirizzo> --out ./taste --widths 1280,768,375
"$IMP" detect --json --viewport 375x812 <indirizzo> > imp-375.json
"$IMP" detect --json --viewport 1280x800 <indirizzo> > imp-1280.json
```

Per il sito si aggiungono i nostri controlli che riguardano le schermate
analizzate — almeno T-10…T-13 del banco del client, con `RG_PAGINA` o
`RG_SITO` se si misura una copia — che restano il metro ufficiale. Per un mock,
le misure che le sessioni dei mock fanno già (sbordamento, un solo principale,
«Avanti» raggiungibile, la figura prima di rispondere, l'avviso accanto a
«Inizia», contrasti AA).

**2. Guardare.** Aprire **ogni** fotografia elencata dall'ispettore, a ogni
larghezza, prima di dire qualcosa sulla qualità.

**3. Giudicare alla cieca.** `/impeccable critique <bersaglio>`, che fa girare
due agenti separati: uno giudica il disegno senza vedere il rilevatore, l'altro
fa girare il rilevatore. Ne escono i punteggi sulle 10 regole di Nielsen, il
carico cognitivo, le priorità P0–P3, le persone che si bloccano. Le persone del
§1 della specifica (chi comincia da zero, chi è in formazione, chi ripassa
sotto esame) si aggiungono a quelle di impeccable. Accanto, le sette domande
di taste per una schermata d'app (§2.7 di `references/app-screens.md`), o i
quattordici passaggi per una pagina (`references/critique.md`).
Un giudizio fatto in un contesto solo porta in testa la riga
`⚠️ DEGRADED` di impeccable, e il README lo dice.

**4. Il controllo dei dark pattern.** Su ogni schermata che chiede una scelta,
il catalogo di Intent (`intent:vigil`), con la filosofia accanto.

**5. Citare lo standard.** Per ogni difetto, una ricerca mirata:

```bash
python3 "$UIUX/scripts/search.py" "<l'esito osservabile, 2-5 parole>" --domain ux -n 3
```

Un esito alla volta («focus not obscured sticky», non «accessibilità»).
Se due ricerche non trovano niente, si dice, e non si inventa la regola.

**6. Ordinare.** Una tabella, una riga per difetto:

| Difetto | Chi l'ha trovato | Regola D-xx o R-RIF già esistente | Standard | Contraddice una nostra regola? | Gravità | Che cosa farne |
|---|---|---|---|---|---|---|

«Chi l'ha trovato» è *misura* (taste, impeccable detect, i nostri banchi),
*giudizio* (critique, domande di taste) o *standard*. «Che cosa farne» è una di
tre: **correggere**; **diventa una regola** con il suo controllo; **scartato**,
con il motivo nel registro del §3. Gravità come impeccable: P0 blocca un
compito, P1 un problema serio o una violazione WCAG AA, P2 un fastidio con una
via d'uscita, P3 una rifinitura.

## 6. Procedura B — la correzione

**Un mock** (`docs/prototipi/`). La corregge chi ha la penna sulla sua
cartella, difetto per difetto, con il comando di impeccable adatto:
`layout` per spazi e gerarchia, `typeset` per la tipografia, `clarify` per i
testi, `distill` per togliere, `quieter` per abbassare il volume, `adapt` per
le larghezze, `harden` per gli stati vuoti, d'errore e lunghi, `polish` per la
passata finale. È rifinitura, non un nuovo disegno: se è il concetto a non
reggere, si dice e si torna all'autore. Poi si rifà il passo 1 della procedura
A: zero FAIL di taste, oppure un'eccezione con la sua riga nel registro; si
riguardano le fotografie. **Tre giri al massimo**, come vuole taste. Il README
di analisi si aggiorna con il prima e il dopo.

**Il sito** (`site/`). Il metodo dei giri, che non cambia:

1. un difetto che deve restare corretto per sempre diventa prima, su `main`,
   un contratto e un controllo che lo vede rosso (Claude), con le sue rotture;
2. una sessione corregge la pagina nel suo worktree, con gli stessi comandi di
   impeccable, e toglie le righe dei difetti dichiarati nello stesso commit;
3. la merge passa dal controllo sul diff del ramo e dalle fotografie, e la
   regia allinea la specifica.

Un difetto che non chiede un controllo — un testo, un'ombra di troppo — va
nel prompt della pagina con la sua riga del README di analisi.

## 7. Il README di analisi

Accanto al mock (`docs/prototipi/<cartella>/analisi-AAAA-MM-GG.md`) o in una
cartella di collaudo (`docs/collaudo-<sessione>/`), con:

1. il bersaglio, il commit, la modalità, gli stati, le misure dello schermo;
2. le versioni delle tre skill e il modo del giudizio (due agenti, o
   `DEGRADED` con il motivo);
3. i punteggi: Nielsen su 40 (o sul massimo applicabile), `audit` su 20 se
   fatto, FAIL e WARN di taste per larghezza; e l'andamento rispetto
   all'analisi precedente, trascritto a mano;
4. le fotografie scelte, citate una per una con che cosa mostrano;
5. la tabella del passo 6;
6. le righe nuove per il registro del §3;
7. **che cosa non è stato controllato**: nessuna persona, Safari, il gesto
   vero, gli stati non misurati;
8. le decisioni da chiedere all'autore.

## 8. `PRODUCT.md` e `DESIGN.md`

impeccable legge due file alla radice del repo: `PRODUCT.md`, i fatti di
prodotto (chi lo usa, in quale situazione, per fare che cosa, i vincoli), e
`DESIGN.md`, il sistema visivo.

- **`PRODUCT.md` è scritto con l'autore**, con l'intervista di
  `impeccable init`, e contiene solo fatti di prodotto: impeccable stesso vieta
  di metterci colori, caratteri o stile. Sta nel territorio `motore`, una penna
  sola su `main`.
- **Se `PRODUCT.md` e `docs/specifica.md` dicono cose diverse, vale la
  specifica.** Il file lo dice in testa. È il rischio delle tre versioni
  divergenti del §0 della specifica, e l'unica difesa è che la specifica resti
  la fonte e `PRODUCT.md` la sua sintesi per le skill. Ogni cambio del file ha
  una riga nel suo registro, e una modifica alla specifica che tocca il §1 o il
  §2 si porta anche lì nello stesso commit.
- **`DESIGN.md` si scrive dopo** che l'autore ha scelto la direzione del
  ridisegno, con `impeccable document`, dal mock o dalla pagina scelti: registra
  un sistema che esiste, non uno che si vorrebbe. Fino ad allora non c'è, e
  impeccable lavora sull'esistente.

## 9. Che cosa queste procedure non coprono

- **Le persone.** Ogni giudizio è di un modello: le prove con persone vere
  restano la riga 18 della coda (Q-PROVE).
- **Safari, il telefono vero e il gesto vero.** Gli strumenti guidano Chrome
  headless.
- **I pregiudizi delle skill.** taste ha studiato 247 siti premiati e 23
  schermate d'app, tutte da computer e nessuna da telefono; impeccable e UI UX
  Pro Max sono scritti per prodotti generici. Nessuna sa che cosa sia un
  quesito ministeriale, un oscurato o la prova eliminatoria del carteggio: lo
  sanno la specifica e chi studia.
- **La bellezza.** Le misure dicono che niente di vietato è stato trovato; il
  giudizio dice che cosa non funziona. Che una pagina piaccia lo dice l'autore,
  sulle fotografie.

## 10. La prima applicazione: il mock U

Deciso dall'autore il 25 ottobre 2026: la procedura si prova per prima sul
mock U, «Terra beige» (`docs/prototipi/redesign-2026-10-claude/u-terra-beige/`).
Lo stesso giorno la U è diventata la direzione del ridisegno — la Home al
computer, con lo stile della Regata per tutto il resto — ed è fusa in `main`
con il progetto `docs/volto-progetto.md` (merge `8e5c9c1`). Tre cose da sapere:

- **la U è disegnata solo al computer**; al telefono le schermate sono quelle
  della Regata (`g-regata/`), e l'analisi le prende tutte e due, ognuna alle
  misure dove esiste;
- **i controlli del giro A li scrive P-97**, nel suo worktree: l'analisi non
  scrive lì. Quello che trova va nel §12 di `volto-progetto.md`, fra le
  decisioni del giro B, o nel prompt di P-98 per ChatGPT, attraverso la regia;
- **il beige della terra** ha già la sua riga nel registro del §3.

---

## Registro

- **25 ottobre 2026 — prima stesura.** Nasce da una sessione di studio delle
  tre skill: la documentazione letta nei loro repository, e una prova in sola
  lettura sulla Home vera, che ha trovato le cinque cose del §2. Le scelte
  dell'autore dello stesso giorno: la procedura in questo documento, con un
  richiamo nella skill del progetto; un `PRODUCT.md` completo scritto con lui;
  i file di lavoro delle skill fuori dal repo; la prima prova sul mock U.
- **26 ottobre 2026 — il `PRODUCT.md`.** Scritto con l'autore in due giri
  dell'intervista di `impeccable init`: nessuna persona vince sempre, e la Home
  favorisce chi comincia da zero; il successo è l'esame superato, la
  registrazione scelta e il passaparola; fermi il nome e il marchio, non la
  voce; le scuole come chi consiglia, con un richiamo proposto in I-20.
