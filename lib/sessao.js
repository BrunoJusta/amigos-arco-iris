// Sessões do backoffice (JWT num cookie). Sem dependências de Node, para poder correr no middleware.
import { SignJWT, jwtVerify } from 'jose';

export const COOKIE = 'bo_sessao';
const segredo = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'muda-este-segredo-nas-variaveis-de-ambiente');

export async function criarSessao(email) {
  return new SignJWT({ email }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('30d').sign(segredo());
}

export async function verSessao(token) {
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, segredo()); return payload; } catch { return null; }
}
