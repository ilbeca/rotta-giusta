"""Compone i mock autoconsistenti delle tre direzioni: font, CSS, tema e icone dentro ogni file.

Uso: python3 build.py <cartella di uscita> <manrope.woff2>
Scrive <uscita>/direzioni.html e una sottocartella per direzione, con le stesse
quattro schermate: lo stesso contenuto, tre volti diversi.
"""
import base64, pathlib, re, sys
SRC = pathlib.Path(__file__).parent
OUT = pathlib.Path(sys.argv[1])
FONT = pathlib.Path(sys.argv[2]).read_bytes()
css = (SRC / 'comune.css').read_text().replace('@@FONT@@', base64.b64encode(FONT).decode())
icone = (SRC / 'icone.svg').read_text()
DIREZIONI = [('a', 'a-carta-nautica', 'La carta nautica'),
             ('b', 'b-plancia-di-notte', 'La plancia di notte'),
             ('c', 'c-quaderno-a-colori', 'Il quaderno a colori')]
PAGINE = ['home', 'quiz', 'runner', 'riepilogo']
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

def componi(t, tema, illustrazione, nome):
    t = t.replace('@@CSS@@', css).replace('@@ICONE@@', icone).replace('@@TEMA@@', tema).replace('@@NOME@@', nome)
    n = iter(range(99))
    t = re.sub('@@CARTA@@', lambda m: illustrazione.replace('reticolo', f'reticolo{next(n)}'), t)
    t = re.sub(r'@@TESTATA:(\w*)@@', lambda m: testata(m.group(1)), t)
    return re.sub(r'@@BARRA:(\w*)@@', lambda m: barra(m.group(1)), t)

for lettera, cartella, nome in DIREZIONI:
    d = OUT / cartella
    d.mkdir(parents=True, exist_ok=True)
    tema = (SRC / lettera / 'tema.css').read_text() if (SRC / lettera / 'tema.css').exists() else ''
    ill = (SRC / lettera / 'illustrazione.svg').read_text()
    for p in PAGINE:
        t = componi((SRC / f'{p}.html').read_text(), tema, ill, nome)
        (d / f'{p}.html').write_text(t)
        print(cartella, p, len(t))
t = componi((SRC / 'direzioni.html').read_text(), '', '', '')
(OUT / 'direzioni.html').write_text(t)
print('direzioni', len(t))
