import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sessaoAtual } from '@/lib/auth';
import { lerConteudo, gravarSeccao, SECCOES } from '@/lib/conteudo';
import { r2Ativo } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await sessaoAtual())) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });
  return NextResponse.json(await lerConteudo(), { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req) {
  const s = await sessaoAtual();
  if (!s) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });
  if (!r2Ativo()) return NextResponse.json({ erro: 'O R2 ainda não está configurado nas variáveis de ambiente.' }, { status: 503 });
  const { seccao, valor } = await req.json();
  if (!SECCOES.includes(seccao)) return NextResponse.json({ erro: 'Secção desconhecida.' }, { status: 400 });
  if (valor == null) return NextResponse.json({ erro: 'Sem dados para guardar.' }, { status: 400 });
  try {
    const novo = await gravarSeccao(seccao, valor, s.email);
    revalidatePath('/');
    return NextResponse.json({ ok: true, versao: novo.versao, atualizado: novo.atualizado });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ erro: 'Não foi possível guardar. ' + (e?.message || '') }, { status: 500 });
  }
}
