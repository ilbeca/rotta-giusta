#!/usr/bin/env python3
"""Il sito in locale, servito come lo serve statichost.eu su rottagiusta.it.

`python3 -m http.server --directory site` non basta, e non e' un dettaglio di
comodita': il guscio offline elenca `/privacy` e `/avvertenza`, indirizzi che
`http.server` non conosce. In locale l'app direbbe «guscio incompleto» per due
file che ci sono, e la differenza fra locale e produzione tornerebbe invisibile
— che e' esattamente il guasto che questo sito insegue.

Le regole sono quelle **misurate** su rottagiusta.it il 25 settembre 2026
(docs/migrazione-hosting.md), non quelle che ci si aspetterebbe:

  /                -> index.html
  /privacy         -> privacy.html        e /privacy.html -> privacy.html, 200
  /index           -> index.html          nessun redirect, in nessuna direzione
  /figure, /figure/ -> 404                 una cartella non si elenca e non si apre
  inesistente      -> 404, «404 Not Found» in testo semplice
  Cache-Control    -> quello di site/_headers se c'e' una regola, altrimenti
                      `public, max-age=0, must-revalidate`; `no-cache` sul 404

Fino alla 0.26 l'host precedente rispondeva **308** al percorso con
l'estensione, e questo file riproduceva quel 308 (la storia e' nel CHANGELOG). Sul nuovo host non esiste
piu', quindi non lo riproduce: simulare in locale un redirect che la produzione
non fa sarebbe la stessa divergenza, girata al contrario. La regola che quel 308
aveva fatto nascere — indirizzi senza `.html` nel guscio e nei link — resta, e la
tengono ferma i test, non questo file.

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
CACHE_PREDEFINITA = 'public, max-age=0, must-revalidate'


def leggi_headers(radice):
    """Le regole di site/_headers, per percorso esatto: {percorso: [(nome, valore)]}.

    Il formato e' quello che statichost.eu applica (e Pages prima di lui): una
    riga col percorso, poi le intestazioni rientrate. Qui basta il percorso
    esatto, perche' il file oggi non usa caratteri jolly — se un giorno li usa,
    il test su serve.py e' il posto dove accorgersene.
    """
    regole, corrente = {}, None
    try:
        righe = open(os.path.join(radice, '_headers'), encoding='utf-8').read().splitlines()
    except OSError:
        return regole
    for riga in righe:
        if not riga.strip() or riga.lstrip().startswith('#'):
            continue
        if not riga[0].isspace():
            corrente = riga.strip()
            regole.setdefault(corrente, [])
        elif corrente and ':' in riga:
            nome, valore = riga.strip().split(':', 1)
            regole[corrente].append((nome.strip(), valore.strip()))
    return regole


class Statichost(http.server.SimpleHTTPRequestHandler):
    silenzioso = False

    def send_head(self):
        percorso = self.path.split('?', 1)[0].split('#', 1)[0]
        self._percorso = percorso
        disco = os.path.join(self.directory, percorso.lstrip('/'))
        if percorso == '/':
            self.path = '/index.html'
        elif os.path.isdir(disco) or percorso.endswith('/'):
            # Una cartella non si apre: statichost.eu risponde 404 anche a
            # /figure/, dove http.server mostrerebbe l'elenco dei file.
            return self._non_trovato()
        elif not os.path.isfile(disco):
            # L'indirizzo pulito: se esiste il .html corrispondente, e' lui.
            if not os.path.splitext(percorso)[1] and os.path.isfile(disco + '.html'):
                self.path = percorso + '.html'
            else:
                return self._non_trovato()
        return super().send_head()

    def _non_trovato(self):
        corpo = b'404 Not Found'
        self.send_response(404)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Content-Length', str(len(corpo)))
        self._cache = 'no-cache'
        self.end_headers()
        self.wfile.write(corpo)
        return None

    def end_headers(self):
        regole = self.server.headers_sito.get(getattr(self, '_percorso', None), [])
        if not any(n.lower() == 'cache-control' for n, _ in regole):
            self.send_header('Cache-Control', getattr(self, '_cache', CACHE_PREDEFINITA))
        for nome, valore in regole:
            self.send_header(nome, valore)
        super().end_headers()

    def log_message(self, formato, *argomenti):
        if not self.silenzioso:
            super().log_message(formato, *argomenti)


def server(porta, silenzioso=False):
    gestore = functools.partial(type('Gestore', (Statichost,), {'silenzioso': silenzioso}),
                                directory=RADICE)
    s = http.server.ThreadingHTTPServer(('127.0.0.1', porta), gestore)
    s.headers_sito = leggi_headers(RADICE)
    return s


def main():
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8787
    with server(porta) as s:
        print('http://127.0.0.1:%d  (Ctrl-C per fermare)' % porta)
        try:
            s.serve_forever()
        except KeyboardInterrupt:
            print()


if __name__ == '__main__':
    main()
