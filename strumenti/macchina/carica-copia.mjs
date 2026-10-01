// Porta una copia del database nel bucket delle copie, a `nl-ams`.
//
//   node carica-copia.mjs <file> <chiave-nel-bucket>
//
// docs/account-progetto.md §2.5 e §2.8. Una `PUT` sola, firmata con SigV4,
// senza dipendenze: la chiave dell'API ha **solo** il permesso di scrivere sul
// bucket, e gli strumenti comuni (rclone, s3cmd) prima di scrivere provano a
// leggere il bucket, cioe' falliscono proprio con la chiave giusta. Una copia
// si dice arrivata solo se l'ETag che il bucket risponde e' l'MD5 di quello che
// abbiamo mandato: un 200 senza conferma del contenuto non basta.
//
// La chiave sta nell'ambiente, che systemd legge da /etc/rg/copie: mai nel repo.
//   RG_S3_ACCESSO, RG_S3_SEGRETO, RG_S3_REGIONE (nl-ams), RG_S3_BUCKET

import { createHash, createHmac } from 'node:crypto';
import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const sha256 = (dati) => createHash('sha256').update(dati).digest('hex');
const hmac = (chiave, dati) => createHmac('sha256', chiave).update(dati).digest();

// L'URI encoding di SigV4: come encodeURIComponent, piu' i quattro caratteri
// che quella lascia in chiaro. La `/` resta, perche' separa i segmenti.
const codifica = (s) => s.split('/').map((p) => encodeURIComponent(p)
  .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())).join('/');

/**
 * La firma SigV4 di una richiesta S3. `intestazioni` sono quelle da firmare,
 * con i nomi in minuscolo; `host` deve esserci. Restituisce l'intestazione
 * Authorization. Esportata per il test, che la prova sull'esempio di AWS.
 */
export function firma({ metodo, percorso, query = '', intestazioni, hashCorpo, quando, regione, accesso, segreto }) {
  const amz = quando.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const giorno = amz.slice(0, 8);
  const nomi = Object.keys(intestazioni).sort();
  const canonica = [
    metodo, codifica(percorso), query,
    nomi.map((n) => `${n}:${String(intestazioni[n]).trim()}\n`).join(''),
    nomi.join(';'), hashCorpo,
  ].join('\n');
  const ambito = `${giorno}/${regione}/s3/aws4_request`;
  const daFirmare = ['AWS4-HMAC-SHA256', amz, ambito, sha256(canonica)].join('\n');
  let k = hmac('AWS4' + segreto, giorno);
  for (const parte of [regione, 's3', 'aws4_request']) k = hmac(k, parte);
  const sig = createHmac('sha256', k).update(daFirmare).digest('hex');
  return `AWS4-HMAC-SHA256 Credential=${accesso}/${ambito}, SignedHeaders=${nomi.join(';')}, Signature=${sig}`;
}

// `indirizzo` serve al test, che risponde da un server locale al posto del bucket.
export async function carica(file, chiave, { accesso, segreto, regione = 'nl-ams', bucket, quando = new Date(), indirizzo = `https://s3.${regione}.scw.cloud` }) {
  if (!accesso || !segreto || !bucket) throw new Error('manca la chiave del bucket (RG_S3_ACCESSO, RG_S3_SEGRETO, RG_S3_BUCKET)');
  const corpo = readFileSync(file);
  const host = new URL(indirizzo).host;
  const percorso = `/${bucket}/${chiave}`;
  const hashCorpo = sha256(corpo);
  const amz = quando.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const intestazioni = { host, 'x-amz-content-sha256': hashCorpo, 'x-amz-date': amz };
  const authorization = firma({ metodo: 'PUT', percorso, intestazioni, hashCorpo, quando, regione, accesso, segreto });
  const r = await fetch(`${indirizzo}${codifica(percorso)}`, {
    method: 'PUT',
    headers: { ...intestazioni, authorization, 'content-length': String(corpo.length) },
    body: corpo,
  });
  const etag = (r.headers.get('etag') || '').replace(/"/g, '');
  const md5 = createHash('md5').update(corpo).digest('hex');
  if (!r.ok) throw new Error(`il bucket ha risposto ${r.status}: ${(await r.text()).slice(0, 300)}`);
  if (etag !== md5) throw new Error(`il bucket ha risposto 200 ma l'ETag ${etag || '(nessuno)'} non e' l'MD5 della copia (${md5})`);
  return { byte: corpo.length, md5, chiave: `${bucket}/${chiave}` };
}

// Il percorso si risolve, come in server/server.mjs: lanciato da un collegamento
// il controllo non riconoscerebbe il modulo principale, e uscirebbe muto.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [file, chiave] = process.argv.slice(2);
  if (!file || !chiave) {
    console.error('uso: node carica-copia.mjs <file> <chiave-nel-bucket>');
    process.exit(2);
  }
  try {
    const c = await carica(file, chiave, {
      accesso: process.env.RG_S3_ACCESSO, segreto: process.env.RG_S3_SEGRETO,
      regione: process.env.RG_S3_REGIONE || 'nl-ams', bucket: process.env.RG_S3_BUCKET,
    });
    console.log(`caricata ${c.chiave}: ${c.byte} byte, md5 ${c.md5} confermato dal bucket`);
  } catch (e) {
    console.error(`caricamento FALLITO: ${e.message}`);
    process.exit(1);
  }
}
