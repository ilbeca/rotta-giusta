// P-69, generatore del solo mock. Tutte le selezioni e le transizioni numeriche
// sono prodotte qui; nell'HTML gira soltanto la presentazione dello snapshot.
import * as E from '../../../site/engine.js';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../../../',import.meta.url),read=p=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const quiz=read('site/dati/quiz.json'),cart=read('site/dati/carteggio.json'),meta=read('site/dati/meta.json');
const p68=JSON.parse(readFileSync(new URL('p68-dati.json',import.meta.url)));
const day='2026-10-13',ts='2026-10-13T10:00:00.000Z',start=Date.parse(ts);
const D={giorno:day,seme:69,scenario:'Mock: risposte sintetiche, account e spiegazioni finti. Nessun salvataggio reale.',fonti:{},prove:meta.prove,carta:E.PROVA_CARTEGGIO,items:{},selezioni:{},contatori:{},carteggi:{},textCounts:{},fontiDati:{H0:[],H1:p68.fontiDati.anonimo.righe,HA:p68.fontiDati.account.righe},voce:p68.fontiDati.account.mappe.base.quadro.righe[0].voci[0]};
D.initialRuns={H1:[]};for(const row of D.fontiDati.H1){const q=quiz.find(x=>x.id===row.item_id);if(q)D.items[q.id]=structuredClone(q);}
for(const p of ['site/engine.js','site/dati/quiz.json','site/dati/carteggio.json','site/dati/meta.json'])D.fonti[p]=createHash('sha256').update(readFileSync(new URL(p,root))).digest('hex');
function select(key,title,list,kind='quiz',sim=false,bank='base') {D.selezioni[key]={key,title,ids:list.map(q=>q.id),n:list.length,kind,sim,bank};if(kind==='carta')D.selezioni[key].carte=[...new Set(list.map(q=>q.carta))];for(const q of list)D.items[q.id]=structuredClone(q);}
select('base','Simulazione quiz base',E.simulazione(quiz,{},day,meta.pesi_esame,69),'quiz',true);
select('vela','Simulazione quiz vela',E.simulazioneVela(quiz,{},day,meta.prove.vela.n,69),'quiz',true,'vela');
select('tema','Quiz per argomento · Meteorologia',E.coda(quiz,{},day,{kind:'base',tema:'METEOROLOGIA',n:20}));
select('breve','Allenamento breve',E.estraiNuoviPrima(quiz,{},day,10,'base',69));
select('note','Note della banca',quiz.filter(q=>q.nbp||q.nb).slice(0,3));
select('mancante','Figura indisponibile',[quiz.find(q=>q.id==='base-59')]);
for(const [key,ids] of [['voce-allena',D.voce.allena],['voce-rifai',D.voce.errori]])select(key,key==='voce-allena'?'Allena · Coordinate geografiche':'Rifai gli errori · Coordinate geografiche',ids.map(id=>quiz.find(q=>q.id===id)));
select('giro','Esercizi · Giro delle tecniche',E.giroTecniche(cart,{}).map(x=>x.e),'carta');
select('tappeto','Esercizi · A tappeto',E.tappeto(cart,{},4),'carta');
const prova=E.provaCarteggio(cart,{},day,{seme:69});select('carta','Prova di carteggio',prova.lista,'carta',true);D.selezioni.carta.carte=prova.carte;D.selezioni.carta.assunzione=prova.assunzione;
const signals=E.domandeSegnali('notturni',E.lunghezzaPartita('notturni'),69);select('segnali','Fanali notturni',signals,'segnali');
// Tavole di transizione: la pagina non somma corrette/errate e non decide esiti.
// Valgono anche per qualunque riprova (1..20). Le liste degli errori sono
// frammenti prodotti da erroriSessione; il browser conserva i riferimenti ricevuti.
for(let n=1;n<=25;n++){
 const table={};for(let r=0;r<=n;r++)for(let c=0;c<=r;c++){
  const rows=quiz.slice(0,r).map((q,i)=>({_t:'q',uid:'fixture:'+i,item_id:q.id,correct:i<c,choice:i<c?q.x:(q.x+1)%q.r.length,ts,mode:'tema',sim_uid:'fixture',kind:'base'}));
  const s=E.sessioni(rows,{confine:'attivita'})[0];const state={r:s?.n??0,c:s?.esatte??0,e:r-(s?.esatte??0),m:n-r,n,next:{}};
  for(const kind of ['base','vela']){const er=E.esito([...rows.map(x=>x.correct),...Array(n-r).fill(false)],meta.prove[kind].errori_max??meta.prove[kind].erroriMax);state[kind]={...er,superata:r===n&&er.superata};}
  if(r<n)state.next={giusta:`${r+1}:${c+1}`,errata:`${r+1}:${c}`};table[`${r}:${c}`]=state;
 }D.contatori[n]=table;
}
// Ogni scelta conserva la riga e il frammento di revisione/riprova del motore.
for(const q of Object.values(D.items).filter(q=>q.r)) {
 q.scelte=q.r.map((text,choice)=>{const row={_t:'q',uid:'fragment:'+q.id+':'+choice,item_id:q.id,correct:choice===q.x,choice,ts,mode:'tema',sim_uid:'fragment',kind:q.k};const errors=E.erroriSessione([row],quiz,'fragment');return {text,riga:row,ramo:row.correct?'giusta':'errata',errori:errors.lista.map(x=>x.id)};});
 if(q.f){const path=new URL('site/figure/'+q.f.replace(/^\//,''),root);if(existsSync(path))q.figura='data:image/png;base64,'+readFileSync(path).toString('base64');}
}
for(const n of [4,7]){const states={};for(let mask=0;mask<2**n;mask++){const bits=Array.from({length:n},(_,i)=>!!(mask&(1<<i)));states[bits.map(x=>x?'1':'0').join('')]={scritti:bits.filter(Boolean).length,vuoti:bits.filter(x=>!x).length};}D.textCounts[n]=states;}
const seedSession=E.sessioni(D.fontiDati.H1,{confine:'attivita'})[0];D.initialRuns.H1.push({id:seedSession.id,title:'Allenamento della pagina · fixture P-68',n:seedSession.n,ids:seedSession.righe.map(r=>r.item_id),counter:`${seedSession.n}:${seedSession.esatte}`,answers:seedSession.righe.map((row,pos)=>({item_id:row.item_id,choice:row.choice,row,pos,edge:D.items[row.item_id].scelte[row.choice]||{text:'La tua risposta non è registrata.',ramo:row.correct?'giusta':'errata',errori:row.correct?[]:[row.item_id]}})),errors:E.erroriSessione(D.fontiDati.H1,quiz,seedSession.id).lista.map(x=>x.id)});D.initialRuns.H1[0].errorAnswers=D.initialRuns.H1[0].answers.filter(a=>a.edge.errori.length);
// Carta: tutte le combinazioni di giudizi null/0/1 (anche il giro di 7).
// I testi liberi sono memoria UI; conti ed esito dipendono soltanto dai giudizi.
for(const key of ['giro','tappeto','carta']){
 const sel=D.selezioni[key],table={};const b=E.nuovaBozza({id:'mock-'+key,modo:sel.sim?'simulazione':key==='giro'?'giro-tecniche':'tappeto',lista:sel.ids,inizio:start,variante:sel.sim?'cieca':null});
 function visit(gs){if(gs.length<sel.n){for(const g of [null,0,1])visit([...gs,g]);return;}
 const bb=E.modificaBozza(b,{fase:'confronto',consegna:start+60000,giudizi:gs,testi:gs.map(()=> 'testo finto')});const final=E.concludiBozza(bb,{ts,quesiti:new Set(cart.map(x=>x.id))});const ready=!final.motivo;const det=ready?E.dettaglioCarteggio(final.righe,cart,bb.id,{tipo:'c'}):null;
 const code=gs.map(g=>g===null?'_':String(g)).join('');table[code]={valutati:gs.filter(g=>g!==null).length,pendenti:gs.filter(g=>g===null).length,ready,righe:final.righe,conteggi:det?.conteggi,esito:det?.esito,daRivedere:det?.mostrate.filter(x=>x.giudizio===false).map(x=>x.item_id)??[]};
 }visit([]);D.carteggi[key]={bozza:b,stati:table};
}
assert.equal(D.selezioni.base.n,meta.prove.base.n);assert.equal(D.selezioni.carta.n,E.PROVA_CARTEGGIO.esercizi);
writeFileSync(new URL('giro-dati.json',import.meta.url),JSON.stringify(D)+'\n');
const html=new URL('giro-attivita.html',import.meta.url);if(existsSync(html)){const s=readFileSync(html,'utf8');writeFileSync(html,s.replace(/<script id="fixture" type="application\/json">[\s\S]*?<\/script>/,'<script id="fixture" type="application/json">'+JSON.stringify(D).replaceAll('<','\\u003c')+'</script>'));}
console.log(JSON.stringify({selezioni:Object.fromEntries(Object.entries(D.selezioni).map(([k,s])=>[k,s.n])),contatori:Object.values(D.contatori).reduce((a,x)=>a+Object.keys(x).length,0),carta:Object.fromEntries(Object.entries(D.carteggi).map(([k,x])=>[k,Object.keys(x.stati).length]))}));
