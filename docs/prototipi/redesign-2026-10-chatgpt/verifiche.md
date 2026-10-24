# P-96 — Verifiche e revisione

24 ottobre 2026 · `ui/main` · base `45f1254` · versione 0.34.0 invariata.

## App attuale e mock

- 20 screenshot dell'app attuale, senza account, dieci superfici a 375×812 e 1280×800, servita con `strumenti/serve.py`. Guardati tutti.
- 21 HTML di proposta, sette per direzione; 42 viewport alle misure richieste, sei fondi del runner lungo e tre immagini dei tag aperti con fuoco visibile. 51 immagini dei mock finali guardate, anche da una revisione indipendente.
- 84 visite a 320, 375, 640 e 1280 px; nessun overflow orizzontale positivo, un h1 per documento e caratteri locali caricati. 3.470 confronti di contrasto su testo reso: nessuno sotto soglia, minimo 5,33:1. I confronti includono gli stessi testi a diverse larghezze: non sono 3.470 requisiti diversi.
- Nessuna risorsa da altri host nei 42 caricamenti dei mock alle misure richieste. La galleria cambia schermata e misura, mostra tre anteprime e non sborda a 375 e 1280 px.
- Preparazioni corrette dopo la prima lettura: titoli a 32 px sul telefono e 40 sul desktop, spazi ridotti senza togliere l'avviso. A 375 il fondo del comando Inizia è a 614 px in Atlante e 649,8 nelle altre due; comando inattivo della simulazione a 706 px in tutte. La barra parte a 747 px: nessun avvio è coperto.
- Prima cattura dei tag respinta: era identica al runner iniziale. Ricattura dopo Enter sul summary, verifica che il gruppo sia aperto, Tab reale, verifica del radio attivo, scorrimento al controllo e attesa di due frame. Le tre nuove immagini mostrano il fuoco e il bottone Avanti non lo copre.
- Le impronte in `evidenze.json` legano HTML e screenshot al pacchetto consegnato. I JSON descrivono misure della proposta, non quelle della pagina pubblicata.

## Revisione indipendente

Una seconda lettura, prevista dalla skill Impeccable e confinata a questa cartella, ha guardato tutte le 51 immagini finali e controllato HTML, contratti visuali nel README e JSON. Esito conclusivo **ship, limitato alla presentazione del brainstorm**: nessun problema materiale aperto nel perimetro delle proposte. Non è approvazione di una direzione o autorizzazione all'implementazione.

Il primo esito era `recapture`, per le tre evidenze del fuoco. Corrette anche due descrizioni della scala nel README: Atlante rende la domanda a 26/32 px e Circolo a 24/32 px. Una nuova revisione dell'intero pacchetto finale ha confermato la risoluzione.

Il detector meccanico è stato eseguito una volta: **15 warning**, nessun errore di contrasto nel controllo separato. Quattordici segnalano il fondo crema delle sette pagine di Atlante e delle sette di Circolo: è una scelta intenzionale delle due direzioni, esplicitata e verificata visivamente. Il quindicesimo segnala testo troppo vicino al divisore di `home-start` in Atlante; a 1280 il padding reale è 32 px, a 375 il bordo è rimosso. La revisione indipendente non trova il difetto nelle immagini. Il detector è uscito con codice 2 per i warning: non lo si presenta come «verde» né si confonde con il guardiano del repository, che è verde.

## Suite del repository

Eseguite sul canonico **invariato**, senza `RG_PAGINA` o `RG_SITO`:

| Controllo | Esito |
|---|---|
| `node --test tests/test_engine.mjs` | 215 passati su 219, 4 salti previsti, zero fallimenti |
| `python3 tests/test_dati.py` | 225 verifiche passate |
| `python3 tests/test_interfaccia.py` | 3.849 verifiche passate, regime ridisegno |
| `python3 tests/test_specifica.py` | 1.096 verifiche passate |
| `node --test tests/test_server.mjs` | 89/89 con Node 25.3.0 |
| Node LTS ufficiale, stessa suite server | 89/89 con Node 24.22.0 |
| `python3 strumenti/controlla.py` | superato |
| Controllo condiviso documentazione | superato |
| `git diff --check` | superato |

La 8620 è stata controllata libera prima della suite interfaccia. Tutti i server e database delle suite sono temporanei. La prima esecuzione della suite dati si è fermata al bind del server locale per il limite della sandbox; rieseguita con l'accesso alle porte locali, è interamente verde. Non è stata attribuita una regressione alla pagina.

L'archivio ufficiale `node-v24.22.0-darwin-arm64.tar.gz`, già presente, è stato ricontrollato contro `SHASUMS256.txt` prima di usare il runtime. SHA-256:

```text
6a9724d9b50a5f22b4816cded441b5a8d9ddae546191a5e5b7efa5a5e2ee26d5
```

I log di esecuzione e gli script temporanei di acquisizione restano fuori dal repo; il pacchetto contiene risultati, screenshot e impronte. Le suite provano le garanzie del prodotto esistente; non trasformano i mock in un'app funzionante.

## Limiti

Chrome headless e viewport CSS: nessuna prova su telefono fisico, Safari, lettore di schermo o persone. La verifica del fuoco copre quel gruppo di controlli, non tutti i tragitti da tastiera. 640 px verifica il reflow equivalente, non l'esatta implementazione dello zoom. Gli stati con account, le figure nel runner e i guasti reali restano da progettare e collaudare. Nessuna dichiarazione di conformità WCAG completa è implicata.

Non sono cambiati `site/`, test, server, motore, dati, documenti a penna unica o coda. Nessun rilascio, tag o push; nessun account reale o macchina di produzione toccati.
