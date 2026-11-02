import { NextResponse } from 'next/server';
import { autenticar } from '@/lib/auth';
import { COOKIE, criarSessao } from '@/lib/sessao';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  let dados = {};
  try { dados = await req.json(); } catch {}
  try {
    const u = await autenticar(dados.email, dados.password);
    if (!u) return NextResponse.json({ erro: 'Email ou password errados.' }, { status: 401 });
    const res = NextResponse.json({ ok: true, email: u.email });
    res.cookies.set(COOKIE, await criarSessao(u.email), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ erro: 'Não foi possível entrar. Confirma a configuração do R2.' }, { status: 500 });
  }
}
