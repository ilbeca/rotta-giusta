# ADR-007: Un agente solo — via il recinto dell'interfaccia, un worktree per sessione

## Status

**Accepted** — 28 ottobre 2026, due decisioni dell'autore prese in chat lo
stesso giorno, e una terza presa sulla proposta di questo ADR:

1. ChatGPT non si usa più nel progetto («ho deciso che non useremo più
   chatgpt»).
2. Le regole si semplificano: niente più territorio separato per
   l'interfaccia («no more separate UI territory»).
3. Al posto del recinto, **un worktree per sessione** che scrive codice, e la
   regia sola nel checkout principale (scelta fra le tre alternative qui
   sotto).

**Sostituisce**, in questo repo, la sezione «Chi tocca cosa» di `AGENTS.md`
com'era dal 9 settembre 2026 e i territori `motore`, `regole` e `interfaccia`
di `territori.yaml`. Non tocca l'ADR-004 di `~/Software/Standards`, che resta
il metodo: è la sua applicazione qui che cambia.

## Date

2026-10-28

## Context

**Perché il recinto era nato.** Il 7 settembre 2026, su `patente-gioco`, Claude
e ChatGPT nella stessa cartella si sono rotti a vicenda in cinque modi, e
nessuno dei cinque ha dato un errore: fra gli altri un `git add -A` che ha
rimesso in stage i file che l'altro agente aveva appena annullato, e `VERSION`
che si spostava sotto le mani di chi lo leggeva. L'ADR-004 di `Standards` ne ha
tratto la regola — una regola che un agente deve ricordare si sostituisce con
un controllo che git esegue — e qui, dal 9 settembre, il controllo è stato
`territori.yaml` letto dal `pre-commit`: `main` rivendicava `motore` e
`regole`, `ui/*` rivendicava `interfaccia` (`site/` tranne motore, banca e
figure, e i `docs/*-ux.md`). ChatGPT stava nel worktree
`~/Software/rotta-giusta-ui` sul ramo `ui/main`, Claude nel checkout principale
su `main`, e il lavoro dell'interfaccia arrivava su `main` con una merge della
regia, preceduta da `check_territories.py --range`.

Dal 26 settembre al 28 ottobre la coda ha avuto 33 prompt per ChatGPT, da P-01
a P-102, quasi tutti arrivati su `main` attraverso quel ramo.

**Perché adesso esce.** Il recinto separava due agenti, e da oggi l'agente è
uno. Con un ramo solo che scrive l'interfaccia e quel ramo che non esiste più,
il territorio `interfaccia` protegge da nessuno — e intanto impedisce a `main`
di toccare `site/`, cioè costringe ogni lavoro sulla pagina a passare da un
ramo che nessuno usa più. È il tipo di regola che si aggira: misurato, un
commit su `site/index.html` da `main` è rifiutato («del territorio
`interfaccia`, che qui non è tuo»), e l'unica uscita sarebbe `TERRITORI_OK`,
che è dell'autore.

**Che cosa ha trovato misurarlo — il guasto muto dentro il recinto.** Prima di
toglierlo, il `pre-commit` è stato provato dal vero su un clone usa e getta,
accanto a `Standards`, con un commit per ogni caso:

| Dove | Che cosa | Con le regole di prima | Con quelle di questo ADR |
|---|---|---|---|
| `main`, checkout principale | un file di `site/` | **rifiutato** | passa |
| `main` | una riga tolta dal CHANGELOG | rifiutato | **rifiutato** |
| worktree accanto al repo, ramo `claude/…` | un file di `tests/` | **rifiutato** (è di `main`) | passa |
| worktree in `.claude/worktrees/`, ramo `claude/…` | `tests/` e `AGENTS.md` | **passa in silenzio**: «Standards non è accanto a questo repo: territori non controllati», uscita 0 | passa, ma il controllo gira |
| worktree in `.claude/worktrees/` | una riga tolta dal CHANGELOG | **passa in silenzio** | **rifiutato** |
| worktree in `.claude/worktrees/` | `VERSION` senza CHANGELOG | **passa in silenzio** | **rifiutato** |
| un repo senza `Standards` accanto | qualunque commit | passa in silenzio | **rifiutato**, e dice dove l'ha cercato |

La quarta riga è la scoperta. Il hook cercava `Standards` in
`$(git rev-parse --show-toplevel)/../Standards`; da una cartella dentro
`.claude/worktrees/` — dove l'app di Claude Code crea i worktree di ogni
sessione — quel percorso non esiste, e il hook usciva con 0 e una riga che
nessuno legge. **Tutte le sessioni di Claude in un worktree hanno committato
senza nessun controllo**: territori, changelog additivo, «numero e voce
insieme». È così che P-97 e P-99 hanno potuto committare `tests/` e la
specifica da un ramo `claude/…` che il recinto, se avesse girato, avrebbe
rifiutato. Il recinto proteggeva il checkout principale e il worktree di
ChatGPT, che stavano accanto a `Standards`; le sessioni parallele di Claude, no.

## Decision

**1. ChatGPT esce dal progetto.** Il lavoro che i prompt della coda gli
assegnavano — il giro B del volto, P-75, la pagina del giro 3, P-102 — è di
Claude. Il trailer `Co-authored-by: ChatGPT` non si usa più; i commit di prima
lo tengono.

**2. `territori.yaml` perde i territori e i rami.** Resta il file, perché è lui
che dice al `pre-commit` che il controllo vale qui, con due chiavi:
`changelog: CHANGELOG.md` e `version: VERSION`. Il hook di `Standards` con un
file così esegue due delle sue tre regole — **il changelog additivo** (sotto
`[Unreleased]` si aggiunge, non si cancella, salvo nel commit di rilascio) e
**numero e voce insieme** (`VERSION` non entra senza `CHANGELOG.md`) — e la
terza, i territori, non trova niente da controllare. Misurato, sopra.

Non resta nemmeno il territorio `regole`: rivendicato da `main`, avrebbe
rifiutato ogni modifica alle regole da un worktree, cioè proprio dove da oggi
si lavora; e dopo la correzione del hook (punto 4) quel rifiuto sarebbe stato
vero. Le regole le cambia chi ha la penna — oggi la regia —, e una modifica
arriva su `main` solo con una merge che la regia guarda.

**3. Al posto del recinto, un worktree per sessione.** Scelta dell'autore fra
tre alternative:

- **un worktree per sessione** *(scelta)*: ogni sessione che scrive codice o
  documenti lavora nella sua cartella `.claude/worktrees/<nome>`, su un ramo
  suo, che è già il default dell'app; il suo lavoro arriva su `main` con una
  merge della regia. Nel checkout principale, su `main`, scrive solo la regia —
  la coda, le merge, i rilasci;
- *tutti su `main`, uno per volta*: più semplice, ma niente separa due sessioni
  che toccano lo stesso file o committano il lavoro dell'altra;
- *un recinto leggero*, `main` che rivendica motore e regole e i worktree solo
  `site/`: scartato, perché rifiuterebbe il lavoro che P-97 e P-99 hanno fatto
  da un worktree.

Con il worktree la protezione non è più un rifiuto del hook ma una cartella
diversa: due sessioni non condividono né l'indice né i file, quindi un
`git add` non può prendere il lavoro dell'altra. Il conflitto, se c'è, arriva
alla merge, dove si vede e si ferma (`git merge --abort`), invece che in un
commit muto.

**4. Il `pre-commit` trova `Standards` anche dai worktree, e se non lo trova
rifiuta.** `.githooks/pre-commit` parte dalla cartella git comune
(`git rev-parse --git-common-dir`), che è quella del checkout principale da
qualunque worktree; `RG_STANDARDS` può indicare un'altra cartella. Se
`check_territories.py` non c'è, il commit **non parte** e il messaggio dice
dove l'ha cercato: un controllo che non trova se stesso non è un permesso di
procedere, ed è esattamente il silenzio che questo ADR ha trovato.

**5. Che cosa resta com'era.** Stage per nome, mai `git add -A` né `.`, mai
`--no-verify`; `TERRITORI_OK` resta dell'autore. `CHANGELOG.md merge=union` in
`.gitattributes`, e dopo una merge la riga vuota fra due voci. Prima di fondere
un ramo, `check_territories.py --range main...<ramo>`: senza territori guarda
le righe tolte dal CHANGELOG sull'intervallo, che è il controllo che la merge,
non passando dal `pre-commit`, altrimenti salta. **Una penna sola su
`site/index.html`**: l'unità di conflitto è il file, non l'agente, e la pagina
è un file da centinaia di KB (decisione 18 di `docs/volto-progetto.md`). La
porta 8620 resta una sola fra tutti i worktree. La versione la alza soltanto il
commit di rilascio, su `main`, dopo la merge.

## Consequences

**Il prezzo, per intero.**

1. **Il recinto proteggeva anche fra sessioni di Claude nello stesso
   checkout.** Una sessione su `main` non poteva committare `site/`: se
   un'altra sessione stava modificando la pagina nella stessa cartella, quelle
   modifiche non potevano finire nel commit sbagliato. Da oggi sì, se due
   sessioni lavorano nella stessa cartella e una mette in stage un file che non
   ha toccato. Lo stage per nome lo riduce, non lo impedisce: è di nuovo una
   regola da ricordare, quella che l'ADR-004 di `Standards` voleva togliere.
   Il worktree per sessione è ciò che rende la regola poco costosa da
   rispettare, non un controllo che la fa rispettare.
2. **Niente impedisce più a una sessione di toccare le regole o la
   specifica.** Prima `AGENTS.md`, `territori.yaml` e la specifica erano di
   `main`; da oggi un worktree li può cambiare, e la sola difesa è che la regia
   guarda il diff prima della merge. La specifica resta «una penna sola»
   (§0), ma come regola, non come controllo.
3. **Un worktree che resta indietro.** Una sessione che parte da un `main`
   vecchio e lavora a lungo arriva alla merge con un conflitto, o con un
   controllo che su `main` è già cambiato. È il prezzo noto dei rami; lo
   abbassa partire da `main` aggiornato e fondere presto.
4. **Una sessione nella cartella principale è ancora possibile**, e il hook
   non la ferma. La regola — nel checkout principale scrive solo la regia —
   sta in `AGENTS.md` e nella coda.

**Che cosa si guadagna.** Un ramo e una cartella per lavoro, invece di due
agenti con due insiemi di file; nessun rifiuto da aggirare per lavorare sulla
pagina; e il controllo dei commit che **gira davvero** in ogni worktree, dove
fino a oggi non girava affatto.

**I rami e le cartelle dell'interfaccia.** Misurato il 28 ottobre 2026:
`git log main..ui/main` e `git log main..ui/vetrina` sono vuoti, come
`origin/ui/main` e `origin/ui/vetrina`; i worktree `~/Software/rotta-giusta-ui`
e `~/Software/rotta-giusta-vetrina` sono puliti, senza stash e senza file
ignorati. Niente di quello che contengono manca a `main`. Restano dove sono,
per scelta dell'autore, finché non decide di toglierli: cancellare un ramo
remoto è un'azione pubblica sul repo.

**Che cosa non si fa.** Non si riscrive la storia: i prompt chiusi, il
CHANGELOG, il registro della coda e le voci della specifica che raccontano
ChatGPT restano come sono stati scritti. Cambiano soltanto le frasi al
presente.
