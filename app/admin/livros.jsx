'use client';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Plus, RefreshCw, RotateCcw, Trash2, Check, BookOpen, CircleHelp, MessageSquare, Type, Image as ImageIcon, Lightbulb } from 'lucide-react';
import { DESENHOS, OBJETOS_BASE } from '@/motor/cenas';
import { Avatar, Campo, Interruptor, SelPers, Svg, TextoAuto, Vazio, copia, mover, CORES } from './ui';

export const OBJETOS = [
  ['mapa', 'Mapa de luz'], ['luz', 'Luz dourada'], ['escada', 'Escada de arco-íris'], ['acesa', 'Fonte acesa'], ['mota', 'Mota'], ['arco', 'Arco-íris'],
  ['escamas', 'Escamas'], ['lanterna', 'Lanterna'], ['caneca', 'Caneca'], ['relogio', 'Relógio parado'], ['passaro', 'Passarinho'], ['desenho', 'Desenho'], ['noite', 'Noite'], ['borboletas', 'Borboletas'],
  ['faisca', 'Faísca'], ['cogumelos', 'Cogumelos'], ['pirilampos', 'Pirilampos'], ['escadagelo', 'Escada de gelo'], ['livro', 'Livro'], ['bola', 'Bola'], ['piquenique', 'Piquenique'],
  ['bolo', 'Bolo'], ['bandeirinhas', 'Bandeirinhas'], ['caldeirao', 'Caldeirão'], ['magia', 'Pó mágico'], ['gelado', 'Gelado'], ['trovoada', 'Trovoada'], ['cabana', 'Cabana'], ['pocas', 'Poças'], ['cogumelocasa', 'Casinha-cogumelo'],
  ['nevoeiro', 'Nevoeiro'], ['baldepartido', 'Balde rachado'], ['faiscacor', 'Faísca colorida'], ['nuvenzinha', 'Nuvenzinha'], ['carta', 'Carta'],
];
const TIPOS = [['img', 'Personagem'], ['cor', 'Cor'], ['num', 'Luzes'], ['cena', 'Cenário'], ['svg', 'Desenho'], ['obj', 'Objeto']];
const tipoDe = (o) => (o.img ? 'img' : o.cor ? 'cor' : o.num ? 'num' : o.cena ? 'cena' : o.obj ? 'obj' : 'svg');
const textoDe = (p) => (p.x || []).map((x) => (typeof x === 'string' ? x : x[1])).join(' ');
const cenaDe = (cena, p) => cena(p.c, p.q || [], Object.assign({ balde: p.b }, p.o || {}));

export function OpcaoVisual({ o, pers, cena }) {
  const t = tipoDe(o);
  if (t === 'img') { const p = pers.find((x) => x.id === o.img); return <div className="op-vis"><Avatar src={p?.img} tam={80} alt={p?.nome || ''} /></div>; }
  if (t === 'cor') return <div className="op-vis"><span className="cor" style={{ background: CORES[o.cor] || '#ccc' }} /></div>;
  if (t === 'num') return <div className="op-vis"><span className="luzes" aria-label={o.num + ' Luzes'}>{Array.from({ length: Math.min(12, o.num || 0) }, (_, i) => <i key={i} />)}</span></div>;
  if (t === 'cena') return <div className="op-vis cena"><Svg html={cena(o.cena, [], {})} /></div>;
  if (t === 'obj') return <div className="op-vis obj"><Svg html={cena.solto ? cena.solto(o.obj, o.v) : ''} /></div>;
  const img = cena.imgDesenho?.(o.svg);
  return <div className="op-vis">{img ? <img src={img} alt="" style={{ width: 80, height: 80, borderRadius: 0, objectFit: 'contain' }} /> : <Svg html={DESENHOS[o.svg] || ''} />}</div>;
}

export function Previa({ p, pers, cena }) {
  const html = useMemo(() => cenaDe(cena, p), [cena, p]);
  return (
    <div className="previa" aria-label="Pré-visualização da página">
      <div className="cena-p"><Svg html={html} /></div>
      <div className="texto-p">
        {(p.x || []).map((x, i) => {
          if (typeof x === 'string') return <p key={i}>{x || ' '}</p>;
          const q = pers.find((k) => k.id === x[0]);
          return <div className="fala" key={i}><img src={q?.img} alt={q?.nome || ''} /><span>{x[1] || ' '}</span></div>;
        })}
      </div>
    </div>
  );
}

export default function Livros({ livros, set, juntarPers, pers, cenarios, cena, confirmar, irPara }) {
  const [sel, setSel] = useState(0);
  const [aba, setAba] = useState('pags');
  const [pi, setPi] = useState(0);
  const [qi, setQi] = useState(0);
  const [novos, setNovos] = useState([]);
  const [extras, setExtras] = useState({});
  const L = livros[sel];
  useEffect(() => { setPi(0); setQi(0); }, [sel]);
  // livros novos que vieram com a app e ainda não estão no conteúdo guardado
  useEffect(() => {
    fetch('/api/admin/novidades').then((r) => (r.ok ? r.json() : { livros: [] })).then((d) => { setNovos(d.livros || []); setExtras(d); }).catch(() => {});
  }, []);
  const titulos = new Set(livros.map((l) => l.t));
  const porJuntar = novos.filter((l) => !titulos.has(l.t));
  // livros da app que já estão na lista mas têm uma versão mais recente (por exemplo, com objetos novos)
  // Só há versão nova quando a app mudou o livro depois de ele ter sido juntado ou atualizado.
  // As alterações feitas no backoffice não contam: o livro guarda a "origem" da versão da app de onde veio.
  // Livros guardados antes de existir a origem são considerados atualizados (a versão do backoffice manda).
  const porAtualizar = novos.filter((n) => { const a = livros.find((l) => l.t === n.t); return a && a.origem && n.origem && a.origem !== n.origem; });
  const versaoApp = L ? novos.find((n) => n.t === L.t) : null;
  async function reporDaApp() {
    if (!(await confirmar({ titulo: 'Repor versão da app', texto: `«${L.t}» volta a ficar igual à versão que vem com a app. As alterações que fizeste neste livro no backoffice são substituídas.`, confirmar: 'Repor', perigo: true }))) return;
    const l = livros.slice(); l[sel] = { ...versaoApp, n: L.n }; set(l); juntarPersDe([versaoApp]);
  }
  async function atualizar() {
    if (!(await confirmar({ titulo: 'Atualizar livros', texto: `${porAtualizar.length === 1 ? 'Este livro passa' : 'Estes ' + porAtualizar.length + ' livros passam'} a ser iguais à versão mais recente da app: ${porAtualizar.map((l) => '«' + l.t + '»').join(', ')}. Alterações que tenhas feito neles no backoffice são substituídas.`, confirmar: 'Atualizar' }))) return;
    set(livros.map((l) => { const n = porAtualizar.find((x) => x.t === l.t); return n ? { ...n, n: l.n } : l; }));
    juntarPersDe(porAtualizar);
  }
  function juntarTodos() {
    const novos = porJuntar.map((l, i) => ({ ...l, n: livros.length + i + 1 }));
    set([...livros, ...novos]); setSel(livros.length);
    juntarPersDe(porJuntar);
  }
  function juntarPersDe(lista) {
    const usados = new Set(lista.flatMap((l) => [l.capa, ...(l.pags || []).flatMap((p) => [...(p.q || []), ...(p.x || []).filter(Array.isArray).map((x) => x[0])]), ...(l.perg || []).flatMap((q) => [q.quem, ...q.ops.map((o) => o.img)])]).filter(Boolean));
    const faltam = (extras.personagens || []).filter((p) => usados.has(p.id) && !pers.some((x) => x.id === p.id));
    if (faltam.length && juntarPers) juntarPers(faltam, extras);
  }
  function juntar(l) {
    set([...livros, { ...l, n: livros.length + 1 }]); setSel(livros.length);
    juntarPersDe([l]);
  }

  if (!L) return <div className="bo-corpo"><Vazio titulo="Ainda não há livros" acao={<button className="btn btn-pri" onClick={() => novoLivro()}><Plus size={16} />Novo livro</button>} /></div>;

  const setL = (n) => { const l = livros.slice(); l[sel] = n; set(l); };
  const renumerar = (l) => l.map((x, i) => ({ ...x, n: i + 1 }));
  function novoLivro() {
    set(renumerar([...livros, { n: 0, t: 'Novo livro', capa: 'francisca', pags: [{ c: 'feliz', q: ['francisca'], x: ['Era uma vez…'] }], perg: [] }]));
    setSel(livros.length);
  }
  async function apagarLivro() {
    if (!(await confirmar({ titulo: 'Apagar livro', texto: `O livro «${L.t}» e as suas ${L.pags.length} páginas vão ser apagados quando guardares.`, confirmar: 'Apagar livro', perigo: true }))) return;
    set(renumerar(livros.filter((_, i) => i !== sel))); setSel(Math.max(0, sel - 1));
  }
  const pags = L.pags || [];
  const perg = L.perg || [];
  const P = pags[Math.min(pi, pags.length - 1)];
  const Q = perg[Math.min(qi, perg.length - 1)];
  const nomeCena = (k) => cenarios.find((c) => c.id === k)?.nome || k;

  const setPag = (np) => { const ps = pags.slice(); ps[pi] = np; setL({ ...L, pags: ps }); };
  const setPerg = (nq) => { const qs = perg.slice(); qs[qi] = nq; setL({ ...L, perg: qs }); };
  const novaPag = () => { const base = pags[pi] || { c: 'feliz', q: [] }; const ps = pags.slice(); ps.splice(pi + 1, 0, { c: base.c, q: (base.q || []).slice(), x: [''] }); setL({ ...L, pags: ps }); setPi(pi + 1); };
  const novaPerg = () => { setL({ ...L, perg: [...perg, { q: 'Nova pergunta?', quem: 'francisca', ops: [{ img: 'francisca' }, { img: 'maia' }, { img: 'balu' }], ok: 0 }] }); setQi(perg.length); };

  return (
    <div className="livros">
      <div className="col col-livros">
        <div className="col-cab"><b>Livros</b><small className="num">{livros.length}</small><button className="btn-ic" onClick={novoLivro} aria-label="Novo livro" title="Novo livro"><Plus size={16} /></button></div>
        {porAtualizar.length > 0 && (
          <div className="novo-livro">
            <span><b>{porAtualizar.length === 1 ? '1 livro com versão nova' : porAtualizar.length + ' livros com versão nova'}</b>A app mudou {porAtualizar.length === 1 ? 'este livro' : 'estes livros'} depois de os juntares: {porAtualizar.map((l) => l.t).join(', ')}.</span>
            <button className="btn btn-pri peq" onClick={atualizar}><RefreshCw size={14} />Atualizar</button>
          </div>
        )}
        {porJuntar.length > 1 && (
          <div className="novo-livro">
            <span><b>{porJuntar.length} livros novos</b>Vieram com a app e ainda não estão na lista.</span>
            <button className="btn btn-pri peq" onClick={() => juntarTodos()}><Plus size={14} />Juntar todos</button>
          </div>
        )}
        {porJuntar.map((l) => (
          <div className="novo-livro" key={l.t}>
            <span><b>Livro novo</b>{l.t}</span>
            <button className="btn btn-pri peq" onClick={() => juntar(l)}><Plus size={14} />Juntar</button>
          </div>
        ))}
        <div className="col-lista" role="list">
          {livros.map((l, i) => (
            <button key={i} className="item" aria-current={i === sel} onClick={() => setSel(i)} role="listitem">
              <span className="n">{l.n}</span>
              <Avatar src={pers.find((p) => p.id === l.capa)?.img} tam={30} />
              <span className="tx"><b>{l.t}</b><small>{(l.pags || []).length} páginas · {(l.perg || []).length} perguntas</small></span>
            </button>
          ))}
        </div>
      </div>

      <div className="col col-paginas">
        <div className="livro-cab">
          <select className="livro-sel peq" aria-label="Livro" value={sel} onChange={(e) => setSel(+e.target.value)}>
            {livros.map((l, i) => <option key={i} value={i}>{l.n}. {l.t}</option>)}
          </select>
          <Campo label="Título" id="l-t"><input id="l-t" value={L.t} onChange={(e) => setL({ ...L, t: e.target.value })} /></Campo>
          <div className="linha">
            <Campo label="Capa" id="l-capa" className="f"><SelPers id="l-capa" className="peq" pers={pers} valor={L.capa} onChange={(v) => setL({ ...L, capa: v })} soPrincipais /></Campo>
            <div className="grupo-ic">
              <button className="btn-ic" disabled={sel === 0} onClick={() => { set(renumerar(mover(livros, sel, -1))); setSel(sel - 1); }} aria-label="Mover livro para cima"><ArrowUp size={16} /></button>
              <button className="btn-ic" disabled={sel === livros.length - 1} onClick={() => { set(renumerar(mover(livros, sel, 1))); setSel(sel + 1); }} aria-label="Mover livro para baixo"><ArrowDown size={16} /></button>
              {versaoApp && <button className="btn-ic" onClick={reporDaApp} aria-label="Repor a versão da app" title="Repor a versão da app"><RotateCcw size={16} /></button>}
              <button className="btn-ic perigo" onClick={apagarLivro} aria-label="Apagar livro"><Trash2 size={16} /></button>
            </div>
          </div>
          <Interruptor id="l-luz" checked={L.luz} onChange={(v) => setL({ ...L, luz: v ? 1 : 0 })} label="Dá uma Luz no fim" />
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={aba === 'pags'} onClick={() => setAba('pags')}><BookOpen size={14} />Páginas <span className="cont">{pags.length}</span></button>
            <button role="tab" aria-selected={aba === 'perg'} onClick={() => setAba('perg')}><CircleHelp size={14} />Perguntas <span className="cont">{perg.length}</span></button>
          </div>
        </div>
        {aba === 'pags' ? (
          <div className="col-lista">
            {pags.map((p, i) => (
              <button key={i} className="item pag" aria-current={i === pi} onClick={() => setPi(i)}>
                <span className="n">{i + 1}</span>
                <span className="miniatura"><Svg html={cenaDe(cena, p)} /></span>
                <span className="tx"><b>{nomeCena(p.c)}</b><small>{textoDe(p) || 'Sem texto'}</small></span>
              </button>
            ))}
            <button className="btn btn-fan total" onClick={novaPag}><Plus size={16} />Nova página</button>
          </div>
        ) : (
          <div className="col-lista">
            {perg.map((q, i) => (
              <button key={i} className="item" aria-current={i === qi} onClick={() => setQi(i)}>
                <span className="n">{i + 1}</span>
                <Avatar src={pers.find((p) => p.id === q.quem)?.img} tam={30} />
                <span className="tx"><b>{q.q || 'Sem pergunta'}</b><small>{q.ops.length} opções</small></span>
              </button>
            ))}
            <button className="btn btn-fan total" onClick={novaPerg}><Plus size={16} />Nova pergunta</button>
          </div>
        )}
      </div>

      <div className="col-editor">
        {aba === 'pags' ? (P ? (
          <EditorPagina key={sel + '-' + pi} p={P} i={pi} total={pags.length} set={setPag} pers={pers} cenarios={cenarios} cena={cena} irPara={irPara}
            acoes={{
              cima: () => { setL({ ...L, pags: mover(pags, pi, -1) }); setPi(pi - 1); },
              baixo: () => { setL({ ...L, pags: mover(pags, pi, 1) }); setPi(pi + 1); },
              duplicar: () => { const ps = pags.slice(); ps.splice(pi + 1, 0, copia(P)); setL({ ...L, pags: ps }); setPi(pi + 1); },
              apagar: async () => {
                if (pags.length === 1) return;
                if (!(await confirmar({ titulo: 'Apagar página', texto: `A página ${pi + 1} de «${L.t}» vai ser apagada.`, confirmar: 'Apagar', perigo: true }))) return;
                setL({ ...L, pags: pags.filter((_, k) => k !== pi) }); setPi(Math.max(0, pi - 1));
              },
            }} />
        ) : <Vazio titulo="Sem páginas" acao={<button className="btn btn-pri" onClick={novaPag}><Plus size={16} />Nova página</button>} />)
          : (Q ? (
            <EditorPergunta key={sel + '-' + qi} q={Q} i={qi} set={setPerg} pers={pers} cenarios={cenarios} cena={cena}
              apagar={async () => {
                if (!(await confirmar({ titulo: 'Apagar pergunta', texto: `«${Q.q}» vai ser apagada.`, confirmar: 'Apagar', perigo: true }))) return;
                setL({ ...L, perg: perg.filter((_, k) => k !== qi) }); setQi(Math.max(0, qi - 1));
              }} />
          ) : <Vazio titulo="Sem perguntas" texto="As perguntas aparecem no fim do livro. As respostas são imagens, porque a Francisca ainda não lê." acao={<button className="btn btn-pri" onClick={novaPerg}><Plus size={16} />Nova pergunta</button>} />)}
      </div>
    </div>
  );
}

function EditorPagina({ p, i, total, set, pers, cenarios, cena, acoes, irPara }) {
  const principais = pers.filter((x) => !x.extra);
  const togglePers = (id) => { const q = p.q || []; set({ ...p, q: q.includes(id) ? q.filter((k) => k !== id) : [...q, id].slice(0, 5) }); };
  const toggleObj = (k) => { const o = { ...(p.o || {}) }; if (o[k]) delete o[k]; else o[k] = k === 'borboletas' ? 4 : k === 'pirilampos' ? 8 : 1; const n = { ...p, o }; if (!Object.keys(o).length) delete n.o; set(n); };
  const setParte = (k, v) => { const x = p.x.slice(); x[k] = v; set({ ...p, x }); };
  const flag = (k, v) => { const n = { ...p }; if (v) n[k] = 1; else delete n[k]; set(n); };
  const cenaExiste = cenarios.some((c) => c.id === p.c);

  return (
    <div className="editor-p">
      <h2>Página {i + 1} <span className="mono" style={{ color: 'var(--mute)', fontWeight: 400, fontSize: 13 }}>de {total}</span><span className="esp" />
        <span className="grupo-ic">
          <button className="btn-ic" disabled={i === 0} onClick={acoes.cima} aria-label="Mover página para cima"><ArrowUp size={16} /></button>
          <button className="btn-ic" disabled={i === total - 1} onClick={acoes.baixo} aria-label="Mover página para baixo"><ArrowDown size={16} /></button>
          <button className="btn-ic" onClick={acoes.duplicar} aria-label="Duplicar página"><Copy size={16} /></button>
          <button className="btn-ic perigo" disabled={total === 1} onClick={acoes.apagar} aria-label="Apagar página"><Trash2 size={16} /></button>
        </span>
      </h2>

      <div>
        <Previa p={p} pers={pers} cena={cena} />
        <div className="previa-rod"><span>Pré-visualização. Na app, a voz lê cada parte e destaca a fala.</span></div>
      </div>

      <div className="cartao">
        <div className="cartao-cab"><ImageIcon size={16} /><h2>Imagem</h2></div>
        <div className="cartao-corpo">
          <div className="linha">
            <Campo label="Cenário" id="p-c" className="f" ajuda={<>As imagens dos cenários mudam-se em <button className="btn-fan" style={{ border: 0, padding: 0, background: 'none', color: 'var(--link)', cursor: 'pointer', fontSize: 12 }} onClick={() => irPara('cenarios')}>Cenários</button>.</>}>
              <select id="p-c" value={p.c} onChange={(e) => set({ ...p, c: e.target.value })}>
                {!cenaExiste && <option value={p.c}>{p.c}</option>}
                {cenarios.map((c) => <option key={c.id} value={c.id}>{c.nome}{c.img ? ' (imagem)' : ''}</option>)}
              </select>
            </Campo>
            <Interruptor id="p-b" checked={p.b} onChange={(v) => flag('b', v)} label="Balde mágico" />
            <Interruptor id="p-plim" checked={p.plim} onChange={(v) => flag('plim', v)} label="Som «plim»" />
          </div>
          <div className="campo">
            <span className="rotulo">Personagens <span style={{ color: 'var(--mute)', fontWeight: 400 }}>(até 5, pela ordem em que as escolhes)</span></span>
            <div className="chips">{principais.map((x) => (
              <button type="button" key={x.id} className="chip" aria-pressed={(p.q || []).includes(x.id)} onClick={() => togglePers(x.id)}><img src={x.img} alt="" />{x.nome}</button>
            ))}</div>
          </div>
          <div className="campo">
            <span className="rotulo">Objetos e efeitos</span>
            <div className="chips">{OBJETOS.map(([k, t]) => (
              <button type="button" key={k} className="chip sem-av" aria-pressed={!!p.o?.[k]} onClick={() => toggleObj(k)}>{t}</button>
            ))}</div>
            {p.o?.borboletas ? (
              <div className="linha c" style={{ marginTop: 6 }}>
                <label htmlFor="p-bor" className="rotulo">Quantas borboletas</label>
                <input id="p-bor" type="number" min="1" max="20" className="peq" style={{ width: 80 }} value={p.o.borboletas} onChange={(e) => set({ ...p, o: { ...p.o, borboletas: Math.max(1, Math.min(20, +e.target.value || 1)) } })} />
              </div>
            ) : null}
            {p.o?.faiscacor ? (
              <div className="linha c" style={{ marginTop: 6 }}>
                <label htmlFor="p-fc" className="rotulo">Cor da faísca</label>
                <select id="p-fc" className="peq" style={{ width: 160 }} value={p.o.faiscacor} onChange={(e) => set({ ...p, o: { ...p.o, faiscacor: +e.target.value } })}>{['Vermelho', 'Laranja', 'Amarelo', 'Verde', 'Azul', 'Anil', 'Violeta'].map((t, i) => <option key={i} value={i + 1}>{t}</option>)}</select>
              </div>
            ) : null}
            {p.o?.nevoeiro ? (
              <div className="linha c" style={{ marginTop: 6 }}>
                <label htmlFor="p-nv" className="rotulo">Nevoeiro</label>
                <select id="p-nv" className="peq" style={{ width: 160 }} value={p.o.nevoeiro} onChange={(e) => set({ ...p, o: { ...p.o, nevoeiro: +e.target.value } })}><option value={1}>Cinzento</option><option value={2}>Branco</option><option value={3}>Cor-de-rosa</option></select>
              </div>
            ) : null}
            {p.o?.pirilampos ? (
              <div className="linha c" style={{ marginTop: 6 }}>
                <label htmlFor="p-pir" className="rotulo">Quantos pirilampos</label>
                <input id="p-pir" type="number" min="1" max="30" className="peq" style={{ width: 80 }} value={p.o.pirilampos} onChange={(e) => set({ ...p, o: { ...p.o, pirilampos: Math.max(1, Math.min(30, +e.target.value || 1)) } })} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="cartao">
        <div className="cartao-cab"><Type size={16} /><h2>Texto</h2><p>{(p.x || []).length} partes</p></div>
        <div className="cartao-corpo">
          <div className="partes">
            {(p.x || []).map((x, k) => {
              const fala = Array.isArray(x);
              return (
                <div className="parte" key={k}>
                  <div className="quem-s">
                    <select aria-label={'Quem diz a parte ' + (k + 1)} value={fala ? x[0] : ''} onChange={(e) => setParte(k, e.target.value ? [e.target.value, fala ? x[1] : x] : (fala ? x[1] : x))}>
                      <option value="">Narrador</option>
                      {pers.map((pp) => <option key={pp.id} value={pp.id}>{pp.nome}</option>)}
                    </select>
                  </div>
                  <TextoAuto aria-label={'Texto da parte ' + (k + 1)} value={fala ? x[1] : x} onChange={(e) => setParte(k, fala ? [x[0], e.target.value] : e.target.value)} placeholder={fala ? 'O que a personagem diz…' : 'O que o narrador conta…'} />
                  <span className="grupo-ic">
                    <button className="btn-ic" disabled={k === 0} onClick={() => set({ ...p, x: mover(p.x, k, -1) })} aria-label="Subir parte"><ArrowUp size={15} /></button>
                    <button className="btn-ic" disabled={k === p.x.length - 1} onClick={() => set({ ...p, x: mover(p.x, k, 1) })} aria-label="Descer parte"><ArrowDown size={15} /></button>
                    <button className="btn-ic perigo" disabled={p.x.length === 1} onClick={() => set({ ...p, x: p.x.filter((_, j) => j !== k) })} aria-label="Apagar parte"><Trash2 size={15} /></button>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="linha">
            <button className="btn btn-sec peq" onClick={() => set({ ...p, x: [...p.x, ''] })}><Plus size={14} />Narrador</button>
            <button className="btn btn-sec peq" onClick={() => set({ ...p, x: [...p.x, [(p.q || [])[0] || 'francisca', '']] })}><MessageSquare size={14} />Fala de personagem</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorPergunta({ q, i, set, pers, cenarios, cena, apagar }) {
  const setOp = (k, o) => { const ops = q.ops.slice(); ops[k] = o; set({ ...q, ops }); };
  const mudarTipo = (k, t) => { const v = { img: 'francisca', cor: 'vermelho', num: 1, cena: cenarios[0]?.id || 'quarto', svg: 'balde', obj: 'faisca' }[t]; const o = { [t]: v }; if (q.ops[k].d) o.d = q.ops[k].d; setOp(k, o); };
  const apagarOp = (k) => set({ ...q, ops: q.ops.filter((_, j) => j !== k), ok: q.ok === k ? 0 : q.ok > k ? q.ok - 1 : q.ok });
  return (
    <div className="perguntas">
      <h2 style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>Pergunta {i + 1}<span style={{ flex: 1 }} /><button className="btn-ic perigo" onClick={apagar} aria-label="Apagar pergunta"><Trash2 size={16} /></button></h2>
      <div className="cartao"><div className="cartao-corpo">
        <div className="linha">
          <Campo label="Pergunta (dita pela voz)" id="q-q" className="f"><input id="q-q" value={q.q} onChange={(e) => set({ ...q, q: e.target.value })} /></Campo>
          <Campo label="Quem pergunta" id="q-quem"><SelPers id="q-quem" pers={pers} valor={q.quem} onChange={(v) => set({ ...q, quem: v })} /></Campo>
        </div>
      </div></div>
      <div className="linha c"><span className="rotulo" style={{ flex: 1 }}>Respostas</span><span className="ajuda-c" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Lightbulb size={14} />Imagens fáceis de distinguir. O texto dito é opcional.</span></div>
      <div className="ops">
        {q.ops.map((o, k) => {
          const t = tipoDe(o);
          const certa = q.ok === k;
          return (
            <div className={'op' + (certa ? ' certa' : '')} key={k}>
              <div className="op-topo">
                <label className="op-certa"><input type="radio" name={'ok-' + i} checked={certa} onChange={() => set({ ...q, ok: k })} />{certa ? <><Check size={14} />Certa</> : 'Marcar certa'}</label>
                <span className="esp" />
                <button className="btn-ic perigo" disabled={q.ops.length <= 2} onClick={() => apagarOp(k)} aria-label={'Apagar opção ' + (k + 1)}><Trash2 size={14} /></button>
              </div>
              <OpcaoVisual o={o} pers={pers} cena={cena} />
              <select className="peq" aria-label="Tipo de resposta" value={t} onChange={(e) => mudarTipo(k, e.target.value)}>{TIPOS.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select>
              {t === 'img' && <SelPers className="peq" aria-label="Personagem" pers={pers} valor={o.img} onChange={(v) => setOp(k, { ...o, img: v })} soPrincipais />}
              {t === 'cor' && <select className="peq" aria-label="Cor" value={o.cor} onChange={(e) => setOp(k, { ...o, cor: e.target.value })}>{Object.keys(CORES).map((c) => <option key={c}>{c}</option>)}</select>}
              {t === 'num' && <input className="peq" aria-label="Número de Luzes" type="number" min="1" max="12" value={o.num} onChange={(e) => setOp(k, { ...o, num: Math.max(1, Math.min(12, +e.target.value || 1)) })} />}
              {t === 'cena' && <select className="peq" aria-label="Cenário" value={o.cena} onChange={(e) => setOp(k, { ...o, cena: e.target.value })}>{cenarios.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>}
              {t === 'obj' && <select className="peq" aria-label="Objeto" value={o.obj} onChange={(e) => { const n = { ...o, obj: e.target.value }; delete n.v; setOp(k, n); }}>{OBJETOS_BASE.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}</select>}
              {t === 'obj' && (o.obj === 'faiscacor' || o.obj === 'nevoeiro') && <select className="peq" aria-label="Variante" value={o.v || 1} onChange={(e) => setOp(k, { ...o, v: +e.target.value })}>{(o.obj === 'faiscacor' ? ['Vermelho', 'Laranja', 'Amarelo', 'Verde', 'Azul', 'Anil', 'Violeta'] : ['Cinzento', 'Branco', 'Cor-de-rosa']).map((n, i) => <option key={i} value={i + 1}>{n}</option>)}</select>}
              {t === 'svg' && <select className="peq" aria-label="Desenho" value={o.svg} onChange={(e) => setOp(k, { ...o, svg: e.target.value })}>{Object.keys(DESENHOS).map((d) => <option key={d}>{d}</option>)}</select>}
              <input className="peq" aria-label="Texto dito" placeholder="Texto dito (opcional)" value={o.d || ''} onChange={(e) => { const n = { ...o }; if (e.target.value) n.d = e.target.value; else delete n.d; setOp(k, n); }} />
            </div>
          );
        })}
      </div>
      {q.ops.length < 4 && <div><button className="btn btn-sec peq" onClick={() => set({ ...q, ops: [...q.ops, { img: 'francisca' }] })}><Plus size={14} />Opção</button></div>}
    </div>
  );
}
