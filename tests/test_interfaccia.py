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
import os
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


# RG_PAGINA=<file> fa girare la suite su una copia della palestra al posto di
# site/app.html (P-51): serve a misurare una bozza — quella di un altro
# worktree, o una copia con una modifica — senza toccare la pagina vera, anche
# nel browser, perche' il banco del client prende la pagina da qui. Il resto del
# sito resta quello del repo. La riga finale lo dice, verde o rossa: un verde su
# una copia non e' un verde di main.
PAGINA = os.environ.get('RG_PAGINA')


def leggi(p):
    if p == 'app.html' and PAGINA:
        return Path(PAGINA).read_text(encoding='utf-8')
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

# I quiz hanno un regime solo: le cinque intenzioni dell'area 2
# (docs/area-2-progetto.md). Batteria non e' piu' un ingresso — il suo mestiere
# resta in «Scegli un argomento» —, i filtri sono locali all'attivita', e il
# §10.1 di quel progetto chiede che si eserciti la selezione — funzioni e
# parametri — e non la presenza dei nomi.
#
# Fino a P-12 i regimi riconosciuti erano due: accanto a questo c'era quello a
# sei ingressi della pagina di prima di P-05, perche' `main` restasse verde nel
# passaggio. P-05 e' fuso dal 26 settembre 2026, e con P-12 quel ramo non c'e'
# piu': una pagina a sei ingressi — misurata su quella di `ccd98f0^1` — e' rossa,
# e il rosso nomina Batteria e la selezione che manca.
INTENZIONI = ['mirata', 'argomento', 'sbagliate', 'sim', 'screening']
BANCO_QUIZ = RADICE / 'tests' / 'quiz_intenzioni.mjs'
RIFERIMENTO_QUIZ = RADICE / 'tests' / 'pagina-quiz-intenzioni.html'

# Il ciclo dei quiz ha un regime solo, dal 30 settembre 2026 (P-37): quello
# dell'area 3 (docs/area-3-progetto.md). Riepilogo, anteprima e avvio della
# riprova passano da tre funzioni di raccordo, e il §10.1 di quel progetto chiede
# che il controllo le **esegua** — riepilogo → anteprima → avvio, con i dati che
# cambiano fra un clic e l'altro — invece di cercare un nome o un pulsante.
#
# Fino a P-37 i regimi erano due, con il meccanismo dei quiz: accanto a questo
# c'era quello della pagina di prima di P-19, riconosciuto da `fine()` e
# `rivediQuiz()` senza il raccordo, perche' `main` restasse verde nel passaggio.
# P-19 e' fuso dal 26 settembre 2026, e con P-37 quel ramo non c'e' piu': una
# pagina senza il raccordo — misurata su quella di `4129dfc^1`, che passava con
# 3 verifiche e zero rossi — e' rossa, e il rosso nomina la funzione che manca.
BANCO_CICLO = RADICE / 'tests' / 'ciclo_quiz.mjs'
RIFERIMENTO_CICLO = RADICE / 'tests' / 'pagina-ciclo-quiz.html'

# La mappa di Progressi ha un regime solo, dal 30 settembre 2026 (P-47).
#
# Fino a P-23 erano due, con il meccanismo dei quiz e del ciclo: la diagnosi a
# due tabelle ordinate per «Punti persi», da `E.diagnosi()`, con la lista «Cosa
# studiare adesso» da `E.consigli()`; e la mappa per tema di Q-DUE
# (docs/area-5-progetto.md), da `E.quadro()` e `E.dovePesa()` attraverso tre
# funzioni di raccordo che il §10.1 di quel progetto chiede di **eseguire** —
# righe, frase e selezioni contro il motore vero, con i dati che cambiano fra
# un clic e l'altro — invece di cercare un nome o un pulsante.
#
# P-23 ha portato la mappa nella pagina vera. Da qui il banco gira su ogni
# pagina come su una pagina con la mappa: una pagina senza il raccordo e' rossa
# — quella di prima di P-23 lo e', provato —, e anche una che tiene la diagnosi
# di prima accanto alla mappa, perche' sarebbero due classifiche.
BANCO_MAPPA = RADICE / 'tests' / 'mappa_progressi.mjs'
RIFERIMENTO_MAPPA = RADICE / 'tests' / 'pagina-mappa-progressi.html'

# Il Carteggio ha un regime solo, dal 1° ottobre 2026 (P-50): quello dell'area 4
# (docs/area-4-progetto.md). Preparazione, avvio, conclusione, riconoscimento e
# riepilogo passano da cinque funzioni di raccordo, e il §10.1 di quel progetto
# (D-04) chiede che il controllo le **esegua** con le banche vere e i dati che
# cambiano fra un clic e l'altro, invece di cercare un nome o un pulsante.
#
# Fino a P-50 i regimi erano due, con il meccanismo dei quiz, del ciclo e della
# mappa: accanto a questo c'era quello della pagina di prima di P-21, che
# componeva la prova con la sua `componiProva()`, scriveva le righe con
# `salvaCart()` e `correggiTec()` e rileggeva con `dipingiCorrezione()` e
# `rivediCarteggio()`. P-21 e' fuso dal 30 settembre 2026, e con P-50 quel ramo
# non c'e' piu': una pagina senza il raccordo — misurata su quella di
# `1bb916a^1`, che passava con 8 verifiche e zero rossi — e' rossa, e il rosso
# nomina la funzione che manca. Con il ramo sono usciti anche il riconoscimento
# del regime (`riconosci_carteggio()`, P-51) e l'innesto del raccordo che lo
# provava: con un regime solo non c'e' niente da riconoscere.
BANCO_CARTEGGIO = RADICE / 'tests' / 'ciclo_carteggio.mjs'
RIFERIMENTO_CARTEGGIO = RADICE / 'tests' / 'pagina-ciclo-carteggio.html'

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


def verifiche_quiz(testo):
    """Le verifiche dei quiz sulla pagina data: la lista di esiti {gruppo, nome, ok, extra}.

    Il gruppo «intenzioni» e' di R-NAV-04, il gruppo «filtri» di R-NAV-05. Il
    banco gira sempre, su qualunque pagina: su una senza `selezioneQuiz()`, o con
    Batteria fra gli ingressi, dice che cosa manca e che cosa e' di troppo, e non
    ha selezioni da eseguire — per questo le verifiche si contano anche
    (`conteggio_quiz`).
    """
    chiavi = chiavi_modi(testo)
    if chiavi is None:
        return [{'gruppo': 'intenzioni', 'nome': 'la pagina dichiara l\'elenco MODI', 'ok': False,
                 'extra': 'senza elenco non si sa quali ingressi abbiano i quiz'}]
    v = banco_quiz(testo)
    v.append({'gruppo': 'intenzioni', 'nome': 'cinque intenzioni, una volta ciascuna, e nient\'altro',
              'ok': sorted(chiavi) == sorted(INTENZIONI),
              'extra': 'MODI dichiara %s: i quiz hanno le cinque intenzioni dell\'area 2 (%s), e una pagina '
                       'a sei ingressi, con Batteria, e\' quella di prima di P-05' % (', '.join(chiavi), ', '.join(INTENZIONI))})
    return v


_QUIZ_APP = None


def quiz_app():
    global _QUIZ_APP
    if _QUIZ_APP is None:
        _QUIZ_APP = verifiche_quiz(leggi('app.html'))
    return _QUIZ_APP


_QUIZ_RIF = None


def quiz_riferimento():
    global _QUIZ_RIF
    if _QUIZ_RIF is None:
        _QUIZ_RIF = verifiche_quiz(RIFERIMENTO_QUIZ.read_text(encoding='utf-8'))
    return _QUIZ_RIF


def registra(verifiche, gruppo):
    for x in verifiche:
        if x['gruppo'] == gruppo:
            check('quiz: %s' % x['nome'], x['ok'], x.get('extra', ''))


def conteggio_quiz(gruppo):
    """La pagina vera fa almeno le verifiche che fa la pagina di riferimento, in quel gruppo.

    E' il conteggio di P-40 (`VERIFICHE_CLIENT`) e di P-47 (`conteggio_mappa`):
    un giro che si ferma a meta' ha meno verifiche, e quelle fatte possono essere
    tutte verdi. La pagina a sei ingressi, prima di P-12, passava con 5 verifiche
    e zero rossi, contro le 100 della pagina vera.
    """
    n = sum(x['gruppo'] == gruppo for x in quiz_app())
    attese = sum(x['gruppo'] == gruppo for x in quiz_riferimento())
    check('quiz: il gruppo «%s» ha fatto tutte le verifiche' % gruppo, attese > 0 and n >= attese,
          'troppo poche verifiche (%d su %d): il banco non ha eseguito la selezione della pagina' % (n, attese))


def test_modalita_quiz():
    registra(quiz_app(), 'intenzioni')
    conteggio_quiz('intenzioni')


def test_selettori():
    registra(quiz_app(), 'filtri')
    conteggio_quiz('filtri')


# --- 5. il banco dei quiz si prova al contrario --------------------------------
#
# Il banco gira anche su una pagina di riferimento, che deve passare, e su
# ciascuna delle sue rotture, che devono fallire nominando il difetto. Le
# rotture restano su di lei e non sulla pagina vera, per la ragione di P-40:
# sostituzioni di testo in un file dell'interfaccia da 200 KB si spezzerebbero a
# ogni suo ritocco, e una rottura che non si applica piu' e' un controllo spento.

ROTTURE = [
    # (che cosa si rompe, testo da sostituire, sostituzione, frammento atteso fra i rossi)
    ('perde un\'intenzione', "  ['screening', 'Un giro tra gli argomenti'],\n", '',
     'dichiarata in MODI'),
    ('perde una porta', '<button data-modo="sbagliate">Ripassa gli errori</button>', '',
     'ha una porta'),
    ('tiene Batteria come sesto ingresso', "  ['sim', 'Simula la prova'],\n",
     "  ['sim', 'Simula la prova'],\n  ['batteria', 'Batteria'],\n", 'Batteria non e\' piu\' un ingresso'),
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
    v = quiz_riferimento()
    rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in v if not x['ok']]
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
        vr = verifiche_quiz(rif.replace(vecchio, nuovo, 1))
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


def verifiche_ciclo(testo):
    """Le verifiche del ciclo dei quiz sulla pagina data: la lista di esiti {gruppo, nome, ok, extra}.

    Gruppi: «riepilogo» e' di R-FLU-01; «giro» e «raccordo» di R-FLU-10. Il banco
    gira sempre, su qualunque pagina: su una senza il raccordo dice quale delle
    tre funzioni manca, e non ha un giro da eseguire — per questo le verifiche si
    contano anche (`conteggio_ciclo`).
    """
    return banco_ciclo(testo)


_CICLO_APP = None


def ciclo_app():
    global _CICLO_APP
    if _CICLO_APP is None:
        _CICLO_APP = verifiche_ciclo(leggi('app.html'))
    return _CICLO_APP


_CICLO_RIF = None


def ciclo_riferimento():
    global _CICLO_RIF
    if _CICLO_RIF is None:
        _CICLO_RIF = verifiche_ciclo(RIFERIMENTO_CICLO.read_text(encoding='utf-8'))
    return _CICLO_RIF


def registra_ciclo(verifiche, gruppi):
    for x in verifiche:
        if x['gruppo'] in gruppi:
            check('ciclo quiz: %s' % x['nome'], x['ok'], x.get('extra', ''))


def conteggio_ciclo(gruppi):
    """La pagina vera fa almeno le verifiche che fa la pagina di riferimento, gruppo per gruppo.

    E' il conteggio di P-40, P-47 e P-12: un giro che si ferma a meta' ha meno
    verifiche, e quelle fatte possono essere tutte verdi. La pagina di prima di
    P-19, senza il raccordo, passava con una verifica per gruppo e nessun rosso.
    """
    app, rif = ciclo_app(), ciclo_riferimento()
    for g in gruppi:
        n, attese = sum(x['gruppo'] == g for x in app), sum(x['gruppo'] == g for x in rif)
        check('ciclo quiz: il gruppo «%s» ha fatto tutte le verifiche' % g, attese > 0 and n >= attese,
              'troppo poche verifiche (%d su %d): il banco non ha eseguito il giro della pagina' % (n, attese))


def test_ciclo_riepilogo():
    registra_ciclo(ciclo_app(), ('riepilogo',))
    conteggio_ciclo(('riepilogo',))


def test_ciclo_riprova():
    registra_ciclo(ciclo_app(), ('giro', 'raccordo'))
    conteggio_ciclo(('giro', 'raccordo'))


# Il banco del ciclo gira anche su una pagina di riferimento, che deve passare,
# e su ciascuna delle sue rotture, che devono fallire nominando il difetto. Le
# rotture restano su di lei e non sulla pagina vera, per la ragione di P-40:
# sostituzioni di testo in un file dell'interfaccia da 200 KB si spezzerebbero a
# ogni suo ritocco, e una rottura che non si applica piu' e' un controllo spento.
# Ogni rottura e' una lista di sostituzioni, applicate in ordine.
ROTTURE_CICLO = [
    ('il raccordo perde il riepilogo',
     [('function riepilogoQuiz(contesto, fonte) {', 'function riepilogoAttivita(contesto, fonte) {')],
     'dichiara riepilogoQuiz'),
    ('tutte e tre le funzioni spariscono, e resta la chiamata al motore',
     [('function riepilogoQuiz(', 'function riepilogoAttivita('),
      ('function anteprimaRiprova(', 'function anteprimaAttivita('),
      ('function avviaRiprova(', 'function avviaAttivita(')],
     'dichiara riepilogoQuiz'),
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
    v = ciclo_riferimento()
    rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in v if not x['ok']]
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
        vr = verifiche_ciclo(rotta)
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vr if not x['ok']]
        check('rottura del ciclo «%s»: il controllo diventa rosso' % cosa, bool(rossi), 'e\' passata verde')
        check('rottura del ciclo «%s»: e il rosso nomina il difetto' % cosa, any(atteso in r for r in rossi),
              'rossi: ' + '; '.join(rossi[:3]))


# --- 5b'. la mappa di Progressi (R-MAPPA-14…16) ---------------------------------

def banco_mappa(testo):
    """Le verifiche della mappa, eseguite sotto Node sulla pagina data.

    Il banco estrae le tre funzioni di raccordo e le esegue contro il motore e
    la banca veri: vedi tests/mappa_progressi.mjs. Se il banco stesso non
    parte, e' un rosso.
    """
    try:
        p = subprocess.run(['node', str(BANCO_MAPPA)], input=json.dumps({'pagina': testo}),
                           capture_output=True, text=True, timeout=120)
        out = json.loads(p.stdout) if p.returncode == 0 else None
    except (OSError, ValueError, subprocess.TimeoutExpired) as e:
        return [{'gruppo': 'raccordo', 'nome': 'il banco della mappa parte', 'ok': False, 'extra': str(e)}]
    if out is None:
        return [{'gruppo': 'raccordo', 'nome': 'il banco della mappa parte', 'ok': False,
                 'extra': (p.stderr or '').strip()[-400:]}]
    return out


# Le tabelle e la chiamata della diagnosi di prima di P-23. Accanto alla mappa
# sarebbero la seconda classifica che Q-DUE ha tolto: l'ordine per «Punti
# persi» e' un'altra risposta a «dove lavoro adesso».
DIAGNOSI_DI_PRIMA = ['id="d-temi"', 'id="d-voci"']


def verifiche_mappa(testo):
    """Le verifiche di Progressi sulla pagina data: il banco, e la diagnosi di prima che non c'e' piu'.

    Gruppi: «righe» e «frase» sono di R-MAPPA-14; «azioni» e «raccordo» di
    R-MAPPA-15. Il banco gira sempre: su una pagina senza il raccordo dice quale
    delle tre funzioni manca, e non ha righe da confrontare.
    """
    js = senza_commenti(testo)
    v = banco_mappa(testo)
    rimasti = [x for x in DIAGNOSI_DI_PRIMA if x in testo] + (['E.diagnosi('] if 'E.diagnosi(' in js else [])
    v.append({'gruppo': 'righe', 'nome': 'la diagnosi a due tabelle non c\'e\' piu\'', 'ok': not rimasti,
              'extra': 'la pagina ha ancora ' + ', '.join(rimasti) + ': le tabelle ordinate per punti persi sono '
                       'la seconda classifica che Q-DUE ha tolto, e con la mappa sono uscite (P-23)'})
    return v


_MAPPA_APP = None


def mappa_app():
    global _MAPPA_APP
    if _MAPPA_APP is None:
        _MAPPA_APP = verifiche_mappa(leggi('app.html'))
    return _MAPPA_APP


_MAPPA_RIF = None


def mappa_riferimento():
    global _MAPPA_RIF
    if _MAPPA_RIF is None:
        _MAPPA_RIF = verifiche_mappa(RIFERIMENTO_MAPPA.read_text(encoding='utf-8'))
    return _MAPPA_RIF


def registra_mappa(verifiche, gruppi):
    for x in verifiche:
        if x['gruppo'] in gruppi:
            check('mappa di Progressi: %s' % x['nome'], x['ok'], x.get('extra', ''))


def conteggio_mappa(gruppi):
    """La pagina vera fa almeno le verifiche che fa la pagina di riferimento, gruppo per gruppo.

    Un giro che si ferma a meta' per una strada che il banco non ha previsto
    avrebbe meno verifiche, e quelle fatte potrebbero essere tutte verdi: e' il
    verde falso che P-40 ha chiuso per il client con `VERIFICHE_CLIENT`. Il
    conteggio lo dice anche quando nessuna verifica e' rossa.
    """
    app, rif = mappa_app(), mappa_riferimento()
    for g in gruppi:
        n, attese = sum(x['gruppo'] == g for x in app), sum(x['gruppo'] == g for x in rif)
        check('mappa di Progressi: il gruppo «%s» ha fatto tutte le verifiche' % g, attese > 0 and n >= attese,
              'troppo poche verifiche (%d su %d): il banco si e\' fermato prima del giro' % (n, attese))


def test_mappa_righe():
    v = mappa_app()
    registra_mappa(v, ('righe', 'frase'))
    conteggio_mappa(('righe', 'frase'))


def test_mappa_azioni():
    v = mappa_app()
    registra_mappa(v, ('azioni', 'raccordo'))
    conteggio_mappa(('azioni', 'raccordo'))


# Il banco della mappa si prova contro se' stesso a ogni esecuzione, sulla
# pagina di riferimento: lei deve passare, e ciascuna delle sue rotture deve
# fallire nominando il difetto. Le rotture restano su di lei e non sulla pagina
# vera, per la ragione di P-40: sostituzioni di testo in un file
# dell'interfaccia da 200 KB si spezzerebbero a ogni suo ritocco, e una rottura
# che non si applica piu' e' un controllo spento. Le prime dieci sono le otto
# che il §10.1 del progetto elenca — il tetto di 20 e l'ordine in due punti
# ciascuno —; le altre sono nate provando il banco contro se' stesso.
ROTTURE_MAPPA = [
    ('il numero del pulsante non e\' la lista',
     [('quanti: r.daRifare, selezione: r.rifai', 'quanti: r.visti, selezione: r.rifai')],
     'porta N = daRifare'),
    ('«Rifai N errori» con il tetto di 20',
     [('quanti: r.daRifare, selezione: r.rifai', 'quanti: r.daRifare, selezione: { ...r.rifai, n: 20 }')],
     'tutti e soli'),
    ('l\'anteprima apre con il tetto predefinito di coda()',
     [('const lista = E.coda(banca, progress, oggi, azione.selezione);',
       'const lista = E.coda(banca, progress, oggi, { ...azione.selezione, n: undefined });')],
     'con la selezione del pulsante'),
    ('soloSbagliate al posto di soloDaRifare',
     [('quanti: r.daRifare, selezione: r.rifai',
       'quanti: r.daRifare, selezione: { ...r.filtro, soloSbagliate: true, n: 0 }')],
     'soloDaRifare'),
    ('i temi riordinati per errori',
     [('righe: q.righe.map(rigaProgressi),',
       'righe: [...q.righe].sort((a, b) => b.daRifare - a.daRifare).map(rigaProgressi),')],
     'nell\'ordine di quadro()'),
    ('le voci riordinate per errori',
     [('if (r.voci) out.voci = r.voci.map(rigaProgressi);',
       'if (r.voci) out.voci = [...r.voci].sort((a, b) => b.daRifare - a.daRifare).map(rigaProgressi);')],
     'nell\'ordine'),
    ('«X su Y» anche sotto la soglia',
     [('const out = { ...r, azione:', 'const out = { ...r, primo: r.primo || { esatte: r.giusti, su: r.visti }, azione:')],
     'sotto soglia non c\'e\''),
    ('una frase inventata quando il motore non ne da\'',
     [('indicazione: d.indicazione,',
       'indicazione: d.indicazione || (q.righe.find((x) => x.maiVisti > 0) || {}).nome || null,')],
     'la pagina non mette niente al suo posto'),
    ('un peso inventato per la vela',
     [('const out = { ...r, azione:', 'const out = { ...r, peso: r.peso ?? (r.tema ? null : 5), azione:')],
     'nessun peso dove quadro()'),
    ('consigli() ancora chiamata',
     [('/* ---- il collegamento con la pagina',
       'function cosaStudiare(d) { return E.consigli(d, { quante: 6 }); }\n\n/* ---- il collegamento con la pagina')],
     'E.consigli non si chiama'),
    ('il raccordo perde l\'anteprima',
     [('function anteprimaProgressi(azione, richiesta) {', 'function anteprimaMappa(azione, richiesta) {'),
      ('const a = anteprimaProgressi(azione, richiesta);', 'const a = anteprimaMappa(azione, richiesta);')],
     'dichiara anteprimaProgressi'),
    ('le tre funzioni spariscono, e resta la chiamata al motore',
     [('function mappaProgressi(', 'function mappaAttivita('),
      ('function anteprimaProgressi(', 'function anteprimaAttivita('),
      ('function avviaProgressi(', 'function avviaAttivita(')],
     'dichiara mappaProgressi'),
    ('un pulsante da zero',
     [('azione: r.daRifare > 0 ? { azione: \'rifai\', quanti: r.daRifare, selezione: r.rifai } : null',
       'azione: { azione: \'rifai\', quanti: r.daRifare, selezione: r.rifai }')],
     'nessun pulsante da zero'),
    ('l\'ordine chiesto alla diagnosi',
     [('const q = E.quadro(banca, progress, oggi, kind, pesi);',
       'const q = E.quadro(banca, progress, oggi, kind, pesi); E.diagnosi(banca, progress, oggi, kind, pesi);')],
     'nessun\'altra funzione'),
    ('la frase su un quadro rifatto',
     [('E.dovePesa(q)', 'E.dovePesa(E.quadro(banca, progress, oggi, kind, pesi))')],
     'una sola chiamata a E.quadro()'),
    ('i pesi scritti in pagina',
     [('const q = E.quadro(banca, progress, oggi, kind, pesi);',
       "const q = E.quadro(banca, progress, oggi, kind, pesi && { 'NAVIGAZIONE CARTOGRAFICA ED ELETTRONICA': 4, "
       "'MANOVRA E CONDOTTA': 4, 'SICUREZZA DELLA NAVIGAZIONE': 3, 'NORMATIVA DIPORTISTICA E AMBIENTALE': 3, "
       "'COLREG E SEGNALAMENTO MARITTIMO': 2, METEOROLOGIA: 2, 'TEORIA DELLO SCAFO': 1, MOTORI: 1 });")],
     'i pesi sono quelli della richiesta'),
    ('l\'anteprima non verifica',
     [("if (!azione.quanti || lista.length !== azione.quanti) return { stato: 'cambiata', quanti: null, lista: [] };\n", '')],
     'dice «cambiata»'),
    ('Inizia senza verificare',
     [("  if (a.stato !== 'pronta') return { avviata: false, stato: a.stato };\n  avvia(a.lista,",
       "  avvia(E.coda(richiesta.banca, richiesta.progress, richiesta.oggi, azione.selezione),")],
     'Inizia non avvia niente'),
    ('il raccordo legge uno stato globale',
     [('const { banca, progress, oggi, kind, pesi } = richiesta;',
       'const { banca, oggi, kind, pesi } = richiesta; const progress = S.prog;')],
     'lancia'),
    ('il raccordo scrive nella richiesta',
     [('const q = E.quadro(banca, progress, oggi, kind, pesi);',
       'richiesta.disegnata = true; const q = E.quadro(banca, progress, oggi, kind, pesi);')],
     'scrivere nella richiesta'),
    ('la pagina chiede la mappa anche fuori dal raccordo',
     [('/* ---- il collegamento con la pagina',
       'function contaErrori() { return E.quadro(S.banca, S.prog, S.oggi, \'base\', null).totale.daRifare; }\n\n'
       '/* ---- il collegamento con la pagina')],
     'solo dentro il raccordo'),
    ('Inizia apre il runner senza il raccordo',
     [('avviaProgressi(azione, S.mappa.richiesta, (lista, modo, o) => apri(lista, modo, o));',
       'apri(E.coda(S.banca, S.prog, S.oggi, azione.selezione), \'sbagliate\');')],
     'le passa apri'),
    ('il raccordo dichiarato e mai chiamato',
     [('S.mappa.vista = mappaProgressi(S.mappa.richiesta);', 'S.mappa.vista = null;')],
     'disegna la mappa da mappaProgressi'),
    # Dal regime solo (P-47): la mappa c'e', e accanto restano le tabelle di
    # prima. Il raccordo passa tutto, e la seconda classifica si vedrebbe solo
    # guardando la schermata.
    ('la diagnosi di prima accanto alla mappa',
     [('<div id="d-mappa"></div>', '<div id="d-mappa"></div>\n<table id="d-temi"></table>\n<table id="d-voci"></table>')],
     'la diagnosi a due tabelle non c\'e\' piu\''),
]


def test_mappa_provata_al_contrario():
    rif = RIFERIMENTO_MAPPA.read_text(encoding='utf-8')
    v = mappa_riferimento()
    rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in v if not x['ok']]
    check('la pagina di riferimento della mappa passa il controllo', not rossi, '; '.join(rossi[:3]))
    # Un banco che non esegue niente passerebbe tutto: si pretende che abbia
    # confrontato le righe e fatto il giro delle azioni.
    check('il banco della mappa ha eseguito il giro, non solo letto i nomi', len(v) >= 150,
          'solo %d verifiche' % len(v))
    for g in ('righe', 'frase', 'azioni', 'raccordo'):
        check('il banco della mappa ha verifiche del gruppo «%s»' % g, any(x['gruppo'] == g for x in v))
    for cosa, sostituzioni, atteso in ROTTURE_MAPPA:
        rotta = rif
        for vecchio, nuovo in sostituzioni:
            check('rottura della mappa «%s»: si applica alla pagina di riferimento' % cosa, vecchio in rotta,
                  'il testo da sostituire non c\'e\' piu\': la rottura non romperebbe niente')
            rotta = rotta.replace(vecchio, nuovo, 1)
        if rotta == rif:
            continue
        vr = verifiche_mappa(rotta)
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vr if not x['ok']]
        check('rottura della mappa «%s»: il controllo diventa rosso' % cosa, bool(rossi), 'e\' passata verde')
        check('rottura della mappa «%s»: e il rosso nomina il difetto' % cosa, any(atteso in r for r in rossi),
              'rossi: ' + '; '.join(rossi[:3]))


# --- 5b''. il Carteggio: preparazione, righe, riepilogo (area 4, D-04) ------------

def banco_carteggio(testo):
    """Le verifiche del Carteggio progettato, eseguite sotto Node sulla pagina data.

    Il banco estrae le cinque funzioni di raccordo e le esegue contro il motore
    e le banche vere: vedi tests/ciclo_carteggio.mjs. Se il banco stesso non
    parte, e' un rosso.
    """
    try:
        p = subprocess.run(['node', str(BANCO_CARTEGGIO)], input=json.dumps({'pagina': testo}),
                           capture_output=True, text=True, timeout=120)
        out = json.loads(p.stdout) if p.returncode == 0 else None
    except (OSError, ValueError, subprocess.TimeoutExpired) as e:
        return [{'gruppo': 'raccordo', 'nome': 'il banco del Carteggio parte', 'ok': False, 'extra': str(e)}]
    if out is None:
        return [{'gruppo': 'raccordo', 'nome': 'il banco del Carteggio parte', 'ok': False,
                 'extra': (p.stderr or '').strip()[-400:]}]
    return out


def verifiche_carteggio(testo):
    """Le verifiche del Carteggio sulla pagina data: la lista di esiti {gruppo, nome, ok, extra}.

    Gruppi: «preparazione», «avvio» e «raccordo» sono di R-SEL-17; «righe» di
    R-FLU-23; «riepilogo» di R-FLU-24; «riprova» di R-FLU-25; «ambito» di
    R-UX-07. Il banco gira sempre, su qualunque pagina: su una senza il
    raccordo dice quale delle cinque funzioni manca, e non ha un giro da
    eseguire — per questo le verifiche si contano anche (`registra_carteggio`).
    """
    js = senza_commenti(testo)
    ambito = [{'gruppo': 'ambito', 'nome': 'la pagina non carica carteggio_e12.json, finche\' Q-AMBITO e\' aperta',
               'ok': 'carteggio_e12' not in js,
               'extra': 'i 50 esercizi entro 12 miglia sono nel cassetto: tirarli fuori e\' una decisione dell\'autore '
                        '(specifica §10, Q-AMBITO), e cambia il pubblico piu\' di ogni scelta di navigazione'}]
    return banco_carteggio(testo) + ambito


_CARTEGGIO_APP = None
_CARTEGGIO_RIF = None


def carteggio_app():
    global _CARTEGGIO_APP
    if _CARTEGGIO_APP is None:
        _CARTEGGIO_APP = verifiche_carteggio(leggi('app.html'))
    return _CARTEGGIO_APP


def carteggio_riferimento():
    global _CARTEGGIO_RIF
    if _CARTEGGIO_RIF is None:
        _CARTEGGIO_RIF = verifiche_carteggio(RIFERIMENTO_CARTEGGIO.read_text(encoding='utf-8'))
    return _CARTEGGIO_RIF


def registra_carteggio(gruppi):
    """Le verifiche della pagina vera, e il conto contro la pagina di riferimento, gruppo per gruppo.

    E' il conteggio di P-40, P-47, P-12 e P-37: un giro che si ferma a meta' ha
    meno verifiche, e quelle fatte possono essere tutte verdi. La pagina di prima
    di P-21, senza il raccordo, passava con una o due verifiche per gruppo e
    nessun rosso.
    """
    v, rif = carteggio_app(), carteggio_riferimento()
    for x in v:
        if x['gruppo'] in gruppi:
            check('Carteggio: %s' % x['nome'], x['ok'], x.get('extra', ''))
    for g in gruppi:
        n, attese = sum(x['gruppo'] == g for x in v), sum(x['gruppo'] == g for x in rif)
        check('Carteggio: il gruppo «%s» ha fatto tutte le verifiche' % g, attese > 0 and n >= attese,
              'troppo poche verifiche (%d su %d): il banco non ha eseguito il giro della pagina' % (n, attese))


def test_carteggio_preparazione():
    """R-SEL-17: la lista annunciata, e quella che Inizia apre, dal motore."""
    registra_carteggio(('preparazione', 'avvio', 'raccordo'))


def test_carteggio_righe():
    """R-FLU-23: le righe di carta e tecniche con lo schema di P-33."""
    registra_carteggio(('righe',))


def test_carteggio_riepilogo():
    """R-FLU-24: riepilogo e revisione di carta e tecniche da dettaglioCarteggio()."""
    registra_carteggio(('riepilogo',))


def test_carteggio_senza_riprova():
    """R-FLU-25: la riprova esatta resta dei quiz. Un gruppo suo, per tenerla
    distinta dal riepilogo: i controlli del riepilogo del Carteggio non sono
    quelli della riprova (R-FLU-10), e non ne prendono il posto."""
    registra_carteggio(('riprova',))


def test_carteggio_ambito():
    """R-UX-07: finche' Q-AMBITO e' aperta, il carteggio entro 12 miglia resta nel cassetto.

    Provato al contrario: una copia della pagina vera, e una della pagina di
    riferimento, che caricano il file sono rosse. Fino a P-50 la prova passava
    anche per il riconoscimento del regime della pagina vera (P-51): con un
    regime solo non c'e' piu' niente da riconoscere.
    """
    registra_carteggio(('ambito',))
    for nome, testo in (('vera', leggi('app.html')),
                        ('di riferimento', RIFERIMENTO_CARTEGGIO.read_text(encoding='utf-8'))):
        rotta = testo.replace('</script>', "fetch('/dati/carteggio_e12.json');\n</script>", 1)
        v = verifiche_carteggio(rotta)
        check('Carteggio provato al contrario (pagina %s): una pagina che carica carteggio_e12.json e\' rossa' % nome,
              any(x['gruppo'] == 'ambito' and not x['ok'] for x in v), '')


# Il banco del Carteggio gira anche su una pagina di riferimento, che deve
# passare, e su ciascuna delle sue rotture, che devono fallire nominando il
# difetto. Le rotture restano su di lei e non sulla pagina vera, per la ragione
# di P-40: sostituzioni di testo in un file dell'interfaccia da 200 KB si
# spezzerebbero a ogni suo ritocco, e una rottura che non si applica piu' e' un
# controllo spento. Ogni rottura e' una lista di sostituzioni, applicate in ordine.
_PREP_PROVA = ("const r = E.provaCarteggio(banca, fonte.specchio, fonte.oggi, "
               "{ seme: scelta.seme, nuoviPrima: !!scelta.nuoviPrima });")
ROTTURE_CARTEGGIO = [
    # Il raccordo
    ('il raccordo perde la preparazione',
     [('function preparaCarteggio(scelta, fonte) {', 'function preparaAttivita(scelta, fonte) {')],
     'dichiara preparaCarteggio'),
    ('il raccordo legge S invece della fonte',
     [('const banca = tec ? fonte.tecniche : fonte.banca;', 'const banca = tec ? S.tec : S.cart;')],
     'dipendere solo dai suoi argomenti'),
    ('il raccordo scrive nella fonte',
     [('const tec = attivita === \'tecniche\';', 'const tec = attivita === \'tecniche\';\n  fonte.ultima = attivita;')],
     'scrivere nella fonte'),
    # La preparazione
    ('la prova ricomposta con estrai()',
     [(_PREP_PROVA, _PREP_PROVA + '\n    r.lista = E.estrai(banca, fonte.specchio, fonte.oggi, 4, scelta.seme);')],
     'una sola selezione, E.provaCarteggio()'),
    ('la variante che non arriva al motore',
     [('nuoviPrima: !!scelta.nuoviPrima });', 'nuoviPrima: false });')],
     'una sola selezione, E.provaCarteggio()'),
    # Copiata parola per parola dal motore: con il testo vero passerebbe, ed e'
    # il banco a restituirne un altro (tests/ciclo_carteggio.mjs, in testa).
    ('l\'assunzione di Q-CART4 copiata in pagina',
     [('assunzione: r.assunzione,', 'assunzione: "Q-CART4: un esercizio per ciascuno dei quattro argomenti è '
       'un\'assunzione del sito, non una composizione del decreto, che dice soltanto «quattro quesiti indipendenti». '
       'La carta 42/D non ha esercizi di carburante: una prova così può richiedere più carte.",')],
     'assunzione'),
    ('le condizioni della prova scritte a mano',
     [('condizioni: r.condizioni,', 'condizioni: { esercizi: 4, minuti: 60, soglia: 3, erroriMax: 1 },')],
     'condizioni'),
    ('le costanti della prova tenute in pagina',
     [('function carteDi(lista)', 'const PROVA_MIN = 60;\n\nfunction carteDi(lista)')],
     'seconda composizione della prova'),
    ('una prova corta chiamata pronta',
     [("stato: r.pronta ? 'pronta' : 'corta',", "stato: 'pronta',")],
     'stato «corta»'),
    # Nata provando il banco contro se' stesso: senza la banca senza carburante
    # nessuna rottura aveva bisogno di quel caso, come la scheda intrecciata di
    # P-31. Il ripiego dichiarato e' una prova pronta (D-01), non una corta.
    ('la prova completata dal resto bloccata come corta',
     [("stato: r.pronta ? 'pronta' : 'corta',", "stato: r.pronta && !r.mancanti.length ? 'pronta' : 'corta',")],
     'banca senza carburante: stato «pronta»'),
    ('i mancanti taciuti su una banca incompleta',
     [('mancanti: r.mancanti, completamento: r.completamento,', 'mancanti: [], completamento: [],')],
     'mancanti'),
    ('le riprese della prova cieca dette zero',
     [('riprese: r.riprese };', 'riprese: r.riprese || [] };')],
     'null, non zero'),
    ('il giro riordinato in pagina',
     [('const lista = g.map((x) => x.e);', 'const lista = g.map((x) => x.e).sort((a, b) => a.id.localeCompare(b.id));')],
     'la lista e\' quella del motore'),
    ('il tappeto a cinque esercizi',
     [('E.tappeto(banca, fonte.specchio, 4)', 'E.tappeto(banca, fonte.specchio, 5)')],
     'fino a 4 esercizi'),
    ('il riconoscimento senza il tetto di 15',
     [('{ n: 15 }', '{ n: 20 }')],
     'fino a 15 testi'),
    ('la lettura fallita presa per uno storico vuoto',
     [("if ((attivita !== 'prova' || scelta.nuoviPrima) && fonte.letturaFallita)", 'if (false && fonte.letturaFallita)')],
     'storico vuoto'),
    # L'avvio
    ('Inizia senza rifare la preparazione',
     [('const ora = preparaCarteggio(preparazione.scelta, fonte);', 'const ora = preparazione;')],
     'dice «cambiata»'),
    ('Inizia apre la pescata di adesso',
     [("  if (ora.lista.length !== ids.length || ora.lista.some((e, i) => e.id !== ids[i])) return { avviata: false, stato: 'cambiata' };\n", ''),
      ('avvia(preparazione.lista, modo, opt);', 'avvia(ora.lista, modo, opt);')],
     'dice «cambiata»'),
    ('un\'identita\' riusata a ogni avvio',
     [('const simUid = uid();', "const simUid = 'carteggio-' + preparazione.attivita;")],
     'due identita'),
    ('il lavoro con l\'orologio della pagina',
     [('inizio: fonte.adesso,', 'inizio: Date.now(),')],
     'l\'orologio della fonte'),
    ('il giro senza le tecniche che porta',
     [('  if (preparazione.motivi) opt.motivi = preparazione.motivi;\n', '')],
     'le tecniche di ogni esercizio'),
    # Le righe
    ('la conclusione con uid nuovi a ogni ritento',
     [('  return { righe, motivo };', '  return { righe: righe.map((r) => ({ ...r, uid: uid() })), motivo };')],
     'riusa gli stessi uid'),
    ('il giudizio rinviato scritto come «da rivedere»',
     [('E.concludiBozza(lavoro, { ts: fonte.ts, quesiti });',
       'E.concludiBozza({ ...lavoro, giudizi: lavoro.giudizi.map((g) => g ?? 0) }, { ts: fonte.ts, quesiti });')],
     'giudizio rinviato'),
    ('la conclusione senza gli esercizi della banca',
     [('E.concludiBozza(lavoro, { ts: fonte.ts, quesiti });', 'E.concludiBozza(lavoro, { ts: fonte.ts });')],
     'gli id della banca'),
    ('la risposta del riconoscimento senza legame',
     [('sim_uid: corsa.simUid,', 'sim_uid: null,')],
     'un sim_uid nuovo'),
    ('la risposta del riconoscimento senza posizione',
     [('sim_uid: corsa.simUid, proposti: corsa.proposti, pos };', 'sim_uid: corsa.simUid };')],
     'proposti e pos'),
    ('le scelte giudicate per inclusione',
     [('mie.size === attese.size && ', '')],
     'esattamente le tecniche'),
    # Il riepilogo
    ('il riepilogo che riconta da se\'',
     [('const quanti = d.conteggi ? d.conteggi[campo] : 0;',
       'const quanti = d.conteggi ? E.attivitaCarteggio(fonte.righe, { tipo }).find((a) => a.id === d.id).righe.filter((r) => r.verdict === 0).length : 0;')],
     'per ricontare'),
    ('l\'esito dato a un allenamento',
     [('esito: d.esito,', 'esito: d.esito || (d.conteggi && d.conteggi.coincidenti != null ? { coincidenti: d.conteggi.coincidenti, '
       'su: d.conteggi.esercizi, soglia: 3, raggiunta: d.conteggi.coincidenti >= 3 } : null),')],
     'un allenamento non ha soglia'),
    ('«Rivedi» con il conto di tutte le schede',
     [('rivedi: quanti ? { filtro, quanti } : null', 'rivedi: quanti ? { filtro, quanti: d.schede.length } : null')],
     '«Rivedi» porta'),
    ('la riprova anche nel Carteggio',
     [('return { stato, tipo, id: d.id,', 'return { riprova: E.erroriSessione(fonte.righe, banca, id), stato, tipo, id: d.id,')],
     'nessuna riprova'),
    ('un legame ambiguo preso per pronto',
     [(": d.ambigua ? 'ambigua' : 'pronto';", ": 'pronto';")],
     'stato «ambigua»'),
    ('la lettura fallita presa per un\'attivita\' sparita',
     [("(fonte.letturaFallita ? 'illeggibile' : 'indisponibile')", "'indisponibile'")],
     'una lettura fallita'),
    ('i mancanti detti «nessuno» senza la banca',
     [('mancanti: d.mancanti, rivedi:', 'mancanti: d.mancanti || [], rivedi:')],
     'null, non «nessuno»'),
    # Il collegamento
    ('una selezione del Carteggio fuori dal raccordo',
     [('function archivia(r) { S.archivio.push(r); }',
       'function archivia(r) { S.archivio.push(r); }\n\nfunction giroDiOggi() { return E.giroTecniche(S.cart, S.cprog); }')],
     'fuori dal raccordo: E.giroTecniche'),
    ('una riga di prova scritta fuori dal raccordo',
     [('    righe.forEach(archivia);',
       "    righe.forEach(archivia);\n    archivia({ _t: 's', uid: S.lavoro.id, kind: 'carteggio', ts: E.isoLocale() });")],
     'righe scritte fuori dal raccordo'),
    ('la revisione filtrata in pagina',
     [('function archivia(r) { S.archivio.push(r); }',
       "function archivia(r) { S.archivio.push(r); }\n\nfunction righeDi(id) { return S.archivio.filter((r) => r._t === 'c' && r.sim_uid === id); }")],
     'non filtra le righe per tipo'),
    ('il riepilogo dichiarato e mai chiamato',
     [("    if (righe.length) S.fine = riepilogoCarteggio({ id: S.lavoro.id, tipo: 'c' }, fonteCarteggio());\n", '')],
     'dichiarate e mai chiamate: riepilogoCarteggio'),
    ('il carteggio entro 12 miglia caricato',
     [('function archivia(r) { S.archivio.push(r); }',
       "function archivia(r) { S.archivio.push(r); }\nfetch('/dati/carteggio_e12.json');")],
     'carteggio_e12'),
]


def test_carteggio_provato_al_contrario():
    """R-FLU-26: il banco del Carteggio contro se' stesso, a ogni esecuzione."""
    rif = RIFERIMENTO_CARTEGGIO.read_text(encoding='utf-8')
    v = carteggio_riferimento()
    rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in v if not x['ok']]
    check('la pagina di riferimento del Carteggio passa il controllo', not rossi, '; '.join(rossi[:3]))
    # Un banco che non esegue niente passerebbe tutto: si pretende che abbia
    # preparato, avviato, concluso e riletto.
    check('il banco del Carteggio ha eseguito il giro, non solo letto i nomi', len(v) >= 230,
          'solo %d verifiche' % len(v))
    for g in ('preparazione', 'avvio', 'righe', 'riepilogo', 'riprova', 'raccordo', 'ambito'):
        check('il banco del Carteggio ha verifiche del gruppo «%s»' % g, any(x['gruppo'] == g for x in v))
    for cosa, sostituzioni, atteso in ROTTURE_CARTEGGIO:
        rotta = rif
        for vecchio, nuovo in sostituzioni:
            check('rottura del Carteggio «%s»: si applica alla pagina di riferimento' % cosa, vecchio in rotta,
                  'il testo da sostituire non c\'e\' piu\': la rottura non romperebbe niente')
            rotta = rotta.replace(vecchio, nuovo, 1)
        if rotta == rif:
            continue
        vr = verifiche_carteggio(rotta)
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vr if not x['ok']]
        check('rottura del Carteggio «%s»: il controllo diventa rosso' % cosa, bool(rossi), 'e\' passata verde')
        check('rottura del Carteggio «%s»: e il rosso nomina il difetto' % cosa, any(atteso in r for r in rossi),
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
# Un regime solo, dal 30 settembre 2026 (P-40). Fino a P-18 i regimi erano
# due, con il meccanismo dei quiz e del ciclo: la pagina senza account doveva
# mantenere la promessa di allora, quella con indirizzoApi() (account-progetto
# §7.4) il contratto del progetto del client. P-18 ha portato il client nella
# pagina vera, e da qui una pagina che non dichiara indirizzoApi() e' rossa:
# nel controllo statico qui sotto, e in ogni gruppo del banco, che la guida come
# una pagina con il client.
#
# La pagina di riferimento resta, e non per nostalgia: e' lei che porta le
# rotture e le varianti, cioe' il banco provato contro i propri verdi e rossi
# falsi. Le rotture sono sostituzioni di testo in una pagina piccola e scritta
# per il banco; sulla pagina vera, da 200 KB e dell'interfaccia, si
# spezzerebbero a ogni ritocco di ui/*, e un controllo che si spegne da solo
# quando cambia la pagina e' il verde a copertura zero.
BANCO_CLIENT = RADICE / 'tests' / 'client_account.mjs'
RIFERIMENTO_CLIENT = RADICE / 'tests' / 'pagina-client-account.html'
GRUPPI_CLIENT = ['C-01', 'C-02', 'C-03', 'C-04', 'C-05', 'C-06', 'C-07', 'C-08', 'C-09', 'C-10', 'C-11', 'C-12',
                 'C-13', 'C-14', 'C-15', 'C-16', 'C-17']
# Quante verifiche fa ogni gruppo quando arriva in fondo, sulla pagina di
# riferimento: meno vuol dire che il giro si e' fermato prima e che una parte
# dei controlli non e' stata eseguita, cioe' un verde a copertura parziale.
VERIFICHE_CLIENT = {'C-01': 34, 'C-02': 15, 'C-03': 11, 'C-04': 20, 'C-05': 13, 'C-06': 15, 'C-07': 17, 'C-08': 18,
                    'C-09': 13, 'C-10': 10, 'C-11': 8, 'C-12': 9, 'C-13': 8, 'C-14': 3, 'C-15': 12, 'C-16': 23, 'C-17': 10,
                    'C-13:scarica': 7, 'C-08:cancella': 8, 'C-15:segnali': 7,
                    'C-19:senza': 4, 'C-19:ricarica': 4, 'C-19:scadenza': 4, 'C-19:guasto': 3, 'C-19:giudizio': 5,
                    'C-19:uscita': 4, 'C-19:schede': 4}
# Le tre scelte che fino a P-46 nessun gruppo premeva (R-ACC-63): sono parti dei
# loro gruppi, e girano con loro, ma le verifiche portano il nome della parte e
# hanno un controllo ciascuna, cosi' la specifica le nomina una per una.
SCELTE_CLIENT = ['C-13:scarica', 'C-08:cancella', 'C-15:segnali']
# C-19, la bozza del carteggio (P-34, §9.4 del progetto del client): le verifiche
# portano il nome della parte, e ognuna ha il suo conto. Sulla pagina vera la
# bozza non c'e' ancora: finche' il difetto e' dichiarato in
# docs/eccezioni-interfaccia.md («Difetti aperti dichiarati») il banco esegue
# `senza`, che deve essere verde, e la parte che dimostra il difetto; tolta la
# dichiarazione, tutto il gruppo, verde.
PARTI_BOZZA = ['C-19:senza', 'C-19:ricarica', 'C-19:scadenza', 'C-19:guasto', 'C-19:giudizio', 'C-19:uscita', 'C-19:schede']


def difetti_dichiarati():
    """[(parte, verifica)] dei difetti aperti dichiarati, o None se la tabella manca."""
    righe = tabella('Difetti aperti dichiarati', 3)
    return None if righe is None else [(p, v) for p, v, _ in righe]


def gruppi_bozza_app():
    """Le parti di C-19 da eseguire sulla pagina vera: con un difetto dichiarato,
    `senza` e le parti che lo dimostrano; senza, il gruppo intero."""
    dichiarati = [p for p, _ in (difetti_dichiarati() or []) if p.startswith('C-19:')]
    return ['C-19:senza'] + sorted(set(dichiarati) - {'C-19:senza'}) if dichiarati else ['C-19']


# Le verifiche delle attivita' oltre il Percorso, in C-01: R-ACC-04 le chiede tutte.
ATTIVITA_CLIENT = ['Quiz per argomento: ', 'Simulazione: ', 'Che tecnica serve?: ', 'Carteggio: ', 'Segnali: ']


def ha_il_client(testo):
    """La pagina dichiara indirizzoApi() fuori dai commenti: e' il segno del client."""
    return bool(re.search(r'^function indirizzoApi\(', senza_commenti(testo), re.M))


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
    # Una scrittura che arriva tardi: con la pausa di 500 ms del banco di prima
    # passava verde sempre, non a volte (P-38, §12 del progetto del client).
    ('le risposte in Cache Storage, un secondo dopo il riepilogo', ['C-02'],
     [("function termina() {",
       "function termina() { setTimeout(() => caches.open('rg-tardi').then((c) => c.put('/risposte.json', new Response(JSON.stringify(S.righe)))), 1000);")],
     'Cache Storage «rg-tardi»'),
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
    # C-01, le altre attivita' (P-39)
    ('la simulazione consegna senza conferma', ['C-01:attivita'],
     [("if (t.id === 'r-close') return S.run && S.run.sim ? ($('r-consegna').hidden = false) : termina();",
       "if (t.id === 'r-close') return termina();")],
     'chiede conferma in pagina'),
    ('la simulazione corregge durante la prova', ['C-01:attivita'],
     [('  if (R.sim) {', '  if (R.sim && false) {')],
     'nessuna correzione durante la prova'),
    ('il carteggio senza la risposta ministeriale', ['C-01:attivita'],
     [('<p>Risposta ministeriale: ${esc(e.risposta_ufficiale)}</p>', '<p>Risposta ministeriale: vedi il decreto</p>')],
     'accanto a quella ministeriale'),
    ('il giudizio di chi studia detto solo dopo l\'avvio', ['C-01:attivita'],
     [('<p id="c-giudizio">Tu svolgi gli esercizi sulla carta. Sei tu a giudicare: il sito non corregge il carteggio.</p>',
       '<p id="c-giudizio" hidden>Tu svolgi gli esercizi sulla carta. Sei tu a giudicare: il sito non corregge il carteggio.</p>')],
     'il giudizio e\' di chi studia'),
    ('il carteggio chiede un account prima della prova', ['C-01:attivita'],
     [("if (t.id === 'c-start') return avviaCart();", "if (t.id === 'c-start') { moduloRegistrazione(); return avviaCart(); }")],
     'Carteggio: si apre un esercizio della banca, senza account'),
    ('le tecniche corrette senza dire quali servono', ['C-01:attivita'],
     [("$('r-verdict').textContent = 'Servono: ' + it.tecniche.join(' + ');", "$('r-verdict').textContent = 'Corretto.';")],
     'le tecniche che l\'esercizio chiede'),
    ('la partita dei Segnali che non finisce', ['C-01:attivita'],
     [("  if (G.i + 1 < G.dom.length) { $('sr-next').hidden = false; return; }",
       "  if (G.i + 1 < G.dom.length) { $('sr-next').hidden = false; return; }\n  return;")],
     'la partita arriva in fondo'),
    # C-02, i Segnali (P-39)
    ('i punteggi dei Segnali in localStorage', ['C-02'],
     [("  $('sr-fine').classList.add('on');",
       "  $('sr-fine').classList.add('on'); localStorage.setItem('pn.segPunti', JSON.stringify({ notturni: { migliore: G.esatte, giocate: 1 } }));")],
     'localStorage: pn.segPunti'),
    ('i Segnali senza l\'avviso', ['C-02'],
     [('<p id="seg-avviso">', '<p id="seg-avviso" hidden>')],
     'i punteggi valgono per questa pagina'),
    # C-03 (P-39)
    ('una finestra d\'account all\'apertura', ['C-03'],
     [("fetch('/dati/carteggio.json').then((r) => r.json()).then((c) => { S.cart = c; }).catch(() => {});",
       "fetch('/dati/carteggio.json').then((r) => r.json()).then((c) => { S.cart = c; }).catch(() => {});\nmoduloRegistrazione();")],
     'in nessuna vista'),
    ('l\'invito in una vista, fuori dal riepilogo', ['C-03'],
     [('  <h1>Quiz</h1>', '  <h1>Quiz</h1>\n  <button data-account="registra">Crea un account e salva</button>')],
     'in nessuna vista'),
    ('Progressi con il cruscotto senza account', ['C-03'],
     [('<div id="d-temi" hidden>', '<div id="d-temi">')],
     'senza un cruscotto'),
    ('«Continua senza account» apre il modulo di accesso', ['C-03'],
     [("if (a === 'continua') { $('quizrun').classList.remove('on'); return; }",
       "if (a === 'continua') { $('quizrun').classList.remove('on'); return moduloAccesso(''); }")],
     'lo chiude senza chiedere altro'),
    ('l\'invito durante l\'attivita\' dopo', ['C-03'],
     [('function mostra() {', "function mostra() {\n  if (!S.conto && S.ultima) $('conto-stato').textContent = 'Vuoi conservare le attività di questa pagina?';")],
     'durante l\'attivita\' dopo'),
    # C-04 (P-39)
    ('«salvate» con l\'invio ancora in volo', ['C-04:registrazione'],
     [('  if (r.completo) {', "  if (r.completo || r.stato === 'in corso') {")],
     'niente «salvate» e niente data'),
    ('la data d\'esame prima del trasferimento', ['C-04:registrazione'],
     [('  S.onboarding = true;\n  await trasferisci(', '  onboarding();\n  await trasferisci(')],
     'niente «salvate» e niente data'),
    ('solo l\'ultima attivita\' nel trasferimento', ['C-04:registrazione'],
     [('  await trasferisci(S.righe.splice(0));', '  await trasferisci(S.righe.splice(0).filter((r) => r.sim_uid === S.ultima.id));')],
     'di tutte e due le attivita\''),
    ('doppio clic, due registrazioni', ['C-04:registrazione'],
     [("  bottone.disabled = true;\n  esito.textContent = 'Creazione dell\\'account in corso…';",
       "  esito.textContent = 'Creazione dell\\'account in corso…';")],
     'doppio clic'),
    ('risposta persa: la registrazione si ripete', ['C-04:persa'],
     [('    return dopoRispostaPersa();', '    return registra();')],
     'e non ripete'),
    ('risposta persa: niente domanda al server', ['C-04:persa'],
     [('    return dopoRispostaPersa();', "    { esito.textContent = 'Il server non ha risposto. Riprova.'; bottone.disabled = false; return; }")],
     'chiede al server'),
    # C-06 (P-39)
    ('le risposte di prova portate senza chiedere', ['C-06:scelta'],
     [('  if (!S.righe.length) { chiudiPannello(); return catena(); }',
       '  if (S.righe.length) { chiudiPannello(); return trasferisci(S.righe.splice(0)); }')],
     'chiede se portarle'),
    ('la scelta proposta parte da sola', ['C-06:scelta'],
     [('    <button data-conto="scelta">Conferma la scelta</button>`);',
       '    <button data-conto="scelta">Conferma la scelta</button>`);\n  trasferisci(S.righe.slice());')],
     'non fa partire niente da sola'),
    ('il no porta comunque le righe', ['C-06:scelta'],
     [('  else { S.prova = S.righe; S.righe = []; await catena(); }', '  else { await trasferisci(S.righe.splice(0)); }')],
     'con il no'),
    ('l\'uscita non annulla l\'invio in volo delle altre schede', ['C-06:corsa'],
     [('  if (S.ac) S.ac.abort();\n', '')],
     'non arriva nell\'account di B'),
    # Nella pagina di riferimento l'uscita aspetta il lucchetto delle altre
    # schede: senza l'avviso non si compie, e B non entra. Una pagina senza il
    # lucchetto la compirebbe, e la rottura sarebbe rossa sulla riga di A in B.
    ('l\'uscita non avvisa le altre schede', ['C-06:corsa'],
     [("  canale.postMessage({ tipo: 'uscita', chiave });\n", '')],
     'dall\'altra scheda A esce'),
    ('la coda di A importata in B', ['C-06:congelata'],
     [('  S.db = await apriDb(S.conto.chiave);',
       "  S.db = await apriDb(S.conto.chiave);\n"
       "  for (const d of await indexedDB.databases()) if (d.name.startsWith('rg-account-') && d.name !== nomeDb(S.conto.chiave)) {\n"
       "    const vecchio = await new Promise((ok) => { const q = indexedDB.open(d.name); q.onsuccess = () => ok(q.result); });\n"
       "    const righe = await new Promise((ok) => { const q = vecchio.transaction('righe').objectStore('righe').getAll(); q.onsuccess = () => ok(q.result); });\n"
       "    vecchio.close();\n"
       "    await tx((s) => ({ nuove: righe, coda: righe.reduce((c, r) => E.accoda(c, r.uid), s.coda) }));\n"
       "  }")],
     'non entra in B'),
    # C-11 (P-39)
    ('la coda di inizio invio salvata alla conferma', ['C-11:volo'],
     [('      esito = E.dopoInvio(s.coda, lotto, risposta, s.righe);', '      esito = E.dopoInvio(coda, lotto, risposta, s.righe);')],
     'la risposta data durante l\'invio'),
    # La coda che ogni scheda tiene in memoria e scrive intera: due schede si
    # sovrascrivono (§9.1). Una prima versione scriveva in due transazioni con
    # un secondo in mezzo, e passava verde: il timer della scheda in secondo
    # piano scattava dopo 1,76 s, quando l'altra aveva gia' inviato (misurato).
    ('la coda tenuta in memoria da ogni scheda e scritta intera', ['C-11:volo'],
     [('  try { await tx((s) => ({ nuove: [riga], coda: E.accoda(s.coda, riga.uid) })); }',
       '  S.codaMia = E.accoda(S.codaMia || E.nuovaCoda({ generazione: S.conto.generazione, epocaDb: S.conto.epoca }), riga.uid);\n'
       '  try { await tx(() => ({ nuove: [riga], coda: S.codaMia })); }')],
     'due schede che rispondono insieme'),
    ('dopo la ricarica l\'invio non riprende', ['C-11:ricarica'],
     [('  await entra(io.corpo);\n  await dipingiStato();\n  await catena();', '  await entra(io.corpo);\n  await dipingiStato();')],
     'ricarica: la pagina riprende'),
    # C-15 (P-39)
    ('si esce con risposte non inviate', ['C-15:uscite'],
     [('  if (pendenti || segnali) {', '  if (segnali) {')],
     'con risposte non inviate'),
    ('offline l\'uscita si dichiara fatta', ['C-15:uscite'],
     [('      if (r.codice !== 204 && r.codice !== 401) {', '      if (false) {')],
     'offline, «Esci»'),
    ('la cancellazione bloccata presa per riuscita', ['C-15:uscite'],
     [('        q.onblocked = () => ok(false);', '        q.onblocked = () => ok(true);')],
     'una copia che non si cancella'),
    ('l\'uscita lascia la copia dell\'account', ['C-15:corsa'],
     [('        const q = indexedDB.deleteDatabase(nomeDb(chiave));', '        const q = {}; setTimeout(() => q.onsuccess(), 0);')],
     'dopo l\'uscita niente dell\'account resta'),
    ('la risposta tardiva scritta dopo l\'uscita', ['C-15:corsa'],
     [('async function invia(mio) {\n  for (;;) {', 'async function invia(mio) {\n  const conto = S.conto;\n  for (;;) {'),
      ('    if (mio !== S.ciclo || risposta.annullata) return false;\n    if (risposta.codice === 401) { scaduto(); return false; }\n    // La coda si rilegge',
       '    if (risposta.codice === 401) { scaduto(); return false; }\n    // La coda si rilegge'),
      ('  if (S.ac) S.ac.abort();\n', ''),
      ('    let esito;\n    await tx((s) => {\n      esito = E.dopoInvio(',
       '    let esito;\n    if (!S.db) { S.conto = conto; S.db = await apriDb(conto.chiave); }\n    await tx((s) => {\n      esito = E.dopoInvio(')],
     'dopo l\'uscita niente dell\'account resta'),
    # --- P-43 ---------------------------------------------------------------
    # C-07, la verifica dell'email
    ('il 503 di posta preso per un errore', ['C-07:posta'],
     [('if (r.status === 201 || (r.status === 503 && corpo && corpo.chiave_locale)) return registrato(corpo);',
       'if (r.status === 201) return registrato(corpo);')],
     'con la mail rifiutata dal fornitore'),
    ('la scadenza calcolata con l\'orologio del browser', ['C-07:posta'],
     [('  el.innerHTML = (S.conto.scade\n', '  el.innerHTML = ((S.conto.scade = new Date(Date.now() + 7 * 86400000).toISOString())\n')],
     'la scadenza della conferma si vede dal primo momento'),
    ('un rinvio rifiutato detto spedito', ['C-07:posta'],
     [('  if (r.codice === 202) {\n    S.postaFallita = false;', '  if (r.codice === 202 || r.codice === 503) {\n    S.postaFallita = false;')],
     'nessuna frase di successo'),
    ('il gettone lasciato nell\'indirizzo', ['C-07:link'],
     [("  history.replaceState(null, '', location.pathname + location.search);\n", '')],
     'il gettone esce dall\'indirizzo'),
    ('il gettone salvato in sessionStorage', ['C-07:link'],
     [('  return { scopo: m[1], gettone: m[2] };', "  sessionStorage.setItem('rg-link', m[2]);\n  return { scopo: m[1], gettone: m[2] };")],
     'il gettone non resta'),
    ('un link gia\' usato preso per buono', ['C-07:link'],
     [('  if (r.codice === 200) {\n    // Un link di verifica', '  if (r.codice === 200 || r.codice === 410) {\n    // Un link di verifica')],
     'gia\' usato, lo dice'),
    # C-08, la password
    ('il motivo della password sostituito da una frase generica', ['C-08:password'],
     [("  esito.textContent = (corpo && corpo.messaggio) || 'La registrazione non è riuscita. Le risposte sono ancora qui: riprova.';",
       "  esito.textContent = 'La registrazione non è riuscita. Le risposte sono ancora qui: riprova.';")],
     'il motivo del server accanto al campo'),
    ('dopo un rifiuto il modulo si svuota', ['C-08:password'],
     [("  esito.textContent = (corpo && corpo.messaggio) || 'La registrazione non è riuscita. Le risposte sono ancora qui: riprova.';",
       "  moduloRegistrazione(); $('account-esito').textContent = (corpo && corpo.messaggio) || '';")],
     'svuotato'),
    ('l\'email sconosciuta distinta dalla password sbagliata', ['C-08:accesso'],
     [("  if (r.codice === 401) e.textContent = 'Email o password non corrette. Riprova oppure reimposta la password.';",
       "  if (r.codice === 401) e.textContent = /nessuno-/.test($('account').querySelector('[name=email]').value) ? 'Nessun account con questa email.' : 'Email o password non corrette. Riprova oppure reimposta la password.';")],
     'la stessa frase'),
    ('il 429 senza l\'attesa', ['C-08:accesso'],
     [('  else if (r.codice === 429) e.textContent = `Troppi tentativi. Puoi riprovare fra ${secondi(r.attesa)}.`;',
       '  else if (r.codice === 429) e.textContent = \'Troppi tentativi. Puoi riprovare fra poco.\';')],
     'dal Retry-After'),
    ('il recupero che promette la mail', ['C-08:recupero'],
     [("    ? 'Se questo indirizzo è iscritto, riceverai una mail da Rotta Giusta.", "    ? 'Ti abbiamo mandato una mail da Rotta Giusta.")],
     'la stessa frase condizionale'),
    ('il gettone della password perso dopo un 422', ['C-08:recupero'],
     [('  // Un 422 tiene il gettone in memoria: si corregge la password e si riprova.\n',
       "  if (r.codice === 422) LINK.gettone = 'perso';\n")],
     'lo stesso gettone, dopo il rifiuto'),
    ('le risposte di un account appena confermato tenute senza chiedere', ['C-08:recupero'],
     [('  if (r.corpo.confermato_ora && r.corpo.righe > 0) {', '  if (false) {')],
     'la pagina chiede se tenerle'),
    ('le risposte di un account appena confermato cancellate senza chiedere', ['C-08:recupero'],
     [('    S.pwNuova = pw;\n    return pannello(`<h2>Account confermato</h2>',
       "    S.pwNuova = pw;\n    api('POST', '/v1/azzera', { password: pw });\n    return pannello(`<h2>Account confermato</h2>")],
     'nessuna risposta si cancella da sola'),
    # C-09, l'archivio di prima
    ('l\'archivio di prima letto solo da IndexedDB', ['C-09:porta'],
     [('  const daLs = raw ? JSON.parse(raw) : [];', '  const daLs = [];')],
     'unite per uid'),
    ('le due fonti sommate invece di unite', ['C-09:porta'],
     [('  return E.fondiArchivio(daIdb, daLs).righe;', '  return [...daIdb, ...daLs];')],
     'unite per uid'),
    ('le risposte di prima portate senza chiedere', ['C-09:porta'],
     [('  const righe = await leggiVecchio();\n  pannello(`<h2>Porta le risposte nel tuo account</h2>',
       '  return confermaVecchio();\n  const righe = await leggiVecchio();\n  pannello(`<h2>Porta le risposte nel tuo account</h2>')],
     'chiede se portarle'),
    ('portarle cancella l\'archivio di prima', ['C-09:porta'],
     [("  await trasferisci(righe, { fonte: 'vecchio' });",
       "  await trasferisci(righe, { fonte: 'vecchio' });\n  indexedDB.deleteDatabase(VECCHIO); localStorage.removeItem('pn.archivio');")],
     'resta dov\'era'),
    ('il segno che guarda il numero e non gli uid', ['C-09:porta'],
     [('  const nuove = righe.filter((r) => !portate.has(String(r.uid)));',
       '  const nuove = segno && righe.length === segno.n ? [] : righe.filter((r) => !portate.has(String(r.uid)));')],
     'anche a conteggio uguale'),
    ('«Più tardi» ricordato nel browser', ['C-09:dopo'],
     [("  if (vv === 'dopo') { S.vecchioDopo = true;", "  if (vv === 'dopo') { S.vecchioDopo = true; localStorage.setItem('pn.vecchioDopo', '1');")],
     'senza scrivere niente'),
    ('una lettura fallita presa per un archivio vuoto', ['C-09:fallita'],
     [("  try { righe = await leggiVecchio(); } catch { $('vecchio').hidden = true; $('vecchio-errore').hidden = false; return; }",
       '  try { righe = await leggiVecchio(); } catch { righe = []; }')],
     'una lettura fallita'),
    # C-10, un file
    ('il file filtrato sul nome dell\'app', ['C-10:file'],
     [("if (!dati || !Array.isArray(dati.righe)) throw new Error('formato');",
       "if (!dati || !Array.isArray(dati.righe) || dati.app !== 'rotta-giusta') throw new Error('formato');")],
     'l\'anteprima dice i conteggi'),
    ('i tag senza data scartati dalla pagina', ['C-10:file'],
     [('  S.file = { nome: f.name, righe: dati.righe,', '  S.file = { nome: f.name, righe: dati.righe.filter((r) => r.ts),')],
     'l\'anteprima dice i conteggi'),
    ('i Segnali del file sommati in pagina', ['C-10:file'],
     [("    const r = await api('PUT', '/v1/profilo', { segnali: F.segPunti });",
       "    const r = await api('PUT', '/v1/profilo', { segnali: Object.fromEntries(Object.entries(F.segPunti).map(([m, p]) => [m, { migliore: p.migliore, giocate: p.giocate + (((S.conto.segnali || {})[m] || {}).giocate || 0) }])) });")],
     'si fondono con il massimo'),
    ('le righe non importate non si scaricano', ['C-10:file'],
     [("      + (scarti ? ' <button data-importa=\"scarti\">Scarica le righe non importate</button>' : '');", "      + '';")],
     'gli scarti da scaricare'),
    ('l\'anteprima che non guarda le righe gia\' presenti', ['C-10:file'],
     [('  const f = E.fondiArchivio(righe, F.righe, { quesiti: quesiti() });', '  const f = E.fondiArchivio([], F.righe, { quesiti: quesiti() });')],
     'reimportato'),
    ('senza account il file conservato nel browser', ['C-10:senza'],
     [('  if (!S.conto) {\n    return pannello(`<h2>Importa un file dei progressi</h2>',
       "  if (!S.conto) {\n    localStorage.setItem('pn.file', JSON.stringify(S.file));\n    return pannello(`<h2>Importa un file dei progressi</h2>")],
     'non parte e non si conserva'),
    ('un file illeggibile preso per vuoto', ['C-10:senza'],
     [("  catch { $('importa-esito').textContent = 'Non riusciamo a leggere questo file di progressi. Scegli un file esportato da Rotta Giusta'; return; }",
       '  catch { dati = { righe: [] }; }')],
     'un file illeggibile lo dice'),
    ('i punteggi da inviare tenuti solo in memoria', ['C-10:segnali'],
     [('    return { seg };\n  });\n  await punteggiInSospeso();',
       "    return {};\n  });\n  $('seg-stato').textContent = 'Punteggi da inviare';\n  api('PUT', '/v1/profilo', { segnali: seg.punti });")],
     'dopo una ricarica con la rete'),
    # C-12, i limiti
    ('lotti a fette di 2.000 righe, senza guardare i byte', ['C-12:lotti'],
     [('    const lotto = E.lottoDaInviare(righe, coda);',
       '    const inCoda = new Set(coda.daInviare), fetta = righe.filter((r) => inCoda.has(String(r.uid))).slice(0, 2000);\n'
       '    const lotto = fetta.length ? { generazione: coda.generazione, righe: fetta } : null;')],
     'arrivano tutte'),
    ('la ricezione ferma alla prima pagina', ['C-12:ricezione'],
     [('    if (!esito.continua) return risposta.codice === 200;', '    return risposta.codice === 200;')],
     'si ricevono tutte'),
    ('il cursore spostato dalla conferma di un invio', ['C-12:ricezione'],
     [('      esito = E.dopoInvio(s.coda, lotto, risposta, s.righe);\n      return { coda: esito.coda,',
       '      esito = E.dopoInvio(s.coda, lotto, risposta, s.righe);\n      return { coda: { ...esito.coda, cursore: Math.max(esito.coda.cursore, (risposta.corpo && risposta.corpo.ultima_seq) || 0) },')],
     'l\'invio non sposta il cursore'),
    ('un 413 senza il messaggio del server', ['C-12:413'],
     [('    S.erroreInvio = risposta.codice === 200 ? null : (risposta.corpo && risposta.corpo.messaggio) || null;', '    S.erroreInvio = null;')],
     'un 413 si legge'),
    # C-13, l'azzeramento
    ('l\'azzeramento risolto senza chiedere', ['C-13:invio'],
     [('function mostraConflitto(c) {\n  S.sospeso = c;', 'function mostraConflitto(c) {\n  S.sospeso = c; return risolvi();')],
     'scoperto inviando'),
    ('le risposte di prima rimandate con la generazione nuova', ['C-13:invio'],
     [('  await tx((s) => ({ svuota: true, coda: E.risolviConflitto(s.coda, c), trasf: null }));',
       '  await tx((s) => ({ coda: { ...E.risolviConflitto(s.coda, c), daInviare: s.coda.daInviare }, trasf: null }));')],
     'la copia si svuota'),
    ('scartare senza confermare la perdita', ['C-13:invio'],
     [("  if (k === 'scarta') return pannello(", "  if (k === 'scarta') return risolvi(); if (false) pannello(")],
     'scartare chiede di confermare'),
    ('la scelta rimandata senza una strada per tornarci', ['C-13:ricezione'],
     [("    $('conto-stato').innerHTML = 'I progressi sono stati azzerati da un altro dispositivo: scegli che cosa fare delle risposte di qui. <button data-conflitto=\"riapri\">Scegli adesso</button>';\n", '')],
     'resta raggiungibile'),
    ('la risposta data dopo «Decidi più tardi» non contata', ['C-13:ricezione'],
     [('  S.sospeso = { ...S.sospeso, nonSalvate: righe.filter((r) => inCoda.has(String(r.uid))).length };', '  S.sospeso = { ...S.sospeso };')],
     'conta la risposta data intanto'),
    # C-14, il ripristino
    ('l\'epoca nuova vista, e le righe perse non rimesse in coda', ['C-14'],
     [('      esito = E.dopoRicezione(s.coda, risposta, s.righe);\n      return { nuove: esito.righe, coda: esito.coda,',
       '      esito = E.dopoRicezione(s.coda, risposta, s.righe);\n      return { nuove: esito.righe, coda: esito.epocaCambiata ? { ...esito.coda, daInviare: s.coda.daInviare } : esito.coda,')],
     'rimanda la risposta persa'),
    # C-15, il resto
    ('un 401 all\'uscita preso per la rete che manca', ['C-15:scaduta'],
     [('      if (r.codice !== 204 && r.codice !== 401) {', '      if (r.codice !== 204) {')],
     'un 401 all\'uscita'),
    ('con la sessione revocata le risposte buttate senza scaricarle', ['C-15:scaduta'],
     [("  if (c === 'scarica-pendenti') return scaricaPendenti();", "  if (c === 'scarica-pendenti') return chiudiAccesso(S.conto.chiave, S.uscitaTutti);")],
     'la risposta non inviata si scarica'),
    ('«Esci da tutti i dispositivi» che chiude solo qui', ['C-15:ovunque'],
     [("      const r = await api('POST', tutti ? '/v1/uscita/ovunque' : '/v1/uscita');", "      const r = await api('POST', '/v1/uscita');")],
     'chiude ogni sessione'),
    ('un 401 all\'apertura che cancella la copia', ['C-15:ovunque'],
     [("    $('conto-stato').textContent = 'L\\'accesso non è più valido. Entra di nuovo per inviare le risposte rimaste in questo dispositivo.';",
       "    $('conto-stato').textContent = 'L\\'accesso non è più valido. Entra di nuovo per inviare le risposte rimaste in questo dispositivo.';\n    for (const n of nomi) indexedDB.deleteDatabase(n);")],
     'la sua copia resta'),
    # C-16, la data
    ('la data proposta con oggi', ['C-16:salto'],
     [('<input type="date" name="data" value="${esc(S.esame)}">', '<input type="date" name="data" value="${esc(S.esame || oggi())}">')],
     'nessuna data inventata'),
    ('la data salvata prima del clic', ['C-16:proposta'],
     [('function onboarding() {\n', "function onboarding() {\n  if (S.esame) api('PUT', '/v1/profilo', { data_esame: S.esame });\n")],
     'non si salva prima del clic'),
    ('una data passata sostituita con oggi', ['C-16:proposta'],
     [("  const r = await api('PUT', '/v1/profilo', { data_esame: v || null });", "  const r = await api('PUT', '/v1/profilo', { data_esame: v && v < oggi() ? oggi() : v || null });")],
     'anche passata'),
    ('un salvataggio fallito detto riuscito', ['C-16:fallito'],
     [('  if (r.codice === 200) {\n    S.conto.data = r.corpo.data_esame;', '  if (true) {\n    S.conto.data = r.corpo && r.corpo.data_esame;')],
     'un salvataggio della data fallito'),
    ('l\'accesso ripete il passo della data', ['C-16:accesso'],
     [('  if (!S.righe.length) { chiudiPannello(); return catena(); }', '  if (!S.righe.length) { onboarding(); return catena(); }')],
     'il passo non si ripete'),
    ('l\'accesso toglie la data del server', ['C-16:accesso'],
     [("  if (io.data_esame !== undefined) $('esame-data').value = io.data_esame || '';", "  api('PUT', '/v1/profilo', { data_esame: S.esame || null });")],
     'la data resta'),
    # C-17, l'export e le origini senza API
    ('l\'export fatto dalla copia locale', ['C-17:export'],
     [("  const r = await api('GET', '/v1/esporta');", "  const r = { codice: 200, corpo: { app: 'rotta-giusta', righe: (await tx(() => null)).righe } };")],
     'l\'export del server'),
    ('le risposte da inviare taciute', ['C-17:export'],
     [('  const n = coda.daInviare.length;\n  e.innerHTML = n ?', '  const n = 0;\n  e.innerHTML = n ?')],
     'quante risposte da inviare'),
    ('un\'API anche fuori dagli indirizzi previsti', ['C-17:origine'],
     [('  return null;\n}\nconst API = indirizzoApi(location);', "  return 'http://localhost:8620';\n}\nconst API = indirizzoApi(location);")],
     'non offre «Accedi»'),
    ('l\'invito a un account che su quell\'origine non puo\' esistere', ['C-17:origine'],
     [("  const invito = S.conto ? '' : !API ? ", "  const invito = S.conto ? '' : false ? ")],
     'nel riepilogo nessun modulo'),
    # Le tre scelte che nessun gruppo premeva (P-46, R-ACC-63)
    ('il file del conflitto senza le risposte non salvate', ['C-13:scarica'],
     [("{ app: 'rotta-giusta', recupero: true, righe: await pendenti() });\n  // Avviare il download non prova",
       "{ app: 'rotta-giusta', recupero: true, righe: [] });\n  // Avviare il download non prova")],
     'il file porta le risposte non salvate'),
    ('si passa al nuovo archivio appena avviato il download', ['C-13:scarica'],
     [('  // Avviare il download non prova che il file sia al sicuro: si chiede (§10).\n  pannello(`<h2>Progressi azzerati</h2><p>Il file con le',
       '  return risolvi();\n  pannello(`<h2>Progressi azzerati</h2><p>Il file con le')],
     'dopo il download si chiede di confermare'),
    ('«Carica il nuovo archivio» che non guarda la casella', ['C-13:scarica'],
     [("    if ($('account').querySelector('[name=conservato]').checked) return risolvi();", '    return risolvi();')],
     'senza la conferma «Carica il nuovo archivio»'),
    ('le risposte del file rimandate dopo la conferma', ['C-13:scarica'],
     [('  await tx((s) => ({ svuota: true, coda: E.risolviConflitto(s.coda, c), trasf: null }));',
       '  await tx((s) => ({ coda: { ...E.risolviConflitto(s.coda, c), daInviare: s.coda.daInviare }, trasf: null }));')],
     'le risposte del file non rientrano'),
    ('le risposte cancellate al primo clic, senza conferma', ['C-08:cancella'],
     [("  if (a === 'cancella-righe') {\n", "  if (a === 'cancella-righe') {\n    return cancellaRighe();\n")],
     'chiede una conferma esplicita'),
    ('la conferma della cancellazione che non guarda la casella', ['C-08:cancella'],
     [("    if ($('account').querySelector('[name=conferma]').checked) return cancellaRighe();", '    return cancellaRighe();')],
     'senza la spunta la cancellazione non parte'),
    ('la cancellazione senza la password appena scelta', ['C-08:cancella'],
     [("  const r = await api('POST', '/v1/azzera', { password: S.pwNuova });", "  const r = await api('POST', '/v1/azzera', { password: '' });")],
     'le risposte spariscono dal server'),
    ('la copia che non segue la cancellazione', ['C-08:cancella'],
     [('  await tx(() => ({ svuota: true, coda: E.nuovaCoda({ generazione: io.corpo.generazione,',
       '  await tx(() => ({ coda: E.nuovaCoda({ generazione: io.corpo.generazione,')],
     'la copia di questo dispositivo le segue'),
    ('la coda con la generazione di prima della cancellazione', ['C-08:cancella'],
     [('coda: E.nuovaCoda({ generazione: io.corpo.generazione, epocaDb: io.corpo.epoca }), trasf: null }));',
       'coda: E.nuovaCoda({ generazione: io.corpo.generazione - 1, epocaDb: io.corpo.epoca }), trasf: null }));')],
     'una risposta nuova entra'),
    # R-ACC-66 (P-49): i due pulsanti di conferma premuti senza la casella. Le
    # rotture che non guardano la casella stanno qui sopra (P-46); queste
    # tengono ferma la parola: il silenzio di prima di P-48, il messaggio in un
    # elemento che non c'e' o nascosto, una frase che non dice che cosa manca, e
    # l'azione fatta lo stesso, con il messaggio giusto accanto.
    ('«Carica il nuovo archivio» senza la spunta, in silenzio', ['C-13:scarica'],
     [("    $('account-esito').textContent = 'Spunta «Ho conservato il file» prima di caricare il nuovo archivio.';\n    return;",
       '    return;')],
     'dice che manca «Ho conservato il file»'),
    ('il messaggio di «Carica il nuovo archivio» in un elemento che non c\'e\'', ['C-13:scarica'],
     [("    $('account-esito').textContent = 'Spunta «Ho conservato il file»",
       "    ($('account-esito-assente') || {}).textContent = 'Spunta «Ho conservato il file»")],
     'dice che manca «Ho conservato il file»'),
    ('il messaggio di «Carica il nuovo archivio» nascosto', ['C-13:scarica'],
     [('Ho conservato il file</label><p id="account-esito" role="status"></p>',
       'Ho conservato il file</label><p id="account-esito" role="status" hidden></p>')],
     'dice che manca «Ho conservato il file»'),
    ('il messaggio di «Carica il nuovo archivio» fuori dalla finestra', ['C-13:scarica'],
     [("    $('account-esito').textContent = 'Spunta «Ho conservato il file» prima di caricare il nuovo archivio.';",
       "    document.body.insertAdjacentHTML('beforeend', '<p>Spunta «Ho conservato il file» prima di caricare il nuovo archivio.</p>');")],
     'dice che manca «Ho conservato il file»'),
    ('il messaggio di «Carica il nuovo archivio» che non dice che cosa manca', ['C-13:scarica'],
     [("'Spunta «Ho conservato il file» prima di caricare il nuovo archivio.'", "'Conferma la scelta prima di continuare.'")],
     'dice che manca «Ho conservato il file»'),
    ('«Carica il nuovo archivio» senza la spunta lo dice, e carica lo stesso', ['C-13:scarica'],
     [("prima di caricare il nuovo archivio.';\n    return;", "prima di caricare il nuovo archivio.';\n    return risolvi();")],
     'non sostituisce la copia'),
    ('«Cancella queste risposte» senza la spunta, in silenzio', ['C-08:cancella'],
     [("    $('account-esito').textContent = 'Spunta «Confermo la cancellazione» prima di cancellare.';\n    return;",
       '    return;')],
     'dice che manca «Confermo la cancellazione»'),
    ('il messaggio di «Cancella queste risposte» in un elemento che non c\'e\'', ['C-08:cancella'],
     [("    $('account-esito').textContent = 'Spunta «Confermo la cancellazione»",
       "    ($('account-esito-assente') || {}).textContent = 'Spunta «Confermo la cancellazione»")],
     'dice che manca «Confermo la cancellazione»'),
    ('il messaggio di «Cancella queste risposte» invisibile', ['C-08:cancella'],
     [('Confermo la cancellazione</label><p id="account-esito" role="status"></p>',
       'Confermo la cancellazione</label><p id="account-esito" role="status" style="visibility:hidden"></p>')],
     'dice che manca «Confermo la cancellazione»'),
    ('il messaggio di «Cancella queste risposte» che non dice che cosa manca', ['C-08:cancella'],
     [("'Spunta «Confermo la cancellazione» prima di cancellare.'", "'Conferma la scelta prima di continuare.'")],
     'dice che manca «Confermo la cancellazione»'),
    ('«Cancella queste risposte» senza la spunta lo dice, e cancella lo stesso', ['C-08:cancella'],
     [("prima di cancellare.';\n    return;", "prima di cancellare.';\n    return cancellaRighe();")],
     'la cancellazione non parte'),
    ('l\'uscita che non guarda i punteggi dei Segnali', ['C-15:segnali'],
     [('  const segnali = !!(seg && seg.daInviare);', '  const segnali = false;')],
     'non si esce, e lo si dice'),
    ('il file di recupero senza i punteggi dei Segnali', ['C-15:segnali'],
     [('segPunti: seg && seg.daInviare ? seg.punti : {} });', 'segPunti: {} });')],
     'porta anche i punteggi'),
    ('«Riprova l\'invio» che esce senza mandare i punteggi', ['C-15:segnali-rete'],
     [("  if (c === 'riprova-uscita') return esci(S.uscitaTutti);", "  if (c === 'riprova-uscita') return chiudiAccesso(S.conto.chiave, S.uscitaTutti);")],
     'manda i punteggi, poi esce'),
    ('«Riprova l\'invio» che non riprova i punteggi', ['C-15:segnali-rete'],
     [('  // Anche i punteggi dei Segnali: uscire con punteggi che il server non ha li perderebbe (§8, P-46).\n  await punteggiInSospeso();\n',
       '  // Anche i punteggi dei Segnali: uscire con punteggi che il server non ha li perderebbe (§8, P-46).\n')],
     'manda i punteggi, poi esce'),
    # C-19: la bozza del carteggio (P-34, §9.4 del progetto del client)
    ('la bozza scritta anche senza account', ['C-19:senza'],
     [("  if (!P || !P.b) { dipingiBozza(); return; }",
       "  if (!P || !P.b) { dipingiBozza(); if (P) localStorage.setItem('rg-bozza', JSON.stringify(P.risp)); return; }")],
     'localStorage: rg-bozza'),
    ('senza account l\'avviso di P-36 non si vede', ['C-19:senza'],
     [("$('c-memoria').hidden = !(P && !P.b && conTesto);", "$('c-memoria').hidden = true;")],
     'non si vede con il testo scritto'),
    ('nessun lavoro offerto dopo la ricarica', ['C-19:ricarica'],
     [("  await offriBozze();\n}", "}")],
     'il testo scritto e\' perso'),
    ('la ripresa da\' sessanta minuti nuovi', ['C-19:ricarica'],
     [("inizio: x.inizio, scadenza: x.scadenza,", "inizio: x.inizio, scadenza: Date.now() + 3600000,")],
     'mai 60 minuti nuovi'),
    ('la bozza scritta fra le righe', ['C-19:ricarica'],
     [("try { t = S.db.transaction('meta', 'readwrite'); } catch (e) { return ko(e); }\n    const meta",
       "try { t = S.db.transaction(['meta', 'righe'], 'readwrite'); } catch (e) { return ko(e); }\n    const meta"),
      ("      meta.put(scritta, k);", "      meta.put(scritta, k); t.objectStore('righe').put({ ...scritta, uid: scritta.id });")],
     'righe nella copia'),
    ('«salvato» prima della conferma', ['C-19:guasto'],
     [("      meta.put(scritta, k);", "      meta.put(scritta, k); ok(scritta);")],
     'si vede ancora'),
    ('la scadenza ignorata alla ripresa', ['C-19:scadenza'],
     [("  const r = E.riprendiBozza(b, Date.now());", "  const r = { bozza: b, scaduta: false };")],
     'riaperta non mostra'),
    ('il giudizio rinviato scritto come riga', ['C-19:giudizio'],
     [("  correzioneCart(P.scaduta);\n  scriviBozza();",
       "  correzioneCart(P.scaduta);\n  scriviBozza();\n  tx(() => ({ nuove: [{ _t: 'c', uid: P.id + ':' + k, item_id: P.lista[k].id, ts: E.isoLocale(), verdict: P.esiti[k], delta: null, mode: 'simulazione', sim_uid: P.id }] }));")],
     'il giudizio rinviato e\' diventato una riga'),
    ('la conclusione non toglie la bozza', ['C-19:giudizio'],
     [("      meta.delete(chiaveBozza(id));\n", "")],
     'compare ancora'),
    ('«Esci» cancella il lavoro senza chiedere', ['C-19:uscita'],
     [("  if (!S.scartaBozze) {\n    let bozze = null;", "  if (false) {\n    let bozze = null;"),
      ("      if (!scarta) {\n        const n", "      if (false) {\n        const n")],
     'non compare'),
    ('lo scarto senza conferma', ['C-19:uscita'],
     [("if (bz === 'scarta') { $('bozza-conferma').hidden = false; return; }", "if (bz === 'scarta') return scartaBozza();")],
     'non chiede'),
    ('il runner dell\'altra scheda non si ferma', ['C-19:schede'],
     [("  if (S.cprova && S.cprova.b) chiudiCart();\n", "")],
     'ancora aperto'),
    ('la scheda ferma ricrea la copia', ['C-19:schede'],
     [("  if (S.cprova && S.cprova.b) chiudiCart();\n", ""),
      ("return ko(new Error('accesso cambiato'));\n    let t;",
       "return (() => { const q = indexedDB.open(nomeDb(B.chiave), 1); q.onupgradeneeded = () => { q.result.createObjectStore('righe', { keyPath: 'uid' }); q.result.createObjectStore('meta'); }; q.onsuccess = () => { const t = q.result.transaction('meta', 'readwrite'); t.objectStore('meta').put(proposta, chiaveBozza(proposta.id)); t.oncomplete = () => ok(proposta); }; })();\n    let t;")],
     'ricreato una copia'),
    ('l\'uscita conta solo il lavoro di questa scheda', ['C-19:schede'],
     [("    try { bozze = await bozzeNellaCopia(S.db); } catch {}\n    const quiInAttesa", "    bozze = [];\n    const quiInAttesa"),
      ("        const n = await contaBozzeChiuse(chiave);", "        const n = 0;")],
     'non compare nella scheda che esce'),
]

# Varianti della pagina di riferimento che devono restare **verdi**: il banco
# contro i propri rossi falsi, come le rotture lo provano contro i verdi falsi.
# (che cosa, gruppi, sostituzioni). La pagina di riferimento pesca a caso, e
# fino al 29 settembre 2026 un quesito dal testo corto dava un rosso che non
# c'era nello 0,5 % degli avvii (P-38, §12 del progetto del client): qui la
# pesca comincia sempre dal testo piu' corto della banca, «I flaps:».
VARIANTI_CLIENT = [
    ('il primo quesito e\' il piu\' corto della banca', ['C-01'],
     [('E.estrai(S.banca, {}, E.isoLocale().slice(0, 10), 10, Date.now() % 997)',
       'S.banca.slice().sort((a, b) => a.d.trim().length - b.d.trim().length).slice(0, 10)')]),
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
    prove = [{'nome': 'app', 'pagina': app, 'gruppi': GRUPPI_CLIENT + gruppi_bozza_app() + GRUPPI_RIFINITURA},
             {'nome': 'riferimento', 'pagina': rif, 'gruppi': GRUPPI_CLIENT + ['C-19'] + GRUPPI_RIFINITURA}]
    applicate = {}
    for cosa, gruppi, sostituzioni in VARIANTI_CLIENT:
        variante, ok = rif, True
        for vecchio, nuovo in sostituzioni:
            ok = ok and vecchio in variante
            variante = variante.replace(vecchio, nuovo, 1)
        applicate['variante: ' + cosa] = ok
        if ok:
            prove.append({'nome': 'variante: ' + cosa, 'pagina': variante, 'gruppi': gruppi})
    for cosa, gruppi, sostituzioni, _ in ROTTURE_CLIENT + ROTTURE_RIFINITURA:
        rotta, ok = rif, True
        for vecchio, nuovo in sostituzioni:
            ok = ok and vecchio in rotta
            rotta = rotta.replace(vecchio, nuovo, 1)
        applicate[cosa] = ok
        if ok and rotta != rif:
            prove.append({'nome': 'rottura: ' + cosa, 'pagina': rotta, 'gruppi': gruppi})
    try:
        p = subprocess.run(['node', str(BANCO_CLIENT)], input=json.dumps({'prove': prove}),
                           capture_output=True, text=True, timeout=600)
        out = json.loads(p.stdout) if p.returncode == 0 else None
    except (OSError, ValueError, subprocess.TimeoutExpired) as e:
        out, errore = None, str(e)
    else:
        # Un banco caduto deve dire perche': l'avviso sperimentale di node:sqlite
        # riempiva da solo le ultime righe, e il rosso non diceva niente (P-43).
        righe = [r for r in (p.stderr or '').splitlines() if 'ExperimentalWarning' not in r and '--trace-warnings' not in r]
        errore = 'uscito con %s: %s' % (p.returncode, '\n'.join(righe)[-1200:] or 'nessun messaggio')
    if out is None:
        out = {x['nome']: [{'gruppo': 'banco', 'nome': 'il banco del browser parte', 'ok': False, 'extra': errore}]
               for x in prove}
    _BANCO_CLIENT = (prove, out, applicate)
    return _BANCO_CLIENT


def registra_client(gruppo):
    _, out, _ = banco_client()
    v = out.get('app', [])
    for x in v:
        if x['gruppo'] in (gruppo, 'banco'):
            check('client %s: %s' % (x['gruppo'], x['nome']), x['ok'], x.get('extra', ''))
    # Fino a P-40 bastava una verifica: nel regime senza client i gruppi ne
    # facevano una sola. Ora la pagina vera fa il giro intero, e un giro fermato
    # a meta' e' un verde a copertura parziale, come sulla pagina di riferimento.
    n = sum(1 for x in v if x['gruppo'] == gruppo)
    check('client %s: il giro sulla pagina vera e\' arrivato in fondo' % gruppo, n >= VERIFICHE_CLIENT[gruppo],
          'troppo poche verifiche (%d su %d): il banco non l\'ha eseguito per intero' % (n, VERIFICHE_CLIENT[gruppo]))


def test_client_nella_pagina():
    """R-ACC-42: la pagina vera ha il client. Senza indirizzoApi() e' la pagina
    di prima di P-18, e da P-40 e' rossa: qui, con il nome del difetto, e in
    ogni gruppo del banco, che la guida come una pagina con il client."""
    check('client: la pagina dichiara indirizzoApi(), cioe\' ha il client degli account', ha_il_client(leggi('app.html')),
          'site/app.html non dichiara function indirizzoApi(: e\' la pagina senza account, che dal 30 settembre 2026 '
          'non passa (account-client-progetto §12, P-40)')
    # Provato al contrario sulla pagina di riferimento, senza browser: tolta la
    # dichiarazione, o lasciata solo in un commento, il segno non c'e'.
    rif = RIFERIMENTO_CLIENT.read_text(encoding='utf-8')
    check('client: la pagina di riferimento dichiara indirizzoApi()', ha_il_client(rif))
    senza = rif.replace('function indirizzoApi(', 'function indirizzoDellApi(', 1)
    check('client provato al contrario: senza indirizzoApi() la pagina non ha il client', not ha_il_client(senza))
    commentata = rif.replace('function indirizzoApi(', '// function indirizzoApi(', 1)
    check('client provato al contrario: indirizzoApi() in un commento non basta', not ha_il_client(commentata))


def test_client_primo_ingresso():
    registra_client('C-01')


def test_client_senza_account():
    registra_client('C-02')


def test_client_email_registrata():
    registra_client('C-05')


def test_client_invito_e_viste():
    registra_client('C-03')


def test_client_tutte_le_attivita():
    """R-ACC-04: senza account ogni attivita' arriva al suo punto d'arrivo (C-01,
    registrato da test_client_primo_ingresso), e Progressi non costruisce un
    cruscotto dallo storico temporaneo (C-03). Qui si pretende che le une e
    l'altro ci siano, non si contano due volte."""
    prove, out, _ = banco_client()
    v = out.get('app', [])
    for a in ATTIVITA_CLIENT:
        fatte = [x for x in v if x['gruppo'] == 'C-01' and x['nome'].startswith(a)]
        check('client: l\'attivita\' «%s» guidata senza account' % a.rstrip(': '), bool(fatte) and all(x['ok'] for x in fatte),
              'nessuna verifica' if not fatte else '; '.join(x['nome'] for x in fatte if not x['ok']))
    porta = [x for x in v if x['gruppo'] == 'C-03' and 'Progressi dice perche\'' in x['nome']]
    check('client: senza account Progressi non e\' un cruscotto', bool(porta) and all(x['ok'] for x in porta),
          'la verifica di C-03 su Progressi manca o e\' rossa')


def test_client_registrazione():
    registra_client('C-04')


def test_client_dispositivo_condiviso():
    registra_client('C-06')


def test_client_coda():
    registra_client('C-11')


def test_client_uscita():
    registra_client('C-15')


def test_client_verifica():
    registra_client('C-07')


def test_client_password():
    registra_client('C-08')


def test_client_vecchio_archivio():
    registra_client('C-09')


def test_client_file():
    registra_client('C-10')


def test_client_limiti():
    registra_client('C-12')


def test_client_azzeramento():
    registra_client('C-13')


def test_client_scarica_dopo_azzeramento():
    """R-ACC-63: «Scarica e passa al nuovo archivio» (C-13:scarica, P-46)."""
    registra_client('C-13:scarica')


def test_client_cancella_dopo_recupero():
    """R-ACC-63: «Cancella queste risposte» dopo il recupero (C-08:cancella, P-46)."""
    registra_client('C-08:cancella')


def test_client_conferma_mancante():
    """R-ACC-66 (P-49): i due pulsanti di conferma premuti senza la loro casella
    dicono che cosa manca, nella finestra e in quello che si vede, e non
    cambiano ne' la copia ne' il server. Le verifiche stanno in C-13:scarica e
    in C-08:cancella, che le registrano con il resto; qui si pretende che sulla
    pagina vera ci siano e siano verdi, perche' un giro fermato prima le
    salterebbe. Che cosa il banco non vede: §12 del progetto del client, «Le
    tre scelte»."""
    _, out, _ = banco_client()
    v = out.get('app', [])
    for parte, pulsante, casella in (('C-13:scarica', 'Carica il nuovo archivio', 'Ho conservato il file'),
                                     ('C-08:cancella', 'Cancella queste risposte', 'Confermo la cancellazione')):
        xs = [x for x in v if x['gruppo'] == parte and ('dice che manca «%s»' % casella) in x['nome']]
        check('client R-ACC-66: «%s» senza la spunta dice che manca «%s»' % (pulsante, casella),
              bool(xs) and all(x['ok'] for x in xs),
              xs[0].get('extra', '') if xs else 'la verifica non e\' stata eseguita: il giro di %s si e\' fermato prima' % parte)


def test_client_uscita_segnali():
    """R-ACC-63: l'uscita con punteggi dei Segnali non accolti (C-15:segnali, P-46)."""
    registra_client('C-15:segnali')


def test_client_bozza_senza_account():
    """R-BOZZA-05: senza account il testo del carteggio non si scrive da nessuna
    parte, la pagina dice che resta solo finche' e' aperta, e dopo una ricarica
    non c'e' niente da riprendere (C-19:senza). Vero sulla pagina di oggi."""
    registra_client('C-19:senza')


def test_client_bozza():
    """R-BOZZA-06: con l'account il testo del carteggio e' una bozza che regge
    ricarica, scadenza, guasto, giudizio rinviato, uscita e cambio d'account fra
    schede (C-19). La pagina vera ha la bozza da P-21, e senza dichiarazioni il
    gruppo gira intero. Fino ad allora era un difetto aperto, dichiarato in
    docs/eccezioni-interfaccia.md: il ramo sotto resta per una dichiarazione
    futura, e pretende che la verifica che lo dimostra giri, con i passi prima
    verdi, e sia rossa — e che diventi rossa la dichiarazione il giorno che non
    serve piu'."""
    dichiarati = difetti_dichiarati()
    check('client C-19: la tabella dei difetti aperti si legge', dichiarati is not None,
          'manca «Difetti aperti dichiarati» in docs/eccezioni-interfaccia.md')
    dichiarati = [(p, x) for p, x in (dichiarati or []) if p.startswith('C-19:')]
    if not dichiarati:
        for parte in PARTI_BOZZA[1:]:
            registra_client(parte)
        return
    _, out, _ = banco_client()
    v = out.get('app', [])
    for x in v:
        if x['gruppo'] == 'banco':
            check('client banco: %s' % x['nome'], x['ok'], x.get('extra', ''))
    for parte, verifica in dichiarati:
        for nome, ok, extra in esame_difetto(v, parte, verifica):
            check('client %s: %s' % (parte, nome), ok, extra)
    # Provato al contrario, sui risultati che il banco ha gia': sulla pagina di
    # riferimento, che ha la bozza, la dichiarazione mente e deve essere rossa;
    # sulla rottura che toglie l'offerta dopo la ricarica deve reggere.
    rif = out.get('riferimento', [])
    senza_offerta = out.get('rottura: nessun lavoro offerto dopo la ricarica', [])
    for parte, verifica in dichiarati:
        e = esame_difetto(rif, parte, verifica)
        check('C-19 provato al contrario: sulla pagina di riferimento la dichiarazione «%s» non regge' % verifica,
              bool(e) and not all(ok for _, ok, _ in e), 'passata verde: la dichiarazione non si accorgerebbe di un difetto chiuso')
        e = esame_difetto(senza_offerta, parte, verifica)
        check('C-19 provato al contrario: con l\'offerta tolta la dichiarazione «%s» regge' % verifica,
              bool(e) and all(ok for _, ok, _ in e), '; '.join(x for _, ok, x in e if not ok) or 'nessuna verifica')


def esame_difetto(v, parte, verifica):
    """Che cosa pretende un difetto dichiarato dai risultati di una pagina:
    [(nome, ok, extra)]. La verifica c'e', i passi prima sono verdi, e lei e'
    rossa: il difetto e' ancora vero, e misurato per il motivo giusto."""
    vp = [x for x in v if x['gruppo'] == parte]
    nomi = [x['nome'] for x in vp]
    if verifica not in nomi:
        return [('la verifica dichiarata «%s» e\' una verifica del banco' % verifica, False,
                 'il banco non l\'ha eseguita: o si e\' fermato prima, o la dichiarazione nomina una verifica che non esiste. '
                 'Eseguite: ' + ('; '.join(nomi[:4]) or 'nessuna'))]
    i = nomi.index(verifica)
    prima = [x for x in vp[:i] if not x['ok']]
    return [('prima del difetto dichiarato i passi sono verdi', not prima,
             'rosso per un altro motivo: ' + '; '.join('%s — %s' % (x['nome'], x.get('extra', '')) for x in prima[:2])),
            ('il difetto dichiarato e\' ancora vero sulla pagina («%s»)' % verifica, not vp[i]['ok'],
             'la verifica e\' verde: il difetto e\' chiuso. Togli la riga da «Difetti aperti dichiarati» in '
             'docs/eccezioni-interfaccia.md nello stesso commit, e il banco esegue C-19 per intero sulla pagina vera')]


def test_client_ripristino():
    registra_client('C-14')


def test_client_data():
    registra_client('C-16')


def test_client_export():
    registra_client('C-17')


# --- C-18: i testi della versione con gli account (§11.2 del progetto del client) --
#
# Non serve un browser: sono frasi nei file di site/. Le false vengono dal §1 di
# docs/prossime-sessioni.md, cercate con grep il 25 settembre 2026 e ricontate
# il 29 da P-43; le nuove dal §11.2 del progetto del client. Vere senza account,
# false con il client: si cambiano **nella stessa versione** (specifica §2). Fino
# a P-18 i regimi erano due, come per C-01…C-17; da P-40 la pagina ha il client,
# e i testi sono quelli suoi: nessuna delle frasi vecchie, commenti compresi, e
# tutte le nuove.
#
# Non vede: se l'informativa e' giusta. Il suo gate e' dell'autore (§4 della
# coda); qui si pretende solo che non dica piu' quello che e' diventato falso e
# che nomini il contatto del titolare.
FRASI_FALSE = [
    ('index.html', 'tutto nel tuo browser'),
    ('index.html', 'Le risposte restano nel tuo browser'),
    ('index.html', 'Nessun account, nessun cookie'),
    ('app.html', 'Tutto nel tuo browser, nessun account'),
    ('app.html', 'I progressi restano in questo browser'),
    ('app.html', 'non esiste un account'),
    ('app.html', 'Le risposte restano in questo browser'),
    ('app.html', "Non c'e' un server"),
    ('privacy.html', 'restano nel tuo browser'),
    ('privacy.html', 'non esiste un server che li riceva'),
    ('privacy.html', 'Nessun dato personale viene trattato'),
]
# (file, frase, quante volte almeno): «Come funziona» ha due copie (§11.2).
FRASI_NUOVE = [
    ('index.html', 'Prova quiz e carteggio senza account; crea un account per salvare i progressi.', 1),
    ('app.html', 'Prova quiz e carteggio senza account; crea un account per salvare i progressi.', 1),
    ('index.html', 'Prova senza account', 1),
    ('index.html', 'Tutte le attività sono disponibili. Senza account non conserviamo risposte o preferenze.', 1),
    ('index.html', 'Nessuna newsletter e nessun cookie di tracciamento.', 1),
    ('app.html', 'Non serve un account per provare.', 2),
    ('privacy.html', 'privacy@rottagiusta.it', 1),
]


def difetti_dei_testi(testi):
    """I difetti dei testi di site/ nella versione con gli account: [(file, che cosa)]."""
    difetti = []
    for f, frase in FRASI_FALSE:
        if frase in testi[f]:
            difetti.append((f, 'dice ancora «%s»' % frase))
    for f, frase, n in FRASI_NUOVE:
        if testi[f].count(frase) < n:
            difetti.append((f, 'non dice «%s»%s' % (frase, ' in %d copie' % n if n > 1 else '')))
    return difetti


def test_client_testi():
    """R-ACC-57 (C-18): i testi pubblici sono quelli della versione con gli account."""
    testi = {f: leggi(f) for f in ('index.html', 'app.html', 'privacy.html')}
    difetti = difetti_dei_testi(testi)
    check('client C-18: i testi di site/ sono quelli della versione con gli account', not difetti,
          '; '.join('%s %s' % d for d in difetti[:4]))
    # Provato al contrario, sui testi veri: ogni frase falsa rimessa in una
    # pagina si vede, e ogni frase nuova tolta anche. Cosi' il verde non e' a
    # copertura zero.
    for f, frase in FRASI_FALSE:
        d = difetti_dei_testi({**testi, f: testi[f] + '\n' + frase})
        check('C-18 provato al contrario: «%s» rimessa in %s si vede' % (frase, f), any(frase in x[1] for x in d), 'passata verde')
    for f, frase, _ in FRASI_NUOVE:
        d = difetti_dei_testi({**testi, f: testi[f].replace(frase, '')})
        check('C-18 provato al contrario: «%s» tolta da %s si vede' % (frase[:40], f), any(frase in x[1] for x in d), 'passata verde')


def test_client_provato_al_contrario():
    _, out, applicate = banco_client()
    v = out.get('riferimento', [])
    rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in v if not x['ok']]
    check('la pagina di riferimento del client passa il banco del browser', not rossi, '; '.join(rossi[:3]))
    for g in GRUPPI_CLIENT + SCELTE_CLIENT + PARTI_BOZZA:
        n = sum(1 for x in v if x['gruppo'] == g)
        check('il banco del browser ha eseguito %s sulla pagina di riferimento' % g,
              n >= VERIFICHE_CLIENT[g], 'troppo poche verifiche: il giro non e\' arrivato in fondo (%d su %d)' % (n, VERIFICHE_CLIENT[g]))
    for cosa, gruppi, _ in VARIANTI_CLIENT:
        check('variante del client «%s»: si applica alla pagina di riferimento' % cosa, applicate.get('variante: ' + cosa),
              'il testo da sostituire non c\'e\' piu\': la variante non proverebbe niente')
        vv = out.get('variante: ' + cosa, [])
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vv if not x['ok']]
        check('variante del client «%s»: il banco resta verde' % cosa, bool(vv) and not rossi,
              '; '.join(rossi[:3]) or 'nessuna verifica eseguita')
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


# --- 5-bis. l'area 6: la rifinitura trasversale (P-45) ---------------------------------
#
# docs/area-6-progetto.md §10.1 chiede controlli nei due regimi d'accesso — la
# prova senza account e l'account — su quello che il sorgente non dice: che cosa
# la pagina dice di conservare, se un numero viene dalla sua fonte, se un guasto
# resta segnalato, dove sta il fuoco, se un avviso si vede davvero, se la pagina
# sborda, il contrasto e i bersagli. Li esegue il banco del client, nello stesso
# Chrome e con lo stesso server (gruppi T-01…T-09 in tests/client_account.mjs);
# il contratto e' nel §10.1 del progetto.
#
# **Il passaggio all'area 6** non ha un raccordo da riconoscere, come le aree
# 2–5: le garanzie valgono per la pagina di oggi come per quella di P-25.
# Quello che la pagina di oggi non rispetta ancora — misurato, e sono difetti
# veri — sta fra i «Difetti aperti dichiarati» di docs/eccezioni-interfaccia.md,
# con la parte e la verifica: la suite pretende che la verifica giri e sia
# rossa, e diventa rossa lei il giorno che il difetto e' chiuso e la riga no.
# Alla merge di P-25 la tabella non deve avere piu' righe `T-*`: e' li' che si
# esige il regime nuovo, senza un segno da cercare nella pagina.
GRUPPI_RIFINITURA = ['T-01', 'T-02', 'T-03', 'T-04', 'T-05:finestra', 'T-05:arresti', 'T-06', 'T-07:prova', 'T-07:conto',
                     'T-08', 'T-09']
VERIFICHE_RIFINITURA = {'T-01': 9, 'T-02': 9, 'T-03': 11, 'T-04': 6, 'T-05:finestra': 5, 'T-05:arresti': 2, 'T-06': 3,
                        'T-07:prova': 5, 'T-07:conto': 3, 'T-08': 2, 'T-09': 2}

# Rotture della pagina di riferimento per l'area 6: (che cosa, parti da
# eseguire, sostituzioni, parola che il rosso deve contenere). Ognuna e' un
# modo in cui una pagina puo' sembrare a posto e non esserlo.
_STILE = 'a.da-solo, label {display:inline-block}'
_TEC = '<section class="view" id="v-tec">\n  <h1>Che tecnica serve?</h1>'
_PRIMA = '<p id="avviso-prova">'
_INFO = ("  const righe = S.conto && S.db ? (await tx(() => null)).righe : S.righe.concat(S.prova || []);\n"
         "  $('info-conta').textContent = `risposte ai quiz ${righe.filter((r) => r._t === 'q').length}`;")
ROTTURE_RIFINITURA = [
    # T-01: senza account nessuna frase dice che le risposte sono conservate
    ('senza account il riepilogo dice «Risposte salvate»', ['T-01'],
     [('<p>Hai risposto a ${u.esiti.length} su ${u.n}.', '<p>Risposte salvate: ${u.esiti.length}.</p><p>Hai risposto a ${u.esiti.length} su ${u.n}.')],
     'il riepilogo non dice'),
    ('senza account il Percorso dice che le risposte sono salvate su questo dispositivo', ['T-01'],
     [(_PRIMA + 'Senza account', _PRIMA + 'Le tue risposte sono salvate su questo dispositivo. Senza account')],
     'il Percorso non dice'),
    # T-02: con l'account, da inviare e non sul server; i numeri dalla coda
    ('lo stato dell\'invio non si ridipinge quando una risposta entra in coda', ['T-02'],
     [("  catch (e) { guasto(e); return; }\n  // Lo stato si ridipinge adesso: la risposta e' in coda, e finche' il server\n"
       "  // non l'ha nominata la pagina non dice che e' sul server (R-RIF-02).\n  await dipingiStato();\n",
       "  catch (e) { guasto(e); return; }\n")],
     'non dice che sono sul server'),
    ('«confermate sul server» senza guardare la coda', ['T-02'],
     [("coda.daInviare.length ? `${coda.daInviare.length} risposte da inviare.${guasto}` : 'Le risposte di questo dispositivo sono confermate sul server'",
       "'Le risposte di questo dispositivo sono confermate sul server'")],
     'non dice che sono sul server'),
    ('il numero da inviare conta le righe della copia, non la coda', ['T-02'],
     [('`${coda.daInviare.length} risposte da inviare.${guasto}`', '`${righe.length} risposte da inviare.${guasto}`')],
     'il numero da inviare'),
    # T-03: la scrittura fallita
    ('una scrittura riuscita spegne il segnale del guasto', ['T-03'],
     [("  catch (e) { guasto(e); return; }\n",
       "  catch (e) { guasto(e); return; }\n  S.guasto = null; $('info-segnale').hidden = true; $('guasto').hidden = true;\n")],
     'Info segnala ancora il guasto'),
    ('il guasto non arriva alla porta di Info', ['T-03'],
     [("  $('info-segnale').hidden = false;\n}", '}')],
     'la porta di Info segnala'),
    ('la scrittura fallita non si annuncia', ['T-03'],
     [('<p id="guasto" role="alert" hidden>', '<p id="guasto" hidden>'), ('<p data-save-warning role="alert" hidden>', '<p data-save-warning hidden>')],
     'si annuncia'),
    # T-04: dopo un 401, chi entra non vede le righe di prima
    ('dopo il 401 l\'accesso di B tiene la copia di A', ['T-04'],
     [('  if (S.conto) fermaQui();\n  await entra(r.corpo);', '  await entra(r.corpo);'),
      ('  S.db = await apriDb(S.conto.chiave);', '  S.db = S.db || await apriDb(S.conto.chiave);')],
     'nessuna di A'),
    ('Info conta da un contatore suo', ['T-04'],
     [(_INFO, "  $('info-conta').textContent = `risposte ai quiz ${S.date || 0}`;"),
      ('  const giusta = j === it.x;', '  const giusta = j === it.x;\n  S.date = (S.date || 0) + 1;')],
     'Info conta'),
    ('dopo il 401 la porta resta «Account»', ['T-04'],
     [("function scaduto() {\n  S.scaduto = true;\n  $('conto-porta').textContent = 'Accedi';", 'function scaduto() {\n  S.scaduto = true;')],
     'offre di nuovo «Accedi»'),
    # T-05: il fuoco
    ('la finestra non prende il fuoco', ['T-05:finestra'],
     [("h.tabIndex = -1; a.setAttribute('aria-labelledby', 'account-titolo'); h.focus(); }", "a.setAttribute('aria-labelledby', 'account-titolo'); }")],
     'prende il fuoco'),
    ('la finestra non ha un nome', ['T-05:finestra'],
     [("a.setAttribute('aria-labelledby', 'account-titolo'); h.focus();", 'h.focus();')],
     'con un nome'),
    ('Tab esce dalla finestra', ['T-05:finestra'],
     [("  if (e.key !== 'Tab') return;", '  return;')],
     'restano dentro'),
    ('chiusa la finestra, il fuoco non torna a chi l\'ha aperta', ['T-05:finestra'],
     [('  if (da && da.isConnected) da.focus();', '')],
     'torna ad «Accedi»'),
    ('un arresto di Tab senza indicatore', ['T-05:arresti'],
     [(_STILE, _STILE + '\nbutton:focus {outline:none}')],
     'indicatore'),
    ('un\'intestazione fissa copre il fuoco', ['T-05:arresti'],
     [('<body>\n<header>', '<body>\n<div style="position:fixed;top:0;left:0;right:0;height:150px;background:#fff"></div>\n<header>')],
     'coperto'),
    # T-06: un avviso nel DOM ma occultato
    ('l\'avviso e\' trasparente', ['T-06'], [(_PRIMA, '<p id="avviso-prova" style="opacity:0">')], 'trasparente'),
    ('l\'avviso e\' nascosto ai lettori di schermo', ['T-06'], [(_PRIMA, '<p id="avviso-prova" aria-hidden="true">')], 'ignora'),
    ('l\'avviso e\' fuori dallo schermo', ['T-06'], [(_PRIMA, '<p id="avviso-prova" style="position:absolute;left:-9999px">')], 'fuori dallo schermo'),
    ('l\'avviso ha il colore del fondo', ['T-06'], [(_PRIMA, '<p id="avviso-prova" style="color:#fff">')], 'contrasto'),
    ('l\'avviso e\' coperto', ['T-06'],
     [(_PRIMA, '<div style="position:absolute;top:0;left:0;right:0;height:900px;background:#fff"></div>' + _PRIMA)],
     'ha sopra'),
    # T-07: sbordi
    ('l\'intestazione sborda a 320 px', ['T-07:prova'], [('<header>', '<header style="min-width:340px">')], 'a 320 px'),
    ('una tabella sborda a 375 px', ['T-07:prova'],
     [(_TEC, _TEC + '\n  <table style="width:420px"><tr><td>Tecnica</td><td>Fatti</td></tr></table>')],
     'a 375 px nessuna vista'),
    # Le due qui sotto stanno in un contenitore piu' stretto di 320 px: niente
    # esce dallo schermo, e le prende solo il loro controllo (provato togliendolo).
    ('una tabella che scorre dentro il suo contenitore', ['T-07:prova'],
     [(_TEC, _TEC + '\n  <div style="overflow-x:auto;width:200px"><table style="width:300px"><tr><td>Tecnica</td><td>Fatti</td></tr></table></div>')],
     'scorre di lato al suo interno'),
    ('un testo tagliato da un contenitore', ['T-07:prova'],
     [('<h1>Il tuo percorso</h1>', '<div style="overflow:hidden;width:120px"><span style="white-space:nowrap">'
       'Il tuo percorso di studio</span></div><h1>Il tuo percorso</h1>')],
     'tagliato'),
    ('la pagina senza meta viewport', ['T-07:prova'],
     [('<meta name="viewport" content="width=device-width, initial-scale=1">', '')],
     'meta viewport'),
    ('con l\'account il pannello sborda', ['T-07:conto'],
     [('function pannelloConto() {\n  pannello(`<h2>Il tuo account</h2>',
       'function pannelloConto() {\n  pannello(`<h2 style="white-space:nowrap">Il tuo account, con le sue risposte e i suoi punteggi</h2>')],
     'il pannello dell\'account'),
    # T-08 e T-09
    ('un titolo grigio chiaro', ['T-08'], [(_STILE, _STILE + '\nh1 {color:#aaa}')], 'contrasto minimo'),
    ('un pulsante di 20 px', ['T-09'], [(_STILE, _STILE + '\n#c-start {min-height:0; height:20px}')], '24 × 24'),
    ('un pulsante di 36 px', ['T-09'], [(_STILE, _STILE + '\n#c-start {min-height:0; height:36px}')], '44 × 44'),
]


def dichiarati_rifinitura(parte=None):
    """[(parte, verifica)] dei difetti dichiarati dell'area 6, o di una parte sola."""
    return [(p, x) for p, x in (difetti_dichiarati() or []) if p.startswith('T-') and (parte is None or p == parte)]


def esame_rifinitura(v, parte):
    """[(nome, ok, extra)] di una parte sulla pagina vera: ogni verifica verde,
    tranne quelle dichiarate, che devono esserci ed essere rosse — il difetto
    ancora vero, misurato per il suo motivo."""
    dichiarate = [x for _, x in dichiarati_rifinitura(parte)]
    vp = [x for x in v if x['gruppo'] == parte]
    nomi = [x['nome'] for x in vp]
    out = []
    for d in dichiarate:
        if d not in nomi:
            out.append(('la verifica dichiarata «%s» e\' una verifica del banco' % d, False,
                        'il banco non l\'ha eseguita, o la dichiarazione nomina una verifica che non esiste. Eseguite: '
                        + ('; '.join(nomi[:4]) or 'nessuna')))
            continue
        x = vp[nomi.index(d)]
        out.append(('il difetto dichiarato e\' ancora vero sulla pagina («%s»)' % d, not x['ok'],
                    'la verifica e\' verde: il difetto e\' chiuso. Togli la riga da «Difetti aperti dichiarati» in '
                    'docs/eccezioni-interfaccia.md nello stesso commit'))
    for x in vp:
        if x['nome'] not in dichiarate:
            out.append((x['nome'], x['ok'], x.get('extra', '')))
    return out


def registra_rifinitura(parte):
    _, out, _ = banco_client()
    v = out.get('app', [])
    for x in v:
        if x['gruppo'] == 'banco':
            check('rifinitura banco: %s' % x['nome'], x['ok'], x.get('extra', ''))
    for nome, ok, extra in esame_rifinitura(v, parte):
        check('rifinitura %s: %s' % (parte, nome), ok, extra)
    n = sum(1 for x in v if x['gruppo'] == parte)
    check('rifinitura %s: il giro sulla pagina vera e\' arrivato in fondo' % parte, n >= VERIFICHE_RIFINITURA[parte],
          'troppo poche verifiche (%d su %d): il banco non l\'ha eseguito per intero' % (n, VERIFICHE_RIFINITURA[parte]))


def test_rifinitura_senza_account():
    """R-RIF-01 e R-RIF-03 senza account: nessuna frase di conservazione nella
    prova, e il numero di Info dalle risposte della pagina (T-01)."""
    registra_rifinitura('T-01')


def test_rifinitura_invio():
    """R-RIF-02 e R-RIF-03 con l'account: con la rete che tace o assente, da
    inviare e non sul server, e i numeri dalla coda e dalla copia (T-02)."""
    registra_rifinitura('T-02')


def test_rifinitura_guasto():
    """R-RIF-04: una scrittura fallita si vede, si annuncia, e Info non si spegne (T-03)."""
    registra_rifinitura('T-03')


def test_rifinitura_identita():
    """R-RIF-05: dopo un 401 chi entra non vede le righe di chi c'era (T-04)."""
    registra_rifinitura('T-04')


def test_rifinitura_finestra():
    """R-RIF-06: la finestra prende, tiene e rende il fuoco, ed e' esposta con un nome (T-05:finestra)."""
    registra_rifinitura('T-05:finestra')


def test_rifinitura_fuoco():
    """R-RIF-07: ogni arresto di Tab ha un indicatore, e non resta coperto (T-05:arresti)."""
    registra_rifinitura('T-05:arresti')


def test_rifinitura_avvisi():
    """R-RIF-08: un avviso si vede davvero e si legge, non solo nel DOM (T-06)."""
    registra_rifinitura('T-06')


def test_rifinitura_larghezze():
    """R-RIF-09: a 1280, 640, 375 e 320 px nessuna superficie sborda, nei due regimi (T-07)."""
    registra_rifinitura('T-07:prova')
    registra_rifinitura('T-07:conto')


def test_rifinitura_contrasto():
    """R-RIF-11: il contrasto di ogni testo che si vede, dai colori calcolati (T-08)."""
    registra_rifinitura('T-08')


def test_rifinitura_bersagli():
    """R-RIF-12: i bersagli di tocco, 24 px il minimo AA e 44 l'obiettivo (T-09)."""
    registra_rifinitura('T-09')


def test_rifinitura_provata_al_contrario():
    """Il banco dell'area 6 contro sé stesso: la pagina di riferimento passa
    ogni parte per intero, ogni rottura e' rossa per il suo motivo, e ogni
    difetto dichiarato della pagina vera nomina una verifica che la pagina di
    riferimento passa e che una rottura fa diventare rossa."""
    _, out, applicate = banco_client()
    rif = out.get('riferimento', [])
    for g in GRUPPI_RIFINITURA:
        vg = [x for x in rif if x['gruppo'] == g]
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vg if not x['ok']]
        check('rifinitura %s: la pagina di riferimento la passa' % g, not rossi, '; '.join(rossi[:3]))
        check('rifinitura %s: il giro sulla pagina di riferimento e\' arrivato in fondo' % g, len(vg) >= VERIFICHE_RIFINITURA[g],
              'troppo poche verifiche (%d su %d)' % (len(vg), VERIFICHE_RIFINITURA[g]))
    for cosa, gruppi, _, atteso in ROTTURE_RIFINITURA:
        check('rottura della rifinitura «%s»: si applica alla pagina di riferimento' % cosa, applicate.get(cosa),
              'il testo da sostituire non c\'e\' piu\': la rottura non romperebbe niente')
        vr = out.get('rottura: ' + cosa)
        if vr is None:
            continue
        rossi = [x['nome'] + ' — ' + x.get('extra', '') for x in vr if not x['ok']]
        check('rottura della rifinitura «%s»: il banco diventa rosso' % cosa, bool(rossi), 'e\' passata verde')
        check('rottura della rifinitura «%s»: e il rosso nomina il difetto' % cosa, any(atteso in r for r in rossi),
              'rossi: ' + '; '.join(rossi[:3]))
    for parte, verifica in dichiarati_rifinitura():
        x = [y for y in rif if y['gruppo'] == parte and y['nome'] == verifica]
        check('difetto dichiarato %s «%s»: sulla pagina di riferimento la verifica c\'e\' ed e\' verde' % (parte, verifica),
              bool(x) and x[0]['ok'], 'la dichiarazione nomina una verifica che il banco non fa, o che non si puo\' passare')
        rossa = any(y['gruppo'] == parte and y['nome'] == verifica and not y['ok']
                    for cosa, _, _, _ in ROTTURE_RIFINITURA for y in out.get('rottura: ' + cosa, []))
        check('difetto dichiarato %s «%s»: una rottura la fa diventare rossa' % (parte, verifica), rossa,
              'nessuna rottura della pagina di riferimento la fa fallire: la verifica dichiarata non ha mai mostrato di saper vedere il difetto')


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
              test_mappa_righe, test_mappa_azioni, test_mappa_provata_al_contrario,
              test_carteggio_preparazione, test_carteggio_righe, test_carteggio_riepilogo,
              test_carteggio_senza_riprova, test_carteggio_ambito, test_carteggio_provato_al_contrario,
              test_client_nella_pagina, test_client_primo_ingresso, test_client_senza_account, test_client_email_registrata,
              test_client_invito_e_viste, test_client_tutte_le_attivita, test_client_registrazione,
              test_client_dispositivo_condiviso, test_client_coda, test_client_uscita,
              test_client_verifica, test_client_password, test_client_vecchio_archivio, test_client_file,
              test_client_limiti, test_client_azzeramento, test_client_ripristino, test_client_data,
              test_client_export, test_client_testi,
              test_client_scarica_dopo_azzeramento, test_client_cancella_dopo_recupero, test_client_conferma_mancante, test_client_uscita_segnali,
              test_client_bozza_senza_account, test_client_bozza,
              test_client_provato_al_contrario,
              test_rifinitura_senza_account, test_rifinitura_invio, test_rifinitura_guasto, test_rifinitura_identita,
              test_rifinitura_finestra, test_rifinitura_fuoco, test_rifinitura_avvisi, test_rifinitura_larghezze,
              test_rifinitura_contrasto, test_rifinitura_bersagli, test_rifinitura_provata_al_contrario,
              test_motore_senza_orfani, test_chiamate_al_motore_preservate,
              test_letture_che_non_mascherano,
              test_testi_leggibili, test_alt_di_contenuto, test_trasloco):
        t()
    su = (' — sulla copia %s, NON su site/app.html' % PAGINA) if PAGINA else ''
    if falliti:
        print('%d verifiche FALLITE su %d%s:\n' % (len(falliti), fatti, su))
        for f in falliti:
            print('  ✗ ' + f)
        if su:
            print('\n' + su.lstrip(' —'))
        sys.exit(1)
    print('%d verifiche passate%s' % (fatti, su))


if __name__ == '__main__':
    main()
