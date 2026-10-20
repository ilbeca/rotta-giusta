"""Il regime della pagina di studio: il ridisegno, e nessun altro.

Un modulo solo, letto da `tests/test_interfaccia.py` e da `tests/test_dati.py`:
due copie della stessa regola divergerebbero, e il giorno in cui una delle due
riconoscesse la pagina e l'altra no, meta' dei controlli guarderebbero la
pagina sbagliata senza un rosso.

La regola (docs/ridisegno-progetto.md §10.1, punto A, e il contratto di P-80):
una pagina e' nel regime del **ridisegno** se il suo script dichiara, al primo
livello e fuori dai commenti, `function navigazioneSito(` **e** `const
VISTE_RIDISEGNO = ['home', 'allenati', 'esame', 'progressi']`, esattamente
quei quattro in quell'ordine. Mai dal nome di un pulsante.

**Un regime solo, dal 20 ottobre 2026 (P-89).** Fino alla merge di P-81 i
regimi erano due: senza nessuna delle due dichiarazioni la pagina era quella di
prima — sette viste in `site/app.html`, la Home a parte —, e ogni controllo la
guidava com'era. P-81 e' fuso con `ebe2e47`, e da qui una pagina senza le due
dichiarazioni e' **di prima**, cioe' un rosso con il motivo, come una a meta'
(specifica §6.2). E' il passo che P-12, P-37, P-47 e P-50 hanno fatto per le
aree: si toglie il ramo che teneva verde la pagina di prima, e restano pagine di
riferimento, rotture e controlli. Misurata prima di toglierlo, la pagina di
`v0.31.0` passava l'interfaccia con 3.002 verifiche su 3.015 e i dati con 230 su
230 (CHANGELOG, P-89).

Il documento canonico e' `site/index.html`, e `site/app.html` la porta di
compatibilita'. Un `app.html` che dichiara il ridisegno e' rosso: il ridisegno
vive in `index.html`. `RG_PAGINA=<file>` sostituisce il canonico: il regime si
legge dalla copia.

`RG_SITO=<cartella>` (P-84) sostituisce site/ intera — canonico, porta,
manifest, pagine legali, dati, figure —, e il regime si legge dalla cartella
con la stessa regola. Le due variabili insieme sono un errore, non una
precedenza: chi le mette tutte e due non sa piu' che cosa sta misurando.
`cartella_del_sito()` e' la sola che le legge, per le due suite in Python;
tests/sito.mjs dice lo stesso ai banchi in Node.
"""

import os
import re
from pathlib import Path


def cartella_del_sito(radice, ambiente=None):
    """(cartella, copia, errore): la cartella del sito che le suite leggono.

    Senza RG_SITO e' site/ del repo e `copia` e' None. Con RG_SITO e' quella
    cartella, risolta; `errore` dice perche' non si misura — una cartella che non
    esiste, una senza index.html, RG_PAGINA accanto —, e chi chiama lo fa
    diventare un rosso. Mai un ripiego su site/: un verde di site/ scambiato per
    il verde di una copia e' il guasto muto che RG_SITO deve evitare.
    """
    ambiente = os.environ if ambiente is None else ambiente
    site = Path(radice) / 'site'
    sito = ambiente.get('RG_SITO')
    if not sito:
        return site, None, ''
    c = Path(sito).expanduser().resolve()
    if ambiente.get('RG_PAGINA'):
        return c, sito, ('RG_SITO e RG_PAGINA insieme: la prima sostituisce site/ intera, la seconda il solo '
                         'canonico, e non si sceglie per te quale valga. Usane una.')
    if not c.is_dir():
        return c, sito, 'RG_SITO=%s: la cartella non esiste. Non si ripiega su site/.' % sito
    if not (c / 'index.html').is_file():
        return c, sito, 'RG_SITO=%s: nella cartella non c\'e\' index.html, quindi non e\' una copia del sito. Non si ripiega su site/.' % sito
    return c, sito, ''

VISTE_RIDISEGNO = ['home', 'allenati', 'esame', 'progressi']
SEGMENTI = ['quiz', 'carteggio', 'segnali']
# Le porte di oggi che possono restare come alias (tabella C del §10.1):
# alias -> (sezione, segmento, attivita o pannello).
ALIAS_VISTE = {
    'quiz': ('allenati', 'quiz', None),
    'cart': ('allenati', 'carteggio', None),
    'seg': ('allenati', 'segnali', None),
    'tec': ('allenati', 'carteggio', 'tecniche'),
    'diag': ('progressi', None, None),
    'oggi': ('home', None, None),
    'info': ('home', None, 'info'),
}
# La pagina senza le due dichiarazioni: dalla merge di P-81 e' un rosso, non un regime.
DI_PRIMA = ('senza navigazioneSito() e VISTE_RIDISEGNO: e\' la pagina di prima del ridisegno, che dalla merge di P-81 '
            '(20 ottobre 2026) non passa piu\' — il documento di studio e\' il ridisegno (specifica §6.2)')


def senza_commenti(testo):
    """Toglie i commenti, per non scambiare una citazione per un uso.

    Euristica dichiarata, non un parser: si tolgono i blocchi /* */ e le righe
    che cominciano con //, * o <!--. Basta per queste pagine e non pretende di
    piu'; se un giorno non bastasse, il sintomo sarebbe un falso allarme, che e'
    il verso giusto in cui sbagliare.
    """
    testo = re.sub(r'/\*.*?\*/', ' ', testo, flags=re.S)
    righe = [r for r in testo.split('\n')
             if not re.match(r'\s*(//|\*|<!--)', r)]
    return '\n'.join(righe)


def viste_dichiarate(testo):
    """La lista di `const VISTE_RIDISEGNO = [...]`, o None se non c'e'."""
    m = re.search(r'^const VISTE_RIDISEGNO = \[([^\]]*)\];', senza_commenti(testo), re.M)
    if not m:
        return None
    return re.findall(r"'([a-z]+)'", m.group(1))


def regime_ridisegno(testo):
    """('ridisegno' | 'di prima' | 'a metà', motivo).

    'di prima' e' la pagina senza nessuna delle due dichiarazioni: non e' piu' un
    regime, e chi legge lo fa diventare un rosso con il motivo (P-89)."""
    t = senza_commenti(testo)
    nav = re.search(r'^(?:async\s+)?function\s+navigazioneSito\s*\(', t, re.M) is not None
    viste = viste_dichiarate(testo)
    if not nav and viste is None:
        return 'di prima', DI_PRIMA
    if nav and viste == VISTE_RIDISEGNO:
        return 'ridisegno', ''
    if not nav:
        return 'a metà', 'VISTE_RIDISEGNO senza navigazioneSito(): il regime si legge da tutte e due'
    if viste is None:
        return 'a metà', 'navigazioneSito() senza VISTE_RIDISEGNO: il regime si legge da tutte e due'
    return 'a metà', 'VISTE_RIDISEGNO e\' %s, non %s: quattro sezioni, in quest\'ordine (ridisegno-progetto §2)' % (viste, VISTE_RIDISEGNO)


def canonico(site, pagina_env=None):
    """{nome, testo, regime, motivo, copia} del documento di studio.

    `nome` e' sempre `index.html`: il canonico del ridisegno. `motivo` e' vuoto
    quando la pagina e' nel ridisegno e `app.html` e' la porta; altrimenti dice
    che cosa non torna — la pagina di prima, una a meta', un app.html che
    dichiara il ridisegno —, e chi legge lo fa diventare un rosso.
    """
    site = Path(site)
    if pagina_env:
        testo = Path(pagina_env).read_text(encoding='utf-8')
        regime, motivo = regime_ridisegno(testo)
        return {'nome': 'index.html', 'testo': testo, 'regime': regime,
                'motivo': (('la copia %s: ' % pagina_env) + motivo) if motivo else '', 'copia': pagina_env}
    index = (site / 'index.html').read_text(encoding='utf-8')
    ri, mi = regime_ridisegno(index)
    app = (site / 'app.html').read_text(encoding='utf-8')
    ra, _ = regime_ridisegno(app)
    if ri != 'ridisegno':
        return {'nome': 'index.html', 'testo': index, 'regime': ri, 'motivo': 'site/index.html: ' + mi, 'copia': None}
    motivo = '' if ra != 'ridisegno' else ('anche site/app.html dichiara il ridisegno, e dev\'essere la porta: '
                                           'una pagina sola e\' il documento di studio')
    return {'nome': 'index.html', 'testo': index, 'regime': 'ridisegno', 'motivo': motivo, 'copia': None}


def e_porta(testo):
    """I difetti di `site/app.html` come porta di compatibilita' (ridisegno §3.2): [] se e' una porta."""
    t = senza_commenti(testo)
    difetti = []
    if re.search(r"import\s[^;]*from\s*['\"]/engine\.js['\"]|import\(['\"]/engine\.js", t):
        difetti.append('importa /engine.js: la porta non ha banca ne\' selezione')
    if re.search(r'^function indirizzoApi\(', t, re.M):
        difetti.append('dichiara indirizzoApi(): il client degli account non si duplica nella porta')
    if 'indexedDB' in t:
        difetti.append('apre indexedDB: la copia dell\'account la apre solo il canonico')
    if re.search(r"fetch\(\s*['\"]/dati/", t):
        difetti.append('chiede la banca: la porta non la carica')
    if 'location.replace(' not in t:
        difetti.append('non fa location.replace() verso il canonico')
    if '/?sezione=allenati&segmento=quiz' not in t:
        difetti.append('non porta a /?sezione=allenati&segmento=quiz')
    if not re.search(r'<a href="/\?sezione=allenati&(?:amp;)?segmento=quiz"[^>]*>Apri Allenati</a>', testo):
        difetti.append('senza script non mostra il link «Apri Allenati»')
    if 'location.hash' not in t or 'replaceState(' not in t:
        difetti.append('non legge il frammento in memoria e non lo toglie con replaceState: un gettone resterebbe nell\'URL')
    m = re.search(r'<title>(.*?)</title>', testo, re.S)
    if not m or m.group(1).strip() != 'Apri Allenati · Rotta Giusta':
        difetti.append('il titolo non e\' «Apri Allenati · Rotta Giusta»: %r' % (m.group(1).strip() if m else None))
    return difetti
