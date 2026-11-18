# -*- coding: utf-8 -*-
"""Compone le sorgenti dei concetti in site/dati/concetti.json, e il conteggio in meta.json.

    python3 strumenti/concetti/componi.py            # scrive, o esce 1 con l'elenco dei guai
    python3 strumenti/concetti/componi.py --verifica # non scrive: esce 1 se i file pubblicati
                                                     # non sono la composizione delle sorgenti

Una sorgente per tema, `strumenti/concetti/<tema>.json`, perche' nove sessioni in
parallelo non scrivano lo stesso file (piano-2026-11 §4, B-2). Si leggono TUTTE le
sorgenti presenti nella cartella, e solo quelle: le seconde letture stanno in
`seconda-lettura/` e non entrano. Il file pubblicato non si scrive a mano: un test
pretende che sia esattamente questa composizione, byte per byte.

La forma di una sorgente:

    {"tema": "<come in meta.json temi[].tema, oppure VELA>",
     "data": ..., "stato": ...,
     "famiglie": [{"id", "nome", "voce": "<v esatta di quiz.json>", "concetti": [id, ...]}],
     "concetti": [{"id", "nome", "parole_chiave": [...], "copre"}],
     "quesiti":  {"base-727": [id, ...]}}

Campi in piu' (`rilettura`, il conto `quesiti` dentro un concetto) sono ammessi e
non passano nel file pubblicato: il conto si rifa' qui, dai tag.

La classificazione e' di Rotta Giusta, non del decreto, come le 12 tecniche.
"""
import json
import sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
RADICE = QUI.parent.parent
sys.path.insert(0, str(RADICE / 'strumenti'))
from controlla import ETICHETTE_RE, TERZI  # noqa: E402

MIN_QUESITI = 3       # un concetto con meno quesiti non dice niente su chi lo sbaglia
MAX_TAG = 3           # da uno a tre concetti per quesito (pilota, §2)
NOTA = ('Concetti e famiglie sono una classificazione di Rotta Giusta, non ministeriale: '
        'li ha scritti Claude leggendo testi e figure dei quesiti. Le parole chiave sono '
        'quelle da cercare nell\'indice di un manuale. Il file si compone da '
        'strumenti/concetti/ con componi.py: non si scrive a mano.')


def leggi_sorgenti(cartella=QUI):
    """Le sorgenti presenti, come (nome del file, contenuto), in ordine di nome."""
    return [(p.name, json.loads(p.read_text(encoding='utf-8')))
            for p in sorted(cartella.glob('*.json'))]


def _testi_di(c):
    yield c.get('nome', '')
    yield c.get('copre', '')
    yield from c.get('parole_chiave', [])


def componi(sorgenti, quiz, meta):
    """Restituisce (dati da pubblicare, elenco dei guai). Con un guaio i dati sono None."""
    guai = []
    per_id = {q['id']: q for q in quiz}
    ordine_q = {q['id']: i for i, q in enumerate(quiz)}
    temi = [t['tema'] for t in meta['temi']] + ['VELA']
    voci_di = {}
    for q in quiz:
        voci_di.setdefault(q['t'], set()).add(q['v'])

    visti_temi, id_concetti, id_famiglie = {}, {}, {}
    for nome, s in sorgenti:
        t = s.get('tema')
        if t not in temi:
            guai.append('%s: tema %r sconosciuto (deve essere uno di meta.json, o VELA)' % (nome, t))
            continue
        if t in visti_temi:
            guai.append('%s: il tema %s ha gia\' la sorgente %s' % (nome, t, visti_temi[t]))
            continue
        visti_temi[t] = nome
        for c in s.get('concetti', []):
            if c.get('id') in id_concetti:
                guai.append('%s: l\'id di concetto %r c\'e\' gia\' in %s (gli id sono globali)'
                            % (nome, c.get('id'), id_concetti[c.get('id')]))
            id_concetti.setdefault(c.get('id'), nome)
        for f in s.get('famiglie', []):
            if f.get('id') in id_famiglie or f.get('id') in id_concetti:
                guai.append('%s: l\'id di famiglia %r c\'e\' gia\' (gli id sono globali)' % (nome, f.get('id')))
            id_famiglie.setdefault(f.get('id'), nome)

    if guai:
        return None, guai

    in_ordine = sorted(sorgenti, key=lambda ns: temi.index(ns[1]['tema']))
    famiglie, concetti, quesiti = [], [], {}
    for nome, s in in_ordine:
        t = s['tema']
        ids = [c['id'] for c in s.get('concetti', [])]
        famiglia_di = {}
        for f in s.get('famiglie', []):
            if f.get('voce') not in voci_di.get(t, ()):
                guai.append('%s: la famiglia %s ha voce %r, che il tema non ha' % (nome, f.get('id'), f.get('voce')))
            if not f.get('nome'):
                guai.append('%s: la famiglia %s non ha un nome' % (nome, f.get('id')))
            for c in f.get('concetti', []):
                if c not in ids:
                    guai.append('%s: la famiglia %s nomina il concetto %r, che la sorgente non ha' % (nome, f['id'], c))
                elif c in famiglia_di:
                    guai.append('%s: il concetto %s sta in due famiglie, %s e %s' % (nome, c, famiglia_di[c], f['id']))
                else:
                    famiglia_di[c] = f['id']
        for c in ids:
            if c not in famiglia_di:
                guai.append('%s: il concetto %s non sta in nessuna famiglia' % (nome, c))

        tag = s.get('quesiti', {})
        conto = {c: 0 for c in ids}
        for qid, cs in tag.items():
            if qid not in per_id:
                guai.append('%s: il quesito %s non c\'e\' nella banca' % (nome, qid))
                continue
            if per_id[qid]['t'] != t:
                guai.append('%s: il quesito %s e\' del tema %s, non di %s' % (nome, qid, per_id[qid]['t'], t))
            if not 1 <= len(cs) <= MAX_TAG or len(set(cs)) != len(cs):
                guai.append('%s: il quesito %s ha %r: da 1 a %d concetti, senza doppioni' % (nome, qid, cs, MAX_TAG))
            for c in cs:
                if c not in conto:
                    guai.append('%s: il quesito %s nomina il concetto %r, che la sorgente non ha' % (nome, qid, c))
                else:
                    conto[c] += 1
        for q in quiz:
            if q['t'] == t and q['id'] not in tag:
                guai.append('%s: il quesito %s del tema non ha concetti' % (nome, q['id']))

        for c in s.get('concetti', []):
            for campo in ('nome', 'copre'):
                if not c.get(campo):
                    guai.append('%s: il concetto %s non ha %s' % (nome, c['id'], campo))
            if not c.get('parole_chiave'):
                guai.append('%s: il concetto %s non ha parole chiave' % (nome, c['id']))
            for testo in list(_testi_di(c)):
                if ETICHETTE_RE.search(testo) or TERZI.search(testo):
                    guai.append('%s: il concetto %s usa un\'etichetta o un nome vietato: %r' % (nome, c['id'], testo))
            if conto[c['id']] < MIN_QUESITI:
                guai.append('%s: il concetto %s ha %d quesiti, ne servono almeno %d'
                            % (nome, c['id'], conto[c['id']], MIN_QUESITI))
            concetti.append({'id': c['id'], 'nome': c['nome'], 'parole_chiave': c.get('parole_chiave', []),
                             'copre': c.get('copre', ''), 'tema': t, 'famiglia': famiglia_di.get(c['id']),
                             'quesiti': conto[c['id']]})
        for f in s.get('famiglie', []):
            if ETICHETTE_RE.search(f.get('nome', '')) or TERZI.search(f.get('nome', '')):
                guai.append('%s: la famiglia %s usa un\'etichetta o un nome vietato' % (nome, f['id']))
            famiglie.append({'id': f['id'], 'nome': f.get('nome', ''), 'tema': t, 'voce': f.get('voce'),
                             'concetti': list(f.get('concetti', []))})
        for qid, cs in tag.items():
            if qid in per_id:
                quesiti[qid] = list(cs)

    if guai:
        return None, guai
    quesiti = dict(sorted(quesiti.items(), key=lambda kv: ordine_q[kv[0]]))
    dati = {
        'nota': NOTA,
        'sorgenti': [nome for nome, _ in in_ordine],
        'temi': [s['tema'] for _, s in in_ordine],
        'famiglie': famiglie,
        'concetti': concetti,
        'quesiti': quesiti,
    }
    return dati, []


def testo_concetti(dati):
    return json.dumps(dati, ensure_ascii=False, indent=1) + '\n'


def meta_con_conteggio(meta, dati):
    """meta.json con il conteggio dei concetti in stats, nello stesso formato del file."""
    nuovo = json.loads(json.dumps(meta))
    nuovo['stats']['concetti'] = len(dati['concetti'])
    nuovo['stats']['famiglie_concetti'] = len(dati['famiglie'])
    nuovo['stats']['quesiti_con_concetti'] = len(dati['quesiti'])
    return nuovo


def testo_meta(meta):
    # Lo stesso formato con cui meta.json e' scritto: indent 1, UTF-8, senza a capo finale.
    return json.dumps(meta, ensure_ascii=False, indent=1)


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    dati_dir = RADICE / 'site' / 'dati'
    quiz = json.loads((dati_dir / 'quiz.json').read_text(encoding='utf-8'))
    meta = json.loads((dati_dir / 'meta.json').read_text(encoding='utf-8'))
    dati, guai = componi(leggi_sorgenti(), quiz, meta)
    if guai:
        print('%d guai, niente scritto:' % len(guai))
        for g in guai:
            print('  ', g)
        return 1
    attesi = {dati_dir / 'concetti.json': testo_concetti(dati),
              dati_dir / 'meta.json': testo_meta(meta_con_conteggio(meta, dati))}
    if '--verifica' in argv:
        diversi = [p.name for p, t in attesi.items() if not p.exists() or p.read_text(encoding='utf-8') != t]
        if diversi:
            print('non sono la composizione delle sorgenti: %s' % ', '.join(diversi))
            return 1
        print('concetti.json e meta.json sono la composizione delle sorgenti')
        return 0
    for p, t in attesi.items():
        p.write_text(t, encoding='utf-8')
    print('%d sorgenti, %d concetti, %d famiglie, %d quesiti etichettati' % (
        len(dati['sorgenti']), len(dati['concetti']), len(dati['famiglie']), len(dati['quesiti'])))
    return 0


if __name__ == '__main__':
    sys.exit(main())
