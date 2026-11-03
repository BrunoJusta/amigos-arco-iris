'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, BookOpen, Users, Mountain, Sparkles, Lightbulb, Palette, MessageCircleQuestion, HeartHandshake, Music, KeyRound,
  ExternalLink, LogOut, Menu, Check, TriangleAlert, CircleCheck, CircleX, Info, X, LoaderCircle, RotateCcw, ChevronRight,
} from 'lucide-react';
import { criarCena, BALDE_SVG, DESENHO_OBJETO } from '@/motor/cenas';
import { api, useAvisos, useConfirmar, Campo, Vazio } from './ui';
import Livros from './livros';
import Objetos from './objetos';
import { Personagens, Cenarios, Factos, Cores, Quem, Situacoes, Musicas } from './seccoes';

const MENU = [
  { grupo: 'Geral', itens: [{ id: 'resumo', t: 'Resumo', I: LayoutDashboard }] },
  { grupo: 'Conteúdo', itens: [
    { id: 'livros', t: 'Livros', I: BookOpen, k: ['livros'] },
    { id: 'personagens', t: 'Personagens', I: Users, k: ['personagens'] },
    { id: 'cenarios', t: 'Cenários', I: Mountain, k: ['cenarios'] },
    { id: 'objetos', t: 'Objetos', I: Sparkles, k: ['objetos', 'balde', 'desenhos'] },
  ] },
  { grupo: 'Aprender e jogar', itens: [
    { id: 'factos', t: 'Sabias que', I: Lightbulb, k: ['factos'] },
    { id: 'cores', t: 'Cores', I: Palette, k: ['cores'] },
    { id: 'quem', t: 'Quem é?', I: MessageCircleQuestion, k: ['frases', 'adivinhas'] },
    { id: 'situacoes', t: 'E se…?', I: HeartHandshake, k: ['situacoes'] },
    { id: 'musicas', t: 'Músicas', I: Music, k: ['musicas'] },
  ] },
  { grupo: 'Administração', itens: [{ id: 'contas', t: 'Contas', I: KeyRound }] },
];
const ITENS = MENU.flatMap((g) => g.itens);
const NOMES_K = { livros: 'Livros', personagens: 'Personagens', cenarios: 'Cenários', balde: 'Balde', objetos: 'Objetos', desenhos: 'Desenhos das perguntas', factos: 'Sabias que', cores: 'Cores', frases: 'Frases', adivinhas: 'Adivinhas', situacoes: 'E se…?', musicas: 'Músicas' };

export default function Painel() {
  const [estado, setEstado] = useState(null);
  const [conteudo, setConteudo] = useState(null);
  const [erroInicial, setErroInicial] = useState('');
  const [rascunho, setRascunho] = useState({});
  const [seccao, setSeccao] = useState('resumo');
  const [aGuardar, setAGuardar] = useState(false);
  const [menu, setMenu] = useState(false);
  const [avisar, avisos, fecharAviso] = useAvisos();
  const [confirmar, dialogo] = useConfirmar();

  useEffect(() => {
    try { const h = window.location.hash.slice(1); if (ITENS.some((i) => i.id === h)) setSeccao(h); } catch {}
    Promise.all([api('/api/admin/estado'), api('/api/admin/conteudo')])
      .then(([e, c]) => { setEstado(e); setConteudo(c); })
      .catch((e) => setErroInicial(e.message));
  }, []);

  const valor = useCallback((k) => (k in rascunho ? rascunho[k] : conteudo?.[k]), [rascunho, conteudo]);
  const mudar = useCallback((k, v) => setRascunho((r) => ({ ...r, [k]: v })), []);
  const pendentes = Object.keys(rascunho);
  const alterado = (it) => (it.k || []).some((k) => k in rascunho);

  const guardar = useCallback(async () => {
    const chaves = Object.keys(rascunho);
    if (!chaves.length || aGuardar) return;
    setAGuardar(true);
    try {
      for (const k of chaves) await api('/api/admin/conteudo', { method: 'PUT', body: JSON.stringify({ seccao: k, valor: rascunho[k] }) });
      setConteudo((c) => { const n = { ...c }; chaves.forEach((k) => (n[k] = rascunho[k])); n.atualizado = new Date().toISOString(); return n; });
      setRascunho({});
      avisar('Guardado. A app já mostra as alterações.');
    } catch (e) { avisar(e.message, 'erro'); }
    setAGuardar(false);
  }, [rascunho, aGuardar, avisar]);

  async function descartar() {
    if (!(await confirmar({ titulo: 'Descartar alterações', texto: 'Vais perder as alterações por guardar em: ' + pendentes.map((k) => NOMES_K[k] || k).join(', ') + '.', confirmar: 'Descartar', perigo: true }))) return;
    setRascunho({});
  }

  useEffect(() => {
    const tecla = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); guardar(); } };
    const sair = (e) => { if (Object.keys(rascunho).length) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('keydown', tecla); window.addEventListener('beforeunload', sair);
    return () => { window.removeEventListener('keydown', tecla); window.removeEventListener('beforeunload', sair); };
  }, [guardar, rascunho]);

  const pers = valor('personagens') || [];
  const cenarios = valor('cenarios') || [];
  const balde = valor('balde') || '';
  const objetos = valor('objetos') || {};
  const desenhos = valor('desenhos') || {};
  const cena = useMemo(() => {
    const IMG = {}, NOME = {};
    pers.forEach((p) => { IMG[p.id] = p.img; NOME[p.id] = p.nome; });
    const f = criarCena({ IMG, NOME, BALDE: BALDE_SVG, cenarios, baldeImg: balde, objetos });
    // imagem enviada para um desenho das perguntas (própria ou do objeto correspondente)
    f.imgDesenho = (k) => desenhos[k] || (DESENHO_OBJETO[k] ? (objetos[DESENHO_OBJETO[k]] || {}).img || (k === 'balde' ? balde : '') : '');
    return f;
  }, [pers, cenarios, balde, objetos, desenhos]);

  // Quando se junta um livro novo, junta também as personagens novas que ele usa (e as frases e pistas delas)
  function juntarPers(lista, ex) {
    mudar('personagens', [...pers, ...lista]);
    const ids = lista.map((x) => x.id);
    const fr = (ex.frases || []).filter((f) => ids.includes(f[0]));
    if (fr.length) mudar('frases', [...(valor('frases') || []), ...fr]);
    const ad = { ...(valor('adivinhas') || {}) }; let mudou = false;
    ids.forEach((id) => { if (ex.adivinhas?.[id] && !ad[id]) { ad[id] = ex.adivinhas[id]; mudou = true; } });
    if (mudou) mudar('adivinhas', ad);
    avisar('Também juntei ' + lista.map((x) => x.nome).join(', ') + ' às personagens.');
  }
  function irPara(s) { setSeccao(s); setMenu(false); try { history.replaceState(null, '', '#' + s); } catch {} window.scrollTo(0, 0); }
  async function sair() {
    if (pendentes.length && !(await confirmar({ titulo: 'Sair sem guardar?', texto: 'Tens alterações por guardar. Se saíres agora, perdes essas alterações.', confirmar: 'Sair', perigo: true }))) return;
    setRascunho({});
    await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/admin/login';
  }

  if (!conteudo) {
    return (
      <div className="bo carregar">
        {erroInicial ? <Vazio titulo="Não foi possível carregar o conteúdo" texto={erroInicial} acao={<button className="btn btn-sec" onClick={() => location.reload()}>Tentar outra vez</button>} /> : <span className="linha c"><LoaderCircle size={16} className="gira" />A carregar…</span>}
      </div>
    );
  }

  const atual = ITENS.find((i) => i.id === seccao);
  const comum = { pers, avisar, confirmar };
  const contagem = {
    livros: (valor('livros') || []).length, personagens: pers.length, cenarios: cenarios.length,
    factos: (valor('factos') || []).reduce((a, t) => a + (t.f || []).length, 0), cores: (valor('cores') || []).length,
    quem: (valor('frases') || []).length, situacoes: (valor('situacoes') || []).length, musicas: (valor('musicas') || []).length,
  };

  return (
    <div className="bo bo-app">
      <aside className={'bo-lat' + (menu ? ' aberta' : '')} aria-label="Navegação">
        <div className="bo-marca"><img src="/icon-192.png" alt="" width="28" height="28" /><div><b>Arco-Íris</b><small>Backoffice</small></div></div>
        {MENU.map((g) => (
          <div key={g.grupo}>
            <div className="bo-grupo">{g.grupo}</div>
            <nav className="bo-nav">{g.itens.map((it) => (
              <button key={it.id} aria-current={seccao === it.id ? 'page' : undefined} onClick={() => irPara(it.id)}>
                <it.I size={16} /><span className="rot">{it.t}</span>
                {alterado(it) ? <span className="ponto-a" title="Alterações por guardar" /> : contagem[it.id] != null && <span className="cont">{contagem[it.id]}</span>}
              </button>
            ))}</nav>
          </div>
        ))}
        <div className="bo-rod">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} />Abrir a app</a>
          <button onClick={sair}><LogOut size={16} />Terminar sessão</button>
          <span className="eu" title={estado?.email}>{estado?.email}</span>
        </div>
      </aside>
      {menu && <div className="bo-veu" onClick={() => setMenu(false)} />}

      <div className="bo-main">
        <header className="bo-topo">
          <button className="btn-ic bo-menu-b" onClick={() => setMenu(!menu)} aria-label="Abrir menu" aria-expanded={menu}><Menu size={18} /></button>
          <div className="migalhas"><span>{MENU.find((g) => g.itens.includes(atual))?.grupo}</span><ChevronRight size={14} /><b>{atual?.t}</b></div>
          <span className="esp" />
          <span className="estado-g" aria-live="polite">
            {aGuardar ? <><LoaderCircle size={14} className="gira" /><span className="txt">A guardar…</span></>
              : pendentes.length ? <><span className="ponto-a" /><span className="txt">{pendentes.length === 1 ? '1 secção por guardar' : pendentes.length + ' secções por guardar'}</span></>
                : <><Check size={14} className="ok-i" /><span className="txt">Tudo guardado</span></>}
          </span>
          {pendentes.length > 0 && <button className="btn btn-fan" onClick={descartar} disabled={aGuardar}>Descartar</button>}
          <button className="btn btn-pri" onClick={guardar} disabled={!pendentes.length || aGuardar || estado?.r2 === false} title={estado?.r2 === false ? 'O R2 não está configurado' : 'Guardar (Ctrl/⌘ + S)'}>Guardar <kbd>⌘S</kbd></button>
        </header>
        {estado?.r2 && estado.escrita && !estado.escrita.ok && <div className="faixa"><TriangleAlert size={16} /><span><b>O backoffice não consegue gravar no R2.</b> {estado.escrita.erro}</span></div>}
        {estado && !estado.r2 && <div className="faixa"><TriangleAlert size={16} /><span>O armazenamento R2 ainda não está configurado. Podes ver e experimentar o conteúdo, mas não guardar nem enviar ficheiros. Segue o README para configurar as variáveis de ambiente no Vercel.</span></div>}

        {seccao === 'livros' ? (
          <Livros livros={valor('livros') || []} set={(v) => mudar('livros', v)} juntarPers={juntarPers} cenarios={cenarios} cena={cena} irPara={irPara} {...comum} />
        ) : (
          <main className="bo-corpo">
            {seccao === 'resumo' && <Resumo c={conteudo} valor={valor} estado={estado} irPara={irPara} {...comum} aoRepor={(t) => setConteudo((c) => ({ ...c, reset: t }))} />}
            {seccao === 'personagens' && <Personagens lista={pers} set={(v) => mudar('personagens', v)} livros={valor('livros')} {...comum} />}
            {seccao === 'cenarios' && <Cenarios lista={cenarios} set={(v) => mudar('cenarios', v)} livros={valor('livros')} cena={cena} {...comum} />}
            {seccao === 'objetos' && <Objetos objetos={objetos} set={(v) => mudar('objetos', v)} desenhos={desenhos} setDesenhos={(v) => mudar('desenhos', v)} balde={balde} setBalde={(v) => mudar('balde', v)} livros={valor('livros')} cenarios={cenarios} cena={cena} {...comum} />}
            {seccao === 'factos' && <Factos temas={valor('factos') || []} set={(v) => mudar('factos', v)} {...comum} />}
            {seccao === 'cores' && <Cores lista={valor('cores') || []} set={(v) => mudar('cores', v)} {...comum} />}
            {seccao === 'quem' && <Quem frases={valor('frases') || []} adivinhas={valor('adivinhas') || {}} setF={(v) => mudar('frases', v)} setA={(v) => mudar('adivinhas', v)} {...comum} />}
            {seccao === 'situacoes' && <Situacoes lista={valor('situacoes') || []} set={(v) => mudar('situacoes', v)} {...comum} />}
            {seccao === 'musicas' && <Musicas lista={valor('musicas') || []} set={(v) => mudar('musicas', v)} {...comum} />}
            {seccao === 'contas' && <Contas {...comum} />}
          </main>
        )}
      </div>

      <div className="toasts" aria-live="polite">
        {avisos.map((a) => {
          const I = a.tipo === 'erro' ? CircleX : a.tipo === 'info' ? Info : CircleCheck;
          return <div key={a.id} className={'toast ' + a.tipo} role={a.tipo === 'erro' ? 'alert' : 'status'}><I size={16} /><p>{a.t}</p><button className="btn-ic" style={{ width: 20, height: 20 }} onClick={() => fecharAviso(a.id)} aria-label="Fechar aviso"><X size={14} /></button></div>;
        })}
      </div>
      {dialogo}
    </div>
  );
}

/* ---------- Resumo ---------- */
function Resumo({ c, valor, estado, irPara, avisar, confirmar, aoRepor }) {
  const [aRepor, setARepor] = useState(false);
  const livros = valor('livros') || [];
  const pags = livros.reduce((a, l) => a + (l.pags || []).length, 0);
  const perg = livros.reduce((a, l) => a + (l.perg || []).length, 0);
  const factos = valor('factos') || [];
  const cen = valor('cenarios') || [];
  const mus = valor('musicas') || [];
  const pers = valor('personagens') || [];
  const kpis = [
    ['livros', BookOpen, 'Livros', livros.length, `${pags} páginas · ${perg} perguntas`],
    ['personagens', Users, 'Personagens', pers.filter((p) => !p.extra).length, `${pers.filter((p) => p.extra).length} só voz`],
    ['cenarios', Mountain, 'Cenários', cen.length, `${cen.filter((x) => x.img).length} com imagem própria`],
    ['factos', Lightbulb, 'Factos', factos.reduce((a, t) => a + (t.f || []).length, 0), `${factos.length} temas`],
    ['cores', Palette, 'Perguntas de cores', (valor('cores') || []).length, '10 por jogo'],
    ['quem', MessageCircleQuestion, 'Frases', (valor('frases') || []).length, `${Object.keys(valor('adivinhas') || {}).length} personagens com pistas`],
    ['situacoes', HeartHandshake, 'Situações', (valor('situacoes') || []).length, '5 por jogo'],
    ['musicas', Music, 'Músicas', mus.length, `${mus.filter((m) => m.src).length} com ficheiro`],
  ];
  function limparLocal() {
    try { Object.keys(localStorage).filter((k) => /^(ami-feito|rec-|fac-|part-niv|ami-reset)/.test(k)).forEach((k) => localStorage.removeItem(k)); } catch {}
  }
  async function reporTodos() {
    if (!(await confirmar({ titulo: 'Repor todo o progresso', texto: 'Estrelas, livros lidos, recordes dos jogos, factos lidos e nível da partilha voltam a zero em todos os telemóveis, da próxima vez que a app abrir. Não dá para desfazer.', confirmar: 'Repor progresso', perigo: true }))) return;
    setARepor(true);
    try {
      const t = new Date().toISOString();
      await api('/api/admin/conteudo', { method: 'PUT', body: JSON.stringify({ seccao: 'reset', valor: t }) });
      limparLocal(); aoRepor(t);
      avisar('Feito. Cada telemóvel volta ao início quando abrir a app.');
    } catch (e) { avisar(e.message, 'erro'); }
    setARepor(false);
  }
  return (
    <>
      <div className="cab"><div><h1>Resumo</h1><p>Tudo o que a app mostra à Francisca. Escolhe uma secção para editar; as alterações só chegam à app quando carregas em Guardar.</p></div>
        <div className="acoes"><a className="btn btn-sec" href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} />Abrir a app</a></div></div>
      <div className="kpis">
        {kpis.map(([id, I, t, n, s]) => (
          <button key={id} className="cartao kpi" onClick={() => irPara(id)}>
            <span className="t"><I size={15} />{t}</span><b>{n}</b><small>{s}</small>
          </button>
        ))}
      </div>
      <div className="duas-col">
        <div className="cartao">
          <div className="cartao-cab"><RotateCcw size={16} /><h2>Progresso da Francisca</h2></div>
          <div className="cartao-corpo">
            <p style={{ color: 'var(--body)' }}>O progresso fica guardado em cada telemóvel: estrelas, livros lidos, recordes, factos lidos e nível da partilha. Repõe-no para testar a app desde o início.</p>
            {c.reset && <p style={{ color: 'var(--mute)', fontSize: 13 }}>Última reposição: {new Date(c.reset).toLocaleString('pt-PT')}</p>}
          </div>
          <div className="cartao-rod">
            <button className="btn btn-sec" onClick={() => { limparLocal(); avisar('Progresso apagado neste browser. Abre a app para começar do zero.'); }}>Só neste browser</button>
            <button className="btn btn-perigo" disabled={aRepor || !estado?.r2} onClick={reporTodos}>{aRepor ? <LoaderCircle size={16} className="gira" /> : <RotateCcw size={16} />}Repor em todos</button>
          </div>
        </div>
        <div className="cartao">
          <div className="cartao-cab"><Info size={16} /><h2>Estado</h2></div>
          <ul className="estado-l">
            <li><span className={'bola ' + (estado?.r2 ? 'ok' : 'nao')} />Armazenamento R2<b>{estado?.r2 ? 'Ligado' : 'Por configurar'}</b></li>
            {estado?.r2 && <li><span className={'bola ' + (estado?.escrita?.ok ? 'ok' : 'nao')} />Gravação no R2<b>{estado?.escrita?.ok ? 'A funcionar' : 'Com erro'}</b></li>}
            <li><span className={'bola ' + (estado?.publico ? 'ok' : 'meio')} />Ficheiros<b>{estado?.publico ? 'Endereço público R2' : 'Servidos pela app'}</b></li>
            <li><span className="bola" />Última alteração<b>{c.atualizado ? new Date(c.atualizado).toLocaleString('pt-PT') : 'Conteúdo inicial'}</b></li>
          </ul>
        </div>
      </div>
    </>
  );
}

/* ---------- Contas ---------- */
function Contas({ avisar, confirmar }) {
  const [lista, setLista] = useState(null);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [aGuardar, setAGuardar] = useState(false);
  const carregar = useCallback(() => api('/api/admin/utilizadores').then(setLista).catch((e) => { setLista([]); avisar(e.message, 'erro'); }), [avisar]);
  useEffect(() => { carregar(); }, [carregar]);
  async function criar(e) {
    e.preventDefault(); setAGuardar(true);
    try { await api('/api/admin/utilizadores', { method: 'POST', body: JSON.stringify({ email, password: pass }) }); setEmail(''); setPass(''); avisar('Conta guardada. Já pode entrar.'); carregar(); }
    catch (er) { avisar(er.message, 'erro'); }
    setAGuardar(false);
  }
  async function apagar(em) {
    if (!(await confirmar({ titulo: 'Apagar conta', texto: `${em} deixa de conseguir entrar no backoffice.`, confirmar: 'Apagar conta', perigo: true }))) return;
    try { await api('/api/admin/utilizadores', { method: 'DELETE', body: JSON.stringify({ email: em }) }); avisar('Conta apagada.'); carregar(); }
    catch (er) { avisar(er.message, 'erro'); }
  }
  return (
    <>
      <div className="cab"><div><h1>Contas</h1><p>Quem pode entrar no backoffice. Não há emails de confirmação: a conta fica ativa logo.</p></div></div>
      <div className="duas-col">
        <div className="tabela-w">
          <table className="tabela">
            <thead><tr><th style={{ width: '100%' }}>Email</th><th>Criada</th><th><span className="sr">Ações</span></th></tr></thead>
            <tbody>
              {!lista ? <tr><td colSpan={3}><div className="esqueleto" style={{ height: 20 }} /></td></tr> : lista.map((u) => (
                <tr key={u.email}>
                  <td><span style={{ fontWeight: 500 }}>{u.email}</span> {u.eu && <span className="etq azul">tu</span>}</td>
                  <td className="min num">{u.criado ? new Date(u.criado).toLocaleDateString('pt-PT') : ''}</td>
                  <td className="min">{!u.eu && <button className="btn-ic perigo" onClick={() => apagar(u.email)} aria-label={'Apagar ' + u.email}><X size={15} /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form className="cartao" onSubmit={criar}>
          <div className="cartao-cab"><KeyRound size={16} /><h2>Nova conta ou nova password</h2></div>
          <div className="cartao-corpo">
            <Campo label="Email" id="n-email"><input id="n-email" type="email" autoComplete="off" spellCheck="false" value={email} onChange={(e) => setEmail(e.target.value)} required /></Campo>
            <Campo label="Password" id="n-pass" ajuda="Mínimo 8 caracteres. Se o email já existir, a password é substituída."><input id="n-pass" type="password" autoComplete="new-password" minLength={8} value={pass} onChange={(e) => setPass(e.target.value)} required /></Campo>
          </div>
          <div className="cartao-rod"><button className="btn btn-pri" disabled={aGuardar}>{aGuardar && <LoaderCircle size={16} className="gira" />}Guardar conta</button></div>
        </form>
      </div>
    </>
  );
}
