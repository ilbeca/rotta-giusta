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
| `/app/` | 404 | — |
| `/privacy`, `/avvertenza` | **200** | 200 |
| `/privacy.html` | **200** | **308** → `/privacy` |
| inesistente | 404 | 404 |

**Salti di redirect: zero, su ogni percorso.** Verificato con `num_redirects`.

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

1. **Il certificato sul dominio vero.** Su `rotta-giusta.statichost.page` si è
   emesso da solo. Su `rottagiusta.it`, con un CNAME da un registrar terzo, non
   è stato provato.
2. **Il service worker installato davvero sul nuovo host.** Finora si sono
   misurati i codici HTTP con `curl`. La proprietà che conta è un'altra, e si
   legge solo nel browser: `redirected` su ogni voce della cache.
3. **Il ciclo di aggiornamento** sul nuovo host: la regola delle due ricariche.
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

### Fase B — la misura (Claude, `main`)

4. La stessa passata della sezione 2, ma su `https://rottagiusta.it`: codici,
   salti, header, asset.
5. Nel browser, con il service worker installato: ogni voce della cache, e
   **nessuna con `redirected: true`**.
6. Il ciclo di aggiornamento: una versione nuova, e la regola delle due
   ricariche verificata invece che dichiarata.

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

- [ ] `https://rottagiusta.it` risponde 200 con certificato valido
- [ ] `/app`, `/privacy`, `/avvertenza` → 200, **zero salti**
- [ ] `/sw.js` → `cache-control: no-cache`
- [ ] Service worker `activated`; **nessuna voce in cache con `redirected: true`**
- [ ] A pagina ricaricata: **zero byte trasferiti**
- [ ] Le quattro suite verdi
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
