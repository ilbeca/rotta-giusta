# Pilota dei concetti — la voce dei fanali e del sistema IALA

**Data:** 14 novembre 2026. **Che cos'è:** una prova su una voce sola, prima di
decidere se etichettare tutta la banca con dei «concetti» più fini dei temi e
delle voci ministeriali. L'idea è I-32 in `docs/idee-dopo-gli-account.md`.
Questo pilota non la decide e non tocca il sito: `site/`, il motore e la
specifica non sono stati toccati.

**La domanda:** i concetti separano davvero gli errori, o li spalmano come la
voce?

**La risposta, in breve:** con l'archivio che c'è, **non si può dire**. Sui 120
quesiti della voce l'archivio ha **zero errori all'ultima risposta** e **13
errori alla prima**: divisi in 19 concetti fanno da 0 a 2 errori ciascuno, e
la loro distribuzione è quella del caso (p = 0,93). L'unico segnale debole è
uno di forza, non di lacuna: **zero errori alla prima risposta su 26 quesiti
delle cardinali**. I concetti servono lo stesso, ma per altro: vedi la
raccomandazione in fondo.

I file: [`concetti-fanali.json`](concetti-fanali.json), con i concetti, la mappa
quesito → concetti e la rilettura.

---

## 1. La voce

«I principali fanali luminosi e il sistema IALA», progressivi 1.5.3-1 …
1.5.3-120, cioè `base-727` … `base-846`: la voce più grande della banca, 120
quesiti, 40 con figura, 2 oscurati (`base-730`, `base-822`). Tre cose che la
voce nasconde, e che i concetti fanno vedere:

- **Dentro ci sono 9 quesiti di navigazione fluviale** (1.5.3-112 … 120:
  segnali di chiamata e rimando, precedenza controcorrente, la curva a gomito,
  il faro anabbagliante fra le dotazioni). Con i fanali e il sistema IALA non
  c'entrano: chi li sbaglia oggi vede «sei debole sui fanali».
- **11 coppie di quesiti hanno lo stesso testo** e cambiano solo nei
  distrattori (`base-727`/`812`, `728`/`813` … `737`/`822`). Per una misura
  contano due volte lo stesso concetto.
- **Due famiglie di sapere molto diverse convivono**: le luci (portate, ritmi,
  sigle, settori) e i segnali IALA (forme, colori, miragli). Si studiano in
  capitoli diversi del manuale.

## 2. Metodo

1. **Lettura.** Tutti i 120 quesiti, con le risposte e la risposta esatta,
   presi da `site/dati/quiz.json`; delle 27 figure diverse ne ho guardate 10
   (le cardinali, le speciali, i simboli con la sigla), quelle in cui il testo
   da solo non diceva che cosa serve sapere.
2. **Tassonomia.** 19 concetti, ognuno con id, nome, parole chiave da cercare
   nell'indice di un manuale, e una riga su che cosa copre. Ogni concetto ha
   almeno 3 quesiti. Le parole chiave sono scritte come le troverebbe chi ha un
   manuale da patente, non come le scrive il decreto.
3. **Etichette.** Ogni quesito ha 1 o 2 concetti (97 uno, 23 due; il limite era
   3 e non è servito): 143 tag. Il secondo concetto si mette solo quando il
   quesito non si risolve senza quel sapere — un simbolo da leggere sulla
   carta *e* il segnale che rappresenta.
4. **Rilettura.** Un campione di 30 quesiti estratto a caso
   (`random.seed(32)`, nel JSON), riletto contro le etichette. **2 tag cambiati
   su 30 quesiti**, tutti e due aggiunti: `simboli_carta` a `base-739` (la boa a
   campana) e a `base-743` (il racon con corno), dove la risposta richiede di
   riconoscere il simbolo sulla carta prima ancora di sapere che cos'è il
   dispositivo. Nessun tag tolto. È una rilettura dello stesso lettore che ha
   scritto i tag: vedi §5.
5. **Misura.** L'archivio vero delle risposte del progetto di preparazione
   dell'autore, letto con il suo permesso **sulla macchina dove sta**, in sola
   lettura, da uno script che restituisce soltanto conteggi per concetto, per
   gruppo e per voce. Nessuna riga dell'archivio è arrivata nel repo né su
   questo computer.

## 3. I concetti

| id | concetto | quesiti |
|---|---|---|
| `portate` | Le tre portate di un faro | 12 |
| `fase_periodo` | Fase, periodo e caratteristica | 7 |
| `tipi_luce` | Tipi di luce e loro abbreviazioni | 13 |
| `sigla_completa` | Leggere la sigla completa di un segnalamento | 13 |
| `settori` | Settori di luce | 3 |
| `tipi_segnalamento` | Fari, fanali, boe, mede e gavitelli | 9 |
| `radar_nebbia` | Riflettore radar, racon e segnali da nebbia | 5 |
| `simboli_carta` | Simboli dei segnalamenti sulla carta nautica | 15 |
| `iala_sistema` | Il sistema AISM-IALA in generale | 4 |
| `laterali` | Segnali laterali, regione A | 5 |
| `cardinali_principio` | Cardinali: il principio | 4 |
| `cardinali_miragli` | Cardinali: riconoscerle dal miraglio | 14 |
| `cardinali_luci` | Cardinali: le luci | 6 |
| `cardinali_colori` | Cardinali: i colori del corpo | 3 |
| `pericolo_isolato` | Segnale di pericolo isolato | 6 |
| `acque_sicure` | Segnale di acque sicure | 3 |
| `speciali` | Segnali speciali | 12 |
| `fluviale_segnali` | Navigazione fluviale: i segnali | 6 |
| `fluviale_regole` | Navigazione fluviale: le regole | 3 |

Parole chiave e descrizioni sono nel JSON.

## 4. Numeri

**L'archivio:** 2.100 risposte, 13 agosto – 2 settembre 2026, tutti i 1.722
quesiti visti almeno una volta. Della voce: 120 quesiti visti su 120, 143
risposte.

**Errori all'ultima risposta: zero, in tutta la voce.** Era la misura chiesta,
ed è vuota per una ragione buona: chi ha preparato l'esame ha ripreso ogni
errore fino alla risposta giusta. In tutta la banca gli errori all'ultima
risposta sono 20. Al suo posto si usa l'**errore alla prima risposta**, che non
cala ripassando e dice dove il sapere mancava al primo incontro. È una
sostituzione, e si dichiara.

**La voce nella banca, alla prima risposta:** 13 errori su 120, cioè **10,8 %**,
contro il 12,0 % della banca (206 su 1.722). È la 22ª voce su 47 per tasso
d'errore: in mezzo, non una lacuna.

**Per concetto, alla prima risposta** (media della voce 10,8 %):

| concetto | quesiti | visti | errori | tasso |
|---|---|---|---|---|
| `fluviale_regole` | 3 | 3 | 1 | 33 % |
| `fase_periodo` | 7 | 7 | 2 | 29 % |
| `laterali` | 5 | 5 | 1 | 20 % |
| `radar_nebbia` | 5 | 5 | 1 | 20 % |
| `portate` | 12 | 12 | 2 | 17 % |
| `pericolo_isolato` | 6 | 6 | 1 | 17 % |
| `fluviale_segnali` | 6 | 6 | 1 | 17 % |
| `tipi_luce` | 13 | 13 | 2 | 15 % |
| `tipi_segnalamento` | 9 | 9 | 1 | 11 % |
| `sigla_completa` | 13 | 13 | 1 | 8 % |
| `speciali` | 12 | 12 | 1 | 8 % |
| `simboli_carta` | 15 | 15 | 1 | 7 % |
| `cardinali_miragli` | 14 | 14 | 0 | 0 % |
| `cardinali_luci` | 6 | 6 | 0 | 0 % |
| `cardinali_principio` | 4 | 4 | 0 | 0 % |
| `cardinali_colori` | 3 | 3 | 0 | 0 % |
| `iala_sistema` | 4 | 4 | 0 | 0 % |
| `acque_sicure` | 3 | 3 | 0 | 0 % |
| `settori` | 3 | 3 | 0 | 0 % |

I tassi sono costruiti su 0, 1 o 2 errori: un «33 %» è un errore su tre
quesiti. **Non c'è concentrazione**: lo scarto dei concetti dalla media
(un chi quadro sui 19 concetti, 10,8) è quello che si ottiene distribuendo a
caso gli stessi 13 errori sugli stessi 120 quesiti in 93 casi su 100
(permutazione, 20.000 giri).

**Per gruppo di concetti**, alla prima risposta — la probabilità è quella di
ottenere un conteggio così estremo pescando a caso dalla voce lo stesso numero
di quesiti:

| gruppo | quesiti | errori | tasso | un conteggio così, a caso |
|---|---|---|---|---|
| luci e portate (`portate`, `fase_periodo`, `tipi_luce`, `sigla_completa`, `settori`) | 47 | 7 | 15 % | almeno tanti: 19 % |
| segnali IALA (laterali, cardinali, pericolo isolato, acque sicure, speciali, sistema) | 55 | 3 | 5 % | al più tanti: 7 % |
| di cui le quattro cardinali | 26 | 0 | 0 % | al più tanti: 3,6 % |
| oggetti e carta (`tipi_segnalamento`, `radar_nebbia`, `simboli_carta`) | 26 | 2 | 8 % | — |
| navigazione fluviale | 9 | 2 | 22 % | almeno tanti: 25 % |

Le cardinali senza un errore sono l'unico numero sotto il 5 %, ed è uno su
cinque gruppi guardati: con cinque confronti un 3,6 % da solo non basta. E dice
una **forza**, non una lacuna. La direzione — le luci peggio dei segnali — è
plausibile e coerente con quello che si vede nella tabella per concetto, ma
non è dimostrata.

## 5. Che cosa non ho verificato

- **Che i concetti siano giusti.** Li ha scritti e riletti la stessa sessione.
  Nessuna persona li ha letti, e nessun manuale è stato aperto per controllare
  che le parole chiave stiano davvero negli indici. Una seconda lettura
  indipendente — un'altra sessione che etichetta gli stessi 120 quesiti senza
  vedere questi tag, e poi il confronto — è il controllo che manca prima di
  estendere. I 2 cambi su 30 della mia rilettura sono un limite inferiore, non
  una misura dell'errore.
- **Le figure che non ho guardato** (17 su 27): ho etichettato quei quesiti
  dal testo e dalle risposte.
- **Che i concetti separino gli errori.** Non è falsificato, è non misurabile
  con questi dati: una persona, 13 errori alla prima risposta. Per dire se un
  concetto di 10 quesiti sbaglia il doppio della media serve il conto di molte
  persone, o di molte più risposte di una.
- **Un quesito che sembra avere la risposta incompleta**, segnalato e non
  toccato: `base-763` (1.5.3-37) chiede «Oc (3) W 5s» e dà per esatta
  «intermittente bianco, periodo 5 secondi», senza i gruppi di 3. All'esame
  vale il decreto; se merita una nota lo decide l'autore, con la fonte.

## 6. Raccomandazione

**Estendere a tutta la banca: sì, ma per i due usi che non chiedono una
statistica, e non ancora per l'avviso «stai sbagliando sempre questo
concetto».**

- **Sì per «domande dello stesso concetto» e per il rimando allo studio.**
  Funzionano se il tag è giusto, non servono numeri: chi sbaglia un quesito
  sulle portate trova le altre undici, e il nome del concetto con le parole
  da cercare nell'indice. Qui il pilota dice già qualcosa di utile: la voce
  manda insieme la navigazione fluviale e i fanali, le portate e le
  cardinali, e un rimando «studia i fanali» è troppo largo per aprire il
  capitolo giusto.
- **Non ancora per l'avviso sulle lacune.** Con i dati di una persona un
  concetto ha 0, 1 o 2 errori: un avviso costruito lì sarebbe rumore con l'aria
  di una diagnosi, cioè la tessera che mente del §4.3 della specifica. Prima
  serve una soglia dichiarata (per esempio almeno 3 errori aperti nello stesso
  concetto, come `PRIMA_MIN_VISTI` per «X su Y»), e la sua prova sulle risposte
  di più persone.

**Granularità: due livelli.**

- **Concetto, fine come qui** (circa 15–20 per una voce da 120, 3–15 quesiti
  ciascuno): per le domande collegate e per le schede. Più fine di così un
  concetto resta con tre quesiti, e due di questi sono spesso lo stesso testo.
- **Famiglia, grossa** (4–5 per una voce come questa: luci e portate, segnali
  IALA, oggetti e carta, fluviale): per un eventuale avviso. È il livello a cui
  i numeri di questo pilota cominciano ad avere una forma.

**Il costo e il rischio da mettere in conto prima di decidere:** questa voce ha
richiesto una sessione; la banca è circa quattordici volte tanto, e ogni voce
vuole la sua tassonomia. Il rischio è quello detto in I-32 — un tag sbagliato
che dà un consiglio sbagliato con l'aria di essere giusto —, e il suo
controllo è una seconda lettura indipendente per voce, più la revisione
dell'autore sulle schede prima che escano, come per le spiegazioni
(ADR-006).
