// Snapshot di mock: eseguire dalla radice con node docs/prototipi/interfaccia-2026-10/attivita-snapshot.mjs.
// Nessuna selezione gira negli HTML. Fonte vuota o tre errori sintetici, mai dati personali.
import * as E from '../../../site/engine.js';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url), read=p=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const quiz=read('site/dati/quiz.json'), cart=read('site/dati/carteggio.json'), tec=read('site/dati/tecniche.json'), meta=read('site/dati/meta.json');
const oggi='2026-10-13', prog={}; quiz.slice(0,3).forEach(q=>E.applica(prog,q.id,false,null,oggi));
const short=l=>({n:l.length,ids:l.map(q=>q.id),first:l[0]||null});
const out={data:oggi,seme:67,scenario:'Finto: fonte senza risposte; ripasso con tre errori sintetici; nessun archivio reale.',fonti:{},prove:meta.prove,carta:E.PROVA_CARTEGGIO,temi:meta.temi.map(t=>t.tema),vociVela:meta.voci_vela.map(v=>v.voce),argomenti:{},attivita:{},segnali:{},ricerca:{}};
for(const p of ['site/engine.js','site/dati/quiz.json','site/dati/carteggio.json','site/dati/tecniche.json','site/dati/meta.json'])out.fonti[p]=createHash('sha256').update(readFileSync(new URL(p,root))).digest('hex');
for(const kind of ['base','vela'])for(const tema of ['tutti',...(kind==='base'?out.temi:out.vociVela)])for(const n of [20,50,100,0])for(const nuovi of [false,true])for(const figura of [false,true]){
 const opt={...(tema==='tutti'?{}:kind==='base'?{tema}:{voce:tema}),soloFigura:figura};
 const r=nuovi?{lista:E.coda(quiz,{},oggi,{kind,...opt,stati:['nuovo'],n:0})}:E.daAllenare(quiz,{},oggi,kind,opt);
 const lista=n?r.lista.slice(0,n):r.lista;
 out.argomenti[[kind,tema,n,nuovi,figura].join('|')]={...short(lista),totale:r.lista.length,daFare:r.daFare??r.lista.length};
}
out.attivita.mirata=short(E.mirata(quiz,{},oggi,{n:25,kind:'base',pesi:meta.pesi_esame}).map(x=>x.it));
out.attivita.breve=short(E.estraiNuoviPrima(quiz,{},oggi,10,'base',67));
out.attivita.errori=short(E.coda(quiz,prog,oggi,{kind:'base',soloSbagliate:true,n:20}));
out.attivita.segnalibri=short(E.codaSegnalibri(quiz,[]).lista);
out.attivita.base=short(E.simulazione(quiz,{},oggi,meta.pesi_esame,67));
out.attivita.vela=short(E.simulazioneVela(quiz,{},oggi,meta.prove.vela.n,67));
for(const k of ['base','vela'])for(const p of [1,2,4,6])out.attivita['giro-'+k+'-'+p]=short(E.screening(quiz,{},oggi,p,k,67));
const giroResult=E.giroTecniche(cart,{});const giro=giroResult.map(x=>x.e);out.attivita.esercizi={...short(giro),carte:[...new Set(giro.map(x=>x.carta))],tecniche:[...new Set(giroResult.flatMap(x=>x.tecniche))]};
const tappeto=E.tappeto(cart,{},4);out.attivita.tappeto={...short(tappeto),carte:[...new Set(tappeto.map(x=>x.carta))]};
for(const nuoviPrima of [false,true]){const r=E.provaCarteggio(cart,{},oggi,{seme:67,nuoviPrima});out.attivita[nuoviPrima?'carta-nuovi':'carta']={...short(r.lista),carte:r.carte,assunzione:r.assunzione,riprese:r.riprese,mancanti:r.mancanti};}
out.attivita.tecniche=short(E.coda(tec.map(e=>({id:e.id,k:'tec',t:e.argomento,v:e.carta,d:e.testo})),{},oggi,{n:15}));
for(const modo of E.SEGNALI_MODI)out.segnali[modo]=short(E.domandeSegnali(modo,E.lunghezzaPartita(modo),67));
const oscuro=quiz.find(q=>q.osc);out.ricerca.oscuro={numero:oscuro.p,esito:E.cercaNumero(quiz,oscuro.p)};
out.ricerca.assente={numero:'9.9.9-9999',esito:E.cercaNumero(quiz,'9.9.9-9999')};
writeFileSync(new URL('attivita-dati.json',import.meta.url),JSON.stringify(out,null,1)+'\n');
console.log(JSON.stringify({attivita:Object.fromEntries(Object.entries(out.attivita).map(([k,v])=>[k,v.n])),oscuro:oscuro.p,configurazioni:Object.keys(out.argomenti).length}));
