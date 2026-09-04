# ADR-001: Un repo nuovo con un primo commit solo, non un fork

## Status

**Accepted** — 4 settembre 2026.

## Date

2026-09-04

## Context

Questo sito è l'estratto di un progetto personale di preparazione all'esame di
patente nautica: un servizio con server, database e un solo utente, in un repo
privato. Il modo ovvio per pubblicarlo sarebbe rendere pubblico quel repo, o
forkarlo.

Ma la storia di quel repo contiene il nome della rete privata dell'autore,
l'indirizzo e il nome della macchina su cui il servizio gira, e un database di
risposte personali mai versionato ma citato ovunque. Cancellare quei file oggi
non li toglierebbe dai commit vecchi, e riscrivere la storia è possibile,
fastidioso, e comunque inutile per chiunque avesse già clonato. Il repo
contiene anche materiale di lavoro di terzi che non è mai stato destinato alla
pubblicazione.

## Decision

**Si parte da un repo nuovo, seminato da file scelti uno per uno, con un primo
commit che dichiara da dove viene.** Il repo di origine resta privato.

Il codice del motore e della pagina arriva com'è; il CHANGELOG arriva intero,
riletto per togliere i dati delle macchine; i dati arrivano da una copia già
ripulita e verificata contro il PDF ufficiale del decreto, che sta nel repo
accanto allo script di verifica. Un controllo eseguibile (`strumenti/controlla.py`)
fallisce se nel repo rientrano identificatori privati o materiale di terzi:
un'istruzione in un prompt è una promessa, un test è un controllo.

## Alternatives Considered

- **Rendere pubblico il repo esistente**: pubblica la topologia di una rete
  privata e materiale di terzi, per sempre.
- **Fork con storia riscritta** (`filter-repo`): giornate di lavoro per
  ottenere una storia che non si può comunque garantire pulita, e i cloni
  esistenti la conservano intatta.
- **Pubblicare solo i documenti** (già tentato nel progetto originario con un
  mirror): una seconda fonte di verità, finita nove versioni indietro.

## Consequences

### Positive
- Nessun identificatore privato in nessun commit, per costruzione.
- Il primo commit è onesto: dice che cosa è e da dove viene.
- La verifica dei dati contro il decreto è rieseguibile da chiunque.

### Negative
- La storia del codice fino alla 0.18.0 non è nel `git log`: sta nel
  CHANGELOG, che per questo si pubblica intero.
- Le correzioni future al progetto originario non si prendono con un merge.

### Risks
- Che un file di troppo entri per distrazione (`git add -A`). Mitigato da
  `.gitignore` e dal controllo che gira nella suite.
