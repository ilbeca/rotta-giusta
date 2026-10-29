# Rotta Giusta e il GDPR — verifica di ottobre 2026

**Data:** 29 ottobre 2026. **Prodotto verificato:** la v0.35.0, in linea dal 28
ottobre 2026, sul sito (`rottagiusta.it`) e sul server degli account
(`api.rottagiusta.it`). **Chi:** Claude, in una sessione di sola verifica: nessun
file di `site/`, `server/` o dell'informativa è stato toccato.

**Questo non è un parere legale, e chi l'ha scritto non è un avvocato.** Il
rapporto separa due cose che vanno tenute distinte:

- **che cosa si misura** — nel codice, nelle suite, sul sito pubblicato con
  richieste di sola lettura: queste righe dicono «misurato», con la fonte;
- **che cosa è un giudizio giuridico** — se una base giuridica regge, se un
  testo basta, se serve una valutazione d'impatto: queste righe dicono «da
  decidere», e vanno confermate dal professionista che l'autore ha in conto.

Quello che sta fuori dal repo — il registro dei trattamenti, la procedura per le
violazioni, le LIA, la copia controfirmata del DPA di statichost.eu — **non l'ho
visto**: dove serve, la riga lo chiede all'autore e non lo dà per fatto.

---

## 1. Come è stato misurato

| Che cosa | Come | Esito |
|---|---|---|
| L'informativa pubblicata è quella del repo | `curl` di `/privacy`, `/avvertenza`, `/`, `/app` su `rottagiusta.it`, confronto byte per byte con `site/` | identiche tutte e quattro |
| La versione in linea | `GET /dati/meta.json` e `GET https://api.rottagiusta.it/v1/salute` | `0.35.0` su tutti e due; schema 6/6; `raccolte: {esiti_e_previsioni: false, scelte_di_preparazione: true}` |
| Che cosa resta nel browser senza account, e verso dove partono le richieste | il sito pubblicato aperto nel browser integrato; fotografia di cookie, `localStorage`, `sessionStorage`, IndexedDB e Cache Storage prima e dopo un'attività (Allenati con 10 domande, una risposta); elenco degli host da `performance.getEntriesByType('resource')` | **nessun cambiamento**, nessun cookie, nessuna cache, nessun service worker; un solo host, `rottagiusta.it`. Nel profilo del browser c'erano già `pn.filtro` e il database `open-patente-nautica`: sono di una versione di prima degli account (§3, lacuna 9); la pagina di oggi non li scrive — `LS` è in memoria (`site/index.html:1565`) e il nome non compare in `site/` |
| Risorse da altri host nella Home pubblicata | ricerca di `src`/`href` assoluti nel file servito | solo link `<a>` (GitHub, Gazzetta Ufficiale, MIT); nessuno script, foglio, carattere o immagine da un altro host |
| Intestazioni | `curl -D -` | sito: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, nessun `Set-Cookie`, nessuna `Content-Security-Policy`. API: nessun HSTS proprio; CORS solo per `https://rottagiusta.it`, un'origine estranea non riceve `Access-Control-Allow-Origin` |
| Dove stanno le macchine | `dig` e `whois` | il sito risponde da `95.217.26.94`, Hetzner, rete `CLOUD-HEL1`, **Finlandia**; l'API da `151.115.74.77`, Scaleway, **Varsavia** |
| Le suite | `python3 tests/test_dati.py`, `node --test tests/test_server.mjs`, `python3 tests/test_interfaccia.py` (porta 8620 guardata libera per 90 s) | dati 225 verdi (fra cui `test_nessuna_risorsa_di_terzi` e `test_titolare`); server 89/89; interfaccia 4.866 verdi |

Nessun account creato in produzione, nessun accesso alla macchina. Le prove con
l'account sono quelle che le suite fanno sul server locale: R-ACC-09 (nessun dato
nel browser senza account), R-ACC-16 (niente segreti in chiaro), R-ACC-19 (la
cancellazione toglie i byte anche dal WAL), R-ACC-36 (i due anni), R-ACC-67…74
(statistiche, opposizione, letture del titolare), R-ACC-82…86 (raccolte spente).

---

## 2. La tabella

Esiti: **conforme** (il testo e il sistema dicono la stessa cosa, ed è misurato);
**lacuna** (testo e sistema divergono, o manca qualcosa che si può correggere);
**da decidere** (un giudizio giuridico o una scelta dell'autore); **non visto**
(sta fuori dal repo).

### 2.1 Principi, basi giuridiche, informativa

| Requisito | Che cosa dice il testo | Che cosa fa il sistema | Esito | Fonte |
|---|---|---|---|---|
| Art. 13.1.a — identità e contatti del titolare | nome e cognome, persona fisica, `privacy@rottagiusta.it`, nessun indirizzo postale | la casella è su OVHcloud; DKIM attivo dal 2 ottobre | conforme nel testo; **da decidere** se basta un'email senza indirizzo né PEC | `site/privacy.html:45`; `account-progetto.md` §15.4, punti 2, 3, 10 |
| Art. 6.1.b — salvataggio, sincronia, Progressi, mail dell'account | esecuzione delle condizioni per l'account | le condizioni ci sono, e il modulo «Crea un account» le linka prima del pulsante (R-ACC-75) | conforme nel testo; **da decidere** se un servizio gratuito regge sul 6.1.b (EDPB, linee guida 2/2019) | `site/privacy.html:48`; `site/avvertenza.html:75-85`; `site/index.html:1745` |
| Art. 6.1.f — statistiche | legittimo interesse, conteggi aggregati, opposizione via email | `server/statistiche.mjs`: fonti filtrate da `fuori_statistiche_dal`, nessuna email nelle fonti, una query che fa uscire `chi` o righe intere è rifiutata; oggi nessuna statistica si calcola | conforme; LIA scritta dall'autore il 2 ottobre, **non vista** | `server/statistiche.mjs:65-95`; R-ACC-67…70, R-ACC-77 |
| Art. 6.1.f — registro di sicurezza | legittimo interesse, considerando 49, opposizione valutata caso per caso | registro con IP, eventi elencati sotto | conforme; **da decidere** la LIA (non vista) | `site/privacy.html:53`; `server/db.mjs:92-100` |
| Art. 6.1.c/f — conservazione delle richieste | due anni dalla chiusura | dipende dalla procedura dell'autore | **non visto** | `site/privacy.html:60` |
| Art. 5.1.c — minimizzazione: senza account | «non conserviamo niente, nemmeno le preferenze» | misurato sul sito pubblicato: dopo una risposta nessuna scrittura nel browser, nessuna richiesta all'API; R-ACC-09 lo tiene | conforme | §1; `tests/test_interfaccia.py::test_client_senza_account` |
| Art. 5.1.c — minimizzazione: con account | email, risposte, tag, segnalibri, Segnali, data d'esame, scelte, eventi di sicurezza | lo schema 6 (`server/db.mjs`) ha esattamente questo, più le sessioni, i gettoni (impronte) e gli esiti (vuoti, raccolta spenta). `ultimo_accesso_il` è un giorno, non un'ora | conforme | `server/db.mjs:34-160` |
| Art. 13.1.c — che cosa si raccoglie: tag «Svista» e segnalibri | nominati: «le classificazioni che metti sui tuoi errori ("Non lo sapevo", "Svista") e i segnalibri» | accesi dalla v0.31.0; la riga dell'informativa c'è dalla v0.32.0 (20 ottobre). Fra il 18 e il 20 ottobre il server li accoglieva senza la riga, decisione dell'autore del 18 ottobre | conforme oggi | `site/privacy.html:48`; `account-progetto.md` §2.7-bis |
| Art. 13.1.c — scelte di preparazione | nominate: «che cosa stai preparando (solo motore o anche vela, prima patente o estensione)» | `scelte_di_preparazione: true` in `RACCOLTE`, e così dice `/v1/salute` dal vivo | conforme | `server/raccolte.mjs`; §1 |
| Art. 13.1.c — esiti d'esame e previsioni | non nominati | **spenti**: `PUT /v1/esito` → `403`, riga `'a'` scartata anche da un import, non dichiarati in `GET /v1/io`; dal vivo `esiti_e_previsioni: false` | conforme (non si raccolgono); diventa **da decidere** quando P-75 li accende | `server/raccolte.mjs`; R-ACC-83, R-ACC-86 |
| Art. 13.2.e — obbligatorietà | email necessaria, data e scelte facoltative | il server accetta il profilo senza data e senza scelte (`null`) | conforme | `site/privacy.html:49`; R-ACC-35, R-ACC-78 |
| Art. 13.2.f / art. 22 — decisioni automatizzate | «non servono a decidere nulla su di te» | nessuna decisione automatica; la stima non si calcola sul server e la riga d'avvio è spenta | conforme oggi; **da decidere** con la previsione (§5) | `site/privacy.html:48` |
| Data e aderenza al prodotto | «Aggiornata il 20 ottobre 2026» | dalla v0.32.0 alla v0.35.0 il CHANGELOG dice «il server non cambia», e i rilasci 0.33–0.35 toccano soltanto runner, avvisi, scala e volto della Home: l'informativa descrive la v0.35.0 | conforme | `CHANGELOG.md:43`, `:988`, `:1173` |
| Data delle condizioni | «Aggiornata il 1° ottobre 2026» | il testo è cambiato il 20 ottobre (`d4b8ebf`: «dal Profilo» al posto di «dalla palestra» e «da Info»), senza cambiare la data | **lacuna** minore (8) | `site/avvertenza.html:40`; `git show d4b8ebf` |

### 2.2 Conservazione e cancellazione (artt. 5.1.e e 17)

| Requisito | Che cosa dice il testo | Che cosa fa il sistema | Esito | Fonte |
|---|---|---|---|---|
| Account non confermato: sette giorni | sì | il lavoro quotidiano lo cancella, con le righe | conforme | `server/conti.mjs:639`; R-ACC-11 |
| Due anni di inattività, con avviso trenta giorni prima | sì | avviso a 700 giorni; cancellazione trenta giorni dopo l'avviso, se nessuno torna; un avviso rifiutato dal fornitore non conta | conforme | `server/conti.mjs:33`, `:660`; R-ACC-36 |
| La cancellazione chiesta | «cancelli l'account dal Profilo» | `DELETE /v1/account` con la password: righe, sessioni, gettoni, segnali, esiti, scelte; `secure_delete` e `wal_checkpoint(TRUNCATE)`; il test cerca l'email nei byte del database e del `-wal` | conforme | `account-progetto.md` §14.1, §14.4; R-ACC-19 |
| Registro: IP sei mesi, evento un anno | sì | `UPDATE registro SET ip = NULL` a sei mesi, `DELETE` a un anno, nel lavoro quotidiano | conforme | `server/conti.mjs:679-680` |
| Le copie: «un dato cancellato sparisce anche dalle copie entro 30 giorni» | sì | bucket `nl-ams` con la regola `scadenza-30-giorni` (dal documento, non misurata da qui); sulla macchina le copie del timer restano tre giorni (`find … -mtime +2 -delete`). **Ma le copie che `rg-aggiorna` fa prima di ogni rilascio, `aggiorna-*.db`, si tengono per numero — le ultime cinque — e non per età**: con rilasci rari una di queste può tenere un account cancellato ben oltre i 30 giorni | **lacuna** (1) | `strumenti/macchina/rg-copia`; `strumenti/macchina/rg-aggiorna:38-42` |
| Il file delle cancellazioni | non nominato | tiene per sempre `id`, chiave casuale dell'account e data di ogni cancellazione, azzeramento, opposizione ed esito tolto; nessuna email. Serve a ricancellare dopo un ripristino | **da decidere** (lacuna 6): una scadenza, e una riga nell'informativa | `server/db.mjs:348-420` |
| L'azzeramento | «azzerare chiede la password e vale su tutti i dispositivi» (specifica) | toglie le righe, alza la generazione, passa dal file; non tocca gli esiti (deciso dall'autore il 4 ottobre) | conforme | R-ACC-15 |
| La copia nel dispositivo, all'uscita | «all'uscita confermata cancelliamo la copia locale» | `rg-account-<chiave>` cancellato; `rg.ultimo-account` e `rg.pulizia-chiave` tolti da `localStorage` | conforme | `site/index.html:2252`, `:2382`; R-ACC-46, R-ACC-54 |

### 2.3 Diritti e tempi (artt. 12, 15–22)

| Requisito | Che cosa dice il testo | Che cosa fa il sistema | Esito | Fonte |
|---|---|---|---|---|
| Art. 12.3 — un mese, prorogabile | sì | la risposta dipende dall'autore che legge `privacy@`. L'attività programmata che segnava le scadenze non legge più `privacy@` dal 1° ottobre, e il §15.4 dice che resta da decidere che cosa legga | **da decidere** (lacuna 3) | `account-progetto.md` §15.4, punto 2 |
| Art. 15 — accesso | richiesta a `privacy@`, e il file dal Profilo | `server/leggi.mjs` mostra all'autore l'account intero, gli eventi del registro compresi, e annota la lettura | conforme come strumento; il file da solo non è un accesso completo (non porta registro, sessioni, data d'esame), ed è giusto che la risposta passi da `privacy@` | `server/leggi.mjs`; R-ACC-71 |
| Art. 16 — rettifica | sì | email cambiabile con conferma; profilo modificabile; le righe delle risposte sono immutabili per costruzione: registrano che cosa si è risposto, quindi non c'è un dato «inesatto» da correggere — **da decidere** se va detto | conforme; una frase da valutare | R-ACC-34, R-ACC-35 |
| Art. 17 — cancellazione | sì | vedi 2.2 | conforme, salvo la lacuna 1 | |
| Art. 18 — limitazione | elencata | nessun meccanismo nel server; si farebbe a mano | **da decidere**: come si limita un account (l'opposizione dalle statistiche è già una forma parziale) | `site/privacy.html:70` |
| Art. 20 — portabilità | «il file dei progressi è leggibile e riutilizzabile» | `GET /v1/esporta`: JSON con righe, punteggi dei Segnali, esiti, scelte; **non la data d'esame** (aperto nel §20, proposta della regia: sì) | conforme in sostanza; lacuna minore (7) | `server/righe.mjs:100-110`; `account-progetto.md` §20 |
| Art. 21 — opposizione | per statistiche e registro | statistiche: segno sull'account messo dal titolare con `opposizione.mjs`, annotato, sopravvive a ripristino e azzeramento; registro: valutata caso per caso | conforme | R-ACC-67, R-ACC-68, R-ACC-70 |
| Art. 77 — reclamo al Garante | sì, con il link | — | conforme | `site/privacy.html:70` |

### 2.4 Fornitori, registro dei trattamenti, trasferimenti (artt. 28, 30, capo V)

| Requisito | Che cosa dice il testo | Che cosa fa il sistema | Esito | Fonte |
|---|---|---|---|---|
| Art. 28 — Scaleway (macchina, posta, copie) | responsabile con un accordo scritto | DPA nei contratti dell'organizzazione, verificato in console il 26 settembre | conforme (dal documento) | `account-progetto.md` §15.4 |
| Art. 28 — statichost.eu | responsabile con un accordo scritto; sub-responsabili Hetzner (Germania) e BunnyWay (Slovenia) | DPA firmato e spedito dall'autore entro il 2 ottobre; **la copia controfirmata era attesa**. Dal vivo il sito risponde da un server Hetzner a Helsinki, Finlandia | **non visto** se è tornata; testo **impreciso** sul Paese (lacuna 8) | §1; `account-progetto.md` §15.4, punto 1 |
| Art. 28 — OVHcloud (`privacy@`) | responsabile con un accordo scritto, nell'UE | DPA nelle condizioni generali; il Paese esatto delle caselle non è verificato («in Europa») | conforme nel testo; Paese **non visto** | `account-progetto.md` §15.4, punto 2 |
| Art. 30 — registro dei trattamenti | — | bozza dell'autore, riletta il 2 ottobre con cinque trattamenti. Dopo quella data sono entrati segnalibri, tag «Svista» e scelte di preparazione (15–20 ottobre) | **non visto**; da rileggere (lacuna 4) | `account-progetto.md` §15.4, punto 5 |
| Capo V — trasferimenti | «i dati non escono dall'Unione europea» | misurato: sito in Finlandia, API in Polonia; dal documento copie nei Paesi Bassi, posta in Francia, `privacy@` in Europa. Nessuna risorsa da altri host (§1). Il carattere è servito da `site/` | conforme per i fornitori del servizio | §1 |
| Capo V — gli strumenti dell'autore | non nominati | i documenti del titolare stanno in **iCloud Drive**; le sessioni di sviluppo e di regia girano con **Claude**, e lanciano comandi sulla macchina (`rg-aggiorna`). Se un registro delle richieste con le email degli interessati sta in iCloud, o se l'uscita di `leggi.mjs`, del registro o di `journalctl` entra in una sessione di Claude, un dato personale esce verso fornitori che l'informativa non nomina, forse fuori dall'UE | **da decidere** (lacuna 2) | `account-progetto.md` §15.4 (cartella in iCloud); `CHANGELOG.md` («lanciato dalla regia sulla macchina») |

### 2.5 Sicurezza e violazioni (artt. 32–34)

| Requisito | Che cosa dice il testo | Che cosa fa il sistema | Esito | Fonte |
|---|---|---|---|---|
| Password | — | Argon2id `m=65536, t=2, p=1`; almeno 15 caratteri; elenco delle comuni; disattivata al centesimo fallimento | conforme | `account-progetto.md` §5; R-ACC-10, R-ACC-25, R-ACC-27 |
| Sessione | un cookie tecnico, al massimo trenta giorni | `__Host-rg`, `Secure; HttpOnly; SameSite=Strict; Max-Age` trenta giorni; nel database solo l'impronta | conforme | `server/conti.mjs:165`; R-ACC-16, R-ACC-26 |
| Trasporto | — | HTTPS ovunque; HSTS con `preload` sul sito, che copre `api.` per `includeSubDomains`; l'API non manda un HSTS suo | conforme; un rinforzo possibile (lacuna 10) | §1 |
| Niente log di accesso HTTP | «non annota le pagine che visiti» | Caddy senza direttiva `log`; il server non scrive IP fuori dal registro; statichost.eu dichiara di non conservare l'IP (non verificabile da qui) | conforme | `strumenti/macchina/Caddyfile` |
| Copie fuori sede | nei Paesi Bassi | `gzip` e `PUT` firmata; **nessuna cifratura nostra** prima dell'invio, la chiave delle copie può solo scrivere | **da decidere** (lacuna 5) | `strumenti/macchina/rg-copia`; `account-progetto.md` §15.4 («partono senza una cifratura nostra») |
| Difesa della pagina | — | nessuna `Content-Security-Policy`. Il cookie è `HttpOnly`, ma la copia `rg-account-…` in IndexedDB è leggibile da uno script nella pagina | rinforzo possibile (lacuna 10) | §1 |
| Art. 33 — accorgersene e notificare entro 72 ore | «ad accorgerci in tempo di una violazione» | allarmi del server ogni ora (accessi falliti, copia con meno righe, mail rifiutate, 300 mail); procedura e bozza della notifica nella cartella dell'autore; l'attività programmata gira solo con l'app aperta | allarmi conformi; procedura **non vista** | `server/allarmi.mjs`; `account-progetto.md` §15.4 |
| Le letture del titolare annotate | «ogni lettura è annotata» | `leggi.mjs` annota nella stessa transazione, prima di mostrare; una lettura con `sqlite3` sulla macchina non lascia traccia ed è della procedura dell'autore | conforme come strumento; procedura **non vista** | R-ACC-71…74 |

### 2.6 Cookie, minori, valutazione d'impatto

| Requisito | Che cosa dice il testo | Che cosa fa il sistema | Esito | Fonte |
|---|---|---|---|---|
| Art. 122 Codice privacy — senza account | nessun cookie, niente nel browser | misurato: niente | conforme | §1 |
| Art. 122 — con account | un cookie tecnico e la copia nel dispositivo | anche due chiavi in `localStorage`, `rg.ultimo-account` (la chiave casuale dell'account) e `rg.pulizia-chiave`, e le preferenze nella copia IndexedDB: tutto strettamente necessario al servizio chiesto, quindi senza consenso; ma il testo nomina solo cookie e copia | conforme nella sostanza; testo **incompleto** (lacuna 8) | `site/index.html:1792`, `:2381`, `:1572` |
| Banner | nessuno | nessuno, e nessun cookie non tecnico | conforme; **da decidere** la conferma del professionista (il primo parere del 1° ottobre lo dava per buono) | `account-progetto.md` §15.4, punto 9 del parere |
| Art. 8 — minori | account dai 18 anni | una frase nel modulo, nessuna verifica dell'età. La base è il contratto, non il consenso, quindi l'art. 8 (14 anni in Italia, art. 2-quinquies del Codice) in senso stretto non scatta | conforme come scelta; **da decidere** se serve altro | `site/index.html:1745`; `site/avvertenza.html:79` |
| Art. 35 — DPIA | — | nota dell'autore del 2 ottobre (non vista). Oggi la stima non c'è e le previsioni sono spente | **da decidere** con P-75 (§5) | `account-progetto.md` §15.4, punto 4 |
| Analytics | «non usiamo cookie di tracciamento o analytics» | misurato: nessuno script di terzi, nessuna richiesta fuori da `rottagiusta.it`; `test_nessuna_risorsa_di_terzi` verde | conforme | §1 |

---

## 3. Le lacune, dalla più grave

1. **Le copie di prima di un rilascio non scadono.** `rg-aggiorna` tiene le
   ultime cinque `aggiorna-*.db` sulla macchina, per numero (`ls -1t … | tail -n
   +6 | xargs -r rm -f`). Se i rilasci si diradano, una di queste copie tiene un
   account cancellato oltre i 30 giorni che l'informativa promette. Oggi, a
   contare i rilasci del CHANGELOG, la più vecchia sarebbe del 18 ottobre —
   undici giorni, dentro i 30 —: **è una lacuna latente, non ancora una promessa
   rotta**, ed è dedotta, perché la macchina non l'ho guardata. *Correzione
   proposta:* in `rg-aggiorna`, togliere le `aggiorna-*.db` più vecchie di
   trenta giorni oltre a tenere le ultime cinque (o tenerne soltanto una, la più
   recente, una volta che il rilascio risponde); e una riga del §2.7 che lo
   dica. Una copia vecchia resta anche il motivo per cui il file delle
   cancellazioni (lacuna 6) non può scadere: le due cose si decidono insieme.

2. **I dati personali possono uscire attraverso gli strumenti dell'autore.**
   Il servizio non trasferisce niente fuori dall'UE, ma il lavoro intorno sì,
   potenzialmente: la cartella del titolare è in iCloud Drive, e il sito si
   opera con sessioni di Claude che lanciano comandi sulla macchina. Un `leggi.mjs`,
   un `journalctl` o un registro delle richieste incollati in una sessione
   mandano email, IP e risposte a un fornitore che l'informativa non nomina.
   Dal CHANGELOG risulta una sola lettura in una sessione, sull'account
   dell'autore e con il suo sì. *Correzione proposta:* una regola nella
   procedura del titolare — `leggi.mjs`, `opposizione.mjs`, `sqlite3` e i log
   della macchina non si lanciano mai da una sessione di un assistente, e le
   sessioni sulla macchina fanno solo aggiornamenti e controlli che non
   stampano dati di chi studia —; e chiedere al professionista se iCloud va
   nominato o se il registro delle richieste va tenuto altrove.

3. **Chi tiene il conto del mese per le richieste.** L'informativa promette una
   risposta entro un mese. Dal 1° ottobre l'attività programmata non legge più
   `privacy@`, e il §15.4 dice che resta da decidere che cosa legga. Il rischio
   non è nel codice: è una richiesta letta tardi. *Correzione proposta:* un
   inoltro solo di avviso (senza il contenuto) da `privacy@` a un indirizzo che
   l'autore legge ogni giorno, o un promemoria fisso; e scriverlo nel §15.4.

4. **Il registro dei trattamenti è più vecchio del prodotto.** Riletto il 2
   ottobre; dopo sono entrati segnalibri, tag «Svista» e scelte di preparazione.
   Non l'ho visto. *Correzione proposta:* rileggerlo, e aggiungere alla
   chiusura di ogni rilascio che accende una raccolta la riga «registro dei
   trattamenti riletto» — come «Build now», un passo che un rilascio fermato a
   metà dimentica.

5. **Le copie partono senza una cifratura nostra.** Il bucket è privato e la
   chiave può solo scrivere; resta che chi ottiene accesso al bucket legge
   email e risposte. *Correzione proposta, da pesare con il ripristino:* cifrare
   la copia prima dell'invio con una chiave pubblica che sta sulla macchina e
   una privata che l'autore tiene offline; il prezzo è che un ripristino chiede
   quella chiave. Il §15.4 lo aveva già annotato senza decidere.

6. **Il file delle cancellazioni non ha una scadenza, e l'informativa non lo
   nomina.** Contiene `id`, chiave casuale e date: pseudonimo, ma legato al
   registro e a nient'altro di chi è stato cancellato. *Correzione proposta:*
   tenerlo quanto la copia più vecchia che potrebbe essere ripristinata (30
   giorni, se la lacuna 1 si chiude, più un margine), poi togliere le voci; e
   una frase nella sezione «Per quanto li conserviamo».

7. **L'export non porta la data d'esame.** È aperto nel §20 con la proposta
   «sì». Per la portabilità è un dato fornito da chi studia. *Correzione
   proposta:* quella del §20, con un test come R-ACC-79.

8. **Piccole imprecisioni dell'informativa e delle condizioni.**
   - il registro di sicurezza annota anche le mail **spedite** con l'oggetto
     (`server/conti.mjs:255`), le registrazioni con un'email già iscritta, gli
     allarmi e gli esiti delle copie; il testo elenca «le mail che il fornitore
     rifiuta». Proposta: «le mail che il servizio spedisce o che il fornitore
     rifiuta»;
   - «Hetzner (Germania)»: misurato, il sito risponde da Helsinki. Proposta:
     «Hetzner (UE)», o il Paese che statichost.eu conferma;
   - con l'account la pagina tiene in `localStorage` la chiave casuale
     dell'account e, nella copia del dispositivo, le preferenze: «Cookie e
     dispositivo» può nominarle in una frase;
   - la data delle condizioni (1° ottobre) è più vecchia del loro testo (20
     ottobre).

9. **L'archivio di prima degli account resta nei browser, e nessuno lo dice.**
   L'ADR-005 ha scelto di non leggerlo e non cancellarlo. Nel browser di questa
   verifica c'erano ancora `pn.filtro` e `open-patente-nautica`. Non è un dato
   che il titolare tratta oggi, ma l'ha scritto lui. *Proposta:* una frase
   nell'informativa — «se hai usato il sito prima del 3 ottobre 2026, il tuo
   browser può avere ancora le risposte di allora; le togli cancellando i dati
   del sito» —, o una decisione nuova sull'ADR-005.

10. **Rinforzi, non difetti:** una `Content-Security-Policy` in `site/_headers`
    (la pagina carica solo dalla sua origine e dall'API: una politica stretta è
    facile e protegge la copia IndexedDB da uno script iniettato); un HSTS
    mandato anche da Caddy per `api.`, che oggi lo eredita solo se il browser ha
    già visto `rottagiusta.it` o se il dominio è davvero nella lista di preload
    (non verificato).

---

## 4. Domande

### 4.1 Per l'autore — che cosa non posso vedere

1. La copia del DPA di statichost.eu **controfirmata** è tornata? Se no, da
   quando è stata spedita la tua?
2. Il registro dei trattamenti è stato riletto dopo il 2 ottobre, con
   segnalibri, tag «Svista» e scelte di preparazione?
3. Chi ti avvisa oggi di una mail nuova a `privacy@`, e in quanto tempo la vedi?
4. Il registro delle richieste e quello delle violazioni stanno in iCloud
   Drive: contengono email o altri dati di chi scrive?
5. Hai mai incollato in una sessione di Claude (o di un altro assistente)
   l'uscita di `leggi.mjs`, del registro o dei log della macchina, per un
   account che non fosse il tuo?
6. Le due LIA e la nota sulla DPIA del 2 ottobre: vuoi che una sessione le
   confronti con questo rapporto? (Stanno fuori dal repo: servirebbe che me le
   indicassi.)
7. Quante `aggiorna-*.db` ci sono oggi in `/var/lib/rg/copie`, e di che data?
   (Si vede con `ls -l` sulla macchina; non l'ho fatto apposta.)
8. Il Paese delle caselle OVHcloud e il Paese del server di statichost.eu: ti
   sono stati confermati per iscritto?

### 4.2 Per il professionista — i giudizi

1. **Il salvataggio sul 6.1.b** per un servizio gratuito, con le condizioni
   nell'avvertenza: regge, o serve un'altra base?
2. **Statistiche e registro sul 6.1.f**: le due LIA bastano? L'opposizione al
   registro «valutata caso per caso, di norma resta» è formulata bene?
3. **Il titolare con nome ed email**, senza indirizzo postale né PEC: basta per
   l'art. 13.1.a?
4. **I 18 anni senza verifica**: è sufficiente, visto che la base non è il
   consenso?
5. **Il cookie tecnico e le chiavi in `localStorage`** senza banner: confermato?
6. **Immutabilità delle risposte e art. 16**: va detto nell'informativa che le
   risposte non si rettificano, ma si cancellano o si azzerano?
7. **Limitazione (art. 18)**: basta gestirla a mano, su richiesta?
8. **Gli strumenti dell'autore** (iCloud, assistenti): vanno nominati, o basta
   la regola di non metterci dati di terzi?
9. **Quando P-75 accende esiti e previsioni** (§5): consenso o legittimo
   interesse per l'esito dichiarato; se la previsione registrata e non mostrata
   è profilazione (art. 4.4) e che cosa ne segue per l'informativa e per
   l'opposizione; se serve una DPIA (art. 35 e l'elenco del Garante, provv. n.
   467 dell'11 ottobre 2018).

---

## 5. Che cosa cambierebbe il quadro — rischi futuri, non difetti di oggi

- **P-75: esiti e previsioni.** Si accendono con una riga di `RACCOLTE`. Il
  rapporto chiede che, nello stesso commit, ci siano: la riga dell'informativa
  con la base scelta, la voce nel registro dei trattamenti, la risposta sulla
  DPIA, e — per la previsione — che cosa vede e che cosa può fare chi si oppone.
  Oggi le difese tecniche ci sono (raccolta spenta, misurata dal vivo).
- **I-19, la misura propria.** Conteggi aggregati sul server del sito, anche
  per chi non ha l'account. Riscrive «nessun analytics», R-ACC-09 e l'ADR-004
  («di chi non si registra non resta niente»). Se legge o scrive qualcosa nel
  browser, l'art. 122 chiede il consenso salvo le eccezioni delle linee guida
  del Garante del 10 giugno 2021 (statistiche di prima parte, aggregate, senza
  incroci); se non scrive niente, resta comunque un trattamento dell'IP con una
  base e una riga nell'informativa. Serve un ADR prima del codice, come dice la
  scheda.
- **I-28, un modello in pagina.** Gli errori di chi studia verso Anthropic,
  negli Stati Uniti: il primo trasferimento fuori dall'UE del servizio. Cade «i
  dati non escono dall'Unione europea»; servono il DPA (compreso nei termini
  commerciali, dice la scheda), una base per il trasferimento (Data Privacy
  Framework, iscrizione non verificata, o clausole tipo), una scelta esplicita
  di chi studia, e una DPIA da valutare seriamente.
- **«Segnala un problema».** Oggi mostra un segnaposto,
  `indirizzo-da-scegliere@example.invalid` (`site/index.html:6214`). L'indirizzo
  che l'autore sceglierà riceverà dati personali: va nell'informativa, con il
  fornitore e la conservazione, nello stesso commit.

---

## 6. Che cosa questa verifica non vede

- La macchina: nessun `ls`, nessun log, nessun database guardato; tutto quello
  che la riguarda viene dal codice di `strumenti/macchina/` e dal documento.
- La regola dei 30 giorni sul bucket, il DPA di OVHcloud, l'informativa di
  statichost.eu: dai documenti, non riletti oggi alla fonte.
- I documenti dell'autore (registro, procedura, LIA, nota sulla DPIA).
- Le prove con l'account sul sito pubblicato: per scelta, solo sul server
  locale delle suite.
- Safari e i dispositivi veri (Q-PROVE).
- Il giudizio giuridico: ogni «da decidere» qui sopra resta tale finché il
  professionista non lo chiude.
