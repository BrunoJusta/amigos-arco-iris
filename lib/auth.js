// Contas do backoffice: email e password guardados no R2 (admin/utilizadores.json), com hash bcrypt.
// Não há emails de confirmação. A primeira conta nasce das variáveis ADMIN_EMAIL e ADMIN_PASSWORD.
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { r2Ativo, lerJSON, gravarJSON } from './r2';
import { COOKIE, verSessao } from './sessao';

const CHAVE = 'admin/utilizadores.json';
const norm = (e) => String(e || '').trim().toLowerCase();

export async function lerUtilizadores() {
  if (!r2Ativo()) return [];
  return (await lerJSON(CHAVE)) || [];
}
export async function gravarUtilizadores(lista) { await gravarJSON(CHAVE, lista); }

export async function autenticar(email, password) {
  email = norm(email);
  if (!email || !password) return null;
  const lista = await lerUtilizadores();
  const u = lista.find((x) => x.email === email);
  if (u) return (await bcrypt.compare(password, u.hash)) ? { email } : null;
  const ae = norm(process.env.ADMIN_EMAIL), ap = process.env.ADMIN_PASSWORD || '';
  if (ae && ap && email === ae && password === ap) {
    if (r2Ativo()) { lista.push({ email: ae, hash: await bcrypt.hash(ap, 10), criado: new Date().toISOString() }); await gravarUtilizadores(lista); }
    return { email: ae };
  }
  return null;
}

export async function criarUtilizador(email, password) {
  email = norm(email);
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Email inválido.');
  if (!password || password.length < 8) throw new Error('A password precisa de pelo menos 8 caracteres.');
  const lista = (await lerUtilizadores()).filter((x) => x.email !== email);
  lista.push({ email, hash: await bcrypt.hash(password, 10), criado: new Date().toISOString() });
  await gravarUtilizadores(lista);
}

export async function sessaoAtual() {
  return verSessao(cookies().get(COOKIE)?.value);
}
