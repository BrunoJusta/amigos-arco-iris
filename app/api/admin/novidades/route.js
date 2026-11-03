import { NextResponse } from 'next/server';
import seed from '@/seed/conteudo.json';
import { createHash } from 'crypto';
import { sessaoAtual } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Livros que vêm com a app (no repositório). O backoffice compara com os que já estão no R2 e propõe os que faltam.
export async function GET() {
  if (!(await sessaoAtual())) return NextResponse.json({ erro: 'Sem sessão' }, { status: 401 });
  // Cada livro leva a "origem": uma impressão digital da versão da app. Só muda quando eu mudo o livro no repositório.
  const livros = (seed.livros || []).map((l) => ({ ...l, origem: createHash('sha1').update(JSON.stringify([l.capa, l.pags, l.perg, l.luz || 0])).digest('hex').slice(0, 12) }));
  return NextResponse.json({ livros, personagens: seed.personagens || [], adivinhas: seed.adivinhas || {}, frases: seed.frases || [] });
}
