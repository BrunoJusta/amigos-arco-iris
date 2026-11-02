// Acesso ao Cloudflare R2 pela API compatível com S3, assinada com aws4fetch.
import { AwsClient } from 'aws4fetch';

const env = () => ({
  conta: process.env.R2_ACCOUNT_ID,
  chave: process.env.R2_ACCESS_KEY_ID,
  segredo: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  publico: (process.env.R2_PUBLIC_URL || '').replace(/\/$/, ''),
});

export const r2Ativo = () => { const e = env(); return !!(e.conta && e.chave && e.segredo && e.bucket); };

let cliente = null;
function aws() {
  if (!cliente) { const e = env(); cliente = new AwsClient({ accessKeyId: e.chave, secretAccessKey: e.segredo, service: 's3', region: 'auto' }); }
  return cliente;
}
const urlDe = (key) => { const e = env(); return `https://${e.conta}.r2.cloudflarestorage.com/${e.bucket}/` + key.split('/').map(encodeURIComponent).join('/'); };

export async function lerJSON(key) {
  const r = await aws().fetch(urlDe(key), { cache: 'no-store' });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`R2 GET ${key}: ${r.status}`);
  return r.json();
}

export async function gravarJSON(key, obj) {
  const r = await aws().fetch(urlDe(key), { method: 'PUT', body: JSON.stringify(obj), headers: { 'content-type': 'application/json; charset=utf-8' } });
  if (!r.ok) throw new Error(`R2 PUT ${key}: ${r.status} ${await r.text()}`);
}

export async function lerObjeto(key) {
  return aws().fetch(urlDe(key), { cache: 'no-store' });
}

export async function apagarObjeto(key) {
  const r = await aws().fetch(urlDe(key), { method: 'DELETE' });
  if (!r.ok && r.status !== 404) throw new Error(`R2 DELETE ${key}: ${r.status}`);
}

// URL assinado para o browser enviar o ficheiro diretamente para o R2 (válido 15 minutos).
export async function urlUpload(key) {
  const u = new URL(urlDe(key));
  u.searchParams.set('X-Amz-Expires', '900');
  const assinado = await aws().sign(new Request(u, { method: 'PUT' }), { aws: { signQuery: true } });
  return assinado.url;
}

export const urlPublica = (key) => { const p = env().publico; return p ? `${p}/${key}` : `/api/media/${key}`; };
