# Migrazione dell'hosting: `rottagiusta.it` su statichost.eu

**Aperto il 25 settembre 2026.** Documento di lavoro per una sessione dedicata.
**Chi ci lavora:** l'autore (dominio, DNS, pannelli), Claude (`main`), e
l'interfaccia (`ui/*`) per tre punti che stanno in `site/`.
**Territorio:** neutro — è un documento a più mani.

---

## 1. L'obiettivo, in una riga

Il sito gira su **`rottagiusta.it`**, servito da **statichost.eu** (Svezia), e
Cloudflare Pages viene dismesso solo **dopo** che il nuovo indirizzo funziona.

Il perché sta in `docs/filosofia.md` e nella scelta di stack del settembre 2026:
sovranità europea sull'intera filiera, un fornitore solo per il sito, e un
indirizzo che è dell'autore invece di un sottodominio di qualcun altro.

---

## 2. Che cosa è già misurato — non ripeterlo, non dedurlo di nuovo

Misurato il **25 settembre 2026** su un sito di prova vero,
`rotta-giusta.statichost.page`, con il contenuto reale di `site/` caricato.

| Percorso | statichost.eu | Cloudflare Pages (oggi) |
|---|---|---|
| `/` | 200 | 200 |
| `/index` | **200** | 404 |
| `/index.html` | **200** | 308 → `/` |
| `/app` | **200** | 200 |
| `/app.html` | **200** | **308** → `/app` |
| `/app/` | 404 | **308** → `/app` |
| `/privacy`, `/avvertenza` | **200** | 200 |
| `/privacy.html` | **200** | **308** → `/privacy` |
| inesistente | 404 (`404 Not Found`, testo) | **200, con la vetrina** |

**Salti di redirect su statichost.eu: zero, su ogni percorso.** Verificato con
`num_redirects`.

> **Correzione a verbale, 25 settembre sera.** Le ultime due righe della colonna
> Pages dicevano «—» e «404»: non erano state misurate, erano state scritte. La
> misura dice 308 e **200**. `site/` non ha un `404.html`, e senza quel file Pages
> tratta il sito come un'applicazione a pagina singola: qualunque percorso che non
> esiste riceve `index.html` con codice 200 — `/a/b/c`, `/non-esiste`, perfino
> `/_headers`. Su statichost.eu lo stesso indirizzo risponde 404. È un
> cambiamento di comportamento reale: un link sbagliato oggi atterra sulla
> vetrina, domani su un «404 Not Found» in testo semplice. Più onesto, meno
> gentile; un `404.html` con un rimando alla palestra è una decisione
> dell'interfaccia, non di questa migrazione.

### Le tre conclusioni che ne discendono

**a) Non serve nessun `_redirects`.** statichost.eu fa gli indirizzi puliti da
sé, **e** serve anche il file con l'estensione. È un *e*, non un *o*.

> **Correzione a verbale.** Il 10 settembre era stato concluso il contrario —
> «serve i file alla lettera, quindi `/app` darebbe 404, serve un `_redirects`
> di tre righe». Era sbagliato, e l'errore è istruttivo: la misura di allora era
> stata fatta sul sito **di statichost**, che è strutturato a cartelle, e da
> `/index.html` → 200 si era dedotto «niente indirizzi puliti». Una deduzione da
> un'osservazione, che è precisamente ciò che questo progetto vieta. Il test che
> discrimina è `/index`, che **non** sta in nessuna regola: risponde 200, quindi
> il lavoro lo fa la piattaforma.

**b) Il difetto della 0.19.2 lì non può accadere.** Non c'è nessun redirect in
nessuna direzione, quindi nessuna risposta rediretta può finire in cache e
uccidere una navigazione.

**c) `site/_headers` funziona così com'è**, senza modifiche. Provato, non
dedotto: `/sw.js` risponde `cache-control: no-cache` mentre `/app` risponde
`public, max-age=0, must-revalidate`. Valore diverso ⇒ viene dal file, non da un
default della piattaforma.

### Il resto del sito regge

`dati/quiz.json` 740 KB, `engine.js` 71 KB, `dati/meta.json`, `figure/index.json`,
`manifest.json`: tutti 200. HTTP/2, certificato valido, emesso da solo entro
pochi minuti dal primo deploy.

**Banda:** il guscio più la banca pesano **261 KB compressi**; la quota gratuita
di 10 GB/mese regge **40.185 prime visite**, e le visite successive costano zero
byte perché il service worker è cache-first. Nessun limite duro: se si sfora, il
sito continua a essere servito.

---

## 3. Che cosa NON è misurato, e va misurato nella sessione

Onestà obbligatoria: queste cose sono **assunte**, non verificate.

1. ~~**Il certificato sul dominio vero.**~~ Misurato alla fase A (§4): due
   certificati Let's Encrypt, uno per nome, emessi da soli in pochi minuti.
2. ~~**Il service worker installato davvero sul nuovo host.**~~ Misurato alla
   fase B (§4): 122 voci in cache, nessuna rediretta.
3. ~~**Il ciclo di aggiornamento** sul nuovo host.~~ Misurato alla fase B, con il
   rilascio v0.26.0: la regola delle due ricariche regge.
4. **Il comportamento di chi arriva dal vecchio indirizzo** dopo il passaggio.
5. **Il service worker già installato dal vecchio dominio.** È su un'origine
   diversa, quindi in teoria non c'entra — ma è teoria, non misura.

---

## 4. I passi, in ordine

### Fase A — il dominio (autore)

1. Nel pannello di statichost.eu, aggiungere `rottagiusta.it` come dominio
   personalizzato al sito.
2. Dal registrar, creare il record che statichost.eu indica (CNAME verso il loro
   host, o A/AAAA se lo chiedono per il dominio nudo).
3. Aspettare l'emissione del certificato.

**Non toccare ancora Cloudflare Pages.** I due indirizzi devono convivere: è la
rete di sicurezza, e non costa niente.

#### Fatta il 25 settembre 2026 — che cosa c'è adesso

Eseguita da Claude nel browser dell'autore, con la sua conferma prima di ogni
modifica. Il registrar è InterNetX, il DNS è di IONOS (`ui-dns.*`).

**statichost.eu**, sito `rotta-giusta`: `rottagiusta.it` è **Primary**,
`www.rottagiusta.it` è in redirect, `rotta-giusta.statichost.page` resta
**Managed** e continua a rispondere 200 (non rimanda al primario).

**IONOS**, zona `rottagiusta.it`:

| Record | Prima | Dopo |
|---|---|---|
| `A @` | `217.160.0.41` (parcheggio IONOS, «Default Site») | `95.217.26.94` |
| `AAAA @` | `2001:8d8:100f:f000::200` (parcheggio) | `2a01:4f9:c01f:8002::` |
| `TXT _dep_ws_mutex` | c'era (del parcheggio) | disattivato da IONOS insieme ai due sopra |
| `CNAME www` | non c'era | `rotta-giusta.statichost.page` |
| MX, SPF, DMARC, DKIM, autodiscover | — | **invariati**, verificati su 1.1.1.1 e 9.9.9.9 |

**Perché A/AAAA e non ALIAS.** statichost.eu chiede ALIAS/ANAME per il dominio
nudo; IONOS non li offre. Il ripiego documentato sono A e AAAA verso il loro
«main server».

**Quali indirizzi, e perché questi.** La documentazione di statichost.eu indica
`95.217.26.94` / `2a01:4f9:c01f:8002::`; il nome dietro il loro CNAME,
`sites.statichost.eu`, risolveva invece a `46.225.58.80` /
`2a01:4f8:1c19:d92e::1`. Entrambi gli IPv4 servono il sito (misurato con
`--resolve`, 200 tutti e due). Scelti quelli della documentazione: sono il
contratto pubblicato per chi non ha ALIAS, quelli risolti possono cambiare senza
che nessuno lo dica. **Il prezzo è da sapere:** se statichost.eu sposta il main
server, questi due record vanno aggiornati a mano.

**Certificati.** Let's Encrypt (YE2), `notBefore` 17:03 UTC del 25 settembre —
che **non** è l'ora di emissione: Let's Encrypt retrodata l'inizio di validità di
un'ora, quindi sono stati emessi verso le 18:03, pochi minuti dopo il cambio dei
record. Scadenza 24 dicembre 2026, rinnovo a carico della piattaforma. Due certificati
distinti: `CN=rottagiusta.it` e `CN=www.rottagiusta.it`. Verificati con
`openssl s_client` e con `curl` **senza** `-k`.

**Tre cose trovate facendolo, non previste:**

- **`www` risponde 302, non 301.** Il pannello scrive «Redirect 301»; la misura
  dice `HTTP/2 302`, `location: https://rottagiusta.it/app`. Un 302 è
  temporaneo: browser e motori di ricerca non lo tengono come definitivo. Non
  rompe niente, ma il pannello dice una cosa e il server ne fa un'altra — da
  segnalare a statichost.eu.
- **IONOS, aggiungendo un AAAA sul dominio nudo, ne crea uno anche per `www`**
  se non glielo si impedisce («Non aggiungere record DNS per www»). Quel record
  avrebbe fatto a pugni con il CNAME di `www`. Escluso.
- **La cache DNS di macOS tiene il vecchio indirizzo per il TTL intero** (un'ora).
  Subito dopo la modifica, 1.1.1.1 e 9.9.9.9 davano già i record nuovi, mentre
  `curl` sul Mac andava ancora al parcheggio e falliva il TLS. Chi misura nella
  prima ora deve forzare l'indirizzo (`--resolve`) o svuotare la cache, altrimenti
  misura il parcheggio e conclude che il certificato non c'è.

**Non verificato:** l'**IPv6**. Il Mac da cui si è misurato non ha connettività
IPv6 (`curl -6` verso qualunque host fallisce), quindi il record AAAA è quello
della documentazione e basta. Va misurato da una rete che ce l'ha.

### Fase B — la misura (Claude, `main`)

4. La stessa passata della sezione 2, ma su `https://rottagiusta.it`: codici,
   salti, header, asset.
5. Nel browser, con il service worker installato: ogni voce della cache, e
   **nessuna con `redirected: true`**.
6. Il ciclo di aggiornamento: una versione nuova, e la regola delle due
   ricariche verificata invece che dichiarata.

#### Fatta il 25 settembre 2026 — la passata con `curl`

Su `https://rottagiusta.it`, indirizzo forzato a `95.217.26.94` con `--resolve`
perché la cache DNS del Mac puntava ancora al parcheggio.

| Percorso | Codice | Salti |
|---|---|---|
| `/`, `/index`, `/index.html` | 200 (28.808 B) | 0 |
| `/app`, `/app.html` | 200 (248.999 B) | 0 |
| `/privacy`, `/privacy.html`, `/avvertenza`, `/avvertenza.html` | 200 | 0 |
| `/app/`, inesistente | 404 | 0 |
| `sw.js`, `engine.js`, `manifest.json`, i quattro `dati/*.json`, `figure/index.json`, una figura, `marchio.svg` | 200 | 0 |

Stessa tabella del sito di prova (§2), su tutte le righe. HTTP/2 ovunque.

**Il contenuto è quello pubblicato, byte per byte.** SHA-256 dei file serviti
contro il repo: `index.html`, `app.html`, `sw.js`, `manifest.json`, `privacy`,
`avvertenza`, tre JSON e `_headers` coincidono con `main`; `engine.js` coincide
con `origin/main` (v0.25.0) e non con `main`, che ha un commit non ancora
pubblicato. Cioè il sito è la v0.25.0 e niente altro.

**Header.** `/sw.js` → `cache-control: no-cache`; `/app`, `/`, `engine.js`, i
JSON e le figure → `public, max-age=0, must-revalidate`. Gzip su testo e JSON,
`server: statichost.eu`, `x-content-type-options: nosniff`.

**Una cosa che su Pages non c'era:** statichost.eu manda
`strict-transport-security: max-age=31536000; includeSubDomains; preload` anche
sul dominio personalizzato. Per un anno, un browser che ha visto quell'header
userà HTTPS per **ogni** sottodominio di `rottagiusta.it`. Oggi non morde — i
sottodomini che esistono sono della posta IONOS e di `www` — ma è una decisione
presa dalla piattaforma sul dominio dell'autore, e va saputa prima di creare un
sottodominio solo HTTP. `preload` da solo non iscrive il dominio alla lista dei
browser: serve una richiesta esplicita, che nessuno ha fatto.

**E una cosa da sapere, innocua:** `/_headers` è servito come file pubblico. Su
Pages no (lì risponde 200 ma con la vetrina, vedi la correzione alla §2).
Contiene solo la regola di `sw.js`, che è già nel repo pubblico.

#### Fatta il 25 settembre 2026 — il service worker, e il ciclo delle due ricariche

Nel browser integrato dell'app, che non aveva mai visto `rottagiusta.it`: una
prima visita vera. Tutte le letture sono `caches`, `navigator.serviceWorker` e
`performance` nella pagina, più il testo della schermata Info.

**Prima visita, v0.25.0.** Service worker `activated`, scope `/`, pagina
controllata. Una sola cache, `rg-0.25.0`, con **19 voci che coincidono con il
`GUSCIO` di `sw.js`**, tutte 200, tipo `basic`, **nessuna con
`redirected: true`**. Dopo «Scarica tutto per l'offline»: **122 voci** (19 + 102
figure + `figure/index.json`), tutte 200, zero rediritte, e Info scrive «Pronto
per l'offline … figure 102/102». Console vuota.

**A pagina ricaricata: zero byte dalla rete.** `transferSize` 0 sulla
navigazione e su tutte e sette le risorse dello stesso sito, ognuna con
`workerStart > 0`.

**Il ciclo, con un rilascio vero.** Pubblicata la v0.26.0 (push, poi «Build now»
su statichost.eu — vedi sotto), verificato con `curl` che il nuovo host servisse
`CACHE = 'rg-0.26.0'` e `versione: 0.26.0`. Poi, nello stesso browser:

| | Pagina | Cache installata | Info scrive |
|---|---|---|---|
| prima della pubblicazione | v0.25.0 | `rg-0.25.0` | «v0.25.0 · cache offline rg-0.25.0» |
| **prima ricarica** | **v0.25.0** | **`rg-0.26.0`** (la vecchia già cancellata) | «… **— diverse: ricarica due volte** questa pagina per prendere la nuova» |
| **seconda ricarica** | **v0.26.0** | `rg-0.26.0` | «v0.26.0 · cache offline rg-0.26.0» |

Alla seconda ricarica: `lunghezzaScreening` è nel motore servito, zero byte dalla
rete, 19 voci e nessuna rediretta. **La regola delle due ricariche è misurata sul
nuovo host**, e la schermata Info si accorge da sola del passaggio intermedio.

**Due cose trovate facendolo:**

- **Un push non arriva a statichost.eu.** Dopo il push di `main` e del tag non
  è partita nessuna build: il sito costruisce da `github.com/ilbeca/rotta-giusta`,
  ramo `main`, ma solo quando qualcuno preme «Build now» o manda una `POST` al
  loro indirizzo di deploy, e sul repo non c'è nessun webhook (`gh api
  repos/ilbeca/rotta-giusta/hooks` → 0). Oggi quindi un
  rilascio va su Pages da solo e su `rottagiusta.it` **solo se qualcuno se ne
  ricorda** — cioè le due produzioni possono servire versioni diverse senza che
  niente lo dica. Finché convivono, il rilascio ha un passo in più. Alla fase D
  va deciso se aggiungere il webhook (con il token, che il pannello permette di
  pretendere) o tenere il passo manuale e scriverlo nella procedura.
- **Le figure scaricate per l'offline si perdono a ogni rilascio.** Le 102
  figure stavano in `rg-0.25.0`, e l'`activate` del nuovo service worker cancella
  ogni cache che non si chiama come la corrente: dopo la seconda ricarica Info
  dice «figure non scaricate». Non è muto — il pallino ambra si accende — e non
  dipende dall'hosting: lo decide l'`activate` di `sw.js`, che è lo stesso file
  su Pages (non misurato là, letto nel codice). È un difetto del prodotto,
  aperto come attività separata, non di questa migrazione.

  *Chiuso il 25 settembre 2026, su `main`:* l'`activate` porta le figure nella
  cache nuova prima di cancellare la vecchia. Provato in locale sul ciclo vero —
  figure scaricate, rilascio, due ricariche — con «figure 102/102» dopo. Vale dal
  primo rilascio che contiene il `sw.js` corretto: chi passa dalla 0.26.0 alla
  successiva le tiene.

**Non misurato, e resta al §3:** il comportamento di chi arriva dal vecchio
indirizzo, e il service worker di `.pages.dev` su un dispositivo che ce l'ha già.
Il browser usato qui non aveva mai visto `.pages.dev`, quindi non poteva dirlo.

### Fase C — il repo (due rami, e non è un dettaglio)

**Su `main`** — Claude:

| File | Che cosa diventa falso |
|---|---|
| `strumenti/serve.py` | Riproduce i **308 di Pages**, che sul nuovo host non esistono. Va riallineato, **e solo adesso**: farlo prima creerebbe la divergenza locale/produzione al contrario |
| `tests/test_dati.py` (~riga 355) | Il commento dice «come li serve Cloudflare Pages» |
| `docs/specifica.md` §2 | «Sito statico su Cloudflare Pages» |
| `README.md` (×2) | «L'hosting è Cloudflare Pages» |
| `AGENTS.md` | «`site/` è l'unica cosa pubblicata: Cloudflare Pages» |
| `.claude/skills/rotta-giusta/SKILL.md` (×2) | Dichiara Pages e il deploy a ogni push |

**Su `ui/*`** — l'interfaccia, o Claude su `ui/*` con ChatGPT fermo:

| File | Che cosa diventa falso |
|---|---|
| **`site/privacy.html`** | *«Il sito è pubblicato su Cloudflare Pages… Cloudflare registra nei propri log gli indirizzi IP»* — **è la riga che pesa di più**: nomina un titolare autonomo che non è più quello |
| `site/app.html` (×2) | Due commenti che spiegano il 308 di Pages |

**Condiviso:**

| File | Che cosa |
|---|---|
| `site/sw.js` | Un commento che motiva l'assenza di `.html` citando Pages |
| `CHANGELOG.md` | Voce nuova. **Le voci vecchie non si toccano**: sono storia |

**Attenzione a R-ARCH-05.** La regola «nessun `.html` nel guscio e negli `href`
interni» **resta giusta** — gli indirizzi puliti sono quelli che vogliamo — ma
sul nuovo host la sua *ragione* sparisce: non c'è più un 308 da evitare. Il test
resta, il commento va riscritto. Una regola che sopravvive al proprio motivo è
quella che fra sei mesi qualcuno «semplifica».

### Fase D — la dismissione (autore, per ultima)

7. Solo dopo che `rottagiusta.it` è verificato: far puntare il vecchio indirizzo
   al nuovo, se possibile, e poi spegnere il progetto Pages.
8. **Verificare prima se il progetto Pages è stato rinominato**: il CHANGELOG
   0.20.0 avverte che rinominarlo spegne il vecchio `.pages.dev` **senza
   redirect**. Chi ha il sito fra i segnalibri lo perde.

---

## 5. Criteri di accettazione

Tutti misurati, nessuno dedotto.

- [x] `https://rottagiusta.it` risponde 200 con certificato valido
- [x] `/app`, `/privacy`, `/avvertenza` → 200, **zero salti**
- [x] `/sw.js` → `cache-control: no-cache`
- [x] Service worker `activated`; **nessuna voce in cache con `redirected: true`**
- [x] A pagina ricaricata: **zero byte trasferiti**
- [x] Le quattro suite verdi (al rilascio v0.26.0: 125/199/121/218)
- [ ] Nessun file del repo dichiara più Cloudflare, tranne il CHANGELOG
- [ ] `strumenti/serve.py` riproduce il **nuovo** host, e lo dice nel docstring

---

## 6. Rischi e rientro

**Il rischio vero non è tecnico, è di sequenza:** dismettere Pages prima di aver
verificato il nuovo indirizzo. Per questo la fase D è ultima e separata.

**Rientro:** finché Pages è vivo, si torna indietro cambiando il DNS. Il sito è
statico e l'archivio delle risposte **sta nel browser di chi studia**: nessun
dato può andare perso in una migrazione di hosting, qualunque cosa succeda.

**Un effetto che non è un guasto ma si vede:** chi ha la palestra sulla schermata
Home con il vecchio indirizzo resta su un'origine diversa, quindi il suo archivio
IndexedDB **non lo segue**. Va detto in schermata prima del passaggio, con
l'invito a scaricare i progressi. È l'unico modo in cui qualcuno può perdere
qualcosa, e non dipende dall'hosting ma dal cambio di origine.

---

## 7. Che cosa NON entra qui

Il **backup dei progressi** (ADR-002) è un'altra cosa e un'altra sessione.
Questa migrazione non tratta nessun dato personale in più di oggi: sposta file
statici da un server a un altro.

---

## Registro

- **25 settembre 2026 — prima stesura.** Dopo la misura sul sito di prova, che
  ha corretto la conclusione del 10 settembre: `_redirects` non serve, la
  migrazione costa zero righe di codice invece di tre file.
- **25 settembre 2026, sera — fasi A e B fatte.** Il dominio punta a
  statichost.eu (A/AAAA, perché IONOS non ha ALIAS), certificati emessi da soli.
  Passata `curl`, service worker e ciclo delle due ricariche misurati sul dominio
  vero, con il rilascio v0.26.0 usato come versione da prendere. Sei criteri su
  otto soddisfatti: restano i due della fase C. Corrette due caselle della §2
  che erano state scritte e non misurate.
