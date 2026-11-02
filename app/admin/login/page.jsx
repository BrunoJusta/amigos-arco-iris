'use client';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [aEntrar, setAEntrar] = useState(false);

  async function entrar(e) {
    e.preventDefault(); setErro(''); setAEntrar(true);
    try {
      const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErro(d.erro || 'Não foi possível entrar.'); setAEntrar(false); return; }
      window.location.href = '/admin';
    } catch { setErro('Sem ligação. Tenta outra vez.'); setAEntrar(false); }
  }

  return (
    <main className="login">
      <form className="login-cartao" onSubmit={entrar}>
        <img src="/icon-192.png" alt="" width="72" height="72" />
        <h1>Backoffice</h1>
        <p className="sub">Amigos do Arco-Íris</p>
        <div className="campo">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" spellCheck="false" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="campo">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="b b-ouro largo" disabled={aEntrar}>{aEntrar ? 'A entrar…' : 'Entrar'}</button>
      </form>
    </main>
  );
}
