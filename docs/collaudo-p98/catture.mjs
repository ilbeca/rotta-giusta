// P-98: catture locali; avviare prima strumenti/serve.py 8788.
// Gli agganci globali esistono solo nella risposta intercettata di questo browser.
// HA usa un profilo sintetico verificato, senza registrazione o richieste a server remoti.
import {avviaChrome} from '../../tests/browser.mjs';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const root=fileURLToPath(new URL('.',import.meta.url));
const repo=fileURLToPath(new URL('../..',import.meta.url));
const fase=process.argv[2]||'prima';mkdirSync(`${root}/${fase}`,{recursive:true});
const chrome=await avviaChrome();let ctx;
const misure=[[375,667],[375,812],[1200,700],[1280,800],[1280,1024],[1920,1080]];
const pausa=ms=>new Promise(r=>setTimeout(r,ms));const records=[];
try {for(const [w,h] of misure){ctx=await chrome.nuovoContesto();const s=await ctx.apri('about:blank');await s.dimensioni(w,h);await s.movimento(true);await s.intercetta('http://127.0.0.1:8788/',()=>({codice:200,intestazioni:{'Content-Type':'text/html'},corpo:(fase==='prima'?execFileSync('git',['show','db9e8cd:site/index.html'],{cwd:repo,encoding:'utf8'}):readFileSync(new URL('../../site/index.html',import.meta.url),'utf8')).replace('</script>',`Object.assign(globalThis,{S,NAV_UI,naviga,fine,terminaAttivita,nascondiRunner,dipingi,entraConto,aggiornaPorteConto,preparaExtra});</script>`)}));await s.vai('http://127.0.0.1:8788/');
if(!await s.attendi('!S.caricamento && S.banca.length>0'))throw Error('Pagina non pronta: '+s.errori.join(';'));await s.valuta('document.fonts.ready');
const shot=async nome=>{await pausa(160);const file=`${fase}/${nome}-${w}x${h}.png`;writeFileSync(`${root}/${file}`,await s.schermata());records.push({file,errori:[...s.errori],overflow:await s.valuta('document.documentElement.scrollWidth>innerWidth')});};
await shot('home-h0');
const haFaro=await s.valuta(`!!document.getElementById('home-faro')`);
if(haFaro){await s.valuta(`if(document.documentElement.dataset.volto!=='carta')document.getElementById('home-carta-posto').scrollIntoView({block:'center'});document.getElementById('home-faro').click();if(document.documentElement.dataset.volto!=='carta'){const r=document.getElementById('home-sigla').getBoundingClientRect();if(r.bottom>innerHeight-90)scrollBy(0,r.bottom-innerHeight+90)}`);await shot('home-faro');await s.valuta(`document.getElementById('home-faro').click();scrollTo(0,0)`);}else await shot('home-faro');
await s.valuta("document.querySelector('[data-rotta-start]').click()");await s.attendi("!document.getElementById('quiz-conf').hidden");await s.valuta("document.getElementById('start').click()");await s.attendi('!!S.run');await pausa(300);await s.valuta("document.querySelector('#r-ans button').click()");if(!await s.attendi('S.run?.esiti.length>0'))throw Error('Risposta non registrata '+s.errori);await shot('runner-risposta');
await s.valuta("terminaAttivita()");if(!await s.attendi("document.getElementById('r-fine').classList.contains('on')"))throw Error('Riepilogo assente '+s.errori);

await shot('riepilogo');
await s.valuta("nascondiRunner();document.body.classList.remove('in-attivita','attivita-conclusa');naviga('/')");await shot('home-h1');await s.valuta(`document.getElementById('rotta-last').scrollIntoView({block:'start'})`);await shot('home-h1-attivita');
await s.valuta("naviga('/?sezione=allenati')");await shot('allenati');await s.valuta("naviga('/?sezione=esame')");await shot('esame');
if(w===375){await s.valuta(`preparaExtra('numero',[S.banca.find(q=>q.id==='base-829')],'Quesito base-829')`);await s.valuta(`document.getElementById('start').click()`);await s.attendi('!!S.run');await pausa(300);await shot('figura-base829');await s.valuta(`nascondiRunner();document.body.classList.remove('in-attivita','attivita-conclusa');naviga('/')`);}

await s.valuta("(async()=>{await entraConto({email:'collaudo@example.invalid',verificata:true,chiave_locale:'collaudo-p98-"+w+"',scelte:{}});aggiornaPorteConto();naviga('/')})()");await shot('home-ha');
await s.valuta(`document.getElementById('home-consiglio').scrollIntoView({block:'start'})`);await shot('home-ha-proposta');await ctx.chiudi();ctx=null;
}writeFileSync(`${root}/${fase}/misure.json`,JSON.stringify(records,null,2));}finally{if(ctx)await ctx.chiudi();await chrome.chiudi();}
