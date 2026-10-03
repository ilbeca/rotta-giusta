---
name: rotta-giusta
description: >
  Coordinate di Rotta Giusta, il sito open source con quiz e carteggio per la
  patente nautica senza limiti dalla costa: pagine statiche, e un server a parte
  per gli account. Dove guardare e le trappole. MUST trigger on: rotta giusta, rotta-giusta, open patente nautica (nome fino alla 0.19.2), sito
  statico patente, statichost patente, rottagiusta.it, api.rottagiusta.it, server degli account, Cloudflare Pages patente (hoster fino alla 0.26), pubblicare la palestra. NON per il
  progetto personale di preparazione (patente), che e' un altro repo.
---

# Rotta Giusta

Sito con i 1.722 quesiti e i 135 esercizi di carteggio dell'Allegato A al DD
131/2022 e il motore di selezione del progetto personale da cui e' estratto.
Senza account si prova e non resta niente, nemmeno nel browser; con l'account
le risposte si salvano sul server, in chiaro (ADR-003, ADR-004). Niente
offline, e niente passaggio dell'archivio di prima degli account (ADR-005).
Repo
`~/Software/rotta-giusta` sull'Air, remoto `ilbeca/rotta-giusta` (pubblico).

Due cose pubblicate, in due modi:

- **le pagine**, cartella `site/`, da statichost.eu su `rottagiusta.it`, con
  «Build now» dopo il push (nessun webhook: il push da solo non pubblica).
  Nessun build step;
- **il server degli account**, cartella `server/`, su `api.rottagiusta.it`: Node
  senza dipendenze npm e un file SQLite, su una macchina Scaleway, dove gira
  soltanto un tag pubblicato. Come si aggiorna e come si torna indietro:
  `docs/account-progetto.md` §2.7.

## Dove sono le informazioni

| domanda | comando |
|---|---|
| vincoli, comandi, difetti aperti | `AGENTS.md` — il primo da leggere |
| chi tocca cosa, e chi lo fa rispettare | `territori.yaml`, letto da `.githooks/pre-commit` |
| che versione c'e' nel repo | `cat VERSION`, o `git describe --tags` |
| cosa e' uscito e **perche'** | `CHANGELOG.md` |
| perche' esiste, da dove vengono i dati, cosa e' stato corretto | `README.md` |
| perche' e' stato scelto cosi' | `docs/adr/` |
| che cosa passa | `AGENTS.md`, «Comandi»: cinque suite, compresa `node --test tests/test_server.mjs` |
| che cosa e' il prodotto, e ogni requisito col suo controllo | `docs/specifica.md` |
| come sono fatti gli account, server e pagina | `docs/account-progetto.md`, `docs/account-client-progetto.md` |
| che cosa si fa dopo, e in che ordine | `docs/prossime-sessioni.md` |
| i dati sono ancora quelli del decreto? | `python3 fonte/verifica.py` |
| e' rientrato qualcosa che non deve uscire di casa? | `python3 strumenti/controlla.py` |
| il sito in locale | `python3 strumenti/serve.py` — riproduce statichost.eu, misurato |

## Le trappole

1. **La logica di selezione sta solo in `site/engine.js`.** Nessuna seconda
   implementazione, ne' nella pagina ne' altrove.
2. **Una sola versione, in due posti, tenuta insieme da un test**: `VERSION`
   e `versione` in `site/dati/meta.json`. Un rilascio li alza tutti e due, e
   serve una voce di CHANGELOG con lo stesso numero. Fino al 3 ottobre 2026 i
   posti erano tre, con `CACHE` in `site/sw.js`.
3. **`site/sw.js` non si toglie e non torna a fare cache.** Dall'ADR-005 il
   sito non e' offline e la pagina non registra un service worker; `sw.js`
   resta pubblicato, almeno fino al 3 ottobre 2028, perche' disinstalla quello
   che la 0.29.0 ha lasciato a chi l'ha visitata. Senza, quel browser
   resterebbe sulla 0.29.0 per sempre. Dopo un rilascio basta una ricarica.
4. **Il repo di origine e' privato e resta tale.** Non si forka, non si rende
   pubblico, non si copia da `data/seed/`: i dati arrivano solo da
   `site/dati/`, e `strumenti/controlla.py` fallisce se rientra materiale che
   non e' del decreto o un identificatore delle macchine dell'autore.
5. **Niente push senza chiedere.** E dopo il push di un rilascio, «Build now» su
   statichost.eu: senza, `rottagiusta.it` resta alla versione di prima. Il
   server degli account si aggiorna a parte, sulla sua macchina, allo stesso
   tag (`rg-aggiorna <tag> <commit>`, con il commit letto sul Mac da
   `git rev-parse <tag>^{commit}`): nessuno dei due passi fa l'altro.
6. **Su questo repo lavorano due agenti, e il confine lo fa rispettare git.**
   ChatGPT sta nel worktree `~/Software/rotta-giusta-ui` sul ramo `ui/main` e
   tiene l'interfaccia; Claude sta nel checkout principale su `main` e tiene
   motore, dati, test e documenti. `territori.yaml` dice chi tocca cosa e il
   `pre-commit` rifiuta un commit fuori territorio. Mai `--no-verify`, mai
   `git add -A`: si mette in stage per nome. Il perche' e' in `AGENTS.md`,
   sezione «Chi tocca cosa».
7. **Lo storico derivato non si salva e non viaggia.** Le righe delle risposte
   si uniscono per `uid` fra server e dispositivo; lo specchio che il motore
   legge si ricalcola sempre in locale con `ripiega()`. Una seconda contabilita'
   che viaggia e' la sincronia che nella 0.4.2 ha perso giorni di studio.

## Git

Vedi la skill `git-standards`. Repo HTTPS con l'helper `gh`, branch `main`.
