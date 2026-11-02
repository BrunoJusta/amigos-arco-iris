'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export const copia = (x) => JSON.parse(JSON.stringify(x));
export const mover = (lista, i, d) => { const l = lista.slice(); const j = i + d; if (j < 0 || j >= l.length) return l; [l[i], l[j]] = [l[j], l[i]]; return l; };
export const slug = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 24);
export const CORES = { vermelho: '#E5484D', laranja: '#F28C28', amarelo: '#F5C518', verde: '#2FB383', azul: '#3E92E0', roxo: '#8B5CF6', 'cor-de-rosa': '#F48FB8', branco: '#FFFFFF', preto: '#2B2B33', cinzento: '#9CA0AE', castanho: '#9A6A45' };

export async function api(url, opcoes = {}) {
  const r = await fetch(url, { ...opcoes, headers: { 'content-type': 'application/json', ...(opcoes.headers || {}) } });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401) { window.location.href = '/admin/login'; throw new Error('A sessão expirou.'); }
  if (!r.ok) throw new Error(d.erro || 'Erro ' + r.status);
  return d;
}

async function reduzirImagem(ficheiro, max) {
  if (!ficheiro.type.startsWith('image/') || ficheiro.type === 'image/gif') return ficheiro;
  const img = await createImageBitmap(ficheiro);
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.86));
  return new File([blob], ficheiro.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
}

export async function enviarFicheiro(ficheiro, pasta, max = 800) {
  const f = await reduzirImagem(ficheiro, max);
  const { urlUpload, url } = await api('/api/admin/upload', { method: 'POST', body: JSON.stringify({ nome: f.name, tipo: f.type, pasta }) });
  const r = await fetch(urlUpload, { method: 'PUT', body: f, headers: { 'content-type': f.type } });
  if (!r.ok) throw new Error('O envio para o R2 falhou (' + r.status + '). Confirma a política CORS do bucket.');
  return url;
}

/* Diálogo de confirmação: devolve uma Promise com true ou false */
export function useConfirmar() {
  const [pedido, setPedido] = useState(null);
  const confirmar = useCallback((opcoes) => new Promise((res) => setPedido({ ...opcoes, res })), []);
  const fechar = (v) => { pedido?.res(v); setPedido(null); };
  const dialogo = pedido ? (
    <Dialogo titulo={pedido.titulo} onFechar={() => fechar(false)}>
      <p className="dl-texto">{pedido.texto}</p>
      <div className="dl-acoes">
        <button className="btn btn-sec" onClick={() => fechar(false)}>Cancelar</button>
        <button className={'btn ' + (pedido.perigo ? 'btn-perigo' : 'btn-pri')} onClick={() => fechar(true)} autoFocus>{pedido.confirmar || 'Confirmar'}</button>
      </div>
    </Dialogo>
  ) : null;
  return [confirmar, dialogo];
}

export function Dialogo({ titulo, children, onFechar, largo }) {
  const ref = useRef(null);
  useEffect(() => {
    const f = (e) => { if (e.key === 'Escape') onFechar(); };
    window.addEventListener('keydown', f);
    const anterior = document.activeElement;
    ref.current?.querySelector('input,textarea,select,button[autofocus]')?.focus();
    return () => { window.removeEventListener('keydown', f); anterior?.focus?.(); };
  }, [onFechar]);
  return (
    <div className="dl-fundo" onMouseDown={(e) => { if (e.target === e.currentTarget) onFechar(); }}>
      <div className={'dl' + (largo ? ' largo' : '')} role="dialog" aria-modal="true" aria-labelledby="dl-t" ref={ref}>
        <div className="dl-cab"><h2 id="dl-t">{titulo}</h2><button className="btn-ic" onClick={onFechar} aria-label="Fechar"><X size={16} /></button></div>
        {children}
      </div>
    </div>
  );
}

export function Interruptor({ checked, onChange, label, id }) {
  return (
    <label className="sw" htmlFor={id}>
      <input id={id} type="checkbox" role="switch" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="sw-pista" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export function Avatar({ src, tam = 28, alt = '' }) {
  return src ? <img className="av" src={src} alt={alt} width={tam} height={tam} style={{ width: tam, height: tam }} /> : <span className="av vazio" style={{ width: tam, height: tam }} />;
}

export function Vazio({ titulo, texto, acao }) {
  return <div className="vazio-c"><b>{titulo}</b>{texto && <p>{texto}</p>}{acao}</div>;
}

export function Campo({ label, id, ajuda, children, className = '' }) {
  return (
    <div className={'campo ' + className}>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
      {ajuda && <small className="ajuda-c">{ajuda}</small>}
    </div>
  );
}

/* Área de texto que cresce com o conteúdo */
export function TextoAuto({ value, onChange, className = '', ...resto }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = el.scrollHeight + 2 + 'px'; }, [value]);
  return <textarea ref={ref} rows={1} className={'auto ' + className} value={value} onChange={onChange} {...resto} />;
}

/* Seletor de personagem */
export function SelPers({ pers, valor, onChange, vazio, soPrincipais, id, className, ...resto }) {
  return (
    <select id={id} className={className} value={valor || ''} onChange={(e) => onChange(e.target.value)} {...resto}>
      {vazio && <option value="">{vazio}</option>}
      {pers.filter((p) => !soPrincipais || !p.extra).map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
    </select>
  );
}

/* Desenho SVG vindo do motor (conteúdo nosso, não do utilizador) */
export function Svg({ html, className }) {
  return <span className={className} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* Contador de avisos (toasts) */
export function useAvisos() {
  const [lista, setLista] = useState([]);
  const avisar = useCallback((t, tipo = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setLista((l) => [...l.slice(-2), { id, t, tipo }]);
    if (tipo !== 'erro') setTimeout(() => setLista((l) => l.filter((x) => x.id !== id)), 3800);
    return id;
  }, []);
  const fechar = (id) => setLista((l) => l.filter((x) => x.id !== id));
  return [avisar, lista, fechar];
}
