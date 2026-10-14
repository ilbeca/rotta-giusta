// Verifica riproducibile del mock, non una suite del prodotto. Nessuna scrittura a tests/.
import {writeFileSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import * as E from '../../../../site/engine.js';
const base=fileURLToPath(new URL('../',import.meta.url)).replace(/\/$/,''),folder=base+'/giro-riscontri';
const banco=readFileSync(new URL('../../../../tests/browser.mjs',import.meta.url),'utf8');
const {avviaChrome}=await import('data:text/javascript;base64,'+Buffer.from(banco.replace('    nuovoContesto,','    cmd, nuovoContesto,')).toString('base64'));
const D=JSON.parse(readFileSync(base+'/giro-dati.json')),quiz=JSON.parse(readFileSync(new URL('../../../../site/dati/quiz.json',import.meta.url)));
const browser=await avviaChrome(),ctx=await browser.nuovoContesto(),s=await ctx.apri('about:blank');
const measures=[],checks=[];
async function load(access,w){await browser.cmd('Emulation.setDeviceMetricsOverride',{width:w,height:w===375?812:900,deviceScaleFactor:1,mobile:w===375},s.sessionId);await s.valuta('if(typeof warnUnload==="function")removeEventListener("beforeunload",warnUnload)');await s.vai('file://'+base+'/giro-attivita.html?accesso='+access);await s.valuta('document.fonts.ready');await s.valuta('new Promise(r=>setTimeout(r,250))');}
async function tap(selector){await s.valuta('new Promise(r=>setTimeout(r,220))');const p=await s.valuta(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('missing '+${JSON.stringify(selector)});let r=e.getBoundingClientRect();const dock=document.querySelector('.answerdock');const limit=dock&&!dock.contains(e)?dock.getBoundingClientRect().top:innerHeight;if(r.top<0||r.bottom>limit){e.scrollIntoView({block:'center'});r=e.getBoundingClientRect();}return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await browser.cmd('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p},s.sessionId);await browser.cmd('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p},s.sessionId);await s.valuta('new Promise(r=>setTimeout(r,100))');}
async function check(name,expr){const ok=!!await s.valuta(expr);checks.push({name,ok});if(!ok)throw Error(name);}
async function measure(name,w){const value=await s.valuta(`(()=>{const W=document.documentElement.clientWidth;return {innerWidth,clientWidth:W,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.left<-.5||r.right>W+.5)}).map(e=>e.tagName+'.'+e.className),font:getComputedStyle(document.body).fontFamily,dock:document.querySelector('.answerdock')?.getBoundingClientRect().toJSON(),benchInset:document.querySelector('.bench .wrap').getBoundingClientRect().x,title:document.querySelector('h1')?.textContent}})()`);measures.push({name,width:w,...value});if(value.overflow.length||value.scrollWidth!==value.clientWidth)throw Error(name+' geometry');const {data}=await browser.cmd('Page.captureScreenshot',{format:'png'},s.sessionId);writeFileSync(folder+'/finale-'+name+'-'+w+'.png',Buffer.from(data,'base64'));}
try{
for(const w of [375,1280])for(const access of ['H0','H1','HA']){
 await load(access,w);await tap('#simula-base');await tap('#inizia');await measure('runner-'+access,w);await check('first question readable '+access+w,`document.querySelector('.question').getBoundingClientRect().bottom<=document.querySelector('.answerdock').getBoundingClientRect().top`);
 await tap(`[data-act="answer"][data-choice="${await s.valuta('D.items[run.ids[0]].x')}"]`);await tap('[data-act="stop"]');await tap('[data-act="confirm"]');await measure('parziale-layout-'+access,w);
}
if(s.errori.length)throw Error(s.errori.join('\n'));writeFileSync(folder+'/misure-layout.json',JSON.stringify(measures,null,2)+'\n');writeFileSync(folder+'/controlli-layout.json',JSON.stringify(checks,null,2)+'\n');console.log(JSON.stringify({measures:measures.length,checks:checks.length,errors:s.errori}));
}finally{await ctx.chiudi();await browser.chiudi();}
