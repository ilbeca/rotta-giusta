# Carta nautica — il mock di ChatGPT

25 ottobre 2026. Seguito concreto del [parere sulla A](../parere-su-A.md).
BRAINSTORM: una variante della direzione A, non un cambiamento del sito o
un'approvazione delle regole nuove.

Apri **[la Home](index.html)**. Percorso cliccabile: «Oppure allenati con 10
domande» → preparazione → Inizia → scegli una risposta → Avanti → riepilogo.
Dal menu «Esplora il mock», in fondo a ogni pagina, si raggiungono tutti i casi.

| Schermata | Che cosa provare |
|---|---|
| [Home](index.html) | Carta illustrata, numeri dell'esame, due avvii distinti |
| [Quiz](quiz.html) | Righe degli argomenti con il peso scritto, senza pallini da interpretare |
| [Preparazione](preparazione.html) | Avviso sulla perdita accanto a Inizia |
| [Preparazione della simulazione](preparazione.html?modo=sim) | Tempi e correzione alla fine; avvio dichiarato inattivo |
| [Domanda breve](runner.html) | Risposta giusta o sbagliata, segnalibro dimostrativo, tag facoltativi |
| [Domanda lunga](runner-lungo.html) | Scorrimento e prosecuzione, anche dopo un errore |
| [Domanda con figura](runner-figura.html) | Figura prima delle risposte |
| [Riepilogo](riepilogo.html) | Una risposta di esempio, senza grafico decorativo |

Per servirlo dalla radice del repository:

```sh
python3 -m http.server 8798 --bind 127.0.0.1 --directory docs/prototipi/redesign-2026-10-chatgpt/carta-nautica
```

Poi aprire `http://127.0.0.1:8798/`. Funziona anche aprendo i file locali.
Carattere, figura, marchio, CSS e script sono nella stessa cartella. Nessuna
risorsa remota caricata e nessuna dipendenza nuova.

## Il patto visivo di questa variante

**Home: presentare e far cominciare. App: leggere, scegliere, proseguire.**
Il riferimento è la A di Claude al commit `9244f02` e il parere `f40eadc`.
La variante preserva carta calda, navy, Manrope e marchio. Traduce il parere
in cinque scelte visibili:

- Carta illustrata nella Home, con reticolo e una sola scala. Nessun reticolo
  sotto domande, risposte, avvisi o risultati; niente cornice doppia.
- Un titolo che distingue il compito, numeri con etichette e pochi divisori.
  I corpi grandi servono alla Home e ai risultati; nel runner conta la lettura.
- Magenta soltanto nella carta e nella traccia informativa. Comandi e
  navigazione navy; esiti verde e rosso, sempre accompagnati da parole.
- Riga compatta di avanzamento e «1 di 10», senza una seconda tappa accesa
  mentre si sta ancora correggendo la prima. Nessuno zigzag nel riepilogo.
- Domanda al centro e «Avanti» in basso sul telefono. Classificare l'errore è
  facoltativo e si apre su richiesta. Sul computer la domanda resta in una
  colonna, senza allargarsi a tutto lo schermo.

Token principali: fondo `#fbf8f1`, testo `#102e40`, secondario `#4c626d`,
magenta `#a71961`, corretto `#17633d`, errato `#a62b29`. Manrope locale;
corpo 16 px, domanda 24/26 px, domanda con figura 20 px sul telefono,
Home 32/52 px. Sono proposte del mock, non la scala approvata di T-13.

## Che cosa fa, e che cosa non fa

Il mock mostra **una sola domanda** in ciascun percorso. La preparazione lo
dice prima dell'avvio. Una scelta cambia la correzione e il riepilogo; nessun
quiz viene estratto, nessuna risposta viene salvata o inviata. Il riepilogo
riceve solo lo stato dimostrativo nell'indirizzo locale. Non esistono account,
cronometro o contabilità dei progressi. La simulazione non parte: non si
spaccia la correzione immediata dell'allenamento per una prova d'esame.

In Quiz il breve è il percorso principale del dimostratore per far provare la
sequenza. L'allenamento consigliato resta una voce spiegata: la priorità fra
le due attività **non è una decisione di prodotto approvata**. I pulsanti di
argomenti e sezioni fuori perimetro spiegano che cosa manca, senza fingere
una selezione funzionante. Accesso e registrazione non chiedono credenziali.

Le altre superfici — Carteggio, Segnali, Esame completo, Progressi, stati
con account e guasti di rete/salvataggio — restano da disegnare. Questo mock
non autorizza a togliere avvisi, guasti, fonti o controlli dalla pagina vera.
Non contiene spiegazioni didattiche inventate. Un esito favorevole del mock
non è una stima di promozione né una valutazione della preparazione.

## Provenienza

- Testi, ordine delle risposte, soluzioni e numeri di `base-522`, `base-1293`
  e `base-828`: `site/dati/quiz.json`, Allegato A al DD 131/2022. Nessuna
  riscrittura del testo ministeriale.
- `figura-078.png`: copia invariata da `site/figure/`, stesso Allegato A.
- `marchio.svg`: copia invariata dal marchio del progetto in `site/`.
- `manrope.woff2` e `OFL.txt`: copie del carattere e licenza già nel progetto,
  da `site/caratteri/`. Manrope, SIL Open Font License 1.1.
- Carta della Home e icone: SVG originali scritti per questo mock. La carta
  è illustrativa, senza coordinate o scandagli inventati; non serve alla
  navigazione e non è una nuova figura del decreto.
- PNG in `schermate/`: catture del mock nel browser. Nessuna foto o altra
  immagine esterna.

Le prove di questa sessione sono descritte in [verifiche.md](verifiche.md).
