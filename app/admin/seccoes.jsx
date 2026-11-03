'use client';
import { useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Camera, ImagePlus, LoaderCircle, Music, Plus, Search, Trash2, Undo2, Upload, Volume2 } from 'lucide-react';
import { CENARIOS_BASE } from '@/motor/cenas';
import { Avatar, Campo, Dialogo, Interruptor, SelPers, Svg, TextoAuto, Vazio, CORES, enviarFicheiro, mover, slug } from './ui';

const TEMAS_COR = [['t-coral', 'Coral', '#FF8A7A'], ['t-verde', 'Verde', '#5CC48E'], ['t-azul', 'Azul', '#5AA9E6'], ['t-lilas', 'Lilás', '#A98BEB'], ['t-ouro', 'Dourado', '#F5C24B'], ['t-rosa', 'Rosa', '#F48FB8']];
const ICONES = ['clock', 'eye-off', 'users', 'refresh-cw', 'lock', 'pencil', 'megaphone', 'cookie', 'book-open', 'thumbs-up', 'frown', 'user-x', 'heart-handshake', 'smile', 'star', 'x', 'check'];

function Cabecalho({ titulo, texto, children }) {
  return <div className="cab"><div><h1>{titulo}</h1>{texto && <p>{texto}</p>}</div>{children && <div className="acoes">{children}</div>}</div>;
}
function Procura({ valor, set, rotulo }) {
  return <div className="procura"><Search size={15} /><input type="search" aria-label={rotulo} placeholder={rotulo + '…'} value={valor} onChange={(e) => set(e.target.value)} /></div>;
}

/* ---------- Personagens ---------- */
export function Personagens({ lista, set, livros, avisar, confirmar }) {
  const [aEnviar, setAEnviar] = useState(null);
  const [novo, setNovo] = useState(null);
  const usos = useMemo(() => {
    const u = {};
    (livros || []).forEach((l) => (l.pags || []).forEach((p) => {
      const ids = new Set([...(p.q || []), ...(p.x || []).filter(Array.isArray).map((x) => x[0])]);
      ids.forEach((id) => (u[id] = (u[id] || 0) + 1));
    }));
    return u;
  }, [livros]);
  const setP = (i, p) => { const l = lista.slice(); l[i] = p; set(l); };
  async function trocar(i, f) {
    if (!f) return;
    setAEnviar(lista[i].id);
    try { const url = await enviarFicheiro(f, 'personagens', 800); setP(i, { ...lista[i], img: url }); avisar('Imagem enviada. Guarda para publicar.'); }
    catch (e) { avisar(e.message, 'erro'); }
    setAEnviar(null);
  }
  async function apagar(i) {
    const p = lista[i]; const n = usos[p.id] || 0;
    if (!(await confirmar({ titulo: 'Apagar personagem', texto: n ? `${p.nome} aparece em ${n} páginas. Essas páginas ficam sem a imagem e as falas sem voz própria.` : `${p.nome} vai ser apagado.`, confirmar: 'Apagar', perigo: true }))) return;
    set(lista.filter((_, k) => k !== i));
  }
  return (
    <>
      <Cabecalho titulo="Personagens" texto="Retrato, nome, frase típica e voz de cada amigo. As personagens «só voz» falam nos livros mas não entram nos jogos.">
        <button className="btn btn-pri" onClick={() => setNovo({ nome: '' })}><Plus size={16} />Nova personagem</button>
      </Cabecalho>
      <div className="grelha-c largos">
        {lista.map((p, i) => (
          <div className="cartao c-pers" key={p.id}>
            <label className="foto-p" title="Trocar imagem">
              <img src={p.img} alt={p.nome} />
              <span>{aEnviar === p.id ? <LoaderCircle size={20} className="gira" /> : <Camera size={20} />}</span>
              <input type="file" accept="image/*" aria-label={'Trocar imagem de ' + p.nome} onChange={(e) => { trocar(i, e.target.files[0]); e.target.value = ''; }} />
            </label>
            <div className="campos">
              <input aria-label="Nome" value={p.nome} onChange={(e) => setP(i, { ...p, nome: e.target.value })} style={{ fontWeight: 500 }} />
              <input aria-label="Frase típica" placeholder="Frase típica" value={p.frase || ''} onChange={(e) => setP(i, { ...p, frase: e.target.value })} />
              <div className="grelha-2">
                <Campo label="Tom" id={'tp-' + p.id}><input id={'tp-' + p.id} className="peq" type="number" step="0.05" min="0.4" max="2" value={p.tom?.p ?? 1} onChange={(e) => setP(i, { ...p, tom: { ...(p.tom || {}), p: +e.target.value } })} /></Campo>
                <Campo label="Velocidade" id={'tr-' + p.id}><input id={'tr-' + p.id} className="peq" type="number" step="0.05" min="0.5" max="1.5" value={p.tom?.r ?? 0.92} onChange={(e) => setP(i, { ...p, tom: { ...(p.tom || {}), r: +e.target.value } })} /></Campo>
              </div>
            </div>
            <div className="rodape">
              <Interruptor id={'ex-' + p.id} checked={p.extra} onChange={(v) => { const n = { ...p }; if (v) n.extra = 1; else delete n.extra; setP(i, n); }} label="Só voz" />
              <span className="esp" />
              <span className="id" title="Identificador">{p.id}</span>
              <span className="etq" title="Páginas onde aparece">{usos[p.id] || 0} pág.</span>
              <button className="btn-ic" onClick={() => ouvir(p)} aria-label={'Ouvir ' + p.nome}><Volume2 size={15} /></button>
              <button className="btn-ic perigo" onClick={() => apagar(i)} aria-label={'Apagar ' + p.nome}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
      {novo && (
        <Dialogo titulo="Nova personagem" onFechar={() => setNovo(null)}>
          <form onSubmit={(e) => { e.preventDefault(); const id = slug(novo.nome); set([...lista, { id, nome: novo.nome.trim(), img: '/icon-192.png', frase: '', tom: { p: 1, r: 0.92 } }]); setNovo(null); avisar('Personagem criada. Junta-lhe uma imagem.'); }}>
            <div className="dl-corpo">
              <Campo label="Nome" id="np-nome" ajuda={novo.nome ? 'Identificador: ' + (slug(novo.nome) || '…') : 'Por exemplo: Mustarda'}>
                <input id="np-nome" autoComplete="off" value={novo.nome} onChange={(e) => setNovo({ nome: e.target.value })} />
              </Campo>
              {lista.some((p) => p.id === slug(novo.nome)) && <p style={{ color: 'var(--erro)', fontSize: 13 }}>Já existe uma personagem com este identificador.</p>}
            </div>
            <div className="dl-acoes"><button type="button" className="btn btn-sec" onClick={() => setNovo(null)}>Cancelar</button><button className="btn btn-pri" disabled={!slug(novo.nome) || lista.some((p) => p.id === slug(novo.nome))}>Criar</button></div>
          </form>
        </Dialogo>
      )}
    </>
  );
}
function ouvir(p) {
  try {
    const s = window.speechSynthesis; s.cancel();
    const u = new SpeechSynthesisUtterance(p.frase || 'Olá! Eu sou ' + p.nome + '.');
    u.lang = 'pt-PT'; u.pitch = p.tom?.p ?? 1; u.rate = p.tom?.r ?? 0.92;
    const v = s.getVoices().find((x) => x.lang === 'pt-PT') || s.getVoices().find((x) => x.lang?.startsWith('pt'));
    if (v) u.voice = v;
    s.speak(u);
  } catch {}
}

/* ---------- Cenários ---------- */
export function Cenarios({ lista, set, livros, cena, avisar, confirmar }) {
  const [aEnviar, setAEnviar] = useState(null);
  const [novo, setNovo] = useState(null);
  const [sobre, setSobre] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const usos = useMemo(() => {
    const u = {};
    (livros || []).forEach((l) => {
      (l.pags || []).forEach((p) => (u[p.c] = (u[p.c] || 0) + 1));
      (l.perg || []).forEach((q) => q.ops.forEach((o) => { if (o.cena) u[o.cena] = (u[o.cena] || 0) + 1; }));
    });
    return u;
  }, [livros]);
  const base = new Set(CENARIOS_BASE);
  const setC = (i, c) => { const l = lista.slice(); l[i] = c; set(l); };
  async function trocar(i, f) {
    if (!f || !f.type.startsWith('image/')) return;
    setAEnviar(lista[i].id);
    try { const url = await enviarFicheiro(f, 'cenarios', 1600); setC(i, { ...lista[i], img: url }); avisar('Imagem do cenário trocada. Guarda para publicar.'); }
    catch (e) { avisar(e.message, 'erro'); }
    setAEnviar(null);
  }
  async function voltarDesenho(i) {
    const c = lista[i];
    if (!base.has(c.id)) return;
    if (!(await confirmar({ titulo: 'Voltar ao desenho', texto: `${c.nome} volta a usar o desenho original da app. A imagem enviada deixa de ser usada.`, confirmar: 'Usar desenho' }))) return;
    setC(i, { ...c, img: '' });
  }
  async function apagar(i) {
    const c = lista[i];
    if (!(await confirmar({ titulo: 'Apagar cenário', texto: `${c.nome} vai ser apagado.`, confirmar: 'Apagar', perigo: true }))) return;
    set(lista.filter((_, k) => k !== i));
  }
  const visiveis = lista.map((c, i) => [c, i]).filter(([c]) => filtro === 'todos' || (filtro === 'img' ? !!c.img : !c.img));
  const nImg = lista.filter((c) => c.img).length;
  return (
    <>
      <Cabecalho titulo="Cenários" texto="Os fundos das páginas dos livros. Cada cenário tem um desenho da app; podes trocá-lo por uma imagem tua (paisagem, idealmente 1600 × 1000). As personagens e os objetos continuam a ser desenhados por cima.">
        <button className="btn btn-pri" onClick={() => setNovo({ nome: '', img: '', aEnviar: false })}><Plus size={16} />Novo cenário</button>
      </Cabecalho>
      <div className="ferr">
        <div className="seg" role="group" aria-label="Filtrar cenários">
          {[['todos', 'Todos', lista.length], ['img', 'Com imagem', nImg], ['des', 'Desenho', lista.length - nImg]].map(([k, t, n]) => (
            <button key={k} aria-pressed={filtro === k} onClick={() => setFiltro(k)}>{t}<span className="num" style={{ color: 'var(--mute)', fontSize: 12 }}>{n}</span></button>
          ))}
        </div>
        <span className="info">Arrasta uma imagem para cima de um cenário para a trocar.</span>
      </div>
      <div className="grelha-c">
        {visiveis.map(([c, i]) => {
          const n = usos[c.id] || 0;
          const proprio = !base.has(c.id);
          return (
            <div className="cartao c-cen" key={c.id}>
              <div className={'vis' + (sobre === c.id ? ' solta' : '')}
                onDragOver={(e) => { e.preventDefault(); setSobre(c.id); }} onDragLeave={() => setSobre(null)}
                onDrop={(e) => { e.preventDefault(); setSobre(null); trocar(i, e.dataTransfer.files[0]); }}>
                <Svg html={cena(c.id, [], {})} />
                <span className={'etq' + (c.img ? ' azul' : '')}>{aEnviar === c.id ? 'A enviar…' : c.img ? 'Imagem' : 'Desenho'}</span>
              </div>
              <div className="info">
                <input aria-label="Nome do cenário" value={c.nome} onChange={(e) => setC(i, { ...c, nome: e.target.value })} style={{ fontWeight: 500 }} />
                <div className="meta"><span className="mono">{c.id}</span><span className="esp" />{proprio && <span className="etq">Novo</span>}<span className={'etq' + (n ? '' : ' aviso')}>{n ? `Usado ${n}×` : 'Sem uso'}</span></div>
              </div>
              <div className="acoes-c">
                <label className="btn btn-sec peq">{aEnviar === c.id ? <LoaderCircle size={14} className="gira" /> : <ImagePlus size={14} />}{c.img ? 'Trocar imagem' : 'Usar imagem'}
                  <input type="file" accept="image/*" onChange={(e) => { trocar(i, e.target.files[0]); e.target.value = ''; }} />
                </label>
                {c.img && !proprio && <button className="btn btn-fan peq" onClick={() => voltarDesenho(i)}><Undo2 size={14} />Usar desenho</button>}
                <span style={{ flex: 1 }} />
                {proprio && <button className="btn-ic perigo" disabled={n > 0} title={n ? 'Está a ser usado em livros' : 'Apagar'} onClick={() => apagar(i)} aria-label={'Apagar ' + c.nome}><Trash2 size={15} /></button>}
              </div>
            </div>
          );
        })}
      </div>
      {novo && (
        <Dialogo titulo="Novo cenário" onFechar={() => setNovo(null)}>
          <form onSubmit={(e) => { e.preventDefault(); set([...lista, { id: slug(novo.nome), nome: novo.nome.trim(), img: novo.img }]); setNovo(null); avisar('Cenário criado. Já o podes escolher nas páginas dos livros.'); }}>
            <div className="dl-corpo">
              <Campo label="Nome" id="nc-nome" ajuda={novo.nome ? 'Identificador: ' + (slug(novo.nome) || '…') : 'Por exemplo: Praia da Estela'}>
                <input id="nc-nome" autoComplete="off" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
              </Campo>
              {lista.some((c) => c.id === slug(novo.nome)) && <p style={{ color: 'var(--erro)', fontSize: 13 }}>Já existe um cenário com este identificador.</p>}
              <div className="campo">
                <span className="rotulo">Imagem</span>
                <div className="cartao" style={{ aspectRatio: '400 / 250', overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'var(--soft)' }}>
                  {novo.img ? <img src={novo.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--mute)', fontSize: 13 }}>{novo.aEnviar ? 'A enviar…' : 'Sem imagem'}</span>}
                </div>
                <label className="btn btn-sec peq" style={{ alignSelf: 'flex-start' }}><Upload size={14} />Escolher imagem
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
                    setNovo((n) => ({ ...n, aEnviar: true }));
                    try { const url = await enviarFicheiro(f, 'cenarios', 1600); setNovo((n) => ({ ...n, img: url, aEnviar: false })); }
                    catch (er) { avisar(er.message, 'erro'); setNovo((n) => ({ ...n, aEnviar: false })); }
                  }} />
                </label>
                <small className="ajuda-c">Os cenários novos precisam de imagem, porque não têm desenho na app.</small>
              </div>
            </div>
            <div className="dl-acoes"><button type="button" className="btn btn-sec" onClick={() => setNovo(null)}>Cancelar</button><button className="btn btn-pri" disabled={!slug(novo.nome) || !novo.img || lista.some((c) => c.id === slug(novo.nome))}>Criar cenário</button></div>
          </form>
        </Dialogo>
      )}
    </>
  );
}

/* ---------- Sabias que ---------- */
export function Factos({ temas, set, pers, confirmar }) {
  const [ti, setTi] = useState(0);
  const [filtro, setFiltro] = useState('');
  const fimRef = useRef(null);
  const total = temas.reduce((a, t) => a + (t.f || []).length, 0);
  const T = temas[Math.min(ti, temas.length - 1)];
  const setT = (t) => { const l = temas.slice(); l[ti] = t; set(l); };
  const setF = (k, v) => { const f = T.f.slice(); f[k] = v; setT({ ...T, f }); };
  const novoTema = () => { set([...temas, { id: 'tema' + Date.now(), t: 'Novo tema', q: 'girafa', cls: 't-azul', f: [] }]); setTi(temas.length); };
  async function apagarTema() {
    if (!(await confirmar({ titulo: 'Apagar tema', texto: `O tema «${T.t}» e os seus ${T.f.length} factos vão ser apagados.`, confirmar: 'Apagar tema', perigo: true }))) return;
    set(temas.filter((_, k) => k !== ti)); setTi(Math.max(0, ti - 1));
  }
  const f = filtro.trim().toLowerCase();
  return (
    <>
      <Cabecalho titulo="Sabias que" texto={`${total} factos em ${temas.length} temas. Cada facto é dito em voz alta pela personagem do tema.`}>
        <button className="btn btn-sec" onClick={novoTema}><Plus size={16} />Novo tema</button>
      </Cabecalho>
      <div className="tabs" role="tablist">
        {temas.map((t, i) => <button key={t.id || i} role="tab" aria-selected={i === ti} onClick={() => setTi(i)}><span className="amostra" style={{ width: 10, height: 10, background: TEMAS_COR.find((c) => c[0] === t.cls)?.[2] }} />{t.t}<span className="cont">{(t.f || []).length}</span></button>)}
      </div>
      {T ? (
        <div className="pilha">
          <div className="cartao"><div className="cartao-corpo">
            <div className="linha">
              <Campo label="Nome do tema" id="ft-t" className="f"><input id="ft-t" value={T.t} onChange={(e) => setT({ ...T, t: e.target.value })} /></Campo>
              <Campo label="Quem conta" id="ft-q"><SelPers id="ft-q" pers={pers} valor={T.q} onChange={(v) => setT({ ...T, q: v })} soPrincipais /></Campo>
              <Campo label="Cor do cartão" id="ft-c"><select id="ft-c" value={T.cls} onChange={(e) => setT({ ...T, cls: e.target.value })}>{TEMAS_COR.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></Campo>
              <div className="grupo-ic" style={{ paddingBottom: 4 }}>
                <button className="btn-ic" disabled={ti === 0} onClick={() => { set(mover(temas, ti, -1)); setTi(ti - 1); }} aria-label="Mover tema para a esquerda"><ArrowLeft size={16} /></button>
                <button className="btn-ic" disabled={ti === temas.length - 1} onClick={() => { set(mover(temas, ti, 1)); setTi(ti + 1); }} aria-label="Mover tema para a direita"><ArrowRight size={16} /></button>
                <button className="btn-ic perigo" onClick={apagarTema} aria-label="Apagar tema"><Trash2 size={16} /></button>
              </div>
            </div>
          </div></div>
          <div className="ferr" style={{ margin: 0 }}>
            <Procura valor={filtro} set={setFiltro} rotulo="Procurar neste tema" />
            <span className="info">{T.f.length} factos</span>
          </div>
          <div className="cartao factos-l">
            {T.f.map((x, k) => (!f || x.toLowerCase().includes(f)) && (
              <div className="facto" key={k}>
                <span className="num">{k + 1}</span>
                <TextoAuto aria-label={'Facto ' + (k + 1)} value={x} onChange={(e) => setF(k, e.target.value)} />
                <span className="grupo-ic"><button className="btn-ic perigo" onClick={() => setT({ ...T, f: T.f.filter((_, j) => j !== k) })} aria-label={'Apagar facto ' + (k + 1)}><Trash2 size={15} /></button></span>
              </div>
            ))}
            {!T.f.length && <Vazio titulo="Sem factos" texto="Acrescenta factos curtos, fáceis de perceber por uma criança de 5 anos." />}
            <div className="cartao-rod" ref={fimRef}><button className="btn btn-sec peq" onClick={() => { setFiltro(''); setT({ ...T, f: [...T.f, ''] }); setTimeout(() => fimRef.current?.previousElementSibling?.querySelector('textarea')?.focus(), 30); }}><Plus size={14} />Novo facto</button></div>
          </div>
        </div>
      ) : <Vazio titulo="Sem temas" acao={<button className="btn btn-pri" onClick={novoTema}>Novo tema</button>} />}
    </>
  );
}

/* ---------- Cores ---------- */
export function Cores({ lista, set, pers }) {
  const [filtro, setFiltro] = useState('');
  const [cor, setCor] = useState('');
  const f = filtro.trim().toLowerCase();
  const visiveis = useMemo(() => lista.map((x, i) => [x, i]).filter(([x]) => (!f || x[1].toLowerCase().includes(f)) && (!cor || x[2] === cor)), [lista, f, cor]);
  const setL = (i, v) => { const l = lista.slice(); l[i] = v; set(l); };
  const porCor = useMemo(() => { const c = {}; lista.forEach((x) => (c[x[2]] = (c[x[2]] || 0) + 1)); return c; }, [lista]);
  return (
    <>
      <Cabecalho titulo="Perguntas de cores" texto={`${lista.length} perguntas «De que cor é…?». Cada jogo sorteia 10. A personagem escolhida faz a pergunta.`}>
        <button className="btn btn-pri" onClick={() => { set([['francisca', '', 'vermelho'], ...lista]); setFiltro(''); setCor(''); }}><Plus size={16} />Nova pergunta</button>
      </Cabecalho>
      <div className="ferr">
        <Procura valor={filtro} set={setFiltro} rotulo="Procurar coisa" />
        <select aria-label="Filtrar por cor" value={cor} onChange={(e) => setCor(e.target.value)} style={{ width: 180 }}>
          <option value="">Todas as cores</option>
          {Object.keys(CORES).map((c) => <option key={c} value={c}>{c} ({porCor[c] || 0})</option>)}
        </select>
        <span className="info">{visiveis.length} de {lista.length}</span>
      </div>
      <div className="tabela-w">
        <table className="tabela">
          <thead><tr><th>#</th><th>Quem pergunta</th><th style={{ width: '50%' }}>De que cor é…</th><th>Resposta</th><th><span className="sr">Ações</span></th></tr></thead>
          <tbody>
            {visiveis.map(([x, i]) => (
              <tr key={i}>
                <td className="min num">{i + 1}</td>
                <td className="min"><div className="linha c" style={{ gap: 8, flexWrap: 'nowrap' }}><Avatar src={pers.find((p) => p.id === x[0])?.img} tam={24} /><SelPers aria-label="Quem pergunta" pers={pers} valor={x[0]} onChange={(v) => setL(i, [v, x[1], x[2]])} soPrincipais style={{ width: 150 }} /></div></td>
                <td><input aria-label="Coisa" placeholder="o lenço do Balu" value={x[1]} onChange={(e) => setL(i, [x[0], e.target.value, x[2]])} /></td>
                <td className="min"><div className="linha c" style={{ gap: 8, flexWrap: 'nowrap' }}><span className="amostra" style={{ background: CORES[x[2]] }} /><select aria-label="Cor certa" value={x[2]} onChange={(e) => setL(i, [x[0], x[1], e.target.value])} style={{ width: 140 }}>{Object.keys(CORES).map((c) => <option key={c}>{c}</option>)}</select></div></td>
                <td className="min"><button className="btn-ic perigo" onClick={() => set(lista.filter((_, k) => k !== i))} aria-label={'Apagar pergunta ' + (i + 1)}><Trash2 size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visiveis.length && <Vazio titulo="Nada encontrado" texto="Experimenta outra palavra ou outra cor." />}
      </div>
    </>
  );
}

/* ---------- Quem é? ---------- */
export function Quem({ frases, adivinhas, setF, setA, pers }) {
  const [aba, setAba] = useState('frases');
  const [filtro, setFiltro] = useState('');
  const f = filtro.trim().toLowerCase();
  const principais = pers.filter((p) => !p.extra);
  const nPistas = Object.values(adivinhas).reduce((a, l) => a + l.length, 0);
  return (
    <>
      <Cabecalho titulo="Quem é?" texto="Frases para o jogo «Quem disse?» e pistas para as adivinhas. A voz lê, a Francisca escolhe o retrato." />
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={aba === 'frases'} onClick={() => setAba('frases')}>Quem disse? <span className="cont">{frases.length}</span></button>
        <button role="tab" aria-selected={aba === 'adiv'} onClick={() => setAba('adiv')}>Adivinhas <span className="cont">{nPistas}</span></button>
      </div>
      {aba === 'frases' ? (
        <>
          <div className="ferr">
            <Procura valor={filtro} set={setFiltro} rotulo="Procurar frase" />
            <span className="info">{frases.length} frases</span>
            <button className="btn btn-sec" onClick={() => { setF([['francisca', ''], ...frases]); setFiltro(''); }}><Plus size={16} />Nova frase</button>
          </div>
          <div className="tabela-w">
            <table className="tabela">
              <thead><tr><th>Quem disse</th><th style={{ width: '100%' }}>Frase</th><th><span className="sr">Ações</span></th></tr></thead>
              <tbody>{frases.map((x, i) => (!f || x[1].toLowerCase().includes(f)) && (
                <tr key={i}>
                  <td className="min"><div className="linha c" style={{ gap: 8, flexWrap: 'nowrap' }}><Avatar src={pers.find((p) => p.id === x[0])?.img} tam={24} /><SelPers aria-label="Quem disse" pers={pers} valor={x[0]} onChange={(v) => { const l = frases.slice(); l[i] = [v, x[1]]; setF(l); }} soPrincipais style={{ width: 150 }} /></div></td>
                  <td><input aria-label="Frase" value={x[1]} onChange={(e) => { const l = frases.slice(); l[i] = [x[0], e.target.value]; setF(l); }} /></td>
                  <td className="min"><button className="btn-ic perigo" onClick={() => setF(frases.filter((_, k) => k !== i))} aria-label="Apagar frase"><Trash2 size={15} /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="grelha-c">
          {principais.map((p) => {
            const l = adivinhas[p.id] || [];
            const setL = (nl) => { const n = { ...adivinhas }; if (nl.length) n[p.id] = nl; else delete n[p.id]; setA(n); };
            return (
              <div className="cartao" key={p.id}>
                <div className="cartao-cab"><Avatar src={p.img} tam={28} /><h2>{p.nome}</h2><span className="etq">{l.length} pistas</span></div>
                <div className="cartao-corpo" style={{ gap: 8 }}>
                  {l.map((x, k) => (
                    <div className="linha c" key={k} style={{ gap: 6, flexWrap: 'nowrap' }}>
                      <TextoAuto aria-label={'Pista ' + (k + 1) + ' de ' + p.nome} value={x} onChange={(e) => { const nl = l.slice(); nl[k] = e.target.value; setL(nl); }} />
                      <button className="btn-ic perigo" onClick={() => setL(l.filter((_, j) => j !== k))} aria-label="Apagar pista"><Trash2 size={15} /></button>
                    </div>
                  ))}
                  <button className="btn btn-fan peq" style={{ alignSelf: 'flex-start' }} onClick={() => setL([...l, ''])}><Plus size={14} />Pista</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ---------- E se…? ---------- */
export function Situacoes({ lista, set, pers, confirmar }) {
  const setS = (i, s) => { const l = lista.slice(); l[i] = s; set(l); };
  const setO = (i, k, pos, v) => { const s = lista[i]; const ops = s.ops.slice(); const o = ops[k].slice(); o[pos] = v; ops[k] = o; setS(i, { ...s, ops }); };
  return (
    <>
      <Cabecalho titulo="E se…?" texto="Situações do dia a dia com duas respostas, uma boa e uma menos boa. Cada jogo mostra 5 ao calhas.">
        <button className="btn btn-pri" onClick={() => set([...lista, { q: 'francisca', t: 'Nova situação?', ops: [['Resposta boa', 'smile', 1, 'Muito bem!'], ['Resposta menos boa', 'x', 0, 'Hmm, e se tentasses outra coisa?']] }])}><Plus size={16} />Nova situação</button>
      </Cabecalho>
      <div className="pilha">
        {lista.map((s, i) => (
          <div className="cartao" key={i}>
            <div className="cartao-cab">
              <Avatar src={pers.find((p) => p.id === s.q)?.img} tam={28} />
              <SelPers aria-label="Personagem" pers={pers} valor={s.q} onChange={(v) => setS(i, { ...s, q: v })} soPrincipais className="peq" style={{ width: 160 }} />
              <span style={{ flex: 1 }} />
              <button className="btn-ic perigo" onClick={async () => { if (await confirmar({ titulo: 'Apagar situação', texto: 'Esta situação vai ser apagada.', confirmar: 'Apagar', perigo: true })) set(lista.filter((_, k) => k !== i)); }} aria-label="Apagar situação"><Trash2 size={15} /></button>
            </div>
            <div className="cartao-corpo">
              <Campo label="Situação (dita pela voz)" id={'s-' + i}><TextoAuto id={'s-' + i} value={s.t} onChange={(e) => setS(i, { ...s, t: e.target.value })} /></Campo>
              {s.ops.map((o, k) => (
                <div className="sit-op" key={k}>
                  <Interruptor id={'so-' + i + k} checked={!!o[2]} onChange={(v) => setO(i, k, 2, v ? 1 : 0)} label={o[2] ? 'Boa' : 'Menos boa'} />
                  <input aria-label="Resposta" value={o[0]} onChange={(e) => setO(i, k, 0, e.target.value)} />
                  <select aria-label="Ícone" value={o[1]} onChange={(e) => setO(i, k, 1, e.target.value)}>{ICONES.map((n) => <option key={n}>{n}</option>)}</select>
                  <input aria-label="O que a personagem responde" placeholder="O que a personagem responde" value={o[3] || ''} onChange={(e) => setO(i, k, 3, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Músicas ---------- */
export function Musicas({ lista, set, pers, avisar, confirmar }) {
  const [aEnviar, setAEnviar] = useState(null);
  const setM = (i, m) => { const l = lista.slice(); l[i] = m; set(l); };
  async function enviar(i, f) {
    if (!f) return;
    setAEnviar(i == null ? 'novo' : i);
    try {
      const dur = await new Promise((res) => { const a = new Audio(); a.preload = 'metadata'; a.onloadedmetadata = () => res(Math.round(a.duration || 0)); a.onerror = () => res(0); a.src = URL.createObjectURL(f); });
      const url = await enviarFicheiro(f, 'musicas');
      const base = i == null ? { id: 'm' + Date.now(), t: f.name.replace(/\.\w+$/, ''), a: 'Amigos do Arco-Íris', capa: 'francisca' } : lista[i];
      const m = { ...base, src: url, dur };
      if (i == null) set([...lista, m]); else setM(i, m);
      avisar('Música enviada. Guarda para publicar.');
    } catch (e) { avisar(e.message, 'erro'); }
    setAEnviar(null);
  }
  async function capa(i, f) {
    if (!f) return;
    setAEnviar('capa' + i);
    try { const url = await enviarFicheiro(f, 'musicas', 800); setM(i, { ...lista[i], img: url }); avisar('Capa enviada. Guarda para publicar.'); }
    catch (e) { avisar(e.message, 'erro'); }
    setAEnviar(null);
  }
  const mmss = (s) => (s ? Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') : '');
  return (
    <>
      <Cabecalho titulo="Músicas" texto="O leitor de músicas da app. Envia ficheiros MP3 ou M4A. Para a capa, escolhe uma personagem ou carrega na imagem para enviar uma tua. As faixas «demo» tocam uma melodia simples até lhes juntares um ficheiro.">
        <label className="btn btn-pri">{aEnviar === 'novo' ? <LoaderCircle size={16} className="gira" /> : <Upload size={16} />}Enviar música<input type="file" accept="audio/*" onChange={(e) => { enviar(null, e.target.files[0]); e.target.value = ''; }} /></label>
      </Cabecalho>
      <div className="cartao">
        {lista.map((m, i) => (
          <div className="faixa-m" key={m.id || i}>
            <span className="num">{i + 1}</span>
            <label className="capa-m" title="Enviar uma imagem de capa">
              <img src={m.img || pers.find((p) => p.id === m.capa)?.img} alt="" />
              <span>{aEnviar === 'capa' + i ? <LoaderCircle size={16} className="gira" /> : <Camera size={16} />}</span>
              <input type="file" accept="image/*" aria-label={'Enviar capa para ' + m.t} onChange={(e) => { capa(i, e.target.files[0]); e.target.value = ''; }} />
            </label>
            <div className="campos">
              <input aria-label="Título" value={m.t} onChange={(e) => setM(i, { ...m, t: e.target.value })} style={{ fontWeight: 500 }} />
              <input aria-label="Artista" value={m.a || ''} onChange={(e) => setM(i, { ...m, a: e.target.value })} />
              <select aria-label="Capa" value={m.img ? '__img' : m.capa || ''} onChange={(e) => { const v = e.target.value; if (v === '__img') return; const n = { ...m, capa: v }; delete n.img; setM(i, n); }}>
                {m.img && <option value="__img">Imagem própria</option>}
                {pers.filter((p) => !p.extra).map((p) => <option key={p.id} value={p.id}>Capa: {p.nome}</option>)}
              </select>
            </div>
            <div className="dir">
              {m.src ? <audio controls preload="none" src={m.src} /> : <span className="etq aviso"><Music size={12} />Demo</span>}
              {m.dur ? <span className="num" style={{ fontSize: 12, color: 'var(--mute)' }}>{mmss(m.dur)}</span> : null}
              <label className="btn btn-sec peq">{aEnviar === i ? <LoaderCircle size={14} className="gira" /> : <Upload size={14} />}{m.src ? 'Trocar' : 'Juntar ficheiro'}<input type="file" accept="audio/*" onChange={(e) => { enviar(i, e.target.files[0]); e.target.value = ''; }} /></label>
              <span className="grupo-ic">
                <button className="btn-ic" disabled={i === 0} onClick={() => set(mover(lista, i, -1))} aria-label="Subir"><ArrowUp size={15} /></button>
                <button className="btn-ic" disabled={i === lista.length - 1} onClick={() => set(mover(lista, i, 1))} aria-label="Descer"><ArrowDown size={15} /></button>
                <button className="btn-ic perigo" onClick={async () => { if (await confirmar({ titulo: 'Apagar música', texto: `«${m.t}» sai do leitor.`, confirmar: 'Apagar', perigo: true })) set(lista.filter((_, k) => k !== i)); }} aria-label={'Apagar ' + m.t}><Trash2 size={15} /></button>
              </span>
            </div>
          </div>
        ))}
        {!lista.length && <Vazio titulo="Ainda não há músicas" texto="Envia o primeiro ficheiro de áudio." />}
      </div>
    </>
  );
}
