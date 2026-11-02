// Serve os ficheiros do R2 quando o bucket não tem endereço público.
import { r2Ativo, lerObjeto } from '@/lib/r2';

export async function GET(req, { params }) {
  if (!r2Ativo()) return new Response('R2 não configurado', { status: 404 });
  const key = 'media/' + params.key.map(decodeURIComponent).join('/').replace(/^media\//, '');
  const r = await lerObjeto(key);
  if (!r.ok) return new Response('Não encontrado', { status: r.status === 404 ? 404 : 502 });
  const headers = { 'Content-Type': r.headers.get('content-type') || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' };
  const tam = r.headers.get('content-length'); if (tam) headers['Content-Length'] = tam;
  return new Response(r.body, { headers });
}
