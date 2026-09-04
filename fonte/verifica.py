# -*- coding: utf-8 -*-
"""Verifica che i testi del carteggio pubblicati siano quelli del decreto.

Perche' esiste: gli esercizi di carteggio sono arrivati in questo progetto
attraverso una trascrizione, non direttamente dal PDF. Se i testi coincidono
con l'Allegato A al DD 131/2022, allora la trascrizione e' stata solo un
veicolo e i testi sono un atto ufficiale dello Stato (art. 5 L. 633/1941),
quindi pubblicabili senza licenza e senza debiti. Se non coincidessero, non lo
sarebbero. Chiunque puo' rifare il controllo: il PDF e' qui accanto.

Eseguito il 4 settembre 2026: 135 testi su 135 e 134 risposte su 135 ritrovati
nel decreto. L'unica differenza e' in 5.1.3-3, dove i dati aggiungono una "E"
alla prima longitudine che il PDF non scrive: notazione, non contenuto.

    pip3 install pypdf          # una volta
    python3 fonte/verifica.py   # da qualsiasi cartella
"""
import json, re, sys, unicodedata

from pathlib import Path
QUI  = Path(__file__).resolve().parent
PDF  = QUI / 'allegato-A-DD-131-2022.pdf'
DATI = QUI.parent / 'site' / 'dati' / 'carteggio.json'

def norm(t):
    t = unicodedata.normalize('NFKD', t or '')
    t = ''.join(c for c in t if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', t.lower().replace('’', "'"))

def main():
    try:
        import pypdf
    except ImportError:
        sys.exit('serve pypdf:  pip3 install pypdf')
    r = pypdf.PdfReader(str(PDF))
    P = norm(' '.join((p.extract_text() or '') for p in r.pages))
    sl = json.load(open(DATI, encoding='utf-8'))

    testi = risposte = 0
    diff = []
    for e in sl:
        t = norm(e['testo'])
        # tre sonde da punti diversi: l'estrazione del PDF interlaccia le colonne,
        # quindi non si puo' pretendere una corrispondenza contigua di tutto.
        sonde = [t[10:70], t[len(t)//2-30:len(t)//2+30], t[-70:-10]]
        if sum(1 for s in sonde if len(s) > 25 and s in P) >= 2:
            testi += 1
        else:
            diff.append((e['id'], 'testo non ritrovato'))
        # la risposta si cerca NELLA FINESTRA del suo esercizio, non ovunque:
        # molte sono corte ("Vp=9÷11 kn") e altrove darebbero falsi positivi.
        k = P.find(sonde[1])
        risp = norm((e['risposta_ufficiale'] or '').split('\n\n')[0])
        if k >= 0 and risp and risp in P[max(0, k-len(t)): k+len(t)+700]:
            risposte += 1
        else:
            diff.append((e['id'], 'risposta non ritrovata'))

    print('testi ritrovati nel decreto:    %d su %d' % (testi, len(sl)))
    print('risposte ritrovate nel decreto: %d su %d' % (risposte, len(sl)))
    for i, m in diff:
        print('   %-9s %s' % (i, m))

if __name__ == '__main__':
    main()
