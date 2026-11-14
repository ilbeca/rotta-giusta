// Il metodo remoto: il codice prepara un fascicolo, un modello Claude risponde con una
// diagnosi strutturata, e un raccordo controlla ogni citazione prima di tenerla.
// I numeri mostrati non li dice il modello: li conta il codice sulle citazioni controllate.
import { conti, MIN_ERRORI } from './locale.mjs';

export const MODELLI = {
  'claude-haiku-5-5': { input: 0.10, output: 0.50 },   // $ per milione di token, prompt <= 100K
  'claude-sonnet-5-5': { input: 2.00, output: 10.00 },
};
export const SFORZO = 'medium';
export const CONFIDENZE = ['bassa', 'media', 'alta'];

export function sistema(dati) {
  const tass = dati.concetti.map(c => `- ${c.id}: ${c.nome}. ${c.copre}`).join('\n');
  return `Sei un istruttore di patente nautica. Ricevi il fascicolo delle risposte di una persona ai quesiti della voce «I principali fanali luminosi e il sistema IALA» e dici quali concetti, fra quelli della tassonomia, la persona non sa.

Tassonomia (usa solo questi id):
${tass}

Come leggere i dati:
- Ogni quesito ha tre risposte: chi non sa un concetto indovina comunque circa una volta su tre, quindi una risposta giusta è una prova debole che il concetto sia saputo.
- Chi sa un concetto sbaglia ogni tanto per svista, circa una volta su dieci.
- Un quesito può toccare due concetti; l'errore può dipendere da uno solo dei due.
- Tag dopo un errore: «N» = la persona dice che non lo sapeva (non è una svista); «S» = dice che è stata una svista (prova debole).
- Confronta gli errori di un concetto con quante domande c'erano su quel concetto e con il tasso d'errore generale della persona.

Regole della risposta:
- Diagnostica un concetto solo se hai almeno ${MIN_ERRORI} errori distinti su quel concetto, e citali per id: solo quesiti sbagliati presenti nel fascicolo e che portano quel concetto.
- Se gli errori sono sparsi o sono compatibili con le sviste, rispondi esito "nessuna_lacuna" e diagnosi vuota. È una risposta ammessa e spesso corretta.
- Confidenza: "bassa", "media" o "alta".`;
}

export function fascicolo(st, dati) {
  const { per, N, E, ultima } = conti(st, dati.perId);
  const perConcetto = dati.concetti
    .filter(c => per.has(c.id))
    .map(c => { const s = per.get(c.id); return { concetto: c.id, fatte: s.fatti.size, giuste: s.fatti.size - s.errori.size, sbagliate: s.errori.size }; });
  const errori = [...ultima.values()].filter(r => !r.giusta).map(r => {
    const q = dati.perId.get(r.id);
    return { id: r.id, domanda: q.d, scelta: q.r[r.scelta], esatta: q.r[q.x], concetti: q.concetti, tag: r.tag, data: r.ts };
  });
  // un oggetto per riga: lo stesso JSON, meno token
  const righe = x => x.map(o => '  ' + JSON.stringify(o)).join(',\n');
  return '{"totale": ' + JSON.stringify({ fatte: N, sbagliate: E }) + ',\n "per_concetto": [\n' + righe(perConcetto) + '\n ],\n "errori": [\n' + righe(errori) + '\n ]}';
}

export function schema(dati) {
  return {
    type: 'object',
    properties: {
      esito: { type: 'string', enum: ['lacune', 'nessuna_lacuna'] },
      diagnosi: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            concetto: { type: 'string', enum: dati.concetti.map(c => c.id) },
            quesiti: { type: 'array', items: { type: 'string' } },
            confidenza: { type: 'string', enum: CONFIDENZE },
          },
          required: ['concetto', 'quesiti', 'confidenza'],
          additionalProperties: false,
        },
      },
    },
    required: ['esito', 'diagnosi'],
    additionalProperties: false,
  };
}

// Il raccordo. Una citazione vale se il quesito esiste nella voce, e' stato fatto, e' sbagliato
// all'ultima risposta e porta il concetto diagnosticato. Una diagnosi resta solo con almeno
// MIN_ERRORI citazioni valide distinte. `minConfidenza` filtra in piu' sulla scala del modello.
export function raccordo(uscita, st, dati, { minConfidenza = 'bassa' } = {}) {
  const { ultima } = conti(st, dati.perId);
  const scarti = { quesito_inesistente: 0, non_fatto: 0, non_sbagliato: 0, concetto_assente: 0, sotto_minimo: 0, confidenza: 0, doppione: 0, forma: 0 };
  const tenuti = new Set();
  if (!uscita || !Array.isArray(uscita.diagnosi)) { scarti.forma++; return { concetti: [], scarti }; }
  for (const d of uscita.diagnosi) {
    if (!dati.concetti.some(c => c.id === d.concetto)) { scarti.forma++; continue; }
    if (CONFIDENZE.indexOf(d.confidenza) < CONFIDENZE.indexOf(minConfidenza)) { scarti.confidenza++; continue; }
    const validi = new Set();
    for (const id of new Set(d.quesiti)) {
      const q = dati.perId.get(id);
      if (!q) { scarti.quesito_inesistente++; continue; }
      const r = ultima.get(id);
      if (!r) { scarti.non_fatto++; continue; }
      if (r.giusta) { scarti.non_sbagliato++; continue; }
      if (!q.concetti.includes(d.concetto)) { scarti.concetto_assente++; continue; }
      validi.add(id);
    }
    if (validi.size < MIN_ERRORI) { scarti.sotto_minimo++; continue; }
    if (tenuti.has(d.concetto)) { scarti.doppione++; continue; }
    tenuti.add(d.concetto);
  }
  return { concetti: [...tenuti], scarti };
}

export async function chiama(client, modello, st, dati) {
  const t0 = performance.now();
  const risposta = await client.messages.create({
    model: modello,
    max_tokens: 16000,
    system: sistema(dati),
    messages: [{ role: 'user', content: fascicolo(st, dati) }],
    output_config: { effort: SFORZO, format: { type: 'json_schema', schema: schema(dati) } },
  });
  const ms = Math.round(performance.now() - t0);
  let uscita = null;
  if (risposta.stop_reason === 'end_turn') {
    const testo = risposta.content.filter(b => b.type === 'text').map(b => b.text).join('');
    try { uscita = JSON.parse(testo); } catch { uscita = null; }
  }
  const u = risposta.usage;
  const prezzo = MODELLI[modello];
  const costo = (u.input_tokens * prezzo.input + u.output_tokens * prezzo.output) / 1e6;
  return { modello: risposta.model, stop_reason: risposta.stop_reason, stop_details: risposta.stop_details ?? null, uscita, ms, usage: { input_tokens: u.input_tokens, output_tokens: u.output_tokens }, costo };
}
