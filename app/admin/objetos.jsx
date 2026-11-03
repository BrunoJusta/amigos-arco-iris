'use client';
import { useMemo, useState } from 'react';
import { ImagePlus, LoaderCircle, SlidersHorizontal, Undo2, RotateCcw } from 'lucide-react';
import { OBJETOS_BASE, EFEITOS } from '@/motor/cenas';
import { Campo, Dialogo, Interruptor, Svg, enviarFicheiro } from './ui';

const vazio = (a) => a === undefined || a === null || a === '';
const nomeEfeito = (e) => EFEITOS.find((x) => x[0] === e)?.[1] || e;

/* Objetos que aparecem por cima dos cenários: imagem própria, posição, tamanho e efeito */
export default function Objetos({ objetos, set, balde, setBalde, livros, cenarios, cena, avisar, confirmar }) {
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
          const mexido = !vazio(c.x) || !vazio(c.y) || !vazio(c.w) || !vazio(c.efeito) || !vazio(c.sombra);
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
      {aAjustar && <Ajustar o={OBJETOS_BASE.find((x) => x.id === aAjustar)} c={cfg(aAjustar)} mudar={(campos) => mudar(aAjustar, campos)} cenarios={cenarios} previa={previa} onFechar={() => setAAjustar(null)} />}
    </>
  );
}

function Ajustar({ o, c, mudar, cenarios, previa, onFechar }) {
  const [cenaP, setCenaP] = useState(o.cena);
  const auto = vazio(c.x) && vazio(c.y);
  const w = vazio(c.w) ? o.w : +c.w;
  const ef = c.efeito || o.efeito;
  const sombra = vazio(c.sombra) ? !!o.sombra : !!c.sombra;
  const html = previa(o, { cena: cenaP });

  function clicar(e) {
    if (o.varios) return;
    const r = e.currentTarget.getBoundingClientRect();
    // a pré-visualização tem a mesma proporção do cenário (400 × 250)
    const x = Math.round(((e.clientX - r.left) / r.width) * 400);
    const y = Math.round(((e.clientY - r.top) / r.height) * 250);
    mudar({ x: Math.max(0, Math.min(400, x)), y: Math.max(0, Math.min(250, y)) });
  }
  return (
    <Dialogo titulo={'Ajustar · ' + o.nome} onFechar={onFechar} largo>
      <div className="dl-corpo">
        <div className={'ajustar-vis' + (o.varios ? '' : ' clica')} onClick={clicar} title={o.varios ? '' : 'Clica para pôr o objeto aqui'}>
          <Svg html={html} />
        </div>
        {!o.varios && <small className="ajuda-c">Clica na imagem para pôr o objeto nesse sítio. O ponto onde clicas é onde ele assenta.</small>}
        <div className="grelha-2">
          <Campo label="Ver no cenário" id="aj-cena">
            <select id="aj-cena" value={cenaP} onChange={(e) => setCenaP(e.target.value)}>{cenarios.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}</select>
          </Campo>
          <Campo label="Efeito" id="aj-ef">
            <select id="aj-ef" value={ef} onChange={(e) => mudar({ efeito: e.target.value === o.efeito ? '' : e.target.value })}>{EFEITOS.map(([k, t]) => <option key={k} value={k}>{t}{k === o.efeito ? ' (original)' : ''}</option>)}</select>
          </Campo>
        </div>
        <Campo label={`Tamanho · ${w}`} id="aj-w">
          <input id="aj-w" type="range" min={o.varios ? 6 : 12} max={o.varios ? 80 : 400} value={w} onChange={(e) => mudar({ w: +e.target.value === o.w ? '' : +e.target.value })} />
        </Campo>
        {!o.varios && (
          <>
            <Interruptor id="aj-auto" checked={auto} onChange={(v) => mudar(v ? { x: '', y: '' } : { x: 200, y: 200 })} label="Sítio original em cada cenário" />
            {!auto && (
              <div className="grelha-2">
                <Campo label={`Horizontal · ${c.x ?? ''}`} id="aj-x"><input id="aj-x" type="range" min="0" max="400" value={c.x ?? 200} onChange={(e) => mudar({ x: +e.target.value, y: c.y ?? 200 })} /></Campo>
                <Campo label={`Vertical · ${c.y ?? ''}`} id="aj-y"><input id="aj-y" type="range" min="0" max="250" value={c.y ?? 200} onChange={(e) => mudar({ y: +e.target.value, x: c.x ?? 200 })} /></Campo>
              </div>
            )}
            <Interruptor id="aj-sombra" checked={sombra} onChange={(v) => mudar({ sombra: v === !!o.sombra ? '' : v ? 1 : 0 })} label="Sombra no chão" />
          </>
        )}
      </div>
      <div className="dl-acoes">
        <button className="btn btn-fan" style={{ marginRight: 'auto' }} onClick={() => mudar({ x: '', y: '', w: '', efeito: '', sombra: '' })}><RotateCcw size={14} />Repor original</button>
        <button className="btn btn-pri" onClick={onFechar}>Concluir</button>
      </div>
    </Dialogo>
  );
}
