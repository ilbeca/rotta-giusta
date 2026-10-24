import { avviaChrome } from '../../../../tests/browser.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const [DIR, OUT, ...nomi] = process.argv.slice(2); mkdirSync(OUT, { recursive: true });
const pausa = (ms) => new Promise(r => setTimeout(r, ms));
const ch = await avviaChrome(); const ctx = await ch.nuovoContesto();
for (const nome of nomi) for (const [w, h] of [[375, 812], [1280, 800]]) {
  const s = await ctx.apri(null); await s.dimensioni(w, h);
  await s.vai(`file://${DIR}/${nome}.html`); await pausa(500);
  const m = await s.valuta(`(()=>{const p=document.querySelector('[data-ruolo=principale]'); const r=p&&p.getBoundingClientRect();
    return {sborda: document.documentElement.scrollWidth-innerWidth, principali: document.querySelectorAll('[data-ruolo=principale]').length,
    fondoPrincipale: r&&Math.round(r.bottom), font: document.fonts.check('16px Manrope'), alto: document.documentElement.scrollHeight}})()`);
  console.log(nome, w, JSON.stringify(m));
  writeFileSync(`${OUT}/${nome}-${w}.png`, await s.schermata());
  const H = Math.min(6000, m.alto); await s.dimensioni(w, H); await pausa(300);
  writeFileSync(`${OUT}/${nome}-${w}-intera.png`, await s.schermata());
  if (w === 375) { await s.dimensioni(375, 667); await pausa(300); writeFileSync(`${OUT}/${nome}-375x667.png`, await s.schermata()); }
  await s.chiudi?.();
}
await ch.chiudi(); process.exit(0);
