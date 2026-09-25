# Il recupero con una frase — progetto di realizzazione

**Aperto il 25 settembre 2026.** Documento di lavoro, non specifica.
**Parte da:** `docs/adr/ADR-002-recupero-con-una-frase-non-con-un-account.md`, che
ha deciso l'architettura e ha lasciato aperte quattro scelte di realizzazione:
la derivazione della chiave, la frase, il formato del blocco, l'endpoint. Qui
ci sono le quattro, più il testo della schermata che viene **prima** della
frase.
**Territorio:** neutro. Le proposte accolte entrano in `docs/specifica.md` alla
merge, per mano di chi la fa (§0 della specifica).
**Niente codice in questa sessione:** l'interfaccia è in ridisegno, e il
cifrario vive nella pagina (ADR-002, «Quello che non cambia»).

Ogni scelta porta un'etichetta: **Proposto** (la mia raccomandazione, con il
perché) oppure **Aperto** (manca una decisione, e la riga dice chi la prende).

---

## 1. Tre regole, prima dei dettagli

Il resto del documento discende da queste. Sono la traduzione, in termini di
realizzazione, di «non è sincronia, è il file di export parcheggiato da qualche
parte».

1. **Si legge solo a mano.** Nessun percorso del codice scarica il blocco e lo
   fonde senza che la persona l'abbia chiesto con un tocco. La lettura passa da
   `fondiArchivio()` e dichiara quante righe ha preso, quante aveva, quante ha
   scartato (R-STA-03). Il motore non sa che il blocco esiste.
2. **Nessuna scrittura cieca.** Si sovrascrive solo un blocco che *questo*
   dispositivo ha già visto: scritto lui, o letto lui. Un telefono nuovo con
   l'archivio vuoto non può coprire mesi di risposte depositate da un altro.
   È il guasto che ha fatto la 0.4.2 — la copia vuota che vince sulla piena —
   e qui si chiude con una precondizione HTTP, non con la buona volontà del
   client (§5).
3. **«Salvato» si scrive solo dopo averlo riletto.** Un 200 del server dice che
   sono arrivati dei byte, non che si possono decifrare. Dopo ogni deposito il
   client rilegge il blocco, lo decifra, conta le righe, e solo se il conto
   torna scrive «salvato». È l'autodiagnosi offline della 0.19.2 applicata al
   backup: si apre la risposta, non si guarda la chiave.

---

## 2. La frase

**Proposto.** Dodici parole, **128 bit casuali** da `crypto.getRandomValues`
più **4 bit di controllo**, codificate come BIP-39: 132 bit in 12 gruppi da 11,
ognuno un indice in un dizionario di 2.048 parole.

**Il dizionario è quello italiano di BIP-39**, non uno scritto da noi. Chi
studia è italiano; un dizionario pubblicato e già usato da milioni di persone è
stato ripulito da parole ambigue meglio di quanto faremmo noi. Non serve
compatibilità con i portafogli di criptovalute, e non la cerchiamo: dal
dizionario prendiamo le parole, non la derivazione (§3).

**Che cosa compra la somma di controllo, misurato sull'aritmetica.** Una parola
trascritta male cambia 11 bit; il controllo ne ha 4, quindi un errore su una
parola viene preso **15 volte su 16 nel browser, prima di chiedere niente al
server**. Il sedicesimo arriva al server come un'altra identità e riceve un 404
— ed è il motivo per cui il testo del 404 deve nominare anche l'errore di
trascrizione (§6.3), invece di dire soltanto «nessun salvataggio».

**Si mostra una volta, e poi si controlla che sia stata scritta.** Dopo averla
mostrata, l'app chiede tre parole in posizioni a caso. Solo se tornano il primo
deposito parte. Una frase mostrata e mai scritta produce un salvataggio che
nessuno potrà aprire, cioè un pulsante verde che protegge zero: il guasto di
casa, in forma di sicurezza.

**La frase non si conserva nel browser.** Si conserva la chiave madre di §3,
come `CryptoKey` **non estraibile** in IndexedDB: con quella il dispositivo può
continuare a depositare, ma la frase non si può rileggere da nessuna parte.
Chi l'ha persa e ha ancora il telefono crea una frase nuova, deposita, e
cancella il vecchio blocco (§6.4).

**La chiave sta in un database IndexedDB suo**, `rotta-giusta-recupero`, e non
come store nuovo di `open-patente-nautica`. Aggiungere uno store a quel database
vuol dire alzarne la versione, cioè una migrazione sull'**unica copia**
dell'archivio di chi studia. Il backup non vale quel rischio, e non deve
poterlo toccare.

**Se IndexedDB non si apre** (Safari in navigazione privata, §3.2 della
specifica), la `CryptoKey` non si può tenere: `localStorage` salva stringhe. In
quel caso il deposito automatico non c'è, e la scheda lo dice.

### Da misurare, non da assumere

- Che il dizionario italiano di BIP-39 abbia **prefissi di quattro lettere
  unici**, come quello inglese. Se sì, si può completare la parola dopo quattro
  lettere e l'inserimento su telefono diventa tollerabile. Non l'ho verificato.
- **La licenza del file**, prima che entri nel repo: `strumenti/controlla.py`
  fallisce su materiale di terzi di provenienza non dichiarata, e deve
  continuare a farlo. La provenienza va dichiarata nel README come per il
  decreto.

---

## 3. La derivazione

**Proposto.** Dall'entropia della frase, **HKDF-SHA256**, nativo in WebCrypto,
con due uscite indipendenti:

```
E  = i 16 byte dell'entropia, ricavati dalle 12 parole (controllo verificato)
M  = HKDF-SHA256 importata da E                      ← la chiave madre, non estraibile
A  = HKDF(M, sale="rotta-giusta/recupero", info="accesso/v1")   → 32 byte
K  = HKDF(M, sale="rotta-giusta/recupero", info="cifratura/v1") → AES-256-GCM, non estraibile
I  = SHA-256(A)                                      ← calcolato dal server, mai dal client
```

- **A** è la credenziale: il client la manda, il server non la conserva.
- **I** è l'identificatore che il server conserva. Chi ruba il database del
  server ha `I` e i blocchi: non può leggerli (manca `K`) e **non può
  sovrascriverli** (servirebbe la controimmagine di `I`).
- **K** non lascia mai il browser. `A` e `K` escono dalla stessa `M` con `info`
  diversi: sapere `A` non dice niente su `K`.

### Perché niente PBKDF2 lento, niente Argon2

Una derivazione lenta serve a rendere costoso indovinare un segreto **scelto da
una persona**, che ha poca entropia. Qui il segreto è generato: 2¹²⁸ tentativi
sono fuori portata con o senza rallentamento. Argon2 non esiste in WebCrypto —
servirebbe un modulo WASM, cioè **una dipendenza**, che `AGENTS.md` esclude.
PBKDF2 con centinaia di migliaia di iterazioni costerebbe secondi su un telefono
vecchio in cambio di sicurezza nulla.

**La condizione va scritta accanto al codice, perché è quella che fra sei mesi
qualcuno toglierebbe:** questa scelta regge **solo finché la frase non si può
scegliere**. Un giorno in cui compare «scegli la tua frase» è il giorno in cui
la derivazione va cambiata, e con lei la versione del formato (§4).

La derivazione di BIP-39 (PBKDF2, 2.048 iterazioni, per il seme dei portafogli)
non si usa: fa un altro mestiere, e usarla suggerirebbe una compatibilità che
non vogliamo. Una frase di Rotta Giusta **non è** la frase di un portafoglio.

---

## 4. Il formato del blocco

### Dentro: il file di export, identico

**Proposto.** Il testo in chiaro è **esattamente l'oggetto di `esporta()`** —
`{app, versione, esportato, righe, segPunti}` — senza un campo in più né in
meno. Ne discendono due cose.

- **Il ripristino è `importa()`**, con un oggetto al posto di un file. Stessa
  funzione, stessi conteggi dichiarati, stesso ricalcolo dello specchio. Non si
  scrive una seconda porta d'ingresso nell'archivio: è la risposta più corta
  possibile all'obiezione della seconda contabilità.
- **Un blocco decifrato si può salvare come file** e ricaricare da Info. Se un
  giorno l'endpoint sparisse, chi ha la frase non perderebbe niente.

### Fuori: 18 byte di testata e il cifrato

```
offset  byte  campo
0       4     "RGBK"                 magia: questo è un blocco di Rotta Giusta
4       1     versione formato = 1   sconosciuta → errore dichiarato, mai «vuoto»
5       1     riservato = 0
6       12    IV casuale, nuovo a ogni deposito
18      n     AES-256-GCM(K, IV, AAD = byte 0..17)  — cifrato e tag da 16 byte
```

Il cifrato contiene:

```
4 byte   lunghezza del gzip, big-endian
n byte   gzip(JSON)            ← CompressionStream('gzip'), nativo
resto    zeri, fino al primo multiplo di 16 KiB
```

**La testata entra nell'AAD**, quindi un byte cambiato nella versione fa
fallire l'autenticazione invece di far leggere il blocco con le regole
sbagliate.

**Il riempimento a 16 KiB è deliberato.** Il server vede la dimensione, e la
dimensione dice quanto hai studiato. Con il riempimento la dice all'ingrosso —
un gradino ogni **~700 risposte** — e lo si dichiara in schermata invece di
fingere che il server non sappia niente.

### Quanto pesa, misurato

Archivi sintetici con righe nella forma vera (`_t`, `uid`, `kind`, `item_id`,
`ts` con offset, `ms`, `mode`, `correct`, `sim_uid`) e `item_id` pescati dalla
banca, 25 per sessione:

| Risposte | JSON | gzip | per riga, compresso |
|---:|---:|---:|---:|
| 100 | 17 KB | 2 KB | 24,6 B |
| 2.100 | 362 KB | 47 KB | 22,7 B |
| 10.000 | 1.725 KB | 220 KB | 22,6 B |
| 30.000 | 5.173 KB | 660 KB | 22,5 B |

2.100 è l'archivio del progetto di preparazione, cioè una preparazione vera
completa: **47 KB**, tre gradini di riempimento. La misura conferma i 177-178
byte per riga in chiaro, contro i 192 dichiarati in §3.2 della specifica — le
righe sintetiche non hanno `chosen`.

**Tetto proposto: 2 MiB per blocco**, circa **90.000 risposte** compresse.
Quaranta volte una preparazione completa.

**Non misurato:** la compressione di un archivio reale, che ha `uid` meno
casuali e sessioni meno regolari. Il tetto ha abbastanza margine da non
dipenderne.

---

## 5. L'endpoint

### Dove: un'origine sua, e il perché è misurato

**Proposto: `https://api.rottagiusta.it`**, un'origine separata dal sito.

- **statichost.eu non può ospitarlo.** La documentazione lo dice in chiaro: i
  server «are designed only to host static files». Il sito resta dov'è, e
  l'endpoint va da un'altra parte per forza.
- **Il service worker lo ignora già**, senza una riga nuova: `site/sw.js` alla
  riga 91 fa `if (url.origin !== self.location.origin) return;`. Una richiesta
  a un'altra origine non passa mai dal gestore cache-first. Sulla stessa
  origine, una `GET /v1/blocco` passerebbe da quel gestore, e l'intera storia
  della 0.19.2 dice che cosa succede quando una risposta dinamica si mescola a
  una cache che ne serve di statiche.
- **Il guscio offline non lo sa**, e l'app funziona identica senza rete e senza
  mai aver depositato niente, come l'ADR pretende.

**Aperto — decide l'autore: su che cosa gira.** I requisiti:

- giurisdizione UE, coerente con la migrazione dell'hosting
  (`docs/migrazione-hosting.md`);
- HTTPS, un disco persistente, e una copia di sicurezza **dei blocchi opachi**;
- nessun log che contenga l'intestazione `Authorization`.

Due strade escluse, e perché: Cloudflare Workers con KV contraddirebbe la
migrazione in corso appena finita; il Mac Mini di casa rimetterebbe la rete
dell'autore davanti al pubblico, che è ciò da cui ADR-001 separa questo repo.

### Che cosa espone: una risorsa, tre verbi

```
GET    /v1/blocco              il blocco corrente
GET    /v1/blocco/precedente   quello prima dell'ultima sovrascrittura
PUT    /v1/blocco              deposita
DELETE /v1/blocco              cancella corrente e precedente
```

Ogni richiesta porta `Authorization: Bearer <A in base64url, 43 caratteri>`.
Il server calcola `I = SHA-256(A)` e lavora su quella riga. **Nell'URL non c'è
niente che identifichi nessuno**, quindi un log di accesso, anche dimenticato
acceso, non contiene identità.

| Richiesta | Risposta |
|---|---|
| `GET`, blocco presente | `200`, `application/octet-stream`, `ETag`, `Last-Modified` |
| `GET`, nessun blocco | `404` |
| `PUT` con `If-None-Match: *`, nessun blocco | `201`, `ETag` — primo deposito |
| `PUT` con `If-Match: "<etag>"` che coincide | `200`, nuovo `ETag`; il vecchio diventa `precedente` |
| `PUT` con precondizione che **non** coincide | `412`, con `ETag` e `Last-Modified` correnti |
| `PUT` **senza** precondizione | `428` — la scrittura cieca è rifiutata dal server |
| `PUT` oltre 2 MiB | `413` |
| `PUT` che non comincia con `RGBK` | `400` |
| `DELETE` | `204`, anche se non c'era niente |

**Il `428` è la regola 2 del §1 fatta rispettare da chi non si può
dimenticare.** Il client memorizza l'`ETag` dell'ultimo blocco che ha scritto o
letto; un dispositivo che non ne ha nessuno può solo creare, mai sovrascrivere.
Il `412` è il caso di due dispositivi con la stessa frase: il secondo si sente
dire «il salvataggio è cambiato da un altro dispositivo il …; recuperalo prima,
le risposte si fondono, poi salva». È una fusione, sì — **chiesta a mano,
dichiarata nei conteggi, fatta da `fondiArchivio()`**. Non ce n'è un'altra.

**Il `precedente` esiste perché il server non può controllare il contenuto.**
Un difetto del client che cifrasse un archivio sbagliato passerebbe ogni
verifica del server, che vede solo byte. Un passo indietro, uno solo, è la rete
sotto la rete; la rilettura della regola 3 è quella che dovrebbe impedire di
averne bisogno.

**Il controllo `RGBK` non è sicurezza**, è igiene: impedisce che l'endpoint
diventi un magazzino gratuito di byte qualunque senza nemmeno la fatica di una
testata.

### CORS

`Access-Control-Allow-Origin: https://rottagiusta.it`, e nient'altro.
`Authorization` rende ogni richiesta preceduta da un preflight, quindi
`Access-Control-Max-Age` alto (un giorno). Metodi `GET, PUT, DELETE`;
intestazioni `Authorization, If-Match, If-None-Match, Content-Type`; esposte
`ETag, Last-Modified`.

Il vecchio `open-patente-nautica.pages.dev` **non** entra fra le origini
ammesse: è un'altra origine, con un altro IndexedDB, e la migrazione dice già
di chiedere a chi ci studia di scaricare i progressi.

### Che cosa conserva il server, per intero

```
id              SHA-256(A), 32 byte, chiave primaria
corrente        il blocco, ≤ 2 MiB
etag            del corrente
salvato_il      del corrente
precedente      il blocco prima, oppure niente
precedente_il
ultimo_accesso  data (giorno), per la scadenza
```

Nient'altro: nessun user-agent, nessun indirizzo, nessun contatore.

**Aperto — decide l'autore, con la privacy: la conservazione.** Proposta:
**un blocco non letto né scritto per 18 mesi si cancella.** Una preparazione
dura settimane; diciotto mesi coprono anche chi ridà l'esame un anno dopo. Il
numero va scritto nella schermata (§6.2) e nella privacy, e la scadenza è un
altro motivo per cui il 404 deve essere onesto sulle sue cause.

**Aperto — decide l'autore: gli indirizzi IP.** Il limite di frequenza ne ha
bisogno per qualche minuto, in memoria. Proposta: nessun log di accesso con
l'indirizzo; il limite di frequenza tiene l'IP in memoria per un'ora e basta.
Il limite: 60 richieste all'ora e 5 blocchi creati al giorno per indirizzo. A
indovinare `A` non serve a niente (sono 256 bit); serve a non diventare un
disco gratuito.

---

## 6. Le schermate

Sono di `ui/*`. Qui c'è il contenuto, non il disegno. Vivono nella scheda
Archivio di Info e nel blocco «conservazione dei progressi» del Percorso (area
1), dove oggi stanno Scarica e Importa.

### 6.1 Che cosa deve dire, prima di tutto il resto

Sette affermazioni, tutte vere per costruzione, nessuna ottava:

1. oggi le risposte stanno solo in questo browser;
2. la frase la genera il browser, e noi non la vediamo;
3. le risposte si cifrano qui, prima di partire;
4. che cosa il server **sa** — l'esistenza di un salvataggio, la sua grandezza
   all'ingrosso, quando è stato fatto, e l'indirizzo da cui arriva la richiesta;
5. **perdi la frase, perdi il salvataggio**, e perché nessuno può rimediare;
6. non è una sincronizzazione;
7. il file dei progressi resta.

La numero 5 va **prima** del pulsante, non dopo, ed è l'ADR a chiederlo:
«va scritto in schermata prima e non dopo».

### 6.2 Il testo proposto

> **Metti al sicuro i tuoi progressi con una frase**
>
> Oggi le tue risposte esistono solo in questo browser. Se cambi telefono o
> cancelli i dati del sito, spariscono.
>
> Con una frase di dodici parole puoi lasciarne una copia cifrata sul server di
> Rotta Giusta, e riprenderla da un altro dispositivo. Non è un account: niente
> email, niente password.
>
> **Come funziona**
>
> - La frase la crea il tuo browser. Noi non la vediamo e non la conserviamo.
> - Le risposte vengono cifrate qui, prima di partire. Il server riceve dati che
>   non può leggere: sa soltanto che esiste un salvataggio, quanto è grande
>   all'incirca, quando l'hai fatto, e da quale indirizzo di rete arriva.
> - Il salvataggio si aggiorna alla fine di ogni attività. Riportarlo su un
>   altro dispositivo lo chiedi tu, e l'app ti dice quante risposte ha preso.
>
> **Prima di continuare**
>
> - **Se perdi la frase, il salvataggio è perso.** Nessuno può recuperarlo,
>   nemmeno noi: è la stessa ragione per cui non possiamo leggerlo.
> - Chi ha la frase può leggere e cancellare il tuo salvataggio. Tienila come
>   terresti una chiave.
> - Un salvataggio che non usi per 18 mesi viene cancellato.
> - Puoi continuare a scaricare il file dei progressi, come adesso.
>
> Che cosa conserviamo e per quanto: [privacy](/privacy).
>
> [ Mostrami la frase ]  [ Non adesso ]

«Si aggiorna alla fine di ogni attività» vale solo se l'autore sceglie il
deposito automatico (§7); con il deposito a mano diventa «Il salvataggio è una
fotografia: si aggiorna quando premi Salva».

### 6.3 Gli stati che il testo non può tacere

| Stato | Che cosa dice |
|---|---|
| **Senza rete** | «Per creare il salvataggio serve la rete. L'app funziona lo stesso: le risposte restano qui.» — e il pulsante è spento, col perché. |
| **Server che non risponde** | Lo si dice con l'ora dell'ultimo deposito riuscito. Mai «salvato». |
| **Rilettura che non torna** (regola 3) | «Il server ha ricevuto il salvataggio, ma rileggendolo non torna: X righe invece di Y. Scarica il file dei progressi adesso.» Accende il pallino ambra. |
| **Deposito automatico fermo da più di 7 giorni** | Pallino ambra su Info e una riga nella scheda Archivio. Un backup che non si aggiorna in silenzio è il guasto di casa. |
| **Frase con controllo sbagliato** | «Una parola non torna: controlla l'ordine e l'ortografia.» Nessuna richiesta parte. |
| **404 al recupero** | «Con questa frase non c'è nessun salvataggio. Controlla le parole: una parola sbagliata porta a un salvataggio diverso. Se sono giuste, il salvataggio potrebbe essere stato cancellato, o essere scaduto dopo 18 mesi senza uso.» |
| **412 al deposito** | «Questo salvataggio è stato aggiornato da un altro dispositivo il … Recuperalo prima: le risposte si fondono, e poi potrai salvare.» |
| **Decifratura fallita** | «Il salvataggio c'è ma non si riesce ad aprire.» Si offre il precedente. **Mai** un archivio vuoto al suo posto: è la lezione di `LS.get` (R-STA-08). |
| **Versione del formato sconosciuta** | «Questo salvataggio viene da una versione più nuova del sito: ricarica la pagina.» |
| **IndexedDB non disponibile** | «In questo browser la chiave non si può conservare: il salvataggio automatico non c'è. Puoi salvare a mano inserendo la frase.» |

### 6.4 Dopo la frase

«Scrivila adesso: non te la mostreremo più.» Poi tre parole chieste in posizioni
a caso; solo se tornano parte il primo deposito, e solo dopo la rilettura
compare «Salvato il …, N risposte».

Cambiare frase: nuova frase → nuovo deposito → rilettura → **solo allora**
cancellazione del vecchio blocco. Nell'ordine inverso, un errore a metà
lascerebbe senza salvataggio chi ne aveva uno.

---

## 7. Aperto, con chi decide

| Questione | Decide | Proposta |
|---|---|---|
| Su che cosa gira `api.rottagiusta.it` | l'autore | UE, disco persistente, niente log di `Authorization` (§5) |
| Deposito automatico a fine attività, o solo a mano | l'autore | **automatico**: l'ADR scarta il promemoria da solo perché «non copre il telefono che si rompe fra un salvataggio e l'altro», e un deposito a mano ha lo stesso buco. Si scrive da solo, si legge solo a mano. |
| Conservazione | l'autore | 18 mesi senza uso |
| IP e limite di frequenza | l'autore | un'ora in memoria, nessun log |
| Dizionario italiano: prefissi e licenza | una misura, poi l'autore | §2 |
| Territorio del modulo di cifratura | regole: Claude su `main` con l'autore | §8 |

---

## 8. Dove vive il codice, quando ci sarà

**Proposto: un modulo `site/recupero.js`**, logica pura come `engine.js`:
codifica e decodifica della frase, derivazione, cifratura e decifratura del
blocco. Usa `crypto.subtle` e `CompressionStream`, che esistono sia nel browser
sia sotto `node --test`; **non** usa `fetch` né il DOM. Il trasporto, la
`CryptoKey` in IndexedDB e le schermate stanno in `app.html`.

La ragione è la stessa che ha spostato `daAllenare()` nel motore: tutto ciò che
vive solo nella pagina **non è coperto da nessun test**, e un cifrario non
testato è la forma più costosa di codice non testato.

Tre conseguenze da non dimenticare:

- `site/recupero.js` va in **`territori.yaml`**, nel territorio `motore`,
  **prima** del `site/**` dell'interfaccia — l'ordine conta, lo dice il file.
- Va nel **guscio**, in entrambi i posti (`sw.js` e `app.html`), perché la
  pagina lo importa: se mancasse, l'app offline non partirebbe. C'è già il test
  che li tiene uguali.
- Il test sugli orfani (R-NAV-02) lo vedrà: le sue funzioni esportate vanno
  chiamate dalla pagina o dichiarate.

### I requisiti che entrerebbero nel §9 della specifica

| ID | Requisito | Controllo proposto |
|---|---|---|
| R-REC-01 | La frase codifica 128 bit più 4 di controllo; andata e ritorno identici; una parola sbagliata è presa 15 volte su 16 | `test_recupero.mjs` |
| R-REC-02 | Cifra → decifra restituisce lo stesso oggetto; un byte cambiato, nella testata o nel cifrato, è un errore | `test_recupero.mjs` |
| R-REC-03 | Una chiave sbagliata o un formato sconosciuto producono un errore dichiarato, **mai** un archivio vuoto | `test_recupero.mjs` |
| R-REC-04 | Il contenuto del blocco è l'oggetto di `esporta()`, e `importa()` lo accetta | `test_recupero.mjs` |
| R-REC-05 | `A` e `K` sono indipendenti, e il client non manda mai `K` né `E` | `test_recupero.mjs` |
| R-REC-06 | `recupero.js`, come `engine.js`, non contiene `fetch` né riferimenti al DOM | `test_interfaccia.py` |
| R-REC-07 | Se la pagina parla con l'endpoint, `privacy.html` non dichiara più che «non esiste un server» | `test_interfaccia.py` |
| R-REC-08 | Il server rifiuta la scrittura senza precondizione (428) e quella su un blocco non visto (412) | scoperto — il server non è in questo repo, finché l'autore non decide dove gira |
| R-REC-09 | «Salvato» compare solo dopo una rilettura decifrata con il conto giusto | scoperto — la suite non esercita il DOM di `app.html` |

R-REC-07 è quello che conta di più: trasforma la conseguenza più facile da
dimenticare dell'ADR in un rosso.

---

## 9. Che cosa diventa falso, e dove

Cercato nel repo, non ricordato. Ogni riga qui sotto oggi è vera e smette di
esserlo il giorno in cui il primo blocco parte.

| File | Che cosa dice oggi | Territorio |
|---|---|---|
| `site/privacy.html:45` | «non esiste un server che li riceva»; e «Cosa non c'è»: nessun trattamento, nessun registro | interfaccia |
| `site/app.html:981` | «non arrivano a nessun server … non c'è niente da recuperare se le perdi» | interfaccia |
| `site/index.html:214, 232` | «tutto nel tuo browser», «Le risposte restano nel tuo browser» | interfaccia — **vero se il backup resta facoltativo**, da rileggere |
| `docs/specifica.md:128-129` | i Vincoli «nessun account» e «nessun backend» | motore |
| `docs/filosofia.md:26, 113` | «senza un server a cui potrebbe arrivare»; «non esiste un server a cui potrebbero arrivare» | motore — è la sezione più delicata: l'argomento «un'architettura che non ha dove mandare il dato» va riscritto come «un'architettura che manda solo ciò che non può leggere» |
| `README.md:10, 109` | «non arrivano mai a nessuno»; «Nessun backend» | regole |
| `.claude/skills/rotta-giusta/SKILL.md:17` | «Nessun server» | regole |

Più ciò che l'ADR elenca già: informativa, base giuridica, registro dei
trattamenti, accordo con il fornitore dell'endpoint.

---

## 10. Che cosa non è misurato

- **Niente di questo è stato provato su un dispositivo Apple**: HKDF,
  `CompressionStream` (Safari 16.4 in su) e una `CryptoKey` non estraibile che
  sopravvive in IndexedDB sono documentati, non verificati qui. È Q-PROVE.
- Il peso di un archivio **reale** compresso (§4).
- Le due proprietà del dizionario italiano (§2).

---

## Registro

- **25 settembre 2026 — prima stesura.** Dall'ADR-002. Tre misure l'hanno
  orientata: statichost.eu serve solo file statici (documentazione), il
  service worker ignora già le altre origini (`sw.js:91`), e una preparazione
  completa compressa pesa 47 KB. Sette file dichiarano oggi che non esiste un
  server; sono elencati al §9.
