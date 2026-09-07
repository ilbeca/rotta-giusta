# -*- coding: utf-8 -*-
"""Test dei dati pubblicati: la forma dei JSON e le invarianti che nessuno ricalcola piu'.

    python3 tests/test_dati.py     # da qualsiasi cwd; esce con 1 se una verifica fallisce

Senza pytest, nello stile del progetto originario: `check(nome, cond, extra)`,
un contatore e la lista dei falliti. Solo libreria standard, Python 3.9.

Nel progetto originario molte di queste cose venivano ricalcolate all'avvio
del server (le figure doppione, le annotazioni, gli abbinamenti corretti a
mano). Qui i JSON sono file committati e nessuno li rigenera: se qualcuno li
tocca «per sistemarli», l'unico posto dove si vede e' questo.
"""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
SITE = RADICE / 'site'
DATI = SITE / 'dati'

# Le frasi spia sono una sola cosa, e stanno nel guardiano.
sys.path.insert(0, str(RADICE / 'strumenti'))
from controlla import SPIA  # noqa: E402

ok = 0
falliti = []


def check(nome, cond, extra=''):
    global ok
    if cond:
        ok += 1
    else:
        falliti.append('%s%s' % (nome, (': %s' % extra) if extra != '' else ''))


def leggi(p):
    return json.loads(Path(p).read_text(encoding='utf-8'))


# --- il guardiano deve girare nella suite --------------------------------------

def test_controlla():
    esito = subprocess.run([sys.executable, str(RADICE / 'strumenti' / 'controlla.py')],
                           capture_output=True, text=True)
    righe = [r for r in esito.stdout.splitlines() if not r.startswith('   ')]
    check('strumenti/controlla.py esce 0', esito.returncode == 0,
          ' | '.join(righe[-12:]) + (esito.stderr.strip() and ' | ' + esito.stderr.strip()))


# --- caricamento ----------------------------------------------------------------

VERSION = (RADICE / 'VERSION').read_text(encoding='utf-8').strip()
quiz = leggi(DATI / 'quiz.json')
meta = leggi(DATI / 'meta.json')
tecniche = leggi(DATI / 'tecniche.json')
carteggio = leggi(DATI / 'carteggio.json')
carteggio_e12 = leggi(DATI / 'carteggio_e12.json')
indice_figure = leggi(SITE / 'figure' / 'index.json')
risultato = leggi(RADICE / 'strumenti' / 'tecniche-carteggio' / 'risultato.json')
per_id = {q['id']: q for q in quiz}


def esatta(qid):
    q = per_id[qid]
    return q['r'][q['x']]


# --- forma dei quiz ---------------------------------------------------------------

def test_quiz():
    base = [q for q in quiz if q['k'] == 'base']
    vela = [q for q in quiz if q['k'] == 'vela']
    check('quiz: 1722 quesiti', len(quiz) == 1722, len(quiz))
    check('quiz: 1472 base', len(base) == 1472, len(base))
    check('quiz: 250 vela', len(vela) == 250, len(vela))
    check('quiz: solo base e vela', len(base) + len(vela) == len(quiz))
    check('quiz: id unici', len(per_id) == len(quiz))
    campi = {'id', 'k', 't', 'v', 'd', 'r', 'x', 'f', 'p'}
    check('quiz: ogni quesito ha id,k,t,v,d,r,x,f,p',
          all(campi <= set(q) for q in quiz),
          [q.get('id') for q in quiz if not campi <= set(q)][:5])
    check('quiz: 0 <= x < len(r)',
          all(isinstance(q['x'], int) and 0 <= q['x'] < len(q['r']) for q in quiz),
          [q['id'] for q in quiz if not (isinstance(q['x'], int) and 0 <= q['x'] < len(q['r']))][:5])
    check('quiz base: 3 risposte', all(len(q['r']) == 3 for q in base),
          [q['id'] for q in base if len(q['r']) != 3][:5])
    check('quiz vela: 2 risposte Vero/Falso', all(q['r'] == ['Vero', 'Falso'] for q in vela),
          [q['id'] for q in vela if q['r'] != ['Vero', 'Falso']][:5])


# --- meta -------------------------------------------------------------------------

def test_meta():
    s = meta['stats']
    con_figura = [q for q in quiz if q['f']]
    con_fm = [q for q in quiz if q.get('fm')]
    check('meta.stats.quiz_base', s['quiz_base'] == sum(1 for q in quiz if q['k'] == 'base') == 1472, s['quiz_base'])
    check('meta.stats.quiz_vela', s['quiz_vela'] == sum(1 for q in quiz if q['k'] == 'vela') == 250, s['quiz_vela'])
    check('meta.stats.carteggio_sl', s['carteggio_sl'] == len(carteggio) == 135, s['carteggio_sl'])
    check('meta.stats.carteggio_e12', s['carteggio_e12'] == len(carteggio_e12) == 50, s['carteggio_e12'])
    check('meta.stats.quiz_con_figura', s['quiz_con_figura'] == len(con_figura) == 119, (s['quiz_con_figura'], len(con_figura)))
    check('meta.stats.quiz_figura_mancante', s['quiz_figura_mancante'] == len(con_fm) == 1, (s['quiz_figura_mancante'], len(con_fm)))
    check('meta.stats.temi', s['temi'] == len(meta['temi']) == 8, (s['temi'], len(meta['temi'])))
    voci = sum(len(t['voci']) for t in meta['temi'])
    check('meta.stats.voci', s['voci'] == voci == 44, (s['voci'], voci))
    check('meta.stats.tecniche', s['tecniche'] == len(meta['tecniche']) == 12, (s['tecniche'], len(meta['tecniche'])))

    pesi = meta['pesi_esame']
    check('meta.pesi_esame: 8 temi', len(pesi) == 8, len(pesi))
    check('meta.pesi_esame: somma 20', sum(pesi.values()) == 20, sum(pesi.values()))
    check('meta.pesi_esame: gli stessi temi di meta.temi',
          set(pesi) == {t['tema'] for t in meta['temi']})
    check('meta.prove.base', meta['prove']['base'] == {'n': 20, 'minuti': 30, 'errori_max': 4}, meta['prove']['base'])
    check('meta.prove.vela', meta['prove']['vela'] == {'n': 5, 'minuti': 15, 'errori_max': 1}, meta['prove']['vela'])
    check('meta.versione == VERSION', meta['versione'] == VERSION, (meta['versione'], VERSION))

    png = sorted(p.name for p in (SITE / 'figure').glob('*.png'))
    check('meta.figure == 102 (la n. 8 era un doppione della 99: tolta)', meta['figure'] == 102, meta['figure'])
    check('meta.figure == PNG in site/figure/', meta['figure'] == len(png), (meta['figure'], len(png)))
    check('meta.figure == len(figure/index.json)', meta['figure'] == len(indice_figure), (meta['figure'], len(indice_figure)))


# --- figure -----------------------------------------------------------------------

def test_figure():
    cartella = SITE / 'figure'
    riferite = [q['f'] for q in quiz if q['f']]
    distinte = sorted(set(riferite))
    check('figure: 119 quiz con figura', len(riferite) == 119, len(riferite))
    check('figure: 102 file distinti referenziati', len(distinte) == 102, len(distinte))
    mancanti = [f for f in distinte if not (cartella / f).is_file()]
    check('figure: ogni file referenziato esiste', not mancanti, mancanti)

    # Nel progetto originario il doppione (base-59) lo scovava il server a ogni
    # avvio confrontando gli md5; qui e' un dato, e va difeso.
    md5 = {}
    for p in cartella.glob('*.png'):
        md5.setdefault(hashlib.md5(p.read_bytes()).hexdigest(), []).append(p.name)
    doppioni = sorted(f for f in distinte
                      if (cartella / f).is_file()
                      and len(md5[hashlib.md5((cartella / f).read_bytes()).hexdigest()]) > 1)
    check('figure: nessun file referenziato e\' il doppione md5 di un altro', not doppioni, doppioni)


# --- le invarianti del progetto originario -------------------------------------------

# a) I dieci abbinamenti quiz -> figura corretti a mano: il decreto numera le
#    figure in un ordine che non e' quello dei quesiti, e chi «rimette in
#    ordine» i numeri rompe proprio queste coppie.
ABBINAMENTI = {
    'base-177': 'figura-012.png', 'base-178': 'figura-011.png',
    'base-647': 'figura-045.png', 'base-650': 'figura-042.png',
    'base-662': 'figura-056.png', 'base-679': 'figura-053.png',
    'base-1062': 'figura-102.png', 'base-1063': 'figura-103.png',
    'vela-130': 'figura-099.png', 'vela-131': 'figura-098.png',
}

# d) I 37 quesiti oscurati (superati dalla normativa, non escono all'esame).
OSCURATI = {
    'base-106', 'base-144', 'base-146', 'base-232', 'base-276', 'base-278', 'base-281',
    'base-283', 'base-286', 'base-295', 'base-297', 'base-298', 'base-304', 'base-305',
    'base-307', 'base-308', 'base-313', 'base-314', 'base-405', 'base-408', 'base-446',
    'base-455', 'base-466', 'base-468', 'base-505', 'base-593', 'base-599', 'base-517',
    'base-607', 'base-699', 'base-822', 'base-730', 'base-1032', 'base-1093', 'base-1260',
    'base-1310', 'base-1342',
}

# e) Gli 11 quesiti toccati dal DM 133/2024 (dotazioni di sicurezza).
DM_133_2024 = [
    'base-295', 'base-313', 'base-314', 'base-304', 'base-277', 'base-278', 'base-281',
    'base-308', 'base-274', 'base-293', 'base-297',
]

# f) La risposta esatta dei quesiti annotati (gli 11 del DM 133/2024, base-405 e
#    i 37 oscurati), fissata da una tabella e non riletta dai dati. Verificata
#    contro il seed originario dal test del progetto sorgente il 4 settembre
#    2026. E' una guardia di regressione: l'annotazione dice che il decreto e'
#    superato, ma la risposta del decreto resta quella. Se questa tabella non
#    torna piu', qualcuno ha «sistemato» una risposta, e non si deve.
RISPOSTE_ANNOTATI = {
    'base-106': 1,
    'base-144': 0,
    'base-146': 2,
    'base-232': 1,
    'base-274': 0,
    'base-276': 0,
    'base-277': 1,
    'base-278': 1,
    'base-281': 1,
    'base-283': 2,
    'base-286': 1,
    'base-293': 2,
    'base-295': 2,
    'base-297': 1,
    'base-298': 0,
    'base-304': 1,
    'base-305': 1,
    'base-307': 2,
    'base-308': 0,
    'base-313': 1,
    'base-314': 1,
    'base-405': 0,
    'base-408': 1,
    'base-446': 2,
    'base-455': 1,
    'base-466': 0,
    'base-468': 1,
    'base-505': 2,
    'base-517': 2,
    'base-593': 1,
    'base-599': 0,
    'base-607': 1,
    'base-699': 1,
    'base-730': 1,
    'base-822': 1,
    'base-1032': 2,
    'base-1093': 0,
    'base-1260': 2,
    'base-1310': 2,
    'base-1342': 2,
}


def test_invarianti():
    # a) abbinamenti corretti a mano
    for qid, fig in ABBINAMENTI.items():
        check('abbinamento %s -> %s' % (qid, fig), per_id[qid]['f'] == fig, per_id[qid]['f'])

    # b) le due risposte rotte dall'estrazione del PDF, corrette a mano
    check('base-226: x == 0', per_id['base-226']['x'] == 0, per_id['base-226']['x'])
    check('base-226: la risposta 0 contiene «piedino»', 'piedino' in per_id['base-226']['r'][0],
          per_id['base-226']['r'][0])
    check('base-1418: x == 1', per_id['base-1418']['x'] == 1, per_id['base-1418']['x'])

    # c) l'unica figura mancante
    con_fm = [q['id'] for q in quiz if q.get('fm')]
    check('base-59: f == None', per_id['base-59']['f'] is None, per_id['base-59']['f'])
    check('base-59: fm valorizzato', bool(per_id['base-59'].get('fm')))
    check('fm: solo base-59', con_fm == ['base-59'], con_fm)

    # d) oscurati
    osc = [q for q in quiz if q.get('osc')]
    check('osc: 37 quesiti', len(osc) == 37, len(osc))
    check('osc: tutti base', all(q['k'] == 'base' for q in osc), [q['id'] for q in osc if q['k'] != 'base'])
    check('osc: l\'insieme atteso', {q['id'] for q in osc} == OSCURATI,
          sorted({q['id'] for q in osc} ^ OSCURATI))
    nbp = {q['id'] for q in quiz if q.get('nbp')}
    check('osc e nbp marcano gli stessi quesiti', nbp == {q['id'] for q in osc}, sorted(nbp ^ {q['id'] for q in osc}))
    check('nbp: ogni nota contiene «non uscirà»',
          all('non uscirà' in q['nbp'] for q in quiz if q.get('nbp')),
          [q['id'] for q in quiz if q.get('nbp') and 'non uscirà' not in q['nbp']])
    check('nbp: nessuno senza osc', not [q['id'] for q in quiz if q.get('nbp') and not q.get('osc')],
          [q['id'] for q in quiz if q.get('nbp') and not q.get('osc')])

    # e) note dopo la risposta: i DM 133/2024 non oscurati, piu' il dubbio sui flap
    attesi_nb = sorted((set(DM_133_2024) - OSCURATI) | {'base-405'})
    con_nb = sorted(q['id'] for q in quiz if q.get('nb'))
    check('nb: esattamente 4 quesiti', len(con_nb) == 4, con_nb)
    check('nb: DM 133/2024 non oscurati + base-405', con_nb == attesi_nb, (con_nb, attesi_nb))
    for qid in set(DM_133_2024) - OSCURATI:
        nb = per_id[qid].get('nb') or ''
        check('nb %s: contiene «non è stata cambiata» e «DM 133/2024»' % qid,
              'non è stata cambiata' in nb and 'DM 133/2024' in nb, nb[:160])
    check('nb base-405: contiene «lato sinistro»', 'lato sinistro' in (per_id['base-405'].get('nb') or ''))

    # f) nessuna risposta modificata rispetto al decreto
    attesi = sorted(set(DM_133_2024) | {'base-405'} | OSCURATI)
    check('tabella risposte annotati: copre esattamente gli annotati',
          sorted(RISPOSTE_ANNOTATI) == attesi, sorted(set(RISPOSTE_ANNOTATI) ^ set(attesi)))
    diversi = {qid: (per_id[qid]['x'], x) for qid, x in RISPOSTE_ANNOTATI.items() if per_id[qid]['x'] != x}
    check('risposte annotati: nessuna cambiata rispetto al decreto', not diversi, diversi)

    # g) due risposte che la normativa nuova contraddice, e che restano del decreto
    check('base-304: esatta contiene «diverse dotazioni luminose»',
          'diverse dotazioni luminose' in esatta('base-304'), esatta('base-304'))
    check('base-405: esatta inizia con «di inclinare lo scafo verso il lato dritto»',
          esatta('base-405').startswith('di inclinare lo scafo verso il lato dritto'), esatta('base-405'))


# --- carteggio ----------------------------------------------------------------------

def test_carteggio():
    check('tecniche.json: 135 esercizi', len(tecniche) == 135, len(tecniche))
    check('tecniche.json: ogni esercizio ha almeno una tecnica',
          all(e['tecniche'] for e in tecniche), [e['id'] for e in tecniche if not e['tecniche']])
    # meta.tecniche e' una lista di {tecnica, n}: il nome e quanti esercizi la usano.
    conteggi = {}
    for e in tecniche:
        for t in e['tecniche']:
            conteggi[t] = conteggi.get(t, 0) + 1
    nomi = {t['tecnica'] for t in meta['tecniche']}
    check('tecniche.json: le tecniche sono esattamente meta.tecniche',
          set(conteggi) == nomi, sorted(set(conteggi) ^ nomi))
    check('meta.tecniche: 12 nomi', len(nomi) == len(meta['tecniche']) == 12, len(meta['tecniche']))
    check('meta.tecniche: n == esercizi che usano la tecnica',
          all(conteggi.get(t['tecnica']) == t['n'] for t in meta['tecniche']),
          [(t['tecnica'], t['n'], conteggi.get(t['tecnica'])) for t in meta['tecniche']
           if conteggi.get(t['tecnica']) != t['n']])
    check('meta.tecniche == risultato.tecniche_metodo',
          nomi == set(risultato['tecniche_metodo']),
          sorted(nomi ^ set(risultato['tecniche_metodo'])))
    diversi = [e['id'] for e in tecniche
               if e['tecniche'] != risultato['esercizi'].get(e['id'], {}).get('metodo')]
    check('tecniche.json: tecniche == risultato.esercizi[id].metodo', not diversi, diversi)

    check('carteggio.json: 135 esercizi', len(carteggio) == 135, len(carteggio))
    id_c = {e['id'] for e in carteggio}
    id_t = {e['id'] for e in tecniche}
    check('carteggio.json: stessi id di tecniche.json', id_c == id_t, sorted(id_c ^ id_t))
    check('carteggio.json: id unici', len(id_c) == len(carteggio))
    check('carteggio.json: risposta_ufficiale non vuota',
          all(e.get('risposta_ufficiale') for e in carteggio),
          [e['id'] for e in carteggio if not e.get('risposta_ufficiale')])
    argomenti = {'navigazione costiera', 'correnti', 'scarroccio', 'carburante'}
    check('carteggio.json: argomento noto', all(e['argomento'] in argomenti for e in carteggio),
          sorted({e['argomento'] for e in carteggio} - argomenti))
    check('carteggio.json: carta 5/D o 42/D', all(e['carta'] in {'5/D', '42/D'} for e in carteggio),
          sorted({e['carta'] for e in carteggio} - {'5/D', '42/D'}))
    check('carteggio_e12.json: 50 esercizi', len(carteggio_e12) == 50, len(carteggio_e12))

    # Le annotazioni dei docenti stavano dopo un doppio a-capo (cinque) o attaccate
    # (una): si controllano entrambe le cose.
    doppio = [e['id'] for e in carteggio if '\n\n' in e['risposta_ufficiale']]
    check('carteggio.json: nessun doppio a-capo nelle risposte', not doppio, doppio)
    spia = [e['id'] for e in carteggio if SPIA.search(e['risposta_ufficiale'])]
    check('carteggio.json: nessuna frase spia nelle risposte', not spia, spia)


# --- service worker ----------------------------------------------------------------

def guscio(testo):
    m = re.search(r'const GUSCIO = \[([\s\S]*?)\]', testo)
    return re.findall(r"'(/[^']*)'", m.group(1)) if m else None


def test_sw():
    sw = (SITE / 'sw.js').read_text(encoding='utf-8')
    # Dalla 0.22.0 la palestra sta su /app: index.html e' la vetrina, che nel
    # guscio non c'e' apposta.
    index = (SITE / 'app.html').read_text(encoding='utf-8')
    # Il nome della cache segue VERSION e nessun build step lo sostituisce:
    # nel file committato c'e' il numero, e deve essere quello di VERSION.
    check("sw.js: const CACHE = 'rg-' + VERSION", ("const CACHE = 'rg-" + VERSION + "'") in sw,
          re.search(r"const CACHE = .*", sw).group(0) if re.search(r"const CACHE = .*", sw) else 'assente')
    g_sw = guscio(sw)
    g_ix = guscio(index)
    check('sw.js: GUSCIO presente', g_sw is not None)
    check('app.html: GUSCIO presente', g_ix is not None)
    check('GUSCIO: la stessa lista in sw.js e app.html', g_sw == g_ix, '%s vs %s' % (g_sw, g_ix))
    # Il guscio elenca gli indirizzi **come li serve Cloudflare Pages**, non i
    # nomi dei file: `/` e' index.html e `/privacy` e' privacy.html. Pages
    # risponde 308 al percorso con l'estensione, e una risposta rediretta messa
    # in cache non si puo' servire a una navigazione (`respondWith` la rifiuta
    # quando il redirect mode e' 'manual'): la pagina muore con ERR_FAILED,
    # anche online, perche' il service worker legge prima la cache.
    for p in g_sw or []:
        f = SITE / ('index.html' if p == '/' else p.lstrip('/'))
        if not f.is_file() and not f.suffix:
            f = f.with_suffix('.html')
        check('GUSCIO: %s esiste in site/' % p, f.is_file(), str(f.relative_to(RADICE)))
    # E il guscio non deve tornare alla forma con l'estensione: sarebbe di nuovo
    # una voce rediretta in cache, cioe' il difetto della 0.19.1.
    for p in g_sw or []:
        check('GUSCIO: %s non ha .html (Pages ci risponde 308)' % p, not p.endswith('.html'), p)
    # Gli stessi indirizzi nei link, in tutte e tre le pagine: un href con
    # l'estensione e' un link che muore appena il service worker e' installato.
    for nome in ('index.html', 'app.html', 'privacy.html', 'avvertenza.html'):
        testo = (SITE / nome).read_text(encoding='utf-8')
        cattivi = re.findall(r'href="(/[A-Za-z0-9._-]+\.html)"', testo)
        check('%s: nessun link interno con .html' % nome, not cattivi, cattivi)


# --- il rinomino: nessun residuo del nome vecchio ----------------------------
#
# Un rinomino lascia residui invisibili, e questo ne aveva due che il conteggio
# a mano non aveva distinto: il nome del database IndexedDB e il marcatore nel
# file esportato. Il primo NON si tocca — rinominarlo aprirebbe un archivio
# vuoto e ogni risposta data sparirebbe senza un errore — quindi il controllo
# lo dichiara come eccezione invece di fingere che non esista.

NOME_VECCHIO = 'Open Patente Nautica'
PREFISSO_VECCHIO = 'opn-'
# L'unica occorrenza ammessa del vecchio identificativo: il nome del database.
ECCEZIONI = ("NOME: 'open-patente-nautica'",)


def test_rinomino():
    for f in sorted(SITE.rglob('*')):
        if not f.is_file() or f.suffix not in ('.html', '.js', '.json'):
            continue
        testo = f.read_text(encoding='utf-8')
        rel = str(f.relative_to(RADICE))
        check('%s: nessun "%s"' % (rel, NOME_VECCHIO), NOME_VECCHIO not in testo)
        check('%s: nessun prefisso di cache "%s"' % (rel, PREFISSO_VECCHIO),
              PREFISSO_VECCHIO not in testo)
        residuo = [r for r in testo.split('\n')
                   if 'open-patente-nautica' in r
                   and not any(e in r for e in ECCEZIONI)
                   and 'github.com/ilbeca/open-patente-nautica' not in r]
        check('%s: nessun identificativo vecchio fuori dalle eccezioni' % rel,
              not residuo, residuo[:3])


# --- il prefisso della cache e' uno solo -------------------------------------
#
# Il nome della cache vive in sw.js, ma app.html lo cerca con startsWith per
# dire quale versione gira davvero su questo dispositivo. Sono quattro punti in
# due file: cambiarne tre su quattro fa mentire la scheda Info in silenzio.

def test_prefisso_cache():
    sw = (SITE / 'sw.js').read_text(encoding='utf-8')
    index = (SITE / 'app.html').read_text(encoding='utf-8')
    m = re.search(r"const CACHE = '([a-z]+-)", sw)
    check('sw.js: il prefisso della cache si legge', m is not None)
    if not m:
        return
    prefisso = m.group(1)
    trovati = set(re.findall(r"startsWith\('([a-z]+-)'\)", index))
    for riga in index.split('\n'):
        if 'cache' in riga.lower():
            trovati |= set(re.findall(r"'([a-z]+-)'\s*\+", riga))
    trovati = sorted(trovati)
    check('app.html: usa il prefisso della cache', bool(trovati), trovati)
    check('app.html: un prefisso solo, uguale a quello di sw.js (%s)' % prefisso,
          trovati == [prefisso], trovati)


# --- il manifest dichiara delle icone, ed esistono ---------------------------
#
# Fino alla 0.20.0 `icons` era una lista vuota: la PWA si installava senza
# faccia, e niente lo diceva. Un manifest che elenca un file che non c'e'
# fallisce nello stesso modo silenzioso, quindi si controllano tutti e due.

def test_manifest_icone():
    man = json.loads((SITE / 'manifest.json').read_text(encoding='utf-8'))
    icone = man.get('icons') or []
    check('manifest: dichiara delle icone', bool(icone), icone)
    for i in icone:
        f = SITE / i['src'].lstrip('/')
        check('manifest: %s esiste' % i['src'], f.is_file())
        check('manifest: %s ha sizes e type' % i['src'], bool(i.get('sizes')) and bool(i.get('type')), i)
    # Android ritaglia le icone con forme diverse: senza una maskable il segno
    # viene tagliato dal ritaglio di sistema invece che dal disegno.
    check('manifest: almeno una icona maskable',
          any('maskable' in (i.get('purpose') or '') for i in icone),
          [i.get('purpose') for i in icone])
    # E la pagina deve dichiarare la favicon e l'apple-touch-icon: iOS il
    # manifest non lo legge, quindi senza quel link l'icona sulla Home e' uno
    # screenshot della pagina.
    for pagina in ('index.html', 'app.html'):
        testo = (SITE / pagina).read_text(encoding='utf-8')
        for rel in ('icon', 'apple-touch-icon'):
            check('%s: <link rel="%s">' % (pagina, rel), ('rel="%s"' % rel) in testo)
        for meta in ('og:title', 'og:description', 'og:image'):
            check('%s: <meta property="%s">' % (pagina, meta), ('property="%s"' % meta) in testo)
    for f in ('og-card.png', 'favicon.svg', 'apple-touch-icon.png'):
        check('site/%s esiste' % f, (SITE / f).is_file())


# --- la vetrina sta su /, la palestra su /app --------------------------------
#
# La trappola non e' spostare il file: e' `start_url`. Se la palestra si sposta
# e start_url resta '/', chi ha l'icona sulla schermata Home la tocca e si
# ritrova sulla pagina di presentazione invece che sui suoi quiz — e non c'e'
# nessun errore che lo dica.

def test_indirizzi():
    man = json.loads((SITE / 'manifest.json').read_text(encoding='utf-8'))
    sw = (SITE / 'sw.js').read_text(encoding='utf-8')
    g = guscio(sw) or []
    palestra = man.get('start_url')
    check('manifest: start_url e la palestra, non la vetrina', palestra == '/app', palestra)
    check('manifest: scope copre tutto il sito', man.get('scope') == '/', man.get('scope'))
    check('guscio: contiene la palestra', palestra in g, g)
    # La vetrina fuori dal guscio, e non e' un dimenticanza: sw.js e'
    # cache-first, e una pagina di presentazione in cache resterebbe congelata.
    check('guscio: la vetrina NON e in cache', '/' not in g, g)
    check('site/app.html esiste', (SITE / 'app.html').is_file())
    # E la vetrina deve portare alla palestra, altrimenti e un vicolo cieco.
    vetrina = (SITE / 'index.html').read_text(encoding='utf-8')
    check('la vetrina rimanda a %s' % palestra, ('href="%s"' % palestra) in vetrina)
    # Due indirizzi, due titoli. Con lo stesso titolo sono due schede
    # indistinguibili, e per un motore di ricerca due pagine che competono per
    # la stessa query invece di dividersi il lavoro.
    import re as _re
    titolo = lambda f: (_re.search(r'<title>(.*?)</title>',
                        (SITE / f).read_text(encoding='utf-8'), _re.S) or [None, ''])[1].strip()
    tv, tp = titolo('index.html'), titolo('app.html')
    check('vetrina e palestra hanno titoli diversi', tv != tp and tv and tp, '%r / %r' % (tv, tp))
    check('il titolo della vetrina nomina la patente nautica',
          'patente nautica' in tv.lower(), tv)
    # Le pagine legali tornano alla palestra, non alla vetrina.
    for f in ('privacy.html', 'avvertenza.html'):
        testo = (SITE / f).read_text(encoding='utf-8')
        check('%s: torna alla palestra' % f, 'href="/app"' in testo)


def main():
    for t in (test_controlla, test_quiz, test_meta, test_figure, test_invarianti,
              test_carteggio, test_sw, test_rinomino, test_prefisso_cache, test_manifest_icone, test_indirizzi):
        t()
    if falliti:
        print('%d verifiche passate, %d FALLITE:' % (ok, len(falliti)))
        for f in falliti:
            print('  ', f)
        sys.exit(1)
    print('%d verifiche passate' % ok)


if __name__ == '__main__':
    main()
