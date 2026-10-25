// Le schermate e le misure degli altri stili, accanto alla release candidate.
// Uso, dalla cartella redesign-2026-10-claude:
//   node sorgenti/stili/cattura-stili.mjs "$PWD" [d-segnalamento …]
// Per ogni stile e ogni schermata, a 375×812, 375×667 e 1280×800: sbordamento,
// pulsanti principali visibili, dove finisce il principale, Manrope caricato.
// Poi i due stati difficili (come T-11 e T-12) e «Avanti» dopo un errore.
import { avviaChrome } from '../../../../../tests/browser.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const [DIR, ...scelti] = process.argv.slice(2);
const STILI = scelti.length ? scelti : ['d-segnalamento', 'e-bandiere', 'f-manuale-a-schede', 'g-regata'];
const PAGINE = [['home', 'home.html', 1800], ['quiz', 'quiz.html', 500], ['preparazione', 'preparazione.html', 400],
  ['runner', 'runner.html#dopo', 900], ['runner-figura', 'runner-figura.html', 500], ['riepilogo', 'riepilogo.html', 1200]];
const pausa = (ms) => new Promise(r => setTimeout(r, ms));
const MISURA = `(()=>{const vis=[...document.querySelectorAll('[data-ruolo=principale]')].filter(e=>e.getClientRects().length);
  const r=vis[0]&&vis[0].getBoundingClientRect();
  return {sborda: document.documentElement.scrollWidth-innerWidth, principali: vis.length, fondoPrincipale: r&&Math.round(r.bottom),
    font: document.fonts.check('16px Manrope'), alto: document.documentElement.scrollHeight}})()`;
const ch = await avviaChrome(); const ctx = await ch.nuovoContesto();
const esito = {};
for (const stile of STILI) {
  const OUT = `${DIR}/${stile}/schermate`; mkdirSync(OUT, { recursive: true }); esito[stile] = {};
  for (const [nome, url, attesa] of PAGINE) for (const [w, h] of [[375, 812], [375, 667], [1280, 800]]) {
    const s = await ctx.apri(null); await s.dimensioni(w, h);
    await s.vai(`file://${DIR}/${stile}/${url}`); await pausa(attesa);
    const m = await s.valuta(MISURA);
    esito[stile][`${nome}-${w}x${h}`] = m;
    const file = h === 667 ? `${nome}-375x667` : `${nome}-${w}`;
    writeFileSync(`${OUT}/${file}.png`, await s.schermata());
    if (h !== 667 && ['home', 'quiz', 'riepilogo'].includes(nome)) {
      await s.dimensioni(w, Math.min(6000, m.alto)); await pausa(400);
      writeFileSync(`${OUT}/${file}-intera.png`, await s.schermata());
    }
    await s.chiudi?.();
  }
  // La figura prima di rispondere, a 375×812 (come T-11)
  const s = await ctx.apri(null); await s.dimensioni(375, 812);
  await s.vai(`file://${DIR}/${stile}/runner-figura.html`); await pausa(400);
  esito[stile].figura = await s.valuta(`(()=>{const r=e=>{const b=document.querySelector(e).getBoundingClientRect();return [Math.round(b.top),Math.round(b.bottom)]};
    const a=document.querySelector('.risposta').getBoundingClientRect();
    return {figura:r('.figura img'),domanda:r('.domanda'),centroPrimaRisposta:Math.round((a.top+a.bottom)/2),schermo:innerHeight}})()`);
  // L'avviso accanto a «Inizia», a 375×667 (come T-12)
  await s.dimensioni(375, 667); await s.vai(`file://${DIR}/${stile}/preparazione.html`); await pausa(400);
  esito[stile].preparazione = await s.valuta(`(()=>{const a=document.querySelector('[data-ruolo=avviso]').getBoundingClientRect(),b=document.querySelector('[data-ruolo=principale]').getBoundingClientRect(),bar=document.querySelector('.barra').getBoundingClientRect();
    return {avviso:[Math.round(a.top),Math.round(a.bottom)],inizia:[Math.round(b.top),Math.round(b.bottom)],distanza:Math.round(b.top-a.bottom),barra:Math.round(bar.top)}})()`);
  // «Avanti» dopo un errore, a 375×667, e quello che c'è sul suo centro
  await s.vai(`file://${DIR}/${stile}/runner.html#dopo`); await pausa(700);
  esito[stile].avanti = await s.valuta(`(()=>{const b=document.getElementById('avanti').getBoundingClientRect();const c=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2);
    return {avanti:[Math.round(b.top),Math.round(b.bottom)],schermo:innerHeight,sopra:c&&c.closest('#avanti')?'Avanti':(c&&c.tagName)}})()`);
  // Il disegno toccato: la prima voce si legge sotto
  await s.dimensioni(1280, 800); await s.vai(`file://${DIR}/${stile}/home.html`); await pausa(1800);
  await s.valuta(`document.querySelector('.figura-grande .luce').click()`); await pausa(500);
  writeFileSync(`${OUT}/home-tocca-1280.png`, await s.schermata());
  esito[stile].legenda = await s.valuta(`document.querySelector('.figura-grande .legenda-luce').innerText`);
  await s.chiudi?.();
}
console.log(JSON.stringify(esito, null, 1));
await ch.chiudi(); process.exit(0);
