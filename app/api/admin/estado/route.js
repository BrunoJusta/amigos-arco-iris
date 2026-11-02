import { NextResponse } from 'next/server';
import { sessaoAtual } from '@/lib/auth';
import { r2Ativo, testarR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await sessaoAtual();
  if (!s) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });
  const teste = r2Ativo() ? await testarR2() : null;
  return NextResponse.json({ email: s.email, r2: r2Ativo(), escrita: teste, publico: !!process.env.R2_PUBLIC_URL });
}
