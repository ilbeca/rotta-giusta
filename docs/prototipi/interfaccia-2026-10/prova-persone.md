# P-70 — La prova dei mock con le persone, e con i bot

14 ottobre 2026 · con l'autore davanti · solo questo file, nella cartella dei
mock. Nessun file di `site/`, `tests/`, la specifica o la coda è stato toccato.

**La prova con le persone non è stata fatta.** Il prompt chiede tre-cinque
persone vere e dice che con meno di tre la prova non è fatta; l'autore, alla
domanda su chi fossero, ha risposto che non le ha. Il campione è **zero**, e
non si inventa: le sezioni «Osservazioni persona per persona» e «I conteggi
contro le note» sono vuote per questo motivo, e il documento lo dice invece di
riempirle con altro. Quello che si è potuto fare oggi è scritto sotto: il
protocollo com'è pensato, così la prova si fa quando le persone ci sono senza
riprogettarla; i bot sulle varianti dei mock, letti come segnale debole; e, in
fondo, che cosa quel segnale dice e non dice sulle domande aperte.

## Fonti

[AGENTS.md](../../../AGENTS.md); la scheda I-09 di
[idee-dopo-gli-account.md](../../idee-dopo-gli-account.md) — i due profili, i
compiti, «I primi due profili» con i giri del 4 ottobre — e la decisione 33;
il §4 di [prossime-sessioni.md](../../prossime-sessioni.md), «Dopo P-59»,
punti 4, 13 e 15; la [specifica](../../specifica.md), §1 e Q-STATI fra le
chiuse del §10; le quattro note dei mock, ciascuna con la sua parte «P-70»:
[home-note.md](home-note.md), [attivita-note.md](attivita-note.md),
[progressi-note.md](progressi-note.md), [giro-note.md](giro-note.md); i «Nomi
ancora aperti» di [tragitti.md](tragitti.md). Il banco dei bot sta fuori dal
repo, in `~/bot-ux/`, con il suo `LEGGIMI.md` e la lettura del 4 ottobre.

## Il protocollo, com'è pensato

È quello del prompt, scritto perché la prova si faccia uguale il giorno che le
persone ci sono. Niente qui è stato eseguito.

**Le persone.** Da tre a cinque. Per ognuna si annota prima il profilo del §1
della specifica — *comincia da zero*, *in formazione*, *sotto esame* — e se è
una che, chiesta che cosa cerca, dice «i quiz». Nel verbale la persona è un
numero e il profilo, mai un nome.

**Il dispositivo.** Il telefono della persona, in verticale, con una mano; i
mock si servono dal Mac dell'autore sulla rete locale (una cartella servita
con `python3 -m http.server` da `docs/prototipi/interfaccia-2026-10/`, come
si è fatto oggi per leggerli). Se il telefono non c'è, il Mac a 375 px, e lo
si scrive.

**Le varianti, e l'ordine.** Due coppie, quelle che i mock mostrano senza
decidere: la Home «approvata» contro la «proposta» di P-65 — secondo pulsante
«Allenati con 10 domande» o «Prova 10 domande»; pannello dell'avatar «Accedi»
o «Accedi o registrati» con «Crea un account» visibile; porta Allenati con o
senza il richiamo «Quiz · Carteggio · Segnali» —; e Allenati con i temi nel
segmento Quiz o nella Preparazione. L'ordine si alterna: la persona 1 vede
prima la Home approvata e i temi nella Preparazione, la 2 prima la proposta e
i temi in Quiz, la 3 come la 1, e così via, perché nessuna variante sia
sempre la prima.

**I compiti**, dati con le parole della persona e non con i nomi delle voci:

1. *Profilo 1 di I-09, «Mi serve la patente».* «Fai la prova del quiz come
   sarà all'esame, per vedere se la passeresti. Non registrarti.»
2. *Profilo 2 di I-09, «Voglio tutto».* «Fa' in modo che quello che fai resti
   salvato, e poi trova dove il sito ti dice come stai andando e da dove
   ripartire.»
3. *Chi cerca «i quiz».* «Fai i quiz solo sull'argomento che hai studiato
   ieri» — l'argomento lo dice la persona, con la sua parola.

**Che cosa si annota, per persona e per compito:** che cosa ha toccato, in
ordine; quanti tocchi fino alla prima domanda, al modulo o alla mappa; dove si
è fermata, e per quanto; che cosa ha detto, con le sue parole. Niente aiuto
durante il compito: le domande si scrivono e si rispondono alla fine.

**Le cinque parole di Q-STATI.** Finiti i compiti, si apre Progressi con
l'account caricato (`progressi-mappa.html?caso=account`) e si chiede alla
persona di spiegare con parole sue «mai visti · da rifare · da confermare ·
recuperati · acquisiti», dopo averle viste sulla barra e nella legenda. Si
trascrivono le sue parole, non un giudizio.

**I conteggi contro le note.** Per ogni compito il numero di tocchi della
persona si mette accanto a quello che la nota del mock dichiara: la
simulazione a 2 dalla Home (`giro-note.md`, F-H0-01); un argomento scelto a 3
con i temi in Quiz e a 4 nella Preparazione (`attivita-note.md`); il modulo di
registrazione a 2 da H0 e a 1 da H1 (`home-note.md`); la principale
dell'account in Progressi sotto lo scorrimento a 1.004 px su telefono
(`progressi-note.md`). Lo scorrimento si annota a parte: se la persona ha
scorso per trovare quello che cercava, e se si è fermata prima.

## Osservazioni persona per persona

Nessuna: il campione è zero. Vedi in testa.

## I conteggi contro quelli delle note dei mock

Nessuno: senza persone non c'è un tocco da confrontare. I conteggi dichiarati
dalle note restano quelli, non verificati con nessuno.

## I bot sulle varianti dei mock

Il banco di `~/bot-ux/` ha due strumenti: i giri sul sito vero, con il
traguardo scritto sullo stato della pagina, e la prova del menu, su prototipi
di carta. I mock sono pagine statiche che non espongono quello stato, quindi
sui mock gira solo la prova del menu: ogni schermata è l'elenco di quello che
si può toccare, il modello riceve lo scopo con le parole della persona e dice
che cosa tocca, il banco lo porta dove quel tocco porta.

**I prototipi di carta** li ho trascritti oggi dai mock, leggendo le etichette
nel browser (`~/bot-ux/rotta-giusta/menu/varianti-mock-2026-10.json`, fuori
dal repo): la Home H0 nelle due varianti, Allenati nei tre segmenti con i temi
nel segmento Quiz o nella Preparazione, Esame, Progressi senza account, il
pannello dell'avatar. Quattro varianti incrociano le due coppie — M1 Home
approvata + temi nella Preparazione, M2 proposta + Quiz, M3 approvata + Quiz,
M4 proposta + Preparazione —, e una quinta, **M5**, è rotta apposta — «Esame»
chiamato «Verifiche» con prove dai nomi opachi, niente simulazione in Home,
l'account dentro «Altro», i Segnali chiamati «Extra» —: se non esce peggiore
delle altre, i numeri delle altre non valgono. Le voci che portano a
schermate non trascritte chiudono il giro come «altrove».

**I compiti sono i venti profili** di `~/bot-ux/rotta-giusta/profili/`,
scritti il 4 ottobre per il sito vero: per ciascuno tre frasi con le parole
del profilo, e come traguardo la schermata che chiude il suo scopo nel
prototipo — la Preparazione del quiz base per chi vuole la simulazione, «Crea
un account» per chi vuole registrarsi, il tema scelto o la ricerca per numero
per la studentessa con il manuale, la pagina Segnali per il diciannovenne, la
privacy per il diffidente, «Dati» per il commercialista che vuole i suoi dati.
I traguardi li ho scelti io, e sono la parte più discutibile: per un profilo
con due scopi (registrarsi *e poi* trovare i progressi) il prototipo misura
solo il primo.

**I tragitti minimi nel prototipo**, calcolati dal banco prima dei giri: la
simulazione a 1 tocco dalla Home; l'account a 2 (avatar, poi «Crea un
account»); un argomento a 2 con i temi in Quiz e a 3 nella Preparazione —
sono i tre e i quattro delle note, meno «Inizia», che il prototipo non conta;
il carteggio, le tecniche e la vela a 2; nella rotta apposta quasi tutto
costa un tocco in più. 300 giri: 5 varianti × 20 compiti × 3 frasi, con Haiku.

### L'esito

Lanciato dall'autore il 14 ottobre 2026 da `~/bot-ux/`; l'uscita sta in
`rotta-giusta/menu/2026-10-14-mock/` (`giri.jsonl`, `tabella.json`), fuori dal
repo come la lettura del 4 ottobre. **Il primo lancio non ha fatto niente**: i
300 giri sono usciti in un secondo con «OAuth session expired», costo zero —
la sessione della CLI `claude` del banco era scaduta, e l'intestazione del
terminale diceva «API Usage Billing», non l'abbonamento con cui si era deciso
di far girare i bot. L'autore ha rifatto l'accesso, la cartella è stata
cancellata e il giro rifatto: **300 giri, Haiku, nessun errore, 0,24 $ di
stima a consumo**, in pochi minuti.

Arrivati su 3, con i tocchi medi degli arrivati e il minimo del prototipo
(`tocchi/min`). M1 approvata + temi nella Preparazione; M2 proposta + temi in
Quiz; M3 approvata + Quiz; M4 proposta + Preparazione; M5 rotta apposta.

| Profilo, e il suo traguardo | M1 | M2 | M3 | M4 | M5 |
|---|---|---|---|---|---|
| 1 Mi serve la patente → simulazione base | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 2 · 2/2 |
| 2 Voglio tutto → Crea un account | 3 · 2/2 | 3 · 2/2 | 3 · 2/2 | 3 · 2/2 | 2 · 3/3 |
| 3 Gen Z, test veloce → breve o consigliato | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 |
| 4 Sessantenne, carteggio → esercizi, esempio o tecniche | 3 · 3/2 | **0** | 3 · 3/2 | **0** | 3 · 3/3 |
| 5 Ha già la entro 12 → prova di carteggio | 3 · 2/2 | 3 · 2/2 | 3 · 2/2 | 3 · 2/2 | 3 · 2/2 |
| 6 Diffidente → privacy | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 |
| 7 Studentessa → numero o tema | 3 · 2,3/2 | 3 · 2/2 | 3 · 2/2 | 3 · 2,3/2 | 3 · 2/2 |
| 8 Tedesco, italiano B1 → simulazione base | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 1 · 2/2 |
| 9 Stagione in barca → Crea un account | 2 · 2/2 | 3 · 2/2 | 3 · 2/2 | 2 · 2/2 | **0** |
| 10 Diciannovenne → Segnali | 2 · 1,5/1 | 1 · 1/1 | 2 · 1,5/1 | 2 · 1/1 | **0** |
| 11 Torna il giorno dopo → Progressi | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 |
| 12 Rifare gli errori → breve, consigliato o errori | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 |
| 13 Solo vela → simulazione vela | 2 · 2,5/2 | 2 · 2/2 | 3 · 2,3/2 | 2 · 2/2 | 3 · 2/2 |
| 14 Esame fra tre settimane → data d'esame | 3 · 2,3/2 | 3 · 2,3/2 | 3 · 2/2 | 3 · 2,3/2 | 2 · 4,5/2 |
| 15 Scottato dai siti a pagamento → simulazione base | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | 3 · 1/1 | **0** |
| 16 Diciassettenne → Crea un account | 3 · 2/2 | 3 · 2/2 | 3 · 2/2 | 3 · 2/2 | 1 · 4/3 |
| 17 Velista, esercizi su carta → esercizi | 3 · 3/2 | 1 · 2/2 | 3 · 3/2 | 1 · 3/2 | 3 · 3/3 |
| 18 Password di sempre → Crea un account | 2 · 2/2 | 2 · 2/2 | 2 · 2/2 | 2 · 2/2 | 1 · 3/3 |
| 19 Vuole i suoi dati → Dati | **0** | **0** | **0** | **0** | **0** |
| 20 Bocciato al carteggio → Che tecnica serve? | 2 · 2,5/2 | 1 · 2/2 | 2 · 2,5/2 | 1 · 2/2 | 1 · 3/3 |
| **Totale su 60** | **52** | **46** | **54** | **46** | **37** |

**Il controllo ha tenuto.** M5 è la peggiore su tutte e quattro le altre, e
stavolta anche sulla profondità: con l'account dentro «Altro» i tre profili
che vogliono registrarsi fanno 0, 1 e 1 su 3 (il 4 ottobre la stessa rottura
era passata 4 su 5), i tre che vogliono la simulazione cadono su «Prova 1 ·
carta», e «Extra» al posto di «Segnali» fa 0 su 3. Quindi i numeri delle altre
quattro si possono leggere.

**Una riga è un artefatto della trascrizione, non del mock.** Il profilo 19
fa 0 su 15 perché tutti i quindici bot toccano «Privacy» dalla Home — e la
privacy è il posto in cui l'informativa dice come si scaricano e si
cancellano i dati — ma io gli avevo dato come traguardo la voce «Dati» del
pannello dell'avatar. Il bot ha ragione e il traguardo era stretto: la riga
non dice niente sui mock.

**Dove le varianti differiscono, e dove no.**

- **Il richiamo «Quiz · Carteggio · Segnali» accanto alla porta Allenati** è
  l'unica cosa che separa le due Home nei numeri: M1 e M3 (senza) 52 e 54, M2
  e M4 (con) 46 e 46, e la differenza sta tutta nei profili del carteggio (4 e
  17) e in parte nel 20 e nel 10. Senza il richiamo, chi cerca il carteggio
  tocca «Allenati» o «Dentro Allenati: Carteggio» e poi la scheda Carteggio.
  Con il richiamo tocca la porta che nomina «Carteggio», atterra su Allenati
  aperto su **Quiz**, e lì prende **«Navigazione cartografica ed
  elettronica»** per il carteggio: i profili 4 e 17 mancano dieci volte su
  dodici nelle due varianti proposte, e otto di quelle dieci finiscono su quel
  tema, con sicurezza 4 su 5. Una porta che promette
  tre cose e si apre su una: il bot lo fa vedere, e una persona che ha letto
  «Carteggio» nel pulsante potrebbe farlo anche lei. È un segnale debole, ma
  è l'unico netto del giro.
- **«Allenati con 10 domande» contro «Prova 10 domande»**: niente. I profili
  3 e 12 arrivano 3 su 3 in un tocco con tutti e due i nomi, e la paura di
  P-65 — che «Prova» venga scambiata per la simulazione — non si è vista: i
  tre profili che vogliono la simulazione (1, 8, 15) hanno toccato «Simula il
  quiz base» 36 volte su 36, con il secondo pulsante chiamato in un modo o
  nell'altro.
- **«Accedi» contro «Accedi o registrati»**: il prototipo non lo misura.
  L'avatar nella barra dice «Accedi» in tutte e due le varianti, e il nome
  cambia solo nel titolo del pannello, che il bot vede dopo aver toccato. I
  profili che vogliono registrarsi (2, 9, 16, 18) toccano «Accedi» per primo
  42 volte su 48 in tutte le varianti, e il 4 ottobre il profilo 2 cercava
  «Registrati» in alto e scorreva la Home a vuoto: un modello tocca «Accedi»
  per registrarsi, una persona non è detto. Resta da provare con persone, e
  resta che il nome del pannello non cambia che cosa si vede prima del tocco.
- **I temi in Quiz o nella Preparazione**: il prototipo dà 2 tocchi contro 3
  (il «3 contro 4» delle note, senza «Inizia»), e la studentessa arriva 3 su
  3 ovunque, per lo più dalla ricerca per numero. Il bot non scorre: che gli
  otto temi a 375 px stiano sotto la piega non lo vede.
- **«Simula il quiz base» da solo in Home**: il velista che vuole solo la
  vela lo tocca 3 volte su 12 e finisce sulla preparazione del base; dalla
  voce Esame trova «Simula il quiz vela» sempre. Debole, e nel verso che la
  decisione 5 ha accettato.
- **«Che tecnica serve?»**: il bocciato al carteggio arriva 6 volte su 12;
  tre volte si ferma su «Esercizi», che senza carta non si fanno, e tre volte,
  nelle varianti con il richiamo, sul tema «Navigazione cartografica». Il
  prototipo non gli dice che gli esercizi vogliono la carta prima che tocchi.
- **I Segnali**: 7 su 12 nelle quattro varianti; chi manca prende il tema
  COLREG dei quiz o l'allenamento breve. Il 4 ottobre, sotto «Quiz → Altro»,
  erano 0 su 5: il segmento in Allenati è meglio, non ancora ovvio.
- **Il profilo 18**, che vuole registrarsi con la sua password di sempre,
  manca 1 su 3 in ogni variante andando su «Com'è fatto l'esame» o su «Il tuo
  obiettivo»: la regola dei 15 caratteri, che è il suo vero scopo, su un
  prototipo di carta non esiste.

### Come si legge

Un bot che arriva è un segnale debole, uno che non arriva è un segnale forte:
un modello trova la strada meglio di una persona (I-09, «un'asimmetria»). Le
frasi dei compiti le ho scritte io dai profili, e i profili li ha scritti
Claude il 4 ottobre: vanno riletti dall'autore. Tre giri dello stesso compito
valgono una o due osservazioni, non tre. **Un nome non si promuove per il
solo esito dei bot.**

## Che cosa l'esito dice, e non dice — senza decidere

Separato apposta dal resto, e scritto perché l'autore scelga guardando. Dove
c'è scritto «nessuno», la risposta è che la prova con le persone non c'è
stata: non è un esito neutro, è un'assenza.

### I nomi ancora aperti del §4, punto 4

Con le persone: **nessuno**. Con i bot, segnale debole, e nessun nome si
promuove per questo:

- **Secondo pulsante della Home** («Allenati con 10 domande» / «Prova 10
  domande»): i bot non distinguono, e «Prova» non ha portato nessuno dei
  profili della simulazione sul pulsante sbagliato. Il rischio scritto in
  `tragitti.md` non si è visto in 36 giri; se c'è, lo vede una persona.
- **Chi cerca «i quiz»** (il richiamo «Quiz · Carteggio · Segnali» accanto
  alla porta Allenati): è l'unico punto in cui i numeri si muovono, e si
  muovono **contro** il richiamo — 52 e 54 senza, 46 e 46 con —, non perché
  chi cerca i quiz si perda ma perché chi cerca il carteggio tocca la porta
  che lo nomina e si ritrova su Quiz. Il compito che il richiamo voleva
  servire, «i quiz su un argomento», arriva 3 su 3 in tutte e quattro le
  varianti: il 1 su 5 del 4 ottobre non si è ripetuto, e nel prototipo di oggi
  «Dentro Allenati: Quiz — Scegli un argomento» sta già in Home. Per l'autore:
  il richiamo costa qualcosa ai bot e non rende niente ai bot; che cosa faccia
  a una persona che legge «i quiz» non si sa.
- **Porta account** («Accedi» / «Accedi o registrati»): non misurabile su un
  prototipo, perché il nome cambia dopo il tocco. Resta dei profili 2, 9, 16
  e 18 con persone.
- **Allenamento consigliato, Esercizi di carteggio, Segnali, le prove**: i
  bot li toccano come etichette e arrivano; nessun segnale né a favore né
  contro i nomi alternativi, che il prototipo non mostrava.

### I tre tocchi del §4, punto 13

Con le persone: **nessuno**. Il prototipo conferma i conteggi delle note — 2
tocchi alla scelta del tema con i temi in Quiz, 3 nella Preparazione, più
«Inizia» che qui non si conta — e la studentessa arriva sempre, ma due volte
su tre dalla ricerca per numero e non dai temi. Che i tre tocchi *bastino*
dipende da due cose che il bot non ha: lo scorrimento a 375 px fino agli otto
temi, e la fretta. Non è una risposta al punto 13: è la stessa domanda, con i
conteggi delle note verificati sulla carta e non con nessuno.

### Le parole di Q-STATI

**Nessuno le ha viste.** La prova delle cinque parole è una prova con persone
e basta: il banco dei bot non legge una barra, e un modello che «spiega» una
parola non dice se una persona la capisce. Q-STATI resta chiusa com'è, e la
condizione della regia — «si riapre dopo P-70 se le persone non le capiscono»
— non è stata esercitata.

### Lo scorrimento che i mock dichiarano

**Nessuno ha scorso.** I prototipi di carta non hanno una piega: ogni voce di
una schermata è visibile al bot, compresi gli otto temi che a 375 px stanno
sotto lo scorrimento (`attivita-note.md`) e la principale dell'account a
1.004 px (`progressi-note.md`). Quello che il bot trova con i temi in Quiz non
dice che una persona li trovi: è il limite che le note già dichiarano, e
resta.

### Che cosa nessuno ha capito

**Non misurabile.** Senza persone non c'è un «non ho capito»: le fermate, le
domande e le parole che un bot non produce sono la ragione per cui questa
prova esiste.

## Per rifare la prova

1. Tre-cinque persone, profilate come sopra, con il loro telefono.
2. Servire i mock in locale; aprire `home.html` e scegliere lo stato H0 nella
   variante del turno.
3. I tre compiti, con le parole della persona; niente aiuto; annotare.
4. Progressi con l'account caricato, e le cinque parole.
5. Compilare le due sezioni vuote di questo file, e rileggere la parte finale
   con i tocchi veri accanto a quelli delle note.
