// Le schermate della copia «La carta che vive»: anche gli stati che si raggiungono giocando.
import { avviaChrome } from '../../../../tests/browser.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const [DIR, OUT] = process.argv.slice(2); mkdirSync(OUT, { recursive: true });
const pausa = (ms) => new Promise(r => setTimeout(r, ms));
const ch = await avviaChrome(); const ctx = await ch.nuovoContesto();
const giri = [
  ['home', 'home.html', 3200], ['quiz', 'quiz.html', 400], ['preparazione', 'preparazione.html', 400],
  ['runner', 'runner.html', 600], ['runner-dopo', 'runner.html#dopo', 900], ['runner-figura', 'runner-figura.html', 500],
  ['riepilogo', 'riepilogo.html?g=2&s=1', 1200],
];
for (const [w, h] of [[375, 812], [1280, 800]]) for (const [nome, url, attesa] of giri) {
  const s = await ctx.apri(null); await s.dimensioni(w, h);
  await s.vai(`file://${DIR}/a-carta-viva/${url}`); await pausa(attesa);
  const m = await s.valuta(`({sborda: document.documentElement.scrollWidth - innerWidth, principali: [...document.querySelectorAll('[data-ruolo=principale]')].filter(e=>e.getClientRects().length).length, errori: 0})`);
  console.log(nome, w, JSON.stringify(m), s.errori.join(' | '));
  writeFileSync(`${OUT}/${nome}-${w}.png`, await s.schermata());
  if (['home', 'quiz', 'riepilogo'].includes(nome)) {
    const H = await s.valuta('Math.min(6000, document.documentElement.scrollHeight)'); await s.dimensioni(w, H); await pausa(400);
    writeFileSync(`${OUT}/${nome}-${w}-intera.png`, await s.schermata()); await s.dimensioni(w, h);
  }
}
// Il gioco: rispondere, Avanti, e l'anello che scivola alla seconda tappa
const s = await ctx.apri(null); await s.dimensioni(375, 812);
await s.vai(`file://${DIR}/a-carta-viva/runner.html`); await pausa(300);
await s.valuta(`document.querySelector('.risposta[data-k="1"]').click()`); await pausa(400);
await s.valuta(`document.getElementById('avanti').click()`); await pausa(900);
console.log('dopo Avanti', JSON.stringify(await s.valuta(`({n: document.getElementById('n').textContent, domanda: document.getElementById('domanda').textContent, tappa1: document.querySelectorAll('.tappa')[0].className, anello: getComputedStyle(document.querySelector('.anello')).left})`)));
writeFileSync(`${OUT}/runner-seconda-375.png`, await s.schermata());
// Un lampo del faro, mentre la rotta si disegna
await s.vai(`file://${DIR}/a-carta-viva/home.html`); await s.dimensioni(1280, 800); await pausa(1700);
writeFileSync(`${OUT}/home-lampo-1280.png`, await s.schermata());
// La luce toccata
await s.vai(`file://${DIR}/a-carta-viva/home.html`); await s.dimensioni(1280, 800); await pausa(600);
await s.valuta(`document.querySelectorAll('.figura-grande .luce')[1].click()`); await pausa(500);
writeFileSync(`${OUT}/home-luce-1280.png`, await s.schermata());
console.log('legenda', await s.valuta(`document.querySelector('.figura-grande .legenda-luce').innerText`));
await ch.chiudi(); process.exit(0);
