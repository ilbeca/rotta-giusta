# -*- coding: utf-8 -*-
"""Genera server/password-comuni.txt dalla fonte dichiarata, e ne controlla l'impronta.

docs/account-progetto.md §5.2. Il file si genera, non si trascrive: chiunque
puo' rifarlo, come fonte/verifica.py per il decreto.

    python3 strumenti/password_comuni.py             # scarica, controlla, scrive
    python3 strumenti/password_comuni.py --verifica  # rigenera in memoria e confronta

La fonte sono i «ten million passwords» di Mark Burnett (febbraio 2015,
pubblico dominio), nel file da un milione di SecLists (licenza MIT, la nota e'
nel README), fissato per commit e per impronta. Se la fonte scaricata non ha
l'impronta attesa lo script si ferma senza scrivere niente: un file che cambia
sotto i piedi non e' la fonte dichiarata.

Che cosa tiene, e perche' (NIST SP 800-63B-4, §3.1.1.2 e appendice A): solo le
voci da 15 a 256 caratteri — una password piu' corta la rifiuta gia' la
lunghezza, una piu' lunga il server —, portate in minuscolo, perche' il server
confronta la password intera in minuscolo; senza doppioni, ordinate.

Solo la libreria standard. L'impronta del file prodotto sta in USCITA_SHA256, e
tests/test_server.mjs pretende che il file nel repo abbia quella, e che il
README la dichiari.
"""
import hashlib
import sys
import urllib.request
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
DESTINAZIONE = RADICE / 'server' / 'password-comuni.txt'

COMMIT = 'c205c36a445bff37f8e58a9ec829105cd4975c58'   # SecLists, 8 maggio 2025
PERCORSO = 'Passwords/Common-Credentials/xato-net-10-million-passwords-1000000.txt'
FONTE = 'https://raw.githubusercontent.com/danielmiessler/SecLists/%s/%s' % (COMMIT, PERCORSO)
FONTE_SHA256 = '424a3e03a17df0a2bc2b3ca749d81b04e79d59cb7aeec8876a5a3f308d0caf51'
USCITA_SHA256 = 'cbdc28a68ea4bc20d214755fb333d816c55ceada6cc3da3bd9b70ecea42aead0'

MINIMO, MASSIMO = 15, 256


def filtra(testo):
    """Le voci che servono: lunghe quanto il minimo, in minuscolo, una volta sola."""
    tenute = set()
    for riga in testo.split('\n'):
        voce = riga.rstrip('\r')
        if MINIMO <= len(voce) <= MASSIMO:
            tenute.add(voce.lower())
    return ''.join(v + '\n' for v in sorted(tenute))


def scarica():
    with urllib.request.urlopen(FONTE, timeout=60) as r:
        dati = r.read()
    impronta = hashlib.sha256(dati).hexdigest()
    if impronta != FONTE_SHA256:
        sys.exit('la fonte scaricata ha impronta %s, non %s: non scrivo niente' % (impronta, FONTE_SHA256))
    return dati.decode('utf-8')


def main():
    uscita = filtra(scarica()).encode('utf-8')
    impronta = hashlib.sha256(uscita).hexdigest()
    voci = uscita.count(b'\n')
    print('fonte %s, impronta verificata' % FONTE)
    print('tenute %d voci, %d byte, impronta %s' % (voci, len(uscita), impronta))
    if '--verifica' in sys.argv:
        attuale = DESTINAZIONE.read_bytes() if DESTINAZIONE.exists() else b''
        if attuale != uscita:
            sys.exit('%s non e\' quello che la fonte produce' % DESTINAZIONE.relative_to(RADICE))
        print('%s coincide byte per byte' % DESTINAZIONE.relative_to(RADICE))
        return
    if impronta != USCITA_SHA256:
        sys.exit('l\'uscita ha impronta %s, lo script dichiara %s: non scrivo niente'
                 % (impronta, USCITA_SHA256))
    DESTINAZIONE.write_bytes(uscita)
    print('scritto %s' % DESTINAZIONE.relative_to(RADICE))


if __name__ == '__main__':
    main()
