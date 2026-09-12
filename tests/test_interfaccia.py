#!/usr/bin/env python3
"""La struttura dell'interfaccia: che cosa esiste, e come ci si arriva.

Perche' esiste. Il 9 settembre 2026, durante il ridisegno della navigazione, la
schermata «Che tecnica serve?» ha perso il suo unico ingresso: la vista era
ancora nel file, la sua logica pure, e nessun elemento della pagina la apriva
piu'. Nello stesso ridisegno `E.peggiori()` e' rimasta senza chiamanti. Nessuna
delle due cose ha fatto fallire un test, perche' non esisteva da nessuna parte
un elenco di che cosa deve esistere e di come ci si arriva.

Questi controlli sono quell'elenco, in forma eseguibile. Sono la traduzione dei
requisiti R-NAV-* di `docs/specifica.md`, §9.4.

**Che cosa NON fanno.** Non decidono la struttura della navigazione: quante
voci abbia la barra e come si chiamino e' la questione Q-NAV, che decide
l'autore (specifica, §10). Un test che fissasse la composizione della barra
prenderebbe quella decisione al posto suo. Qui si controllano gli invarianti che
valgono con quattro destinazioni, con sette e con qualunque altra scelta.

    python3 tests/test_interfaccia.py
"""

import re
import sys
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
SITE = RADICE / 'site'

fatti = 0
falliti = []


def check(nome, cond, extra=''):
    global fatti
    fatti += 1
    if not cond:
        falliti.append(nome + (' — ' + extra if extra else ''))


def leggi(p):
    return (SITE / p).read_text(encoding='utf-8')


# --- il censimento, che e' anche la documentazione -----------------------------
#
# Aggiungere una schermata significa aggiungere una riga qui. E' voluto: e' il
# punto in cui qualcuno deve dire ad alta voce che cosa sta aggiungendo, e con
# quale ingresso.

VISTE = {
    'v-oggi': 'la Rotta (gia\' «Oggi»)',
    'v-quiz': 'i quiz (gia\' «Allenamento»)',
    'v-cart': 'l\'ambiente Carteggio',
    'v-diag': 'i progressi (gia\' «Diagnosi»)',
    'v-tec':  'il drill «Che tecnica serve?»',
    'v-seg':  'il gioco dei Segnali',
    'v-info': 'Info e diagnostica',
}

# Viste che si aprono per una via diversa da un `data-v`. Ogni riga porta il
# perche': una vista senza porta e senza eccezione dichiarata e' codice morto
# che sembra vivo.
PORTE_FUORI_DAL_DOM = {}

# Le sei modalita' dei quiz. Non sono sei varianti della stessa cosa: sono sei
# mestieri diversi, e la specifica (§4.2) dice perche' non si accorpano.
MODI = ['mirata', 'argomento', 'sbagliate', 'sim', 'screening', 'batteria']

# Export del motore che la pagina non chiama, e non e' un difetto. Ogni riga ha
# il motivo e, dove serve, la condizione alla quale sparisce.


# ── Che cosa la pagina consuma dal motore ─────────────────────────────────────
#
# Il gemello del controllo sugli orfani, dall'altro lato. Quello prende una
# funzione esportata che nessuno chiama; questo prende una funzione **che la
# pagina chiamava e non chiama piu'**.
#
# Esiste per un caso vero: nella merge della nuova Rotta — 468 righe in
# `app.html` — `E.peggiori()` e' uscita dal prodotto senza che nessuno lo
# decidesse, e l'ha trovata il controllo sugli orfani **dopo** la fusione.
# Questo la prenderebbe prima, e nominandola.
#
# Togliere una chiamata e' legittimo: si toglie anche di qui, e il commit dice
# perche'. Quello che non e' legittimo e' che sparisca in silenzio.
#
# ── Le eccezioni dichiarate stanno FUORI da qui ───────────────────────────────
#
# I controlli sono in questo file, che e' territorio `motore`; le eccezioni
# stanno in `docs/eccezioni-interfaccia.md`, che e' neutro. Non e' pignoleria:
# a togliere un'eccezione e' chi corregge il difetto, e chi corregge
# l'interfaccia lavora su `ui/*`, dove `tests/` gli e' precluso. Tenendole qui,
# una correzione lascerebbe la suite rossa e nessuno potrebbe chiuderla.
FONT_MINIMO = 11
ALT_GENERICI = {'figura', 'immagine', 'image', 'foto', 'grafico', 'icona', 'logo'}
ECCEZIONI = RADICE / 'docs' / 'eccezioni-interfaccia.md'


def tabella(titolo, colonne):
    """Le righe di una tabella markdown sotto un titolo, come tuple."""
    if not ECCEZIONI.exists():
        return None
    testo = ECCEZIONI.read_text(encoding='utf-8')
    m = re.search(r'^##\s+' + re.escape(titolo) + r'\s*$(.*?)(?=^## |\Z)',
                  testo, re.M | re.S)
    if not m:
        return None
    out = []
    # Le prime due righe di una tabella markdown sono intestazione e separatore:
    # si saltano per posizione, non per contenuto. Riconoscerle dal nome della
    # prima colonna vuol dire che una tabella nuova, con un'intestazione diversa,
    # si porta dentro la propria intestazione come se fosse un dato.
    for n, r in enumerate(re.findall(r'^\|(.+)\|\s*$', m.group(1), re.M)):
        if n < 2:
            continue
        celle = [c.strip().strip('`') for c in r.split('|')]
        if len(celle) != colonne:
            continue
        out.append(tuple(celle))
    return out


def senza_commenti(testo):
    """Toglie i commenti, per non scambiare una citazione per un uso.

    Euristica dichiarata, non un parser: si tolgono i blocchi /* */ e le righe
    che cominciano con //, * o <!--. Basta per questo file e non pretende di
    piu'; se un giorno non bastasse, il sintomo sarebbe un falso allarme, che e'
    il verso giusto in cui sbagliare.
    """
    testo = re.sub(r'/\*.*?\*/', ' ', testo, flags=re.S)
    righe = [r for r in testo.split('\n')
             if not re.match(r'\s*(//|\*|<!--)', r)]
    return '\n'.join(righe)


# --- 1. il censimento e' completo -----------------------------------------------

def test_viste_dichiarate():
    app = leggi('app.html')
    # `class` porta anche `on` e le classi dell'interfaccia nuova, quindi il
    # censimento non puo' pretendere la stringa esatta: cerca una sezione con
    # la classe `view` e un id `v-*`, comunque sia scritto l'attributo.
    trovate = set(re.findall(r'<section class="[^"]*\bview\b[^"]*" id="(v-[a-z]+)"', app))
    check('ogni vista del file e\' dichiarata qui',
          trovate <= set(VISTE),
          'non dichiarate: ' + ', '.join(sorted(trovate - set(VISTE))))
    check('ogni vista dichiarata esiste nel file',
          set(VISTE) <= trovate,
          'dichiarate ma assenti: ' + ', '.join(sorted(set(VISTE) - trovate)))


# --- 2. ogni vista ha una porta (R-NAV-01) ---------------------------------------

def test_ogni_vista_ha_una_porta():
    app = leggi('app.html')
    porte = set(re.findall(r'data-v="([a-z]+)"', app))
    for vid, cosa in sorted(VISTE.items()):
        chiave = vid[2:]
        ok = chiave in porte or vid in PORTE_FUORI_DAL_DOM
        check('si puo\' aprire: %s' % cosa, ok,
              'la vista #%s esiste ma nessun elemento la apre. Se e\' voluto, '
              'dichiaralo in PORTE_FUORI_DAL_DOM col perche\'.' % vid)


# --- 3. la barra si legge, e non porta altrove (R-NAV-03) -------------------------

def test_voci_barra():
    app = leggi('app.html')
    m = re.search(r'<nav[^>]*>(.*?)</nav>', app, flags=re.S)
    check('la pagina ha una barra di navigazione', m is not None)
    if not m:
        return
    voci = re.findall(r'<button[^>]*data-v="([a-z]+)"[^>]*>(.*?)</button>',
                      m.group(1), flags=re.S)
    check('la barra ha almeno una voce', len(voci) > 0)
    for dest, dentro in voci:
        check('la voce «%s» porta a una vista dichiarata' % dest,
              'v-' + dest in VISTE,
              'porta a #v-%s, che non e\' nel censimento' % dest)
        # Un'icona sola non e' un'etichetta: la parola fa tutto il lavoro, e a
        # 375 px la parola c'e' sempre stata. Se sparisse, sparirebbe in
        # silenzio.
        testo = re.sub(r'<[^>]+>', '', dentro).strip()
        check('la voce «%s» ha un\'etichetta di testo' % dest, len(testo) > 0,
              'solo icona: a chi non riconosce il simbolo la voce non dice niente')


# --- 4. le sei modalita' ci sono tutte (R-NAV-04) ---------------------------------

def test_modalita_quiz():
    app = leggi('app.html')
    m = re.search(r'const MODI = \[(.*?)\];', app, flags=re.S)
    check('la pagina dichiara l\'elenco delle modalita\'', m is not None)
    if not m:
        return
    chiavi = re.findall(r"\['([a-z]+)'", m.group(1))
    for k in MODI:
        check('esiste la modalita\' «%s»' % k, k in chiavi,
              'sparita dall\'elenco MODI')
    check('non ci sono modalita\' non dichiarate',
          set(chiavi) <= set(MODI),
          'in piu\': ' + ', '.join(sorted(set(chiavi) - set(MODI))))


# --- 5. i due selettori globali (R-NAV-05) ----------------------------------------

def test_selettori():
    app = senza_commenti(leggi('app.html'))
    check('esiste il selettore «solo domande mai fatte»',
          'mai fatte' in app and 'S.prep' in app,
          'e\' il filtro che vale su piu\' modalita\': se sparisce, spariscono '
          'anche le frasi che dichiarano dove NON vale')
    check('esiste il filtro «solo quesiti con figura»',
          'soloFigura' in app,
          'all\'esame 119 quesiti mostrano un disegno: e\' l\'unico modo di '
          'vederli tutti')


# --- 6. il motore non ha funzioni orfane (R-NAV-02) --------------------------------

def orfani_dichiarati():
    """{funzione: motivo}, dal file neutro."""
    righe = tabella('Funzioni del motore che nessuno chiama', 2)
    return None if righe is None else {f: m for f, m in righe}


def chiamate_protette():
    """I nomi che la pagina deve continuare a consumare, dal file neutro."""
    righe = tabella('Chiamate al motore protette', 1)
    return None if righe is None else {f for (f,) in righe}


def test_motore_senza_orfani():
    motore = leggi('engine.js')
    pagina = senza_commenti(leggi('app.html'))
    corpo = senza_commenti(motore)
    orfani = orfani_dichiarati()
    check('l\'elenco degli orfani si legge', orfani is not None,
          'manca la tabella «Funzioni del motore che nessuno chiama» in '
          'docs/eccezioni-interfaccia.md')
    orfani = orfani or {}
    esportate = re.findall(r'^export function ([a-zA-Z]+)', motore, flags=re.M)
    check('il motore esporta qualcosa', len(esportate) > 10)
    consumate = set()
    for f in esportate:
        # Chiamata dalla pagina — anche solo nominata, perche' `componiProva()`
        # passa `E.estrai` come valore invece di chiamarla.
        dalla_pagina = re.search(r'\bE\.%s\b' % f, pagina) is not None
        if dalla_pagina:
            consumate.add(f)
        # Oppure usata dentro il motore stesso: `semaforo()` la chiama
        # `traccia()`, `oscurato()` la chiama `simulazione()`.
        usi = len(re.findall(r'(?<![\w.])%s\s*\(' % f, corpo))
        interna = usi > 1
        check('«%s» ha un chiamante' % f,
              dalla_pagina or interna or f in orfani,
              'esportata, testata, e nessuno la chiama. Se e\' voluto, '
              'dichiarala fra le «Funzioni del motore che nessuno chiama» in '
              'docs/eccezioni-interfaccia.md, col motivo e con l\'area che la '
              'consumera\'.')
    # Una dichiarazione che non serve piu' nasconde il caso dopo. Due modi di
    # non servire piu', e il secondo mancava: la funzione non c'e' piu', oppure
    # **la pagina ha cominciato a chiamarla**. Il secondo si poteva controllare
    # solo da quando le eccezioni stanno in territorio neutro: prima l'unico
    # modo di spegnere il rosso sarebbe stato toccare tests/, precluso a ui/*.
    for f in orfani:
        check('l\'eccezione «%s» riguarda una funzione che esiste' % f,
              f in esportate,
              'dichiarata orfana ma non esportata: la riga va tolta')
        check('«%s» e\' ancora senza chiamanti' % f, f not in consumate,
              'la pagina la chiama: togli la riga dagli orfani e aggiungi il '
              'nome alle «Chiamate al motore protette», nello stesso commit')


# --- 7. la pagina non smette di consumare il motore in silenzio ---------------

def test_chiamate_al_motore_preservate():
    app = senza_commenti(leggi('app.html'))
    protette = chiamate_protette()
    check('l\'elenco delle chiamate protette si legge', protette is not None,
          'manca la tabella «Chiamate al motore protette» in '
          'docs/eccezioni-interfaccia.md')
    protette = protette or set()
    trovate = set(re.findall(r'\bE\.([a-zA-Z]+)\b', app))
    for f in sorted(protette):
        check('la pagina chiama ancora «%s»' % f, f in trovate,
              'la chiamata e\' sparita. Se e\' voluto, togli la riga da '
              'docs/eccezioni-interfaccia.md e di\' nel commit perche\': quello '
              'che non va bene e\' che sparisca in silenzio.')
    nuove = trovate - protette
    check('le chiamate nuove sono dichiarate', not nuove,
          'la pagina chiama ora anche: ' + ', '.join(sorted(nuove))
          + ' — aggiungi una riga per ognuna alle «Chiamate al motore protette» '
            'in docs/eccezioni-interfaccia.md, cosi\' da domani sono protette')


# --- 7b. una lettura non ripiega su un dato plausibile ------------------------

def test_letture_che_non_mascherano():
    """Un ripiego silenzioso trasforma un errore in un dato credibile.

    `LS.get(k, d)` ha `catch { return d }`: usato per leggere l'archivio, un
    file illeggibile diventa una lista vuota, e la schermata del primo avvio
    compare a chi ha mesi di risposte. E' il guasto muto in forma pura, quindi
    non basta ripararlo dove sta: si nomina la forma.
    """
    righe = tabella('Letture che possono mascherare un guasto', 3)
    check('l\'elenco delle letture cieche si legge', righe is not None,
          'manca la tabella «Letture che possono mascherare un guasto» in '
          'docs/eccezioni-interfaccia.md')
    dichiarate = {(f, e) for f, e, _ in (righe or [])}
    cieche = []
    for nome in ('app.html', 'index.html'):
        for espr in re.findall(r"LS\.get\(\s*'archivio'\s*,[^)]*\)",
                               senza_commenti(leggi(nome))):
            cieche.append((nome, ' '.join(espr.split())))
    for f, e in cieche:
        check('la lettura dell\'archivio in %s non ripiega in silenzio' % f,
              (f, e) in dichiarate,
              'questa lettura non distingue «assente» da «errore»: chi la usa '
              'non puo\' sapere se l\'archivio e\' vuoto o illeggibile. Se non '
              'la correggi adesso, dichiarala col perche\' e con l\'area.')
    presenti = set(cieche)
    for k in dichiarate:
        check('la dichiarazione per «%s» riguarda una lettura che esiste' % (k[1],),
              k in presenti,
              'la lettura e\' stata corretta: togli la riga, altrimenti nasconde '
              'la prossima')


# --- 8. i testi si possono leggere (R-A11Y) -----------------------------------

def piccoli(nome):
    """Ogni regola CSS con un font-size sotto la soglia, col suo selettore."""
    t = leggi(nome)
    fuori = []
    for m in re.finditer(r'([^{};\n]*)\{[^{}]*font-size:\s*(\d+)px', t):
        px = int(m.group(2))
        if px < FONT_MINIMO:
            sel = m.group(1).strip().split('}')[-1].strip()
            fuori.append((nome, px, sel))
    return fuori


def test_testi_leggibili():
    righe = tabella('Testi sotto gli 11 px', 4)
    check('il file delle eccezioni si legge', righe is not None,
          'manca docs/eccezioni-interfaccia.md, o la sua tabella')
    dichiarati = {(f, px, sel) for f, px, sel, _ in (righe or [])}
    trovati = piccoli('app.html') + piccoli('index.html')
    for f, px, sel in trovati:
        check('«%s» in %s non e\' sotto i %d px' % (sel, f, FONT_MINIMO),
              (f, str(px), sel) in dichiarati,
              '%d px: sotto la soglia un testo non e\' piccolo, e\' illeggibile '
              'per una parte delle persone. Se e\' voluto, dichiaralo col '
              'perche\' e con l\'area che lo corregge.' % px)
    presenti = {(f, str(px), sel) for f, px, sel in trovati}
    for k in dichiarati:
        check('la dichiarazione per «%s» riguarda una regola che esiste' % (k[2],),
              k in presenti,
              'il difetto e\' stato corretto: togli la riga da '
              'docs/eccezioni-interfaccia.md, altrimenti nasconde il prossimo')


# --- 9. un'immagine di contenuto dice che cosa mostra -------------------------

def test_alt_di_contenuto():
    righe = tabella('Testi alternativi generici', 3)
    check('la tabella degli alt si legge', righe is not None)
    dichiarati = {(f, a) for f, a, _ in (righe or [])}
    trovati = []
    for nome in ('app.html', 'index.html'):
        for a in re.findall(r'alt="([^"]*)"', leggi(nome)):
            if a.strip().lower() in ALT_GENERICI:
                trovati.append((nome, a.strip().lower()))
    for f, a in trovati:
        check('l\'alt «%s» in %s dice che cosa mostra' % (a, f),
              (f, a) in dichiarati,
              'un alt generico e\' peggio di nessuno: dichiara che c\'e\' '
              'un\'immagine e non dice quale. `alt=""` va bene per una '
              'decorativa; un\'immagine che porta contenuto deve descriverlo.')
    for k in dichiarati:
        check('la dichiarazione per l\'alt «%s» riguarda un caso che esiste' % (k[1],),
              k in trovati,
              'corretto: togli la riga da docs/eccezioni-interfaccia.md')


def main():
    for t in (test_viste_dichiarate, test_ogni_vista_ha_una_porta,
              test_voci_barra, test_modalita_quiz, test_selettori,
              test_motore_senza_orfani, test_chiamate_al_motore_preservate,
              test_letture_che_non_mascherano,
              test_testi_leggibili, test_alt_di_contenuto):
        t()
    if falliti:
        print('%d verifiche FALLITE su %d:\n' % (len(falliti), fatti))
        for f in falliti:
            print('  ✗ ' + f)
        sys.exit(1)
    print('%d verifiche passate' % fatti)


if __name__ == '__main__':
    main()
