# Area 6 — Collaudo P-25

**1° ottobre 2026, `ui/main`.** Realizzazione della rifinitura di
[area-6-progetto.md](area-6-progetto.md), secondo il §10.3 consegnato da P-45
e R-RIF del §9.11 della [specifica](specifica.md). Questo resoconto registra
misure e limiti; non dichiara conformità WCAG 2.2 AA.

## Perimetro deciso

Le quattro proposte del §8 hanno ricevuto dall'autore «no, per ora», tutte,
il 1° ottobre: gerarchie conservate; ingressi conservati fino a prove con
persone; alt delle figure conservati con il limite didattico dichiarato;
tema scuro come opzione futura. La modifica della pagina è solo CSS. Nessuna
selezione, conteggio, giudizio, ritorno, frase di riepilogo o persistenza
cambia. Nessuna superficie nuova: `VISTE_RIF` e `FRASI_RIEPILOGO` restano
quelle consegnate da `main`.

Il §7 del progetto precede P-21: **la bozza del Carteggio con l'account esiste
ed è stata verificata**, non ricostruita. Il contratto attuale è il §9.4 del
[client](account-client-progetto.md) e C-19.

## Metodo e schermate

Chrome **154.0.8037.92 headless**, macOS **27.0.1**, protocollo del banco del
repo, server HTTP e server account locali, account e righe sintetici nei
database temporanei. La porta 8620 è stata controllata libera prima dei
giri. Le suite che aprono connessioni locali hanno avuto il permesso della
sandbox; un primo avvio della suite dati senza quel permesso ha dato EPERM,
e la suite è stata rilanciata intera.

Prima delle modifiche, i cinque gruppi richiesti sono stati eseguiti sulla
pagina vera: tutti e cinque rossi nella verifica dichiarata, con i passi
precedenti verdi. Le schermate sono state guardate prima di correggere:
intestazione nei due regimi a 320 px, tessere e tabella delle tecniche, fuoco
su «Inizia l'attività» e Segnali sotto la barra, Info e tag dopo un errore.
Dopo le modifiche, lo stesso banco ha rimisurato colori, rettangoli,
scorrimento e fuoco; le schermate corrette sono state guardate di nuovo.

Collaudo guardato a **320 × 800, 375 × 800 e 1280 × 800 CSS px**, senza
account e con account non verificato con 40 risposte sintetiche: Percorso,
Quiz, Carteggio, tecniche, Segnali, Info, «Accedi»/pannello Account e Progressi
con l'account. Verificati nomi interi nell'intestazione, ordine dei controlli,
avvisi simultanei, misure e tabella delle tecniche, titoli lunghi della mappa
e dialogo scorrevole. Runner con errore, riepilogo e revisione sono stati poi guardati in tutti
e sei gli abbinamenti larghezza/regime: altre 18 schermate, zero sbordo.
Le 73 schermate e le relative misure dei due giri sono
fuori dal repo, in `/tmp/p25-dopo`; le riproduzioni in `/tmp/p25-prima`.
Sono evidenze temporanee della sessione, non asset del sito.

Il banco T-07 copre anche runner, riepilogo e «Accedi» a 320 e 375 px e le
viste a 640 e 1280 px. **640 px sono solo reflow equivalente**, non zoom.

## Cinque difetti chiusi

| Controllo / requisito | Prima, riprodotto | Dopo, rimisurato e guardato |
|---|---|---|
| T-05:arresti / R-RIF-07 | Tre arresti coperti dalla barra: Inizia, Scegli un'attività, Segnali | Nessun arresto coperto; indicatore presente. `scroll-padding` riserva spazio per le barre. Il fuoco di Inizia e Segnali è interamente leggibile nelle schermate |
| T-07:prova / R-RIF-09 | A 320 px: +16 px in ogni vista, +49 nelle tecniche, toast fuori di 6 px | Zero sbordo nel gruppo completo; intestazione compatta senza togliere marchio, Info o Accedi. Tessere e tabella rientrano, senza scorrimento interno o contenuto nascosto; le etichette lunghe vanno a capo |
| T-07:conto / R-RIF-09 | A 320 px: +23 px in Percorso, Progressi, Info e pannello | Zero sbordo nelle stesse superfici; Account e le quattro destinazioni restano leggibili |
| T-08 / R-RIF-11 | Grigio `rgb(96,120,135)`: 4,26:1 su pagina e 4,09:1 su azzurro | Grigio calcolato `rgb(87,111,126)`: **4,85:1** su `rgb(243,246,246)`, **4,65:1** su `rgb(230,243,247)`, **5,28:1** su bianco; 622 testi misurati nel giro mirato, nessuno sotto soglia |
| T-09 / R-RIF-12 | Tag N/L/C da 28–31 × 29 px; sommario Info alto 40,59 px | Tutti e tre i tag **44 × 44 px**; sommario Info **313 × 44 px** a 375 px; gruppo intero verde, anche sul riepilogo |

Le cinque righe escono da
[eccezioni-interfaccia.md](eccezioni-interfaccia.md) nello stesso commit:
non rimane nessun difetto T-* dichiarato, e i controlli si eseguono tutti sulla
pagina vera. Il contrasto continua a contare **due campioni non misurabili**
nel giro mirato (sfondo non risolvibile dal banco); non sono diventati misure
verdi né una prova di contrasto non testuale.

## Testi e conservazione: inventario dei punti verificati

Questo è l'inventario per funzione e regime dei testi osservati; le stringhe
non sono state riscritte. I contatori restano legati alle fonti esistenti.

| Punto d'uso | Regime e testo osservato | Fonte e stato |
|---|---|---|
| Percorso e preparazioni Quiz/Carteggio/tecniche | Senza account: risposte valide finché la pagina resta aperta, perdita alla chiusura o ricarica; nessun «salvato» | Avvisi del client e attività dello snapshot del motore; T-01 e T-06 |
| Runner, riepilogo e revisione quiz | Risposta ministeriale e riscontro; tre affermazioni di riepilogo sui fatti, risposte da rivedere e non affrontate; proposta di account quando ci sono risposte | Raccordo del ciclo e frasi consegnate da P-53; F-01. Tag sempre sul tentativo, nessun nuovo giudizio |
| Carteggio | «Sei tu a giudicare» prima dell'avvio; lavoro scritto distinto dalle risposte valutate; confronto con la risposta ministeriale | Raccordo D-01…D-04 e bozza del motore; C-19 |
| Progressi | Senza account: porta che spiega il regime. Con account: mappa, giusti/da rifare/mai visti, primo tentativo distinto | `quadro()` e selezione/anteprima già consegnate; nessun secondo calcolo |
| Info | «risposte ai quiz N», versione/cache e disponibilità offline separata; prova in memoria o copia dell'account | Risposte della pagina oppure righe `_t:'q'` della copia; T-02/T-03. Il segnale di guasto resta anche dopo una scrittura riuscita |
| Account e stato d'invio | Accedi senza identità; Account con identità riconosciuta. Email da confermare con scadenza; risposte da inviare quando in coda e confermate sul server solo dopo conferma | Identità, coda e risposte del client; T-02/T-04, senza attribuire le righe di A a B |
| Segnali | Senza account: punteggi validi per la pagina; extra banca dichiarata | Profilo/client e contenuti esistenti; nessuna trasformazione in risposte di quiz |

La prova mirata C-19:ricarica ha mantenuto il testo scritto dopo una ricarica,
con **49:40** alla ripresa dopo dieci minuti, senza sessanta minuti nuovi;
zero righe nella copia delle risposte e zero sul server. Le altre parti di
C-19 sono esercitate dalla suite completa.

## Prove non fatte e limiti

| Requisito | Stato |
|---|---|
| R-RIF-10 | **non fatto**: zoom nativo del browser al 200 %, solo testo al 200 % e spaziatura WCAG 1.4.12. Il browser headless usato qui misura viewport CSS; non sostituisce i comandi nativi richiesti |
| R-RIF-13 | **non fatto**: audit completo di contrasto non testuale ≥3:1 e del significato oltre il colore. Le schermate del focus sono state guardate, ma T-08 misura il testo, non tutti i bordi/stati/indicatori |
| R-RIF-14 | **non fatto**: percorsi completi soltanto da tastiera nei due regimi. T-05 usa tasti reali per gli arresti del Percorso e per la finestra Accedi; non equivale a tutti i percorsi di import, conflitto e cancellazione |
| R-RIF-15 | **non fatto**: lettore di schermo reale. L'albero di accessibilità del banco non prova gli annunci ascoltati. Gli alt dei quiz restano quelli di oggi, derivati dalla domanda: identificano la figura e non garantiscono equivalenza didattica senza vista |
| R-RIF-16 / Q-PROVE | Resta il collaudo esteso degli stati del client, Safari/dispositivi e persone, come previsto dalla specifica. L'account non verificato è stato guardato qui; non costituisce copertura completa di quei requisiti |

Queste prove attendono l'autore secondo la procedura manuale del §9.11 della
specifica. Le quattro decisioni del §8 non sono più un blocco per P-25; questi
limiti restano aperti e non sono una richiesta di ridisegno.

## Verifiche di chiusura

Tutte le suite complete verdi: motore **193/197**, con i quattro confronti
ritirati previsti (`totScreening`, `componiProva`, `tagPerTentativo`,
`daAllenare`, copie che la pagina non ha più); server **60/60** su Node
25.3.0 e **60/60** su Node **24.21.0 LTS**, pacchetto separato con hash
ricontrollato contro `SHASUMS256.txt`; dati **242**; interfaccia **2.158**;
specifica **784**. Guardiano, controllo documentazione e diff senza errori.
Versione invariata, nessun tag o push, nessun account o servizio di produzione
toccato. `docs/prossime-sessioni.md`, test, specifica, motore e dati non
modificati.
