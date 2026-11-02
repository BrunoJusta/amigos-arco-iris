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
  let r;
  try { r = await aws().fetch(urlDe(key), { method: 'PUT', body: JSON.stringify(obj), headers: { 'content-type': 'application/json' } }); }
  catch (e) { throw new Error(explicarR2(0, '', e)); }
  if (!r.ok) throw new Error(explicarR2(r.status, await r.text()));
}

// Traduz as falhas mais comuns do R2 numa frase útil para o backoffice.
export function explicarR2(status, corpo = '', erro) {
  const codigo = (String(corpo).match(/<Code>([^<]+)<\/Code>/) || [])[1] || '';
  if (erro || !status) return 'Não foi possível contactar o R2. Confirma o R2_ACCOUNT_ID no Vercel (é o ID da conta Cloudflare, sem https nem domínio).';
  if (codigo === 'NoSuchBucket') return 'O bucket indicado em R2_BUCKET não existe. Confirma o nome exato no Vercel.';
  if (codigo === 'InvalidAccessKeyId') return 'A R2_ACCESS_KEY_ID não é válida. Confirma a chave do token R2 no Vercel.';
  if (codigo === 'SignatureDoesNotMatch') return 'A R2_SECRET_ACCESS_KEY não corresponde à chave. Copia outra vez o segredo do token R2 para o Vercel.';
  if (status === 401 || status === 403 || codigo === 'AccessDenied' || codigo === 'Unauthorized') return 'O token R2 não tem permissão de escrita neste bucket. Cria um token com «Object Read & Write» para este bucket e atualiza as chaves no Vercel.';
  return `O R2 respondeu ${status}${codigo ? ' (' + codigo + ')' : ''}.`;
}

// Verifica se a app consegue ler e escrever no bucket.
export async function testarR2() {
  if (!r2Ativo()) return { ok: false, erro: 'As variáveis do R2 não estão definidas no Vercel.' };
  try {
    await gravarJSON('diagnostico/teste.json', { em: new Date().toISOString() });
    return { ok: true };
  } catch (e) { return { ok: false, erro: e.message }; }
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
