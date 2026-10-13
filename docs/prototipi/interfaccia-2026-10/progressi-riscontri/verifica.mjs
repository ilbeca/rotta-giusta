// P-68: controllo del solo mock. Chrome, due viewport, gesti nativi e attesa dei ritorni.
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const base=fileURLToPath(new URL('../',import.meta.url)).replace(/\/$/,'');
// Adatta in memoria il banco esistente: serve il comando CDP per screenshot e
// gesti nativi. Nessuna scrittura a tests/, nessuna dipendenza o logica di prodotto.
const banco=readFileSync(new URL('../../../../tests/browser.mjs',import.meta.url),'utf8');
const adattato=banco.replace('    nuovoContesto,','    cmd, nuovoContesto,');
if(adattato===banco)throw Error('Il banco non espone più il punto di adattamento');
const {avviaChrome}=await import('data:text/javascript;base64,'+Buffer.from(adattato).toString('base64'));
const folder=base+'/progressi-riscontri';mkdirSync(folder,{recursive:true});
const D=JSON.parse(readFileSync(base+'/p68-dati.json'));
const browser=await avviaChrome(),ctx=await browser.nuovoContesto(),s=await ctx.apri('about:blank');
const measures=[],checks=[],journeys=[];
async function load(c,w=375){await browser.cmd('Emulation.setDeviceMetricsOverride',{width:w,height:w===375?812:900,deviceScaleFactor:1,mobile:false},s.sessionId);await s.vai('file://'+base+'/progressi-mappa.html?caso='+c);await s.valuta('document.fonts.ready');}
async function tap(selector){const state=await s.valuta("({current,back:document.querySelector("+JSON.stringify(selector)+")?.dataset.go==='back'})");const p=await s.valuta(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('missing ${selector}');e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await browser.cmd('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p},s.sessionId);await browser.cmd('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p},s.sessionId);await s.valuta('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');await s.valuta('new Promise(r=>setTimeout(r,100))');if(state.back&&!await s.attendi('current==='+String(state.current-1)))throw Error('back did not arrive');}
async function check(name,expression){const v=await s.valuta(expression);checks.push({name,ok:!!v});if(!v)throw Error(name);}
async function measure(name,w,screenshot=false){const m=await s.valuta(`(()=>{const W=document.documentElement.clientWidth;const els=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).display!=='none'});return {innerWidth,clientWidth:W,scrollWidth:document.documentElement.scrollWidth,overflow:els.filter(e=>{const r=e.getBoundingClientRect();return r.left<-.5||r.right>W+.5}).map(e=>e.tagName+'.'+e.className),legend:[...document.querySelectorAll('.legend li')].map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON()})),primary:document.querySelectorAll('.primary:not(:disabled)').length,title:document.querySelector('h1')?.textContent,font:getComputedStyle(document.body).fontFamily}})()`);measures.push({name,width:w,...m});if(m.scrollWidth!==m.clientWidth||m.overflow.length||m.primary>1)throw Error('geometry '+name+JSON.stringify(m));if(screenshot){const {data:viewportData}=await browser.cmd('Page.captureScreenshot',{format:'png'},s.sessionId);writeFileSync(folder+'/'+name+'-'+w+'-viewport.png',Buffer.from(viewportData,'base64'));const layout=await browser.cmd('Page.getLayoutMetrics',{},s.sessionId);const {data}=await browser.cmd('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:w,height:layout.cssContentSize.height,scale:1}},s.sessionId);writeFileSync(folder+'/'+name+'-'+w+'.png',Buffer.from(data,'base64'));}}
try{
 for(const w of [375,1280]){
  for(const c of ['account','anonimo','h0','vuoto','parziale','incompleto','caricamento','errore','concluso','cambiata']){await load(c,w);await measure(c,w,true);}
  await load('account',w);await tap('[data-go="aiuto"]');await measure('aiuto',w,true);await tap('[data-go="back"]');await check('help return '+w,'page.type==="progressi"');
  await tap('[data-go="perche"]');await measure('perche',w,true);await tap('[data-go="back"]');
  await tap('[data-go="avatar"]');await measure('avatar',w,true);await tap('[data-go="info"]');await measure('info',w);await tap('[data-go="back"]');await tap('[data-go="back"]');await check('fault persistent '+w,'!!document.querySelector(".dot")');
  for(const kind of ['base','vela']){
   await load('account',w);if(kind==='vela')await tap('[data-go="vela"]');await measure('mappa-'+kind,w,kind==='vela');
   const rows=D.fontiDati.account.mappe[kind].quadro.righe;
   for(let i=0;i<rows.length;i++){
    await tap(`[data-go="tema"][data-index="${i}"]`);await measure(kind+'-tema-'+i,w,i===0);
    await tap('[data-go="allena"]');await check('allena same list '+kind+i+w,`JSON.stringify(page.ids)===JSON.stringify(D.fontiDati.account.mappe.${kind}.quadro.righe[${i}].allena)`);await measure(kind+'-allena-'+i,w,i===0);await tap('[data-go="inizia"]');await measure(kind+'-apertura-'+i,w);await tap('[data-go="back"]');await tap('[data-go="back"]');
    if(rows[i].daRifare){await tap(`[data-go="rifai"][data-index="${i}"]`);await check('rifai exact '+kind+i+w,`page.ids.length===${rows[i].daRifare}&&JSON.stringify(page.ids)===JSON.stringify(D.fontiDati.account.mappe.${kind}.quadro.righe[${i}].errori)`);await measure(kind+'-rifai-'+i,w,i===0);await tap('[data-go="back"]');}
    if(rows[i].voci)for(let v=0;v<rows[i].voci.length;v++){
      await tap(`[data-go="voce"][data-voce="${v}"]`);await measure(kind+'-voce-'+i+'-'+v,w);await tap('[data-go="allena"]');await check('voice list '+i+'-'+v+'-'+w,`JSON.stringify(page.ids)===JSON.stringify(D.fontiDati.account.mappe.base.quadro.righe[${i}].voci[${v}].allena)`);await tap('[data-go="back"]');
      if(rows[i].voci[v].daRifare){await tap(`[data-go="rifai"][data-voce="${v}"]`);await check('voice errors '+i+'-'+v+'-'+w,`page.ids.length===${rows[i].voci[v].daRifare}`);await tap('[data-go="back"]');}
      await tap('[data-go="back"]');
    }
    await tap('[data-go="back"]');await check('topic return '+kind+i+w,`page.type==='progressi'&&page.kind==='${kind}'`);
   }
  }
  await load('account',w);await tap('[data-go="sessione"][data-session="mock-prova-base"]');await measure('prova',w,true);await tap('[data-go="revisione"]');await measure('revisione',w,true);await tap('[data-go="back"]');await check('review returns summary '+w,`page.type==='sessione'`);await tap('[data-go="back"]');
  await load('anonimo',w);await tap('[data-go="anon-errori"]');await check('anon 3 errors '+w,`page.ids.length===3`);await measure('anon-errori',w,true);await tap('[data-go="back"]');await check('anon rows intact '+w,`F.righe.length===10&&F.riepilogo.risposte===10`);
  await load('errore',w);await tap('[data-go="riprova"]');await check('retry is loading '+w,`document.querySelector('h2').textContent==='Stiamo caricando le tue risposte'&&!document.querySelector('.statebar')`);await measure('riprova',w);
  await load('cambiata',w);await tap('[data-go="rifai"]');await check('changed blocks '+w,`!!document.querySelector('.primary:disabled')`);await measure('cambiata-preparazione',w,true);
  await s.vai('file://'+base+'/progressi.html');await measure('indice',w,true);
 }
 // Ogni ID 12: partenza Home locale, stessa pagina, ingresso e ritorno.
 for(const person of ['Z','F','R'])for(const state of ['H0','H1','HA']){
  await load({H0:'h0',H1:'anonimo',HA:'account'}[state]);await tap('[data-go="home"]');const before=await s.valuta('F.righe.length');await tap('nav [data-go="progressi"]');const heading=await s.valuta('document.querySelector("h1").textContent');await tap('nav [data-go="home"]');const ok=await s.valuta(`page.type==='home'&&F.righe.length===${before}`);journeys.push({id:person+'-'+state+'-12',arrival:1,total:2,heading,rows:before,ok});if(!ok)throw Error('journey');
 }
 await load('account');await tap('nav [data-go="home"]');await tap('nav [data-go="progressi"]');await tap('[data-go="tema"][data-index="0"]');await tap('[data-go="voce"][data-voce="0"]');await tap('[data-go="rifai"][data-voce="0"]');const n=await s.valuta('page.ids.length');await tap('[data-go="inizia"]');journeys.push({id:'Progressi-voce-rifai',arrival:5,ids:n,ok:true,boundary:'Apertura illustrativa, non prima domanda'});
 await load('account');await tap('nav [data-go="home"]');await tap('nav [data-go="progressi"]');await tap('[data-go="tema"][data-index="0"]');await tap('[data-go="voce"][data-voce="0"]');await tap('[data-go="allena"]');await tap('[data-go="inizia"]');journeys.push({id:'Progressi-voce-allena',arrival:5,ok:true,boundary:'Apertura illustrativa'});
 await check('history holds only reference',`Object.keys(history.state).join(',')==='mock'`);await check('no local storage',`localStorage.length===0&&sessionStorage.length===0`);
 if(s.errori.length)throw Error(s.errori.join('\n'));
 writeFileSync(folder+'/misure.json',JSON.stringify(measures,null,2)+'\n');writeFileSync(folder+'/controlli.json',JSON.stringify(checks,null,2)+'\n');writeFileSync(folder+'/tragitti-misurati.json',JSON.stringify(journeys,null,2)+'\n');
 console.log(JSON.stringify({measures:measures.length,checks:checks.length,journeys:journeys.length,overflow:0,errors:s.errori}));
}catch(e){console.log(s.errori);throw e;}finally{await ctx.chiudi();await browser.chiudi();}
