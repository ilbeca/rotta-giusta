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

export function mailCambioEmail({ a, link, vecchia }) {
  return mail(a, 'Conferma il nuovo indirizzo per Rotta Giusta', [
    `Hai chiesto di spostare il tuo account di Rotta Giusta da ${vecchia} a questo indirizzo.`,
    '',
    'Per confermarlo apri questo link entro 24 ore:',
    link,
    '',
    'Finché non lo apri, l\'account resta legato all\'indirizzo di prima.',
    'Se non sei stato tu, non fare niente: senza conferma non cambia niente.',
  ]);
}

export function mailAvvisoEmail({ a, nuova }) {
  return mail(a, 'Il tuo account di Rotta Giusta cambia indirizzo', [
    `Qualcuno che conosce la tua password ha chiesto di spostare il tuo account di Rotta Giusta a ${nuova}.`,
    'Diventa effettivo solo se quell\'indirizzo conferma entro 24 ore.',
    '',
    'Se sei stato tu, non devi fare altro.',
    'Se non sei stato tu, entra e cambia la password: la richiesta si annulla,',
    'e chi l\'ha fatta resta fuori.',
  ]);
}

export function mailCancellato({ a }) {
  return mail(a, 'Il tuo account di Rotta Giusta è cancellato', [
    'Come hai chiesto, il tuo account di Rotta Giusta è stato cancellato,',
    'con tutte le risposte, i punteggi e la data d\'esame.',
    '',
    'Dal server è sparito adesso; dalle copie di sicurezza sparisce entro 30 giorni.',
    'Se vuoi tornare, puoi registrarti di nuovo con questo indirizzo.',
  ]);
}

export function mailInattivita({ a, il, sito }) {
  return mail(a, 'Il tuo account di Rotta Giusta sta per essere cancellato', [
    'Non entri su Rotta Giusta da quasi due anni.',
    `Il ${giorno(il)} il tuo account e le tue risposte si cancellano.`,
    '',
    'Per tenerli basta entrare, da qui:',
    `${sito}/app`,
    '',
    'Se invece vuoi le tue risposte ma non l\'account, entra e scarica il file dei',
    'progressi prima di quella data: si ricarica in qualunque momento.',
  ]);
}

/**
 * Gli allarmi al titolare (§15.4). Che cosa e quanto, **senza email e senza
 * indirizzi IP**: la casella del titolare puo' stare fuori dall'UE (§15.4), e
 * il dettaglio resta nel registro, sulla macchina, dove si legge.
 */
export function mailAllarmi({ a, allarmi }) {
  return mail(a, `Rotta Giusta: ${allarmi.length === 1 ? 'un allarme' : `${allarmi.length} allarmi`} dal server`, [
    'Il server degli account ha trovato qualcosa da guardare:',
    '',
    ...allarmi.map((x) => `- ${x.testo}`),
    '',
    'Il dettaglio è nella tabella registro, sulla macchina. Se è una violazione,',
    'le 72 ore per notificarla al Garante partono da adesso (art. 33).',
  ]);
}
