# Quali concetti non sai: calcolo locale contro un modello Claude

**Data:** 14 novembre 2026. **Che cos'è:** un esperimento sui 120 quesiti della
voce dei fanali e del sistema IALA, con i 19 concetti del pilota
([`../README.md`](../README.md)). Confronta due modi di dire a chi studia
**quali concetti non sa**, su studenti simulati di cui la risposta giusta è
nota. Non tocca `site/`, il motore, la specifica né i test. L'idea è I-32 in
`docs/idee-dopo-gli-account.md`.

**La domanda:** chi trova meglio le lacune vere, senza inventarne: un calcolo in
JavaScript che gira nella pagina, o un modello Claude che legge un fascicolo?

**La risposta, in breve:**

- **Il modello bayesiano locale è il migliore.** Dà la stessa precisione della
  diagnosi remota più prudente e trova più lacune. Costa zero, risponde
  all'istante e non cambia idea da un giro all'altro.
- **Il conto semplice inventa troppo.** A 80 quesiti metà delle sue
  segnalazioni sono sbagliate, e tre studenti senza lacune su quattro ricevono
  un avviso.
- **I modelli Claude, così come li abbiamo usati, non sono un metodo
  diverso.** Rifanno il conto «almeno 2 errori sul concetto» e ne tolgono una
  parte: non hanno mai segnalato un concetto che quella regola nuda non
  segnalasse già.
  - Tenendo solo le diagnosi a confidenza «alta» raggiungono la precisione del
    bayesiano, ma trovano meno lacune.
  - Sonnet non vale il suo prezzo: costa 13 volte Haiku e non è migliore.
- **Sotto i 20 quesiti nessun metodo serve.** Le lacune non si vedono:
  servono almeno 2 quesiti sul concetto, e a 10 domande quasi nessun concetto
  li ha.

Il budget era di 10 dollari. Le 576 chiamate sono costate **2,66 dollari**,
nessuna è fallita e nessuna è stata rifiutata.

---

## 1. Il banco: studenti simulati

`simulatore.mjs`, seme fisso: rilanciato, dà lo stesso banco.

- Ogni studente ha da **1 a 3 concetti che non sa**, presi a caso fra i 19.
  Quelli del controllo di sanità non ne hanno **nessuno**.
- Risponde a **10, 20, 40 o 80 quesiti** della voce, presi a caso.
- Se un quesito tocca un concetto che non sa, **indovina** con probabilità
  1/numero di risposte (tutti i 120 quesiti ne hanno tre, quindi 1/3).
- Se sa tutti i concetti del quesito, **sbaglia per svista** con una
  probabilità scelta a caso per studente fra **5 % e 15 %**. Il modello
  bayesiano assume 10 %: il banco non parla la sua lingua apposta.
- Dopo un errore mette a volte un tag. Se non sapeva: «N» 40 %, «S» 5 %. Se è
  stata una svista: «S» 30 %, «N» 5 %. Quindi i tag aiutano, ma a volte
  mentono.

Il banco locale ha **300 studenti con lacune e 300 senza** per ogni lunghezza.
Il remoto prende da lì **i primi 30 con lacune e i primi 10 senza** per
lunghezza (160 studenti), con gli stessi semi, e i locali si misurano anche su
quei 160 per il confronto diretto (§4).

**Una lacuna «rilevabile»** è un concetto non saputo su cui lo studente ha fatto
almeno 2 quesiti: con il minimo di 2 errori distinti, che vale per tutti i
metodi, sotto i 2 quesiti nessun metodo la può trovare. Su 10 domande la gran
parte delle lacune non è rilevabile: un concetto ha in media 7,5 quesiti su 120.

## 2. I metodi

Il **minimo comune**: una diagnosi vuole almeno **2 errori distinti** sul
concetto. Vale per tutti, remoto compreso, ed è imposto dal codice.

**1a. Il conto semplice** (`locale.mjs`, `semplice`). Per ogni concetto,
sbagliate su fatte; un concetto è segnalato con almeno 2 errori e un tasso
almeno doppio di quello generale della persona (con il tetto del 50 %, perché
il doppio di un tasso alto non si raggiunge). La regola è stata scritta prima
di vedere i risultati. È il metro da battere.

**1b. Il modello bayesiano** (`locale.mjs`, `bayes`). Per ogni concetto due
stati, «lo sa» / «non lo sa», con un priore del 10 % (circa 2 lacune su 19). Le
prove si sommano in log-odds:

- una risposta giusta: log(1/3 ÷ 0,9) ≈ −1,0, per ogni concetto del quesito;
- un errore: log(2/3 ÷ 0,1) ≈ +1,9; con il tag «N» la svista si divide per 6,7
  (≈ +3,8), con il tag «S» si raddoppia (≈ +1,2);
- un errore su un quesito con due concetti va **al concetto meno certo**, cioè
  con la posteriore più alta, rifatto finché si assesta.

Segnala il concetto con posteriore ≥ 0,5 e almeno 2 errori incolpati.

**La variante con l'albero.** L'albero non è nel JSON del pilota: lo scrive
`comune.mjs` con le quattro famiglie del §6 del pilota (luci e portate, segnali
IALA con le quattro cardinali in un nodo loro, oggetti e carta, fluviale). La
regola di I-32 — il figlio se gli errori stanno lì, il padre se sono sparsi —
diventa: se i figli segnalati coprono almeno il 60 % degli errori del nodo si
tengono i figli; altrimenti, se il nodo stesso è segnalato, si dice il nodo.
Una segnalazione di famiglia conta come giusta se contiene una lacuna vera.

**2. Il remoto** (`remoto.mjs`). Il codice prepara un fascicolo:

- il totale delle risposte e degli errori;
- per ogni concetto toccato, fatte, giuste e sbagliate;
- per ogni errore: id, testo della domanda, risposta scelta, risposta esatta,
  concetti, tag, data.

Il messaggio di sistema porta la tassonomia (id, nome, che cosa copre) e le
regole: tre risposte, la svista circa una volta su dieci, i tag, il minimo di 2
errori, e che «nessuna lacuna» è una risposta ammessa. L'uscita è strutturata
(`output_config.format`, JSON Schema): `esito` (`lacune` / `nessuna_lacuna`) e
una lista di diagnosi, ciascuna con il concetto **da una lista chiusa**, gli id
dei quesiti citati e una confidenza (`bassa`, `media`, `alta`). Sforzo `medium`
per i due modelli.

**Il raccordo** controlla ogni citazione: il quesito esiste nella voce, è stato
fatto, è sbagliato all'ultima risposta, **e porta il concetto diagnosticato**
(quest'ultima condizione è in più rispetto a quanto chiesto: una citazione di
un altro concetto non sostiene la diagnosi). Una diagnosi resta solo con almeno
2 citazioni valide distinte. I numeri di qualunque schermata li conterebbe il
codice su queste citazioni, mai il modello.

## 3. I risultati locali (300 + 300 studenti per lunghezza)

`risultati/locale.json`. **Recall**: lacune vere trovate su tutte quelle vere;
**recall ril.**: sulle rilevabili; **precisione**: segnalazioni giuste su tutte;
**muti**: studenti con lacune per cui il metodo dice «nessuna lacuna»;
**allarmi**: studenti senza lacune a cui il metodo ne inventa almeno una.

**1a, il conto semplice**

| quesiti | recall | recall ril. | precisione | muti | allarmi |
|---|---|---|---|---|---|
| 10 | 6 % | 43 % | 52 % | 86 % | 4 % |
| 20 | 19 % | 59 % | 53 % | 55 % | 12 % |
| 40 | 44 % | 69 % | 44 % | 23 % | 40 % |
| 80 | 79 % | 85 % | 42 % | 3 % | 77 % |

**1b, il bayesiano**

| quesiti | recall | recall ril. | precisione | muti | allarmi |
|---|---|---|---|---|---|
| 10 | 5 % | 35 % | 63 % | 88 % | 2 % |
| 20 | 18 % | 56 % | 71 % | 62 % | 7 % |
| 40 | 39 % | 61 % | 74 % | 36 % | 12 % |
| 80 | 76 % | 81 % | 80 % | 8 % | 17 % |

Il conto semplice trova qualche lacuna in più, ma più se ne fanno più ne
inventa: a 80 quesiti più di metà delle sue segnalazioni sono sbagliate, e
**tre studenti sani su quattro** ricevono un avviso. Il bayesiano ne perde
qualcuna e sbaglia una segnalazione su cinque.

**Il metro era tarato male?** `sensibilita.mjs` prova il conto semplice con
altre soglie (minimo 2 o 3 errori, tasso doppio o triplo). Da 40 quesiti in su
**nessuna variante batte il bayesiano su tutte e due le misure**: per
avvicinarne la precisione (minimo 3, triplo: 74 % a 40 e 80) perde un terzo
delle lacune (recall ril. 36 % e 60 %, contro 61 % e 81 %). A 10 e 20 quesiti i
numeri sono troppo piccoli per scegliere. `risultati/sensibilita.json`.

**L'albero** (stesse misure, una segnalazione di famiglia vale se contiene una
lacuna): al bayesiano aggiunge 4–12 punti di recall a parità di precisione, ma
ogni segnalazione copre in media **2,4 concetti** invece di 1, cioè dice più
spesso «luci e portate» che «le tre portate». Al conto semplice aggiunge
soprattutto allarmi (81 % dei sani a 80 quesiti).

| bayesiano + albero, quesiti | recall | recall ril. | precisione | allarmi | concetti per segnalazione |
|---|---|---|---|---|---|
| 10 | 9 % | 42 % | 58 % | 5 % | 2,9 |
| 20 | 28 % | 61 % | 72 % | 10 % | 2,4 |
| 40 | 51 % | 70 % | 74 % | 15 % | 2,4 |
| 80 | 81 % | 85 % | 79 % | 19 % | 2,4 |

## 4. Il confronto con i modelli Claude (gli stessi 160 studenti)

`risultati/confronto.json`, rifatto da `analisi.mjs` sul file grezzo
`risultati/remoto-grezzo.json`. Per lunghezza ci sono **30 studenti con lacune
e 10 senza**: i numeri sono piccoli, e per questo si scrivono come conti.
**Lacune**: lacune rilevabili trovate su quelle rilevabili. **Giuste**:
segnalazioni giuste su tutte le segnalazioni. **Muti**: studenti con lacune per
cui il metodo dice «nessuna lacuna», su 30. **Allarmi**: studenti senza lacune
con almeno una segnalazione, su 10. «Haiku alta» e «Sonnet alta» tengono solo
le diagnosi con confidenza «alta».

**80 quesiti**

| metodo | lacune | giuste | muti | allarmi |
|---|---|---|---|---|
| 1a conto semplice | 39/49 | 39/79 (49 %) | 0 | 7 |
| **1b bayesiano** | **37/49** | **37/45 (82 %)** | 4 | 2 |
| Haiku 5.5 | 41/49 | 41/82 (50 %) | 0 | 6 |
| Haiku 5.5, alta | 30/49 | 30/33 (91 %) | 6 | 1 |
| Sonnet 5.5 | 39/49 | 39/77 (51 %) | 0 | 7 |
| Sonnet 5.5, alta | 30/49 | 30/37 (81 %) | 4 | 2 |

**40 quesiti**

| metodo | lacune | giuste | muti | allarmi |
|---|---|---|---|---|
| 1a conto semplice | 18/31 | 18/42 (43 %) | 6 | 5 |
| **1b bayesiano** | **17/31** | **17/20 (85 %)** | 12 | 0 |
| Haiku 5.5 | 18/31 | 18/34 (53 %) | 8 | 4 |
| Haiku 5.5, alta | 11/31 | 11/12 (92 %) | 19 | 0 |
| Sonnet 5.5 | 17/31 | 17/32 (53 %) | 7 | 3 |
| Sonnet 5.5, alta | 14/31 | 14/15 (93 %) | 16 | 0 |

**20 quesiti**

| metodo | lacune | giuste | muti | allarmi |
|---|---|---|---|---|
| 1a conto semplice | 13/19 | 13/21 | 15 | 2 |
| 1b bayesiano | 12/19 | 12/16 | 16 | 2 |
| Haiku 5.5 | 13/19 | 13/20 | 15 | 2 |
| Haiku 5.5, alta | 2/19 | 2/2 | 28 | 0 |
| Sonnet 5.5 | 12/19 | 12/16 | 16 | 1 |
| Sonnet 5.5, alta | 7/19 | 7/8 | 22 | 0 |

**10 quesiti:** su 30 studenti con lacune ce ne sono 3 rilevabili, e tutti i
metodi danno lo stesso risultato (2 trovate, 2 giuste su 3 segnalazioni, 1
allarme su 10). Non c'è niente da confrontare.

**Che cosa fanno i modelli, guardando dentro le risposte.**

- **Non vanno oltre la regola nuda.** «Almeno 2 errori sul concetto» è la
  regola nuda. Su 160 studenti, Haiku non ha mai segnalato un concetto che
  quella regola non segnalasse già, e Sonnet nemmeno. Ne hanno tolti
  rispettivamente 57 e 68.
  - La regola nuda, sul banco locale grande, a 80 quesiti trova l'86 % delle
    lacune rilevabili con il 27 % di precisione.
  - I modelli dunque filtrano, e il filtro conta solo quando lo si legge dalla
    confidenza.
- **La confidenza separa davvero le diagnosi giuste da quelle sbagliate.**

  | confidenza | Haiku: giuste / sbagliate | Sonnet: giuste / sbagliate |
  |---|---|---|
  | alta | 44 / 4 | 52 / 9 |
  | media | 29 / 27 | 18 / 42 |
  | bassa | 1 / 34 | 0 / 7 |

  Sono le diagnosi della prima chiamata per studente, prima del raccordo.
- **Il raccordo non ha scartato niente.** Nessuna citazione inventata, di un
  quesito non fatto, di una risposta giusta o di un altro concetto, e nessuna
  diagnosi sotto i 2 errori. Il raccordo resta comunque necessario: ha
  funzionato su un banco in cui il modello non aveva ragioni per sbagliare, e
  non dimostra che non sbaglierà mai.
- **Sonnet quasi non pensa.** Con sforzo `medium` ha scritto in media 60 token
  di uscita per chiamata (17.163 su 288), quindi il JSON e poco altro. Haiku ne
  ha scritti in media 480.

**Stabilità.** Per lunghezza, 6 studenti con lacune e 2 senza sono stati mandati
5 volte a ciascun modello: 32 studenti, 160 chiamate per modello. Si confronta la
diagnosi dopo il raccordo.

| modello | studenti con 5 diagnosi identiche | somiglianza media fra due chiamate (Jaccard) |
|---|---|---|
| Haiku 5.5 | 28 su 32 (88 %) | 0,965 |
| Sonnet 5.5 | 30 su 32 (94 %) | 0,992 |

Il locale, per costruzione, dà sempre la stessa risposta. Su questi modelli la
temperatura non si può fissare a zero: i parametri di campionamento non sono
più accettati.

**Costo e tempo**, misurati su tutte le chiamate (i prezzi sono quelli di
listino del 3 novembre 2026, senza cache):

| modello | chiamate | token in | token out | costo totale | costo per chiamata | tempo mediano | 90° percentile |
|---|---|---|---|---|---|---|---|
| Haiku 5.5 | 288 | 1.154.023 | 138.289 | 0,18 $ | 0,0006 $ | 2,6 s | 6,3 s |
| Sonnet 5.5 | 288 | 1.154.023 | 17.163 | 2,48 $ | 0,0086 $ | 1,7 s | 2,1 s |

- In media 4.007 token in entrata per fascicolo. Un fascicolo da 10 quesiti
  ne pesa 3.355, quasi tutti di tassonomia, istruzioni e schema; il resto
  cresce con gli errori.
- La prima stima a secco era molto prudente: supponeva 2.000–3.000 token in
  uscita e dava 8 dollari, con meno ripetizioni per Sonnet. Quattro chiamate
  pilota hanno misurato 3.355 token in entrata e 27–152 in uscita, e il piano è
  tornato uguale per i due modelli.
- La parte fissa del prompt si potrebbe mettere in cache.

## 5. Che cosa non è stato provato

- **Persone vere.** Il banco è un simulatore. Le lacune sono nette («lo sa» o
  «non lo sa») e indipendenti fra concetti, le sviste sono uniformi e i tag
  hanno le probabilità scritte nel §1. Una persona vera sa a metà, confonde due
  concetti vicini e si stanca. Il bayesiano assume un mondo simile a quello del
  simulatore; la svista variabile e i tag che mentono sono l'unica difesa contro
  questo vantaggio, e non bastano a escluderlo.
- **L'archivio vero dell'autore** non è stato usato: non serviva. Con 13 errori
  alla prima risposta in tutta la voce, sotto il minimo di 2 per concetto non
  resta niente da confrontare (§4 del pilota).
- **I tag sono stati usati davvero dai modelli?** Non è misurato: niente dice
  se una diagnosi è cambiata per un tag.
- **Altri prompt, altri sforzi, Opus 5.5.** Un solo prompt, un solo sforzo
  (`medium`), due modelli. Un prompt che chiedesse di ragionare sulla svista
  potrebbe cambiare i risultati di Sonnet, che oggi quasi non pensa; non è
  provato.
- **L'albero nel remoto.** I modelli hanno ricevuto solo i 19 concetti, non le
  famiglie.
- **Altre voci.** Tutto è sulla voce dei fanali, con tag scritti da una sola
  sessione (§5 del pilota).
- **La posteriore del bayesiano come numero da mostrare.** Qui serve solo a
  decidere. Che sia calibrata (un 0,8 giusto 8 volte su 10) non è stato
  guardato.

## 6. Raccomandazione

1. **Se un giorno ci sarà un avviso «stai sbagliando sempre questo concetto»,
   lo calcoli il motore, con il modello bayesiano.**
   - Logica pura, nello stile di `engine.js`, con i test.
   - Si mostra **solo da 40 quesiti fatti nella voce in su**. A 40 quesiti una
     segnalazione è giusta dal 74 % (banco grande) all'85 % (i 30 qui), e
     non dà allarmi agli studenti senza lacune (0 su 10 qui,
     12 % sul banco grande). Trova poco più di metà delle lacune rilevabili.
   - Sotto i 20 quesiti niente avviso: non si vedrebbe niente comunque.
2. **Il modello remoto non serve per la diagnosi.**
   - Fa il conto che il codice sa fare, con meno lacune trovate a parità di
     precisione, una risposta che cambia una volta su otto o su sedici, e
     tempi di qualche secondo.
   - Se lo si vuole in pagina, il posto giusto è un altro: **scrivere la frase
     che spiega una diagnosi già fatta dal motore**, con le citazioni
     controllate dal raccordo. Non è stato provato qui.
3. **L'albero: per ora no.** Al bayesiano porta qualche lacuna in più, ma la
   paga con segnalazioni larghe due concetti e mezzo. Le famiglie servono per
   leggere i numeri di molte persone (come dice il pilota), non per un avviso
   personale.
4. **Prima di un avviso vero mancano ancora**:
   - la seconda lettura indipendente dei tag (§5 del pilota);
   - un banco con persone, cioè risposte vere di più studenti;
   - una decisione dell'autore su che cosa dire quando il metodo tace: per gli
     studenti con lacune succede una volta su tre a 40 quesiti, e la pagina
     non deve far credere che il silenzio voglia dire «sai tutto».

## 7. I file

| file | che cosa fa |
|---|---|
| `comune.mjs` | banca, concetti, albero, generatore con seme |
| `simulatore.mjs` | gli studenti finti |
| `locale.mjs` | 1a, 1b e la scelta del livello nell'albero |
| `remoto.mjs` | fascicolo, istruzioni, schema dell'uscita, chiamata, raccordo |
| `valuta.mjs` | le misure |
| `banco-locale.mjs`, `sensibilita.mjs` | il banco locale e le soglie del conto semplice |
| `banco-remoto.mjs` | prova a secco con la stima del costo; `--lancia` chiama i modelli |
| `analisi.mjs` | il confronto sugli stessi studenti, la stabilità, il costo |
| `risultati/*.json` | i risultati grezzi e le misure; dati sintetici, niente di personale |
| `risultati/esempio.json` | uno studente, il suo fascicolo e le due risposte |

Per rifare tutto:

```bash
cd docs/prototipi/concetti-2026-11/confronto
npm install                      # solo per --lancia: l'SDK ufficiale, @anthropic-ai/sdk 1.8.0
node banco-locale.mjs && node sensibilita.mjs
node banco-remoto.mjs            # prova a secco
node banco-remoto.mjs --lancia   # serve `ant auth login`; riprende da dove si era fermato
node analisi.mjs
```

`package.json` e `node_modules/` stanno solo qui: il sito e il server restano
senza dipendenze.
