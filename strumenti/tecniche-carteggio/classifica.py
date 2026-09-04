# -*- coding: utf-8 -*-
"""Dai fatti alle tecniche, con una regola esplicita e leggibile.

Due assi, entrambi determinati da fatti presenti nel testo:
  A. come si ottiene il punto nave di partenza
  B. quale incognita si chiede, e con quale elemento perturbatore
"""
import json
from collections import Counter

F = json.load(open('fatti.json'))

# --- letti a mano, uno per uno -------------------------------------------------
#
# Se due rilevamenti successivi siano sulla STESSA mira o su due mire diverse non
# si estrae dal testo in modo affidabile: le finestre attorno ai due rilevamenti
# si sovrappongono e catturano gli stessi nomi propri. Provato, misurato, e
# sbagliava due casi su quattro.
#
# Quindi si guardano, come le figure della 0.12.0: e' un dato che a macchina non
# si verifica, e allora si verifica una volta a mano e lo si fissa qui.
STESSA_MIRA = {
    '5.1.3-1',  # faro di Punta Polveraia, 12h00 e 12h20
    '5.1.3-2',  # faro di Scoglietto, 17h00 e dopo 18 minuti
    '5.1.3-3',  # lo stesso faro rilevato TRE volte: 01h50, 02h20, 03h05
    '5.1.3-4',  # Punta Nera, "si rileva la stessa punta"
    '5.1.3-5',  # faro di Punta Polveraia, "dello stesso"
    '5.4.3-1',  # faro di Punta Lividonia, "lo rileviamo con un secondo"
    '5.4.3-5',  # faro di Formica Grande, "sempre con lo stesso faro"
    '5.5.3-1',  # fanale IALA cardinale sud, "lo rileviamo nuovamente"
    '5.6.3-2',  # Faro sulle Isolette Monaci, "nuovamente lo stesso"
}
MIRE_DIVERSE = {
    '5.2.3-1',  # fanali di Castiglione della Pescaia -> Scoglio Sparviero
    '5.2.3-3',  # Passo Peroni -> Scoglio Sparviero
    '5.2.3-4',  # Punta Martina -> faro di Punta Ala
    '5.2.3-5',  # fanali di Castiglione -> Serbatoio Marina di Grosseto
    '5.3.3-1',  # Punta Brigantina -> Torre Cala della Ruta
    '5.3.3-5',  # Torre Cala della Ruta -> faro di Isola Pianosa
    '5.3.3-7',  # Punta Brigantina -> Punta del Grottone
    '5.4.3-3',  # Capo d'Uomo -> Scoglio Argentarola
    '5.4.3-4',  # Punta Lividonia -> Punta del Fenaio
    '5.8.3-1',  # Faro di P.ta Timone -> Faro della Bocca di Olbia
}
# Falsi positivi della regola: qui i rilevamenti sono SIMULTANEI, non successivi.
SIMULTANEI = {
    '5.1.1-5',  # "l'osservazione dei seguenti rilevamenti", due mire, stesso istante
    '5.4.1-10', # "osserva simultaneamente il faro di Talamone e quello di Punta Lividonia"
}

def metodo_pn(f):
    """Asse A — come si costruisce il punto di partenza. Piu' d'uno e' possibile."""
    m = []
    if f['gps']:                      m.append('PN da coordinate GPS')
    if f['n_polari'] >= 2:            m.append('PN per rilevamenti polari successivi')
    elif f['n_polari'] == 1:          m.append('Rilevamento polare singolo')
    i = f['id']
    if i in SIMULTANEI:               m.append('PN per due rilevamenti simultanei')
    elif i in MIRE_DIVERSE:           m.append('PN per rilevamenti successivi su mire diverse')
    elif i in STESSA_MIRA:            m.append('PN per rilevamenti successivi sulla stessa mira')
    elif f['ril_successivi']:         m.append('PN per rilevamenti successivi (mira da verificare)')
    elif f['ril_simult'] or f['n_ril'] >= 2:
                                      m.append('PN per due rilevamenti simultanei')
    if f['ril_dist']:                 m.append('PN per rilevamento e distanza')
    if f['allineamento']:             m.append('PN per allineamento e distanza')
    if f['traverso']:                 m.append('Punto al traverso')
    if not m and (f['simbolo'] or f['toponimo']):
                                      m.append('Punto noto da toponimo cartografico')
    # la bussola non e' un modo di fare il punto: e' un passaggio in piu' che
    # va fatto prima, e che alcuni esercizi richiedono e altri no.
    if f['bussola'] and f['declinaz']: m.append('Conversione bussola-vero')
    if f['var_annua']:                 m.append('Aggiornamento della declinazione')
    return m

def incognita(f):
    """Asse B — che cosa chiede, con l'elemento perturbatore che la qualifica."""
    if f['scarroccio']: pert = 'Scarroccio'
    elif f['corrente']: pert = 'Corrente'
    else:               pert = 'Moto libero'
    if f['chiede_corrente']:            return ['Corrente - determinarla dal punto osservato']
    if f['chiede_interc']:              return [f'{pert} - punto di intercettazione']
    if f['chiede_carbur']:              return [f'{pert} - autonomia e carburante']
    if f['chiede_pv'] or f['chiede_pb']:return [f'{pert} - prua da tenere']
    if f['chiede_vp']:                  return [f'{pert} - velocita propulsiva necessaria']
    if f['chiede_ora']:                 return [f'{pert} - ora di arrivo']
    if f['chiede_rv'] or f['chiede_ve']:return [f'{pert} - rotta e velocita effettive']
    if f['chiede_coord']:               return [f'{pert} - punto raggiunto']
    return []

out = []
for f in F:
    tec = metodo_pn(f) + incognita(f)
    out.append({'id': f['id'], 'argomento': f['argomento'], 'tecniche': tec,
                'domanda': f['domanda']})
json.dump(out, open('mie-tecniche.json','w'), ensure_ascii=False, indent=1)

vuoti = [x for x in out if not x['tecniche']]
senzaPN = [x for x in out if not metodo_pn(next(f for f in F if f['id']==x['id']))]
senzaInc = [x for x in out if not incognita(next(f for f in F if f['id']==x['id']))]
print('classificati: %d su %d' % (len(out)-len(vuoti), len(out)))
print('  senza metodo di punto nave: %d  %s' % (len(senzaPN), [x['id'] for x in senzaPN][:12]))
print('  senza incognita riconosciuta: %d  %s' % (len(senzaInc), [x['id'] for x in senzaInc][:12]))
print()
c = Counter(t for x in out for t in x['tecniche'])
print('%-42s %s' % ('LA MIA TASSONOMIA', 'n'))
for t, n in c.most_common(): print('  %-40s %3d' % (t, n))
print()
print('tecniche distinte:', len(c), '| media per esercizio: %.1f' % (sum(c.values())/len(out)))
