---
name: rotta-giusta
description: >
  Coordinate di Rotta Giusta, il sito statico open source con quiz e
  carteggio per la patente nautica senza limiti dalla costa. Dove guardare e le
  trappole. MUST trigger on: rotta giusta, rotta-giusta, open patente nautica (nome fino alla 0.19.2), sito
  statico patente, Cloudflare Pages patente, pubblicare la palestra. NON per il
  progetto personale di preparazione (patente), che e' un altro repo.
---

# Rotta Giusta

Sito statico con i 1.722 quesiti e i 135 esercizi di carteggio dell'Allegato A
al DD 131/2022, il motore di selezione del progetto personale da cui e' estratto,
e le risposte che restano nel browser di chi studia. Repo `~/Software/rotta-giusta`
sull'Air, remoto `ilbeca/rotta-giusta` (pubblico), pubblicato da
Cloudflare Pages a ogni push su `main`, cartella `site/`. Nessun server, nessun
database, nessun build step.

## Dove sono le informazioni

| domanda | comando |
|---|---|
| vincoli, comandi, difetti aperti | `AGENTS.md` — il primo da leggere |
| chi tocca cosa, e chi lo fa rispettare | `territori.yaml`, letto da `.githooks/pre-commit` |
| che versione c'e' nel repo | `cat VERSION`, o `git describe --tags` |
| cosa e' uscito e **perche'** | `CHANGELOG.md` |
| perche' esiste, da dove vengono i dati, cosa e' stato corretto | `README.md` |
| perche' e' stato scelto cosi' | `docs/adr/` |
| che cosa passa | `node --test tests/test_engine.mjs` e `python3 tests/test_dati.py` |
| i dati sono ancora quelli del decreto? | `python3 fonte/verifica.py` |
| e' rientrato qualcosa che non deve uscire di casa? | `python3 strumenti/controlla.py` |
| il sito in locale | `python3 strumenti/serve.py` — riproduce i 308 di Pages |

## Le trappole

1. **La logica di selezione sta solo in `site/engine.js`.** Nessuna seconda
   implementazione, ne' nella pagina ne' altrove.
2. **Una sola versione, in tre posti, tenuta insieme da un test**: `VERSION`,
   `CACHE` in `site/sw.js`, `versione` in `site/dati/meta.json`. Un rilascio
   li alza tutti e tre, e serve una voce di CHANGELOG con lo stesso numero.
3. **Dopo un rilascio serve una ricarica in piu'** sul dispositivo: la prima
   serve ancora dalla cache precedente. La schermata Info dice quale cache e'
   installata.
4. **Il repo di origine e' privato e resta tale.** Non si forka, non si rende
   pubblico, non si copia da `data/seed/`: i dati arrivano solo da
   `site/dati/`, e `strumenti/controlla.py` fallisce se rientra materiale che
   non e' del decreto o un identificatore delle macchine dell'autore.
5. **Niente push senza chiedere.** Un push pubblica.
6. **Su questo repo lavorano due agenti, e il confine lo fa rispettare git.**
   ChatGPT sta nel worktree `~/Software/rotta-giusta-ui` sul ramo `ui/main` e
   tiene l'interfaccia; Claude sta nel checkout principale su `main` e tiene
   motore, dati, test e documenti. `territori.yaml` dice chi tocca cosa e il
   `pre-commit` rifiuta un commit fuori territorio. Mai `--no-verify`, mai
   `git add -A`: si mette in stage per nome. Il perche' e' in `AGENTS.md`,
   sezione «Chi tocca cosa».

## Git

Vedi la skill `git-standards`. Repo HTTPS con l'helper `gh`, branch `main`.
