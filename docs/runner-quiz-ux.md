# P-91 — Il runner dei quiz: verifica e misure

23 ottobre 2026 · `ui/main`, allineato a `main` · versione invariata.

## Perché e che cosa cambia

Il runner fisso lasciava scorrere soltanto `.qbody`: dopo il verdetto e i tag
la domanda si riduceva a 22 px e il piede sbordava senza poterlo raggiungere.
I due gesti di servizio dentro `.qtext` separavano la domanda dalla figura.
Le schede I-23, I-24 e I-27, punti 1–2, in
[idee-dopo-gli-account](idee-dopo-gli-account.md) e il prompt P-91 nella
[coda](prossime-sessioni.md) sono il perimetro.

Ora scorre l'intero `#quizrun`; `.qbody` mantiene l'altezza del suo contenuto.
Quando resta spazio, il flex tiene le risposte in basso. Quando non basta,
si scorre dalla domanda, dalla figura o dalle risposte senza cercare una
seconda area. I gesti di servizio stanno dopo risposte e proseguimento,
come pulsanti secondari con sottolineatura, alti almeno 44 px. Sui telefoni
la figura ha un tetto di 26vh: base-829 mostra figura e centro della prima
risposta anche con le risposte lunghe, senza ridurre il carattere del testo;
l'ingrandimento resta disponibile. I tag hanno 8 px di separazione e il
comando di ingrandimento ha 8 px di margine sopra, senza toccare la risposta.
Ogni `mostra()` riporta lo scorrimento del runner a zero.

Prima di cambiare le funzioni condivise sono stati controllati i chiamanti:
`strumentiQuesito()` serve `dipingiStrumenti()` nel runner e `bloccoRevisione()`
nella revisione; cambia lo stile dei due pulsanti in entrambi, e soltanto
nel runner cambia la collocazione. `dipingiStrumenti()` è chiamata da
`mostra()`; usa il contenitore stabile dopo `.qfoot`. `mostra()` serve avvio
e avanzamento dei quiz: riparte dall'inizio anche in simulazione e in auto.
`permessoGesto`, `rigaScrivibile`, i dati delle righe, `aria-pressed`, il
pannello segnalazione, i 200 ms, i tasti e il cronometro conservano il loro
contratto. Nessun nuovo export o controllo necessario; nessun file di
motore, dati, test o regole modificato.

## Metodo e limiti

Pagina originale da `HEAD` e pagina corretta servite in locale con
`strumenti/serve.py` (originale da una cartella temporanea con gli stessi
asset). Chrome headless, contesti anonimi isolati, font e figure locali;
ricerca pubblica per numero → preparazione → Inizia. Rettangoli CSS e stili
calcolati, schermate iniziali, dopo risposta e dopo scorrimento. Per le
simulazioni, stesso seme di estrazione prima e dopo, ripristinando l'orologio
normale prima di Inizia: il timer continua a contare realmente.

Le coordinate sono `top–bottom`, in px CSS, arrotondate a un decimale.
«Raggiunto» è il rettangolo dopo lo scorrimento del runner; il centro è
verificato con `elementFromPoint`. I comandi fuori dal primo schermo non
sono dichiarati in vista: la correzione è poterci arrivare con il gesto
normale. Con rotella reale, tastiera e clic CDP sono stati provati i passaggi;
le coordinate dei clic vengono lette dopo il disegno dello scorrimento.
Non è una prova su Safari o su un telefono fisico, né una prova con persone.
Schermate, script e JSON grezzi restano nella cartella temporanea `rg-p91`,
fuori dal repo. Le misure necessarie alla revisione sono qui sotto.

## Quesiti aperti per numero

«Prima» e «dopo» indicano la correzione; in questa tabella il proseguimento
è misurato dopo la risposta. Nella ricerca di un solo quesito si chiama
«Vedi il riepilogo». Prima di rispondere è nascosto per contratto.
Tutti i centri nella colonna «raggiunto» dopo la correzione risultano liberi.

| Schermo | Quesito | Risposta | Proseguimento prima | Proseguimento dopo, senza scorrere | Dopo, raggiunto |
|---|---|---|---|---|---|
| 375×667 | base-400 | sbagliata | 756.9–808.9 | 805.3–857.3 | 469.3–521.3 |
| 375×667 | base-1293 | giusta | 800.8–852.8 | 901.6–953.6 | 468.6–520.6 |
| 375×667 | base-1293 | sbagliata | 989.1–1041.1 | 1090.0–1142.0 | 469.0–521.0 |
| 375×667 | base-829 | sbagliata | 884.5–936.5 | 1277.2–1329.2 | 469.2–521.2 |
| 375×667 | base-828 | sbagliata | 696.2–748.2 | 1036.5–1088.5 | 469.5–521.5 |
| 375×812 | base-400 | sbagliata | 756.9–808.9 | 805.3–857.3 | 614.3–666.3 |
| 375×812 | base-1293 | giusta | 800.8–852.8 | 901.6–953.6 | 613.6–665.6 |
| 375×812 | base-1293 | sbagliata | 989.1–1041.1 | 1090.0–1142.0 | 614.0–666.0 |
| 375×812 | base-829 | sbagliata | 884.5–936.5 | 1314.9–1366.9 | 613.9–665.9 |
| 375×812 | base-828 | sbagliata | 696.2–748.2 | 1074.2–1126.2 | 614.2–666.2 |
| 1280×800 | base-400 | sbagliata | 728.0–780.0 | 668.0–720.0 | 668.0–720.0 |
| 1280×800 | base-1293 | giusta | 728.0–780.0 | 668.0–720.0 | 668.0–720.0 |
| 1280×800 | base-1293 | sbagliata | 728.0–780.0 | 668.0–720.0 | 668.0–720.0 |
| 1280×800 | base-829 | sbagliata | 728.0–780.0 | 969.9–1021.9 | 667.9–719.9 |
| 1280×800 | base-828 | sbagliata | 728.0–780.0 | 888.2–940.2 | 668.2–720.2 |

Le figure, prima di rispondere, a scorrimento zero. Base-400 e base-1293
non hanno una figura. La colonna `.qbody` riporta il taglio originale: un
rettangolo dell'immagine nello schermo non dimostrava che fosse visibile.

| Schermo | Quesito | Figura prima | `.qbody` prima | Figura dopo | Prima risposta dopo, centro |
|---|---|---|---|---|---|
| 375×667 | base-829 | 500.8–727.5 | 193.5–215.5 | 374.8–548.2 | 751.1 |
| 375×667 | base-828 | 448.3–675.1 | 193.5–269.8 | 322.3–495.7 | 667.3 |
| 375×812 | base-829 | 500.8–776.8 | 193.5–226.5 | 374.8–585.9 | 788.9 |
| 375×812 | base-828 | 448.3–724.4 | 193.5–414.8 | 322.3–533.4 | 705.0 |
| 1280×800 | base-829 | 179.0–589.0 | 211.5–598.5 | 225.5–635.5 | 809.6 |
| 1280×800 | base-828 | 219.9–610.9 | 211.5–661.3 | 225.5–616.5 | 759.2 |

A 375×812 le due figure sono intere nel primo schermo: la prima risposta
ha il centro a 705,0 px (base-828) e 788,9 px (base-829). T-11 verifica anche
il taglio di ogni antenato e l'assenza di sovrapposizioni. A 375×667 il
contenuto lungo continua sotto il bordo e si scorre normalmente. Dopo la
risposta le figure restano alle stesse coordinate del contenuto, senza
compressione: con `scrollTop=0`, base-828 resta a 322,3–495,7 / 322,3–533,4
sui due telefoni, base-829 a 374,8–548,2 / 374,8–585,9. A 1280×800 le
figure dopo la risposta stanno rispettivamente a 225,5–616,5 e 225,5–635,5;
scorrendo seguono il resto del runner.

## Simulazione, note e revisione

Simulazione base, primo quesito base-1253, risposta sbagliata; prima e dopo
nessuna classe di correzione `.ok`/`.ko`. Il quesito non ha figura. La
colonna raggiunto è ottenuta con un evento reale di rotella.

| Schermo | Avanti prima | Avanti dopo | Dopo, raggiunto |
|---|---|---|---|
| 375×667 | 572.1–624.1 | 620.5–672.5 | 469.5–521.5 |
| 375×812 | 674.0–726.0 | 620.5–672.5 | 614.5–666.5 |
| 1280×800 | 728.0–780.0 | 668.0–720.0 | 668.0–720.0 |

Note: base-106 (`nbp`, visibile prima e dopo) e base-274 (`nb`, soltanto
dopo la risposta). Entrambi senza figura, risposti sbagliati. La nota non
viene anticipata né nascosta per far posto al pulsante.

| Schermo | Quesito | Proseguimento prima | Dopo | Dopo, raggiunto con rotella |
|---|---|---|---|---|
| 375×667 | base-106 | 763.0–815.0 | 890.1–942.1 | 469.1–521.1 |
| 375×667 | base-274 | 828.7–880.7 | 955.8–1007.8 | 468.8–520.8 |
| 375×812 | base-106 | 763.0–815.0 | 890.1–942.1 | 614.1–666.1 |
| 375×812 | base-274 | 828.7–880.7 | 955.8–1007.8 | 613.8–665.8 |
| 1280×800 | base-106 | 728.0–780.0 | 668.0–720.0 | 668.0–720.0 |
| 1280×800 | base-274 | 728.0–780.0 | 668.0–720.0 | 668.0–720.0 |

Revisione dell'attività su base-828, risposta sbagliata. Non ha «Avanti»;
restano i comandi della revisione. La figura precede già le risposte e i
servizi: la sua posizione iniziale resta uguale, e la revisione conserva
il proprio scorrimento. Sotto la figura, l'ingrandimento dista ora 8 px.

| Schermo | Figura prima e dopo | Servizi prima | Servizi dopo |
|---|---|---|---|
| 375×667 | 517.4–744.1 | 1103.7–1215.7 | 1109.7–1153.7 |
| 375×812 | 517.4–793.5 | 1153.0–1265.0 | 1159.0–1203.0 |
| 1280×800 | 437.5–828.5 | 1075.3–1187.3 | 1081.3–1125.3 |

## Passaggio e comportamenti conservati

Allenamento sui due segnalibri base-829 e base-1293, creati dalla ricerca.
Dopo lo scorrimento reale fino al fondo, risposta con A e proseguimento
con clic reale: il runner passa da `scrollTop` 587 / 479 / 157 px a **0**,
rispettivamente a 375×667 / 375×812 / 1280×800. Il testo successivo comincia
a 229,7 / 229,7 / 451,7 px. Un secondo tasto immediato non risponde; un
nuovo tasto dopo i 200 ms sì. Nessun errore JavaScript nei tre passaggi.
Segnalibro (`aria-pressed=true`) e pannello di segnalazione sono stati
raggiunti con clic reali su entrambi i quesiti, a tutte le dimensioni.
L'allenamento per argomento con auto attiva avanza dopo una risposta giusta
da tastiera; le attività da ricerca o il breve continuano con auto spenta,
come prima.

## Consegna completa e gesti della revisione

Tre simulazioni complete da 20 quesiti: un errore scelto sulla prima domanda,
poi 19 risposte giuste, senza correzione durante la prova. Il riepilogo dice
19 su 20 corrette, 1 errata e 0 senza risposta. Il timer è stato letto a un
secondo di distanza e continua a diminuire. Sull'ultimo quesito il pulsante
«Consegna la prova» si raggiunge con un gesto touch emulato (`Input.synthesizeScrollGesture`),
e un clic reale apre il riepilogo. Questa prova aggiuntiva riguarda la pagina
corretta; il confronto controllato prima/dopo è quello del primo quesito
base-1253 nella tabella sopra. L'ultimo quesito delle tre prove non ha figura.

| Schermo | Timer prima → dopo 1 s | Consegna prima del gesto | Dopo il gesto touch, centro libero |
|---|---|---|---|
| 375×667 | 30:00 → 29:59 | 662.3–714.3 | 469.5–521.5 |
| 375×812 | 30:00 → 29:59 | 646.7–698.7 | 613.9–665.9 |
| 1280×800 | 30:00 → 29:59 | 668.0–720.0 | 668.0–720.0 |

Nella revisione dell'errore su base-828 sono stati provati con clic reali,
a tutte e tre le dimensioni, ingrandimento e chiusura della figura,
segnalibro con `aria-pressed=true` e apertura del pannello di segnalazione.

## Review e controlli

| Criterio | Verifica | Esito |
|---|---|---|
| D-29, proseguimento e domanda leggibile | T-10 completo, misure sui quattro quesiti, note prima/dopo e simulazione | verde |
| D-01/D-02/D-14, figura prima dei servizi | T-11 completo; figura intera e inizio domanda/centro prima risposta a 375×812 | verde |
| D-28, distanze dei bersagli toccati | Rettangoli: tag a 8 px; zoom a 8 px dall'immagine; servizi con gap di 8 px sulle righe / 16 px sulle colonne e margine superiore di 16 px | verde |
| Domanda successiva dall'inizio | Due segnalibri; `scrollTop` 587/479/157 → 0; clic reale e tastiera | verde |
| Contratti conservati | Tasti A e 2 nei passaggi, tasto numerico in auto; guardia 200 ms; timer e nessuna correzione in simulazione; gesti runner/revisione | verde |
| Territori | Diff limitato a pagina, documenti UX/neutri e changelog; nessuna seconda logica di selezione | verde |

Cinque suite sul codice corretto: motore **215/219**, con i quattro skip
previsti dei vecchi doppioni ora nel motore; dati **225**; interfaccia
**3.524**, regime ridisegno, T-10 e T-11 completi senza eccezioni; specifica
**1.048**; server **89/89** con Node 25.3.0 e **89/89** con la LTS
Node 24.22.0. Archivio ufficiale della LTS verificato contro il suo
SHASUMS256 già disponibile, SHA256
`6a9724d9b50a5f22b4816cded441b5a8d9ddae546191a5e5b7efa5a5e2ee26d5`.
La 8620 è risultata libera a ogni controllo per 90,1 s, prima di avviare
la suite dell'interfaccia; nessun'altra suite sulla 8620 in parallelo.
Le cinque dichiarazioni aperte T-10/T-11 sono tolte nello stesso commit.
Il numero dei controlli comprende il regime senza quelle dichiarazioni;
nessun test è stato modificato o deselezionato.

**Verdetto della review: passa.** Restano i limiti del metodo: Chrome con
viewport e touch emulati, nessun Safari, telefono fisico o lettore reale.
Nessuna nuova decisione richiesta all'autore. La regia, dopo la merge,
allinea il testo di R-RIF-17 e R-RIF-18 nella specifica, ancora dichiarati
aperti: questo documento è di competenza di `main` e non è stato modificato.
Il resto dell'audit I-27 segue l'ordine già in coda. Nessun pannello esterno,
account reale, servizio di produzione, push, tag o versione toccato.
