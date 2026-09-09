# Rotta Giusta — passaggio di consegne delle prime bozze

9 settembre 2026. Prototipo autonomo, non integrato e non pubblicato.

## Aprire e confrontare

Aprire [confronto.html](confronto.html) nel browser: contiene quattro viste
navigabili, due a 375 × 812 px e due a 1280 × 990 px. Si può scorrere dentro
ciascuna vista. I link aprono anche il [prototipo](index.html) a larghezza libera,
con i selettori di archivio, accesso ai Segnali e problema di salvataggio.

HTML, JavaScript dimostrativo e illustrazioni sono locali: si può aprire il file
senza connessione o servire soltanto questa cartella con un server locale.
Non occorrono dipendenze del progetto. Le immagini sotto sono catture della
prima viewport; per il contenuto successivo usare le tavole scorrevoli.

## File prodotti

| File | Funzione |
|---|---|
| [confronto.html](confronto.html) | Tavole affiancate, desktop e confronto delle due varianti Segnali |
| [index.html](index.html) | Bozza responsive con due stati e pannelli di anteprima degli ingressi |
| [paesaggio.svg](paesaggio.svg), [carteggio.svg](carteggio.svg) | Illustrazioni originali decorative, senza valore didattico |
| [marchio.svg](marchio.svg) | Copia del marchio esistente per rendere l’artefatto autonomo |
| [dati-demo.js](dati-demo.js) | Snapshot dimostrativo: risposte simulate, conteggi e liste |
| [genera-dati.mjs](genera-dati.mjs) | Generazione ripetibile tramite il motore del repository |
| [verifica/](verifica/) | Catture del browser, elencate sotto |

Unico documento di prodotto aggiornato: [specifiche-ux.md](../../specifiche-ux.md),
sezione «Prime bozze di Oggi/Rotta». Gli altri documenti esistenti non sono
stati modificati. `site/`, test, versioni e configurazione restano invariati.
Nessun commit, rilascio o push effettuato.

## Decisioni e punti aperti

**Nessuna nuova decisione di prodotto confermata in questa sessione.** Le
decisioni già condivise e lo stato di ciascuna proposta restano soltanto nelle
[specifiche](../../specifiche-ux.md#decisioni-condivise--riepilogo).

Le domande per il prossimo confronto sono nella sezione delle prime bozze delle
specifiche. Da lì ripartire per scegliere quali alternative portare a una
prova con persone nuove. La navigazione dimostrativa e i pannelli non vanno
interpretati come progetto completo delle destinazioni successive.

## Provenienza e significato dei dati

`genera-dati.mjs` importa direttamente `site/engine.js` e legge la banca e i
metadati pubblici del repository. Non contiene un secondo algoritmo di
selezione. Si riesegue dalla root con:

```sh
node docs/prototipi/rotta-2026-09-09/genera-dati.mjs
```

Giorno dimostrativo fissato al 9 settembre 2026; quiz base, nessuna data d’esame.
La prima selezione è prodotta da `mirata()`. Lo stato parziale simula una risposta
a ciascuno dei suoi 25 quesiti, con cinque risposte errate; `ripiega()` ricostruisce
lo specchio e `traccia()` calcola il riepilogo. La selezione successiva proviene
ancora da `mirata()`, con i pesi presenti in `meta.json`.

Risultato osservato nel checkout: stato parziale con 25 quesiti incontrati,
20 corretti all’ultima risposta e 5 da ripassare; selezione successiva di 25,
composta da 5 richiami e 20 quesiti mai visti. In entrambi gli stati quota e
giorni sono `null`. La banca base caricata contiene 1472 quesiti. Questi numeri
descrivono il campione e il checkout, non nuovi requisiti fissi del prodotto.

Nell’HTML, quantità annunciata e lista di anteprima leggono la stessa selezione
dello snapshot. L’artefatto non importa il motore a runtime, non chiama l’app,
non legge IndexedDB o localStorage e non salva risposte. I dettagli spiegano
che il peso degli argomenti è una stima tratta da scuole, non una ripartizione
ministeriale verificata. Non è mostrato come numero nelle viste iniziali.

## Verifiche effettivamente svolte

- Letti i quattro documenti richiesti, istruzioni, README, CHANGELOG e ADR.
  Le specifiche contenevano già i quattro esiti del confronto del 9 settembre,
  nonostante l’intestazione precedente. `motore.md` resta un riferimento tecnico
  datato: non ne sono state ripristinate le formulazioni superate.
- Osservate entrambe le bozze nel browser a larghezze effettive di 375 e
  1280 px. Corretto uno sforamento decorativo; larghezza scorrevole del documento
  uguale alla viewport nelle viste controllate. Osservati anche contenuti
  inferiori sul telefono, Carteggio, variante COLREG e avviso di archivio.
- Aperta la selezione dimostrativa: 25 elementi nel pannello, pari al numero
  annunciato. Nessuna risposta reale scritta.
- Percorsi eseguiti: ingresso Carteggio; Segnali diretto dalla Rotta con storico;
  COLREG → Segnali; attivazione dell’errore di salvataggio, con avviso e pallino
  Info visibili e assenza di sforamento a 375 px.
- Nessun errore JavaScript nei log del browser controllati; verifica sintattica
  del JavaScript del prototipo e rigenerazione ripetibile dello snapshot.

| Cattura | Stato / evidenza |
|---|---|
| [vuoto-375.png](verifica/vuoto-375.png) | Prima viewport a 375 × 812 px, senza storico |
| [parziale-375.png](verifica/parziale-375.png) | Prima viewport a 375 × 812 px, dati parziali |
| [vuoto-1280.png](verifica/vuoto-1280.png) | Prima viewport desktop a 1280 × 990 px |
| [parziale-1280.png](verifica/parziale-1280.png) | Prima viewport desktop a 1280 × 990 px |
| [segnali-colreg-375.png](verifica/segnali-colreg-375.png) | Ingresso contestuale nell’argomento |
| [avviso-archivio-375.png](verifica/avviso-archivio-375.png) | Errore dimostrativo con testo e indicatore |

Le catture a pagina intera dello strumento presentavano un errore di scala:
non sono state usate come evidenza né conservate nella consegna. Le catture
elencate sono di viewport; le tavole HTML permettono di scorrere l’intera pagina.

## Limiti e prossima attività

Questa è una verifica visiva e funzionale degli artefatti. Non è una prova con
utenti, una verifica su iPhone fisico, un audit di accessibilità completo o una
verifica dell’archivio/offline dell’app. Non sono stati rieseguiti i test del
prodotto per attribuire qualità UX alle bozze.

Gli originali allegati sono riferimenti estetici; le illustrazioni nuove non
ricostruiscono la schermata delle tre isolette, che non è stata ritrovata.
La tipografia usa Avenir Next se disponibile, con fallback locale di sistema;
la resa su sistemi diversi va ancora confrontata. L’esplorazione grafica non
conferma nuove regole d’esame né copertura del programma ministeriale.

Prossimo passo: raccogliere il riscontro sulle tavole, registrare soltanto le
scelte effettivamente confermate nelle specifiche e preparare i compiti di
una prima prova di comprensione e reperibilità.
