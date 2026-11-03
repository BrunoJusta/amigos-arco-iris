import { NextResponse } from 'next/server';
import seed from '@/seed/conteudo.json';
import { sessaoAtual } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Livros que vêm com a app (no repositório). O backoffice compara com os que já estão no R2 e propõe os que faltam.
export async function GET() {
  if (!(await sessaoAtual())) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });
  return NextResponse.json({ livros: seed.livros || [], personagens: seed.personagens || [], adivinhas: seed.adivinhas || {}, frases: seed.frases || [] });
}
