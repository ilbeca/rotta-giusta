// Il banco del metodo remoto.
//   node banco-remoto.mjs              prova a secco: fascicoli, stima di token e costo, niente API
//   node banco-remoto.mjs --lancia     chiama i modelli e scrive risultati/remoto-grezzo.json
// Studenti: i primi QUANTI con lacune e i primi SANI senza, per lunghezza, presi dallo stesso
// banco del locale (stessi semi). Stabilita': RIPETI chiamate in tutto per i primi STAB_LAC
// studenti con lacune e i primi STAB_SANI senza, per lunghezza. Il lancio riprende da dove
// si era fermato, e si ferma da solo se la spesa registrata supera il budget.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { carica } from './comune.mjs';
import { banco, LUNGHEZZE } from './simulatore.mjs';
import { QUANTI_LOCALE } from './banco-locale-param.mjs';
import { MODELLI, sistema, fascicolo, chiama } from './remoto.mjs';

const BASE = { QUANTI: 30, SANI: 10, RIPETI: 5, STAB_LAC: 6, STAB_SANI: 2 };
// Stessi studenti e stesse ripetizioni per i due modelli. La prima stima a secco (uscita
// supposta 2000-3000 token) dava ~8 dollari con meno ripetizioni per Sonnet; quattro chiamate
// pilota hanno misurato ~3.400 token in e 27-152 out, e il piano e' tornato uguale per tutti.
export const PIANO = { 'claude-haiku-5-5': BASE, 'claude-sonnet-5-5': BASE };
// stime prudenti per la prova a secco; i token veri si registrano al lancio
const CARATTERI_PER_TOKEN = 1.7; // misurato sulle chiamate pilota: 1,78 (lo schema conta come input)
const USCITA_STIMATA = { 'claude-haiku-5-5': 600, 'claude-sonnet-5-5': 600 }; // misurati 27-152: margine x4
export const BUDGET = 10;

export function compitiDelPiano(dati, piano) {
  const tutti = banco(dati, { quanti: QUANTI_LOCALE, sani: QUANTI_LOCALE });
  const compiti = [];
  for (const n of LUNGHEZZE) {
    const qui = tutti.filter(s => s.n === n);
    const lac = qui.filter(s => s.nonSa.length).slice(0, piano.QUANTI);
    const sani = qui.filter(s => !s.nonSa.length).slice(0, piano.SANI);
    lac.forEach((st, i) => { for (let k = 0; k < (i < piano.STAB_LAC ? piano.RIPETI : 1); k++) compiti.push({ st, rip: k }); });
    sani.forEach((st, i) => { for (let k = 0; k < (i < piano.STAB_SANI ? piano.RIPETI : 1); k++) compiti.push({ st, rip: k }); });
  }
  return compiti;
}

const principale = import.meta.url === `file://${process.argv[1]}`;
if (principale) {
  const dati = carica();
  const sis = sistema(dati).length;
  let stima = 0;
  for (const m of Object.keys(MODELLI)) {
    const compiti = compitiDelPiano(dati, PIANO[m]);
    const inTok = compiti.reduce((a, c) => a + (sis + fascicolo(c.st, dati).length) / CARATTERI_PER_TOKEN, 0);
    const outTok = compiti.length * USCITA_STIMATA[m];
    const costo = (inTok * MODELLI[m].input + outTok * MODELLI[m].output) / 1e6;
    stima += costo;
    console.log(`${m}: ${compiti.length} chiamate, ~${Math.round(inTok / 1000)}K token in, ~${Math.round(outTok / 1000)}K out, ~$${costo.toFixed(2)}`);
  }
  console.log(`stima totale ~$${stima.toFixed(2)} (budget $${BUDGET})`);

  if (process.argv.includes('--lancia')) {
    if (stima > BUDGET) { console.error('stima oltre il budget: riduci il piano'); process.exit(1); }
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic();
    const file = new URL('./risultati/remoto-grezzo.json', import.meta.url);
    mkdirSync(new URL('./risultati/', import.meta.url), { recursive: true });
    const fatto = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { piano: PIANO, chiamate: [] };
    const chiave = (m, seme, rip) => `${m}|${seme}|${rip}`;
    const gia = new Set(fatto.chiamate.filter(x => !x.errore).map(x => chiave(x.modello_chiesto, x.seme, x.rip)));
    fatto.chiamate = fatto.chiamate.filter(x => !x.errore);
    let speso = fatto.chiamate.reduce((a, x) => a + (x.costo ?? 0), 0);
    const solo = process.argv.find(a => a.startsWith('--modello='))?.split('=')[1];
    const coda = Object.keys(MODELLI).filter(m => !solo || m === solo)
      .flatMap(m => compitiDelPiano(dati, PIANO[m]).map(c => ({ m, c }))).filter(({ m, c }) => !gia.has(chiave(m, c.st.seme, c.rip)));
    const limite = Number(process.argv.find(a => a.startsWith('--max='))?.split('=')[1] ?? Infinity);
    const salva = () => writeFileSync(file, JSON.stringify(fatto, null, 1) + '\n');
    let i = 0, nuove = 0;
    async function lavoratore() {
      while (i < coda.length && nuove < limite) {
        const { m, c } = coda[i++];
        nuove++;
        if (speso > BUDGET) { console.error('budget raggiunto, mi fermo'); return; }
        try {
          const r = await chiama(client, m, c.st, dati);
          speso += r.costo;
          fatto.chiamate.push({ modello_chiesto: m, seme: c.st.seme, n: c.st.n, rip: c.rip, ...r });
        } catch (e) {
          fatto.chiamate.push({ modello_chiesto: m, seme: c.st.seme, n: c.st.n, rip: c.rip, errore: `${e?.status ?? ''} ${String(e?.message ?? e).slice(0, 200)}` });
        }
        if (fatto.chiamate.length % 20 === 0) { salva(); console.log(`${fatto.chiamate.length} chiamate, $${speso.toFixed(3)}`); }
      }
    }
    await Promise.all(Array.from({ length: 6 }, lavoratore));
    salva();
    console.log(`fatto: ${fatto.chiamate.length} chiamate registrate, $${speso.toFixed(3)} spesi in tutto`);
  }
}
