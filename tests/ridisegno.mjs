// Il banco del ridisegno: il regime letto da due dichiarazioni, la navigazione
// come funzione, e i cinque raccordi aggiuntivi del §10.1 di
// docs/ridisegno-progetto.md (il contratto consegnato da P-80).
//
// Lo chiama tests/test_interfaccia.py, e non gira da solo sotto `node --test`:
// legge da stdin `{"pagina": "<testo di una pagina>"}` e scrive su stdout la
// lista delle verifiche, `[{gruppo, nome, ok, extra}]`.
//
// Perche' non bastano i nomi. Una pagina puo' dichiarare quattro sezioni e poi
// mandare `cart` su Quiz, produrre `/allenati` con un pushState — che una
// ricarica paga con un 404 —, lasciare un gettone nell'URL, aprire un runner da
// un link, pescare due volte il breve, tagliare i segnalibri a 20, perdere un
// numero ripetuto o un oscurato dalla ricerca, scrivere «Svista» a un server
// che non la accoglie: nessun test del motore se ne accorge. E' il difetto di
// casa — il numero promesso e la lista che si apre da due fonti — spostato
// nella colla fra pagina e motore, come per i quiz (P-06), il ciclo (P-31), la
// mappa (P-44) e il Carteggio (P-35).
//
// Che cosa fa. Legge il regime (tests/regime_pagina.py ha la stessa regola, e
// test_interfaccia.py confronta i due); in statica guarda le quattro sezioni,
// la barra, i segmenti e gli alias; poi estrae dallo script `navigazioneSito()`
// e i raccordi `preparaBreve`, `preparaSegnalibri`, `avviaSegnalibri`,
// `ricercaNumero`, `permessoGesto`, con le funzioni di primo livello che
// nominano, e li esegue contro il motore vero con un `E` che registra ogni
// chiamata **e poi esegue quella vera**, sui casi del §3 e del §8 del progetto.
//
// Che cosa NON fa. Non guida un browser: che il documento resti lo stesso, che
// la cronologia riporti allo stesso punto, che i legali si aprano sopra il
// lavoro, che i testi si vedano sono il banco dei tragitti (E, P-82). La
// navigazione qui e' una funzione — un indirizzo entra, una destinazione esce.

import { readFileSync } from 'node:fs';
import { MOTORE, nelSito } from './sito.mjs';
// Il motore e la banca della cartella del sito: site/, o la copia di RG_SITO (P-84).
const REALE = await import(MOTORE);
import { funzioni, dipendenze, scriptModulo, chiusa } from './pagina_js.mjs';

const VISTE = ['home', 'allenati', 'esame', 'progressi'];
const SEGMENTI = ['quiz', 'carteggio', 'segnali'];
const ALIAS = { quiz: ['allenati', 'quiz', null], cart: ['allenati', 'carteggio', null], seg: ['allenati', 'segnali', null],
  tec: ['allenati', 'carteggio', 'tecniche'], diag: ['progressi', null, null], oggi: ['home', null, null], info: ['home', null, 'info'] };
const RACCORDI = ['preparaBreve', 'preparaSegnalibri', 'avviaSegnalibri', 'ricercaNumero', 'permessoGesto'];
// Le funzioni del motore che scelgono, contano o decidono: solo queste si
// registrano, le altre passano dritte.
const REGISTRATE = ['coda', 'estraiNuoviPrima', 'estrai', 'codaSegnalibri', 'segnalibri', 'cercaNumero', 'rigaScrivibile',
  'validaRiga', 'mirata', 'daAllenare', 'screening', 'lunghezzaScreening', 'simulazione', 'simulazioneVela',
  'giroTecniche', 'tappeto', 'provaCarteggio', 'erroriSessione', 'quadro', 'dovePesa', 'contaStati', 'rimescola'];
// I tipi di riga che il server dichiara: la v0.30.0 non li dice (null), il main
// di P-73 dice 'a' e non 'b', il server di oggi li dice tutti.
const TIPI_P73 = ['q', 'c', 't', 's', 'g', 'a'];


/**
 * Le costanti di primo livello dello script, `{nome: testo}`: `const NOME = …;`
 * con un valore fra parentesi, graffe o quadre, o su una riga, e un nome in
 * maiuscolo. Un raccordo le
 * nomina — la tabella degli alias, l'elenco dei parametri, VISTE_RIDISEGNO — e
 * il lettore di pagina_js.mjs prende solo le funzioni: senza di loro il
 * raccordo lancerebbe un ReferenceError che non e' un difetto della pagina.
 */
function costanti(script) {
  const out = {};
  // Solo i nomi in MAIUSCOLO, le tabelle: lo stato della pagina (`S`) resta
  // fuori, cosi' un raccordo che lo legge lancia un ReferenceError, come nei
  // banchi dei quiz e della mappa.
  const re = /^const\s+([A-Z][A-Z0-9_]+)\s*=\s*/gm;
  let m;
  while ((m = re.exec(script))) {
    const i = m.index + m[0].length;
    let fine;
    if ('([{'.includes(script[i])) {
      const c = chiusa(script, i);
      if (c < 0) continue;
      fine = script.indexOf(';', c);
    } else fine = script.indexOf(';', i);
    if (fine < 0) continue;
    out[m[1]] = script.slice(m.index, fine + 1);
  }
  return out;
}

/** Il testo della funzione, delle funzioni che nomina e delle costanti che queste nominano. */
function conTutto(script, tutte, nome) {
  const cost = costanti(script);
  const fns = [...dipendenze(tutte, nome)];
  const prese = new Set();
  let testo = fns.map((n) => tutte[n]).join('\n');
  let cambiato = true;
  while (cambiato) {
    cambiato = false;
    for (const [c, t] of Object.entries(cost)) {
      if (prese.has(c)) continue;
      if (new RegExp('(?<![\\w$.])' + c.replace(/\$/g, '\\$') + '\\b').test(testo)) { prese.add(c); testo += '\n' + t; cambiato = true; }
    }
  }
  return [...prese].map((c) => cost[c]).join('\n') + '\n' + fns.map((n) => tutte[n]).join('\n\n');
}

const verifiche = [];
function check(gruppo, nome, ok, extra = '') {
  verifiche.push({ gruppo, nome, ok: !!ok, extra: ok ? '' : extra });
}

const items = JSON.parse(readFileSync(nelSito('dati/quiz.json'), 'utf8'));
const meta = JSON.parse(readFileSync(nelSito('dati/meta.json'), 'utf8'));
const OGGI = '2026-10-15';
const base = items.filter((x) => x.k === 'base');
const vela = items.filter((x) => x.k === 'vela');

let chiamate = [];
const E = new Proxy(REALE, {
  get(t, k) {
    if (!REGISTRATE.includes(k)) return t[k];
    return (...args) => { const r = t[k](...args); chiamate.push({ f: k, args, r }); return r; };
  },
});

function congela(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) { Object.freeze(x); for (const v of Object.values(x)) congela(v); }
  return x;
}
function esegui(fn, ...args) {
  chiamate = [];
  try { return { esito: fn(...args), chiamate }; } catch (e) { return { errore: e, chiamate }; }
}
const uguale = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const breve = (x) => { const s = JSON.stringify(x); return s && s.length > 200 ? s.slice(0, 200) + '…' : s; };
const nomi = (cs) => cs.map((c) => c.f).join(', ') || 'nessuna';
const ids = (l) => (Array.isArray(l) ? l.map((x) => x && x.id) : l);

function riuscita(g, nome, run) {
  if (!run.errore) return true;
  check(g, nome + ': si esegue', false, 'lancia: ' + run.errore.message
    + (run.errore instanceof ReferenceError ? ' — il raccordo dipende solo dai suoi argomenti, da E e dalle funzioni di primo livello' : '')
    + (run.errore instanceof TypeError && /read.only|frozen|not extensible|Cannot (assign|add|delete)/i.test(run.errore.message)
      ? ' — ha scritto nella richiesta o nel contesto, che sono dati e non si toccano' : ''));
  return false;
}

// --- 1. la statica: quattro sezioni, la barra, i segmenti, gli alias --------

// L'indirizzo canonico di ogni sezione (§3.1): query su `/`, e la Home `/`.
const INDIRIZZI = { home: '/', allenati: '/?sezione=allenati', esame: '/?sezione=esame', progressi: '/?sezione=progressi' };
/** null se `href` e' il canonico della sezione `dest`, altrimenti il motivo. */
function difettoIndirizzo(dest, href) {
  const canon = INDIRIZZI[dest];
  if (href == null) return dest + ': link senza href — non si apre in una scheda nuova e non dice dove porta (§3.3)';
  const h = href.replace(/&amp;/g, '&');
  if (h === canon) return null;
  const u = new URL(h, 'https://rottagiusta.invalid/');
  if (/\.html$/.test(u.pathname)) return dest + ': href ' + h + ' con l\'estensione — gli indirizzi interni sono quelli puliti (R-ARCH-05)';
  if (u.origin !== 'https://rottagiusta.invalid' || /^[a-z]+:|^\/\//i.test(h)) return dest + ': href ' + h + ' fuori dal sito, o non relativo — il canonico e\' ' + canon;
  if (u.pathname !== '/') return dest + ': href ' + h + ', una rotta che il server non serve e che una ricarica paga con un 404 — le sezioni sono query su / (§3.1)';
  return dest + ': href ' + h + ' diverso dal canonico ' + canon;
}

function statica(pagina) {
  const G = 'struttura';
  const sezioni = [...pagina.matchAll(/<section class="[^"]*\bview\b[^"]*" id="(v-[a-z]+)"/g)].map((m) => m[1]);
  check(G, 'quattro sezioni .view, con gli id del §2 e nessun\'altra', uguale([...sezioni].sort(), VISTE.map((v) => 'v-' + v).sort()),
    'trovate: ' + sezioni.join(', ') + ' — le sette viste di prima non restano vuote per tenere verde un censimento (R-NAV-06)');
  const nav = pagina.match(/<nav[^>]*>([\s\S]*?)<\/nav>/);
  check(G, 'una barra di navigazione', !!nav, 'nessun <nav>');
  if (nav) {
    // Le voci con data-v, link o pulsanti: il censimento prende tutte e due le
    // forme, e nel ridisegno pretende i link (P-85). Prima vedeva i soli
    // pulsanti, e la barra del §3.3 dava «voci:» vuoto.
    const voci = [...nav[1].matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)]
      .map((m) => ({ tag: m[1], dest: (m[2].match(/\bdata-v="([a-z]+)"/) || [])[1], href: (m[2].match(/\bhref="([^"]*)"/) || [])[1], dentro: m[3] }))
      .filter((x) => x.dest);
    check(G, 'la barra ha le quattro voci, in ordine: Home · Allenati · Esame · Progressi', uguale(voci.map((x) => x.dest), VISTE),
      'voci: ' + voci.map((x) => x.dest).join(', '));
    const mute = voci.filter((x) => !x.dentro.replace(/<[^>]+>/g, '').trim()).map((x) => x.dest);
    check(G, 'ogni voce della barra ha la parola intera, non la sola icona', !mute.length, 'solo icona: ' + mute.join(', '));
    const pulsanti = voci.filter((x) => x.tag !== 'a').map((x) => x.dest);
    check(G, 'ogni voce della barra e\' un link, non un pulsante', !pulsanti.length,
      'un pulsante al posto di un link: ' + pulsanti.join(', ') + ' — il §3.3 vuole un href reale, che si apre in una scheda nuova');
    const storti = voci.filter((x) => x.tag === 'a').map((x) => difettoIndirizzo(x.dest, x.href)).filter(Boolean);
    check(G, 'ogni link della barra porta all\'indirizzo canonico della sua sezione', !storti.length, storti.join('; '));
  }
  const segmenti = [...pagina.matchAll(/data-segmento="([a-z]+)"/g)].map((m) => m[1]);
  check(G, 'i tre segmenti di Allenati, Quiz · Carteggio · Segnali', SEGMENTI.every((s) => segmenti.includes(s)) && segmenti.every((s) => SEGMENTI.includes(s)),
    'segmenti: ' + segmenti.join(', '));
  const porte = [...new Set([...pagina.matchAll(/data-v="([a-z]+)"/g)].map((m) => m[1]))];
  const estranee = porte.filter((p) => !VISTE.includes(p) && !ALIAS[p]);
  check(G, 'ogni [data-v] e\' una sezione o un alias della tabella C', !estranee.length, 'porte verso niente: ' + estranee.join(', '));
  for (const v of VISTE) check(G, 'la sezione «' + v + '» ha una porta', porte.includes(v), 'nessun [data-v="' + v + '"]');
  const vecchie = ['oggi', 'quiz', 'cart', 'diag', 'tec', 'seg', 'info'].filter((v) => new RegExp('id="v-' + v + '"').test(pagina));
  check(G, 'nessuna vista di prima, nemmeno vuota', !vecchie.length, 'ancora nel file: ' + vecchie.map((v) => '#v-' + v).join(', '));
  const esame = pagina.match(/<section class="[^"]*\bview\b[^"]*" id="v-esame">([\s\S]*?)<\/section>/);
  check(G, 'la porta della simulazione sta in Esame (data-modo="sim" in #v-esame)', !!esame && /data-modo="sim"/.test(esame[1]),
    '«Simula la prova» porta a Esame, e da li\' si apre la preparazione (ridisegno §5.2, §5.4)');
}

// --- 2. la navigazione come funzione -----------------------------------------

function navigazione(nav) {
  const G = 'navigazione';
  const chiedi = (url, evento = 'carica', contesto = {}) => {
    const run = esegui(nav, congela({ url, evento, contesto }));
    if (!riuscita(G, url + ' (' + evento + ')', run)) return null;
    return run.esito;
  };
  const come = (nome, d, atteso) => {
    if (!d) return;
    const diff = Object.keys(atteso).filter((k) => !uguale(d[k], atteso[k])).map((k) => `${k}: ${breve(d[k])} invece di ${breve(atteso[k])}`);
    check(G, nome, !diff.length, diff.join('; '));
  };
  const risultati = [];
  const q = (url, evento, contesto) => { const d = chiedi(url, evento, contesto); if (d) risultati.push([url, d]); return d; };

  come('/ e\' la Home', q('/'), { sezione: 'home', segmento: null, pannello: null, effetto: 'apri', url: '/', gettone: null, motivo: null });
  come('/?sezione=allenati apre Allenati su Quiz', q('/?sezione=allenati'), { sezione: 'allenati', segmento: 'quiz', url: '/?sezione=allenati&segmento=quiz', effetto: 'apri' });
  come('/?sezione=allenati&segmento=carteggio', q('/?sezione=allenati&segmento=carteggio'), { sezione: 'allenati', segmento: 'carteggio' });
  come('/?sezione=allenati&segmento=segnali', q('/?sezione=allenati&segmento=segnali'), { sezione: 'allenati', segmento: 'segnali' });
  come('/?sezione=esame, senza segmento', q('/?sezione=esame'), { sezione: 'esame', segmento: null, url: '/?sezione=esame' });
  come('/?sezione=progressi', q('/?sezione=progressi'), { sezione: 'progressi', segmento: null });
  come('le sezioni si leggono in minuscolo', q('/?sezione=Esame'), { sezione: 'esame' });
  come('/?attivita=quiz-base&fase=preparazione apre la preparazione, in Allenati/Quiz', q('/?attivita=quiz-base&fase=preparazione'),
    { sezione: 'allenati', segmento: 'quiz', attivita: 'quiz-base', fase: 'preparazione', effetto: 'apri', url: '/?sezione=allenati&segmento=quiz&attivita=quiz-base&fase=preparazione' });
  for (const [alias, [sezione, segmento, extra]] of Object.entries(ALIAS)) {
    come('l\'alias «' + alias + '» va dove dice la tabella C', q('/?sezione=' + alias),
      { sezione, segmento, attivita: extra === 'tecniche' ? 'tecniche' : null, pannello: extra === 'info' ? 'info' : null, effetto: 'apri' });
  }
  come('/app e\' Allenati/Quiz, con l\'indirizzo canonico', q('/app'), { sezione: 'allenati', segmento: 'quiz', url: '/?sezione=allenati&segmento=quiz', effetto: 'apri', gettone: null });
  come('/app#verifica=TOK porta il gettone in memoria e lo toglie dall\'indirizzo', q('/app#verifica=Abc-123_x'),
    { sezione: 'allenati', segmento: 'quiz', gettone: { tipo: 'verifica', valore: 'Abc-123_x' }, url: '/?sezione=allenati&segmento=quiz' });
  come('/#password=TOK sul canonico', q('/#password=tok9'), { sezione: 'home', gettone: { tipo: 'password', valore: 'tok9' }, url: '/' });
  come('/allenati non e\' una rotta del sito: una ricarica da\' 404', q('/allenati'), { effetto: 'indisponibile', motivo: 'rotta non servita', sezione: 'home', url: '/' });
  come('/qualcosa/altro e\' «rotta non servita»', q('/quiz/base'), { effetto: 'indisponibile', motivo: 'rotta non servita' });
  come('un parametro sconosciuto porta alla Home e lo dice', q('/?foo=1'), { effetto: 'indisponibile', motivo: 'parametro sconosciuto', sezione: 'home' });
  come('una sezione sconosciuta e\' «parametro sconosciuto»', q('/?sezione=vetrina'), { effetto: 'indisponibile', motivo: 'parametro sconosciuto' });
  come('un segmento sconosciuto e\' «parametro sconosciuto»', q('/?sezione=allenati&segmento=boh'), { effetto: 'indisponibile', motivo: 'parametro sconosciuto' });
  come('fase=runner non apre un runner: «attivita non disponibile», e la preparazione offerta', q('/?sezione=allenati&attivita=quiz-base&fase=runner'),
    { effetto: 'indisponibile', motivo: 'attivita non disponibile', fase: 'preparazione', sezione: 'allenati' });
  come('fase=risultato non mostra un risultato da un indirizzo', q('/?sezione=esame&fase=risultato'), { effetto: 'indisponibile', motivo: 'attivita non disponibile' });
  // I legali.
  const tappa = { sezione: 'esame', segmento: null, pannello: null };
  come('/privacy toccata si apre sopra la tappa, che resta', q('/privacy', 'tocco', { tappa }), { pannello: 'privacy', sezione: 'esame', effetto: 'apri', ritorno: tappa, url: '/privacy' });
  come('/avvertenza#condizioni toccata e\' il pannello delle condizioni', q('/avvertenza#condizioni', 'tocco', { tappa: { sezione: 'allenati', segmento: 'carteggio' } }),
    { pannello: 'condizioni', sezione: 'allenati', segmento: 'carteggio', url: '/avvertenza#condizioni' });
  come('/avvertenza toccata senza una tappa si apre sopra la Home', q('/avvertenza', 'tocco'), { pannello: 'avvertenza', sezione: 'home' });
  come('/privacy caricata la serve il file autonomo, non il canonico', q('/privacy', 'carica'), { effetto: 'indisponibile', motivo: 'rotta non servita' });
  come('/privacy dalla cronologia si ripristina', q('/privacy', 'cronologia', { tappa }), { pannello: 'privacy', effetto: 'ripristina' });
  // L'attivita' in corso e conclusa.
  const inCorso = { attivita: { stato: 'in corso', riferimento: 'r1' }, tappa: { sezione: 'allenati', segmento: 'quiz' } };
  come('con un\'attivita\' in corso un tocco che lascia la sezione chiede di uscire', q('/?sezione=home', 'tocco', inCorso), { effetto: 'chiedi-uscita', sezione: 'home' });
  come('con un\'attivita\' in corso Indietro chiede di uscire', q('/?sezione=allenati', 'cronologia', inCorso), { effetto: 'chiedi-uscita' });
  come('il profilo si apre sopra l\'attivita\' senza chiedere', q('/?sezione=allenati&segmento=quiz#profilo', 'tocco', inCorso), { pannello: 'profilo', effetto: 'apri' });
  come('un legale si apre sopra l\'attivita\' senza chiedere', q('/privacy', 'tocco', inCorso), { pannello: 'privacy', effetto: 'apri' });
  come('un caricamento non chiede niente: il contesto non c\'e\' piu\'', q('/?sezione=home', 'carica', inCorso), { effetto: 'apri' });
  const conclusa = { attivita: { stato: 'conclusa', riferimento: 'r1' }, tappa: { sezione: 'home', segmento: null } };
  come('Avanti su un tentativo concluso mostra il risultato, non una prova nuova', q('/?sezione=allenati', 'cronologia', conclusa), { effetto: 'mostra-risultato' });
  come('Indietro senza attivita\' ripristina la tappa', q('/?sezione=esame', 'cronologia', { tappa }), { effetto: 'ripristina', sezione: 'esame', ritorno: tappa });
  come('un tocco con un\'attivita\' conclusa apre', q('/?sezione=progressi', 'tocco', conclusa), { effetto: 'apri' });
  // Niente di prodotto e' una rotta che il server non serve; niente porta il gettone.
  const prodotti = risultati.map(([, d]) => d.url).filter(Boolean);
  check(G, 'nessun indirizzo prodotto e\' una rotta che il server non serve', prodotti.every((u) => u === '/' || u.startsWith('/?') || u === '/privacy' || u === '/avvertenza' || u === '/avvertenza#condizioni'),
    'prodotti: ' + prodotti.filter((u) => !(u === '/' || u.startsWith('/?') || u.startsWith('/privacy') || u.startsWith('/avvertenza'))).join(', ') + ' — una ricarica li paga con un 404 (§3.1)');
  check(G, 'nessun indirizzo prodotto porta un gettone', prodotti.every((u) => !/#(verifica|password)=/.test(u)), 'il gettone resta solo in memoria (§3.2)');
  // Pura: due chiamate uguali, uno stesso risultato; il contesto non si tocca.
  const c1 = congela({ attivita: { stato: 'in corso', riferimento: 'z' }, tappa: { sezione: 'esame', segmento: null, pannello: null } });
  const a = chiedi('/?sezione=home', 'tocco', c1), b = chiedi('/?sezione=home', 'tocco', c1);
  check(G, 'e\' una funzione: stesso ingresso, stessa uscita, e il contesto non cambia', !!a && uguale(a, b) && uguale(c1, { attivita: { stato: 'in corso', riferimento: 'z' }, tappa: { sezione: 'esame', segmento: null, pannello: null } }), breve(a) + ' / ' + breve(b));
}

// --- 3. il breve: dieci quiz base, prima i mai visti, da due chiamate ---------

function fonteDi(items_, prog) {
  return congela({ items: items_, prog, oggi: OGGI, pesi: { ...meta.pesi_esame }, prove: JSON.parse(JSON.stringify(meta.prove)), esame: null });
}

function brevi(preparaBreve) {
  const G = 'breve';
  const prog = {};
  for (const it of base.slice(0, 30)) REALE.applica(prog, it.id, true, 9000, '2026-10-10');
  const casi = [
    ['sulla banca vera, con uno storico', fonteDi(items, congela(prog)), 10, 'pronta'],
    ['sulla banca vera, senza storico', fonteDi(items, congela({})), 10, 'pronta'],
    ['su una banca di sette quiz base', fonteDi(congela([...base.slice(0, 7), ...vela.slice(0, 20)]), congela({})), 7, 'ridotta'],
    ['su una banca senza quiz base', fonteDi(congela(vela.slice(0, 20)), congela({})), 0, 'vuota'],
  ];
  for (const [nome, fonte, quanti, stato] of casi) {
    const run = esegui(preparaBreve, congela({ seme: 42 }), fonte);
    if (!riuscita(G, nome, run)) continue;
    const r = run.esito || {};
    const cc = run.chiamate.filter((c) => c.f === 'coda'), ee = run.chiamate.filter((c) => c.f === 'estraiNuoviPrima');
    const altre = run.chiamate.filter((c) => c.f !== 'coda' && c.f !== 'estraiNuoviPrima');
    check(G, nome + ': una E.coda() sul base intero, mai visti e gia\' visti, senza tetto',
      cc.length === 1 && cc[0].args[0] === fonte.items && cc[0].args[1] === fonte.prog && cc[0].args[2] === fonte.oggi
        && uguale(Object.fromEntries(Object.entries(cc[0].args[3] || {}).filter(([, v]) => v !== undefined).sort()), { includiChiusi: true, kind: 'base', n: 0 }),
      cc.length + ' chiamate a coda' + (cc[0] ? ', opzioni ' + breve(cc[0].args[3]) : '') + ' — il pool e\' { kind: base, n: 0, includiChiusi: true }: nessun filtro di banca rifatto in pagina');
    check(G, nome + ': una E.estraiNuoviPrima() su quel pool, dieci, con il seme della configurazione',
      ee.length === 1 && cc[0] && ee[0].args[0] === cc[0].r && ee[0].args[1] === fonte.prog && ee[0].args[2] === fonte.oggi && ee[0].args[3] === 10 && ee[0].args[4] === 42,
      ee.length + ' chiamate a estraiNuoviPrima' + (ee[0] ? ', argomenti ' + breve([ee[0].args[0] === (cc[0] && cc[0].r), ee[0].args[3], ee[0].args[4]]) : '')
        + ' — una seconda pescata alla stessa apertura darebbe una lista diversa da quella promessa');
    check(G, nome + ': nessun\'altra selezione', !altre.length, 'chiamate: ' + nomi(altre));
    check(G, nome + ': la lista e\' quella del motore, e quanti la conta', ee[0] && r.lista === ee[0].r && r.quanti === ee[0].r.length,
      'quanti ' + r.quanti + ', lista di ' + (Array.isArray(r.lista) ? r.lista.length : '—') + ' invece di ' + (ee[0] ? ee[0].r.length : '—'));
    check(G, nome + ': quanti ' + quanti + ', stato «' + stato + '»', r.quanti === quanti && r.stato === stato,
      'quanti ' + r.quanti + ', stato ' + r.stato + ' — la Home scrive «Allenati con {N} domande» e il motivo quando sono meno di dieci');
    if (quanti === 10) {
      check(G, nome + ': prima i mai visti', ee[0] && r.lista.every((it) => REALE.stato(fonte.prog[it.id]) === 'nuovo'), 'un quesito gia\' visto fra i dieci con 1.442 mai visti');
    }
  }
}

// --- 4. i segnalibri: lista e numero da una chiamata, Inizia che confronta ----

const rb = (uid, item, ts, segnato = 1) => ({ _t: 'b', uid, item_id: item, ts, segnato });
function segnalibri(preparaSegnalibri, avviaSegnalibri) {
  const G = 'segnalibri';
  const righe = congela([
    rb('b1', base[10].id, '2026-10-14T10:00:00+02:00'), rb('b2', base[3].id, '2026-10-14T10:01:00+02:00'),
    rb('b3', base[10].id, '2026-10-14T10:02:00+02:00', 0), rb('b4', base[10].id, '2026-10-14T10:03:00+02:00'),
    rb('b5', 'base-99999', '2026-10-14T10:04:00+02:00'), rb('b6', vela[2].id, '2026-10-14T10:05:00+02:00'),
    rb('b7', base[50].id, '2026-10-14T10:06:00+02:00', 0),
    { _t: 'q', uid: 'q1', item_id: base[0].id, kind: 'base', ts: '2026-10-14T09:00:00+02:00', correct: 1, ms: 9000, mode: 'batteria' },
  ]);
  const prova = (nome, richiesta) => {
    const run = esegui(preparaSegnalibri, richiesta);
    if (!riuscita(G, nome, run)) return null;
    const r = run.esito || {};
    const cc = run.chiamate.filter((c) => c.f === 'codaSegnalibri'), altre = run.chiamate.filter((c) => c.f !== 'codaSegnalibri');
    check(G, nome + ': una E.codaSegnalibri() con banca, righe e kind della richiesta',
      cc.length === 1 && cc[0].args[0] === richiesta.banca && cc[0].args[1] === richiesta.righe && (cc[0].args[2] || {}).kind === richiesta.kind,
      cc.length + ' chiamate' + (cc[0] ? ', kind ' + breve((cc[0].args[2] || {}).kind) : ''));
    check(G, nome + ': nessun\'altra selezione', !altre.length, 'chiamate: ' + nomi(altre));
    const vera = REALE.codaSegnalibri(richiesta.banca, richiesta.righe, { kind: richiesta.kind });
    check(G, nome + ': lista, quanti e fuori sono quelli del motore, interi', uguale(ids(r.lista), ids(vera.lista)) && r.quanti === vera.quanti && uguale(r.fuori, vera.fuori),
      `quanti ${r.quanti} (atteso ${vera.quanti}), lista di ${Array.isArray(r.lista) ? r.lista.length : '—'}, fuori ${breve(r.fuori)} (atteso ${breve(vera.fuori)})`);
    check(G, nome + ': stato «' + (vera.quanti ? 'pronta' : 'vuota') + '»', r.stato === (vera.quanti ? 'pronta' : 'vuota'), 'stato ' + r.stato);
    return r;
  };
  const richBase = congela({ banca: items, righe, kind: 'base' });
  const pb = prova('Base: due segnati, uno tolto e rimesso, uno fuori banca', richBase);
  check(G, 'il banco: i segnalibri valgono l\'ultimo gesto, e il segno fuori banca si nomina',
    REALE.codaSegnalibri(items, righe, { kind: 'base' }).quanti === 2 && uguale(REALE.codaSegnalibri(items, righe, {}).fuori, ['base-99999']), '');
  prova('Tutte le banche: anche la vela', congela({ banca: items, righe, kind: undefined }));
  prova('Senza segni: vuota', congela({ banca: items, righe: congela([righe[7]]), kind: 'base' }));
  // Molti segni: nessun tetto.
  const tanti = congela(base.slice(100, 135).map((it, i) => rb('m' + i, it.id, '2026-10-14T11:' + String(i).padStart(2, '0') + ':00+02:00')));
  const pt = prova('Trentacinque segnati: nessun tetto a 20', congela({ banca: items, righe: tanti, kind: 'base' }));
  if (pt) check(G, 'il banco: trentacinque sono trentacinque', pt.quanti === 35 && Array.isArray(pt.lista) && pt.lista.length === 35, 'quanti ' + pt.quanti);
  if (!pb) return;
  // Inizia: uguale, cambiata per un segno in piu', cambiata a lunghezza uguale, cambiata nell'ordine.
  const avvio = (nome, prep, rich, attesa) => {
    const avvii = [];
    const run = esegui(avviaSegnalibri, prep, rich, (...a) => avvii.push(a));
    if (!riuscita(G, nome, run)) return;
    const e = run.esito || {};
    const cc = run.chiamate.filter((c) => c.f === 'codaSegnalibri');
    check(G, nome + ': rilegge i segnalibri di adesso con una E.codaSegnalibri() sulla richiesta', cc.length === 1 && cc[0].args[0] === rich.banca && cc[0].args[1] === rich.righe, cc.length + ' chiamate');
    if (attesa === 'pronta') {
      check(G, nome + ': Inizia avvia una volta la lista dell\'anteprima, come segnalibri', avvii.length === 1 && avvii[0][0] === prep.lista && avvii[0][1] === 'segnalibri' && e.avviata === true && e.quanti === prep.quanti,
        avvii.length + ' avvii, avviata ' + e.avviata + ', ' + breve(avvii[0] && [avvii[0][0] === prep.lista, avvii[0][1]]));
    } else {
      check(G, nome + ': con la lista cambiata Inizia non avvia niente e dice «cambiata»', avvii.length === 0 && e.avviata === false && e.stato === 'cambiata',
        avvii.length + ' avvii, avviata ' + e.avviata + ', stato ' + e.stato + ' — si confrontano id e ordine, non la lunghezza');
    }
  };
  avvio('Inizia con gli stessi segni', pb, richBase, 'pronta');
  avvio('Inizia dopo un segno in piu\'', pb, congela({ ...richBase, righe: congela([...righe, rb('b8', base[7].id, '2026-10-14T12:00:00+02:00')]) }), 'cambiata');
  // Stessa lunghezza: il segno su base[3] tolto, uno nuovo messo.
  avvio('Inizia dopo un segno tolto e uno messo: stessa lunghezza, altri quesiti', pb,
    congela({ ...richBase, righe: congela([...righe, rb('b8', base[3].id, '2026-10-14T12:00:00+02:00', 0), rb('b9', base[7].id, '2026-10-14T12:01:00+02:00')]) }), 'cambiata');
  // Stessi id, altro ordine: la banca ricaricata al contrario.
  avvio('Inizia con gli stessi quesiti in un altro ordine', pb, congela({ ...richBase, banca: congela([...items].reverse()) }), 'cambiata');
  avvio('Inizia con la banca ricaricata uguale', pb, congela({ ...richBase, banca: congela(JSON.parse(JSON.stringify(items))) }), 'pronta');
}

// --- 5. la ricerca per numero: il testo com'e', il risultato com'e' -----------

function ricerca(ricercaNumero) {
  const G = 'ricerca';
  const osc = items.find((x) => x.osc);
  const casi = [
    ['un numero esatto, scritto con spazi e «N.»', ' N. 1.1.1 – 24 ', undefined],
    ['un numero ripetuto nel decreto: due quesiti', '1.2.2-2', undefined],
    ['una voce intera: i parziali', '1.1', undefined],
    ['un prefisso dopo il trattino', '1.1.1-2', undefined],
    ['un oscurato: si trova e si nomina', osc.p, undefined],
    ['un numero che non c\'e\'', '9.9.9-999', undefined],
    ['un testo che non e\' un numero', 'fanali', undefined],
    ['la sola vela', '2.1.1-1', 'vela'],
    ['un numero base cercato nella vela', '1.1.1-24', 'vela'],
    ['vuoto', '', undefined],
  ];
  for (const [nome, testo, kind] of casi) {
    const rich = congela({ banca: items, testo, kind });
    const run = esegui(ricercaNumero, rich);
    if (!riuscita(G, nome, run)) continue;
    const r = run.esito || {};
    const cc = run.chiamate.filter((c) => c.f === 'cercaNumero'), altre = run.chiamate.filter((c) => c.f !== 'cercaNumero');
    check(G, nome + ': una E.cercaNumero() con la banca, il testo com\'e\' digitato e kind', cc.length === 1 && cc[0].args[0] === items && cc[0].args[1] === testo && (cc[0].args[2] || {}).kind === kind,
      cc.length + ' chiamate' + (cc[0] ? ', testo ' + breve(cc[0].args[1]) + ', kind ' + breve((cc[0].args[2] || {}).kind) : '') + ' — nessun parser in pagina, nessuna normalizzazione');
    check(G, nome + ': nessun\'altra funzione', !altre.length, 'chiamate: ' + nomi(altre));
    const vera = REALE.cercaNumero(items, testo, { kind });
    const piatto = (x) => x && { ...x, esatti: ids(x.esatti), parziali: ids(x.parziali) };
    check(G, nome + ': il risultato e\' quello del motore, intero — valido, motivo, numero, esatti, parziali, quanti, oscurati', uguale(piatto(r), piatto(vera)),
      breve(piatto(r)) + ' invece di ' + breve(piatto(vera)) + ' — duplicati e oscurati compresi');
    check(G, nome + ': quanti e\' esatti piu\' parziali', r.quanti === (Array.isArray(r.esatti) ? r.esatti.length : NaN) + (Array.isArray(r.parziali) ? r.parziali.length : NaN), 'quanti ' + r.quanti);
  }
  check(G, 'il banco: i casi hanno due esatti, un oscurato e un testo non valido',
    REALE.cercaNumero(items, '1.2.2-2').esatti.length === 2 && REALE.cercaNumero(items, osc.p).oscurati.includes(osc.id) && REALE.cercaNumero(items, 'fanali').valido === false, '');
}

// --- 6. il permesso di un gesto: rigaScrivibile con il server che si ha davanti -

function gesto(permessoGesto) {
  const G = 'gesto';
  const S = congela({ _t: 'g', uid: 'g-s', attempt_uid: 'a-1', tag: 'S', ts: '2026-10-14T10:00:00+02:00' });
  const N = congela({ _t: 'g', uid: 'g-n', attempt_uid: 'a-1', tag: 'N', ts: '2026-10-14T10:00:00+02:00' });
  const B = congela(rb('b-1', base[0].id, '2026-10-14T10:00:00+02:00'));
  const rotta = congela({ _t: 'b', uid: 'b-x', item_id: base[0].id, ts: '2026-10-14T10:00:00+02:00', segnato: 2 });
  const casi = [
    ['anonimo, «Svista»', S, { accesso: 'anonimo', tipiRiga: REALE.TIPI_RIGA, io: null }, REALE.TIPI_RIGA],
    ['anonimo, un segnalibro', B, { accesso: 'anonimo', tipiRiga: REALE.TIPI_RIGA, io: null }, REALE.TIPI_RIGA],
    ['account, server di oggi, «Svista»', S, { accesso: 'account', tipiRiga: REALE.TIPI_RIGA, io: { tipi_riga: [...REALE.TIPI_RIGA] } }, 'io'],
    ['account, server di P-73 (a senza b), «Svista»', S, { accesso: 'account', tipiRiga: REALE.TIPI_RIGA, io: { tipi_riga: TIPI_P73 } }, 'io'],
    ['account, server di P-73, un segnalibro', B, { accesso: 'account', tipiRiga: REALE.TIPI_RIGA, io: { tipi_riga: TIPI_P73 } }, 'io'],
    ['account, server della v0.30.0 (senza tipi_riga), «Svista»', S, { accesso: 'account', tipiRiga: REALE.TIPI_RIGA, io: { esiti: [] } }, null],
    ['account, server della v0.30.0, «Non lo sapevo»', N, { accesso: 'account', tipiRiga: REALE.TIPI_RIGA, io: {} }, null],
    ['account, senza io (non ancora letto)', S, { accesso: 'account', tipiRiga: REALE.TIPI_RIGA, io: null }, null],
    ['anonimo, una riga rotta', rotta, { accesso: 'anonimo', tipiRiga: REALE.TIPI_RIGA, io: null }, REALE.TIPI_RIGA],
  ];
  for (const [nome, riga, fonte, tipiAttesi] of casi) {
    const f = congela(fonte);
    const run = esegui(permessoGesto, riga, f);
    if (!riuscita(G, nome, run)) continue;
    const r = run.esito || {};
    const cc = run.chiamate.filter((c) => c.f === 'rigaScrivibile'), altre = run.chiamate.filter((c) => c.f !== 'rigaScrivibile');
    const tipi = tipiAttesi === 'io' ? f.io.tipi_riga : tipiAttesi;
    check(G, nome + ': una E.rigaScrivibile() con la riga e i tipi del server che si ha davanti', cc.length === 1 && cc[0].args[0] === riga && cc[0].args[1] === tipi,
      cc.length + ' chiamate' + (cc[0] ? ', tipi ' + breve(cc[0].args[1]) + ' invece di ' + breve(tipi) : '')
        + ' — senza account i tipi del motore, con l\'account tipi_riga di GET /v1/io, e null per un server che non li dice');
    check(G, nome + ': nessun\'altra funzione', !altre.length, 'chiamate: ' + nomi(altre));
    const motivo = REALE.rigaScrivibile(riga, tipi);
    check(G, nome + ': scrivibile ' + (motivo === null) + (motivo ? ', con il motivo del motore' : ''), r.scrivibile === (motivo === null) && (r.motivo ?? null) === motivo,
      breve(r) + ' invece di ' + breve({ scrivibile: motivo === null, motivo }));
  }
  check(G, 'il banco: «Svista» passa oggi e non con i server di prima, un segnalibro non passa con P-73',
    REALE.rigaScrivibile(S, REALE.TIPI_RIGA) === null && REALE.rigaScrivibile(S, TIPI_P73) !== null && REALE.rigaScrivibile(S, null) !== null && REALE.rigaScrivibile(B, TIPI_P73) !== null, '');
}

// --- la pagina ---------------------------------------------------------------

const pagina = JSON.parse(readFileSync(0, 'utf8')).pagina;
const script = scriptModulo(pagina);
const tutte = funzioni(script);
const G = 'regime';
check(G, 'la pagina ha uno script', script.length > 0, 'nessun <script type="module">');
const senza = script.replace(/\/\*[\s\S]*?\*\//g, ' ').split('\n').filter((r) => !/^\s*(\/\/|\*)/.test(r)).join('\n');
const viste = (senza.match(/^const VISTE_RIDISEGNO = \[([^\]]*)\];/m) || [])[1];
const dichiarate = viste == null ? null : [...viste.matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
check(G, 'la pagina dichiara navigazioneSito()', !!tutte.navigazioneSito, 'il regime si legge da navigazioneSito() e VISTE_RIDISEGNO insieme (ridisegno §10.1, A)');
check(G, 'la pagina dichiara VISTE_RIDISEGNO con le quattro sezioni, in ordine', uguale(dichiarate, VISTE),
  'dichiarate: ' + breve(dichiarate) + ' — home, allenati, esame, progressi');
for (const f of RACCORDI) {
  check(G, 'la pagina dichiara ' + f + '()', !!tutte[f], 'i cinque raccordi aggiuntivi sono al primo livello, fuori da MODI (ridisegno §10.1, C e D)');
}
statica(pagina);
const fn = {};
for (const f of ['navigazioneSito', ...RACCORDI]) {
  if (!tutte[f]) continue;
  try { fn[f] = new Function('E', '"use strict";\n' + conTutto(script, tutte, f) + '\nreturn ' + f + ';')(E); }
  catch (e) { check(G, f + ' si legge', false, e.message); }
}
if (fn.navigazioneSito) navigazione(fn.navigazioneSito);
if (fn.preparaBreve) brevi(fn.preparaBreve);
if (fn.preparaSegnalibri && fn.avviaSegnalibri) segnalibri(fn.preparaSegnalibri, fn.avviaSegnalibri);
if (fn.ricercaNumero) ricerca(fn.ricercaNumero);
if (fn.permessoGesto) gesto(fn.permessoGesto);

process.stdout.write(JSON.stringify(verifiche));
