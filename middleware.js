import { NextResponse } from 'next/server';
import { COOKIE, verSessao } from './lib/sessao';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin/login')) return NextResponse.next();
  const sessao = await verSessao(req.cookies.get(COOKIE)?.value);
  if (sessao) return NextResponse.next();
  if (pathname.startsWith('/api/')) return NextResponse.json({ erro: 'Sessão expirada. Entra outra vez.' }, { status: 401 });
  const url = req.nextUrl.clone(); url.pathname = '/admin/login'; url.search = '';
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
