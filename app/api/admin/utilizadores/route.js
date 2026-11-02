import { NextResponse } from 'next/server';
import { sessaoAtual, lerUtilizadores, gravarUtilizadores, criarUtilizador } from '@/lib/auth';
import { r2Ativo } from '@/lib/r2';

export const dynamic = 'force-dynamic';

async function guarda() {
  const s = await sessaoAtual();
  if (!s) return [null, NextResponse.json({ erro: 'Sem sessão' }, { status: 401 })];
  if (!r2Ativo()) return [null, NextResponse.json({ erro: 'O R2 ainda não está configurado.' }, { status: 503 })];
  return [s, null];
}

export async function GET() {
  const [s, erro] = await guarda(); if (erro) return erro;
  const lista = await lerUtilizadores();
  return NextResponse.json(lista.map((u) => ({ email: u.email, criado: u.criado, eu: u.email === s.email })));
}

export async function POST(req) {
  const [, erro] = await guarda(); if (erro) return erro;
  const { email, password } = await req.json();
  try { await criarUtilizador(email, password); return NextResponse.json({ ok: true }); }
  catch (e) { return NextResponse.json({ erro: e.message }, { status: 400 }); }
}

export async function DELETE(req) {
  const [s, erro] = await guarda(); if (erro) return erro;
  const { email } = await req.json();
  if (email === s.email) return NextResponse.json({ erro: 'Não podes apagar a tua própria conta.' }, { status: 400 });
  const lista = await lerUtilizadores();
  const nova = lista.filter((u) => u.email !== email);
  if (!nova.length) return NextResponse.json({ erro: 'Tem de ficar pelo menos uma conta.' }, { status: 400 });
  await gravarUtilizadores(nova);
  return NextResponse.json({ ok: true });
}
