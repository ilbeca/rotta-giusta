#!/usr/bin/env python3
"""Il sito in locale, servito come lo serve Cloudflare Pages.

`python3 -m http.server --directory site` non basta piu', e non e' un dettaglio
di comodita': Pages serve `privacy.html` all'indirizzo **`/privacy`** e risponde
**308** al percorso con l'estensione. Il guscio offline elenca quindi `/privacy`
e `/avvertenza`, che `http.server` non conosce: in locale l'app direbbe «guscio
incompleto» per due file che ci sono, e la differenza fra locale e produzione
tornerebbe a essere invisibile — che e' esattamente il guasto che questo sito
insegue.

Qui il ripiego e' quello di Pages, e solo quello:
  /            -> index.html
  /privacy     -> privacy.html      (e /privacy.html -> 308 verso /privacy)
  /qualunque/  -> qualunque/index.html

Niente dipendenze, niente build step, niente processo da tenere vivo: si avvia
e si spegne con Ctrl-C.

    python3 strumenti/serve.py            # http://127.0.0.1:8787
    python3 strumenti/serve.py 9000
"""

import functools
import http.server
import os
import sys

RADICE = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'site')


class Pages(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        percorso = self.path.split('?', 1)[0].split('#', 1)[0]
        # Il 308 di Pages, riprodotto: e' quello che ha ucciso i due link del
        # pie' di pagina nella 0.19.1 quando finivano in cache come risposta
        # rediretta. Chi prova il sito in locale deve vederlo succedere.
        if percorso.endswith('.html') and percorso != '/index.html':
            self.send_response(308)
            self.send_header('Location', percorso[:-len('.html')])
            self.end_headers()
            return None
        if percorso == '/index.html':
            self.send_response(308)
            self.send_header('Location', '/')
            self.end_headers()
            return None
        # L'indirizzo senza estensione: se esiste il .html corrispondente, e' lui.
        if not os.path.splitext(percorso)[1] and not percorso.endswith('/'):
            candidato = os.path.join(RADICE, percorso.lstrip('/') + '.html')
            if os.path.isfile(candidato):
                self.path = percorso + '.html'
        return super().send_head()

    def end_headers(self):
        # Il service worker non deve restare in cache HTTP: e' la stessa regola
        # di site/_headers, che in locale nessuno applica.
        if self.path.split('?', 1)[0] == '/sw.js':
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def main():
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8787
    gestore = functools.partial(Pages, directory=RADICE)
    with http.server.ThreadingHTTPServer(('127.0.0.1', porta), gestore) as s:
        print('http://127.0.0.1:%d  (Ctrl-C per fermare)' % porta)
        try:
            s.serve_forever()
        except KeyboardInterrupt:
            print()


if __name__ == '__main__':
    main()
