import { NextResponse } from 'next/server';
import { sessaoAtual } from '@/lib/auth';
import { r2Ativo, urlUpload, urlPublica } from '@/lib/r2';

export const dynamic = 'force-dynamic';
const PASTAS = ['personagens', 'cenarios', 'musicas', 'imagens', 'audio'];
const TIPOS = /^(image\/(jpeg|png|webp|gif)|audio\/(mpeg|mp3|mp4|aac|ogg|wav|x-wav|x-m4a|webm))$/;

export async function POST(req) {
  if (!(await sessaoAtual())) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });
  if (!r2Ativo()) return NextResponse.json({ erro: 'O R2 ainda não está configurado.' }, { status: 503 });
  const { nome = 'ficheiro', tipo = '', pasta = 'imagens' } = await req.json();
  if (!PASTAS.includes(pasta)) return NextResponse.json({ erro: 'Pasta inválida.' }, { status: 400 });
  if (!TIPOS.test(tipo)) return NextResponse.json({ erro: 'Tipo de ficheiro não aceite: ' + tipo }, { status: 400 });
  const limpo = String(nome).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '').slice(-60) || 'ficheiro';
  const key = `media/${pasta}/${Date.now()}-${limpo}`;
  return NextResponse.json({ key, urlUpload: await urlUpload(key), url: urlPublica(key) });
}
