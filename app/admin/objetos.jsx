'use client';
import { useMemo, useState } from 'react';
import { ImagePlus, LoaderCircle, SlidersHorizontal, Undo2, RotateCcw } from 'lucide-react';
import { OBJETOS_BASE, EFEITOS, DESENHOS, DESENHOS_PERGUNTAS } from '@/motor/cenas';
import { Campo, Dialogo, Interruptor, Svg, enviarFicheiro } from './ui';

const vazio = (a) => a === undefined || a === null || a === '';
const nomeEfeito = (e) => EFEITOS.find((x) => x[0] === e)?.[1] || e;

/* Objetos que aparecem por cima dos cenários: imagem própria, posição, tamanho e efeito */
export default function Objetos({ objetos, set, desenhos, setDesenhos, balde, setBalde, livros, cenarios, cena, avisar, confirmar }) {
  const [aEnviar, setAEnviar] = useState(null);
  const [aAjustar, setAAjustar] = useState(null);
  const [sobre, setSobre] = useState(null);

  const usos = useMemo(() => {
    const u = {};
    (livros || []).forEach((l) => (l.pags || []).forEach((p) => {
      if (p.b) u.balde = (u.balde || 0) + 1;
      Object.keys(p.o || {}).forEach((k) => (u[k] = (u[k] || 0) + 1));
    }));
    return u;
  }, [livros]);

  const cfg = (id) => objetos[id] || {};
  const imgDe = (id) => cfg(id).img || (id === 'balde' ? balde : '');
  function mudar(id, campos) {
    const n = { ...cfg(id), ...campos };
    Object.keys(n).forEach((k) => { if (vazio(n[k])) delete n[k]; });
    const todos = { ...objetos };
    if (Object.keys(n).length) todos[id] = n; else delete todos[id];
    set(todos);
  }
  async function enviar(id, f) {
    if (!f) return;
    if (f.type !== 'image/png' && f.type !== 'image/webp') { avisar('Usa um PNG com fundo transparente, para o objeto assentar bem no cenário.', 'erro'); return; }
    setAEnviar(id);
    try {
      const url = await enviarFicheiro(f, 'imagens', 800);
      mudar(id, { img: url });
      if (id === 'balde' && balde) setBalde('');
      avisar('Imagem enviada. Guarda para publicar.');
    } catch (e) { avisar(e.message, 'erro'); }
    setAEnviar(null);
  }
  async function usarDesenho(o) {
    if (!(await confirmar({ titulo: 'Voltar ao desenho', texto: `${o.nome} volta a usar o desenho original da app. A posição, o tamanho e o efeito mantêm-se.`, confirmar: 'Usar desenho' }))) return;
    mudar(o.id, { img: '' });
    if (o.id === 'balde' && balde) setBalde('');
  }
  const previa = (o, extra = {}) => {
    const flags = o.id === 'balde' ? { balde: 1 } : { [o.id]: o.id === 'borboletas' ? o.n || 6 : 1 };
    return cena(extra.cena || o.cena, extra.quem || o.quem || [], flags);
  };

  return (
    <>
      <div className="cab"><div><h1>Objetos</h1><p>O balde, o mapa, a Luz e os outros objetos que aparecem por cima dos cenários. Podes trocar cada desenho por um PNG teu e escolher onde aparece, o tamanho e o efeito. As alterações valem para todas as páginas.</p></div></div>
      <div className="grelha-c">
        {OBJETOS_BASE.map((o) => {
          const c = cfg(o.id), img = imgDe(o.id), ef = c.efeito || o.efeito, n = usos[o.id] || 0;
          const mexido = !vazio(c.x) || !vazio(c.y) || !vazio(c.w) || !vazio(c.efeito) || !vazio(c.sombra) || !vazio(c.pos);
          return (
            <div className="cartao c-cen" key={o.id}>
              <div className={'vis' + (sobre === o.id ? ' solta' : '')}
                onDragOver={(e) => { e.preventDefault(); setSobre(o.id); }} onDragLeave={() => setSobre(null)}
                onDrop={(e) => { e.preventDefault(); setSobre(null); enviar(o.id, e.dataTransfer.files[0]); }}>
                <Svg html={previa(o)} />
                <span className={'etq' + (img ? ' azul' : '')}>{aEnviar === o.id ? 'A enviar…' : img ? 'Imagem' : 'Desenho'}</span>
              </div>
              <div className="info">
                <b style={{ fontWeight: 500 }}>{o.nome}</b>
                <div className="meta">
                  <span>{nomeEfeito(ef)}{mexido ? ' · ajustado' : ''}</span><span className="esp" />
                  <span className={'etq' + (n ? '' : ' aviso')}>{n ? `${n} pág.` : 'Sem uso'}</span>
                </div>
              </div>
              <div className="acoes-c">
                <label className="btn btn-sec peq">{aEnviar === o.id ? <LoaderCircle size={14} className="gira" /> : <ImagePlus size={14} />}{img ? 'Trocar PNG' : 'Enviar PNG'}
                  <input type="file" accept="image/png,image/webp" onChange={(e) => { enviar(o.id, e.target.files[0]); e.target.value = ''; }} />
                </label>
                <button className="btn btn-sec peq" onClick={() => setAAjustar(o.id)}><SlidersHorizontal size={14} />Ajustar</button>
                {img && <button className="btn-ic" title="Usar desenho" aria-label={'Usar o desenho de ' + o.nome} onClick={() => usarDesenho(o)}><Undo2 size={15} /></button>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="ajuda-c" style={{ marginTop: 16 }}>Usa PNG com fundo transparente, de preferência quadrado (por exemplo 600 × 600), com o objeto a tocar no fundo da imagem para assentar bem no chão. Podes arrastar o ficheiro para cima do cartão.</p>
      <DesenhosPerguntas desenhos={desenhos} set={setDesenhos} livros={livros} avisar={avisar} confirmar={confirmar} />
      {aAjustar && <Ajustar o={OBJETOS_BASE.find((x) => x.id === aAjustar)} c={cfg(aAjustar)} mudar={(campos) => mudar(aAjustar, campos)} cenarios={cenarios} previa={previa} onFechar={() => setAAjustar(null)} />}
    </>
  );
}

function Ajustar({ o, c, mudar, cenarios, previa, onFechar }) {
  const [cenaP, setCenaP] = useState(o.cena);
  const [ambito, setAmbito] = useState('cena');
  const pos = c.pos || {};
  const local = pos[cenaP] || {};
  const nomeCena = (id) => cenarios.find((x) => x.id === id)?.nome || id;
  // valores efetivos neste cenário
  const ef = c.efeito || o.efeito;
  const sombra = vazio(c.sombra) ? !!o.sombra : !!c.sombra;
  const atual = ambito === 'cena' ? local : c;
  const wGeral = vazio(c.w) ? o.w : +c.w;
  const w = ambito === 'cena' && !vazio(local.w) ? +local.w : wGeral;
  const auto = vazio(atual.x) && vazio(atual.y);
  const html = previa(o, { cena: cenaP });

  function mudarPos(campos) {
    if (ambito === 'todos') { mudar(campos); return; }
    const n = { ...local, ...campos };
    Object.keys(n).forEach((k) => { if (vazio(n[k])) delete n[k]; });
    const p = { ...pos };
    if (Object.keys(n).length) p[cenaP] = n; else delete p[cenaP];
    mudar({ pos: Object.keys(p).length ? p : '' });
  }
  function tirarCena(id) { const p = { ...pos }; delete p[id]; mudar({ pos: Object.keys(p).length ? p : '' }); }
  function clicar(e) {
    if (o.varios) return;
    const r = e.currentTarget.getBoundingClientRect();
    // a pré-visualização tem a mesma proporção do cenário (400 × 250)
    const x = Math.round(((e.clientX - r.left) / r.width) * 400);
    const y = Math.round(((e.clientY - r.top) / r.height) * 250);
    mudarPos({ x: Math.max(0, Math.min(400, x)), y: Math.max(0, Math.min(250, y)) });
  }
  const proprios = Object.keys(pos);
  return (
    <Dialogo titulo={'Ajustar · ' + o.nome} onFechar={onFechar} largo>
      <div className="dl-corpo">
        <div className="linha c">
          <Campo label="Ver no cenário" id="aj-cena" className="f">
            <select id="aj-cena" value={cenaP} onChange={(e) => setCenaP(e.target.value)}>{cenarios.map((x) => <option key={x.id} value={x.id}>{x.nome}{pos[x.id] ? ' · posição própria' : ''}</option>)}</select>
          </Campo>
          {!o.varios && (
            <div className="campo">
              <span className="rotulo">Aplicar posição e tamanho</span>
              <div className="seg" role="group" aria-label="Onde aplicar">
                <button aria-pressed={ambito === 'cena'} onClick={() => setAmbito('cena')}>Só neste cenário</button>
                <button aria-pressed={ambito === 'todos'} onClick={() => setAmbito('todos')}>Em todos</button>
              </div>
            </div>
          )}
        </div>
        <div className={'ajustar-vis' + (o.varios ? '' : ' clica')} onClick={clicar} title={o.varios ? '' : 'Clica para pôr o objeto aqui'}>
          <Svg html={html} />
        </div>
        {!o.varios && <small className="ajuda-c">Clica na imagem para pôr o objeto nesse sítio: o ponto onde clicas é onde ele assenta. {ambito === 'cena' ? `Fica guardado só para «${nomeCena(cenaP)}», útil quando o cenário tem imagem própria.` : 'Vale para todos os cenários que não tenham posição própria.'}</small>}
        <div className="grelha-2">
          <Campo label={`Tamanho · ${w}`} id="aj-w">
            <input id="aj-w" type="range" min={o.varios ? 6 : 12} max={o.varios ? 80 : 400} value={w}
              onChange={(e) => (o.varios || ambito === 'todos' ? mudar({ w: +e.target.value === o.w ? '' : +e.target.value }) : mudarPos({ w: +e.target.value === wGeral ? '' : +e.target.value }))} />
          </Campo>
          <Campo label="Efeito" id="aj-ef">
            <select id="aj-ef" value={ef} onChange={(e) => mudar({ efeito: e.target.value === o.efeito ? '' : e.target.value })}>{EFEITOS.map(([k, t]) => <option key={k} value={k}>{t}{k === o.efeito ? ' (original)' : ''}</option>)}</select>
          </Campo>
        </div>
        {!o.varios && (
          <>
            <Interruptor id="aj-auto" checked={auto} onChange={(v) => mudarPos(v ? { x: '', y: '' } : { x: 200, y: 200 })} label={ambito === 'cena' ? 'Usar a posição geral neste cenário' : 'Sítio original em cada cenário'} />
            {!auto && (
              <div className="grelha-2">
                <Campo label={`Horizontal · ${atual.x ?? ''}`} id="aj-x"><input id="aj-x" type="range" min="0" max="400" value={atual.x ?? 200} onChange={(e) => mudarPos({ x: +e.target.value, y: atual.y ?? 200 })} /></Campo>
                <Campo label={`Vertical · ${atual.y ?? ''}`} id="aj-y"><input id="aj-y" type="range" min="0" max="250" value={atual.y ?? 200} onChange={(e) => mudarPos({ y: +e.target.value, x: atual.x ?? 200 })} /></Campo>
              </div>
            )}
            <Interruptor id="aj-sombra" checked={sombra} onChange={(v) => mudar({ sombra: v === !!o.sombra ? '' : v ? 1 : 0 })} label="Sombra no chão" />
            {proprios.length > 0 && (
              <div className="campo">
                <span className="rotulo">Cenários com posição própria</span>
                <div className="chips">{proprios.map((id) => (
                  <span key={id} className="chip sem-av" style={{ gap: 4, paddingRight: 4 }}>
                    <button className="btn-fan" style={{ border: 0, background: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setCenaP(id)}>{nomeCena(id)}</button>
                    <button className="btn-ic" style={{ width: 22, height: 22 }} onClick={() => tirarCena(id)} aria-label={'Tirar a posição própria de ' + nomeCena(id)}>×</button>
                  </span>
                ))}</div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="dl-acoes">
        <button className="btn btn-fan" style={{ marginRight: 'auto' }} onClick={() => mudar({ x: '', y: '', w: '', efeito: '', sombra: '', pos: '' })}><RotateCcw size={14} />Repor original</button>
        <button className="btn btn-pri" onClick={onFechar}>Concluir</button>
      </div>
    </Dialogo>
  );
}

/* Desenhos que só aparecem nas respostas das perguntas */
function DesenhosPerguntas({ desenhos, set, livros, avisar, confirmar }) {
  const [aEnviar, setAEnviar] = useState(null);
  const [sobre, setSobre] = useState(null);
  const usos = useMemo(() => {
    const u = {};
    (livros || []).forEach((l) => (l.perg || []).forEach((q) => q.ops.forEach((op) => { if (op.svg) u[op.svg] = (u[op.svg] || 0) + 1; })));
    return u;
  }, [livros]);
  const mudar = (k, url) => { const n = { ...desenhos }; if (url) n[k] = url; else delete n[k]; set(n); };
  async function enviar(k, f) {
    if (!f) return;
    if (f.type !== 'image/png' && f.type !== 'image/webp') { avisar('Usa um PNG com fundo transparente.', 'erro'); return; }
    setAEnviar(k);
    try { mudar(k, await enviarFicheiro(f, 'imagens', 600)); avisar('Imagem enviada. Guarda para publicar.'); }
    catch (e) { avisar(e.message, 'erro'); }
    setAEnviar(null);
  }
  return (
    <>
      <div className="cab" style={{ marginTop: 40 }}><div><h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.02em' }}>Só nas perguntas</h2><p>Desenhos que aparecem como respostas nas perguntas do fim dos livros. O balde, a mota, o mapa, a lanterna, a borboleta, a escama e o arco-íris usam a imagem do objeto lá em cima.</p></div></div>
      <div className="grelha-c">
        {DESENHOS_PERGUNTAS.map(([k, nome]) => {
          const img = desenhos[k], n = usos[k] || 0;
          return (
            <div className="cartao c-cen" key={k}>
              <div className={'vis vis-des' + (sobre === k ? ' solta' : '')}
                onDragOver={(e) => { e.preventDefault(); setSobre(k); }} onDragLeave={() => setSobre(null)}
                onDrop={(e) => { e.preventDefault(); setSobre(null); enviar(k, e.dataTransfer.files[0]); }}>
                {img ? <img src={img} alt="" /> : <Svg html={DESENHOS[k] || ''} />}
                <span className={'etq' + (img ? ' azul' : '')}>{aEnviar === k ? 'A enviar…' : img ? 'Imagem' : 'Desenho'}</span>
              </div>
              <div className="info">
                <b style={{ fontWeight: 500 }}>{nome}</b>
                <div className="meta"><span className="mono">{k}</span><span className="esp" /><span className={'etq' + (n ? '' : ' aviso')}>{n ? `${n} perg.` : 'Sem uso'}</span></div>
              </div>
              <div className="acoes-c">
                <label className="btn btn-sec peq">{aEnviar === k ? <LoaderCircle size={14} className="gira" /> : <ImagePlus size={14} />}{img ? 'Trocar PNG' : 'Enviar PNG'}
                  <input type="file" accept="image/png,image/webp" onChange={(e) => { enviar(k, e.target.files[0]); e.target.value = ''; }} />
                </label>
                {img && <button className="btn btn-fan peq" onClick={async () => { if (await confirmar({ titulo: 'Voltar ao desenho', texto: `${nome} volta a usar o desenho original da app.`, confirmar: 'Usar desenho' })) mudar(k, ''); }}><Undo2 size={14} />Usar desenho</button>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
