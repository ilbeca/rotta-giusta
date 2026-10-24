"""Compone i mock autoconsistenti: font, CSS e icone dentro ogni file."""
import base64, pathlib, re, sys
SRC = pathlib.Path(__file__).parent
OUT = pathlib.Path(sys.argv[1])
FONT = pathlib.Path(sys.argv[2]).read_bytes()
css = (SRC / 'comune.css').read_text().replace('@@FONT@@', base64.b64encode(FONT).decode())
icone = (SRC / 'icone.svg').read_text()
carta = (SRC / 'carta-illustrazione.svg').read_text()
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

for f in SRC.glob('*.html'):
    t = f.read_text().replace('@@CSS@@', css).replace('@@ICONE@@', icone)
    n = iter(range(99))
    t = re.sub('@@CARTA@@', lambda m: carta.replace('reticolo', f'reticolo{next(n)}'), t)
    t = re.sub(r'@@TESTATA:(\w*)@@', lambda m: testata(m.group(1)), t)
    t = re.sub(r'@@BARRA:(\w*)@@', lambda m: barra(m.group(1)), t)
    (OUT / f.name).write_text(t)
    print(f.name, len(t))
