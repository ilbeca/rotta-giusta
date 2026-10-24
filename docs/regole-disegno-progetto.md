# Le regole di disegno nella pagina — progetto

**Data:** 23 ottobre 2026. **Che cos'è:** il piano per portare nella pagina di
Rotta Giusta le regole di disegno D-01…D-35, cioè i passi 2, 3 e 4 dell'ordine
che l'autore ha accettato il 21 ottobre 2026 (I-27 di
[idee-dopo-gli-account.md](idee-dopo-gli-account.md), «L'audit delle schermate
principali», in fondo). Il passo 1 — «Avanti» raggiungibile e la figura in
vista — è fatto: P-91, rilasciato nella v0.33.0, con T-10 e T-11 (R-RIF-17 e
18) verdi sulla pagina vera.

**Stato al 24 ottobre 2026:** giro 1 realizzato (P-92 e P-93, v0.34.0).
Il giro 2 ha il contratto e i controlli di P-94 (§10.1), con i difetti della
pagina vera dichiarati; la correzione su ui/* e il giro 3 restano da fare.
**File neutro**, come gli altri `*-progetto.md`: lo legge chi scrive i
controlli su `main` e chi corregge la pagina su `ui/*`.

**Le regole fanno fede in I-27**, dove sono state copiate il 21 ottobre; la
copia di lavoro in `~/bot-ux/rotta-giusta/regole/regole.md`, con lo script
dell'audit (`audit.mjs`), sta fuori dal repo ed è materiale da citare, non da
copiare. Le soglie che le regole dichiarano «nostre» restano tali finché l'uso
non le corregge (decisione dell'autore del 21 ottobre).

---

## 1. Scopo e perimetro

**Che cosa vuole ottenere.** Che chi apre il sito sul telefono trovi in cima a
ogni schermata la cosa per cui è lì, che la verità sul salvataggio sia detta una
volta e nel posto in cui serve, e che corpi, spazi e nomi seguano poche regole
dichiarate — e che tutto questo **non torni indietro in silenzio**, perché ogni
regola che si misura ha il suo controllo.

**I passi dell'ordine accettato, e i giri di questo piano.**

| Ordine del 21 ottobre | Giro | Che cosa |
|---|---|---|
| 1. «Avanti» e la figura | — | fatto: P-91, v0.33.0, T-10 e T-11 |
| 2. L'avviso detto una volta, Esame sulle prove, «Inizia» in vista | **giro 1** | ordine e gerarchia del primo schermo |
| 3. Il piccolo sistema di design | **giro 2** | scale di corpi, spazi e pesi, e i ruoli dei colori, in `:root` |
| 4. Le regole misurabili diventano controlli | **giro 3**, e in parte i giri 1 e 2 | vedi sotto |

**Il passo 4 non è un giro a sé, ed è la prima cosa che questo piano cambia.**
Nel piano di I-27 i controlli venivano alla fine. Il metodo di T-10, T-11 e P-91
li vuole **prima** della correzione: il controllo è rosso sulla pagina vera, la
correzione lo fa diventare verde. Quindi ogni giro porta i controlli delle
regole che corregge; il giro 3 raccoglie quelle che non appartengono a nessuna
correzione dei giri 1 e 2 — le parole e i nomi — e la lista di revisione per
quelle che non si misurano.

**Che cosa non fa.** Non disegna il carattere del marchio (I-27, passo 6, dell'autore),
non tocca il tema scuro (Q-TEMA), non aggiunge funzioni né cambia che cosa la
pagina contiene oltre a quello che le regole e le decisioni del §11 chiedono.
Non riapre la struttura di Q-NAV né le decisioni del ridisegno: sposta,
riordina e alleggerisce dentro di esse.

---

## 2. Lo stato, al 23 ottobre 2026

Letto nella pagina su `main` (`site/index.html`, v0.33.0) e nei banchi, non
dedotto.

- **L'avviso «senza account» è scritto quattro volte, e in un quinto posto
  dove serve.** In testa alla Home (`site/index.html:823`), in testa al segmento
  Carteggio (`:835`), in testa ai Segnali con le parole dei punteggi (`:852`),
  in testa alla preparazione di «Che tecnica serve?» (`:932`), sempre come
  `.account-warning` — un riquadro con un bordo ambra di 2 px. E nella
  preparazione dei quiz è **già accanto a «Inizia»**, come nota semplice:
  `#quiz-storage` riceve `avvisoProva` (`:5800`), la stessa frase. Nella Home
  lo stesso fatto è detto due volte nel primo schermo: nell'introduzione («Prova
  quiz e carteggio senza account; crea un account per salvare i progressi») e
  nel riquadro.
- **La specifica non chiede l'avviso nella Home.** Il §7.1, *H0*, elenca che
  cosa c'è nella Home senza risposte, e l'avviso non c'è; il §5.4 lo vuole
  «prima di ogni avvio senza account, e nel riepilogo» (R-ACC-02). La
  preparazione è esattamente «prima di ogni avvio».
- **Due controlli leggono l'avviso nella Home**, ed è il motivo per cui
  spostarlo non è soltanto interfaccia. C-02 (R-ACC-02) cerca la frase `PRIMA`
  nel testo visibile appena la pagina è pronta, cioè nella Home
  (`tests/client_account.mjs:594`); T-06 (R-RIF-08) misura che «nel Percorso
  l'avviso di prima si vede davvero» (`:3663`). Spostato l'avviso, tutti e due
  diventerebbero rossi per la ragione sbagliata.
- **Nessun aggancio di ruolo.** Nella pagina non c'è `data-ruolo`; il banco
  conosce le azioni per i loro identificatori (`#start`, `#c-start`, `#t-start`,
  `[data-modo="sim"][data-prova="base"]`, `[data-rotta-start]`, `#r-next`).
- **Esame comincia con il modulo.** `#v-esame` (`:871`): titolo, sottotitolo,
  poi la scheda «Che cosa stai preparando?» con la data, poi «Le prove».
- **Il CSS ha due blocchi `:root`** (righe 27 e 475): il secondo ridefinisce i
  nomi del primo con la tavolozza chiara. Non c'è una scala di corpi né di
  spazi; c'è `--tap` per i bersagli.
- **Le risposte del runner sono a 15,5 px**, che l'audit ha detto «va bene» e
  che D-17, come è scritta, non ammette (il testo delle risposte ≥ 16 px). Da
  chiudere nel giro 2.
- **La suite dell'interfaccia** fa 3.524 verifiche in 5 min 31 s (merge di
  P-91, CHANGELOG); Q-SUITE ne aveva accettati circa 240, ed è già sopra.

---

## 3. Il metodo, per ogni giro

È quello di T-10, T-11 e P-91, e non cambia:

1. **Su `main`, Claude scrive prima il contratto e il controllo** — il
   contratto nel §10 di questo file, il controllo nel banco del client o in
   `tests/test_interfaccia.py`, i requisiti nel §9.11 della specifica.
2. **Il controllo è verde sulla pagina di riferimento del client**
   (`tests/pagina-client-ridisegno.html`), ha rotture che lo fanno fallire per
   il loro motivo, e si prova contro sé stesso: ogni difesa del banco, tolta,
   fa passare verde la rottura che la riguarda.
3. **Sulla pagina vera è rosso per il motivo giusto**, e quello che la pagina
   non rispetta sta fra i «Difetti aperti dichiarati» di
   [eccezioni-interfaccia.md](eccezioni-interfaccia.md), una riga per
   verifica: la suite pretende che resti rossa finché la riga c'è.
4. **ChatGPT corregge la pagina su `ui/*`** e toglie le righe nello stesso
   commit; i controlli girano verdi per intero sulla pagina vera.
5. **Claude fa la merge e allinea la specifica**: i requisiti senza «difetto
   aperto», i paragrafi del §5 e del §7 che descrivono la pagina com'è.

**Tre regole del banco, che valgono per tutti e tre i giri.**

- **Il banco non si fida dell'aggancio.** `data-ruolo` è una dichiarazione
  della pagina, e una pagina può dichiarare male o non dichiarare: ogni
  verifica che lo legge ha accanto una difesa che non lo legge (§10.1).
- **Rosso per il motivo giusto, anche prima dell'aggancio.** Finché la pagina
  vera non ha `data-ruolo`, il banco trova le azioni con la mappa degli
  identificatori che conosce già, così le verifiche sono rosse per l'avviso, per
  Esame o per «Inizia» sotto la piega — non per un attributo che manca.
  L'aggancio mancante è una verifica a parte, dichiarata anche lei.
- **Una soglia nostra si dice nel nome della verifica**, come fanno già le
  regole: chi legge un rosso deve sapere se viene da uno standard o da noi.

---

## 4. Giro 1 — l'avviso una volta, Esame sulle prove, «Inizia» in vista

**Punti dell'audit:** 3, 4, 5 e 6 delle schermate principali; 2 della Home.
**Regole:** D-01, D-12, D-13, D-14 (riformulata), D-24, D-30.

**Che cosa deve essere vero dopo, senza account, a 375×812 e a 375×667:**

- **L'avviso sta nella preparazione, accanto a «Inizia», e in nessun altro
  posto prima di cominciare.** Ogni preparazione — quiz in tutte le
  intenzioni, simulazione, breve, segnalibri, ricerca per numero, prova e
  esercizi di carteggio, «Che tecnica serve?», Segnali — ha la frase del §4.1
  del progetto del client (per i Segnali, quella dei punteggi) subito prima o
  subito dopo l'azione principale, senza un altro bersaglio in mezzo. Non c'è in
  testa alla Home, al segmento Carteggio, ai Segnali né alle preparazioni.
  **Non è più un riquadro bordato**: è testo, con una parola o un segno che non
  affida il significato al solo colore (D-26).
- **La Home dice il fatto una volta**, con la frase dell'introduzione che c'è
  già; il riepilogo e l'invito nei tre posti (R-ACC-03) restano come sono.
- **Esame apre sulle prove.** Sotto il titolo, «Le prove» con le quattro porte;
  «Che cosa stai preparando?» e la data vengono dopo (decisione B del §11).
- **In ogni superficie l'azione principale è nel primo schermo** (D-01): la
  simulazione e il breve nella Home, il gruppo delle prove in Esame, il gruppo
  delle tre porte nel Carteggio, «Inizia» nei Segnali e in ogni preparazione.
  La preparazione del breve è il modello: 50 parole, «Inizia» in vista.
- **Una sola azione con lo stile pieno per superficie** (D-12), anche nel
  riepilogo con un errore, dove l'audit ha trovato «Riprova questo quesito» e
  «Crea un account e salva» tutti e due pieni (punto 9).

**D-14, misurata in un altro modo.** L'indice dell'audit — area × contrasto —
ha detto la cosa giusta sulla Home (l'avviso pesa più del pulsante), ma per la
ragione sbagliata: conta l'area intera di un riquadro che ha colorato soltanto
il bordo. Tre alternative pesate e scartate: lo stesso indice con il solo
bordo (lunghezza × spessore × contrasto) rende l'avviso dieci volte più
leggero del pulsante, ed è falso a occhio, perché il peso di quel riquadro
viene anche dalle 26 parole che contiene; un indice di «inchiostro» per pixel
vorrebbe una schermata analizzata, che il banco non fa; un giudizio a soglia
unica su un numero composto è un semaforo che nessuno sa leggere. **Al posto di
un indice, tre verifiche discrete**, ognuna leggibile da sola:

1. nel primo schermo nessun elemento fuori dall'azione principale ha il fondo
   pieno — contrasto con il fondo della pagina ≥ 3:1, soglia di WCAG 1.4.11
   presa a prestito —, barra di navigazione e avatar esclusi;
2. un avviso non ha un fondo con contrasto ≥ 1,5:1 con la pagina né un bordo
   visibile su tre lati o più (D-24, soglia nostra): è testo, non una scatola;
3. un avviso occupa al più il 15 % del primo schermo (D-30, soglia nostra), e
   ce n'è al più uno.

L'indice di prima resta nell'`extra` delle verifiche, come numero e non come
verdetto, perché si possa confrontare con l'audit del 21 ottobre.

**Che cosa non vede il giro 1**, e si dice: la «gara di misura» fra «Simula il
quiz base» e «Allenati con 10 domande», che hanno la stessa larghezza e
l'altezza e fondi diversi (D-12 passa; la differenza la vede l'occhio);
l'ordine giusto per una persona; lo stato con l'account (HA) e quello con
risposte senza account (H1), dove l'avviso ha altre regole; Safari e il gesto
vero.

---

## 5. Giro 2 — il piccolo sistema di design

**Punti dell'audit:** 7, 8, 10, 11 e 12 delle schermate; 3, 5, 6 e 9 della
Home. **Regole:** D-15 allargata, D-16, D-17, D-18, D-19, D-20, D-21, D-22,
D-23, D-25, D-28.

**Due regole entrano qui invece che nel giro 3**, e il perché è il costo: D-28
(8 px fra due bersagli) e D-19 (75 caratteri per riga a 1280 px) si correggono
con gli spazi e con una larghezza massima, cioè nella stessa passata sul CSS
della scala degli spazi. Correggerle dopo vorrebbe dire una seconda passata
sugli stessi selettori.

**Che cosa entra nella pagina.** In `:root` di `site/index.html`, un blocco
solo — quello di riga 27, ridefinito dal secondo, si fonde o esce — con:

- **i corpi**, proposta di partenza: 12, 14, 16, 19, 24, 30 px (sei, come la
  scala di GOV.UK sui piccoli schermi). 12 per barra ed etichette («Accedi»
  oggi a 11 sale), 14 per note, 16 per il testo e **le risposte** (oggi 15,5),
  19 per la domanda, 24 per i titoli di sezione, 30 per il titolo della
  schermata. Fuori scala oggi: 11, 11,5, 12,5, 13, 13,5, 14,5, 15,5, 23, il
  `clamp()` del titolo delle preparazioni;
- **gli spazi**: 4, 8, 12, 16, 24, 32, 48 px — la base di 4 di Designers
  Italia, con il 12 nostro perché la pagina lo usa già molto; fuori oggi: 2, 3,
  5, 7, 10, 11, 14, 18, 22, 23, 26, 30 e i decimali delle preparazioni;
- **i pesi**: 400, 600, 700 (escono 500 e 650);
- **i ruoli dei colori** (D-25): l'accento per ciò che si tocca, il rosso per
  gli errori e le risposte sbagliate, l'ambra per gli avvisi; i nomi ci sono
  già, i ruoli si scrivono;
- **una larghezza massima del testo corrente** perché a 1280 px nessuna riga
  passi i 75 caratteri (oggi 88, Esame 123).

I numeri sono una proposta da misurare, non da prendere: chi li fissa è la
decisione C del §11.

**I titoli.** D-15 allargata, come chiedono la tabella della Home e il punto 7
dell'audit: **nessun titolo è più piccolo del testo che introduce**, e nessun
titolo di livello più alto è più piccolo di uno di livello più basso nella
stessa vista. Gli `h2` di oggi, 13 px in maiuscolo, sono occhielli: o diventano
titoli veri (24 px) o smettono di essere titoli (un paragrafo con una classe
sua). D-21 vuole il maiuscolo intero solo per meno di una riga, e l'occhiello lo
rispetta.

**Che cosa non vede il giro 2**: se la scala è bella — le regole dicono
coerente, non elegante —; il CSS dei legali e della porta `/app`, che hanno fogli
propri (si possono includere nella stessa passata se costano poco, e allora il
controllo statico li legge); il tema scuro; i valori calcolati da `em`, `%` e
`vw` su superfici che il banco non visita.

---

## 6. Giro 3 — le parole e i nomi

**Punti dell'audit:** 5 (Gulpease 59 nei Segnali e nella prova di carteggio);
8 della Home, se l'autore lo mette qui (decisione F). **Regole con un
controllo:** D-03, D-04, D-05, D-06, D-08, D-10 (una riga), D-11, D-33, D-34 (la
parte che si misura). **Lista di revisione:** D-02, D-07, D-09, D-10 (le parole),
D-31 (il tono), D-34 (verbo o nome), più tutte quelle con un controllo, perché
un controllo verde non dice che un testo è chiaro (ISO 24495-1, introduzione).

**D-33 è la più utile da automatizzare**, e il documento solo la rende
economica: dopo il primo caricamento tutte le sezioni stanno nello stesso DOM,
quindi una visita basta per raccogliere le coppie (destinazione, etichetta) di
ogni porta — `href`, `data-v`, `data-segmento`, `data-modo` con `data-prova`,
`data-cporta`, `data-account` —, nascoste comprese. Una destinazione ha una sola
etichetta normalizzata, un'etichetta una sola destinazione; le differenze volute
si dichiarano in una tabella nuova di
[eccezioni-interfaccia.md](eccezioni-interfaccia.md), «Nomi diversi voluti».
Le porte disegnate dopo, dagli script, si raccolgono anche nei giri di T-12 e
T-13 sulle superfici che visitano.

**D-03 si misura con un elenco**, ed è nostro: i nomi del codice e dei
documenti che non devono arrivare in schermata — «Mirata», «screening»,
«regime», «specchio», «raccordo», «vetrina», «palestra» —, cercati nel testo
visibile **fuori** dai quesiti, dalle risposte e dagli esercizi: «specchio di
poppa» è una parola del decreto.

**D-06, Gulpease ≥ 60 per superficie**, con la formula di I-27. Oggi due rossi
noti (Segnali 59, prova di carteggio 59): pochi, e la correzione è riscrivere
due paragrafi.

**Che cosa non vede il giro 3**: che un titolo descriva (D-09), che un testo sia
capito, il tono di un errore, i testi degli stati del client che il banco non
visita, le pagine legali (lì le frasi sono del gate dell'autore).

---

## 7. L'ordine e i costi

**L'ordine resta quello accettato**, ed è giusto per una ragione che conviene
scrivere: il giro 1 cambia che cosa c'è e dove, il giro 2 cambia soltanto come
appare. Fatto prima il giro 2, la scala si misurerebbe su schermate che il giro
1 rimescola, e una parte delle misure andrebbe rifatta. Il giro 3 viene per
ultimo perché i suoi testi cambiano anche con i giri 1 e 2 (l'avviso spostato,
gli occhielli che diventano titoli).

**Tempo della suite (Q-SUITE).** Oggi 5 min 31 s. Stime, da misurare con
`RG_TEMPI=1` a ogni giro e da scrivere nel CHANGELOG con il numero vero:

| Giro | Che cosa gira | Stima sul tempo della suite |
|---|---|---|
| 1 | T-12 senza API, una scheda per misura, nelle corsie libere: circa nove superfici × due misure su tre pagine (vera, riferimento, rotture per parte) | + 20…40 s |
| 2 | un controllo statico in Python (trascurabile) e T-13 nel browser sulle superfici di T-08/T-09 più runner e preparazioni, a 375×812 e 1280×800 | + 20…40 s |
| 3 | T-14: un caricamento per D-33, e le misure di testo sulle superfici già aperte | + 10…20 s |

Le rotture chiedono la sola parte che rompono (`T-12:avviso`, `T-12:esame`…),
come fa il banco da P-39. Se la suite passa i 7 minuti, il giro misura a
375×667 solo le superfici dove 667 ha cambiato un esito nell'audit, e lo dice;
se un giro sta molto sopra la stima, si guarda prima la macchina (Q-SUITE: un
giro rosso su una macchina carica si rifà a macchina scarica).

---

## 8. Che cosa cambia rispetto alla proposta di partenza

La proposta della regia (giro 1 con `data-ruolo` e T-12; giro 2 con la scala e
D-22, D-20, D-16, D-15; giro 3 con D-33, D-28, D-19 e una lista di revisione) è
la base. Cambiano otto cose:

1. **R-ACC-02 e R-RIF-08 cambiano controllo nel giro 1.** C-02 e T-06 leggono
   l'avviso nella Home: spostarlo li farebbe rossi per la ragione sbagliata. Il
   contratto nuovo è più stretto di quello di oggi: la frase si vede **in ogni
   preparazione, insieme a «Inizia»**, non soltanto nella prima schermata.
2. **D-14 senza indice composto**: tre verifiche discrete (§4), l'indice
   dell'audit come numero nell'`extra`.
3. **Il banco non si fida di `data-ruolo`** e lo incrocia con la mappa degli
   identificatori che conosce già, con il testo dell'avviso e con lo stile
   pieno misurato; e trova le azioni anche prima che l'aggancio ci sia, così la
   pagina vera è rossa per il difetto e non per l'attributo.
4. **D-13 e D-24 entrano nel giro 1**: si misurano sulle stesse superfici, e
   D-24 è una delle tre verifiche di D-14.
5. **D-28 e D-19 passano dal giro 3 al giro 2**: si correggono con gli spazi e
   con una larghezza massima, nella stessa passata sul CSS.
6. **D-17, D-18, D-21, D-23 e D-25 si aggiungono al giro 2**; D-17 trova un
   difetto che l'audit aveva lasciato passare: le risposte a 15,5 px.
7. **Il giro 3 è il giro delle parole**: D-03, D-04, D-05, D-06, D-08, D-10 (una
   riga), D-11 e D-34 in parte hanno un controllo, non solo una lista di
   revisione; D-03 esce dalla lista perché un elenco di nomi interni si cerca.
8. **Il passo 4 è distribuito**: ogni giro porta i controlli delle regole che
   corregge (§1).

---

## 9. I requisiti proposti per la specifica

Proposti, con il nome dei controlli; il numero definitivo e il testo li scrive
nel §9.11 la sessione che fa il controllo, con i nomi dei test letti in
`tests/`. Seguono R-RIF-17 e 18 di T-10 e T-11, che già portano regole D-*.

| Giro | Requisito proposto | Regole | Controllo |
|---|---|---|---|
| 1 | R-RIF-19: ogni superficie dichiara la sua azione principale, è quella che il banco conosce, ed è l'unica con lo stile pieno | D-12 | T-12:principale |
| 1 | R-RIF-20: l'azione principale è nel primo schermo, a 375×812 e a 375×667; Esame apre sulle prove | D-01 | T-12:primo-schermo, T-12:esame |
| 1 | R-RIF-21: l'avviso «senza account» sta in ogni preparazione accanto all'azione principale, una volta, senza fondo pieno né riquadro, entro il 15 % del primo schermo | D-14, D-24, D-30 | T-12:avviso |
| 1 | R-RIF-22: nel primo schermo della Home e delle preparazioni al più quattro bersagli, barra e avatar esclusi | D-13 | T-12:scelte |
| 1 | R-ACC-02 e R-RIF-08: il controllo cambia, il requisito no (§10.1) | — | C-02, T-06 |
| 2 | R-RIF-23: i corpi del testo visibile vengono dalla scala, e al più cinque nel primo schermo | D-16 | T-13:corpi, `test_scala_css` |
| 2 | R-RIF-24: nessun titolo è più piccolo del testo che introduce né di un titolo di livello più basso; un `h1`, al più tre livelli | D-15 | T-13:titoli |
| 2 | R-RIF-25: margini, imbottiture e distanze vengono dalla scala degli spazi; fra le sezioni più spazio che dentro | D-22, D-23 | `test_scala_css`, T-13:spazi |
| 2 | R-RIF-26: al più tre pesi, nessuno sotto 400 | D-20 | `test_scala_css`, T-13:pesi |
| 2 | R-RIF-27: testo corrente e risposte ≥ 16 px, interlinea fra 1,3 e 1,6, niente giustificato né maiuscolo oltre una riga | D-17, D-18, D-21 | T-13:testo |
| 2 | R-RIF-28: due bersagli vicini a ≥ 8 px, salvo i segmenti e i link dentro una frase | D-28 | T-13:distanze |
| 2 | R-RIF-29: a 1280 px nessuna riga di testo corrente oltre i 75 caratteri | D-19 | T-13:righe |
| 2 | R-RIF-30: l'accento solo su ciò che si tocca, il colore d'errore solo sugli errori | D-25 | T-13:colori |
| 3 | R-RIF-31: una destinazione, un nome; un nome, una destinazione | D-33 | T-14:nomi |
| 3 | R-RIF-32: frasi ≤ 25 parole, paragrafi ≤ 5 frasi, Gulpease ≥ 60 per superficie | D-04, D-05, D-06 | T-14:leggibilita |
| 3 | R-RIF-33: nessuna frase ripetuta in una superficie, nessun link generico, ogni pulsante su una riga, nessun nome interno | D-03, D-08, D-10, D-11 | T-14:parole |
| 3 | R-RIF-34: le etichette di un gruppo hanno la stessa maiuscolazione | D-34 | T-14:gruppi |
| 3 | R-RIF-35: le regole che non si misurano hanno una lista di revisione con data e chi l'ha fatta | D-02, D-07, D-09, D-10, D-31, D-34 | scoperto — è una lettura, non una misura |

---

## 10. Contratti, controlli e prompt

### 10.1 Il contratto e i controlli, giro per giro

#### Giro 1 — T-12, e i due controlli che cambiano

**L'aggancio.** La pagina dichiara, nella superficie aperta:

- `data-ruolo="principale"` su **un solo** elemento visibile: un pulsante
  (`#start`, `#c-start`, `#c-esercizi`, `#t-start`, l'«Inizia» dei Segnali, la
  simulazione nella Home) oppure il contenitore di un gruppo di porte alla pari
  (le prove di Esame, le tre porte del Carteggio);
- `data-ruolo="avviso"` su ogni avviso di condizione — oggi la frase `PRIMA` e
  quella dei Segnali, `SEG_PRIMA` —, sull'elemento che ne contiene il testo.

**Le superfici**, senza account: la Home (H0, e H1 dopo una risposta), Esame,
Allenati → Carteggio, Allenati → Segnali, le preparazioni della simulazione
base, del breve, di «Scegli un argomento», della prova di carteggio, degli
esercizi su carta e di «Che tecnica serve?». Misure a 375×812 e 375×667.

**Le verifiche di T-12**, una per parte, con il nome esportato come
`PROSEGUIRE` di T-10:

- `T-12:principale` — un solo `data-ruolo="principale"` visibile per superficie,
  ed è l'elemento della mappa del banco; nel primo schermo nessun elemento fuori
  da lui ha il fondo pieno (≥ 3:1 sul fondo della pagina), barra e avatar esclusi. Il
  numero dei fondi pieni si conta **senza** leggere l'aggancio.
- `T-12:primo-schermo` — l'azione principale (per un gruppo: la sua prima
  porta) ha il bordo inferiore entro `innerHeight` a scorrimento zero, con il
  centro sotto il dito (`elementFromPoint`, come T-10).
- `T-12:esame` — in Esame, il titolo «Le prove» e la prima porta stanno prima di
  ogni campo del modulo nell'ordine del documento e nel primo schermo.
- `T-12:avviso` — nessun avviso nella Home, nel segmento Carteggio né in testa
  ai Segnali; in ogni preparazione la frase si vede (con le misure di
  `avvisoVisibile` di T-06), sta dentro un `data-ruolo="avviso"`, è al più a
  48 px (soglia nostra) dall'azione principale e non ha un altro bersaglio in
  mezzo; non ha fondo ≥ 1,5:1 né bordo su tre lati; occupa al più il 15 % del
  primo schermo. La frase si trova **per testo**: un avviso senza aggancio è
  rosso.
- `T-12:scelte` — al più quattro bersagli nel primo schermo della Home e delle
  preparazioni, barra e avatar esclusi (verde dal primo giorno sulla Home, per
  l'audit; tiene fermo).
- `T-12:aggancio` — le superfici dichiarano `data-ruolo`: sulla pagina vera è un
  difetto dichiarato fino a P-93, e le altre parti girano intanto con la mappa.

*Precisato scrivendo il banco (P-92, 24 ottobre 2026).* Le parti principale,
primo-schermo, esame, avviso e scelte misurano con la mappa e per testo, e
**non leggono l'aggancio**; è `T-12:aggancio` a dire che `data-ruolo` manca o
sta sul pulsante sbagliato, e che un avviso non sta dentro un
`data-ruolo="avviso"`. Così sulla pagina vera, dove l'aggancio non c'è ancora,
le altre parti dicono il loro difetto invece di essere tutte rosse per lo
stesso motivo. Nel conteggio dei fondi pieni restano fuori, oltre a barra e
avatar, i segmenti (`role="tab"`: uno stato, non un'azione) e gli elementi
trasparenti (`#sync`, il messaggio dell'invio, sta lì con opacità zero). Nel
conteggio dei bersagli resta fuori il ritorno della preparazione, se porta
`data-prep="chiudi"`: «Cambia attività» nella preparazione dei quiz oggi non
lo porta, e conta. Il riepilogo con un errore misura soltanto la principale:
la conservazione e l'invito hanno le loro frasi (R-ACC-02, R-ACC-03). Esame
ha due verifiche: le prove prima del modulo, e il modulo chiuso con la scelta
nel sommario (decisione B).

**I due controlli che cambiano.** C-02 (R-ACC-02) non cerca più la frase alla
prima schermata: apre la preparazione della simulazione e quella dei Segnali e
la cerca lì, prima di «Inizia»; il resto di C-02 — la frase alla fine, nessuna
scrittura, nessuna richiesta, la ricarica — resta com'è. T-06 (R-RIF-08) misura
l'avviso della preparazione, non quello «del Percorso». Il testo dei due
requisiti non cambia: cambia dove il controllo guarda, e il §5.4 della specifica
diceva già «prima di ogni avvio».

**La pagina di riferimento** (`tests/pagina-client-ridisegno.html`) prende le
superfici che non ha — Esame con le prove, il segmento Carteggio con le tre
porte, i Segnali con «Inizia», le preparazioni mancanti — nella forma minima che
T-12 legge, con gli agganci e l'avviso accanto a «Inizia». Il suo avviso nella
Home (`#avviso-prova`) esce.

**Le rotture**, almeno: l'avviso rimesso in testa alla Home; l'avviso in un
riquadro bordato nella preparazione; l'avviso lontano da «Inizia», con
«Cambia attività» in mezzo; l'avviso tolto da una sola preparazione (è il
nuovo C-02); l'avviso con `visibility:hidden`; la frase senza `data-ruolo`;
`data-ruolo="principale"` sul pulsante sbagliato; due pulsanti pieni nel
riepilogo con un errore; Esame con il modulo prima delle prove; «Inizia» dei
Segnali sotto la piega a 375×667. **Le difese da togliere una alla volta:** la
ricerca dell'avviso per testo (passa verde la frase senza aggancio); il
conteggio dei fondi pieni senza aggancio (passa verde il secondo pulsante
pieno); il controllo «niente in mezzo» (passa verde l'avviso lontano); la
misura a 667 (passano verdi i Segnali).

**Sulla pagina vera**, misurato prima di dichiararlo: rossi attesi
`T-12:avviso` (Home, Carteggio, Segnali, tecniche), `T-12:esame`,
`T-12:primo-schermo` (Esame, Carteggio, Segnali, simulazione, prova di
carteggio, per l'audit), `T-12:principale` nel riepilogo con un errore,
`T-12:aggancio`; e C-02 e T-06 nella forma nuova, dove la frase manca nella
preparazione di carteggio e dei Segnali. Una riga ciascuno nei «Difetti aperti
dichiarati». Se una di queste è verde, la si scrive e non si dichiara: l'audit
è del 21 ottobre, P-91 ha cambiato il runner.

#### Giro 2 — `test_scala_css` e T-13

**Il contratto della scala.** I valori stanno **nel controllo**, non nella
pagina: `tests/test_interfaccia.py` porta la scala dei corpi, degli spazi e dei
pesi, e la pagina la dichiara in `:root` con i nomi che il contratto fissa
(per esempio `--t-12…--t-30`, `--s-4…--s-48`). Un controllo che leggesse la
scala dalla pagina accetterebbe qualunque scala: è il controllo che rassicura.
Cambiare un numero è un commit su `main` e uno su `ui/*`, ed è voluto.

**Contratto consegnato da P-94 (24 ottobre 2026).** La sorgente dei numeri
è `SCALA_CSS` in `tests/test_interfaccia.py`; il banco riceve quel contratto,
non legge i valori attesi dalla pagina. In un unico `:root`:

- `--t-12`, `--t-14`, `--t-16`, `--t-19`, `--t-24`, `--t-30`, `--t-40`,
  ciascuno nel numero di px del nome. 40 è ammesso sui valori calcolati solo
  negli h1 della Home sopra 900 px; nessun altro testo lo può usare.
- `--s-4`, `--s-8`, `--s-12`, `--s-16`, `--s-24`, `--s-32`, `--s-48`, in px;
  `--w-400`, `--w-600`, `--w-700` per i pesi.
- `--lh-testo:1.45`, `--lh-titoli:1.2`, `--testo-max:480px`.
- `--acc:#076f99` per le azioni e le loro parti; `--ko:#a4261d` per gli
  errori e le risposte sbagliate; `--warn:#765000` per gli avvisi. Sono
  ammessi alias che risolvono esattamente a questi valori; il verde del
  giusto (`--ok:#126832`) rimane nel suo ruolo, misurato anche lui. I ruoli sono nostri (D-25).

**La larghezza è stata misurata**, non scelta in ch: con Manrope caricato,
testo a 16 e viewport 1280×800, 520 px sul riferimento davano ancora 76
caratteri in una risposta; **480 px danno al massimo 72** nel giro completo,
contro il limite di 75. La larghezza non era un numero già fissato da C:
questo è il valore proposto dal controllo, da mostrare all'autore con il
prima/dopo della pagina. Gli altri numeri di C non cambiano.

Il descrittore `font-weight` dentro `@font-face` descrive quali pesi contiene
il file variabile: non è uno stile usato e non entra nel conteggio statico.
Gli spazi `auto` sono ammessi: T-13 legge il valore tipizzato per distinguerli
dal margine in px risultante dal centraggio. Bordi, dimensioni e posizioni
non sono spazi della scala. Le eccezioni geometriche esatte della testata e
della riserva di 90 px per la barra stanno in «Valori fuori scala»; nel
browser sono limitate a selettore, proprietà e valore, non al solo numero.

**Il perimetro del testo.** Il banco misura nodi di testo visibili, anche
fuori dal primo schermo; non conta i figli di un details chiuso. D-17 si
applica a paragrafi, elementi di elenco, domanda e risposte; note ed etichette
fuori da questi blocchi possono usare 12 o 14. D-18 è fissata dalla decisione C a 1,45,
non al solo intervallo di I-27; i titoli a 1,2. D-20 controlla anche i tratti
in grassetto oltre cinque parole; D-21 anche il paragrafo centrato oltre due
righe (soglia nostra). Le righe si uniscono per coordinata fra nodi di testo,
così un link o un strong non spezza artificialmente il conto. Gli h1 sono
richiesti nelle viste e nelle preparazioni; i pannelli Info e Accedi hanno
un titolo h2, coerente con il loro ruolo di dialogo sopra la vista.

La distanza D-28 è la minima fra i rettangoli (euclidea sulle diagonali),
con i radio e le caselle misurati sulla loro etichetta; non si confrontano
un controllo e il suo discendente. D-23 confronta sezioni consecutive e
gruppi diretti con h2, se disposti verticalmente. Le misure incomplete sono
un rosso del banco distinto dai difetti dichiarabili.

**Decisione E nel controllo.** `T-13:home`, verde già su main: **78 parole**
nella Home H0 a 375×812. Il criterio è quello di P-93: nodi di testo sotto
`#v-home`, token con almeno una lettera, rettangolo del genitore che
interseca il viewport, intestazione e navigazione escluse. Non si contano
solo le righe completamente libere dalla barra. Il riferimento ne ha 77;
una rottura aggiunge 79 parole e deve fallire. Nessuna dichiarazione di
difetto per questo controllo.

**`test_scala_css`, statico, senza browser.** In `site/index.html` (i blocchi
`<style>`, gli attributi `style=` e le stringhe degli script che scrivono
stili), ogni `font-size`, `margin*`, `padding*`, `gap`, `font-weight` vale `0`,
`auto`, `inherit`, un `var()` della scala, o un numero della scala; `calc()` di
soli token è ammesso. Le eccezioni stanno in una tabella nuova di
[eccezioni-interfaccia.md](eccezioni-interfaccia.md), «Valori fuori scala», con
il perché — per esempio l'altezza dell'intestazione, `--altezza-testata`, che
serve a misurare e non a spaziare. Provato al contrario su frammenti di CSS
scritti nel test, come `test_voci_barra`.

**T-13, nel browser**, sulle superfici di T-08/T-09 (`VISTE_RIF`), il runner con
una risposta, il riepilogo e le preparazioni, a 375×812 e a 1280×800: i valori
**calcolati** dei nodi di testo visibili stanno nella scala (prende `em`, `%`,
`clamp()` che lo statico non vede); al più cinque corpi nel primo schermo;
`T-13:titoli` (D-15 allargata: per ogni titolo, il primo blocco di testo che lo
segue non è più grande); `T-13:testo` (D-17, D-18, D-21); `T-13:distanze` (D-28:
distanza fra i rettangoli di due bersagli ≥ 8 px, esclusi i figli di
`[role="tablist"]` e i link dentro un paragrafo, come R-RIF-12); `T-13:righe`
(D-19 a 1280 px, righe da `Range.getClientRects()`); `T-13:spazi` (D-23: fra due
sezioni della vista più spazio che fra due figli della stessa); `T-13:colori`
(D-25, sui token di ruolo).

**Le rotture**, almeno: un corpo a 13 px; un margine a 10 px nel CSS e uno in uno
`style=` scritto da uno script; un peso 650; un titolo di sezione a 13 px sopra
un testo a 16; i tag a 6 px l'uno dall'altro; una riga a 90 caratteri a 1280 px;
l'accento su un testo che non si tocca; un `clamp()` fuori scala. **Difese da
togliere:** le stringhe degli script nello statico; i valori calcolati nel
browser; l'eccezione dei segmenti (diventano rossi i segmenti giusti).

**Sulla pagina vera** è rosso quasi tutto, per l'audit: corpi, spazi, pesi,
titoli, distanze, righe, e le risposte a 15,5. Il giro 2 è il più largo da
dichiarare e il più semplice da chiudere: una passata sul CSS.

**Collaudo di P-94.** La pagina di riferimento passa il banco per intero.
Venti rotture nuove di T-13 sono rosse ciascuna per il suo motivo: corpi e
clamp, sei corpi nel primo schermo, titolo sotto il testo, testo piccolo,
interlinea, giustificato, maiuscolo, margine nel foglio e nello script,
sezioni senza separazione, peso 650 e frase in grassetto, tag a 6 px,
riga oltre 90 caratteri, accento/rosso/verde/ambra fuori ruolo, Home oltre 78
parole. Lo statico prova frammenti in fogli, attributi e script, le scritture
con punto, parentesi quadre, proprietà logiche, setProperty e cssText; tre
controprove cambiano i token del riferimento, che il contratto deve rifiutare.

**Difese tolte una alla volta.** Nello statico, senza le stringhe e le
assegnazioni degli script le sei scritture fuori scala passano verdi.
Su copie temporanee del banco, senza la verifica dei valori calcolati il
clamp a 13 px passa verde; senza l'eccezione dei segmenti il riferimento è
rosso per Quiz/Carteggio/Segnali a 0 px. Il banco originale non è stato
indebolito. Manrope è stato verificato anche separatamente: famiglia del
body Manrope, FontFace loaded, document.fonts.check vero, max-width 480 px.

**Sulla pagina vera:** dieci verifiche T-13 rosse e quattro statiche, ognuna
con la propria riga e i numeri misurati nei «Difetti aperti dichiarati».
Home H0: 78 parole, verde senza dichiarazione. I valori delle scale di C
restano quelli decisi; l'approvazione visiva della pagina resta alla
correzione su ui/*, come dice il §11. C'è un solo quesito fisso nel runner,
base-1293 dopo una risposta errata: rende ripetibili tipografia e riepilogo,
non è una verifica dell'intera banca. I limiti del §12 restano.

**Trovato sul riferimento, non sul sito.** La tipografia nuova aveva
spinto l'avvio della simulazione a 692–736 px su 667 e ingrandito l'avviso
del carteggio fino al 16 % del primo schermo. Nel riferimento gli avvii
precedono ora le opzioni; la nota del carteggio ha un blocco suo, a 14 px.
Il campo file rientra a 320 px, con la larghezza del controllo misurata,
senza nascondere lo sbordo. È stata tolta una seconda regola di fondo pieno
che mascherava una rottura di T-12. Tutti i controlli precedenti passano.

**Tempo e suite (RG_TEMPI=1):** interfaccia 3.863 in 5 min 42.4 s (342.444 s); T-13 sulla pagina vera 2111 ms, sul riferimento 983 ms. Le venti rotture sommano
32229 ms di lavoro nelle corsie parallele: non sono secondi da
sommare alla durata della suite. Prima dell'avvio definitivo la 8620 è
stata osservata libera per 90 s consecutivi. Motore 215/219 (quattro salti
previsti), server 89/89 con Node di sistema e con Node 24.22.0 ufficiale,
archivio verificato contro SHASUMS256.txt, dati 225, specifica 1.096;
guardiano e documentazione verdi. Nessun file in site/, nessun numero di
versione o tag cambiato, nessun push.

#### Giro 3 — T-14

**T-14:nomi** (D-33): una visita, le coppie (destinazione, etichetta) di tutto il
documento, la tabella «Nomi diversi voluti». **T-14:leggibilita** (D-04, D-05,
D-06) e **T-14:parole** (D-03, D-08, D-10 una riga, D-11) sul testo visibile
delle superfici di T-12 e T-13, con l'elenco dei nomi interni e quello dei link
generici nel banco; il testo dei quesiti, delle risposte e degli esercizi è
escluso, perché è del decreto. **T-14:gruppi** (D-34): barra, segmenti, porte
di Esame e della Home in *sentence case*, nomi propri esclusi da un elenco.

**La lista di revisione** sta in fondo a questo file, nel §12, con una riga per
regola, e chi la usa scrive data, schermata e esito nel collaudo della sua
sessione (come `docs/runner-quiz-ux.md` per P-91). Non è un controllo e non si
dichiara verde.

**Le rotture**, almeno: «Simula la prova» e «Simula il quiz base» sulla stessa
porta; la stessa etichetta su due destinazioni; una frase di 30 parole; un
paragrafo di sei frasi; un testo con Gulpease 50; una frase ripetuta nella
stessa superficie; «Scopri di più»; un pulsante su due righe a 375 px;
«Mirata» in schermata; «specchio di poppa» in un quesito, che deve restare
verde.

### 10.2 I prompt proposti

I numeri e la riga della coda li dà la regia; qui ci sono le proposte complete
del giro 1 e lo schema dei giri 2 e 3.

#### P-92 — Claude, `main`: il contratto e T-12 per il giro 1

```
Sessione P-92, su main, nel checkout principale. Leggi AGENTS.md,
docs/regole-disegno-progetto.md (§4 e §10.1, «Giro 1») e in
docs/idee-dopo-gli-account.md la scheda I-27 (le regole D-01, D-12, D-13,
D-14, D-24, D-26, D-30 e «L'audit delle schermate principali», punti 3–6).
Prima guarda le decisioni A e B del §11 del progetto: se l'autore non le ha
prese, fermati e dillo.

1. Nel banco del client (tests/client_account.mjs) il gruppo T-12, con le
   parti del §10.1: principale, primo-schermo, esame, avviso, scelte,
   aggancio. Il banco trova le azioni con la mappa degli identificatori che
   conosce già, e incrocia data-ruolo con la mappa, con il testo dell'avviso
   e con il conteggio dei fondi pieni: non si fida dell'aggancio. Riusa
   avvisoVisibile di T-06 e le misure di contrasto di T-08.
2. C-02 e T-06 nella forma nuova del §10.1: la frase prima di «Inizia», in
   ogni preparazione, non nella Home.
3. La pagina di riferimento del client con le superfici che T-12 legge, gli
   agganci, l'avviso accanto a «Inizia» e non nella Home; le rotture del
   §10.1 e le difese tolte una alla volta, ognuna rossa per il suo motivo.
4. Misura la pagina vera. Quello che è rosso per il motivo giusto va nei
   «Difetti aperti dichiarati» di docs/eccezioni-interfaccia.md, una riga
   per verifica; quello che è verde si scrive e non si dichiara.
5. Nella specifica, §9.11: i requisiti del giro 1 (R-RIF-19…22 proposti nel
   §9 del progetto), con il nome dei test letti in tests/; R-ACC-02 e
   R-RIF-08 con il controllo nuovo. Il §5.4 e il §7.1 non cambiano.

Niente in site/. Le cinque suite verdi, l'interfaccia con la 8620 guardata
libera per 90 s; misura il tempo con RG_TEMPI=1 e scrivilo. Voce in fondo a
[Unreleased], un commit con i soli file toccati, niente push. Chiudi con il
resoconto di docs/prossime-sessioni.md.
```

#### P-93 — ChatGPT, `ui/main`: la pagina del giro 1

*La versione che vale è quella di `docs/prossime-sessioni.md`, scritta dopo
P-92 con lo stato dei controlli; questa è la stessa.*

*Fatto il 24 ottobre 2026 (`e5d79f9` su `ui/main`, fuso su `main`): le undici
verifiche di T-12 girano verdi sulla pagina vera, e le righe dichiarate sono
uscite. Le misure di prima e dopo, con le coordinate, stanno in
`docs/regole-disegno-ux.md`.*

```
Questo prompt è per ChatGPT, nel worktree ~/Software/rotta-giusta-ui,
sul ramo ui/main, aperto in modalità Local. Se sei in un'altra cartella o
su un altro ramo, fermati e dillo, senza scrivere niente.

Sessione P-93: l'avviso detto una volta, Esame che apre sulle prove,
«Inizia» in vista. Allinea ui/main a main (git merge --ff-only main) e
leggi AGENTS.md, docs/regole-disegno-progetto.md (§4, §10.1 «Giro 1» e le
decisioni del §11), e in docs/idee-dopo-gli-account.md la scheda I-27.

Che cosa deve essere vero dopo, senza account, a 375×812 e a 375×667:
- l'avviso «Senza account le risposte valgono solo finché…» sta in ogni
  preparazione accanto all'azione principale, senza un altro bersaglio in
  mezzo, come testo e non come riquadro bordato; non sta in testa alla
  Home, al segmento Carteggio, ai Segnali, a «Che tecnica serve?». Per i
  Segnali, la frase dei punteggi accanto a «Inizia». La Home dice il
  fatto una volta, con la frase dell'introduzione.
- Esame apre sulle prove; «Che cosa stai preparando?» e la data come ha
  deciso l'autore (§11, B).
- in ogni superficie del §10.1 l'azione principale è nel primo schermo, ed
  è l'unica con il fondo pieno, anche nel riepilogo con un errore.
- gli agganci data-ruolo="principale" e data-ruolo="avviso" del §10.1;
  il ritorno di ogni preparazione porta data-prep="chiudi" — nella
  preparazione dei quiz «Cambia attività» oggi non lo porta, e T-12:scelte
  lo conta fra i bersagli.
- nella Home esce «Tutte le attività sono disponibili. Senza account non
  conserviamo risposte o preferenze.» (decisione F del §11): tolto l'avviso,
  la direbbe due volte; C-18 non la pretende più dal P-92.

I controlli sono T-12, C-02 e T-06 nel banco del client. C-02 e T-06
sono verdi sulla pagina vera; T-12 e' rosso in undici verifiche, dichiarate
in docs/eccezioni-interfaccia.md (le righe T-12:*), e T-12:principale e'
verde gia' oggi. Togli le righe nello stesso
commit della correzione; i gruppi devono girare verdi per intero sulla
pagina vera. Restano com'erano: R-ACC-02 (la frase prima di cominciare e
alla fine), R-UX-03 («Sei tu a giudicare» prima di Inizia nel Carteggio),
i tre posti dell'invito, la porta della simulazione in un tocco dalla Home,
i tragitti di N-01.

Prima e dopo, con schermate guardate e rettangoli letti dalla pagina, a
375×667, 375×812 e 1280×800: Home, Esame, Carteggio, Segnali e le
preparazioni del §10.1. Scrivi in px dove stanno l'avviso e l'azione
principale.

Nessun file del motore, dei test o dei dati. Se serve un controllo nuovo o
un aggancio diverso, fermati e scrivilo nel §10 di
docs/regole-disegno-progetto.md. Le cinque suite verdi, l'interfaccia con
la 8620 guardata libera per 90 s. Voce in fondo a [Unreleased], un commit
con il trailer, versione invariata, niente push. Chiudi con il resoconto
di docs/prossime-sessioni.md.
```

#### Giri 2 e 3, in breve

- **Giro 2, Claude su `main`:** i numeri della scala decisi (§11, C) nel
  contratto; `test_scala_css`, T-13, le tabelle «Valori fuori scala» e le
  rotture; i requisiti R-RIF-23…30; i difetti dichiarati. **Poi ChatGPT su
  `ui/main`:** il blocco `:root` unico, una passata sul CSS, gli occhielli che
  diventano titoli o paragrafi, le righe e le distanze; le righe dichiarate
  tolte; prima e dopo con le schermate.
- **Giro 3, Claude su `main`:** T-14, la tabella «Nomi diversi voluti», gli
  elenchi del banco, la lista di revisione nel §12 di questo file; i requisiti
  R-RIF-31…35. **Poi ChatGPT su `ui/main`:** i nomi, le frasi e i due
  paragrafi sotto Gulpease 60, e la lista di revisione compilata con data ed
  esito.

---

## 11. Decisioni per l'autore

Ognuna con la raccomandazione; A e B servono prima di P-92, e l'autore le ha
prese il 24 ottobre 2026.

**A. L'avviso «senza account» accanto a «Inizia», invece che in testa alla
Home?** R-ACC-02 vuole la frase «prima di cominciare»; il §5.4 della specifica
la mette «prima di ogni avvio», e il §7.1 non la elenca fra le cose della Home.
*Raccomandazione: sì.* In ogni preparazione, accanto a «Inizia», come testo e
non come riquadro; nella Home resta la frase dell'introduzione, che dice il
fatto in una riga. Chi apre la Home e se ne va non ha perso niente; chi sta per
cominciare legge la frase nel momento in cui decide. È più vicino alla filosofia
(«una perdita che scegli tu è una scelta») di un riquadro che parla a chi non ha
ancora fatto niente, e il controllo diventa più stretto di oggi: la frase in
ogni preparazione, non in una sola schermata.
*Deciso dall'autore il 24 ottobre 2026, come raccomandato.*

**B. Esame: le prove in testa, e «Che cosa stai preparando?» sotto o chiuso?**
*Raccomandazione: sotto, chiuso*, in un `details` il cui sommario dice la scelta
e la data («Stai preparando: motore, prima patente · esame il 12 dicembre», o
«Non l'hai detto»), e si apre toccando il sommario. Le scelte filtrano quali prove mostrare, quindi
il riassunto accanto alle prove serve; il modulo intero no. «Che cosa stai
preparando?» resta anche nel Profilo e nell'onboarding.
*Deciso dall'autore il 24 ottobre 2026, come raccomandato.*

**C. Chi fissa i numeri delle scale?** *Raccomandazione:* Claude li propone nel
contratto del giro 2, partendo dalle misure di oggi (§5) e scegliendo i valori
più vicini a quelli che la pagina usa già, così il cambio si vede poco; ChatGPT
li prova sulla pagina e mostra prima e dopo a 375 e 1280 px; **l'autore approva
guardando le schermate, non leggendo i numeri**; poi i numeri stanno nel
controllo, su `main`. Un numero cambiato dopo è una decisione nuova, non un
ritocco.
*Deciso dall'autore il 24 ottobre 2026, come raccomandato, con questi numeri
come proposta di partenza del giro 2:* corpi 12 · 14 · 16 · 19 · 24 · 30, più 40
per il solo titolo della Home sopra i 900 px al posto del `clamp()`; le
risposte del runner da 15,5 a 16 px (D-17); arrotondamento al valore più
vicino — 11–12,5 → 12, 13–15 → 14, 15,5–17 → 16, 18–21 → 19, 22–26 → 24, 28 e
oltre → 30. Spazi 4 · 8 · 12 · 16 · 24 · 32 · 48, al più vicino e a parità
verso l'alto (10 → 12, 14 → 16, 20 → 24, 28 → 32); fuori scala, con il motivo
in una tabella, l'altezza della testata e il margine di 90 px sotto la barra.
Pesi 400 · 600 · 700 (500, 550, 650 → 600; 750, 800 → 700). Interlinea 1,45 il
testo, 1,2 i titoli; una larghezza massima del testo misurata perché dia al più
75 caratteri per riga con Manrope a 1280 px. ChatGPT mostra prima e dopo
Home, Allenati, Esame, runner, riepilogo e una preparazione, a 375 e 1280 px.

**D. Il punto 7 della Home: l'immagine sul telefono.** È del carattere del
marchio, I-27 passo 6. *Raccomandazione:* fuori da questi tre giri, deciso con
il passo 6; e intanto un vincolo per quando si deciderà: un'immagine sul
telefono non deve spingere l'azione principale fuori dal primo schermo a
375×667, che T-12 misurerà. Tolto il riquadro dell'avviso (121 px), nella Home
c'è posto.
*Deciso dall'autore il 24 ottobre 2026, come raccomandato:* fino al passo 6 la
Home sul telefono resta senza immagine. Il limite per quando si deciderà:
una striscia decorativa (`alt=""`) sotto il titolo, alta al più 96 px, e
«Simula il quiz base» nel primo schermo a 375×667. Il posto liberato
dall'avviso (circa 145 px, margini compresi) è una stima: lo misura il giro 1.

**E. La soglia di D-02 (parole nel primo schermo della Home).** I-27 proponeva
≤ 60, da fissare dopo l'audit; oggi 106. *Raccomandazione:* rimandare a dopo il
giro 1, quando l'avviso è uscito, e fissarla sulla misura di allora; fino ad
allora resta nella lista di revisione.
*Deciso dall'autore il 24 ottobre 2026:* due soglie, una per giro. Nel giro 1
il conteggio misurato a 375×812 nella Home senza risposte, tolto l'avviso
(stima: circa 80 parole, 106 meno le 26 dell'avviso), diventa un tetto che non
si supera; nel giro 3 la soglia è ≤ 60 parole, nostra, quella che I-27
proponeva, raggiunta con la riscrittura di F.
*Misurato da P-93 il 24 ottobre 2026: 99 parole prima, **78 dopo**, a 375×812
nella Home senza risposte (criterio in `docs/regole-disegno-ux.md`, «Parole
della Home e limite del giro 1»). Il tetto del giro 1 è 78. Fino al giro 2
nessun controllo lo teneva: P-94 lo porta nel banco, perché la scala dei corpi
cambia quante parole stanno nel primo schermo.*

**F. Le tre schede che ripetono la barra, e «Che cosa non torna»** (Home,
punti 4 e 8 dell'audit). Le schede sono nella specifica — §7.1, *H0*: «le
anteprime delle quattro sezioni» —, quindi toglierle è una decisione, non un
ritocco. *Raccomandazione:* nel giro 3, ridotte a una riga per sezione (la barra
le nomina già) e «Che cosa non torna» in tre frasi, una per argomento, con il
§7.1 riscritto da chi fa la merge; non nel giro 1, che deve restare piccolo e
misurabile.
*Deciso dall'autore il 24 ottobre 2026, come raccomandato.* Nel giro 3 le tre
schede diventano tre righe di link — Allenati, Esame, Progressi, ognuna con
una frase — più «Come funziona»; escono «Apri Carteggio» e «Apri Segnali»,
che ripetono Allenati. Il §7.1, *H0*, passa da «le anteprime delle quattro
sezioni» a «una riga per sezione». «Che cosa non torna» diventa «I limiti,
detti prima», in tre frasi: la banca del decreto del 2022 con i numeri contati
dalla banca caricata (oscurati, note dopo la risposta, figura mancante); il
lavoro sulla carta giudicato da chi studia; nessuna newsletter e nessun cookie
di tracciamento; sotto, il link alle note e alle fonti. **Un pezzo va nel
giro 1:** tolto l'avviso, la Home direbbe due volte che senza account non resta
niente (D-08), quindi esce la frase «Tutte le attività sono disponibili. Senza
account non conserviamo risposte o preferenze.». È fra le frasi che C-18
(R-ACC-57) pretende nella pagina: prima della correzione, su `main`, Claude la
toglie dall'elenco di C-18 e dal §11.2 del progetto del client.

---

## 12. Che cosa non si copre

- **L'eleganza.** Le regole danno chiarezza, semplicità e coerenza; un
  controllo verde non dice che una pagina è bella. Il carattere del marchio è il
  passo 6, dell'autore.
- **Che una persona capisca.** Nessun controllo sostituisce una lettura vera
  (ISO 24495-1, principio 4; Q-PROVE). Le letture dei bot (I-22…I-26) restano un
  segnale debole.
- **Lo stato con l'account e quello con risposte senza account**, salvo dove un
  gruppo già entra in un account; Safari; il gesto vero; il tema scuro; le pagine
  legali, se il giro 2 non le include.
- **Il contenuto dei quesiti e degli esercizi**, che è del decreto e resta fuori
  da ogni misura di testo.

**La lista di revisione** (la compila chi disegna, con data e schermata): D-02
che cosa serve nel primo schermo; D-07 verbi attivi; D-09 titoli che
descrivono, e i titoli-domanda — «Che cosa vuoi fare adesso?», «Che tecnica
serve?» — dove GOV.UK e Designers Italia non sono d'accordo; D-10 le parole dei
pulsanti (al più quattro, soglia nostra); D-31 il tono degli errori; D-34 verbo
o nome nello stesso gruppo; la gara di misura fra le due azioni della Home.

---

## Registro

- **23 ottobre 2026 — prima stesura.** Il piano dei passi 2–4 dell'ordine del
  21 ottobre, in tre giri con il metodo di T-10, T-11 e P-91. Letti la scheda
  I-27, la pagina e i banchi: C-02 e T-06 leggono l'avviso nella Home, e la
  specifica non lo chiede lì; da qui il cambio di controllo di R-ACC-02 e
  R-RIF-08 nel giro 1. D-14 misurata con tre verifiche discrete al posto
  dell'indice area × contrasto; D-28 e D-19 spostate nel giro 2; il giro 3 fatto
  delle parole e dei nomi. Sei decisioni per l'autore, A e B prima di P-92.

- **24 ottobre 2026 — P-94, il giro 2 nei controlli.** Contratto numerico,
  test_scala_css, T-13 e R-RIF-23…30; venti rotture e difese provate al
  contrario; quattordici difetti dichiarati. Misure, tempi e limiti nel
  §10.1, «Giro 2». Nessuna modifica alla pagina vera.
