// P-68: fonte sintetica dichiarata. Dalla radice: node docs/prototipi/interfaccia-2026-10/progressi-snapshot.mjs
// Il motore conta e seleziona qui; gli HTML si limitano a mostrare lo snapshot incorporato.
import * as E from '../../../site/engine.js';
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root = new URL('../../../', import.meta.url);
const read = p => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const quiz = read('site/dati/quiz.json'), meta = read('site/dati/meta.json');
const oggi = '2026-10-13', adesso = Date.parse('2026-10-13T12:00:00+02:00');
const parole = ['mai visti', 'da rifare', 'da confermare', 'recuperati', 'acquisiti'];
const rows = [], items = Object.fromEntries(quiz.map(q => [q.id, {id:q.id, p:q.p, d:q.d, t:q.t, v:q.v, k:q.k, fm:!!q.fm, osc:!!q.osc}]));
function risposta(q, correct, giorno, gruppo, mode='batteria') {
  const n = rows.filter(r => r.sim_uid === gruppo).length;
  rows.push({_t:'q', uid:`mock-68-${rows.length}`, item_id:q.id, kind:q.k, correct:correct?1:0,
    ts:`2026-10-${giorno}T08:${String(n % 60).padStart(2,'0')}:00+02:00`, ms:12000, mode, sim_uid:gruppo});
}
// Ogni tema contiene esempi dei quattro stati osservati; il resto resta mai visto.
for (const tema of [...new Set(quiz.map(q=>q.t))]) {
  quiz.filter(q=>q.t===tema).slice(0,18).forEach((q,i)=>{
    const s=i%4;
    risposta(q,s!==0 && s!==2,'11','mock-primo-'+tema);
    if(s===2 || s===3) { risposta(q,true,'12','mock-secondo-'+tema); risposta(q,true,'13','mock-terzo-'+tema); }
  });
}
// Una simulazione completa: i risultati sono fatti di questa sola prova finta.
const prova=E.simulazione(quiz,{},oggi,meta.pesi_esame,68);
prova.forEach((q,i)=>risposta(q,i!==2 && i!==8,'12','mock-prova-base','sim'));
rows.push({_t:'s',uid:'mock-prova-base',kind:'base',ts:'2026-10-12T09:00:00+02:00',totale:20,errori:2});
function fonte(righe, nome) {
  const progress=E.ripiega(righe).quiz;
  const out={nome, righe, mappe:{}, riepilogo:{risposte:righe.filter(r=>r._t==='q').length,
    temi:[...new Set(righe.filter(r=>r._t==='q').map(r=>items[r.item_id].t))]}};
  for(const kind of ['base','vela']) {
    const quadro=E.quadro(quiz,progress,oggi,kind,meta.pesi_esame);
    const attach=r=>{
      r.stati=E.contaStati(quiz,progress,{kind,temi:r.filtro.tema?[r.filtro.tema]:undefined,voci:r.filtro.voce?[r.filtro.voce]:undefined});
      r.segmenti=E.STATI_QUESITO.map(k=>({stato:k,numero:r.stati[k],percentuale:r.stati[k]/r.n*100}));
      r.errori=E.coda(quiz,progress,oggi,r.rifai).map(q=>q.id);
      r.allena=E.coda(quiz,progress,oggi,{...r.filtro,n:20}).map(q=>q.id);
      assert.equal(r.errori.length,r.daRifare); assert.equal(r.stati.debole,r.daRifare);
      assert.equal(r.stati.totale,r.n);
      r.voci?.forEach(attach);
    };
    quadro.righe.forEach(attach); attach(quadro.totale);
    out.mappe[kind]={quadro,pesa:E.dovePesa(quadro)};
    out.mappe[kind].pesa.indicazione?.pulsanti.forEach(p=>{
      p.ids=E.coda(quiz,progress,oggi,p.selezione).map(q=>q.id); assert.equal(p.ids.length,p.quanti);
    });
  }
  out.sessioni=E.sessioni(righe,{confine:'attivita'}).map(s=>({
    id:s.id,mode:s.mode,kind:s.kind,inizio:s.inizio,n:s.n,esatte:s.esatte,
    ricostruita:s.fonte==='risposte',ambigua:s.ambigua,ids:s.righe.map(r=>r.item_id),
    errori:E.erroriSessione(righe,quiz,s.id).lista?.map(q=>q.id) ?? []
  }));
  const giorni={}; for(const r of righe.filter(r=>r._t==='q')) { const g=r.ts.slice(0,10);giorni[g]??=[0,0];giorni[g][0]+=r.correct;giorni[g][1]++; }
  out.andamento=E.tendenza(giorni);
  // Criterio illustrativo da discutere in P-76, non nuova logica di prodotto.
  const totale=out.mappe.base.quadro.totale.stati;
  out.fase={proposta:true,attuale:totale.mai_visto*2>=totale.totale?'Esplorare':totale.debole+totale.incerto>0?'Ritornare sulle risposte':'Mettersi alla prova',
    criterio:'Proposta: almeno metà della base mai vista → Esplorare; sotto quella quota con errori o conferme → Ritornare sulle risposte; altrimenti → Mettersi alla prova. Nessuna porta bloccata.'};
  // Proposta di criterio, non export esistente: incerti con prima giusta datata almeno 12 ore fa.
  out.conferme={proposta:true,ids:quiz.filter(q=>E.statoQuesito(progress[q.id])==='incerto' && progress[q.id].gp!=null && adesso-progress[q.id].gp>=E.CONFERMA_ORE*3600000).map(q=>q.id)};
  out.conferme.n=out.conferme.ids.length;
  return out;
}
const anon=quiz.filter(q=>q.k==='base' && ['SICUREZZA DELLA NAVIGAZIONE','METEOROLOGIA'].includes(q.t));
const anonRows=Array.from({length:10},(_,i)=>({_t:'q',uid:'mock-anon-'+i,sim_uid:'mock-anonimo',item_id:anon[i<5?i:anon.length-1-(i-5)].id,
  kind:'base',mode:'batteria',correct:[2,5,8].includes(i)?0:1,ms:12000,ts:`2026-10-13T11:${String(i).padStart(2,'0')}:00+02:00`}));
const out={giorno:oggi,adesso:'2026-10-13T12:00:00+02:00',scenario:'Risposte, account, date e guasti finti; banca del repo, snapshot del motore. Nessun dato personale.',
  parole,stati:E.STATI_QUESITO,soglie:{prima:E.PRIMA_MIN_VISTI,frase:E.FRASE_MIN_VISTI,ore:E.CONFERMA_ORE,giorni:E.TENDENZA_MIN_GIORNI,risposte:E.TENDENZA_MIN_RISPOSTE},fonti:{},items,
  fontiDati:{account:fonte(rows,'Account caricato'),parziale:fonte(anonRows.slice(0,4),'Archivio caricato con poche risposte'),vuoto:fonte([],'Archivio caricato senza risposte'),anonimo:fonte(anonRows,'Risposte della pagina aperta')},
  completamento:{proposta:true,testo:'Hai concluso quello che ti avevamo proposto',n:3,nota:'Esempio illustrativo: tre quesiti proposti e tre risposte nella pagina aperta. Nessuno stato persistente.'}};
for(const p of ['site/engine.js','site/dati/quiz.json','site/dati/meta.json'])out.fonti[p]=createHash('sha256').update(readFileSync(new URL(p,root))).digest('hex');
// Non incorporare l'intera banca: solo i riferimenti delle liste che il mock apre.
const usati=new Set();for(const f of Object.values(out.fontiDati)) {
  for(const m of Object.values(f.mappe)) {const add=r=>{[...r.errori,...r.allena].forEach(id=>usati.add(id));r.voci?.forEach(add)};m.quadro.righe.forEach(add);m.pesa.indicazione?.pulsanti.forEach(p=>p.ids.forEach(id=>usati.add(id)));}
  f.sessioni.forEach(s=>s.ids.forEach(id=>usati.add(id)));
}
out.items=Object.fromEntries([...usati].map(id=>[id,items[id]]));
writeFileSync(new URL('p68-dati.json',import.meta.url),JSON.stringify(out,null,1)+'\n');
// Gli HTML restano autoconsistenti: aggiorna solo la copia dichiarata dello snapshot.
const html=new URL('progressi-mappa.html',import.meta.url);
if(existsSync(html)) {
  const prima=readFileSync(html,'utf8'), pattern=/(<script type="application\/json" id="fixture">)[\s\S]*?(<\/script>)/;
  assert.match(prima,pattern);
  writeFileSync(html,prima.replace(pattern,(_,a,b)=>a+JSON.stringify(out,null,1).replaceAll('</script>','<\\/script>')+b));
}
console.log(JSON.stringify({fonti:Object.keys(out.fontiDati),risposte:out.fontiDati.account.riepilogo.risposte,stati:out.fontiDati.account.mappe.base.quadro.totale.stati,pesa:out.fontiDati.account.mappe.base.pesa.indicazione?.tema,conferme:out.fontiDati.account.conferme.n}));
