# -*- coding: utf-8 -*-
"""Estrae dai testi i FATTI su cui poggia la classificazione.
Nessuna etichetta: solo che cosa il testo dice, in forma controllabile."""
import json, re, unicodedata

def norm(t):
    t = unicodedata.normalize('NFKC', t)
    t = (t.replace('’', "'").replace('‘', "'")
          .replace('–', '-').replace('—', '-'))
    # Gli a-capo del PDF spezzavano frasi come "coordinate geografiche\nGPS":
    # sei esercizi su 135 perdevano il metodo del punto nave per questo.
    return re.sub(r'\s+', ' ', t)

def fatti(e):
    t = norm(e['testo']); low = t.lower()
    f = {}

    # --- come si ottiene il punto di partenza (il "punto nave A") ---
    f['gps']        = 'coordinate geografiche gps' in low or 'coordinate gps' in low
    # `[^.]` escludeva il punto, e le sigle dei fari ne sono piene (Lam.5s19m12M):
    # quattro esercizi perdevano il metodo. Il confine giusto e' il punto e virgola.
    f['ril_dist']   = bool(re.search(r'(distanza[^;]{0,120}rilevamento|rilevamento[^;]{0,120}distanza)', low))
    f['ril_simult'] = 'simultanea' in low or 'simultanei' in low
    f['traverso']   = 'traverso' in low
    f['simbolo']    = bool(re.search(r'\((simbolo|ingresso|fanale)', low))
    f['toponimo']   = bool(re.search(r'\b(parte da|partenza da|si parte da)\b', low))

    # rilevamenti polari: quanti, e su quante mire / quanti orari
    pol = re.findall(r'ρ\s*=?\s*[+\-−]?\s*\d{1,3}', t)
    f['n_polari'] = len(pol)
    # rilevamenti: veri (Rilv) E bussola (Rilb) — la prima stesura vedeva solo i
    # primi, e si perdeva un'intera famiglia di esercizi (5.1.3-*, 5.2.3-*).
    # Nei testi il rilevamento e' scritto in quattro modi: Rilv, Rilb, Rlv, Rlb —
    # e non sempre con l'uguale. La prima stesura ne vedeva due su quattro.
    f['n_rilv'] = len(re.findall(r'\bri?lv\s*=?\s*\d', low))
    f['n_rilb'] = len(re.findall(r'\bri?lb\s*=?\s*\d', low))
    f['n_ril']  = f['n_rilv'] + f['n_rilb']
    # bussola: serve convertire prora e rilevamenti da bussola a veri
    f['bussola'] = bool(re.search(r'\bpb\s*=|rilb\s*=|prora bussola|rilevamento bussola', low))
    f['declinaz'] = bool(re.search(r'declinazione|deviazione|variazione magnetica|\bvm\s*=', low))
    f['var_annua'] = 'variazione annua' in low
    # due rilevamenti della STESSA mira in due istanti: trasporto della retta
    f['ril_successivi'] = bool(re.search(r'(dopo\s+\d+\s*minuti|alle ore.{0,110}alle ore)', low)) and f['n_ril'] >= 2
    # Stessa mira rilevata due volte, oppure due mire diverse in due istanti:
    # sono due tecniche diverse, e la seconda e' il trasporto della retta.
    # Quale mira porta ciascun rilevamento. I toponimi sono nomi propri, quindi
    # si riconoscono dalle maiuscole: si guarda la finestra attorno a ogni
    # rilevamento e si confrontano i nomi trovati. Dove non se ne trovano, la
    # distinzione resta indecisa e lo si dichiara (`mire_incerte`).
    STOP = {'Alle','Dal','Dalla','Da','Il','La','Lo','Le','Nel','Determinare','Considerando',
            'Posto','Sapendo','Partenza','Stiamo','Si','In','Con','Rilv','Rilb','Rlv','Rlb',
            'Lat','Long','Pv','Pb','Rv','Vp','Vc','Dc','Ve','Nord','Sud','Est','Ovest'}
    nomi = []
    for m in re.finditer(r'\bRi?l[vb]\s*=?\s*\d{1,3}', t):
        fin = t[max(0, m.start()-90): m.end()+90]
        trovati = re.findall(r"\b[A-Z][a-zà-ù']{3,}(?:\s+(?:d[ei]l?l?[ae']?\s+)?[A-Z][a-zà-ù']{3,})*", fin)
        nomi.append(frozenset(x for x in trovati if x.split()[0] not in STOP))
    f['n_mire'] = len({n for n in nomi if n})
    f['mire_incerte'] = len(nomi) >= 2 and any(not n for n in nomi)
    f['allineamento'] = 'allineamento' in low
    # orari citati nel testo (hhHmmM oppure hh:mm)
    f['n_orari'] = len(set(re.findall(r'\d{1,2}\s*h\s*\d{2}\s*m|\d{1,2}:\d{2}', low)))
    f['polare_90'] = bool(re.search(r'ρ\s*=?\s*[+\-−]?\s*0?90', t))
    f['polare_45'] = bool(re.search(r'ρ\s*=?\s*[+\-−]?\s*0?45', t))

    # --- elemento perturbatore ---
    f['corrente']  = bool(re.search(r'\bcorrente\b|\bdc\s*=|\bvc\s*=', low))
    f['scarroccio']= 'scarroccio' in low
    f['nessuno']   = 'non sono presenti elementi perturbatori' in low or 'assenza di fattori esterni' in low

    # --- che cosa chiede ---
    coda = t[max(0, t.lower().rfind('determinare')):] or t[-220:]
    f['domanda'] = re.sub(r'\s+', ' ', coda)[:190]
    d = coda.lower()
    f['chiede_vp']      = bool(re.search(r'velocit[aà] propulsiva|\bvp\b', d))
    f['chiede_pv']      = bool(re.search(r'\bpr(?:or|u)a vera\b|\bpv\b', d))
    f['chiede_pb']      = bool(re.search(r'\bpr(?:or|u)a bussola\b|\bpb\b', d))
    f['chiede_rv']      = bool(re.search(r'\brotta vera\b|\brv\b', d))
    f['chiede_ora']     = bool(re.search(r'\bora\b|orario|tempo di navigazione', d))
    f['chiede_coord']   = bool(re.search(r'coordinate|lat\b|punto nave|posizione', d))
    f['chiede_carbur']  = 'carburante' in d
    f['chiede_interc']  = 'intercettazione' in d or 'intercett' in d
    f['chiede_dist']    = bool(re.search(r'\bdistanza\b|miglia', d))
    f['chiede_ve']      = bool(re.search(r'velocit[aà] effettiva|\bve\b', d))
    # il problema inverso: dal confronto fra punto stimato e punto osservato si
    # ricava la corrente. La prima stesura non lo aveva e cadeva sull'incognita
    # sbagliata.
    f['chiede_corrente'] = bool(re.search(r'(direzione|velocit[aà])[^.]{0,30}corrente|\bdc\b|\bvc\b', d))
    return f

es = json.load(open('esercizi-ciechi.json'))
out = []
for e in es:
    out.append({**{k: e[k] for k in ('id','argomento','carta','famiglia')}, **fatti(e)})
json.dump(out, open('fatti.json','w'), ensure_ascii=False, indent=1)

from collections import Counter
print('estratti i fatti di', len(out), 'esercizi\n')
for k in ['gps','ril_dist','ril_simult','traverso','simbolo','bussola','declinaz','var_annua',
          'ril_successivi','allineamento','toponimo','chiede_pb','chiede_corrente','corrente','scarroccio','nessuno',
          'polare_90','polare_45','chiede_vp','chiede_pv','chiede_rv','chiede_ora','chiede_coord',
          'chiede_carbur','chiede_interc','chiede_ve']:
    print('  %-14s %3d' % (k, sum(1 for x in out if x[k])))
print()
print('  rilevamenti polari per esercizio:', dict(sorted(Counter(x['n_polari'] for x in out).items())))
print('  rilevamenti veri per esercizio:  ', dict(sorted(Counter(x['n_rilv'] for x in out).items())))
