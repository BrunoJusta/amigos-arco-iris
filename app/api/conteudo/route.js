import { NextResponse } from 'next/server';
import { lerConteudo } from '@/lib/conteudo';

export const dynamic = 'force-dynamic';

export async function GET() {
  const c = await lerConteudo();
  return NextResponse.json(c, { headers: { 'Cache-Control': 'no-store' } });
}
