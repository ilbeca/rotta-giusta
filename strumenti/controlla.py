# -*- coding: utf-8 -*-
"""Il guardiano: fallisce se nel repo rientra qualcosa che non deve essere pubblicato.

Va eseguito come test del progetto, non una volta sola. Un'istruzione in un
prompt e' una promessa; questo e' un controllo. Lo esegue anche
tests/test_dati.py, che pretende l'uscita 0.

    python3 strumenti/controlla.py     # da qualsiasi cwd; esce con 1 se qualcosa non va

Esamina tutti i file di testo del repo — non solo i JSON dei dati, perche' un
README o un CHANGELOG ripubblicano esattamente come un dataset — e controlla:

  1. nessuna delle SEI annotazioni dei docenti dell'associazione da cui veniva
     il foglio di lavoro originario, cercate per frase intera e non per doppio
     a-capo (la sesta, 5.3.1-10, e' attaccata senza separatore: e' cosi' che
     era sfuggita al README del seed, che ne dichiarava cinque);
  2. nessuna delle 15 etichette di tecnica del loro vocabolario;
  3. nessun file di provenienza non dichiarata (l'xlsx del seed vecchio, che
     nessuna riga di codice legge e che non ha una fonte scritta);
  4. nessun nome dell'associazione: il materiale non e' loro solo quando non e'
     ricopiato, e' loro anche quando li si cita come fonte di un foglio che qui
     non c'e' piu';
  5. nessun identificatore delle macchine private dell'autore (hostname, rete,
     indirizzo, nome di battesimo). Le stringhe cercate NON compaiono in
     chiaro nemmeno qui: si confrontano impronte SHA-256, vedi IMPRONTE.

I punti 1, 2 e 4 esentano questo file e prepara.py: sono i due strumenti che
devono poter nominare cio' che cercano, altrimenti la regola non e' leggibile.
Nessun altro file e' esente, README e CHANGELOG compresi.
"""
import hashlib, os, re, sys
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent

# Cosa e' «testo» in questo repo. I file senza estensione (LICENSE, VERSION,
# .gitignore) vengono pubblicati come gli altri, quindi si leggono anche loro;
# cio' che non e' UTF-8 (i PNG, il PDF, un .DS_Store) si salta da solo.
ESTENSIONI = {'.json', '.md', '.html', '.js', '.py', '.yaml', '.txt', '.mjs'}
CARTELLE_ESCLUSE = {'_materiali', '.git', 'node_modules', '__pycache__'}

# I due strumenti che possono nominare cio' che cercano (percorsi dalla radice).
ESENTI = {'strumenti/controlla.py', 'strumenti/prepara.py'}

# Frasi INTERE, non parole sciolte: «errore» e «imprecisione» compaiono nei testi
# ministeriali («margine di errore del G.P.S.») e darebbero falsi allarmi. Il
# primo giro di questo controllo ne ha prodotti quattro, tutti su quiz.json.
SPIA = re.compile(r'('
    r'ERRORE NELLA SOLUZIONE MINISTERIALE'
    r'|IMPRECISIONE NEL TESTO MINISTERIALE'
    r'|DUBBI SUL RISULTATO MINISTERIALE'
    r'|TOLLERANZA SFALSATA'
    r'|la soluzione esatta \xe8'
    r'|se si considera il faro, si ottiene'
    r')', re.I)

ETICHETTE_LNI = {
    'Deriva DD', 'Deriva 1° caso', 'Deriva 2° caso', 'Deriva 3° caso', 'Deriva 4° caso',
    'Scarroccio 2° caso', 'Scarroccio 3° caso', 'PN da GPS', 'PN per luoghi di posizione',
    'PN 1 rilev. x2', 'PN 2 rilev. x2', 'PN rilev. 45°/90°', 'Rilev. polare',
    'Rilev. polare 90°', 'Intercettazione',
}
# Le etichette si cercano come stringa intera delimitata, non come parola:
# «Intercettazione» da sola e' italiano corrente, tra virgolette o in una lista
# e' il loro vocabolario.
ETICHETTE_RE = re.compile(r'(?<![\w])(%s)(?![\w])' % '|'.join(
    re.escape(e) for e in sorted(ETICHETTE_LNI, key=len, reverse=True)))

# Il nome dell'associazione, la sua sigla, e come chiamavano il loro documento.
TERZI = re.compile(r'(Lega Navale|\bLNI\b|foglio di lavoro)', re.I)

VIETATI = ['Banca-dati-patente-nautica.xlsx']

# Impronte SHA-256 dei token da non pubblicare, in minuscolo. Sono impronte e
# non stringhe perche' il controllo e' pubblico quanto il repo: scrivere qui
# «cerca questo hostname» lo pubblicherebbe. Ordine: 1 hostname della macchina,
# 2-4 la rete privata (il nome corto, il dominio, il nome completo della
# macchina), 5 l'indirizzo IP, 6 il nome di battesimo dell'autore.
# Per rigenerarne una (o aggiungerne):
#   python3 -c "import hashlib; print(hashlib.sha256(b'<token minuscolo>').hexdigest())"
IMPRONTE = [
    'f030f9037e237597a7baaffe54f93918cbb2a4ef16158e217d6ff15ddee40a24',
    'fd3965880719ae909856f0e10dee16a0ed2220f95fecc604e8fcbf91fa7743ae',
    'f3f3d79d32a1cd2caed99b081605a7d5c872b7ed4f526e7159272251268ab560',
    '7ec635dc62e23b8277b7f7e107a32dab88ea08e954fbaf8fcf82cbfa099686e0',
    'd39d42586f9727fc869598e0ef806e476a4ba0261e048e5b6dbcd3a4052ee48e',
    'a2cab1deca58c8353168310f520c3bb7e45466e6722d771bed19126077b58703',
]
IMPRONTA_K = {h: k + 1 for k, h in enumerate(IMPRONTE)}

# Un token e' una parola con dentro punti, trattini e underscore: cosi' un IP
# dentro `http://1.2.3.4:8610` esce intero (i `:` e `/` lo delimitano) e un
# nome di macchina completo esce come un token solo. Per prendere anche le
# parti di un nome completo, ogni token si spezza pure sui punti.
TOKEN = re.compile(r'[A-Za-z0-9][A-Za-z0-9._-]*')


def impronta(s):
    return hashlib.sha256(s.lower().encode('utf-8')).hexdigest()


def file_di_testo():
    """Tutti i file di testo del repo, in ordine, come percorsi dalla radice."""
    trovati = []
    for cartella, sotto, nomi in os.walk(RADICE):
        sotto[:] = sorted(s for s in sotto if s not in CARTELLE_ESCLUSE)
        for nome in sorted(nomi):
            p = Path(cartella) / nome
            if p.suffix and p.suffix not in ESTENSIONI:
                continue
            try:
                testo = p.read_bytes().decode('utf-8')
            except UnicodeDecodeError:
                continue
            if '\0' in testo:
                continue
            trovati.append((p.relative_to(RADICE).as_posix(), testo))
    return trovati


def contesto(testo, pos, prima=60, dopo=70):
    return ' '.join(testo[max(0, pos - prima):pos + dopo].split())


def controlla_testo(rel, testo):
    guai = []
    if rel not in ESENTI:
        for m in SPIA.finditer(testo):
            guai.append('annotazione di terzi in %s: …%s…' % (rel, contesto(testo, m.start())))
        for m in ETICHETTE_RE.finditer(testo):
            guai.append('etichetta di tecnica di terzi «%s» in %s' % (m.group(1), rel))
        for m in TERZI.finditer(testo):
            guai.append('nome di terzi «%s» in %s: …%s…' % (m.group(1), rel, contesto(testo, m.start(), 40, 50)))

    # Gli identificatori privati si riportano per numero d'impronta e riga, mai
    # per token: il messaggio d'errore finisce nei log quanto il repo.
    for n, riga in enumerate(testo.split('\n'), 1):
        visti = set()
        for tok in TOKEN.findall(riga):
            pezzi = [tok] + (tok.split('.') if '.' in tok else [])
            for pz in pezzi:
                k = IMPRONTA_K.get(impronta(pz))
                if k and k not in visti:
                    visti.add(k)
                    guai.append('identificatore privato #%d in %s:%d' % (k, rel, n))
    return guai


def main():
    guai = []
    esaminati = file_di_testo()
    for rel, testo in esaminati:
        guai.extend(controlla_testo(rel, testo))

    for cartella, sotto, nomi in os.walk(RADICE):
        sotto[:] = [s for s in sotto if s not in CARTELLE_ESCLUSE]
        for v in VIETATI:
            if v in nomi:
                guai.append('file di provenienza non dichiarata: %s'
                            % (Path(cartella) / v).relative_to(RADICE).as_posix())

    print('esaminati %d file di testo:' % len(esaminati))
    for rel, _ in esaminati:
        print('  ', rel)

    if guai:
        print('CONTROLLO FALLITO — %d problemi:' % len(guai))
        for g in guai:
            print('  ', g)
        sys.exit(1)
    print('controllo superato: nessuna annotazione o etichetta di terzi, nessun loro')
    print('nome, nessun file di provenienza non dichiarata, nessun identificatore privato.')


if __name__ == '__main__':
    main()
