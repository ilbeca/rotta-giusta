import { avviaChrome } from '../../../../tests/browser.mjs';
import { writeFileSync } from 'node:fs';
const OUT = process.argv[2]; const BASE = process.argv[3] || 'http://localhost:8787';
const pausa = (ms) => new Promise(r => setTimeout(r, ms));
const ch = await avviaChrome();
const ctx = await ch.nuovoContesto();
const sizes = [[375, 812], [1280, 800]];
const salva = async (s, nome, w, h, intera) => {
  if (intera) {
    const H = await s.valuta('Math.min(5000, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight))');
    await s.dimensioni(w, H); await pausa(400);
  }
  writeFileSync(`${OUT}/${nome}-${w}${intera ? '-intera' : ''}.png`, await s.schermata());
  if (intera) { await s.dimensioni(w, h); await pausa(200); }
};
const clic = (s, sel) => s.valuta(`(()=>{const e=document.querySelector(${JSON.stringify(sel)}); if(!e) return 'manca '+${JSON.stringify(sel)}; e.click(); return 'ok'})()`);
const clicTesto = (s, testo) => s.valuta(`(()=>{const e=[...document.querySelectorAll('button,a')].find(b=>b.offsetParent && b.textContent.trim().startsWith(${JSON.stringify(testo)})); if(!e) return 'manca'; e.click(); return 'ok'})()`);
for (const [w, h] of sizes) {
  const s = await ctx.apri(null); await s.dimensioni(w, h);
  const pagine = [['home', '/'], ['quiz', '/?sezione=allenati&segmento=quiz'], ['carteggio', '/?sezione=allenati&segmento=carteggio'], ['segnali', '/?sezione=allenati&segmento=segnali'], ['esame', '/?sezione=esame'], ['progressi', '/?sezione=progressi']];
  for (const [n, u] of pagine) {
    await s.vai(BASE + u); await pausa(1500);
    await salva(s, n, w, h, false); await salva(s, n, w, h, true);
  }
  await s.vai(BASE + '/'); await pausa(1500);
  await s.attendi("!document.querySelector('[data-rotta-start]').disabled", 8000);
  console.log('breve', await clic(s, '[data-rotta-start]')); await pausa(900);
  await salva(s, 'preparazione', w, h, false);
  console.log('start', await clic(s, '#start')); await pausa(1200);
  await salva(s, 'runner-domanda', w, h, false);
  console.log('ans', await clic(s, '#r-ans .ans:nth-child(2)')); await pausa(900);
  await salva(s, 'runner-risposta', w, h, false);
  console.log('next', await clic(s, '#r-next')); await pausa(900);
  console.log('ans2', await clic(s, '#r-ans .ans:nth-child(1)')); await pausa(900);
  console.log('close', await clic(s, '#r-close')); await pausa(1200);
  await salva(s, 'riepilogo', w, h, false);
  await s.vai(BASE + '/'); await pausa(1500);
  console.log('accedi', await clicTesto(s, 'Accedi')); await pausa(900);
  await salva(s, 'accedi', w, h, false);
}
await ch.chiudi(); process.exit(0);
