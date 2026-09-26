# Area 2 — collaudo della sessione P-05

26 settembre 2026 · `ui/main` · realizzazione di [area-2-progetto.md](area-2-progetto.md).
Il prodotto verificato conserva l'archivio locale: gli account non sono ancora
integrati. Nessuna modifica a motore, banca, test, specifica, coda o versione.

## Realizzato e verificato

Cinque intenzioni, nella gerarchia prescritta; nessun ingresso Batteria.
Configurazioni separate in memoria, pannelli con bozza e Applica/Annulla/Esc,
radio per banca, quantità, profondità e prova. Per la vela c'è un solo elenco
per voci. Gli argomenti vengono dai quesiti caricati, senza statistiche dei
Progressi nella configurazione. Il filtro solo-mai-fatte appartiene alla sola
scelta per argomento. Le risposte storiche Batteria restano leggibili come
«Batteria (attività precedente)».

`selezioneQuiz(intenzione, conf, fonte)` è pura e di primo livello. Il banco
esistente la estrae dalla pagina e la esegue contro il motore e la banca reali.
L'anteprima e l'avvio consumano lo stesso snapshot; il click non pesca di nuovo.
Il cambio di fonte, giorno, banca o configurazione richiede un'anteprima nuova
e un secondo click. Il doppio click non crea una seconda attività.
`lunghezzaScreening` è consumata e registrata fra le chiamate protette in
[eccezioni-interfaccia.md](eccezioni-interfaccia.md).

## Evidenze funzionali

Oltre al banco esistente, 35 controlli eseguiti sotto Node sulle funzioni della
pagina, con DOM sostituito da oggetti di prova, banca reale e archivio sintetico
soltanto in memoria. Il programma di collaudo è temporaneo, fuori dal repo;
non aggiunge test nel territorio del motore. Sono stati esercitati:

| Caso | Osservazione |
|---|---|
| Nessun filtro base | 1.472 disponibili, tetto 20; da fare 1.472 con fonte vuota |
| Due errori e una corretta base | Disponibili 1.472, da fare 1.471, ripasso 2, nuovi 1.469 |
| Errore poi corretta | Resta nel ripasso, dopo l'errore aperto |
| Vela, prima voce, figura | Zero; spiegazione sui filtri e avvio disabilitato |
| Tutti i base corretti | Consiglio vuoto; argomento 1.472 di ripasso, da fare 0 |
| Giro base 1/2/4/6 | 44 / 85 / 167 / 249, uguali a lista e lunghezza del motore |
| Giro vela 1/2/4/6 | 3 / 6 / 12 / 18, uguali a lista e lunghezza del motore |
| Banca ridotta a un quesito | Giro da 6: una domanda, senza conteggi di meta |
| Lunghezza del giro divergente | Avvio bloccato, nessuna lista sostitutiva |
| Fonte, giorno o banca cambiati dopo anteprima | Primo click aggiorna senza partire; secondo apre la lista mostrata |
| Doppio avvio | Una sola attività e stessa lista dello snapshot |
| Caricamento / lettura fallita / condizioni assenti | Avvio bloccato e motivo; simulazione disponibile senza lettura storico |
| Scrittura fallita | Avviso di possibile mancato salvataggio e accesso a Info |
| 29 / 30 risposte con intervalli misurati | Nessuna durata / durata dall'orologio |
| Tempi base mentre si sceglie vela | Nessuna durata vela ricavata dai tempi base |
| Trenta righe senza timestamp | Nessuna durata promessa |

Nel browser locale sono stati svolti realmente i 20 quiz base e poi i 5 vela:
il primo riepilogo aspetta «Prosegui comunque con la vela», il secondo timer
parte da 15:00 soltanto dopo quel comando, gli esiti e le identità sono
separati. Le risposte di collaudo sono rimaste nell'origine locale di prova.
Non è stata aperta la produzione.

Provati anche: selezione vela da 99 quesiti; bozza che non cambia l'anteprima;
Annulla ed Esc che la scartano; filtro figure con zero effettivo; cambi di
attività senza trasferimento dei filtri; ingresso dal Percorso senza avvio;
Allena dai Progressi che apre l'intera voce con quantità Tutte e filtri spenti;
ritorno dal runner e focus sul controllo equivalente anche dopo il ridisegno
della vista. La ricarica riparte dal menu e dai default, senza riprendere liste
o timer. Il primo giro base da 6 per voce ha aperto proprio 249 domande.

## Evidenze visive e accessibilità

Screenshot **guardati** nel browser a **375 × 850** e **1280 × 1000**:
menu, configurazioni, pannelli e runner. Le immagini sono evidenze della
sessione, non asset pubblicati. Nessun overflow orizzontale alle due larghezze.
Testi lunghi e voci ministeriali vanno a capo, senza taglio.

Misure finali con `getComputedStyle` e rettangoli dei controlli: titolo Quiz
28 px, titoli di configurazione 24 px, corpo e controlli 16 px, note 14 px;
target minimi 44 px. Nella configurazione misurata il contrasto minimo del
testo è **5,16:1** e il confine del radio selezionato **9,78:1**. Le note
inizialmente misurate a 4,26:1 sono state corrette. L'avviso offline è stato
riportato nella vista Quiz e disposto senza comprimere il testo sul telefono.

Focus iniziale al titolo; Tab e Shift+Tab restano nel pannello, con ciclo fra
primo e ultimo controllo; Esc torna al pulsante di apertura. Il conteggio è
una regione live polite. Il disclosure del giro rimane aperto al ritorno.
Il browser integrato non ha applicato lo zoom tramite scorciatoie: verificato
il **reflow equivalente al 200% desktop**, a 640 × 500, senza overflow;
non viene dichiarata una prova di zoom nativo. La verifica su browser e
telefono reali e la prova con cinque persone restano all'autore (Q-PROVE).

## Trovato e contatto con la regia

`E.ritmo()` può restituire `affidabile:true` e `fonte:'orologio'` su trenta
righe con `sim_uid`, tempi `ms`, ma senza `ts`: `sessioni()` ripiega sulla somma
dei tempi quando non può misurare l'intervallo fra prima e ultima risposta.
Riprodotto nel collaudo in memoria. Il Quiz passa a `ritmo()` soltanto righe
della banca pertinente con timestamp leggibile; non ricalcola durate o medie.
Il motore e gli altri chiamanti, compreso il Percorso, restano alla regia:
valutare questo caso nel contratto dell'orologio su `main`.

Il service worker serve prima la cache: per verificare le revisioni locali
successive sono stati usati URL di collaudo con query distinte, senza cambiare
versione o cache e senza svuotare archivi. `ui/main` non ha upstream:
`git pull --ff-only` non ha applicato aggiornamenti né modificato configurazioni.

## Chiusura

Quattro suite complete, senza deselezioni: motore **130/132, 2 skip previsti**
(le due vecchie copie UI sono state rimosse), dati **236**, interfaccia **277**,
specifica **274**. Server **23/23** sia su Node 25.3 sia su Node 24.21 LTS;
pacchetto LTS separato con SHA-256 coincidente con `SHASUMS256.txt`.
Controllo della documentazione e guardiano verdi. Changelog additivo;
un commit UI con trailer, senza rilascio né push.

La regia può integrare l'area 2 e chiudere il regime vecchio dei controlli
(punto 5b della coda); il ciclo generale del runner resta all'area 3.
Gli stati account richiedono il client e il suo rilascio, come stabilito nel
progetto: qui i testi descrivono il regime locale effettivamente esistente.
