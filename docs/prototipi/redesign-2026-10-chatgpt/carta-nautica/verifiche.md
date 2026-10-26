# Verifica del mock Carta nautica

25 ottobre 2026 · `ui/main` · sola proposta in `docs/prototipi/`.

## Browser e interazioni

Chrome headless reale, guidato tramite `tests/browser.mjs` senza modificare
il banco. Sette HTML alle misure **375×812, 375×667, 1280×800**: 21 viste,
nessuno sbordamento orizzontale, un h1 per documento. A queste si aggiungono
nove viste dopo risposta errata, tre fondi della domanda lunga con tag aperti,
il fuoco sul tag, la preparazione della simulazione e il riepilogo dopo
«Termina»: **36 catture finali** in `schermate/`.

La prima acquisizione dopo la risposta mostrava colori ancora in transizione;
è stata sostituita da catture assestate. Le immagini finali sono state guardate
nella revisione indipendente, comprese quelle dopo la correzione di Termina.
Le misure sono in `misure.json`; le impronte in `impronte.json` legano gli
artefatti alle schermate consegnate.

Dal mock servito in HTTP locale:

- **28 visite** a 320, 375, 640 e 1280 px: nessun overflow orizzontale,
  carattere e immagini caricati, un h1 per documento.
- **882 campioni di testo reso**, contando le ripetizioni alle diverse
  larghezze: nessun contrasto sotto soglia, minimo **5,05:1**. Questo controllo
  non è una certificazione globale e non misura la decorazione della carta.
- **78 controlli passati**, registrati in `verifica-mock.json`: reflow,
  caratteri, immagini, contrasto, dialogo/Escape, navigazione Home →
  preparazione → domanda → riepilogo → revisione, avviso entro 48 px
  dall'avvio, prosecuzione abilitata dopo la risposta, risposte via Enter,
  tag raggiungibile via Tab, segnalibro dimostrativo, zero risposte,
  simulazione inattiva e fondo del runner lungo.
- «Termina» esercitato prima della risposta, dopo una corretta e dopo una
  errata. Il caso errato mostra 0 corrette, 1 errata, 9 non affrontate;
  quello vuoto nasconde l'invito a salvare qualcosa che non esiste.
- Nella preparazione a 375×667, Inizia finisce a **522,3 px**, sopra la barra
  da 603 px. Nella domanda con figura, a 375×812, l'immagine sta fra **244 e
  374 px**; la prima risposta fra **394 e 472 px**. Non è un passaggio di
  T-11 sull'intera banca: è la prova di questo esempio, `base-828`.

640 px è una misura di reflow, non una prova dello zoom nativo. Nessuna
prova Safari, telefono fisico, lettore di schermo o studio con persone.
Nessuna misura prova un beneficio didattico.

## Revisione indipendente e detector

La revisione finale della skill Impeccable ha guardato le 35 catture iniziali
e letto HTML, CSS e JavaScript. Ha giudicato la composizione adatta a presentare
il mock, trovando un difetto materiale: dopo una risposta, «Termina» continuava
a portare al riepilogo vuoto. La correzione aggiorna il collegamento con lo
stesso stato dimostrativo usato da Avanti. Nuova prova nei tre stati e cattura
numero 36. Nel successivo verdict pass il revisore ha segnato la correzione
**resolved**, con disposizione **ship**, limitata alla consegna del mock.
Non è approvazione della direzione né collaudo di produzione.

Detector eseguito una sola volta: **8 warning**, uscita 2, non presentata
come verde. Sette segnalano la palette crema: è una scelta intenzionale della
Carta nautica, fissata nel README. L'ottavo segnala poco spazio sopra i numeri
della Home: sul desktop il padding è 20 px; sul telefono scompaiono insieme
padding e bordo. La revisione delle schermate non conferma quel difetto.

Il contesto formale PRODUCT.md e un comp approvato non esistono: il riferimento
è il parere e il patto visivo del README. Non sono stati inventati o introdotti
come nuove decisioni globali del prodotto.

## Suite del repository

Eseguite sul canonico invariato, non contro il mock:

| Suite | Esito |
|---|---|
| Motore | 215 passati su 219, 4 salti previsti, nessun fallimento |
| Dati | 225 passate |
| Interfaccia | 3.849 passate, regime ridisegno |
| Specifica | 1.096 passate |
| Server, Node 25.3.0 | 89/89 |
| Server, Node 24.22.0 LTS | 89/89 |

La porta 8620 era libera prima della suite; server e database temporanei.
L'archivio ufficiale di Node 24 già disponibile è stato ricontrollato contro
SHASUMS256. Guardiano e controllo condiviso della documentazione superati;
script del mock verificato anche con `node --check`.

Queste suite mantengono separate due cose: le garanzie del sito esistente e
le verifiche del prototipo. Nessun file di `site/`, `tests/`, server, dati,
versione o documenti a penna unica viene modificato. Nessun tag o push.
