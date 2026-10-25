"""Compone i mock degli altri stili, accanto alla release candidate.

Uso, dalla cartella redesign-2026-10-claude:
  python3 sorgenti/stili/build.py . ../../../site/caratteri/manrope-latin-wght-normal.woff2 [d e f g]

Scrive soltanto le cartelle dei quattro stili nuovi. Le direzioni A, B, C e la
release candidate «La carta che vive» le scrive sorgenti/build.py, che qui non
si chiama: così questo costruttore non può riscriverle nemmeno per sbaglio.
Legge, senza cambiarli, comune.css e icone.svg di sorgenti/. Ogni stile ha la
sua Home (stili/<x>/home.html), il suo tema.css e il suo disegno; le altre
cinque pagine sono comuni (stili/base/), copiate da quelle della RC.
"""
import base64, json, pathlib, re, sys
QUI = pathlib.Path(__file__).parent
SRC = QUI.parent
OUT = pathlib.Path(sys.argv[1])
FONT = pathlib.Path(sys.argv[2])
css = (SRC / 'comune.css').read_text().replace('@@FONT@@', base64.b64encode(FONT.read_bytes()).decode())
icone = (SRC / 'icone.svg').read_text() + (QUI / 'icone-stili.svg').read_text()
FIGURA = base64.b64encode((FONT.resolve().parent.parent / 'figure' / 'figura-079.png').read_bytes()).decode()
base_css = (QUI / 'base.css').read_text()
STILI = [('d', 'd-segnalamento', 'Il segnalamento'),
         ('e', 'e-bandiere', 'Le bandiere'),
         ('f', 'f-manuale-a-schede', 'Il manuale a schede'),
         ('g', 'g-regata', 'La regata')]
PROTETTE = {'a-carta-nautica', 'b-plancia-di-notte', 'c-quaderno-a-colori', 'a-carta-viva'}
PAGINE = ['home', 'quiz', 'preparazione', 'runner', 'runner-figura', 'riepilogo']
CUR = ' aria-current="page"'
VOCI = [('home', 'Home', 'i-rosa', 'home.html'), ('allenati', 'Allenati', 'i-allenati', 'quiz.html'),
        ('esame', 'Esame', 'i-esame', '#esame'), ('progressi', 'Progressi', 'i-progressi', '#progressi')]

def testata(att):
    nav = ''.join(f'<a href="{h}"{CUR if k == att else ""}>{n}</a>' for k, n, i, h in VOCI)
    return ('<header class="testata"><div class="testata-in">'
            '<a class="marchio" href="home.html" aria-label="Rotta Giusta, Home"><svg aria-hidden="true"><use href="#marchio"/></svg>'
            '<span><b>ROTTA</b> GIUSTA</span></a>'
            f'<nav class="nav-alta" aria-label="Sezioni">{nav}</nav>'
            '<a class="accedi" href="#accedi"><svg class="ico"><use href="#i-utente"/></svg>Accedi</a></div></header>')

def barra(att):
    v = ''.join(f'<a href="{h}"{CUR if k == att else ""}><svg class="ico"><use href="#{i}"/></svg>{n}</a>' for k, n, i, h in VOCI)
    return f'<nav class="barra" aria-label="Sezioni">{v}</nav>'

SOLO = set(sys.argv[3:])  # facoltativo: le lettere degli stili da rifare, per esempio «d e»
for lettera, cartella, nome in STILI:
    if SOLO and lettera not in SOLO:
        continue
    assert cartella not in PROTETTE
    d = OUT / cartella
    d.mkdir(parents=True, exist_ok=True)
    tema = base_css + (QUI / lettera / 'tema.css').read_text()
    ill = (QUI / lettera / 'illustrazione.svg').read_text()
    for p in PAGINE:
        sorgente = QUI / lettera / f'{p}.html'
        t = (sorgente if sorgente.exists() else QUI / 'base' / f'{p}.html').read_text()
        if p == 'home':
            # Il disegno da toccare della Home: titolo, testi e pulsanti vengono dallo stile
            h = json.loads((QUI / lettera / 'home.json').read_text())
            # Un bottone è [voce, sinistra, alto, etichetta] e, se è una zona e non un punto, anche [larghezza, altezza]
            def bottone(k, x, y, a, w=None, hh=None):
                zona = f';width:{w};height:{hh};margin:0;transform:translate(-50%,-50%)' if w else ''
                return f'<button class="luce{" zona" if w else ""}" style="left:{x};top:{y}{zona}" data-voce="{k}" aria-expanded="false" aria-label="{a}"></button>'
            bottoni = ''.join(bottone(*b) for b in h['bottoni'])
            t = (t.replace('@@TOCCA_BOTTONI@@', bottoni).replace('@@TOCCA_TITOLO@@', h['titolo'])
                  .replace('@@TOCCA_INTRO@@', h['intro']).replace('@@TOCCA_INVITO@@', h['invito'])
                  .replace('@@TOCCA_VOCI@@', json.dumps(h['voci'], ensure_ascii=False))
                  .replace('@@PROVA_EXTRA@@', h.get('extra', '')))
        t = t.replace('@@CSS@@', css).replace('@@ICONE@@', icone).replace('@@TEMA@@', tema).replace('@@NOME@@', nome).replace('@@FIGURA@@', FIGURA)
        n = iter(range(99))
        # Il disegno può comparire due volte nella stessa pagina: gli id «dis-…» diventano unici
        t = re.sub('@@CARTA@@', lambda m: ill.replace('dis-', f'dis{next(n)}-'), t)
        t = re.sub(r'@@TESTATA:(\w*)@@', lambda m: testata(m.group(1)), t)
        t = re.sub(r'@@BARRA:(\w*)@@', lambda m: barra(m.group(1)), t)
        (d / f'{p}.html').write_text(t)
        print(cartella, p, len(t))
