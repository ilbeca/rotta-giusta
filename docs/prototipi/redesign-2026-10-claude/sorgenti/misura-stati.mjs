// Misure dei due stati difficili, su ogni direzione: la figura prima di rispondere
// (come T-11, a 375×812) e l'avviso accanto a «Inizia» (come T-12, a 375×667).
import { avviaChrome } from '../../../../tests/browser.mjs';
const DIR = process.argv[2];
const pausa = (ms) => new Promise(r => setTimeout(r, ms));
const ch = await avviaChrome(); const ctx = await ch.nuovoContesto();
for (const d of ['a-carta-nautica', 'b-plancia-di-notte', 'c-quaderno-a-colori']) {
  const s = await ctx.apri(null);
  await s.dimensioni(375, 812); await s.vai(`file://${DIR}/${d}/runner-figura.html`); await pausa(400);
  const f = await s.valuta(`(()=>{const r=e=>{const b=document.querySelector(e).getBoundingClientRect();return [Math.round(b.top),Math.round(b.bottom)]};
    const a=document.querySelector('.risposta').getBoundingClientRect();
    return {figura:r('.figura img'),domanda:r('.domanda'),centroPrimaRisposta:Math.round((a.top+a.bottom)/2),schermo:innerHeight}})()`);
  await s.dimensioni(375, 667); await s.vai(`file://${DIR}/${d}/preparazione.html`); await pausa(400);
  const p = await s.valuta(`(()=>{const a=document.querySelector('[data-ruolo=avviso]').getBoundingClientRect(),b=document.querySelector('[data-ruolo=principale]').getBoundingClientRect(),bar=document.querySelector('.barra').getBoundingClientRect();
    return {avviso:[Math.round(a.top),Math.round(a.bottom)],inizia:[Math.round(b.top),Math.round(b.bottom)],distanza:Math.round(b.top-a.bottom),barra:Math.round(bar.top)}})()`);
  console.log(d, JSON.stringify({ figura375x812: f, preparazione375x667: p }));
}
await ch.chiudi(); process.exit(0);
