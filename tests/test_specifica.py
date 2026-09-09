#!/usr/bin/env python3
"""La specifica non puo' mentire sulla propria copertura.

`docs/specifica.md`, §9, numera i requisiti del prodotto e per ognuno nomina il
controllo che lo dimostra. Questo file legge quella sezione e verifica che il
controllo **esista davvero**: un requisito che nomina un test inesistente e' una
garanzia dichiarata e non mantenuta.

Perche' proprio qui. Il difetto fondativo di questo progetto e' il semaforo
verde a copertura zero: uno strumento che rassicura mentre non misura niente.
Una specifica che elenca garanzie senza controlli e' la stessa cosa in forma di
prosa, e invecchiando diventa peggio — perche' la si cita.

L'alternativa a un requisito coperto non e' toglierlo: e' scrivere **scoperto**
con il motivo. Sei dei quaranta lo sono, e sono i piu' interessanti, perche'
dicono che cosa oggi si puo' verificare solo guidando la pagina a mano.

    python3 tests/test_specifica.py
"""

import re
import sys
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
SPEC = RADICE / 'docs' / 'specifica.md'
TESTS = RADICE / 'tests'

fatti = 0
falliti = []


def check(nome, cond, extra=''):
    global fatti
    fatti += 1
    if not cond:
        falliti.append(nome + (' — ' + extra if extra else ''))


# Una riga di requisito: | R-FAM-NN | testo | controllo |
RIGA = re.compile(r'^\|\s*(R-[A-Z]+-\d+)\s*\|(.+?)\|(.+?)\|\s*$', re.M)
# Un controllo: `file::nome del test`
CTRL = re.compile(r'^`([a-z_]+\.(?:py|mjs))::(.+)`$')


def requisiti(testo):
    return [(m.group(1), m.group(2).strip(), m.group(3).strip())
            for m in RIGA.finditer(testo)]


def test_forma():
    testo = SPEC.read_text(encoding='utf-8')
    reqs = requisiti(testo)
    check('la specifica contiene dei requisiti numerati', len(reqs) >= 20,
          'trovati %d: il §9 e\' sparito o ha cambiato forma' % len(reqs))

    ids = [r[0] for r in reqs]
    doppi = sorted({i for i in ids if ids.count(i) > 1})
    check('nessun identificatore e\' usato due volte', not doppi,
          'ripetuti: ' + ', '.join(doppi))

    for rid, testo_req, _ in reqs:
        check('%s dice che cosa deve essere vero' % rid, len(testo_req) > 15,
              'il testo del requisito e\' vuoto o troppo corto per significare qualcosa')


def test_ogni_requisito_ha_un_controllo():
    testo = SPEC.read_text(encoding='utf-8')
    for rid, _, ctrl in requisiti(testo):
        if ctrl.startswith('scoperto'):
            # «scoperto» e' una risposta accettabile. «scoperto» e basta no:
            # senza il motivo, fra sei mesi nessuno sa se e' difficile o se e'
            # stato solo dimenticato.
            motivo = ctrl.split('—', 1)[1].strip() if '—' in ctrl else ''
            check('%s dichiara perche\' e\' scoperto' % rid, len(motivo) > 15,
                  'scrivi «scoperto — <perche\'>»')
            continue

        m = CTRL.match(ctrl)
        check('%s nomina un controllo in forma leggibile' % rid, m is not None,
              'atteso `file::nome del test` oppure «scoperto — perche\'», '
              'trovato: %s' % ctrl[:60])
        if not m:
            continue

        f, nome = m.group(1), m.group(2)
        p = TESTS / f
        check('%s: il file %s esiste' % (rid, f), p.exists(),
              'il requisito nomina una suite che non c\'e\'')
        if not p.exists():
            continue
        check('%s: %s contiene «%s»' % (rid, f, nome),
              nome in p.read_text(encoding='utf-8'),
              'il test nominato non esiste piu\': o e\' stato rinominato, e '
              'allora si aggiorna la riga, o e\' stato tolto, e allora il '
              'requisito e\' scoperto e va detto')


def test_nessun_riferimento_appeso():
    """Un ID citato altrove nel documento deve essere definito nel §9."""
    testo = SPEC.read_text(encoding='utf-8')
    definiti = {r[0] for r in requisiti(testo)}
    citati = set(re.findall(r'\bR-[A-Z]+-\d+\b', testo))
    appesi = sorted(citati - definiti)
    check('ogni requisito citato nel documento e\' definito nel §9', not appesi,
          'citati e mai definiti: ' + ', '.join(appesi))


def main():
    check('docs/specifica.md esiste', SPEC.exists())
    if not SPEC.exists():
        print('1 verifiche FALLITE su 1:\n\n  ✗ docs/specifica.md non c\'e\'')
        sys.exit(1)
    test_forma()
    test_ogni_requisito_ha_un_controllo()
    test_nessun_riferimento_appeso()
    if falliti:
        print('%d verifiche FALLITE su %d:\n' % (len(falliti), fatti))
        for f in falliti:
            print('  ✗ ' + f)
        sys.exit(1)
    print('%d verifiche passate' % fatti)


if __name__ == '__main__':
    main()
