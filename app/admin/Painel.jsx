'use client';
import { useEffect, useMemo, useState } from 'react';

/* ---------- Listas fixas usadas nos formulários ---------- */
const CENARIOS = [
  ['quarto', 'Quarto da Francisca'], ['rua', 'Rua'], ['portao', 'Portão do parque'], ['triste', 'Parque triste'], ['rio', 'Rio'], ['pedra', 'Pedra do rio'],
  ['campo', 'Campo de margaridas'], ['estrada', 'Estrada'], ['floresta', 'Entrada da floresta'], ['mata', 'Dentro da floresta'], ['castelo', 'Castelo da Lila'],
  ['caverna', 'Caverna'], ['colina', 'Colina gelada'], ['bosque', 'Bosque escuro'], ['torre', 'Torre'], ['sala', 'Sala da torre'], ['fonte', 'Fonte'],
  ['feliz', 'Parque feliz'], ['ceu', 'Céu'],
];
const OBJETOS = [
  ['mapa', 'Mapa de luz'], ['luz', 'Luz dourada'], ['escada', 'Escada de arco-íris'], ['acesa', 'Fonte acesa'], ['mota', 'Mota'], ['arco', 'Arco-íris'],
  ['escamas', 'Escamas'], ['lanterna', 'Lanterna'], ['caneca', 'Caneca'], ['relogio', 'Relógio parado'], ['passaro', 'Passarinho'], ['desenho', 'Desenho'], ['noite', 'Noite'],
];
const CORES = { vermelho: '#E5484D', laranja: '#F28C28', amarelo: '#F5C518', verde: '#2FB383', azul: '#3E92E0', roxo: '#8B5CF6', 'cor-de-rosa': '#F48FB8', branco: '#FFFFFF', preto: '#2B2B33', cinzento: '#9CA0AE', castanho: '#9A6A45' };
const DESENHOS = ['balde', 'bola', 'flor', 'aquario', 'mota', 'capacete', 'coroa', 'mapa', 'sandes', 'estrela', 'borboleta', 'lua', 'lanterna', 'gelo', 'arcoiris', 'escama'];
const ICONES = ['clock', 'eye-off', 'users', 'refresh-cw', 'lock', 'pencil', 'megaphone', 'cookie', 'book-open', 'thumbs-up', 'frown', 'user-x', 'heart-handshake', 'smile', 'star', 'x', 'check'];
const TEMAS_COR = [['t-coral', 'Coral'], ['t-verde', 'Verde'], ['t-azul', 'Azul'], ['t-lilas', 'Lilás'], ['t-ouro', 'Dourado'], ['t-rosa', 'Rosa']];

const SECCOES = [
  { id: 'resumo', t: 'Resumo' },
  { id: 'livros', t: 'Livros' },
  { id: 'personagens', t: 'Personagens' },
  { id: 'factos', t: 'Sabias que' },
  { id: 'cores', t: 'Perguntas de cores' },
  { id: 'quem', t: 'Quem é?' },
  { id: 'situacoes', t: 'E se…?' },
  { id: 'musicas', t: 'Músicas' },
  { id: 'contas', t: 'Contas' },
];

const copia = (x) => JSON.parse(JSON.stringify(x));
const mover = (lista, i, d) => { const l = lista.slice(); const j = i + d; if (j < 0 || j >= l.length) return l; [l[i], l[j]] = [l[j], l[i]]; return l; };
const slug = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 24);

async function api(url, opcoes = {}) {
  const r = await fetch(url, { ...opcoes, headers: { 'content-type': 'application/json', ...(opcoes.headers || {}) } });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401) { window.location.href = '/admin/login'; throw new Error('Sessão expirada.'); }
  if (!r.ok) throw new Error(d.erro || 'Erro ' + r.status);
  return d;
}

/* Reduz imagens antes de enviar (máximo 800 px) */
async function reduzirImagem(ficheiro) {
  if (!ficheiro.type.startsWith('image/') || ficheiro.type === 'image/gif') return ficheiro;
  const img = await createImageBitmap(ficheiro);
  const k = Math.min(1, 800 / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.86));
  return new File([blob], ficheiro.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
}

async function enviarFicheiro(ficheiro, pasta) {
  const f = await reduzirImagem(ficheiro);
  const { urlUpload, url } = await api('/api/admin/upload', { method: 'POST', body: JSON.stringify({ nome: f.name, tipo: f.type, pasta }) });
  const r = await fetch(urlUpload, { method: 'PUT', body: f, headers: { 'content-type': f.type } });
  if (!r.ok) throw new Error('O envio para o R2 falhou (' + r.status + '). Confirma o CORS do bucket.');
  return url;
}

/* ---------- Painel ---------- */
export default function Painel() {
  const [estado, setEstado] = useState(null);
  const [conteudo, setConteudo] = useState(null);
  const [rascunho, setRascunho] = useState({});
  const [seccao, setSeccao] = useState('resumo');
  const [aviso, setAviso] = useState(null);
  const [aGuardar, setAGuardar] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    Promise.all([api('/api/admin/estado'), api('/api/admin/conteudo')])
      .then(([e, c]) => { setEstado(e); setConteudo(c); })
      .catch((e) => setAviso({ tipo: 'erro', t: e.message }));
  }, []);
  useEffect(() => { if (!aviso || aviso.tipo === 'erro') return; const t = setTimeout(() => setAviso(null), 3500); return () => clearTimeout(t); }, [aviso]);

  const chaveDe = (s) => (s === 'quem' ? ['frases', 'adivinhas'] : s === 'resumo' || s === 'contas' ? [] : [s]);
  const valor = (k) => (k in rascunho ? rascunho[k] : conteudo?.[k]);
  const mudar = (k, v) => setRascunho((r) => ({ ...r, [k]: v }));
  const alterado = (s) => chaveDe(s).some((k) => k in rascunho);
  const algoAlterado = Object.keys(rascunho).length > 0;

  useEffect(() => {
    const f = (e) => { if (algoAlterado) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', f); return () => window.removeEventListener('beforeunload', f);
  }, [algoAlterado]);

  async function guardar() {
    const chaves = chaveDe(seccao).filter((k) => k in rascunho);
    if (!chaves.length) return;
    setAGuardar(true);
    try {
      for (const k of chaves) await api('/api/admin/conteudo', { method: 'PUT', body: JSON.stringify({ seccao: k, valor: rascunho[k] }) });
      setConteudo((c) => { const n = { ...c }; chaves.forEach((k) => (n[k] = rascunho[k])); return n; });
      setRascunho((r) => { const n = { ...r }; chaves.forEach((k) => delete n[k]); return n; });
      setAviso({ tipo: 'ok', t: 'Guardado. A app já mostra as alterações.' });
    } catch (e) { setAviso({ tipo: 'erro', t: e.message }); }
    setAGuardar(false);
  }
  function descartar() { setRascunho((r) => { const n = { ...r }; chaveDe(seccao).forEach((k) => delete n[k]); return n; }); }
  function irPara(s) { setSeccao(s); setMenu(false); window.scrollTo(0, 0); }
  async function sair() { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/admin/login'; }

  if (!conteudo) return <main className="carregar">{aviso ? <p className="erro">{aviso.t}</p> : <p>A carregar…</p>}</main>;
  const pers = valor('personagens') || [];

  return (
    <div className="painel">
      <aside className={'lateral' + (menu ? ' aberta' : '')}>
        <div className="marca"><img src="/icon-192.png" alt="" width="40" height="40" /><div><b>Amigos do Arco-Íris</b><small>Backoffice</small></div></div>
        <nav>{SECCOES.map((s) => (
          <button key={s.id} className={seccao === s.id ? 'ativo' : ''} onClick={() => irPara(s.id)}>{s.t}{alterado(s.id) && <span className="ponto" aria-label="Alterações por guardar" />}</button>
        ))}</nav>
        <div className="rodape-lateral"><a href="/" target="_blank" rel="noreferrer">Abrir a app</a><button onClick={sair}>Sair</button><small>{estado?.email}</small></div>
      </aside>
      <div className="principal">
        <header className="topo-p">
          <button className="b b-claro menu-b" onClick={() => setMenu(!menu)} aria-expanded={menu}>Menu</button>
          <h1>{SECCOES.find((s) => s.id === seccao)?.t}</h1>
          {chaveDe(seccao).length > 0 && (
            <div className="acoes-g">
              {alterado(seccao) && <button className="b b-claro" onClick={descartar}>Descartar</button>}
              <button className="b b-ouro" disabled={!alterado(seccao) || aGuardar} onClick={guardar}>{aGuardar ? 'A guardar…' : alterado(seccao) ? 'Guardar' : 'Guardado'}</button>
            </div>
          )}
        </header>
        {estado && !estado.r2 && <p className="faixa">O R2 ainda não está configurado. Podes ver o conteúdo, mas não guardar. Segue o README para configurar as variáveis de ambiente.</p>}
        <section className="corpo-p">
          {seccao === 'resumo' && <Resumo c={conteudo} estado={estado} irPara={irPara} />}
          {seccao === 'livros' && <Livros livros={valor('livros') || []} set={(v) => mudar('livros', v)} pers={pers} />}
          {seccao === 'personagens' && <Personagens lista={pers} set={(v) => mudar('personagens', v)} setAviso={setAviso} />}
          {seccao === 'factos' && <Factos temas={valor('factos') || []} set={(v) => mudar('factos', v)} pers={pers} />}
          {seccao === 'cores' && <Cores lista={valor('cores') || []} set={(v) => mudar('cores', v)} pers={pers} />}
          {seccao === 'quem' && <Quem frases={valor('frases') || []} adivinhas={valor('adivinhas') || {}} setF={(v) => mudar('frases', v)} setA={(v) => mudar('adivinhas', v)} pers={pers} />}
          {seccao === 'situacoes' && <Situacoes lista={valor('situacoes') || []} set={(v) => mudar('situacoes', v)} pers={pers} />}
          {seccao === 'musicas' && <Musicas lista={valor('musicas') || []} set={(v) => mudar('musicas', v)} pers={pers} setAviso={setAviso} />}
          {seccao === 'contas' && <Contas setAviso={setAviso} />}
        </section>
      </div>
      {aviso && <div className={'aviso ' + aviso.tipo} role="status" onClick={() => setAviso(null)}>{aviso.t}</div>}
    </div>
  );
}

/* ---------- Componentes pequenos ---------- */
function SelPers({ pers, valor, onChange, vazio, soPrincipais }) {
  return (
    <select value={valor || ''} onChange={(e) => onChange(e.target.value)}>
      {vazio && <option value="">{vazio}</option>}
      {pers.filter((p) => !soPrincipais || !p.extra).map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
    </select>
  );
}
function Retrato({ pers, id, tam = 36 }) {
  const p = pers.find((x) => x.id === id);
  return p ? <img className="ret" src={p.img} alt="" width={tam} height={tam} /> : <span className="ret vazio" style={{ width: tam, height: tam }} />;
}
function Mini({ onUp, onDown, onDel, onDup }) {
  return (
    <span className="mini-acoes">
      {onUp && <button type="button" onClick={onUp} aria-label="Subir">↑</button>}
      {onDown && <button type="button" onClick={onDown} aria-label="Descer">↓</button>}
      {onDup && <button type="button" onClick={onDup} aria-label="Duplicar">⧉</button>}
      {onDel && <button type="button" className="perigo" onClick={onDel} aria-label="Apagar">✕</button>}
    </span>
  );
}

/* ---------- Resumo ---------- */
function Resumo({ c, estado, irPara }) {
  const pags = (c.livros || []).reduce((a, l) => a + (l.pags || []).length, 0);
  const factos = (c.factos || []).reduce((a, t) => a + (t.f || []).length, 0);
  const itens = [
    ['livros', 'Livros', (c.livros || []).length, pags + ' páginas'], ['personagens', 'Personagens', (c.personagens || []).length, ''],
    ['factos', 'Factos', factos, (c.factos || []).length + ' temas'], ['cores', 'Perguntas de cores', (c.cores || []).length, '10 por jogo'],
    ['quem', 'Frases e adivinhas', (c.frases || []).length, Object.keys(c.adivinhas || {}).length + ' personagens com pistas'], ['situacoes', 'Situações', (c.situacoes || []).length, '5 por jogo'],
    ['musicas', 'Músicas', (c.musicas || []).length, (c.musicas || []).filter((m) => m.src).length + ' com ficheiro'],
  ];
  return (
    <>
      <div className="grelha-resumo">{itens.map(([id, t, n, s]) => (
        <button key={id} className="cartao-r" onClick={() => irPara(id)}><b>{n}</b><span>{t}</span>{s && <small>{s}</small>}</button>
      ))}</div>
      <div className="cartao">
        <h2>Estado</h2>
        <ul className="lista-estado">
          <li><span className={estado?.r2 ? 'ok' : 'nao'} /> Armazenamento R2 {estado?.r2 ? 'ligado' : 'por configurar'}</li>
          <li><span className={estado?.publico ? 'ok' : 'meio'} /> {estado?.publico ? 'Ficheiros servidos pelo endereço público do R2' : 'Ficheiros servidos pela própria app (/api/media)'}</li>
          <li>Última alteração: {c.atualizado ? new Date(c.atualizado).toLocaleString('pt-PT') : 'conteúdo inicial'}</li>
        </ul>
      </div>
    </>
  );
}

/* ---------- Livros ---------- */
function Livros({ livros, set, pers }) {
  const [sel, setSel] = useState(0);
  const [aberta, setAberta] = useState(null);
  const L = livros[sel];
  const setL = (novo) => { const l = livros.slice(); l[sel] = novo; set(l); };
  const novoLivro = () => { const n = (livros.reduce((m, l) => Math.max(m, l.n || 0), 0) || 0) + 1; set([...livros, { n, t: 'Novo livro', capa: 'francisca', pags: [{ c: 'feliz', q: ['francisca'], x: ['Era uma vez…'] }], perg: [] }]); setSel(livros.length); };
  const renumerar = (l) => l.map((x, i) => ({ ...x, n: i + 1 }));

  return (
    <div className="dois">
      <div className="lista-l">
        {livros.map((l, i) => (
          <button key={i} className={'item-l' + (i === sel ? ' ativo' : '')} onClick={() => { setSel(i); setAberta(null); }}>
            <Retrato pers={pers} id={l.capa} tam={40} /><span><b>{l.n}. {l.t}</b><small>{(l.pags || []).length} páginas · {(l.perg || []).length} perguntas</small></span>
          </button>
        ))}
        <button className="b b-claro largo" onClick={novoLivro}>Novo livro</button>
      </div>
      {L && (
        <div className="editor">
          <div className="cartao">
            <div className="linha">
              <div className="campo f2"><label>Título</label><input value={L.t} onChange={(e) => setL({ ...L, t: e.target.value })} /></div>
              <div className="campo"><label>Capa</label><SelPers pers={pers} valor={L.capa} onChange={(v) => setL({ ...L, capa: v })} soPrincipais /></div>
              <label className="check"><input type="checkbox" checked={!!L.luz} onChange={(e) => setL({ ...L, luz: e.target.checked ? 1 : 0 })} /> Tem uma Luz</label>
            </div>
            <div className="linha fim">
              <Mini onUp={sel > 0 ? () => { set(renumerar(mover(livros, sel, -1))); setSel(sel - 1); } : null} onDown={sel < livros.length - 1 ? () => { set(renumerar(mover(livros, sel, 1))); setSel(sel + 1); } : null}
                onDel={() => { if (confirm('Apagar o livro "' + L.t + '"?')) { set(renumerar(livros.filter((_, i) => i !== sel))); setSel(Math.max(0, sel - 1)); } }} />
            </div>
          </div>

          <h2 className="sub-t">Páginas</h2>
          {(L.pags || []).map((p, i) => (
            <Pagina key={i} i={i} p={p} pers={pers} aberta={aberta === i} abrir={() => setAberta(aberta === i ? null : i)}
              set={(np) => { const ps = L.pags.slice(); ps[i] = np; setL({ ...L, pags: ps }); }}
              acoes={{
                onUp: i > 0 ? () => { setL({ ...L, pags: mover(L.pags, i, -1) }); setAberta(i - 1); } : null,
                onDown: i < L.pags.length - 1 ? () => { setL({ ...L, pags: mover(L.pags, i, 1) }); setAberta(i + 1); } : null,
                onDup: () => { const ps = L.pags.slice(); ps.splice(i + 1, 0, copia(p)); setL({ ...L, pags: ps }); setAberta(i + 1); },
                onDel: () => { if (confirm('Apagar a página ' + (i + 1) + '?')) setL({ ...L, pags: L.pags.filter((_, k) => k !== i) }); },
              }} />
          ))}
          <button className="b b-claro" onClick={() => { const ult = L.pags[L.pags.length - 1] || { c: 'feliz', q: [] }; setL({ ...L, pags: [...L.pags, { c: ult.c, q: ult.q.slice(), x: [''] }] }); setAberta(L.pags.length); }}>Acrescentar página</button>

          <h2 className="sub-t">Perguntas do fim</h2>
          <p className="ajuda">A Francisca ainda não lê: as respostas são imagens (retratos, cores, Luzes para contar, cenários ou desenhos). O texto dito é o que a voz lê em cada opção.</p>
          {(L.perg || []).map((q, i) => (
            <Pergunta key={i} q={q} pers={pers} set={(nq) => { const qs = L.perg.slice(); qs[i] = nq; setL({ ...L, perg: qs }); }}
              apagar={() => setL({ ...L, perg: L.perg.filter((_, k) => k !== i) })} />
          ))}
          <button className="b b-claro" onClick={() => setL({ ...L, perg: [...(L.perg || []), { q: 'Nova pergunta?', quem: 'francisca', ops: [{ img: 'francisca' }, { img: 'maia' }, { img: 'balu' }], ok: 0 }] })}>Acrescentar pergunta</button>
        </div>
      )}
    </div>
  );
}

function Pagina({ i, p, set, pers, aberta, abrir, acoes }) {
  const resumo = (p.x || []).map((x) => (typeof x === 'string' ? x : x[1])).join(' ').slice(0, 110);
  const togglePers = (id) => { const q = p.q || []; set({ ...p, q: q.includes(id) ? q.filter((k) => k !== id) : [...q, id].slice(0, 5) }); };
  const toggleObj = (k) => { const o = { ...(p.o || {}) }; if (o[k]) delete o[k]; else o[k] = k === 'borboletas' ? 4 : 1; set({ ...p, o: Object.keys(o).length ? o : undefined }); };
  const setParte = (k, v) => { const x = p.x.slice(); x[k] = v; set({ ...p, x }); };
  return (
    <div className={'cartao pagina-c' + (aberta ? ' aberta' : '')}>
      <div className="pag-cab">
        <button className="pag-abre" onClick={abrir} aria-expanded={aberta}>
          <span className="num">{i + 1}</span>
          <span className="tx"><b>{CENARIOS.find((c) => c[0] === p.c)?.[1] || p.c}</b><small>{resumo || 'Sem texto'}</small></span>
          <span className="rets">{(p.q || []).map((k) => <Retrato key={k} pers={pers} id={k} tam={28} />)}</span>
        </button>
        <Mini {...acoes} />
      </div>
      {aberta && (
        <div className="pag-corpo">
          <div className="linha">
            <div className="campo"><label>Cenário</label><select value={p.c} onChange={(e) => set({ ...p, c: e.target.value })}>{CENARIOS.map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select></div>
            <label className="check"><input type="checkbox" checked={!!p.b} onChange={(e) => set({ ...p, b: e.target.checked ? 1 : undefined })} /> Mostrar o balde</label>
            <label className="check"><input type="checkbox" checked={!!p.plim} onChange={(e) => set({ ...p, plim: e.target.checked ? 1 : undefined })} /> Som «plim»</label>
          </div>
          <div className="campo"><label>Personagens na imagem (até 5)</label>
            <div className="chips">{pers.filter((x) => !x.extra).map((x) => (
              <button type="button" key={x.id} className={'chip' + ((p.q || []).includes(x.id) ? ' on' : '')} onClick={() => togglePers(x.id)}><img src={x.img} alt="" />{x.nome}</button>
            ))}</div>
          </div>
          <div className="campo"><label>Objetos no cenário</label>
            <div className="chips">{[...OBJETOS, ['borboletas', 'Borboletas']].map(([k, t]) => (
              <button type="button" key={k} className={'chip' + (p.o?.[k] ? ' on' : '')} onClick={() => toggleObj(k)}>{t}</button>
            ))}</div>
            {p.o?.borboletas ? <div className="campo curto"><label>Quantas borboletas</label><input type="number" min="1" max="20" value={p.o.borboletas} onChange={(e) => set({ ...p, o: { ...p.o, borboletas: +e.target.value || 1 } })} /></div> : null}
          </div>
          <div className="campo"><label>Texto da página</label>
            {(p.x || []).map((x, k) => {
              const fala = Array.isArray(x);
              return (
                <div className="parte" key={k}>
                  <select value={fala ? x[0] : ''} onChange={(e) => setParte(k, e.target.value ? [e.target.value, fala ? x[1] : x] : (fala ? x[1] : x))}>
                    <option value="">Narrador</option>
                    {pers.map((pp) => <option key={pp.id} value={pp.id}>{pp.nome}</option>)}
                  </select>
                  <textarea rows={2} value={fala ? x[1] : x} onChange={(e) => setParte(k, fala ? [x[0], e.target.value] : e.target.value)} />
                  <Mini onUp={k > 0 ? () => set({ ...p, x: mover(p.x, k, -1) }) : null} onDown={k < p.x.length - 1 ? () => set({ ...p, x: mover(p.x, k, 1) }) : null} onDel={p.x.length > 1 ? () => set({ ...p, x: p.x.filter((_, j) => j !== k) }) : null} />
                </div>
              );
            })}
            <div className="linha"><button type="button" className="b b-claro peq" onClick={() => set({ ...p, x: [...p.x, ''] })}>+ Narrador</button><button type="button" className="b b-claro peq" onClick={() => set({ ...p, x: [...p.x, [(p.q || [])[0] || 'francisca', '']] })}>+ Fala de personagem</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pergunta({ q, set, apagar, pers }) {
  const tipoDe = (o) => (o.img ? 'img' : o.cor ? 'cor' : o.num ? 'num' : o.cena ? 'cena' : 'svg');
  const setOp = (i, o) => { const ops = q.ops.slice(); ops[i] = o; set({ ...q, ops }); };
  const mudarTipo = (i, t) => setOp(i, { [t]: t === 'img' ? 'francisca' : t === 'cor' ? 'vermelho' : t === 'num' ? 1 : t === 'cena' ? 'quarto' : 'balde', d: q.ops[i].d });
  return (
    <div className="cartao">
      <div className="linha">
        <div className="campo f2"><label>Pergunta</label><input value={q.q} onChange={(e) => set({ ...q, q: e.target.value })} /></div>
        <div className="campo"><label>Quem pergunta</label><SelPers pers={pers} valor={q.quem} onChange={(v) => set({ ...q, quem: v })} /></div>
        <Mini onDel={apagar} />
      </div>
      {q.ops.map((o, i) => {
        const t = tipoDe(o);
        return (
          <div className="parte op-l" key={i}>
            <label className="check certa"><input type="radio" checked={q.ok === i} onChange={() => set({ ...q, ok: i })} /> Certa</label>
            <select value={t} onChange={(e) => mudarTipo(i, e.target.value)}><option value="img">Personagem</option><option value="cor">Cor</option><option value="num">Número (Luzes)</option><option value="cena">Cenário</option><option value="svg">Desenho</option></select>
            {t === 'img' && <SelPers pers={pers} valor={o.img} onChange={(v) => setOp(i, { ...o, img: v })} soPrincipais />}
            {t === 'cor' && <select value={o.cor} onChange={(e) => setOp(i, { ...o, cor: e.target.value })}>{Object.keys(CORES).map((c) => <option key={c}>{c}</option>)}</select>}
            {t === 'num' && <input type="number" min="1" max="12" value={o.num} onChange={(e) => setOp(i, { ...o, num: +e.target.value || 1 })} />}
            {t === 'cena' && <select value={o.cena} onChange={(e) => setOp(i, { ...o, cena: e.target.value })}>{CENARIOS.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select>}
            {t === 'svg' && <select value={o.svg} onChange={(e) => setOp(i, { ...o, svg: e.target.value })}>{DESENHOS.map((d) => <option key={d}>{d}</option>)}</select>}
            <input placeholder="Texto dito (opcional)" value={o.d || ''} onChange={(e) => setOp(i, { ...o, d: e.target.value || undefined })} />
            <Mini onDel={q.ops.length > 2 ? () => set({ ...q, ops: q.ops.filter((_, k) => k !== i), ok: q.ok >= i && q.ok > 0 ? q.ok - 1 : q.ok }) : null} />
          </div>
        );
      })}
      {q.ops.length < 4 && <button className="b b-claro peq" onClick={() => set({ ...q, ops: [...q.ops, { img: 'francisca' }] })}>+ Opção</button>}
    </div>
  );
}

/* ---------- Personagens ---------- */
function Personagens({ lista, set, setAviso }) {
  const [novoId, setNovoId] = useState('');
  const setP = (i, p) => { const l = lista.slice(); l[i] = p; set(l); };
  async function trocarImagem(i, ficheiro) {
    if (!ficheiro) return;
    try { setAviso({ tipo: 'ok', t: 'A enviar a imagem…' }); const url = await enviarFicheiro(ficheiro, 'personagens'); setP(i, { ...lista[i], img: url }); setAviso({ tipo: 'ok', t: 'Imagem enviada. Carrega em Guardar.' }); }
    catch (e) { setAviso({ tipo: 'erro', t: e.message }); }
  }
  return (
    <>
      <p className="ajuda">As personagens marcadas como «só voz» aparecem nas falas dos livros, mas não nos jogos (por exemplo, a Dona Júlia e a Dona Xica usam o retrato das tartarugas).</p>
      <div className="grelha-p">
        {lista.map((p, i) => (
          <div className="cartao pers-c" key={p.id}>
            <label className="foto"><img src={p.img} alt={p.nome} /><span>Trocar imagem</span><input type="file" accept="image/*" onChange={(e) => trocarImagem(i, e.target.files[0])} /></label>
            <div className="campo"><label>Nome</label><input value={p.nome} onChange={(e) => setP(i, { ...p, nome: e.target.value })} /></div>
            <div className="campo"><label>Frase típica</label><input value={p.frase || ''} onChange={(e) => setP(i, { ...p, frase: e.target.value })} /></div>
            <div className="linha">
              <div className="campo"><label>Tom de voz</label><input type="number" step="0.05" min="0.4" max="2" value={p.tom?.p ?? 1} onChange={(e) => setP(i, { ...p, tom: { ...(p.tom || {}), p: +e.target.value } })} /></div>
              <div className="campo"><label>Velocidade</label><input type="number" step="0.05" min="0.5" max="1.5" value={p.tom?.r ?? 0.92} onChange={(e) => setP(i, { ...p, tom: { ...(p.tom || {}), r: +e.target.value } })} /></div>
            </div>
            <div className="linha fim"><label className="check"><input type="checkbox" checked={!!p.extra} onChange={(e) => setP(i, { ...p, extra: e.target.checked ? 1 : undefined })} /> Só voz</label><small className="id">{p.id}</small>
              <Mini onDel={() => { if (confirm('Apagar ' + p.nome + '? Confirma antes que não aparece em nenhum livro.')) set(lista.filter((_, k) => k !== i)); }} />
            </div>
          </div>
        ))}
      </div>
      <div className="cartao linha">
        <div className="campo f2"><label>Nova personagem (nome)</label><input value={novoId} onChange={(e) => setNovoId(e.target.value)} /></div>
        <button className="b b-claro" disabled={!slug(novoId) || lista.some((p) => p.id === slug(novoId))} onClick={() => { set([...lista, { id: slug(novoId), nome: novoId.trim(), img: '/icon-192.png', frase: '', tom: { p: 1, r: 0.92 } }]); setNovoId(''); }}>Acrescentar</button>
      </div>
    </>
  );
}

/* ---------- Sabias que ---------- */
function Factos({ temas, set, pers }) {
  const total = temas.reduce((a, t) => a + (t.f || []).length, 0);
  const setT = (i, t) => { const l = temas.slice(); l[i] = t; set(l); };
  return (
    <>
      <p className="ajuda">{total} factos em {temas.length} temas. Escreve um facto por linha.</p>
      {temas.map((t, i) => (
        <div className="cartao" key={i}>
          <div className="linha">
            <div className="campo f2"><label>Tema</label><input value={t.t} onChange={(e) => setT(i, { ...t, t: e.target.value })} /></div>
            <div className="campo"><label>Quem conta</label><SelPers pers={pers} valor={t.q} onChange={(v) => setT(i, { ...t, q: v })} soPrincipais /></div>
            <div className="campo"><label>Cor do cartão</label><select value={t.cls} onChange={(e) => setT(i, { ...t, cls: e.target.value })}>{TEMAS_COR.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
            <Mini onUp={i > 0 ? () => set(mover(temas, i, -1)) : null} onDown={i < temas.length - 1 ? () => set(mover(temas, i, 1)) : null} onDel={() => { if (confirm('Apagar o tema ' + t.t + '?')) set(temas.filter((_, k) => k !== i)); }} />
          </div>
          <div className="campo"><label>Factos ({(t.f || []).length})</label>
            <textarea rows={8} value={(t.f || []).join('\n')} onChange={(e) => setT(i, { ...t, f: e.target.value.split('\n') })} onBlur={(e) => setT(i, { ...t, f: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })} />
          </div>
        </div>
      ))}
      <button className="b b-claro" onClick={() => set([...temas, { id: 'tema' + Date.now(), t: 'Novo tema', q: 'girafa', cls: 't-azul', f: [] }])}>Acrescentar tema</button>
    </>
  );
}

/* ---------- Cores ---------- */
function Cores({ lista, set, pers }) {
  const [filtro, setFiltro] = useState('');
  const visiveis = useMemo(() => lista.map((x, i) => [x, i]).filter(([x]) => !filtro || (x[1] + ' ' + x[2]).toLowerCase().includes(filtro.toLowerCase())), [lista, filtro]);
  const setL = (i, v) => { const l = lista.slice(); l[i] = v; set(l); };
  return (
    <>
      <div className="linha">
        <p className="ajuda f2">{lista.length} perguntas. Cada jogo sorteia 10. A pergunta fica «De que cor é …?».</p>
        <div className="campo"><label htmlFor="f-cor">Procurar</label><input id="f-cor" value={filtro} onChange={(e) => setFiltro(e.target.value)} /></div>
        <button className="b b-claro" onClick={() => set([['francisca', '', 'vermelho'], ...lista])}>Nova pergunta</button>
      </div>
      <div className="tabela">
        {visiveis.map(([x, i]) => (
          <div className="linha-t" key={i}>
            <SelPers pers={pers} valor={x[0]} onChange={(v) => setL(i, [v, x[1], x[2]])} soPrincipais />
            <input aria-label="Coisa" placeholder="o lenço do Balu" value={x[1]} onChange={(e) => setL(i, [x[0], e.target.value, x[2]])} />
            <span className="amostra" style={{ background: CORES[x[2]] }} />
            <select aria-label="Cor certa" value={x[2]} onChange={(e) => setL(i, [x[0], x[1], e.target.value])}>{Object.keys(CORES).map((c) => <option key={c}>{c}</option>)}</select>
            <Mini onDel={() => set(lista.filter((_, k) => k !== i))} />
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Quem é? ---------- */
function Quem({ frases, adivinhas, setF, setA, pers }) {
  return (
    <>
      <h2 className="sub-t">Quem disse? ({frases.length} frases)</h2>
      <div className="tabela">
        {frases.map((f, i) => (
          <div className="linha-t" key={i}>
            <SelPers pers={pers} valor={f[0]} onChange={(v) => { const l = frases.slice(); l[i] = [v, f[1]]; setF(l); }} soPrincipais />
            <input value={f[1]} onChange={(e) => { const l = frases.slice(); l[i] = [f[0], e.target.value]; setF(l); }} />
            <Mini onDel={() => setF(frases.filter((_, k) => k !== i))} />
          </div>
        ))}
      </div>
      <button className="b b-claro" onClick={() => setF([...frases, ['francisca', '']])}>Nova frase</button>
      <h2 className="sub-t">Adivinha: pistas por personagem</h2>
      <p className="ajuda">Uma pista por linha. O jogo escolhe uma ao calhas.</p>
      <div className="grelha-p">
        {pers.filter((p) => !p.extra).map((p) => (
          <div className="cartao" key={p.id}>
            <div className="linha"><Retrato pers={pers} id={p.id} tam={36} /><b>{p.nome}</b></div>
            <textarea rows={3} value={(adivinhas[p.id] || []).join('\n')} onChange={(e) => setA({ ...adivinhas, [p.id]: e.target.value.split('\n') })} onBlur={(e) => { const l = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean); const n = { ...adivinhas }; if (l.length) n[p.id] = l; else delete n[p.id]; setA(n); }} />
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- E se…? ---------- */
function Situacoes({ lista, set, pers }) {
  const setS = (i, s) => { const l = lista.slice(); l[i] = s; set(l); };
  return (
    <>
      <p className="ajuda">Cada situação tem duas respostas: uma boa e uma menos boa. Cada jogo mostra 5 situações ao calhas.</p>
      {lista.map((s, i) => (
        <div className="cartao" key={i}>
          <div className="linha">
            <div className="campo"><label>Personagem</label><SelPers pers={pers} valor={s.q} onChange={(v) => setS(i, { ...s, q: v })} soPrincipais /></div>
            <div className="campo f3"><label>Situação</label><textarea rows={2} value={s.t} onChange={(e) => setS(i, { ...s, t: e.target.value })} /></div>
            <Mini onDel={() => set(lista.filter((_, k) => k !== i))} />
          </div>
          {s.ops.map((o, k) => (
            <div className="parte op-s" key={k}>
              <label className="check"><input type="checkbox" checked={!!o[2]} onChange={(e) => { const ops = s.ops.slice(); ops[k] = [o[0], o[1], e.target.checked ? 1 : 0, o[3]]; setS(i, { ...s, ops }); }} /> Boa</label>
              <input aria-label="Resposta" value={o[0]} onChange={(e) => { const ops = s.ops.slice(); ops[k] = [e.target.value, o[1], o[2], o[3]]; setS(i, { ...s, ops }); }} />
              <select aria-label="Ícone" value={o[1]} onChange={(e) => { const ops = s.ops.slice(); ops[k] = [o[0], e.target.value, o[2], o[3]]; setS(i, { ...s, ops }); }}>{ICONES.map((n) => <option key={n}>{n}</option>)}</select>
              <input aria-label="O que a personagem diz" placeholder="O que a personagem responde" value={o[3]} onChange={(e) => { const ops = s.ops.slice(); ops[k] = [o[0], o[1], o[2], e.target.value]; setS(i, { ...s, ops }); }} />
            </div>
          ))}
        </div>
      ))}
      <button className="b b-claro" onClick={() => set([...lista, { q: 'francisca', t: 'Nova situação?', ops: [['Resposta boa', 'smile', 1, 'Muito bem!'], ['Resposta menos boa', 'x', 0, 'Hmm, e se tentasses outra coisa?']] }])}>Nova situação</button>
    </>
  );
}

/* ---------- Músicas ---------- */
function Musicas({ lista, set, pers, setAviso }) {
  const setM = (i, m) => { const l = lista.slice(); l[i] = m; set(l); };
  async function enviar(i, ficheiro) {
    if (!ficheiro) return;
    try {
      setAviso({ tipo: 'ok', t: 'A enviar a música…' });
      const dur = await new Promise((res) => { const a = new Audio(); a.preload = 'metadata'; a.onloadedmetadata = () => res(Math.round(a.duration || 0)); a.onerror = () => res(0); a.src = URL.createObjectURL(ficheiro); });
      const url = await enviarFicheiro(ficheiro, 'musicas');
      const base = i == null ? { id: 'm' + Date.now(), t: ficheiro.name.replace(/\.\w+$/, ''), a: 'Amigos do Arco-Íris', capa: 'francisca' } : lista[i];
      const m = { ...base, src: url, dur };
      if (i == null) set([...lista, m]); else setM(i, m);
      setAviso({ tipo: 'ok', t: 'Música enviada. Carrega em Guardar.' });
    } catch (e) { setAviso({ tipo: 'erro', t: e.message }); }
  }
  return (
    <>
      <p className="ajuda">Envia ficheiros MP3 ou M4A. As músicas marcadas como «demo» tocam uma melodia simples até lhes juntares um ficheiro.</p>
      {lista.map((m, i) => (
        <div className="cartao musica-c" key={m.id || i}>
          <Retrato pers={pers} id={m.capa} tam={56} />
          <div className="linha f3">
            <div className="campo f2"><label>Título</label><input value={m.t} onChange={(e) => setM(i, { ...m, t: e.target.value })} /></div>
            <div className="campo"><label>Artista</label><input value={m.a || ''} onChange={(e) => setM(i, { ...m, a: e.target.value })} /></div>
            <div className="campo"><label>Capa</label><SelPers pers={pers} valor={m.capa} onChange={(v) => setM(i, { ...m, capa: v })} soPrincipais /></div>
          </div>
          <div className="musica-f">
            {m.src ? <audio controls preload="none" src={m.src} /> : <span className="etiqueta">Demo</span>}
            <label className="b b-claro peq">{m.src ? 'Trocar ficheiro' : 'Juntar ficheiro'}<input type="file" accept="audio/*" hidden onChange={(e) => enviar(i, e.target.files[0])} /></label>
            <Mini onUp={i > 0 ? () => set(mover(lista, i, -1)) : null} onDown={i < lista.length - 1 ? () => set(mover(lista, i, 1)) : null} onDel={() => { if (confirm('Apagar ' + m.t + '?')) set(lista.filter((_, k) => k !== i)); }} />
          </div>
        </div>
      ))}
      <label className="b b-ouro">Acrescentar música<input type="file" accept="audio/*" hidden onChange={(e) => enviar(null, e.target.files[0])} /></label>
    </>
  );
}

/* ---------- Contas ---------- */
function Contas({ setAviso }) {
  const [lista, setLista] = useState(null);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const carregar = () => api('/api/admin/utilizadores').then(setLista).catch((e) => setAviso({ tipo: 'erro', t: e.message }));
  useEffect(() => { carregar(); }, []);
  async function criar(e) {
    e.preventDefault();
    try { await api('/api/admin/utilizadores', { method: 'POST', body: JSON.stringify({ email, password: pass }) }); setEmail(''); setPass(''); setAviso({ tipo: 'ok', t: 'Conta guardada.' }); carregar(); }
    catch (er) { setAviso({ tipo: 'erro', t: er.message }); }
  }
  async function apagar(em) {
    if (!confirm('Apagar a conta ' + em + '?')) return;
    try { await api('/api/admin/utilizadores', { method: 'DELETE', body: JSON.stringify({ email: em }) }); carregar(); }
    catch (er) { setAviso({ tipo: 'erro', t: er.message }); }
  }
  return (
    <>
      <div className="cartao">
        <h2>Contas com acesso</h2>
        {!lista ? <p>A carregar…</p> : (
          <ul className="contas">{lista.map((u) => (
            <li key={u.email}><b>{u.email}</b>{u.eu && <span className="etiqueta">tu</span>}<small>{u.criado ? new Date(u.criado).toLocaleDateString('pt-PT') : ''}</small>{!u.eu && <button className="b b-claro peq" onClick={() => apagar(u.email)}>Apagar</button>}</li>
          ))}</ul>
        )}
      </div>
      <form className="cartao" onSubmit={criar}>
        <h2>Nova conta ou nova password</h2>
        <p className="ajuda">Não há emails de confirmação: a conta fica ativa logo. Se o email já existir, a password é substituída.</p>
        <div className="linha">
          <div className="campo f2"><label htmlFor="n-email">Email</label><input id="n-email" type="email" autoComplete="off" spellCheck="false" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="campo f2"><label htmlFor="n-pass">Password (mínimo 8 caracteres)</label><input id="n-pass" type="password" autoComplete="new-password" minLength={8} value={pass} onChange={(e) => setPass(e.target.value)} required /></div>
          <button className="b b-ouro">Guardar conta</button>
        </div>
      </form>
    </>
  );
}
