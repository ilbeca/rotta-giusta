#!/usr/bin/env python3
"""La struttura dell'interfaccia: che cosa esiste, e come ci si arriva.

Perche' esiste. Il 9 settembre 2026, durante il ridisegno della navigazione, la
schermata «Che tecnica serve?» ha perso il suo unico ingresso: la vista era
ancora nel file, la sua logica pure, e nessun elemento della pagina la apriva
piu'. Nello stesso ridisegno `E.peggiori()` e' rimasta senza chiamanti. Nessuna
delle due cose ha fatto fallire un test, perche' non esisteva da nessuna parte
un elenco di che cosa deve esistere e di come ci si arriva.

Questi controlli sono quell'elenco, in forma eseguibile. Sono la traduzione dei
requisiti R-NAV-* di `docs/specifica.md`, §9.4.

**Che cosa NON fanno.** Non decidono la struttura della navigazione: quante
voci abbia la barra e come si chiamino e' la questione Q-NAV, che decide
l'autore (specifica, §10). Un test che fissasse la composizione della barra
prenderebbe quella decisione al posto suo. Qui si controllano gli invarianti che
valgono con quattro destinazioni, con sette e con qualunque altra scelta.

    python3 tests/test_interfaccia.py
"""

import json
import re
import subprocess
import sys
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
SITE = RADICE / 'site'

fatti = 0
falliti = []


def check(nome, cond, extra=''):
    global fatti
    fatti += 1
    if not cond:
        falliti.append(nome + (' — ' + extra if extra else ''))


def leggi(p):
    return (SITE / p).read_text(encoding='utf-8')


# --- il censimento, che e' anche la documentazione -----------------------------
#
# Aggiungere una schermata significa aggiungere una riga qui. E' voluto: e' il
# punto in cui qualcuno deve dire ad alta voce che cosa sta aggiungendo, e con
# quale ingresso.

VISTE = {
    'v-oggi': 'la Rotta (gia\' «Oggi»)',
    'v-quiz': 'i quiz (gia\' «Allenamento»)',
    'v-cart': 'l\'ambiente Carteggio',
    'v-diag': 'i progressi (gia\' «Diagnosi»)',
    'v-tec':  'il drill «Che tecnica serve?»',
    'v-seg':  'il gioco dei Segnali',
    'v-info': 'Info e diagnostica',
}

# Viste che si aprono per una via diversa da un `data-v`. Ogni riga porta il
# perche': una vista senza porta e senza eccezione dichiarata e' codice morto
# che sembra vivo.
PORTE_FUORI_DAL_DOM = {}

# I quiz hanno due regimi riconosciuti, e il controllo sa in quale si trova.
#
# Il regime ATTUALE, a sei ingressi, e' la pagina pubblicata: sei mestieri, e la
# specifica (§4.2) dice perche' non si accorpano. Il regime PROGETTATO, a cinque,
# e' l'area 2 (docs/area-2-progetto.md): Batteria sparisce come ingresso e il suo
# mestiere resta in «Scegli un argomento», i filtri diventano locali. Il §10.1 di
# quel progetto chiede che nel regime nuovo si eserciti la selezione — funzioni e
# parametri — e non la presenza dei nomi, e che `main` resti verde nel passaggio.
#
# **Il regime attuale ha una scadenza:** la regia lo toglie quando integra P-05.
# Da quel commit `MODI_SEI` e il ramo che la usa spariscono, e una pagina a sei
# ingressi torna a essere rossa.
MODI_SEI = ['mirata', 'argomento', 'sbagliate', 'sim', 'screening', 'batteria']
MODI_CINQUE = ['mirata', 'argomento', 'sbagliate', 'sim', 'screening']
BANCO_QUIZ = RADICE / 'tests' / 'quiz_intenzioni.mjs'
RIFERIMENTO_QUIZ = RADICE / 'tests' / 'pagina-quiz-intenzioni.html'

# Il ciclo dei quiz ha anch'esso due regimi, con lo stesso meccanismo.
#
# Il regime ATTUALE e' la pagina pubblicata: `fine()` disegna il riepilogo con
# gli errori del runner, e nessuna riprova delle sole risposte sbagliate di
# quell'attivita' esiste. Il regime PROGETTATO e' l'area 3
# (docs/area-3-progetto.md): riepilogo, anteprima e avvio della riprova passano
# da tre funzioni di raccordo, e il §10.1 di quel progetto chiede che il
# controllo le **esegua** — riepilogo → anteprima → avvio, con i dati che
# cambiano fra un clic e l'altro — invece di cercare un nome o un pulsante.
#
# Il regime si riconosce dal raccordo: una pagina che dichiara una delle tre
# funzioni e' nel progettato, e deve dichiararle tutte. **Il regime attuale ha
# una scadenza:** la regia lo toglie quando integra P-19.
RACCORDO_CICLO = ['riepilogoQuiz', 'anteprimaRiprova', 'avviaRiprova']
BANCO_CICLO = RADICE / 'tests' / 'ciclo_quiz.mjs'
RIFERIMENTO_CICLO = RADICE / 'tests' / 'pagina-ciclo-quiz.html'

# Export del motore che la pagina non chiama, e non e' un difetto. Ogni riga ha
# il motivo e, dove serve, la condizione alla quale sparisce.


# ── Che cosa la pagina consuma dal motore ─────────────────────────────────────
#
# Il gemello del controllo sugli orfani, dall'altro lato. Quello prende una
# funzione esportata che nessuno chiama; questo prende una funzione **che la
# pagina chiamava e non chiama piu'**.
#
# Esiste per un caso vero: nella merge della nuova Rotta — 468 righe in
# `app.html` — `E.peggiori()` e' uscita dal prodotto senza che nessuno lo
# decidesse, e l'ha trovata il controllo sugli orfani **dopo** la fusione.
# Questo la prenderebbe prima, e nominandola.
#
# Togliere una chiamata e' legittimo: si toglie anche di qui, e il commit dice
# perche'. Quello che non e' legittimo e' che sparisca in silenzio.
#
# ── Le eccezioni dichiarate stanno FUORI da qui ───────────────────────────────
#
# I controlli sono in questo file, che e' territorio `motore`; le eccezioni
# stanno in `docs/eccezioni-interfaccia.md`, che e' neutro. Non e' pignoleria:
# a togliere un'eccezione e' chi corregge il difetto, e chi corregge
# l'interfaccia lavora su `ui/*`, dove `tests/` gli e' precluso. Tenendole qui,
# una correzione lascerebbe la suite rossa e nessuno potrebbe chiuderla.
FONT_MINIMO = 11
ALT_GENERICI = {'figura', 'immagine', 'image', 'foto', 'grafico', 'icona', 'logo'}
ECCEZIONI = RADICE / 'docs' / 'eccezioni-interfaccia.md'


def tabella(titolo, colonne):
    """Le righe di una tabella markdown sotto un titolo, come tuple."""
    if not ECCEZIONI.exists():
        return None
    testo = ECCEZIONI.read_text(encoding='utf-8')
    m = re.search(r'^##\s+' + re.escape(titolo) + r'\s*$(.*?)(?=^## |\Z)',
                  testo, re.M | re.S)
    if not m:
        return None
    out = []
    # Le prime due righe di una tabella markdown sono intestazione e separatore:
    # si saltano per posizione, non per contenuto. Riconoscerle dal nome della
    # prima colonna vuol dire che una tabella nuova, con un'intestazione diversa,
    # si porta dentro la propria intestazione come se fosse un dato.
    for n, r in enumerate(re.findall(r'^\|(.+)\|\s*$', m.group(1), re.M)):
        if n < 2:
            continue
        celle = [c.strip().strip('`') for c in r.split('|')]
        if len(celle) != colonne:
            continue
        out.append(tuple(celle))
    return out


def senza_commenti(testo):
    """Toglie i commenti, per non scambiare una citazione per un uso.

    Euristica dichiarata, non un parser: si tolgono i blocchi /* */ e le righe
    che cominciano con //, * o <!--. Basta per questo file e non pretende di
    piu'; se un giorno non bastasse, il sintomo sarebbe un falso allarme, che e'
    il verso giusto in cui sbagliare.
    """
    testo = re.sub(r'/\*.*?\*/', ' ', testo, flags=re.S)
    righe = [r for r in testo.split('\n')
             if not re.match(r'\s*(//|\*|<!--)', r)]
    return '\n'.join(righe)


# --- 1. il censimento e' completo -----------------------------------------------

def test_viste_dichiarate():
    app = leggi('app.html')
    # `class` porta anche `on` e le classi dell'interfaccia nuova, quindi il
    # censimento non puo' pretendere la stringa esatta: cerca una sezione con
    # la classe `view` e un id `v-*`, comunque sia scritto l'attributo.
    trovate = set(re.findall(r'<section class="[^"]*\bview\b[^"]*" id="(v-[a-z]+)"', app))
    check('ogni vista del file e\' dichiarata qui',
          trovate <= set(VISTE),
          'non dichiarate: ' + ', '.join(sorted(trovate - set(VISTE))))
    check('ogni vista dichiarata esiste nel file',
          set(VISTE) <= trovate,
          'dichiarate ma assenti: ' + ', '.join(sorted(set(VISTE) - trovate)))


# --- 2. ogni vista ha una porta (R-NAV-01) ---------------------------------------

def test_ogni_vista_ha_una_porta():
    app = leggi('app.html')
    porte = set(re.findall(r'data-v="([a-z]+)"', app))
    for vid, cosa in sorted(VISTE.items()):
        chiave = vid[2:]
        ok = chiave in porte or vid in PORTE_FUORI_DAL_DOM
        check('si puo\' aprire: %s' % cosa, ok,
              'la vista #%s esiste ma nessun elemento la apre. Se e\' voluto, '
              'dichiaralo in PORTE_FUORI_DAL_DOM col perche\'.' % vid)


# --- 3. la barra si legge, e non porta altrove (R-NAV-03) -------------------------

def test_voci_barra():
    app = leggi('app.html')
    m = re.search(r'<nav[^>]*>(.*?)</nav>', app, flags=re.S)
    check('la pagina ha una barra di navigazione', m is not None)
    if not m:
        return
    voci = re.findall(r'<button[^>]*data-v="([a-z]+)"[^>]*>(.*?)</button>',
                      m.group(1), flags=re.S)
    check('la barra ha almeno una voce', len(voci) > 0)
    for dest, dentro in voci:
        check('la voce «%s» porta a una vista dichiarata' % dest,
              'v-' + dest in VISTE,
              'porta a #v-%s, che non e\' nel censimento' % dest)
        # Un'icona sola non e' un'etichetta: la parola fa tutto il lavoro, e a
        # 375 px la parola c'e' sempre stata. Se sparisse, sparirebbe in
        # silenzio.
        testo = re.sub(r'<[^>]+>', '', dentro).strip()
        check('la voce «%s» ha un\'etichetta di testo' % dest, len(testo) > 0,
              'solo icona: a chi non riconosce il simbolo la voce non dice niente')


# --- 4. i quiz: il regime e le sue intenzioni (R-NAV-04, R-NAV-05) ------------

def chiavi_modi(testo):
    """Le chiavi dichiarate in `const MODI = [...]`, o None se l'elenco manca."""
    m = re.search(r'const MODI = \[(.*?)\];', testo, flags=re.S)
    if not m:
        return None
    return re.findall(r"(?:\[\s*|\b(?:k|chiave)\s*:\s*)'([a-z]+)'", m.group(1))


def banco_quiz(testo):
    """Le verifiche del regime progettato, eseguite sotto Node sulla pagina data.

    Il banco estrae `selezioneQuiz()` e la esegue contro il motore vero con una
    spia sulle chiamate: vedi tests/quiz_intenzioni.mjs. Se il banco stesso non
    parte, e' un rosso, non un silenzio.
    """
    try:
        p = subprocess.run(['node', str(BANCO_QUIZ)], input=json.dumps({'pagina': testo}),
                           capture_output=True, text=True, timeout=120)
        out = json.loads(p.stdout) if p.returncode == 0 else None
    except (OSError, ValueError, subprocess.TimeoutExpired) as e:
        return [{'gruppo': 'intenzioni', 'nome': 'il banco dei quiz parte', 'ok': False, 'extra': str(e)}]
    if out is None:
        return [{'gruppo': 'intenzioni', 'nome': 'il banco dei quiz parte', 'ok': False,
                 'extra': (p.stderr or '').strip()[-400:]}]
    return out


def regime_quiz(testo):
    """(regime, verifiche): 'attuale', 'progettato' o None, e la lista di esiti.

    Ogni verifica e' {gruppo, nome, ok, extra}; il gruppo «intenzioni» e' di
    R-NAV-04, il gruppo «filtri» di R-NAV-05.
    """
    chiavi = chiavi_modi(testo)
    js = senza_commenti(testo)
    if chiavi is None:
        return None, [{'gruppo': 'intenzioni', 'nome': 'la pagina dichiara l\'elenco MODI', 'ok': False,
                       'extra': 'senza elenco non si sa quali ingressi abbiano i quiz'}]
    if set(chiavi) == set(MODI_SEI) and len(chiavi) == 6:
        v = []
        # Un ibrido e' la scappatoia che il §10.1 vieta: il contratto nuovo
        # scritto, e la sesta modalita' tenuta in piedi perche' passi il vecchio.
        v.append({'gruppo': 'intenzioni', 'nome': 'regime attuale: non e\' un ibrido con quello progettato',
                  'ok': not re.search(r'^function selezioneQuiz\b', js, re.M),
                  'extra': 'la pagina ha gia\' selezioneQuiz() ma tiene Batteria fra i MODI: una sesta '
                           'modalita\' fittizia fa passare il controllo vecchio (area 2, §10.1)'})
        v.append({'gruppo': 'filtri', 'nome': 'regime attuale: esiste il selettore «solo domande mai fatte»',
                  'ok': 'mai fatte' in js and 'S.prep' in js,
                  'extra': 'e\' il filtro che vale su piu\' modalita\': se sparisce, spariscono '
                           'anche le frasi che dichiarano dove NON vale'})
        v.append({'gruppo': 'filtri', 'nome': 'regime attuale: esiste il filtro «solo quesiti con figura»',
                  'ok': 'soloFigura' in js,
                  'extra': 'all\'esame 119 quesiti mostrano un disegno: e\' l\'unico modo di vederli tutti'})
        return 'attuale', v
    # Senza Batteria e dentro le cinque, e' il regime progettato anche se ne
    # manca una: e' proprio il caso che deve diventare rosso, e il banco dice
    # quale manca invece di un generico «regime non riconosciuto».
    if chiavi and 'batteria' not in chiavi and set(chiavi) <= set(MODI_CINQUE):
        v = banco_quiz(testo)
        if set(chiavi) != set(MODI_CINQUE) or len(chiavi) != 5:
            v.append({'gruppo': 'intenzioni', 'nome': 'regime progettato: cinque intenzioni, una volta ciascuna',
                      'ok': False, 'extra': 'MODI dichiara ' + ', '.join(chiavi)})
        return 'progettato', v
    return None, [{'gruppo': 'intenzioni', 'nome': 'i quiz sono in un regime riconosciuto', 'ok': False,
                   'extra': 'MODI dichiara %s: non sono le sei modalita\' di oggi ne\' le cinque '
                            'intenzioni dell\'area 2' % ', '.join(chiavi)}]


_REGIME_APP = None


def regime_app():
    global _REGIME_APP
    if _REGIME_APP is None:
        _REGIME_APP = regime_quiz(leggi('app.html'))
    return _REGIME_APP


def registra(regime, verifiche, gruppo):
    etichetta = {'attuale': 'regime attuale, a sei', 'progettato': 'regime progettato, a cinque'}
    for x in verifiche:
        if x['gruppo'] == gruppo:
            check('quiz (%s): %s' % (etichetta.get(regime, 'regime ignoto'), x['nome']),
                  x['ok'], x.get('extra', ''))


def test_modalita_quiz():
    regime, v = regime_app()
    if regime == 'attuale':
        # Le sei chiavi ci sono tutte: lo ha gia' stabilito regime_quiz(), che
        # riconosce il regime solo se l'insieme e' esattamente quello.
        check('quiz (regime attuale, a sei): le sei modalita\' ci sono tutte', True)
    registra(regime, v, 'intenzioni')


def test_selettori():
    regime, v = regime_app()
    registra(regime, v, 'filtri')
    check('quiz: i filtri sono stati controllati', any(x['gruppo'] == 'filtri' for x in v),
          'nessuna verifica sui filtri: «solo mai fatte» e «solo con figura» sono '
          'spariti senza che nessuno lo dica')


# --- 5. il controllo del regime progettato si prova al contrario ----------------
#
# Finche' la pagina pubblicata e' a sei ingressi, il ramo del regime progettato
# non gira mai su di lei: sarebbe un controllo scritto e mai eseguito, che e' la
# forma del semaforo verde a copertura zero. Quindi gira qui, a ogni esecuzione,
# su una pagina di riferimento che deve passare e su ciascuna delle sue rotture,
# che devono fallire nominando il difetto.

ROTTURE = [
    # (che cosa si rompe, testo da sostituire, sostituzione, frammento atteso fra i rossi)
    ('perde un\'intenzione', "  ['screening', 'Un giro tra gli argomenti'],\n", '',
     'dichiarata in MODI'),
    ('perde una porta', '<button data-modo="sbagliate">Ripassa gli errori</button>', '',
     'ha una porta'),
    ('tiene Batteria come sesto ingresso', "  ['sim', 'Simula la prova'],\n",
     "  ['sim', 'Simula la prova'],\n  ['batteria', 'Batteria'],\n", 'regime attuale: non e\' un ibrido'),
    ('la Mirata apre 20 quiz invece di 25', 'n: 25, kind', 'n: 20, kind', 'fino a 25 quiz base'),
    ('la Mirata eredita la banca di un\'altra attivita\'', "n: 25, kind: 'base'", 'n: 25, kind: conf.kind',
     'fino a 25 quiz base'),
    ('la vela riceve i temi', "conf.kind === 'vela' ? { voci: conf.voci }", "conf.kind === 'vela' ? { temi: conf.voci }",
     'argomenti come li ha scelti'),
    ('«solo mai fatte» ignorato', "stati: ['nuovo'], n: 0", 'n: 0', 'chiede i soli mai visti'),
    ('il ripasso riceve «solo mai fatte»', 'soloSbagliate: true, n: 0',
     "soloSbagliate: true, n: 0, ...(conf.soloNuovi ? { stati: ['nuovo'] } : {})", 'non riceve i filtri'),
    ('«solo con figura» passa al ripasso', 'soloSbagliate: true, n: 0',
     'soloSbagliate: true, soloFigura: conf.soloFigura, n: 0', 'non riceve i filtri'),
    ('il tetto non si applica', 'return { lista: taglia(r.lista)', 'return { lista: r.lista', 'tagliata a 20'),
    ('daFare ricalcolato in pagina', 'daFare: r.daFare', 'daFare: r.lista.length', 'totale e da fare'),
    ('il giro conta senza lunghezzaScreening', 'const previsto = E.lunghezzaScreening(items, conf.perVoce, conf.kind);',
     'const previsto = 44 * conf.perVoce;', 'lunghezzaScreening'),
    ('la prova vela scrive 5 a mano', 'fonte.prove.vela.n', '5', 'meta.prove.vela.n'),
    ('la selezione legge uno stato globale', 'const { items, prog, oggi } = fonte;',
     'const { items, oggi } = fonte; const prog = S.prog;', 'lancia'),
    # Con la Mirata deterministica le due liste coincidono: la prende solo il
    # conto delle chiamate, ed e' il difetto del §6 — lista e motivi da due fonti.
    ('i motivi della Mirata vengono da una seconda chiamata',
     'perche: Object.fromEntries(r.map(',
     "perche: Object.fromEntries(E.mirata(items, prog, oggi, { n: 25, kind: 'base', pesi: fonte.pesi, esame: fonte.esame }).map(",
     'nessun\'altra selezione'),
    ('la simulazione base pesca a caso con estrai', 'E.simulazione(items, prog, oggi, fonte.pesi, conf.seme)',
     'E.estrai(items, prog, oggi, 20, conf.seme)', 'chiama E.simulazione'),
]


def test_intenzioni_provate_al_contrario():
    rif = RIFERIMENTO_QUIZ.read_text(encoding='utf-8')
    regime, v = regime_quiz(rif)
    rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in v if not x['ok']]
    check('la pagina di riferimento e\' nel regime progettato', regime == 'progettato', str(regime))
    check('la pagina di riferimento passa il controllo', not rossi, '; '.join(rossi[:3]))
    # Un banco che non esegue niente passerebbe tutto: si pretende che abbia
    # esercitato ogni intenzione e i due filtri.
    check('il banco ha esercitato la selezione, non solo letto i nomi', len(v) >= 90,
          'solo %d verifiche' % len(v))
    for g in ('intenzioni', 'filtri'):
        check('il banco ha verifiche del gruppo «%s»' % g, any(x['gruppo'] == g for x in v))
    for cosa, vecchio, nuovo, atteso in ROTTURE:
        check('rottura «%s»: si applica alla pagina di riferimento' % cosa, vecchio in rif,
              'il testo da sostituire non c\'e\' piu\': la rottura non romperebbe niente')
        if vecchio not in rif:
            continue
        _, vr = regime_quiz(rif.replace(vecchio, nuovo, 1))
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vr if not x['ok']]
        check('rottura «%s»: il controllo diventa rosso' % cosa, bool(rossi), 'e\' passata verde')
        check('rottura «%s»: e il rosso nomina il difetto' % cosa, any(atteso in r for r in rossi),
              'rossi: ' + '; '.join(rossi[:3]))


# --- 5b. il ciclo dei quiz: riepilogo, revisione, riprova (R-FLU-01, R-FLU-10) --

def banco_ciclo(testo):
    """Le verifiche del ciclo progettato, eseguite sotto Node sulla pagina data.

    Il banco estrae le tre funzioni di raccordo e fa il giro riepilogo →
    anteprima → avvio contro il motore e la banca veri: vedi
    tests/ciclo_quiz.mjs. Se il banco stesso non parte, e' un rosso.
    """
    try:
        p = subprocess.run(['node', str(BANCO_CICLO)], input=json.dumps({'pagina': testo}),
                           capture_output=True, text=True, timeout=120)
        out = json.loads(p.stdout) if p.returncode == 0 else None
    except (OSError, ValueError, subprocess.TimeoutExpired) as e:
        return [{'gruppo': 'raccordo', 'nome': 'il banco del ciclo parte', 'ok': False, 'extra': str(e)}]
    if out is None:
        return [{'gruppo': 'raccordo', 'nome': 'il banco del ciclo parte', 'ok': False,
                 'extra': (p.stderr or '').strip()[-400:]}]
    return out


def regime_ciclo(testo):
    """(regime, verifiche) del ciclo dei quiz: 'attuale' o 'progettato'.

    Gruppi: «riepilogo» e' di R-FLU-01; «giro» e «raccordo» di R-FLU-10.
    """
    js = senza_commenti(testo)
    if any(re.search(r'^function %s\b' % f, js, re.M) for f in RACCORDO_CICLO):
        return 'progettato', banco_ciclo(testo)
    v = []
    # Un ibrido e' la scappatoia che il §10.1 vieta: gli errori dell'attivita'
    # chiesti al motore, o un pulsante che li promette, senza il raccordo che
    # il controllo esegue. Numero e lista avrebbero di nuovo due fonti.
    v.append({'gruppo': 'raccordo', 'nome': 'regime attuale: nessuna riprova senza il raccordo',
              'ok': not re.search(r'\bE\.erroriSessione\b', js) and not re.search(r'Riprova quest[oi]\b', js),
              'extra': 'la pagina chiama E.erroriSessione() o promette «Riprova questi N» senza '
                       'riepilogoQuiz/anteprimaRiprova/avviaRiprova: il contratto e\' nel §10.1 '
                       'di docs/area-3-progetto.md'})
    v.append({'gruppo': 'riepilogo', 'nome': 'regime attuale: ogni attivita\' quiz si chiude con un riepilogo',
              'ok': bool(re.search(r'^function fine\(', js, re.M)) and 'E.esito(' in js,
              'extra': 'fine() e l\'esito dal motore sono il ciclo di oggi: finche\' il nuovo non c\'e\', '
                       'non possono sparire'})
    v.append({'gruppo': 'giro', 'nome': 'regime attuale: una sessione si riapre e si rivede',
              'ok': bool(re.search(r'^function rivediQuiz\(', js, re.M)) and 'data-auid' in js,
              'extra': 'la revisione di una sessione e i tag per tentativo sono l\'unica strada, oggi, per '
                       'rileggere gli errori di un\'attivita\''})
    return 'attuale', v


_REGIME_CICLO = None


def regime_ciclo_app():
    global _REGIME_CICLO
    if _REGIME_CICLO is None:
        _REGIME_CICLO = regime_ciclo(leggi('app.html'))
    return _REGIME_CICLO


def registra_ciclo(regime, verifiche, gruppi):
    etichetta = {'attuale': 'regime attuale', 'progettato': 'regime progettato'}
    for x in verifiche:
        if x['gruppo'] in gruppi:
            check('ciclo quiz (%s): %s' % (etichetta.get(regime, 'regime ignoto'), x['nome']),
                  x['ok'], x.get('extra', ''))


def test_ciclo_riepilogo():
    regime, v = regime_ciclo_app()
    registra_ciclo(regime, v, ('riepilogo',))
    check('ciclo quiz: il riepilogo e\' stato controllato', any(x['gruppo'] == 'riepilogo' for x in v),
          'nessuna verifica sul riepilogo')


def test_ciclo_riprova():
    regime, v = regime_ciclo_app()
    registra_ciclo(regime, v, ('giro', 'raccordo'))
    check('ciclo quiz: la riprova e\' stata controllata', any(x['gruppo'] == 'raccordo' for x in v),
          'nessuna verifica sul raccordo')


# Il ramo del regime progettato non gira mai sulla pagina pubblicata finche'
# P-19 non arriva: qui gira a ogni esecuzione su una pagina di riferimento che
# deve passare e su ciascuna delle sue rotture, che devono fallire nominando il
# difetto. Ogni rottura e' una lista di sostituzioni, applicate in ordine.
ROTTURE_CICLO = [
    ('il raccordo perde il riepilogo',
     [('function riepilogoQuiz(contesto, fonte) {', 'function riepilogoAttivita(contesto, fonte) {')],
     'dichiara riepilogoQuiz'),
    ('tutte e tre le funzioni spariscono, e resta la chiamata al motore',
     [('function riepilogoQuiz(', 'function riepilogoAttivita('),
      ('function anteprimaRiprova(', 'function anteprimaAttivita('),
      ('function avviaRiprova(', 'function avviaAttivita(')],
     'nessuna riprova senza il raccordo'),
    ('la riprova e\' il ripasso di tutto lo storico',
     [('const r = E.erroriSessione(righe, banca, contesto.id);',
       "const l = E.coda(banca, {}, '2026-09-26', { soloSbagliate: true, n: 0 }); "
       "const r = { lista: l, quanti: l.length, fonte: 'sim_uid', trovata: true, ambigua: false, motivi: [], mancanti: [] };")],
     'nessuna selezione oltre'),
    ('le sessioni con il confine per pausa',
     [("E.sessioni(righe, { confine: 'attivita' })", 'E.sessioni(righe)')],
     'tre risposte, non la meta\''),
    # E' la ricostruzione per orario della 0.8.0, spostata nella pagina: con
    # un'altra scheda intrecciata nello stesso intervallo, conta le sue risposte.
    ('le risposte contate per orario invece che dall\'attivita\'',
     [('const proprie = s ? s.righe : [];',
       "const proprie = s ? righe.filter((r) => r._t === 'q' && r.ts >= s.inizio && r.ts <= s.fine) : [];")],
     'tre risposte, non la meta\''),
    ('l\'ultima sessione invece di quella per id',
     [('.find((x) => String(x.id) === String(contesto.id));', '[0];')],
     'solo le risposte di questa fase'),
    ('le errate contate da quello che si riapre',
     [('errate: e.errori,', 'errate: r.quanti,')],
     'le errate sono due'),
    ('i quesiti mancanti ignorati',
     [("  if (r.mancanti.length) return 'mancanti';\n", '')],
     'nomina il mancante'),
    ('l\'ambiguita\' non vista',
     [("  if (r.ambigua) return 'ambigua';\n", '')],
     'bloccata come ambigua'),
    ('il conteggio incoerente non visto',
     [("  if (r.quanti !== r.lista.length) return 'incoerente';\n", '')],
     'bloccata come incoerente'),
    ('il confine ricostruito taciuto',
     [('mancanti: r.mancanti, motivi: r.motivi, confine: r.fonte };',
       "mancanti: r.mancanti, motivi: r.motivi, confine: 'sim_uid' };")],
     'si dichiara, nel riepilogo e nella riprova'),
    ('superata anche con domande senza risposta',
     [('e.superata && nonAffrontate === 0', 'e.superata')],
     'non superata'),
    ('la prova consegnata vuota presa per sparita',
     [('if (!s && !contesto.corrente) {', 'if (!s) {')],
     'venti domande senza risposta'),
    ('la lettura fallita presa per un archivio senza quell\'attivita\'',
     [("const stato = fonte.letturaFallita ? 'illeggibile' : 'indisponibile';", "const stato = 'indisponibile';")],
     'non un riepilogo a zero'),
    ('l\'anteprima non verifica i dati',
     [("  if (!uguali) return { stato: 'cambiate', quanti: null, lista: [] };\n", '')],
     'l\'anteprima dice «cambiate»'),
    ('l\'anteprima mostra la lista ricalcolata',
     [('return { stato: \'pronta\', quanti: riprova.quanti, lista: riprova.lista, confine: riprova.confine };',
       'return { stato: \'pronta\', quanti: ora.quanti, lista: ora.lista, confine: ora.fonte };')],
     'l\'anteprima mostra la lista ricalcolata'),
    ('un tag invalida la selezione',
     [('riprova: istantanea(contesto.id, r),', 'riprova: { ...istantanea(contesto.id, r), righe: righe.length },'),
      ('const uguali = !ora.ambigua', 'const uguali = riprova.righe === fonte.righe.length && !ora.ambigua')],
     'non invalidano la selezione'),
    ('Inizia senza verificare',
     [('  const a = anteprimaRiprova(riprova, fonte);\n', '  const a = { stato: riprova.stato };\n')],
     'Inizia non avvia niente'),
    ('Inizia apre la lista ricalcolata',
     [("avvia(riprova.lista, 'sbagliate'", "avvia(E.erroriSessione(fonte.righe, fonte.banca, riprova.id).lista, 'sbagliate'")],
     'non una rifatta'),
    ('Inizia rimescola',
     [("avvia(riprova.lista, 'sbagliate'", "avvia([...riprova.lista].reverse(), 'sbagliate'")],
     'nello stesso ordine'),
    ('Inizia riusa l\'identita\' dell\'attivita\'',
     [('const simUid = uid();', 'const simUid = riprova.id;')],
     'un\'identita\' nuova'),
    ('Inizia lascia l\'avanzamento automatico',
     [('riprovaDi: riprova.id, auto: false', 'riprovaDi: riprova.id, auto: true')],
     'avanzamento automatico spento'),
    ('il raccordo scrive nella fonte',
     [('const { righe, banca } = fonte;',
       'const { righe, banca } = fonte; righe.sort((a, b) => String(a.ts).localeCompare(String(b.ts)));')],
     'scrivere nella fonte'),
    ('il raccordo legge uno stato globale',
     [('const { righe, banca } = fonte;', 'const { banca } = fonte; const righe = S.archivio;')],
     'lancia'),
    ('la pagina chiede gli errori anche fuori dal raccordo',
     [('function fonteCiclo() {',
       'function contaErrori(id) { return E.erroriSessione(S.archivio, S.banca, id).quanti; }\n\nfunction fonteCiclo() {')],
     'solo dentro il raccordo'),
    ('Inizia apre il runner senza il raccordo',
     [("avviaRiprova(S.riprova, fonteCiclo(), (lista, modo, o) => apri(lista, modo, { ...o, quiz: true }));",
       "apri(S.riprova.lista, 'sbagliate', { quiz: true });")],
     'le passa apri'),
    ('apri ignora l\'identita\' del raccordo',
     [('simUid: opt.simUid || uid()', 'simUid: uid()')],
     'usa l\'identita\''),
]


def test_ciclo_provato_al_contrario():
    rif = RIFERIMENTO_CICLO.read_text(encoding='utf-8')
    regime, v = regime_ciclo(rif)
    rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in v if not x['ok']]
    check('la pagina di riferimento del ciclo e\' nel regime progettato', regime == 'progettato', str(regime))
    check('la pagina di riferimento del ciclo passa il controllo', not rossi, '; '.join(rossi[:3]))
    # Un banco che non esegue niente passerebbe tutto: si pretende che abbia
    # fatto il giro intero, dal riepilogo all'avvio.
    check('il banco del ciclo ha eseguito il giro, non solo letto i nomi', len(v) >= 70,
          'solo %d verifiche' % len(v))
    for g in ('riepilogo', 'giro', 'raccordo'):
        check('il banco del ciclo ha verifiche del gruppo «%s»' % g, any(x['gruppo'] == g for x in v))
    for cosa, sostituzioni, atteso in ROTTURE_CICLO:
        rotta = rif
        for vecchio, nuovo in sostituzioni:
            check('rottura del ciclo «%s»: si applica alla pagina di riferimento' % cosa, vecchio in rotta,
                  'il testo da sostituire non c\'e\' piu\': la rottura non romperebbe niente')
            rotta = rotta.replace(vecchio, nuovo, 1)
        if rotta == rif:
            continue
        _, vr = regime_ciclo(rotta)
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vr if not x['ok']]
        check('rottura del ciclo «%s»: il controllo diventa rosso' % cosa, bool(rossi), 'e\' passata verde')
        check('rottura del ciclo «%s»: e il rosso nomina il difetto' % cosa, any(atteso in r for r in rossi),
              'rossi: ' + '; '.join(rossi[:3]))


# --- 5c. il client degli account, in un browser vero (§12 del progetto del client) --
#
# docs/account-client-progetto.md §12 chiede controlli che guardano la pagina
# viva — storage, rete, cookie, offline — e che una lettura del sorgente non
# puo' fare. Il banco (tests/client_account.mjs) guida Chrome headless con il
# suo protocollo, serve il sito come l'host e avvia accanto il server degli
# account vero. La misura che ha scelto questa strada, il suo costo e che cosa
# non copre sono nel §12, «Il banco».
#
# Due regimi, con il meccanismo dei quiz e del ciclo. La pagina ATTUALE non ha
# account e promette che le risposte restano nel browser: il banco pretende che
# mantenga quella promessa, e che non abbia pezzi del client senza il client.
# La pagina PROGETTATA dichiara indirizzoApi() (account-progetto §7.4), e il
# banco pretende il contratto del progetto del client. Finche' P-18 non c'e',
# il regime progettato si esercita sulla pagina di riferimento e sulle sue
# rotture. **Il regime attuale ha una scadenza:** lo toglie la regia quando
# integra P-18, e da quel commit una pagina senza client e' rossa.
BANCO_CLIENT = RADICE / 'tests' / 'client_account.mjs'
RIFERIMENTO_CLIENT = RADICE / 'tests' / 'pagina-client-account.html'
GRUPPI_CLIENT = ['C-01', 'C-02', 'C-05']


def regime_client(testo):
    return 'progettato' if re.search(r'^function indirizzoApi\(', senza_commenti(testo), re.M) else 'attuale'


# Rotture della pagina di riferimento: (che cosa, gruppi da eseguire,
# sostituzioni, parola che il rosso deve contenere).
ROTTURE_CLIENT = [
    # C-01
    ('un modulo d\'account prima del primo quesito', ['C-01'],
     [("if (t.matches('[data-rotta-start]')) return avvia();",
       "if (t.matches('[data-rotta-start]')) { moduloRegistrazione(); return avvia(); }")],
     'un campo password'),
    ('la banca chiesta fuori dal guscio', ['C-01'],
     [("fetch('/dati/quiz.json')", "fetch('/dati/quiz.json?v=' + Date.now())")],
     'offline: la palestra si apre'),
    ('il riepilogo senza la revisione', ['C-01'],
     [('<button data-ciclo="risposte">Rivedi le risposte</button>', '')],
     'la revisione mostra il quesito risposto'),
    ('il service worker mai registrato', ['C-01'],
     [("if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});", '')],
     'il guscio offline si carica'),
    # C-02
    ('le risposte in localStorage', ['C-02'],
     [("correct: giusta ? 1 : 0 });", "correct: giusta ? 1 : 0 }); localStorage.setItem('pn.archivio', JSON.stringify(S.righe));")],
     'localStorage: pn.archivio'),
    ('l\'archivio di prima riaperto in IndexedDB', ['C-02'],
     [("function avvia() {", "function avvia() { indexedDB.open('open-patente-nautica');")],
     'IndexedDB: open-patente-nautica'),
    ('la data d\'esame in localStorage', ['C-02'],
     [("S.esame = e.target.value; });", "S.esame = e.target.value; localStorage.setItem('pn.esame', S.esame); });")],
     'localStorage: pn.esame'),
    ('una preferenza in sessionStorage', ['C-02'],
     [("function avvia() {", "function avvia() { sessionStorage.setItem('pn.auto', '0');")],
     'sessionStorage: pn.auto'),
    ('un cookie della pagina', ['C-02'],
     [("function avvia() {", "function avvia() { document.cookie = 'rg-prova=1; path=/';")],
     'cookie: rg-prova'),
    ('le risposte in Cache Storage', ['C-02'],
     [("function termina() {",
       "function termina() { caches.open('rg-risposte').then((c) => c.put('/risposte.json', new Response(JSON.stringify(S.righe))));")],
     'Cache Storage «rg-risposte»'),
    ('le righe inviate senza account', ['C-02'],
     [("function termina() {",
       "function termina() { fetch(indirizzoApi(location) + '/v1/righe', { method: 'POST', credentials: 'include', body: JSON.stringify({ righe: S.righe }) }).catch(() => {});")],
     'nessuna richiesta all\'API'),
    ('la data d\'esame riletta dopo la ricarica', ['C-02'],
     [("S.esame = e.target.value; });",
       "S.esame = e.target.value; sessionStorage.setItem('pn.esame', S.esame); });\n$('esame-data').value = sessionStorage.getItem('pn.esame') || '';")],
     'dopo la ricarica non restano'),
    ('nessun avviso prima di cominciare', ['C-02'],
     [('<p id="avviso-prova">', '<p id="avviso-prova" hidden>')],
     'prima di cominciare'),
    ('il riepilogo che non dice che cosa si perde', ['C-02'],
     [('<p>Senza account, chiudendo o ricaricando la pagina perdi le risposte e le preferenze. ', '<p>')],
     'che cosa si perde'),
    # C-05
    ('il 409 riconosciuto dal solo codice', ['C-05'],
     [("if (r.status === 409 && corpo && corpo.errore === 'email_registrata') {", 'if (r.status === 409) {')],
     'non e\' email_registrata non parla di email'),
    ('il 409 riconosciuto dal testo del server', ['C-05'],
     [("if (r.status === 409 && corpo && corpo.errore === 'email_registrata') {",
       "if (corpo && /gi[aà] registrata/.test(corpo.messaggio || '')) {")],
     'la frase e\' della pagina'),
    ('al 409 la pagina chiede da sola il link per la password', ['C-05'],
     [("if (r.status === 409 && corpo && corpo.errore === 'email_registrata') {",
       "if (r.status === 409 && corpo && corpo.errore === 'email_registrata') { fetch(`${api}/v1/password/dimenticata`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });")],
     'nessuna mail nuova'),
    ('al 409 la pagina segna l\'email in un cookie', ['C-05'],
     [("if (r.status === 409 && corpo && corpo.errore === 'email_registrata') {",
       "if (r.status === 409 && corpo && corpo.errore === 'email_registrata') { document.cookie = 'rg-email=' + encodeURIComponent(email) + '; path=/';")],
     'zero cookie'),
    ('la frase detta senza chiedere al server', ['C-05'],
     [("  bottone.disabled = true;\n  esito.textContent = 'Creazione dell\\'account in corso…';",
       "  if (email) return pannello(`<p role=\"alert\"><strong>Questa email è già registrata.</strong></p>"
       "<button data-account=\"accedi\" data-email=\"${esc(email)}\">Accedi</button>"
       "<button data-account=\"reimposta\">Reimposta la password</button><button data-account=\"torna\">Torna al riepilogo</button>`);\n"
       "  bottone.disabled = true;\n  esito.textContent = 'Creazione dell\\'account in corso…';")],
     'nessuna POST a /v1/registrazione'),
    ('il messaggio con una porta sola', ['C-05'],
     [('<button data-account="reimposta" data-email="${esc(email)}">Reimposta la password</button>', '')],
     'Reimposta la password'),
    ('Accedi senza l\'email', ['C-05'],
     [("if (a === 'accedi') return moduloAccesso(t.dataset.email);", "if (a === 'accedi') return moduloAccesso('');")],
     'Accedi ha l\'email'),
    ('la password passa al modulo di accesso', ['C-05'],
     [("const password = $('account').querySelector('[name=password]').value;",
       "const password = $('account').querySelector('[name=password]').value; S.pw = password;"),
      ('<label>Password <input type="password" name="password" autocomplete="current-password"></label>',
       '<label>Password <input type="password" name="password" autocomplete="current-password" value="${esc(S.pw || \'\')}"></label>')],
     'la password vuota'),
    ('dopo il 409 le risposte della pagina si perdono', ['C-05'],
     [("return pannello(`<h2>Crea un account</h2>\n      <p role=\"alert\">",
       "S.ultima = null; $('r-fine').classList.remove('on');\n    return pannello(`<h2>Crea un account</h2>\n      <p role=\"alert\">")],
     'le risposte della pagina sono intatte'),
]

_BANCO_CLIENT = None


def banco_client():
    """Una sola esecuzione del banco per tutta la suite: la pagina vera, la
    pagina di riferimento e le sue rotture, un Chrome e un server solo."""
    global _BANCO_CLIENT
    if _BANCO_CLIENT is not None:
        return _BANCO_CLIENT
    app = leggi('app.html')
    rif = RIFERIMENTO_CLIENT.read_text(encoding='utf-8')
    prove = [{'nome': 'app', 'pagina': app, 'regime': regime_client(app), 'gruppi': GRUPPI_CLIENT},
             {'nome': 'riferimento', 'pagina': rif, 'regime': regime_client(rif), 'gruppi': GRUPPI_CLIENT}]
    applicate = {}
    for cosa, gruppi, sostituzioni, _ in ROTTURE_CLIENT:
        rotta, ok = rif, True
        for vecchio, nuovo in sostituzioni:
            ok = ok and vecchio in rotta
            rotta = rotta.replace(vecchio, nuovo, 1)
        applicate[cosa] = ok
        if ok and rotta != rif:
            prove.append({'nome': 'rottura: ' + cosa, 'pagina': rotta, 'regime': regime_client(rotta), 'gruppi': gruppi})
    try:
        p = subprocess.run(['node', str(BANCO_CLIENT)], input=json.dumps({'prove': prove}),
                           capture_output=True, text=True, timeout=600)
        out = json.loads(p.stdout) if p.returncode == 0 else None
    except (OSError, ValueError, subprocess.TimeoutExpired) as e:
        out, errore = None, str(e)
    else:
        errore = (p.stderr or '').strip()[-400:]
    if out is None:
        out = {x['nome']: [{'gruppo': 'banco', 'nome': 'il banco del browser parte', 'ok': False, 'extra': errore}]
               for x in prove}
    _BANCO_CLIENT = (prove, out, applicate)
    return _BANCO_CLIENT


def registra_client(gruppo):
    prove, out, _ = banco_client()
    regime = prove[0]['regime']
    etichetta = {'attuale': 'regime attuale', 'progettato': 'regime progettato'}[regime]
    v = out.get('app', [])
    for x in v:
        if x['gruppo'] in (gruppo, 'banco'):
            check('client (%s) %s: %s' % (etichetta, x['gruppo'], x['nome']), x['ok'], x.get('extra', ''))
    check('client %s: la pagina e\' stata guidata nel browser' % gruppo, any(x['gruppo'] == gruppo for x in v),
          'nessuna verifica del gruppo: il banco non l\'ha eseguito')
    if regime == 'attuale':
        # Un ibrido e' un pezzo del client senza il client: una promessa di
        # domani su una pagina che fa ancora quella di oggi, o un'API chiamata
        # senza sapere dove sta. Specifica §2: «Si cambiano nella stessa
        # versione in cui entrano gli account — non prima e non dopo».
        js = senza_commenti(leggi('app.html'))
        if gruppo == 'C-02':
            check('client (regime attuale) C-02: nessuna promessa del client senza il client',
                  'valgono solo finché questa pagina resta aperta' not in js,
                  'la pagina dice che senza account non resta niente, e salva nel browser: '
                  'la frase entra con indirizzoApi() e il client (§4.1)')
        if gruppo == 'C-05':
            check('client (regime attuale) C-05: nessuna rotta /v1/ senza indirizzoApi()',
                  not re.search(r'/v1/', js) and 'Crea un account' not in js,
                  'la pagina parla con l\'API o invita a creare un account senza dichiarare indirizzoApi() '
                  '(account-progetto §7.4)')


def test_client_primo_ingresso():
    registra_client('C-01')


def test_client_senza_account():
    registra_client('C-02')


def test_client_email_registrata():
    registra_client('C-05')


def test_client_provato_al_contrario():
    prove, out, applicate = banco_client()
    rif = [p for p in prove if p['nome'] == 'riferimento'][0]
    v = out.get('riferimento', [])
    rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in v if not x['ok']]
    check('la pagina di riferimento del client e\' nel regime progettato', rif['regime'] == 'progettato', rif['regime'])
    check('la pagina di riferimento del client passa il banco del browser', not rossi, '; '.join(rossi[:3]))
    for g in GRUPPI_CLIENT:
        check('il banco del browser ha eseguito %s sulla pagina di riferimento' % g,
              sum(1 for x in v if x['gruppo'] == g) >= 6, 'troppo poche verifiche: il giro non e\' arrivato in fondo')
    for cosa, gruppi, _, atteso in ROTTURE_CLIENT:
        check('rottura del client «%s»: si applica alla pagina di riferimento' % cosa, applicate.get(cosa),
              'il testo da sostituire non c\'e\' piu\': la rottura non romperebbe niente')
        vr = out.get('rottura: ' + cosa)
        if vr is None:
            continue
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vr if not x['ok']]
        check('rottura del client «%s»: il banco diventa rosso' % cosa, bool(rossi), 'e\' passata verde')
        check('rottura del client «%s»: e il rosso nomina il difetto' % cosa, any(atteso in r for r in rossi),
              'rossi: ' + '; '.join(rossi[:3]))


# --- 6. il motore non ha funzioni orfane (R-NAV-02) --------------------------------

def orfani_dichiarati():
    """{funzione: motivo}, dal file neutro."""
    righe = tabella('Funzioni del motore che nessuno chiama', 2)
    return None if righe is None else {f: m for f, m in righe}


def chiamate_protette():
    """I nomi che la pagina deve continuare a consumare, dal file neutro."""
    righe = tabella('Chiamate al motore protette', 1)
    return None if righe is None else {f for (f,) in righe}


def test_motore_senza_orfani():
    motore = leggi('engine.js')
    pagina = senza_commenti(leggi('app.html'))
    corpo = senza_commenti(motore)
    orfani = orfani_dichiarati()
    check('l\'elenco degli orfani si legge', orfani is not None,
          'manca la tabella «Funzioni del motore che nessuno chiama» in '
          'docs/eccezioni-interfaccia.md')
    orfani = orfani or {}
    esportate = re.findall(r'^export function ([a-zA-Z]+)', motore, flags=re.M)
    check('il motore esporta qualcosa', len(esportate) > 10)
    consumate = set()
    for f in esportate:
        # Chiamata dalla pagina — anche solo nominata, perche' `componiProva()`
        # passa `E.estrai` come valore invece di chiamarla.
        dalla_pagina = re.search(r'\bE\.%s\b' % f, pagina) is not None
        if dalla_pagina:
            consumate.add(f)
        # Oppure usata dentro il motore stesso: `semaforo()` la chiama
        # `traccia()`, `oscurato()` la chiama `simulazione()`.
        usi = len(re.findall(r'(?<![\w.])%s\s*\(' % f, corpo))
        interna = usi > 1
        check('«%s» ha un chiamante' % f,
              dalla_pagina or interna or f in orfani,
              'esportata, testata, e nessuno la chiama. Se e\' voluto, '
              'dichiarala fra le «Funzioni del motore che nessuno chiama» in '
              'docs/eccezioni-interfaccia.md, col motivo e con l\'area che la '
              'consumera\'.')
    # Una dichiarazione che non serve piu' nasconde il caso dopo. Due modi di
    # non servire piu', e il secondo mancava: la funzione non c'e' piu', oppure
    # **la pagina ha cominciato a chiamarla**. Il secondo si poteva controllare
    # solo da quando le eccezioni stanno in territorio neutro: prima l'unico
    # modo di spegnere il rosso sarebbe stato toccare tests/, precluso a ui/*.
    for f in orfani:
        check('l\'eccezione «%s» riguarda una funzione che esiste' % f,
              f in esportate,
              'dichiarata orfana ma non esportata: la riga va tolta')
        check('«%s» e\' ancora senza chiamanti' % f, f not in consumate,
              'la pagina la chiama: togli la riga dagli orfani e aggiungi il '
              'nome alle «Chiamate al motore protette», nello stesso commit')


# --- 7. la pagina non smette di consumare il motore in silenzio ---------------

def test_chiamate_al_motore_preservate():
    app = senza_commenti(leggi('app.html'))
    protette = chiamate_protette()
    check('l\'elenco delle chiamate protette si legge', protette is not None,
          'manca la tabella «Chiamate al motore protette» in '
          'docs/eccezioni-interfaccia.md')
    protette = protette or set()
    trovate = set(re.findall(r'\bE\.([a-zA-Z]+)\b', app))
    for f in sorted(protette):
        check('la pagina chiama ancora «%s»' % f, f in trovate,
              'la chiamata e\' sparita. Se e\' voluto, togli la riga da '
              'docs/eccezioni-interfaccia.md e di\' nel commit perche\': quello '
              'che non va bene e\' che sparisca in silenzio.')
    nuove = trovate - protette
    check('le chiamate nuove sono dichiarate', not nuove,
          'la pagina chiama ora anche: ' + ', '.join(sorted(nuove))
          + ' — aggiungi una riga per ognuna alle «Chiamate al motore protette» '
            'in docs/eccezioni-interfaccia.md, cosi\' da domani sono protette')


# --- 7b. una lettura non ripiega su un dato plausibile ------------------------

def test_letture_che_non_mascherano():
    """Un ripiego silenzioso trasforma un errore in un dato credibile.

    `LS.get(k, d)` ha `catch { return d }`: usato per leggere l'archivio, un
    file illeggibile diventa una lista vuota, e la schermata del primo avvio
    compare a chi ha mesi di risposte. E' il guasto muto in forma pura, quindi
    non basta ripararlo dove sta: si nomina la forma.
    """
    righe = tabella('Letture che possono mascherare un guasto', 3)
    check('l\'elenco delle letture cieche si legge', righe is not None,
          'manca la tabella «Letture che possono mascherare un guasto» in '
          'docs/eccezioni-interfaccia.md')
    dichiarate = {(f, e) for f, e, _ in (righe or [])}
    cieche = []
    for nome in ('app.html', 'index.html'):
        for espr in re.findall(r"LS\.get\(\s*'archivio'\s*,[^)]*\)",
                               senza_commenti(leggi(nome))):
            cieche.append((nome, ' '.join(espr.split())))
    for f, e in cieche:
        check('la lettura dell\'archivio in %s non ripiega in silenzio' % f,
              (f, e) in dichiarate,
              'questa lettura non distingue «assente» da «errore»: chi la usa '
              'non puo\' sapere se l\'archivio e\' vuoto o illeggibile. Se non '
              'la correggi adesso, dichiarala col perche\' e con l\'area.')
    presenti = set(cieche)
    for k in dichiarate:
        check('la dichiarazione per «%s» riguarda una lettura che esiste' % (k[1],),
              k in presenti,
              'la lettura e\' stata corretta: togli la riga, altrimenti nasconde '
              'la prossima')


# --- 8. i testi si possono leggere (R-A11Y) -----------------------------------

def piccoli(nome):
    """Ogni regola CSS con un font-size sotto la soglia, col suo selettore."""
    t = leggi(nome)
    fuori = []
    for m in re.finditer(r'([^{};\n]*)\{[^{}]*font-size:\s*(\d+)px', t):
        px = int(m.group(2))
        if px < FONT_MINIMO:
            sel = m.group(1).strip().split('}')[-1].strip()
            fuori.append((nome, px, sel))
    return fuori


def test_testi_leggibili():
    righe = tabella('Testi sotto gli 11 px', 4)
    check('il file delle eccezioni si legge', righe is not None,
          'manca docs/eccezioni-interfaccia.md, o la sua tabella')
    dichiarati = {(f, px, sel) for f, px, sel, _ in (righe or [])}
    trovati = piccoli('app.html') + piccoli('index.html')
    for f, px, sel in trovati:
        check('«%s» in %s non e\' sotto i %d px' % (sel, f, FONT_MINIMO),
              (f, str(px), sel) in dichiarati,
              '%d px: sotto la soglia un testo non e\' piccolo, e\' illeggibile '
              'per una parte delle persone. Se e\' voluto, dichiaralo col '
              'perche\' e con l\'area che lo corregge.' % px)
    presenti = {(f, str(px), sel) for f, px, sel in trovati}
    for k in dichiarati:
        check('la dichiarazione per «%s» riguarda una regola che esiste' % (k[2],),
              k in presenti,
              'il difetto e\' stato corretto: togli la riga da '
              'docs/eccezioni-interfaccia.md, altrimenti nasconde il prossimo')


# --- 9. un'immagine di contenuto dice che cosa mostra -------------------------

def test_alt_di_contenuto():
    righe = tabella('Testi alternativi generici', 3)
    check('la tabella degli alt si legge', righe is not None)
    dichiarati = {(f, a) for f, a, _ in (righe or [])}
    trovati = []
    for nome in ('app.html', 'index.html'):
        for a in re.findall(r'alt="([^"]*)"', leggi(nome)):
            if a.strip().lower() in ALT_GENERICI:
                trovati.append((nome, a.strip().lower()))
    for f, a in trovati:
        check('l\'alt «%s» in %s dice che cosa mostra' % (a, f),
              (f, a) in dichiarati,
              'un alt generico e\' peggio di nessuno: dichiara che c\'e\' '
              'un\'immagine e non dice quale. `alt=""` va bene per una '
              'decorativa; un\'immagine che porta contenuto deve descriverlo.')
    for k in dichiarati:
        check('la dichiarazione per l\'alt «%s» riguarda un caso che esiste' % (k[1],),
              k in trovati,
              'corretto: togli la riga da docs/eccezioni-interfaccia.md')


def test_trasloco():
    # R-STA-09. Il 25 settembre 2026 il sito si e' spostato da
    # open-patente-nautica.pages.dev a rottagiusta.it. L'archivio delle risposte
    # e' legato all'origine, quindi non segue da solo; e misurato: un redirect
    # sul vecchio indirizzo congela chi ha la palestra installata su una copia
    # in cache, con il service worker che non si aggiorna piu' («The script
    # resource is behind a redirect, which is disallowed»), **senza un avviso**.
    # Quindi, prima del redirect, la versione che resta congelata deve gia'
    # contenere l'avviso: la palestra, fuori casa, dice dove andare e offre di
    # scaricare i progressi; la vetrina manda alla palestra nuova, cosi' chi
    # arriva adesso non comincia a salvare risposte sull'indirizzo vecchio.
    app = leggi('app.html')
    vetrina = leggi('index.html')
    casa_app = re.search(r"const CASA = '([^']+)'", app)
    casa_vet = re.search(r"const CASA = '([^']+)'", vetrina)
    check('trasloco: app.html dichiara CASA', casa_app is not None)
    check('trasloco: index.html dichiara CASA', casa_vet is not None)
    if casa_app and casa_vet:
        check('trasloco: la stessa CASA nelle due pagine, ed e\' rottagiusta.it',
              casa_app.group(1) == casa_vet.group(1) == 'rottagiusta.it',
              '%s vs %s' % (casa_app.group(1), casa_vet.group(1)))
    f = re.search(r'function fuoriCasa\(\)\s*\{(.*?)\n\}', app, re.S)
    check('trasloco: app.html ha fuoriCasa()', f is not None)
    if f:
        corpo = f.group(1)
        check('trasloco: fuoriCasa() guarda location.hostname e CASA',
              'location.hostname' in corpo and 'CASA' in corpo)
        check('trasloco: fuoriCasa() non scatta in locale',
              'localhost' in corpo and '127.0.0.1' in corpo)
    d = re.search(r'function dipingiStatoRotta\(\)\s*\{(.*?)\n\}', app, re.S)
    check('trasloco: dipingiStatoRotta() esiste', d is not None)
    if d:
        corpo = d.group(1)
        i = corpo.find('fuoriCasa()')
        check('trasloco: il Percorso chiama fuoriCasa()', i >= 0)
        blocco = corpo[i:i + 900] if i >= 0 else ''
        check('trasloco: l\'avviso offre di scaricare i progressi', 'data-route-export' in blocco, blocco[:120])
        check('trasloco: l\'avviso porta alla palestra su CASA', "'https://' + CASA + '/app'" in blocco
              or '`https://${CASA}/app`' in blocco, blocco[:120])
        prima = corpo.find('righe.push')
        check('trasloco: l\'avviso e\' il primo degli stati del Percorso', i >= 0 and (prima < 0 or i < prima))
    check('trasloco: la vetrina guarda location.hostname', 'location.hostname' in vetrina)
    check('trasloco: la vetrina riscrive i link /app verso CASA fuori casa',
          'a[href="/app"]' in vetrina and ('`https://${CASA}/app`' in vetrina or "'https://' + CASA + '/app'" in vetrina))


def main():
    for t in (test_viste_dichiarate, test_ogni_vista_ha_una_porta,
              test_voci_barra, test_modalita_quiz, test_selettori,
              test_intenzioni_provate_al_contrario,
              test_ciclo_riepilogo, test_ciclo_riprova, test_ciclo_provato_al_contrario,
              test_client_primo_ingresso, test_client_senza_account, test_client_email_registrata,
              test_client_provato_al_contrario,
              test_motore_senza_orfani, test_chiamate_al_motore_preservate,
              test_letture_che_non_mascherano,
              test_testi_leggibili, test_alt_di_contenuto, test_trasloco):
        t()
    if falliti:
        print('%d verifiche FALLITE su %d:\n' % (len(falliti), fatti))
        for f in falliti:
            print('  ✗ ' + f)
        sys.exit(1)
    print('%d verifiche passate' % fatti)


if __name__ == '__main__':
    main()
