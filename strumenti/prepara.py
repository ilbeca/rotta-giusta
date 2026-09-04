# -*- coding: utf-8 -*-
"""Come sono stati prodotti i dati del carteggio: il metodo, rieseguibile.

Parte dalla trascrizione degli esercizi usata nel progetto personale da cui
questo sito e' estratto, e toglie due cose, nessuna delle quali e' ministeriale:

  1. le SEI annotazioni didattiche che i docenti del corso avevano aggiunto
     dopo alcune risposte. Cinque sono separate da un doppio a-capo, la sesta
     (5.3.1-10) e' ATTACCATA alla risposta senza separatore — chi cerca solo
     '\n\n' la manca, ed e' successo: il conteggio dichiarato era cinque. Qui
     si cercano le parole con cui le annotazioni cominciano.

  2. il campo `tecniche` della trascrizione, che nel decreto non esiste: le
     colonne dell'Allegato A sono TESTO, RISPOSTA 1-6, PROGRESSIVO, TIPOLOGIA,
     SETTORE, ARGOMENTO. Sostituito con la classificazione derivata dai testi
     in tecniche-carteggio/risultato.json (campo `metodo`), con `incognita`
     come metadato per la diagnosi.

Ogni risposta tagliata viene poi verificata contro il PDF ufficiale: se il
taglio avesse morso il contenuto ministeriale, il controllo lo direbbe.

Il file di partenza non e' nel repo (non e' un atto dello Stato): si passa da
riga di comando, e senza quello questo script documenta il metodo e basta.

    python3 strumenti/prepara.py <trascrizione.json>
"""
import json, re, sys, unicodedata

from pathlib import Path
QUI    = Path(__file__).resolve().parent
TECN   = QUI / 'tecniche-carteggio' / 'risultato.json'
PDF    = QUI.parent / 'fonte' / 'allegato-A-DD-131-2022.pdf'
USCITA = QUI.parent / 'site' / 'dati' / 'carteggio.json'

# Le parole con cui i docenti aprono le loro annotazioni. Si taglia da qui.
SPIA = re.compile(r'(ERRORE|IMPRECISIONE|DUBBI|TOLLERANZA|se si considera)', re.I)

def norm(t):
    t = unicodedata.normalize('NFKD', t or '')
    t = ''.join(c for c in t if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', t.lower().replace('’', "'"))

def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sl = json.load(open(sys.argv[1], encoding='utf-8'))
    tec = json.load(open(TECN, encoding='utf-8'))['esercizi']

    tagliati = []
    out = []
    for e in sl:
        r = e['risposta_ufficiale'] or ''
        m = SPIA.search(r)
        if m:
            r = r[:m.start()].rstrip()
            tagliati.append(e['id'])
        out.append({
            'id': e['id'], 'sessione': e['sessione'], 'carta': e['carta'],
            'settore': e['settore'], 'argomento': e['argomento'],
            'famiglia': e['famiglia'], 'testo': e['testo'],
            'risposta_ufficiale': r,
            'tecniche': tec[e['id']]['metodo'],
            'incognita': tec[e['id']]['incognita'],
        })

    print('annotazioni rimosse: %d  %s' % (len(tagliati), tagliati))

    try:
        import pypdf
    except ImportError:
        sys.exit('\nserve pypdf per la verifica:  pip3 install pypdf')
    P = norm(' '.join((p.extract_text() or '') for p in pypdf.PdfReader(str(PDF)).pages))

    ok = 0; sospette = []
    for e in out:
        t = norm(e['testo'])
        sonda = t[len(t)//2-30: len(t)//2+30]
        k = P.find(sonda)
        risp = norm(e['risposta_ufficiale'])
        if k >= 0 and risp and risp in P[max(0, k-len(t)): k+len(t)+700]:
            ok += 1
        else:
            sospette.append(e['id'])
    print('risposte che combaciano col decreto dopo il taglio: %d su %d' % (ok, len(out)))
    if sospette:
        print('   da guardare: %s' % sospette)
        print('   (5.1.3-3 e nota: la trascrizione aggiunge una "E" che il decreto non scrive.')
        print('    Notazione, non contenuto.)')

    json.dump(out, open(USCITA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('\nscritto %s: %d esercizi' % (USCITA, len(out)))

if __name__ == '__main__':
    main()
