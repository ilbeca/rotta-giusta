// La posta: chi la spedisce e che cosa c'e' scritto.
//
// docs/account-progetto.md §9. Un fornitore e' un oggetto con `invia(mail)`,
// che si risolve se la mail e' accettata e lancia se no: la suite ne passa uno
// finto, che raccoglie o rifiuta; sulla macchina e' Scaleway Transactional
// Email, chiamata con `fetch`, senza un client SMTP (§2.2).
//
// Nessuna mail contiene dati di studio, nessun pixel e nessun link riscritto
// (§9.5). Ogni mail dice perche' e' arrivata e che cosa fare se non l'hai
// chiesta. Il gettone sta nel frammento, dopo `#`: non parte mai verso il
// server che serve la pagina (§9.2).

/**
 * Il fornitore di Scaleway. **Non misurato**: una mail vera vuole la chiave
 * API di Transactional Email, che e' un segreto, sta sulla macchina e si crea
 * con la messa in esercizio (§19). La forma della richiesta e' quella della
 * documentazione dell'API `transactional-email/v1alpha1`.
 */
export function postaScaleway({ chiave, progetto, regione = 'fr-par', mittente = 'noreply@posta.rottagiusta.it' }) {
  if (!chiave || !progetto) throw new Error('manca la chiave o il progetto di Scaleway');
  const indirizzo = `https://api.scaleway.com/transactional-email/v1alpha1/regions/${regione}/emails`;
  return {
    async invia({ a, oggetto, testo, html }) {
      const r = await fetch(indirizzo, {
        method: 'POST',
        headers: { 'X-Auth-Token': chiave, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { email: mittente, name: 'Rotta Giusta' },
          to: [{ email: a }],
          subject: oggetto, text: testo, html, project_id: progetto,
        }),
      });
      if (!r.ok) throw new Error(`Scaleway ha rifiutato la mail: ${r.status}`);
    },
  };
}

/**
 * Il fornitore di quando la posta non e' configurata: rifiuta tutto. Una
 * registrazione risponde 503, dichiarato; nessun «ti abbiamo scritto» con la
 * mail mai partita (§9.3).
 */
export const postaAssente = {
  async invia() { throw new Error('posta non configurata'); },
};

// --- i testi ------------------------------------------------------------------------

const PIEDE = [
  '',
  '—',
  'Rotta Giusta · https://rottagiusta.it',
  'Ti scriviamo solo per il tuo account: niente newsletter, niente pubblicità.',
].join('\n');

const html = (testo) => '<!doctype html><meta charset="utf-8"><pre style="font:15px/1.5 system-ui,sans-serif;white-space:pre-wrap">'
  + testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(https:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')
  + '</pre>';

const giorno = (iso) => new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });

function mail(a, oggetto, righe) {
  const testo = righe.join('\n') + '\n' + PIEDE + '\n';
  return { a, oggetto, testo, html: html(testo) };
}

export function mailVerifica({ a, link, scade }) {
  return mail(a, 'Conferma il tuo indirizzo per Rotta Giusta', [
    'Hai creato un account su Rotta Giusta con questo indirizzo.',
    '',
    'Per confermarlo apri questo link entro 24 ore:',
    link,
    '',
    `Se non lo confermi, l'account e le risposte salvate si cancellano il ${giorno(scade)}.`,
    '',
    'Se non sei stato tu, non fare niente: senza conferma l\'account sparisce da solo.',
  ]);
}

export function mailGiaIscritto({ a, link }) {
  return mail(a, 'Hai già un account su Rotta Giusta', [
    'Qualcuno ha provato a registrarsi su Rotta Giusta con questo indirizzo,',
    'ma hai già un account: non ne abbiamo creato un altro.',
    '',
    'Se hai dimenticato la password, puoi reimpostarla da qui entro un\'ora:',
    link,
    '',
    'Se non sei stato tu, non fare niente: il tuo account non è cambiato.',
  ]);
}

export function mailPassword({ a, link }) {
  return mail(a, 'Reimposta la password di Rotta Giusta', [
    'Hai chiesto di reimpostare la password del tuo account su Rotta Giusta.',
    '',
    'Apri questo link entro un\'ora e scegline una nuova:',
    link,
    '',
    'Se non l\'hai chiesto tu, non fare niente: la password resta quella di prima.',
  ]);
}

export function mailDisattivata({ a, link }) {
  return mail(a, 'La password di Rotta Giusta è stata disattivata', [
    'Sul tuo account di Rotta Giusta ci sono stati 100 tentativi di accesso',
    'sbagliati di fila, e la password è stata disattivata per proteggerlo.',
    'Le tue risposte salvate non sono state toccate.',
    '',
    'Per rientrare scegli una password nuova da qui, entro un\'ora:',
    link,
    '',
    'Se il link scade, dalla pagina di accesso scegli «Ho dimenticato la password».',
  ]);
}
